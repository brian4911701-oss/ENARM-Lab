const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const streak = require('../streak-core');
const at = (year, month, day, hour = 12) => new Date(year, month - 1, day, hour);

if (process.argv.includes('--timezone-sample')) {
    // Both DST boundaries must use calendar days, including the 23h spring day.
    assert.equal(streak.effective({ lastStudyDate: '2026-3-7', currentStreak: 10 }, at(2026, 3, 9)), 8);
    assert.equal(streak.effective({ lastStudyDate: '2026-10-31', currentStreak: 10 }, at(2026, 11, 2)), 8);
    let data = streak.record(null, at(2026, 10, 14, 23));
    assert.equal(data.lastStudyDate, '2026-10-14');
    data = streak.record(data, at(2026, 10, 15, 0));
    assert.equal(data.currentStreak, 2);
    assert.equal(streak.record(data, at(2026, 10, 15, 23)).currentStreak, 2);
    process.exit(0);
}

assert.equal(streak.normalizeDay('2026-5-8'), '2026-05-08');
assert.equal(streak.normalizeDay('2026-02-30'), null);
assert.equal(streak.normalizeDay('2024-02-29'), '2024-02-29');
assert.equal(streak.normalizeDay('invalid'), null);
assert.equal(streak.effective(null, at(2026, 10, 14)), 0);
const original = { lastStudyDate: '2026-10-13', currentStreak: 10 };
assert.equal(streak.effective(original, at(2026, 10, 14)), 10);
assert.equal(streak.effective(original, at(2026, 10, 15)), 8);
assert.equal(streak.effective(original, at(2026, 10, 30)), 0);
assert.equal(streak.record(original, at(2026, 10, 15)).currentStreak, 9);
assert.equal(streak.record({ lastStudyDate: '2026-5-8', currentStreak: '5' }, at(2026, 5, 8)).currentStreak, 5);
assert.equal(streak.record({ lastStudyDate: '2026-05-08', currentStreak: 5 }, at(2026, 5, 8)).currentStreak, 5);
assert.equal(streak.record({ lastStudyDate: '2030-01-01', currentStreak: 100 }, at(2026, 10, 14)).currentStreak, 1);
assert.equal(streak.effective({ lastStudyDate: 'bad', currentStreak: 8 }, at(2026, 10, 14)), 0);
assert.equal(streak.effective({ lastStudyDate: '2026-10-13', currentStreak: -4 }, at(2026, 10, 14)), 0);
const recovered = streak.reconcile(original, ['2026-10-14', '2026-10-14', '2026-10-15', '2030-01-01', 'bad'], at(2026, 10, 15));
assert.deepEqual(recovered, { lastStudyDate: '2026-10-15', currentStreak: 12 });
assert.deepEqual(streak.reconcile(recovered, ['2026-10-14', '2026-10-15'], at(2026, 10, 15)), recovered);
assert.equal(streak.reconcile(null, ['2026-10-13', '2026-10-14'], at(2026, 10, 14)).currentStreak, 2);
assert.equal(streak.record(streak.record(null, at(2026, 12, 31)), at(2027, 1, 1)).currentStreak, 2);
assert.equal(streak.record(streak.record(null, at(2024, 2, 29)), at(2024, 3, 1)).currentStreak, 2);
assert.deepEqual(original, { lastStudyDate: '2026-10-13', currentStreak: 10 });
for (const tz of ['America/Mexico_City', 'America/New_York', 'America/Tijuana', 'Asia/Tokyo']) {
    const result = spawnSync(process.execPath, [__filename, '--timezone-sample'], { env: { ...process.env, TZ: tz }, encoding: 'utf8' });
    assert.equal(result.status, 0, `${tz}: ${result.stderr}`);
}
// Run the actual app helpers to verify persistence and restoration together.
const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const start = app.indexOf('    const getStudyStreakData =');
const end = app.indexOf('    const getProbability =', start);
assert(start > 0 && end > start);
const State = {
    globalStats: { streakData: { lastStudyDate: '2026-10-13', currentStreak: 12 }, sesiones: 28 },
    studyCalendar: {}, history: [], guestExamActive: false
};
const storage = new Map();
const context = { State, Date, window: { ENARMStreak: streak }, localStorage: { setItem: (key, value) => storage.set(key, value) } };
vm.createContext(context);
vm.runInContext(app.slice(start, end) + '\nglobalThis.helpers = { recordStudyDay, getEffectiveStreak, getStudyStreakData };', context);
assert.equal(context.helpers.recordStudyDay(at(2026, 10, 14)), true);
assert.equal(context.helpers.recordStudyDay(at(2026, 10, 14)), false);
assert.equal(context.helpers.getEffectiveStreak(at(2026, 10, 14)), 13);
assert.equal(JSON.parse(storage.get('enarm_stats')).streakData.currentStreak, 13);
assert.equal(JSON.parse(storage.get('enarm_study_calendar'))['2026-10-14'].practiced, true);
assert.equal(State.globalStats.sesiones, 28);
State.globalStats = JSON.parse(storage.get('enarm_stats'));
State.studyCalendar = JSON.parse(storage.get('enarm_study_calendar'));
assert.equal(context.helpers.recordStudyDay(at(2026, 10, 14)), false);
State.guestExamActive = true;
assert.equal(context.helpers.recordStudyDay(at(2026, 10, 15)), false);
assert.equal(State.globalStats.streakData.currentStreak, 13);
State.guestExamActive = false;
State.globalStats.streakData = null;
State.studyCalendar = { '2026-10-12': { sessions: 1, practiced: false }, '2026-10-14': { practiced: true } };
State.history = [{ timestamp: at(2026, 10, 13).getTime(), preguntas: 10, blank: 0 }, { timestamp: at(2026, 10, 15).getTime(), preguntas: 10, blank: 10 }];
assert.equal(context.helpers.getEffectiveStreak(at(2026, 10, 15)), 2);
console.log('Study streak: duplicate days, legacy dates, recovery, penalties, midnight, DST and time zones OK.');
console.log('Study streak app integration: immediate persistence, reload, history recovery, guest isolation and empty sessions OK.');
