/**
 * patch_app.js
 * Aplica mejoras al app.js:
 * 1. renderOfficialTemario: muestra conteo de preguntas por tema
 * 2. filtrado de examen: prioriza campo tema
 */

const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'app.js');
let content = fs.readFileSync(appPath, 'utf8');

// =====================================================================
// PATCH 1: Mejorar renderOfficialTemario para mostrar conteo de preguntas
// =====================================================================
const oldRender = `        const normalizedFilter = filter.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
        const filtered = OFFICIAL_TEMARIO.filter(t => {
            const normalizedTopic = t.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
            return normalizedTopic.includes(normalizedFilter);
        });

        cont.innerHTML = filtered.map(tema => \`
            <div class="list-item" style="padding: 15px; background: rgba(255,255,255,0.02); border: 1px solid var(--border);">
                <div class="list-item-content">
                    <h3 style="font-size: 14px; margin-bottom: 0;">\${tema}</h3>
                </div>
            </div>
        \`).join("");`;

const newRender = `        const removeAccentsT = str => str.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
        const normalizedFilter = removeAccentsT(filter);

        // Contar preguntas por tema
        const temaCountsT = {};
        if (typeof QUESTIONS !== 'undefined') {
            QUESTIONS.forEach(q => { if (q.tema) temaCountsT[q.tema] = (temaCountsT[q.tema] || 0) + 1; });
        }

        // Filtrar temario oficial
        const filtered = OFFICIAL_TEMARIO.filter(t => {
            return !normalizedFilter || removeAccentsT(t).includes(normalizedFilter);
        });

        // También buscar en temas reales del banco si hay filtro
        let extraTopics = [];
        if (normalizedFilter && typeof QUESTIONS !== 'undefined') {
            const allRealTemas = [...new Set(QUESTIONS.map(q => q.tema).filter(Boolean))];
            extraTopics = allRealTemas.filter(t =>
                removeAccentsT(t).includes(normalizedFilter) && !filtered.includes(t)
            ).slice(0, 10);
        }

        if (filtered.length === 0 && extraTopics.length === 0) {
            cont.innerHTML = \`<div style="text-align:center; padding:40px; color:var(--text-muted); grid-column: 1/-1;">
                <div style="font-size:40px; margin-bottom:12px;">🔍</div>
                <p>No se encontraron temas para "<strong>\${filter}</strong>".</p>
                <p style="font-size:12px; margin-top:8px;">Intenta con términos como: diabetes, preeclampsia, pediatría...</p>
            </div>\`;
            return;
        }

        const renderTemarioCard = (tema, isExtra) => {
            const count = temaCountsT[tema] || 0;
            const countBadge = count > 0
                ? \`<span style="font-size:11px;color:var(--accent-green);font-weight:700;background:rgba(5,192,127,0.1);padding:2px 8px;border-radius:20px;margin-left:8px;">\${count} preg.</span>\`
                : '';
            const extraBadge = isExtra
                ? \`<span style="font-size:10px;color:var(--accent-blue);font-weight:600;background:rgba(59,130,246,0.1);padding:1px 6px;border-radius:12px;margin-left:6px;">banco</span>\`
                : '';
            const safeT = tema.replace(/'/g, "\\'");
            return \`<div class="list-item" style="padding:14px 16px;background:rgba(255,255,255,0.02);border:1px solid var(--border);cursor:pointer;transition:border-color 0.2s,background 0.2s;"
                onclick="document.getElementById('nav-new-exam').click();setTimeout(()=>{const i=document.getElementById('setup-topic-filter');if(i){i.value='\${safeT}';i.dispatchEvent(new Event('input'));}},300);"
                onmouseover="this.style.borderColor='var(--accent-green)';this.style.background='rgba(5,192,127,0.03)';"
                onmouseout="this.style.borderColor='var(--border)';this.style.background='rgba(255,255,255,0.02)';">
                <div class="list-item-content" style="width:100%;">
                    <div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;">
                        <h3 style="font-size:13px;margin-bottom:0;line-height:1.3;">\${tema}</h3>
                        \${countBadge}\${extraBadge}
                    </div>
                    \${count > 0 ? '<p style="font-size:11px;color:var(--text-muted);margin-top:4px;">Toca para agregar al simulacro →</p>' : ''}
                </div>
            </div>\`;
        };

        cont.innerHTML = [
            ...filtered.map(t => renderTemarioCard(t, false)),
            ...extraTopics.map(t => renderTemarioCard(t, true))
        ].join("");`;

if (content.includes(oldRender)) {
    content = content.replace(oldRender, newRender);
    console.log('✅ PATCH 1 aplicado: renderOfficialTemario mejorado');
} else {
    console.log('⚠️  PATCH 1: No se encontró el código original (puede ya estar aplicado o hay diferencias de formato)');
    // Mostrar lo que hay en esas líneas
    const idx = content.indexOf('const renderOfficialTemario');
    if (idx >= 0) {
        console.log('Fragmento actual:\n', content.substring(idx, idx + 500));
    }
}

// =====================================================================
// PATCH 2: Mejorar filtrado en initSetupLogic para priorizar q.tema
// =====================================================================
const oldFilter = `                    pool = pool.filter(q => {
                        const qText = \`\${q.tema || ""} \${q.subtema || ""} \${q.case || ""} \${q.question || ""} \${q.gpcReference || ""}\`.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
                        return expandedTopics.some(topic => {
                            const normTopic = topic.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
                            return qText.includes(normTopic);
                        });
                    });
                }

                // Filtrado por Dificultad`;

const newFilter = `                    pool = pool.filter(q => {
                        // Búsqueda prioritaria en campo tema (más preciso)
                        const qTema = (q.tema || "").toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
                        // Búsqueda en texto completo como respaldo
                        const qText = \`\${q.tema || ""} \${q.subtema || ""} \${q.case || ""} \${q.question || ""} \${q.gpcReference || ""}\`.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
                        return expandedTopics.some(topic => {
                            const normTopic = topic.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
                            return qTema.includes(normTopic) || qText.includes(normTopic);
                        });
                    });
                }

                // Filtrado por Dificultad`;

if (content.includes(oldFilter)) {
    content = content.replace(oldFilter, newFilter);
    console.log('✅ PATCH 2 aplicado: filtrado mejorado en initSetupLogic');
} else {
    console.log('⚠️  PATCH 2: No se encontró el código original en initSetupLogic');
}

// Guardar
fs.writeFileSync(appPath, content, 'utf8');
console.log('\n✅ app.js actualizado exitosamente.');
