const fs = require('fs');
let app = fs.readFileSync('d:\\ENARM Lab\\app.js', 'utf8');

const target = `            // Combinar temario oficial con temas dinámicos del banco de preguntas
            const dynTemas = [...new Set(QUESTIONS.map(q => q.tema).filter(t => !!t))];
            const dynSubtemas = [...new Set(QUESTIONS.map(q => q.subtema).filter(t => !!t))];
            const dynGpcs = [...new Set(QUESTIONS.map(q => q.gpcReference).filter(t => !!t))];

            const combinedTopics = [...new Set([
                ...OFFICIAL_TEMARIO,
                ...dynTemas,
                ...dynSubtemas,
                ...dynGpcs
            ])].sort();`;

const replacement = `            // Solo usar temario oficial para evitar duplicados y confusion
            const combinedTopics = [...new Set([...OFFICIAL_TEMARIO])].sort();`;

if (app.includes(target)) {
    app = app.replace(target, replacement);
    fs.writeFileSync('d:\\ENARM Lab\\app.js', app, 'utf8');
    console.log('Successfully updated showSuggestions');
} else {
    console.log('Target not found exactly. Trying fallback regex...');
    const regex = /\/\/ Combinar temario oficial[\s\S]*?combinedTopics = \[[\s\S]*?\]\.sort\(\);/;
    if (regex.test(app)) {
        app = app.replace(regex, replacement);
        fs.writeFileSync('d:\\ENARM Lab\\app.js', app, 'utf8');
        console.log('Successfully updated showSuggestions via regex');
    } else {
        console.log('Regex failed too.');
    }
}
