const fs = require("fs");
const path = require("path");
const { runBlock } = require("./run_block_cleanup");

const ROOT = path.join(__dirname, "..");
const REPORT_DIR = path.join(ROOT, "reports");
const BLOCKS = ["ped", "gyo", "cir", "mi"];

function getArg(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return "";
  return process.argv[idx + 1] || "";
}

function readQuestions() {
  const raw = fs.readFileSync(path.join(ROOT, "questions.js"), "utf8");
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]") + 1;
  return JSON.parse(raw.slice(start, end));
}

function verifySnapshot() {
  const questions = readQuestions();
  const troncal = new Set(["mi", "ped", "gyo", "cir"]);
  let outOfTroncal = 0;
  let missingTemaCanonical = 0;
  const bySpec = {};
  const seenCase = new Set();
  let duplicateCaseCount = 0;

  for (const q of questions) {
    const spec = String(q.specialty || "").trim();
    bySpec[spec] = (bySpec[spec] || 0) + 1;
    if (!troncal.has(spec)) outOfTroncal++;
    if (!String(q.temaCanonical || "").trim()) missingTemaCanonical++;

    const caseKey = String(q.case || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (caseKey) {
      if (seenCase.has(caseKey)) duplicateCaseCount++;
      else seenCase.add(caseKey);
    }
  }

  return {
    total: questions.length,
    bySpec,
    checks: {
      outOfTroncal,
      missingTemaCanonical,
      duplicateCaseCount
    }
  };
}

function ensureReportDir() {
  if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });
}

function main() {
  const fromBlock = String(getArg("--from") || "ped").trim().toLowerCase();
  const dryRun = process.argv.includes("--dry");
  const fromIdx = BLOCKS.indexOf(fromBlock);
  if (fromIdx === -1) throw new Error("Bloque inicial invalido. Usa --from ped|gyo|cir|mi");

  const startedAt = new Date().toISOString();
  const blocksToRun = BLOCKS.slice(fromIdx);
  const results = [];

  for (const block of blocksToRun) {
    const run = runBlock({ block, dryRun });
    const verify = verifySnapshot();
    results.push({ block, run, verify });
  }

  const endedAt = new Date().toISOString();
  const summary = {
    startedAt,
    endedAt,
    dryRun,
    fromBlock,
    blocksExecuted: blocksToRun,
    results
  };

  const suffix = dryRun ? "_dry" : "";
  const reportJson = path.join(REPORT_DIR, `phase1_blocks_summary${suffix}.json`);
  const reportMd = path.join(REPORT_DIR, `phase1_blocks_summary${suffix}.md`);

  const md = [
    "# Phase 1 Blocks Summary",
    "",
    `- Started: ${startedAt}`,
    `- Ended: ${endedAt}`,
    `- Dry run: ${dryRun ? "yes" : "no"}`,
    `- From block: ${fromBlock}`,
    "",
    "## Block results"
  ];

  for (const item of results) {
    md.push(`### ${item.block.toUpperCase()}`);
    md.push(`- Moved to block: ${item.run.totals.movedToBlock}`);
    md.push(`- Topic reassigned: ${item.run.totals.topicReassigned}`);
    md.push(`- Review queue: ${item.run.totals.reviewQueue}`);
    md.push(`- outOfTroncal: ${item.verify.checks.outOfTroncal}`);
    md.push(`- missingTemaCanonical: ${item.verify.checks.missingTemaCanonical}`);
    md.push(`- duplicateCaseCount: ${item.verify.checks.duplicateCaseCount}`);
    md.push("");
  }

  ensureReportDir();
  fs.writeFileSync(reportJson, JSON.stringify(summary, null, 2), "utf8");
  fs.writeFileSync(reportMd, md.join("\n"), "utf8");

  console.log(JSON.stringify({
    dryRun,
    blocksExecuted: blocksToRun,
    reportJson,
    reportMd
  }, null, 2));
}

main();
