"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const app = read("app.js");
const index = read("index.html");
const rules = read("firestore.rules");
const hosting = read("firebase.json");
const worker = read("service-worker.js");
const build = read("scripts/build_hosting.js");
const cryptoClient = read("security-crypto.js");
const publicKey = read("withdrawal-public-key.js");

assert.equal(fs.existsSync(path.join(root, "redeem_codes.txt")), false, "redeem_codes.txt no debe existir en la raíz");
assert(!build.includes('"redeem_codes.txt"'), "el build no debe publicar el catálogo de códigos");
const cacheVersion = worker.match(/const CACHE_NAME = 'enarmax-v(\d+)-/);
assert(cacheVersion && Number(cacheVersion[1]) >= 63, "el service worker debe conservar la rotación de caché de seguridad o una posterior");
assert(worker.includes("endsWith('/redeem_codes.txt')") && worker.includes("status: 404"), "el service worker debe bloquear la URL antigua");
assert(!hosting.includes('"rewrites"'), "el hosting estático no debe convertir archivos ausentes en index.html");

assert(rules.includes("request.auth.token.admin == true"), "admin debe provenir de una custom claim");
assert(!rules.includes("sZcIUjjhD0fze7FtirwsjsIDzLB2"), "las reglas no deben contener un UID administrador fijo");
assert(rules.includes("allow list: if false;"), "los códigos no se deben listar");
assert(rules.includes("[A-Z2-9]{26}"), "los códigos deben tener al menos 130 bits del alfabeto configurado");
assert(rules.includes("match /public_profiles/{uid}") && rules.includes("match /user_progress/{uid}"), "deben existir contratos público y privado separados");
assert(rules.includes("match /leaderboard/{uid}") && rules.includes("allow create, update: if false;"), "leaderboard debe estar en cuarentena");
assert(rules.includes("match /friendRequests/{requestId}") && rules.includes("match /challenges/{challengeId}"), "amistades y retos requieren reglas explícitas");
assert(rules.includes("match /reports/{reportId}") && rules.includes("match /user_push_tokens/{tokenId}"), "reportes y tokens requieren reglas explícitas");

const publicPayload = app.slice(app.indexOf("const publicProfile = {"), app.indexOf("const privateProgress = {"));
["phone", "university", "historyStr", "caseNotebookStr", "reportsStr", "email"].forEach((field) => {
  assert(!publicPayload.includes(field), `el perfil público no debe contener ${field}`);
});
assert(app.includes("USER_PROGRESS_COLLECTION"), "el progreso debe escribirse en su colección privada");
assert(app.includes("hasIndividualPremiumEntitlement()"), "Premium público debe derivarse de un entitlement individual");
assert(app.includes('window.FB.runTransaction(window.FB.db') && !app.includes('httpsCallable(window.FB.functions, "setAdminUserPremiumAccess")'), "el panel Premium debe funcionar en Spark sin depender de Cloud Functions");
assert(app.includes("requireVerifiedAccount"), "las operaciones sensibles deben exigir correo verificado");
assert(index.includes('minlength="12"'), "la interfaz debe exigir contraseñas de 12 caracteres");

assert(cryptoClient.includes('AES-GCM') && cryptoClient.includes('RSA-OAEP'), "retiros deben usar cifrado híbrido");
assert(app.includes("bankingEnvelope") && !app.includes("bankName: bankName"), "Firestore debe recibir un sobre cifrado, no campos bancarios planos");
assert(publicKey.includes("BEGIN PUBLIC KEY") && !publicKey.includes("BEGIN PRIVATE KEY"), "el sitio solo puede incluir la llave pública");
assert(!app.includes('localStorage.setItem("enarm_phone"'), "el teléfono no debe persistirse en localStorage");

assert(hosting.includes("X-Content-Type-Options") && hosting.includes("Permissions-Policy") && hosting.includes("Content-Security-Policy-Report-Only"), "deben configurarse encabezados defensivos y CSP de observación");
assert(index.includes("initializeAppCheck") && index.includes("appCheckSiteKey"), "la integración de App Check debe estar instalada");
assert(app.includes("btn-export-account") && app.includes("deleteCurrentAccount"), "deben existir exportación y eliminación de cuenta");

console.log("Security contract: OK");
