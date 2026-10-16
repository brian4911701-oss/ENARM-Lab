'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { runTransaction, sendQuotaError, isQuotaError } = require('../server/firestore-runtime');
const { create, messageFor } = require('../account-session');
const storage = () => {
    const values = new Map();
    return { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, String(value)) };
};
function firebase(claims = {}) {
    const user = { uid: 'test-student', getIdToken: async () => 'test-token', getIdTokenResult: async () => ({ claims }) };
    let signsOut = 0, watches = 0;
    const fb = { auth: { currentUser: user }, db: {}, doc: () => ({}),
        onSnapshot: () => { watches++; return () => { watches--; }; },
        signOut: async () => { signsOut++; fb.auth.currentUser = null; },
        signInWithCustomToken: async () => { throw new Error('Quota must never authorize a session'); }
    };
    return { fb, user, get signsOut() { return signsOut; }, get watches() { return watches; } };
}
const response = (code, status = 503) => ({ ok: false, status, json: async () => ({ code, retryAfterSeconds: 300 }) });
test('quota at the read or commit boundary never retries RESOURCE_EXHAUSTED', async () => {
    for (const phase of ['read', 'commit']) {
        let attempts = 0;
        const quota = () => Object.assign(new Error('Quota exceeded.'), { code: 8 });
        const db = { runTransaction: async (callback, options) => {
            assert.equal(options.maxAttempts, 1);
            attempts++;
            await callback({});
            throw quota();
        } };
        await assert.rejects(runTransaction(db, async () => { if (phase === 'read') throw quota(); }),
            { code: 'firestore-quota-exceeded', status: 503 });
        assert.equal(attempts, 1);
    }
});
test('concurrency ABORTED remains retryable for atomic single-session acquisition', async () => {
    let attempts = 0;
    const db = { runTransaction: async (callback, options) => {
        assert.equal(options.maxAttempts, 1);
        return callback({});
    } };
    const result = await runTransaction(db, async () => {
        if (++attempts === 1) throw Object.assign(new Error('Concurrent change'), { code: 10 });
        return 'committed';
    });
    assert.equal(result, 'committed'); assert.equal(attempts, 2);
});
test('HTTP quota response is explicit, carries Retry-After and leaves other failures untouched', () => {
    const headers = {}; let status, body;
    const res = { setHeader: (key, value) => { headers[key] = value; }, status: value => { status = value; return res; }, json: value => { body = value; } };
    assert.equal(sendQuotaError(res, { code: 8 }), true);
    assert.equal(status, 503); assert.equal(headers['Retry-After'], '300');
    assert.deepEqual(body, { code: 'firestore-quota-exceeded', retryAfterSeconds: 300 });
    assert.equal(sendQuotaError(res, { code: 'session-replaced' }), false);
    assert.equal(isQuotaError({ code: 429 }), true);
});
test('Google identity plus exhausted quota never authorizes access or produces repeated login requests', async () => {
    const state = firebase({ firebase: { sign_in_provider: 'google.com' } });
    const errors = []; let calls = 0;
    const client = create({ fb: state.fb, storage: storage(), confirmReplacement: async () => true,
        onLost: () => assert.fail('A quota outage is not a device replacement'), onError: error => errors.push(error),
        request: async () => { calls++; return response('firestore-quota-exceeded'); } });
    try {
        assert.deepEqual(await Promise.all(Array.from({ length: 5 }, () => client.ensure(state.user))), Array(5).fill(false));
        assert.equal(calls, 1); assert.equal(client.sid, ''); assert.equal(state.signsOut, 0); assert.equal(state.watches, 0);
        assert.equal(await client.ensure(state.user), false); assert.equal(calls, 1);
        assert.equal(errors[0].code, 'firestore-quota-exceeded');
        assert.match(messageFor(errors[0]), /límite temporal/);
        assert.doesNotMatch(messageFor(errors[0]), /conexión/);
    } finally { client.stop(); }
});
test('quota on an existing signed session preserves Auth and does not turn into a logout loop', async () => {
    const state = firebase({ enarmaxSid: 'existing-signed-session' }); let lost = 0;
    const client = create({ fb: state.fb, storage: storage(), confirmReplacement: async () => true, onLost: () => lost++,
        request: async () => response('firestore-quota-exceeded') });
    try {
        assert.equal(await client.ensure(state.user), true);
        assert.equal(client.sid, 'existing-signed-session'); assert.equal(state.signsOut, 0); assert.equal(lost, 0);
        assert.equal(await client.check(), false); assert.equal(state.fb.auth.currentUser, state.user);
    } finally { client.stop(); }
    assert.equal(state.watches, 0);
});
test('a replaced signed session still signs out; quota handling never bypasses authority', async () => {
    const state = firebase({ enarmaxSid: 'old-signed-session' }); let lost = 0;
    const client = create({ fb: state.fb, storage: storage(), confirmReplacement: async () => true, onLost: () => lost++,
        request: async () => response('session-replaced', 403) });
    try {
        assert.equal(await client.ensure(state.user), false);
        assert.equal(client.sid, ''); assert.equal(state.signsOut, 1); assert.equal(lost, 1);
    } finally { client.stop(); }
});
test('unavailable endpoints and broken responses are distinguished from connectivity failures', async () => {
    for (const [request, expected] of [
        [async () => response('session-backend-unconfigured'), 'session-backend-unconfigured'],
        [async () => ({ ok: false, json: async () => { throw new SyntaxError('HTML response'); } }), 'session-invalid-response'],
        [async () => { throw new TypeError('Failed to fetch'); }, 'session-network-error']
    ]) {
        const state = firebase(); let error;
        const client = create({ fb: state.fb, storage: storage(), confirmReplacement: async () => true, onLost: () => {}, onError: e => { error = e; }, request });
        try { assert.equal(await client.ensure(state.user), false); assert.equal(error.code, expected); }
        finally { client.stop(); }
    }
});

test('simultaneous permission errors check authority once and sign out without misleading alerts', async () => {
    const state = firebase({ enarmaxSid: 'old-signed-session' });
    let calls = 0, reports = 0, lost = 0, release;
    const gate = new Promise(resolve => { release = resolve; });
    const client = create({ fb: state.fb, storage: storage(), confirmReplacement: async () => true, onLost: () => lost++,
        request: async () => {
            if (++calls === 1) return { ok: true, json: async () => ({ valid: true }) };
            await gate; return response('session-replaced', 403);
        } });
    try {
        assert.equal(await client.ensure(state.user), true);
        const errors = Array.from({ length: 6 }, () => client.guardListenerError(() => reports++));
        const pending = errors.map(handler => handler({ code: 'permission-denied' }));
        await Promise.resolve(); await Promise.resolve();
        assert.equal(calls, 2, 'One initial check and one coalesced check for the failed listeners');
        release(); await Promise.all(pending);
        assert.equal(reports, 0); assert.equal(state.signsOut, 1); assert.equal(lost, 1);
        await errors[0]({ code: 'permission-denied' }); assert.equal(calls, 2);
    } finally { release(); client.stop(); }
});

test('real permission errors on a valid session remain visible; stale callbacks are ignored', async () => {
    const state = firebase({ enarmaxSid: 'valid-signed-session' }); let reports = 0, calls = 0;
    const client = create({ fb: state.fb, storage: storage(), confirmReplacement: async () => true, onLost: () => {},
        request: async () => { calls++; return { ok: true, json: async () => ({ valid: true }) }; } });
    try {
        await client.ensure(state.user);
        const handler = client.guardListenerError(() => reports++);
        await handler({ code: 'permission-denied' });
        assert.equal(reports, 1); assert.equal(state.signsOut, 0); assert.equal(calls, 2);
        await handler({ code: 'unavailable' }); assert.equal(reports, 2); assert.equal(calls, 2);
        client.stop(); await handler({ code: 'permission-denied' });
        assert.equal(reports, 2); assert.equal(calls, 2);
    } finally { client.stop(); }
});
