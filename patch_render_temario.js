/**
 * patch_render_temario.js
 * Reemplaza el bloque renderOfficialTemario en app.js usando índices de línea.
 */

const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'app.js');
const content = fs.readFileSync(appPath, 'utf8');

// Encontrar la función renderOfficialTemario
const startMarker = '    const renderOfficialTemario = (filter = "") => {';
const endMarker = '    window.filterOfficialTemario = () => {';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
    console.log('ERROR: Marcadores no encontrados');
    console.log('startIdx:', startIdx, 'endIdx:', endIdx);
    process.exit(1);
}

const before = content.substring(0, startIdx);
const after = content.substring(endIdx);

const newFunction = `    const renderOfficialTemario = (filter = "") => {
        const cont = $("temario-list");
        if (!cont) return;

        const removeAccentsT = str => str.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
        const normalizedFilter = removeAccentsT(filter);

        // Contar preguntas por tema (usa el campo tema corregido)
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
            cont.innerHTML = \`<div style="text-align:center;padding:40px;color:var(--text-muted);grid-column:1/-1;">
                <div style="font-size:40px;margin-bottom:12px;">&#128269;</div>
                <p>No se encontraron temas para "<strong>\${filter}</strong>".</p>
                <p style="font-size:12px;margin-top:8px;">Intenta con: diabetes, preeclampsia, apendicitis...</p>
            </div>\`;
            return;
        }

        const renderTemarioCard = (tema, isExtra) => {
            const count = temaCountsT[tema] || 0;
            const countBadge = count > 0
                ? \`<span style="font-size:11px;color:var(--accent-green);font-weight:700;background:rgba(5,192,127,0.1);padding:2px 8px;border-radius:20px;margin-left:6px;">\${count} preg.</span>\`
                : '';
            const extraBadge = isExtra
                ? \`<span style="font-size:10px;color:var(--accent-blue);font-weight:600;background:rgba(59,130,246,0.1);padding:1px 6px;border-radius:12px;margin-left:6px;">banco</span>\`
                : '';
            const safeT = tema.replace(/\\\\/g,'\\\\\\\\').replace(/'/g,"\\\\'");
            return \`<div class="list-item" style="padding:14px 16px;background:rgba(255,255,255,0.02);border:1px solid var(--border);cursor:pointer;transition:border-color 0.2s,background 0.2s;"
                onclick="document.getElementById('nav-new-exam').click();setTimeout(()=>{const i=document.getElementById('setup-topic-filter');if(i){i.value='\${safeT}';i.dispatchEvent(new Event('input'));}},300);"
                onmouseover="this.style.borderColor='var(--accent-green)';this.style.background='rgba(5,192,127,0.03)';"
                onmouseout="this.style.borderColor='var(--border)';this.style.background='rgba(255,255,255,0.02)';">
                <div class="list-item-content" style="width:100%;">
                    <div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;">
                        <h3 style="font-size:13px;margin-bottom:0;line-height:1.3;">\${tema}</h3>
                        \${countBadge}\${extraBadge}
                    </div>
                    \${count > 0 ? '<p style="font-size:11px;color:var(--text-muted);margin-top:4px;">Toca para agregar al simulacro &#8594;</p>' : ''}
                </div>
            </div>\`;
        };

        cont.innerHTML = [
            ...filtered.map(t => renderTemarioCard(t, false)),
            ...extraTopics.map(t => renderTemarioCard(t, true))
        ].join("");
    };

`;

const newContent = before + newFunction + after;

fs.writeFileSync(appPath, newContent, 'utf8');
console.log('✅ renderOfficialTemario actualizado exitosamente.');
console.log('  Inicio:', startIdx, '→ Fin inserción:', before.length + newFunction.length);
