"use strict";
// Exercise the actual Google button and loading DOM with an isolated provider.
// External requests and API calls are blocked; no account or private data is used.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const puppeteer = require("puppeteer");
const { createDevServer } = require("./dev_server");
const root = path.resolve(__dirname, "..");
const output = path.join(root, ".tmp-config", "auth-loading-previews");
const source = fs.readFileSync(path.join(root, "app.js"), "utf8");
const marker = '                const authEmail = $("auth-email");';
assert.ok(source.includes(marker));
const instrumented = source.replace(marker, `
                window.__loadingTest = { showStartupScreen, dismissStartupScreen, showStartupError, applyTheme };
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
        for (const width of [320, 390, 768, 1440]) {
            const page = await browser.newPage();
            await page.bringToFront();
            const errors = [];
            page.on("pageerror", error => errors.push(error.message));
            await page.setViewport({ width, height: width === 320 ? 568 : 900 });
            await page.setBypassServiceWorker(true);
            await page.setRequestInterception(true);
            page.on("request", request => {
                if (request.url().startsWith(origin + "/app.js")) return request.respond({ status: 200, contentType: "text/javascript", body: instrumented });
                return request.url().startsWith(origin) && !request.url().startsWith(origin + "/api/") ? request.continue() : request.abort();
            });
            await page.evaluateOnNewDocument(() => localStorage.setItem("enarmax_analytics_consent", "denied"));
            await page.goto(origin, { waitUntil: "load" });
            // A fresh visitor sees the actual welcome even before Firebase is available.
            assert.equal(await page.$eval("#app-startup-screen", element => getComputedStyle(element).visibility), "hidden");
            assert.equal(await page.$eval("#landing-page", element => getComputedStyle(element).display !== "none" && !element.inert), true);
            assert.equal(await page.$eval("body", element => element.classList.contains("app-starting")), false);
            await page.evaluate(() => {
                window.FB = { auth: { currentUser: null }, authDomain: "provider.example.test", googleProvider: {},
                    onAuthStateChanged() {}, getRedirectResult: async () => null, getAnalyticsConsent: () => "denied",
                    signInWithPopup: () => new Promise((_resolve, reject) => { window.__cancelGoogle = reject; }) };
                window.dispatchEvent(new Event("firebaseLoaded"));
            });
            assert.equal(await page.$eval("#app-startup-screen", element => element.classList.contains("is-hidden")), true,
                "Firebase initialization must not interrupt the welcome with a dashboard skeleton");
            await page.screenshot({ path: path.join(output, `welcome-${width}.png`) });
            await page.evaluate(() => {
                document.getElementById("landing-page").classList.add("hidden");
                document.getElementById("auth-overlay").classList.add("active");
                __loadingTest.applyTheme("dark");
            });
            await page.click(".auth-provider-btn");
            await page.waitForFunction(() => getComputedStyle(document.getElementById("app-startup-screen")).opacity === "1");
            await page.waitForFunction(() => document.getElementById("app-startup-screen").contains(document.activeElement), { timeout: 5000 });
            assert.equal(await page.$eval("#app-startup-status", element => element.textContent), "Conectando con Google");
            assert.equal(await page.$eval("#auth-overlay", element => element.inert), true);
            assert.equal(await page.$eval("#app-startup-screen", element => element.contains(document.activeElement)), true,
                await page.evaluate(() => `${innerWidth}px focus: ${document.activeElement?.outerHTML.slice(0, 250)}; open dialogs: ${document.querySelectorAll("dialog[open]").length}`));
            assert.equal(await page.$eval(".startup-preview", element => element.getAttribute("aria-hidden")), "true");
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px: horizontal overflow`);
            assert.equal(await page.$eval(".startup-preview", element => element.scrollWidth > element.clientWidth), false, `${width}px: skeleton overflow`);
            await page.screenshot({ path: path.join(output, `loading-${width}-dark.png`) });
            if (width === 390) {
                await page.evaluate(() => __loadingTest.applyTheme("light"));
                await page.screenshot({ path: path.join(output, "loading-390-light.png") });
                await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
                assert.equal(await page.$eval(".startup-line", element => getComputedStyle(element, "::after").animationName), "none");
                assert.equal(await page.$eval(".app-startup-loader", element => getComputedStyle(element).animationName), "none");
            }
            await page.evaluate(() => __cancelGoogle({ code: "auth/popup-closed-by-user" }));
            await page.waitForFunction(() => document.getElementById("app-startup-screen").classList.contains("is-hidden"));
            assert.equal(await page.$eval(".auth-provider-btn", element => element.disabled), false);
            assert.equal(await page.$eval("#auth-overlay", element => element.inert), false);
            // A later sign-in can reuse the same screen, including its error/retry state.
            await page.evaluate(() => { __loadingTest.showStartupScreen("Restaurando tu progreso"); __loadingTest.showStartupError(); });
            assert.equal(await page.$eval("#app-startup-retry", element => element.hidden), false);
            assert.equal(await page.$eval("#app-startup-screen", element => element.getAttribute("aria-busy")), "false");
            assert.deepEqual(errors, []);
            console.log(`Auth loading ${width}px: direct welcome before/after Firebase, Google button, visible skeleton, focus, cancellation, reusable error/retry, no overflow: OK`);
            await page.close();
        }
        console.log(`Auth loading screenshots: ${output}`);
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
