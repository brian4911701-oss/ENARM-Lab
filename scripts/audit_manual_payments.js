"use strict";
// Read-only audit. Never writes payment requests, entitlements, or rules releases.
const fs = require("node:fs");
const path = require("node:path");
const admin = require("firebase-admin");

(async () => {
    let credential = admin.credential.applicationDefault();
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        const root = path.resolve(__dirname, "..");
        const files = fs.readdirSync(root).filter(name => name.includes("firebase-adminsdk") && name.endsWith(".json"));
        if (files.length === 1) credential = admin.credential.cert(JSON.parse(fs.readFileSync(path.join(root, files[0]), "utf8")));
    }
    const app = admin.initializeApp({ projectId: "enarm-lab-social", credential }, "payment-audit");
    try {
        const db = app.firestore();
        for (const email of process.argv.slice(2)) {
            const user = await app.auth().getUserByEmail(email);
            const [profile, requests, entitlement] = await Promise.all([
                db.doc("payment_profiles/" + user.uid).get(),
                db.collection("manual_payment_requests").where("uid", "==", user.uid).get(),
                db.doc("entitlements/" + user.uid).get()
            ]);
            const data = entitlement.data() || {};
            console.log(JSON.stringify({ email, emailVerified: user.emailVerified,
                registeredAt: user.metadata.creationTime, lastSignIn: user.metadata.lastSignInTime,
                profileExists: profile.exists, transferReference: profile.data()?.transferReference,
                requestCount: requests.size, requestStatuses: requests.docs.map(doc => doc.data().status),
                entitlement: { status: data.status, source: data.source, planId: data.planId, expiresAt: data.expiresAt?.toDate?.().toISOString() }
            }, null, 2));
        }
        const [payments, profiles] = await Promise.all([
            db.collection("manual_payment_requests").get(),
            db.collection("payment_profiles").get()
        ]);
        const counts = {};
        const paymentUids = new Set();
        for (const doc of payments.docs) {
            const data = doc.data();
            counts[data.status || "missing"] = (counts[data.status || "missing"] || 0) + 1;
            paymentUids.add(data.uid);
        }
        const iso = value => value?.toDate?.().toISOString() || null;
        console.log(JSON.stringify({
            totalRequests: payments.size, statusCounts: counts,
            requestsWithoutCreatedAt: payments.docs.filter(doc => !doc.data().createdAt).length,
            totalProfiles: profiles.size,
            profilesWithoutAnyRequest: profiles.docs.filter(doc => !paymentUids.has(doc.id)).length,
            recentRequests: payments.docs.map(doc => ({
                status: doc.data().status, plan: doc.data().planId,
                createdAt: iso(doc.data().createdAt), notifiedAt: iso(doc.data().notifiedAt)
            })).sort((a, b) => String(b.notifiedAt || b.createdAt).localeCompare(String(a.notifiedAt || a.createdAt))).slice(0, 12)
        }, null, 2));
        const { access_token: token } = await credential.getAccessToken();
        const readRules = async suffix => {
            const response = await fetch("https://firebaserules.googleapis.com/v1/" + suffix, { headers: { Authorization: `Bearer ${token}` } });
            if (!response.ok) throw new Error(`Rules audit: HTTP ${response.status}`);
            return response.json();
        };
        const release = await readRules("projects/enarm-lab-social/releases/cloud.firestore");
        const ruleset = await readRules(release.rulesetName);
        const source = ruleset.source.files.map(file => file.content).join("\n");
        const start = source.indexOf("match /manual_payment_requests/");
        const end = source.indexOf("match /", start + 6);
        const paymentRules = source.slice(start, end);
        console.log(JSON.stringify({ rulesUpdatedAt: release.updateTime,
            ownerReadRequiresExistingDocument: paymentRules.includes("resource.data.uid == request.auth.uid"),
            publishedRulesContainOldPrices: paymentRules.includes("amount == 1499") || paymentRules.includes("amount == 4999")
        }, null, 2));
        const hosted = await fetch("https://enarm-lab-social.web.app/app.js");
        if (!hosted.ok) throw new Error(`Hosting audit: HTTP ${hosted.status}`);
        const code = await hosted.text();
        const planStart = code.indexOf("const TRANSFER_PLANS =");
        const planEnd = code.indexOf("const GLOBAL_PREMIUM_COLLECTION", planStart);
        const hostedPlans = code.slice(planStart, planEnd);
        console.log(JSON.stringify({
            hostedMatchesLocal: code === fs.readFileSync(path.resolve(__dirname, "../app.js"), "utf8"),
            hostedPlanAmounts: [...hostedPlans.matchAll(/amount:\s*(\d+)/g)].map(match => Number(match[1])),
            readsRequestBeforeCreate: code.includes("const existingSnap = await window.FB.getDoc(requestRef);"),
            approvalUsesCapacityHelper: code.slice(code.indexOf("const reviewManualPayment ="), code.indexOf("const requestWalletWithdrawal =")).includes("await reserveLaunchCapacityInTransaction(")
        }, null, 2));
    } finally { await app.delete(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
