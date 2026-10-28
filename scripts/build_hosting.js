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
    "dashboard-layout.css",
    "mobile-widgets.css",
    "mobile-widgets.js",
    "app.js",
    "question-picker.js",
    "progress-sync.js",
    "study-session.js",
    "account-session.js",
    "landing-gallery.js",
    "glass-surface.js",
    "rubber-segment.js",
    "streak-core.js",
    "analytics-core.js",
    "security-config.js",
    "withdrawal-public-key.js",
    "security-crypto.js",
    "questions.js",
    "scales-data.js",
    "manifest.json",
    "manifest-windows.json",
    "service-worker.js",
    "privacidad.html",
    "terminos.html",
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
    "icon-install-192.png",
    "icon-install-512.png",
    "apple-touch-icon-install.png",
    "icon-monochrome-192.png",
    "icon-monochrome-512.png",
    "Captura de pantalla 2026-04-06 144817.png",
    "WhatsApp Image 2026-07-13 at 1.02.10 PM.jpeg"
];

const directories = ["Flashcards", "avatars", "Capturas PC", "Capturas Movil"];

function build() {
    fs.rmSync(outputDir, { recursive: true, force: true });
    fs.mkdirSync(outputDir, { recursive: true });

    for (const relativePath of files) {
        const source = path.resolve(projectRoot, relativePath);
        if (!fs.existsSync(source)) throw new Error(`Falta un archivo público requerido: ${relativePath}`);
        const destination = path.resolve(outputDir, relativePath);
        fs.mkdirSync(path.dirname(destination), { recursive: true });
        fs.copyFileSync(source, destination);
    }

    for (const directory of directories) {
        fs.cpSync(path.resolve(projectRoot, directory), path.resolve(outputDir, directory), { recursive: true });
    }

    console.log(`Hosting listo en ${outputDir} (${files.length} archivos + Flashcards + avatares + capturas).`);
}

// Development serves these same source assets directly, without publishing the repository.
module.exports = { files, directories };
if (require.main === module) build();
