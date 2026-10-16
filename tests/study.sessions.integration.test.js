'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { before, beforeEach, after, test } = require('node:test');
const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const { doc, getDoc, setDoc, deleteDoc, serverTimestamp } = require('firebase/firestore');
const admin = require('firebase-admin');
const { createAccountSessions, LEASE_MS } = require('../server/account-session');
const { createStudyService, aggregate, publicTotals, applyEvents } = require('../server/study-service');
const { create } = require('../study-session');
const projectId = 'enarmax-rules-test';
let env, app, db, execute, sessions, clock;
const uid = 'student';
const q = { question: 'Caso de prueba', options: ['A', 'B', 'C'], answerIndex: 1, specialty: 'mi', tema: 'Cardiología', case: 'Paciente de prueba' };
const fresh = () => ({ uid, auth_time: clock / 1000 });
const open = (i, extra = {}) => sessions(fresh(), { action: 'open', deviceId: `browser-installation-${i}-0001`, ...extra });
const claims = result => ({ uid, enarmaxSid: result.sid });
const call = (credential, action, extra = {}) => execute(uid, { action, ...extra }, credential);
const event = (sequence, index, selected = 1, actor = 'test-writer-00001') => ({ kind: 'answer', actor, sequence, index, selected });
const start = (credential, count = 40) => call(credential, 'start', { examId: 'exam-single-session-001', questionSet: Array.from({ length: count }, () => q), mode: 'simulacro' });
const memory = () => {
    const m = new Map();
    return { get length() { return m.size; }, key: i => [...m.keys()][i], getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k) };
};
before(async () => {
    assert.ok(process.env.FIRESTORE_EMULATOR_HOST, 'Local emulator is required');
    env = await initializeTestEnvironment({ projectId, firestore: { rules: fs.readFileSync('firestore.rules', 'utf8') } });
    app = admin.initializeApp({ projectId }, 'single-session-tests'); db = app.firestore();
});
beforeEach(async () => {
    await env.clearFirestore(); clock = Date.parse('2026-10-15T18:00:00Z');
    sessions = createAccountSessions(db, { createCustomToken: async (_, custom) => JSON.stringify(custom) }, { now: () => clock });
    execute = createStudyService(db, { bank: [q], now: () => clock });
});
after(async () => { await db.terminate(); await app.delete(); await env.cleanup(); });
test('normal login, cancellation leaves the first device unchanged, replacement rejects saved credentials', async () => {
    const pc = claims(await open(1));
    await call(pc, 'register');
    const conflict = await open(2);
    assert.equal(conflict.conflict, true);
    assert.equal((await db.doc(`account_sessions/${uid}`).get()).data().sid, pc.enarmaxSid);
    await sessions(pc, { action: 'check' }); // Cancelling performs no server mutation.
    const phone = claims(await open(2, { expectedRevision: conflict.revision }));
    await assert.rejects(call(pc, 'register'), { code: 'session-replaced' });
    await assert.rejects(sessions(pc, { action: 'check' }), { code: 'session-replaced' });
    await assert.rejects(sessions(pc, { action: 'open' }), { code: 'explicit-login-required' });
    await assert.rejects(sessions(pc, { action: 'logout' }), { code: 'session-replaced' });
    assert.equal((await sessions(phone, { action: 'check' })).valid, true);
});
test('35 confirmed answers survive replacement; previous device cannot mutate or finish; exactly one attempt', async () => {
    const pc = claims(await open(1)); await call(pc, 'register'); const initial = await start(pc);
    const examId = initial.exam.id;
    await call(pc, 'events', { examId, events: Array.from({ length: 35 }, (_, i) => event(i + 1, i)) });
    const conflict = await open(2), phone = claims(await open(2, { expectedRevision: conflict.revision }));
    for (const action of ['events', 'finish', 'progress', 'reset', 'purge', 'migration-complete', 'start']) {
        await assert.rejects(call(pc, action, { examId, events: [event(36, 35)] }), { code: 'session-replaced' });
    }
    const resumed = await start(phone);
    assert.equal(resumed.exam.id, examId);
    assert.equal(resumed.exam.answers.filter(a => a.selected === 1).length, 35);
    await call(phone, 'finish', { examId }); await call(phone, 'finish', { examId });
    assert.equal((await db.collection(`exam_attempts/${uid}/items`).get()).size, 1);
    const stats = JSON.parse((await db.doc(`user_progress/${uid}`).get()).data().globalStatsStr);
    assert.equal(stats.respondidas, 35); assert.equal(stats.sesiones, 1);
});
test('atomic initial logins and atomic confirmations each authorize only one winner', async () => {
    const initial = await Promise.all([open(1), open(2)]);
    assert.equal(initial.filter(r => r.sid).length, 1);
    assert.equal(initial.filter(r => r.conflict).length, 1);
    const revision = initial.find(r => r.conflict).revision;
    const race = await Promise.allSettled([open(2, { expectedRevision: revision }), open(3, { expectedRevision: revision })]);
    assert.equal(race.filter(r => r.status === 'fulfilled').length, 1);
    assert.equal(race.find(r => r.status === 'rejected').reason.code, 'session-changed');
});
test('brief outage, abandoned browser expiry, same-device renewal and manual logout', async () => {
    const pc = claims(await open(1));
    clock += 60000; await sessions(pc, { action: 'check' });
    assert.equal((await open(2)).conflict, true);
    clock += LEASE_MS + 1;
    await sessions(pc, { action: 'check' }); // A returning valid browser can renew, no forced logout.
    assert.equal((await open(2)).conflict, true);
    clock += LEASE_MS + 1;
    const phone = claims(await open(2)); // Abandoned lease needs no confirmation.
    await assert.rejects(sessions(pc, { action: 'check' }), { code: 'session-replaced' });
    await sessions(phone, { action: 'logout' });
    assert.ok((await open(3)).sid);
    await assert.rejects(sessions({ uid, auth_time: clock / 1000 - 301 }, { action: 'open' }), { code: 'recent-login-required' });
});
test('Firestore denies revoked and ordinary Auth tokens, including legacy progress and account writes', async () => {
    const pc = claims(await open(1)); await call(pc, 'register'); await start(pc);
    const old = env.authenticatedContext(uid, { email_verified: true, enarmaxSid: pc.enarmaxSid }).firestore();
    await assertSucceeds(getDoc(doc(old, 'active_exams', uid)));
    const conflict = await open(2), phone = claims(await open(2, { expectedRevision: conflict.revision }));
    const current = env.authenticatedContext(uid, { email_verified: true, enarmaxSid: phone.enarmaxSid }).firestore();
    const raw = env.authenticatedContext(uid, { email_verified: true }).firestore();
    for (const client of [old, raw]) {
        await assertFails(getDoc(doc(client, 'active_exams', uid)));
        await assertFails(setDoc(doc(client, 'user_directory', uid), { username: 'Intruso' }, { merge: true }));
        await assertFails(setDoc(doc(client, 'user_progress', uid), { syncRevision: 99 }, { merge: true }));
        await assertFails(deleteDoc(doc(client, 'user_progress', uid)));
        await assertFails(setDoc(doc(client, 'account_sessions', uid), { sid: pc.enarmaxSid }));
        // Authority metadata is readable to detect replacement, but is never a credential.
        await assertSucceeds(getDoc(doc(client, 'account_sessions', uid)));
    }
    await assertSucceeds(getDoc(doc(current, 'active_exams', uid)));
    await assertFails(setDoc(doc(current, 'active_exams', uid), { answers: [] }, { merge: true }));
    await db.doc(`user_progress/${uid}`).set({ syncVersion: 2, syncRevision: 0, uid, schemaVersion: 1 });
    await assertFails(setDoc(doc(old, 'user_progress', uid), { syncRevision: 1, updatedAt: serverTimestamp() }, { merge: true }));
});
test('same-session tabs, reload journal recovery, offline retry, lost ACK and finalization stay idempotent', async () => {
    const credential = claims(await open(1)), storage = memory();
    let offline = false, loseAck = false;
    const options = { storage, sessionId: () => credential.enarmaxSid, listenExam: () => () => {},
        send: async body => {
            if (offline) throw Object.assign(new Error('offline'), { code: 'offline' });
            const result = await execute(uid, body, credential);
            if (loseAck && ['events', 'finish'].includes(body.action)) { loseAck = false; throw Object.assign(new Error('offline'), { code: 'offline' }); }
            return result;
        }
    };
    const first = create(options), second = create(options);
    let reopened;
    try {
        await first.boot(uid); await first.start({ examId: 'exam-single-session-001', questionSet: [q, q] });
        await second.boot(uid); assert.ok(first.owns() && second.owns());
        first.queue({ kind: 'answer', index: 0, selected: 1 });
        second.queue({ kind: 'answer', index: 1, selected: 1 });
        await Promise.all([first.flush(), second.flush()]);
        first.queue({ kind: 'flag', index: 0, flagged: true }); loseAck = true; await first.flush(); await first.flush();
        offline = true; first.queue({ kind: 'position', index: 1 }); await first.flush(); first.stop(); second.stop();
        offline = false; reopened = create(options); await reopened.boot(uid);
        assert.equal(reopened.active.currentIndex, 1); assert.equal(reopened.active.answers.filter(a => a.selected === 1).length, 2);
        loseAck = true; await reopened.flush(true).catch(() => {}); await reopened.flush();
        assert.equal((await db.collection(`exam_attempts/${uid}/items`).get()).size, 1);
        assert.equal(JSON.parse((await db.doc(`user_progress/${uid}`).get()).data().globalStatsStr).sesiones, 1);
        await reopened.start({ examId: 'exam-next-session-0002', questionSet: [q] });
        reopened.queue({ kind: 'answer', index: 0, selected: 1 }); await reopened.flush();
        assert.equal(reopened.active.answers[0].selected, 1);
    } finally { first.stop(); second.stop(); reopened?.stop(); }
});
test('offline journal from a replaced session is rejected and never replayed by the next session', async () => {
    let credential = claims(await open(1)); const storage = memory();
    const options = { storage, sessionId: () => credential.enarmaxSid, send: body => execute(uid, body, credential), listenExam: () => () => {} };
    const old = create(options); await old.boot(uid); await old.start({ examId: 'exam-single-session-001', questionSet: [q] });
    old.queue({ kind: 'answer', index: 0, selected: 1 }); old.stop();
    const conflict = await open(2); credential = claims(await open(2, { expectedRevision: conflict.revision }));
    const current = create(options);
    try { await current.boot(uid); assert.equal(current.active.answers[0].selected, null); assert.ok(storage.length > 0); }
    finally { current.stop(); }
});
test('civil-day streak and offline pause durations remain correct', () => {
    const instant = Date.parse('2026-10-16T03:00:00Z');
    const result = aggregate({ globalStatsStr: JSON.stringify({ streakData: { currentStreak: 1, lastStudyDate: '2026-10-14' } }) }, {
        id: 'timezone-exam-0001', questionSet: [q], answers: [{ selected: 1, isCorrect: true }], mode: 'simulacro', currentExamType: 'Prueba',
        timeZone: 'America/Mexico_City', paused: false, elapsedSec: 0, runningSince: instant - 1000
    }, instant);
    assert.equal(publicTotals(result.data, instant, 'America/Mexico_City').publicFlame, 2);
    const offlineClock = applyEvents({ startedAt: 1000, runningSince: 1000, elapsedSec: 0, paused: false }, [
        { actor: 'test-writer-00001', sequence: 1, kind: 'pause', occurredAt: 2000 },
        { actor: 'test-writer-00001', sequence: 2, kind: 'resume', occurredAt: 5000 },
        { actor: 'test-writer-00001', sequence: 3, kind: 'pause', occurredAt: 8000 }
    ], 10000);
    assert.equal(offlineClock.elapsedSec, 4);
});

test('legacy migration preserves confirmed results and archives obsolete local results without device ownership', async () => {
    const credential = claims(await open(1));
    const seed = { uid, schemaVersion: 1, syncVersion: 2, syncRevision: 4, syncEpoch: 'initial',
        globalStatsStr: '{"respondidas":35,"aciertos":30,"sesiones":1}', historyStr: '[{"id":"old-attempt","timestamp":1}]', theme: 'forest', createdAt: new Date(1) };
    await db.doc('user_progress/' + uid).set(seed);
    await db.doc('study_sessions/' + uid).set({ devices: { legacy: { revoked: false } } });
    await call(credential, 'register'); await call(credential, 'register');
    const { makeOperation } = require('../progress-sync');
    const changed = { ...seed, theme: 'sunset', globalStatsStr: '{"respondidas":999,"aciertos":999,"sesiones":999}', historyStr: '[]' };
    const op = makeOperation('migration-actor-0001', 1, seed, changed);
    const result = await call(credential, 'progress', { operations: [op], migration: true });
    assert.deepEqual(JSON.parse(result.data.globalStatsStr), { ...JSON.parse(seed.globalStatsStr), pomodoros: 0 });
    assert.equal(result.data.historyStr, seed.historyStr); assert.equal(result.data.theme, 'sunset');
    assert.equal((await db.collection('user_progress/' + uid + '/legacy_conflicts').get()).size, 1);
    assert.ok((await db.doc('study_backups/' + uid).get()).exists);
    assert.equal((await db.doc('study_sessions/' + uid).get()).data().devices, undefined);
    await call(credential, 'migration-complete');
    await assert.rejects(call(credential, 'progress', { operations: [op], migration: true }), { code: 'migration-closed' });
});
test('an existing exam survives migration without rotating ownership or dropping confirmed answers', async () => {
    const credential = claims(await open(1)); await call(credential, 'register');
    const exam = (await start(credential, 2)).exam;
    await db.doc('active_exams/' + uid).update({ ownerDevice: 'legacy-device', ownerTab: 'legacy-tab', fence: 42, lastSequence: 99 });
    await call(credential, 'events', { examId: exam.id, events: [event(1, 0)] });
    const resumed = (await start(credential)).exam;
    assert.equal(resumed.answers[0].selected, 1);
    assert.equal(resumed.ownerDevice, undefined); assert.equal(resumed.fence, undefined);
});
test('takeover races with an answer atomically; deletion cannot race with a new authorization', async () => {
    const pc = claims(await open(1)); await call(pc, 'register'); const examId = (await start(pc, 2)).exam.id;
    const conflict = await open(2);
    const race = await Promise.allSettled([call(pc, 'events', { examId, events: [event(1, 0)] }), open(2, { expectedRevision: conflict.revision })]);
    assert.equal(race[1].status, 'fulfilled');
    if (race[0].status === 'rejected') assert.equal(race[0].reason.code, 'session-replaced');
    const phone = claims(race[1].value), resumed = (await call(phone, 'inspect')).exam;
    assert.equal(resumed.answers[0].selected, race[0].status === 'fulfilled' ? 1 : null);
    await call(phone, 'purge');
    await assert.rejects(open(3), { code: 'account-deleting' });
});
test('fresh identity proof can renew only the authorized session, without global revocation', async () => {
    const pc = claims(await open(1));
    const api = createAccountSessions(db, {
        verifyIdToken: async token => JSON.parse(token),
        createCustomToken: async (_, custom) => JSON.stringify(custom)
    }, { now: () => clock });
    const proof = JSON.stringify(fresh());
    assert.equal(JSON.parse((await api(pc, { action: 'reauthenticate', reauthenticationToken: proof })).token).enarmaxSid, pc.enarmaxSid);
    const conflict = await open(2); await open(2, { expectedRevision: conflict.revision });
    await assert.rejects(api(pc, { action: 'reauthenticate', reauthenticationToken: proof }), { code: 'session-replaced' });
});

test('stale same-browser study answers are acknowledged without overwriting the confirmed answer or retrying forever', async () => {
    const credential = claims(await open(1)); await call(credential, 'register');
    const exam = (await call(credential, 'start', { examId: 'study-same-tabs-001', questionSet: [q], mode: 'estudio' })).exam;
    await call(credential, 'events', { examId: exam.id, events: [event(1, 0, 1, 'browser-tab-writer-001')] });
    const result = await call(credential, 'events', { examId: exam.id, events: [event(1, 0, 0, 'browser-tab-writer-002')] });
    assert.equal(result.exam.answers[0].selected, 1);
    assert.equal(result.exam.eventHeads['browser-tab-writer-002'], 1);
});
