const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const DEFAULT_APP_PATH = path.join(__dirname, "app.js");
const STOPWORDS = new Set(["de", "del", "la", "las", "el", "los", "y", "e", "en", "con", "sin", "por", "para", "al", "a"]);

const EXTRA_ALIAS_MAP = {
    "quinta enfermedad": ["5ta enfermedad"],
    "sexta enfermedad": ["6ta enfermedad"],
    "rotura uterina": ["r. uterina"],
    "enfermedad de membrana hialina": ["EMH"],
    "taquipnea transitoria del recien nacido": ["TTRN"],
    "sindrome de aspiracion de meconio": ["SAM"],
    "encefalopatia hipoxico isquemica": ["EHI"],
    "ruptura prematura de membranas": ["RPM"],
    "infeccion de vias urinarias": ["IVU", "IVUs", "Infección de vías urinarias bajas y altas"],
    "enfermedad pelvica inflamatoria": ["EPI"],
    "trauma craneoencefalico": ["TCE"],
    "tipos de heridas quirurgicas": ["Tipo de heridas OX"],
    "hernia y esplenectomia": ["Hernias / Esplenectomía"],
    "hernias y esplenectomia": ["Hernias / Esplenectomía"],
    "cirrosis y sus complicaciones": ["Cirrosis y sus Complicaciones / Trasplante Hepático"],
    "introduccion e infectologia": ["Introducción MI / Introducción Infectología"],
    "cirugia oncologica": ["Cirugía Oncología"],
    "patologia intestinal quirurgica": ["Patología Intestinal Qx"],
    "patologia gastrointestinal pediatrica": ["Patología Gastrointestinal del Pediátrico"],
    "especialidades pediatricas": ["Especialidades Pedia"],
    "iras y convulsiones": ["IRAs / Convulsiones"],
    "toxsindromes": ["Toxíndromes"],
    "toxsindromes intoxicaciones y picaduras": ["Toxíndromes"],
    "otitis media aguda": ["OMA"],
    "enfermedad de meniere": ["Sx de Meniere"],
    "trastornos del ritmo": ["Trastornos del Ritmo"],
    "sindrome nefritico": ["Sx nefrítico"],
    "sindrome nefrotico": ["Sx nefrótico"],
    "sindromes y escalas geriatricas": ["Sx geriátricos", "Escalas geriátricas"],
    "cancer basocelular y espinocelular": ["CA basocelular", "CA espinocelular", "Cáncer basocelular", "Cáncer espinocelular"],
    "linfoma hodgkin y no hodgkin": ["Linfoma Hodgkin", "Linfoma No Hodgkin"],
    "insuficiencia cardiaca": ["Insuficiencia Cardíaca Aguda y Crónica"],
    "patologia menopausia y climaterio": ["Patología Menopausia y Climaterio"],
    "entamoebahistolytica": ["Entamoeba histolytica", "E. histolytica"],
    "bisinois": ["Bisinosis"],
    "choque septico": ["Choque séptico"],
    "cancer cervicouterino": ["CACU"],
    "prevencion y tamizaje de cacu": ["CACU", "Prevención y tamizaje de CACU"],
    "neumonias ocupacionales": ["Neumonías Ocupacionales / Derrame Pleural"],
    "derrame pleural": ["Neumonías Ocupacionales / Derrame Pleural"]
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

const buildAcronym = (value) => {
    const tokens = normalizeTextKey(value)
        .split(" ")
        .filter(token => token && !STOPWORDS.has(token));
    if (tokens.length < 2 || tokens.length > 6) return "";
    const acronym = tokens.map(token => token[0]).join("");
    return acronym.length >= 2 && acronym.length <= 8 ? acronym.toUpperCase() : "";
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

    segments.forEach(segment => {
        const colonIdx = segment.indexOf(":");
        if (colonIdx !== -1) {
            const prefixParts = splitTopLevel(segment.slice(0, colonIdx), ",")
                .map(item => toCleanLabel(item))
                .filter(Boolean);
            const groupName = prefixParts[prefixParts.length - 1] || "";
            const groupChildren = splitTopLevel(segment.slice(colonIdx + 1), ",")
                .map(item => ({ name: toCleanLabel(item), children: [] }))
                .filter(item => item.name);

            prefixParts.slice(0, -1).forEach(item => {
                nodes.push({ name: item, children: [] });
            });

            if (groupName) {
                nodes.push({ name: groupName, children: groupChildren });
            }
            return;
        }

        splitTopLevel(segment, ",")
            .map(item => toCleanLabel(item))
            .filter(Boolean)
            .forEach(item => nodes.push({ name: item, children: [] }));
    });

    return nodes;
};

const parseParagraphs = (paragraphs) => {
    const roots = [];

    paragraphs.forEach(({ numbered, text }) => {
        const clean = toCleanLabel(text);
        if (!clean) return;

        if (!numbered) {
            roots.push({ name: clean, children: [], kind: "specialty" });
            return;
        }

        const { name, inner } = extractOuterParen(clean);
        roots.push({
            name,
            children: inner ? parseContentList(inner) : [],
            kind: "topic"
        });
    });

    return roots;
};

const collectRecursiveNames = (node) => {
    const names = [];

    node.children.forEach(child => {
        if (!child || !child.name) return;
        names.push(child.name);
        names.push(...collectRecursiveNames(child));
    });

    return names;
};

const addAlias = (bucket, value) => {
    const clean = toCleanLabel(value);
    if (!clean) return;

    bucket.add(clean);

    const normalized = normalizeTextKey(clean);
    const extras = EXTRA_ALIAS_MAP[normalized] || [];
    extras.forEach(extra => {
        const extraClean = toCleanLabel(extra);
        if (extraClean) bucket.add(extraClean);
    });

    const acronym = buildAcronym(clean);
    if (acronym) bucket.add(acronym);
};

const buildMappingEntries = (roots) => {
    const official = [];
    const mapping = {};
    const seen = new Set();

    const visit = (node, parent = null) => {
        if (!node || !node.name) return;

        const display = parent ? `${node.name} (${parent.name})` : node.name;
        if (!seen.has(display)) {
            seen.add(display);
            official.push(display);

            const aliasSet = new Set();
            addAlias(aliasSet, node.name);
            addAlias(aliasSet, display);
            collectRecursiveNames(node).forEach(name => addAlias(aliasSet, name));

            mapping[display] = Array.from(aliasSet).sort((a, b) => a.localeCompare(b, "es"));
        }

        node.children.forEach(child => visit(child, node));
    };

    roots.forEach(root => visit(root, null));

    official.sort((a, b) => a.localeCompare(b, "es"));
    const sortedMapping = {};
    official.forEach(topic => {
        sortedMapping[topic] = mapping[topic];
    });

    return { official, mapping: sortedMapping };
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
$out | ConvertTo-Json -Depth 4 -Compress
`.trim();

    const raw = execFileSync("C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe", ["-NoProfile", "-Command", psScript], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"]
    });

    return JSON.parse(raw);
};

const loadParagraphs = (inputPath) => {
    const resolved = path.resolve(inputPath);
    const ext = path.extname(resolved).toLowerCase();

    if (ext === ".json") {
        const raw = fs.readFileSync(resolved, "utf8").replace(/^\uFEFF/, "");
        return JSON.parse(raw);
    }

    if (ext === ".docx") {
        try {
            return extractParagraphsFromDocx(resolved);
        } catch (error) {
            if (error && error.code === "EPERM") {
                throw new Error("No se pudo leer el .docx directamente porque este entorno bloquea que Node ejecute PowerShell. Como alternativa, extrae primero los párrafos a un .json y corre de nuevo el script con ese archivo.");
            }
            throw error;
        }
    }

    throw new Error(`Formato no soportado: ${ext}. Usa .docx o .json`);
};

const replaceSection = (content, startTag, openBracket, replacement) => {
    const startIdx = content.indexOf(startTag);
    if (startIdx === -1) throw new Error(`No encontré la sección ${startTag}`);

    let depth = 0;
    let endIdx = -1;
    const closeBracket = openBracket === "[" ? "]" : "}";

    for (let i = startIdx; i < content.length; i++) {
        if (content[i] === openBracket) depth++;
        if (content[i] === closeBracket) {
            depth--;
            if (depth === 0) {
                endIdx = i + 1;
                while (endIdx < content.length && [";", " ", "\n", "\r"].includes(content[endIdx])) {
                    if (content[endIdx] === ";") {
                        endIdx++;
                        break;
                    }
                    endIdx++;
                }
                break;
            }
        }
    }

    if (endIdx === -1) throw new Error(`No pude cerrar la sección ${startTag}`);
    return content.slice(0, startIdx) + replacement + content.slice(endIdx);
};

const updateAppFile = ({ official, mapping, appPath }) => {
    const officialJS = JSON.stringify(official, null, 8).replace(/\]$/, "    ]");
    const mappingJS = JSON.stringify(mapping, null, 8).replace(/\}$/, "    }");

    const officialBlock = `    const OFFICIAL_TEMARIO = ${officialJS};`;
    const mappingBlock = `    const TEMARIO_MAPPING = ${mappingJS};`;

    let appContent = fs.readFileSync(appPath, "utf8");
    appContent = replaceSection(appContent, "    const OFFICIAL_TEMARIO = [", "[", officialBlock);
    appContent = replaceSection(appContent, "    const TEMARIO_MAPPING = {", "{", mappingBlock);
    fs.writeFileSync(appPath, appContent, "utf8");
};

const main = () => {
    const sourcePath = process.argv[2];
    if (!sourcePath) {
        console.error("Uso: node generate_temario_data.js <ruta-al-temario.docx|json>");
        process.exit(1);
    }

    if (!fs.existsSync(sourcePath)) {
        console.error(`No encontré el archivo: ${sourcePath}`);
        process.exit(1);
    }

    const paragraphs = loadParagraphs(sourcePath);
    const roots = parseParagraphs(paragraphs);
    const { official, mapping } = buildMappingEntries(roots);

    updateAppFile({
        official,
        mapping,
        appPath: DEFAULT_APP_PATH
    });

    console.log(`Temario actualizado. Temas cargados: ${official.length}`);
};

main();
