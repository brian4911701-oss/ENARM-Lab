/* Public galleries run independently of Firebase and session initialization. */
(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    document.querySelectorAll('[data-gallery]').forEach(gallery => {
        const slides = [...gallery.querySelectorAll('.app-gallery-slide')];
        const controls = gallery.querySelector('.app-gallery-controls');
        const dotsContainer = gallery.querySelector('.app-gallery-dots');
        const pauseButton = gallery.querySelector('[data-gallery-pause]');
        const status = gallery.querySelector('.app-gallery-status');
        const device = gallery.dataset.gallery === 'desktop' ? 'computadora' : 'móvil';
        let current = 0;
        let timer;
        let visible = false;
        let paused = motion.matches;
        let hovered = false;
        let focused = false;
        let request = 0;

        const load = slide => {
            if (slide.dataset.src) {
                slide.src = slide.dataset.src;
                delete slide.dataset.src;
            }
            return slide.decode();
        };
        const schedule = () => {
            clearTimeout(timer);
            if (visible && !paused && !hovered && !focused && !document.hidden) {
                timer = setTimeout(() => show(current + 1), 6000);
            }
        };
        const dots = slides.map((slide, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('aria-label', `Ver captura ${index + 1} de ${slides.length} de ${device}`);
            button.setAttribute('aria-controls', gallery.querySelector('.app-gallery-screen').id);
            button.setAttribute('aria-current', String(index === 0));
            button.addEventListener('click', () => show(index, true));
            dotsContainer.append(button);
            return button;
        });
        const show = async (index, manual = false) => {
            clearTimeout(timer);
            const next = (index + slides.length) % slides.length;
            const thisRequest = ++request;
            try {
                await load(slides[next]);
            } catch (_) {
                if (thisRequest !== request) return;
                if (manual) status.textContent = 'No se pudo cargar esta captura. Inténtalo de nuevo.';
                schedule();
                return;
            }
            if (thisRequest !== request) return;
            current = next;
            slides.forEach((slide, i) => {
                slide.classList.toggle('is-active', i === current);
                slide.setAttribute('aria-hidden', String(i !== current));
                dots[i].setAttribute('aria-current', String(i === current));
            });
            gallery.querySelector('[data-gallery-count]').textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
            if (manual) status.textContent = `Captura ${current + 1} de ${slides.length} de ${device}`;
            load(slides[(current + 1) % slides.length]).catch(() => {});
            schedule();
        };
        const updatePause = () => {
            pauseButton.setAttribute('aria-pressed', String(paused));
            pauseButton.setAttribute('aria-label', `${paused ? 'Reproducir' : 'Pausar'} galería de ${device}`);
            pauseButton.firstElementChild.textContent = paused ? '▶' : 'Ⅱ';
            schedule();
        };
        gallery.querySelector('[data-gallery-prev]').addEventListener('click', () => show(current - 1, true));
        gallery.querySelector('[data-gallery-next]').addEventListener('click', () => show(current + 1, true));
        pauseButton.addEventListener('click', () => { paused = !paused; updatePause(); });
        gallery.addEventListener('keydown', event => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            event.preventDefault();
            show(current + (event.key === 'ArrowRight' ? 1 : -1), true);
        });
        gallery.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; schedule(); } });
        gallery.addEventListener('pointerleave', () => { hovered = false; schedule(); });
        gallery.addEventListener('focusin', () => { focused = true; schedule(); });
        gallery.addEventListener('focusout', event => { focused = gallery.contains(event.relatedTarget); schedule(); });
        document.addEventListener('visibilitychange', schedule);
        motion.addEventListener('change', () => { paused = motion.matches; updatePause(); });
        new IntersectionObserver(entries => {
            visible = entries[0].isIntersecting;
            if (visible) load(slides[(current + 1) % slides.length]).catch(() => {});
            schedule();
        }, { threshold: 0.15 }).observe(gallery);
        controls.hidden = false;
        updatePause();
    });
})();

