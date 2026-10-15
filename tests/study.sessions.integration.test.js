'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { before, beforeEach, after, test } = require('node:test');
const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const { doc, getDoc, setDoc, deleteDoc, serverTimestamp } = require('firebase/firestore');
const admin = require('firebase-admin');
const { createStudyService, aggregate, publicTotals, applyEvents } = require('../server/study-service');
const { create } = require('../study-session');
const { makeOperation } = require('../progress-sync');
const projectId = 'enarmax-rules-test';
let env, db, execute, adminApp;
const q = { question: 'Caso clínico de prueba', options: ['A', 'B', 'C'], answerIndex: 1, specialty: 'mi', tema: 'Cardiología', difficulty: 'medium', case: 'Paciente de prueba' };
const device = i => ({ id: `installation-${i}`, secret: `installation-secret-${i}-long` });
const call = (i, action, data = {}) => execute('student', { action, device: device(i), tabId: `browser-tab-${i}`, ...data });
const start = i => call(i, 'start', { examId: 'exam-unique-00001', questionSet: [q, { ...q, caseGroupId: 2 }], mode: 'simulacro' });
const owned = result => ({ examId: result.exam.id, fence: result.exam.fence, controlToken: result.controlToken });
const event = (sequence, index, selected) => ({ kind: 'answer', sequence, index, selected });
const memory = () => {
    const m = new Map();
    return { get length() { return m.size; }, key: i => [...m.keys()][i], getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k) };
};
before(async () => {
    env = await initializeTestEnvironment({ projectId, firestore: { rules: fs.readFileSync('firestore.rules', 'utf8') } });
    adminApp = admin.initializeApp({ projectId }, 'study-tests'); db = adminApp.firestore();
    execute = createStudyService(db, { bank: [q], now: () => Date.parse('2026-10-15T18:00:00Z') });
});
beforeEach(async () => { await env.clearFirestore(); });
after(async () => { await db.terminate(); await adminApp.delete(); await env.cleanup(); });
test('el límite de dos instalaciones se aplica incluso con tres registros simultáneos', async () => {
    const results = await Promise.allSettled([1, 2, 3].map(i => call(i, 'register')));
    assert.equal(results.filter(r => r.status === 'fulfilled').length, 2);
    assert.equal(results.find(r => r.status === 'rejected').reason.code, 'device-limit');
});
test('transferencia PC a móvil, tokens atrasados, pestaña nueva y finalización sin duplicados', async () => {
    await call(1, 'register'); await call(2, 'register');
    const pc = await start(1);
    await call(1, 'events', { ...owned(pc), events: [event(1, 0, 1)] });
    const phone = await call(2, 'claim', { examId: pc.exam.id });
    assert.equal(phone.exam.answers[0].selected, 1);
    await assert.rejects(call(1, 'events', { ...owned(pc), events: [event(2, 1, 0)] }), { code: 'ownership-lost' });
    // Knowing the public fence and same installation secret does not reveal the new private control token.
    const tab2 = await call(2, 'claim', { examId: pc.exam.id, tabId: 'second-tab-0002' });
    await assert.rejects(call(2, 'events', { ...owned(tab2), controlToken: phone.controlToken, tabId: 'second-tab-0002', events: [event(1, 1, 1)] }), { code: 'ownership-lost' });
    const payload = { ...owned(tab2), tabId: 'second-tab-0002', events: [event(1, 1, 1)] };
    const final = await call(2, 'finish', payload);
    const retry = await call(2, 'finish', payload);
    assert.equal(retry.attempt.id, final.attempt.id);
    assert.equal(final.attempt.correct, 2);
    const progress = (await db.doc('user_progress/student').get()).data();
    assert.equal(JSON.parse(progress.globalStatsStr).sesiones, 1);
    assert.equal(JSON.parse(progress.globalStatsStr).respondidas, 2);
    assert.equal((await db.collection('exam_attempts/student/items').get()).size, 1);
    const reset = await call(2, 'reset', { tabId: 'second-tab-0002' });
    assert.equal(JSON.parse(reset.data.globalStatsStr).sesiones, 0);
    assert.equal((await db.collection('exam_attempts/student/items').get()).size, 1);
});
test('revocar un dispositivo invalida escrituras; reautorizar no elude el límite', async () => {
    await call(1, 'register'); await call(2, 'register'); const pc = await start(1);
    await call(2, 'revoke', { deviceId: device(1).id });
    await assert.rejects(call(1, 'events', { ...owned(pc), events: [event(1, 0, 1)] }), { code: 'device-revoked' });
    await assert.rejects(call(1, 'register'), { code: 'device-revoked' });
    await call(3, 'register');
    await assert.rejects(call(4, 'register'), { code: 'device-limit' });
});
test('dos inicios simultáneos y finalizar durante una transferencia conservan un único intento', async () => {
    await call(1, 'register'); await call(2, 'register');
    const starts = await Promise.all([start(1), call(2, 'start', { examId: 'another-exam-00002', questionSet: [q] })]);
    assert.equal(starts[0].exam.id, starts[1].exam.id);
    const pc = await call(1, 'claim', { examId: starts[0].exam.id });
    const race = await Promise.allSettled([call(1, 'finish', { ...owned(pc), events: [event(1, 0, 1)] }), call(2, 'claim', { examId: pc.exam.id })]);
    if (race[0].status === 'rejected') {
        assert.equal(race[0].reason.code, 'ownership-lost');
        assert.equal(race[1].status, 'fulfilled');
        await call(2, 'finish', { ...owned(race[1].value), events: [event(1, 0, 1)] });
    }
    assert.equal((await db.collection('exam_attempts/student/items').get()).size, 1);
    assert.equal(JSON.parse((await db.doc('user_progress/student').get()).data().globalStatsStr).sesiones, 1);
});
test('migración conserva datos y cursores; tras migrar no se alteran resultados con snapshots', async () => {
    const seed = { uid: 'student', schemaVersion: 1, syncVersion: 2, syncRevision: 4, syncEpoch: 'initial', globalStatsStr: '{"respondidas":10,"aciertos":7,"sesiones":1}', historyStr: '[{"id":"old-attempt","timestamp":1}]', theme: 'forest', createdAt: new Date(1) };
    await db.doc('user_progress/student').set(seed);
    await call(1, 'register');
    const archived = (await db.doc('study_backups/student').get()).data().progress;
    assert.equal(archived.historyStr, seed.historyStr);
    assert.equal(archived.createdAt.toMillis(), 1);
    const changed = { ...seed, globalStatsStr: '{"respondidas":12,"aciertos":9,"sesiones":2}', historyStr: JSON.stringify([...JSON.parse(seed.historyStr), { id: 'offline-attempt', timestamp: Date.now(), preguntas: 2 }]), theme: 'sunset' };
    const op = makeOperation('legacy-actor-001', 1, seed, changed);
    const migration = await call(1, 'progress', { operations: [op], migration: true });
    assert.ok(migration.conflicts.includes(op.id));
    assert.equal(JSON.parse(migration.data.globalStatsStr).respondidas, 10);
    await call(1, 'progress', { operations: [op], migration: true });
    await call(1, 'migration-complete');
    const fake = makeOperation('current-actor-001', 1, changed, { ...changed, globalStatsStr: '{"respondidas":999,"aciertos":999,"sesiones":999}', historyStr: '[]', theme: 'ocean' });
    const result = await call(1, 'progress', { operations: [fake] });
    assert.equal(JSON.parse(result.data.globalStatsStr).respondidas, 10);
    assert.equal(JSON.parse(result.data.historyStr)[0].id, 'old-attempt');
    assert.equal(result.data.theme, 'ocean');
    assert.ok(result.conflicts.includes(fake.id));
    assert.ok((await db.doc(`user_progress/student/legacy_conflicts/${result.conflictArchive}`).get()).exists);
    const malformed = makeOperation('invalid-actor-001', 1, changed, { ...changed, theme: 42 });
    await assert.rejects(call(1, 'progress', { operations: [malformed] }), { code: 'invalid-progress-field' });
    await assert.rejects(call(1, 'progress', { operations: [fake], migration: true }), { code: 'migration-closed' });
});
test('reglas niegan escrituras directas, borrado de v3, manipulación de intentos y acceso ajeno', async () => {
    await call(1, 'register'); const exam = await start(1); await call(1, 'finish', { ...owned(exam), events: [] });
    const owner = env.authenticatedContext('student', { email_verified: true }).firestore();
    const other = env.authenticatedContext('intruder', { email_verified: true }).firestore();
    await assertSucceeds(getDoc(doc(owner, 'active_exams', 'student')));
    await assertFails(getDoc(doc(other, 'active_exams', 'student')));
    await assertFails(setDoc(doc(owner, 'active_exams', 'student'), { fence: 999 }, { merge: true }));
    await assertFails(setDoc(doc(owner, 'user_progress', 'student'), { syncVersion: 2, syncRevision: 999, updatedAt: serverTimestamp() }, { merge: true }));
    await assertFails(deleteDoc(doc(owner, 'user_progress', 'student')));
    await assertFails(getDoc(doc(owner, 'study_sessions', 'student')));
    await assertFails(setDoc(doc(owner, 'exam_attempts', 'student', 'items', exam.exam.id), { pct: 100 }, { merge: true }));
    const profile = { uid: 'student', username: 'Alumno', specialty: '', avatarId: '', scoreVisible: true, score: 0, flame: 0, isPremium: false, updatedAt: serverTimestamp() };
    await assertSucceeds(setDoc(doc(owner, 'public_profiles', 'student'), profile));
    await assertFails(setDoc(doc(owner, 'public_profiles', 'student'), { ...profile, score: 100 }));
    await assertFails(setDoc(doc(owner, 'public_profiles', 'student'), { ...profile, flame: 99 }));
    await assertSucceeds(setDoc(doc(owner, 'public_profiles', 'student'), { ...profile, scoreVisible: false, score: null }));
});
test('la racha usa la fecha civil de la cuenta cuando el servidor ya está en el día siguiente', () => {
    const instant = Date.parse('2026-10-16T03:00:00Z');
    const result = aggregate({ globalStatsStr: JSON.stringify({ streakData: { currentStreak: 1, lastStudyDate: '2026-10-14' } }) }, {
        id: 'timezone-exam-0001', questionSet: [q], answers: [{ selected: 1, isCorrect: true }], mode: 'simulacro', currentExamType: 'Prueba',
        timeZone: 'America/Mexico_City', paused: false, elapsedSec: 0, runningSince: instant - 1000
    }, instant);
    assert.equal(JSON.parse(result.data.globalStatsStr).streakData.lastStudyDate, '2026-10-15');
    assert.equal(publicTotals(result.data, instant, 'America/Mexico_City').publicFlame, 2);
    const offlineClock = applyEvents({ startedAt: 1000, runningSince: 1000, elapsedSec: 0, paused: false, lastSequence: 0 }, [
        { sequence: 1, kind: 'pause', occurredAt: 2000 }, { sequence: 2, kind: 'resume', occurredAt: 5000 }, { sequence: 3, kind: 'pause', occurredAt: 8000 }
    ], 10000);
    assert.equal(offlineClock.elapsedSec, 4);
});
test('cliente conserva pendientes offline y al perder control; recuperación explícita y ACK perdido', async () => {
    let offline = false, loseAck = false, loseFinishAck = false, lastStatus;
    const store = memory();
    const client = create({ storage: store,
        send: async body => { if (offline) throw Object.assign(new Error('offline'), { code: 'offline' }); const result = await execute('student', body); if ((loseAck && body.action === 'events') || (loseFinishAck && body.action === 'finish')) { loseAck = loseFinishAck = false; throw Object.assign(new Error('offline'), { code: 'offline' }); } return result; },
        readExam: async () => { const snap = await db.doc('active_exams/student').get(); if (!snap.exists) return null; const exam = snap.data(); return { ...exam, ...(await db.doc(`exam_payloads/student/items/${exam.id}`).get()).data() }; },
        listenExam: (_, cb) => db.doc('active_exams/student').onSnapshot(async snap => { if (snap.exists) { const exam = snap.data(); cb({ ...exam, ...(await db.doc(`exam_payloads/student/items/${exam.id}`).get()).data() }); } }),
        listenDevices: () => () => {}, onStatus: status => { lastStatus = status; }
    });
    try {
        await client.boot('student');
        await client.start({ examId: 'offline-exam-0001', questionSet: [q] });
        offline = true; client.queue({ kind: 'answer', index: 0, selected: 1 }); await client.flush();
        assert.equal(lastStatus.pending, 1);
        await call(2, 'register'); const phone = await call(2, 'claim', { examId: client.active.id });
        assert.equal(phone.exam.answers[0].selected, null);
        // Explicitly deliver the authoritative snapshot; the outbox must remain untouched.
        await new Promise(resolve => setTimeout(resolve, 100));
        assert.equal(client.owns(), false);
        assert.equal(client.conflicts().length, 1);
        offline = false;
        await client.recover(client.conflicts()[0].key);
        assert.equal(client.conflicts().length, 0);
        assert.equal((await db.doc('active_exams/student').get()).data().answers[0].selected, 1);
        client.queue({ kind: 'flag', index: 0, flagged: true }); loseAck = true; await client.flush();
        assert.equal(lastStatus.pending, 1);
        await client.flush(); assert.equal(lastStatus.pending, 0);
        // Reconnection of the same runtime must not rotate its fence or turn its
        // own pending answers into conflicts.
        const fence = client.active.fence;
        await client.boot('student'); assert.equal(client.active.fence, fence);
        offline = true;
        await assert.rejects(client.flush(true), { code: 'offline' });
        assert.ok(lastStatus.pending > 0);
        offline = false; loseFinishAck = true;
        await client.flush(); assert.ok(lastStatus.pending > 0);
        await client.flush();
        assert.equal(JSON.parse((await db.doc('user_progress/student').get()).data().globalStatsStr).sesiones, 1);
    } finally { client.stop(); }
});
test('cerrar y reabrir recupera automáticamente respuestas locales si la propiedad no cambió', async () => {
    const storage = memory();
    const read = async () => { const snap = await db.doc('active_exams/student').get(); if (!snap.exists) return null; const exam = snap.data(); return { ...exam, ...(await db.doc(`exam_payloads/student/items/${exam.id}`).get()).data() }; };
    const options = { storage, send: body => execute('student', body), readExam: read, listenExam: () => () => {}, listenDevices: () => () => {} };
    const first = create(options); await first.boot('student');
    await first.start({ examId: 'reopen-exam-00001', questionSet: [q] });
    const oldFence = first.active.fence;
    first.queue({ kind: 'answer', index: 0, selected: 1 }); first.stop();
    assert.equal((await read()).answers[0].selected, null);
    const reopened = create(options);
    try {
        await reopened.boot('student');
        assert.equal(reopened.active.answers[0].selected, 1);
        assert.ok(reopened.active.fence > oldFence);
        assert.equal(reopened.conflicts().length, 0);
        await reopened.flush(true);
        assert.equal(JSON.parse((await db.doc('user_progress/student').get()).data().globalStatsStr).sesiones, 1);
    } finally { reopened.stop(); }
});
