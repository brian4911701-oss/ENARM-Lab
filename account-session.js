// Firebase persistence is shared by tabs. The signed session claim is the credential;
// the installation ID is only a browser label, never an authorization secret.
(function (root) {
    const messageFor = error => {
        const code = error?.code;
        if (code === 'firestore-quota-exceeded') return 'El servicio alcanzó su límite temporal de uso. Intenta más tarde. Tus datos guardados se conservan.';
        if (code === 'session-timeout') return 'El servicio de acceso tardó demasiado en responder. Intenta de nuevo en unos minutos.';
        if (['session-backend-unconfigured', 'session-unavailable', 'session-invalid-response'].includes(code)) return 'El servicio de acceso no está disponible temporalmente. Intenta más tarde.';
        if (['session-changed', 'recent-login-required', 'explicit-login-required'].includes(code)) return 'Vuelve a iniciar sesión. La sesión de la cuenta cambió.';
        if (['session-network-error', 'auth/network-request-failed'].includes(code)) return 'No pudimos conectar con el servicio de acceso. Revisa tu conexión e inténtalo de nuevo.';
        return 'No pudimos validar tu sesión. Intenta de nuevo en unos minutos.';
    };
    function create({ fb, storage, confirmReplacement, onLost, onCancel, onError, request = root.fetch.bind(root) }) {
        let pending, checking, unsubscribe, interval, sid = '', lost = false;
        let retryAt = 0, retryError;
        let deviceId = storage.getItem('enarmax_device_id');
        if (!deviceId) { deviceId = root.crypto.randomUUID(); storage.setItem('enarmax_device_id', deviceId); }
        const call = async (user, body, previousToken) => {
            if (Date.now() < retryAt && body.action !== 'logout') throw retryError;
            const token = previousToken || await user.getIdToken();
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 20000);
            try {
                let response;
                try {
                    response = await request('/api/account-session', { method: 'POST', cache: 'no-store', signal: controller.signal,
                        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(body) });
                } catch (error) {
                    throw Object.assign(new Error(error.message), { code: controller.signal.aborted ? 'session-timeout' : 'session-network-error' });
                }
                let data;
                try { data = await response.json(); }
                catch { throw Object.assign(new Error('session-invalid-response'), { code: 'session-invalid-response' }); }
                if (!response.ok) {
                    const code = data.code || (response.status === 429 ? 'firestore-quota-exceeded' : 'session-unavailable');
                    const error = Object.assign(new Error(code), { code });
                    if (code === 'firestore-quota-exceeded') {
                        retryAt = Date.now() + Math.min(600, Math.max(30, Number(data.retryAfterSeconds) || 300)) * 1000;
                        retryError = error;
                    }
                    throw error;
                }
                return data;
            } finally { clearTimeout(timeout); }
        };
        function stop() { unsubscribe?.(); unsubscribe = null; clearInterval(interval); interval = null; sid = ''; }
        async function invalidate(notify = true) {
            if (lost) return;
            lost = true; stop();
            await fb.signOut(fb.auth);
            if (notify) onLost();
        }
        function check() {
            const user = fb.auth.currentUser;
            const checkedSid = sid;
            if (!user || !sid) return Promise.resolve(false);
            if (checking?.sid === sid && checking.uid === user.uid) return checking.promise;
            const entry = { sid, uid: user.uid };
            entry.promise = (async () => {
                try {
                    await call(user, { action: 'check' });
                    return checkedSid === sid && fb.auth.currentUser?.uid === user.uid;
                } catch (error) {
                    if (checkedSid !== sid || fb.auth.currentUser?.uid !== user.uid) return false;
                    if (['session-replaced', 'unauthenticated'].includes(error.code)) await invalidate();
                    else onError?.(error);
                    return false;
                }
            })().finally(() => { if (checking === entry) checking = null; });
            checking = entry;
            return entry.promise;
        }
        function guardListenerError(report) {
            const uid = fb.auth.currentUser?.uid, subscribedSid = sid;
            const current = () => !!subscribedSid && subscribedSid === sid && fb.auth.currentUser?.uid === uid;
            return async error => {
                if (!current()) return;
                const permissionDenied = /permission-denied|missing or insufficient permissions/i.test(String(error.code || error.message || ''));
                // Permission errors can arrive before the authority listener reports replacement.
                if (permissionDenied && !await check()) return;
                if (current()) report(error);
            };
        }
        function watch(user, value) {
            if (sid === value && unsubscribe) return;
            stop(); sid = value; lost = false;
            unsubscribe = fb.onSnapshot(fb.doc(fb.db, 'account_sessions', user.uid), snapshot => {
                if (!snapshot.metadata.fromCache && snapshot.data()?.sid !== value) void invalidate(!!snapshot.data()?.sid);
            }, error => { if (error.code === 'permission-denied') void invalidate(); else onError?.(error); });
            interval = setInterval(() => {
                const key = 'enarmax_presence:' + value;
                if (root.navigator?.onLine === false || root.document?.visibilityState === 'hidden'
                    || Date.now() - Number(storage.getItem(key) || 0) < 230000) return;
                try { storage.setItem(key, String(Date.now())); } catch { /* Scheduling cache never grants authorization. */ }
                void check();
            }, 240000);
        }
        async function ensure(user) {
            if (pending) return pending;
            pending = (async () => {
                let claims = (await user.getIdTokenResult()).claims;
                if (!claims.enarmaxSid) {
                    let result = await call(user, { action: 'open', deviceId });
                    if (result.conflict) {
                        if (!await confirmReplacement()) { await fb.signOut(fb.auth); onCancel?.(); return false; }
                        result = await call(user, { action: 'open', deviceId, expectedRevision: result.revision });
                    }
                    await fb.signInWithCustomToken(fb.auth, result.token);
                    user = fb.auth.currentUser;
                    claims = (await user.getIdTokenResult()).claims;
                }
                watch(user, claims.enarmaxSid);
                // A temporary outage leaves persistence intact. No write can bypass server validation.
                await check();
                return !lost && fb.auth.currentUser?.uid === user.uid;
            })().catch(async error => {
                if (['session-replaced', 'explicit-login-required', 'recent-login-required', 'session-changed', 'unauthenticated'].includes(error.code)) {
                    stop(); await fb.signOut(fb.auth);
                }
                onError?.(error); return false;
            }).finally(() => { pending = null; });
            return pending;
        }
        async function logout() {
            const user = fb.auth.currentUser;
            stop();
            if (user) {
                try { await call(user, { action: 'logout' }); }
                catch (error) {
                    // Offline logout cannot release the server lease; it expires after ten minutes.
                    if (error.code !== 'session-replaced') onError?.(error);
                }
            }
            stop(); await fb.signOut(fb.auth);
        }
        async function reauthorize(previousToken, reauthenticationToken) {
            const user = fb.auth.currentUser;
            const result = await call(user, { action: 'reauthenticate', reauthenticationToken }, previousToken);
            await fb.signInWithCustomToken(fb.auth, result.token);
            return fb.auth.currentUser;
        }
        return { ensure, check, logout, stop, invalidate, reauthorize, guardListenerError, get sid() { return sid; } };
    }
    root.ENARMAccountSession = { create, messageFor };
    if (typeof module !== 'undefined') module.exports = { create, messageFor };
})(typeof globalThis !== 'undefined' ? globalThis : window);
