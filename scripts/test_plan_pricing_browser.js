"use strict";
// Isolated checkout preview: no Firebase calls or real payment requests.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const puppeteer = require("puppeteer");
const { createDevServer } = require("./dev_server");
const root = path.resolve(__dirname, "..");
const output = path.join(root, ".tmp-config", "pricing-previews");
const source = fs.readFileSync(path.join(root, "app.js"), "utf8");
const marker = '                const authEmail = $("auth-email");';
assert.ok(source.includes(marker));
const instrumented = source.replace(marker, `
                window.__pricingTest = { State, getTransferPlan, syncPlanPricingUI,
                    openRedeemModal, closeTransferModal, dismissStartupScreen, applyTheme };
${marker}`);

(async () => {
    const server = createDevServer({ handlers: {} });
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    let browser;
    try {
        fs.mkdirSync(output, { recursive: true });
        browser = await puppeteer.launch({ headless: true, pipe: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
        for (const width of [320, 390, 768, 1100, 1440]) {
            const page = await browser.newPage();
            const errors = [];
            page.on("pageerror", error => errors.push(error.message));
            await page.setViewport({ width, height: 1000 });
            await page.setBypassServiceWorker(true);
            await page.setRequestInterception(true);
            page.on("request", request => {
                if (request.url().startsWith(origin + "/app.js")) return request.respond({ status: 200, contentType: "text/javascript", body: instrumented });
                return request.url().startsWith(origin) && !request.url().startsWith(origin + "/api/") ? request.continue() : request.abort();
            });
            await page.evaluateOnNewDocument(() => localStorage.setItem("enarmax_analytics_consent", "denied"));
            await page.goto(origin, { waitUntil: "load" });
            await page.evaluate(() => {
                window.FB = { auth: { currentUser: null }, onAuthStateChanged() {},
                    getRedirectResult: async () => null, getAnalyticsConsent: () => "denied" };
                window.dispatchEvent(new Event("firebaseLoaded"));
                __pricingTest.dismissStartupScreen();
                document.getElementById("landing-page").classList.add("hidden");
                document.getElementById("auth-overlay").classList.remove("active");
                __pricingTest.applyTheme("dark");
                __pricingTest.openRedeemModal();
            });
            assert.equal(await page.$$("#redeem-modal [role=switch]").then(items => items.length), 0);
            assert.equal(await page.$$eval("#redeem-modal .redeem-plan-grid > article", cards => cards.filter(card => card.getBoundingClientRect().height > 0).length), 4);
            assert.equal(await page.$eval("#redeem-modal", el => el.scrollWidth > el.clientWidth), false, `${width}px: modal overflow`);
            for (const [planId, amount] of [["premium_monthly", 99], ["enarm_2027", 999], ["squad_2027", 2499]]) {
                // Expired promotions must not change prices, even for a lapsed monthly subscriber.
                const actual = await page.evaluate((id) => {
                    Date.now = () => new Date("2026-12-01T12:00:00Z").getTime();
                    __pricingTest.State.entitlement = { planId: "premium_monthly", status: "expired", monthlyPromoLost: true };
                    __pricingTest.syncPlanPricingUI();
                    window.FB.auth.currentUser = { uid: "pricing-test", email: "pricing@example.test", emailVerified: true };
                    window.FB.db = {};
                    window.FB.doc = () => { throw new Error("Unexpected Firebase call"); };
                    window.FB.runTransaction = () => { throw new Error("Unexpected Firebase call"); };
                    __pricingTest.State.transferProfile = { transferReference: "1234567890" };
                    __pricingTest.State.myManualPaymentRequests = [];
                    return __pricingTest.getTransferPlan(id).amount;
                }, planId);
                assert.equal(actual, amount);
                await page.click(`#redeem-modal [data-plan-id="${planId}"]`);
                await page.waitForFunction(() => document.getElementById("transfer-modal").style.display === "flex", { timeout: 5000 });
                assert.equal(await page.$eval("#transfer-plan-amount", el => el.textContent), `$${amount.toLocaleString("es-MX")} MXN`);
                if (planId === "squad_2027") assert.equal(await page.$eval("#transfer-squad-members", el => el.hidden), false);
                await page.evaluate(() => { __pricingTest.closeTransferModal(); __pricingTest.openRedeemModal(); });
            }
            await page.screenshot({ path: path.join(output, `plans-${width}-dark.png`), fullPage: true });
            assert.deepEqual(errors, []);
            console.log(`Pricing ${width}px: four visible plans, no overflow, fixed prices and correct checkout amounts: OK`);
            await page.close();
        }
        console.log(`Pricing screenshots: ${output}`);
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
