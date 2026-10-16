const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const rules = fs.readFileSync(path.join(root, "firestore.rules"), "utf8");

assert.match(app, /const REVIEW_INTERVALS_DAYS = \[0, 1, 3, 7, 14, 30\]/);
assert.match(app, /const nextReview = buckets\.late\[0\] \|\| buckets\.today\[0\]/);
assert.doesNotMatch(app, /const targets = \[oneDay, sevenDays, thirtyDays\]/);
assert.match(app, /questionFingerprint: getReviewQuestionFingerprint\(q\)/);
assert.match(app, /completeReviewQueueItem\(reviewQueueItemId, passedReview \? "good" : "again"\)/);
assert.match(app, /if \(rating === "again"\) \{\s*\/\/ Debe seguir visible hoy:[\s\S]*?item\.lastCompletedDate = null/);
assert.match(app, /onclick="window\.startQueuedReview\('/);
assert.doesNotMatch(app, /window\.completeStudyReviewItem/);
assert.match(app, /scaleStudyStr: JSON\.stringify\(State\.scaleStudy \|\| \{\}\)/);
assert.match(rules, /"reviewQueueStr", "scaleStudyStr", "topicMasteryStr"/);
assert.match(app, /const getSmartReviewTopicPriorities = \(limit = 3\) =>/);
assert.match(app, /const getRecentTopicOutcomes = \(days = 30\) =>/);
assert.match(app, /\.filter\(entry => entry\.attempts > 0 && entry\.wrong > 0\)/);
assert.match(app, /const recordTopicOmission = \(specialtyKey, tema\) =>/);
assert.match(app, /const startSmartReviewSession = async \(priorities, qty, label, triggerButton = null\) =>/);
assert.match(app, /const buildBalancedSmartReviewSet = \(priorities, qty\) =>/);
assert.match(app, /return selected\.map\(\(question, index\) => \(\{[\s\S]*?caseGroupId: index \+ 1/);
assert.doesNotMatch(app, /State\.topFailedTemas && State\.topFailedTemas\.length > 0/);

// Exercise the actual priority functions with a new failure beside an old,
// historically weak topic. The recent failure must become visible immediately.
const priorityStart = app.indexOf("    const getPendingReviewCountsByTopic =");
const priorityEnd = app.indexOf("    const deriveTopicMasteryState =", priorityStart);
assert.ok(priorityStart >= 0 && priorityEnd > priorityStart);
const state = { reviewQueue: [], history: [], globalStats: { byTema: {
    Antiguo: { total: 20, correct: 1, specialty: "mi" },
    Nuevo: { total: 1, correct: 0, specialty: "ped", recentResults: [{ at: Date.now(), correct: false, omitted: false }] }
} } };
const prioritize = new Function("State", "ensureStudySystemsState", "sanitizeTopicLabel", "getCaseCanonicalTopic",
    `${app.slice(priorityStart, priorityEnd)}\nreturn getSmartReviewTopicPriorities;`)(state, () => {}, value => value, question => question.tema);
assert.equal(prioritize()[0].topic, "Nuevo", "un fallo reciente aparece antes que los fallos antiguos");
state.globalStats.byTema.Nuevo.recentResults = [{ at: Date.now(), correct: true, omitted: false }];
assert.equal(prioritize().some(entry => entry.topic === "Nuevo"), false, "un tema recuperado sale de la lista");

const { aggregate } = require("../server/study-service");
const at = Date.now();
const exam = { id: "topic-test-0001", questionSet: [{ tema: "Reciente", specialty: "ped", question: "Caso", answerIndex: 1, options: ["A", "B"] }],
    answers: [{ selected: 0, answeredAt: at }], mode: "simulacro", currentExamType: "Prueba", timeZone: "America/Mexico_City",
    paused: true, elapsedSec: 0, runningSince: at, finishObservedAt: at };
const saved = JSON.parse(aggregate({}, exam, at).data.globalStatsStr).byTema.Reciente;
assert.equal(saved.total, 1);
assert.deepEqual(saved.recentResults, [{ at, correct: false, omitted: false }]);

console.log("Spaced repetition contract: OK");
