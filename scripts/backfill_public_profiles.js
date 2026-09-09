/*
 * Crea un perfil público seguro para cada cuenta de Firebase Authentication.
 *
 * Por defecto sólo audita. Para escribir:
 *   node scripts/backfill_public_profiles.js --apply
 */
"use strict";

const { initializeAdmin, requireServiceAccountHint } = require("./security_admin_sdk");

const APPLY = process.argv.includes("--apply");

const normalizeUsername = (value) => {
  const cleaned = String(value || "Aspirante")
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N} _.-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 20);
  return cleaned.length >= 3 ? cleaned : "Aspirante";
};

const boundedScore = (value) => {
  const score = Number(value);
  return Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : null;
};

const legacyScore = (row) => {
  const direct = boundedScore(row?.score);
  if (direct !== null) return direct;
  try {
    const stats = JSON.parse(row?.globalStatsStr || "{}");
    const answered = Number(stats.respondidas) || 0;
    return answered > 0
      ? Math.round(((Number(stats.aciertos) || 0) / answered) * 1000) / 10
      : 0;
  } catch (_error) {
    return 0;
  }
};

const entitlementIsActive = (row) => {
  if (!row || row.status !== "active") return false;
  if (!row.expiresAt) return true;
  const expiresAt = typeof row.expiresAt.toDate === "function"
    ? row.expiresAt.toDate()
    : new Date(row.expiresAt);
  return Number.isFinite(expiresAt.getTime()) && expiresAt.getTime() > Date.now();
};

const byId = (snapshot) => new Map(snapshot.docs.map((doc) => [doc.id, doc.data() || {}]));

async function listAllAuthUsers(auth) {
  const users = [];
  let pageToken;
  do {
    const page = await auth.listUsers(1000, pageToken);
    users.push(...page.users);
    pageToken = page.pageToken;
  } while (pageToken);
  return users;
}

async function commitProfiles(db, profiles) {
  for (let offset = 0; offset < profiles.length; offset += 400) {
    const batch = db.batch();
    profiles.slice(offset, offset + 400).forEach(({ uid, data }) => {
      batch.set(db.collection("public_profiles").doc(uid), data, { merge: false });
    });
    await batch.commit();
  }
}

async function main() {
  requireServiceAccountHint();
  const { admin, auth, db, projectId } = initializeAdmin();
  const [authUsers, directorySnap, legacySnap, profileSnap, entitlementSnap] = await Promise.all([
    listAllAuthUsers(auth),
    db.collection("user_directory").get(),
    db.collection("leaderboard").get(),
    db.collection("public_profiles").get(),
    db.collection("entitlements").get()
  ]);

  const directories = byId(directorySnap);
  const legacyProfiles = byId(legacySnap);
  const existingProfiles = byId(profileSnap);
  const entitlements = byId(entitlementSnap);
  const now = admin.firestore.FieldValue.serverTimestamp();

  const profiles = authUsers.map((user) => {
    const existing = existingProfiles.get(user.uid) || {};
    const directory = directories.get(user.uid) || {};
    const legacy = legacyProfiles.get(user.uid) || {};
    const scoreVisible = typeof existing.scoreVisible === "boolean"
      ? existing.scoreVisible
      : (legacy.scoreVisible === true || (legacy.scoreVisible === undefined && legacy.isScorePublic !== false && legacyProfiles.has(user.uid)));
    const existingScore = boundedScore(existing.score);
    const score = scoreVisible
      ? (existingScore !== null ? existingScore : legacyScore(legacy))
      : null;

    return {
      uid: user.uid,
      data: {
        uid: user.uid,
        username: normalizeUsername(existing.username || directory.username || legacy.username || user.displayName),
        specialty: String(existing.specialty || directory.specialty || legacy.specialty || "").slice(0, 80),
        avatarId: String(existing.avatarId || directory.avatarId || legacy.avatarId || "").slice(0, 60),
        scoreVisible,
        score,
        isPremium: entitlementIsActive(entitlements.get(user.uid)),
        flame: Math.max(0, Math.min(100000, Math.floor(Number(existing.flame ?? legacy.flame) || 0))),
        updatedAt: now
      }
    };
  });

  const authIds = new Set(authUsers.map((user) => user.uid));
  const missingBefore = authUsers.filter((user) => !existingProfiles.has(user.uid)).length;
  const orphanProfiles = profileSnap.docs.filter((doc) => !authIds.has(doc.id)).length;
  console.log(JSON.stringify({
    projectId,
    mode: APPLY ? "apply" : "dry-run",
    authUsers: authUsers.length,
    directoryUsers: directorySnap.size,
    legacyProfiles: legacySnap.size,
    existingPublicProfiles: profileSnap.size,
    missingPublicProfiles: missingBefore,
    orphanPublicProfiles: orphanProfiles,
    plannedWrites: profiles.length
  }, null, 2));

  if (!APPLY) {
    console.log("Simulación terminada. No se escribió ni eliminó ningún documento.");
    return;
  }

  await commitProfiles(db, profiles);
  const after = await db.collection("public_profiles").get();
  const afterIds = new Set(after.docs.map((doc) => doc.id));
  const missingAfter = authUsers.filter((user) => !afterIds.has(user.uid));
  if (missingAfter.length) {
    throw new Error(`Verificación fallida: faltan ${missingAfter.length} perfiles públicos.`);
  }
  console.log(JSON.stringify({
    verified: true,
    authUsers: authUsers.length,
    publicProfilesAfter: after.size,
    missingPublicProfilesAfter: 0
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message || String(error));
  process.exitCode = 1;
});
