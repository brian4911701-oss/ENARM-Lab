// app.js  Core logic for ENARMlab
(() => {
    // ---------------------------------------------------------------------------
    // State Management
    // ---------------------------------------------------------------------------
    const State = {
        view: "view-dashboard",
        mode: "simulacro", // "estudio" | "simulacro"
        difficulty: "cualquiera",
        selectedSpecialties: [], // Tracks checked specs in setup
        setupQty: 10,           // Tracks slider value in setup
        questionSet: [],
        currentIndex: 0,
        answers: [],
        timer: null,
        durationSec: 4 * 60 * 60,
        startTime: null,
        pausedElapsedTime: 0,
        currentExamType: "Simulacro",
        examActive: false,

        globalStats: {
            respondidas: 0,
            aciertos: 0,
            sesiones: 0,
            pomodoros: 0,
            bySpecialty: {
                mi: { total: 0, correct: 0, name: "Medicina Interna" },
                ped: { total: 0, correct: 0, name: "Pediatría" },
                gyo: { total: 0, correct: 0, name: "Ginecología y Obstetricia" },
                cir: { total: 0, correct: 0, name: "Cirugía General" }
            }
        },

        userName: "Aspirante",
        userSpecialty: "",
        userUniversity: "",
        isScorePublic: true,
        history: [],
        selectedTopics: [],
        reportedQuestions: [],
        reportedQuestionsLocal: [],
        myFriends: [],
        communityRankingMode: "general",
        activeChallenges: [],
        quarantineKeys: new Set(),
        deletedCaseKeys: new Set(),
        reclassSelectedKey: null,
        reclassCases: [],
        reclassMap: {},
        reclassTemaByKey: {},
        reclassOriginalTemaByKey: {},
        reclassSpecialtyByKey: {},
        reclassOriginalSpecialtyByKey: {},
        reclassInitialized: false,
        selectedPresetId: null,
        currentExamIsReal: false,
        currentUid: "",
        entitlement: null,
        entitlementUnsub: null,
        adminPreviewMode: "premium",
        caseOverrideMap: null,
        caseOverridesUnsub: null,
        feedbackInbox: [],
        feedbackAdminUnsub: null,
        dailyPlan: null,
        reviewQueue: [],
        topicMastery: {},
        caseNotebook: [],
        studyCalendar: {},
        lastPostmortem: null,
        notebookSelectedId: null,
        fontPreset: "clinical",
        pomodoroSettings: null,
        pomodoroState: null,
        pomodoroLog: [],
        pomodoroSpecialties: [],
        pomodoroFocusLabel: ""
    };

    const $ = (id) => document.getElementById(id);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));

    const ADMIN_UIDS = ["sZcIUjjhD0fze7FtirwsjsIDzLB2"];
    const DEMO_MAX_QTY = 10;
    const FIXED_CODE_EXPIRY = new Date(2026, 9, 1, 23, 59, 59);
    const THREE_DAY_CODE_DURATION_MS = 3 * 24 * 60 * 60 * 1000;
    const MONTH_CODE_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
    const ADMIN_PREVIEW_STORAGE_KEY = "enarm_admin_preview_mode";
    const DEMO_ALLOWED_THEMES = new Set(["ocean", "light"]);
    const FONT_PRESET_STORAGE_KEY = "enarm_font_preset";
    const NOTIFICATION_ICON = "/notification-icon.png";
    const NOTIFICATION_BADGE = "/notification-badge.png";
    const PUSH_TOKEN_COLLECTION = "user_push_tokens";
    const FEEDBACK_COLLECTION = "feedback_submissions";
    const ADMIN_INBOX_UID = ADMIN_UIDS[0];
    const COMMUNITY_NOTIF_LAST_SEEN_KEY = "enarm_community_notif_last_seen";
    const COMMUNITY_ANNOUNCEMENT_MAX_LENGTH = 1200;
    const COMMUNITY_ANNOUNCEMENT_BANNER_PREVIEW_LENGTH = 180;
    const TRONCAL_SPECIALTIES = ["mi", "ped", "gyo", "cir"];
    const POMQUEST_LOGO_SRC = "pomquest-logo.png";
    const POMODORO_STORAGE_KEYS = {
        settings: "enarm_pomodoro_settings",
        state: "enarm_pomodoro_state",
        log: "enarm_pomodoro_log",
        specialties: "enarm_pomodoro_specialties",
        focus: "enarm_pomodoro_focus"
    };
    const POMODORO_CYCLE_LENGTH = 4;
    const POMODORO_MAX_LOG_ENTRIES = 240;
    const TRONCAL_LABELS = {
        mi: "Medicina Interna",
        ped: "Pediatria",
        gyo: "Ginecologia y Obstetricia",
        cir: "Cirugia General"
    };
    const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14];
    const EXAM_TARGET_DATE = new Date(2026, 8, 28, 8, 0, 0);
    let notificationPermissionRequestedInSession = false;
    let foregroundPushListenerBound = false;
    let lastRegisteredPushToken = "";

    // ---------------------------------------------------------------------------
    // Taxonomy Normalization (4 troncales + tema canónico)
    // ---------------------------------------------------------------------------
    const normalizeTextKey = (value) => {
        return String(value || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    };

    const sanitizeTopicLabel = (text) => {
        if (!text) return "";
        return String(text)
            .replace(/\[cite:\s*\d+\]/gi, "")
            .replace(/\s+/g, " ")
            .replace(/\s*[-:;,.]+\s*$/g, "")
            .trim();
    };

    const containsAny = (text, keywords) => keywords.some(k => text.includes(k));

    const inferTroncalSpecialtyFromCase = (q) => {
        const text = normalizeTextKey([
            q?.specialty || "",
            q?.temaCanonical || "",
            q?.tema || "",
            q?.subtema || "",
            q?.case || "",
            q?.question || "",
            Array.isArray(q?.options) ? q.options.join(" ") : "",
            q?.explanation || "",
            q?.gpcReference || ""
        ].join(" "));

        const scores = { ped: 0, gyo: 0, cir: 0, mi: 0 };
        const buckets = {
            ped: ["pediatr", "neonato", "recien nacido", "lactante", "escolar", "preescolar", "adolescente", "apgar", "tamiz neonatal"],
            gyo: ["embarazo", "gestante", "obstetric", "parto", "preeclamps", "eclamps", "puerper", "cesarea", "transvaginal", "uter", "ovario", "cervix"],
            cir: ["cirug", "apendicitis", "colecist", "pancreatitis", "hernia", "trauma", "atls", "fractura", "quemadura", "obstruccion intestinal", "peritonitis"],
            mi: ["medicina interna", "diabetes", "hipertension", "lupus", "epoc", "asma", "tuberculosis", "vih", "insuficiencia", "endocrino", "nefro", "neuro", "cardio"]
        };

        Object.entries(buckets).forEach(([spec, words]) => {
            words.forEach(w => {
                if (text.includes(w)) scores[spec]++;
            });
        });

        const ordered = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const [topSpec, topScore] = ordered[0];
        const secondScore = ordered[1] ? ordered[1][1] : 0;

        if (topScore >= 2 && topScore >= secondScore + 1) return topSpec;

        if (containsAny(text, buckets.gyo)) return "gyo";
        if (containsAny(text, buckets.ped)) return "ped";
        if (containsAny(text, buckets.cir)) return "cir";
        return "mi";
    };

    const normalizeSpecialtyToTroncal = (q) => {
        const raw = normalizeTextKey(q?.specialty || "");
        if (TRONCAL_SPECIALTIES.includes(raw)) return raw;
        if (!raw) return inferTroncalSpecialtyFromCase(q);
        if (raw.includes("pediatr") || raw.includes("neonat")) return "ped";
        if (raw.includes("ginec") || raw.includes("obstet")) return "gyo";
        if (raw.includes("cirug") || raw.includes("trauma") || raw.includes("ortoped")) return "cir";
        if (raw.includes("urgenc") || raw.includes("toxicolog") || raw.includes("salud publica") || raw.includes("epidemiolog")) {
            return inferTroncalSpecialtyFromCase(q);
        }
        if (raw.includes("nefro") || raw.includes("neuro") || raw.includes("endocrino") || raw.includes("reumato") || raw.includes("infecto") || raw.includes("psiqu")) {
            return "mi";
        }
        return inferTroncalSpecialtyFromCase(q);
    };

    const getCaseCanonicalTopic = (q) => {
        const direct = sanitizeTopicLabel(q?.temaCanonical || "");
        if (direct) return direct;
        const fromTema = sanitizeTopicLabel(q?.tema || "");
        if (fromTema) return fromTema;
        const fromSubtema = sanitizeTopicLabel(q?.subtema || "");
        if (fromSubtema) return fromSubtema;
        const fromGpc = sanitizeTopicLabel(q?.gpcReference || "");
        if (fromGpc) return fromGpc;
        const spec = normalizeSpecialtyToTroncal(q);
        return `General ${TRONCAL_LABELS[spec] || "Medicina Interna"}`;
    };

    const getUnifiedTopicName = (text) => sanitizeTopicLabel(text);
    const formatDateKey = (date = new Date()) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    const parseDateKey = (value) => {
        if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return null;
        const [year, month, day] = String(value).split("-").map(Number);
        return new Date(year, month - 1, day);
    };
    const addDaysToKey = (dateKey, days) => {
        const base = parseDateKey(dateKey) || new Date();
        base.setDate(base.getDate() + days);
        return formatDateKey(base);
    };
    const compareDateKeys = (left, right) => {
        const a = parseDateKey(left);
        const b = parseDateKey(right);
        if (!a || !b) return 0;
        const aMid = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
        const bMid = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
        return Math.sign(aMid - bMid);
    };
    const getDaysUntilExam = () => {
        const now = new Date();
        const diff = EXAM_TARGET_DATE.getTime() - now.getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };
    const truncateText = (value, max = 110) => {
        const clean = String(value || "").replace(/\s+/g, " ").trim();
        if (clean.length <= max) return clean;
        return `${clean.slice(0, Math.max(0, max - 1)).trim()}…`;
    };
    const FONT_PRESET_CONFIG = {
        clinical: {
            bodyClass: "font-clinical",
            ui: "'Plus Jakarta Sans', sans-serif"
        },
        sora: {
            bodyClass: "font-sora",
            ui: "'Sora', sans-serif"
        },
        inter: {
            bodyClass: "font-inter",
            ui: "'Inter', sans-serif"
        }
    };
    const normalizeThemeSelection = (theme) => {
        const cleanTheme = String(theme || "").trim();
        if (!cleanTheme) return "ocean";
        if (cleanTheme === "clinical-dark") return "ocean";
        if (cleanTheme === "clinical-light") return "light";
        return cleanTheme;
    };
    const normalizeFontPreset = (preset) => FONT_PRESET_CONFIG[preset] ? preset : "clinical";
    const applyFontPreset = (preset, options = {}) => {
        const normalizedPreset = normalizeFontPreset(preset);
        State.fontPreset = normalizedPreset;
        document.body.classList.remove("font-clinical", "font-sora", "font-inter");
        document.body.classList.add(FONT_PRESET_CONFIG[normalizedPreset].bodyClass);
        const selector = $("font-preset-selector");
        if (selector && selector.value !== normalizedPreset) selector.value = normalizedPreset;
        if (window.Chart?.defaults?.font) {
            Chart.defaults.font.family = FONT_PRESET_CONFIG[normalizedPreset].ui;
        }
        if (options.refreshCharts && typeof updateCharts === "function" && State.view === "view-estadisticas") {
            updateCharts();
        }
    };
    const getCaseNotebookId = (q) => `case:${getCaseKey(q) || normalizeTextKey(`${q?.case || ""} ${q?.question || ""}`)}`;
    const formatNotebookTags = (value) => {
        if (Array.isArray(value)) return value.map(tag => String(tag || "").trim()).filter(Boolean);
        return String(value || "")
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean);
    };
    const clampPomodoroValue = (value, fallback, min, max) => {
        const num = Number(value);
        if (!Number.isFinite(num)) return fallback;
        return Math.min(max, Math.max(min, Math.round(num)));
    };
    const createDefaultPomodoroSettings = () => ({
        focusMinutes: 25,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        dailyGoal: 8,
        autoStartNext: false,
        systemNotifications: false
    });
    const normalizePomodoroSettings = (value = {}) => {
        const source = value && typeof value === "object" ? value : {};
        const defaults = createDefaultPomodoroSettings();
        return {
            focusMinutes: clampPomodoroValue(source.focusMinutes, defaults.focusMinutes, 5, 90),
            shortBreakMinutes: clampPomodoroValue(source.shortBreakMinutes, defaults.shortBreakMinutes, 1, 30),
            longBreakMinutes: clampPomodoroValue(source.longBreakMinutes, defaults.longBreakMinutes, 5, 45),
            dailyGoal: clampPomodoroValue(source.dailyGoal, defaults.dailyGoal, 1, 20),
            autoStartNext: !!source.autoStartNext,
            systemNotifications: !!source.systemNotifications
        };
    };
    const getPomodoroDurationSecondsForMode = (mode, settings = State.pomodoroSettings || createDefaultPomodoroSettings()) => {
        const safeSettings = normalizePomodoroSettings(settings);
        if (mode === "shortBreak") return safeSettings.shortBreakMinutes * 60;
        if (mode === "longBreak") return safeSettings.longBreakMinutes * 60;
        return safeSettings.focusMinutes * 60;
    };
    const createDefaultPomodoroState = (settings = createDefaultPomodoroSettings()) => ({
        mode: "focus",
        secondsLeft: getPomodoroDurationSecondsForMode("focus", settings),
        isRunning: false,
        startedAt: 0,
        endsAt: 0,
        pomodorosInCycle: 0,
        lastCompletedAt: 0
    });
    const normalizePomodoroState = (value = {}, settings = State.pomodoroSettings || createDefaultPomodoroSettings()) => {
        const source = value && typeof value === "object" ? value : {};
        const safeSettings = normalizePomodoroSettings(settings);
        const mode = source.mode === "shortBreak" || source.mode === "longBreak" ? source.mode : "focus";
        const fallbackSeconds = getPomodoroDurationSecondsForMode(mode, safeSettings);
        const secondsLeft = clampPomodoroValue(source.secondsLeft, fallbackSeconds, 0, 12 * 60 * 60);
        return {
            mode,
            secondsLeft,
            isRunning: !!source.isRunning,
            startedAt: Number(source.startedAt) > 0 ? Number(source.startedAt) : 0,
            endsAt: Number(source.endsAt) > 0 ? Number(source.endsAt) : 0,
            pomodorosInCycle: clampPomodoroValue(source.pomodorosInCycle, 0, 0, POMODORO_CYCLE_LENGTH),
            lastCompletedAt: Number(source.lastCompletedAt) > 0 ? Number(source.lastCompletedAt) : 0
        };
    };
    const normalizePomodoroSpecialties = (value) => {
        const source = Array.isArray(value)
            ? value
            : String(value || "")
                .split(",")
                .map(item => item.trim())
                .filter(Boolean);
        return Array.from(new Set(source.map(item => String(item || "").trim().toLowerCase())))
            .filter(item => TRONCAL_SPECIALTIES.includes(item));
    };
    const normalizePomodoroLogEntry = (entry) => {
        if (!entry || typeof entry !== "object") return null;
        const mode = entry.mode === "shortBreak" || entry.mode === "longBreak" ? entry.mode : "focus";
        const completedAt = Number(entry.completedAt || entry.timestamp || 0);
        if (!Number.isFinite(completedAt) || completedAt <= 0) return null;
        return {
            id: String(entry.id || `pomo-${completedAt}`),
            mode,
            completedAt,
            durationSeconds: clampPomodoroValue(entry.durationSeconds, getPomodoroDurationSecondsForMode(mode), 60, 12 * 60 * 60),
            specialties: normalizePomodoroSpecialties(entry.specialties),
            focusLabel: String(entry.focusLabel || "").trim()
        };
    };
    const getPomodoroModeMeta = (mode = "focus") => {
        if (mode === "shortBreak") {
            return {
                label: "Descanso corto",
                shortLabel: "Descanso",
                accent: "var(--accent-blue)",
                badgeClass: "is-break"
            };
        }
        if (mode === "longBreak") {
            return {
                label: "Descanso largo",
                shortLabel: "Descanso largo",
                accent: "var(--accent-orange)",
                badgeClass: "is-long-break"
            };
        }
        return {
            label: "Enfoque",
            shortLabel: "Enfoque",
            accent: "var(--accent-green)",
            badgeClass: "is-focus"
        };
    };
    const getPomodoroTodayCount = () => Number(State.studyCalendar?.[formatDateKey()]?.pomodoros || 0);
    const getPomodoroCurrentStreak = () => {
        const todayKey = formatDateKey();
        const todayCount = Number(State.studyCalendar?.[todayKey]?.pomodoros || 0);
        const yesterdayKey = addDaysToKey(todayKey, -1);
        const yesterdayCount = Number(State.studyCalendar?.[yesterdayKey]?.pomodoros || 0);
        if (todayCount <= 0 && yesterdayCount <= 0) return 0;
        let streak = 0;
        let currentKey = todayCount > 0 ? todayKey : yesterdayKey;
        for (let offset = 0; offset < 180; offset += 1) {
            const entry = State.studyCalendar?.[currentKey];
            if ((entry?.pomodoros || 0) <= 0) break;
            streak += 1;
            currentKey = addDaysToKey(currentKey, -1);
        }
        return streak;
    };
    const getPomodoroLast7Days = () => {
        const todayKey = formatDateKey();
        return Array.from({ length: 7 }, (_, index) => {
            const key = addDaysToKey(todayKey, -(6 - index));
            const entry = State.studyCalendar?.[key];
            const date = parseDateKey(key);
            return {
                key,
                count: Number(entry?.pomodoros || 0),
                label: date ? date.toLocaleDateString("es-MX", { weekday: "short" }).slice(0, 2).replace(".", "") : "--"
            };
        });
    };
    const getPomodoroSelectedSpecialtyLabels = (specialties = State.pomodoroSpecialties || []) => {
        return normalizePomodoroSpecialties(specialties).map(spec => TRONCAL_LABELS[spec] || spec);
    };
    const ensurePomodoroRunningState = () => {
        State.pomodoroSettings = normalizePomodoroSettings(State.pomodoroSettings);
        State.pomodoroState = normalizePomodoroState(State.pomodoroState, State.pomodoroSettings);
        if (!Array.isArray(State.pomodoroLog)) State.pomodoroLog = [];
        State.pomodoroLog = State.pomodoroLog
            .map(normalizePomodoroLogEntry)
            .filter(Boolean)
            .slice(0, POMODORO_MAX_LOG_ENTRIES);
        State.pomodoroSpecialties = normalizePomodoroSpecialties(State.pomodoroSpecialties);
        if (typeof State.pomodoroFocusLabel !== "string") State.pomodoroFocusLabel = "";
    };
    const ensureStudySystemsState = () => {
        if (!State.dailyPlan || typeof State.dailyPlan !== "object") State.dailyPlan = null;
        if (!Array.isArray(State.reviewQueue)) State.reviewQueue = [];
        if (!State.topicMastery || typeof State.topicMastery !== "object") State.topicMastery = {};
        if (!Array.isArray(State.caseNotebook)) State.caseNotebook = [];
        if (!State.studyCalendar || typeof State.studyCalendar !== "object") State.studyCalendar = {};
        if (!State.globalStats.byTema || typeof State.globalStats.byTema !== "object") State.globalStats.byTema = {};
        ensurePomodoroRunningState();
    };
    const getTopicPerformanceEntries = () => {
        ensureStudySystemsState();
        return Object.entries(State.globalStats.byTema || {})
            .map(([topic, stats]) => {
                const total = Number(stats?.total) || 0;
                const correct = Number(stats?.correct) || 0;
                const wrong = Math.max(0, total - correct);
                const precision = total > 0 ? (correct / total) * 100 : 0;
                const mastery = State.topicMastery[topic] || {};
                return {
                    topic,
                    total,
                    correct,
                    wrong,
                    precision,
                    specialty: mastery.specialty || stats?.specialty || "mi",
                    lastSeenAt: mastery.lastSeenAt || 0,
                    status: mastery.status || "sin_tocar",
                    reviewCount: mastery.reviewCount || 0
                };
            })
            .filter(entry => entry.total > 0)
            .sort((a, b) => {
                const riskA = a.status === "en_riesgo" ? 0 : a.status === "en_progreso" ? 1 : a.status === "dominado" ? 2 : 3;
                const riskB = b.status === "en_riesgo" ? 0 : b.status === "en_progreso" ? 1 : b.status === "dominado" ? 2 : 3;
                if (riskA !== riskB) return riskA - riskB;
                if (a.precision !== b.precision) return a.precision - b.precision;
                return b.total - a.total;
            });
    };
    const deriveTopicMasteryState = (entry, pendingReviews = 0) => {
        if (!entry || !entry.total) return "sin_tocar";
        if (pendingReviews > 0 || entry.precision < 58 || entry.wrong >= Math.max(3, entry.correct)) return "en_riesgo";
        if (entry.precision >= 82 && entry.total >= 6) return "dominado";
        return "en_progreso";
    };
    const rebuildTopicMastery = () => {
        ensureStudySystemsState();
        const reviewCounts = {};
        State.reviewQueue.forEach(item => {
            if (item?.topic) reviewCounts[item.topic] = (reviewCounts[item.topic] || 0) + (item.status === "completed" ? 0 : 1);
        });
        const nextTopicMastery = {};
        Object.entries(State.globalStats.byTema || {}).forEach(([topic, stats]) => {
            const total = Number(stats?.total) || 0;
            const correct = Number(stats?.correct) || 0;
            const wrong = Math.max(0, total - correct);
            const precision = total > 0 ? Number(((correct / total) * 100).toFixed(1)) : 0;
            const previous = State.topicMastery[topic] || {};
            const entry = {
                topic,
                specialty: previous.specialty || stats?.specialty || "mi",
                total,
                correct,
                wrong,
                precision,
                lastSeenAt: previous.lastSeenAt || 0,
                reviewCount: reviewCounts[topic] || 0
            };
            entry.status = deriveTopicMasteryState(entry, entry.reviewCount);
            nextTopicMastery[topic] = entry;
        });
        State.topicMastery = nextTopicMastery;
    };
    const getTrackedTopicMasteryEntries = () => {
        ensureStudySystemsState();
        return Object.values(State.topicMastery || {}).filter(entry => (Number(entry?.total) || 0) > 0);
    };
    const getTopicMasteryCounts = () => {
        ensureStudySystemsState();
        const counts = { sin_tocar: 0, en_progreso: 0, dominado: 0, en_riesgo: 0, total: 0 };
        getTrackedTopicMasteryEntries().forEach(mastery => {
            const status = mastery?.status || deriveTopicMasteryState(mastery, mastery?.reviewCount || 0);
            counts[status] = (counts[status] || 0) + 1;
            counts.total += 1;
        });
        return counts;
    };
    const getReviewQueueBuckets = () => {
        ensureStudySystemsState();
        const todayKey = formatDateKey();
        const today = [];
        const late = [];
        const completed = [];
        State.reviewQueue.forEach(item => {
            if (!item) return;
            if (item.lastCompletedDate === todayKey) {
                completed.push(item);
                return;
            }
            if (item.status === "completed") return;
            if (compareDateKeys(item.dueDate, todayKey) < 0) late.push(item);
            else if (compareDateKeys(item.dueDate, todayKey) === 0) today.push(item);
        });
        const sortPending = (a, b) => compareDateKeys(a.dueDate, b.dueDate) || String(a.title || a.topic || "").localeCompare(String(b.title || b.topic || ""));
        today.sort(sortPending);
        late.sort(sortPending);
        completed.sort((a, b) => String(b.lastCompletedDate || "").localeCompare(String(a.lastCompletedDate || "")));
        return { today, late, completed };
    };
    const recordStudyCalendarActivity = ({ sessions = 0, pomodoros = 0, topics = [], taskCompleted = false } = {}) => {
        ensureStudySystemsState();
        const todayKey = formatDateKey();
        const entry = State.studyCalendar[todayKey] || { sessions: 0, pomodoros: 0, topics: [], planCompleted: 0 };
        entry.sessions += sessions;
        entry.pomodoros += pomodoros;
        entry.planCompleted += taskCompleted ? 1 : 0;
        const topicSet = new Set([...(entry.topics || []), ...topics.filter(Boolean)]);
        entry.topics = Array.from(topicSet).slice(0, 25);
        State.studyCalendar[todayKey] = entry;
    };
    const upsertReviewQueueItem = (item) => {
        ensureStudySystemsState();
        if (!item || !item.id) return;
        const existingIndex = State.reviewQueue.findIndex(entry => entry.id === item.id);
        if (existingIndex >= 0) {
            const merged = { ...State.reviewQueue[existingIndex], ...item };
            if (State.reviewQueue[existingIndex].status === "completed" && item.status === "pending") {
                merged.completedStages = 0;
                merged.intervalIndex = item.intervalIndex || 0;
                merged.completedAt = null;
                merged.lastCompletedDate = null;
                merged.dueDate = item.dueDate;
            }
            if (merged.status !== "completed" && compareDateKeys(item.dueDate, State.reviewQueue[existingIndex].dueDate || item.dueDate) < 0) {
                merged.dueDate = item.dueDate;
            }
            State.reviewQueue[existingIndex] = merged;
        } else {
            State.reviewQueue.push(item);
        }
    };
    const scheduleReviewForQuestion = (q, options = {}) => {
        const topic = sanitizeTopicLabel(getCaseCanonicalTopic(q));
        const caseKey = getCaseKey(q) || getCaseNotebookId(q);
        const title = truncateText(q?.question || topic || "Repaso clínico", 92);
        const todayKey = formatDateKey();
        const topicId = `topic:${normalizeTextKey(topic)}`;
        const caseId = `case:${caseKey}`;
        upsertReviewQueueItem({
            id: topicId,
            kind: "topic",
            topic,
            specialty: q?.specialty || "mi",
            title: topic,
            detail: `Repasar puntos finos de ${topic.toLowerCase()}.`,
            dueDate: todayKey,
            intervalIndex: 0,
            status: "pending",
            lastCompletedDate: null
        });
        upsertReviewQueueItem({
            id: caseId,
            kind: "case",
            topic,
            specialty: q?.specialty || "mi",
            title,
            detail: truncateText(q?.case || q?.explanation || "", 120),
            dueDate: addDaysToKey(todayKey, options.delayDays || 1),
            intervalIndex: 0,
            status: "pending",
            lastCompletedDate: null
        });
    };
    const completeReviewQueueItem = (id) => {
        ensureStudySystemsState();
        const item = State.reviewQueue.find(entry => entry.id === id);
        if (!item) return;
        const todayKey = formatDateKey();
        item.lastCompletedDate = todayKey;
        item.completedStages = (item.completedStages || 0) + 1;
        if (item.completedStages >= REVIEW_INTERVALS_DAYS.length) {
            item.status = "completed";
            item.completedAt = Date.now();
        } else {
            item.status = "pending";
            item.intervalIndex = item.completedStages;
            item.dueDate = addDaysToKey(todayKey, REVIEW_INTERVALS_DAYS[item.intervalIndex]);
        }
        recordStudyCalendarActivity({ taskCompleted: true, topics: [item.topic] });
        ensureDailyPlanFresh(true);
        saveGlobalStats();
        if (State.view === "view-dashboard") renderStudyDashboard();
    };
    const getFocusedWeakTopics = (limit = 3) => getTopicPerformanceEntries().slice(0, limit);
    const buildSessionPostmortem = (result) => {
        const wrongQuestions = [];
        const blankQuestions = [];
        (State.answers || []).forEach((answer, index) => {
            const q = State.questionSet[index];
            if (!q) return;
            if (answer.selected === null) blankQuestions.push(q);
            else if (!answer.isCorrect) wrongQuestions.push(q);
        });
        const specCounts = {};
        const topicCounts = {};
        wrongQuestions.concat(blankQuestions).forEach(q => {
            const spec = q.specialty || "mi";
            const topic = sanitizeTopicLabel(getCaseCanonicalTopic(q));
            specCounts[spec] = (specCounts[spec] || 0) + 1;
            topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });
        const dominantSpecialty = Object.entries(specCounts).sort((a, b) => b[1] - a[1])[0];
        const priorityTopics = Object.entries(topicCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([topic, count]) => ({ topic, count }));
        const patterns = [];
        if (blankQuestions.length > 0) patterns.push(`Hubo ${blankQuestions.length} reactivos omitidos; conviene practicar cierre de decisiones y control de tiempo.`);
        if (dominantSpecialty) patterns.push(`La mayor carga de error estuvo en ${TRONCAL_LABELS[dominantSpecialty[0]] || dominantSpecialty[0]}.`);
        if (result.elapsedSec && result.total > 0) {
            const secondsPerQuestion = Math.round(result.elapsedSec / result.total);
            if (secondsPerQuestion > 105) patterns.push(`El ritmo fue de ${secondsPerQuestion}s por pregunta; vale la pena entrenar sesiones más cortas y cronometradas.`);
        }
        if (patterns.length < 3) {
            patterns.push(`Tus fallos se concentraron en ${priorityTopics[0]?.topic || "temas aún inestables"} y necesitan repaso guiado.`);
        }
        const nextAction = priorityTopics[0]
            ? {
                type: "topic-drill",
                topic: priorityTopics[0].topic,
                label: `Lanzar repaso de ${priorityTopics[0].topic}`
            }
            : {
                type: "dashboard",
                label: "Volver al plan del día"
            };
        return {
            patterns: patterns.slice(0, 3),
            priorityTopics,
            nextAction
        };
    };
    const buildDailyPlan = () => {
        ensureStudySystemsState();
        rebuildTopicMastery();
        const todayKey = formatDateKey();
        const buckets = getReviewQueueBuckets();
        const weakTopics = getFocusedWeakTopics(3);
        const daysLeft = getDaysUntilExam();
        const tasks = [];
        const primaryReview = buckets.late[0] || buckets.today[0];
        if (primaryReview) {
            tasks.push({
                id: "review-queue-primary",
                title: primaryReview.kind === "case" ? "Resolver repaso atrasado" : "Cerrar repaso temático",
                detail: primaryReview.topic ? `${primaryReview.topic}. ${primaryReview.detail || ""}` : (primaryReview.detail || "Atiéndelo antes de seguir sumando contenido nuevo."),
                action: primaryReview.kind === "case" ? "open-notebook" : "open-temario",
                actionTarget: primaryReview.topic || ""
            });
        }
        if (weakTopics[0]) {
            tasks.push({
                id: `weak-topic:${normalizeTextKey(weakTopics[0].topic)}`,
                title: "Atacar tu tema más frágil",
                detail: `${weakTopics[0].topic} con ${weakTopics[0].precision.toFixed(1)}% de precisión. Haz un bloque corto y enfocado.`,
                action: "topic-drill",
                actionTarget: weakTopics[0].topic
            });
        }
        tasks.push({
            id: "mock-session",
            title: daysLeft <= 120 ? "Simulacro corto con presión real" : "Mini sesión clínica de consolidación",
            detail: daysLeft <= 120
                ? `Quedan ${daysLeft} días para el ENARM. Conviene sostener simulacros breves con cronómetro.`
                : `Quedan ${daysLeft} días para el ENARM. Aprovecha para consolidar precisión antes de aumentar carga.`,
            action: "open-setup",
            actionTarget: daysLeft <= 120 ? "mini" : "flash"
        });
        if (tasks.length < 3) {
            tasks.push({
                id: "temario-scan",
                title: "Revisar cobertura del temario",
                detail: "Usa el mapa del temario para detectar huecos y convertirlos en práctica concreta.",
                action: "open-temario",
                actionTarget: weakTopics[1]?.topic || ""
            });
        }
        return {
            date: todayKey,
            focusTopic: weakTopics[0]?.topic || (primaryReview?.topic || "Constancia clínica"),
            pressure: daysLeft <= 120 ? "Ventana de alto rendimiento" : "Construcción sostenida",
            summary: primaryReview
                ? `Tienes ${buckets.late.length + buckets.today.length} repasos pendientes y ${weakTopics.length} temas sensibles que conviene tocar hoy.`
                : `Tu foco principal de hoy es ${weakTopics[0]?.topic || "mantener la constancia"} con un bloque corto y claro.`,
            tasks: tasks.slice(0, 3),
            completedTaskIds: []
        };
    };
    const ensureDailyPlanFresh = (force = false) => {
        ensureStudySystemsState();
        const todayKey = formatDateKey();
        if (!force && State.dailyPlan && State.dailyPlan.date === todayKey) return;
        const previousCompleted = State.dailyPlan && State.dailyPlan.date === todayKey ? State.dailyPlan.completedTaskIds || [] : [];
        State.dailyPlan = buildDailyPlan();
        State.dailyPlan.completedTaskIds = previousCompleted.filter(id => State.dailyPlan.tasks.some(task => task.id === id));
    };
    const markDailyPlanTaskDone = (taskId) => {
        ensureDailyPlanFresh();
        if (!State.dailyPlan.completedTaskIds.includes(taskId)) {
            State.dailyPlan.completedTaskIds.push(taskId);
            recordStudyCalendarActivity({ taskCompleted: true });
        }
    };
    const getNextRecommendedAction = () => {
        ensureDailyPlanFresh();
        const pendingTask = (State.dailyPlan?.tasks || []).find(task => !(State.dailyPlan.completedTaskIds || []).includes(task.id));
        return pendingTask || null;
    };
    const upsertCaseNotebookEntry = (q, extra = {}) => {
        ensureStudySystemsState();
        if (!q) return null;
        const notebookId = getCaseNotebookId(q);
        const existingIndex = State.caseNotebook.findIndex(entry => entry.id === notebookId);
        const entry = {
            id: notebookId,
            caseKey: getCaseKey(q) || notebookId,
            topic: sanitizeTopicLabel(getCaseCanonicalTopic(q)),
            specialty: q.specialty || "mi",
            title: truncateText(q.question || q.case || "Caso clínico", 100),
            caseText: truncateText(q.case || "", 220),
            note: "",
            tags: [],
            savedAt: Date.now(),
            ...extra
        };
        if (existingIndex >= 0) {
            State.caseNotebook[existingIndex] = { ...State.caseNotebook[existingIndex], ...entry, savedAt: State.caseNotebook[existingIndex].savedAt || entry.savedAt };
            return State.caseNotebook[existingIndex];
        }
        State.caseNotebook.unshift(entry);
        State.caseNotebook = State.caseNotebook.slice(0, 120);
        return entry;
    };

    let __topicIndexCache = null;
    let __temarioTopicCatalogCache = null;
    let __temarioSuggestionCatalogCache = null;
    let __temarioSuggestionEntriesCache = null;
    let __questionsBySpecialtyCache = null;
    let __realSimPoolCache = null;
    const invalidateTopicIndex = () => {
        __topicIndexCache = null;
        __temarioTopicCatalogCache = null;
        __temarioSuggestionCatalogCache = null;
        __temarioSuggestionEntriesCache = null;
        __questionsBySpecialtyCache = null;
        __realSimPoolCache = null;
    };
    const buildTopicIndex = () => {
        const idx = new Map();
        if (typeof QUESTIONS === "undefined" || !Array.isArray(QUESTIONS)) return idx;
        QUESTIONS.forEach(q => {
            if (!q) return;
            const spec = normalizeSpecialtyToTroncal(q);
            q.specialty = spec;
            const temaCanonical = getCaseCanonicalTopic(q);
            q.temaCanonical = temaCanonical;
            if (!sanitizeTopicLabel(q.tema)) q.tema = temaCanonical;
            if (!sanitizeTopicLabel(q.subtema)) q.subtema = temaCanonical;
            if (!TRONCAL_SPECIALTIES.includes(spec)) return;
            const key = normalizeTextKey(temaCanonical);
            if (!key) return;
            if (!idx.has(key)) idx.set(key, { topic: temaCanonical, count: 0, specs: new Set() });
            const entry = idx.get(key);
            entry.count++;
            entry.specs.add(spec);
        });
        return idx;
    };
    const getTopicIndex = () => {
        if (!__topicIndexCache) __topicIndexCache = buildTopicIndex();
        return __topicIndexCache;
    };

    const tokenizeSearchKey = (value) => normalizeTextKey(value).split(" ").filter(Boolean);
    const topicKeyMatchesQuery = (topicKey, queryKey) => {
        const tKey = normalizeTextKey(topicKey);
        const qKey = normalizeTextKey(queryKey);
        if (!tKey || !qKey) return false;
        if (tKey === qKey) return true;
        if (tKey.includes(qKey)) return true;
        if (qKey.includes(tKey) && tKey.length >= 5) return true;

        const queryTokens = tokenizeSearchKey(qKey).filter(t => t.length >= 3);
        if (queryTokens.length === 0) return false;
        let hits = 0;
        queryTokens.forEach(token => {
            if (tKey.includes(token)) hits++;
        });
        if (hits === queryTokens.length) return true;
        if (queryTokens.length >= 3 && hits >= queryTokens.length - 1) return true;
        return false;
    };
    const topicKeyMatchesAnySelection = (topicKey, selectedKeys) => {
        for (const selectedKey of selectedKeys) {
            if (topicKeyMatchesQuery(topicKey, selectedKey)) return true;
        }
        return false;
    };
    const TOPIC_QUERY_PREFIX = "__query__:";
    const isTopicQueryTag = (value) => String(value || "").startsWith(TOPIC_QUERY_PREFIX);
    const makeTopicQueryTag = (value) => {
        const normalized = normalizeTextKey(value);
        return normalized ? `${TOPIC_QUERY_PREFIX}${normalized}` : "";
    };
    const getTopicQueryFromTag = (value) => isTopicQueryTag(value) ? String(value).slice(TOPIC_QUERY_PREFIX.length) : "";
    const getTopicTagLabel = (value) => isTopicQueryTag(value) ? `Texto: ${getTopicQueryFromTag(value)}` : String(value || "");
    const buildSelectedTopicState = (selectedTopics = []) => {
        const topicKeys = new Set();
        const textQueries = [];
        selectedTopics.forEach(raw => {
            if (isTopicQueryTag(raw)) {
                const query = getTopicQueryFromTag(raw);
                if (query) textQueries.push(query);
                return;
            }
            const key = normalizeTextKey(raw);
            if (key) topicKeys.add(key);
        });
        return { topicKeys, textQueries };
    };
    const getCaseSearchText = (q) => {
        const nested = Array.isArray(q?.questions)
            ? q.questions.flatMap(sq => [
                sq?.question || "",
                ...(Array.isArray(sq?.options) ? sq.options : []),
                sq?.explanation || "",
                sq?.gpcReference || ""
            ]).join(" ")
            : "";
        return normalizeTextKey([
            getCaseCanonicalTopic(q),
            q?.tema || "",
            q?.subtema || "",
            q?.case || "",
            q?.question || "",
            Array.isArray(q?.options) ? q.options.join(" ") : "",
            q?.explanation || "",
            q?.gpcReference || "",
            nested
        ].join(" "));
    };
    const getCaseTopicLabelKeys = (q) => {
        const keys = new Set();
        [
            q?.temaCanonical,
            q?.tema,
            q?.subtema,
            q?.temaOriginal,
            q?.subtemaOriginal,
            q?.gpcReference
        ].forEach(value => {
            const key = normalizeTextKey(sanitizeTopicLabel(value || ""));
            if (key) keys.add(key);
        });
        return Array.from(keys);
    };
    const caseMatchesSelectedTopics = (q, selectedTopicState) => {
        if (!selectedTopicState) return true;
        const hasTopicKeys = selectedTopicState.topicKeys && selectedTopicState.topicKeys.size > 0;
        const hasTextQueries = Array.isArray(selectedTopicState.textQueries) && selectedTopicState.textQueries.length > 0;
        if (!hasTopicKeys && !hasTextQueries) return true;

        if (hasTopicKeys) {
            const topicLabelKeys = getCaseTopicLabelKeys(q);
            const temarioCatalog = getTemarioTopicCatalog();
            for (const selectedKey of selectedTopicState.topicKeys) {
                const temarioEntry = temarioCatalog.get(selectedKey);
                if (temarioEntry && caseMatchesTemarioEntry(q, temarioEntry)) return true;
            }
            if (topicLabelKeys.some(labelKey => topicKeyMatchesAnySelection(labelKey, selectedTopicState.topicKeys))) {
                return true;
            }
        }

        if (hasTextQueries) {
            const searchText = getCaseSearchText(q);
            if (searchText && selectedTopicState.textQueries.some(query => topicKeyMatchesQuery(searchText, query))) {
                return true;
            }
        }
        return false;
    };

    const showNotification = (msg, type = 'info', durationMs = 3500) => {
        let container = $('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let icon = '&#x2139;&#xFE0F;';
        if (type === 'success') icon = '&#x2705;';
        if (type === 'error') icon = '&#x1F6A8;';
        if (type === 'warning') icon = '&#x26A0;';

        toast.innerHTML = `<span style="font-size: 18px;">${icon}</span><span style="flex:1;">${msg}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hiding');
            toast.addEventListener('animationend', () => toast.remove());
        }, durationMs);
    };

    let questionsLoadPromise = null;
    let questionsHydrated = false;

    const hasQuestionsBankLoaded = () => {
        return typeof QUESTIONS !== "undefined" && Array.isArray(QUESTIONS) && QUESTIONS.length > 0;
    };

    const withTemporaryButtonLabel = async (button, loadingLabel, task) => {
        if (!button) return task();
        const previousHtml = button.innerHTML;
        const wasDisabled = button.disabled;
        button.disabled = true;
        button.textContent = loadingLabel;
        try {
            return await task();
        } finally {
            button.disabled = wasDisabled;
            button.innerHTML = previousHtml;
        }
    };

    let examLoadingOverlayEl = null;
    let examLoadingTitleEl = null;
    let examLoadingDetailEl = null;
    let examLoadingFillEl = null;
    let examLoadingPercentEl = null;

    const ensureExamLoadingOverlay = () => {
        if (examLoadingOverlayEl) return examLoadingOverlayEl;
        if (!document.body) return null;

        const overlay = document.createElement("div");
        overlay.id = "exam-loading-overlay";
        overlay.className = "exam-loading-overlay";
        overlay.setAttribute("aria-hidden", "true");
        overlay.innerHTML = `
            <div class="exam-loading-card" role="status" aria-live="polite" aria-atomic="true">
                <div class="exam-loading-kicker">ENARM Lab</div>
                <h3 class="exam-loading-title" id="exam-loading-title">Preparando examen...</h3>
                <p class="exam-loading-detail" id="exam-loading-detail">Estamos organizando tus preguntas.</p>
                <div class="exam-loading-bar" aria-hidden="true">
                    <div class="exam-loading-fill" id="exam-loading-fill"></div>
                </div>
                <div class="exam-loading-meta">
                    <span>Esto puede tardar unos segundos</span>
                    <span class="exam-loading-percent" id="exam-loading-percent">0%</span>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        examLoadingOverlayEl = overlay;
        examLoadingTitleEl = $("exam-loading-title");
        examLoadingDetailEl = $("exam-loading-detail");
        examLoadingFillEl = $("exam-loading-fill");
        examLoadingPercentEl = $("exam-loading-percent");
        return overlay;
    };

    const clampLoadingProgress = (value) => {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return 0;
        return Math.max(0, Math.min(100, numeric));
    };

    const setExamLoadingState = ({
        title,
        detail,
        progress
    } = {}) => {
        const overlay = ensureExamLoadingOverlay();
        if (!overlay) return;

        if (typeof title === "string" && examLoadingTitleEl) {
            examLoadingTitleEl.textContent = title;
        }
        if (typeof detail === "string" && examLoadingDetailEl) {
            examLoadingDetailEl.textContent = detail;
        }
        if (typeof progress === "number") {
            const safeProgress = clampLoadingProgress(progress);
            if (examLoadingFillEl) examLoadingFillEl.style.width = `${safeProgress}%`;
            if (examLoadingPercentEl) examLoadingPercentEl.textContent = `${Math.round(safeProgress)}%`;
        }
    };

    const showExamLoadingOverlay = (initialState = {}) => {
        const overlay = ensureExamLoadingOverlay();
        if (!overlay) return;
        document.body.classList.add("exam-loading-active");
        overlay.classList.add("active");
        overlay.setAttribute("aria-hidden", "false");
        setExamLoadingState(initialState);
    };

    const hideExamLoadingOverlay = () => {
        if (!examLoadingOverlayEl) return;
        examLoadingOverlayEl.classList.remove("active");
        examLoadingOverlayEl.setAttribute("aria-hidden", "true");
        document.body.classList.remove("exam-loading-active");
    };

    const waitForNextPaint = () => new Promise((resolve) => {
        const raf = window.requestAnimationFrame || ((cb) => setTimeout(cb, 16));
        raf(() => raf(resolve));
    });

    const withExamLoadingOverlay = async (task, initialState = {}) => {
        showExamLoadingOverlay(initialState);
        await waitForNextPaint();

        const setStage = async (nextState = {}) => {
            setExamLoadingState(nextState);
            await waitForNextPaint();
        };

        try {
            return await task(setStage);
        } finally {
            hideExamLoadingOverlay();
        }
    };

    const loadQuestionsScript = () => {
        if (hasQuestionsBankLoaded()) return Promise.resolve(QUESTIONS);
        if (questionsLoadPromise) return questionsLoadPromise;

        questionsLoadPromise = new Promise((resolve, reject) => {
            const resolveReady = () => {
                if (hasQuestionsBankLoaded()) {
                    resolve(QUESTIONS);
                    return;
                }
                questionsLoadPromise = null;
                reject(new Error("questions_missing_after_load"));
            };
            const rejectLoad = () => {
                questionsLoadPromise = null;
                reject(new Error("questions_load_failed"));
            };

            const existing = document.querySelector('script[data-questions-bank="1"]');
            if (existing) {
                if (existing.dataset.loaded === "1") {
                    resolveReady();
                    return;
                }
                existing.addEventListener("load", resolveReady, { once: true });
                existing.addEventListener("error", rejectLoad, { once: true });
                return;
            }

            const script = document.createElement("script");
            script.src = "./questions.js";
            script.charset = "UTF-8";
            script.async = true;
            script.dataset.questionsBank = "1";
            script.addEventListener("load", () => {
                script.dataset.loaded = "1";
                resolveReady();
            }, { once: true });
            script.addEventListener("error", () => {
                script.remove();
                rejectLoad();
            }, { once: true });
            document.body.appendChild(script);
        });

        return questionsLoadPromise;
    };

    const hydrateLoadedQuestions = () => {
        if (questionsHydrated || !hasQuestionsBankLoaded()) return;
        QUESTIONS.forEach(q => {
            if (!q) return;
            if (q.specialtyOriginal === undefined) q.specialtyOriginal = q.specialty || "";
            q.specialty = normalizeSpecialtyToTroncal(q);
            q.temaCanonical = getCaseCanonicalTopic(q);
            if (!sanitizeTopicLabel(q.tema)) q.tema = q.temaCanonical;
            if (!sanitizeTopicLabel(q.subtema)) q.subtema = q.temaCanonical;
        });
        State.reclassMap = applyCaseReclassifications();
        questionsHydrated = true;
    };

    const ensureQuestionsReady = async (opts = {}) => {
        const { silent = false } = opts;
        try {
            await loadQuestionsScript();
            hydrateLoadedQuestions();
            return QUESTIONS;
        } catch (err) {
            console.error("No se pudo cargar el banco de preguntas:", err);
            if (!silent) {
                showNotification("No se pudo cargar el banco de preguntas. Recarga la app e intenta de nuevo.", "error");
            }
            throw err;
        }
    };

    if (hasQuestionsBankLoaded()) {
        hydrateLoadedQuestions();
    }

    const normalizeTimestamp = (value) => {
        if (!value) return null;
        if (value instanceof Date) return value;
        if (typeof value.toDate === "function") return value.toDate();
        const parsed = new Date(value);
        return isNaN(parsed.getTime()) ? null : parsed;
    };

    const isAdminUser = () => {
        return !!(State.currentUid && ADMIN_UIDS.includes(State.currentUid));
    };

    const setAdminPreviewMode = (mode, opts = {}) => {
        const safeMode = mode === "demo" ? "demo" : "premium";
        State.adminPreviewMode = safeMode;
        localStorage.setItem(ADMIN_PREVIEW_STORAGE_KEY, safeMode);
        syncPremiumUI();
        if (opts.notify) {
            const label = safeMode === "demo" ? "demo" : "premium";
            showNotification(`Vista admin cambiada a ${label}.`, "info");
        }
    };

    const isPremiumActive = () => {
        if (isAdminUser()) return State.adminPreviewMode !== "demo";
        const ent = State.entitlement;
        if (!ent || ent.status !== "active") return false;
        if (!ent.expiresAt) return true;
        return ent.expiresAt.getTime() > Date.now();
    };

    const formatDate = (d) => {
        if (!d) return "Sin fecha";
        return d.toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "2-digit" });
    };

    const formatDateTime = (d) => {
        if (!d) return "Sin fecha";
        return d.toLocaleString("es-MX", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const updatePremiumStatusLabel = () => {
        const statusEl = $("profile-premium-status");
        const untilEl = $("profile-premium-until");
        if (!statusEl && !untilEl) return;
        if (isAdminUser()) {
            if (statusEl) {
                statusEl.value = State.adminPreviewMode === "demo" ? "Admin (vista demo)" : "Admin (vista premium)";
            }
            if (untilEl) {
                untilEl.value = State.adminPreviewMode === "demo" ? "No aplica en vista demo" : "No aplica para admin";
            }
            return;
        }

        const entitlement = State.entitlement;
        if (!entitlement) {
            if (statusEl) statusEl.value = "Demo";
            if (untilEl) untilEl.value = "Sin acceso activo";
            return;
        }

        const expiresAt = entitlement.expiresAt;
        const hasExpiry = !!expiresAt;
        const isExpired = hasExpiry && expiresAt.getTime() <= Date.now();

        if (entitlement.status !== "active" || isExpired) {
            if (statusEl) statusEl.value = hasExpiry ? "Premium vencido" : "Demo";
            if (untilEl) untilEl.value = hasExpiry ? formatDateTime(expiresAt) : "Sin acceso activo";
            return;
        }

        if (statusEl) statusEl.value = "Premium activo";
        if (untilEl) {
            untilEl.value = hasExpiry ? formatDateTime(expiresAt) : "Sin fecha de vencimiento";
        }
    };

    function getGlobalAccuracy() {
        const responded = State.globalStats.respondidas || 0;
        if (responded <= 0) return 0;
        return parseFloat(((State.globalStats.aciertos / responded) * 100).toFixed(1));
    }

    function getUserRankLabel(precision) {
        const value = Number(precision) || 0;
        if (value >= 70) return "Especialista";
        if (value >= 60) return "Residente";
        if (value >= 50) return "Médico General";
        if (value >= 30) return "MPSS";
        if (value >= 0) return "MIP";
        return "Aspirante";
    }

    function renderProfileView() {
        const heroName = $("profile-hero-name");
        if (!heroName) return;

        const displayName = State.userName || "Aspirante";
        const nameParts = displayName.trim().split(/\s+/).filter(Boolean);
        const initials = nameParts.length > 1
            ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
            : (nameParts[0] || "AS").substring(0, 2).toUpperCase();
        const precision = getGlobalAccuracy();
        const rank = getUserRankLabel(precision);
        const streak = getEffectiveStreak();
        const probability = getProbability(streak);
        const premiumLabel = isAdminUser()
            ? (State.adminPreviewMode === "demo" ? "Admin Demo" : "Admin Premium")
            : (isPremiumActive() ? "Premium" : "Demo");
        const email = window.FB && window.FB.auth && window.FB.auth.currentUser && window.FB.auth.currentUser.email
            ? window.FB.auth.currentUser.email
            : "No disponible";
        const metaParts = [];
        if (State.userSpecialty) metaParts.push(State.userSpecialty);
        if (State.userUniversity) metaParts.push(State.userUniversity);
        if (metaParts.length === 0) {
            metaParts.push("Completa tu especialidad y universidad para personalizar mejor tu perfil");
        }

        if ($("profile-hero-avatar")) $("profile-hero-avatar").textContent = initials;
        heroName.textContent = displayName;
        if ($("profile-hero-meta")) $("profile-hero-meta").textContent = metaParts.join(" • ");
        if ($("profile-badge-rank")) $("profile-badge-rank").textContent = rank;
        if ($("profile-badge-premium")) $("profile-badge-premium").textContent = premiumLabel;
        if ($("profile-badge-streak")) $("profile-badge-streak").textContent = `${streak} día${streak !== 1 ? "s" : ""} de racha`;

        if ($("profile-stat-accuracy")) $("profile-stat-accuracy").textContent = `${precision.toFixed(1)}%`;
        if ($("profile-stat-answered")) $("profile-stat-answered").textContent = (State.globalStats.respondidas || 0).toLocaleString("es-MX");
        if ($("profile-stat-sessions")) $("profile-stat-sessions").textContent = (State.globalStats.sesiones || 0).toLocaleString("es-MX");
        if ($("profile-stat-probability")) $("profile-stat-probability").textContent = `${probability}%`;
        if ($("profile-stat-pomodoros")) $("profile-stat-pomodoros").textContent = String(State.globalStats.pomodoros || 0);
        if ($("profile-stat-history")) $("profile-stat-history").textContent = String(State.history.length || 0);

        if ($("profile-email")) $("profile-email").value = email;
        if ($("profile-name")) $("profile-name").value = displayName;
        if ($("profile-uid")) $("profile-uid").value = State.currentUid || "";
        if ($("profile-specialty")) $("profile-specialty").value = State.userSpecialty || "";
        if ($("profile-university")) $("profile-university").value = State.userUniversity || "";
        if ($("profile-score-public-toggle")) $("profile-score-public-toggle").checked = !State.isScorePublic;
        updatePremiumStatusLabel();
    }

    const clearSelectedPreset = () => {
        $$(".preset-card").forEach(card => card.classList.remove("active"));
        State.selectedPresetId = null;
    };

    const activatePresetCard = (card) => {
        if (!card) {
            clearSelectedPreset();
            return;
        }
        $$(".preset-card").forEach(item => item.classList.remove("active"));
        card.classList.add("active");
        State.selectedPresetId = card.id || null;
    };

    const syncPremiumUI = () => {
        updatePremiumStatusLabel();
        renderProfileView();
        const premium = isPremiumActive();
        const qtySlider = $("setup-qty-slider");
        const qtyVal = $("setup-qty-val");
        const qtyMaxLabel = $("setup-qty-max-label");
        const timeInput = $("setup-time-minutes");
        const timeLabel = $("setup-time-label");
        const libBtn = $("time-libre-btn");
        if (qtySlider) {
            const max = premium ? 280 : DEMO_MAX_QTY;
            qtySlider.max = String(max);
            if (qtyMaxLabel) qtyMaxLabel.textContent = String(max);
            if (parseInt(qtySlider.value, 10) > max) {
                qtySlider.value = String(max);
                if (qtyVal) qtyVal.textContent = String(max);
            }
        }
        const flashPreset = $("preset-flash");
        const flashPresetMeta = $("preset-flash-meta");
        if (flashPreset) {
            const flashQty = premium ? "20" : String(DEMO_MAX_QTY);
            flashPreset.dataset.qty = flashQty;
            if (flashPresetMeta) flashPresetMeta.textContent = `${flashQty} Preguntas • 15m`;
            if (flashPreset.classList.contains("active")) {
                if (qtySlider) {
                    qtySlider.value = flashQty;
                    if (qtyVal) qtyVal.textContent = flashQty;
                }
                if (timeInput) timeInput.value = "15";
                if (timeLabel) timeLabel.textContent = "15 MIN";
                if (libBtn) libBtn.classList.remove("active");
            }
        }
        if (!premium) {
            const activePreset = document.querySelector(".preset-card.active");
            if (activePreset && activePreset.dataset.premium === "1") {
                if (flashPreset) {
                    activatePresetCard(flashPreset);
                    const q = flashPreset.dataset.qty;
                    const t = flashPreset.dataset.time;
                    if (qtySlider && q) {
                        qtySlider.value = q;
                        if (qtyVal) qtyVal.textContent = q;
                    }
                    if (timeInput && t) {
                        timeInput.value = t;
                        if (timeLabel) timeLabel.textContent = `${t} MIN`;
                        if (libBtn) libBtn.classList.remove("active");
                    }
                }
            }
        }

        const lockMap = [
            { selector: "#nav-comunidad", reason: "Comunidad es premium." },
            { selector: ".mobile-nav-item[data-view='view-comunidad']", reason: "Comunidad es premium." },
            { selector: "#preset-real", reason: "Simulacro completo es premium." },
            { selector: "#preset-mini", reason: "Preset mini es premium." },
            { selector: "#btn-create-challenge", reason: "Retar amigos es premium." },
            { selector: "#mas-pomodoro-item", reason: "Centro Pomodoro es premium." },
            { selector: "#mas-estudio-plus-item", reason: "Estudio Plus es premium." },
            { selector: "#btn-refuerzo-ia-dash", reason: "Refuerzos inteligentes son premium." },
            { selector: "#btn-refuerzos-view", reason: "Zonas de refuerzo son premium." },
            { selector: "#btn-refuerzo-ia", reason: "Refuerzo IA es premium." },
            { selector: "#btn-refuerzo-rapido", reason: "Refuerzos son premium." },
            { selector: "#btn-refuerzo-casos", reason: "Refuerzo de casos es premium." },
            { selector: "#mas-reportes-item", reason: "Reportes es premium." }
        ];
        lockMap.forEach(({ selector, reason }) => {
            const el = document.querySelector(selector);
            if (!el) return;
            const locked = !premium;
            el.classList.toggle("demo-locked", locked);
            if (locked) {
                el.dataset.lockReason = reason;
                el.title = reason;
            } else {
                delete el.dataset.lockReason;
                el.removeAttribute("title");
            }
        });

        $$(".theme-circle").forEach(circle => {
            const selectedTheme = circle.dataset.theme || "ocean";
            const locked = !premium && !DEMO_ALLOWED_THEMES.has(selectedTheme);
            circle.classList.toggle("demo-locked", locked);
            if (locked) {
                circle.dataset.lockReason = "En demo solo estan disponibles 2 temas visuales.";
                circle.title = circle.dataset.lockReason;
            } else {
                delete circle.dataset.lockReason;
                circle.removeAttribute("title");
            }
        });

        $$(".diff-btn").forEach(btn => {
            const locked = !premium && btn.dataset.diff !== "cualquiera";
            btn.classList.toggle("demo-locked", locked);
            if (locked) {
                btn.dataset.lockReason = "En demo solo puedes usar dificultad Cualquiera.";
                btn.title = btn.dataset.lockReason;
            } else {
                delete btn.dataset.lockReason;
                btn.removeAttribute("title");
            }
        });
        if (!premium && State.difficulty !== "cualquiera") {
            State.difficulty = "cualquiera";
            $$(".diff-btn").forEach(b => b.classList.toggle("active", b.dataset.diff === "cualquiera"));
        }

        const topicInput = $("setup-topic-filter");
        const topicCont = $("selected-topics-container");
        if (topicInput) {
            if (!topicInput.dataset.defaultPlaceholder) {
                topicInput.dataset.defaultPlaceholder = topicInput.placeholder || "";
            }
            const topicLocked = !premium;
            topicInput.classList.toggle("demo-locked", topicLocked);
            topicInput.readOnly = topicLocked;
            topicInput.title = topicLocked ? "Filtro por tema/GPC disponible solo en premium." : "";
            topicInput.placeholder = topicLocked
                ? "Disponible solo en premium"
                : (topicInput.dataset.defaultPlaceholder || "Buscar tema");
        }
        if (topicCont) topicCont.classList.toggle("demo-locked", !premium);

        const randomSpecItem = document.querySelector('.spec-item[data-spec="random"]');
        const setupSpecItems = $$(".spec-item");
        setupSpecItems.forEach(item => {
            const isRandom = item.dataset.spec === "random";
            const locked = !premium && !isRandom;
            item.classList.toggle("demo-locked", locked);
            if (locked) {
                item.dataset.lockReason = "En gratis solo puedes usar la especialidad Aleatorio.";
                item.title = item.dataset.lockReason;
                item.classList.remove("checked");
            } else {
                delete item.dataset.lockReason;
                item.removeAttribute("title");
            }
        });
        if (!premium && randomSpecItem) {
            randomSpecItem.classList.add("checked");
            State.selectedSpecialties = ["random"];
        } else if (premium) {
            State.selectedSpecialties = $$(".spec-item.checked").map(i => i.dataset.spec).filter(Boolean);
        }

        const btnCreate = $("btn-create-challenge");
        if (btnCreate) {
            const enabled = premium;
            btnCreate.disabled = !enabled;
            btnCreate.style.opacity = enabled ? "1" : "0.6";
            btnCreate.style.cursor = enabled ? "pointer" : "not-allowed";
        }
        const pomodoroShell = $("pomodoro-widget-shell");
        if (pomodoroShell) pomodoroShell.style.display = premium ? "" : "none";
        document.body.classList.toggle("stats-demo-preview", !premium);
        const statsDemoBanner = $("stats-demo-banner");
        if (statsDemoBanner) statsDemoBanner.style.display = premium ? "none" : "";
        if (!premium && PREMIUM_VIEWS.has(State.view)) {
            showView("view-dashboard");
            showNotification("Esta función está disponible solo en premium.", "info");
        }
        if (!premium && !DEMO_ALLOWED_THEMES.has(State.theme || "ocean")) {
            State.theme = "ocean";
            localStorage.setItem("enarm_theme", "ocean");
            applyTheme("ocean");
        }
        const adminPanel = $("admin-codes-panel");
        if (adminPanel) adminPanel.style.display = isAdminUser() ? "block" : "none";

        const adminPreviewPanel = $("admin-preview-panel");
        if (adminPreviewPanel) adminPreviewPanel.style.display = isAdminUser() ? "block" : "none";
        $$(".admin-preview-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.adminPreview === State.adminPreviewMode);
        });
    };

    const syncThemeColorMeta = () => {
        let color = "#111623";
        if (window.getComputedStyle) {
            const bodyStyles = window.getComputedStyle(document.body);
            const chromeColor = (bodyStyles.getPropertyValue("--app-chrome-bg") || "").trim();
            const sidebarColor = (bodyStyles.getPropertyValue("--bg-sidebar") || "").trim();
            if (chromeColor) {
                color = chromeColor;
            } else if (sidebarColor) {
                color = sidebarColor;
            } else {
                const topBar = document.querySelector(".mobile-top-bar");
                const computed = topBar ? window.getComputedStyle(topBar).backgroundColor : "";
                const match = computed && computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?/i);
                if (match) {
                    const toHex = (value) => Number(value).toString(16).padStart(2, "0");
                    color = `#${toHex(match[1])}${toHex(match[2])}${toHex(match[3])}`;
                }
            }
        }

        let themeMeta = document.querySelector('meta[name="theme-color"]');
        if (!themeMeta) {
            themeMeta = document.createElement("meta");
            themeMeta.setAttribute("name", "theme-color");
            document.head.appendChild(themeMeta);
        }
        themeMeta.setAttribute("content", color);
        document.documentElement.style.backgroundColor = color;
    };

    function setPricingPanelState(panelId, open) {
        const panel = typeof panelId === "string" ? $(panelId) : panelId;
        if (!panel) return;
        const shouldOpen = Boolean(open);
        panel.hidden = !shouldOpen;
        panel.classList.toggle("is-open", shouldOpen);
        document.querySelectorAll(`[data-pricing-toggle="${panel.id}"]`).forEach(btn => {
            btn.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
            btn.classList.toggle("is-open", shouldOpen);
        });
    }

    const openRedeemModal = (reason) => {
        const modal = $("redeem-modal");
        const reasonEl = $("redeem-reason");
        const legalCheck = $("redeem-legal-check");
        const btnRedeem = $("btn-redeem-submit");
        setPricingPanelState("redeem-premium-plans", false);
        if (reasonEl && reason) reasonEl.textContent = reason;
        if (legalCheck) legalCheck.checked = false;
        if (btnRedeem) btnRedeem.disabled = true;
        if (modal) modal.style.display = "flex";
    };

    const closeRedeemModal = () => {
        const modal = $("redeem-modal");
        setPricingPanelState("redeem-premium-plans", false);
        if (modal) modal.style.display = "none";
    };

    const openPremiumWelcomeModal = () => {
        const modal = $("premium-welcome-modal");
        if (modal) modal.style.display = "flex";
    };

    const closePremiumWelcomeModal = () => {
        const modal = $("premium-welcome-modal");
        if (modal) modal.style.display = "none";
    };

    const REPORT_CATEGORY_LABELS = {
        clasificacion: "Error de clasificacion (tema)",
        especialidad: "Error de especialidad",
        respuesta: "Respuesta incorrecta",
        opciones: "Opciones o redaccion",
        duplicado: "Pregunta duplicada",
        caso: "Caso incompleto o inconsistente",
        otro: "Otro"
    };

    const getReportCategoryLabel = (key) => {
        return REPORT_CATEGORY_LABELS[key] || "Otro";
    };

    const sanitizeReportText = (value, fallback = "") => {
        if (value === undefined || value === null) return fallback;
        return String(value);
    };

    const buildCloudReportPayload = (report = {}) => {
        const ts = Number(report.timestamp);
        return {
            timestamp: Number.isFinite(ts) && ts > 0 ? ts : Date.now(),
            questionText: sanitizeReportText(report.questionText),
            caseText: sanitizeReportText(report.caseText),
            specialty: sanitizeReportText(report.specialty),
            tema: sanitizeReportText(report.tema),
            category: sanitizeReportText(report.category),
            reason: sanitizeReportText(report.reason),
            caseKey: sanitizeReportText(report.caseKey),
            userName: sanitizeReportText(report.userName, "Anonimo"),
            userId: sanitizeReportText(report.userId),
            status: sanitizeReportText(report.status, "quarantine"),
            clientReportId: sanitizeReportText(report.id)
        };
    };

    const markLocalReportAsCloudSynced = (reportId, cloudId) => {
        const targetId = String(reportId || "");
        const applyMark = (list) => (list || []).map((item) => {
            if (!item || String(item.id || "") !== targetId) return item;
            return { ...item, cloudSynced: true, cloudId: cloudId || item.cloudId || targetId };
        });
        State.reportedQuestionsLocal = applyMark(State.reportedQuestionsLocal);
        State.reportedQuestions = applyMark(State.reportedQuestions);
    };

    const uploadReportToCloud = async (report) => {
        if (!report) throw new Error("invalid_report");
        if (!window.FB || !window.FB.db || !window.FB.doc || !window.FB.setDoc) {
            throw new Error("firebase_not_ready");
        }
        if (!window.FB.auth || !window.FB.auth.currentUser) {
            throw new Error("auth_required");
        }
        const cloudId = sanitizeReportText(report.id || `report-${Date.now()}-${Math.floor(Math.random() * 100000)}`);
        const payload = buildCloudReportPayload({ ...report, id: cloudId });
        await window.FB.setDoc(window.FB.doc(window.FB.db, "reports", cloudId), payload, { merge: true });
        return cloudId;
    };

    const syncPendingReportsToCloud = async () => {
        if (!window.FB || !window.FB.auth || !window.FB.auth.currentUser) return;
        const pending = (State.reportedQuestionsLocal || []).filter(r => r && r.source === "local" && !r.cloudSynced);
        if (pending.length === 0) return;

        let syncedAny = false;
        for (const report of pending) {
            try {
                const cloudId = await uploadReportToCloud(report);
                markLocalReportAsCloudSynced(report.id, cloudId);
                syncedAny = true;
            } catch (err) {
                console.error("Error sincronizando reporte pendiente:", err);
            }
        }

        if (syncedAny) {
            saveGlobalStats();
            if (State.view === "view-reportes") renderReportedQuestions();
        }
    };

    const handleReportCloudError = (err) => {
        console.error("Error guardando reporte en la nube:", err);
        const msg = String((err && (err.code || err.message)) || "").toLowerCase();
        if (msg.includes("permission-denied") || msg.includes("missing or insufficient permissions")) {
            showNotification("Reporte guardado localmente, pero sin permisos para subirlo a la nube.", "warning");
            return;
        }
        showNotification("Reporte guardado localmente. No se pudo sincronizar con la nube.", "warning");
    };

    // ---------------------------------------------------------------------------
    // Case Reclassification (manual topic overrides)
    // ---------------------------------------------------------------------------
    const RECLASS_STORAGE_KEY = "enarm_case_reclass";
    const CASE_OVERRIDES_CACHE_KEY = "enarm_case_overrides_cache";
    const CASE_OVERRIDES_COLLECTION = "case_overrides";

    const normalizeCaseText = (text) => {
        if (!text) return "";
        return String(text)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    };

    const normalizeTopicKey = (text) => {
        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    };

    const hashString = (str) => {
        let h = 5381;
        for (let i = 0; i < str.length; i++) {
            h = ((h << 5) + h) + str.charCodeAt(i);
            h |= 0;
        }
        return (h >>> 0).toString(36);
    };

    const getCaseSourceText = (q) => {
        if (!q) return "";
        if (q.case && String(q.case).trim()) return String(q.case);
        if (q.question && String(q.question).trim()) return String(q.question);
        return "";
    };

    const getCaseKey = (q) => {
        if (!q) return "";
        if (q._caseKey) return q._caseKey;
        const base = normalizeCaseText(getCaseSourceText(q));
        if (!base) return "";
        q._caseKey = hashString(base);
        return q._caseKey;
    };

    const escapeHtml = (str) => {
        return String(str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#39;");
    };

    const getCaseSnippet = (text, maxLen = 180) => {
        const clean = String(text || "").replace(/\s+/g, " ").trim();
        if (clean.length <= maxLen) return clean;
        return clean.slice(0, Math.max(0, maxLen - 3)) + "...";
    };

    const getCaseKeyFromText = (caseText, questionText) => {
        const base = normalizeCaseText(caseText || questionText || "");
        return base ? hashString(base) : "";
    };

    const dedupeReports = (reports) => {
        const seenIds = new Set();
        const seenSemantic = new Set();
        const out = [];
        (reports || []).forEach(r => {
            if (!r) return;
            const id = String(r.id || r.reportId || r.cloudId || "");
            const semantic = r.caseKey ? `${r.caseKey}|${r.category || ""}|${r.userId || r.userName || ""}|${r.timestamp || ""}` : "";
            if (id && seenIds.has(id)) return;
            if (semantic && seenSemantic.has(semantic)) return;
            if (id) seenIds.add(id);
            if (semantic) seenSemantic.add(semantic);
            out.push(r);
        });
        return out;
    };

    const mergeCloudAndLocalReports = () => {
        const cloudReports = (State.reportedQuestions || []).filter(r => r && r.source === "cloud");
        const localReports = (State.reportedQuestionsLocal || [])
            .filter(Boolean)
            .map(r => ({ ...r, source: r.source || "local" }));
        State.reportedQuestions = dedupeReports([...cloudReports, ...localReports]);
    };

    const refreshQuarantineKeys = () => {
        const keys = new Set();
        (State.reportedQuestions || []).forEach(r => {
            const key = r.caseKey || getCaseKeyFromText(r.caseText, r.questionText);
            if (key) keys.add(key);
        });
        State.quarantineKeys = keys;
    };

    const DELETED_CASES_KEY = "enarm_deleted_cases";

    const loadDeletedCases = () => {
        try {
            const raw = localStorage.getItem(DELETED_CASES_KEY);
            const arr = raw ? JSON.parse(raw) : [];
            State.deletedCaseKeys = new Set(Array.isArray(arr) ? arr : []);
        } catch (e) {
            State.deletedCaseKeys = new Set();
        }
    };

    const saveDeletedCases = () => {
        const arr = Array.from(State.deletedCaseKeys || []);
        localStorage.setItem(DELETED_CASES_KEY, JSON.stringify(arr));
    };

    const removeCaseFromCurrentExam = (caseKey) => {
        if (!caseKey || !Array.isArray(State.questionSet) || State.questionSet.length === 0) return false;
        const indicesToRemove = [];
        State.questionSet.forEach((q, idx) => {
            if (getCaseKey(q) === caseKey) indicesToRemove.push(idx);
        });
        if (indicesToRemove.length === 0) return false;

        const originalSet = State.questionSet;
        State.questionSet = originalSet.filter(q => getCaseKey(q) !== caseKey);
        if (Array.isArray(State.answers)) {
            State.answers = State.answers.filter((_, idx) => getCaseKey(originalSet[idx]) !== caseKey);
        }

        const removedBefore = indicesToRemove.filter(i => i < State.currentIndex).length;
        State.currentIndex = Math.max(0, State.currentIndex - removedBefore);
        if (State.currentIndex >= State.questionSet.length) {
            State.currentIndex = Math.max(0, State.questionSet.length - 1);
        }
        return true;
    };

    const deleteCaseKey = (caseKey, options = {}) => {
        if (!caseKey) return false;
        const { removeFromCurrentExam = false } = options;
        if (!State.deletedCaseKeys) State.deletedCaseKeys = new Set();
        if (!State.deletedCaseKeys.has(caseKey)) {
            State.deletedCaseKeys.add(caseKey);
            saveDeletedCases();
        }
        State.reclassMap = applyCaseReclassifications();
        if (State.questionSet) applyCaseReclassificationsToSet(State.questionSet, State.reclassMap);
        if (removeFromCurrentExam) removeCaseFromCurrentExam(caseKey);
        return true;
    };

    const filterQuarantinedPool = (pool) => {
        const hasQuarantine = State.quarantineKeys && State.quarantineKeys.size > 0;
        const hasDeleted = State.deletedCaseKeys && State.deletedCaseKeys.size > 0;
        if (!hasQuarantine && !hasDeleted) return pool;
        return pool.filter(q => {
            const key = getCaseKey(q);
            if (!key) return true;
            if (hasQuarantine && State.quarantineKeys.has(key)) return false;
            if (hasDeleted && State.deletedCaseKeys.has(key)) return false;
            return true;
        });
    };

    const getSpecialtyLabel = (key) => {
        if (!key) return "Sin especialidad";
        return State.globalStats?.bySpecialty?.[key]?.name || key;
    };

    const loadCaseReclassMap = () => {
        if (State.caseOverrideMap && typeof State.caseOverrideMap === "object") {
            return State.caseOverrideMap;
        }
        try {
            const rawCache = localStorage.getItem(CASE_OVERRIDES_CACHE_KEY);
            if (rawCache) {
                const parsedCache = JSON.parse(rawCache);
                State.caseOverrideMap = parsedCache && typeof parsedCache === "object" ? parsedCache : {};
                return State.caseOverrideMap;
            }
            const rawLegacy = localStorage.getItem(RECLASS_STORAGE_KEY);
            const parsedLegacy = rawLegacy ? JSON.parse(rawLegacy) : {};
            State.caseOverrideMap = parsedLegacy && typeof parsedLegacy === "object" ? parsedLegacy : {};
            return State.caseOverrideMap;
        } catch (e) {
            console.warn("No se pudo leer reclasificaciones:", e);
            State.caseOverrideMap = {};
            return State.caseOverrideMap;
        }
    };

    const saveCaseReclassMap = (map) => {
        const safeMap = map && typeof map === "object" ? map : {};
        State.caseOverrideMap = safeMap;
        localStorage.setItem(CASE_OVERRIDES_CACHE_KEY, JSON.stringify(safeMap));
        localStorage.setItem(RECLASS_STORAGE_KEY, JSON.stringify(safeMap));
    };

    const normalizeCaseOverrideEntry = (entry = {}) => {
        const out = {};
        const tema = entry.tema ? String(entry.tema).trim() : "";
        const specialty = entry.specialty ? String(entry.specialty).trim() : "";
        const caseText = entry.caseText ? String(entry.caseText).trim() : "";
        if (tema) out.tema = getUnifiedTopicName(tema);
        if (specialty) out.specialty = specialty;
        if (caseText) out.caseText = caseText;
        if (entry.originalTema) out.originalTema = String(entry.originalTema);
        if (entry.originalSpec) out.originalSpec = String(entry.originalSpec);
        if (entry.label) out.label = String(entry.label).slice(0, 220);
        if (entry.updatedBy) out.updatedBy = String(entry.updatedBy);
        if (entry.updatedAt) out.updatedAt = entry.updatedAt;
        return out;
    };

    const applyCaseOverridesEverywhere = () => {
        invalidateTopicIndex();
        State.reclassMap = applyCaseReclassifications();
        if (State.questionSet) applyCaseReclassificationsToSet(State.questionSet, State.reclassMap);
        if (State.view === "view-reclassify") {
            refreshReclassData();
            renderReclassifyList();
            updateReclassSelection();
        }
        if (State.examActive && State.view === "view-exam") {
            renderExamQuestion();
        }
    };

    const bindCaseOverridesListener = () => {
        if (!window.FB || !window.FB.db || !window.FB.onSnapshot || !window.FB.collection) return;
        if (State.caseOverridesUnsub) {
            State.caseOverridesUnsub();
            State.caseOverridesUnsub = null;
        }
        const ref = window.FB.collection(window.FB.db, CASE_OVERRIDES_COLLECTION);
        State.caseOverridesUnsub = window.FB.onSnapshot(ref, (snap) => {
            const map = {};
            snap.forEach((docSnap) => {
                const data = docSnap.data() || {};
                const key = (data.caseKey || docSnap.id || "").trim();
                if (!key) return;
                map[key] = normalizeCaseOverrideEntry(data);
            });
            saveCaseReclassMap(map);
            applyCaseOverridesEverywhere();
        }, (err) => {
            console.error("No se pudo sincronizar case_overrides:", err);
        });
    };

    const upsertCaseOverrideCloud = async (caseKey, entry) => {
        if (!caseKey) throw new Error("invalid_case_key");
        if (!canReclassifyUser()) throw new Error("admin_only");
        if (!window.FB || !window.FB.db) throw new Error("firebase_not_ready");
        const payload = {
            caseKey,
            ...normalizeCaseOverrideEntry(entry),
            updatedBy: State.currentUid || "",
            updatedAt: new Date()
        };
        const ref = window.FB.doc(window.FB.db, CASE_OVERRIDES_COLLECTION, caseKey);
        await window.FB.setDoc(ref, payload, { merge: false });
    };

    const removeCaseOverrideCloud = async (caseKey) => {
        if (!caseKey) throw new Error("invalid_case_key");
        if (!canReclassifyUser()) throw new Error("admin_only");
        if (!window.FB || !window.FB.db || !window.FB.deleteDoc) throw new Error("firebase_not_ready");
        const ref = window.FB.doc(window.FB.db, CASE_OVERRIDES_COLLECTION, caseKey);
        await window.FB.deleteDoc(ref);
    };

    const applyCaseReclassifications = () => {
        if (typeof QUESTIONS === "undefined" || !Array.isArray(QUESTIONS)) return {};
        const map = loadCaseReclassMap();
        QUESTIONS.forEach(q => {
            if (!q) return;
            if (q.temaOriginal === undefined) q.temaOriginal = q.tema || "";
            if (q.specialtyOriginal === undefined) q.specialtyOriginal = q.specialty || "";
            if (q.caseOriginal === undefined) q.caseOriginal = q.case || "";
            const key = getCaseKey(q);
            if (!key) return;
            const entry = map[key];
            if (entry && entry.tema) q.tema = entry.tema;
            else if (q.temaOriginal !== undefined) q.tema = q.temaOriginal;
            if (entry && entry.specialty) q.specialty = normalizeSpecialtyToTroncal({ ...q, specialty: entry.specialty });
            else if (q.specialtyOriginal !== undefined) q.specialty = normalizeSpecialtyToTroncal({ ...q, specialty: q.specialtyOriginal });
            if (entry && entry.caseText) q.case = entry.caseText;
            else if (q.caseOriginal !== undefined) q.case = q.caseOriginal;
            q.temaCanonical = getCaseCanonicalTopic(q);
            if (!sanitizeTopicLabel(q.tema)) q.tema = q.temaCanonical;
            if (!sanitizeTopicLabel(q.subtema)) q.subtema = q.temaCanonical;
        });
        invalidateTopicIndex();
        return map;
    };

    const applyCaseReclassificationsToSet = (set, mapOverride) => {
        if (!Array.isArray(set)) return;
        const map = mapOverride || loadCaseReclassMap();
        set.forEach(q => {
            if (!q) return;
            if (q.temaOriginal === undefined) q.temaOriginal = q.tema || "";
            if (q.specialtyOriginal === undefined) q.specialtyOriginal = q.specialty || "";
            if (q.caseOriginal === undefined) q.caseOriginal = q.case || "";
            const key = getCaseKey(q);
            if (!key) return;
            const entry = map[key];
            if (entry && entry.tema) q.tema = entry.tema;
            else if (q.temaOriginal !== undefined) q.tema = q.temaOriginal;
            if (entry && entry.specialty) q.specialty = normalizeSpecialtyToTroncal({ ...q, specialty: entry.specialty });
            else if (q.specialtyOriginal !== undefined) q.specialty = normalizeSpecialtyToTroncal({ ...q, specialty: q.specialtyOriginal });
            if (entry && entry.caseText) q.case = entry.caseText;
            else if (q.caseOriginal !== undefined) q.case = q.caseOriginal;
            q.temaCanonical = getCaseCanonicalTopic(q);
            if (!sanitizeTopicLabel(q.tema)) q.tema = q.temaCanonical;
            if (!sanitizeTopicLabel(q.subtema)) q.subtema = q.temaCanonical;
        });
    };

    const canReclassifyUser = () => {
        return isAdminUser();
    };

    const syncReclassAccessUI = () => {
        const allowed = canReclassifyUser();
        const item = $("mas-reclass-item");
        if (item) item.style.display = allowed ? "flex" : "none";
        const broadcastItem = $("mas-community-broadcast-item");
        if (broadcastItem) broadcastItem.style.display = allowed ? "flex" : "none";
        const feedbackAdminItem = $("mas-feedback-admin-item");
        if (feedbackAdminItem) feedbackAdminItem.style.display = allowed ? "flex" : "none";
        const content = $("reclassify-content");
        const locked = $("reclassify-locked");
        if (content) content.style.display = allowed ? "block" : "none";
        if (locked) locked.style.display = allowed ? "none" : "block";
        const deleteBtn = $("btn-reclass-delete");
        if (deleteBtn) deleteBtn.style.display = allowed ? "inline-flex" : "none";
        const feedbackContent = $("feedback-admin-content");
        const feedbackLocked = $("feedback-admin-locked");
        if (feedbackContent) feedbackContent.style.display = allowed ? "block" : "none";
        if (feedbackLocked) feedbackLocked.style.display = allowed ? "none" : "block";
    };

    const refreshReclassData = () => {
        if (typeof QUESTIONS === "undefined" || !Array.isArray(QUESTIONS)) return;
        const caseMap = new Map();
        QUESTIONS.forEach(q => {
            const key = getCaseKey(q);
            if (!key) return;
            if (!caseMap.has(key)) {
                caseMap.set(key, {
                    key,
                    caseText: getCaseSourceText(q),
                    specialty: q.specialty || "",
                    tema: q.tema || "",
                    temaOriginal: q.temaOriginal !== undefined ? q.temaOriginal : (q.tema || ""),
                    specialtyOriginal: q.specialtyOriginal !== undefined ? q.specialtyOriginal : (q.specialty || "")
                });
            }
        });
        State.reclassCases = Array.from(caseMap.values());
        State.reclassTemaByKey = {};
        State.reclassOriginalTemaByKey = {};
        State.reclassSpecialtyByKey = {};
        State.reclassOriginalSpecialtyByKey = {};
        State.reclassCases.forEach(c => {
            State.reclassTemaByKey[c.key] = c.tema || "";
            State.reclassOriginalTemaByKey[c.key] = c.temaOriginal !== undefined ? c.temaOriginal : (c.tema || "");
            State.reclassSpecialtyByKey[c.key] = c.specialty || "";
            State.reclassOriginalSpecialtyByKey[c.key] = c.specialtyOriginal !== undefined ? c.specialtyOriginal : (c.specialty || "");
        });
    };

    const populateReclassSelects = () => {
        const temaSelect = $("reclass-tema-select");
        const temaFilter = $("reclass-tema-filter");
        const specSelect = $("reclass-spec-select");
        const official = [...new Set(OFFICIAL_TEMARIO || [])].sort();
        if (temaSelect && !temaSelect.dataset.ready) {
            temaSelect.innerHTML = `<option value="">Selecciona un tema...</option>` +
                official.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join("");
            temaSelect.dataset.ready = "1";
        }
        if (temaFilter && !temaFilter.dataset.ready) {
            temaFilter.innerHTML = `<option value="__all__">Todos los temas</option>` +
                `<option value="__reclass__">Solo reclasificados</option>` +
                official.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join("");
            temaFilter.dataset.ready = "1";
        }
        if (specSelect && !specSelect.dataset.ready) {
            specSelect.innerHTML = `
                <option value="">Mantener especialidad</option>
                <option value="mi">Medicina Interna</option>
                <option value="ped">Pediatria</option>
                <option value="gyo">Ginecologia y Obstetricia</option>
                <option value="cir">Cirugia General</option>
            `;
            specSelect.dataset.ready = "1";
        }
    };

    const updateReclassSelection = () => {
        const selectedEl = $("reclass-selected-case");
        const metaEl = $("reclass-selected-meta");
        const temaSelect = $("reclass-tema-select");
        const specSelect = $("reclass-spec-select");
        const caseTextInput = $("reclass-case-text");
        const removeBtn = $("btn-reclass-remove");
        const applyBtn = $("btn-reclass-apply");
        const deleteBtn = $("btn-reclass-delete");

        if (!selectedEl || !metaEl || !temaSelect || !specSelect || !caseTextInput) return;

        const key = State.reclassSelectedKey;
        if (!key) {
            selectedEl.textContent = "Selecciona un caso en la lista.";
            metaEl.textContent = "";
            caseTextInput.value = "";
            caseTextInput.disabled = true;
            if (removeBtn) removeBtn.disabled = true;
            if (applyBtn) applyBtn.disabled = true;
            if (deleteBtn) deleteBtn.disabled = true;
            return;
        }

        const entry = State.reclassCases.find(c => c.key === key);
        const currentTema = State.reclassTemaByKey[key] || "";
        const originalTema = State.reclassOriginalTemaByKey[key] || "";
        const mapEntry = State.reclassMap ? State.reclassMap[key] : null;
        const currentSpec = State.reclassSpecialtyByKey[key] || "";
        const originalSpec = State.reclassOriginalSpecialtyByKey[key] || "";
        const isDeleted = State.deletedCaseKeys && State.deletedCaseKeys.has(key);
        const effectiveCaseText = mapEntry?.caseText || (entry ? entry.caseText : "");

        selectedEl.textContent = entry ? getCaseSnippet(effectiveCaseText, 600) : "Caso no encontrado.";

        let meta = `Tema actual: ${currentTema || "Sin tema"}`;
        if (originalTema && originalTema !== currentTema) meta += ` | Original: ${originalTema}`;
        if (mapEntry && mapEntry.tema) meta += ` | Reclasificado a: ${mapEntry.tema}`;
        meta += ` | Especialidad actual: ${getSpecialtyLabel(currentSpec)}`;
        if (originalSpec && originalSpec !== currentSpec) meta += ` | Especialidad original: ${getSpecialtyLabel(originalSpec)}`;
        if (mapEntry && mapEntry.specialty) meta += ` | Especialidad reclasificada: ${getSpecialtyLabel(mapEntry.specialty)}`;
        if (mapEntry && mapEntry.caseText) meta += " | Texto del caso editado";
        if (isDeleted) meta += " | Eliminado del banco";
        metaEl.textContent = meta;

        caseTextInput.value = effectiveCaseText || "";
        caseTextInput.disabled = !!isDeleted;
        if (temaSelect) temaSelect.value = mapEntry?.tema || "";
        if (specSelect) specSelect.value = mapEntry?.specialty || currentSpec || "";
        if (removeBtn) removeBtn.disabled = isDeleted || !mapEntry;
        if (applyBtn) applyBtn.disabled = isDeleted ? true : false;
        if (deleteBtn) deleteBtn.disabled = !!isDeleted;
    };

    const renderReclassifyList = () => {
        const list = $("reclass-list");
        if (!list) return;
        const filterInput = $("reclass-filter");
        const temaFilter = $("reclass-tema-filter");
        const countEl = $("reclass-count");

        const map = State.reclassMap || {};
        const search = normalizeCaseText(filterInput ? filterInput.value : "");
        const temaVal = temaFilter ? temaFilter.value : "__all__";

        let cases = State.reclassCases || [];
        const filtered = cases.filter(c => {
            if (State.deletedCaseKeys && State.deletedCaseKeys.has(c.key)) return false;
            const currentTema = State.reclassTemaByKey[c.key] || "";
            if (temaVal === "__reclass__" && !map[c.key]) return false;
            if (temaVal !== "__all__" && temaVal !== "__reclass__" && currentTema !== temaVal) return false;
            if (search) {
                const hay = normalizeCaseText(`${c.caseText || ""} ${currentTema || ""}`);
                if (!hay.includes(search)) return false;
            }
            return true;
        });

        list.innerHTML = "";

        filtered.forEach(c => {
            const currentTema = State.reclassTemaByKey[c.key] || "Sin tema";
            const currentSpec = State.reclassSpecialtyByKey[c.key] || "";
            const isSelected = State.reclassSelectedKey === c.key;
            const isReclassed = !!map[c.key];
            const hasTextEdit = !!(map[c.key] && map[c.key].caseText);
            const item = document.createElement("div");
            item.className = "list-item";
            item.style.cursor = "pointer";
            if (isSelected) item.style.borderColor = "var(--accent-green)";

            const badgeLabel = isReclassed ? (hasTextEdit ? "Reclasificado + Texto" : "Reclasificado") : "Original";
            const badgeStyle = isReclassed
                ? "background:rgba(5,192,127,0.15); color:var(--accent-green); border:1px solid rgba(5,192,127,0.35);"
                : "background:rgba(255,255,255,0.06); color:var(--text-muted); border:1px solid rgba(255,255,255,0.08);";

            item.innerHTML = `
                <div class="list-item-content" style="min-width: 0;">
                    <h3 style="margin-bottom:4px; font-size:14px;">${escapeHtml(currentTema)}</h3>
                    <p style="margin:0; color: var(--text-secondary); font-size: 12px;">${escapeHtml(getSpecialtyLabel(currentSpec))}</p>
                    <p style="margin:0; margin-top:4px;">${escapeHtml(getCaseSnippet(c.caseText, 220))}</p>
                </div>
                <span class="badge" style="${badgeStyle}">${badgeLabel}</span>
            `;

            item.addEventListener("click", () => {
                State.reclassSelectedKey = c.key;
                renderReclassifyList();
                updateReclassSelection();
            });

            list.appendChild(item);
        });

        if (countEl) countEl.textContent = `${filtered.length} casos`;
    };

    const renderReclassifyView = async () => {
        syncReclassAccessUI();
        if (!canReclassifyUser()) return;
        try {
            await ensureQuestionsReady({ silent: false });
        } catch (err) {
            return;
        }
        State.reclassMap = applyCaseReclassifications();
        refreshReclassData();
        populateReclassSelects();
        renderReclassifyList();
        updateReclassSelection();
    };

    const initReclassifyLogic = () => {
        if (State.reclassInitialized) return;
        State.reclassInitialized = true;

        const filterInput = $("reclass-filter");
        const temaFilter = $("reclass-tema-filter");
        const clearBtn = $("btn-reclass-clear-filter");
        const applyBtn = $("btn-reclass-apply");
        const removeBtn = $("btn-reclass-remove");
        const deleteBtn = $("btn-reclass-delete");
        const temaSelect = $("reclass-tema-select");
        const specSelect = $("reclass-spec-select");
        const caseTextInput = $("reclass-case-text");

        if (filterInput) filterInput.addEventListener("input", renderReclassifyList);
        if (temaFilter) temaFilter.addEventListener("change", renderReclassifyList);
        if (caseTextInput) {
            caseTextInput.addEventListener("input", () => {
                const preview = $("reclass-selected-case");
                if (!preview) return;
                preview.textContent = getCaseSnippet(caseTextInput.value || "", 600);
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                if (filterInput) filterInput.value = "";
                if (temaFilter) temaFilter.value = "__all__";
                renderReclassifyList();
            });
        }

        if (applyBtn) {
            applyBtn.addEventListener("click", async () => {
                if (!canReclassifyUser()) {
                    showNotification("Solo admin puede usar el reclasificador.", "warning");
                    return;
                }
                if (!State.reclassSelectedKey) {
                    showNotification("Selecciona un caso primero.", "warning");
                    return;
                }
                const temaInput = temaSelect ? temaSelect.value.trim() : "";
                const map = loadCaseReclassMap();
                const originalTema = State.reclassOriginalTemaByKey[State.reclassSelectedKey] || "";
                const originalSpec = State.reclassOriginalSpecialtyByKey[State.reclassSelectedKey] || "";
                const caseEntry = State.reclassCases.find(c => c.key === State.reclassSelectedKey);
                const selectedSpec = specSelect ? specSelect.value.trim() : "";
                const editedCaseText = caseTextInput ? caseTextInput.value.trim() : "";
                const currentTema = State.reclassTemaByKey[State.reclassSelectedKey] || "";
                const currentSpec = State.reclassSpecialtyByKey[State.reclassSelectedKey] || "";
                const resolvedTema = temaInput || currentTema;
                const resolvedSpec = selectedSpec || currentSpec;
                const baseCaseText = caseEntry ? String(caseEntry.caseText || "").trim() : "";
                const resolvedCaseText = editedCaseText || baseCaseText;
                const nextEntry = {
                    tema: resolvedTema ? getUnifiedTopicName(resolvedTema) : "",
                    originalTema,
                    specialty: resolvedSpec || "",
                    originalSpec,
                    caseText: resolvedCaseText || "",
                    label: caseEntry ? getCaseSnippet(caseEntry.caseText, 140) : "",
                    updatedAt: Date.now()
                };
                const changedTema = !!temaInput && normalizeTopicKey(resolvedTema) !== normalizeTopicKey(currentTema);
                const changedSpec = !!selectedSpec && resolvedSpec !== currentSpec;
                const changedCaseText = !!editedCaseText && editedCaseText !== baseCaseText;
                const currentEntry = normalizeCaseOverrideEntry(map[State.reclassSelectedKey] || {});
                const comparableNext = normalizeCaseOverrideEntry(nextEntry);
                const noChanges =
                    (!map[State.reclassSelectedKey] && !changedTema && !changedSpec && !changedCaseText) ||
                    (currentEntry.tema || "") === (comparableNext.tema || "") &&
                    (currentEntry.specialty || "") === (comparableNext.specialty || "") &&
                    (currentEntry.caseText || "") === (comparableNext.caseText || "");
                if (noChanges) {
                    showNotification("No hay cambios para aplicar.", "warning");
                    return;
                }
                try {
                    applyBtn.disabled = true;
                    await upsertCaseOverrideCloud(State.reclassSelectedKey, nextEntry);
                    map[State.reclassSelectedKey] = comparableNext;
                    saveCaseReclassMap(map);
                    applyCaseOverridesEverywhere();
                    showNotification("Caso actualizado para todos los usuarios.", "success");
                } catch (e) {
                    console.error(e);
                    const msg = (e && e.message) || "";
                    if (msg.includes("permission-denied") || msg.includes("Missing or insufficient permissions")) {
                        showNotification("Firebase bloqueó el cambio. Revisa reglas de case_overrides.", "error");
                    } else {
                        showNotification("No se pudo guardar el cambio global.", "error");
                    }
                } finally {
                    applyBtn.disabled = false;
                }
            });
        }

        if (removeBtn) {
            removeBtn.addEventListener("click", async () => {
                if (!canReclassifyUser()) {
                    showNotification("Solo admin puede usar el reclasificador.", "warning");
                    return;
                }
                if (!State.reclassSelectedKey) return;
                const map = loadCaseReclassMap();
                if (!map[State.reclassSelectedKey]) {
                    showNotification("Este caso no tiene reclasificacion.", "info");
                    return;
                }
                try {
                    removeBtn.disabled = true;
                    await removeCaseOverrideCloud(State.reclassSelectedKey);
                    delete map[State.reclassSelectedKey];
                    saveCaseReclassMap(map);
                    applyCaseOverridesEverywhere();
                    showNotification("Cambio global eliminado.", "success");
                } catch (e) {
                    console.error(e);
                    const msg = (e && e.message) || "";
                    if (msg.includes("permission-denied") || msg.includes("Missing or insufficient permissions")) {
                        showNotification("Firebase bloqueó el cambio. Revisa reglas de case_overrides.", "error");
                    } else {
                        showNotification("No se pudo eliminar el cambio global.", "error");
                    }
                } finally {
                    removeBtn.disabled = false;
                }
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener("click", () => {
                if (!canReclassifyUser()) {
                    showNotification("Solo admin puede usar el reclasificador.", "warning");
                    return;
                }
                if (!State.reclassSelectedKey) {
                    showNotification("Selecciona un caso primero.", "warning");
                    return;
                }
                const key = State.reclassSelectedKey;
                if (State.deletedCaseKeys && State.deletedCaseKeys.has(key)) {
                    showNotification("Este caso ya esta eliminado.", "info");
                    return;
                }
                if (!confirm("¿Eliminar este caso del banco de preguntas? Esta accion no se puede deshacer.")) return;
                deleteCaseKey(key);
                State.reclassSelectedKey = null;
                refreshReclassData();
                renderReclassifyList();
                updateReclassSelection();
                showNotification("Caso eliminado del banco.", "success");
            });
        }
    };

    // ---------------------------------------------------------------------------
    // Feedback helpers
    // ---------------------------------------------------------------------------
    const FEEDBACK_EMAIL = "soporte@enarm-lab.com";

    const buildFeedbackText = () => {
        const name = $("feedback-name")?.value?.trim() || "";
        const email = $("feedback-email")?.value?.trim() || "";
        const type = $("feedback-type")?.value?.trim() || "General";
        const message = $("feedback-message")?.value?.trim() || "";

        const lines = [];
        if (name) lines.push(`Nombre: ${name}`);
        if (email) lines.push(`Email: ${email}`);
        if (type) lines.push(`Tipo: ${type}`);
        if (message) lines.push(`Mensaje:\n${message}`);
        return lines.join("\n");
    };

    const openFeedbackEmail = () => {
        const message = $("feedback-message")?.value?.trim() || "";
        const type = $("feedback-type")?.value?.trim() || "General";
        if (!message) {
            showNotification("Escribe un mensaje de feedback.", "warning");
            return;
        }
        const subject = `Feedback ENARM Lab - ${type}`;
        const body = buildFeedbackText();
        const mailto = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
    };

    const renderAdminFeedbackInbox = () => {
        const list = $("feedback-admin-list");
        if (!list) return;
        if (!isAdminUser()) {
            list.innerHTML = "";
            return;
        }
        const rows = Array.isArray(State.feedbackInbox) ? State.feedbackInbox : [];
        if (rows.length === 0) {
            list.innerHTML = `<div class="list-item empty-history"><p style="color:var(--text-muted); padding: 20px;">No hay feedback recibido aún.</p></div>`;
            return;
        }

        list.innerHTML = rows.map((item) => {
            const createdAt = Number(item.createdAt || 0);
            const createdLabel = createdAt > 0
                ? new Date(createdAt).toLocaleString("es-MX")
                : "Sin fecha";
            const fromName = escapeHtml(item.name || item.createdByName || "Anónimo");
            const fromEmail = escapeHtml(item.email || "Sin email");
            const type = escapeHtml(item.type || "General");
            const message = escapeHtml(item.message || "").replace(/\n/g, "<br>");

            return `
                <div class="list-item" style="border-left: 4px solid var(--accent-green);">
                    <div class="list-item-content" style="gap:8px; display:flex; flex-direction:column;">
                        <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;">
                            <h3 style="margin:0;">${fromName}</h3>
                            <span style="font-size:12px; color:var(--text-muted);">${createdLabel}</span>
                        </div>
                        <p style="margin:0; color:var(--text-muted); font-size:13px;">Tipo: <strong>${type}</strong></p>
                        <p style="margin:0; color:var(--text-muted); font-size:13px;">Email: ${fromEmail}</p>
                        <div style="padding:12px; border:1px solid var(--border); border-radius:10px; background:rgba(255,255,255,0.03); line-height:1.45;">
                            ${message || "(Sin mensaje)"}
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    };

    const initFeedbackAdminInbox = () => {
        if (!isAdminUser()) {
            if (State.feedbackAdminUnsub) {
                State.feedbackAdminUnsub();
                State.feedbackAdminUnsub = null;
            }
            State.feedbackInbox = [];
            renderAdminFeedbackInbox();
            return;
        }
        if (State.feedbackAdminUnsub) return;
        if (!window.FB || !window.FB.db || !window.FB.auth || !window.FB.auth.currentUser) return;

        const ref = window.FB.collection(window.FB.db, FEEDBACK_COLLECTION);
        const q = window.FB.query(ref, window.FB.orderBy("createdAt", "desc"), window.FB.limit(300));
        State.feedbackAdminUnsub = window.FB.onSnapshot(q, (snap) => {
            const rows = [];
            snap.forEach((doc) => {
                const data = doc.data() || {};
                if (String(data.recipientAdminUid || "") !== ADMIN_INBOX_UID) return;
                rows.push({ id: doc.id, ...data, source: "cloud" });
            });
            State.feedbackInbox = rows;
            renderAdminFeedbackInbox();
        }, (err) => {
            console.error("Error cargando feedback admin:", err);
            const msg = String((err && (err.code || err.message)) || "").toLowerCase();
            if (msg.includes("permission-denied") || msg.includes("missing or insufficient permissions")) {
                showNotification("No tienes permisos para ver feedback en Firebase.", "error");
            }
        });
    };

    const submitFeedback = async () => {
        const name = $("feedback-name")?.value?.trim() || "";
        const email = $("feedback-email")?.value?.trim() || "";
        const type = $("feedback-type")?.value?.trim() || "General";
        const message = $("feedback-message")?.value?.trim() || "";

        if (!message) {
            showNotification("Escribe un mensaje de feedback.", "warning");
            return;
        }
        if (!window.FB || !window.FB.db || !window.FB.addDoc || !window.FB.collection) {
            showNotification("Firebase no está listo. Intenta de nuevo.", "error");
            return;
        }
        if (!window.FB.auth || !window.FB.auth.currentUser) {
            showNotification("Inicia sesión para enviar feedback.", "warning");
            return;
        }

        const btn = document.querySelector("#view-feedback .btn-primary");
        const previousText = btn ? btn.textContent : "";
        if (btn) {
            btn.disabled = true;
            btn.textContent = "Enviando...";
        }

        try {
            await window.FB.addDoc(window.FB.collection(window.FB.db, FEEDBACK_COLLECTION), {
                name,
                email,
                type,
                message: message.slice(0, 2000),
                createdAt: Date.now(),
                createdByUid: window.FB.auth.currentUser.uid,
                createdByName: State.userName || "",
                recipientAdminUid: ADMIN_INBOX_UID,
                status: "new",
                source: "in_app"
            });
            if ($("feedback-message")) $("feedback-message").value = "";
            showNotification("Gracias. Tu feedback fue enviado.", "success");
        } catch (err) {
            console.error("Error enviando feedback:", err);
            const msg = String((err && (err.code || err.message)) || "").toLowerCase();
            if (msg.includes("permission-denied") || msg.includes("missing or insufficient permissions")) {
                showNotification("No tienes permiso para enviar feedback.", "error");
            } else {
                showNotification("No se pudo enviar el feedback.", "error");
            }
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = previousText || "Enviar feedback";
            }
        }
    };

    const copyFeedbackToClipboard = async () => {
        const text = buildFeedbackText();
        const message = $("feedback-message")?.value?.trim() || "";
        if (!message) {
            showNotification("Escribe un mensaje de feedback.", "warning");
            return;
        }
        try {
            await navigator.clipboard.writeText(text);
            showNotification("Feedback copiado.", "success");
        } catch (err) {
            const temp = document.createElement("textarea");
            temp.value = text;
            temp.style.position = "fixed";
            temp.style.opacity = "0";
            document.body.appendChild(temp);
            temp.select();
            try {
                document.execCommand("copy");
                showNotification("Feedback copiado.", "success");
            } catch (e) {
                showNotification("No se pudo copiar el feedback.", "error");
            }
            document.body.removeChild(temp);
        }
    };

    const initCommunityBroadcastLogic = () => {
        const item = $("mas-community-broadcast-item");
        const modal = $("community-broadcast-modal");
        const btnClose = $("btn-close-community-broadcast");
        const btnCancel = $("btn-cancel-community-broadcast");
        const btnSend = $("btn-send-community-broadcast");
        const titleInput = $("community-broadcast-title");
        const messageInput = $("community-broadcast-message");

        if (!item || !modal || !btnSend || !titleInput || !messageInput) return;
        messageInput.maxLength = COMMUNITY_ANNOUNCEMENT_MAX_LENGTH;

        const closeModal = () => {
            modal.style.display = "none";
        };

        const openModal = () => {
            if (!isAdminUser()) {
                showNotification("Solo admin puede enviar avisos globales.", "warning");
                return;
            }
            titleInput.value = "";
            messageInput.value = "";
            modal.style.display = "flex";
            setTimeout(() => titleInput.focus(), 30);
        };

        item.addEventListener("click", openModal);
        if (btnClose) btnClose.addEventListener("click", closeModal);
        if (btnCancel) btnCancel.addEventListener("click", closeModal);

        btnSend.addEventListener("click", async () => {
            if (!isAdminUser()) {
                showNotification("Solo admin puede enviar avisos globales.", "warning");
                return;
            }
            if (!window.FB || !window.FB.db || !window.FB.auth || !window.FB.auth.currentUser) {
                showNotification("Inicia sesion para enviar avisos.", "warning");
                return;
            }

            const title = (titleInput.value || "").trim() || "Aviso ENARM Lab";
            const message = (messageInput.value || "").trim();
            if (!message) {
                showNotification("Escribe el mensaje del aviso.", "warning");
                return;
            }

            btnSend.disabled = true;
            const previousText = btnSend.textContent;
            btnSend.textContent = "Enviando...";
            try {
                const payload = {
                    title: title.slice(0, 70),
                    message: message.slice(0, COMMUNITY_ANNOUNCEMENT_MAX_LENGTH),
                    createdAt: Date.now(),
                    createdBy: State.currentUid || window.FB.auth.currentUser.uid,
                    createdByName: State.userName || "Admin"
                };
                await window.FB.addDoc(
                    window.FB.collection(window.FB.db, "community_announcements"),
                    payload
                );
                closeModal();
                showNotification("Aviso enviado. Se notificara a la comunidad en breve.", "success");
            } catch (err) {
                console.error("Error enviando aviso global:", err);
                const msg = String((err && (err.code || err.message)) || "").toLowerCase();
                if (msg.includes("permission-denied") || msg.includes("missing or insufficient permissions")) {
                    showNotification("No tienes permiso para enviar avisos globales.", "error");
                } else {
                    showNotification("No se pudo enviar el aviso global.", "error");
                }
            } finally {
                btnSend.disabled = false;
                btnSend.textContent = previousText;
            }
        });
    };

    const showBanner = (title, msg, icon = '&#x1F514;', onClickCallback = null) => {
        let banner = $('global-notif-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'global-notif-banner';
            banner.className = 'notif-banner';
            document.body.appendChild(banner);
        }

        banner.innerHTML = `
            <div class="notif-banner-icon">${icon}</div>
            <div class="notif-banner-content">
                <span class="notif-banner-title">${title}</span>
                <span class="notif-banner-desc">${msg}</span>
            </div>
            <button class="notif-banner-close" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:16px;">&times;</button>
        `;

        banner.style.cursor = onClickCallback ? 'pointer' : 'default';
        banner.onclick = (e) => {
            if (e.target.closest('.notif-banner-close')) return;
            if (onClickCallback) {
                onClickCallback();
                banner.classList.remove('active');
            }
        };

        banner.querySelector('.notif-banner-close').onclick = (e) => {
            e.stopPropagation();
            banner.classList.remove('active');
        };

        setTimeout(() => banner.classList.add('active'), 100);

        if (window._bannerTimer) clearTimeout(window._bannerTimer);
        window._bannerTimer = setTimeout(() => banner.classList.remove('active'), 8000);
    };

    const requestNotificationPermissionOnOpen = async () => {
        if (!("Notification" in window)) return;
        if (notificationPermissionRequestedInSession) return;
        if (Notification.permission !== "default") return;
        notificationPermissionRequestedInSession = true;
        try {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                await registerRemotePushNotifications();
            }
        } catch (err) {
            console.warn("[Notif] No se pudo solicitar permiso:", err);
        }
    };

    const getPushPlatformLabel = () => {
        const ua = navigator.userAgent || "";
        if (/iPhone|iPad|iPod/i.test(ua)) return "ios-web";
        if (/Android/i.test(ua)) return "android-web";
        return "web";
    };

    const buildPushTokenDocId = (uid, token) => {
        let safeToken = "";
        try {
            safeToken = btoa(token).replace(/[+/=]/g, "_");
        } catch (err) {
            safeToken = token.replace(/[^a-zA-Z0-9_-]/g, "_");
        }
        return `${uid}__${safeToken}`.slice(0, 1400);
    };

    const bindForegroundPushListener = async (messaging) => {
        if (!window.FB || typeof window.FB.onMessage !== "function") return;
        if (foregroundPushListenerBound || !messaging) return;
        window.FB.onMessage(messaging, (payload) => {
            const title = payload?.notification?.title || payload?.data?.title || "ENARM Lab";
            const body = payload?.notification?.body || payload?.data?.body || "";
            showSystemNotification(title, body);
        });
        foregroundPushListenerBound = true;
    };

    const registerRemotePushNotifications = async () => {
        if (!window.FB || !window.FB.auth || !window.FB.auth.currentUser) return;
        if (!("Notification" in window) || Notification.permission !== "granted") return;
        if (!("serviceWorker" in navigator)) return;
        if (!window.FB.messagingReady || typeof window.FB.getToken !== "function") return;

        const vapidKey = window.FB.pushConfig && window.FB.pushConfig.vapidKey
            ? String(window.FB.pushConfig.vapidKey).trim()
            : "";

        if (!vapidKey) {
            console.warn("[FCM] Falta configurar pushConfig.vapidKey en index.html");
            return;
        }

        try {
            const messaging = await window.FB.messagingReady;
            if (!messaging) return;

            const swReg = await navigator.serviceWorker.getRegistration() || await navigator.serviceWorker.ready;
            if (!swReg) return;

            const token = await window.FB.getToken(messaging, {
                vapidKey,
                serviceWorkerRegistration: swReg
            });

            if (!token || token === lastRegisteredPushToken) {
                await bindForegroundPushListener(messaging);
                return;
            }

            const uid = window.FB.auth.currentUser.uid;
            const tokenDocId = buildPushTokenDocId(uid, token);
            await window.FB.setDoc(
                window.FB.doc(window.FB.db, PUSH_TOKEN_COLLECTION, tokenDocId),
                {
                    uid,
                    token,
                    enabled: true,
                    platform: getPushPlatformLabel(),
                    userAgent: navigator.userAgent || "",
                    updatedAt: Date.now()
                },
                { merge: true }
            );

            lastRegisteredPushToken = token;
            await bindForegroundPushListener(messaging);
        } catch (err) {
            console.warn("[FCM] No se pudo registrar el dispositivo para push:", err);
        }
    };

    const showSystemNotification = async (title, body) => {
        if (!("Notification" in window)) return;
        if (Notification.permission !== "granted") return;
        const options = {
            body,
            icon: NOTIFICATION_ICON,
            badge: NOTIFICATION_BADGE,
            tag: `enarm-${title}`,
            renotify: true,
            data: { action: "open-notifications-modal" }
        };

        const handleClick = () => {
            try {
                window.focus();
            } catch (e) {
                console.warn("[Notif] No se pudo enfocar la ventana:", e);
            }
            if (typeof window.openNotificationsModal === "function") {
                window.openNotificationsModal();
            }
        };

        try {
            const browserNotification = new Notification(title, options);
            browserNotification.onclick = (event) => {
                if (event && typeof event.preventDefault === "function") {
                    event.preventDefault();
                }
                handleClick();
                browserNotification.close();
            };
            return;
        } catch (err) {
            console.warn("[Notif] Fallo la notificacion directa, probando service worker:", err);
        }

        try {
            if ("serviceWorker" in navigator) {
                const reg = await navigator.serviceWorker.getRegistration() || await navigator.serviceWorker.ready;
                if (reg) {
                    await reg.showNotification(title, options);
                    return;
                }
            }
        } catch (err) {
            console.warn("[Notif] No se pudo mostrar notificacion del sistema:", err);
        }
    };

    const formatTime = (secs) => {
        const h = String(Math.floor(secs / 3600)).padStart(2, "0");
        const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
        const s = String(secs % 60).padStart(2, "0");
        return `${h}:${m}:${s}`;
    };
    const formatPomodoroClockLabel = (secs) => {
        const safeSecs = Math.max(0, Number(secs) || 0);
        const minutes = String(Math.floor(safeSecs / 60)).padStart(2, "0");
        const seconds = String(safeSecs % 60).padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    const shuffleArray = (arr) => {
        const copy = arr.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    };

    const takeRandomItems = (arr, count) => {
        if (!Array.isArray(arr) || arr.length === 0 || count <= 0) return [];
        const copy = arr.slice();
        const limit = Math.min(count, copy.length);
        for (let i = 0; i < limit; i++) {
            const j = i + Math.floor(Math.random() * (copy.length - i));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy.slice(0, limit);
    };

    const REAL_SIM_CONFIG = {
        total: 280,
        timeMin: 450,
        specs: {
            ped: 85,
            mi: 84,
            cir: 56,
            gyo: 55
        },
        difficulty: {
            easy: 70,
            medium: 140,
            hard: 70
        }
    };

    const normalizeDifficultyBucket = (raw) => {
        if (!raw) return "medium";
        const base = raw.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const compact = base.replace(/\s+/g, "");
        if (compact.includes("media-alta") || compact.includes("mediaalta") || compact.includes("mediaalta")) return "hard";
        if (compact.includes("muyalta") || compact.includes("alta")) return "hard";
        if (compact.includes("baja") || compact.includes("facil")) return "easy";
        if (compact.includes("media")) return "medium";
        return "medium";
    };

    const getQuestionDifficultyBucket = (q) => {
        if (!q) return "medium";
        if (!q._difficultyBucket) {
            q._difficultyBucket = normalizeDifficultyBucket(q.difficulty);
        }
        return q._difficultyBucket;
    };

    const buildQuestionsBySpecialty = () => {
        const grouped = {
            ped: [],
            mi: [],
            cir: [],
            gyo: []
        };
        if (typeof QUESTIONS === "undefined" || !Array.isArray(QUESTIONS)) return grouped;
        QUESTIONS.forEach(q => {
            if (!q || !grouped[q.specialty]) return;
            grouped[q.specialty].push(q);
        });
        return grouped;
    };

    const getQuestionsBySpecialty = () => {
        if (!__questionsBySpecialtyCache) {
            __questionsBySpecialtyCache = buildQuestionsBySpecialty();
        }
        return __questionsBySpecialtyCache;
    };

    const getQuestionsPoolForSpecs = (specs = []) => {
        if (typeof QUESTIONS === "undefined" || !Array.isArray(QUESTIONS)) return [];
        const safeSpecs = Array.from(new Set((specs || []).filter(spec => TRONCAL_SPECIALTIES.includes(spec))));
        if (safeSpecs.length === 0 || safeSpecs.length >= TRONCAL_SPECIALTIES.length) return QUESTIONS;
        const grouped = getQuestionsBySpecialty();
        const merged = [];
        safeSpecs.forEach(spec => {
            if (Array.isArray(grouped[spec]) && grouped[spec].length > 0) {
                merged.push(...grouped[spec]);
            }
        });
        return merged;
    };

    const splitPoolByDifficultySelection = (pool, difficulty) => {
        if (!Array.isArray(pool) || pool.length === 0) {
            return { primary: [], secondary: [] };
        }
        if (!difficulty || difficulty === "cualquiera") {
            return { primary: pool.slice(), secondary: [] };
        }

        const targetBucket = difficulty === "alta"
            ? "hard"
            : normalizeDifficultyBucket(difficulty);
        const primary = [];
        const secondary = [];

        pool.forEach(q => {
            if (getQuestionDifficultyBucket(q) === targetBucket) primary.push(q);
            else secondary.push(q);
        });

        return { primary, secondary };
    };

    const buildFilteredQuestionPools = ({
        specs = [],
        selectedTopics = [],
        difficulty = "cualquiera"
    } = {}) => {
        let pool = getQuestionsPoolForSpecs(specs);
        if (selectedTopics.length > 0) {
            const selectedTopicState = buildSelectedTopicState(selectedTopics);
            pool = pool.filter(q => caseMatchesSelectedTopics(q, selectedTopicState));
        }
        pool = filterQuarantinedPool(pool);
        return splitPoolByDifficultySelection(pool, difficulty);
    };

    const buildRealSimPoolCache = () => {
        const cache = {
            all: [],
            bySpec: {
                ped: { all: [], easy: [], medium: [], hard: [] },
                mi: { all: [], easy: [], medium: [], hard: [] },
                cir: { all: [], easy: [], medium: [], hard: [] },
                gyo: { all: [], easy: [], medium: [], hard: [] }
            }
        };

        if (typeof QUESTIONS === "undefined" || !Array.isArray(QUESTIONS)) return cache;

        let qid = 1;
        QUESTIONS.forEach(c => {
            if (!c || !cache.bySpec[c.specialty]) return;
            const caseKey = getCaseKey(c);
            const difficultyBucket = getQuestionDifficultyBucket(c);
            const subs = (c.questions && Array.isArray(c.questions))
                ? c.questions
                : [{ question: c.question, options: c.options, answerIndex: c.answerIndex, explanation: c.explanation }];

            subs.forEach((sq) => {
                const entry = {
                    ...c,
                    question: sq.question,
                    options: sq.options,
                    answerIndex: sq.answerIndex,
                    explanation: sq.explanation,
                    caseGroupId: 0,
                    subQuestionIndex: 1,
                    totalSubQuestions: 1,
                    _qid: qid++,
                    _difficultyBucket: difficultyBucket,
                    _caseKey: caseKey
                };
                cache.all.push(entry);
                cache.bySpec[c.specialty].all.push(entry);
                cache.bySpec[c.specialty][difficultyBucket].push(entry);
            });
        });

        return cache;
    };

    const getRealSimPoolCache = () => {
        if (!__realSimPoolCache) {
            __realSimPoolCache = buildRealSimPoolCache();
        }
        return __realSimPoolCache;
    };

    const calcSpecDifficultyTargets = (count) => {
        const easy = Math.round(count * 0.25);
        const medium = Math.round(count * 0.5);
        const hard = Math.max(0, count - easy - medium);
        return { easy, medium, hard };
    };

    const buildRealSimulacroQuestionSet = () => {
        if (typeof QUESTIONS === "undefined" || !Array.isArray(QUESTIONS)) {
            return { questionSet: [], warnings: ["No se encontro banco de preguntas."] };
        }

        const cache = getRealSimPoolCache();
        const bySpec = {
            ped: { all: [], easy: [], medium: [], hard: [] },
            mi: { all: [], easy: [], medium: [], hard: [] },
            cir: { all: [], easy: [], medium: [], hard: [] },
            gyo: { all: [], easy: [], medium: [], hard: [] }
        };
        const isBlocked = (q) => {
            const key = q && q._caseKey ? q._caseKey : getCaseKey(q);
            if (!key) return false;
            if (State.quarantineKeys && State.quarantineKeys.has(key)) return true;
            if (State.deletedCaseKeys && State.deletedCaseKeys.has(key)) return true;
            return false;
        };

        cache.all.forEach(q => {
            if (!q || !bySpec[q.specialty] || isBlocked(q)) return;
            bySpec[q.specialty].all.push(q);
            bySpec[q.specialty][q._difficultyBucket].push(q);
        });

        const selected = [];
        const used = new Set();
        const warnings = [];

        const takeRandom = (arr, n) => {
            const picks = takeRandomItems(arr, n);
            picks.forEach(p => {
                used.add(p._qid);
                selected.push(p);
            });
            return n - picks.length;
        };

        const pickForSpec = (specKey, targetCount) => {
            const pool = bySpec[specKey] || { all: [], easy: [], medium: [], hard: [] };
            const targets = calcSpecDifficultyTargets(targetCount);
            const easy = pool.easy || [];
            const medium = pool.medium || [];
            const hard = pool.hard || [];

            let missingEasy = takeRandom(easy, targets.easy);
            let missingMed = takeRandom(medium, targets.medium);
            let missingHard = takeRandom(hard, targets.hard);

            let remaining = missingEasy + missingMed + missingHard;
            if (remaining > 0) {
                const leftovers = (pool.all || []).filter(q => !used.has(q._qid));
                remaining -= takeRandom(leftovers, remaining);
            }

            if (missingEasy || missingMed || missingHard || remaining > 0) {
                warnings.push(`No hubo suficientes preguntas para ${specKey.toUpperCase()} con la distribucion exacta. Se completo con disponibles.`);
            }
        };

        Object.entries(REAL_SIM_CONFIG.specs).forEach(([specKey, count]) => {
            pickForSpec(specKey, count);
        });

        if (selected.length < REAL_SIM_CONFIG.total) {
            const remaining = bySpec.ped.all
                .concat(bySpec.mi.all, bySpec.cir.all, bySpec.gyo.all)
                .filter(q => !used.has(q._qid));
            const missing = REAL_SIM_CONFIG.total - selected.length;
            takeRandom(remaining, missing);
            if (missing > 0) warnings.push("No se pudo completar el total de 280 preguntas con el banco actual.");
        } else if (selected.length > REAL_SIM_CONFIG.total) {
            const trimmed = takeRandomItems(selected, REAL_SIM_CONFIG.total);
            selected.length = 0;
            trimmed.forEach(q => selected.push(q));
            warnings.push("Se ajusto el total de preguntas a 280.");
        }

        const finalSet = shuffleArray(selected).map((q, idx) => ({
            ...q,
            caseGroupId: idx + 1,
            subQuestionIndex: 1,
            totalSubQuestions: 1
        }));

        return { questionSet: finalSet, warnings };
    };

    const processAndFlattenPool = (rawPool, maxQty) => {
        let flat = [];
        let cId = 1;
        if (!Array.isArray(rawPool) || rawPool.length === 0 || maxQty <= 0) return flat;

        const pool = rawPool.slice();
        let remaining = pool.length;
        while (remaining > 0 && flat.length < maxQty) {
            const idx = Math.floor(Math.random() * remaining);
            const c = pool[idx];
            pool[idx] = pool[remaining - 1];
            remaining--;
            if (!c) continue;
            if (flat.length >= maxQty) break;
            // Support both old format (single question) and new format (questions array)
            let subs = (c.questions && Array.isArray(c.questions)) ? c.questions : [{ question: c.question, options: c.options, answerIndex: c.answerIndex, explanation: c.explanation }];
            subs.forEach((sq, idx) => {
                flat.push({
                    ...c,
                    question: sq.question,
                    options: sq.options,
                    answerIndex: sq.answerIndex,
                    explanation: sq.explanation,
                    caseGroupId: cId,
                    subQuestionIndex: idx + 1,
                    totalSubQuestions: subs.length
                });
            });
            cId++;
        }
        return flat.slice(0, maxQty);
    };

    const PREMIUM_VIEWS = new Set([
        "view-comunidad",
        "view-reportes",
        "view-refuerzos",
        "view-estudio-plus",
        "view-pomodoro"
    ]);

    const ensurePremiumAccess = (reason) => {
        if (isPremiumActive()) return true;
        openRedeemModal(reason || "Esta funci\u00f3n requiere premium.");
        return false;
    };

    const showView = (viewId) => {
        if (State.view === "view-exam" && viewId !== "view-exam" && State.examActive) {
            if (typeof pauseTimer === 'function') {
                pauseTimer();
                showNotification("Examen pausado automáticamente.", "info");
            }
        }
        if (PREMIUM_VIEWS.has(viewId) && !isPremiumActive()) {
            showNotification("Acceso premium requerido.", "warning");
            openRedeemModal("Para entrar a esta secci\u00f3n necesitas un c\u00f3digo premium.");
            return;
        }
        if (viewId === "view-reclassify" && !canReclassifyUser()) {
            showNotification("Solo admin puede usar el reclasificador.", "warning");
            viewId = "view-mas";
        }
        $$(".view").forEach(v => v.classList.remove("active"));
        const viewEl = $(viewId);
        if (viewEl) {
            viewEl.classList.add("active");


            // Scroll al inicio al cambiar de vista para que la barra no tape el inicio
            const content = document.querySelector(".main-content");
            if (content) content.scrollTop = 0;
            window.scrollTo(0, 0);
        }
        State.view = viewId;
        document.body.classList.toggle("dashboard-mobile-hero-active", viewId === "view-dashboard");
        if (viewId === "view-dashboard") {
            updateDashboardStats();
            updateCharts();
        }
        if (viewId === "view-estudio-plus") {
            renderStudyDashboard();
            renderResultsPostmortem();
            renderNotebookView();
        }
        if (viewId === "view-pomodoro") {
            renderPomodoroHub();
        }
        if (viewId === "view-profile") {
            renderProfileView();
            if (typeof window.loadPendingRequests === "function") {
                try { window.loadPendingRequests(); } catch (e) { console.error(e); }
            }
        }
        if (viewId === "view-historial") updateHistoryView();
        if (viewId === "view-estadisticas") updateCharts();
        if (viewId === "view-calculadora") initCalculator();
        if (viewId === "view-temario") void renderOfficialTemario($("temario-search")?.value || "");
        if (viewId === "view-reportes") renderReportedQuestions();
        if (viewId === "view-feedback-admin") {
            initFeedbackAdminInbox();
            renderAdminFeedbackInbox();
        }
        if (viewId === "view-reclassify") void renderReclassifyView();
        syncPomodoroPlacement();
    };
    document.body.classList.toggle("dashboard-mobile-hero-active", State.view === "view-dashboard");
    window.showView = showView; // Hacerla global para onclick de HTML
    window.openFeedbackEmail = openFeedbackEmail;
    window.submitFeedback = submitFeedback;
    window.copyFeedbackToClipboard = copyFeedbackToClipboard;

    const saveGlobalStats = () => {
        ensureStudySystemsState();
        ensureDailyPlanFresh();
        localStorage.setItem("enarm_stats", JSON.stringify(State.globalStats));
        localStorage.setItem("enarm_history", JSON.stringify(State.history));
        localStorage.setItem("enarm_user", State.userName);
        localStorage.setItem("enarm_specialty", State.userSpecialty || "");
        localStorage.setItem("enarm_university", State.userUniversity || "");
        localStorage.setItem("enarm_score_public", State.isScorePublic ? "1" : "0");
        localStorage.setItem("enarm_daily_plan", JSON.stringify(State.dailyPlan || null));
        localStorage.setItem("enarm_review_queue", JSON.stringify(State.reviewQueue || []));
        localStorage.setItem("enarm_topic_mastery", JSON.stringify(State.topicMastery || {}));
        localStorage.setItem("enarm_case_notebook", JSON.stringify(State.caseNotebook || []));
        localStorage.setItem("enarm_study_calendar", JSON.stringify(State.studyCalendar || {}));
        localStorage.setItem("enarm_last_postmortem", JSON.stringify(State.lastPostmortem || null));
        localStorage.setItem(FONT_PRESET_STORAGE_KEY, normalizeFontPreset(State.fontPreset));
        persistPomodoroLocalState();
        const reportsToSave = State.reportedQuestionsLocal || State.reportedQuestions || [];
        localStorage.setItem("enarm_reports", JSON.stringify(reportsToSave));

        // Sync to cloud -> Leaderboard
        if (window.FB && window.FB.auth.currentUser) {
            const totalq = State.globalStats?.respondidas || 0;
            const avg = totalq > 0 ? parseFloat(((State.globalStats.aciertos / totalq) * 100).toFixed(1)) : 0;

            const pData = {
                username: State.userName,
                specialty: State.userSpecialty || "",
                university: State.userUniversity || "",
                isScorePublic: State.isScorePublic !== false,
                score: avg,
                answered: totalq,
                flame: State.history.length || 0,
                lastUpdate: new Date(),
                theme: State.theme || "ocean",
                fontPreset: normalizeFontPreset(State.fontPreset),
                dailyPlanStr: JSON.stringify(State.dailyPlan || null),
                reviewQueueStr: JSON.stringify(State.reviewQueue || []),
                topicMasteryStr: JSON.stringify(State.topicMastery || {}),
                caseNotebookStr: JSON.stringify(State.caseNotebook || []),
                studyCalendarStr: JSON.stringify(State.studyCalendar || {}),
                lastPostmortemStr: JSON.stringify(State.lastPostmortem || null),
                pomodoroSettingsStr: JSON.stringify(State.pomodoroSettings || createDefaultPomodoroSettings()),
                pomodoroLogStr: JSON.stringify(State.pomodoroLog || []),
                pomodoroSpecialtiesStr: JSON.stringify(State.pomodoroSpecialties || []),
                pomodoroFocusLabel: String(State.pomodoroFocusLabel || ""),
                globalStatsStr: JSON.stringify(State.globalStats),
                historyStr: JSON.stringify(State.history),
                reportsStr: JSON.stringify(reportsToSave)
            };

            window.FB.setDoc(
                window.FB.doc(window.FB.db, "leaderboard", window.FB.auth.currentUser.uid),
                pData,
                { merge: true }
            ).catch(err => console.error("Error cloud sync:", err));
        }
    };

    const renderAvatarInitials = (el, initials) => {
        if (!el) return;
        const isDashboardHeroAvatar = el.classList.contains("dashboard-hero-avatar");
        const avatarTextStyle = isDashboardHeroAvatar
            ? "font-size: 28px; font-weight: 800; line-height: 1; letter-spacing: -0.01em;"
            : "font-size: 14px; font-weight: 700;";
        el.innerHTML = `<span style="${avatarTextStyle}">${initials}</span>`;
        el.style.background = "rgba(5, 192, 127, 0.1)";
        el.style.color = "var(--accent-green)";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
    };

    const loadGlobalStats = () => {
        const s = localStorage.getItem("enarm_stats");
        if (s) State.globalStats = JSON.parse(s);
        const h = localStorage.getItem("enarm_history");
        if (h) State.history = JSON.parse(h);
        const u = localStorage.getItem("enarm_user");
        if (u) State.userName = u;
        const sp = localStorage.getItem("enarm_specialty");
        if (sp) State.userSpecialty = sp;
        const uni = localStorage.getItem("enarm_university");
        if (uni) State.userUniversity = uni;
        const scorePublic = localStorage.getItem("enarm_score_public");
        if (scorePublic !== null) State.isScorePublic = scorePublic !== "0";
        const dailyPlan = localStorage.getItem("enarm_daily_plan");
        if (dailyPlan) State.dailyPlan = JSON.parse(dailyPlan);
        const reviewQueue = localStorage.getItem("enarm_review_queue");
        if (reviewQueue) State.reviewQueue = JSON.parse(reviewQueue);
        const topicMastery = localStorage.getItem("enarm_topic_mastery");
        if (topicMastery) State.topicMastery = JSON.parse(topicMastery);
        const caseNotebook = localStorage.getItem("enarm_case_notebook");
        if (caseNotebook) State.caseNotebook = JSON.parse(caseNotebook);
        const studyCalendar = localStorage.getItem("enarm_study_calendar");
        if (studyCalendar) State.studyCalendar = JSON.parse(studyCalendar);
        const lastPostmortem = localStorage.getItem("enarm_last_postmortem");
        if (lastPostmortem) State.lastPostmortem = JSON.parse(lastPostmortem);
        const pomodoroSettings = localStorage.getItem(POMODORO_STORAGE_KEYS.settings);
        if (pomodoroSettings) State.pomodoroSettings = JSON.parse(pomodoroSettings);
        const pomodoroState = localStorage.getItem(POMODORO_STORAGE_KEYS.state);
        if (pomodoroState) State.pomodoroState = JSON.parse(pomodoroState);
        const pomodoroLog = localStorage.getItem(POMODORO_STORAGE_KEYS.log);
        if (pomodoroLog) State.pomodoroLog = JSON.parse(pomodoroLog);
        const pomodoroSpecialties = localStorage.getItem(POMODORO_STORAGE_KEYS.specialties);
        if (pomodoroSpecialties) State.pomodoroSpecialties = JSON.parse(pomodoroSpecialties);
        const pomodoroFocus = localStorage.getItem(POMODORO_STORAGE_KEYS.focus);
        if (pomodoroFocus !== null) State.pomodoroFocusLabel = pomodoroFocus;
        const fontPreset = localStorage.getItem(FONT_PRESET_STORAGE_KEY);
        State.fontPreset = normalizeFontPreset(fontPreset || "clinical");
        localStorage.setItem(FONT_PRESET_STORAGE_KEY, State.fontPreset);
        applyFontPreset(State.fontPreset);

        const theme = localStorage.getItem("enarm_theme");
        if (theme) {
            State.theme = normalizeThemeSelection(theme);
            localStorage.setItem("enarm_theme", State.theme);
            applyTheme(State.theme);
        } else {
            State.theme = "ocean";
            localStorage.setItem("enarm_theme", "ocean");
            applyTheme("ocean");
        }
        const adminPreviewMode = localStorage.getItem(ADMIN_PREVIEW_STORAGE_KEY);
        if (adminPreviewMode === "demo" || adminPreviewMode === "premium") {
            State.adminPreviewMode = adminPreviewMode;
        }
        const reports = localStorage.getItem("enarm_reports");
        if (reports) {
            State.reportedQuestionsLocal = JSON.parse(reports);
            State.reportedQuestions = State.reportedQuestionsLocal;
        }
        ensureStudySystemsState();
        rebuildTopicMastery();
        ensureDailyPlanFresh();
        refreshQuarantineKeys();

        if ($("profile-name")) $("profile-name").value = State.userName;
        if ($("profile-specialty")) $("profile-specialty").value = State.userSpecialty || "";
        if ($("profile-university")) $("profile-university").value = State.userUniversity || "";

        $$(".user-name").forEach(el => el.textContent = State.userName);
        $$(".header-title").forEach(el => {
            if (el.textContent.includes("Hola,")) {
                el.innerHTML = `Hola, <span class="user-name" style="color:var(--accent-green);">${State.userName}</span>`;
            } else {
                el.textContent = `Hola, ${State.userName}`;
            }
        });

        // Update avatar initials
        const nameParts = State.userName.trim().split(/\s+/);
        const initials = nameParts.length > 1
            ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
            : nameParts[0].substring(0, 2).toUpperCase();

        $$(".user-avatar").forEach(el => renderAvatarInitials(el, initials));
        const statusEl = document.querySelector(".user-status");
        if (statusEl) statusEl.textContent = "EN LÍNEA";
        syncReclassAccessUI();
        syncPremiumUI();
    };

    const applyTheme = (theme) => {
        const normalizedTheme = normalizeThemeSelection(theme);
        // Remove all current theme classes
        document.body.classList.remove("light-mode", "theme-forest", "theme-ocean", "theme-sunset", "theme-navy-gold", "theme-black-teal", "theme-premium", "theme-premium-pink", "theme-clinical-dark", "theme-clinical-light");
        document.body.style.backgroundColor = "";

        if (normalizedTheme === "system") {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                document.body.classList.add("light-mode");
            }
        } else if (normalizedTheme === "light") {
            document.body.classList.add("light-mode");
        } else if (normalizedTheme === "forest") {
            document.body.classList.add("theme-forest");
        } else if (normalizedTheme === "ocean") {
            document.body.classList.add("theme-ocean");
        } else if (normalizedTheme === "sunset") {
            document.body.classList.add("theme-sunset");
        } else if (normalizedTheme === "navy-gold") {
            document.body.classList.add("theme-navy-gold");
        } else if (normalizedTheme === "black-teal") {
            document.body.classList.add("theme-black-teal");
        } else if (normalizedTheme === "premium") {
            document.body.classList.add("theme-premium");
        } else if (normalizedTheme === "premium-pink") {
            document.body.classList.add("theme-premium-pink");
        }
        // "dark" is the default, no class needed
        syncThemeColorMeta();

        // Update Theme Circles Active State
        $$(".theme-circle").forEach(circle => {
            circle.classList.remove("active");
            if (circle.dataset.theme === normalizedTheme || (normalizedTheme === "system" && circle.dataset.theme === "ocean")) {
                circle.classList.add("active");
            }
        });
    };

    // ---------------------------------------------------------------------------
    // Navigation
    // ---------------------------------------------------------------------------
    const bindSidebar = () => {
        const toggleBtn = $("btn-sidebar-toggle");
        const sidebar = document.querySelector(".sidebar");
        if (toggleBtn && sidebar) {
            const detectTabletLayout = () => {
                const hasMatchMedia = typeof window.matchMedia === "function";
                const coarsePointer = hasMatchMedia && window.matchMedia("(pointer: coarse)").matches;
                const noHover = hasMatchMedia && window.matchMedia("(hover: none)").matches;
                const touchViewport = coarsePointer || ((navigator.maxTouchPoints || 0) > 0 && noHover);

                const innerSmallestSide = Math.min(window.innerWidth, window.innerHeight);
                const innerLargestSide = Math.max(window.innerWidth, window.innerHeight);
                const screenSmallestSide = Math.min(window.screen?.width || 0, window.screen?.height || 0);
                const screenLargestSide = Math.max(window.screen?.width || 0, window.screen?.height || 0);
                const effectiveSmallestSide = Math.max(innerSmallestSide, screenSmallestSide);
                const effectiveLargestSide = Math.max(innerLargestSide, screenLargestSide);

                return touchViewport && effectiveSmallestSide >= 600 && effectiveLargestSide >= 900;
            };

            const syncSidebarResponsiveState = (forceCollapseOnTablet = false) => {
                const isTabletViewport = detectTabletLayout();

                document.body.classList.toggle("tablet-layout", isTabletViewport);
                if (isTabletViewport && forceCollapseOnTablet) {
                    sidebar.classList.add("collapsed");
                }
                document.body.classList.toggle(
                    "tablet-sidebar-expanded",
                    isTabletViewport && !sidebar.classList.contains("collapsed")
                );
            };

            syncSidebarResponsiveState(true);
            window.addEventListener("load", () => syncSidebarResponsiveState(true));
            window.addEventListener("resize", () => syncSidebarResponsiveState(true));
            window.addEventListener("orientationchange", () => syncSidebarResponsiveState(true));

            toggleBtn.addEventListener("click", () => {
                sidebar.classList.toggle("collapsed");
                syncSidebarResponsiveState(false);
                // Trigger chart resizing if sidebar changes
                setTimeout(() => {
                    if (typeof updateCharts === 'function') updateCharts();
                }, 300);
            });
        }

        const navs = [
            { id: "nav-dashboard", view: "view-dashboard" },
            { id: "nav-new-exam", view: "view-setup" },
            { id: "nav-comunidad", view: "view-comunidad" },
            { id: "nav-mas", view: "view-mas" },
            { id: "nav-estadisticas", view: "view-estadisticas" },
            { id: "nav-historial", view: "view-historial" },
            { id: "nav-ajustes", view: "view-ajustes" },
            { id: "nav-ajustes-mobile", view: "view-ajustes" },
        ];
        navs.forEach(nav => {
            const el = $(nav.id);
            if (el) {
                el.addEventListener("click", () => {
                    if (PREMIUM_VIEWS.has(nav.view) && !isPremiumActive()) {
                        showNotification("Acceso premium requerido.", "warning");
                        openRedeemModal("Esta secci\u00f3n es premium.");
                        return;
                    }
                    $$(".nav-item").forEach(n => n.classList.remove("active"));
                    el.classList.add("active");

                    // Sincronizar nav móvil
                    $$(".mobile-nav-item").forEach(n => {
                        n.classList.remove("active");
                        if (n.dataset.view === nav.view) n.classList.add("active");
                    });

                    showView(nav.view);
                });
            }
        });

        // Mobile Nav Listeners
        $$(".mobile-nav-item").forEach(btn => {
            btn.addEventListener("click", () => {
                const targetView = btn.dataset.view;
                if (PREMIUM_VIEWS.has(targetView) && !isPremiumActive()) {
                    showNotification("Acceso premium requerido.", "warning");
                    openRedeemModal("Esta secci\u00f3n es premium.");
                    return;
                }

                // Limpiar activos
                $$(".mobile-nav-item").forEach(n => n.classList.remove("active"));
                $$(".nav-item").forEach(n => n.classList.remove("active"));

                btn.classList.add("active");

                // Sync escritorio
                const nav = navs.find(n => n.view === targetView);
                if (nav && $(nav.id)) {
                    $(nav.id).classList.add("active");
                }

                showView(targetView);
            });
        });
    };

    // ---------------------------------------------------------------------------
    // TEMARIO OFICIAL ENARM (Basado en el flujo temático)
    // ---------------------------------------------------------------------------
    const OFFICIAL_TEMARIO = [
        "Amenorreas Primarias y Secundarias",
        "Ciclo Genital, Esterilidad y Anticonceptivos",
        "Sangrados Uterinos Anormales de Origen No Anatómico",
        "Sangrados Uterinos de Origen Desconocido",
        "Patología, Menopausia y Climaterio",
        "Sangrados Uterinos Anormales de Origen Anatómico No Maligno",
        "Oncología Ginecológica",
        "Patología Mamaria Benigna",
        "Cáncer de Mama",
        "Patología Infecciosa Cervical",
        "Control Prenatal",
        "Hemorragias del Primer Trimestre",
        "Hemorragias del Segundo Trimestre",
        "Patología del Embarazo: Estados Hipertensivos",
        "Patología del Embarazo",
        "Trabajo de Parto",
        "Patología de Trabajo de Parto",
        "Parto Prematuro y Patología Coriónica",
        "Patología Puerperal",
        "Recién Nacido Sano",
        "Reanimación Neonatal",
        "Patología Neonatal Infecciosa",
        "Patología Respiratoria del Pediátrico",
        "Patología Neonatal Malformativa",
        "Patología Neonatal Congénita Infecciosa",
        "Estenosis Hipertrófica del Píloro",
        "Ictericia Neonatal",
        "Tamiz Metabólico",
        "Crecimiento y Desarrollo",
        "Vacunación",
        "Patología Gastrointestinal Pediátrica",
        "Diarrea en el Pediátrico",
        "Enfermedades Parasitarias",
        "Patología Respiratoria del Lactante y Preescolar",
        "Neumonías",
        "Asma en el Adulto y Pediátrico",
        "IRAS y Convulsiones",
        "Enfermedades Exantemáticas",
        "Urgencias Pediátricas",
        "Uropedia",
        "Cardiopedia",
        "Especialidades Pediátricas",
        "Alteraciones Cromosómicas",
        "Introducción a Cirugía y Cirugía Abdominal",
        "Patología Esofágica",
        "Patología Gástrica",
        "Patología Biliar",
        "Patología Pancreática",
        "Apendicitis",
        "Patología Diverticular",
        "Patología Intestinal Quirúrgica",
        "Patología Isquémica Intestinal",
        "Hernias y Esplenectomía",
        "Patología Intestinal Inflamatoria",
        "Patología Hepática",
        "Cirrosis y sus Complicaciones",
        "Patología Arterial y Venosa",
        "Patología Perianal",
        "Urología",
        "ETS",
        "ATLS",
        "Intoxicaciones y Picaduras",
        "Quemaduras, Golpe de Calor e Hipotermia",
        "Cirugía Oncológica",
        "Oftalmología",
        "Otorrinolaringología",
        "Traumatología y Ortopedia",
        "Introducción e Infectología",
        "Infecciones Específicas",
        "Neumología",
        "Endocrinología",
        "Hematología",
        "Cardiología",
        "Neurología",
        "Dermatología",
        "Reumatología",
        "Nefrología",
        "Psiquiatría",
        "Geriatría",
        "Epidemiología"
    ];

    const TEMARIO_MAPPING = {
        "Amenorreas Primarias y Secundarias": [
                "Amenorreas Primarias y Secundarias",
                "Amenorreas Primarias y Secundarias (Ginecología y Obstetricia)",
                "APS",
                "APSGO",
                "SA",
                "Síndrome de Asherman",
                "Síndrome de Kallman",
                "Síndrome de Morris",
                "Síndrome de Prader-Willi",
                "Síndrome de Rokitansky",
                "Síndrome de Sheehan",
                "Síndrome de Swyer",
                "Síndrome de Turner",
                "SK",
                "SM",
                "SPW",
                "SR",
                "SS",
                "ST"
        ],
        "Ciclo Genital, Esterilidad y Anticonceptivos": [
                "CGEA",
                "CGEAGO",
                "Ciclo Genital, Esterilidad y Anticonceptivos",
                "Ciclo Genital, Esterilidad y Anticonceptivos (Ginecología y Obstetricia)"
        ],
        "Sangrados Uterinos Anormales de Origen No Anatómico": [
                "Sangrados Uterinos Anormales de Origen No Anatómico",
                "Sangrados Uterinos Anormales de Origen No Anatómico (Ginecología y Obstetricia)",
                "SUAONA"
        ],
        "Sangrados Uterinos de Origen Desconocido": [
                "Coagulopatías",
                "Endometriosis",
                "Sangrados Uterinos de Origen Desconocido",
                "Sangrados Uterinos de Origen Desconocido (Ginecología y Obstetricia)",
                "SOP",
                "SUOD",
                "SUODGO"
        ],
        "Patología, Menopausia y Climaterio": [
                "Incontinencia Urinaria",
                "IU",
                "Menopausia",
                "Osteoporosis",
                "Patología Menopausia y Climaterio",
                "Patología, Menopausia y Climaterio",
                "Patología, Menopausia y Climaterio (Ginecología y Obstetricia)",
                "PMC",
                "PMCGO",
                "SC",
                "Síndrome Climatérico",
                "TPP",
                "Trastornos del Piso Pélvico"
        ],
        "Sangrados Uterinos Anormales de Origen Anatómico No Maligno": [
                "Adenomiosis",
                "Miomatosis",
                "Poliposis",
                "Sangrados Uterinos Anormales de Origen Anatómico No Maligno",
                "Sangrados Uterinos Anormales de Origen Anatómico No Maligno (Ginecología y Obstetricia)",
                "TO",
                "Torsión Ovárica"
        ],
        "Oncología Ginecológica": [
                "Bartolinitis",
                "CACU",
                "Cáncer Cervicouterino",
                "Cáncer de Endometrio",
                "Cáncer de Ovario",
                "Cáncer de Vagina y Vulva",
                "CC",
                "CE",
                "CO",
                "CVV",
                "OG",
                "OGGO",
                "Oncología Ginecológica",
                "Oncología Ginecológica (Ginecología y Obstetricia)",
                "Patología Vulvar",
                "Prevención y tamizaje de CACU",
                "Prevención y Tamizaje de CACU",
                "PTC",
                "PV"
        ],
        "Patología Mamaria Benigna": [
                "Fibroadenoma",
                "Mastitis Puerperal y No Puerperal",
                "Mastopatía Fibroquística",
                "MF",
                "MPNP",
                "Papiloma Intraductal",
                "Patología Mamaria Benigna",
                "Patología Mamaria Benigna (Ginecología y Obstetricia)",
                "PI",
                "PMB",
                "PMBGO"
        ],
        "Cáncer de Mama": [
                "Cáncer de Mama",
                "Cáncer de Mama (Ginecología y Obstetricia)",
                "CM",
                "CMGO"
        ],
        "Patología Infecciosa Cervical": [
                "Candida",
                "CB",
                "Cervicovaginitis Bacteriana",
                "Endocervicitis",
                "Enfermedad Pélvica Inflamatoria",
                "EPI",
                "Patología Infecciosa Cervical",
                "Patología Infecciosa Cervical (Ginecología y Obstetricia)",
                "PIC",
                "PICGO",
                "Trichomonas"
        ],
        "Control Prenatal": [
                "Consultas Prenatales",
                "Control Prenatal",
                "Control Prenatal (Ginecología y Obstetricia)",
                "CP",
                "CPGO",
                "DC",
                "Depresión Materna",
                "Diagnóstico de Cromosomopatías",
                "DM",
                "FE",
                "Fisiología del Embarazo",
                "HG",
                "Hiperemesis Gravídica",
                "IGR",
                "Incompatibilidad de Grupo RH",
                "Maniobras de Leopold",
                "ML",
                "Patología Tiroidea en el Embarazo",
                "PTE",
                "Vacunas"
        ],
        "Hemorragias del Primer Trimestre": [
                "Aborto",
                "EE",
                "Embarazo Ectópico",
                "Enfermedad Trofoblástica",
                "ET",
                "Hemorragias del Primer Trimestre",
                "Hemorragias del Primer Trimestre (Ginecología y Obstetricia)",
                "HPT",
                "HPTGO"
        ],
        "Hemorragias del Segundo Trimestre": [
                "Acretismo Placentario",
                "AP",
                "DPPNI",
                "Hemorragias del Segundo Trimestre",
                "Hemorragias del Segundo Trimestre (Ginecología y Obstetricia)",
                "HST",
                "HSTGO",
                "Placenta Previa",
                "PP",
                "r. uterina",
                "Rotura Uterina",
                "RU",
                "Vasa Previa",
                "VP"
        ],
        "Patología del Embarazo: Estados Hipertensivos": [
                "Eclampsia",
                "HC",
                "HG",
                "Hipertensión Crónica",
                "Hipertensión Gestacional",
                "Patología del Embarazo: Estados Hipertensivos",
                "Patología del Embarazo: Estados Hipertensivos (Ginecología y Obstetricia)",
                "PEEH",
                "PEEHGO",
                "Preeclampsia",
                "SH",
                "Síndrome de HELLP"
        ],
        "Patología del Embarazo": [
                "Diabetes Mellitus Gestacional",
                "DMG",
                "Patología del Embarazo",
                "Patología del Embarazo (Ginecología y Obstetricia)",
                "Patología Hepática del Embarazo",
                "PE",
                "PEGO",
                "PHE"
        ],
        "Trabajo de Parto": [
                "Fisiológico",
                "TP",
                "TPGO",
                "Trabajo de Parto",
                "Trabajo de Parto (Ginecología y Obstetricia)",
                "Violencia Obstétrica",
                "VO"
        ],
        "Patología de Trabajo de Parto": [
                "Cesárea",
                "Distocias",
                "EG",
                "Embarazo Gemelar",
                "Inducción de Trabajo de Parto",
                "ITP",
                "Patología de Trabajo de Parto",
                "Patología de Trabajo de Parto (Ginecología y Obstetricia)",
                "PTP",
                "PTPGO"
        ],
        "Parto Prematuro y Patología Coriónica": [
                "Corioamnionitis",
                "Oligohidramnios",
                "Parto Prematuro",
                "Parto Prematuro y Patología Coriónica",
                "Parto Prematuro y Patología Coriónica (Ginecología y Obstetricia)",
                "Polihidramnios",
                "PP",
                "PPPC",
                "PPPCGO",
                "RPM",
                "Ruptura Prematura de Membranas"
        ],
        "Patología Puerperal": [
                "Atonía",
                "Choque en la Paciente Embarazada",
                "Coagulopatías",
                "CPE",
                "Hemorragia Obstétrica",
                "HO",
                "Patología Puerperal",
                "Patología Puerperal (Ginecología y Obstetricia)",
                "PP",
                "PPGO",
                "Sepsis Materna",
                "SM",
                "Tejido",
                "Trauma"
        ],
        "Recién Nacido Sano": [
                "ADN",
                "Alteraciones Dermatológicas al Nacimiento",
                "Cefalohematoma",
                "CRN",
                "Cuidados del Recién Nacido",
                "Parálisis Braquial",
                "PB",
                "Recién Nacido Sano",
                "Recién Nacido Sano (Pediatría)",
                "RNS",
                "RNSP",
                "Tamizajes del RN",
                "TR"
        ],
        "Reanimación Neonatal": [
                "Reanimación Neonatal",
                "Reanimación Neonatal (Pediatría)",
                "RN",
                "RNP"
        ],
        "Patología Neonatal Infecciosa": [
                "EN",
                "Enterocolitis Necrotizante",
                "Meningitis",
                "Neumonía",
                "Onfalitis",
                "Patología Neonatal Infecciosa",
                "Patología Neonatal Infecciosa (Pediatría)",
                "PNI",
                "PNIP",
                "Sepsis"
        ],
        "Patología Respiratoria del Pediátrico": [
                "AP",
                "Apnea del Prematuro",
                "DB",
                "Displasia Broncopulmonar",
                "EMH",
                "Enfermedad de Membrana Hialina",
                "Hipertensión Pulmonar",
                "HP",
                "Patología Respiratoria del Pediátrico",
                "Patología Respiratoria del Pediátrico (Pediatría)",
                "PRP",
                "PRPP",
                "SAM",
                "Síndrome de Aspiración de Meconio",
                "Taquipnea Transitoria del Recién Nacido",
                "TTRN"
        ],
        "Patología Neonatal Malformativa": [
                "AC",
                "AD",
                "AE",
                "AP",
                "Asfixia",
                "Atresia de las Coanas",
                "Atresia Duodenal",
                "Atresia Esofágica",
                "Atresia Pilórica",
                "EB",
                "EHI",
                "Encefalopatía Hipóxico-Isquémica",
                "Espina Bífida",
                "Gastrosquisis",
                "HD",
                "Hemorragia de Matriz Germinal",
                "Hernias Diafragmáticas",
                "HMG",
                "MA",
                "Malformaciones Anorrectales",
                "Malformaciones Congénitas",
                "MC",
                "Onfalocele",
                "Paladar Hendido",
                "Patología Neonatal Malformativa",
                "Patología Neonatal Malformativa (Pediatría)",
                "PH",
                "PNM",
                "PNMP"
        ],
        "Patología Neonatal Congénita Infecciosa": [
                "Binomio VIH",
                "BV",
                "Citomegalovirus",
                "Herpes",
                "Patología Neonatal Congénita Infecciosa",
                "Patología Neonatal Congénita Infecciosa (Pediatría)",
                "PNCI",
                "PNCIP",
                "Rubéola",
                "Sífilis",
                "TORCH",
                "Toxoplasmosis",
                "Varicela"
        ],
        "Estenosis Hipertrófica del Píloro": [
                "EHP",
                "EHPP",
                "Estenosis Hipertrófica del Píloro",
                "Estenosis Hipertrófica del Píloro (Pediatría)"
        ],
        "Ictericia Neonatal": [
                "Atresia de Vías Biliares",
                "AVB",
                "Fisiológica",
                "Ictericia Neonatal",
                "Ictericia Neonatal (Pediatría)",
                "IN",
                "Incompatibilidad Sanguínea",
                "INP",
                "IS",
                "Materna",
                "PMH",
                "Problemas del Metabolismo Hepático"
        ],
        "Tamiz Metabólico": [
                "DB",
                "Deficiencia de Biotinidasa",
                "Fenilcetonuria",
                "Fibrosis Quística",
                "FQ",
                "Galactosemia",
                "Hiperplasia Suprarrenal",
                "Hipotiroidismo",
                "HS",
                "Tamiz Metabólico",
                "Tamiz Metabólico (Pediatría)",
                "TM",
                "TMP"
        ],
        "Crecimiento y Desarrollo": [
                "Alimentación",
                "CD",
                "CDP",
                "CNS",
                "Consulta del Niño Sano",
                "Crecimiento y Desarrollo",
                "Crecimiento y Desarrollo (Pediatría)",
                "Déficits Vitamínicos",
                "Desnutrición",
                "DV",
                "HD",
                "Hitos del Desarrollo",
                "Maltrato Infantil",
                "MI",
                "MS",
                "Muerte Súbita",
                "Obesidad",
                "Talla Baja",
                "TB"
        ],
        "Vacunación": [
                "Vacunación",
                "Vacunación (Pediatría)",
                "VP"
        ],
        "Patología Gastrointestinal Pediátrica": [
                "Divertículo de Meckel",
                "DM",
                "EH",
                "Enfermedad de Hirschsprung",
                "ERGE",
                "II",
                "Invaginación Intestinal",
                "Patología Gastrointestinal del Pediátrico",
                "Patología Gastrointestinal Pediátrica",
                "Patología Gastrointestinal Pediátrica (Pediatría)",
                "PGP",
                "PGPP"
        ],
        "Diarrea en el Pediátrico": [
                "DAC",
                "DE",
                "Diarrea en el Pediátrico",
                "Diarrea en el Pediátrico (Pediatría)",
                "Diarrea Enteroinvasiva",
                "Diarreas Agudas y Crónicas",
                "DP",
                "DPP",
                "EC",
                "Enfermedad Celíaca",
                "IA",
                "ID",
                "Intoxicaciones Alimentarias",
                "Introducción a Diarreas",
                "PH",
                "Planes de Hidratación"
        ],
        "Enfermedades Parasitarias": [
                "Áscaris",
                "Cisticercosis",
                "E. histolytica",
                "Enfermedades Parasitarias",
                "Enfermedades Parasitarias (Pediatría)",
                "Entamoeba histolytica",
                "EntamoebaHistolytica",
                "EP",
                "EPP",
                "Escabiosis",
                "Filariasis",
                "Giardiasis",
                "Oxiuriasis",
                "Teniasis"
        ],
        "Patología Respiratoria del Lactante y Preescolar": [
                "Bronquiolitis",
                "Epiglotitis",
                "Laringotraqueítis",
                "Laringotraqueítis Bacteriana",
                "LB",
                "Patología Respiratoria del Lactante y Preescolar",
                "Patología Respiratoria del Lactante y Preescolar (Pediatría)",
                "PRLP",
                "PRLPP",
                "TF",
                "Tos Ferina"
        ],
        "Neumonías": [
                "AAP",
                "Atípicas en Adulto y Pediátrico",
                "Bacterianas",
                "Neumonías",
                "Neumonías (Pediatría)",
                "NP",
                "Virales"
        ],
        "Asma en el Adulto y Pediátrico": [
                "AAP",
                "AAPP",
                "Asma en el Adulto y Pediátrico",
                "Asma en el Adulto y Pediátrico (Pediatría)"
        ],
        "IRAS y Convulsiones": [
                "Difteria",
                "Faringoamigdalitis",
                "IC",
                "ICP",
                "IRAs / Convulsiones",
                "IRAS y Convulsiones",
                "IRAS y Convulsiones (Pediatría)",
                "Mononucleosis",
                "RC",
                "Resfriado Común"
        ],
        "Enfermedades Exantemáticas": [
                "5ta enfermedad",
                "6ta enfermedad",
                "EE",
                "EEP",
                "EK",
                "Enfermedad de Kawasaki",
                "Enfermedades Exantemáticas",
                "Enfermedades Exantemáticas (Pediatría)",
                "Escarlatina",
                "Herpangina",
                "Mano-Boca-Pie",
                "MBP",
                "QE",
                "Quinta Enfermedad",
                "Rubéola",
                "Sarampión",
                "SE",
                "Sexta Enfermedad",
                "Varicela"
        ],
        "Urgencias Pediátricas": [
                "IAP",
                "IC",
                "IMP",
                "Ingesta de Cáusticos",
                "Ingesta de Metales Pesados",
                "Intoxicaciones por ASA y Paracetamol",
                "Obstrucción de la Vía Aérea Superior",
                "OVAS",
                "UP",
                "UPP",
                "Urgencias Pediátricas",
                "Urgencias Pediátricas (Pediatría)"
        ],
        "Uropedia": [
                "Epididimitis",
                "IVU",
                "Reflujo Vesicoureteral",
                "RV",
                "TAT",
                "Torsión del Apéndice Testicular",
                "Torsión Testicular",
                "TT",
                "UP",
                "Uropedia",
                "Uropedia (Pediatría)"
        ],
        "Cardiopedia": [
                "AE",
                "Anomalía de Ebstein",
                "CA",
                "Cardiopatías Acianógenas",
                "Cardiopatías Cianógenas",
                "Cardiopedia",
                "Cardiopedia (Pediatría)",
                "CC",
                "CIA",
                "CIV",
                "CP",
                "DPVA",
                "Drenaje Pulmonar Venoso Anómalo",
                "EP",
                "Estenosis Pulmonar",
                "PCA",
                "TAC",
                "Tetralogía de Fallot",
                "TF",
                "TGV",
                "Transposición de Grandes Vasos",
                "Tronco Arterioso Común"
        ],
        "Especialidades Pediátricas": [
                "Astrocitoma",
                "Cojera",
                "DA",
                "DC",
                "Dermapedia",
                "Dermatitis Atópica",
                "Dermatitis del Pañal",
                "Dermatitis Seborreica",
                "Displasia de Cadera",
                "DP",
                "DS",
                "EP",
                "EPP",
                "Especialidades Pedia",
                "Especialidades Pediátricas",
                "Especialidades Pediátricas (Pediatría)",
                "Hematopedia",
                "MC",
                "Molusco Contagioso",
                "Nefroblastoma",
                "Neuroblastoma",
                "Oncopedia",
                "Ortopedia",
                "Osteosarcoma",
                "PHS",
                "Pie Plano",
                "PP",
                "PT",
                "Púrpura de Henoch-Schönlein",
                "Púrpura Trombocitopénica",
                "Sarcoma de Ewing",
                "SE",
                "Síndrome de Piel Escaldada",
                "Síndrome de Shock Tóxico",
                "SPE",
                "SST"
        ],
        "Alteraciones Cromosómicas": [
                "AC",
                "ACP",
                "Alteraciones Cromosómicas",
                "Alteraciones Cromosómicas (Pediatría)",
                "SD",
                "SE",
                "Síndrome de Down",
                "Síndrome de Edwards",
                "Síndrome de Klinefelter",
                "Síndrome de Patau",
                "SK",
                "SP"
        ],
        "Introducción a Cirugía y Cirugía Abdominal": [
                "AA",
                "Abdomen Agudo",
                "EF",
                "Exploración Física",
                "ICCA",
                "ICCAC",
                "Introducción a Cirugía y Cirugía Abdominal",
                "Introducción a Cirugía y Cirugía Abdominal (Cirugía)",
                "THQ",
                "Tipo de heridas OX",
                "Tipos de Heridas Quirúrgicas"
        ],
        "Patología Esofágica": [
                "Patología Esofágica",
                "Patología Esofágica (Cirugía)",
                "PE",
                "PEC"
        ],
        "Patología Gástrica": [
                "DF",
                "Dispepsia Funcional",
                "GAOC",
                "Gastritis Aguda o Crónica",
                "Patología Gástrica",
                "Patología Gástrica (Cirugía)",
                "PG",
                "PGC",
                "Úlcera Péptica Complicada y Perforada",
                "Úlcera Péptica Duodenal y Gástrica",
                "UPCP",
                "UPDG",
                "ZE",
                "Zollinger-Ellison"
        ],
        "Patología Biliar": [
                "Colangitis",
                "Colecistitis",
                "Coledocolitiasis",
                "Colelitiasis",
                "IB",
                "Íleo Biliar",
                "Patología Biliar",
                "Patología Biliar (Cirugía)",
                "PB",
                "PBC"
        ],
        "Patología Pancreática": [
                "PAC",
                "Pancreatitis Aguda y Crónica",
                "Patología Pancreática",
                "Patología Pancreática (Cirugía)",
                "PP",
                "PPC"
        ],
        "Apendicitis": [
                "AC",
                "Apendicitis",
                "Apendicitis (Cirugía)"
        ],
        "Patología Diverticular": [
                "Diverticulitis",
                "Diverticulosis",
                "ED",
                "Enfermedad Diverticular",
                "Patología Diverticular",
                "Patología Diverticular (Cirugía)",
                "PD",
                "PDC"
        ],
        "Patología Intestinal Quirúrgica": [
                "Obstrucción Intestinal",
                "OI",
                "Patología Intestinal Quirúrgica",
                "Patología Intestinal Quirúrgica (Cirugía)",
                "Patología Intestinal Qx",
                "PIQ",
                "PIQC",
                "VCC",
                "Vólvulo de Colon y Ciego"
        ],
        "Patología Isquémica Intestinal": [
                "IMAC",
                "Isquemia Mesentérica Aguda y Crónica",
                "Patología Isquémica Intestinal",
                "Patología Isquémica Intestinal (Cirugía)",
                "PII",
                "PIIC"
        ],
        "Hernias y Esplenectomía": [
                "HE",
                "HEC",
                "Hernias / Esplenectomía",
                "Hernias y Esplenectomía",
                "Hernias y Esplenectomía (Cirugía)"
        ],
        "Patología Intestinal Inflamatoria": [
                "Colitis Ulcerosa",
                "CU",
                "EC",
                "Enfermedad de Crohn",
                "Patología Intestinal Inflamatoria",
                "Patología Intestinal Inflamatoria (Cirugía)",
                "PII",
                "PIIC",
                "SII",
                "Síndrome de Intestino Irritable"
        ],
        "Patología Hepática": [
                "EHG",
                "Enfermedad Hepática Grasa",
                "HAC",
                "Hepatitis Agudas y Crónicas",
                "Patología Hepática",
                "Patología Hepática (Cirugía)",
                "PH",
                "PHC"
        ],
        "Cirrosis y sus Complicaciones": [
                "Ascitis",
                "Cirrosis y sus Complicaciones",
                "Cirrosis y sus Complicaciones (Cirugía)",
                "Cirrosis y sus Complicaciones / Trasplante Hepático",
                "CSC",
                "CSCC",
                "EH",
                "Encefalopatía Hepática",
                "Esprue",
                "PBE",
                "Peritonitis Bacteriana Espontánea",
                "STDA por Várices Esofágicas",
                "SVE",
                "TH",
                "Trasplante Hepático"
        ],
        "Patología Arterial y Venosa": [
                "EAP",
                "Enfermedad Arterial Periférica",
                "IAA",
                "Insuficiencia Arterial Aguda",
                "Patología Arterial y Venosa",
                "Patología Arterial y Venosa (Cirugía)",
                "PAV",
                "PAVC",
                "TP",
                "Tromboembolia Pulmonar",
                "Trombosis Venosa Profunda",
                "TVP"
        ],
        "Patología Perianal": [
                "Abscesos",
                "Fístulas",
                "Fisuras",
                "Hemorroides",
                "Patología Perianal",
                "Patología Perianal (Cirugía)",
                "PP",
                "PPC"
        ],
        "Urología": [
                "Cáncer de Próstata",
                "CP",
                "Hiperplasia Prostática",
                "HP",
                "Infección de Vías Urinarias",
                "Infección de vías urinarias bajas y altas",
                "IVU",
                "IVUs",
                "Litiasis Renal",
                "LR",
                "Prostatitis",
                "TT",
                "Tumores Testiculares",
                "UC",
                "Urología",
                "Urología (Cirugía)"
        ],
        "ETS": [
                "Chancro",
                "Chancroide",
                "EC",
                "ETS",
                "ETS (Cirugía)",
                "Herpes",
                "Linfogranuloma Venéreo",
                "LV",
                "Sífilis"
        ],
        "ATLS": [
                "AC",
                "AE",
                "ATLS",
                "ATLS (Cirugía)",
                "ATLS en Embarazada",
                "Choque",
                "FC",
                "Fractura de Cadera",
                "HE",
                "Hemorragia Epidural",
                "Síndromes Medulares",
                "SM",
                "SS",
                "Subaracnoidea y Subdural",
                "TA",
                "TC",
                "TCE",
                "TG",
                "Trauma Abdominal",
                "Trauma Craneoencefálico",
                "Trauma Genitourinario",
                "Trauma Torácico",
                "TT",
                "VA",
                "Vía Aérea"
        ],
        "Intoxicaciones y Picaduras": [
                "Alacranismo",
                "Intoxicaciones y Picaduras",
                "Intoxicaciones y Picaduras (Cirugía)",
                "IP",
                "IPC",
                "Latrodectismo",
                "Loxoscelismo",
                "Mordedura de Serpientes",
                "MS",
                "Toxíndromes",
                "Toxsíndromes"
        ],
        "Quemaduras, Golpe de Calor e Hipotermia": [
                "QGCH",
                "QGCHC",
                "Quemaduras, Golpe de Calor e Hipotermia",
                "Quemaduras, Golpe de Calor e Hipotermia (Cirugía)"
        ],
        "Cirugía Oncológica": [
                "Cáncer de Esófago",
                "CE",
                "Cirugía Oncología",
                "Cirugía Oncológica",
                "Cirugía Oncológica (Cirugía)",
                "CO",
                "COC",
                "Colon y Recto",
                "CR",
                "Gástrico",
                "Hepático",
                "Páncreas",
                "Renal",
                "Síndrome de Lynch",
                "SL"
        ],
        "Oftalmología": [
                "Ametropías",
                "Blefaritis",
                "Catarata",
                "Celulitis Periorbitaria",
                "Chalazión",
                "Conjuntivitis",
                "CP",
                "Dacrioadenitis",
                "Desprendimiento de Retina",
                "DR",
                "Epiescleritis",
                "Escleritis",
                "Glaucoma",
                "OC",
                "Oftalmología",
                "Oftalmología (Cirugía)",
                "Orzuelo",
                "PA",
                "Patología de Anexos",
                "Pinguécula",
                "Pterigión",
                "Queratocono",
                "RDH",
                "Retinopatía Diabética e Hipertensiva",
                "Síndrome de Ojo Seco",
                "SOS",
                "TO",
                "Tracoma",
                "Trauma Ocular",
                "Uveítis"
        ],
        "Otorrinolaringología": [
                "Absceso Periamigdalino",
                "AP",
                "Cáncer de Laringe",
                "CL",
                "EM",
                "Enfermedad de Meniere",
                "Hipoacusia y Vértigo",
                "HV",
                "Neuronitis Vestibular",
                "NV",
                "OC",
                "OMA",
                "OMM",
                "Otitis Media Maligna",
                "Otorrinolaringología",
                "Otorrinolaringología (Cirugía)",
                "Papilomatosis Laríngea",
                "PL",
                "SAOS",
                "Sx de Meniere",
                "VPPN"
        ],
        "Traumatología y Ortopedia": [
                "EG",
                "Embolia Grasa",
                "Esguince de Tobillo",
                "ET",
                "Fractura en Rama Verde",
                "FRV",
                "Patología de Extremidad Superior e Inferior",
                "PESI",
                "SC",
                "SDL",
                "Síndrome Compartimental",
                "Síndrome de Dolor Locorregional",
                "TO",
                "TOC",
                "Traumatología y Ortopedia",
                "Traumatología y Ortopedia (Cirugía)"
        ],
        "Introducción e Infectología": [
                "Antibióticos",
                "Choque séptico",
                "Choque Séptico",
                "CS",
                "II",
                "IIMI",
                "Introducción e Infectología",
                "Introducción e Infectología (Medicina Interna)",
                "Introducción MI / Introducción Infectología",
                "Sepsis",
                "SRIS"
        ],
        "Infecciones Específicas": [
                "Botulismo",
                "Brucelosis",
                "Carbunco",
                "Chagas",
                "Chikungunya",
                "Dengue",
                "IE",
                "IEMI",
                "Infecciones Específicas",
                "Infecciones Específicas (Medicina Interna)",
                "Lyme",
                "Malaria",
                "Paludismo",
                "Patología Fúngica",
                "PF",
                "Rabia",
                "Rickettsiosis",
                "Tétanos",
                "Tuberculosis",
                "Tularemia",
                "VIH",
                "Zika"
        ],
        "Neumología": [
                "Asbestosis",
                "Bisinois",
                "Bisinosis",
                "Cáncer de Pulmón",
                "CP",
                "Derrame Pleural",
                "DP",
                "EPOC",
                "Neumología",
                "Neumología (Medicina Interna)",
                "Neumonías Ocupacionales",
                "Neumonías Ocupacionales / Derrame Pleural",
                "NMI",
                "NO",
                "Sarcoidosis",
                "Silicosis"
        ],
        "Endocrinología": [
                "Addison",
                "Cáncer",
                "Cetoacidosis",
                "Cushing",
                "DI",
                "Diabetes Insípida",
                "Diabetes Mellitus",
                "DM",
                "EH",
                "EMI",
                "Endocrinología",
                "Endocrinología (Medicina Interna)",
                "Estado Hiperosmolar",
                "Graves",
                "Hashimoto",
                "Hiperprolactinemia",
                "Patología Tiroidea",
                "PT",
                "Quervain",
                "Riedel",
                "Síndrome Metabólico",
                "SM"
        ],
        "Hematología": [
                "AC",
                "Anemias Carenciales",
                "Esferocitosis",
                "Ferropénica",
                "Hematología",
                "Hematología (Medicina Interna)",
                "Hemofilia",
                "Hemolíticas",
                "HMI",
                "Leucemias",
                "LHNH",
                "Linfoma Hodgkin",
                "Linfoma Hodgkin y No Hodgkin",
                "Linfoma No Hodgkin",
                "LLA",
                "LMA",
                "LMC",
                "Megaloblástica",
                "Púrpura",
                "Síndromes Mielodisplásicos",
                "SM",
                "Talasemias",
                "Von Willebrand",
                "VW"
        ],
        "Cardiología": [
                "AB",
                "ACLS y BLS",
                "Angina",
                "Cardiología",
                "Cardiología (Medicina Interna)",
                "CMI",
                "Endocarditis",
                "FA",
                "Fibrilación Auricular",
                "HA",
                "Hipertensión Arterial",
                "IAM",
                "IC",
                "Infarto Agudo al Miocardio",
                "Insuficiencia Cardíaca",
                "Insuficiencia Cardíaca Aguda y Crónica",
                "Miocarditis",
                "Pericarditis",
                "SC",
                "Síndromes Coronarios",
                "Taquicardia Ventricular",
                "TR",
                "Trastornos del Ritmo",
                "TV",
                "Valvulopatías"
        ],
        "Neurología": [
                "Alzheimer",
                "Cefaleas",
                "CL",
                "Cuerpos de Lewy",
                "Demencias",
                "EIH",
                "ELA",
                "EM",
                "Esclerosis Múltiple",
                "EVC Isquémico y Hemorrágico",
                "GB",
                "Guillain-Barré",
                "MG",
                "Miastenia Gravis",
                "Migraña",
                "Neurología",
                "Neurología (Medicina Interna)",
                "NMI",
                "Parkinson",
                "Tensional"
        ],
        "Dermatología": [
                "Acné",
                "CA basocelular",
                "CA espinocelular",
                "Cáncer basocelular",
                "Cáncer Basocelular y Espinocelular",
                "Cáncer espinocelular",
                "CBE",
                "Dermatología",
                "Dermatología (Medicina Interna)",
                "DMI",
                "Lepra",
                "Liquen Plano",
                "LP",
                "Melanoma",
                "Pénfigo Vulgar",
                "Pitiriasis Versicolor",
                "Psoriasis",
                "PV",
                "SJ",
                "Stevens-Johnson",
                "Tiñas",
                "Vitiligo"
        ],
        "Reumatología": [
                "AR",
                "Artritis Reumatoide",
                "Espondilopatías",
                "Fibromialgia",
                "LES",
                "Osteoartritis",
                "Reumatología",
                "Reumatología (Medicina Interna)",
                "RMI",
                "Síndrome de Sjögren",
                "SS",
                "Vasculitis"
        ],
        "Nefrología": [
                "Abscesos Renales",
                "AR",
                "Nefrología",
                "Nefrología (Medicina Interna)",
                "NMI",
                "Síndrome Nefrítico",
                "Síndrome Nefrótico",
                "SN",
                "Sx nefrítico",
                "Sx nefrótico"
        ],
        "Psiquiatría": [
                "Adicciones",
                "Autismo",
                "Delirium Tremens",
                "DT",
                "Esquizofrenia",
                "PMI",
                "Psiquiatría",
                "Psiquiatría (Medicina Interna)",
                "TDAH",
                "Trastornos del Sueño",
                "TS"
        ],
        "Geriatría": [
                "Escalas geriátricas",
                "Geriatría",
                "Geriatría (Medicina Interna)",
                "GMI",
                "SEG",
                "Síndromes y Escalas Geriátricas",
                "Sx geriátricos"
        ],
        "Epidemiología": [
                "EMI",
                "Epidemiología",
                "Epidemiología (Medicina Interna)"
        ]
    };

    const TEMARIO_ACRONYM_STOPWORDS = new Set(["de", "del", "la", "las", "el", "los", "y", "en", "con", "sin", "por", "para", "al"]);
    const buildAcronymKey = (value) => {
        const tokens = normalizeTextKey(value)
            .split(" ")
            .filter(token => token && !TEMARIO_ACRONYM_STOPWORDS.has(token));
        if (tokens.length < 2 || tokens.length > 6) return "";
        const acronym = tokens.map(token => token[0]).join("");
        return acronym.length >= 2 && acronym.length <= 6 ? acronym : "";
    };
    const buildTemarioEntry = (topic, aliases = []) => {
        const key = normalizeTextKey(topic);
        const termKeys = new Set();
        const searchKeys = new Set();
        [topic, ...(Array.isArray(aliases) ? aliases : [])].forEach(value => {
            const cleanValue = sanitizeTopicLabel(value || "");
            const normalized = normalizeTextKey(cleanValue);
            if (!normalized) return;
            termKeys.add(normalized);
            searchKeys.add(normalized);
            const acronym = buildAcronymKey(cleanValue);
            if (acronym) searchKeys.add(acronym);
        });
        return {
            key,
            topic,
            aliases: Array.from(new Set([topic, ...(Array.isArray(aliases) ? aliases : [])].map(v => sanitizeTopicLabel(v || "")).filter(Boolean))),
            termKeys: Array.from(termKeys),
            searchKeys: Array.from(searchKeys),
            count: 0,
            specs: new Set(),
            source: "temario"
        };
    };
    const caseLabelMatchesTopicTerm = (labelKey, termKey) => {
        if (!labelKey || !termKey) return false;
        if (labelKey === termKey) return true;
        if (termKey.length >= 4 && labelKey.includes(termKey)) return true;
        return false;
    };
    const caseMatchesTemarioEntry = (q, temarioEntry) => {
        if (!temarioEntry || !Array.isArray(temarioEntry.termKeys) || temarioEntry.termKeys.length === 0) return false;
        const labelKeys = getCaseTopicLabelKeys(q);
        if (labelKeys.length === 0) return false;
        return temarioEntry.termKeys.some(termKey => labelKeys.some(labelKey => caseLabelMatchesTopicTerm(labelKey, termKey)));
    };
    const buildTemarioTopicCatalog = () => {
        const catalog = new Map();
        Object.entries(TEMARIO_MAPPING).forEach(([topic, aliases]) => {
            const entry = buildTemarioEntry(topic, aliases);
            if (entry.key) catalog.set(entry.key, entry);
        });

        if (typeof QUESTIONS !== "undefined" && Array.isArray(QUESTIONS)) {
            QUESTIONS.forEach(q => {
                if (!q) return;
                const spec = normalizeSpecialtyToTroncal(q);
                if (!TRONCAL_SPECIALTIES.includes(spec)) return;
                catalog.forEach(entry => {
                    if (caseMatchesTemarioEntry(q, entry)) {
                        entry.count++;
                        entry.specs.add(spec);
                    }
                });
            });
        }

        return catalog;
    };
    const getTemarioTopicCatalog = () => {
        if (!__temarioTopicCatalogCache) __temarioTopicCatalogCache = buildTemarioTopicCatalog();
        return __temarioTopicCatalogCache;
    };
    const buildTemarioSuggestionCatalog = () => {
        const catalog = new Map();
        const topicCatalog = getTemarioTopicCatalog();
        const topicIndex = getTopicIndex();
        Object.entries(TEMARIO_MAPPING).forEach(([topic, aliases]) => {
            const entry = buildTemarioEntry(topic, aliases);
            if (!entry.key) return;
            const temarioEntry = topicCatalog.get(entry.key);
            if (temarioEntry) {
                entry.count = temarioEntry.count || 0;
                entry.specs = new Set(temarioEntry.specs ? Array.from(temarioEntry.specs) : []);
            } else {
                const indexedEntry = topicIndex.get(entry.key);
                if (indexedEntry) {
                    entry.count = indexedEntry.count || 0;
                    entry.specs = new Set(indexedEntry.specs ? Array.from(indexedEntry.specs) : []);
                }
            }
            catalog.set(entry.key, entry);
        });
        return catalog;
    };
    const getTemarioSuggestionCatalog = () => {
        if (!__temarioSuggestionCatalogCache) {
            __temarioSuggestionCatalogCache = buildTemarioSuggestionCatalog();
        }
        return __temarioSuggestionCatalogCache;
    };
    const getTemarioSuggestionEntries = () => {
        if (!__temarioSuggestionEntriesCache) {
            __temarioSuggestionEntriesCache = Array.from(getTemarioSuggestionCatalog().values());
        }
        return __temarioSuggestionEntriesCache;
    };
    const prewarmHeavyTopicCatalog = () => {
        const run = () => {
            try {
                getTemarioTopicCatalog();
            } catch (err) {
                console.warn("No se pudo precalentar el catálogo avanzado de temas:", err);
            }
        };
        if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
            window.requestIdleCallback(() => run(), { timeout: 1200 });
            return;
        }
        setTimeout(run, 300);
    };

    // ---------------------------------------------------------------------------
    // Advanced Setup Logic: Topic Search & Tags
    // ---------------------------------------------------------------------------
    const setupTopicSearch = () => {
        const input = $("setup-topic-filter");
        const suggestionsCont = $("topic-suggestions");
        const selectedCont = $("selected-topics-container");
        let activeIndex = -1;
        let suggestionTimer = null;

        if (!input || !suggestionsCont || !selectedCont) return;
        State.selectedTopics = (State.selectedTopics || []).filter(topic => !isTopicQueryTag(topic));

        const updateSelectedTags = () => {
            selectedCont.innerHTML = "";
            State.selectedTopics.forEach((topic, index) => {
                const tag = document.createElement("div");
                tag.className = "topic-tag";
                const label = getTopicTagLabel(topic);
                tag.innerHTML = `
                    <span>${escapeHtml(label)}</span>
                    <span class="remove-tag">&times;</span>
                `;
                tag.querySelector(".remove-tag").onclick = () => {
                    State.selectedTopics.splice(index, 1);
                    updateSelectedTags();
                };
                selectedCont.appendChild(tag);
            });
        };

        const showSuggestions = (val) => {
            if (!isPremiumActive()) {
                suggestionsCont.classList.remove("active");
                return;
            }
            const normalizedVal = val.toLowerCase().trim();
            if (!normalizedVal) {
                suggestionsCont.classList.remove("active");
                return;
            }

            const selectedSpecs = $$(".spec-item.checked").map(i => i.dataset.spec).filter(Boolean);
            const selectedSpecSet = selectedSpecs.length > 0 ? new Set(selectedSpecs) : null;
            const selectedTopicState = buildSelectedTopicState(State.selectedTopics);
            const selectedTopicKeys = selectedTopicState.topicKeys;
            const searchVal = normalizeTextKey(normalizedVal);
            const indexedTopics = getTemarioSuggestionEntries()
                .filter(entry => {
                    if (!entry || !entry.topic) return false;
                    if (selectedSpecSet) {
                        let match = false;
                        entry.specs.forEach(s => { if (selectedSpecSet.has(s)) match = true; });
                        if (!match && entry.count > 0) return false;
                    }
                    const topicKey = entry.key || normalizeTextKey(entry.topic);
                    if (!topicKey) return false;
                    if (selectedTopicKeys.has(topicKey)) return false;
                    return entry.searchKeys.some(searchKey => topicKeyMatchesQuery(searchKey, searchVal));
                })
                .sort((a, b) => {
                    const aExact = a.searchKeys.some(searchKey => searchKey === searchVal) ? 1 : 0;
                    const bExact = b.searchKeys.some(searchKey => searchKey === searchVal) ? 1 : 0;
                    if (bExact !== aExact) return bExact - aExact;
                    const aContains = a.searchKeys.some(searchKey => searchKey.includes(searchVal)) ? 1 : 0;
                    const bContains = b.searchKeys.some(searchKey => searchKey.includes(searchVal)) ? 1 : 0;
                    if (bContains !== aContains) return bContains - aContains;
                    const aHasCases = a.count > 0 ? 1 : 0;
                    const bHasCases = b.count > 0 ? 1 : 0;
                    if (bHasCases !== aHasCases) return bHasCases - aHasCases;
                    if (b.count !== a.count) return b.count - a.count;
                    return a.topic.localeCompare(b.topic, "es");
                });

            const filtered = indexedTopics.slice(0, 30);

            if (filtered.length === 0) {
                suggestionsCont.classList.remove("active");
                return;
            }

            suggestionsCont.innerHTML = "";
            activeIndex = -1;
            filtered.forEach((entry, idx) => {
                const item = document.createElement("div");
                item.className = "suggestion-item";
                item.style.cssText = "display:flex; justify-content:space-between; align-items:center; gap:8px;";
                const count = entry.count || 0;
                item.innerHTML = `<span>${escapeHtml(entry.topic)}</span>${count > 0 ? `<span style="font-size:10px;color:var(--accent-green);font-weight:700;background:rgba(5,192,127,0.12);padding:1px 6px;border-radius:10px;flex-shrink:0;">${count}</span>` : ''}`;
                item.dataset.index = idx;
                item.dataset.topic = entry.topic;
                item.onclick = () => {
                    addTopic(entry.topic, input.value.trim());
                };
                suggestionsCont.appendChild(item);
            });
            suggestionsCont.classList.add("active");
        };

        const addTopicQuery = (rawQuery) => {
            const queryTag = makeTopicQueryTag(rawQuery);
            if (!queryTag) return;
            if (!State.selectedTopics.includes(queryTag)) {
                clearSelectedPreset();
                State.selectedTopics.push(queryTag);
                updateSelectedTags();
            }
            input.value = "";
            suggestionsCont.classList.remove("active");
            activeIndex = -1;
        };

        const addTopic = (topic, sourceQuery = "") => {
            if (!isPremiumActive()) {
                showNotification("Temas específicos disponibles solo en premium.", "warning");
                openRedeemModal("Desbloquea premium para usar filtros por tema/GPC.");
                return;
            }
            const topicKey = normalizeTextKey(topic);
            const temarioMap = getTemarioSuggestionCatalog();
            const match = temarioMap.get(topicKey);
            if (!match || !match.topic) {
                showNotification("Selecciona un tema principal oficial del temario.", "warning");
                return;
            }
            const cleanTopic = match.topic;
            const selectedTopicState = buildSelectedTopicState(State.selectedTopics);
            if (!selectedTopicState.topicKeys.has(topicKey)) {
                clearSelectedPreset();
                State.selectedTopics.push(cleanTopic);
                updateSelectedTags();
            }

            const sourceKey = normalizeTextKey(sourceQuery || "");
            const topicNameKey = normalizeTextKey(cleanTopic);
            if (sourceKey && topicNameKey && sourceKey !== topicNameKey) {
                showNotification(`Se recomendó el tema principal "${cleanTopic}" para tu búsqueda.`, "info");
            }
            input.value = "";
            suggestionsCont.classList.remove("active");
            activeIndex = -1;
        };

        input.addEventListener("input", (e) => {
            if (suggestionTimer) clearTimeout(suggestionTimer);
            const nextValue = e.target.value;
            suggestionTimer = setTimeout(() => {
                suggestionTimer = null;
                showSuggestions(nextValue);
            }, 60);
        });

        input.addEventListener("keydown", (e) => {
            const items = suggestionsCont.querySelectorAll(".suggestion-item");

            if (e.key === "ArrowDown") {
                if (!items.length) return;
                activeIndex = (activeIndex + 1) % items.length;
                e.preventDefault();
            } else if (e.key === "ArrowUp") {
                if (!items.length) return;
                activeIndex = (activeIndex - 1 + items.length) % items.length;
                e.preventDefault();
            } else if (e.key === "Enter") {
                if (activeIndex >= 0 && items[activeIndex]) {
                    addTopic(items[activeIndex].dataset.topic || "", input.value.trim());
                } else if (input.value.trim() !== "") {
                    const typedKey = normalizeTextKey(input.value.trim());
                    const temarioMap = getTemarioSuggestionCatalog();
                    const exact = temarioMap.get(typedKey);
                    if (exact && exact.topic) addTopic(exact.topic, input.value.trim());
                    else {
                        const candidates = getTemarioSuggestionEntries()
                            .filter(entry => entry && entry.topic && entry.searchKeys.some(searchKey => topicKeyMatchesQuery(searchKey, typedKey)))
                            .sort((a, b) => {
                                const aExact = a.searchKeys.some(searchKey => searchKey === typedKey) ? 1 : 0;
                                const bExact = b.searchKeys.some(searchKey => searchKey === typedKey) ? 1 : 0;
                                if (bExact !== aExact) return bExact - aExact;
                                if ((b.count || 0) !== (a.count || 0)) return (b.count || 0) - (a.count || 0);
                                return a.topic.localeCompare(b.topic, "es");
                            });
                        if (candidates.length >= 1) {
                            addTopic(candidates[0].topic, input.value.trim());
                            if (candidates.length > 1 && normalizeTextKey(candidates[0].topic) === typedKey) {
                                showNotification(`Se agregó "${candidates[0].topic}". Puedes añadir más coincidencias desde la lista.`, "info");
                            }
                        } else {
                            showNotification("Usa un tema oficial. Si escribes un subtema, te sugerimos su tema principal.", "warning");
                        }
                    }
                }
                e.preventDefault();
            } else if (e.key === "Escape") {
                suggestionsCont.classList.remove("active");
            }

            items.forEach((item, idx) => {
                item.classList.toggle("hover", idx === activeIndex);
                if (idx === activeIndex) item.style.background = "rgba(5, 192, 127, 0.15)";
                else item.style.background = "";
            });
        });

        document.addEventListener("click", (e) => {
            if (!input.contains(e.target) && !suggestionsCont.contains(e.target)) {
                suggestionsCont.classList.remove("active");
            }
        });
    };

    // ---------------------------------------------------------------------------
    // Advanced Setup Logic
    // ---------------------------------------------------------------------------
    const initSetupLogic = () => {
        const qtySlider = $("setup-qty-slider");
        const qtyVal = $("setup-qty-val");
        const timeInput = $("setup-time-minutes");
        const timeLabel = $("setup-time-label");
        const libBtn = $("time-libre-btn");
        const getSelectedSetupSpecsRaw = () => $$(".spec-item.checked").map(i => i.dataset.spec).filter(Boolean);
        const getEffectiveSelectedSetupSpecs = () => {
            const selected = getSelectedSetupSpecsRaw();
            if (selected.includes("random")) return [];
            return selected.filter(spec => TRONCAL_SPECIALTIES.includes(spec));
        };
        const syncSetupSpecialtiesState = () => {
            State.selectedSpecialties = getSelectedSetupSpecsRaw();
        };

        // Slider interaction
        if (qtySlider) {
            qtySlider.addEventListener("input", () => {
                qtyVal.textContent = qtySlider.value;
                clearSelectedPreset();
            });
        }

        // Preset cards
        $$(".preset-card").forEach(card => {
            card.addEventListener("click", () => {
                if (card.dataset.premium === "1" && !isPremiumActive()) {
                    showNotification("Preset premium bloqueado.", "warning");
                    openRedeemModal("Este preset es premium. Ingresa tu c\u00f3digo para desbloquearlo.");
                    return;
                }
                activatePresetCard(card);
                const q = card.dataset.qty;
                const t = card.dataset.time;
                if (qtySlider) {
                    qtySlider.value = q;
                    qtyVal.textContent = q;
                }
                if (timeInput) {
                    timeInput.value = t;
                    timeLabel.textContent = `${t} MIN`;
                    if (libBtn) libBtn.classList.remove("active");
                }

                if (card.id === "preset-real") {
                    $$(".spec-item").forEach(i => {
                        if (i.dataset.spec === "random") i.classList.remove("checked");
                        else i.classList.add("checked");
                    });
                    syncSetupSpecialtiesState();
                    State.difficulty = "cualquiera";
                    $$(".diff-btn").forEach(b => b.classList.toggle("active", b.dataset.diff === "cualquiera"));
                }
            });
        });

        if (!State.selectedPresetId) {
            const activePreset = document.querySelector(".preset-card.active");
            State.selectedPresetId = activePreset ? activePreset.id : null;
        }

        $$(".spec-item").forEach(item => {
            item.addEventListener("click", () => {
                const spec = item.dataset.spec || "";
                if (!isPremiumActive() && spec !== "random") {
                    showNotification("En gratis solo puedes usar la especialidad Aleatorio.", "warning");
                    openRedeemModal("Desbloquea premium para elegir especialidades específicas.");
                    return;
                }
                clearSelectedPreset();
                if (spec === "random") {
                    $$(".spec-item").forEach(i => i.classList.toggle("checked", i.dataset.spec === "random"));
                    syncSetupSpecialtiesState();
                    return;
                }
                const randomItem = document.querySelector('.spec-item[data-spec="random"]');
                if (randomItem) randomItem.classList.remove("checked");
                item.classList.toggle("checked");
                syncSetupSpecialtiesState();
            });
        });

        if (qtySlider) {
            // Also sync State.setupQty on every slider change
            qtySlider.addEventListener("input", () => {
                State.setupQty = parseInt(qtySlider.value, 10);
            });
            State.setupQty = parseInt(qtySlider.value, 10);
        }

        $$(".mode-toggle-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                if (btn.disabled) return;
                $$(".mode-toggle-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
            });
        });
        $$(".diff-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                if (!isPremiumActive() && btn.dataset.diff !== "cualquiera") {
                    showNotification("En demo solo puedes usar dificultad Cualquiera.", "warning");
                    openRedeemModal("Desbloquea premium para elegir dificultad.");
                    return;
                }
                clearSelectedPreset();
                $$(".diff-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                State.difficulty = btn.dataset.diff;
            });
        });

        if (libBtn) {
            libBtn.addEventListener("click", () => {
                clearSelectedPreset();
                libBtn.classList.toggle("active");
                if (libBtn.classList.contains("active")) {
                    timeLabel.textContent = "LIBRE";
                    if (timeInput) timeInput.value = "";
                }
            });
        }

        // Logic for Dynamic Topic Search
        setupTopicSearch();
        if (timeInput) {
            timeInput.addEventListener("input", () => {
                clearSelectedPreset();
                if (timeInput.value) {
                    if (libBtn) libBtn.classList.remove("active");
                    timeLabel.textContent = `${timeInput.value} MIN`;
                } else {
                    if (libBtn) libBtn.classList.add("active");
                    timeLabel.textContent = "LIBRE";
                }
            });
        }

        $$(".btn-panel-back").forEach(b => b.addEventListener("click", () => $("nav-dashboard").click()));

        const btnStart = $("btn-start-final-exam");
        if (btnStart) {
            btnStart.addEventListener("click", async () => {
                const activePresetId = document.querySelector(".preset-card.active")?.id || null;
                const isRealSim = State.selectedPresetId === "preset-real" && activePresetId === "preset-real";
                const selectedSpecs = getEffectiveSelectedSetupSpecs();
                const hasRandomSpecialty = getSelectedSetupSpecsRaw().includes("random");
                if (!isRealSim && selectedSpecs.length === 0 && State.selectedTopics.length === 0 && !hasRandomSpecialty) {
                    return showNotification("Selecciona al menos una especialidad o un tema personalizado.");
                }

                if (!qtySlider) {
                    console.error("No se encontró el slider de cantidad.");
                    return;
                }

                let qty = parseInt(qtySlider.value, 10);
                const timerVal = parseInt(timeInput ? timeInput.value : 0, 10);
                let isLibre = libBtn ? libBtn.classList.contains("active") : true;
                const hasPremium = isPremiumActive();

                if (isRealSim && !hasPremium) {
                    showNotification("El simulacro real es premium.", "warning");
                    openRedeemModal("El simulacro real est\u00e1 disponible solo en premium.");
                    return;
                }

                if (!hasPremium) {
                    if (State.selectedTopics.length > 0) {
                        State.selectedTopics = [];
                        const selectedCont = $("selected-topics-container");
                        if (selectedCont) selectedCont.innerHTML = "";
                    }
                    if (State.difficulty !== "cualquiera") {
                        State.difficulty = "cualquiera";
                        $$(".diff-btn").forEach(b => b.classList.toggle("active", b.dataset.diff === "cualquiera"));
                        showNotification("En demo la dificultad está fija en Cualquiera.", "info");
                    }
                    if (qty > DEMO_MAX_QTY) {
                        qty = DEMO_MAX_QTY;
                        if (qtySlider) qtySlider.value = String(DEMO_MAX_QTY);
                        if (qtyVal) qtyVal.textContent = String(DEMO_MAX_QTY);
                        showNotification(`Demo limitada a ${DEMO_MAX_QTY} preguntas.`, "info");
                    }
                    if (!isLibre) {
                        if (timeInput) timeInput.value = "";
                        if (libBtn) libBtn.classList.add("active");
                        if (timeLabel) timeLabel.textContent = "LIBRE";
                        isLibre = true;
                        showNotification("En demo, el tiempo es libre.", "info");
                    }
                }

                await withTemporaryButtonLabel(btnStart, "Preparando...", async () => {
                    await withExamLoadingOverlay(async (setStage) => {
                        await setStage({
                            title: isRealSim ? "Preparando simulacro real..." : "Preparando examen...",
                            detail: "Estamos cargando el banco de preguntas.",
                            progress: 12
                        });

                        try {
                            await ensureQuestionsReady({ silent: false });
                        } catch (err) {
                            return;
                        }

                        if (isRealSim) {
                            await setStage({
                                detail: "Estamos seleccionando las preguntas del simulacro real.",
                                progress: 62
                            });

                            const realSet = buildRealSimulacroQuestionSet();
                            if (!realSet.questionSet || realSet.questionSet.length === 0) {
                                return showNotification("No hay suficientes preguntas para generar el simulacro real.", "warning");
                            }

                            if (realSet.warnings.length > 0) {
                                showNotification(realSet.warnings[0], "warning");
                            }

                            await setStage({
                                detail: "Abriendo tu examen.",
                                progress: 100
                            });

                            beginExamSession({
                                questionSet: realSet.questionSet,
                                mode: "simulacro",
                                currentExamIsReal: true,
                                currentExamType: "Simulacro Real",
                                durationSec: isLibre ? 0 : (timerVal || REAL_SIM_CONFIG.timeMin) * 60
                            });
                            return;
                        }

                        await setStage({
                            detail: "Estamos aplicando tus filtros y buscando preguntas.",
                            progress: 34
                        });

                        const {
                            primary: poolPrimary,
                            secondary: poolSecondary
                        } = buildFilteredQuestionPools({
                            specs: selectedSpecs,
                            selectedTopics: State.selectedTopics,
                            difficulty: State.difficulty
                        });

                        if (poolPrimary.length === 0 && poolSecondary.length === 0) {
                            return showNotification(`No hay preguntas. Revisa tus filtros:\n- Especialidades marcadas: ${selectedSpecs.length}\n- Temas buscados: ${State.selectedTopics.length}\n- Dificultad: ${State.difficulty}\nIntenta poner la dificultad en "Cualquiera".`);
                        }

                        await setStage({
                            detail: "Estamos armando el simulacro y ordenando las preguntas.",
                            progress: 72
                        });

                        let flatPrimary = processAndFlattenPool(poolPrimary, qty);
                        let finalQuestionSet = flatPrimary;
                        let neededOtherDiffs = false;

                        if (flatPrimary.length < qty && poolSecondary.length > 0) {
                            let missing = qty - flatPrimary.length;
                            let flatSecondary = processAndFlattenPool(poolSecondary, missing);
                            if (flatSecondary.length > 0) {
                                finalQuestionSet = flatPrimary.concat(flatSecondary);
                                neededOtherDiffs = true;
                            }
                        }

                        let finalQty = finalQuestionSet.length;
                        if (neededOtherDiffs) {
                            showNotification(`Se utilizaron las preguntas disponibles de dificultad "${State.difficulty}". Se completó el resto con otras dificultades.`);
                        } else if (finalQty < qty) {
                            showNotification(`La base de datos contiene solo ${finalQty} preguntas aplicables a tu filtro actual. Limitando el simulacro a esa cantidad.`);
                        }

                        await setStage({
                            detail: "Abriendo tu examen.",
                            progress: 100
                        });

                        const selectedModeBtn = document.querySelector(".mode-toggle-btn.active");
                        const modeVal = selectedModeBtn ? selectedModeBtn.dataset.examMode : "casos";
                        beginExamSession({
                            questionSet: finalQuestionSet,
                            mode: !hasPremium ? "estudio" : (modeVal === "casos" ? "simulacro" : "estudio"),
                            currentExamIsReal: false,
                            currentExamType: !hasPremium ? "Demo Estudio" : (isLibre ? "Estudio Libre" : "Examen Cronometrado"),
                            durationSec: !hasPremium ? 0 : (isLibre ? 0 : (timerVal || 60) * 60)
                        });
                    }, {
                        title: isRealSim ? "Preparando simulacro real..." : "Preparando examen...",
                        detail: "Estamos organizando tus preguntas.",
                        progress: 8
                    });
                });
            });
        }
    };

    // ---------------------------------------------------------------------------
    // Dashboard Shortcuts
    // ---------------------------------------------------------------------------
    const initDashboardShortcuts = () => {
        const btnRefuerzosView = $("btn-refuerzos-view");
        if (btnRefuerzosView) {
            btnRefuerzosView.addEventListener("click", () => {
                if (!ensurePremiumAccess("Las zonas de refuerzo son una funci\u00f3n premium.")) return;
                renderRefuerzosView();
                showView("view-refuerzos");
            });
        }

        // Dashboard quick action buttons (inside view-refuerzos now, but keep bindings)
        const bindStartBtn = (id, handler, requiresPremium = false) => {
            const el = document.getElementById(id);
            if (el && !el.disabled) {
                el.addEventListener("click", async () => {
                    if (requiresPremium && !ensurePremiumAccess("Esta acci\u00f3n es premium.")) return;
                    await handler(el);
                });
            }
        };

        const handleInteligente = async (triggerButton) => {
            if (State.topFailedTemas && State.topFailedTemas.length > 0) {
                await startTemaSession(State.topFailedTemas, 5, "Refuerzo IA por Temas", triggerButton);
            } else {
                showNotification("Aún no tienes puntos de falla registrados. Sigue practicando para que la IA detecte tus áreas de oportunidad.");
            }
        };

        bindStartBtn("btn-refuerzo-ia", handleInteligente, true);
        bindStartBtn("btn-refuerzo-ia-dash", handleInteligente, true); // New Dash Button
        bindStartBtn("btn-refuerzo-rapido", triggerButton => startQuickSession(['mi', 'ped', 'gyo', 'cir'], 5, "Refuerzo Rápido General", triggerButton), true);
        bindStartBtn("btn-quick-start", triggerButton => startQuickSession(['mi', 'ped', 'gyo', 'cir'], 10, "Sesión Rápida (10)", triggerButton), true);
        bindStartBtn("btn-refuerzo-casos", triggerButton => startQuickSession(['mi', 'ped', 'gyo', 'cir'], 3, "Casos Rápidos Aleatorios", triggerButton), true);
        bindStartBtn("btn-curva-olvido", startSpacedRepetition, true);
        bindStartBtn("btn-curva-olvido-dash", startSpacedRepetition, true); // New Dash Button
        bindStartBtn("btn-curva-olvido-ref", startSpacedRepetition, true);
    };

    const startSpacedRepetition = async (triggerButton) => {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const sevenDays = 7 * oneDay;
        const thirtyDays = 30 * oneDay;

        // Buscamos sesiones que ocurrieron hace aprox 24h, 7d o 30d
        const targets = [oneDay, sevenDays, thirtyDays];
        const tolerance = 12 * 60 * 60 * 1000; // Ventana de 12 horas

        const themesToReview = new Set();

        State.history.forEach(session => {
            const age = now - session.timestamp;
            const matches = targets.some(t => Math.abs(age - t) < tolerance);

            if (matches && session.questionSet) {
                session.questionSet.forEach(q => {
                    const t = getCaseCanonicalTopic(q);
                    if (t) themesToReview.add(t);
                });
            }
        });

        if (themesToReview.size === 0) {
            showNotification("No hay temas críticos para repaso según la Curva del Olvido hoy. \n\nRecuerda: El sistema programa repasos automáticos a las 24h, 7 días y 30 días de tus sesiones de estudio.");
            return;
        }

        const themesArr = Array.from(themesToReview);
        await startTemaSession(themesArr, 15, "Repaso: Curva del Olvido", triggerButton);
    };

    const startTemaSession = async (temas, qty, label, triggerButton = null) => {
        await withTemporaryButtonLabel(triggerButton, "Preparando...", async () => {
            await withExamLoadingOverlay(async (setStage) => {
                await setStage({
                    title: "Preparando sesión...",
                    detail: "Estamos cargando el banco de preguntas.",
                    progress: 12
                });

                try {
                    await ensureQuestionsReady({ silent: false });
                } catch (err) {
                    return;
                }

                await setStage({
                    detail: "Estamos buscando preguntas del tema seleccionado.",
                    progress: 48
                });

                let pool = buildFilteredQuestionPools({
                    selectedTopics: temas || []
                }).primary;
                if (pool.length === 0) pool = filterQuarantinedPool(QUESTIONS);

                let finalQty = qty;
                if (qty > pool.length) {
                    finalQty = pool.length;
                    showNotification(`Solo tenemos ${pool.length} preguntas disponibles para este tema.`);
                }

                await setStage({
                    detail: "Abriendo tu sesión de práctica.",
                    progress: 100
                });

                beginExamSession({
                    questionSet: processAndFlattenPool(pool, finalQty),
                    mode: "simulacro",
                    currentExamIsReal: false,
                    currentExamType: label,
                    durationSec: 0
                });
            }, {
                title: "Preparando sesión...",
                detail: "Estamos organizando tus preguntas.",
                progress: 8
            });
        });
    };

    const startQuickSession = async (specs, qty, label, triggerButton = null) => {
        await withTemporaryButtonLabel(triggerButton, "Preparando...", async () => {
            await withExamLoadingOverlay(async (setStage) => {
                await setStage({
                    title: "Preparando sesión rápida...",
                    detail: "Estamos cargando el banco de preguntas.",
                    progress: 12
                });

                try {
                    await ensureQuestionsReady({ silent: false });
                } catch (err) {
                    return;
                }

                await setStage({
                    detail: "Estamos seleccionando preguntas para tu sesión rápida.",
                    progress: 50
                });

                let pool = filterQuarantinedPool(getQuestionsPoolForSpecs(specs || []));
                if (pool.length === 0) pool = filterQuarantinedPool(QUESTIONS);

                let finalQty = qty;
                if (qty > pool.length) {
                    finalQty = pool.length;
                }

                await setStage({
                    detail: "Abriendo tu sesión de práctica.",
                    progress: 100
                });

                beginExamSession({
                    questionSet: processAndFlattenPool(pool, finalQty),
                    mode: "simulacro",
                    currentExamIsReal: false,
                    currentExamType: label,
                    durationSec: 0
                });
            }, {
                title: "Preparando sesión rápida...",
                detail: "Estamos organizando tus preguntas.",
                progress: 8
            });
        });
    };

    // ---------------------------------------------------------------------------
    // Exam Engine
    // ---------------------------------------------------------------------------
    const renderExamQuestion = () => {
        if (!State.questionSet || State.questionSet.length === 0) return;

        let qFirst = State.questionSet[State.currentIndex];

        // Normalizar currentIndex al inicio del grupo (caso clínico)
        const groupId = qFirst.caseGroupId;
        let firstIdx = State.currentIndex;
        while (firstIdx > 0 && State.questionSet[firstIdx - 1].caseGroupId === groupId) {
            firstIdx--;
        }
        State.currentIndex = firstIdx;
        qFirst = State.questionSet[State.currentIndex];

        const total = State.questionSet.length;

        const indices = [];
        for (let i = State.currentIndex; i < total; i++) {
            if (State.questionSet[i].caseGroupId === groupId) indices.push(i);
            else break;
        }

        const badge = $("case-area-badge"); if (badge) badge.textContent = (State.globalStats.bySpecialty[qFirst.specialty]?.name || qFirst.specialty).toUpperCase();
        const caseText = $("case-text"); if (caseText) caseText.textContent = qFirst.case;
        const reclassBtn = $("btn-reclass-case");
        const deleteBtn = $("btn-delete-case");
        if (reclassBtn) {
            if (canReclassifyUser()) {
                reclassBtn.style.display = "inline-flex";
                reclassBtn.onclick = () => {
                    const key = getCaseKey(qFirst);
                    if (!key) {
                        showNotification("No se pudo identificar el caso para reclasificar.", "warning");
                        return;
                    }
                    State.reclassSelectedKey = key;
                    showView("view-reclassify");
                };
            } else {
                reclassBtn.style.display = "none";
                reclassBtn.onclick = null;
            }
        }
        if (deleteBtn) {
            if (canReclassifyUser()) {
                deleteBtn.style.display = "inline-flex";
                deleteBtn.onclick = () => {
                    const key = getCaseKey(qFirst);
                    if (!key) {
                        showNotification("No se pudo identificar el caso para eliminar.", "warning");
                        return;
                    }
                    if (State.deletedCaseKeys && State.deletedCaseKeys.has(key)) {
                        showNotification("Este caso ya esta eliminado.", "info");
                        return;
                    }
                    if (!confirm("¿Eliminar este caso del banco de preguntas? Esta accion no se puede deshacer.")) return;
                    deleteCaseKey(key, { removeFromCurrentExam: true });
                    renderExamQuestion();
                    showNotification("Caso eliminado del banco.", "success");
                };
            } else {
                deleteBtn.style.display = "none";
                deleteBtn.onclick = null;
            }
        }

        const container = $("questions-container");
        if (container) {
            container.innerHTML = "";
            indices.forEach((qIndex) => {
                const q = State.questionSet[qIndex];
                const ans = State.answers[qIndex];

                const card = document.createElement("div");
                card.className = "question-card";

                const qNumStr = q.totalSubQuestions > 1
                    ? `Pregunta ${qIndex + 1} (Parte ${q.subQuestionIndex} de ${q.totalSubQuestions})`
                    : `Pregunta ${qIndex + 1}`;

                const header = document.createElement("div");
                header.className = "q-header";

                const actions = document.createElement("div");
                actions.style.display = "flex";
                actions.style.gap = "8px";
                actions.style.alignItems = "center";
                const notebookId = getCaseNotebookId(q);
                const notebookEntry = (State.caseNotebook || []).find(entry => entry.id === notebookId);

                const btnNotebook = document.createElement("button");
                btnNotebook.className = "btn-ghost";
                btnNotebook.style.fontSize = "12px";
                btnNotebook.style.padding = "4px 8px";
                btnNotebook.style.borderRadius = "6px";
                btnNotebook.textContent = notebookEntry ? "Cuaderno" : "Guardar caso";
                btnNotebook.addEventListener("click", () => {
                    const entry = notebookEntry || upsertCaseNotebookEntry(q);
                    State.notebookSelectedId = entry.id;
                    saveGlobalStats();
                    if (notebookEntry) {
                        showView("view-estudio-plus");
                        renderNotebookView();
                        setTimeout(() => $("study-plus-notebook")?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
                    } else {
                        showNotification("Caso guardado en tu cuaderno.", "success");
                        renderExamQuestion();
                    }
                });

                const btnFlag = document.createElement("button");
                btnFlag.className = `btn-flag ${ans.flagged ? 'active' : ''}`;
                btnFlag.innerHTML = "&#x1F6A9; Marcar";
                btnFlag.addEventListener("click", () => {
                    State.answers[qIndex].flagged = !State.answers[qIndex].flagged;
                    renderExamQuestion();
                });

                const btnReport = document.createElement("button");
                btnReport.className = "btn-ghost";
                btnReport.style.fontSize = "12px";
                btnReport.style.padding = "4px 8px";
                btnReport.style.borderRadius = "6px";
                btnReport.style.color = "var(--accent-red)";
                btnReport.style.borderColor = "rgba(239, 68, 68, 0.2)";
                btnReport.textContent = "Reportar";
                btnReport.addEventListener("click", () => {
                    triggerReportModal(qIndex);
                });

                const spanNum = document.createElement("span");
                spanNum.className = "q-num";
                spanNum.textContent = qNumStr;

                header.appendChild(spanNum);
                actions.appendChild(btnNotebook);
                actions.appendChild(btnFlag);
                actions.appendChild(btnReport);
                header.appendChild(actions);

                const qTextEl = document.createElement("p");
                qTextEl.className = "question-text";
                qTextEl.textContent = q.question;

                const optGrid = document.createElement("div");
                optGrid.className = "options-list";
                q.options.forEach((optStr, idx) => {
                    if (optStr === undefined || optStr === null) return; // guard against malformed options
                    const btn = document.createElement("button");
                    btn.className = "option-btn";
                    const letter = String.fromCharCode(65 + idx);
                    btn.innerHTML = `<strong>${letter}.</strong> ${optStr}`;
                    if (ans.selected === idx) btn.classList.add("selected");
                    if (State.mode === "estudio" && ans.selected !== null) {
                        if (idx === q.answerIndex) btn.classList.add("correct-ans");
                        else if (ans.selected === idx) btn.classList.add("wrong-ans");
                    }
                    btn.addEventListener("click", () => handleAnswer(idx, qIndex));
                    optGrid.appendChild(btn);
                });

                card.appendChild(header);
                card.appendChild(qTextEl);
                card.appendChild(optGrid);

                if (notebookEntry && notebookEntry.note) {
                    const notePreview = document.createElement("div");
                    notePreview.className = "results-postmortem-item";
                    notePreview.textContent = `Nota guardada: ${truncateText(notebookEntry.note, 140)}`;
                    card.appendChild(notePreview);
                }

                if (State.mode === "estudio" && ans.selected !== null) {
                    const fb = document.createElement("div");
                    fb.className = `feedback-card ${ans.isCorrect ? '' : 'wrong'}`;
                    fb.style.display = "block";
                    fb.style.marginTop = "15px";

                    fb.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h3 style="margin: 0;">${ans.isCorrect ? "¡Respuesta Correcta!" : "Respuesta Incorrecta"}</h3>
                        </div>
                        <p>${q.explanation || ""}</p>
                        <div class="feedback-gpc">${q.gpcReference || ""}</div>
                    `;
                    card.appendChild(fb);
                }

                container.appendChild(card);
            });
        }

        const lastIdxOfCase = indices.length > 0 ? indices[indices.length - 1] : State.currentIndex;
        const pct = ((lastIdxOfCase + 1) / total) * 100;
        const qCounter = $("q-counter"); if (qCounter) qCounter.textContent = `Pregunta ${lastIdxOfCase + 1} de ${total}`;
        const progFill = $("progress-fill"); if (progFill) progFill.style.width = `${pct}%`;

        const bn = $("btn-next");
        if (bn) {
            if (lastIdxOfCase >= total - 1) {
                bn.textContent = "\u2714 Terminar";
                bn.classList.add("btn-danger");
                bn.classList.remove("primary");
            } else {
                bn.textContent = "Siguiente \u2192";
                bn.classList.remove("btn-danger");
                bn.classList.add("primary");
            }
        }

        renderExamSidebar();
    };

    const triggerReportModal = (globalQIndex) => {
        const modal = $("report-modal");
        const reasonInput = $("report-reason");
        const categorySelect = $("report-category");
        const preview = $("report-q-preview");
        if (!modal) return;

        State._reportingIndex = globalQIndex;
        const q = State.questionSet[globalQIndex];

        preview.textContent = `Pregunta: ${q.question}`;
        reasonInput.value = "";
        if (categorySelect) categorySelect.value = "";
        modal.style.display = "flex";
    };

    const handleAnswer = (selectedIdx, qIndex) => {
        const q = State.questionSet[qIndex];
        const ans = State.answers[qIndex];
        if (State.mode === "estudio" && ans.selected !== null) return;
        ans.selected = selectedIdx;
        ans.isCorrect = (selectedIdx === q.answerIndex);
        if (State.mode === "estudio") recordStat(q.specialty, ans.isCorrect, getCaseCanonicalTopic(q));
        renderExamQuestion();
    };

    const renderExamSidebar = () => {
        const nav = $("question-navigator"); if (!nav) return;
        nav.innerHTML = "";
        const currentGroupId = State.questionSet[State.currentIndex]?.caseGroupId;

        State.questionSet.forEach((_, i) => {
            const a = State.answers[i];
            const q = State.questionSet[i];
            const dot = document.createElement("button");
            dot.className = "nav-dot";
            dot.textContent = i + 1;

            if (q.caseGroupId === currentGroupId) dot.classList.add("current");
            else if (a.selected !== null) dot.classList.add("answered");

            if (a.flagged) dot.classList.add("flagged");

            dot.addEventListener("click", () => {
                State.currentIndex = i;
                renderExamQuestion();
            });
            nav.appendChild(dot);
        });
    };

    const clearExamTimer = () => {
        if (State.timer) {
            clearInterval(State.timer);
            State.timer = null;
        }
    };

    const setExamTimerVisibility = (visible, seconds = null) => {
        const timerDisp = $("timer-display");
        const timerText = $("timer-text");
        if (timerDisp) timerDisp.style.display = visible ? "block" : "none";
        if (timerText && typeof seconds === "number") {
            timerText.textContent = formatTime(Math.max(seconds, 0));
        }
    };

    const getExamElapsedSeconds = () => {
        if (!State.startTime) return State.pausedElapsedTime || 0;
        return Math.max(Math.floor((Date.now() - State.startTime) / 1000), 0);
    };

    const beginExamSession = ({
        questionSet,
        mode = "simulacro",
        currentExamIsReal = false,
        currentExamType = "Simulacro",
        durationSec = 0
    }) => {
        if (!Array.isArray(questionSet) || questionSet.length === 0) {
            clearExamTimer();
            State.questionSet = [];
            State.currentIndex = 0;
            State.answers = [];
            State.startTime = null;
            State.pausedElapsedTime = 0;
            State.examActive = false;
            setExamTimerVisibility(false, 0);
            hideExamLoadingOverlay();
            showNotification("No hay preguntas disponibles para iniciar este examen.", "warning");
            return false;
        }

        clearExamTimer();
        State.questionSet = questionSet;
        State.mode = mode;
        State.currentExamIsReal = currentExamIsReal;
        State.currentExamType = currentExamType;
        State.durationSec = Math.max(parseInt(durationSec, 10) || 0, 0);
        State.currentIndex = 0;
        State.answers = State.questionSet.map(() => ({ selected: null, isCorrect: null, flagged: false }));
        State.startTime = Date.now();
        State.pausedElapsedTime = 0;
        State.examActive = true;
        isFinishing = false;

        renderExamQuestion();
        showView("view-exam");
        hideExamLoadingOverlay();

        if (State.durationSec > 0) {
            startTimer();
        } else {
            setExamTimerVisibility(false, 0);
        }
        return true;
    };

    const startTimer = (isResume = false) => {
        if (State.durationSec <= 0) {
            clearExamTimer();
            setExamTimerVisibility(false, 0);
            return;
        }

        if (!isResume) {
            State.startTime = Date.now();
            State.pausedElapsedTime = 0;
        } else {
            State.startTime = Date.now() - (State.pausedElapsedTime * 1000);
        }

        const updateTimerText = () => {
            const remaining = Math.max(State.durationSec - getExamElapsedSeconds(), 0);
            setExamTimerVisibility(true, remaining);
            if (remaining <= 0) finishExam();
        };

        clearExamTimer();
        updateTimerText();
        if (!State.examActive) return;

        State.timer = setInterval(() => {
            updateTimerText();
        }, 1000);
    };

    const pauseTimer = () => {
        clearExamTimer();
        if (State.startTime) {
            State.pausedElapsedTime = getExamElapsedSeconds();
        }
    };

    const initReportLogic = () => {
        const modal = $("report-modal");
        const btnSubmit = $("btn-submit-report");
        const btnCancel = $("btn-cancel-report");
        const reasonInput = $("report-reason");
        const categorySelect = $("report-category");

        if (!modal || !btnSubmit || !btnCancel) return;

        btnCancel.addEventListener("click", () => {
            modal.style.display = "none";
        });

        btnSubmit.addEventListener("click", () => {
            const reason = reasonInput.value.trim();
            const category = categorySelect ? categorySelect.value.trim() : "";
            if (!category) return showNotification("Selecciona el tipo de error.", "warning");
            if (!reason) return showNotification("Por favor indica el motivo del reporte.", "warning");

            const qIndexToReport = State._reportingIndex !== undefined ? State._reportingIndex : State.currentIndex;
            const q = State.questionSet[qIndexToReport];
            if (!q) {
                showNotification("No se pudo identificar la pregunta a reportar.", "error");
                return;
            }
            const questionText = sanitizeReportText(q.question);
            const caseText = sanitizeReportText(q.case);
            const caseKey = getCaseKey(q) || getCaseKeyFromText(caseText, questionText);
            const report = {
                id: `local-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
                timestamp: Date.now(),
                questionText: questionText,
                caseText: caseText,
                specialty: sanitizeReportText(q.specialty),
                tema: sanitizeReportText(getCaseCanonicalTopic(q)),
                category: category,
                reason: reason,
                caseKey: caseKey,
                userName: State.userName || "Anonimo",
                userId: window.FB && window.FB.auth && window.FB.auth.currentUser ? window.FB.auth.currentUser.uid : "",
                status: "quarantine",
                cloudSynced: false,
                source: "local"
            };

            State.reportedQuestionsLocal = dedupeReports([...(State.reportedQuestionsLocal || []), report]);
            State.reportedQuestions = dedupeReports([...(State.reportedQuestions || []), report]);
            refreshQuarantineKeys();
            saveGlobalStats();
            modal.style.display = "none";
            showNotification("Gracias por tu reporte. Lo revisaremos pronto para mejorar el banco de preguntas.", "success");

            if (window.FB && window.FB.auth && window.FB.auth.currentUser) {
                uploadReportToCloud(report)
                    .then((cloudId) => {
                        markLocalReportAsCloudSynced(report.id, cloudId);
                        saveGlobalStats();
                    })
                    .catch(handleReportCloudError);
            } else {
                console.info("Reporte guardado localmente; pendiente de sincronizar por falta de sesion.");
                showNotification("Reporte guardado en este dispositivo. Inicia sesión para sincronizarlo en la nube.", "info");
            }
        });
    };

    const REPORTS_LAST_SEEN_KEY = "enarm_reports_last_seen";

    const initReportsCloud = () => {
        if (!window.FB || !window.FB.db || !window.FB.auth || !window.FB.auth.currentUser) return;
        if (window._reportsListener) return;
        const reportsRef = window.FB.collection(window.FB.db, "reports");
        const q = window.FB.query(reportsRef, window.FB.orderBy("timestamp", "desc"), window.FB.limit(200));
        window._reportsListener = window.FB.onSnapshot(q, (snap) => {
            const cloudReports = [];
            let newestTs = 0;
            snap.forEach(docSnap => {
                const data = docSnap.data() || {};
                cloudReports.push({ ...data, id: docSnap.id, source: "cloud" });
                if (data.timestamp && data.timestamp > newestTs) newestTs = data.timestamp;
            });

            const localReports = (State.reportedQuestionsLocal || []).filter(r => r && r.source !== "cloud");
            State.reportedQuestions = dedupeReports([...cloudReports, ...localReports]);
            refreshQuarantineKeys();

            if (State.view === "view-reportes") renderReportedQuestions();

            if (canReclassifyUser() && newestTs) {
                const lastSeen = parseInt(localStorage.getItem(REPORTS_LAST_SEEN_KEY) || "0", 10);
                if (newestTs > lastSeen) {
                    const latest = cloudReports.find(r => r.timestamp === newestTs) || cloudReports[0];
                    const reporter = (latest && latest.userName) ? latest.userName.trim().toLowerCase() : "";
                    if (reporter && reporter !== "isaac rivera") {
                        showBanner(
                            "Nuevo reporte",
                            `Un usuario reporto una pregunta (${getReportCategoryLabel(latest.category)})`,
                            "&#x1F6A9;",
                            () => showView("view-reportes")
                        );
                    }
                    localStorage.setItem(REPORTS_LAST_SEEN_KEY, String(newestTs));
                }
            }
        });
    };

    const renderReportedQuestions = () => {
        const cont = $("reports-list");
        if (!cont) return;

        if (!State.reportedQuestions || State.reportedQuestions.length === 0) {
            cont.innerHTML = `<div class="list-item empty-history"><p style="color:var(--text-muted); padding: 20px;">No hay preguntas reportadas aún.</p></div>`;
            return;
        }

        cont.innerHTML = "";
        const reports = [...State.reportedQuestions].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        const groups = {};
        reports.forEach(r => {
            const key = r.category || "otro";
            if (!groups[key]) groups[key] = [];
            groups[key].push(r);
        });

        const orderedKeys = Object.keys(REPORT_CATEGORY_LABELS);
        const remainingKeys = Object.keys(groups).filter(k => !orderedKeys.includes(k));
        const finalKeys = [...orderedKeys, ...remainingKeys];

        finalKeys.forEach((catKey) => {
            const list = groups[catKey];
            if (!list || list.length === 0) return;

            const header = document.createElement("div");
            header.style.margin = "14px 0 8px";
            header.style.fontWeight = "700";
            header.style.fontSize = "14px";
            header.style.color = "var(--text-primary)";
            header.textContent = `${getReportCategoryLabel(catKey)} (${list.length})`;
            cont.appendChild(header);

            list.forEach((r) => {
                const div = document.createElement("div");
                div.className = "list-item";
                div.style.flexDirection = "column";
                div.style.alignItems = "flex-start";
                div.style.gap = "10px";
                const specLabel = getSpecialtyLabel(r.specialty || "");
                const userLabel = r.userName || "Anonimo";
                const dateLabel = r.timestamp ? new Date(r.timestamp).toLocaleDateString() : "";
                const temaLabel = r.tema || "Sin tema";

                div.innerHTML = `
                    <div style="display:flex; justify-content:space-between; width: 100%; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
                        <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
                            <span class="badge red-bg" style="font-size: 10px;">${specLabel.toUpperCase()}</span>
                            <span class="badge" style="font-size: 10px; background: rgba(255,255,255,0.06); color: var(--text-muted); border: 1px solid var(--border);">${temaLabel}</span>
                            <span style="font-size: 11px; color: var(--text-muted);">Usuario: ${userLabel}</span>
                        </div>
                        <span style="font-size: 11px; color: var(--text-muted);">${dateLabel}</span>
                    </div>
                    <div style="width: 100%;">
                        <h3 style="font-size: 14px; margin-bottom: 6px; color: var(--text-primary);">Pregunta:</h3>
                        <p style="font-size: 13px; line-height: 1.4; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 6px; margin-bottom: 10px;">${r.questionText || ""}</p>
                        ${r.caseText ? `<h3 style="font-size: 14px; margin-bottom: 6px; color: var(--text-primary);">Caso:</h3>
                        <p style="font-size: 13px; line-height: 1.4; color: var(--text-secondary); border-left: 2px solid var(--border); padding-left: 10px; margin-bottom: 10px;">${r.caseText}</p>` : ""}
                        <h3 style="font-size: 14px; margin-bottom: 6px; color: var(--accent-red);">Detalle del reporte:</h3>
                        <p style="font-size: 13px; line-height: 1.4; color: var(--text-secondary); border-left: 2px solid var(--accent-red); padding-left: 10px;">${r.reason || ""}</p>
                    </div>
                    ${canReclassifyUser() ? `<button class="btn-ghost btn-del-report" data-id="${r.id}" data-cloud="${r.source === 'cloud' ? '1' : '0'}" style="align-self: flex-end; font-size: 11px; padding: 4px 8px; color: var(--text-muted);">Eliminar Reporte</button>` : ""}
                `;
                cont.appendChild(div);
            });
        });

        cont.querySelectorAll(".btn-del-report").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const id = e.target.dataset.id;
                if (!confirm("¿Eliminar este reporte?")) return;
                State.reportedQuestions = (State.reportedQuestions || []).filter(r => String(r.id) !== String(id));
                State.reportedQuestionsLocal = (State.reportedQuestionsLocal || []).filter(r => String(r.id) !== String(id));
                saveGlobalStats();
                refreshQuarantineKeys();
                renderReportedQuestions();

                if (window.FB && window.FB.db && e.target.dataset.cloud === "1") {
                    try {
                        await window.FB.deleteDoc(window.FB.doc(window.FB.db, "reports", id));
                    } catch (err) {
                        console.error("No se pudo eliminar reporte en la nube:", err);
                    }
                }
            });
        });
    };

    let isFinishing = false;
    let temarioRenderToken = 0;

    const formatTemarioMetric = (value) => Number(value || 0).toLocaleString("es-MX");
    const splitTemarioTopicMeta = (topic) => {
        const cleanTopic = sanitizeTopicLabel(topic || "");
        const match = cleanTopic.match(/^(.*)\s\(([^()]+)\)$/);
        if (!match) return { title: cleanTopic, parent: "" };
        return {
            title: sanitizeTopicLabel(match[1] || ""),
            parent: sanitizeTopicLabel(match[2] || "")
        };
    };
    const updateTemarioSummary = ({
        total = 0,
        withQuestions = 0,
        shown = 0,
        filter = "",
        loading = false,
        error = false
    } = {}) => {
        const stats = $("temario-stats");
        const summary = $("temario-results-summary");

        if (stats) {
            const cards = stats.querySelectorAll(".temario-stat");
            const values = [total, withQuestions, shown].map(formatTemarioMetric);
            cards.forEach((card, index) => {
                const valueEl = card.querySelector(".temario-stat-value");
                if (valueEl) {
                    valueEl.textContent = loading ? "..." : values[index] || "0";
                }
            });
        }

        if (!summary) return;
        if (loading) {
            summary.textContent = "Cargando el banco para calcular cuántas preguntas tiene cada tema...";
            return;
        }
        if (error) {
            summary.textContent = "No se pudo cargar el banco de preguntas para el temario.";
            return;
        }
        if (filter && shown === 0) {
            summary.textContent = `No encontramos coincidencias para "${filter}".`;
            return;
        }
        if (filter) {
            summary.textContent = `${formatTemarioMetric(shown)} resultado(s) para "${filter}".`;
            return;
        }
        summary.textContent = `${formatTemarioMetric(total)} temas oficiales, ${formatTemarioMetric(withQuestions)} con preguntas activas en el banco.`;
    };
    const renderTemarioState = ({
        icon = "&#x1F4D6;",
        title = "",
        detail = "",
        actionLabel = "",
        actionHandler = ""
    } = {}) => {
        const cont = $("temario-list");
        if (!cont) return;
        const actionHtml = actionLabel && actionHandler
            ? `<button class="${actionHandler === "retryTemarioRender()" ? "btn-primary" : "btn-ghost"}" type="button" onclick="${actionHandler}">${escapeHtml(actionLabel)}</button>`
            : "";
        cont.innerHTML = `
            <div class="temario-empty">
                <div class="temario-empty-icon">${icon}</div>
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(detail)}</p>
                ${actionHtml}
            </div>
        `;
    };
    const getTemarioEntryMatchScore = (entry, normalizedFilter) => {
        if (!entry || !normalizedFilter) return 0;
        const { title, parent } = splitTemarioTopicMeta(entry.topic);
        const titleKey = normalizeTextKey(title);
        const parentKey = normalizeTextKey(parent);

        if (titleKey === normalizedFilter) return 8;
        if (normalizeTextKey(entry.topic) === normalizedFilter) return 7;
        if (entry.searchKeys.some(searchKey => searchKey === normalizedFilter)) return 6;
        if (titleKey.startsWith(normalizedFilter)) return 5;
        if (titleKey.includes(normalizedFilter)) return 4;
        if (parentKey && parentKey.includes(normalizedFilter)) return 3;

        const queryTokens = tokenizeSearchKey(normalizedFilter).filter(token => token.length >= 3);
        if (queryTokens.length === 0) return 0;
        const hitCount = queryTokens.filter(token => entry.searchKeys.some(searchKey => searchKey.includes(token))).length;
        if (hitCount === queryTokens.length) return 2;
        if (hitCount >= Math.max(1, queryTokens.length - 1)) return 1;
        return 0;
    };
    const sortTemarioEntries = (entries, normalizedFilter = "") => {
        return [...entries].sort((a, b) => {
            const scoreDiff = getTemarioEntryMatchScore(b, normalizedFilter) - getTemarioEntryMatchScore(a, normalizedFilter);
            if (scoreDiff !== 0) return scoreDiff;

            const countDiff = (b.count || 0) - (a.count || 0);
            if (countDiff !== 0) return countDiff;

            const aMeta = splitTemarioTopicMeta(a.topic);
            const bMeta = splitTemarioTopicMeta(b.topic);
            const depthDiff = (aMeta.parent ? 1 : 0) - (bMeta.parent ? 1 : 0);
            if (depthDiff !== 0) return depthDiff;

            return a.topic.localeCompare(b.topic, "es");
        });
    };
    const renderTemarioCard = (entry) => {
        const topic = sanitizeTopicLabel(entry.topic || "");
        const { title, parent } = splitTemarioTopicMeta(topic);
        const count = entry.count || 0;
        const countLabel = `${formatTemarioMetric(count)} preg.`;
        const note = count > 0
            ? "Usa este tema como filtro para armar un simulacro más preciso."
            : "Tema cargado en el temario, sin preguntas activas detectadas por ahora.";
        const cta = count > 0 ? "Usar en simulacro" : "Explorar tema";
        const meta = parent ? `Pertenece a ${parent}` : "Tema troncal del temario";

        return `
            <button type="button" class="temario-card ${count > 0 ? "" : "is-empty"}" data-topic="${escapeHtml(topic)}" onclick="openTemarioTopic(this.dataset.topic)">
                <div class="temario-card-head">
                    <div>
                        <h3 class="temario-card-title">${escapeHtml(title)}</h3>
                        ${parent ? `<p class="temario-card-parent">${escapeHtml(parent)}</p>` : ""}
                    </div>
                    <span class="temario-count ${count > 0 ? "temario-count--positive" : ""}">${countLabel}</span>
                </div>
                <p class="temario-card-note">${escapeHtml(note)}</p>
                <div class="temario-card-footer">
                    <span class="temario-card-cta">${cta} &#8594;</span>
                    <span class="temario-card-meta">${escapeHtml(meta)}</span>
                </div>
            </button>
        `;
    };
    const renderOfficialTemario = async (filter = "") => {
        const cont = $("temario-list");
        if (!cont) return;

        const requestId = ++temarioRenderToken;
        const rawFilter = String(filter || "").trim();
        const normalizedFilter = normalizeTextKey(rawFilter);

        if (!hasQuestionsBankLoaded()) {
            updateTemarioSummary({ filter: rawFilter, loading: true });
            renderTemarioState({
                icon: "&#x23F3;",
                title: "Calculando tu mapa de temas",
                detail: "Estamos cargando el banco de preguntas para mostrar cuántas preguntas tiene cada tema del temario."
            });
            try {
                await ensureQuestionsReady({ silent: true });
            } catch (err) {
                if (requestId !== temarioRenderToken) return;
                updateTemarioSummary({ filter: rawFilter, error: true });
                renderTemarioState({
                    icon: "&#9888;&#65039;",
                    title: "No pudimos cargar el temario completo",
                    detail: "La vista necesita el banco de preguntas para calcular los conteos. Intenta recargar esta sección.",
                    actionLabel: "Reintentar",
                    actionHandler: "retryTemarioRender()"
                });
                return;
            }
        }

        if (requestId !== temarioRenderToken) return;

        const topicEntries = Array.from(getTemarioTopicCatalog().values())
            .filter(entry => entry && entry.topic);
        const filteredEntries = topicEntries.filter(entry => {
            if (!normalizedFilter) return true;
            return entry.searchKeys.some(searchKey => topicKeyMatchesQuery(searchKey, normalizedFilter));
        });
        const sortedEntries = sortTemarioEntries(filteredEntries, normalizedFilter);
        const withQuestions = topicEntries.filter(entry => (entry.count || 0) > 0).length;

        updateTemarioSummary({
            total: topicEntries.length,
            withQuestions,
            shown: sortedEntries.length,
            filter: rawFilter
        });

        if (sortedEntries.length === 0) {
            renderTemarioState({
                icon: "&#128269;",
                title: "Sin resultados",
                detail: `No encontramos temas que coincidan con "${rawFilter}". Prueba con diabetes, bronquiolitis o apendicitis.`,
                actionLabel: "Limpiar búsqueda",
                actionHandler: "clearOfficialTemarioSearch()"
            });
            return;
        }

        cont.innerHTML = sortedEntries.map(entry => renderTemarioCard(entry)).join("");
    };

    window.openTemarioTopic = (topic) => {
        const cleanTopic = sanitizeTopicLabel(topic || "");
        if (!cleanTopic) return;
        const nav = $("nav-new-exam");
        if (nav) nav.click();
        setTimeout(() => {
            const input = $("setup-topic-filter");
            if (!input) return;
            input.value = cleanTopic;
            input.dispatchEvent(new Event("input"));
            input.focus();
        }, 300);
    };
    window.filterOfficialTemario = () => {
        const val = $("temario-search") ? $("temario-search").value : "";
        void renderOfficialTemario(val);
    };
    window.clearOfficialTemarioSearch = () => {
        const input = $("temario-search");
        if (input) {
            input.value = "";
            input.focus();
        }
        void renderOfficialTemario("");
    };
    window.retryTemarioRender = () => {
        void renderOfficialTemario($("temario-search") ? $("temario-search").value : "");
    };

    const finishExam = () => {
        if (isFinishing) return;
        isFinishing = true;
        try {
            clearExamTimer();

            let correct = 0, wrong = 0, blank = 0;
            State.answers.forEach((a, i) => {
                if (a.selected === null) blank++;
                else {
                    if (a.isCorrect) correct++; else wrong++;
                    if (State.mode === "simulacro") recordStat(State.questionSet[i].specialty, a.isCorrect, getCaseCanonicalTopic(State.questionSet[i]));
                }
            });

            const total = State.questionSet.length;
            let pct = total > 0 ? Math.round((correct / total) * 100) : 0;
            const elapsed = State.startTime ? Math.floor((Date.now() - State.startTime) / 1000) : 0;
            const topicsTouched = Array.from(new Set(State.questionSet.map(q => sanitizeTopicLabel(getCaseCanonicalTopic(q))).filter(Boolean))).slice(0, 12);

            if (State.currentExamIsReal) {
                let maxPts = 0;
                let earnedPts = 0;
                State.questionSet.forEach((q, i) => {
                    const bucket = normalizeDifficultyBucket(q.difficulty);
                    const weight = bucket === "hard" ? 3 : (bucket === "medium" ? 2 : 1);
                    maxPts += weight;
                    if (State.answers[i].selected !== null && State.answers[i].isCorrect) {
                        earnedPts += weight;
                    }
                });
                pct = maxPts > 0 ? Math.round((earnedPts / maxPts) * 100) : pct;
            }

            const sp = $("score-pct"); if (sp) sp.textContent = `${pct}%`;
            const mc = $("meta-correct"); if (mc) mc.textContent = correct;
            const mw = $("meta-wrong"); if (mw) mw.textContent = wrong;
            const mb = $("meta-blank"); if (mb) mb.textContent = blank;
            const mt = $("meta-time"); if (mt) mt.textContent = formatTime(elapsed);
            const postmortem = buildSessionPostmortem({ correct, wrong, blank, total, elapsedSec: elapsed });
            State.lastPostmortem = postmortem;

            State.globalStats.sesiones++;
            // Track actual blank count for accurate dashboard stats
            State.globalStats.totalBlank = (State.globalStats.totalBlank || 0) + blank;
            State.history.push({
                timestamp: Date.now(),
                tipo: State.currentExamType,
                sessionKind: State.mode,
                preguntas: total,
                pct: pct,
                correct: correct,
                wrong: wrong,
                blank: blank,
                elapsedSec: elapsed,
                topicsStudied: topicsTouched,
                dominantErrors: postmortem.priorityTopics.map(item => item.topic),
                nextRecommendation: postmortem.nextAction?.label || "",
                questionSet: [...State.questionSet],
                answers: State.answers.map(a => ({ ...a }))
            });

            // BUG FIX #3: Cap history at 50 sessions to prevent localStorage overflow.
            // If exceeded, remove the oldest 25 entries but keep their summary (strip questionSet only).
            const HISTORY_LIMIT = 50;
            if (State.history.length > HISTORY_LIMIT) {
                const excess = State.history.length - HISTORY_LIMIT;
                for (let i = 0; i < excess; i++) {
                    // Strip the heavy questionSet from old entries to save space, keep the summary
                    if (State.history[i].questionSet) {
                        delete State.history[i].questionSet;
                        delete State.history[i].answers;
                    }
                }
                // Keep only the latest HISTORY_LIMIT entries
                State.history = State.history.slice(excess);
            }

            // Update Cloud Challenge if active
            if (State.activeChallengeId && window.FB && window.FB.auth.currentUser) {
                const chalId = State.activeChallengeId;
                const uid = window.FB.auth.currentUser.uid;
                const chalRef = window.FB.doc(window.FB.db, "challenges", chalId);

                window.FB.getDoc(chalRef).then(snap => {
                    if (snap.exists()) {
                        const data = snap.data();
                        const parts = data.participants || {};
                        if (parts[uid]) {
                            parts[uid].score = pct;
                            parts[uid].status = "completed";
                            parts[uid].timestamp = new Date();
                        }

                        // Consider completed and dismissed as terminal states.
                        const allFinished = Object.values(parts).every(p => p.status === "completed" || p.status === "dismissed");

                        window.FB.updateDoc(chalRef, {
                            participants: parts,
                            status: allFinished ? "finished" : "active"
                        });
                    }
                });

                // Clear state
                State.activeChallengeId = null;
                State.activeChallengeRole = null;
            }

            // Racha (Streak) Logic 
            State.examActive = false;
            State.globalStats.streakData = State.globalStats.streakData || { lastStudyDate: null, currentStreak: 0 };
            const effective = getEffectiveStreak();

            const now = new Date();
            const todayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

            if (State.globalStats.streakData.lastStudyDate !== todayStr) {
                State.globalStats.streakData.currentStreak = effective + 1;
                State.globalStats.streakData.lastStudyDate = todayStr;
            }

            State.answers.forEach((answer, index) => {
                const q = State.questionSet[index];
                if (!q) return;
                if (answer.selected === null || !answer.isCorrect) {
                    scheduleReviewForQuestion(q, { delayDays: answer.selected === null ? 0 : 1 });
                }
            });
            recordStudyCalendarActivity({
                sessions: 1,
                topics: topicsTouched
            });
            rebuildTopicMastery();
            ensureDailyPlanFresh(true);

            saveGlobalStats();
            renderResultsPostmortem();
            showView("view-results");
        } catch (err) {
            console.error("Error crítico en finishExam:", err);
            showNotification("Error al finalizar el examen. Revisa la consola.");
            // Si hay un error, reseteamos el candado para permitir reintentar
            isFinishing = false;
        }
    };

    const getEffectiveStreak = () => {
        const sd = State.globalStats.streakData;
        if (!sd || !sd.lastStudyDate) return 0;

        const parts = sd.lastStudyDate.split("-");
        const lastD = new Date(parts[0], parts[1] - 1, parts[2]);
        const now = new Date();
        const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diffM = todayMidnight - lastD;
        const missedDaysTotal = Math.floor(diffM / (1000 * 60 * 60 * 24));

        if (missedDaysTotal <= 1) return sd.currentStreak;

        const missedForPenalty = missedDaysTotal - 1;
        return Math.max(0, sd.currentStreak - (missedForPenalty * 2));
    };

    const getProbability = (streak) => {
        if (streak === 0) return 20;
        let prob = 20 + 75 * (1 - Math.exp(-streak / 30));
        return Math.min(prob, 99.9).toFixed(1);
    };

    // OPTIM #4: Debounced save for study mode  avoids one Firestore write per answer.
    // Instead, we wait 3s after the last answer before persisting.
    let _estudioSaveTimer = null;
    const debouncedSave = () => {
        if (_estudioSaveTimer) clearTimeout(_estudioSaveTimer);
        _estudioSaveTimer = setTimeout(() => {
            saveGlobalStats();
        }, 3000);
    };

    const recordStat = (specialtyKey, isCorrect, tema) => {
        State.globalStats.respondidas++;
        if (isCorrect) State.globalStats.aciertos++;
        if (State.globalStats.bySpecialty[specialtyKey]) {
            State.globalStats.bySpecialty[specialtyKey].total++;
            if (isCorrect) State.globalStats.bySpecialty[specialtyKey].correct++;
        }
        if (tema) {
            State.globalStats.byTema = State.globalStats.byTema || {};
            if (!State.globalStats.byTema[tema]) State.globalStats.byTema[tema] = { total: 0, correct: 0, specialty: specialtyKey };
            State.globalStats.byTema[tema].total++;
            if (isCorrect) State.globalStats.byTema[tema].correct++;
            State.topicMastery[tema] = State.topicMastery[tema] || { topic: tema, specialty: specialtyKey };
            State.topicMastery[tema].lastSeenAt = Date.now();
            State.topicMastery[tema].specialty = specialtyKey;
        }
        rebuildTopicMastery();
        // Use debounced save in estudio mode to avoid excessive writes.
        if (State.mode === "estudio") debouncedSave();
    };

    const updateMotivationalQuote = () => {
        const quotes = [
            "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
            "La medicina es una vocación de servicio, tu esfuerzo salvará vidas.",
            "No te rindas. Lo que hoy es un esfuerzo, mañana será tu mayor logro.",
            "Cada pregunta que fallas hoy es un error menos en el ENARM.",
            "Haz de tu estudio un hábito y del éxito tu destino.",
            "Estás un paso más cerca de tu residencia. Sigue así.",
            "El conocimiento es el único peso que no cansa cargar.",
            "Confía en tu proceso, el resultado llegará.",
            "La disciplina de hoy es tu plaza R1 de mañana."
        ];

        const now = new Date();
        // Cambiar cada algunas horas/días basándonos en la fecha actual
        const tick = now.getDate() + Math.floor(now.getHours() / 4);
        const quoteIndex = tick % quotes.length;

        const quoteEl = $("dynamic-quote");
        if (quoteEl) {
            quoteEl.textContent = quotes[quoteIndex];
        }
    };

    const runStudyAction = (action, actionTarget = "") => {
        let decodedTarget = actionTarget;
        if (typeof actionTarget === "string") {
            try {
                decodedTarget = decodeURIComponent(actionTarget);
            } catch (_) {
                decodedTarget = actionTarget;
            }
        }
        const target = sanitizeTopicLabel(decodedTarget);
        if (action === "open-temario") {
            showView("view-temario");
            if ($("temario-search") && target) {
                $("temario-search").value = target;
                void renderOfficialTemario(target);
            }
            return;
        }
        if (action === "open-notebook") {
            showView("view-estudio-plus");
            setTimeout(() => $("study-plus-notebook")?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
            return;
        }
        if (action === "open-setup") {
            const nav = $("nav-new-exam");
            if (nav) nav.click();
            const presetId = actionTarget === "mini" ? "preset-mini" : "preset-flash";
            const preset = $(presetId);
            if (preset) preset.click();
            return;
        }
        if (action === "topic-drill") {
            const nav = $("nav-new-exam");
            if (nav) nav.click();
            setTimeout(() => {
                const input = $("setup-topic-filter");
                const preset = $("preset-flash");
                if (preset) preset.click();
                if (input && target) {
                    input.value = target;
                    input.dispatchEvent(new Event("input"));
                    input.focus();
                }
            }, 120);
            return;
        }
        showView("view-dashboard");
    };

    window.runDailyPlanTask = (taskId) => {
        ensureDailyPlanFresh();
        const task = (State.dailyPlan?.tasks || []).find(entry => entry.id === taskId);
        if (!task) return;
        markDailyPlanTaskDone(task.id);
        saveGlobalStats();
        runStudyAction(task.action, task.actionTarget);
        renderStudyDashboard();
    };

    window.runStudyAction = runStudyAction;
    window.completeStudyReviewItem = (id) => {
        let decoded = id;
        if (typeof id === "string") {
            try { decoded = decodeURIComponent(id); } catch (_) { decoded = id; }
        }
        completeReviewQueueItem(decoded);
    };
    window.openNotebookEntry = (id) => {
        let decoded = id;
        if (typeof id === "string") {
            try { decoded = decodeURIComponent(id); } catch (_) { decoded = id; }
        }
        State.notebookSelectedId = decoded;
        showView("view-estudio-plus");
        renderNotebookView();
        setTimeout(() => $("study-plus-notebook")?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
    };

    const renderCalendarHeatmap = (containerId, days = 35, options = {}) => {
        const container = $(containerId);
        if (!container) return;
        ensureStudySystemsState();
        const cells = [];
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (days - 1));
        if (options.alignToWeekStart) {
            const leadingBlanks = (startDate.getDay() + 6) % 7;
            for (let blank = 0; blank < leadingBlanks; blank += 1) {
                cells.push(`<div class="calendar-cell calendar-cell--placeholder" aria-hidden="true"></div>`);
            }
        }
        for (let offset = days - 1; offset >= 0; offset--) {
            const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
            const key = formatDateKey(date);
            const entry = State.studyCalendar[key] || { sessions: 0, pomodoros: 0, topics: [] };
            const intensity = Math.min(0.95, ((entry.sessions || 0) * 0.32) + ((entry.pomodoros || 0) * 0.18) + ((entry.topics || []).length * 0.06));
            cells.push(`
                <div class="calendar-cell" style="--heat:${Math.max(0.08, intensity)}" title="${key}: ${entry.sessions || 0} sesiones, ${entry.pomodoros || 0} pomodoros">
                    <span class="calendar-cell-label">${String(date.getDate()).padStart(2, "0")}</span>
                </div>
            `);
        }
        container.innerHTML = cells.join("");
    };

    const renderStudyDashboard = () => {
        ensureStudySystemsState();
        rebuildTopicMastery();
        ensureDailyPlanFresh();

        const plan = State.dailyPlan || buildDailyPlan();
        if ($("today-plan-summary")) $("today-plan-summary").textContent = plan.summary || "Sin plan aún.";
        if ($("today-plan-focus")) $("today-plan-focus").textContent = plan.focusTopic || "Sin foco principal";
        if ($("today-plan-pressure")) $("today-plan-pressure").textContent = plan.pressure || "Sin presión";

        const planList = $("today-plan-list");
        if (planList) {
            if (!plan.tasks || plan.tasks.length === 0) {
                planList.innerHTML = `<div class="today-empty">No hay tareas generadas por ahora.</div>`;
            } else {
                planList.innerHTML = plan.tasks.map((task, index) => {
                    const done = (plan.completedTaskIds || []).includes(task.id);
                    return `
                        <article class="today-plan-task">
                            <span class="today-task-index">${index + 1}</span>
                            <div>
                                <h3 class="today-task-title">${escapeHtml(task.title)}</h3>
                                <p class="today-task-detail">${escapeHtml(task.detail)}</p>
                            </div>
                            <div class="today-task-actions">
                                <button class="btn-${done ? "secondary" : "primary"}" type="button" onclick="window.runDailyPlanTask('${escapeHtml(task.id)}')">${done ? "Repetir" : "Hacer ahora"}</button>
                            </div>
                        </article>
                    `;
                }).join("");
            }
        }

        const nextAction = getNextRecommendedAction();
        const nextActionCont = $("today-next-action");
        if (nextActionCont) {
            nextActionCont.innerHTML = nextAction
                ? `
                    <article class="review-queue-item">
                        <div class="review-item-top">
                            <div>
                                <h3 class="review-item-title">${escapeHtml(nextAction.title)}</h3>
                                <p class="review-item-meta">${escapeHtml(nextAction.detail)}</p>
                            </div>
                            <span class="review-item-tag">Sigue</span>
                        </div>
                        <div class="today-task-actions">
                            <button class="btn-primary" type="button" onclick="window.runDailyPlanTask('${escapeHtml(nextAction.id)}')">Continuar</button>
                        </div>
                    </article>
                `
                : `<div class="today-empty">Ya cerraste las tareas esenciales de hoy.</div>`;
        }

        const reviewBuckets = getReviewQueueBuckets();
        if ($("review-count-today")) $("review-count-today").textContent = `${reviewBuckets.today.length} hoy`;
        if ($("review-count-late")) $("review-count-late").textContent = `${reviewBuckets.late.length} atrasadas`;
        if ($("review-count-done")) $("review-count-done").textContent = `${reviewBuckets.completed.length} completadas`;

        const reviewQueue = $("dashboard-review-queue");
        if (reviewQueue) {
            const reviewItems = [...reviewBuckets.late.slice(0, 2), ...reviewBuckets.today.slice(0, 3)].slice(0, 4);
            if (!reviewItems.length) {
                reviewQueue.innerHTML = `<div class="today-empty">Tu bandeja está limpia. Aprovecha para un mini simulacro o un tema débil.</div>`;
            } else {
                reviewQueue.innerHTML = reviewItems.map(item => `
                    <article class="review-queue-item">
                        <div class="review-item-top">
                            <div>
                                <h3 class="review-item-title">${escapeHtml(item.title || item.topic || "Repaso")}</h3>
                                <p class="review-item-meta">${escapeHtml(item.detail || item.topic || "")}</p>
                            </div>
                            <span class="review-item-tag">${compareDateKeys(item.dueDate, formatDateKey()) < 0 ? "Atrasada" : "Hoy"}</span>
                        </div>
                        <div class="today-task-actions">
                            ${item.topic ? `<button class="btn-secondary" type="button" onclick="window.runStudyAction('topic-drill','${encodeURIComponent(item.topic)}')">Ir al tema</button>` : ""}
                            <button class="btn-primary" type="button" onclick="window.completeStudyReviewItem('${encodeURIComponent(item.id)}')">Marcar hecho</button>
                        </div>
                    </article>
                `).join("");
            }
        }

        const notebookPreview = $("dashboard-notebook-preview");
        if (notebookPreview) {
            const notes = (State.caseNotebook || []).slice(0, 3);
            notebookPreview.innerHTML = notes.length
                ? notes.map(entry => `
                    <article class="dashboard-notebook-item">
                        <div class="dashboard-notebook-top">
                            <div>
                                <h3 class="dashboard-notebook-title">${escapeHtml(entry.title || "Caso clínico")}</h3>
                                <p class="dashboard-notebook-meta">${escapeHtml(entry.topic || "")}</p>
                            </div>
                            <button class="btn-ghost" type="button" onclick="window.openNotebookEntry('${encodeURIComponent(entry.id)}')">Abrir</button>
                        </div>
                        <p class="dashboard-notebook-meta">${escapeHtml(truncateText(entry.note || entry.caseText || "Sin nota clínica aún.", 95))}</p>
                    </article>
                `).join("")
                : `<div class="today-empty">Aún no has guardado casos en tu cuaderno.</div>`;
        }

        const masteryCounts = getTopicMasteryCounts();
        if ($("dashboard-coverage-summary")) {
            $("dashboard-coverage-summary").textContent = masteryCounts.total
                ? `${masteryCounts.dominado} dominados, ${masteryCounts.en_progreso} en progreso y ${masteryCounts.en_riesgo} en riesgo sobre ${masteryCounts.total} temas que ya has trabajado.`
                : "Completa algunos exámenes para activar el mapa de cobertura con temas reales.";
        }
        const coverageBars = $("dashboard-coverage-bars");
        if (coverageBars) {
            if (!masteryCounts.total) {
                coverageBars.innerHTML = `<div class="today-empty">Estudio Plus mostrará cobertura en cuanto acumules temas respondidos en tus exámenes.</div>`;
            } else {
                const total = masteryCounts.total;
                const entries = [
                    { label: "Dominado", count: masteryCounts.dominado, risk: false },
                    { label: "En progreso", count: masteryCounts.en_progreso, risk: false },
                    { label: "En riesgo", count: masteryCounts.en_riesgo, risk: true }
                ];
                coverageBars.innerHTML = entries.map(entry => {
                    const width = entry.count > 0 ? Math.max(8, (entry.count / total) * 100) : 0;
                    return `
                        <div class="coverage-meter">
                            <span class="coverage-meter-label">${entry.label}</span>
                            <div class="coverage-meter-track">
                                <div class="coverage-meter-fill ${entry.risk ? "is-risk" : ""}" style="width:${width}%"></div>
                            </div>
                            <span class="coverage-meter-value">${entry.count}</span>
                        </div>
                    `;
                }).join("");
            }
        }

        const calendarSummary = $("dashboard-calendar-summary");
        if (calendarSummary) {
            const last7 = Array.from({ length: 7 }, (_, index) => addDaysToKey(formatDateKey(), -(6 - index)));
            let sessions = 0;
            let pomodoros = 0;
            last7.forEach(key => {
                const entry = State.studyCalendar[key];
                if (!entry) return;
                sessions += entry.sessions || 0;
                pomodoros += entry.pomodoros || 0;
            });
            calendarSummary.textContent = `Últimos 7 días: ${sessions} sesiones cerradas y ${pomodoros} pomodoros completados.`;
        }
        renderCalendarHeatmap("dashboard-calendar-heatmap", 35);
    };

    const renderResultsPostmortem = () => {
        const postmortem = State.lastPostmortem;
        const patterns = $("results-patterns");
        const topics = $("results-priority-topics");
        const nextAction = $("results-next-action");
        if (!patterns || !topics || !nextAction) return;
        if (!postmortem) {
            patterns.innerHTML = `<div class="today-empty">Aún no hay postmortem disponible.</div>`;
            topics.innerHTML = "";
            nextAction.textContent = "Completa una sesión para ver recomendaciones.";
            return;
        }
        patterns.innerHTML = (postmortem.patterns || []).map(item => `<div class="results-postmortem-item">${escapeHtml(item)}</div>`).join("");
        topics.innerHTML = (postmortem.priorityTopics || []).length
            ? postmortem.priorityTopics.map(item => `<div class="results-postmortem-item">${escapeHtml(item.topic)} · ${item.count} reactivos</div>`).join("")
            : `<div class="results-postmortem-item">No hubo temas prioritarios detectables.</div>`;
        nextAction.textContent = postmortem.nextAction?.label || "Vuelve al dashboard para seguir estudiando.";
        const btn = $("btn-results-next-action");
        if (btn) {
            btn.onclick = () => runStudyAction(postmortem.nextAction?.type, postmortem.nextAction?.topic || "");
        }
    };

    const renderHistoryStudySummary = () => {
        const cont = $("history-study-summary");
        if (!cont) return;
        const todayKey = formatDateKey();
        const last7 = Array.from({ length: 7 }, (_, index) => addDaysToKey(todayKey, -(6 - index)));
        const last28 = Array.from({ length: 28 }, (_, index) => addDaysToKey(todayKey, -(27 - index)));
        let sessions = 0;
        let pomodoros = 0;
        let touchedTopics = 0;
        let activeDays = 0;
        let bestDayKey = "";
        let bestDayScore = -1;
        last7.forEach(key => {
            const entry = State.studyCalendar[key];
            if (!entry) return;
            sessions += entry.sessions || 0;
            pomodoros += entry.pomodoros || 0;
            touchedTopics += (entry.topics || []).length;
        });
        last28.forEach(key => {
            const entry = State.studyCalendar[key];
            const daySessions = entry?.sessions || 0;
            const dayPomodoros = entry?.pomodoros || 0;
            const dayTopics = (entry?.topics || []).length;
            const activityScore = (daySessions * 3) + (dayPomodoros * 2) + dayTopics;
            if (activityScore > 0) activeDays += 1;
            if (activityScore > bestDayScore) {
                bestDayScore = activityScore;
                bestDayKey = key;
            }
        });
        let currentStreak = 0;
        for (let offset = 0; offset < 120; offset += 1) {
            const key = addDaysToKey(todayKey, -offset);
            const entry = State.studyCalendar[key];
            const hasActivity = !!entry && ((entry.sessions || 0) > 0 || (entry.pomodoros || 0) > 0 || (entry.topics || []).length > 0);
            if (!hasActivity) break;
            currentStreak += 1;
        }
        const bestDayLabel = bestDayScore > 0 && bestDayKey
            ? parseDateKey(bestDayKey).toLocaleDateString("es-MX", { day: "numeric", month: "short" })
            : "Sin actividad";
        cont.innerHTML = `
            <div class="history-study-summary-layout">
                <div class="history-study-summary-head">
                    <div>
                        <span class="dashboard-section-kicker">Panorama reciente</span>
                        <h3 class="dashboard-section-title">Ritmo de estudio</h3>
                        <p class="history-study-summary-copy">${sessions} sesiones, ${pomodoros} pomodoros y ${touchedTopics} temas tocados en los últimos 7 días.</p>
                    </div>
                    <div class="history-study-summary-stats">
                        <article class="history-summary-stat">
                            <span class="history-summary-stat-label">Racha</span>
                            <strong class="history-summary-stat-value">${currentStreak}</strong>
                            <span class="history-summary-stat-note">días seguidos</span>
                        </article>
                        <article class="history-summary-stat">
                            <span class="history-summary-stat-label">Días activos</span>
                            <strong class="history-summary-stat-value">${activeDays}</strong>
                            <span class="history-summary-stat-note">de los últimos 28</span>
                        </article>
                        <article class="history-summary-stat">
                            <span class="history-summary-stat-label">Mejor día</span>
                            <strong class="history-summary-stat-value">${escapeHtml(bestDayLabel)}</strong>
                            <span class="history-summary-stat-note">más carga reciente</span>
                        </article>
                    </div>
                </div>
                <div class="history-study-summary-calendar">
                    <div class="history-study-summary-weekdays">
                        <span>L</span>
                        <span>M</span>
                        <span>M</span>
                        <span>J</span>
                        <span>V</span>
                        <span>S</span>
                        <span>D</span>
                    </div>
                    <div id="history-calendar-grid" class="history-study-summary-grid"></div>
                </div>
                <div class="history-study-summary-legend">
                    <span>Poca actividad</span>
                    <span class="history-study-summary-legend-scale">
                        <i></i><i></i><i></i><i></i>
                    </span>
                    <span>Mayor intensidad</span>
                </div>
            </div>
        `;
        renderCalendarHeatmap("history-calendar-grid", 28, { alignToWeekStart: true });
    };

    const renderNotebookView = () => {
        ensureStudySystemsState();
        const list = $("notebook-list");
        const searchTerm = normalizeTextKey($("notebook-search")?.value || "");
        const tagFilter = normalizeTextKey($("notebook-tags-filter")?.value || "");
        const filtered = (State.caseNotebook || []).filter(entry => {
            const haystack = normalizeTextKey([entry.title, entry.topic, entry.caseText, entry.note, (entry.tags || []).join(" ")].join(" "));
            const matchesSearch = !searchTerm || haystack.includes(searchTerm);
            const matchesTag = !tagFilter || (entry.tags || []).some(tag => normalizeTextKey(tag).includes(tagFilter));
            return matchesSearch && matchesTag;
        });
        if (list) {
            list.innerHTML = filtered.length
                ? filtered.map(entry => `
                    <button class="notebook-list-item ${State.notebookSelectedId === entry.id ? "is-active" : ""}" type="button" onclick="window.openNotebookEntry('${encodeURIComponent(entry.id)}')">
                        <div class="notebook-list-top">
                            <div>
                                <h3 class="notebook-list-title">${escapeHtml(entry.title || "Caso clínico")}</h3>
                                <p class="notebook-list-meta">${escapeHtml(entry.topic || "")}</p>
                            </div>
                            <span class="review-item-tag">${escapeHtml((entry.tags || [])[0] || "Caso")}</span>
                        </div>
                        <p class="notebook-list-meta">${escapeHtml(truncateText(entry.note || entry.caseText || "", 120))}</p>
                    </button>
                `).join("")
                : `<div class="today-empty">No hay casos que coincidan con tu búsqueda.</div>`;
        }
        const selected = (State.caseNotebook || []).find(entry => entry.id === State.notebookSelectedId) || filtered[0] || null;
        if (!State.notebookSelectedId && selected) State.notebookSelectedId = selected.id;
        const empty = $("notebook-empty");
        const editor = $("notebook-editor");
        if (!selected) {
            if (empty) empty.style.display = "block";
            if (editor) editor.style.display = "none";
            return;
        }
        if (empty) empty.style.display = "none";
        if (editor) editor.style.display = "block";
        if ($("notebook-editor-title")) $("notebook-editor-title").textContent = selected.title || "Caso clínico";
        if ($("notebook-editor-meta")) $("notebook-editor-meta").textContent = `${selected.topic || "Sin tema"} · ${TRONCAL_LABELS[selected.specialty] || selected.specialty || "General"}`;
        if ($("notebook-note-input")) $("notebook-note-input").value = selected.note || "";
        if ($("notebook-tags-input")) $("notebook-tags-input").value = (selected.tags || []).join(", ");
    };

    const renderRefuerzosView = () => {
        const failList = $("refuerzos-fail-list");
        if (!failList) return;

        failList.innerHTML = "";

        // Collect all themes and their stats
        let allTemas = [];
        if (State.globalStats.byTema) {
            for (let tema in State.globalStats.byTema) {
                allTemas.push({ tema, ...State.globalStats.byTema[tema] });
            }
        }

        // If no data, show empty state
        if (allTemas.length === 0) {
            failList.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
                    <div style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;">&#x2728;</div>
                    <h3 style="color: var(--text-secondary); margin-bottom: 10px;">¡Aún no hay puntos de falla!</h3>
                    <p style="font-size: 13px;">Realiza simulacros y la IA comenzará a analizar tus áreas de oportunidad aquí.</p>
                </div>
            `;
            return;
        }

        // Calculate precision mapping and sort strictly by precision ascending, then total descending
        const temaRates = allTemas.map(t => {
            const precision = (t.correct / t.total) * 100;
            return {
                tema: t.tema,
                specialty: t.specialty,
                total: t.total,
                correct: t.correct,
                wrong: t.total - t.correct,
                precision: precision
            };
        });

        // Solo mostrar temas donde haya margen de mejora (precision < 100 y mínimo 2 preguntas respondidas para evitar ruido estadístico, o si es la única información disponible)
        const filteredTemas = temaRates.filter(t => t.precision < 100 || t.total >= 1);

        filteredTemas.sort((a, b) => {
            if (a.precision === b.precision) return b.total - a.total; // Tiebreaker: if precision is same, more attempts means higher priority to fix
            return a.precision - b.precision;
        });

        // Store top failed themes globally for Quick Action Buttons
        State.topFailedTemas = filteredTemas.slice(0, 10).map(t => t.tema);

        filteredTemas.forEach(t => {
            const el = document.createElement("div");
            el.className = "fail-item";

            // Priority logic based on math
            let priorityBadge = "";
            let priorityLabel = "";
            if (t.precision <= 40) { priorityBadge = "background: rgba(239, 68, 68, 0.15); color: var(--accent-red); border: 1px solid rgba(239, 68, 68, 0.3);"; priorityLabel = "Prioridad Crítica"; }
            else if (t.precision <= 65) { priorityBadge = "background: rgba(245, 158, 11, 0.15); color: var(--accent-orange); border: 1px solid rgba(245, 158, 11, 0.3);"; priorityLabel = "Prioridad Alta"; }
            else { priorityBadge = "background: rgba(59, 130, 246, 0.15); color: var(--accent-blue); border: 1px solid rgba(59, 130, 246, 0.3);"; priorityLabel = "Para Repaso"; }

            // Specialty friendly names mapping
            const specNames = { 'mi': 'Medicina Interna', 'ped': 'Pediatría', 'gyo': 'Ginecología y Obstetricia', 'cir': 'Cirugía General' };
            const specName = specNames[t.specialty] || t.specialty;

            el.innerHTML = `
                <div class="fail-item-info" style="width: 100%;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                        <div class="fail-item-title">${t.tema}</div>
                        <div style="font-size: 10px; padding: 3px 8px; border-radius: 12px; font-weight: 700; ${priorityBadge}">${priorityLabel}</div>
                    </div>
                    
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div class="fail-item-sub" style="color: var(--text-muted); font-size: 11px;">${specName.toUpperCase()}</div>
                        <div style="font-size: 12px; font-weight: 700; color: ${t.precision <= 60 ? 'var(--accent-red)' : 'var(--text-secondary)'};">
                            Precisión: ${t.precision.toFixed(1)}%
                        </div>
                    </div>
                    
                    <div style="width: 100%; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.05); margin-top: 10px; overflow: hidden; display: flex;">
                        <div style="height: 100%; width: ${t.precision}%; background: var(--accent-green);"></div>
                        <div style="height: 100%; width: ${100 - t.precision}%; background: var(--accent-red);"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 10px; margin-top: 4px; color: var(--text-muted);">
                        <span>${t.correct} bien</span>
                        <span>${t.wrong} mal</span>
                    </div>
                </div>
            `;
            failList.appendChild(el);
        });

        // ============================================
        // ALSO RENDER TOP 3 PREVIEW FOR DASHBOARD
        // ============================================
        const dashFailList = $("dash-fail-list");
        if (dashFailList) {
            dashFailList.innerHTML = "";
            filteredTemas.slice(0, 3).forEach(t => {
                const elDash = document.createElement("div");
                elDash.className = "fail-item";
                elDash.style.padding = "10px 14px";

                let priorityLabel = "";
                let badgeClass = "";
                if (t.precision <= 40) { priorityLabel = "Crítica"; badgeClass = "orange-bg"; }
                else if (t.precision <= 65) { priorityLabel = "Alta"; badgeClass = "blue-bg"; }
                else { priorityLabel = "Media"; badgeClass = "green-bg"; }

                elDash.innerHTML = `
                    <div class="fail-item-info" style="width:100%; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div class="fail-item-title" style="font-size: 13px;">${t.tema}</div>
                            <div class="fail-item-sub" style="font-size: 10px;">Prioridad: ${priorityLabel} | Precisión: ${t.precision.toFixed(1)}%</div>
                        </div>
                        <div class="fail-item-badge ${badgeClass}" style="padding: 3px 6px; font-size: 9px; border:none; color:white; border-radius:4px;">Repasar</div>
                    </div>
                `;
                dashFailList.appendChild(elDash);
            });
            if (filteredTemas.length === 0) {
                dashFailList.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 12px; padding: 10px;">Aún no hay puntos de falla.</div>`;
            }
        }
    };

    let lastDashboardRenderKey = "";
    const updateDashboardStats = (force = false) => {
        const now = new Date();
        const quoteTickKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${Math.floor(now.getHours() / 4)}`;
        const bySpec = State.globalStats?.bySpecialty || {};
        const specKey = ["mi", "ped", "gyo", "cir"]
            .map(k => `${bySpec[k]?.total || 0}-${bySpec[k]?.correct || 0}`)
            .join("|");
        const lastHist = (State.history && State.history.length > 0) ? State.history[State.history.length - 1] : null;
        const histKey = lastHist ? `${lastHist.pct || 0}-${lastHist.timestamp || 0}` : "none";
        const renderKey = [
            State.examActive ? 1 : 0,
            State.globalStats?.respondidas || 0,
            State.globalStats?.aciertos || 0,
            State.globalStats?.sesiones || 0,
            State.globalStats?.totalBlank || 0,
            State.history?.length || 0,
            histKey,
            State.userName || "",
            State.theme || "ocean",
            State.fontPreset || "clinical",
            quoteTickKey,
            specKey
        ].join("::");
        if (!force && renderKey === lastDashboardRenderKey) return;
        lastDashboardRenderKey = renderKey;

        if ($("active-exam-banner")) {
            $("active-exam-banner").style.display = State.examActive ? "flex" : "none";
        }
        updateMotivationalQuote();
        const elements = {
            'dash-sesiones': 'sesiones'
        };
        for (let id in elements) if ($(id)) $(id).textContent = State.globalStats[elements[id]] || 0;
        const pct = State.globalStats.respondidas > 0 ? ((State.globalStats.aciertos / State.globalStats.respondidas) * 100).toFixed(1) : "0.0";
        if ($("dash-promedio-gral")) $("dash-promedio-gral").textContent = `${pct}%`;
        if ($("dash-promedio")) $("dash-promedio").textContent = `${pct}%`;
        if ($("dash-promedio-bar")) $("dash-promedio-bar").style.width = `${pct}%`;

        // Update Flame Widget (Streak)
        const effStreak = getEffectiveStreak();
        if ($("streak-val")) $("streak-val").textContent = `${effStreak} Día${effStreak !== 1 ? 's' : ''}`;

                // Lógica de Resumen de Precisión (Logistics Overview Style)
        let aciertos = State.globalStats.aciertos || 0;
        let respondidas = State.globalStats.respondidas || 0;
        let errores = Math.max(0, respondidas - aciertos);
        let omitidas = State.globalStats.totalBlank || 0;

        const timeframe = window.dashboardOverviewTimeframe || 'all';
        if (timeframe !== 'all') {
            const now = Date.now();
            let limitMs = 0;
            if (timeframe === '7') limitMs = 7 * 24 * 60 * 60 * 1000;
            else if (timeframe === '30') limitMs = 30 * 24 * 60 * 60 * 1000;
            else if (timeframe === 'month') {
                const start = new Date();
                start.setDate(1); start.setHours(0,0,0,0);
                limitMs = now - start.getTime();
            }

            let tAciertos = 0, tRespondidas = 0, tOmitidas = 0;
            const historyList = State.history || [];
            historyList.forEach(h => {
                if (now - h.timestamp <= limitMs) {
                    const hTotal = Number(h.preguntas) || 0;
                    const hBlank = Number(h.blank) || 0;
                    const hCorrect = typeof h.correct === 'number' ? h.correct : Math.round(((Number(h.pct)||0) / 100) * hTotal);
                    tAciertos += hCorrect;
                    tRespondidas += (hTotal - hBlank);
                    tOmitidas += hBlank;
                }
            });
            aciertos = tAciertos;
            respondidas = tRespondidas;
            errores = Math.max(0, respondidas - aciertos);
            omitidas = tOmitidas;
        }

        const totalLogistics = aciertos + errores + omitidas;

        if ($("ov-val-aciertos")) {
            $("ov-val-aciertos").textContent = aciertos.toLocaleString();
            $("ov-val-errores").textContent = errores.toLocaleString();
            $("ov-val-omitidas").textContent = omitidas.toLocaleString();

            const pA = totalLogistics > 0 ? (aciertos / totalLogistics) * 100 : 33.3;
            const pE = totalLogistics > 0 ? (errores / totalLogistics) * 100 : 33.3;
            const pO = totalLogistics > 0 ? (omitidas / totalLogistics) * 100 : 33.4;

            $("ov-bar-aciertos").style.width = `${pA}%`;
            $("ov-bar-errores").style.width = `${pE}%`;
            $("ov-bar-omitidas").style.width = `${pO}%`;

            // Position labels by segment center and enforce minimum spacing to avoid overlap.
            const ovContainer = $("overview-labels-container");
            const ovLabel1 = $("ov-label-1");
            const ovLabel2 = $("ov-label-2");
            const ovLabel3 = $("ov-label-3");

            if (ovContainer && ovLabel1 && ovLabel2 && ovLabel3) {
                const containerWidth = ovContainer.clientWidth || 0;
                const minGapPx = 8;

                const labelNodes = [
                    { el: ovLabel1, startPct: 0, endPct: pA },
                    { el: ovLabel2, startPct: pA, endPct: pA + pE },
                    { el: ovLabel3, startPct: pA + pE, endPct: 100 }
                ];

                const layout = labelNodes.map((item) => {
                    const width = item.el.offsetWidth || 0;
                    const centerPct = (item.startPct + item.endPct) / 2;
                    const targetPx = (centerPct / 100) * containerWidth;
                    const maxLeft = Math.max(0, containerWidth - width);
                    const left = Math.max(0, Math.min(targetPx - (width / 2), maxLeft));
                    return { ...item, width, maxLeft, left };
                });

                for (let i = 1; i < layout.length; i++) {
                    const prev = layout[i - 1];
                    const curr = layout[i];
                    const minLeft = prev.left + prev.width + minGapPx;
                    if (curr.left < minLeft) curr.left = Math.min(minLeft, curr.maxLeft);
                }

                for (let i = layout.length - 2; i >= 0; i--) {
                    const curr = layout[i];
                    const next = layout[i + 1];
                    const maxLeft = next.left - curr.width - minGapPx;
                    if (curr.left > maxLeft) curr.left = Math.max(0, maxLeft);
                }

                layout.forEach((item) => {
                    item.el.style.left = `${Math.round(item.left)}px`;
                    item.el.style.transform = "none";
                });
            }
        }

        // Lógica de Rangos
        const rangoEl = $("dash-rango");
        if (rangoEl) {
            rangoEl.textContent = getUserRankLabel(parseFloat(pct));
        }

        ['mi', 'ped', 'gyo', 'cir'].forEach(k => {
            const s = State.globalStats.bySpecialty[k];
            const p = s.total > 0 ? (s.correct / s.total) * 100 : 0;
            const bar = $(`bar-${k}`); if (bar) bar.style.height = `${Math.max(p, 5)}%`;
        });

        // Update new stats tab
        if ($("stats-global-precision")) $("stats-global-precision").textContent = `${pct}%`;
        if ($("stats-total-questions")) $("stats-total-questions").textContent = State.globalStats.respondidas;
        const avgTimeEl = $("stats-avg-time-per-question");
        if (avgTimeEl) {
            const recentSessions = (State.history || []).slice(-10);
            let totalSec = 0, totalQ = 0;
            recentSessions.forEach(s => {
                const q = Number(s?.preguntas) || 0;
                const sec = Number(s?.elapsedSec) || 0;
                if (q > 0 && sec > 0) { totalSec += sec; totalQ += q; }
            });
            avgTimeEl.textContent = totalQ > 0 ? `${Math.round(totalSec / totalQ)}s` : "0s";
        }

        // Update Fail Points (Puntos de Falla) is now handled by the new Refuerzos View
        renderRefuerzosView();
        renderStudyDashboard();
        renderResultsPostmortem();
    };

    let chartHistory = null;
    let chartSpecialties = null;
    let chartDoughnut = null;
    let chartSpecLineInstance = null;
    let chartPace = null;
    let chartSpecialtyCoverage = null;
    let chartWeakTopics = null;
    let lastChartsRenderKey = "";

    const updateCharts = () => {
        if (typeof Chart === 'undefined') return;
        const viewScope = State.view === "view-estadisticas"
            ? "stats"
            : (State.view === "view-dashboard" ? "dashboard" : "other");
        if (viewScope === "other") return;

        const bySpec = State.globalStats?.bySpecialty || {};
        const specKey = ["mi", "ped", "gyo", "cir"]
            .map(k => `${bySpec[k]?.total || 0}-${bySpec[k]?.correct || 0}`)
            .join("|");
        const lastHist = (State.history && State.history.length > 0) ? State.history[State.history.length - 1] : null;
        const histKey = lastHist
            ? `${lastHist.pct || 0}-${lastHist.timestamp || 0}-${lastHist.elapsedSec || 0}-${lastHist.blank || 0}-${lastHist.preguntas || 0}`
            : "none";
        const weakTopicKey = getTopicPerformanceEntries()
            .slice(0, 8)
            .map(entry => `${entry.topic}:${entry.total}-${entry.correct}-${entry.status || "sin_tocar"}`)
            .join("|");
        const chartKey = [
            State.theme || "ocean",
            State.fontPreset || "clinical",
            State.history?.length || 0,
            histKey,
            State.globalStats?.respondidas || 0,
            State.globalStats?.aciertos || 0,
            State.globalStats?.totalBlank || 0,
            specKey,
            weakTopicKey
        ].join("::");
        if (chartKey === lastChartsRenderKey) {
            if (chartHistory && typeof chartHistory.resize === "function") chartHistory.resize();
            if (chartSpecLineInstance && typeof chartSpecLineInstance.resize === "function") chartSpecLineInstance.resize();
            if (chartSpecialties && typeof chartSpecialties.resize === "function") chartSpecialties.resize();
            if (chartDoughnut && typeof chartDoughnut.resize === "function") chartDoughnut.resize();
            if (chartPace && typeof chartPace.resize === "function") chartPace.resize();
            if (chartSpecialtyCoverage && typeof chartSpecialtyCoverage.resize === "function") chartSpecialtyCoverage.resize();
            if (chartWeakTopics && typeof chartWeakTopics.resize === "function") chartWeakTopics.resize();
            return;
        }
        lastChartsRenderKey = chartKey;

        const style = getComputedStyle(document.body);
        const textMuted = style.getPropertyValue('--text-muted').trim() || '#a0aec0';
        const textPrimary = style.getPropertyValue('--text-primary').trim() || '#ffffff';
        const accentGreen = style.getPropertyValue('--accent-green').trim() || '#05C07F';
        const accentBlue = style.getPropertyValue('--accent-blue').trim() || '#3b82f6';
        const accentOrange = style.getPropertyValue('--accent-orange').trim() || '#f37a20';
        const accentRed = style.getPropertyValue('--accent-red').trim() || '#ef4444';
        const fontFamily = style.getPropertyValue('--font-ui').trim() || FONT_PRESET_CONFIG[normalizeFontPreset(State.fontPreset)].ui;
        const formatSessionLabel = (session, index) => {
            if (!session || !session.timestamp) return `Sesion ${index + 1}`;
            try {
                return new Date(session.timestamp).toLocaleDateString('es-MX', {
                    month: 'short',
                    day: 'numeric'
                });
            } catch (_) {
                return `Sesion ${index + 1}`;
            }
        };

        Chart.defaults.color = textMuted;
        Chart.defaults.font.family = fontFamily;

        // Chart 1: Evolución de Aciertos en el tiempo (Line)
        const ctxHist = document.getElementById('chart-history');
        if (ctxHist) {
            const histData = [...State.history].slice(-10); // Últimos 10
            const labels = histData.map((session, i) => formatSessionLabel(session, i));
            const dataPts = histData.map(h => h.pct);
            const histGradient = ctxHist.getContext('2d').createLinearGradient(0, 0, 0, 320);
            histGradient.addColorStop(0, accentGreen + '55');
            histGradient.addColorStop(1, accentGreen + '00');

            if (chartHistory) chartHistory.destroy();
            chartHistory = new Chart(ctxHist, {
                type: 'line',
                data: {
                    labels: labels.length ? labels : ['Sin datos'],
                    datasets: [{
                        label: '% Aciertos',
                        data: dataPts.length ? dataPts : [0],
                        borderColor: accentGreen,
                        backgroundColor: histGradient,
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: accentGreen,
                        pointRadius: dataPts.length ? 4 : 0,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                title: (items) => {
                                    const session = histData[items[0]?.dataIndex];
                                    if (!session) return 'Sin sesiones';
                                    const kind = session.sessionKind === 'estudio' ? 'Estudio' : 'Simulacro';
                                    return `${formatSessionLabel(session, items[0].dataIndex)} · ${kind}`;
                                },
                                afterLabel: (context) => {
                                    const session = histData[context.dataIndex];
                                    if (!session) return [];
                                    const pace = session.preguntas > 0
                                        ? `${Math.round((session.elapsedSec || 0) / session.preguntas)}s/pregunta`
                                        : 'Sin ritmo registrado';
                                    return [
                                        `${session.preguntas || 0} preguntas`,
                                        `${session.blank || 0} omitidas`,
                                        pace
                                    ];
                                }
                            }
                        }
                    },
                    scales: { y: { beginAtZero: true, max: 100 } }
                }
            });
        }

        // Chart 2a: Especialidades como Line Chart (Estilo Bolsa de Valores del Dashboard)
        const ctxSpecLine = document.getElementById('chart-specialties-line');

        if (ctxSpecLine) {
            const labels = [];
            const dataPts = [];
            const keys = ['mi', 'ped', 'gyo', 'cir'];
            keys.forEach(k => {
                const s = State.globalStats.bySpecialty[k];
                if (s) {
                    labels.push(s.name.replace(' y Obstetricia', ''));
                    dataPts.push(s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0);
                }
            });

            if (chartSpecLineInstance) chartSpecLineInstance.destroy();

            const gradient = ctxSpecLine.getContext('2d').createLinearGradient(0, 0, 0, 250);
            gradient.addColorStop(0, accentBlue + '55');
            gradient.addColorStop(1, accentBlue + '00');

            chartSpecLineInstance = new Chart(ctxSpecLine, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Rendimiento %',
                        data: dataPts,
                        borderColor: accentBlue,
                        backgroundColor: gradient,
                        borderWidth: 3,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: accentBlue,
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 2,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { mode: 'index', intersect: false }
                    },
                    scales: {
                        y: { beginAtZero: true, max: 100, grid: { color: 'rgba(160,174,192,0.05)' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        // Chart 2b: Especialidades Radar (Hexagonal) para la pestaña Estadísticas
        const ctxSpec = document.getElementById('chart-specialties');
        if (ctxSpec) {
            const labels = [];
            const dataPts = [];
            const keys = ['mi', 'ped', 'gyo', 'cir'];
            keys.forEach(k => {
                const s = State.globalStats.bySpecialty[k];
                if (s) {
                    labels.push(s.name.replace(' y Obstetricia', ''));
                    dataPts.push(s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0);
                }
            });

            if (chartSpecialties) chartSpecialties.destroy();

            chartSpecialties = new Chart(ctxSpec, {
                type: 'radar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Dominio %',
                        data: dataPts,
                        backgroundColor: 'rgba(5, 192, 127, 0.2)', // Verde transparente
                        borderColor: '#05C07F', // Verde
                        pointBackgroundColor: '#05C07F',
                        borderWidth: 2,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const key = ['mi', 'ped', 'gyo', 'cir'][context.dataIndex];
                                    const stats = State.globalStats.bySpecialty[key];
                                    const total = stats?.total || 0;
                                    const correct = stats?.correct || 0;
                                    return `${context.formattedValue}% (${correct}/${total})`;
                                }
                            }
                        }
                    },
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                stepSize: 20,
                                display: false
                            },
                            grid: {
                                color: 'rgba(160,174,192,0.1)'
                            },
                            angleLines: {
                                color: 'rgba(160,174,192,0.1)'
                            },
                            pointLabels: {
                                font: { size: 10 },
                                color: textMuted
                            }
                        }
                    }
                }
            });
        }

        // Chart 3: Distribución Global (Doughnut)
        const ctxDbl = document.getElementById('chart-doughnut');
        if (ctxDbl) {
            let aciertos = State.globalStats.aciertos;
            let errores = State.globalStats.respondidas - aciertos;
            // Verde y Rojo fijos
            let bgColors = ['#10B981', '#EF4444'];
            if (State.globalStats.respondidas === 0) {
                aciertos = 0; errores = 1;
                bgColors = ['#334155', '#334155'];
            }

            if (chartDoughnut) chartDoughnut.destroy();
            chartDoughnut = new Chart(ctxDbl, {
                type: 'doughnut',
                data: {
                    labels: ['Aciertos', 'Errores'],
                    datasets: [{
                        data: [aciertos, errores],
                        backgroundColor: bgColors,
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } }
                    }
                }
            });

            // Actualizar porcentaje central
            const centerPct = $("doughnut-center-pct");
            if (centerPct) {
                const pctValue = State.globalStats.respondidas > 0 ? Math.round((State.globalStats.aciertos / State.globalStats.respondidas) * 100) : 0;
                centerPct.textContent = `${pctValue}%`;
            }
        }

        // Chart 4: Ritmo por sesión (segundos por pregunta)
        const ctxPace = document.getElementById('chart-pace');
        if (ctxPace) {
            const histData = [...State.history].slice(-10);
            const labels = histData.map((session, i) => formatSessionLabel(session, i));
            const paceData = histData.map(session => {
                const preguntas = Number(session?.preguntas) || 0;
                if (preguntas <= 0) return 0;
                return Math.round((Number(session?.elapsedSec) || 0) / preguntas);
            });
            const paceGradient = ctxPace.getContext('2d').createLinearGradient(0, 0, 0, 300);
            paceGradient.addColorStop(0, accentBlue + '55');
            paceGradient.addColorStop(1, accentBlue + '05');
            const maxPace = paceData.length ? Math.max(...paceData, 90) : 90;

            if (chartPace) chartPace.destroy();
            chartPace = new Chart(ctxPace, {
                type: 'line',
                data: {
                    labels: labels.length ? labels : ['Sin datos'],
                    datasets: [{
                        label: 'Segundos por pregunta',
                        data: paceData.length ? paceData : [0],
                        borderColor: accentBlue,
                        backgroundColor: paceGradient,
                        borderWidth: 3,
                        tension: 0.35,
                        fill: true,
                        pointBackgroundColor: accentBlue,
                        pointRadius: paceData.length ? 4 : 0,
                        pointHoverRadius: 6
                    }, {
                        label: 'Objetivo 90s',
                        data: (labels.length ? labels : ['Sin datos']).map(() => 90),
                        borderColor: accentOrange,
                        borderDash: [6, 6],
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 0,
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { usePointStyle: true, padding: 18 }
                        },
                        tooltip: {
                            callbacks: {
                                afterBody: (items) => {
                                    const session = histData[items[0]?.dataIndex];
                                    if (!session) return [];
                                    return [
                                        `${session.pct || 0}% de aciertos`,
                                        `${session.preguntas || 0} preguntas`,
                                        `${session.blank || 0} omitidas`
                                    ];
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            suggestedMax: Math.ceil((maxPace + 20) / 10) * 10,
                            ticks: {
                                callback: (value) => `${value}s`
                            }
                        }
                    }
                }
            });
        }

        // Chart 5: Cobertura por especialidad (volumen vs precisión)
        const ctxCoverage = document.getElementById('chart-specialty-coverage');
        if (ctxCoverage) {
            const specRows = ['mi', 'ped', 'gyo', 'cir'].map(key => {
                const stats = State.globalStats.bySpecialty[key] || {};
                const total = Number(stats.total) || 0;
                const correct = Number(stats.correct) || 0;
                const precision = total > 0 ? Number(((correct / total) * 100).toFixed(1)) : 0;
                return {
                    key,
                    label: (stats.name || TRONCAL_LABELS[key] || key).replace(' y Obstetricia', ''),
                    total,
                    correct,
                    precision
                };
            });

            if (chartSpecialtyCoverage) chartSpecialtyCoverage.destroy();
            chartSpecialtyCoverage = new Chart(ctxCoverage, {
                data: {
                    labels: specRows.map(row => row.label),
                    datasets: [{
                        type: 'bar',
                        label: 'Reactivos respondidos',
                        data: specRows.map(row => row.total),
                        backgroundColor: [
                            accentBlue + 'cc',
                            accentGreen + 'cc',
                            accentOrange + 'cc',
                            accentRed + 'cc'
                        ],
                        borderRadius: 10,
                        maxBarThickness: 44,
                        yAxisID: 'y'
                    }, {
                        type: 'line',
                        label: 'Precisión %',
                        data: specRows.map(row => row.precision),
                        borderColor: textPrimary,
                        backgroundColor: textPrimary,
                        pointBackgroundColor: textPrimary,
                        pointBorderColor: accentBlue,
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        tension: 0.3,
                        yAxisID: 'y1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { usePointStyle: true, padding: 18 }
                        },
                        tooltip: {
                            callbacks: {
                                afterLabel: (context) => {
                                    const row = specRows[context.dataIndex];
                                    if (!row) return [];
                                    if (context.dataset.yAxisID === 'y') {
                                        return `Precisión: ${row.precision}%`;
                                    }
                                    return `${row.correct}/${row.total} correctas`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Reactivos'
                            }
                        },
                        y1: {
                            beginAtZero: true,
                            max: 100,
                            position: 'right',
                            grid: { drawOnChartArea: false },
                            ticks: {
                                callback: (value) => `${value}%`
                            },
                            title: {
                                display: true,
                                text: 'Precisión'
                            }
                        }
                    }
                }
            });
        }

        // Chart 6: Temas más frágiles
        const ctxWeakTopics = document.getElementById('chart-weak-topics');
        if (ctxWeakTopics) {
            const weakTopics = getTopicPerformanceEntries()
                .filter(entry => entry.total >= 2)
                .slice(0, 6);
            const topicLabels = weakTopics.map(entry => truncateText(entry.topic, 52));
            const precisions = weakTopics.map(entry => Number(entry.precision.toFixed(1)));
            const colors = weakTopics.map(entry => {
                if (entry.precision < 58) return accentRed + 'cc';
                if (entry.precision < 75) return accentOrange + 'cc';
                return accentGreen + 'cc';
            });

            if (chartWeakTopics) chartWeakTopics.destroy();
            chartWeakTopics = new Chart(ctxWeakTopics, {
                type: 'bar',
                data: {
                    labels: topicLabels.length ? topicLabels : ['Aun no hay temas con suficiente historial'],
                    datasets: [{
                        label: 'Precisión %',
                        data: precisions.length ? precisions : [0],
                        backgroundColor: colors.length ? colors : [accentBlue + '66'],
                        borderRadius: 10,
                        borderSkipped: false,
                        maxBarThickness: 26
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const entry = weakTopics[context.dataIndex];
                                    if (!entry) return 'Sin historial suficiente';
                                    return `Precisión: ${entry.precision.toFixed(1)}%`;
                                },
                                afterLabel: (context) => {
                                    const entry = weakTopics[context.dataIndex];
                                    if (!entry) return [];
                                    return [
                                        `${entry.correct}/${entry.total} correctas`,
                                        `Especialidad: ${TRONCAL_LABELS[entry.specialty] || entry.specialty}`
                                    ];
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: (value) => `${value}%`
                            }
                        },
                        y: {
                            grid: { display: false }
                        }
                    }
                }
            });
        }
    };

    const updateHistoryView = () => {
        const cont = $("history-list"); if (!cont) return;
        renderHistoryStudySummary();
        if (State.history.length === 0) {
            cont.innerHTML = `<div class="list-item empty-history"><p style="color:var(--text-muted); padding: 20px;">Aún no hay sesiones registradas.</p></div>`;
            return;
        }
        cont.innerHTML = "";
        [...State.history].reverse().forEach((h, i) => {
            const realIdx = State.history.length - 1 - i;
            const div = document.createElement("div"); div.className = "list-item";
            const studiedTopics = Array.isArray(h.topicsStudied) ? h.topicsStudied.slice(0, 3) : [];
            div.innerHTML = `
                <div class="history-list-item-rich">
                    <div class="list-item-content">
                        <h3>${h.tipo || 'Examen'} - ${h.preguntas} preguntas</h3>
                        <p>${h.pct}% Aciertos | ${formatTime(h.elapsedSec || 0)} | ${h.sessionKind || "simulacro"}</p>
                    </div>
                    ${studiedTopics.length ? `<div class="history-list-tags">${studiedTopics.map(topic => `<span class="review-item-tag">${escapeHtml(topic)}</span>`).join("")}</div>` : ""}
                    ${h.nextRecommendation ? `<p class="history-study-summary-copy">${escapeHtml(h.nextRecommendation)}</p>` : ""}
                </div>
                <div style="display:flex; align-items:center; gap: 10px;">
                    <span class="badge ${h.pct > 70 ? 'green-bg' : 'orange-bg'}">${h.pct}%</span>
                    <button class="btn-ghost btn-rev-history" data-index="${realIdx}">Revisar</button>
                </div>`;
            cont.appendChild(div);
        });

        cont.querySelectorAll(".btn-rev-history").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = e.target.getAttribute("data-index");
                const h = State.history[idx];
                if (h && h.questionSet && h.answers) {
                    State.questionSet = h.questionSet;
                    State.answers = h.answers;
                    showView("view-review");
                    startReview();
                } else {
                    showNotification("No hay detalles guardados para este examen antiguo.");
                }
            });
        });
    };

    // ---------------------------------------------------------------------------
    // Review Logic
    // ---------------------------------------------------------------------------
    let reviewIndex = 0;

    const startReview = () => {
        reviewIndex = 0;
        renderReviewQuestion();
        showView("view-review");
    };

    const renderReviewQuestion = () => {
        if (!State.questionSet || State.questionSet.length === 0) return;

        let qFirst = State.questionSet[reviewIndex];

        // Normalizar reviewIndex al inicio del grupo (caso clínico)
        const groupId = qFirst.caseGroupId;
        let firstIdx = reviewIndex;
        while (firstIdx > 0 && State.questionSet[firstIdx - 1].caseGroupId === groupId) {
            firstIdx--;
        }
        reviewIndex = firstIdx;
        qFirst = State.questionSet[reviewIndex];

        const total = State.questionSet.length;

        const indices = [];
        for (let i = reviewIndex; i < total; i++) {
            if (State.questionSet[i].caseGroupId === groupId) indices.push(i);
            else break;
        }

        const badge = $("rev-case-area-badge"); if (badge) badge.textContent = (State.globalStats.bySpecialty[qFirst.specialty]?.name || qFirst.specialty).toUpperCase();
        const caseText = $("rev-case-text"); if (caseText) caseText.textContent = qFirst.case;
        const qNum = $("rev-q-num-display"); if (qNum) qNum.textContent = `Revise Caso (Preguntas ${indices[0] + 1}${indices.length > 1 ? ` a ${indices[indices.length - 1] + 1}` : ''})`;

        const container = $("rev-questions-container");
        if (container) {
            container.innerHTML = "";
            indices.forEach((qIndex) => {
                const q = State.questionSet[qIndex];
                const ans = State.answers[qIndex];

                const qBox = document.createElement("div");
                qBox.className = "question-box";
                qBox.style.marginTop = "20px";
                qBox.style.paddingTop = "20px";
                if (qIndex !== indices[0]) qBox.style.borderTop = "1px solid var(--border)";

                const qNumStr = q.totalSubQuestions > 1
                    ? `Pregunta ${qIndex + 1} (Parte ${q.subQuestionIndex} de ${q.totalSubQuestions})`
                    : `Pregunta ${qIndex + 1}`;

                const qTitle = document.createElement("h3");
                qTitle.className = "question-text";
                qTitle.style.marginBottom = "10px";
                qTitle.innerHTML = `<span style="font-size:12px; color:var(--text-muted); display:block; margin-bottom:4px;">${qNumStr}</span>${q.question}`;
                qBox.appendChild(qTitle);

                const optGrid = document.createElement("div");
                optGrid.className = "options-grid";
                q.options.forEach((optStr, idx) => {
                    const btn = document.createElement("button");
                    btn.className = "option-btn";
                    btn.style.cursor = "default"; // read-only
                    const letter = String.fromCharCode(65 + idx);
                    btn.innerHTML = `<strong>${letter}.</strong> ${optStr}`;

                    if (idx === q.answerIndex) btn.classList.add("correct-ans");
                    if (ans.selected === idx && idx !== q.answerIndex) btn.classList.add("wrong-ans");
                    if (ans.selected === idx) btn.classList.add("selected");

                    optGrid.appendChild(btn);
                });
                qBox.appendChild(optGrid);

                const fb = document.createElement("div");
                fb.className = `feedback-card ${ans.isCorrect ? '' : 'wrong'}`;
                fb.style.display = "block";
                fb.style.marginTop = "15px";
                fb.innerHTML = `
                    <h3 id="rev-feedback-header" style="margin:0 0 10px 0;">Explicación ENARM</h3>
                    <p>${q.explanation || ""}</p>
                    <div class="feedback-gpc">${q.gpcReference || ""}</div>
                `;
                qBox.appendChild(fb);

                container.appendChild(qBox);
            });
        }

        renderReviewSidebar();
    };

    const renderReviewSidebar = () => {
        const nav = $("rev-question-navigator"); if (!nav) return;
        nav.innerHTML = "";
        const currentGroupId = State.questionSet[reviewIndex]?.caseGroupId;

        State.questionSet.forEach((_, i) => {
            const a = State.answers[i];
            const q = State.questionSet[i];
            const dot = document.createElement("button");
            dot.className = "nav-dot";
            dot.textContent = i + 1;

            if (q.caseGroupId === currentGroupId) dot.classList.add("current");
            if (a.isCorrect) dot.classList.add("answered");
            else if (a.selected !== null) dot.classList.add("wrong");

            dot.addEventListener("click", () => { reviewIndex = i; renderReviewQuestion(); });
            nav.appendChild(dot);
        });
    };

    const startExamCountdown = () => {
        // ENARM 2026: 28 de septiembre de 2026 08:00 (hora local del dispositivo)
        const targetDate = new Date(2026, 8, 28, 8, 0, 0).getTime(); // Mes 0-based: 8 = Septiembre

        const update = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                if ($("exam-countdown")) $("exam-countdown").innerHTML = "<div class='countdown-label'>EL MOMENTO HA LLEGADO</div>";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if ($("cd-days")) $("cd-days").textContent = String(days).padStart(3, "0");
            if ($("cd-hours")) $("cd-hours").textContent = String(hours).padStart(2, "0");
            if ($("cd-mins")) $("cd-mins").textContent = String(minutes).padStart(2, "0");
            if ($("cd-secs")) $("cd-secs").textContent = String(seconds).padStart(2, "0");
        };

        update();
        setInterval(update, 1000);
    };

    // ---------------------------------------------------------------------------
    // Pomodoro Logic
    // ---------------------------------------------------------------------------
    let pomoTimer = null;
    let isPomodoroCollapsed = false;
    const persistPomodoroLocalState = () => {
        ensureStudySystemsState();
        localStorage.setItem(POMODORO_STORAGE_KEYS.settings, JSON.stringify(State.pomodoroSettings));
        localStorage.setItem(POMODORO_STORAGE_KEYS.state, JSON.stringify(State.pomodoroState));
        localStorage.setItem(POMODORO_STORAGE_KEYS.log, JSON.stringify((State.pomodoroLog || []).slice(0, POMODORO_MAX_LOG_ENTRIES)));
        localStorage.setItem(POMODORO_STORAGE_KEYS.specialties, JSON.stringify(State.pomodoroSpecialties || []));
        localStorage.setItem(POMODORO_STORAGE_KEYS.focus, String(State.pomodoroFocusLabel || ""));
    };
    const stopPomodoroTicker = () => {
        if (pomoTimer) {
            clearInterval(pomoTimer);
            pomoTimer = null;
        }
    };
    const getPomodoroProgress = () => {
        ensureStudySystemsState();
        const duration = getPomodoroDurationSecondsForMode(State.pomodoroState.mode);
        if (duration <= 0) return 0;
        return Math.max(0, Math.min(1, 1 - (State.pomodoroState.secondsLeft / duration)));
    };
    const getPomodoroLogoHtml = (className = "pomodoro-logo-badge", alt = "PomQuest") => {
        return `<img src="${POMQUEST_LOGO_SRC}" alt="${escapeHtml(alt)}" class="${escapeHtml(className)}">`;
    };
    const showPomodoroBrowserNotification = (title, body) => {
        if (!("Notification" in window) || Notification.permission !== "granted") return;
        try {
            const notification = new Notification(title, {
                body,
                icon: NOTIFICATION_ICON,
                badge: NOTIFICATION_BADGE,
                tag: "enarm-pomodoro",
                renotify: true
            });
            notification.onclick = (event) => {
                if (event && typeof event.preventDefault === "function") event.preventDefault();
                try {
                    window.focus();
                    showView("view-pomodoro");
                } catch (err) {
                    console.warn("[Pomodoro] No se pudo enfocar la ventana al abrir notificación:", err);
                }
                notification.close();
            };
            return;
        } catch (err) {
            console.warn("[Pomodoro] Falló la notificación directa, usando fallback:", err);
        }
        void showSystemNotification(title, body);
    };
    const notifyPomodoroCycle = (title, body) => {
        showNotification(body, "success");
        if (State.pomodoroSettings.systemNotifications && ("Notification" in window) && Notification.permission === "granted") {
            showPomodoroBrowserNotification(title, body);
        }
        try {
            window.alert(body);
        } catch (err) {
            console.warn("[Pomodoro] No se pudo mostrar la alerta final:", err);
        }
    };
    const updatePomodoroLinkedViews = () => {
        if ($("profile-stat-pomodoros")) $("profile-stat-pomodoros").textContent = String(State.globalStats.pomodoros || 0);
        if (State.view === "view-estudio-plus") renderStudyDashboard();
        if (State.view === "view-historial") renderHistoryStudySummary();
        if (State.view === "view-profile") renderProfileView();
        if (State.view === "view-pomodoro") renderPomodoroHub();
    };
    const transitionPomodoroState = (completedMode) => {
        const pState = State.pomodoroState;
        if (completedMode === "focus") {
            pState.pomodorosInCycle = Math.min(POMODORO_CYCLE_LENGTH, (pState.pomodorosInCycle || 0) + 1);
            pState.mode = (pState.pomodorosInCycle % POMODORO_CYCLE_LENGTH === 0) ? "longBreak" : "shortBreak";
        } else if (completedMode === "longBreak") {
            pState.pomodorosInCycle = 0;
            pState.mode = "focus";
        } else {
            pState.mode = "focus";
        }
        pState.secondsLeft = getPomodoroDurationSecondsForMode(pState.mode);
        pState.startedAt = 0;
        pState.endsAt = 0;
    };
    const createPomodoroLogEntry = (mode, completedAt) => ({
        id: `pomo-${completedAt}-${Math.random().toString(36).slice(2, 8)}`,
        mode,
        completedAt,
        durationSeconds: getPomodoroDurationSecondsForMode(mode),
        specialties: normalizePomodoroSpecialties(State.pomodoroSpecialties),
        focusLabel: ""
    });
    const startPomodoroTimer = (baseTime = Date.now()) => {
        ensureStudySystemsState();
        const pState = State.pomodoroState;
        if (pState.secondsLeft <= 0) {
            pState.secondsLeft = getPomodoroDurationSecondsForMode(pState.mode);
        }
        pState.isRunning = true;
        pState.startedAt = baseTime;
        pState.endsAt = baseTime + (pState.secondsLeft * 1000);
        persistPomodoroLocalState();
        renderPomodoroHub();
        stopPomodoroTicker();
        pomoTimer = setInterval(() => syncPomodoroClock(), 1000);
        syncPomodoroClock(true);
    };
    const pausePomodoroTimer = () => {
        ensureStudySystemsState();
        const pState = State.pomodoroState;
        if (!pState.isRunning) return;
        const remaining = Math.max(0, Math.ceil((pState.endsAt - Date.now()) / 1000));
        pState.secondsLeft = remaining;
        pState.isRunning = false;
        pState.startedAt = 0;
        pState.endsAt = 0;
        stopPomodoroTicker();
        persistPomodoroLocalState();
        renderPomodoroHub();
    };
    const resetPomodoroTimer = () => {
        ensureStudySystemsState();
        stopPomodoroTicker();
        State.pomodoroState = createDefaultPomodoroState(State.pomodoroSettings);
        persistPomodoroLocalState();
        renderPomodoroHub();
    };
    const skipPomodoroBreak = () => {
        ensureStudySystemsState();
        if (State.pomodoroState.mode === "focus") {
            showNotification("Solo puedes saltar un descanso.", "info");
            return;
        }
        stopPomodoroTicker();
        if (State.pomodoroState.mode === "longBreak") {
            State.pomodoroState.pomodorosInCycle = 0;
        }
        State.pomodoroState.mode = "focus";
        State.pomodoroState.secondsLeft = getPomodoroDurationSecondsForMode("focus");
        State.pomodoroState.isRunning = false;
        State.pomodoroState.startedAt = 0;
        State.pomodoroState.endsAt = 0;
        persistPomodoroLocalState();
        renderPomodoroHub();
        showNotification("Descanso omitido. Volvemos a enfoque.", "info");
    };
    const completePomodoroCycle = (completedAt = Date.now()) => {
        ensureStudySystemsState();
        stopPomodoroTicker();
        const completedMode = State.pomodoroState.mode;
        State.pomodoroState.isRunning = false;
        State.pomodoroState.secondsLeft = 0;
        State.pomodoroState.startedAt = 0;
        State.pomodoroState.endsAt = 0;
        State.pomodoroState.lastCompletedAt = completedAt;
        State.pomodoroLog.unshift(createPomodoroLogEntry(completedMode, completedAt));
        State.pomodoroLog = State.pomodoroLog.slice(0, POMODORO_MAX_LOG_ENTRIES);

        if (completedMode === "focus") {
            State.globalStats.pomodoros = (State.globalStats.pomodoros || 0) + 1;
            recordStudyCalendarActivity({ pomodoros: 1 });
            ensureDailyPlanFresh(true);
            notifyPomodoroCycle("Pomodoro completado", "¡Buen bloque! Toca un descanso breve.");
        } else if (completedMode === "longBreak") {
            notifyPomodoroCycle("Descanso largo terminado", "Listo para empezar un nuevo ciclo de enfoque.");
        } else {
            notifyPomodoroCycle("Descanso terminado", "Hora de volver a estudiar.");
        }

        transitionPomodoroState(completedMode);
        persistPomodoroLocalState();
        saveGlobalStats();
        updatePomodoroLinkedViews();

        if (State.pomodoroSettings.autoStartNext) {
            startPomodoroTimer(completedAt);
        } else {
            renderPomodoroHub();
        }
    };
    const syncPomodoroClock = (forceRender = false) => {
        ensureStudySystemsState();
        const pState = State.pomodoroState;
        if (!pState.isRunning || !pState.endsAt) {
            if (forceRender) renderPomodoroHub();
            return;
        }
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((pState.endsAt - now) / 1000));
        if (remaining <= 0) {
            completePomodoroCycle(now);
            return;
        }
        if (remaining !== pState.secondsLeft || forceRender) {
            pState.secondsLeft = remaining;
            if (forceRender) persistPomodoroLocalState();
            renderPomodoroHub();
        }
    };
    const reconcilePomodoroState = () => {
        ensureStudySystemsState();
        let safety = 0;
        while (State.pomodoroState.isRunning && State.pomodoroState.endsAt && Date.now() >= State.pomodoroState.endsAt && safety < 8) {
            completePomodoroCycle(State.pomodoroState.endsAt || Date.now());
            safety += 1;
            if (!State.pomodoroState.isRunning) break;
        }
        if (State.pomodoroState.isRunning) {
            stopPomodoroTicker();
            pomoTimer = setInterval(() => syncPomodoroClock(), 1000);
        }
        syncPomodoroClock(true);
    };
    const requestPomodoroNotificationPermission = async () => {
        if (!("Notification" in window)) {
            showNotification("Tu navegador no soporta notificaciones del sistema.", "warning");
            return false;
        }
        if (Notification.permission === "granted") return true;
        if (Notification.permission === "denied") {
            showNotification("Las notificaciones están bloqueadas en este navegador.", "warning");
            return false;
        }
        try {
            const result = await Notification.requestPermission();
            return result === "granted";
        } catch (err) {
            console.warn("[Pomodoro] No se pudo solicitar permiso de notificaciones:", err);
            return false;
        }
    };
    const getPomodoroSettingsControls = () => ([
        $("pomo-setting-focus"),
        $("pomo-setting-short"),
        $("pomo-setting-long"),
        $("pomo-setting-goal"),
        $("pomo-setting-autostart"),
        $("pomo-setting-notifs")
    ].filter(Boolean));
    const isPomodoroSettingsDirty = () => getPomodoroSettingsControls().some(control => control.dataset.dirty === "1");
    const markPomodoroSettingsDirty = () => {
        getPomodoroSettingsControls().forEach(control => {
            control.dataset.dirty = "1";
        });
    };
    const clearPomodoroSettingsDirty = () => {
        getPomodoroSettingsControls().forEach(control => {
            control.dataset.dirty = "0";
        });
    };
    const syncPomodoroPlacement = () => {
        const widgetShell = $("pomodoro-widget-shell");
        if (widgetShell) widgetShell.style.display = (!isPremiumActive() || State.view === "view-pomodoro") ? "none" : "";
    };
    const renderPomodoroHub = () => {
        ensureStudySystemsState();
        const widgetShell = $("pomodoro-widget-shell");
        const revealBtn = $("btn-pomo-reveal");
        const hideBtn = $("btn-pomo-hide");
        const timeEl = $("pomo-time");
        const toggleBtn = $("btn-pomo-toggle");
        const sessionEl = $("pomo-sessions");
        const iconEl = document.querySelector(".pomo-icon");
        const widget = $("pomodoro-widget");
        const pState = State.pomodoroState;
        const settings = State.pomodoroSettings;
        const meta = getPomodoroModeMeta(pState.mode);
        const timeLabel = formatPomodoroClockLabel(pState.secondsLeft);
        const todayPomodoros = getPomodoroTodayCount();
        const streak = getPomodoroCurrentStreak();
        const weeklySeries = getPomodoroLast7Days();
        const weeklyBest = Math.max(1, ...weeklySeries.map(item => item.count));
        const totalFocusSessions = (State.globalStats.pomodoros || 0);
        const selectedSpecialtyLabels = getPomodoroSelectedSpecialtyLabels();
        const recentLog = (State.pomodoroLog || []).slice(0, 6);

        if (widgetShell) widgetShell.style.setProperty("--pomodoro-accent", meta.accent);
        if (widget) widget.dataset.mode = pState.mode;
        if (timeEl) {
            timeEl.textContent = timeLabel;
            timeEl.style.color = meta.accent;
        }
        if (sessionEl) {
            sessionEl.textContent = `${meta.shortLabel} · Hoy ${todayPomodoros}/${settings.dailyGoal}`;
            sessionEl.title = "Abrir centro Pomodoro";
        }
        if (iconEl) {
            if (iconEl.getAttribute("src") !== POMQUEST_LOGO_SRC) iconEl.setAttribute("src", POMQUEST_LOGO_SRC);
            iconEl.setAttribute("alt", meta.label);
            iconEl.classList.toggle("running", !!pState.isRunning);
        }
        if (toggleBtn) {
            toggleBtn.textContent = pState.isRunning ? "PAUSAR" : "INICIAR";
            toggleBtn.classList.toggle("active", !!pState.isRunning);
        }
        if (revealBtn) revealBtn.style.borderColor = meta.accent;
        if (hideBtn) hideBtn.style.color = meta.accent;

        const hubTime = $("pomo-hub-time");
        const hubLabel = $("pomo-hub-label");
        const hubCycle = $("pomo-hub-cycle");
        const hubBadge = $("pomo-hub-mode-badge");
        const hubProgressLabel = $("pomo-hub-progress-label");
        const ring = $("pomo-hub-ring-progress");
        const ringCirc = 722.566;
        const progress = getPomodoroProgress();
        if (hubTime) hubTime.textContent = timeLabel;
        if (hubLabel) hubLabel.textContent = meta.label;
        if (hubCycle) {
            const cycleStep = Math.min(POMODORO_CYCLE_LENGTH, (pState.pomodorosInCycle || 0) + (pState.mode === "focus" ? 1 : 0));
            hubCycle.textContent = `Bloque ${Math.max(1, cycleStep)} de ${POMODORO_CYCLE_LENGTH}`;
        }
        if (hubBadge) {
            hubBadge.className = `pomodoro-mode-badge ${meta.badgeClass}`;
            hubBadge.innerHTML = `${getPomodoroLogoHtml("pomodoro-logo-badge", meta.label)}<strong>${meta.label}</strong>`;
        }
        if (hubProgressLabel) hubProgressLabel.textContent = `${Math.round(progress * 100)}% del bloque actual`;
        if (ring) {
            ring.style.stroke = meta.accent;
            ring.style.strokeDasharray = String(ringCirc);
            ring.style.strokeDashoffset = String(ringCirc * (1 - progress));
        }

        const hubToggleBtn = $("btn-pomo-hub-toggle");
        const hubSkipBtn = $("btn-pomo-hub-skip");
        if (hubToggleBtn) hubToggleBtn.textContent = pState.isRunning ? "Pausar" : "Iniciar";
        if (hubSkipBtn) hubSkipBtn.disabled = pState.mode === "focus";

        if ($("pomo-hub-today")) $("pomo-hub-today").textContent = String(todayPomodoros);
        if ($("pomo-hub-goal")) $("pomo-hub-goal").textContent = `${todayPomodoros}/${settings.dailyGoal}`;
        if ($("pomo-hub-streak")) $("pomo-hub-streak").textContent = `${streak} día${streak === 1 ? "" : "s"}`;
        if ($("pomo-hub-total")) $("pomo-hub-total").textContent = String(totalFocusSessions);
        const specialtiesContainer = $("pomo-specialties-grid");
        if (specialtiesContainer) {
            specialtiesContainer.innerHTML = TRONCAL_SPECIALTIES.map(spec => `
                <button
                    class="pomodoro-specialty-chip ${State.pomodoroSpecialties.includes(spec) ? "is-active" : ""}"
                    type="button"
                    data-spec="${escapeHtml(spec)}"
                    aria-pressed="${State.pomodoroSpecialties.includes(spec) ? "true" : "false"}"
                >
                    <span>${escapeHtml(TRONCAL_LABELS[spec] || spec)}</span>
                </button>
            `).join("");
        }
        if ($("pomo-specialties-summary")) {
            $("pomo-specialties-summary").textContent = selectedSpecialtyLabels.length
                ? `Hoy te vas a enfocar en ${selectedSpecialtyLabels.join(", ")}. Puedes combinar varias sin problema.`
                : "Elige una o varias especialidades para orientar tus bloques de hoy. Si no eliges ninguna, el Pomodoro queda libre.";
        }
        if ($("pomo-specialties-counter")) {
            $("pomo-specialties-counter").textContent = selectedSpecialtyLabels.length
                ? `${selectedSpecialtyLabels.length} seleccionada${selectedSpecialtyLabels.length === 1 ? "" : "s"}`
                : "Sin selección";
        }

        const weeklyBars = $("pomo-hub-week-bars");
        if (weeklyBars) {
            weeklyBars.innerHTML = weeklySeries.map(item => `
                <div class="pomodoro-week-bar">
                    <div class="pomodoro-week-bar-track">
                        <div class="pomodoro-week-bar-fill" style="height:${item.count > 0 ? Math.max(10, (item.count / weeklyBest) * 100) : 0}%"></div>
                    </div>
                    <strong>${item.count}</strong>
                    <span>${escapeHtml(item.label)}</span>
                </div>
            `).join("");
        }

        const recentEl = $("pomo-hub-recent-log");
        if (recentEl) {
            recentEl.innerHTML = recentLog.length
                ? recentLog.map(entry => {
                    const logMeta = getPomodoroModeMeta(entry.mode);
                    const dateLabel = new Date(entry.completedAt).toLocaleString("es-MX", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                    });
                    const specialtyDetail = getPomodoroSelectedSpecialtyLabels(entry.specialties);
                    const detail = specialtyDetail.length
                        ? `${logMeta.label} · ${specialtyDetail.join(", ")}`
                        : entry.focusLabel
                            ? `${logMeta.label} · ${entry.focusLabel}`
                            : logMeta.label;
                    return `
                        <article class="pomodoro-log-item">
                            <div>
                                <h4>${getPomodoroLogoHtml("pomodoro-logo-inline", logMeta.label)} ${escapeHtml(detail)}</h4>
                                <p>${escapeHtml(dateLabel)}</p>
                            </div>
                            <span>${Math.round((entry.durationSeconds || 0) / 60)} min</span>
                        </article>
                    `;
                }).join("")
                : `<div class="today-empty">Aún no hay ciclos recientes guardados. Tus pomodoros históricos siguen contando para la racha y el calendario.</div>`;
        }

        const focusMinutesInput = $("pomo-setting-focus");
        const shortBreakInput = $("pomo-setting-short");
        const longBreakInput = $("pomo-setting-long");
        const goalInput = $("pomo-setting-goal");
        const autostartInput = $("pomo-setting-autostart");
        const notifsInput = $("pomo-setting-notifs");
        if (!isPomodoroSettingsDirty()) {
            if (focusMinutesInput && document.activeElement !== focusMinutesInput) focusMinutesInput.value = String(settings.focusMinutes);
            if (shortBreakInput && document.activeElement !== shortBreakInput) shortBreakInput.value = String(settings.shortBreakMinutes);
            if (longBreakInput && document.activeElement !== longBreakInput) longBreakInput.value = String(settings.longBreakMinutes);
            if (goalInput && document.activeElement !== goalInput) goalInput.value = String(settings.dailyGoal);
            if (autostartInput) autostartInput.checked = !!settings.autoStartNext;
            if (notifsInput) notifsInput.checked = !!settings.systemNotifications;
        }
        if ($("pomo-notif-status")) {
            const permission = ("Notification" in window) ? Notification.permission : "unsupported";
            $("pomo-notif-status").textContent = permission === "granted"
                ? "Notificaciones listas"
                : permission === "denied"
                    ? "Notificaciones bloqueadas"
                    : permission === "unsupported"
                        ? "No compatibles en este navegador"
                        : "Pendientes de activar";
        }
    };

    const initPomodoro = () => {
        const widgetShell = $("pomodoro-widget-shell");
        const revealBtn = $("btn-pomo-reveal");
        const hideBtn = $("btn-pomo-hide");
        const toggleBtn = $("btn-pomo-toggle");
        const resetBtn = $("btn-pomo-reset");
        const widget = $("pomodoro-widget");
        const hubToggleBtn = $("btn-pomo-hub-toggle");
        const hubResetBtn = $("btn-pomo-hub-reset");
        const hubSkipBtn = $("btn-pomo-hub-skip");
        const saveSettingsBtn = $("btn-pomo-save-settings");
        const specialtiesContainer = $("pomo-specialties-grid");
        const openStudyPlusBtn = $("btn-pomo-open-study");
        const openTemarioBtn = $("btn-pomo-open-temario");
        const collapseStorageKey = "pomodoroCollapsed";

        const syncCollapseUI = () => {
            if (!widgetShell || !revealBtn || !hideBtn) return;
            widgetShell.classList.toggle("is-collapsed", isPomodoroCollapsed);
            revealBtn.setAttribute("aria-expanded", String(!isPomodoroCollapsed));
            hideBtn.setAttribute("aria-expanded", String(!isPomodoroCollapsed));
        };

        const setPomodoroCollapsed = (collapsed) => {
            isPomodoroCollapsed = collapsed;
            syncCollapseUI();
            localStorage.setItem(collapseStorageKey, collapsed ? "1" : "0");
        };

        if (localStorage.getItem(collapseStorageKey) === "1") {
            isPomodoroCollapsed = true;
        }
        const handleToggle = () => {
            if (State.pomodoroState.isRunning) {
                pausePomodoroTimer();
            } else {
                startPomodoroTimer();
            }
        };

        const handleSaveSettings = async () => {
            ensureStudySystemsState();
            const nextSettings = normalizePomodoroSettings({
                focusMinutes: $("pomo-setting-focus")?.value,
                shortBreakMinutes: $("pomo-setting-short")?.value,
                longBreakMinutes: $("pomo-setting-long")?.value,
                dailyGoal: $("pomo-setting-goal")?.value,
                autoStartNext: $("pomo-setting-autostart")?.checked,
                systemNotifications: $("pomo-setting-notifs")?.checked
            });

            if (nextSettings.systemNotifications) {
                const granted = await requestPomodoroNotificationPermission();
                nextSettings.systemNotifications = granted;
                if (!granted) showNotification("Activa manualmente las notificaciones del navegador para recibir alertas.", "warning");
            }

            const wasRunning = !!State.pomodoroState.isRunning;
            State.pomodoroSettings = nextSettings;
            if (!wasRunning) {
                State.pomodoroState.secondsLeft = getPomodoroDurationSecondsForMode(State.pomodoroState.mode, nextSettings);
            }
            State.pomodoroState = normalizePomodoroState(State.pomodoroState, nextSettings);
            persistPomodoroLocalState();
            saveGlobalStats();
            clearPomodoroSettingsDirty();
            renderPomodoroHub();
            showNotification(wasRunning ? "Ajustes guardados. Se aplicarán por completo en el siguiente ciclo." : "Ajustes Pomodoro guardados.", "success");
        };

        if (hideBtn) {
            hideBtn.addEventListener("click", () => setPomodoroCollapsed(true));
        }

        if (revealBtn) {
            revealBtn.addEventListener("click", () => setPomodoroCollapsed(false));
        }

        if (toggleBtn) toggleBtn.addEventListener("click", handleToggle);
        if (hubToggleBtn) hubToggleBtn.addEventListener("click", handleToggle);
        if (resetBtn) resetBtn.addEventListener("click", resetPomodoroTimer);
        if (hubResetBtn) hubResetBtn.addEventListener("click", resetPomodoroTimer);
        if (hubSkipBtn) hubSkipBtn.addEventListener("click", skipPomodoroBreak);
        if (saveSettingsBtn) saveSettingsBtn.addEventListener("click", () => { void handleSaveSettings(); });
        getPomodoroSettingsControls().forEach(control => {
            const eventName = control.type === "checkbox" ? "change" : "input";
            control.addEventListener(eventName, markPomodoroSettingsDirty);
        });
        if (specialtiesContainer) {
            specialtiesContainer.addEventListener("click", (event) => {
                const chip = event.target.closest("[data-spec]");
                if (!chip) return;
                const spec = String(chip.dataset.spec || "").trim();
                if (!TRONCAL_SPECIALTIES.includes(spec)) return;
                if (State.pomodoroSpecialties.includes(spec)) {
                    State.pomodoroSpecialties = State.pomodoroSpecialties.filter(item => item !== spec);
                } else {
                    State.pomodoroSpecialties = [...State.pomodoroSpecialties, spec];
                }
                persistPomodoroLocalState();
                saveGlobalStats();
                renderPomodoroHub();
            });
        }
        if (openStudyPlusBtn) openStudyPlusBtn.addEventListener("click", () => showView("view-estudio-plus"));
        if (openTemarioBtn) openTemarioBtn.addEventListener("click", () => showView("view-temario"));
        if (widget) {
            widget.addEventListener("click", (event) => {
                if (event.target.closest("button")) return;
                showView("view-pomodoro");
            });
        }

        document.addEventListener("visibilitychange", () => {
            if (!document.hidden) reconcilePomodoroState();
        });
        window.addEventListener("focus", reconcilePomodoroState);

        clearPomodoroSettingsDirty();
        syncCollapseUI();
        syncPomodoroPlacement();
        renderPomodoroHub();
        reconcilePomodoroState();
    };

    // ---------------------------------------------------------------------------
    // Calculator Logic
    // ---------------------------------------------------------------------------
    const specialtyData = [
        { name: "Anatomía Patológica", min: 57.67, max: 78.03 },
        { name: "Anestesiología", min: 58.39, max: 76.07 },
        { name: "Audiología, Otoneurología y Foniatría", min: 59.46, max: 68.57 },
        { name: "Calidad de la Atención Clínica", min: 51.07, max: 68.21 },
        { name: "Cirugía General", min: 63.21, max: 81.96 },
        { name: "Epidemiología", min: 46.25, max: 76.42 },
        { name: "Genética Médica", min: 61.60, max: 73.75 },
        { name: "Geriatría", min: 57.14, max: 78.21 },
        { name: "Ginecología y Obstetricia", min: 60.35, max: 77.85 },
        { name: "Imagenología Diagnóstica y Terapéutica", min: 58.03, max: 77.50 },
        { name: "Medicina de la Actividad Física y Deportiva", min: 68.21, max: 73.75 },
        { name: "Medicina de Rehabilitación", min: 58.75, max: 71.78 },
        { name: "Medicina de Urgencias", min: 47.67, max: 73.57 },
        { name: "Medicina del Trabajo y Ambiental", min: 55.71, max: 70.53 },
        { name: "Medicina Familiar", min: 45.17, max: 73.32 },
        { name: "Medicina Interna", min: 59.46, max: 82.50 },
        { name: "Medicina Nuclear e Imagenología Molecular", min: 59.64, max: 71.78 },
        { name: "Medicina Paliativa", min: 67.50, max: 68.75 },
        { name: "Medicina Preventiva", min: 58.21, max: 64.46 },
        { name: "Neumología", min: 60.17, max: 74.46 },
        { name: "Oftalmología", min: 68.92, max: 80.89 },
        { name: "Otorrinolaringología y Cirugía de Cabeza y Cuello", min: 70.00, max: 80.17 },
        { name: "Patología Clínica", min: 55.35, max: 70.00 },
        { name: "Pediatría", min: 58.57, max: 80.35 },
        { name: "Psiquiatría", min: 62.14, max: 80.89 },
        { name: "Radio Oncología", min: 57.85, max: 71.96 },
        { name: "Traumatalogoía y Ortopedia", min: 62.14, max: 79.28 },
    ];

    const initCalculator = () => {
        const select = $("calc-specialty");
        const inputScore = $("calc-user-score");
        const diffEl = $("calc-diff");
        const statusEl = $("calc-status");
        const msgEl = $("calc-msg");
        const cardEl = $("calc-card");
        const tableBody = $("calc-table-body");

        // Set default score to current global average
        const precision = (State.globalStats.respondidas > 0)
            ? ((State.globalStats.aciertos / State.globalStats.respondidas) * 100).toFixed(1)
            : 0;

        if (inputScore.value == "0.0") inputScore.value = precision;

        const updateCalc = () => {
            const target = parseFloat(select.value);
            const user = parseFloat(inputScore.value) || 0;
            const diff = (user - target).toFixed(1);

            diffEl.textContent = (diff >= 0 ? "+" : "") + diff;

            if (diff >= 2) {
                statusEl.textContent = "NIVEL SEGURO";
                statusEl.style.color = "var(--accent-green)";
                cardEl.style.borderColor = "var(--accent-green)";
                msgEl.textContent = "Estás por encima del promedio histórico. ¡Mantén el ritmo!";
            } else if (diff >= -2) {
                statusEl.textContent = "EN COMPETENCIA";
                statusEl.style.color = "var(--accent-orange)";
                cardEl.style.borderColor = "var(--accent-orange)";
                msgEl.textContent = "Estás en el margen. Un pequeño empujón extra asegurará tu lugar.";
            } else {
                statusEl.textContent = "NIVEL DE RIESGO";
                statusEl.style.color = "var(--accent-red)";
                cardEl.style.borderColor = "var(--accent-red)";
                msgEl.textContent = "Aumenta la intensidad en las áreas de mayor peso para subir tu promedio.";
            }

            // Render Table
            tableBody.innerHTML = "";
            specialtyData.forEach(s => {
                const tr = document.createElement("tr");
                let statusTag = "";
                const sDiff = user - s.min;
                if (sDiff >= 2) statusTag = '<span class="tag-safe">SEGURO</span>';
                else if (sDiff >= -2) statusTag = '<span class="tag-risk">COMPETENCIA</span>';
                else statusTag = '<span class="tag-danger">RIESGO</span>';

                tr.innerHTML = `
                    <td>${s.name}</td>
                    <td>${s.min}</td>
                    <td>${s.max}</td>
                    <td>${statusTag}</td>
                `;
                tableBody.appendChild(tr);
            });
        };

        select.addEventListener("change", updateCalc);
        inputScore.addEventListener("input", updateCalc);
        updateCalc();
    };

    // ---------------------------------------------------------------------------
    // Init listeners
    // ---------------------------------------------------------------------------
    document.addEventListener("DOMContentLoaded", () => {
        loadGlobalStats();
        loadDeletedCases();
        initReclassifyLogic();
        syncReclassAccessUI();
        bindSidebar();
        initSetupLogic();
        initDashboardShortcuts();
        startExamCountdown();
        initReportLogic();
        initCommunityBroadcastLogic();
        initPomodoro();
        setTimeout(() => {
            requestNotificationPermissionOnOpen();
        }, 900);

        // ── PWA Install Logic ──
        const pwaBanner = $("mobile-pwa-banner");
        const pwaModal = $("pwa-modal");
        if (pwaBanner && pwaModal) {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
            if (!isStandalone) {
                pwaBanner.style.display = "flex";
            }
            pwaBanner.addEventListener("click", () => {
                pwaModal.style.display = "flex";
                $("pwa-step-1").style.display = "block";
                $("pwa-step-android").style.display = "none";
                $("pwa-step-ios").style.display = "none";
            });
            const btnClosePwa = $("btn-close-pwa");
            if (btnClosePwa) btnClosePwa.addEventListener("click", () => pwaModal.style.display = "none");
            const btnPwaAndroid = $("btn-pwa-android");
            if (btnPwaAndroid) btnPwaAndroid.addEventListener("click", () => {
                $("pwa-step-1").style.display = "none";
                $("pwa-step-android").style.display = "block";
            });
            const btnPwaIos = $("btn-pwa-ios");
            if (btnPwaIos) btnPwaIos.addEventListener("click", () => {
                $("pwa-step-1").style.display = "none";
                $("pwa-step-ios").style.display = "block";
            });
        }

        const btnSaveProfile = $("btn-save-profile");
        if (btnSaveProfile) {
            btnSaveProfile.addEventListener("click", () => {
                const nameInput = $("profile-name").value.trim().substring(0, 20);
                if (!nameInput) {
                    showNotification("El nombre no puede estar vacío.", "error");
                    return;
                }
                State.userName = nameInput;
                State.userSpecialty = $("profile-specialty").value;
                State.userUniversity = $("profile-university").value.trim().substring(0, 50);
                State.isScorePublic = !$("profile-score-public-toggle")?.checked;

                // Update visuals locally
                const nameParts = State.userName.trim().split(/\s+/);
                const initials = nameParts.length > 1
                    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
                    : nameParts[0].substring(0, 2).toUpperCase();

                $$(".user-name").forEach(el => el.textContent = State.userName);
                $$(".header-title").forEach(el => {
                    if (el.textContent.includes("Hola,")) {
                        el.innerHTML = `Hola, <span class="user-name" style="color:var(--accent-green);">${State.userName}</span>`;
                    }
                });
                $$(".user-avatar").forEach(el => renderAvatarInitials(el, initials));
                syncReclassAccessUI();

                saveGlobalStats();
                renderProfileView();
                showNotification("Perfil actualizado y sincronizado.", "success");
            });
        }

        // Lógica de acceso al perfil (funciona sin conexión)
        const btnOpenProfile = $("btn-user-profile");
        const btnOpenProfileMobile = $("btn-user-profile-mobile");
        const btnOpenProfileDashboardHero = $("btn-dashboard-hero-profile");
        const btnOpenFriendsModal = $("btn-open-friends-modal");
        const btnProfileBack = $("btn-profile-back");
        const btnProfileGoHistory = $("btn-profile-go-history");
        const btnProfileGoCommunity = $("btn-profile-go-community");
        const btnProfileGoSettings = $("btn-profile-go-settings");

        const btnOpenNotif = $("btn-open-notif");
        const btnCloseNotif = $("btn-close-notif");
        const notifModal = $("notif-modal");

        const openProfileView = () => {
            $$(".nav-item").forEach(n => n.classList.remove("active"));
            $$(".mobile-nav-item").forEach(n => n.classList.remove("active"));
            const mobileProfile = document.querySelector(".mobile-nav-item[data-view='view-profile']");
            if (mobileProfile) mobileProfile.classList.add("active");
            renderProfileView();
            showView("view-profile");
        };

        const openNotifModal = () => {
            if (notifModal) {
                notifModal.style.display = "flex";
                if (typeof window.markCommunityAnnouncementsSeen === 'function') {
                    try { window.markCommunityAnnouncementsSeen(); } catch (e) { console.error(e); }
                }
                if (typeof window.loadPendingRequests === 'function') {
                    try { window.loadPendingRequests(); } catch (e) { console.error(e); }
                }
            }
        };
        window.openNotificationsModal = openNotifModal;

        if (btnOpenProfile) btnOpenProfile.addEventListener("click", openProfileView);
        if (btnOpenProfileMobile) btnOpenProfileMobile.addEventListener("click", openProfileView);
        if (btnOpenProfileDashboardHero) btnOpenProfileDashboardHero.addEventListener("click", openProfileView);
        if (btnOpenFriendsModal) btnOpenFriendsModal.addEventListener("click", openProfileView);
        if (btnProfileBack) btnProfileBack.addEventListener("click", () => $("nav-dashboard").click());
        if (btnProfileGoHistory) btnProfileGoHistory.addEventListener("click", () => $("nav-historial").click());
        if (btnProfileGoCommunity) {
            btnProfileGoCommunity.addEventListener("click", () => {
                if (!ensurePremiumAccess("La comunidad forma parte del acceso premium.")) return;
                $("nav-comunidad").click();
            });
        }
        if (btnProfileGoSettings) btnProfileGoSettings.addEventListener("click", () => $("nav-ajustes").click());

        const btnRunNextAction = $("btn-run-next-action");
        if (btnRunNextAction) {
            btnRunNextAction.addEventListener("click", () => {
                const nextAction = getNextRecommendedAction();
                if (!nextAction) {
                    showNotification("Tu plan de hoy ya quedó cubierto. Puedes abrir el temario o hacer un mini simulacro.", "info");
                    return;
                }
                window.runDailyPlanTask(nextAction.id);
            });
        }
        const btnOpenTemarioFocus = $("btn-open-temario-focus");
        if (btnOpenTemarioFocus) btnOpenTemarioFocus.addEventListener("click", () => showView("view-temario"));
        const btnOpenTemarioMap = $("btn-open-temario-map");
        if (btnOpenTemarioMap) btnOpenTemarioMap.addEventListener("click", () => showView("view-temario"));
        const btnOpenNotebookDashboard = $("btn-open-notebook-dashboard");
        if (btnOpenNotebookDashboard) btnOpenNotebookDashboard.addEventListener("click", () => {
            showView("view-estudio-plus");
            setTimeout(() => $("study-plus-notebook")?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
        });
        const btnOpenNotebookSecondary = $("btn-open-notebook-secondary");
        if (btnOpenNotebookSecondary) btnOpenNotebookSecondary.addEventListener("click", () => {
            showView("view-estudio-plus");
            setTimeout(() => $("study-plus-notebook")?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
        });

        if (btnOpenNotif) {
            btnOpenNotif.addEventListener("click", openNotifModal);
        }
        if (btnCloseNotif && notifModal) {
            btnCloseNotif.addEventListener("click", () => {
                notifModal.style.display = "none";
            });
        }
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.addEventListener("message", (event) => {
                if (!event || !event.data) return;
                if (event.data.type === "OPEN_NOTIFICATIONS_MODAL") {
                    openNotifModal();
                }
            });
        }

        const btnCopyUsername = $("btn-copy-username");
        if (btnCopyUsername) {
            btnCopyUsername.addEventListener("click", () => {
                const nameInput = $("profile-name");
                if (nameInput && nameInput.value) {
                    navigator.clipboard.writeText(nameInput.value).then(() => {
                        showNotification("¡Usuario copiado al portapapeles!", "success");
                    }).catch(err => {
                        showNotification("No se pudo copiar el usuario", "error");
                    });
                }
            });
        }

        const btnCopyUid = $("btn-copy-uid");
        if (btnCopyUid) {
            btnCopyUid.addEventListener("click", () => {
                const uidInput = $("profile-uid");
                const uidVal = uidInput ? uidInput.value : State.currentUid;
                if (uidVal) {
                    navigator.clipboard.writeText(uidVal).then(() => {
                        showNotification("¡UID copiado al portapapeles!", "success");
                    }).catch(err => {
                        showNotification("No se pudo copiar el UID", "error");
                    });
                }
            });
        }

        const btnOpenRedeem = $("btn-open-redeem");
        if (btnOpenRedeem) {
            btnOpenRedeem.addEventListener("click", () => openRedeemModal("Ingresa tu c\u00f3digo para desbloquear premium."));
        }
        $$("[data-open-redeem]").forEach(btn => {
            btn.addEventListener("click", () => openRedeemModal("Desbloquea premium para ver todas las estadísticas y herramientas avanzadas."));
        });
        $$("[data-pricing-toggle]").forEach(btn => {
            btn.addEventListener("click", () => {
                const panelId = btn.dataset.pricingToggle;
                const panel = panelId ? $(panelId) : null;
                if (!panel) return;
                setPricingPanelState(panelId, panel.hidden);
            });
        });
        const btnSettingsRedeem = $("btn-settings-redeem");
        if (btnSettingsRedeem) {
            btnSettingsRedeem.addEventListener("click", () => redeemCode({
                inputId: "settings-redeem-code-input",
                closeModalOnSuccess: false
            }));
        }
        const settingsRedeemInput = $("settings-redeem-code-input");
        if (settingsRedeemInput) {
            settingsRedeemInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    redeemCode({
                        inputId: "settings-redeem-code-input",
                        closeModalOnSuccess: false
                    });
                }
            });
        }

        const btnRedeem = $("btn-redeem-submit");
        if (btnRedeem) {
            btnRedeem.addEventListener("click", () => redeemCode());
        }
        const notebookSearch = $("notebook-search");
        if (notebookSearch) notebookSearch.addEventListener("input", () => renderNotebookView());
        const notebookTagsFilter = $("notebook-tags-filter");
        if (notebookTagsFilter) notebookTagsFilter.addEventListener("input", () => renderNotebookView());
        const btnNotebookSave = $("btn-notebook-save");
        if (btnNotebookSave) {
            btnNotebookSave.addEventListener("click", () => {
                const selected = (State.caseNotebook || []).find(entry => entry.id === State.notebookSelectedId);
                if (!selected) return;
                selected.note = $("notebook-note-input")?.value?.trim() || "";
                selected.tags = formatNotebookTags($("notebook-tags-input")?.value || "");
                saveGlobalStats();
                renderNotebookView();
                renderStudyDashboard();
                showNotification("Cuaderno actualizado.", "success");
            });
        }
        const btnNotebookRemove = $("btn-notebook-remove");
        if (btnNotebookRemove) {
            btnNotebookRemove.addEventListener("click", () => {
                if (!State.notebookSelectedId) return;
                State.caseNotebook = (State.caseNotebook || []).filter(entry => entry.id !== State.notebookSelectedId);
                State.notebookSelectedId = State.caseNotebook[0]?.id || null;
                saveGlobalStats();
                renderNotebookView();
                renderStudyDashboard();
                showNotification("Caso retirado del cuaderno.", "success");
            });
        }
        const redeemLegalCheck = $("redeem-legal-check");
        if (redeemLegalCheck) {
            redeemLegalCheck.addEventListener("change", () => {
                const modalRedeemBtn = $("btn-redeem-submit");
                if (modalRedeemBtn) modalRedeemBtn.disabled = !redeemLegalCheck.checked;
            });
        }
        const btnCloseRedeem = $("btn-close-redeem");
        if (btnCloseRedeem) {
            btnCloseRedeem.addEventListener("click", closeRedeemModal);
        }
        const btnClosePremiumWelcome = $("btn-close-premium-welcome");
        if (btnClosePremiumWelcome) {
            btnClosePremiumWelcome.addEventListener("click", closePremiumWelcomeModal);
        }
        const redeemInput = $("redeem-code-input");
        if (redeemInput) {
            redeemInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") redeemCode();
            });
        }

        const btnAdminUpload = $("btn-admin-upload-codes");
        if (btnAdminUpload) {
            btnAdminUpload.addEventListener("click", () => uploadAdminCodes());
        }

        $$(".admin-preview-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                if (!isAdminUser()) return;
                setAdminPreviewMode(btn.dataset.adminPreview, { notify: true });
            });
        });

        const bd = $("btn-back-dash"); if (bd) bd.addEventListener("click", () => $("nav-dashboard").click());
        const rv = $("btn-review"); if (rv) rv.addEventListener("click", startReview);
        const exr = $("btn-exit-review"); if (exr) exr.addEventListener("click", () => showView("view-results"));

        const bp = $("btn-prev");
        if (bp) bp.addEventListener("click", () => {
            if (State.currentIndex > 0) {
                const currentGroupId = State.questionSet[State.currentIndex].caseGroupId;
                let prevIdx = State.currentIndex;
                while (prevIdx >= 0 && State.questionSet[prevIdx].caseGroupId === currentGroupId) {
                    prevIdx--;
                }
                if (prevIdx >= 0) {
                    State.currentIndex = prevIdx;
                    renderExamQuestion();
                }
            }
        });
        const bn = $("btn-next");
        if (bn) {
            bn.addEventListener("click", () => {
                const currentGroupId = State.questionSet[State.currentIndex].caseGroupId;
                let nextIdx = State.currentIndex;
                while (nextIdx < State.questionSet.length && State.questionSet[nextIdx].caseGroupId === currentGroupId) {
                    nextIdx++;
                }
                if (nextIdx < State.questionSet.length) {
                    State.currentIndex = nextIdx;
                    renderExamQuestion();
                } else {
                    const modal = $("finish-modal");
                    if (modal) modal.style.display = "flex";
                }
            });
        }

        const rbp = $("btn-rev-prev");
        if (rbp) rbp.addEventListener("click", () => {
            if (reviewIndex > 0) {
                const currentGroupId = State.questionSet[reviewIndex].caseGroupId;
                let prevIdx = reviewIndex;
                while (prevIdx >= 0 && State.questionSet[prevIdx].caseGroupId === currentGroupId) {
                    prevIdx--;
                }
                if (prevIdx >= 0) {
                    reviewIndex = prevIdx;
                    renderReviewQuestion();
                }
            }
        });
        const rbn = $("btn-rev-next");
        if (rbn) rbn.addEventListener("click", () => {
            if (!State.questionSet || State.questionSet.length === 0) return;
            const currentGroupId = State.questionSet[reviewIndex]?.caseGroupId;
            let nextIdx = reviewIndex;
            while (nextIdx < State.questionSet.length && State.questionSet[nextIdx].caseGroupId === currentGroupId) {
                nextIdx++;
            }
            if (nextIdx < State.questionSet.length) {
                reviewIndex = nextIdx;
                renderReviewQuestion();
            }
        });

        const fe = $("btn-finish-early");

        const showFinishModal = () => {
            const modal = $("finish-modal");
            if (modal) modal.style.display = "flex";
        };

        const hideFinishModal = () => {
            const modal = $("finish-modal");
            if (modal) modal.style.display = "none";
        };

        const showRangeModal = () => {
            const modal = $("range-modal");
            if (modal) modal.style.display = "flex";
        };

        const hideRangeModal = () => {
            const modal = $("range-modal");
            if (modal) modal.style.display = "none";
        };

        const updateAndShowStreakModal = () => {
            const modal = $("streak-modal");
            if (modal) {
                const streak = getEffectiveStreak();
                const prob = getProbability(streak);

                if ($("modal-streak-days")) $("modal-streak-days").textContent = streak;
                if ($("modal-streak-prob")) $("modal-streak-prob").textContent = `${prob}%`;
                if ($("modal-streak-prob-bar")) $("modal-streak-prob-bar").style.width = `${prob}%`;

                modal.style.display = "flex";
            }
        };

        const btnStreak = $("streak-btn");
        if (btnStreak) btnStreak.addEventListener("click", updateAndShowStreakModal);

        const btnCloseStreak = $("btn-close-streak");
        if (btnCloseStreak) btnCloseStreak.addEventListener("click", () => {
            if ($("streak-modal")) $("streak-modal").style.display = "none";
        });

        if (fe) {
            fe.addEventListener("click", () => {
                showFinishModal();
            });
        }

        const bnc = $("btn-cancel-finish");
        if (bnc) {
            bnc.addEventListener("click", hideFinishModal);
        }

        const bnf = $("btn-confirm-finish");
        if (bnf) {
            bnf.addEventListener("click", () => {
                hideFinishModal();
                finishExam();
            });
        }

        // Logic for pausing / resuming
        const btnPause = $("btn-pause-exam");
        if (btnPause) {
            btnPause.addEventListener("click", () => {
                pauseTimer();
                $("nav-dashboard").click();
                showNotification("Examen pausado. Puedes retomarlo desde el Dashboard.", "info");
            });
        }

        const btnResume = $("btn-resume-exam");
        if (btnResume) {
            btnResume.addEventListener("click", () => {
                if (State.durationSec > 0) {
                    startTimer(true);
                } else {
                    State.startTime = Date.now() - (State.pausedElapsedTime * 1000);
                }
                $$(".nav-item").forEach(b => b.classList.remove("active"));
                showView("view-exam");
                showNotification("Examen reanudado. ¡Éxito!", "success");
            });
        }

        const btnFinishBanner = $("btn-finish-exam-banner");
        if (btnFinishBanner) {
            btnFinishBanner.addEventListener("click", () => {
                showFinishModal();
            });
        }


        // Theme Circle Click Event for Instant Apply
        $$(".theme-circle").forEach(circle => {
            circle.addEventListener("click", () => {
                const selectedTheme = normalizeThemeSelection(circle.dataset.theme);
                if (!isPremiumActive() && !DEMO_ALLOWED_THEMES.has(selectedTheme)) {
                    showNotification("Este tema est\u00e1 bloqueado en demo.", "warning");
                    openRedeemModal("Desbloquea premium para usar todos los temas visuales.");
                    return;
                }
                State.theme = selectedTheme;
                localStorage.setItem("enarm_theme", selectedTheme);
                applyTheme(selectedTheme);
                saveGlobalStats();
                if (typeof updateCharts === 'function' && State.view === 'view-estadisticas') updateCharts();
            });
        });
        const fontPresetSelector = $("font-preset-selector");
        if (fontPresetSelector) {
            fontPresetSelector.value = normalizeFontPreset(State.fontPreset || "clinical");
            fontPresetSelector.addEventListener("change", () => {
                const selectedPreset = normalizeFontPreset(fontPresetSelector.value);
                localStorage.setItem(FONT_PRESET_STORAGE_KEY, selectedPreset);
                applyFontPreset(selectedPreset, { refreshCharts: true });
                saveGlobalStats();
            });
        }

        // Click en Tarjeta Sesiones -> Historial
        const cardSes = $("card-sesiones");
        if (cardSes) cardSes.addEventListener("click", () => $("nav-historial").click());

        // Click en Tarjeta Rango -> Mostrar Explicación
        const cardRan = $("card-rango");
        if (cardRan) cardRan.addEventListener("click", showRangeModal);

        const brc = $("btn-close-range"); if (brc) brc.addEventListener("click", hideRangeModal);
        const bro = $("btn-ok-range"); if (bro) bro.addEventListener("click", hideRangeModal);

        // Reiniciar Estadísticas
        const btnReset = $("btn-reset-stats");
        if (btnReset) btnReset.addEventListener("click", () => {
            if (confirm("¿Estás 100% seguro? Esta acción borrará TODO tu progreso y no se puede deshacer.")) {
                localStorage.removeItem("enarm_stats");
                localStorage.removeItem("enarm_history");
                localStorage.removeItem("enarm_daily_plan");
                localStorage.removeItem("enarm_review_queue");
                localStorage.removeItem("enarm_topic_mastery");
                localStorage.removeItem("enarm_case_notebook");
                localStorage.removeItem("enarm_study_calendar");
                localStorage.removeItem("enarm_last_postmortem");
                localStorage.removeItem(POMODORO_STORAGE_KEYS.settings);
                localStorage.removeItem(POMODORO_STORAGE_KEYS.state);
                localStorage.removeItem(POMODORO_STORAGE_KEYS.log);
                localStorage.removeItem(POMODORO_STORAGE_KEYS.specialties);
                localStorage.removeItem(POMODORO_STORAGE_KEYS.focus);

                State.globalStats = {
                    respondidas: 0,
                    aciertos: 0,
                    sesiones: 0,
                    pomodoros: 0,
                    bySpecialty: {
                        mi: { total: 0, correct: 0, name: "Medicina Interna" },
                        ped: { total: 0, correct: 0, name: "Pediatría" },
                        gyo: { total: 0, correct: 0, name: "Ginecología y Obstetricia" },
                        cir: { total: 0, correct: 0, name: "Cirugía General" }
                    }
                };
                State.history = [];
                State.dailyPlan = null;
                State.reviewQueue = [];
                State.topicMastery = {};
                State.caseNotebook = [];
                State.studyCalendar = {};
                State.lastPostmortem = null;
                State.notebookSelectedId = null;
                State.pomodoroSettings = createDefaultPomodoroSettings();
                State.pomodoroState = createDefaultPomodoroState(State.pomodoroSettings);
                State.pomodoroLog = [];
                State.pomodoroSpecialties = [];
                State.pomodoroFocusLabel = "";
                stopPomodoroTicker();

                saveGlobalStats();
                updateDashboardStats();
                if (typeof updateCharts === 'function') updateCharts();
                showNotification("Estadísticas eliminadas correctamente.");
                $("nav-dashboard").click();
            }
        });

        const btnLogout = $("btn-logout");
        if (btnLogout) {
            btnLogout.addEventListener("click", () => {
                const proceed = confirm("¿Estás seguro que deseas cerrar sesión en este dispositivo?");
                if (proceed) {
                    if (window.FB) {
                        window.FB.signOut(window.FB.auth).then(() => {
                            clearAccountLocalData();
                        }).catch(err => {
                            showNotification("Error: " + err.message, "error");
                        });
                    } else {
                        clearAccountLocalData();
                    }
                }
            });
        }

        function clearAccountLocalData() {
            stopPomodoroTicker();
            localStorage.removeItem("enarm_user");
            localStorage.removeItem("enarm_specialty");
            localStorage.removeItem("enarm_university");
            localStorage.removeItem("enarm_score_public");
            localStorage.removeItem("enarm_stats");
            localStorage.removeItem("enarm_history");
            localStorage.removeItem("enarm_reports");
            localStorage.removeItem("enarm_daily_plan");
            localStorage.removeItem("enarm_review_queue");
            localStorage.removeItem("enarm_topic_mastery");
            localStorage.removeItem("enarm_case_notebook");
            localStorage.removeItem("enarm_study_calendar");
            localStorage.removeItem("enarm_last_postmortem");
            localStorage.removeItem(POMODORO_STORAGE_KEYS.settings);
            localStorage.removeItem(POMODORO_STORAGE_KEYS.state);
            localStorage.removeItem(POMODORO_STORAGE_KEYS.log);
            localStorage.removeItem(POMODORO_STORAGE_KEYS.specialties);
            localStorage.removeItem(POMODORO_STORAGE_KEYS.focus);
            // No removemos enarm_theme para que se guarde la personalización
            window.location.reload();
        }

        // --- LOGIC AUTH & FIREBASE INTEGRATION ---
        const authOverlay = $("auth-overlay");
        const loginForm = $("login-form");
        const authUsername = $("auth-username");

        const initCloudFeatures = () => {
            if (window.isCloudInit) return;
            window.isCloudInit = true;
            initReportsCloud();
            let communityLeaderboardEntries = [];
            let communityFriendIds = new Set([window.FB.auth.currentUser.uid]);
            let leaderboardUnsub = null;

            const formatLeaderboardScore = (value) => {
                const num = Number(value);
                if (!Number.isFinite(num)) return "0";
                return Number.isInteger(num) ? String(num) : num.toFixed(1);
            };

            const getPublicScoreLabel = (entry, isOwner = false) => {
                const scoreVisible = isOwner || entry?.isScorePublic !== false;
                return scoreVisible
                    ? `Promedio general: ${formatLeaderboardScore(entry?.score)}%`
                    : "Promedio general oculto";
            };

            const getLeaderboardInitials = (username) => {
                const safeName = String(username || "Aspirante").trim();
                if (!safeName) return "AS";
                const nameParts = safeName.split(/\s+/).filter(Boolean);
                if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
                return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
            };

            const getLeaderboardRankMarkup = (rank) => {
                if (rank === 1) return '<span style="color: gold; text-shadow: 0 0 10px rgba(255,215,0,0.5);">#1</span>';
                if (rank === 2) return '<span style="color: silver; text-shadow: 0 0 10px rgba(192,192,192,0.5);">#2</span>';
                if (rank === 3) return '<span style="color: #cd7f32; text-shadow: 0 0 10px rgba(205,127,50,0.5);">#3</span>';
                return `#${rank}`;
            };

            const syncRankingFilterButtons = () => {
                const activeScope = State.communityRankingMode === "friends" ? "friends" : "general";
                $$(".ranking-filter-btn").forEach(btn => {
                    btn.classList.toggle("active", btn.getAttribute("data-ranking-scope") === activeScope);
                });
            };

            const renderCommunityPanels = () => {
                const currentUid = window.FB.auth.currentUser?.uid;
                const showFriendsOnly = State.communityRankingMode === "friends";
                const visibleEntries = showFriendsOnly
                    ? communityLeaderboardEntries.filter(entry => communityFriendIds.has(entry.id))
                    : communityLeaderboardEntries;

                const lbList = document.querySelector(".leaderboard-list");
                if (lbList) {
                    if (!visibleEntries.length) {
                        lbList.innerHTML = `<div style="padding: 20px; color: var(--text-muted); font-size: 13px;">${showFriendsOnly ? "Agrega amigos para ver el ranking de amigos." : "Aún no hay usuarios en el ranking general."}</div>`;
                    } else {
                        lbList.innerHTML = visibleEntries.map((entry, index) => {
                            const rank = index + 1;
                            const isMe = entry.id === currentUid;
                            const isFriend = communityFriendIds.has(entry.id);
                            const bgStyle = isMe ? 'background: rgba(5, 192, 127, 0.1); border-bottom: 1px solid rgba(5, 192, 127, 0.2);' : '';

                            let badgeSpec = "";
                            if (entry.specialty) badgeSpec += `<span style="font-size: 10px; opacity: 0.9; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 1px 5px; background: rgba(255,255,255,0.05); margin-right: 5px;">${escapeHtml(entry.specialty.substring(0, 20))}</span>`;
                            if (entry.university) badgeSpec += `<span style="font-size: 10px; opacity: 0.6;">${escapeHtml(entry.university.substring(0, 20))}</span>`;

                            return `
                            <div class="lb-item" style="${bgStyle}">
                                <div class="lb-rank" style="min-width:30px; font-size:16px;">${getLeaderboardRankMarkup(rank)}</div>
                                <div class="lb-avatar" style="width:36px; height:36px; min-width:36px; flex-shrink:0; font-size:12px;">${getLeaderboardInitials(entry.username)}</div>
                                <div class="lb-info" style="flex:1; min-width:0; padding: 0 8px;">
                                    <div class="lb-name" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-size:13px; font-weight:700;">${escapeHtml(entry.username)} ${isMe ? '<span class="lb-badge" style="font-size:9px; vertical-align:middle;">Tú</span>' : ''}</div>
                                    <div class="lb-score">${getPublicScoreLabel(entry, isMe)}</div>
                                    ${badgeSpec ? `<div style="margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:flex;">${badgeSpec}</div>` : ''}
                                </div>
                                <div class="lb-actions" style="display:flex; align-items:center; gap:6px;">
                                    <div class="lb-flame" style="font-size:10px;">&#x1F525; ${entry.flame || 0}</div>
                                    ${!isMe && isFriend ? `<button class="btn-primary" onclick="window.quickChallenge('${entry.id}')" style="padding: 4px 8px; font-size: 10px; border-radius: 6px; background: var(--accent-orange); border:none; white-space:nowrap;">&#x2694;&#xFE0F; Retar</button>` : ''}
                                </div>
                            </div>`;
                        }).join("");
                    }
                }

                const friendsEntries = communityLeaderboardEntries.filter(entry => communityFriendIds.has(entry.id) && entry.id !== currentUid);
                State.myFriends = friendsEntries.map(entry => ({
                    uid: entry.id,
                    username: entry.username,
                    score: entry.score
                }));

                const flList = $("friends-list");
                if (flList) {
                    if (!friendsEntries.length) {
                        flList.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 13px; margin-top: 15px;">Aún no tienes amigos añadidos.</div>';
                    } else {
                        flList.innerHTML = friendsEntries.map(entry => `
                        <div style="background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border: 1px solid var(--border); padding: 10px 12px;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                <div style="width: 32px; height: 32px; min-width:32px; border-radius: 50%; background: var(--accent-blue); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; flex-shrink:0;">
                                    ${getLeaderboardInitials(entry.username)}</div>
                                <div style="min-width:0; flex:1;">
                                    <div style="font-size: 13px; font-weight: 600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(entry.username)}</div>
                                    <div style="font-size: 11px; color: var(--text-muted);">${getPublicScoreLabel(entry, false)}</div>
                                </div>
                            </div>
                            <button class="btn-primary" onclick="window.quickChallenge('${entry.id}')" style="width:100%; padding: 7px; font-size: 12px; border-radius: 8px; background: var(--accent-orange); text-align:center;">&#x2694;&#xFE0F; Retar</button>
                        </div>`).join("");
                    }
                }
            };

            const bindRankingFilterButtons = () => {
                $$(".ranking-filter-btn").forEach(btn => {
                    if (btn.dataset.bound === "1") return;
                    btn.dataset.bound = "1";
                    btn.addEventListener("click", () => {
                        const nextScope = btn.getAttribute("data-ranking-scope") === "friends" ? "friends" : "general";
                        if (State.communityRankingMode === nextScope) return;
                        State.communityRankingMode = nextScope;
                        syncRankingFilterButtons();
                        renderCommunityPanels();
                    });
                });
                syncRankingFilterButtons();
            };

            const subscribeLeaderboard = () => {
                const lbRef = window.FB.collection(window.FB.db, "leaderboard");
                const fullQ = window.FB.query(lbRef, window.FB.orderBy("score", "desc"));
                if (leaderboardUnsub) leaderboardUnsub();
                leaderboardUnsub = window.FB.onSnapshot(fullQ, (snapshot) => {
                    communityLeaderboardEntries = [];
                    snapshot.forEach(docSnap => {
                        const data = docSnap.data() || {};
                        communityLeaderboardEntries.push({
                            id: docSnap.id,
                            username: String(data.username || "Aspirante"),
                            specialty: String(data.specialty || ""),
                            university: String(data.university || ""),
                            isScorePublic: data.isScorePublic !== false,
                            score: Number(data.score) || 0,
                            flame: Number(data.flame) || 0
                        });
                    });
                    renderCommunityPanels();
                }, err => console.error("Error cargando leaderboard: ", err));
            };

            const fetchFriendsAndLeaderboard = async () => {
                const currentUid = window.FB.auth.currentUser?.uid;
                if (!currentUid) return;

                const reqsRef1 = window.FB.query(
                    window.FB.collection(window.FB.db, "friendRequests"),
                    window.FB.where("toId", "==", currentUid),
                    window.FB.where("status", "==", "accepted")
                );

                const reqsRef2 = window.FB.query(
                    window.FB.collection(window.FB.db, "friendRequests"),
                    window.FB.where("fromId", "==", currentUid),
                    window.FB.where("status", "==", "accepted")
                );

                try {
                    const getSnap = (q) => new Promise((resolve) => {
                        const un = window.FB.onSnapshot(q, snap => { un(); resolve(snap); }, () => { un(); resolve({ forEach: () => { } }); });
                    });

                    const friendIds = new Set([currentUid]);
                    const snap1 = await getSnap(reqsRef1);
                    const snap2 = await getSnap(reqsRef2);

                    snap1.forEach(doc => { if (doc.data()) friendIds.add(doc.data().fromId); });
                    snap2.forEach(doc => { if (doc.data()) friendIds.add(doc.data().toId); });

                    communityFriendIds = friendIds;
                    renderCommunityPanels();
                } catch (err) {
                    console.error("Error cargando amigos: ", err);
                }
            };

            window.quickChallenge = (uid) => {
                window._pendingChallengeUid = uid;
                if (typeof showView === "function") showView("view-setup");
                showNotification("&#x1F3AF; ¡Amigo pre-seleccionado! Configura tu examen y luego pulsa 'Retar a un Amigo &#x2694;&#xFE0F;'.", "info");
            };

            bindRankingFilterButtons();
            subscribeLeaderboard();
            fetchFriendsAndLeaderboard();

            // Buscar Amigo
            const btnSearchFriend = $("btn-search-friend");
            const searchInput = $("friend-search-input");
            const searchResults = $("friend-search-results");

            if (btnSearchFriend) {
                btnSearchFriend.addEventListener("click", async () => {
                    const term = searchInput.value.trim();
                    if (!term) return;

                    btnSearchFriend.textContent = "...";
                    searchResults.style.display = "block";
                    searchResults.innerHTML = '<span style="color:var(--text-muted)">Buscando...</span>';

                    try {
                        // Buscamos al usuario por su "username" exacto en la leaderboard
                        const usersRef = window.FB.collection(window.FB.db, "leaderboard");
                        const qSearch = window.FB.query(usersRef, window.FB.where("username", "==", term), window.FB.limit(1));

                        const unsubscribe = window.FB.onSnapshot(qSearch, (snap) => {
                            unsubscribe(); // run once

                            if (snap.empty) {
                                searchResults.innerHTML = '<span style="color:var(--accent-red)">Usuario no encontrado. Asegúrate de escribir exactamente su nombre de usuario.</span>';
                            } else {
                                let foundUser = null;
                                let foundId = null;
                                snap.forEach(doc => { foundUser = doc.data(); foundId = doc.id; });

                                if (foundId === window.FB.auth.currentUser.uid) {
                                    searchResults.innerHTML = '<span style="color:var(--accent-orange)">Ese eres tú mismo.</span>';
                                    return;
                                }

                                searchResults.innerHTML = `
                                    <div style="display:flex; justify-content:space-between; align-items:center;">
                                        <div>
                                            <div style="font-weight:bold">${foundUser.username}</div>
                                            <div style="font-size:12px; color:var(--text-muted)">${foundUser.isScorePublic === false ? "Promedio general oculto" : `Promedio: ${formatLeaderboardScore(foundUser.score)}%`}</div>
                                        </div>
                                        <button class="btn-primary btn-community-add" data-id="${foundId}" data-name="${foundUser.username}" style="padding: 8px 12px; font-size: 13px;">Añadir</button>
                                    </div>
                                `;
                            }
                            btnSearchFriend.textContent = "Buscar";
                        }, (err) => {
                            searchResults.innerHTML = '<span style="color:var(--accent-red)">Error de BD. Revisa las reglas.</span>';
                            btnSearchFriend.textContent = "Buscar";
                        });
                    } catch (err) {
                        searchResults.innerHTML = '<span style="color:var(--accent-red)">Error: ' + err.message + '</span>';
                        btnSearchFriend.textContent = "Buscar";
                    }
                });

                // Delegación de eventos para el botón de añadir amigo en resultados de búsqueda
                searchResults.addEventListener("click", async (e) => {
                    if (e.target.classList.contains("btn-community-add")) {
                        const btn = e.target;
                        const targetId = btn.getAttribute("data-id");
                        const targetName = btn.getAttribute("data-name");
                        btn.textContent = "Enviando...";
                        btn.disabled = true;

                        try {
                            await window.FB.addDoc(window.FB.collection(window.FB.db, "friendRequests"), {
                                fromId: window.FB.auth.currentUser.uid,
                                fromName: State.userName,
                                toId: targetId,
                                toName: targetName,
                                status: "pending",
                                timestamp: new Date()
                            });
                            searchResults.innerHTML = '<span style="color:var(--accent-green)">Solicitud enviada exitosamente.</span>';
                        } catch (err) {
                            btn.textContent = "Añadir";
                            btn.disabled = false;
                            showNotification("Error al enviar: " + err.message, "error");
                        }
                    }
                });
            }

            // Usar un flag global para evitar crear listeners duplicados
            // Solo se crean listeners UNA VEZ; la campana actualiza el modal al abrirse
            let _notifListenersActive = false;
            let _renderMergedNotifications = null; // referencia para acceso desde el early-return

            window.loadPendingRequests = () => {
                // Si ya hay listeners activos, solo re-renderizar con los datos que ya tenemos
                if (_notifListenersActive) {
                    if (_renderMergedNotifications) _renderMergedNotifications();
                    return;
                }
                _notifListenersActive = true;

                const reqsRef = window.FB.collection(window.FB.db, "friendRequests");
                const qReqs = window.FB.query(reqsRef, window.FB.where("toId", "==", window.FB.auth.currentUser.uid), window.FB.where("status", "==", "pending"));

                const chalRef = window.FB.collection(window.FB.db, "challenges");
                const qChal = window.FB.query(chalRef, window.FB.where("participantIds", "array-contains", window.FB.auth.currentUser.uid), window.FB.where("status", "==", "active"));

                const annRef = window.FB.collection(window.FB.db, "community_announcements");
                const qAnn = window.FB.query(annRef, window.FB.orderBy("createdAt", "desc"), window.FB.limit(25));

                let pendingFriends = [];
                let pendingChallenges = [];
                let pendingAnnouncements = [];

                const getCommunityLastSeenTs = () => parseInt(localStorage.getItem(COMMUNITY_NOTIF_LAST_SEEN_KEY) || "0", 10);
                const getLatestCommunityTs = () => pendingAnnouncements.reduce((max, item) => Math.max(max, Number(item.createdAt || 0)), 0);

                window.markCommunityAnnouncementsSeen = () => {
                    const latestTs = getLatestCommunityTs();
                    if (latestTs > 0) {
                        localStorage.setItem(COMMUNITY_NOTIF_LAST_SEEN_KEY, String(latestTs));
                    }
                };

                // Mover renderMergedNotifications al scope exterior para que sea accesible
                const renderMergedNotifications = () => {
                    const profileListEl = $("pending-requests-list");
                    const modalListEl = $("notif-list-container");
                    const badgeMain = $("notif-badge-main");
                    const communityUnread = pendingAnnouncements.filter(item => Number(item.createdAt || 0) > getCommunityLastSeenTs()).length;
                    const unreadTotal = pendingFriends.length + pendingChallenges.length + communityUnread;
                    const visibleTotal = pendingFriends.length + pendingChallenges.length + pendingAnnouncements.length;

                    if (visibleTotal === 0) {
                        const emptyMsg = '<div style="text-align: center; color: var(--text-muted); font-size: 13px; padding: 20px;">No tienes notificaciones nuevas.</div>';
                        if (profileListEl) profileListEl.innerHTML = emptyMsg;
                        if (modalListEl) modalListEl.innerHTML = emptyMsg;
                        if (badgeMain) badgeMain.style.display = "none";
                        return;
                    }

                    if (badgeMain) {
                        if (unreadTotal > 0) {
                            badgeMain.style.display = "grid";
                            badgeMain.textContent = unreadTotal;
                        } else {
                            badgeMain.style.display = "none";
                        }
                    }

                    let html = "";

                    pendingAnnouncements.forEach(data => {
                        const ts = Number(data.createdAt || 0);
                        const isUnread = ts > getCommunityLastSeenTs();
                        const when = ts > 0 ? new Date(ts).toLocaleString("es-MX") : "Reciente";
                        html += `
                        <div style="background:rgba(59,130,246,0.09); padding:14px; border-radius:14px; border: 1px solid rgba(59,130,246,0.28); margin-bottom: 8px;">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:8px;">
                                <div>
                                    <div style="font-weight:bold; font-size:14px; color: var(--accent-blue);">${escapeHtml(data.title || "Aviso ENARM Lab")}</div>
                                    <div style="font-size:11px; color: var(--text-muted);">${when}</div>
                                </div>
                                ${isUnread ? '<span style="font-size:10px; padding:3px 8px; border-radius:20px; background:rgba(16,185,129,0.18); color:var(--accent-green); border:1px solid rgba(16,185,129,0.35); font-weight:bold;">Nuevo</span>' : ''}
                            </div>
                            <div style="font-size:13px; color:var(--text-primary); line-height:1.55; white-space:pre-wrap; overflow-wrap:anywhere;">${escapeHtml(data.message || "")}</div>
                        </div>`;
                    });

                    // Render friends
                    pendingFriends.forEach(data => {
                        html += `
                        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:12px; border-radius:12px; border: 1px solid var(--border); margin-bottom: 8px;">
                            <div style="display: flex; flex-direction: column;">
                                <span style="font-weight:bold; font-size:14px; color: var(--text-primary);">${data.fromName}</span>
                                <span style="font-size:11px; color: var(--text-muted);">Te envi\u00f3 una solicitud de amistad</span>
                            </div>
                            <div style="display:flex; gap:8px;">
                                <button class="btn-primary btn-accept-friend" data-id="${data.id}" style="padding:6px 10px; font-size:11px; background:var(--accent-green); border-radius: 6px;">Aceptar</button>
                                <button class="btn-primary btn-reject-friend" data-id="${data.id}" style="padding:6px 10px; font-size:11px; background:var(--bg-card); border: 1px solid var(--border); color: var(--text-secondary); border-radius: 6px;">&times;</button>
                            </div>
                        </div>`;
                    });

                    // Render challenges - mejor diseño para aceptar
                    pendingChallenges.forEach(data => {
                        html += `
                        <div style="background:rgba(243,122,32,0.08); padding:14px; border-radius:14px; border: 1px solid rgba(243,122,32,0.3); margin-bottom: 8px;">
                            <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                                <span style="font-size:24px;">&#x2694;&#xFE0F;</span>
                                <div>
                                    <div style="font-weight:bold; font-size:14px; color: var(--accent-orange);">Reto de ${data.challengerName}</div>
                                    <div style="font-size:11px; color: var(--text-muted);">${data.specialty} &bull; ${data.numQuestions} preguntas</div>
                                </div>
                            </div>
                            <button class="btn-primary btn-play-chal" data-id="${data.id}" style="width:100%; padding:10px; font-size:13px; background:var(--accent-orange); border-radius: 10px; font-weight:bold;">&#x2694;&#xFE0F; ¡Aceptar y Jugar Ahora!</button>
                        </div>`;
                    });

                    if (profileListEl) profileListEl.innerHTML = html;
                    if (modalListEl) modalListEl.innerHTML = html;

                    const attachEvents = (container) => {
                        if (!container) return;

                        // Friends events
                        container.querySelectorAll(".btn-accept-friend").forEach(btn => {
                            btn.addEventListener("click", async (e) => {
                                const reqId = e.currentTarget.getAttribute("data-id");
                                e.currentTarget.textContent = "...";
                                await window.FB.updateDoc(window.FB.doc(window.FB.db, "friendRequests", reqId), { status: "accepted" });
                                showNotification("¡Solicitud aceptada!", "success");
                                if (typeof fetchFriendsAndLeaderboard === 'function') fetchFriendsAndLeaderboard();
                            });
                        });
                        container.querySelectorAll(".btn-reject-friend").forEach(btn => {
                            btn.addEventListener("click", async (e) => {
                                const reqId = e.currentTarget.getAttribute("data-id");
                                await window.FB.updateDoc(window.FB.doc(window.FB.db, "friendRequests", reqId), { status: "rejected" });
                                if (typeof fetchFriendsAndLeaderboard === 'function') fetchFriendsAndLeaderboard();
                            });
                        });

                        // Challenges events
                        container.querySelectorAll(".btn-play-chal").forEach(btn => {
                            btn.addEventListener("click", (e) => {
                                const chalId = e.currentTarget.getAttribute("data-id");
                                const notifModal = $("notif-modal");
                                if (notifModal) notifModal.style.display = "none";
                                if (typeof window.acceptChallenge === 'function') {
                                    window.acceptChallenge(chalId);
                                }
                            });
                        });
                    };

                    attachEvents(profileListEl);
                    attachEvents(modalListEl);
                };

                // Exponer la función para que el early-return pueda re-renderizar
                _renderMergedNotifications = renderMergedNotifications;

                // Primer snapshot: marcar como carga inicial para no disparar banners
                let firstLoadFriends = true;
                let firstLoadChallenges = true;

                window.FB.onSnapshot(qReqs, (snap) => {
                    const added = snap.docChanges().filter(c => c.type === 'added');
                    if (!firstLoadFriends && added.length > 0) {
                        added.forEach(c => {
                            const d = c.doc.data();
                            showBanner("Nueva solicitud", `${d.fromName} quiere ser tu amigo.`, "\ud83e\udd1d");
                            showSystemNotification("Nueva solicitud", `${d.fromName} quiere ser tu amigo.`);
                        });
                    }
                    firstLoadFriends = false;
                    pendingFriends = [];
                    snap.forEach(doc => pendingFriends.push({ id: doc.id, ...doc.data() }));
                    renderMergedNotifications();
                });

                window.FB.onSnapshot(qChal, (snap) => {
                    const added = snap.docChanges().filter(c => c.type === 'added');
                    if (!firstLoadChallenges && added.length > 0) {
                        added.forEach(c => {
                            const d = c.doc.data();
                            // No mostrar banner si yo soy el retador
                            if (d.challengerId === window.FB.auth.currentUser.uid) return;

                            // Banner con callback que ABRE el modal de notificaciones directamente
                            showBanner("¡Tienes un Reto!", `${d.challengerName} te desafi\u00f3 en ${d.specialty}.`, "\u2694\ufe0f", () => {
                                const notifModal = $("notif-modal");
                                if (notifModal) {
                                    notifModal.style.display = "flex";
                                    renderMergedNotifications();
                                }
                            });
                            showSystemNotification("¡Tienes un Reto!", `${d.challengerName} te desafio en ${d.specialty}.`);
                        });
                    }
                    firstLoadChallenges = false;
                    pendingChallenges = [];
                    snap.forEach(doc => {
                        const d = doc.data();
                        const uid = window.FB.auth.currentUser.uid;
                        // Solo mostrar si yo no he jugado aún
                        if (d.participants && d.participants[uid] && d.participants[uid].status === "pending") {
                            pendingChallenges.push({ id: doc.id, ...d });
                        }
                    });
                    renderMergedNotifications();
                });

                let firstLoadAnnouncements = true;
                window.FB.onSnapshot(qAnn, (snap) => {
                    const added = snap.docChanges().filter(c => c.type === 'added');
                    if (!firstLoadAnnouncements && added.length > 0) {
                        added.forEach(c => {
                            const d = c.doc.data() || {};
                            const rawAnnouncementMessage = String(d.message || "")
                                .replace(/\s+/g, " ")
                                .trim();
                            const bannerMessage = rawAnnouncementMessage.length > COMMUNITY_ANNOUNCEMENT_BANNER_PREVIEW_LENGTH
                                ? `${rawAnnouncementMessage.slice(0, COMMUNITY_ANNOUNCEMENT_BANNER_PREVIEW_LENGTH - 1)}...`
                                : rawAnnouncementMessage;
                            showBanner(
                                escapeHtml(d.title || "Aviso ENARM Lab"),
                                escapeHtml(bannerMessage),
                                "&#x1F4E2;",
                                () => {
                                    const notifModal = $("notif-modal");
                                    if (notifModal) {
                                        notifModal.style.display = "flex";
                                        if (typeof window.markCommunityAnnouncementsSeen === 'function') {
                                            window.markCommunityAnnouncementsSeen();
                                        }
                                        renderMergedNotifications();
                                    }
                                }
                            );
                        });
                    }
                    firstLoadAnnouncements = false;
                    pendingAnnouncements = [];
                    snap.forEach(doc => pendingAnnouncements.push({ id: doc.id, ...doc.data() }));
                    renderMergedNotifications();
                });
            };

            // Eliminado saveGlobalStats() aquí para evitar sobreescribir datos en la nube al iniciar sesión.
        };

        const setupChallengeLogic = () => {
            // Guard: only initialize once to avoid duplicate event listeners
            if (window._challengeLogicReady) return;
            window._challengeLogicReady = true;

            const btnCreate = $("btn-create-challenge");
            const modal = $("challenge-modal");
            const btnClose = $("btn-close-challenge-modal");
            const btnSend = $("btn-send-challenge");
            const checkboxesContainer = $("challenge-friends-checkboxes");
            const listContainer = $("challenges-list-container");

            if (btnCreate) {
                btnCreate.addEventListener("click", () => {
                    if (!ensurePremiumAccess("Retos y amigos son funciones premium.")) return;
                    if (!checkboxesContainer) return;
                    checkboxesContainer.innerHTML = "";
                    if (State.myFriends.length === 0) {
                        checkboxesContainer.innerHTML = '<span style="font-size: 12px; color: var(--text-muted);">Agrega amigos primero para desafiar.</span>';
                    } else {
                        State.myFriends.forEach(f => {
                            const div = document.createElement("div");
                            div.style.display = "flex";
                            div.style.alignItems = "center";
                            div.style.gap = "10px";
                            div.style.padding = "5px";
                            div.innerHTML = `
                                <input type="checkbox" class="challenge-friend-cb" value="${f.uid}" data-name="${f.username}" id="cb-${f.uid}" style="cursor:pointer;">
                                <label for="cb-${f.uid}" style="cursor:pointer; font-size:14px; flex:1;">${f.username} (${f.score}%)</label>
                            `;
                            checkboxesContainer.appendChild(div);
                        });
                        // If we arrived from quickChallenge, auto-select that friend
                        if (window._pendingChallengeUid) {
                            const target = checkboxesContainer.querySelector(`input[value="${window._pendingChallengeUid}"]`);
                            if (target) target.checked = true;
                            window._pendingChallengeUid = null; // consume it
                        }
                    }
                    modal.style.display = "flex";
                });
            }

            if (btnClose) {
                btnClose.addEventListener("click", () => {
                    modal.style.display = "none";
                });
            }

            if (btnSend) {
                btnSend.addEventListener("click", async () => {
                    const selectedCbs = document.querySelectorAll(".challenge-friend-cb:checked");
                    if (selectedCbs.length === 0) return showNotification("Selecciona al menos un amigo.", "warning");

                    // Read config from State (always in sync with DOM via listeners in initSetupLogic)
                    // Fallback to reading DOM directly in case the user hasn't interacted yet
                    const domSpecs = Array.from(document.querySelectorAll(".spec-item.checked")).map(i => i.dataset.spec);
                    const hasRandomSpecialty = domSpecs.includes("random") || (State.selectedSpecialties || []).includes("random");
                    const specsArray = (domSpecs.length > 0 ? domSpecs : State.selectedSpecialties)
                        .filter(spec => TRONCAL_SPECIALTIES.includes(spec));
                    const qtySlider = document.getElementById("setup-qty-slider");
                    const qty = qtySlider ? parseInt(qtySlider.value, 10) : (State.setupQty || 10);

                    if (specsArray.length === 0 && State.selectedTopics.length === 0 && !hasRandomSpecialty) {
                        return showNotification("Configura especialidad o temas en 'Añadir Materias' primero.", "warning");
                    }

                    await withTemporaryButtonLabel(btnSend, "Preparando...", async () => {
                        try {
                            await ensureQuestionsReady({ silent: false });
                        } catch (err) {
                            return;
                        }

                        const {
                            primary: poolPrimary,
                            secondary: poolSecondary
                        } = buildFilteredQuestionPools({
                            specs: specsArray,
                            selectedTopics: State.selectedTopics,
                            difficulty: State.difficulty
                        });

                        // Use the GLOBAL processAndFlattenPool (defined at line ~121)
                        // which preserves multi-question clinical case grouping
                        let flatPrimary = processAndFlattenPool(poolPrimary, qty);

                        if (flatPrimary.length < qty && poolSecondary.length > 0) {
                            let missing = qty - flatPrimary.length;
                            let flatSecondary = processAndFlattenPool(poolSecondary, missing);
                            if (flatSecondary.length > 0) {
                                flatPrimary = flatPrimary.concat(flatSecondary);
                            }
                        }

                        if (flatPrimary.length === 0) return showNotification("No hay suficientes preguntas.", "warning");

                        // Final specialty guard: ensure no leak from topic-expansion or secondary pool
                        if (specsArray.length > 0) {
                            flatPrimary = flatPrimary.filter(q => specsArray.includes(q.specialty));
                        }

                        if (flatPrimary.length === 0) return showNotification("No hay preguntas de la especialidad seleccionada con esos filtros.", "warning");

                        // Map each selected question to an EXACT {idx, sub} identifier.
                        // flatPrimary items come from processAndFlattenPool which expands cases
                        // into sub-questions with inherited specialty from the parent.
                        const questionIndices = flatPrimary.map(q => {
                            // Simple question: exact reference match (same object)
                            const directIdx = QUESTIONS.indexOf(q);
                            if (directIdx !== -1) return { idx: directIdx, sub: -1 };

                            // Expanded sub-question (copy): find parent + specific sub-question index
                            // Match specialty to avoid cross-specialty contamination
                            for (let i = 0; i < QUESTIONS.length; i++) {
                                const ref = QUESTIONS[i];
                                if (!ref) continue;
                                if (ref.specialty !== q.specialty) continue;
                                // Simple question with same text
                                if (ref.question === q.question && Array.isArray(ref.options) && ref.options.length > 0) {
                                    return { idx: i, sub: -1 };
                                }
                                // Clinical case: find the exact sub-question index
                                if (ref.questions && Array.isArray(ref.questions)) {
                                    const subIdx = ref.questions.findIndex(sq => sq && sq.question === q.question);
                                    if (subIdx !== -1) return { idx: i, sub: subIdx };
                                }
                            }
                            return null;
                        }).filter(item => item !== null);

                        if (questionIndices.length === 0) return showNotification("Error: No se pudieron mapear las preguntas al banco.", "error");

                        const summarySpec = specsArray.length === 1 ? specsArray[0] : (specsArray.length > 1 ? "Mix Especialidades" : "Tema Específico");

                        // Map participants
                        const participants = {};
                        // Include the challenger
                        participants[window.FB.auth.currentUser.uid] = {
                            name: State.userName,
                            score: null,
                            status: "pending",
                            timestamp: null
                        };
                        selectedCbs.forEach(cb => {
                            participants[cb.value] = {
                                name: cb.getAttribute("data-name"),
                                score: null,
                                status: "pending",
                                timestamp: null
                            };
                        });

                        const participantIds = [window.FB.auth.currentUser.uid, ...Array.from(selectedCbs).map(cb => cb.value)];

                        btnSend.textContent = "Enviando...";
                        try {
                            const newDoc = await window.FB.addDoc(window.FB.collection(window.FB.db, "challenges"), {
                                challengerId: window.FB.auth.currentUser.uid,
                                challengerName: State.userName,
                                participants: participants,
                                participantIds: participantIds,
                                specialty: summarySpec,
                                numQuestions: questionIndices.length,
                                targetQty: questionIndices.length,
                                questionIndices: questionIndices,   // Array of {idx, sub} pairs
                                status: "active",
                                createdAt: Date.now()
                            });
                            showNotification("¡Enviado a " + selectedCbs.length + " amigos!", "success");
                            modal.style.display = "none";

                            // Automatically start for the challenger
                            State.activeChallengeId = newDoc.id;
                            State.activeChallengeRole = "challenger";
                            if (typeof window._startChallengeInternal === "function") {
                                window._startChallengeInternal(newDoc.id, questionIndices, questionIndices.length);
                            }
                        } catch (err) {
                            showNotification("Error: " + err.message, "error");
                        }
                    });
                });
            }

            // Real-time listener using participantIds
            const chalRef = window.FB.collection(window.FB.db, "challenges");
            const q = window.FB.query(chalRef, window.FB.where("participantIds", "array-contains", window.FB.auth.currentUser.uid));

            const allChallenges = new Map();
            let showAllActive = false;
            let showAllPast = false;

            window.toggleAllChallenges = (type) => {
                if (type === 'active') showAllActive = !showAllActive;
                else showAllPast = !showAllPast;
                renderChallenges();
            };

            const renderChallenges = () => {
                if (!listContainer) return;
                const uid = window.FB.auth.currentUser.uid;

                const allSorted = Array.from(allChallenges.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                const activeOnes = allSorted.filter(ch => ch.status !== 'finished');
                const pastOnes = allSorted.filter(ch => ch.status === 'finished');

                const displayActive = showAllActive ? activeOnes : activeOnes.slice(0, 3);
                const displayPast = showAllPast ? pastOnes : pastOnes.slice(0, 2);

                const renderCard = (ch) => {
                    const myEntry = ch.participants ? ch.participants[uid] : null;
                    const others = Object.values(ch.participants || {}).filter(p => p.name !== State.userName);
                    const opponentText = others.length === 1 ? others[0].name : (others.length + " participantes");

                    let actionBtn = "";
                    let statusBadge = "";
                    let isFinished = ch.status === "finished";
                    const iAmChallenger = ch.challengerId === uid;

                    if (!isFinished) {
                        if (myEntry && myEntry.status === "pending") {
                            statusBadge = `<span style="font-size:10px; padding:3px 8px; border-radius:20px; background:rgba(243,122,32,0.15); color:var(--accent-orange); border:1px solid rgba(243,122,32,0.3); font-weight:bold;">⏳ Tu turno</span>`;
                            actionBtn = `
                                <div style="display:flex; gap:8px; margin-top:10px;">
                                    <button class="btn-primary" style="flex:1; border-radius:8px; background:var(--accent-orange); font-size:13px; padding:10px;" onclick="event.stopPropagation(); window.acceptChallenge('${ch.id}')">&#x2694;&#xFE0F; ¡Jugar Reto!</button>
                                    <button class="btn-ghost" style="padding:10px 12px; border-radius:8px; font-size:18px;" onclick="event.stopPropagation(); window.showChallengeRanking('${ch.id}')" title="Ver ranking parcial">&#x1F4CA;</button>
                                </div>`;
                        } else {
                        statusBadge = `<span style="font-size:10px; padding:3px 8px; border-radius:20px; background:rgba(59,130,246,0.15); color:var(--accent-blue); border:1px solid rgba(59,130,246,0.3); font-weight:bold;">&#x2705; Ya jugaste</span>`;
                            actionBtn = `
                                <div style="display:flex; gap:8px; margin-top:10px;">
                                    <div style="flex:1; font-size:12px; color:var(--text-muted); padding:10px; background:rgba(255,255,255,0.05); border-radius:8px; text-align:center;">Esperando a los demás...</div>
                                    <button class="btn-ghost" style="padding:10px 12px; border-radius:8px; font-size:18px;" onclick="event.stopPropagation(); window.showChallengeRanking('${ch.id}')" title="Ver ranking parcial">&#x1F4CA;</button>
                                </div>`;
                        }
                    } else {
                        statusBadge = `<span style="font-size:10px; padding:3px 8px; border-radius:20px; background:rgba(16,185,129,0.15); color:var(--accent-green); border:1px solid rgba(16,185,129,0.3); font-weight:bold;">&#x1F3C1; Finalizado</span>`;
                        actionBtn = `
                            <button class="btn-primary" style="width:100%; border-radius:8px; font-size:13px; padding:10px; margin-top:10px; background:rgba(59,130,246,0.15); border:1px solid rgba(59,130,246,0.4); color:#60a5fa;" onclick="event.stopPropagation(); window.showChallengeRanking('${ch.id}')">&#x1F4CA; Ver Ranking Final</button>`;
                    }

                    return `
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px; text-align: left; position: relative;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                            <div>
                                <div style="font-size:11px; color:var(--accent-orange); font-weight:bold; margin-bottom:3px;">RETO · ${ch.specialty}</div>
                                <div style="font-size:14px; font-weight:600;">Vs. <strong>${opponentText}</strong></div>
                            </div>
                            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
                                <span style="font-size:11px; color:var(--text-muted);">${ch.numQuestions} P.</span>
                                ${statusBadge}
                            </div>
                        </div>
                        ${actionBtn}
                    </div>
                    `;
                };

                let activeHtml = displayActive.map(ch => renderCard(ch)).join("");
                let pastHtml = displayPast.map(ch => renderCard(ch)).join("");

                if (activeOnes.length > 3) {
                    activeHtml += `<button class="btn-ghost" style="width:100%; font-size:12px; margin-top:5px; color:var(--accent-orange);" onclick="window.toggleAllChallenges('active')">${showAllActive ? 'Ver menos &uarr;' : 'Ver todos (' + activeOnes.length + ') &darr;'}</button>`;
                }
                if (pastOnes.length > 2) {
                    pastHtml += `<button class="btn-ghost" style="width:100%; font-size:12px; margin-top:5px; color:var(--text-muted);" onclick="window.toggleAllChallenges('past')">${showAllPast ? 'Ver menos &uarr;' : 'Ver historial (' + pastOnes.length + ') &darr;'}</button>`;
                }

                let finalHtml = `
                    <div style="text-align: left; margin-bottom: 15px;">
                        <h3 style="font-size: 14px; color: var(--text-primary); margin-bottom: 10px;">&#x1F525; Retos Activos</h3>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            ${activeHtml || '<p style="font-size: 12px; color: var(--text-muted); padding: 10px; text-align: center;">No hay retos activos.</p>'}
                        </div>
                    </div>
                    <div style="text-align: left; margin-top: 25px;">
                        <h3 style="font-size: 14px; color: var(--text-muted); margin-bottom: 10px;">&#x1F4CC; Retos Pasados</h3>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            ${pastHtml || '<p style="font-size: 12px; color: var(--text-muted); padding: 10px; text-align: center;">No hay retos terminados.</p>'}
                        </div>
                    </div>
                `;

                listContainer.innerHTML = finalHtml;
            };

            window.showChallengeRanking = async (id) => {
                const ch = allChallenges.get(id);
                if (!ch) return;

                const modal = $("challenge-ranking-modal");
                const title = $("ranking-modal-title");
                const list = $("ranking-list-details");
                if (!modal || !list) return;

                title.textContent = `Ranking: ${ch.specialty}`;
                modal.style.display = "flex";

                const pts = Object.values(ch.participants || {}).sort((a, b) => (b.score || 0) - (a.score || 0));

                list.innerHTML = pts.map((p, idx) => `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 10px;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="font-weight:bold; color: var(--accent-purple); width: 20px;">${idx + 1}.</span>
                            <span style="font-size: 14px;">${p.name}</span>
                        </div>
                        <span style="font-weight:bold; color: ${p.score === null ? 'var(--text-muted)' : 'var(--accent-green)'}">
                            ${p.score === null ? "Pendiente" : p.score.toFixed(1) + "%"}
                        </span>
                    </div>
                `).join("");

                // Update Chart
                const ctx = document.getElementById('challenge-ranking-chart').getContext('2d');
                if (window.rankingChart) window.rankingChart.destroy();

                const labels = pts.map(p => p.name);
                const data = pts.map(p => p.score || 0);
                const colors = pts.map((p, i) => i === 0 ? '#10b981' : '#3b82f6');

                window.rankingChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Puntaje %',
                            data: data,
                            backgroundColor: colors,
                            borderRadius: 6
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            x: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' } },
                            y: { grid: { display: false } }
                        }
                    }
                });
            };

            window.FB.onSnapshot(q, snap => {
                snap.docChanges().forEach(change => {
                    if (change.type === "removed") allChallenges.delete(change.doc.id);
                    else allChallenges.set(change.doc.id, { id: change.doc.id, ...change.doc.data() });
                });
                renderChallenges();
            });

            const startChallengeExam = async (id, indices, targetQty) => {
                if (!Array.isArray(indices) || indices.length === 0) {
                    return showNotification("Error: Los datos del reto están dañados o vacíos.", "error");
                }

                await withExamLoadingOverlay(async (setStage) => {
                    await setStage({
                        title: "Preparando reto...",
                        detail: "Estamos cargando el banco de preguntas.",
                        progress: 12
                    });

                    try {
                        await ensureQuestionsReady({ silent: false });
                    } catch (err) {
                        return;
                    }

                    await setStage({
                        detail: "Estamos armando el reto y agrupando las preguntas.",
                        progress: 68
                    });

                    const finalSet = [];
                    let groupCounter = 1;
                    let lastParentIdx = -1; // Track to group consecutive sub-questions of the same case

                    indices.forEach((item) => {
                        // Support both NEW format {idx, sub} and LEGACY format (plain number)
                        const isLegacy = typeof item === 'number';
                        const parentIdx = isLegacy ? item : item.idx;
                        const subIdx = isLegacy ? -1 : item.sub;

                        const q = QUESTIONS[parentIdx];
                        if (!q) return;

                        // Determine if this is a new case group or continuation of the previous one
                        const isSameCase = (parentIdx === lastParentIdx);
                        if (!isSameCase) {
                            if (lastParentIdx !== -1) groupCounter++;
                            lastParentIdx = parentIdx;
                        }

                        if (Array.isArray(q.options) && q.options.length > 0) {
                            // Simple question (or legacy simple)
                            finalSet.push({ ...q, caseGroupId: groupCounter, subQuestionIndex: 1, totalSubQuestions: 1 });

                        } else if (q.questions && Array.isArray(q.questions) && q.questions.length > 0) {

                            if (!isLegacy && subIdx >= 0) {
                                // NEW format: load ONLY the specific sub-question indicated by subIdx
                                const sq = q.questions[subIdx];
                                // Count how many sub-questions from this same parent are in the indices
                                const siblingCount = indices.filter(it => (typeof it === 'object' && it.idx === parentIdx)).length;
                                if (sq && Array.isArray(sq.options) && sq.options.length > 0) {
                                    finalSet.push({
                                        ...q,
                                        question: sq.question,
                                        options: sq.options,
                                        answerIndex: sq.answerIndex,
                                        explanation: sq.explanation,
                                        caseGroupId: groupCounter,
                                        subQuestionIndex: subIdx + 1,
                                        totalSubQuestions: siblingCount > 1 ? siblingCount : q.questions.length
                                    });
                                }
                            } else {
                                // LEGACY format: expand all sub-questions of the case (old behavior)
                                q.questions.forEach((sq, sqIdx) => {
                                    if (sq && Array.isArray(sq.options) && sq.options.length > 0) {
                                        finalSet.push({
                                            ...q,
                                            question: sq.question,
                                            options: sq.options,
                                            answerIndex: sq.answerIndex,
                                            explanation: sq.explanation,
                                            caseGroupId: groupCounter,
                                            subQuestionIndex: sqIdx + 1,
                                            totalSubQuestions: q.questions.length
                                        });
                                    }
                                });
                            }

                        } else {
                            // Fallback: find by question text
                            const found = QUESTIONS.findIndex(
                                ref => ref.question && ref.question === q.question && Array.isArray(ref.options)
                            );
                            if (found !== -1) {
                                finalSet.push({ ...QUESTIONS[found], caseGroupId: groupCounter, subQuestionIndex: 1, totalSubQuestions: 1 });
                                groupCounter++;
                            }
                        }
                    });

                    if (finalSet.length === 0) {
                        return showNotification("Error al cargar preguntas. El banco puede haber sido actualizado. Crea un nuevo reto.", "error");
                    }

                    // Safety trim: legacy challenges may expand more than intended
                    const resolvedQty = targetQty && targetQty > 0 ? targetQty : finalSet.length;
                    const trimmedSet = finalSet.slice(0, resolvedQty);

                    if (trimmedSet.length < resolvedQty) {
                        showNotification(`Se cargaron ${trimmedSet.length} de ${resolvedQty} preguntas.`, "warning");
                    }

                    await setStage({
                        detail: "Abriendo tu reto.",
                        progress: 100
                    });

                    beginExamSession({
                        questionSet: trimmedSet,
                        mode: "simulacro",
                        currentExamIsReal: false,
                        currentExamType: "Reto Amistoso",
                        durationSec: 0
                    });

                    showNotification("¡Reto iniciado! Buena suerte.", "info");
                }, {
                    title: "Preparando reto...",
                    detail: "Estamos organizando tus preguntas.",
                    progress: 8
                });
            };

            // Exponer internamente para que acceptChallenge pueda llamarlo
            window._startChallengeInternal = startChallengeExam;
        };

        window.acceptChallenge = async (id) => {
            if (!window.FB || !window.FB.db) return showNotification("Firebase no inicializado.", "error");
            if (!window._startChallengeInternal) {
                return showNotification("El sistema de retos no está listo. Recarga la página.", "warning");
            }
            try {
                showNotification("Cargando reto...", "info");
                const docSnap = await window.FB.getDoc(window.FB.doc(window.FB.db, "challenges", id));
                if (!docSnap.exists()) return showNotification("Reto no encontrado.", "error");
                const data = docSnap.data();

                // Validate questionIndices
                if (!data.questionIndices || !Array.isArray(data.questionIndices) || data.questionIndices.length === 0) {
                    return showNotification("Este reto no tiene preguntas válidas. Puede estar corrupto.", "error");
                }

                // Cerrar modales si están abiertos
                const notifModal = $("notif-modal");
                if (notifModal) notifModal.style.display = "none";

                State.activeChallengeId = id;
                State.activeChallengeRole = "challenged";
                window._startChallengeInternal(id, data.questionIndices, data.targetQty);
            } catch (err) {
                console.error(err);
                showNotification("Error al cargar el reto: " + err.message, "error");
            }
        };

        window.playChallenge = async (id) => {
            if (!window.FB || !window.FB.db) return showNotification("Firebase no inicializado.", "error");
            try {
                const docSnap = await window.FB.getDoc(window.FB.doc(window.FB.db, "challenges", id));
                if (!docSnap.exists()) return showNotification("Reto no encontrado.", "error");
                const data = docSnap.data();

                State.activeChallengeId = id;
                State.activeChallengeRole = "challenger";
                if (typeof window._startChallengeInternal === "function") {
                    window._startChallengeInternal(id, data.questionIndices || [], data.targetQty);
                } else {
                    showNotification("La lógica del examen aún no está lista. Recarga la página.", "warning");
                }
            } catch (err) {
                console.error(err);
                showNotification("Error al cargar el reto: " + err.message, "error");
            }
        };

        window.clearAllNotifications = async () => {
            if (!window.FB || !window.FB.db || !window.FB.auth.currentUser) {
                showNotification("Inicia sesion para limpiar notificaciones.", "warning");
                return;
            }
            const uid = window.FB.auth.currentUser.uid;

            if (!confirm("¿Seguro que quieres eliminar todas las notificaciones?")) return;

            try {
                showNotification("Limpiando notificaciones...", "info");

                // Query by a single field to avoid composite-index dependency.
                const qReqs = window.FB.query(
                    window.FB.collection(window.FB.db, "friendRequests"),
                    window.FB.where("toId", "==", uid)
                );
                const snapReqs = await window.FB.getDocs(qReqs);
                const p1 = snapReqs.docs
                    .filter(d => (d.data() || {}).status === "pending")
                    .map(d => window.FB.deleteDoc(d.ref));

                // Query by participantIds only, then clear my pending challenge notifications.
                const qChal = window.FB.query(
                    window.FB.collection(window.FB.db, "challenges"),
                    window.FB.where("participantIds", "array-contains", uid)
                );
                const snapChal = await window.FB.getDocs(qChal);
                const p2 = snapChal.docs
                    .map(d => {
                        const data = d.data() || {};
                        if (data.status !== "active") return null;
                        const participants = data.participants || {};
                        const myEntry = participants[uid];
                        if (!myEntry || myEntry.status !== "pending") return null;
                        const nextParticipants = {
                            ...participants,
                            [uid]: {
                                ...myEntry,
                                status: "dismissed",
                                timestamp: new Date()
                            }
                        };
                        return window.FB.updateDoc(d.ref, { participants: nextParticipants });
                    })
                    .filter(Boolean);

                await Promise.all([...p1, ...p2]);
                showNotification("Notificaciones limpiadas.", "success");
            } catch (e) {
                console.error(e);
                const msg = String((e && (e.code || e.message)) || "").toLowerCase();
                if (msg.includes("permission-denied") || msg.includes("missing or insufficient permissions")) {
                    showNotification("No tienes permisos para limpiar notificaciones en la nube.", "error");
                } else if (msg.includes("index")) {
                    showNotification("Falta un indice en Firestore para limpiar notificaciones.", "error");
                } else {
                    showNotification("Error al limpiar notificaciones.", "error");
                }
            }
        };

        const getCodeTypeFromText = (code) => {
            if (!code) return null;
            if (code.startsWith("ENARM-D3-")) return "three_day";
            if (code.startsWith("ENARM-M1-")) return "month";
            if (code.startsWith("ENARM-FX-")) return "fixed";
            return null;
        };

        const computeExpiryForType = (type) => {
            if (type === "fixed") return new Date(FIXED_CODE_EXPIRY.getTime());
            if (type === "three_day") return new Date(Date.now() + THREE_DAY_CODE_DURATION_MS);
            const now = Date.now();
            return new Date(now + MONTH_CODE_DURATION_MS);
        };

        let issuedCodesCatalogPromise = null;
        const loadIssuedCodesCatalog = async () => {
            if (issuedCodesCatalogPromise) return issuedCodesCatalogPromise;
            issuedCodesCatalogPromise = (async () => {
                try {
                    const res = await fetch("./redeem_codes.txt", { cache: "no-store" });
                    if (!res.ok) return new Set();
                    const txt = await res.text();
                    return new Set(
                        txt.split(/\r?\n/)
                            .map(l => (l || "").trim().toUpperCase())
                            .filter(Boolean)
                    );
                } catch (e) {
                    console.warn("No se pudo cargar redeem_codes.txt:", e);
                    return new Set();
                }
            })();
            return issuedCodesCatalogPromise;
        };

        const bindEntitlementListener = (uid) => {
            if (!window.FB || !window.FB.db || !window.FB.onSnapshot) return;
            if (State.entitlementUnsub) {
                State.entitlementUnsub();
                State.entitlementUnsub = null;
            }
            const ref = window.FB.doc(window.FB.db, "entitlements", uid);
            State.entitlementUnsub = window.FB.onSnapshot(ref, (snap) => {
                if (!snap.exists()) {
                    State.entitlement = null;
                    syncPremiumUI();
                    return;
                }
                const data = snap.data() || {};
                State.entitlement = {
                    status: data.status || "inactive",
                    source: data.source || "",
                    expiresAt: normalizeTimestamp(data.expiresAt),
                    updatedAt: normalizeTimestamp(data.updatedAt)
                };
                syncPremiumUI();
            });
        };

        const redeemCode = async (opts = {}) => {
            const inputId = opts.inputId || "redeem-code-input";
            const closeModalOnSuccess = opts.closeModalOnSuccess !== false;
            const input = $(inputId);
            const codeRaw = input ? input.value.trim().toUpperCase() : "";
            const requireAcceptance = opts.requireAcceptance !== false && inputId === "redeem-code-input";
            if (requireAcceptance) {
                const legalCheck = $("redeem-legal-check");
                if (!legalCheck || !legalCheck.checked) {
                    return showNotification("Debes aceptar Términos y Aviso de Privacidad para continuar.", "warning");
                }
            }
            if (!codeRaw) return showNotification("Ingresa un c\u00f3digo.", "warning");
            if (!window.FB || !window.FB.auth || !window.FB.auth.currentUser) {
                return showNotification("Inicia sesi\u00f3n para canjear tu c\u00f3digo.", "warning");
            }
            if (!window.FB.runTransaction) {
                return showNotification("Firebase no est\u00e1 listo. Intenta de nuevo.", "error");
            }
            const uid = window.FB.auth.currentUser.uid;
            const code = codeRaw.replace(/\s+/g, "");
            const catalog = await loadIssuedCodesCatalog();
            const inCatalog = catalog.has(code);
            try {
                let redeemed = null;
                await window.FB.runTransaction(window.FB.db, async (tx) => {
                    const codeRef = window.FB.doc(window.FB.db, "redeem_codes", code);
                    const codeSnap = await tx.get(codeRef);
                    let data = codeSnap.exists() ? (codeSnap.data() || {}) : null;
                    if (!data) {
                        // El código existe en el catálogo local pero no está precargado
                        // en Firestore. Con reglas seguras, el usuario no-admin no puede
                        // crearlo durante el canje.
                        if (inCatalog) throw new Error("not_loaded");
                        throw new Error("invalid");
                    }
                    if (data.redeemedBy) throw new Error("used");
                    const type = data.type || getCodeTypeFromText(code) || "month";
                    const now = new Date();
                    const expiresAt = computeExpiryForType(type);
                    tx.set(codeRef, {
                        code,
                        type,
                        redeemedBy: uid,
                        redeemedAt: now,
                        expiresAt
                    }, { merge: true });
                    redeemed = { expiresAt, now };
                });
                if (redeemed) {
                    const entRef = window.FB.doc(window.FB.db, "entitlements", uid);
                    await window.FB.setDoc(entRef, {
                        status: "active",
                        expiresAt: redeemed.expiresAt,
                        source: "code",
                        updatedAt: redeemed.now,
                        code
                    }, { merge: true });
                    State.entitlement = {
                        status: "active",
                        source: "code",
                        expiresAt: redeemed.expiresAt,
                        updatedAt: redeemed.now
                    };
                    syncPremiumUI();
                }
                openPremiumWelcomeModal();
                if (input) input.value = "";
                if (closeModalOnSuccess) closeRedeemModal();
            } catch (err) {
                const msg = (err && err.message) || "";
                if (msg.includes("invalid")) {
                    showNotification("Código inválido o no autorizado.", "error");
                } else if (msg.includes("not_loaded")) {
                    showNotification("Código reconocido, pero aún no está cargado en Firebase. Pide al admin subir códigos.", "warning");
                } else if (msg.includes("used")) {
                    showNotification("Este c\u00f3digo ya fue usado.", "warning");
                } else if (msg.includes("permission-denied") || msg.includes("Missing or insufficient permissions")) {
                    showNotification("Permisos de Firestore insuficientes para canjear. Revisa reglas y UID admin.", "error");
                } else {
                    console.error(err);
                    showNotification("No se pudo canjear el c\u00f3digo.", "error");
                }
            }
        };

        const uploadAdminCodes = async () => {
            const input = $("admin-codes-input");
            if (!input) return;
            const raw = input.value || "";
            const codes = raw.split(/\r?\n/).map(l => l.trim().toUpperCase()).filter(Boolean);
            if (codes.length === 0) return showNotification("Pega al menos un c\u00f3digo.", "warning");
            if (!isAdminUser()) return showNotification("Solo admin puede cargar c\u00f3digos.", "error");
            if (!window.FB || !window.FB.db) return showNotification("Firebase no est\u00e1 listo.", "error");

            const now = new Date();
            const writes = [];
            const invalid = [];
            let skipped = 0;
            codes.forEach(code => {
                const type = getCodeTypeFromText(code);
                if (!type) {
                    invalid.push(code);
                    return;
                }
                writes.push((async () => {
                    const ref = window.FB.doc(window.FB.db, "redeem_codes", code);
                    const snap = await window.FB.getDoc(ref);
                    if (snap.exists()) {
                        skipped += 1;
                        return;
                    }
                    await window.FB.setDoc(ref, {
                        code,
                        type,
                        createdAt: now,
                        createdBy: State.currentUid || "",
                        redeemedBy: "",
                        redeemedAt: null,
                        expiresAt: null
                    }, { merge: false });
                })());
            });
            if (invalid.length > 0) {
                showNotification(`Códigos inválidos: ${invalid.length}`, "warning");
            }
            try {
                await Promise.all(writes);
                const created = Math.max(0, writes.length - skipped);
                showNotification(`Códigos cargados: ${created}. Ya existentes: ${skipped}.`, "success");
                input.value = "";
            } catch (e) {
                console.error(e);
                const msg = (e && e.message) || "";
                if (msg.includes("permission-denied") || msg.includes("Missing or insufficient permissions")) {
                    showNotification("No tienes permiso en Firebase para cargar códigos. Revisa reglas con tu UID admin.", "error");
                } else {
                    showNotification("Error al cargar c\u00f3digos.", "error");
                }
            }
        };

        const setupFirebaseAuthAndUI = () => {
            if (authOverlay && loginForm) {
                // If user doesn't exist locally, show overlay
                if (!localStorage.getItem("enarm_user") || localStorage.getItem("enarm_user") === "Aspirante") {
                    authOverlay.classList.add("active");
                    const appLayout = document.querySelector(".app-layout");
                    if (appLayout) appLayout.style.display = "none";
                } else {
                    authOverlay.classList.remove("active");
                }

                const syncAuthenticatedUI = (displayName, options = {}) => {
                    const showWelcome = Boolean(options.showWelcome);
                    const fallbackName = (displayName || "").trim() || State.userName || "Aspirante";
                    const cleanName = fallbackName.trim().substring(0, 20);

                    State.userName = cleanName;
                    localStorage.setItem("enarm_user", cleanName);

                    $$(".user-name").forEach(el => el.textContent = cleanName);
                    $$(".header-title").forEach(el => {
                        if (el.textContent.includes("Hola,")) {
                            el.innerHTML = `Hola, <span class="user-name" style="color:var(--accent-green);">${cleanName}</span>`;
                        }
                    });

                    authOverlay.classList.remove("active");
                    const appLayout = document.querySelector(".app-layout");
                    if (appLayout) appLayout.style.display = "flex";

                    const nameParts = cleanName.trim().split(/\s+/);
                    const initials = nameParts.length > 1
                        ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
                        : nameParts[0].substring(0, 2).toUpperCase();

                    $$(".user-avatar").forEach(el => renderAvatarInitials(el, initials));

                    const statusEl = document.querySelector(".user-status");
                    if (statusEl) statusEl.textContent = "EN LÍNEA";

                    if (showWelcome) {
                        showNotification(`¡Bienvenido, ${cleanName}!`, "success");
                    }

                    syncReclassAccessUI();
                    renderProfileView();
                    return cleanName;
                };

                const getRedirectSupportState = () => {
                    const authHost = String(window.FB && window.FB.authDomain ? window.FB.authDomain : "").trim().toLowerCase();
                    const currentHost = String(window.location.hostname || "").trim().toLowerCase();
                    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
                    const isSameHostAuth = Boolean(authHost && currentHost && authHost === currentHost);

                    return {
                        authHost,
                        currentHost,
                        isStandalone,
                        isSameHostAuth,
                        canUseRedirectFallback: isSameHostAuth
                    };
                };

                const getGoogleAuthErrorMessage = (error) => {
                    const code = error && error.code ? String(error.code) : "";
                    const support = getRedirectSupportState();

                    if (code === "auth/unauthorized-domain") {
                        return "Google no está autorizado para este dominio en Firebase Auth.";
                    }
                    if (code === "auth/web-storage-unsupported") {
                        return "Este navegador no permite el almacenamiento necesario para iniciar con Google.";
                    }
                    if (code === "auth/operation-not-supported-in-this-environment") {
                        return support.isStandalone
                            ? "Google no se pudo abrir dentro de la app instalada. Intenta iniciar sesión desde Chrome."
                            : "Este entorno no permite abrir el flujo de Google.";
                    }
                    if (code === "auth/popup-blocked") {
                        return "El navegador bloqueó la ventana de Google. Intenta desde Chrome o habilita popups.";
                    }
                    if (code === "auth/popup-closed-by-user") {
                        return "Se cerró la ventana de Google antes de completar el acceso.";
                    }
                    if (code === "auth/cancelled-popup-request") {
                        return "Se canceló el intento de acceso con Google.";
                    }
                    if (code === "auth/network-request-failed") {
                        return "No se pudo conectar con Google. Revisa tu conexión e inténtalo de nuevo.";
                    }
                    return "Error interno al conectar con Google: " + ((error && error.message) || "desconocido");
                };

                if (window.FB && window.FB.getRedirectResult) {
                    window.FB.getRedirectResult(window.FB.auth)
                        .then((result) => {
                            if (!result || !result.user) return;
                            const redirectDisplayName = result.user.displayName
                                || (result.user.email ? result.user.email.split("@")[0] : "")
                                || State.userName;
                            syncAuthenticatedUI(redirectDisplayName);
                        })
                        .catch((error) => {
                            console.error("Error processing Google redirect result:", error);
                            showNotification(getGoogleAuthErrorMessage(error), "error");
                        });
                }

                // Listen for Auth State to restore stats correctly dynamically
                if (window.FB && window.FB.onAuthStateChanged) {
                    window.FB.onAuthStateChanged(window.FB.auth, async (user) => {
                        if (user) {
                            const fallbackDisplayName = user.displayName
                                || (user.email ? user.email.split("@")[0] : "")
                                || State.userName;
                            syncAuthenticatedUI(fallbackDisplayName);
                            State.currentUid = user.uid;
                            const uidInput = $("profile-uid");
                            if (uidInput) uidInput.value = user.uid;
                            syncReclassAccessUI();
                            bindCaseOverridesListener();
                            bindEntitlementListener(user.uid);
                            syncPremiumUI();
                            initCloudFeatures();
                            initFeedbackAdminInbox();
                            setupChallengeLogic();
                            if (typeof window.loadPendingRequests === "function") {
                                window.loadPendingRequests(); // Iniciar notificaciones push automáticas
                            }
                            registerRemotePushNotifications();
                            try {
                                const userRef = window.FB.doc(window.FB.db, "leaderboard", user.uid);
                                const snap = await window.FB.getDoc(userRef);
                                if (snap.exists()) {
                                    const data = snap.data();
                                    let needsUpdate = false;

                                    if (typeof data.username === "string" && data.username.trim()) {
                                        syncAuthenticatedUI(data.username);
                                    }

                                    if (data.theme) { State.theme = normalizeThemeSelection(data.theme); localStorage.setItem("enarm_theme", State.theme); applyTheme(State.theme); }
                                    if (data.fontPreset) { State.fontPreset = normalizeFontPreset(data.fontPreset); localStorage.setItem(FONT_PRESET_STORAGE_KEY, State.fontPreset); applyFontPreset(State.fontPreset); }
                                    if (data.specialty !== undefined) { State.userSpecialty = data.specialty; localStorage.setItem("enarm_specialty", State.userSpecialty); if ($("profile-specialty")) $("profile-specialty").value = State.userSpecialty; }
                                    if (data.university !== undefined) { State.userUniversity = data.university; localStorage.setItem("enarm_university", State.userUniversity); if ($("profile-university")) $("profile-university").value = State.userUniversity; }
                                    if (data.isScorePublic !== undefined) { State.isScorePublic = data.isScorePublic !== false; localStorage.setItem("enarm_score_public", State.isScorePublic ? "1" : "0"); if ($("profile-score-public-toggle")) $("profile-score-public-toggle").checked = !State.isScorePublic; }

                                    if (data.globalStatsStr && data.globalStatsStr !== "{}") {
                                        State.globalStats = JSON.parse(data.globalStatsStr);
                                        localStorage.setItem("enarm_stats", data.globalStatsStr);
                                        needsUpdate = true;
                                    }
                                    if (data.historyStr) {
                                        State.history = JSON.parse(data.historyStr);
                                        localStorage.setItem("enarm_history", data.historyStr);
                                        needsUpdate = true;
                                    }
                                    if (data.reportsStr) {
                                        State.reportedQuestionsLocal = JSON.parse(data.reportsStr);
                                        localStorage.setItem("enarm_reports", data.reportsStr);
                                        mergeCloudAndLocalReports();
                                        refreshQuarantineKeys();
                                    }
                                    if (data.dailyPlanStr) {
                                        State.dailyPlan = JSON.parse(data.dailyPlanStr);
                                        localStorage.setItem("enarm_daily_plan", data.dailyPlanStr);
                                    }
                                    if (data.reviewQueueStr) {
                                        State.reviewQueue = JSON.parse(data.reviewQueueStr);
                                        localStorage.setItem("enarm_review_queue", data.reviewQueueStr);
                                    }
                                    if (data.topicMasteryStr) {
                                        State.topicMastery = JSON.parse(data.topicMasteryStr);
                                        localStorage.setItem("enarm_topic_mastery", data.topicMasteryStr);
                                    }
                                    if (data.caseNotebookStr) {
                                        State.caseNotebook = JSON.parse(data.caseNotebookStr);
                                        localStorage.setItem("enarm_case_notebook", data.caseNotebookStr);
                                    }
                                    if (data.studyCalendarStr) {
                                        State.studyCalendar = JSON.parse(data.studyCalendarStr);
                                        localStorage.setItem("enarm_study_calendar", data.studyCalendarStr);
                                    }
                                    if (data.lastPostmortemStr) {
                                        State.lastPostmortem = JSON.parse(data.lastPostmortemStr);
                                        localStorage.setItem("enarm_last_postmortem", data.lastPostmortemStr);
                                    }
                                    if (data.pomodoroSettingsStr) {
                                        State.pomodoroSettings = JSON.parse(data.pomodoroSettingsStr);
                                        localStorage.setItem(POMODORO_STORAGE_KEYS.settings, data.pomodoroSettingsStr);
                                    }
                                    if (data.pomodoroLogStr) {
                                        State.pomodoroLog = JSON.parse(data.pomodoroLogStr);
                                        localStorage.setItem(POMODORO_STORAGE_KEYS.log, data.pomodoroLogStr);
                                    }
                                    if (data.pomodoroSpecialtiesStr) {
                                        State.pomodoroSpecialties = JSON.parse(data.pomodoroSpecialtiesStr);
                                        localStorage.setItem(POMODORO_STORAGE_KEYS.specialties, data.pomodoroSpecialtiesStr);
                                    }
                                    if (typeof data.pomodoroFocusLabel === "string") {
                                        State.pomodoroFocusLabel = data.pomodoroFocusLabel;
                                        localStorage.setItem(POMODORO_STORAGE_KEYS.focus, data.pomodoroFocusLabel);
                                    }
                                    ensureStudySystemsState();
                                    rebuildTopicMastery();
                                    ensureDailyPlanFresh();

                                    if (needsUpdate) {
                                        updateDashboardStats();
                                        if (typeof updateCharts === 'function') updateCharts();
                                    }
                                } else {
                                    // Solo crear documento si el nombre ya no es el genérico (evita race condition en registros)
                                    if (State.userName !== "Aspirante") {
                                        saveGlobalStats();
                                    }
                                }
                                syncPendingReportsToCloud();
                            } catch (e) {
                                console.error("Error fetching cloud data on Auth Change:", e);
                            }
                        } else {
                            State.currentUid = "";
                            State.entitlement = null;
                            if (State.entitlementUnsub) {
                                State.entitlementUnsub();
                                State.entitlementUnsub = null;
                            }
                            if (State.caseOverridesUnsub) {
                                State.caseOverridesUnsub();
                                State.caseOverridesUnsub = null;
                            }
                            if (State.feedbackAdminUnsub) {
                                State.feedbackAdminUnsub();
                                State.feedbackAdminUnsub = null;
                            }
                            State.feedbackInbox = [];
                            renderAdminFeedbackInbox();
                            const uidInput = $("profile-uid");
                            if (uidInput) uidInput.value = "";
                            syncReclassAccessUI();
                            syncPremiumUI();
                        }
                    });
                }

                const authEmail = $("auth-email");
                const authPassword = $("auth-password");
                const groupUsername = $("group-username");
                const tabLogin = $("tab-login");
                const tabRegister = $("tab-register");
                const authSubmitBtn = $("btn-auth-submit");

                let isRegisterMode = false;

                const setAuthMode = (mode) => {
                    isRegisterMode = mode;
                    if (isRegisterMode) {
                        if (groupUsername) groupUsername.style.display = "block";
                        if (authUsername) authUsername.setAttribute("required", "true");
                        if (authSubmitBtn) authSubmitBtn.textContent = "Crear mi cuenta";

                        if (tabRegister) {
                            tabRegister.classList.add("active");
                            tabRegister.style.borderBottomColor = "var(--accent-green)";
                            tabRegister.style.color = "var(--accent-green)";
                        }
                        if (tabLogin) {
                            tabLogin.classList.remove("active");
                            tabLogin.style.borderBottomColor = "transparent";
                            tabLogin.style.color = "var(--text-muted)";
                        }
                    } else {
                        if (groupUsername) groupUsername.style.display = "none";
                        if (authUsername) authUsername.removeAttribute("required");
                        if (authSubmitBtn) authSubmitBtn.textContent = "Iniciar Sesión";

                        if (tabLogin) {
                            tabLogin.classList.add("active");
                            tabLogin.style.borderBottomColor = "var(--accent-green)";
                            tabLogin.style.color = "var(--accent-green)";
                        }
                        if (tabRegister) {
                            tabRegister.classList.remove("active");
                            tabRegister.style.borderBottomColor = "transparent";
                            tabRegister.style.color = "var(--text-muted)";
                        }
                    }
                };

                if (tabLogin) tabLogin.addEventListener("click", () => setAuthMode(false));
                if (tabRegister) tabRegister.addEventListener("click", () => setAuthMode(true));

                loginForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    if (!authEmail || !authPassword) return; // Parche de seguridad

                    const email = authEmail.value.trim();
                    const password = authPassword.value;
                    const userName = authUsername ? authUsername.value.trim() : email.split("@")[0];

                    if (email && password && window.FB) {
                        const submitBtn = document.querySelector(".auth-submit");
                        if (submitBtn) submitBtn.textContent = "Conectando...";

                        if (isRegisterMode) {
                            window.FB.createUserWithEmailAndPassword(window.FB.auth, email, password)
                                .then(async (userCred) => {
                                    await window.FB.updateProfile(userCred.user, { displayName: userName });
                                    handleSuccessLogin(userName);
                                })
                                .catch(err => {
                                    showNotification("Error de registro: " + err.message, "error");
                                    if (submitBtn) submitBtn.textContent = "Reintentar";
                                });
                        } else {
                            window.FB.signInWithEmailAndPassword(window.FB.auth, email, password)
                                .then((userCred) => {
                                    const userObj = userCred.user;
                                    const dName = userObj.displayName || email.split("@")[0];
                                    handleSuccessLogin(dName);
                                })
                                .catch(err => {
                                    showNotification("Error de conexión: " + err.message, "error");
                                    if (submitBtn) submitBtn.textContent = "Reintentar";
                                });
                        }
                    }
                });

                async function handleSuccessLogin(displayName) {
                    const cleanName = syncAuthenticatedUI(displayName, { showWelcome: true });

                    if (window.FB && window.FB.auth.currentUser) {
                        try {
                            const userRef = window.FB.doc(window.FB.db, "leaderboard", window.FB.auth.currentUser.uid);
                            const snap = await window.FB.getDoc(userRef);
                            if (snap.exists()) {
                                const data = snap.data();
                                if (data.theme) {
                                    State.theme = normalizeThemeSelection(data.theme);
                                    localStorage.setItem("enarm_theme", State.theme);
                                    applyTheme(State.theme);
                                }
                                if (data.fontPreset) {
                                    State.fontPreset = normalizeFontPreset(data.fontPreset);
                                    localStorage.setItem(FONT_PRESET_STORAGE_KEY, State.fontPreset);
                                    applyFontPreset(State.fontPreset);
                                }
                                if (data.specialty !== undefined) {
                                    State.userSpecialty = data.specialty;
                                    localStorage.setItem("enarm_specialty", State.userSpecialty);
                                    if ($("profile-specialty")) $("profile-specialty").value = State.userSpecialty;
                                }
                                if (data.university !== undefined) {
                                    State.userUniversity = data.university;
                                    localStorage.setItem("enarm_university", State.userUniversity);
                                    if ($("profile-university")) $("profile-university").value = State.userUniversity;
                                }
                                if (data.isScorePublic !== undefined) {
                                    State.isScorePublic = data.isScorePublic !== false;
                                    localStorage.setItem("enarm_score_public", State.isScorePublic ? "1" : "0");
                                    if ($("profile-score-public-toggle")) $("profile-score-public-toggle").checked = !State.isScorePublic;
                                }
                                if (data.globalStatsStr) {
                                    State.globalStats = JSON.parse(data.globalStatsStr);
                                    localStorage.setItem("enarm_stats", data.globalStatsStr);
                                }
                                if (data.historyStr) {
                                    State.history = JSON.parse(data.historyStr);
                                    localStorage.setItem("enarm_history", data.historyStr);
                                }
                                if (data.reportsStr) {
                                    State.reportedQuestionsLocal = JSON.parse(data.reportsStr);
                                    localStorage.setItem("enarm_reports", data.reportsStr);
                                    mergeCloudAndLocalReports();
                                    refreshQuarantineKeys();
                                }
                                if (data.dailyPlanStr) {
                                    State.dailyPlan = JSON.parse(data.dailyPlanStr);
                                    localStorage.setItem("enarm_daily_plan", data.dailyPlanStr);
                                }
                                if (data.reviewQueueStr) {
                                    State.reviewQueue = JSON.parse(data.reviewQueueStr);
                                    localStorage.setItem("enarm_review_queue", data.reviewQueueStr);
                                }
                                if (data.topicMasteryStr) {
                                    State.topicMastery = JSON.parse(data.topicMasteryStr);
                                    localStorage.setItem("enarm_topic_mastery", data.topicMasteryStr);
                                }
                                if (data.caseNotebookStr) {
                                    State.caseNotebook = JSON.parse(data.caseNotebookStr);
                                    localStorage.setItem("enarm_case_notebook", data.caseNotebookStr);
                                }
                                if (data.studyCalendarStr) {
                                    State.studyCalendar = JSON.parse(data.studyCalendarStr);
                                    localStorage.setItem("enarm_study_calendar", data.studyCalendarStr);
                                }
                                if (data.lastPostmortemStr) {
                                    State.lastPostmortem = JSON.parse(data.lastPostmortemStr);
                                    localStorage.setItem("enarm_last_postmortem", data.lastPostmortemStr);
                                }
                                if (data.pomodoroSettingsStr) {
                                    State.pomodoroSettings = JSON.parse(data.pomodoroSettingsStr);
                                    localStorage.setItem(POMODORO_STORAGE_KEYS.settings, data.pomodoroSettingsStr);
                                }
                                if (data.pomodoroLogStr) {
                                    State.pomodoroLog = JSON.parse(data.pomodoroLogStr);
                                    localStorage.setItem(POMODORO_STORAGE_KEYS.log, data.pomodoroLogStr);
                                }
                                if (data.pomodoroSpecialtiesStr) {
                                    State.pomodoroSpecialties = JSON.parse(data.pomodoroSpecialtiesStr);
                                    localStorage.setItem(POMODORO_STORAGE_KEYS.specialties, data.pomodoroSpecialtiesStr);
                                }
                                if (typeof data.pomodoroFocusLabel === "string") {
                                    State.pomodoroFocusLabel = data.pomodoroFocusLabel;
                                    localStorage.setItem(POMODORO_STORAGE_KEYS.focus, data.pomodoroFocusLabel);
                                }
                            }
                            ensureStudySystemsState();
                            rebuildTopicMastery();
                            ensureDailyPlanFresh();
                            // Asegurar que el nombre (y otros datos locales) se sincronicen con la nube al entrar
                            saveGlobalStats();

                            // Refrescar las vistas de la app si recuperamos algo o si es un usuario nuevo
                            updateDashboardStats();
                            if (typeof updateCharts === 'function') updateCharts();
                            if (typeof initCalculator === 'function') initCalculator();
                        } catch (err) {
                            console.log("No se pudo cargar la nube: ", err);
                        }
                    }

                    initCloudFeatures();
                    // Note: setupChallengeLogic is already called from onAuthStateChanged callback.
                    // Do NOT call it again here to avoid duplicate event listeners.
                }

                const providerBtn = document.querySelector(".auth-provider-btn");
                if (providerBtn) {
                    providerBtn.addEventListener("click", async () => {
                        if (!window.FB) {
                            showNotification("Firebase no terminó de cargar. Reintenta.", "warning");
                            return;
                        }

                        const originalText = providerBtn.innerHTML;
                        providerBtn.disabled = true;
                        providerBtn.style.opacity = "0.7";
                        providerBtn.innerHTML = "Conectando con Google...";

                        const useRedirect = () => {
                            if (!window.FB.signInWithRedirect) {
                                throw new Error("Google redirect no disponible.");
                            }
                            showNotification("Redirigiendo a Google para iniciar sesión...", "info");
                            return window.FB.signInWithRedirect(window.FB.auth, window.FB.googleProvider);
                        };

                        try {
                            const result = await window.FB.signInWithPopup(window.FB.auth, window.FB.googleProvider);
                            const userObj = result.user;
                            let displayName = userObj.displayName;

                            if (!displayName) displayName = "Aspirante_" + Math.floor(Math.random() * 9999);
                            handleSuccessLogin(displayName);
                        } catch (error) {
                            const code = error && error.code ? String(error.code) : "";
                            const redirectSupport = getRedirectSupportState();
                            const canFallbackToRedirect = [
                                "auth/popup-blocked",
                                "auth/popup-closed-by-user",
                                "auth/cancelled-popup-request",
                                "auth/operation-not-supported-in-this-environment"
                            ].includes(code);

                            if (canFallbackToRedirect && redirectSupport.canUseRedirectFallback) {
                                try {
                                    await useRedirect();
                                    return;
                                } catch (redirectError) {
                                    console.error(redirectError);
                                    showNotification(getGoogleAuthErrorMessage(redirectError), "error");
                                    return;
                                }
                            }

                            if (canFallbackToRedirect && !redirectSupport.canUseRedirectFallback) {
                                const openInBrowserHint = redirectSupport.isStandalone
                                    ? " Abre ENARMlab desde Chrome y vuelve a intentar."
                                    : "";
                                showNotification(
                                    "Google no pudo abrirse con seguridad en este entorno porque el flujo redirect no está alineado con el dominio actual." + openInBrowserHint,
                                    "error"
                                );
                                console.error("Unsafe redirect fallback avoided:", {
                                    authDomain: redirectSupport.authHost,
                                    currentHost: redirectSupport.currentHost,
                                    isStandalone: redirectSupport.isStandalone,
                                    originalError: error
                                });
                                return;
                            }

                            showNotification(getGoogleAuthErrorMessage(error), "error");
                            console.error(error);
                        } finally {
                            providerBtn.disabled = false;
                            providerBtn.style.opacity = "1";
                            providerBtn.innerHTML = originalText;
                        }
                    });
                }
            }
        };

        if (window.FB) {
            // Already loaded via module
            setupFirebaseAuthAndUI();
        } else {
            // Wait for event
            window.addEventListener("firebaseLoaded", setupFirebaseAuthAndUI);
        }

        // Carga inicial de datos en el dashboard (ejecutado antes de validación cloud por si falla internet)
        updateDashboardStats();
        updateCharts();
    });
})();

// INIT DROPDOWN TIMEFRAME
window.dashboardOverviewTimeframe = 'all';
document.addEventListener('click', (e) => {
    const btn = e.target.closest('#overview-timeframe-btn');
    const menu = document.getElementById('overview-timeframe-menu');
    if (btn) {
        if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        return;
    }
    
    const menuItem = e.target.closest('.overview-tf-item');
    if (menuItem) {
        window.dashboardOverviewTimeframe = menuItem.getAttribute('data-tf');
        document.getElementById('overview-timeframe-label').textContent = menuItem.textContent;
        if (menu) menu.style.display = 'none';
        if (typeof updateDashboardStats === 'function') updateDashboardStats();
        return;
    }

    if (menu && !e.target.closest('#overview-timeframe-container')) {
        menu.style.display = 'none';
    }
});
