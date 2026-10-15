const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { initializeTestEnvironment, assertFails } = require('@firebase/rules-unit-testing');
const firestore = require('firebase/firestore');
const { session, memory, remote, user } = require('../scripts/test_progress_persistence');

const waitFor = async predicate => {
    const deadline = Date.now() + 20000;
    while (!await predicate()) {
        if (Date.now() > deadline) throw new Error('Device synchronization timed out');
        await new Promise(resolve => setTimeout(resolve, 30));
    }
};
const addExam = (device, id, count) => {
    device.State.globalStats.sesiones++;
    device.State.globalStats.respondidas += count;
    device.State.globalStats.aciertos += count;
    device.State.history.push({ id, timestamp: Date.now(), preguntas: count, correct: count, wrong: 0, blank: 0 });
    const day = '2026-10-15';
    const previous = device.State.studyCalendar[day] || {};
    device.State.studyCalendar[day] = { ...previous, sessions: (previous.sessions || 0) + 1, practiced: true };
};

test('real SDK and rules: concurrent devices, offline reconnection, live snapshots and legacy rejection', { timeout: 60000 }, async () => {
    const env = await initializeTestEnvironment({
        projectId: 'enarmax-rules-test',
        firestore: { rules: fs.readFileSync(path.resolve(__dirname, '..', 'firestore.rules'), 'utf8') }
    });
    const devices = [];
    try {
        await env.clearFirestore();
        await env.withSecurityRulesDisabled(async context => {
            await firestore.setDoc(firestore.doc(context.firestore(), 'user_progress', user.uid), {
                ...remote, uid: user.uid, schemaVersion: 1, createdAt: firestore.serverTimestamp(), updatedAt: firestore.serverTimestamp()
            });
        });
        for (let i = 0; i < 2; i++) {
            const device = session(memory());
            device.context.console = console;
            Object.assign(device.window.FB, firestore, {
                auth: { currentUser: { ...user } },
                db: env.authenticatedContext(user.uid, { email: 'same-user@example.test', email_verified: true }).firestore(),
                // The app is evaluated in node:vm. Rehome the top-level payload
                // into the SDK realm; FieldValue instances remain untouched.
                runTransaction: (db, callback) => firestore.runTransaction(db, transaction => callback({
                    get: ref => transaction.get(ref),
                    set: (ref, data, flags) => transaction.set(ref, Object.assign({}, data), { merge: flags?.merge === true })
                }))
            });
            devices.push(device);
        }
        const [computer, phone] = devices;
        await Promise.all(devices.map(device => device.api.restoreAuthenticatedProgress(user)));
        addExam(computer, 'real-computer-exam', 10);
        addExam(phone, 'real-phone-exam', 5);
        computer.State.theme = 'forest';
        computer.api.saveGlobalStats(); phone.api.saveGlobalStats();
        await waitFor(() => devices.every(device => device.State.globalStats.respondidas === 35 && !device.api.progressOutbox.read(user.uid)?.pending));
        assert.equal(computer.State.history.length, 2);
        assert.equal(phone.State.history.length, 2);
        assert.equal(phone.State.theme, 'forest');

        await firestore.disableNetwork(phone.window.FB.db);
        addExam(phone, 'real-offline-phone-exam', 3);
        phone.api.saveGlobalStats({ deferRemote: true });
        addExam(computer, 'real-second-computer-exam', 7);
        computer.State.theme = 'sunset';
        computer.api.saveGlobalStats();
        await waitFor(() => !computer.api.progressOutbox.read(user.uid)?.pending);
        await firestore.enableNetwork(phone.window.FB.db);
        await phone.api.flushPendingProgress();
        await waitFor(() => devices.every(device => device.State.globalStats.respondidas === 45 && device.State.theme === 'sunset' && !device.api.progressOutbox.read(user.uid)?.pending));
        assert.equal(phone.State.globalStats.sesiones, 6);
        assert.equal(phone.State.history.length, 4);

        const progressRef = firestore.doc(computer.window.FB.db, 'user_progress', user.uid);
        const stored = (await firestore.getDocFromServer(progressRef)).data();
        assert.equal(stored.syncVersion, 2);
        assert(stored.syncRevision >= 3);
        assert.equal(JSON.parse(stored.globalStatsStr).respondidas, 45);
        await assertFails(firestore.setDoc(progressRef, { historyStr: '[]', updatedAt: firestore.serverTimestamp() }, { merge: true }));
    } finally {
        devices.forEach(device => device.State.progressUnsub?.());
        await env.cleanup();
    }
});
