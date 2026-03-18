const fs = require('fs');
const QUESTIONS = require('./questions.js');
const newCases = JSON.parse(fs.readFileSync('parsed_variados_nuevo_v2.json', 'utf8'));
const combined = QUESTIONS.concat(newCases);
const out = "// questions.js – Banco de reactivos para ENARMlab\n" +
    "const QUESTIONS = " + JSON.stringify(combined, null, 2) + ";\n\n" +
    "if (typeof module !== 'undefined') {\n  module.exports = QUESTIONS;\n}\n";
fs.writeFileSync('questions.js', out);
console.log(`Successfully added ${newCases.length} new case studies (Total: ${combined.length})`);
