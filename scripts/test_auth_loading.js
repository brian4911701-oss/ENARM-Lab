"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const app = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
const slice = (start, end) => {
    const from = app.indexOf(start), to = app.indexOf(end, from);
    assert.ok(from >= 0 && to > from, `Missing application section: ${start}`);
    return app.slice(from, to);
};
const loading = slice('                const startupScreen = $("app-startup-screen");', '                const showAuthFromLanding =');
const restoration = slice('                    restoreAuthSession = async (user) => {', '                    window.FB.onAuthStateChanged(');
const login = slice('                async function handleSuccessLogin(', '\n            }\n        };\n\n        if (window.FB)');
const deferred = () => {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    return { promise, resolve, reject };
};
const drain = async () => { for (let i = 0; i < 30; i++) await Promise.resolve(); };

function runtime() {
    const timers = new Map(), notifications = [], storage = new Map();
    let timerId = 0;
    const doc = { activeElement: null };
    const element = () => {
        const classes = new Set(), attrs = new Map(), listeners = new Map();
        return {
            inert: false, hidden: true, disabled: false, textContent: "", innerHTML: "Google", style: {},
            classList: { add: (...values) => values.forEach(v => classes.add(v)), remove: (...values) => values.forEach(v => classes.delete(v)), contains: v => classes.has(v) },
            setAttribute: (key, value) => attrs.set(key, value), getAttribute: key => attrs.get(key),
            addEventListener: (type, fn) => listeners.set(type, fn),
            emit: type => listeners.get(type)?.(),
            focus() { doc.activeElement = this; }, contains(node) { return node === this; }, matches: () => true
        };
    };
    const ids = Object.fromEntries(["app-startup-screen", "app-startup-status", "app-startup-hint", "app-startup-retry", "auth-email", "btn-auth-submit"].map(id => [id, element()]));
    const authOverlay = element(), layout = element(), landingPage = element(), provider = element(), heading = element();
    authOverlay.classList.add("active");
    doc.body = element();
    doc.querySelector = selector => selector === ".app-layout" ? layout : selector === ".auth-provider-btn" ? provider : selector === "dialog[open]" ? null : heading;
    const popup = deferred(), authorization = deferred(), progress = deferred(), study = deferred();
    const user = { uid: "fixture-user", displayName: "Aspirante", email: "fixture@example.test", emailVerified: false };
    const account = { ensure: () => authorization.promise, stop() {} };
    const window = { requestAnimationFrame: fn => fn(), setTimeout: (fn, ms) => { const id = ++timerId; timers.set(id, { fn, ms }); return id; }, clearTimeout: id => timers.delete(id),
        location: { reload() {} }, FB: { auth: { currentUser: user }, googleProvider: {}, signInWithPopup: () => popup.promise, getAdditionalUserInfo: () => ({ isNewUser: false }) } };
    const State = { userName: "Aspirante", currentUid: "", theme: "ocean" };
    const noop = () => {};
    const context = { $, document: doc, window, State, landingPage, authOverlay, console: { error: noop },
        getAccountSession: () => account, localStorage: { getItem: key => storage.get(key), setItem: (k, v) => storage.set(k, v) }, sessionStorage: { getItem: () => null },
        applyTheme: noop, progressOutbox: { begin: noop }, capturePrivateProgress: () => ({}), refreshCurrentUserClaims: async () => {},
        syncAuthenticatedUI: () => authOverlay.classList.remove("active"), getPrivateUserSnapshot: () => progress.promise,
        restoreAuthenticatedProgress: async (_user, promise) => { await promise; State.progressRestoreReady = true; }, bootStudySession: () => study.promise,
        syncPendingReportsToCloud: noop, syncUserDirectory: noop, sendVerificationEmailIfDue: async () => true, syncReclassAccessUI: noop,
        trackEvent: noop, showNotification: (...args) => notifications.push(args), getGoogleAuthErrorMessage: error => error.code,
        getRedirectSupportState: () => ({ canUseRedirectFallback: false }) };
    function $(id) { return ids[id]; }
    vm.createContext(context);
    vm.runInContext(`${loading}\n let authRestoreGeneration = 0; let restoreAuthSession; ${restoration}\n${login}\n globalThis.api = { showStartupScreen, dismissStartupScreen, showStartupError, restoreAuthSession };`, context);
    return { ...context, ids, layout, authOverlay, provider, notifications, popup, authorization, progress, study, user, timers,
        fire(ms) { const entry = [...timers].find(([, value]) => value.ms === ms); assert.ok(entry, `Timer ${ms}ms exists`); timers.delete(entry[0]); entry[1].fn(); } };
}

test("Google loading reopens after startup and remains until authorization, progress and tools finish", async () => {
    const r = runtime(), screen = r.ids["app-startup-screen"];
    r.api.dismissStartupScreen();
    const login = r.provider.emit("click");
    assert.equal(screen.classList.contains("is-hidden"), false);
    assert.equal(r.ids["app-startup-status"].textContent, "Conectando con Google");
    assert.equal(r.authOverlay.inert, true);
    const restore = r.api.restoreAuthSession(r.user);
    r.popup.resolve({ user: r.user }); await drain();
    assert.equal(r.ids["app-startup-status"].textContent, "Validando tu sesión");
    r.authorization.resolve(true); await drain();
    assert.equal(screen.classList.contains("is-hidden"), false);
    assert.equal(r.ids["app-startup-status"].textContent, "Restaurando tu progreso");
    r.progress.resolve({}); await drain();
    assert.equal(screen.classList.contains("is-hidden"), false);
    assert.equal(r.ids["app-startup-status"].textContent, "Preparando tu inicio");
    r.study.resolve(); await Promise.all([login, restore]);
    assert.equal(screen.classList.contains("is-hidden"), true);
    assert.equal(screen.getAttribute("aria-busy"), "false");
    assert.equal(r.layout.inert, false);
    assert.equal(r.timers.size, 0, "No delayed dismissal or artificial wait remains");
});

test("popup failure and rejected account authorization restore the login controls", async () => {
    const r = runtime(); r.api.dismissStartupScreen();
    const login = r.provider.emit("click");
    r.popup.reject({ code: "auth/popup-closed-by-user" }); await login;
    assert.equal(r.ids["app-startup-screen"].classList.contains("is-hidden"), true);
    assert.equal(r.provider.disabled, false);
    assert.equal(r.authOverlay.inert, false);
    assert.equal(r.notifications.length, 1);
    const restore = r.api.restoreAuthSession(r.user);
    r.authorization.resolve(false); await restore;
    assert.equal(r.ids["app-startup-screen"].classList.contains("is-hidden"), true);
});

test("slow sign-in retains the skeleton and exposes a retry instead of the startup timeout", async () => {
    const r = runtime();
    const restore = r.api.restoreAuthSession(r.user);
    assert.equal([...r.timers.values()].some(timer => timer.ms === 2500), false);
    r.fire(12000);
    assert.equal(r.ids["app-startup-retry"].hidden, false);
    assert.match(r.ids["app-startup-hint"].textContent, /tardando/);
    assert.equal(r.ids["app-startup-screen"].classList.contains("is-hidden"), false);
    r.authorization.resolve(false); await restore;
    assert.equal(r.timers.size, 0);
});

test("restoration failure stops the shimmer state and keeps an actionable retry", async () => {
    const r = runtime(), restore = r.api.restoreAuthSession(r.user);
    r.authorization.resolve(true); await drain();
    r.progress.reject(new Error("offline")); await restore;
    const screen = r.ids["app-startup-screen"];
    assert.equal(screen.classList.contains("is-hidden"), false);
    assert.equal(screen.classList.contains("is-error"), true);
    assert.equal(screen.getAttribute("aria-busy"), "false");
    assert.equal(r.ids["app-startup-retry"].hidden, false);
});

test("an obsolete auth callback cannot dismiss a newer sign-in", async () => {
    const r = runtime(), gates = [deferred(), deferred()]; let run = 0;
    r.getAccountSession().ensure = () => gates[run++].promise;
    const first = r.api.restoreAuthSession(r.user), second = r.api.restoreAuthSession(r.user);
    gates[0].resolve(false); await first;
    assert.equal(r.ids["app-startup-screen"].classList.contains("is-hidden"), false);
    gates[1].resolve(true); r.progress.resolve({}); r.study.resolve(); await second;
    assert.equal(r.ids["app-startup-screen"].classList.contains("is-hidden"), true);
});
