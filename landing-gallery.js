/* Public galleries run independently of Firebase and session initialization. */
(() => {
    // This app is served as static HTML (no React build step), so the landing
    // carousel uses the same melt treatment in a small, dependency-free WebGL layer.
    class MeltTransition {
        constructor(screen, image) {
            this.screen = screen;
            this.progress = 0;
            this.frame = 0;
            this.animating = false;
            this.gl = null;
            try {
                const canvas = document.createElement('canvas');
                canvas.className = 'app-gallery-morph-canvas';
                canvas.setAttribute('aria-hidden', 'true');
                const gl = canvas.getContext('webgl', { alpha: false, antialias: true, premultipliedAlpha: false });
                if (!gl) return;
                const compile = (type, source) => {
                    const shader = gl.createShader(type);
                    gl.shaderSource(shader, source);
                    gl.compileShader(shader);
                    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
                    return shader;
                };
                const vertex = compile(gl.VERTEX_SHADER, 'attribute vec2 p; varying vec2 v; void main(){v=p*.5+.5; gl_Position=vec4(p,0.,1.);}');
                const fragment = compile(gl.FRAGMENT_SHADER, `
                    precision highp float;
                    uniform sampler2D a; uniform sampler2D b;
                    uniform vec2 resolution; uniform vec2 sizeA; uniform vec2 sizeB; uniform vec3 backdrop;
                    uniform float progress; uniform float direction;
                    varying vec2 v;
                    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
                    float noise(vec2 p){vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
                      return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
                    float fbm(vec2 p){float n=0.,w=.5; for(int i=0;i<3;i++){n+=noise(p)*w;p*=2.;w*=.5;} return n;}
                    vec2 containUV(vec2 uv, vec2 imageSize){
                      float boxAspect=resolution.x/resolution.y, imageAspect=imageSize.x/imageSize.y;
                      vec2 drawn=vec2(1.);
                      if(imageAspect>boxAspect) drawn.y=boxAspect/imageAspect;
                      else drawn.x=imageAspect/boxAspect;
                      return (uv-.5)/drawn+.5;
                    }
                    void main(){
                      float p=clamp(progress,0.,1.), edge=fbm(v*2.4+vec2(v.y*1.2,v.x*.8)*direction);
                      float mask=smoothstep(edge-.16,edge+.16,p);
                      vec2 warp=vec2(noise(v*5.+p)-.5,noise(v*5.-p)-.5)*.20*sin(p*3.14159);
                      vec2 uvA=containUV(v+warp*p,sizeA), uvB=containUV(v-warp*(1.-p),sizeB);
                      float ca=.010*sin(p*3.14159);
                      float insideA=step(0.,uvA.x)*step(uvA.x,1.)*step(0.,uvA.y)*step(uvA.y,1.);
                      float insideB=step(0.,uvB.x)*step(uvB.x,1.)*step(0.,uvB.y)*step(uvB.y,1.);
                      vec3 oldSample=vec3(texture2D(a,uvA+vec2(ca,0.)).r,texture2D(a,uvA).g,texture2D(a,uvA-vec2(ca,0.)).b);
                      vec3 newSample=vec3(texture2D(b,uvB+vec2(ca,0.)).r,texture2D(b,uvB).g,texture2D(b,uvB-vec2(ca,0.)).b);
                      vec4 oldImage=vec4(mix(backdrop,oldSample,insideA),1.);
                      vec4 newImage=vec4(mix(backdrop,newSample,insideB),1.);
                      gl_FragColor=mix(oldImage,newImage,mask);
                    }`);
                const program = gl.createProgram();
                gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
                if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
                this.canvas = canvas; this.gl = gl; this.program = program;
                this.buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
                gl.useProgram(program);
                const position = gl.getAttribLocation(program, 'p'); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
                this.uniforms = Object.fromEntries(['a','b','resolution','sizeA','sizeB','progress','direction','backdrop'].map(name => [name, gl.getUniformLocation(program, name)]));
                this.textures = [0, 1].map(unit => { const tex = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); gl.uniform1i(this.uniforms[unit ? 'b' : 'a'], unit); return tex; });
                screen.append(canvas);
                this.upload(this.textures[0], image);
                this.upload(this.textures[1], image);
                this.resize();
                const rgb = getComputedStyle(screen).backgroundColor.match(/[\d.]+/g)?.slice(0, 3).map(value => Number(value) / 255) || [0.09, 0.11, 0.16];
                gl.uniform3f(this.uniforms.backdrop, rgb[0], rgb[1], rgb[2]);
                this.resizeObserver = new ResizeObserver(() => this.resize()); this.resizeObserver.observe(screen);
            } catch (_) {
                this.destroy();
            }
        }
        upload(texture, image) {
            const gl = this.gl;
            gl.activeTexture(gl.TEXTURE0 + (texture === this.textures[0] ? 0 : 1));
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        }
        resize() {
            if (!this.gl) return;
            const rect = this.screen.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            this.canvas.width = Math.max(1, Math.round(rect.width * dpr)); this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            this.gl.useProgram(this.program); this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
        }
        draw() { this.gl.useProgram(this.program); this.gl.uniform1f(this.uniforms.progress, this.progress); this.gl.drawArrays(this.gl.TRIANGLES, 0, 6); }
        transition(from, to, direction) {
            if (!this.gl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return Promise.resolve(false);
            this.upload(this.textures[0], from); this.upload(this.textures[1], to);
            this.gl.uniform2f(this.uniforms.sizeA, from.naturalWidth, from.naturalHeight);
            this.gl.uniform2f(this.uniforms.sizeB, to.naturalWidth, to.naturalHeight);
            this.gl.uniform1f(this.uniforms.direction, direction);
            this.progress = 0; this.canvas.classList.add('is-transitioning');
            this.animating = true;
            clearTimeout(this.hideTimer);
            const started = performance.now(), duration = 700;
            return new Promise(resolve => {
                const tick = now => {
                    const raw = Math.min((now - started) / duration, 1);
                    this.progress = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
                    this.draw();
                    if (this.progress < 1) this.frame = requestAnimationFrame(tick);
                    else { this.animating = false; this.hideTimer = setTimeout(() => this.canvas?.classList.remove('is-transitioning'), 700); resolve(true); }
                };
                this.frame = requestAnimationFrame(tick);
            });
        }
        destroy() { if (this.frame) cancelAnimationFrame(this.frame); clearTimeout(this.hideTimer); this.resizeObserver?.disconnect(); if (this.canvas?.parentNode) this.canvas.remove(); this.gl = null; }
    }

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
        let morph = null;
        let queuedIndex = null;

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
            if (morph?.animating) { queuedIndex = index; return; }
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
            if (next !== current) {
                if (!morph && !motion.matches) morph = new MeltTransition(gallery.querySelector('.app-gallery-screen'), slides[current]);
                const direction = next > current || (current === slides.length - 1 && next === 0) ? 1 : -1;
                const animated = morph ? await morph.transition(slides[current], slides[next], direction) : false;
                if (thisRequest !== request) return;
                if (animated) {
                    slides.forEach((slide, i) => {
                        slide.classList.toggle('is-active', i === next);
                        slide.setAttribute('aria-hidden', String(i !== next));
                        dots[i].setAttribute('aria-current', String(i === next));
                    });
                    current = next;
                }
            }
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
            if (queuedIndex !== null) {
                const queued = queuedIndex;
                queuedIndex = null;
                queueMicrotask(() => show(queued, true));
            }
        };
        const updatePause = () => {
            pauseButton.setAttribute('aria-pressed', String(paused));
            pauseButton.setAttribute('aria-label', `${paused ? 'Reproducir' : 'Pausar'} galería de ${device}`);
            pauseButton.firstElementChild.textContent = paused ? '▶' : 'Ⅱ';
            schedule();
        };
        gallery.querySelector('[data-gallery-prev]').addEventListener('click', () => show((queuedIndex ?? current) - 1, true));
        gallery.querySelector('[data-gallery-next]').addEventListener('click', () => show((queuedIndex ?? current) + 1, true));
        pauseButton.addEventListener('click', () => { paused = !paused; updatePause(); });
        gallery.addEventListener('keydown', event => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            event.preventDefault();
            show((queuedIndex ?? current) + (event.key === 'ArrowRight' ? 1 : -1), true);
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

