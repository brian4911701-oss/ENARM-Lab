'use strict';
const admin = require('firebase-admin');
const { createStudyService } = require('../server/study-service');
let execute;
module.exports = async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    if (request.method !== 'POST') { response.setHeader('Allow', 'POST'); return response.status(405).json({ code: 'method-not-allowed' }); }
    try {
        const token = String(request.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
        if (!token) return response.status(401).json({ code: 'unauthenticated' });
        if (!admin.apps.length) {
            const credential = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
            if (!credential) return response.status(503).json({ code: 'study-backend-unconfigured' });
            admin.initializeApp({ credential: admin.credential.cert(JSON.parse(credential)) });
        }
        const claims = await admin.auth().verifyIdToken(token, true);
        if (!claims.email_verified) return response.status(403).json({ code: 'verify-email' });
        const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
        if (!body || Buffer.byteLength(JSON.stringify(body)) > 850000) return response.status(413).json({ code: 'payload-too-large' });
        if (body.action === 'purge' && Date.now() / 1000 - claims.auth_time > 300) return response.status(401).json({ code: 'recent-login-required' });
        execute ||= createStudyService(admin.firestore());
        const result = await execute(claims.uid, body, claims);
        if (result.purge) {
            const db = admin.firestore();
            for (const name of ['user_progress', 'active_exams', 'exam_payloads', 'exam_attempts', 'study_backups', 'study_devices']) await db.recursiveDelete(db.collection(name).doc(claims.uid));
            await db.collection('study_sessions').doc(claims.uid).delete();
        }
        return response.status(200).json(result);
    } catch (error) {
        const authError = String(error.code || '').startsWith('auth/');
        const status = authError ? 401 : error.status || 500;
        if (status === 500) console.error('Study sync failed:', error.code || error.message);
        return response.status(status).json({ code: authError ? 'unauthenticated' : status === 500 ? 'study-unavailable' : error.code });
    }
};
