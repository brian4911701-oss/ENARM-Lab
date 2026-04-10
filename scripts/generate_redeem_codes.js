const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const REPO_ROOT = path.resolve(__dirname, "..");
const DEFAULT_CODES_FILE = path.join(REPO_ROOT, "redeem_codes.txt");
const CODE_BODY_LENGTH = 8;
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const TYPE_CONFIG = [
  { key: "month", args: ["month"], prefix: "ENARM-M1-" },
  { key: "three_day", args: ["three-day", "three_day"], prefix: "ENARM-D3-" },
  { key: "fixed", args: ["fixed"], prefix: "ENARM-FX-" }
];

function printUsage() {
  console.log("Uso:");
  console.log("  npm run codes:generate -- --month 10 --three-day 5 --append");
  console.log("");
  console.log("Opciones:");
  console.log("  --month N        Genera N codigos de 1 mes");
  console.log("  --three-day N    Genera N codigos de 3 dias");
  console.log("  --fixed N        Genera N codigos con expiracion fija");
  console.log("  --append         Agrega los codigos a redeem_codes.txt");
  console.log("  --file RUTA      Usa otro archivo de catalogo");
  console.log("  --help           Muestra esta ayuda");
}

function parseArgs(argv) {
  const counts = {
    month: 0,
    three_day: 0,
    fixed: 0
  };
  const options = {
    append: false,
    file: DEFAULT_CODES_FILE,
    help: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--append") {
      options.append = true;
      continue;
    }
    if (token === "--help" || token === "-h") {
      options.help = true;
      continue;
    }
    if (token === "--file") {
      const next = argv[i + 1];
      if (!next) throw new Error("Debes indicar una ruta despues de --file.");
      options.file = path.resolve(process.cwd(), next);
      i += 1;
      continue;
    }
    if (!token.startsWith("--")) {
      throw new Error(`Argumento no reconocido: ${token}`);
    }

    const argName = token.slice(2);
    const config = TYPE_CONFIG.find((entry) => entry.args.includes(argName));
    if (!config) {
      throw new Error(`Opcion no reconocida: ${token}`);
    }

    const next = argv[i + 1];
    if (!next) throw new Error(`Debes indicar una cantidad para ${token}.`);
    const count = Number.parseInt(next, 10);
    if (!Number.isFinite(count) || count < 0) {
      throw new Error(`Cantidad invalida para ${token}: ${next}`);
    }
    counts[config.key] = count;
    i += 1;
  }

  return { counts, options };
}

function loadExistingCodes(filePath) {
  if (!fs.existsSync(filePath)) return new Set();
  const text = fs.readFileSync(filePath, "utf8");
  return new Set(
    text
      .split(/\r?\n/)
      .map((line) => line.trim().toUpperCase())
      .filter(Boolean)
  );
}

function randomSuffix(length) {
  let output = "";
  while (output.length < length) {
    const bytes = crypto.randomBytes(length);
    for (const byte of bytes) {
      output += ALPHABET[byte % ALPHABET.length];
      if (output.length === length) break;
    }
  }
  return output;
}

function generateCodes(prefix, count, existingCodes) {
  const created = [];
  while (created.length < count) {
    const code = `${prefix}${randomSuffix(CODE_BODY_LENGTH)}`;
    if (existingCodes.has(code)) continue;
    existingCodes.add(code);
    created.push(code);
  }
  return created;
}

function appendCodesToFile(filePath, codes) {
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8").trim() : "";
  const nextText = current ? `${current}\n${codes.join("\n")}\n` : `${codes.join("\n")}\n`;
  fs.writeFileSync(filePath, nextText, "utf8");
}

function main() {
  const { counts, options } = parseArgs(process.argv.slice(2));
  if (options.help) {
    printUsage();
    return;
  }

  const totalRequested = counts.month + counts.three_day + counts.fixed;
  if (totalRequested === 0) {
    printUsage();
    throw new Error("Debes pedir al menos un lote de codigos.");
  }

  const existingCodes = loadExistingCodes(options.file);
  const generatedByType = [];

  TYPE_CONFIG.forEach((config) => {
    const count = counts[config.key];
    if (!count) return;
    generatedByType.push({
      key: config.key,
      prefix: config.prefix,
      codes: generateCodes(config.prefix, count, existingCodes)
    });
  });

  const allCodes = generatedByType.flatMap((entry) => entry.codes);
  if (options.append) {
    appendCodesToFile(options.file, allCodes);
  }

  console.log(`Generados ${allCodes.length} codigos.`);
  generatedByType.forEach((entry) => {
    console.log("");
    console.log(`[${entry.prefix}] ${entry.codes.length} codigos`);
    entry.codes.forEach((code) => console.log(code));
  });

  console.log("");
  if (options.append) {
    console.log(`Se agregaron a ${options.file}`);
  } else {
    console.log("Vista previa solamente. Usa --append para guardarlos en el archivo.");
  }
  console.log("Despues, pegalos en el panel Admin - Cargar Codigos y presiona Subir codigos.");
}

try {
  main();
} catch (error) {
  console.error(error.message || String(error));
  process.exit(1);
}
