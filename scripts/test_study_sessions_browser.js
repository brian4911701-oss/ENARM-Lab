'use strict';
// Real application, Auth/Firestore emulators, real server transactions and two
// isolated Chrome contexts. No production account or production data is used.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const admin = require('firebase-admin');
const puppeteer = require('puppeteer');
const { initializeTestEnvironment } = require('@firebase/rules-unit-testing');
const { createStudyService } = require('../server/study-service');
const projectId = 'enarmax-rules-test';
const root = path.resolve(__dirname, '..');
(async () => {
    assert.ok(process.env.FIREBASE_AUTH_EMULATOR_HOST && process.env.FIRESTORE_EMULATOR_HOST, 'This test requires both emulators and never uses production credentials.');
    const env = await initializeTestEnvironment({ projectId, firestore: { rules: fs.readFileSync(path.join(root, 'firestore.rules'), 'utf8') } });
    const app = admin.initializeApp({ projectId });
    const db = app.firestore();
    const auth = app.auth();
    let browser;
    const uid = 'browser-student';
    const execute = createStudyService(db);
    await env.clearFirestore();
    try { await auth.deleteUser(uid); } catch { /* Test account may not exist. */ }
    await auth.createUser({ uid, email: 'browser-student@example.test', emailVerified: true, displayName: 'Estudiante de prueba' });
    const customToken = await auth.createCustomToken(uid);
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
        .replace('projectId: "enarm-lab-social"', `projectId: "${projectId}"`)
        .replace('import { getAuth, ', 'import { connectAuthEmulator, signInWithCustomToken, getAuth, ')
        .replace('import { getFirestore, ', 'import { connectFirestoreEmulator, getFirestore, ')
        .replace('const auth = getAuth(app);', "const auth = getAuth(app); connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });")
        .replace('const db = getFirestore(app);', "const db = getFirestore(app); connectFirestoreEmulator(db, '127.0.0.1', 8080);")
        .replace('const functions = getFunctions(app);', `
            await signInWithCustomToken(auth, ${JSON.stringify(customToken)});
            const functions = getFunctions(app);`);
    const server = http.createServer(async (request, response) => {
        try {
            const pathname = new URL(request.url, 'http://localhost').pathname;
            if (pathname === '/api/study-sync') {
                let body = ''; for await (const chunk of request) body += chunk;
                const token = String(request.headers.authorization || '').replace(/^Bearer /, '');
                const claims = await auth.verifyIdToken(token);
                const result = await execute(claims.uid, JSON.parse(body));
                const submitted = JSON.parse(body);
                if (['start', 'claim'].includes(submitted.action)) console.log('Authority transition:', JSON.stringify({ action: submitted.action, tab: submitted.tabId, fence: result.exam?.fence, ownerTab: result.exam?.ownerTab, firstAnswer: result.exam?.answers?.[0]?.selected }));
                response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); response.end(JSON.stringify(result)); return;
            }
            const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
            if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end(); return; }
            const type = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png' }[path.extname(file)] || 'application/octet-stream';
            response.writeHead(200, { 'Content-Type': type });
            if (pathname === '/' || pathname === '/index.html') response.end(html);
            else if (pathname === '/app.js') {
                const source = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
                const marker = '\n})();\n\n// INIT DROPDOWN TIMEFRAME';
                assert.ok(source.includes(marker), 'Test hook insertion point must exist');
                response.end(source.replace(marker, '\nglobalThis.__studyTest = { State, beginExamSession, finishExam, studySession, showView, startReview, removeCaseFromCurrentExam };\n})();\n\n// INIT DROPDOWN TIMEFRAME'));
            }
            else fs.createReadStream(file).pipe(response);
        } catch (error) { console.log('Test API:', error.code, error.message); response.writeHead(error.status || 500, { 'Content-Type': 'application/json' }); response.end(JSON.stringify({ code: error.code || error.message })); }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    const errors = [];
    try {
        browser = await puppeteer.launch({ headless: true, pipe: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
        const pageFor = async mobile => {
            const context = await browser.createBrowserContext();
            const page = await context.newPage();
            await page.evaluateOnNewDocument(() => localStorage.setItem('enarmax_analytics_consent', 'denied'));
            if (mobile) await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
            page.on('pageerror', error => { errors.push(error.message); console.log('Uncaught browser error:', error.stack); });
            page.on('console', message => { if (message.type() === 'error' || message.text().includes('examen remoto')) console.log('Browser:', message.text().slice(0, 450)); });
            await page.setRequestInterception(true);
            page.on('request', request => {
                if (!['127.0.0.1', 'localhost'].includes(new URL(request.url()).hostname) && /firestore.googleapis.com|identitytoolkit.googleapis.com|securetoken.googleapis.com|fcmregistrations.googleapis.com/.test(request.url())) request.abort();
                else request.continue();
            });
            await page.goto(origin, { waitUntil: 'load', timeout: 60000 });
            try { await page.waitForFunction(() => globalThis.__studyTest?.State.progressRestoreReady && document.querySelector('#study-devices')?.children.length > 0, { timeout: 30000 }); }
            catch (error) {
                console.log('Startup diagnostics:', await page.evaluate(() => ({ hook: !!globalThis.__studyTest, fb: !!window.FB, uid: window.FB?.auth?.currentUser?.uid,
                    ready: globalThis.__studyTest?.State.progressRestoreReady, status: document.querySelector('[data-progress-sync-status]')?.textContent, errors: document.body.innerText.slice(-800) })), errors);
                throw error;
            }
            console.log(mobile ? 'Phone initialized' : 'PC initialized');
            return page;
        };
        const pc = await pageFor(false);
        const source = require('../questions');
        const flat = source.flatMap(c => (c.questions || [c]).map((q, i) => ({ ...c, ...q, caseGroupId: 1, subQuestionIndex: i + 1, totalSubQuestions: (c.questions || [c]).length }))).slice(0, 2);
        await pc.evaluate(questionSet => __studyTest.beginExamSession({ questionSet, currentExamType: 'Prueba multidispositivo', mode: 'simulacro' }), flat);
        await pc.waitForFunction(() => __studyTest.studySession.owns());
        await pc.click('#questions-container .question-card[data-question-index="0"] .option-btn[data-option-index="1"]');
        await pc.waitForFunction(() => __studyTest.State.answers[0]?.selected === 1 && __studyTest.studySession.active?.lastSequence >= 1
            && document.querySelector('[data-exam-sync-status]').textContent === 'Examen guardado en la nube');
        const reviewIsolation = await pc.evaluate(() => {
            const questions = __studyTest.State.questionSet, answers = __studyTest.State.answers;
            __studyTest.startReview({ questionSet: [{ ...questions[0], question: 'Intento anterior' }], answers: [{ selected: 0, isCorrect: false }] });
            const isolated = questions === __studyTest.State.questionSet && answers === __studyTest.State.answers;
            if (!questions[0]._caseKey) throw new Error('Frozen exam must preserve a stable clinical case key');
            const frozen = __studyTest.removeCaseFromCurrentExam(questions[0]._caseKey) === false && __studyTest.State.questionSet.length === questions.length;
            __studyTest.showView('view-exam'); return { isolated, frozen };
        });
        assert.deepEqual(reviewIsolation, { isolated: true, frozen: true });
        const phone = await pageFor(true);
        try { await phone.waitForFunction(() => __studyTest.studySession.owns() && __studyTest.State.answers[0]?.selected === 1); }
        catch (error) {
            console.log('Handoff diagnostics:', await phone.evaluate(() => ({ uid: __studyTest?.State.currentUid, authUid: window.FB?.auth?.currentUser?.uid, owns: __studyTest?.studySession.owns(),
                active: __studyTest?.studySession.active && { id: __studyTest.studySession.active.id, fence: __studyTest.studySession.active.fence, ownerTab: __studyTest.studySession.active.ownerTab, answer: __studyTest.studySession.active.answers?.[0] },
                uiAnswer: __studyTest?.State.answers[0], status: document.querySelector('[data-exam-sync-status]')?.textContent })),
                'Server authority:', (await db.doc(`active_exams/${uid}`).get()).data(), errors);
            throw error;
        }
        await pc.waitForFunction(() => !__studyTest.studySession.owns());
        assert.equal(await pc.$eval('#questions-container .option-btn', button => button.disabled), true);
        // Reload the installed-app equivalent: answers and exam survive; the new
        // runtime safely acquires a fresh fence, without any synchronization button.
        for (let reopen = 0; reopen < Number(process.env.STUDY_REOPENS || 3); reopen++) {
        await phone.reload({ waitUntil: 'load' });
        try { await phone.waitForFunction(() => __studyTest?.studySession.owns() && __studyTest.State.answers[0]?.selected === 1, { timeout: 30000 }); }
        catch (error) {
            console.log('Reopen diagnostics:', await phone.evaluate(() => ({ uid: __studyTest?.State.currentUid, authUid: window.FB?.auth?.currentUser?.uid,
                owns: __studyTest?.studySession.owns(), active: __studyTest?.studySession.active && { id: __studyTest.studySession.active.id, status: __studyTest.studySession.active.status, fence: __studyTest.studySession.active.fence, answer: __studyTest.studySession.active.answers?.[0] },
                uiAnswers: __studyTest?.State.answers, progress: document.querySelector('[data-progress-sync-status]')?.textContent, examStatus: document.querySelector('[data-exam-sync-status]')?.textContent })), errors);
            throw error;
        }
        }
        await phone.evaluate(async () => { await __studyTest.finishExam(); });
        await phone.waitForFunction(() => __studyTest.State.globalStats.sesiones === 1 && __studyTest.State.view === 'view-results');
        await pc.waitForFunction(() => __studyTest.State.globalStats.sesiones === 1 && !__studyTest.State.examActive);
        const attempts = await db.collection(`exam_attempts/${uid}/items`).get();
        assert.equal(attempts.size, 1);
        await phone.evaluate(() => window.FB.signOut(window.FB.auth));
        await phone.waitForFunction(() => !__studyTest.State.currentUid && __studyTest.State.questionSet.length === 0 && __studyTest.State.answers.length === 0);
        assert.deepEqual(errors, []);
        console.log('Full browser app: automatic save, PC→phone handoff, old PC disabled, reload recovery, immutable finalization and realtime totals passed.');
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
        await auth.deleteUser(uid); await db.terminate(); await app.delete(); await env.cleanup();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
