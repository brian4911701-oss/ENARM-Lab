"use strict";

// Keep the native range in charge of dragging, touch and keyboard interaction.
// Decorative bars and the readout follow it without changing its integer value.
(() => {
    const instances = new WeakMap();
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    window.ENARMQuestionPicker = {
        create(input) {
            if (!input) return null;
            if (instances.has(input)) return instances.get(input);
            const picker = input.closest(".question-picker");
            if (!picker) return null;
            const output = picker.querySelector("#setup-qty-val");
            const track = picker.querySelector(".question-picker-track");
            const bars = picker.querySelector(".question-picker-bars");
            const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
            const wantsReducedMotion = () => reducedMotion.matches || document.body.classList.contains("reduce-motion");
            const ticks = Array.from({ length: 45 }, () => {
                const tick = document.createElement("span");
                tick.className = "question-picker-bar";
                bars.append(tick);
                return tick;
            });
            let target = 0;
            let position = 0;
            let lean = 0;
            let targetLean = 0;
            let dragging = false;
            let frame = 0;
            let lastTime = 0;

            const paint = () => {
                track.style.setProperty("--qty-position", `${position * 100}%`);
                track.style.setProperty("--qty-lean", `${lean}deg`);
                ticks.forEach((tick, index) => {
                    const point = index / (ticks.length - 1);
                    const distance = point - position;
                    const proximity = Math.exp(-Math.pow(distance / 0.065, 2));
                    const filled = point <= position + 0.001;
                    const height = 16 + proximity * (dragging ? 35 : 27);
                    tick.style.transform = `scaleY(${height / 16})`;
                    tick.style.opacity = String(filled ? 0.42 + proximity * 0.58 : 0.48 + proximity * 0.32);
                    tick.classList.toggle("is-filled", filled);
                });
            };
            const stop = () => {
                cancelAnimationFrame(frame);
                frame = 0;
                lastTime = 0;
            };
            const animate = (now) => {
                frame = 0;
                const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.04) : 1 / 60;
                lastTime = now;
                const ease = 1 - Math.exp(-22 * dt);
                position += (target - position) * ease;
                lean += (targetLean - lean) * ease;
                targetLean *= Math.exp(-12 * dt);
                if (Math.abs(target - position) < 0.0001 && Math.abs(lean) < 0.02 && Math.abs(targetLean) < 0.02) {
                    position = target;
                    lean = targetLean = 0;
                    lastTime = 0;
                } else {
                    frame = requestAnimationFrame(animate);
                }
                paint();
            };
            const requestPaint = () => {
                if (wantsReducedMotion()) {
                    stop();
                    position = target;
                    lean = targetLean = 0;
                    paint();
                } else if (!frame) {
                    frame = requestAnimationFrame(animate);
                }
            };
            const sync = ({ immediate = false } = {}) => {
                const min = Number(input.min) || 1;
                const max = Math.max(min, Number(input.max) || min);
                const value = clamp(Math.round(Number(input.value) || min), min, max);
                input.value = String(value);
                output.textContent = String(value);
                input.setAttribute("aria-valuetext", `${value} ${value === 1 ? "pregunta" : "preguntas"}`);
                const next = max === min ? 0 : (value - min) / (max - min);
                if (next !== target) targetLean = wantsReducedMotion() ? 0 : clamp((next - target) * -180, -11, 11);
                target = next;
                if (immediate || dragging || wantsReducedMotion()) {
                    position = target;
                    if (immediate) lean = targetLean = 0;
                    paint();
                }
                picker.classList.toggle("is-disabled", input.disabled);
                requestPaint();
            };
            const release = () => {
                if (!dragging) return;
                dragging = false;
                picker.classList.remove("is-dragging");
                targetLean = 0;
                requestPaint();
            };
            input.addEventListener("input", () => sync());
            input.addEventListener("pointerdown", event => {
                if (input.disabled || (event.pointerType === "mouse" && event.button !== 0)) return;
                dragging = true;
                picker.classList.add("is-dragging");
                requestPaint();
            });
            input.addEventListener("pointercancel", release);
            input.addEventListener("lostpointercapture", release);
            input.addEventListener("blur", release);
            window.addEventListener("pointerup", release);
            window.addEventListener("blur", release);
            reducedMotion.addEventListener("change", () => sync({ immediate: true }));
            let motionPreference = wantsReducedMotion();
            new MutationObserver(() => {
                const next = wantsReducedMotion();
                if (next !== motionPreference) {
                    motionPreference = next;
                    sync({ immediate: true });
                }
            }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
            const controller = { sync };
            instances.set(input, controller);
            sync({ immediate: true });
            return controller;
        }
    };
})();
