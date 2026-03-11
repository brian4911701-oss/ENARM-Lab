const fs = require('fs');

const appJs = fs.readFileSync('app.js', 'utf8');
const startO = appJs.indexOf('const OFFICIAL_TEMARIO = [');
const endO = appJs.indexOf('];', startO) + 2;
const listPart = appJs.substring(startO, endO);

const items = [];
const regex = /"(.*?)"/g;
let m;
while ((m = regex.exec(listPart)) !== null) {
    items.push(m[1]);
}

const cleaning = {};
items.forEach(t => {
    let base = t.replace(/\s*\(.*?\)/g, '').trim().toLowerCase();
    if (!cleaning[base]) cleaning[base] = [];
    cleaning[base].push(t);
});

console.log('Potentially confusing similar topics:');
for (const [base, variants] of Object.entries(cleaning)) {
    if (variants.length > 1) {
        console.log(`- Base: "${base}"`);
        variants.forEach(v => console.log(`    * ${v}`));
    }
}
