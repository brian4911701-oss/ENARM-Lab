'use strict';
// Explicit release smoke test. Uses one disposable account and cleans only its UID.
// Never logs ID tokens, installation secrets or private exam control credentials.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const admin = require('firebase-admin');
(async () => {
    assert.ok(process.argv.includes('--run-disposable-account'), 'Requires --run-disposable-account; creates and then deletes one release test account.');
    assert.ok(!process.env.FIRESTORE_EMULATOR_HOST && !process.env.FIREBASE_AUTH_EMULATOR_HOST, 'This is a production release check, not an emulator test.');
    admin.initializeApp({ projectId: 'enarm-lab-social' });
    const auth = admin.auth(), db = admin.firestore();
    const uid = 'release-sync-' + crypto.randomUUID();
    const cleanupFile = path.resolve(__dirname, '..', '.tmp-config', 'last-study-release-check.json');
    fs.writeFileSync(cleanupFile, JSON.stringify({ uid, completed: false }));
    let userCreated = false, cleanupSucceeded = false;
    try {
        await auth.createUser({ uid, email: `${uid}@example.invalid`, emailVerified: true, displayName: 'ReleaseSyncTest' }); userCreated = true;
        const customToken = await auth.createCustomToken(uid);
        const tokenResponse = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyA-ALVpht1Za682OUGvH6QWaudCJZYihFU', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: customToken, returnSecureToken: true }) });
        const tokenData = await tokenResponse.json();
        assert.ok(tokenResponse.ok && tokenData.idToken, 'Disposable sign-in must succeed');
        const devices = [0, 1, 2].map(() => ({ id: crypto.randomUUID(), secret: crypto.randomUUID() + crypto.randomUUID(), tabId: crypto.randomUUID() }));
        const call = async (i, action, data = {}, expected = 200) => {
            const { tabId, ...device } = devices[i];
            const response = await fetch('https://www.enarmax.com/api/study-sync', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tokenData.idToken }, body: JSON.stringify({ action, device, tabId, ...data }) });
            const result = await response.json();
            assert.equal(response.status, expected, `Live ${action}: ${result.code || response.status}`);
            return result;
        };
        await call(0, 'register'); await call(1, 'register');
        assert.equal((await call(2, 'register', {}, 403)).code, 'device-limit');
        const source = require('../questions')[0];
        const question = source.questions ? { ...source, ...source.questions[0] } : source;
        const started = await call(0, 'start', { examId: crypto.randomUUID(), questionSet: [question], mode: 'simulacro' });
        await call(0, 'events', { examId: started.exam.id, fence: started.exam.fence, controlToken: started.controlToken, events: [{ kind: 'answer', sequence: 1, index: 0, selected: 1 }] });
        const phone = await call(1, 'claim', { examId: started.exam.id });
        assert.equal(phone.exam.answers[0].selected, 1);
        assert.equal((await call(0, 'events', { examId: started.exam.id, fence: started.exam.fence, controlToken: started.controlToken, events: [{ kind: 'answer', sequence: 2, index: 0, selected: 0 }] }, 409)).code, 'ownership-lost');
        const finish = { examId: phone.exam.id, fence: phone.exam.fence, controlToken: phone.controlToken, events: [] };
        await call(1, 'finish', finish); await call(1, 'finish', finish);
        const progress = (await db.doc(`user_progress/${uid}`).get()).data();
        assert.equal(progress.syncVersion, 3);
        assert.equal(JSON.parse(progress.globalStatsStr).sesiones, 1);
        assert.equal((await db.collection(`exam_attempts/${uid}/items`).get()).size, 1);
        await call(0, 'revoke', { deviceId: devices[1].id });
        assert.equal((await call(1, 'register', {}, 403)).code, 'device-revoked');
        await call(0, 'purge');
        console.log(JSON.stringify({ liveApi: true, deviceLimit: true, confirmedHandoff: true, staleTokenRejected: true, immutableAttempt: true, exactlyOneSession: true, revocation: true }));
    } finally {
        // Auth create may provision a directory document asynchronously. Only
        // this generated UID is touched by cleanup; no existing user's data.
        if (userCreated) await auth.deleteUser(uid);
        for (const collection of ['user_progress', 'active_exams', 'exam_payloads', 'exam_attempts', 'study_backups', 'study_devices', 'study_sessions', 'user_directory']) await db.recursiveDelete(db.doc(`${collection}/${uid}`));
        cleanupSucceeded = true;
        fs.writeFileSync(cleanupFile, JSON.stringify({ uid, completed: true, cleanupSucceeded, checkedAt: new Date().toISOString() }));
        console.log(JSON.stringify({ disposableAccountRemoved: cleanupSucceeded }));
        await db.terminate(); await admin.app().delete();
    }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
