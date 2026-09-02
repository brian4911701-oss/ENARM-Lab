const admin = require("firebase-admin");

const TRIAL_DURATION_MS = 3 * 24 * 60 * 60 * 1000;

function getFirestore() {
    if (!admin.apps.length) {
        const rawCredential = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
        if (!rawCredential) throw new Error("firebase_service_account_missing");
        admin.initializeApp({ credential: admin.credential.cert(JSON.parse(rawCredential)) });
    }
    return admin.firestore();
}

function sendJson(response, status, data) {
    response.setHeader("Cache-Control", "no-store");
    response.status(status).json(data);
}

module.exports = async (request, response) => {
    if (request.method !== "POST") {
        response.setHeader("Allow", "POST");
        return sendJson(response, 405, { code: "method-not-allowed", message: "Método no permitido." });
    }

    const token = String(request.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
    if (!token) return sendJson(response, 401, { code: "unauthenticated", message: "Inicia sesión para activar la prueba." });

    try {
        const db = getFirestore();
        const decoded = await admin.auth().verifyIdToken(token);
        const uid = decoded.uid;
        const trialRef = db.collection("premium_trials").doc(uid);
        const entitlementRef = db.collection("entitlements").doc(uid);

        const trial = await db.runTransaction(async (transaction) => {
            const [trialSnap, entitlementSnap] = await Promise.all([
                transaction.get(trialRef),
                transaction.get(entitlementRef)
            ]);
            if (trialSnap.exists) {
                const error = new Error("already-used");
                error.code = "already-used";
                throw error;
            }

            const entitlement = entitlementSnap.exists ? (entitlementSnap.data() || {}) : {};
            const currentExpiry = entitlement.expiresAt?.toDate?.().getTime?.() || new Date(entitlement.expiresAt || 0).getTime();
            if (entitlement.status === "active" && (!currentExpiry || currentExpiry > Date.now())) {
                const error = new Error("already-premium");
                error.code = "already-premium";
                throw error;
            }

            const startedAt = new Date();
            const expiresAt = new Date(startedAt.getTime() + TRIAL_DURATION_MS);
            transaction.create(trialRef, { uid, status: "used", startedAt, expiresAt, durationDays: 3 });
            transaction.set(entitlementRef, {
                status: "active",
                source: "premium_trial",
                planId: "premium_trial_3d",
                activatedAt: startedAt,
                expiresAt,
                updatedAt: startedAt
            }, { merge: true });
            return { expiresAt, durationDays: 3 };
        });

        return sendJson(response, 200, { durationDays: trial.durationDays, expiresAt: trial.expiresAt.toISOString() });
    } catch (error) {
        if (error?.code === "already-used") {
            return sendJson(response, 409, { code: "already-used", message: "Esta cuenta ya utilizó su prueba Premium." });
        }
        if (error?.code === "already-premium") {
            return sendJson(response, 409, { code: "already-premium", message: "Tu cuenta ya tiene acceso Premium activo." });
        }
        if (error?.code === "auth/argument-error" || error?.code === "auth/id-token-expired" || error?.code === "auth/invalid-id-token") {
            return sendJson(response, 401, { code: "unauthenticated", message: "Vuelve a iniciar sesión e intenta de nuevo." });
        }
        console.error("No se pudo activar la prueba Premium:", error);
        return sendJson(response, 500, { code: "premium_trial_unavailable", message: "No pudimos activar la prueba. Intenta de nuevo." });
    }
};
