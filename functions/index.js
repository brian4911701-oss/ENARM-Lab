const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

const db = getFirestore();
const PUSH_TOKEN_COLLECTION = "user_push_tokens";
const ADMIN_UIDS = new Set(["sZcIUjjhD0fze7FtirwsjsIDzLB2"]);
const PREMIUM_TRIAL_DURATION_MS = 3 * 24 * 60 * 60 * 1000;

exports.startPremiumTrial = onCall(async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
        throw new HttpsError("unauthenticated", "Inicia sesión para activar la prueba.");
    }

    const trialRef = db.collection("premium_trials").doc(uid);
    const entitlementRef = db.collection("entitlements").doc(uid);

    try {
        return await db.runTransaction(async (transaction) => {
            const [trialSnap, entitlementSnap] = await Promise.all([
                transaction.get(trialRef),
                transaction.get(entitlementRef)
            ]);

            if (trialSnap.exists) {
                throw new HttpsError("already-exists", "Esta cuenta ya utilizó su prueba Premium.");
            }

            const entitlement = entitlementSnap.exists ? (entitlementSnap.data() || {}) : {};
            const currentExpiry = entitlement.expiresAt?.toDate?.().getTime?.()
                || new Date(entitlement.expiresAt || 0).getTime();
            if (entitlement.status === "active" && (!currentExpiry || currentExpiry > Date.now())) {
                throw new HttpsError("failed-precondition", "Tu cuenta ya tiene acceso Premium activo.");
            }

            const startedAt = new Date();
            const expiresAt = new Date(startedAt.getTime() + PREMIUM_TRIAL_DURATION_MS);
            transaction.create(trialRef, { uid, status: "used", startedAt, expiresAt, durationDays: 3 });
            transaction.set(entitlementRef, {
                status: "active",
                source: "premium_trial",
                planId: "premium_trial_3d",
                activatedAt: startedAt,
                expiresAt,
                updatedAt: startedAt
            }, { merge: true });

            return { durationDays: 3, expiresAt: expiresAt.toISOString() };
        });
    } catch (error) {
        if (error instanceof HttpsError) throw error;
        logger.error("No se pudo activar la prueba Premium", { uid, error: error?.message || String(error) });
        throw new HttpsError("internal", "No pudimos activar la prueba. Intenta de nuevo.");
    }
});

exports.listAdminUsers = onCall(async (request) => {
    const requesterUid = request.auth && request.auth.uid;
    if (!requesterUid) {
        throw new HttpsError("unauthenticated", "Debes iniciar sesión para consultar usuarios.");
    }
    if (!ADMIN_UIDS.has(requesterUid)) {
        throw new HttpsError("permission-denied", "Solo el administrador puede consultar usuarios.");
    }

    const users = [];
    let pageToken;
    do {
        const page = await getAuth().listUsers(1000, pageToken);
        page.users.forEach((userRecord) => {
            users.push({
                uid: userRecord.uid,
                email: String(userRecord.email || "").slice(0, 160),
                username: String(userRecord.displayName || userRecord.email?.split("@")[0] || "Aspirante").slice(0, 120),
                authCreatedAt: userRecord.metadata.creationTime || "",
                lastSignInAt: userRecord.metadata.lastSignInTime || "",
                disabled: userRecord.disabled === true
            });
        });
        pageToken = page.pageToken;
    } while (pageToken);

    users.sort((a, b) => {
        const aTime = new Date(a.authCreatedAt).getTime() || 0;
        const bTime = new Date(b.authCreatedAt).getTime() || 0;
        return bTime - aTime;
    });

    return { users, total: users.length };
});

function getAppBaseUrl() {
    if (process.env.ENARM_APP_URL) {
        return String(process.env.ENARM_APP_URL).replace(/\/+$/, "");
    }
    const projectId = process.env.GCLOUD_PROJECT || "enarm-lab-social";
    return `https://${projectId}.web.app`;
}

function stringifyData(data) {
    const out = {};
    Object.entries(data || {}).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        out[key] = String(value);
    });
    return out;
}

async function getTokenDocsForUser(uid) {
    const snap = await db.collection(PUSH_TOKEN_COLLECTION).where("uid", "==", uid).get();
    const tokenDocs = [];
    snap.forEach((docSnap) => {
        const data = docSnap.data() || {};
        if (data.enabled === false) return;
        if (!data.token) return;
        tokenDocs.push({
            docId: docSnap.id,
            token: data.token
        });
    });
    return tokenDocs;
}

async function getAllActiveTokenDocs() {
    const snap = await db.collection(PUSH_TOKEN_COLLECTION).get();
    const tokenDocs = [];
    snap.forEach((docSnap) => {
        const data = docSnap.data() || {};
        if (data.enabled === false) return;
        if (!data.token) return;
        tokenDocs.push({
            docId: docSnap.id,
            token: data.token
        });
    });
    return tokenDocs;
}

async function cleanupInvalidTokens(tokenDocs, response) {
    if (!response || !Array.isArray(response.responses)) return;
    const invalidCodes = new Set([
        "messaging/registration-token-not-registered",
        "messaging/invalid-registration-token"
    ]);

    const deletes = [];
    response.responses.forEach((result, index) => {
        if (!result || result.success || !result.error) return;
        const code = result.error.code || "";
        if (!invalidCodes.has(code)) return;
        const tokenDoc = tokenDocs[index];
        if (!tokenDoc) return;
        deletes.push(db.collection(PUSH_TOKEN_COLLECTION).doc(tokenDoc.docId).delete());
    });
    await Promise.all(deletes);
}

function buildPushMessage(tokenDocs, payload) {
    if (!Array.isArray(tokenDocs) || tokenDocs.length === 0) return null;

    const appBaseUrl = getAppBaseUrl();
    const link = `${appBaseUrl}/`;
    const data = stringifyData({
        kind: payload.kind,
        title: payload.title,
        body: payload.body,
        link,
        entityId: payload.entityId || ""
    });

    return {
        tokens: tokenDocs.map((entry) => entry.token),
        data,
        webpush: {
            headers: {
                Urgency: "high"
            },
            fcmOptions: {
                link
            }
        },
        android: {
            priority: "high"
        }
    };
}

async function sendPushToTokenDocs(tokenDocs, payload) {
    const deduped = [];
    const seenTokens = new Set();
    (tokenDocs || []).forEach((entry) => {
        if (!entry || !entry.token || seenTokens.has(entry.token)) return;
        seenTokens.add(entry.token);
        deduped.push(entry);
    });

    if (deduped.length === 0) {
        return { totalTokens: 0, successCount: 0, failureCount: 0 };
    }

    let successCount = 0;
    let failureCount = 0;
    for (let i = 0; i < deduped.length; i += 500) {
        const batch = deduped.slice(i, i + 500);
        const message = buildPushMessage(batch, payload);
        if (!message) continue;
        const response = await getMessaging().sendEachForMulticast(message);
        await cleanupInvalidTokens(batch, response);
        successCount += response.successCount || 0;
        failureCount += response.failureCount || 0;
    }

    return {
        totalTokens: deduped.length,
        successCount,
        failureCount
    };
}

async function sendPushToUsers(userIds, payload) {
    const dedupedUserIds = Array.from(new Set((userIds || []).filter(Boolean)));
    if (dedupedUserIds.length === 0) return;

    const tokenDocs = [];
    for (const uid of dedupedUserIds) {
        const docs = await getTokenDocsForUser(uid);
        tokenDocs.push(...docs);
    }

    if (tokenDocs.length === 0) {
        logger.info("No hay tokens push activos para los usuarios destino.", { userIds: dedupedUserIds });
        return;
    }

    const summary = await sendPushToTokenDocs(tokenDocs, payload);
    logger.info("Push enviado.", {
        requestedUsers: dedupedUserIds.length,
        tokens: summary.totalTokens,
        successCount: summary.successCount,
        failureCount: summary.failureCount,
        kind: payload.kind
    });
}

async function sendPushToAllUsers(payload) {
    const tokenDocs = await getAllActiveTokenDocs();
    if (tokenDocs.length === 0) {
        logger.info("No hay tokens push activos para envio global.", { kind: payload.kind });
        return { totalTokens: 0, successCount: 0, failureCount: 0 };
    }

    const summary = await sendPushToTokenDocs(tokenDocs, payload);
    logger.info("Push global enviado.", {
        tokens: summary.totalTokens,
        successCount: summary.successCount,
        failureCount: summary.failureCount,
        kind: payload.kind
    });
    return summary;
}

exports.sendFriendRequestPush = onDocumentCreated("friendRequests/{requestId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const data = snapshot.data() || {};
    if (!data.toId || !data.fromName) return;

    await sendPushToUsers([data.toId], {
        kind: "friend-request",
        title: "Nueva solicitud",
        body: `${data.fromName} quiere ser tu amigo.`,
        entityId: event.params.requestId
    });
});

exports.sendChallengePush = onDocumentCreated("challenges/{challengeId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const data = snapshot.data() || {};
    const challengerId = data.challengerId || "";
    const challengerName = data.challengerName || "Un amigo";
    const specialty = data.specialty || "un reto";
    const participantIds = Array.isArray(data.participantIds) ? data.participantIds : [];
    const recipients = participantIds.filter((uid) => uid && uid !== challengerId);

    if (recipients.length === 0) return;

    await sendPushToUsers(recipients, {
        kind: "challenge",
        title: "Tienes un reto",
        body: `${challengerName} te desafio en ${specialty}.`,
        entityId: event.params.challengeId
    });
});

exports.sendCommunityAnnouncementPush = onDocumentCreated("community_announcements/{announcementId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const announcementId = event.params.announcementId;
    const ref = db.collection("community_announcements").doc(announcementId);
    const liveSnap = await ref.get();
    if (!liveSnap.exists) return;

    const data = liveSnap.data() || {};
    if (data.pushSentAt) return;

    const rawMessage = String(data.message || "").trim();
    if (!rawMessage) return;

    const title = String(data.title || "Aviso ENARMax").slice(0, 70);
    const body = rawMessage.replace(/\s+/g, " ").slice(0, 240);

    const summary = await sendPushToAllUsers({
        kind: "community-announcement",
        title,
        body,
        entityId: announcementId
    });

    await ref.set({
        pushSentAt: new Date(),
        pushStats: {
            totalTokens: summary.totalTokens || 0,
            successCount: summary.successCount || 0,
            failureCount: summary.failureCount || 0
        }
    }, { merge: true });
});

// user_directory se crea desde el cliente al iniciar sesión. La fecha de Firebase Auth
// es la fuente confiable para el registro, por eso se completa desde un entorno administrador.
exports.syncUserAuthCreatedAt = onDocumentCreated("user_directory/{uid}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    try {
        const userRecord = await getAuth().getUser(event.params.uid);
        const authCreatedAt = new Date(userRecord.metadata.creationTime);
        if (Number.isNaN(authCreatedAt.getTime())) {
            logger.warn("No se pudo interpretar la fecha de registro de Firebase Auth.", { uid: event.params.uid });
            return;
        }
        await snapshot.ref.set({
            authCreatedAt,
            authCreatedAtSyncedAt: new Date()
        }, { merge: true });
    } catch (err) {
        logger.error("No se pudo sincronizar la fecha de registro desde Firebase Auth.", {
            uid: event.params.uid,
            error: err && err.message ? err.message : String(err)
        });
    }
});
