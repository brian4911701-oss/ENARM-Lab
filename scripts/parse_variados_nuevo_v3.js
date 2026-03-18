const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const INPUT_TXT = path.join(ROOT, "variados_text_nuevo.txt");
const OUTPUT_JSON = path.join(ROOT, "parsed_variados_nuevo_v3.json");

const specialtyMap = {
  "medicina interna": "mi",
  "pediatria": "ped",
  "ginecologia y obstetricia": "gyo",
  "cirugia": "cir",
  "salud publica": "mi",
  "urgencias": "mi"
};

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function clean(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/^[:\-\s]+/, "")
    .trim();
}

function isPageBreakLine(line) {
  return /-{6,}\s*Page\s*\(\d+\)\s*Break\s*-{6,}/i.test(line);
}

function parseSpecialty(raw) {
  const key = normalize(raw);
  if (specialtyMap[key]) return specialtyMap[key];
  if (key.includes("pediatr")) return "ped";
  if (key.includes("ginec") || key.includes("obstet")) return "gyo";
  if (key.includes("cirug") || key.includes("trauma") || key.includes("ortoped")) return "cir";
  if (key.includes("medicina interna")) return "mi";
  return "mi";
}

function parseDifficulty(raw) {
  const n = normalize(raw);
  if (n.includes("muy alta")) return "muy-alta";
  if (n.includes("alta")) return "alta";
  if (n.includes("media")) return "media";
  return "baja";
}

function makeId(seed) {
  const s = `${seed}_${Date.now()}_${Math.random()}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return `q${(h >>> 0).toString(36).slice(0, 9)}`;
}

function parseBlock(lines, startIdx, endIdx, fallbackSpecialty) {
  let specialtyRaw = "";
  let tema = "";
  let difficulty = "media";
  let caseText = "";
  const questions = [];

  let mode = "meta";
  let current = null;
  let lastFeedback = "";
  let metaLocked = false;

  function pushQuestion() {
    if (!current) return;
    current.question = clean(current.question);
    current.options = (current.options || []).map(clean).filter(Boolean);
    if (!current.options.length) {
      current = null;
      return;
    }
    if (!Number.isInteger(current.answerIndex) || current.answerIndex < 0 || current.answerIndex >= current.options.length) {
      current.answerIndex = 0;
    }
    current.explanation = clean(current.explanation || "");
    if (!current.explanation && lastFeedback) current.explanation = lastFeedback;
    if (current.explanation) lastFeedback = current.explanation;
    questions.push(current);
    current = null;
  }

  for (let i = startIdx; i < endIdx; i++) {
    let line = String(lines[i] || "").replace(/^\uFEFF/, "").trim();
    if (!line || line === "---" || isPageBreakLine(line)) continue;

    if (/^Especialidad:/i.test(line)) {
      if (metaLocked) break;
      if (!specialtyRaw) specialtyRaw = clean(line.replace(/^Especialidad:/i, ""));
      continue;
    }
    if (/^Tema:/i.test(line)) {
      if (metaLocked) break;
      tema = clean(line.replace(/^Tema:/i, ""));
      continue;
    }
    if (/^Dificultad:/i.test(line)) {
      if (metaLocked) break;
      difficulty = parseDifficulty(clean(line.replace(/^Dificultad:/i, "")));
      continue;
    }
    if (/^Caso Cl/i.test(line)) {
      mode = "case";
      metaLocked = true;
      continue;
    }

    const qMatch = line.match(/^Pregunta\s+(\d+)/i);
    if (qMatch) {
      metaLocked = true;
      pushQuestion();
      current = {
        id: makeId(`${startIdx}_${qMatch[1]}`),
        question: "",
        options: [],
        answerIndex: -1,
        explanation: "",
        gpcReference: ""
      };
      mode = "question";
      continue;
    }

    if (/^Retroalimentaci/i.test(line)) {
      mode = "feedback";
      const inline = clean(line.replace(/^Retroalimentaci[oó]n(?:\s+Pregunta\s+\d+)?\s*:/i, ""));
      if (inline && current) {
        current.explanation = clean(`${current.explanation} ${inline}`);
      }
      continue;
    }

    const optMatch = line.match(/^([A-E])\)\s*(.*)$/i);
    if (optMatch && current) {
      mode = "options";
      let txt = clean(optMatch[2]);
      const isAnswer = /\*/.test(txt);
      txt = txt.replace(/\*/g, "").trim();
      current.options.push(txt);
      if (isAnswer) current.answerIndex = current.options.length - 1;
      continue;
    }

    if (mode === "case") {
      caseText = clean(`${caseText} ${line}`);
      continue;
    }
    if (mode === "question" && current) {
      current.question = clean(`${current.question} ${line}`);
      continue;
    }
    if (mode === "options" && current && current.options.length > 0) {
      let cont = line;
      const hasStar = /\*/.test(cont);
      cont = clean(cont.replace(/\*/g, ""));
      current.options[current.options.length - 1] = clean(`${current.options[current.options.length - 1]} ${cont}`);
      if (hasStar) current.answerIndex = current.options.length - 1;
      continue;
    }
    if (mode === "feedback" && current) {
      current.explanation = clean(`${current.explanation} ${line}`);
      continue;
    }
  }

  pushQuestion();

  if (!questions.length || !tema || !caseText) return null;
  const specialty = parseSpecialty(specialtyRaw || fallbackSpecialty || "");

  return {
    specialty,
    tema: clean(tema),
    subtema: clean(tema),
    difficulty,
    case: clean(caseText),
    questions
  };
}

function main() {
  const raw = fs.readFileSync(INPUT_TXT, "utf8");
  const lines = raw.split(/\r?\n/);

  const starts = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*Tema:/i.test(lines[i])) starts.push(i);
  }

  const parsed = [];
  let lastSpecialty = "";
  for (let i = 0; i < starts.length; i++) {
    const start = starts[i];
    const end = i + 1 < starts.length ? starts[i + 1] : lines.length;

    for (let j = start; j >= Math.max(0, start - 35); j--) {
      const line = String(lines[j] || "").replace(/^\uFEFF/, "").trim();
      if (/^Especialidad:/i.test(line)) {
        lastSpecialty = clean(line.replace(/^Especialidad:/i, ""));
        break;
      }
    }

    const one = parseBlock(lines, start, end, lastSpecialty);
    if (one) parsed.push(one);
  }

  const byCase = new Map();
  parsed.forEach((c) => {
    const key = normalize(c.case);
    if (!key) return;
    if (!byCase.has(key)) byCase.set(key, c);
    else {
      const prev = byCase.get(key);
      const prevScore = (prev.questions?.length || 0) + String(prev.case || "").length / 100;
      const nextScore = (c.questions?.length || 0) + String(c.case || "").length / 100;
      if (nextScore > prevScore) byCase.set(key, c);
    }
  });

  const deduped = Array.from(byCase.values());
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(deduped, null, 2), "utf8");

  const bySpec = { mi: 0, ped: 0, gyo: 0, cir: 0 };
  deduped.forEach((c) => { bySpec[c.specialty] = (bySpec[c.specialty] || 0) + 1; });

  console.log(JSON.stringify({
    sourceTemaMarkers: starts.length,
    parsedBeforeDedup: parsed.length,
    parsedAfterDedup: deduped.length,
    bySpec,
    output: OUTPUT_JSON
  }, null, 2));
}

main();
