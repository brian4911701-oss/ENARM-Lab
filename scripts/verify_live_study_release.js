'use strict';
// Explicit production smoke test: one disposable UID, never existing user data.
// Run only after the coordinated deployment, with --run-disposable-account.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const admin = require('firebase-admin');
(async () => {
    assert.ok(process.argv.includes('--run-disposable-account'), 'Requires --run-disposable-account; creates and deletes one test account.');
    assert.ok(!process.env.FIRESTORE_EMULATOR_HOST && !process.env.FIREBASE_AUTH_EMULATOR_HOST, 'Production smoke test only.');
    const credentialFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const credential = credentialFile ? admin.credential.cert(JSON.parse(fs.readFileSync(credentialFile, 'utf8'))) : admin.credential.applicationDefault();
    admin.initializeApp({ projectId: 'enarm-lab-social', credential });
    const auth = admin.auth(), db = admin.firestore(), uid = 'release-sync-' + crypto.randomUUID();
    const cleanupFile = path.resolve(__dirname, '..', '.tmp-config', 'last-study-release-check.json');
    fs.mkdirSync(path.dirname(cleanupFile), { recursive: true });
    fs.writeFileSync(cleanupFile, JSON.stringify({ uid, completed: false }));
    const redeem = async token => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyA-ALVpht1Za682OUGvH6QWaudCJZYihFU', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, returnSecureToken: true })
        });
        const data = await response.json(); assert.ok(response.ok && data.idToken, 'Disposable sign-in must succeed'); return data.idToken;
    };
    const post = async (endpoint, token, body, expected = 200) => {
        const response = await fetch('https://www.enarmax.com/api/' + endpoint, { method: 'POST', headers: {
            'Content-Type': 'application/json', Authorization: 'Bearer ' + token
        }, body: JSON.stringify(body) });
        const result = await response.json(); assert.equal(response.status, expected, endpoint + ': ' + (result.code || response.status)); return result;
    };
    let created = false, passed = false;
    try {
        await auth.createUser({ uid, email: uid + '@example.invalid', emailVerified: true, displayName: 'ReleaseSyncTest' }); created = true;
        const loginToken = await redeem(await auth.createCustomToken(uid));
        const first = await post('account-session', loginToken, { action: 'open', deviceId: crypto.randomUUID() });
        assert.ok(first.sid && first.token);
        const pc = await redeem(first.token);
        await post('study-sync', pc, { action: 'register' });
        const source = require('../questions')[0], question = source.questions ? { ...source, ...source.questions[0] } : source;
        const started = await post('study-sync', pc, { action: 'start', examId: crypto.randomUUID(), questionSet: [question], mode: 'simulacro' });
        const examId = started.exam.id;
        await post('study-sync', pc, { action: 'events', examId, events: [{ actor: 'release-writer-001', kind: 'answer', sequence: 1, index: 0, selected: 1 }] });
        const deviceId = crypto.randomUUID();
        const conflict = await post('account-session', loginToken, { action: 'open', deviceId });
        assert.equal(conflict.conflict, true);
        await post('account-session', pc, { action: 'check' }); // Cancellation leaves the original untouched.
        const second = await post('account-session', loginToken, { action: 'open', deviceId, expectedRevision: conflict.revision });
        const phone = await redeem(second.token);
        const resumed = await post('study-sync', phone, { action: 'inspect' });
        assert.equal(resumed.exam.id, examId); assert.equal(resumed.exam.answers[0].selected, 1);
        assert.equal((await post('study-sync', pc, { action: 'events', examId, events: [] }, 403)).code, 'session-replaced');
        assert.equal((await post('account-session', pc, { action: 'open', deviceId }, 401)).code, 'explicit-login-required');
        const progressUrl = 'https://firestore.googleapis.com/v1/projects/enarm-lab-social/databases/(default)/documents/user_progress/' + uid;
        assert.equal((await fetch(progressUrl, { headers: { Authorization: 'Bearer ' + pc } })).status, 403);
        assert.equal((await fetch(progressUrl, { headers: { Authorization: 'Bearer ' + phone } })).status, 200);
        await post('study-sync', phone, { action: 'finish', examId, events: [] });
        await post('study-sync', phone, { action: 'finish', examId, events: [] });
        assert.equal(JSON.parse((await db.doc('user_progress/' + uid).get()).data().globalStatsStr).sesiones, 1);
        assert.equal((await db.collection('exam_attempts/' + uid + '/items').get()).size, 1);
        await post('account-session', phone, { action: 'logout' });
        assert.equal((await db.doc('account_sessions/' + uid).get()).data().sid, null);
        passed = true;
        console.log(JSON.stringify({ singleAccountSession: true, confirmation: true, confirmedAnswersPreserved: true, oldApiRejected: true, oldFirestoreRejected: true, immutableAttempt: true, manualLogout: true }));
    } finally {
        assert.ok(uid.startsWith('release-sync-'));
        if (created) await auth.deleteUser(uid);
        for (const name of ['user_progress', 'active_exams', 'exam_payloads', 'exam_attempts', 'study_backups', 'study_devices', 'study_sessions', 'user_directory', 'account_sessions', 'account_presence']) await db.recursiveDelete(db.doc(name + '/' + uid));
        fs.writeFileSync(cleanupFile, JSON.stringify({ uid, completed: passed, cleanupSucceeded: true, checkedAt: new Date().toISOString() }));
        console.log(JSON.stringify({ disposableAccountRemoved: true }));
        await db.terminate(); await admin.app().delete();
    }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
