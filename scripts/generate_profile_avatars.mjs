import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const engine = path.join(root, 'tools/bible-strong-avatar-lab');
const { build } = await import(pathToFileURL(path.join(engine, 'node_modules/vite/dist/node/index.js')).href);
const result = await build({ configFile: false, logLevel: 'error',
  build: { write: false, minify: false, lib: {
    entry: path.join(engine, 'packages/avatar-core/src/geometry.ts'), formats: ['es']
  } }
});
const chunks = Array.isArray(result) ? result.flatMap(item => item.output) : result.output;
const chunk = chunks.find(item => item.type === 'chunk');
const { renderAvatar, poseFromExpression } = await import('data:text/javascript;base64,' + Buffer.from(chunk.code).toString('base64'));
const designs = JSON.parse(await fs.readFile(path.join(root, 'avatars/procedural-designs.json'), 'utf8'));
const requestedIds = new Set(process.argv.slice(2));
for (const id of requestedIds) {
  if (!designs.avatars.some(avatar => avatar.id === id)) throw new Error('Unknown avatar: ' + id);
}
const avatars = designs.avatars.filter(avatar => !requestedIds.size || requestedIds.has(avatar.id));
const output = path.join(root, 'avatars/procedural');
await fs.mkdir(output, { recursive: true });

function surface([type, width, height, depth, roundness]) {
  return { type, width, height, depth, roundness,
    morphRoundness: type === 'cube' ? 0.55 : type === 'cone' ? 0.85 : 0,
    tipRoundness: 1, baseRoundness: 1 };
}
const defaultEyes = { id: 'neutral', headX: 0, headY: 0, headZ: 0,
  widthLeft: 20, widthRight: 20, heightLeft: 40, heightRight: 40, spacing: 32,
  positionXLeft: 0, positionXRight: 0, positionYLeft: 0, positionYRight: 0,
  leftAngle: 0, rightAngle: 0, perspective: 0, eyeMotion: 'none', bodyMotion: 'none' };
const drawPath = (d, fill) => d ? `<path d="${d}" fill="${fill}"/>` : '';
const mix = (hex, target, amount) => {
  const channels = value => value.match(/[\da-f]{2}/gi).map(channel => parseInt(channel, 16));
  return '#' + channels(hex).map((value, i) => Math.round(value + (channels(target)[i] - value) * amount).toString(16).padStart(2, '0')).join('');
};
const browser = await puppeteer.launch({ headless: true, pipe: true,
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage();

try {
for (const avatar of avatars) {
  const expression = { ...defaultEyes, ...avatar.eyes };
  const body = { primary: surface(avatar.primary), nodes: avatar.nodes.map((node, i) => ({
    id: 'part-' + i, name: 'Part ' + i, surface: surface(node),
    position: node.slice(5, 8), rotation: [0, 0, node[8]]
  })) };
  const geometry = renderAvatar(poseFromExpression(expression), body.primary, 1, { bodyNodes: body.nodes, includeWire: false });
  if (!geometry.headPath || !geometry.leftVisible || !geometry.rightVisible) throw new Error('Invalid avatar: ' + avatar.id);
  // Measure the rendered silhouette, including ears and gills, to remove empty framing.
  await page.setContent(`<svg xmlns="http://www.w3.org/2000/svg"><g id="silhouette">${[...geometry.backPaths, geometry.headPath, ...geometry.frontPaths].map(d => drawPath(d, '#000')).join('')}</g></svg>`);
  const bounds = await page.$eval('#silhouette', element => {
    const { x, y, width, height } = element.getBBox();
    return { x, y, width, height };
  });
  const side = Math.max(bounds.width, bounds.height) * 1.06;
  const viewBox = [bounds.x + bounds.width / 2 - side / 2, bounds.y + bounds.height / 2 - side / 2, side, side].map(value => value.toFixed(2)).join(' ');
  for (const color of designs.palette) {
    const bodyShade = color.id === 'blanco' ? 0.22 : 0.38;
    const backShade = color.id === 'blanco' ? 0.28 : 0.48;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="320" height="320" role="img" aria-label="${avatar.label}">
<title>${avatar.label}</title><metadata>Generated with Bible Strong Avatar Lab ${designs.engineRevision}. Original ENARMAX character design.</metadata>
<defs>
<clipPath id="face"><path d="${geometry.headPath}"/></clipPath>
<radialGradient id="body" cx="30%" cy="23%" r="84%" fx="27%" fy="20%">
<stop offset="0" stop-color="${mix(color.hex, '#ffffff', 0.58)}"/><stop offset="0.36" stop-color="${mix(color.hex, '#ffffff', 0.12)}"/><stop offset="0.65" stop-color="${color.hex}"/><stop offset="1" stop-color="${mix(color.hex, '#15274a', bodyShade)}"/>
</radialGradient>
<radialGradient id="back" cx="30%" cy="20%" r="88%">
<stop offset="0" stop-color="${mix(color.hex, '#ffffff', 0.25)}"/><stop offset="0.5" stop-color="${color.hex}"/><stop offset="1" stop-color="${mix(color.hex, '#15274a', backShade)}"/>
</radialGradient>
<radialGradient id="sheen" cx="27%" cy="17%" r="65%"><stop stop-color="#fff" stop-opacity="0.20"/><stop offset="0.65" stop-color="#fff" stop-opacity="0"/></radialGradient>
<linearGradient id="eyes" x2="0.3" y2="1"><stop stop-color="#25364d"/><stop offset="1" stop-color="#101a2a"/></linearGradient>
<filter id="shadow" x="-25%" y="-25%" width="150%" height="155%" color-interpolation-filters="sRGB"><feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#102340" flood-opacity="0.22"/></filter>
</defs>
<g filter="url(#shadow)">${geometry.backPaths.map(d => drawPath(d, 'url(#back)')).join('')}${drawPath(geometry.headPath, 'url(#body)')}${drawPath(geometry.headPath, 'url(#sheen)')}
<g clip-path="url(#face)">${drawPath(geometry.leftPath, 'url(#eyes)')}${drawPath(geometry.rightPath, 'url(#eyes)')}</g>
${geometry.frontPaths.map(d => drawPath(d, 'url(#body)')).join('')}</g></svg>\n`;
    if (/NaN|Infinity|undefined/.test(svg)) throw new Error('Invalid SVG: ' + avatar.id);
    await fs.writeFile(path.join(output, `${avatar.id}-${color.id}.svg`), svg);
  }
}
} finally {
  await browser.close();
}
console.log(`Generated ${avatars.length} original avatars in ${designs.palette.length} colors with Avatar Lab.`);
