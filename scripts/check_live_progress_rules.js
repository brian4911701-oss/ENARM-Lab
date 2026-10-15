// Read-only inspection: no rules releases or user documents are changed.
const { initializeAdmin, requireServiceAccountHint } = require('./security_admin_sdk');
(async () => {
    requireServiceAccountHint();
    const { admin, projectId } = initializeAdmin();
    const { access_token: token } = await admin.credential.applicationDefault().getAccessToken();
    const read = async path => {
        const response = await fetch('https://firebaserules.googleapis.com/v1/' + path, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error(`Rules read failed: ${response.status}`);
        return response.json();
    };
    const release = await read(`projects/${projectId}/releases/cloud.firestore`);
    const ruleset = await read(release.rulesetName);
    const source = ruleset.source.files.map(file => file.content).join('\n');
    const start = source.indexOf('match /user_progress/{uid}');
    const end = source.indexOf('match /user_directory/', start);
    const progress = source.slice(start, end < 0 ? undefined : end);
    const expected = ['theme', 'fontPreset', 'appearanceStr', 'dailyPlanStr', 'reviewQueueStr', 'scaleStudyStr', 'topicMasteryStr', 'caseNotebookStr', 'studyCalendarStr', 'lastPostmortemStr', 'pomodoroSettingsStr', 'pomodoroLogStr', 'pomodoroSpecialtiesStr', 'pomodoroFocusLabel', 'globalStatsStr', 'historyStr', 'reportsStr'];
    console.log(JSON.stringify({
        ruleset: release.rulesetName, updatedAt: release.updateTime,
        hasPrivateProgressRules: start >= 0,
        absentClientFields: expected.filter(field => !progress.includes(`"${field}"`)),
        strictFieldAllowlist: progress.includes('keys().hasOnly('),
        hasMultiDeviceProtocol: progress.includes('sync_clients'),
        releaseChanged: false
    }, null, 2));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
