// Durable, account-scoped progress outbox. A cloud acknowledgement may only
// clear the exact revision it saved, never a newer change made while offline.
(function (root) {
    const compactHistory = (history, maxBytes = 500000) => {
        const bytes = value => new TextEncoder().encode(JSON.stringify(value)).length;
        const entries = (history || []).map(session => {
            const { questionSet, answers, ...summary } = session;
            // Flattened cases also carried the original questions array. It is
            // redundant with the question and answer shown during review.
            const details = Array.isArray(questionSet) && Array.isArray(answers)
                ? { ...summary, questionSet: questionSet.map(({ questions, ...question }) => question), answers }
                : summary;
            return { summary, details };
        });
        const result = entries.map(entry => entry.summary);
        let remaining = maxBytes - bytes(result);
        for (let i = entries.length - 1; i >= 0; i--) {
            const extra = bytes(entries[i].details) - bytes(entries[i].summary);
            if (extra <= remaining) {
                result[i] = entries[i].details;
                remaining -= extra;
            }
        }
        // Session summaries and scores always survive. Detailed review of the
        // newest sessions uses the remaining space below Firestore's document limit.
        return result;
    };
    const clone = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    const object = value => value && typeof value === 'object' && !Array.isArray(value);
    const id = () => root.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
    const jsonFields = new Set(['globalStatsStr', 'historyStr', 'appearanceStr', 'dailyPlanStr', 'reviewQueueStr', 'scaleStudyStr', 'topicMasteryStr', 'caseNotebookStr', 'studyCalendarStr', 'lastPostmortemStr', 'pomodoroSettingsStr', 'pomodoroLogStr', 'pomodoroSpecialtiesStr', 'reportsStr']);
    const fields = [...jsonFields, 'theme', 'fontPreset', 'pomodoroFocusLabel'];
    const studyFields = new Set(['globalStatsStr', 'historyStr', 'dailyPlanStr', 'reviewQueueStr', 'scaleStudyStr', 'topicMasteryStr', 'caseNotebookStr', 'studyCalendarStr', 'lastPostmortemStr', 'pomodoroLogStr']);
    const decode = (field, value) => jsonFields.has(field) && typeof value === 'string' ? JSON.parse(value) : value;
    const encode = (field, value) => jsonFields.has(field) ? JSON.stringify(value) : value;
    const identity = item => String(item?.id || (item?.timestamp != null ? `session:${item.timestamp}:${item.tipo || ''}:${item.preguntas || ''}` : item?.caseKey || (item?.completedAt ? `pomo:${item.completedAt}` : JSON.stringify(item))));
    const counterNames = new Set(['respondidas', 'aciertos', 'sesiones', 'pomodoros', 'totalBlank', 'total', 'correct', 'omitted', 'sessions', 'planCompleted', 'reviewCount']);

    const difference = (before, after, counters = false, key = '', history = false) => {
        if (same(before, after)) return null;
        if (after === undefined) return { kind: 'remove' };
        if (typeof after === 'number' && counters && counterNames.has(key)) return { kind: 'add', value: after - (Number(before) || 0) };
        if (Array.isArray(after)) {
            const old = new Map((Array.isArray(before) ? before : []).map(item => [identity(item), item]));
            const next = new Map(after.map(item => [identity(item), item]));
            const edits = [];
            for (const [itemId, item] of next) {
                const edit = difference(old.get(itemId), item, counters);
                if (edit) edits.push([itemId, edit]);
            }
            return { kind: 'list', edits, remove: history ? [] : [...old.keys()].filter(itemId => !next.has(itemId)) };
        }
        if (object(after)) {
            const edits = {};
            for (const child of new Set([...Object.keys(before || {}), ...Object.keys(after)])) {
                if (child === 'streakData' || child === '_sync') continue;
                const edit = difference(before?.[child], after[child], counters, child);
                if (edit) edits[child] = edit;
            }
            return Object.keys(edits).length ? { kind: 'object', edits } : null;
        }
        return { kind: 'set', value: clone(after) };
    };
    const applyEdit = (current, edit) => {
        if (edit.kind === 'remove') return undefined;
        if (edit.kind === 'set') return clone(edit.value);
        if (edit.kind === 'add') return Math.max(0, (Number(current) || 0) + edit.value);
        if (edit.kind === 'object') {
            const next = object(current) ? clone(current) : {};
            for (const [key, value] of Object.entries(edit.edits)) {
                const result = applyEdit(next[key], value);
                if (result === undefined) delete next[key]; else next[key] = result;
            }
            return next;
        }
        const values = new Map((Array.isArray(current) ? current : []).map(item => [identity(item), item]));
        edit.remove.forEach(key => values.delete(key));
        for (const [key, value] of edit.edits) values.set(key, applyEdit(values.get(key), value));
        return [...values.values()];
    };
    const reconcileStreak = (data, seed) => {
        const streak = root.ENARMStreak || (typeof require === 'function' ? require('./streak-core') : null);
        if (!streak || !data.globalStatsStr) return;
        const stats = decode('globalStatsStr', data.globalStatsStr);
        const calendar = decode('studyCalendarStr', data.studyCalendarStr) || {};
        const days = Object.entries(calendar).filter(([, day]) => day?.practiced || (day?.practiced !== false && day?.sessions > 0)).map(([day]) => day);
        (decode('historyStr', data.historyStr) || []).forEach(session => {
            if (Number(session.preguntas) > Number(session.blank || 0)) days.push(streak.dateKey(new Date(session.timestamp)));
        });
        let initial = stats.streakData;
        const previousDay = streak.normalizeDay(seed?.lastStudyDate), currentDay = streak.normalizeDay(initial?.lastStudyDate);
        if (previousDay && (!currentDay || previousDay < currentDay)) initial = seed;
        stats.streakData = streak.reconcile(initial, days);
        data.globalStatsStr = JSON.stringify(stats);
    };
    const applyOperation = (remote, operation) => {
        const next = clone(remote || {});
        const stale = (operation.epoch || 'initial') !== (next.syncEpoch || 'initial');
        if (operation.reset) {
            Object.assign(next, operation.reset);
            next.syncEpoch = operation.nextEpoch;
        }
        for (const [field, edit] of Object.entries(operation.changes)) {
            if (stale && !operation.reset && studyFields.has(field)) continue;
            if (field === 'dailyPlanStr' && operation.planDate && decode(field, next[field])?.date > operation.planDate) continue;
            next[field] = encode(field, applyEdit(decode(field, next[field]), edit));
        }
        if (next.historyStr) {
            const history = decode('historyStr', next.historyStr).sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
            next.historyStr = JSON.stringify(compactHistory(history.slice(-50)));
        }
        if (!stale || operation.reset) reconcileStreak(next, operation.reset ? null : operation.streakSeed);
        return next;
    };
    const makeOperation = (actor, sequence, before, after, reset = false) => {
        const changes = {};
        for (const field of fields) {
            if (!(field in after)) continue;
            const edit = difference(decode(field, before?.[field]), decode(field, after[field]),
                ['globalStatsStr', 'studyCalendarStr', 'topicMasteryStr'].includes(field), '', field === 'historyStr');
            if (edit) changes[field] = edit;
        }
        const resetData = reset ? Object.fromEntries([...studyFields].filter(field => field in after).map(field => [field, after[field]])) : null;
        if (reset) for (const field of studyFields) delete changes[field];
        if (!reset && !Object.keys(changes).length) return null;
        return {
            id: `${actor}:${sequence}`, actor, sequence, changes, epoch: before?.syncEpoch || 'initial',
            streakSeed: decode('globalStatsStr', before?.globalStatsStr)?.streakData || null,
            planDate: decode('dailyPlanStr', after.dailyPlanStr)?.date || null,
            ...(reset ? { reset: resetData, nextEpoch: id() } : {})
        };
    };
    const mergeBatch = (remote, operations, heads = {}) => {
        let data = clone(remote || {});
        const nextHeads = { ...heads }, ignored = [];
        for (const operation of operations) {
            if (operation.sequence <= (nextHeads[operation.actor] || 0)) continue;
            if (!operation.reset && operation.epoch !== (data.syncEpoch || 'initial')) ignored.push(operation.id);
            data = applyOperation(data, operation);
            nextHeads[operation.actor] = operation.sequence;
        }
        return { data, heads: nextHeads, ignored };
    };
    const hasDerivedEdit = (edit, key = '') => {
        if (!edit || key === 'pomodoros') return false;
        if (edit.kind === 'add') return edit.value !== 0;
        if (edit.kind === 'object') return Object.entries(edit.edits || {}).some(([child, value]) => hasDerivedEdit(value, child));
        if (edit.kind === 'list') return !!edit.edits?.length || !!edit.remove?.length;
        if (edit.kind === 'set') return typeof edit.value === 'number' ? edit.value !== 0 : !!edit.value && typeof edit.value === 'object';
        return edit.kind === 'remove';
    };
    const pendingView = (canonical, pending) => {
        if (canonical.syncVersion !== 3) return pending.reduce(applyOperation, clone(canonical));
        // Match the v3 server: legacy journals cannot replace confirmed exam results.
        // Keep the original operations for acknowledgement or conflict archival.
        const view = pending.reduce((current, operation) => {
            const { reset, nextEpoch, ...safe } = operation;
            safe.changes = { ...operation.changes };
            delete safe.changes.historyStr;
            if (hasDerivedEdit(safe.changes.globalStatsStr)) delete safe.changes.globalStatsStr;
            return applyOperation(current, safe);
        }, clone(canonical));
        if (canonical.globalStatsStr !== undefined) {
            const stats = decode('globalStatsStr', canonical.globalStatsStr);
            const proposed = decode('globalStatsStr', view.globalStatsStr);
            if (proposed?.pomodoros !== undefined) stats.pomodoros = proposed.pomodoros;
            view.globalStatsStr = encode('globalStatsStr', stats);
        }
        view.historyStr = canonical.historyStr || '[]';
        const before = decode('studyCalendarStr', canonical.studyCalendarStr) || {};
        const calendar = decode('studyCalendarStr', view.studyCalendarStr) || {};
        for (const [day, value] of Object.entries(before)) if (!calendar[day]) calendar[day] = clone(value);
        for (const [day, value] of Object.entries(calendar)) {
            value.sessions = before[day]?.sessions || 0;
            value.practiced = before[day]?.practiced === true;
        }
        view.studyCalendarStr = encode('studyCalendarStr', calendar);
        return view;
    };
    const legacyMerge = (remote, local, key = '') => {
        if (typeof local === 'number' && counterNames.has(key)) return Math.max(Number(remote) || 0, local);
        if (Array.isArray(local)) {
            const values = new Map((Array.isArray(remote) ? remote : []).map(item => [identity(item), item]));
            local.forEach(item => values.set(identity(item), item));
            return [...values.values()];
        }
        if (object(local)) {
            const next = clone(remote || {});
            for (const [child, value] of Object.entries(local)) next[child] = legacyMerge(next[child], value, child);
            return next;
        }
        return clone(local);
    };
    const create = (storage, options = {}) => {
        const actor = options.actor || id(), views = new Map(), sequences = new Map();
        let cacheError = null;
        const prefix = uid => `enarm_progress_v2:${uid}:`;
        const ownKey = uid => prefix(uid) + actor;
        const operationPrefix = uid => `enarm_progress_op:${uid}:`;
        const operationKey = (uid, operation) => operationPrefix(uid) + operation.id;
        const legacyKey = uid => `enarm_progress_backup:${uid}`;
        const load = key => {
            try { return JSON.parse(storage.getItem(key) || 'null'); }
            catch (error) { console.warn('No se pudo leer un respaldo de progreso.', error); return null; }
        };
        const records = uid => {
            const result = [];
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (!key?.startsWith(prefix(uid))) continue;
                const record = load(key);
                if (record?.uid === uid && Array.isArray(record.operations)) result.push({ ...record, key });
            }
            return result.sort((a, b) => (Number(a.canonical?.syncRevision) || 0) - (Number(b.canonical?.syncRevision) || 0) || a.savedAt - b.savedAt);
        };
        const operations = uid => {
            const pending = [];
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (key?.startsWith(operationPrefix(uid))) {
                    const operation = load(key);
                    if (operation?.id && operation.actor && Number.isInteger(operation.sequence)) pending.push(operation);
                }
            }
            // Each actor is an ordered stream. Independent actors are combined
            // by transaction commit order, without trusting device clocks.
            return pending.sort((a, b) => a.actor.localeCompare(b.actor) || a.sequence - b.sequence);
        };
        const persist = (uid, view, canonical, pending, sequence) => {
            views.set(uid, { view: clone(view), canonical: clone(canonical) });
            sequence = Math.max(sequence || 0, sequences.get(uid) || 0);
            sequences.set(uid, sequence);
            try {
                storage.setItem(ownKey(uid), JSON.stringify({ uid, actor, sequence, view, canonical, operations: pending, savedAt: Date.now() }));
                cacheError = null;
            } catch (error) {
                if (!['QuotaExceededError', 'SecurityError'].includes(error.name)) throw error;
                if (!cacheError) console.warn('El progreso confirmado se cargó, pero no se pudo guardar su copia local.', error);
                cacheError = error;
            }
        };
        const begin = (uid, data) => { if (!views.has(uid)) views.set(uid, { view: clone(data), canonical: clone(data) }); };
        const read = uid => {
            const all = records(uid), latest = all.at(-1), pending = operations(uid);
            const current = views.get(uid);
            if (!current && !latest) return load(legacyKey(uid));
            return { uid, data: clone(current?.view || latest.view), pending: pending.length > 0, revision: pending.at(-1)?.id || '', operations: pending };
        };
        const stage = (uid, data, stageOptions = {}) => {
            if (!uid) return null;
            const previous = views.get(uid) || { view: records(uid).at(-1)?.view || {}, canonical: {} };
            const own = load(ownKey(uid));
            const sequence = Math.max(own?.sequence || 0, sequences.get(uid) || 0, ...operations(uid).filter(operation => operation.actor === actor).map(operation => operation.sequence), 0) + 1;
            const operation = makeOperation(actor, sequence, previous.view, data, stageOptions.reset);
            if (!operation) return read(uid);
            if (stageOptions.importId) operation.importId = stageOptions.importId;
            const view = { ...clone(data), syncEpoch: operation.nextEpoch || previous.view.syncEpoch || 'initial' };
            // Immutable operation keys avoid a read/modify/write race between
            // browser tabs. An ACK deletes only the exact operations it saved.
            storage.setItem(operationKey(uid, operation), JSON.stringify(operation));
            views.set(uid, { view: clone(view), canonical: clone(previous.canonical) });
            persist(uid, view, previous.canonical, [], sequence);
            return read(uid);
        };
        const restore = (uid, remote, available) => {
            const latest = records(uid).at(-1), legacy = load(legacyKey(uid));
            let canonical = available ? clone(remote) : clone(latest?.canonical || legacy?.data || remote);
            if (legacy?.uid === uid && legacy.pending && available) {
                const recovered = { ...canonical };
                for (const field of fields) if (field in legacy.data) recovered[field] = encode(field, legacyMerge(decode(field, canonical[field]), decode(field, legacy.data[field])));
                reconcileStreak(recovered, decode('globalStatsStr', canonical.globalStatsStr)?.streakData);
                // The old backup has no delta baseline. Compare its conservative
                // recovery against the server, never against the cached UI totals.
                views.set(uid, { view: clone(canonical), canonical: clone(canonical) });
                const importId = legacy.revision || 'legacy-v1';
                if (!operations(uid).some(operation => operation.importId === importId)) stage(uid, recovered, { importId });
                // Preserve the original snapshot for investigating old divergent
                // totals, which have no baseline and cannot be safely summed.
                try {
                    const archive = `enarm_progress_legacy_archive:${uid}`;
                    if (!storage.getItem(archive)) storage.setItem(archive, JSON.stringify(legacy));
                } catch (error) { console.warn('No hubo espacio para una copia adicional del respaldo anterior.', error); }
                storage.removeItem(legacyKey(uid));
            }
            const pending = operations(uid);
            if (!pending.length) return accept(uid, canonical);
            if (!available) canonical = clone(latest?.canonical || views.get(uid)?.canonical || canonical);
            const view = pendingView(canonical, pending), own = load(ownKey(uid));
            persist(uid, view, canonical, own?.operations || [], own?.sequence || 0);
            return view;
        };
        const accept = (uid, remote, accepted = []) => {
            accepted.forEach(operation => storage.removeItem(operationKey(uid, operation)));
            const view = pendingView(remote, operations(uid)), own = load(ownKey(uid));
            persist(uid, view, remote, own?.operations || [], own?.sequence || 0);
            const pendingActors = new Set(operations(uid).map(operation => operation.actor));
            // Keep the last durable backup if the replacement cache could not be written.
            if (!cacheError) for (const record of records(uid)) if (record.actor !== actor && !pendingActors.has(record.actor)) storage.removeItem(record.key);
            return view;
        };
        const forget = uid => {
            records(uid).forEach(record => storage.removeItem(record.key));
            operations(uid).forEach(operation => storage.removeItem(operationKey(uid, operation)));
            storage.removeItem(legacyKey(uid)); views.delete(uid); sequences.delete(uid);
            storage.removeItem(`enarm_progress_legacy_archive:${uid}`);
        };
        const batch = (uid, limit = 40, maxBytes = 650000) => {
            const selected = [], encoder = new TextEncoder();
            let bytes = 2;
            for (const operation of operations(uid).slice(0, limit)) {
                const size = encoder.encode(JSON.stringify(operation)).length + 1;
                if (selected.length && bytes + size > maxBytes) break;
                selected.push(operation); bytes += size;
            }
            return selected;
        };
        return { begin, read, stage, restore, accept, batch, forget, actor, get cacheError() { return cacheError; } };
    };
    const api = { create, compactHistory, makeOperation, applyOperation, mergeBatch, legacyMerge, hasDerivedEdit, id, fields };
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.ENARMProgressSync = api;
})(typeof window !== "undefined" ? window : globalThis);
