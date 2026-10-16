'use strict';
// Packaged inside the Functions source directory by Firebase.
async function assertCallableSession(db, request, transaction) {
    const uid = request.auth?.uid;
    const sid = request.auth?.token?.enarmaxSid;
    const ref = db.doc(`account_sessions/${uid || '_unauthenticated'}`);
    const snapshot = transaction ? await transaction.get(ref) : await ref.get();
    if (!sid || !snapshot.exists || snapshot.data().sid !== sid) {
        const { HttpsError } = require('firebase-functions/v2/https');
        throw new HttpsError('permission-denied', 'La sesión de esta cuenta ya no está autorizada.');
    }
}
module.exports = { assertCallableSession };
