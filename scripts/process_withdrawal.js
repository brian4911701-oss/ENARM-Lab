"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { initializeAdmin, requireServiceAccountHint } = require("./security_admin_sdk");

const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : "";
};
const requestId = String(getArg("--id") || "").trim();
const markPaid = args.includes("--mark-paid");
const privatePath = path.resolve(getArg("--private-key") || path.join(os.homedir(), ".enarmax-secrets", "withdrawal-private.pem"));

const fromBase64Url = (value) => Buffer.from(String(value).replace(/-/g, "+").replace(/_/g, "/"), "base64");

function decryptEnvelope(envelope) {
  if (!envelope || envelope.version !== 1 || envelope.algorithm !== "RSA-OAEP-256+A256GCM") {
    throw new Error("Formato de sobre bancario no soportado.");
  }
  const privateKey = fs.readFileSync(privatePath, "utf8");
  const aesKey = crypto.privateDecrypt({ key: privateKey, oaepHash: "sha256" }, fromBase64Url(envelope.wrappedKey));
  const packed = fromBase64Url(envelope.ciphertext);
  if (packed.length < 17) throw new Error("Ciphertext inválido.");
  const authTag = packed.subarray(packed.length - 16);
  const encrypted = packed.subarray(0, packed.length - 16);
  const decipher = crypto.createDecipheriv("aes-256-gcm", aesKey, fromBase64Url(envelope.iv));
  decipher.setAuthTag(authTag);
  return JSON.parse(Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8"));
}

async function main() {
  if (!requestId) throw new Error("Uso: node scripts/process_withdrawal.js --id ID [--mark-paid]");
  requireServiceAccountHint();
  const { admin, db } = initializeAdmin();
  const requestRef = db.collection("withdrawal_requests").doc(requestId);
  const requestSnap = await requestRef.get();
  if (!requestSnap.exists) throw new Error("Solicitud no encontrada.");
  const request = requestSnap.data() || {};
  const banking = decryptEnvelope(request.bankingEnvelope);
  console.log(JSON.stringify({ id: requestId, uid: request.uid, amount: request.amount, currency: request.currency, status: request.status, banking }, null, 2));
  if (!markPaid) {
    console.log("Solo lectura. Añade --mark-paid después de comprobar la transferencia.");
    return;
  }
  await db.runTransaction(async (tx) => {
    const fresh = await tx.get(requestRef);
    const data = fresh.data() || {};
    if (data.status !== "pending") throw new Error(`Estado no procesable: ${data.status || "sin estado"}`);
    const walletRef = db.collection("user_wallets").doc(data.uid);
    const walletSnap = await tx.get(walletRef);
    const wallet = walletSnap.data() || {};
    const amount = Number(data.amount);
    if (!Number.isInteger(amount) || amount < 100 || Number(wallet.coins) < amount) throw new Error("Saldo insuficiente o monto inválido.");
    tx.update(walletRef, { coins: Number(wallet.coins) - amount, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    tx.update(requestRef, { status: "paid", paidAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  });
  console.log("Solicitud marcada como pagada y saldo descontado atómicamente.");
}

main().catch((error) => {
  console.error(error.message || String(error));
  process.exitCode = 1;
});
