const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const QUESTIONS_PATH = path.join(ROOT, "questions.js");
const REPORT_DIR = path.join(ROOT, "reports");
const CLI_DRY_RUN = process.argv.includes("--dry");

function getArg(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return "";
  return process.argv[idx + 1] || "";
}

const TRONCAL = ["mi", "ped", "gyo", "cir"];

const BLOCK_INFO = {
  ped: { order: 1, slug: "pediatria", label: "Pediatria", fallbackTopic: "Pediatria General" },
  gyo: { order: 2, slug: "gyo", label: "Ginecologia y Obstetricia", fallbackTopic: "Ginecologia y Obstetricia General" },
  cir: { order: 3, slug: "cirugia", label: "Cirugia", fallbackTopic: "Cirugia General" },
  mi: { order: 4, slug: "mi", label: "Medicina Interna", fallbackTopic: "Medicina Interna General" }
};

const SPEC_KEYWORDS = {
  ped: [
    "pediatr", "nino", "nina", "lactante", "preescolar", "escolar", "adolescente",
    "neonato", "recien nacido", "apgar", "tamiz", "vacuna", "cartilla de vacunacion"
  ],
  gyo: [
    "embarazo", "gestacion", "gestante", "parto", "puerper", "cesarea", "control prenatal",
    "preeclamps", "eclamps", "placenta", "uter", "ovario", "cervix", "vaginal", "obstetric", "cacu"
  ],
  cir: [
    "cirug", "apendicitis", "colecist", "pancreatitis", "hernia", "fractura", "trauma",
    "atls", "quemadura", "obstruccion intestinal", "peritonitis", "quirurg", "dehiscencia"
  ],
  mi: [
    "diabetes", "hipertension", "epoc", "asma", "vih", "tuberculosis", "insuficiencia",
    "lupus", "artritis", "nefro", "neuro", "endocrino", "cardio", "hepatitis", "cirrosis",
    "enfermedad renal", "infarto", "sepsis", "tiroid"
  ]
};

const TOPIC_RULES = {
  ped: [
    { topic: "Ictericia Neonatal", words: ["ictericia neonatal", "hiperbilirrub", "kernicterus", "coombs", "incompatibilidad abo", "incompatibilidad rh"] },
    { topic: "Patologia Neonatal Infecciosa", words: ["sepsis neonatal", "corioamnionitis", "sifilis congenita", "prematuro", "retinopatia del prematuro", "aspiracion de meconio", "taquipnea transitoria"] },
    { topic: "Reanimacion Neonatal", words: ["reanimacion neonatal", "nrp", "apgar bajo", "ventilacion con presion positiva"] },
    { topic: "Vacunacion", words: ["vacuna", "esquema de vacunacion", "bcg", "pentavalente", "srp", "rotavirus"] },
    { topic: "Patologia Respiratoria del Pediatrico", words: ["bronquiolitis", "neumonia pediatrica", "crup", "laringotraque", "epiglotitis", "tos ferina"] },
    { topic: "Patologia Gastrointestinal del Pediatrico", words: ["diarrea", "gastroenteritis", "deshidratacion", "invaginacion", "rehidratacion oral", "hirschsprung"] },
    { topic: "Uropedia", words: ["reflujo vesicoureteral", "infeccion urinaria", "hidronefrosis", "criptorquidia"] },
    { topic: "Neurologia Pediatrica", words: ["convulsion febril", "crisis febril", "epilepsia", "estado epileptico"] },
    { topic: "Crecimiento y Desarrollo", words: ["crecimiento y desarrollo", "tanner", "desarrollo psicomotor", "pubertad", "peso y talla"] },
    { topic: "Urgencias Pediatricas", words: ["ingesta de causticos", "intoxicacion", "obstruccion de via aerea", "anafilaxia en nino"] }
  ],
  gyo: [
    { topic: "Control Prenatal", words: ["control prenatal", "embarazo de bajo riesgo", "embarazo normal"] },
    { topic: "Preeclampsia e Hipertension en el Embarazo", words: ["preeclamps", "eclamps", "hipertension gestacional", "hellp"] },
    { topic: "Hemorragia Obstetrica", words: ["hemorragia obstetrica", "atonia uterina", "placenta previa", "desprendimiento de placenta", "hemorragia posparto"] },
    { topic: "Trabajo de Parto", words: ["trabajo de parto", "partograma", "fase activa", "distocia", "induccion"] },
    { topic: "Puerperio", words: ["puerperio", "mastitis puerperal", "loquios"] },
    { topic: "Planificacion Familiar y Anticoncepcion", words: ["anticoncepcion", "metodo anticonceptivo", "diu", "levonorgestrel", "planificacion familiar"] },
    { topic: "Infecciones Ginecologicas", words: ["vaginosis", "candidiasis vaginal", "tricomoniasis", "cervicitis", "enfermedad inflamatoria pelvica"] },
    { topic: "Sangrado Uterino Anormal", words: ["sangrado uterino anormal", "metrorragia", "menorragia", "amenorrea"] },
    { topic: "CACU", words: ["cacu", "cancer cervicouterino", "vph", "nic", "papanicolaou"] },
    { topic: "Cancer de Mama", words: ["cancer de mama", "mastografia", "birads", "tumor mamario"] },
    { topic: "Climaterio y Menopausia", words: ["menopausia", "climaterio", "terapia hormonal"] }
  ],
  cir: [
    { topic: "Abdomen Agudo Quirurgico", words: ["abdomen agudo", "apendicitis", "peritonitis", "obstruccion intestinal", "perforacion intestinal"] },
    { topic: "Patologia Biliar y Pancreatica", words: ["colecistitis", "coledocolitiasis", "colangitis", "pancreatitis"] },
    { topic: "Trauma y ATLS", words: ["trauma", "politrauma", "atls", "choque hemorragico", "torax inestable"] },
    { topic: "Hernias y Pared Abdominal", words: ["hernia inguinal", "hernia umbilical", "eventracion", "pared abdominal"] },
    { topic: "Coloproctologia", words: ["hemorroide", "fisura anal", "absceso perianal", "fistula perianal", "diverticulitis"] },
    { topic: "Ortopedia y Fracturas", words: ["fractura", "luxacion", "osteosintesis", "yeso", "reduccion cerrada"] },
    { topic: "Quemaduras y Heridas", words: ["quemadura", "parkland", "escara", "herida penetrante"] },
    { topic: "Complicaciones Postoperatorias", words: ["dehiscencia", "infeccion de sitio quirurgico", "fistula", "sangrado postoperatorio"] },
    { topic: "Urologia Quirurgica", words: ["torsion testicular", "retencion urinaria aguda", "litiasis ureteral obstructiva"] }
  ],
  mi: [
    { topic: "Diabetes", words: ["diabetes", "cetoacidosis", "estado hiperosmolar", "retinopatia diabetica"] },
    { topic: "Hipertension Arterial", words: ["hipertension", "urgencia hipertensiva", "emergencia hipertensiva"] },
    { topic: "Cardiologia Clinica", words: ["infarto", "sica", "angina", "insuficiencia cardiaca", "fibrilacion auricular"] },
    { topic: "Neumologia", words: ["epoc", "asma", "neumonia", "derrame pleural"] },
    { topic: "Infectologia", words: ["vih", "tuberculosis", "sepsis", "endocarditis", "antibiotico"] },
    { topic: "Nefrologia", words: ["insuficiencia renal", "lesion renal aguda", "sindrome nefritico", "sindrome nefrotico"] },
    { topic: "Endocrinologia", words: ["hipotiroidismo", "hipertiroidismo", "tiroiditis", "cushing", "addison"] },
    { topic: "Reumatologia", words: ["lupus", "artritis reumatoide", "vasculitis", "espondilitis"] },
    { topic: "Gastroenterologia y Hepatologia", words: ["cirrosis", "hepatitis", "ascitis", "sangrado de tubo digestivo"] },
    { topic: "Neurologia", words: ["evento vascular cerebral", "epilepsia", "meningitis", "neuropatia"] },
    { topic: "Psiquiatria", words: ["esquizofrenia", "depresion", "trastorno bipolar", "ansiedad"] },
    { topic: "Hematologia", words: ["anemia", "leucemia", "linfoma", "mielodisplas"] }
  ]
};

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeTopic(value) {
  return String(value || "")
    .replace(/\[cite:\s*\d+\]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function readQuestions(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]") + 1;
  if (start === -1 || end === 0) throw new Error("No se encontro QUESTIONS en questions.js");
  return JSON.parse(raw.slice(start, end));
}

function writeQuestions(filePath, questions) {
  const out =
    "// questions.js - Banco de reactivos para ENARMlab\n"
    + "const QUESTIONS = "
    + JSON.stringify(questions, null, 2)
    + ";\n\nif (typeof module !== 'undefined') {\n  module.exports = QUESTIONS;\n}\n";
  fs.writeFileSync(filePath, out, "utf8");
}

function ensureReportDir() {
  if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });
}

function keywordScore(text, words) {
  let score = 0;
  for (const w of words) if (text.includes(w)) score++;
  return score;
}

function caseText(q) {
  const nested = Array.isArray(q.questions)
    ? q.questions.flatMap(sq => [
      sq.question || "",
      ...(Array.isArray(sq.options) ? sq.options : []),
      sq.explanation || "",
      sq.gpcReference || ""
    ]).join(" ")
    : "";
  return normalize([
    q.temaCanonical || "",
    q.tema || "",
    q.subtema || "",
    q.case || "",
    q.question || "",
    Array.isArray(q.options) ? q.options.join(" ") : "",
    q.explanation || "",
    q.gpcReference || "",
    nested
  ].join(" "));
}

function getScores(text) {
  return {
    ped: keywordScore(text, SPEC_KEYWORDS.ped),
    gyo: keywordScore(text, SPEC_KEYWORDS.gyo),
    cir: keywordScore(text, SPEC_KEYWORDS.cir),
    mi: keywordScore(text, SPEC_KEYWORDS.mi)
  };
}

function normalizeSpecialty(rawSpec, scores) {
  const raw = normalize(rawSpec);
  if (TRONCAL.includes(raw)) return raw;
  if (raw.includes("pediatr") || raw.includes("neonat")) return "ped";
  if (raw.includes("ginec") || raw.includes("obstet")) return "gyo";
  if (raw.includes("cirug") || raw.includes("trauma") || raw.includes("ortoped")) return "cir";
  if (raw.includes("urgenc") || raw.includes("salud publica") || raw.includes("epidemiolog")) {
    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    return best && best[1] > 0 ? best[0] : "mi";
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best && best[1] > 0 ? best[0] : "mi";
}

function isPediatricContext(text) {
  if (keywordScore(text, ["nino", "nina", "lactante", "preescolar", "escolar", "adolescente", "neonato", "recien nacido", "pediatr"]) > 0) return true;
  const years = text.match(/\b(\d{1,2})\s*anos\b/);
  if (years && parseInt(years[1], 10) <= 17) return true;
  const months = text.match(/\b(\d{1,3})\s*meses\b/);
  if (months && parseInt(months[1], 10) <= 216) return true;
  if (/\b\d{1,2}\s*(dias|semanas)\s*de\s*vida\b/.test(text)) return true;
  return false;
}

function isMaternalDominant(text) {
  const maternal = keywordScore(text, ["embarazo", "gestante", "parto", "puerper", "cesarea", "control prenatal", "preeclamps", "eclamps"]) > 0;
  const neonate = keywordScore(text, ["neonato", "recien nacido", "lactante"]) > 0;
  return maternal && !neonate;
}

function isGyoContext(text) {
  return keywordScore(text, ["embarazo", "gestante", "parto", "puerper", "obstetric", "uter", "ovario", "cervix", "sangrado uterino", "vaginal", "cacu"]) > 0;
}

function isSurgeryContext(text) {
  return keywordScore(text, ["cirug", "quirurg", "trauma", "fractura", "apendicitis", "colecist", "pancreatitis", "peritonitis", "obstruccion intestinal", "hernia", "quemadura"]) > 0;
}

function isMiContext(text) {
  return keywordScore(text, ["diabetes", "hipertension", "epoc", "asma", "vih", "tuberculosis", "lupus", "nefro", "neuro", "endocrino", "cardio", "sepsis", "insuficiencia renal", "tiroid"]) > 0;
}

function inferTopic(block, text, fallback) {
  const rules = TOPIC_RULES[block] || [];
  for (const rule of rules) {
    if (keywordScore(text, rule.words) > 0) return rule.topic;
  }
  return fallback || BLOCK_INFO[block].fallbackTopic;
}

function shouldMoveToBlock(block, currentSpec, scores, text) {
  const targetScore = scores[block] || 0;
  const otherMax = Math.max(...TRONCAL.filter(s => s !== block).map(s => scores[s] || 0));
  if (currentSpec === block) return { move: false, review: false, targetScore, otherMax, reason: "already_target" };

  if (block === "ped") {
    const strong = isPediatricContext(text) && !isMaternalDominant(text) && targetScore >= 3 && targetScore >= otherMax + 2;
    const neonatal = keywordScore(text, ["recien nacido", "neonato", "lactante"]) > 0 && targetScore >= 2 && targetScore >= otherMax + 1;
    if (strong || neonatal) return { move: true, review: false, targetScore, otherMax, reason: strong ? "high_confidence_ped" : "neonatal_ped" };
    const review = isPediatricContext(text) && targetScore >= 2;
    return { move: false, review, targetScore, otherMax, reason: "ambiguous_ped" };
  }

  if (block === "gyo") {
    const strong = isGyoContext(text) && !isPediatricContext(text) && targetScore >= 3 && targetScore >= otherMax + 2;
    if (strong) return { move: true, review: false, targetScore, otherMax, reason: "high_confidence_gyo" };
    const review = isGyoContext(text) && targetScore >= 2;
    return { move: false, review, targetScore, otherMax, reason: "ambiguous_gyo" };
  }

  if (block === "cir") {
    const strong = isSurgeryContext(text) && targetScore >= 3 && targetScore >= otherMax + 2;
    if (strong) return { move: true, review: false, targetScore, otherMax, reason: "high_confidence_cir" };
    const review = isSurgeryContext(text) && targetScore >= 2;
    return { move: false, review, targetScore, otherMax, reason: "ambiguous_cir" };
  }

  const strong = isMiContext(text) && !isPediatricContext(text) && !isGyoContext(text) && !isSurgeryContext(text) && targetScore >= 3 && targetScore >= otherMax + 2;
  if (strong) return { move: true, review: false, targetScore, otherMax, reason: "high_confidence_mi" };
  const review = isMiContext(text) && targetScore >= 2;
  return { move: false, review, targetScore, otherMax, reason: "ambiguous_mi" };
}

function runBlock(options = {}) {
  const block = String(options.block || "ped").trim().toLowerCase();
  if (!BLOCK_INFO[block]) throw new Error("Bloque invalido. Usa ped|gyo|cir|mi");

  const dryRun = options.dryRun !== undefined ? !!options.dryRun : CLI_DRY_RUN;
  const info = BLOCK_INFO[block];
  const reportPrefix = `block${info.order}_${info.slug}`;
  const reportJson = path.join(REPORT_DIR, `${reportPrefix}_report.json`);
  const reportMd = path.join(REPORT_DIR, `${reportPrefix}_report.md`);
  const reviewJson = path.join(REPORT_DIR, `${reportPrefix}_review_queue.json`);

  const questions = readQuestions(QUESTIONS_PATH);
  const reviewQueue = [];
  const moved = [];
  const topicReassigned = [];
  const movedByOrigin = { mi: 0, ped: 0, gyo: 0, cir: 0, other: 0 };
  const byTopic = {};

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const text = caseText(q);
    const scores = getScores(text);
    const rawCurrent = String(q.specialty || "").trim();
    const currentSpec = normalizeSpecialty(rawCurrent, scores);
    q.specialty = currentSpec;

    const moveEval = shouldMoveToBlock(block, currentSpec, scores, text);
    if (moveEval.move) {
      const fromSpec = TRONCAL.includes(currentSpec) ? currentSpec : "other";
      movedByOrigin[fromSpec] = (movedByOrigin[fromSpec] || 0) + 1;
      if (!q.specialtyOriginal) q.specialtyOriginal = rawCurrent || currentSpec;
      q.specialty = block;
      moved.push({
        index: i,
        from: currentSpec,
        to: block,
        targetScore: moveEval.targetScore,
        otherMax: moveEval.otherMax,
        reason: moveEval.reason,
        casePreview: String(q.case || "").slice(0, 180)
      });
    } else if (moveEval.review) {
      reviewQueue.push({
        index: i,
        currentSpec,
        suggestedSpec: block,
        reason: moveEval.reason,
        scores,
        targetScore: moveEval.targetScore,
        otherMax: moveEval.otherMax,
        temaCanonical: q.temaCanonical || q.tema || "",
        casePreview: String(q.case || "").slice(0, 180)
      });
    }

    if (q.specialty === block) {
      const currentTopic = sanitizeTopic(q.temaCanonical || q.tema || "").trim();
      const inferredTopic = inferTopic(block, text, currentTopic || info.fallbackTopic);
      if (inferredTopic && inferredTopic !== currentTopic) {
        topicReassigned.push({
          index: i,
          oldTopic: currentTopic || "(sin tema)",
          newTopic: inferredTopic,
          casePreview: String(q.case || "").slice(0, 160)
        });
      }
      q.temaCanonical = inferredTopic || currentTopic || info.fallbackTopic;
      q.tema = q.temaCanonical;
      q.subtema = q.temaCanonical;
      byTopic[q.temaCanonical] = (byTopic[q.temaCanonical] || 0) + 1;
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    block,
    blockLabel: info.label,
    dryRun,
    totals: {
      totalCases: questions.length,
      movedToBlock: moved.length,
      topicReassigned: topicReassigned.length,
      reviewQueue: reviewQueue.length
    },
    movedByOriginSpecialty: movedByOrigin,
    topTopics: Object.entries(byTopic)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([topic, count]) => ({ topic, count })),
    movedSample: moved.slice(0, 60),
    topicSample: topicReassigned.slice(0, 60)
  };

  const md = [
    `# ${reportPrefix.toUpperCase()}`,
    "",
    `- Fecha: ${report.generatedAt}`,
    `- Casos totales: ${report.totals.totalCases}`,
    `- Movidos al bloque (${block.toUpperCase()}): ${report.totals.movedToBlock}`,
    `- Casos del bloque con reasignacion de tema: ${report.totals.topicReassigned}`,
    `- Cola de revision ambigua: ${report.totals.reviewQueue}`,
    "",
    "## Movidos por especialidad origen",
    `- MI -> ${block.toUpperCase()}: ${movedByOrigin.mi || 0}`,
    `- PED -> ${block.toUpperCase()}: ${movedByOrigin.ped || 0}`,
    `- GYO -> ${block.toUpperCase()}: ${movedByOrigin.gyo || 0}`,
    `- CIR -> ${block.toUpperCase()}: ${movedByOrigin.cir || 0}`,
    `- OTHER -> ${block.toUpperCase()}: ${movedByOrigin.other || 0}`,
    "",
    "## Top temas del bloque",
    ...report.topTopics.slice(0, 15).map(t => `- ${t.topic}: ${t.count}`)
  ].join("\n");

  ensureReportDir();
  fs.writeFileSync(reportJson, JSON.stringify(report, null, 2), "utf8");
  fs.writeFileSync(reviewJson, JSON.stringify(reviewQueue, null, 2), "utf8");
  fs.writeFileSync(reportMd, md, "utf8");

  if (!dryRun) {
    fs.writeFileSync(`${QUESTIONS_PATH}.pre-${reportPrefix}.bak`, fs.readFileSync(QUESTIONS_PATH, "utf8"), "utf8");
    writeQuestions(QUESTIONS_PATH, questions);
  }

  return {
    block,
    totals: report.totals,
    movedByOriginSpecialty: report.movedByOriginSpecialty,
    reportPath: reportJson,
    reviewPath: reviewJson,
    outputUpdated: !dryRun
  };
}

function main() {
  const block = String(getArg("--block") || "ped").trim().toLowerCase();
  const result = runBlock({ block, dryRun: CLI_DRY_RUN });
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) {
  main();
} else {
  module.exports = { runBlock };
}
