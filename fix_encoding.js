const fs = require('fs');
let content = fs.readFileSync('app.js', {encoding: 'latin1'});

// Reinterpretar el archivo en latin1 y convertir a UTF-8 correctamente
// El problema: el archivo tiene texto UTF-8 pero está siendo leído como binary
// Necesitamos detectar si el archivo tiene mojibake

// Verificar si hay mojibake
const hasMojibake = content.includes('Ã­') || content.includes('Ã¡') || content.includes('Ã³') || content.includes('Ã©');
console.log('Has mojibake (read as latin1):', hasMojibake);

// Leer como buffer y ver el encoding real
const buf = fs.readFileSync('app.js');
const asUtf8 = buf.toString('utf8');
const preeclIdx = asUtf8.indexOf('Preeclampsia');
if (preeclIdx >= 0) {
    console.log('As UTF-8:', asUtf8.substring(preeclIdx, preeclIdx + 80));
}

// Los bytes reales del texto Patología
const testStr = 'Patología'; // UTF-8: 50 61 74 6F 6C 6F 67 C3 AD 61
const testBuf = Buffer.from(testStr, 'utf8');
console.log('Correct UTF-8 bytes for Patología:', [...testBuf]);

// ¿Están esos bytes en el archivo?
const found = buf.includes(testBuf);
console.log('Correct UTF-8 found in file:', found);

// Buscar versión mojibake en UTF-8 raw
const mojibake = 'PatologÃ­a';
const mojibakeBuf = Buffer.from(mojibake, 'latin1');
console.log('Mojibake bytes:', [...mojibakeBuf]);
const foundMoji = buf.includes(mojibakeBuf);
console.log('Mojibake found in file:', foundMoji);
