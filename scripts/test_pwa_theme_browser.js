// Verifica el contrato web; no emula la barra de estado nativa de Android.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');

const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
const html = read('index.html');
const app = read('app.js');
const boot = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
const sync = app.slice(app.indexOf('    const syncThemeColorMeta = () => {'), app.indexOf('    function setPricingPanelState'));
const cases = [
    ['ocean', 'theme-ocean', '#1d258d'],
    ['forest', 'theme-forest', '#0a3325'],
    ['light', 'light-mode', '#ffffff'],
    ['default', '', '#111623'],
    ['lilac-light', 'theme-lilac-light', '#fcfaff'],
    ['sunset', 'theme-sunset', '#3d1a3b'],
    ['navy-gold', 'theme-navy-gold', '#102545'],
    ['black-teal', 'theme-black-teal', '#050505'],
    ['premium', 'theme-premium', '#0a0a0a'],
    ['premium-pink', 'theme-premium-pink', '#0a0a0a'],
    ['aurora', 'theme-aurora', '#111623'],
    ['clinical-dark', 'theme-ocean', '#1d258d'],
    ['clinical-light', 'light-mode', '#ffffff'],
    ['ember', 'theme-lilac-light', '#fcfaff'],
    ['black-white', 'theme-lilac-light', '#fcfaff'],
    ['system', 'light-mode', '#ffffff', 'light'],
    ['system', '', '#111623', 'dark'],
    [null, 'theme-ocean', '#1d258d'],
    ['blocked-storage', 'theme-ocean', '#1d258d']
];

(async () => {
    const browser = await puppeteer.launch({ headless: true, pipe: true });
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 412, height: 915, isMobile: true });
        await page.setRequestInterception(true);
        page.on('request', request => request.abort());
        await page.setContent('<html><head>' + html.match(/<meta name="viewport"[^>]*>/)[0] + html.match(/<meta name="theme-color"[^>]*>/)[0] + '</head><body><div class="mobile-top-bar"></div></body></html>');
        await page.addStyleTag({ content: read('styles.css') });
        await page.addScriptTag({ content: sync + '\nwindow.testSyncTheme = syncThemeColorMeta;' });
        for (const [theme, className, expected, scheme = 'dark'] of cases) {
            await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);
            await page.evaluate(theme => {
                Object.defineProperty(window, 'localStorage', { configurable: true, value: {
                    getItem() {
                        if (theme === 'blocked-storage') throw new Error('Storage unavailable');
                        return theme;
                    }
                }});
            }, theme);
            await page.addScriptTag({ content: boot });
            assert.equal(await page.$eval('meta[name="theme-color"]', el => el.content), expected, `Inicio: ${theme}`);
            const result = await page.evaluate(className => {
                const initial = document.querySelector('meta[name="theme-color"]');
                document.body.className = className;
                window.testSyncTheme();
                const meta = document.querySelector('meta[name="theme-color"]');
                const probe = document.createElement('div');
                probe.style.backgroundColor = meta.content;
                document.body.appendChild(probe);
                const result = {
                    color: meta.content,
                    sameNode: initial === meta,
                    count: document.querySelectorAll('meta[name="theme-color"]').length,
                    matchesHeader: getComputedStyle(probe).backgroundColor === getComputedStyle(document.querySelector('.mobile-top-bar')).backgroundColor
                };
                probe.remove();
                return result;
            }, className);
            assert.deepEqual(result, { color: expected, sameNode: true, count: 1, matchesHeader: true }, `Cambio: ${theme}`);
        }
        console.log(`PWA browser theme: OK (${cases.length} casos, inicio y cambios de tema).`);
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
