const fs = require('fs');

const text = fs.readFileSync('pdf_text.txt', 'utf8');
const lines = text.split('\n').map(l => l.trim().replace(/\r/g, ''));

const cases = [];
let currentCase = null;
let currentQuestion = null;
let mode = null; // 'case_text', 'question', 'options', 'feedback'
let specialtyMatch = { 'Pediatría': 'ped', 'Medicina Interna': 'mi', 'Cirugía': 'cir', 'Ginecología': 'gyo', 'Obstetricia': 'gyo', 'Urgencias': 'urg', 'Oncología': 'mi', 'Nefrología': 'mi', 'Hematología': 'mi', 'Cardiología': 'mi' };

const getSpecialty = (temaStr) => {
    let spec = 'mi';
    for (let key in specialtyMatch) {
        if (temaStr.includes(key)) spec = specialtyMatch[key];
    }
    return spec;
};

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    if (line.includes('----------------Page (')) continue; // skip page breaks

    if (line.startsWith('Tema:')) {
        if (currentCase) cases.push(currentCase);

        currentCase = {
            tema: line.substring(5).trim(),
            specialty: getSpecialty(line),
            case_text: "",
            questions: [],
            feedback: "",
            difficulty: "alta"
        };
        mode = 'case_text';
        continue;
    }

    if (!currentCase) continue;

    if (line.match(/^Pregunta \d+\./) || line.match(/^Pregunta\./)) {
        currentQuestion = {
            question: line.replace(/^Pregunta \d*\.?\s*/, '').trim(),
            options: [],
            answerIndex: 0
        };
        currentCase.questions.push(currentQuestion);
        mode = 'options';
        continue;
    }

    if (line.startsWith('Retroalimentación:')) {
        mode = 'feedback';
        continue;
    }

    if (line.startsWith('Grado de dificultad:')) {
        const diff = line.split(':')[1].trim().toLowerCase();
        currentCase.difficulty = diff === 'alto' ? 'muy-alta' : (diff === 'medio' ? 'alta' : 'media');
        continue;
    }

    if (line.startsWith('CASO CLÍNICO')) {
        continue;
    }

    if (mode === 'case_text') {
        currentCase.case_text += (currentCase.case_text ? " " : "") + line;
    } else if (mode === 'options') {
        if (line.match(/^[A-E]\)/)) {
            let optText = line.substring(2).trim();
            if (optText.endsWith('*')) {
                optText = optText.substring(0, optText.length - 1).trim();
                currentQuestion.answerIndex = currentQuestion.options.length;
            }
            currentQuestion.options.push(optText);
        } else {
            // might be continuation of previous option or a question
            if (currentQuestion.options.length > 0) {
                currentQuestion.options[currentQuestion.options.length - 1] += " " + line;
            } else {
                currentQuestion.question += " " + line;
            }
        }
    } else if (mode === 'feedback') {
        currentCase.feedback += (currentCase.feedback ? " " : "") + line;
    }
}
if (currentCase) cases.push(currentCase);

// Now generate JS output
let newQuestions = [];
cases.forEach(c => {
    c.questions.forEach(q => {
        newQuestions.push({
            specialty: c.specialty,
            tema: c.tema,
            difficulty: c.difficulty,
            case: c.case_text,
            question: q.question,
            options: q.options,
            answerIndex: q.answerIndex,
            explanation: c.feedback,
            gpcReference: ""
        });
    });
});

console.log(`Parsed ${newQuestions.length} valid questions from PDF.`);
fs.writeFileSync('parsed_questions.json', JSON.stringify(newQuestions, null, 2));
