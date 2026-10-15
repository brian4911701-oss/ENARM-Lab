const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { execFileSync } = require('node:child_process');

(async () => {
  const { default: puppeteer } = await import('puppeteer');
  const root = path.resolve(__dirname, '..');
  const examenCSS = execFileSync('git', ['show', 'f14b8a70db13acf099cee3f6e92d9332ec346a51:styles.css'], { cwd: root, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
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
      res.end(source.replace(marker, '    window.__dashboardTest = { State, updateDashboardStats, handleAnswer, getEffectiveStreak, getStudyStreakData, recordStudyDay, saveGlobalStats, applyTheme };\n' + marker));
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
    const showApp = async () => page.evaluate(async () => {
      document.querySelector('#landing-page').classList.add('hidden');
      document.querySelector('#auth-overlay').style.display = 'none';
      document.querySelector('#app-startup-screen').style.display = 'none';
      document.querySelector('.app-layout').style.display = 'flex';
      window.showView('view-dashboard');
      window.__dashboardTest.updateDashboardStats(true);
      await Promise.all([...document.querySelector('#view-dashboard').getAnimations({ subtree: true }),
        ...document.querySelector('#landing-page').getAnimations()]
        .filter(animation => Number.isFinite(animation.effect.getComputedTiming().endTime))
        .map(animation => animation.finished.catch(() => {})));
    });
    console.log('Loading dashboard fixture');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForFunction(() => Boolean(window.__dashboardTest));
    await showApp();
    await page.evaluate(css => {
      const style = document.createElement('style');
      style.id = 'examen-baseline'; style.media = 'not all'; style.textContent = css;
      document.head.append(style);
    }, examenCSS);
    console.log('Dashboard initialized');
    const fixtures = [[1920, 1080], [1440, 900], [1366, 768], [1280, 1024], [1100, 720], [1024, 768], [900, 700], [820, 1180], [768, 1024], [600, 900], [432, 936], [430, 932], [412, 915], [390, 844], [360, 800], [320, 740]];
    for (const [width, height] of fixtures) {
      console.log(`Checking ${width}x${height}`);
      await page.setViewport({ width, height });
      await new Promise(resolve => setTimeout(resolve, 130));
      const result = await page.evaluate(() => {
        const rect = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width, height: r.height }; };
        const main = document.querySelector('.main-content');
        // Compare the painted SVG shape with the digit glyphs, not their padded boxes.
        const streakInkOffset = (() => {
          const id = innerWidth <= 768 ? 'streak-btn-mobile' : 'streak-btn';
          const button = document.getElementById(id);
          const path = button.querySelector('path');
          const box = path.getBBox();
          const point = new DOMPoint(box.x + box.width / 2, box.y + box.height / 2).matrixTransform(path.getScreenCTM());
          const number = button.querySelector('span');
          const style = getComputedStyle(number);
          const context = document.createElement('canvas').getContext('2d');
          context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
          const metrics = context.measureText(number.textContent);
          const baseline = document.createElement('span');
          baseline.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
          number.append(baseline);
          const glyphCenter = baseline.getBoundingClientRect().top - (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
          baseline.remove();
          return point.y - glyphCenter;
        })();
        const mobileBaseline = innerWidth <= 768 ? (() => {
          const hero = document.querySelector('.dashboard-mobile-hero');
          const wrapper = document.querySelector('.dashboard-name-row');
          const streak = document.querySelector('#streak-btn-mobile');
          const snapshot = () => {
            const origin = hero.getBoundingClientRect();
            return ['.dashboard-mobile-hero', '.dashboard-hero-avatar', '.dashboard-hero-copy', '.dashboard-hero-kicker', '.dashboard-greeting-title', '#btn-open-notif'].map(selector => {
              const el = document.querySelector(selector), r = el.getBoundingClientRect(), css = getComputedStyle(el);
              return {
                selector,
                box: [r.x - origin.x, r.y - origin.y, r.width, r.height].map(value => Math.round(value * 100) / 100),
                styles: ['fontSize', 'fontWeight', 'lineHeight', 'padding', 'gap', 'borderRadius', 'marginTop', 'marginBottom', 'background', 'color'].map(key => css[key])
              };
            });
          };
          streak.style.display = 'none';
          const actual = snapshot();
          const styles = document.querySelector('link[href="styles.css"]').sheet;
          const layout = document.querySelector('link[href="dashboard-layout.css"]').sheet;
          const baseline = document.querySelector('#examen-baseline');
          styles.disabled = true; layout.disabled = true; baseline.media = 'all';
          wrapper.style.display = 'contents';
          const expected = snapshot();
          baseline.media = 'not all'; styles.disabled = false; layout.disabled = false;
          wrapper.style.removeProperty('display'); streak.style.removeProperty('display');
          return { actual, expected };
        })() : null;
        return {
          mobileBaseline,
          streakInkOffset,
          overflow: main.scrollWidth - main.clientWidth,
          cards: [...document.querySelectorAll('#view-dashboard .stats-grid > .stat-card')].map(el => { const r = el.getBoundingClientRect(); return { id: el.id, x: r.x, y: r.y, right: r.right, bottom: r.bottom }; }),
          grid: rect('#view-dashboard .stats-grid'),
          average: rect('#card-performance-summary'),
          quick: rect('#card-quick-training'),
          rank: rect('#card-rango'),
          score: rect('.performance-score'),
          sessions: rect('.performance-session-pill'),
          actions: [...document.querySelectorAll('.quick-training-actions .training-action')].map(el => ({ height: el.getBoundingClientRect().height, overflow: el.scrollWidth - el.clientWidth })),
          streakNumber: rect('#streak-val-mobile'),
          name: rect('.dashboard-hero-copy'),
          streak: rect('#streak-btn-mobile'),
          desktopStreak: rect('#streak-btn'),
          desktopCoins: rect('#dashboard-coins-btn'),
          desktopStreakNumber: rect('#streak-val'),
          desktopCoinNumber: rect('#dashboard-coins-val'),
          desktopFlame: rect('#streak-btn .dashboard-flame-icon'),
          desktopCoinIcon: rect('#dashboard-coins-btn .dashboard-coin-icon'),
          hero: rect('.dashboard-mobile-hero'),
          clock: rect('#exam-countdown'),
          clockFont: parseFloat(getComputedStyle(document.querySelector('#cd-days')).fontSize),
          counterFont: parseFloat(getComputedStyle(document.querySelector('#streak-btn')).fontSize),
          avatar: rect('#btn-dashboard-hero-profile'),
          trainingIcon: rect('#btn-quick-start .training-action-icon'),
          trainingDisplay: getComputedStyle(document.querySelector('#btn-quick-start')).display,
          flame: rect('#streak-btn-mobile .dashboard-flame-icon'),
          nameText: rect('.dashboard-greeting-title'),
          nameFont: parseFloat(getComputedStyle(document.querySelector('.dashboard-greeting-title')).fontSize),
          greetingFont: parseFloat(getComputedStyle(document.querySelector('.dashboard-hero-kicker')).fontSize),
          greeting: rect('.dashboard-hero-kicker'),
          coinsInDashboard: Boolean(document.querySelector('#view-dashboard #card-coins')),
          coinsInMore: Boolean(document.querySelector('#view-mas #card-coins'))
        };
      });
      assert(result.overflow <= 1, `${width}px horizontal overflow: ${result.overflow}`);
      const expectedInkOffset = width <= 768 ? -2 : 0;
      assert(Math.abs(result.streakInkOffset - expectedInkOffset) <= 1, `${width}px painted flame/digits offset: ${result.streakInkOffset}px`);
      assert(!result.coinsInDashboard && result.coinsInMore);
      assert.equal(result.trainingDisplay, 'grid');
      for (let i = 0; i < result.cards.length; i++) for (let j = i + 1; j < result.cards.length; j++) {
        const a = result.cards[i], b = result.cards[j];
        const overlaps = a.x < b.right - 1 && a.right > b.x + 1 && a.y < b.bottom - 1 && a.bottom > b.y + 1;
        assert(!overlaps, `${width}px cards overlap: ${a.id}, ${b.id}`);
      }
      if (width <= 768) {
        assert(Math.abs(result.average.width - result.grid.width) <= 2, `${width}px average should span the row`);
        assert(result.streak.width > 0 && result.streak.right <= result.name.right + 1, `${width}px mobile streak beside the name`);
        assert(result.average.bottom <= result.quick.y && result.quick.bottom <= result.rank.y, `${width}px order: average, quick training, rank`);
        assert.deepEqual(result.mobileBaseline.actual, result.mobileBaseline.expected, `${width}px welcome card must match examen when the added streak is hidden`);
        assert(Math.abs((result.streakNumber.y + result.streakNumber.height / 2) - (result.flame.y + result.flame.height / 2) - 2) < 1, `${width}px flame raised two pixels relative to the number`);
        assert(result.clock.y - result.hero.bottom >= 10, `${width}px header spacing`);
        assert(result.sessions.x >= result.score.right, `${width}px average and sessions side by side`);
        assert(result.trainingIcon.width >= 40, `${width}px mobile training icons visible`);
        assert(result.clockFont >= 26, `${width}px countdown digits should be readable`);
        assert(result.average.height <= 160, `${width}px performance card should be compact vertically: ${result.average.height}px`);
        assert(result.clock.height <= 110, `${width}px countdown should be compact vertically: ${result.clock.height}px`);
        assert(Math.abs(result.clock.width - result.hero.width) <= 1, `${width}px countdown should retain its full width`);
        assert(result.nameFont >= 24 && result.greetingFont >= 14, `${width}px original greeting and name sizes`);
        assert(result.avatar.width >= 64 && result.avatar.height >= 64, `${width}px reference profile photo size`);
        assert(result.greeting.bottom <= result.nameText.y + 1, `${width}px greeting must not overlap the name`);
        assert(Math.abs((result.average.y - result.clock.bottom) - (result.quick.y - result.average.bottom)) <= 1, `${width}px equal spacing between clock, performance and training cards`);
      } else {
        assert(result.trainingIcon.width >= 36, `${width}px training icon should not shrink`);
        assert(result.desktopCoins.y >= result.desktopStreak.bottom, `${width}px counters should stack vertically`);
        assert(result.counterFont >= 18, `${width}px desktop counters too small`);
        assert(Math.abs(result.desktopStreakNumber.x - result.desktopCoinNumber.x) < 1, `${width}px numbers must share one column`);
        assert(Math.abs((result.desktopFlame.x + result.desktopFlame.width / 2) - (result.desktopCoinIcon.x + result.desktopCoinIcon.width / 2)) < 1, `${width}px icon centers must share one column`);
        assert(Math.abs((result.desktopCoinNumber.y + result.desktopCoinNumber.height / 2) - (result.desktopCoinIcon.y + result.desktopCoinIcon.height / 2)) < 1, `${width}px coin and number centers must align`);
      }
      for (const action of result.actions) {
        assert(action.height >= 44, `${width}px training touch target`);
        assert(action.overflow <= 1, `${width}px training text overflow`);
      }
      if ([1366, 390, 320].includes(width)) await page.screenshot({ path: path.join(root, `artifacts/dashboard-${width}.png`) });
    }
    assert.deepEqual(await page.evaluate(() => ({
      correct: document.querySelector('#dash-summary-correct').textContent,
      answered: document.querySelector('#dash-summary-answered').textContent,
      progress: document.querySelector('#dash-summary-progress').style.width
    })), { correct: '660', answered: '875', progress: '75.4%' });

    console.log('Checking restored examen card and original Premium crown');
    const originalAvatarHTML = await page.$eval('.dashboard-hero-avatar', el => el.innerHTML);
    for (const width of [320, 390, 412, 432, 600]) {
      await page.setViewport({ width, height: 900 });
      const crown = await page.evaluate(() => {
        const name = document.querySelector('.dashboard-greeting-title .user-name');
        name.textContent = 'Isaac Rivera';
        document.querySelector('#streak-val-mobile').textContent = '0';
        const avatar = document.querySelector('.dashboard-hero-avatar');
        avatar.classList.add('is-premium', 'has-profile-avatar');
        avatar.innerHTML = '<img class="profile-avatar-image" src="/avatars/doctor-robot.webp" alt="Doctor Robot">';
        const style = getComputedStyle(avatar, '::after');
        const hero = document.querySelector('.dashboard-mobile-hero').getBoundingClientRect();
        const bell = document.querySelector('#btn-open-notif').getBoundingClientRect();
        const title = document.querySelector('.dashboard-greeting-title');
        return {
          size: parseFloat(style.fontSize),
          top: avatar.getBoundingClientRect().top + parseFloat(style.top),
          heroTop: hero.top,
          heroHeight: hero.height,
          titleHeight: title.getBoundingClientRect().height,
          titleLineHeight: parseFloat(getComputedStyle(title).lineHeight),
          bellCenterOffset: (bell.top + bell.height / 2) - (hero.top + hero.height / 2)
        };
      });
      assert.equal(crown.size, 17, `${width}px original examen Premium crown`);
      assert(crown.top >= crown.heroTop, `${width}px crown must not be clipped by the hero card`);
      assert(Math.abs(crown.bellCenterOffset) <= 1, `${width}px notification button vertically centered`);
      if ([390, 412, 432].includes(width)) await page.$('.dashboard-mobile-hero').then(el => el.screenshot({ path: path.join(root, `artifacts/mobile-reference-${width}.png`) }));
    }
    await page.evaluate(originalAvatarHTML => {
      document.querySelector('.dashboard-greeting-title .user-name').textContent = window.__dashboardTest.State.userName;
      const avatar = document.querySelector('.dashboard-hero-avatar');
      avatar.classList.remove('is-premium', 'has-profile-avatar');
      avatar.innerHTML = originalAvatarHTML;
      window.__dashboardTest.updateDashboardStats(true);
    }, originalAvatarHTML);
    console.log('Checking themes and reduced motion');
    await page.setViewport({ width: 1366, height: 768 });
    await page.evaluate(() => {
      document.querySelector('#streak-val').textContent = '0';
      document.querySelector('#dashboard-coins-val').textContent = '0';
    });
    await page.$('.dashboard-counters').then(el => el.screenshot({ path: path.join(root, 'artifacts/desktop-counters-zero.png') }));
    await page.evaluate(() => window.__dashboardTest.updateDashboardStats(true));
    for (const theme of ['light', 'lilac-light', 'black-teal', 'ocean']) {
      await page.evaluate(theme => window.__dashboardTest.applyTheme(theme), theme);
      for (const width of [390, 1366]) {
        await page.setViewport({ width, height: 900 });
        assert(await page.$eval('.main-content', el => el.scrollWidth <= el.clientWidth + 1), `${theme} ${width}px overflow`);
        if (theme === 'light') await page.screenshot({ path: path.join(root, `artifacts/dashboard-light-${width}.png`) });
      }
    }
    await page.hover('#btn-quick-start');
    await new Promise(resolve => setTimeout(resolve, 350));
    assert.notEqual(await page.$eval('#btn-quick-start', el => getComputedStyle(el).transform), 'none', 'desktop hover animation');
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    assert.equal(await page.$eval('#btn-quick-start', el => getComputedStyle(el).transform), 'none', 'reduced motion disables movement');
    assert(await page.$eval('#btn-quick-start', el => parseFloat(getComputedStyle(el).transitionDuration) <= .001), 'reduced motion disables transitions');
    await page.emulateMediaFeatures([]);

    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => Boolean(window.__dashboardTest));
    await showApp();
    await page.$eval('#card-quick-training', el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.screenshot({ path: path.join(root, 'artifacts/dashboard-training-390.png') });
    await page.$eval('#streak-btn-mobile', el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
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
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => Boolean(window.__dashboardTest));
    await showApp();
    await page.click('#dashboard-coins-btn');
    assert.equal(await page.evaluate(() => window.__dashboardTest.State.view), 'view-referrals');
    await showApp();
    await page.locator('#streak-btn').click();
    await page.waitForFunction(() => document.querySelector('#streak-modal').style.display === 'flex');
    assert.equal(await page.$eval('#streak-modal', el => el.style.display), 'flex');
    assert.deepEqual(errors, []);
    console.log('Dashboard: 16 viewport sizes, mobile reference proportions, card order, aligned streak, visible training icons, no card overlap/overflow, streak modal, coins links and practice persistence OK.');
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
