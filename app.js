// app.js – Core logic for ENARMlab
(() => {
    // ---------------------------------------------------------------------------
    // State Management
    // ---------------------------------------------------------------------------
    const State = {
        view: "view-dashboard",
        mode: "simulacro", // "estudio" | "simulacro"
        difficulty: "alta",
        questionSet: [],
        currentIndex: 0,
        answers: [],
        timer: null,
        durationSec: 4 * 60 * 60,
        startTime: null,
        currentExamType: "Simulacro",

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
        history: []
    };

    const $ = (id) => document.getElementById(id);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));

    const formatTime = (secs) => {
        const h = String(Math.floor(secs / 3600)).padStart(2, "0");
        const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
        const s = String(secs % 60).padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    const shuffleArray = (arr) => arr.slice().sort(() => Math.random() - 0.5);

    const showView = (viewId) => {
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
    };
    window.showView = showView; // Hacerla global para onclick de HTML

    const saveGlobalStats = () => {
        localStorage.setItem("enarm_stats", JSON.stringify(State.globalStats));
        localStorage.setItem("enarm_history", JSON.stringify(State.history));
        localStorage.setItem("enarm_user", State.userName);
    };

    const loadGlobalStats = () => {
        const s = localStorage.getItem("enarm_stats");
        if (s) State.globalStats = JSON.parse(s);
        const h = localStorage.getItem("enarm_history");
        if (h) State.history = JSON.parse(h);
        const u = localStorage.getItem("enarm_user");
        if (u) State.userName = u;
        const theme = localStorage.getItem("enarm_theme");
        if (theme) {
            State.theme = theme;
            if ($("setting-theme")) $("setting-theme").value = theme;
            applyTheme(theme);
        }

        $$(".user-name").forEach(el => el.textContent = State.userName);
        $$(".header-title").forEach(el => el.textContent = `Hola, ${State.userName}`);
    };

    const applyTheme = (theme) => {
        // Remove all current theme classes
        document.body.classList.remove("light-mode", "theme-forest", "theme-ocean", "theme-sunset");

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
        }
        // "dark" is the default, no class needed
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
            { id: "nav-mas", view: "view-mas" },
            { id: "nav-estadisticas", view: "view-estadisticas" },
            { id: "nav-historial", view: "view-historial" },
            { id: "nav-ajustes", view: "view-ajustes" },
        ];
        navs.forEach(nav => {
            const el = $(nav.id);
            if (el) {
                el.addEventListener("click", () => {
                    $$(".nav-item").forEach(n => n.classList.remove("active"));
                    el.classList.add("active");
                    showView(nav.view);
                });
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
                if (selectedSpecs.length === 0) return alert("Selecciona al menos una especialidad.");

                if (!qtySlider) {
                    console.error("No se encontró el slider de cantidad.");
                    return;
                }

                const qty = parseInt(qtySlider.value, 10);
                const timerVal = parseInt(timeInput ? timeInput.value : 0, 10);
                const isLibre = libBtn ? libBtn.classList.contains("active") : true;

                const topicVal = ($("setup-topic-filter")?.value || "").toLowerCase().trim();

                if (typeof QUESTIONS === 'undefined') {
                    alert("Error: El banco de preguntas no se ha cargado correctamente.");
                    return;
                }

                let pool = QUESTIONS.filter(q => selectedSpecs.includes(q.specialty));

                if (topicVal) {
                    pool = pool.filter(q =>
                        (q.tema && q.tema.toLowerCase().includes(topicVal)) ||
                        (q.case && q.case.toLowerCase().includes(topicVal)) ||
                        (q.question && q.question.toLowerCase().includes(topicVal)) ||
                        (q.explanation && q.explanation.toLowerCase().includes(topicVal)) ||
                        (q.gpcReference && q.gpcReference.toLowerCase().includes(topicVal))
                    );
                }

                if (pool.length === 0) return alert("No hay preguntas que coincidan con tus criterios de búsqueda o especialidad.");

                console.log(`Pool size: ${pool.length}, Qty requested: ${qty}`);
                State.questionSet = shuffleArray(pool).slice(0, Math.min(qty, pool.length));

                const selectedModeBtn = document.querySelector(".mode-toggle-btn.active");
                const modeVal = selectedModeBtn ? selectedModeBtn.dataset.examMode : "casos";
                State.mode = modeVal === "casos" ? "simulacro" : "estudio";

                State.durationSec = isLibre ? 0 : (timerVal || 60) * 60;
                State.currentIndex = 0;
                State.answers = State.questionSet.map(() => ({ selected: null, isCorrect: null, flagged: false }));
                State.currentExamType = isLibre ? "Estudio Libre" : "Examen Cronometrado";
                State.startTime = Date.now();
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
        const btnInt = $("btn-refuerzo-ia");
        if (btnInt) {
            btnInt.addEventListener("click", () => {
                if (State.topFailedTemas && State.topFailedTemas.length > 0) {
                    startTemaSession(State.topFailedTemas, 5, "Refuerzo IA por Temas");
                } else {
                    alert("Aún no tienes puntos de falla registrados. Sigue practicando para que la IA detecte tus áreas de oportunidad.");
                }
            });
        }
        const btnRapido = $("btn-refuerzo-rapido");
        if (btnRapido) btnRapido.addEventListener("click", () => startQuickSession(['mi', 'ped', 'gyo', 'cir', 'urg', 'sp'], 5, "Refuerzo Rápido General"));

        const btnExtra = $("btn-refuerzo-extra");
        if (btnExtra) btnExtra.addEventListener("click", () => startQuickSession(['mi', 'ped', 'gyo', 'cir', 'urg', 'sp'], 10, "Mini Simulacro (10)"));

        const btnCasos = $("btn-refuerzo-casos");
        if (btnCasos) btnCasos.addEventListener("click", () => startQuickSession(['mi', 'ped', 'gyo', 'cir'], 3, "Casos Rápidos Aleatorios"));
    };

    const startTemaSession = (temas, qty, label) => {
        let pool = QUESTIONS.filter(q => q.tema && temas.includes(q.tema));
        if (pool.length === 0) pool = QUESTIONS;
        State.questionSet = shuffleArray(pool).slice(0, Math.min(qty, pool.length));
        State.mode = "estudio";
        State.durationSec = 0;
        State.currentIndex = 0;
        State.startTime = Date.now();
        State.answers = State.questionSet.map(() => ({ selected: null, isCorrect: null, flagged: false }));
        State.currentExamType = label;
        isFinishing = false;
        renderExamQuestion();
        showView("view-exam");
    };

    const startQuickSession = (specs, qty, label) => {
        let pool = QUESTIONS.filter(q => specs.includes(q.specialty));
        if (pool.length === 0) pool = QUESTIONS;
        State.questionSet = shuffleArray(pool).slice(0, qty);
        State.mode = "estudio";
        State.durationSec = 0;
        State.currentIndex = 0;
        State.startTime = Date.now();
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
        const q = State.questionSet[State.currentIndex];
        const ans = State.answers[State.currentIndex];
        const total = State.questionSet.length;

        const badge = $("case-area-badge"); if (badge) badge.textContent = (State.globalStats.bySpecialty[q.specialty]?.name || q.specialty).toUpperCase();
        const caseText = $("case-text"); if (caseText) caseText.textContent = q.case;
        const qNum = $("q-num-display"); if (qNum) qNum.textContent = `Pregunta ${State.currentIndex + 1}`;
        const qText = $("question-text"); if (qText) qText.textContent = q.question;

        const optGrid = $("options-grid");
        if (optGrid) {
            optGrid.innerHTML = "";
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
                btn.addEventListener("click", () => handleAnswer(idx));
                optGrid.appendChild(btn);
            });
        }

        const pct = ((State.currentIndex + 1) / total) * 100;
        const qCounter = $("q-counter"); if (qCounter) qCounter.textContent = `Pregunta ${State.currentIndex + 1} de ${total}`;
        const progFill = $("progress-fill"); if (progFill) progFill.style.width = `${pct}%`;
        const flagBtn = $("flag-btn"); if (flagBtn) flagBtn.className = `btn-flag ${ans.flagged ? 'active' : ''}`;

        const bn = $("btn-next");
        if (bn) {
            if (State.currentIndex === total - 1) {
                bn.textContent = "✔ Terminar";
                bn.classList.add("btn-danger");
                bn.classList.remove("primary");
            } else {
                bn.textContent = "Siguiente →";
                bn.classList.remove("btn-danger");
                bn.classList.add("primary");
            }
        }

        const fb = $("feedback-card");
        if (fb) {
            if (State.mode === "estudio" && ans.selected !== null) {
                fb.style.display = "block";
                fb.className = `feedback-card ${ans.isCorrect ? '' : 'wrong'}`;
                const fh = $("feedback-header"); if (fh) fh.textContent = ans.isCorrect ? "¡Respuesta Correcta!" : "Respuesta Incorrecta";
                const fe = $("feedback-explanation"); if (fe) fe.textContent = q.explanation;
                const fg = $("feedback-gpc"); if (fg) fg.textContent = q.gpcReference;
            } else {
                fb.style.display = "none";
            }
        }
        renderExamSidebar();
    };

    const handleAnswer = (idx) => {
        const q = State.questionSet[State.currentIndex];
        const ans = State.answers[State.currentIndex];
        if (State.mode === "estudio" && ans.selected !== null) return;
        ans.selected = idx;
        ans.isCorrect = (idx === q.answerIndex);
        if (State.mode === "estudio") recordStat(q.specialty, ans.isCorrect, q.tema);
        renderExamQuestion();
    };

    const renderExamSidebar = () => {
        const nav = $("question-navigator"); if (!nav) return;
        nav.innerHTML = "";
        State.questionSet.forEach((_, i) => {
            const a = State.answers[i];
            const dot = document.createElement("button");
            dot.className = "nav-dot";
            dot.textContent = i + 1;
            if (i === State.currentIndex) dot.classList.add("current");
            else if (a.selected !== null) dot.classList.add("answered");
            if (a.flagged) dot.classList.add("flagged");
            dot.addEventListener("click", () => { State.currentIndex = i; renderExamQuestion(); });
            nav.appendChild(dot);
        });
    };

    const startTimer = () => {
        const timerDisp = $("timer-display"); if (timerDisp) timerDisp.style.display = "block";
        State.startTime = Date.now();
        const timerText = $("timer-text");
        if (State.timer) clearInterval(State.timer);
        State.timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - State.startTime) / 1000);
            const remaining = Math.max(State.durationSec - elapsed, 0);
            if (timerText) timerText.textContent = formatTime(remaining);
            if (remaining <= 0) finishExam();
        }, 1000);
    };

    let isFinishing = false;
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

            saveGlobalStats();
            showView("view-results");
        } catch (err) {
            console.error("Error crítico en finishExam:", err);
            alert("Error al finalizar el examen. Revisa la consola.");
            // Si hay un error, reseteamos el candado para permitir reintentar
            isFinishing = false;
        }
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

    const updateDashboardStats = () => {
        const elements = {
            'dash-respondidas': 'respondidas',
            'dash-aciertos': 'aciertos',
            'dash-sesiones': 'sesiones'
        };
        for (let id in elements) if ($(id)) $(id).textContent = State.globalStats[elements[id]] || 0;
        const pct = State.globalStats.respondidas > 0 ? ((State.globalStats.aciertos / State.globalStats.respondidas) * 100).toFixed(1) : "0.0";
        if ($("dash-promedio")) $("dash-promedio").textContent = `${pct}%`;
        if ($("dash-promedio-bar")) $("dash-promedio-bar").style.width = `${pct}%`;

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

        // Update Fail Points (Puntos de Falla)
        const failList = document.querySelector(".fail-list");
        if (failList) {
            State.globalStats.byTema = State.globalStats.byTema || {};
            const temasArr = Object.keys(State.globalStats.byTema).map(t => {
                const stat = State.globalStats.byTema[t];
                return { tema: t, ...stat, errorRate: 1 - (stat.correct / stat.total) };
            }).filter(t => t.total >= 1 && t.errorRate > 0);

            temasArr.sort((a, b) => b.errorRate - a.errorRate || b.total - a.total);

            if (temasArr.length === 0) {
                failList.innerHTML = `<div class="list-item"><p style="color:var(--text-muted); padding:20px;">No se han detectado puntos de falla aún.</p></div>`;
                State.topFailedTemas = null;
            } else {
                failList.innerHTML = "";
                temasArr.slice(0, 3).forEach((t) => {
                    const errorPct = Math.round(t.errorRate * 100);
                    const isCritical = errorPct >= 70;
                    const isHigh = errorPct >= 40;
                    const priorityText = isCritical ? "Crítica" : (isHigh ? "Alta" : "Media");
                    const badgeClass = isCritical ? "orange-bg" : (isHigh ? "blue-bg" : "green-bg");
                    const specName = State.globalStats.bySpecialty[t.specialty]?.name || 'Tema General';

                    const div = document.createElement("div"); div.className = "fail-item";
                    div.innerHTML = `
                        <div class="fail-item-info">
                            <div class="fail-item-title">${t.tema} <span style="font-size: 0.8em; color: var(--text-muted); font-weight: normal;">(${specName})</span></div>
                            <div class="fail-item-sub">Prioridad de Refuerzo: ${priorityText} | Tasa de error: ${errorPct}% (${t.total - t.correct} de ${t.total})</div>
                        </div>
                        <div class="fail-item-badge ${badgeClass}" style="color:white; padding:4px 8px; border-radius:4px; font-size:0.8rem; font-weight:600;">Repasar</div>
                    `;
                    failList.appendChild(div);
                });
                State.topFailedTemas = temasArr.slice(0, 5).map(t => t.tema);
            }
        }
    };

    let chartHistory = null;
    let chartSpecialties = null;
    let chartDoughnut = null;

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

        // Chart 2: Especialidades como Line Chart (Estilo Bolsa de Valores)
        const ctxSpec = document.getElementById('chart-specialties-line');
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

            // Si todos los puntos son 0, agregamos variabilidad visual para el "look" de bolsa
            // o simplemente aseguramos que se vea la línea.
            const hasData = dataPts.some(v => v > 0);

            if (chartSpecialties) chartSpecialties.destroy();

            const gradient = ctxSpec.getContext('2d').createLinearGradient(0, 0, 0, 250);
            gradient.addColorStop(0, accentBlue + '55');
            gradient.addColorStop(1, accentBlue + '00');

            chartSpecialties = new Chart(ctxSpec, {
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
                        pointRadius: 0, // Estilo bolsa (sin puntos, solo línea)
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
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            padding: 12,
                            titleFont: { size: 14, weight: 'bold' },
                            bodyFont: { size: 13 }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'nearest',
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: { color: 'rgba(160,174,192,0.05)', drawBorder: false },
                            ticks: { font: { size: 10 } }
                        },
                        x: {
                            grid: { display: false, drawBorder: false },
                            ticks: { font: { size: 10 } }
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
            // Datos dummys grises si no hay historial
            let bgColors = [accentGreen, '#f43f5e'];
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
                        legend: { position: 'bottom', labels: { padding: 20 } }
                    }
                }
            });
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
                    alert("No hay detalles guardados para este examen antiguo.");
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
        const q = State.questionSet[reviewIndex];
        const ans = State.answers[reviewIndex];
        const total = State.questionSet.length;

        const badge = $("rev-case-area-badge"); if (badge) badge.textContent = (State.globalStats.bySpecialty[q.specialty]?.name || q.specialty).toUpperCase();
        const caseText = $("rev-case-text"); if (caseText) caseText.textContent = q.case;
        const qNum = $("rev-q-num-display"); if (qNum) qNum.textContent = `Pregunta ${reviewIndex + 1}`;
        const qText = $("rev-question-text"); if (qText) qText.textContent = q.question;

        const optGrid = $("rev-options-grid");
        if (optGrid) {
            optGrid.innerHTML = "";
            q.options.forEach((optStr, idx) => {
                const btn = document.createElement("button");
                btn.className = "option-btn";
                const letter = String.fromCharCode(65 + idx);
                btn.innerHTML = `<strong>${letter}.</strong> ${optStr}`;

                if (idx === q.answerIndex) btn.classList.add("correct-ans");
                if (ans.selected === idx && idx !== q.answerIndex) btn.classList.add("wrong-ans");
                if (ans.selected === idx) btn.classList.add("selected");

                optGrid.appendChild(btn);
            });
        }

        const fe = $("rev-feedback-explanation"); if (fe) fe.textContent = q.explanation;
        const fg = $("rev-feedback-gpc"); if (fg) fg.textContent = q.gpcReference;

        renderReviewSidebar();
    };

    const renderReviewSidebar = () => {
        const nav = $("rev-question-navigator"); if (!nav) return;
        nav.innerHTML = "";
        State.questionSet.forEach((_, i) => {
            const a = State.answers[i];
            const dot = document.createElement("button");
            dot.className = "nav-dot";
            dot.textContent = i + 1;
            if (i === reviewIndex) dot.classList.add("current");
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
                            alert("¡Pomodoro terminado! Tiempo de un breve descanso.");
                            pomoMode = "break";
                            pomoSeconds = 5 * 60;
                        } else {
                            alert("¡Descanso terminado! A darle con todo.");
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
        initPomodoro();
        const bd = $("btn-back-dash"); if (bd) bd.addEventListener("click", () => $("nav-dashboard").click());
        const rv = $("btn-review"); if (rv) rv.addEventListener("click", startReview);
        const exr = $("btn-exit-review"); if (exr) exr.addEventListener("click", () => showView("view-results"));

        const bp = $("btn-prev"); if (bp) bp.addEventListener("click", () => { if (State.currentIndex > 0) { State.currentIndex--; renderExamQuestion(); } });
        const bn = $("btn-next");
        if (bn) {
            bn.addEventListener("click", () => {
                if (State.currentIndex < State.questionSet.length - 1) {
                    State.currentIndex++;
                    renderExamQuestion();
                } else {
                    const modal = $("finish-modal");
                    if (modal) modal.style.display = "flex";
                }
            });
        }

        const rbp = $("btn-rev-prev"); if (rbp) rbp.addEventListener("click", () => { if (reviewIndex > 0) { reviewIndex--; renderReviewQuestion(); } });
        const rbn = $("btn-rev-next"); if (rbn) rbn.addEventListener("click", () => { if (reviewIndex < State.questionSet.length - 1) { reviewIndex++; renderReviewQuestion(); } });

        const fl = $("flag-btn"); if (fl) fl.addEventListener("click", () => { State.answers[State.currentIndex].flagged = !State.answers[State.currentIndex].flagged; renderExamQuestion(); });

        const fe = $("btn-finish-early");

        const showFinishModal = () => {
            const modal = $("finish-modal");
            if (modal) modal.style.display = "flex";
        };

        const hideFinishModal = () => {
            const modal = $("finish-modal");
            if (modal) modal.style.display = "none";
        };

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

        const ss = $("btn-save-settings"); if (ss) ss.addEventListener("click", () => {
            if ($("setting-name")) {
                State.userName = $("setting-name").value;
                $$(".user-name").forEach(el => el.textContent = State.userName);
                $$(".header-title").forEach(el => el.textContent = `Hola, ${State.userName}`);
            }
            if ($("setting-theme")) {
                State.theme = $("setting-theme").value;
                localStorage.setItem("enarm_theme", State.theme);
                applyTheme(State.theme);
                if (typeof updateCharts === 'function' && State.view === 'view-estadisticas') updateCharts();
            }

            saveGlobalStats();
            alert("Ajustes guardados."); $("nav-dashboard").click();
        });

        // Click en Tarjeta Sesiones -> Historial
        const cardSes = $("card-sesiones");
        if (cardSes) cardSes.addEventListener("click", () => $("nav-historial").click());

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
                alert("Estadísticas eliminadas correctamente.");
                $("nav-dashboard").click();
            }
        });

        // Carga inicial de datos en el dashboard
        updateDashboardStats();
        updateCharts();
    });
})();
