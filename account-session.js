// Firebase persistence is shared by tabs. The signed session claim is the credential;
// the installation ID is only a browser label, never an authorization secret.
(function (root) {
    function create({ fb, storage, confirmReplacement, onLost, onCancel, onError, request = root.fetch.bind(root) }) {
        let pending, unsubscribe, interval, sid = '', lost = false;
        let deviceId = storage.getItem('enarmax_device_id');
        if (!deviceId) { deviceId = root.crypto.randomUUID(); storage.setItem('enarmax_device_id', deviceId); }
        const call = async (user, body, previousToken) => {
            const response = await request('/api/account-session', { method: 'POST', cache: 'no-store',
                signal: AbortSignal.timeout(15000),
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (previousToken || await user.getIdToken()) }, body: JSON.stringify(body) });
            const data = await response.json();
            if (!response.ok) throw Object.assign(new Error(data.code), { code: data.code });
            return data;
        };
        function stop() { unsubscribe?.(); unsubscribe = null; clearInterval(interval); interval = null; sid = ''; }
        async function invalidate(notify = true) {
            if (lost) return;
            lost = true; stop();
            await fb.signOut(fb.auth);
            if (notify) onLost();
        }
        async function check() {
            const user = fb.auth.currentUser;
            const checkedSid = sid;
            if (!user || !sid) return false;
            try { await call(user, { action: 'check' }); return true; }
            catch (error) {
                if (checkedSid !== sid || fb.auth.currentUser?.uid !== user.uid) return false;
                if (['session-replaced', 'unauthenticated'].includes(error.code)) await invalidate();
                else onError?.(error);
                return false;
            }
        }
        function watch(user, value) {
            if (sid === value && unsubscribe) return;
            stop(); sid = value; lost = false;
            unsubscribe = fb.onSnapshot(fb.doc(fb.db, 'account_sessions', user.uid), snapshot => {
                if (!snapshot.metadata.fromCache && snapshot.data()?.sid !== value) void invalidate(!!snapshot.data()?.sid);
            }, error => { if (error.code === 'permission-denied') void invalidate(); else onError?.(error); });
            interval = setInterval(() => {
                const key = 'enarmax_presence:' + value;
                if (root.navigator?.onLine === false || Date.now() - Number(storage.getItem(key) || 0) < 110000) return;
                storage.setItem(key, String(Date.now()));
                void check();
            }, 120000);
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
        return { ensure, check, logout, stop, invalidate, reauthorize, get sid() { return sid; } };
    }
    root.ENARMAccountSession = { create };
    if (typeof module !== 'undefined') module.exports = { create };
})(typeof globalThis !== 'undefined' ? globalThis : window);
