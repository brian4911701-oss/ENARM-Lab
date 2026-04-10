const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const QUESTIONS_PATH = path.join(ROOT, "questions.js");
const REPORTS_DIR = path.join(ROOT, "reports");
const BATCH_NAME = "manual_long_batch_apr2026";

const GPC = {
  suaNoAnatomico: "IMSS-322-10, Diagnóstico y Tratamiento del Sangrado Uterino Anormal de origen no anatómico, actualización 2015; IMSS, comunicación social 2024 sobre detección y atención oportuna de sangrado uterino anormal.",
  sop: "IMSS, comunicación social 2024 sobre diagnóstico y tratamiento del ovario poliquístico; revisión mexicana 'Síndrome de ovario poliquístico, el enfoque del internista', Rev Med Inst Mex Seguro Soc.",
  endometriosis: "IMSS-090-21, Guía de Práctica Clínica: Diagnóstico y Tratamiento de Endometriosis; revisión mexicana 'Endometriosis. Base fisiopatogénica para el tratamiento', Rev Med Inst Mex Seguro Soc.",
  embarazoDm: "IMSS-320-10, Diagnóstico y Tratamiento de la Diabetes en el Embarazo, actualización 2016.",
  reanimacion: "IMSS-632-13, Diagnóstico y Tratamiento de la Asfixia Neonatal; Rev Enferm Inst Mex Seguro Soc 2025, 'Reanimación neonatal en enfermería: conocimiento y aprendizaje basado en casos'.",
  tamizGeneral: "Lineamientos y comunicación social IMSS sobre Tamiz Neonatal y Tamiz Metabólico ampliado; toma de muestra en los primeros días de vida y referencia oportuna ante resultado sospechoso.",
  hipotiroidismo: "IMSS, comunicación social 2020 sobre diagnóstico oportuno de hipotiroidismo congénito; lineamientos de tamiz metabólico neonatal en México.",
  hsc: "IMSS-715-14, Hiperplasia Suprarrenal Congénita por Deficiencia de 21 Hidroxilasa.",
  pku: "IMSS-554-12, Tratamiento dietético-nutricional del paciente pediátrico y adolescente con fenilcetonuria.",
  fq: "IMSS, comunicación social 2020 sobre tamiz neonatal ampliado y fibrosis quística; confirmación con prueba de cloruro en sudor.",
  gastricaDispepsia: "Asociación Mexicana de Gastroenterología, 2025, Recomendaciones de buena práctica clínica en el diagnóstico y tratamiento de la dispepsia funcional.",
  hpylori: "Asociación Mexicana de Gastroenterología, IV Consenso Mexicano sobre Helicobacter pylori, Rev Gastroenterol Mex 2018.",
  ulceraComplicada: "IMSS-169-09, Diagnóstico y tratamiento de úlcera péptica aguda complicada en el adulto, actualización 2015.",
  erge: "Consenso mexicano de enfermedad por reflujo gastroesofágico, Parte I y II, Rev Gastroenterol Mex 2012."
};

function cleanInline(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function normalizeTextKey(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripNumericVariants(value) {
  return normalizeTextKey(String(value || "").replace(/\b\d+(?:[.,]\d+)?\b/g, "#"));
}

function parseQuestionsArray(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]") + 1;
  if (start === -1 || end <= 0) throw new Error("No se pudo leer questions.js");
  return JSON.parse(raw.slice(start, end));
}

function writeQuestionsArray(filePath, questions) {
  const out =
    "// questions.js - Banco de reactivos para ENARMlab\n" +
    "const QUESTIONS = " +
    JSON.stringify(questions, null, 2) +
    ";\n\n" +
    "if (typeof module !== 'undefined') {\n" +
    "  module.exports = QUESTIONS;\n" +
    "}\n";
  fs.writeFileSync(filePath, out, "utf8");
}

function signatureFor(item) {
  return stripNumericVariants([item.specialty, item.tema, item.case, item.question].join(" | "));
}

function caseOpeningKey(text) {
  return stripNumericVariants(String(text || "").slice(0, 220));
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function makeCase(data) {
  const tema = cleanInline(data.tema);
  const subtema = cleanInline(data.subtema || tema);
  const specialty = cleanInline(data.specialty);
  return {
    specialty,
    case: cleanInline(data.case),
    question: cleanInline(data.question),
    options: (data.options || []).map(cleanInline),
    answerIndex: data.answerIndex,
    explanation: cleanInline(data.explanation),
    gpcReference: cleanInline(data.gpcReference),
    tema,
    temaCanonical: tema,
    subtemaCanonical: subtema,
    subtema,
    specialtyOriginal: specialty,
    temaOriginal: tema,
    subtemaOriginal: subtema,
    difficulty: cleanInline(data.difficulty || "alta")
  };
}

const NEW_CASES = [
  makeCase({
    specialty: "gyo",
    tema: "Sangrados Uterinos Anormales de Origen No Anatómico",
    subtema: "Manejo agudo",
    case: "Adolescente de 16 años, menarca a los 12, acude a urgencias por sangrado transvaginal abundante desde hace 9 días. Refiere usar 8 a 10 toallas por día, con coágulos y fatiga progresiva. Niega relaciones sexuales. A la exploración está consciente, orientada, pálida, TA 106/68 mmHg, FC 102 lpm, sin dolor abdominal intenso ni datos de irritación peritoneal. La biometría hemática reporta hemoglobina de 8.7 g/dL, plaquetas normales y prueba de embarazo negativa. El ultrasonido pélvico no muestra miomatosis ni masas anexiales.",
    question: "Con estos datos y estando hemodinámicamente estable, ¿cuál es la conducta inicial más adecuada según guías mexicanas?",
    options: [
      "Iniciar tratamiento médico para control del sangrado agudo y corregir la anemia, con seguimiento estrecho.",
      "Enviar a casa con antiinflamatorio y sin vigilancia porque es un cuadro funcional.",
      "Programar histerectomía urgente por el volumen del sangrado.",
      "Administrar antibiótico de amplio espectro como primera línea."
    ],
    answerIndex: 0,
    explanation: "En una paciente estable con prueba de embarazo negativa y sin evidencia estructural, el sangrado uterino anormal agudo de origen no anatómico se maneja primero con tratamiento médico y vigilancia. La hospitalización o medidas invasivas se reservan para inestabilidad hemodinámica, anemia grave, fracaso terapéutico o sospecha de otra causa.",
    gpcReference: GPC.suaNoAnatomico
  }),
  makeCase({
    specialty: "gyo",
    tema: "Sangrados Uterinos Anormales de Origen No Anatómico",
    subtema: "Tratamiento médico",
    case: "Mujer de 38 años, G2P2, consulta por 10 meses de menstruaciones regulares pero muy abundantes, con duración de 8 a 9 días y presencia de coágulos. Refiere cansancio, disnea al esfuerzo y limitación para trabajar los primeros días del ciclo. No desea embarazo en los próximos años y también solicita un método anticonceptivo confiable. En el ultrasonido transvaginal no se observan miomas, pólipos ni adenomiosis; la citología cervical está vigente y la prueba de embarazo es negativa. La hemoglobina es de 10.1 g/dL.",
    question: "Si se busca reducir de forma sostenida el sangrado y además brindar anticoncepción, ¿qué opción es la más adecuada?",
    options: [
      "Sistema intrauterino con levonorgestrel.",
      "Antibiótico profiláctico mensual.",
      "Solo hierro oral sin terapia para el sangrado.",
      "Lavado endometrial ambulatorio cada ciclo."
    ],
    answerIndex: 0,
    explanation: "En sangrado uterino anormal crónico de origen no anatómico, el sistema intrauterino con levonorgestrel es una de las opciones con mejor reducción del sangrado y adicionalmente ofrece anticoncepción. Es especialmente útil cuando no hay lesión estructural demostrada y la paciente desea control prolongado.",
    gpcReference: GPC.suaNoAnatomico
  }),
  makeCase({
    specialty: "gyo",
    tema: "Sangrados Uterinos Anormales de Origen No Anatómico",
    subtema: "Estudio inicial",
    case: "Mujer de 46 años con obesidad, hipertensión bien controlada y ciclos cada vez más irregulares desde hace un año. Refiere manchado intermenstrual y episodios de sangrado abundante con coágulos. Se siente mareada, ha bajado ligeramente de peso y su hemoglobina actual es de 9.9 g/dL. El ultrasonido transvaginal no demuestra miomatosis ni pólipos claramente delimitados, pero el endometrio se reporta engrosado para la etapa del ciclo. La prueba de embarazo es negativa.",
    question: "Antes de asumir que todo corresponde a un trastorno funcional, ¿qué estudio es prioritario para descartar patología endometrial asociada?",
    options: [
      "Biopsia endometrial.",
      "Radiografía simple de abdomen.",
      "Tomografía de cráneo.",
      "Densitometría ósea."
    ],
    answerIndex: 0,
    explanation: "En pacientes de 45 años o más, o con factores de riesgo endometrial, el abordaje del sangrado uterino anormal debe incluir valoración histológica cuando existe persistencia del sangrado o hallazgos sugestivos. La biopsia endometrial permite descartar hiperplasia o malignidad antes de etiquetar el cuadro como puramente no anatómico.",
    gpcReference: GPC.suaNoAnatomico
  }),
  makeCase({
    specialty: "gyo",
    tema: "Sangrados Uterinos Anormales de Origen No Anatómico",
    subtema: "Urgencias",
    case: "Mujer de 29 años, sin control ginecológico reciente, llega a urgencias por sangrado uterino muy abundante de inicio súbito desde hace 12 horas. Refiere mareo, palpitaciones y un episodio de síncope breve. A la exploración presenta piel fría, TA 84/52 mmHg, FC 128 lpm y llenado capilar lento. La cama está manchada con sangre fresca y coágulos. Aún no se cuenta con prueba de embarazo ni estudios de laboratorio.",
    question: "¿Cuál debe ser la prioridad inmediata en esta paciente?",
    options: [
      "Estabilización hemodinámica, acceso venoso, estudios urgentes y manejo intrahospitalario del sangrado.",
      "Esperar la terminación espontánea del episodio antes de iniciar líquidos.",
      "Enviar a consulta externa con hierro y reposo absoluto.",
      "Indicar solo antiinflamatorio oral y anticoncepción de barrera."
    ],
    answerIndex: 0,
    explanation: "La inestabilidad hemodinámica cambia por completo la prioridad: primero debe reanimarse, cuantificar pérdidas, descartar embarazo y activar manejo hospitalario. Ninguna estrategia ambulatoria es apropiada en una paciente con hipotensión, taquicardia y probable choque hipovolémico por sangrado uterino agudo.",
    gpcReference: GPC.suaNoAnatomico
  }),
  makeCase({
    specialty: "gyo",
    tema: "Sangrados Uterinos de Origen Desconocido",
    subtema: "SOP",
    case: "Mujer de 23 años consulta por reglas cada 2 a 4 meses desde la adolescencia, aumento de peso, acné inflamatorio y crecimiento progresivo de vello en mentón y línea media abdominal. Refiere que busca embarazo desde hace un año sin éxito. A la exploración tiene IMC de 33 kg/m2, acantosis nigricans en cuello y Ferriman-Gallwey elevado. La prueba de embarazo es negativa. El perfil tiroideo y la prolactina son normales; el ultrasonido informa ovarios con múltiples folículos periféricos.",
    question: "¿Qué diagnóstico integra mejor el cuadro clínico y cuál criterio diagnóstico lo respalda?",
    options: [
      "Síndrome de ovario poliquístico por cumplir al menos dos criterios de Rotterdam.",
      "Insuficiencia ovárica primaria por tener amenorrea prolongada.",
      "Endometriosis profunda por la infertilidad aislada.",
      "Miomatosis uterina por la irregularidad menstrual."
    ],
    answerIndex: 0,
    explanation: "La combinación de oligoovulación, hiperandrogenismo clínico y morfología ovárica compatible sustenta el diagnóstico de síndrome de ovario poliquístico con criterios de Rotterdam, una vez descartadas otras causas endocrinas. El cuadro también obliga a evaluar riesgo metabólico asociado.",
    gpcReference: GPC.sop
  }),
  makeCase({
    specialty: "gyo",
    tema: "Sangrados Uterinos de Origen Desconocido",
    subtema: "SOP",
    case: "Adolescente de 19 años, tres años después de la menarca, consulta por menstruaciones muy espaciadas, acné persistente y aumento progresivo de peso. Niega deseo gestacional. Tiene IMC de 31 kg/m2, circunferencia abdominal elevada y refiere ronquidos y somnolencia diurna. La glucosa en ayuno está en límite alto y la prueba de embarazo es negativa. No presenta datos de virilización rápida ni galactorrea.",
    question: "Si el objetivo principal es regular el ciclo y mejorar el hiperandrogenismo, ¿cuál es la mejor estrategia inicial?",
    options: [
      "Modificación intensiva del estilo de vida y anticonceptivo hormonal combinado si no hay contraindicaciones.",
      "Histerectomía subtotal por la irregularidad menstrual.",
      "Antibiótico tópico y egreso sin seguimiento metabólico.",
      "Legrado uterino como tratamiento definitivo."
    ],
    answerIndex: 0,
    explanation: "En pacientes con sospecha de SOP que no buscan embarazo, el manejo inicial combina cambios en estilo de vida con terapia hormonal combinada para regular sangrado y mejorar manifestaciones hiperandrogénicas, además de vigilancia metabólica. Las opciones invasivas no son de primera línea.",
    gpcReference: GPC.sop
  }),
  makeCase({
    specialty: "gyo",
    tema: "Sangrados Uterinos de Origen Desconocido",
    subtema: "Endometriosis",
    case: "Mujer de 31 años con dismenorrea incapacitante desde hace varios años, dolor pélvico cíclico que inicia días antes de la menstruación y dispareunia profunda. Refiere además dificultad para embarazarse desde hace 18 meses. Ha acudido en múltiples ocasiones a consulta de primer nivel y recibió analgésicos con alivio parcial. En la exploración pélvica se documenta dolor a la movilización uterina y nodularidad dolorosa en el fondo de saco posterior, sin fiebre ni leucocitosis.",
    question: "¿Cuál es el diagnóstico más probable y cuál es el método clásico de confirmación definitiva?",
    options: [
      "Endometriosis; laparoscopia con visualización directa y confirmación histológica cuando está indicada.",
      "Enfermedad pélvica inflamatoria aguda; cultivo faríngeo.",
      "Miomatosis uterina; radiografía de tórax.",
      "Apendicitis crónica; amilasa sérica."
    ],
    answerIndex: 0,
    explanation: "El dolor pélvico cíclico, la dispareunia profunda y la infertilidad orientan fuertemente a endometriosis. Aunque el diagnóstico clínico ha cobrado relevancia, la laparoscopia con confirmación histológica sigue siendo el método clásico de certeza en casos seleccionados.",
    gpcReference: GPC.endometriosis
  }),
  makeCase({
    specialty: "gyo",
    tema: "Sangrados Uterinos de Origen Desconocido",
    subtema: "Coagulopatías",
    case: "Adolescente de 17 años con sangrado menstrual muy abundante desde la menarca. Refiere cambiar toallas cada hora durante los primeros días, presentar epistaxis frecuentes, moretones con traumatismos mínimos y antecedente materno de sangrados prolongados tras procedimientos dentales. La biometría hemática muestra anemia ferropénica moderada. El ultrasonido pélvico es normal y la prueba de embarazo es negativa.",
    question: "¿Qué etiología debe sospecharse con mayor fuerza y orienta el abordaje del sangrado?",
    options: [
      "Trastorno de la hemostasia, particularmente enfermedad de von Willebrand u otra coagulopatía.",
      "Embarazo ectópico roto.",
      "Torsión ovárica intermitente.",
      "Miomatosis submucosa múltiple."
    ],
    answerIndex: 0,
    explanation: "Cuando el sangrado abundante inicia desde la menarca y se acompaña de epistaxis, equimosis fáciles y antecedente familiar, una coagulopatía debe buscarse activamente. Reconocerla modifica la estrategia terapéutica y evita estudios o procedimientos innecesarios.",
    gpcReference: GPC.suaNoAnatomico
  }),
  makeCase({
    specialty: "gyo",
    tema: "Patología del Embarazo",
    subtema: "Diabetes Mellitus Gestacional",
    case: "Mujer de 29 años, G3P1A1, con IMC pregestacional de 32 kg/m2 y antecedente de recién nacido macrosómico, acude a las 26 semanas para su prueba de tolerancia oral a la glucosa. Los resultados reportan: ayuno 94 mg/dL, una hora 184 mg/dL y dos horas 149 mg/dL. Refiere sentirse bien y no ha presentado síntomas de hiperglucemia. La presión arterial es normal y el embarazo cursa sin sangrado ni contracciones.",
    question: "¿Cómo deben interpretarse estos resultados según la guía mexicana de diabetes en el embarazo?",
    options: [
      "Son diagnósticos de diabetes mellitus gestacional porque basta con un valor alterado en el esquema de un paso.",
      "No son diagnósticos porque se requieren tres valores alterados.",
      "Corresponden a diabetes pregestacional obligada.",
      "Deben repetirse solo en el posparto porque son normales durante el embarazo."
    ],
    answerIndex: 0,
    explanation: "La guía IMSS actualizada adopta criterios diagnósticos en los que un solo valor alterado en la prueba de carga puede establecer diabetes gestacional. La paciente, además, tiene factores de riesgo relevantes que refuerzan la necesidad de intervención temprana.",
    gpcReference: GPC.embarazoDm
  }),
  makeCase({
    specialty: "gyo",
    tema: "Patología del Embarazo",
    subtema: "Diabetes Mellitus Gestacional",
    case: "Gestante de 34 años en la semana 30 con diagnóstico reciente de diabetes gestacional. Lleva 2 semanas de terapia médica nutricional, plan de ejercicio y automonitoreo. Aporta registro con glucosas en ayuno entre 101 y 110 mg/dL y posprandiales de 1 hora entre 155 y 172 mg/dL pese a adecuada adherencia dietética. El ultrasonido muestra feto único con percentil 82 de crecimiento y líquido amniótico normal.",
    question: "Ante persistencia de metas glucémicas fuera de rango, ¿cuál es el siguiente paso más adecuado?",
    options: [
      "Iniciar tratamiento farmacológico, de preferencia con insulina, y continuar vigilancia materno-fetal.",
      "Suspender dieta y esperar al parto para tratar.",
      "Indicar únicamente antibiótico oral.",
      "Finalizar el embarazo de inmediato por cesárea."
    ],
    answerIndex: 0,
    explanation: "Si la terapia no farmacológica fracasa para alcanzar metas glucémicas, la insulina es la opción con mayor respaldo en la guía mexicana. El objetivo es disminuir complicaciones maternas y fetales sin precipitar el nacimiento si no hay otra indicación obstétrica.",
    gpcReference: GPC.embarazoDm
  }),
  makeCase({
    specialty: "gyo",
    tema: "Patología del Embarazo",
    subtema: "Diabetes Mellitus Gestacional",
    case: "Mujer de 35 años, embarazo de 10 semanas, antecedente de diabetes gestacional en el embarazo previo, obesidad grado I y síndrome de ovario poliquístico. Acude a primera consulta prenatal en aparente buen estado general, sin poliuria ni polidipsia. Pregunta si su prueba de detección para diabetes debe esperar hasta el segundo trimestre porque así se la realizaron en el embarazo anterior.",
    question: "¿Cuál es la recomendación más adecuada en esta paciente de alto riesgo?",
    options: [
      "Tamizaje desde la primera consulta prenatal y repetir en semanas 24 a 28 si el estudio inicial es normal.",
      "Esperar siempre hasta después de la semana 36.",
      "No realizar tamizaje porque ya tuvo un embarazo previo.",
      "Solicitar solo hemoglobina y diferir la glucosa hasta el posparto."
    ],
    answerIndex: 0,
    explanation: "Las embarazadas con factores de alto riesgo deben ser evaluadas tempranamente desde la primera visita prenatal para detectar diabetes preexistente o gestacional temprana. Si el primer estudio es normal, la valoración se repite en el periodo habitual de 24 a 28 semanas.",
    gpcReference: GPC.embarazoDm
  }),
  makeCase({
    specialty: "gyo",
    tema: "Patología del Embarazo",
    subtema: "Diabetes Mellitus Gestacional",
    case: "Primigesta de 27 años, 28 semanas de gestación, acaba de recibir diagnóstico de diabetes gestacional. Está preocupada porque piensa que lo más importante será iniciar medicamentos de inmediato. No presenta cetosis, la presión arterial es normal y el ultrasonido obstétrico es acorde con la edad gestacional. Tiene disposición para modificar dieta y caminar todos los días.",
    question: "¿Cuál es el manejo inicial de primera línea en esta etapa, si no hay datos de descontrol grave?",
    options: [
      "Terapia médica nutricional, ejercicio y automonitoreo glucémico con metas definidas.",
      "Solo reposo absoluto hasta el parto.",
      "Antibiótico profiláctico y ayuno intermitente.",
      "Cesárea programada en el tercer trimestre."
    ],
    answerIndex: 0,
    explanation: "El abordaje inicial de la diabetes gestacional se basa en intervención nutricional, ejercicio individualizado y automonitoreo. Esto permite identificar qué pacientes lograrán control sin fármacos y cuáles requerirán posteriormente insulina.",
    gpcReference: GPC.embarazoDm
  }),
  makeCase({
    specialty: "gyo",
    tema: "Patología del Embarazo",
    subtema: "Diabetes Mellitus Gestacional",
    case: "Mujer de 32 años en la semana 33 con diabetes gestacional diagnosticada hace un mes. Llega a urgencias con vómito, glucemias capilares persistentemente elevadas, cetonuria, deshidratación clínica y escasa ingesta en las últimas 24 horas. Refiere no haber logrado metas con dieta y suspendió seguimiento por dificultades laborales. El feto presenta movimientos conservados y no hay trabajo de parto.",
    question: "¿Qué criterio del cuadro obliga a manejo intrahospitalario en lugar de seguimiento ambulatorio?",
    options: [
      "Descontrol metabólico con cetosis y deshidratación.",
      "Embarazo único sin contracciones.",
      "Ausencia de hemorragia vaginal.",
      "Percepción de movimientos fetales."
    ],
    answerIndex: 0,
    explanation: "La presencia de cetosis, deshidratación y descontrol glucémico significativo constituye criterio de hospitalización, porque pone en riesgo a la madre y al feto y requiere corrección supervisada. El manejo ambulatorio sería insuficiente e inseguro en este contexto.",
    gpcReference: GPC.embarazoDm
  }),
  makeCase({
    specialty: "gyo",
    tema: "Patología del Embarazo",
    subtema: "Diabetes Mellitus Gestacional",
    case: "Mujer de 39 años, 38 semanas, con diabetes gestacional tratada con insulina desde el segundo trimestre. El control prenatal reporta polihidramnios leve y ultrasonido reciente con estimación fetal de 4,650 gramos. La paciente pregunta si el parto vaginal sigue siendo la vía ideal o si el peso fetal cambia la recomendación.",
    question: "Con ese peso estimado y antecedente de diabetes, ¿qué conducta obstétrica debe considerarse seriamente?",
    options: [
      "Valorar cesárea electiva por alto riesgo de distocia de hombros con macrosomía importante.",
      "Esperar parto domiciliario sin vigilancia.",
      "Suspender toda vigilancia porque el embarazo ya es de término.",
      "Inducir de inmediato sin evaluar la presentación fetal."
    ],
    answerIndex: 0,
    explanation: "En embarazadas con diabetes y peso fetal estimado muy elevado, la vía de nacimiento debe individualizarse por el riesgo de distocia de hombros y traumatismo obstétrico. La cesárea electiva puede ser razonable cuando la macrosomía alcanza umbrales altos.",
    gpcReference: GPC.embarazoDm
  }),
  makeCase({
    specialty: "gyo",
    tema: "Patología del Embarazo",
    subtema: "Diabetes Mellitus Gestacional",
    case: "Puérpera de 8 semanas que cursó con diabetes gestacional controlada con dieta durante el embarazo. Acude a consulta sintiéndose bien y piensa que, como el embarazo ya terminó, no necesita más estudios. Tiene antecedente familiar de diabetes tipo 2 y persistencia de sobrepeso. Pregunta qué seguimiento se requiere ahora que ya no está embarazada.",
    question: "¿Cuál es la recomendación correcta en el posparto para esta paciente?",
    options: [
      "Realizar evaluación con prueba de tolerancia oral a la glucosa en el posparto y continuar vigilancia periódica.",
      "No hacer ninguna prueba metabólica después del parto.",
      "Indicar solo suplemento de hierro y alta definitiva.",
      "Esperar a que aparezcan síntomas de hiperglucemia para estudiar."
    ],
    answerIndex: 0,
    explanation: "La diabetes gestacional identifica a una mujer con mayor riesgo futuro de diabetes tipo 2. Por eso se recomienda evaluación metabólica posparto, idealmente con prueba de tolerancia oral, además de consejería sobre estilo de vida y seguimiento a largo plazo.",
    gpcReference: GPC.embarazoDm
  }),
  makeCase({
    specialty: "gyo",
    tema: "Patología del Embarazo",
    subtema: "Diabetes Mellitus Gestacional",
    case: "Gestante de 30 años con 31 semanas, diagnóstico de diabetes gestacional controlada con dieta. Lleva un diario de glucemias y desea saber cuáles valores son los más útiles para juzgar si su tratamiento va funcionando. No presenta hipertensión, cetosis ni amenaza de parto pretérmino. La exploración fetal es normal.",
    question: "¿Qué componente es indispensable para valorar el control y decidir si el manejo no farmacológico está siendo suficiente?",
    options: [
      "Automonitoreo glucémico seriado con comparación contra metas establecidas.",
      "Solo medición semanal de peso materno.",
      "Exclusivamente auscultación fetal en cada consulta.",
      "Radiografía de pelvis cada mes."
    ],
    answerIndex: 0,
    explanation: "La guía mexicana enfatiza el automonitoreo como pieza clave para evaluar respuesta a dieta y ejercicio, identificar descontrol temprano y decidir si se requiere tratamiento farmacológico. No basta con impresión clínica aislada o incremento ponderal.",
    gpcReference: GPC.embarazoDm
  }),
  makeCase({
    specialty: "ped",
    tema: "Reanimación Neonatal",
    subtema: "Ventilación a presión positiva",
    case: "Recién nacido de término obtenido por parto vaginal complicado con líquido meconial espeso y bradicardia fetal intraparto. Al nacimiento está hipotónico, apneico y con frecuencia cardiaca de 70 lpm. Se coloca bajo calor radiante, se posiciona la vía aérea, se seca y se estimula sin respuesta respiratoria efectiva. No hay mejoría de la frecuencia cardiaca tras los pasos iniciales.",
    question: "¿Cuál es la siguiente intervención prioritaria?",
    options: [
      "Iniciar ventilación con presión positiva efectiva.",
      "Administrar adrenalina de inmediato antes de ventilar.",
      "Realizar compresiones torácicas como primera maniobra.",
      "Retrasar el manejo hasta contar con radiografía."
    ],
    answerIndex: 0,
    explanation: "En la reanimación neonatal, la ventilación efectiva es la maniobra más importante cuando el recién nacido está apneico o la frecuencia cardiaca es menor de 100 lpm tras los pasos iniciales. Muchas bradicardias neonatales son secundarias a falla ventilatoria y mejoran con VPP adecuada.",
    gpcReference: GPC.reanimacion
  }),
  makeCase({
    specialty: "ped",
    tema: "Reanimación Neonatal",
    subtema: "Control térmico",
    case: "Producto pretérmino de 29 semanas obtenido por cesárea urgente por preeclampsia grave. Al nacimiento llora débilmente y requiere evaluación en mesa de reanimación. El equipo está completo y se anticipa alto riesgo de pérdida rápida de temperatura por edad gestacional. La sala se encuentra preparada con fuente de calor.",
    question: "Además del calor radiante, ¿qué medida inicial es especialmente útil para disminuir hipotermia en este recién nacido pretérmino?",
    options: [
      "Uso de envoltura plástica o bolsa térmica sin secado vigoroso inicial.",
      "Baño inmediato para retirar vérnix.",
      "Exposición al ambiente para valorar coloración real.",
      "Retrasar toda intervención hasta pesarlo."
    ],
    answerIndex: 0,
    explanation: "En prematuros pequeños, la prevención de hipotermia es parte esencial de la reanimación. La envoltura plástica o medidas equivalentes reducen pérdida de calor por evaporación y mejoran estabilidad al ingreso a cuidados neonatales.",
    gpcReference: GPC.reanimacion
  }),
  makeCase({
    specialty: "ped",
    tema: "Reanimación Neonatal",
    subtema: "Compresiones torácicas",
    case: "Recién nacido de 39 semanas que requirió ventilación con presión positiva por apnea primaria. Tras 30 segundos de ventilación claramente efectiva, con buena elevación torácica y correcta colocación del dispositivo, la frecuencia cardiaca persiste en 50 lpm. El niño continúa cianótico y sin respiración espontánea sostenida.",
    question: "¿Cuál es el siguiente paso en el algoritmo de reanimación?",
    options: [
      "Iniciar compresiones torácicas coordinadas con la ventilación.",
      "Suspender ventilación y observar cinco minutos más.",
      "Administrar antibiótico intravenoso.",
      "Dar únicamente oxígeno por mascarilla sin ventilación."
    ],
    answerIndex: 0,
    explanation: "Si, pese a 30 segundos de ventilación efectiva, la frecuencia cardiaca permanece por debajo de 60 lpm, deben iniciarse compresiones coordinadas con ventilación. Este punto del algoritmo depende de haber asegurado antes que la ventilación sea realmente adecuada.",
    gpcReference: GPC.reanimacion
  }),
  makeCase({
    specialty: "ped",
    tema: "Reanimación Neonatal",
    subtema: "Medicamentos",
    case: "Recién nacido deprimido que ha recibido pasos iniciales, ventilación con presión positiva efectiva y posteriormente compresiones torácicas coordinadas durante 60 segundos. A pesar de ello, la frecuencia cardiaca sigue en 48 lpm. Ya se verificó que el tórax se eleva, la vía aérea está bien posicionada y el equipo dispone de acceso vascular umbilical.",
    question: "¿Qué intervención farmacológica corresponde en este momento?",
    options: [
      "Administrar adrenalina por vía intravenosa o endotraqueal según disponibilidad inmediata.",
      "Aplicar bicarbonato como fármaco inicial obligatorio.",
      "Indicar surfactante como sustituto de la adrenalina.",
      "Suspender las maniobras porque ya fracasaron."
    ],
    answerIndex: 0,
    explanation: "Cuando la frecuencia cardiaca persiste menor de 60 lpm pese a ventilación efectiva y compresiones adecuadas, la adrenalina está indicada. La decisión nunca debe adelantarse a la corrección de la ventilación, que sigue siendo el componente central del éxito de la reanimación.",
    gpcReference: GPC.reanimacion
  }),
  makeCase({
    specialty: "ped",
    tema: "Reanimación Neonatal",
    subtema: "Líquido meconial",
    case: "Recién nacido de término con antecedente de líquido amniótico meconial espeso. Al nacimiento presenta buen tono, llanto vigoroso y frecuencia cardiaca por arriba de 100 lpm. El personal más joven del equipo propone intubarlo para aspiración traqueal preventiva antes de entregarlo a la madre.",
    question: "¿Cuál es la conducta correcta en este escenario?",
    options: [
      "Brindar atención rutinaria y no realizar aspiración traqueal sistemática en un recién nacido vigoroso.",
      "Intubarlo de inmediato para aspiración obligatoria de meconio.",
      "Iniciar compresiones torácicas por antecedente de meconio.",
      "Administrar adrenalina profiláctica."
    ],
    answerIndex: 0,
    explanation: "La presencia de meconio ya no justifica por sí sola aspiración traqueal sistemática en un recién nacido vigoroso. Si hay buen tono, respiración efectiva y frecuencia cardiaca adecuada, corresponde manejo rutinario y observación clínica.",
    gpcReference: GPC.reanimacion
  }),
  makeCase({
    specialty: "ped",
    tema: "Reanimación Neonatal",
    subtema: "Cuidados posreanimación",
    case: "Recién nacido de 38 semanas que requirió ventilación con presión positiva por un minuto y posteriormente evolucionó con frecuencia cardiaca arriba de 120 lpm, respiración espontánea irregular y tono discretamente disminuido. Los gases del cordón sugieren acidosis perinatal y existe antecedente de sufrimiento fetal agudo. El equipo se pregunta si puede enviarse a alojamiento conjunto porque ya respira por sí mismo.",
    question: "¿Cuál es la conducta más adecuada después de una reanimación exitosa inicial?",
    options: [
      "Mantener vigilancia estrecha en unidad neonatal por riesgo de deterioro y complicaciones neurológicas o metabólicas.",
      "Dar alta inmediata a alojamiento conjunto sin monitorización.",
      "Suspender toda toma de signos porque ya respondió.",
      "Indicar solo observación telefónica a los padres."
    ],
    answerIndex: 0,
    explanation: "Los recién nacidos que requirieron reanimación significativa pueden deteriorarse nuevamente y tienen riesgo de hipoglucemia, apnea, encefalopatía y otras complicaciones. Por eso deben permanecer bajo monitorización y evaluación continua en área apropiada.",
    gpcReference: GPC.reanimacion
  }),
  makeCase({
    specialty: "ped",
    tema: "Tamiz Metabólico",
    subtema: "Oportunidad de la toma",
    case: "Recién nacido sano de término, parto eutócico, alimentación al seno materno y egreso hospitalario previsto a las 24 horas de vida. La madre pregunta si el tamiz metabólico puede tomarse en cualquier momento del primer mes porque vive lejos del hospital. El bebé no tiene datos clínicos de enfermedad y el examen físico es normal.",
    question: "¿Cuál es la recomendación correcta sobre el momento ideal de la muestra?",
    options: [
      "Tomarla en los primeros días de vida, idealmente entre las 48 y 72 horas o conforme al protocolo institucional si hay egreso temprano.",
      "Esperar hasta cumplir un mes para reducir falsos positivos.",
      "Tomarla solo si aparecen síntomas metabólicos.",
      "Sustituirla por biometría hemática de rutina."
    ],
    answerIndex: 0,
    explanation: "El valor del tamiz neonatal radica en detectar enfermedad antes de que aparezcan manifestaciones clínicas. La toma debe realizarse tempranamente, en la ventana recomendada por el programa, y si el egreso es temprano debe garantizarse la cita o repetición correspondiente.",
    gpcReference: GPC.tamizGeneral
  }),
  makeCase({
    specialty: "ped",
    tema: "Tamiz Metabólico",
    subtema: "Hipotiroidismo",
    case: "Lactante de 12 días referido por tamiz metabólico alterado. La madre comenta somnolencia excesiva, dificultad para evacuar, llanto ronco y poca ganancia ponderal. A la exploración destacan macroglosia, fontanela posterior amplia, hipotonía y hernia umbilical pequeña. El resultado preliminar del tamiz reporta elevación significativa de TSH.",
    question: "¿Qué diagnóstico debe sospecharse primero y por qué requiere atención inmediata?",
    options: [
      "Hipotiroidismo congénito, porque el retraso en diagnóstico y tratamiento aumenta el riesgo de secuelas neurológicas permanentes.",
      "Fenilcetonuria, porque siempre produce macroglosia desde el nacimiento.",
      "Hiperplasia suprarrenal, porque la TSH elevada la confirma.",
      "Fibrosis quística, porque explica mejor el estreñimiento."
    ],
    answerIndex: 0,
    explanation: "La combinación de tamiz alterado y manifestaciones clínicas clásicas sugiere hipotiroidismo congénito. La intervención temprana es crítica porque el desarrollo neurológico puede afectarse de forma irreversible si el tratamiento se retrasa.",
    gpcReference: GPC.hipotiroidismo
  }),
  makeCase({
    specialty: "ped",
    tema: "Tamiz Metabólico",
    subtema: "Hiperplasia Suprarrenal",
    case: "Recién nacido de 8 días, producto de término, llega al servicio de urgencias por vómito persistente, rechazo a la vía oral y pérdida de peso de 13% respecto al nacimiento. Se encuentra hipoactivo, deshidratado y con llenado capilar lento. Los laboratorios muestran sodio de 124 mEq/L, potasio de 6.8 mEq/L y glucosa limítrofe baja. En la exploración genital se documenta ambigüedad genital.",
    question: "¿Cuál es el diagnóstico más probable que debe integrar de inmediato el equipo?",
    options: [
      "Hiperplasia suprarrenal congénita perdedora de sal por deficiencia de 21 hidroxilasa.",
      "Hipotiroidismo congénito aislado.",
      "Fenilcetonuria clásica sin deshidratación.",
      "Displasia broncopulmonar neonatal."
    ],
    answerIndex: 0,
    explanation: "El cuadro de crisis perdedora de sal con hiponatremia, hiperpotasemia, deshidratación y ambigüedad genital es altamente sugestivo de hiperplasia suprarrenal congénita por déficit de 21 hidroxilasa. Es una urgencia endocrinológica y metabólica potencialmente letal.",
    gpcReference: GPC.hsc
  }),
  makeCase({
    specialty: "ped",
    tema: "Tamiz Metabólico",
    subtema: "Fenilcetonuria",
    case: "Lactante de 2 meses con tamiz positivo que no acudió a confirmación oportuna. Ahora presenta irritabilidad, eczema, rechazo parcial del alimento y retraso en la adquisición de sostén cefálico. La madre refiere además olor corporal inusual y antecedente de consanguinidad lejana. El pediatra revisa el expediente y encuentra reporte de fenilalanina elevada desde el periodo neonatal.",
    question: "¿Cuál es la intervención terapéutica más importante para modificar el pronóstico?",
    options: [
      "Iniciar de forma temprana dieta y fórmula especial restringida en fenilalanina bajo seguimiento nutricional.",
      "Administrar antibiótico de amplio espectro por 14 días.",
      "Suspender toda proteína y solo ofrecer agua simple.",
      "Esperar a que aparezcan convulsiones para confirmar el manejo."
    ],
    answerIndex: 0,
    explanation: "En fenilcetonuria, el tratamiento dietético precoz es la medida fundamental para prevenir daño neurológico. La guía mexicana resalta el seguimiento nutricional estrecho con fórmulas especiales y metas bioquímicas individualizadas.",
    gpcReference: GPC.pku
  }),
  makeCase({
    specialty: "ped",
    tema: "Tamiz Metabólico",
    subtema: "Fibrosis Quística",
    case: "Recién nacido referido por tamiz ampliado positivo y luego valorado a los 6 meses por tos recurrente, sibilancias, diarrea crónica con evacuaciones grasosas y estancamiento ponderal. En la exploración física presenta abdomen distendido, hipocratismo digital incipiente y datos de desnutrición leve. Los padres preguntan si el tamiz ya confirma el diagnóstico por sí mismo.",
    question: "¿Qué estudio se utiliza para confirmar formalmente la sospecha después de un tamiz positivo?",
    options: [
      "Dos determinaciones de cloruro en sudor en centro con experiencia.",
      "Radiografía simple de cráneo.",
      "Biometría hemática aislada.",
      "Prueba de esfuerzo cardiopulmonar como primer paso."
    ],
    answerIndex: 0,
    explanation: "Un tamiz positivo para fibrosis quística identifica sospecha, no diagnóstico definitivo. La confirmación clásica se realiza con pruebas de cloruro en sudor en condiciones estandarizadas, además de la valoración integral por equipos especializados.",
    gpcReference: GPC.fq
  }),
  makeCase({
    specialty: "ped",
    tema: "Tamiz Metabólico",
    subtema: "Repetición de muestra",
    case: "Recién nacido de 2 días hospitalizado por incompatibilidad sanguínea que requirió transfusión en sus primeras horas. El personal detecta que la muestra de tamiz se tomó antes de las 24 horas y además en un contexto de intervención transfusional. La madre piensa que con esa muestra basta porque ya se hizo 'la prueba del talón'.",
    question: "¿Cuál es la conducta más adecuada respecto al tamiz?",
    options: [
      "Programar repetición de la muestra conforme al protocolo, porque la toma temprana y la transfusión pueden alterar la interpretación.",
      "Considerar la muestra inicial como definitiva en todos los casos.",
      "Cancelar el tamiz porque la transfusión lo contraindica por completo.",
      "Esperar hasta el primer año de vida para repetirlo."
    ],
    answerIndex: 0,
    explanation: "El tamiz neonatal tiene condiciones técnicas de oportunidad y calidad. Una muestra demasiado temprana o obtenida en situaciones especiales como transfusión puede requerir repetición protocolizada para disminuir falsos negativos o resultados no interpretables.",
    gpcReference: GPC.tamizGeneral
  }),
  makeCase({
    specialty: "cir",
    tema: "Patología Gástrica",
    subtema: "Dispepsia Funcional",
    case: "Hombre de 29 años consulta por 7 meses de plenitud posprandial molesta, saciedad temprana y dolor epigástrico intermitente, sin pérdida de peso, anemia, sangrado digestivo ni vómito persistente. No consume AINE, no fuma y la exploración abdominal es normal. Los laboratorios básicos son normales y no hay antecedente familiar de cáncer gástrico. Está preocupado porque teme tener una 'úlcera perforada silenciosa'.",
    question: "En ausencia de datos de alarma, ¿qué diagnóstico y enfoque inicial son los más probables?",
    options: [
      "Dispepsia funcional; manejo inicial con evaluación dirigida y tratamiento empírico según el perfil de síntomas.",
      "Perforación gástrica; laparotomía urgente de inmediato.",
      "Acalasia; cardiomiotomía como primera decisión.",
      "Colangitis; antibióticos y CPRE urgente."
    ],
    answerIndex: 0,
    explanation: "La dispepsia funcional se sospecha en pacientes con síntomas dispépticos persistentes sin datos de alarma ni evidencia estructural inicial. La AMG recomienda identificar el subtipo clínico, descartar señales de riesgo y tratar de forma escalonada, en lugar de asumir una urgencia quirúrgica.",
    gpcReference: GPC.gastricaDispepsia
  }),
  makeCase({
    specialty: "cir",
    tema: "Patología Gástrica",
    subtema: "Helicobacter pylori",
    case: "Hombre de 46 años con dispepsia de varios meses, sin datos de alarma, con prueba positiva para Helicobacter pylori. Tiene antecedente de gastritis documentada y un episodio previo de úlcera duodenal tratado años atrás. Pregunta si todavía se recomienda el esquema triple clásico con inhibidor de bomba, amoxicilina y claritromicina porque eso tomó un familiar.",
    question: "De acuerdo con el consenso mexicano más reciente, ¿qué afirmación es correcta?",
    options: [
      "La terapia triple clásica con claritromicina ya no debe asumirse como primera línea universal; deben considerarse esquemas cuádruples recomendados.",
      "La erradicación ya no se indica si el paciente tiene síntomas.",
      "Basta con antiácidos y no se requiere tratamiento erradicador.",
      "La cirugía gástrica es el manejo inicial estándar."
    ],
    answerIndex: 0,
    explanation: "El IV Consenso Mexicano sobre H. pylori dejó claro que la terapia triple clásica no debe seguir utilizándose indiscriminadamente como primera línea. La selección del esquema debe considerar las recomendaciones actualizadas y el contexto de resistencia antimicrobiana.",
    gpcReference: GPC.hpylori
  }),
  makeCase({
    specialty: "cir",
    tema: "Patología Gástrica",
    subtema: "Úlcera Péptica Complicada y Perforada",
    case: "Hombre de 58 años con antecedente de dolor epigástrico crónico y uso frecuente de naproxeno por gonartrosis. Llega a urgencias por dolor súbito e intensísimo en epigastrio que se generalizó al abdomen en menos de una hora. Está inmóvil por el dolor, con abdomen rígido en tabla, TA 92/60 mmHg y FC 118 lpm. La radiografía de tórax erecta muestra aire subdiafragmático libre.",
    question: "¿Cuál es el diagnóstico más probable y qué conducta global corresponde?",
    options: [
      "Úlcera péptica perforada; reanimación, antibióticos y valoración quirúrgica urgente.",
      "Dispepsia funcional; egreso con dieta blanda.",
      "Acalasia; prueba terapéutica con calcioantagonista.",
      "Gastroenteritis viral; manejo solo con soluciones orales."
    ],
    answerIndex: 0,
    explanation: "El dolor abdominal súbito con irritación peritoneal y neumoperitoneo en un paciente con factores de riesgo ulcerosos orienta a perforación péptica. Es una urgencia quirúrgica que exige estabilización hemodinámica y resolución oportuna, no tratamiento ambulatorio.",
    gpcReference: GPC.ulceraComplicada
  }),
  makeCase({
    specialty: "cir",
    tema: "Patología Gástrica",
    subtema: "Úlcera Péptica Duodenal y Gástrica",
    case: "Varón de 62 años con dolor epigástrico, anorexia, anemia ferropénica y pérdida de 8 kg en cuatro meses. Refiere plenitud temprana y dos episodios de vómito posprandial en la última semana. No consume AINE y nunca se ha estudiado por endoscopia. La familia pregunta si primero puede probar un protector gástrico por varias semanas y solo después ver si mejora.",
    question: "¿Cuál es el siguiente estudio más apropiado?",
    options: [
      "Endoscopia digestiva alta prioritaria por presencia de datos de alarma.",
      "Solo radiografía de mano.",
      "Reposo absoluto sin estudios durante tres meses.",
      "Observación domiciliaria con antiácidos de venta libre como única estrategia."
    ],
    answerIndex: 0,
    explanation: "La combinación de anemia, pérdida de peso, plenitud temprana y vómito obliga a descartar enfermedad estructural significativa. En este contexto, la endoscopia no debe posponerse por un ensayo terapéutico empírico prolongado.",
    gpcReference: GPC.gastricaDispepsia
  }),
  makeCase({
    specialty: "cir",
    tema: "Patología Esofágica",
    subtema: "ERGE típica",
    case: "Hombre de 48 años con pirosis retroesternal y regurgitación ácida de 4 meses de evolución, exacerbadas al acostarse después de cenas abundantes. Tiene sobrepeso, trabaja de noche y consume café y tabaco. Niega disfagia, odinofagia, anemia, sangrado digestivo o pérdida de peso. Nunca ha usado tratamiento dirigido de manera formal.",
    question: "En un paciente con síntomas típicos y sin datos de alarma, ¿cuál es el enfoque inicial más apropiado?",
    options: [
      "Prueba terapéutica con inhibidor de bomba de protones junto con medidas higiénico-dietéticas.",
      "Esofagectomía temprana por sospecha de Barrett.",
      "Solo antibiótico empírico por siete días.",
      "Compresiones torácicas coordinadas 3:1."
    ],
    answerIndex: 0,
    explanation: "En la ERGE típica sin signos de alarma, el consenso mexicano respalda el abordaje inicial clínico con medidas de estilo de vida y prueba terapéutica con inhibidor de bomba. La endoscopia se reserva para contextos específicos como alarmas, refractariedad o complicaciones.",
    gpcReference: GPC.erge
  }),
  makeCase({
    specialty: "cir",
    tema: "Patología Esofágica",
    subtema: "Síntomas de alarma",
    case: "Mujer de 61 años con antecedente de pirosis de larga evolución que ahora presenta disfagia progresiva primero a sólidos y luego a semisólidos, odinofagia ocasional, anemia microcítica y pérdida de 7 kg en tres meses. Refiere que antes se automedicaba con omeprazol con alivio parcial. El examen físico muestra palidez y ligera deshidratación, sin abdomen agudo.",
    question: "¿Cuál es la conducta diagnóstica correcta en este momento?",
    options: [
      "Solicitar endoscopia digestiva alta prioritaria por síntomas de alarma.",
      "Mantener indefinidamente el mismo IBP sin estudio adicional.",
      "Dar de alta con antiácido a demanda y control en un año.",
      "Realizar solo coprocultivo."
    ],
    answerIndex: 0,
    explanation: "La disfagia progresiva, la pérdida de peso y la anemia son datos de alarma que obligan a evaluación endoscópica. Continuar solo tratamiento empírico sin estudiar puede retrasar el diagnóstico de lesión complicada o neoplásica.",
    gpcReference: GPC.erge
  }),
  makeCase({
    specialty: "cir",
    tema: "Patología Esofágica",
    subtema: "Complicaciones de ERGE",
    case: "Hombre de 58 años, con obesidad, tabaquismo activo y más de una década de pirosis frecuente. En los últimos meses necesita medicación casi diaria para controlar los síntomas. Su padre falleció por adenocarcinoma de esófago y el paciente pregunta si existe alguna complicación precancerosa asociada al reflujo crónico que deba vigilarse.",
    question: "¿Qué entidad debe considerarse particularmente en este contexto?",
    options: [
      "Esófago de Barrett.",
      "Divertículo de Meckel.",
      "Apendicitis catarral.",
      "Enterocolitis necrotizante."
    ],
    answerIndex: 0,
    explanation: "La exposición crónica del epitelio esofágico al ácido puede llevar a metaplasia intestinal especializada, conocida como esófago de Barrett. Su identificación es importante porque incrementa el riesgo de adenocarcinoma y modifica la estrategia de seguimiento.",
    gpcReference: GPC.erge
  }),
  makeCase({
    specialty: "cir",
    tema: "Patología Esofágica",
    subtema: "Estudios funcionales",
    case: "Mujer de 37 años con síntomas típicos de reflujo desde hace un año y respuesta incompleta al tratamiento empírico. La endoscopia alta resultó normal y no se observaron erosiones. Pese a ajustar dieta y tratamiento, persiste la regurgitación ácida y el ardor retroesternal varias veces por semana. No presenta signos de alarma ni hallazgos estructurales que expliquen el cuadro.",
    question: "¿Qué estudio funcional ayuda a documentar exposición ácida o asociación síntoma-reflujo cuando la endoscopia es normal?",
    options: [
      "Monitoreo de pH esofágico o pH-impedancia según el contexto clínico.",
      "Radiografía simple de cráneo.",
      "Electromiografía de miembros inferiores.",
      "Prueba de Schilling."
    ],
    answerIndex: 0,
    explanation: "Cuando la endoscopia es normal y persiste la sospecha de ERGE, los estudios funcionales de reflujo permiten objetivar exposición ácida y correlación con los síntomas. Esto evita sobrediagnóstico y mejora la selección del tratamiento posterior.",
    gpcReference: GPC.erge
  })
];

function validateCase(item) {
  if (!item.specialty || !["gyo", "ped", "cir", "mi"].includes(item.specialty)) {
    throw new Error(`Especialidad invalida en caso: ${item.question}`);
  }
  if (!item.tema || !item.subtema) throw new Error(`Tema o subtema vacio: ${item.question}`);
  if (!item.case || item.case.length < 220) throw new Error(`Caso muy corto: ${item.question}`);
  if (!item.question || item.question.length < 40) throw new Error(`Pregunta muy corta: ${item.question}`);
  if (!Array.isArray(item.options) || item.options.length !== 4) {
    throw new Error(`Opciones invalidas: ${item.question}`);
  }
  const optionKeys = item.options.map(normalizeTextKey);
  if (new Set(optionKeys).size !== 4) throw new Error(`Opciones repetidas: ${item.question}`);
  if (!Number.isInteger(item.answerIndex) || item.answerIndex < 0 || item.answerIndex > 3) {
    throw new Error(`Indice de respuesta invalido: ${item.question}`);
  }
  if (!item.explanation || item.explanation.length < 100) {
    throw new Error(`Retroalimentacion corta: ${item.question}`);
  }
  if (!item.gpcReference || item.gpcReference.length < 30) {
    throw new Error(`Referencia GPC insuficiente: ${item.question}`);
  }
}

function buildMarkdown(summary) {
  const lines = [];
  lines.push("# Informe de batch manual largo");
  lines.push("");
  lines.push(`- Fecha: ${summary.generatedAt}`);
  lines.push(`- Casos solicitados: ${summary.requested}`);
  lines.push(`- Casos agregados: ${summary.added}`);
  lines.push(`- Banco antes: ${summary.initialBank}`);
  lines.push(`- Banco después: ${summary.finalBank}`);
  lines.push(`- Duplicados detectados contra banco: ${summary.duplicatesAgainstExisting}`);
  lines.push("");
  lines.push("## Por tema");
  lines.push("");
  summary.byTheme.forEach((row) => lines.push(`- ${row.tema}: ${row.total}`));
  lines.push("");
  lines.push("## Por subtema");
  lines.push("");
  summary.bySubtheme.forEach((row) => lines.push(`- ${row.tema} / ${row.subtema}: ${row.total}`));
  lines.push("");
  return lines.join("\n");
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const existing = parseQuestionsArray(QUESTIONS_PATH);

  NEW_CASES.forEach(validateCase);

  const existingSigSet = new Set();
  const existingOpenSet = new Set();
  existing.forEach((item) => {
    existingSigSet.add(signatureFor({
      specialty: item.specialty || "",
      tema: item.temaCanonical || item.tema || "",
      case: item.case || "",
      question: item.question || ""
    }));
    existingOpenSet.add(caseOpeningKey(item.case || ""));
  });

  const newSigSet = new Set();
  const newOpenSet = new Set();
  const uniqueCases = [];
  let duplicatesAgainstExisting = 0;

  for (const item of NEW_CASES) {
    const sig = signatureFor(item);
    const openKey = caseOpeningKey(item.case);
    if (existingSigSet.has(sig) || existingOpenSet.has(openKey)) {
      duplicatesAgainstExisting += 1;
      continue;
    }
    if (newSigSet.has(sig)) throw new Error(`Duplicado dentro del nuevo batch: ${item.question}`);
    if (newOpenSet.has(openKey)) throw new Error(`Apertura de caso repetida dentro del nuevo batch: ${item.question}`);
    newSigSet.add(sig);
    newOpenSet.add(openKey);
    uniqueCases.push(item);
  }

  const finalQuestions = dryRun ? existing : existing.concat(uniqueCases);
  if (!dryRun && uniqueCases.length > 0) {
    writeQuestionsArray(QUESTIONS_PATH, finalQuestions);
  }

  ensureDir(REPORTS_DIR);

  const byThemeMap = {};
  const bySubMap = {};
  uniqueCases.forEach((item) => {
    byThemeMap[item.tema] = (byThemeMap[item.tema] || 0) + 1;
    const key = `${item.tema}|||${item.subtema}`;
    if (!bySubMap[key]) bySubMap[key] = { tema: item.tema, subtema: item.subtema, total: 0 };
    bySubMap[key].total += 1;
  });

  const summary = {
    generatedAt: new Date().toISOString(),
    batchName: BATCH_NAME,
    dryRun,
    requested: NEW_CASES.length,
    added: uniqueCases.length,
    initialBank: existing.length,
    finalBank: finalQuestions.length,
    duplicatesAgainstExisting,
    byTheme: Object.entries(byThemeMap)
      .map(([tema, total]) => ({ tema, total }))
      .sort((a, b) => b.total - a.total || a.tema.localeCompare(b.tema, "es")),
    bySubtheme: Object.values(bySubMap)
      .sort((a, b) => b.total - a.total || a.tema.localeCompare(b.tema, "es") || a.subtema.localeCompare(b.subtema, "es")),
    sampleQuestions: uniqueCases.slice(0, 12).map((item, idx) => ({
      index: idx + 1,
      tema: item.tema,
      subtema: item.subtema,
      question: item.question
    }))
  };

  const suffix = dryRun ? "dry" : "live";
  const summaryJsonPath = path.join(REPORTS_DIR, `${BATCH_NAME}_summary_${suffix}.json`);
  const summaryMdPath = path.join(REPORTS_DIR, `${BATCH_NAME}_summary_${suffix}.md`);
  const casesJsonPath = path.join(REPORTS_DIR, `${BATCH_NAME}_cases_${suffix}.json`);

  fs.writeFileSync(summaryJsonPath, JSON.stringify(summary, null, 2), "utf8");
  fs.writeFileSync(summaryMdPath, buildMarkdown(summary), "utf8");
  fs.writeFileSync(casesJsonPath, JSON.stringify(uniqueCases, null, 2), "utf8");

  console.log(JSON.stringify({
    dryRun,
    requested: NEW_CASES.length,
    added: uniqueCases.length,
    initialBank: existing.length,
    finalBank: finalQuestions.length,
    duplicatesAgainstExisting,
    report: path.relative(ROOT, summaryJsonPath),
    cases: path.relative(ROOT, casesJsonPath)
  }, null, 2));
}

main();
