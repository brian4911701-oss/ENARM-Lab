const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const QUESTIONS_PATH = path.join(ROOT, "questions.js");
const REPORTS_DIR = path.join(ROOT, "reports");

const OFFICIAL_TOPIC = "Diarrea en el Pediátrico";
const DEFAULT_COUNT = 40;

const JSON_SOURCES = [
  "parsed_variados_nuevo_v3.json",
  "parsed_variados_nuevo_v2.json",
  "parsed_casos_chat_random.json",
  "parsed_questions.json",
  "generated_questions.json"
];

const TEXT_SOURCES = [
  { file: "pedia_text.txt", specialty: "ped" },
  { file: "pedia2_text.txt", specialty: "ped" },
  { file: "variados_base_text.txt", specialty: "" },
  { file: "mi_text.txt", specialty: "mi" }
];

const PED_KEYWORDS = [
  "pediatr", "nino", "nina", "lactante", "preescolar", "escolar", "adolescente",
  "neonato", "recien nacido", "menor", "infante"
];

const DIARRHEA_KEYWORDS = [
  "diarrea", "gastroenteritis", "deshidrat", "disenter", "evacuac", "heces",
  "rehidrat", "sro", "plan a", "plan b", "plan c", "rotavirus", "norovirus",
  "shigella", "salmonella", "enteroinvas", "celiaca", "intoxicacion alimentaria"
];

const UNRELATED_KEYWORDS = [
  "prostata", "hipertrofia prostatica", "mastografia", "birads", "tiroidea", "hipertiroid",
  "fractura", "hernia discal", "infarto", "arritmia", "eclamps", "embarazo", "puerper",
  "menopausia", "catarata", "glaucoma", "otitis", "ivu", "pielonefritis", "nefrolit"
];

const SUPPLEMENT_SCENARIOS = [
  {
    subtopic: "Planes de Hidratación",
    difficulty: "media",
    case: "Lactante de 9 meses con 6 evacuaciones liquidas en 24 horas, sin vomito persistente, alerta, con mucosa oral humeda y llenado capilar normal. Tolera via oral y no hay datos de choque.",
    question: "En este contexto de EDA sin deshidratacion, cual es la conducta inicial correcta segun guias?",
    options: [
      "Plan A en casa, ofrecer SRO despues de cada evacuacion y educar signos de alarma.",
      "Plan C intravenoso de inmediato.",
      "Suspender lactancia y dar ayuno absoluto 24 horas.",
      "Dar loperamida de rutina."
    ],
    answerIndex: 0,
    explanation: "La EDA sin deshidratacion se maneja con Plan A, hidratacion oral, continuidad de alimentacion y vigilancia de signos de alarma. El manejo intravenoso se reserva para deshidratacion grave o choque.",
    gpcReference: "GPC CENETEC para Enfermedad Diarreica Aguda en menores de 5 anos y lineamientos nacionales de Plan A, B y C."
  },
  {
    subtopic: "Planes de Hidratación",
    difficulty: "alta",
    case: "Nina de 14 meses con diarrea y vomito de 18 horas. Presenta ojos hundidos, sed intensa y pliegue cutaneo de retorno lento, con pulsos palpables y estado de alerta conservado.",
    question: "Cual es el esquema de rehidratacion recomendado para deshidratacion leve a moderada?",
    options: [
      "Plan B con SRO 75 ml/kg en 4 horas y reevaluacion clinica.",
      "Plan A sin reevaluacion.",
      "Plan C para todos los pacientes con diarrea.",
      "Solo antibiotico oral."
    ],
    answerIndex: 0,
    explanation: "Con deshidratacion leve-moderada sin choque se recomienda Plan B: 75 ml/kg en 4 horas, de forma fraccionada y con nueva valoracion para definir siguiente conducta.",
    gpcReference: "GPC CENETEC de EDA pediatrica y recomendaciones de hidratacion oral."
  },
  {
    subtopic: "Planes de Hidratación",
    difficulty: "alta",
    case: "Nino de 2 anos con diarrea profusa, letargia, llenado capilar mayor de 3 segundos, pulsos debiles y extremidades frias. No tolera via oral y presenta oliguria.",
    question: "Cual es la conducta inicial prioritaria?",
    options: [
      "Plan C intravenoso con cristaloides isotónicos y monitorizacion estrecha.",
      "Solo Plan A en casa.",
      "Esperar 6 horas antes de iniciar liquidos.",
      "Dar antidiarreico y egresar."
    ],
    answerIndex: 0,
    explanation: "Los datos de hipoperfusion y deshidratacion grave exigen Plan C intravenoso inmediato. Retrasar la reanimacion aumenta riesgo de choque refractario y complicaciones.",
    gpcReference: "GPC CENETEC de EDA en menores de 5 anos; algoritmo de deshidratacion grave."
  },
  {
    subtopic: "Planes de Hidratación",
    difficulty: "media",
    case: "Lactante de 4 meses con diarrea acuosa y vomito frecuente. Esta activo, pero rechaza tomas grandes de liquidos y vomita cuando bebe rapidamente.",
    question: "Que estrategia mejora la tolerancia de la SRO en este escenario?",
    options: [
      "Administrar SRO en pequenas tomas frecuentes cada 5 minutos.",
      "Suspender totalmente via oral.",
      "Usar bebidas deportivas hiperosmolares.",
      "Indicar solo agua simple sin electrolitos."
    ],
    answerIndex: 0,
    explanation: "Cuando hay vomito, las tomas pequenas y frecuentes de SRO mejoran tolerancia y reducen falla de rehidratacion oral. La suspension completa de via oral suele empeorar la deshidratacion.",
    gpcReference: "GPC CENETEC de hidratacion oral en EDA pediatrica."
  },
  {
    subtopic: "Introducción a Diarreas",
    difficulty: "media",
    case: "Lactante de 7 meses con EDA de 2 dias, sin datos de choque. La madre pregunta si debe suspender lactancia materna hasta que cese la diarrea.",
    question: "Cual recomendacion es correcta?",
    options: [
      "Continuar lactancia materna durante todo el episodio.",
      "Suspender lactancia y reiniciar en 72 horas.",
      "Cambiar a ayuno absoluto por 24 horas.",
      "Sustituir por jugos industrializados."
    ],
    answerIndex: 0,
    explanation: "La lactancia debe mantenerse en EDA, porque mejora hidratacion, nutricion y recuperacion intestinal. Suspenderla incrementa riesgo de deterioro nutricional y deshidratacion.",
    gpcReference: "GPC CENETEC de EDA y recomendaciones nutricionales en lactantes."
  },
  {
    subtopic: "Diarrea Enteroinvasiva",
    difficulty: "alta",
    case: "Preescolar de 3 anos con fiebre alta, dolor abdominal, tenesmo y heces con moco y sangre desde hace 24 horas. Presenta deshidratacion leve.",
    question: "Ademas de hidratacion, cual enfoque terapeutico es el mas adecuado?",
    options: [
      "Antibiotico dirigido para disenteria segun contexto clinico/epidemiologico.",
      "Loperamida como primera linea.",
      "Ningun seguimiento, solo dieta.",
      "Corticoide sistemico empirico."
    ],
    answerIndex: 0,
    explanation: "La disenteria sugiere etiologia bacteriana invasiva y puede requerir antibiotico dirigido, ademas de hidratacion. Los antimotilidad no se recomiendan en ninos con diarrea infecciosa invasiva.",
    gpcReference: "GPC CENETEC de EDA pediatrica y uso racional de antibioticos en diarrea con sangre."
  },
  {
    subtopic: "Diarrea Enteroinvasiva",
    difficulty: "media",
    case: "Nina de 5 anos con diarrea con sangre, dolor abdominal y fiebre de 39 C. En urgencias se documenta deshidratacion moderada y mal estado general.",
    question: "Que estudio complementario tiene mayor utilidad para orientar etiologia en este caso?",
    options: [
      "Coprocultivo en contexto de diarrea disentérica febril.",
      "Radiografia de torax de rutina.",
      "Electroencefalograma inicial.",
      "Prueba de esfuerzo cardiaco."
    ],
    answerIndex: 0,
    explanation: "En diarrea con sangre y fiebre, el coprocultivo puede orientar etiologia y sensibilidad antimicrobiana cuando hay indicacion de tratamiento dirigido.",
    gpcReference: "GPC CENETEC de diarrea infecciosa pediatrica."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "media",
    case: "Nino de 2 anos con diarrea de 16 dias, perdida de peso y disminucion del apetito. Sin sangre en heces, pero con distension abdominal y evacuaciones frecuentes.",
    question: "Como se clasifica este cuadro por tiempo de evolucion?",
    options: [
      "Diarrea persistente.",
      "Diarrea aguda no complicada.",
      "Diarrea fulminante inmediata.",
      "Sindorme de intestino corto posquirurgico."
    ],
    answerIndex: 0,
    explanation: "La diarrea que supera 14 dias se considera persistente y requiere evaluacion etiologica y nutricional mas dirigida para evitar deterioro clinico.",
    gpcReference: "GPC CENETEC para EDA pediatrica y clasificacion temporal de diarrea."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "alta",
    case: "Lactante de 11 meses con diarrea acuosa profusa tipo agua de arroz, sed intensa y signos de hipovolemia tras brote en comunidad con saneamiento deficiente.",
    question: "Cual es la prioridad en las primeras horas de manejo?",
    options: [
      "Restitucion hidroelectrolitica agresiva y vigilancia estrecha.",
      "Ayuno absoluto y observacion en casa.",
      "Antidiarreico opioide como monoterapia.",
      "Solo probiotico sin hidratacion."
    ],
    answerIndex: 0,
    explanation: "En diarrea acuosa profusa con deshidratacion, la prioridad absoluta es corregir volumen y electrolitos. El retraso en hidratacion aumenta riesgo de choque.",
    gpcReference: "GPC CENETEC de EDA pediatrica y lineamientos OMS de rehidratacion."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "media",
    case: "Nino de 4 anos con gastroenteritis viral probable, sin sangre en heces, afebril y con estado general conservado.",
    question: "Que conducta sobre antibioticos es la correcta?",
    options: [
      "No usar antibiotico de rutina en diarrea acuosa no invasiva.",
      "Iniciar ceftriaxona en todos los casos.",
      "Indicar doble antibiotico por 7 dias.",
      "Dar antibiotico solo para bajar la diarrea."
    ],
    answerIndex: 0,
    explanation: "La mayoria de cuadros acuosos en pediatria son virales y no requieren antibiotico. El uso innecesario incrementa resistencia y eventos adversos.",
    gpcReference: "GPC CENETEC de EDA pediatrica y estrategia de uso racional de antimicrobianos."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "media",
    case: "Nino de 18 meses con EDA en mejoria, ya tolera via oral y no presenta signos de deshidratacion al revalorar.",
    question: "Cual indicacion de alimentacion es mas adecuada?",
    options: [
      "Reiniciar alimentacion habitual temprana segun tolerancia.",
      "Mantener ayuno total por 48 horas.",
      "Suspender toda leche por 2 semanas en todos los casos.",
      "Usar solo bebidas azucaradas."
    ],
    answerIndex: 0,
    explanation: "La realimentacion temprana reduce deterioro nutricional y favorece recuperacion intestinal. El ayuno prolongado no se recomienda.",
    gpcReference: "GPC CENETEC de EDA y nutricion en pediatria."
  },
  {
    subtopic: "Enfermedad Celíaca",
    difficulty: "alta",
    case: "Escolar de 6 anos con diarrea cronica, distension abdominal, anemia ferropenica y pobre ganancia ponderal. Tiene antecedente familiar de autoinmunidad.",
    question: "Cual prueba serologica inicial es la mas util para tamizaje de enfermedad celiaca?",
    options: [
      "Anticuerpos anti-transglutaminasa tisular IgA con IgA total.",
      "Dengue NS1.",
      "Prueba de tuberculina.",
      "Cultivo de exudado faringeo."
    ],
    answerIndex: 0,
    explanation: "El tamizaje recomendado incluye anti-tTG IgA y cuantificacion de IgA total para detectar deficiencia de IgA y evitar falsos negativos.",
    gpcReference: "GPC de enfermedad celiaca en pediatria y recomendaciones diagnosticas vigentes."
  },
  {
    subtopic: "Enfermedad Celíaca",
    difficulty: "alta",
    case: "Nina de 8 anos con sospecha serologica de enfermedad celiaca. Persiste con diarrea cronica y retraso ponderal.",
    question: "Que estudio confirma de forma clasica el diagnostico antes de tratamiento definitivo?",
    options: [
      "Biopsia duodenal en contexto clinico-serologico compatible.",
      "Solo biometria hematica.",
      "Electrocardiograma de control.",
      "Ultrasonido de rodilla."
    ],
    answerIndex: 0,
    explanation: "La confirmacion tradicional se realiza con biopsia duodenal cuando el contexto clinico y serologico es compatible, para documentar dano mucoso.",
    gpcReference: "Guia clinica de diagnostico de enfermedad celiaca en edad pediatrica."
  },
  {
    subtopic: "Intoxicaciones Alimentarias",
    difficulty: "media",
    case: "Preescolar de 4 anos con diarrea y vomito de inicio brusco pocas horas despues de ingerir alimentos en fiesta escolar. Sin sangre en heces ni choque.",
    question: "Cual es la medida inicial mas importante?",
    options: [
      "Hidratacion oral y vigilancia de evolucion clinica.",
      "Antibiotico parenteral inmediato para todos.",
      "Antidiarreico opioide obligatorio.",
      "Ayuno estricto prolongado."
    ],
    answerIndex: 0,
    explanation: "En cuadros compatibles con toxiinfeccion alimentaria no complicada, la medida principal es hidratacion y vigilancia; el manejo antimicrobiano se individualiza.",
    gpcReference: "GPC de gastroenteritis aguda en pediatria y manejo inicial de toxiinfeccion alimentaria."
  },
  {
    subtopic: "Intoxicaciones Alimentarias",
    difficulty: "alta",
    case: "Nino de 7 anos con diarrea intensa, vomito y fiebre tras consumir alimentos mal refrigerados. Presenta taquicardia y deshidratacion moderada.",
    question: "Cual criterio obliga a valoracion hospitalaria en lugar de manejo domiciliario?",
    options: [
      "Deshidratacion moderada a grave o deterioro del estado general.",
      "Solo una evacuacion semisolida.",
      "Ausencia de fiebre y buena hidratacion.",
      "Curso menor de 12 horas con tolerancia oral."
    ],
    answerIndex: 0,
    explanation: "La deshidratacion significativa y el mal estado general ameritan manejo hospitalario para rehidratacion supervisada y vigilancia de complicaciones.",
    gpcReference: "GPC CENETEC de EDA pediatrica y criterios de referencia hospitalaria."
  },
  {
    subtopic: "Planes de Hidratación",
    difficulty: "media",
    case: "Lactante de 5 meses con diarrea leve. La madre pregunta que volumen de SRO dar despues de cada evacuacion en casa.",
    question: "En menores de 2 anos, cual recomendacion de reposicion por evacuacion es la mas usada en Plan A?",
    options: [
      "Aproximadamente 10 ml/kg por evacuacion o pequenas tomas frecuentes equivalentes.",
      "No ofrecer liquidos entre evacuaciones.",
      "Solo agua simple sin sales.",
      "Dar 200 ml/kg en una sola toma."
    ],
    answerIndex: 0,
    explanation: "En Plan A se sugiere reposicion oral posterior a cada evacuacion con SRO, de forma fraccionada y ajustada al peso/edad para prevenir deshidratacion.",
    gpcReference: "Lineamientos de hidratacion oral en EDA pediatrica (Plan A)."
  },
  {
    subtopic: "Planes de Hidratación",
    difficulty: "media",
    case: "Nino de 3 anos con diarrea y vomito ocasional. Se decide Plan B y la madre pregunta como repartir la toma para evitar vomitos.",
    question: "Cual estrategia de administracion es adecuada durante Plan B?",
    options: [
      "Fraccionar la SRO en tomas pequenas frecuentes y reevaluar a las 4 horas.",
      "Dar todo el volumen en una sola toma rapida.",
      "Suspender SRO hasta que no haya vomito en 24 horas.",
      "Usar solo bebidas carbonatadas."
    ],
    answerIndex: 0,
    explanation: "Fraccionar la SRO mejora tolerancia y permite completar el esquema de Plan B con menor riesgo de vomito y falla terapeutica.",
    gpcReference: "GPC de hidratacion oral en EDA pediatrica (Plan B)."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "alta",
    case: "Lactante de 10 meses con EDA y deshidratacion leve-moderada. La familia pregunta por uso de zinc.",
    question: "Cual recomendacion sobre zinc es correcta en mayores de 6 meses?",
    options: [
      "Administrar 20 mg al dia por 10 a 14 dias.",
      "Suspender zinc en todos los casos.",
      "Dar zinc solo por 24 horas.",
      "Usar 100 mg diarios de forma indefinida."
    ],
    answerIndex: 0,
    explanation: "En mayores de 6 meses se recomienda zinc 20 mg/dia por 10-14 dias para reducir duracion e intensidad del episodio y recurrencias cercanas.",
    gpcReference: "Recomendaciones OMS/UNICEF y guias clinicas para EDA pediatrica."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "alta",
    case: "Lactante de 4 meses con EDA sin choque y adecuada perfusion periferica.",
    question: "Cual dosis de zinc suele indicarse en menores de 6 meses?",
    options: [
      "10 mg al dia por 10 a 14 dias.",
      "20 mg por dosis cada 2 horas.",
      "No usar nunca en lactantes pequenos.",
      "50 mg diarios por 1 dia."
    ],
    answerIndex: 0,
    explanation: "En menores de 6 meses se recomienda zinc 10 mg/dia por 10-14 dias como parte del manejo integral de EDA.",
    gpcReference: "Lineamientos internacionales y GPC de EDA pediatrica sobre suplementacion con zinc."
  },
  {
    subtopic: "Introducción a Diarreas",
    difficulty: "media",
    case: "Nino de 1 ano con diarrea leve, sin fiebre ni sangre en heces. Exploracion sin datos de deshidratacion.",
    question: "Que medicamento debe evitarse de rutina por riesgo y falta de beneficio en lactantes y preescolares?",
    options: [
      "Antidiarreicos antimotilidad como loperamida.",
      "Solucion de rehidratacion oral.",
      "Zinc segun edad.",
      "Lactancia materna continua."
    ],
    answerIndex: 0,
    explanation: "Los antimotilidad no se recomiendan de rutina en ninos pequenos por riesgo de eventos adversos y beneficio limitado; hidratacion oral sigue siendo el pilar.",
    gpcReference: "GPC CENETEC de EDA pediatrica y seguridad farmacologica en menores."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "media",
    case: "Nino de 2 anos con gastroenteritis reciente que mejora, pero persiste distension y diarrea osmótica al reiniciar lacteos.",
    question: "Cual explicacion y medida temporal son mas probables?",
    options: [
      "Intolerancia transitoria a lactosa postinfecciosa y ajuste dietetico temporal.",
      "Apendicitis perforada inmediata.",
      "Colestasis obstructiva primaria.",
      "Necesidad universal de antibiotico intravenoso."
    ],
    answerIndex: 0,
    explanation: "Tras gastroenteritis puede presentarse intolerancia transitoria a lactosa por dano de borde en cepillo. El manejo suele ser dietetico temporal y reevaluacion clinica.",
    gpcReference: "Guias clinicas de diarrea persistente y nutricion pediatrica."
  },
  {
    subtopic: "Diarrea Enteroinvasiva",
    difficulty: "alta",
    case: "Escolar de 9 anos con diarrea sanguinolenta, fiebre, dolor abdominal intenso y datos de deshidratacion moderada. Hay antecedente de brote escolar.",
    question: "Cual conducta global es la mas adecuada en urgencias?",
    options: [
      "Rehidratacion, evaluacion etiologica y tratamiento dirigido segun gravedad.",
      "Dar alta sin hidratacion ni seguimiento.",
      "Tratar solo con antidiarreico antimotilidad.",
      "Ayuno absoluto como unica medida."
    ],
    answerIndex: 0,
    explanation: "La diarrea invasiva febril requiere enfoque integral: estabilizar hidratacion, valorar etiologia y decidir antimicrobiano dirigido cuando este indicado.",
    gpcReference: "GPC de diarrea infecciosa pediatrica con sangre y fiebre."
  },
  {
    subtopic: "Planes de Hidratación",
    difficulty: "alta",
    case: "Lactante de 3 meses con diarrea, fiebre y rechazo a la via oral. Presenta somnolencia intermitente y diuresis disminuida.",
    question: "Que factor por si solo aumenta el umbral para manejo hospitalario en este caso?",
    options: [
      "Edad menor de 6 meses con signos de compromiso clinico.",
      "Color de ropa del paciente.",
      "Episodio unico de tos sin fiebre.",
      "Antecedente remoto de dermatitis."
    ],
    answerIndex: 0,
    explanation: "En lactantes pequenos el deterioro puede ser rapido; la edad temprana con rechazo oral y signos de compromiso amerita vigilancia hospitalaria.",
    gpcReference: "GPC CENETEC de EDA pediatrica y criterios de referencia/ingreso."
  },
  {
    subtopic: "Planes de Hidratación",
    difficulty: "alta",
    case: "Nino de 3 anos con diarrea abundante y deshidratacion grave. Gasometria con acidosis metabolica y lactato elevado; presenta taquicardia e hipoperfusion.",
    question: "Que tipo de solucion debe usarse primero para reanimacion intravascular?",
    options: [
      "Cristaloide isotónico como solucion salina o Hartmann.",
      "Solucion hipotónica al 0.45%.",
      "Agua libre por via intravenosa.",
      "Dextrosa al 10% como unico liquido."
    ],
    answerIndex: 0,
    explanation: "En deshidratacion grave con hipoperfusion se inicia con cristaloides isotónicos para restaurar volumen. Las soluciones hipotónicas no son de eleccion para reanimacion.",
    gpcReference: "GPC de EDA pediatrica y manejo de choque hipovolemico."
  },
  {
    subtopic: "Diarrea Enteroinvasiva",
    difficulty: "alta",
    case: "Escolar de 8 anos con diarrea sanguinolenta tras consumir carne poco cocida. No fiebre alta, pero presenta dolor abdominal intenso y palidez progresiva.",
    question: "En sospecha de infeccion por E. coli productor de toxina Shiga, que conducta farmacologica se evita por riesgo de SHU?",
    options: [
      "Antibiotico empirico y antimotilidad de rutina.",
      "Hidratacion y vigilancia hematologica.",
      "Monitorizar funcion renal y diuresis.",
      "Referencia oportuna ante datos de anemia o oliguria."
    ],
    answerIndex: 0,
    explanation: "En sospecha de STEC se evita antibiotico empirico de rutina y antimotilidad por potencial aumento de riesgo de SHU; se prioriza soporte e identificacion temprana de complicaciones.",
    gpcReference: "Guias de diarrea invasiva pediatrica y recomendaciones sobre STEC/SHU."
  },
  {
    subtopic: "Planes de Hidratación",
    difficulty: "media",
    case: "Nina de 2 anos con EDA en Plan B, pero tras 2 horas mantiene vomito repetido e incapacidad para retener SRO pese a administracion fraccionada.",
    question: "Cual es el siguiente paso mas adecuado?",
    options: [
      "Escalar a hidratacion intravenosa en unidad medica.",
      "Continuar en casa sin reevaluacion.",
      "Suspender liquidos por 12 horas.",
      "Dar solo antidiarreico oral."
    ],
    answerIndex: 0,
    explanation: "Si fracasa la rehidratacion oral por vomito persistente o intolerancia, se requiere hidratacion intravenosa y vigilancia para evitar progresion de deshidratacion.",
    gpcReference: "GPC CENETEC de EDA: criterios de falla de hidratacion oral."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "media",
    case: "Lactante de 10 meses con diarrea acuosa y vomito en brote de guarderia. No hay sangre en heces, curso de 24 horas y fiebre baja.",
    question: "Cual etiologia es mas probable en este patron clinico-epidemiologico?",
    options: [
      "Gastroenteritis viral.",
      "Apendicitis perforada.",
      "Colitis isquemica.",
      "Enfermedad inflamatoria intestinal grave de inicio agudo."
    ],
    answerIndex: 0,
    explanation: "En brotes con diarrea acuosa y vomito de inicio agudo, la etiologia viral es frecuente. El manejo inicial sigue siendo hidratacion, alimentacion y vigilancia.",
    gpcReference: "GPC de gastroenteritis aguda pediatrica."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "media",
    case: "Nino de 1 ano con EDA y antecedente de no haber completado esquema de vacunacion contra rotavirus.",
    question: "Que intervencion preventiva reduce carga de hospitalizacion por diarrea grave en lactantes?",
    options: [
      "Vacunacion oportuna contra rotavirus segun esquema nacional.",
      "Uso cronico de antibiotico profilactico.",
      "Restriccion permanente de lactosa en todos.",
      "Ayuno preventivo en periodos de brote."
    ],
    answerIndex: 0,
    explanation: "La vacunacion contra rotavirus reduce casos graves y hospitalizaciones por diarrea en lactantes. No reemplaza hidratacion, pero es estrategia preventiva clave.",
    gpcReference: "Lineamientos del Programa de Vacunacion Universal y guias de EDA pediatrica."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "alta",
    case: "Preescolar de 4 anos con diarrea de 3 semanas, perdida de peso y edema periferico leve, ademas de ingesta deficiente.",
    question: "Cual enfoque es prioritario para evitar deterioro nutricional y complicaciones?",
    options: [
      "Valoracion integral hospitalaria con hidratacion y soporte nutricional.",
      "Solo control telefonico sin exploracion.",
      "Suspender por completo la alimentacion enteral.",
      "Indicar antidiarreico por tiempo indefinido."
    ],
    answerIndex: 0,
    explanation: "La diarrea persistente con compromiso nutricional requiere evaluacion integral, correccion de hidratacion, plan nutricional y busqueda etiologica dirigida.",
    gpcReference: "Guias de diarrea persistente y desnutricion en pediatria."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "media",
    case: "Nina de 5 anos con diarrea tras curso reciente de amoxicilina-clavulanato por otitis. Presenta evacuaciones blandas frecuentes sin sangre y dolor abdominal leve.",
    question: "Cual es la mejor conducta inicial?",
    options: [
      "Revalorar necesidad del antibiotico, mantener hidratacion y vigilancia clinica.",
      "Dar loperamida de rutina.",
      "Iniciar doble antibiotico empirico.",
      "Ayuno absoluto por 48 horas."
    ],
    answerIndex: 0,
    explanation: "La diarrea asociada a antibioticos suele manejarse con hidratacion y reevaluacion del esquema antimicrobiano. Los antimotilidad en ninos no son primera linea.",
    gpcReference: "Guia de uso racional de antibioticos y manejo de diarrea asociada a antimicrobianos en pediatria."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "media",
    case: "Nino de 3 anos con diarrea osmotica recurrente, distension y exceso de consumo diario de jugos industrializados ricos en sorbitol.",
    question: "Que medida no farmacologica es la mas pertinente?",
    options: [
      "Reducir azucares fermentables y jugos, con seguimiento clinico.",
      "Iniciar antibiotico por 10 dias.",
      "Indicar esteroide sistemico.",
      "Suspender completamente agua y sales."
    ],
    answerIndex: 0,
    explanation: "El exceso de azucares osmoticamente activos puede perpetuar diarrea en preescolares. El ajuste dietetico dirigido es parte central del manejo.",
    gpcReference: "Recomendaciones nutricionales en diarrea pediatrica funcional/persistente."
  },
  {
    subtopic: "Intoxicaciones Alimentarias",
    difficulty: "media",
    case: "Escolar de 9 anos con diarrea y vomito tras ingerir mayonesa casera en evento familiar; otros asistentes presentan sintomas similares.",
    question: "Cual orientacion epidemiologica y clinica se debe dar a la familia?",
    options: [
      "Notificar brote probable y reforzar hidratacion y medidas de higiene alimentaria.",
      "Automedicar antimotilidad a todos los asistentes.",
      "Suspender por una semana toda ingesta oral.",
      "Iniciar esteroide oral comunitario."
    ],
    answerIndex: 0,
    explanation: "En brotes alimentarios es importante hidratacion, vigilancia y medidas de seguridad alimentaria; la notificacion epidemiologica puede ser necesaria segun contexto.",
    gpcReference: "Lineamientos de vigilancia epidemiologica y manejo de gastroenteritis aguda."
  },
  {
    subtopic: "Diarrea Enteroinvasiva",
    difficulty: "alta",
    case: "Nino de 6 anos con fiebre, diarrea con sangre, dolor abdominal y leucocitosis. Se encuentra irritable y con signos de deshidratacion moderada.",
    question: "Que criterio apoya ingreso para manejo intrahospitalario?",
    options: [
      "Diarrea invasiva con compromiso del estado general y deshidratacion.",
      "Ausencia de sintomas y examen normal.",
      "Unica evacuacion blanda sin fiebre.",
      "Mejoria completa tras primera toma de SRO."
    ],
    answerIndex: 0,
    explanation: "La combinacion de diarrea invasiva, deshidratacion y deterioro clinico amerita hospitalizacion para rehidratacion, vigilancia y tratamiento dirigido.",
    gpcReference: "GPC de diarrea invasiva pediatrica y criterios de ingreso."
  },
  {
    subtopic: "Planes de Hidratación",
    difficulty: "media",
    case: "Lactante de 8 meses con diarrea y deshidratacion leve. La madre administra solo agua simple por temor a que las sales 'irriten el estomago'.",
    question: "Cual explicacion es correcta sobre SRO frente a agua simple?",
    options: [
      "La SRO repone agua y electrolitos de forma mas efectiva que agua sola.",
      "El agua simple corrige sodio y bicarbonato igual que SRO.",
      "La SRO esta contraindicada en menores de 1 ano.",
      "Ningun liquido oral debe darse en diarrea."
    ],
    answerIndex: 0,
    explanation: "La SRO contiene concentraciones adecuadas de sodio y glucosa para favorecer absorcion intestinal y corregir deficits hidroelectroliticos.",
    gpcReference: "Lineamientos de hidratacion oral (OMS/SSA) para EDA pediatrica."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "media",
    case: "Nino de 2 anos que mejoro de EDA hace 48 horas, pero la familia suspendio zinc al desaparecer la diarrea.",
    question: "Que recomendacion es la mas adecuada respecto al zinc?",
    options: [
      "Completar el esquema de 10 a 14 dias aunque ya haya mejoria clinica.",
      "Suspenderlo al primer dia sin diarrea.",
      "Usarlo solo en hospitalizados.",
      "Duplicar dosis si no hay evacuaciones."
    ],
    answerIndex: 0,
    explanation: "El beneficio del zinc depende de completar el ciclo recomendado; interrumpirlo de forma temprana reduce su impacto en duracion y recurrencias.",
    gpcReference: "Recomendaciones de zinc en EDA pediatrica."
  },
  {
    subtopic: "Enfermedad Celíaca",
    difficulty: "alta",
    case: "Nino de 10 anos con diarrea cronica, dolor abdominal recurrente y desaceleracion del crecimiento. Serologia celiaca positiva en dos ocasiones.",
    question: "Ademas del diagnostico, cual es el pilar del tratamiento a largo plazo?",
    options: [
      "Dieta estricta libre de gluten con seguimiento nutricional.",
      "Antibiotico continuo de amplio espectro.",
      "Antidiarreico diario indefinido.",
      "Ayuno intermitente terapeutico."
    ],
    answerIndex: 0,
    explanation: "La piedra angular en enfermedad celiaca es la dieta libre de gluten sostenida, con seguimiento clinico y nutricional para asegurar recuperacion.",
    gpcReference: "Guia de manejo de enfermedad celiaca pediatrica."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "alta",
    case: "Lactante de 13 meses con diarrea y signos de deshidratacion; sodio serico de 126 mEq/L sin convulsiones. Se planifica rehidratacion.",
    question: "Que principio es clave para evitar complicaciones neurologicas durante la correccion?",
    options: [
      "Corregir trastornos de sodio de forma controlada y monitorizada.",
      "Normalizar sodio en menos de 1 hora en todos.",
      "Usar agua libre intravenosa como base.",
      "Ignorar electrolitos si mejora clinicamente."
    ],
    answerIndex: 0,
    explanation: "Las alteraciones de sodio deben corregirse gradualmente bajo monitorizacion para reducir riesgo neurologico por cambios osmolares bruscos.",
    gpcReference: "Lineamientos de manejo hidroelectrolitico en pediatria con EDA complicada."
  },
  {
    subtopic: "Planes de Hidratación",
    difficulty: "media",
    case: "Nina de 18 meses con EDA sin sangre en heces. Tras orientacion inicial, la madre pregunta cuales son signos de alarma para regresar de inmediato.",
    question: "Cual de los siguientes si es un signo de alarma en EDA pediatrica?",
    options: [
      "Somnolencia marcada, oliguria o incapacidad para beber.",
      "Diarrea leve con buena hidratacion.",
      "Apetito conservado y juego normal.",
      "Mejoria progresiva en 24 horas."
    ],
    answerIndex: 0,
    explanation: "El deterioro del estado neurologico, la oliguria y la incapacidad de beber son signos de alarma y requieren valoracion inmediata.",
    gpcReference: "GPC CENETEC de EDA pediatrica: educacion para cuidadores y signos de alarma."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "media",
    case: "Preescolar de 4 anos con diarrea acuosa no inflamatoria de 2 dias, sin fiebre alta ni sangre, buen estado general y tolerancia oral adecuada.",
    question: "Que enfoque terapeutico tiene mejor relacion beneficio-riesgo en este escenario?",
    options: [
      "Hidratacion oral, alimentacion continua y vigilancia clinica.",
      "Triple antibiotico empirico.",
      "Antimotilidad de rutina y ayuno.",
      "Hospitalizacion obligatoria en todos los casos."
    ],
    answerIndex: 0,
    explanation: "En EDA no complicada, el manejo de soporte con hidratacion oral y alimentacion continua es suficiente en la mayoria de pacientes.",
    gpcReference: "GPC de manejo ambulatorio de EDA no complicada en pediatria."
  },
  {
    subtopic: "Diarrea Enteroinvasiva",
    difficulty: "alta",
    case: "Nino de 7 anos con diarrea con moco y sangre, fiebre y dolor abdominal. El examen fisico muestra deshidratacion leve y estado general regular.",
    question: "Por que no se recomiendan antimotilidad en este contexto?",
    options: [
      "Pueden aumentar riesgo de complicaciones al retardar eliminacion del patogeno.",
      "Mejoran eliminacion bacteriana de forma comprobada.",
      "Son obligatorios en toda diarrea con sangre.",
      "No tienen efectos sobre motilidad intestinal."
    ],
    answerIndex: 0,
    explanation: "En diarrea invasiva, frenar motilidad puede ser perjudicial y no sustituye hidratacion ni tratamiento etiologico dirigido cuando corresponde.",
    gpcReference: "Guia clinica de diarrea disentérica pediatrica."
  },
  {
    subtopic: "Planes de Hidratación",
    difficulty: "alta",
    case: "Lactante de 12 meses con diarrea de 2 dias y deshidratacion moderada. Tras completar Plan B en unidad medica, mejora perfusion y sed, pero persiste una evacuacion liquida ocasional.",
    question: "Que decision es correcta despues de la reevaluacion al terminar Plan B?",
    options: [
      "Pasar a Plan A domiciliario con educacion y vigilancia de signos de alarma.",
      "Mantener Plan C intravenoso por rutina.",
      "Suspender toda via oral durante 24 horas.",
      "Egreso con antimotilidad como unico manejo."
    ],
    answerIndex: 0,
    explanation: "Si el paciente mejora y ya no cumple criterios de deshidratacion moderada-grave, se transiciona a Plan A con instrucciones claras de hidratacion, alimentacion y alarma.",
    gpcReference: "GPC CENETEC de EDA pediatrica: transicion de Plan B a Plan A tras reevaluacion."
  },
  {
    subtopic: "Planes de Hidratación",
    difficulty: "media",
    case: "Preescolar de 4 anos con diarrea acuosa leve, sin signos de deshidratacion y buena tolerancia oral. Los cuidadores preguntan cuanto liquido extra administrar en domicilio.",
    question: "En mayores de 2 anos dentro de Plan A, cual pauta es adecuada despues de cada evacuacion?",
    options: [
      "Ofrecer 100 a 200 ml de SRO despues de cada evacuacion.",
      "No dar ningun liquido adicional.",
      "Dar solo jugos concentrados.",
      "Administrar dextrosa intravenosa en casa."
    ],
    answerIndex: 0,
    explanation: "En Plan A para mayores de 2 anos se sugiere ofrecer 100-200 ml de SRO tras cada evacuacion para prevenir deshidratacion progresiva.",
    gpcReference: "Lineamientos de hidratacion oral en EDA pediatrica (Plan A por grupos de edad)."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "media",
    case: "Nino de 5 anos con diarrea acuosa de 36 horas sin sangre, con fiebre baja y sin deshidratacion. Vive en comunidad con brote viral reciente.",
    question: "Cual es el objetivo principal del manejo en las primeras 24-48 horas?",
    options: [
      "Prevenir deshidratacion y mantener estado nutricional.",
      "Erradicar bacterias con antibiotico en todos.",
      "Disminuir peristalsis con antimotilidad rutinario.",
      "Mantener ayuno absoluto para reposo intestinal."
    ],
    answerIndex: 0,
    explanation: "El manejo inicial de diarrea aguda pediatrica se centra en hidratacion, alimentacion y vigilancia. No se indica antibiotico o antimotilidad de rutina en cuadros no invasivos.",
    gpcReference: "GPC de gastroenteritis aguda en pediatria."
  },
  {
    subtopic: "Intoxicaciones Alimentarias",
    difficulty: "alta",
    case: "Nina de 6 anos con diarrea y vomito tras consumir alimentos en puesto callejero; dos familiares presentan sintomas similares. Tiene sed intensa y mucosa oral seca.",
    question: "Que accion combina mejor el manejo clinico y la salud publica en este escenario?",
    options: [
      "Hidratacion inmediata, educacion y notificacion de probable brote alimentario.",
      "Solo antimotilidad y alta sin orientacion.",
      "Suspender toda hidratacion oral.",
      "Tratar empiricamente con esteroide."
    ],
    answerIndex: 0,
    explanation: "Ademas del soporte clinico, en sospecha de brote alimentario se debe reforzar vigilancia epidemiologica para reducir riesgo comunitario.",
    gpcReference: "Lineamientos nacionales de vigilancia epidemiologica y manejo inicial de toxiinfeccion alimentaria."
  },
  {
    subtopic: "Planes de Hidratación",
    difficulty: "alta",
    case: "Lactante de 15 meses con diarrea y signos de deshidratacion moderada. A las 4 horas de Plan B persiste taquicardia, sed intensa y llenado capilar limítrofe.",
    question: "Que decision es la mas prudente tras esta reevaluacion?",
    options: [
      "Reclasificar gravedad y considerar escalamiento a manejo intravenoso.",
      "Dar egreso inmediato por mejoria parcial.",
      "Suspender monitoreo por 24 horas.",
      "Indicar antimotilidad y observacion domiciliaria."
    ],
    answerIndex: 0,
    explanation: "Si la respuesta a Plan B es insuficiente, se debe reclasificar y escalar tratamiento para evitar progresion a deshidratacion grave.",
    gpcReference: "GPC de EDA pediatrica: reevaluacion posterior a Plan B."
  },
  {
    subtopic: "Diarrea Enteroinvasiva",
    difficulty: "alta",
    case: "Escolar de 10 anos con diarrea con sangre, fiebre y dolor abdominal. En laboratorio se reporta leucocitosis y elevacion de reactantes.",
    question: "Que enfoque diagnostico-terapeutico es mas adecuado en diarrea invasiva?",
    options: [
      "Hidratacion, estudios orientados y antimicrobiano dirigido cuando este indicado.",
      "Solo antimotilidad sin estudios.",
      "Ayuno absoluto como manejo unico.",
      "No reevaluar aunque persista fiebre."
    ],
    answerIndex: 0,
    explanation: "La diarrea invasiva requiere abordaje integral: estabilidad hidrica, valoracion etiologica y decision terapeutica dirigida segun severidad y contexto.",
    gpcReference: "GPC de diarrea invasiva pediatrica."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "media",
    case: "Nina de 3 anos con diarrea de 10 dias, sin sangre, con leve perdida de peso y apetito reducido. No hay datos de choque.",
    question: "Que componente debe reforzarse para disminuir riesgo de evolucion a diarrea persistente?",
    options: [
      "Plan nutricional temprano y adecuada reposicion con SRO.",
      "Suspension completa de alimentos solidos.",
      "Antibiotico de amplio espectro en todos.",
      "Restringir toda ingesta lactea de manera indefinida."
    ],
    answerIndex: 0,
    explanation: "La intervencion nutricional temprana junto con hidratacion apropiada ayuda a evitar deterioro y reduce riesgo de diarrea prolongada.",
    gpcReference: "Recomendaciones de nutricion e hidratacion en diarrea pediatrica."
  },
  {
    subtopic: "Introducción a Diarreas",
    difficulty: "media",
    case: "Lactante de 11 meses con diarrea leve. La familia quiere sustituir SRO por bebidas deportivas comerciales para 'recuperar electrolitos'.",
    question: "Cual es la recomendacion correcta sobre estas bebidas en EDA pediatrica?",
    options: [
      "Preferir SRO por su osmolaridad y composicion adecuadas para rehidratacion.",
      "Usar bebidas deportivas como primera linea en lactantes.",
      "Evitar todo liquido oral durante diarrea.",
      "Ofrecer solo refresco diluido."
    ],
    answerIndex: 0,
    explanation: "Las bebidas deportivas suelen ser hiperosmolares para lactantes y no sustituyen SRO. La solucion de rehidratacion oral es la opcion indicada.",
    gpcReference: "GPC de hidratacion oral en EDA pediatrica."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "alta",
    case: "Nino de 2 anos con diarrea recurrente y antecedente de uso repetido de antibioticos en el ultimo mes. Presenta dolor abdominal intermitente.",
    question: "Cual principio de manejo reduce riesgo de nuevas recurrencias por disbiosis asociada?",
    options: [
      "Evitar antibioticos innecesarios y usar solo con indicacion clinica clara.",
      "Indicar antibiotico preventivo continuo.",
      "Suspender hidratacion oral para reposar intestino.",
      "Dar antimotilidad de forma cronica."
    ],
    answerIndex: 0,
    explanation: "La prescripcion prudente de antibioticos reduce disbiosis y recurrencias. En diarrea pediatrica, el uso antimicrobiano debe ser dirigido e indicado.",
    gpcReference: "Lineamientos de uso racional de antimicrobianos en pediatria."
  },
  {
    subtopic: "Planes de Hidratación",
    difficulty: "media",
    case: "Nina de 20 meses con diarrea acuosa de 1 dia. En consulta esta activa, con diuresis conservada y sin signos de deshidratacion.",
    question: "Ademas de SRO, cual elemento de educacion al cuidador es clave para manejo ambulatorio seguro?",
    options: [
      "Reconocer signos de alarma y acudir temprano si aparecen.",
      "Suspender alimentos hasta resolucion completa.",
      "Iniciar antimotilidad de forma preventiva.",
      "Evitar seguimiento medico por 1 semana."
    ],
    answerIndex: 0,
    explanation: "La educacion sobre alarma (letargo, oliguria, rechazo oral, sangre en heces, fiebre persistente) es esencial para disminuir complicaciones en manejo domiciliario.",
    gpcReference: "GPC CENETEC de EDA pediatrica para primer nivel de atencion."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "alta",
    case: "Nino de 6 anos con diarrea, dolor abdominal y fiebre persistente por 5 dias, sin mejoria con manejo inicial. Presenta decaimiento progresivo.",
    question: "Que conducta es mas apropiada ante falla de mejoria clinica?",
    options: [
      "Reevaluacion completa para descartar complicacion o etiologia alterna.",
      "Continuar igual manejo sin nueva valoracion.",
      "Dar egreso definitivo sin seguimiento.",
      "Suspender hidratacion y observar en casa."
    ],
    answerIndex: 0,
    explanation: "La falta de respuesta obliga a revalorar diagnostico, gravedad y necesidad de estudios/escala terapeutica para evitar retrasos en manejo oportuno.",
    gpcReference: "GPC de EDA pediatrica: criterios de reevaluacion y referencia."
  },
  {
    subtopic: "Enfermedad Celíaca",
    difficulty: "media",
    case: "Escolar de 9 anos con diarrea cronica intermitente, dolor abdominal y estancamiento de talla. No hay datos de infeccion aguda.",
    question: "Que hallazgo clinico adicional fortaleceria la sospecha de enfermedad celiaca?",
    options: [
      "Falla de crecimiento y anemia por deficiencia de hierro.",
      "Resolucion espontanea en 24 horas.",
      "Dolor toracico pleuritico aislado.",
      "Edema agudo de glotis por alergia inmediata."
    ],
    answerIndex: 0,
    explanation: "La combinacion de diarrea cronica con falla de crecimiento y anemia carencial sugiere malabsorcion y justifica estudio dirigido para enfermedad celiaca.",
    gpcReference: "Guia de diagnostico clinico de enfermedad celiaca pediatrica."
  },
  {
    subtopic: "Planes de Hidratación",
    difficulty: "alta",
    case: "Nino de 18 meses con diarrea, ojos muy hundidos, pulso debil, letargia y llenado capilar prolongado; no tolera via oral.",
    question: "Como se clasifica este estado y cual plan corresponde?",
    options: [
      "Deshidratacion grave, iniciar Plan C con manejo intrahospitalario.",
      "Sin deshidratacion, continuar Plan A en casa.",
      "Deshidratacion leve, dar solo agua simple.",
      "Solo observacion sin fluidos."
    ],
    answerIndex: 0,
    explanation: "Los signos de hipoperfusion y letargia orientan a deshidratacion grave y requieren reanimacion intravenosa inmediata con monitorizacion.",
    gpcReference: "GPC CENETEC de EDA pediatrica y criterios de deshidratacion grave."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "media",
    case: "Lactante de 13 meses con diarrea aguda no complicada. La familia pregunta si debe dar probioticos como unico tratamiento.",
    question: "Cual mensaje terapeutico es el mas correcto?",
    options: [
      "La base del manejo sigue siendo SRO, alimentacion y zinc; probioticos son solo adyuvantes.",
      "Reemplazar SRO completamente por probioticos.",
      "Suspender toda alimentacion para potenciar probioticos.",
      "Usar solo antimotilidad junto con probioticos."
    ],
    answerIndex: 0,
    explanation: "Aunque algunos probioticos pueden ser adyuvantes, no sustituyen hidratacion oral ni recomendaciones nutricionales fundamentales.",
    gpcReference: "Guia de EDA pediatrica: manejo de soporte y terapias complementarias."
  },
  {
    subtopic: "Introducción a Diarreas",
    difficulty: "media",
    case: "Preescolar de 4 anos con diarrea leve en contexto familiar; no hay deshidratacion. La madre pregunta como prevenir nuevos episodios en casa.",
    question: "Que medida preventiva tiene mayor impacto en la reduccion de nuevos casos?",
    options: [
      "Lavado de manos y manejo higienico de agua/alimentos.",
      "Antibiotico profilactico semanal.",
      "Ayuno intermitente preventivo.",
      "Antimotilidad diario durante un mes."
    ],
    answerIndex: 0,
    explanation: "Las medidas de higiene son clave para cortar cadena de transmision de patogenos gastrointestinales en hogar y guarderia.",
    gpcReference: "Recomendaciones de prevencion de EDA en pediatria y salud publica."
  },
  {
    subtopic: "Diarrea Enteroinvasiva",
    difficulty: "media",
    case: "Escolar de 8 anos con diarrea febril y sangre en heces que mejora parcialmente con hidratacion, pero persiste dolor abdominal y evacuaciones con moco.",
    question: "Que conducta de seguimiento es la mas apropiada en las siguientes 24 horas?",
    options: [
      "Revaloracion clinica estrecha y ajuste terapeutico segun evolucion.",
      "No seguimiento mientras tolere agua.",
      "Suspender hidratacion y observar en casa.",
      "Automedicar corticoide oral."
    ],
    answerIndex: 0,
    explanation: "La diarrea invasiva requiere seguimiento estrecho para detectar progresion, necesidad de estudios adicionales y ajuste de tratamiento dirigido.",
    gpcReference: "GPC de diarrea invasiva pediatrica y criterios de reevaluacion."
  },
  {
    subtopic: "Planes de Hidratación",
    difficulty: "media",
    case: "Nino de 2 anos con diarrea acuosa y disminucion de diuresis. Tras orientacion inicial, la familia pregunta cuando acudir de urgencia.",
    question: "Cual dato obliga a valoracion inmediata?",
    options: [
      "No orinar por varias horas y rechazo persistente a liquidos.",
      "Apetito normal con buena actividad.",
      "Una evacuacion blanda aislada.",
      "Ausencia de fiebre y buena hidratacion."
    ],
    answerIndex: 0,
    explanation: "La oliguria y el rechazo oral sostenido son signos de alarma de deshidratacion progresiva y requieren valoracion medica urgente.",
    gpcReference: "GPC CENETEC de EDA pediatrica: signos de alarma para referencia urgente."
  },
  {
    subtopic: "Diarreas Agudas y Crónicas",
    difficulty: "media",
    case: "Nina de 3 anos con diarrea acuosa de 48 horas y fiebre baja, sin sangre en heces, con hidratacion aceptable y buen estado de alerta.",
    question: "Que recomendacion de seguimiento ambulatorio es la mas apropiada?",
    options: [
      "Control en 24-48 horas o antes si aparecen signos de alarma.",
      "No volver a consulta aunque empeore.",
      "Iniciar antibiotico preventivo por una semana.",
      "Suspender SRO para evaluar evolucion natural."
    ],
    answerIndex: 0,
    explanation: "En cuadros no complicados el seguimiento cercano permite detectar deterioro temprano y ajustar manejo oportunamente.",
    gpcReference: "GPC de EDA pediatrica para seguimiento en primer nivel."
  },
  {
    subtopic: "Planes de Hidratación",
    difficulty: "alta",
    case: "Lactante de 16 meses con diarrea y vomito leve. Al reevaluar en consulta presenta sed, ojos algo hundidos y pliegue cutaneo lento, sin datos de choque.",
    question: "Con esta clasificacion clinica, cual plan de hidratacion es el indicado?",
    options: [
      "Plan B con SRO y reevaluacion sistematica.",
      "Plan A exclusivo sin reevaluacion.",
      "Plan C de rutina en todos.",
      "No iniciar hidratacion hasta tener coprocultivo."
    ],
    answerIndex: 0,
    explanation: "Los hallazgos orientan a deshidratacion leve-moderada, por lo que se indica Plan B con vigilancia y reclasificacion posterior.",
    gpcReference: "Lineamientos clinicos de clasificacion de deshidratacion en EDA pediatrica."
  },
  {
    subtopic: "Diarrea Enteroinvasiva",
    difficulty: "alta",
    case: "Escolar de 11 anos con fiebre, dolor abdominal y diarrea con sangre durante 2 dias. Tiene taquicardia y signos iniciales de deshidratacion.",
    question: "Que componente del manejo no debe omitirse ademas de hidratacion inicial?",
    options: [
      "Busqueda de etiologia invasiva y decision terapeutica dirigida.",
      "Antimotilidad como unica medida.",
      "Ayuno total prolongado.",
      "Manejo sin reevaluacion clinica."
    ],
    answerIndex: 0,
    explanation: "En diarrea con sangre se requiere enfoque dirigido por gravedad y etiologia probable para reducir complicaciones y uso inapropiado de farmacos.",
    gpcReference: "GPC de diarrea disentérica pediatrica."
  },
  {
    subtopic: "Introducción a Diarreas",
    difficulty: "media",
    case: "Nino de 15 meses con diarrea acuosa leve y buen estado general. La familia pregunta si puede continuar acudiendo a guarderia al dia siguiente.",
    question: "Que recomendacion de control de contagio es mas adecuada?",
    options: [
      "Mantener medidas de higiene estrictas y limitar asistencia mientras persista diarrea activa.",
      "Enviar a guarderia sin ninguna precaucion.",
      "Indicar antibiotico profilactico a todos sus contactos.",
      "Suspender lavado de manos para evitar resequedad cutanea."
    ],
    answerIndex: 0,
    explanation: "La diarrea activa incrementa riesgo de transmision fecal-oral; medidas de higiene y conducta preventiva en guarderia reducen propagacion.",
    gpcReference: "Recomendaciones de prevencion y control comunitario en EDA pediatrica."
  }
];

function getArg(flag, fallback = "") {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  const value = process.argv[idx + 1];
  if (!value || value.startsWith("--")) return fallback;
  return value;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
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

function stripNumericVariants(value) {
  return normalizeTextKey(String(value || "").replace(/\b\d+(?:[.,]\d+)?\b/g, "#"));
}

function parseQuestionsArray(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]") + 1;
  if (start === -1 || end <= 0) {
    throw new Error("No se pudo leer QUESTIONS en questions.js");
  }
  return JSON.parse(raw.slice(start, end));
}

function writeQuestionsArray(filePath, questions) {
  const out =
    "// questions.js - Banco de reactivos para ENARMlab\n" +
    "const QUESTIONS = " + JSON.stringify(questions, null, 2) + ";\n\n" +
    "if (typeof module !== 'undefined') {\n  module.exports = QUESTIONS;\n}\n";
  fs.writeFileSync(filePath, out, "utf8");
}

function flattenRowsFromJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];

  const rows = [];
  parsed.forEach((item, rowIndex) => {
    if (Array.isArray(item.questions) && item.questions.length > 0) {
      item.questions.forEach((questionItem, questionIndex) => {
        rows.push({
          source: path.basename(filePath),
          rowIndex,
          questionIndex,
          specialtyRaw: item.specialty || "",
          temaRaw: item.tema || item.temaCanonical || "",
          subtemaRaw: item.subtema || item.subtemaCanonical || "",
          difficultyRaw: item.difficulty || "",
          caseRaw: item.case || "",
          questionRaw: questionItem.question || "",
          optionsRaw: questionItem.options || [],
          answerIndexRaw: questionItem.answerIndex,
          explanationRaw: questionItem.explanation || "",
          gpcReferenceRaw: questionItem.gpcReference || item.gpcReference || ""
        });
      });
      return;
    }

    rows.push({
      source: path.basename(filePath),
      rowIndex,
      questionIndex: 0,
      specialtyRaw: item.specialty || "",
      temaRaw: item.tema || item.temaCanonical || "",
      subtemaRaw: item.subtema || item.subtemaCanonical || "",
      difficultyRaw: item.difficulty || "",
      caseRaw: item.case || "",
      questionRaw: item.question || "",
      optionsRaw: item.options || [],
      answerIndexRaw: item.answerIndex,
      explanationRaw: item.explanation || "",
      gpcReferenceRaw: item.gpcReference || ""
    });
  });
  return rows;
}

function flattenRowsFromText(filePath, defaultSpecialty = "") {
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/).map(line => String(line || "").trim());

  const rows = [];
  let tema = "";
  let subtema = "";
  let difficulty = "";
  let caseText = "";
  let mode = "";
  let currentQuestion = null;

  const pushQuestion = () => {
    if (!currentQuestion || !caseText) {
      currentQuestion = null;
      return;
    }
    rows.push({
      source: path.basename(filePath),
      rowIndex: rows.length,
      questionIndex: rows.length,
      specialtyRaw: defaultSpecialty || "",
      temaRaw: cleanInline(tema),
      subtemaRaw: cleanInline(subtema),
      difficultyRaw: difficulty,
      caseRaw: cleanInline(caseText),
      questionRaw: cleanInline(currentQuestion.question),
      optionsRaw: currentQuestion.options.slice(),
      answerIndexRaw: currentQuestion.answerIndex,
      explanationRaw: cleanInline(currentQuestion.explanation),
      gpcReferenceRaw: ""
    });
    currentQuestion = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    if (line.includes("----------------Page")) continue;

    if (/^Tema:/i.test(line)) {
      pushQuestion();
      tema = cleanInline(line.replace(/^Tema:\s*/i, ""));
      subtema = "";
      difficulty = "";
      caseText = "";
      mode = "";
      continue;
    }
    if (/^Subtema:/i.test(line)) {
      subtema = cleanInline(line.replace(/^Subtema:\s*/i, ""));
      continue;
    }
    if (/^Dificultad:/i.test(line) || /^Grado de dificultad:/i.test(line)) {
      difficulty = cleanInline(line.split(":").slice(1).join(":"));
      continue;
    }
    if (/^Caso cl/i.test(line)) {
      mode = "case_text";
      continue;
    }
    if (
      /^Pregunta\s*\d+/i.test(line) ||
      /^Pregunta\s*\d*\s*:/i.test(line) ||
      /^Pregunta$/i.test(line) ||
      /^Pregunta\./i.test(line)
    ) {
      pushQuestion();
      currentQuestion = {
        question: cleanInline(line.replace(/^Pregunta\s*\d*\s*:?/i, "")),
        options: [],
        answerIndex: 0,
        explanation: ""
      };
      mode = "question";
      continue;
    }
    if (/^Retroalimentaci/i.test(line)) {
      mode = "feedback";
      continue;
    }

    const optionMatch = line.match(/^([A-Ea-e])\)\s*(.*)$/);
    if (optionMatch && currentQuestion) {
      mode = "options";
      let optionText = cleanInline(optionMatch[2]);
      let isCorrect = false;
      if (optionText.startsWith("*")) {
        isCorrect = true;
        optionText = cleanInline(optionText.slice(1));
      }
      if (optionText.endsWith("*")) {
        isCorrect = true;
        optionText = cleanInline(optionText.slice(0, -1));
      }
      if (isCorrect) currentQuestion.answerIndex = currentQuestion.options.length;
      currentQuestion.options.push(optionText);
      continue;
    }

    if (mode === "case_text") {
      caseText += (caseText ? " " : "") + line;
      continue;
    }
    if (mode === "question" && currentQuestion) {
      currentQuestion.question += (currentQuestion.question ? " " : "") + line;
      continue;
    }
    if (mode === "options" && currentQuestion && currentQuestion.options.length > 0) {
      let continuation = cleanInline(line);
      let isCorrect = false;
      if (continuation.endsWith("*")) {
        isCorrect = true;
        continuation = cleanInline(continuation.slice(0, -1));
      }
      currentQuestion.options[currentQuestion.options.length - 1] += ` ${continuation}`;
      if (isCorrect) currentQuestion.answerIndex = currentQuestion.options.length - 1;
      continue;
    }
    if (mode === "feedback" && currentQuestion) {
      currentQuestion.explanation += (currentQuestion.explanation ? " " : "") + line;
      continue;
    }

    if (
      !mode &&
      /^(Paciente|Mujer|Hombre|Masculino|Femenina|Femenino|Recien|Reci[eé]n|Escolar|Lactante|Nino|Ni[ñn]o)/i.test(line)
    ) {
      mode = "case_text";
      caseText += (caseText ? " " : "") + line;
      continue;
    }
  }

  pushQuestion();
  return rows;
}

function normalizeOptions(optionsRaw, answerIndexRaw) {
  const optionsInput = Array.isArray(optionsRaw) ? optionsRaw : [];
  const cleanedOptions = [];
  const seen = new Set();

  optionsInput.forEach((opt) => {
    const cleaned = cleanInline(opt);
    const key = normalizeTextKey(cleaned);
    if (!cleaned || !key) return;
    if (seen.has(key)) return;
    seen.add(key);
    cleanedOptions.push(cleaned);
  });

  if (cleanedOptions.length < 4) return null;

  const parsed = Number.isInteger(answerIndexRaw)
    ? answerIndexRaw
    : parseInt(String(answerIndexRaw), 10);
  const answerIndexInput = Number.isInteger(parsed) && parsed >= 0 && parsed < optionsInput.length
    ? parsed
    : 0;
  const correctRaw = cleanInline(optionsInput[answerIndexInput] || cleanedOptions[0]);
  const correctKey = normalizeTextKey(correctRaw);

  if (cleanedOptions.length === 4) {
    let answerIndex = cleanedOptions.findIndex(opt => normalizeTextKey(opt) === correctKey);
    if (answerIndex < 0 || answerIndex > 3) answerIndex = 0;
    return { options: cleanedOptions, answerIndex };
  }

  let correctOption = cleanedOptions.find(opt => normalizeTextKey(opt) === correctKey);
  if (!correctOption) correctOption = cleanedOptions[0];
  const reduced = [correctOption];
  for (let i = 0; i < cleanedOptions.length; i++) {
    const opt = cleanedOptions[i];
    if (normalizeTextKey(opt) === normalizeTextKey(correctOption)) continue;
    reduced.push(opt);
    if (reduced.length === 4) break;
  }
  if (reduced.length !== 4) return null;
  return { options: reduced, answerIndex: 0 };
}

function keywordScore(text, keywords) {
  let score = 0;
  keywords.forEach((kw) => {
    if (text.includes(kw)) score += 1;
  });
  return score;
}

function isDiarrheaContext(row) {
  const caseText = normalizeTextKey(row.caseRaw);
  const questionText = normalizeTextKey(row.questionRaw);
  const explanationText = normalizeTextKey(row.explanationRaw);
  const qeText = `${questionText} ${explanationText}`.trim();

  const caseScore = keywordScore(caseText, DIARRHEA_KEYWORDS);
  const qeScore = keywordScore(qeText, DIARRHEA_KEYWORDS);
  const unrelatedScore = keywordScore(qeText, UNRELATED_KEYWORDS);

  if (unrelatedScore >= 1 && qeScore === 0) return false;
  return caseScore >= 1 && qeScore >= 1;
}

function isPediatricContext(row) {
  const specialtyRaw = normalizeTextKey(row.specialtyRaw || "");
  if (specialtyRaw === "ped" || specialtyRaw.includes("pediatr")) return true;

  const text = normalizeTextKey([
    row.temaRaw,
    row.subtemaRaw,
    row.caseRaw,
    row.questionRaw,
    row.explanationRaw
  ].join(" "));

  if (/gestante|embarazo|puerper|sdg/.test(text) && !/lactante|neonato|recien nacido/.test(text)) {
    return false;
  }

  if (PED_KEYWORDS.some(kw => text.includes(kw))) return true;

  const yearMatches = String(row.caseRaw || "").match(/\b(\d{1,2})\s*(anos|años)\b/gi) || [];
  for (const raw of yearMatches) {
    const num = parseInt(raw, 10);
    if (Number.isFinite(num) && num <= 17) return true;
  }

  const monthMatches = String(row.caseRaw || "").match(/\b(\d{1,3})\s*meses\b/gi) || [];
  for (const raw of monthMatches) {
    const num = parseInt(raw, 10);
    if (Number.isFinite(num) && num <= 216) return true;
  }

  return false;
}

function hasClinicalData(caseText) {
  return (
    /\b\d{1,3}\s*(anos|años|meses|semanas|dias)\b/i.test(caseText) ||
    /\b\d{2,3}\s*\/\s*\d{2,3}\b/.test(caseText) ||
    /\b\d+(?:[.,]\d+)?\s*(kg|g|cm|mmhg|mg\/dl|lpm|rpm|%)\b/i.test(caseText)
  );
}

function scoreQuality(caseText, questionText, explanationText, gpcRef) {
  let score = 0;
  score += Math.min(30, Math.floor(caseText.length / 8));
  score += Math.min(25, Math.floor(explanationText.length / 10));
  score += Math.min(10, Math.floor(questionText.length / 12));
  score += Math.min(8, Math.floor(gpcRef.length / 20));
  if (hasClinicalData(caseText)) score += 10;
  if (/[?¿]/.test(questionText)) score += 3;
  return score;
}

function scoreDiarrheaRelevance(questionText, explanationText) {
  const text = normalizeTextKey(`${questionText} ${explanationText}`);
  let score = keywordScore(text, DIARRHEA_KEYWORDS);
  if (text.includes("diarrea")) score += 2;
  if (text.includes("deshidrat")) score += 1;
  if (text.includes("rehidrat") || text.includes("sro")) score += 1;
  return score;
}

function inferSubtopic(row) {
  const text = normalizeTextKey([
    row.temaRaw,
    row.subtemaRaw,
    row.caseRaw,
    row.questionRaw,
    row.explanationRaw
  ].join(" "));

  if (/plan a|plan b|plan c|rehidrat|sro|hidratacion/.test(text)) return "Planes de Hidratación";
  if (/enteroinvas|disenter|sangre en heces|shigella/.test(text)) return "Diarrea Enteroinvasiva";
  if (/celiac|gluten/.test(text)) return "Enfermedad Celíaca";
  if (/intoxicacion alimentaria|toxiinfeccion/.test(text)) return "Intoxicaciones Alimentarias";
  if (/cronica|mas de 14 dias|mas de 2 semanas/.test(text)) return "Diarreas Agudas y Crónicas";
  if (/rotavirus|norovirus|adenovirus|viral/.test(text)) return "Diarreas Agudas y Crónicas";
  return "Introducción a Diarreas";
}

function normalizeDifficulty(value, qualityScore) {
  const key = normalizeTextKey(value);
  if (key.includes("alta") || key.includes("muy alta")) return "alta";
  if (key.includes("media")) return "media";
  if (key.includes("baja")) return "media";
  return qualityScore >= 58 ? "alta" : "media";
}

function normalizeGpcReference(rawReference) {
  const cleaned = cleanInline(rawReference);
  if (cleaned.length >= 20) return cleaned;
  return "GPC CENETEC vigente para Enfermedad Diarreica Aguda en menores de 5 anos y lineamientos nacionales de hidratacion oral (Plan A, B y C).";
}

function toQuestionRecord(candidate) {
  return {
    specialty: "ped",
    case: candidate.caseText,
    question: candidate.questionText,
    options: candidate.options,
    answerIndex: candidate.answerIndex,
    explanation: candidate.explanationText,
    gpcReference: candidate.gpcReference,
    tema: OFFICIAL_TOPIC,
    temaCanonical: OFFICIAL_TOPIC,
    subtemaCanonical: candidate.subtopic,
    subtema: candidate.subtopic,
    specialtyOriginal: candidate.specialtyRaw || "ped",
    temaOriginal: candidate.temaRaw || OFFICIAL_TOPIC,
    subtemaOriginal: candidate.subtemaRaw || candidate.subtopic,
    difficulty: candidate.difficulty
  };
}

function buildMarkdown(summary) {
  const lines = [];
  lines.push("# Informe tanda diarrea pediatrica");
  lines.push("");
  lines.push(`- Fecha: ${summary.generatedAt}`);
  lines.push(`- Solicitados: ${summary.requested}`);
  lines.push(`- Agregados: ${summary.added}`);
  lines.push(`- Banco antes: ${summary.initialBank}`);
  lines.push(`- Banco despues: ${summary.finalBank}`);
  lines.push(`- Pool curado: ${summary.curatedPool}`);
  lines.push(`- Dry run: ${summary.dryRun ? "si" : "no"}`);
  lines.push("");
  lines.push("## Subtemas");
  lines.push("");
  summary.bySubtopic.forEach((row) => {
    lines.push(`- ${row.subtema}: ${row.total}`);
  });
  lines.push("");
  lines.push("## Fuentes");
  lines.push("");
  summary.bySource.forEach((row) => {
    lines.push(`- ${row.source}: ${row.total}`);
  });
  lines.push("");
  lines.push("## Rechazos");
  lines.push("");
  Object.entries(summary.rejectedByReason)
    .sort((a, b) => b[1] - a[1])
    .forEach(([reason, total]) => lines.push(`- ${reason}: ${total}`));
  lines.push("");
  return lines.join("\n");
}

function main() {
  const count = Math.max(1, toInt(getArg("--count", String(DEFAULT_COUNT)), DEFAULT_COUNT));
  const dryRun = hasFlag("--dry-run");

  const existing = parseQuestionsArray(QUESTIONS_PATH);
  const existingCoreSig = new Set();
  existing.forEach((item) => {
    const sig = stripNumericVariants([item.case || "", item.question || ""].join(" | "));
    if (sig) existingCoreSig.add(sig);
  });

  const rejectedByReason = {
    not_diarrhea_context: 0,
    not_pediatric_context: 0,
    invalid_options_or_structure: 0,
    low_quality_content: 0,
    duplicate_existing_core_signature: 0,
    duplicate_pool_signature: 0,
    duplicate_pool_case_opening: 0,
    duplicate_pool_question_stem: 0,
    supplement_duplicate_or_low_quality: 0
  };

  const allRows = [];
  const sourceReadCounts = {};
  let totalRawRows = 0;

  JSON_SOURCES.forEach((file) => {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) return;
    const rows = flattenRowsFromJson(filePath);
    allRows.push(...rows);
    totalRawRows += rows.length;
    sourceReadCounts[path.basename(file)] = (sourceReadCounts[path.basename(file)] || 0) + rows.length;
  });

  TEXT_SOURCES.forEach((src) => {
    const filePath = path.join(ROOT, src.file);
    if (!fs.existsSync(filePath)) return;
    const rows = flattenRowsFromText(filePath, src.specialty);
    allRows.push(...rows);
    totalRawRows += rows.length;
    sourceReadCounts[path.basename(src.file)] = (sourceReadCounts[path.basename(src.file)] || 0) + rows.length;
  });

  const pool = [];
  const poolSigSet = new Set();
  const poolCaseOpeningSet = new Set();
  const poolStemSet = new Set();

  allRows.forEach((row) => {
    if (!isDiarrheaContext(row)) {
      rejectedByReason.not_diarrhea_context += 1;
      return;
    }
    if (!isPediatricContext(row)) {
      rejectedByReason.not_pediatric_context += 1;
      return;
    }

    const optionsInfo = normalizeOptions(row.optionsRaw, row.answerIndexRaw);
    const caseText = cleanInline(row.caseRaw);
    const questionText = cleanInline(row.questionRaw);
    const explanationText = cleanInline(row.explanationRaw);

    if (
      !optionsInfo ||
      caseText.length < 120 ||
      questionText.length < 20 ||
      explanationText.length < 40 ||
      !hasClinicalData(caseText)
    ) {
      rejectedByReason.invalid_options_or_structure += (!optionsInfo ? 1 : 0);
      rejectedByReason.low_quality_content += (optionsInfo ? 1 : 0);
      return;
    }

    const gpcReference = normalizeGpcReference(row.gpcReferenceRaw);
    const qualityScore = scoreQuality(caseText, questionText, explanationText, gpcReference);
    if (qualityScore < 50) {
      rejectedByReason.low_quality_content += 1;
      return;
    }

    const coreSignature = stripNumericVariants([caseText, questionText].join(" | "));
    const caseOpening = stripNumericVariants(caseText.slice(0, 180));
    const stemKey = stripNumericVariants(questionText);

    if (existingCoreSig.has(coreSignature)) {
      rejectedByReason.duplicate_existing_core_signature += 1;
      return;
    }
    if (poolSigSet.has(coreSignature)) {
      rejectedByReason.duplicate_pool_signature += 1;
      return;
    }
    if (caseOpening && poolCaseOpeningSet.has(caseOpening)) {
      rejectedByReason.duplicate_pool_case_opening += 1;
      return;
    }
    if (stemKey && poolStemSet.has(stemKey)) {
      rejectedByReason.duplicate_pool_question_stem += 1;
      return;
    }

    poolSigSet.add(coreSignature);
    if (caseOpening) poolCaseOpeningSet.add(caseOpening);
    if (stemKey) poolStemSet.add(stemKey);

    const subtopic = inferSubtopic(row);
    const difficulty = normalizeDifficulty(row.difficultyRaw, qualityScore);
    pool.push({
      source: row.source,
      specialtyRaw: cleanInline(row.specialtyRaw),
      temaRaw: cleanInline(row.temaRaw),
      subtemaRaw: cleanInline(row.subtemaRaw),
      subtopic,
      caseText,
      questionText,
      options: optionsInfo.options,
      answerIndex: optionsInfo.answerIndex,
      explanationText,
      gpcReference,
      difficulty,
      qualityScore,
      relevanceScore: scoreDiarrheaRelevance(questionText, explanationText)
    });
  });

  SUPPLEMENT_SCENARIOS.forEach((scenario) => {
    const caseText = cleanInline(scenario.case);
    const questionText = cleanInline(scenario.question);
    const explanationText = cleanInline(scenario.explanation);
    const optionsInfo = normalizeOptions(scenario.options, scenario.answerIndex);
    if (
      !optionsInfo ||
      caseText.length < 120 ||
      questionText.length < 20 ||
      explanationText.length < 40 ||
      !hasClinicalData(caseText)
    ) {
      rejectedByReason.supplement_duplicate_or_low_quality += 1;
      return;
    }

    const coreSignature = stripNumericVariants([caseText, questionText].join(" | "));
    const caseOpening = stripNumericVariants(caseText.slice(0, 180));
    const stemKey = stripNumericVariants(questionText);
    if (
      existingCoreSig.has(coreSignature) ||
      poolSigSet.has(coreSignature) ||
      (caseOpening && poolCaseOpeningSet.has(caseOpening)) ||
      (stemKey && poolStemSet.has(stemKey))
    ) {
      rejectedByReason.supplement_duplicate_or_low_quality += 1;
      return;
    }

    poolSigSet.add(coreSignature);
    if (caseOpening) poolCaseOpeningSet.add(caseOpening);
    if (stemKey) poolStemSet.add(stemKey);

    const gpcReference = normalizeGpcReference(scenario.gpcReference || "");
    const qualityScore = scoreQuality(caseText, questionText, explanationText, gpcReference);
    pool.push({
      source: "synthetic_ped_diarrhea",
      specialtyRaw: "ped",
      temaRaw: OFFICIAL_TOPIC,
      subtemaRaw: scenario.subtopic || "Introducción a Diarreas",
      subtopic: scenario.subtopic || "Introducción a Diarreas",
      caseText,
      questionText,
      options: optionsInfo.options,
      answerIndex: optionsInfo.answerIndex,
      explanationText,
      gpcReference,
      difficulty: normalizeDifficulty(scenario.difficulty || "", qualityScore),
      qualityScore,
      relevanceScore: scoreDiarrheaRelevance(questionText, explanationText)
    });
  });

  pool.sort((a, b) => {
    if ((b.relevanceScore || 0) !== (a.relevanceScore || 0)) return (b.relevanceScore || 0) - (a.relevanceScore || 0);
    if (b.qualityScore !== a.qualityScore) return b.qualityScore - a.qualityScore;
    if (b.explanationText.length !== a.explanationText.length) return b.explanationText.length - a.explanationText.length;
    return b.caseText.length - a.caseText.length;
  });
  const orderedPool = [
    ...pool.filter(item => item.source === "synthetic_ped_diarrhea"),
    ...pool.filter(item => item.source !== "synthetic_ped_diarrhea")
  ];

  const maxPerSource = Math.max(8, Math.ceil(count / 3));
  const maxPerSubtopic = Math.max(8, Math.ceil(count / 4));

  const selected = [];
  const sourceCount = {};
  const subtopicCount = {};

  for (let i = 0; i < orderedPool.length && selected.length < count; i++) {
    const c = orderedPool[i];
    const sourceLimit = c.source === "synthetic_ped_diarrhea" ? count : maxPerSource;
    if ((sourceCount[c.source] || 0) >= sourceLimit) continue;
    if ((subtopicCount[c.subtopic] || 0) >= maxPerSubtopic) continue;
    selected.push(c);
    sourceCount[c.source] = (sourceCount[c.source] || 0) + 1;
    subtopicCount[c.subtopic] = (subtopicCount[c.subtopic] || 0) + 1;
  }

  for (let i = 0; i < orderedPool.length && selected.length < count; i++) {
    const c = orderedPool[i];
    if (selected.includes(c)) continue;
    if ((subtopicCount[c.subtopic] || 0) >= maxPerSubtopic * 2) continue;
    selected.push(c);
    sourceCount[c.source] = (sourceCount[c.source] || 0) + 1;
    subtopicCount[c.subtopic] = (subtopicCount[c.subtopic] || 0) + 1;
  }

  for (let i = 0; i < orderedPool.length && selected.length < count; i++) {
    const c = orderedPool[i];
    if (selected.includes(c)) continue;
    selected.push(c);
  }

  const selectedTrimmed = selected.slice(0, count);
  const newQuestions = selectedTrimmed.map(toQuestionRecord);

  const finalQuestions = dryRun ? existing : existing.concat(newQuestions);
  if (!dryRun && newQuestions.length > 0) {
    writeQuestionsArray(QUESTIONS_PATH, finalQuestions);
  }

  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
  const suffix = dryRun ? "dry" : "live";

  const bySubtopic = Object.entries(
    selectedTrimmed.reduce((acc, item) => {
      acc[item.subtopic] = (acc[item.subtopic] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).map(([subtema, total]) => ({ subtema, total }));

  const bySource = Object.entries(
    selectedTrimmed.reduce((acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).map(([source, total]) => ({ source, total }));

  const summary = {
    generatedAt: new Date().toISOString(),
    dryRun,
    requested: count,
    added: newQuestions.length,
    initialBank: existing.length,
    finalBank: finalQuestions.length,
    topic: OFFICIAL_TOPIC,
    totalRawRows,
    sourceReadCounts,
    curatedPool: pool.length,
    bySubtopic,
    bySource,
    rejectedByReason,
    quality: {
      average: selectedTrimmed.length
        ? Number((selectedTrimmed.reduce((acc, item) => acc + item.qualityScore, 0) / selectedTrimmed.length).toFixed(2))
        : 0,
      min: selectedTrimmed.length ? Math.min(...selectedTrimmed.map(item => item.qualityScore)) : 0,
      max: selectedTrimmed.length ? Math.max(...selectedTrimmed.map(item => item.qualityScore)) : 0
    },
    sampleCases: selectedTrimmed.slice(0, 12).map((item, idx) => ({
      index: idx + 1,
      source: item.source,
      subtopic: item.subtopic,
      question: item.questionText,
      qualityScore: item.qualityScore
    }))
  };

  const summaryJsonPath = path.join(REPORTS_DIR, `ped_diarrhea_curated40_summary_${suffix}.json`);
  const summaryMdPath = path.join(REPORTS_DIR, `ped_diarrhea_curated40_summary_${suffix}.md`);
  const casesJsonPath = path.join(REPORTS_DIR, `ped_diarrhea_curated40_cases_${suffix}.json`);

  fs.writeFileSync(summaryJsonPath, JSON.stringify(summary, null, 2), "utf8");
  fs.writeFileSync(summaryMdPath, buildMarkdown(summary), "utf8");
  fs.writeFileSync(casesJsonPath, JSON.stringify(newQuestions, null, 2), "utf8");

  console.log(JSON.stringify({
    dryRun,
    requested: count,
    added: newQuestions.length,
    initialBank: existing.length,
    finalBank: finalQuestions.length,
    curatedPool: pool.length,
    report: path.relative(ROOT, summaryJsonPath),
    cases: path.relative(ROOT, casesJsonPath)
  }, null, 2));
}

main();
