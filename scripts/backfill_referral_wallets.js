/*
 * Backfill referral wallets for existing ENARM Lab users.
 *
 * Usage:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS='D:\ENARM Lab\enarm-lab-social-firebase-adminsdk-fbsvc-c5dbf99e41.json'
 *   node scripts/backfill_referral_wallets.js
 *
 * Add --write to persist changes. Without --write it only prints a dry-run summary.
 */
const admin = require('../functions/node_modules/firebase-admin');

const WRITE = process.argv.includes('--write');
const PROJECT_ID = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || 'enarm-lab-social';

if (!admin.apps.length) {
  admin.initializeApp({ projectId: PROJECT_ID });
}

const db = admin.firestore();

function normalizeReferralCode(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .trim();
}

function buildReferralCodeCandidate(uid, attempt = 0) {
  const cleanUid = normalizeReferralCode(uid).slice(0, 8) || Math.random().toString(36).slice(2, 10).toUpperCase();
  if (attempt <= 0) return `EL${cleanUid}`;
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EL${cleanUid.slice(0, 5)}${suffix}`;
}

async function pickReferralCode(uid, existingCode) {
  const normalizedExisting = normalizeReferralCode(existingCode);
  if (normalizedExisting) {
    const existingSnap = await db.collection('referral_codes').doc(normalizedExisting).get();
    if (!existingSnap.exists || existingSnap.data().ownerUid === uid) return normalizedExisting;
  }

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const candidate = buildReferralCodeCandidate(uid, attempt);
    const snap = await db.collection('referral_codes').doc(candidate).get();
    if (!snap.exists || snap.data().ownerUid === uid) return candidate;
  }
  throw new Error(`No available referral code for ${uid}`);
}

async function main() {
  const leaderboardSnap = await db.collection('leaderboard').get();
  let scanned = 0;
  let alreadyOk = 0;
  let planned = 0;
  let written = 0;
  const failures = [];

  for (const userDoc of leaderboardSnap.docs) {
    scanned += 1;
    const uid = userDoc.id;
    const user = userDoc.data() || {};
    try {
      const walletRef = db.collection('user_wallets').doc(uid);
      const walletSnap = await walletRef.get();
      const wallet = walletSnap.exists ? (walletSnap.data() || {}) : null;
      const code = await pickReferralCode(uid, wallet?.referralCode || user.referralCode);
      const codeRef = db.collection('referral_codes').doc(code);

      if (wallet && normalizeReferralCode(wallet.referralCode) === code) {
        alreadyOk += 1;
        if (normalizeReferralCode(user.referralCode) !== code && WRITE) {
          await userDoc.ref.set({ referralCode: code, coins: Number(wallet.coins) || 0 }, { merge: true });
        }
        continue;
      }

      planned += 1;
      console.log(`${WRITE ? 'Writing' : 'Would write'} referral wallet`, { uid, code });

      if (WRITE) {
        const now = admin.firestore.FieldValue.serverTimestamp();
        await db.runTransaction(async (tx) => {
          tx.set(codeRef, {
            code,
            ownerUid: uid,
            ownerName: String(user.username || user.displayName || 'Aspirante').slice(0, 40),
            createdAt: now
          }, { merge: true });
          tx.set(walletRef, {
            uid,
            referralCode: code,
            coins: Number(wallet?.coins) || Number(user.coins) || 0,
            createdAt: wallet?.createdAt || now,
            updatedAt: now
          }, { merge: true });
          tx.set(userDoc.ref, {
            referralCode: code,
            coins: Number(wallet?.coins) || Number(user.coins) || 0
          }, { merge: true });
        });
        written += 1;
      }
    } catch (err) {
      failures.push({ uid, error: err.message || String(err) });
      console.error('Failed user', uid, err);
    }
  }

  console.log(JSON.stringify({ scanned, alreadyOk, planned, written, dryRun: !WRITE, failures }, null, 2));
  if (failures.length > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
