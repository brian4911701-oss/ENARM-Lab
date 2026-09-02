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
    1,
    "index.html debe declarar exactamente un meta theme-color"
);

const themeMetaContent = themeMetaTags[0].match(/\bcontent=["']([^"']+)["']/i)?.[1];
assert.strictEqual(
    themeMetaContent?.toLowerCase(),
    DEFAULT_THEME_COLOR,
    "El meta theme-color inicial debe coincidir con el tema ocean predeterminado"
);

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
    /themeMeta\.setAttribute\(["']content["'],\s*color\)/,
    "app.js debe actualizar el meta theme-color cuando cambia el tema"
);
assert.doesNotMatch(
    appJs,
    /themeMeta\.cloneNode|themeMeta\.replaceWith/,
    "El meta theme-color debe mantenerse estable, sin reemplazar su nodo"
);

console.log("PWA theme-color contract: OK");
