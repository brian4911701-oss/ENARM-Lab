"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { initializeAdmin, requireServiceAccountHint } = require("./security_admin_sdk");

const apply = process.argv.includes("--apply");
const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const prefixByType = { three_day: "ENARM-D3-", month: "ENARM-M1-", fixed: "ENARM-FX-" };
const outputPath = path.join(os.homedir(), ".enarmax-secrets", `replacement-codes-${new Date().toISOString().slice(0, 10)}.txt`);

function suffix() {
  let result = "";
  while (result.length < 26) {
    for (const byte of crypto.randomBytes(32)) {
      if (byte >= 256 - (256 % alphabet.length)) continue;
      result += alphabet[byte % alphabet.length];
      if (result.length === 26) break;
    }
  }
  return result;
}

async function main() {
  requireServiceAccountHint();
  const { admin, db, projectId } = initializeAdmin();
  const snapshot = await db.collection("redeem_codes").get();
  const compromised = snapshot.docs.filter((doc) => {
    const data = doc.data() || {};
    return !data.redeemedBy && doc.id.length < 30;
  });
  const preserved = snapshot.docs.filter((doc) => Boolean((doc.data() || {}).redeemedBy));
  const replacements = compromised.map((doc) => {
    const data = doc.data() || {};
    const type = prefixByType[data.type] ? data.type : (doc.id.startsWith("ENARM-D3-") ? "three_day" : doc.id.startsWith("ENARM-FX-") ? "fixed" : "month");
    return { oldRef: doc.ref, code: `${prefixByType[type]}${suffix()}`, type };
  });
  console.log(JSON.stringify({ projectId, mode: apply ? "apply" : "dry-run", total: snapshot.size, redeemedPreserved: preserved.length, unredeemedToDisable: compromised.length, replacements: replacements.length, outputPath: apply ? outputPath : "(no creado)" }, null, 2));
  if (!apply) {
    console.log("Simulación: no se modificó Firestore ni se generó un catálogo.");
    return;
  }
  const batch = db.batch();
  replacements.forEach(({ oldRef, code, type }) => {
    batch.update(oldRef, { disabled: true, disabledAt: admin.firestore.FieldValue.serverTimestamp(), disabledReason: "public_exposure_2026" });
    batch.create(db.collection("redeem_codes").doc(code), {
      type,
      redeemedBy: "",
      redeemedAt: null,
      disabled: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      rotationSource: "public_exposure_2026"
    });
  });
  await batch.commit();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true, mode: 0o700 });
  fs.writeFileSync(outputPath, replacements.map(({ code, type }) => `${type}\t${code}`).join("\n") + "\n", { encoding: "utf8", mode: 0o600, flag: "wx" });
  console.log(`Rotación aplicada. Catálogo privado: ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message || String(error));
  process.exitCode = 1;
});
