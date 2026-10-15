// Calendar-day arithmetic: local date keys, UTC ordinals (independent of DST).
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.ENARMStreak = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
    const DAY = 86400000;
    const dateKey = (date = new Date()) => {
        if (!(date instanceof Date) || !Number.isFinite(date.getTime())) return null;
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    const normalizeDay = value => {
        const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(value || ''));
        if (!match) return null;
        const [, year, month, day] = match.map(Number);
        const parsed = new Date(Date.UTC(year, month - 1, day));
        if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return null;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };
    const ordinal = key => Date.parse(`${key}T00:00:00Z`) / DAY;
    const count = value => Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : 0;
    const effective = (data, now = new Date()) => {
        const last = normalizeDay(data?.lastStudyDate);
        const today = dateKey(now);
        if (!last || !today || last > today) return 0;
        const missed = Math.max(0, ordinal(today) - ordinal(last) - 1);
        // Preserve Rachas Plus: each missed calendar day deducts two days.
        return Math.max(0, count(data.currentStreak) - missed * 2);
    };
    const record = (data, now = new Date()) => {
        const today = dateKey(now);
        const last = normalizeDay(data?.lastStudyDate);
        if (!today) return { ...data };
        if (last === today) return { ...data, lastStudyDate: today, currentStreak: count(data.currentStreak) };
        // Ignore a future legacy date when recording genuine activity today.
        return { ...data, lastStudyDate: today, currentStreak: effective(data, now) + 1 };
    };
    const reconcile = (data, activityDays = [], now = new Date()) => {
        const today = dateKey(now);
        let last = normalizeDay(data?.lastStudyDate);
        let current = last && last <= today ? count(data?.currentStreak) : 0;
        if (!current) last = null;
        const days = [...new Set(activityDays.map(normalizeDay).filter(day => day && day <= today))].sort();
        for (const day of days) {
            if (last && day <= last) continue;
            const missed = last ? Math.max(0, ordinal(day) - ordinal(last) - 1) : 0;
            current = Math.max(0, current - missed * 2) + 1;
            last = day;
        }
        return { ...data, lastStudyDate: last, currentStreak: current };
    };
    return { dateKey, normalizeDay, effective, record, reconcile };
});
