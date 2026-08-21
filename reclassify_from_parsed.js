const fs = require('fs');
const path = require('path');

const DRY = process.argv.includes('--dry');
const questionsPath = path.join(__dirname, 'questions.js');

function norm(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeSpec(spec) {
  if (!spec) return spec;
  if (spec === 'gine') return 'gyo';
  return spec;
}

const epiKeywords = [
  'sensibilidad',
  'especificidad',
  'valor predictivo',
  'razon de verosimilitud',
  'likelihood ratio',
  'odds ratio',
  'riesgo relativo',
  'intervalo de confianza',
  'incidencia',
  'prevalencia',
  'cohorte',
  'casos y controles',
  'ensayo clinico',
  'p valor'
];

function countHits(text, keywords) {
  let hits = 0;
  for (const kw of keywords) {
    if (text.includes(kw)) hits++;
  }
  return hits;
}

function inferSpecFromTema(tema) {
  const t = norm(tema);
  if (!t) return null;
  if (t.includes('ginecolog') || t.includes('obstetric') || t.includes('oncologia ginecolog')) return 'gyo';
  if (t.includes('pediatr')) return 'ped';
  if (t.includes('cirug')) return 'cir';
  if (t.includes('urgenc') || t.includes('atls') || t.includes('acls') || t.includes('bls')) return 'urg';
  if (t.includes('salud publica') || t.includes('epidemiolog') || t.includes('bioestad')) return 'sp';
  if (t.includes('medicina interna')) return 'mi';
  if (t.includes('cardiolog') || t.includes('nefrolog') || t.includes('reumatolog') || t.includes('neurolog') || t.includes('infectolog')) return 'mi';
  return null;
}

function overrideSpecFromText(q) {
  const text = norm([
    q.tema,
    q.subtema,
    q.case,
    q.question,
    (q.options || []).join(' '),
    q.explanation,
    q.gpcReference
  ].join(' '));

  if (!text) return null;

  if (text.includes('atls') || text.includes('acls') || text.includes('bls')) return 'urg';
  if (text.includes('intoxicacion') || text.includes('toxicologia')) return 'urg';

  const epiHits = countHits(text, epiKeywords);
  if (epiHits >= 2) return 'sp';

  return null;
}

function inferFromMaleGyoCase(q) {
  const text = norm([
    q.tema,
    q.subtema,
    q.case,
    q.question,
    (q.options || []).join(' '),
    q.explanation,
    q.gpcReference
  ].join(' '));

  if (!text) return null;

  if (text.includes('pancreatitis')) return 'cir';
  if (text.includes('colecist') || text.includes('murphy')) return 'cir';
  if (text.includes('apendicitis')) return 'cir';
  if (text.includes('paracetamol') || text.includes('acetaminofen')) return 'urg';
  if (text.includes('opioide') || text.includes('miosis') || text.includes('naloxona')) return 'urg';
  if (text.includes('intoxicacion')) return 'urg';
  if (text.includes('linfoma') || text.includes('oncohemato') || text.includes('adenopatia')) return 'mi';
  if (text.includes('temblor esencial') || text.includes('parkinson')) return 'mi';
  if (text.includes('polifarmacia') || text.includes('beers') || text.includes('stopp') || text.includes('start')) return 'mi';
  if (text.includes('ginecomastia')) return 'mi';
  if (text.includes('sepsis') || text.includes('choque septico') || text.includes('lactato')) return 'urg';
  if (text.includes('sdra') || text.includes('dificultad respiratoria aguda') || text.includes('pao2')) return 'urg';

  return null;
}

const parsedFiles = [
  'parsed_ciru2.json',
  'parsed_ciru3.json',
  'parsed_ciru4.json',
  'parsed_gine2.json',
  'parsed_new_pdfs.json',
  'parsed_pedia.json',
  'parsed_pedia2.json',
  'parsed_questions.json'
];

const caseToSpec = new Map();
const conflicts = [];

for (const file of parsedFiles) {
  const full = path.join(__dirname, file);
  if (!fs.existsSync(full)) continue;
  const data = JSON.parse(fs.readFileSync(full, 'utf8'));
  if (!Array.isArray(data)) continue;

  for (const item of data) {
    if (!item) continue;

    let spec = normalizeSpec(item.specialty);
    if (file === 'parsed_questions.json') {
      const inferred = inferSpecFromTema(item.tema || '');
      if (!inferred) continue; // skip ambiguous topics from parsed_questions
      spec = inferred;
    }

    if (!spec) continue;

    const caseText = item.case || item.case_text || '';
    if (!caseText) continue;

    const key = norm(caseText);
    if (!key) continue;

    if (caseToSpec.has(key)) {
      const prev = caseToSpec.get(key);
      if (prev.spec !== spec) conflicts.push({ file, prev: prev.spec, spec, sample: caseText.slice(0, 80) });
      continue;
    }

    caseToSpec.set(key, { spec, source: file });
  }
}

const questions = require('./questions.js');
let changed = 0;
let changes = [];

const maleRe = /\b(masculino|hombre|varon|varón)\b/i;

for (let i = 0; i < questions.length; i++) {
  const q = questions[i];
  const caseText = q.case || q.case_text || '';
  if (!caseText) continue;
  const key = norm(caseText);
  if (!key) continue;

  let inferred = q.specialty;

  const mapped = caseToSpec.get(key);
  if (mapped) {
    inferred = mapped.spec;
    if (mapped.source === 'parsed_questions.json') {
      const override = overrideSpecFromText(q);
      if (override) inferred = override;
    }
  }

  if (inferred === 'gyo' && maleRe.test(caseText)) {
    const forced = inferFromMaleGyoCase(q);
    if (forced) inferred = forced;
  }

  if (inferred && q.specialty !== inferred) {
    changes.push({ index: i, from: q.specialty, to: inferred, tema: q.tema, source: mapped ? mapped.source : 'heuristic' });
    q.specialty = inferred;
    changed++;
  }
}

console.log(`Parsed case map: ${caseToSpec.size} cases`);
console.log(`Conflicts: ${conflicts.length}`);
if (conflicts.length) console.log(conflicts.slice(0, 5));
console.log(`Total questions: ${questions.length}`);
console.log(`Specialty changes: ${changed}`);
console.log(changes.slice(0, 20));

if (!DRY && changed > 0) {
  const backup = questionsPath + '.bak';
  fs.writeFileSync(backup, fs.readFileSync(questionsPath, 'utf8'), 'utf8');
  const out = "// questions.js â€“ Banco de reactivos para ENARMlab\n" +
    "const QUESTIONS = " + JSON.stringify(questions, null, 2) + ";\n\n" +
    "if (typeof module !== 'undefined') {\n  module.exports = QUESTIONS;\n}\n";
  fs.writeFileSync(questionsPath, out, 'utf8');
  console.log(`Backup written to ${backup}`);
  console.log('questions.js updated');
} else if (DRY) {
  console.log('Dry run only; no files changed.');
}
