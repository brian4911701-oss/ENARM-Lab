'use strict';
// Exercise real navigation buttons, changing case heights and cloud re-renders.
// External requests are blocked and the study endpoint is an isolated fixture.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');
const { createDevServer } = require('./dev_server');
const { applyEvents } = require('../server/study-service');
const root = path.resolve(__dirname, '..');
const marker = '\n})();\n\n// INIT DROPDOWN TIMEFRAME';
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8').replace(/\r\n/g, '\n');
assert.ok(source.includes(marker));
const instrumented = source.replace(marker, `
    window.__navigationTest = { State, studySession, getAccountSession, beginExamSession };
${marker}`);
const questions = [0, 0, 1, 2, 2, 2, 3, 4, 5].map((group, index) => ({
    caseGroupId: group,
    case: `Caso ${group + 1}.\n` + 'Texto de prueba para comprobar el comienzo del caso clínico.\n'.repeat([45, 1, 25, 1, 35, 1][group]),
    question: `Reactivo de prueba ${index + 1}`,
    options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
    answerIndex: 0, specialty: 'mi', tema: 'Navegación de prueba',
    explanation: 'Retroalimentación de prueba. '.repeat(35)
}));

(async () => {
    let exam;
    const server = createDevServer({ handlers: { '/api/study-sync': () => async (request, response) => {
        const body = request.body;
        if (body.action === 'register') return response.json({ registered: true, migrationOpen: false });
        if (body.action === 'start') {
            exam = { id: body.examId, status: 'active', revision: 1,
                questionSet: body.questionSet.map(question => ({ ...question, case: question.caseOriginal,
                    answerIndex: 0, specialty: 'mi', tema: 'Navegación de prueba', explanation: questions[0].explanation })),
                answers: body.questionSet.map(() => ({ selected: null, isCorrect: null, flagged: false })),
                mode: body.mode, currentExamType: body.currentExamType, currentIndex: 0, currentExamIsReal: false,
                durationSec: 0, elapsedSec: 0, runningSince: Date.now(), paused: false, eventHeads: {} };
            return response.json({ exam });
        }
        if (body.action === 'events') {
            await new Promise(resolve => setTimeout(resolve, 70));
            applyEvents(exam, body.events, Date.now());
            return response.json({ exam });
        }
        return response.status(400).json({ code: 'unexpected-fixture-action' });
    } } });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true, pipe: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
        for (const { width, guest, mode } of [
            { width: 320, mode: 'simulacro' }, { width: 390, mode: 'estudio' },
            { width: 768, mode: 'simulacro' }, { width: 1024, mode: 'estudio' },
            { width: 1366, mode: 'simulacro' }, { width: 390, guest: true, mode: 'estudio' }
        ]) {
            const page = await browser.newPage();
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.setViewport({ width, height: 900, isMobile: width <= 768 });
            await page.setBypassServiceWorker(true);
            await page.setRequestInterception(true);
            page.on('request', request => request.url().startsWith(origin + '/app.js')
                ? request.respond({ status: 200, contentType: 'text/javascript', body: instrumented })
                : request.url().startsWith(origin) ? request.continue() : request.abort());
            await page.goto(origin, { waitUntil: 'load' });
            await page.evaluate(async ({ questions, guest, mode }) => {
                for (const id of ['landing-page', 'auth-overlay', 'app-startup-screen']) document.getElementById(id).style.display = 'none';
                document.body.classList.remove('app-starting');
                document.querySelector('.app-layout').style.display = 'flex';
                window.FB = { auth: { currentUser: { uid: 'navigation-fixture', emailVerified: true, getIdToken: async () => 'local-fixture' } } };
                window.ENARMAccountSession.create = () => ({ sid: 'fixture-session', stop() {} });
                const api = __navigationTest;
                api.getAccountSession();
                Object.assign(api.State, { currentUid: 'navigation-fixture', authStateResolved: true,
                    entitlementLoaded: true, globalPremiumLoaded: true });
                await api.beginExamSession({ questionSet: questions, guest: !!guest, mode, currentExamType: 'Navegación de prueba' });
                await Promise.all(document.getElementById('view-exam').getAnimations()
                    .filter(animation => animation.effect.getComputedTiming().iterations !== Infinity)
                    .map(animation => animation.finished.catch(() => {})));
            }, { questions, guest, mode });

            const assertCaseVisible = async label => {
                // Check promptly: a smooth scroll must not leave the case offscreen.
                await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
                const position = await page.evaluate(() => {
                    const card = document.querySelector('#view-exam .case-card');
                    const content = card.closest('.main-content');
                    const header = document.querySelector('#view-exam .exam-header-bar');
                    const topBar = document.querySelector('.mobile-top-bar');
                    const cardRect = card.getBoundingClientRect();
                    const viewportTop = content.getBoundingClientRect().top;
                    const obstacles = [viewportTop];
                    if (topBar.getBoundingClientRect().height) obstacles.push(topBar.getBoundingClientRect().bottom);
                    if (['sticky', 'fixed'].includes(getComputedStyle(header).position)) obstacles.push(header.getBoundingClientRect().bottom);
                    return { top: cardRect.top, visibleTop: Math.max(...obstacles),
                        nearBottom: content.scrollTop >= content.scrollHeight - content.clientHeight - 2,
                        viewportBottom: Math.min(innerHeight, content.getBoundingClientRect().bottom) };
                });
                assert.ok(position.top >= position.visibleTop + 14, `${label}: case hidden behind a bar: ${JSON.stringify(position)}`);
                assert.ok(position.top < position.viewportBottom * .6, `${label}: start of case stays offscreen: ${JSON.stringify(position)}`);
                if (!position.nearBottom) assert.ok(position.top <= position.visibleTop + 18, `${label}: case not aligned: ${JSON.stringify(position)}`);
            };
            for (const index of [2, 3, 6, 7, 8]) {
                if (mode === 'estudio') {
                    await page.click('#questions-container .option-btn');
                    if (!guest) await page.evaluate(() => __navigationTest.studySession.flush());
                }
                // Include an in-flight scroll, as with mobile momentum or a rapid tap.
                await page.$eval('#btn-next', button => button.scrollIntoView({ behavior: 'instant', block: 'center' }));
                await page.$eval('.main-content', content => content.scrollTo({ top: content.scrollHeight, behavior: 'smooth' }));
                // Dispatch an actual DOM click without Puppeteer scrolling the button again.
                await page.$eval('#btn-next', button => button.click());
                assert.equal(await page.evaluate(() => __navigationTest.State.currentIndex), index);
                await assertCaseVisible(`${width}px ${mode}: next ${index}`);
                if (!guest) await page.evaluate(() => __navigationTest.studySession.flush());
                await assertCaseVisible(`${width}px ${mode}: cloud confirmation ${index}`);
            }
            await page.click('#btn-prev');
            assert.equal(await page.evaluate(() => __navigationTest.State.currentIndex), 7);
            await assertCaseVisible(`${width}px: previous`);
            if (!guest) await page.evaluate(() => __navigationTest.studySession.flush());
            await page.$eval('#question-navigator .nav-dot', button => button.click());
            assert.equal(await page.evaluate(() => __navigationTest.State.currentIndex), 0);
            await assertCaseVisible(`${width}px: question map`);
            if (!guest) await page.evaluate(() => __navigationTest.studySession.flush());
            await page.$eval('#btn-next', button => { button.click(); button.click(); });
            assert.equal(await page.evaluate(() => __navigationTest.State.currentIndex), 3);
            await assertCaseVisible(`${width}px: rapid next clicks`);
            if (!guest) await page.evaluate(() => __navigationTest.studySession.flush());
            await assertCaseVisible(`${width}px: rapid navigation confirmation`);
            assert.deepEqual(errors, []);
            await page.evaluate(() => __navigationTest.studySession.stop());
            await page.close();
            console.log(`${width}px ${guest ? 'guest' : 'account'} ${mode}: next/previous/map, grouped cases, feedback, interrupted scroll and cloud confirmation OK`);
        }
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
