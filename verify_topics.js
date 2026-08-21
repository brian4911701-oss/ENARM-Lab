const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const raw = fs.readFileSync(path.join(ROOT, "questions.js"), "utf8");
const startIdx = raw.indexOf("[");
const endIdx = raw.lastIndexOf("]") + 1;
const questions = JSON.parse(raw.substring(startIdx, endIdx));

const normalize = (value) => String(value || "")
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const troncal = new Set(["mi", "ped", "gyo", "cir"]);
const bySpec = {};
const byTema = {};
const seenCase = new Map();
let duplicateCaseCount = 0;
let outOfTroncal = 0;
let missingTemaCanonical = 0;
let missingTema = 0;

questions.forEach((q) => {
  const spec = String(q.specialty || "");
  bySpec[spec] = (bySpec[spec] || 0) + 1;
  if (!troncal.has(spec)) outOfTroncal++;

  const temaCanonical = String(q.temaCanonical || "").trim();
  const tema = String(q.tema || "").trim();
  if (!temaCanonical) missingTemaCanonical++;
  if (!tema) missingTema++;

  const topic = temaCanonical || tema || "SIN_TEMA";
  byTema[topic] = (byTema[topic] || 0) + 1;

  const caseKey = normalize(q.case || "");
  if (caseKey) {
    if (seenCase.has(caseKey)) duplicateCaseCount++;
    else seenCase.set(caseKey, 1);
  }
});

const topTopics = Object.entries(byTema)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)
  .map(([topic, count]) => ({ topic, count }));

const result = {
  total: questions.length,
  bySpec,
  checks: {
    outOfTroncal,
    missingTemaCanonical,
    missingTema,
    duplicateCaseCount
  },
  acceptance: {
    onlyFourTroncales: outOfTroncal === 0,
    allHaveTemaCanonical: missingTemaCanonical === 0
  },
  topTopics
};

console.log(JSON.stringify(result, null, 2));
