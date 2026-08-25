/*
 * Publica el contenido de public/ mediante Firebase Hosting REST API.
 * Requiere ejecutar antes `npm run build:hosting` y configurar
 * GOOGLE_APPLICATION_CREDENTIALS.
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const admin = require("../functions/node_modules/firebase-admin");

const PROJECT_ID = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || "enarm-lab-social";
const SITE_ID = process.env.FIREBASE_HOSTING_SITE || PROJECT_ID;
const PUBLIC_DIR = path.resolve(__dirname, "..", "public");
const API_BASE = "https://firebasehosting.googleapis.com/v1beta1";

if (!admin.apps.length) {
    admin.initializeApp({ projectId: PROJECT_ID });
}

const listFiles = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
});

async function apiRequest(url, options, accessToken) {
    const response = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ...(options.body && !(options.body instanceof Uint8Array) ? { "Content-Type": "application/json" } : {}),
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
    if (!fs.existsSync(PUBLIC_DIR)) {
        throw new Error("No existe public/. Ejecuta npm run build:hosting antes de publicar.");
    }
    const credential = admin.credential.applicationDefault();
    const tokenResult = await credential.getAccessToken();
    const accessToken = tokenResult.access_token;
    const version = await apiRequest(
        `${API_BASE}/sites/${SITE_ID}/versions`,
        {
            method: "POST",
            body: JSON.stringify({
                config: {
                    headers: [{
                        glob: "/service-worker.js",
                        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }
                    }],
                    rewrites: [{ glob: "**", path: "/index.html" }]
                }
            })
        },
        accessToken
    );

    const files = {};
    const compressedByHash = new Map();
    for (const filePath of listFiles(PUBLIC_DIR)) {
        const relativePath = `/${path.relative(PUBLIC_DIR, filePath).split(path.sep).join("/")}`;
        const compressed = zlib.gzipSync(fs.readFileSync(filePath), { level: 9 });
        const hash = crypto.createHash("sha256").update(compressed).digest("hex");
        files[relativePath] = hash;
        compressedByHash.set(hash, compressed);
    }

    const populated = await apiRequest(
        `${API_BASE}/${version.name}:populateFiles`,
        { method: "POST", body: JSON.stringify({ files }) },
        accessToken
    );
    for (const hash of populated.uploadRequiredHashes || []) {
        const compressed = compressedByHash.get(hash);
        if (!compressed) throw new Error(`Firebase solicitó un hash desconocido: ${hash}`);
        await apiRequest(
            `${populated.uploadUrl}/${hash}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/octet-stream" },
                body: compressed
            },
            accessToken
        );
    }

    await apiRequest(
        `${API_BASE}/${version.name}?updateMask=status`,
        { method: "PATCH", body: JSON.stringify({ status: "FINALIZED" }) },
        accessToken
    );
    const release = await apiRequest(
        `${API_BASE}/sites/${SITE_ID}/releases?versionName=${encodeURIComponent(version.name)}`,
        {
            method: "POST",
            body: JSON.stringify({ message: "Directorio de usuarios paginado y sincronizado" })
        },
        accessToken
    );

    console.log("Hosting publicado.", {
        version: version.name,
        release: release.name,
        releaseTime: release.releaseTime,
        files: Object.keys(files).length,
        uploaded: (populated.uploadRequiredHashes || []).length,
        url: `https://${SITE_ID}.web.app/`
    });
}

main().catch((err) => {
    console.error("No se pudo publicar Hosting:", err && err.message ? err.message : err);
    process.exit(1);
});
