const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const sync = require('../progress-sync');
const { create, compactHistory } = sync;
const { createTestCloud } = require('./progress_test_cloud');

const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const slice = (start, end) => {
    const a = app.indexOf(start), b = app.indexOf(end, a);
    assert(a >= 0 && b > a, `Missing app code: ${start}`);
    return app.slice(a, b);
};
const helpers = slice('    const progressOutbox =', '    const isValidPublicUsername =');
const save = slice('    const capturePrivateProgress =', '    const renderAvatarInitials =');
const restore = slice('                let progressRestoration =', '                window.addEventListener("online"');
const debounce = slice('    let _estudioSaveTimer =', '    const recordStat =');
const themeGate = slice('        // Loading entitlement listeners', '        const adminPanel =');
const user = { uid: 'account-a', emailVerified: true };
const bySpecialty = Object.fromEntries(['mi', 'ped', 'gyo', 'cir'].map(key => [key, { total: 0, correct: 0, name: key }]));
const oldStats = { sesiones: 2, respondidas: 20, aciertos: 10, pomodoros: 0, bySpecialty, streakData: { currentStreak: 2, lastStudyDate: '2026-10-14' } };
const newStats = { ...oldStats, sesiones: 3, respondidas: 30, aciertos: 20, streakData: { currentStreak: 3, lastStudyDate: '2026-10-15' } };
const remote = { globalStatsStr: JSON.stringify(oldStats), historyStr: '[]', theme: 'ocean', createdAt: 'progress-creation' };
const memory = () => {
    const values = new Map();
    return { get length() { return values.size; }, key: index => [...values.keys()][index] ?? null, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) };
};
const snapshot = data => ({ exists: () => Boolean(data), data: () => data, metadata: { fromCache: false } });
const drain = async () => { for (let i = 0; i < 80; i++) await Promise.resolve(); };

function createRuntime(storage, options = {}) {
    const timers = new Map();
    const writes = [];
    const cloud = options.cloud || createTestCloud(options.remote === null ? {} : { 'user_progress/account-a': options.remote || remote }, options);
    const State = {
        currentUid: user.uid, progressRestoreUid: user.uid, progressRestoreReady: true,
        progressDocumentExists: true, globalStats: structuredClone(oldStats), history: [],
        theme: 'ocean', userName: 'Aspirante', reportedQuestionsLocal: [], studyCalendar: {},
        accountCreatedAt: 'directory-creation', isScorePublic: true
    };
    const noop = () => {};
    const context = {
        State, localStorage: storage, console: { error: noop, warn: noop }, Date,
        document: { querySelectorAll: () => [] },
        USER_PROGRESS_COLLECTION: 'user_progress', PUBLIC_PROFILES_COLLECTION: 'public_profiles',
        PROFILE_AVATAR_STORAGE_KEY: 'avatar', SCALE_STUDY_STORAGE_KEY: 'scales',
        FONT_PRESET_STORAGE_KEY: 'font', APPEARANCE_STORAGE_KEY: 'appearance',
        POMODORO_STORAGE_KEYS: { settings: 'pomo-settings', log: 'pomo-log', specialties: 'pomo-specs', focus: 'pomo-focus' },
        ensureStudySystemsState: noop, ensureDailyPlanFresh: noop,
        getStudyStreakData: () => State.globalStats.streakData,
        normalizeProfileAvatar: value => value || '', normalizeFontPreset: value => value || 'apple',
        normalizeAppearance: value => value || {}, normalizeThemeSelection: value => value,
        normalizePublicUsername: value => value, getEffectiveStreak: () => State.globalStats.streakData.currentStreak,
        hasIndividualPremiumEntitlement: () => false, persistPomodoroLocalState: noop,
        createDefaultPomodoroSettings: () => ({}), syncUserDirectory: noop,
        syncAuthenticatedUI: noop, normalizeTimestamp: value => value,
        applyTheme: noop, applyFontPreset: noop, applyAppearance: noop,
        normalizePhoneInput: value => value, normalizeReferralCode: value => value,
        mergeCloudAndLocalReports: noop, refreshQuarantineKeys: noop, updateReferralUI: noop,
        applyCurrentProfileAvatar: noop, rebuildTopicMastery: noop,
        updateDashboardStats: noop, updateCharts: noop, updateHistoryView: noop, renderProfileView: noop, renderPomodoroHub: noop,
        $: () => null, showNotification: noop
    };
    const window = {
        ENARMProgressSync: sync,
        clearTimeout: id => timers.delete(id),
        setTimeout: (callback, ms) => { const id = timers.size + 1; timers.set(id, { callback, ms }); return id; },
        FB: {
            auth: { currentUser: { ...user } }, db: {},
            doc: (_db, ...parts) => ({ collection: parts[0], uid: parts[1], path: parts.join('/') }),
            runTransaction: async (db, callback) => {
                const result = await cloud.runTransaction(db, callback);
                writes.splice(0, writes.length, ...cloud.writes.filter(write => write.path === 'user_progress/account-a').map(write => write.data));
                return result;
            },
            onSnapshot: cloud.onSnapshot,
            serverTimestamp: () => 'server-time',
            getDoc: async ref => {
                if (ref.collection === 'public_profiles') throw new Error('permission-denied');
                if (ref.collection === 'user_directory') return snapshot({ createdAt: 'directory-creation' });
                return snapshot(null);
            },
            getDocFromServer: async () => {
                if (options.readFails) throw new Error('unavailable');
                return options.remoteSnapshot || cloud.get({ path: 'user_progress/account-a' });
            },
            setDoc: (ref, data) => {
                if (ref.collection !== 'user_progress') return Promise.resolve();
                writes.push(data);
                if (options.write) return options.write(data);
                if (options.writeFails) return Promise.reject(new Error('unavailable'));
                // Reproduce the immutable-createdAt rule that rejected the old payload.
                if (options.remote !== null && 'createdAt' in data && data.createdAt !== remote.createdAt) {
                    return Promise.reject(new Error('permission-denied: createdAt changed'));
                }
                return Promise.resolve();
            }
        }
    };
    Object.assign(context, { window, setTimeout: window.setTimeout, clearTimeout: window.clearTimeout });
    return { State, window, timers, writes, context, cloud };
}

function session(storage, options = {}) {
    const runtime = createRuntime(storage, options);
    vm.createContext(runtime.context);
    vm.runInContext(helpers + save + restore + debounce + '\nglobalThis.api = { saveGlobalStats, getPrivateUserSnapshot, restoreAuthenticatedProgress, flushPendingProgress, debouncedSave, progressOutbox, bindProgressListener, receiveRemoteProgress };', runtime.context);
    runtime.context.api.progressOutbox.begin(user.uid, vm.runInContext('capturePrivateProgress()', runtime.context));
    return { ...runtime, api: runtime.context.api };
}

module.exports = { createRuntime, helpers, save, restore, debounce, user, oldStats, newStats, remote, snapshot, session, memory, drain, createTestCloud, sync };

if (require.main === module) (async () => {
    const storage = memory();
    const first = session(storage, { writeFails: true });
    Object.assign(first.State, { globalStats: newStats, theme: 'forest', history: [{ timestamp: 1792022400000, preguntas: 10, blank: 0 }], studyCalendar: { '2026-10-15': { practiced: true } } });
    first.api.debouncedSave();
    assert.equal(first.writes.length, 0, 'Network is delayed');
    assert.equal(first.api.progressOutbox.read(user.uid).pending, true, 'Local save is immediate');

    // Recreate the entire JS session before the three-second timer has fired.
    const reopened = session(storage);
    reopened.State.progressRestoreReady = false;
    await reopened.api.restoreAuthenticatedProgress(user);
    await drain();
    assert.equal(reopened.State.globalStats.sesiones, 3);
    assert.equal(reopened.State.history.length, 1);
    assert.equal(reopened.State.globalStats.streakData.currentStreak, 3);
    assert.equal(reopened.State.studyCalendar['2026-10-15'].practiced, true);
    assert.equal(reopened.State.theme, 'forest');
    assert.equal(reopened.writes.length, 1);
    assert(!('createdAt' in reopened.writes[0]), 'Merged updates preserve the progress creation timestamp');
    assert.equal(reopened.api.progressOutbox.read(user.uid).pending, false);

    // A confirmed newer cloud snapshot takes precedence over an acknowledged backup.
    const otherDevice = session(storage, { remote: { ...remote, theme: 'sunset', globalStatsStr: JSON.stringify({ ...newStats, sesiones: 4 }) } });
    await otherDevice.api.restoreAuthenticatedProgress(user);
    assert.equal(otherDevice.State.globalStats.sesiones, 4);
    assert.equal(otherDevice.State.theme, 'sunset');

    const failed = session(memory(), { writeFails: true });
    failed.State.theme = 'forest';
    failed.api.saveGlobalStats();
    failed.api.saveGlobalStats();
    await drain();
    assert.equal(failed.api.progressOutbox.read(user.uid).pending, true);
    assert([...failed.timers.values()].some(timer => timer.ms === 15000), 'Failures schedule retries');

    let resolveFirst, resolveSecond;
    const concurrent = session(memory(), { beforeCommit: () => new Promise(resolve => { if (!resolveFirst) resolveFirst = resolve; else resolveSecond = resolve; }) });
    concurrent.State.theme = 'light';
    concurrent.api.saveGlobalStats();
    await drain();
    concurrent.State.theme = 'forest';
    concurrent.api.saveGlobalStats();
    const latestRevision = concurrent.api.progressOutbox.read(user.uid).revision;
    assert.equal(concurrent.writes.length, 0, 'The first transaction has not committed yet');
    resolveFirst();
    await drain();
    assert.equal(concurrent.api.progressOutbox.read(user.uid).revision, latestRevision);
    assert.equal(concurrent.api.progressOutbox.read(user.uid).pending, true, 'An old acknowledgement cannot clear newer changes');
    assert.equal(concurrent.writes.length, 1);
    resolveSecond();
    await drain();
    assert.equal(concurrent.api.progressOutbox.read(user.uid).pending, false);
    assert.equal(concurrent.writes[1].theme, 'forest');

    // A legacy read cannot authorize replacing an unread current progress document.
    const unavailable = session(storage, { readFails: true });
    unavailable.State.progressRestoreReady = false;
    await unavailable.api.restoreAuthenticatedProgress(user);
    assert.equal(unavailable.State.progressRestoreReady, false);
    assert.equal(unavailable.writes.length, 0);
    assert.equal(unavailable.State.theme, 'sunset', 'An offline startup can use the account backup');
    const cached = session(memory(), { remoteSnapshot: { ...snapshot(remote), metadata: { fromCache: true } } });
    assert.equal((await cached.api.getPrivateUserSnapshot(user.uid)).canSafelyPersist(), false);

    const fresh = session(memory(), { remote: null });
    fresh.State.progressRestoreReady = false;
    fresh.State.progressDocumentExists = false;
    await fresh.api.restoreAuthenticatedProgress(user);
    await drain();
    assert.equal(fresh.writes[0].createdAt, 'server-time', 'New documents use a server creation timestamp');
    fresh.api.saveGlobalStats();
    fresh.State.theme = 'forest';
    fresh.api.saveGlobalStats();
    await drain();
    assert(!('createdAt' in fresh.writes[1]));

    const unverified = session(memory());
    unverified.window.FB.auth.currentUser.emailVerified = false;
    unverified.State.theme = 'forest';
    unverified.api.saveGlobalStats();
    await drain();
    assert.equal(unverified.writes.length, 0);
    assert.equal(unverified.api.progressOutbox.read(user.uid).pending, true, 'Unverified accounts keep their local work');

    const isolatedStorage = memory();
    const outbox = create(isolatedStorage);
    outbox.stage('account-a', { theme: 'forest' });
    assert.equal(outbox.restore('account-b', { theme: 'ocean' }, false).theme, 'ocean');
    const switched = session(memory());
    let finishRead;
    const delayedRead = new Promise(resolve => { finishRead = resolve; });
    const restoration = switched.api.restoreAuthenticatedProgress(user, delayedRead);
    assert.equal(switched.api.restoreAuthenticatedProgress(user), restoration, 'Concurrent restores share one read');
    switched.State.currentUid = 'account-b';
    switched.window.FB.auth.currentUser = { uid: 'account-b', emailVerified: true };
    finishRead({ hasProgress: () => true, exists: () => true, data: () => ({ theme: 'forest' }), canSafelyPersist: () => true });
    await restoration;
    assert.equal(switched.State.theme, 'ocean', 'A late account-a read must not alter account-b');

    const bank = {};
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'questions.js'), 'utf8') + '\nglobalThis.bank = QUESTIONS;', bank);
    const longHistory = Array.from({ length: 50 }, (_, i) => ({
        timestamp: i, preguntas: 280, pct: 70,
        questionSet: bank.bank.slice(0, 280), answers: Array.from({ length: 280 }, () => ({ selected: 1, isCorrect: true }))
    }));
    const compacted = compactHistory(longHistory);
    assert.equal(compacted.length, 50, 'Every session summary survives compaction');
    assert(Buffer.byteLength(JSON.stringify(compacted)) <= 500000, 'History fits the persistence budget');
    assert.equal(compacted[49].questionSet.length, 280, 'The latest full exam can still be reviewed');
    assert.equal(longHistory[0].questionSet.length, 280, 'Compaction does not mutate the active session');
    outbox.forget('account-a');
    assert.equal(outbox.read('account-a'), null, 'Account deletion removes the local backup');

    // Premium loading and a temporary demo fallback never mutate the saved preference.
    for (const [resolved, premium, expected] of [[false, false, 'forest'], [true, false, 'ocean'], [true, true, 'forest']]) {
        const state = { authStateResolved: true, entitlementLoaded: resolved, globalPremiumLoaded: resolved, theme: 'forest' };
        let applied;
        vm.runInNewContext(themeGate, { State: state, premium, DEMO_ALLOWED_THEMES: new Set(['ocean', 'light']), applyTheme: value => { applied = value; } });
        assert.equal(applied, expected);
        assert.equal(state.theme, 'forest');
    }
    console.log('Progress persistence: immediate close/reopen, exam/history/streak/theme recovery, immutable creation timestamps, acknowledgements, failed writes/retries, offline safety, new/unverified accounts and account isolation OK.');
})().catch(error => { console.error(error); process.exitCode = 1; });
