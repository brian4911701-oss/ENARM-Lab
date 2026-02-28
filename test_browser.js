const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const questionsJs = fs.readFileSync('questions.js', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');

// Replace external script tags with inline scripts
let finalHtml = html.replace('<script src="questions.js"></script>', `<script>${questionsJs}</script>`);
finalHtml = finalHtml.replace('<script src="app.js"></script>', `<script>${appJs}</script>`);

const dom = new JSDOM(finalHtml, {
    url: "http://localhost/",
    runScripts: "dangerously",
    resources: "usable"
});

dom.window.console = {
    log: (...a) => console.log('LOG:', ...a),
    error: (...a) => console.error('ERROR:', ...a),
    warn: (...a) => console.warn('WARN:', ...a),
    info: (...a) => console.info('INFO:', ...a),
    trace: () => { }
};

// Wait for scripts to load and execute
setTimeout(() => {
    console.log("Ready state reached. Attempting to click btn-start-final-exam");
    try {
        const doc = dom.window.document;
        // Select one spec item to bypass the selectedSpecs check
        const specItems = doc.querySelectorAll('.spec-item');
        if (specItems.length > 0) {
            specItems[0].click();
        }

        const btn = doc.getElementById('btn-start-final-exam');
        if (btn) {
            // Also mock alert
            dom.window.alert = (msg) => console.log('ALERT:', msg);
            btn.click();
            console.log("AFTER CLICK, VIEW is:", doc.querySelector('.view.active').id);
        } else {
            console.error("Button btn-start-final-exam not found");
        }
    } catch (e) {
        console.error("Exception during interaction:", e);
    }
}, 1000);
