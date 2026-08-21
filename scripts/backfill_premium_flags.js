/*
 * Backfill leaderboard.isPremium from entitlements.
 *
 * Usage:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS='D:\ENARM Lab\enarm-lab-social-firebase-adminsdk-fbsvc-c5dbf99e41.json'
 *   node scripts/backfill_premium_flags.js
 *
 * Add --write to persist changes. Without --write it only prints a dry-run summary.
 */
const admin = require('../functions/node_modules/firebase-admin');

const WRITE = process.argv.includes('--write');
const PROJECT_ID = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || 'enarm-lab-social';
const ADMIN_UIDS = new Set(['sZcIUjjhD0fze7FtirwsjsIDzLB2']);

if (!admin.apps.length) {
  admin.initializeApp({ projectId: PROJECT_ID });
}

const db = admin.firestore();

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isEntitlementActive(data, now = new Date()) {
  if (!data || data.status !== 'active') return false;
  const expiresAt = toDate(data.expiresAt);
  return !expiresAt || expiresAt.getTime() > now.getTime();
}

async function getGlobalPremiumActive(now = new Date()) {
  const snap = await db.collection('feature_flags').doc('global_premium').get();
  if (!snap.exists) return false;
  const data = snap.data() || {};
  if (data.active !== true) return false;
  const expiresAt = toDate(data.expiresAt);
  return !expiresAt || expiresAt.getTime() > now.getTime();
}

async function main() {
  const now = new Date();
  const globalPremiumActive = await getGlobalPremiumActive(now);
  const leaderboardSnap = await db.collection('leaderboard').get();

  let scanned = 0;
  let alreadyOk = 0;
  let planned = 0;
  let written = 0;
  const failures = [];

  console.log('Premium flag backfill');
  console.log('Mode:', WRITE ? 'WRITE' : 'DRY RUN');
  console.log('Global premium active:', globalPremiumActive);

  for (const userDoc of leaderboardSnap.docs) {
    scanned += 1;
    const uid = userDoc.id;
    const user = userDoc.data() || {};

    try {
      let shouldBePremium = globalPremiumActive || ADMIN_UIDS.has(uid);
      if (!shouldBePremium) {
        const entitlementSnap = await db.collection('entitlements').doc(uid).get();
        shouldBePremium = entitlementSnap.exists && isEntitlementActive(entitlementSnap.data(), now);
      }

      const current = user.isPremium === true;
      if (current === shouldBePremium) {
        alreadyOk += 1;
        continue;
      }

      planned += 1;
      console.log(`${WRITE ? 'Writing' : 'Would write'} leaderboard premium flag`, {
        uid,
        username: user.username || 'Aspirante',
        from: current,
        to: shouldBePremium
      });

      if (WRITE) {
        await userDoc.ref.set({
          isPremium: shouldBePremium,
          lastPremiumBackfill: now
        }, { merge: true });
        written += 1;
      }
    } catch (err) {
      failures.push({ uid, error: err && err.message ? err.message : String(err) });
    }
  }

  console.log('Summary:', {
    scanned,
    alreadyOk,
    planned,
    written,
    failures: failures.length
  });

  if (failures.length) {
    console.error('Failures:', failures);
    process.exitCode = 1;
  }

  if (!WRITE) {
    console.log('Dry run only. Re-run with --write to persist changes.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
