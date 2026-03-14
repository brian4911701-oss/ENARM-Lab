/**
 * fix_topics.js
 * =============
 * Corrige los campos `tema` y `specialty` en questions.js.
 * El problema principal: muchas preguntas tienen un `tema` que no corresponde
 * al contenido del caso clínico (e.g., artritis reumatoide etiquetada como
 * "Lupus Eritematoso Sistémico").
 *
 * Estrategia:
 * 1. Para cada pregunta, concatenar el texto del caso + pregunta.
 * 2. Pasar por un mapa de palabras clave -> tema correcto.
 * 3. Si se detecta un tema diferente al actual, actualizar.
 * 4. Corregir el specialty basándose en patrones de contenido.
 */

const fs = require('fs');
const path = require('path');

const questionsPath = path.join(__dirname, 'questions.js');
let raw = fs.readFileSync(questionsPath, 'utf8');

// Extraer el array JSON de QUESTIONS
const startIdx = raw.indexOf('[');
const endIdx = raw.lastIndexOf(']') + 1;
const jsonStr = raw.substring(startIdx, endIdx);
let questions;
try {
    questions = JSON.parse(jsonStr);
} catch (e) {
    console.error('Error parseando questions.js:', e.message);
    process.exit(1);
}

console.log(`Total preguntas cargadas: ${questions.length}`);

// =====================================================================
// MAPA DE PALABRAS CLAVE -> TEMA
// Ordenado de más específico a más general.
// =====================================================================
const TOPIC_RULES = [
    // ── GINECOLOGÍA Y OBSTETRICIA ─────────────────────────────────────
    { keywords: ['preeclampsia', 'eclampsia', 'sulfato de magnesio', 'hipertension en el embarazo', 'hipertensión en el embarazo', 'hellp'], tema: 'Patología del Embarazo: Estados Hipertensivos', specialty: 'gyo' },
    { keywords: ['embarazo ectopico', 'embarazo ectópico', 'trompa de falopio', 'salpinogooforitomy', 'salpingooforectomia'], tema: 'Embarazo ectópico (Hemorragias del Primer Trimestre)', specialty: 'gyo' },
    { keywords: ['aborto', 'amenaza de aborto', 'pérdida gestacional', 'perdida gestacional'], tema: 'Aborto (Hemorragias del Primer Trimestre)', specialty: 'gyo' },
    { keywords: ['placenta previa'], tema: 'Placenta previa (Hemorragias del Segundo Trimestre)', specialty: 'gyo' },
    { keywords: ['desprendimiento prematuro de placenta', 'dppni', 'abruptio placentae', 'abruption'], tema: 'DPPNI (Hemorragias del Segundo Trimestre)', specialty: 'gyo' },
    { keywords: ['mola hidatidiforme', 'enfermedad trofoblastica', 'enfermedad trofoblástica'], tema: 'Enf. Trofoblástica (Hemorragias del Primer Trimestre)', specialty: 'gyo' },
    { keywords: ['papanicolaou', 'cancer cervicouterino', 'cáncer cervicouterino', 'cacu', 'colposcopia', 'leibg', 'liebg', 'cancer cervical', 'cáncer cervical', 'neoplasia intraepitelial cervical', 'nic '], tema: 'CACU (Oncología Ginecológica)', specialty: 'gyo' },
    { keywords: ['cancer de endometrio', 'cáncer de endometrio', 'sangrado postmenopausico', 'sangrado posmenopausico', 'sangrado postmenopáusico', 'sangrado posmenopáusico'], tema: 'CA de endometrio y CA de ovario (Oncología Ginecológica)', specialty: 'gyo' },
    { keywords: ['cancer de ovario', 'cáncer de ovario', 'tumor de ovario', 'quiste de ovario maligno'], tema: 'CA de endometrio y CA de ovario (Oncología Ginecológica)', specialty: 'gyo' },
    { keywords: ['ruptura prematura de membranas', 'rpm ', 'rotura prematura de membranas'], tema: 'RPM (Parto Prematuro y Patología Coriónica)', specialty: 'gyo' },
    { keywords: ['parto prematuro', 'amenaza de parto prematuro', 'trabajo de parto pretermino', 'trabajo de parto pretérmino'], tema: 'Parto prematuro (Parto Prematuro y Patología Coriónica)', specialty: 'gyo' },
    { keywords: ['hiperémesis gravídica', 'hiperemesis gravidica', 'vomito incoercible en el embarazo', 'vómito incoercible en el embarazo'], tema: 'Hiperémesis gravídica (Control Prenatal)', specialty: 'gyo' },
    { keywords: ['diabetes gestacional', 'diabetes en el embarazo', 'curva de tolerancia a la glucosa en embarazada', 'iadpsg'], tema: 'Diabetes Gestacional', specialty: 'gyo' },
    { keywords: ['hemorragia obstetrica', 'hemorragia obstétrica', 'atonia uterina', 'atonía uterina', 'acretismo placentario'], tema: 'Hemorragia obsétrica Atonía, trauma, tejido, coagulopatías (Patología Puerperal)', specialty: 'gyo' },
    { keywords: ['sindrome climaterico', 'síndrome climatérico', 'menopausia', 'climaterio', 'sofocos', 'bochornos', 'terapia hormonal sustitutiva', 'terapia hormonal de reemplazo'], tema: 'Sx climatérico (Patología Menopausia y Climaterio)', specialty: 'gyo' },
    { keywords: ['endometriosis'], tema: 'Endometriosis (Sangrados Uterinos Anormales: Origen No Anatómico)', specialty: 'gyo' },
    { keywords: ['mioma', 'miomatosis', 'leiomioma uterino'], tema: 'Miomatosis (Sangrados Uterinos Anormales: Origen Anatómico No Maligno)', specialty: 'gyo' },
    { keywords: ['cancer de mama', 'cáncer de mama', 'carcinoma mamario', 'carcinoma de mama'], tema: 'Cáncer de Mama', specialty: 'gyo' },
    { keywords: ['vaginosis bacteriana', 'gardnerella vaginalis', 'criterios de amsel', 'olor a aminas', 'flujo maloliente vaginal'], tema: 'Cervicovaginitis bacteriana (Patología Infecciosa Cervical)', specialty: 'gyo' },
    { keywords: ['candidiasis vaginal', 'candida vaginal', 'fluor blanco grumoso'], tema: 'Cándida (Patología Infecciosa Cervical)', specialty: 'gyo' },
    { keywords: ['tricomoniasis'], tema: 'Trichomonas (Patología Infecciosa Cervical)', specialty: 'gyo' },
    { keywords: ['enfermedad pelvica inflamatoria', 'enfermedad pélvica inflamatoria', 'epi ', 'salpingitis'], tema: 'Enfermedad pélvica inflamatoria (Patología Infecciosa Cervical)', specialty: 'gyo' },
    { keywords: ['control prenatal', 'consulta prenatal', 'primigesta', 'semanas de gestacion', 'semanas de gestación', 'gestante', 'embarazada', 'gesta '], tema: 'Control Prenatal', specialty: 'gyo' },
    { keywords: ['trabajo de parto', 'cervix borrado', 'cérvix borrado', 'dilatacion cervical', 'dilatación cervical', 'borramiento cervical'], tema: 'Trabajo de Parto', specialty: 'gyo' },
    { keywords: ['cesarea', 'cesárea'], tema: 'Cesárea (Patología de Trabajo de Parto)', specialty: 'gyo' },
    { keywords: ['mastitis', 'absceso mamario'], tema: 'Mastitis puerperal y no puerperal (Patología Mamaria Benigna)', specialty: 'gyo' },

    // ── PEDIATRÍA ──────────────────────────────────────────────────────
    { keywords: ['estenosis hipertrofica de piloro', 'estenosis hipertrófica de píloro', 'oliva pilorica', 'oliva pilórica', 'vomito en proyectil', 'vómito en proyectil', 'vomito en proyectil no bilioso', 'piloromiotomia', 'piloromiotomía'], tema: 'Estenosis Hipertrófica del Píloro', specialty: 'ped' },
    { keywords: ['hernia diafragmatica congenita', 'hernia diafragmática congénita', 'bochdalek', 'bochdalek', 'abdomen escafoide del recien nacido'], tema: 'Hernias diafragmáticas (Patología Neonatal)', specialty: 'ped' },
    { keywords: ['atresia duodenal', 'doble burbuja'], tema: 'A. duodenal (Patología Neonatal)', specialty: 'ped' },
    { keywords: ['invaginacion intestinal', 'intususepcion', 'intususcepcion', 'invaginación intestinal', 'jalea de grosella'], tema: 'Invaginación intestinal (Patología Gastrointestinal del Pediátrico)', specialty: 'ped' },
    { keywords: ['ictericia neonatal', 'ictericia del recién nacido', 'ictericia del recien nacido', 'bilirrubina neonatal', 'coombs directo', 'incompatibilidad abo', 'incompatibilidad rh'], tema: 'Ictericia Neonatal', specialty: 'ped' },
    { keywords: ['bronquiolitis', 'virus sincitial respiratorio', 'vsr '], tema: 'Bronquiolitis (Patología Respiratoria del Lactante y Preescolar)', specialty: 'ped' },
    { keywords: ['croup', 'laringotraqueitis', 'laringotraqueobronquitis', 'estridoren pediatricos', 'estridor infantil'], tema: 'Laringotraqueítis (Patología Respiratoria del Lactante y Preescolar)', specialty: 'ped' },
    { keywords: ['epiglotitis', 'posicion de tripode', 'posición de trípode', 'haemophilus influenzae b'], tema: 'Epiglotitis (Patología Respiratoria del Lactante y Preescolar)', specialty: 'ped' },
    { keywords: ['deshidratacion en nino', 'deshidratación en niño', 'plan a diarrea', 'plan b diarrea', 'plan c diarrea', 'vida suero oral', 'rehidratacion oral pediatrica', 'rehidratación oral pediátrica'], tema: 'Planes de hidratación (Diarrea en el Pediátrico)', specialty: 'ped' },
    { keywords: ['recien nacido', 'recién nacido', 'neonato ', 'rn de', 'rn con'], tema: 'Recién Nacido Sano', specialty: 'ped' },
    { keywords: ['lactante', 'escolar de ', 'preescolar de', 'nino de ', 'niño de ', 'pediatrico', 'pediátrico'], tema: 'Crecimiento y Desarrollo', specialty: 'ped' },
    { keywords: ['sarampion', 'sarampión', 'rubeola', 'rubéola', 'varicela', 'exantema subito', 'exantema súbito', 'roséola', 'roseola', 'escarlatina', 'kawasaki', 'mano pie boca', 'mano-pie-boca', 'coxsackie', 'eritema infeccioso'], tema: 'Enfermedades Exantemáticas', specialty: 'ped' },
    { keywords: ['glomerulonefritis postestrepotococica', 'glomerulonefritis postestreptocócica', 'glomerulonefritis postinfecciosa', 'sindrome nefritico', 'síndrome nefrítico'], tema: 'Sx nefríticos (Nefrología)', specialty: 'ped' },
    { keywords: ['sindrome nefrotico', 'síndrome nefrótico', 'cambios minimos'], tema: 'Sx nefrótico (Nefrología)', specialty: 'ped' },

    // ── CIRUGÍA ────────────────────────────────────────────────────────
    { keywords: ['apendicitis aguda', 'apendicitis', 'mcburney', 'blumberg', 'rovsing', 'appendicitis'], tema: 'Apendicitis', specialty: 'cir' },
    { keywords: ['hernia inguinal', 'hernia crural', 'hernia femoral', 'hernia umbilical', 'hernia epigastrica', 'hernia epigástrica', 'hernias de la pared abdominal'], tema: 'Hernias / Esplenectomía', specialty: 'cir' },
    { keywords: ['pancreatitis aguda', 'pancreatitis cronica', 'pancreatitis crónica', 'lipasa serica', 'lipasa sérica'], tema: 'Pancreatitis aguda y crónica (Patología Pancreática)', specialty: 'cir' },
    { keywords: ['colecistitis', 'colelitiasis', 'coledocolitiasis', 'litiasis biliar', 'vesicula biliar', 'vesícula biliar', 'celulas de murphy', 'signo de murphy'], tema: 'Patología Biliar', specialty: 'cir' },
    { keywords: ['obstruccion intestinal', 'obstrucción intestinal', 'bridas', 'adherencias postquirurgicas', 'adherencias postquirúrgicas', 'volvulo', 'vólvulo'], tema: 'Obstrucción intestinal (Patología Intestinal Qx)', specialty: 'cir' },
    { keywords: ['diverticulitis', 'diverticulosis', 'enfermedad diverticular', 'hinchey'], tema: 'Diverticulitis (Patología Diverticular)', specialty: 'cir' },
    { keywords: ['quemadura', 'quemaduras', 'regla de los nueve', 'superficie corporal quemada', 'escarotomia', 'escarotomía'], tema: 'Quemaduras / Golpe de Calor / Hipotermia', specialty: 'cir' },
    { keywords: ['neumatax a tension', 'neumotorax a tension', 'neumotórax a tensión', 'hemotorax', 'hemotórax', 'taponamiento cardiaco', 'taponamiento cardíaco', 'torax inestable', 'tórax inestable'], tema: 'Trauma torácico Neumotórax a tensión, taponamiento cardíaco, hemotórax masivo, neumotórax abierto, tórax inestable (ATLS)', specialty: 'cir' },
    { keywords: ['trauma abdominal', 'bazo lesionado', 'organo mas frecuentemente lesionado', 'órgano más frecuentemente lesionado', 'traumatismo abdominal'], tema: 'Trauma abdominal, Fx de cadera, trauma genitourinario, ATLS en la embarazada (ATLS)', specialty: 'cir' },
    { keywords: ['cancer de colon', 'cáncer de colon', 'cancer colorrectal', 'cáncer colorrectal', 'adenocarcinoma de colon'], tema: 'CA de colon y recto (Cirugía Oncología)', specialty: 'cir' },
    { keywords: ['mieloma multiple', 'mieloma múltiple', 'componente m', 'pico monoclonal'], tema: 'Oncohematología', specialty: 'cir' },
    { keywords: ['fractura de cadera', 'fractura de femur', 'fractura de fémur', 'fractura de extremidades inferiores'], tema: 'Fx de cadera (Patología de Extremidad Inferior)', specialty: 'cir' },
    { keywords: ['varices esofagicas', 'várices esofágicas', 'hipertension portal', 'hipertensión portal', 'hemorragia variceal'], tema: 'STDA por várices esofágicas (Cirrosis y sus Complicaciones / Trasplante Hepático)', specialty: 'cir' },
    { keywords: ['cirrosis hepatica', 'cirrosis hepática', 'ascitis', 'encefalopatia hepatica', 'encefalopatía hepática', 'hepatopatia cronica', 'hepatopatía crónica'], tema: 'Cirrosis y sus Complicaciones / Trasplante Hepático', specialty: 'cir' },

    // ── MEDICINA INTERNA ──────────────────────────────────────────────
    { keywords: ['infarto agudo de miocardio', 'iamcest', 'iamsest', 'infarto al miocardio', 'elevacion del segmento st', 'elevación del segmento st', 'sindrome coronario', 'síndrome coronario'], tema: 'Síndromes Coronarios', specialty: 'mi' },
    { keywords: ['fibrilacion auricular', 'fibrilación auricular', 'flutter auricular', 'taquicardia supraventricular', 'arritmia'], tema: 'Trastornos del Ritmo', specialty: 'mi' },
    { keywords: ['insuficiencia cardiaca', 'insuficiencia cardíaca', 'falla cardiaca', 'fraccion de eyeccion', 'fracción de eyección'], tema: 'Insuficiencia Cardíaca Aguda y Crónica', specialty: 'mi' },
    { keywords: ['hipertension arterial', 'hipertensión arterial', 'hipertenso', 'hipertensa'], tema: 'Hipertensión Arterial', specialty: 'mi' },
    { keywords: ['diabetes mellitus tipo 1', 'diabetes mellitus tipo 2', 'cetoacidosis diabetica', 'cetoacidosis diabética', 'estado hiperosmolar', 'glucosa en ayuno', 'hemoglobina glucosilada', 'hba1c'], tema: 'Diabetes', specialty: 'mi' },
    { keywords: ['hipotiroidismo', 'tiroides hipotiroidismo', 'hashimoto', 'hipotiroideo', 'hipotiroidea'], tema: 'Hipotiroidismo (Patología Tiroidea)', specialty: 'mi' },
    { keywords: ['hipertiroidismo', 'enfermedad de graves', 'tirotoxicosis', 'dolor tiroideo'], tema: 'Hipertiroidismo: Enfermedad de Graves (Patología Tiroidea)', specialty: 'mi' },
    { keywords: ['lupus eritematoso sistemico', 'lupus eritematoso sistémico', 'les ', 'anticuerpo anti-smith', 'anti-dsdna', 'anti-dsdna', 'rash malar', 'eritema en mariposa', 'eritema malar'], tema: 'LES (Reumatología)', specialty: 'mi' },
    { keywords: ['artritis reumatoide', 'artritis reumatoidea', 'factor reumatoide', 'rigidez matutina articular', 'metotrexato artritis', 'dme artritis', 'fame artritis'], tema: 'Artritis reumatoide (Reumatología)', specialty: 'mi' },
    { keywords: ['vih', 'sida', 'linfocitos cd4', 'virus de la inmunodeficiencia humana', 'infección por vih', 'western blot vih'], tema: 'Virus de la Inmunodeficiencia Humana', specialty: 'mi' },
    { keywords: ['tuberculosis pulmonar', 'mycobacterium tuberculosis', 'baciloscopía', 'baciloscopia', 'baar', 'cavitaciones apice', 'cavitaciones ápice', 'dots tuberculosis'], tema: 'Tuberculosis', specialty: 'mi' },
    { keywords: ['epoc', 'enfermedad pulmonar obstructiva cronica', 'enfermedad pulmonar obstructiva crónica', 'fev1', 'espirometria obstructiva', 'espirometría obstructiva'], tema: 'EPOC / CA de Pulmón', specialty: 'mi' },
    { keywords: ['asma bronquial', 'asma ', 'broncoespasmo', 'salbutamol', 'β2 agonista'], tema: 'Asma en el Adulto y Pediátrico', specialty: 'mi' },
    { keywords: ['tromboembolia pulmonar', 'tep ', 'trombosis venosa profunda', 'tvp ', 's1q3t3', 'angiotomografia pulmonar'], tema: 'Tromboembolia pulmonar (Patología Arterial y Venosa)', specialty: 'mi' },
    { keywords: ['neumonia', 'neumonía', 'consolidacion pulmonar', 'consolidación pulmonar', 'streptococcus pneumoniae', 'legionella', 'mycoplasma pneumoniae'], tema: 'Neumonías', specialty: 'mi' },
    { keywords: ['evento cerebrovascular', 'infarto cerebral', 'ictus isquemico', 'ictus isquémico', 'evc ', 'rt-pa', 'fibrinolisis cerebral', 'hemiparesia hemiplejia', 'afasia de broca', 'afasia de wernicke'], tema: 'EVC Isquémico y Hemorrágico', specialty: 'mi' },
    { keywords: ['meningitis bacteriana', 'meningitis por criptococo', 'cryptococcus neoformans', 'meningitis aseptica', 'meningitis aséptica', 'rigidez de nuca', 'signo de kernig', 'signo de brudzinski'], tema: 'Introducción MI / Introducción Infectología', specialty: 'mi' },
    { keywords: ['insuficiencia renal cronica', 'insuficiencia renal crónica', 'enfermedad renal cronica', 'enfermedad renal crónica', 'diálisis', 'dialisis', 'hiperkalemia', 'hiperpotasemia'], tema: 'Nefrología', specialty: 'mi' },
    { keywords: ['litiasis renal', 'litiasis urinaria', 'colico renoureteral', 'cólico renoureteral', 'urotomografia', 'urotomografía', 'microhematuria'], tema: 'Litiasis renal (Urología)', specialty: 'mi' },
    { keywords: ['anemia ferropenica', 'anemia ferropénica', 'microcítica hipocrómica', 'ferritina baja', 'anemia por deficiencia de hierro'], tema: 'Anemia ferropénica (Anemias Introducción y Anemias Carenciales)', specialty: 'mi' },
    { keywords: ['anemia megaloblastica', 'anemia megaloblástica', 'deficiencia de vitamina b12', 'deficiencia de acido folico', 'deficiencia de ácido fólico', 'macrocítica'], tema: 'Anemia megaloblástica (Anemias Introducción y Anemias Carenciales)', specialty: 'mi' },
    { keywords: ['trastorno de panico', 'trastorno de pánico', 'ataque de panico', 'ataque de pánico', 'fobia social', 'ansiedad generalizada', 'trastorno de ansiedad'], tema: 'Psiquiatría', specialty: 'mi' },
    { keywords: ['encefalopatia de wernicke', 'encefalopatía de wernicke', 'tiamina alcoholismo', 'wernicke korsakoff'], tema: 'Psiquiatría', specialty: 'mi' },
    { keywords: ['delirium tremens', 'sindrome de abstinencia alcoholica', 'síndrome de abstinencia alcohólica'], tema: 'Psiquiatría', specialty: 'mi' },
    { keywords: ['hepatitis B', 'hepatitis C', 'hepatitis viral', 'hepatitis A'], tema: 'Hepatitis agudas y crónicas (Patología Hepática)', specialty: 'mi' },
    { keywords: ['ulcera peptica', 'úlcera péptica', 'gastritis cronica', 'gastritis crónica', 'helicobacter pylori', 'helicobacter pylori'], tema: 'Úlcera péptica duodenal y gástrica (Patología Gástrica)', specialty: 'mi' },
    { keywords: ['cohorte prospectivo', 'casos y controles', 'diseno de estudio', 'diseño de estudio', 'estudio clinico', 'estudio clínico', 'epidemiologia', 'epidemiología', 'incidencia acumulada', 'prevalencia'], tema: 'Epidemiología', specialty: 'mi' },
    { keywords: ['sangrado transvaginal postmenopausico', 'sangrado transvaginal posmenopausico', 'biopsia endometrial'], tema: 'CA de endometrio y CA de ovario (Oncología Ginecológica)', specialty: 'gyo' },

    // ── SALUD PÚBLICA ─────────────────────────────────────────────────
    { keywords: ['vacuna', 'esquema de vacunacion', 'esquema de vacunación', 'pentavalente', 'bcg ', 'sabin', 'srp ', 'hepatitis b recien nacido', 'rotavirus vacuna'], tema: 'Vacunación', specialty: 'sp' },

    // ── URGENCIAS ─────────────────────────────────────────────────────
    { keywords: ['organofosforado', 'intoxicacion por organofosforado', 'intoxicación por organofosforado', 'sindrome colinergico', 'síndrome colinérgico', 'atropina antidoto', 'atropina antídoto'], tema: 'Intoxicaciones', specialty: 'urg' },
    { keywords: ['intoxicacion por paracetamol', 'intoxicación por paracetamol', 'n-acetilcisteina', 'n-acetilcisteína', 'hepatotoxicidad por acetaminofen', 'hepatotoxicidad por acetaminofén'], tema: 'Intoxicaciones', specialty: 'urg' },
    { keywords: ['intoxicacion por asa', 'intoxicación por asa', 'salicilismo'], tema: 'Intoxicaciones', specialty: 'urg' },
    { keywords: ['naloxona', 'sobredosis opioide', 'depresion respiratoria por opioides', 'depresión respiratoria por opioides'], tema: 'Intoxicaciones', specialty: 'urg' },
];

// =====================================================================
// Función principal de clasificación
// =====================================================================
function detectTemaAndSpecialty(q) {
    const text = [
        q.case || '',
        q.question || '',
        (q.options || []).join(' '),
        q.explanation || '',
        q.gpcReference || ''
    ].join(' ').toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''); // quitar acentos para comparación

    for (const rule of TOPIC_RULES) {
        for (const kw of rule.keywords) {
            const kwNorm = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (text.includes(kwNorm)) {
                return { tema: rule.tema, specialty: rule.specialty };
            }
        }
    }

    return null; // No se encontró coincidencia
}

// =====================================================================
// Corrección de specialty cuando tema fue extraído de gpcReference erróneamente
// =====================================================================
function fixSpecialtyFromTema(tema) {
    if (!tema) return null;
    const t = tema.toLowerCase();

    if (t.includes('ginecol') || t.includes('obstetric') || t.includes('prenatal') ||
        t.includes('embarazo') || t.includes('parto') || t.includes('endometrio') ||
        t.includes('cervic') || t.includes('uterino') || t.includes('ovario') ||
        t.includes('mama ')) return 'gyo';

    if (t.includes('pediatric') || t.includes('pediátric') || t.includes('lactante') ||
        t.includes('neonatal') || t.includes('recien nacido') || t.includes('escolar') ||
        t.includes('preescolar') || t.includes('hirschsprung') || t.includes('bronquiolitis') ||
        t.includes('invaginacion') || t.includes('píloro') || t.includes('pilorico')) return 'ped';

    if (t.includes('apendicitis') || t.includes('hernia') || t.includes('pancreatitis') ||
        t.includes('colecistitis') || t.includes('quemadura') || t.includes('trauma') ||
        t.includes('obstruccion intestinal') || t.includes('cirrosis') || t.includes('varices') ||
        t.includes('diverticulitis')) return 'cir';

    if (t.includes('vacunacion') || t.includes('vacunación') || t.includes('salud publica')) return 'sp';

    if (t.includes('intoxicacion') || t.includes('intoxicación')) return 'urg';

    return 'mi'; // Default: Medicina Interna
}

// =====================================================================
// Ejecutar corrección
// =====================================================================
let fixed = 0;
let temaFixed = 0;
let specialtyFixed = 0;

questions.forEach((q, idx) => {
    const detected = detectTemaAndSpecialty(q);

    if (detected) {
        // Corregir tema
        if (q.tema !== detected.tema) {
            console.log(`[${idx}] TEMA: "${q.tema}" → "${detected.tema}" | case: ${(q.case || '').substring(0, 60)}...`);
            q.tema = detected.tema;
            temaFixed++;
        }
        // Corregir specialty
        if (q.specialty !== detected.specialty) {
            console.log(`[${idx}] SPEC: "${q.specialty}" → "${detected.specialty}" | case: ${(q.case || '').substring(0, 60)}...`);
            q.specialty = detected.specialty;
            specialtyFixed++;
        }
    } else if (q.tema) {
        // Si no se detectó nada nuevo pero hay tema, intentar corregir specialty basado en tema actual
        const inferredSpec = fixSpecialtyFromTema(q.tema);
        if (inferredSpec && q.specialty !== inferredSpec) {
            console.log(`[${idx}] SPEC (por tema): "${q.specialty}" → "${inferredSpec}" | tema: ${q.tema}`);
            q.specialty = inferredSpec;
            specialtyFixed++;
        }
    }
});

fixed = temaFixed + specialtyFixed;
console.log(`\n✅ Correcciones realizadas: ${fixed} total (${temaFixed} temas, ${specialtyFixed} especialidades)`);

// =====================================================================
// Escribir el archivo corregido
// =====================================================================
const newContent = '// questions.js – Banco de reactivos para ENARMlab\nconst QUESTIONS = ' +
    JSON.stringify(questions, null, 2) + ';\n';

// Hacer backup
fs.writeFileSync(questionsPath + '.bak', raw, 'utf8');
console.log(`\nBackup guardado en questions.js.bak`);

fs.writeFileSync(questionsPath, newContent, 'utf8');
console.log(`✅ questions.js actualizado con ${questions.length} preguntas.`);
