const fs = require('fs');

const content = fs.readFileSync('D:\\ENARM Lab\\questions.js', 'utf8');
// content is like: // questions.js ... \n const QUESTIONS = [ ... ];
let jsonStr = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);

try {
    const questions = eval('(' + jsonStr + ')');

    let stats = {};
    let noTema = 0;

    questions.forEach(q => {
        let tema = q.tema || 'Sin Tema';
        let subtema = q.subtema || 'Sin Subtema';

        if (!stats[tema]) {
            stats[tema] = { total: 0, subtemas: {} };
        }
        stats[tema].total++;

        if (!stats[tema].subtemas[subtema]) {
            stats[tema].subtemas[subtema] = 0;
        }
        stats[tema].subtemas[subtema]++;

        if (tema === 'Sin Tema') noTema++;
    });

    fs.writeFileSync('D:\\ENARM Lab\\stats_cases.json', JSON.stringify(stats, null, 2));
    console.log(`Total questions processed: ${questions.length}`);
    console.log(`Questions without 'tema': ${noTema}`);
} catch (e) {
    console.error("Error parsing questions.js", e);
}
