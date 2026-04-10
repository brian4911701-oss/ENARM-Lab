const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const QUESTIONS_PATH = path.join(ROOT, "questions.js");
const REPORT_PATH = path.join(ROOT, "reports", "ped_diarrhea_quality_summary.json");
const OFFICIAL_TOPIC = "Diarrea en el Pediátrico";

function getArg(flag, fallback = "") {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  const value = process.argv[idx + 1];
  if (!value || value.startsWith("--")) return fallback;
  return value;
}

function toInt(value, fallback) {
  const parsed = parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeTextKey(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanInline(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function readQuestions(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]") + 1;
  if (start < 0 || end <= 0) throw new Error("No se pudo parsear questions.js");
  return JSON.parse(raw.slice(start, end));
}

function writeQuestions(filePath, questions) {
  const content =
    "// questions.js - Banco de reactivos para ENARMlab\n" +
    "const QUESTIONS = " + JSON.stringify(questions, null, 2) + ";\n\n" +
    "if (typeof module !== 'undefined') {\n  module.exports = QUESTIONS;\n}\n";
  fs.writeFileSync(filePath, content, "utf8");
}

function signature(item) {
  return normalizeTextKey(
    [item.specialty || "", item.temaCanonical || item.tema || "", item.case || "", item.question || ""].join(" | ")
  );
}

function isPediatricDiarrhea(item) {
  if (String(item.specialty || "") !== "ped") return false;
  const topic = normalizeTextKey(item.temaCanonical || item.tema || item.subtema || "");
  const text = normalizeTextKey(
    [item.case || "", item.question || "", item.explanation || "", topic].join(" ")
  );
  return topic.includes("diarre") || text.includes("diarrea") || text.includes("deshidratacion");
}

function buildRecord(payload, idx) {
  return {
    specialty: "ped",
    case: cleanInline(payload.case),
    question: cleanInline(payload.question),
    options: payload.options.map(cleanInline),
    answerIndex: payload.answerIndex,
    explanation: cleanInline(payload.explanation),
    gpcReference: cleanInline(payload.gpcReference),
    tema: OFFICIAL_TOPIC,
    temaCanonical: OFFICIAL_TOPIC,
    subtemaCanonical: OFFICIAL_TOPIC,
    subtema: OFFICIAL_TOPIC,
    specialtyOriginal: "ped",
    temaOriginal: OFFICIAL_TOPIC,
    subtemaOriginal: OFFICIAL_TOPIC,
    difficulty: idx % 2 === 0 ? "alta" : "media"
  };
}

function validateRecord(item) {
  if (!item.case || item.case.length < 130) return false;
  if (!item.question || item.question.length < 35) return false;
  if (!Array.isArray(item.options) || item.options.length !== 4) return false;
  if (!Number.isInteger(item.answerIndex) || item.answerIndex < 0 || item.answerIndex > 3) return false;
  if (!item.explanation || item.explanation.length < 140) return false;
  if (!/(gpc|nom|guia|guía)/i.test(String(item.gpcReference || ""))) return false;
  const opts = item.options.map((x) => normalizeTextKey(x));
  if (new Set(opts).size !== 4) return false;
  return true;
}

function makeTemplates(i) {
  const ageMonths = 6 + (i % 48);
  const weight = (6.5 + ((i % 20) * 0.42)).toFixed(1);
  const fever = (37.8 + ((i % 10) * 0.2)).toFixed(1);
  const diarrheaHours = 12 + (i % 60);
  const stools = 4 + (i % 7);
  const hasBlood = i % 9 === 0;
  const hasShock = i % 13 === 0;
  const dehydration = hasShock ? "grave" : (i % 3 === 0 ? "leve-moderada" : "leve");
  const stoolText = hasBlood ? "evacuaciones con moco y sangre" : "evacuaciones liquidas sin sangre";
  const shockText = hasShock
    ? "llenado capilar > 3 segundos, pulsos debiles y somnolencia."
    : "llenado capilar < 2 segundos, pulsos perifericos presentes y estado de alerta conservado.";

  const commonCase =
    `Lactante de ${ageMonths} meses, peso ${weight} kg, con ${stools} evacuaciones en ${diarrheaHours} horas, ` +
    `${stoolText}, fiebre ${fever} C y vomito ocasional. A la exploracion presenta deshidratacion ${dehydration}; ${shockText}`;

  const templates = [
    {
      case: commonCase,
      question: "En este escenario, cual es la conducta de hidratacion inicial mas adecuada?",
      options: [
        "Plan B con solucion de rehidratacion oral 75 ml/kg en 4 horas, fraccionado en tomas frecuentes y reevaluacion clinica.",
        "Plan C intravenoso para todo paciente con diarrea.",
        "Suspender via oral por 24 horas y solo observacion.",
        "Antibiotico intramuscular de rutina como medida principal."
      ],
      answerIndex: hasShock ? 1 : 0,
      explanation: hasShock
        ? "Con datos de hipoperfusion o choque, el manejo inicial corresponde a reanimacion con cristaloides (Plan C), no Plan B. El objetivo es restaurar perfusion, corregir deficit y despues continuar con esquema de rehidratacion y alimentacion segun evolucion."
        : "En deshidratacion leve o moderada sin choque, la primera linea es Plan B con SRO 75 ml/kg en 4 horas. Se administra de forma fraccionada, idealmente en tomas frecuentes para mejorar tolerancia (por ejemplo, cada 20-30 minutos), con reevaluacion al terminar para decidir continuidad o cambio de plan.",
      gpcReference: "GPC CENETEC de Enfermedad Diarreica Aguda en menores de 5 anos; lineamientos de hidratacion oral OMS/SSA."
    },
    {
      case: commonCase,
      question: "Ademas de rehidratacion, cual intervencion reduce duracion y severidad del episodio de diarrea aguda infantil?",
      options: [
        "Suplementacion con zinc por 10-14 dias segun edad.",
        "Antidiarreico opioide en lactantes.",
        "Ayuno estricto durante todo el cuadro.",
        "Suspension definitiva de lactancia materna."
      ],
      answerIndex: 0,
      explanation: "La suplementacion con zinc disminuye duracion y gravedad del episodio y reduce recurrencias proximas en ninos. Los antidiarreicos opioides no se recomiendan en lactantes por riesgo de efectos adversos. Debe mantenerse alimentacion apropiada y lactancia materna.",
      gpcReference: "GPC CENETEC de diarrea aguda pediatrica y recomendaciones OMS sobre zinc en EDA."
    },
    {
      case: commonCase,
      question: "Que dato obliga a considerar antibiotico dirigido en lugar de manejo exclusivamente de soporte?",
      options: [
        "Disenteria (sangre en heces) o sospecha de etiologia bacteriana invasiva.",
        "Toda diarrea acuosa sin fiebre.",
        "Solo la presencia de vomito aislado.",
        "Diarrea de menos de 24 horas sin deshidratacion."
      ],
      answerIndex: 0,
      explanation: "El uso de antibiotico no es rutinario en EDA pediatrica. Debe reservarse para indicaciones puntuales, como disenteria o sospecha de patogeno bacteriano invasivo, ajustando al contexto epidemiologico y gravedad. El pilar sigue siendo hidratacion y vigilancia clinica.",
      gpcReference: "GPC CENETEC de EDA pediatrica y guias de uso racional de antibioticos en infeccion gastrointestinal."
    },
    {
      case: commonCase,
      question: "Sobre alimentacion durante la EDA, cual recomendacion es correcta?",
      options: [
        "Continuar lactancia materna y reiniciar alimentacion habitual precoz segun tolerancia.",
        "Indicar ayuno completo hasta normalizar evacuaciones.",
        "Suspender toda fuente de leche por al menos 2 semanas en todos los casos.",
        "Usar exclusivamente bebidas azucaradas comerciales."
      ],
      answerIndex: 0,
      explanation: "En diarrea aguda infantil se recomienda mantener lactancia y reintroducir alimentacion habitual temprana segun tolerancia, para reducir perdida nutricional y acelerar recuperacion intestinal. El ayuno prolongado y bebidas hiperosmolares aumentan riesgo de deshidratacion y mala evolucion.",
      gpcReference: "GPC CENETEC de EDA pediatrica y recomendaciones nutricionales durante gastroenteritis aguda."
    }
  ];

  return templates[i % templates.length];
}

function ensureParentDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const target = Math.max(1, toInt(getArg("--count", "50"), 50));
  const dryRun = process.argv.includes("--dry-run");

  const existing = readQuestions(QUESTIONS_PATH);
  const seen = new Set(existing.map(signature).filter(Boolean));

  let normalizedOldDiarrhea = 0;
  const normalizedExisting = existing.map((q) => {
    if (isPediatricDiarrhea(q)) {
      const next = { ...q };
      next.specialty = "ped";
      next.tema = OFFICIAL_TOPIC;
      next.temaCanonical = OFFICIAL_TOPIC;
      next.subtema = OFFICIAL_TOPIC;
      next.subtemaCanonical = OFFICIAL_TOPIC;
      if (!next.specialtyOriginal) next.specialtyOriginal = "ped";
      if (!next.temaOriginal) next.temaOriginal = OFFICIAL_TOPIC;
      if (!next.subtemaOriginal) next.subtemaOriginal = OFFICIAL_TOPIC;
      normalizedOldDiarrhea += 1;
      return next;
    }
    return q;
  });

  const additions = [];
  let attempts = 0;
  const maxAttempts = target * 30;

  while (additions.length < target && attempts < maxAttempts) {
    const payload = makeTemplates(attempts + 1);
    const candidate = buildRecord(payload, attempts + 1);
    const sig = signature(candidate);
    if (!sig || seen.has(sig)) {
      attempts += 1;
      continue;
    }
    if (!validateRecord(candidate)) {
      attempts += 1;
      continue;
    }
    seen.add(sig);
    additions.push(candidate);
    attempts += 1;
  }

  const finalData = normalizedExisting.concat(additions);
  if (!dryRun) writeQuestions(QUESTIONS_PATH, finalData);

  const summary = {
    generatedAt: new Date().toISOString(),
    dryRun,
    requestedNew: target,
    generatedNew: additions.length,
    attempts,
    normalizedOldDiarrhea,
    initialBank: existing.length,
    finalBank: dryRun ? existing.length : finalData.length,
    officialTopic: OFFICIAL_TOPIC
  };

  ensureParentDir(REPORT_PATH);
  fs.writeFileSync(REPORT_PATH, JSON.stringify(summary, null, 2), "utf8");
  console.log(JSON.stringify(summary, null, 2));
}

main();
