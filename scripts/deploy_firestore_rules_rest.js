/*
 * Publica firestore.rules directamente con Firebase Rules API.
 * Es útil cuando Firebase CLI no puede consultar Service Usage, pero la
 * credencial sí tiene permisos específicos para administrar reglas.
 *
 * Uso:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS='C:\ruta\service-account.json'
 *   node scripts/deploy_firestore_rules_rest.js
 */
const fs = require("fs");
const path = require("path");
const admin = require("../functions/node_modules/firebase-admin");

const PROJECT_ID = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || "enarm-lab-social";
const RULES_PATH = path.resolve(__dirname, "..", "firestore.rules");
const API_BASE = "https://firebaserules.googleapis.com/v1";

if (!admin.apps.length) {
    admin.initializeApp({ projectId: PROJECT_ID });
}

async function apiRequest(url, options, accessToken) {
    const response = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });
    const body = await response.text();
    let data = null;
    try {
        data = body ? JSON.parse(body) : null;
    } catch {
        data = body;
    }
    if (!response.ok) {
        const detail = data?.error?.message || body || response.statusText;
        throw new Error(`${response.status} ${detail}`);
    }
    return data;
}

async function main() {
    const content = fs.readFileSync(RULES_PATH, "utf8");
    const credential = admin.credential.applicationDefault();
    const tokenResult = await credential.getAccessToken();
    const accessToken = tokenResult.access_token;
    const ruleset = await apiRequest(
        `${API_BASE}/projects/${PROJECT_ID}/rulesets`,
        {
            method: "POST",
            body: JSON.stringify({
                source: {
                    files: [{ name: "firestore.rules", content }]
                }
            })
        },
        accessToken
    );

    const releaseName = `projects/${PROJECT_ID}/releases/cloud.firestore`;
    const release = await apiRequest(
        `${API_BASE}/${releaseName}`,
        {
            method: "PATCH",
            body: JSON.stringify({
                release: {
                    name: releaseName,
                    rulesetName: ruleset.name
                },
                updateMask: "rulesetName"
            })
        },
        accessToken
    );

    console.log("Reglas de Firestore publicadas.", {
        ruleset: ruleset.name,
        release: release.name,
        updateTime: release.updateTime
    });
}

main().catch((err) => {
    console.error("No se pudieron publicar las reglas:", err && err.message ? err.message : err);
    process.exit(1);
});
