// app.js – Core logic for ENARMlab
(() => {
    // ---------------------------------------------------------------------------
    // State Management
    // ---------------------------------------------------------------------------
    const State = {
        view: "view-dashboard",
        mode: "simulacro", // "estudio" | "simulacro"
        difficulty: "cualquiera",
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
            console.log(`Cambiando a vista: ${viewId}`);
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
        "Introducción: Ciclo genital, Esterilidad y Anticonceptivos",
        "Turner",
        "Morris",
        "Rokitansky",
        "Amenorreas Primarias y Secundarias",
        "Origen no anatómico: SOP",
        "Endometriosis",
        "Hemorragia Uterina Anormal",
        "Osteoporosis",
        "Piso Pélvico",
        "Menopausia y Climaterio",
        "Origen anatómico: Miomatosis",
        "Pólipos",
        "Hemorragia Uterina Anormal",
        "Oncología Ginecología P1: Cáncer de Endometrio y Ovario",
        "Oncología Ginecología P2: Tamizaje CACU, CaVa, Vagina y Vulva",
        "Patología Mamaria: Benigna y Cáncer de Mama",
        "Vaginitis",
        "Vaginosis",
        "EPI",
        "Infecciones de Transmisión Sexual",
        "Cambios Fisiológicos en el Embarazo y Control Prenatal",
        "Aborto",
        "Ectópico",
        "Mola",
        "Hemorragias del Primer Trimestre",
        "Placenta Previa",
        "Desprendimiento",
        "Hemorragias del Tercer Trimestre",
        "Diabetes Gestacional",
        "Preeclampsia / Eclampsia",
        "Trastornos Hipertensivos del Embarazo",
        "Isoinmunización",
        "Polihidramnios",
        "Complicaciones del Embarazo",
        "Trabajo de Parto y Mecanismos del Parto",
        "Inducción, Conducción y Distocias",
        "Sepsis Puerperal e Infección de Herida Quirúrgica",
        "Choque Obstétrico y Hemorragia Obstétrica",
        "Puerperio Fisiológico y Lactancia Materna",
        "Introducción a la Pediatría / Reanimación Neonatal",
        "Hijo de madre diabética",
        "Electrolitos",
        "Patología Neonatal Metabólica",
        "Sepsis",
        "Conjuntivitis",
        "Onfalitis",
        "Patología Neonatal Infecciosa",
        "Membrana hialina",
        "TTRN",
        "SAM",
        "Patología Respiratoria Neonatal",
        "Malformaciones",
        "Onfalocele",
        "Gastrosquisis",
        "Patología Neonatal Quirúrgica",
        "Infecciones TORCH y VIH Pediátrico",
        "Estenosis Hipertrófica de Píloro",
        "Ictericias Neonatales",
        "Tamiz Metabólico y Auditivo",
        "Crecimiento y Desarrollo P1",
        "Hitos del desarrollo",
        "Crecimiento y Desarrollo P2",
        "Esquema Nacional",
        "Vacunación",
        "Reflujo",
        "Intususcepción",
        "Patología Gastrointestinal",
        "Enfermedad Diarreica Aguda y Planes de Hidratación",
        "Diarrea Crónica y Síndromes de Mala Absorción",
        "Parasitosis en Pediatría",
        "Bronquiolitis",
        "Laringotraqueítis",
        "Patología Respiratoria del Lactante",
        "Neumonías y sus Complicaciones",
        "Asma Pediátrica",
        "Otitis",
        "Faringitis",
        "Infecciones de Vías Respiratorias Superiores",
        "Enfermedades Exantemáticas",
        "Maltrato",
        "Intoxicaciones",
        "Quemaduras",
        "Urgencias Pediátricas",
        "Nefrología y Urología Pediátrica",
        "Cianógenas y Acianógenas",
        "Cardiopatías Congénitas",
        "Leucemias",
        "Linfomas",
        "Purpuras",
        "Onco-Hematología Pediátrica",
        "Neuropediatría",
        "Ortopedia Pediátrica",
        "Especialidades",
        "Genética y Alteraciones Cromosómicas",
        "Apendicitis Aguda",
        "Patología de Vesícula y Vías Biliares",
        "Pancreatitis Aguda",
        "Acalasia",
        "ERGE",
        "Patología Quirúrgica de Esófago",
        "Ulcera péptica",
        "Patología de Estómago y Duodeno",
        "Abdomen Agudo y Oclusión Intestinal",
        "Patología de Intestino Delgado",
        "Divertículos",
        "Patología de Colon y Recto",
        "Fisuras",
        "Hemorroides",
        "Abscesos",
        "Patología Perianal",
        "Isquemia Mesentérica",
        "Hernias de la Pared Abdominal",
        "Hernias Inguinales y Crurales",
        "Urología P1: Litiasis Renal y Tumores",
        "Urología P2: Hiperplasia Prostática y Cáncer de Próstata",
        "Enfoque Quirúrgico/Urológico",
        "Infecciones de Transmisión Sexual",
        "ATLS P1: Evaluación Inicial y Manejo de Vía Aérea",
        "ATLS P2: Trauma de Tórax y Abdomen",
        "Antídotos principales",
        "Toxicología",
        "Alacrán",
        "Araña",
        "Serpiente",
        "Mordeduras y Picaduras",
        "Quemaduras y Reanimación",
        "Generalidades",
        "Oncocirugía P1",
        "Oncocirugía P2",
        "Glaucoma",
        "Catarata",
        "Retinopatías",
        "Oftalmología P1",
        "Ojo rojo",
        "Trauma ocular",
        "Oftalmología P2",
        "Patología de oído",
        "Otorrinolaringología P1",
        "Nariz y Garganta",
        "Otorrinolaringología P2",
        "Síndrome Compartimental",
        "Trauma: Generalidades y Complicaciones",
        "Fracturas",
        "Patología de Extremidad Superior",
        "Cadera",
        "Tobillo",
        "Patología de Extremidad Inferior",
        "Conceptos básicos ENARM",
        "Epidemiología",
        "Extra: Clase de Inglés Médico",
        "Infectología: Principios, Antibióticos y Resistencia",
        "Tuberculosis",
        "VIH / SIDA",
        "Dengue",
        "Zika",
        "Rickettsia",
        "Enfermedades transmitidas por Vector",
        "Rabia",
        "Tétanos",
        "Brucella",
        "Zoonosis",
        "Candidiasis",
        "Histoplasmosis",
        "Patología Fúngica",
        "Neumología: Neumonías Ocupacionales",
        "Derrame Pleural y Empiema",
        "Hiper/Hipo/Cáncer",
        "Endocrinología: Patología Tiroidea",
        "Síndrome Metabólico y Dislipidemias",
        "Diabetes Mellitus: Fisiopatología y Diagnóstico",
        "Insulinas y Orales",
        "Diabetes Mellitus: Tratamiento",
        "Cetoacidosis / Estado Hiperosmolar",
        "Complicaciones Agudas de Diabetes",
        "Patología de Glándula Suprarrenal",
        "Ferropénica",
        "Hematología: Anemias Microcíticas",
        "Hematología: Anemias Macrocíticas y Hemolíticas",
        "Hematología: Leucemias y Linfomas",
        "Gastroenterología: Enfermedad Acidopéptica y H. Pylori",
        "Gastroenterología: Cirrosis y sus complicaciones",
        "Reumatología: Artritis Reumatoide",
        "LES",
        "Reumatología: Lupus Eritematoso Sistémico",
        "Reumatología: Vasculitis y Gota",
        "LRA",
        "Nefrología: Lesión Renal Aguda",
        "ERC",
        "Nefrología: Enfermedad Renal Crónica",
        "Nefrología: Glomerulopatías y Síndromes Nefrótico/Nefrítico",
        "Cardiología: Electrocardiograma básico y Arritmias",
        "Angina e Infarto",
        "Cardiología: Cardiopatía Isquémica",
        "Cardiología: Insuficiencia Cardíaca",
        "Hipertensión Arterial Sistémica",
        "Infecto-Cardio: Endocarditis y Pericarditis",
        "EVC",
        "Neurología: Enfermedad Vascular Cerebral",
        "Parkinson/Alzheimer",
        "Neurología: Enfermedades Neurodegenerativas",
        "Migraña",
        "Tensional",
        "Neurología: Cefaleas",
        "Neurología: Crisis Convulsivas y Epilepsia",
        "Dermatología: Tiñas y Acné",
        "Dermatología: Lepra y Pitiriasis",
        "Onco-Dermatología: Cáncer Basocelular, Espinocelular y Melanoma",
        "Psiquiatría: Depresión y Ansiedad",
        "Psiquiatría: Trastornos de la conducta alimentaria / Esquizofrenia",
        "Geriatría: Síndromes Geriátricos"
    ];

    const TEMARIO_MAPPING = {
        "Introducción: Ciclo genital, Esterilidad y Anticonceptivos": [
            "Introducción: Ciclo genital, Esterilidad y Anticonceptivos"
        ],
        "Turner": [
            "Turner"
        ],
        "Morris": [
            "Morris"
        ],
        "Rokitansky": [
            "Rokitansky"
        ],
        "Amenorreas Primarias y Secundarias": [
            "Amenorreas Primarias y Secundarias",
            "Turner",
            "Morris",
            "Rokitansky"
        ],
        "Origen no anatómico: SOP": [
            "Origen no anatómico: SOP"
        ],
        "Endometriosis": [
            "Endometriosis"
        ],
        "Hemorragia Uterina Anormal": [
            "Hemorragia Uterina Anormal",
            "Origen anatómico: Miomatosis",
            "Pólipos"
        ],
        "Osteoporosis": [
            "Osteoporosis"
        ],
        "Piso Pélvico": [
            "Piso Pélvico"
        ],
        "Menopausia y Climaterio": [
            "Menopausia y Climaterio",
            "Osteoporosis",
            "Piso Pélvico"
        ],
        "Origen anatómico: Miomatosis": [
            "Origen anatómico: Miomatosis"
        ],
        "Pólipos": [
            "Pólipos"
        ],
        "Oncología Ginecología P1: Cáncer de Endometrio y Ovario": [
            "Oncología Ginecología P1: Cáncer de Endometrio y Ovario"
        ],
        "Oncología Ginecología P2: Tamizaje CACU, CaVa, Vagina y Vulva": [
            "Oncología Ginecología P2: Tamizaje CACU, CaVa, Vagina y Vulva"
        ],
        "Patología Mamaria: Benigna y Cáncer de Mama": [
            "Patología Mamaria: Benigna y Cáncer de Mama"
        ],
        "Vaginitis": [
            "Vaginitis"
        ],
        "Vaginosis": [
            "Vaginosis"
        ],
        "EPI": [
            "EPI"
        ],
        "Infecciones de Transmisión Sexual": [
            "Infecciones de Transmisión Sexual",
            "Enfoque Quirúrgico/Urológico"
        ],
        "Cambios Fisiológicos en el Embarazo y Control Prenatal": [
            "Cambios Fisiológicos en el Embarazo y Control Prenatal"
        ],
        "Aborto": [
            "Aborto"
        ],
        "Ectópico": [
            "Ectópico"
        ],
        "Mola": [
            "Mola"
        ],
        "Hemorragias del Primer Trimestre": [
            "Hemorragias del Primer Trimestre",
            "Aborto",
            "Ectópico",
            "Mola"
        ],
        "Placenta Previa": [
            "Placenta Previa"
        ],
        "Desprendimiento": [
            "Desprendimiento"
        ],
        "Hemorragias del Tercer Trimestre": [
            "Hemorragias del Tercer Trimestre",
            "Placenta Previa",
            "Desprendimiento"
        ],
        "Diabetes Gestacional": [
            "Diabetes Gestacional"
        ],
        "Preeclampsia / Eclampsia": [
            "Preeclampsia / Eclampsia"
        ],
        "Trastornos Hipertensivos del Embarazo": [
            "Trastornos Hipertensivos del Embarazo",
            "Preeclampsia / Eclampsia"
        ],
        "Isoinmunización": [
            "Isoinmunización"
        ],
        "Polihidramnios": [
            "Polihidramnios"
        ],
        "Complicaciones del Embarazo": [
            "Complicaciones del Embarazo",
            "Isoinmunización",
            "Polihidramnios"
        ],
        "Trabajo de Parto y Mecanismos del Parto": [
            "Trabajo de Parto y Mecanismos del Parto"
        ],
        "Inducción, Conducción y Distocias": [
            "Inducción, Conducción y Distocias"
        ],
        "Sepsis Puerperal e Infección de Herida Quirúrgica": [
            "Sepsis Puerperal e Infección de Herida Quirúrgica"
        ],
        "Choque Obstétrico y Hemorragia Obstétrica": [
            "Choque Obstétrico y Hemorragia Obstétrica"
        ],
        "Puerperio Fisiológico y Lactancia Materna": [
            "Puerperio Fisiológico y Lactancia Materna"
        ],
        "Introducción a la Pediatría / Reanimación Neonatal": [
            "Introducción a la Pediatría / Reanimación Neonatal"
        ],
        "Hijo de madre diabética": [
            "Hijo de madre diabética"
        ],
        "Electrolitos": [
            "Electrolitos"
        ],
        "Patología Neonatal Metabólica": [
            "Patología Neonatal Metabólica",
            "Hijo de madre diabética",
            "Electrolitos"
        ],
        "Sepsis": [
            "Sepsis"
        ],
        "Conjuntivitis": [
            "Conjuntivitis"
        ],
        "Onfalitis": [
            "Onfalitis"
        ],
        "Patología Neonatal Infecciosa": [
            "Patología Neonatal Infecciosa",
            "Sepsis",
            "Conjuntivitis",
            "Onfalitis"
        ],
        "Membrana hialina": [
            "Membrana hialina"
        ],
        "TTRN": [
            "TTRN"
        ],
        "SAM": [
            "SAM"
        ],
        "Patología Respiratoria Neonatal": [
            "Patología Respiratoria Neonatal",
            "Membrana hialina",
            "TTRN",
            "SAM"
        ],
        "Malformaciones": [
            "Malformaciones"
        ],
        "Onfalocele": [
            "Onfalocele"
        ],
        "Gastrosquisis": [
            "Gastrosquisis"
        ],
        "Patología Neonatal Quirúrgica": [
            "Patología Neonatal Quirúrgica",
            "Malformaciones",
            "Onfalocele",
            "Gastrosquisis"
        ],
        "Infecciones TORCH y VIH Pediátrico": [
            "Infecciones TORCH y VIH Pediátrico"
        ],
        "Estenosis Hipertrófica de Píloro": [
            "Estenosis Hipertrófica de Píloro"
        ],
        "Ictericias Neonatales": [
            "Ictericias Neonatales"
        ],
        "Tamiz Metabólico y Auditivo": [
            "Tamiz Metabólico y Auditivo"
        ],
        "Crecimiento y Desarrollo P1": [
            "Crecimiento y Desarrollo P1"
        ],
        "Hitos del desarrollo": [
            "Hitos del desarrollo"
        ],
        "Crecimiento y Desarrollo P2": [
            "Crecimiento y Desarrollo P2",
            "Hitos del desarrollo"
        ],
        "Esquema Nacional": [
            "Esquema Nacional"
        ],
        "Vacunación": [
            "Vacunación",
            "Esquema Nacional"
        ],
        "Reflujo": [
            "Reflujo"
        ],
        "Intususcepción": [
            "Intususcepción"
        ],
        "Patología Gastrointestinal": [
            "Patología Gastrointestinal",
            "Reflujo",
            "Intususcepción"
        ],
        "Enfermedad Diarreica Aguda y Planes de Hidratación": [
            "Enfermedad Diarreica Aguda y Planes de Hidratación"
        ],
        "Diarrea Crónica y Síndromes de Mala Absorción": [
            "Diarrea Crónica y Síndromes de Mala Absorción"
        ],
        "Parasitosis en Pediatría": [
            "Parasitosis en Pediatría"
        ],
        "Bronquiolitis": [
            "Bronquiolitis"
        ],
        "Laringotraqueítis": [
            "Laringotraqueítis"
        ],
        "Patología Respiratoria del Lactante": [
            "Patología Respiratoria del Lactante",
            "Bronquiolitis",
            "Laringotraqueítis"
        ],
        "Neumonías y sus Complicaciones": [
            "Neumonías y sus Complicaciones"
        ],
        "Asma Pediátrica": [
            "Asma Pediátrica"
        ],
        "Otitis": [
            "Otitis"
        ],
        "Faringitis": [
            "Faringitis"
        ],
        "Infecciones de Vías Respiratorias Superiores": [
            "Infecciones de Vías Respiratorias Superiores",
            "Otitis",
            "Faringitis"
        ],
        "Enfermedades Exantemáticas": [
            "Enfermedades Exantemáticas"
        ],
        "Maltrato": [
            "Maltrato"
        ],
        "Intoxicaciones": [
            "Intoxicaciones"
        ],
        "Quemaduras": [
            "Quemaduras"
        ],
        "Urgencias Pediátricas": [
            "Urgencias Pediátricas",
            "Maltrato",
            "Intoxicaciones",
            "Quemaduras"
        ],
        "Nefrología y Urología Pediátrica": [
            "Nefrología y Urología Pediátrica"
        ],
        "Cianógenas y Acianógenas": [
            "Cianógenas y Acianógenas"
        ],
        "Cardiopatías Congénitas": [
            "Cardiopatías Congénitas",
            "Cianógenas y Acianógenas"
        ],
        "Leucemias": [
            "Leucemias"
        ],
        "Linfomas": [
            "Linfomas"
        ],
        "Purpuras": [
            "Purpuras"
        ],
        "Onco-Hematología Pediátrica": [
            "Onco-Hematología Pediátrica",
            "Leucemias",
            "Linfomas",
            "Purpuras"
        ],
        "Neuropediatría": [
            "Neuropediatría"
        ],
        "Ortopedia Pediátrica": [
            "Ortopedia Pediátrica"
        ],
        "Especialidades": [
            "Especialidades",
            "Neuropediatría",
            "Ortopedia Pediátrica"
        ],
        "Genética y Alteraciones Cromosómicas": [
            "Genética y Alteraciones Cromosómicas"
        ],
        "Apendicitis Aguda": [
            "Apendicitis Aguda"
        ],
        "Patología de Vesícula y Vías Biliares": [
            "Patología de Vesícula y Vías Biliares"
        ],
        "Pancreatitis Aguda": [
            "Pancreatitis Aguda"
        ],
        "Acalasia": [
            "Acalasia"
        ],
        "ERGE": [
            "ERGE"
        ],
        "Patología Quirúrgica de Esófago": [
            "Patología Quirúrgica de Esófago",
            "Acalasia",
            "ERGE"
        ],
        "Ulcera péptica": [
            "Ulcera péptica"
        ],
        "Patología de Estómago y Duodeno": [
            "Patología de Estómago y Duodeno",
            "Ulcera péptica"
        ],
        "Abdomen Agudo y Oclusión Intestinal": [
            "Abdomen Agudo y Oclusión Intestinal"
        ],
        "Patología de Intestino Delgado": [
            "Patología de Intestino Delgado"
        ],
        "Divertículos": [
            "Divertículos"
        ],
        "Patología de Colon y Recto": [
            "Patología de Colon y Recto",
            "Divertículos"
        ],
        "Fisuras": [
            "Fisuras"
        ],
        "Hemorroides": [
            "Hemorroides"
        ],
        "Abscesos": [
            "Abscesos"
        ],
        "Patología Perianal": [
            "Patología Perianal",
            "Fisuras",
            "Hemorroides",
            "Abscesos"
        ],
        "Isquemia Mesentérica": [
            "Isquemia Mesentérica"
        ],
        "Hernias de la Pared Abdominal": [
            "Hernias de la Pared Abdominal"
        ],
        "Hernias Inguinales y Crurales": [
            "Hernias Inguinales y Crurales"
        ],
        "Urología P1: Litiasis Renal y Tumores": [
            "Urología P1: Litiasis Renal y Tumores"
        ],
        "Urología P2: Hiperplasia Prostática y Cáncer de Próstata": [
            "Urología P2: Hiperplasia Prostática y Cáncer de Próstata"
        ],
        "Enfoque Quirúrgico/Urológico": [
            "Enfoque Quirúrgico/Urológico"
        ],
        "ATLS P1: Evaluación Inicial y Manejo de Vía Aérea": [
            "ATLS P1: Evaluación Inicial y Manejo de Vía Aérea"
        ],
        "ATLS P2: Trauma de Tórax y Abdomen": [
            "ATLS P2: Trauma de Tórax y Abdomen"
        ],
        "Antídotos principales": [
            "Antídotos principales"
        ],
        "Toxicología": [
            "Toxicología",
            "Antídotos principales"
        ],
        "Alacrán": [
            "Alacrán"
        ],
        "Araña": [
            "Araña"
        ],
        "Serpiente": [
            "Serpiente"
        ],
        "Mordeduras y Picaduras": [
            "Mordeduras y Picaduras",
            "Alacrán",
            "Araña",
            "Serpiente"
        ],
        "Quemaduras y Reanimación": [
            "Quemaduras y Reanimación"
        ],
        "Generalidades": [
            "Generalidades"
        ],
        "Oncocirugía P1": [
            "Oncocirugía P1",
            "Generalidades"
        ],
        "Oncocirugía P2": [
            "Oncocirugía P2"
        ],
        "Glaucoma": [
            "Glaucoma"
        ],
        "Catarata": [
            "Catarata"
        ],
        "Retinopatías": [
            "Retinopatías"
        ],
        "Oftalmología P1": [
            "Oftalmología P1",
            "Glaucoma",
            "Catarata",
            "Retinopatías"
        ],
        "Ojo rojo": [
            "Ojo rojo"
        ],
        "Trauma ocular": [
            "Trauma ocular"
        ],
        "Oftalmología P2": [
            "Oftalmología P2",
            "Ojo rojo",
            "Trauma ocular"
        ],
        "Patología de oído": [
            "Patología de oído"
        ],
        "Otorrinolaringología P1": [
            "Otorrinolaringología P1",
            "Patología de oído"
        ],
        "Nariz y Garganta": [
            "Nariz y Garganta"
        ],
        "Otorrinolaringología P2": [
            "Otorrinolaringología P2",
            "Nariz y Garganta"
        ],
        "Síndrome Compartimental": [
            "Síndrome Compartimental"
        ],
        "Trauma: Generalidades y Complicaciones": [
            "Trauma: Generalidades y Complicaciones",
            "Síndrome Compartimental"
        ],
        "Fracturas": [
            "Fracturas"
        ],
        "Patología de Extremidad Superior": [
            "Patología de Extremidad Superior",
            "Fracturas"
        ],
        "Cadera": [
            "Cadera"
        ],
        "Tobillo": [
            "Tobillo"
        ],
        "Patología de Extremidad Inferior": [
            "Patología de Extremidad Inferior",
            "Cadera",
            "Tobillo"
        ],
        "Conceptos básicos ENARM": [
            "Conceptos básicos ENARM"
        ],
        "Epidemiología": [
            "Epidemiología",
            "Conceptos básicos ENARM"
        ],
        "Extra: Clase de Inglés Médico": [
            "Extra: Clase de Inglés Médico"
        ],
        "Infectología: Principios, Antibióticos y Resistencia": [
            "Infectología: Principios, Antibióticos y Resistencia"
        ],
        "Tuberculosis": [
            "Tuberculosis"
        ],
        "VIH / SIDA": [
            "VIH / SIDA"
        ],
        "Dengue": [
            "Dengue"
        ],
        "Zika": [
            "Zika"
        ],
        "Rickettsia": [
            "Rickettsia"
        ],
        "Enfermedades transmitidas por Vector": [
            "Enfermedades transmitidas por Vector",
            "Dengue",
            "Zika",
            "Rickettsia"
        ],
        "Rabia": [
            "Rabia"
        ],
        "Tétanos": [
            "Tétanos"
        ],
        "Brucella": [
            "Brucella"
        ],
        "Zoonosis": [
            "Zoonosis",
            "Rabia",
            "Tétanos",
            "Brucella"
        ],
        "Candidiasis": [
            "Candidiasis"
        ],
        "Histoplasmosis": [
            "Histoplasmosis"
        ],
        "Patología Fúngica": [
            "Patología Fúngica",
            "Candidiasis",
            "Histoplasmosis"
        ],
        "Neumología: Neumonías Ocupacionales": [
            "Neumología: Neumonías Ocupacionales"
        ],
        "Derrame Pleural y Empiema": [
            "Derrame Pleural y Empiema"
        ],
        "Hiper/Hipo/Cáncer": [
            "Hiper/Hipo/Cáncer"
        ],
        "Endocrinología: Patología Tiroidea": [
            "Endocrinología: Patología Tiroidea",
            "Hiper/Hipo/Cáncer"
        ],
        "Síndrome Metabólico y Dislipidemias": [
            "Síndrome Metabólico y Dislipidemias"
        ],
        "Diabetes Mellitus: Fisiopatología y Diagnóstico": [
            "Diabetes Mellitus: Fisiopatología y Diagnóstico"
        ],
        "Insulinas y Orales": [
            "Insulinas y Orales"
        ],
        "Diabetes Mellitus: Tratamiento": [
            "Diabetes Mellitus: Tratamiento",
            "Insulinas y Orales"
        ],
        "Cetoacidosis / Estado Hiperosmolar": [
            "Cetoacidosis / Estado Hiperosmolar"
        ],
        "Complicaciones Agudas de Diabetes": [
            "Complicaciones Agudas de Diabetes",
            "Cetoacidosis / Estado Hiperosmolar"
        ],
        "Patología de Glándula Suprarrenal": [
            "Patología de Glándula Suprarrenal"
        ],
        "Ferropénica": [
            "Ferropénica"
        ],
        "Hematología: Anemias Microcíticas": [
            "Hematología: Anemias Microcíticas",
            "Ferropénica"
        ],
        "Hematología: Anemias Macrocíticas y Hemolíticas": [
            "Hematología: Anemias Macrocíticas y Hemolíticas"
        ],
        "Hematología: Leucemias y Linfomas": [
            "Hematología: Leucemias y Linfomas"
        ],
        "Gastroenterología: Enfermedad Acidopéptica y H. Pylori": [
            "Gastroenterología: Enfermedad Acidopéptica y H. Pylori"
        ],
        "Gastroenterología: Cirrosis y sus complicaciones": [
            "Gastroenterología: Cirrosis y sus complicaciones"
        ],
        "Reumatología: Artritis Reumatoide": [
            "Reumatología: Artritis Reumatoide"
        ],
        "LES": [
            "LES"
        ],
        "Reumatología: Lupus Eritematoso Sistémico": [
            "Reumatología: Lupus Eritematoso Sistémico",
            "LES"
        ],
        "Reumatología: Vasculitis y Gota": [
            "Reumatología: Vasculitis y Gota"
        ],
        "LRA": [
            "LRA"
        ],
        "Nefrología: Lesión Renal Aguda": [
            "Nefrología: Lesión Renal Aguda",
            "LRA"
        ],
        "ERC": [
            "ERC"
        ],
        "Nefrología: Enfermedad Renal Crónica": [
            "Nefrología: Enfermedad Renal Crónica",
            "ERC"
        ],
        "Nefrología: Glomerulopatías y Síndromes Nefrótico/Nefrítico": [
            "Nefrología: Glomerulopatías y Síndromes Nefrótico/Nefrítico"
        ],
        "Cardiología: Electrocardiograma básico y Arritmias": [
            "Cardiología: Electrocardiograma básico y Arritmias"
        ],
        "Angina e Infarto": [
            "Angina e Infarto"
        ],
        "Cardiología: Cardiopatía Isquémica": [
            "Cardiología: Cardiopatía Isquémica",
            "Angina e Infarto"
        ],
        "Cardiología: Insuficiencia Cardíaca": [
            "Cardiología: Insuficiencia Cardíaca"
        ],
        "Hipertensión Arterial Sistémica": [
            "Hipertensión Arterial Sistémica"
        ],
        "Infecto-Cardio: Endocarditis y Pericarditis": [
            "Infecto-Cardio: Endocarditis y Pericarditis"
        ],
        "EVC": [
            "EVC"
        ],
        "Neurología: Enfermedad Vascular Cerebral": [
            "Neurología: Enfermedad Vascular Cerebral",
            "EVC"
        ],
        "Parkinson/Alzheimer": [
            "Parkinson/Alzheimer"
        ],
        "Neurología: Enfermedades Neurodegenerativas": [
            "Neurología: Enfermedades Neurodegenerativas",
            "Parkinson/Alzheimer"
        ],
        "Migraña": [
            "Migraña"
        ],
        "Tensional": [
            "Tensional"
        ],
        "Neurología: Cefaleas": [
            "Neurología: Cefaleas",
            "Migraña",
            "Tensional"
        ],
        "Neurología: Crisis Convulsivas y Epilepsia": [
            "Neurología: Crisis Convulsivas y Epilepsia"
        ],
        "Dermatología: Tiñas y Acné": [
            "Dermatología: Tiñas y Acné"
        ],
        "Dermatología: Lepra y Pitiriasis": [
            "Dermatología: Lepra y Pitiriasis"
        ],
        "Onco-Dermatología: Cáncer Basocelular, Espinocelular y Melanoma": [
            "Onco-Dermatología: Cáncer Basocelular, Espinocelular y Melanoma"
        ],
        "Psiquiatría: Depresión y Ansiedad": [
            "Psiquiatría: Depresión y Ansiedad"
        ],
        "Psiquiatría: Trastornos de la conducta alimentaria / Esquizofrenia": [
            "Psiquiatría: Trastornos de la conducta alimentaria / Esquizofrenia"
        ],
        "Geriatría: Síndromes Geriátricos": [
            "Geriatría: Síndromes Geriátricos"
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
            });
        });

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
                console.log("Iniciando simulacro...");

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

                console.log(`Pool size: ${pool.length}, Qty requested: ${qty}, Final Qty: ${finalQty}`);
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

                console.log("Configuración de State completa. Renderizando...");
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
        console.log("Iniciando finalización del examen...");

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

            console.log(`Examen Terminado: ${correct} correctas, ${wrong} incorrectas, ${blank} en blanco. Pct: ${pct}%`);

            const sp = $("score-pct"); if (sp) sp.textContent = `${pct}%`;
            const mc = $("meta-correct"); if (mc) mc.textContent = correct;
            const mw = $("meta-wrong"); if (mw) mw.textContent = wrong;
            const mb = $("meta-blank"); if (mb) mb.textContent = blank;
            const mt = $("meta-time"); if (mt) mt.textContent = formatTime(elapsed);

            State.globalStats.sesiones++;
            State.history.push({
                timestamp: Date.now(),
                tipo: State.currentExamType,
                preguntas: total,
                pct: pct,
                elapsedSec: elapsed,
                questionSet: [...State.questionSet],
                answers: State.answers.map(a => ({ ...a }))
            });

            // Update Cloud Challenge if active
            if (State.activeChallengeId && window.FB && window.FB.auth.currentUser) {
                const chalRef = window.FB.doc(window.FB.db, "challenges", State.activeChallengeId);
                const isChallenger = State.activeChallengeRole === "challenger";
                const updates = {};
                if (isChallenger) updates.challengerScore = pct;
                else updates.challengedScore = pct;

                // Fire async without blocking UI
                window.FB.getDoc(chalRef).then(snap => {
                    if (snap.exists()) {
                        const data = snap.data();
                        const otherScore = isChallenger ? data.challengedScore : data.challengerScore;
                        if (otherScore !== undefined) {
                            updates.status = "completed"; // Both played
                        } else {
                            updates.status = isChallenger ? "pending_for_b" : "pending_for_a";
                        }
                        window.FB.updateDoc(chalRef, updates);
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
        if (State.mode === "estudio") saveGlobalStats();
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
        // Using an 8% simulation for skipped/omitted if there's data, else 0
        const omitidas = respondidas > 0 ? Math.floor(respondidas * 0.08) : 0;
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
            const currentGroupId = State.questionSet[reviewIndex].caseGroupId;
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
                        const fullQ = window.FB.query(lbRef, window.FB.orderBy("score", "desc"));

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
                                        <div class="lb-rank">${rankStr}</div>
                                        <div class="lb-avatar">${lbInitials}</div>
                                        <div class="lb-info">
                                            <div class="lb-name">${data.username} ${isMe ? '<span class="lb-badge">Tú</span>' : ''}</div>
                                            ${badgeSpec ? `<div style="margin-top: 4px; margin-bottom: 2px;">${badgeSpec}</div>` : ''}
                                            <div class="lb-score" style="margin-top:2px;">Promedio: <span style="color:var(--accent-green); font-weight:700">${data.score}%</span></div>
                                        </div>
                                        <div class="lb-flame">🔥 ${data.flame || 0}</div>
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
                                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border: 1px solid var(--border);">
                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--accent-blue); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px;">
                                                    ${data.username.substring(0, 2).toUpperCase()}</div>
                                                <div>
                                                    <div style="font-size: 13px; font-weight: 600;">${data.username}</div>
                                                    <div style="font-size: 11px; color: var(--accent-green);">En línea</div>
                                                </div>
                                            </div>
                                        </div>`;
                                    }
                                    rank++;
                                }
                            });

                            const lbList = document.querySelector(".leaderboard-list");
                            if (lbList) lbList.innerHTML = lbHTML || '<div style="padding: 20px;">Sin datos</h4>';

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
                                        <button class="btn-primary" id="btn-send-req" data-id="${foundId}" data-name="${foundUser.username}" style="padding: 8px 12px; font-size: 13px;">Añadir</button>
                                    </div>
                                `;

                                $("btn-send-req").addEventListener("click", async (e) => {
                                    const targetId = e.target.getAttribute("data-id");
                                    const targetName = e.target.getAttribute("data-name");
                                    e.target.textContent = "Enviando...";

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
                                        searchResults.innerHTML = '<span style="color:var(--accent-red)">Error al enviar: ' + err.message + '</span>';
                                    }
                                });
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
            }

            // Escuchar Solicitudes Recibidas (en tiempo real)
            window.loadPendingRequests = () => {
                const reqsRef = window.FB.collection(window.FB.db, "friendRequests");
                const qReqs = window.FB.query(reqsRef, window.FB.where("toId", "==", window.FB.auth.currentUser.uid), window.FB.where("status", "==", "pending"));

                window.FB.onSnapshot(qReqs, (snap) => {
                    const profileListEl = $("pending-requests-list");
                    const modalListEl = $("notif-list-container");
                    const badgeMain = $("notif-badge-main");

                    if (snap.empty) {
                        const emptyMsg = '<div style="text-align: center; color: var(--text-muted); font-size: 13px; padding: 20px;">No tienes notificaciones nuevas.</div>';
                        if (profileListEl) profileListEl.innerHTML = emptyMsg;
                        if (modalListEl) modalListEl.innerHTML = emptyMsg;
                        if (badgeMain) badgeMain.style.display = "none";
                        return;
                    }

                    // Hay solicitudes pendientes -> Mostrar badge
                    if (badgeMain) badgeMain.style.display = "block";

                    let html = "";
                    snap.forEach(doc => {
                        const data = doc.data();
                        html += `
                        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:12px; border-radius:12px; border: 1px solid var(--border);">
                            <div style="display: flex; flex-direction: column;">
                                <span style="font-weight:bold; font-size:14px; color: var(--text-primary);">${data.fromName}</span>
                                <span style="font-size:11px; color: var(--text-muted);">Te envió una solicitud</span>
                            </div>
                            <div style="display:flex; gap:8px;">
                                <button class="btn-primary btn-accept" data-id="${doc.id}" style="padding:6px 10px; font-size:11px; background:var(--accent-green); border-radius: 6px;">Aceptar</button>
                                <button class="btn-primary btn-reject" data-id="${doc.id}" style="padding:6px 10px; font-size:11px; background:var(--bg-card); border: 1px solid var(--border); color: var(--text-secondary); border-radius: 6px;">✕</button>
                            </div>
                        </div>`;
                    });

                    if (profileListEl) profileListEl.innerHTML = html;
                    if (modalListEl) modalListEl.innerHTML = html;

                    const attachEvents = (container) => {
                        if (!container) return;
                        container.querySelectorAll(".btn-accept").forEach(btn => {
                            btn.addEventListener("click", async (e) => {
                                const reqId = e.currentTarget.getAttribute("data-id");
                                e.currentTarget.textContent = "...";
                                await window.FB.updateDoc(window.FB.doc(window.FB.db, "friendRequests", reqId), { status: "accepted" });
                                showNotification("¡Solicitud aceptada!", "success");
                                if (typeof fetchFriendsAndLeaderboard === 'function') fetchFriendsAndLeaderboard();
                            });
                        });
                        container.querySelectorAll(".btn-reject").forEach(btn => {
                            btn.addEventListener("click", async (e) => {
                                const reqId = e.currentTarget.getAttribute("data-id");
                                await window.FB.updateDoc(window.FB.doc(window.FB.db, "friendRequests", reqId), { status: "rejected" });
                                if (typeof fetchFriendsAndLeaderboard === 'function') fetchFriendsAndLeaderboard();
                            });
                        });
                    };

                    attachEvents(profileListEl);
                    attachEvents(modalListEl);
                });
            };

            // Eliminado saveGlobalStats() aquí para evitar sobreescribir datos en la nube al iniciar sesión.
        };

        const setupChallengeLogic = () => {
            const btnCreate = $("btn-create-challenge");
            const modal = $("challenge-modal");
            const btnClose = $("btn-close-challenge-modal");
            const btnSend = $("btn-send-challenge");
            const selectFriend = $("challenge-friend-select");
            const selectSpecialty = $("challenge-specialty-select");
            const selectLength = $("challenge-length-select");
            const listContainer = $("challenges-list-container");

            if (btnCreate) {
                btnCreate.addEventListener("click", () => {
                    // Populate select
                    selectFriend.innerHTML = '<option value="">Selecciona un amigo...</option>';
                    State.myFriends.forEach(f => {
                        selectFriend.innerHTML += `<option value="${f.uid}">${f.username} (Prom: ${f.score}%)</option>`;
                    });
                    if (State.myFriends.length === 0) {
                        selectFriend.innerHTML = '<option value="">Agrega amigos primero para desafiar</option>';
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
                    const friendId = selectFriend.value;
                    if (!friendId) return showNotification("Debes seleccionar un amigo válido.", "warning");

                    const specialty = selectSpecialty.value;
                    const length = parseInt(selectLength.value);

                    btnSend.textContent = "...";
                    try {
                        await window.FB.addDoc(window.FB.collection(window.FB.db, "challenges"), {
                            challengerId: window.FB.auth.currentUser.uid,
                            challengerName: State.userName,
                            challengedId: friendId,
                            challengedName: selectFriend.options[selectFriend.selectedIndex].text.split(" (")[0],
                            specialty: specialty,
                            numQuestions: length,
                            status: "pending_for_b",
                            createdAt: window.FB.serverTimestamp()
                        });
                        showNotification("Reto enviado con éxito.", "success");
                        modal.style.display = "none";
                    } catch (err) {
                        showNotification("Error enviando reto: " + err.message, "error");
                    }
                    btnSend.textContent = "¡Desafiar Ahora!";
                });
            }

            // Real-time listener for my challenges
            const chalRef = window.FB.collection(window.FB.db, "challenges");
            // Since we can't easily OR query in older firebase without complex setup, listen to both sides:
            const q1 = window.FB.query(chalRef, window.FB.where("challengerId", "==", window.FB.auth.currentUser.uid));
            const q2 = window.FB.query(chalRef, window.FB.where("challengedId", "==", window.FB.auth.currentUser.uid));

            const allChallenges = new Map();

            const renderChallenges = () => {
                if (!listContainer) return;

                let html = "";
                Array.from(allChallenges.values()).sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)).forEach(ch => {
                    let actionBtn = "";
                    let isMeChallenger = ch.challengerId === window.FB.auth.currentUser.uid;
                    let opponentName = isMeChallenger ? ch.challengedName : ch.challengerName;

                    if (ch.status === "pending_for_b") {
                        if (isMeChallenger) {
                            actionBtn = `<div style="font-size: 12px; color: var(--text-muted); padding: 8px;">Esperando a ${opponentName}...</div>`;
                        } else {
                            actionBtn = `<button class="btn-primary" style="width: 100%; border-radius: 8px;" onclick="acceptChallenge('${ch.id}', '${ch.specialty}', ${ch.numQuestions})">⚔️ ¡Aceptar y Jugar!</button>`;
                        }
                    } else if (ch.status === "pending_for_a") {
                        if (!isMeChallenger) {
                            actionBtn = `<div style="font-size: 12px; color: var(--text-muted); padding: 8px;">Esperando que ${opponentName} juegue...</div>`;
                        } else {
                            actionBtn = `<button class="btn-primary" style="width: 100%; border-radius: 8px; background: var(--accent-orange);" onclick="playChallenge('${ch.id}', '${ch.specialty}', ${ch.numQuestions})">⚔️ ¡Tu Turno de Jugar!</button>`;
                        }
                    } else if (ch.status === "completed") {
                        let myScore = isMeChallenger ? ch.challengerScore : ch.challengedScore;
                        let theirScore = isMeChallenger ? ch.challengedScore : ch.challengerScore;

                        let resultText = "Empate";
                        let resultColor = "var(--text-muted)";
                        if (myScore > theirScore) {
                            resultText = "🔥 ¡Ganaste!";
                            resultColor = "var(--accent-green)";
                        } else if (myScore < theirScore) {
                            resultText = "💀 Perdiste";
                            resultColor = "var(--accent-red)";
                        }

                        actionBtn = `<div style="font-size: 14px; color: ${resultColor}; font-weight: bold; padding: 8px;">${resultText} (${myScore.toFixed(1)}% vs ${theirScore.toFixed(1)}%)</div>`;
                    }

                    html += `
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; text-align: left; position: relative;">
                        <div style="font-size: 12px; color: var(--accent-orange); font-weight: bold; margin-bottom: 4px;">RETO: ${ch.specialty} (${ch.numQuestions} P.)</div>
                        <div style="font-size: 14px; margin-bottom: 12px;">Vs. <strong>${opponentName}</strong></div>
                        ${actionBtn}
                    </div>
                    `;
                });

                if (html === "") {
                    html = `
                    <div id="no-challenges-msg">
                        <div style="font-size: 40px; margin-bottom: 10px; opacity: 0.5;">😴</div>
                        <div style="color: var(--text-muted); font-size: 14px;">No tienes retos activos</div>
                    </div>`;
                }

                listContainer.innerHTML = html;
            };

            window.FB.onSnapshot(q1, snap => {
                snap.docChanges().forEach(change => {
                    if (change.type === "removed") allChallenges.delete(change.doc.id);
                    else allChallenges.set(change.doc.id, { id: change.doc.id, ...change.doc.data() });
                });
                renderChallenges();
            });

            window.FB.onSnapshot(q2, snap => {
                snap.docChanges().forEach(change => {
                    if (change.type === "removed") allChallenges.delete(change.doc.id);
                    else allChallenges.set(change.doc.id, { id: change.doc.id, ...change.doc.data() });
                });
                renderChallenges();
            });

            window.acceptChallenge = (id, specialty, length) => {
                State.activeChallengeId = id;
                State.activeChallengeRole = "challenged";
                State.userSpecialty = specialty === "Aleatorio" ? "cualquiera" : specialty;
                State.difficulty = "cualquiera";

                // Empezar exam similar a simulacro
                $("topic-select").value = State.userSpecialty;
                $("num-questions").value = length;
                $("btn-start-exam").click();
                showNotification("Reto iniciado. ¡Mucha suerte!");
            };

            window.playChallenge = (id, specialty, length) => {
                State.activeChallengeId = id;
                State.activeChallengeRole = "challenger";
                State.userSpecialty = specialty === "Aleatorio" ? "cualquiera" : specialty;
                State.difficulty = "cualquiera";

                $("topic-select").value = State.userSpecialty;
                $("num-questions").value = length;
                $("btn-start-exam").click();
                showNotification("Tu turno. ¡Supera su puntaje!");
            };
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
