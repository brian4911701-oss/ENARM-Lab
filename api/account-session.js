'use strict';
const admin = require('firebase-admin');
const { getFirestore, sendQuotaError } = require('../server/firestore-runtime');
const { createAccountSessions } = require('../server/account-session');
let execute;
module.exports = async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    if (request.method !== 'POST') { response.setHeader('Allow', 'POST'); return response.status(405).json({ code: 'method-not-allowed' }); }
    try {
        if (!admin.apps.length) {
            if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) return response.status(503).json({ code: 'session-backend-unconfigured' });
            admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)) });
        }
        const token = String(request.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
        if (!token) return response.status(401).json({ code: 'unauthenticated' });
        const claims = await admin.auth().verifyIdToken(token, true);
        const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
        if (!body || Buffer.byteLength(JSON.stringify(body)) > 8192) return response.status(400).json({ code: 'invalid-request' });
        execute ||= createAccountSessions(getFirestore(admin), admin.auth());
        return response.status(200).json(await execute(claims, body));
    } catch (error) {
        if (sendQuotaError(response, error)) return;
        const authError = String(error.code || '').startsWith('auth/');
        return response.status(authError ? 401 : error.status || 500).json({ code: authError ? 'unauthenticated' : error.code || 'session-unavailable' });
    }
};
