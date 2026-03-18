const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const QUESTIONS_PATH = path.join(ROOT, "questions.js");
const REPORT_DIR = path.join(ROOT, "reports");
const DRY_RUN = process.argv.includes("--dry");

function getArg(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return "";
  return process.argv[idx + 1] || "";
}

function getArgs(flag) {
  const out = [];
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === flag && process.argv[i + 1]) out.push(process.argv[i + 1]);
  }
  return out;
}

const INPUT_ARG = getArg("--input");
const TAG_ARG = getArg("--tag");
const INPUT_PATH = INPUT_ARG
  ? (path.isAbsolute(INPUT_ARG) ? INPUT_ARG : path.resolve(process.cwd(), INPUT_ARG))
  : QUESTIONS_PATH;
const APPEND_PATHS = getArgs("--append").map(p => (
  path.isAbsolute(p) ? p : path.resolve(process.cwd(), p)
));
const tagSuffix = TAG_ARG ? `_${TAG_ARG}` : "";
const REPORT_JSON = path.join(REPORT_DIR, `case_cleanup_report${tagSuffix}.json`);
const REPORT_MD = path.join(REPORT_DIR, `case_cleanup_report${tagSuffix}.md`);
const REVIEW_QUEUE_JSON = path.join(REPORT_DIR, `manual_review_queue${tagSuffix}.json`);
const BLOCK_ORDER = ["ped", "gyo", "cir", "mi"];
const TRONCAL_LABELS = {
  mi: "Medicina Interna",
  ped: "Pediatria",
  gyo: "Ginecologia y Obstetricia",
  cir: "Cirugia General"
};

function normalizeTextKey(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeTopicLabel(value) {
  return String(value || "")
    .replace(/\[cite:\s*\d+\]/gi, "")
    .replace(/\s+/g, " ")
    .replace(/\s*[-:;,.]+\s*$/g, "")
    .trim();
}

function readQuestionsArray(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]") + 1;
  if (start === -1 || end === 0) {
    throw new Error("No se pudo leer el arreglo de questions.js");
  }
  return JSON.parse(raw.slice(start, end));
}

function readAppendCases(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.questions)) return parsed.questions;
  if (Array.isArray(parsed.cases)) return parsed.cases;
  return [];
}

function stringArray(value) {
  if (Array.isArray(value)) return value.map(v => String(v || "").trim()).filter(Boolean);
  if (value === undefined || value === null) return [];
  const one = String(value).trim();
  return one ? [one] : [];
}

function normalizeQuestionLeaf(q) {
  const out = { ...q };
  out.question = String(out.question || "").trim();
  out.options = stringArray(out.options);
  let idx = Number.isInteger(out.answerIndex) ? out.answerIndex : parseInt(out.answerIndex, 10);
  if (!Number.isInteger(idx) || idx < 0 || idx >= out.options.length) idx = 0;
  out.answerIndex = idx;
  out.explanation = String(out.explanation || "").trim();
  if (out.gpcReference === undefined) out.gpcReference = "";
  out.gpcReference = String(out.gpcReference || "").trim();
  return out;
}

function baseScoreFromKeywords(text, keywords) {
  let score = 0;
  for (const kw of keywords) {
    if (text.includes(kw)) score++;
  }
  return score;
}

function inferTroncalSpecialty(item) {
  const rawSpec = normalizeTextKey(item.specialty || "");
  const text = normalizeTextKey([
    item.specialty || "",
    item.tema || "",
    item.subtema || "",
    item.case || "",
    item.question || "",
    item.explanation || "",
    item.gpcReference || "",
    ...(Array.isArray(item.questions)
      ? item.questions.flatMap(sq => [sq.question || "", ...(sq.options || []), sq.explanation || "", sq.gpcReference || ""])
      : []),
    ...(Array.isArray(item.options) ? item.options : [])
  ].join(" "));

  const directAliases = [
    { re: /\bmi\b|medicina interna|internal medicine|nefro|neuro|endo|reumato|cardio|infecto|psiqu|geriatr/, spec: "mi", confidence: 0.95, reason: "direct_alias_mi" },
    { re: /\bped\b|pediatr|neonato|neonatolog/, spec: "ped", confidence: 0.95, reason: "direct_alias_ped" },
    { re: /\bgyo\b|ginec|obstetric/, spec: "gyo", confidence: 0.95, reason: "direct_alias_gyo" },
    { re: /\bcir\b|cirug|trauma|ortoped/, spec: "cir", confidence: 0.95, reason: "direct_alias_cir" }
  ];

  if (["mi", "ped", "gyo", "cir"].includes(rawSpec)) {
    return { spec: rawSpec, confidence: 0.99, reason: "already_troncal", needsReview: false, scores: null };
  }

  for (const alias of directAliases) {
    if (alias.re.test(rawSpec)) {
      return { spec: alias.spec, confidence: alias.confidence, reason: alias.reason, needsReview: false, scores: null };
    }
  }

  const scores = {
    ped: baseScoreFromKeywords(text, ["pediatr", "neonato", "recien nacido", "lactante", "escolar", "preescolar", "adolescente", "apgar", "tamiz neonatal"]),
    gyo: baseScoreFromKeywords(text, ["embarazo", "gestante", "obstetric", "parto", "preeclamps", "eclamps", "puerper", "cesarea", "transvaginal", "uter", "ovario", "cervix"]),
    cir: baseScoreFromKeywords(text, ["cirug", "apendicitis", "colecist", "pancreatitis", "hernia", "trauma", "atls", "fractura", "quemadura", "obstruccion intestinal", "peritonitis"]),
    mi: baseScoreFromKeywords(text, ["medicina interna", "diabetes", "hipertension", "epoc", "asma", "tuberculosis", "vih", "infarto", "insuficiencia", "sepsis", "nefro", "neuro", "endocrino"])
  };

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topSpec = sorted[0][0];
  const topScore = sorted[0][1];
  const secondScore = sorted[1] ? sorted[1][1] : 0;

  let confidence = 0.55;
  if (topScore >= 4 && topScore >= secondScore + 2) confidence = 0.95;
  else if (topScore >= 2 && topScore >= secondScore + 1) confidence = 0.82;
  else if (topScore >= 1) confidence = 0.67;

  const fromUrgSp = rawSpec === "urg" || rawSpec === "sp" || rawSpec.includes("urgenc") || rawSpec.includes("salud publica") || rawSpec.includes("epidemiolog");
  const needsReview = confidence < 0.8 || (fromUrgSp && confidence < 0.9);
  return { spec: topSpec || "mi", confidence, reason: "keyword_inference", needsReview, scores };
}

function getCanonicalTopic(item, resolvedSpec) {
  const t1 = sanitizeTopicLabel(item.tema || "");
  if (t1) return t1;
  const t2 = sanitizeTopicLabel(item.subtema || "");
  if (t2) return t2;
  const t3 = sanitizeTopicLabel(item.gpcReference || "");
  if (t3) return t3;
  return `General ${TRONCAL_LABELS[resolvedSpec] || "Medicina Interna"}`;
}

function scoreCaseQuality(item) {
  let score = 0;
  const caseLen = String(item.case || "").trim().length;
  score += Math.min(12, Math.floor(caseLen / 90));

  if (Array.isArray(item.questions) && item.questions.length > 0) {
    score += 8;
    score += Math.min(10, item.questions.length * 2);
    const validSubs = item.questions.filter(sq => Array.isArray(sq.options) && sq.options.length >= 3 && String(sq.question || "").trim());
    score += validSubs.length;
    const explained = item.questions.filter(sq => String(sq.explanation || "").trim().length >= 40).length;
    score += explained;
  } else {
    if (String(item.question || "").trim().length > 0) score += 3;
    if (Array.isArray(item.options) && item.options.length >= 3) score += 2;
    if (String(item.explanation || "").trim().length >= 40) score += 1;
  }

  if (String(item.temaCanonical || "").trim().length > 0) score += 2;
  if (["mi", "ped", "gyo", "cir"].includes(item.specialty)) score += 2;
  if (String(item.gpcReference || "").trim()) score += 1;

  return score;
}

function getCaseKey(item) {
  const caseText = normalizeTextKey(item.case || "");
  if (caseText) return `case:${caseText}`;
  const qText = normalizeTextKey(item.question || "");
  if (qText) return `q:${qText}`;
  const sqText = Array.isArray(item.questions) && item.questions.length > 0
    ? normalizeTextKey(item.questions.map(sq => sq.question || "").join(" "))
    : "";
  return sqText ? `sq:${sqText}` : "";
}

function formatQuestionsFile(data) {
  return "// questions.js – Banco de reactivos para ENARMlab\n"
    + "const QUESTIONS = "
    + JSON.stringify(data, null, 2)
    + ";\n\nif (typeof module !== 'undefined') {\n  module.exports = QUESTIONS;\n}\n";
}

function ensureReportDir() {
  if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });
}

function main() {
  const baseQuestions = readQuestionsArray(INPUT_PATH);
  const appendMeta = [];
  const appendedCases = [];
  for (const appendPath of APPEND_PATHS) {
    const rows = readAppendCases(appendPath);
    appendMeta.push({ path: appendPath, count: rows.length });
    appendedCases.push(...rows);
  }
  const original = baseQuestions.concat(appendedCases);
  const reviewQueue = [];
  const blockMetrics = {
    ped: { total: 0, movedIn: 0, autoHigh: 0, needsReview: 0 },
    gyo: { total: 0, movedIn: 0, autoHigh: 0, needsReview: 0 },
    cir: { total: 0, movedIn: 0, autoHigh: 0, needsReview: 0 },
    mi: { total: 0, movedIn: 0, autoHigh: 0, needsReview: 0 }
  };

  const normalized = original.map((raw, idx) => {
    const item = { ...raw };
    const originalSpec = String(item.specialtyOriginal || item.specialty || "").trim();
    const originalTema = String(item.temaOriginal || item.tema || "").trim();
    const originalSubtema = String(item.subtemaOriginal || item.subtema || "").trim();

    item.specialty = originalSpec || item.specialty;
    item.tema = originalTema || item.tema;
    item.subtema = originalSubtema || item.subtema;

    if (Array.isArray(item.questions) && item.questions.length > 0) {
      item.questions = item.questions.map(normalizeQuestionLeaf);
    } else {
      const leaf = normalizeQuestionLeaf(item);
      item.question = leaf.question;
      item.options = leaf.options;
      item.answerIndex = leaf.answerIndex;
      item.explanation = leaf.explanation;
      item.gpcReference = leaf.gpcReference;
    }

    item.case = String(item.case || "").replace(/\s+/g, " ").trim();
    const inferred = inferTroncalSpecialty(item);
    item.specialty = inferred.spec;
    item.temaCanonical = getCanonicalTopic(item, item.specialty);
    item.subtemaCanonical = sanitizeTopicLabel(item.subtema || "") || item.temaCanonical;
    item.tema = item.temaCanonical;
    item.subtema = item.subtemaCanonical;

    if (inferred.needsReview) {
      reviewQueue.push({
        type: "specialty_review",
        index: idx,
        originalSpecialty: originalSpec,
        suggestedSpecialty: item.specialty,
        confidence: inferred.confidence,
        reason: inferred.reason,
        scores: inferred.scores,
        temaOriginal: originalTema,
        temaCanonical: item.temaCanonical,
        casePreview: String(item.case || "").slice(0, 200)
      });
    }

    const originalSpecNorm = normalizeTextKey(originalSpec);
    if (item.specialty !== originalSpecNorm) {
      blockMetrics[item.specialty].movedIn++;
    }
    blockMetrics[item.specialty].total++;
    if (!inferred.needsReview && inferred.confidence >= 0.8) blockMetrics[item.specialty].autoHigh++;
    if (inferred.needsReview) blockMetrics[item.specialty].needsReview++;

    item.specialtyOriginal = item.specialtyOriginal || originalSpec;
    item.temaOriginal = item.temaOriginal || originalTema;
    item.subtemaOriginal = item.subtemaOriginal || originalSubtema;
    return item;
  });

  const dedupeMap = new Map();
  const duplicateGroups = [];
  for (let i = 0; i < normalized.length; i++) {
    const item = normalized[i];
    const key = getCaseKey(item);
    if (!key) continue;
    if (!dedupeMap.has(key)) {
      dedupeMap.set(key, []);
    }
    dedupeMap.get(key).push({ idx: i, item });
  }

  const keepIndices = new Set();
  dedupeMap.forEach((group, key) => {
    if (group.length === 1) {
      keepIndices.add(group[0].idx);
      return;
    }
    const ranked = group
      .map(g => ({ ...g, quality: scoreCaseQuality(g.item) }))
      .sort((a, b) => {
        if (b.quality !== a.quality) return b.quality - a.quality;
        return String(b.item.case || "").length - String(a.item.case || "").length;
      });
    keepIndices.add(ranked[0].idx);
    duplicateGroups.push({
      key,
      keptIndex: ranked[0].idx,
      removedIndices: ranked.slice(1).map(r => r.idx),
      variants: ranked.map(r => ({
        index: r.idx,
        specialty: r.item.specialty,
        temaCanonical: r.item.temaCanonical,
        quality: r.quality
      }))
    });

    const distinctSpecs = new Set(ranked.map(r => r.item.specialty));
    if (distinctSpecs.size > 1) {
      reviewQueue.push({
        type: "duplicate_conflict",
        key,
        keptIndex: ranked[0].idx,
        specialties: Array.from(distinctSpecs),
        variants: ranked.slice(0, 4).map(r => ({
          index: r.idx,
          specialty: r.item.specialty,
          temaCanonical: r.item.temaCanonical,
          confidenceHint: scoreCaseQuality(r.item)
        }))
      });
    }
  });

  const finalData = normalized.filter((_, idx) => keepIndices.has(idx));
  const topicCounts = {};
  finalData.forEach(item => {
    const t = item.temaCanonical || "Sin tema";
    topicCounts[t] = (topicCounts[t] || 0) + 1;
  });

  const outOfTroncal = finalData.filter(i => !["mi", "ped", "gyo", "cir"].includes(i.specialty)).length;
  const missingTemaCanonical = finalData.filter(i => !String(i.temaCanonical || "").trim()).length;

  const blockSummary = {};
  for (const spec of BLOCK_ORDER) {
    const byTopic = {};
    finalData
      .filter(c => c.specialty === spec)
      .forEach(c => { byTopic[c.temaCanonical] = (byTopic[c.temaCanonical] || 0) + 1; });
    blockSummary[spec] = {
      ...blockMetrics[spec],
      topTopics: Object.entries(byTopic).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([topic, count]) => ({ topic, count }))
    };
  }

  const report = {
    generatedAt: new Date().toISOString(),
    dryRun: DRY_RUN,
    appendSources: appendMeta,
    totals: {
      baseInput: baseQuestions.length,
      appended: appendedCases.length,
      input: original.length,
      afterNormalization: normalized.length,
      output: finalData.length,
      duplicatesRemoved: normalized.length - finalData.length,
      duplicateGroups: duplicateGroups.length,
      outOfTroncal,
      missingTemaCanonical,
      reviewQueue: reviewQueue.length
    },
    acceptance: {
      onlyTroncalSpecialties: outOfTroncal === 0,
      hasTemaCanonicalEverywhere: missingTemaCanonical === 0
    },
    blockOrder: BLOCK_ORDER,
    blocks: blockSummary,
    topTopicsGlobal: Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 25).map(([topic, count]) => ({ topic, count }))
  };

  const mdLines = [
    "# Case Cleanup Report",
    "",
    `- Generated: ${report.generatedAt}`,
    `- Base input cases: ${report.totals.baseInput}`,
    `- Appended cases: ${report.totals.appended}`,
    `- Input cases: ${report.totals.input}`,
    `- Output cases: ${report.totals.output}`,
    `- Duplicates removed: ${report.totals.duplicatesRemoved} (${report.totals.duplicateGroups} groups)`,
    `- Out of troncal specialties: ${report.totals.outOfTroncal}`,
    `- Missing temaCanonical: ${report.totals.missingTemaCanonical}`,
    `- Manual review queue: ${report.totals.reviewQueue}`,
    "",
    "## Block Summary"
  ];
  BLOCK_ORDER.forEach(spec => {
    const b = report.blocks[spec];
    mdLines.push(`### ${TRONCAL_LABELS[spec]} (${spec})`);
    mdLines.push(`- Total: ${b.total}`);
    mdLines.push(`- Moved in: ${b.movedIn}`);
    mdLines.push(`- Auto high confidence: ${b.autoHigh}`);
    mdLines.push(`- Needs review: ${b.needsReview}`);
    mdLines.push("- Top temas:");
    b.topTopics.slice(0, 8).forEach(tt => mdLines.push(`  - ${tt.topic}: ${tt.count}`));
    mdLines.push("");
  });

  ensureReportDir();
  fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2), "utf8");
  fs.writeFileSync(REVIEW_QUEUE_JSON, JSON.stringify(reviewQueue, null, 2), "utf8");
  fs.writeFileSync(REPORT_MD, mdLines.join("\n"), "utf8");

  if (!DRY_RUN) {
    fs.writeFileSync(QUESTIONS_PATH + ".pre-sanitize.bak", fs.readFileSync(QUESTIONS_PATH, "utf8"), "utf8");
    fs.writeFileSync(QUESTIONS_PATH, formatQuestionsFile(finalData), "utf8");
  }

  console.log(JSON.stringify({
    inputPath: INPUT_PATH,
    totals: report.totals,
    acceptance: report.acceptance,
    reportPath: REPORT_JSON,
    reviewQueuePath: REVIEW_QUEUE_JSON,
    outputUpdated: !DRY_RUN
  }, null, 2));
}

main();
