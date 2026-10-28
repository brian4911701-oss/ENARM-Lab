"use strict";
// Read-only checks of the active production rules and public assets.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const admin = require("firebase-admin");

(async () => {
    const root = path.resolve(__dirname, "..");
    const projectId = "enarm-lab-social";
    const { access_token: token } = await admin.credential.applicationDefault().getAccessToken();
    const read = async url => {
        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(60000) });
        if (!response.ok) throw new Error(`Release verification: HTTP ${response.status}`);
        return response.json();
    };
    const release = await read(`https://firebaserules.googleapis.com/v1/projects/${projectId}/releases/cloud.firestore`);
    const [ruleset, hosting] = await Promise.all([
        read(`https://firebaserules.googleapis.com/v1/${release.rulesetName}`),
        read(`https://firebasehosting.googleapis.com/v1beta1/sites/${projectId}/releases?pageSize=1`)
    ]);
    const normalize = text => text.replace(/\r\n/g, "\n").trimEnd();
    const rules = ruleset.source.files.find(file => file.name === "firestore.rules")?.content;
    assert.equal(normalize(rules || ""), normalize(fs.readFileSync(path.join(root, "firestore.rules"), "utf8")), "Published rules differ from the tested local rules");
    const origin = `https://${projectId}.web.app`;
    const digest = buffer => crypto.createHash("sha256").update(buffer).digest("hex");
    const checks = await Promise.all(["app.js", "index.html", "service-worker.js", "styles.css"].map(async file => {
        const response = await fetch(`${origin}/${file}?payment-release=${Date.now()}`, { cache: "no-store", signal: AbortSignal.timeout(60000) });
        assert.equal(response.status, 200, file);
        const body = Buffer.from(await response.arrayBuffer());
        assert.equal(digest(body), digest(fs.readFileSync(path.join(root, file))), `${file}: deployed content differs`);
        assert.equal(response.headers.get("x-content-type-options"), "nosniff");
        if (file === "service-worker.js") assert.match(response.headers.get("cache-control"), /no-store/);
        return { file, matchesLocal: true, sha256: digest(body) };
    }));
    for (const file of ["package.json", "redeem_codes.txt"]) {
        const response = await fetch(`${origin}/${file}?payment-release=${Date.now()}`, { signal: AbortSignal.timeout(60000) });
        assert.equal(response.status, 404, `${file} must stay unavailable`);
    }
    const result = { verifiedAt: new Date().toISOString(), rulesMatchLocal: true,
        ruleset: release.rulesetName, rulesUpdatedAt: release.updateTime,
        hostingVersion: hosting.releases?.[0]?.version?.name,
        hostingReleasedAt: hosting.releases?.[0]?.releaseTime,
        checks, pricesMXN: { monthly: 99, annual2027: 999, squad2027: 2499 },
        privatePathsBlocked: true, url: origin + "/" };
    const directory = path.join(root, ".tmp-config", "payment-release");
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, "verified.json"), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result, null, 2));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
