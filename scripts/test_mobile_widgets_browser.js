"use strict";
// Full local app and real Chrome. All external requests are blocked; fixtures
// stay in this browser profile and never reach Firebase or academic records.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const puppeteer = require("puppeteer");
const root = path.resolve(__dirname, "..");
const output = path.join(root, ".tmp-config", "widget-previews");
const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8").replace(/\r\n/g, "\n");
const marker = "\n})();\n\n// INIT DROPDOWN TIMEFRAME";
assert.ok(appSource.includes(marker));
const instrumented = appSource.replace(marker, `
    globalThis.__widgetsTest = { State, showView, mobile: () => mobileWidgets,
        syncPomodoroClock, reconcilePomodoroState, pausePomodoroTimer, resetPomodoroTimer,
        persistPomodoroLocalState, formatDateKey, updateDashboardStats, applyTheme,
        ticker: () => pomoTimer };
})();

// INIT DROPDOWN TIMEFRAME`);

(async () => {
    fs.mkdirSync(output, { recursive: true });
    const server = http.createServer((request, response) => {
        const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
        const target = path.resolve(root, "." + (pathname === "/" ? "/index.html" : pathname));
        if (!target.startsWith(root + path.sep) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
            response.writeHead(404); response.end(); return;
        }
        const type = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png" }[path.extname(target)] || "application/octet-stream";
        response.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" });
        if (pathname === "/app.js") response.end(instrumented);
        else fs.createReadStream(target).pipe(response);
    });
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    let browser;
    const errors = [];
    try {
        browser = await puppeteer.launch({ headless: true, pipe: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
        const page = await browser.newPage();
        await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
        await page.setRequestInterception(true);
        page.on("request", request => request.url().startsWith(origin) ? request.continue() : request.abort());
        page.on("pageerror", error => errors.push(error.message));
        await page.evaluateOnNewDocument(() => localStorage.setItem("enarmax_analytics_consent", "denied"));
        const reveal = async () => {
            await page.waitForFunction(() => !!globalThis.__widgetsTest?.mobile());
            await page.evaluate(() => {
                for (const selector of ["#landing-page", "#auth-overlay", "#app-startup-screen"]) document.querySelector(selector).style.display = "none";
                document.querySelector(".app-layout").style.display = "flex";
                document.body.classList.remove("app-booting");
                __widgetsTest.showView("view-dashboard");
            });
            await page.waitForFunction(() => document.querySelector(".mw-viewport").clientWidth > 0);
        };
        const go = async index => {
            await page.click(`[data-widget="${index}"]`);
            await page.waitForFunction(i => Math.abs(document.querySelector(".mw-viewport").scrollLeft - document.querySelector(".mw-viewport").clientWidth * i) < 1, {}, index);
            await page.waitForFunction(i => document.querySelector(`[data-widget="${i}"]`).hasAttribute("aria-current"), {}, index);
            // Wait for the browser's smooth scroll to finish, including snap.
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 180)));
        };
        const capture = async name => {
            // ElementHandle.screenshot scrolls nested mobile containers into
            // view in Chrome. Capture the visible viewport without repositioning.
            const clip = await page.$eval(".mobile-widget-stack", el => {
                const { x, y, width, height } = el.getBoundingClientRect();
                return { x, y, width, height };
            });
            await page.screenshot({ path: path.join(output, name + ".png"), clip, captureBeyondViewport: false });
        };
        await page.goto(origin, { waitUntil: "load" });
        await reveal();
        assert.equal(await page.$eval("#exam-countdown", el => el.parentElement.id), "mw-clock");
        assert.equal(await page.$$(".mw-page").then(pages => pages.length), 5);
        assert.equal(await page.$eval('[data-widget="0"]', el => el.getAttribute("aria-current")), "true");

        // Empty and populated states are derived from the app's calendar only.
        await go(2);
        assert.equal(await page.$eval(".mw-activity .mw-title", el => el.textContent), "Constancia");
        assert.equal(await page.$eval(".mw-focus-copy", el => el.textContent.replace(/\s+/g, " ").trim()), "Pomodoro Iniciar");
        assert.equal(await page.$(".mw-mode, .mw-week-total, .mw-activity-footer"), null);
        assert.equal(await page.$eval("#exam-countdown", el => getComputedStyle(el).backdropFilter), "none");
        assert.equal(await page.$$eval(".mw-page", els => els.every(el => getComputedStyle(el).opacity === "1")), true, "Incoming cards must not wait for a delayed fade");
        await page.evaluate(() => {
            const test = __widgetsTest;
            test.State.studyCalendar = {};
            for (let i = 0; i < 7; i++) {
                const date = new Date(); date.setDate(date.getDate() - (6 - i));
                test.State.studyCalendar[test.formatDateKey(date)] = { sessions: i % 4 };
            }
            test.updateDashboardStats();
        });
        assert.equal(await page.$eval(".mw-bars", el => el.getAttribute("aria-label")), "9 sesiones completadas en los últimos 7 días");
        assert.equal(await page.$$eval(".mw-bar-value", els => els.map(el => el.textContent).join(",")), "0,1,2,3,0,1,2");
        assert.match(await page.$eval(".mw-today", el => el.getAttribute("aria-label")), /2 sesiones, hoy$/);
        await capture("activity");

        // Every slide keeps the same footprint, including the 320px layout.
        for (const width of [320, 360, 390, 412, 768]) {
            await page.setViewport({ width, height: 844, isMobile: true, hasTouch: true });
            const heights = [];
            for (let index = 0; index < 5; index++) {
                await go(index);
                const layout = await page.evaluate(() => {
                    const stack = document.querySelector(".mobile-widget-stack"), active = document.querySelector(".mw-active");
                    return { height: stack.getBoundingClientRect().height, documentOverflow: document.documentElement.scrollWidth > innerWidth,
                        contentOverflow: active.scrollHeight > active.clientHeight || active.scrollWidth > active.clientWidth };
                });
                assert.equal(layout.documentOverflow, false, `${width}px: page overflow`);
                assert.equal(layout.contentOverflow, false, `${width}px / ${index}: content overflow`);
                heights.push(layout.height);
                if (width === 320) await capture(`small-${index}`);
            }
            assert.equal(new Set(heights).size, 1);
        }
        await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

        // One underlying Pomodoro; timestamps survive reload and widget changes.
        await go(1);
        assert.equal(await page.$eval(".mw-time", el => el.textContent), "25:00");
        await page.click(".mw-toggle");
        const deadline = await page.evaluate(() => __widgetsTest.State.pomodoroState.endsAt);
        const firstTicker = await page.evaluate(() => __widgetsTest.ticker());
        await go(0);
        assert.equal(await page.evaluate(() => __widgetsTest.ticker()), firstTicker, "Changing widgets must not create an interval");
        await page.evaluate(() => {
            __widgetsTest.State.pomodoroState.endsAt = Date.now() + 90000;
            __widgetsTest.syncPomodoroClock(true);
        });
        assert.ok(await page.evaluate(() => __widgetsTest.State.pomodoroState.secondsLeft <= 90), "A suspended timer must reconcile from its timestamp");
        const resumedDeadline = await page.evaluate(() => __widgetsTest.State.pomodoroState.endsAt);
        assert.ok(resumedDeadline < deadline);
        await page.reload({ waitUntil: "load" });
        await reveal();
        assert.equal(await page.evaluate(() => __widgetsTest.State.pomodoroState.endsAt), resumedDeadline);
        assert.equal(await page.evaluate(() => __widgetsTest.State.pomodoroState.isRunning), true);
        await go(1);
        await page.click(".mw-toggle");
        assert.equal(await page.evaluate(() => __widgetsTest.State.pomodoroState.isRunning), false);
        assert.equal(await page.evaluate(() => __widgetsTest.ticker()), null);
        await page.click(".mw-reset");
        assert.equal(await page.$eval(".mw-time", el => el.textContent), "25:00");

        // Simulate a suspended tab by moving its persisted deadline into the past.
        let dialogs = 0;
        page.on("dialog", async dialog => { dialogs++; await dialog.dismiss(); });
        await page.click(".mw-toggle");
        const completion = await page.evaluate(() => {
            const test = __widgetsTest;
            const before = test.State.globalStats.pomodoros || 0;
            test.State.pomodoroState.endsAt = Date.now() - 5000;
            test.persistPomodoroLocalState();
            test.reconcilePomodoroState();
            test.reconcilePomodoroState();
            return { increment: test.State.globalStats.pomodoros - before, mode: test.State.pomodoroState.mode, running: test.State.pomodoroState.isRunning, ticker: test.ticker() };
        });
        assert.deepEqual(completion, { increment: 1, mode: "shortBreak", running: false, ticker: null });
        assert.equal(dialogs, 0, "Mobile completion must not open a blocking alert");
        assert.match(await page.$eval(".mw-announcement", el => el.textContent), /Bloque terminado/);
        await page.evaluate(() => __widgetsTest.resetPomodoroTimer());
        await capture("focus");

        // Buttons use the app's real router, with no fabricated URLs.
        await go(3);
        await capture("shortcuts");
        for (const destination of ["view-calculadora", "view-temario", "view-estadisticas", "view-historial"]) {
            await page.click(`.mw-shortcut[data-destination="${destination}"]`);
            assert.equal(await page.evaluate(() => __widgetsTest.State.view), destination);
            await page.evaluate(() => __widgetsTest.showView("view-dashboard"));
            await page.waitForFunction(() => Math.abs(document.querySelector(".mw-viewport").scrollLeft - document.querySelector(".mw-viewport").clientWidth * 3) < 1);
        }
        // The fifth widget reads saved cases and uses the existing notebook action.
        await go(4);
        assert.match(await page.$eval(".mw-notebook-preview", el => el.textContent), /Aún no hay/);
        const notebookBefore = await page.evaluate(() => {
            __widgetsTest.State.caseNotebook = [{ id: "widget-test-case", title: "Caso guardado para repasar", topic: "Tema de prueba", specialty: "mi", caseText: "Caso local de prueba", note: "", tags: [], savedAt: Date.now() }];
            __widgetsTest.updateDashboardStats();
            return JSON.stringify(__widgetsTest.State.caseNotebook);
        });
        assert.equal(await page.$eval(".mw-notebook-count", el => el.textContent), "1");
        assert.equal(await page.$eval(".mw-notebook-preview", el => el.textContent), "Caso guardado para repasar");
        await capture("notebook");
        await page.evaluate(() => { __widgetsTest.State.entitlement = { status: "active" }; });
        await page.click(".mw-open-notebook");
        assert.equal(await page.evaluate(() => __widgetsTest.State.view), "view-estudio-plus");
        assert.equal(await page.$eval("#notebook-editor-title", el => el.textContent), "Caso guardado para repasar");
        assert.equal(await page.evaluate(() => JSON.stringify(__widgetsTest.State.caseNotebook)), notebookBefore, "Preview/open must not modify saved cases");
        await page.evaluate(() => { __widgetsTest.State.entitlement = null; __widgetsTest.showView("view-dashboard"); });
        await page.reload({ waitUntil: "load" });
        await reveal();
        await page.waitForFunction(() => document.querySelector('[data-widget="4"]').hasAttribute("aria-current"));
        await page.waitForFunction(() => Math.abs(document.querySelector(".mw-viewport").scrollLeft - document.querySelector(".mw-viewport").clientWidth * 4) < 1);
        await go(3);

        // Native touch: a horizontal swipe changes a widget, a vertical swipe
        // scrolls the page without changing the widget or firing an inner button.
        const cdp = await page.createCDPSession();
        const swipe = async (dx, dy) => {
            const box = await page.$eval(".mw-viewport", el => { const rect = el.getBoundingClientRect(); return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }; });
            await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [box] });
            for (let i = 1; i <= 12; i++) {
                await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: box.x + dx * i / 12, y: box.y + dy * i / 12 }] });
            }
            await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        };
        await swipe(140, 3);
        await page.waitForFunction(() => document.querySelector('[data-widget="2"]').hasAttribute("aria-current"));
        const verticalBefore = await page.evaluate(() => document.querySelector(".main-content").scrollTop + scrollY);
        await swipe(3, -90);
        await page.waitForFunction(before => document.querySelector(".main-content").scrollTop + scrollY > before, {}, verticalBefore);
        assert.equal(await page.$eval('[data-widget="2"]', el => el.getAttribute("aria-current")), "true");
        await page.evaluate(() => { document.querySelector(".main-content").scrollTop = 0; scrollTo(0, 0); });
        await go(0);
        await swipe(120, 1);
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 200)));
        assert.equal(await page.$eval(".mw-viewport", el => el.scrollLeft), 0, "No swipe before the first widget");
        await go(4);
        await swipe(-120, 1);
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 200)));
        assert.equal(await page.$eval(".mw-viewport", el => el.scrollLeft), await page.$eval(".mw-viewport", el => el.clientWidth * 4), "No swipe past the final widget");
        assert.equal(await page.evaluate(() => __widgetsTest.State.view), "view-dashboard", "Swiping over an inner button must not activate it");

        // System motion preference and both surface palettes.
        await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
        await go(2);
        assert.equal(await page.$eval(".mw-bar-fill", el => getComputedStyle(el).animationName), "none");
        await page.evaluate(() => { __widgetsTest.State.theme = "light"; __widgetsTest.applyTheme("light"); });
        await page.waitForFunction(() => getComputedStyle(document.querySelector(".mobile-widget-stack")).backgroundColor === "rgb(255, 255, 255)");
        assert.equal(await page.$eval(".mobile-widget-stack", el => getComputedStyle(el).backgroundColor), "rgb(255, 255, 255)");
        await capture("activity-light");
        await page.evaluate(() => { __widgetsTest.State.theme = "dark"; __widgetsTest.applyTheme("dark"); });
        await page.waitForFunction(() => getComputedStyle(document.querySelector(".mobile-widget-stack")).backgroundColor === "rgb(23, 29, 46)");
        assert.equal(await page.$eval(".mobile-widget-stack", el => getComputedStyle(el).backgroundColor), "rgb(23, 29, 46)");
        await capture("activity-dark");
        await page.evaluate(() => { __widgetsTest.State.theme = "ocean"; __widgetsTest.applyTheme("ocean"); });
        await page.waitForFunction(() => getComputedStyle(document.querySelector(".mobile-widget-stack")).backgroundColor === "rgb(37, 45, 163)");
        await go(0);
        await capture("clock");

        // Returning to desktop restores the exact original countdown parent/order.
        await page.setViewport({ width: 1440, height: 1000 });
        await page.waitForFunction(() => document.querySelector("#exam-countdown").parentElement.classList.contains("dashboard-header"));
        assert.equal(await page.$eval(".mobile-widget-stack", el => getComputedStyle(el).display), "none");
        assert.equal(await page.$eval("#exam-countdown", el => el.previousElementSibling.classList.contains("dashboard-mobile-hero")), true);
        assert.equal(await page.$eval("#exam-countdown", el => el.nextElementSibling.nextElementSibling.classList.contains("dashboard-counters")), true);
        assert.deepEqual(errors, [], "No uncaught browser errors");
        console.log(`Mobile widgets: widths 320–768, stable height, touch axes, timer reload/pause/reset/completion, one ticker, selection persistence, real routes/calendar, reduced motion, desktop restoration: OK. Screenshots: ${output}`);
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
