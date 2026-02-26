const fs = require('fs');
let oldQ = require('./questions.js');
let newQ = require('./parsed_questions.json');

let combined = oldQ.concat(newQ);

let out = "// questions.js – Banco de reactivos para ENARMlab\n" +
    "const QUESTIONS = " + JSON.stringify(combined, null, 2) + ";\n\n" +
    "if (typeof module !== 'undefined') {\n  module.exports = QUESTIONS;\n}\n";

fs.writeFileSync('questions.js', out);

console.log(`Successfully combined ${oldQ.length} old questions with ${newQ.length} new questions from the PDF. Total = ${combined.length}.`);
