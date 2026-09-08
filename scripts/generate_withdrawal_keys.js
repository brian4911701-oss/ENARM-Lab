"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");

const args = process.argv.slice(2);
const force = args.includes("--force");
const repoRoot = path.resolve(__dirname, "..");
const publicPath = path.join(repoRoot, "withdrawal-public-key.js");
const privateDir = path.join(os.homedir(), ".enarmax-secrets");
const privatePath = path.join(privateDir, "withdrawal-private.pem");

function main() {
  if (!force && (fs.existsSync(publicPath) || fs.existsSync(privatePath))) {
    throw new Error("Ya existe una llave. Usa --force únicamente para una rotación planificada.");
  }
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 3072,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" }
  });
  const keyVersion = `withdrawals-${new Date().toISOString().slice(0, 10)}`;
  fs.mkdirSync(privateDir, { recursive: true, mode: 0o700 });
  fs.writeFileSync(privatePath, privateKey, { encoding: "utf8", mode: 0o600, flag: force ? "w" : "wx" });
  const publicModule = [
    "// Llave pública para cifrar retiros. La llave privada nunca pertenece al sitio.",
    `window.ENARM_WITHDRAWAL_KEY_VERSION = ${JSON.stringify(keyVersion)};`,
    `window.ENARM_WITHDRAWAL_PUBLIC_KEY_PEM = ${JSON.stringify(publicKey)};`,
    ""
  ].join("\n");
  fs.writeFileSync(publicPath, publicModule, "utf8");
  console.log(`Llave pública creada: ${publicPath}`);
  console.log(`Llave privada creada fuera del proyecto: ${privatePath}`);
  console.log("Respalda la llave privada en un gestor seguro; sin ella no se pueden procesar retiros.");
}

try { main(); } catch (error) {
  console.error(error.message || String(error));
  process.exitCode = 1;
}
