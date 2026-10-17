'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { create } = require('../study-session');
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
const drain = async () => { for (let i = 0; i < 25; i++) await Promise.resolve(); };
const memory = () => {
    const values = new Map();
    return { get length() { return values.size; }, key: i => [...values.keys()][i], getItem: key => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) };
};
function fixture(options = {}) {
    const storage = memory(), calls = [], rendered = [];
    let listener, revision = 0;
    const questions = [{ question: 'Prueba', case: 'Caso', options: ['A', 'B'], answerIndex: 1 }];
    let exam = { id: 'fixture-exam-00001', status: 'active', revision: 1, questionSet: questions,
        answers: [{ selected: null, flagged: false }], currentIndex: 0, eventHeads: {} };
    const client = create({ storage, sessionId: () => 'fixture-session', listenExam: (_uid, next) => { listener = next; return () => {}; },
        readExam: async () => null, onExam: (view, owns) => { rendered.push(view); return options.onExam?.(view, owns); }, onAttempt: options.onAttempt,
        send: async body => {
            calls.push(body);
            if (body.action === 'register') return { registered: true };
            if (body.action === 'start') return { exam };
            if (options.send) return options.send(body, exam);
            const finishing = body.action === 'finish';
            exam = { ...exam, revision: ++revision + 1, status: finishing ? 'finished' : 'active' };
            return { exam, ...(finishing ? { attempt: { id: exam.id, questionSet: questions } } : {}) };
        } });
    return { client, storage, calls, rendered, questions, get exam() { return exam; }, receive: value => listener(value) };
}

test('exam creation waits for the confirmed exam to finish rendering', async () => {
    const render = deferred(), f = fixture({ onExam: () => render.promise });
    try {
        await f.client.register('fixture-user');
        let ready = false;
        const start = f.client.start({ questionSet: f.questions }).then(() => { ready = true; });
        await drain(); assert.equal(ready, false);
        render.resolve(); await start; assert.equal(ready, true);
        assert.equal(f.calls.filter(call => call.action === 'register').length, 1, 'Cached registration avoids another request');
    } finally { f.client.stop(); }
});

test('realtime and HTTP copies of one revision render once and reuse immutable questions', async () => {
    const f = fixture();
    try {
        await f.client.boot('fixture-user'); await f.client.start({ questionSet: f.questions });
        assert.equal(f.rendered[0].questionSet, f.questions, 'Large question payloads are shared, not serialized on every acknowledgement');
        f.rendered[0].answers[0].selected = 0;
        assert.equal(f.exam.answers[0].selected, null, 'Editable answer objects stay isolated from the confirmed state');
        await f.receive({ ...f.exam });
        assert.equal(f.rendered.length, 1, 'Duplicate revision does not rebuild the question DOM');
        await f.receive({ ...f.exam, revision: 2, currentIndex: 0 });
        assert.equal(f.rendered.length, 2);
    } finally { f.client.stop(); }
});

test('finishing waits for the analysis callback, including an asynchronous render', async () => {
    const analysis = deferred(), f = fixture({ onAttempt: () => analysis.promise });
    try {
        await f.client.register('fixture-user'); await f.client.start({ questionSet: f.questions });
        let ready = false;
        const finish = f.client.flush(true).then(() => { ready = true; });
        await drain(); assert.equal(ready, false);
        analysis.resolve(); await finish; assert.equal(ready, true);
        assert.equal(f.client.finishing, false);
    } finally { f.client.stop(); }
});

test('an explicit start can reopen the existing confirmed exam without requiring a new revision', async () => {
    const f = fixture();
    try {
        await f.client.register('fixture-user'); await f.client.start({ questionSet: f.questions });
        f.rendered.length = 0;
        await f.client.start({ questionSet: f.questions });
        assert.equal(f.rendered.length, 1, 'Returning from another screen restores the existing exam even if it has not changed');
        assert.equal(f.rendered[0].id, f.exam.id);
    } finally { f.client.stop(); }
});

test('finish intent is durable while the final answer request is in flight and is sent once', async () => {
    const answerAck = deferred();
    const f = fixture({ send: async (body, exam) => {
        if (body.action === 'events') { await answerAck.promise; return { exam: { ...exam, revision: 2 } }; }
        return { exam: { ...exam, revision: 3, status: 'finished' }, attempt: { id: exam.id } };
    } });
    try {
        await f.client.register('fixture-user'); await f.client.start({ questionSet: f.questions });
        f.client.queue({ kind: 'answer', index: 0, selected: 1 });
        const answers = f.client.flush(); await drain();
        const finish = f.client.flush(true); await drain();
        assert.equal(f.client.finishing, true, 'Closing is recorded before waiting for the previous network response');
        assert.equal(f.client.queue({ kind: 'answer', index: 0, selected: 0 }), false, 'Answers cannot change after the finish intent');
        answerAck.resolve(); await Promise.all([answers, finish]);
        assert.equal(f.calls.filter(call => call.action === 'finish').length, 1);
        assert.equal(f.storage.length, 0);
    } finally { f.client.stop(); }
});

test('failure to persist the finish intent rejects explicitly without dropping pending answers', async () => {
    const f = fixture();
    try {
        await f.client.register('fixture-user'); await f.client.start({ questionSet: f.questions });
        f.client.queue({ kind: 'answer', index: 0, selected: 1 });
        f.storage.setItem = () => { throw new Error('QuotaExceeded'); };
        await assert.rejects(f.client.flush(true), { code: 'local-storage-full' });
        assert.equal(f.storage.length, 1);
        assert.equal(f.calls.some(call => call.action === 'finish'), false);
    } finally { f.client.stop(); }
});

test('a lost finish acknowledgement retains the same event for an idempotent retry', async () => {
    let loseAck = true, firstEvent;
    const f = fixture({ send: async (body, exam) => {
        if (loseAck) { firstEvent = body.events[0]; throw Object.assign(new Error('offline'), { code: 'offline' }); }
        assert.deepEqual(body.events[0], firstEvent);
        return { exam: { ...exam, revision: 2, status: 'finished' }, attempt: { id: exam.id } };
    } });
    try {
        await f.client.register('fixture-user'); await f.client.start({ questionSet: f.questions });
        await assert.rejects(f.client.flush(true), { code: 'offline' });
        assert.equal(f.client.finishing, true);
        loseAck = false; await f.client.flush(true);
        assert.equal(f.client.finishing, false); assert.equal(f.storage.length, 0);
    } finally { f.client.stop(); }
});
