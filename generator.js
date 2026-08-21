const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

// INSTRUCCIONES:
// 1. Pega tu API KEY de Google Gemini (Google AI Studio) aquí abajo.
const API_KEY = "AIzaSyBjBXxzKlnAEjqFtcYZdIYSJHS9YWFA-1I";

// 2. Ejecuta este script desde la terminal usando: node generator.js

// CONFIGURACIÓN:
const MODEL_NAME = "gemini-2.5-flash"; // Es rápido, barato y de contexto amplio.
const CASOS_POR_TEMA = 3; // Cuántos casos crear por cada tema.
const COOLDOWN_MS = 25000; // 25 segundos de pausa entre peticiones para no saturar.

// Diccionario de temas (Tomado de tu app.js)
const TEMARIO_MAPPING = {
    // Medicina Interna (mi)
    "Cardiología": "mi",
    "Neumología": "mi",
    "Gastroenterología": "mi",
    "Endocrinología": "mi",
    "Nefrología": "mi",
    "Neurología": "mi",
    "Infectología": "mi",
    "Reumatología": "mi",
    "Hematología": "mi",
    "Dermatología": "mi",
    "Psiquiatría": "mi",
    "Geriatría": "mi",
    // Pediatría (ped)
    "Neonatología": "ped",
    "Crecimiento y Desarrollo": "ped",
    "Nutrición Pediátrica": "ped",
    "Infectología Pediátrica": "ped",
    "Respiratorio Pediátrico": "ped",
    "Gastroenterología Pediátrica": "ped",
    "Neurología Pediátrica": "ped",
    "Hemato-Oncología Pediátrica": "ped",
    "Nefrología Pediátrica": "ped",
    "Endocrinología Pediátrica": "ped",
    "Cardiología Pediátrica": "ped",
    "Cirugía Pediátrica": "ped",
    "Urgencias Pediátricas": "ped",
    // Ginecología y Obstetricia (gyo)
    "Control Prenatal": "gyo",
    "Hemorragias del Embarazo": "gyo",
    "Enfermedad Hipertensiva del Embarazo": "gyo",
    "Infecciones en el Embarazo": "gyo",
    "Patología Médica del Embarazo": "gyo",
    "Trabajo de Parto y Puerperio": "gyo",
    "Planificación Familiar": "gyo",
    "Infecciones Ginecológicas": "gyo",
    "Patología Benigna de Mama y Ovario": "gyo",
    "Oncología Ginecológica": "gyo",
    "Endocrinología Ginecológica": "gyo",
    "Uroginecología": "gyo",
    // Cirugía General (cir)
    "Patología Biliar": "cir",
    "Apendicitis y Abdomen Agudo": "cir",
    "Hernias de la Pared Abdominal": "cir",
    "Oclusión Intestinal": "cir",
    "Patología Anorrectal": "cir",
    "Trauma Abdominal y Torácico": "cir",
    "Enfermedad Diverticular": "cir",
    "Quemaduras y Manejo de Heridas": "cir",
    "Oftalmología (Cirugía)": "cir",
    "Otorrinolaringología (Cirugía)": "cir",
    "Traumatología y Ortopedia": "cir",
    "Urología": "cir",
    // Salud Pública (sp)
    "Epidemiología": "sp",
    "Bioestadística": "sp",
    "Medicina Preventiva": "sp",
    "Normas Oficiales Mexicanas (NOM)": "sp",
    "Administración en Salud": "sp",
    // Urgencias y Toxicología (urg)
    "Soporte Vital (BLS/ACLS)": "urg",
    "Toxicología": "urg",
    "Choque y Sepsis": "urg",
    "Urgencias Metabólicas": "urg",
    "Urgencias Cardiovasculares": "urg",
    "Urgencias Respiratorias": "urg",
    "Urgencias Neurológicas": "urg",
    "Urgencias Ambientales y Mordeduras": "urg"
};

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_PROMPT = `
Eres un especialista médico dedicado a evaluar y construir reactivos para el Examen Nacional de Aspirantes a Residencias Médicas (ENARM) en México.
Tu tarea es generar casos clínicos INÉDITOS y desafiantes de alta fidelidad.

REGLAS ESTRICTAS MEDICINA:
1. Toda decisión de diagnóstico o tratamiento DEBE estar basada en la Nomra Oficial Mexicana (NOM) o en la Guía de Práctica Clínica (GPC).
2. Si se trata de tratamiento de primera elección, utiliza siempre el medicamento validado en primer nivel por GPC.

REGLAS DE FORMATO Y PROGRAMACIÓN:
1. Debes generar exactamente un ARRAY JSON válido, sin Markdown, etiquetas extra, ni explicaciones adicionales. Sólo el JSON puro.
2. Cada bloque del JSON debe estructurarse SIEMPRE así:
[
  {
    "id": "UN_ID_ÚNICO_POR_EJEMPLO_cardio_1",
    "case": "Paciente masculino de 55 años que acude a urgencias por... Expresa signos vitales reales y laboratorios.",
    "question": "¿Cuál es el tratamiento de primera línea según la GPC?",
    "options": [
      "Opción 1",
      "Opción 2",
      "Opción 3",
      "Opción 4"
    ],
    "answerIndex": 2, 
    "explanation": "La opción C es correcta porque... (Explica por qué es correcta según GPC). Además, la A es incorrecta porque... y la B también porque...",
    "specialty": "mi", 
    "tema": "Cardiología"
  }
]
No olvides usar comillas dobles "" para claves y valores, no uses comillas simples ni comillas invertidas.
`;

const delay = ms => new Promise(res => setTimeout(res, ms));

async function generarCasosPorTema(tema, subtema) {
    const prompt = `Por favor, genera ${CASOS_POR_TEMA} casos clínicos nivel ENARM (difíciles) usando el tema: "${tema}" y su área general "${subtema}".
Asegúrate de que tus salidas sean puramente el arreglo de objetos JSON con sus 4 opciones y su explanation en español detallada recomendando y referenciando GPC.`;

    try {
        console.log(`[+] Pidiendo casos para: ${tema}...`);
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.3,
            }
        });

        let outputTexto = response.text;

        // Limpiar output si Gemini metió etiquetas Markdown 
        outputTexto = outputTexto.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();

        const jsonParseado = JSON.parse(outputTexto);
        return jsonParseado;

    } catch (error) {
        console.error(`[-] Error con el tema ${tema}:`, error.message);
        return null; // En caso de fallo devolvemos nulo para continuar con el siguiente
    }
}

async function procesarTemarioCompleto() {
    console.log("=== INICIANDO EXTRACCIÓN SINTÉTICA MASIVA ===");
    console.log(`Modelo: ${MODEL_NAME}`);
    console.log(`Casos por Tema: ${CASOS_POR_TEMA}`);

    let bancoTotal = [];
    const temasArray = Object.keys(TEMARIO_MAPPING);

    // Si ya existe un archivo de respaldo, lo podemos cargar para reanudar (opcional).
    // Por simplicidad, este script creará un array nuevo cada corrida y lo sobreescribirá al archivo `nuevos_casos_generados.json`.

    for (const [index, tema] of temasArray.entries()) {
        const specialtyTag = TEMARIO_MAPPING[tema];
        console.log(`\nProgreso: [${index + 1}/${temasArray.length}] -> ${tema} (${specialtyTag})`);

        const casosNuevos = await generarCasosPorTema(tema, specialtyTag);

        if (casosNuevos && Array.isArray(casosNuevos)) {
            // Reemplazar la specialty y el tema por si la IA se equívoco 
            casosNuevos.forEach(c => {
                c.specialty = specialtyTag;
                c.tema = tema;
            });
            bancoTotal.push(...casosNuevos);

            // Guardado progresivo al archivo.
            fs.writeFileSync("nuevos_casos_generados.json", JSON.stringify(bancoTotal, null, 2), "utf8");
            console.log(`    -> ¡Guardados ${casosNuevos.length} casos! Total Banco hasta ahora: ${bancoTotal.length}`);
        } else {
            console.log(`    -> No se obtuvieron casos por error de parseo. Saltando al siguiente.`);
        }

        if (index < temasArray.length - 1) {
            console.log(`    -> Enfriando API por ${COOLDOWN_MS / 1000} segundos...`);
            await delay(COOLDOWN_MS);
        }
    }

    console.log(`\n=== PROCESO FINALIZADO. SE GENERARON ${bancoTotal.length} CASOS CON ÉXITO ===`);
    console.log("Tus casos están guardados en nuevos_casos_generados.json.");
}

// Ejecución inicial:
if (API_KEY === "TU_API_KEY_AQUI") {
    console.error("ERROR: Debes colocar tu API_KEY dentro del archivo generator.js en la línea 5 antes de ejecutar.");
} else {
    procesarTemarioCompleto();
}
