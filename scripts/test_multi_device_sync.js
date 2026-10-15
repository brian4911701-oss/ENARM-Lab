const assert = require('node:assert/strict');
const sync = require('../progress-sync');
const memory = () => {
    const values = new Map();
    return {
        get length() { return values.size; }, key: index => [...values.keys()][index] ?? null,
        getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key)
    };
};
const stats = (data) => JSON.parse(data.globalStatsStr);
const baseline = {
    globalStatsStr: JSON.stringify({ sesiones: 2, respondidas: 20, aciertos: 10, bySpecialty: { mi: { total: 20, correct: 10 } }, streakData: { lastStudyDate: '2026-10-13', currentStreak: 2 } }),
    historyStr: '[]', studyCalendarStr: '{}', theme: 'ocean', caseNotebookStr: '[]'
};
const exam = (base, id, count, day = '2026-10-15') => ({
    ...base,
    globalStatsStr: JSON.stringify({ ...stats(base), sesiones: stats(base).sesiones + 1, respondidas: stats(base).respondidas + count, aciertos: stats(base).aciertos + count, bySpecialty: { mi: { total: 20 + count, correct: 10 + count } } }),
    historyStr: JSON.stringify([...JSON.parse(base.historyStr), { id, timestamp: new Date(day + 'T12:00:00').getTime(), preguntas: count, blank: 0 }]),
    studyCalendarStr: JSON.stringify({ [day]: { sessions: 1, practiced: true } })
});

const a = sync.makeOperation('computer', 1, baseline, exam(baseline, 'exam-a', 10));
const b = sync.makeOperation('phone', 1, baseline, exam(baseline, 'exam-b', 5));
let first = sync.mergeBatch(baseline, [a]);
let both = sync.mergeBatch(first.data, [b], first.heads);
assert.equal(stats(both.data).sesiones, 4);
assert.equal(stats(both.data).respondidas, 35);
assert.equal(stats(both.data).bySpecialty.mi.total, 35);
assert.equal(JSON.parse(both.data.historyStr).length, 2);
assert.equal(JSON.parse(both.data.studyCalendarStr)['2026-10-15'].sessions, 2);
assert.equal(stats(both.data).streakData.currentStreak, 1, 'One calendar day is credited once, preserving the missed-day penalty');
assert.deepEqual(sync.mergeBatch(both.data, [a, b], both.heads).data, both.data, 'Retries cannot duplicate a committed exam');
const reverse = sync.mergeBatch(sync.mergeBatch(baseline, [b]).data, [a]);
assert.deepEqual(stats(reverse.data), stats(both.data), 'Device commit order does not change totals');

const recolor = sync.makeOperation('computer', 2, first.data, { ...first.data, theme: 'forest' });
const colored = sync.mergeBatch(first.data, [recolor], first.heads);
assert.equal(sync.mergeBatch(colored.data, [b], colored.heads).data.theme, 'forest', 'A phone exam cannot revert an unchanged old color');
const red = sync.makeOperation('phone', 2, baseline, { ...baseline, theme: 'sunset' });
assert.equal(sync.mergeBatch(colored.data, [red], colored.heads).data.theme, 'sunset', 'An intentional edit uses transaction commit order');

const reset = sync.makeOperation('computer', 3, both.data, { ...baseline, globalStatsStr: JSON.stringify({ sesiones: 0, respondidas: 0, aciertos: 0 }), historyStr: '[]' }, true);
const cleared = sync.mergeBatch(both.data, [reset], both.heads);
const stale = sync.makeOperation('offline', 1, baseline, exam(baseline, 'old-offline', 20));
const afterReset = sync.mergeBatch(cleared.data, [stale], cleared.heads);
assert.equal(stats(afterReset.data).respondidas, 0, 'An old offline snapshot cannot resurrect cleared stats');
assert.equal(stats(afterReset.data).streakData.currentStreak, 0);
assert.equal(JSON.parse(afterReset.data.historyStr).length, 0);
assert.equal(afterReset.ignored.length, 1);

const storage = memory();
const tabA = sync.create(storage, { actor: 'tab-a' }), tabB = sync.create(storage, { actor: 'tab-b' });
tabA.restore('user', baseline, true); tabB.restore('user', baseline, true);
tabA.stage('user', exam(baseline, 'tab-exam-a', 10));
tabB.stage('user', exam(baseline, 'tab-exam-b', 5));
assert.equal(tabA.batch('user').length, 2, 'Two tabs do not overwrite each other\'s pending queue');
const sent = tabA.batch('user');
const committed = sync.mergeBatch(baseline, sent);
committed.data.syncRevision = 1;
tabB.stage('user', { ...exam(baseline, 'tab-exam-b', 5), theme: 'forest' });
tabA.accept('user', committed.data, sent);
assert.equal(tabA.batch('user').length, 1, 'An acknowledgement retains edits created during the transaction');
const reopened = sync.create(storage, { actor: 'new-tab' });
assert.equal(reopened.restore('user', {}, false).theme, 'forest');
assert.equal(stats(reopened.read('user').data).sesiones, 4);
assert.equal(reopened.read('other-user'), null);
reopened.forget('user');
assert.equal(storage.length, 0);

const oldStorage = memory();
const oldPhone = exam(baseline, 'old-phone-exam', 5);
const newerServer = exam(baseline, 'new-computer-exam', 10);
oldStorage.setItem('enarm_progress_backup:user', JSON.stringify({ uid: 'user', pending: true, data: oldPhone }));
const upgraded = sync.create(oldStorage, { actor: 'upgrade' });
upgraded.begin('user', oldPhone);
upgraded.restore('user', newerServer, true);
const recovered = sync.mergeBatch(newerServer, upgraded.batch('user'));
assert.equal(stats(recovered.data).respondidas, 30, 'Legacy import must not count newer cloud totals as a local increment');
assert.equal(JSON.parse(recovered.data.historyStr).length, 2, 'Distinct legacy exam records are retained');

const planBase = { ...baseline, dailyPlanStr: JSON.stringify({ date: '2026-10-14', completedTaskIds: [] }) };
const oldPlanEdit = sync.makeOperation('offline-plan', 1, planBase, { ...planBase, dailyPlanStr: JSON.stringify({ date: '2026-10-14', completedTaskIds: ['old-task'] }) });
const currentPlan = { ...baseline, dailyPlanStr: JSON.stringify({ date: '2026-10-15', completedTaskIds: [] }) };
assert.deepEqual(JSON.parse(sync.mergeBatch(currentPlan, [oldPlanEdit]).data.dailyPlanStr).completedTaskIds, [], 'Yesterday\'s offline plan cannot complete today\'s tasks');
const largeQueue = sync.create(memory(), { actor: 'large-offline-writer' });
largeQueue.begin('large-queue', baseline);
largeQueue.stage('large-queue', { ...baseline, caseNotebookStr: JSON.stringify([{ id: 'note-a', note: 'ñ'.repeat(180000) }]) });
largeQueue.stage('large-queue', { ...baseline, caseNotebookStr: JSON.stringify([{ id: 'note-a', note: 'á'.repeat(180000) }]) });
assert.equal(largeQueue.read('large-queue').operations.length, 2);
const firstLargeBatch = largeQueue.batch('large-queue');
assert.equal(firstLargeBatch.length, 1, 'Large offline operations are sent in separate byte-bounded batches');
assert(new TextEncoder().encode(JSON.stringify(firstLargeBatch)).length < 650000);
largeQueue.accept('large-queue', sync.applyOperation(baseline, firstLargeBatch[0]), firstLargeBatch);
assert.equal(largeQueue.batch('large-queue').length, 1, 'The remaining offline edit survives the first acknowledgement');
console.log('Multi-device merge: concurrent/offline exams, counters, same-day streak, preferences, idempotent replay, reset epochs, two tabs, reload, account isolation and UTF-8 batching OK.');
module.exports = { memory, baseline, exam };
