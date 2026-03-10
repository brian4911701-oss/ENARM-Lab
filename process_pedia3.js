const fs = require('fs');
const PDFParser = require('pdf2json');

const pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    let text = pdfParser.getRawTextContent();
    const lines = text.split('\n').map(l => l.trim().replace(/\r/g, ''));

    const cases = [];
    let currentCase = null;
    let currentQuestion = null;
    let mode = null;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (!line) continue;
        if (line.includes('----------------Page (')) continue;

        if (line.startsWith('Tema:')) {
            if (currentCase) {
                let allFeedbacks = currentCase.questions.map(q => q.explanation).filter(e => e.length > 0);
                if (allFeedbacks.length === 1 && currentCase.questions.length > 1) {
                    currentCase.questions.forEach(q => q.explanation = allFeedbacks[0]);
                }
                cases.push(currentCase);
            }
            currentCase = {
                tema: line.substring(5).trim(),
                subtema: "",
                specialty: "ped",
                case: "",
                questions: [],
                difficulty: "alta"
            };
            currentQuestion = null;
            mode = null;
            continue;
        }

        if (!currentCase) continue;

        if (line.startsWith('Subtema:')) {
            currentCase.subtema = line.substring(8).trim();
            continue;
        }

        if (line.match(/^Grado de dificultad:/i) || line.match(/^Dificultad:/i)) {
            let parts = line.split(':');
            if (parts[1]) currentCase.difficulty = parts[1].trim();
            continue;
        }

        if (line.match(/^Caso cl[ií]nico/i)) {
            mode = 'case_text';
            continue;
        }

        if (line.match(/^Pregunta \d+/) || line.match(/^Pregunta$/) || line.match(/^Pregunta\./)) {
            let qText = line.replace(/^Pregunta \d*\.?\s*/, '').trim();
            currentQuestion = {
                question: qText === "Pregunta" ? "" : qText,
                options: [],
                answerIndex: 0,
                explanation: ""
            };
            currentCase.questions.push(currentQuestion);
            mode = 'question';
            continue;
        }

        if (line.match(/^Retroalimentaci[oó]n/i)) {
            mode = 'feedback';
            continue;
        }

        if (mode === 'case_text') {
            currentCase.case += (currentCase.case ? " " : "") + line;
        } else if (mode === 'question') {
            if (line.match(/^(\*?[A-Ea-e]\))/)) {
                mode = 'options';
                i--; // re-process as option
            } else {
                currentQuestion.question += (currentQuestion.question ? " " : "") + line;
            }
        } else if (mode === 'options') {
            let m = line.match(/^(\*?[A-Ea-e]\))/);
            if (m) {
                let optText = line;
                let isCorrect = false;
                if (optText.startsWith('*')) {
                    isCorrect = true;
                    optText = optText.substring(1).trim();
                } else if (optText.endsWith('*')) {
                    isCorrect = true;
                    optText = optText.substring(0, optText.length - 1).trim();
                }
                optText = optText.substring(2).trim(); // remove A)

                if (isCorrect) currentQuestion.answerIndex = currentQuestion.options.length;
                currentQuestion.options.push(optText);
            } else {
                if (currentQuestion && currentQuestion.options.length > 0) {
                    let optText = line;
                    let isCorrect = false;
                    if (optText.endsWith('*')) {
                        isCorrect = true;
                        optText = optText.substring(0, optText.length - 1).trim();
                    }
                    currentQuestion.options[currentQuestion.options.length - 1] += " " + optText;
                    if (isCorrect) currentQuestion.answerIndex = currentQuestion.options.length - 1;
                }
            }
        } else if (mode === 'feedback') {
            if (currentQuestion) {
                currentQuestion.explanation += (currentQuestion.explanation ? " " : "") + line;
            }
        }
    }
    if (currentCase) {
        let allFeedbacks = currentCase.questions.map(q => q.explanation).filter(e => e.length > 0);
        if (allFeedbacks.length === 1 && currentCase.questions.length > 1) {
            currentCase.questions.forEach(q => q.explanation = allFeedbacks[0]);
        }
        cases.push(currentCase);
    }

    let formatted = [];
    cases.forEach(c => {
        if (!c.case || c.questions.length === 0) {
            console.log("Skipping incomplete case:", c.tema);
            return;
        }

        let diffLower = c.difficulty.toLowerCase();
        let normalizedDiff = 'alta';
        if (diffLower.includes('baja')) normalizedDiff = 'baja';
        else if (diffLower.includes('media')) normalizedDiff = 'media';
        else if (diffLower.includes('muy alta')) normalizedDiff = 'muy-alta';

        formatted.push({
            specialty: c.specialty,
            tema: c.tema,
            subtema: c.subtema,
            difficulty: normalizedDiff,
            case: c.case,
            questions: c.questions.map(q => ({
                question: q.question,
                options: q.options,
                answerIndex: q.answerIndex,
                explanation: q.explanation,
                gpcReference: ""
            }))
        });
    });

    console.log(`Parsed ${formatted.length} new pedia cases.`);

    let oldQ = require('./questions.js');
    let combined = oldQ.concat(formatted);
    let out = "// questions.js – Banco de reactivos para ENARMlab\n" +
        "const QUESTIONS = " + JSON.stringify(combined, null, 2) + ";\n\n" +
        "if (typeof module !== 'undefined') {\n  module.exports = QUESTIONS;\n}\n";

    fs.writeFileSync('questions.js', out);
    console.log(`Successfully combined ${oldQ.length} old questions with ${formatted.length} new cases. New total: ${combined.length}`);
});

pdfParser.loadPDF("casos pedia 3.pdf");
