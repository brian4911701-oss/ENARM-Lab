const fs = require('fs');

const rawText = fs.readFileSync('D:\\ENARM Lab\\temario_out.txt', 'utf8');
const cleanText = rawText.replace(/-+Page \(\d+\) Break-+/g, '');

const parts = cleanText.split('•');

const TEMARIO_MAP_ACCUMULATOR = {};
let currentSpecialty = "Ginecología y Obstetricia";

const synonyms = {
    "Sx": "Síndrome", "CA": "Cáncer", "SOP": "Síndrome de Ovario Poliquístico",
    "IVU": "Infección de Vías Urinarias", "IVUs": "Infecciones de Vías Urinarias",
    "EVC": "Enfermedad Vascular Cerebral", "RN": "Recién Nacido",
    "RPM": "Ruptura Prematura de Membranas", "DPPNI": "Desprendimiento de Placenta",
    "CACU": "Cáncer Cervicouterino", "STDA": "Sangrado de Tubo Digestivo Alto",
    "TCE": "Trauma Craneoencefálico", "TF": "Tetralogía de Fallot",
    "DM": "Diabetes Mellitus", "DM1": "Diabetes Mellitus", "DM2": "Diabetes Mellitus",
    "Hipoacusia": "Sordera", "IRA": "Infección Respiratoria", "IRAs": "Infecciones Respiratorias",
    "EPI": "Enfermedad pélvica inflamatoria",
    "Vaginosis": "Cervicovaginitis",
    "Preeclampsia": "Hipertensión",
    "Eclampsia": "Hipertensión",
    "Hemorragia": "Sangrado",
    "Atonía": "Hemorragia",
    "Oma": "Otitis",
    "Ea": "Otitis"
};

function normalizeName(name) {
    if (!name) return "";
    let clean = name.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
    clean = clean.replace(/\s+P[1-3](\s|$)/g, ' ').trim();
    return clean;
}

function getAliases(name) {
    let aliases = [name];
    let parts = name.split(/\s+y\s+|\s*\,\s*/i);
    if (parts.length > 1) {
        parts.forEach(p => {
            let cp = p.trim();
            if (cp.length > 3) aliases.push(cp);
        });
    }

    let synonymAliases = [];
    aliases.forEach(a => {
        for (const [key, val] of Object.entries(synonyms)) {
            if (a.toLowerCase().includes(key.toLowerCase())) {
                synonymAliases.push(a.toLowerCase().replace(key.toLowerCase(), val.toLowerCase()));
            }
            if (a.toLowerCase().includes(val.toLowerCase())) {
                synonymAliases.push(a.toLowerCase().replace(val.toLowerCase(), key.toLowerCase()));
            }
        }
    });

    return [...new Set([...aliases, ...synonymAliases])];
}

parts.forEach((part) => {
    let trimmed = part.trim();
    if (!trimmed) return;

    const numberMatch = trimmed.match(/^(\d+)\.\s+/);

    if (numberMatch) {
        let firstParen = trimmed.indexOf('(');
        let lastParen = trimmed.lastIndexOf(')');
        let topicName = "", subPart = "", trailing = "";

        if (firstParen !== -1 && lastParen !== -1 && firstParen < lastParen) {
            topicName = trimmed.substring(numberMatch[0].length, firstParen).trim();
            subPart = trimmed.substring(firstParen + 1, lastParen).trim();
            trailing = trimmed.substring(lastParen + 1).trim();
        } else {
            topicName = trimmed.substring(numberMatch[0].length).trim();
            let lines = topicName.split('\n');
            if (lines.length > 1) {
                topicName = lines[0].trim();
                trailing = lines.slice(1).join('\n').trim();
            }
        }

        topicName = normalizeName(topicName);
        if (!topicName) return;

        if (currentSpecialty.toLowerCase().includes("psiquiatr") && (topicName.toLowerCase().includes("nefro") || topicName.toLowerCase().includes("nefri"))) return;

        if (!TEMARIO_MAP_ACCUMULATOR[topicName]) TEMARIO_MAP_ACCUMULATOR[topicName] = new Set();
        getAliases(topicName).forEach(a => TEMARIO_MAP_ACCUMULATOR[topicName].add(a));

        let subs = subPart.split('/').map(s => s.trim()).filter(s => s.length > 0);
        subs.forEach(s => {
            let cleanSub = normalizeName(s.replace(/\(|\)/g, ''));
            if (!cleanSub) return;
            if (currentSpecialty.toLowerCase().includes("psiquiatr") && (cleanSub.toLowerCase().includes("nefrit") || cleanSub.toLowerCase().includes("nefrot") || cleanSub.toLowerCase().includes("absceso renal"))) return;

            TEMARIO_MAP_ACCUMULATOR[topicName].add(cleanSub);
            if (!TEMARIO_MAP_ACCUMULATOR[cleanSub]) TEMARIO_MAP_ACCUMULATOR[cleanSub] = new Set();
            getAliases(cleanSub).forEach(a => TEMARIO_MAP_ACCUMULATOR[cleanSub].add(a));
        });

        if (trailing && trailing.length > 0 && trailing.length < 50 && !/^\d+\./.test(trailing)) {
            let subLines = trailing.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            if (subLines.length > 0) currentSpecialty = subLines[subLines.length - 1];
        }
    } else {
        let lines = trimmed.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length > 0) {
            let potential = normalizeName(lines[lines.length - 1]);
            if (potential.length < 50 && !/^\d+\./.test(potential)) {
                currentSpecialty = potential;
                if (!TEMARIO_MAP_ACCUMULATOR[currentSpecialty]) TEMARIO_MAP_ACCUMULATOR[currentSpecialty] = new Set();
                getAliases(currentSpecialty).forEach(a => TEMARIO_MAP_ACCUMULATOR[currentSpecialty].add(a));
            }
        }
    }
});

const OFFICIAL_TEMARIO = Object.keys(TEMARIO_MAP_ACCUMULATOR).sort();
const TEMARIO_MAPPING = {};
for (const [topic, set] of Object.entries(TEMARIO_MAP_ACCUMULATOR)) {
    TEMARIO_MAPPING[topic] = [...set];
}

const officialJS = JSON.stringify(OFFICIAL_TEMARIO, null, 8).replace(/\]$/, '    ]');
const mappingJS = JSON.stringify(TEMARIO_MAPPING, null, 8).replace(/\}$/, '    }');

const newOfficialCode = `    const OFFICIAL_TEMARIO = ${officialJS};`;
const newMappingCode = `    const TEMARIO_MAPPING = ${mappingJS};`;

let appContent = fs.readFileSync('D:\\ENARM Lab\\app.js', 'utf8');

const replaceSection = (content, startTag, bracketType) => {
    let startIdx = content.indexOf(startTag);
    if (startIdx === -1) return content;
    let braceCount = 0;
    let endIdx = -1;
    let closeType = bracketType === '[' ? ']' : '}';
    for (let i = startIdx; i < content.length; i++) {
        if (content[i] === bracketType) braceCount++;
        if (content[i] === closeType) {
            braceCount--;
            if (braceCount === 0) {
                endIdx = i + 1;
                while (content[endIdx] === ';' || content[endIdx] === ' ' || content[endIdx] === '\n' || content[endIdx] === '\r') {
                    if (content[endIdx] === ';') { endIdx++; break; }
                    endIdx++;
                }
                break;
            }
        }
    }
    if (endIdx !== -1) {
        let code = startTag.includes('OFFICIAL') ? newOfficialCode : newMappingCode;
        return content.substring(0, startIdx) + code + content.substring(endIdx);
    }
    return content;
};

appContent = replaceSection(appContent, '    const OFFICIAL_TEMARIO = [', '[');
appContent = replaceSection(appContent, '    const TEMARIO_MAPPING = {', '{');

fs.writeFileSync('D:\\ENARM Lab\\app.js', appContent, 'utf8');
console.log('Update Success! Total UNIQUE topics:', OFFICIAL_TEMARIO.length);
