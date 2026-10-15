'use strict';
const crypto = require('node:crypto');
const sync = require('../progress-sync');
const streak = require('../streak-core');
const fail = (code, status = 409) => { const e = new Error(code); e.code = code; e.status = status; throw e; };
const clean = x => JSON.parse(JSON.stringify(x));
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
const questionKey = q => JSON.stringify([String(q.caseOriginal || q.case || '').normalize('NFKC').replace(/\s+/g, ' ').trim(), q.question, q.options]);
const caseKey = q => {
    const text = String(q.caseOriginal || q.case || q.question || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
    let value = 5381; for (let i = 0; i < text.length; i++) value = (((value << 5) + value) + text.charCodeAt(i)) | 0;
    return (value >>> 0).toString(36);
};
const validId = x => typeof x === 'string' && /^[a-zA-Z0-9_-]{10,100}$/.test(x);
const parse = (data, field, fallback) => JSON.parse(data[field] || JSON.stringify(fallback));
const emptyStats = () => ({ respondidas: 0, aciertos: 0, sesiones: 0, pomodoros: 0, bySpecialty: Object.fromEntries(Object.entries({ mi: 'Medicina Interna', ped: 'Pediatría', gyo: 'Ginecología y Obstetricia', cir: 'Cirugía General' }).map(([key, name]) => [key, { total: 0, correct: 0, name }])) });
const dayAt = (ms, zone) => new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(ms));
const publicTotals = (data, instant, zone = 'America/Mexico_City') => {
    const totals = parse(data, 'globalStatsStr', emptyStats());
    return { publicScore: Math.min(100, Math.max(0, Number((((totals.aciertos || 0) / (totals.respondidas || 1)) * 100).toFixed(1)))),
        publicFlame: streak.effective(totals.streakData, new Date(dayAt(instant, zone) + 'T12:00:00')) };
};
let bank;
function canonicalQuestions(requested, source) {
    if (!Array.isArray(requested) || !requested.length || requested.length > 500) fail('invalid-questions', 400);
    if (!source && !bank) bank = buildBank(require('../questions'));
    const index = source ? buildBank(source) : bank;
    const questions = requested.map((q, i) => {
        const match = index.get(questionKey(q));
        if (!match) fail('question-bank-changed', 409);
        return { ...match, caseGroupId: q.caseGroupId ?? i + 1, subQuestionIndex: q.subQuestionIndex || 1, totalSubQuestions: q.totalSubQuestions || 1 };
    });
    if (Buffer.byteLength(JSON.stringify(questions)) > 700000) fail('exam-too-large', 413);
    return questions;
}
function buildBank(source) {
    const result = new Map();
    for (const clinical of source) for (const q of clinical.questions || [clinical]) {
        const { questions, ...base } = clinical;
        const answerIndex = /^[A-D]$/i.test(String(q.answerIndex)) ? String(q.answerIndex).toUpperCase().charCodeAt(0) - 65 : Number(q.answerIndex);
        if (!Array.isArray(q.options) || !Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= q.options.length) continue;
        const item = clean({ ...base, ...q, answerIndex });
        result.set(questionKey(item), item);
    }
    return result;
}
function hasDerivedEdit(edit, key = '') {
    if (!edit || key === 'pomodoros') return false;
    if (edit.kind === 'add') return edit.value !== 0;
    if (edit.kind === 'object') return Object.entries(edit.edits || {}).some(([child, value]) => hasDerivedEdit(value, child));
    if (edit.kind === 'list') return !!edit.edits?.length || !!edit.remove?.length;
    if (edit.kind === 'set') return typeof edit.value === 'number' ? edit.value !== 0 : !!edit.value && typeof edit.value === 'object';
    return edit.kind === 'remove';
}
function applyEvents(exam, events, now) {
    if (!Array.isArray(events) || events.length > 100) fail('invalid-events', 400);
    for (const event of events) {
        if (!Number.isSafeInteger(event.sequence) || event.sequence < 1) fail('invalid-sequence', 400);
        if (event.sequence <= exam.lastSequence) continue;
        if (event.sequence !== exam.lastSequence + 1) fail('sequence-gap');
        const observedAt = Number.isFinite(event.occurredAt) ? Math.min(now, Math.max(exam.startedAt, exam.lastEventAt || exam.startedAt, event.occurredAt)) : now;
        if (event.kind === 'answer' || event.kind === 'flag') {
            const q = exam.questionSet[event.index];
            if (!q || !Number.isInteger(event.index)) fail('invalid-answer', 400);
            if (event.kind === 'answer') {
                if (!Number.isInteger(event.selected) || event.selected < 0 || event.selected >= q.options.length) fail('invalid-answer', 400);
                const previous = exam.answers[event.index];
                if (exam.mode === 'estudio' && previous.selected !== null && previous.selected !== event.selected) fail('study-answer-locked');
                exam.answers[event.index] = { ...previous, selected: event.selected, isCorrect: event.selected === q.answerIndex, answeredAt: observedAt, confirmedAt: now };
            } else exam.answers[event.index].flagged = event.flagged === true;
        } else if (event.kind === 'position') {
            if (!Number.isInteger(event.index) || event.index < 0 || event.index >= exam.questionSet.length) fail('invalid-position', 400);
            exam.currentIndex = event.index;
        } else if (event.kind === 'pause' || event.kind === 'resume') {
            if (event.kind === 'pause' && !exam.paused) exam.elapsedSec += Math.max(0, Math.floor((observedAt - exam.runningSince) / 1000));
            if (event.kind === 'resume' && exam.paused) exam.runningSince = observedAt;
            exam.paused = event.kind === 'pause';
        } else if (event.kind === 'finish') exam.finishObservedAt = observedAt;
        else fail('invalid-event', 400);
        exam.lastEventAt = observedAt;
        exam.lastSequence = event.sequence;
    }
    return exam;
}
function aggregate(progress, exam, now) {
    const stats = parse(progress, 'globalStatsStr', emptyStats());
    const calendar = parse(progress, 'studyCalendarStr', {});
    const reviews = parse(progress, 'reviewQueueStr', []);
    const today = dayAt(exam.finishObservedAt || now, exam.timeZone);
    const addDays = (day, count) => new Date(Date.parse(day + 'T12:00:00Z') + count * 86400000).toISOString().slice(0, 10);
    let correct = 0, wrong = 0, blank = 0, earned = 0, max = 0;
    const topics = new Set();
    exam.questionSet.forEach((q, i) => {
        const answer = exam.answers[i];
        const topic = q.temaCanonical || q.tema || q.subtema || q.gpcReference || q.specialty || 'mi';
        topics.add(topic);
        const difficulty = String(q.difficulty || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f\s]/g, '');
        const weight = difficulty.includes('alta') ? 3 : /baja|facil/.test(difficulty) ? 1 : 2;
        max += weight;
        stats.byTema ||= {};
        const topicStats = stats.byTema[topic] ||= { total: 0, correct: 0, omitted: 0, specialty: q.specialty || 'mi' };
        if (answer.selected === null || answer.selected !== q.answerIndex) {
            const key = caseKey(q), fingerprint = caseKey({ question: q.question || q.explanation });
            const questionKey = `${key}:${fingerprint}`, id = `question:${questionKey}`;
            const item = { id, kind: 'question', topic, specialty: q.specialty || 'mi', title: String(q.question || topic).slice(0, 92), detail: String(q.case || q.explanation || '').slice(0, 120),
                caseKey: key, questionKey, questionFingerprint: fingerprint, dueDate: addDays(today, answer.selected === null ? 0 : 1), intervalIndex: 0, completedStages: 0, status: 'pending', lastCompletedDate: null, completedAt: null };
            const index = reviews.findIndex(entry => entry.id === id);
            if (index >= 0) reviews[index] = { ...reviews[index], ...item }; else reviews.push(item);
        }
        if (answer.selected === null) { blank++; topicStats.omitted = (topicStats.omitted || 0) + 1; return; }
        const isCorrect = answer.selected === q.answerIndex;
        if (isCorrect) { correct++; earned += weight; } else wrong++;
        stats.respondidas = (stats.respondidas || 0) + 1;
        stats.aciertos = (stats.aciertos || 0) + (isCorrect ? 1 : 0);
        stats.bySpecialty ||= {};
        const specialty = stats.bySpecialty[q.specialty || 'mi'] ||= { total: 0, correct: 0, name: q.specialty || 'mi' };
        specialty.total++; specialty.correct += isCorrect ? 1 : 0;
        topicStats.total++; topicStats.correct += isCorrect ? 1 : 0;
    });
    stats.sesiones = (stats.sesiones || 0) + 1;
    stats.totalBlank = (stats.totalBlank || 0) + blank;
    const daily = calendar[today] ||= { sessions: 0, pomodoros: 0, topics: [], planCompleted: 0 };
    daily.sessions = (daily.sessions || 0) + 1;
    daily.practiced = daily.practiced === true || correct + wrong > 0;
    daily.topics = [...new Set([...(daily.topics || []), ...topics])].slice(0, 25);
    for (const answer of exam.answers.filter(answer => answer.selected !== null)) {
        const date = dayAt(answer.answeredAt || now, exam.timeZone);
        const activity = calendar[date] ||= { sessions: 0, pomodoros: 0, topics: [], planCompleted: 0 };
        activity.practiced = true;
    }
    stats.streakData = streak.reconcile(stats.streakData, Object.keys(calendar).filter(day => calendar[day].practiced), new Date(dayAt(now, exam.timeZone) + 'T12:00:00'));
    const pct = Math.round((exam.currentExamIsReal ? earned / (max || 1) : correct / exam.questionSet.length) * 100);
    const elapsedSec = exam.elapsedSec + (exam.paused ? 0 : Math.max(0, Math.floor(((exam.finishObservedAt || now) - exam.runningSince) / 1000)));
    const summary = { id: exam.id, timestamp: now, tipo: exam.currentExamType, sessionKind: exam.mode, preguntas: exam.questionSet.length,
        pct, correct, wrong, blank, elapsedSec, topicsStudied: [...topics].slice(0, 12), questionSet: exam.questionSet, answers: exam.answers };
    const history = parse(progress, 'historyStr', []).filter(item => item.id !== exam.id);
    history.push(summary);
    const reviewed = reviews.find(item => item.id === exam.reviewQueueItemId);
    if (reviewed) {
        const steps = [0, 1, 3, 7, 14, 30], passed = blank + wrong === 0;
        reviewed.intervalIndex = passed ? Math.min((reviewed.intervalIndex || 0) + 1, steps.length) : 0;
        reviewed.completedStages = reviewed.intervalIndex; reviewed.lastReviewedAt = now; reviewed.lastCompletedDate = passed ? today : null;
        reviewed.status = reviewed.intervalIndex >= steps.length ? 'completed' : 'pending'; reviewed.completedAt = reviewed.status === 'completed' ? now : null;
        reviewed.dueDate = addDays(today, steps[reviewed.intervalIndex] || 0);
    }
    return { summary, data: { ...progress, globalStatsStr: JSON.stringify(stats), studyCalendarStr: JSON.stringify(calendar), reviewQueueStr: JSON.stringify(reviews), historyStr: JSON.stringify(sync.compactHistory(history.slice(-50))) } };
}

function createStudyService(db, options = {}) {
    const now = options.now || Date.now;
    const ref = (name, uid) => db.collection(name).doc(uid);
    const publicDevices = registry => ({ devices: Object.entries(registry.devices || {}).map(([id, d]) => ({ id, label: d.label, registeredAt: d.registeredAt, revoked: d.revoked === true })) });
    const authorize = (registry, device) => {
        const entry = registry.devices?.[device.id];
        if (!entry || entry.revoked || entry.secretHash !== hash(device.secret)) fail('device-revoked', 403);
        return entry;
    };
    const owned = (exam, body, device, registry) => {
        if (!exam || exam.status !== 'active' || exam.id !== body.examId) fail('exam-ended');
        if (exam.ownerDevice !== device.id || exam.ownerTab !== body.tabId || exam.fence !== body.fence) fail('ownership-lost');
        if (typeof body.controlToken !== 'string' || hash(body.controlToken) !== registry.controlHash) fail('ownership-lost');
    };
    return async function execute(uid, body) {
        const { action, device } = body;
        if (!validId(device?.id) || !validId(device?.secret) || !validId(body.tabId)) fail('invalid-device', 400);
        const registryRef = ref('study_sessions', uid), devicesRef = ref('study_devices', uid), progressRef = ref('user_progress', uid), examRef = ref('active_exams', uid);
        return db.runTransaction(async tx => {
            const registrySnap = await tx.get(registryRef);
            const registry = registrySnap.exists ? registrySnap.data() : { devices: {} };
            const instant = now();
            if (action === 'register') {
                registry.timeZone ||= String(body.timeZone || 'America/Mexico_City');
                try { dayAt(instant, registry.timeZone); } catch { fail('invalid-timezone', 400); }
                const existing = registry.devices[device.id];
                if (existing) authorize(registry, device);
                else {
                    if (Object.values(registry.devices).filter(d => !d.revoked).length >= 2) fail('device-limit', 403);
                    // Bound revoked records without permitting an old credential to authorize writes.
                    if (Object.keys(registry.devices).length >= 100) fail('device-registry-full', 409);
                    registry.devices[device.id] = { secretHash: hash(device.secret), label: String(body.label || 'Navegador').slice(0, 80), registeredAt: instant, migrationOpen: true };
                }
                const progressSnap = await tx.get(progressRef);
                let progress = progressSnap.exists ? progressSnap.data() : {};
                if (!progressSnap.exists) {
                    const legacy = await tx.get(ref('leaderboard', uid));
                    if (legacy.exists) progress = Object.fromEntries(sync.fields.filter(field => legacy.data()[field] !== undefined).map(field => [field, legacy.data()[field]]));
                }
                if (progress.syncVersion !== 3) {
                    const profile = await tx.get(ref('public_profiles', uid));
                    const totals = publicTotals(progress, instant, registry.timeZone);
                    tx.create(ref('study_backups', uid), { uid, capturedAt: instant, progress, reason: 'before-v3' });
                    tx.set(progressRef, { ...progress, ...totals, uid, schemaVersion: 1, syncVersion: 3, syncRevision: (progress.syncRevision || 0) + 1, syncEpoch: progress.syncEpoch || 'initial', createdAt: progress.createdAt || new Date(instant), updatedAt: new Date(instant) });
                    if (profile.exists) tx.update(ref('public_profiles', uid), { score: profile.data().scoreVisible === false ? null : totals.publicScore, flame: totals.publicFlame, updatedAt: new Date(instant) });
                }
                if (!existing) { tx.set(registryRef, registry); tx.set(devicesRef, publicDevices(registry)); }
                return { registered: true, migrationOpen: registry.devices[device.id].migrationOpen === true, devices: publicDevices(registry).devices };
            }
            const installation = authorize(registry, device);
            if (registry.deleting && action !== 'purge') fail('account-deleting', 403);
            if (action === 'purge') {
                registry.deleting = true; tx.set(registryRef, registry); return { purge: true };
            }
            if (action === 'migration-complete') {
                installation.migrationOpen = false; tx.set(registryRef, registry); return { completed: true };
            }
            if (action === 'revoke') {
                const examSnap = await tx.get(examRef);
                if (!registry.devices[body.deviceId]) fail('unknown-device', 400);
                registry.devices[body.deviceId].revoked = true;
                tx.set(registryRef, registry); tx.set(devicesRef, publicDevices(registry));
                const exam = examSnap.exists ? examSnap.data() : null;
                if (exam?.status === 'active' && exam.ownerDevice === body.deviceId) tx.update(examRef, { fence: exam.fence + 1, ownerDevice: '', ownerTab: '', lastSequence: 0, revision: exam.revision + 1 });
                return { devices: publicDevices(registry).devices };
            }
            if (action === 'progress') {
                const ops = body.operations;
                if (!Array.isArray(ops) || !ops.length || ops.length > 40) fail('invalid-operations', 400);
                if (body.migration && !installation.migrationOpen) fail('migration-closed');
                for (const op of ops) {
                    if (!validId(op.actor) || !Number.isSafeInteger(op.sequence) || op.sequence < 1 || !op.changes || Object.keys(op.changes).some(field => !sync.fields.includes(field))) fail('invalid-operation', 400);
                    // Restrict edit grammar, depth, field sizes and prototype keys before using the shared merge engine.
                    validateEdit(op.changes);
                    if (op.reset && Object.keys(op.reset).some(field => !sync.fields.includes(field))) fail('invalid-reset', 400);
                    if (op.reset) validateEdit(op.reset);
                }
                const progressSnap = await tx.get(progressRef);
                const progress = progressSnap.exists ? progressSnap.data() : {};
                const actors = [...new Set(ops.map(op => op.actor))];
                const cursorRefs = actors.map(actor => progressRef.collection('sync_clients').doc(actor));
                const cursors = await Promise.all(cursorRefs.map(cursor => tx.get(cursor)));
                const heads = Object.fromEntries(actors.map((actor, i) => [actor, cursors[i].exists ? cursors[i].data().lastSequence : 0]));
                const conflicts = ops.filter(op => op.reset || hasDerivedEdit(op.changes.historyStr) || hasDerivedEdit(op.changes.globalStatsStr));
                const archiveRef = conflicts.length ? progressRef.collection('legacy_conflicts').doc(hash(JSON.stringify(conflicts))) : null;
                const archive = archiveRef ? await tx.get(archiveRef) : null;
                const safeOps = ops.map(op => {
                    const { reset, nextEpoch, ...safe } = op;
                    const changes = { ...op.changes }; delete changes.historyStr;
                    if (conflicts.includes(op)) delete changes.globalStatsStr;
                    return { ...safe, changes };
                });
                const result = sync.mergeBatch(progress, safeOps, heads);
                {
                    // Results and history can only change through finalization, never a local snapshot.
                    result.data.historyStr = progress.historyStr || '[]';
                    const before = parse(progress, 'globalStatsStr', emptyStats()), proposed = parse(result.data, 'globalStatsStr', {});
                    result.data.globalStatsStr = JSON.stringify({ ...before, pomodoros: proposed.pomodoros ?? before.pomodoros ?? 0 });
                    const beforeCalendar = parse(progress, 'studyCalendarStr', {}), proposedCalendar = parse(result.data, 'studyCalendarStr', {});
                    for (const [day, value] of Object.entries(beforeCalendar)) if (!proposedCalendar[day]) proposedCalendar[day] = value;
                    for (const [day, value] of Object.entries(proposedCalendar)) { value.sessions = beforeCalendar[day]?.sessions || 0; value.practiced = beforeCalendar[day]?.practiced === true; }
                    result.data.studyCalendarStr = JSON.stringify(proposedCalendar);
                }
                const payload = Object.fromEntries(sync.fields.filter(field => result.data[field] !== undefined).map(field => [field, result.data[field]]));
                validateProgressData(payload);
                Object.assign(payload, publicTotals(result.data, instant, registry.timeZone), { uid, schemaVersion: 1, syncVersion: 3, syncRevision: (progress.syncRevision || 0) + 1, syncEpoch: result.data.syncEpoch || 'initial', updatedAt: new Date(instant) });
                if (Buffer.byteLength(JSON.stringify(payload)) > 900000) fail('progress-too-large', 413);
                // Legacy aggregates have no trustworthy per-attempt baseline.
                // Retain them explicitly; the migration flag cannot authorize scores.
                if (archiveRef && !archive.exists) tx.create(archiveRef, { uid, deviceId: device.id, createdAt: instant, reason: 'legacy-derived-results-review', operationsStr: JSON.stringify(conflicts) });
                const changed = ops.some(op => op.sequence > (heads[op.actor] || 0));
                if (changed) {
                    if (body.migration) tx.set(progressRef.collection('legacy_imports').doc(hash(JSON.stringify(ops))), { uid, deviceId: device.id, importedAt: instant, operationsStr: JSON.stringify(ops) });
                    tx.set(progressRef, payload, { merge: true });
                    actors.forEach((actor, i) => { if (result.heads[actor] > (heads[actor] || 0)) tx.set(cursorRefs[i], { uid, lastSequence: result.heads[actor], updatedAt: new Date(instant) }); });
                }
                return { data: changed ? { ...progress, ...payload } : progress, ignored: result.ignored, conflicts: conflicts.map(op => op.id), conflictArchive: archiveRef?.id || null };
            }
            if (action === 'reset') {
                const progressSnap = await tx.get(progressRef), examSnap = await tx.get(examRef);
                const profileSnap = await tx.get(ref('public_profiles', uid));
                if (examSnap.exists && examSnap.data().status === 'active') fail('finish-active-exam-first');
                const progress = progressSnap.data() || {};
                tx.create(progressRef.collection('reset_backups').doc(crypto.randomUUID()), { uid, progress, capturedAt: instant });
                const payload = { ...progress, globalStatsStr: JSON.stringify(emptyStats()), historyStr: '[]', studyCalendarStr: '{}', topicMasteryStr: '{}', reviewQueueStr: '[]', scaleStudyStr: '{}', dailyPlanStr: 'null', lastPostmortemStr: 'null', caseNotebookStr: '[]', pomodoroLogStr: '[]', syncEpoch: crypto.randomUUID(), syncRevision: progress.syncRevision + 1, updatedAt: new Date(instant) };
                Object.assign(payload, { publicScore: 0, publicFlame: 0 });
                tx.set(progressRef, payload);
                if (profileSnap.exists) tx.update(ref('public_profiles', uid), { score: profileSnap.data().scoreVisible === false ? null : 0, flame: 0, updatedAt: new Date(instant) });
                return { data: payload };
            }
            const examSnap = await tx.get(examRef);
            let exam = examSnap.exists ? clean(examSnap.data()) : null;
            if (exam?.id) {
                const payload = await tx.get(ref('exam_payloads', uid).collection('items').doc(exam.id));
                if (payload.exists) exam.questionSet = payload.data().questionSet;
            }
            const storeExam = value => { const { questionSet, ...metadata } = value; tx.set(examRef, metadata); };
            if (action === 'start' || action === 'claim') {
                if (exam?.status === 'active') {
                    // A competing start resumes the existing exam instead of silently replacing it.
                    if (action === 'claim' && body.examId !== exam.id) fail('exam-changed');
                    {
                        if (!exam.paused) exam.elapsedSec += Math.max(0, Math.floor((instant - exam.runningSince) / 1000));
                        Object.assign(exam, { ownerDevice: device.id, ownerTab: body.tabId, fence: exam.fence + 1, lastSequence: 0, runningSince: instant, revision: exam.revision + 1 });
                    }
                } else {
                    if (action === 'claim') return { exam: null };
                    if (!validId(body.examId)) fail('invalid-exam', 400);
                    const attemptSnap = await tx.get(ref('exam_attempts', uid).collection('items').doc(body.examId));
                    if (attemptSnap.exists) {
                        const payload = await tx.get(ref('exam_payloads', uid).collection('items').doc(body.examId));
                        return { attempt: { ...attemptSnap.data(), ...(payload.exists ? { questionSet: payload.data().questionSet } : {}) }, exam: null };
                    }
                    let timeZone = registry.timeZone || String(body.timeZone || 'America/Mexico_City');
                    try { dayAt(instant, timeZone); } catch { fail('invalid-timezone', 400); }
                    const questionSet = canonicalQuestions(body.questionSet, options.bank);
                    const keys = [...new Set(questionSet.map(caseKey))];
                    const overrides = await Promise.all(keys.map(key => tx.get(ref('case_overrides', key))));
                    const overrideMap = new Map(keys.map((key, i) => [key, overrides[i].exists ? overrides[i].data() : {}]));
                    for (const question of questionSet) {
                        question.caseOriginal ||= question.case || '';
                        question._caseKey = caseKey(question);
                        const override = overrideMap.get(caseKey(question));
                        if (override.deleted === true) fail('question-bank-changed');
                        if (override.caseText) question.case = override.caseText;
                        if (override.tema) { question.tema = override.tema; question.temaCanonical = override.tema; }
                        if (['mi', 'ped', 'gyo', 'cir'].includes(override.specialty)) question.specialty = override.specialty;
                    }
                    exam = { uid, id: body.examId, status: 'active', ownerDevice: device.id, ownerTab: body.tabId,
                        fence: (exam?.fence || 0) + 1, revision: (exam?.revision || 0) + 1, lastSequence: 0, questionSet,
                        answers: questionSet.map(() => ({ selected: null, isCorrect: null, flagged: false })), currentIndex: 0,
                        mode: body.mode === 'estudio' ? 'estudio' : 'simulacro', currentExamType: String(body.currentExamType || 'Simulacro').slice(0, 80), currentExamIsReal: body.currentExamIsReal === true,
                        durationSec: Math.min(86400, Math.max(0, Number(body.durationSec) || 0)), elapsedSec: 0, runningSince: instant, paused: false, startedAt: instant, timeZone,
                        reviewQueueItemId: String(body.reviewQueueItemId || '').slice(0, 200), challengeId: String(body.challengeId || '').slice(0, 200) };
                    tx.create(ref('exam_payloads', uid).collection('items').doc(exam.id), { uid, id: exam.id, questionSet });
                }
                const controlToken = crypto.randomUUID() + crypto.randomUUID();
                registry.controlHash = hash(controlToken);
                tx.set(registryRef, registry);
                storeExam(exam); return { exam, controlToken };
            }
            if (action === 'events' || action === 'finish') {
                if (action === 'finish') {
                    if (!validId(body.examId)) fail('invalid-exam', 400);
                    const attemptSnap = await tx.get(ref('exam_attempts', uid).collection('items').doc(body.examId));
                    if (attemptSnap.exists) {
                        const attempt = attemptSnap.data();
                        if (attempt.ownerDevice !== device.id || attempt.ownerTab !== body.tabId || attempt.fence !== body.fence) fail('ownership-lost');
                        if (typeof body.controlToken !== 'string' || hash(body.controlToken) !== attempt.controlHash) fail('ownership-lost');
                        const payload = await tx.get(ref('exam_payloads', uid).collection('items').doc(body.examId));
                        if (payload.exists) attempt.questionSet = payload.data().questionSet;
                        return { attempt, exam: exam?.id === body.examId ? exam : null };
                    }
                }
                owned(exam, body, device, registry);
                exam = applyEvents(exam, body.events || [], instant);
                exam.revision++;
                if (action === 'events') { storeExam(exam); const { questionSet, ...metadata } = exam; return { exam: metadata }; }
                const progressSnap = await tx.get(progressRef), profileSnap = await tx.get(ref('public_profiles', uid));
                const challengeRef = exam.challengeId ? ref('challenges', exam.challengeId) : null;
                const challengeSnap = challengeRef ? await tx.get(challengeRef) : null;
                const progress = progressSnap.data() || {};
                const result = aggregate(progress, exam, instant);
                const attempt = { uid, ...result.summary, ownerDevice: device.id, ownerTab: body.tabId, fence: exam.fence, controlHash: registry.controlHash, finalizedAt: instant };
                const { questionSet, ...attemptRecord } = attempt;
                tx.create(ref('exam_attempts', uid).collection('items').doc(exam.id), attemptRecord);
                const payload = { ...result.data, ...publicTotals(result.data, instant, exam.timeZone), syncVersion: 3, syncRevision: (progress.syncRevision || 0) + 1, updatedAt: new Date(instant) };
                tx.set(progressRef, payload);
                if (profileSnap.exists) {
                    const profile = profileSnap.data(), totals = JSON.parse(payload.globalStatsStr);
                    tx.update(ref('public_profiles', uid), { score: profile.scoreVisible === false ? null : payload.publicScore, flame: payload.publicFlame, updatedAt: new Date(instant) });
                }
                if (challengeSnap?.exists && challengeSnap.data().participants?.[uid]) {
                    const participants = challengeSnap.data().participants;
                    participants[uid] = { ...participants[uid], score: attempt.pct, status: 'completed', timestamp: new Date(instant) };
                    const finished = Object.values(participants).every(participant => ['completed', 'dismissed'].includes(participant.status));
                    tx.update(challengeRef, { participants, status: finished ? 'finished' : 'active' });
                }
                exam.status = 'finished';
                storeExam(exam);
                return { attempt, exam, data: payload };
            }
            fail('unknown-action', 400);
        });
    };
}
function validateEdit(value, depth = 0) {
    if (depth > 25) fail('operation-too-deep', 400);
    if (typeof value === 'number' && (!Number.isFinite(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER)) fail('invalid-number', 400);
    if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) {
        if (['__proto__', 'constructor', 'prototype'].includes(key)) fail('invalid-key', 400);
        validateEdit(child, depth + 1);
    }
}
function validateProgressData(data) {
    const arrays = new Set(['historyStr', 'reviewQueueStr', 'caseNotebookStr', 'pomodoroLogStr', 'pomodoroSpecialtiesStr', 'reportsStr']);
    for (const [field, value] of Object.entries(data)) {
        if (typeof value !== 'string') fail('invalid-progress-field', 400);
        if (!field.endsWith('Str')) { if (value.length > 200) fail('invalid-progress-field', 400); continue; }
        let decoded;
        try { decoded = JSON.parse(value); } catch { fail('invalid-progress-json', 400); }
        if (arrays.has(field) ? !Array.isArray(decoded) : decoded === null ? !['dailyPlanStr', 'lastPostmortemStr'].includes(field) : typeof decoded !== 'object' || Array.isArray(decoded)) fail('invalid-progress-field', 400);
        validateEdit(decoded);
    }
}
module.exports = { createStudyService, aggregate, applyEvents, canonicalQuestions, publicTotals };
