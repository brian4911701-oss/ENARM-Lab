const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.resolve(projectRoot, "public");

if (path.dirname(outputDir) !== projectRoot || path.basename(outputDir) !== "public") {
    throw new Error(`Directorio de salida no seguro: ${outputDir}`);
}

const files = [
    "index.html",
    "styles.css",
    "app.js",
    "questions.js",
    "scales-data.js",
    "manifest.json",
    "manifest-windows.json",
    "service-worker.js",
    "privacidad.html",
    "terminos.html",
    "redeem_codes.txt",
    "logo-e-mask.png",
    "pomquest-logo.png",
    "share-preview.png",
    "notification-icon.png",
    "notification-badge.png",
    "icon-192.png",
    "icon-512.png",
    "icon-liquid-192.png",
    "icon-liquid-512.png",
    "apple-touch-icon.png",
    "icon-monochrome-192.png",
    "icon-monochrome-512.png",
    "Captura de pantalla 2026-04-06 144817.png",
    "WhatsApp Image 2026-07-13 at 1.02.10 PM.jpeg"
];

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

for (const relativePath of files) {
    const source = path.resolve(projectRoot, relativePath);
    if (!fs.existsSync(source)) throw new Error(`Falta un archivo público requerido: ${relativePath}`);
    const destination = path.resolve(outputDir, relativePath);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
}

fs.cpSync(
    path.resolve(projectRoot, "Flashcards"),
    path.resolve(outputDir, "Flashcards"),
    { recursive: true }
);

console.log(`Hosting listo en ${outputDir} (${files.length} archivos + Flashcards).`);
