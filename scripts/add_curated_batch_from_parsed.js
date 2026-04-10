const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const QUESTIONS_PATH = path.join(ROOT, "questions.js");
const APP_PATH = path.join(ROOT, "app.js");
const COVERAGE_PATH = path.join(ROOT, "reports", "temario_coverage_report.json");
const REPORTS_DIR = path.join(ROOT, "reports");

const DEFAULT_TARGET = 500;
const DEFAULT_MAX_PER_THEME = 15;

const CANDIDATE_FILES = [
  "parsed_variados_nuevo_v3.json",
  "parsed_variados_nuevo_v2.json",
  "parsed_casos_chat_random.json",
  "parsed_questions.json",
  "generated_questions.json"
];

const STRUCTURED_TEXT_SOURCES = [
  { file: "mi_text.txt", specialty: "mi" },
  { file: "ciru_base_text.txt", specialty: "cir" },
  { file: "variados_base_text.txt", specialty: "" },
  { file: "pedia_text.txt", specialty: "ped" },
  { file: "pedia2_text.txt", specialty: "ped" },
  { file: "gine2_text.txt", specialty: "gyo" },
  { file: "ciru2_text.txt", specialty: "cir" },
  { file: "ciru3_text.txt", specialty: "cir" },
  { file: "ciru4_text.txt", specialty: "cir" }
];

const STOPWORDS = new Set([
  "de", "del", "la", "las", "el", "los", "y", "e", "en", "con", "sin", "por", "para", "al", "a",
  "una", "un", "unos", "unas", "que", "se", "su", "sus", "o", "u", "lo", "le", "les"
]);

const SPECIALTY_KEYWORDS = {
  ped: [
    "pediatr", "nino", "nina", "lactante", "preescolar", "escolar", "adolescente",
    "neonato", "recien nacido", "apgar", "tamiz", "vacuna", "cartilla de vacunacion",
    "uropedia", "cardiopedia"
  ],
  gyo: [
    "embarazo", "gestacion", "gestante", "parto", "puerper", "cesarea", "control prenatal",
    "preeclamps", "eclamps", "placenta", "uter", "ovario", "cervix", "vaginal", "obstetric",
    "cacu", "amenorrea", "sangrado uterino"
  ],
  cir: [
    "cirug", "quirurg", "apendicitis", "colecist", "pancreatitis", "hernia",
    "fractura", "trauma", "atls", "quemadura", "obstruccion intestinal", "peritonitis",
    "abdomen agudo", "oftalmologia", "otorrinolaringologia", "ortopedia", "urologia"
  ],
  mi: [
    "medicina interna", "diabetes", "hipertension", "epoc", "asma", "vih", "tuberculosis",
    "insuficiencia", "lupus", "artritis", "nefro", "neuro", "endocrino", "cardio",
    "hepatitis", "cirrosis", "infarto", "sepsis", "tiroid", "hematolog", "psiquiatr",
    "geriatr", "epidemiolog"
  ]
};

const GPC_DEFAULT_BY_SPECIALTY = {
  ped: "GPC CENETEC vigente para Pediatria y NOM-031-SSA2 para atencion a la salud de la nin~ez.",
  gyo: "GPC CENETEC vigente para Ginecologia y Obstetricia y NOM-007-SSA2-2016 para embarazo, parto y puerperio.",
  cir: "GPC CENETEC vigente para Cirugia General y lineamientos nacionales de atencion inicial en urgencias quirurgicas/ATLS.",
  mi: "GPC CENETEC vigente para Medicina Interna y NOM aplicables por padecimiento (ejemplo: NOM-015 diabetes, NOM-030 hipertension)."
};

function getArg(flag, fallback = "") {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  const value = process.argv[idx + 1];
  if (!value || value.startsWith("--")) return fallback;
  return value;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
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

function stripNumericVariants(value) {
  return normalizeTextKey(String(value || "").replace(/\b\d+(?:[.,]\d+)?\b/g, "#"));
}

function tokenize(value) {
  return normalizeTextKey(value)
    .split(" ")
    .filter(token => token.length >= 4 && !STOPWORDS.has(token));
}

function buildAcronymKey(value) {
  const tokens = normalizeTextKey(value)
    .split(" ")
    .filter(token => token && !STOPWORDS.has(token));
  if (tokens.length < 2 || tokens.length > 6) return "";
  const acronym = tokens.map(token => token[0]).join("");
  return acronym.length >= 2 && acronym.length <= 6 ? acronym : "";
}

function extractConstBlock(source, constName, openChar, closeChar) {
  const marker = `const ${constName} = `;
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`No se encontro la constante ${constName} en app.js`);
  }
  const openIndex = source.indexOf(openChar, markerIndex);
  if (openIndex === -1) {
    throw new Error(`No se encontro inicio de ${constName}`);
  }
  let depth = 0;
  for (let i = openIndex; i < source.length; i++) {
    const ch = source[i];
    if (ch === openChar) depth += 1;
    if (ch === closeChar) {
      depth -= 1;
      if (depth === 0) {
        return source.slice(openIndex, i + 1);
      }
    }
  }
  throw new Error(`No se pudo cerrar el bloque de ${constName}`);
}

function parseQuestionsArray(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]") + 1;
  if (start === -1 || end <= 0) {
    throw new Error("No se pudo leer QUESTIONS en questions.js");
  }
  return JSON.parse(raw.slice(start, end));
}

function writeQuestionsArray(filePath, questions) {
  const out =
    "// questions.js - Banco de reactivos para ENARMlab\n" +
    "const QUESTIONS = " + JSON.stringify(questions, null, 2) + ";\n\n" +
    "if (typeof module !== 'undefined') {\n  module.exports = QUESTIONS;\n}\n";
  fs.writeFileSync(filePath, out, "utf8");
}

function ensureReportsDir() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
}

function loadTemarioData() {
  const appSource = fs.readFileSync(APP_PATH, "utf8");
  const officialBlock = extractConstBlock(appSource, "OFFICIAL_TEMARIO", "[", "]");
  const mappingBlock = extractConstBlock(appSource, "TEMARIO_MAPPING", "{", "}");
  const sandbox = { module: { exports: {} } };
  const script = `
    module.exports = {
      OFFICIAL_TEMARIO: ${officialBlock},
      TEMARIO_MAPPING: ${mappingBlock}
    };
  `;
  vm.runInNewContext(script, sandbox);

  const official = Array.isArray(sandbox.module.exports.OFFICIAL_TEMARIO)
    ? sandbox.module.exports.OFFICIAL_TEMARIO
    : [];
  const mapping = sandbox.module.exports.TEMARIO_MAPPING || {};

  const topicSpecialty = {};
  if (fs.existsSync(COVERAGE_PATH)) {
    const coverageRaw = fs.readFileSync(COVERAGE_PATH, "utf8").replace(/^\uFEFF/, "");
    const coverage = JSON.parse(coverageRaw);
    const groups = Array.isArray(coverage.coverage) ? coverage.coverage : [];
    groups.forEach((group) => {
      const groupKey = normalizeTextKey(group?.name || "");
      let spec = "mi";
      if (groupKey.includes("pediatr")) spec = "ped";
      else if (groupKey.includes("ginec") || groupKey.includes("obstet")) spec = "gyo";
      else if (groupKey.includes("cirug")) spec = "cir";

      const themes = Array.isArray(group?.themes) ? group.themes : [];
      themes.forEach((theme) => {
        const key = normalizeTextKey(theme?.name || "");
        if (key) topicSpecialty[key] = spec;
      });
    });
  }

  const entries = official.map((topic) => {
    const aliases = new Set([topic, ...(Array.isArray(mapping[topic]) ? mapping[topic] : [])]);
    const aliasKeys = new Set();
    const aliasTokens = new Set();

    aliases.forEach((alias) => {
      const cleaned = cleanInline(alias);
      if (!cleaned) return;
      const key = normalizeTextKey(cleaned);
      if (!key) return;
      aliasKeys.add(key);
      tokenize(key).forEach(token => aliasTokens.add(token));

      const acronym = buildAcronymKey(cleaned);
      if (acronym) aliasKeys.add(normalizeTextKey(acronym));
    });

    const topicKey = normalizeTextKey(topic);
    const specialty = topicSpecialty[topicKey] || "mi";
    return {
      topic: cleanInline(topic),
      topicKey,
      specialty,
      aliasKeys: Array.from(aliasKeys),
      aliasTokenSet: aliasTokens
    };
  });

  const entriesBySpecialty = {
    mi: entries.filter(entry => entry.specialty === "mi"),
    ped: entries.filter(entry => entry.specialty === "ped"),
    gyo: entries.filter(entry => entry.specialty === "gyo"),
    cir: entries.filter(entry => entry.specialty === "cir")
  };

  return { entriesBySpecialty };
}

function flattenCandidateRows(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];

  const rows = [];
  parsed.forEach((item, rowIndex) => {
    if (Array.isArray(item.questions) && item.questions.length > 0) {
      item.questions.forEach((questionItem, questionIndex) => {
        rows.push({
          source: path.basename(filePath),
          rowIndex,
          questionIndex,
          specialtyRaw: item.specialty || "",
          temaRaw: item.tema || item.temaCanonical || "",
          subtemaRaw: item.subtema || item.subtemaCanonical || "",
          difficultyRaw: item.difficulty || "",
          caseRaw: item.case || "",
          questionRaw: questionItem.question || "",
          optionsRaw: questionItem.options || [],
          answerIndexRaw: questionItem.answerIndex,
          explanationRaw: questionItem.explanation || "",
          gpcReferenceRaw: questionItem.gpcReference || item.gpcReference || ""
        });
      });
      return;
    }

    rows.push({
      source: path.basename(filePath),
      rowIndex,
      questionIndex: 0,
      specialtyRaw: item.specialty || "",
      temaRaw: item.tema || item.temaCanonical || "",
      subtemaRaw: item.subtema || item.subtemaCanonical || "",
      difficultyRaw: item.difficulty || "",
      caseRaw: item.case || "",
      questionRaw: item.question || "",
      optionsRaw: item.options || [],
      answerIndexRaw: item.answerIndex,
      explanationRaw: item.explanation || "",
      gpcReferenceRaw: item.gpcReference || ""
    });
  });

  return rows;
}

function flattenRowsFromStructuredText(filePath, defaultSpecialty = "") {
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw
    .split(/\r?\n/)
    .map(line => String(line || "").trim());

  const rows = [];
  let tema = "";
  let subtema = "";
  let difficulty = "";
  let caseText = "";
  let mode = "";
  let currentQuestion = null;

  const pushQuestion = () => {
    if (!currentQuestion) return;
    if (!caseText) {
      currentQuestion = null;
      return;
    }
    rows.push({
      source: path.basename(filePath),
      rowIndex: rows.length,
      questionIndex: rows.length,
      specialtyRaw: defaultSpecialty || "",
      temaRaw: cleanInline(tema),
      subtemaRaw: cleanInline(subtema),
      difficultyRaw: difficulty,
      caseRaw: cleanInline(caseText),
      questionRaw: cleanInline(currentQuestion.question),
      optionsRaw: Array.isArray(currentQuestion.options) ? currentQuestion.options.slice() : [],
      answerIndexRaw: currentQuestion.answerIndex,
      explanationRaw: cleanInline(currentQuestion.explanation),
      gpcReferenceRaw: ""
    });
    currentQuestion = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    if (line.includes("----------------Page")) continue;

    if (/^Tema:/i.test(line)) {
      pushQuestion();
      tema = cleanInline(line.replace(/^Tema:\s*/i, ""));
      subtema = "";
      difficulty = "";
      caseText = "";
      mode = "";
      continue;
    }

    if (/^Subtema:/i.test(line)) {
      subtema = cleanInline(line.replace(/^Subtema:\s*/i, ""));
      continue;
    }

    if (/^Dificultad:/i.test(line) || /^Grado de dificultad:/i.test(line)) {
      difficulty = cleanInline(line.split(":").slice(1).join(":"));
      continue;
    }

    if (/^Caso cl/i.test(line)) {
      mode = "case_text";
      continue;
    }

    if (
      /^Pregunta\s*\d+/i.test(line) ||
      /^Pregunta\s*\d*\s*:/i.test(line) ||
      /^Pregunta$/i.test(line) ||
      /^Pregunta\./i.test(line)
    ) {
      pushQuestion();
      currentQuestion = {
        question: cleanInline(line.replace(/^Pregunta\s*\d*\s*:?/i, "")),
        options: [],
        answerIndex: 0,
        explanation: ""
      };
      mode = "question";
      continue;
    }

    if (/^Retroalimentaci/i.test(line)) {
      mode = "feedback";
      continue;
    }

    const optionMatch = line.match(/^([A-Ea-e])\)\s*(.*)$/);
    if (optionMatch && currentQuestion) {
      mode = "options";
      let optionText = cleanInline(optionMatch[2]);
      let isCorrect = false;
      if (optionText.startsWith("*")) {
        isCorrect = true;
        optionText = cleanInline(optionText.slice(1));
      }
      if (optionText.endsWith("*")) {
        isCorrect = true;
        optionText = cleanInline(optionText.slice(0, -1));
      }
      if (isCorrect) currentQuestion.answerIndex = currentQuestion.options.length;
      currentQuestion.options.push(optionText);
      continue;
    }

    if (mode === "case_text") {
      caseText += (caseText ? " " : "") + line;
      continue;
    }

    if (mode === "question" && currentQuestion) {
      currentQuestion.question += (currentQuestion.question ? " " : "") + line;
      continue;
    }

    if (mode === "options" && currentQuestion && currentQuestion.options.length > 0) {
      let continuation = cleanInline(line);
      let isCorrect = false;
      if (continuation.endsWith("*")) {
        isCorrect = true;
        continuation = cleanInline(continuation.slice(0, -1));
      }
      currentQuestion.options[currentQuestion.options.length - 1] += ` ${continuation}`;
      if (isCorrect) currentQuestion.answerIndex = currentQuestion.options.length - 1;
      continue;
    }

    if (mode === "feedback" && currentQuestion) {
      currentQuestion.explanation += (currentQuestion.explanation ? " " : "") + line;
      continue;
    }

    if (
      !mode &&
      /^(Paciente|Mujer|Hombre|Masculino|Femenina|Femenino|Recien|Reci[eé]n|Escolar|Lactante|Nino|Ni[ñn]o)/i.test(line)
    ) {
      mode = "case_text";
      caseText += (caseText ? " " : "") + line;
      continue;
    }

    if (mode === "case_text") {
      caseText += (caseText ? " " : "") + line;
    }
  }

  pushQuestion();
  return rows;
}

function scoreKeywords(textKey, words) {
  let score = 0;
  words.forEach((word) => {
    if (textKey.includes(word)) score += 1;
  });
  return score;
}

function normalizeSpecialty(rawSpecialty, contextText) {
  const raw = normalizeTextKey(rawSpecialty);
  if (["mi", "ped", "gyo", "cir"].includes(raw)) return raw;
  if (raw === "go") return "gyo";
  if (raw.includes("pedi") || raw.includes("neonato")) return "ped";
  if (raw.includes("gine") || raw.includes("obste")) return "gyo";
  if (raw.includes("ciru") || raw.includes("trauma") || raw.includes("ortoped")) return "cir";
  if (raw.includes("medicina interna") || raw === "interna") return "mi";
  if (raw.includes("urologia") || raw.includes("oftalm") || raw.includes("otorrino")) return "cir";

  const text = normalizeTextKey(contextText);
  const scores = {
    ped: scoreKeywords(text, SPECIALTY_KEYWORDS.ped),
    gyo: scoreKeywords(text, SPECIALTY_KEYWORDS.gyo),
    cir: scoreKeywords(text, SPECIALTY_KEYWORDS.cir),
    mi: scoreKeywords(text, SPECIALTY_KEYWORDS.mi)
  };
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (!best || best[1] <= 0) return "mi";
  return best[0];
}

function normalizeDifficulty(value, qualityScore) {
  const key = normalizeTextKey(value);
  if (key.includes("alta") || key.includes("muy alta")) return "alta";
  if (key.includes("baja")) return "media";
  if (key.includes("media")) return "media";
  return qualityScore >= 58 ? "alta" : "media";
}

function normalizeOptions(optionsRaw, answerIndexRaw) {
  const optionsInput = Array.isArray(optionsRaw) ? optionsRaw : [];
  const cleanedOptions = [];
  const seenOptionKeys = new Set();

  optionsInput.forEach((opt) => {
    const cleaned = cleanInline(opt);
    const key = normalizeTextKey(cleaned);
    if (!cleaned || !key) return;
    if (seenOptionKeys.has(key)) return;
    seenOptionKeys.add(key);
    cleanedOptions.push(cleaned);
  });

  if (cleanedOptions.length < 4) return null;

  const parsedAnswer = Number.isInteger(answerIndexRaw)
    ? answerIndexRaw
    : parseInt(String(answerIndexRaw), 10);
  const validAnswer = Number.isInteger(parsedAnswer) && parsedAnswer >= 0 && parsedAnswer < optionsInput.length
    ? parsedAnswer
    : 0;
  const correctRaw = cleanInline(optionsInput[validAnswer] || cleanedOptions[0]);
  const correctKey = normalizeTextKey(correctRaw);

  if (cleanedOptions.length === 4) {
    let answerIndex = cleanedOptions.findIndex(opt => normalizeTextKey(opt) === correctKey);
    if (answerIndex < 0 || answerIndex > 3) answerIndex = 0;
    return { options: cleanedOptions, answerIndex };
  }

  let correctOption = cleanedOptions.find(opt => normalizeTextKey(opt) === correctKey);
  if (!correctOption) correctOption = cleanedOptions[0];

  const reduced = [correctOption];
  for (let i = 0; i < cleanedOptions.length; i++) {
    const opt = cleanedOptions[i];
    if (normalizeTextKey(opt) === normalizeTextKey(correctOption)) continue;
    reduced.push(opt);
    if (reduced.length === 4) break;
  }

  if (reduced.length !== 4) return null;
  return { options: reduced, answerIndex: 0 };
}

function detectClinicalContext(caseText) {
  const text = String(caseText || "");
  const agePattern = /\b\d{1,3}\s*(anos|años|meses|semanas|dias|sdg)\b/i;
  const measurePattern = /\b\d{2,3}\s*\/\s*\d{2,3}\b|\b\d+(?:[.,]\d+)?\s*(mg\/dl|g\/dl|mmhg|kg|cm|lpm|rpm|%|mEq\/L|meq\/l|sdg|u\/l)\b/i;
  return agePattern.test(text) || measurePattern.test(text);
}

function scoreQuality(caseText, questionText, explanationText, gpcReference) {
  const caseLen = caseText.length;
  const questionLen = questionText.length;
  const explanationLen = explanationText.length;
  const gpcLen = gpcReference.length;

  let score = 0;
  score += Math.min(30, Math.floor(caseLen / 8));
  score += Math.min(25, Math.floor(explanationLen / 10));
  score += Math.min(10, Math.floor(questionLen / 12));
  score += Math.min(8, Math.floor(gpcLen / 20));
  if (detectClinicalContext(caseText)) score += 10;
  if (/[?¿]/.test(questionText)) score += 3;
  return score;
}

function normalizeGpcReference(rawReference, specialty, topic) {
  const cleaned = cleanInline(rawReference);
  if (cleaned.length >= 20) return cleaned;
  const fallback = GPC_DEFAULT_BY_SPECIALTY[specialty] || GPC_DEFAULT_BY_SPECIALTY.mi;
  return `${fallback} Tema: ${topic}.`;
}

function mapToOfficialTopic(row, preferredSpecialty, entriesBySpecialty) {
  const entries = [
    ...(entriesBySpecialty.mi || []),
    ...(entriesBySpecialty.ped || []),
    ...(entriesBySpecialty.gyo || []),
    ...(entriesBySpecialty.cir || [])
  ];
  if (!entries.length) return null;

  const labelKey = normalizeTextKey([row.temaRaw, row.subtemaRaw].join(" | "));
  const bodyKey = normalizeTextKey([
    row.caseRaw,
    row.questionRaw,
    row.explanationRaw,
    row.gpcReferenceRaw
  ].join(" "));
  const labelTokens = tokenize(labelKey);
  const bodyTokens = tokenize(bodyKey);

  let best = null;
  entries.forEach((entry) => {
    let score = 0;

    entry.aliasKeys.forEach((aliasKey) => {
      if (!aliasKey) return;
      if (labelKey === aliasKey) {
        score += 200;
      } else if (labelKey.includes(aliasKey) && aliasKey.length >= 3) {
        score += 120 + Math.min(20, Math.floor(aliasKey.length / 3));
      } else if (aliasKey.includes(labelKey) && labelKey.length >= 7) {
        score += 70;
      }

      if (bodyKey.includes(aliasKey) && aliasKey.length >= 4) {
        score += 20 + Math.min(8, Math.floor(aliasKey.length / 5));
      }
    });

    let labelOverlap = 0;
    labelTokens.forEach((token) => {
      if (entry.aliasTokenSet.has(token)) labelOverlap += 1;
    });
    let bodyOverlap = 0;
    bodyTokens.forEach((token) => {
      if (entry.aliasTokenSet.has(token)) bodyOverlap += 1;
    });

    score += labelOverlap * 22;
    score += Math.min(6, bodyOverlap) * 4;
    if (bodyKey.includes(entry.topicKey)) score += 12;
    if (entry.specialty === preferredSpecialty) score += 6;

    if (!best || score > best.score) {
      best = {
        topic: entry.topic,
        specialty: entry.specialty,
        score,
        method: "alias"
      };
    }
  });

  if (best && best.score >= 30) return best;

  let overlapBest = null;
  if (labelTokens.length > 0) {
    entries.forEach((entry) => {
      let overlap = 0;
      labelTokens.forEach((token) => {
        if (entry.aliasTokenSet.has(token)) overlap += 1;
      });
      if (entry.specialty === preferredSpecialty) overlap += 1;
      if (!overlapBest || overlap > overlapBest.score) {
        overlapBest = { topic: entry.topic, specialty: entry.specialty, score: overlap, method: "label_overlap" };
      }
    });
    if (overlapBest && overlapBest.score >= 1) return overlapBest;
  }

  overlapBest = null;
  entries.forEach((entry) => {
    let overlap = 0;
    bodyTokens.forEach((token) => {
      if (entry.aliasTokenSet.has(token)) overlap += 1;
    });
    if (entry.specialty === preferredSpecialty) overlap += 1;
    if (!overlapBest || overlap > overlapBest.score) {
      overlapBest = { topic: entry.topic, specialty: entry.specialty, score: overlap, method: "body_overlap" };
    }
  });

  if (overlapBest && overlapBest.score >= 2) return overlapBest;
  return null;
}

function buildNoNumberSignature(specialty, topic, caseText, questionText) {
  return stripNumericVariants([specialty, topic, caseText, questionText].join(" | "));
}

function buildCaseOpenKey(caseText) {
  return stripNumericVariants(String(caseText || "").slice(0, 180));
}

function isValidCandidateFields(caseText, questionText, explanation, optionsInfo) {
  if (!caseText || caseText.length < 160) return false;
  if (!questionText || questionText.length < 28) return false;
  if (!explanation || explanation.length < 70) return false;
  if (!optionsInfo || !Array.isArray(optionsInfo.options) || optionsInfo.options.length !== 4) return false;
  if (!Number.isInteger(optionsInfo.answerIndex) || optionsInfo.answerIndex < 0 || optionsInfo.answerIndex > 3) return false;
  const optionKeys = optionsInfo.options.map(opt => normalizeTextKey(opt));
  if (new Set(optionKeys).size !== 4) return false;
  if (optionKeys.some(key => key.length < 2)) return false;
  if (!detectClinicalContext(caseText)) return false;
  return true;
}

function toCaseRecord(candidate) {
  return {
    specialty: candidate.specialty,
    case: candidate.caseText,
    question: candidate.questionText,
    options: candidate.options,
    answerIndex: candidate.answerIndex,
    explanation: candidate.explanationText,
    gpcReference: candidate.gpcReference,
    tema: candidate.topic,
    temaCanonical: candidate.topic,
    subtemaCanonical: candidate.topic,
    subtema: candidate.subtemaForSearch,
    specialtyOriginal: candidate.specialtyRaw || candidate.specialty,
    temaOriginal: candidate.temaRaw || candidate.topic,
    subtemaOriginal: candidate.subtemaRaw || candidate.subtemaForSearch,
    difficulty: candidate.difficulty
  };
}

function buildMarkdownReport(summary) {
  const lines = [];
  lines.push("# Informe de tanda curada");
  lines.push("");
  lines.push(`- Fecha: ${summary.generatedAt}`);
  lines.push(`- Solicitud: ${summary.requested}`);
  lines.push(`- Casos agregados: ${summary.added}`);
  lines.push(`- Banco antes: ${summary.initialBank}`);
  lines.push(`- Banco despues: ${summary.finalBank}`);
  lines.push(`- Fuentes analizadas: ${summary.totalRawRows}`);
  lines.push(`- Candidatos curados antes de seleccion final: ${summary.curatedPool}`);
  lines.push(`- Dry run: ${summary.dryRun ? "si" : "no"}`);
  lines.push("");
  lines.push("## Rechazos");
  lines.push("");
  Object.entries(summary.rejectedByReason)
    .sort((a, b) => b[1] - a[1])
    .forEach(([reason, total]) => {
      lines.push(`- ${reason}: ${total}`);
    });
  lines.push("");
  lines.push("## Distribucion por especialidad");
  lines.push("");
  Object.entries(summary.bySpecialty)
    .sort((a, b) => b[1] - a[1])
    .forEach(([spec, total]) => {
      lines.push(`- ${spec}: ${total}`);
    });
  lines.push("");
  lines.push("## Top temas");
  lines.push("");
  summary.topThemes.forEach((item) => {
    lines.push(`- ${item.tema}: ${item.total}`);
  });
  lines.push("");
  lines.push("## Metodos de mapeo de tema");
  lines.push("");
  Object.entries(summary.mappingMethods)
    .sort((a, b) => b[1] - a[1])
    .forEach(([method, total]) => {
      lines.push(`- ${method}: ${total}`);
    });
  lines.push("");
  lines.push("## Vista rapida de casos");
  lines.push("");
  summary.sampleCases.forEach((item) => {
    lines.push(`- #${item.batchIndex} [${item.specialty}] ${item.tema}: ${item.question}`);
  });
  lines.push("");
  return lines.join("\n");
}

function main() {
  const target = Math.max(1, toInt(getArg("--count", String(DEFAULT_TARGET)), DEFAULT_TARGET));
  const maxPerThemeInput = Math.max(1, toInt(getArg("--max-per-theme", String(DEFAULT_MAX_PER_THEME)), DEFAULT_MAX_PER_THEME));
  const dryRun = hasFlag("--dry-run");

  const existing = parseQuestionsArray(QUESTIONS_PATH);
  const { entriesBySpecialty } = loadTemarioData();

  const existingSigSet = new Set();

  existing.forEach((item) => {
    const specialty = normalizeTextKey(item.specialty || "") || "mi";
    const topic = cleanInline(item.temaCanonical || item.tema || "");
    const caseText = cleanInline(item.case || "");
    const questionText = cleanInline(item.question || "");
    if (!caseText || !questionText) return;
    const signature = buildNoNumberSignature(specialty, topic, caseText, questionText);
    existingSigSet.add(signature);
  });

  const rejectedByReason = {
    invalid_options_or_structure: 0,
    low_quality_content: 0,
    unmapped_topic: 0,
    duplicate_existing_signature: 0,
    duplicate_within_pool_signature: 0,
    duplicate_within_pool_case_opening: 0,
    duplicate_within_pool_question_stem: 0
  };

  const pool = [];
  const poolSigSet = new Set();
  const poolCaseOpenByThemeSet = new Set();
  const poolStemByThemeSet = new Set();

  let totalRawRows = 0;
  const sourceReadCounts = {};
  const allRows = [];

  CANDIDATE_FILES.forEach((relativePath) => {
    const filePath = path.join(ROOT, relativePath);
    if (!fs.existsSync(filePath)) return;
    const rows = flattenCandidateRows(filePath);
    totalRawRows += rows.length;
    sourceReadCounts[path.basename(relativePath)] = (sourceReadCounts[path.basename(relativePath)] || 0) + rows.length;
    allRows.push(...rows);
  });

  STRUCTURED_TEXT_SOURCES.forEach((source) => {
    const filePath = path.join(ROOT, source.file);
    if (!fs.existsSync(filePath)) return;
    const rows = flattenRowsFromStructuredText(filePath, source.specialty);
    totalRawRows += rows.length;
    sourceReadCounts[path.basename(source.file)] = (sourceReadCounts[path.basename(source.file)] || 0) + rows.length;
    allRows.push(...rows);
  });

  allRows.forEach((row) => {
    const optionsInfo = normalizeOptions(row.optionsRaw, row.answerIndexRaw);
    const caseText = cleanInline(row.caseRaw);
    const questionText = cleanInline(row.questionRaw);
    const explanationText = cleanInline(row.explanationRaw);

    if (!isValidCandidateFields(caseText, questionText, explanationText, optionsInfo)) {
      rejectedByReason.invalid_options_or_structure += (!optionsInfo ? 1 : 0);
      rejectedByReason.low_quality_content += (optionsInfo ? 1 : 0);
      return;
    }

    const preferredSpecialty = normalizeSpecialty(
      row.specialtyRaw,
      [row.temaRaw, row.subtemaRaw, caseText, questionText, explanationText, row.gpcReferenceRaw].join(" ")
    );

    const mapped = mapToOfficialTopic(row, preferredSpecialty, entriesBySpecialty);
    if (!mapped) {
      rejectedByReason.unmapped_topic += 1;
      return;
    }

    const specialty = mapped.specialty || preferredSpecialty;
    const topic = cleanInline(mapped.topic);
    const gpcReference = normalizeGpcReference(row.gpcReferenceRaw, specialty, topic);
    const qualityScore = scoreQuality(caseText, questionText, explanationText, gpcReference);
    if (qualityScore < 45) {
      rejectedByReason.low_quality_content += 1;
      return;
    }

    const signature = buildNoNumberSignature(specialty, topic, caseText, questionText);
    const caseOpenKey = buildCaseOpenKey(caseText);
    const stemThemeKey = `${normalizeTextKey(topic)}|${stripNumericVariants(questionText)}`;
    const caseOpenThemeKey = `${normalizeTextKey(topic)}|${caseOpenKey}`;

    if (existingSigSet.has(signature)) {
      rejectedByReason.duplicate_existing_signature += 1;
      return;
    }
    if (poolSigSet.has(signature)) {
      rejectedByReason.duplicate_within_pool_signature += 1;
      return;
    }
    if (caseOpenKey && poolCaseOpenByThemeSet.has(caseOpenThemeKey)) {
      rejectedByReason.duplicate_within_pool_case_opening += 1;
      return;
    }
    if (poolStemByThemeSet.has(stemThemeKey)) {
      rejectedByReason.duplicate_within_pool_question_stem += 1;
      return;
    }

    poolSigSet.add(signature);
    if (caseOpenKey) poolCaseOpenByThemeSet.add(caseOpenThemeKey);
    poolStemByThemeSet.add(stemThemeKey);

    const difficulty = normalizeDifficulty(row.difficultyRaw, qualityScore);
    const subtemaForSearch = cleanInline(row.subtemaRaw || row.temaRaw || topic);

    pool.push({
      source: row.source,
      specialty,
      specialtyRaw: cleanInline(row.specialtyRaw),
      topic,
      temaRaw: cleanInline(row.temaRaw),
      subtemaRaw: cleanInline(row.subtemaRaw),
      subtemaForSearch,
      caseText,
      questionText,
      options: optionsInfo.options,
      answerIndex: optionsInfo.answerIndex,
      explanationText,
      gpcReference,
      difficulty,
      qualityScore,
      mappingScore: mapped.score,
      mappingMethod: mapped.method
    });
  });

  const groupsByTheme = new Map();
  pool.forEach((candidate) => {
    if (!groupsByTheme.has(candidate.topic)) groupsByTheme.set(candidate.topic, []);
    groupsByTheme.get(candidate.topic).push(candidate);
  });
  groupsByTheme.forEach((list) => {
    list.sort((a, b) => {
      if (b.qualityScore !== a.qualityScore) return b.qualityScore - a.qualityScore;
      if (b.mappingScore !== a.mappingScore) return b.mappingScore - a.mappingScore;
      return b.explanationText.length - a.explanationText.length;
    });
  });

  const themeOrder = Array.from(groupsByTheme.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(([theme]) => theme);

  const selected = [];
  const selectedByTheme = {};
  const cursorByTheme = {};
  let currentCap = maxPerThemeInput;

  while (selected.length < target) {
    let addedInRound = 0;
    for (let i = 0; i < themeOrder.length; i++) {
      if (selected.length >= target) break;
      const theme = themeOrder[i];
      const list = groupsByTheme.get(theme) || [];
      const already = selectedByTheme[theme] || 0;
      if (already >= currentCap) continue;

      const cursor = cursorByTheme[theme] || 0;
      if (cursor >= list.length) continue;

      const nextCandidate = list[cursor];
      cursorByTheme[theme] = cursor + 1;
      selected.push(nextCandidate);
      selectedByTheme[theme] = already + 1;
      addedInRound += 1;
    }

    if (selected.length >= target) break;
    if (addedInRound === 0) {
      if (currentCap >= 80) break;
      currentCap += 3;
    }
  }

  if (selected.length < target) {
    const leftovers = pool
      .filter((candidate) => !selected.includes(candidate))
      .sort((a, b) => {
        if (b.qualityScore !== a.qualityScore) return b.qualityScore - a.qualityScore;
        return b.mappingScore - a.mappingScore;
      });
    for (let i = 0; i < leftovers.length && selected.length < target; i++) {
      selected.push(leftovers[i]);
    }
  }

  const selectedTrimmed = selected.slice(0, target);
  const caseRecords = selectedTrimmed.map(toCaseRecord);

  const finalQuestions = dryRun ? existing : existing.concat(caseRecords);
  if (!dryRun && caseRecords.length > 0) {
    writeQuestionsArray(QUESTIONS_PATH, finalQuestions);
  }

  const bySpecialty = {};
  const byTheme = {};
  const bySource = {};
  const mappingMethods = {};
  let qualitySum = 0;
  let qualityMin = Number.POSITIVE_INFINITY;
  let qualityMax = Number.NEGATIVE_INFINITY;

  selectedTrimmed.forEach((candidate, index) => {
    bySpecialty[candidate.specialty] = (bySpecialty[candidate.specialty] || 0) + 1;
    byTheme[candidate.topic] = (byTheme[candidate.topic] || 0) + 1;
    bySource[candidate.source] = (bySource[candidate.source] || 0) + 1;
    mappingMethods[candidate.mappingMethod] = (mappingMethods[candidate.mappingMethod] || 0) + 1;
    qualitySum += candidate.qualityScore;
    qualityMin = Math.min(qualityMin, candidate.qualityScore);
    qualityMax = Math.max(qualityMax, candidate.qualityScore);
    candidate.batchIndex = index + 1;
  });

  const summary = {
    generatedAt: new Date().toISOString(),
    dryRun,
    requested: target,
    added: caseRecords.length,
    initialBank: existing.length,
    finalBank: finalQuestions.length,
    totalRawRows,
    sourceReadCounts,
    curatedPool: pool.length,
    maxPerThemeStart: maxPerThemeInput,
    maxPerThemeFinal: currentCap,
    bySpecialty,
    bySource,
    mappingMethods,
    quality: {
      average: selectedTrimmed.length ? Number((qualitySum / selectedTrimmed.length).toFixed(2)) : 0,
      min: Number.isFinite(qualityMin) ? qualityMin : 0,
      max: Number.isFinite(qualityMax) ? qualityMax : 0
    },
    topThemes: Object.entries(byTheme)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40)
      .map(([tema, total]) => ({ tema, total })),
    rejectedByReason,
    sampleCases: selectedTrimmed.slice(0, 25).map((candidate) => ({
      batchIndex: candidate.batchIndex,
      specialty: candidate.specialty,
      tema: candidate.topic,
      question: candidate.questionText,
      source: candidate.source,
      qualityScore: candidate.qualityScore,
      mappingMethod: candidate.mappingMethod
    }))
  };

  ensureReportsDir();
  const suffix = dryRun ? "dry" : "live";
  const summaryJsonPath = path.join(REPORTS_DIR, `batch_500_curated_summary_${suffix}.json`);
  const summaryMdPath = path.join(REPORTS_DIR, `batch_500_curated_summary_${suffix}.md`);
  const casesJsonPath = path.join(REPORTS_DIR, `batch_500_curated_cases_${suffix}.json`);

  const exportCases = selectedTrimmed.map((candidate, index) => ({
    batchIndex: index + 1,
    source: candidate.source,
    specialty: candidate.specialty,
    tema: candidate.topic,
    subtema: candidate.subtemaForSearch,
    case: candidate.caseText,
    question: candidate.questionText,
    options: candidate.options,
    answerIndex: candidate.answerIndex,
    explanation: candidate.explanationText,
    gpcReference: candidate.gpcReference,
    qualityScore: candidate.qualityScore,
    mappingMethod: candidate.mappingMethod,
    mappingScore: candidate.mappingScore
  }));

  fs.writeFileSync(summaryJsonPath, JSON.stringify(summary, null, 2), "utf8");
  fs.writeFileSync(summaryMdPath, buildMarkdownReport(summary), "utf8");
  fs.writeFileSync(casesJsonPath, JSON.stringify(exportCases, null, 2), "utf8");

  console.log(JSON.stringify({
    dryRun,
    requested: target,
    added: caseRecords.length,
    initialBank: existing.length,
    finalBank: finalQuestions.length,
    curatedPool: pool.length,
    report: path.relative(ROOT, summaryJsonPath),
    cases: path.relative(ROOT, casesJsonPath)
  }, null, 2));
}

main();
