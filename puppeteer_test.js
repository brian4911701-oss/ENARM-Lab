const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') console.log('ERROR:', msg.text());
        else console.log('LOG:', msg.text());
    });
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    page.on('response', response => {
        if (!response.ok()) console.log('NET ERROR:', response.url(), response.status());
    });

    await page.goto(`file:${path.join(__dirname, 'index.html')}`);

    // Attempt clicking
    await page.evaluate(() => {
        try {
            console.log("Ready state reached. Attempting to click btn-start-final-exam");
            const btn = document.getElementById('btn-start-final-exam');
            if (btn) {
                // Select first spec
                const specItems = document.querySelectorAll('.spec-item');
                if (specItems.length > 0) specItems[0].click();

                // Override alert and console
                window.alert = (msg) => console.log('ALERT:', msg);
                btn.click();
            } else {
                console.error("Button btn-start-final-exam not found");
            }
        } catch (e) {
            console.error('EVAL ERROR: ' + e.message);
        }
    });

    await browser.close();
})();
