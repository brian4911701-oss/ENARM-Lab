/*
 * Reconstruye user_metrics desde user_directory + leaderboard.
 * Por defecto solo simula. Usa --write para escribir con Firebase Admin.
 *
 * PowerShell:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS=(Resolve-Path '.\service-account.json').Path
 *   node scripts/backfill_user_metrics.js
 *   node scripts/backfill_user_metrics.js --write
 */
const admin = require("../functions/node_modules/firebase-admin");
const analytics = require("../analytics-core");

const WRITE = process.argv.includes("--write");
const PROJECT_ID = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || "enarm-lab-social";
const MIGRATION_STARTED_AT = new Date();

if (!admin.apps.length) admin.initializeApp({ projectId: PROJECT_ID });
const db = admin.firestore();

const parseJson = (value, fallback) => {
    if (typeof value !== "string" || !value.trim()) return fallback;
    try { return JSON.parse(value); } catch (_err) { return fallback; }
};

const latestDate = (...values) => values
    .map(analytics.toDate)
    .filter(Boolean)
    .sort((a, b) => b.getTime() - a.getTime())[0] || null;

const earliestDate = (...values) => values
    .map(analytics.toDate)
    .filter(Boolean)
    .sort((a, b) => a.getTime() - b.getTime())[0] || null;

const laterFeatureDay = (left, right) => String(left || "") > String(right || "") ? String(left || "") : String(right || "");

const normalizeComparable = (value) => {
    if (value == null) return value;
    const date = analytics.toDate(value);
    if (date && (value instanceof Date || typeof value.toDate === "function" || typeof value.seconds === "number" || typeof value._seconds === "number")) {
        return date.toISOString();
    }
    if (Array.isArray(value)) return value.map(normalizeComparable);
    if (typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map(key => [key, normalizeComparable(value[key])]));
    return value;
};

const documentsMatch = (existing, expected) => {
    const omitUpdatedAt = ({ updatedAt: _updatedAt, ...rest }) => rest;
    return JSON.stringify(normalizeComparable(omitUpdatedAt(existing || {})))
        === JSON.stringify(normalizeComparable(omitUpdatedAt(expected || {})));
};

const deriveCalendarDaily = (studyCalendar) => Object.entries(studyCalendar || {})
    .filter(([day]) => /^\d{4}-\d{2}-\d{2}$/.test(day))
    .map(([day, row]) => ({
        day,
        sessions: analytics.safeNumber(row?.sessions),
        answered: 0,
        correct: 0,
        studySeconds: 0,
        pomodoros: analytics.safeNumber(row?.pomodoros),
        simulations: 0
    }));

const getLatestFeatureDays = (history, pomodoroLog, existingFeatures) => {
    const features = { ...(existingFeatures || {}) };
    const historyRows = (Array.isArray(history) ? history : []).map(row => ({ row, date: analytics.toDate(row?.timestamp || row?.createdAt) })).filter(item => item.date);
    const latestExam = historyRows.sort((a, b) => b.date - a.date)[0];
    if (latestExam) features.exams = laterFeatureDay(features.exams, analytics.dateKey(latestExam.date));
    const latestStudy = historyRows.filter(item => String(item.row?.sessionKind || item.row?.mode || "").toLowerCase().includes("estudio"))[0];
    if (latestStudy) features.studyPlus = laterFeatureDay(features.studyPlus, analytics.dateKey(latestStudy.date));
    const latestPomodoro = (Array.isArray(pomodoroLog) ? pomodoroLog : [])
        .map(row => analytics.toDate(row?.completedAt || row?.timestamp || row?.createdAt))
        .filter(Boolean)
        .sort((a, b) => b - a)[0];
    if (latestPomodoro) features.pomodoro = laterFeatureDay(features.pomodoro, analytics.dateKey(latestPomodoro));
    return features;
};

async function main() {
    const [directorySnap, leaderboardSnap, metricsSnap] = await Promise.all([
        db.collection("user_directory").get(),
        db.collection("leaderboard").get(),
        db.collection("user_metrics").get()
    ]);
    const leaderboardByUid = new Map(leaderboardSnap.docs.map(docSnap => [docSnap.id, docSnap.data() || {}]));
    const existingByUid = new Map(metricsSnap.docs.map(docSnap => [docSnap.id, docSnap.data() || {}]));
    let planned = 0;
    let written = 0;
    let skipped = 0;
    let batch = db.batch();
    let batchCount = 0;

    const flush = async () => {
        if (!batchCount) return;
        if (WRITE) {
            await batch.commit();
            written += batchCount;
        }
        batch = db.batch();
        batchCount = 0;
    };

    for (const directoryDoc of directorySnap.docs) {
        const uid = directoryDoc.id;
        const directory = directoryDoc.data() || {};
        const leaderboard = leaderboardByUid.get(uid) || {};
        const existing = existingByUid.get(uid) || {};
        const globalStats = parseJson(leaderboard.globalStatsStr, {});
        const history = parseJson(leaderboard.historyStr, []);
        const pomodoroLog = parseJson(leaderboard.pomodoroLogStr, []);
        const studyCalendar = parseJson(leaderboard.studyCalendarStr, {});
        const registeredAt = earliestDate(directory.authCreatedAt, directory.createdAt, leaderboard.createdAt) || MIGRATION_STARTED_AT;
        const lastActiveAt = latestDate(directory.lastSeenAt, leaderboard.lastUpdate, ...history.map(row => row?.timestamp || row?.createdAt), registeredAt) || registeredAt;
        const lastActivityDay = analytics.dateKey(lastActiveAt);
        const calendarDaily = deriveCalendarDaily(studyCalendar);
        const existingForBuild = {
            ...existing,
            daily: analytics.mergeDaily(existing.daily || [], calendarDaily),
            features: getLatestFeatureDays(history, pomodoroLog, existing.features)
        };
        const core = analytics.buildMetricDocument({
            uid,
            globalStats,
            history,
            pomodoroLog,
            existing: existingForBuild,
            today: lastActivityDay,
            featureUpdates: existingForBuild.features,
            historyApproximate: true
        });
        core.activityDays = analytics.normalizeDayList([
            ...core.activityDays,
            ...Object.keys(studyCalendar || {}),
            lastActivityDay
        ]);
        core.daily = analytics.mergeDaily(core.daily, calendarDaily);
        const expected = {
            ...core,
            registeredAt,
            trackingStartedAt: analytics.toDate(existing.trackingStartedAt) || MIGRATION_STARTED_AT,
            lastActiveAt,
            updatedAt: MIGRATION_STARTED_AT
        };
        if (documentsMatch(existing, expected)) {
            skipped += 1;
            continue;
        }
        planned += 1;
        console.log(`${WRITE ? "Se migrará" : "Se migraría"} ${uid}: ${core.activityDays.length} días, ${core.cumulative.sessions} sesiones, ${core.cumulative.answered} preguntas.`);
        if (WRITE) {
            batch.set(db.collection("user_metrics").doc(uid), expected, { merge: false });
            batchCount += 1;
            if (batchCount >= 400) await flush();
        }
    }
    await flush();
    console.log("Resumen:", {
        mode: WRITE ? "ESCRITURA" : "SIMULACIÓN",
        directoryUsers: directorySnap.size,
        leaderboardUsers: leaderboardSnap.size,
        existingMetrics: metricsSnap.size,
        planned,
        written,
        skipped
    });
    if (!WRITE) console.log("Simulación terminada. Revisa el resumen antes de ejecutar con --write.");
}

main().catch(err => {
    console.error("No se pudo migrar user_metrics:", err && err.stack ? err.stack : err);
    process.exit(1);
});
