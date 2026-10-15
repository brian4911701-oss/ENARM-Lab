// Vanilla DOM adaptation of React Bits GlassSurface for the landing navigation.
(() => {
  const page = document.querySelector('#landing-page');
  const header = page?.querySelector('.landing-header');
  if (header) {
    let scrollFrame = 0;
    const updateHeader = () => {
      scrollFrame = 0;
      header.style.setProperty('--header-shade', Math.min(1, Math.max(0, page.scrollTop / 64)).toFixed(3));
    };
    page.addEventListener('scroll', () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateHeader);
    }, { passive: true });
    updateHeader();
    const syncHeight = () => page.style.setProperty('--landing-header-height', `${header.offsetHeight}px`);
    if ('ResizeObserver' in window) new ResizeObserver(syncHeight).observe(header);
    syncHeight();
  }
  const nav = document.querySelector('#landing-page .landing-nav-links.glass-surface');
  if (!nav) return;

  const filterId = 'glass-filter-landing-nav';
  const redGradId = 'glass-red-grad-landing-nav';
  const blueGradId = 'glass-blue-grad-landing-nav';
  const ns = 'http://www.w3.org/2000/svg';
  const filterHost = nav.querySelector('.glass-surface__filter');
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('xmlns', ns);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('glass-surface__filter');
  const defs = document.createElementNS(ns, 'defs');
  const filter = document.createElementNS(ns, 'filter');
  filter.id = filterId;
  filter.setAttribute('color-interpolation-filters', 'sRGB');
  filter.setAttribute('x', '0%');
  filter.setAttribute('y', '0%');
  filter.setAttribute('width', '100%');
  filter.setAttribute('height', '100%');
  const feImage = document.createElementNS(ns, 'feImage');
  feImage.setAttribute('x', '0'); feImage.setAttribute('y', '0');
  feImage.setAttribute('width', '100%'); feImage.setAttribute('height', '100%');
  feImage.setAttribute('preserveAspectRatio', 'none'); feImage.setAttribute('result', 'map');
  filter.append(feImage);
  const channels = [];
  const matrixValues = [
    '1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0',
    '0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0',
    '0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0'
  ];
  ['red', 'green', 'blue'].forEach((name, index) => {
    const displacement = document.createElementNS(ns, 'feDisplacementMap');
    displacement.setAttribute('in', 'SourceGraphic');
    displacement.setAttribute('in2', 'map');
    // Subtle refraction avoids stretching the backdrop into visible pixels.
    displacement.setAttribute('scale', String(-12 + index * 0.4));
    displacement.setAttribute('xChannelSelector', 'R');
    displacement.setAttribute('yChannelSelector', 'G');
    displacement.setAttribute('result', `disp-${name}`);
    filter.append(displacement);
    const color = document.createElementNS(ns, 'feColorMatrix');
    color.setAttribute('in', `disp-${name}`);
    color.setAttribute('type', 'matrix');
    color.setAttribute('values', matrixValues[index]);
    color.setAttribute('result', name);
    filter.append(color);
    channels.push(displacement);
  });
  const blendRG = document.createElementNS(ns, 'feBlend');
  blendRG.setAttribute('in', 'red'); blendRG.setAttribute('in2', 'green');
  blendRG.setAttribute('mode', 'screen'); blendRG.setAttribute('result', 'rg');
  const blendRGB = document.createElementNS(ns, 'feBlend');
  blendRGB.setAttribute('in', 'rg'); blendRGB.setAttribute('in2', 'blue');
  blendRGB.setAttribute('mode', 'screen'); blendRGB.setAttribute('result', 'output');
  const blur = document.createElementNS(ns, 'feGaussianBlur');
  blur.setAttribute('in', 'output'); blur.setAttribute('stdDeviation', '0.5');
  filter.append(blendRG, blendRGB, blur);
  defs.append(filter);
  svg.append(defs);
  if (filterHost) filterHost.replaceWith(svg);
  else nav.prepend(svg);

  const generateDisplacementMap = () => {
    const { width, height } = nav.getBoundingClientRect();
    if (!width || !height) return null;
    const borderRadius = parseFloat(getComputedStyle(nav).borderTopLeftRadius) || 24;
    const edge = Math.min(width, height) * 0.035;
    const source = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="${ns}"><defs><linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/></linearGradient><linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/></linearGradient><filter id="soft" filterUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="11"/></filter></defs><rect width="${width}" height="${height}" fill="black"/><rect width="${width}" height="${height}" rx="${borderRadius}" fill="url(#${redGradId})"/><rect width="${width}" height="${height}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode:difference"/><rect x="${edge}" y="${edge}" width="${Math.max(0, width - edge * 2)}" height="${Math.max(0, height - edge * 2)}" rx="${borderRadius}" fill="hsl(0 0% 50% / .93)" filter="url(#soft)"/></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(source)}`;
  };
  let updateFrame = 0;
  const updateMap = () => {
    cancelAnimationFrame(updateFrame);
    updateFrame = requestAnimationFrame(() => {
      const map = generateDisplacementMap();
      if (map) feImage.setAttribute('href', map);
    });
  };
  const isUnsupported = (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) || /Firefox/.test(navigator.userAgent);
  const probe = document.createElement('div');
  probe.style.backdropFilter = `url(#${filterId})`;
  const supportsSvgFilter = !isUnsupported && probe.style.backdropFilter !== '';
  nav.classList.toggle('glass-surface--svg', supportsSvgFilter);
  nav.classList.toggle('glass-surface--fallback', !supportsSvgFilter);
  nav.style.setProperty('--filter-id', `url(#${filterId})`);
  nav.style.setProperty('--glass-saturation', '1');
  nav.style.setProperty('--glass-frost', '0');
  updateMap();
  if ('ResizeObserver' in window) new ResizeObserver(updateMap).observe(nav);
  else window.addEventListener('resize', updateMap, { passive: true });
})();
