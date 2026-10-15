// Account-scoped, durable exam operations. Server ACK is the only confirmation.
(function (root) {
    const uuid = () => root.crypto.randomUUID?.() || Array.from(root.crypto.getRandomValues(new Uint8Array(24)), byte => byte.toString(16).padStart(2, '0')).join('');
    const create = ({ storage, send, readExam, listenExam, listenDevices, onExam, onStatus, onDevices, onAttempt }) => {
        let uid = '', device, registration, active = null, confirmed = null, unsubscribe, unsubscribeDevices;
        let busy = null, timer, retry, autoClaimed = false, status = 'connecting', stopped = false;
        let controlToken = '', controlFence = -1;
        const tabId = uuid();
        const prefix = () => `enarm_exam_op:${uid}:`;
        const entries = () => {
            const result = [];
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (!key?.startsWith(prefix())) continue;
                try { result.push({ key, ...JSON.parse(storage.getItem(key)) }); } catch { /* Leave unreadable records untouched. */ }
            }
            return result.sort((a, b) => a.sequence - b.sequence);
        };
        const own = record => active && active.ownerTab === tabId && active.ownerDevice === device?.id && record.examId === active.id && record.fence === active.fence && record.tabId === tabId;
        const pending = () => entries().filter(own);
        const conflicts = () => entries().filter(record => !own(record));
        const owns = () => active?.status === 'active' && active.ownerDevice === device?.id && active.ownerTab === tabId && active.fence === controlFence && !!controlToken;
        const notify = () => onStatus?.({ status, pending: pending().length, conflicts: conflicts(), owns: owns(), registered: !!registration });
        const call = async body => {
            const account = uid;
            const result = await send({ ...body, device, tabId: body.tabId || tabId }, account);
            if (account !== uid || stopped) throw Object.assign(new Error('account-changed'), { code: 'account-changed' });
            return result;
        };
        const inspect = async account => readExam ? readExam(account) : (await call({ action: 'inspect' })).exam;
        const register = async account => {
            if (uid && uid !== account) stop();
            uid = account; stopped = false;
            if (registration) return registration;
            const key = `enarm_study_device:${uid}`;
            device = JSON.parse(storage.getItem(key) || 'null');
            if (!device) { device = { id: uuid(), secret: uuid() + uuid() }; storage.setItem(key, JSON.stringify(device)); }
            if (!busyRegistration) busyRegistration = call({ action: 'register', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, label: root.navigator?.userAgentData?.platform || root.navigator?.platform || 'Navegador' }).then(result => {
                registration = result; onDevices?.(result.devices, device.id); status = 'confirmed'; notify(); return result;
            }).catch(error => { if (error.code !== 'account-changed') { status = error.code || 'offline'; notify(); } throw error; }).finally(() => { if (uid === account) busyRegistration = null; });
            return busyRegistration;
        };
        let busyRegistration = null;
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
            if (!exam) return;
            if (confirmed && exam.revision < confirmed.revision) return;
            if (!exam.questionSet && confirmed?.id === exam.id) exam = { ...exam, questionSet: confirmed.questionSet };
            if (!exam.questionSet) return;
            const wasOwner = owns();
            active = confirmed = exam;
            try { storage.setItem(`enarm_exam_cache:${uid}`, JSON.stringify(exam)); } catch { /* Cloud confirmation remains valid even if the optional cache is full. */ }
            if (!owns() && wasOwner) status = 'ownership-lost';
            else if (owns()) status = pending().length ? 'pending' : 'confirmed';
            else status = 'read-only';
            if (exam.status === 'active') onExam?.(overlay(exam), owns());
            else onExam?.(exam, false);
            notify();
        };
        const claim = async examId => {
            status = 'transferring'; notify();
            try { const result = await call({ action: 'claim', examId }); if (result.exam) { controlToken = result.controlToken; controlFence = result.exam.fence; receive(result.exam); } return result.exam; }
            catch (e) { status = e.code || 'offline'; notify(); throw e; }
        };
        const boot = async account => {
            await register(account);
            unsubscribe?.(); unsubscribeDevices?.();
            const scope = uid;
            unsubscribeDevices = listenDevices(scope, devices => {
                if (uid !== scope) return;
                onDevices?.(devices, device.id);
                if (devices.find(d => d.id === device.id)?.revoked) { status = 'device-revoked'; active = active && { ...active, ownerDevice: '' }; notify(); onExam?.(active, false); }
            });
            // Only a fresh opening acquires automatically. Snapshot/foreground events
            // never steal ownership back and forth between open installations.
            let initial;
            try { initial = await inspect(scope); } catch (error) {
                const cached = JSON.parse(storage.getItem(`enarm_exam_cache:${uid}`) || 'null');
                if (cached) receive(cached);
                status = 'offline'; notify(); throw error;
            }
            if (uid !== scope) return;
            // Reopen can safely recover the previous runtime's durable journal
            // only while the server still recognizes that exact private lease.
            const recoverable = entries().filter(record => initial?.ownerDevice === device.id && record.examId === initial.id
                && record.fence === initial.fence && record.tabId === initial.ownerTab && record.controlToken);
            for (let offset = 0; offset < recoverable.length; offset += 100) {
                const batch = recoverable.slice(offset, offset + 100);
                const finish = recoverable.some(event => event.kind === 'finish') && offset + 100 >= recoverable.length;
                try {
                    const result = await call({ action: finish ? 'finish' : 'events', examId: initial.id, fence: initial.fence,
                        tabId: initial.ownerTab, controlToken: batch[0].controlToken, events: batch.map(({ key, ...event }) => event) });
                    batch.forEach(record => storage.removeItem(record.key));
                    if (result.exam) initial = { ...result.exam, questionSet: initial.questionSet };
                    if (result.attempt) onAttempt?.(result.attempt, result.data);
                } catch (error) {
                    if (['ownership-lost', 'exam-ended'].includes(error.code)) { initial = await inspect(scope); break; }
                    status = error.code || 'offline'; notify(); throw error;
                }
            }
            const shouldClaim = initial?.status === 'active' && !autoClaimed;
            autoClaimed = true;
            if (shouldClaim) { await claim(initial.id); }
            else if (initial) receive(initial);
            unsubscribe = listenExam(scope, receive, error => { status = error.code || 'offline'; notify(); });
        };
        const start = async config => {
            await register(uid);
            autoClaimed = true;
            const questionSet = config.questionSet.map(question => ({ caseOriginal: question.caseOriginal || question.case || '', question: question.question, options: question.options,
                caseGroupId: question.caseGroupId, subQuestionIndex: question.subQuestionIndex, totalSubQuestions: question.totalSubQuestions }));
            const result = await call({ action: 'start', ...config, questionSet, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
            if (result.exam) { controlToken = result.controlToken; controlFence = result.exam.fence; receive(result.exam); }
            if (result.attempt) onAttempt?.(result.attempt);
            return result;
        };
        const queue = event => {
            if (!owns() || status === 'device-revoked') return false;
            if (event.kind !== 'finish' && pending().some(event => event.kind === 'finish')) return false;
            const sequence = Math.max(active.lastSequence || 0, ...pending().map(item => item.sequence), 0) + 1;
            const record = { ...event, occurredAt: Date.now(), sequence, examId: active.id, fence: active.fence, tabId, controlToken };
            // Persist before changing UI or attempting the network.
            try { storage.setItem(prefix() + active.id + ':' + active.fence + ':' + sequence, JSON.stringify(record)); }
            catch { status = 'local-storage-full'; notify(); return false; }
            status = 'pending'; notify();
            clearTimeout(timer); timer = setTimeout(() => void flush(), 150);
            return true;
        };
        const flush = async (finish = false, explicit = finish) => {
            if (busy) { try { await busy; } catch (error) { if (explicit) throw error; return; } if (finish) return flush(true, explicit); return; }
            const finishingRetry = active?.status === 'finished' && pending().some(event => event.kind === 'finish') && active.fence === controlFence;
            if (!owns() && !finishingRetry) { notify(); return; }
            if (finish && !pending().some(event => event.kind === 'finish')) queue({ kind: 'finish' });
            finish = finish || pending().some(event => event.kind === 'finish');
            const batch = pending().slice(0, 100);
            if (!batch.length && !finish) return;
            const examId = active.id, fence = active.fence;
            const action = finish && pending().length <= 100 ? 'finish' : 'events';
            busy = (async () => {
                try {
                    const result = await call({ action, examId, fence, controlToken, events: batch.map(({ key, ...event }) => event) });
                    batch.forEach(record => storage.removeItem(record.key));
                    if (result.exam) receive(result.exam);
                    if (result.attempt) onAttempt?.(result.attempt, result.data);
                    status = pending().length ? 'pending' : 'confirmed'; notify();
                    return result;
                } catch (error) {
                    if (error.code === 'account-changed') return;
                    status = error.code || 'offline';
                    if (['ownership-lost', 'exam-ended', 'device-revoked'].includes(error.code)) {
                        active = active && { ...active, ownerTab: '' }; onExam?.(active, false);
                    } else { clearTimeout(retry); retry = setTimeout(() => void flush(), 10000); }
                    notify();
                    if (explicit) throw error;
                }
            })();
            let result;
            try { result = await busy; } finally { busy = null; }
            if (result && owns() && pending().length) return flush(finish, explicit);
            if (finish && action !== 'finish' && owns()) return flush(true, explicit);
            return result;
        };
        const recover = async key => {
            const record = entries().find(entry => entry.key === key);
            if (!record || record.kind !== 'answer' || record.examId !== active?.id) throw new Error('El pendiente pertenece a otro examen y se conserva para revisión.');
            if (!owns()) await claim(active.id);
            if (active.mode === 'estudio' && active.answers[record.index]?.selected !== null && active.answers[record.index]?.selected !== record.selected) throw new Error('La respuesta de estudio ya está confirmada y no puede reemplazarse. El pendiente se conserva para revisión.');
            if (!queue({ kind: 'answer', index: record.index, selected: record.selected })) throw new Error('No tienes el control del examen.');
            await flush();
            if (status !== 'confirmed') throw new Error('La recuperación aún no está confirmada.');
            storage.removeItem(key); notify();
        };
        function stop() {
            stopped = true; unsubscribe?.(); unsubscribeDevices?.(); clearTimeout(timer); clearTimeout(retry);
            uid = ''; active = confirmed = registration = null; autoClaimed = false; busyRegistration = null;
            controlToken = ''; controlFence = -1;
        }
        return { register, boot, start, claim, queue, flush, recover, stop, owns, conflicts,
            get active() { return active; }, get deviceId() { return device?.id; }, get migrationOpen() { return registration?.migrationOpen === true; },
            async progress(operations) { const result = await call({ action: 'progress', operations, migration: registration?.migrationOpen === true }); return result; },
            async completeMigration() { if (registration?.migrationOpen) { registration.migrationOpen = false; try { await call({ action: 'migration-complete' }); } catch (error) { if (registration) registration.migrationOpen = true; throw error; } } },
            async revoke(deviceId) { const result = await call({ action: 'revoke', deviceId }); onDevices?.(result.devices, device.id); return result; },
            reset: () => call({ action: 'reset' }),
            purge: () => call({ action: 'purge' }),
            discard(key) { storage.removeItem(key); notify(); }
        };
    };
    root.ENARMStudy = { create };
    if (typeof module !== 'undefined') module.exports = { create };
})(typeof globalThis !== 'undefined' ? globalThis : window);
