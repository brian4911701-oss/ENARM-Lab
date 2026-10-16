'use strict';
const configured = new WeakSet();
const QUOTA_CODE = 'firestore-quota-exceeded';
function isQuotaError(error) {
    return [8, 429, '8', '429', 'RESOURCE_EXHAUSTED', 'resource-exhausted', 'firestore/resource-exhausted', QUOTA_CODE].includes(error?.code);
}
function quotaError(error) {
    if (!isQuotaError(error) || error.code === QUOTA_CODE) return error;
    return Object.assign(new Error(QUOTA_CODE), { code: QUOTA_CODE, status: 503 });
}
function getFirestore(admin) {
    const db = admin.firestore();
    if (!configured.has(db)) {
        // The default SDK retries RESOURCE_EXHAUSTED for minutes. A daily quota
        // cannot recover within a login request. Keep retries for transient outages.
        db.settings({ clientConfig: { interfaces: { 'google.firestore.v1.Firestore': {
            retry_codes: {
                deadline_exceeded_resource_exhausted_internal_unavailable: ['DEADLINE_EXCEEDED', 'INTERNAL', 'UNAVAILABLE'],
                resource_exhausted_unavailable: ['UNAVAILABLE'],
                resource_exhausted_aborted_unavailable: ['ABORTED', 'UNAVAILABLE']
            },
            retry_params: { default: {
                initial_retry_delay_millis: 100, retry_delay_multiplier: 1.3, max_retry_delay_millis: 1000,
                initial_rpc_timeout_millis: 8000, rpc_timeout_multiplier: 1,
                max_rpc_timeout_millis: 8000, total_timeout_millis: 10000
            } }
        } } } });
        configured.add(db);
    }
    return db;
}
async function runTransaction(db, update) {
    // Commit errors happen outside update(), so select retries at the outer boundary.
    // Each retry is a fresh atomic transaction, including the authority check.
    for (let attempt = 0; ; attempt++) {
        try { return await db.runTransaction(update, { maxAttempts: 1 }); }
        catch (error) {
            if (isQuotaError(error)) throw quotaError(error);
            const transient = [1, 2, 4, 10, 13, 14, 16].includes(error.code)
                || (error.code === 3 && /transaction has expired/.test(error.message || ''));
            if (!transient || attempt >= 4) throw error;
            await new Promise(resolve => setTimeout(resolve, 25 * (2 ** attempt) + Math.random() * 25));
        }
    }
}
function sendQuotaError(response, error) {
    if (!isQuotaError(error)) return false;
    response.setHeader('Retry-After', '300');
    response.status(503).json({ code: QUOTA_CODE, retryAfterSeconds: 300 });
    return true;
}
module.exports = { getFirestore, runTransaction, isQuotaError, sendQuotaError, QUOTA_CODE };
