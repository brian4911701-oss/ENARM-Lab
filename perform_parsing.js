const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

const inputFile = 'variados_text_nuevo.txt';
const outputFile = 'parsed_variados_nuevo.json';

const SYSTEM_PROMPT = `
Eres un experto médico en el ENARM. Tu tarea es extraer casos clínicos de un texto extraído de un PDF que puede estar desordenado.
Debes identificar:
1. El tema y subtema.
2. El texto del caso clínico.
3. Las preguntas asociadas (cada caso puede tener 1 o más preguntas).
4. Las opciones (A, B, C, D).
5. Cuál es la opción correcta (indicada usualmente con un asterisco *).
6. La retroalimentación/explicación.
7. La dificultad (Baja, Media, Alta, Muy Alta).

Debes devolver un ARRAY de objetos con este formato:
{
  "specialty": "mi" | "ped" | "gyo" | "cir" | "urg" | "sp",
  "tema": "Nombre del Tema",
  "subtema": "Nombre del Subtema",
  "difficulty": "baja" | "media" | "alta" | "muy-alta",
  "case": "Texto completo del caso",
  "questions": [
    {
      "question": "¿Pregunta?",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "answerIndex": 0,
      "explanation": "Explicación detallada...",
      "gpcReference": ""
    }
  ]
}

REGLAS:
- Mapea las especialidades así: Medicina Interna -> mi, Pediatría -> ped, Ginecología y Obstetricia -> gyo, Cirugía -> cir, Urgencias -> urg, Salud Pública -> sp.
- Si el texto está muy desordenado, usa tu conocimiento médico para reconstruir el sentido lógico del caso y las preguntas.
- No inventes casos, solo extrae los que están en el texto.
- Devuelve SOLO el JSON en un bloque de código markdown o texto plano.
`;

async function processChunk(text) {
    const prompt = `Extrae los casos clínicos contenidos en el siguiente texto:\n\n${text}`;

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            systemInstruction: SYSTEM_PROMPT
        });

        let responseText = result.response.text();
        // Limpiar backticks si existen
        responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

        // Intentar encontrar el primer [ y el último ] si hay texto extra
        const startIdx = responseText.indexOf('[');
        const endIdx = responseText.lastIndexOf(']');
        if (startIdx !== -1 && endIdx !== -1) {
            responseText = responseText.substring(startIdx, endIdx + 1);
        }

        return JSON.parse(responseText);
    } catch (error) {
        console.error("Error processing chunk:", error);
        return [];
    }
}

async function main() {
    console.log("Reading input file...");
    const fullText = fs.readFileSync(inputFile, 'utf8');

    // El texto tiene unos 350k chars, dividiremos en trozos de 10-15 casos cada uno.
    // O simplemente por tamaño de chars.
    const chunkSize = 20000;
    const chunks = [];
    for (let i = 0; i < fullText.length; i += chunkSize) {
        chunks.push(fullText.substring(i, i + chunkSize));
    }

    console.log(`Processing ${chunks.length} chunks...`);
    let allCases = [];
    for (let i = 0; i < chunks.length; i++) {
        process.stdout.write(`Processing chunk ${i + 1}/${chunks.length}... `);
        const chunkCases = await processChunk(chunks[i]);
        if (Array.isArray(chunkCases)) {
            allCases = allCases.concat(chunkCases);
            console.log(`Done! Found ${chunkCases.length} cases.`);
        } else {
            console.log("Failed or no cases found.");
        }
        // Pequeña pausa para evitar rate limits
        await new Promise(r => setTimeout(r, 1000));
    }

    fs.writeFileSync(outputFile, JSON.stringify(allCases, null, 2));
    console.log(`\nFinished! Total cases extracted: ${allCases.length}`);
}

main().catch(err => console.error(err));
