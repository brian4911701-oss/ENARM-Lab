// Small optimistic transaction simulator shared by Node and browser tests.
// Every retry reruns the actual application callback against a fresh snapshot.
function createTestCloud(initial, options = {}) {
    let version = 0;
    const docs = new Map(Object.entries(initial || {}));
    const listeners = new Map();
    const writes = [];
    const snapshot = value => ({ exists: () => value !== undefined, data: () => structuredClone(value), metadata: { fromCache: false, hasPendingWrites: false } });
    const get = async ref => {
        if (options.readFails) throw new Error('unavailable');
        return snapshot(docs.get(ref.path));
    };
    const runTransaction = async (_db, callback) => {
        for (let attempt = 0; attempt < 20; attempt++) {
            const readVersion = version;
            const before = new Map([...docs].map(([key, value]) => [key, structuredClone(value)]));
            const pending = [];
            const result = await callback({
                get: async ref => snapshot(before.get(ref.path)),
                set: (ref, data, flags) => pending.push({ ref, data, flags })
            });
            if (options.beforeCommit) await options.beforeCommit();
            if (options.writeFails) throw new Error('unavailable');
            if (readVersion !== version) continue;
            if (pending.length) {
                for (const { ref, data, flags } of pending) {
                    const current = docs.get(ref.path);
                    if (ref.path.split('/').length === 2 && current && 'createdAt' in data && current.createdAt !== data.createdAt) throw new Error('permission-denied: immutable createdAt');
                    docs.set(ref.path, flags?.merge ? { ...current, ...structuredClone(data) } : structuredClone(data));
                    writes.push({ path: ref.path, data: structuredClone(data) });
                }
                version++;
                for (const { ref } of pending) for (const listener of listeners.get(ref.path) || []) queueMicrotask(() => listener(snapshot(docs.get(ref.path))));
            }
            return result;
        }
        throw new Error('transaction retry limit');
    };
    const onSnapshot = (ref, listener) => {
        if (!listeners.has(ref.path)) listeners.set(ref.path, new Set());
        listeners.get(ref.path).add(listener);
        queueMicrotask(() => listener(snapshot(docs.get(ref.path))));
        return () => listeners.get(ref.path).delete(listener);
    };
    return { get, runTransaction, onSnapshot, writes, read: path => structuredClone(docs.get(path)), options };
}
module.exports = { createTestCloud };
