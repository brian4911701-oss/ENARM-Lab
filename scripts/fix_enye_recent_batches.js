const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const QUESTIONS_PATH = path.join(ROOT, 'questions.js');
const SUMMARY_500_PATH = path.join(ROOT, 'reports', 'batch_500_curated_summary_live.json');
const SUMMARY_40_PATH = path.join(ROOT, 'reports', 'ped_diarrhea_curated40_summary_live.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadQuestions() {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const loaded = require(QUESTIONS_PATH);
  if (Array.isArray(loaded)) return loaded;
  if (Array.isArray(loaded.questions)) return loaded.questions;
  if (Array.isArray(loaded.default)) return loaded.default;
  throw new Error('No se pudo leer arreglo de preguntas desde questions.js');
}

function inRanges(index, ranges) {
  return ranges.some((r) => index >= r.start && index < r.end);
}

function applyEnyeFixes(text) {
  let out = String(text);

  const replacements = [
    [/\bNinos\b/g, 'Niños'],
    [/\bNinas\b/g, 'Niñas'],
    [/\bNino\b/g, 'Niño'],
    [/\bNina\b/g, 'Niña'],
    [/\bninos\b/g, 'niños'],
    [/\bninas\b/g, 'niñas'],
    [/\bnino\b/g, 'niño'],
    [/\bnina\b/g, 'niña'],
    [/\banos\b/g, 'años'],
    [/\bAno\b/g, 'Año']
  ];

  for (const [regex, value] of replacements) {
    out = out.replace(regex, value);
  }
  return out;
}

function normalizeValue(value, counters) {
  if (typeof value === 'string') {
    const fixed = applyEnyeFixes(value);
    if (fixed !== value) {
      counters.stringChanges += 1;
    }
    return fixed;
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(item, counters));
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, val] of Object.entries(value)) {
      out[key] = normalizeValue(val, counters);
    }
    return out;
  }
  return value;
}

function saveQuestions(questions) {
  const content =
    '// questions.js - Banco de reactivos para ENARMlab\n' +
    'const QUESTIONS = ' +
    JSON.stringify(questions, null, 2) +
    ';\n\n' +
    "if (typeof module !== 'undefined') {\n" +
    '  module.exports = QUESTIONS;\n' +
    '}\n';

  fs.writeFileSync(QUESTIONS_PATH, content, 'utf8');
}

function main() {
  const summary500 = readJson(SUMMARY_500_PATH);
  const summary40 = readJson(SUMMARY_40_PATH);
  const questions = loadQuestions();

  const ranges = [
    {
      name: 'batch_500',
      start: summary500.initialBank,
      end: summary500.finalBank
    },
    {
      name: 'batch_40_ped_diarrea',
      start: summary40.initialBank,
      end: summary40.finalBank
    }
  ];

  for (const r of ranges) {
    if (
      typeof r.start !== 'number' ||
      typeof r.end !== 'number' ||
      r.start < 0 ||
      r.end > questions.length ||
      r.end < r.start
    ) {
      throw new Error(`Rango invalido ${r.name}: ${r.start}-${r.end}`);
    }
  }

  const counters = {
    touchedRecords: 0,
    changedRecords: 0,
    stringChanges: 0
  };

  for (let i = 0; i < questions.length; i += 1) {
    if (!inRanges(i, ranges)) continue;
    counters.touchedRecords += 1;
    const before = JSON.stringify(questions[i]);
    const fixed = normalizeValue(questions[i], counters);
    const after = JSON.stringify(fixed);
    if (before !== after) {
      counters.changedRecords += 1;
      questions[i] = fixed;
    }
  }

  saveQuestions(questions);

  console.log(
    JSON.stringify(
      {
        totalQuestions: questions.length,
        ranges,
        touchedRecords: counters.touchedRecords,
        changedRecords: counters.changedRecords,
        stringChanges: counters.stringChanges
      },
      null,
      2
    )
  );
}

main();
