"use strict";

const { initializeAdmin, requireServiceAccountHint } = require("./security_admin_sdk");

const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : "";
};
const uid = String(getArg("--uid") || "").trim();
const apply = args.includes("--apply");

async function main() {
  if (!uid) throw new Error("Uso: node scripts/set_admin_claim.js --uid UID [--apply]");
  requireServiceAccountHint();
  const { auth } = initializeAdmin();
  const user = await auth.getUser(uid);
  const currentClaims = user.customClaims || {};
  console.log(JSON.stringify({ uid, email: user.email || "", currentClaims, apply }, null, 2));
  if (!apply) {
    console.log("Simulación: no se cambió ninguna claim. Añade --apply para confirmar.");
    return;
  }
  await auth.setCustomUserClaims(uid, { ...currentClaims, admin: true });
  await auth.revokeRefreshTokens(uid);
  console.log("Claim admin=true aplicada. El usuario debe volver a iniciar sesión.");
}

main().catch((error) => {
  console.error(error.message || String(error));
  process.exitCode = 1;
});
