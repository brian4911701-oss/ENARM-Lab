const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const QUESTIONS_PATH = path.join(ROOT, "questions.js");
const REPORTS_DIR = path.join(ROOT, "reports");

function getArg(flag, fallback = "") {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  const value = process.argv[idx + 1];
  if (!value || value.startsWith("--")) return fallback;
  return value;
}

function toInt(value, fallback) {
  const parsed = parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
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

function cleanInline(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function parseQuestionsArray(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]") + 1;
  if (start < 0 || end <= 0) throw new Error("No se pudo leer QUESTIONS en questions.js");
  return JSON.parse(raw.slice(start, end));
}

function writeQuestionsArray(filePath, questions) {
  const content =
    "// questions.js - Banco de reactivos para ENARMlab\n" +
    "const QUESTIONS = " + JSON.stringify(questions, null, 2) + ";\n\n" +
    "if (typeof module !== 'undefined') {\n  module.exports = QUESTIONS;\n}\n";
  fs.writeFileSync(filePath, content, "utf8");
}

function signature(item) {
  return normalizeTextKey(
    [
      item.specialty || "",
      item.temaCanonical || "",
      item.case || "",
      item.question || ""
    ].join(" | ")
  );
}

function buildCaseRecord(base, idx) {
  const difficulty = idx % 3 === 0 ? "alta" : "media";
  const tema = cleanInline(base.tema);
  const specialty = base.specialty;

  return {
    specialty,
    case: cleanInline(base.caseBuilder(idx)),
    question: cleanInline(base.question),
    options: base.options.map(cleanInline),
    answerIndex: base.answerIndex,
    explanation: cleanInline(base.explanation),
    gpcReference: cleanInline(base.gpcReference),
    tema,
    temaCanonical: tema,
    subtemaCanonical: tema,
    subtema: tema,
    specialtyOriginal: specialty,
    temaOriginal: tema,
    subtemaOriginal: tema,
    difficulty
  };
}

function buildBlueprints() {
  return [
    {
      specialty: "mi",
      tema: "Diabetes Mellitus tipo 2",
      caseBuilder: (i) => {
        const age = 35 + (i % 31);
        const glucosa = 170 + ((i * 9) % 110);
        const hba1c = (7.1 + ((i % 10) * 0.2)).toFixed(1);
        const imc = 27 + (i % 7);
        return `Paciente de ${age} anos con poliuria, polidipsia y fatiga de 4 meses. IMC ${imc} kg/m2, TA 138/86 mmHg, glucosa en ayuno ${glucosa} mg/dL y HbA1c ${hba1c}%. Funcion renal conservada y sin cetosis.`;
      },
      question: "Cual es el tratamiento farmacologico inicial de primera linea?",
      options: [
        "Insulina basal desde el primer contacto en todos los casos.",
        "Metformina junto con cambios en estilo de vida.",
        "Sulfonilurea como monoterapia obligatoria.",
        "Inhibidor SGLT2 como unica terapia inicial."
      ],
      answerIndex: 1,
      explanation: "En DM2 sin descompensacion grave ni contraindication renal, la primera linea es metformina junto con intervenciones intensivas de estilo de vida. Insulina se reserva para hiperglucemia marcada, sintomas catabolicos o falla de control. Sulfonilureas e iSGLT2 pueden ser utiles segun perfil clinico, pero no desplazan a metformina como inicio estandar.",
      gpcReference: "NOM-015-SSA2-2010 y GPC CENETEC para diagnostico y tratamiento de Diabetes Mellitus tipo 2."
    },
    {
      specialty: "mi",
      tema: "Cetoacidosis diabetica",
      caseBuilder: (i) => {
        const age = 20 + (i % 25);
        const glucosa = 320 + ((i * 13) % 220);
        const ph = (7.05 + ((i % 8) * 0.03)).toFixed(2);
        const hco3 = 8 + (i % 7);
        return `Paciente de ${age} anos con DM1, nausea, vomito, dolor abdominal y respiracion de Kussmaul. Glucosa ${glucosa} mg/dL, pH ${ph}, bicarbonato ${hco3} mEq/L y cetonuria positiva. TA 95/60 mmHg y mucosas secas.`;
      },
      question: "Cual es la intervencion inicial mas importante al ingreso?",
      options: [
        "Bicarbonato intravenoso en bolo inmediato.",
        "Iniciar antibiotico de amplio espectro de rutina.",
        "Reposicion vigorosa con solucion salina isotonic.",
        "Suspender liquidos y dar solo insulina rapida."
      ],
      answerIndex: 2,
      explanation: "En cetoacidosis diabetica, la prioridad inicial es restaurar volumen intravascular con solucion isotonic para mejorar perfusion tisular y renal. Despues se ajusta insulina y potasio segun protocolos. Bicarbonato solo se considera en acidosis extrema y no como medida universal de primera linea.",
      gpcReference: "NOM-015-SSA2-2010 y GPC CENETEC de urgencias metabolicas en diabetes."
    },
    {
      specialty: "mi",
      tema: "Hipertension arterial sistemica",
      caseBuilder: (i) => {
        const age = 42 + (i % 30);
        const taS = 146 + (i % 18);
        const taD = 92 + (i % 10);
        return `Paciente de ${age} anos con cifras repetidas de TA en consulta entre ${taS}/${taD} y ${(taS - 4)}/${(taD - 2)} mmHg en diferentes visitas. Sin dano agudo a organo blanco y con antecedente de diabetes tipo 2.`;
      },
      question: "Que grupo farmacologico se prefiere como base inicial por comorbilidad?",
      options: [
        "IECA o ARA-II.",
        "Bloqueador alfa como monoterapia.",
        "Nitratos de accion larga.",
        "Diuretico osmotico cronico."
      ],
      answerIndex: 0,
      explanation: "En HAS con diabetes, IECA o ARA-II se priorizan por beneficio cardio-renal, salvo contraindication. Otros grupos pueden combinarse segun metas y tolerancia, pero alfa bloqueadores y nitratos no son base de control cronico de primera linea.",
      gpcReference: "NOM-030-SSA2-2009 y GPC mexicana para diagnostico y tratamiento de hipertension arterial."
    },
    {
      specialty: "mi",
      tema: "Infarto agudo de miocardio con elevacion del ST",
      caseBuilder: (i) => {
        const age = 48 + (i % 24);
        const hrs = 1 + (i % 4);
        return `Paciente de ${age} anos con dolor toracico opresivo de ${hrs} horas, diaforesis y nausea. ECG con elevacion del ST en derivaciones anteriores. No hay contraindicaciones para reperfusion.`;
      },
      question: "Cual es la conducta terapeutica inmediata que mejora supervivencia?",
      options: [
        "Esperar enzimas cardiacas y repetir ECG en 24 horas.",
        "Iniciar reperfusion urgente (ICP primaria o fibrinolisis segun disponibilidad).",
        "Dar solo analgesia y alta con cita.",
        "Iniciar anticoagulacion oral sin reperfusion."
      ],
      answerIndex: 1,
      explanation: "En IAMCEST, la reperfusion temprana reduce mortalidad y tamano de infarto. La estrategia depende de tiempos y recursos: ICP primaria preferida cuando es oportuna; fibrinolisis si no hay acceso oportuno a hemodinamia. Retrasar decision empeora pronostico.",
      gpcReference: "GPC CENETEC para diagnostico y tratamiento del IAM con elevacion del ST."
    },
    {
      specialty: "ped",
      tema: "Enfermedad diarreica aguda en pediatria",
      caseBuilder: (i) => {
        const ageMonths = 8 + (i % 42);
        const kg = (7.2 + ((i % 16) * 0.4)).toFixed(1);
        return `Lactante de ${ageMonths} meses, peso ${kg} kg, con diarrea acuosa de 24 horas y vomito ocasional. Irritable, ojos ligeramente hundidos, mucosa oral seca y llenado capilar conservado; sin choque.`;
      },
      question: "Que plan de hidratacion oral corresponde para deshidratacion leve-moderada?",
      options: [
        "Plan A exclusivamente en domicilio sin vigilancia.",
        "Plan B: solucion de rehidratacion oral 75 ml/kg en 4 horas y reevaluacion.",
        "Plan C con bolo de cristaloide inmediato en todos los casos.",
        "Suspender via oral durante 24 horas."
      ],
      answerIndex: 1,
      explanation: "Con signos de deshidratacion leve o moderada sin choque, se indica Plan B con solucion de rehidratacion oral y reevaluacion clinica. Plan C se reserva para deshidratacion grave o choque. Mantener via oral y alimentacion segun tolerancia disminuye complicaciones.",
      gpcReference: "GPC CENETEC de Enfermedad Diarreica Aguda en menores de 5 anos y lineamientos de hidratacion oral."
    },
    {
      specialty: "ped",
      tema: "Bronquiolitis aguda",
      caseBuilder: (i) => {
        const ageMonths = 2 + (i % 10);
        const sat = 92 + (i % 5);
        return `Lactante de ${ageMonths} meses con rinorrea, tos y sibilancias de 2 dias. FR elevada para la edad, tiraje subcostal leve y saturacion ${sat}% al aire ambiente. Sin datos de sepsis.`;
      },
      question: "Cual es el manejo inicial recomendado en bronquiolitis no complicada?",
      options: [
        "Antibiotico intravenoso de rutina.",
        "Soporte clinico: oxigeno segun saturacion, hidratacion y vigilancia.",
        "Corticoide sistemico en todos los pacientes.",
        "Nebulizaciones con broncodilatador de forma obligatoria prolongada."
      ],
      answerIndex: 1,
      explanation: "La bronquiolitis es principalmente viral y el manejo de base es soporte: hidratacion, higiene nasal y oxigeno cuando hay hipoxemia. Antibioticos y esteroides no se usan de rutina sin indicacion especifica. El uso de broncodilatador puede valorarse caso a caso, no de forma universal.",
      gpcReference: "GPC CENETEC para diagnostico y manejo de bronquiolitis aguda."
    },
    {
      specialty: "ped",
      tema: "Convulsion febril simple",
      caseBuilder: (i) => {
        const ageMonths = 12 + (i % 36);
        const temp = (38.5 + ((i % 9) * 0.2)).toFixed(1);
        return `Nino de ${ageMonths} meses con fiebre de ${temp} C y crisis tonico-clonica generalizada unica de 2 minutos, con recuperacion completa posterior. Exploracion neurologica sin deficit focal.`;
      },
      question: "Cual es la conducta adecuada tras estabilizar al paciente?",
      options: [
        "Iniciar anticonvulsivo cronico de mantenimiento.",
        "Solicitar neuroimagen urgente en todos los casos.",
        "Educar a cuidadores, control termico y manejo de causa febril.",
        "Indicar puncion lumbar en toda convulsion febril simple."
      ],
      answerIndex: 2,
      explanation: "En convulsion febril simple, sin signos de alarma ni deficit neurologico, el manejo es educacion, control de fiebre y vigilancia clinica. No se indica anticonvulsivante cronico de rutina ni neuroimagen universal. Estudios adicionales se individualizan segun edad y hallazgos clinicos.",
      gpcReference: "GPC CENETEC sobre convulsiones febriles en pediatria."
    },
    {
      specialty: "ped",
      tema: "Neumonia adquirida en la comunidad pediatrica",
      caseBuilder: (i) => {
        const ageYears = 2 + (i % 9);
        const temp = (38.0 + ((i % 10) * 0.2)).toFixed(1);
        return `Paciente de ${ageYears} anos con fiebre de ${temp} C, tos productiva y taquipnea para la edad. Sin datos de choque, tolera via oral y saturacion de oxigeno mayor a 92% al aire ambiente.`;
      },
      question: "En manejo ambulatorio de probable etiologia bacteriana, cual es antibiotico inicial recomendado?",
      options: [
        "Amoxicilina a dosis altas por via oral.",
        "Vancomicina intravenosa de inicio.",
        "Meropenem intravenoso en casa.",
        "No dar antibiotico nunca en neumonia infantil."
      ],
      answerIndex: 0,
      explanation: "En NAC pediatrica no grave con sospecha bacteriana, amoxicilina oral a dosis adecuadas es opcion de primera linea en muchos escenarios comunitarios. Esquemas de amplio espectro intravenoso se reservan para cuadros graves, falla terapeutica o factores de riesgo especificos.",
      gpcReference: "GPC CENETEC para diagnostico y tratamiento de neumonia adquirida en la comunidad en pediatria."
    },
    {
      specialty: "gyo",
      tema: "Preeclampsia con datos de severidad",
      caseBuilder: (i) => {
        const age = 19 + (i % 20);
        const sg = 30 + (i % 9);
        const taS = 160 + (i % 18);
        const taD = 104 + (i % 14);
        return `Gestante de ${age} anos, ${sg} SDG, con cefalea intensa y fosfenos. TA ${taS}/${taD} mmHg en dos tomas, proteinuria positiva y dolor en epigastrio.`;
      },
      question: "Ademas de control antihipertensivo, que medida farmacologica reduce riesgo de eclampsia?",
      options: [
        "Sulfato de magnesio con esquema de carga y mantenimiento.",
        "Heparina de bajo peso molecular en monoterapia.",
        "Insulina regular por protocolo fijo.",
        "Diuretico de asa de rutina en toda embarazada."
      ],
      answerIndex: 0,
      explanation: "En preeclampsia con criterios de severidad, sulfato de magnesio es el farmaco de eleccion para profilaxis y tratamiento de convulsiones eclampticas. El manejo integral incluye vigilancia materno-fetal, control de TA y decision oportuna de interrupcion del embarazo segun edad gestacional y estabilidad clinica.",
      gpcReference: "NOM-007-SSA2-2016 y GPC CENETEC para trastornos hipertensivos del embarazo."
    },
    {
      specialty: "gyo",
      tema: "Hemorragia obstetrica por atonia uterina",
      caseBuilder: (i) => {
        const age = 20 + (i % 19);
        const ml = 700 + ((i * 35) % 700);
        return `Paciente puerpera de ${age} anos con sangrado vaginal estimado en ${ml} mL tras parto vaginal. Utero blando a la palpacion, taquicardia y palidez. Sin datos iniciales de retencion placentaria.`;
      },
      question: "Cual es la primera intervencion terapeutica especifica sobre la causa mas probable?",
      options: [
        "Masaje uterino bimanual y uterotonicos de forma inmediata.",
        "Esperar estudios de laboratorio antes de actuar.",
        "Iniciar tocolisis para relajar el utero.",
        "Dar solo analgesia y observacion."
      ],
      answerIndex: 0,
      explanation: "La atonia uterina es causa principal de hemorragia posparto. El manejo inicial requiere accion inmediata: masaje uterino, uterotonicos, reposicion de volumen y protocolo de hemorragia obstetrica. Retrasar tratamiento aumenta riesgo de choque y coagulopatia.",
      gpcReference: "NOM-007-SSA2-2016 y GPC CENETEC de prevencion, diagnostico y tratamiento de hemorragia obstetrica."
    },
    {
      specialty: "gyo",
      tema: "Diabetes gestacional",
      caseBuilder: (i) => {
        const age = 24 + (i % 15);
        const sg = 24 + (i % 7);
        return `Gestante de ${age} anos en semana ${sg} de embarazo, sin diabetes previa conocida. Acude a control prenatal para tamizaje metabolico y no presenta sintomas de hiperglucemia franca.`;
      },
      question: "En que momento del embarazo se recomienda realizar tamizaje rutinario para diabetes gestacional en bajo riesgo?",
      options: [
        "Entre las 24 y 28 semanas de gestacion.",
        "Solo en puerperio inmediato.",
        "Hasta despues del parto en todos los casos.",
        "Unicamente en la semana 8."
      ],
      answerIndex: 0,
      explanation: "El tamizaje universal en gestantes sin diagnostico previo suele realizarse entre 24 y 28 SDG, periodo donde aumenta resistencia insulinica del embarazo. Pacientes de alto riesgo pueden requerir evaluacion temprana adicional y seguimiento posterior al parto.",
      gpcReference: "NOM-007-SSA2-2016 y GPC CENETEC para diabetes y embarazo."
    },
    {
      specialty: "gyo",
      tema: "Amenorrea secundaria",
      caseBuilder: (i) => {
        const age = 18 + (i % 17);
        const months = 4 + (i % 6);
        return `Mujer de ${age} anos con ausencia de menstruacion por ${months} meses, previamente con ciclos regulares. Niega galactorrea y no usa anticoncepcion hormonal actual.`;
      },
      question: "Cual es el primer estudio que debe solicitarse en el abordaje inicial?",
      options: [
        "Prueba de embarazo (beta-hCG).",
        "Resonancia hipofisaria como primer paso universal.",
        "Laparoscopia diagnostica inmediata.",
        "Cariotipo de entrada en toda paciente."
      ],
      answerIndex: 0,
      explanation: "Ante amenorrea secundaria, el primer paso diagnostico es descartar embarazo con beta-hCG. Despues se amplian estudios hormonales o de imagen segun contexto clinico. Saltar este paso retrasa el algoritmo correcto y aumenta errores diagnosticos.",
      gpcReference: "GPC CENETEC para amenorrea y alteraciones del ciclo menstrual."
    },
    {
      specialty: "cir",
      tema: "Apendicitis aguda",
      caseBuilder: (i) => {
        const age = 14 + (i % 33);
        const hrs = 10 + (i % 30);
        return `Paciente de ${age} anos con dolor abdominal de ${hrs} horas, inicio periumbilical y migracion a fosa iliaca derecha, nausea y anorexia. Dolor a la descompresion y defensa localizada.`;
      },
      question: "Cual es el manejo definitivo en un cuadro compatible sin contraindicaciones?",
      options: [
        "Apendicectomia y manejo perioperatorio segun protocolo.",
        "Observacion domiciliaria sin seguimiento.",
        "Solo analgesia por 7 dias.",
        "Colonoscopia urgente como tratamiento."
      ],
      answerIndex: 0,
      explanation: "La apendicitis aguda con alta sospecha clinica y/o confirmacion por imagen requiere manejo quirurgico oportuno, ademas de medidas de soporte y antibiotico segun escenario. Demorar tratamiento incrementa riesgo de perforacion, absceso y sepsis.",
      gpcReference: "GPC CENETEC para diagnostico y tratamiento de apendicitis aguda."
    },
    {
      specialty: "cir",
      tema: "Colecistitis aguda litiastica",
      caseBuilder: (i) => {
        const age = 28 + (i % 35);
        const temp = (37.8 + ((i % 7) * 0.2)).toFixed(1);
        return `Paciente de ${age} anos con dolor en hipocondrio derecho, fiebre de ${temp} C, nausea y signo de Murphy clinico. Ultrasonido reporta pared vesicular engrosada y lito impactado en cuello vesicular.`;
      },
      question: "Cual es el tratamiento de eleccion una vez estabilizado?",
      options: [
        "Colecistectomia laparoscopica temprana.",
        "Ayuno indefinido sin resolver causa.",
        "Solo antiacidos por via oral.",
        "Apendicectomia profilactica."
      ],
      answerIndex: 0,
      explanation: "En colecistitis aguda, tras estabilizacion inicial y antibiotico cuando esta indicado, la colecistectomia laparoscopica temprana reduce complicaciones y recurrencias. El manejo conservador aislado se reserva para situaciones seleccionadas por riesgo quirurgico alto.",
      gpcReference: "GPC CENETEC para diagnostico y tratamiento de colecistitis aguda."
    },
    {
      specialty: "cir",
      tema: "Pancreatitis aguda",
      caseBuilder: (i) => {
        const age = 24 + (i % 40);
        const lipasa = 350 + ((i * 27) % 600);
        return `Paciente de ${age} anos con dolor epigastrico intenso irradiado a espalda, vomito y elevacion de lipasa a ${lipasa} U/L. Hemodinamicamente estable al ingreso, sin falla organica persistente.`;
      },
      question: "Cual es la medida inicial de soporte con mayor impacto en las primeras horas?",
      options: [
        "Hidratacion intravenosa temprana con cristaloides y analgesia adecuada.",
        "Cirugia inmediata en todos los casos.",
        "Antibiotico profilactico universal por 14 dias.",
        "Ayuno perpetuo sin reevaluacion."
      ],
      answerIndex: 0,
      explanation: "La pancreatitis aguda se maneja inicialmente con soporte intensivo: reposicion de volumen, control del dolor y monitorizacion. Cirugia o intervenciones invasivas se reservan para indicaciones concretas. El uso rutinario de antibiotico profilactico no se recomienda en pancreatitis no complicada.",
      gpcReference: "GPC CENETEC para diagnostico y tratamiento de pancreatitis aguda."
    },
    {
      specialty: "cir",
      tema: "Trauma toracico con neumotorax a tension",
      caseBuilder: (i) => {
        const age = 18 + (i % 47);
        const sat = 80 + (i % 10);
        return `Paciente politraumatizado de ${age} anos con disnea intensa, hipotension, desviacion traqueal y abolicion de murmullo vesicular unilateral. Saturacion ${sat}% pese a oxigeno suplementario.`;
      },
      question: "Cual es la accion inmediata de salvamento?",
      options: [
        "Descompresion toracica inmediata seguida de sello pleural.",
        "Esperar radiografia antes de intervenir.",
        "Dar solo analgesico y observar.",
        "Realizar endoscopia digestiva urgente."
      ],
      answerIndex: 0,
      explanation: "El neumotorax a tension es emergencia vital. La descompresion inmediata no debe retrasarse por estudios de imagen cuando el cuadro clinico es evidente. Luego se coloca drenaje pleural definitivo y se continua manejo del trauma segun protocolo.",
      gpcReference: "Protocolos ATLS y guias nacionales de atencion inicial al paciente traumatizado."
    }
  ];
}

function main() {
  const target = Math.max(1, toInt(getArg("--count", "400"), 400));
  const dryRun = process.argv.includes("--dry-run");

  const existing = parseQuestionsArray(QUESTIONS_PATH);
  const seen = new Set(existing.map(signature).filter(Boolean));
  const blueprints = buildBlueprints();

  const additions = [];
  let cursor = 0;
  let attempts = 0;
  const maxAttempts = target * 20;

  while (additions.length < target && attempts < maxAttempts) {
    const blueprint = blueprints[cursor % blueprints.length];
    const variantIndex = Math.floor(cursor / blueprints.length);
    const candidate = buildCaseRecord(blueprint, variantIndex);
    const key = signature(candidate);

    if (key && !seen.has(key)) {
      seen.add(key);
      additions.push(candidate);
    }

    cursor += 1;
    attempts += 1;
  }

  if (!dryRun && additions.length > 0) {
    const merged = existing.concat(additions);
    writeQuestionsArray(QUESTIONS_PATH, merged);
  }

  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
  const summary = {
    generatedAt: new Date().toISOString(),
    dryRun,
    requested: target,
    generated: additions.length,
    attempts,
    initialBank: existing.length,
    finalBank: dryRun ? existing.length : existing.length + additions.length,
    bySpecialty: additions.reduce((acc, item) => {
      acc[item.specialty] = (acc[item.specialty] || 0) + 1;
      return acc;
    }, {})
  };
  fs.writeFileSync(
    path.join(REPORTS_DIR, "codex_local_batch_summary.json"),
    JSON.stringify(summary, null, 2),
    "utf8"
  );

  console.log(JSON.stringify(summary, null, 2));
}

main();
