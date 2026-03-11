// app.js – Core logic for ENARMlab
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

        userName: "Isaac",
        userSpecialty: "",
        userUniversity: "",
        history: [],
        selectedTopics: [],
        reportedQuestions: [],
        myFriends: [],
        activeChallenges: []
    };

    const $ = (id) => document.getElementById(id);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));

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
        if (lower.includes('lupus') || lower.includes('les')) return 'Lupus Eritematoso Sistémico';
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

    const showNotification = (msg, type = 'info') => {
        let container = $('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '🚨';
        if (type === 'warning') icon = '⚠️';

        toast.innerHTML = `<span style="font-size: 18px;">${icon}</span><span style="flex:1;">${msg}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hiding');
            toast.addEventListener('animationend', () => toast.remove());
        }, 3500);
    };

    const showBanner = (title, msg, icon = '🔔', onClickCallback = null) => {
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
            <button class="notif-banner-close" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:16px;">✕</button>
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

    const showView = (viewId) => {
        if (State.view === "view-exam" && viewId !== "view-exam" && State.examActive) {
            if (typeof pauseTimer === 'function') {
                pauseTimer();
                showNotification("Examen pausado automáticamente.", "info");
            }
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
    };
    window.showView = showView; // Hacerla global para onclick de HTML

    const saveGlobalStats = () => {
        localStorage.setItem("enarm_stats", JSON.stringify(State.globalStats));
        localStorage.setItem("enarm_history", JSON.stringify(State.history));
        localStorage.setItem("enarm_user", State.userName);
        localStorage.setItem("enarm_specialty", State.userSpecialty || "");
        localStorage.setItem("enarm_university", State.userUniversity || "");
        localStorage.setItem("enarm_reports", JSON.stringify(State.reportedQuestions));

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
                reportsStr: JSON.stringify(State.reportedQuestions)
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
        const reports = localStorage.getItem("enarm_reports");
        if (reports) State.reportedQuestions = JSON.parse(reports);

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
    };

    const applyTheme = (theme) => {
        // Remove all current theme classes
        document.body.classList.remove("light-mode", "theme-forest", "theme-ocean", "theme-sunset", "theme-premium");

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
        "Ginecología y Obstetricia",
        "Amenorreas Primarias y Secundarias (Ginecología y Obstetricia)",
        "Sx de \r\nTurner (Amenorreas Primarias y Secundarias)",
        "Sx de Swyer (Amenorreas Primarias y Secundarias)",
        "Sx de Morris (Amenorreas Primarias y Secundarias)",
        "Sx Rokitansky (Amenorreas Primarias y Secundarias)",
        "Sx Asherman (Amenorreas Primarias y Secundarias)",
        "Sx de Sheehan (Amenorreas Primarias y Secundarias)",
        "Sx de Kallman (Amenorreas Primarias y Secundarias)",
        "Sx de \r\nPrader Willi (Amenorreas Primarias y Secundarias)",
        "Ciclo Genital / Esterilidad / Anticonceptivos (Ginecología y Obstetricia)",
        "Sangrados Uterinos Anormales: Origen No Anatómico (Ginecología y Obstetricia)",
        "Sangrados uterinos de origen \r\ndesconocido (Sangrados Uterinos Anormales: Origen No Anatómico)",
        "SOP (Sangrados Uterinos Anormales: Origen No Anatómico)",
        "Endometriosis (Sangrados Uterinos Anormales: Origen No Anatómico)",
        "Coagulopatías (Sangrados Uterinos Anormales: Origen No Anatómico)",
        "Patología Menopausia y Climaterio (Ginecología y Obstetricia)",
        "Menopausia (Patología Menopausia y Climaterio)",
        "Sx climatérico (Patología Menopausia y Climaterio)",
        "Osteoporosis (Patología Menopausia y Climaterio)",
        "Incontinencia \r\nurinaria (Patología Menopausia y Climaterio)",
        "Trastornos del piso pélvico (Patología Menopausia y Climaterio)",
        "Sangrados Uterinos Anormales: Origen Anatómico No Maligno (Ginecología y Obstetricia)",
        "Adenomiosis (Sangrados Uterinos Anormales: Origen Anatómico No Maligno)",
        "Poliposis (Sangrados Uterinos Anormales: Origen Anatómico No Maligno)",
        "Miomatosis (Sangrados Uterinos Anormales: Origen Anatómico No Maligno)",
        "Torsión ovárica (Sangrados Uterinos Anormales: Origen Anatómico No Maligno)",
        "Oncología Ginecológica P1 (Ginecología y Obstetricia)",
        "CA de endometrio y \r\nCA de ovario (Oncología Ginecológica P1)",
        "Oncología Ginecológica P2 (Ginecología y Obstetricia)",
        "Prevención y \r\ntamizaje de CACU (Oncología Ginecológica P2)",
        "CACU (Oncología Ginecológica P2)",
        "CA de vagina y vulvar (Oncología Ginecológica P2)",
        "Patología vulvar Bartolinitis (Oncología Ginecológica P2)",
        "Patología Mamaria Benigna (Ginecología y Obstetricia)",
        "Mastopatía \r\nfibroquística (Patología Mamaria Benigna)",
        "Fibroadenoma (Patología Mamaria Benigna)",
        "Mastitis puerperal y \r\nno puerperal (Patología Mamaria Benigna)",
        "Papiloma intraductal (Patología Mamaria Benigna)",
        "Cáncer de Mama (Ginecología y Obstetricia)",
        "Patología Infecciosa Cervical (Ginecología y Obstetricia)",
        "Cervicovaginitis \r\nbacteriana (Patología Infecciosa Cervical)",
        "Cándida (Patología Infecciosa Cervical)",
        "Trichomonas (Patología Infecciosa Cervical)",
        "Enfermedad \r\npélvica inflamatoria (Patología Infecciosa Cervical)",
        "Endocervicitis (Patología Infecciosa Cervical)",
        "Control Prenatal P1 (Ginecología y Obstetricia)",
        "Fisiología del embarazo (Control Prenatal P1)",
        "Consultas prenatales (Control Prenatal P1)",
        "Vacunas (Control Prenatal P1)",
        "Maniobras de \r\nLeopold (Control Prenatal P1)",
        "Control Prenatal P2 (Ginecología y Obstetricia)",
        "Incompatibilidad grupo Rh (Control Prenatal P2)",
        "Diagnóstico cromosomopatías (Control Prenatal P2)",
        "Depresión materna (Control Prenatal P2)",
        "Hiperémesis gravídica (Control Prenatal P2)",
        "Patología tiroidea en el \r\nembarazo (Control Prenatal P2)",
        "Hemorragias del Primer Trimestre (Ginecología y Obstetricia)",
        "Aborto (Hemorragias del Primer Trimestre)",
        "Embarazo ectópico (Hemorragias del Primer Trimestre)",
        "Enf. Trofoblástica (Hemorragias del Primer Trimestre)",
        "Hemorragias del Segundo Trimestre (Ginecología y Obstetricia)",
        "Placenta \r\nprevia (Hemorragias del Segundo Trimestre)",
        "Acretismo placentario (Hemorragias del Segundo Trimestre)",
        "DPPNI (Hemorragias del Segundo Trimestre)",
        "Vasa previa (Hemorragias del Segundo Trimestre)",
        "R. uterina (Hemorragias del Segundo Trimestre)",
        "Patología del Embarazo: Estados Hipertensivos (Ginecología y Obstetricia)",
        "Hipertensión crónica en el embarazo (Patología del Embarazo: Estados Hipertensivos)",
        "Hipertensión \r\ngestacional (Patología del Embarazo: Estados Hipertensivos)",
        "Preeclampsia (Patología del Embarazo: Estados Hipertensivos)",
        "Eclampsia (Patología del Embarazo: Estados Hipertensivos)",
        "Sx de \r\nHELLP (Patología del Embarazo: Estados Hipertensivos)",
        "Patología del Embarazo (Ginecología y Obstetricia)",
        "OM2 (Patología del Embarazo)",
        "Patología \r\nhepática del embarazo (Patología del Embarazo)",
        "Trabajo de Parto (Ginecología y Obstetricia)",
        "Fisiológico (Trabajo de Parto)",
        "Violencia \r\nobstétrica (Trabajo de Parto)",
        "Parto Prematuro y Patología Coriónica (Ginecología y Obstetricia)",
        "Parto \r\nprematuro (Parto Prematuro y Patología Coriónica)",
        "RPM (Parto Prematuro y Patología Coriónica)",
        "Poli (Parto Prematuro y Patología Coriónica)",
        "Oligohidramnios (Parto Prematuro y Patología Coriónica)",
        "Corioamnionitis (Parto Prematuro y Patología Coriónica)",
        "Patología de Trabajo de Parto (Ginecología y Obstetricia)",
        "Inducción de \r\ntrabajo de parto (Patología de Trabajo de Parto)",
        "Cesárea (Patología de Trabajo de Parto)",
        "Distocias (Patología de Trabajo de Parto)",
        "Embarazo \r\ngemelar (Patología de Trabajo de Parto)",
        "Patología Puerperal (Ginecología y Obstetricia)",
        "Hemorragia obstétrica \r\nAtonía, trauma, tejido, coagulopatías (Patología Puerperal)",
        "Choque en \r\nla paciente embarazada (Patología Puerperal)",
        "Sepsis materna (Patología Puerperal)",
        "Recién Nacido Sano (Pediatría)",
        "RN sano (Recién Nacido Sano)",
        "Cuidados del \r\nrecién nacido (Recién Nacido Sano)",
        "Tamizajes del RN (Recién Nacido Sano)",
        "Cefalohematoma (Recién Nacido Sano)",
        "Parálisis braquial (Recién Nacido Sano)",
        "Alteraciones dermatológicas al \r\nnacimiento (Recién Nacido Sano)",
        "Reanimación Neonatal (Pediatría)",
        "Patología Neonatal Infecciosa (Pediatría)",
        "Sepsis (Patología Neonatal Infecciosa)",
        "Neumonía (Patología Neonatal Infecciosa)",
        "Meningitis (Patología Neonatal Infecciosa)",
        "Enterocolitis necrotizante (Patología Neonatal Infecciosa)",
        "Onfalitis (Patología Neonatal Infecciosa)",
        "Patología Respiratoria del Pediátrico (Pediatría)",
        "EMH (Patología Respiratoria del Pediátrico)",
        "TTRN (Patología Respiratoria del Pediátrico)",
        "SAM (Patología Respiratoria del Pediátrico)",
        "Displasia (Patología Respiratoria del Pediátrico)",
        "Hipertensión pulmonar (Patología Respiratoria del Pediátrico)",
        "Apnea del prematuro (Patología Respiratoria del Pediátrico)",
        "Patología Neonatal (Pediatría)",
        "Asfixia (Patología Neonatal)",
        "EHI (Patología Neonatal)",
        "Hemorragia de \r\nmatriz germinal (Patología Neonatal)",
        "Malf. congénitas (Patología Neonatal)",
        "Hernias \r\ndiafragmáticas (Patología Neonatal)",
        "Atresia de las coanas (Patología Neonatal)",
        "A. pilórica (Patología Neonatal)",
        "A. duodenal (Patología Neonatal)",
        "A. esofágica (Patología Neonatal)",
        "Onfalocele (Patología Neonatal)",
        "Gastrosquisis (Patología Neonatal)",
        "Espina bífida (Patología Neonatal)",
        "Paladar hendido (Patología Neonatal)",
        "Malf. anorrectales (Patología Neonatal)",
        "Patología Neonatal Congénita Infecciosa (Pediatría)",
        "TORCH Citomegalovirus (Patología Neonatal Congénita Infecciosa)",
        "Toxoplasmosis (Patología Neonatal Congénita Infecciosa)",
        "Rubéola (Patología Neonatal Congénita Infecciosa)",
        "Varicela (Patología Neonatal Congénita Infecciosa)",
        "Sífilis (Patología Neonatal Congénita Infecciosa)",
        "Herpes y VIH el binomio (Patología Neonatal Congénita Infecciosa)",
        "Estenosis Hipertrófica del Píloro (Pediatría)",
        "Ictericia Neonatal (Pediatría)",
        "Fisiológica (Ictericia Neonatal)",
        "Materna (Ictericia Neonatal)",
        "Incompatibilidad sanguínea (Ictericia Neonatal)",
        "Ictericia por \r\nproblemas del metabolismo hepático (Ictericia Neonatal)",
        "Atresia de \r\nvías biliares (Ictericia Neonatal)",
        "Tamiz Metabólico (Pediatría)",
        "Hipotiroidismo (Tamiz Metabólico)",
        "Fenilcetonuria (Tamiz Metabólico)",
        "Galactosemia (Tamiz Metabólico)",
        "Deficiencia de \r\nbiotinidasa (Tamiz Metabólico)",
        "Hiperplasia suprarrenal (Tamiz Metabólico)",
        "Fibrosis \r\nquística (Tamiz Metabólico)",
        "Crecimiento y Desarrollo P1 (Pediatría)",
        "Hitos del desarrollo (Crecimiento y Desarrollo P1)",
        "Consulta del niño sano (Crecimiento y Desarrollo P1)",
        "Maltrato infantil (Crecimiento y Desarrollo P1)",
        "Crecimiento y Desarrollo P2 (Pediatría)",
        "Crecimiento (Crecimiento y Desarrollo P2)",
        "Alimentación (Crecimiento y Desarrollo P2)",
        "Desnutrición (Crecimiento y Desarrollo P2)",
        "Obesidad (Crecimiento y Desarrollo P2)",
        "Talla baja (Crecimiento y Desarrollo P2)",
        "Déficits vitamínicos (Crecimiento y Desarrollo P2)",
        "Muerte súbita (Crecimiento y Desarrollo P2)",
        "Vacunación (Pediatría)",
        "Patología Gastrointestinal del Pediátrico (Pediatría)",
        "Invaginación intestinal (Patología Gastrointestinal del Pediátrico)",
        "Divertículo de Meckel (Patología Gastrointestinal del Pediátrico)",
        "Enf. \r\nde Hirschsprung (Patología Gastrointestinal del Pediátrico)",
        "ERGE (Patología Gastrointestinal del Pediátrico)",
        "Diarrea en el Pediátrico (Pediatría)",
        "Planes de hidratación (Diarrea en el Pediátrico)",
        "Introducción diarreas (Diarrea en el Pediátrico)",
        "Diarreas Agudas y Crónicas (Pediatría)",
        "Diarrea \r\nenteroinvasiva (Diarreas Agudas y Crónicas)",
        "Intoxicaciones alimentarias (Diarreas Agudas y Crónicas)",
        "Enf. \r\nCelíaca (Diarreas Agudas y Crónicas)",
        "Enfermedades Parasitarias (Pediatría)",
        "Giardiasis (Enfermedades Parasitarias)",
        "E. \r\nhistolytica (Enfermedades Parasitarias)",
        "Ascaris (Enfermedades Parasitarias)",
        "Taeniasis cisticercosis (Enfermedades Parasitarias)",
        "Filariasis (Enfermedades Parasitarias)",
        "Oxiuriasis (Enfermedades Parasitarias)",
        "Escabiosis (Enfermedades Parasitarias)",
        "Patología Respiratoria del Lactante y Preescolar (Pediatría)",
        "Bronquiolitis (Patología Respiratoria del Lactante y Preescolar)",
        "Laringotraqueítis (Patología Respiratoria del Lactante y Preescolar)",
        "Epiglotitis (Patología Respiratoria del Lactante y Preescolar)",
        "Tos \r\nferina (Patología Respiratoria del Lactante y Preescolar)",
        "Laringotraqueítis bacteriana (Patología Respiratoria del Lactante y Preescolar)",
        "Neumonías (Pediatría)",
        "Bacterianas (Neumonías)",
        "Virales (Neumonías)",
        "Atípicas: en \r\nel adulto y pediátrico (Neumonías)",
        "Asma en el Adulto y Pediátrico (Pediatría)",
        "IRAs / Convulsiones (Pediatría)",
        "Resfriado común (IRAs / Convulsiones)",
        "Faringoamigdalitis (IRAs / Convulsiones)",
        "Difteria (IRAs / Convulsiones)",
        "Mononucleosis (IRAs / Convulsiones)",
        "Enfermedades Exantemáticas (Pediatría)",
        "Sarampión (Enfermedades Exantemáticas)",
        "Rubéola (Enfermedades Exantemáticas)",
        "Varicela (Enfermedades Exantemáticas)",
        "5ta enfermedad (Enfermedades Exantemáticas)",
        "6ta \r\nenfermedad (Enfermedades Exantemáticas)",
        "Escarlatina (Enfermedades Exantemáticas)",
        "Enfermedad de Kawasaki (Enfermedades Exantemáticas)",
        "Enfermedad Mano Boca Pie (Enfermedades Exantemáticas)",
        "Herpangina (Enfermedades Exantemáticas)",
        "Urgencias Pediátricas (Pediatría)",
        "Intoxicaciones por ASA y \r\nparacetamol (Urgencias Pediátricas)",
        "Ingesta de cáusticos (Urgencias Pediátricas)",
        "Ingesta de \r\nmetales pesados (Urgencias Pediátricas)",
        "Obstrucción de la vía aérea \r\nsuperior (Urgencias Pediátricas)",
        "Uropedia (Pediatría)",
        "Torsión testicular (Uropedia)",
        "Torsión del \r\napéndice testicular (Uropedia)",
        "Epididimitis (Uropedia)",
        "IVUs (Uropedia)",
        "Reflujo \r\nvesicoureteral (Uropedia)",
        "Cardiopedia (Pediatría)",
        "Cardiopatías acianógenas CIV, \r\nCIA, PCA, estenosis de la arteria pulmonar (Cardiopedia)",
        "Cardiopatías cianógenas TF, tronco arterioso \r\ncomún (Cardiopedia)",
        "Drenaje pulmonar venoso anómalo (Cardiopedia)",
        "Anomalía de Ebstein (Cardiopedia)",
        "Transposición de grandes \r\nvasos (Cardiopedia)",
        "Especialidades Pedia P1 (Pediatría)",
        "Oncopedia: \r\nNeuroblastoma (Especialidades Pedia P1)",
        "Nefroblastoma (Especialidades Pedia P1)",
        "Astrocitoma (Especialidades Pedia P1)",
        "Osteosarcoma (Especialidades Pedia P1)",
        "Sarcoma de Ewing. Dermapedia: \r\nDermatitis atópica (Especialidades Pedia P1)",
        "Dermatitis del pañal (Especialidades Pedia P1)",
        "Molusco \r\ncontagioso (Especialidades Pedia P1)",
        "Sx de piel escaldada (Especialidades Pedia P1)",
        "Sx de shock \r\ntóxico (Especialidades Pedia P1)",
        "Dermatitis seborreica (Especialidades Pedia P1)",
        "Especialidades Pedia P2 (Pediatría)",
        "Hematopedia: Púrpura \r\nde Henoch Schonlein (Especialidades Pedia P2)",
        "Púrpura trombocitopénica. \r\nOrtopedia: Displasia de cadera (Especialidades Pedia P2)",
        "Pie plano (Especialidades Pedia P2)",
        "Cojera (Especialidades Pedia P2)",
        "Alteraciones Cromosómicas y Perlas (Pediatría)",
        "Sx de \r\nDown (Alteraciones Cromosómicas y Perlas)",
        "Sx de Edwards (Alteraciones Cromosómicas y Perlas)",
        "Sx Patau (Alteraciones Cromosómicas y Perlas)",
        "Sx Klinefelter (Alteraciones Cromosómicas y Perlas)",
        "Introducción a Cirugía y Cirugía Abdominal (Cirugía)",
        "Abdomen agudo (Introducción a Cirugía y Cirugía Abdominal)",
        "Exploración física (Introducción a Cirugía y Cirugía Abdominal)",
        "Tipo de \r\nheridas OX (Introducción a Cirugía y Cirugía Abdominal)",
        "Patología Esofágica (Cirugía)",
        "Abdomen agudo (Patología Esofágica)",
        "Exploración física (Patología Esofágica)",
        "Tipo de heridas OX (Patología Esofágica)",
        "Patología Gástrica (Cirugía)",
        "Gastritis aguda o crónica (Patología Gástrica)",
        "Úlcera péptica duodenal y gástrica (Patología Gástrica)",
        "Úlcera péptica \r\ncomplicada y perforada (Patología Gástrica)",
        "Zollinger-Ellison (Patología Gástrica)",
        "Dispepsia funcional (Patología Gástrica)",
        "Patología Biliar (Cirugía)",
        "Colecistitis (Patología Biliar)",
        "Colelitiasis (Patología Biliar)",
        "Coledocolitiasis (Patología Biliar)",
        "Colangitis (Patología Biliar)",
        "Íleo biliar (Patología Biliar)",
        "Patología Pancreática (Cirugía)",
        "Pancreatitis aguda y \r\ncrónica (Patología Pancreática)",
        "Apendicitis (Cirugía)",
        "Patología Diverticular (Cirugía)",
        "Diverticulosis (Patología Diverticular)",
        "Diverticulitis (Patología Diverticular)",
        "Enfermedad diverticular (Patología Diverticular)",
        "Patología Intestinal Qx (Cirugía)",
        "Obstrucción intestinal (Patología Intestinal Qx)",
        "Vólvulo de colon y ciego (Patología Intestinal Qx)",
        "Patología Isquémica Intestinal (Cirugía)",
        "Isquemia \r\nmesentérica aguda y crónica (Patología Isquémica Intestinal)",
        "Patología Intestinal Inflamatoria (Cirugía)",
        "Colitis ulcerosa (Patología Intestinal Inflamatoria)",
        "Enfermedad de Crohn (Patología Intestinal Inflamatoria)",
        "Sx de intestino irritable (Patología Intestinal Inflamatoria)",
        "Hernias / Esplenectomía (Cirugía)",
        "Patología Hepática (Cirugía)",
        "Hepatitis agudas y crónicas (Patología Hepática)",
        "Enfermedad hepática grasa (Patología Hepática)",
        "Cirrosis y sus Complicaciones / Trasplante Hepático (Cirugía)",
        "STDA por várices esofágicas (Cirrosis y sus Complicaciones / Trasplante Hepático)",
        "Ascitis (Cirrosis y sus Complicaciones / Trasplante Hepático)",
        "Encefalopatía hepática (Cirrosis y sus Complicaciones / Trasplante Hepático)",
        "Peritonitis bacteriana \r\nespontánea (Cirrosis y sus Complicaciones / Trasplante Hepático)",
        "Esprue (Cirrosis y sus Complicaciones / Trasplante Hepático)",
        "Patología Arterial y Venosa (Cirugía)",
        "Insuficiencia arterial \r\naguda (Patología Arterial y Venosa)",
        "Enfermedad arterial periférica (Patología Arterial y Venosa)",
        "Trombosis \r\nvenosa profunda (Patología Arterial y Venosa)",
        "Tromboembolia pulmonar (Patología Arterial y Venosa)",
        "Patología Perianal (Cirugía)",
        "Hemorroides (Patología Perianal)",
        "Abscesos (Patología Perianal)",
        "Fisuras (Patología Perianal)",
        "Fístulas (Patología Perianal)",
        "Urología P1 (Cirugía)",
        "Infección de vías urinarias bajas y \r\naltas (Urología P1)",
        "Urología P2 (Cirugía)",
        "Litiasis renal (Urología P2)",
        "Patología Prostática (Cirugía)",
        "Hiperplasia prostática (Patología Prostática)",
        "Prostatitis (Patología Prostática)",
        "ETS (Cirugía)",
        "Linfogranuloma venéreo (ETS)",
        "Chancro (ETS)",
        "Chancroide (ETS)",
        "Sífilis (ETS)",
        "Herpes (ETS)",
        "ATLS P1 (Cirugía)",
        "Introducción (ATLS P1)",
        "Manejo de vía aérea (ATLS P1)",
        "Choque (ATLS P1)",
        "Trauma torácico Neumotórax a tensión, \r\ntaponamiento cardíaco, hemotórax masivo, \r\nneumotórax abierto, tórax inestable (ATLS P1)",
        "ATLS P2 (Cirugía)",
        "TCE hemorragia epidural, \r\nsubaracnoidea, subdural (ATLS P2)",
        "Sx medulares (ATLS P2)",
        "ATLS P3 (Cirugía)",
        "Trauma abdominal, Fx de cadera, \r\ntrauma genitourinario, ATLS en la embarazada (ATLS P3)",
        "Intoxicaciones (Cirugía)",
        "Toxíndromes: Serotoninérgico (Intoxicaciones)",
        "Anticolinérgico (Intoxicaciones)",
        "Colinérgico (Intoxicaciones)",
        "Simpaticomimético (Intoxicaciones)",
        "Opioide (Intoxicaciones)",
        "Mordeduras y Picaduras (Cirugía)",
        "Alacranismo (Mordeduras y Picaduras)",
        "Loxoscelismo (Mordeduras y Picaduras)",
        "Latrodectismo (Mordeduras y Picaduras)",
        "Mordedura de \r\nserpientes (Mordeduras y Picaduras)",
        "Quemaduras / Golpe de Calor / Hipotermia (Cirugía)",
        "Cirugía Oncología (Cirugía)",
        "CA de esófago (Cirugía Oncología)",
        "Gástrico (Cirugía Oncología)",
        "Páncreas (Cirugía Oncología)",
        "CA de colon y recto (Cirugía Oncología)",
        "CA hepático (Cirugía Oncología)",
        "CA \r\nrenal (Cirugía Oncología)",
        "Sx de Lynch (Cirugía Oncología)",
        "CA de Próstata / Tumores Testiculares (Cirugía)",
        "Introducción Oftalmología (Cirugía)",
        "Generalidades (Introducción Oftalmología)",
        "Ametropías (Introducción Oftalmología)",
        "Patología de anexos (Introducción Oftalmología)",
        "Sx de ojo seco (Introducción Oftalmología)",
        "Blefaritis (Introducción Oftalmología)",
        "Orzuelo (Introducción Oftalmología)",
        "Chalazión (Introducción Oftalmología)",
        "Dacrioadenitis (Introducción Oftalmología)",
        "Trauma ocular (Introducción Oftalmología)",
        "Celulitis periorbitaria (Introducción Oftalmología)",
        "Patología Cámara Anterior (Cirugía)",
        "Conjuntivitis (Patología Cámara Anterior)",
        "Escleritis (Patología Cámara Anterior)",
        "Epiescleritis (Patología Cámara Anterior)",
        "Queratocono (Patología Cámara Anterior)",
        "Tracoma (Patología Cámara Anterior)",
        "Pterigión (Patología Cámara Anterior)",
        "Pinguécula (Patología Cámara Anterior)",
        "Patología Cámara Posterior (Cirugía)",
        "Catarata (Patología Cámara Posterior)",
        "Glaucoma (Patología Cámara Posterior)",
        "Uveítis (Patología Cámara Posterior)",
        "Desprendimiento de retina (Patología Cámara Posterior)",
        "Retinopatía diabética (Patología Cámara Posterior)",
        "Retinopatía hipertensiva (Patología Cámara Posterior)",
        "Hipoacusia y Vértigo (Cirugía)",
        "VPPN (Hipoacusia y Vértigo)",
        "Enfermedad (Hipoacusia y Vértigo)",
        "Sx de \r\nMeniere (Hipoacusia y Vértigo)",
        "Neuronitis vestibular (Hipoacusia y Vértigo)",
        "Hipoacusia \r\nneurosensorial (Hipoacusia y Vértigo)",
        "Otoesclerosis (Hipoacusia y Vértigo)",
        "Patología Infecciosa / Rinología y Faringe (Cirugía)",
        "OMA (Patología Infecciosa / Rinología y Faringe)",
        "EA (Patología Infecciosa / Rinología y Faringe)",
        "Otitis media maligna (Patología Infecciosa / Rinología y Faringe)",
        "SAOS (Patología Infecciosa / Rinología y Faringe)",
        "CA de laringe (Patología Infecciosa / Rinología y Faringe)",
        "Absceso periamigdalino y faríngeo (Patología Infecciosa / Rinología y Faringe)",
        "Papilomatosis \r\nlaríngea (Patología Infecciosa / Rinología y Faringe)",
        "Trauma Generalidades y Complicaciones (Cirugía)",
        "Fx en \r\nrama verde (Trauma Generalidades y Complicaciones)",
        "Sx compartimental (Trauma Generalidades y Complicaciones)",
        "Sx de dolor \r\nlocoregional (Trauma Generalidades y Complicaciones)",
        "Embolia grasa (Trauma Generalidades y Complicaciones)",
        "Patología de Extremidad Superior (Cirugía)",
        "Fx de brazo (Patología de Extremidad Superior)",
        "Antebrazo y mano (Patología de Extremidad Superior)",
        "Patología de hombro doloroso (Patología de Extremidad Superior)",
        "Patología de Extremidad Inferior (Cirugía)",
        "Fx de cadera (Patología de Extremidad Inferior)",
        "Fx de extremidades inferiores (Patología de Extremidad Inferior)",
        "Esguince de tobillo (Patología de Extremidad Inferior)",
        "Epidemiología (Cirugía)",
        "Clase de Inglés (Cirugía)",
        "Introducción MI / Introducción Infectología (Medicina Interna)",
        "SRIS (Introducción MI / Introducción Infectología)",
        "Sepsis (Introducción MI / Introducción Infectología)",
        "Choque séptico (Introducción MI / Introducción Infectología)",
        "Antibióticos (Introducción MI / Introducción Infectología)",
        "Tuberculosis (Medicina Interna)",
        "Virus de la Inmunodeficiencia Humana (Medicina Interna)",
        "Enfermedades Transmitidas por Vector (Medicina Interna)",
        "Dengue (Enfermedades Transmitidas por Vector)",
        "Zika (Enfermedades Transmitidas por Vector)",
        "Chikungunya (Enfermedades Transmitidas por Vector)",
        "Paludismo (Enfermedades Transmitidas por Vector)",
        "Malaria (Enfermedades Transmitidas por Vector)",
        "Chagas (Enfermedades Transmitidas por Vector)",
        "Enfermedades por Zoonosis (Medicina Interna)",
        "Brucelosis (Enfermedades por Zoonosis)",
        "Rickettsiosis (Enfermedades por Zoonosis)",
        "Enf. Lyme (Enfermedades por Zoonosis)",
        "Carbunco (Enfermedades por Zoonosis)",
        "Tularemia (Enfermedades por Zoonosis)",
        "Tétanos / Botulismo / Rabia / Patología Fúngica (Medicina Interna)",
        "EPOC / CA de Pulmón (Medicina Interna)",
        "Neumonías Ocupacionales / Derrame Pleural (Medicina Interna)",
        "Bisinosis (Neumonías Ocupacionales / Derrame Pleural)",
        "Silicosis (Neumonías Ocupacionales / Derrame Pleural)",
        "Asbestosis (Neumonías Ocupacionales / Derrame Pleural)",
        "Neumonitis por \r\ncarbón (Neumonías Ocupacionales / Derrame Pleural)",
        "Sarcoidosis (Neumonías Ocupacionales / Derrame Pleural)",
        "Proteinosis alveolar (Neumonías Ocupacionales / Derrame Pleural)",
        "Patología Tiroidea (Medicina Interna)",
        "Hipertiroidismo: Enfermedad \r\nde Graves (Patología Tiroidea)",
        "Tiroiditis de Riedel (Patología Tiroidea)",
        "Tiroiditis de \r\nQuervain (Patología Tiroidea)",
        "Tirotoxicosis (Patología Tiroidea)",
        "Hipotiroidismo (Patología Tiroidea)",
        "Hashimoto (Patología Tiroidea)",
        "Coma mixedematoso (Patología Tiroidea)",
        "Cáncer de \r\ntiroides (Patología Tiroidea)",
        "Síndrome Metabólico (Medicina Interna)",
        "Diabetes (Medicina Interna)",
        "Complicaciones Diabetes (Medicina Interna)",
        "Pie diabético (Complicaciones Diabetes)",
        "Neuropatía diabética (Complicaciones Diabetes)",
        "Cetoacidosis (Complicaciones Diabetes)",
        "Edo \r\nHiperosmolar (Complicaciones Diabetes)",
        "Patología Central y Suprarrenal (Medicina Interna)",
        "Diabetes \r\ninsípida (Patología Central y Suprarrenal)",
        "Hiperprolactinemia (Patología Central y Suprarrenal)",
        "Enfermedad de \r\nAddison (Patología Central y Suprarrenal)",
        "Sx de Cushing (Patología Central y Suprarrenal)",
        "Insuficiencia suprarrenal (Patología Central y Suprarrenal)",
        "Perlas (Medicina Interna)",
        "Anemias Introducción y Anemias Carenciales (Medicina Interna)",
        "Anemias carenciales (Anemias Introducción y Anemias Carenciales)",
        "Enfermedad crónica (Anemias Introducción y Anemias Carenciales)",
        "Anemia ferropénica (Anemias Introducción y Anemias Carenciales)",
        "Anemia megaloblástica (Anemias Introducción y Anemias Carenciales)",
        "Anemias Hemolíticas (Medicina Interna)",
        "Talasemias (Anemias Hemolíticas)",
        "Esferocitosis \r\nhereditaria (Anemias Hemolíticas)",
        "Deficiencia de glucosa 6 fosfato (Anemias Hemolíticas)",
        "Anemia falciforme (Anemias Hemolíticas)",
        "Anemias autoinmunes (Anemias Hemolíticas)",
        "Leucemias (Medicina Interna)",
        "LLA (Leucemias)",
        "LMA (Leucemias)",
        "LMC (Leucemias)",
        "Oncohematología (Medicina Interna)",
        "Linfoma Hodgkin (Oncohematología)",
        "Linfoma \r\nNo Hodgkin (Oncohematología)",
        "Anormalidades de la Hemostasia y Perlas (Medicina Interna)",
        "Hemofilia (Anormalidades de la Hemostasia y Perlas)",
        "Enf. de Von Willebrand (Anormalidades de la Hemostasia y Perlas)",
        "Púrpura \r\ntrombocitopénica (Anormalidades de la Hemostasia y Perlas)",
        "Sx Mielodisplásicos (Anormalidades de la Hemostasia y Perlas)",
        "Sx \r\nMieloproliferativos (Anormalidades de la Hemostasia y Perlas)",
        "Introducción Cardiología (Medicina Interna)",
        "Insuficiencia Cardíaca Aguda y Crónica (Medicina Interna)",
        "Valvulopatías (Medicina Interna)",
        "Insuficiencia aórtica (Valvulopatías)",
        "Mitral (Valvulopatías)",
        "Estenosis aórtica y mitral (Valvulopatías)",
        "Síndromes Coronarios (Medicina Interna)",
        "Angina estable e \r\ninestable (Síndromes Coronarios)",
        "Infarto agudo al miocardio (Síndromes Coronarios)",
        "ACLS y BLS (Medicina Interna)",
        "Trastornos del Ritmo (Medicina Interna)",
        "Fibrilación auricular (Trastornos del Ritmo)",
        "Flutter auricular (Trastornos del Ritmo)",
        "Taquicardia supraventricular (Trastornos del Ritmo)",
        "Fibrilación ventricular (Trastornos del Ritmo)",
        "Hipertensión Arterial (Medicina Interna)",
        "Infecto Cardio y Perlas (Medicina Interna)",
        "Pericarditis (Infecto Cardio y Perlas)",
        "Endocarditis (Infecto Cardio y Perlas)",
        "Miocarditis (Infecto Cardio y Perlas)",
        "Miocardiopatía \r\nhipertrófica (Infecto Cardio y Perlas)",
        "Tumores cardíacos (Infecto Cardio y Perlas)",
        "EVC Isquémico y Hemorrágico (Medicina Interna)",
        "Trastornos del Movimiento / Enf. Neurodegenerativas (Medicina Interna)",
        "Parkinson (Trastornos del Movimiento / Enf. Neurodegenerativas)",
        "ELA (Trastornos del Movimiento / Enf. Neurodegenerativas)",
        "Esclerosis \r\nmúltiple (Trastornos del Movimiento / Enf. Neurodegenerativas)",
        "Temblor esencial (Trastornos del Movimiento / Enf. Neurodegenerativas)",
        "Miastenia gravis (Trastornos del Movimiento / Enf. Neurodegenerativas)",
        "Parálisis flácida Sx de Guillain Barré (Trastornos del Movimiento / Enf. Neurodegenerativas)",
        "Cefaleas (Medicina Interna)",
        "Cefalea tensional (Cefaleas)",
        "Migraña (Cefaleas)",
        "Cefalea \r\nen racimos (Cefaleas)",
        "Cefalea trigémino autonómica (Cefaleas)",
        "Demencias (Medicina Interna)",
        "Alzheimer (Demencias)",
        "Demencia \r\nfrontotemporal (Demencias)",
        "Demencia por cuerpos de Lewis (Demencias)",
        "Infecto Derma (Medicina Interna)",
        "Tiñas inflamatorias y no \r\ninflamatorias (Infecto Derma)",
        "Lepra (Infecto Derma)",
        "Acné (Infecto Derma)",
        "Pitiriasis versicolor (Infecto Derma)",
        "Oncoderma (Medicina Interna)",
        "Melanoma (Oncoderma)",
        "CA basocelular (Oncoderma)",
        "CA \r\nespinocelular (Oncoderma)",
        "Patología Dermatológica (Medicina Interna)",
        "Liquen plano (Patología Dermatológica)",
        "Vitiligo (Patología Dermatológica)",
        "Psoriasis (Patología Dermatológica)",
        "Pénfigo vulgar (Patología Dermatológica)",
        "Pitiriasis rosada (Patología Dermatológica)",
        "Sx de \r\nStevens Johnson (Patología Dermatológica)",
        "Reumatología (Medicina Interna)",
        "Reacciones de hipersensibilidad (Reumatología)",
        "Artritis reumatoide (Reumatología)",
        "Osteoartritis (Reumatología)",
        "Espondilopatías (Reumatología)",
        "Fibromialgia (Reumatología)",
        "LES (Reumatología)",
        "Vasculitis (Reumatología)",
        "Granulomatosis (Reumatología)",
        "Sx de Sjögren (Reumatología)",
        "Nefrología (Medicina Interna)",
        "Sx nefríticos (Nefrología)",
        "Sx nefrótico (Nefrología)",
        "Abscesos renales (Nefrología)",
        "Psiquiatría P1 (Medicina Interna)",
        "Sx nefríticos (Psiquiatría P1)",
        "Sx nefrótico (Psiquiatría P1)",
        "Abscesos renales (Psiquiatría P1)",
        "Psiquiatría P2 (Medicina Interna)",
        "Adicciones (Psiquiatría P2)",
        "Delirium tremens (Psiquiatría P2)",
        "Autismo (Psiquiatría P2)",
        "TDAH (Psiquiatría P2)",
        "Esquizofrenia (Psiquiatría P2)",
        "Trastornos del \r\nsueño (Psiquiatría P2)",
        "Geriatría (Medicina Interna)",
        "Sx geriátricos (Geriatría)",
        "Escalas geriátricas (Geriatría)"
    ];

    const TEMARIO_MAPPING = {
        "Ginecología y Obstetricia": [
                "Ginecología y Obstetricia"
        ],
        "Amenorreas Primarias y Secundarias (Ginecología y Obstetricia)": [
                "Amenorreas Primarias y Secundarias",
                "Sx de \r\nTurner",
                "Sx de Swyer",
                "Sx de Morris",
                "Sx Rokitansky",
                "Sx Asherman",
                "Sx de Sheehan",
                "Sx de Kallman",
                "Sx de \r\nPrader Willi"
        ],
        "Sx de \r\nTurner (Amenorreas Primarias y Secundarias)": [
                "Sx de \r\nTurner"
        ],
        "Sx de Swyer (Amenorreas Primarias y Secundarias)": [
                "Sx de Swyer"
        ],
        "Sx de Morris (Amenorreas Primarias y Secundarias)": [
                "Sx de Morris"
        ],
        "Sx Rokitansky (Amenorreas Primarias y Secundarias)": [
                "Sx Rokitansky"
        ],
        "Sx Asherman (Amenorreas Primarias y Secundarias)": [
                "Sx Asherman"
        ],
        "Sx de Sheehan (Amenorreas Primarias y Secundarias)": [
                "Sx de Sheehan"
        ],
        "Sx de Kallman (Amenorreas Primarias y Secundarias)": [
                "Sx de Kallman"
        ],
        "Sx de \r\nPrader Willi (Amenorreas Primarias y Secundarias)": [
                "Sx de \r\nPrader Willi"
        ],
        "Ciclo Genital / Esterilidad / Anticonceptivos (Ginecología y Obstetricia)": [
                "Ciclo Genital / Esterilidad / Anticonceptivos"
        ],
        "Sangrados Uterinos Anormales: Origen No Anatómico (Ginecología y Obstetricia)": [
                "Sangrados Uterinos Anormales: Origen No Anatómico",
                "Sangrados uterinos de origen \r\ndesconocido",
                "SOP",
                "Endometriosis",
                "Coagulopatías"
        ],
        "Sangrados uterinos de origen \r\ndesconocido (Sangrados Uterinos Anormales: Origen No Anatómico)": [
                "Sangrados uterinos de origen \r\ndesconocido"
        ],
        "SOP (Sangrados Uterinos Anormales: Origen No Anatómico)": [
                "SOP"
        ],
        "Endometriosis (Sangrados Uterinos Anormales: Origen No Anatómico)": [
                "Endometriosis"
        ],
        "Coagulopatías (Sangrados Uterinos Anormales: Origen No Anatómico)": [
                "Coagulopatías"
        ],
        "Patología Menopausia y Climaterio (Ginecología y Obstetricia)": [
                "Patología Menopausia y Climaterio",
                "Menopausia",
                "Sx climatérico",
                "Osteoporosis",
                "Incontinencia \r\nurinaria",
                "Trastornos del piso pélvico"
        ],
        "Menopausia (Patología Menopausia y Climaterio)": [
                "Menopausia"
        ],
        "Sx climatérico (Patología Menopausia y Climaterio)": [
                "Sx climatérico"
        ],
        "Osteoporosis (Patología Menopausia y Climaterio)": [
                "Osteoporosis"
        ],
        "Incontinencia \r\nurinaria (Patología Menopausia y Climaterio)": [
                "Incontinencia \r\nurinaria"
        ],
        "Trastornos del piso pélvico (Patología Menopausia y Climaterio)": [
                "Trastornos del piso pélvico"
        ],
        "Sangrados Uterinos Anormales: Origen Anatómico No Maligno (Ginecología y Obstetricia)": [
                "Sangrados Uterinos Anormales: Origen Anatómico No Maligno",
                "Adenomiosis",
                "Poliposis",
                "Miomatosis",
                "Torsión ovárica"
        ],
        "Adenomiosis (Sangrados Uterinos Anormales: Origen Anatómico No Maligno)": [
                "Adenomiosis"
        ],
        "Poliposis (Sangrados Uterinos Anormales: Origen Anatómico No Maligno)": [
                "Poliposis"
        ],
        "Miomatosis (Sangrados Uterinos Anormales: Origen Anatómico No Maligno)": [
                "Miomatosis"
        ],
        "Torsión ovárica (Sangrados Uterinos Anormales: Origen Anatómico No Maligno)": [
                "Torsión ovárica"
        ],
        "Oncología Ginecológica P1 (Ginecología y Obstetricia)": [
                "Oncología Ginecológica P1",
                "CA de endometrio y \r\nCA de ovario"
        ],
        "CA de endometrio y \r\nCA de ovario (Oncología Ginecológica P1)": [
                "CA de endometrio y \r\nCA de ovario"
        ],
        "Oncología Ginecológica P2 (Ginecología y Obstetricia)": [
                "Oncología Ginecológica P2",
                "Prevención y \r\ntamizaje de CACU",
                "CACU",
                "CA de vagina y vulvar",
                "Patología vulvar (Bartolinitis)"
        ],
        "Prevención y \r\ntamizaje de CACU (Oncología Ginecológica P2)": [
                "Prevención y \r\ntamizaje de CACU"
        ],
        "CACU (Oncología Ginecológica P2)": [
                "CACU"
        ],
        "CA de vagina y vulvar (Oncología Ginecológica P2)": [
                "CA de vagina y vulvar"
        ],
        "Patología vulvar Bartolinitis (Oncología Ginecológica P2)": [
                "Patología vulvar Bartolinitis"
        ],
        "Patología Mamaria Benigna (Ginecología y Obstetricia)": [
                "Patología Mamaria Benigna",
                "Mastopatía \r\nfibroquística",
                "Fibroadenoma",
                "Mastitis puerperal y \r\nno puerperal",
                "Papiloma intraductal"
        ],
        "Mastopatía \r\nfibroquística (Patología Mamaria Benigna)": [
                "Mastopatía \r\nfibroquística"
        ],
        "Fibroadenoma (Patología Mamaria Benigna)": [
                "Fibroadenoma"
        ],
        "Mastitis puerperal y \r\nno puerperal (Patología Mamaria Benigna)": [
                "Mastitis puerperal y \r\nno puerperal"
        ],
        "Papiloma intraductal (Patología Mamaria Benigna)": [
                "Papiloma intraductal"
        ],
        "Cáncer de Mama (Ginecología y Obstetricia)": [
                "Cáncer de Mama"
        ],
        "Patología Infecciosa Cervical (Ginecología y Obstetricia)": [
                "Patología Infecciosa Cervical",
                "Cervicovaginitis \r\nbacteriana",
                "Cándida",
                "Trichomonas",
                "Enfermedad \r\npélvica inflamatoria",
                "Endocervicitis"
        ],
        "Cervicovaginitis \r\nbacteriana (Patología Infecciosa Cervical)": [
                "Cervicovaginitis \r\nbacteriana"
        ],
        "Cándida (Patología Infecciosa Cervical)": [
                "Cándida"
        ],
        "Trichomonas (Patología Infecciosa Cervical)": [
                "Trichomonas"
        ],
        "Enfermedad \r\npélvica inflamatoria (Patología Infecciosa Cervical)": [
                "Enfermedad \r\npélvica inflamatoria"
        ],
        "Endocervicitis (Patología Infecciosa Cervical)": [
                "Endocervicitis"
        ],
        "Control Prenatal P1 (Ginecología y Obstetricia)": [
                "Control Prenatal P1",
                "Fisiología del embarazo",
                "Consultas prenatales",
                "Vacunas",
                "Maniobras de \r\nLeopold"
        ],
        "Fisiología del embarazo (Control Prenatal P1)": [
                "Fisiología del embarazo"
        ],
        "Consultas prenatales (Control Prenatal P1)": [
                "Consultas prenatales"
        ],
        "Vacunas (Control Prenatal P1)": [
                "Vacunas"
        ],
        "Maniobras de \r\nLeopold (Control Prenatal P1)": [
                "Maniobras de \r\nLeopold"
        ],
        "Control Prenatal P2 (Ginecología y Obstetricia)": [
                "Control Prenatal P2",
                "Incompatibilidad grupo Rh",
                "Diagnóstico cromosomopatías",
                "Depresión materna",
                "Hiperémesis gravídica",
                "Patología tiroidea en el \r\nembarazo"
        ],
        "Incompatibilidad grupo Rh (Control Prenatal P2)": [
                "Incompatibilidad grupo Rh"
        ],
        "Diagnóstico cromosomopatías (Control Prenatal P2)": [
                "Diagnóstico cromosomopatías"
        ],
        "Depresión materna (Control Prenatal P2)": [
                "Depresión materna"
        ],
        "Hiperémesis gravídica (Control Prenatal P2)": [
                "Hiperémesis gravídica"
        ],
        "Patología tiroidea en el \r\nembarazo (Control Prenatal P2)": [
                "Patología tiroidea en el \r\nembarazo"
        ],
        "Hemorragias del Primer Trimestre (Ginecología y Obstetricia)": [
                "Hemorragias del Primer Trimestre",
                "Aborto",
                "Embarazo ectópico",
                "Enf. Trofoblástica"
        ],
        "Aborto (Hemorragias del Primer Trimestre)": [
                "Aborto"
        ],
        "Embarazo ectópico (Hemorragias del Primer Trimestre)": [
                "Embarazo ectópico"
        ],
        "Enf. Trofoblástica (Hemorragias del Primer Trimestre)": [
                "Enf. Trofoblástica"
        ],
        "Hemorragias del Segundo Trimestre (Ginecología y Obstetricia)": [
                "Hemorragias del Segundo Trimestre",
                "Placenta \r\nprevia",
                "Acretismo placentario",
                "DPPNI",
                "Vasa previa",
                "R. uterina"
        ],
        "Placenta \r\nprevia (Hemorragias del Segundo Trimestre)": [
                "Placenta \r\nprevia"
        ],
        "Acretismo placentario (Hemorragias del Segundo Trimestre)": [
                "Acretismo placentario"
        ],
        "DPPNI (Hemorragias del Segundo Trimestre)": [
                "DPPNI"
        ],
        "Vasa previa (Hemorragias del Segundo Trimestre)": [
                "Vasa previa"
        ],
        "R. uterina (Hemorragias del Segundo Trimestre)": [
                "R. uterina"
        ],
        "Patología del Embarazo: Estados Hipertensivos (Ginecología y Obstetricia)": [
                "Patología del Embarazo: Estados Hipertensivos",
                "Hipertensión crónica en el embarazo",
                "Hipertensión \r\ngestacional",
                "Preeclampsia",
                "Eclampsia",
                "Sx de \r\nHELLP"
        ],
        "Hipertensión crónica en el embarazo (Patología del Embarazo: Estados Hipertensivos)": [
                "Hipertensión crónica en el embarazo"
        ],
        "Hipertensión \r\ngestacional (Patología del Embarazo: Estados Hipertensivos)": [
                "Hipertensión \r\ngestacional"
        ],
        "Preeclampsia (Patología del Embarazo: Estados Hipertensivos)": [
                "Preeclampsia"
        ],
        "Eclampsia (Patología del Embarazo: Estados Hipertensivos)": [
                "Eclampsia"
        ],
        "Sx de \r\nHELLP (Patología del Embarazo: Estados Hipertensivos)": [
                "Sx de \r\nHELLP"
        ],
        "Patología del Embarazo (Ginecología y Obstetricia)": [
                "Patología del Embarazo",
                "OM2",
                "Patología \r\nhepática del embarazo"
        ],
        "OM2 (Patología del Embarazo)": [
                "OM2"
        ],
        "Patología \r\nhepática del embarazo (Patología del Embarazo)": [
                "Patología \r\nhepática del embarazo"
        ],
        "Trabajo de Parto (Ginecología y Obstetricia)": [
                "Trabajo de Parto",
                "Fisiológico",
                "Violencia \r\nobstétrica"
        ],
        "Fisiológico (Trabajo de Parto)": [
                "Fisiológico"
        ],
        "Violencia \r\nobstétrica (Trabajo de Parto)": [
                "Violencia \r\nobstétrica"
        ],
        "Parto Prematuro y Patología Coriónica (Ginecología y Obstetricia)": [
                "Parto Prematuro y Patología Coriónica",
                "Parto \r\nprematuro",
                "RPM",
                "Poli",
                "Oligohidramnios",
                "Corioamnionitis"
        ],
        "Parto \r\nprematuro (Parto Prematuro y Patología Coriónica)": [
                "Parto \r\nprematuro"
        ],
        "RPM (Parto Prematuro y Patología Coriónica)": [
                "RPM"
        ],
        "Poli (Parto Prematuro y Patología Coriónica)": [
                "Poli"
        ],
        "Oligohidramnios (Parto Prematuro y Patología Coriónica)": [
                "Oligohidramnios"
        ],
        "Corioamnionitis (Parto Prematuro y Patología Coriónica)": [
                "Corioamnionitis"
        ],
        "Patología de Trabajo de Parto (Ginecología y Obstetricia)": [
                "Patología de Trabajo de Parto",
                "Inducción de \r\ntrabajo de parto",
                "Cesárea",
                "Distocias",
                "Embarazo \r\ngemelar"
        ],
        "Inducción de \r\ntrabajo de parto (Patología de Trabajo de Parto)": [
                "Inducción de \r\ntrabajo de parto"
        ],
        "Cesárea (Patología de Trabajo de Parto)": [
                "Cesárea"
        ],
        "Distocias (Patología de Trabajo de Parto)": [
                "Distocias"
        ],
        "Embarazo \r\ngemelar (Patología de Trabajo de Parto)": [
                "Embarazo \r\ngemelar"
        ],
        "Patología Puerperal (Ginecología y Obstetricia)": [
                "Patología Puerperal",
                "Hemorragia obstétrica \r\n(Atonía, trauma, tejido, coagulopatías)",
                "Choque en \r\nla paciente embarazada",
                "Sepsis materna"
        ],
        "Hemorragia obstétrica \r\nAtonía, trauma, tejido, coagulopatías (Patología Puerperal)": [
                "Hemorragia obstétrica \r\nAtonía, trauma, tejido, coagulopatías"
        ],
        "Choque en \r\nla paciente embarazada (Patología Puerperal)": [
                "Choque en \r\nla paciente embarazada"
        ],
        "Sepsis materna (Patología Puerperal)": [
                "Sepsis materna"
        ],
        "Recién Nacido Sano (Pediatría)": [
                "Recién Nacido Sano",
                "RN sano",
                "Cuidados del \r\nrecién nacido",
                "Tamizajes del RN",
                "Cefalohematoma",
                "Parálisis braquial",
                "Alteraciones dermatológicas al \r\nnacimiento"
        ],
        "RN sano (Recién Nacido Sano)": [
                "RN sano"
        ],
        "Cuidados del \r\nrecién nacido (Recién Nacido Sano)": [
                "Cuidados del \r\nrecién nacido"
        ],
        "Tamizajes del RN (Recién Nacido Sano)": [
                "Tamizajes del RN"
        ],
        "Cefalohematoma (Recién Nacido Sano)": [
                "Cefalohematoma"
        ],
        "Parálisis braquial (Recién Nacido Sano)": [
                "Parálisis braquial"
        ],
        "Alteraciones dermatológicas al \r\nnacimiento (Recién Nacido Sano)": [
                "Alteraciones dermatológicas al \r\nnacimiento"
        ],
        "Reanimación Neonatal (Pediatría)": [
                "Reanimación Neonatal"
        ],
        "Patología Neonatal Infecciosa (Pediatría)": [
                "Patología Neonatal Infecciosa",
                "Sepsis",
                "Neumonía",
                "Meningitis",
                "Enterocolitis necrotizante",
                "Onfalitis"
        ],
        "Sepsis (Patología Neonatal Infecciosa)": [
                "Sepsis"
        ],
        "Neumonía (Patología Neonatal Infecciosa)": [
                "Neumonía"
        ],
        "Meningitis (Patología Neonatal Infecciosa)": [
                "Meningitis"
        ],
        "Enterocolitis necrotizante (Patología Neonatal Infecciosa)": [
                "Enterocolitis necrotizante"
        ],
        "Onfalitis (Patología Neonatal Infecciosa)": [
                "Onfalitis"
        ],
        "Patología Respiratoria del Pediátrico (Pediatría)": [
                "Patología Respiratoria del Pediátrico",
                "EMH",
                "TTRN",
                "SAM",
                "Displasia",
                "Hipertensión pulmonar",
                "Apnea del prematuro"
        ],
        "EMH (Patología Respiratoria del Pediátrico)": [
                "EMH"
        ],
        "TTRN (Patología Respiratoria del Pediátrico)": [
                "TTRN"
        ],
        "SAM (Patología Respiratoria del Pediátrico)": [
                "SAM"
        ],
        "Displasia (Patología Respiratoria del Pediátrico)": [
                "Displasia"
        ],
        "Hipertensión pulmonar (Patología Respiratoria del Pediátrico)": [
                "Hipertensión pulmonar"
        ],
        "Apnea del prematuro (Patología Respiratoria del Pediátrico)": [
                "Apnea del prematuro"
        ],
        "Patología Neonatal (Pediatría)": [
                "Patología Neonatal",
                "Asfixia",
                "EHI",
                "Hemorragia de \r\nmatriz germinal",
                "Malf. congénitas",
                "Hernias \r\ndiafragmáticas",
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
        "Asfixia (Patología Neonatal)": [
                "Asfixia"
        ],
        "EHI (Patología Neonatal)": [
                "EHI"
        ],
        "Hemorragia de \r\nmatriz germinal (Patología Neonatal)": [
                "Hemorragia de \r\nmatriz germinal"
        ],
        "Malf. congénitas (Patología Neonatal)": [
                "Malf. congénitas"
        ],
        "Hernias \r\ndiafragmáticas (Patología Neonatal)": [
                "Hernias \r\ndiafragmáticas"
        ],
        "Atresia de las coanas (Patología Neonatal)": [
                "Atresia de las coanas"
        ],
        "A. pilórica (Patología Neonatal)": [
                "A. pilórica"
        ],
        "A. duodenal (Patología Neonatal)": [
                "A. duodenal"
        ],
        "A. esofágica (Patología Neonatal)": [
                "A. esofágica"
        ],
        "Onfalocele (Patología Neonatal)": [
                "Onfalocele"
        ],
        "Gastrosquisis (Patología Neonatal)": [
                "Gastrosquisis"
        ],
        "Espina bífida (Patología Neonatal)": [
                "Espina bífida"
        ],
        "Paladar hendido (Patología Neonatal)": [
                "Paladar hendido"
        ],
        "Malf. anorrectales (Patología Neonatal)": [
                "Malf. anorrectales"
        ],
        "Patología Neonatal Congénita Infecciosa (Pediatría)": [
                "Patología Neonatal Congénita Infecciosa",
                "TORCH (Citomegalovirus",
                "Toxoplasmosis",
                "Rubéola",
                "Varicela",
                "Sífilis",
                "Herpes) y VIH el binomio"
        ],
        "TORCH Citomegalovirus (Patología Neonatal Congénita Infecciosa)": [
                "TORCH Citomegalovirus"
        ],
        "Toxoplasmosis (Patología Neonatal Congénita Infecciosa)": [
                "Toxoplasmosis"
        ],
        "Rubéola (Patología Neonatal Congénita Infecciosa)": [
                "Rubéola"
        ],
        "Varicela (Patología Neonatal Congénita Infecciosa)": [
                "Varicela"
        ],
        "Sífilis (Patología Neonatal Congénita Infecciosa)": [
                "Sífilis"
        ],
        "Herpes y VIH el binomio (Patología Neonatal Congénita Infecciosa)": [
                "Herpes y VIH el binomio"
        ],
        "Estenosis Hipertrófica del Píloro (Pediatría)": [
                "Estenosis Hipertrófica del Píloro"
        ],
        "Ictericia Neonatal (Pediatría)": [
                "Ictericia Neonatal",
                "Fisiológica",
                "Materna",
                "Incompatibilidad sanguínea",
                "Ictericia por \r\nproblemas del metabolismo hepático",
                "Atresia de \r\nvías biliares"
        ],
        "Fisiológica (Ictericia Neonatal)": [
                "Fisiológica"
        ],
        "Materna (Ictericia Neonatal)": [
                "Materna"
        ],
        "Incompatibilidad sanguínea (Ictericia Neonatal)": [
                "Incompatibilidad sanguínea"
        ],
        "Ictericia por \r\nproblemas del metabolismo hepático (Ictericia Neonatal)": [
                "Ictericia por \r\nproblemas del metabolismo hepático"
        ],
        "Atresia de \r\nvías biliares (Ictericia Neonatal)": [
                "Atresia de \r\nvías biliares"
        ],
        "Tamiz Metabólico (Pediatría)": [
                "Tamiz Metabólico",
                "Hipotiroidismo",
                "Fenilcetonuria",
                "Galactosemia",
                "Deficiencia de \r\nbiotinidasa",
                "Hiperplasia suprarrenal",
                "Fibrosis \r\nquística"
        ],
        "Hipotiroidismo (Tamiz Metabólico)": [
                "Hipotiroidismo"
        ],
        "Fenilcetonuria (Tamiz Metabólico)": [
                "Fenilcetonuria"
        ],
        "Galactosemia (Tamiz Metabólico)": [
                "Galactosemia"
        ],
        "Deficiencia de \r\nbiotinidasa (Tamiz Metabólico)": [
                "Deficiencia de \r\nbiotinidasa"
        ],
        "Hiperplasia suprarrenal (Tamiz Metabólico)": [
                "Hiperplasia suprarrenal"
        ],
        "Fibrosis \r\nquística (Tamiz Metabólico)": [
                "Fibrosis \r\nquística"
        ],
        "Crecimiento y Desarrollo P1 (Pediatría)": [
                "Crecimiento y Desarrollo P1",
                "Hitos del desarrollo",
                "Consulta del niño sano",
                "Maltrato infantil"
        ],
        "Hitos del desarrollo (Crecimiento y Desarrollo P1)": [
                "Hitos del desarrollo"
        ],
        "Consulta del niño sano (Crecimiento y Desarrollo P1)": [
                "Consulta del niño sano"
        ],
        "Maltrato infantil (Crecimiento y Desarrollo P1)": [
                "Maltrato infantil"
        ],
        "Crecimiento y Desarrollo P2 (Pediatría)": [
                "Crecimiento y Desarrollo P2",
                "Crecimiento",
                "Alimentación",
                "Desnutrición",
                "Obesidad",
                "Talla baja",
                "Déficits vitamínicos",
                "Muerte súbita"
        ],
        "Crecimiento (Crecimiento y Desarrollo P2)": [
                "Crecimiento"
        ],
        "Alimentación (Crecimiento y Desarrollo P2)": [
                "Alimentación"
        ],
        "Desnutrición (Crecimiento y Desarrollo P2)": [
                "Desnutrición"
        ],
        "Obesidad (Crecimiento y Desarrollo P2)": [
                "Obesidad"
        ],
        "Talla baja (Crecimiento y Desarrollo P2)": [
                "Talla baja"
        ],
        "Déficits vitamínicos (Crecimiento y Desarrollo P2)": [
                "Déficits vitamínicos"
        ],
        "Muerte súbita (Crecimiento y Desarrollo P2)": [
                "Muerte súbita"
        ],
        "Vacunación (Pediatría)": [
                "Vacunación"
        ],
        "Patología Gastrointestinal del Pediátrico (Pediatría)": [
                "Patología Gastrointestinal del Pediátrico",
                "Invaginación intestinal",
                "Divertículo de Meckel",
                "Enf. \r\nde Hirschsprung",
                "ERGE"
        ],
        "Invaginación intestinal (Patología Gastrointestinal del Pediátrico)": [
                "Invaginación intestinal"
        ],
        "Divertículo de Meckel (Patología Gastrointestinal del Pediátrico)": [
                "Divertículo de Meckel"
        ],
        "Enf. \r\nde Hirschsprung (Patología Gastrointestinal del Pediátrico)": [
                "Enf. \r\nde Hirschsprung"
        ],
        "ERGE (Patología Gastrointestinal del Pediátrico)": [
                "ERGE"
        ],
        "Diarrea en el Pediátrico (Pediatría)": [
                "Diarrea en el Pediátrico",
                "Planes de hidratación",
                "Introducción diarreas"
        ],
        "Planes de hidratación (Diarrea en el Pediátrico)": [
                "Planes de hidratación"
        ],
        "Introducción diarreas (Diarrea en el Pediátrico)": [
                "Introducción diarreas"
        ],
        "Diarreas Agudas y Crónicas (Pediatría)": [
                "Diarreas Agudas y Crónicas",
                "Diarrea \r\nenteroinvasiva",
                "Intoxicaciones alimentarias",
                "Enf. \r\nCelíaca"
        ],
        "Diarrea \r\nenteroinvasiva (Diarreas Agudas y Crónicas)": [
                "Diarrea \r\nenteroinvasiva"
        ],
        "Intoxicaciones alimentarias (Diarreas Agudas y Crónicas)": [
                "Intoxicaciones alimentarias"
        ],
        "Enf. \r\nCelíaca (Diarreas Agudas y Crónicas)": [
                "Enf. \r\nCelíaca"
        ],
        "Enfermedades Parasitarias (Pediatría)": [
                "Enfermedades Parasitarias",
                "Giardiasis",
                "E. \r\nhistolytica",
                "Ascaris",
                "Taeniasis cisticercosis",
                "Filariasis",
                "Oxiuriasis",
                "Escabiosis"
        ],
        "Giardiasis (Enfermedades Parasitarias)": [
                "Giardiasis"
        ],
        "E. \r\nhistolytica (Enfermedades Parasitarias)": [
                "E. \r\nhistolytica"
        ],
        "Ascaris (Enfermedades Parasitarias)": [
                "Ascaris"
        ],
        "Taeniasis cisticercosis (Enfermedades Parasitarias)": [
                "Taeniasis cisticercosis"
        ],
        "Filariasis (Enfermedades Parasitarias)": [
                "Filariasis"
        ],
        "Oxiuriasis (Enfermedades Parasitarias)": [
                "Oxiuriasis"
        ],
        "Escabiosis (Enfermedades Parasitarias)": [
                "Escabiosis"
        ],
        "Patología Respiratoria del Lactante y Preescolar (Pediatría)": [
                "Patología Respiratoria del Lactante y Preescolar",
                "Bronquiolitis",
                "Laringotraqueítis",
                "Epiglotitis",
                "Tos \r\nferina",
                "Laringotraqueítis bacteriana"
        ],
        "Bronquiolitis (Patología Respiratoria del Lactante y Preescolar)": [
                "Bronquiolitis"
        ],
        "Laringotraqueítis (Patología Respiratoria del Lactante y Preescolar)": [
                "Laringotraqueítis"
        ],
        "Epiglotitis (Patología Respiratoria del Lactante y Preescolar)": [
                "Epiglotitis"
        ],
        "Tos \r\nferina (Patología Respiratoria del Lactante y Preescolar)": [
                "Tos \r\nferina"
        ],
        "Laringotraqueítis bacteriana (Patología Respiratoria del Lactante y Preescolar)": [
                "Laringotraqueítis bacteriana"
        ],
        "Neumonías (Pediatría)": [
                "Neumonías",
                "Bacterianas",
                "Virales",
                "Atípicas: en \r\nel adulto y pediátrico"
        ],
        "Bacterianas (Neumonías)": [
                "Bacterianas"
        ],
        "Virales (Neumonías)": [
                "Virales"
        ],
        "Atípicas: en \r\nel adulto y pediátrico (Neumonías)": [
                "Atípicas: en \r\nel adulto y pediátrico"
        ],
        "Asma en el Adulto y Pediátrico (Pediatría)": [
                "Asma en el Adulto y Pediátrico"
        ],
        "IRAs / Convulsiones (Pediatría)": [
                "IRAs / Convulsiones",
                "Resfriado común",
                "Faringoamigdalitis",
                "Difteria",
                "Mononucleosis"
        ],
        "Resfriado común (IRAs / Convulsiones)": [
                "Resfriado común"
        ],
        "Faringoamigdalitis (IRAs / Convulsiones)": [
                "Faringoamigdalitis"
        ],
        "Difteria (IRAs / Convulsiones)": [
                "Difteria"
        ],
        "Mononucleosis (IRAs / Convulsiones)": [
                "Mononucleosis"
        ],
        "Enfermedades Exantemáticas (Pediatría)": [
                "Enfermedades Exantemáticas",
                "Sarampión",
                "Rubéola",
                "Varicela",
                "5ta enfermedad",
                "6ta \r\nenfermedad",
                "Escarlatina",
                "Enfermedad de Kawasaki",
                "Enfermedad Mano Boca Pie",
                "Herpangina"
        ],
        "Sarampión (Enfermedades Exantemáticas)": [
                "Sarampión"
        ],
        "Rubéola (Enfermedades Exantemáticas)": [
                "Rubéola"
        ],
        "Varicela (Enfermedades Exantemáticas)": [
                "Varicela"
        ],
        "5ta enfermedad (Enfermedades Exantemáticas)": [
                "5ta enfermedad"
        ],
        "6ta \r\nenfermedad (Enfermedades Exantemáticas)": [
                "6ta \r\nenfermedad"
        ],
        "Escarlatina (Enfermedades Exantemáticas)": [
                "Escarlatina"
        ],
        "Enfermedad de Kawasaki (Enfermedades Exantemáticas)": [
                "Enfermedad de Kawasaki"
        ],
        "Enfermedad Mano Boca Pie (Enfermedades Exantemáticas)": [
                "Enfermedad Mano Boca Pie"
        ],
        "Herpangina (Enfermedades Exantemáticas)": [
                "Herpangina"
        ],
        "Urgencias Pediátricas (Pediatría)": [
                "Urgencias Pediátricas",
                "Intoxicaciones por ASA y \r\nparacetamol",
                "Ingesta de cáusticos",
                "Ingesta de \r\nmetales pesados",
                "Obstrucción de la vía aérea \r\nsuperior"
        ],
        "Intoxicaciones por ASA y \r\nparacetamol (Urgencias Pediátricas)": [
                "Intoxicaciones por ASA y \r\nparacetamol"
        ],
        "Ingesta de cáusticos (Urgencias Pediátricas)": [
                "Ingesta de cáusticos"
        ],
        "Ingesta de \r\nmetales pesados (Urgencias Pediátricas)": [
                "Ingesta de \r\nmetales pesados"
        ],
        "Obstrucción de la vía aérea \r\nsuperior (Urgencias Pediátricas)": [
                "Obstrucción de la vía aérea \r\nsuperior"
        ],
        "Uropedia (Pediatría)": [
                "Uropedia",
                "Torsión testicular",
                "Torsión del \r\napéndice testicular",
                "Epididimitis",
                "IVUs",
                "Reflujo \r\nvesicoureteral"
        ],
        "Torsión testicular (Uropedia)": [
                "Torsión testicular"
        ],
        "Torsión del \r\napéndice testicular (Uropedia)": [
                "Torsión del \r\napéndice testicular"
        ],
        "Epididimitis (Uropedia)": [
                "Epididimitis"
        ],
        "IVUs (Uropedia)": [
                "IVUs"
        ],
        "Reflujo \r\nvesicoureteral (Uropedia)": [
                "Reflujo \r\nvesicoureteral"
        ],
        "Cardiopedia (Pediatría)": [
                "Cardiopedia",
                "Cardiopatías acianógenas (CIV, \r\nCIA, PCA, estenosis de la arteria pulmonar)",
                "Cardiopatías cianógenas (TF, tronco arterioso \r\ncomún",
                "Drenaje pulmonar venoso anómalo",
                "Anomalía de Ebstein",
                "Transposición de grandes \r\nvasos)"
        ],
        "Cardiopatías acianógenas CIV, \r\nCIA, PCA, estenosis de la arteria pulmonar (Cardiopedia)": [
                "Cardiopatías acianógenas CIV, \r\nCIA, PCA, estenosis de la arteria pulmonar"
        ],
        "Cardiopatías cianógenas TF, tronco arterioso \r\ncomún (Cardiopedia)": [
                "Cardiopatías cianógenas TF, tronco arterioso \r\ncomún"
        ],
        "Drenaje pulmonar venoso anómalo (Cardiopedia)": [
                "Drenaje pulmonar venoso anómalo"
        ],
        "Anomalía de Ebstein (Cardiopedia)": [
                "Anomalía de Ebstein"
        ],
        "Transposición de grandes \r\nvasos (Cardiopedia)": [
                "Transposición de grandes \r\nvasos"
        ],
        "Especialidades Pedia P1 (Pediatría)": [
                "Especialidades Pedia P1",
                "Oncopedia: \r\nNeuroblastoma",
                "Nefroblastoma",
                "Astrocitoma",
                "Osteosarcoma",
                "Sarcoma de Ewing. Dermapedia: \r\nDermatitis atópica",
                "Dermatitis del pañal",
                "Molusco \r\ncontagioso",
                "Sx de piel escaldada",
                "Sx de shock \r\ntóxico",
                "Dermatitis seborreica"
        ],
        "Oncopedia: \r\nNeuroblastoma (Especialidades Pedia P1)": [
                "Oncopedia: \r\nNeuroblastoma"
        ],
        "Nefroblastoma (Especialidades Pedia P1)": [
                "Nefroblastoma"
        ],
        "Astrocitoma (Especialidades Pedia P1)": [
                "Astrocitoma"
        ],
        "Osteosarcoma (Especialidades Pedia P1)": [
                "Osteosarcoma"
        ],
        "Sarcoma de Ewing. Dermapedia: \r\nDermatitis atópica (Especialidades Pedia P1)": [
                "Sarcoma de Ewing. Dermapedia: \r\nDermatitis atópica"
        ],
        "Dermatitis del pañal (Especialidades Pedia P1)": [
                "Dermatitis del pañal"
        ],
        "Molusco \r\ncontagioso (Especialidades Pedia P1)": [
                "Molusco \r\ncontagioso"
        ],
        "Sx de piel escaldada (Especialidades Pedia P1)": [
                "Sx de piel escaldada"
        ],
        "Sx de shock \r\ntóxico (Especialidades Pedia P1)": [
                "Sx de shock \r\ntóxico"
        ],
        "Dermatitis seborreica (Especialidades Pedia P1)": [
                "Dermatitis seborreica"
        ],
        "Especialidades Pedia P2 (Pediatría)": [
                "Especialidades Pedia P2",
                "Hematopedia: Púrpura \r\nde Henoch Schonlein",
                "Púrpura trombocitopénica. \r\nOrtopedia: Displasia de cadera",
                "Pie plano",
                "Cojera"
        ],
        "Hematopedia: Púrpura \r\nde Henoch Schonlein (Especialidades Pedia P2)": [
                "Hematopedia: Púrpura \r\nde Henoch Schonlein"
        ],
        "Púrpura trombocitopénica. \r\nOrtopedia: Displasia de cadera (Especialidades Pedia P2)": [
                "Púrpura trombocitopénica. \r\nOrtopedia: Displasia de cadera"
        ],
        "Pie plano (Especialidades Pedia P2)": [
                "Pie plano"
        ],
        "Cojera (Especialidades Pedia P2)": [
                "Cojera"
        ],
        "Alteraciones Cromosómicas y Perlas (Pediatría)": [
                "Alteraciones Cromosómicas y Perlas",
                "Sx de \r\nDown",
                "Sx de Edwards",
                "Sx Patau",
                "Sx Klinefelter"
        ],
        "Sx de \r\nDown (Alteraciones Cromosómicas y Perlas)": [
                "Sx de \r\nDown"
        ],
        "Sx de Edwards (Alteraciones Cromosómicas y Perlas)": [
                "Sx de Edwards"
        ],
        "Sx Patau (Alteraciones Cromosómicas y Perlas)": [
                "Sx Patau"
        ],
        "Sx Klinefelter (Alteraciones Cromosómicas y Perlas)": [
                "Sx Klinefelter"
        ],
        "Introducción a Cirugía y Cirugía Abdominal (Cirugía)": [
                "Introducción a Cirugía y Cirugía Abdominal",
                "Abdomen agudo",
                "Exploración física",
                "Tipo de \r\nheridas OX"
        ],
        "Abdomen agudo (Introducción a Cirugía y Cirugía Abdominal)": [
                "Abdomen agudo"
        ],
        "Exploración física (Introducción a Cirugía y Cirugía Abdominal)": [
                "Exploración física"
        ],
        "Tipo de \r\nheridas OX (Introducción a Cirugía y Cirugía Abdominal)": [
                "Tipo de \r\nheridas OX"
        ],
        "Patología Esofágica (Cirugía)": [
                "Patología Esofágica",
                "Abdomen agudo",
                "Exploración física",
                "Tipo de heridas OX"
        ],
        "Abdomen agudo (Patología Esofágica)": [
                "Abdomen agudo"
        ],
        "Exploración física (Patología Esofágica)": [
                "Exploración física"
        ],
        "Tipo de heridas OX (Patología Esofágica)": [
                "Tipo de heridas OX"
        ],
        "Patología Gástrica (Cirugía)": [
                "Patología Gástrica",
                "Gastritis aguda o crónica",
                "Úlcera péptica duodenal y gástrica",
                "Úlcera péptica \r\ncomplicada y perforada",
                "Zollinger-Ellison",
                "Dispepsia funcional"
        ],
        "Gastritis aguda o crónica (Patología Gástrica)": [
                "Gastritis aguda o crónica"
        ],
        "Úlcera péptica duodenal y gástrica (Patología Gástrica)": [
                "Úlcera péptica duodenal y gástrica"
        ],
        "Úlcera péptica \r\ncomplicada y perforada (Patología Gástrica)": [
                "Úlcera péptica \r\ncomplicada y perforada"
        ],
        "Zollinger-Ellison (Patología Gástrica)": [
                "Zollinger-Ellison"
        ],
        "Dispepsia funcional (Patología Gástrica)": [
                "Dispepsia funcional"
        ],
        "Patología Biliar (Cirugía)": [
                "Patología Biliar",
                "Colecistitis",
                "Colelitiasis",
                "Coledocolitiasis",
                "Colangitis",
                "Íleo biliar"
        ],
        "Colecistitis (Patología Biliar)": [
                "Colecistitis"
        ],
        "Colelitiasis (Patología Biliar)": [
                "Colelitiasis"
        ],
        "Coledocolitiasis (Patología Biliar)": [
                "Coledocolitiasis"
        ],
        "Colangitis (Patología Biliar)": [
                "Colangitis"
        ],
        "Íleo biliar (Patología Biliar)": [
                "Íleo biliar"
        ],
        "Patología Pancreática (Cirugía)": [
                "Patología Pancreática",
                "Pancreatitis aguda y \r\ncrónica"
        ],
        "Pancreatitis aguda y \r\ncrónica (Patología Pancreática)": [
                "Pancreatitis aguda y \r\ncrónica"
        ],
        "Apendicitis (Cirugía)": [
                "Apendicitis"
        ],
        "Patología Diverticular (Cirugía)": [
                "Patología Diverticular",
                "Diverticulosis",
                "Diverticulitis",
                "Enfermedad diverticular"
        ],
        "Diverticulosis (Patología Diverticular)": [
                "Diverticulosis"
        ],
        "Diverticulitis (Patología Diverticular)": [
                "Diverticulitis"
        ],
        "Enfermedad diverticular (Patología Diverticular)": [
                "Enfermedad diverticular"
        ],
        "Patología Intestinal Qx (Cirugía)": [
                "Patología Intestinal Qx",
                "Obstrucción intestinal",
                "Vólvulo de colon y ciego"
        ],
        "Obstrucción intestinal (Patología Intestinal Qx)": [
                "Obstrucción intestinal"
        ],
        "Vólvulo de colon y ciego (Patología Intestinal Qx)": [
                "Vólvulo de colon y ciego"
        ],
        "Patología Isquémica Intestinal (Cirugía)": [
                "Patología Isquémica Intestinal",
                "Isquemia \r\nmesentérica aguda y crónica"
        ],
        "Isquemia \r\nmesentérica aguda y crónica (Patología Isquémica Intestinal)": [
                "Isquemia \r\nmesentérica aguda y crónica"
        ],
        "Patología Intestinal Inflamatoria (Cirugía)": [
                "Patología Intestinal Inflamatoria",
                "Colitis ulcerosa",
                "Enfermedad de Crohn",
                "Sx de intestino irritable"
        ],
        "Colitis ulcerosa (Patología Intestinal Inflamatoria)": [
                "Colitis ulcerosa"
        ],
        "Enfermedad de Crohn (Patología Intestinal Inflamatoria)": [
                "Enfermedad de Crohn"
        ],
        "Sx de intestino irritable (Patología Intestinal Inflamatoria)": [
                "Sx de intestino irritable"
        ],
        "Hernias / Esplenectomía (Cirugía)": [
                "Hernias / Esplenectomía"
        ],
        "Patología Hepática (Cirugía)": [
                "Patología Hepática",
                "Hepatitis agudas y crónicas",
                "Enfermedad hepática grasa"
        ],
        "Hepatitis agudas y crónicas (Patología Hepática)": [
                "Hepatitis agudas y crónicas"
        ],
        "Enfermedad hepática grasa (Patología Hepática)": [
                "Enfermedad hepática grasa"
        ],
        "Cirrosis y sus Complicaciones / Trasplante Hepático (Cirugía)": [
                "Cirrosis y sus Complicaciones / Trasplante Hepático",
                "STDA por várices esofágicas",
                "Ascitis",
                "Encefalopatía hepática",
                "Peritonitis bacteriana \r\nespontánea",
                "Esprue"
        ],
        "STDA por várices esofágicas (Cirrosis y sus Complicaciones / Trasplante Hepático)": [
                "STDA por várices esofágicas"
        ],
        "Ascitis (Cirrosis y sus Complicaciones / Trasplante Hepático)": [
                "Ascitis"
        ],
        "Encefalopatía hepática (Cirrosis y sus Complicaciones / Trasplante Hepático)": [
                "Encefalopatía hepática"
        ],
        "Peritonitis bacteriana \r\nespontánea (Cirrosis y sus Complicaciones / Trasplante Hepático)": [
                "Peritonitis bacteriana \r\nespontánea"
        ],
        "Esprue (Cirrosis y sus Complicaciones / Trasplante Hepático)": [
                "Esprue"
        ],
        "Patología Arterial y Venosa (Cirugía)": [
                "Patología Arterial y Venosa",
                "Insuficiencia arterial \r\naguda",
                "Enfermedad arterial periférica",
                "Trombosis \r\nvenosa profunda",
                "Tromboembolia pulmonar"
        ],
        "Insuficiencia arterial \r\naguda (Patología Arterial y Venosa)": [
                "Insuficiencia arterial \r\naguda"
        ],
        "Enfermedad arterial periférica (Patología Arterial y Venosa)": [
                "Enfermedad arterial periférica"
        ],
        "Trombosis \r\nvenosa profunda (Patología Arterial y Venosa)": [
                "Trombosis \r\nvenosa profunda"
        ],
        "Tromboembolia pulmonar (Patología Arterial y Venosa)": [
                "Tromboembolia pulmonar"
        ],
        "Patología Perianal (Cirugía)": [
                "Patología Perianal",
                "Hemorroides",
                "Abscesos",
                "Fisuras",
                "Fístulas"
        ],
        "Hemorroides (Patología Perianal)": [
                "Hemorroides"
        ],
        "Abscesos (Patología Perianal)": [
                "Abscesos"
        ],
        "Fisuras (Patología Perianal)": [
                "Fisuras"
        ],
        "Fístulas (Patología Perianal)": [
                "Fístulas"
        ],
        "Urología P1 (Cirugía)": [
                "Urología P1",
                "Infección de vías urinarias bajas y \r\naltas"
        ],
        "Infección de vías urinarias bajas y \r\naltas (Urología P1)": [
                "Infección de vías urinarias bajas y \r\naltas"
        ],
        "Urología P2 (Cirugía)": [
                "Urología P2",
                "Litiasis renal"
        ],
        "Litiasis renal (Urología P2)": [
                "Litiasis renal"
        ],
        "Patología Prostática (Cirugía)": [
                "Patología Prostática",
                "Hiperplasia prostática",
                "Prostatitis"
        ],
        "Hiperplasia prostática (Patología Prostática)": [
                "Hiperplasia prostática"
        ],
        "Prostatitis (Patología Prostática)": [
                "Prostatitis"
        ],
        "ETS (Cirugía)": [
                "ETS",
                "Linfogranuloma venéreo",
                "Chancro",
                "Chancroide",
                "Sífilis",
                "Herpes"
        ],
        "Linfogranuloma venéreo (ETS)": [
                "Linfogranuloma venéreo"
        ],
        "Chancro (ETS)": [
                "Chancro"
        ],
        "Chancroide (ETS)": [
                "Chancroide"
        ],
        "Sífilis (ETS)": [
                "Sífilis"
        ],
        "Herpes (ETS)": [
                "Herpes"
        ],
        "ATLS P1 (Cirugía)": [
                "ATLS P1",
                "Introducción",
                "Manejo de vía aérea",
                "Choque",
                "Trauma torácico (Neumotórax a tensión, \r\ntaponamiento cardíaco, hemotórax masivo, \r\nneumotórax abierto, tórax inestable)"
        ],
        "Introducción (ATLS P1)": [
                "Introducción"
        ],
        "Manejo de vía aérea (ATLS P1)": [
                "Manejo de vía aérea"
        ],
        "Choque (ATLS P1)": [
                "Choque"
        ],
        "Trauma torácico Neumotórax a tensión, \r\ntaponamiento cardíaco, hemotórax masivo, \r\nneumotórax abierto, tórax inestable (ATLS P1)": [
                "Trauma torácico Neumotórax a tensión, \r\ntaponamiento cardíaco, hemotórax masivo, \r\nneumotórax abierto, tórax inestable"
        ],
        "ATLS P2 (Cirugía)": [
                "ATLS P2",
                "TCE hemorragia epidural, \r\nsubaracnoidea, subdural",
                "Sx medulares"
        ],
        "TCE hemorragia epidural, \r\nsubaracnoidea, subdural (ATLS P2)": [
                "TCE hemorragia epidural, \r\nsubaracnoidea, subdural"
        ],
        "Sx medulares (ATLS P2)": [
                "Sx medulares"
        ],
        "ATLS P3 (Cirugía)": [
                "ATLS P3",
                "Trauma abdominal, Fx de cadera, \r\ntrauma genitourinario, ATLS en la embarazada"
        ],
        "Trauma abdominal, Fx de cadera, \r\ntrauma genitourinario, ATLS en la embarazada (ATLS P3)": [
                "Trauma abdominal, Fx de cadera, \r\ntrauma genitourinario, ATLS en la embarazada"
        ],
        "Intoxicaciones (Cirugía)": [
                "Intoxicaciones",
                "Toxíndromes: Serotoninérgico",
                "Anticolinérgico",
                "Colinérgico",
                "Simpaticomimético",
                "Opioide"
        ],
        "Toxíndromes: Serotoninérgico (Intoxicaciones)": [
                "Toxíndromes: Serotoninérgico"
        ],
        "Anticolinérgico (Intoxicaciones)": [
                "Anticolinérgico"
        ],
        "Colinérgico (Intoxicaciones)": [
                "Colinérgico"
        ],
        "Simpaticomimético (Intoxicaciones)": [
                "Simpaticomimético"
        ],
        "Opioide (Intoxicaciones)": [
                "Opioide"
        ],
        "Mordeduras y Picaduras (Cirugía)": [
                "Mordeduras y Picaduras",
                "Alacranismo",
                "Loxoscelismo",
                "Latrodectismo",
                "Mordedura de \r\nserpientes"
        ],
        "Alacranismo (Mordeduras y Picaduras)": [
                "Alacranismo"
        ],
        "Loxoscelismo (Mordeduras y Picaduras)": [
                "Loxoscelismo"
        ],
        "Latrodectismo (Mordeduras y Picaduras)": [
                "Latrodectismo"
        ],
        "Mordedura de \r\nserpientes (Mordeduras y Picaduras)": [
                "Mordedura de \r\nserpientes"
        ],
        "Quemaduras / Golpe de Calor / Hipotermia (Cirugía)": [
                "Quemaduras / Golpe de Calor / Hipotermia"
        ],
        "Cirugía Oncología (Cirugía)": [
                "Cirugía Oncología",
                "CA de esófago",
                "Gástrico",
                "Páncreas",
                "CA de colon y recto",
                "CA hepático",
                "CA \r\nrenal",
                "Sx de Lynch"
        ],
        "CA de esófago (Cirugía Oncología)": [
                "CA de esófago"
        ],
        "Gástrico (Cirugía Oncología)": [
                "Gástrico"
        ],
        "Páncreas (Cirugía Oncología)": [
                "Páncreas"
        ],
        "CA de colon y recto (Cirugía Oncología)": [
                "CA de colon y recto"
        ],
        "CA hepático (Cirugía Oncología)": [
                "CA hepático"
        ],
        "CA \r\nrenal (Cirugía Oncología)": [
                "CA \r\nrenal"
        ],
        "Sx de Lynch (Cirugía Oncología)": [
                "Sx de Lynch"
        ],
        "CA de Próstata / Tumores Testiculares (Cirugía)": [
                "CA de Próstata / Tumores Testiculares"
        ],
        "Introducción Oftalmología (Cirugía)": [
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
        "Generalidades (Introducción Oftalmología)": [
                "Generalidades"
        ],
        "Ametropías (Introducción Oftalmología)": [
                "Ametropías"
        ],
        "Patología de anexos (Introducción Oftalmología)": [
                "Patología de anexos"
        ],
        "Sx de ojo seco (Introducción Oftalmología)": [
                "Sx de ojo seco"
        ],
        "Blefaritis (Introducción Oftalmología)": [
                "Blefaritis"
        ],
        "Orzuelo (Introducción Oftalmología)": [
                "Orzuelo"
        ],
        "Chalazión (Introducción Oftalmología)": [
                "Chalazión"
        ],
        "Dacrioadenitis (Introducción Oftalmología)": [
                "Dacrioadenitis"
        ],
        "Trauma ocular (Introducción Oftalmología)": [
                "Trauma ocular"
        ],
        "Celulitis periorbitaria (Introducción Oftalmología)": [
                "Celulitis periorbitaria"
        ],
        "Patología Cámara Anterior (Cirugía)": [
                "Patología Cámara Anterior",
                "Conjuntivitis",
                "Escleritis",
                "Epiescleritis",
                "Queratocono",
                "Tracoma",
                "Pterigión",
                "Pinguécula"
        ],
        "Conjuntivitis (Patología Cámara Anterior)": [
                "Conjuntivitis"
        ],
        "Escleritis (Patología Cámara Anterior)": [
                "Escleritis"
        ],
        "Epiescleritis (Patología Cámara Anterior)": [
                "Epiescleritis"
        ],
        "Queratocono (Patología Cámara Anterior)": [
                "Queratocono"
        ],
        "Tracoma (Patología Cámara Anterior)": [
                "Tracoma"
        ],
        "Pterigión (Patología Cámara Anterior)": [
                "Pterigión"
        ],
        "Pinguécula (Patología Cámara Anterior)": [
                "Pinguécula"
        ],
        "Patología Cámara Posterior (Cirugía)": [
                "Patología Cámara Posterior",
                "Catarata",
                "Glaucoma",
                "Uveítis",
                "Desprendimiento de retina",
                "Retinopatía diabética",
                "Retinopatía hipertensiva"
        ],
        "Catarata (Patología Cámara Posterior)": [
                "Catarata"
        ],
        "Glaucoma (Patología Cámara Posterior)": [
                "Glaucoma"
        ],
        "Uveítis (Patología Cámara Posterior)": [
                "Uveítis"
        ],
        "Desprendimiento de retina (Patología Cámara Posterior)": [
                "Desprendimiento de retina"
        ],
        "Retinopatía diabética (Patología Cámara Posterior)": [
                "Retinopatía diabética"
        ],
        "Retinopatía hipertensiva (Patología Cámara Posterior)": [
                "Retinopatía hipertensiva"
        ],
        "Hipoacusia y Vértigo (Cirugía)": [
                "Hipoacusia y Vértigo",
                "VPPN",
                "Enfermedad",
                "Sx de \r\nMeniere",
                "Neuronitis vestibular",
                "Hipoacusia \r\nneurosensorial",
                "Otoesclerosis"
        ],
        "VPPN (Hipoacusia y Vértigo)": [
                "VPPN"
        ],
        "Enfermedad (Hipoacusia y Vértigo)": [
                "Enfermedad"
        ],
        "Sx de \r\nMeniere (Hipoacusia y Vértigo)": [
                "Sx de \r\nMeniere"
        ],
        "Neuronitis vestibular (Hipoacusia y Vértigo)": [
                "Neuronitis vestibular"
        ],
        "Hipoacusia \r\nneurosensorial (Hipoacusia y Vértigo)": [
                "Hipoacusia \r\nneurosensorial"
        ],
        "Otoesclerosis (Hipoacusia y Vértigo)": [
                "Otoesclerosis"
        ],
        "Patología Infecciosa / Rinología y Faringe (Cirugía)": [
                "Patología Infecciosa / Rinología y Faringe",
                "OMA",
                "EA",
                "Otitis media maligna",
                "SAOS",
                "CA de laringe",
                "Absceso periamigdalino y faríngeo",
                "Papilomatosis \r\nlaríngea"
        ],
        "OMA (Patología Infecciosa / Rinología y Faringe)": [
                "OMA"
        ],
        "EA (Patología Infecciosa / Rinología y Faringe)": [
                "EA"
        ],
        "Otitis media maligna (Patología Infecciosa / Rinología y Faringe)": [
                "Otitis media maligna"
        ],
        "SAOS (Patología Infecciosa / Rinología y Faringe)": [
                "SAOS"
        ],
        "CA de laringe (Patología Infecciosa / Rinología y Faringe)": [
                "CA de laringe"
        ],
        "Absceso periamigdalino y faríngeo (Patología Infecciosa / Rinología y Faringe)": [
                "Absceso periamigdalino y faríngeo"
        ],
        "Papilomatosis \r\nlaríngea (Patología Infecciosa / Rinología y Faringe)": [
                "Papilomatosis \r\nlaríngea"
        ],
        "Trauma Generalidades y Complicaciones (Cirugía)": [
                "Trauma Generalidades y Complicaciones",
                "Fx en \r\nrama verde",
                "Sx compartimental",
                "Sx de dolor \r\nlocoregional",
                "Embolia grasa"
        ],
        "Fx en \r\nrama verde (Trauma Generalidades y Complicaciones)": [
                "Fx en \r\nrama verde"
        ],
        "Sx compartimental (Trauma Generalidades y Complicaciones)": [
                "Sx compartimental"
        ],
        "Sx de dolor \r\nlocoregional (Trauma Generalidades y Complicaciones)": [
                "Sx de dolor \r\nlocoregional"
        ],
        "Embolia grasa (Trauma Generalidades y Complicaciones)": [
                "Embolia grasa"
        ],
        "Patología de Extremidad Superior (Cirugía)": [
                "Patología de Extremidad Superior",
                "Fx de brazo",
                "Antebrazo y mano",
                "Patología de hombro doloroso"
        ],
        "Fx de brazo (Patología de Extremidad Superior)": [
                "Fx de brazo"
        ],
        "Antebrazo y mano (Patología de Extremidad Superior)": [
                "Antebrazo y mano"
        ],
        "Patología de hombro doloroso (Patología de Extremidad Superior)": [
                "Patología de hombro doloroso"
        ],
        "Patología de Extremidad Inferior (Cirugía)": [
                "Patología de Extremidad Inferior",
                "Fx de cadera",
                "Fx de extremidades inferiores",
                "Esguince de tobillo"
        ],
        "Fx de cadera (Patología de Extremidad Inferior)": [
                "Fx de cadera"
        ],
        "Fx de extremidades inferiores (Patología de Extremidad Inferior)": [
                "Fx de extremidades inferiores"
        ],
        "Esguince de tobillo (Patología de Extremidad Inferior)": [
                "Esguince de tobillo"
        ],
        "Epidemiología (Cirugía)": [
                "Epidemiología"
        ],
        "Clase de Inglés (Cirugía)": [
                "Clase de Inglés"
        ],
        "Introducción MI / Introducción Infectología (Medicina Interna)": [
                "Introducción MI / Introducción Infectología",
                "SRIS",
                "Sepsis",
                "Choque séptico",
                "Antibióticos"
        ],
        "SRIS (Introducción MI / Introducción Infectología)": [
                "SRIS"
        ],
        "Sepsis (Introducción MI / Introducción Infectología)": [
                "Sepsis"
        ],
        "Choque séptico (Introducción MI / Introducción Infectología)": [
                "Choque séptico"
        ],
        "Antibióticos (Introducción MI / Introducción Infectología)": [
                "Antibióticos"
        ],
        "Tuberculosis (Medicina Interna)": [
                "Tuberculosis"
        ],
        "Virus de la Inmunodeficiencia Humana (Medicina Interna)": [
                "Virus de la Inmunodeficiencia Humana"
        ],
        "Enfermedades Transmitidas por Vector (Medicina Interna)": [
                "Enfermedades Transmitidas por Vector",
                "Dengue",
                "Zika",
                "Chikungunya",
                "Paludismo",
                "Malaria",
                "Chagas"
        ],
        "Dengue (Enfermedades Transmitidas por Vector)": [
                "Dengue"
        ],
        "Zika (Enfermedades Transmitidas por Vector)": [
                "Zika"
        ],
        "Chikungunya (Enfermedades Transmitidas por Vector)": [
                "Chikungunya"
        ],
        "Paludismo (Enfermedades Transmitidas por Vector)": [
                "Paludismo"
        ],
        "Malaria (Enfermedades Transmitidas por Vector)": [
                "Malaria"
        ],
        "Chagas (Enfermedades Transmitidas por Vector)": [
                "Chagas"
        ],
        "Enfermedades por Zoonosis (Medicina Interna)": [
                "Enfermedades por Zoonosis",
                "Brucelosis",
                "Rickettsiosis",
                "Enf. Lyme",
                "Carbunco",
                "Tularemia"
        ],
        "Brucelosis (Enfermedades por Zoonosis)": [
                "Brucelosis"
        ],
        "Rickettsiosis (Enfermedades por Zoonosis)": [
                "Rickettsiosis"
        ],
        "Enf. Lyme (Enfermedades por Zoonosis)": [
                "Enf. Lyme"
        ],
        "Carbunco (Enfermedades por Zoonosis)": [
                "Carbunco"
        ],
        "Tularemia (Enfermedades por Zoonosis)": [
                "Tularemia"
        ],
        "Tétanos / Botulismo / Rabia / Patología Fúngica (Medicina Interna)": [
                "Tétanos / Botulismo / Rabia / Patología Fúngica"
        ],
        "EPOC / CA de Pulmón (Medicina Interna)": [
                "EPOC / CA de Pulmón"
        ],
        "Neumonías Ocupacionales / Derrame Pleural (Medicina Interna)": [
                "Neumonías Ocupacionales / Derrame Pleural",
                "Bisinosis",
                "Silicosis",
                "Asbestosis",
                "Neumonitis por \r\ncarbón",
                "Sarcoidosis",
                "Proteinosis alveolar"
        ],
        "Bisinosis (Neumonías Ocupacionales / Derrame Pleural)": [
                "Bisinosis"
        ],
        "Silicosis (Neumonías Ocupacionales / Derrame Pleural)": [
                "Silicosis"
        ],
        "Asbestosis (Neumonías Ocupacionales / Derrame Pleural)": [
                "Asbestosis"
        ],
        "Neumonitis por \r\ncarbón (Neumonías Ocupacionales / Derrame Pleural)": [
                "Neumonitis por \r\ncarbón"
        ],
        "Sarcoidosis (Neumonías Ocupacionales / Derrame Pleural)": [
                "Sarcoidosis"
        ],
        "Proteinosis alveolar (Neumonías Ocupacionales / Derrame Pleural)": [
                "Proteinosis alveolar"
        ],
        "Patología Tiroidea (Medicina Interna)": [
                "Patología Tiroidea",
                "Hipertiroidismo: Enfermedad \r\nde Graves",
                "Tiroiditis de Riedel",
                "Tiroiditis de \r\nQuervain",
                "Tirotoxicosis",
                "Hipotiroidismo",
                "Hashimoto",
                "Coma mixedematoso",
                "Cáncer de \r\ntiroides"
        ],
        "Hipertiroidismo: Enfermedad \r\nde Graves (Patología Tiroidea)": [
                "Hipertiroidismo: Enfermedad \r\nde Graves"
        ],
        "Tiroiditis de Riedel (Patología Tiroidea)": [
                "Tiroiditis de Riedel"
        ],
        "Tiroiditis de \r\nQuervain (Patología Tiroidea)": [
                "Tiroiditis de \r\nQuervain"
        ],
        "Tirotoxicosis (Patología Tiroidea)": [
                "Tirotoxicosis"
        ],
        "Hipotiroidismo (Patología Tiroidea)": [
                "Hipotiroidismo"
        ],
        "Hashimoto (Patología Tiroidea)": [
                "Hashimoto"
        ],
        "Coma mixedematoso (Patología Tiroidea)": [
                "Coma mixedematoso"
        ],
        "Cáncer de \r\ntiroides (Patología Tiroidea)": [
                "Cáncer de \r\ntiroides"
        ],
        "Síndrome Metabólico (Medicina Interna)": [
                "Síndrome Metabólico"
        ],
        "Diabetes (Medicina Interna)": [
                "Diabetes"
        ],
        "Complicaciones Diabetes (Medicina Interna)": [
                "Complicaciones Diabetes",
                "Pie diabético",
                "Neuropatía diabética",
                "Cetoacidosis",
                "Edo \r\nHiperosmolar"
        ],
        "Pie diabético (Complicaciones Diabetes)": [
                "Pie diabético"
        ],
        "Neuropatía diabética (Complicaciones Diabetes)": [
                "Neuropatía diabética"
        ],
        "Cetoacidosis (Complicaciones Diabetes)": [
                "Cetoacidosis"
        ],
        "Edo \r\nHiperosmolar (Complicaciones Diabetes)": [
                "Edo \r\nHiperosmolar"
        ],
        "Patología Central y Suprarrenal (Medicina Interna)": [
                "Patología Central y Suprarrenal",
                "Diabetes \r\ninsípida",
                "Hiperprolactinemia",
                "Enfermedad de \r\nAddison",
                "Sx de Cushing",
                "Insuficiencia suprarrenal"
        ],
        "Diabetes \r\ninsípida (Patología Central y Suprarrenal)": [
                "Diabetes \r\ninsípida"
        ],
        "Hiperprolactinemia (Patología Central y Suprarrenal)": [
                "Hiperprolactinemia"
        ],
        "Enfermedad de \r\nAddison (Patología Central y Suprarrenal)": [
                "Enfermedad de \r\nAddison"
        ],
        "Sx de Cushing (Patología Central y Suprarrenal)": [
                "Sx de Cushing"
        ],
        "Insuficiencia suprarrenal (Patología Central y Suprarrenal)": [
                "Insuficiencia suprarrenal"
        ],
        "Perlas (Medicina Interna)": [
                "Perlas"
        ],
        "Anemias Introducción y Anemias Carenciales (Medicina Interna)": [
                "Anemias Introducción y Anemias Carenciales",
                "Anemias carenciales",
                "Enfermedad crónica",
                "Anemia ferropénica",
                "Anemia megaloblástica"
        ],
        "Anemias carenciales (Anemias Introducción y Anemias Carenciales)": [
                "Anemias carenciales"
        ],
        "Enfermedad crónica (Anemias Introducción y Anemias Carenciales)": [
                "Enfermedad crónica"
        ],
        "Anemia ferropénica (Anemias Introducción y Anemias Carenciales)": [
                "Anemia ferropénica"
        ],
        "Anemia megaloblástica (Anemias Introducción y Anemias Carenciales)": [
                "Anemia megaloblástica"
        ],
        "Anemias Hemolíticas (Medicina Interna)": [
                "Anemias Hemolíticas",
                "Talasemias",
                "Esferocitosis \r\nhereditaria",
                "Deficiencia de glucosa 6 fosfato",
                "Anemia falciforme",
                "Anemias autoinmunes"
        ],
        "Talasemias (Anemias Hemolíticas)": [
                "Talasemias"
        ],
        "Esferocitosis \r\nhereditaria (Anemias Hemolíticas)": [
                "Esferocitosis \r\nhereditaria"
        ],
        "Deficiencia de glucosa 6 fosfato (Anemias Hemolíticas)": [
                "Deficiencia de glucosa 6 fosfato"
        ],
        "Anemia falciforme (Anemias Hemolíticas)": [
                "Anemia falciforme"
        ],
        "Anemias autoinmunes (Anemias Hemolíticas)": [
                "Anemias autoinmunes"
        ],
        "Leucemias (Medicina Interna)": [
                "Leucemias",
                "LLA",
                "LMA",
                "LMC"
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
        "Oncohematología (Medicina Interna)": [
                "Oncohematología",
                "Linfoma Hodgkin",
                "Linfoma \r\nNo Hodgkin"
        ],
        "Linfoma Hodgkin (Oncohematología)": [
                "Linfoma Hodgkin"
        ],
        "Linfoma \r\nNo Hodgkin (Oncohematología)": [
                "Linfoma \r\nNo Hodgkin"
        ],
        "Anormalidades de la Hemostasia y Perlas (Medicina Interna)": [
                "Anormalidades de la Hemostasia y Perlas",
                "Hemofilia",
                "Enf. de Von Willebrand",
                "Púrpura \r\ntrombocitopénica",
                "Sx Mielodisplásicos",
                "Sx \r\nMieloproliferativos"
        ],
        "Hemofilia (Anormalidades de la Hemostasia y Perlas)": [
                "Hemofilia"
        ],
        "Enf. de Von Willebrand (Anormalidades de la Hemostasia y Perlas)": [
                "Enf. de Von Willebrand"
        ],
        "Púrpura \r\ntrombocitopénica (Anormalidades de la Hemostasia y Perlas)": [
                "Púrpura \r\ntrombocitopénica"
        ],
        "Sx Mielodisplásicos (Anormalidades de la Hemostasia y Perlas)": [
                "Sx Mielodisplásicos"
        ],
        "Sx \r\nMieloproliferativos (Anormalidades de la Hemostasia y Perlas)": [
                "Sx \r\nMieloproliferativos"
        ],
        "Introducción Cardiología (Medicina Interna)": [
                "Introducción Cardiología"
        ],
        "Insuficiencia Cardíaca Aguda y Crónica (Medicina Interna)": [
                "Insuficiencia Cardíaca Aguda y Crónica"
        ],
        "Valvulopatías (Medicina Interna)": [
                "Valvulopatías",
                "Insuficiencia aórtica",
                "Mitral",
                "Estenosis aórtica y mitral"
        ],
        "Insuficiencia aórtica (Valvulopatías)": [
                "Insuficiencia aórtica"
        ],
        "Mitral (Valvulopatías)": [
                "Mitral"
        ],
        "Estenosis aórtica y mitral (Valvulopatías)": [
                "Estenosis aórtica y mitral"
        ],
        "Síndromes Coronarios (Medicina Interna)": [
                "Síndromes Coronarios",
                "Angina estable e \r\ninestable",
                "Infarto agudo al miocardio"
        ],
        "Angina estable e \r\ninestable (Síndromes Coronarios)": [
                "Angina estable e \r\ninestable"
        ],
        "Infarto agudo al miocardio (Síndromes Coronarios)": [
                "Infarto agudo al miocardio"
        ],
        "ACLS y BLS (Medicina Interna)": [
                "ACLS y BLS"
        ],
        "Trastornos del Ritmo (Medicina Interna)": [
                "Trastornos del Ritmo",
                "Fibrilación auricular",
                "Flutter auricular",
                "Taquicardia supraventricular",
                "Fibrilación ventricular"
        ],
        "Fibrilación auricular (Trastornos del Ritmo)": [
                "Fibrilación auricular"
        ],
        "Flutter auricular (Trastornos del Ritmo)": [
                "Flutter auricular"
        ],
        "Taquicardia supraventricular (Trastornos del Ritmo)": [
                "Taquicardia supraventricular"
        ],
        "Fibrilación ventricular (Trastornos del Ritmo)": [
                "Fibrilación ventricular"
        ],
        "Hipertensión Arterial (Medicina Interna)": [
                "Hipertensión Arterial"
        ],
        "Infecto Cardio y Perlas (Medicina Interna)": [
                "Infecto Cardio y Perlas",
                "Pericarditis",
                "Endocarditis",
                "Miocarditis",
                "Miocardiopatía \r\nhipertrófica",
                "Tumores cardíacos"
        ],
        "Pericarditis (Infecto Cardio y Perlas)": [
                "Pericarditis"
        ],
        "Endocarditis (Infecto Cardio y Perlas)": [
                "Endocarditis"
        ],
        "Miocarditis (Infecto Cardio y Perlas)": [
                "Miocarditis"
        ],
        "Miocardiopatía \r\nhipertrófica (Infecto Cardio y Perlas)": [
                "Miocardiopatía \r\nhipertrófica"
        ],
        "Tumores cardíacos (Infecto Cardio y Perlas)": [
                "Tumores cardíacos"
        ],
        "EVC Isquémico y Hemorrágico (Medicina Interna)": [
                "EVC Isquémico y Hemorrágico"
        ],
        "Trastornos del Movimiento / Enf. Neurodegenerativas (Medicina Interna)": [
                "Trastornos del Movimiento / Enf. Neurodegenerativas",
                "Parkinson",
                "ELA",
                "Esclerosis \r\nmúltiple",
                "Temblor esencial",
                "Miastenia gravis",
                "Parálisis flácida (Sx de Guillain Barré)"
        ],
        "Parkinson (Trastornos del Movimiento / Enf. Neurodegenerativas)": [
                "Parkinson"
        ],
        "ELA (Trastornos del Movimiento / Enf. Neurodegenerativas)": [
                "ELA"
        ],
        "Esclerosis \r\nmúltiple (Trastornos del Movimiento / Enf. Neurodegenerativas)": [
                "Esclerosis \r\nmúltiple"
        ],
        "Temblor esencial (Trastornos del Movimiento / Enf. Neurodegenerativas)": [
                "Temblor esencial"
        ],
        "Miastenia gravis (Trastornos del Movimiento / Enf. Neurodegenerativas)": [
                "Miastenia gravis"
        ],
        "Parálisis flácida Sx de Guillain Barré (Trastornos del Movimiento / Enf. Neurodegenerativas)": [
                "Parálisis flácida Sx de Guillain Barré"
        ],
        "Cefaleas (Medicina Interna)": [
                "Cefaleas",
                "Cefalea tensional",
                "Migraña",
                "Cefalea \r\nen racimos",
                "Cefalea trigémino autonómica"
        ],
        "Cefalea tensional (Cefaleas)": [
                "Cefalea tensional"
        ],
        "Migraña (Cefaleas)": [
                "Migraña"
        ],
        "Cefalea \r\nen racimos (Cefaleas)": [
                "Cefalea \r\nen racimos"
        ],
        "Cefalea trigémino autonómica (Cefaleas)": [
                "Cefalea trigémino autonómica"
        ],
        "Demencias (Medicina Interna)": [
                "Demencias",
                "Alzheimer",
                "Demencia \r\nfrontotemporal",
                "Demencia por cuerpos de Lewis"
        ],
        "Alzheimer (Demencias)": [
                "Alzheimer"
        ],
        "Demencia \r\nfrontotemporal (Demencias)": [
                "Demencia \r\nfrontotemporal"
        ],
        "Demencia por cuerpos de Lewis (Demencias)": [
                "Demencia por cuerpos de Lewis"
        ],
        "Infecto Derma (Medicina Interna)": [
                "Infecto Derma",
                "Tiñas inflamatorias y no \r\ninflamatorias",
                "Lepra",
                "Acné",
                "Pitiriasis versicolor"
        ],
        "Tiñas inflamatorias y no \r\ninflamatorias (Infecto Derma)": [
                "Tiñas inflamatorias y no \r\ninflamatorias"
        ],
        "Lepra (Infecto Derma)": [
                "Lepra"
        ],
        "Acné (Infecto Derma)": [
                "Acné"
        ],
        "Pitiriasis versicolor (Infecto Derma)": [
                "Pitiriasis versicolor"
        ],
        "Oncoderma (Medicina Interna)": [
                "Oncoderma",
                "Melanoma",
                "CA basocelular",
                "CA \r\nespinocelular"
        ],
        "Melanoma (Oncoderma)": [
                "Melanoma"
        ],
        "CA basocelular (Oncoderma)": [
                "CA basocelular"
        ],
        "CA \r\nespinocelular (Oncoderma)": [
                "CA \r\nespinocelular"
        ],
        "Patología Dermatológica (Medicina Interna)": [
                "Patología Dermatológica",
                "Liquen plano",
                "Vitiligo",
                "Psoriasis",
                "Pénfigo vulgar",
                "Pitiriasis rosada",
                "Sx de \r\nStevens Johnson"
        ],
        "Liquen plano (Patología Dermatológica)": [
                "Liquen plano"
        ],
        "Vitiligo (Patología Dermatológica)": [
                "Vitiligo"
        ],
        "Psoriasis (Patología Dermatológica)": [
                "Psoriasis"
        ],
        "Pénfigo vulgar (Patología Dermatológica)": [
                "Pénfigo vulgar"
        ],
        "Pitiriasis rosada (Patología Dermatológica)": [
                "Pitiriasis rosada"
        ],
        "Sx de \r\nStevens Johnson (Patología Dermatológica)": [
                "Sx de \r\nStevens Johnson"
        ],
        "Reumatología (Medicina Interna)": [
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
        "Reacciones de hipersensibilidad (Reumatología)": [
                "Reacciones de hipersensibilidad"
        ],
        "Artritis reumatoide (Reumatología)": [
                "Artritis reumatoide"
        ],
        "Osteoartritis (Reumatología)": [
                "Osteoartritis"
        ],
        "Espondilopatías (Reumatología)": [
                "Espondilopatías"
        ],
        "Fibromialgia (Reumatología)": [
                "Fibromialgia"
        ],
        "LES (Reumatología)": [
                "LES"
        ],
        "Vasculitis (Reumatología)": [
                "Vasculitis"
        ],
        "Granulomatosis (Reumatología)": [
                "Granulomatosis"
        ],
        "Sx de Sjögren (Reumatología)": [
                "Sx de Sjögren"
        ],
        "Nefrología (Medicina Interna)": [
                "Nefrología",
                "Sx nefríticos",
                "Sx nefrótico",
                "Abscesos renales"
        ],
        "Sx nefríticos (Nefrología)": [
                "Sx nefríticos"
        ],
        "Sx nefrótico (Nefrología)": [
                "Sx nefrótico"
        ],
        "Abscesos renales (Nefrología)": [
                "Abscesos renales"
        ],
        "Psiquiatría P1 (Medicina Interna)": [
                "Psiquiatría P1",
                "Sx nefríticos",
                "Sx nefrótico",
                "Abscesos renales"
        ],
        "Sx nefríticos (Psiquiatría P1)": [
                "Sx nefríticos"
        ],
        "Sx nefrótico (Psiquiatría P1)": [
                "Sx nefrótico"
        ],
        "Abscesos renales (Psiquiatría P1)": [
                "Abscesos renales"
        ],
        "Psiquiatría P2 (Medicina Interna)": [
                "Psiquiatría P2",
                "Adicciones",
                "Delirium tremens",
                "Autismo",
                "TDAH",
                "Esquizofrenia",
                "Trastornos del \r\nsueño"
        ],
        "Adicciones (Psiquiatría P2)": [
                "Adicciones"
        ],
        "Delirium tremens (Psiquiatría P2)": [
                "Delirium tremens"
        ],
        "Autismo (Psiquiatría P2)": [
                "Autismo"
        ],
        "TDAH (Psiquiatría P2)": [
                "TDAH"
        ],
        "Esquizofrenia (Psiquiatría P2)": [
                "Esquizofrenia"
        ],
        "Trastornos del \r\nsueño (Psiquiatría P2)": [
                "Trastornos del \r\nsueño"
        ],
        "Geriatría (Medicina Interna)": [
                "Geriatría",
                "Sx geriátricos",
                "Escalas geriátricas"
        ],
        "Sx geriátricos (Geriatría)": [
                "Sx geriátricos"
        ],
        "Escalas geriátricas (Geriatría)": [
                "Escalas geriátricas"
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
                    <span class="remove-tag">✕</span>
                `;
                tag.querySelector(".remove-tag").onclick = () => {
                    State.selectedTopics.splice(index, 1);
                    updateSelectedTags();
                };
                selectedCont.appendChild(tag);
            });
        };

        const showSuggestions = (val) => {
            const normalizedVal = val.toLowerCase().trim();
            if (!normalizedVal) {
                suggestionsCont.classList.remove("active");
                return;
            }

            // Combinar temario oficial con temas dinámicos del banco de preguntas
            const dynTemas = [...new Set(QUESTIONS.map(q => q.tema).filter(t => !!t))];
            const dynSubtemas = [...new Set(QUESTIONS.map(q => q.subtema).filter(t => !!t))];
            const dynGpcs = [...new Set(QUESTIONS.map(q => q.gpcReference).filter(t => !!t))];

            const combinedTopics = [...new Set([
                ...OFFICIAL_TEMARIO,
                ...dynTemas,
                ...dynSubtemas,
                ...dynGpcs
            ])].sort();

            const removeAccents = (str) => {
                return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            };

            const searchVal = removeAccents(normalizedVal);

            const filtered = combinedTopics.filter(t => {
                const normalizedTopic = removeAccents(t.toLowerCase());
                return normalizedTopic.includes(searchVal) && !State.selectedTopics.includes(t);
            }).slice(0, 10);

            if (filtered.length === 0) {
                suggestionsCont.classList.remove("active");
                return;
            }

            suggestionsCont.innerHTML = "";
            activeIndex = -1;

            filtered.forEach((topic, idx) => {
                const item = document.createElement("div");
                item.className = "suggestion-item";
                item.textContent = topic;
                item.dataset.index = idx;
                item.onclick = () => {
                    addTopic(topic);
                };
                suggestionsCont.appendChild(item);
            });
            suggestionsCont.classList.add("active");
        };

        const addTopic = (topic) => {
            if (!State.selectedTopics.includes(topic)) {
                State.selectedTopics.push(topic);
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
                $$(".preset-card").forEach(c => c.classList.remove("active"));
                card.classList.add("active");
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
            });
        });

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
                $$(".mode-toggle-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
            });
        });
        $$(".diff-btn").forEach(btn => {
            btn.addEventListener("click", () => {
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


                const selectedSpecs = $$(".spec-item.checked").map(i => i.dataset.spec);
                if (selectedSpecs.length === 0 && State.selectedTopics.length === 0) {
                    return showNotification("Selecciona al menos una especialidad o un tema personalizado.");
                }

                if (!qtySlider) {
                    console.error("No se encontró el slider de cantidad.");
                    return;
                }

                const qty = parseInt(qtySlider.value, 10);
                const timerVal = parseInt(timeInput ? timeInput.value : 0, 10);
                const isLibre = libBtn ? libBtn.classList.contains("active") : true;

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

                    pool = pool.filter(q => {
                        const qText = `${q.tema || ""} ${q.subtema || ""} ${q.case || ""} ${q.question || ""} ${q.gpcReference || ""}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        return expandedTopics.some(topic => {
                            const normTopic = topic.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            return qText.includes(normTopic);
                        });
                    });
                }

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
                State.mode = modeVal === "casos" ? "simulacro" : "estudio";

                State.durationSec = isLibre ? 0 : (timerVal || 60) * 60;
                State.currentIndex = 0;
                State.answers = State.questionSet.map(() => ({ selected: null, isCorrect: null, flagged: false }));
                State.currentExamType = isLibre ? "Estudio Libre" : "Examen Cronometrado";
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
                renderRefuerzosView();
                showView("view-refuerzos");
            });
        }

        // Dashboard quick action buttons (inside view-refuerzos now, but keep bindings)
        const bindStartBtn = (id, handler) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener("click", handler);
        };

        const handleInteligente = () => {
            if (State.topFailedTemas && State.topFailedTemas.length > 0) {
                startTemaSession(State.topFailedTemas, 5, "Refuerzo IA por Temas");
            } else {
                showNotification("Aún no tienes puntos de falla registrados. Sigue practicando para que la IA detecte tus áreas de oportunidad.");
            }
        };

        bindStartBtn("btn-refuerzo-ia", handleInteligente);
        bindStartBtn("btn-refuerzo-ia-dash", handleInteligente); // New Dash Button
        bindStartBtn("btn-refuerzo-rapido", () => startQuickSession(['mi', 'ped', 'gyo', 'cir', 'urg', 'sp'], 5, "Refuerzo Rápido General"));
        bindStartBtn("btn-quick-start", () => startQuickSession(['mi', 'ped', 'gyo', 'cir', 'urg', 'sp'], 10, "Sesión Rápida (10)"));
        bindStartBtn("btn-refuerzo-casos", () => startQuickSession(['mi', 'ped', 'gyo', 'cir'], 3, "Casos Rápidos Aleatorios"));
        bindStartBtn("btn-curva-olvido", startSpacedRepetition);
        bindStartBtn("btn-curva-olvido-dash", startSpacedRepetition); // New Dash Button
        bindStartBtn("btn-curva-olvido-ref", startSpacedRepetition);
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
        let pool = QUESTIONS.filter(q => q.tema && temas.includes(q.tema));
        if (pool.length === 0) pool = QUESTIONS;

        let finalQty = qty;
        if (qty > pool.length) {
            finalQty = pool.length;
            showNotification(`Solo tenemos ${pool.length} preguntas disponibles para este tema.`);
        }

        State.questionSet = processAndFlattenPool(pool, finalQty);
        State.mode = "simulacro";
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
        let pool = QUESTIONS.filter(q => specs.includes(q.specialty));
        if (pool.length === 0) pool = QUESTIONS;

        let finalQty = qty;
        if (qty > pool.length) {
            finalQty = pool.length;
        }

        State.questionSet = processAndFlattenPool(pool, finalQty);
        State.mode = "simulacro";
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

                const btnFlag = document.createElement("button");
                btnFlag.className = `btn-flag ${ans.flagged ? 'active' : ''}`;
                btnFlag.innerHTML = "⚑ Marcar";
                btnFlag.addEventListener("click", () => {
                    State.answers[qIndex].flagged = !State.answers[qIndex].flagged;
                    renderExamQuestion();
                });

                const spanNum = document.createElement("span");
                spanNum.className = "q-num";
                spanNum.textContent = qNumStr;

                header.appendChild(spanNum);
                header.appendChild(btnFlag);

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

                    const reportBtnId = `btn-report-${qIndex}`;

                    fb.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h3 style="margin: 0;">${ans.isCorrect ? "¡Respuesta Correcta!" : "Respuesta Incorrecta"}</h3>
                            <button class="btn-ghost" id="${reportBtnId}" style="font-size: 12px; padding: 4px 8px; border-radius: 6px; color: var(--accent-red); border-color: rgba(239, 68, 68, 0.2);">🚩 Reportar Error</button>
                        </div>
                        <p>${q.explanation || ""}</p>
                        <div class="feedback-gpc">${q.gpcReference || ""}</div>
                    `;
                    card.appendChild(fb);

                    setTimeout(() => {
                        const rBtn = document.getElementById(reportBtnId);
                        if (rBtn) rBtn.addEventListener("click", () => {
                            triggerReportModal(qIndex);
                        });
                    }, 0);
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
                bn.textContent = "✔ Terminar";
                bn.classList.add("btn-danger");
                bn.classList.remove("primary");
            } else {
                bn.textContent = "Siguiente →";
                bn.classList.remove("btn-danger");
                bn.classList.add("primary");
            }
        }

        renderExamSidebar();
    };

    const triggerReportModal = (globalQIndex) => {
        const modal = $("report-modal");
        const reasonInput = $("report-reason");
        const preview = $("report-q-preview");
        if (!modal) return;

        State._reportingIndex = globalQIndex;
        const q = State.questionSet[globalQIndex];

        preview.textContent = `Pregunta: ${q.question}`;
        reasonInput.value = "";
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

        if (!modal || !btnSubmit || !btnCancel) return;

        btnCancel.addEventListener("click", () => {
            modal.style.display = "none";
        });

        btnSubmit.addEventListener("click", () => {
            const reason = reasonInput.value.trim();
            if (!reason) return showNotification("Por favor indica el motivo del reporte.", "warning");

            const qIndexToReport = State._reportingIndex !== undefined ? State._reportingIndex : State.currentIndex;
            const q = State.questionSet[qIndexToReport];
            const report = {
                id: Date.now(),
                timestamp: Date.now(),
                questionText: q.question,
                caseText: q.case,
                specialty: q.specialty,
                tema: q.tema,
                reason: reason,
                originalQuestion: q
            };

            State.reportedQuestions.push(report);
            saveGlobalStats();
            modal.style.display = "none";
            showNotification("Gracias por tu reporte. Lo revisaremos pronto para mejorar el banco de preguntas.", "success");
        });
    };

    const renderReportedQuestions = () => {
        const cont = $("reports-list");
        if (!cont) return;

        if (State.reportedQuestions.length === 0) {
            cont.innerHTML = `<div class="list-item empty-history"><p style="color:var(--text-muted); padding: 20px;">No hay preguntas reportadas aún.</p></div>`;
            return;
        }

        cont.innerHTML = "";
        [...State.reportedQuestions].reverse().forEach((r) => {
            const div = document.createElement("div");
            div.className = "list-item";
            div.style.flexDirection = "column";
            div.style.alignItems = "flex-start";
            div.style.gap = "10px";
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; width: 100%; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
                    <span class="badge red-bg" style="font-size: 10px;">${(r.specialty || "Gral").toUpperCase()}</span>
                    <span style="font-size: 11px; color: var(--text-muted);">${new Date(r.timestamp).toLocaleDateString()}</span>
                </div>
                <div style="width: 100%;">
                    <h3 style="font-size: 14px; margin-bottom: 6px; color: var(--text-primary);">Pregunta:</h3>
                    <p style="font-size: 13px; line-height: 1.4; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 6px; margin-bottom: 10px;">${r.questionText}</p>
                    <h3 style="font-size: 14px; margin-bottom: 6px; color: var(--accent-red);">Motivo del Reporte:</h3>
                    <p style="font-size: 13px; line-height: 1.4; color: var(--text-secondary); border-left: 2px solid var(--accent-red); padding-left: 10px;">${r.reason}</p>
                </div>
                <button class="btn-ghost btn-del-report" data-id="${r.id}" style="align-self: flex-end; font-size: 11px; padding: 4px 8px; color: var(--text-muted);">Eliminar Reporte</button>
            `;
            cont.appendChild(div);
        });

        cont.querySelectorAll(".btn-del-report").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id);
                if (confirm("¿Eliminar este reporte?")) {
                    State.reportedQuestions = State.reportedQuestions.filter(r => r.id !== id);
                    saveGlobalStats();
                    renderReportedQuestions();
                }
            });
        });
    };

    let isFinishing = false;
    const renderOfficialTemario = (filter = "") => {
        const cont = $("temario-list");
        if (!cont) return;

        const normalizedFilter = filter.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const filtered = OFFICIAL_TEMARIO.filter(t => {
            const normalizedTopic = t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return normalizedTopic.includes(normalizedFilter);
        });

        cont.innerHTML = filtered.map(tema => `
            <div class="list-item" style="padding: 15px; background: rgba(255,255,255,0.02); border: 1px solid var(--border);">
                <div class="list-item-content">
                    <h3 style="font-size: 14px; margin-bottom: 0;">${tema}</h3>
                </div>
            </div>
        `).join("");
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
            const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
            const elapsed = State.startTime ? Math.floor((Date.now() - State.startTime) / 1000) : 0;

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

    // OPTIM #4: Debounced save for study mode — avoids one Firestore write per answer.
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
                    <div style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;">✨</div>
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

    const updateDashboardStats = () => {
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

    const updateCharts = () => {
        if (typeof Chart === 'undefined') return;

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
                                           <div class="lb-flame" style="font-size:10px;">🔥 ${data.flame || 0}</div>
                                           ${!isMe ? `<button class="btn-primary" onclick="window.quickChallenge('${docSnap.id}')" style="padding: 4px 8px; font-size: 10px; border-radius: 6px; background: var(--accent-orange); border:none; white-space:nowrap;">⚔️ Retar</button>` : ''}
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
                                            <button class="btn-primary" onclick="window.quickChallenge('${docSnap.id}')" style="width:100%; padding: 7px; font-size: 12px; border-radius: 8px; background: var(--accent-orange); text-align:center;">⚔️ Retar</button>
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
                                showNotification("🎯 ¡Amigo pre-seleccionado! Configura tu examen y luego pulsa 'Retar a un Amigo ⚔️'.", "info");
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
                                <button class="btn-primary btn-reject-friend" data-id="${data.id}" style="padding:6px 10px; font-size:11px; background:var(--bg-card); border: 1px solid var(--border); color: var(--text-secondary); border-radius: 6px;">✕</button>
                            </div>
                        </div>`;
                    });

                    // Render challenges - mejor diseño para aceptar
                    pendingChallenges.forEach(data => {
                        html += `
                        <div style="background:rgba(243,122,32,0.08); padding:14px; border-radius:14px; border: 1px solid rgba(243,122,32,0.3); margin-bottom: 8px;">
                            <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                                <span style="font-size:24px;">⚔️</span>
                                <div>
                                    <div style="font-weight:bold; font-size:14px; color: var(--accent-orange);">Reto de ${data.challengerName}</div>
                                    <div style="font-size:11px; color: var(--text-muted);">${data.specialty} &bull; ${data.numQuestions} preguntas</div>
                                </div>
                            </div>
                            <button class="btn-primary btn-play-chal" data-id="${data.id}" style="width:100%; padding:10px; font-size:13px; background:var(--accent-orange); border-radius: 10px; font-weight:bold;">⚔️ ¡Aceptar y Jugar Ahora!</button>
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
                        pool = pool.filter(q => {
                            const qText = `${q.tema || ""} ${q.subtema || ""} ${q.case || ""} ${q.question || ""} ${q.gpcReference || ""}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            return expandedTopics.some(topic => {
                                const normTopic = topic.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                return qText.includes(normTopic);
                            });
                        });
                    }

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
                                    <button class="btn-primary" style="flex:1; border-radius:8px; background:var(--accent-orange); font-size:13px; padding:10px;" onclick="event.stopPropagation(); window.acceptChallenge('${ch.id}')">⚔️ ¡Jugar Reto!</button>
                                    <button class="btn-ghost" style="padding:10px 12px; border-radius:8px; font-size:18px;" onclick="event.stopPropagation(); window.showChallengeRanking('${ch.id}')" title="Ver ranking parcial">📊</button>
                                </div>`;
                        } else {
                            statusBadge = `<span style="font-size:10px; padding:3px 8px; border-radius:20px; background:rgba(59,130,246,0.15); color:var(--accent-blue); border:1px solid rgba(59,130,246,0.3); font-weight:bold;">✅ Ya jugaste</span>`;
                            actionBtn = `
                                <div style="display:flex; gap:8px; margin-top:10px;">
                                    <div style="flex:1; font-size:12px; color:var(--text-muted); padding:10px; background:rgba(255,255,255,0.05); border-radius:8px; text-align:center;">Esperando a los demás...</div>
                                    <button class="btn-ghost" style="padding:10px 12px; border-radius:8px; font-size:18px;" onclick="event.stopPropagation(); window.showChallengeRanking('${ch.id}')" title="Ver ranking parcial">📊</button>
                                </div>`;
                        }
                    } else {
                        statusBadge = `<span style="font-size:10px; padding:3px 8px; border-radius:20px; background:rgba(16,185,129,0.15); color:var(--accent-green); border:1px solid rgba(16,185,129,0.3); font-weight:bold;">🏁 Finalizado</span>`;
                        actionBtn = `
                            <button class="btn-primary" style="width:100%; border-radius:8px; font-size:13px; padding:10px; margin-top:10px; background:rgba(59,130,246,0.15); border:1px solid rgba(59,130,246,0.4); color:#60a5fa;" onclick="event.stopPropagation(); window.showChallengeRanking('${ch.id}')">📊 Ver Ranking Final</button>`;
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
                    activeHtml += `<button class="btn-ghost" style="width:100%; font-size:12px; margin-top:5px; color:var(--accent-orange);" onclick="window.toggleAllChallenges('active')">${showAllActive ? 'Ver menos ↑' : 'Ver todos (' + activeOnes.length + ') ↓'}</button>`;
                }
                if (pastOnes.length > 2) {
                    pastHtml += `<button class="btn-ghost" style="width:100%; font-size:12px; margin-top:5px; color:var(--text-muted);" onclick="window.toggleAllChallenges('past')">${showAllPast ? 'Ver menos ↑' : 'Ver historial (' + pastOnes.length + ') ↓'}</button>`;
                }

                let finalHtml = `
                    <div style="text-align: left; margin-bottom: 15px;">
                        <h3 style="font-size: 14px; color: var(--text-primary); margin-bottom: 10px;">🔥 Retos Activos</h3>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            ${activeHtml || '<p style="font-size: 12px; color: var(--text-muted); padding: 10px; text-align: center;">No hay retos activos.</p>'}
                        </div>
                    </div>
                    <div style="text-align: left; margin-top: 25px;">
                        <h3 style="font-size: 14px; color: var(--text-muted); margin-bottom: 10px;">📅 Retos Pasados</h3>
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

                title.textContent = `📊 Ranking: ${ch.specialty}`;
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

                showNotification("¡Reto iniciado! Buena suerte. ⚔️", "info");
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

        const setupFirebaseAuthAndUI = () => {
            if (authOverlay && loginForm) {
                // If user doesn't exist locally, show overlay
                if (!localStorage.getItem("enarm_user") || localStorage.getItem("enarm_user") === "Isaac") {
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
                                        State.reportedQuestions = JSON.parse(data.reportsStr);
                                        localStorage.setItem("enarm_reports", data.reportsStr);
                                    }

                                    if (needsUpdate) {
                                        updateDashboardStats();
                                        if (typeof updateCharts === 'function') updateCharts();
                                    }
                                } else {
                                    saveGlobalStats();
                                }
                            } catch (e) {
                                console.error("Error fetching cloud data on Auth Change:", e);
                            }
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
                                    State.reportedQuestions = JSON.parse(data.reportsStr);
                                    localStorage.setItem("enarm_reports", data.reportsStr);
                                }
                            } else {
                                // Usuario nuevo: Guardar estado inicial en la nube
                                saveGlobalStats();
                            }

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
                    providerBtn.addEventListener("click", () => {
                        if (window.FB) {
                            window.FB.signInWithPopup(window.FB.auth, window.FB.googleProvider)
                                .then(async (result) => {
                                    const userObj = result.user;
                                    let displayName = userObj.displayName;

                                    if (!displayName) displayName = "Aspirante_" + Math.floor(Math.random() * 9999);
                                    handleSuccessLogin(displayName);

                                }).catch((error) => {
                                    showNotification("Error interno al conectar con Google: " + error.message, "error");
                                    console.error(error);
                                });
                        } else {
                            showNotification("Firebase no terminó de cargar. Reintenta.", "warning");
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
