const fs = require('fs');
const PDFParser = require('pdf2json');

const pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFileSync('temario_out.txt', pdfParser.getRawTextContent());
    console.log("Extracted temario completo.pdf successfully!");
});

pdfParser.loadPDF("temario completo.pdf");
