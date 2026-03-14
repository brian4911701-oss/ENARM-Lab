/**
 * verify_topics.js
 * Verifica la consistencia de specialty y tema en questions.js
 */

const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync(path.join(__dirname, 'questions.js'), 'utf8');
const startIdx = raw.indexOf('[');
const endIdx = raw.lastIndexOf(']') + 1;
const questions = JSON.parse(raw.substring(startIdx, endIdx));

console.log(`\n=== VERIFICACIÓN DE CATEGORÍAS ===`);
console.log(`Total preguntas: ${questions.length}\n`);

// Contar por specialty
const bySpec = {};
questions.forEach(q => {
    const sp = q.specialty || 'undefined';
    bySpec[sp] = (bySpec[sp] || 0) + 1;
});

console.log('📊 Distribución por Especialidad:');
Object.entries(bySpec).sort((a,b) => b[1]-a[1]).forEach(([sp, cnt]) => {
    const names = { mi: 'Medicina Interna', ped: 'Pediatría', gyo: 'Ginecología y Obstetricia', cir: 'Cirugía', sp: 'Salud Pública', urg: 'Urgencias' };
    console.log(`  ${(names[sp] || sp).padEnd(35)} ${cnt} preguntas`);
});

// Detectar inconsistencias: preguntas de gyo con keywords de medicina interna
console.log('\n⚠️  Muestra de temas más frecuentes:');
const byTema = {};
questions.forEach(q => {
    const t = q.tema || 'SIN TEMA';
    byTema[t] = (byTema[t] || 0) + 1;
});
Object.entries(byTema).sort((a,b) => b[1]-a[1]).slice(0, 20).forEach(([t, cnt]) => {
    console.log(`  ${t.padEnd(60)} ${cnt}`);
});

// Preguntas SIN tema
const sinTema = questions.filter(q => !q.tema);
console.log(`\n📌 Preguntas SIN campo tema: ${sinTema.length}`);

// Posibles errores: preguntas de preeclampsia con specialty != gyo
const preeclampsiaWrong = questions.filter(q => {
    const text = (q.case + ' ' + q.question + ' ' + (q.explanation||'')).toLowerCase();
    return (text.includes('preeclampsia') || text.includes('eclampsia')) && q.specialty !== 'gyo';
});
console.log(`\n🔴 Preguntas de preeclampsia/eclampsia con specialty incorrecto: ${preeclampsiaWrong.length}`);
preeclampsiaWrong.forEach(q => console.log(`   [${q.specialty}] ${(q.case||'').substring(0,80)}...`));

// Preguntas de lactantes/neonatos con specialty != ped
const neonatalWrong = questions.filter(q => {
    const text = (q.case || '').toLowerCase();
    return (text.includes('recién nacido') || text.includes('recien nacido') || text.includes('neonato')) && q.specialty !== 'ped';
});
console.log(`\n🔴 Casos neonatales con specialty incorrecto: ${neonatalWrong.length}`);
neonatalWrong.slice(0,5).forEach(q => console.log(`   [${q.specialty}] ${(q.case||'').substring(0,80)}...`));

console.log('\n✅ Verificación completada.');
