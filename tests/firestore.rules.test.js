"use strict";

const fs = require("fs");
const path = require("path");
const { before, beforeEach, after, test } = require("node:test");
const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails
} = require("@firebase/rules-unit-testing");
const {
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} = require("firebase/firestore");

const projectId = "enarmax-rules-test";
const rules = fs.readFileSync(path.resolve(__dirname, "..", "firestore.rules"), "utf8");
const userA = "user-a";
const userB = "user-b";
const userC = "user-c";
const secureCode = `ENARM-M1-${"A".repeat(26)}`;
let env;

const authDb = (uid, claims = {}) => env.authenticatedContext(uid, { email: `${uid}@example.test`, email_verified: true, ...claims }).firestore();
const unverifiedDb = (uid) => env.authenticatedContext(uid, { email: `${uid}@example.test`, email_verified: false }).firestore();

before(async () => {
  env = await initializeTestEnvironment({ projectId, firestore: { rules } });
});

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await Promise.all([
      setDoc(doc(db, "user_progress", userA), { uid: userA, schemaVersion: 1, historyStr: "[]", createdAt: Timestamp.now(), updatedAt: Timestamp.now() }),
      setDoc(doc(db, "leaderboard", userA), { uid: userA, phone: "5555555555", score: 99, isPremium: true }),
      setDoc(doc(db, "redeem_codes", secureCode), { type: "month", redeemedBy: "", redeemedAt: null, disabled: false }),
      setDoc(doc(db, "user_wallets", userA), { uid: userA, referralCode: "ELABC123", coins: 200, createdAt: Timestamp.now(), updatedAt: Timestamp.now() }),
      setDoc(doc(db, "reports", "report-a"), { userId: userA, userName: "Usuario A", status: "quarantine", reason: "Revisar", category: "contenido", questionText: "Pregunta", caseText: "Caso", timestamp: Date.now() }),
      setDoc(doc(db, "user_push_tokens", "token-a"), { uid: userA, token: "x".repeat(40), enabled: true, platform: "web", userAgent: "test", updatedAt: Date.now() })
    ]);
  });
});

after(async () => {
  await env.cleanup();
});

test("datos privados y leaderboard legado solo son accesibles por el titular/admin", async () => {
  await assertSucceeds(getDoc(doc(authDb(userA), "user_progress", userA)));
  await assertFails(getDoc(doc(authDb(userB), "user_progress", userA)));
  await assertFails(getDoc(doc(authDb(userB), "leaderboard", userA)));
  await assertSucceeds(getDoc(doc(authDb("admin", { admin: true }), "leaderboard", userA)));
  await assertFails(updateDoc(doc(authDb(userA), "leaderboard", userA), { score: 100 }));
});

test("perfiles públicos exigen verificación, esquema estricto y entitlement para Premium", async () => {
  const validProfile = { uid: userA, username: "Usuario A", specialty: "Pediatría", avatarId: "", scoreVisible: false, score: null, isPremium: false, flame: 2, updatedAt: serverTimestamp() };
  await assertSucceeds(setDoc(doc(authDb(userA), "public_profiles", userA), validProfile));
  await assertFails(getDocs(collection(env.unauthenticatedContext().firestore(), "public_profiles")));
  await assertFails(setDoc(doc(unverifiedDb(userB), "public_profiles", userB), { ...validProfile, uid: userB, username: "Usuario B" }));
  await assertFails(setDoc(doc(authDb(userB), "public_profiles", userB), { ...validProfile, uid: userB, username: "Usuario B", phone: "555" }));
  await assertFails(setDoc(doc(authDb(userB), "public_profiles", userB), { ...validProfile, uid: userB, username: "Usuario B", isPremium: true }));
});

test("el directorio administrativo admite cuentas sin verificar, pero sigue siendo privado", async () => {
  const directory = {
    uid: userB,
    email: `${userB}@example.test`,
    emailVerified: false,
    username: "Usuario B",
    university: "",
    phone: "",
    targetYear: "",
    createdAt: serverTimestamp(),
    lastSeenAt: serverTimestamp()
  };
  await assertSucceeds(setDoc(doc(unverifiedDb(userB), "user_directory", userB), directory));
  await assertSucceeds(updateDoc(doc(unverifiedDb(userB), "user_directory", userB), { lastSeenAt: serverTimestamp() }));
  await assertFails(getDoc(doc(authDb(userA), "user_directory", userB)));
  await assertFails(setDoc(doc(unverifiedDb(userA), "user_directory", userB), { ...directory, uid: userB }));
});

test("códigos no se listan, solo se consultan exactamente y un canje es de una sola vez", async () => {
  const db = authDb(userA);
  await assertSucceeds(getDoc(doc(db, "redeem_codes", secureCode)));
  await assertFails(getDocs(collection(db, "redeem_codes")));
  await assertFails(getDoc(doc(db, "redeem_codes", "ENARM-M1-CORTO")));
  const expiry = Timestamp.fromDate(new Date(Date.now() + 29 * 86400000));
  const codeRef = doc(db, "redeem_codes", secureCode);
  const entitlementRef = doc(db, "entitlements", userA);
  const { runTransaction } = require("firebase/firestore");
  await assertSucceeds(runTransaction(db, async (tx) => {
    await tx.get(codeRef);
    tx.update(codeRef, { redeemedBy: userA, redeemedAt: serverTimestamp() });
    tx.set(entitlementRef, { status: "active", source: "code", planId: "premium_code_month", activatedAt: serverTimestamp(), expiresAt: expiry, updatedAt: serverTimestamp(), code: secureCode });
  }));
  await assertFails(updateDoc(codeRef, { redeemedBy: userB, redeemedAt: serverTimestamp() }));
});

test("amistades solo las aceptan los destinatarios", async () => {
  const requestRef = doc(authDb(userA), "friendRequests", "a-b");
  await assertSucceeds(setDoc(requestRef, { fromId: userA, fromName: "Usuario A", fromPremium: false, toId: userB, toName: "Usuario B", status: "pending", timestamp: serverTimestamp() }));
  await assertFails(updateDoc(doc(authDb(userA), "friendRequests", "a-b"), { status: "accepted" }));
  await assertSucceeds(updateDoc(doc(authDb(userB), "friendRequests", "a-b"), { status: "accepted" }));
  await assertFails(getDoc(doc(authDb(userC), "friendRequests", "a-b")));
});

test("reportes y tokens push nunca quedan expuestos a otros clientes", async () => {
  await assertSucceeds(getDoc(doc(authDb(userA), "reports", "report-a")));
  await assertFails(getDoc(doc(authDb(userB), "reports", "report-a")));
  await assertFails(getDoc(doc(authDb(userA), "user_push_tokens", "token-a")));
  await assertFails(getDocs(collection(authDb("admin", { admin: true }), "user_push_tokens")));
});

test("retiros rechazan campos bancarios planos y aceptan solo el sobre cifrado", async () => {
  const base = { uid: userA, userName: "Usuario A", email: "a@example.test", referralCode: "ELABC123", amount: 100, coinsSnapshot: 200, currency: "MXN", status: "pending", createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  await assertFails(setDoc(doc(authDb(userA), "withdrawal_requests", "plain"), { ...base, clabe: "0".repeat(18), bankName: "Banco" }));
  await assertSucceeds(setDoc(doc(authDb(userA), "withdrawal_requests", "encrypted"), {
    ...base,
    bankingEnvelope: { version: 1, algorithm: "RSA-OAEP-256+A256GCM", keyVersion: "test", wrappedKey: "a".repeat(512), iv: "a".repeat(16), ciphertext: "a".repeat(64) }
  }));
});

test("saldo y resultados de terceros no se pueden falsificar", async () => {
  await assertFails(updateDoc(doc(authDb(userA), "user_wallets", userA), { coins: 999999 }));
  await env.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "challenges", "challenge-1"), {
      challengerId: userA,
      challengerName: "Usuario A",
      challengerPremium: false,
      participants: {
        [userA]: { name: "Usuario A", isPremium: false, score: null, status: "pending", timestamp: null },
        [userB]: { name: "Usuario B", isPremium: false, score: null, status: "pending", timestamp: null }
      },
      participantIds: [userA, userB], specialty: "Pediatría", numQuestions: 1, targetQty: 1,
      questionIndices: [{ idx: 1, sub: 0 }], status: "active", createdAt: Date.now()
    });
  });
  const forged = {
    [userA]: { name: "Usuario A", isPremium: false, score: 100, status: "completed", timestamp: Timestamp.now() },
    [userB]: { name: "Usuario B", isPremium: false, score: 0, status: "completed", timestamp: Timestamp.now() }
  };
  await assertFails(updateDoc(doc(authDb(userA), "challenges", "challenge-1"), { participants: forged, status: "finished" }));
});
