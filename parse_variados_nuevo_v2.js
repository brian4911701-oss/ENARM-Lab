const fs = require('fs');

const text = fs.readFileSync('variados_text_nuevo.txt', 'utf8');

const blocks = text.split(/\n---\s*\n/);
const caseStudies = [];

const specialtyMap = {
    'medicina interna': 'mi',
    'pediatría': 'ped',
    'pediatria': 'ped',
    'ginecología y obstetricia': 'gyo',
    'ginecologia y obstetricia': 'gyo',
    'cirugía': 'cir',
    'cirugia': 'cir',
    'salud pública': 'sp',
    'salud publica': 'sp',
    'urgencias': 'urg'
};

const clean = (s) => s.replace(/\s+/g, ' ').trim();

blocks.forEach((block) => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.includes('----------------Page'));

    if (lines.length < 5) return;

    let specialty = "mi"; // default
    let tema = "";
    let dificultad = "media";
    let caseText = "";
    let questions = [];
    let currentQuestion = null;
    let mode = 'metadata';

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // NEW: Check if line CONTAINS Retroalimentación somewhere (not just starts with)
        // This handles where PDF extraction merges choice with feedback
        const fbMatch = line.match(/(.*)(Retroalimentaci[oó]n.*)/i);
        let lineBeforeFeedback = line;
        let lineFeedbackPart = null;
        if (fbMatch) {
            lineBeforeFeedback = fbMatch[1].trim();
            lineFeedbackPart = fbMatch[2].trim();
        }

        if (line.toLowerCase().startsWith('especialidad:')) {
            const specRaw = line.substring(13).trim().toLowerCase();
            specialty = specialtyMap[specRaw] || specRaw;
            continue;
        }
        if (line.toLowerCase().startsWith('tema:')) {
            tema = line.substring(5).trim();
            continue;
        }
        if (line.toLowerCase().startsWith('dificultad:')) {
            const diffRaw = line.substring(11).trim().toLowerCase();
            if (diffRaw.includes('muy alta')) dificultad = 'muy-alta';
            else if (diffRaw.includes('alta')) dificultad = 'alta';
            else if (diffRaw.includes('media')) dificultad = 'media';
            else dificultad = 'baja';
            continue;
        }

        if (line === 'Caso Clínico') {
            mode = 'case';
            continue;
        }

        if (line.toLowerCase().match(/^pregunta \d+/)) {
            if (currentQuestion) questions.push(currentQuestion);
            currentQuestion = {
                id: Math.random().toString(36).substr(2, 9),
                question: "",
                options: [],
                answerIndex: -1,
                explanation: "",
                gpcReference: ""
            };
            mode = 'question';
            continue;
        }

        // If line contains feedback part, handle it after processing the line part
        if (lineFeedbackPart) {
            // Re-process the line part first (without feedback)
            line = lineBeforeFeedback;
            // then we'll jump to feedback mode after this line's processing
        }

        const optionMatch = line.match(/^([A-E])\)\s*(.*)/);
        if (optionMatch) {
            mode = 'options';
            let optText = optionMatch[2].trim();
            if (optText.includes('*')) {
                optText = optText.replace(/\*/g, '').trim();
                currentQuestion.answerIndex = currentQuestion.options.length;
            }
            currentQuestion.options.push(optText);

            if (lineFeedbackPart) {
                mode = 'feedback';
                currentQuestion.explanation += (currentQuestion.explanation ? " " : "") + lineFeedbackPart;
            }
            continue;
        }

        if (line.toLowerCase().startsWith('retroalimentación:') || line.toLowerCase().startsWith('retroalimentacion:')) {
            mode = 'feedback';
            currentQuestion.explanation += (currentQuestion.explanation ? " " : "") + line.replace(/Retroalimentaci[oó]n.*?:/i, '').trim();
            continue;
        }

        if (mode === 'case') {
            caseText += (caseText ? " " : "") + line;
        } else if (mode === 'question') {
            if (currentQuestion) currentQuestion.question += (currentQuestion.question ? " " : "") + line;
        } else if (mode === 'options') {
            if (currentQuestion && currentQuestion.options.length > 0) {
                let lineCont = line;
                if (lineCont.includes('*')) {
                    lineCont = lineCont.replace(/\*/g, '').trim();
                    currentQuestion.answerIndex = currentQuestion.options.length - 1;
                }
                currentQuestion.options[currentQuestion.options.length - 1] += " " + lineCont;
            }
        } else if (mode === 'feedback') {
            if (currentQuestion) {
                currentQuestion.explanation += (currentQuestion.explanation ? " " : "") + line;
            } else if (questions.length > 0) {
                questions[questions.length - 1].explanation += (questions[questions.length - 1].explanation ? " " : "") + line;
            }
        }

        // If we found feedback part in the line, and we just finished processing the 'part before',
        // we should handle the feedback part now if we didn't already.
        if (lineFeedbackPart && mode !== 'feedback') {
            mode = 'feedback';
            if (currentQuestion) currentQuestion.explanation += (currentQuestion.explanation ? " " : "") + lineFeedbackPart;
        }
    }

    if (currentQuestion) questions.push(currentQuestion);

    if (questions.length > 0) {
        questions.forEach(q => {
            q.question = clean(q.question);
            q.options = q.options.map(clean);
            q.explanation = clean(q.explanation);
        });

        let lastFeedback = "";
        questions.forEach(q => {
            if (q.explanation.length > 0) lastFeedback = q.explanation;
            else if (lastFeedback.length > 0) q.explanation = lastFeedback;
        });
        // Backfill if first one was missing
        let firstFeedback = questions.find(q => q.explanation.length > 0);
        if (firstFeedback) {
            questions.forEach(q => {
                if (q.explanation.length === 0) q.explanation = firstFeedback.explanation;
            });
        }

        caseStudies.push({
            specialty: specialty,
            tema: clean(tema),
            subtema: clean(tema),
            difficulty: dificultad,
            case: clean(caseText),
            questions: questions
        });
    }
});

console.log(`Parsed ${caseStudies.length} case studies.`);
fs.writeFileSync('parsed_variados_nuevo_v2.json', JSON.stringify(caseStudies, null, 2), 'utf8');
