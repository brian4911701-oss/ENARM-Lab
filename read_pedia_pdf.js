const fs = require('fs');
const PDFParser = require('pdf2json');
const pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFileSync('pedia_text.txt', pdfParser.getRawTextContent());
    console.log("Extracted PDF to pedia_text.txt");
});

pdfParser.loadPDF("casos clinicos pedia.pdf");
