const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = `<div
                                style="background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 20px; font-size: 11px; color: var(--text-secondary); cursor: pointer; border: 1px solid var(--border);">
                                Histórico <span style="font-size:8px; margin-left:4px;">▼</span>
                            </div>`;

const replacement = `<div style="position: relative;" id="overview-timeframe-container">
                                <div id="overview-timeframe-btn"
                                    style="background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 20px; font-size: 11px; color: var(--text-secondary); cursor: pointer; border: 1px solid var(--border); display: flex; align-items: center; gap: 6px;">
                                    <span id="overview-timeframe-label">Histórico</span> <span style="font-size:8px;">▼</span>
                                </div>
                                <div id="overview-timeframe-menu" class="dropdown-menu" style="display: none; position: absolute; right: 0; top: 100%; margin-top: 8px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 6px 0; min-width: 140px; z-index: 50; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                                    <div class="dropdown-item overview-tf-item" data-tf="all" style="padding: 8px 16px; font-size: 12px; cursor: pointer; color: var(--text-primary);">Histórico</div>
                                    <div class="dropdown-item overview-tf-item" data-tf="7" style="padding: 8px 16px; font-size: 12px; cursor: pointer; color: var(--text-primary);">Últimos 7 días</div>
                                    <div class="dropdown-item overview-tf-item" data-tf="30" style="padding: 8px 16px; font-size: 12px; cursor: pointer; color: var(--text-primary);">Últimos 30 días</div>
                                    <div class="dropdown-item overview-tf-item" data-tf="month" style="padding: 8px 16px; font-size: 12px; cursor: pointer; color: var(--text-primary);">Este mes</div>
                                </div>
                            </div>`;

if (html.includes(targetStr)) {
    fs.writeFileSync('index.html', html.replace(targetStr, replacement));
    console.log("Success exact");
} else {
    // Regex replace ignoring whitespaces
    const regex = /<div\s+style="background: rgba\(255,255,255,0\.05\); padding: 4px 12px; border-radius: 20px; font-size: 11px; color: var\(--text-secondary\); cursor: pointer; border: 1px solid var\(--border\);">\s+Histórico <span style="font-size:8px; margin-left:4px;">▼<\/span>\s+<\/div>/;
    if (regex.test(html)) {
        fs.writeFileSync('index.html', html.replace(regex, replacement));
        console.log("Success regex");
    } else {
        console.log("Not found");
    }
}
