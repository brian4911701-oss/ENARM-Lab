'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const sync = require('../progress-sync');
const memory = () => {
    const values = new Map();
    return { get length() { return values.size; }, key: i => [...values.keys()][i] ?? null,
        getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) };
};
const uid = 'recovery-student';
const cloud = {
    syncVersion: 3, syncRevision: 18, syncEpoch: 'initial', theme: 'ocean',
    globalStatsStr: JSON.stringify({ respondidas: 278, aciertos: 211, sesiones: 34, pomodoros: 2, streakData: { currentStreak: 3, lastStudyDate: '2026-10-15' } }),
    historyStr: JSON.stringify([{ id: 'confirmed-exam', preguntas: 10, timestamp: 1792104000000 }]),
    studyCalendarStr: JSON.stringify({ '2026-10-15': { sessions: 1, practiced: true, pomodoros: 2 } }),
    caseNotebookStr: '[]'
};
const zero = { ...cloud, globalStatsStr: JSON.stringify({ respondidas: 0, aciertos: 0, sesiones: 0, pomodoros: 2 }), historyStr: '[]', studyCalendarStr: '{}' };
const stats = data => JSON.parse(data.globalStatsStr);

test('fresh server progress wins over a zero cache and unacknowledged legacy totals', () => {
    const storage = memory(), old = sync.create(storage, { actor: 'old-browser' });
    old.begin(uid, cloud);
    old.stage(uid, { ...zero, theme: 'forest' });
    const key = 'enarm_progress_v2:' + uid + ':old-browser';
    const record = JSON.parse(storage.getItem(key));
    storage.setItem(key, JSON.stringify({ ...record, canonical: zero, view: zero }));
    const reopened = sync.create(storage, { actor: 'new-browser' });
    reopened.begin(uid, zero);
    const restored = reopened.restore(uid, cloud, true);
    assert.deepEqual(stats(restored), stats(cloud));
    assert.equal(restored.historyStr, cloud.historyStr);
    assert.equal(restored.studyCalendarStr, cloud.studyCalendarStr);
    assert.equal(restored.theme, 'forest');
    assert.equal(reopened.read(uid).pending, true, 'Original operations remain available for server conflict archival');
    assert.equal(reopened.batch(uid).length, 1);
    assert.deepEqual(stats(reopened.accept(uid, cloud)), stats(cloud), 'Another snapshot cannot apply old negative totals either');
});

test('a pending legacy reset never clears confirmed v3 results or changes its epoch', () => {
    const storage = memory(), outbox = sync.create(storage, { actor: 'legacy-reset' });
    outbox.begin(uid, cloud); outbox.stage(uid, zero, { reset: true });
    const restored = sync.create(storage).restore(uid, cloud, true);
    assert.deepEqual(stats(restored), stats(cloud));
    assert.equal(restored.historyStr, cloud.historyStr);
    assert.equal(restored.syncEpoch, cloud.syncEpoch);
    assert.equal(outbox.batch(uid)[0].reset.globalStatsStr, zero.globalStatsStr, 'Do not destroy the old recovery evidence');
});

test('normal offline notes and pomodoros still recover, then clear only on acknowledgement', () => {
    const storage = memory(), original = sync.create(storage, { actor: 'offline-student' });
    original.begin(uid, cloud);
    original.stage(uid, { ...cloud, globalStatsStr: JSON.stringify({ ...stats(cloud), pomodoros: 3 }), caseNotebookStr: JSON.stringify([{ id: 'note-one', note: 'Review later' }]) });
    const reopened = sync.create(storage), view = reopened.restore(uid, cloud, true);
    assert.equal(stats(view).pomodoros, 3); assert.equal(stats(view).respondidas, 278);
    assert.equal(JSON.parse(view.caseNotebookStr)[0].note, 'Review later');
    assert.equal(reopened.read(uid).pending, true);
    reopened.accept(uid, { ...view, syncRevision: 19 }, reopened.batch(uid));
    assert.equal(reopened.read(uid).pending, false);
});

test('a failed server read keeps the last confirmed cache and never replaces it with empty defaults', () => {
    const storage = memory(), original = sync.create(storage, { actor: 'cached-student' });
    original.accept(uid, cloud);
    const reopened = sync.create(storage); reopened.begin(uid, zero);
    const restored = reopened.restore(uid, {}, false);
    assert.deepEqual(stats(restored), stats(cloud));
    assert.equal(restored.historyStr, cloud.historyStr);
});

test('v2 offline deltas are rebased on the fresh cloud snapshot', () => {
    const storage = memory(), original = sync.create(storage, { actor: 'v2-student' });
    const base = { ...cloud, syncVersion: 2 };
    original.begin(uid, base);
    original.stage(uid, { ...base, globalStatsStr: JSON.stringify({ ...stats(base), respondidas: 279 }) });
    const fresh = { ...base, globalStatsStr: JSON.stringify({ ...stats(base), respondidas: 300 }) };
    const restored = sync.create(storage).restore(uid, fresh, true);
    assert.equal(stats(restored).respondidas, 301);
});
