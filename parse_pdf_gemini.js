const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const inputFile = 'variados_text.txt';
const outputFile = 'parsed_variados.json';

const SYSTEM_PROMPT = `
Eres un experto médico en el ENARM. Tu tarea es extraer casos clínicos de un texto extraído de un PDF que puede estar desordenado.
Debes identificar:
1. El tema y subtema.
2. El texto del caso clínico.
3. Las preguntas asociadas (cada caso puede tener 1 o más preguntas).
4. Las opciones (A, B, C, D).
5. Cuál es la opción correcta (indicada usualmente con un asterisco * o en la retroalimentación).
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
      "gpcReference": "Referencia GPC si existe"
    }
  ]
}

REGLAS:
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
        responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(responseText);
    } catch (error) {
        console.error("Error processing chunk:", error);
        return [];
    }
}

async function main() {
    const fullText = fs.readFileSync(inputFile, 'utf8');
    // Dividir en trozos de aproximadamente 40,000 caracteres para no saturar
    const chunkSize = 40000;
    const chunks = [];
    for (let i = 0; i < fullText.length; i += chunkSize) {
        chunks.push(fullText.substring(i, i + chunkSize));
    }

    let allCases = [];
    for (let i = 0; i < chunks.length; i++) {
        console.log(`Processing chunk ${i+1}/${chunks.length}...`);
        const chunkCases = await processChunk(chunks[i]);
        if (Array.isArray(chunkCases)) {
            allCases = allCases.concat(chunkCases);
        }
        // Pequeña pausa para evitar rate limits
        await new Promise(r => setTimeout(r, 2000));
    }

    fs.writeFileSync(outputFile, JSON.stringify(allCases, null, 2));
    console.log(`Finished! Total cases extracted: ${allCases.length}`);
}

main();
