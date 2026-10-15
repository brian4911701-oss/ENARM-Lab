const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

(async () => {
  const { default: puppeteer } = await import('puppeteer');
  const root = path.resolve(__dirname, '..');
  const server = http.createServer((req, res) => {
    const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname === '/' ? '/index.html' : new URL(req.url, 'http://localhost').pathname));
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
    const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpeg': 'image/jpeg' };
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    const installedChrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
    browser = await puppeteer.launch({ headless: true, ...(fs.existsSync(installedChrome) ? { executablePath: installedChrome } : {}) });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000 });
    await page.setRequestInterception(true);
    page.on('request', req => req.url().startsWith('http://127.0.0.1:') || req.url().startsWith('data:') ? req.continue() : req.abort());
    const errors = [];
    page.on('pageerror', error => { if (error.stack?.includes('rubber-segment')) errors.push(String(error)); });
    const url = `http://127.0.0.1:${server.address().port}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.rubber-segment__thumb');
    const order = ['#landing-features', '#landing-pricing', '#landing-how', '#landing-specialties', '#landing-faq'];
    for (const selector of ['.landing-nav-link', '.landing-mobile-link']) {
      assert.deepEqual(await page.$$eval(selector, links => links.map(link => link.hash)), order);
    }
    const thumb = () => page.$eval('.rubber-segment__thumb', el => ({ clip: el.style.clipPath, visible: getComputedStyle(el).visibility }));
    assert.equal((await thumb()).visible, 'hidden');
    await page.click('.landing-nav-link[href="#landing-features"]');
    await new Promise(resolve => setTimeout(resolve, 850));
    const first = await thumb();
    assert.equal(first.visible, 'visible');
    assert.equal(await page.evaluate(() => location.hash), '#landing-features');
    await page.click('.landing-nav-link[href="#landing-pricing"]');
    await new Promise(resolve => setTimeout(resolve, 60));
    const during = await thumb();
    await new Promise(resolve => setTimeout(resolve, 850));
    const landed = await thumb();
    assert.notEqual(during.clip, first.clip);
    assert.notEqual(during.clip, landed.clip);
    await page.focus('.landing-nav-link[href="#landing-pricing"]');
    await page.keyboard.press('Home');
    await new Promise(resolve => setTimeout(resolve, 850));
    assert.equal(await page.evaluate(() => location.hash), '#landing-features');
    const start = await page.$eval('.landing-nav-link[href="#landing-features"]', el => { const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    const end = await page.$eval('.landing-nav-link[href="#landing-faq"]', el => { const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, { steps: 15 });
    await page.mouse.up();
    await new Promise(resolve => setTimeout(resolve, 850));
    assert.equal(await page.evaluate(() => location.hash), '#landing-faq');
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.click('.landing-nav-link[href="#landing-how"]');
    const reduced = await thumb();
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal((await thumb()).clip, reduced.clip);
    await page.evaluate(() => {
      document.querySelectorAll('.landing-nav-link').forEach(el => el.classList.toggle('is-active', el.hash === '#landing-specialties'));
    });
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.notEqual((await thumb()).clip, reduced.clip);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    await page.click('.landing-nav-link[href="#landing-pricing"]');
    await new Promise(resolve => setTimeout(resolve, 850));
    // Exercise the actual app navigation code without requiring Firebase login.
    const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
    const navigation = app.slice(app.indexOf('// Smooth scroll for landing anchor links'), app.indexOf('// If user doesn\'t exist locally, show landing page'));
    assert(navigation.includes('navigationTarget'));
    await page.addScriptTag({ content: `(() => { const landingPage = document.getElementById('landing-page'); ${navigation} })();` });
    await new Promise(resolve => setTimeout(resolve, 200));
    for (const destination of ['#landing-faq', '#landing-features']) {
      await page.evaluate(() => {
        window.activeHistory = [];
        window.activeObserver = new MutationObserver(() => {
          window.activeHistory.push(document.querySelector('.landing-nav-link.is-active')?.hash || '');
        });
        window.activeObserver.observe(document.querySelector('#landing-nav-links'), { subtree: true, attributes: true, attributeFilter: ['class'] });
      });
      await page.click(`.landing-nav-link[href="${destination}"]`);
      await new Promise(resolve => setTimeout(resolve, 1600));
      const history = await page.evaluate(() => { window.activeObserver.disconnect(); return window.activeHistory; });
      assert(history.length > 0);
      assert(history.every(hash => hash === destination), `Selection changed during scroll: ${history}`);
      assert.equal(await page.$eval('.landing-nav-link.is-active', link => link.hash), destination);
    }
    // Manual scrolling resumes normal section tracking after a click.
    await page.evaluate(() => document.querySelector('#landing-how').scrollIntoView({ behavior: 'instant', block: 'start' }));
    await new Promise(resolve => setTimeout(resolve, 220));
    assert.equal(await page.$eval('.landing-nav-link.is-active', link => link.hash), '#landing-how');
    const size = await page.$eval('#landing-nav-links', el => ({ width: el.offsetWidth, height: el.offsetHeight, radius: getComputedStyle(el).borderRadius }));
    assert(size.width <= 590 && size.height === 44);
    assert.equal(size.radius, '16px');
    await page.screenshot({ path: path.join(root, 'artifacts/rubber-navigation-desktop.png') });
    await page.setViewport({ width: 390, height: 844 });
    assert.equal(await page.$eval('#landing-nav-links', el => getComputedStyle(el).display), 'none');
    await page.setViewport({ width: 1280, height: 900 });
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal(await page.$eval('#landing-nav-links', el => el.scrollWidth <= el.clientWidth), true);
    assert.deepEqual(errors, []);
    console.log('Rubber navigation: click, elastic travel, drag, keyboard, reduced motion, section sync and responsive layout OK.');
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
