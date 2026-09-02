const assert = require("assert");
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const DEFAULT_THEME_COLOR = "#1d258d";
const DEFAULT_BACKGROUND_COLOR = "#191f78";

const readProjectFile = (relativePath) => fs.readFileSync(
    path.resolve(projectRoot, relativePath),
    "utf8"
);

const indexHtml = readProjectFile("index.html");
const appJs = readProjectFile("app.js");
const themeMetaTags = indexHtml.match(/<meta\b[^>]*\bname=["']theme-color["'][^>]*>/gi) || [];

assert.strictEqual(
    themeMetaTags.length,
    2,
    "index.html debe declarar los dos meta theme-color que se alternan en Android"
);

for (const themeMetaTag of themeMetaTags) {
    const themeMetaContent = themeMetaTag.match(/\bcontent=["']([^"']+)["']/i)?.[1];
    assert.strictEqual(
        themeMetaContent?.toLowerCase(),
        DEFAULT_THEME_COLOR,
        "Cada meta theme-color inicial debe coincidir con el tema ocean predeterminado"
    );
}

assert.match(indexHtml, /id=["']app-theme-color["'][^>]*media=["']all["']/i);
assert.match(indexHtml, /id=["']app-theme-color-buffer["'][^>]*media=["']not all["']/i);

assert.match(
    indexHtml,
    /<meta\b[^>]*\bname=["']viewport["'][^>]*\bcontent=["'][^"']*viewport-fit=cover[^"']*["'][^>]*>/i,
    "El viewport debe conservar viewport-fit=cover para el safe area de Android"
);

for (const manifestName of ["manifest.json", "manifest-windows.json"]) {
    const manifest = JSON.parse(readProjectFile(manifestName));
    assert.match(
        manifest.theme_color || "",
        /^#[0-9a-f]{6}$/i,
        `${manifestName} debe declarar un theme_color hexadecimal opaco`
    );
    assert.strictEqual(
        manifest.theme_color.toLowerCase(),
        DEFAULT_THEME_COLOR,
        `${manifestName} debe usar el color del tema ocean predeterminado`
    );
    assert.strictEqual(
        String(manifest.background_color || "").toLowerCase(),
        DEFAULT_BACKGROUND_COLOR,
        `${manifestName} debe usar el fondo del tema ocean predeterminado`
    );
}

assert.match(
    appJs,
    /activeThemeMeta\.setAttribute\(["']media["'],\s*["']not all["']\)/,
    "app.js debe desactivar el meta actual al cambiar el tema"
);
assert.match(
    appJs,
    /nextThemeMeta\.setAttribute\(["']media["'],\s*["']all["']\)/,
    "app.js debe activar el meta con el nuevo color"
);

console.log("PWA theme-color contract: OK");
