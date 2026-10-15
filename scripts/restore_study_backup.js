'use strict';
// Safe recovery keeps server authority and immutable attempts. Dry-run by default.
const admin = require('firebase-admin');
const crypto = require('node:crypto');
const { publicTotals } = require('../server/study-service');
const args = process.argv.slice(2);
const value = name => args[args.indexOf(name) + 1];
(async () => {
    if (!args.includes('--uid') || !value('--uid') || value('--uid').startsWith('--')) throw new Error('Uso: --uid UID [--apply --expected-revision N]. Por defecto no escribe.');
    const uid = value('--uid');
    if (!admin.apps.length) admin.initializeApp({ projectId: 'enarm-lab-social' });
    const db = admin.firestore();
    const apply = args.includes('--apply');
    const result = await db.runTransaction(async tx => {
        const progressRef = db.doc(`user_progress/${uid}`);
        const [backup, current, active] = await Promise.all([tx.get(db.doc(`study_backups/${uid}`)), tx.get(progressRef), tx.get(db.doc(`active_exams/${uid}`))]);
        const profile = await tx.get(db.doc(`public_profiles/${uid}`)), registry = await tx.get(db.doc(`study_sessions/${uid}`));
        if (!backup.exists || !current.exists) throw new Error('Falta el respaldo previo a v3 o el documento actual.');
        if (active.exists && active.data().status === 'active') throw new Error('Primero hay que terminar el examen activo.');
        const revision = current.data().syncRevision;
        if (apply && (!args.includes('--expected-revision') || Number(value('--expected-revision')) !== revision)) throw new Error('La revisión actual no coincide con --expected-revision. Ejecuta primero sin --apply.');
        const previous = backup.data().progress;
        if (apply) {
            tx.create(progressRef.collection('restore_backups').doc(crypto.randomUUID()), { uid, progress: current.data(), capturedAt: Date.now() });
            const totals = publicTotals(previous, Date.now(), registry.exists ? registry.data().timeZone : undefined);
            tx.set(progressRef, { ...previous, ...totals, uid, schemaVersion: 1, syncVersion: 3, syncRevision: revision + 1, syncEpoch: crypto.randomUUID(), createdAt: previous.createdAt || current.data().createdAt, updatedAt: new Date() });
            if (profile.exists) tx.update(db.doc(`public_profiles/${uid}`), { score: profile.data().scoreVisible === false ? null : totals.publicScore, flame: totals.publicFlame, updatedAt: new Date() });
        }
        return { uid, applied: apply, currentRevision: revision, restoredRevision: apply ? revision + 1 : null, immutableAttemptsPreserved: true };
    });
    console.log(JSON.stringify(result));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
