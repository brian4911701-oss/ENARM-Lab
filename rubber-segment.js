// DOM adaptation of the supplied React Bits RubberSegment: independent edges,
// stretch=100, squash=3, speed=1, glide=75 and pointer dragging.
(() => {
  const track = document.querySelector('#landing-nav-links');
  if (!track) return;
  const links = [...track.querySelectorAll('.landing-nav-link')];
  if (!links.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const thumb = document.createElement('span');
  thumb.className = 'rubber-segment__thumb';
  thumb.setAttribute('aria-hidden', 'true');
  links.forEach(link => {
    const copy = document.createElement('span');
    copy.className = 'rubber-segment__copy';
    copy.textContent = link.textContent;
    thumb.append(copy);
  });
  track.append(thumb);
  track.classList.add('rubber-segment');

  const clamp = (x, min, max) => Math.min(max, Math.max(min, x));
  const rubber = (over, width) => over * width * .55 / (width + .55 * Math.abs(over));
  let slots = [];
  let selected = -1;
  let edges = [0, 0];
  let frame = 0;
  let generation = 0;
  let drag = null;
  let suppressClick = false;
  const paint = () => {
    const width = track.clientWidth;
    thumb.style.clipPath = `inset(3px ${Math.max(3, width - edges[1])}px 3px ${Math.max(3, edges[0])}px round 13px)`;
    thumb.style.visibility = selected < 0 ? 'hidden' : 'visible';
  };
  const stop = () => {
    generation++;
    cancelAnimationFrame(frame);
    frame = 0;
  };
  const jump = index => {
    stop();
    if (slots[index]) edges = [...slots[index]];
    paint();
  };
  // Animate each edge separately so the leading edge reaches the next slot
  // before the trailing edge catches up and relaxes its 3px squash.
  const travel = (index, momentum = 0, landing = false) => {
    if (!slots[index]) return;
    if (reduce.matches) return jump(index);
    stop();
    const token = generation;
    const from = [...edges];
    const target = slots[index];
    const direction = Math.sign(target[0] + target[1] - from[0] - from[1]) || 1;
    const dilated = [Math.min(from[0], target[0]), Math.max(from[1], target[1])];
    const started = performance.now();
    const spring = (time, bounce) => 1 - Math.exp(-time * 9) * (Math.cos(time * bounce) + 9 / bounce * Math.sin(time * bounce));
    const tick = now => {
      if (generation !== token) return;
      const elapsed = now - started;
      if (!landing && elapsed < 150) {
        const progress = 1 - Math.pow(1 - Math.min(1, elapsed / 190), 4);
        edges = from.map((x, i) => x + (dilated[i] - x) * progress);
      } else {
        const seconds = Math.max(0, elapsed - (landing ? 0 : 150)) / 1000;
        // Begin at the exact dilation handoff to avoid a discontinuity.
        const start = landing ? from : from.map((x, i) => x + (dilated[i] - x) * (1 - Math.pow(1 - 150 / 190, 4)));
        const progress = spring(seconds * 2.3, Math.abs(momentum) > 110 ? 8 : 4);
        edges = start.map((x, i) => {
          const trailing = direction > 0 ? i === 0 : i === 1;
          const squash = trailing ? direction * 3 * Math.sin(Math.min(1, seconds / .3) * Math.PI) : 0;
          return x + (target[i] - x) * progress + squash;
        });
      }
      paint();
      if (elapsed < (landing ? 650 : 800)) frame = requestAnimationFrame(tick);
      else { edges = [...target]; paint(); frame = 0; }
    };
    frame = requestAnimationFrame(tick);
  };
  const select = index => {
    if (index === selected) return;
    const previous = selected;
    selected = index;
    if (index < 0) { stop(); paint(); return; }
    if (previous < 0) jump(index);
    else travel(index);
  };
  const measure = () => {
    if (!track.clientWidth) return;
    const bounds = track.getBoundingClientRect();
    slots = links.map((link, index) => {
      const rect = link.getBoundingClientRect();
      const left = rect.left - bounds.left - track.clientLeft + track.scrollLeft;
      const copy = thumb.children[index];
      copy.style.left = `${left}px`;
      copy.style.width = `${rect.width}px`;
      return [left, left + rect.width];
    });
    if (drag) finishDrag(true);
    jump(selected);
  };
  const sync = () => {
    if (!drag) select(links.findIndex(link => link.classList.contains('is-active')));
  };
  links.forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    select(links.indexOf(link));
  }));
  new MutationObserver(sync).observe(track, { subtree: true, attributes: true, attributeFilter: ['class'] });
  const observer = new ResizeObserver(measure);
  observer.observe(track);
  links.forEach(link => observer.observe(link));
  document.fonts?.ready.then(measure);
  reduce.addEventListener('change', () => jump(selected));

  track.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !event.isPrimary || drag || selected < 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const x = event.clientX - track.getBoundingClientRect().left - track.clientLeft;
    if (x < edges[0] || x > edges[1]) return;
    drag = { id: event.pointerId, x, offset: x - edges[0], width: edges[1] - edges[0], live: false, history: [[event.timeStamp, x]] };
    // Capture only after the deadzone, preserving ordinary link activation.
  });
  track.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const x = event.clientX - track.getBoundingClientRect().left - track.clientLeft;
    if (!drag.live && Math.abs(x - drag.x) < 4) return;
    if (!drag.live) {
      stop();
      drag.live = true;
      track.setPointerCapture(event.pointerId);
      track.classList.add('is-dragging');
    }
    drag.history.push([event.timeStamp, x]);
    drag.history = drag.history.filter(([time]) => event.timeStamp - time <= 100);
    const left = x - drag.offset;
    const min = slots[0][0];
    const max = slots[slots.length - 1][1] - drag.width;
    if (left < min && !reduce.matches) edges = [min, min + drag.width - rubber(min - left, drag.width)];
    else if (left > max && !reduce.matches) edges = [max + rubber(left - max, drag.width), max + drag.width];
    else { const bounded = clamp(left, min, max); edges = [bounded, bounded + drag.width]; }
    paint();
  });
  const finishDrag = (cancelled, event) => {
    if (!drag || (event && event.pointerId !== drag.id)) return;
    const released = drag;
    drag = null;
    track.classList.remove('is-dragging');
    if (track.hasPointerCapture(released.id)) track.releasePointerCapture(released.id);
    if (!released.live) return;
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 0);
    if (cancelled) { travel(selected, 0, true); return; }
    const first = released.history[0];
    const last = released.history[released.history.length - 1];
    const age = event.timeStamp - last[0];
    const velocity = age < 100 && last[0] - first[0] >= 8 ? clamp((last[1] - first[1]) / (last[0] - first[0]) * 1000, -2000, 2000) : 0;
    const decay = 1 - .1 * Math.pow(.05, .75);
    const projected = (edges[0] + edges[1]) / 2 + velocity / 1000 * decay / (1 - decay);
    let next = slots.reduce((best, slot, i) => Math.abs((slot[0] + slot[1]) / 2 - projected) < Math.abs((slots[best][0] + slots[best][1]) / 2 - projected) ? i : best, 0);
    if (Math.abs(velocity) > 110 && next === selected) next = clamp(next + Math.sign(velocity), 0, links.length - 1);
    selected = next;
    travel(next, velocity, true);
    // A synthetic click uses the same navigation handler as mouse and keyboard.
    links[next].click();
  };
  track.addEventListener('pointerup', event => finishDrag(false, event));
  track.addEventListener('pointercancel', event => finishDrag(true, event));
  track.addEventListener('lostpointercapture', event => finishDrag(true, event));
  track.addEventListener('pointerleave', () => { if (drag && !drag.live) drag = null; });
  track.addEventListener('dragstart', event => event.preventDefault());
  track.addEventListener('click', event => {
    if (suppressClick && event.isTrusted) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  track.addEventListener('keydown', event => {
    const index = links.indexOf(document.activeElement);
    if (index < 0) return;
    let next;
    if (event.key === 'ArrowRight') next = Math.min(links.length - 1, index + 1);
    else if (event.key === 'ArrowLeft') next = Math.max(0, index - 1);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = links.length - 1;
    else return;
    event.preventDefault();
    links[next].click();
    links[next].focus({ preventScroll: true });
  });
  measure();
  sync();
})();
