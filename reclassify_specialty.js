const fs = require('fs');
const path = require('path');

const DRY = process.argv.includes('--dry');

const questionsPath = path.join(__dirname, 'questions.js');
const temarioPath = path.join(__dirname, 'temario_out.txt');

function norm(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getSpecialtyCode(name) {
  const n = norm(name);
  if (!n) return null;
  if (n.includes('ginecolog')) return 'gyo';
  if (n.includes('obstetric')) return 'gyo';
  if (n.includes('pediatr')) return 'ped';
  if (n.includes('cirug')) return 'cir';
  if (n.includes('medicina interna')) return 'mi';
  if (n.includes('urgenc') || n.includes('toxicolog')) return 'urg';
  if (n.includes('salud publica') || n.includes('epidemiolog')) return 'sp';
  return null;
}

function parseTemarioMap() {
  if (!fs.existsSync(temarioPath)) return { map: {}, stats: { topics: 0, subs: 0 } };
  const raw = fs.readFileSync(temarioPath, 'utf8');
  const clean = raw.replace(/-+Page \(\d+\) Break-+/g, '');
  const lines = clean.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

  let currentSpec = null;
  const map = {};
  let topicCount = 0;
  let subCount = 0;

  let buffer = null;

  function flushBuffer() {
    if (!buffer || !currentSpec) return;
    const match = buffer.match(/^\d+\.\s*(.+)$/);
    if (!match) {
      buffer = null;
      return;
    }

    let topic = match[1].trim();
    let subPart = '';

    const openIdx = topic.indexOf('(');
    const closeIdx = topic.lastIndexOf(')');
    if (openIdx !== -1 && closeIdx !== -1 && closeIdx > openIdx) {
      subPart = topic.substring(openIdx + 1, closeIdx).trim();
      topic = topic.substring(0, openIdx).trim();
    }

    if (topic) {
      const nt = norm(topic);
      if (nt && !map[nt]) {
        map[nt] = currentSpec;
        topicCount++;
      }
    }

    if (subPart) {
      const subs = subPart.split('/').map(s => s.trim()).filter(Boolean);
      subs.forEach(s => {
        const ns = norm(s.replace(/^\(|\)$/g, '').trim());
        if (ns && !map[ns]) {
          map[ns] = currentSpec;
          subCount++;
        }
      });
    }

    buffer = null;
  }

  for (const line of lines) {
    if (line === 'â€¢' || line === '•') {
      flushBuffer();
      buffer = '';
      continue;
    }

    const spec = getSpecialtyCode(line);
    if (spec) {
      flushBuffer();
      currentSpec = spec;
      continue;
    }

    if (buffer !== null) {
      buffer += (buffer ? ' ' : '') + line;
    }
  }

  flushBuffer();

  return { map, stats: { topics: topicCount, subs: subCount } };
}

function inferExplicitFromTema(tema) {
  const t = norm(tema);
  if (!t) return null;
  if (t.includes('pediatria')) return 'ped';
  if (t.includes('ginecologia') || t.includes('obstetricia')) return 'gyo';
  if (t.includes('cirugia')) return 'cir';
  if (t.includes('medicina interna')) return 'mi';
  if (t.includes('salud publica')) return 'sp';
  if (t.includes('urgencias') || t.includes('atls') || t.includes('acls') || t.includes('bls')) return 'urg';
  return null;
}

const keywordSets = {
  gyo: [
    'embarazo', 'gestacion', 'gestante', 'embarazada', 'preeclampsia', 'eclampsia', 'parto',
    'puerperio', 'cesarea', 'amenorrea', 'sangrado uterino', 'cervix', 'cervical',
    'uterino', 'endometrio', 'ovario', 'trompa', 'placenta', 'aborto', 'menarquia', 'menopausia',
    'dispareunia', 'mastitis puerperal'
  ],
  ped: [
    'recien nacido', 'neonato', 'lactante', 'preescolar', 'escolar', 'pediatr',
    'apgar', 'prematuro', 'sala de cunero', 'tamiz neonatal'
  ],
  cir: [
    'apendicitis', 'colecistitis', 'hernia', 'pancreatitis', 'obstruccion intestinal',
    'peritonitis', 'abdomen agudo', 'trauma', 'fractura', 'quemadura', 'litiasis renal',
    'urologia', 'prostata', 'hemorragia digestiva', 'varices esofagicas'
  ],
  urg: [
    'acls', 'bls', 'atls', 'intoxicacion', 'paro cardiorrespiratorio', 'rcp', 'choque', 'sepsis',
    'sala de choque', 'toxicologia'
  ],
  sp: [
    'epidemiologia', 'sensibilidad', 'especificidad', 'valor predictivo', 'prevalencia', 'incidencia',
    'tasa', 'tamizaje', 'nom', 'vacunacion', 'riesgo relativo', 'odds ratio'
  ],
  mi: [
    'diabetes', 'hipertension', 'epoc', 'asma', 'infarto', 'iam', 'insuficiencia cardiaca',
    'tuberculosis', 'vih', 'lupus', 'artritis', 'cirrosis', 'hepatitis', 'neumonia', 'evc'
  ]
};

function scoreKeywords(text, keywords) {
  let score = 0;
  for (const kw of keywords) {
    if (!kw) continue;
    const n = norm(kw);
    if (!n) continue;
    if (text.includes(n)) score++;
  }
  return score;
}

const maleRe = /\b(masculino|hombre|varon|varón)\b/i;

function shouldForceReclass(q, text) {
  if (q.specialty === 'gyo' && maleRe.test(text)) return true;
  return false;
}

const { map: temarioMap, stats } = parseTemarioMap();

const questions = require('./questions.js');

let changed = 0;
let changes = [];

for (let i = 0; i < questions.length; i++) {
  const q = questions[i];
  const temaNorm = norm(q.tema);
  const subNorm = norm(q.subtema);

  let inferred = null;
  let reason = null;

  if (subNorm && temarioMap[subNorm]) {
    inferred = temarioMap[subNorm];
    reason = 'subtema-temario';
  } else if (temaNorm && temarioMap[temaNorm]) {
    inferred = temarioMap[temaNorm];
    reason = 'tema-temario';
  } else {
    const explicit = inferExplicitFromTema(q.tema || '');
    if (explicit) {
      inferred = explicit;
      reason = 'tema-explicit';
    }
  }

  const text = norm([q.tema, q.subtema, q.case, q.question, (q.options || []).join(' '), q.explanation, q.gpcReference].join(' '));

  if (!inferred && shouldForceReclass(q, text)) {
    const scores = {
      gyo: scoreKeywords(text, keywordSets.gyo),
      ped: scoreKeywords(text, keywordSets.ped),
      cir: scoreKeywords(text, keywordSets.cir),
      urg: scoreKeywords(text, keywordSets.urg),
      sp: scoreKeywords(text, keywordSets.sp),
      mi: scoreKeywords(text, keywordSets.mi)
    };

    const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const bestSpec = entries[0][0];
    const bestScore = entries[0][1];
    const secondScore = entries[1] ? entries[1][1] : 0;

    if (bestScore >= 2 && bestScore >= secondScore + 1) {
      inferred = bestSpec;
      reason = 'keywords-forced';
    }
  }

  if (inferred && inferred !== q.specialty) {
    changes.push({ index: i, from: q.specialty, to: inferred, tema: q.tema, subtema: q.subtema, reason });
    q.specialty = inferred;
    changed++;
  }
}

console.log(`Temario map: ${stats.topics} topics, ${stats.subs} subtopics`);
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
