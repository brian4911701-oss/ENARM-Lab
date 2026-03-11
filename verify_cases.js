const fs = require('fs');

console.log('Reading files...');
const appJs = fs.readFileSync('app.js', 'utf8');
const qJs = fs.readFileSync('questions.js', 'utf8');

const mappingMatch = appJs.match(/const TEMARIO_MAPPING = (\{[\s\S]*?\});/);
let TEMARIO_MAPPING = {};
if (mappingMatch) {
    try {
        TEMARIO_MAPPING = eval('(' + mappingMatch[1] + ')');
    } catch (e) {
        console.error('Error parsing TEMARIO_MAPPING:', e.message);
    }
}

// Extract QUESTIONS - very carefully
let questionsRaw = qJs.trim();
// Remove everything before the first [ and after the last ]
const startIdx = questionsRaw.indexOf('[');
const endIdx = questionsRaw.lastIndexOf(']');
if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find array in questions.js');
    process.exit(1);
}
questionsRaw = questionsRaw.substring(startIdx, endIdx + 1);

let QUESTIONS = [];
try {
    // We use eval on just the array part
    QUESTIONS = eval('(' + questionsRaw + ')');
} catch (e) {
    console.error('Error parsing QUESTIONS array:', e.message);
    process.exit(1);
}

console.log(`Mapping loaded: ${Object.keys(TEMARIO_MAPPING).length} entries`);
console.log(`Questions loaded: ${QUESTIONS.length}`);

const report = {
    total: QUESTIONS.length,
    covered: 0,
    perTopic: {},
    orphans: []
};

QUESTIONS.forEach((q, i) => {
    const qText = `${q.tema || ""} ${q.subtema || ""} ${q.case || ""} ${q.question || ""} ${q.gpcReference || ""}`.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    let matchedTopics = [];
    for (const [topic, searchTerms] of Object.entries(TEMARIO_MAPPING)) {
        if (searchTerms.some(term => {
            const normTerm = term.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return qText.includes(normTerm);
        })) {
            matchedTopics.push(topic);
        }
    }

    if (matchedTopics.length > 0) {
        report.covered++;
        matchedTopics.forEach(t => {
            report.perTopic[t] = (report.perTopic[t] || 0) + 1;
        });
    } else {
        report.orphans.push({
            index: i,
            specialty: q.specialty,
            shortCase: q.case.substring(0, 80) + '...'
        });
    }
});

console.log(`\nCoverage: ${report.covered} / ${report.total} (${((report.covered / report.total) * 100).toFixed(1)}%)`);
console.log(`Orphan Cases: ${report.orphans.length}`);

if (report.orphans.length > 0) {
    console.log('\nSample of cases NOT matching any topic:');
    report.orphans.slice(0, 20).forEach(o => {
        console.log(`[${o.specialty}] ${o.shortCase}`);
    });
}
