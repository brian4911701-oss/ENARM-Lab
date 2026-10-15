// Durable, account-scoped progress outbox. A cloud acknowledgement may only
// clear the exact revision it saved, never a newer change made while offline.
(function (root) {
    const compactHistory = (history, maxBytes = 500000) => {
        const bytes = value => new TextEncoder().encode(JSON.stringify(value)).length;
        const entries = (history || []).map(session => {
            const { questionSet, answers, ...summary } = session;
            // Flattened cases also carried the original questions array. It is
            // redundant with the question and answer shown during review.
            const details = Array.isArray(questionSet) && Array.isArray(answers)
                ? { ...summary, questionSet: questionSet.map(({ questions, ...question }) => question), answers }
                : summary;
            return { summary, details };
        });
        const result = entries.map(entry => entry.summary);
        let remaining = maxBytes - bytes(result);
        for (let i = entries.length - 1; i >= 0; i--) {
            const extra = bytes(entries[i].details) - bytes(entries[i].summary);
            if (extra <= remaining) {
                result[i] = entries[i].details;
                remaining -= extra;
            }
        }
        // Session summaries and scores always survive. Detailed review of the
        // newest sessions uses the remaining space below Firestore's document limit.
        return result;
    };
    const create = (storage) => {
        const key = uid => `enarm_progress_backup:${uid}`;
        const read = uid => {
            if (!uid) return null;
            try {
                const record = JSON.parse(storage.getItem(key(uid)) || "null");
                return record?.uid === uid && record.data && typeof record.data === "object"
                    && !Array.isArray(record.data) ? record : null;
            } catch (error) {
                console.warn("No se pudo leer el respaldo local de progreso.", error);
                return null;
            }
        };
        const stage = (uid, data) => {
            if (!uid) return null;
            const record = {
                uid, revision: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                pending: true, data
            };
            // Serialize now: subsequent mutations of State must not change a revision.
            storage.setItem(key(uid), JSON.stringify(record));
            return read(uid);
        };
        const acknowledge = (uid, revision) => {
            const record = read(uid);
            if (!record || record.revision !== revision) return false;
            record.pending = false;
            storage.setItem(key(uid), JSON.stringify(record));
            return true;
        };
        const restore = (uid, remote, remoteAvailable) => {
            const record = read(uid);
            return record && (record.pending || !remoteAvailable)
                ? { ...remote, ...record.data } : remote;
        };
        const forget = uid => storage.removeItem(key(uid));
        return { read, stage, acknowledge, restore, forget };
    };
    if (typeof module === "object" && module.exports) module.exports = { create, compactHistory };
    else root.ENARMProgressSync = { create, compactHistory };
})(typeof window !== "undefined" ? window : globalThis);
