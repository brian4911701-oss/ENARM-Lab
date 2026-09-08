"use strict";

const { initializeAdmin, requireServiceAccountHint } = require("./security_admin_sdk");

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const scrubLegacy = args.includes("--scrub-legacy");
if (scrubLegacy && !apply) {
  console.error("--scrub-legacy requiere --apply.");
  process.exit(1);
}

const progressFields = [
  "theme", "fontPreset", "appearanceStr", "dailyPlanStr", "reviewQueueStr",
  "topicMasteryStr", "caseNotebookStr", "studyCalendarStr", "lastPostmortemStr",
  "pomodoroSettingsStr", "pomodoroLogStr", "pomodoroSpecialtiesStr",
  "pomodoroFocusLabel", "globalStatsStr", "historyStr", "reportsStr"
];

const normalizeUsername = (value) => {
  const cleaned = String(value || "Aspirante").trim().replace(/[^A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ _.-]/g, "").slice(0, 20);
  return cleaned.length >= 3 ? cleaned : "Aspirante";
};

const entitlementIsActive = (row) => {
  if (!row || row.status !== "active") return false;
  if (!row.expiresAt) return true;
  const date = typeof row.expiresAt.toDate === "function" ? row.expiresAt.toDate() : new Date(row.expiresAt);
  return Number.isFinite(date.getTime()) && date.getTime() > Date.now();
};

const computeScore = (legacy) => {
  if (Number.isFinite(Number(legacy.score))) return Math.max(0, Math.min(100, Number(legacy.score)));
  try {
    const stats = JSON.parse(legacy.globalStatsStr || "{}");
    const answered = Number(stats.respondidas) || 0;
    return answered > 0 ? Math.round((Number(stats.aciertos || 0) / answered) * 1000) / 10 : 0;
  } catch (_error) {
    return 0;
  }
};

async function commitOperations(db, operations) {
  for (let offset = 0; offset < operations.length; offset += 400) {
    const batch = db.batch();
    operations.slice(offset, offset + 400).forEach(({ ref, data, merge, remove }) => {
      if (remove) batch.delete(ref);
      else batch.set(ref, data, { merge: merge !== false });
    });
    await batch.commit();
  }
}

async function main() {
  requireServiceAccountHint();
  const { admin, db, projectId } = initializeAdmin();
  const [legacySnap, entitlementSnap, directorySnap, progressSnap, profileSnap, walletSnap] = await Promise.all([
    db.collection("leaderboard").get(),
    db.collection("entitlements").get(),
    db.collection("user_directory").get(),
    db.collection("user_progress").get(),
    db.collection("public_profiles").get(),
    db.collection("user_wallets").get()
  ]);
  const byId = (snap) => new Map(snap.docs.map((doc) => [doc.id, doc.data() || {}]));
  const entitlements = byId(entitlementSnap);
  const directories = byId(directorySnap);
  const existingProgress = byId(progressSnap);
  const existingProfiles = byId(profileSnap);
  const wallets = byId(walletSnap);
  const now = admin.firestore.FieldValue.serverTimestamp();
  const writes = [];
  let sensitiveLegacyDocuments = 0;

  for (const legacyDoc of legacySnap.docs) {
    const uid = legacyDoc.id;
    const legacy = legacyDoc.data() || {};
    const scoreVisible = legacy.scoreVisible === true || (legacy.scoreVisible === undefined && legacy.isScorePublic !== false);
    const profile = {
      uid,
      username: normalizeUsername(legacy.username),
      specialty: String(legacy.specialty || "").slice(0, 80),
      avatarId: String(legacy.avatarId || "").slice(0, 60),
      scoreVisible,
      score: scoreVisible ? computeScore(legacy) : null,
      isPremium: entitlementIsActive(entitlements.get(uid)),
      flame: Math.max(0, Math.min(100000, Math.floor(Number(legacy.flame) || 0))),
      updatedAt: now
    };
    const progress = {
      uid,
      schemaVersion: 1,
      createdAt: legacy.createdAt || existingProgress.get(uid)?.createdAt || now,
      updatedAt: now
    };
    progressFields.forEach((field) => {
      if (legacy[field] !== undefined) progress[field] = legacy[field];
    });
    const directory = {
      uid,
      username: profile.username,
      specialty: profile.specialty,
      avatarId: profile.avatarId,
      university: String(legacy.university || "").slice(0, 160),
      phone: String(legacy.phone || "").slice(0, 30),
      targetYear: String(legacy.targetYear || "").slice(0, 8),
      updatedAt: now
    };
    if (directory.phone || directory.university || progressFields.some((field) => legacy[field] !== undefined)) sensitiveLegacyDocuments += 1;
    writes.push({ ref: db.collection("public_profiles").doc(uid), data: profile });
    writes.push({ ref: db.collection("user_progress").doc(uid), data: progress });
    writes.push({ ref: db.collection("user_directory").doc(uid), data: { ...directories.get(uid), ...directory } });
    if (!wallets.has(uid) && (legacy.referralCode || Number(legacy.coins) > 0)) {
      writes.push({
        ref: db.collection("user_wallets").doc(uid),
        data: {
          uid,
          referralCode: String(legacy.referralCode || ""),
          coins: Math.max(0, Math.floor(Number(legacy.coins) || 0)),
          createdAt: legacy.createdAt || now,
          updatedAt: now
        }
      });
    }
  }

  console.log(JSON.stringify({
    projectId,
    mode: apply ? "apply" : "dry-run",
    scrubLegacy,
    legacyDocuments: legacySnap.size,
    sensitiveLegacyDocuments,
    existingPublicProfiles: existingProfiles.size,
    existingProgressDocuments: existingProgress.size,
    plannedWrites: writes.length,
    plannedLegacyDeletes: scrubLegacy ? legacySnap.size : 0
  }, null, 2));

  if (!apply) {
    console.log("Simulación terminada. No se escribió ni eliminó nada.");
    return;
  }
  await commitOperations(db, writes);
  const [profilesAfter, progressAfter] = await Promise.all([
    db.collection("public_profiles").get(),
    db.collection("user_progress").get()
  ]);
  const missingProfiles = legacySnap.docs.filter((doc) => !profilesAfter.docs.some((next) => next.id === doc.id));
  const missingProgress = legacySnap.docs.filter((doc) => !progressAfter.docs.some((next) => next.id === doc.id));
  if (missingProfiles.length || missingProgress.length) {
    throw new Error(`Verificación fallida: perfiles faltantes=${missingProfiles.length}, progreso faltante=${missingProgress.length}`);
  }
  console.log("Escritura y verificación completadas.");
  if (scrubLegacy) {
    await commitOperations(db, legacySnap.docs.map((doc) => ({ ref: doc.ref, remove: true })));
    console.log(`Colección legada limpiada: ${legacySnap.size} documentos eliminados después de verificar la migración.`);
  } else {
    console.log("leaderboard permanece en cuarentena. Repite con --apply --scrub-legacy tras validar la aplicación nueva.");
  }
}

main().catch((error) => {
  console.error(error.message || String(error));
  process.exitCode = 1;
});
