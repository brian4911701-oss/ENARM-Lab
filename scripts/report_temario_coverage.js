const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const APP_PATH = path.join(ROOT, "app.js");
const QUESTIONS_PATH = path.join(ROOT, "questions.js");

const GENERIC_ORIGINAL_LABELS = new Set([
    "ginecologia y obstetricia",
    "ginecologia y obstetricia eliminando ceros",
    "pediatria",
    "cirugia",
    "cirugia general",
    "medicina interna",
    "ginecologia",
    "cardiologia",
    "infectologia",
    "reumatologia",
    "neurologia",
    "dermatologia",
    "endocrinologia",
    "nefrologia",
    "hematologia",
    "psiquiatria",
    "geriatria",
    "toxicologia",
    "oftalmologia"
]);

const EXTRA_THEME_TERMS = {
    "amenorreas primarias y secundarias": [
        "Amenorrea",
        "Amenorrea primaria",
        "Amenorrea secundaria"
    ],
    "ciclo genital esterilidad y anticonceptivos": [
        "Anticoncepción",
        "Planificacion Familiar y Anticoncepcion",
        "Planificación Familiar y Anticoncepción",
        "Ciclo Genital y Anticoncepción",
        "Ciclo Genital"
    ],
    "patologia menopausia y climaterio": [
        "Climaterio",
        "Climaterio y Menopausia",
        "Menopausia y Climaterio"
    ],
    "patologia infecciosa cervical": [
        "Infecciones Ginecologicas",
        "Infecciones ginecológicas",
        "Vaginosis bacteriana",
        "Candidiasis vaginal"
    ],
    "patologia del embarazo": [
        "Diabetes Gestacional"
    ],
    "patologia del embarazo estados hipertensivos": [
        "Preeclampsia e Hipertension en el Embarazo",
        "Enfermedad Hipertensiva del Embarazo"
    ],
    "quemaduras golpe de calor e hipotermia": [
        "Quemaduras y Heridas"
    ],
    "intoxicaciones y picaduras": [
        "Toxíndromes",
        "Toxindromes"
    ]
};

const normalizeTextKey = (value) => {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

const sanitizeTopicLabel = (text) => {
    return String(text || "")
        .replace(/\[cite:\s*\d+\]/gi, "")
        .replace(/\s+/g, " ")
        .replace(/\s*[-:;,.]+\s*$/g, "")
        .trim();
};

const splitTopLevel = (value, separator) => {
    const parts = [];
    let current = "";
    let depth = 0;

    for (const char of String(value || "")) {
        if (char === "(") depth++;
        if (char === ")") depth = Math.max(0, depth - 1);
        if (char === separator && depth === 0) {
            if (current.trim()) parts.push(current.trim());
            current = "";
            continue;
        }
        current += char;
    }

    if (current.trim()) parts.push(current.trim());
    return parts;
};

const toCleanLabel = (value) => {
    return sanitizeTopicLabel(
        String(value || "")
            .replace(/\s*,\s*/g, ", ")
            .replace(/\s*;\s*/g, "; ")
            .replace(/\s*:\s*/g, ": ")
            .replace(/\s+/g, " ")
            .trim()
    );
};

const extractOuterParen = (value) => {
    const text = String(value || "").trim();
    const openIdx = text.indexOf("(");
    const closeIdx = text.lastIndexOf(")");

    if (openIdx === -1 || closeIdx === -1 || closeIdx <= openIdx) {
        return { name: toCleanLabel(text), inner: "" };
    }

    return {
        name: toCleanLabel(text.slice(0, openIdx)),
        inner: text.slice(openIdx + 1, closeIdx).trim()
    };
};

const parseContentList = (content) => {
    const nodes = [];
    const segments = splitTopLevel(content, ";");

    segments.forEach((segment) => {
        const colonIdx = segment.indexOf(":");
        if (colonIdx !== -1) {
            const prefixParts = splitTopLevel(segment.slice(0, colonIdx), ",")
                .map((item) => toCleanLabel(item))
                .filter(Boolean);
            const groupName = prefixParts[prefixParts.length - 1] || "";
            const groupChildren = splitTopLevel(segment.slice(colonIdx + 1), ",")
                .map((item) => ({ name: toCleanLabel(item), children: [] }))
                .filter((item) => item.name);

            prefixParts.slice(0, -1).forEach((item) => {
                nodes.push({ name: item, children: [] });
            });

            if (groupName) {
                nodes.push({ name: groupName, children: groupChildren });
            }
            return;
        }

        splitTopLevel(segment, ",")
            .map((item) => toCleanLabel(item))
            .filter(Boolean)
            .forEach((item) => nodes.push({ name: item, children: [] }));
    });

    return nodes;
};

const collectRecursiveNames = (node) => {
    const names = [];

    (node.children || []).forEach((child) => {
        if (!child || !child.name) return;
        names.push(child.name);
        names.push(...collectRecursiveNames(child));
    });

    return names;
};

const extractParagraphsFromDocx = (docxPath) => {
    const escapedPath = docxPath.replace(/'/g, "''");
    const psScript = `
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::UTF8
$doc = '${escapedPath}'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($doc)
$entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
$sr = New-Object System.IO.StreamReader($entry.Open())
[xml]$xml = $sr.ReadToEnd()
$sr.Close()
$zip.Dispose()
$ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$ns.AddNamespace('w','http://schemas.openxmlformats.org/wordprocessingml/2006/main')
$paras = $xml.SelectNodes('//w:body/w:p', $ns)
$out = @()
foreach ($p in $paras) {
    $texts = $p.SelectNodes('.//w:t', $ns) | ForEach-Object { $_.'#text' }
    $text = ($texts -join '')
    if ([string]::IsNullOrWhiteSpace($text)) { continue }
    $num = $p.SelectSingleNode('./w:pPr/w:numPr', $ns) -ne $null
    $out += [pscustomobject]@{
        numbered = $num
        text = $text.Trim()
    }
}
$out | ConvertTo-Json -Depth 5 -Compress
`.trim();

    const raw = execFileSync(
        "C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
        ["-NoProfile", "-Command", psScript],
        {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "pipe"]
        }
    );

    return JSON.parse(raw);
};

const parseTemario = (paragraphs) => {
    const specialties = [];
    let currentSpecialty = null;

    paragraphs.forEach(({ numbered, text }) => {
        const clean = toCleanLabel(text);
        if (!clean) return;

        if (!numbered) {
            currentSpecialty = { name: clean, themes: [] };
            specialties.push(currentSpecialty);
            return;
        }

        if (!currentSpecialty) {
            currentSpecialty = { name: "Sin Especialidad", themes: [] };
            specialties.push(currentSpecialty);
        }

        const { name, inner } = extractOuterParen(clean);
        const children = inner ? parseContentList(inner) : [];
        const subtopics = Array.from(new Set(collectRecursiveNames({ children })));

        currentSpecialty.themes.push({
            name,
            subtopics
        });
    });

    return specialties;
};

const extractLiteral = (source, marker, openChar, closeChar) => {
    const start = source.indexOf(marker);
    if (start === -1) {
        throw new Error(`No encontré el marcador ${marker}`);
    }

    let idx = source.indexOf(openChar, start);
    if (idx === -1) {
        throw new Error(`No encontré ${openChar} para ${marker}`);
    }

    let depth = 0;
    let inString = false;
    let quote = "";
    let escaped = false;

    for (let i = idx; i < source.length; i++) {
        const char = source[i];

        if (inString) {
            if (escaped) {
                escaped = false;
                continue;
            }
            if (char === "\\") {
                escaped = true;
                continue;
            }
            if (char === quote) {
                inString = false;
                quote = "";
            }
            continue;
        }

        if (char === '"' || char === "'" || char === "`") {
            inString = true;
            quote = char;
            continue;
        }

        if (char === openChar) depth++;
        else if (char === closeChar) {
            depth--;
            if (depth === 0) {
                return source.slice(idx, i + 1);
            }
        }
    }

    throw new Error(`No pude cerrar el literal de ${marker}`);
};

const loadTemarioMapping = () => {
    const appSource = fs.readFileSync(APP_PATH, "utf8");
    const literal = extractLiteral(appSource, "const TEMARIO_MAPPING =", "{", "}");
    return vm.runInNewContext(`(${literal})`);
};

const loadQuestions = () => {
    const raw = fs.readFileSync(QUESTIONS_PATH, "utf8");
    const startIdx = raw.indexOf("[");
    const endIdx = raw.lastIndexOf("]") + 1;
    return JSON.parse(raw.slice(startIdx, endIdx));
};

const loadTemarioParagraphs = (inputPath) => {
    const ext = path.extname(inputPath).toLowerCase();

    if (ext === ".json") {
        const raw = fs.readFileSync(inputPath, "utf8").replace(/^\uFEFF/, "");
        return JSON.parse(raw);
    }

    if (ext === ".docx") {
        try {
            return extractParagraphsFromDocx(inputPath);
        } catch (error) {
            if (error && error.code === "EPERM") {
                throw new Error(
                    "No se pudo leer el .docx directamente porque este entorno bloquea que Node ejecute PowerShell. Extrae primero los párrafos a un .json y vuelve a correr el script con ese archivo."
                );
            }
            throw error;
        }
    }

    throw new Error(`Formato no soportado: ${ext}. Usa .docx o .json.`);
};

const buildMappingIndex = (mapping) => {
    const index = new Map();

    Object.entries(mapping).forEach(([topic, aliases]) => {
        const allTerms = Array.from(new Set([topic, ...(Array.isArray(aliases) ? aliases : [])].map(toCleanLabel).filter(Boolean)));
        allTerms.forEach((term) => {
            const key = normalizeTextKey(term);
            if (!key) return;
            if (!index.has(key)) index.set(key, new Set());
            const bucket = index.get(key);
            allTerms.forEach((value) => bucket.add(value));
        });
    });

    return index;
};

const labelMatchesTerm = (labelKey, termKey) => {
    if (!labelKey || !termKey) return false;
    if (labelKey === termKey) return true;
    if (termKey.length >= 4 && labelKey.includes(termKey)) return true;
    return false;
};

const getInformativeOriginalLabelKeys = (question) => {
    return [question.temaOriginal, question.subtemaOriginal]
        .map((value) => sanitizeTopicLabel(value || ""))
        .filter(Boolean)
        .map((value) => normalizeTextKey(value))
        .filter((value) => value && !GENERIC_ORIGINAL_LABELS.has(value));
};

const getFallbackLabelKeys = (question) => {
    const values = [
        question.temaCanonical,
        question.tema,
        question.subtema,
        question.gpcReference
    ];

    return Array.from(
        new Set(
            values
                .map((value) => normalizeTextKey(sanitizeTopicLabel(value || "")))
                .filter(Boolean)
        )
    );
};

const getThemeTermKeys = (theme, mappingIndex) => {
    const label = theme.name;
    const extraTerms = EXTRA_THEME_TERMS[normalizeTextKey(label)] || [];
    const seedTerms = Array.from(new Set([label, ...theme.subtopics, ...extraTerms].map(toCleanLabel).filter(Boolean)));
    const expandedTerms = new Set(seedTerms);

    seedTerms.forEach((term) => {
        const key = normalizeTextKey(term);
        const aliases = mappingIndex.get(key);
        if (!aliases) return;
        aliases.forEach((alias) => expandedTerms.add(alias));
    });

    return Array.from(expandedTerms)
        .map((term) => normalizeTextKey(term))
        .filter(Boolean);
};

const buildThemeEntries = (specialties, mappingIndex) => {
    return specialties.map((specialty) => ({
        name: specialty.name,
        themes: specialty.themes.map((theme) => ({
            name: theme.name,
            subtopics: theme.subtopics,
            termKeys: getThemeTermKeys(theme, mappingIndex)
        }))
    }));
};

const countCoverage = (themeEntries, questions) => {
    return themeEntries.map((specialty) => ({
        name: specialty.name,
        themes: specialty.themes.map((theme) => {
            let count = 0;

            questions.forEach((question) => {
                const originalKeys = getInformativeOriginalLabelKeys(question);
                const keysToUse = originalKeys.length > 0 ? originalKeys : getFallbackLabelKeys(question);
                if (keysToUse.length === 0) return;

                if (theme.termKeys.some((termKey) => keysToUse.some((labelKey) => labelMatchesTerm(labelKey, termKey)))) {
                    count++;
                }
            });

            return {
                name: theme.name,
                subtopics: theme.subtopics,
                count
            };
        })
    }));
};

const buildSummary = (coverage) => {
    const allThemes = coverage.flatMap((specialty) => specialty.themes);
    const missing = coverage.map((specialty) => ({
        name: specialty.name,
        themes: specialty.themes.filter((theme) => theme.count === 0).sort((a, b) => a.name.localeCompare(b.name, "es"))
    })).filter((specialty) => specialty.themes.length > 0);

    const low = coverage.map((specialty) => ({
        name: specialty.name,
        themes: specialty.themes
            .filter((theme) => theme.count >= 1 && theme.count <= 2)
            .sort((a, b) => a.count - b.count || a.name.localeCompare(b.name, "es"))
    })).filter((specialty) => specialty.themes.length > 0);

    return {
        totalThemes: allThemes.length,
        missingCount: allThemes.filter((theme) => theme.count === 0).length,
        lowCount: allThemes.filter((theme) => theme.count >= 1 && theme.count <= 2).length,
        missing,
        low,
        coverage
    };
};

const toMarkdown = ({ totalCases, totalThemes, missingCount, lowCount, missing, low }) => {
    const lines = [];
    lines.push("# Cobertura de Casos Clínicos vs Temario Detallado");
    lines.push("");
    lines.push(`- Casos clínicos analizados: **${totalCases}**`);
    lines.push(`- Temas principales del temario: **${totalThemes}**`);
    lines.push(`- Temas sin caso clínico: **${missingCount}**`);
    lines.push(`- Temas con baja cobertura (1-2 casos): **${lowCount}**`);
    lines.push("");
    lines.push("## Temas Sin Caso Clínico");
    lines.push("");

    missing.forEach((specialty) => {
        lines.push(`### ${specialty.name}`);
        specialty.themes.forEach((theme) => {
            lines.push(`- ${theme.name}`);
        });
        lines.push("");
    });

    lines.push("## Temas Con Baja Cobertura (1-2 Casos)");
    lines.push("");

    low.forEach((specialty) => {
        lines.push(`### ${specialty.name}`);
        specialty.themes.forEach((theme) => {
            lines.push(`- ${theme.name}: ${theme.count} caso${theme.count === 1 ? "" : "s"}`);
        });
        lines.push("");
    });

    return lines.join("\n").trim();
};

const main = () => {
    const inputPath = process.argv[2];
    const formatArg = process.argv.find((arg) => arg.startsWith("--format="));
    const format = formatArg ? formatArg.split("=")[1] : "md";

    if (!inputPath) {
        console.error("Uso: node scripts/report_temario_coverage.js <ruta-al-temario.docx|json> [--format=md|json]");
        process.exit(1);
    }

    const resolvedDocxPath = path.resolve(inputPath);
    if (!fs.existsSync(resolvedDocxPath)) {
        console.error(`No encontré el archivo: ${resolvedDocxPath}`);
        process.exit(1);
    }

    const mapping = loadTemarioMapping();
    const mappingIndex = buildMappingIndex(mapping);
    const paragraphs = loadTemarioParagraphs(resolvedDocxPath);
    const specialties = parseTemario(paragraphs);
    const questions = loadQuestions();
    const themeEntries = buildThemeEntries(specialties, mappingIndex);
    const coverage = countCoverage(themeEntries, questions);
    const summary = buildSummary(coverage);

    const result = {
        totalCases: questions.length,
        ...summary
    };

    if (format === "json") {
        console.log(JSON.stringify(result, null, 2));
        return;
    }

    console.log(toMarkdown(result));
};

main();
