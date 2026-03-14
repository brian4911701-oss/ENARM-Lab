/**
 * final_test.js
 * Test final: verifica que preeclampsia, artritis, etc. tienen specialty correcto
 */

// Simular el entorno del navegador mínimamente
global.QUESTIONS = [];
require('./questions.js');
// questions.js define QUESTIONS globalmente, lo asignamos
if (typeof QUESTIONS === 'undefined') {
    eval(require('fs').readFileSync('./questions.js', 'utf8'));
}

const Q = global.QUESTIONS || QUESTIONS;

console.log(`\n=== TEST FINAL DE CATEGORÍAS ===`);
console.log(`Total preguntas: ${Q.length}\n`);

// Test 1: Preeclampsia → debe ser gyo
const preecl = Q.filter(q => {
    const t = ((q.case||'') + ' ' + (q.question||'')).toLowerCase();
    return t.includes('preeclampsia') || t.includes('eclampsia');
});
const preeclWrong = preecl.filter(q => q.specialty !== 'gyo');
console.log(`✅ Preeclampsia/eclampsia: ${preecl.length} total → ${preeclWrong.length} con specialty incorrecto`);

// Test 2: Artritis reumatoide → debe ser mi
const ar = Q.filter(q => {
    const t = ((q.case||'') + ' ' + (q.question||'')).toLowerCase();
    return t.includes('artritis reumatoide') || t.includes('metotrexato') && t.includes('artritis');
});
const arWrong = ar.filter(q => q.specialty !== 'mi');
console.log(`✅ Artritis Reumatoide: ${ar.length} total → ${arWrong.length} con specialty incorrecto`);

// Test 3: Bronquiolitis → debe ser ped
const bronq = Q.filter(q => {
    const t = ((q.case||'') + ' ' + (q.question||'')).toLowerCase();
    return t.includes('bronquiolitis');
});
const bronqWrong = bronq.filter(q => q.specialty !== 'ped');
console.log(`✅ Bronquiolitis: ${bronq.length} total → ${bronqWrong.length} con specialty incorrecto`);

// Test 4: Apendicitis → debe ser cir
const apend = Q.filter(q => {
    const t = ((q.case||'') + ' ' + (q.question||'')).toLowerCase();
    return t.includes('apendicitis');
});
const apendWrong = apend.filter(q => q.specialty !== 'cir');
console.log(`✅ Apendicitis: ${apend.length} total → ${apendWrong.length} con specialty incorrecto`);

// Test 5: Temas más frecuentes
const byTema = {};
Q.forEach(q => {
    const t = q.tema || 'SIN TEMA';
    byTema[t] = (byTema[t] || 0) + 1;
});
console.log(`\n📊 Top 10 temas por cantidad de preguntas:`);
Object.entries(byTema).sort((a,b) => b[1]-a[1]).slice(0, 10).forEach(([t, c]) => {
    console.log(`   ${t.substring(0,50).padEnd(52)} ${c}`);
});

// Test 6: Distribución specialty
const bySpec = {};
Q.forEach(q => { bySpec[q.specialty||'?'] = (bySpec[q.specialty||'?'] || 0) + 1; });
console.log(`\n📊 Distribución por Specialty:`);
Object.entries(bySpec).sort((a,b) => b[1]-a[1]).forEach(([sp, c]) => {
    const names = {mi:'Medicina Interna',ped:'Pediatría',gyo:'Ginecología',cir:'Cirugía',sp:'Salud Pública',urg:'Urgencias'};
    console.log(`   ${(names[sp]||sp).padEnd(22)} ${c}`);
});

console.log('\n✅ Test completado.');
