const assert = require('node:assert/strict');
const { session, memory, drain, createTestCloud, remote, oldStats, user } = require('./test_progress_persistence');
const changed = (runtime, id, count) => {
    runtime.State.globalStats = { ...structuredClone(oldStats), sesiones: 3, respondidas: 20 + count, aciertos: 10 + count };
    runtime.State.history = [{ id, timestamp: new Date(2026, 9, 15, 12).getTime(), preguntas: count, blank: 0 }];
    runtime.State.studyCalendar = { '2026-10-15': { sessions: 1, practiced: true } };
};
(async () => {
    const cloud = createTestCloud({ 'user_progress/account-a': remote });
    const computer = session(memory(), { cloud }), phone = session(memory(), { cloud });
    await Promise.all([computer.api.restoreAuthenticatedProgress(user), phone.api.restoreAuthenticatedProgress(user)]);
    await drain();
    assert.equal(cloud.writes.length, 0, 'Opening devices creates no write-back loop');
    // An incoming progress change must not replace an exam running on the phone.
    Object.assign(phone.State, { examActive: true, questionSet: ['active-question'], answers: [{ selected: 2 }], currentIndex: 7, startTime: 12345, pomodoroState: { running: true, secondsLeft: 123 } });
    changed(computer, 'exam-computer', 10); changed(phone, 'exam-phone', 5);
    computer.State.theme = 'forest';
    computer.api.saveGlobalStats(); phone.api.saveGlobalStats();
    await drain();
    await Promise.all([computer.api.flushPendingProgress(), phone.api.flushPendingProgress()]);
    await drain();
    const saved = cloud.read('user_progress/account-a');
    const publicProfile = cloud.read('public_profiles/account-a');
    assert.equal(JSON.parse(saved.globalStatsStr).sesiones, 4);
    assert.equal(JSON.parse(saved.globalStatsStr).respondidas, 35);
    assert.equal(JSON.parse(saved.historyStr).length, 2);
    assert.equal(publicProfile.score, Number((25 / 35 * 100).toFixed(1)), 'The public score uses combined server totals');
    for (const device of [computer, phone]) {
        assert.equal(device.State.globalStats.respondidas, 35, 'Both open devices receive the combined result');
        assert.equal(device.State.history.length, 2);
        assert.equal(device.State.theme, 'forest');
        assert.equal(device.api.progressOutbox.read(user.uid).pending, false);
    }
    assert.equal(phone.State.examActive, true);
    assert.deepEqual(phone.State.questionSet, ['active-question']);
    assert.deepEqual(phone.State.answers, [{ selected: 2 }]);
    assert.equal(phone.State.currentIndex, 7);
    assert.equal(phone.State.startTime, 12345);
    assert.deepEqual(phone.State.pomodoroState, { running: true, secondsLeft: 123 });
    const writes = cloud.writes.length;
    await drain();
    assert.equal(cloud.writes.length, writes, 'Realtime snapshots do not echo into new writes');

    // Lost ACK: the cloud committed but the browser closes with an old pending queue.
    const offlineStorage = memory();
    const offline = session(offlineStorage, { cloud });
    await offline.api.restoreAuthenticatedProgress(user); await drain();
    offline.State.theme = 'sunset';
    offline.api.saveGlobalStats({ deferRemote: true });
    const operations = offline.api.progressOutbox.batch(user.uid);
    const merged = require('../progress-sync').mergeBatch(saved, operations);
    const crashCloud = createTestCloud({
        'user_progress/account-a': { ...merged.data, syncVersion: 2, syncRevision: saved.syncRevision + 1 },
        [`user_progress/account-a/sync_clients/${operations[0].actor}`]: { uid: user.uid, lastSequence: operations.at(-1).sequence }
    });
    const reopened = session(offlineStorage, { cloud: crashCloud });
    await reopened.api.restoreAuthenticatedProgress(user); await drain();
    assert.equal(reopened.State.theme, 'sunset');
    assert.equal(reopened.State.globalStats.respondidas, 35);
    assert.equal(crashCloud.writes.filter(write => write.path === 'user_progress/account-a').length, 0, 'An already committed batch is acknowledged without writing progress again');
    assert.equal(reopened.api.progressOutbox.read(user.uid).pending, false);
    console.log('Multi-device app: optimistic transaction retry, two concurrent devices, realtime convergence, no write echoes, active exam/timer isolation and lost-ACK recovery OK.');
})().catch(error => { console.error(error); process.exitCode = 1; });
