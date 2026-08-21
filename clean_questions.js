const fs = require('fs');
let text = fs.readFileSync('questions.js', 'utf8');
text = text.replace('// questions.js – Banco de reactivos para ENARMlab\nconst QUESTIONS = ', '');
text = text.replace(/;\n\nif \(typeof module !== 'undefined'\) \{\n  module\.exports = QUESTIONS;\n\}\n$/, '');

let q = JSON.parse(text);

q.forEach(c => {
    if (c && c.tema && c.tema.includes('Subtema:')) {
        let parts = c.tema.split('Subtema:');
        c.tema = parts[0].trim();
        c.subtema = parts[1].trim();
    }
});

let out = "// questions.js – Banco de reactivos para ENARMlab\n" +
    "const QUESTIONS = " + JSON.stringify(q, null, 2) + ";\n\n" +
    "if (typeof module !== 'undefined') {\n  module.exports = QUESTIONS;\n}\n";

fs.writeFileSync('questions.js', out);
console.log('Cleaned questions.js');
