const fs = require('fs');
const PDFParser = require('pdf2json');
const pdfPath = "bloque de casos variados nuevo.pdf";
const outputPath = "variados_text_nuevo.txt";
const pdfParser = new PDFParser(null, 1);
pdfParser.on("pdfParser_dataError", errData => console.error("Error:", errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFileSync(outputPath, pdfParser.getRawTextContent());
    console.log("Extracted PDF to " + outputPath);
});
pdfParser.loadPDF(pdfPath);
