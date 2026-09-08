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
        await page.addScriptTag({ content: sync + '\nwindow.testSyncTheme = syncThemeColorMeta; window.testThemeDiagnostics = getThemeDiagnostics;' });
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
            const diagnostics = await page.evaluate(() => window.testThemeDiagnostics());
            assert.equal(diagnostics.cssThemeColor, expected);
            assert.deepEqual(diagnostics.metaColors, [{ color: expected, media: '' }]);
            assert.equal(diagnostics.revision, 'theme-diagnostics-1');
        }
        // Usa el encabezado real y áreas seguras emuladas, no una fórmula duplicada en CSS.
        const headerHtml = html.match(/<header class="mobile-top-bar">[\s\S]*?<\/header>/)[0];
        await page.$eval('.mobile-top-bar', (element, markup) => { element.outerHTML = markup; }, headerHtml);
        await page.$eval('#nav-admin-mobile', element => { element.style.display = 'flex'; });
        const cdp = await page.createCDPSession();
        for (const inset of [0, 24, 48]) {
            await cdp.send('Emulation.setSafeAreaInsetsOverride', { insets: { top: inset } });
            const positions = await page.evaluate(() => {
                const rect = selector => {
                    const bounds = document.querySelector(selector).getBoundingClientRect();
                    return { center: bounds.top + bounds.height / 2, top: bounds.top };
                };
                return {
                    logo: rect('.mobile-top-bar .sidebar-logo'),
                    actions: rect('.mobile-top-bar .user-actions'),
                    admin: rect('#nav-admin-mobile')
                };
            });
            for (const [name, position] of Object.entries(positions)) {
                assert.ok(Math.abs(position.center - (inset + 30)) < 1, `${name}: centro con inset ${inset}`);
                assert.ok(position.top >= inset, `${name}: fuera del área del reloj`);
            }
        }
        await cdp.detach();
        console.log(`PWA browser theme: OK (${cases.length} casos; encabezado alineado con insets 0, 24 y 48px).`);
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
