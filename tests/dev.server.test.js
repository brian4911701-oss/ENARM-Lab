'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { createDevServer } = require('../scripts/dev_server');

async function serve(t, options) {
    const server = createDevServer(options);
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }));
    return 'http://127.0.0.1:' + server.address().port;
}

test('preview serves current source assets and never returns HTML for an API', async t => {
    const base = await serve(t);
    const html = await fetch(base + '/');
    assert.equal(html.status, 200);
    assert.match(html.headers.get('content-type'), /text\/html/);
    assert.equal(await html.text(), fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8'));
    const js = await fetch(base + '/account-session.js');
    assert.equal(js.status, 200);
    assert.match(js.headers.get('content-type'), /javascript/);
    assert.equal(js.headers.get('cache-control'), 'no-store');
    const head = await fetch(base + '/styles.css', { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');
    const unknown = await fetch(base + '/api/unknown');
    assert.equal(unknown.status, 404);
    assert.deepEqual(await unknown.json(), { code: 'not-found' });
});

test('private credentials, server source and traversal are never served', async t => {
    const base = await serve(t);
    const credentialNames = fs.readdirSync(path.join(__dirname, '..')).filter(name => /firebase-adminsdk.*\.json$/i.test(name));
    for (const name of ['.env', '.env.local', '.git/config', '.local-secrets/key.json', 'package.json',
        'api/account-session.js', 'server/account-session.js', 'scripts/dev_server.js',
        'avatars/%2e%2e%5cpackage.json', 'avatars/%2eenv', ...credentialNames]) {
        const response = await fetch(base + '/' + name);
        assert.equal(response.status, 404, name);
        assert.deepEqual(await response.json(), { code: 'not-found' });
    }
});

test('local API adapter preserves JSON body, authentication headers, status and response headers', async t => {
    const base = await serve(t, { handlers: { '/api/account-session': () => async (request, response) => {
        assert.equal(request.headers.authorization, 'Bearer local-test');
        assert.deepEqual(request.body, { action: 'open', deviceId: 'test-device' });
        response.setHeader('Retry-After', '300');
        response.status(503).json({ code: 'firestore-quota-exceeded' });
    } } });
    const response = await fetch(base + '/api/account-session', { method: 'POST',
        headers: { Authorization: 'Bearer local-test', 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'open', deviceId: 'test-device' }) });
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('retry-after'), '300');
    assert.deepEqual(await response.json(), { code: 'firestore-quota-exceeded' });
});

test('real API handlers execute locally and still reject unauthenticated access', async t => {
    const base = await serve(t);
    for (const endpoint of ['account-session', 'study-sync', 'start-premium-trial']) {
        const response = await fetch(base + '/api/' + endpoint);
        assert.equal(response.status, 405);
        assert.equal(response.headers.get('allow'), 'POST');
        assert.equal((await response.json()).code, 'method-not-allowed');
    }
    for (const endpoint of ['study-sync', 'start-premium-trial']) {
        const response = await fetch(base + '/api/' + endpoint, { method: 'POST',
            headers: { 'Content-Type': 'application/json' }, body: '{"action":"check"}' });
        assert.equal(response.status, 401);
        assert.equal((await response.json()).code, 'unauthenticated');
    }
});

test('local API rejects cross-origin calls, malformed JSON and oversized payloads before executing handlers', async t => {
    let calls = 0;
    const base = await serve(t, { handlers: { '/api/account-session': () => async () => { calls++; } } });
    for (const [body, headers, status] of [
        ['{}', { Origin: 'https://example.com' }, 403],
        ['{broken', {}, 400],
        [JSON.stringify({ data: 'x'.repeat(850001) }), {}, 413]
    ]) {
        const response = await fetch(base + '/api/account-session', { method: 'POST',
            headers: { 'Content-Type': 'application/json', ...headers }, body });
        assert.equal(response.status, status);
        await response.json();
    }
    // fetch rewrites Host; use HTTP directly to exercise a DNS rebinding request.
    const status = await new Promise((resolve, reject) => {
        http.get(base + '/', { headers: { Host: 'example.com' } }, response => {
            response.resume();
            response.on('end', () => resolve(response.statusCode));
        }).on('error', reject);
    });
    assert.equal(status, 403);
    assert.equal(calls, 0);
});
