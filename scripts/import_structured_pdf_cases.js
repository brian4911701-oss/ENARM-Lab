const fs = require("fs");
const path = require("path");
const PDFParser = require("pdf2json");

const ROOT = path.join(__dirname, "..");
const QUESTIONS_PATH = path.join(ROOT, "questions.js");
const REPORTS_DIR = path.join(ROOT, "reports");

function getArg(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return "";
  return process.argv[idx + 1] || "";
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

const inputArg = getArg("--input");
const outputArg = getArg("--output");
const reportArg = getArg("--report");
const appendToBank = hasFlag("--append");

const inputPath = inputArg
  ? (path.isAbsolute(inputArg) ? inputArg : path.resolve(process.cwd(), inputArg))
  : "";
const outputPath = outputArg
  ? (path.isAbsolute(outputArg) ? outputArg : path.resolve(process.cwd(), outputArg))
  : path.join(REPORTS_DIR, "parsed_structured_pdf_cases.json");
const reportPath = reportArg
  ? (path.isAbsolute(reportArg) ? reportArg : path.resolve(process.cwd(), reportArg))
  : path.join(REPORTS_DIR, "parsed_structured_pdf_cases_report.json");

const SPECIALTY_MAP = {
  "medicina interna": "mi",
  "pediatria": "ped",
  "ginecologia y obstetricia": "gyo",
  "cirugia": "cir",
  "urgencias": "mi",
  "salud publica": "mi"
};

function maybeRepairMojibake(value) {
  const text = String(value || "");
  if (!/[ÃÂâ€€™â€œâ€\uFFFD]/.test(text)) return text;

  try {
    const repaired = Buffer.from(text, "latin1").toString("utf8");
    if (repaired && !/\uFFFD/.test(repaired)) return repaired;
  } catch (_) {
    // Ignore and keep original text.
  }

  return text;
}

function decodeRunText(value) {
  try {
    return maybeRepairMojibake(decodeURIComponent(value || ""));
  } catch (_) {
    return maybeRepairMojibake(String(value || ""));
  }
}

function stripCite(value) {
  return String(value || "")
    .replace(/\[\s*cite[^\]]*?\]/gi, " ")
    .replace(/\(\s*cite[^)]*?\)/gi, " ")
    .replace(/\bcite\b\s*:?\s*\d*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeInline(value) {
  return stripCite(maybeRepairMojibake(String(value || "")))
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([¿¡])\s+/g, "$1")
    .trim();
}

function joinText(base, addition) {
  const left = sanitizeInline(base);
  const right = sanitizeInline(addition);

  if (!left) return right;
  if (!right) return left;
  if (/-$/.test(left)) return `${left}${right}`;

  return sanitizeInline(`${left} ${right}`);
}

function normalizeTextKey(value) {
  return sanitizeInline(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeTopicLabel(value) {
  return sanitizeInline(value)
    .replace(/\s*[-:;,.]+\s*$/g, "")
    .trim();
}

function mapSpecialty(value) {
  const key = normalizeTextKey(value);
  return SPECIALTY_MAP[key] || "mi";
}

function mapDifficulty(value) {
  const key = normalizeTextKey(value);
  if (key.includes("muy alta")) return "muy-alta";
  if (key.includes("media alta") || key.includes("media-alta")) return "alta";
  if (key.includes("alta")) return "alta";
  if (key.includes("media")) return "media";
  if (key.includes("baja")) return "baja";
  return "media";
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

function writeQuestionsArray(filePath, questions) {
  const contents =
    "// questions.js - Banco de reactivos para ENARMlab\n" +
    "const QUESTIONS = " + JSON.stringify(questions, null, 2) + ";\n\n" +
    "if (typeof module !== 'undefined') {\n  module.exports = QUESTIONS;\n}\n";
  fs.writeFileSync(filePath, contents, "utf8");
}

function summarizeByField(items, field) {
  const map = new Map();
  for (const item of items) {
    const key = String(item[field] || "").trim() || "(sin dato)";
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Object.fromEntries(
    [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))
  );
}

function getCaseKey(item) {
  return normalizeTextKey([
    item.specialty,
    item.tema,
    item.subtema,
    item.case
  ].join(" | "));
}

function uniqueBySignature(existing, incoming) {
  const seen = new Set(
    existing.map(item => normalizeTextKey([
      item.specialty,
      item.tema,
      item.subtema,
      item.case,
      item.question
    ].join(" | ")))
  );

  const additions = [];
  for (const item of incoming) {
    const signature = normalizeTextKey([
      item.specialty,
      item.tema,
      item.subtema,
      item.case,
      item.question
    ].join(" | "));

    if (seen.has(signature)) continue;
    seen.add(signature);
    additions.push(item);
  }

  return additions;
}

function isMetadataLabel(text) {
  return /^(Especialidad|Tema|Subtema|Dificultad)\s*:/i.test(text);
}

function isCaseLabel(text) {
  return /^Caso\s+cl[ií]nico\s*:?\s*/i.test(text);
}

function isQuestionStart(text) {
  return /^Pregunta\s+\d+\s*:?\s*/i.test(text);
}

function isOptionStart(text) {
  return /^([A-Da-d])\)\s*(.*)$/.test(text);
}

function isFeedbackStart(text) {
  return /^Retroalimentaci[oó]n\s*:?\s*/i.test(text);
}

function isSourceStart(text) {
  return /^(Fuentes?\s+base|Fuentes?|Referencias?)\s*:?\s*/i.test(text);
}

function isBlockStart(text) {
  return /^Especialidad\s*:/i.test(text);
}

function isStopForWrappedValue(text) {
  return (
    isMetadataLabel(text)
    || isCaseLabel(text)
    || isQuestionStart(text)
    || isOptionStart(text)
    || isFeedbackStart(text)
    || isSourceStart(text)
  );
}

function collectWrappedValue(lines, startIndex, labelPattern) {
  let value = sanitizeInline(lines[startIndex].text.replace(labelPattern, ""));
  let i = startIndex + 1;

  while (i < lines.length) {
    const text = lines[i].text;
    if (isStopForWrappedValue(text)) break;
    value = joinText(value, text);
    i += 1;
  }

  return { value, nextIndex: i };
}

function canonicalTema(rawTema) {
  const clean = sanitizeTopicLabel(rawTema);
  if (!clean) return "";
  return sanitizeTopicLabel(clean.split(/\s*:\s*/)[0] || clean);
}

function canonicalSubtema(rawTema, rawSubtema) {
  const subtema = sanitizeTopicLabel(rawSubtema);
  if (subtema) return subtema;

  const temaClean = sanitizeTopicLabel(rawTema);
  const parts = temaClean.split(/\s*:\s*/).map(part => sanitizeTopicLabel(part)).filter(Boolean);
  if (parts.length > 1) return parts.slice(1).join(": ");
  return canonicalTema(rawTema);
}

function extractPdfLines(filePath) {
  return new Promise((resolve, reject) => {
    const pdf = new PDFParser();

    pdf.on("pdfParser_dataError", error => {
      reject(error.parserError || error);
    });

    pdf.on("pdfParser_dataReady", data => {
      const lines = [];

      data.Pages.forEach((page, pageIndex) => {
        const items = [];

        for (const textNode of page.Texts || []) {
          for (const run of textNode.R || []) {
            items.push({
              x: textNode.x,
              y: textNode.y,
              text: decodeRunText(run.T),
              italic: Array.isArray(run.TS) && run.TS[3] === 1,
              bold: Array.isArray(run.TS) && run.TS[2] === 1
            });
          }
        }

        items.sort((a, b) => (
          a.y === b.y ? a.x - b.x : a.y - b.y
        ));

        const grouped = [];
        for (const item of items) {
          const last = grouped[grouped.length - 1];
          if (!last || Math.abs(last.y - item.y) > 0.12) {
            grouped.push({
              page: pageIndex + 1,
              y: item.y,
              parts: [item]
            });
          } else {
            last.parts.push(item);
          }
        }

        for (const group of grouped) {
          const rawText = group.parts.map(part => part.text).join("");
          const text = sanitizeInline(rawText);
          if (!text) continue;

          lines.push({
            page: group.page,
            y: group.y,
            text,
            italic: group.parts.some(part => part.italic),
            bold: group.parts.some(part => part.bold)
          });
        }
      });

      resolve(lines);
    });

    pdf.loadPDF(filePath);
  });
}

function splitBlocks(lines) {
  const blocks = [];
  let current = [];

  for (const line of lines) {
    if (isBlockStart(line.text)) {
      if (current.length) blocks.push(current);
      current = [line];
      continue;
    }

    if (current.length) current.push(line);
  }

  if (current.length) blocks.push(current);
  return blocks;
}

function parseQuestionItems(lines, startIndex, clinicalCase, meta, issues) {
  const parsed = [];
  let i = startIndex;

  while (i < lines.length) {
    while (i < lines.length && !isQuestionStart(lines[i].text)) i += 1;
    if (i >= lines.length) break;

    const header = lines[i].text;
    const headerMatch = header.match(/^Pregunta\s+(\d+)\s*:?\s*(.*)$/i);
    const questionNumber = headerMatch ? headerMatch[1] : "?";
    let questionText = headerMatch ? sanitizeInline(headerMatch[2]) : "";
    i += 1;

    while (i < lines.length) {
      const text = lines[i].text;
      if (/^Incisos\s*:?\s*$/i.test(text)) {
        i += 1;
        break;
      }
      if (isOptionStart(text) || isFeedbackStart(text) || isQuestionStart(text) || isSourceStart(text)) {
        break;
      }
      questionText = joinText(questionText, text);
      i += 1;
    }

    const options = [];
    const markedAnswerIndexes = [];

    while (i < lines.length) {
      const line = lines[i];
      const text = line.text;

      if (/^Incisos\s*:?\s*$/i.test(text)) {
        i += 1;
        continue;
      }
      if (isFeedbackStart(text) || isQuestionStart(text) || isSourceStart(text)) break;

      const optionMatch = text.match(/^([A-Da-d])\)\s*(.*)$/);
      if (optionMatch) {
        let optionText = sanitizeInline(optionMatch[2].replace(/\*/g, " "));
        const markedAsCorrect = text.includes("*") || line.italic;
        options.push(optionText);
        if (markedAsCorrect) markedAnswerIndexes.push(options.length - 1);
        i += 1;
        continue;
      }

      if (options.length) {
        const continuationText = sanitizeInline(text.replace(/\*/g, " "));
        options[options.length - 1] = joinText(options[options.length - 1], continuationText);
        if (text.includes("*") || line.italic) {
          markedAnswerIndexes.push(options.length - 1);
        }
        i += 1;
        continue;
      }

      questionText = joinText(questionText, text);
      i += 1;
    }

    const uniqueMarkedIndexes = [...new Set(markedAnswerIndexes)];
    let answerIndex = uniqueMarkedIndexes.length === 1 ? uniqueMarkedIndexes[0] : 0;

    if (uniqueMarkedIndexes.length > 1) {
      issues.push(`Múltiples respuestas marcadas en ${meta.temaOriginal || meta.tema} / pregunta ${questionNumber}. Se usó la primera.`);
      answerIndex = uniqueMarkedIndexes[0];
    }

    if (options.length !== 4) {
      issues.push(`Número de opciones inválido (${options.length}) en ${meta.temaOriginal || meta.tema} / pregunta ${questionNumber}.`);
    }

    if (!uniqueMarkedIndexes.length) {
      issues.push(`Sin respuesta marcada en ${meta.temaOriginal || meta.tema} / pregunta ${questionNumber}.`);
    }

    let explanation = "";
    let gpcReference = "";
    let mode = "";

    while (i < lines.length) {
      const text = lines[i].text;
      if (isQuestionStart(text)) break;

      if (isFeedbackStart(text)) {
        mode = "explanation";
        explanation = joinText(
          explanation,
          text.replace(/^Retroalimentaci[oó]n\s*:?\s*/i, "")
        );
        i += 1;
        continue;
      }

      if (isSourceStart(text)) {
        mode = "source";
        gpcReference = joinText(
          gpcReference,
          text.replace(/^(Fuentes?\s+base|Fuentes?|Referencias?)\s*:?\s*/i, "")
        );
        i += 1;
        continue;
      }

      if (/^Incisos\s*:?\s*$/i.test(text)) {
        i += 1;
        continue;
      }

      if (mode === "source") {
        gpcReference = joinText(gpcReference, text);
      } else {
        explanation = joinText(explanation, text);
      }
      i += 1;
    }

    parsed.push({
      specialty: meta.specialty,
      case: clinicalCase,
      question: questionText,
      options: options.map(option => sanitizeInline(option)),
      answerIndex,
      explanation: sanitizeInline(explanation),
      gpcReference: sanitizeInline(gpcReference),
      tema: meta.tema,
      temaCanonical: meta.tema,
      subtemaCanonical: meta.subtema,
      subtema: meta.subtema,
      specialtyOriginal: meta.specialtyOriginal,
      temaOriginal: meta.temaOriginal,
      subtemaOriginal: meta.subtemaOriginal,
      difficulty: meta.difficulty
    });
  }

  return parsed;
}

function parseBlock(blockLines, issues) {
  let specialtyLabel = "";
  let temaOriginal = "";
  let subtemaOriginal = "";
  let difficultyLabel = "media";
  let i = 0;

  while (i < blockLines.length) {
    const text = blockLines[i].text;

    if (/^Especialidad\s*:/i.test(text)) {
      const parsed = collectWrappedValue(blockLines, i, /^Especialidad\s*:\s*/i);
      specialtyLabel = parsed.value;
      i = parsed.nextIndex;
      continue;
    }

    if (/^Tema\s*:/i.test(text)) {
      const parsed = collectWrappedValue(blockLines, i, /^Tema\s*:\s*/i);
      temaOriginal = parsed.value;
      i = parsed.nextIndex;
      continue;
    }

    if (/^Subtema\s*:/i.test(text)) {
      const parsed = collectWrappedValue(blockLines, i, /^Subtema\s*:\s*/i);
      subtemaOriginal = parsed.value;
      i = parsed.nextIndex;
      continue;
    }

    if (/^Dificultad\s*:/i.test(text)) {
      const parsed = collectWrappedValue(blockLines, i, /^Dificultad\s*:\s*/i);
      difficultyLabel = parsed.value;
      i = parsed.nextIndex;
      continue;
    }

    if (isCaseLabel(text)) break;
    i += 1;
  }

  let clinicalCase = "";
  if (i < blockLines.length && isCaseLabel(blockLines[i].text)) {
    clinicalCase = joinText(
      clinicalCase,
      blockLines[i].text.replace(/^Caso\s+cl[ií]nico\s*:?\s*/i, "")
    );
    i += 1;
  }

  while (i < blockLines.length && !isQuestionStart(blockLines[i].text)) {
    if (!isMetadataLabel(blockLines[i].text)) {
      clinicalCase = joinText(clinicalCase, blockLines[i].text);
    }
    i += 1;
  }

  const tema = canonicalTema(temaOriginal) || sanitizeTopicLabel(temaOriginal);
  const subtema = canonicalSubtema(temaOriginal, subtemaOriginal) || tema;
  const meta = {
    specialty: mapSpecialty(specialtyLabel),
    specialtyOriginal: sanitizeInline(specialtyLabel) || mapSpecialty(specialtyLabel),
    tema,
    temaOriginal: sanitizeTopicLabel(temaOriginal) || tema,
    subtema,
    subtemaOriginal: sanitizeTopicLabel(subtemaOriginal) || subtema,
    difficulty: mapDifficulty(difficultyLabel)
  };

  if (!clinicalCase) {
    issues.push(`Caso clínico vacío en tema ${meta.temaOriginal || meta.tema}.`);
  }

  return parseQuestionItems(blockLines, i, clinicalCase, meta, issues);
}

function validateQuestions(questions) {
  const issues = [];

  questions.forEach((item, index) => {
    if (!item.case) issues.push(`Caso vacío en índice ${index}`);
    if (!item.question) issues.push(`Pregunta vacía en índice ${index}`);
    if (!Array.isArray(item.options) || item.options.length !== 4) {
      issues.push(`Número de opciones inválido en índice ${index}: ${item.options ? item.options.length : 0}`);
    }
    if (item.answerIndex < 0 || item.answerIndex > 3) {
      issues.push(`Respuesta correcta inválida en índice ${index}: ${item.answerIndex}`);
    }
    if (!item.tema) issues.push(`Tema vacío en índice ${index}`);
    if (!item.subtema) issues.push(`Subtema vacío en índice ${index}`);
  });

  return issues;
}

async function main() {
  if (!inputPath) {
    throw new Error("Debes indicar --input con la ruta del PDF.");
  }

  const lines = await extractPdfLines(inputPath);
  const blocks = splitBlocks(lines);
  const parseIssues = [];
  const parsedQuestions = blocks.flatMap(block => parseBlock(block, parseIssues));
  const validationIssues = validateQuestions(parsedQuestions);
  const allIssues = [...parseIssues, ...validationIssues];

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(parsedQuestions, null, 2), "utf8");

  const report = {
    inputPath,
    outputPath,
    blockCount: blocks.length,
    parsedQuestionCount: parsedQuestions.length,
    distinctCaseCount: new Set(parsedQuestions.map(getCaseKey)).size,
    byTema: summarizeByField(parsedQuestions, "tema"),
    bySubtema: summarizeByField(parsedQuestions, "subtema"),
    bySpecialty: summarizeByField(parsedQuestions, "specialty"),
    issueCount: allIssues.length,
    issues: allIssues.slice(0, 300)
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");

  console.log(`PDF: ${inputPath}`);
  console.log(`Líneas extraídas: ${lines.length}`);
  console.log(`Bloques detectados: ${blocks.length}`);
  console.log(`Preguntas parseadas: ${parsedQuestions.length}`);
  console.log(`Casos clínicos detectados: ${report.distinctCaseCount}`);
  console.log(`Salida JSON: ${outputPath}`);
  console.log(`Reporte: ${reportPath}`);

  if (allIssues.length) {
    console.log(`Incidencias detectadas: ${allIssues.length}`);
    allIssues.slice(0, 20).forEach(issue => console.log(`- ${issue}`));
  } else {
    console.log("Validación básica: OK");
  }

  if (appendToBank) {
    const existing = readQuestionsArray(QUESTIONS_PATH);
    const additions = uniqueBySignature(existing, parsedQuestions);
    const combined = existing.concat(additions);
    writeQuestionsArray(QUESTIONS_PATH, combined);

    console.log(`questions.js actualizado. Existentes: ${existing.length}, agregados: ${additions.length}, total: ${combined.length}`);
    console.log(`Casos clínicos nuevos agregados: ${new Set(additions.map(getCaseKey)).size}`);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
