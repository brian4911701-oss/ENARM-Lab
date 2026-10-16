'use strict';
// Real app, Firebase Auth/Firestore emulators, isolated desktop/mobile profiles.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const admin = require('firebase-admin');
const puppeteer = require('puppeteer');
const { initializeTestEnvironment } = require('@firebase/rules-unit-testing');
const projectId = 'enarmax-rules-test', root = path.resolve(__dirname, '..');
(async () => {
    assert.ok(process.env.FIREBASE_AUTH_EMULATOR_HOST && process.env.FIRESTORE_EMULATOR_HOST, 'Both local emulators are required.');
    const env = await initializeTestEnvironment({ projectId, firestore: { rules: fs.readFileSync(path.join(root, 'firestore.rules'), 'utf8') } });
    const app = admin.initializeApp({ projectId }), db = app.firestore(), auth = app.auth();
    const uid = 'browser-student', email = 'browser-student@example.test', password = 'Test-session-only-1234';
    await env.clearFirestore();
    try { await auth.deleteUser(uid); } catch {}
    await auth.createUser({ uid, email, password, emailVerified: true, displayName: 'Estudiante de prueba' });
    await db.doc('user_wallets/' + uid).set({ uid, coins: 0, referralCode: 'ELBROWSER1', createdAt: new Date(), updatedAt: new Date() });
    const sessionApi = require('../api/account-session'), studyApi = require('../api/study-sync');
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
        .replace('projectId: "enarm-lab-social"', 'projectId: "' + projectId + '"')
        .replace('import { getAuth, ', 'import { connectAuthEmulator, getAuth, ')
        .replace('import { getFirestore, ', 'import { connectFirestoreEmulator, getFirestore, ')
        .replace('const auth = getAuth(app);', "const auth = getAuth(app); connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });")
        .replace('const auxiliaryAuth = getAuth(auxiliaryApp);', "const auxiliaryAuth = getAuth(auxiliaryApp); connectAuthEmulator(auxiliaryAuth, 'http://127.0.0.1:9099', { disableWarnings: true });")
        .replace('const db = getFirestore(app);', "const db = getFirestore(app); connectFirestoreEmulator(db, '127.0.0.1', 8080);");
    const requests = { account: 0, study: 0 };
    const server = http.createServer(async (request, response) => {
        try {
            const pathname = new URL(request.url, 'http://localhost').pathname;
            if (['/api/study-sync', '/api/account-session'].includes(pathname)) {
                let body = ''; for await (const chunk of request) body += chunk;
                request.body = JSON.parse(body);
                response.status = status => { response.statusCode = status; return response; };
                response.json = value => { response.setHeader('Content-Type', 'application/json'); response.end(JSON.stringify(value)); };
                if (pathname === '/api/study-sync') { requests.study++; await studyApi(request, response); }
                else { requests.account++; await sessionApi(request, response); }
                return;
            }
            const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
            if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end(); return; }
            const type = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png' }[path.extname(file)] || 'application/octet-stream';
            response.writeHead(200, { 'Content-Type': type });
            if (pathname === '/' || pathname === '/index.html') response.end(html);
            else if (pathname === '/app.js') {
                const source = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
                const marker = '\n})();\n\n// INIT DROPDOWN TIMEFRAME';
                assert.ok(source.includes(marker));
                response.end(source.replace(marker, '\nglobalThis.__studyTest = { State, beginExamSession, finishExam, studySession, getAccountSession, showView };\n})();\n\n// INIT DROPDOWN TIMEFRAME'));
            } else fs.createReadStream(file).pipe(response);
        } catch (error) { response.writeHead(500); response.end(JSON.stringify({ code: error.code || error.message })); }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = 'http://127.0.0.1:' + server.address().port;
    let browser; const errors = [];
    const waitReady = page => page.waitForFunction(() => __studyTest.State.progressRestoreReady && !!__studyTest.getAccountSession().sid && !document.querySelector('#startup-screen')?.classList.contains('active'), { timeout: 45000 });
    const login = page => page.evaluate(({ email, password }) => FB.signInWithEmailAndPassword(FB.auth, email, password).then(() => true), { email, password });
    try {
        browser = await puppeteer.launch({ headless: true, pipe: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
        const prepare = async (context, mobile = false) => {
            const page = await context.newPage();
            await page.evaluateOnNewDocument(() => localStorage.setItem('enarmax_analytics_consent', 'denied'));
            if (mobile) await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
            page.on('pageerror', error => { errors.push(error.message); console.log('Browser exception:', error.stack); });
            page.on('console', message => { if (message.type() === 'error') console.log('Browser:', message.text().slice(0, 300)); });
            await page.setRequestInterception(true);
            page.on('request', request => {
                if (!['127.0.0.1', 'localhost'].includes(new URL(request.url()).hostname) && /firestore.googleapis.com|identitytoolkit.googleapis.com|securetoken.googleapis.com|fcmregistrations.googleapis.com/.test(request.url())) request.abort();
                else request.continue();
            });
            await page.goto(origin, { waitUntil: 'load', timeout: 60000 });
            await page.waitForFunction(() => !!globalThis.__studyTest && !!window.FB);
            return page;
        };
        const desktop = await browser.createBrowserContext(), mobile = await browser.createBrowserContext();
        const pc = await prepare(desktop);
        await login(pc); await waitReady(pc);
        assert.equal(await pc.$eval('#session-conflict-dialog', d => d.open), false);
        console.log('PASS 1: normal login, no prompt');
        const bank = require('../questions');
        const flat = bank.flatMap(c => (c.questions || [c]).map((q, i) => ({ ...c, ...q, caseGroupId: 1, subQuestionIndex: i + 1, totalSubQuestions: (c.questions || [c]).length }))).slice(0, 40);
        await pc.evaluate(questionSet => __studyTest.beginExamSession({ questionSet, currentExamType: 'Prueba de sesion unica', mode: 'simulacro' }), flat);
        await pc.waitForFunction(() => __studyTest.studySession.owns());
        await pc.evaluate(async () => {
            for (let i = 0; i < 35; i++) __studyTest.studySession.queue({ kind: 'answer', index: i, selected: 1 });
            await __studyTest.studySession.flush();
        });
        const examId = await pc.evaluate(() => __studyTest.studySession.active.id);
        const oldToken = await pc.evaluate(() => FB.auth.currentUser.getIdToken());
        const phone = await prepare(mobile, true);
        await login(phone);
        await phone.waitForFunction(() => document.querySelector('#session-conflict-dialog').open);
        await phone.screenshot({ path: path.join(root, 'artifacts/session-conflict-mobile.png') });
        await phone.click('#session-conflict-dialog button[value="cancel"]');
        await phone.waitForFunction(() => !FB.auth.currentUser);
        assert.ok(await pc.evaluate(() => __studyTest.studySession.owns()));
        console.log('PASS 2: second-device cancellation preserves PC');
        await login(phone);
        await phone.waitForFunction(() => document.querySelector('#session-conflict-dialog').open);
        await phone.click('#session-conflict-dialog button[value="continue"]');
        await waitReady(phone);
        await phone.waitForFunction(() => __studyTest.studySession.owns() && __studyTest.State.answers.filter(a => a.selected === 1).length === 35);
        await pc.waitForFunction(() => !!window.FB && !!globalThis.__studyTest && !window.FB.auth.currentUser && !globalThis.__studyTest.State.currentUid && document.querySelector('#auth-overlay').classList.contains('active'));
        assert.equal(await pc.evaluate(() => __studyTest.State.questionSet.length), 0);
        assert.equal(await phone.evaluate(() => __studyTest.studySession.active.id), examId);
        const rejection = await fetch(origin + '/api/study-sync', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + oldToken },
            body: JSON.stringify({ action: 'events', examId, events: [{ actor: 'revoked-writer-001', kind: 'answer', sequence: 1, index: 35, selected: 0 }] }) });
        assert.equal(rejection.status, 403); assert.equal((await rejection.json()).code, 'session-replaced');
        console.log('PASS 3/4/5/11: confirmed replacement, automatic logout, 35 answers preserved, old API writes rejected');
        const sid = await phone.evaluate(() => __studyTest.getAccountSession().sid);
        await phone.reload({ waitUntil: 'load' }); await waitReady(phone);
        assert.equal(await phone.evaluate(() => __studyTest.getAccountSession().sid), sid);
        assert.equal(await phone.$eval('#session-conflict-dialog', d => d.open), false);
        console.log('PASS 6: reload retains session');
        const tab = await prepare(mobile, true); await waitReady(tab); await tab.waitForFunction(() => __studyTest.studySession.owns());
        assert.equal(await tab.evaluate(() => __studyTest.getAccountSession().sid), sid);
        assert.ok(await tab.evaluate(() => __studyTest.studySession.owns()));
        assert.ok(await phone.evaluate(() => __studyTest.studySession.owns()));
        await tab.evaluate(async () => { __studyTest.studySession.queue({ kind: 'answer', index: 35, selected: 1 }); await __studyTest.studySession.flush(); });
        await phone.waitForFunction(() => __studyTest.State.answers[35]?.selected === 1);
        console.log('PASS 7: same-profile tabs share session and saving');
        await phone.evaluate(async password => {
            const user = FB.auth.currentUser, previousToken = await user.getIdToken();
            const proof = await FB.verifySessionIdentity(user, password);
            await __studyTest.getAccountSession().reauthorize(previousToken, proof);
        }, password);
        assert.equal(await phone.evaluate(async () => (await FB.auth.currentUser.getIdTokenResult()).claims.enarmaxSid), sid);
        console.log('PASS: recent reauthentication preserves the active session and its permissions');
        await phone.setOfflineMode(true);
        await phone.evaluate(async () => { __studyTest.studySession.queue({ kind: 'answer', index: 36, selected: 1 }); await __studyTest.studySession.flush(); });
        assert.ok(await phone.evaluate(() => !!FB.auth.currentUser));
        await phone.setOfflineMode(false);
        await phone.evaluate(async () => { await __studyTest.getAccountSession().check(); await __studyTest.studySession.flush(); });
        await phone.waitForFunction(() => __studyTest.State.answers[36]?.selected === 1 && document.querySelector('[data-exam-sync-status]').textContent.includes('Examen guardado'));
        console.log('PASS 9: brief offline interval and recovery');
        // Actual Auth refresh must preserve the signed per-session claim.
        assert.equal(await phone.evaluate(async () => (await FB.auth.currentUser.getIdTokenResult(true)).claims.enarmaxSid), sid);
        await phone.evaluate(async () => { await __studyTest.finishExam(); });
        await phone.waitForFunction(() => __studyTest.State.globalStats.sesiones === 1 && __studyTest.State.view === 'view-results');
        assert.equal((await db.collection('exam_attempts/' + uid + '/items').get()).size, 1);
        await tab.close();
        await phone.close();
        const reopened = await prepare(mobile, true); await waitReady(reopened);
        assert.equal(await reopened.evaluate(() => __studyTest.getAccountSession().sid), sid);
        console.log('PASS: close/reopen all windows in same profile retains authorization and progress');
        // Revoke a genuinely disconnected browser with a durable, unconfirmed answer.
        await reopened.evaluate(questionSet => __studyTest.beginExamSession({ questionSet, currentExamType: 'Offline revocation', mode: 'simulacro' }), flat);
        await reopened.waitForFunction(() => __studyTest.studySession.owns());
        const offlineExamId = await reopened.evaluate(() => __studyTest.studySession.active.id);
        await reopened.setOfflineMode(true);
        await reopened.evaluate(async () => { __studyTest.studySession.queue({ kind: 'answer', index: 0, selected: 1 }); await __studyTest.studySession.flush(); });
        await login(pc);
        await pc.waitForFunction(() => document.querySelector('#session-conflict-dialog').open);
        await pc.screenshot({ path: path.join(root, 'artifacts/session-conflict-desktop.png') });
        await pc.click('#session-conflict-dialog button[value="continue"]');
        await waitReady(pc); await pc.waitForFunction(() => __studyTest.studySession.owns());
        assert.equal(await pc.evaluate(() => __studyTest.State.answers[0].selected), null);
        await reopened.setOfflineMode(false);
        await reopened.waitForFunction(() => !!window.FB && !!globalThis.__studyTest && !window.FB.auth.currentUser && !__studyTest.State.currentUid);
        assert.equal((await db.doc('active_exams/' + uid).get()).data().id, offlineExamId);
        assert.equal((await db.doc('active_exams/' + uid).get()).data().answers[0].selected, null);
        console.log('PASS: offline revocation is detected on reconnect and pending answers are rejected');
        const count = requests.account;
        await new Promise(resolve => setTimeout(resolve, 1500));
        assert.ok(requests.account - count < 3, 'No auth check loop');
        assert.equal(await reopened.evaluate(() => !!FB.auth.currentUser), false);
        await pc.evaluate(() => __studyTest.getAccountSession().logout());
        await pc.waitForFunction(() => !FB.auth.currentUser && !__studyTest.State.currentUid);
        assert.equal((await db.doc('account_sessions/' + uid).get()).data().sid, null);
        assert.deepEqual(errors, []);
        console.log('PASS 12: no login/logout loop; manual logout releases authority');
        console.log('Browser tests passed. Simultaneous login and abandoned lease expiry are covered by transaction tests.');
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
        await auth.deleteUser(uid); await db.terminate(); await app.delete(); await env.cleanup();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
