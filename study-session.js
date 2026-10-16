// Durable exam operations scoped to the server-authorized account session.
(function (root) {
    const create = ({ storage, send, sessionId, readExam, listenExam, onExam, onStatus, onAttempt }) => {
        let uid = '', sid = '', registration, active = null, confirmed = null, unsubscribe;
        let busy, registering, timer, retry, status = 'connecting', generation = 0, booting;
        const actor = root.crypto.randomUUID();
        const sequences = new Map();
        const prefix = () => 'enarm_exam_v4:' + uid + ':' + sid + ':';
        const entries = () => {
            const result = [];
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (!key?.startsWith(prefix())) continue;
                try { result.push({ key, ...JSON.parse(storage.getItem(key)) }); } catch { /* Preserve unreadable records. */ }
            }
            return result.sort((a, b) => a.occurredAt - b.occurredAt || a.actor.localeCompare(b.actor) || a.sequence - b.sequence);
        };
        const pending = () => entries().filter(record => record.examId === active?.id);
        const owns = () => !!registration && active?.status === 'active' && !!sid && sid === sessionId();
        const notify = () => onStatus?.({ status, pending: pending().length, owns: owns(), registered: !!registration });
        const call = async body => {
            const account = uid, epoch = generation;
            const result = await send(body, account);
            if (account !== uid || epoch !== generation) throw Object.assign(new Error('account-changed'), { code: 'account-changed' });
            return result;
        };
        const register = async account => {
            if (uid && (uid !== account || sid !== sessionId())) stop();
            uid = account; sid = sessionId();
            if (registration) return registration;
            if (!registering) registering = call({ action: 'register', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }).then(result => {
                registration = result; status = 'confirmed'; notify(); return result;
            }).finally(() => { registering = null; });
            return registering;
        };
        const overlay = exam => {
            const view = JSON.parse(JSON.stringify(exam));
            for (const event of pending()) {
                if (event.kind === 'answer') view.answers[event.index] = { ...view.answers[event.index], selected: event.selected, isCorrect: event.selected === view.questionSet[event.index].answerIndex };
                if (event.kind === 'flag') view.answers[event.index].flagged = event.flagged;
                if (event.kind === 'position') view.currentIndex = event.index;
                if (event.kind === 'pause') view.paused = true;
                if (event.kind === 'resume') view.paused = false;
            }
            return view;
        };
        const receive = exam => {
            if (!exam || (confirmed && exam.revision < confirmed.revision)) return;
            if (!exam.questionSet && confirmed?.id === exam.id) exam = { ...exam, questionSet: confirmed.questionSet };
            if (!exam.questionSet) return;
            active = confirmed = exam;
            status = pending().length ? 'pending' : 'confirmed';
            onExam?.(exam.status === 'active' ? overlay(exam) : exam, owns()); notify();
        };
        const boot = async account => {
            if (booting) return booting;
            booting = (async () => {
                await register(account);
                const epoch = generation;
                const initial = readExam ? await readExam(account) : (await call({ action: 'inspect' })).exam;
                if (epoch !== generation) return;
                if (initial) receive(initial);
                if (!unsubscribe) unsubscribe = listenExam(account, receive, error => { status = error.code || 'offline'; notify(); });
                await flush();
            })().finally(() => { booting = null; });
            return booting;
        };
        const start = async config => {
            await register(uid);
            const questionSet = config.questionSet.map(question => ({ caseOriginal: question.caseOriginal || question.case || '', question: question.question, options: question.options,
                caseGroupId: question.caseGroupId, subQuestionIndex: question.subQuestionIndex, totalSubQuestions: question.totalSubQuestions }));
            const result = await call({ action: 'start', ...config, questionSet, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
            if (result.exam) receive(result.exam);
            if (result.attempt) onAttempt?.(result.attempt);
            return result;
        };
        const queue = event => {
            if (!owns() || pending().some(event => event.kind === 'finish')) return false;
            // Each runtime has an independent ordered journal. Other tabs may safely retry it.
            const sequence = Math.max(sequences.get(active.id) || 0, active.eventHeads?.[actor] || 0) + 1;
            const record = { ...event, occurredAt: Date.now(), sequence, actor, examId: active.id };
            try { storage.setItem(prefix() + actor + ':' + record.sequence, JSON.stringify(record)); }
            catch { status = 'local-storage-full'; notify(); return false; }
            sequences.set(active.id, sequence); status = 'pending'; notify();
            clearTimeout(timer); timer = setTimeout(() => void flush(), 150);
            return true;
        };
        const flush = async (finish = false, explicit = finish) => {
            if (busy) { await busy; if (finish || pending().length) return flush(finish, explicit); return; }
            const finishingRetry = active?.status === 'finished' && pending().some(event => event.kind === 'finish');
            if (!owns() && !finishingRetry) return;
            if (finish && !pending().some(event => event.kind === 'finish')) queue({ kind: 'finish' });
            const events = pending(), batch = events.slice(0, 100);
            if (!batch.length) return;
            const action = events.length <= 100 && events.some(event => event.kind === 'finish') ? 'finish' : 'events';
            busy = (async () => {
                try {
                    // The server checks authority atomically before applying offline operations.
                    const result = await call({ action, examId: active.id, events: batch.map(({ key, ...event }) => event) });
                    batch.forEach(record => storage.removeItem(record.key));
                    if (result.exam) receive(result.exam);
                    if (result.attempt) onAttempt?.(result.attempt, result.data);
                    status = pending().length ? 'pending' : 'confirmed'; notify(); return result;
                } catch (error) {
                    if (error.code === 'account-changed') return;
                    status = error.code || 'offline';
                    if (!['session-replaced', 'exam-ended', 'unauthenticated'].includes(error.code)) {
                        clearTimeout(retry); retry = setTimeout(() => void flush(), error.code === 'firestore-quota-exceeded' ? 300000 : 10000);
                    }
                    notify(); if (explicit) throw error;
                }
            })();
            let result;
            try { result = await busy; } finally { busy = null; }
            if (result && owns() && pending().length) return flush(finish, explicit);
            return result;
        };
        function stop() {
            generation++; unsubscribe?.(); unsubscribe = null; clearTimeout(timer); clearTimeout(retry);
            uid = sid = ''; active = confirmed = registration = null; registering = booting = null;
        }
        return { register, boot, start, queue, flush, stop, owns,
            get active() { return active; }, get migrationOpen() { return registration?.migrationOpen === true; },
            async progress(operations) { return call({ action: 'progress', operations, migration: registration?.migrationOpen === true }); },
            async completeMigration() { if (registration?.migrationOpen) { await call({ action: 'migration-complete' }); if (registration) registration.migrationOpen = false; } },
            reset: () => call({ action: 'reset' }), purge: () => call({ action: 'purge' })
        };
    };
    root.ENARMStudy = { create };
    if (typeof module !== 'undefined') module.exports = { create };
})(typeof globalThis !== 'undefined' ? globalThis : window);
