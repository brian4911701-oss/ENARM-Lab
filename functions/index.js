const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

const db = getFirestore();
const PUSH_TOKEN_COLLECTION = "user_push_tokens";

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

    const title = String(data.title || "Aviso ENARM Lab").slice(0, 70);
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
