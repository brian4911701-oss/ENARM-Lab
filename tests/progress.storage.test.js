'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const sync = require('../progress-sync');
const { memory, session, user, remote } = require('../scripts/test_progress_persistence');
const quotaError = () => Object.assign(new Error('Local storage is full'), { name: 'QuotaExceededError' });

test('a full optional cache cannot block displaying confirmed cloud progress', async () => {
    const storage = memory(), set = storage.setItem;
    storage.setItem = (key, value) => { if (key.startsWith('enarm_progress_v2:')) throw quotaError(); set(key, value); };
    const app = session(storage, { remote: { ...remote, syncVersion: 3, syncRevision: 18 } });
    Object.assign(app.State.globalStats, { respondidas: 0, aciertos: 0, sesiones: 0 });
    app.State.progressRestoreReady = false;
    let rendered = false;
    app.context.updateDashboardStats = () => { rendered = true; };
    await app.api.restoreAuthenticatedProgress(user);
    assert.equal(app.State.globalStats.respondidas, 20);
    assert.equal(app.State.globalStats.sesiones, 2);
    assert.equal(app.State.progressRestoreReady, true);
    assert.equal(rendered, true);
    assert.equal(app.writes.length, 0);
});

test('failure to cache the history cannot leave the dashboard at zero', async () => {
    const storage = memory(), set = storage.setItem;
    storage.setItem = (key, value) => { if (key === 'enarm_history') throw quotaError(); set(key, value); };
    const app = session(storage, { remote: { ...remote, syncVersion: 3, syncRevision: 18 } });
    Object.assign(app.State.globalStats, { respondidas: 0, aciertos: 0, sesiones: 0 });
    app.State.progressRestoreReady = false;
    let rendered = false;
    app.context.updateDashboardStats = () => { rendered = true; };
    await app.api.restoreAuthenticatedProgress(user);
    assert.equal(app.State.progressRestoreReady, true);
    assert.equal(rendered, true);
    assert.equal(app.State.globalStats.respondidas, 20);
    assert.equal(app.writes.length, 0);
});

test('optional cache failure preserves durable pending operations; journal failure still rejects unsaved work', () => {
    const storage = memory(), set = storage.setItem, outbox = sync.create(storage, { actor: 'storage-test-browser' });
    outbox.begin(user.uid, remote);
    storage.setItem = (key, value) => { if (key.startsWith('enarm_progress_v2:')) throw quotaError(); set(key, value); };
    outbox.stage(user.uid, { ...remote, theme: 'forest' });
    assert.equal(outbox.read(user.uid).pending, true);
    assert.equal(outbox.batch(user.uid).length, 1);
    assert.equal(outbox.read(user.uid).data.theme, 'forest');
    storage.setItem = () => { throw quotaError(); };
    assert.throws(() => outbox.stage(user.uid, { ...remote, theme: 'sunset' }), { name: 'QuotaExceededError' });
    assert.equal(outbox.batch(user.uid).length, 1);
    assert.equal(outbox.read(user.uid).data.theme, 'forest');
});

test('cache failures cannot reuse an acknowledged operation sequence', () => {
    const storage = memory(), set = storage.setItem, outbox = sync.create(storage, { actor: 'sequence-browser' });
    outbox.accept(user.uid, remote);
    storage.setItem = (key, value) => { if (key.startsWith('enarm_progress_v2:')) throw quotaError(); set(key, value); };
    outbox.stage(user.uid, { ...remote, theme: 'forest' });
    const batch = outbox.batch(user.uid);
    outbox.accept(user.uid, { ...remote, theme: 'forest' }, batch);
    outbox.stage(user.uid, { ...remote, theme: 'sunset' });
    assert.equal(outbox.batch(user.uid)[0].sequence, batch[0].sequence + 1);
});

test('a failed replacement cache does not delete the last saved backup', () => {
    const storage = memory(), first = sync.create(storage, { actor: 'previous-browser' });
    first.accept(user.uid, remote);
    const before = storage.getItem('enarm_progress_v2:' + user.uid + ':previous-browser');
    storage.setItem = () => { throw quotaError(); };
    const next = sync.create(storage, { actor: 'reopened-browser' });
    next.restore(user.uid, { ...remote, theme: 'forest' }, true);
    assert.equal(next.read(user.uid).data.theme, 'forest');
    assert.equal(storage.getItem('enarm_progress_v2:' + user.uid + ':previous-browser'), before);
});
