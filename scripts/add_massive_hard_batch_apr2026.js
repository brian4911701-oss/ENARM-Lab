const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const QUESTIONS_PATH = path.join(ROOT, "questions.js");

const REF = {
  ica: "CENETEC 2024. GPC-SS-219-24. Insuficiencia cardiaca aguda. RR: https://www.cenetec-difusion.com/CMGPC/GPC-SS-219-24/RR.pdf",
  itu: "CENETEC 2024. GPC-SS-077-24. ITU aguda no complicada en mujeres 18-59 anos. RR: https://www.cenetec-difusion.com/CMGPC/GPC-SS-077-24/RR.pdf",
  lra: "CENETEC 2024. GPC-SS-231-24. Lesion renal aguda en pediatria. RR: https://www.cenetec-difusion.com/CMGPC/GPC-SS-231-24/RR.pdf",
  erc: "CENETEC 2024. GPC-SS-188-24. ERC en menores de 18 anos. RR: https://www.cenetec-difusion.com/CMGPC/GPC-SS-188-24/RR.pdf",
  testiculo: "CENETEC 2024. GPC-SS-004-24. Cancer de testiculo. RR: https://www.cenetec-difusion.com/CMGPC/GPC-SS-004-24/RR.pdf",
  pulmon: "CENETEC 2024. GPC-SS-022-24. Prevencion y deteccion temprana de cancer de pulmon. RR: https://www.cenetec-difusion.com/CMGPC/GPC-SS-022-24/RR.pdf"
};

function clean(v) {
  return String(v || "").replace(/\s+/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim();
}

function norm(v) {
  return String(v || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseQuestions(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]") + 1;
  return JSON.parse(raw.slice(start, end));
}

function writeQuestions(filePath, questions) {
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

function sig(item) {
  return norm([item.specialty, item.tema, item.case, item.question].join(" | "));
}

function makeCase(data) {
  const specialty = clean(data.specialty);
  const tema = clean(data.tema);
  const subtema = clean(data.subtema);
  return {
    specialty,
    case: clean(data.case),
    question: clean(data.question),
    options: (data.options || []).map(clean),
    answerIndex: Number(data.answerIndex),
    explanation: clean(data.explanation),
    gpcReference: clean(data.gpcReference),
    tema,
    temaCanonical: tema,
    subtemaCanonical: subtema,
    subtema,
    specialtyOriginal: specialty,
    temaOriginal: tema,
    subtemaOriginal: subtema,
    difficulty: clean(data.difficulty || "alta")
  };
}

const NEW_CASES = [
  // Insuficiencia cardiaca aguda (5)
  makeCase({
    specialty: "urg",
    tema: "Cardiologia Clinica",
    subtema: "Insuficiencia Cardiaca Aguda",
    case: "Hombre de 70 anos con FEVI 30% acude por disnea de reposo, ortopnea y estertores difusos. TA 172/100 mmHg, FC 112 lpm, SatO2 85%, extremidades tibias.",
    question: "En este perfil caliente-humedo con hipertension, cual es la mejor conducta inicial?",
    options: [
      "Diuretico IV mas vasodilatador IV y oxigenacion segun necesidad",
      "Bolo de 1 litro de cristaloide",
      "Beta bloqueador IV de inicio",
      "Solo digoxina"
    ],
    answerIndex: 0,
    explanation: "La descongestion con diuretico y vasodilatacion es el eje en el perfil congestionado hipertensivo sin hipoperfusion.",
    gpcReference: REF.ica,
    difficulty: "muy-alta"
  }),
  makeCase({
    specialty: "urg",
    tema: "Cardiologia Clinica",
    subtema: "Choque Cardiogenico",
    case: "Mujer de 66 anos con IC cronica presenta oliguria, confusion, TA 78/46 mmHg, piel fria y lactato elevado. Tiene estertores bibasales.",
    question: "Que enfoque farmacologico es mas apropiado inicialmente?",
    options: [
      "Inotropico IV titulado con monitorizacion estrecha",
      "Nitratos a dosis altas",
      "Aumentar beta bloqueador oral",
      "Solo restriccion hidrica"
    ],
    answerIndex: 0,
    explanation: "En perfil frio-humedo con hipotension, el soporte inotropico puede ser necesario para restaurar gasto y perfusion.",
    gpcReference: REF.ica,
    difficulty: "muy-alta"
  }),
  makeCase({
    specialty: "urg",
    tema: "Cardiologia Clinica",
    subtema: "Edema Agudo Pulmonar",
    case: "Paciente de 63 anos con edema pulmonar cardiogenico, FR 35 rpm, SatO2 81% con puntas nasales, trabajo respiratorio alto, TA 160/90 mmHg.",
    question: "Si no hay contraindicaciones, que soporte respiratorio inicial ofrece mejor beneficio?",
    options: [
      "Ventilacion no invasiva con presion positiva",
      "Solo puntas nasales a bajo flujo",
      "Sedacion y observacion",
      "Nebulizaciones como terapia principal"
    ],
    answerIndex: 0,
    explanation: "La ventilacion no invasiva mejora intercambio gaseoso y reduce trabajo respiratorio en edema pulmonar cardiogenico.",
    gpcReference: REF.ica,
    difficulty: "alta"
  }),
  makeCase({
    specialty: "urg",
    tema: "Cardiologia Clinica",
    subtema: "Arritmias en Insuficiencia Cardiaca",
    case: "Paciente con IC aguda cursa con fibrilacion auricular rapida y TA 74/48 mmHg, diaforesis y deterioro neurologico.",
    question: "Cual es la intervencion inmediata mas adecuada?",
    options: [
      "Cardioversion electrica sincronizada urgente",
      "Verapamilo oral y reevaluar",
      "Esperar conversion espontanea",
      "Solo anticoagular"
    ],
    answerIndex: 0,
    explanation: "La inestabilidad hemodinamica por taquiarritmia obliga a cardioversion sincronizada inmediata.",
    gpcReference: REF.ica,
    difficulty: "muy-alta"
  }),
  makeCase({
    specialty: "urg",
    tema: "Cardiologia Clinica",
    subtema: "Perfil Hemodinamico",
    case: "Mujer de 58 anos con IC, TA 90/58 mmHg, piel fria, sin estertores ni edema periferico, con oliguria y mareo.",
    question: "En perfil frio-seco, cual estrategia inicial es mas coherente?",
    options: [
      "Valorar llenado y considerar fluidos cautelosos con reevaluacion frecuente",
      "Iniciar nitratos en dosis altas",
      "Bolo repetido de diuretico sin congestion",
      "Alta inmediata"
    ],
    answerIndex: 0,
    explanation: "El perfil frio-seco puede requerir correccion cuidadosa de precarga y evaluacion dinamica de perfusion.",
    gpcReference: REF.ica,
    difficulty: "muy-alta"
  }),

  // ITU en mujer 18-59 (5)
  makeCase({
    specialty: "gyo",
    tema: "Infectologia Ginecologica",
    subtema: "ITU no Complicada",
    case: "Mujer de 25 anos con disuria, polaquiuria y urgencia de 1 dia, sin fiebre, sin dolor en flancos y sin flujo vaginal.",
    question: "Cual conducta inicial es mas adecuada en primer nivel?",
    options: [
      "Tratamiento empirico de cistitis no complicada con antibiotico recomendado",
      "Hospitalizacion de rutina",
      "Tomografia abdominal obligatoria",
      "Esperar hemocultivo para iniciar manejo"
    ],
    answerIndex: 0,
    explanation: "El cuadro tipico permite manejo empirico de cistitis no complicada en primer nivel.",
    gpcReference: REF.itu,
    difficulty: "alta"
  }),
  makeCase({
    specialty: "gyo",
    tema: "Infectologia Ginecologica",
    subtema: "Diferencial de Disuria",
    case: "Mujer de 29 anos con disuria leve, prurito vulvar intenso y flujo vaginal abundante; sin fiebre ni dolor lumbar.",
    question: "Antes de etiquetar ITU, que enfoque es mas correcto?",
    options: [
      "Ampliar diagnostico diferencial por probable causa vaginal",
      "Manejar como pielonefritis complicada",
      "Dar triple antibiotico de inicio",
      "Indicar solo diuretico"
    ],
    answerIndex: 0,
    explanation: "Los sintomas vaginales prominentes disminuyen probabilidad de cistitis bacteriana.",
    gpcReference: REF.itu,
    difficulty: "muy-alta"
  }),
  makeCase({
    specialty: "gyo",
    tema: "Infectologia Ginecologica",
    subtema: "ITU Complicada",
    case: "Mujer de 40 anos con fiebre de 39 C, dolor en flanco derecho, nausea y puño percusion positiva. Inicio con disuria 48 horas antes.",
    question: "Cual es la mejor interpretacion y conducta inicial?",
    options: [
      "Sospecha de infeccion urinaria alta/complicada y escalamiento oportuno",
      "Cistitis simple sin necesidad de reevaluacion",
      "Manejo solo con analgesico",
      "Sin necesidad de estudios"
    ],
    answerIndex: 0,
    explanation: "Fiebre y dolor en flanco orientan a infeccion urinaria alta, no a cistitis no complicada.",
    gpcReference: REF.itu,
    difficulty: "alta"
  }),
  makeCase({
    specialty: "gyo",
    tema: "Infectologia Ginecologica",
    subtema: "Bacteriuria Asintomatica",
    case: "Mujer de 33 anos no embarazada, asintomatica, con urocultivo positivo solicitado por chequeo sin indicacion clinica.",
    question: "Cual es la decision adecuada?",
    options: [
      "No tratar de rutina para evitar sobreuso de antibioticos",
      "Iniciar antibiotico IV por 14 dias",
      "Hospitalizar por riesgo de sepsis inminente",
      "Dar doble esquema antibiotico por 1 mes"
    ],
    answerIndex: 0,
    explanation: "En no embarazadas asintomaticas, tratar bacteriuria de rutina no ofrece beneficio y favorece resistencia.",
    gpcReference: REF.itu,
    difficulty: "muy-alta"
  }),
  makeCase({
    specialty: "gyo",
    tema: "Infectologia Ginecologica",
    subtema: "Falla Terapeutica en ITU",
    case: "Paciente de 30 anos con cistitis tratada segun esquema correcto persiste sintomatica al tercer dia y empeora dolor suprapubico.",
    question: "Que paso sigue de forma razonable?",
    options: [
      "Revalorar diagnostico, solicitar urocultivo y ajustar manejo",
      "Mantener mismo esquema sin cambios",
      "Suspender todo tratamiento y alta",
      "Agregar esteroide sistemico"
    ],
    answerIndex: 0,
    explanation: "La falta de respuesta temprana exige reevaluacion clinica y microbiologica.",
    gpcReference: REF.itu,
    difficulty: "alta"
  }),

  // Lesion renal aguda pediatrica (5)
  makeCase({
    specialty: "ped",
    tema: "Nefrologia Pediatrica",
    subtema: "Lesion Renal Aguda",
    case: "Nino de 8 anos en UCI por sepsis: diuresis 0.4 mL/kg/h por 8 horas y creatinina sube de 0.5 a 0.9 mg/dL en 24 horas.",
    question: "Cual interpretacion es correcta?",
    options: [
      "Cumple criterios de lesion renal aguda y requiere intervencion temprana",
      "Es variacion fisiologica",
      "Solo hay LRA si aparece edema generalizado",
      "No tiene relevancia hasta 7 dias"
    ],
    answerIndex: 0,
    explanation: "La disminucion de diuresis y ascenso de creatinina en horas son datos clasicos de LRA.",
    gpcReference: REF.lra,
    difficulty: "alta"
  }),
  makeCase({
    specialty: "ped",
    tema: "Nefrologia Pediatrica",
    subtema: "Clasificacion de LRA",
    case: "Paciente de 6 anos posquirurgico de cardiopatia con oliguria progresiva y azoados en ascenso.",
    question: "Que sistema recomienda la guia para estratificar LRA en mayores de un ano?",
    options: [
      "KDIGO",
      "Child-Pugh",
      "No usar clasificaciones",
      "SOFA adulto exclusivamente"
    ],
    answerIndex: 0,
    explanation: "KDIGO es el sistema operativo principal para diagnostico y estratificacion en este grupo.",
    gpcReference: REF.lra,
    difficulty: "alta"
  }),
  makeCase({
    specialty: "ped",
    tema: "Nefrologia Pediatrica",
    subtema: "Prevencion de LRA",
    case: "Nina de 10 anos con deshidratacion reciente recibira aminoglucosido y contraste el mismo dia.",
    question: "Que medida preventiva tiene mayor impacto?",
    options: [
      "Identificar nefrotoxicos y optimizar hidratacion con ajuste de dosis",
      "Suspender medicion de creatinina",
      "Evitar control de diuresis",
      "Usar diuretico profilactico en todos"
    ],
    answerIndex: 0,
    explanation: "La prevencion de LRA iatrogena exige vigilancia, hidratacion adecuada y uso prudente de nefrotoxicos.",
    gpcReference: REF.lra,
    difficulty: "muy-alta"
  }),
  makeCase({
    specialty: "ped",
    tema: "Nefrologia Pediatrica",
    subtema: "Indicaciones de Terapia de Reemplazo Renal",
    case: "Nino de 12 anos con LRA presenta hiperkalemia refractaria, sobrecarga de volumen y acidosis persistente pese a manejo medico.",
    question: "Que decision terapeutica es la mas adecuada?",
    options: [
      "Valorar inicio de terapia de reemplazo renal sin retraso",
      "Esperar varios dias sin ajustes",
      "Incrementar aporte de potasio",
      "Suspender monitorizacion"
    ],
    answerIndex: 0,
    explanation: "Complicaciones refractarias son indicacion para considerar terapia de reemplazo renal.",
    gpcReference: REF.lra,
    difficulty: "muy-alta"
  }),
  makeCase({
    specialty: "ped",
    tema: "Nefrologia Pediatrica",
    subtema: "Seguimiento Post-LRA",
    case: "Nina de 9 anos egresa tras LRA moderada; creatinina normal al alta y sin edema.",
    question: "Cual plan es mas apropiado despues del egreso?",
    options: [
      "Seguimiento renal estructurado por riesgo de secuelas",
      "Ningun control adicional",
      "Solo control si aparece anuria",
      "Suspender vigilancia de presion arterial"
    ],
    answerIndex: 0,
    explanation: "La normalizacion inicial no excluye secuelas; se recomienda seguimiento renal posterior.",
    gpcReference: REF.lra,
    difficulty: "alta"
  }),

  // ERC pediatrica (5)
  makeCase({
    specialty: "ped",
    tema: "Nefrologia Pediatrica",
    subtema: "Tamizaje de ERC",
    case: "Nino de 10 anos con prematuridad extrema y rinon unico funcional acude asintomatico a control.",
    question: "Que paquete de vigilancia detecta mejor dano renal temprano?",
    options: [
      "PA, creatinina con TFG estimada, EGO y albuminuria/proteinuria periodicas",
      "Solo radiografia de torax anual",
      "Solo biometria hematica cada 2 anos",
      "Sin estudios por estar asintomatico"
    ],
    answerIndex: 0,
    explanation: "En menores de alto riesgo, el tamizaje estructurado permite deteccion y referencia temprana.",
    gpcReference: REF.erc,
    difficulty: "alta"
  }),
  makeCase({
    specialty: "ped",
    tema: "Nefrologia Pediatrica",
    subtema: "Diagnostico de ERC",
    case: "Adolescente de 14 anos con albuminuria persistente y TFG discretamente reducida durante mas de 3 meses.",
    question: "Cual interpretacion es correcta?",
    options: [
      "Cumple criterios de enfermedad renal cronica",
      "Solo deshidratacion transitoria",
      "Diagnostico exclusivo de ITU",
      "Hallazgo sin relevancia"
    ],
    answerIndex: 0,
    explanation: "La persistencia de alteraciones renales por 3 meses o mas define cronicidad.",
    gpcReference: REF.erc,
    difficulty: "alta"
  }),
  makeCase({
    specialty: "ped",
    tema: "Nefrologia Pediatrica",
    subtema: "Referencia Oportuna",
    case: "Nina de 12 anos con HTA sostenida, proteinuria y descenso progresivo de TFG en controles seriados.",
    question: "Que conducta debe priorizarse en primer nivel?",
    options: [
      "Referencia oportuna a nefrologia pediatrica",
      "Vigilar sin cambios durante un ano",
      "Solo analgesico y observacion",
      "Suspender seguimiento"
    ],
    answerIndex: 0,
    explanation: "HTA, proteinuria y deterioro de TFG implican alto riesgo de progresion y requieren valoracion especializada.",
    gpcReference: REF.erc,
    difficulty: "muy-alta"
  }),
  makeCase({
    specialty: "ped",
    tema: "Nefrologia Pediatrica",
    subtema: "Control de Progresion",
    case: "Paciente de 11 anos con ERC temprana, microalbuminuria persistente y PA en percentiles altos repetidos.",
    question: "Que objetivo terapeutico ayuda a frenar progresion?",
    options: [
      "Control riguroso de presion arterial y de proteinuria",
      "Aumentar consumo de sal libre",
      "Evitar controles por ser etapa inicial",
      "AINE cronico sin vigilancia"
    ],
    answerIndex: 0,
    explanation: "El control de presion y proteinuria es clave para enlentecer progresion de ERC pediatrica.",
    gpcReference: REF.erc,
    difficulty: "alta"
  }),
  makeCase({
    specialty: "ped",
    tema: "Nefrologia Pediatrica",
    subtema: "Prevencion en Primer Nivel",
    case: "Nina de 7 anos con rinon unico funcional, asintomatica y normotensa en consulta.",
    question: "Que recomendacion preventiva es mas adecuada?",
    options: [
      "Seguimiento periodico y evitar exposicion a nefrotoxicos",
      "Ningun control por ausencia de sintomas",
      "Dieta hiperproteica estricta",
      "Uso habitual de AINE"
    ],
    answerIndex: 0,
    explanation: "En rinon unico funcional debe sostenerse vigilancia preventiva y evitar factores de dano renal.",
    gpcReference: REF.erc,
    difficulty: "alta"
  }),

  // Cancer de testiculo (5)
  makeCase({
    specialty: "cir",
    tema: "Urooncologia",
    subtema: "Cancer de Testiculo",
    case: "Hombre de 24 anos con masa testicular indolora de 5 semanas, dura y no transiluminable.",
    question: "Cual abordaje inicial evita retraso diagnostico?",
    options: [
      "Ultrasonido testicular, marcadores tumorales y referencia prioritaria",
      "Biopsia transescrotal en consultorio",
      "Antibiotico por 4 semanas sin estudios",
      "Solo antiinflamatorio y vigilancia"
    ],
    answerIndex: 0,
    explanation: "La masa intratesticular solida se considera maligna hasta demostrar lo contrario y requiere ruta diagnostica rapida.",
    gpcReference: REF.testiculo,
    difficulty: "alta"
  }),
  makeCase({
    specialty: "cir",
    tema: "Urooncologia",
    subtema: "Cancer de Testiculo",
    case: "Paciente de 27 anos con sospecha de neoplasia testicular; se propone puncion por via escrotal para confirmar.",
    question: "Que afirmacion es correcta?",
    options: [
      "La via transescrotal debe evitarse por riesgo oncologico",
      "Es la via preferida universal",
      "Debe realizarse antes de imagen",
      "Sustituye por completo marcadores"
    ],
    answerIndex: 0,
    explanation: "La manipulacion transescrotal esta contraindicada por potencial diseminacion y alteracion de estadificacion.",
    gpcReference: REF.testiculo,
    difficulty: "muy-alta"
  }),
  makeCase({
    specialty: "cir",
    tema: "Urooncologia",
    subtema: "Factores de Riesgo",
    case: "Varon de 22 anos con criptorquidia corregida tardiamente consulta por pesadez testicular y nodulo reciente.",
    question: "Que interpretacion es mas adecuada?",
    options: [
      "La criptorquidia incrementa riesgo de cancer testicular y exige alta sospecha",
      "No modifica riesgo oncologico",
      "Solo importa antecedente de varicocele",
      "El riesgo siempre desaparece tras correccion tardia"
    ],
    answerIndex: 0,
    explanation: "La criptorquidia es factor de riesgo reconocido aun tras correccion, especialmente si fue tardia.",
    gpcReference: REF.testiculo,
    difficulty: "alta"
  }),
  makeCase({
    specialty: "cir",
    tema: "Urooncologia",
    subtema: "Marcadores Tumorales",
    case: "Varon de 26 anos con lesion solida intratesticular en ultrasonido; AFP y beta-hCG en rango normal.",
    question: "Cual conclusion es correcta?",
    options: [
      "Marcadores normales no excluyen cancer testicular",
      "Descartan totalmente malignidad",
      "Permiten cancelar referencia",
      "Hacen innecesario seguimiento"
    ],
    answerIndex: 0,
    explanation: "Algunos tumores no elevan marcadores; la sospecha clinico-radiologica mantiene prioridad diagnostica.",
    gpcReference: REF.testiculo,
    difficulty: "alta"
  }),
  makeCase({
    specialty: "cir",
    tema: "Urooncologia",
    subtema: "Referencia Oportuna",
    case: "Joven de 21 anos detecta nodulo testicular pequeno en autoexploracion y acude sin otros sintomas.",
    question: "Cual consejo operativo es mas correcto en primer nivel?",
    options: [
      "No minimizar el hallazgo y canalizar para estudio y referencia temprana",
      "Esperar 6 meses para ver si crece",
      "Iniciar antibiotico profilactico sin pruebas",
      "Asumir benignidad por edad"
    ],
    answerIndex: 0,
    explanation: "La referencia oportuna mejora pronostico en neoplasias testiculares, incluso en lesiones pequenas.",
    gpcReference: REF.testiculo,
    difficulty: "alta"
  }),

  // Cancer de pulmon: prevencion y deteccion temprana (5)
  makeCase({
    specialty: "mi",
    tema: "Oncologia Toracica",
    subtema: "Tamizaje de Cancer de Pulmon",
    case: "Hombre de 63 anos, fumador de 35 paquetes-anio, suspendio hace 6 anos, asintomatico.",
    question: "Que estrategia de tamizaje tiene mayor rendimiento en alto riesgo?",
    options: [
      "Tomografia de torax de baja dosis en programa estructurado",
      "Radiografia anual como unica estrategia",
      "Citologia de esputo aislada",
      "No realizar prevencion"
    ],
    answerIndex: 0,
    explanation: "La tomografia de baja dosis es la estrategia de tamizaje con mejor rendimiento en poblacion de alto riesgo.",
    gpcReference: REF.pulmon,
    difficulty: "alta"
  }),
  makeCase({
    specialty: "mi",
    tema: "Oncologia Toracica",
    subtema: "Deteccion de Senales de Alarma",
    case: "Mujer de 58 anos fumadora activa con tos reciente, hemoptisis escasa y perdida de 6 kg en 2 meses.",
    question: "Cual conducta en primer nivel es la mas apropiada?",
    options: [
      "Referencia prioritaria para ruta diagnostica de posible cancer pulmonar",
      "Manejo expectante por 3 meses",
      "Tratar solo como bronquitis sin reevaluacion",
      "Antibiotico mensual fijo"
    ],
    answerIndex: 0,
    explanation: "Hemoptisis y perdida ponderal en fumadora son datos de alarma para referencia temprana.",
    gpcReference: REF.pulmon,
    difficulty: "muy-alta"
  }),
  makeCase({
    specialty: "mi",
    tema: "Oncologia Toracica",
    subtema: "Prevencion Primaria",
    case: "Paciente de 47 anos fumador de 20 paquetes-anio pide una medida concreta para reducir su riesgo futuro.",
    question: "Que intervencion tiene mayor impacto en prevencion primaria?",
    options: [
      "Cesacion tabaquica estructurada con apoyo conductual y farmacologico",
      "Antioxidantes en altas dosis",
      "Antibioticos intermitentes",
      "Solo ejercicio sin dejar tabaco"
    ],
    answerIndex: 0,
    explanation: "La cesacion tabaquica es la intervencion de mayor impacto para reducir riesgo de cancer pulmonar.",
    gpcReference: REF.pulmon,
    difficulty: "alta"
  }),
  makeCase({
    specialty: "mi",
    tema: "Oncologia Toracica",
    subtema: "Uso de Imagen en Tamizaje",
    case: "Hombre de 60 anos fumador intenso pregunta si radiografia anual normal basta para descartar cancer de pulmon.",
    question: "Que respuesta es correcta?",
    options: [
      "La radiografia no sustituye tamizaje con tomografia de baja dosis en alto riesgo",
      "La radiografia anual descarta totalmente enfermedad",
      "Con radiografia normal no requiere mas controles",
      "La radiografia es mas sensible que la tomografia de baja dosis"
    ],
    answerIndex: 0,
    explanation: "La radiografia simple tiene menor sensibilidad para tamizaje comparada con tomografia de baja dosis.",
    gpcReference: REF.pulmon,
    difficulty: "alta"
  }),
  makeCase({
    specialty: "mi",
    tema: "Oncologia Toracica",
    subtema: "Consejeria en Tamizaje",
    case: "Paciente de 61 anos candidato a tamizaje pregunta si con una tomografia anual puede seguir fumando sin problema.",
    question: "Cual consejeria es mas adecuada?",
    options: [
      "Tamizaje no reemplaza cesacion tabaquica; deben integrarse ambas estrategias",
      "Con tamizaje puede mantener tabaquismo sin aumento de riesgo",
      "Una sola tomografia elimina todo riesgo futuro",
      "No existe relacion entre tabaco y cancer pulmonar"
    ],
    answerIndex: 0,
    explanation: "El tamizaje detecta temprano, pero no anula el dano continuo del tabaco; la cesacion sigue siendo central.",
    gpcReference: REF.pulmon,
    difficulty: "alta"
  })
];

function run() {
  const current = parseQuestions(QUESTIONS_PATH);
  const seen = new Set(current.map(sig));
  const added = [];
  for (const c of NEW_CASES) {
    const k = sig(c);
    if (!seen.has(k)) {
      seen.add(k);
      added.push(c);
    }
  }
  const merged = current.concat(added);
  writeQuestions(QUESTIONS_PATH, merged);
  console.log(`Casos propuestos: ${NEW_CASES.length}`);
  console.log(`Casos agregados: ${added.length}`);
  console.log(`Total final: ${merged.length}`);
}

run();
