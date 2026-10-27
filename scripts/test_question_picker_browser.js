"use strict";
// Real native mouse/touch/keyboard input; external services are blocked.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const puppeteer = require("puppeteer");
const { createDevServer } = require("./dev_server");
const root = path.resolve(__dirname, "..");
const output = path.join(root, ".tmp-config", "question-picker-previews");
const source = fs.readFileSync(path.join(root, "app.js"), "utf8").replace(/\r\n/g, "\n");
const marker = "\n})();\n\n// INIT DROPDOWN TIMEFRAME";
assert.ok(source.includes(marker));
const instrumented = source.replace(marker, `
    window.__pickerTest = { State, showView, applyTheme, syncPremiumUI };
${marker}`);
const waitForPaint = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const geometry = page => page.$eval("#setup-qty-slider", input => {
    const { x, y, width, height } = input.getBoundingClientRect();
    return { x, y: y + height / 2, width };
});
const assertSynced = async (page, expected) => {
    const actual = await page.evaluate(() => ({
        input: Number(document.getElementById("setup-qty-slider").value),
        label: Number(document.getElementById("setup-qty-val").textContent),
        state: __pickerTest.State.setupQty
    }));
    assert.deepEqual(actual, { input: expected, label: expected, state: expected });
};

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
            const errors = [];
            page.on("pageerror", error => errors.push(error.message));
            await page.setViewport({ width, height: 1000, hasTouch: true, isMobile: width < 600 });
            await page.setBypassServiceWorker(true);
            await page.setRequestInterception(true);
            page.on("request", request => request.url().startsWith(origin + "/app.js")
                ? request.respond({ status: 200, contentType: "text/javascript", body: instrumented })
                : request.url().startsWith(origin) && !request.url().startsWith(origin + "/api/") ? request.continue() : request.abort());
            await page.evaluateOnNewDocument(() => localStorage.setItem("enarmax_analytics_consent", "denied"));
            await page.goto(origin, { waitUntil: "load" });
            await page.waitForFunction(() => !!window.__pickerTest);
            await page.evaluate(() => {
                for (const id of ["landing-page", "auth-overlay", "app-startup-screen"]) document.getElementById(id).style.display = "none";
                document.body.classList.remove("app-booting");
                document.querySelector(".app-layout").style.display = "flex";
                Object.assign(__pickerTest.State, { currentUid: "picker-fixture", isAdminClaim: true, adminPreviewMode: "premium",
                    authStateResolved: true, entitlementLoaded: true, globalPremiumLoaded: true });
                __pickerTest.showView("view-setup");
                __pickerTest.syncPremiumUI();
                __pickerTest.State.theme = "sunset";
                __pickerTest.applyTheme("sunset");
            });
            // Presets update the model and all visible parts without an input event.
            for (const [preset, value] of [["preset-real", 280], ["preset-mini", 50], ["preset-flash", 20]]) {
                await page.$eval(`#${preset}`, card => card.click());
                await assertSynced(page, value);
            }
            await page.$eval("#setup-qty-slider", input => input.scrollIntoView({ block: "center" }));
            let box = await geometry(page);
            await page.mouse.move(box.x + box.width * 0.2, box.y);
            await page.mouse.down();
            await page.mouse.move(box.x + box.width * 0.76, box.y, { steps: 12 });
            assert.equal(await page.$eval(".question-picker", el => el.classList.contains("is-dragging")), true);
            const dragged = await page.$eval("#setup-qty-slider", input => Number(input.value));
            assert.ok(dragged > 190 && dragged < 230, `${width}px: native drag selected ${dragged}`);
            await assertSynced(page, dragged);
            assert.equal(await page.$$(".preset-card.active").then(items => items.length), 0);
            await waitForPaint(page);
            await page.screenshot({ path: path.join(output, `drag-${width}-sunset.png`) });
            await page.mouse.up();
            assert.equal(await page.$eval(".question-picker", el => el.classList.contains("is-dragging")), false);
            await page.focus("#setup-qty-slider");
            await page.keyboard.press("Home");
            await assertSynced(page, 1);
            await page.keyboard.press("ArrowRight");
            await assertSynced(page, 2);
            await page.keyboard.press("End");
            await assertSynced(page, 280);
            assert.equal(await page.$eval("#setup-qty-slider", input => input.getAttribute("aria-valuetext")), "280 preguntas");

            // Exercise native touch movement instead of synthesizing input values.
            box = await geometry(page);
            const cdp = await page.createCDPSession();
            await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x + box.width - 10, y: box.y }] });
            for (const part of [0.8, 0.6, 0.45]) {
                await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: box.x + box.width * part, y: box.y }] });
            }
            await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
            const touched = await page.$eval("#setup-qty-slider", input => Number(input.value));
            assert.ok(touched > 100 && touched < 150, `${width}px: native touch selected ${touched}`);
            await assertSynced(page, touched);
            await cdp.detach();

            for (const theme of ["dark", "light", "lilac-light", "forest", "ocean", "sunset", "navy-gold", "black-teal", "aurora", "premium", "premium-pink"]) {
                await page.evaluate(theme => __pickerTest.applyTheme(theme), theme);
                const colors = await page.evaluate(() => {
                    const badge = document.querySelector(".question-picker-value");
                    const probe = document.createElement("span");
                    probe.style.color = "var(--accent-green)";
                    document.body.append(probe);
                    const result = { actual: getComputedStyle(badge).backgroundColor, expected: getComputedStyle(probe).color };
                    probe.remove();
                    return result;
                });
                assert.equal(colors.actual, colors.expected, `${theme}: theme accent`);
                if (["light", "ocean", "sunset"].includes(theme)) {
                    await page.screenshot({ path: path.join(output, `picker-${width}-${theme}.png`) });
                }
            }
            // A downgraded account clamps the value, readout, state and endpoints.
            await page.evaluate(() => { __pickerTest.State.adminPreviewMode = "demo"; __pickerTest.syncPremiumUI(); });
            await assertSynced(page, 10);
            assert.equal(await page.$eval("#setup-qty-slider", input => input.max), "10");
            assert.equal(await page.$eval("#setup-qty-max-label", label => label.textContent), "10");
            await page.focus("#setup-qty-slider");
            await page.keyboard.press("End");
            await assertSynced(page, 10);
            // Reduced motion jumps directly to the selected position without tilt.
            await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
            await page.keyboard.press("Home");
            await assertSynced(page, 1);
            const motion = await page.$eval(".question-picker-track", track => ({
                position: track.style.getPropertyValue("--qty-position"), lean: track.style.getPropertyValue("--qty-lean"),
                transition: getComputedStyle(track.querySelector(".question-picker-value")).transitionDuration
            }));
            assert.equal(motion.position, "0%");
            assert.equal(motion.lean, "0deg");
            assert.ok(parseFloat(motion.transition) <= 0.00001);
            await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
            await page.evaluate(() => document.body.classList.add("reduce-motion"));
            await page.keyboard.press("End");
            await assertSynced(page, 10);
            assert.equal(await page.$eval(".question-picker-track", track => track.style.getPropertyValue("--qty-position")), "100%");
            assert.equal(await page.$eval(".question-picker", el => el.scrollWidth > el.clientWidth), false, `${width}px: picker overflow`);
            assert.deepEqual(errors, []);
            console.log(`Question picker ${width}px: native drag/touch/keyboard, presets, account limits, 11 themes and reduced motion: OK`);
            await page.close();
        }
        console.log(`Question picker screenshots: ${output}`);
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
