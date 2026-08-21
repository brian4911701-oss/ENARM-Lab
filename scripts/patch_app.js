const fs = require('fs');

// Patch app.js
let app = fs.readFileSync('app.js', 'utf8');

const targetApp = `        // Lógica de Resumen de Precisión (Logistics Overview Style)
        const aciertos = State.globalStats.aciertos || 0;
        const respondidas = State.globalStats.respondidas || 0;
        const errores = Math.max(0, respondidas - aciertos);
        // Use accumulated real blank count, fallback to 0
        const omitidas = State.globalStats.totalBlank || 0;
        const totalLogistics = aciertos + errores + omitidas;`;

const replacementApp = `        // Lógica de Resumen de Precisión (Logistics Overview Style)
        let aciertos = State.globalStats.aciertos || 0;
        let respondidas = State.globalStats.respondidas || 0;
        let errores = Math.max(0, respondidas - aciertos);
        let omitidas = State.globalStats.totalBlank || 0;

        const timeframe = window.dashboardOverviewTimeframe || 'all';
        if (timeframe !== 'all') {
            const now = Date.now();
            let limitMs = 0;
            if (timeframe === '7') limitMs = 7 * 24 * 60 * 60 * 1000;
            else if (timeframe === '30') limitMs = 30 * 24 * 60 * 60 * 1000;
            else if (timeframe === 'month') {
                const start = new Date();
                start.setDate(1); start.setHours(0,0,0,0);
                limitMs = now - start.getTime();
            }

            let tAciertos = 0, tRespondidas = 0, tOmitidas = 0;
            const historyList = State.history || [];
            historyList.forEach(h => {
                if (now - h.timestamp <= limitMs) {
                    const hTotal = Number(h.preguntas) || 0;
                    const hBlank = Number(h.blank) || 0;
                    const hCorrect = typeof h.correct === 'number' ? h.correct : Math.round(((Number(h.pct)||0) / 100) * hTotal);
                    tAciertos += hCorrect;
                    tRespondidas += (hTotal - hBlank);
                    tOmitidas += hBlank;
                }
            });
            aciertos = tAciertos;
            respondidas = tRespondidas;
            errores = Math.max(0, respondidas - aciertos);
            omitidas = tOmitidas;
        }

        const totalLogistics = aciertos + errores + omitidas;`;

if (app.includes(targetApp)) {
    app = app.replace(targetApp, replacementApp);
} else {
    // Regex fallback
    const re = /\/\/ Lógica de Resumen de Precisión \(Logistics Overview Style\)[\s\S]*?const totalLogistics = aciertos \+ errores \+ omitidas;/;
    app = app.replace(re, replacementApp);
}

// Add event listener in app.js
if (!app.includes('window.dashboardOverviewTimeframe = ')) {
    const initCode = `
// INIT DROPDOWN TIMEFRAME
window.dashboardOverviewTimeframe = 'all';
document.addEventListener('click', (e) => {
    const btn = e.target.closest('#overview-timeframe-btn');
    const menu = document.getElementById('overview-timeframe-menu');
    if (btn) {
        if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        return;
    }
    
    const menuItem = e.target.closest('.overview-tf-item');
    if (menuItem) {
        window.dashboardOverviewTimeframe = menuItem.getAttribute('data-tf');
        document.getElementById('overview-timeframe-label').textContent = menuItem.textContent;
        if (menu) menu.style.display = 'none';
        if (typeof updateDashboardStats === 'function') updateDashboardStats();
        return;
    }

    if (menu && !e.target.closest('#overview-timeframe-container')) {
        menu.style.display = 'none';
    }
});
`;
    // Attach near the end of the file or just append it
    app += initCode;
}

fs.writeFileSync('app.js', app);
console.log('App patched.');
