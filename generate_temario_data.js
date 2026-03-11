const fs = require('fs');

const rawText = fs.readFileSync('D:\\ENARM Lab\\temario_out.txt', 'utf8');
const cleanText = rawText.replace(/-+Page \(\d+\) Break-+/g, '');

const parts = cleanText.split('•');

const OFFICIAL_TEMARIO = [];
const TEMARIO_MAPPING = {};

let currentSpecialty = "Ginecología y Obstetricia";

parts.forEach((part, index) => {
    let trimmed = part.trim();
    if (!trimmed) return;

    // Check if it's a numbered topic
    const numberMatch = trimmed.match(/^(\d+)\.\s+/);

    if (numberMatch) {
        // It's a topic block.
        // We need to find where the topic name ends and subtopics start.
        // Format: NUM. Topic Name (Sub1 / Sub2) trailing

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
            // No parens or broken
            topicName = trimmed.substring(numberMatch[0].length).trim();
            // Trailing might be at the end after newlines
            let lines = topicName.split('\n');
            if (lines.length > 1) {
                topicName = lines[0].trim();
                trailing = lines.slice(1).join('\n').trim();
            }
        }

        topicName = topicName.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();

        const displayTopic = `${topicName} (${currentSpecialty})`;
        OFFICIAL_TEMARIO.push(displayTopic);

        let subs = subPart.split('/').map(s => s.trim()).filter(s => s.length > 0);

        TEMARIO_MAPPING[displayTopic] = [topicName, ...subs];

        subs.forEach(s => {
            // Clean subtopic name (remove internal parens if any)
            let cleanSub = s.replace(/\(|\)/g, '').trim();
            const displaySub = `${cleanSub} (${topicName})`;
            OFFICIAL_TEMARIO.push(displaySub);
            TEMARIO_MAPPING[displaySub] = [cleanSub];
        });

        // Update specialty
        if (trailing && trailing.length > 0 && trailing.length < 50 && !/^\d+\./.test(trailing)) {
            // If it has multiple lines, the specialty is the last line
            let subLines = trailing.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            if (subLines.length > 0) {
                currentSpecialty = subLines[subLines.length - 1];
            }
        }
    } else {
        // Header block
        let lines = trimmed.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length > 0) {
            currentSpecialty = lines[lines.length - 1];
            if (currentSpecialty.length < 50) {
                OFFICIAL_TEMARIO.push(currentSpecialty);
                TEMARIO_MAPPING[currentSpecialty] = [currentSpecialty];
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
console.log('Update Success! Total items:', finalTopics.length);
