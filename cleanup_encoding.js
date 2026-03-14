const fs = require('fs');
const path = require('path');

const files = ['app.js', 'questions.js', 'index.html'];

const replacements = [
    { bad: 'Ã¡', good: 'á' },
    { bad: 'Ã©', good: 'é' },
    { bad: 'Ã­', good: 'í' },
    { bad: 'Ã³', good: 'ó' },
    { bad: 'Ãº', good: 'ú' },
    { bad: 'Ã±', good: 'ñ' },
    { bad: 'Ã ', good: 'Á' },
    { bad: 'Ã‰', good: 'É' },
    { bad: 'Ã\u008d', good: 'Í' },
    { bad: 'Ã“', good: 'Ó' },
    { bad: 'Ãš', good: 'Ú' },
    { bad: 'Ã\u0091', good: 'Ñ' },
    { bad: 'Â¿', good: '¿' },
    { bad: 'Â¡', good: '¡' },
    { bad: 'Âº', good: 'º' },
    { bad: 'Âª', good: 'ª' },
    { bad: 'Â', good: '' }, // Often a ghost character before other symbols
    { bad: 'â€œ', good: '“' },
    { bad: 'â€\u009d', good: '”' },
    { bad: 'â€˜', good: '‘' },
    { bad: 'â€™', good: '’' },
    { bad: 'â€“', good: '–' },
    { bad: 'â€”', good: '—' }
];

files.forEach(file => {
    const fullPath = path.join('d:\\ENARM Lab', file);
    if (!fs.existsSync(fullPath)) return;

    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;

    replacements.forEach(r => {
        if (content.includes(r.bad)) {
            console.log(`Fixing ${r.bad} -> ${r.good} in ${file}`);
            content = content.split(r.bad).join(r.good);
            changed = true;
        }
    });

    if (changed) {
        // Ensure we save it as UTF-8 with BOM for local loading
        const bom = Buffer.from([0xEF, 0xBB, 0xBF]);
        const buf = Buffer.from(content, 'utf8');
        fs.writeFileSync(fullPath, Buffer.concat([bom, buf]));
        console.log(`Saved ${file} with fixes and BOM.`);
    } else {
        console.log(`No fixes needed for ${file}.`);
    }
});
