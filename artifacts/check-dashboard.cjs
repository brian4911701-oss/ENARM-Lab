const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

(async () => {
  const { default: puppeteer } = await import('puppeteer');
  const root = path.resolve(__dirname, '..');
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
    const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpeg': 'image/jpeg' };
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    if (pathname === '/app.js') {
      // Test-only access to the real closure; the source file stays unchanged.
      const source = fs.readFileSync(file, 'utf8');
      const marker = '    // Carga inicial de datos en el dashboard';
      res.end(source.replace(marker, '    window.__dashboardTest = { State, updateDashboardStats, handleAnswer, getEffectiveStreak, getStudyStreakData, recordStudyDay, saveGlobalStats };\n' + marker));
      return;
    }
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', req => req.url().startsWith('http://127.0.0.1:') || req.url().startsWith('data:') ? req.continue() : req.abort());
    const errors = [];
    page.on('pageerror', error => { errors.push(String(error)); console.error('Browser error:', String(error)); });
    await page.evaluateOnNewDocument(() => {
      // Charts and Firebase are external services; this checks local UI/logic.
      window.Chart = class {
        static defaults = { font: {} };
        static register() {}
        static getChart() { return null; }
        constructor(context, config) { this.data = config.data; this.options = config.options; this.canvas = context?.canvas; }
        update() {} destroy() {} resize() {}
      };
      if (!localStorage.getItem('dashboard-fixture')) {
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
        const date = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
        localStorage.setItem('enarm_user', 'Mariana Hernández Rodríguez');
        localStorage.setItem('enarm_coins', '1250');
        localStorage.setItem('enarm_stats', JSON.stringify({ respondidas: 875, aciertos: 660, sesiones: 28, pomodoros: 4, streakData: { lastStudyDate: date, currentStreak: 12 }, bySpecialty: { mi: { total: 220, correct: 170, name: 'Medicina Interna' }, ped: { total: 220, correct: 160, name: 'Pediatría' }, gyo: { total: 220, correct: 160, name: 'Ginecología y Obstetricia' }, cir: { total: 215, correct: 170, name: 'Cirugía General' } } }));
        localStorage.setItem('dashboard-fixture', '1');
      }
    });
    await page.setViewport({ width: 1440, height: 900 });
    const url = `http://127.0.0.1:${server.address().port}`;
    const showApp = async () => page.evaluate(() => {
      document.querySelector('#landing-page').classList.add('hidden');
      document.querySelector('#auth-overlay').style.display = 'none';
      document.querySelector('#app-startup-screen').style.display = 'none';
      document.querySelector('.app-layout').style.display = 'flex';
      window.showView('view-dashboard');
      window.__dashboardTest.updateDashboardStats(true);
    });
    console.log('Loading dashboard fixture');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForFunction(() => Boolean(window.__dashboardTest));
    await showApp();
    console.log('Dashboard initialized');
    const fixtures = [[1920, 1080], [1440, 900], [1366, 768], [1280, 1024], [1100, 720], [1024, 768], [900, 700], [820, 1180], [768, 1024], [600, 900], [430, 932], [390, 844], [360, 800], [320, 740]];
    for (const [width, height] of fixtures) {
      console.log(`Checking ${width}x${height}`);
      await page.setViewport({ width, height });
      await new Promise(resolve => setTimeout(resolve, 130));
      const result = await page.evaluate(() => {
        const rect = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width, height: r.height }; };
        const main = document.querySelector('.main-content');
        return {
          overflow: main.scrollWidth - main.clientWidth,
          cards: [...document.querySelectorAll('#view-dashboard .stats-grid > .stat-card')].map(el => { const r = el.getBoundingClientRect(); return { id: el.id, x: r.x, y: r.y, right: r.right, bottom: r.bottom }; }),
          grid: rect('#view-dashboard .stats-grid'),
          average: rect('#card-performance-summary'),
          quick: rect('#card-quick-training'),
          name: rect('.dashboard-name-row'),
          streak: rect('#streak-btn-mobile'),
          coinsInDashboard: Boolean(document.querySelector('#view-dashboard #card-coins')),
          coinsInMore: Boolean(document.querySelector('#view-mas #card-coins'))
        };
      });
      assert(result.overflow <= 1, `${width}px horizontal overflow: ${result.overflow}`);
      assert(!result.coinsInDashboard && result.coinsInMore);
      for (let i = 0; i < result.cards.length; i++) for (let j = i + 1; j < result.cards.length; j++) {
        const a = result.cards[i], b = result.cards[j];
        const overlaps = a.x < b.right - 1 && a.right > b.x + 1 && a.y < b.bottom - 1 && a.bottom > b.y + 1;
        assert(!overlaps, `${width}px cards overlap: ${a.id}, ${b.id}`);
      }
      if (width <= 768) {
        assert(Math.abs(result.average.width - result.grid.width) <= 2, `${width}px average should span the row`);
        assert(result.streak.width > 0 && result.streak.right <= result.name.right + 1, `${width}px mobile streak beside the name`);
      }
      if ([1366, 390].includes(width)) await page.screenshot({ path: path.join(root, `artifacts/dashboard-${width}.png`) });
    }
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => Boolean(window.__dashboardTest));
    await showApp();
    await page.click('#streak-btn-mobile');
    assert.equal(await page.$eval('#streak-modal', el => el.style.display), 'flex');
    assert.equal(await page.$eval('#modal-streak-days', el => el.textContent), '12');
    await page.click('#btn-close-streak');
    const practice = await page.evaluate(() => {
      const test = window.__dashboardTest;
      test.State.mode = 'simulacro';
      test.State.questionSet = [{ question: 'Prueba local', options: ['A', 'B'], answer: 0, specialty: 'mi', caseGroupId: 1 }];
      test.State.answers = [{ selected: null, isCorrect: false }];
      test.handleAnswer(0, 0, null);
      test.handleAnswer(1, 0, null);
      const saved = JSON.parse(localStorage.getItem('enarm_stats'));
      return { streak: test.getEffectiveStreak(), saved: saved.streakData.currentStreak, sessions: saved.sesiones, answered: saved.respondidas };
    });
    assert.deepEqual(practice, { streak: 13, saved: 13, sessions: 28, answered: 875 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => Boolean(window.__dashboardTest));
    await showApp();
    assert.equal(await page.$eval('#streak-val-mobile', el => el.textContent), '13');
    await page.evaluate(() => window.showView('view-mas'));
    await page.click('#card-coins');
    assert.equal(await page.evaluate(() => window.__dashboardTest.State.view), 'view-referrals');
    await page.setViewport({ width: 1440, height: 900, isMobile: false, hasTouch: false });
    await showApp();
    await page.click('#dashboard-coins-btn');
    assert.equal(await page.evaluate(() => window.__dashboardTest.State.view), 'view-referrals');
    await showApp();
    await page.click('#streak-btn');
    assert.equal(await page.$eval('#streak-modal', el => el.style.display), 'flex');
    assert.deepEqual(errors, []);
    console.log('Dashboard: 14 viewport sizes, no card overlap/overflow, mobile streak modal, coins links, unfinished practice persistence and reload OK.');
  } catch (error) {
    console.error('Dashboard check failed:', error);
    throw error;
  } finally {
    if (browser) {
      let shutdownTimer;
      await Promise.race([browser.close(), new Promise(resolve => { shutdownTimer = setTimeout(() => { browser.process()?.kill(); resolve(); }, 10000); })]);
      clearTimeout(shutdownTimer);
    }
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
