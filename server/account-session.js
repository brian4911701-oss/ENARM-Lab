'use strict';
const crypto = require('node:crypto');
const LEASE_MS = 10 * 60 * 1000;
const fail = (code, status = 403) => { throw Object.assign(new Error(code), { code, status }); };
const sessionRef = (db, uid) => db.doc(`account_sessions/${uid}`);
// This read MUST be part of the same transaction as every protected Admin write.
async function assertSession(tx, db, claims) {
    const snapshot = await tx.get(sessionRef(db, claims.uid));
    if (!claims.enarmaxSid || !snapshot.exists || snapshot.data().sid !== claims.enarmaxSid) fail('session-replaced');
    return snapshot.data();
}
function createAccountSessions(db, auth, options = {}) {
    const now = options.now || Date.now;
    return async (claims, body) => {
        const instant = now();
        const ref = sessionRef(db, claims.uid);
        const presenceRef = db.doc(`account_presence/${claims.uid}`);
        if (body.action === 'reauthenticate') {
            // Both a still-authorized session and a freshly authenticated identity are required.
            const fresh = await auth.verifyIdToken(body.reauthenticationToken, true);
            if (fresh.uid !== claims.uid || instant / 1000 - fresh.auth_time > 300) fail('recent-login-required', 401);
            await db.runTransaction(tx => assertSession(tx, db, claims));
            return { token: await auth.createCustomToken(claims.uid, { enarmaxSid: claims.enarmaxSid }) };
        }
        if (body.action === 'open') {
            // A saved custom-token/refresh-token session can validate itself, never acquire control.
            if (claims.enarmaxSid) fail('explicit-login-required', 401);
            if (!Number.isFinite(claims.auth_time) || instant / 1000 - claims.auth_time > 300) fail('recent-login-required', 401);
            if (!/^[a-zA-Z0-9_-]{20,100}$/.test(body.deviceId || '')) fail('invalid-device', 400);
            const sid = crypto.randomUUID();
            // Sign before committing: a signing/configuration failure must not evict anyone.
            const token = await auth.createCustomToken(claims.uid, { enarmaxSid: sid });
            const result = await db.runTransaction(async tx => {
                const [snap, presenceSnap] = await Promise.all([tx.get(ref), tx.get(presenceRef)]);
                const previous = snap.exists ? snap.data() : {};
                const presence = presenceSnap.exists ? presenceSnap.data() : {};
                if (previous.deleting) fail('account-deleting');
                const revision = previous.revision || 0;
                // Confirmation is a compare-and-swap. A concurrent login cannot silently win twice.
                if (body.expectedRevision !== undefined && body.expectedRevision !== revision) fail('session-changed', 409);
                if (previous.sid && presence.sid === previous.sid && presence.expiresAt > instant && body.expectedRevision === undefined) {
                    return { conflict: true, revision };
                }
                tx.set(ref, { sid, deviceId: body.deviceId, revision: revision + 1, startedAt: instant });
                tx.set(presenceRef, { sid, expiresAt: instant + LEASE_MS });
                return { sid, token };
            });
            return result;
        }
        return db.runTransaction(async tx => {
            const active = await assertSession(tx, db, claims);
            if (body.action === 'check') {
                // Expiry only determines abandoned presence. The same session may renew until replaced.
                const presence = await tx.get(presenceRef);
                if (!presence.exists || presence.data().expiresAt - instant < LEASE_MS - 120000) {
                    tx.set(presenceRef, { sid: active.sid, expiresAt: instant + LEASE_MS });
                }
                return { valid: true, sid: active.sid };
            }
            if (body.action === 'logout') {
                tx.update(ref, { sid: null, revision: active.revision + 1 });
                tx.delete(presenceRef);
                return { released: true };
            }
            fail('unknown-action', 400);
        });
    };
}
module.exports = { createAccountSessions, assertSession, sessionRef, LEASE_MS };
