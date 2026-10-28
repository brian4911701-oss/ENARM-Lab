"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { before, beforeEach, after, test } = require("node:test");
const assert = require("node:assert/strict");
const { initializeTestEnvironment, assertSucceeds, assertFails } = require("@firebase/rules-unit-testing");
const { doc, collection, query, where, getDoc, getDocs, setDoc, updateDoc, serverTimestamp, Timestamp } = require("firebase/firestore");
let env;
const uid = "payment-student";
const dbFor = (id = uid, claims = {}) => env.authenticatedContext(id, {
    email: `${id}@example.test`, email_verified: true, enarmaxSid: `session-${id}`, ...claims
}).firestore();
const payload = (planId = "enarm_2027") => ({
    uid, email: `${uid}@example.test`, planId,
    amount: { enarm_2027: 999, premium_monthly: 99, squad_2027: 2499 }[planId],
    seats: planId === "squad_2027" ? 4 : 1,
    squadMembers: planId === "squad_2027" ? ["Uno", "Dos", "Tres"] : [],
    currency: "MXN", transferReference: "1234567890", referralCode: "", termsAccepted: true,
    status: "pending", createdAt: Timestamp.now(), notifiedAt: serverTimestamp(), updatedAt: Timestamp.now()
});
before(async () => {
    env = await initializeTestEnvironment({ projectId: "enarmax-rules-test", firestore: {
        rules: fs.readFileSync(path.resolve(__dirname, "../firestore.rules"), "utf8")
    } });
});
beforeEach(async () => {
    await env.clearFirestore();
    await env.withSecurityRulesDisabled(async context => {
        const db = context.firestore();
        await Promise.all([
            ...[uid, "admin", "other"].map(id => setDoc(doc(db, "account_sessions", id), { sid: `session-${id}` })),
            setDoc(doc(db, "payment_profiles", uid), { uid, transferReference: "1234567890" })
        ]);
    });
});
after(async () => { await env.cleanup(); });

test("first payment: missing-document read is denied, owner query and creation succeed for all current plans", async () => {
    const db = dbFor();
    await assertFails(getDoc(doc(db, "manual_payment_requests", `${uid}_enarm_2027`)));
    const own = await assertSucceeds(getDocs(query(collection(db, "manual_payment_requests"), where("uid", "==", uid))));
    assert.equal(own.size, 0);
    for (const plan of ["enarm_2027", "premium_monthly", "squad_2027"]) {
        await assertSucceeds(setDoc(doc(db, "manual_payment_requests", `${uid}_${plan}`), payload(plan)));
    }
    const inbox = await assertSucceeds(getDocs(collection(dbFor("admin", { admin: true }), "manual_payment_requests")));
    assert.equal(inbox.size, 3);
});

test("rejected request can be resubmitted without stale reviewer fields", async () => {
    const db = dbFor(), ref = doc(db, "manual_payment_requests", `${uid}_enarm_2027`);
    await setDoc(ref, payload());
    await updateDoc(doc(dbFor("admin", { admin: true }), "manual_payment_requests", ref.id), {
        status: "rejected", reviewedAt: serverTimestamp(), reviewedByUid: "admin"
    });
    const previous = (await getDoc(ref)).data();
    await assertFails(setDoc(ref, { ...payload(), createdAt: previous.createdAt }, { merge: true }));
    await assertSucceeds(setDoc(ref, { ...payload(), createdAt: previous.createdAt }));
    assert.equal((await getDoc(ref)).data().reviewedByUid, undefined);
});

test("incorrect prices, other users, unverified accounts, and self approval stay blocked", async () => {
    const db = dbFor(), ref = doc(db, "manual_payment_requests", `${uid}_enarm_2027`);
    await assertFails(setDoc(ref, { ...payload(), amount: 1 }));
    await assertFails(setDoc(doc(dbFor(uid, { email_verified: false }), "manual_payment_requests", ref.id), payload()));
    await setDoc(ref, payload());
    await assertFails(getDoc(doc(dbFor("other"), "manual_payment_requests", ref.id)));
    await assertFails(updateDoc(ref, { status: "approved" }));
    await assertSucceeds(updateDoc(doc(dbFor("admin", { admin: true }), "manual_payment_requests", ref.id), { status: "approved" }));
    await assertFails(setDoc(ref, payload()));
});
