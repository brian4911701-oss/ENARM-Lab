const fs = require('fs');

const appJs = fs.readFileSync('app.js', 'utf8');
const startO = appJs.indexOf('const OFFICIAL_TEMARIO = [');
const endO = appJs.indexOf('];', startO) + 2;
const listPart = appJs.substring(startO + 'const OFFICIAL_TEMARIO = '.length, endO);

// Extract strings manually to avoid JSON/eval issues
const matches = listPart.match(/"(.*?)"/g);
if (!matches) {
    console.log('No matches found for OFFICIAL_TEMARIO');
    process.exit(1);
}

const topics = matches.map(m => m.replace(/"/g, ''));
const counts = {};
const dups = [];

topics.forEach(t => {
    counts[t] = (counts[t] || 0) + 1;
    if (counts[t] === 2) dups.push(t);
});

console.log('Duplicates in OFFICIAL_TEMARIO:', dups.length);
dups.forEach(d => console.log(' - ' + d));

// Check mapping for these duplicates
const startM = appJs.indexOf('const TEMARIO_MAPPING = {');
const endM = appJs.lastIndexOf('};') + 2;

// We really need to fix the generate_temario_data.js script to avoid this in the first place.
