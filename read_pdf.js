const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('Casos clínicos primer bloque.pdf');

pdf(dataBuffer).then(function (data) {
    fs.writeFileSync('pdf_text.txt', data.text);
    console.log("Extracted text saved to pdf_text.txt");
}).catch(function (error) {
    console.error("Error parsing pdf:", error);
});
