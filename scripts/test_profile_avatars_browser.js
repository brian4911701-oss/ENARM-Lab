"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const puppeteer = require("puppeteer");
const { createDevServer } = require("./dev_server");
const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "app.js"), "utf8");
const catalog = source.slice(source.indexOf("    const PROFILE_AVATAR_COLORS"), source.indexOf("    const POMQUEST_LOGO_SRC"));
const context = vm.createContext({});
vm.runInContext(catalog + ";globalThis.catalog = { PROFILE_AVATARS, PROFILE_AVATAR_BY_ID, normalizeProfileAvatar };", context);
const { PROFILE_AVATARS, PROFILE_AVATAR_BY_ID, normalizeProfileAvatar } = context.catalog;
assert.equal(PROFILE_AVATARS.length, 10);
assert.equal(PROFILE_AVATAR_BY_ID.size, 110);
assert.ok(PROFILE_AVATAR_BY_ID.has("lab-nimbo-blanco"));
assert.equal(new Set(PROFILE_AVATARS.map(avatar => avatar.color)).size, 10);
assert.equal(normalizeProfileAvatar("Ajolote"), "lab-ajolote-rosa");
for (const invalid of ["__proto__", "constructor", "https://example.com/face.svg", "lab-ajolote-red"]) {
    assert.equal(normalizeProfileAvatar(invalid), "");
}
for (const [id, avatar] of PROFILE_AVATAR_BY_ID) {
    assert.equal(normalizeProfileAvatar(id), id);
    assert.ok(id.length <= 60);
    const svg = fs.readFileSync(path.join(root, avatar.src), "utf8");
    assert.match(svg, /<svg/);
    assert.match(svg, /radialGradient/);
    assert.doesNotMatch(svg, /NaN|Infinity|<script|<image/);
}

const marker = '                const authEmail = $("auth-email");';
assert.ok(source.includes(marker));
const instrumented = source.replace(marker, `
                window.__avatarTest = { State, renderProfileAvatarPicker, renderAvatarPicker,
                    applyCurrentProfileAvatar, getProfileAvatarMarkup, loadGlobalStats, dismissStartupScreen, applyTheme };
${marker}`);

(async () => {
    const output = path.join(root, ".tmp-config", "avatar-previews");
    fs.mkdirSync(output, { recursive: true });
    const server = createDevServer({ handlers: {} });
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true, pipe: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
        for (const width of [320, 390, 1440]) {
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
            await page.goto(origin, { waitUntil: "load" });
            await page.evaluate(() => {
                window.FB = { auth: { currentUser: null }, onAuthStateChanged() {}, getRedirectResult: async () => null,
                    getAnalyticsConsent: () => "denied" };
                window.dispatchEvent(new Event("firebaseLoaded"));
                __avatarTest.dismissStartupScreen();
                __avatarTest.applyTheme("dark");
                document.getElementById("landing-page").classList.add("hidden");
                document.getElementById("auth-overlay").classList.remove("active");
                // Show only the profile view, using the real selector and its real listeners.
                for (const element of document.querySelectorAll(".view")) element.classList.remove("active");
                document.getElementById("view-perfil")?.classList.add("active");
                __avatarTest.State.userName = "Avatar Test";
                __avatarTest.State.userAvatar = "";
                __avatarTest.renderProfileAvatarPicker();
                const modal = document.getElementById("avatar-picker-modal");
                for (let parent = modal.parentElement; parent; parent = parent.parentElement) {
                    parent.hidden = false;
                    parent.style.display = "block";
                    parent.classList.remove("hidden");
                }
                modal.classList.add("active");
                modal.setAttribute("aria-hidden", "false");
            });
            assert.equal(await page.$$eval("#profile-avatar-picker [data-avatar-id]", elements => elements.length), 11);
            const previewSources = await page.$$eval('#profile-avatar-picker .profile-avatar-option img', images => images.map(image => image.getAttribute('src')));
            await page.click('#profile-avatar-picker [data-avatar-id="lab-ajolote-lima"]');
            assert.equal(await page.$eval("#avatar-picker-modal", element => element.classList.contains("active")), true);
            await page.click('#profile-avatar-picker [data-avatar-color="menta"]');
            assert.deepEqual(await page.$$eval('#profile-avatar-picker .profile-avatar-option img', images => images.map(image => image.getAttribute('src'))), previewSources,
                'Changing the selected color must preserve the ten distinct menu colors');
            assert.match(await page.$eval('.profile-avatar-selection img', image => image.getAttribute('src')), /ajolote-menta\.svg/);
            assert.equal(await page.evaluate(() => localStorage.getItem("enarm_profile_avatar")), "lab-ajolote-menta");
            assert.equal(await page.$eval('#profile-avatar-picker [data-avatar-color="menta"]', element => element.getAttribute("aria-pressed")), "true");
            await page.click('#profile-avatar-picker [data-avatar-color="blanco"]');
            assert.match(await page.$eval('.profile-avatar-selection img', image => image.getAttribute('src')), /ajolote-blanco\.svg/);
            assert.equal(await page.evaluate(() => localStorage.getItem("enarm_profile_avatar")), "lab-ajolote-blanco");
            await page.click('#profile-avatar-picker [data-avatar-color="menta"]');
            const publicMarkup = await page.evaluate(() => __avatarTest.getProfileAvatarMarkup(__avatarTest.State.userAvatar, "AT"));
            assert.match(publicMarkup, /ajolote-menta\.svg/);
            await page.evaluate(() => { __avatarTest.State.userAvatar = ""; __avatarTest.loadGlobalStats(); });
            assert.equal(await page.evaluate(() => __avatarTest.State.userAvatar), "lab-ajolote-menta");
            await page.waitForFunction(() => [...document.querySelectorAll("#profile-avatar-picker img")].every(image => image.complete && image.naturalWidth > 0));
            assert.equal(await page.$eval(".avatar-picker-modal-card", element => element.scrollWidth > element.clientWidth), false);
            assert.equal(await page.$eval("#btn-avatar-picker-done", element => {
                element.scrollIntoView({ block: "nearest" });
                const rect = element.getBoundingClientRect();
                return element.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
            }), true, "Done must appear above mobile navigation and the floating timer");
            assert.equal(await page.$(".avatar-lab-link"), null);
            await page.screenshot({ path: path.join(output, `selector-${width}.png`) });
            await page.click("#btn-avatar-picker-done");
            assert.equal(await page.$eval("#avatar-picker-modal", element => element.classList.contains("active")), false);
            assert.deepEqual(errors, []);
            console.log(`${width}px: 10 designs, color, persistence, public profile rendering, Done and no overflow: OK`);
            await page.close();
        }
        const page = await browser.newPage();
        await page.setViewport({ width: 1400, height: 780, deviceScaleFactor: 1 });
        await page.setContent(`<html><style>body{margin:0;padding:48px;background:#10151c;color:#e9eef5;font-family:Arial,sans-serif}h1{font-size:30px;margin:0 0 8px}p{color:#9aabbf;margin:0 0 30px}.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:18px}.card{text-align:center;border:1px solid #283341;border-radius:24px;background:#19212b;padding:8px 0 16px}.card img{width:190px;height:190px}.name{font-size:15px;font-weight:700}</style><h1>Los nuevos avatares de ENARMAX</h1><p>10 personajes · luz suave · color personalizable</p><div class="grid">${PROFILE_AVATARS.map(avatar => `<div class="card"><img src="${origin}/avatars/procedural/${avatar.id}-${avatar.color}.svg"><div class="name">${avatar.label}</div></div>`).join("")}</div></html>`);
        await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
        await page.screenshot({ path: path.join(output, "catalog.png") });
        console.log("110 shaded SVG assets checked, including white. Preview: " + path.join(output, "catalog.png"));
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
