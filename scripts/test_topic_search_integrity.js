const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const raw = fs.readFileSync(path.join(ROOT, "questions.js"), "utf8");
const start = raw.indexOf("[");
const end = raw.lastIndexOf("]") + 1;
const questions = JSON.parse(raw.slice(start, end));

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const byTopic = new Map();
for (const q of questions) {
  const topic = String(q.temaCanonical || q.tema || "").trim();
  const key = normalize(topic);
  if (!key) continue;
  if (!byTopic.has(key)) byTopic.set(key, { label: topic, count: 0, specs: new Set() });
  const row = byTopic.get(key);
  row.count += 1;
  row.specs.add(String(q.specialty || "").trim());
}

let leakageTopicOnly = 0;
let leakageTopicSpec = 0;
let testedTopicSpecCombos = 0;

for (const [key, meta] of byTopic.entries()) {
  const topicPool = questions.filter(q => normalize(q.temaCanonical || q.tema || "") === key);
  if (topicPool.length !== meta.count) leakageTopicOnly++;
  for (const q of topicPool) {
    if (normalize(q.temaCanonical || q.tema || "") !== key) leakageTopicOnly++;
  }

  for (const spec of meta.specs) {
    testedTopicSpecCombos++;
    const topicSpecPool = questions.filter(q => (
      String(q.specialty || "").trim() === spec
      && normalize(q.temaCanonical || q.tema || "") === key
    ));
    for (const q of topicSpecPool) {
      if (String(q.specialty || "").trim() !== spec || normalize(q.temaCanonical || q.tema || "") !== key) {
        leakageTopicSpec++;
      }
    }
  }
}

const result = {
  totalCases: questions.length,
  totalTopics: byTopic.size,
  testedTopicSpecCombos,
  checks: {
    leakageTopicOnly,
    leakageTopicSpec
  },
  acceptance: {
    topicFilterNoLeakage: leakageTopicOnly === 0,
    topicPlusSpecialtyNoLeakage: leakageTopicSpec === 0
  }
};

console.log(JSON.stringify(result, null, 2));
