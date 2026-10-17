'use strict';
// Full app and a delayed local study endpoint. All external traffic is blocked.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const puppeteer = require('puppeteer');
const { createDevServer } = require('./dev_server');
const { applyEvents } = require('../server/study-service');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp-config', 'exam-transition-previews');
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8').replace(/\r\n/g, '\n');
const marker = '\n})();\n\n// INIT DROPDOWN TIMEFRAME';
assert.ok(source.includes(marker));
const instrumented = source.replace(marker, `
    window.__examTest = { State, studySession, getAccountSession, beginExamSession, finishExam, startQuickSession, applyTheme };
${marker}`);
const deferred = () => { let resolve; const promise = new Promise(yes => { resolve = yes; }); return { promise, resolve }; };
const arrived = async gate => {
    let timeout;
    try { await Promise.race([gate.promise, new Promise((_resolve, reject) => { timeout = setTimeout(() => reject(new Error('The expected local study request did not arrive.')), 30000); })]); }
    finally { clearTimeout(timeout); }
};

(async () => {
    let exam, starts = 0, finishes = 0, failFinish = false;
    let startGate = deferred(), finishGate = deferred(), startArrived = deferred(), finishArrived = deferred();
    const server = createDevServer({ handlers: { '/api/study-sync': () => async (request, response) => {
        const body = request.body;
        if (body.action === 'register') return response.json({ registered: true, migrationOpen: false });
        if (body.action === 'start') {
            starts++; startArrived.resolve(); await startGate.promise;
            exam = { id: body.examId, uid: 'transition-fixture', status: 'active', revision: (exam?.revision || 0) + 1,
                questionSet: body.questionSet.map(question => ({ ...question, answerIndex: 0, specialty: 'mi', tema: 'Tema de prueba' })),
                answers: body.questionSet.map(() => ({ selected: null, isCorrect: null, flagged: false })),
                mode: body.mode, currentExamType: body.currentExamType, currentExamIsReal: false, currentIndex: 0,
                reviewQueueItemId: '', challengeId: '', durationSec: 0, elapsedSec: 0, startedAt: Date.now(), runningSince: Date.now(), paused: false, eventHeads: {} };
            return response.json({ exam });
        }
        if (body.action === 'events') {
            applyEvents(exam, body.events, Date.now());
            const { questionSet, ...metadata } = exam;
            return response.json({ exam: metadata });
        }
        if (body.action === 'finish') {
            finishes++; finishArrived.resolve(); await finishGate.promise;
            if (failFinish) return response.status(503).json({ code: 'study-unavailable' });
            applyEvents(exam, body.events, Date.now()); exam.status = 'finished';
            const correct = exam.answers.filter(answer => answer.selected !== null && answer.isCorrect).length;
            const blank = exam.answers.filter(answer => answer.selected === null).length;
            return response.json({ exam, attempt: { id: exam.id, questionSet: exam.questionSet, answers: exam.answers,
                preguntas: exam.questionSet.length, correct, blank, wrong: exam.questionSet.length - correct - blank,
                pct: Math.round(100 * correct / exam.questionSet.length), elapsedSec: 15 } });
        }
        return response.status(400).json({ code: 'unexpected-fixture-action' });
    } } });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    let browser;
    try {
        fs.mkdirSync(output, { recursive: true });
        browser = await puppeteer.launch({ headless: true, pipe: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
        for (const width of [390, 1366]) {
            startGate = deferred(); finishGate = deferred(); startArrived = deferred(); finishArrived = deferred();
            const baseline = starts, page = await browser.newPage(), errors = [];
            await page.bringToFront(); await page.setViewport({ width, height: 900 });
            await page.setBypassServiceWorker(true); await page.setRequestInterception(true);
            page.on('request', request => request.url().startsWith(origin + '/app.js')
                ? request.respond({ status: 200, contentType: 'text/javascript', body: instrumented })
                : request.url().startsWith(origin) ? request.continue() : request.abort());
            page.on('pageerror', error => errors.push(error.message));
            await page.goto(origin, { waitUntil: 'load' });
            await page.evaluate(() => {
                for (const id of ['landing-page', 'auth-overlay', 'app-startup-screen']) document.getElementById(id).style.display = 'none';
                document.body.classList.remove('app-starting'); document.querySelector('.app-layout').style.display = 'flex';
                window.FB = { auth: { currentUser: { uid: 'transition-fixture', emailVerified: true, getIdToken: async () => 'local-fixture' } } };
                window.ENARMAccountSession.create = () => ({ sid: 'fixture-session', stop() {}, check: async () => true });
                __examTest.getAccountSession();
                Object.assign(__examTest.State, { currentUid: 'transition-fixture', isAdminClaim: true, adminPreviewMode: 'premium',
                    authStateResolved: true, entitlementLoaded: true, globalPremiumLoaded: true });
                __examTest.applyTheme('dark');
                window.__start = __examTest.startQuickSession(['mi', 'ped', 'gyo', 'cir'], 3, 'Prueba de transición');
            });
            await arrived(startArrived);
            const visible = () => page.$eval('#exam-loading-overlay', element => element.classList.contains('active'));
            assert.equal(await visible(), true, 'Loading stays up while exam creation awaits the server');
            assert.equal(await page.$eval('#exam-loading-percent', element => element.textContent), 'En proceso');
            assert.equal(await page.$eval('.exam-loading-fill', element => getComputedStyle(element, '::after').animationName), 'examLoadingSweep');
            await page.evaluate(() => { window.__duplicate = __examTest.beginExamSession({ questionSet: [{ question: 'Duplicado', options: ['A', 'B'] }] }); });
            assert.equal(starts, baseline + 1, 'A second click cannot create another cloud exam');
            await page.screenshot({ path: path.join(output, `starting-${width}.png`) });
            startGate.resolve();
            await page.evaluate(() => Promise.all([__start, __duplicate]));
            assert.equal(await visible(), false);
            assert.equal(await page.evaluate(() => __examTest.State.view), 'view-exam');
            assert.ok(await page.$('#questions-container .question-card'));
            assert.equal(await page.evaluate(() => __examTest.beginExamSession({ questionSet: [] })), false);
            assert.equal(await page.evaluate(() => __examTest.State.examActive && __examTest.State.questionSet.length === 3), true,
                'An invalid new selection cannot clear the exam already in progress');

            // A delayed closing request must cover the whole transition, including rendering results.
            await page.evaluate(() => {
                __examTest.studySession.queue({ kind: 'answer', index: 0, selected: 0 });
                window.__finish = __examTest.finishExam();
            });
            await arrived(finishArrived);
            assert.equal(await visible(), true);
            assert.match(await page.$eval('#exam-loading-title', element => element.textContent), /análisis clínico/);
            await page.screenshot({ path: path.join(output, `finishing-${width}.png`) });
            finishGate.resolve(); await page.evaluate(() => __finish);
            assert.equal(await visible(), false);
            assert.equal(await page.evaluate(() => __examTest.State.view), 'view-results');
            assert.equal(await page.$eval('#results-title', element => element.textContent), 'Tu análisis clínico está listo');
            assert.deepEqual(errors, []);
            console.log(`Exam transitions ${width}px: delayed creation/finish covered, duplicate start blocked, complete analysis shown before loading hides: OK`);

            if (width === 390) {
                // A temporary failure leaves the close intent on disk and permits an immediate retry.
                startArrived = deferred(); startGate = deferred();
                await page.evaluate(() => { window.__again = __examTest.startQuickSession(['mi'], 2, 'Reintento'); });
                await arrived(startArrived); startGate.resolve(); await page.evaluate(() => __again);
                failFinish = true; finishArrived = deferred(); finishGate = deferred();
                await page.evaluate(() => { window.__failedFinish = __examTest.finishExam(); });
                await arrived(finishArrived); finishGate.resolve(); await page.evaluate(() => __failedFinish);
                assert.equal(await visible(), false);
                assert.equal(await page.evaluate(() => __examTest.studySession.finishing), true);
                failFinish = false; finishArrived = deferred(); finishGate = deferred();
                await page.evaluate(() => { window.__retryFinish = __examTest.finishExam(); });
                await arrived(finishArrived); assert.equal(await visible(), true);
                finishGate.resolve(); await page.evaluate(() => __retryFinish);
                assert.equal(await page.evaluate(() => __examTest.State.view), 'view-results');
                assert.equal(await page.evaluate(() => __examTest.studySession.finishing), false);
                console.log('Temporary finish failure: answers and close intent preserved, retry returns to confirmed results: OK');
            }
            await page.evaluate(() => __examTest.studySession.stop()); await page.close();
        }
        console.log(`Local endpoint requests: starts=${starts}, finishes=${finishes}. Screenshots: ${output}`);
    } finally {
        startGate.resolve(); finishGate.resolve();
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
