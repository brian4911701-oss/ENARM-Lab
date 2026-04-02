const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");

const ROOT = path.join(__dirname, "..");
const QUESTIONS_PATH = path.join(ROOT, "questions.js");

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
const appendToBank = hasFlag("--append");
const inputPath = inputArg
  ? (path.isAbsolute(inputArg) ? inputArg : path.resolve(process.cwd(), inputArg))
  : "";
const outputPath = outputArg
  ? (path.isAbsolute(outputArg) ? outputArg : path.resolve(process.cwd(), outputArg))
  : path.join(ROOT, "parsed_structured_pdf_cases.json");

const SPECIALTY_MAP = {
  "medicina interna": "mi",
  "pediatria": "ped",
  "pediatría": "ped",
  "ginecologia y obstetricia": "gyo",
  "ginecología y obstetricia": "gyo",
  "cirugia": "cir",
  "cirugía": "cir"
};

function normalizeTextKey(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeInline(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function mapSpecialty(value) {
  const key = normalizeTextKey(value);
  return SPECIALTY_MAP[key] || "mi";
}

function mapDifficulty(value) {
  const key = normalizeTextKey(value);
  if (key === "muy alta") return "muy-alta";
  if (key === "alta") return "alta";
  if (key === "media") return "media";
  if (key === "baja") return "baja";
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

function splitBlocks(text) {
  const normalized = text
    .replace(/\r/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/\n--\s+\d+\s+of\s+\d+\s+--\n/g, "\n")
    .replace(/\n---\n/g, "\n")
    .trim();

  return normalized
    .split(/(?=Especialidad:\s*)/g)
    .map(block => block.trim())
    .filter(block => block.startsWith("Especialidad:"));
}

function collectWrappedValue(lines, startIndex, label) {
  const values = [];
  let current = String(lines[startIndex] || "").replace(new RegExp(`^${label}:\\s*`), "").trim();
  if (current) values.push(current);

  let i = startIndex + 1;
  while (i < lines.length) {
    const line = String(lines[i] || "").trim();
    if (!line) {
      i += 1;
      continue;
    }
    if (/^(Especialidad|Tema|Subtema|Dificultad|Caso Clínico|Pregunta \d+|Retroalimentación Pregunta \d+:|[A-D]\))/.test(line)) {
      break;
    }
    values.push(line);
    i += 1;
  }

  return {
    value: sanitizeInline(values.join(" ")),
    nextIndex: i
  };
}

function parseOptions(lines, startIndex) {
  const options = [];
  let answerIndex = -1;
  let i = startIndex;

  while (i < lines.length) {
    const line = String(lines[i] || "").trim();
    if (!line) {
      i += 1;
      continue;
    }
    if (/^Retroalimentación Pregunta \d+:/.test(line)) break;
    if (/^Pregunta \d+/.test(line)) break;

    const optionMatch = line.match(/^([A-D])\)\s*(.*)$/);
    if (optionMatch) {
      let optionText = optionMatch[2].trim();
      let correct = false;
      if (optionText.endsWith("*")) {
        optionText = optionText.slice(0, -1).trim();
        correct = true;
      }
      options.push(optionText);
      if (correct) answerIndex = options.length - 1;
      i += 1;
      continue;
    }

    if (options.length > 0) {
      let continuation = line;
      let correct = false;
      if (continuation.endsWith("*")) {
        continuation = continuation.slice(0, -1).trim();
        correct = true;
      }
      options[options.length - 1] = sanitizeInline(`${options[options.length - 1]} ${continuation}`);
      if (correct) answerIndex = options.length - 1;
      i += 1;
      continue;
    }

    break;
  }

  return {
    options: options.map(sanitizeInline),
    answerIndex: answerIndex >= 0 ? answerIndex : 0,
    nextIndex: i
  };
}

function parseQuestions(lines, startIndex) {
  const questions = [];
  let i = startIndex;

  while (i < lines.length) {
    const line = String(lines[i] || "").trim();
    if (!line) {
      i += 1;
      continue;
    }

    const qMatch = line.match(/^Pregunta\s+(\d+)\s*$/);
    if (!qMatch) {
      i += 1;
      continue;
    }

    const questionParts = [];
    i += 1;
    while (i < lines.length) {
      const current = String(lines[i] || "").trim();
      if (!current) {
        i += 1;
        continue;
      }
      if (/^[A-D]\)/.test(current)) break;
      if (/^Pregunta \d+/.test(current)) break;
      if (/^Retroalimentación Pregunta \d+:/.test(current)) break;
      questionParts.push(current);
      i += 1;
    }

    const parsedOptions = parseOptions(lines, i);
    i = parsedOptions.nextIndex;

    let explanation = "";
    if (i < lines.length && /^Retroalimentación Pregunta \d+:/.test(String(lines[i] || "").trim())) {
      const explanationParts = [];
      i += 1;
      while (i < lines.length) {
        const current = String(lines[i] || "").trim();
        if (!current) {
          i += 1;
          continue;
        }
        if (/^Pregunta \d+/.test(current)) break;
        explanationParts.push(current);
        i += 1;
      }
      explanation = sanitizeInline(explanationParts.join(" "));
    }

    questions.push({
      question: sanitizeInline(questionParts.join(" ")),
      options: parsedOptions.options,
      answerIndex: parsedOptions.answerIndex,
      explanation
    });
  }

  return questions;
}

function parseBlock(block) {
  const lines = block
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .filter(line => !/^--\s+\d+\s+of\s+\d+\s+--$/.test(line))
    .filter(line => line !== "---");

  let specialtyLabel = "";
  let tema = "";
  let subtema = "";
  let difficulty = "media";
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("Especialidad:")) {
      const parsed = collectWrappedValue(lines, i, "Especialidad");
      specialtyLabel = parsed.value;
      i = parsed.nextIndex;
      continue;
    }
    if (line.startsWith("Tema:")) {
      const parsed = collectWrappedValue(lines, i, "Tema");
      tema = parsed.value;
      i = parsed.nextIndex;
      continue;
    }
    if (line.startsWith("Subtema:")) {
      const parsed = collectWrappedValue(lines, i, "Subtema");
      subtema = parsed.value;
      i = parsed.nextIndex;
      continue;
    }
    if (line.startsWith("Dificultad:")) {
      const parsed = collectWrappedValue(lines, i, "Dificultad");
      difficulty = mapDifficulty(parsed.value);
      i = parsed.nextIndex;
      continue;
    }
    if (line === "Caso Clínico") {
      i += 1;
      break;
    }
    i += 1;
  }

  const caseParts = [];
  while (i < lines.length && !/^Pregunta \d+/.test(lines[i])) {
    caseParts.push(lines[i]);
    i += 1;
  }

  const parsedQuestions = parseQuestions(lines, i);
  const resolvedSubtema = subtema || tema;
  const clinicalCase = sanitizeInline(caseParts.join(" "));

  return parsedQuestions.map(item => ({
    specialty: mapSpecialty(specialtyLabel),
    case: clinicalCase,
    question: item.question,
    options: item.options,
    answerIndex: item.answerIndex,
    explanation: item.explanation,
    gpcReference: "",
    tema,
    temaCanonical: tema,
    subtemaCanonical: resolvedSubtema,
    subtema: resolvedSubtema,
    specialtyOriginal: mapSpecialty(specialtyLabel),
    temaOriginal: tema,
    subtemaOriginal: resolvedSubtema,
    difficulty
  }));
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

async function extractTextFromPdf(filePath) {
  const data = await fs.promises.readFile(filePath);
  const parser = new PDFParse({ data });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

async function main() {
  if (!inputPath) {
    throw new Error("Debes indicar --input con la ruta del PDF.");
  }

  const text = await extractTextFromPdf(inputPath);
  const blocks = splitBlocks(text);
  const parsedQuestions = blocks.flatMap(parseBlock);
  const issues = validateQuestions(parsedQuestions);

  fs.writeFileSync(outputPath, JSON.stringify(parsedQuestions, null, 2), "utf8");

  console.log(`PDF: ${inputPath}`);
  console.log(`Bloques detectados: ${blocks.length}`);
  console.log(`Preguntas parseadas: ${parsedQuestions.length}`);
  console.log(`Salida JSON: ${outputPath}`);

  if (issues.length) {
    console.log(`Validaciones con incidencia: ${issues.length}`);
    issues.slice(0, 20).forEach(issue => console.log(`- ${issue}`));
  } else {
    console.log("Validación básica: OK");
  }

  if (appendToBank) {
    const existing = readQuestionsArray(QUESTIONS_PATH);
    const additions = uniqueBySignature(existing, parsedQuestions);
    const combined = existing.concat(additions);
    writeQuestionsArray(QUESTIONS_PATH, combined);
    console.log(`questions.js actualizado. Existentes: ${existing.length}, agregados: ${additions.length}, total: ${combined.length}`);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
