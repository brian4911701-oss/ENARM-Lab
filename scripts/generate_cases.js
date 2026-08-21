const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
const fs = require('fs');

// ============================================================================
// CONFIGURACIÓN PRINCIPAL
// ============================================================================
// Reemplaza por el modelo exacto de Gemini cuando esté disponible en la API 
// (actualmente los modelos más potentes en producción suelen nombrarse ej: gemini-2.5-pro o gemini-2.0-flash)
const MODEL_NAME = process.env.MODEL_NAME || "gemini-flash-latest";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error("❌ ERROR: No se encontró GEMINI_API_KEY en el archivo .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const TARGET_CASES_PER_TOPIC = 10; // Total: ~150 temas * 10 = 1500 casos
const DELAY_BETWEEN_CASES_MS = 15000; // 15s de cooldown entre caso para asegurar menos de 15 RPM

const OUTPUT_FILE = path.join(__dirname, '..', 'generated_questions.json');

// Mapeo general de especialidades para facilitar a la IA
const TEMA_A_ESPECIALIDAD = {
    "Cardiología": "mi", "Endocrinología": "mi", "Neumología": "mi", "Neurología": "mi", "Infectología": "mi", "Dermatología": "mi", "Psiquiatría": "mi", "Geriatría": "mi",
    "Oncología Ginecología": "gyo", "Mama": "gyo", "Embarazo": "gyo", "Obstétrica": "gyo", "Puerperio": "gyo",
    "Pediatría": "ped", "Neonatal": "ped", "Niño": "ped",
    "Cirugía": "cir", "Abdomen": "cir", "Hernias": "cir", "Apendicitis": "cir",
    "Salud Pública": "sp", "Epidemiología": "sp",
    "Urgencias": "urg", "ATLS": "urg", "Trauma": "urg", "Toxicología": "urg", "Quemaduras": "urg"
};

// Algunos temas críticos del temario ENARMlab
const TEMARIO = [
    "Introducción: Ciclo genital, Esterilidad y Anticonceptivos", "Turner, Morris, Rokitansky", "Amenorreas Primarias y Secundarias",
    "Origen no anatómico: SOP", "Endometriosis", "Hemorragia Uterina Anormal", "Menopausia y Climaterio", "Miomatosis",
    "Tamizaje CACU, CaVa, Vagina y Vulva", "Patología Mamaria: Benigna y Cáncer de Mama",
    "Vaginitis y Vaginosis", "EPI e Infecciones de Transmisión Sexual",
    "Cambios Fisiológicos en el Embarazo y Control Prenatal", "Aborto, Ectópico, Mola", "Placenta Previa y Desprendimiento",
    "Diabetes Gestacional", "Preeclampsia / Eclampsia", "Isoinmunización",
    "Trabajo de Parto y Mecanismos del Parto", "Sepsis Puerperal", "Hemorragia Obstétrica",
    "Reanimación Neonatal", "Hijo de madre diabética", "Sepsis Neonatal", "Patología Respiratoria Neonatal (Membrana hialina, TTRN, SAM)",
    "Ictericias Neonatales", "Tamiz Metabólico y Auditivo", "Crecimiento y Desarrollo, Hitos",
    "Esquema Nacional de Vacunación", "Enfermedad Diarreica Aguda y Planes de Hidratación",
    "Bronquiolitis, Laringotraqueítis", "Neumonías Pediátricas", "Asma Pediátrica",
    "Enfermedades Exantemáticas",
    "Cardiopatías Congénitas Cianógenas y Acianógenas", "Onco-Hematología Pediátrica (Leucemias, Linfomas)",
    "Apendicitis Aguda", "Patología de Vesícula y Vías Biliares", "Pancreatitis Aguda",
    "ERGE y Acalasia", "Ulcera péptica", "Abdomen Agudo y Oclusión Intestinal",
    "Hernias Inguinales y Crurales",
    "Litiasis Renal y Tumores", "Hiperplasia Prostática y Cáncer de Próstata",
    "ATLS: Evaluación Inicial y Manejo de Vía Aérea", "ATLS: Trauma de Tórax y Abdomen",
    "Toxicología, Intoxicaciones y Antídotos", "Mordeduras (Arañas, Serpientes) y Picaduras (Alacrán)",
    "Glaucoma y Catarata", "Retinopatías", "Ojo Rojo",
    "Trauma: Fracturas, Síndrome Compartimental",
    "Tuberculosis", "VIH / SIDA", "Dengue, Zika, Chikungunya", "Rickettsia",
    "Cardiología: Insuficiencia Cardíaca", "Hipertensión Arterial Sistémica", "Endocarditis y Pericarditis",
    "Enfermedad Vascular Cerebral (EVC)", "Parkinson y Alzheimer", "Cefaleas (Migraña, Tensional)", "Crisis Convulsivas y Epilepsia",
    "Enfermedades Tiroideas (Hiper/Hipo/Cáncer)", "Síndrome Metabólico y Dislipidemias",
    "Diabetes Mellitus: Diagnóstico y Tratamiento", "Diabetes: Cetoacidosis / Estado Hiperosmolar"
];

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const guessSpecialty = (tema) => {
    for (const [key, spec] of Object.entries(TEMA_A_ESPECIALIDAD)) {
        if (tema.toLowerCase().includes(key.toLowerCase())) return spec;
    }
    return "mi"; // Default a medicina interna
};

// ============================================================================
// SISTEMA DE RETRY ANTI-BLOQUEO (Fundamental para capas gratuitas y previews)
// ============================================================================
async function generateWithRetry(prompt, maxRetries = 5, initialDelay = 15000) {
    let delay = initialDelay;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error(`\n    [API Error] Intento ${attempt}/${maxRetries} falló: ${error.message}`);
            if (attempt === maxRetries) throw error;

            console.log(`    ⏳ Pausando ${delay / 1000}s antes de reintentar debido al límite de la API Gemini...`);
            await wait(delay);
            delay *= 2; // Exponential backoff (15s, 30s, 60s...)
        }
    }
}

// ============================================================================
// SYSTEM PROMPTS (GEMINI 3.0 / 3.1)
// ============================================================================
// Como Gemini 3.1 es sumamente capaz e inteligente, le daremos instrucciones muy estrictas.

const PROMPT_GENERADOR = `
Eres un Médico Especialista Mexicano experto en el ENARM (Examen Nacional de Aspirantes a Residencias Médicas).
Tu tarea es escribir un CASO CLÍNICO SERIADO nivel experto. 

TEMA: "{tema}"
NIVEL DE DIFICULTAD ESPERADO: {dificultad}

INSTRUCCIONES ESTRICTAS:
1. Crea un caso clínico INÉDITO, realista, con signos vitales y hallazgos laboratoriales comunes en México.
2. Basado EXCLUSIVAMENTE en las Guías de Práctica Clínica (GPC) mexicanas recientes o NOMs correspondientes al tema.
3. El caso debe tener entre 2 y 3 preguntas encadenadas (seriación) sobre diagnóstico, estudio confirmatorio, y tratamiento / complicación.
4. Cada pregunta debe tener exactamente 4 opciones de respuesta (A, B, C, D) concisas. SOLO UNA correcta.
5. La "explanation" debe ser detallada, justificando la respuesta correcta y descartando los distractores usando "perlas" ENARM.
6. El "gpcReference" debe mencionar claramente la guía usada (ej. "GPC IMSS-162-09 Diagnóstico de...").

REGLA DE ORO DE GEMINI 3.1: Responde ÚNICAMENTE en JSON usando este Schema. No agregues markdown ni texto antes o después.
[
    {
      "question": "Pregunta 1...",
      "options": ["Opcion A", "Opcion B", "Opcion C", "Opcion D"],
      "answerIndex": 0,
      "explanation": "La respuesta es A porque..."
    },
    ...
]
`;

const PROMPT_SUPERVISOR = `
Eres el JEFE DE ENSEÑANZA Y REVISIÓN ENARM (Gemini 3.1 Supervisor Mode), conocido por ser estricto y perfeccionista.

Se acaba de generar el siguiente caso clínico seriado para el tema: "{tema}" con la GPC: "{gpcReference}".

REVISIÓN CRÍTICA DE ALUCINACIONES:
1. Lee detenidamente el texto del caso y cada pregunta.
2. ¿Los datos de laboratorio están fuera de rango o son absurdos?
3. ¿El tratamiento mencionado en la respuesta correcta ES REALMENTE la primera línea según la GPC mexicana vigente? (¡No guías americanas AHA/ADA a menos que GPC no exista!).
4. ¿Hay contradicciones entre la "explanation" y la "answerIndex"?

TU TAREA:
Realiza las correcciones de datos directamente y reescribe cualquier cosa que sea falsa, alucinación de la IA o contraria a la norma de México.
Mejora el lenguaje médico si es necesario (usa abreviaturas típicas: SDG, TA, FC, FR, BH, QS).

DEBES ENVIAR EL JSON COMPLETO Y CORREGIDO QUE CUMPLA EXACTAMENTE ESTE SCHEMA:
{
  "specialty": "{specialty}",
  "tema": "{tema}",
  "difficulty": "{dificultad}",
  "gpcReference": "Reemplaza con la Guía Correcta",
  "case": "Texto del caso (corregido si aplica)",
  "questions": [
     // Arreglos de preguntas corregidas (mantén la estructura original)
  ]
}
Responde SOLO CON EL JSON VÁLIDO.
`;

const cleanJSON = (text) => {
    let raw = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(raw);
};

// ============================================================================
// FLUJO DE EJECUCIÓN
// ============================================================================
async function processTema(tema, i, totalGenerar) {
    const difficulties = ["media", "alta", "alta"]; // Favorecemos media y alta
    const spec = guessSpecialty(tema);
    const diff = difficulties[i % difficulties.length];

    console.log(`\n======================================================`);
    console.log(`🧠 Iniciando Caso [${i + 1}/${totalGenerar}] - Tema: ${tema}`);
    console.log(`⚙️  ESPECIALIDAD: ${spec.toUpperCase()} | DIFICULTAD: ${diff.toUpperCase()}`);

    try {
        // PASO 1: GENERACIÓN (Motor Creativo)
        console.log(`[Paso 1] 💡 Gemini Flash creando caso clínico inédito...`);
        const promptGen = PROMPT_GENERADOR
            .replace("{tema}", tema)
            .replace("{dificultad}", diff);

        const textGen = await generateWithRetry(promptGen);
        const generatedQuestions = cleanJSON(textGen);

        if (!Array.isArray(generatedQuestions)) throw new Error("Generador no devolvió Array");

        const casoBorrador = {
            specialty: spec,
            tema: tema,
            difficulty: diff,
            gpcReference: "GPC por determinar",
            case: "Paciente de la viñeta provista por json a continuación",
            questions: generatedQuestions
        };

        // PASO 2: SUPERVISOR (Control de alucinaciones y calidad GPC)
        console.log(`[Paso 2] 🕵️ Supervisor Clínico (Gemini Flash) validando apego a GPC de México...`);

        // Anti-rate-limit estricto entre peticiones: 10 segundos
        await wait(10000);

        const promptSup = PROMPT_SUPERVISOR
            .replace("{tema}", tema)
            .replace("{specialty}", spec)
            .replace("{dificultad}", diff)
            .replace("{gpcReference}", casoBorrador.gpcReference)
            + "\n\nJSON BORRADOR A REVISAR:\n" + JSON.stringify(casoBorrador, null, 2);

        const textSup = await generateWithRetry(promptSup);
        const finalCase = cleanJSON(textSup);

        // Validar que finalCase tiene questions y case
        if (!finalCase.case || !finalCase.questions || finalCase.questions.length === 0) {
            throw new Error("Estructura JSON Supervisor inválida.");
        }

        // GUARDADO PROGRESIVO
        console.log(`[EXITO] ✅ Caso de ${finalCase.questions.length} preguntas guardado.`);

        let allData = [];
        if (fs.existsSync(OUTPUT_FILE)) {
            const raw = fs.readFileSync(OUTPUT_FILE);
            if (raw.length > 0) allData = JSON.parse(raw);
        }
        allData.push(finalCase);
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allData, null, 4));

    } catch (error) {
        console.error(`❌ ERROR en el tema "${tema}": `, error.message);
    }
}

async function startAutomation() {
    console.log(`🚀 INICIANDO ENARMlab AI GENERATOR (Modo: ${MODEL_NAME})`);

    // Iteramos el temario x veces para generar casos
    for (let c = 0; c < TARGET_CASES_PER_TOPIC; c++) {
        for (let i = 0; i < TEMARIO.length; i++) {
            const tema = TEMARIO[i];
            await processTema(tema, c, TARGET_CASES_PER_TOPIC);

            console.log(`⏳ Esperando cooldown de ${DELAY_BETWEEN_CASES_MS / 1000}s para respetar límite TPM/RPM de la API...`);
            await wait(DELAY_BETWEEN_CASES_MS);
        }
    }

    console.log("\n🎯 GENERACIÓN COMPLETA. Revisa generated_questions.json");
}

startAutomation();
