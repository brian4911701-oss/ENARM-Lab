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
    const app = admin.initializeApp({ projectId }), db = require('../server/firestore-runtime').getFirestore(admin), auth = app.auth();
    const uid = 'browser-student', email = 'browser-student@example.test', password = 'Test-session-only-1234';
    await env.clearFirestore();
    try { await auth.deleteUser(uid); } catch {}
    await auth.createUser({ uid, email, password, emailVerified: true, displayName: 'Estudiante de prueba' });
    await auth.setCustomUserClaims(uid, { admin: true });
    await db.doc('user_wallets/' + uid).set({ uid, coins: 0, referralCode: 'ELBROWSER1', createdAt: new Date(), updatedAt: new Date() });
    const sessionApi = require('../api/account-session'), studyApi = require('../api/study-sync');
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
        .replace('projectId: "enarm-lab-social"', 'projectId: "' + projectId + '"')
        .replace('import { getAuth, ', 'import { connectAuthEmulator, getAuth, ')
        .replace('import { getFirestore, ', 'import { connectFirestoreEmulator, getFirestore, ')
        .replace('const auth = getAuth(app);', "const auth = getAuth(app); connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });")
        .replace('const auxiliaryAuth = getAuth(auxiliaryApp);', "const auxiliaryAuth = getAuth(auxiliaryApp); connectAuthEmulator(auxiliaryAuth, 'http://127.0.0.1:9099', { disableWarnings: true });")
        .replace('const db = getFirestore(app);', "const db = getFirestore(app); connectFirestoreEmulator(db, '127.0.0.1', 8080);")
        .replace('window.dispatchEvent(new Event("firebaseLoaded"));', `
            window.__cloudCalls = { leaderboardStarts: 0, leaderboardActive: 0, progressReads: 0, analyticsReads: 0 };
            const originalSnapshot = window.FB.onSnapshot, originalRead = window.FB.getDocFromServer, originalQuery = window.FB.getDocs;
            window.FB.onSnapshot = (ref, ...args) => {
                const leaderboard = ref.path === 'public_profiles';
                if (leaderboard) { __cloudCalls.leaderboardStarts++; __cloudCalls.leaderboardActive++; }
                const unsubscribe = originalSnapshot(ref, ...args); let stopped = false;
                return () => { if (leaderboard && !stopped) __cloudCalls.leaderboardActive--; stopped = true; unsubscribe(); };
            };
            window.FB.getDocFromServer = (ref, ...args) => {
                if (ref.path.startsWith('user_progress/')) __cloudCalls.progressReads++;
                return originalRead(ref, ...args);
            };
            window.FB.getDocs = (ref, ...args) => {
                if (['user_metrics', 'user_directory', 'entitlements', 'manual_payment_requests', 'referral_redemptions', 'app_ratings', 'feedback_submissions', 'reports'].includes(ref.path)) __cloudCalls.analyticsReads++;
                return originalQuery(ref, ...args);
            };
            window.dispatchEvent(new Event('firebaseLoaded'));
        `);
    const requests = { account: 0, study: 0 };
    let simulateQuota = true;
    let blockProgressWrites = false;
    const server = http.createServer(async (request, response) => {
        try {
            const pathname = new URL(request.url, 'http://localhost').pathname;
            if (['/api/study-sync', '/api/account-session'].includes(pathname)) {
                let body = ''; for await (const chunk of request) body += chunk;
                request.body = JSON.parse(body);
                response.status = status => { response.statusCode = status; return response; };
                response.json = value => { response.setHeader('Content-Type', 'application/json'); response.end(JSON.stringify(value)); };
                if (pathname === '/api/study-sync') {
                    requests.study++;
                    if (blockProgressWrites && request.body.action === 'progress') {
                        response.status(503).json({ code: 'firestore-quota-exceeded', retryAfterSeconds: 300 });
                    } else await studyApi(request, response);
                }
                else {
                    requests.account++;
                    if (simulateQuota && request.body.action === 'open') {
                        simulateQuota = false;
                        response.setHeader('Retry-After', '300');
                        response.status(503).json({ code: 'firestore-quota-exceeded', retryAfterSeconds: 300 });
                    } else await sessionApi(request, response);
                }
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
                response.end(source.replace(marker, '\nglobalThis.__studyTest = { State, beginExamSession, finishExam, studySession, getAccountSession, showView, flushPendingProgress, progressOutbox };\n})();\n\n// INIT DROPDOWN TIMEFRAME'));
            } else fs.createReadStream(file).pipe(response);
        } catch (error) { response.writeHead(500); response.end(JSON.stringify({ code: error.code || error.message })); }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = 'http://127.0.0.1:' + server.address().port;
    let browser; const errors = [];
    const waitReady = async page => {
        await page.bringToFront();
        try {
            await page.waitForFunction(() => __studyTest.State.progressRestoreReady && !!__studyTest.getAccountSession().sid && !document.querySelector('#startup-screen')?.classList.contains('active'), { timeout: 45000, polling: 100 });
        } catch (error) {
            console.log('Startup diagnostic:', await page.evaluate(() => ({
                visible: document.visibilityState, authenticated: !!window.FB?.auth.currentUser,
                authorized: !!globalThis.__studyTest?.getAccountSession().sid,
                ready: globalThis.__studyTest?.State.progressRestoreReady,
                uid: globalThis.__studyTest?.State.currentUid,
                startup: document.querySelector('#startup-screen')?.textContent,
                notices: document.querySelector('#notification-container')?.textContent
            })));
            throw error;
        }
    };
    const login = page => page.evaluate(({ email, password }) => FB.signInWithEmailAndPassword(FB.auth, email, password).then(() => true), { email, password });
    try {
        browser = await puppeteer.launch({ headless: true, pipe: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
        const prepare = async (context, mobile = false) => {
            const page = await context.newPage();
            await page.evaluateOnNewDocument(() => localStorage.setItem('enarmax_analytics_consent', 'denied'));
            await page.evaluateOnNewDocument(() => {
                document.addEventListener('DOMContentLoaded', () => {
                    new MutationObserver(records => {
                        for (const record of records) for (const node of record.addedNodes) {
                            if (!node.matches?.('.toast')) continue;
                            const notices = JSON.parse(sessionStorage.getItem('session-test-notices') || '[]');
                            notices.push(node.textContent); sessionStorage.setItem('session-test-notices', JSON.stringify(notices));
                        }
                    }).observe(document.body, { childList: true, subtree: true });
                }, { once: true });
            });
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
        await login(pc);
        await pc.waitForFunction(() => document.body.innerText.includes('límite temporal de uso'));
        assert.equal(await pc.evaluate(() => __studyTest.getAccountSession().sid), '');
        assert.equal(await pc.evaluate(() => !!__studyTest.State.currentUid), false);
        const quotaRequestCount = requests.account;
        assert.equal(await pc.evaluate(() => __studyTest.getAccountSession().ensure(FB.auth.currentUser)), false);
        assert.equal(requests.account, quotaRequestCount);
        await pc.screenshot({ path: path.join(root, '.tmp-config/session-quota-desktop.png') });
        console.log('PASS: quota displays its cause, blocks unauthorized entry and suppresses repeated requests');
        await pc.reload({ waitUntil: 'load' }); await waitReady(pc);
        assert.equal(await pc.evaluate(() => __studyTest.State.isAdminClaim), true, 'Exercise actual administrator listeners during replacement');
        assert.equal(await pc.$eval('#session-conflict-dialog', d => d.open), false);
        console.log('PASS 1: normal login, no prompt');
        await pc.waitForFunction(() => window.isCloudInit && __studyTest.State.entitlementLoaded);
        assert.equal(await pc.evaluate(() => __cloudCalls.leaderboardStarts), 0, 'Dashboard must not load the full ranking');
        await db.doc('public_profiles/legacy-community-test').set({ username: 'Perfil sin puntuación', scoreVisible: false });
        await pc.evaluate(() => __studyTest.showView('view-comunidad'));
        await pc.waitForFunction(() => document.querySelector('.leaderboard-list').textContent.includes('Perfil sin puntuación'));
        await pc.evaluate(() => __studyTest.showView('view-comunidad'));
        assert.deepEqual(await pc.evaluate(() => [__cloudCalls.leaderboardStarts, __cloudCalls.leaderboardActive]), [1, 1]);
        await db.doc('public_profiles/legacy-community-test').update({ username: 'Perfil actualizado' });
        await pc.waitForFunction(() => document.querySelector('.leaderboard-list').textContent.includes('Perfil actualizado'));
        await pc.evaluate(() => __studyTest.showView('view-dashboard'));
        assert.equal(await pc.evaluate(() => __cloudCalls.leaderboardActive), 0, 'Leaving Community stops the ranking listener');
        await pc.evaluate(() => __studyTest.showView('view-admin-analytics'));
        await pc.waitForFunction(() => !!__studyTest.State.adminAnalyticsData && !__studyTest.State.adminAnalyticsLoading);
        assert.equal(await pc.evaluate(() => __cloudCalls.analyticsReads), 8);
        await pc.select('#admin-analytics-range', '7');
        assert.equal(await pc.evaluate(() => __cloudCalls.analyticsReads), 8, 'Range changes reuse the eight collections already loaded');
        assert.equal(await pc.evaluate(() => __studyTest.State.adminAnalyticsData.rangeDays), 7);
        assert.equal(await pc.$eval('#admin-analytics-range-label', node => node.textContent), 'Últimos 7 días');
        await pc.click('#admin-analytics-refresh');
        await pc.waitForFunction(() => !__studyTest.State.adminAnalyticsLoading);
        assert.equal(await pc.evaluate(() => __cloudCalls.analyticsReads), 16, 'Explicit refresh still fetches fresh analytics');
        await pc.evaluate(() => __studyTest.showView('view-dashboard'));
        const progressReads = await pc.evaluate(() => __cloudCalls.progressReads);
        await pc.evaluate(() => {
            for (let i = 0; i < 10; i++) {
                window.dispatchEvent(new StorageEvent('storage', { key: 'enarm_progress_v2:' + FB.auth.currentUser.uid + ':other-tab' }));
                document.dispatchEvent(new Event('visibilitychange'));
            }
        });
        await new Promise(resolve => setTimeout(resolve, 500));
        assert.equal(await pc.evaluate(() => __cloudCalls.progressReads), progressReads, 'Active listeners prevent duplicate document reads on tab events');
        console.log('PASS: ranking loads only in Community, retains legacy profiles/live updates, analytics range reuses data, tab events avoid duplicate progress reads');
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
        const pcSignedOut = pc.waitForNavigation({ waitUntil: 'load', timeout: 45000 });
        await phone.click('#session-conflict-dialog button[value="continue"]');
        await waitReady(phone);
        await phone.waitForFunction(() => __studyTest.studySession.owns() && __studyTest.State.answers.filter(a => a.selected === 1).length === 35);
        await pcSignedOut;
        await pc.waitForFunction(() => !!window.FB && !!globalThis.__studyTest && !window.FB.auth.currentUser && !globalThis.__studyTest.State.currentUid && document.querySelector('#auth-overlay').classList.contains('active'));
        assert.equal(await pc.evaluate(() => __studyTest.State.questionSet.length), 0);
        const misleadingPermissionNotices = await pc.evaluate(() => JSON.parse(sessionStorage.getItem('session-test-notices') || '[]')
            .filter(message => /permisos para ver|cargar las valoraciones|cargar los avisos de transferencia/.test(message)));
        assert.deepEqual(misleadingPermissionNotices, [], 'Replacing an administrator must not produce permission-error toasts');
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
        await tab.evaluate(async () => {
            if (!__studyTest.studySession.queue({ kind: 'answer', index: 35, selected: 1 })) throw new Error('Tab answer was not queued');
            await __studyTest.studySession.flush(false, true);
        });
        assert.equal((await db.doc('active_exams/' + uid).get()).data().answers[35].selected, 1);
        await phone.bringToFront();
        try { await phone.waitForFunction(() => __studyTest.State.answers[35]?.selected === 1); }
        catch (error) {
            console.log('Cross-tab diagnostic:', await phone.evaluate(() => ({
                visible: document.visibilityState, revision: __studyTest.studySession.active?.revision,
                cloudAnswer: __studyTest.studySession.active?.answers[35]?.selected,
                renderedAnswer: __studyTest.State.answers[35]?.selected,
                status: document.querySelector('[data-exam-sync-status]')?.textContent
            })));
            throw error;
        }
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
        const reopenedSignedOut = reopened.waitForNavigation({ waitUntil: 'load', timeout: 45000 });
        await reopened.setOfflineMode(false);
        await reopenedSignedOut;
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
        // A phone with old zero totals and an unacknowledged legacy journal must
        // show confirmed cloud results even while pending writes are unavailable.
        const confirmedProgress = (await db.doc('user_progress/' + uid).get()).data();
        const confirmedStats = JSON.parse(confirmedProgress.globalStatsStr);
        const staleProfile = await browser.createBrowserContext();
        const stale = await staleProfile.newPage();
        const legacyActor = 'legacy-zero-browser-0001';
        const zeroStats = { ...confirmedStats, respondidas: 0, aciertos: 0, sesiones: 0,
            bySpecialty: Object.fromEntries(Object.entries(confirmedStats.bySpecialty).map(([key, value]) => [key, { ...value, total: 0, correct: 0 }])) };
        const zero = { ...confirmedProgress, globalStatsStr: JSON.stringify(zeroStats), historyStr: '[]', studyCalendarStr: '{}' };
        const operation = { id: legacyActor + ':1', actor: legacyActor, sequence: 1, epoch: confirmedProgress.syncEpoch || 'initial',
            changes: { globalStatsStr: { kind: 'object', edits: { respondidas: { kind: 'add', value: -10000 }, aciertos: { kind: 'add', value: -10000 }, sesiones: { kind: 'add', value: -10000 } } },
                historyStr: { kind: 'set', value: [] }, theme: { kind: 'set', value: 'forest' } } };
        await stale.evaluateOnNewDocument(({ uid, zero, actor, operation }) => {
            if (localStorage.getItem('seeded-zero-cache')) return;
            localStorage.setItem('seeded-zero-cache', '1'); localStorage.setItem('enarmax_analytics_consent', 'denied');
            localStorage.setItem('enarm_progress_owner', uid); localStorage.setItem('enarm_stats', zero.globalStatsStr);
            localStorage.setItem('enarm_history', '[]');
            localStorage.setItem('enarm_progress_v2:' + uid + ':' + actor, JSON.stringify({ uid, actor, sequence: 1, canonical: zero, view: zero, operations: [], savedAt: Date.now() }));
            localStorage.setItem('enarm_progress_op:' + uid + ':' + operation.id, JSON.stringify(operation));
        }, { uid, zero, actor: legacyActor, operation });
        await stale.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
        stale.on('pageerror', error => errors.push(error.message));
        await stale.setRequestInterception(true);
        stale.on('request', request => {
            if (!['127.0.0.1', 'localhost'].includes(new URL(request.url()).hostname) && /firestore.googleapis.com|identitytoolkit.googleapis.com|securetoken.googleapis.com|fcmregistrations.googleapis.com/.test(request.url())) request.abort();
            else request.continue();
        });
        blockProgressWrites = true;
        await stale.goto(origin, { waitUntil: 'load', timeout: 60000 });
        await stale.waitForFunction(() => !!window.FB && !!globalThis.__studyTest);
        await login(stale); await waitReady(stale);
        assert.equal(await stale.evaluate(() => __studyTest.State.globalStats.sesiones), confirmedStats.sesiones);
        assert.equal(await stale.evaluate(() => __studyTest.State.globalStats.respondidas), confirmedStats.respondidas);
        assert.ok(await stale.evaluate(() => __studyTest.progressOutbox.read(FB.auth.currentUser.uid).pending));
        assert.equal(JSON.parse((await db.doc('user_progress/' + uid).get()).data().globalStatsStr).sesiones, confirmedStats.sesiones);
        blockProgressWrites = false;
        await stale.evaluate(() => __studyTest.flushPendingProgress());
        await stale.waitForFunction(() => !__studyTest.progressOutbox.read(FB.auth.currentUser.uid).pending);
        assert.equal(await stale.evaluate(() => __studyTest.State.globalStats.respondidas), confirmedStats.respondidas);
        assert.equal((await db.collection('exam_attempts/' + uid + '/items').get()).size, 1);
        assert.deepEqual(errors, []);
        console.log('PASS: old phone zero cache and negative legacy journal cannot hide cloud results, even when pending writes fail; recovery preserves attempts');
        console.log('Browser tests passed. Simultaneous login and abandoned lease expiry are covered by transaction tests.');
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
        await auth.deleteUser(uid); await db.terminate(); await app.delete(); await env.cleanup();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
