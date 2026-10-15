// Uses real browser localStorage across closed pages and the actual app helpers.
// Firebase reads/writes are simulated; no user account or production data is touched.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const puppeteer = require('puppeteer');
const fixture = require('./test_progress_persistence');
const root = path.resolve(__dirname, '..', 'public');

const harness = options => `(() => {
    const user = ${JSON.stringify(fixture.user)};
    const oldStats = ${JSON.stringify(fixture.oldStats)};
    const remote = ${JSON.stringify(fixture.remote)};
    const snapshot = ${fixture.snapshot.toString()};
    const sync = globalThis.ENARMProgressSync;
    const { create, compactHistory } = sync;
    const createTestCloud = ${fixture.createTestCloud.toString()};
    const runtime = (${fixture.createRuntime.toString()})(localStorage, ${JSON.stringify(options)});
    const code = ${JSON.stringify(fixture.helpers + fixture.save + fixture.restore + fixture.debounce + '\nreturn { saveGlobalStats, restoreAuthenticatedProgress, debouncedSave, progressOutbox };')};
    runtime.api = Function(...Object.keys(runtime.context), code)(...Object.values(runtime.context));
    runtime.api.progressOutbox.begin(user.uid, Function(...Object.keys(runtime.context), ${JSON.stringify(fixture.save + '\nreturn capturePrivateProgress();')})(...Object.values(runtime.context)));
    globalThis.runtime = runtime;
})();`;

(async () => {
    const server = http.createServer((request, response) => {
        const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        if (pathname === '/persistence-test') {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end('<!doctype html><html><head><title>Persistence test</title></head><body></body></html>');
            return;
        }
        const target = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
        if (!target.startsWith(root + path.sep) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
            response.writeHead(404); response.end(); return;
        }
        const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
        response.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream' });
        fs.createReadStream(target).pipe(response);
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    let browser;
    try {
        const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || [
            'C:/Program Files/Google/Chrome/Application/chrome.exe',
            'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
        ].find(candidate => fs.existsSync(candidate));
        browser = await puppeteer.launch({ headless: true, pipe: true, ...(executablePath ? { executablePath } : {}) });
        const pageFor = async options => {
            const page = await browser.newPage();
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.setViewport({ width: 412, height: 915, isMobile: true });
            await page.goto(origin + '/persistence-test');
            await page.addScriptTag({ content: fs.readFileSync(path.resolve(__dirname, '..', 'streak-core.js'), 'utf8') });
            await page.addScriptTag({ content: fs.readFileSync(path.resolve(__dirname, '..', 'progress-sync.js'), 'utf8') });
            await page.addScriptTag({ content: harness(options) });
            assert.deepEqual(errors, [], 'Persistence harness must initialize');
            return page;
        };
        const first = await pageFor({ writeFails: true });
        await first.evaluate(stats => {
            Object.assign(runtime.State, { globalStats: stats, theme: 'forest', history: [{ timestamp: Date.now(), preguntas: 10, blank: 0 }], studyCalendar: { '2026-10-15': { practiced: true } } });
            runtime.api.debouncedSave();
        }, fixture.newStats);
        assert.equal(await first.evaluate(() => runtime.writes.length), 0);
        await first.close();

        const reopened = await pageFor({});
        await reopened.evaluate(async user => {
            runtime.State.progressRestoreReady = false;
            await runtime.api.restoreAuthenticatedProgress(user);
        }, fixture.user);
        await reopened.waitForFunction(() => runtime.api.progressOutbox.read('account-a')?.pending === false);
        const result = await reopened.evaluate(() => ({
            sessions: runtime.State.globalStats.sesiones, history: runtime.State.history.length,
            streak: runtime.State.globalStats.streakData.currentStreak,
            practiced: runtime.State.studyCalendar['2026-10-15'].practiced,
            theme: runtime.State.theme, storedTheme: localStorage.getItem('enarm_theme'),
            createdAtChanged: 'createdAt' in runtime.writes[0]
        }));
        assert.deepEqual(result, { sessions: 3, history: 1, streak: 3, practiced: true, theme: 'forest', storedTheme: 'forest', createdAtChanged: false });
        await reopened.close();

        // Also load the whole built app with external services blocked. Premium
        // listeners are unresolved: this previously erased a stored forest theme.
        const appPage = await browser.newPage();
        await appPage.setViewport({ width: 412, height: 915, isMobile: true });
        await appPage.setRequestInterception(true);
        appPage.on('request', request => request.url().startsWith(origin) ? request.continue() : request.abort());
        const errors = [];
        appPage.on('pageerror', error => errors.push(error.message));
        await appPage.goto(origin, { waitUntil: 'load' });
        await appPage.waitForFunction(() => document.body.classList.contains('theme-forest'));
        assert.equal(await appPage.evaluate(() => localStorage.getItem('enarm_theme')), 'forest');
        await appPage.reload({ waitUntil: 'load' });
        await appPage.waitForFunction(() => document.body.classList.contains('theme-forest'));
        assert.equal(await appPage.evaluate(() => localStorage.getItem('enarm_theme')), 'forest');
        assert.deepEqual(errors, [], 'Full app startup must have no uncaught JavaScript errors');
        console.log('Mobile browser: page close/reopen preserves exam/history/streak/theme; built app preserves theme over reload with unresolved Premium permissions. No uncaught startup errors.');
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
