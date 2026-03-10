const fs = require('fs');

const reportText = fs.readFileSync('D:\\ENARM Lab\\reporte_casos.md', 'utf8');
const lines = reportText.split('\n');

let missing = [];
let few = [];
let currentEsp = '';
let totalAvailable = 0;
let totalRecommended = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('## ')) {
        currentEsp = line.replace('## ', '');
    } else if (line.startsWith('### ')) {
        // e.g. ### 01. Amenorreas Primarias y Secundarias (Casos totales: 1)
        const match = line.match(/###\s+(.*?)\s+\(Casos totales:\s+(\d+)\)/);
        if (match) {
            const topic = match[1];
            const count = parseInt(match[2], 10);
            totalAvailable += count;

            let recommended = 0;
            // simple heuristic based on clinical importance
            const topicL = topic.toLowerCase();
            if (topicL.includes('atls') || topicL.includes('diabetes') || topicL.includes('hipertens') || topicL.includes('infarto') || topicL.includes('trabajo de parto') || topicL.includes('hemorragia') || topicL.includes('neumon') || topicL.includes('asma') || topicL.includes('pedi')) {
                recommended = 15;
            } else if (topicL.includes('cáncer') || topicL.includes('ca de') || topicL.includes('oncolog') || topicL.includes('tumor') || topicL.includes('infecci') || topicL.includes('neonat') || topicL.includes('vacun') || topicL.includes('trauma') || topicL.includes('urgencia')) {
                recommended = 10;
            } else {
                recommended = 5;
            }

            totalRecommended += recommended;

            if (count === 0) {
                missing.push({ esp: currentEsp, topic, recommended });
            } else if (count < recommended) {
                few.push({ esp: currentEsp, topic, count, recommended, needed: recommended - count });
            }
        }
    }
}

let out = `# Informe de Casos Faltantes y Recomendados para Completar la App\n\n`;
out += `**Situación Actual:**\n`;
out += `- Total de casos en la base de datos mapeados o registrados: ${totalAvailable}\n`;
out += `- Total de casos mínimos recomendados para que la aplicación sea robusta: **${totalRecommended}**\n\n`;
out += `A continuación se desglosan los temas donde **no hay ningún caso** cargado, así como aquellos donde hay **muy pocos casos** en proporción a la recomendación estimada.\n\n`;

out += `## 🚨 Temas Faltantes (0 casos actualmente)\n`;
out += `*Estos temas necesitan ser cubiertos prioritariamente.*\n\n`;

let lastEsp = '';
missing.forEach(m => {
    if (m.esp !== lastEsp) {
        out += `### ${m.esp}\n`;
        lastEsp = m.esp;
    }
    out += `- **${m.topic}** (Recomendados: ${m.recommended} casos)\n`;
});

out += `\n## ⚠️ Temas con Muy Pocos Casos\n`;
out += `*Existen algunos casos, pero no son suficientes para una preparación completa.*\n\n`;

lastEsp = '';
few.forEach(f => {
    if (f.esp !== lastEsp) {
        out += `### ${f.esp}\n`;
        lastEsp = f.esp;
    }
    out += `- **${f.topic}**: Tienes ${f.count}. (Faltan: **${f.needed}** para llegar a los ${f.recommended} recomendados)\n`;
});

out += `\n## 💡 Conclusión y Recomendación\n`;
out += `Para que la aplicación se considere un banco de preguntas **completo y competitivo** para el ENARM, se requiere la creación de **aproximadamente ${totalRecommended - totalAvailable} casos clínicos nuevos**, enfocándose primeramente en la sección de **Medicina Interna** y completando los huecos importantes en **Pediatría**, **Ginecología** y las subespecialidades de **Cirugía**.\n`;

fs.writeFileSync('C:\\Users\\brian\\.gemini\\antigravity\\brain\\de17825b-1d3f-461c-8878-c0444a1420d4\\informe_faltantes.md', out);
console.log("Informe faltantes generated!");
