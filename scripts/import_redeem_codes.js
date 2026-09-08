"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { initializeAdmin, requireServiceAccountHint } = require("./security_admin_sdk");

const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : "";
};
const apply = args.includes("--apply");
const filePath = path.resolve(getArg("--file") || path.join(os.homedir(), ".enarmax-secrets", "redeem_codes.txt"));
const codePattern = /^ENARM-(D3|M1|FX)-[A-Z2-9]{26}$/;
const typeByMarker = { D3: "three_day", M1: "month", FX: "fixed" };

async function main() {
  requireServiceAccountHint();
  const { admin, db, projectId } = initializeAdmin();
  const rows = fs.readFileSync(filePath, "utf8").split(/\r?\n/).map((row) => row.trim().toUpperCase()).filter(Boolean);
  const codes = [...new Set(rows.map((row) => row.includes("\t") ? row.split("\t").pop() : row))];
  const invalid = codes.filter((code) => !codePattern.test(code));
  if (invalid.length) throw new Error(`Hay ${invalid.length} códigos inválidos; no se importó ninguno.`);
  const existing = await Promise.all(codes.map((code) => db.collection("redeem_codes").doc(code).get()));
  const duplicates = existing.filter((snapshot) => snapshot.exists).map((snapshot) => snapshot.id);
  console.log(JSON.stringify({ projectId, filePath, mode: apply ? "apply" : "dry-run", validCodes: codes.length, duplicates: duplicates.length }, null, 2));
  if (duplicates.length) throw new Error("El lote contiene códigos que ya existen; se cancela la operación completa.");
  if (!apply) {
    console.log("Simulación terminada. Añade --apply para crear los documentos.");
    return;
  }
  for (let offset = 0; offset < codes.length; offset += 400) {
    const batch = db.batch();
    codes.slice(offset, offset + 400).forEach((code) => {
      const marker = code.split("-")[1];
      batch.create(db.collection("redeem_codes").doc(code), {
        type: typeByMarker[marker], redeemedBy: "", redeemedAt: null, disabled: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    await batch.commit();
  }
  console.log(`Importados ${codes.length} códigos sin imprimir sus valores.`);
}

main().catch((error) => {
  console.error(error.message || String(error));
  process.exitCode = 1;
});
