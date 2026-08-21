/**
 * fix_neonatal_specialty.js
 * Segunda pasada: corrige los casos neonatales que están en gyo en lugar de ped.
 * Algunos casos de recién nacido están en gyo por mencionar "embarazo" o similares.
 */

const fs = require('fs');
const path = require('path');

const questionsPath = path.join(__dirname, 'questions.js');
let raw = fs.readFileSync(questionsPath, 'utf8');
const startIdx = raw.indexOf('[');
const endIdx = raw.lastIndexOf(']') + 1;
let questions = JSON.parse(raw.substring(startIdx, endIdx));

console.log(`Total: ${questions.length}`);

let fixed = 0;

questions.forEach((q, idx) => {
    const text = (q.case || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Casos que claramente son pediátricos/neonatales
    const clearlyPed = [
        // Pediatría neonatal explícita
        'recien nacido a termino', 'recien nacido pretermino', 'recien nacido de',
        'neonato de', 'rn de', 'lactante de', 'lactante masculino', 'lactante femenino',
        'nino de ', 'niño de ', 'escolar de ', 'preescolar de ',
        'producto de ', 'recientemente nacido',
        'semanas de vida', 'dias de vida', 'horas de vida', 'meses de vida',
        'bebe de ', 'infante de',
        // Diagnósticos pediátricos específicos
        'bronquiolitis', 'invaginacion intestinal', 'estenosis hipertrofica de piloro',
        'hernia diafragmatica congenita', 'ictericia neonatal', 'ictericia del recien nacido',
        'coombs directo positivo', 'incompatibilidad abo', 'incompatibilidad rh',
        'enfermedad hemolitica del rn', 'enfermedad hemolitica del recien nacido',
        'epiglotitis aguda', 'laringotraqueitis',
        'membrana hialina', 'sindrome de distres respiratorio neonatal',
        'enterocolitis necrotizante', 'atresia duodenal', 'doble burbuja',
        'onfalocele', 'gastrosquisis', 'malf. anorrectales',
        'asfixia neonatal', 'encefalopatia hipoxica',
        'sarampion', 'rubeola exantema', 'varicela en nino', 'escarlatina',
        'exantema subito', 'roséola',
        'fiebre en nino', 'convulsiones febriles',
        'abuso sexual infantil', 'maltrato infantil',
    ];

    const isClearlyPed = clearlyPed.some(kw => text.includes(kw));

    if (isClearlyPed && q.specialty !== 'ped') {
        console.log(`[${idx}] SPEC: "${q.specialty}" → "ped" | ${text.substring(0, 80)}...`);
        q.specialty = 'ped';
        fixed++;
    }

    // GYO casos extremos: preguntas sobre el feto/recién nacido pero dentro de 
    // un contexto obstétrico (e.g., reanimación neonatal, incompatibilidad Rh 
    // vista desde el lado materno) — esos deben QUEDARSE en gyo.
    // Solo movemos si el PACIENTE PRINCIPAL es claramente un neonato/pediátrico.
});

console.log(`\n✅ Correcciones realizadas: ${fixed}`);

// Guardar
const newContent = '// questions.js – Banco de reactivos para ENARMlab\nconst QUESTIONS = ' +
    JSON.stringify(questions, null, 2) + ';\n';

fs.writeFileSync(questionsPath, newContent, 'utf8');
console.log(`✅ questions.js actualizado (${questions.length} preguntas).`);
