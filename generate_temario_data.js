const fs = require('fs');

const rawText = fs.readFileSync('D:\\ENARM Lab\\temario_out.txt', 'utf8');
const cleanText = rawText.replace(/-+Page \(\d+\) Break-+/g, '');

const parts = cleanText.split('•');

const OFFICIAL_TEMARIO = [];
const TEMARIO_MAPPING = {};

let currentSpecialty = "Ginecología y Obstetricia";

const synonyms = {
    "Sx": "Síndrome",
    "CA": "Cáncer",
    "SOP": "Síndrome de Ovario Poliquístico",
    "IVU": "Infección de Vías Urinarias",
    "IVUs": "Infecciones de Vías Urinarias",
    "EVC": "Enfermedad Vascular Cerebral",
    "RN": "Recién Nacido",
    "RPM": "Ruptura Prematura de Membranas",
    "DPPNI": "Desprendimiento de Placenta",
    "CACU": "Cáncer Cervicouterino",
    "STDA": "Sangrado de Tubo Digestivo Alto",
    "TCE": "Trauma Craneoencefálico"
};

function normalizeName(name) {
    if (!name) return "";
    // Clean newlines and extra spaces
    let clean = name.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
    // Remove P1, P2, P3 suffixes
    clean = clean.replace(/\s+P[1-3](\s|$)/g, ' ').trim();
    return clean;
}

function getAliases(name) {
    let aliases = [name];
    for (const [key, val] of Object.entries(synonyms)) {
        if (name.includes(key)) {
            aliases.push(name.replace(new RegExp(`\\b${key}\\b`, 'g'), val));
        }
        if (name.includes(val)) {
            aliases.push(name.replace(new RegExp(`\\b${val}\\b`, 'g'), key));
        }
    }
    return [...new Set(aliases)];
}

parts.forEach((part, index) => {
    let trimmed = part.trim();
    if (!trimmed) return;

    const numberMatch = trimmed.match(/^(\d+)\.\s+/);

    if (numberMatch) {
        let firstParen = trimmed.indexOf('(');
        let lastParen = trimmed.lastIndexOf(')');

        let topicName = "";
        let subPart = "";
        let trailing = "";

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

        const displayTopic = `${topicName} (${normalizeName(currentSpecialty)})`;
        OFFICIAL_TEMARIO.push(displayTopic);

        let subs = subPart.split('/').map(s => s.trim()).filter(s => s.length > 0);

        // Mapping for main topic: Topic Name, Aliases of Topic Name, and all subtopics
        let topicSearchTerms = getAliases(topicName);
        TEMARIO_MAPPING[displayTopic] = [...new Set([...topicSearchTerms, ...subs])];

        subs.forEach(s => {
            let cleanSub = normalizeName(s.replace(/\(|\)/g, ''));
            if (!cleanSub) return;
            const displaySub = `${cleanSub} (${topicName})`;
            OFFICIAL_TEMARIO.push(displaySub);

            // Mapping for subtopic: Sub name and its aliases
            TEMARIO_MAPPING[displaySub] = getAliases(cleanSub);
        });

        if (trailing && trailing.length > 0 && trailing.length < 50 && !/^\d+\./.test(trailing)) {
            let subLines = trailing.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            if (subLines.length > 0) {
                currentSpecialty = subLines[subLines.length - 1];
            }
        }
    } else {
        let lines = trimmed.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length > 0) {
            let potential = normalizeName(lines[lines.length - 1]);
            if (potential.length < 50 && !/^\d+\./.test(potential)) {
                currentSpecialty = potential;
                if (!OFFICIAL_TEMARIO.includes(currentSpecialty)) {
                    OFFICIAL_TEMARIO.push(currentSpecialty);
                    TEMARIO_MAPPING[currentSpecialty] = getAliases(currentSpecialty);
                }
            }
        }
    }
});

const finalTopics = [...new Set(OFFICIAL_TEMARIO)];
const officialJS = JSON.stringify(finalTopics, null, 8).replace(/\]$/, '    ]');
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
console.log('Update Success with Unification and P1/P2/P3 removal!');
console.log('Total entries:', finalTopics.length);
