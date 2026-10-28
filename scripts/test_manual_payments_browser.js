"use strict";
// Full checkout UI with isolated Firebase doubles: never calls production.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const puppeteer = require("puppeteer");
const { createDevServer } = require("./dev_server");
const root = path.resolve(__dirname, "..");
const marker = '                const authEmail = $("auth-email");';
const source = fs.readFileSync(path.join(root, "app.js"), "utf8");
assert.ok(source.includes(marker));
const code = source.replace(marker, `
                window.__paymentTest = { State, beginPlanTransfer, closeTransferModal,
                    syncPaymentPendingBanner, initManualPaymentAdminInbox, reviewManualPayment,
                    dismissStartupScreen, applyTheme };
${marker}`);

(async () => {
    const server = createDevServer({ handlers: {} });
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true, pipe: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
        for (const width of [320, 390, 1440]) {
            const page = await browser.newPage(), errors = [];
            page.on("pageerror", error => errors.push(error.message));
            await page.setViewport({ width, height: 1000 });
            await page.setBypassServiceWorker(true);
            await page.setRequestInterception(true);
            page.on("request", request => {
                if (request.url().startsWith(origin + "/app.js")) return request.respond({ status: 200, contentType: "text/javascript", body: code });
                return request.url().startsWith(origin) && !request.url().startsWith(origin + "/api/") ? request.continue() : request.abort();
            });
            await page.evaluateOnNewDocument(() => localStorage.setItem("enarmax_analytics_consent", "denied"));
            await page.goto(origin, { waitUntil: "load" });
            await page.evaluate(() => {
                window.FB = { auth: { currentUser: null }, onAuthStateChanged() {},
                    getRedirectResult: async () => null, getAnalyticsConsent: () => "denied" };
                window.dispatchEvent(new Event("firebaseLoaded"));
                __paymentTest.dismissStartupScreen();
                document.getElementById("landing-page").classList.add("hidden");
                document.getElementById("auth-overlay").classList.remove("active");
                __paymentTest.applyTheme("dark");
                const state = __paymentTest.State;
                state.currentUid = "payment-student";
                state.transferProfile = { transferReference: "1234567890" };
                state.myManualPaymentRequests = [];
                window.__store = {};
                window.__rejectWrite = false;
                const snap = (id, data) => ({ id, exists: () => !!data, data: () => data });
                const docs = () => Object.entries(__store).filter(([key]) => key.startsWith("manual_payment_requests/"))
                    .map(([key, value]) => snap(key.split("/")[1], value));
                window.FB = {
                    auth: { currentUser: { uid: state.currentUid, email: "payment@example.test", emailVerified: true } }, db: {},
                    doc: (_db, collection, id) => `${collection}/${id}`,
                    collection: (_db, name) => name, where: (...args) => args, orderBy: (...args) => args,
                    limit: n => n, query: (...args) => args,
                    getDoc: async () => { throw new Error("Regression: reading a missing request is forbidden"); },
                    getDocs: async () => ({ docs: docs() }), serverTimestamp: () => new Date(),
                    setDoc: async (ref, value, options) => {
                        if (__rejectWrite) throw Object.assign(new Error("permission-denied"), { code: "permission-denied" });
                        __store[ref] = options?.merge ? { ...__store[ref], ...value } : value;
                    },
                    runTransaction: async (_db, callback) => {
                        const writes = [];
                        const tx = {
                            get: async ref => { if (writes.length) throw new Error("transaction read after write"); return snap(ref, __store[ref]); },
                            set: (ref, data, options) => writes.push([ref, data, !!options?.merge]),
                            update: (ref, data) => writes.push([ref, data, true])
                        };
                        await callback(tx);
                        writes.forEach(([ref, data, merge]) => { __store[ref] = merge ? { ...__store[ref], ...data } : data; });
                    },
                    onSnapshot: (_query, callback) => { callback({ forEach: fn => docs().forEach(fn) }); return () => {}; }
                };
                window.confirm = () => true;
            });
            for (const plan of ["premium_monthly", "enarm_2027", "squad_2027"]) {
                await page.evaluate(async planId => {
                    const state = __paymentTest.State;
                    state.isAdminClaim = false; state.entitlement = null; state.myManualPaymentRequests = [];
                    window.__store = {};
                    await __paymentTest.beginPlanTransfer(planId);
                    __paymentTest.closeTransferModal();
                    if (document.getElementById("payment-transfer-reminder").hidden) throw new Error("Missing unfinished-transfer reminder");
                    document.getElementById("btn-resume-transfer").click();
                }, plan);
                await page.waitForFunction(() => document.getElementById("transfer-modal").style.display === "flex");
                assert.equal(await page.$eval("#transfer-modal", el => el.scrollWidth > el.clientWidth), false);
                await page.evaluate(planId => {
                    document.getElementById("transfer-payment-confirm").checked = true;
                    document.getElementById("transfer-legal-check").checked = true;
                    if (planId === "squad_2027") [1, 2, 3].forEach(i => { document.getElementById(`transfer-squad-member-${i}`).value = `Companero ${i}`; });
                    document.getElementById("btn-transfer-sent").click();
                }, plan);
                await page.waitForFunction(() => !__paymentTest.State.transferSubmitting);
                assert.equal(await page.$eval("#transfer-modal", el => el.style.display), "none");
                assert.equal(await page.$eval("#payment-pending-banner", el => el.hidden), false);
                assert.equal(await page.$eval("#payment-transfer-reminder", el => el.hidden), true);
                assert.equal(await page.evaluate(() => __paymentTest.State.entitlement), null);
                assert.equal(await page.evaluate(() => Object.values(__store).filter(item => item.status === "pending").length), 1);
                await page.evaluate(async () => {
                    __paymentTest.State.isAdminClaim = true;
                    __paymentTest.initManualPaymentAdminInbox();
                    const request = __paymentTest.State.manualPaymentRequests[0];
                    if (!document.querySelector("[data-review-payment=approved]")) throw new Error("Payment missing from admin inbox");
                    await __paymentTest.reviewManualPayment(request.id, "approved");
                    if (__store[`manual_payment_requests/${request.id}`].status !== "approved") throw new Error("Approval failed");
                    if (__store["entitlements/payment-student"].status !== "active") throw new Error("Premium not activated");
                    __paymentTest.State.manualPaymentAdminUnsub?.();
                    __paymentTest.State.manualPaymentAdminUnsub = null;
                });
            }
            await page.evaluate(async () => {
                __paymentTest.State.isAdminClaim = false;
                __paymentTest.State.myManualPaymentRequests = [];
                window.__store = {}; window.__rejectWrite = true;
                await __paymentTest.beginPlanTransfer("enarm_2027");
                document.getElementById("transfer-payment-confirm").checked = true;
                document.getElementById("transfer-legal-check").checked = true;
                document.getElementById("btn-transfer-sent").click();
            });
            await page.waitForFunction(() => !__paymentTest.State.transferSubmitting);
            assert.match(await page.$eval("#transfer-status", el => el.textContent), /No se guardó.*No vuelvas a transferir/);
            assert.equal(await page.$eval("#transfer-modal", el => el.style.display), "flex");
            assert.equal(await page.$eval("#btn-transfer-sent", el => el.disabled), false);
            await page.evaluate(async () => {
                __paymentTest.closeTransferModal();
                window.FB.auth.currentUser.emailVerified = false;
                await __paymentTest.beginPlanTransfer("enarm_2027");
            });
            assert.equal(await page.$eval("#transfer-modal", el => el.style.display), "none");
            assert.deepEqual(errors, []);
            console.log(`Payments ${width}px: new monthly/annual/Squad request, reminder, admin approval, Premium activation, visible write failure and email verification: OK`);
            if (width === 390) {
                const output = path.join(root, ".tmp-config", "payment-previews");
                fs.mkdirSync(output, { recursive: true });
                await page.screenshot({ path: path.join(output, "payment-reminder-mobile.png") });
            }
            await page.close();
        }
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
