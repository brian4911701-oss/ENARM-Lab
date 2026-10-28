"use strict";
// Read-only snapshot of the active releases for comparison and rollback.
const fs = require("node:fs");
const path = require("node:path");
const admin = require("firebase-admin");

(async () => {
    const projectId = "enarm-lab-social";
    console.log("Reading current Firebase releases (no changes)...");
    const { access_token: token } = await admin.credential.applicationDefault().getAccessToken();
    const read = async url => {
        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(60000) });
        if (!response.ok) throw new Error(`Release inspection: HTTP ${response.status}: ${await response.text()}`);
        return response.json();
    };
    const rulesRelease = await read(`https://firebaserules.googleapis.com/v1/projects/${projectId}/releases/cloud.firestore`);
    const [ruleset, hosting] = await Promise.all([
        read(`https://firebaserules.googleapis.com/v1/${rulesRelease.rulesetName}`),
        read(`https://firebasehosting.googleapis.com/v1beta1/sites/${projectId}/releases?pageSize=1`)
    ]);
    const directory = path.resolve(__dirname, "../.tmp-config/payment-release");
    fs.mkdirSync(directory, { recursive: true });
    const source = ruleset.source.files.map(file => file.content).join("\n");
    const snapshot = { projectId, rulesRelease, hostingRelease: hosting.releases?.[0] };
    if (fs.existsSync(path.join(directory, "before.json"))) throw new Error("Release snapshot already exists; preserve it for rollback.");
    fs.writeFileSync(path.join(directory, "before.json"), JSON.stringify(snapshot, null, 2), { flag: "wx" });
    fs.writeFileSync(path.join(directory, "before.rules"), source);
    console.log(JSON.stringify({ directory, ruleset: rulesRelease.rulesetName,
        hostingVersion: snapshot.hostingRelease?.version?.name,
        hostingConfig: snapshot.hostingRelease?.version?.config }, null, 2));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
