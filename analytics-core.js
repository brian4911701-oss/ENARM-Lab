(function analyticsCoreFactory(root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root) root.ENARMAnalytics = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function buildAnalyticsCore() {
    "use strict";

    const DAY_MS = 24 * 60 * 60 * 1000;
    const SPECIALTY_KEYS = ["mi", "ped", "gyo", "cir"];
    const FEATURE_KEYS = ["exams", "studyPlus", "pomodoro", "flashcards", "scales", "community", "referrals"];

    const safeNumber = (value) => {
        const number = Number(value);
        return Number.isFinite(number) && number >= 0 ? number : 0;
    };

    const toDate = (value) => {
        if (!value) return null;
        if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
        if (typeof value.toDate === "function") return toDate(value.toDate());
        if (typeof value.seconds === "number") return new Date(value.seconds * 1000);
        if (typeof value._seconds === "number") return new Date(value._seconds * 1000);
        if (typeof value === "number") {
            const millis = value < 100000000000 ? value * 1000 : value;
            const date = new Date(millis);
            return Number.isNaN(date.getTime()) ? null : date;
        }
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    };

    const dateKey = (value = new Date()) => {
        const date = toDate(value) || new Date();
        try {
            const parts = new Intl.DateTimeFormat("en-CA", {
                timeZone: "America/Mexico_City",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }).formatToParts(date);
            const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
            return `${values.year}-${values.month}-${values.day}`;
        } catch (_err) {
            return date.toISOString().slice(0, 10);
        }
    };

    const addDays = (day, amount) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(String(day || ""))) return "";
        const date = new Date(`${day}T12:00:00Z`);
        date.setUTCDate(date.getUTCDate() + Number(amount || 0));
        return date.toISOString().slice(0, 10);
    };

    const daysBetween = (startDay, endDay) => {
        const start = new Date(`${startDay}T12:00:00Z`).getTime();
        const end = new Date(`${endDay}T12:00:00Z`).getTime();
        return Number.isFinite(start) && Number.isFinite(end) ? Math.round((end - start) / DAY_MS) : 0;
    };

    const normalizeDayList = (days, fallbackDay = "") => {
        const valid = new Set((Array.isArray(days) ? days : []).filter(day => /^\d{4}-\d{2}-\d{2}$/.test(String(day))));
        if (fallbackDay) valid.add(fallbackDay);
        return Array.from(valid).sort().slice(-400);
    };

    const mergeDaily = (...dailyLists) => {
        const byDay = new Map();
        dailyLists.flat().forEach(row => {
            const day = String(row?.day || "");
            if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return;
            const current = byDay.get(day) || { day, sessions: 0, answered: 0, correct: 0, studySeconds: 0, pomodoros: 0, simulations: 0, jsErrors: 0 };
            ["sessions", "answered", "correct", "studySeconds", "pomodoros", "simulations", "jsErrors"].forEach(key => {
                current[key] = Math.max(safeNumber(current[key]), safeNumber(row?.[key]));
            });
            byDay.set(day, current);
        });
        return Array.from(byDay.values()).sort((a, b) => a.day.localeCompare(b.day)).slice(-400);
    };

    const deriveDailyFromHistory = (history = [], pomodoroLog = []) => {
        const daily = new Map();
        const ensure = (day) => {
            if (!daily.has(day)) daily.set(day, { day, sessions: 0, answered: 0, correct: 0, studySeconds: 0, pomodoros: 0, simulations: 0, jsErrors: 0 });
            return daily.get(day);
        };
        (Array.isArray(history) ? history : []).forEach(session => {
            const timestamp = session?.timestamp || session?.createdAt || session?.date;
            const date = toDate(timestamp);
            if (!date) return;
            const row = ensure(dateKey(date));
            row.sessions += 1;
            row.answered += safeNumber(session?.preguntas ?? session?.answered);
            row.correct += safeNumber(session?.correct ?? session?.aciertos);
            row.studySeconds += safeNumber(session?.elapsedSec ?? session?.durationSec);
            const kind = String(session?.sessionKind || session?.mode || session?.tipo || "").toLowerCase();
            if (!kind.includes("estudio")) row.simulations += 1;
        });
        (Array.isArray(pomodoroLog) ? pomodoroLog : []).forEach(entry => {
            if (entry?.mode && String(entry.mode) !== "focus") return;
            const date = toDate(entry?.completedAt || entry?.timestamp || entry?.createdAt || entry?.date);
            if (!date) return;
            const row = ensure(dateKey(date));
            row.pomodoros += safeNumber(entry?.count || 1);
        });
        return Array.from(daily.values()).sort((a, b) => a.day.localeCompare(b.day)).slice(-400);
    };

    const laterDay = (left, right) => String(left || "") > String(right || "") ? String(left || "") : String(right || "");

    const buildMetricDocument = ({
        uid,
        globalStats = {},
        history = [],
        pomodoroLog = [],
        existing = {},
        today = dateKey(),
        featureUpdates = {},
        healthUpdates = {},
        historyApproximate = false
    } = {}) => {
        const historicalDaily = deriveDailyFromHistory(history, pomodoroLog);
        const daily = mergeDaily(existing.daily || [], historicalDaily);
        const activityDays = normalizeDayList([
            ...(existing.activityDays || []),
            ...daily.map(row => row.day)
        ], today);
        const oldCumulative = existing.cumulative || {};
        const sessionsFromDaily = daily.reduce((sum, row) => sum + safeNumber(row.sessions), 0);
        const answeredFromDaily = daily.reduce((sum, row) => sum + safeNumber(row.answered), 0);
        const correctFromDaily = daily.reduce((sum, row) => sum + safeNumber(row.correct), 0);
        const secondsFromDaily = daily.reduce((sum, row) => sum + safeNumber(row.studySeconds), 0);
        const pomodorosFromDaily = daily.reduce((sum, row) => sum + safeNumber(row.pomodoros), 0);
        const simulationsFromDaily = daily.reduce((sum, row) => sum + safeNumber(row.simulations), 0);
        const cumulative = {
            sessions: Math.max(safeNumber(oldCumulative.sessions), safeNumber(globalStats.sesiones), sessionsFromDaily),
            answered: Math.max(safeNumber(oldCumulative.answered), safeNumber(globalStats.respondidas), answeredFromDaily),
            correct: Math.max(safeNumber(oldCumulative.correct), safeNumber(globalStats.aciertos), correctFromDaily),
            studySeconds: Math.max(safeNumber(oldCumulative.studySeconds), secondsFromDaily),
            pomodoros: Math.max(safeNumber(oldCumulative.pomodoros), safeNumber(globalStats.pomodoros), pomodorosFromDaily),
            simulations: Math.max(safeNumber(oldCumulative.simulations), simulationsFromDaily)
        };
        const bySpecialty = {};
        SPECIALTY_KEYS.forEach(key => {
            const oldRow = existing.bySpecialty?.[key] || {};
            const statsRow = globalStats.bySpecialty?.[key] || {};
            bySpecialty[key] = {
                answered: Math.max(safeNumber(oldRow.answered), safeNumber(statsRow.total ?? statsRow.answered)),
                correct: Math.max(safeNumber(oldRow.correct), safeNumber(statsRow.correct ?? statsRow.aciertos))
            };
        });
        const features = {};
        FEATURE_KEYS.forEach(key => {
            const derived = key === "exams" && historicalDaily.length ? historicalDaily[historicalDaily.length - 1].day : "";
            const day = laterDay(laterDay(existing.features?.[key], featureUpdates[key]), derived);
            if (day) features[key] = day;
        });
        const existingHealth = existing.health || {};
        const health = {
            jsErrors: Math.max(0, safeNumber(existingHealth.jsErrors) + safeNumber(healthUpdates.jsErrors)),
            pageLoads: Math.max(0, safeNumber(existingHealth.pageLoads) + safeNumber(healthUpdates.pageLoads)),
            lastPageLoadMs: Math.round(safeNumber(healthUpdates.lastPageLoadMs || existingHealth.lastPageLoadMs)),
            lastJsErrorDay: laterDay(existingHealth.lastJsErrorDay, healthUpdates.lastJsErrorDay)
        };
        if (safeNumber(healthUpdates.jsErrors) > 0) {
            const todayRow = daily.find(row => row.day === today);
            if (todayRow) todayRow.jsErrors = safeNumber(todayRow.jsErrors) + safeNumber(healthUpdates.jsErrors);
        }
        return {
            uid: String(uid || existing.uid || ""),
            schemaVersion: 1,
            lastActivityDay: today,
            activityDays,
            cumulative,
            bySpecialty,
            features,
            health,
            daily,
            historyApproximate: Boolean(historyApproximate || existing.historyApproximate)
        };
    };

    const inRange = (day, startDay, endDay) => day && day >= startDay && day <= endDay;
    const percentage = (numerator, denominator) => denominator > 0 ? (numerator / denominator) * 100 : null;

    const computeRetention = (users, today, offset) => {
        const eligible = users.filter(user => user.registeredDay && addDays(user.registeredDay, offset) <= today);
        const retained = eligible.filter(user => user.days.has(addDays(user.registeredDay, offset))).length;
        return { offset, eligible: eligible.length, retained, rate: percentage(retained, eligible.length) };
    };

    const computeDashboard = (input = {}, rangeDays = 30, nowValue = new Date()) => {
        const now = toDate(nowValue) || new Date();
        const today = dateKey(now);
        const safeRangeDays = [7, 30, 90].includes(Number(rangeDays)) ? Number(rangeDays) : 30;
        const startDay = addDays(today, -(safeRangeDays - 1));
        const previousEndDay = addDays(startDay, -1);
        const previousStartDay = addDays(previousEndDay, -(safeRangeDays - 1));
        const metrics = Array.isArray(input.metrics) ? input.metrics : [];
        const directory = Array.isArray(input.directory) ? input.directory : [];
        const directoryByUid = new Map(directory.map(row => [String(row.uid || row.id || ""), row]));
        const metricByUid = new Map(metrics.map(row => [String(row.uid || row.id || ""), row]));
        const allUids = new Set([...directoryByUid.keys(), ...metricByUid.keys()].filter(Boolean));
        const users = Array.from(allUids).map(uid => {
            const metric = metricByUid.get(uid) || {};
            const profile = directoryByUid.get(uid) || {};
            const registered = toDate(metric.registeredAt || profile.authCreatedAt || profile.createdAt);
            return {
                uid,
                metric,
                profile,
                registeredDay: registered ? dateKey(registered) : "",
                days: new Set(normalizeDayList(metric.activityDays || []))
            };
        });
        const registrationsIn = (from, to) => users.filter(user => inRange(user.registeredDay, from, to)).length;
        const registrationsCurrent = registrationsIn(startDay, today);
        const registrationsPrevious = registrationsIn(previousStartDay, previousEndDay);
        const activeIn = (from, to) => users.filter(user => Array.from(user.days).some(day => inRange(day, from, to)));
        const activeRangeUsers = activeIn(startDay, today);
        const dau = activeIn(today, today).length;
        const wau = activeIn(addDays(today, -6), today).length;
        const mau = activeIn(addDays(today, -29), today).length;
        const online = directory.filter(row => {
            const seen = toDate(row.lastSeenAt);
            return seen && now.getTime() - seen.getTime() <= 7 * 60 * 1000;
        }).length;
        const newActive = activeRangeUsers.filter(user => inRange(user.registeredDay, startDay, today)).length;
        const returning = Math.max(0, activeRangeUsers.length - newActive);
        const timeline = [];
        let cumulative = users.filter(user => user.registeredDay && user.registeredDay < startDay).length;
        for (let day = startDay; day <= today; day = addDays(day, 1)) {
            const registrations = users.filter(user => user.registeredDay === day).length;
            cumulative += registrations;
            timeline.push({ day, registrations, cumulative, active: activeIn(day, day).length });
        }

        const study = { sessions: 0, answered: 0, correct: 0, studySeconds: 0, pomodoros: 0, simulations: 0 };
        let jsErrors = 0;
        metrics.forEach(metric => (metric.daily || []).forEach(row => {
            if (!inRange(String(row?.day || ""), startDay, today)) return;
            Object.keys(study).forEach(key => { study[key] += safeNumber(row?.[key]); });
            jsErrors += safeNumber(row?.jsErrors);
        }));
        study.accuracy = percentage(study.correct, study.answered);
        study.questionsPerActive = activeRangeUsers.length ? study.answered / activeRangeUsers.length : 0;
        study.minutes = Math.round(study.studySeconds / 60);

        const specialties = {};
        SPECIALTY_KEYS.forEach(key => {
            const row = { answered: 0, correct: 0 };
            metrics.forEach(metric => {
                row.answered += safeNumber(metric.bySpecialty?.[key]?.answered);
                row.correct += safeNumber(metric.bySpecialty?.[key]?.correct);
            });
            row.accuracy = percentage(row.correct, row.answered);
            specialties[key] = row;
        });
        const features = {};
        FEATURE_KEYS.forEach(key => {
            features[key] = metrics.filter(metric => inRange(String(metric.features?.[key] || ""), startDay, today)).length;
        });

        const entitlements = Array.isArray(input.entitlements) ? input.entitlements : [];
        const activeEntitlements = entitlements.filter(row => {
            const expiry = toDate(row.expiresAt);
            return String(row.status || "") === "active" && (!expiry || expiry > now);
        });
        const activations = entitlements.filter(row => {
            const activated = toDate(row.activatedAt || row.updatedAt);
            return activated && inRange(dateKey(activated), startDay, today) && String(row.status || "") === "active";
        });
        const bySource = {};
        const byPlan = {};
        activeEntitlements.forEach(row => {
            const source = String(row.source || "unknown");
            const plan = String(row.planId || "unknown");
            bySource[source] = (bySource[source] || 0) + 1;
            byPlan[plan] = (byPlan[plan] || 0) + 1;
        });

        const allPayments = Array.isArray(input.payments) ? input.payments : [];
        const payments = allPayments.filter(row => {
            const date = toDate(row.reviewedAt || row.notifiedAt || row.updatedAt || row.createdAt);
            return date && inRange(dateKey(date), startDay, today);
        });
        const paymentStatus = { approved: 0, pending: 0, rejected: 0 };
        payments.forEach(row => {
            const status = String(row.status || "pending");
            if (Object.prototype.hasOwnProperty.call(paymentStatus, status)) paymentStatus[status] += 1;
        });
        const approvedPayments = payments.filter(row => String(row.status || "") === "approved");
        const revenue = approvedPayments.reduce((sum, row) => sum + safeNumber(row.amount), 0);
        const payers = new Set(approvedPayments.map(row => String(row.uid || "")).filter(Boolean));

        const allReferrals = Array.isArray(input.referrals) ? input.referrals : [];
        const referrals = allReferrals.filter(row => {
            const date = toDate(row.createdAt || row.redeemedAt || row.updatedAt);
            return !date || inRange(dateKey(date), startDay, today);
        });
        const referralPremiumUids = new Set(activeEntitlements.filter(row => String(row.source || "").includes("referral")).map(row => String(row.uid || row.id || "")));

        const ratings = (Array.isArray(input.ratings) ? input.ratings : [])
            .filter(row => row && row.experienceQualified === true);
        const stars = ratings.map(row => safeNumber(row.stars)).filter(value => value > 0 && value <= 5);
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        stars.forEach(value => { distribution[Math.round(value)] += 1; });
        const feedback = (Array.isArray(input.feedback) ? input.feedback : []).filter(row => {
            const date = toDate(row.createdAt);
            return date && inRange(dateKey(date), startDay, today);
        });
        const reports = (Array.isArray(input.reports) ? input.reports : []).filter(row => {
            const date = toDate(row.timestamp || row.createdAt);
            return date && inRange(dateKey(date), startDay, today);
        });
        const pageLoadSamples = metrics.map(metric => safeNumber(metric.health?.lastPageLoadMs)).filter(Boolean);

        return {
            generatedAt: now,
            rangeDays: safeRangeDays,
            startDay,
            today,
            coverage: { metrics: metrics.length, directory: directory.length, totalUsers: users.length },
            growth: {
                total: users.length,
                today: registrationsIn(today, today),
                last7: registrationsIn(addDays(today, -6), today),
                last30: registrationsIn(addDays(today, -29), today),
                current: registrationsCurrent,
                previous: registrationsPrevious,
                rate: registrationsPrevious ? ((registrationsCurrent - registrationsPrevious) / registrationsPrevious) * 100 : null,
                timeline
            },
            activity: { online, dau, wau, mau, stickiness: percentage(dau, mau), activeRange: activeRangeUsers.length, newActive, returning },
            retention: {
                d1: computeRetention(users, today, 1),
                d7: computeRetention(users, today, 7),
                d30: computeRetention(users, today, 30)
            },
            study,
            content: { specialties, features },
            premium: {
                active: activeEntitlements.length,
                free: Math.max(0, users.length - activeEntitlements.length),
                conversion: percentage(activeEntitlements.length, users.length),
                newActivations: activations.length,
                bySource,
                byPlan
            },
            payments: {
                notices: payments.length,
                ...paymentStatus,
                revenue,
                conversion: percentage(paymentStatus.approved, payments.length),
                payingUsers: payers.size,
                averagePerPayer: payers.size ? revenue / payers.size : 0
            },
            referrals: {
                codesUsed: new Set(referrals.map(row => String(row.referralCode || "")).filter(Boolean)).size,
                acquired: referrals.length,
                rewards: referrals.reduce((sum, row) => sum + safeNumber(row.coins), 0),
                premiumConversions: referralPremiumUids.size,
                conversion: percentage(referralPremiumUids.size, referrals.length)
            },
            satisfaction: {
                average: stars.length ? stars.reduce((sum, value) => sum + value, 0) / stars.length : null,
                count: stars.length,
                distribution,
                feedback: feedback.length,
                reports: reports.length
            },
            technical: {
                jsErrors,
                usersWithErrors: metrics.filter(metric => inRange(String(metric.health?.lastJsErrorDay || ""), startDay, today)).length,
                pageLoads: metrics.reduce((sum, metric) => sum + safeNumber(metric.health?.pageLoads), 0),
                averageLastPageLoadMs: pageLoadSamples.length ? pageLoadSamples.reduce((sum, value) => sum + value, 0) / pageLoadSamples.length : null
            }
        };
    };

    return {
        DAY_MS,
        SPECIALTY_KEYS,
        FEATURE_KEYS,
        safeNumber,
        toDate,
        dateKey,
        addDays,
        daysBetween,
        normalizeDayList,
        mergeDaily,
        deriveDailyFromHistory,
        buildMetricDocument,
        computeDashboard
    };
});
