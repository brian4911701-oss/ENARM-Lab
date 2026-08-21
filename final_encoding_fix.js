const fs = require('fs');
const path = require('path');

function fixFile(fileName) {
    const fullPath = path.join('d:\\ENARM Lab', fileName);
    if (!fs.existsSync(fullPath)) return;

    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Explicit fixed for known issues
    const fixes = [
        { bad: 'PatologÃ\u00ad\u00ada', good: 'Patología' },
        { bad: 'PatologÃ\u00ada', good: 'Patología' },
        { bad: 'PatologÂ\u00ada', good: 'Patología' },
        { bad: 'PatologÃ­a', good: 'Patología' },
        { bad: 'EN LÃ\u008dNEA', good: 'EN LÍNEA' },
        { bad: 'EN LÃ\u00adNEA', good: 'EN LÍNEA' },
        { bad: 'EN L\u00c3\u00adNEA', good: 'EN L\u00cdNEA' },
        { bad: 'Ã\u00ad', good: 'í' },
        { bad: 'Ã¡', good: 'á' },
        { bad: 'Ã©', good: 'é' },
        { bad: 'Ã³', good: 'ó' },
        { bad: 'Ãº', good: 'ú' },
        { bad: 'Ã±', good: 'ñ' }
    ];

    let changed = false;
    fixes.forEach(f => {
        if (content.includes(f.bad)) {
            content = content.split(f.bad).join(f.good);
            changed = true;
        }
    });

    if (fileName === 'index.html') {
        if (!content.includes('charset="UTF-8"')) {
            // Should already have it, but let's check
        }
        const old1 = '<script src="questions.js"></script>';
        const old2 = '<script src="app.js"></script>';
        if (content.includes(old1)) {
            content = content.replace(old1, '<script src="questions.js" charset="UTF-8"></script>');
            changed = true;
        }
        if (content.includes(old2)) {
            content = content.replace(old2, '<script src="app.js" charset="UTF-8"></script>');
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fileName}`);
    }
}

fixFile('app.js');
fixFile('questions.js');
fixFile('index.html');
