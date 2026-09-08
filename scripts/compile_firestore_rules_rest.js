"use strict";

// Compila firestore.rules creando un ruleset inerte. No cambia la release activa.
const fs = require("fs");
const path = require("path");
const { initializeAdmin, requireServiceAccountHint } = require("./security_admin_sdk");

async function main() {
  requireServiceAccountHint();
  const { admin, projectId } = initializeAdmin();
  const content = fs.readFileSync(path.resolve(__dirname, "..", "firestore.rules"), "utf8");
  const credential = admin.credential.applicationDefault();
  const token = await credential.getAccessToken();
  const response = await fetch(`https://firebaserules.googleapis.com/v1/projects/${projectId}/rulesets`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ source: { files: [{ name: "firestore.rules", content }] } })
  });
  const text = await response.text();
  let body;
  try { body = JSON.parse(text); } catch (_error) { body = text; }
  if (!response.ok) throw new Error(typeof body === "string" ? body : JSON.stringify(body, null, 2));
  console.log(JSON.stringify({ compiled: true, ruleset: body.name, createTime: body.createTime, releaseChanged: false }, null, 2));
}

main().catch((error) => {
  console.error("Compilación de reglas fallida:", error.message || String(error));
  process.exitCode = 1;
});
