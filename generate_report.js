const fs = require('fs');

const temarioRaw = fs.readFileSync('temario_out.txt', 'utf8');
const statsRaw = JSON.parse(fs.readFileSync('stats_cases.json', 'utf8'));

// Parse temario
let currentEspecialidad = '';
const temario = {};

const lines = temarioRaw.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.includes('---Page'));

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === 'Ginecología y Obstetricia' || line === 'Pediatría' || line === 'Cirugía' || line === 'Medicina Interna') {
        currentEspecialidad = line;
        temario[currentEspecialidad] = [];
    } else if (line.match(/^\d+\./)) {
        let fullText = line;
        // The topic might span multiple lines until the next topic or •
        let j = i + 1;
        while (j < lines.length && !lines[j].match(/^\d+\./) && lines[j] !== '•' && !lines[j].match(/^(Ginecología|Pediatría|Cirugía|Medicina)/)) {
            if (lines[j] !== '•') fullText += " " + lines[j];
            j++;
        }

        // Extract tema and subtemas
        let temaName = fullText;
        let subtemas = [];
        const parenMatch = fullText.match(/\((.*?)\)/);
        if (parenMatch) {
            temaName = fullText.substring(0, parenMatch.index).trim();
            subtemas = parenMatch[1].split('/').map(s => s.trim());
        }

        temario[currentEspecialidad].push({
            tema: temaName,
            subtemas: subtemas
        });
    }
}

// Map stats to temario
// We'll do a simple substring check to map a stats key to a syllabus topic
let mappedStats = new Set();
let report = `# Reporte de Casos Clínicos por Tema y Subtema\n\n`;

report += `A continuación se muestra el conteo de casos actuales, cruzados con el temario oficial.\n\n`;

for (const esp in temario) {
    report += `## ${esp}\n\n`;
    for (const t of temario[esp]) {
        // Find matching keys in statsRaw
        let matchingKeys = Object.keys(statsRaw).filter(k =>
            k.toLowerCase().includes(t.tema.replace(/^\d+\.\s*/, '').toLowerCase()) ||
            t.tema.toLowerCase().includes(k.toLowerCase())
        );

        let totalTema = 0;
        let matchedSubtemas = {};

        matchingKeys.forEach(k => {
            mappedStats.add(k);
            totalTema += statsRaw[k].total;
            for (const sub in statsRaw[k].subtemas) {
                if (!matchedSubtemas[sub]) matchedSubtemas[sub] = 0;
                matchedSubtemas[sub] += statsRaw[k].subtemas[sub];
            }
        });

        report += `### ${t.tema} (Casos totales: ${totalTema})\n`;
        if (t.subtemas.length > 0) {
            t.subtemas.forEach(sub => {
                // Find if any matchedSubtemas match this subtema
                let count = 0;
                for (const ms in matchedSubtemas) {
                    if (ms.toLowerCase().includes(sub.toLowerCase()) || sub.toLowerCase().includes(ms.toLowerCase())) {
                        count += matchedSubtemas[ms];
                        delete matchedSubtemas[ms]; // mark as used
                    }
                }
                report += `- **${sub}**: ${count}\n`;
            });
        }

        // Any remaining subtemas or if no subtemas defined but we have data
        for (const ms in matchedSubtemas) {
            if (ms !== 'Sin Subtema') {
                report += `- **${ms}** (No en temario base pero registrado): ${matchedSubtemas[ms]}\n`;
            }
        }

        if (totalTema > 0 && matchedSubtemas['Sin Subtema']) {
            report += `- *Subtemas no especificados (general)*: ${matchedSubtemas['Sin Subtema']}\n`;
        }

        report += `\n`;
    }
}

report += `## Otros Casos (No mapeados correctamente al temario)\n\n`;
for (const k in statsRaw) {
    if (!mappedStats.has(k)) {
        report += `### ${k} (Casos totales: ${statsRaw[k].total})\n`;
        for (const sub in statsRaw[k].subtemas) {
            report += `- **${sub}**: ${statsRaw[k].subtemas[sub]}\n`;
        }
        report += `\n`;
    }
}

fs.writeFileSync('D:\\ENARM Lab\\reporte_casos.md', report);
console.log("Report generated!");
