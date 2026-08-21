#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ADMIN_SDK_PATH = path.resolve(__dirname, "../functions/node_modules/firebase-admin");

let admin = null;
try {
    admin = require(ADMIN_SDK_PATH);
} catch (error) {
    console.error("No se pudo cargar firebase-admin desde functions/node_modules.");
    console.error("Detalle:", error.message || String(error));
    process.exit(1);
}

const TARGET_UID = "RInJqajS6tUkzpdXNHtBFo4ckid2";
const DEFAULT_PROJECT_ID = readDefaultProjectId();

function readDefaultProjectId() {
    try {
        const firebasercPath = path.resolve(__dirname, "../.firebaserc");
        const raw = fs.readFileSync(firebasercPath, "utf8");
        const parsed = JSON.parse(raw);
        return parsed && parsed.projects && parsed.projects.default
            ? String(parsed.projects.default)
            : "enarm-lab-social";
    } catch (_) {
        return "enarm-lab-social";
    }
}

function parseArgs(argv) {
    const out = {
        uid: TARGET_UID,
        preset: "an-snapshot-2026-05-08",
        projectId: DEFAULT_PROJECT_ID,
        write: false,
        statsOnly: false,
        premiumOnly: false,
        username: "",
        specialty: "",
        university: ""
    };

    for (let i = 0; i < argv.length; i += 1) {
        const token = argv[i];
        const next = argv[i + 1];
        if (token === "--uid" && next) {
            out.uid = next;
            i += 1;
        } else if (token === "--preset" && next) {
            out.preset = next;
            i += 1;
        } else if (token === "--project" && next) {
            out.projectId = next;
            i += 1;
        } else if (token === "--username" && next) {
            out.username = next;
            i += 1;
        } else if (token === "--specialty" && next) {
            out.specialty = next;
            i += 1;
        } else if (token === "--university" && next) {
            out.university = next;
            i += 1;
        } else if (token === "--write") {
            out.write = true;
        } else if (token === "--stats-only") {
            out.statsOnly = true;
        } else if (token === "--premium-only") {
            out.premiumOnly = true;
        } else if (token === "--help" || token === "-h") {
            printHelp();
            process.exit(0);
        } else {
            console.error(`Argumento no reconocido: ${token}`);
            printHelp();
            process.exit(1);
        }
    }

    if (out.statsOnly && out.premiumOnly) {
        console.error("No puedes usar --stats-only y --premium-only al mismo tiempo.");
        process.exit(1);
    }

    return out;
}

function printHelp() {
    console.log(`
Uso:
  node scripts/restore_user_snapshot.js [opciones]

Opciones:
  --uid <uid>             UID destino. Por defecto usa ${TARGET_UID}
  --preset <nombre>       Preset de estadisticas. Por defecto: an-snapshot-2026-05-08
  --project <projectId>   Proyecto Firebase. Por defecto: ${DEFAULT_PROJECT_ID}
  --username <texto>      Nombre a guardar si no existe uno previo
  --specialty <texto>     Especialidad a guardar si no existe una previa
  --university <texto>    Universidad a guardar si no existe una previa
  --stats-only            Solo restaura estadisticas
  --premium-only          Solo activa premium permanente
  --write                 Aplica cambios reales. Sin esta bandera solo hace vista previa
  --help, -h              Muestra esta ayuda

Credenciales:
  Define GOOGLE_APPLICATION_CREDENTIALS o FIREBASE_SERVICE_ACCOUNT_PATH
  apuntando a un JSON de Service Account con acceso a Firestore.
`);
}

function buildPreset(name) {
    if (name !== "an-snapshot-2026-05-08") {
        throw new Error(`Preset no soportado: ${name}`);
    }

    const history = [
        buildHistoryEntry("2026-05-03T09:00:00-06:00", 24, 90),
        buildHistoryEntry("2026-05-03T20:00:00-06:00", 26, 95),
        buildHistoryEntry("2026-05-04T10:00:00-06:00", 28, 87),
        buildHistoryEntry("2026-05-04T21:00:00-06:00", 28, 87),
        buildHistoryEntry("2026-05-05T20:00:00-06:00", 24, 90),
        buildHistoryEntry("2026-05-06T09:00:00-06:00", 30, 80),
        buildHistoryEntry("2026-05-06T15:00:00-06:00", 20, 100),
        buildHistoryEntry("2026-05-06T22:00:00-06:00", 30, 67),
        buildHistoryEntry("2026-05-07T20:00:00-06:00", 30, 73),
        buildHistoryEntry("2026-05-08T20:00:00-06:00", 30, 100)
    ];

    const globalStats = {
        respondidas: 270,
        aciertos: 216,
        sesiones: 10,
        pomodoros: 0,
        totalBlank: 0,
        bySpecialty: {
            mi: { total: 124, correct: 99, name: "Medicina Interna" },
            ped: { total: 48, correct: 38, name: "Pediatria" },
            gyo: { total: 60, correct: 48, name: "Ginecologia y Obstetricia" },
            cir: { total: 38, correct: 31, name: "Cirugia General" }
        },
        streakData: {
            lastStudyDate: "2026-5-8",
            currentStreak: 6
        }
    };

    return {
        globalStats,
        history,
        answered: 270,
        score: 80.0
    };
}

function buildHistoryEntry(timestampIso, preguntas, pct) {
    const total = Number(preguntas) || 0;
    const roundedPct = Number(pct) || 0;
    const correct = Math.round((roundedPct / 100) * total);
    const wrong = Math.max(0, total - correct);
    return {
        timestamp: new Date(timestampIso).getTime(),
        tipo: "Repaso",
        sessionKind: "estudio",
        preguntas: total,
        pct: roundedPct,
        correct,
        wrong,
        blank: 0,
        elapsedSec: total * 30,
        topicsStudied: [],
        dominantErrors: [],
        nextRecommendation: ""
    };
}

function getCredential() {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (serviceAccountPath) {
        const resolved = path.resolve(serviceAccountPath);
        const raw = fs.readFileSync(resolved, "utf8");
        return admin.credential.cert(JSON.parse(raw));
    }
    return admin.credential.applicationDefault();
}

function initializeFirebase(projectId) {
    if (admin.apps.length) {
        return admin.app();
    }
    return admin.initializeApp({
        credential: getCredential(),
        projectId
    });
}

function summarizePatch(uid, preset, currentLeaderboard, currentEntitlement, cli) {
    const now = new Date();
    const leaderboardPatch = {
        username: cli.username || currentLeaderboard.username || "AN",
        specialty: cli.specialty || currentLeaderboard.specialty || "",
        university: cli.university || currentLeaderboard.university || "",
        isScorePublic: currentLeaderboard.isScorePublic !== false,
        score: preset.score,
        answered: preset.answered,
        flame: preset.history.length,
        lastUpdate: now,
        globalStatsStr: JSON.stringify(preset.globalStats),
        historyStr: JSON.stringify(preset.history)
    };

    const entitlementPatch = {
        status: "active",
        source: "admin_grant",
        expiresAt: null,
        updatedAt: now
    };

    return {
        uid,
        leaderboardPatch,
        entitlementPatch,
        currentLeaderboardSummary: {
            username: currentLeaderboard.username || "",
            score: Number(currentLeaderboard.score) || 0,
            answered: Number(currentLeaderboard.answered) || 0,
            hasGlobalStatsStr: !!currentLeaderboard.globalStatsStr,
            hasHistoryStr: !!currentLeaderboard.historyStr
        },
        currentEntitlementSummary: {
            status: currentEntitlement.status || "",
            source: currentEntitlement.source || "",
            expiresAt: currentEntitlement.expiresAt || null
        }
    };
}

async function main() {
    const cli = parseArgs(process.argv.slice(2));
    const preset = buildPreset(cli.preset);

    initializeFirebase(cli.projectId);
    const db = admin.firestore();

    const leaderboardRef = db.doc(`leaderboard/${cli.uid}`);
    const entitlementRef = db.doc(`entitlements/${cli.uid}`);

    const [leaderboardSnap, entitlementSnap] = await Promise.all([
        leaderboardRef.get(),
        entitlementRef.get()
    ]);

    const currentLeaderboard = leaderboardSnap.exists ? (leaderboardSnap.data() || {}) : {};
    const currentEntitlement = entitlementSnap.exists ? (entitlementSnap.data() || {}) : {};
    const summary = summarizePatch(cli.uid, preset, currentLeaderboard, currentEntitlement, cli);

    console.log(JSON.stringify({
        projectId: cli.projectId,
        preset: cli.preset,
        write: cli.write,
        statsOnly: cli.statsOnly,
        premiumOnly: cli.premiumOnly,
        preview: summary
    }, null, 2));

    if (!cli.write) {
        console.log("\nVista previa completada. Agrega --write para aplicar cambios.");
        return;
    }

    const writes = [];
    if (!cli.premiumOnly) {
        writes.push(leaderboardRef.set(summary.leaderboardPatch, { merge: true }));
    }
    if (!cli.statsOnly) {
        writes.push(entitlementRef.set(summary.entitlementPatch, { merge: true }));
    }

    await Promise.all(writes);

    console.log("\nCambios aplicados correctamente.");
    if (!cli.premiumOnly) {
        console.log(`- Estadisticas restauradas en leaderboard/${cli.uid}`);
    }
    if (!cli.statsOnly) {
        console.log(`- Premium permanente activado en entitlements/${cli.uid}`);
    }
}

main().catch((error) => {
    console.error("\nNo se pudieron aplicar los cambios.");
    console.error(error && error.stack ? error.stack : String(error));
    process.exit(1);
});
