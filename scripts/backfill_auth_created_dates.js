/*
 * Sincroniza la fecha real de Firebase Authentication con user_directory.
 *
 * Uso:
 *   node scripts/backfill_auth_created_dates.js
 *   node scripts/backfill_auth_created_dates.js --write
 *   node scripts/backfill_auth_created_dates.js --email calebmata@live.com.mx
 *
 * Por defecto no escribe datos. Requiere credenciales de Firebase Admin, por ejemplo:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS='C:\ruta\service-account.json'
 */
const admin = require("../functions/node_modules/firebase-admin");

const WRITE = process.argv.includes("--write");
const emailFlagIndex = process.argv.indexOf("--email");
const TARGET_EMAIL = emailFlagIndex >= 0 ? String(process.argv[emailFlagIndex + 1] || "").trim().toLowerCase() : "";
const PROJECT_ID = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || "enarm-lab-social";

if (!admin.apps.length) {
    admin.initializeApp({ projectId: PROJECT_ID });
}

const db = admin.firestore();
const auth = admin.auth();

const toDate = (value) => {
    if (!value) return null;
    if (typeof value.toDate === "function") return value.toDate();
    if (value instanceof Date) return value;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const displayDate = (value) => {
    const date = toDate(value);
    return date ? date.toLocaleString("es-MX") : "Sin fecha";
};

const getAuthCreatedAt = (userRecord) => {
    const date = new Date(userRecord?.metadata?.creationTime || "");
    return Number.isNaN(date.getTime()) ? null : date;
};

const getDirectoryCreateData = (userRecord, authCreatedAt, now) => ({
    uid: userRecord.uid,
    username: String(userRecord.displayName || userRecord.email?.split("@")[0] || "Aspirante").slice(0, 120),
    email: String(userRecord.email || "").slice(0, 160),
    createdAt: authCreatedAt,
    authCreatedAt,
    authCreatedAtSyncedAt: now
});

async function auditUserByEmail(email) {
    const userRecord = await auth.getUserByEmail(email);
    const [directorySnap, entitlementSnap, paymentsSnap, codesSnap] = await Promise.all([
        db.collection("user_directory").doc(userRecord.uid).get(),
        db.collection("entitlements").doc(userRecord.uid).get(),
        db.collection("manual_payment_requests").where("uid", "==", userRecord.uid).get(),
        db.collection("redeem_codes").where("redeemedBy", "==", userRecord.uid).get()
    ]);
    const entitlement = entitlementSnap.exists ? (entitlementSnap.data() || {}) : null;
    const payments = paymentsSnap.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() || {}) }));
    const codes = codesSnap.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() || {}) }));
    const directory = directorySnap.exists ? (directorySnap.data() || {}) : null;

    console.log(JSON.stringify({
        uid: userRecord.uid,
        email: userRecord.email || "",
        firebaseAuthCreatedAt: displayDate(getAuthCreatedAt(userRecord)),
        directory: directory ? {
            createdAt: displayDate(directory.createdAt),
            authCreatedAt: displayDate(directory.authCreatedAt),
            username: directory.username || ""
        } : null,
        entitlement: entitlement ? {
            status: entitlement.status || "",
            source: entitlement.source || "",
            activatedAt: displayDate(entitlement.activatedAt),
            expiresAt: displayDate(entitlement.expiresAt),
            manualPaymentRequestId: entitlement.manualPaymentRequestId || ""
        } : null,
        manualPayments: payments.map((payment) => ({
            id: payment.id,
            status: payment.status || "",
            createdAt: displayDate(payment.createdAt),
            reviewedAt: displayDate(payment.reviewedAt),
            planId: payment.planId || ""
        })),
        redeemedCodes: codes.map((code) => ({
            code: code.code || code.id,
            redeemedAt: displayDate(code.redeemedAt),
            expiresAt: displayDate(code.expiresAt)
        }))
    }, null, 2));
}

async function backfillAllDirectories() {
    const [leaderboardSnap, directorySnap, newestDirectorySnap] = await Promise.all([
        db.collection("leaderboard").get(),
        db.collection("user_directory").get(),
        db.collection("user_directory").orderBy("createdAt", "desc").limit(16).get()
    ]);
    const leaderboardByUid = new Map(leaderboardSnap.docs.map((docSnap) => [docSnap.id, docSnap.data() || {}]));
    const directoryByUid = new Map(directorySnap.docs.map((docSnap) => [docSnap.id, docSnap.data() || {}]));
    let pageToken;
    let scannedAuthUsers = 0;
    let authUsers = 0;
    let planned = 0;
    let written = 0;
    const now = new Date();
    let batch = db.batch();
    let batchCount = 0;

    const commitBatch = async () => {
        if (!batchCount) return;
        if (WRITE) {
            await batch.commit();
            written += batchCount;
        }
        batch = db.batch();
        batchCount = 0;
    };

    do {
        const page = await auth.listUsers(1000, pageToken);
        pageToken = page.pageToken;
        for (const userRecord of page.users) {
            scannedAuthUsers += 1;
            authUsers += 1;
            const leaderboard = leaderboardByUid.get(userRecord.uid) || {};
            const authCreatedAt = getAuthCreatedAt(userRecord);
            if (!authCreatedAt) {
                console.warn("Omitido: Firebase Auth no devolvió una fecha válida.", { uid: userRecord.uid });
                continue;
            }
            const directoryRef = db.collection("user_directory").doc(userRecord.uid);
            const existing = directoryByUid.get(userRecord.uid) || null;
            const currentAuthDate = toDate(existing?.authCreatedAt);
            const currentCreatedAt = toDate(existing?.createdAt);
            const hasCorrectDates = currentAuthDate?.getTime() === authCreatedAt.getTime()
                && currentCreatedAt?.getTime() === authCreatedAt.getTime();
            const expectedUsername = String(leaderboard.username || userRecord.displayName || userRecord.email?.split("@")[0] || "Aspirante").slice(0, 120);
            const expectedEmail = String(userRecord.email || "").slice(0, 160);
            const hasCorrectProfile = existing?.uid === userRecord.uid
                && existing?.username === expectedUsername
                && existing?.email === expectedEmail;
            if (hasCorrectDates && hasCorrectProfile) continue;

            const patch = getDirectoryCreateData({
                ...userRecord,
                displayName: expectedUsername
            }, authCreatedAt, now);
            planned += 1;
            console.log(`${WRITE ? "Se actualizará" : "Se actualizaría"} ${userRecord.email || userRecord.uid}: ${displayDate(authCreatedAt)}`);
            if (WRITE) {
                batch.set(directoryRef, patch, { merge: true });
                batchCount += 1;
                if (batchCount >= 400) await commitBatch();
            }
        }
    } while (pageToken);

    await commitBatch();
    const newestDates = newestDirectorySnap.docs.map((docSnap) => toDate(docSnap.data()?.createdAt)?.getTime() || 0);
    const newestPageSorted = newestDates.every((value, index) => index === 0 || newestDates[index - 1] >= value);
    console.log("Resumen:", {
        mode: WRITE ? "ESCRITURA" : "SIMULACIÓN",
        scannedAuthUsers,
        authUsers,
        directoryUsers: directorySnap.size,
        newestPageUsers: newestDirectorySnap.size,
        newestPageSorted,
        planned,
        written
    });
    if (!WRITE) console.log("Simulación terminada. Ejecuta con --write solo después de revisar el resultado.");
}

async function main() {
    if (TARGET_EMAIL) {
        await auditUserByEmail(TARGET_EMAIL);
        return;
    }
    await backfillAllDirectories();
}

main().catch((err) => {
    console.error("No se pudo consultar Firebase Admin:", err && err.message ? err.message : err);
    process.exit(1);
});
