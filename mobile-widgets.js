/* Mobile dashboard tools. The browser owns scrolling and gesture arbitration. */
(() => {
    const selectionKey = "enarmax_mobile_widget";
    const names = ["Rumbo al ENARM", "Pomodoro", "Constancia", "Accesos rápidos", "Cuaderno"];
    const pageIds = ["mw-clock", "mw-focus", "mw-activity", "mw-shortcuts", "mw-notebook"];
    const icon = (body) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
    const icons = {
        calculator: icon('<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M8 6h8M8 10h1m6 0h1M8 14h1m6 0h1M8 18h1m6 0h1"/>'),
        notebook: icon('<path d="M8 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM3 7h5M3 12h5M3 17h5M11 8h5M11 12h5"/>'),
        topics: icon('<path d="M12 5v15M3 4c4-1 7 0 9 2 2-2 5-3 9-2v14c-4-1-7 0-9 2-2-2-5-3-9-2Z"/>'),
        stats: icon('<path d="M4 20h17M7 16v-5M12 16V4M17 16V8"/>'),
        history: icon('<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7M12 7v5l3 2"/>'),
        reset: icon('<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>')
    };

    const create = ({ clock, getActivity, getTimer, getNotebook, openNotebook, toggleTimer, resetTimer, navigate }) => {
        if (!clock || clock.dataset.stacked) return null;
        clock.dataset.stacked = "true";
        const mobile = matchMedia("(max-width: 768px)");
        const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
        const root = document.createElement("section");
        root.className = "mobile-widget-stack";
        root.setAttribute("aria-label", "Herramientas de estudio");
        root.innerHTML = `
            <div class="mw-viewport" tabindex="0" aria-label="Widgets. Usa las flechas izquierda y derecha para cambiar">
                <section class="mw-page mw-clock" id="mw-clock" role="group" aria-label="1 de 5: Rumbo al ENARM"></section>
                <section class="mw-page mw-focus" id="mw-focus" role="group" aria-label="2 de 5: Pomodoro">
                    <div class="mw-ring" role="progressbar" aria-label="Progreso del bloque" aria-valuemin="0" aria-valuemax="100">
                        <svg viewBox="0 0 112 112" aria-hidden="true"><circle class="mw-ring-track" cx="56" cy="56" r="49"/><circle class="mw-ring-progress" cx="56" cy="56" r="49"/></svg>
                        <div class="mw-ring-copy"><strong class="mw-time">25:00</strong></div>
                    </div>
                    <div class="mw-focus-copy"><h2 class="mw-title mw-pomodoro-title">Pomodoro</h2>
                        <div class="mw-controls"><button type="button" class="mw-toggle">Iniciar</button><button type="button" class="mw-reset" aria-label="Reiniciar temporizador">${icons.reset}</button></div>
                    </div>
                </section>
                <section class="mw-page mw-activity" id="mw-activity" role="group" aria-label="3 de 5: Constancia">
                    <h2 class="mw-title">Constancia</h2>
                    <div class="mw-bars" role="list" aria-label="Sesiones completadas por día"></div>
                </section>
                <section class="mw-page mw-shortcuts" id="mw-shortcuts" role="group" aria-label="4 de 5: Accesos rápidos">
                    <h2 class="mw-title">Accesos rápidos</h2>
                    <div class="mw-shortcut-grid">
                        <button type="button" data-destination="view-calculadora" class="mw-shortcut mw-shortcut-calculator">${icons.calculator}<span>Calculadora<small>de puntaje</small></span></button>
                        <button type="button" data-destination="view-temario" class="mw-shortcut mw-shortcut-topics">${icons.topics}<span>Temario<small>Explora tus temas</small></span></button>
                        <button type="button" data-destination="view-estadisticas" class="mw-shortcut mw-shortcut-stats">${icons.stats}<span>Estadísticas</span></button>
                        <button type="button" data-destination="view-historial" class="mw-shortcut mw-shortcut-history">${icons.history}<span>Historial</span></button>
                    </div>
                </section>
                <section class="mw-page mw-notebook" id="mw-notebook" role="group" aria-label="5 de 5: Cuaderno de casos">
                    <div class="mw-notebook-cover" aria-hidden="true">${icons.notebook}<span class="mw-notebook-count">0</span></div>
                    <div class="mw-notebook-copy"><h2 class="mw-title">Cuaderno</h2><span class="mw-notebook-topic">Casos guardados</span><p class="mw-notebook-preview">Aún no hay casos guardados.</p><button type="button" class="mw-open-notebook">Abrir cuaderno <span aria-hidden="true">→</span></button></div>
                </section>
            </div>
            <div class="mw-footer"><span class="mw-current-name" aria-hidden="true">Rumbo al ENARM</span><div class="mw-dots" role="group" aria-label="Elegir widget">${names.map((name, i) => `<button type="button" aria-label="${name}" aria-controls="${pageIds[i]}" data-widget="${i}"${i === 0 ? ' aria-current="true"' : ""}><span></span></button>`).join("")}</div><span class="mw-position" aria-hidden="true">1 / ${names.length}</span></div>
            <span class="mw-announcement sr-only" role="status"></span>`;
        clock.after(root);
        const viewport = root.querySelector(".mw-viewport");
        const pages = [...root.querySelectorAll(".mw-page")];
        const dots = [...root.querySelectorAll("[data-widget]")];
        let selected = 0;
        try {
            const saved = Number(localStorage.getItem(selectionKey));
            if (Number.isInteger(saved) && saved >= 0 && saved < pages.length) selected = saved;
        } catch { /* Storage can be disabled in private browsing. */ }
        let settling;
        let renderedSelection = -1;
        let persistedSelection = selected;
        let lastActivityKey = "";
        let lastCompletedAt = 0;
        let timerInitialized = false;
        const setText = (selector, value) => {
            const element = root.querySelector(selector);
            if (element.textContent !== value) element.textContent = value;
        };
        const updateActivity = () => {
            if (!mobile.matches) return;
            const days = getActivity();
            const key = JSON.stringify(days);
            if (key === lastActivityKey) return;
            lastActivityKey = key;
            const total = days.reduce((sum, day) => sum + day.count, 0);
            const max = Math.max(1, ...days.map(day => day.count));
            root.querySelector(".mw-bars").setAttribute("aria-label", `${total} sesiones completadas en los últimos 7 días`);
            // Dates and counts come from the adapter, never from HTML or remote strings.
            const bars = root.querySelector(".mw-bars");
            bars.replaceChildren(...days.map((day, index) => {
                const item = document.createElement("div");
                item.className = `mw-day${index === 6 ? " mw-today" : ""}`;
                item.setAttribute("role", "listitem");
                item.setAttribute("aria-label", `${day.date}: ${day.count} ${day.count === 1 ? "sesión" : "sesiones"}${index === 6 ? ", hoy" : ""}`);
                const value = document.createElement("span");
                value.className = "mw-bar-value";
                value.textContent = day.count.toLocaleString("es-MX");
                const track = document.createElement("span");
                track.className = "mw-bar-track";
                const fill = document.createElement("span");
                fill.className = "mw-bar-fill";
                fill.style.setProperty("--bar-height", `${day.count / max * 100}%`);
                track.append(fill);
                const label = document.createElement("span");
                label.className = "mw-day-label";
                label.textContent = day.label;
                item.append(value, track, label);
                return item;
            }));
        };
        const updateNotebook = () => {
            if (!mobile.matches) return;
            const notebook = getNotebook();
            setText(".mw-notebook-count", String(notebook.count));
            setText(".mw-notebook-topic", notebook.topic || "Casos guardados");
            setText(".mw-notebook-preview", notebook.title || "Aún no hay casos guardados.");
            root.querySelector(".mw-notebook-cover").classList.toggle("mw-notebook-empty", !notebook.count);
        };
        const updateTimer = () => {
            if (!mobile.matches) return;
            const timer = getTimer();
            if (!timer) return;
            const seconds = Math.max(0, Math.ceil(timer.seconds));
            setText(".mw-time", `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`);
            root.querySelector(".mw-ring").setAttribute("aria-valuetext", `${timer.label}: ${Math.floor(seconds / 60)} minutos y ${seconds % 60} segundos`);
            setText(".mw-toggle", timer.running ? "Pausar" : "Iniciar");
            const progress = Math.min(1, Math.max(0, timer.progress));
            root.querySelector(".mw-ring").setAttribute("aria-valuenow", String(Math.round(progress * 100)));
            root.querySelector(".mw-ring-progress").style.strokeDashoffset = String(307.876 * (1 - progress));
            root.classList.toggle("mw-running", timer.running);
            if (timerInitialized && timer.completedAt > lastCompletedAt) {
                setText(".mw-announcement", "Bloque terminado. Tu siguiente bloque está listo.");
            }
            lastCompletedAt = timer.completedAt;
            timerInitialized = true;
        };
        const commit = (index, persist = false) => {
            selected = Math.min(pages.length - 1, Math.max(0, index));
            if (persist && persistedSelection !== selected) {
                try { localStorage.setItem(selectionKey, String(selected)); persistedSelection = selected; } catch { /* Optional preference. */ }
            }
            if (renderedSelection === selected) return;
            renderedSelection = selected;
            pages.forEach((page, i) => {
                page.inert = i !== selected;
                page.classList.toggle("mw-active", i === selected);
                page.setAttribute("aria-hidden", String(i !== selected));
            });
            dots.forEach((dot, i) => {
                if (i === selected) dot.setAttribute("aria-current", "true");
                else dot.removeAttribute("aria-current");
            });
            setText(".mw-current-name", names[selected]);
            setText(".mw-position", `${selected + 1} / ${pages.length}`);
            if (selected === 1) updateTimer();
        };
        const goTo = (index, animate = true) => {
            const next = Math.min(pages.length - 1, Math.max(0, index));
            const motionAllowed = !reducedMotion.matches && !document.body.classList.contains("reduce-motion");
            viewport.scrollTo({ left: next * viewport.clientWidth, behavior: animate && motionAllowed ? "smooth" : "instant" });
            commit(next);
        };
        const settle = () => {
            if (mobile.matches && viewport.clientWidth) commit(Math.round(viewport.scrollLeft / viewport.clientWidth), true);
        };
        if ("onscrollend" in viewport) {
            viewport.addEventListener("scrollend", settle, { passive: true });
        } else {
            viewport.addEventListener("scroll", () => {
                clearTimeout(settling);
                settling = setTimeout(settle, 80);
            }, { passive: true });
        }
        viewport.addEventListener("keydown", event => {
            if (event.target !== viewport) return;
            const next = event.key === "ArrowRight" ? selected + 1 : event.key === "ArrowLeft" ? selected - 1 : event.key === "Home" ? 0 : event.key === "End" ? pages.length - 1 : null;
            if (next === null) return;
            event.preventDefault();
            goTo(next);
        });
        dots.forEach((dot, index) => dot.addEventListener("click", () => goTo(index)));
        root.querySelector(".mw-toggle").addEventListener("click", toggleTimer);
        root.querySelector(".mw-reset").addEventListener("click", resetTimer);
        root.querySelector(".mw-open-notebook").addEventListener("click", openNotebook);
        root.querySelectorAll("[data-destination]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.destination)));
        const syncLayout = () => {
            clearTimeout(settling);
            if (mobile.matches) {
                pages[0].append(clock);
                commit(selected, false);
                requestAnimationFrame(() => goTo(selected, false));
                updateActivity();
                updateTimer();
                updateNotebook();
            } else {
                root.before(clock);
            }
        };
        mobile.addEventListener("change", syncLayout);
        let previousWidth = 0;
        const resize = new ResizeObserver(([entry]) => {
            const width = entry.contentRect.width;
            const changed = width !== previousWidth;
            previousWidth = width;
            if (width && changed && mobile.matches) {
                goTo(selected, false);
            }
        });
        resize.observe(viewport);
        syncLayout();
        return { updateActivity, updateTimer, updateNotebook, refresh: syncLayout, isMobile: () => mobile.matches };
    };
    window.ENARMMobileWidgets = { create };
})();
