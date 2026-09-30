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
assert.match(app, /\.filter\(entry => entry\.attempts >= 3 && entry\.wrong > 0\)/);
assert.match(app, /const recordTopicOmission = \(specialtyKey, tema\) =>/);
assert.match(app, /const startSmartReviewSession = async \(priorities, qty, label, triggerButton = null\) =>/);
assert.match(app, /const buildBalancedSmartReviewSet = \(priorities, qty\) =>/);
assert.doesNotMatch(app, /State\.topFailedTemas && State\.topFailedTemas\.length > 0/);

console.log("Spaced repetition contract: OK");
