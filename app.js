﻿// app.js  Core logic for ENARMlab
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
                cir: { total: 0, correct: 0, name: "Cirugía General" },
                sp: { total: 0, correct: 0, name: "Salud Pública" },
                urg: { total: 0, correct: 0, name: "Urgencias" }
            }
        },

        userName: "Aspirante",
        userSpecialty: "",
        userUniversity: "",
        history: [],
        selectedTopics: [],
        reportedQuestions: [],
        reportedQuestionsLocal: [],
        myFriends: [],
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
        caseOverridesUnsub: null
    };

    const $ = (id) => document.getElementById(id);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));

    const ADMIN_UIDS = ["sZcIUjjhD0fze7FtirwsjsIDzLB2"];
    const DEMO_MAX_QTY = 30;
    const FIXED_CODE_EXPIRY = new Date(2026, 9, 1, 23, 59, 59);
    const ADMIN_PREVIEW_STORAGE_KEY = "enarm_admin_preview_mode";
    const DEMO_ALLOWED_THEMES = new Set(["dark", "light"]);

    // ---------------------------------------------------------------------------
    // Topic Normalization (Unificación de subtemas y GPCs)
    // ---------------------------------------------------------------------------
    const getUnifiedTopicName = (text) => {
        if (!text) return '';
        let t = text.trim();
        if (!t) return '';

        let lower = t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        if (lower.includes('ictericia') && (lower.includes('neonatal') || lower.includes('fisiologica') || lower.includes('patologica') || lower.includes('hiperbilirrubinemia') || lower.includes('leche materna'))) {
            return 'Ictericia Neonatal';
        }
        if (lower.includes('apendicitis')) return 'Apendicitis Aguda';
        if (lower.includes('colecistitis') || lower.includes('colelitiasis') || lower.includes('patologia biliar')) return 'Patología Biliar';
        if (lower.includes('hernia') && (lower.includes('inguinal') || lower.includes('umbilical') || lower.includes('pared abdominal') || lower.includes('crural'))) return 'Hernias de la Pared Abdominal';
        if (lower.includes('preeclampsia') || lower.includes('eclampsia') || lower.includes('hipertensivos del embarazo')) return 'Enfermedad Hipertensiva del Embarazo';
        if (lower.includes('infarto agudo') || lower.includes('iam') || lower.includes('cardiopatia isquemica')) return 'Cardiopatía Isquémica';
        if (lower.includes('diabetes mellitus') && !lower.includes('embarazo') && !lower.includes('gestacional')) return 'Diabetes Mellitus';
        if (lower.includes('diabetes gestacional') || (lower.includes('diabetes') && lower.includes('embarazo'))) return 'Diabetes Gestacional';
        if (lower.includes('hipotiroidismo')) return 'Hipotiroidismo';
        if (lower.includes('hipertiroidismo')) return 'Hipertiroidismo';
        if (lower.includes('fractura')) return 'Fracturas';
        if (lower.includes('quemadura')) return 'Quemaduras';
        if (lower.includes('asma')) return 'Asma';
        if (lower.includes('epoc') || lower.includes('enfermedad pulmonar obstructiva')) return 'EPOC';
        if (lower.includes('vih') || lower.includes('sida')) return 'VIH / SIDA';
        if (lower.includes('tuberculosis')) return 'Tuberculosis';
        if (lower.includes('neumonia')) return 'Neumonías';
        const lupusKey = lower.replace(/[^a-z0-9]+/g, ' ').trim();
        if (lupusKey.includes('lupus') || /\bles\b/.test(lupusKey)) return 'Lupus Eritematoso Sistémico';
        if (lower.includes('artritis reumatoide')) return 'Artritis Reumatoide';
        if (lower.includes('covid') || lower.includes('sars-cov-2')) return 'COVID-19';
        if (lower.includes('endometriosis')) return 'Endometriosis';
        if (lower.includes('hemorragia') && lower.includes('obstetrica')) return 'Hemorragia Obstétrica';

        // Eliminar prefijos de GPC, NOM y palabras de relleno
        let cleaned = t.replace(/^(GPC|NOM-[\w\-]+([,\s]*(Para\s*la|Para\s*el))?)\s*(?:Diagn[oó]stico[,\s]*|Tratamiento[,\s]*|Manejo[,\s]*|Prevenci[oó]n[,\s]*|Control[,\s]*|Atenci[oó]n[,\s]*|y\s*)*\s*(de\s*la\s*|del\s*|de\s*el\s*|de\s*las\s*|de\s*los\s*|de\s*|en\s*la\s*|en\s*el\s*|en\s*)?/i, '')
            .replace(/\.$/, '').trim();

        if (cleaned !== t && cleaned.length > 3) {
            cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
            return cleaned;
        }

        return t;
    };

    // Normalizar la base de datos de preguntas cargada en questions.js globalmente
    if (typeof QUESTIONS !== 'undefined' && Array.isArray(QUESTIONS)) {
        QUESTIONS.forEach(q => {
            if (q.tema) q.tema = getUnifiedTopicName(q.tema);
            if (q.subtema) q.subtema = getUnifiedTopicName(q.subtema);
            if (q.gpcReference) q.gpcReference = getUnifiedTopicName(q.gpcReference);
        });
    }

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

    const updatePremiumStatusLabel = () => {
        const el = $("profile-premium-status");
        if (!el) return;
        if (isAdminUser()) {
            el.value = State.adminPreviewMode === "demo" ? "Admin (vista demo)" : "Admin (vista premium)";
            return;
        }
        if (!State.entitlement || !isPremiumActive()) {
            el.value = "Demo";
            return;
        }
        if (!State.entitlement.expiresAt) {
            el.value = "Premium activo";
            return;
        }
        el.value = `Premium activo hasta ${formatDate(State.entitlement.expiresAt)}`;
    };

    const syncPremiumUI = () => {
        updatePremiumStatusLabel();
        const premium = isPremiumActive();
        const qtySlider = $("setup-qty-slider");
        const qtyVal = $("setup-qty-val");
        if (qtySlider) {
            const max = premium ? 280 : DEMO_MAX_QTY;
            qtySlider.max = String(max);
            if (parseInt(qtySlider.value, 10) > max) {
                qtySlider.value = String(max);
                if (qtyVal) qtyVal.textContent = String(max);
            }
        }
        if (!premium) {
            const activePreset = document.querySelector(".preset-card.active");
            if (activePreset && activePreset.dataset.premium === "1") {
                const flash = $("preset-flash");
                if (flash) {
                    $$(".preset-card").forEach(c => c.classList.remove("active"));
                    flash.classList.add("active");
                    State.selectedPresetId = flash.id || null;
                    const q = flash.dataset.qty;
                    const t = flash.dataset.time;
                    if (qtySlider && q) {
                        qtySlider.value = q;
                        if (qtyVal) qtyVal.textContent = q;
                    }
                    const timeInput = $("setup-time-minutes");
                    const timeLabel = $("setup-time-label");
                    const libBtn = $("time-libre-btn");
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
            const selectedTheme = circle.dataset.theme || "dark";
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
            const lockReason = "Los temas/GPC específicos son premium.";
            topicInput.classList.toggle("demo-locked", !premium);
            topicInput.readOnly = !premium;
            topicInput.title = !premium ? lockReason : "";
            topicInput.placeholder = !premium
                ? "Disponible en premium"
                : (topicInput.dataset.defaultPlaceholder || "Buscar tema");
            if (!premium && !topicInput.dataset.lockBound) {
                const redirectToPremium = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openRedeemModal(lockReason);
                };
                topicInput.addEventListener("focus", redirectToPremium);
                topicInput.addEventListener("click", redirectToPremium);
                topicInput.dataset.lockBound = "1";
            }
        }
        if (topicCont) topicCont.classList.toggle("demo-locked", !premium);
        if (!premium && State.selectedTopics.length > 0) {
            State.selectedTopics = [];
            if (topicCont) topicCont.innerHTML = "";
        }

        const btnCreate = $("btn-create-challenge");
        if (btnCreate) {
            const enabled = premium;
            btnCreate.disabled = !enabled;
            btnCreate.style.opacity = enabled ? "1" : "0.6";
            btnCreate.style.cursor = enabled ? "pointer" : "not-allowed";
        }
        if (!premium && !DEMO_ALLOWED_THEMES.has(State.theme || "dark")) {
            State.theme = "dark";
            localStorage.setItem("enarm_theme", "dark");
            applyTheme("dark");
        }
        const adminPanel = $("admin-codes-panel");
        if (adminPanel) adminPanel.style.display = isAdminUser() ? "block" : "none";

        const adminPreviewPanel = $("admin-preview-panel");
        if (adminPreviewPanel) adminPreviewPanel.style.display = isAdminUser() ? "block" : "none";
        $$(".admin-preview-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.adminPreview === State.adminPreviewMode);
        });
    };

    const openRedeemModal = (reason) => {
        const modal = $("redeem-modal");
        const reasonEl = $("redeem-reason");
        const legalCheck = $("redeem-legal-check");
        const btnRedeem = $("btn-redeem-submit");
        if (reasonEl && reason) reasonEl.textContent = reason;
        if (legalCheck) legalCheck.checked = false;
        if (btnRedeem) btnRedeem.disabled = true;
        if (modal) modal.style.display = "flex";
    };

    const closeRedeemModal = () => {
        const modal = $("redeem-modal");
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
            if (entry && entry.specialty) q.specialty = entry.specialty;
            else if (q.specialtyOriginal !== undefined) q.specialty = q.specialtyOriginal;
            if (entry && entry.caseText) q.case = entry.caseText;
            else if (q.caseOriginal !== undefined) q.case = q.caseOriginal;
        });
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
            if (entry && entry.specialty) q.specialty = entry.specialty;
            else if (q.specialtyOriginal !== undefined) q.specialty = q.specialtyOriginal;
            if (entry && entry.caseText) q.case = entry.caseText;
            else if (q.caseOriginal !== undefined) q.case = q.caseOriginal;
        });
    };

    const canReclassifyUser = () => {
        return isAdminUser();
    };

    const syncReclassAccessUI = () => {
        const allowed = canReclassifyUser();
        const item = $("mas-reclass-item");
        if (item) item.style.display = allowed ? "flex" : "none";
        const content = $("reclassify-content");
        const locked = $("reclassify-locked");
        if (content) content.style.display = allowed ? "block" : "none";
        if (locked) locked.style.display = allowed ? "none" : "block";
        const deleteBtn = $("btn-reclass-delete");
        if (deleteBtn) deleteBtn.style.display = allowed ? "inline-flex" : "none";
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
                <option value="sp">Salud Publica</option>
                <option value="urg">Urgencias</option>
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

    const renderReclassifyView = () => {
        syncReclassAccessUI();
        if (!canReclassifyUser()) return;
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

    const formatTime = (secs) => {
        const h = String(Math.floor(secs / 3600)).padStart(2, "0");
        const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
        const s = String(secs % 60).padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    const shuffleArray = (arr) => arr.slice().sort(() => Math.random() - 0.5);

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

    const calcSpecDifficultyTargets = (count) => {
        const easy = Math.round(count * 0.25);
        const medium = Math.round(count * 0.5);
        const hard = Math.max(0, count - easy - medium);
        return { easy, medium, hard };
    };

    const buildRealSimulacroQuestionSet = () => {
        const allowedSpecs = Object.keys(REAL_SIM_CONFIG.specs);
        const flat = [];
        let groupId = 1;
        let qid = 1;

        if (typeof QUESTIONS === "undefined" || !Array.isArray(QUESTIONS)) {
            return { questionSet: [], warnings: ["No se encontro banco de preguntas."] };
        }

        QUESTIONS.forEach(c => {
            if (!allowedSpecs.includes(c.specialty)) return;
            const key = getCaseKey(c);
            if (key) {
                if (State.quarantineKeys && State.quarantineKeys.has(key)) return;
                if (State.deletedCaseKeys && State.deletedCaseKeys.has(key)) return;
            }
            const subs = (c.questions && Array.isArray(c.questions))
                ? c.questions
                : [{ question: c.question, options: c.options, answerIndex: c.answerIndex, explanation: c.explanation }];
            subs.forEach((sq) => {
                flat.push({
                    ...c,
                    question: sq.question,
                    options: sq.options,
                    answerIndex: sq.answerIndex,
                    explanation: sq.explanation,
                    caseGroupId: groupId,
                    subQuestionIndex: 1,
                    totalSubQuestions: 1,
                    _qid: qid++,
                    _difficultyBucket: normalizeDifficultyBucket(c.difficulty)
                });
                groupId++;
            });
        });

        const bySpec = {
            ped: [],
            mi: [],
            cir: [],
            gyo: []
        };
        flat.forEach(q => {
            if (bySpec[q.specialty]) bySpec[q.specialty].push(q);
        });

        const selected = [];
        const used = new Set();
        const warnings = [];

        const takeRandom = (arr, n) => {
            const picks = shuffleArray(arr).slice(0, n);
            picks.forEach(p => {
                used.add(p._qid);
                selected.push(p);
            });
            return n - picks.length;
        };

        const pickForSpec = (specKey, targetCount) => {
            const pool = bySpec[specKey] || [];
            const targets = calcSpecDifficultyTargets(targetCount);
            const easy = pool.filter(q => q._difficultyBucket === "easy");
            const medium = pool.filter(q => q._difficultyBucket === "medium");
            const hard = pool.filter(q => q._difficultyBucket === "hard");

            let missingEasy = takeRandom(easy, targets.easy);
            let missingMed = takeRandom(medium, targets.medium);
            let missingHard = takeRandom(hard, targets.hard);

            let remaining = missingEasy + missingMed + missingHard;
            if (remaining > 0) {
                const leftovers = pool.filter(q => !used.has(q._qid));
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
            const remaining = flat.filter(q => !used.has(q._qid));
            const missing = REAL_SIM_CONFIG.total - selected.length;
            takeRandom(remaining, missing);
            if (missing > 0) warnings.push("No se pudo completar el total de 280 preguntas con el banco actual.");
        } else if (selected.length > REAL_SIM_CONFIG.total) {
            const trimmed = shuffleArray(selected).slice(0, REAL_SIM_CONFIG.total);
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
        const shuffledCases = shuffleArray([...rawPool]);
        let flat = [];
        let cId = 1;
        for (let c of shuffledCases) {
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

    const PREMIUM_VIEWS = new Set(["view-comunidad", "view-reportes", "view-refuerzos"]);

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
        if (viewId === "view-dashboard") {
            updateDashboardStats();
            updateCharts();
        }
        if (viewId === "view-historial") updateHistoryView();
        if (viewId === "view-estadisticas") updateCharts();
        if (viewId === "view-calculadora") initCalculator();
        if (viewId === "view-temario") renderOfficialTemario();
        if (viewId === "view-reportes") renderReportedQuestions();
        if (viewId === "view-reclassify") renderReclassifyView();
    };
    window.showView = showView; // Hacerla global para onclick de HTML
    window.openFeedbackEmail = openFeedbackEmail;
    window.copyFeedbackToClipboard = copyFeedbackToClipboard;

    const saveGlobalStats = () => {
        localStorage.setItem("enarm_stats", JSON.stringify(State.globalStats));
        localStorage.setItem("enarm_history", JSON.stringify(State.history));
        localStorage.setItem("enarm_user", State.userName);
        localStorage.setItem("enarm_specialty", State.userSpecialty || "");
        localStorage.setItem("enarm_university", State.userUniversity || "");
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
                score: avg,
                answered: totalq,
                flame: State.history.length || 0,
                lastUpdate: new Date(),
                theme: State.theme || "dark",
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

        const theme = localStorage.getItem("enarm_theme");
        if (theme) {
            State.theme = theme;
            applyTheme(theme);
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

        $$(".user-avatar").forEach(el => {
            el.innerHTML = `<span style="font-size: 14px; font-weight: 700;">${initials}</span>`;
            el.style.background = "rgba(5, 192, 127, 0.1)";
            el.style.color = "var(--accent-green)";
            el.style.display = "flex";
            el.style.alignItems = "center";
            el.style.justifyContent = "center";
        });
        const statusEl = document.querySelector(".user-status");
        if (statusEl) statusEl.textContent = "EN LÍNEA";
        syncReclassAccessUI();
        syncPremiumUI();
    };

    const applyTheme = (theme) => {
        // Remove all current theme classes
        document.body.classList.remove("light-mode", "theme-forest", "theme-ocean", "theme-sunset", "theme-premium", "theme-premium-pink");

        if (theme === "system") {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                document.body.classList.add("light-mode");
            }
        } else if (theme === "light") {
            document.body.classList.add("light-mode");
        } else if (theme === "forest") {
            document.body.classList.add("theme-forest");
        } else if (theme === "ocean") {
            document.body.classList.add("theme-ocean");
        } else if (theme === "sunset") {
            document.body.classList.add("theme-sunset");
        } else if (theme === "premium") {
            document.body.classList.add("theme-premium");
        } else if (theme === "premium-pink") {
            document.body.classList.add("theme-premium-pink");
        }
        // "dark" is the default, no class needed

        // Update Theme Circles Active State
        $$(".theme-circle").forEach(circle => {
            circle.classList.remove("active");
            if (circle.dataset.theme === theme || (theme === "system" && circle.dataset.theme === "dark")) {
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
            toggleBtn.addEventListener("click", () => {
                sidebar.classList.toggle("collapsed");
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
        "5ta enfermedad (Enfermedades Exantemáticas)",
        "6ta enfermedad (Enfermedades Exantemáticas)",
        "A. duodenal (Patología Neonatal)",
        "A. esofágica (Patología Neonatal)",
        "A. pilórica (Patología Neonatal)",
        "ACLS y BLS",
        "ATLS",
        "Abdomen agudo (Introducción a Cirugía y Cirugía Abdominal)",
        "Abdomen agudo (Patología Esofágica)",
        "Aborto (Hemorragias del Primer Trimestre)",
        "Absceso periamigdalino y faríngeo (Patología Infecciosa / Rinología y Faringe)",
        "Abscesos (Patología Perianal)",
        "Abscesos renales (Nefrología)",
        "Abscesos renales (Psiquiatría)",
        "Acné (Infecto Derma)",
        "Acretismo placentario (Hemorragias del Segundo Trimestre)",
        "Adenomiosis (Sangrados Uterinos Anormales: Origen Anatómico No Maligno)",
        "Adicciones (Psiquiatría)",
        "Alacranismo (Mordeduras y Picaduras)",
        "Alimentación (Crecimiento y Desarrollo)",
        "Alteraciones Cromosómicas y Perlas",
        "Alteraciones dermatológicas al nacimiento (Recién Nacido Sano)",
        "Alzheimer (Demencias)",
        "Amenorreas Primarias y Secundarias",
        "Ametropías (Introducción Oftalmología)",
        "Anemia falciforme (Anemias Hemolíticas)",
        "Anemia ferropénica (Anemias Introducción y Anemias Carenciales)",
        "Anemia megaloblástica (Anemias Introducción y Anemias Carenciales)",
        "Anemias Hemolíticas",
        "Anemias Introducción y Anemias Carenciales",
        "Anemias autoinmunes (Anemias Hemolíticas)",
        "Anemias carenciales (Anemias Introducción y Anemias Carenciales)",
        "Angina estable e inestable (Síndromes Coronarios)",
        "Anomalía de Ebstein (Cardiopedia)",
        "Anormalidades de la Hemostasia y Perlas",
        "Antebrazo y mano (Patología de Extremidad Superior)",
        "Antibióticos (Introducción MI / Introducción Infectología)",
        "Anticolinérgico (Intoxicaciones)",
        "Apendicitis",
        "Apnea del prematuro (Patología Respiratoria del Pediátrico)",
        "Artritis reumatoide (Reumatología)",
        "Asbestosis (Neumonías Ocupacionales / Derrame Pleural)",
        "Ascaris (Enfermedades Parasitarias)",
        "Ascitis (Cirrosis y sus Complicaciones / Trasplante Hepático)",
        "Asfixia (Patología Neonatal)",
        "Asma en el Adulto y Pediátrico",
        "Astrocitoma (Especialidades Pedia)",
        "Atresia de las coanas (Patología Neonatal)",
        "Atresia de vías biliares (Ictericia Neonatal)",
        "Atípicas: en el adulto y pediátrico (Neumonías)",
        "Autismo (Psiquiatría)",
        "Bacterianas (Neumonías)",
        "Bisinosis (Neumonías Ocupacionales / Derrame Pleural)",
        "Blefaritis (Introducción Oftalmología)",
        "Bronquiolitis (Patología Respiratoria del Lactante y Preescolar)",
        "Brucelosis (Enfermedades por Zoonosis)",
        "CA basocelular (Oncoderma)",
        "CA de Próstata / Tumores Testiculares",
        "CA de colon y recto (Cirugía Oncología)",
        "CA de endometrio y CA de ovario (Oncología Ginecológica)",
        "CA de esófago (Cirugía Oncología)",
        "CA de laringe (Patología Infecciosa / Rinología y Faringe)",
        "CA de vagina y vulvar (Oncología Ginecológica)",
        "CA espinocelular (Oncoderma)",
        "CA hepático (Cirugía Oncología)",
        "CA renal (Cirugía Oncología)",
        "CACU (Oncología Ginecológica)",
        "Carbunco (Enfermedades por Zoonosis)",
        "Cardiopatías acianógenas CIV, CIA, PCA, estenosis de la arteria pulmonar (Cardiopedia)",
        "Cardiopatías cianógenas TF, tronco arterioso común (Cardiopedia)",
        "Cardiopedia",
        "Catarata (Patología Cámara Posterior)",
        "Cefalea en racimos (Cefaleas)",
        "Cefalea tensional (Cefaleas)",
        "Cefalea trigémino autonómica (Cefaleas)",
        "Cefaleas",
        "Cefalohematoma (Recién Nacido Sano)",
        "Celulitis periorbitaria (Introducción Oftalmología)",
        "Cervicovaginitis bacteriana (Patología Infecciosa Cervical)",
        "Cesárea (Patología de Trabajo de Parto)",
        "Cetoacidosis (Complicaciones Diabetes)",
        "Chagas (Enfermedades Transmitidas por Vector)",
        "Chalazión (Introducción Oftalmología)",
        "Chancro (ETS)",
        "Chancroide (ETS)",
        "Chikungunya (Enfermedades Transmitidas por Vector)",
        "Choque (ATLS)",
        "Choque en la paciente embarazada (Patología Puerperal)",
        "Choque séptico (Introducción MI / Introducción Infectología)",
        "Ciclo Genital / Esterilidad / Anticonceptivos",
        "Cirrosis y sus Complicaciones / Trasplante Hepático",
        "Cirugía Oncología",
        "Clase de Inglés",
        "Coagulopatías (Sangrados Uterinos Anormales: Origen No Anatómico)",
        "Cojera (Especialidades Pedia)",
        "Colangitis (Patología Biliar)",
        "Colecistitis (Patología Biliar)",
        "Coledocolitiasis (Patología Biliar)",
        "Colelitiasis (Patología Biliar)",
        "Colinérgico (Intoxicaciones)",
        "Colitis ulcerosa (Patología Intestinal Inflamatoria)",
        "Coma mixedematoso (Patología Tiroidea)",
        "Complicaciones Diabetes",
        "Conjuntivitis (Patología Cámara Anterior)",
        "Consulta del niño sano (Crecimiento y Desarrollo)",
        "Consultas prenatales (Control Prenatal)",
        "Control Prenatal",
        "Corioamnionitis (Parto Prematuro y Patología Coriónica)",
        "Crecimiento (Crecimiento y Desarrollo)",
        "Crecimiento y Desarrollo",
        "Cuidados del recién nacido (Recién Nacido Sano)",
        "Cáncer de Mama",
        "Cáncer de tiroides (Patología Tiroidea)",
        "Cándida (Patología Infecciosa Cervical)",
        "DPPNI (Hemorragias del Segundo Trimestre)",
        "Dacrioadenitis (Introducción Oftalmología)",
        "Deficiencia de biotinidasa (Tamiz Metabólico)",
        "Deficiencia de glucosa 6 fosfato (Anemias Hemolíticas)",
        "Delirium tremens (Psiquiatría)",
        "Demencia frontotemporal (Demencias)",
        "Demencia por cuerpos de Lewis (Demencias)",
        "Demencias",
        "Dengue (Enfermedades Transmitidas por Vector)",
        "Depresión materna (Control Prenatal)",
        "Dermatitis del pañal (Especialidades Pedia)",
        "Dermatitis seborreica (Especialidades Pedia)",
        "Desnutrición (Crecimiento y Desarrollo)",
        "Desprendimiento de retina (Patología Cámara Posterior)",
        "Diabetes",
        "Diabetes insípida (Patología Central y Suprarrenal)",
        "Diagnóstico cromosomopatías (Control Prenatal)",
        "Diarrea en el Pediátrico",
        "Diarrea enteroinvasiva (Diarreas Agudas y Crónicas)",
        "Diarreas Agudas y Crónicas",
        "Difteria (IRAs / Convulsiones)",
        "Dispepsia funcional (Patología Gástrica)",
        "Displasia (Patología Respiratoria del Pediátrico)",
        "Distocias (Patología de Trabajo de Parto)",
        "Diverticulitis (Patología Diverticular)",
        "Diverticulosis (Patología Diverticular)",
        "Divertículo de Meckel (Patología Gastrointestinal del Pediátrico)",
        "Drenaje pulmonar venoso anómalo (Cardiopedia)",
        "Déficits vitamínicos (Crecimiento y Desarrollo)",
        "E. histolytica (Enfermedades Parasitarias)",
        "EA (Patología Infecciosa / Rinología y Faringe)",
        "EHI (Patología Neonatal)",
        "ELA (Trastornos del Movimiento / Enf. Neurodegenerativas)",
        "EMH (Patología Respiratoria del Pediátrico)",
        "EPOC / CA de Pulmón",
        "ERGE (Patología Gastrointestinal del Pediátrico)",
        "ETS",
        "EVC Isquémico y Hemorrágico",
        "Eclampsia (Patología del Embarazo: Estados Hipertensivos)",
        "Edo Hiperosmolar (Complicaciones Diabetes)",
        "Embarazo ectópico (Hemorragias del Primer Trimestre)",
        "Embarazo gemelar (Patología de Trabajo de Parto)",
        "Embolia grasa (Trauma Generalidades y Complicaciones)",
        "Encefalopatía hepática (Cirrosis y sus Complicaciones / Trasplante Hepático)",
        "Endocarditis (Infecto Cardio y Perlas)",
        "Endocervicitis (Patología Infecciosa Cervical)",
        "Endometriosis (Sangrados Uterinos Anormales: Origen No Anatómico)",
        "Enf. Celíaca (Diarreas Agudas y Crónicas)",
        "Enf. Lyme (Enfermedades por Zoonosis)",
        "Enf. Trofoblástica (Hemorragias del Primer Trimestre)",
        "Enf. de Hirschsprung (Patología Gastrointestinal del Pediátrico)",
        "Enf. de Von Willebrand (Anormalidades de la Hemostasia y Perlas)",
        "Enfermedad (Hipoacusia y Vértigo)",
        "Enfermedad Mano Boca Pie (Enfermedades Exantemáticas)",
        "Enfermedad arterial periférica (Patología Arterial y Venosa)",
        "Enfermedad crónica (Anemias Introducción y Anemias Carenciales)",
        "Enfermedad de Addison (Patología Central y Suprarrenal)",
        "Enfermedad de Crohn (Patología Intestinal Inflamatoria)",
        "Enfermedad de Kawasaki (Enfermedades Exantemáticas)",
        "Enfermedad diverticular (Patología Diverticular)",
        "Enfermedad hepática grasa (Patología Hepática)",
        "Enfermedad pélvica inflamatoria (Patología Infecciosa Cervical)",
        "Enfermedades Exantemáticas",
        "Enfermedades Parasitarias",
        "Enfermedades Transmitidas por Vector",
        "Enfermedades por Zoonosis",
        "Enterocolitis necrotizante (Patología Neonatal Infecciosa)",
        "Epidemiología",
        "Epididimitis (Uropedia)",
        "Epiescleritis (Patología Cámara Anterior)",
        "Epiglotitis (Patología Respiratoria del Lactante y Preescolar)",
        "Escabiosis (Enfermedades Parasitarias)",
        "Escalas geriátricas (Geriatría)",
        "Escarlatina (Enfermedades Exantemáticas)",
        "Escleritis (Patología Cámara Anterior)",
        "Esclerosis múltiple (Trastornos del Movimiento / Enf. Neurodegenerativas)",
        "Esferocitosis hereditaria (Anemias Hemolíticas)",
        "Esguince de tobillo (Patología de Extremidad Inferior)",
        "Especialidades Pedia",
        "Espina bífida (Patología Neonatal)",
        "Espondilopatías (Reumatología)",
        "Esprue (Cirrosis y sus Complicaciones / Trasplante Hepático)",
        "Esquizofrenia (Psiquiatría)",
        "Estenosis Hipertrófica del Píloro",
        "Estenosis aórtica y mitral (Valvulopatías)",
        "Exploración física (Introducción a Cirugía y Cirugía Abdominal)",
        "Exploración física (Patología Esofágica)",
        "Faringoamigdalitis (IRAs / Convulsiones)",
        "Fenilcetonuria (Tamiz Metabólico)",
        "Fibrilación auricular (Trastornos del Ritmo)",
        "Fibrilación ventricular (Trastornos del Ritmo)",
        "Fibroadenoma (Patología Mamaria Benigna)",
        "Fibromialgia (Reumatología)",
        "Fibrosis quística (Tamiz Metabólico)",
        "Filariasis (Enfermedades Parasitarias)",
        "Fisiología del embarazo (Control Prenatal)",
        "Fisiológica (Ictericia Neonatal)",
        "Fisiológico (Trabajo de Parto)",
        "Fisuras (Patología Perianal)",
        "Flutter auricular (Trastornos del Ritmo)",
        "Fx de brazo (Patología de Extremidad Superior)",
        "Fx de cadera (Patología de Extremidad Inferior)",
        "Fx de extremidades inferiores (Patología de Extremidad Inferior)",
        "Fx en rama verde (Trauma Generalidades y Complicaciones)",
        "Fístulas (Patología Perianal)",
        "Galactosemia (Tamiz Metabólico)",
        "Gastritis aguda o crónica (Patología Gástrica)",
        "Gastrosquisis (Patología Neonatal)",
        "Generalidades (Introducción Oftalmología)",
        "Geriatría",
        "Giardiasis (Enfermedades Parasitarias)",
        "Ginecología y Obstetricia",
        "Glaucoma (Patología Cámara Posterior)",
        "Granulomatosis (Reumatología)",
        "Gástrico (Cirugía Oncología)",
        "Hashimoto (Patología Tiroidea)",
        "Hematopedia: Púrpura de Henoch Schonlein (Especialidades Pedia)",
        "Hemofilia (Anormalidades de la Hemostasia y Perlas)",
        "Hemorragia de matriz germinal (Patología Neonatal)",
        "Hemorragia obstétrica Atonía, trauma, tejido, coagulopatías (Patología Puerperal)",
        "Hemorragias del Primer Trimestre",
        "Hemorragias del Segundo Trimestre",
        "Hemorroides (Patología Perianal)",
        "Hepatitis agudas y crónicas (Patología Hepática)",
        "Hernias / Esplenectomía",
        "Hernias diafragmáticas (Patología Neonatal)",
        "Herpangina (Enfermedades Exantemáticas)",
        "Herpes (ETS)",
        "Herpes y VIH el binomio (Patología Neonatal Congénita Infecciosa)",
        "Hiperplasia prostática (Patología Prostática)",
        "Hiperplasia suprarrenal (Tamiz Metabólico)",
        "Hiperprolactinemia (Patología Central y Suprarrenal)",
        "Hipertensión Arterial",
        "Hipertensión crónica en el embarazo (Patología del Embarazo: Estados Hipertensivos)",
        "Hipertensión gestacional (Patología del Embarazo: Estados Hipertensivos)",
        "Hipertensión pulmonar (Patología Respiratoria del Pediátrico)",
        "Hipertiroidismo: Enfermedad de Graves (Patología Tiroidea)",
        "Hiperémesis gravídica (Control Prenatal)",
        "Hipoacusia neurosensorial (Hipoacusia y Vértigo)",
        "Hipoacusia y Vértigo",
        "Hipotiroidismo (Tamiz Metabólico)",
        "Hipotiroidismo (Patología Tiroidea)",
        "Hitos del desarrollo (Crecimiento y Desarrollo)",
        "IRAs / Convulsiones",
        "IVUs (Uropedia)",
        "Ictericia Neonatal",
        "Ictericia por problemas del metabolismo hepático (Ictericia Neonatal)",
        "Incompatibilidad grupo Rh (Control Prenatal)",
        "Incompatibilidad sanguínea (Ictericia Neonatal)",
        "Incontinencia urinaria (Patología Menopausia y Climaterio)",
        "Inducción de trabajo de parto (Patología de Trabajo de Parto)",
        "Infarto agudo al miocardio (Síndromes Coronarios)",
        "Infección de vías urinarias bajas y altas (Urología)",
        "Infecto Cardio y Perlas",
        "Infecto Derma",
        "Ingesta de cáusticos (Urgencias Pediátricas)",
        "Ingesta de metales pesados (Urgencias Pediátricas)",
        "Insuficiencia Cardíaca Aguda y Crónica",
        "Insuficiencia arterial aguda (Patología Arterial y Venosa)",
        "Insuficiencia aórtica (Valvulopatías)",
        "Insuficiencia suprarrenal (Patología Central y Suprarrenal)",
        "Intoxicaciones",
        "Intoxicaciones alimentarias (Diarreas Agudas y Crónicas)",
        "Intoxicaciones por ASA y paracetamol (Urgencias Pediátricas)",
        "Introducción (ATLS)",
        "Introducción Cardiología",
        "Introducción MI / Introducción Infectología",
        "Introducción Oftalmología",
        "Introducción a Cirugía y Cirugía Abdominal",
        "Introducción diarreas (Diarrea en el Pediátrico)",
        "Invaginación intestinal (Patología Gastrointestinal del Pediátrico)",
        "Isquemia mesentérica aguda y crónica (Patología Isquémica Intestinal)",
        "LES (Reumatología)",
        "LLA (Leucemias)",
        "LMA (Leucemias)",
        "LMC (Leucemias)",
        "Laringotraqueítis (Patología Respiratoria del Lactante y Preescolar)",
        "Laringotraqueítis bacteriana (Patología Respiratoria del Lactante y Preescolar)",
        "Latrodectismo (Mordeduras y Picaduras)",
        "Lepra (Infecto Derma)",
        "Leucemias",
        "Linfogranuloma venéreo (ETS)",
        "Linfoma Hodgkin (Oncohematología)",
        "Linfoma No Hodgkin (Oncohematología)",
        "Liquen plano (Patología Dermatológica)",
        "Litiasis renal (Urología)",
        "Loxoscelismo (Mordeduras y Picaduras)",
        "Malaria (Enfermedades Transmitidas por Vector)",
        "Malf. anorrectales (Patología Neonatal)",
        "Malf. congénitas (Patología Neonatal)",
        "Maltrato infantil (Crecimiento y Desarrollo)",
        "Manejo de vía aérea (ATLS)",
        "Maniobras de Leopold (Control Prenatal)",
        "Mastitis puerperal y no puerperal (Patología Mamaria Benigna)",
        "Mastopatía fibroquística (Patología Mamaria Benigna)",
        "Materna (Ictericia Neonatal)",
        "Melanoma (Oncoderma)",
        "Meningitis (Patología Neonatal Infecciosa)",
        "Menopausia (Patología Menopausia y Climaterio)",
        "Miastenia gravis (Trastornos del Movimiento / Enf. Neurodegenerativas)",
        "Migraña (Cefaleas)",
        "Miocardiopatía hipertrófica (Infecto Cardio y Perlas)",
        "Miocarditis (Infecto Cardio y Perlas)",
        "Miomatosis (Sangrados Uterinos Anormales: Origen Anatómico No Maligno)",
        "Mitral (Valvulopatías)",
        "Molusco contagioso (Especialidades Pedia)",
        "Mononucleosis (IRAs / Convulsiones)",
        "Mordedura de serpientes (Mordeduras y Picaduras)",
        "Mordeduras y Picaduras",
        "Muerte súbita (Crecimiento y Desarrollo)",
        "Nefroblastoma (Especialidades Pedia)",
        "Nefrología",
        "Neumonitis por carbón (Neumonías Ocupacionales / Derrame Pleural)",
        "Neumonía (Patología Neonatal Infecciosa)",
        "Neumonías",
        "Neumonías Ocupacionales / Derrame Pleural",
        "Neuronitis vestibular (Hipoacusia y Vértigo)",
        "Neuropatía diabética (Complicaciones Diabetes)",
        "OM2 (Patología del Embarazo)",
        "OMA (Patología Infecciosa / Rinología y Faringe)",
        "Obesidad (Crecimiento y Desarrollo)",
        "Obstrucción de la vía aérea superior (Urgencias Pediátricas)",
        "Obstrucción intestinal (Patología Intestinal Qx)",
        "Oligohidramnios (Parto Prematuro y Patología Coriónica)",
        "Oncoderma",
        "Oncohematología",
        "Oncología Ginecológica",
        "Oncopedia: Neuroblastoma (Especialidades Pedia)",
        "Onfalitis (Patología Neonatal Infecciosa)",
        "Onfalocele (Patología Neonatal)",
        "Opioide (Intoxicaciones)",
        "Orzuelo (Introducción Oftalmología)",
        "Osteoartritis (Reumatología)",
        "Osteoporosis (Patología Menopausia y Climaterio)",
        "Osteosarcoma (Especialidades Pedia)",
        "Otitis media maligna (Patología Infecciosa / Rinología y Faringe)",
        "Otoesclerosis (Hipoacusia y Vértigo)",
        "Oxiuriasis (Enfermedades Parasitarias)",
        "Paladar hendido (Patología Neonatal)",
        "Paludismo (Enfermedades Transmitidas por Vector)",
        "Pancreatitis aguda y crónica (Patología Pancreática)",
        "Papiloma intraductal (Patología Mamaria Benigna)",
        "Papilomatosis laríngea (Patología Infecciosa / Rinología y Faringe)",
        "Parkinson (Trastornos del Movimiento / Enf. Neurodegenerativas)",
        "Parto Prematuro y Patología Coriónica",
        "Parto prematuro (Parto Prematuro y Patología Coriónica)",
        "Parálisis braquial (Recién Nacido Sano)",
        "Parálisis flácida Sx de Guillain Barré (Trastornos del Movimiento / Enf. Neurodegenerativas)",
        "Patología Arterial y Venosa",
        "Patología Biliar",
        "Patología Central y Suprarrenal",
        "Patología Cámara Anterior",
        "Patología Cámara Posterior",
        "Patología Dermatológica",
        "Patología Diverticular",
        "Patología Esofágica",
        "Patología Gastrointestinal del Pediátrico",
        "Patología Gástrica",
        "Patología Hepática",
        "Patología Infecciosa / Rinología y Faringe",
        "Patología Infecciosa Cervical",
        "Patología Intestinal Inflamatoria",
        "Patología Intestinal Qx",
        "Patología Isquémica Intestinal",
        "Patología Mamaria Benigna",
        "Patología Menopausia y Climaterio",
        "Patología Neonatal",
        "Patología Neonatal Congénita Infecciosa",
        "Patología Neonatal Infecciosa",
        "Patología Pancreática",
        "Patología Perianal",
        "Patología Prostática",
        "Patología Puerperal",
        "Patología Respiratoria del Lactante y Preescolar",
        "Patología Respiratoria del Pediátrico",
        "Patología Tiroidea",
        "Patología de Extremidad Inferior",
        "Patología de Extremidad Superior",
        "Patología de Trabajo de Parto",
        "Patología de anexos (Introducción Oftalmología)",
        "Patología de hombro doloroso (Patología de Extremidad Superior)",
        "Patología del Embarazo",
        "Patología del Embarazo: Estados Hipertensivos",
        "Patología hepática del embarazo (Patología del Embarazo)",
        "Patología tiroidea en el embarazo (Control Prenatal)",
        "Patología vulvar Bartolinitis (Oncología Ginecológica)",
        "Pericarditis (Infecto Cardio y Perlas)",
        "Peritonitis bacteriana espontánea (Cirrosis y sus Complicaciones / Trasplante Hepático)",
        "Perlas",
        "Pie diabético (Complicaciones Diabetes)",
        "Pie plano (Especialidades Pedia)",
        "Pinguécula (Patología Cámara Anterior)",
        "Pitiriasis rosada (Patología Dermatológica)",
        "Pitiriasis versicolor (Infecto Derma)",
        "Placenta previa (Hemorragias del Segundo Trimestre)",
        "Planes de hidratación (Diarrea en el Pediátrico)",
        "Poli (Parto Prematuro y Patología Coriónica)",
        "Poliposis (Sangrados Uterinos Anormales: Origen Anatómico No Maligno)",
        "Preeclampsia (Patología del Embarazo: Estados Hipertensivos)",
        "Prevención y tamizaje de CACU (Oncología Ginecológica)",
        "Prostatitis (Patología Prostática)",
        "Proteinosis alveolar (Neumonías Ocupacionales / Derrame Pleural)",
        "Psiquiatría",
        "Psoriasis (Patología Dermatológica)",
        "Pterigión (Patología Cámara Anterior)",
        "Páncreas (Cirugía Oncología)",
        "Pénfigo vulgar (Patología Dermatológica)",
        "Púrpura trombocitopénica (Anormalidades de la Hemostasia y Perlas)",
        "Púrpura trombocitopénica. Ortopedia: Displasia de cadera (Especialidades Pedia)",
        "Quemaduras / Golpe de Calor / Hipotermia",
        "Queratocono (Patología Cámara Anterior)",
        "R. uterina (Hemorragias del Segundo Trimestre)",
        "RN sano (Recién Nacido Sano)",
        "RPM (Parto Prematuro y Patología Coriónica)",
        "Reacciones de hipersensibilidad (Reumatología)",
        "Reanimación Neonatal",
        "Recién Nacido Sano",
        "Reflujo vesicoureteral (Uropedia)",
        "Resfriado común (IRAs / Convulsiones)",
        "Retinopatía diabética (Patología Cámara Posterior)",
        "Retinopatía hipertensiva (Patología Cámara Posterior)",
        "Reumatología",
        "Rickettsiosis (Enfermedades por Zoonosis)",
        "Rubéola (Patología Neonatal Congénita Infecciosa)",
        "Rubéola (Enfermedades Exantemáticas)",
        "SAM (Patología Respiratoria del Pediátrico)",
        "SAOS (Patología Infecciosa / Rinología y Faringe)",
        "SOP (Sangrados Uterinos Anormales: Origen No Anatómico)",
        "SRIS (Introducción MI / Introducción Infectología)",
        "STDA por várices esofágicas (Cirrosis y sus Complicaciones / Trasplante Hepático)",
        "Sangrados Uterinos Anormales: Origen Anatómico No Maligno",
        "Sangrados Uterinos Anormales: Origen No Anatómico",
        "Sangrados uterinos de origen desconocido (Sangrados Uterinos Anormales: Origen No Anatómico)",
        "Sarampión (Enfermedades Exantemáticas)",
        "Sarcoidosis (Neumonías Ocupacionales / Derrame Pleural)",
        "Sarcoma de Ewing. Dermapedia: Dermatitis atópica (Especialidades Pedia)",
        "Sepsis (Patología Neonatal Infecciosa)",
        "Sepsis (Introducción MI / Introducción Infectología)",
        "Sepsis materna (Patología Puerperal)",
        "Silicosis (Neumonías Ocupacionales / Derrame Pleural)",
        "Simpaticomimético (Intoxicaciones)",
        "Sx Asherman (Amenorreas Primarias y Secundarias)",
        "Sx Klinefelter (Alteraciones Cromosómicas y Perlas)",
        "Sx Mielodisplásicos (Anormalidades de la Hemostasia y Perlas)",
        "Sx Mieloproliferativos (Anormalidades de la Hemostasia y Perlas)",
        "Sx Patau (Alteraciones Cromosómicas y Perlas)",
        "Sx Rokitansky (Amenorreas Primarias y Secundarias)",
        "Sx climatérico (Patología Menopausia y Climaterio)",
        "Sx compartimental (Trauma Generalidades y Complicaciones)",
        "Sx de Cushing (Patología Central y Suprarrenal)",
        "Sx de Down (Alteraciones Cromosómicas y Perlas)",
        "Sx de Edwards (Alteraciones Cromosómicas y Perlas)",
        "Sx de HELLP (Patología del Embarazo: Estados Hipertensivos)",
        "Sx de Kallman (Amenorreas Primarias y Secundarias)",
        "Sx de Lynch (Cirugía Oncología)",
        "Sx de Meniere (Hipoacusia y Vértigo)",
        "Sx de Morris (Amenorreas Primarias y Secundarias)",
        "Sx de Prader Willi (Amenorreas Primarias y Secundarias)",
        "Sx de Sheehan (Amenorreas Primarias y Secundarias)",
        "Sx de Sjögren (Reumatología)",
        "Sx de Stevens Johnson (Patología Dermatológica)",
        "Sx de Swyer (Amenorreas Primarias y Secundarias)",
        "Sx de Turner (Amenorreas Primarias y Secundarias)",
        "Sx de dolor locoregional (Trauma Generalidades y Complicaciones)",
        "Sx de intestino irritable (Patología Intestinal Inflamatoria)",
        "Sx de ojo seco (Introducción Oftalmología)",
        "Sx de piel escaldada (Especialidades Pedia)",
        "Sx de shock tóxico (Especialidades Pedia)",
        "Sx geriátricos (Geriatría)",
        "Sx medulares (ATLS)",
        "Sx nefríticos (Nefrología)",
        "Sx nefríticos (Psiquiatría)",
        "Sx nefrótico (Nefrología)",
        "Sx nefrótico (Psiquiatría)",
        "Sífilis (Patología Neonatal Congénita Infecciosa)",
        "Sífilis (ETS)",
        "Síndrome Metabólico",
        "Síndromes Coronarios",
        "TCE hemorragia epidural, subaracnoidea, subdural (ATLS)",
        "TDAH (Psiquiatría)",
        "TORCH Citomegalovirus (Patología Neonatal Congénita Infecciosa)",
        "TTRN (Patología Respiratoria del Pediátrico)",
        "Taeniasis cisticercosis (Enfermedades Parasitarias)",
        "Talasemias (Anemias Hemolíticas)",
        "Talla baja (Crecimiento y Desarrollo)",
        "Tamiz Metabólico",
        "Tamizajes del RN (Recién Nacido Sano)",
        "Taquicardia supraventricular (Trastornos del Ritmo)",
        "Temblor esencial (Trastornos del Movimiento / Enf. Neurodegenerativas)",
        "Tipo de heridas OX (Introducción a Cirugía y Cirugía Abdominal)",
        "Tipo de heridas OX (Patología Esofágica)",
        "Tiroiditis de Quervain (Patología Tiroidea)",
        "Tiroiditis de Riedel (Patología Tiroidea)",
        "Tirotoxicosis (Patología Tiroidea)",
        "Tiñas inflamatorias y no inflamatorias (Infecto Derma)",
        "Torsión del apéndice testicular (Uropedia)",
        "Torsión ovárica (Sangrados Uterinos Anormales: Origen Anatómico No Maligno)",
        "Torsión testicular (Uropedia)",
        "Tos ferina (Patología Respiratoria del Lactante y Preescolar)",
        "Toxoplasmosis (Patología Neonatal Congénita Infecciosa)",
        "Toxíndromes: Serotoninérgico (Intoxicaciones)",
        "Trabajo de Parto",
        "Tracoma (Patología Cámara Anterior)",
        "Transposición de grandes vasos (Cardiopedia)",
        "Trastornos del Movimiento / Enf. Neurodegenerativas",
        "Trastornos del Ritmo",
        "Trastornos del piso pélvico (Patología Menopausia y Climaterio)",
        "Trastornos del sueño (Psiquiatría)",
        "Trauma Generalidades y Complicaciones",
        "Trauma abdominal, Fx de cadera, trauma genitourinario, ATLS en la embarazada (ATLS)",
        "Trauma ocular (Introducción Oftalmología)",
        "Trauma torácico Neumotórax a tensión, taponamiento cardíaco, hemotórax masivo, neumotórax abierto, tórax inestable (ATLS)",
        "Trichomonas (Patología Infecciosa Cervical)",
        "Tromboembolia pulmonar (Patología Arterial y Venosa)",
        "Trombosis venosa profunda (Patología Arterial y Venosa)",
        "Tuberculosis",
        "Tularemia (Enfermedades por Zoonosis)",
        "Tumores cardíacos (Infecto Cardio y Perlas)",
        "Tétanos / Botulismo / Rabia / Patología Fúngica",
        "Urgencias Pediátricas",
        "Urología",
        "Uropedia",
        "Uveítis (Patología Cámara Posterior)",
        "VPPN (Hipoacusia y Vértigo)",
        "Vacunación",
        "Vacunas (Control Prenatal)",
        "Valvulopatías",
        "Varicela (Patología Neonatal Congénita Infecciosa)",
        "Varicela (Enfermedades Exantemáticas)",
        "Vasa previa (Hemorragias del Segundo Trimestre)",
        "Vasculitis (Reumatología)",
        "Violencia obstétrica (Trabajo de Parto)",
        "Virales (Neumonías)",
        "Virus de la Inmunodeficiencia Humana",
        "Vitiligo (Patología Dermatológica)",
        "Vólvulo de colon y ciego (Patología Intestinal Qx)",
        "Zika (Enfermedades Transmitidas por Vector)",
        "Zollinger-Ellison (Patología Gástrica)",
        "Íleo biliar (Patología Biliar)",
        "Úlcera péptica complicada y perforada (Patología Gástrica)",
        "Úlcera péptica duodenal y gástrica (Patología Gástrica)"
    ];

    const TEMARIO_MAPPING = {
        "5ta enfermedad (Enfermedades Exantemáticas)": [
            "5ta enfermedad"
        ],
        "6ta enfermedad (Enfermedades Exantemáticas)": [
            "6ta enfermedad"
        ],
        "A. duodenal (Patología Neonatal)": [
            "A. duodenal"
        ],
        "A. esofágica (Patología Neonatal)": [
            "A. esofágica",
            "a. esofágicáncer"
        ],
        "A. pilórica (Patología Neonatal)": [
            "A. pilórica",
            "a. pilóricáncer"
        ],
        "ACLS y BLS": [
            "ACLS y BLS",
            "ACLS"
        ],
        "ATLS": [
            "ATLS",
            "Introducción",
            "Manejo de vía aérea",
            "Choque",
            "Trauma torácico Neumotórax a tensión, taponamiento cardíaco, hemotórax masivo, neumotórax abierto, tórax inestable",
            "TCE hemorragia epidural, subaracnoidea, subdural",
            "Sx medulares",
            "Trauma abdominal, Fx de cadera, trauma genitourinario, ATLS en la embarazada"
        ],
        "Abdomen agudo (Introducción a Cirugía y Cirugía Abdominal)": [
            "Abdomen agudo"
        ],
        "Abdomen agudo (Patología Esofágica)": [
            "Abdomen agudo"
        ],
        "Aborto (Hemorragias del Primer Trimestre)": [
            "Aborto"
        ],
        "Absceso periamigdalino y faríngeo (Patología Infecciosa / Rinología y Faringe)": [
            "Absceso periamigdalino y faríngeo",
            "Absceso periamigdalino",
            "faríngeo"
        ],
        "Abscesos (Patología Perianal)": [
            "Abscesos"
        ],
        "Abscesos renales (Nefrología)": [
            "Abscesos renales"
        ],
        "Abscesos renales (Psiquiatría)": [
            "Abscesos renales"
        ],
        "Acné (Infecto Derma)": [
            "Acné"
        ],
        "Acretismo placentario (Hemorragias del Segundo Trimestre)": [
            "Acretismo placentario"
        ],
        "Adenomiosis (Sangrados Uterinos Anormales: Origen Anatómico No Maligno)": [
            "Adenomiosis"
        ],
        "Adicciones (Psiquiatría)": [
            "Adicciones"
        ],
        "Alacranismo (Mordeduras y Picaduras)": [
            "Alacranismo"
        ],
        "Alimentación (Crecimiento y Desarrollo)": [
            "Alimentación"
        ],
        "Alteraciones Cromosómicas y Perlas": [
            "Alteraciones Cromosómicas y Perlas",
            "Alteraciones Cromosómicas",
            "Perlas",
            "alteraciones cromosómicáncers y perlas",
            "alteraciones cromosómicáncers",
            "Sx de Down",
            "Sx de Edwards",
            "Sx Patau",
            "Sx Klinefelter"
        ],
        "Alteraciones dermatológicas al nacimiento (Recién Nacido Sano)": [
            "Alteraciones dermatológicas al nacimiento",
            "alteraciones dermatológicáncers al nacimiento"
        ],
        "Alzheimer (Demencias)": [
            "Alzheimer"
        ],
        "Amenorreas Primarias y Secundarias": [
            "Amenorreas Primarias y Secundarias",
            "Amenorreas Primarias",
            "Secundarias",
            "amenorrotitiss primarias y secundarias",
            "amenorrotitiss primarias",
            "Sx de Turner",
            "Sx de Swyer",
            "Sx de Morris",
            "Sx Rokitansky",
            "Sx Asherman",
            "Sx de Sheehan",
            "Sx de Kallman",
            "Sx de Prader Willi"
        ],
        "Ametropías (Introducción Oftalmología)": [
            "Ametropías"
        ],
        "Anemia falciforme (Anemias Hemolíticas)": [
            "Anemia falciforme"
        ],
        "Anemia ferropénica (Anemias Introducción y Anemias Carenciales)": [
            "Anemia ferropénica",
            "anemia ferropénicáncer"
        ],
        "Anemia megaloblástica (Anemias Introducción y Anemias Carenciales)": [
            "Anemia megaloblástica",
            "anemia megaloblásticáncer"
        ],
        "Anemias Hemolíticas": [
            "Anemias Hemolíticas",
            "anemias hemolíticáncers",
            "Talasemias",
            "Esferocitosis hereditaria",
            "Deficiencia de glucosa 6 fosfato",
            "Anemia falciforme",
            "Anemias autoinmunes"
        ],
        "Anemias Introducción y Anemias Carenciales": [
            "Anemias Introducción y Anemias Carenciales",
            "Anemias Introducción",
            "Anemias Carenciales",
            "anemias introducción y anemias cáncerrenciales",
            "anemias cáncerrenciales",
            "Anemias carenciales",
            "Enfermedad crónica",
            "Anemia ferropénica",
            "Anemia megaloblástica"
        ],
        "Anemias autoinmunes (Anemias Hemolíticas)": [
            "Anemias autoinmunes"
        ],
        "Anemias carenciales (Anemias Introducción y Anemias Carenciales)": [
            "Anemias carenciales",
            "anemias cáncerrenciales"
        ],
        "Angina estable e inestable (Síndromes Coronarios)": [
            "Angina estable e inestable"
        ],
        "Anomalía de Ebstein (Cardiopedia)": [
            "Anomalía de Ebstein",
            "anotitislía de ebstein"
        ],
        "Anormalidades de la Hemostasia y Perlas": [
            "Anormalidades de la Hemostasia y Perlas",
            "Anormalidades de la Hemostasia",
            "Perlas",
            "Hemofilia",
            "Enf. de Von Willebrand",
            "Púrpura trombocitopénica",
            "Sx Mielodisplásicos",
            "Sx Mieloproliferativos"
        ],
        "Antebrazo y mano (Patología de Extremidad Superior)": [
            "Antebrazo y mano",
            "Antebrazo",
            "mano"
        ],
        "Antibióticos (Introducción MI / Introducción Infectología)": [
            "Antibióticos"
        ],
        "Anticolinérgico (Intoxicaciones)": [
            "Anticolinérgico"
        ],
        "Apendicitis": [
            "Apendicitis"
        ],
        "Apnea del prematuro (Patología Respiratoria del Pediátrico)": [
            "Apnea del prematuro",
            "apnotitis del prematuro"
        ],
        "Artritis reumatoide (Reumatología)": [
            "Artritis reumatoide"
        ],
        "Asbestosis (Neumonías Ocupacionales / Derrame Pleural)": [
            "Asbestosis"
        ],
        "Ascaris (Enfermedades Parasitarias)": [
            "Ascaris",
            "ascáncerris"
        ],
        "Ascitis (Cirrosis y sus Complicaciones / Trasplante Hepático)": [
            "Ascitis"
        ],
        "Asfixia (Patología Neonatal)": [
            "Asfixia"
        ],
        "Asma en el Adulto y Pediátrico": [
            "Asma en el Adulto y Pediátrico",
            "Asma en el Adulto",
            "Pediátrico"
        ],
        "Astrocitoma (Especialidades Pedia)": [
            "Astrocitoma",
            "astrocitotitis"
        ],
        "Atresia de las coanas (Patología Neonatal)": [
            "Atresia de las coanas"
        ],
        "Atresia de vías biliares (Ictericia Neonatal)": [
            "Atresia de vías biliares"
        ],
        "Atípicas: en el adulto y pediátrico (Neumonías)": [
            "Atípicas: en el adulto y pediátrico",
            "Atípicas: en el adulto",
            "pediátrico",
            "atípicáncers: en el adulto y pediátrico",
            "atípicáncers: en el adulto"
        ],
        "Autismo (Psiquiatría)": [
            "Autismo"
        ],
        "Bacterianas (Neumonías)": [
            "Bacterianas"
        ],
        "Bisinosis (Neumonías Ocupacionales / Derrame Pleural)": [
            "Bisinosis"
        ],
        "Blefaritis (Introducción Oftalmología)": [
            "Blefaritis"
        ],
        "Bronquiolitis (Patología Respiratoria del Lactante y Preescolar)": [
            "Bronquiolitis"
        ],
        "Brucelosis (Enfermedades por Zoonosis)": [
            "Brucelosis"
        ],
        "CA basocelular (Oncoderma)": [
            "CA basocelular",
            "cáncer basocelular"
        ],
        "CA de Próstata / Tumores Testiculares": [
            "CA de Próstata / Tumores Testiculares",
            "cáncer de próstata / tumores testiculares"
        ],
        "CA de colon y recto (Cirugía Oncología)": [
            "CA de colon y recto",
            "CA de colon",
            "recto",
            "cáncer de colon y recto",
            "cáncer de colon"
        ],
        "CA de endometrio y CA de ovario (Oncología Ginecológica)": [
            "CA de endometrio y CA de ovario",
            "CA de endometrio",
            "CA de ovario",
            "cáncer de endometrio y ca de ovario",
            "cáncer de endometrio",
            "cáncer de ovario"
        ],
        "CA de esófago (Cirugía Oncología)": [
            "CA de esófago",
            "cáncer de esófago"
        ],
        "CA de laringe (Patología Infecciosa / Rinología y Faringe)": [
            "CA de laringe",
            "cáncer de laringe"
        ],
        "CA de vagina y vulvar (Oncología Ginecológica)": [
            "CA de vagina y vulvar",
            "CA de vagina",
            "vulvar",
            "cáncer de vagina y vulvar",
            "cáncer de vagina"
        ],
        "CA espinocelular (Oncoderma)": [
            "CA espinocelular",
            "cáncer espinocelular"
        ],
        "CA hepático (Cirugía Oncología)": [
            "CA hepático",
            "cáncer hepático"
        ],
        "CA renal (Cirugía Oncología)": [
            "CA renal",
            "cáncer renal"
        ],
        "CACU (Oncología Ginecológica)": [
            "CACU",
            "cáncercu",
            "cáncer cervicouterino"
        ],
        "Carbunco (Enfermedades por Zoonosis)": [
            "Carbunco",
            "cáncerrbunco"
        ],
        "Cardiopatías acianógenas CIV, CIA, PCA, estenosis de la arteria pulmonar (Cardiopedia)": [
            "Cardiopatías acianógenas CIV, CIA, PCA, estenosis de la arteria pulmonar",
            "Cardiopatías acianógenas CIV",
            "estenosis de la arteria pulmonar",
            "cáncerrdiopatías acianógenas civ, cia, pca, estenosis de la arteria pulmonar",
            "cáncerrdiopatías acianógenas civ"
        ],
        "Cardiopatías cianógenas TF, tronco arterioso común (Cardiopedia)": [
            "Cardiopatías cianógenas TF, tronco arterioso común",
            "Cardiopatías cianógenas TF",
            "tronco arterioso común",
            "cáncerrdiopatías cianógenas tf, tronco arterioso común",
            "cardiopatías cianógenas tetralogía de fallot, tronco arterioso común",
            "cáncerrdiopatías cianógenas tf",
            "cardiopatías cianógenas tetralogía de fallot"
        ],
        "Cardiopedia": [
            "Cardiopedia",
            "cáncerrdiopedia",
            "Cardiopatías acianógenas CIV, CIA, PCA, estenosis de la arteria pulmonar",
            "Cardiopatías cianógenas TF, tronco arterioso común",
            "Drenaje pulmonar venoso anómalo",
            "Anomalía de Ebstein",
            "Transposición de grandes vasos"
        ],
        "Catarata (Patología Cámara Posterior)": [
            "Catarata",
            "cáncertarata"
        ],
        "Cefalea en racimos (Cefaleas)": [
            "Cefalea en racimos",
            "cefalotitis en racimos"
        ],
        "Cefalea tensional (Cefaleas)": [
            "Cefalea tensional",
            "cefalotitis tensional"
        ],
        "Cefalea trigémino autonómica (Cefaleas)": [
            "Cefalea trigémino autonómica",
            "cefalea trigémino autonómicáncer",
            "cefalotitis trigémino autonómica"
        ],
        "Cefaleas": [
            "Cefaleas",
            "cefalotitiss",
            "Cefalea tensional",
            "Migraña",
            "Cefalea en racimos",
            "Cefalea trigémino autonómica"
        ],
        "Cefalohematoma (Recién Nacido Sano)": [
            "Cefalohematoma",
            "cefalohematotitis"
        ],
        "Celulitis periorbitaria (Introducción Oftalmología)": [
            "Celulitis periorbitaria"
        ],
        "Cervicovaginitis bacteriana (Patología Infecciosa Cervical)": [
            "Cervicovaginitis bacteriana",
            "vaginosis bacteriana"
        ],
        "Cesárea (Patología de Trabajo de Parto)": [
            "Cesárea",
            "cesárotitis"
        ],
        "Cetoacidosis (Complicaciones Diabetes)": [
            "Cetoacidosis"
        ],
        "Chagas (Enfermedades Transmitidas por Vector)": [
            "Chagas"
        ],
        "Chalazión (Introducción Oftalmología)": [
            "Chalazión"
        ],
        "Chancro (ETS)": [
            "Chancro"
        ],
        "Chancroide (ETS)": [
            "Chancroide"
        ],
        "Chikungunya (Enfermedades Transmitidas por Vector)": [
            "Chikungunya"
        ],
        "Choque (ATLS)": [
            "Choque"
        ],
        "Choque en la paciente embarazada (Patología Puerperal)": [
            "Choque en la paciente embarazada"
        ],
        "Choque séptico (Introducción MI / Introducción Infectología)": [
            "Choque séptico"
        ],
        "Ciclo Genital / Esterilidad / Anticonceptivos": [
            "Ciclo Genital / Esterilidad / Anticonceptivos"
        ],
        "Cirrosis y sus Complicaciones / Trasplante Hepático": [
            "Cirrosis y sus Complicaciones / Trasplante Hepático",
            "Cirrosis",
            "sus Complicaciones / Trasplante Hepático",
            "cirrosis y sus complicáncerciones / trasplante hepático",
            "sus complicáncerciones / trasplante hepático",
            "STDA por várices esofágicas",
            "Ascitis",
            "Encefalopatía hepática",
            "Peritonitis bacteriana espontánea",
            "Esprue"
        ],
        "Cirugía Oncología": [
            "Cirugía Oncología",
            "CA de esófago",
            "Gástrico",
            "Páncreas",
            "CA de colon y recto",
            "CA hepático",
            "CA renal",
            "Sx de Lynch"
        ],
        "Clase de Inglés": [
            "Clase de Inglés"
        ],
        "Coagulopatías (Sangrados Uterinos Anormales: Origen No Anatómico)": [
            "Coagulopatías"
        ],
        "Cojera (Especialidades Pedia)": [
            "Cojera"
        ],
        "Colangitis (Patología Biliar)": [
            "Colangitis"
        ],
        "Colecistitis (Patología Biliar)": [
            "Colecistitis"
        ],
        "Coledocolitiasis (Patología Biliar)": [
            "Coledocolitiasis"
        ],
        "Colelitiasis (Patología Biliar)": [
            "Colelitiasis"
        ],
        "Colinérgico (Intoxicaciones)": [
            "Colinérgico"
        ],
        "Colitis ulcerosa (Patología Intestinal Inflamatoria)": [
            "Colitis ulcerosa"
        ],
        "Coma mixedematoso (Patología Tiroidea)": [
            "Coma mixedematoso",
            "cotitis mixedematoso"
        ],
        "Complicaciones Diabetes": [
            "Complicaciones Diabetes",
            "complicáncerciones diabetes",
            "Pie diabético",
            "Neuropatía diabética",
            "Cetoacidosis",
            "Edo Hiperosmolar"
        ],
        "Conjuntivitis (Patología Cámara Anterior)": [
            "Conjuntivitis"
        ],
        "Consulta del niño sano (Crecimiento y Desarrollo)": [
            "Consulta del niño sano"
        ],
        "Consultas prenatales (Control Prenatal)": [
            "Consultas prenatales"
        ],
        "Control Prenatal": [
            "Control Prenatal",
            "Fisiología del embarazo",
            "Consultas prenatales",
            "Vacunas",
            "Maniobras de Leopold",
            "Incompatibilidad grupo Rh",
            "Diagnóstico cromosomopatías",
            "Depresión materna",
            "Hiperémesis gravídica",
            "Patología tiroidea en el embarazo"
        ],
        "Corioamnionitis (Parto Prematuro y Patología Coriónica)": [
            "Corioamnionitis"
        ],
        "Crecimiento (Crecimiento y Desarrollo)": [
            "Crecimiento"
        ],
        "Crecimiento y Desarrollo": [
            "Crecimiento y Desarrollo",
            "Crecimiento",
            "Desarrollo",
            "Hitos del desarrollo",
            "Consulta del niño sano",
            "Maltrato infantil",
            "Alimentación",
            "Desnutrición",
            "Obesidad",
            "Talla baja",
            "Déficits vitamínicos",
            "Muerte súbita"
        ],
        "Cuidados del recién nacido (Recién Nacido Sano)": [
            "Cuidados del recién nacido",
            "cuidados del rn"
        ],
        "Cáncer de Mama": [
            "Cáncer de Mama",
            "ca de mama"
        ],
        "Cáncer de tiroides (Patología Tiroidea)": [
            "Cáncer de tiroides",
            "ca de tiroides"
        ],
        "Cándida (Patología Infecciosa Cervical)": [
            "Cándida"
        ],
        "DPPNI (Hemorragias del Segundo Trimestre)": [
            "DPPNI",
            "desprendimiento de placenta"
        ],
        "Dacrioadenitis (Introducción Oftalmología)": [
            "Dacrioadenitis"
        ],
        "Deficiencia de biotinidasa (Tamiz Metabólico)": [
            "Deficiencia de biotinidasa"
        ],
        "Deficiencia de glucosa 6 fosfato (Anemias Hemolíticas)": [
            "Deficiencia de glucosa 6 fosfato"
        ],
        "Delirium tremens (Psiquiatría)": [
            "Delirium tremens"
        ],
        "Demencia frontotemporal (Demencias)": [
            "Demencia frontotemporal"
        ],
        "Demencia por cuerpos de Lewis (Demencias)": [
            "Demencia por cuerpos de Lewis"
        ],
        "Demencias": [
            "Demencias",
            "Alzheimer",
            "Demencia frontotemporal",
            "Demencia por cuerpos de Lewis"
        ],
        "Dengue (Enfermedades Transmitidas por Vector)": [
            "Dengue"
        ],
        "Depresión materna (Control Prenatal)": [
            "Depresión materna",
            "depresión materecién nacidoa"
        ],
        "Dermatitis del pañal (Especialidades Pedia)": [
            "Dermatitis del pañal"
        ],
        "Dermatitis seborreica (Especialidades Pedia)": [
            "Dermatitis seborreica",
            "dermatitis seborreicáncer"
        ],
        "Desnutrición (Crecimiento y Desarrollo)": [
            "Desnutrición"
        ],
        "Desprendimiento de retina (Patología Cámara Posterior)": [
            "Desprendimiento de retina"
        ],
        "Diabetes": [
            "Diabetes"
        ],
        "Diabetes insípida (Patología Central y Suprarrenal)": [
            "Diabetes insípida"
        ],
        "Diagnóstico cromosomopatías (Control Prenatal)": [
            "Diagnóstico cromosomopatías"
        ],
        "Diarrea en el Pediátrico": [
            "Diarrea en el Pediátrico",
            "diarrotitis en el pediátrico",
            "Planes de hidratación",
            "Introducción diarreas"
        ],
        "Diarrea enteroinvasiva (Diarreas Agudas y Crónicas)": [
            "Diarrea enteroinvasiva",
            "diarrotitis enteroinvasiva"
        ],
        "Diarreas Agudas y Crónicas": [
            "Diarreas Agudas y Crónicas",
            "Diarreas Agudas",
            "Crónicas",
            "diarreas agudas y crónicáncers",
            "diarrotitiss agudas y crónicas",
            "diarrotitiss agudas",
            "crónicáncers",
            "Diarrea enteroinvasiva",
            "Intoxicaciones alimentarias",
            "Enf. Celíaca"
        ],
        "Difteria (IRAs / Convulsiones)": [
            "Difteria"
        ],
        "Dispepsia funcional (Patología Gástrica)": [
            "Dispepsia funcional"
        ],
        "Displasia (Patología Respiratoria del Pediátrico)": [
            "Displasia"
        ],
        "Distocias (Patología de Trabajo de Parto)": [
            "Distocias"
        ],
        "Diverticulitis (Patología Diverticular)": [
            "Diverticulitis"
        ],
        "Diverticulosis (Patología Diverticular)": [
            "Diverticulosis"
        ],
        "Divertículo de Meckel (Patología Gastrointestinal del Pediátrico)": [
            "Divertículo de Meckel"
        ],
        "Drenaje pulmonar venoso anómalo (Cardiopedia)": [
            "Drenaje pulmonar venoso anómalo"
        ],
        "Déficits vitamínicos (Crecimiento y Desarrollo)": [
            "Déficits vitamínicos"
        ],
        "E. histolytica (Enfermedades Parasitarias)": [
            "E. histolytica",
            "e. histolyticáncer"
        ],
        "EA (Patología Infecciosa / Rinología y Faringe)": [
            "EA",
            "otitis"
        ],
        "EHI (Patología Neonatal)": [
            "EHI"
        ],
        "ELA (Trastornos del Movimiento / Enf. Neurodegenerativas)": [
            "ELA"
        ],
        "EMH (Patología Respiratoria del Pediátrico)": [
            "EMH"
        ],
        "EPOC / CA de Pulmón": [
            "EPOC / CA de Pulmón",
            "epoc / cáncer de pulmón"
        ],
        "ERGE (Patología Gastrointestinal del Pediátrico)": [
            "ERGE"
        ],
        "ETS": [
            "ETS",
            "Linfogranuloma venéreo",
            "Chancro",
            "Chancroide",
            "Sífilis",
            "Herpes"
        ],
        "EVC Isquémico y Hemorrágico": [
            "EVC Isquémico y Hemorrágico",
            "EVC Isquémico",
            "Hemorrágico",
            "enfermedad vascular cerebral isquémico y hemorrágico",
            "enfermedad vascular cerebral isquémico"
        ],
        "Eclampsia (Patología del Embarazo: Estados Hipertensivos)": [
            "Eclampsia",
            "hipertensión"
        ],
        "Edo Hiperosmolar (Complicaciones Diabetes)": [
            "Edo Hiperosmolar"
        ],
        "Embarazo ectópico (Hemorragias del Primer Trimestre)": [
            "Embarazo ectópico"
        ],
        "Embarazo gemelar (Patología de Trabajo de Parto)": [
            "Embarazo gemelar"
        ],
        "Embolia grasa (Trauma Generalidades y Complicaciones)": [
            "Embolia grasa"
        ],
        "Encefalopatía hepática (Cirrosis y sus Complicaciones / Trasplante Hepático)": [
            "Encefalopatía hepática",
            "encefalopatía hepáticáncer"
        ],
        "Endocarditis (Infecto Cardio y Perlas)": [
            "Endocarditis",
            "endocáncerrditis"
        ],
        "Endocervicitis (Patología Infecciosa Cervical)": [
            "Endocervicitis"
        ],
        "Endometriosis (Sangrados Uterinos Anormales: Origen No Anatómico)": [
            "Endometriosis"
        ],
        "Enf. Celíaca (Diarreas Agudas y Crónicas)": [
            "Enf. Celíaca",
            "enf. celíacáncer"
        ],
        "Enf. Lyme (Enfermedades por Zoonosis)": [
            "Enf. Lyme"
        ],
        "Enf. Trofoblástica (Hemorragias del Primer Trimestre)": [
            "Enf. Trofoblástica",
            "enf. trofoblásticáncer"
        ],
        "Enf. de Hirschsprung (Patología Gastrointestinal del Pediátrico)": [
            "Enf. de Hirschsprung"
        ],
        "Enf. de Von Willebrand (Anormalidades de la Hemostasia y Perlas)": [
            "Enf. de Von Willebrand"
        ],
        "Enfermedad (Hipoacusia y Vértigo)": [
            "Enfermedad"
        ],
        "Enfermedad Mano Boca Pie (Enfermedades Exantemáticas)": [
            "Enfermedad Mano Boca Pie",
            "enfermedad mano bocáncer pie"
        ],
        "Enfermedad arterial periférica (Patología Arterial y Venosa)": [
            "Enfermedad arterial periférica",
            "enfermedad arterial periféricáncer"
        ],
        "Enfermedad crónica (Anemias Introducción y Anemias Carenciales)": [
            "Enfermedad crónica",
            "enfermedad crónicáncer"
        ],
        "Enfermedad de Addison (Patología Central y Suprarrenal)": [
            "Enfermedad de Addison"
        ],
        "Enfermedad de Crohn (Patología Intestinal Inflamatoria)": [
            "Enfermedad de Crohn"
        ],
        "Enfermedad de Kawasaki (Enfermedades Exantemáticas)": [
            "Enfermedad de Kawasaki"
        ],
        "Enfermedad diverticular (Patología Diverticular)": [
            "Enfermedad diverticular"
        ],
        "Enfermedad hepática grasa (Patología Hepática)": [
            "Enfermedad hepática grasa",
            "enfermedad hepáticáncer grasa"
        ],
        "Enfermedad pélvica inflamatoria (Patología Infecciosa Cervical)": [
            "Enfermedad pélvica inflamatoria",
            "enfermedad pélvicáncer inflamatoria",
            "epi"
        ],
        "Enfermedades Exantemáticas": [
            "Enfermedades Exantemáticas",
            "enfermedades exantemáticáncers",
            "Sarampión",
            "Rubéola",
            "Varicela",
            "5ta enfermedad",
            "6ta enfermedad",
            "Escarlatina",
            "Enfermedad de Kawasaki",
            "Enfermedad Mano Boca Pie",
            "Herpangina"
        ],
        "Enfermedades Parasitarias": [
            "Enfermedades Parasitarias",
            "Giardiasis",
            "E. histolytica",
            "Ascaris",
            "Taeniasis cisticercosis",
            "Filariasis",
            "Oxiuriasis",
            "Escabiosis"
        ],
        "Enfermedades Transmitidas por Vector": [
            "Enfermedades Transmitidas por Vector",
            "Dengue",
            "Zika",
            "Chikungunya",
            "Paludismo",
            "Malaria",
            "Chagas"
        ],
        "Enfermedades por Zoonosis": [
            "Enfermedades por Zoonosis",
            "Brucelosis",
            "Rickettsiosis",
            "Enf. Lyme",
            "Carbunco",
            "Tularemia"
        ],
        "Enterocolitis necrotizante (Patología Neonatal Infecciosa)": [
            "Enterocolitis necrotizante"
        ],
        "Epidemiología": [
            "Epidemiología",
            "enfermedad pélvica inflamatoriademiología"
        ],
        "Epididimitis (Uropedia)": [
            "Epididimitis",
            "enfermedad pélvica inflamatoriadidimitis"
        ],
        "Epiescleritis (Patología Cámara Anterior)": [
            "Epiescleritis",
            "enfermedad pélvica inflamatoriaescleritis"
        ],
        "Epiglotitis (Patología Respiratoria del Lactante y Preescolar)": [
            "Epiglotitis",
            "enfermedad pélvica inflamatoriaglotitis",
            "epigloma",
            "epiglea"
        ],
        "Escabiosis (Enfermedades Parasitarias)": [
            "Escabiosis",
            "escáncerbiosis"
        ],
        "Escalas geriátricas (Geriatría)": [
            "Escalas geriátricas",
            "escáncerlas geriátricas"
        ],
        "Escarlatina (Enfermedades Exantemáticas)": [
            "Escarlatina",
            "escáncerrlatina"
        ],
        "Escleritis (Patología Cámara Anterior)": [
            "Escleritis"
        ],
        "Esclerosis múltiple (Trastornos del Movimiento / Enf. Neurodegenerativas)": [
            "Esclerosis múltiple"
        ],
        "Esferocitosis hereditaria (Anemias Hemolíticas)": [
            "Esferocitosis hereditaria"
        ],
        "Esguince de tobillo (Patología de Extremidad Inferior)": [
            "Esguince de tobillo"
        ],
        "Especialidades Pedia": [
            "Especialidades Pedia",
            "Oncopedia: Neuroblastoma",
            "Nefroblastoma",
            "Astrocitoma",
            "Osteosarcoma",
            "Sarcoma de Ewing. Dermapedia: Dermatitis atópica",
            "Dermatitis del pañal",
            "Molusco contagioso",
            "Sx de piel escaldada",
            "Sx de shock tóxico",
            "Dermatitis seborreica",
            "Hematopedia: Púrpura de Henoch Schonlein",
            "Púrpura trombocitopénica. Ortopedia: Displasia de cadera",
            "Pie plano",
            "Cojera"
        ],
        "Espina bífida (Patología Neonatal)": [
            "Espina bífida"
        ],
        "Espondilopatías (Reumatología)": [
            "Espondilopatías"
        ],
        "Esprue (Cirrosis y sus Complicaciones / Trasplante Hepático)": [
            "Esprue"
        ],
        "Esquizofrenia (Psiquiatría)": [
            "Esquizofrenia"
        ],
        "Estenosis Hipertrófica del Píloro": [
            "Estenosis Hipertrófica del Píloro",
            "estenosis hipertróficáncer del píloro"
        ],
        "Estenosis aórtica y mitral (Valvulopatías)": [
            "Estenosis aórtica y mitral",
            "Estenosis aórtica",
            "mitral",
            "estenosis aórticáncer y mitral",
            "estenosis aórticáncer"
        ],
        "Exploración física (Introducción a Cirugía y Cirugía Abdominal)": [
            "Exploración física",
            "exploración físicáncer"
        ],
        "Exploración física (Patología Esofágica)": [
            "Exploración física",
            "exploración físicáncer"
        ],
        "Faringoamigdalitis (IRAs / Convulsiones)": [
            "Faringoamigdalitis"
        ],
        "Fenilcetonuria (Tamiz Metabólico)": [
            "Fenilcetonuria"
        ],
        "Fibrilación auricular (Trastornos del Ritmo)": [
            "Fibrilación auricular"
        ],
        "Fibrilación ventricular (Trastornos del Ritmo)": [
            "Fibrilación ventricular"
        ],
        "Fibroadenoma (Patología Mamaria Benigna)": [
            "Fibroadenoma",
            "fibroadenotitis"
        ],
        "Fibromialgia (Reumatología)": [
            "Fibromialgia"
        ],
        "Fibrosis quística (Tamiz Metabólico)": [
            "Fibrosis quística",
            "fibrosis quísticáncer"
        ],
        "Filariasis (Enfermedades Parasitarias)": [
            "Filariasis"
        ],
        "Fisiología del embarazo (Control Prenatal)": [
            "Fisiología del embarazo"
        ],
        "Fisiológica (Ictericia Neonatal)": [
            "Fisiológica",
            "fisiológicáncer"
        ],
        "Fisiológico (Trabajo de Parto)": [
            "Fisiológico"
        ],
        "Fisuras (Patología Perianal)": [
            "Fisuras"
        ],
        "Flutter auricular (Trastornos del Ritmo)": [
            "Flutter auricular"
        ],
        "Fx de brazo (Patología de Extremidad Superior)": [
            "Fx de brazo"
        ],
        "Fx de cadera (Patología de Extremidad Inferior)": [
            "Fx de cadera",
            "fx de cáncerdera"
        ],
        "Fx de extremidades inferiores (Patología de Extremidad Inferior)": [
            "Fx de extremidades inferiores"
        ],
        "Fx en rama verde (Trauma Generalidades y Complicaciones)": [
            "Fx en rama verde"
        ],
        "Fístulas (Patología Perianal)": [
            "Fístulas"
        ],
        "Galactosemia (Tamiz Metabólico)": [
            "Galactosemia"
        ],
        "Gastritis aguda o crónica (Patología Gástrica)": [
            "Gastritis aguda o crónica",
            "gastritis aguda o crónicáncer"
        ],
        "Gastrosquisis (Patología Neonatal)": [
            "Gastrosquisis"
        ],
        "Generalidades (Introducción Oftalmología)": [
            "Generalidades"
        ],
        "Geriatría": [
            "Geriatría",
            "Sx geriátricos",
            "Escalas geriátricas"
        ],
        "Giardiasis (Enfermedades Parasitarias)": [
            "Giardiasis"
        ],
        "Ginecología y Obstetricia": [
            "Ginecología y Obstetricia",
            "Ginecología",
            "Obstetricia"
        ],
        "Glaucoma (Patología Cámara Posterior)": [
            "Glaucoma",
            "glaucotitis"
        ],
        "Granulomatosis (Reumatología)": [
            "Granulomatosis",
            "granulotitistosis"
        ],
        "Gástrico (Cirugía Oncología)": [
            "Gástrico"
        ],
        "Hashimoto (Patología Tiroidea)": [
            "Hashimoto"
        ],
        "Hematopedia: Púrpura de Henoch Schonlein (Especialidades Pedia)": [
            "Hematopedia: Púrpura de Henoch Schonlein"
        ],
        "Hemofilia (Anormalidades de la Hemostasia y Perlas)": [
            "Hemofilia"
        ],
        "Hemorragia de matriz germinal (Patología Neonatal)": [
            "Hemorragia de matriz germinal",
            "sangrado de matriz germinal",
            "atonía de matriz germinal"
        ],
        "Hemorragia obstétrica Atonía, trauma, tejido, coagulopatías (Patología Puerperal)": [
            "Hemorragia obstétrica Atonía, trauma, tejido, coagulopatías",
            "Hemorragia obstétrica Atonía",
            "trauma",
            "tejido",
            "coagulopatías",
            "hemorragia obstétricáncer atonía, trauma, tejido, coagulopatías",
            "sangrado obstétrica atonía, trauma, tejido, coagulopatías",
            "hemorragia obstétrica hemorragia, trauma, tejido, coagulopatías",
            "atonía obstétrica atonía, trauma, tejido, coagulopatías",
            "hemorragia obstétricáncer atonía",
            "sangrado obstétrica atonía",
            "hemorragia obstétrica hemorragia",
            "atonía obstétrica atonía"
        ],
        "Hemorragias del Primer Trimestre": [
            "Hemorragias del Primer Trimestre",
            "sangrados del primer trimestre",
            "atonías del primer trimestre",
            "Aborto",
            "Embarazo ectópico",
            "Enf. Trofoblástica"
        ],
        "Hemorragias del Segundo Trimestre": [
            "Hemorragias del Segundo Trimestre",
            "sangrados del segundo trimestre",
            "atonías del segundo trimestre",
            "Placenta previa",
            "Acretismo placentario",
            "DPPNI",
            "Vasa previa",
            "R. uterina"
        ],
        "Hemorroides (Patología Perianal)": [
            "Hemorroides"
        ],
        "Hepatitis agudas y crónicas (Patología Hepática)": [
            "Hepatitis agudas y crónicas",
            "Hepatitis agudas",
            "crónicas",
            "hepatitis agudas y crónicáncers",
            "crónicáncers"
        ],
        "Hernias / Esplenectomía": [
            "Hernias / Esplenectomía",
            "herecién nacidoias / esplenectomía"
        ],
        "Hernias diafragmáticas (Patología Neonatal)": [
            "Hernias diafragmáticas",
            "hernias diafragmáticáncers",
            "herecién nacidoias diafragmáticas"
        ],
        "Herpangina (Enfermedades Exantemáticas)": [
            "Herpangina"
        ],
        "Herpes (ETS)": [
            "Herpes"
        ],
        "Herpes y VIH el binomio (Patología Neonatal Congénita Infecciosa)": [
            "Herpes y VIH el binomio",
            "Herpes",
            "VIH el binomio"
        ],
        "Hiperplasia prostática (Patología Prostática)": [
            "Hiperplasia prostática",
            "hiperplasia prostáticáncer"
        ],
        "Hiperplasia suprarrenal (Tamiz Metabólico)": [
            "Hiperplasia suprarrenal"
        ],
        "Hiperprolactinemia (Patología Central y Suprarrenal)": [
            "Hiperprolactinemia"
        ],
        "Hipertensión Arterial": [
            "Hipertensión Arterial",
            "preeclampsia arterial",
            "eclampsia arterial"
        ],
        "Hipertensión crónica en el embarazo (Patología del Embarazo: Estados Hipertensivos)": [
            "Hipertensión crónica en el embarazo",
            "hipertensión crónicáncer en el embarazo",
            "preeclampsia crónica en el embarazo",
            "eclampsia crónica en el embarazo"
        ],
        "Hipertensión gestacional (Patología del Embarazo: Estados Hipertensivos)": [
            "Hipertensión gestacional",
            "preeclampsia gestacional",
            "eclampsia gestacional"
        ],
        "Hipertensión pulmonar (Patología Respiratoria del Pediátrico)": [
            "Hipertensión pulmonar",
            "preeclampsia pulmonar",
            "eclampsia pulmonar"
        ],
        "Hipertiroidismo: Enfermedad de Graves (Patología Tiroidea)": [
            "Hipertiroidismo: Enfermedad de Graves"
        ],
        "Hiperémesis gravídica (Control Prenatal)": [
            "Hiperémesis gravídica",
            "hiperémesis gravídicáncer"
        ],
        "Hipoacusia neurosensorial (Hipoacusia y Vértigo)": [
            "Hipoacusia neurosensorial",
            "sordera neurosensorial"
        ],
        "Hipoacusia y Vértigo": [
            "Hipoacusia y Vértigo",
            "Hipoacusia",
            "Vértigo",
            "sordera y vértigo",
            "sordera",
            "VPPN",
            "Enfermedad",
            "Sx de Meniere",
            "Neuronitis vestibular",
            "Hipoacusia neurosensorial",
            "Otoesclerosis"
        ],
        "Hipotiroidismo (Tamiz Metabólico)": [
            "Hipotiroidismo"
        ],
        "Hipotiroidismo (Patología Tiroidea)": [
            "Hipotiroidismo"
        ],
        "Hitos del desarrollo (Crecimiento y Desarrollo)": [
            "Hitos del desarrollo"
        ],
        "IRAs / Convulsiones": [
            "IRAs / Convulsiones",
            "infección respiratorias / convulsiones",
            "infecciones respiratorias / convulsiones",
            "Resfriado común",
            "Faringoamigdalitis",
            "Difteria",
            "Mononucleosis"
        ],
        "IVUs (Uropedia)": [
            "IVUs",
            "infección de vías urinariass",
            "infecciones de vías urinarias"
        ],
        "Ictericia Neonatal": [
            "Ictericia Neonatal",
            "Fisiológica",
            "Materna",
            "Incompatibilidad sanguínea",
            "Ictericia por problemas del metabolismo hepático",
            "Atresia de vías biliares"
        ],
        "Ictericia por problemas del metabolismo hepático (Ictericia Neonatal)": [
            "Ictericia por problemas del metabolismo hepático"
        ],
        "Incompatibilidad grupo Rh (Control Prenatal)": [
            "Incompatibilidad grupo Rh"
        ],
        "Incompatibilidad sanguínea (Ictericia Neonatal)": [
            "Incompatibilidad sanguínea",
            "incompatibilidad sanguínotitis"
        ],
        "Incontinencia urinaria (Patología Menopausia y Climaterio)": [
            "Incontinencia urinaria"
        ],
        "Inducción de trabajo de parto (Patología de Trabajo de Parto)": [
            "Inducción de trabajo de parto"
        ],
        "Infarto agudo al miocardio (Síndromes Coronarios)": [
            "Infarto agudo al miocardio",
            "infarto agudo al miocáncerrdio"
        ],
        "Infección de vías urinarias bajas y altas (Urología)": [
            "Infección de vías urinarias bajas y altas",
            "Infección de vías urinarias bajas",
            "altas",
            "ivu bajas y altas",
            "ivu bajas"
        ],
        "Infecto Cardio y Perlas": [
            "Infecto Cardio y Perlas",
            "Infecto Cardio",
            "Perlas",
            "infecto cáncerrdio y perlas",
            "infecto cáncerrdio",
            "Pericarditis",
            "Endocarditis",
            "Miocarditis",
            "Miocardiopatía hipertrófica",
            "Tumores cardíacos"
        ],
        "Infecto Derma": [
            "Infecto Derma",
            "Tiñas inflamatorias y no inflamatorias",
            "Lepra",
            "Acné",
            "Pitiriasis versicolor"
        ],
        "Ingesta de cáusticos (Urgencias Pediátricas)": [
            "Ingesta de cáusticos"
        ],
        "Ingesta de metales pesados (Urgencias Pediátricas)": [
            "Ingesta de metales pesados"
        ],
        "Insuficiencia Cardíaca Aguda y Crónica": [
            "Insuficiencia Cardíaca Aguda y Crónica",
            "Insuficiencia Cardíaca Aguda",
            "Crónica",
            "insuficiencia cáncerrdíaca aguda y crónica",
            "insuficiencia cáncerrdíaca aguda",
            "crónicáncer"
        ],
        "Insuficiencia arterial aguda (Patología Arterial y Venosa)": [
            "Insuficiencia arterial aguda"
        ],
        "Insuficiencia aórtica (Valvulopatías)": [
            "Insuficiencia aórtica",
            "insuficiencia aórticáncer"
        ],
        "Insuficiencia suprarrenal (Patología Central y Suprarrenal)": [
            "Insuficiencia suprarrenal"
        ],
        "Intoxicaciones": [
            "Intoxicaciones",
            "intoxicáncerciones",
            "Toxíndromes: Serotoninérgico",
            "Anticolinérgico",
            "Colinérgico",
            "Simpaticomimético",
            "Opioide"
        ],
        "Intoxicaciones alimentarias (Diarreas Agudas y Crónicas)": [
            "Intoxicaciones alimentarias",
            "intoxicáncerciones alimentarias"
        ],
        "Intoxicaciones por ASA y paracetamol (Urgencias Pediátricas)": [
            "Intoxicaciones por ASA y paracetamol",
            "Intoxicaciones por ASA",
            "paracetamol",
            "intoxicáncerciones por asa y paracetamol",
            "intoxicáncerciones por asa"
        ],
        "Introducción (ATLS)": [
            "Introducción"
        ],
        "Introducción Cardiología": [
            "Introducción Cardiología",
            "introducción cáncerrdiología"
        ],
        "Introducción MI / Introducción Infectología": [
            "Introducción MI / Introducción Infectología",
            "SRIS",
            "Sepsis",
            "Choque séptico",
            "Antibióticos"
        ],
        "Introducción Oftalmología": [
            "Introducción Oftalmología",
            "Generalidades",
            "Ametropías",
            "Patología de anexos",
            "Sx de ojo seco",
            "Blefaritis",
            "Orzuelo",
            "Chalazión",
            "Dacrioadenitis",
            "Trauma ocular",
            "Celulitis periorbitaria"
        ],
        "Introducción a Cirugía y Cirugía Abdominal": [
            "Introducción a Cirugía y Cirugía Abdominal",
            "Introducción a Cirugía",
            "Cirugía Abdominal",
            "Abdomen agudo",
            "Exploración física",
            "Tipo de heridas OX"
        ],
        "Introducción diarreas (Diarrea en el Pediátrico)": [
            "Introducción diarreas",
            "introducción diarrotitiss"
        ],
        "Invaginación intestinal (Patología Gastrointestinal del Pediátrico)": [
            "Invaginación intestinal"
        ],
        "Isquemia mesentérica aguda y crónica (Patología Isquémica Intestinal)": [
            "Isquemia mesentérica aguda y crónica",
            "Isquemia mesentérica aguda",
            "crónica",
            "isquemia mesentéricáncer aguda y crónica",
            "isquemia mesentéricáncer aguda",
            "crónicáncer"
        ],
        "LES (Reumatología)": [
            "LES"
        ],
        "LLA (Leucemias)": [
            "LLA"
        ],
        "LMA (Leucemias)": [
            "LMA"
        ],
        "LMC (Leucemias)": [
            "LMC"
        ],
        "Laringotraqueítis (Patología Respiratoria del Lactante y Preescolar)": [
            "Laringotraqueítis"
        ],
        "Laringotraqueítis bacteriana (Patología Respiratoria del Lactante y Preescolar)": [
            "Laringotraqueítis bacteriana"
        ],
        "Latrodectismo (Mordeduras y Picaduras)": [
            "Latrodectismo"
        ],
        "Lepra (Infecto Derma)": [
            "Lepra"
        ],
        "Leucemias": [
            "Leucemias",
            "LLA",
            "LMA",
            "LMC"
        ],
        "Linfogranuloma venéreo (ETS)": [
            "Linfogranuloma venéreo",
            "linfogranulotitis venéreo"
        ],
        "Linfoma Hodgkin (Oncohematología)": [
            "Linfoma Hodgkin",
            "linfotitis hodgkin"
        ],
        "Linfoma No Hodgkin (Oncohematología)": [
            "Linfoma No Hodgkin",
            "linfotitis no hodgkin"
        ],
        "Liquen plano (Patología Dermatológica)": [
            "Liquen plano"
        ],
        "Litiasis renal (Urología)": [
            "Litiasis renal"
        ],
        "Loxoscelismo (Mordeduras y Picaduras)": [
            "Loxoscelismo"
        ],
        "Malaria (Enfermedades Transmitidas por Vector)": [
            "Malaria"
        ],
        "Malf. anorrectales (Patología Neonatal)": [
            "Malf. anorrectales"
        ],
        "Malf. congénitas (Patología Neonatal)": [
            "Malf. congénitas"
        ],
        "Maltrato infantil (Crecimiento y Desarrollo)": [
            "Maltrato infantil"
        ],
        "Manejo de vía aérea (ATLS)": [
            "Manejo de vía aérea",
            "manejo de vía aérotitis"
        ],
        "Maniobras de Leopold (Control Prenatal)": [
            "Maniobras de Leopold"
        ],
        "Mastitis puerperal y no puerperal (Patología Mamaria Benigna)": [
            "Mastitis puerperal y no puerperal",
            "Mastitis puerperal",
            "no puerperal"
        ],
        "Mastopatía fibroquística (Patología Mamaria Benigna)": [
            "Mastopatía fibroquística",
            "mastopatía fibroquísticáncer"
        ],
        "Materna (Ictericia Neonatal)": [
            "Materna",
            "materecién nacidoa"
        ],
        "Melanoma (Oncoderma)": [
            "Melanoma",
            "melanotitis"
        ],
        "Meningitis (Patología Neonatal Infecciosa)": [
            "Meningitis"
        ],
        "Menopausia (Patología Menopausia y Climaterio)": [
            "Menopausia"
        ],
        "Miastenia gravis (Trastornos del Movimiento / Enf. Neurodegenerativas)": [
            "Miastenia gravis"
        ],
        "Migraña (Cefaleas)": [
            "Migraña"
        ],
        "Miocardiopatía hipertrófica (Infecto Cardio y Perlas)": [
            "Miocardiopatía hipertrófica",
            "miocáncerrdiopatía hipertrófica"
        ],
        "Miocarditis (Infecto Cardio y Perlas)": [
            "Miocarditis",
            "miocáncerrditis"
        ],
        "Miomatosis (Sangrados Uterinos Anormales: Origen Anatómico No Maligno)": [
            "Miomatosis",
            "miotitistosis"
        ],
        "Mitral (Valvulopatías)": [
            "Mitral"
        ],
        "Molusco contagioso (Especialidades Pedia)": [
            "Molusco contagioso"
        ],
        "Mononucleosis (IRAs / Convulsiones)": [
            "Mononucleosis"
        ],
        "Mordedura de serpientes (Mordeduras y Picaduras)": [
            "Mordedura de serpientes"
        ],
        "Mordeduras y Picaduras": [
            "Mordeduras y Picaduras",
            "Mordeduras",
            "Picaduras",
            "mordeduras y picáncerduras",
            "picáncerduras",
            "Alacranismo",
            "Loxoscelismo",
            "Latrodectismo",
            "Mordedura de serpientes"
        ],
        "Muerte súbita (Crecimiento y Desarrollo)": [
            "Muerte súbita"
        ],
        "Nefroblastoma (Especialidades Pedia)": [
            "Nefroblastoma",
            "nefroblastotitis"
        ],
        "Nefrología": [
            "Nefrología",
            "Sx nefríticos",
            "Sx nefrótico",
            "Abscesos renales"
        ],
        "Neumonitis por carbón (Neumonías Ocupacionales / Derrame Pleural)": [
            "Neumonitis por carbón",
            "neumonitis por cáncerrbón"
        ],
        "Neumonía (Patología Neonatal Infecciosa)": [
            "Neumonía"
        ],
        "Neumonías": [
            "Neumonías",
            "Bacterianas",
            "Virales",
            "Atípicas: en el adulto y pediátrico"
        ],
        "Neumonías Ocupacionales / Derrame Pleural": [
            "Neumonías Ocupacionales / Derrame Pleural",
            "Bisinosis",
            "Silicosis",
            "Asbestosis",
            "Neumonitis por carbón",
            "Sarcoidosis",
            "Proteinosis alveolar"
        ],
        "Neuronitis vestibular (Hipoacusia y Vértigo)": [
            "Neuronitis vestibular"
        ],
        "Neuropatía diabética (Complicaciones Diabetes)": [
            "Neuropatía diabética",
            "neuropatía diabéticáncer"
        ],
        "OM2 (Patología del Embarazo)": [
            "OM2"
        ],
        "OMA (Patología Infecciosa / Rinología y Faringe)": [
            "OMA",
            "otitis"
        ],
        "Obesidad (Crecimiento y Desarrollo)": [
            "Obesidad"
        ],
        "Obstrucción de la vía aérea superior (Urgencias Pediátricas)": [
            "Obstrucción de la vía aérea superior",
            "obstrucción de la vía aérotitis superior"
        ],
        "Obstrucción intestinal (Patología Intestinal Qx)": [
            "Obstrucción intestinal"
        ],
        "Oligohidramnios (Parto Prematuro y Patología Coriónica)": [
            "Oligohidramnios"
        ],
        "Oncoderma": [
            "Oncoderma",
            "Melanoma",
            "CA basocelular",
            "CA espinocelular"
        ],
        "Oncohematología": [
            "Oncohematología",
            "Linfoma Hodgkin",
            "Linfoma No Hodgkin"
        ],
        "Oncología Ginecológica": [
            "Oncología Ginecológica",
            "oncología ginecológicáncer",
            "CA de endometrio y CA de ovario",
            "Prevención y tamizaje de CACU",
            "CACU",
            "CA de vagina y vulvar",
            "Patología vulvar Bartolinitis"
        ],
        "Oncopedia: Neuroblastoma (Especialidades Pedia)": [
            "Oncopedia: Neuroblastoma",
            "oncopedia: neuroblastotitis"
        ],
        "Onfalitis (Patología Neonatal Infecciosa)": [
            "Onfalitis"
        ],
        "Onfalocele (Patología Neonatal)": [
            "Onfalocele"
        ],
        "Opioide (Intoxicaciones)": [
            "Opioide"
        ],
        "Orzuelo (Introducción Oftalmología)": [
            "Orzuelo"
        ],
        "Osteoartritis (Reumatología)": [
            "Osteoartritis"
        ],
        "Osteoporosis (Patología Menopausia y Climaterio)": [
            "Osteoporosis"
        ],
        "Osteosarcoma (Especialidades Pedia)": [
            "Osteosarcoma",
            "osteosarcotitis"
        ],
        "Otitis media maligna (Patología Infecciosa / Rinología y Faringe)": [
            "Otitis media maligna",
            "oma media maligna",
            "ea media maligna"
        ],
        "Otoesclerosis (Hipoacusia y Vértigo)": [
            "Otoesclerosis"
        ],
        "Oxiuriasis (Enfermedades Parasitarias)": [
            "Oxiuriasis"
        ],
        "Paladar hendido (Patología Neonatal)": [
            "Paladar hendido"
        ],
        "Paludismo (Enfermedades Transmitidas por Vector)": [
            "Paludismo"
        ],
        "Pancreatitis aguda y crónica (Patología Pancreática)": [
            "Pancreatitis aguda y crónica",
            "Pancreatitis aguda",
            "crónica",
            "pancreatitis aguda y crónicáncer",
            "pancrotitistitis aguda y crónica",
            "pancrotitistitis aguda",
            "crónicáncer"
        ],
        "Papiloma intraductal (Patología Mamaria Benigna)": [
            "Papiloma intraductal",
            "papilotitis intraductal"
        ],
        "Papilomatosis laríngea (Patología Infecciosa / Rinología y Faringe)": [
            "Papilomatosis laríngea",
            "papilotitistosis laríngea",
            "papilomatosis laríngotitis"
        ],
        "Parkinson (Trastornos del Movimiento / Enf. Neurodegenerativas)": [
            "Parkinson"
        ],
        "Parto Prematuro y Patología Coriónica": [
            "Parto Prematuro y Patología Coriónica",
            "Parto Prematuro",
            "Patología Coriónica",
            "parto prematuro y patología coriónicáncer",
            "patología coriónicáncer",
            "Parto prematuro",
            "RPM",
            "Poli",
            "Oligohidramnios",
            "Corioamnionitis"
        ],
        "Parto prematuro (Parto Prematuro y Patología Coriónica)": [
            "Parto prematuro"
        ],
        "Parálisis braquial (Recién Nacido Sano)": [
            "Parálisis braquial"
        ],
        "Parálisis flácida Sx de Guillain Barré (Trastornos del Movimiento / Enf. Neurodegenerativas)": [
            "Parálisis flácida Sx de Guillain Barré",
            "parálisis flácida síndrome de guillain barré"
        ],
        "Patología Arterial y Venosa": [
            "Patología Arterial y Venosa",
            "Patología Arterial",
            "Venosa",
            "Insuficiencia arterial aguda",
            "Enfermedad arterial periférica",
            "Trombosis venosa profunda",
            "Tromboembolia pulmonar"
        ],
        "Patología Biliar": [
            "Patología Biliar",
            "Colecistitis",
            "Colelitiasis",
            "Coledocolitiasis",
            "Colangitis",
            "Íleo biliar"
        ],
        "Patología Central y Suprarrenal": [
            "Patología Central y Suprarrenal",
            "Patología Central",
            "Suprarrenal",
            "Diabetes insípida",
            "Hiperprolactinemia",
            "Enfermedad de Addison",
            "Sx de Cushing",
            "Insuficiencia suprarrenal"
        ],
        "Patología Cámara Anterior": [
            "Patología Cámara Anterior",
            "Conjuntivitis",
            "Escleritis",
            "Epiescleritis",
            "Queratocono",
            "Tracoma",
            "Pterigión",
            "Pinguécula"
        ],
        "Patología Cámara Posterior": [
            "Patología Cámara Posterior",
            "Catarata",
            "Glaucoma",
            "Uveítis",
            "Desprendimiento de retina",
            "Retinopatía diabética",
            "Retinopatía hipertensiva"
        ],
        "Patología Dermatológica": [
            "Patología Dermatológica",
            "patología dermatológicáncer",
            "Liquen plano",
            "Vitiligo",
            "Psoriasis",
            "Pénfigo vulgar",
            "Pitiriasis rosada",
            "Sx de Stevens Johnson"
        ],
        "Patología Diverticular": [
            "Patología Diverticular",
            "Diverticulosis",
            "Diverticulitis",
            "Enfermedad diverticular"
        ],
        "Patología Esofágica": [
            "Patología Esofágica",
            "patología esofágicáncer",
            "Abdomen agudo",
            "Exploración física",
            "Tipo de heridas OX"
        ],
        "Patología Gastrointestinal del Pediátrico": [
            "Patología Gastrointestinal del Pediátrico",
            "Invaginación intestinal",
            "Divertículo de Meckel",
            "Enf. de Hirschsprung",
            "ERGE"
        ],
        "Patología Gástrica": [
            "Patología Gástrica",
            "patología gástricáncer",
            "Gastritis aguda o crónica",
            "Úlcera péptica duodenal y gástrica",
            "Úlcera péptica complicada y perforada",
            "Zollinger-Ellison",
            "Dispepsia funcional"
        ],
        "Patología Hepática": [
            "Patología Hepática",
            "patología hepáticáncer",
            "Hepatitis agudas y crónicas",
            "Enfermedad hepática grasa"
        ],
        "Patología Infecciosa / Rinología y Faringe": [
            "Patología Infecciosa / Rinología y Faringe",
            "Patología Infecciosa / Rinología",
            "Faringe",
            "OMA",
            "EA",
            "Otitis media maligna",
            "SAOS",
            "CA de laringe",
            "Absceso periamigdalino y faríngeo",
            "Papilomatosis laríngea"
        ],
        "Patología Infecciosa Cervical": [
            "Patología Infecciosa Cervical",
            "patología infecciosa cervicáncerl",
            "Cervicovaginitis bacteriana",
            "Cándida",
            "Trichomonas",
            "Enfermedad pélvica inflamatoria",
            "Endocervicitis"
        ],
        "Patología Intestinal Inflamatoria": [
            "Patología Intestinal Inflamatoria",
            "Colitis ulcerosa",
            "Enfermedad de Crohn",
            "Sx de intestino irritable"
        ],
        "Patología Intestinal Qx": [
            "Patología Intestinal Qx",
            "Obstrucción intestinal",
            "Vólvulo de colon y ciego"
        ],
        "Patología Isquémica Intestinal": [
            "Patología Isquémica Intestinal",
            "patología isquémicáncer intestinal",
            "Isquemia mesentérica aguda y crónica"
        ],
        "Patología Mamaria Benigna": [
            "Patología Mamaria Benigna",
            "Mastopatía fibroquística",
            "Fibroadenoma",
            "Mastitis puerperal y no puerperal",
            "Papiloma intraductal"
        ],
        "Patología Menopausia y Climaterio": [
            "Patología Menopausia y Climaterio",
            "Patología Menopausia",
            "Climaterio",
            "Menopausia",
            "Sx climatérico",
            "Osteoporosis",
            "Incontinencia urinaria",
            "Trastornos del piso pélvico"
        ],
        "Patología Neonatal": [
            "Patología Neonatal",
            "Asfixia",
            "EHI",
            "Hemorragia de matriz germinal",
            "Malf. congénitas",
            "Hernias diafragmáticas",
            "Atresia de las coanas",
            "A. pilórica",
            "A. duodenal",
            "A. esofágica",
            "Onfalocele",
            "Gastrosquisis",
            "Espina bífida",
            "Paladar hendido",
            "Malf. anorrectales"
        ],
        "Patología Neonatal Congénita Infecciosa": [
            "Patología Neonatal Congénita Infecciosa",
            "TORCH Citomegalovirus",
            "Toxoplasmosis",
            "Rubéola",
            "Varicela",
            "Sífilis",
            "Herpes y VIH el binomio"
        ],
        "Patología Neonatal Infecciosa": [
            "Patología Neonatal Infecciosa",
            "Sepsis",
            "Neumonía",
            "Meningitis",
            "Enterocolitis necrotizante",
            "Onfalitis"
        ],
        "Patología Pancreática": [
            "Patología Pancreática",
            "patología pancreáticáncer",
            "Pancreatitis aguda y crónica"
        ],
        "Patología Perianal": [
            "Patología Perianal",
            "Hemorroides",
            "Abscesos",
            "Fisuras",
            "Fístulas"
        ],
        "Patología Prostática": [
            "Patología Prostática",
            "patología prostáticáncer",
            "Hiperplasia prostática",
            "Prostatitis"
        ],
        "Patología Puerperal": [
            "Patología Puerperal",
            "Hemorragia obstétrica Atonía, trauma, tejido, coagulopatías",
            "Choque en la paciente embarazada",
            "Sepsis materna"
        ],
        "Patología Respiratoria del Lactante y Preescolar": [
            "Patología Respiratoria del Lactante y Preescolar",
            "Patología Respiratoria del Lactante",
            "Preescolar",
            "patología respinfección respiratoriatoria del lactante y preescolar",
            "patología respinfección respiratoriatoria del lactante",
            "Bronquiolitis",
            "Laringotraqueítis",
            "Epiglotitis",
            "Tos ferina",
            "Laringotraqueítis bacteriana"
        ],
        "Patología Respiratoria del Pediátrico": [
            "Patología Respiratoria del Pediátrico",
            "patología respinfección respiratoriatoria del pediátrico",
            "EMH",
            "TTRN",
            "SAM",
            "Displasia",
            "Hipertensión pulmonar",
            "Apnea del prematuro"
        ],
        "Patología Tiroidea": [
            "Patología Tiroidea",
            "patología tiroidotitis",
            "Hipertiroidismo: Enfermedad de Graves",
            "Tiroiditis de Riedel",
            "Tiroiditis de Quervain",
            "Tirotoxicosis",
            "Hipotiroidismo",
            "Hashimoto",
            "Coma mixedematoso",
            "Cáncer de tiroides"
        ],
        "Patología de Extremidad Inferior": [
            "Patología de Extremidad Inferior",
            "Fx de cadera",
            "Fx de extremidades inferiores",
            "Esguince de tobillo"
        ],
        "Patología de Extremidad Superior": [
            "Patología de Extremidad Superior",
            "Fx de brazo",
            "Antebrazo y mano",
            "Patología de hombro doloroso"
        ],
        "Patología de Trabajo de Parto": [
            "Patología de Trabajo de Parto",
            "Inducción de trabajo de parto",
            "Cesárea",
            "Distocias",
            "Embarazo gemelar"
        ],
        "Patología de anexos (Introducción Oftalmología)": [
            "Patología de anexos"
        ],
        "Patología de hombro doloroso (Patología de Extremidad Superior)": [
            "Patología de hombro doloroso"
        ],
        "Patología del Embarazo": [
            "Patología del Embarazo",
            "OM2",
            "Patología hepática del embarazo"
        ],
        "Patología del Embarazo: Estados Hipertensivos": [
            "Patología del Embarazo: Estados Hipertensivos",
            "Hipertensión crónica en el embarazo",
            "Hipertensión gestacional",
            "Preeclampsia",
            "Eclampsia",
            "Sx de HELLP"
        ],
        "Patología hepática del embarazo (Patología del Embarazo)": [
            "Patología hepática del embarazo",
            "patología hepáticáncer del embarazo"
        ],
        "Patología tiroidea en el embarazo (Control Prenatal)": [
            "Patología tiroidea en el embarazo",
            "patología tiroidotitis en el embarazo"
        ],
        "Patología vulvar Bartolinitis (Oncología Ginecológica)": [
            "Patología vulvar Bartolinitis"
        ],
        "Pericarditis (Infecto Cardio y Perlas)": [
            "Pericarditis",
            "pericáncerrditis"
        ],
        "Peritonitis bacteriana espontánea (Cirrosis y sus Complicaciones / Trasplante Hepático)": [
            "Peritonitis bacteriana espontánea",
            "peritonitis bacteriana espontánotitis"
        ],
        "Perlas": [
            "Perlas"
        ],
        "Pie diabético (Complicaciones Diabetes)": [
            "Pie diabético"
        ],
        "Pie plano (Especialidades Pedia)": [
            "Pie plano"
        ],
        "Pinguécula (Patología Cámara Anterior)": [
            "Pinguécula"
        ],
        "Pitiriasis rosada (Patología Dermatológica)": [
            "Pitiriasis rosada"
        ],
        "Pitiriasis versicolor (Infecto Derma)": [
            "Pitiriasis versicolor"
        ],
        "Placenta previa (Hemorragias del Segundo Trimestre)": [
            "Placenta previa"
        ],
        "Planes de hidratación (Diarrea en el Pediátrico)": [
            "Planes de hidratación"
        ],
        "Poli (Parto Prematuro y Patología Coriónica)": [
            "Poli"
        ],
        "Poliposis (Sangrados Uterinos Anormales: Origen Anatómico No Maligno)": [
            "Poliposis"
        ],
        "Preeclampsia (Patología del Embarazo: Estados Hipertensivos)": [
            "Preeclampsia",
            "hipertensión",
            "prehipertensión"
        ],
        "Prevención y tamizaje de CACU (Oncología Ginecológica)": [
            "Prevención y tamizaje de CACU",
            "Prevención",
            "tamizaje de CACU",
            "prevención y tamizaje de cáncercu",
            "prevención y tamizaje de cáncer cervicouterino",
            "tamizaje de cáncercu",
            "tamizaje de cáncer cervicouterino"
        ],
        "Prostatitis (Patología Prostática)": [
            "Prostatitis"
        ],
        "Proteinosis alveolar (Neumonías Ocupacionales / Derrame Pleural)": [
            "Proteinosis alveolar"
        ],
        "Psiquiatría": [
            "Psiquiatría",
            "Sx nefríticos",
            "Sx nefrótico",
            "Abscesos renales",
            "Adicciones",
            "Delirium tremens",
            "Autismo",
            "TDAH",
            "Esquizofrenia",
            "Trastornos del sueño"
        ],
        "Psoriasis (Patología Dermatológica)": [
            "Psoriasis"
        ],
        "Pterigión (Patología Cámara Anterior)": [
            "Pterigión"
        ],
        "Páncreas (Cirugía Oncología)": [
            "Páncreas",
            "páncrotitiss"
        ],
        "Pénfigo vulgar (Patología Dermatológica)": [
            "Pénfigo vulgar"
        ],
        "Púrpura trombocitopénica (Anormalidades de la Hemostasia y Perlas)": [
            "Púrpura trombocitopénica",
            "púrpura trombocitopénicáncer"
        ],
        "Púrpura trombocitopénica. Ortopedia: Displasia de cadera (Especialidades Pedia)": [
            "Púrpura trombocitopénica. Ortopedia: Displasia de cadera",
            "púrpura trombocitopénicáncer. ortopedia: displasia de cadera"
        ],
        "Quemaduras / Golpe de Calor / Hipotermia": [
            "Quemaduras / Golpe de Calor / Hipotermia",
            "quemaduras / golpe de cáncerlor / hipotermia"
        ],
        "Queratocono (Patología Cámara Anterior)": [
            "Queratocono"
        ],
        "R. uterina (Hemorragias del Segundo Trimestre)": [
            "R. uterina"
        ],
        "RN sano (Recién Nacido Sano)": [
            "RN sano",
            "recién nacido sano"
        ],
        "RPM (Parto Prematuro y Patología Coriónica)": [
            "RPM",
            "ruptura prematura de membranas"
        ],
        "Reacciones de hipersensibilidad (Reumatología)": [
            "Reacciones de hipersensibilidad",
            "rotitiscciones de hipersensibilidad"
        ],
        "Reanimación Neonatal": [
            "Reanimación Neonatal",
            "rotitisnimación neonatal"
        ],
        "Recién Nacido Sano": [
            "Recién Nacido Sano",
            "rn sano",
            "RN sano",
            "Cuidados del recién nacido",
            "Tamizajes del RN",
            "Cefalohematoma",
            "Parálisis braquial",
            "Alteraciones dermatológicas al nacimiento"
        ],
        "Reflujo vesicoureteral (Uropedia)": [
            "Reflujo vesicoureteral"
        ],
        "Resfriado común (IRAs / Convulsiones)": [
            "Resfriado común"
        ],
        "Retinopatía diabética (Patología Cámara Posterior)": [
            "Retinopatía diabética",
            "retinopatía diabéticáncer"
        ],
        "Retinopatía hipertensiva (Patología Cámara Posterior)": [
            "Retinopatía hipertensiva"
        ],
        "Reumatología": [
            "Reumatología",
            "Reacciones de hipersensibilidad",
            "Artritis reumatoide",
            "Osteoartritis",
            "Espondilopatías",
            "Fibromialgia",
            "LES",
            "Vasculitis",
            "Granulomatosis",
            "Sx de Sjögren"
        ],
        "Rickettsiosis (Enfermedades por Zoonosis)": [
            "Rickettsiosis"
        ],
        "Rubéola (Patología Neonatal Congénita Infecciosa)": [
            "Rubéola"
        ],
        "Rubéola (Enfermedades Exantemáticas)": [
            "Rubéola"
        ],
        "SAM (Patología Respiratoria del Pediátrico)": [
            "SAM"
        ],
        "SAOS (Patología Infecciosa / Rinología y Faringe)": [
            "SAOS"
        ],
        "SOP (Sangrados Uterinos Anormales: Origen No Anatómico)": [
            "SOP",
            "síndrome de ovario poliquístico"
        ],
        "SRIS (Introducción MI / Introducción Infectología)": [
            "SRIS"
        ],
        "STDA por várices esofágicas (Cirrosis y sus Complicaciones / Trasplante Hepático)": [
            "STDA por várices esofágicas",
            "stda por várices esofágicáncers",
            "sangrado de tubo digestivo alto por várices esofágicas"
        ],
        "Sangrados Uterinos Anormales: Origen Anatómico No Maligno": [
            "Sangrados Uterinos Anormales: Origen Anatómico No Maligno",
            "hemorragias uterinos anormales: origen anatómico no maligno",
            "Adenomiosis",
            "Poliposis",
            "Miomatosis",
            "Torsión ovárica"
        ],
        "Sangrados Uterinos Anormales: Origen No Anatómico": [
            "Sangrados Uterinos Anormales: Origen No Anatómico",
            "hemorragias uterinos anormales: origen no anatómico",
            "Sangrados uterinos de origen desconocido",
            "SOP",
            "Endometriosis",
            "Coagulopatías"
        ],
        "Sangrados uterinos de origen desconocido (Sangrados Uterinos Anormales: Origen No Anatómico)": [
            "Sangrados uterinos de origen desconocido",
            "hemorragias uterinos de origen desconocido"
        ],
        "Sarampión (Enfermedades Exantemáticas)": [
            "Sarampión"
        ],
        "Sarcoidosis (Neumonías Ocupacionales / Derrame Pleural)": [
            "Sarcoidosis"
        ],
        "Sarcoma de Ewing. Dermapedia: Dermatitis atópica (Especialidades Pedia)": [
            "Sarcoma de Ewing. Dermapedia: Dermatitis atópica",
            "sarcoma de ewing. dermapedia: dermatitis atópicáncer",
            "sarcotitis de ewing. dermapedia: dermatitis atópica"
        ],
        "Sepsis (Patología Neonatal Infecciosa)": [
            "Sepsis"
        ],
        "Sepsis (Introducción MI / Introducción Infectología)": [
            "Sepsis"
        ],
        "Sepsis materna (Patología Puerperal)": [
            "Sepsis materna",
            "sepsis materecién nacidoa"
        ],
        "Silicosis (Neumonías Ocupacionales / Derrame Pleural)": [
            "Silicosis"
        ],
        "Simpaticomimético (Intoxicaciones)": [
            "Simpaticomimético"
        ],
        "Sx Asherman (Amenorreas Primarias y Secundarias)": [
            "Sx Asherman",
            "síndrome asherman"
        ],
        "Sx Klinefelter (Alteraciones Cromosómicas y Perlas)": [
            "Sx Klinefelter",
            "síndrome klinefelter"
        ],
        "Sx Mielodisplásicos (Anormalidades de la Hemostasia y Perlas)": [
            "Sx Mielodisplásicos",
            "síndrome mielodisplásicos"
        ],
        "Sx Mieloproliferativos (Anormalidades de la Hemostasia y Perlas)": [
            "Sx Mieloproliferativos",
            "síndrome mieloproliferativos"
        ],
        "Sx Patau (Alteraciones Cromosómicas y Perlas)": [
            "Sx Patau",
            "síndrome patau"
        ],
        "Sx Rokitansky (Amenorreas Primarias y Secundarias)": [
            "Sx Rokitansky",
            "síndrome rokitansky"
        ],
        "Sx climatérico (Patología Menopausia y Climaterio)": [
            "Sx climatérico",
            "síndrome climatérico"
        ],
        "Sx compartimental (Trauma Generalidades y Complicaciones)": [
            "Sx compartimental",
            "síndrome compartimental"
        ],
        "Sx de Cushing (Patología Central y Suprarrenal)": [
            "Sx de Cushing",
            "síndrome de cushing"
        ],
        "Sx de Down (Alteraciones Cromosómicas y Perlas)": [
            "Sx de Down",
            "síndrome de down"
        ],
        "Sx de Edwards (Alteraciones Cromosómicas y Perlas)": [
            "Sx de Edwards",
            "síndrome de edwards"
        ],
        "Sx de HELLP (Patología del Embarazo: Estados Hipertensivos)": [
            "Sx de HELLP",
            "síndrome de hellp"
        ],
        "Sx de Kallman (Amenorreas Primarias y Secundarias)": [
            "Sx de Kallman",
            "síndrome de kallman"
        ],
        "Sx de Lynch (Cirugía Oncología)": [
            "Sx de Lynch",
            "síndrome de lynch"
        ],
        "Sx de Meniere (Hipoacusia y Vértigo)": [
            "Sx de Meniere",
            "síndrome de meniere"
        ],
        "Sx de Morris (Amenorreas Primarias y Secundarias)": [
            "Sx de Morris",
            "síndrome de morris"
        ],
        "Sx de Prader Willi (Amenorreas Primarias y Secundarias)": [
            "Sx de Prader Willi",
            "síndrome de prader willi"
        ],
        "Sx de Sheehan (Amenorreas Primarias y Secundarias)": [
            "Sx de Sheehan",
            "síndrome de sheehan"
        ],
        "Sx de Sjögren (Reumatología)": [
            "Sx de Sjögren",
            "síndrome de sjögren"
        ],
        "Sx de Stevens Johnson (Patología Dermatológica)": [
            "Sx de Stevens Johnson",
            "síndrome de stevens johnson"
        ],
        "Sx de Swyer (Amenorreas Primarias y Secundarias)": [
            "Sx de Swyer",
            "síndrome de swyer"
        ],
        "Sx de Turner (Amenorreas Primarias y Secundarias)": [
            "Sx de Turner",
            "síndrome de turner",
            "sx de turecién nacidoer"
        ],
        "Sx de dolor locoregional (Trauma Generalidades y Complicaciones)": [
            "Sx de dolor locoregional",
            "síndrome de dolor locoregional"
        ],
        "Sx de intestino irritable (Patología Intestinal Inflamatoria)": [
            "Sx de intestino irritable",
            "síndrome de intestino irritable"
        ],
        "Sx de ojo seco (Introducción Oftalmología)": [
            "Sx de ojo seco",
            "síndrome de ojo seco"
        ],
        "Sx de piel escaldada (Especialidades Pedia)": [
            "Sx de piel escaldada",
            "síndrome de piel escaldada",
            "sx de piel escáncerldada"
        ],
        "Sx de shock tóxico (Especialidades Pedia)": [
            "Sx de shock tóxico",
            "síndrome de shock tóxico"
        ],
        "Sx geriátricos (Geriatría)": [
            "Sx geriátricos",
            "síndrome geriátricos"
        ],
        "Sx medulares (ATLS)": [
            "Sx medulares",
            "síndrome medulares"
        ],
        "Sx nefríticos (Nefrología)": [
            "Sx nefríticos",
            "síndrome nefríticos"
        ],
        "Sx nefríticos (Psiquiatría)": [
            "Sx nefríticos",
            "síndrome nefríticos"
        ],
        "Sx nefrótico (Nefrología)": [
            "Sx nefrótico",
            "síndrome nefrótico"
        ],
        "Sx nefrótico (Psiquiatría)": [
            "Sx nefrótico",
            "síndrome nefrótico"
        ],
        "Sífilis (Patología Neonatal Congénita Infecciosa)": [
            "Sífilis"
        ],
        "Sífilis (ETS)": [
            "Sífilis"
        ],
        "Síndrome Metabólico": [
            "Síndrome Metabólico",
            "sx metabólico"
        ],
        "Síndromes Coronarios": [
            "Síndromes Coronarios",
            "sxs coronarios",
            "Angina estable e inestable",
            "Infarto agudo al miocardio"
        ],
        "TCE hemorragia epidural, subaracnoidea, subdural (ATLS)": [
            "TCE hemorragia epidural, subaracnoidea, subdural",
            "TCE hemorragia epidural",
            "subaracnoidea",
            "subdural",
            "trauma craneoencefálico hemorragia epidural, subaracnoidea, subdural",
            "tce hemorragia enfermedad pélvica inflamatoriadural, subaracnoidea, subdural",
            "tce sangrado epidural, subaracnoidea, subdural",
            "tce atonía epidural, subaracnoidea, subdural",
            "tce hemorragia epidural, subaracnoidotitis, subdural",
            "trauma craneoencefálico hemorragia epidural",
            "tce hemorragia enfermedad pélvica inflamatoriadural",
            "tce sangrado epidural",
            "tce atonía epidural",
            "subaracnoidotitis"
        ],
        "TDAH (Psiquiatría)": [
            "TDAH"
        ],
        "TORCH Citomegalovirus (Patología Neonatal Congénita Infecciosa)": [
            "TORCH Citomegalovirus"
        ],
        "TTRN (Patología Respiratoria del Pediátrico)": [
            "TTRN",
            "ttrecién nacido"
        ],
        "Taeniasis cisticercosis (Enfermedades Parasitarias)": [
            "Taeniasis cisticercosis"
        ],
        "Talasemias (Anemias Hemolíticas)": [
            "Talasemias"
        ],
        "Talla baja (Crecimiento y Desarrollo)": [
            "Talla baja"
        ],
        "Tamiz Metabólico": [
            "Tamiz Metabólico",
            "Hipotiroidismo",
            "Fenilcetonuria",
            "Galactosemia",
            "Deficiencia de biotinidasa",
            "Hiperplasia suprarrenal",
            "Fibrosis quística"
        ],
        "Tamizajes del RN (Recién Nacido Sano)": [
            "Tamizajes del RN",
            "tamizajes del recién nacido"
        ],
        "Taquicardia supraventricular (Trastornos del Ritmo)": [
            "Taquicardia supraventricular",
            "taquicáncerrdia supraventricular"
        ],
        "Temblor esencial (Trastornos del Movimiento / Enf. Neurodegenerativas)": [
            "Temblor esencial"
        ],
        "Tipo de heridas OX (Introducción a Cirugía y Cirugía Abdominal)": [
            "Tipo de heridas OX"
        ],
        "Tipo de heridas OX (Patología Esofágica)": [
            "Tipo de heridas OX"
        ],
        "Tiroiditis de Quervain (Patología Tiroidea)": [
            "Tiroiditis de Quervain"
        ],
        "Tiroiditis de Riedel (Patología Tiroidea)": [
            "Tiroiditis de Riedel"
        ],
        "Tirotoxicosis (Patología Tiroidea)": [
            "Tirotoxicosis"
        ],
        "Tiñas inflamatorias y no inflamatorias (Infecto Derma)": [
            "Tiñas inflamatorias y no inflamatorias",
            "Tiñas inflamatorias",
            "no inflamatorias"
        ],
        "Torsión del apéndice testicular (Uropedia)": [
            "Torsión del apéndice testicular"
        ],
        "Torsión ovárica (Sangrados Uterinos Anormales: Origen Anatómico No Maligno)": [
            "Torsión ovárica",
            "torsión ováricáncer"
        ],
        "Torsión testicular (Uropedia)": [
            "Torsión testicular"
        ],
        "Tos ferina (Patología Respiratoria del Lactante y Preescolar)": [
            "Tos ferina"
        ],
        "Toxoplasmosis (Patología Neonatal Congénita Infecciosa)": [
            "Toxoplasmosis"
        ],
        "Toxíndromes: Serotoninérgico (Intoxicaciones)": [
            "Toxíndromes: Serotoninérgico"
        ],
        "Trabajo de Parto": [
            "Trabajo de Parto",
            "Fisiológico",
            "Violencia obstétrica"
        ],
        "Tracoma (Patología Cámara Anterior)": [
            "Tracoma",
            "tracotitis"
        ],
        "Transposición de grandes vasos (Cardiopedia)": [
            "Transposición de grandes vasos"
        ],
        "Trastornos del Movimiento / Enf. Neurodegenerativas": [
            "Trastornos del Movimiento / Enf. Neurodegenerativas",
            "trastorecién nacidoos del movimiento / enf. neurodegenerativas",
            "Parkinson",
            "ELA",
            "Esclerosis múltiple",
            "Temblor esencial",
            "Miastenia gravis",
            "Parálisis flácida Sx de Guillain Barré"
        ],
        "Trastornos del Ritmo": [
            "Trastornos del Ritmo",
            "trastorecién nacidoos del ritmo",
            "Fibrilación auricular",
            "Flutter auricular",
            "Taquicardia supraventricular",
            "Fibrilación ventricular"
        ],
        "Trastornos del piso pélvico (Patología Menopausia y Climaterio)": [
            "Trastornos del piso pélvico",
            "trastorecién nacidoos del piso pélvico"
        ],
        "Trastornos del sueño (Psiquiatría)": [
            "Trastornos del sueño",
            "trastorecién nacidoos del sueño"
        ],
        "Trauma Generalidades y Complicaciones": [
            "Trauma Generalidades y Complicaciones",
            "Trauma Generalidades",
            "Complicaciones",
            "trauma generalidades y complicáncerciones",
            "complicáncerciones",
            "Fx en rama verde",
            "Sx compartimental",
            "Sx de dolor locoregional",
            "Embolia grasa"
        ],
        "Trauma abdominal, Fx de cadera, trauma genitourinario, ATLS en la embarazada (ATLS)": [
            "Trauma abdominal, Fx de cadera, trauma genitourinario, ATLS en la embarazada",
            "Trauma abdominal",
            "Fx de cadera",
            "trauma genitourinario",
            "ATLS en la embarazada",
            "trauma abdominal, fx de cáncerdera, trauma genitourinario, atls en la embarazada",
            "fx de cáncerdera"
        ],
        "Trauma ocular (Introducción Oftalmología)": [
            "Trauma ocular"
        ],
        "Trauma torácico Neumotórax a tensión, taponamiento cardíaco, hemotórax masivo, neumotórax abierto, tórax inestable (ATLS)": [
            "Trauma torácico Neumotórax a tensión, taponamiento cardíaco, hemotórax masivo, neumotórax abierto, tórax inestable",
            "Trauma torácico Neumotórax a tensión",
            "taponamiento cardíaco",
            "hemotórax masivo",
            "neumotórax abierto",
            "tórax inestable",
            "trauma torácico neumotórax a tensión, taponamiento cáncerrdíaco, hemotórax masivo, neumotórax abierto, tórax inestable",
            "taponamiento cáncerrdíaco"
        ],
        "Trichomonas (Patología Infecciosa Cervical)": [
            "Trichomonas"
        ],
        "Tromboembolia pulmonar (Patología Arterial y Venosa)": [
            "Tromboembolia pulmonar"
        ],
        "Trombosis venosa profunda (Patología Arterial y Venosa)": [
            "Trombosis venosa profunda"
        ],
        "Tuberculosis": [
            "Tuberculosis"
        ],
        "Tularemia (Enfermedades por Zoonosis)": [
            "Tularemia"
        ],
        "Tumores cardíacos (Infecto Cardio y Perlas)": [
            "Tumores cardíacos",
            "tumores cáncerrdíacos"
        ],
        "Tétanos / Botulismo / Rabia / Patología Fúngica": [
            "Tétanos / Botulismo / Rabia / Patología Fúngica",
            "tétanos / botulismo / rabia / patología fúngicáncer"
        ],
        "Urgencias Pediátricas": [
            "Urgencias Pediátricas",
            "urgencias pediátricáncers",
            "Intoxicaciones por ASA y paracetamol",
            "Ingesta de cáusticos",
            "Ingesta de metales pesados",
            "Obstrucción de la vía aérea superior"
        ],
        "Urología": [
            "Urología",
            "Infección de vías urinarias bajas y altas",
            "Litiasis renal"
        ],
        "Uropedia": [
            "Uropedia",
            "Torsión testicular",
            "Torsión del apéndice testicular",
            "Epididimitis",
            "IVUs",
            "Reflujo vesicoureteral"
        ],
        "Uveítis (Patología Cámara Posterior)": [
            "Uveítis"
        ],
        "VPPN (Hipoacusia y Vértigo)": [
            "VPPN"
        ],
        "Vacunación": [
            "Vacunación"
        ],
        "Vacunas (Control Prenatal)": [
            "Vacunas"
        ],
        "Valvulopatías": [
            "Valvulopatías",
            "Insuficiencia aórtica",
            "Mitral",
            "Estenosis aórtica y mitral"
        ],
        "Varicela (Patología Neonatal Congénita Infecciosa)": [
            "Varicela"
        ],
        "Varicela (Enfermedades Exantemáticas)": [
            "Varicela"
        ],
        "Vasa previa (Hemorragias del Segundo Trimestre)": [
            "Vasa previa"
        ],
        "Vasculitis (Reumatología)": [
            "Vasculitis"
        ],
        "Violencia obstétrica (Trabajo de Parto)": [
            "Violencia obstétrica",
            "violencia obstétricáncer"
        ],
        "Virales (Neumonías)": [
            "Virales",
            "vinfección respiratoriales"
        ],
        "Virus de la Inmunodeficiencia Humana": [
            "Virus de la Inmunodeficiencia Humana"
        ],
        "Vitiligo (Patología Dermatológica)": [
            "Vitiligo"
        ],
        "Vólvulo de colon y ciego (Patología Intestinal Qx)": [
            "Vólvulo de colon y ciego",
            "Vólvulo de colon",
            "ciego"
        ],
        "Zika (Enfermedades Transmitidas por Vector)": [
            "Zika"
        ],
        "Zollinger-Ellison (Patología Gástrica)": [
            "Zollinger-Ellison"
        ],
        "Íleo biliar (Patología Biliar)": [
            "Íleo biliar"
        ],
        "Úlcera péptica complicada y perforada (Patología Gástrica)": [
            "Úlcera péptica complicada y perforada",
            "Úlcera péptica complicada",
            "perforada",
            "úlcera pépticáncer complicada y perforada",
            "úlcera pépticáncer complicada"
        ],
        "Úlcera péptica duodenal y gástrica (Patología Gástrica)": [
            "Úlcera péptica duodenal y gástrica",
            "Úlcera péptica duodenal",
            "gástrica",
            "úlcera pépticáncer duodenal y gástrica",
            "úlcera pépticáncer duodenal",
            "gástricáncer"
        ]
    };

    // ---------------------------------------------------------------------------
    // Advanced Setup Logic: Topic Search & Tags
    // ---------------------------------------------------------------------------
    const setupTopicSearch = () => {
        const input = $("setup-topic-filter");
        const suggestionsCont = $("topic-suggestions");
        const selectedCont = $("selected-topics-container");
        let activeIndex = -1;

        if (!input || !suggestionsCont || !selectedCont) return;

        const updateSelectedTags = () => {
            selectedCont.innerHTML = "";
            State.selectedTopics.forEach((topic, index) => {
                const tag = document.createElement("div");
                tag.className = "topic-tag";
                tag.innerHTML = `
                    <span>${topic}</span>
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

            // Combinar temario oficial + temas reales del banco de preguntas
            const realTemas = typeof QUESTIONS !== 'undefined'
                ? [...new Set(QUESTIONS.map(q => q.tema).filter(Boolean))]
                : [];
            const combinedTopics = [...new Set([...OFFICIAL_TEMARIO, ...realTemas])].sort();

            const removeAccents = (str) => {
                return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            };

            const searchVal = removeAccents(normalizedVal);

            const filtered = combinedTopics.filter(t => {
                const normalizedTopic = removeAccents(t.toLowerCase());
                return normalizedTopic.includes(searchVal) && !State.selectedTopics.includes(t);
            }).slice(0, 12);

            if (filtered.length === 0) {
                suggestionsCont.classList.remove("active");
                return;
            }

            suggestionsCont.innerHTML = "";
            activeIndex = -1;

            // Contar preguntas por tema para mostrar badge
            const temaCounts = {};
            if (typeof QUESTIONS !== 'undefined') {
                QUESTIONS.forEach(q => { if (q.tema) temaCounts[q.tema] = (temaCounts[q.tema] || 0) + 1; });
            }

            filtered.forEach((topic, idx) => {
                const item = document.createElement("div");
                item.className = "suggestion-item";
                item.style.cssText = "display:flex; justify-content:space-between; align-items:center; gap:8px;";
                const count = temaCounts[topic] || 0;
                item.innerHTML = `<span>${topic}</span>${count > 0 ? `<span style="font-size:10px;color:var(--accent-green);font-weight:700;background:rgba(5,192,127,0.12);padding:1px 6px;border-radius:10px;flex-shrink:0;">${count}</span>` : ''}`;
                item.dataset.index = idx;
                item.onclick = () => {
                    addTopic(topic);
                };
                suggestionsCont.appendChild(item);
            });
            suggestionsCont.classList.add("active");
        };

        const addTopic = (topic) => {
            if (!isPremiumActive()) {
                showNotification("Temas específicos disponibles solo en premium.", "warning");
                openRedeemModal("Desbloquea premium para usar filtros por tema/GPC.");
                return;
            }
            const cleanTopic = getUnifiedTopicName(topic);
            if (!State.selectedTopics.includes(cleanTopic)) {
                State.selectedTopics.push(cleanTopic);
                updateSelectedTags();
            }
            input.value = "";
            suggestionsCont.classList.remove("active");
            activeIndex = -1;
        };

        input.addEventListener("input", (e) => showSuggestions(e.target.value));

        input.addEventListener("keydown", (e) => {
            const items = suggestionsCont.querySelectorAll(".suggestion-item");

            if (e.key === "ArrowDown") {
                activeIndex = (activeIndex + 1) % items.length;
                e.preventDefault();
            } else if (e.key === "ArrowUp") {
                activeIndex = (activeIndex - 1 + items.length) % items.length;
                e.preventDefault();
            } else if (e.key === "Enter") {
                if (activeIndex >= 0 && items[activeIndex]) {
                    addTopic(items[activeIndex].textContent);
                } else if (input.value.trim() !== "") {
                    addTopic(input.value.trim());
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

        // Slider interaction
        if (qtySlider) {
            qtySlider.addEventListener("input", () => {
                qtyVal.textContent = qtySlider.value;
                $$(".preset-card").forEach(c => c.classList.remove("active"));
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
                $$(".preset-card").forEach(c => c.classList.remove("active"));
                card.classList.add("active");
                State.selectedPresetId = card.id || null;
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
                    $$(".spec-item").forEach(i => i.classList.add("checked"));
                    State.selectedSpecialties = $$(".spec-item.checked").map(i => i.dataset.spec);
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
                item.classList.toggle("checked");
                // Keep State in sync with DOM
                State.selectedSpecialties = $$(".spec-item.checked").map(i => i.dataset.spec);
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
                $$(".diff-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                State.difficulty = btn.dataset.diff;
            });
        });

        if (libBtn) {
            libBtn.addEventListener("click", () => {
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
            btnStart.addEventListener("click", () => {

                const isRealSim = State.selectedPresetId === "preset-real";
                const selectedSpecs = $$(".spec-item.checked").map(i => i.dataset.spec);
                if (!isRealSim && selectedSpecs.length === 0 && State.selectedTopics.length === 0) {
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

                if (isRealSim) {
                    const realSet = buildRealSimulacroQuestionSet();
                    if (!realSet.questionSet || realSet.questionSet.length === 0) {
                        return showNotification("No hay suficientes preguntas para generar el simulacro real.", "warning");
                    }

                    State.questionSet = realSet.questionSet;
                    State.mode = "simulacro";
                    State.currentExamIsReal = true;
                    State.currentExamType = "Simulacro Real";

                    if (realSet.warnings.length > 0) {
                        showNotification(realSet.warnings[0], "warning");
                    }

                    State.durationSec = isLibre ? 0 : (timerVal || REAL_SIM_CONFIG.timeMin) * 60;
                    State.currentIndex = 0;
                    State.answers = State.questionSet.map(() => ({ selected: null, isCorrect: null, flagged: false }));
                    State.startTime = Date.now();
                    State.pausedElapsedTime = 0;
                    State.examActive = true;
                    isFinishing = false;
                    renderExamQuestion();
                    showView("view-exam");

                    if (!isLibre && State.durationSec > 0) startTimer();
                    else if ($("timer-display")) $("timer-display").style.display = "none";
                    return;
                }

                let pool = [];
                if (selectedSpecs.length > 0) {
                    pool = QUESTIONS.filter(q => selectedSpecs.includes(q.specialty));
                } else {
                    pool = [...QUESTIONS];
                }

                // Filtrado por Temas Seleccionados
                if (State.selectedTopics.length > 0) {
                    let expandedTopics = [];
                    State.selectedTopics.forEach(t => {
                        if (TEMARIO_MAPPING && TEMARIO_MAPPING[t]) expandedTopics.push(...TEMARIO_MAPPING[t]);
                        else expandedTopics.push(t);
                    });

                    const expandedKeys = expandedTopics
                        .map(t => normalizeTopicKey(getUnifiedTopicName(t)))
                        .filter(Boolean);
                    pool = pool.filter(q => {
                        const keys = [
                            normalizeTopicKey(getUnifiedTopicName(q.tema)),
                            normalizeTopicKey(getUnifiedTopicName(q.subtema)),
                            normalizeTopicKey(getUnifiedTopicName(q.gpcReference))
                        ].filter(Boolean);
                        if (keys.length === 0) return false;
                        return expandedKeys.some(k => keys.includes(k));
                    });
                }
                pool = filterQuarantinedPool(pool);

                // Filtrado por Dificultad
                let poolPrimary = [...pool];
                let poolSecondary = [];

                if (State.difficulty && State.difficulty !== "cualquiera") {
                    poolPrimary = pool.filter(q => {
                        const qDiff = (q.difficulty || "alta").toLowerCase();
                        if (State.difficulty === "alta") {
                            return qDiff === "alta" || qDiff === "muy-alta";
                        }
                        return qDiff === State.difficulty;
                    });
                    poolSecondary = pool.filter(q => !poolPrimary.includes(q));
                }

                if (poolPrimary.length === 0 && poolSecondary.length === 0) {
                    return showNotification(`No hay preguntas. Revisa tus filtros:\n- Especialidades marcadas: ${selectedSpecs.length}\n- Temas buscados: ${State.selectedTopics.length}\n- Dificultad: ${State.difficulty}\nIntenta poner la dificultad en "Cualquiera".`);
                }

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


                State.questionSet = finalQuestionSet;

                const selectedModeBtn = document.querySelector(".mode-toggle-btn.active");
                const modeVal = selectedModeBtn ? selectedModeBtn.dataset.examMode : "casos";
                State.mode = !hasPremium ? "estudio" : (modeVal === "casos" ? "simulacro" : "estudio");

                State.durationSec = !hasPremium ? 0 : (isLibre ? 0 : (timerVal || 60) * 60);
                State.currentIndex = 0;
                State.answers = State.questionSet.map(() => ({ selected: null, isCorrect: null, flagged: false }));
                State.currentExamIsReal = false;
                State.currentExamType = !hasPremium ? "Demo Estudio" : (isLibre ? "Estudio Libre" : "Examen Cronometrado");
                State.startTime = Date.now();
                State.pausedElapsedTime = 0;
                State.examActive = true;
                isFinishing = false;
                renderExamQuestion();
                showView("view-exam");

                if (!isLibre && State.durationSec > 0) startTimer();
                else if ($("timer-display")) $("timer-display").style.display = "none";
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
                el.addEventListener("click", () => {
                    if (requiresPremium && !ensurePremiumAccess("Esta acci\u00f3n es premium.")) return;
                    handler();
                });
            }
        };

        const handleInteligente = () => {
            if (State.topFailedTemas && State.topFailedTemas.length > 0) {
                startTemaSession(State.topFailedTemas, 5, "Refuerzo IA por Temas");
            } else {
                showNotification("Aún no tienes puntos de falla registrados. Sigue practicando para que la IA detecte tus áreas de oportunidad.");
            }
        };

        bindStartBtn("btn-refuerzo-ia", handleInteligente, true);
        bindStartBtn("btn-refuerzo-ia-dash", handleInteligente, true); // New Dash Button
        bindStartBtn("btn-refuerzo-rapido", () => startQuickSession(['mi', 'ped', 'gyo', 'cir', 'urg', 'sp'], 5, "Refuerzo Rápido General"), true);
        bindStartBtn("btn-quick-start", () => startQuickSession(['mi', 'ped', 'gyo', 'cir', 'urg', 'sp'], 10, "Sesión Rápida (10)"), true);
        bindStartBtn("btn-refuerzo-casos", () => startQuickSession(['mi', 'ped', 'gyo', 'cir'], 3, "Casos Rápidos Aleatorios"), true);
        bindStartBtn("btn-curva-olvido", startSpacedRepetition, true);
        bindStartBtn("btn-curva-olvido-dash", startSpacedRepetition, true); // New Dash Button
        bindStartBtn("btn-curva-olvido-ref", startSpacedRepetition, true);
    };

    const startSpacedRepetition = () => {
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
                    if (q.tema) themesToReview.add(q.tema);
                });
            }
        });

        if (themesToReview.size === 0) {
            showNotification("No hay temas críticos para repaso según la Curva del Olvido hoy. \n\nRecuerda: El sistema programa repasos automáticos a las 24h, 7 días y 30 días de tus sesiones de estudio.");
            return;
        }

        const themesArr = Array.from(themesToReview);
        startTemaSession(themesArr, 15, "Repaso: Curva del Olvido");
    };

    const startTemaSession = (temas, qty, label) => {
        let pool = filterQuarantinedPool(QUESTIONS.filter(q => q.tema && temas.includes(q.tema)));
        if (pool.length === 0) pool = filterQuarantinedPool(QUESTIONS);

        let finalQty = qty;
        if (qty > pool.length) {
            finalQty = pool.length;
            showNotification(`Solo tenemos ${pool.length} preguntas disponibles para este tema.`);
        }

        State.questionSet = processAndFlattenPool(pool, finalQty);
        State.mode = "simulacro";
        State.currentExamIsReal = false;
        State.durationSec = 0;
        State.currentIndex = 0;
        State.startTime = Date.now();
        State.pausedElapsedTime = 0;
        State.examActive = true;
        State.answers = State.questionSet.map(() => ({ selected: null, isCorrect: null, flagged: false }));
        State.currentExamType = label;
        isFinishing = false;
        renderExamQuestion();
        showView("view-exam");
    };

    const startQuickSession = (specs, qty, label) => {
        let pool = filterQuarantinedPool(QUESTIONS.filter(q => specs.includes(q.specialty)));
        if (pool.length === 0) pool = filterQuarantinedPool(QUESTIONS);

        let finalQty = qty;
        if (qty > pool.length) {
            finalQty = pool.length;
        }

        State.questionSet = processAndFlattenPool(pool, finalQty);
        State.mode = "simulacro";
        State.currentExamIsReal = false;
        State.durationSec = 0;
        State.currentIndex = 0;
        State.startTime = Date.now();
        State.pausedElapsedTime = 0;
        State.examActive = true;
        State.answers = State.questionSet.map(() => ({ selected: null, isCorrect: null, flagged: false }));
        State.currentExamType = label;
        isFinishing = false;
        renderExamQuestion();
        showView("view-exam");
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
                    renderReclassifyView();
                    updateReclassSelection();
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
        if (State.mode === "estudio") recordStat(q.specialty, ans.isCorrect, q.tema);
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

    const startTimer = (isResume = false) => {
        const timerDisp = $("timer-display"); if (timerDisp) timerDisp.style.display = "block";
        if (!isResume) {
            State.startTime = Date.now();
            State.pausedElapsedTime = 0;
        } else {
            State.startTime = Date.now() - (State.pausedElapsedTime * 1000);
        }
        const timerText = $("timer-text");
        if (State.timer) clearInterval(State.timer);
        State.timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - State.startTime) / 1000);
            const remaining = Math.max(State.durationSec - elapsed, 0);
            if (timerText) timerText.textContent = formatTime(remaining);
            if (remaining <= 0) finishExam();
        }, 1000);
    };

    const pauseTimer = () => {
        if (State.timer) {
            clearInterval(State.timer);
            State.timer = null;
        }
        if (State.startTime) {
            State.pausedElapsedTime = Math.floor((Date.now() - State.startTime) / 1000);
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
            const caseKey = getCaseKey(q) || getCaseKeyFromText(q.case, q.question);
            const report = {
                id: `local-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
                timestamp: Date.now(),
                questionText: q.question,
                caseText: q.case,
                specialty: q.specialty,
                tema: q.tema,
                category: category,
                reason: reason,
                caseKey: caseKey,
                userName: State.userName || "Anonimo",
                userId: window.FB && window.FB.auth && window.FB.auth.currentUser ? window.FB.auth.currentUser.uid : "",
                status: "quarantine",
                source: "local"
            };

            State.reportedQuestionsLocal = dedupeReports([...(State.reportedQuestionsLocal || []), report]);
            State.reportedQuestions = dedupeReports([...(State.reportedQuestions || []), report]);
            refreshQuarantineKeys();
            saveGlobalStats();
            modal.style.display = "none";
            showNotification("Gracias por tu reporte. Lo revisaremos pronto para mejorar el banco de preguntas.", "success");

            if (window.FB && window.FB.db) {
                try {
                    const payload = {
                        timestamp: report.timestamp,
                        questionText: report.questionText,
                        caseText: report.caseText,
                        specialty: report.specialty,
                        tema: report.tema,
                        category: report.category,
                        reason: report.reason,
                        caseKey: report.caseKey,
                        userName: report.userName,
                        userId: report.userId,
                        status: report.status
                    };
                    window.FB.addDoc(window.FB.collection(window.FB.db, "reports"), payload).catch(err => {
                        console.error("Error guardando reporte en la nube:", err);
                    });
                } catch (err) {
                    console.error("Error guardando reporte en la nube:", err);
                }
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

            const localReports = (State.reportedQuestionsLocal || []).filter(r => r.source === "local");
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
    const renderOfficialTemario = (filter = "") => {
        const cont = $("temario-list");
        if (!cont) return;

        const removeAccentsT = str => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const normalizedFilter = removeAccentsT(filter);

        // Contar preguntas por tema (usa el campo tema corregido)
        const temaCountsT = {};
        if (typeof QUESTIONS !== 'undefined') {
            QUESTIONS.forEach(q => { if (q.tema) temaCountsT[q.tema] = (temaCountsT[q.tema] || 0) + 1; });
        }

        // Filtrar temario oficial
        const filtered = OFFICIAL_TEMARIO.filter(t => {
            return !normalizedFilter || removeAccentsT(t).includes(normalizedFilter);
        });

        // También buscar en temas reales del banco si hay filtro
        let extraTopics = [];
        if (normalizedFilter && typeof QUESTIONS !== 'undefined') {
            const allRealTemas = [...new Set(QUESTIONS.map(q => q.tema).filter(Boolean))];
            extraTopics = allRealTemas.filter(t =>
                removeAccentsT(t).includes(normalizedFilter) && !filtered.includes(t)
            ).slice(0, 10);
        }

        if (filtered.length === 0 && extraTopics.length === 0) {
            cont.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);grid-column:1/-1;">
                <div style="font-size:40px;margin-bottom:12px;">&#128269;</div>
                <p>No se encontraron temas para "<strong>${filter}</strong>".</p>
                <p style="font-size:12px;margin-top:8px;">Intenta con: diabetes, preeclampsia, apendicitis...</p>
            </div>`;
            return;
        }

        const renderTemarioCard = (tema, isExtra) => {
            const count = temaCountsT[tema] || 0;
            const countBadge = count > 0
                ? `<span style="font-size:11px;color:var(--accent-green);font-weight:700;background:rgba(5,192,127,0.1);padding:2px 8px;border-radius:20px;margin-left:6px;">${count} preg.</span>`
                : '';
            const extraBadge = isExtra
                ? `<span style="font-size:10px;color:var(--accent-blue);font-weight:600;background:rgba(59,130,246,0.1);padding:1px 6px;border-radius:12px;margin-left:6px;">banco</span>`
                : '';
            const safeT = tema.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
            return `<div class="list-item" style="padding:14px 16px;background:rgba(255,255,255,0.02);border:1px solid var(--border);cursor:pointer;transition:border-color 0.2s,background 0.2s;"
                onclick="document.getElementById('nav-new-exam').click();setTimeout(()=>{const i=document.getElementById('setup-topic-filter');if(i){i.value='${safeT}';i.dispatchEvent(new Event('input'));}},300);"
                onmouseover="this.style.borderColor='var(--accent-green)';this.style.background='rgba(5,192,127,0.03)';"
                onmouseout="this.style.borderColor='var(--border)';this.style.background='rgba(255,255,255,0.02)';">
                <div class="list-item-content" style="width:100%;">
                    <div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;">
                        <h3 style="font-size:13px;margin-bottom:0;line-height:1.3;">${tema}</h3>
                        ${countBadge}${extraBadge}
                    </div>
                    ${count > 0 ? '<p style="font-size:11px;color:var(--text-muted);margin-top:4px;">Toca para agregar al simulacro &#8594;</p>' : ''}
                </div>
            </div>`;
        };

        cont.innerHTML = [
            ...filtered.map(t => renderTemarioCard(t, false)),
            ...extraTopics.map(t => renderTemarioCard(t, true))
        ].join("");
    };

    window.filterOfficialTemario = () => {
        const val = $("temario-search").value;
        renderOfficialTemario(val);
    };

    const finishExam = () => {
        if (isFinishing) return;
        isFinishing = true;
        try {
            if (State.timer) {
                clearInterval(State.timer);
                State.timer = null;
            }

            let correct = 0, wrong = 0, blank = 0;
            State.answers.forEach((a, i) => {
                if (a.selected === null) blank++;
                else {
                    if (a.isCorrect) correct++; else wrong++;
                    if (State.mode === "simulacro") recordStat(State.questionSet[i].specialty, a.isCorrect, State.questionSet[i].tema);
                }
            });

            const total = State.questionSet.length;
            let pct = total > 0 ? Math.round((correct / total) * 100) : 0;
            const elapsed = State.startTime ? Math.floor((Date.now() - State.startTime) / 1000) : 0;

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

            State.globalStats.sesiones++;
            // Track actual blank count for accurate dashboard stats
            State.globalStats.totalBlank = (State.globalStats.totalBlank || 0) + blank;
            State.history.push({
                timestamp: Date.now(),
                tipo: State.currentExamType,
                preguntas: total,
                pct: pct,
                blank: blank,
                elapsedSec: elapsed,
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

                        // Check if all are finished
                        const allFinished = Object.values(parts).every(p => p.status === "completed");

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

            saveGlobalStats();
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
        }
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
            const specNames = { 'mi': 'Medicina Interna', 'ped': 'Pediatría', 'gyo': 'Ginecología y Obstetricia', 'cir': 'Cirugía General', 'sp': 'Salud Pública', 'urg': 'Urgencias' };
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
        const specKey = ["mi", "ped", "gyo", "cir", "sp", "urg"]
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
            State.theme || "dark",
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
        const aciertos = State.globalStats.aciertos || 0;
        const respondidas = State.globalStats.respondidas || 0;
        const errores = Math.max(0, respondidas - aciertos);
        // Use accumulated real blank count, fallback to 0
        const omitidas = State.globalStats.totalBlank || 0;
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

            // Move labels dynamically so they stay attached to their sections
            $("ov-label-1").style.left = `0%`;
            $("ov-label-2").style.left = `${pA}%`;
            $("ov-label-3").style.left = `${pA + pE}%`;
        }

        // Lógica de Rangos
        const rangoEl = $("dash-rango");
        if (rangoEl) {
            const val = parseFloat(pct);
            let rango = "Aspirante";
            if (val >= 70) rango = "Especialista";
            else if (val >= 60) rango = "Residente";
            else if (val >= 50) rango = "Médico General";
            else if (val >= 30) rango = "MPSS";
            else if (val >= 0) rango = "MIP";
            rangoEl.textContent = rango;
        }

        ['mi', 'ped', 'gyo', 'cir'].forEach(k => {
            const s = State.globalStats.bySpecialty[k];
            const p = s.total > 0 ? (s.correct / s.total) * 100 : 0;
            const bar = $(`bar-${k}`); if (bar) bar.style.height = `${Math.max(p, 5)}%`;
        });

        // Update new stats tab
        if ($("stats-global-precision")) $("stats-global-precision").textContent = `${pct}%`;
        if ($("stats-total-questions")) $("stats-total-questions").textContent = State.globalStats.respondidas;

        let totalSec = 0, totalPreg = 0;
        State.history.forEach(h => {
            totalSec += h.elapsedSec || 0;
            totalPreg += h.preguntas || 0;
        });
        if ($("stats-avg-time")) $("stats-avg-time").textContent = totalPreg > 0 ? `${Math.round(totalSec / totalPreg)}s` : "0s";

        // Update Fail Points (Puntos de Falla) is now handled by the new Refuerzos View
        renderRefuerzosView();
    };

    let chartHistory = null;
    let chartSpecialties = null;
    let chartDoughnut = null;
    let chartSpecLineInstance = null;
    let lastChartsRenderKey = "";

    const updateCharts = () => {
        if (typeof Chart === 'undefined') return;
        const viewScope = State.view === "view-estadisticas"
            ? "stats"
            : (State.view === "view-dashboard" ? "dashboard" : "other");
        if (viewScope === "other") return;

        const bySpec = State.globalStats?.bySpecialty || {};
        const specKey = ["mi", "ped", "gyo", "cir", "sp", "urg"]
            .map(k => `${bySpec[k]?.total || 0}-${bySpec[k]?.correct || 0}`)
            .join("|");
        const lastHist = (State.history && State.history.length > 0) ? State.history[State.history.length - 1] : null;
        const histKey = lastHist ? `${lastHist.pct || 0}-${lastHist.timestamp || 0}` : "none";
        const chartKey = [
            State.theme || "dark",
            State.history?.length || 0,
            histKey,
            State.globalStats?.respondidas || 0,
            State.globalStats?.aciertos || 0,
            specKey
        ].join("::");
        if (chartKey === lastChartsRenderKey) {
            if (chartHistory && typeof chartHistory.resize === "function") chartHistory.resize();
            if (chartSpecLineInstance && typeof chartSpecLineInstance.resize === "function") chartSpecLineInstance.resize();
            if (chartSpecialties && typeof chartSpecialties.resize === "function") chartSpecialties.resize();
            if (chartDoughnut && typeof chartDoughnut.resize === "function") chartDoughnut.resize();
            return;
        }
        lastChartsRenderKey = chartKey;

        const style = getComputedStyle(document.body);
        const textMuted = style.getPropertyValue('--text-muted').trim() || '#a0aec0';
        const accentGreen = style.getPropertyValue('--accent-green').trim() || '#05C07F';
        const accentBlue = style.getPropertyValue('--accent-blue').trim() || '#3b82f6';

        Chart.defaults.color = textMuted;
        Chart.defaults.font.family = "'Inter', sans-serif";

        // Chart 1: Evolución de Aciertos en el tiempo (Line)
        const ctxHist = document.getElementById('chart-history');
        if (ctxHist) {
            const histData = [...State.history].slice(-10); // Últimos 10
            const labels = histData.map((_, i) => `Examen ${i + 1}`);
            const dataPts = histData.map(h => h.pct);

            if (chartHistory) chartHistory.destroy();
            chartHistory = new Chart(ctxHist, {
                type: 'line',
                data: {
                    labels: labels.length ? labels : ['Sin datos'],
                    datasets: [{
                        label: '% Aciertos',
                        data: dataPts.length ? dataPts : [0],
                        borderColor: accentGreen,
                        backgroundColor: accentGreen + '33', // 20% alpha
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: accentGreen,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, max: 100 } }
                }
            });
        }

        // Chart 2a: Especialidades como Line Chart (Estilo Bolsa de Valores del Dashboard)
        const ctxSpecLine = document.getElementById('chart-specialties-line');

        if (ctxSpecLine) {
            const labels = [];
            const dataPts = [];
            const keys = ['mi', 'ped', 'gyo', 'cir', 'sp', 'urg'];
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
            const keys = ['mi', 'ped', 'gyo', 'cir', 'sp', 'urg'];
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
                        legend: { display: false }
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
    };

    const updateHistoryView = () => {
        const cont = $("history-list"); if (!cont) return;
        if (State.history.length === 0) {
            cont.innerHTML = `<div class="list-item empty-history"><p style="color:var(--text-muted); padding: 20px;">Aún no hay sesiones registradas.</p></div>`;
            return;
        }
        cont.innerHTML = "";
        [...State.history].reverse().forEach((h, i) => {
            const realIdx = State.history.length - 1 - i;
            const div = document.createElement("div"); div.className = "list-item";
            div.innerHTML = `<div class="list-item-content"><h3>${h.tipo || 'Examen'} - ${h.preguntas} preguntas</h3><p>${h.pct}% Aciertos | ${formatTime(h.elapsedSec || 0)}</p></div>
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
        const targetDate = new Date("September 21, 2026 08:00:00").getTime();

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
    let pomoSeconds = 25 * 60;
    let isPomoRunning = false;
    let pomoMode = "focus"; // "focus" | "break"

    const initPomodoro = () => {
        const timeEl = $("pomo-time");
        const toggleBtn = $("btn-pomo-toggle");
        const resetBtn = $("btn-pomo-reset");
        const sessionEl = $("pomo-sessions");
        const iconEl = document.querySelector(".pomo-icon");

        const updateDisplay = () => {
            const m = String(Math.floor(pomoSeconds / 60)).padStart(2, "0");
            const s = String(pomoSeconds % 60).padStart(2, "0");
            timeEl.textContent = `${m}:${s}`;
            timeEl.style.color = pomoMode === "focus" ? "var(--accent-green)" : "var(--accent-blue)";
        };

        const updateStats = () => {
            if (sessionEl) sessionEl.textContent = `Hoy: ${State.globalStats.pomodoros || 0}`;
        };

        toggleBtn.addEventListener("click", () => {
            if (isPomoRunning) {
                clearInterval(pomoTimer);
                toggleBtn.textContent = "INICIAR";
                toggleBtn.classList.remove("active");
                if (iconEl) iconEl.classList.remove("running");
            } else {
                if (iconEl) iconEl.classList.add("running");
                pomoTimer = setInterval(() => {
                    if (pomoSeconds > 0) {
                        pomoSeconds--;
                        updateDisplay();
                    } else {
                        clearInterval(pomoTimer);
                        isPomoRunning = false;
                        if (pomoMode === "focus") {
                            State.globalStats.pomodoros = (State.globalStats.pomodoros || 0) + 1;
                            saveGlobalStats();
                            updateStats();
                            showNotification("¡Pomodoro terminado! Tiempo de un breve descanso.");
                            pomoMode = "break";
                            pomoSeconds = 5 * 60;
                        } else {
                            showNotification("¡Descanso terminado! A darle con todo.");
                            pomoMode = "focus";
                            pomoSeconds = 25 * 60;
                        }
                        updateDisplay();
                        toggleBtn.textContent = "INICIAR";
                        toggleBtn.classList.remove("active");
                        if (iconEl) iconEl.classList.remove("running");
                    }
                }, 1000);
                toggleBtn.textContent = "PAUSAR";
                toggleBtn.classList.add("active");
            }
            isPomoRunning = !isPomoRunning;
        });

        resetBtn.addEventListener("click", () => {
            clearInterval(pomoTimer);
            isPomoRunning = false;
            pomoMode = "focus";
            pomoSeconds = 25 * 60;
            updateDisplay();
            toggleBtn.textContent = "INICIAR";
            toggleBtn.classList.remove("active");
            if (iconEl) iconEl.classList.remove("running");
        });

        updateDisplay();
        updateStats();
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
        State.reclassMap = applyCaseReclassifications();
        initReclassifyLogic();
        syncReclassAccessUI();
        bindSidebar();
        initSetupLogic();
        initDashboardShortcuts();
        startExamCountdown();
        initReportLogic();
        initPomodoro();

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
                $$(".user-avatar").forEach(el => {
                    el.innerHTML = `<span style="font-size: 14px; font-weight: 700;">${initials}</span>`;
                    el.style.background = "rgba(5, 192, 127, 0.1)";
                    el.style.color = "var(--accent-green)";
                });
                syncReclassAccessUI();

                saveGlobalStats();
                showNotification("Perfil actualizado y sincronizado.", "success");

                const profileModal = $("profile-modal");
                if (profileModal) profileModal.style.display = "none";
            });
        }

        // Lógica de Modal Perfil y Amigos fuera de CloudFeatures (funciona sin conexión)
        const btnOpenProfile = $("btn-user-profile");
        const btnOpenProfileMobile = $("btn-user-profile-mobile");
        const btnCloseProfile = $("btn-close-profile");
        const profileModal = $("profile-modal");

        const btnOpenNotif = $("btn-open-notif");
        const btnCloseNotif = $("btn-close-notif");
        const notifModal = $("notif-modal");

        const openProfileModal = () => {
            profileModal.style.display = "flex";
            const uidInput = $("profile-uid");
            if (uidInput) uidInput.value = State.currentUid || "";
            updatePremiumStatusLabel();
        };

        const openNotifModal = () => {
            if (notifModal) {
                notifModal.style.display = "flex";
                if (typeof window.loadPendingRequests === 'function') {
                    try { window.loadPendingRequests(); } catch (e) { console.error(e); }
                }
            }
        };

        if (btnOpenProfile && profileModal) {
            btnOpenProfile.addEventListener("click", openProfileModal);
        }
        if (btnOpenProfileMobile && profileModal) {
            btnOpenProfileMobile.addEventListener("click", openProfileModal);
        }
        const btnOpenFriendsModal = $("btn-open-friends-modal");
        if (btnOpenFriendsModal && profileModal) {
            btnOpenFriendsModal.addEventListener("click", openProfileModal);
        }
        if (btnCloseProfile && profileModal) {
            btnCloseProfile.addEventListener("click", () => {
                profileModal.style.display = "none";
            });
        }

        if (btnOpenNotif) {
            btnOpenNotif.addEventListener("click", openNotifModal);
        }
        if (btnCloseNotif && notifModal) {
            btnCloseNotif.addEventListener("click", () => {
                notifModal.style.display = "none";
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
                const selectedTheme = circle.dataset.theme;
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

                State.globalStats = {
                    respondidas: 0,
                    aciertos: 0,
                    sesiones: 0,
                    pomodoros: 0,
                    bySpecialty: {
                        mi: { total: 0, correct: 0, name: "Medicina Interna" },
                        ped: { total: 0, correct: 0, name: "Pediatría" },
                        gyo: { total: 0, correct: 0, name: "Ginecología y Obstetricia" },
                        cir: { total: 0, correct: 0, name: "Cirugía General" },
                        sp: { total: 0, correct: 0, name: "Salud Pública" },
                        urg: { total: 0, correct: 0, name: "Urgencias" }
                    }
                };
                State.history = [];

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
            localStorage.removeItem("enarm_user");
            localStorage.removeItem("enarm_specialty");
            localStorage.removeItem("enarm_university");
            localStorage.removeItem("enarm_stats");
            localStorage.removeItem("enarm_history");
            localStorage.removeItem("enarm_reports");
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
            // Listener on Friendships (Accepted Requests) to populate Leaderboard / Friends List
            const fetchFriendsAndLeaderboard = () => {
                const reqsRef1 = window.FB.query(
                    window.FB.collection(window.FB.db, "friendRequests"),
                    window.FB.where("toId", "==", window.FB.auth.currentUser.uid),
                    window.FB.where("status", "==", "accepted")
                );

                const reqsRef2 = window.FB.query(
                    window.FB.collection(window.FB.db, "friendRequests"),
                    window.FB.where("fromId", "==", window.FB.auth.currentUser.uid),
                    window.FB.where("status", "==", "accepted")
                );

                // Función helper para procesar amigos
                const processFriends = async () => {
                    try {
                        let friendIds = new Set();
                        friendIds.add(window.FB.auth.currentUser.uid); // Siempre incluirme a mi

                        // Para simular getDocs, utilizamos onSnapshot de una sola vez
                        const getSnap = (q) => new Promise((resolve) => {
                            const un = window.FB.onSnapshot(q, snap => { un(); resolve(snap); }, err => { un(); resolve({ forEach: () => { } }); });
                        });

                        const snap1 = await getSnap(reqsRef1);
                        const snap2 = await getSnap(reqsRef2);

                        snap1.forEach(doc => { if (doc.data()) friendIds.add(doc.data().fromId) });
                        snap2.forEach(doc => { if (doc.data()) friendIds.add(doc.data().toId) });

                        // Ahora que tenemos los IDs, busquemos su información en Leaderboard
                        const lbRef = window.FB.collection(window.FB.db, "leaderboard");
                        const fullQ = window.FB.query(lbRef, window.FB.orderBy("score", "desc"), window.FB.limit(200));

                        window.FB.onSnapshot(fullQ, (snapshot) => {
                            let lbHTML = "";
                            let friendListHTML = "";
                            let rank = 1;
                            let hasFriends = false;
                            State.myFriends = [];

                            snapshot.forEach(docSnap => {
                                if (friendIds.has(docSnap.id)) {
                                    const data = docSnap.data();
                                    const isMe = docSnap.id === window.FB.auth.currentUser.uid;
                                    const bgStyle = isMe ? 'background: rgba(5, 192, 127, 0.1); border-bottom: 1px solid rgba(5, 192, 127, 0.2);' : '';

                                    let rankStr = `#${rank}`;
                                    if (rank === 1) rankStr = `<span style="color: gold; text-shadow: 0 0 10px rgba(255,215,0,0.5);">#1</span>`;
                                    else if (rank === 2) rankStr = `<span style="color: silver; text-shadow: 0 0 10px rgba(192,192,192,0.5);">#2</span>`;
                                    else if (rank === 3) rankStr = `<span style="color: #cd7f32; text-shadow: 0 0 10px rgba(205,127,50,0.5);">#3</span>`;

                                    const initNameParts = data.username.trim().split(/\s+/);
                                    const lbInitials = initNameParts.length > 1
                                        ? (initNameParts[0][0] + initNameParts[initNameParts.length - 1][0]).toUpperCase()
                                        : initNameParts[0].substring(0, 2).toUpperCase();

                                    let badgeSpec = "";
                                    if (data.specialty) badgeSpec += `<span style="font-size: 10px; opacity: 0.9; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 1px 5px; background: rgba(255,255,255,0.05); margin-right: 5px;">${data.specialty.substring(0, 20)}</span>`;
                                    if (data.university) badgeSpec += `<span style="font-size: 10px; opacity: 0.6;">${data.university.substring(0, 20)}</span>`;

                                    lbHTML += `
                                     <div class="lb-item" style="${bgStyle}">
                                        <div class="lb-rank" style="min-width:30px; font-size:16px;">${rankStr}</div>
                                        <div class="lb-avatar" style="width:36px; height:36px; min-width:36px; flex-shrink:0; font-size:12px;">${lbInitials}</div>
                                        <div class="lb-info" style="flex:1; min-width:0; padding: 0 8px;">
                                            <div class="lb-name" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-size:13px; font-weight:700;">${data.username} ${isMe ? '<span class="lb-badge" style="font-size:9px; vertical-align:middle;">Tú</span>' : ''}</div>
                                            ${badgeSpec ? `<div style="margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:flex;">${badgeSpec}</div>` : ''}
                                        </div>
                                        <div class="lb-actions" style="display:flex; align-items:center; gap:6px;">
                                           <div class="lb-flame" style="font-size:10px;">&#x1F525; ${data.flame || 0}</div>
                                           ${!isMe ? `<button class="btn-primary" onclick="window.quickChallenge('${docSnap.id}')" style="padding: 4px 8px; font-size: 10px; border-radius: 6px; background: var(--accent-orange); border:none; white-space:nowrap;">&#x2694;&#xFE0F; Retar</button>` : ''}
                                        </div>
                                     </div>
                                     `;

                                    if (!isMe) {
                                        hasFriends = true;
                                        State.myFriends.push({
                                            uid: docSnap.id,
                                            username: data.username,
                                            score: data.score
                                        });

                                        friendListHTML += `
                                        <div style="background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border: 1px solid var(--border); padding: 10px 12px;">
                                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                                <div style="width: 32px; height: 32px; min-width:32px; border-radius: 50%; background: var(--accent-blue); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; flex-shrink:0;">
                                                    ${data.username.substring(0, 2).toUpperCase()}</div>
                                                <div style="min-width:0; flex:1;">
                                                    <div style="font-size: 13px; font-weight: 600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${data.username}</div>
                                                    <div style="font-size: 11px; color: var(--text-muted);">Promedio: ${data.score || 0}%</div>
                                                </div>
                                            </div>
                                            <button class="btn-primary" onclick="window.quickChallenge('${docSnap.id}')" style="width:100%; padding: 7px; font-size: 12px; border-radius: 8px; background: var(--accent-orange); text-align:center;">&#x2694;&#xFE0F; Retar</button>
                                        </div>`;
                                    }
                                    rank++;
                                }
                            });

                            window.quickChallenge = (uid) => {
                                // Save the pre-selected friend UID; the modal will pick it up when opened
                                window._pendingChallengeUid = uid;
                                // Navigate to setup so the user can configure the exam first
                                if (typeof showView === "function") showView("view-setup");
                                showNotification("&#x1F3AF; ¡Amigo pre-seleccionado! Configura tu examen y luego pulsa 'Retar a un Amigo &#x2694;&#xFE0F;'.", "info");
                            };

                            const lbList = document.querySelector(".leaderboard-list");
                            if (lbList) lbList.innerHTML = lbHTML || '<div style="padding: 20px; color: var(--text-muted); font-size: 13px;">Agrega amigos para ver el ranking.</div>';

                            const flList = document.getElementById("friends-list");
                            if (flList) {
                                if (hasFriends) {
                                    flList.innerHTML = friendListHTML;
                                } else {
                                    flList.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 13px; margin-top: 15px;">Aún no tienes amigos añadidos.</div>';
                                }
                            }

                            // Cambiar el título "Top 100 Aspirantes" a "Ranking de Amigos"
                            const titleEls = document.querySelectorAll(".panel-title");
                            titleEls.forEach(t => {
                                if (t.textContent.includes("Top 100")) {
                                    t.textContent = "Ranking de Amigos";
                                }
                            });
                        });
                    } catch (err) { console.error("Error cargando amigos: ", err); }
                };

                processFriends();
            };

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
                                            <div style="font-size:12px; color:var(--text-muted)">Promedio: ${foundUser.score}%</div>
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

                let pendingFriends = [];
                let pendingChallenges = [];

                // Mover renderMergedNotifications al scope exterior para que sea accesible
                const renderMergedNotifications = () => {
                    const profileListEl = $("pending-requests-list");
                    const modalListEl = $("notif-list-container");
                    const badgeMain = $("notif-badge-main");

                    const total = pendingFriends.length + pendingChallenges.length;

                    if (total === 0) {
                        const emptyMsg = '<div style="text-align: center; color: var(--text-muted); font-size: 13px; padding: 20px;">No tienes notificaciones nuevas.</div>';
                        if (profileListEl) profileListEl.innerHTML = emptyMsg;
                        if (modalListEl) modalListEl.innerHTML = emptyMsg;
                        if (badgeMain) badgeMain.style.display = "none";
                        return;
                    }

                    if (badgeMain) {
                        badgeMain.style.display = "block";
                        badgeMain.textContent = total; // Mostrar número de notificaciones
                    }

                    let html = "";

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
                    const specsArray = domSpecs.length > 0 ? domSpecs : State.selectedSpecialties;
                    const qtySlider = document.getElementById("setup-qty-slider");
                    const qty = qtySlider ? parseInt(qtySlider.value, 10) : (State.setupQty || 10);

                    if (specsArray.length === 0 && State.selectedTopics.length === 0) {
                        return showNotification("Configura especialidad o temas en 'Añadir Materias' primero.", "warning");
                    }

                    let pool = [];
                    if (specsArray.length > 0) pool = QUESTIONS.filter(q => specsArray.includes(q.specialty));
                    else pool = [...QUESTIONS];

                    if (State.selectedTopics.length > 0) {
                        let expandedTopics = [];
                        State.selectedTopics.forEach(t => {
                            if (window.TEMARIO_MAPPING && window.TEMARIO_MAPPING[t]) expandedTopics.push(...window.TEMARIO_MAPPING[t]);
                            else expandedTopics.push(t);
                        });
                        const expandedKeys = expandedTopics
                            .map(t => normalizeTopicKey(getUnifiedTopicName(t)))
                            .filter(Boolean);
                        pool = pool.filter(q => {
                            const keys = [
                                normalizeTopicKey(getUnifiedTopicName(q.tema)),
                                normalizeTopicKey(getUnifiedTopicName(q.subtema)),
                                normalizeTopicKey(getUnifiedTopicName(q.gpcReference))
                            ].filter(Boolean);
                            if (keys.length === 0) return false;
                            return expandedKeys.some(k => keys.includes(k));
                        });
                    }
                    pool = filterQuarantinedPool(pool);

                    // Filter by difficulty on the RAW pool (before expansion)
                    // This matches the normal exam behavior
                    let poolPrimary = [...pool];
                    let poolSecondary = [];

                    if (State.difficulty && State.difficulty !== "cualquiera") {
                        poolPrimary = pool.filter(q => {
                            const qDiff = (q.difficulty || "alta").toLowerCase();
                            if (State.difficulty === "alta") return qDiff === "alta" || qDiff === "muy-alta";
                            return qDiff === State.difficulty;
                        });
                        poolSecondary = pool.filter(q => !poolPrimary.includes(q));
                    }

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

                    btnSend.textContent = "...";
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
                    btnSend.textContent = "¡Desafiar Ahora!";
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

            const startChallengeExam = (id, indices, targetQty) => {
                if (!Array.isArray(indices) || indices.length === 0) {
                    return showNotification("Error: Los datos del reto están dañados o vacíos.", "error");
                }

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

                State.questionSet = trimmedSet;
                State.mode = "simulacro";
                State.currentExamIsReal = false;
                State.durationSec = 0;
                State.currentIndex = 0;
                State.answers = State.questionSet.map(() => ({ selected: null, isCorrect: null, flagged: false }));
                State.currentExamType = "Reto Amistoso";
                State.startTime = Date.now();
                State.pausedElapsedTime = 0;
                State.examActive = true;
                isFinishing = false;

                if (typeof renderExamQuestion === "function") renderExamQuestion();
                showView("view-exam");
                if ($("timer-display")) $("timer-display").style.display = "none";

                showNotification("¡Reto iniciado! Buena suerte.", "info");
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
            if (!window.FB || !window.FB.db || !window.FB.auth.currentUser) return;
            const uid = window.FB.auth.currentUser.uid;

            if (!confirm("¿Seguro que quieres eliminar todas las notificaciones?")) return;

            try {
                showNotification("Limpiando notificaciones...", "info");

                // 1. Limpiar solicitudes de amistad (pasarlas a rechazadas o eliminarlas)
                const qReqs = window.FB.query(
                    window.FB.collection(window.FB.db, "friendRequests"),
                    window.FB.where("toId", "==", uid),
                    window.FB.where("status", "==", "pending")
                );
                const snapReqs = await window.FB.getDocs(qReqs);
                const p1 = snapReqs.docs.map(d => window.FB.deleteDoc(d.ref));

                // BUG FIX #5: Only delete challenges where I am the challenger.
                // Previously this deleted ALL active challenges the user was part of,
                // which could destroy challenges initiated by other users.
                const qChal = window.FB.query(
                    window.FB.collection(window.FB.db, "challenges"),
                    window.FB.where("challengerId", "==", uid),
                    window.FB.where("status", "==", "active")
                );
                const snapChal = await window.FB.getDocs(qChal);
                const p2 = snapChal.docs.map(d => window.FB.deleteDoc(d.ref));

                await Promise.all([...p1, ...p2]);
                showNotification("Notificaciones limpiadas.", "success");
            } catch (e) {
                console.error(e);
                showNotification("Error al limpiar notificaciones.", "error");
            }
        };

        const getCodeTypeFromText = (code) => {
            if (!code) return null;
            if (code.startsWith("ENARM-M1-")) return "month";
            if (code.startsWith("ENARM-FX-")) return "fixed";
            return null;
        };

        const computeExpiryForType = (type) => {
            if (type === "fixed") return new Date(FIXED_CODE_EXPIRY.getTime());
            const now = Date.now();
            return new Date(now + (30 * 24 * 60 * 60 * 1000));
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

                // Listen for Auth State to restore stats correctly dynamically
                if (window.FB && window.FB.onAuthStateChanged) {
                    window.FB.onAuthStateChanged(window.FB.auth, async (user) => {
                        if (user) {
                            State.currentUid = user.uid;
                            const uidInput = $("profile-uid");
                            if (uidInput) uidInput.value = user.uid;
                            syncReclassAccessUI();
                            bindCaseOverridesListener();
                            bindEntitlementListener(user.uid);
                            syncPremiumUI();
                            initCloudFeatures();
                            setupChallengeLogic();
                            if (typeof window.loadPendingRequests === "function") {
                                window.loadPendingRequests(); // Iniciar notificaciones push automáticas
                            }
                            try {
                                const userRef = window.FB.doc(window.FB.db, "leaderboard", user.uid);
                                const snap = await window.FB.getDoc(userRef);
                                if (snap.exists()) {
                                    const data = snap.data();
                                    let needsUpdate = false;

                                    if (data.theme) { State.theme = data.theme; localStorage.setItem("enarm_theme", State.theme); applyTheme(State.theme); }
                                    if (data.specialty !== undefined) { State.userSpecialty = data.specialty; localStorage.setItem("enarm_specialty", State.userSpecialty); if ($("profile-specialty")) $("profile-specialty").value = State.userSpecialty; }
                                    if (data.university !== undefined) { State.userUniversity = data.university; localStorage.setItem("enarm_university", State.userUniversity); if ($("profile-university")) $("profile-university").value = State.userUniversity; }

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
                                        State.reportedQuestions = State.reportedQuestionsLocal;
                                        localStorage.setItem("enarm_reports", data.reportsStr);
                                        refreshQuarantineKeys();
                                    }

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
                    const cleanName = displayName.trim().substring(0, 20);
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

                    showNotification(`¡Bienvenido, ${cleanName}!`, "success");

                    // Update initials and status
                    const nameParts = cleanName.trim().split(/\s+/);
                    const initials = nameParts.length > 1
                        ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
                        : nameParts[0].substring(0, 2).toUpperCase();

        $$(".user-avatar").forEach(el => {
            el.innerHTML = `<span style="font-size: 14px; font-weight: 700;">${initials}</span>`;
            el.style.background = "rgba(5, 192, 127, 0.1)";
            el.style.color = "var(--accent-green)";
        });
        const statusEl = document.querySelector(".user-status");
        if (statusEl) statusEl.textContent = "EN LÍNEA";
        syncReclassAccessUI();

        if (window.FB && window.FB.auth.currentUser) {
            try {
                            const userRef = window.FB.doc(window.FB.db, "leaderboard", window.FB.auth.currentUser.uid);
                            const snap = await window.FB.getDoc(userRef);
                            if (snap.exists()) {
                                const data = snap.data();
                                if (data.theme) {
                                    State.theme = data.theme;
                                    localStorage.setItem("enarm_theme", State.theme);
                                    applyTheme(State.theme);
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
                                    State.reportedQuestions = State.reportedQuestionsLocal;
                                    localStorage.setItem("enarm_reports", data.reportsStr);
                                    refreshQuarantineKeys();
                                }
                            }
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
                            const prefersRedirect = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
                                || window.matchMedia("(display-mode: standalone)").matches;

                            if (prefersRedirect) {
                                await useRedirect();
                                return;
                            }

                            const result = await window.FB.signInWithPopup(window.FB.auth, window.FB.googleProvider);
                            const userObj = result.user;
                            let displayName = userObj.displayName;

                            if (!displayName) displayName = "Aspirante_" + Math.floor(Math.random() * 9999);
                            handleSuccessLogin(displayName);
                        } catch (error) {
                            const code = error && error.code ? String(error.code) : "";
                            const canFallbackToRedirect = [
                                "auth/popup-blocked",
                                "auth/popup-closed-by-user",
                                "auth/cancelled-popup-request",
                                "auth/operation-not-supported-in-this-environment"
                            ].includes(code);

                            if (canFallbackToRedirect) {
                                try {
                                    await useRedirect();
                                    return;
                                } catch (redirectError) {
                                    console.error(redirectError);
                                    showNotification("No se pudo abrir Google. Revisa popups y vuelve a intentar.", "error");
                                    return;
                                }
                            }

                            showNotification("Error interno al conectar con Google: " + error.message, "error");
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
