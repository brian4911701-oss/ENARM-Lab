const fs = require('fs');
let questions = require('./questions.js');

let count = 0;
questions.forEach(q => {
    if (q.specialty === 'gine') {
        q.specialty = 'gyo';
        count++;
    }
});

let out = "// questions.js – Banco de reactivos para ENARMlab\n" +
    "const QUESTIONS = " + JSON.stringify(questions, null, 2) + ";\n\n" +
    "if (typeof module !== 'undefined') {\n  module.exports = QUESTIONS;\n}\n";

fs.writeFileSync('questions.js', out);
console.log(`Fixed ${count} specialties from gine to gyo.`);
