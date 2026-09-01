const assert = require("assert");
const analytics = require("../analytics-core");

const atNoon = day => new Date(`${day}T18:00:00Z`);
const now = atNoon("2026-08-25");

const metrics = [
    {
        uid: "u1",
        registeredAt: atNoon("2026-07-20"),
        activityDays: ["2026-07-21", "2026-07-27", "2026-08-19", "2026-08-25"],
        daily: [{ day: "2026-08-25", sessions: 1, answered: 20, correct: 15, studySeconds: 1800, pomodoros: 1, simulations: 1 }],
        cumulative: { sessions: 4, answered: 80, correct: 60, studySeconds: 7200, pomodoros: 3, simulations: 3 },
        bySpecialty: { mi: { answered: 20, correct: 15 }, ped: { answered: 20, correct: 15 }, gyo: { answered: 20, correct: 15 }, cir: { answered: 20, correct: 15 } },
        features: { exams: "2026-08-25", pomodoro: "2026-08-25" }
    },
    {
        uid: "u2",
        registeredAt: atNoon("2026-08-24"),
        activityDays: ["2026-08-24", "2026-08-25"],
        daily: [{ day: "2026-08-25", sessions: 1, answered: 10, correct: 5, studySeconds: 600, pomodoros: 0, simulations: 0 }],
        cumulative: { sessions: 2, answered: 20, correct: 10, studySeconds: 1200, pomodoros: 0, simulations: 0 },
        bySpecialty: { mi: { answered: 20, correct: 10 }, ped: { answered: 0, correct: 0 }, gyo: { answered: 0, correct: 0 }, cir: { answered: 0, correct: 0 } },
        features: { studyPlus: "2026-08-25" }
    }
];

const directory = [
    { uid: "u1", createdAt: atNoon("2026-07-20"), lastSeenAt: new Date(now.getTime() - 2 * 60 * 1000) },
    { uid: "u2", createdAt: atNoon("2026-08-24"), lastSeenAt: new Date(now.getTime() - 20 * 60 * 1000) },
    { uid: "u3", createdAt: atNoon("2026-08-10"), lastSeenAt: atNoon("2026-08-10") }
];

const result = analytics.computeDashboard({
    metrics,
    directory,
    entitlements: [{ id: "u1", uid: "u1", status: "active", source: "manual_transfer", planId: "enarm_2026", activatedAt: atNoon("2026-08-22"), expiresAt: atNoon("2026-10-01") }],
    payments: [
        { uid: "u1", status: "approved", amount: 399, reviewedAt: atNoon("2026-08-22") },
        { uid: "u2", status: "pending", amount: 1999, notifiedAt: atNoon("2026-08-23") }
    ],
    referrals: [{ uid: "u2", referralCode: "ELABC123", coins: 50, createdAt: atNoon("2026-08-24") }],
    ratings: [{ stars: 5, experienceQualified: true }, { stars: 4, experienceQualified: true }, { stars: 1 }],
    feedback: [{ createdAt: atNoon("2026-08-24") }],
    reports: [{ timestamp: atNoon("2026-08-24").getTime() }]
}, 7, now);

assert.equal(result.growth.total, 3, "incluye usuarios aunque todavía no tengan user_metrics");
assert.equal(result.activity.online, 1);
assert.equal(result.activity.dau, 2);
assert.equal(result.activity.wau, 2);
assert.equal(result.activity.mau, 2);
assert.equal(result.activity.newActive, 1);
assert.equal(result.activity.returning, 1);
assert.equal(result.study.sessions, 2);
assert.equal(result.study.answered, 30);
assert.equal(result.study.correct, 20);
assert.equal(Math.round(result.study.accuracy), 67);
assert.equal(result.retention.d1.retained, 2);
assert.equal(result.premium.active, 1);
assert.equal(result.payments.revenue, 399);
assert.equal(result.payments.pending, 1);
assert.equal(result.referrals.acquired, 1);
assert.equal(result.satisfaction.average, 4.5);
assert.equal(result.satisfaction.feedback, 1);
assert.equal(result.satisfaction.reports, 1);

const document = analytics.buildMetricDocument({
    uid: "test",
    globalStats: { sesiones: 3, respondidas: 30, aciertos: 21, pomodoros: 2, bySpecialty: { mi: { total: 30, correct: 21 } } },
    history: [{ timestamp: now.getTime(), preguntas: 10, correct: 7, elapsedSec: 900, sessionKind: "simulacro" }],
    pomodoroLog: [
        { completedAt: now.getTime(), mode: "focus" },
        { completedAt: now.getTime(), mode: "shortBreak" }
    ],
    today: "2026-08-25"
});
assert.equal(document.cumulative.sessions, 3);
assert.equal(document.cumulative.answered, 30);
assert.equal(document.daily[0].pomodoros, 1, "no cuenta descansos como Pomodoros");
assert.deepEqual(Object.keys(document.bySpecialty), ["mi", "ped", "gyo", "cir"]);

console.log("Analytics core: todas las pruebas pasaron.");
