// questions.js – Banco de reactivos para ENARMlab
const QUESTIONS = [
  {
    "specialty": "mi",
    "case": "Paciente masculino de 58 años con antecedentes de hipertensión arterial y tabaquismo activo. Acude a urgencias por presentar dolor precordial opresivo de gran intensidad (9/10), irradiado a mandíbula y brazo izquierdo, de 45 minutos de evolución, acompañado de diaforesis. El ECG muestra elevación del segmento ST de 3mm en V1-V4.",
    "question": "¿Cuál es el diagnóstico más probable y la conducta inicial más adecuada?",
    "options": [
      "Angina inestable; iniciar aspirina y observar.",
      "IAM con elevación del ST (Anterior); iniciar terapia de reperfusión inmediata (Fibrinolisis o ICP).",
      "Disección aórtica; solicitar TC de tórax urgente.",
      "Pericarditis aguda; administrar AINEs y colchicina."
    ],
    "answerIndex": 1,
    "explanation": "La presencia de dolor típico, factores de riesgo y elevación del ST en cara anterior (V1-V4) confirma un IAMCEST. El tiempo es músculo; la reperfusión es la prioridad absoluta.",
    "gpcReference": "GPC Diagnóstico y Tratamiento del Infarto Agudo de Miocardio con Elevación del Segmento ST."
  },
  {
    "specialty": "mi",
    "case": "Mujer de 24 años con diagnóstico reciente de Diabetes Mellitus tipo 1. Es llevada a urgencias por presentar náuseas, vómito, dolor abdominal difuso y respiración profunda y rápida (Kussmaul). Laboratorios: Glucosa 450 mg/dL, pH 7.15, HCO3 10 mEq/L, cetonas en orina +++.",
    "question": "¿Cuál es el pilar fundamental del tratamiento inicial en este cuadro de Cetoacidosis Diabética?",
    "options": [
      "Insulina en esquema de escala móvil inmediatamente.",
      "Administración de bicarbonato de sodio para corregir el pH.",
      "Hidratación agresiva con solución salina al 0.9% (Reposición de volumen).",
      "Antibioticoterapia empírica de amplio espectro."
    ],
    "answerIndex": 2,
    "explanation": "En CAD, el primer paso es la restauración del volumen extracelular para mejorar la perfusión renal y disminuir los niveles de hormonas contrarreguladoras.",
    "gpcReference": "NOM-015-SSA2-2010, Para la prevención, tratamiento y control de la diabetes mellitus.",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "mi",
    "case": "Masculino de 34 años con pérdida de peso de 6 kg en el último mes, diaforesis nocturna y tos productiva con hemoptisis ocasional. Refiere contacto estrecho con un familiar con síntomas similares. Radiografía de tórax revela cavitaciones en ápice derecho.",
    "question": "¿Cuál es el método diagnóstico inicial de elección según la NOM?",
    "options": [
      "Cultivo de Lowenstein-Jensen.",
      "Baciloscopia en serie de tres (BAAR).",
      "Prueba de tuberculina (PPD).",
      "PCR para Mycobacterium tuberculosis."
    ],
    "answerIndex": 1,
    "explanation": "En pacientes sintomáticos respiratorios con sospecha de TB pulmonar, el estudio inicial más rápido y costo-efectivo es la baciloscopia en serie de tres.",
    "gpcReference": "NOM-006-SSA2-2013, Para la prevención y control de la tuberculosis."
  },
  {
    "specialty": "mi",
    "case": "Paciente de 72 años con antecedente de fibrilación auricular no anticoagulada. Súbitamente presenta hemiparesia izquierda, desviación de la mirada a la derecha y afasia motora. Al llegar a urgencias han pasado 2 horas del inicio.",
    "question": "¿Cuál es la medida terapéutica más importante en este momento si la TC descarta hemorragia?",
    "options": [
      "Iniciar antiagregación con clopidogrel.",
      "Terapia fibrinolítica intravenosa (rt-PA).",
      "Control agresivo de la TA para bajarla a 120/80 mmHg.",
      "Administración de manitol para el edema cerebral."
    ],
    "answerIndex": 1,
    "explanation": "Dada la ventana terapéutica (<4.5 horas) y el origen isquémico probable por FA, la fibrinólisis es el tratamiento de elección para reperfusión cerebral.",
    "gpcReference": "GPC Diagnóstico y Tratamiento del Infarto Cerebral Isquémico."
  },
  {
    "specialty": "mi",
    "case": "Masculino de 29 años, usuario de drogas intravenosas, acude por fiebre persistente de 3 semanas, pérdida de peso y candidiasis orofaríngea. Se le realiza prueba diagnóstica resultando positiva.",
    "question": "¿Cuál es la prueba confirmatoria estándar para el diagnóstico de infección por VIH según la normativa mexicana?",
    "options": [
      "Prueba rápida de 4ta generación.",
      "Carga viral plasmática.",
      "Western Blot o Inmunoensayo Lineal (LIA).",
      "Conteo de linfocitos CD4."
    ],
    "answerIndex": 2,
    "explanation": "Aunque las pruebas de 4ta generación son altamente sensibles, el Western Blot o LIA siguen siendo las pruebas confirmatorias clásicas ante un tamizaje positivo.",
    "gpcReference": "NOM-010-SSA2-2010, Para la prevención y el control de la infección por Virus de la Inmunodeficiencia Humana.",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "gyo",
    "case": "Primigesta de 32 semanas de gestación que acude a consulta por cefalea intensa, acúfenos y fosfenos. TA central de 165/115 mmHg en dos tomas separadas por 15 minutos. El examen de orina muestra proteinuria de 3+.",
    "question": "¿Cuál es el fármaco de elección para la prevención de crisis convulsivas en esta paciente?",
    "options": [
      "Diazepam 10 mg IV.",
      "Fenitoína sódica.",
      "Sulfato de magnesio (Esquema Zuspan o Pritchard).",
      "Labetalol IV."
    ],
    "answerIndex": 2,
    "explanation": "El sulfato de magnesio es el estándar de oro para prevenir la eclampsia en pacientes con preeclampsia con datos de severidad.",
    "gpcReference": "GPC Prevención, Diagnóstico y Tratamiento de la Preeclampsia y Eclampsia."
  },
  {
    "specialty": "gyo",
    "case": "Mujer de 52 años que acude por presentar sofocos intensos que interrumpen el sueño, sequedad vaginal y labilidad emocional. No ha tenido menstruación en los últimos 14 meses. No tiene antecedentes de cáncer ni trombosis.",
    "question": "¿Cuál es el tratamiento de elección para el síndrome climatérico en esta paciente con útero íntegro?",
    "options": [
      "Estrógenos conjugados vía oral (monoterapia).",
      "Terapia hormonal combinada (Estrógenos + Progestágenos).",
      "Fluoxetina para el control de síntomas.",
      "Calcio y Vitamina D únicamente."
    ],
    "answerIndex": 1,
    "explanation": "En mujeres con útero, los estrógenos deben combinarse siempre con progestágenos para prevenir la hiperplasia o cáncer de endometrio.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Perimenopausia y Postmenopausia."
  },
  {
    "specialty": "gyo",
    "case": "Embarazada de 26 semanas acude a su control prenatal. Se le realiza una prueba de tamizaje para Diabetes Gestacional con una carga de 75g de glucosa. Los resultados son: Ayuno 90 mg/dL, 1 hora 185 mg/dL, 2 horas 155 mg/dL.",
    "question": "¿Cuál es el diagnóstico en esta paciente?",
    "options": [
      "Curva normal; continuar control prenatal estándar.",
      "Diabetes Gestacional (al tener un valor alterado).",
      "Intolerancia a los carbohidratos.",
      "Diabetes Mellitus pregestacional."
    ],
    "answerIndex": 1,
    "explanation": "Según los criterios de la IADPSG adoptados en México, un solo valor alterado en la curva de 75g (en este caso a la hora >180) hace el diagnóstico de DG.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Diabetes en el Embarazo.",
    "tema": "Diabetes Gestacional"
  },
  {
    "specialty": "ped",
    "case": "Lactante masculino de 3 meses es llevado a consulta por presentar coriza y tos de 2 días de evolución, que progresa a dificultad respiratoria. Exploración: FR 62 rpm, sibilancias espiratorias bilaterales y estertores crepitantes finos. Es el primer episodio de sibilancias del paciente.",
    "question": "¿Cuál es el diagnóstico clínico y el agente etiológico más común?",
    "options": [
      "Asma bronquial; Alérgenos.",
      "Bronquiolitis aguda; Virus Sincitial Respiratorio (VSR).",
      "Neumonía típica; Streptococcus pneumoniae.",
      "Laringotraqueitis; Virus Parainfluenza."
    ],
    "answerIndex": 1,
    "explanation": "El primer episodio de sibilancias en un menor de 2 años precedido por síntomas de vía aérea superior es diagnóstico de bronquiolitis, siendo el VSR el agente causal en >80% de los casos.",
    "gpcReference": "GPC Diagnóstico y Manejo de la Bronquiolitis Aguda en Niños.",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "ped",
    "case": "Se recibe en consulta a lactante de 6 meses para revisión de niño sano y administración de vacunas. Según el Esquema Nacional de Vacunación en México, ¿cuáles vacunas le corresponden este mes?",
    "question": "¿Qué vacunas debe recibir el paciente?",
    "options": [
      "Hepatitis B y Sabin.",
      "Pentavalente acelular (3ra dosis), Hepatitis B (3ra dosis), Rotavirus (3ra dosis opcional según esquema) e Influenza (si es temporada).",
      "SRP (Sarampión, Rubéola, Parotiditis).",
      "BCG y VPH."
    ],
    "answerIndex": 1,
    "explanation": "A los 6 meses el esquema marca la 3ra dosis de Pentavalente y Hepatitis B, además del inicio de Influenza.",
    "gpcReference": "NOM-036-SSA2-2012, Prevención y control de enfermedades. Aplicación de vacunas.",
    "tema": "Vacunación"
  },
  {
    "specialty": "ped",
    "case": "Lactante de 14 meses con cuadro de diarrea acuosa de 5 evacuaciones al día y 2 vómitos. A la exploración: ojos ligeramente hundidos, boca seca, llora con pocas lágrimas, se muestra irritable pero bebe agua con avidez.",
    "question": "¿Qué Plan de Rehidratación de la GPC y NOM-031 le corresponde?",
    "options": [
      "Plan A: Manejo en el hogar con Vida Suero Oral después de cada evacuación.",
      "Plan B: Rehidratación oral con Vida Suero Oral (50-100 ml/kg en 4 horas) en la unidad de salud.",
      "Plan C: Rehidratación parenteral con Solución Hartmann inmediata.",
      "Ayuno estricto por 12 horas."
    ],
    "answerIndex": 1,
    "explanation": "Presenta datos de deshidratación moderada (irritable, sed, ojos hundidos) sin choque, lo cual indica Plan B.",
    "gpcReference": "NOM-031-SSA2-1999, Para la atención a la salud del niño."
  },
  {
    "specialty": "cir",
    "case": "Masculino de 21 años que inicia con dolor tipo cólico de localización periumbilical que horas después migra a fosa iliaca derecha. Presenta náuseas, vómito en una ocasión y febrícula de 37.8°C. A la exploración física: Signo de McBurney (+), Blumberg (+).",
    "question": "¿Cuál es el estudio de imagen inicial recomendado en un paciente adulto con sospecha clínica de apendicitis aguda?",
    "options": [
      "Radiografía simple de abdomen.",
      "Ultrasonido abdominal.",
      "Tomografía Computarizada (TC) de abdomen con contraste.",
      "Resonancia Magnética."
    ],
    "answerIndex": 2,
    "explanation": "En adultos masculinos, la TC tiene la mayor sensibilidad y especificidad (>95%) para el diagnóstico de apendicitis aguda.",
    "gpcReference": "GPC Diagnóstico de Apendicitis Aguda.",
    "tema": "Apendicitis Aguda"
  },
  {
    "specialty": "cir",
    "case": "Masculino de 28 años traído a urgencias tras accidente en motocicleta. Se encuentra consciente pero ansioso. TA 80/40 mmHg, FC 130 lpm, ruidos respiratorios ausentes en hemitórax derecho con hiperresonancia a la percusión.",
    "question": "¿Cuál es la conducta inmediata de mayor prioridad?",
    "options": [
      "Solicitar radiografía de tórax portátil.",
      "Intubación orotraqueal.",
      "Descompresión inmediata con aguja en el tórax (Neumotórax a tensión).",
      "Laparotomía exploradora."
    ],
    "answerIndex": 2,
    "explanation": "El cuadro de choque obstructivo con ausencia de ruidos y timpanismo sugiere neumotórax a tensión. Es una emergencia clínica.",
    "gpcReference": "Manual ATLS (Advanced Trauma Life Support), 10ma Edición.",
    "tema": "Nefrología: Enfermedad Renal Crónica"
  },
  {
    "specialty": "cir",
    "case": "Paciente de 30 años que sufre quemadura por fuego directo en todo el brazo derecho y la cara anterior del tronco.",
    "question": "De acuerdo con la Regla de los Nueves, ¿cuál es el porcentaje de superficie corporal quemada (SCQ)?",
    "options": [
      "18%",
      "27%",
      "36%",
      "45%"
    ],
    "answerIndex": 1,
    "explanation": "Regla de los 9: Brazo 9%, Tronco Anterior 18%. Total: 27%.",
    "gpcReference": "GPC Diagnóstico y Tratamiento del Paciente con Quemaduras Graves."
  },
  {
    "specialty": "cir",
    "case": "Masculino de 60 años que presenta aumento de volumen en región inguinal derecha que llega hasta el escroto, aparece al realizar esfuerzo y reduce espontáneamente. Atraviesa el anillo inguinal profundo.",
    "question": "¿Cuál es el diagnóstico más probable?",
    "options": [
      "Hernia Inguinal Directa.",
      "Hernia Inguinal Indirecta.",
      "Hernia Crural.",
      "Varicocele."
    ],
    "answerIndex": 1,
    "explanation": "Las hernias indirectas pasan por el anillo inguinal profundo, siendo las más comunes.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de Hernias Inguinales."
  },
  {
    "specialty": "mi",
    "case": "Femenino de 45 años con fatiga, aumento de peso, estreñimiento e intolerancia al frío de 6 meses de evolución. Exploración: bradicardia, piel seca y tiroides discretamente aumentada de consistencia.",
    "question": "¿Cuál es el perfil tiroideo esperado en este paciente con Hipotiroidismo Primario?",
    "options": [
      "TSH disminuida, T4L aumentada.",
      "TSH aumentada, T4L disminuida.",
      "TSH normal, T4L disminuida.",
      "TSH aumentada, T4L aumentada."
    ],
    "answerIndex": 1,
    "explanation": "En el hipotiroidismo primario ( Hashimoto es la causa más común en zonas no deficientes de yodo), la glándula no produce suficiente hormona, lo que eleva la TSH por retroalimentación negativa.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de Hipotiroidismo Primario."
  },
  {
    "specialty": "mi",
    "case": "Masculino de 68 años con antecedente de HAS y DM2 acude por presentar palpitaciones y disnea de medianos esfuerzos. El ECG muestra ausencia de ondas P y ritmo irregular con QRS estrecho, FC 120 lpm.",
    "question": "¿Cuál es el diagnóstico y la primera acción terapéutica para control de la frecuencia?",
    "options": [
      "Taquicardia ventricular; Lidocaína.",
      "Fibrilación auricular; Betabloqueadores o Calcioantagonistas.",
      "Flutter auricular; Cardioversión eléctrica inmediata.",
      "Bloqueo AV de tercer grado; Atropina."
    ],
    "answerIndex": 1,
    "explanation": "La ausencia de ondas P y el ritmo 'irregularmente irregular' es patognomónico de fibrilación auricular. El control de la frecuencia es el primer paso en pacientes estables.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Fibrilación Auricular.",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "mi",
    "case": "Femenino de 30 años con artritis simétrica de pequeñas articulaciones (manos y pies) de 3 meses de duración, acompañada de rigidez matutina mayor a 1 hora. Factor reumatoide positivo.",
    "question": "¿Cuál es el fármaco modificador de la enfermedad (FAME) de primera línea?",
    "options": [
      "Prednisona dosis altas.",
      "Celecoxib.",
      "Metotrexato.",
      "Infliximab."
    ],
    "answerIndex": 2,
    "explanation": "El metotrexato es el estándar de oro inicial para el tratamiento de la artritis reumatoide para prevenir el daño articular irreversible.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de Artritis Reumatoide."
  },
  {
    "specialty": "mi",
    "case": "Paciente con antecedente de alcoholismo crónico acude por hematemesis masiva y melena. Presenta estigmas de hepatopatía crónica como telangiectasias y ascitis. TA 90/50 mmHg.",
    "question": "¿Cuál es la causa más probable del sangrado y la medida farmacológica inmediata?",
    "options": [
      "Úlcera péptica; Omeprazol IV.",
      "Varices esofágicas; Terlipresina u Octreotide + Endoscopia.",
      "Desgarro de Mallory-Weiss; Observación.",
      "Gastritis erosiva; Antiácidos."
    ],
    "answerIndex": 1,
    "explanation": "En un paciente cirrótico con hemorragia digestiva alta, la ruptura de varices esofágicas es la causa más grave. La terlipresina ayuda a disminuir la presión portal.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de Varices Esofágicas."
  },
  {
    "specialty": "mi",
    "case": "Masculino de 25 años con diagnóstico de VIH que presenta cefalea intensa, fiebre y signos meníngeos. Se realiza punción lumbar con tinción de Tinta China resultando positiva para levaduras encapsuladas.",
    "question": "¿Cuál es el agente causal y el tratamiento de inducción?",
    "options": [
      "Streptococcus pneumoniae; Ceftriaxona.",
      "Cryptococcus neoformans; Anfotericina B + Flucitosina.",
      "Toxoplasma gondii; Pirimetamina.",
      "Mycobacterium tuberculosis; DOTS."
    ],
    "answerIndex": 1,
    "explanation": "La meningitis por criptococo es una infección oportunista común en SIDA. La tinción de tinta china es altamente específica.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de Criptococosis Meníngea en pacientes con VIH."
  },
  {
    "specialty": "gyo",
    "case": "Gesta 2 de 39 semanas de gestación en fase activa de trabajo de parto. Presenta sangrado transvaginal oscuro, dolor abdominal súbito y útero hipertónico (leñoso). Se observa bradicardia fetal persistente.",
    "question": "¿Cuál es el diagnóstico más probable?",
    "options": [
      "Placenta previa.",
      "Desprendimiento prematuro de placenta normoinserta (DPPNI).",
      "Ruptura uterina.",
      "Vasa previa."
    ],
    "answerIndex": 1,
    "explanation": "El sangrado oscuro, la hipertonía uterina y el compromiso fetal son clásicos del DPPNI (Abruptio Placentae).",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Hemorragia Obstétrica en el Segundo Trimestre."
  },
  {
    "specialty": "gyo",
    "case": "Paciente de 25 años con amenorrea de 7 semanas, dolor anexial derecho intenso y manchado transvaginal. El USG muestra útero vacío y una masa anexial con presencia de líquido libre en fondo de saco. Prueba de embarazo (+) con hCG de 3000 mUI/ml.",
    "question": "¿Cuál es el diagnóstico y la conducta ante inestabilidad hemodinámica?",
    "options": [
      "Aborto en evolución; Legrado.",
      "Embarazo ectópico roto; Laparotomía exploradora urgente.",
      "Enfermedad trofoblástica gestacional; Aspiración manual endouterina.",
      "Quiste de ovario torcido; Analgesia."
    ],
    "answerIndex": 1,
    "explanation": "La tríada de amenorrea, dolor y masa anexial sugiere embarazo ectópico. Si hay líquido libre y dolor intenso, probablemente está roto, requiriendo cirugía urgente.",
    "gpcReference": "GPC Diagnóstico y Tratamiento del Embarazo Ectópico.",
    "tema": "Hemorragias del Primer Trimestre"
  },
  {
    "specialty": "gyo",
    "case": "Femenino de 20 años que acude a su primer tamizaje de cáncer cervicouterino. La citología cervical (Papanicolaou) reporta Lesión Intraepitelial Escamosa de Bajo Grado (LEIBG).",
    "question": "¿Cuál es la conducta a seguir según la norma oficial?",
    "options": [
      "Repetir citología en un año.",
      "Realizar colposcopia de forma inmediata.",
      "Histerectomía total.",
      "Tratamiento con antibióticos y repetir en 6 meses."
    ],
    "answerIndex": 1,
    "explanation": "Ante un reporte de LEIBG (o LIEBG) en la citología, el paso siguiente es la evaluación mediante colposcopia para dirigir biopsia si es necesario.",
    "gpcReference": "NOM-014-SSA2-1994, Para la prevención, detección, diagnóstico, tratamiento, control y vigilancia epidemiológica del cáncer cérvico uterino.",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "gyo",
    "case": "Gesta 1 de 12 semanas que acude por vómitos persistentes (>5 al día), imposibilidad para tolerar la vía oral y pérdida del 6% de su peso corporal. Laboratorios muestran cetonuria.",
    "question": "¿Cuál es el diagnóstico clínico?",
    "options": [
      "Emesis fisiológica del embarazo.",
      "Hiperémesis gravídica.",
      "Gastritis gestacional.",
      "Mola hidatidiforme."
    ],
    "answerIndex": 1,
    "explanation": "La hiperémesis gravídica se define por vómitos incoercibles, pérdida de peso >5% y alteraciones metabólicas (cetonuria/desequilibrio hidroelectrolítico).",
    "gpcReference": "GPC Control Prenatal con Enfoque de Riesgo.",
    "tema": "Nefrología: Enfermedad Renal Crónica"
  },
  {
    "specialty": "gyo",
    "case": "Paciente de 65 años con sangrado transvaginal postmenopáusico de 2 semanas de evolución. No usa terapia hormonal. Antecedente de obesidad y DM2.",
    "question": "¿Cuál es la primera patología a descartar mediante biopsia endometrial?",
    "options": [
      "Atrofia endometrial.",
      "Cáncer de endometrio.",
      "Miomatosis uterina.",
      "Vaginitis atrófica."
    ],
    "answerIndex": 1,
    "explanation": "Todo sangrado postmenopáusico es cáncer de endometrio hasta demostrar lo contrario, especialmente en pacientes con factores de riesgo como obesidad.",
    "gpcReference": "GPC Diagnóstico y Tratamiento del Cáncer de Endometrio."
  },
  {
    "specialty": "ped",
    "case": "Recién nacido de 2 semanas que presenta vómito de contenido gástrico (no biliar), postprandial inmediato, en proyectil. A la exploración se palpa una masa olivar en epigastrio.",
    "question": "¿Cuál es el diagnóstico clínico y el estudio de imagen inicial?",
    "options": [
      "Reflujo gastroesofágico; Serie esofagogastroduodenal.",
      "Estenosis hipertrófica de píloro; Ultrasonido abdominal.",
      "Atresia duodenal; Radiografía de abdomen (Doble burbuja).",
      "Vólvulo intestinal; Colon por enema."
    ],
    "answerIndex": 1,
    "explanation": "La clínica de vómito en proyectil no biliar y la 'oliva pilórica' es clásica de la estenosis de píloro entre la 2da y 6ta semana de vida.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Estenosis Hipertrófica de Píloro."
  },
  {
    "specialty": "ped",
    "case": "Niño de 3 años con fiebre de 39°C, odinofagia importante y babeo. Se encuentra en posición de trípode (inclinado hacia adelante). No tiene antecedentes de vacunación completos.",
    "question": "¿Cuál es el diagnóstico más probable y la conducta inmediata?",
    "options": [
      "Laringotraqueitis (Crup); Dexametasona.",
      "Epiglotitis aguda; Asegurar vía aérea en quirófano.",
      "Cuerpo extraño en vía aérea; Maniobra de Heimlich.",
      "Amigdalitis pultácea; Penicilina benzatínica."
    ],
    "answerIndex": 1,
    "explanation": "La epiglotitis es una emergencia médica. La posición de trípode y el babeo indican una obstrucción inminente de la vía aérea superior por Haemophilus influenzae b.",
    "gpcReference": "GPC Diagnóstico y Manejo de la Epiglotitis Aguda.",
    "tema": "Vacunación"
  },
  {
    "specialty": "ped",
    "case": "Lactante de 18 meses que presenta fiebre de 3 días que cede súbitamente, seguido de la aparición de un exantema maculopapular rosado, no pruriginoso, que inicia en tronco.",
    "question": "¿Cuál es el diagnóstico clínico?",
    "options": [
      "Sarampión.",
      "Escarlatina.",
      "Exantema súbito (Roséola / 6ta enfermedad).",
      "Rubéola."
    ],
    "answerIndex": 2,
    "explanation": "El exantema súbito (HHV-6) se caracteriza por fiebre alta que desaparece justo cuando brotan las manchas en el tronco.",
    "gpcReference": "GPC Diagnóstico de Enfermedades Exantemáticas en la Infancia."
  },
  {
    "specialty": "ped",
    "case": "Escolar de 8 años con edema bipalpebral, hipertensión arterial y hematuria (orina color refresco de cola) tras haber padecido una faringoamigdalitis hace 2 semanas.",
    "question": "¿Cuál es el diagnóstico más probable?",
    "options": [
      "Síndrome nefrótico (Cambios mínimos).",
      "Glomerulonefritis postestreptocócica.",
      "Infección de vías urinarias.",
      "Litiasis renal."
    ],
    "answerIndex": 1,
    "explanation": "La tríada de edema, hipertensión y hematuria tras una infección por estreptococo define el síndrome nefrítico postestreptocócico.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Glomerulonefritis Postestreptocócica."
  },
  {
    "specialty": "ped",
    "case": "Recién nacido de 24 horas de vida. A la exploración física se detecta ausencia de aireación en pulmón izquierdo y ruidos cardiacos desplazados a la derecha. El abdomen se observa excavado.",
    "question": "¿Cuál es la sospecha diagnóstica?",
    "options": [
      "Agenesia pulmonar.",
      "Hernia diafragmática congénita (Bochdalek).",
      "Neumotórax espontáneo del RN.",
      "Enfermedad de membrana hialina."
    ],
    "answerIndex": 1,
    "explanation": "El abdomen excavado (escafoide) y la disnea con desplazamiento de ruidos cardiacos sugieren que las vísceras abdominales están en el tórax.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Hernia Diafragmática Congénita.",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "cir",
    "case": "Masculino de 50 años con dolor epigástrico intenso 'en cinturón' irradiado a espalda, tras ingesta copiosa de alcohol. Presenta náuseas y vómito. Exploración: Dolor a la palpación profunda en epigastrio, ruidos hidroaéreos disminuidos.",
    "question": "¿Cuál es el estudio de laboratorio con mayor especificidad para el diagnóstico de Pancreatitis Aguda?",
    "options": [
      "Amilasa sérica.",
      "Lipasa sérica.",
      "Transaminasas (TGO/TGP).",
      "Bilirrubinas totales."
    ],
    "answerIndex": 1,
    "explanation": "La lipasa es más específica y permanece elevada por más tiempo que la amilasa en cuadros de pancreatitis aguda.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Pancreatitis Aguda.",
    "tema": "Pancreatitis Aguda"
  },
  {
    "specialty": "cir",
    "case": "Paciente de 70 años con dolor en fosa iliaca izquierda, fiebre y estreñimiento de 3 días. La TC reporta inflamación pericólica con presencia de un pequeño absceso de 2cm cerca del sigmoides.",
    "question": "¿Cuál es el grado de Hinchey y la conducta inicial?",
    "options": [
      "Hinchey I; Antibioticoterapia IV y observación.",
      "Hinchey IV; Cirugía de Hartmann urgente.",
      "Hinchey II; Drenaje percutáneo.",
      "Diverticulosis simple; Dieta alta en fibra."
    ],
    "answerIndex": 0,
    "explanation": "Un pequeño absceso pericólico o flemón se clasifica como Hinchey I y suele responder a manejo médico conservador.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Enfermedad Diverticular del Colon.",
    "tema": "Nefrología: Enfermedad Renal Crónica"
  },
  {
    "specialty": "cir",
    "case": "Masculino de 40 años que tras esfuerzo físico presenta dolor intenso en región lumbar irradiado a testículo ipsilateral. Se observa inquieto, no encuentra posición de alivio. El EGO muestra microhematuria.",
    "question": "¿Cuál es el diagnóstico más probable y el estudio de imagen 'estándar de oro'?",
    "options": [
      "Torsión testicular; Ultrasonido Doppler.",
      "Cólico renoureteral; Urotomografía (TC no contrastada).",
      "Orquiepididimitis; Cultivo de secreción uretral.",
      "Hernia inguinal incarcerada; Maniobras de reducción."
    ],
    "answerIndex": 1,
    "explanation": "El dolor lumbar irradiado a genitales sin posición de alivio y hematuria es característico de litiasis urinaria. La TC es el estudio más sensible.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Litiasis Renal.",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "cir",
    "case": "Femenino de 45 años con antecedentes de cirugías abdominales previas. Acude por dolor abdominal tipo cólico, distensión marcada, vómitos de contenido intestinal y ausencia de canalización de gases en las últimas 12 horas.",
    "question": "¿Cuál es la causa más común de obstrucción de intestino delgado en este paciente?",
    "options": [
      "Hernias inguinales.",
      "Bridas y adherencias postquirúrgicas.",
      "Cáncer de colon.",
      "Vólvulo de sigmoides."
    ],
    "answerIndex": 1,
    "explanation": "En pacientes con cirugías abdominales previas, las adherencias son los causantes de más del 60-70% de las obstrucciones intestinales.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Obstrucción Intestinal.",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "mi",
    "case": "Masculino de 55 años con antecedente de tabaquismo y sedentarismo. Acude por dolor en pantorrilla derecha, edema y aumento de temperatura local tras viaje en avión de 12 horas. Signo de Homans (+).",
    "question": "¿Cuál es el diagnóstico de sospecha y el estudio inicial de elección?",
    "options": [
      "Celulitis; Cultivo de tejido.",
      "Trombosis Venosa Profunda (TVP); Ultrasonido Doppler venoso.",
      "Insuficiencia venosa crónica; Flebografía.",
      "Rotura de quiste de Baker; RM."
    ],
    "answerIndex": 1,
    "explanation": "La clínica de edema unilateral y dolor tras inmovilización prolongada sugiere TVP. El US Doppler es el estudio inicial estándar.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Enfermedad Tromboembólica Venosa."
  },
  {
    "specialty": "mi",
    "case": "Paciente de 62 años que súbitamente presenta disnea súbita, dolor torácico pleurítico y hemoptisis. ECG con patrón S1Q3T3. Antecedente de cirugía de cadera hace 1 semana.",
    "question": "¿Cuál es el diagnóstico más probable?",
    "options": [
      "Infarto agudo al miocardio.",
      "Tromboembolia pulmonar (TEP).",
      "Neumonía lobar.",
      "Neumotórax espontáneo."
    ],
    "answerIndex": 1,
    "explanation": "El patrón S1Q3T3, aunque poco sensible, es clásico en TEP. El antecedente quirúrgico reciente es un factor de riesgo mayor.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Tromboembolia Pulmonar Aguda.",
    "tema": "Patología de Extremidad Inferior"
  },
  {
    "specialty": "mi",
    "case": "Mujer de 28 años con astenia, adinamia y palidez cutáneo-mucosa. Laboratorios: Hb 9 g/dL, VCM 72 fL (microcítica), HCM 24 pg (hipocrómica), Ferritina disminuida.",
    "question": "¿Cuál es la causa más común de este tipo de anemia en mujeres en edad fértil?",
    "options": [
      "Deficiencia de vitamina B12.",
      "Pérdidas menstruales excesivas (Anemia ferropénica).",
      "Talasia.",
      "Enfermedad crónica."
    ],
    "answerIndex": 1,
    "explanation": "La anemia microcítica hipocrómica con ferritina baja confirma ferropenia, cuya causa principal en mujeres jóvenes es la pérdida sanguínea por menstruación.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Anemia Ferropénica."
  },
  {
    "specialty": "mi",
    "case": "Paciente masculino de 40 años que acude por poliuria, polidipsia y polifagia. Glucemia plasmática al azar de 220 mg/dL.",
    "question": "¿Cuál es el siguiente paso diagnóstico según la ADA y NOM-015?",
    "options": [
      "Repetir glucemia al azar en 24 horas.",
      "No requiere más pruebas; el diagnóstico de DM2 está establecido por síntomas + valor >200.",
      "Realizar curva de tolerancia a la glucosa.",
      "Solicitar Hemoglobina Glucosilada (HbA1c)."
    ],
    "answerIndex": 1,
    "explanation": "La presencia de síntomas clásicos (4 P's) + una glucemia al azar >200 mg/dL es diagnóstica de Diabetes sin necesidad de confirmación.",
    "gpcReference": "NOM-015-SSA2-2010, Para la prevención, tratamiento y control de la diabetes mellitus."
  },
  {
    "specialty": "sp",
    "case": "Se realiza un estudio para evaluar la asociación entre el consumo de tabaco y el desarrollo de cáncer de pulmón. Se seleccionan dos grupos: uno de fumadores y otro de no fumadores, y se les sigue durante 10 años.",
    "question": "¿Qué tipo de diseño de estudio se está utilizando?",
    "options": [
      "Casos y Controles.",
      "Cohorte Prospectivo.",
      "Ensayo Clínico Aleatorizado.",
      "Transversal."
    ],
    "answerIndex": 1,
    "explanation": "Los estudios que parten de la exposición (fumadores) y siguen a los sujetos hacia el futuro para ver el desenlace (cáncer) son estudios de cohorte.",
    "gpcReference": "Fundamentos de Epidemiología Clínica.",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "sp",
    "case": "En una comunidad se reportan 50 casos nuevos de Dengue en el mes de octubre. La población total es de 10,000 habitantes.",
    "question": "¿Qué medida de frecuencia se está calculando al decir '50 casos nuevos'?",
    "options": [
      "Prevalencia.",
      "Incidencia acumulada.",
      "Tasa de letalidad.",
      "Riesgo Relativo."
    ],
    "answerIndex": 1,
    "explanation": "La incidencia mide los casos nuevos que aparecen en una población en un periodo determinado.",
    "gpcReference": "Guía de Vigilancia Epidemiológica Integral de Dengue.",
    "tema": "Enfermedades transmitidas por Vector"
  },
  {
    "specialty": "ped",
    "case": "Niño de 5 años con fiebre, odinofagia y aparición de vesículas en paladar posterior y pilares amigdalinos (Herpangina). También presenta lesiones vesiculares en palmas y plantas.",
    "question": "¿Cuál es el agente etiológico más probable?",
    "options": [
      "Virus del Herpes Simple 1.",
      "Virus Coxsackie A16.",
      "Virus de la Varicela Zóster.",
      "Estreptococo del Grupo A."
    ],
    "answerIndex": 1,
    "explanation": "El síndrome de mano-pie-boca es causado principalmente por Coxsackie virus, especialmente el serotipo A16.",
    "gpcReference": "GPC Diagnóstico y Manejo de Infecciones de Vías Respiratorias Superiores.",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "ped",
    "case": "Recién nacido con ictericia que aparece a las 12 horas de vida. Madre grupo O+, RN grupo A+. Bilirrubina indirecta de 15 mg/dL. Prueba de Coombs directo positiva.",
    "question": "¿Cuál es el diagnóstico?",
    "options": [
      "Ictericia por leche materna.",
      "Ictericia fisiológica.",
      "Enfermedad hemolítica del RN por incompatibilidad ABO.",
      "Atresia de vías biliares."
    ],
    "answerIndex": 2,
    "explanation": "La ictericia en las primeras 24 horas y el Coombs (+) con incompatibilidad de grupo sugieren hemólisis inmunitaria.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Ictericia Neonatal."
  },
  {
    "specialty": "ped",
    "case": "Lactante de 8 meses con ataques de llanto paroxístico, encogimiento de piernas y evacuaciones en 'jalea de grosella'. Al examen se palpa masa en forma de salchicha en hipocondrio derecho.",
    "question": "¿Cuál es el diagnóstico más probable?",
    "options": [
      "Divertículo de Meckel.",
      "Invaginación intestinal (Intususcepción).",
      "Vólvulo de intestino medio.",
      "Apendicitis aguda."
    ],
    "answerIndex": 1,
    "explanation": "La tríada de dolor cólico, masa palpable y heces en jalea de grosella es patognomónica de invaginación intestinal.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Invaginación Intestinal."
  },
  {
    "specialty": "gyo",
    "case": "Mujer de 22 años con leucorrea de color blanco-grisáceo, maloliente (olor a pescado) que aumenta tras el coito. Al examen se observa flujo homogéneo y pH de 5.0. Prueba de KOH (+) con liberación de aminas.",
    "question": "¿Cuál es el diagnóstico y el tratamiento de elección?",
    "options": [
      "Candidiasis; Fluconazol.",
      "Tricomoniasis; Metronidazol dosis única.",
      "Vaginosis bacteriana (Gardnerella vaginalis); Metronidazol 500mg c/12h por 7 días.",
      "Clamidiasis; Doxiciclina."
    ],
    "answerIndex": 2,
    "explanation": "Los criterios de Amsel (pH >4.5, olor a aminas, células clave) confirman vaginosis bacteriana.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Infección Vaginal."
  },
  {
    "specialty": "gyo",
    "case": "Gesta 1 de 34 semanas. Acude por salida de líquido transvaginal de 4 horas de evolución. Se confirma ruptura prematura de membranas (RPM) mediante prueba de nitrazina (+). No hay datos de infección ni trabajo de parto.",
    "question": "¿Cuál es la conducta recomendada ante un embarazo pretérmino (34-36 semanas)?",
    "options": [
      "Manejo conservador (expectante) hasta la semana 37.",
      "Interrupción del embarazo (Inducción o Cesárea) + Antibióticos profilácticos.",
      "Tocolisis prolongada por 2 semanas.",
      "Administración de esteroides para maduración pulmonar únicamente."
    ],
    "answerIndex": 1,
    "explanation": "A partir de las 34 semanas con RPM, el riesgo de infección supera los beneficios de la prematurez, por lo que se recomienda el nacimiento.",
    "gpcReference": "GPC Diagnóstico y Manejo de la Ruptura Prematura de Membranas."
  },
  {
    "specialty": "cir",
    "case": "Masculino de 35 años que recibe golpe contuso en flanco izquierdo durante riña. Presenta dolor abdominal intenso y signos de irritación peritoneal. La TA es de 90/60 y FC 115 lpm.",
    "question": "¿Cuál es el órgano sólido más frecuentemente lesionado en traumatismo abdominal cerrado?",
    "options": [
      "Hígado.",
      "Bazo.",
      "Riñón.",
      "Páncreas."
    ],
    "answerIndex": 1,
    "explanation": "El bazo es el órgano más frecuentemente afectado en trauma cerrado, seguido del hígado.",
    "gpcReference": "GPC Manejo del Traumatismo Abdominal en Adultos."
  },
  {
    "specialty": "cir",
    "case": "Paciente con quemadura circular de tercer grado en tórax. Presenta dificultad respiratoria severa y expansión torácica limitada.",
    "question": "¿Cuál es el procedimiento quirúrgico de urgencia indicado?",
    "options": [
      "Fasciotomía.",
      "Escarectomía.",
      "Escarotomía.",
      "Dermoabrasión."
    ],
    "answerIndex": 2,
    "explanation": "Las quemaduras circunferenciales en tórax actúan como una coraza que impide la ventilación; la escarotomía libera esa tensión.",
    "gpcReference": "GPC Tratamiento del Paciente con Quemaduras Graves.",
    "tema": "Nefrología: Enfermedad Renal Crónica"
  },
  {
    "specialty": "urg",
    "case": "Paciente es traído por familiares por ingestión accidental de un frasco de insecticida organofosforado. Presenta miosis puntiforme, bradicardia, sialorrea, broncorrea y fasciculaciones.",
    "question": "¿Cuál es el antídoto específico para revertir el síndrome colinérgico?",
    "options": [
      "Atropina.",
      "Naloxona.",
      "Flumazenil.",
      "Fisostigmina."
    ],
    "answerIndex": 0,
    "explanation": "La atropina compite con la acetilcolina en los receptores muscarínicos, bloqueando los efectos del exceso de colinérgicos.",
    "gpcReference": "GPC Diagnóstico y Manejo de Intoxicación por Organofosforados."
  },
  {
    "specialty": "urg",
    "case": "Masculino de 18 años es traído tras ingesta masiva de paracetamol hace 2 horas con fines suicidas. Se desconoce la dosis exacta.",
    "question": "¿Qué fármaco se debe administrar para prevenir la hepatotoxicidad?",
    "options": [
      "N-acetilcisteína.",
      " Carbón activado únicamente.",
      "Vitamina K.",
      "Penicilamina."
    ],
    "answerIndex": 0,
    "explanation": "La N-acetilcisteína repone los depósitos de glutatión y neutraliza el metabolito tóxico NAPQI.",
    "gpcReference": "GPC Diagnóstico y Manejo de la Intoxicación por Paracetamol."
  },
  {
    "specialty": "mi",
    "case": "Paciente de 55 años con ERC en estadio 5. Presenta debilidad muscular intensa y ECG con ondas T picudas y simétricas, además de ensanchamiento del QRS.",
    "question": "¿Cuál es el trastorno electrolítico más probable?",
    "options": [
      "Hiponatremia.",
      "Hiperpotasemia (Hiperkalemia).",
      "Hipocalcemia.",
      "Hipermagnesemia."
    ],
    "answerIndex": 1,
    "explanation": "Las ondas T picudas y el ensanchamiento del QRS son signos electrocardiográficos graves de hiperpotasemia, común en falla renal terminal.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Insuficiencia Renal Crónica.",
    "tema": "Nefrología: Enfermedad Renal Crónica"
  },
  {
    "specialty": "mi",
    "case": "Femenino de 24 años con fiebre, rash malar en alas de mariposa, artralgias y fotosensibilidad. Laboratorios muestran proteinuria de 24 horas >500mg.",
    "question": "¿Cuál es el anticuerpo más específico para el diagnóstico de Lupus Eritematoso Sistémico (LES)?",
    "options": [
      "Anticuerpos antinucleares (ANA).",
      "Anti-dsDNA.",
      "Anti-Smith (Anti-Sm).",
      "Anticuerpos anti-Ro."
    ],
    "answerIndex": 2,
    "explanation": "Aunque los ANA son muy sensibles, el Anti-Smith es el más específico para LES según los criterios actuales.",
    "gpcReference": "GPC Diagnóstico y Manejo de Lupus Eritematoso Sistémico.",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "mi",
    "case": "Masculino de 70 años con dolor óseo persistente en espalda, anemia y falla renal aguda. Se realiza electroforesis de proteínas encontrando pico monoclonal (Componente M).",
    "question": "¿Cuál es el diagnóstico más probable?",
    "options": [
      "Osteosarcoma.",
      "Mieloma Múltiple.",
      "Metástasis óseas de próstata.",
      "Leucemia linfoide crónica."
    ],
    "answerIndex": 1,
    "explanation": "La clínica de dolor óseo, anemia, falla renal (CRAB) y pico monoclonal sugiere fuertemente mieloma múltiple.",
    "gpcReference": "GPC Diagnóstico y Tratamiento del Mieloma Múltiple."
  },
  {
    "specialty": "mi",
    "case": "Paciente femenino de 25 años que acude por presentar episodios súbitos de miedo intenso, palpitaciones, opresión torácica, falta de aire y sensación de muerte inminente. Los episodios duran unos 20 minutos y no tienen un desencadenante claro.",
    "question": "¿Cuál es el diagnóstico más probable?",
    "options": [
      "Fobia social.",
      "Trastorno de pánico.",
      "Trastorno de ansiedad generalizada.",
      "Esquizofrenia."
    ],
    "answerIndex": 1,
    "explanation": "Los ataques de pánico súbitos y recidivantes con sensación de muerte inminente son característicos del trastorno de pánico.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de los Trastornos de Ansiedad en el Adulto."
  },
  {
    "specialty": "mi",
    "case": "Paciente masculino de 45 años, con antecedentes de alcoholismo crónico. Es traído por presentar confusión, ataxia y nistagmo.",
    "question": "¿Cuál es el diagnóstico de sospecha y el tratamiento inicial?",
    "options": [
      "Encefalopatía hepática; Lactulosa.",
      "Encefalopatía de Wernicke; Tiamina (Vitamina B1).",
      "Evento vascular cerebral; rTPA.",
      "Delirium tremens; Benzodiacepinas."
    ],
    "answerIndex": 1,
    "explanation": "La tríada de ataxia, confusión y alteraciones oculomotoras es típica de la encefalopatía de Wernicke por déficit de tiamina.",
    "gpcReference": "Guía de Práctica Clínica para la Prevención y Tratamiento del Abuso del Alcohol."
  },
  {
    "specialty": "mi",
    "case": "Paciente masculino de 65 años que refiere pérdida progresiva y dolorosa de la visión en ojo derecho. Refiere ver 'halos de colores' alrededor de las luces y presenta náuseas. Al examen, el ojo está rojo y la pupila en midriasis media fija.",
    "question": "¿Cuál es el diagnóstico más probable?",
    "options": [
      "Cataratas seniles.",
      "Glaucoma agudo de ángulo cerrado.",
      "Desprendimiento de retina.",
      "Conjuntivitis bacteriana."
    ],
    "answerIndex": 1,
    "explanation": "El glaucoma agudo es una emergencia oftalmológica caracterizada por dolor intenso, ojo rojo, midriasis y elevación súbita de la PIO.",
    "gpcReference": "GPC Diagnóstico y Tratamiento del Glaucoma de Ángulo Abierto y Cerrado.",
    "tema": "Oftalmología P2"
  },
  {
    "specialty": "mi",
    "case": "Niño de 4 años que presenta otalgia intensa, fiebre de 39°C e irritabilidad. A la otoscopia se observa membrana timpánica abombada, hiperémica y con movilidad disminuida.",
    "question": "¿Cuál es el tratamiento antibiótico de primera elección?",
    "options": [
      "Ceftriaxona IM.",
      "Amoxicilina a dosis altas (80-90 mg/kg/día).",
      "Eritromicina.",
      "Ciprofloxacino en gotas."
    ],
    "answerIndex": 1,
    "explanation": "La amoxicilina sigue siendo el estándar de oro para la otitis media aguda en pediatría debido a su cobertura contra S. pneumoniae.",
    "gpcReference": "GPC Diagnóstico y Manejo de la Otitis Media Aguda en Niños.",
    "tema": "Infecciones de Vías Respiratorias Superiores"
  },
  {
    "specialty": "mi",
    "case": "Paciente de 19 años que tras acudir a un campamento presenta fiebre, cefalea intensa y rigidez de nuca. En la piel se observan petequias y púrpura palpable. La punción lumbar revela diplococos gramnegativos intracelulares.",
    "question": "¿Cuál es el agente causal más probable?",
    "options": [
      "Streptococcus pneumoniae.",
      "Neisseria meningitidis.",
      "Haemophilus influenzae.",
      "Listeria monocytogenes."
    ],
    "answerIndex": 1,
    "explanation": "La presencia de petequias y diplococos gramnegativos (meningococo) es característica de la meningitis meningocócica.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Meningitis Bacteriana Aguda."
  },
  {
    "specialty": "mi",
    "case": "Femenino de 28 años con fiebre, escalofríos, dolor lumbar derecho y disuria de 2 días. Puño percusión lumbar derecha (+). EGO con esterasa leucocitaria y nitritos positivos.",
    "question": "¿Cuál es el diagnóstico clínico?",
    "options": [
      "Cistitis aguda.",
      "Pielonefritis aguda.",
      "Litiasis renal.",
      "Absceso renal."
    ],
    "answerIndex": 1,
    "explanation": "La fiebre y el dolor lumbar (Giordano +) diferencian la pielonefritis de una infección de vías urinarias bajas.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Infección de Vías Urinarias en el Adulto.",
    "tema": "Nefrología: Enfermedad Renal Crónica"
  },
  {
    "specialty": "mi",
    "case": "Paciente que presenta una lesión cutánea en brazo que inició como una pápula eritematosa y evolucionó a una úlcera con fondo necrótico y borde violáceo, muy dolorosa. Antecedente de enfermedad inflamatoria intestinal.",
    "question": "¿Cuál es el diagnóstico más probable?",
    "options": [
      "Fascitis necrotizante.",
      "Pioderma gangrenoso.",
      "Carcinoma espinocelular.",
      "Erisipela."
    ],
    "answerIndex": 1,
    "explanation": "El pioderma gangrenoso se asocia frecuentemente a patologías sistémicas como CUCI o Crohn.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de Pioderma Gangrenoso.",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "cir",
    "case": "Masculino de 45 años, obeso, con dolor intenso en hipocondrio derecho tras ingesta de alimentos colecistoquinéticos. El dolor dura más de 6 horas, tiene fiebre de 38.3°C y Signo de Murphy (+).",
    "question": "¿Cuál es el diagnóstico más probable y el estudio estándar de oro?",
    "options": [
      "Cólico biliar; USG.",
      "Colecistitis aguda; Gammagrafía biliar (HIDA).",
      "Pancreatitis; Lipasa.",
      "Coledocolitiasis; CPRE."
    ],
    "answerIndex": 1,
    "explanation": "Aunque el USG es el inicial, la gammagrafía HIDA es el estándar de oro para confirmar la obstrucción del conducto cístico en colecistitis.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de Colecistitis y Colelitiasis."
  },
  {
    "specialty": "cir",
    "case": "Femenino de 50 años que presenta dolor abdominal, ictericia y fiebre con escalofríos (Tríada de Charcot).",
    "question": "¿Cuál es el diagnóstico más probable?",
    "options": [
      "Hepatitis aguda.",
      "Colangitis aguda.",
      "Colecistitis aguda.",
      "Cáncer de páncreas."
    ],
    "answerIndex": 1,
    "explanation": "La tríada de Charcot es clásica de la colangitis, una infección de la vía biliar secundaria usualmente a coledocolitiasis.",
    "gpcReference": "GPC Diagnóstico y Manejo de la Colangitis Aguda."
  },
  {
    "specialty": "ped",
    "case": "Se presenta a consulta niño de 12 meses. Según el esquema nacional de vacunación, ¿qué vacunas le corresponde recibir en esta visita?",
    "question": "Elegir la opción correcta.",
    "options": [
      "Refuerzo de Pentavalente.",
      "SRP (Sarampión, Rubeola, Parotiditis) y Neumocócica conjugada.",
      "Sabin e Influenza.",
      "BCG y Hepatitis B."
    ],
    "answerIndex": 1,
    "explanation": "A los 12 meses se aplica la primera dosis de SRP y el refuerzo de la vacuna neumocócica.",
    "gpcReference": "NOM-036-SSA2-2012, Prevención y control de enfermedades. Aplicación de vacunas.",
    "tema": "Vacunación"
  },
  {
    "specialty": "ped",
    "case": "Lactante de 1 mes traído por su madre por presentar regurgitaciones frecuentes tras las tomas. El niño gana peso adecuadamente y no presenta irritabilidad ni síntomas respiratorios.",
    "question": "¿Cuál es la conducta recomendada?",
    "options": [
      "Iniciar inhibidores de bomba de protones (IBP).",
      "Espesamiento de fórmulas y medidas posturales (Reflujo fisiológico).",
      "Realizar serie esofagogastroduodenal inmediata.",
      "Cambiar a fórmula extensamente hidrolizada."
    ],
    "answerIndex": 1,
    "explanation": "El 'regurgitador feliz' tiene reflujo gastroesofágico fisiológico que no requiere medicación, solo medidas generales.",
    "gpcReference": "GPC Diagnóstico y Tratamiento del Reflujo Gastroesofágico en Pediatría.",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "gyo",
    "case": "Mujer de 45 años se palpa nódulo en cuadrante superior externo de mama derecha. El reporte de mastografía es BI-RADS 4.",
    "question": "¿Cuál es la conducta a seguir ante un BI-RADS 4?",
    "options": [
      "Mastografía de control en 6 meses.",
      "Ultrasonido mamario complementario únicamente.",
      "Biopsia de la lesión (histopatológico).",
      "Autoexploración mensual."
    ],
    "answerIndex": 2,
    "explanation": "BI-RADS 4 indica una sospecha de malignidad, por lo que se requiere confirmación histopatológica.",
    "gpcReference": "NOM-041-SSA2-2011, Para la prevención, diagnóstico, tratamiento, control y vigilancia epidemiológica del cáncer de mama."
  },
  {
    "specialty": "gyo",
    "case": "Mujer de 35 años que presenta dolor pélvico cíclico (dismenorrea), dispareunia e infertilidad.",
    "question": "¿Cuál es el diagnóstico de sospecha y el estudio 'estándar de oro'?",
    "options": [
      "Miomatosis uterina; USG.",
      "Endometriosis; Laparoscopia con toma de biopsia.",
      "Enfermedad inflamatoria pélvica; Cultivo vaginal.",
      "SOP; Perfil hormonal."
    ],
    "answerIndex": 1,
    "explanation": "La endometriosis se caracteriza por dolor crónico y la visualización directa por laparoscopia es el único método definitivo.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Endometriosis."
  },
  {
    "specialty": "urg",
    "case": "Se presencia el colapso de un adulto en la vía pública. Tras verificar que la escena es segura, la persona no responde y no respira normalmente (solo jadea).",
    "question": "¿Cuál es la primera acción según las guías de la AHA?",
    "options": [
      "Iniciar 30 compresiones torácicas.",
      "Llamar al número de emergencias y solicitar un DEA.",
      "Dar 2 ventilaciones de rescate.",
      "Verificar pulso carotídeo por 15 segundos."
    ],
    "answerIndex": 1,
    "explanation": "El primer paso tras reconocer el paro es activar el sistema de emergencias antes de iniciar las maniobras.",
    "gpcReference": "Guías de RCP y ACE de la American Heart Association (AHA).",
    "tema": "Patología Quirúrgica de Esófago"
  },
  {
    "specialty": "urg",
    "case": "Paciente en paro cardiaco. El monitor muestra el ritmo siguiente: ausencia de actividad eléctrica y línea plana.",
    "question": "¿Cuál es la conducta correcta ante una asistolia?",
    "options": [
      "Desfibrilación inmediata (360 J).",
      "RCP de alta calidad y administración de adrenalina 1mg cada 3-5 min.",
      "Administración de amiodarona 300mg.",
      "Cardioversión sincronizada."
    ],
    "answerIndex": 1,
    "explanation": "La asistolia y la actividad eléctrica sin pulso son ritmos no desfibrilables; el manejo es RCP y adrenalina.",
    "gpcReference": "Soporte Vital Cardiovascular Avanzado (ACLS).",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "mi",
    "case": "Masculino de 65 años acude por dolor intenso, calor y eritema en la primera articulación metatarsofalángica (podagra) que inició súbitamente por la noche tras una cena abundante.",
    "question": "¿Cuál es el diagnóstico más probable y el tratamiento de elección en la fase aguda?",
    "options": [
      "Celulitis; Antibióticos.",
      "Artritis gotosa; AINEs o Colchicina.",
      "Osteoartritis; Paracetamol.",
      "Artritis séptica; Drenaje quirúrgico."
    ],
    "answerIndex": 1,
    "explanation": "La gota úrica suele presentarse como una monoartritis aguda muy dolorosa en el dedo gordo del pie.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de Gota."
  },
  {
    "specialty": "mi",
    "case": "Paciente que presenta equimosis y petequias generalizadas sin causa aparente. El conteo plaquetario reporta 15,000 plaquetas/mm3. No hay anemia ni leucopenia. Se descartan causas secundarias.",
    "question": "¿Cuál es el diagnóstico más probable?",
    "options": [
      "Leucemia mieloide aguda.",
      "Púrpura trombocitopénica inmunitaria (PTI).",
      "Coagulación Intravascular Diseminada.",
      "Aplasia medular."
    ],
    "answerIndex": 1,
    "explanation": "La trombocitopenia aislada en un paciente joven o adulto sin otras alteraciones es sugestiva de PTI.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Púrpura Trombocitopénica Inmunitaria."
  },
  {
    "specialty": "mi",
    "case": "Masculino de 62 años fumador crónico que presenta tos productiva la mayoría de los días del año, durante los últimos 3 años. Presenta sibilancias y disnea al ejercicio.",
    "question": "¿Cuál es el estudio confirmatorio para EPOC?",
    "options": [
      "Radiografía de tórax.",
      "Espirometría con broncodilatador (Relación FEV1/FVC < 0.70).",
      "Gasometría arterial.",
      "Tomografía de alta resolución."
    ],
    "answerIndex": 1,
    "explanation": "El diagnóstico de certeza de EPOC requiere demostrar una obstrucción no reversible al flujo aéreo mediante espirometría.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Enfermedad Pulmonar Obstructiva Crónica.",
    "tema": "Nefrología: Enfermedad Renal Crónica"
  },
  {
    "specialty": "mi",
    "case": "Paciente con sospecha de hipertensión arterial. Se le pide que realice mediciones de la TA en casa durante una semana.",
    "question": "¿A partir de qué valor se considera diagnóstico de HAS según la guía internacional y NOM-030 en mediciones domiciliarias (AMPA)?",
    "options": [
      "140/90 mmHg.",
      "135/85 mmHg.",
      "130/80 mmHg.",
      "150/95 mmHg."
    ],
    "answerIndex": 1,
    "explanation": "En AMPA, el umbral diagnóstico es ligeramente inferior a la toma en consultorio, siendo >= 135/85 mmHg.",
    "gpcReference": "NOM-030-SSA2-2009, Para la prevención, detección, diagnóstico, tratamiento y control de la hipertensión arterial sistémica."
  },
  {
    "specialty": "gyo",
    "case": "Mujer de 32 años, primigesta de 36 semanas de gestación, acude por cefalea intensa, fotopsias y epigastralgia. A la exploración física TA 165/110 mmHg, hiperreflexia patelar y edema ++ en miembros inferiores. Laboratorios: AST 120 U/L, ALT 105 U/L, plaquetas 90,000/mm3, creatinina 1.3 mg/dL, DHL 650 U/L.",
    "question": "¿Cuál es el maneja farmacológico de primera línea para la prevención de convulsiones en esta paciente?",
    "options": [
      "Sulfato de magnesio intravenoso.",
      "Fenitoína sódica intravenosa.",
      "Labetalol intravenoso.",
      "Nifedipino vía oral."
    ],
    "answerIndex": 0,
    "explanation": "El caso clínico es clásico de Preeclampsia con datos de severidad (y síndrome HELLP). El medicamento estándar de oro para prevenir la eclampsia es el sulfato de magnesio, no los antihipertensivos o fenitoína de primera intención.",
    "gpcReference": "GPC Diagnóstico y Manejo de la Preeclampsia-Eclampsia."
  },
  {
    "specialty": "ped",
    "case": "Lactante femenino de 8 meses de edad que presenta desde hace 3 días rinorrea hialina y febrícula. Hoy inicia con dificultad respiratoria, tos perruna y estridor inspiratorio en reposo. A la exploración física: aleteo nasal, tiraje intercostal y cianosis peribucal al llorar.",
    "question": "¿Cuál es el tratamiento farámacológico inicial más adecuado según las guías clínicas?",
    "options": [
      "Nebulización con salbutamol repetida cada 20 minutos.",
      "Dexametasona vía oral (o IM) dosis única más budesonida nebulizada.",
      "Adrenalina racémica nebulizada y dexametasona (IM o VO) dosis única.",
      "Antibioticoterapia con amoxicilina/ácido clavulánico."
    ],
    "answerIndex": 2,
    "explanation": "Se trata de laringotraqueítis (Crup) moderada-grave (presencia de estridor en reposo y datos de dificultad respiratoria evidente). Está indicada la administración de esteroide sistémico más l-adrenalina o adrenalina racémica nebulizada para disminuir el edema subglótico de forma rápida.",
    "gpcReference": "GPC Diagnóstico y Manejo de la Laringotraqueítis Aguda en Pacientes Pediátricos.",
    "tema": "Nefrología: Enfermedad Renal Crónica"
  },
  {
    "specialty": "cir",
    "case": "Masculino de 45 años, con antecedente de alcoholismo crónico, acude a Urgencias por dolor abdominal intenso transfixiante en epigastrio de 24 horas de evolución, acompañado de múltiples episodios eméticos. Al ingreso: FC 120 lpm, FR 24 rpm, TA 90/60 mmHg. Abdomen severamente doloroso, distendido. Laboratorios: Leucocitosis 18,000, Amilasa 1200 U/L, Lipasa 2500 U/L.",
    "question": "¿Cuál de los siguientes criterios tomográficos de Balthazar corresponde a un grado D?",
    "options": [
      "Páncreas normal.",
      "Aumento de volumen focal o difuso del páncreas.",
      "Inflamación peripancreática y colección líquida única.",
      "Dos o más colecciones líquidas extrapancreáticas o presencia de gas."
    ],
    "answerIndex": 2,
    "explanation": "En la clasificación topográfica de Balthazar para pancreatitis aguda: A (Normal), B (Aumento de tamaño), C (Inflamación peripancreática), D (Una acumulación única de líquido), E (Dos o más acumulaciones o gas retroperitoneal). Por lo tanto, el grado D es una sola colección líquida peri-pancreática.",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Pancreatitis Aguda.",
    "tema": "Pancreatitis Aguda"
  },
  {
    "specialty": "urg",
    "case": "Paciente de 25 años es traído a urgencias tras sufrir accidente de tráfico. A la exploración: estridor intenso, desviación de la tráquea hacia la izquierda, ausencia de murmullo vesicular en el hemitórax derecho e ingurgitación yugular evidente. TA 80/50 mmHg.",
    "question": "¿Cuál es la maniobra terapéutica inmediata que salva la vida y debe realizarse antes que cualquier estudio de imagen?",
    "options": [
      "Intubación orotraqueal de secuencia rápida.",
      "Colocación de un tubo de toracostomía en el 5º espacio intercostal.",
      "Toracocentesis con aguja gruesa en el 2º espacio intercostal línea medioclavicular derecha (o 5º EIC línea media axilar).",
      "Pericardiocentesis ecoguiada."
    ],
    "answerIndex": 2,
    "explanation": "El cuadro es un clásico neumotórax a tensión (desviación traqueal, abolición de ruidos respiratorios, ingurgitación yugular y choque obstructivo). La descompresión pleural con aguja es el tratamiento de emergencia imprescindible antes de colocar el tubo de tórax definitivo.",
    "gpcReference": "ATLS (Advanced Trauma Life Support) - Principios de manejo de trauma torácico.",
    "tema": "Patología Quirúrgica de Esófago"
  },
  {
    "specialty": "mi",
    "case": "Hombre de 68 años con antecedente de fibrilación auricular no valvular. Acude a consulta para ajuste de medicación. Tiene hipertensión y diabetes tipo 2. Niega antecedente de EVC.",
    "question": "Teniendo en cuenta la escala CHA2DS2-VASc, ¿Qué puntuación tiene este paciente y cuál es su indicación de anticoagulación?",
    "options": [
      "2 puntos, indicar ácido acetilsalicílico solamente.",
      "3 puntos, anticoagulación oral (ACO) indicada.",
      "4 puntos, anticoagulación oral (ACO) indicada.",
      "1 punto, no requiere tratamiento."
    ],
    "answerIndex": 1,
    "explanation": "Puntos CHA2DS2-VASc: Edad 65-74 años (1 punto), HAS (1 punto), DM (1 punto). Total: 3 puntos. En hombres, una puntuación ≥2 establece indicación formal de anticoagulación oral definitiva.",
    "gpcReference": "GPC Diagnóstico y tratamiento de la Fibrilación Auricular.",
    "tema": "Neurología: Enfermedad Vascular Cerebral"
  },
  {
    "specialty": "sp",
    "case": "Se reportan 25 casos de enfermedad diarreica aguda en un asilo de ancianos durante las últimas 48 horas. Se identifica norovirus como el agente etiológico tras una investigación inicial de campo.",
    "question": "¿Qué tipo de medida epidemiológica representa la indicación de cuarentena a los residentes y la suspensión de visitas externas?",
    "options": [
      "Prevención primaria.",
      "Prevención secundaria.",
      "Cuarentena restrictiva (Control de brote).",
      "Medidas de aislamiento universal hospitalario."
    ],
    "answerIndex": 2,
    "explanation": "El control epidémico en sistemas cerrados como asilos o cárceles frente a brotes de gran contagiosidad (como norovirus) implica cerrar la instalación (cuarentena/restricción de visitas) y aislar a los infectados como medida primordial de contención de daños comunitarios.",
    "gpcReference": "NOM-017-SSA2-2012, Para la vigilancia epidemiológica.",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "ped",
    "case": "Recién nacido a término, obtenido por parto fortuito, es llevado al servicio de urgencias a los 10 días de vida por presentar irritabilidad, fiebre de 39°C, fontanela anterior abombada y rechazo al alimento. El análisis de LCR muestra pleocitosis con predominio de polimorfonucleares e hiperproteinorraquia.",
    "question": "¿Cuáles son los patógenos más probables en este grupo etario responsable del cuadro descrito?",
    "options": [
      "Streptococcus pneumoniae y Neisseria meningitidis.",
      "Streptococcus agalactiae (SGB), Escherichia coli y Listeria monocytogenes.",
      "Haemophilus influenzae tipo B y Salmonella spp.",
      "Virus del Herpes Simple tipo 1."
    ],
    "answerIndex": 1,
    "explanation": "En la meningitis neonatal (<1 mes de vida), los principales agentes etiológicos son Streptococcus agalactiae (estreptococo del grupo B), enterobacterias (principalmente E. coli) y Listeria monocytogenes por transmisión vertical.",
    "gpcReference": "GPC Prevención, diagnóstico y tratamiento de la Meningitis Bacteriana Aguda en edad Pediátrica.",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "cir",
    "case": "Femenina de 55 años, con IMC de 34, que acude a consulta externa refiriendo dolor crónico tipo cólico en hemiabdomen superior derecho, irradiado hacia región subescapular. El padecimiento exacerba tras el consumo de colecistoquinéticos. El ultrasonido reporta litiasis vesicular de 15 mm, pared de 2mm de grosor y colédoco de 4mm. No tiene datos de inflamación sistémica ni alteración de las PFH.",
    "question": "¿Cuál es el tratamiento de elección definitivo para esta paciente si no tiene contraindicaciones instrumentales?",
    "options": [
      "Colecistectomía abierta.",
      "Manejo médico con ácido ursodesoxicólico.",
      "Colecistectomía laparoscópica electiva.",
      "Colangiopancreatografía retrógrada endoscópica (CPRE)."
    ],
    "answerIndex": 2,
    "explanation": "El caso describe una colelitiasis sintomática (cólico biliar sin datos de colecistitis aguda o coledocolitiasis). El estándar de oro terapéutico en pacientes sintomáticos es la colecistectomía laparoscópica electiva programada de manera ambulatoria.",
    "gpcReference": "GPC Diagnóstico y tratamiento de Colecistitis y Colelitiasis."
  },
  {
    "specialty": "gyo",
    "case": "Femenina de 21 años que acude para inicio de vida sexual activa y uso de método de planificación familiar. Refiere tener antecedentes familiares de cáncer de mama (madre) y cursar con dismenorrea severa. Niega otros antecedentes médicos. Su IMC es de 23.",
    "question": "¿Qué método anticonceptivo le ofrecería beneficios secundarios importantes dada su dismenorrea y es considerado de primera elección (Categoría 1 OMS) por su alta eficacia?",
    "options": [
      "Dispositivo Intrauterino de Cobre (DIU T 380A).",
      "Anticonceptivos Hormonales Orales Combinados.",
      "Implante subdérmico de etonogestrel o Sistema Intrauterino liberador de Levonorgestrel (SIU-LNG).",
      "Preservativo masculino exclusivamente."
    ],
    "answerIndex": 2,
    "explanation": "Tanto el implante subdérmico como el SIU-LNG reducen significativamente el sangrado y la dismenorrea, siendo considerados métodos LARCs (Long Acting Reversible Contraceptives) de primera línea (categoría 1) excelentes en adolescentes y adultas jóvenes por su alta tasa de continuidad y eficacia sin depender del cumplimiento diario.",
    "gpcReference": "GPC Criterios médicos de elegibilidad para el uso de anticonceptivos WHO, adaptados al ENARM.",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "urg",
    "case": "Masculino de 62 años es traído tras síncope presenciado en la calle. Llega sin pulso, se inician maniobras de RCP y el monitor muestra una fibrilación ventricular. Tras la desfibrilación inicial y ciclo de compresiones de 2 minutos, el monitor persiste en FV.",
    "question": "¿Cuál es el siguiente paso farmacológico inmediato de acuerdo al algoritmo de la AHA 2020?",
    "options": [
      "Administrar adrenalina 1 mg IV/IO.",
      "Administrar amiodarona 300 mg IV/IO.",
      "Realizar cardioversión sincronizada a 200 J.",
      "Administrar lidocaína a 1.5 mg/kg IV."
    ],
    "answerIndex": 0,
    "explanation": "En un ritmo desfibrilable (FV/TVSP), después de fallar la primera descarga y durante el segundo ciclo de RCP, debe inyectarse Adrenalina 1 mg IV/IO. La Amiodarona se da después de la 3era descarga si persiste la FV/TVSP.",
    "gpcReference": "AHA Guidelines para Soporte Vital Cardiovascular Avanzado (ACLS)."
  },
  {
    "specialty": "mi",
    "case": "Femenina de 42 años diagnosticada recientemente con VIH, sin tratamiento antirretroviral previo. Acude por tos seca progresiva de 3 semanas, disnea de medianos esfuerzos, pérdida de peso y fiebre vespertina. Exploración física: FR 28 rpm, saturación de oxígeno a nivel del mar del 88% al aire ambiente. Rx tórax: patrón intersticial bilateral difuso en 'vidrio esmerilado'. DHL 800 U/L.",
    "question": "¿Cuál es el tratamiento antimicrobiano y la pauta adyuvante inicial más indicada si la PaO2 es de 60 mmHg?",
    "options": [
      "Isoniazida, Rifampicina, Pirazinamida, Etambutol.",
      "Ceftriaxona y Azitromicina.",
      "Trimetoprima/Sulfametoxazol dosis altas por 21 días + esteroides sistémicos (Prednisona).",
      "Fluconazol continuo por 14 días."
    ],
    "answerIndex": 2,
    "explanation": "El cuadro clínico, radiológico y de laboratorio es clásico de neumonía por Pneumocystis jirovecii (PJP). Al existir hipoxemia significativa (PaO2 < 70 mmHg o Gradiente A-a > 35 mmHg), está justificado el uso de corticoesteroides adyuvantes antes o al inicio del antibiótico (TMP/SMX) para disminuir la mortalidad por inflamación.",
    "gpcReference": "GPC Diagnóstico y tratamiento de Infecciones Oportunistas en VIH."
  },
  {
    "specialty": "ped",
    "case": "Preescolar de 3 años llevado a urgencias por presentar edema facial y palpebral de rápido inicio, orina 'color de refresco de cola' (coluria) y presión arterial en el percentil 99 para su edad y talla. La madre refiere que hace 2 semanas el niño presentó lesiones costrosas color miel en la piel de la cara que se resolvieron.",
    "question": "¿Qué estudio de laboratorio inicial es el más útil para apoyar la etiología del cuadro descrito?",
    "options": [
      " biopsia renal urgente.",
      "Determinación de niveles de C3 (que se encontrará disminuido) y anticuerpos anti-estreptocócicos.",
      "Tomografía computada de abdomen.",
      "Cultivo faríngeo."
    ],
    "answerIndex": 1,
    "explanation": "Es el cuadro típico del Glomerulonefritis Postestreptocócica (GNPE) tras una infección cutánea (impétigo, por las lesiones mielicéricas). Como es una glomerulonefritis mediada por inmunocomplejos, hay consumo de la vía alterna del complemento (C3 disminuido y C4 normal), además de evidencia serológica de infección previa.",
    "gpcReference": "GPC Diagnóstico y tratamiento de la Glomerulonefritis Aguda en Pediatría.",
    "tema": "Nefrología: Enfermedad Renal Crónica"
  },
  {
    "specialty": "gyo",
    "case": "Gestante de 28 semanas con embarazo gemelar bicorial biamniótico. Acude a triage obstétrico refiriendo contracciones dolorosas cada 5 minutos durante las últimas 2 horas. Tacto vaginal: cérvix borrado al 80%, 2 cm de dilatación, membranas íntegras.",
    "question": "¿Cuál es el pilar terapéutico inmediato para mejorar el pronóstico de los fetos ante la inminencia de parto pretérmino?",
    "options": [
      "Inducción inmediata del trabajo de parto con oxitocina.",
      "Esquema de maduración pulmonar fetal con corticosteroides (Ej. Dexametasona o Betametasona).",
      "Administración profiláctica de antibióticos para Streptococus del grupo B empírica crónica.",
      "Cerclaje cervical de emergencia."
    ],
    "answerIndex": 1,
    "explanation": "Ante un trabajo de parto pretérmino inminente entre las 24 y 34 semanas, el esquema de corticoesteroides prenatales tiene el mayor impacto en reducir la morbimortalidad neonatal, específicamente la enfermedad de membrana hialina, hemorragia intraventricular y enterocolitis necrotizante.",
    "gpcReference": "GPC Diagnóstico y Manejo del Parto Pretérmino.",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "cir",
    "case": "Hombre de 22 años que recibe herida por arma blanca en hemitórax izquierdo, a nivel del 4º espacio intercostal línea paraesternal. Acude sudoroso, pálido, confuso. Exploración: TA 70/40 mmHg, FC 130 lpm, ruidos cardíacos muy apagados y venas del cuello ingurgitadas.",
    "question": "¿Cuál es el diagnóstico clínico fisiopatológico subyacente que explica el estado de choque del paciente?",
    "options": [
      "Choque hipovolémico severo por sangrado intrapleural.",
      "Choque cardiogénico primario por lesión valvular.",
      "Choque obstructivo secundario a taponamiento cardíaco.",
      "Choque distributivo neurogénico."
    ],
    "answerIndex": 2,
    "explanation": "Triada de Beck (hipotensión, ruidos cardiacos apagados e ingurgitación yugular) sugestiva de taponamiento cardiaco tras trauma penetrante en el tórax. Fisiopatológicamente, la presión intrapericárdica supera las presiones de llenado del corazón derecho y produce choque obstructivo.",
    "gpcReference": "ATLS (Advanced Trauma Life Support) - Principios de manejo de trauma torácico.",
    "tema": "Nefrología: Enfermedad Renal Crónica"
  },
  {
    "specialty": "urg",
    "case": "Femenina de 65 años traída por su hija debido a debilidad profunda y confusión. Tiene antecedentes de insuficiencia cardiaca en tratamiento crónico con espironolactona y enalapril. Un electrocardiograma a su llegada muestra ondas T picudas y simétricas, con ensanchamiento del complejo QRS y aplanamiento de las ondas P. Potasio sérico en 7.5 mEq/L.",
    "question": "¿Cuál de las siguientes medidas protege directamente al miocardio estabilizando la membrana, previniendo arritmias letales, sin disminuir los niveles corporales totales del ion?",
    "options": [
      "Gluconato de calcio IV.",
      "Solución polarizante (insulina + glucosa).",
      "Bicarbonato de sodio.",
      "Salbutamol en nebulizaciones."
    ],
    "answerIndex": 0,
    "explanation": "Las alteraciones ECG y el potasio > 7.0 configuran una hiperkalemia severa con cambios sintomáticos. El primer medicamento debe ser siempre gluconato de calcio (o cloruro de calcio), el cual antagoniza los efectos tóxicos en la membrana cardiaca (efecto cardioprotector) pero no disminuye las concentraciones séricas de potasio, para lo cual se emplean las otras medidas.",
    "gpcReference": "GPC Diagnóstico y tratamiento de los desequilibrios hidroelectrolíticos en adultos."
  },
  {
    "specialty": "sp",
    "case": "En un área rural endémica de malaria, se instaura un programa donde se rocía el interior de las viviendas con insecticidas de acción residual para controlar al mosquito Anopheles.",
    "question": "¿En qué nivel de la cadena epidemiológica y tipo de prevención actúa predominantemente esta estrategia?",
    "options": [
      "Huésped susceptible / Prevención secundaria.",
      "Medio ambiente y vector / Prevención primaria (Protección Específica).",
      "Agente causal directo / Prevención primaria.",
      "Agente causal / Prevención terciaria."
    ],
    "answerIndex": 1,
    "explanation": "El control por rociamiento residual ataca directamente al vector dentro del medio ambiente doméstico, previniendo el contacto infectante. Es una clásica medida de prevención primaria (en específico, como medida de saneamiento y bloqueo vectorial).",
    "gpcReference": "Bases de Epidemiología y Salud Pública (Modelos Preventivos de Leavell y Clark).",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "mi",
    "case": "Paciente femenino de 48 años que acude referida por hipercalcemia (Calcio 11.5 mg/dL) asintomática encontrada en estudios de rutina. PTH basal en 90 pg/mL (Elevada). Densidad mineral ósea reporta osteoporosis en cadera. Resto de función renal nomal.",
    "question": "¿Cuál es el diagnóstico etiológico más probable y definitivo propuesto para la patología?",
    "options": [
      "Hiperparatiroidismo secundario / Dieta estricta en calcio.",
      "Hipercalcemia maligna tumoral / Bifosfonatos IV.",
      "Hiperparatiroidismo primario / Paratiroidectomía Quirúrgica.",
      "Intoxicación por Vitamina D / Restricción vitamínica y glucocorticoides."
    ],
    "answerIndex": 2,
    "explanation": "Una hipercalcemia con concentración elevada de hormona paratiroidea (PTH) indica invariablemente Hiperparatiroidismo primario (cuyo origen principal es un adenoma benigno paratiroideo). Al ya tener osteoporosis secundaria y de acuerdo a criterios internacionales, requiere curación por medio de paratiroidectomía.",
    "gpcReference": "GPC Diagnóstico y tratamiento del Hiperparatiroidismo Primario.",
    "tema": "Nefrología: Enfermedad Renal Crónica"
  },
  {
    "specialty": "ped",
    "case": "Neonato varón de 4 días de vida llega a consulta de urgencias amarillo hasta las rodillas. Madre de grupo sanguíneo O positivo, bebé de grupo A positivo con prueba de Coombs directo fuerte positivo. Reticulocitos aumentados y bilirrubina total de 22 mg/dL por elevación de bilirrubina indirecta.",
    "question": "¿Qué tratamiento inicial de máxima eficacia debe indicarse urgentemente considerando la incompatibilidad ABO severa y el riesgo neurológico?",
    "options": [
      "Fototerapia intensiva de inmediato y preparar sangre reconstituida para exanguinotransfusión.",
      "Exposición a la luz solar directa cada 3 horas por la mañana.",
      "Fijación farmacológica con Fenobarbital.",
      "Hidratación agresiva con solución salina."
    ],
    "answerIndex": 0,
    "explanation": "Estamos ante una hiperbilirrubinemia severa potencialmente neurotóxica (Kernicterus) mediada por hemólisis inmune (incompatibilidad ABO con Coombs +). Con BT en 22 mg/dL la conducta urgente protocolizada es Iniciar fototerapia e iniciar las preparaciones para un posible recambio sanguíneo terapéutico (exanguinotransfusión).",
    "gpcReference": "GPC Diagnóstico y tratamiento de la Ictericia Neonatal."
  },
  {
    "specialty": "gyo",
    "case": "Femenina de 62 años que acude a consulta externa refiriendo sangrado transvaginal escaso progresivo de un mes de evolución. Su último período menstrual fue a los 51 años de edad. Es obesa y padece SOPQA (Síndrome de ovario poliquístico).",
    "question": "¿Qué estudio debe considerarse obligatoriamente de primera línea para realizar el abordaje diagnóstico, dadas sus características clínicas?",
    "options": [
      "Citología Vaginal (Papanicolaou).",
      "Ecografía pélvica endovaginal (para medir el grosor endometrial).",
      "Laparoscopia exploradora.",
      "Determinación de niveles séricos de FSH y Estradiol."
    ],
    "answerIndex": 1,
    "explanation": "En toda mujer posmenopáusica (especialmente con hiperestrogenismo periférico como la obesidad) que presente sangrado (Stryker transvaginal postmenopáusico), el síntoma cardinal es sospecha absoluta de cáncer de endometrio. El estudio inicial es ultrasonido pélvico endovaginal para evaluar engrosamiento endometrial superior a >4-5 mm (lo cual obliga a biopsia).",
    "gpcReference": "GPC Diagnóstico y tratamiento del Cáncer de Endometrio.",
    "tema": "Patología Respiratoria Neonatal"
  },
  {
    "specialty": "cir",
    "case": "Paciente politraumatizado por caída de 4 metros de altura. A su ingreso en urgencias presenta inestabilidad pélvica severa con dolor espontáneo a la compresión medial. TA de 75/40 mmHg. Rx de pelvis: fractura en libro abierto con subluxación de la sínfisis del pubis y rotura de anillo pélvico posterior.",
    "question": "¿Cuál debe ser la primera maniobra de contención mecánica externa, que logre hemostasia relativa y reducir el volumen pélvico?",
    "options": [
      "Fijación quirúrgica endomedular definitiva.",
      "Fijación vascular retroperitoneal con radiología intervencionista.",
      "Cierre manual u ortopédico del anillo pélvico mediante compresión con sábana pélvica o faja pélvica a nivel de trocánteres.",
      "Aplicación de tracción cutánea femoral."
    ],
    "answerIndex": 2,
    "explanation": "Las fracturas pélvicas inestables en 'libro abierto' conllevan hemorragia retroperitoneal venosa grave que es la principal causa de muerte precoz. La maniobra inmediata más efectiva y salva vidas es la colocación de faja (binder) o cierre con una sábana rodeando los trocánteres mayores, lo que reduce el volumen anatómico y promueve un inicio taponamiento hemostático.",
    "gpcReference": "ATLS - Manual de reanimación y Trauma en Pelvis.",
    "tema": "Reumatología: Lupus Eritematoso Sistémico"
  },
  {
    "specialty": "gyo",
    "tema": "Introducción: Ciclo genital, Esterilidad y Anticonceptivos",
    "case": "Mujer de 28 años, nuligesta, acude a consulta por incapacidad para concebir desde hace 18 meses de relaciones sexuales frecuentes sin uso de métodos anticonceptivos. Su pareja masculina, de 30 años, tiene una espermatobioscopía normal. La paciente tiene ciclos menstruales regulares de 28-29 días, sangrado moderado por 4 días sin dismenorrea incapacitante. Niega dispareunia o antecedentes de enfermedad inflamatoria pélvica. Al realizar una histerosalpingografía se reporta permeabilidad ovárica bilateral conservada y cavidad intrauterina de morfología habitual. Los niveles hormonales tomados en el día 21 del ciclo (Progesterona) rebasan los niveles ovulatorios e indican ovulación consistente.",
    "question": "¿Cuál es el siguiente paso más adecuado en el abordaje diagnóstico o terapéutico de esta pareja?",
    "options": [
      "Inseminación artificial con semen capacitado de la pareja.",
      "Realizar laparoscopia diagnóstica para descartar endometriosis silenciosa o adherencias pélvicas.",
      "Reevaluación de la reserva ovárica midiendo niveles de hormona antimülleriana y FSH al día 3 del ciclo.",
      "Diagnóstico de esterilidad de origen inexplicado; indicar estimulación ovárica controlada con clomifeno."
    ],
    "answerIndex": 1,
    "explanation": "Una vez que se han documentado los tres pilares iniciales (factor masculino normal, ovulación comprobada y permeabilidad tubárica con cavidad uterina normal), y el tiempo de esterilidad prosigue >1 año, se debe descartar patología pélvica oculta (como endometriosis adherencial leve o adherencias postinfecciosas microscópicas). La GPC y la práctica clínica indican que la laparoscopía es ideal en la fase final diagnóstica de esterilidad sin causa aparente, antes de escalar a tratamientos de la reproducción complejos, ya que no sólo diagnostica, sino que puede extirpar focos endometriales que resuelvan la subfertilidad espontáneamente.",
    "gpcReference": "GPC Diagnóstico y tratamiento inicial de la esterilidad en la mujer."
  },
  {
    "specialty": "gyo",
    "tema": "Amenorreas Primarias y Secundarias",
    "case": "Mujer de 15 años es traída por su madre a consulta debido a la ausencia de menarquia, refiriendo dolor cíclico abdominal bajo que se ha presentado con periodicidad mensual durante los últimos 6 meses. A la exploración física se observan caracteres sexuales secundarios desarrollados (Tanner IV en mama y vello púbico) de acuerdo con su edad cronológica, estatura dentro del percentil 50. La revisión genital muestra introito vaginal abombado con coloración violácea, sin sangrado a la inspección pero muy sensible al tacto superficial.",
    "question": "¿Cuál es el manejo inicial y terapéutico definitivo para esta presentación clínica?",
    "options": [
      "Confirmar diagnóstico con cariotipo y solicitar estudios de resonancia magnética ante sospecha de Síndrome de Rokitansky.",
      "Cruciotomía (incisión en cruz) de la membrana obstructiva bajo anestesia local o regional, asegurando el vaciamiento del hematocolpos.",
      "Prescribir anticonceptivos orales combinados en pauta continua para suprimir los ciclos dolorosos temporalmente.",
      "Solicitar ultrasonido pélvico endovaginal de urgencia y determinar FSH sérica."
    ],
    "answerIndex": 1,
    "explanation": "El caso clínico es clásico de un Himen Imperforado que se presenta como amenorrea primaria secundaria a un obstáculo anatómico bajo, con caracteres sexuales desarrollados y dolor pélvico cíclico ('criptomenorrea', formación de hematocolpos evidenciado por la membrana abombada y violácea a la inspección). El tratamiento es netamente quirúrgico, realizando un corte en cruz (cruciotomía o resección parcial de los bordes) para favorecer el drenaje y prevenir la endometriosis secundaria por reflujo de sangre pélvica.",
    "gpcReference": "GPC Diagnóstico, Tratamiento y Pronóstico del Síndrome del Dolor Pélvico Crónico y Amenorreas de Origen Anatómico."
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragia Uterina Anormal",
    "case": "Paciente femenina de 24 años con IMC de 31 kg/m2, acude a revisión por oligomenorreas (3 a 4 menstruaciones al año) e incremento en la densidad del vello facial y acné noduloquístico de difícil control dermoestético. USG revela ambos ovarios con más de 12 folículos subcapsulares. Tras haber intentado dieta, ejercicio y uso de anticonceptivos combinados que fueron suspendidos por intolerancia gástrica, la paciente desea mejorar el sangrado uterino debido a episodios de metrorragias intermitentes disfuncionales que reducen severamente su calidad de vida y nivel de hemoglobina (Hb actual: 11 g/dL).",
    "question": "¿Cuál de los siguientes abordajes terapéuticos hormonales sería el más adecuado dada la intolerancia reportada y el perfil de la paciente (no desea fertilidad ahora)?",
    "options": [
      "Uso profiláctico cíclico de 10-14 días al mes con progestágenos (por ej. medroxiprogesterona) para inducir descamación endometrial programada.",
      "Manejo crónico con Danazol para atrofia endometrial y supresión de la hiperplasia ovárica quística.",
      "Resección en cuña de los ovarios mediante laparoscopía (drilling ovárico).",
      "Ciclos de citrato de clomifeno ininterrumpidos."
    ],
    "answerIndex": 0,
    "explanation": "El caso describe Síndrome de Ovario Poliquístico (SOP). Ante la intolerancia a los AO combinados (el tratamiento de primera línea), el segundo objetivo clínico principal es proteger a la paciente de la hiperplasia endometrial por falta de ovulación (exposición estrogénica sin oposición), lo cual genera estos sangrados anormales. El pilar para estas pacientes son los progestágenos administrados cíclicamente durante 10 a 14 días cada mes para inducir deprivación y evitar metrorragias severas y reducir el riesgo de cáncer de endometrio. El drilling es sólo para cuando el objetivo es fertilidad resistente a clomifeno.",
    "gpcReference": "GPC Diagnóstico y tratamiento del Síndrome de Ovarios Poliquísticos."
  },
  {
    "specialty": "gyo",
    "tema": "Menopausia y Climaterio",
    "case": "Mujer de 54 años, con antecedente de FUM hace 18 meses, asiste a consulta de medicina integral quejándose de bochornos diurnos intensos (más de 10 episodios al día), insomnio, irritabilidad y resequedad vaginal moderada que condiciona dispareunia. Antecedentes heredofamiliares negativos para cáncer de mama y trombosis venosa. Índice de masa corporal de 23. Perfil de lípidos y mastografía bilaterales recientes dentro de rangos normales. Niega sangrado uterino e histerectomía previa.",
    "question": "¿Cuál sería el régimen ideal de primera línea en la terapia de reemplazo hormonal sistémica para el manejo de su sintomatología vasomotora?",
    "options": [
      "Aplicación exclusiva de estrógenos intravaginales tópicos o anillos de estriol de liberación prolongada.",
      "Esquema combinado continuo de estrógenos más progestágeno, para manejo del bochorno y protección endometrial.",
      "Terapia con tibolona y fitoestrógenos fitoterapéuticos diarios.",
      "Tratamiento estrogénico sistémico de acción pura sin oposición."
    ],
    "answerIndex": 1,
    "explanation": "Una paciente posmenopáusica (FUM hace más de 12 meses) sufriendo de síndrome climatérico vasomotor sintomático grave requiriendo tratamiento médico de primera línea (TRH). Ya que conserva su útero, es mandatorio que el tratamiento sistémico con estrógenos incluya progestágenos combinados (ya sea continuos o de forma secuencial) para oponerse al estímulo estrogénico proliferativo sobre el endometrio y así reducir a cero el aumento en riesgo de cáncer de endometrio. Los estrógenos tópicos solo servirían para su sequedad vaginal, no curan los 10+ bochornos diarios.",
    "gpcReference": "GPC Manejo integral de la etapa del climaterio y menopausia."
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragia Uterina Anormal",
    "case": "Mujer de 44 años con sangrado menstrual abundante desde hace 1 año, usando 6-7 toallas nocturnas al día e impactando su rutina. Hb: 8.8 g/dL. USG: mioma submucoso de 3.5 cm tipo 1 (clasificación FIGO), deforma cavidad endometrial significativamente. Ha recibido AINE, ácido tranexámico y anticonceptivos combinados pero el volumen sólo ha disminuido en un 15% sin lograr evitar la anemia. No desea fertilidad futura pero si expone el deseo conservador de evitar histerectomía de no ser sumamente forzoso.",
    "question": "¿Cuál es el tratamiento quirúrgico más adecuado conociendo que posee un claro deseo conservador el cual fue externado con su médico general?",
    "options": [
      "Histerectomía total abdominal resolutiva.",
      "Ablación endometrial generalizada de tercera generación por balón térmico.",
      "Miomectomía histeroscópica ambulatoria.",
      "Colocación de Dispositivo Intrauterino (DIU) liberador de Levonorgestrel directo en cama operatoria."
    ],
    "answerIndex": 2,
    "explanation": "Como el ejemplo dado, se trata de una paciente con Miomatosis de ubicación puramente *submucosa* (afectando la cavidad endometrial, lo que explica la menorragia refractaria). La recomendación máxima terapéutica (Gold standard) y conservadora del útero para miomas submucosos menores de 5 cm que fallan al manejo médico, es la extirpación dirigida mediante miomectomía histeroscópica. La ablación endometrial se evitaría en caso de masas intra-cavitarias de más de 2 cm; por ello la resección con asa diatermia es superior e idónea.",
    "gpcReference": "GPC Diagnóstico y tratamiento de Miomatosis Uterina."
  },
  {
    "specialty": "gyo",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "case": "Una paciente de 67 años acude refiriendo sentirse constipada, con indigestión y aumento rápido en de la envergadura del vientre (distensión) en los últimos 2 meses. Hay pérdida ponderal inexplicable de 8 kg. El estudio ultrasonográfico de emergencia sumado a la TAC abdominal corroboran abundante ascitis pélvica, sumado a un tumor ovárico predominantemente de morfología sólida heterogénea, multiseptado y con excrecencias gruesas en el anexo izquierdo (7 cm) que arroja siembras milimétricas serosas sobre el peritoneo de la cúpula diafragmática de hemidiafragma derecho.",
    "question": "¿A qué estadio clínico avanzado de la estadificación tradicional FIGO pertenece el cáncer epitelial de ovario cuando presenta afectación comprobada extrapélvica, es decir, implantes macróscopicos peritoneales fuera de la pelvis por encima del borde, comprobados en cápsula diafragmática o nivel de epiplón mayor?",
    "options": [
      "Estadio Funcional Localizado IIb.",
      "Estadio Epitelial III.",
      "Estadio Avanzado Metastásico Terminal IV.",
      "Estadio Quirúrgico Sistémico Ia."
    ],
    "answerIndex": 1,
    "explanation": "El abordaje oncológico del carcinoma epitelial de ovario agrupa la patología en múltiples etapas: Estadio I (limitado a ovarios). Estadio II (extensión contenida puramente intrapélvica). Estadio III (implicación pélvica pero que ha esparcido y sembrado metástasis peritoneales detectables fuera y más allá de la pelvis verdadera intrabdominalmente; un sitio primario de metástasis transcelómica típica es la superficie inferior hepática, el epiplón y la capa diafragmática). Finalmente, en el Estadio IV las metástasis viajan hematógenamente e invaden interior del parénquima hepático o derrames pleurales.",
    "gpcReference": "GPC Diagnóstico, tratamiento y seguimiento del cáncer epitelial del ovario."
  },
  {
    "specialty": "gyo",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "case": "Mujer de 33 años nativa de comunidad rural acude asintomática para revisión cervical tras jornada de salud. Inicio de relaciones sexuales múltiples a los 16 años y 3 partos previos vía vaginal. El frotis cervical reporta una citología vaginal convencional donde el patólogo diagnostica fidedignamente un LIE-AG (Lesión Intraepitelial Escamosa de Alto Grado). No tiene papanicolaou en los últimos 5 años documentado. A la exploración física y posterior colposcopia en unidad de colposcopia central, se muestra una zona de transformación extensa (T-1) con patrón de mosaico áspero, punteado grueso y borde de epitelio acetoblanco muy bien delimitado en el exocérvix.",
    "question": "¿Qué acción terapéutica o diagnóstica inmediata recomienda el consenso normativo en México una vez diagnosticado el antecedente citológico de Alto Grado con una colposcopia exocervical altamente satisfactoria (T-1) concurrente?",
    "options": [
      "Aplicar yodopovidona e hidróxido de potasio local, enviar receta de metronidazol en crema e indicar una repetición a los 6 meses de todo el abordaje.",
      "Proceder en ese momento con toma de cepillado endocervical y dar alta con biopsia a ciegas.",
      "Programa y técnica integral de conización profiláctica excisional de la lesión (ej. técnica LEEP, escisión con asa grande) conocida como abordaje de «ver y tratar».",
      "Indicación de histerectomía en bloque por alto riesgo de neoplasia silente microinvasora en el tracto transvaginal."
    ],
    "answerIndex": 2,
    "explanation": "Ante un reporte francamente sospechoso y de riesgo inminente de displasia severa / pre-cáncer (LIE-AG o NIC-2/NIC-3), y sumado al hallazgo colposcópico también positivo y completamente abordable en una zona controlada del exocérvix, la estrategia salvavidas internacional en mujeres post-adolescentes de su edad e historia es la cirugía excisional ambulatoria 'ver y tratar' (See & Treat) mediante conización con asa de alambre (LEEP). Retira toda la transformación aberrante eliminando el tejido afectado y logrando obtener todos los cortes listos para asegurar la ausencia de algo más avanzado de forma inmediata.",
    "gpcReference": "GPC Prevención oportuna, Diagnóstico y Tratamiento en la paciente pre-cáncer invasor de CaCu y displasias LEIBG/LEIAG."
  },
  {
    "specialty": "gyo",
    "tema": "Patología Mamaria: Benigna y Cáncer de Mama",
    "case": "Durante autoexploración rutinaria, una mujer de 42 años sin factores de riesgo en la genética primaria de su árbol genealógico, se palpó un cuerpo duro e indurado de bordes francamente irregulares y estriados. Es fijado e inmóvil de aprox 15 mm en el cuadrante superoexterno de la glándula senosófica derecha. La mastografía acusa a la lesión de estar dentro de categoría BI-RADS 4C, sugiriendo alta preocupación biológica de malignidad intermedia a alta. Al ecosonograma: nódulo hipoecoico, no paralelo y peor delimitado, que posee una sombra acústica posterior significativa en forma de cono atenuante invertido.",
    "question": "¿Cuál de los siguientes está considerado normativamente como el 'Gold Standard' de biopsia con técnica invasiva inicial requerida a fin de extraer tejido arquitectónico íntegro del estroma fibrótico para el marcaje previo oncológico de ese tumor sólido dudoso?",
    "options": [
      "Extracción local total abierta de mama en sala de quirófano en bloque.",
      "Biopsia percutánea de diagnóstico de tejido sólido con aguja de corte / hueso (aguja gruesa / Tru-Cut) preferentemente mediante el ecógrafo como guía.",
      "Biopsia citológica de punción por aspiración de calibre fino (BAAF) al ser muy rápida en la unidad ginecológica.",
      "Prueba sérica de marcadores tumorales genéticos con recesión profiláctica ante la positividad."
    ],
    "answerIndex": 1,
    "explanation": "Cualquier masa de parénquima mamario de nueva conformación en mujer premenopáusica pasados de 40 catalogada en escala BI-RADS como sospechosidad (sea BI-RADS 4A, 4B, 4C o un 5 obvio), requiere imperativamente comprobación 'histológica' celular, con arquitectura tisular sólida completa que desmuestre qué componente existe para decidir el abordaje posterior masivo. Ese objetivo es inalcanzable con la anticuada aguja celular fina PAAF que se guarda mejor para drenaje de tumoraciones quísticas simples de agua. Su salvación es realizar aguja Core de núcleo hueco de alta velocidad, también mal llamada biopsia de Tru-cut.",
    "gpcReference": "GPC Protocolo Nacional Clínico Quirúrgico de la detección, y prevención general de alteraciones nodulares y de las etapas incipientes de tejido mamario."
  },
  {
    "specialty": "ped",
    "tema": "Introducción a la Pediatría / Reanimación Neonatal",
    "case": "Recién nacido a término (39 semanas de gestación), obtenido por parto vaginal eutócico. Líquido amniótico claro. Al nacimiento, no respira y presenta flacidez marcada. Se coloca bajo fuente de calor radiante, se posiciona la vía aérea, se secan secreciones, y se estimula táctilmente, sin obtener respuesta. La frecuencia cardíaca evaluada por auscultación en la base del cordón umbilical es de 80 latidos por minuto. Presenta cianosis central.",
    "question": "¿Cuál es el paso inmediato más apropiado y de mayor impacto en la reanimación de este paciente según los lineamientos actuales de reanimación neonatal (NRP)?",
    "options": [
      "Administrar oxígeno a flujo libre al 100% y reevaluar en 30 segundos.",
      "Iniciar compresiones torácicas con técnica de los dos pulgares a un ritmo de 90 compresiones por minuto.",
      "Iniciar ventilación a presión positiva (VPP) con bolsa-mascarilla o neopuff a una frecuencia de 40-60 respiraciones por minuto.",
      "Intubación endotraqueal inmediata y administración de epinefrina intratraqueal."
    ],
    "answerIndex": 2,
    "explanation": "El paso más importante y efectivo en la reanimación neonatal es la ventilación de los pulmones. Si, tras los pasos iniciales (calentar, posicionar, despejar vía aérea, secar y estimular), el recién nacido permanece en apnea, jadeo/boqueo (gasping) o la frecuencia cardíaca es menor de 100 lpm (en este caso 80 lpm), se debe iniciar inmediatamente la Ventilación a Presión Positiva (VPP). Las compresiones torácicas sólo se inician si la frecuencia cardíaca persiste por debajo de 60 lpm a pesar de al menos 30 segundos de VPP efectiva que movilice el tórax.",
    "gpcReference": "Programa de Reanimación Neonatal (NRP) 8va Edición / GPC Reanimación Neonatal."
  },
  {
    "specialty": "ped",
    "tema": "Patología Neonatal Infecciosa",
    "case": "Neonato primigesto de 5 días de vida, nacido a las 38 semanas de gestación por parto vaginal. Madre con antecedente de ruptura prematura de membranas de 22 horas y fiebre intraparto de 38.5°C. El paciente no recibió profilaxis antibiótica intraparto. Acude al servicio de urgencias porque la madre lo nota 'apagado', rechaza el seno materno, y ha presentado un episodio de hipotermia (35.8°C en casa). A la exploración: letárgico, taquicardia de 170 lpm, polipnea de 65 rpm y llenado capilar de 4 segundos. La biometría hemática reporta leucopenia de 4,000/mm3, neutrófilos inmaduros/totales (índice I/T) de 0.25 y PCR de 45 mg/L.",
    "question": "¿Cuál es el esquema antibiótico empírico de primera elección más apropiado mientras se esperan los resultados de los hemocultivos y cultivos de LCR en este paciente?",
    "options": [
      "Cefotaxima + Vancomicina intravenosa.",
      "Ampicilina + Gentamicina o Amikacina intravenosa.",
      "Amikacina + Meropenem intravenoso.",
      "Ceftriaxona + Clindamicina intravenosa."
    ],
    "answerIndex": 1,
    "explanation": "El paciente presenta un cuadro clínico y factores de riesgo clásicos de sepsis neonatal temprana (manifestaciones tempranas, RPM prolongada, fiebre materna). Los microorganismos más frecuentes en esta etapa son Estreptococo del Grupo B (S. agalactiae) y E. coli. El esquema antibiótico empírico de primera línea recomendado por la GPC mexicana para sepsis temprana es la combinación de ampicilina (cubre S. agalactiae, Listeria, Enterococos) + un aminoglucósido, habitualmente gentamicina o amikacina (cubre Gram negativos). La ceftriaxona está contraindicada en neonatos por el riesgo de desplazamiento de bilirrubina y kernicterus.",
    "gpcReference": "GPC Prevención, Diagnóstico y Tratamiento de la Sepsis Neonatal."
  },
  {
    "specialty": "ped",
    "tema": "Patología Respiratoria Neonatal",
    "case": "Recién nacido postérmino de 41.5 semanas de gestación. Parto complicado por distocia de hombros y líquido amniótico teñido de meconio espeso (puré de chícharos). Al nacer se encuentra deprimido, sin tono muscular y con esfuerzo respiratorio ausente, requiriendo reanimación avanzada. A las 2 horas de vida, ingresa a UCIN por insuficiencia respiratoria severa, requiriendo FiO2 del 80% para mantener saturación >90%. La radiografía de tórax muestra hiperinsuflación bilateral severa, infiltrados algodonosos gruesos asimétricos parcheados y aplanamiento de los hemidiafragmas.",
    "question": "¿Cuál de los siguientes mecanismos fisiopatológicos explica PRINCIPALMENTE el patrón radiológico de hiperinsuflación en este paciente?",
    "options": [
      "Déficit primario de surfactante pulmonar por inmadurez de los neumocitos tipo II.",
      "Retraso en la reabsorción linfática del líquido pulmonar fetal por falta de compresión torácica durante el parto.",
      "Obstrucción neumática parcial generando un mecanismo de 'válvula de bola' e inflamación química secundaria.",
      "Hipertensión pulmonar persistente primaria con cortocircuito directo masivo de derecha a izquierda."
    ],
    "answerIndex": 2,
    "explanation": "El caso describe un Síndrome de Aspiración de Meconio (SAM), patología típica del postérmino. El meconio espeso en la vía aérea fina causa obstrucción parcial que funciona como un mecanismo de válvula. Durante la inspiración (que fisiológicamente dilata los bronquios) el aire entra forzadamente, pero en la espiración (constricción fisiológica bronquial) el meconio cierra la luz y atrapa el aire. Este fenómeno de 'válvula de bola' causa la progresiva distensión alveolar y la hiperinsuflación severa vista en Rx (riesgo latente de neumotórax).",
    "gpcReference": "GPC Diagnóstico y tratamiento del Síndrome de Aspiración de Meconio."
  },
  {
    "specialty": "ped",
    "tema": "Infecciones TORCH y VIH Pediátrico",
    "case": "Lactante menor de 4 meses es llevado a consulta por historia prolongada de fiebre intermitente, irritabilidad y lesiones en la piel. A la exploración física destaca microcefalia (perímetro cefálico por debajo del percentil 3), retinitis en parche (cicatrices coriorretinianas hiper e hipopigmentadas bilaterales) observadas a la oftalmoscopia y calcificaciones intracraneales de predominio netamente generalizado/difusas observadas en la TAC simple de cráneo. La madre, quien vive en área rural y convive con abundantes gatos domésticos y callejeros, relata haber tenido un cuadro de mononucleosis inespecífico en su primer trimestre.",
    "question": "¿Cuál es el diagnóstico nosológico congénito más probable basándose en la tétrada sintomática y antecedentes?",
    "options": [
      "Infección congénita por Citomegalovirus (CMV).",
      "Síndrome de Rubéola Congénita Clásica.",
      "Síndrome de Toxoplasmosis congénita.",
      "Sífilis congénita temprana grave."
    ],
    "answerIndex": 2,
    "explanation": "Las calcificaciones intracraneales, la coriorretinitis, hidrocefalia o microcefalia, y las convulsiones conforman la tétrada clásica de Sabin para Toxoplasmosis Congénita. El detalle diferencial clave en México para distinguir CMV de Toxoplasmosis es la distribución de las calcificaciones en la tomografía: Toxoplasmosis genera calcificaciones DISPERSAS o difusas múltiples de predominio cortical, mientras que CMV ocasiona calcificaciones con marcado predominio PERIVENTRICULAR en el epéndimo. La convivencia con gatos refuerza drásticamente al Toxoplasma.",
    "gpcReference": "GPC Diagnóstico, Tratamiento y Prevención de la Toxoplasmosis intrauterina."
  },
  {
    "specialty": "ped",
    "tema": "Estenosis Hipertrófica de Píloro",
    "case": "Lactante varón primogénito de 4 semanas de vida acude a urgencias por historia de 5 días referida por la madre como vómitos en 'proyectil', de consistencia lechosa coagulada franca y que son postprandiales, sin contenido biliar o verdoso JAMÁS. Tras regurgitar, el bebé busca el seno materno muy hambriento. Está llorón, con los ojos hundidos. A la exploración abdominal palpamos una masa dura y muy móvil en forma de 'oliva' localizada en el cuadrante superior derecho o epigastrio. Gasometría venosa: pH 7.52, pCO2 45, HCO3 32, Cl 88, K 3.0 mEq/L.",
    "question": "¿Cuál de las siguientes alteraciones patognomónicas es la que presenta este lactante en sus exámenes serológicos?",
    "options": [
      "Acidosis metabólica e hipercalemia renal paradójica.",
      "Alcalosis respiratoria hipernatrémica con pérdida selectiva de agua libre.",
      "Acidosis mixta con anión gap marcadamente elevado.",
      "Alcalosis metabólica hipoclorémica e hipocalémica."
    ],
    "answerIndex": 3,
    "explanation": "La estenosis del píloro ocasiona un bloqueo gástrico total originando vómitos netamente postprandiales ALIMENTARIOS (sin bilis). Al perderse enormes cantidades de fluido gástrico de altísimo contenido de HCl (ácido clorhídrico), el organismo se alcaliniza y el cloro plasmático se desploma. A nivel renal, intentando corregir y salvar volumen y fluidos corporales reteniendo agua y sodio a toda costa, la maquinaria tubular intercambia expulsando en su lugar iones de potasio. El resultado de laboratorio clásico (de ENARM) es: Alcalosis Metabólica Hipoclorémica e Hipocalémica.",
    "gpcReference": "GPC Diagnóstico y tratamiento de la Estenosis Hipertrófica del Píloro."
  },
  {
    "specialty": "ped",
    "tema": "Crecimiento y Desarrollo P2",
    "case": "Durante control institucional pediátrico ambulatorio (Niño Sano), valora a una bebé femenina de 9 meses. Apetito voraz y duerme bien. En su evaluación psicomotora nota que la bebé logra mantenerse sentada sola, rola del prono al supino sin ningún problema, mas no hace intentos de gatear. Tampoco intenta ponerse de pie sujetada a las cosas. En motricidad fina, cuando le entrega una ficha, la atrapa utilizando ambas manos a modo de palas completas ('toda la mano') y falla dramáticamente en utilizar sus pulgares ni logra traspasar la ficha de la mano izquierda a la derecha sin soltarla sobre la mesa.",
    "question": "¿Qué hito de motricidad fina DEBE estar presente obligadamente a los 9 meses de edad, cuya ausencia franca representaría en este caso una evidente señal de alarma ('bandera roja') para remisión a neuropediatría?",
    "options": [
      "Lograr apilar firmemente una torre de 2 o 3 cubos de 1 pulgada.",
      "Manifestar pinza fina madura (empuñar objetos microscópicos con total independencia del dedo índice y pulgar).",
      "Transferencia de objetos entre las manos con éxito constante.",
      "Garabatear espontáneamente y con decisión usando una crayola."
    ],
    "answerIndex": 2,
    "explanation": "Reconocer los hitos maduracionales es indispensable. A los 6 meses el lactante adquiere la 'prensión palmar' (tomar con toda la mano). Entre el 6to y el 7mo mes (y con fecha límite innegociable a los 8-9 meses), el menor debe aprender y dominar la 'transferencia', que es cruzar línea media para pasar los objetos de una mano a la diestra. Que un bebé de nueve meses no transfiere, sugiere inmadurez grave de hemisferios. (A esta edad debería también empezar a ensayar la pinza inferior). Las torres son pasados los 15 meses.",
    "gpcReference": "GPC Desarrollo de la niña y el niño menor de 5 años. Lineamientos del Manual EDI."
  },
  {
    "specialty": "ped",
    "tema": "Vacunación",
    "case": "Lactante varón de 4 meses de edad es llevado dócilmente a su Centro de Salud para vacunas intramusculares. Sus padres presentan su esquema oficial al corriente; tiene antecedentes de nacimientos sin complicaciones, no cursa con inmunodeficiencia primaria o adquirida ni sufre dermatitis en este momento. Sin embargo, el antecedente de suma relevancia es que a los 3 meses de edad este recién nacido padeció invaginación intestinal idiopática a nivel ileocólico, solucionada por neumática exitosa y de la cual fue dado de alta, hallándose en estado asintomático gastrointestinal hoy.",
    "question": "¿Qué biológico correspondiente a su actual Visita Pediátrica Mensual está ABSOLUTAMENTE CONTRAINDICADO y deberá cancelarse de inmediato para evitar recaídas sistémicas en su aparato digestivo?",
    "options": [
      "Vacuna oral contra Rotavirus pentavalente humana (RV5).",
      "Vacuna Intramuscular Pentavalente o Hexavalente (DPaT+VPI+Hib+HepB).",
      "Vacuna Neumocócica Conjugada subcutánea (VCN13).",
      "No existe biológico contraindicado en invaginación previa, por lo que se deben aplicar los 3 anteriores."
    ],
    "answerIndex": 0,
    "explanation": "La intususcepción (invaginación) intestinal es una condición obstructiva grave. La principal vacuna históricamente, demostrada y actualmente asociada de manera causal a cuadros isquémicos como la intususcepción intestinal es la vacuna frente a Rotavirus (que se compone de partículas virales vivas atenuadas otorgadas de forma oral). Padecerla previamente se clasifica como la contraindicación primaria y absoluta descrita por todas las GPC para no recibir dosis adicionales de RV. Las pentavalente/hexavalente y de neumococo están perfectamente pautadas.",
    "gpcReference": "GPC Esquema de Vacunación Nacional."
  },
  {
    "specialty": "ped",
    "tema": "Enfermedad Diarreica Aguda y Planes de Hidratación",
    "case": "Paciente femenino de 13 meses de vida es vista en área de primer contacto. Su cuadro de 3 días se basa en diarrea pastosa y ahora líquida (más de 8 pañales/día sin sangre visible) y 4 cuadros de hemesis aguda (vómitos) la mañana de hoy al intentar beber sus tés. Pesa 9.5 kg actualmente. A la evaluación general: mucosas sublinguales blanquecinas y en extremo secas, saliva filante, y ausencia de lágrimas al emitir berrinches violentos de llanto ('irritabilidad franca'). Tolerancia a líquidos oral está abolida vomitando el 100%. Sus signos vitales: FC 145, FR 32. Su llenado capilar distal es de sólo 2 segundos.",
    "question": "¿Con qué condición nosológica de rehidratación la clasificaría la OMS según su evaluación inicial y cuál es el paso inmediato?",
    "options": [
      "Bebé Sin Deshidratación Evaluable -> Hidratación en sede de hogar a modo libre.",
      "Paciente con Algún Grado de Deshidratación Clínica (Leve/Moderada) -> Rehidratar en Unidad Médica supervisándola empleando sonda nasogástrica o gastroclisis administrando Vida Suero Oral (Plan B).",
      "Paciente con Deshidratación Grave y Choque Severo -> Expandir con Ringer Lactato en minibolos (Plan C).",
      "Paciente de alto riesgo de uremia -> Suspender aportaciones vía oral temporalmente por 24 horas y manejar con Ceftriaxona."
    ],
    "answerIndex": 1,
    "explanation": "Una de las clasificaciones madre del ENARM es la diarrea. Esta menor luce francamente seca (no tiene lágrimas, oral empastado) sumado a la irritabilidad excesiva dictan 'Algún grado de deshidratación'. Como el pliegue es < 2 segundos, y no tiene hipotensión, pulsos indetectables ni letargo (estado de coma o postración), NO SE CONSIDERA de tercer grado (NO es Plan C, no está en choque). Al cumplir el diagnóstico de Plan B pero manifestando VÓMITO CONSTANTE E INTOLERANCIA A LA VÍA ORAL por taza o cuchara, se establece usar obligadamente SONDA NASOGÁSTRICA en unidad (100 ml/kg cada 4 hrs) con el famoso Plan B de la OMS y GPC.",
    "gpcReference": "GPC Prevención, Diagnóstico y Tratamiento de Diarrea Aguda y deshidratación (Planes OMS)."
  },
  {
    "specialty": "ped",
    "tema": "Infecciones de Vías Respiratorias Superiores",
    "case": "Preescolar masculino de 3 años, asiste a consulta en enero, porque tiene escurrimiento y coriza desde hace 4 días y repentinamente desde anoche se queja de un inmenso dolor tirante sobre su oído derecho. Lloró toda la madrugada, y está febril cursando con 39.4 °C de temperatura. En la otoscopia revelas un conducto normal y una membrana timpánica del oído diestro muy roja, opaca, sumamente abombada expulsando el reflejo luminoso de su sitio, que ni siquiera se moviliza a la insuflación neumática. Nunca ha sido medicado contra estafilococos o neumococos recientemente.",
    "question": "¿Frente a una OMA aguda y severa por presentar fiebre mayor de 39 y dolor exacerbado documentado en un prescolar sin amoxicilinas de base o alergias pasadas, qué esquema farmacológico curativo inicial recomienda estipular la Guía de Práctica Clínica mexicana?",
    "options": [
      "Amoxicilina con Ácido Clavulánico (80-90 mg/kg/día pautadas cada 12 hrs) durante de 10 a 14 días constantes.",
      "Azitromicina de inicio rápido a 10 mg/kg el día uno por las siguientes cuatro fases.",
      "Amoxicilina sóla vía oral a dosis alta ponderal de primera línea (80-90 mg/kg/día en fracciones) a cursar en 10 días continuados.",
      "Vigilancia silenciosa únicamente con paracetamol al tratarse de caso unilateral, sin prescripción beta-lactámica los 3 primeros días."
    ],
    "answerIndex": 2,
    "explanation": "El niño exhibe el esquema clínico máximo de OMA de origen netamente grave: OMA verdadera confirmada (eritema más fuerte abombamiento o derrame fijo confirmados a cámara neumática otoscópica) con el gran acompañamiento febril inmanejable (> 39 grados en infantes) y dolor inmenso de sueño. Estas banderas invalidan la oportunidad de 'mantener en vigilancia sola 72 h', y requieren ataque antibiótico al Streptococcus pneumoniae, el patógeno estelar. La recomendación primaria sin complicaciones de GPC de OMA ante fiebre grave es instaurar Amoxicilina DIRECTA en DOSIS ALTAS (80-90mg/kg/dia) esquivando primero el ácido clavulánico. (El clavulanato se reserva exclusivamente para falla a manejo en 72 hrs o existencia comórbida de conjuntivitis purulenta).",
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Otitis Media Aguda en la Edad Pediátrica."
  },
  {
    "specialty": "ped",
    "tema": "Urgencias Pediátricas",
    "case": "Niño de 4 años de edad que sufre quemadura térmica accidental (por olla de frijoles hirvientes en cocineta de piso). El evento empapó brutalmente todo el miembro superior dominante derecho (brazo, antebrazo y mano por ambos bordes) y todo el volumen anatómico del tórax y abdomen por su cara anterior. El paramédico inspecciona la epidermis y dicta piel despellejada, húmeda, muy 'llorosa', intensamente hiperémica roja pero que inmediatamente se decolora/palidece si se presiona el lecho capilar; el paciente está gritando de exacerbado dolor.",
    "question": "¿De acuerdo con la valoración clínica por inspección general, cómo tipificamos la quemadura en cuanto a su superficie total y grado de progresión en hondura o estrato dérmico?",
    "options": [
      "Superficie SCQ de 27% // Corresponde a nivel de Segundo Grado Superficial (Espesor parcial dérmico).",
      "Superficie de SCQ de 18% // Evaluada a una maduración de Tercer grado epidérmico.",
      "Superficie de SCQ de 22.5% // Con un factor asociado al Segundo grado Profundo.",
      "Superficie SCQ de 36% // Catalogada histológicamente dentro del Tercer Grado clásico total (Espesor absoluto)."
    ],
    "answerIndex": 0,
    "explanation": "El caso evalúa con regla de Parkland y la inspección médica física. Por un lado 'Tórax y abdomen anterior completo' suma en la regla simplificada hasta 18% SCQ; sumado al brazo diestro absoluto (9%), totaliza 27% de Extensión de la Superficie Corporal. Respecto al estrato en profundidad, los indicios de lechos hiperémicos, altísima humedad o lagrimeo (por deprendimiento y ampulización bullosa) mas gran palidez comprobable bajo compresión rápida dictan permeabilidad y vitalidad nerviosa subyacente. Esta semiología caracteriza perfectamente a la 'quemadura por escala' clásica de Segundo Grado en su modalidad Superficial.",
    "gpcReference": "GPC Tratamiento Integral de las Quemaduras. Reanimación Básica ATLS/ABLS."
  },
  {
    "specialty": "mi",
    "tema": "Enfermedades transmitidas por Vector",
    "case": "Paciente masculino de 28 años, originario y residente de Veracruz. Acude a urgencias con historia de 4 días de fiebre continua de 39.5°C, cefalea intensa de predominio retroocular, mialgias y artralgias incapacitantes ('fiebre quebrantahuesos'). El día de hoy refiere que la fiebre desapareció (defervescencia), pero súbitamente comenzó con dolor abdominal intenso y continuo, vómitos persistentes (más de 4 en 6 horas) y astenia profunda. A la exploración física se encuentra con palidez, frialdad distal, y se palpa hepatomegalia de 3 cm por debajo del reborde costal. Laboratorios: Hematocrito de 52% (elevación súbita respecto a uno basal previo de 44%), plaquetas de 35,000/mm3.",
    "question": "¿En qué etapa y clasificación clínica de la enfermedad se encuentra este paciente y cuál es la manifestación fisiopatológica principal que rige su gravedad actual?",
    "options": [
      "Fase febril / Dengue No Grave con Signos de Alarma / Causado por trombocitopenia autoinmune.",
      "Fase crítica / Dengue con Signos de Alarma / Causado por extravasación transitoria de plasma mediada por aumento de la permeabilidad vascular.",
      "Fase de recuperación / Dengue Grave / Causado por sangrado inminente del tubo digestivo por hepatopatía.",
      "Fase crítica / Dengue Grave / Causado por coagulación intravascular diseminada con falla orgánica."
    ],
    "answerIndex": 1,
    "explanation": "El paciente se encuentra en el período de 'defervescencia' (cuando cae la fiebre entre el 3er y 6to día), el cual marca el inicio de la MÁS PELIGROSA: la 'Fase Crítica'. Clínicamente, acaba de desarrollar dolor abdominal continuo, vómitos persistentes y hepatomegalia palpable, los cuales son los estrictos 'Signos de Alarma' definidos por OMS/GPC que advierten un posible choque inminente. La fisiopatología central que desencadena estos signos (y eleva bruscamente el hematocrito a 52%) no es el sangrado, sino la extravasación y fuga masiva de plasma hacia el tercer espacio debido a severa fuga capilar mediada por citocinas inmunológicas.",
    "gpcReference": "GPC Prevención, Diagnóstico y Tratamiento del Dengue y Dengue Hemorrágico."
  },
  {
    "specialty": "mi",
    "tema": "Cardiología: Cardiopatía Isquémica",
    "case": "Hombre de 62 años, diabético con mal apego (HbA1c 9.5%) e hipertenso. Es traído por paramédicos tras 40 minutos de opresión toráxica retroesternal intensa, irradiada al brazo izquierdo y mandíbula, acompañada de diaforesis profusa y náusea clínica. A su llegada, sus signos son: TA 100/60 mmHg, FC 95 lpm, SatO2 93%. El electrocardiograma (ECG) inicial de 12 derivaciones en los primeros 10 minutos de la puerta revela una clara elevación del segmento ST de 3 mm en las derivaciones V1, V2, V3 y V4.",
    "question": "¿Qué arteria coronaria es casi con toda certeza el vaso causal (culpable) de este evento isquémico agudo detectado y qué cara anatómica del miocardio está sufriendo necrosis?",
    "options": [
      "Arteria Circunfleja Izquierda / Cara Lateral Alta.",
      "Arteria Coronaria Derecha / Cara Inferior y Ventrículo Derecho.",
      "Arteria Descendente Anterior Izquierda / Cara Anteroseptal.",
      "Tronco Coronario Principal Izquierdo / Corazón Global."
    ],
    "answerIndex": 2,
    "explanation": "La interpretación electrocardiográfica estricta indica que V1 y V2 visualizan el tabique interventricular (Septo), mientras que V3 y V4 visualizan la pared anterior del ventrículo izquierdo. El patrón de supradesnivel del ST en la tira que abarque V1 a V4 conforma un Infarto Agudo de Miocardio con Elevación del ST (IAMCEST) 'Anteroseptal'. La arteria que irriga invariablemente toda la pared anterior y los 2/3 anteriores del tabique es la Descendente Anterior Izquierda (DA), rama capital de la coronaria izquierda.",
    "gpcReference": "GPC Diagnóstico y tratamiento del Infarto Agudo de Miocardio con Elevación del Segmento ST en Mayores de 65 años (IAMCEST)."
  },
  {
    "specialty": "mi",
    "tema": "Tuberculosis",
    "case": "Masculino de 45 años de edad con antecedente de tabaquismo pesado y situación de hacinamiento por encarcelamiento previo hace 2 años. Acude al centro de salud aquejado por una tos crónica de 3 meses de evolución, que inicialmente era seca y ahora es purulenta, presentando hebras sanguinolentas (hemoptisis leve) durante las madrugadas. Presenta pérdida inexplicable de 12 kg, fiebre vespertina constante y fatiga severa. Muestra baciloscopías seriadas de esputo reportando BAAR con tres cruces (+++). Se decide iniciar inmediatamente Tratamiento Acortado Estrictamente Supervisado (TAES) fase intensiva primaria.",
    "question": "¿Cuál de los fármacos que integran el esquema de primera línea intensiva tradicional (Dotbal) en nuestro país, se le atribuye como principal efecto adverso la Neuritis Óptica (baja agudeza visual y alteración rojoverde)?",
    "options": [
      "Isoniazida (H).",
      "Rifampicina (R).",
      "Pirazinamida (Z).",
      "Etambutol (E)."
    ],
    "answerIndex": 3,
    "explanation": "El Etambutol (E) es un agente bacteriostático del cuadro antifímico primordial cuya toxicidad por excelencia descrita clásicamente para el ENARM es la neuritis óptica bulbar o retrobulbar, que desencadena ceguera a los colores (discromatopsia predominante rojoverde) y pérdida de la agudeza visual, a menudo dosis-dependiente. A diferencia de esto, la Isoniazida ocasiona Polineuropatía periférica (parestesias) y hepatotoxicidad; la Rifampicina marca de rojo fluidos corporales con hepatotoxicidad; y la Pirazinamida es altamente hepatotóxica y genera hiperuricemia severa (gota).",
    "gpcReference": "GPC Diagnóstico y tratamiento de la Tuberculosis Pulmonar en Primer Nivel."
  },
  {
    "specialty": "mi",
    "tema": "Complicaciones Agudas de Diabetes",
    "case": "Mujer joven de 22 años, recientemente diagnosticada con Diabetes Mellitus tipo 1, es llevada a urgencias en estado de estupor. Ha estado cursando con una infección urinaria descuidada. Presenta respiración profunda, laboriosa y suspirante (Respiración de Kussmaul), severa deshidratación, y aliento característico a 'manzana ácida'. La analítica sanguínea revela: Glucosa 480 mg/dL, pH arterial 7.15, HCO3 de 10 mEq/L, pCO2 de 25 mmHg. Cetonas séricas altamente positivas, potasio de 4.8 mEq/L y sodio de 136 mEq/L.",
    "question": "¿Dentro del protocolo estricto de manejo secuencial en la Unidad de Choque, cuál es la PRIMERA y más primordial indicación médica a iniciar simultáneamente con la evaluación de los laboratorios en este caso?",
    "options": [
      "Infusión en bomba continua de Insulina Rápida (Regular) a 0.1 U/kg/h para revertir inmediatamente la acidez sanguínea.",
      "Habilitar de Inmediato restitución vigorosa de volumen con solución Cristaloide Salina Isotónica NaCl al 0.9% en gran bolo (1L h-1).",
      "Aplicación de una ampolleta de Bicarbonato de Sodio IV urgente para normalizar su pH que cayó de la ventana de 7.20.",
      "Reposición de Potasio con KCl intravenoso central ante pseudohipercalemia celular."
    ],
    "answerIndex": 1,
    "explanation": "En la Cetoacidosis Diabética (CAD), la marcada hiperglucemia unida a la glucosuria masiva arrastra y deplesiona el volumen corporal profundo forjando diuresis osmótica (la paciente está en choque hipovolémico clínico). Las guías internacionales y mexicanas estipulan de manera inflexible que EL PRIMER paso de la pirámide de tratamiento siempre es restituir el volumen con hidratación agresiva mediante NaCl 0.9% (Incluso antes de poner insulina). Arrancar insulina como medida cero si hay volumen bajo llevaría a choque profundo por pase osmolar hídrico o peor, llevar a la paciente a un paro hipocalémico. El Bicarbonato está contraindicado amenos que el pH esté por debajo de ¡6.9!",
    "gpcReference": "Guías ADA anuales / GPC Manejo de las complicaciones agudas de la Diabetes (Cetoacidosis Diabética)."
  },
  {
    "specialty": "mi",
    "tema": "Neurología: Enfermedad Vascular Cerebral",
    "case": "A las 14:00 horas, un varón de 68 años con fibrilación auricular tabaquística ingresa por la aparición de una hemiparesia braquiocrural derecha densa de instauración ultra-súbita que le colapsó, seguida de desviación ocular hacia la izquierda y afasia sensitivomotora global confirmada por el neurólogo. Sus familiares, altamente atentos, señalan que él estaba perfectamente sano sentándose a comer exactamente a las 12:50 del mediodía. Su nivel de TA de llegada es 170/95. La tomografía axial computarizada de cráneo sin contrate inicial (14:15 hrs) se reporta absolutamente libre de hemorragias en todos los cortes, sin mostrar tejido negro isquémico masivo agudo al momento.",
    "question": "¿De acuerdo con los consensos del tratamiento del stroke isquémico, qué criterio permite catalogar a este paciente como candidato de altísima prioridad indiscutible al uso de activador tisular del plasminógeno (Alteplasa IV / rt-PA)?",
    "options": [
      "Al no tener isquemia visible en ventana de una TC simple de cráneo inicial a las 2 hrs, se requiere forzosamente obtener una Resonancia Magnética (RMI) con protocolo stroke angio para indicar un fibrinolítico.",
      "La cifra de Presión Arterial reportada de 170/95 contraindica rotundamente la fibrinólisis hoy.",
      "El déficit severo se encuentra dentro de la estrecha 'Ventana Terapéutica' estándar comprobada menor de 3 horas (hasta 4.5 horas prolongadas), existiendo clara e irrefutable temporalidad del déficit SIN sangrado excluyente a la TAC.",
      "Por el antecedente de fibrilación auricular documentada el manejo de un émbolo cerebral descarta trombolíticos y lo arroja única y exclusivamente a heparinas no fraccionadas en un evento agudo de urgencia."
    ],
    "answerIndex": 2,
    "explanation": "El paciente cumple el 'Holy Grail' de Trombólisis cerebral: 1) EVC focal isquémico súbito y agudo originando un déficit neurológico clínicamente grave. 2) Se asienta firmemente y presencialmente que sucedió e inicio hace < 4.5 horas exactas ('12:50 a 14:15'), por lo que encuadra en ventana oro de rescate de penumbra isquémica donde un fibrinolítico previene necrosis total irreversible. 3) Criterio imagenológico clave: la TC simple debe ser puramente normal y limpia de SANGRE (el coágulo naciente rara vez oscurece el tejido y se daña visiblemente antes de 24 hs en TCs) la ausencia de este asegura falta de EVC hemorrágico, y permite el destape de la arteria.",
    "gpcReference": "GPC Diagnóstico y tratamiento de la Enfermedad Vascular Cerebral Isquémica en el Segundo Nivel."
  },
  {
    "specialty": "mi",
    "tema": "Nefrología: Lesión Renal Aguda",
    "case": "Campesino de 55 años, varón que laboró 12 horas seguidas en extremo calor estival sin hidratación bebible, y padeció una grave intoxicación alimentaria simultánea en la jornada presentando copiosas 15 evacuaciones líquidas abundantes y vómitos seguidos anoche. Ingresa letárgico, taquicárdico, turgencia cutánea de 'carpa' pobre e hipotensión de 80/50. En el balance registra únicamente anuria (< 50 ml) durante todo el día moderno. En los paraclínicos urgentes se arroja: Urea en la sangre multiplicada al triple, creatinina 3.0 mg/dL, Fracción Excretada de Sodio (FeNa) calculada del sedimento urinario en 0.4% (< 1%), relación NUS/Creatinina en sangre >20:1, su sedimento microscópico está en blanco careciendo de cilindros marrones u otros.",
    "question": "¿A qué cuadro fisiopatológico nefrítico encaja perfectamente esta clasificación funcional según características biomédicas, el FeNa aportado, sedimento transparente y la relación descrita?",
    "options": [
      "Lesión Renal intrínseca clásica parenquimatosa aguda (Necrosis Tubular Aguda) por choque hipovolémico prolongado.",
      "Falla Renal Aguda de componente y fisiología netamente 'Prerrenal'.",
      "Afectación nefrítica glomerular obstructiva intranefronal aguda.",
      "Insuficiencia Renal Crónica agudizada KDOQI estadio IV por nefrolitiasis posrenal bilateral no calcificada."
    ],
    "answerIndex": 1,
    "explanation": "El cuadro es el paradigma absoluto de 'Insuficiencia Renal Aguda PRERRENAL'. Hay una drástica hipoperfusión renal (pérdidas gastrointestinales combinada a deshidratación extremísima sin reponer, sumado al choque y la hipotensión). Como los túbulos intrarrenales están muy estresados pero aún perfectamente 'Sanos', estos reaccionan brillantemente maximizando su función vital a modo de salvavidas reteniendo y succionando cada partícula posible de Volumen, agua y Sodio del escaso filtrado para el intravascular. Esta reacción produce que el Sodio excretado sea minúsculo a la micción del FENa (menor de 1%), y se condense una brutal hiper-reabsorción de Urea de retorno disparando la relación NUS o BUN/Creatinina >20. No hay necrosis por faltar cilindros pardos/granulosos sedimentados.",
    "gpcReference": "GPC Prevención, Diagnóstico y Manejo de la Lesión Renal Aguda."
  },
  {
    "specialty": "mi",
    "tema": "Gastroenterología: Cirrosis y sus complicaciones",
    "case": "Varón de 50 años con enfermedad hepática en estadío avanzado documentada por etilismo de tres décadas. La familia llama a las emergencias al presenciarlo con múltiples crisis eméticas consistentes en franca Hematemesis masiva y coágulos rutilantes gruesos desde hace 60 min, produciendo compromiso y un episodio breve de síncope por baja perfusión. A la sala clínica: TA de 85/50, taquicárdico 120 pm. Estigmas hepáticos floridos generalizados con ascitis a tensión y nevos de araña aracniformes extensivos de pecho.",
    "question": "¿Cuál de las siguientes acciones y medidas preventivas farmacológicas (adicional al abordaje hemodinámico de reanimación y vía aérea forzosa por hipovolemia) dictaminan el abordaje internacional inicial para la probable etiología del sitio sangrante esofágico originado por su cirrosis?",
    "options": [
      "Instalación de Sonda Nasogástrica aspirativa y aplicación sistemática de procinéticos continuos solos.",
      "Cirugía derivativa esplenorenal de emergencia descompresiva al instante.",
      "Inicio vertiginoso en infusión endovenosa médica de Terlipresina u Octreotida, aunado a prevención profiláctica antibiótica (por ej. Ceftriaxona o Norfloxacino) previa incluso a colposcopia/endoscopia pautada a las 12 horas.",
      "Ajustar omeprazol e IBP masivos únicamente, ignorando endoscopia alta profiláctica al no documentarse una lesión."
    ],
    "answerIndex": 2,
    "explanation": "Un sangrado altísimo digestivo manifestado por hematemesis en un hombre con signos y estigmas contundentes de Hipertensión Portal (Cirrosis), debe obligatoriamente suponer e interpretarse como Rotura de Várices Esofágicas Aguda. Tras el imperativo ACLS y ABC (dos vías de gran calibre para líquidos y posibles concentrados de banco), el fármaco hemodinámico por excelencia a aplicar SIN VER a la vena es la Terlipresina (o en su defecto un potente inhibidor/análogo esplácnico vasoactivo Octreotide) con el fin imperioso del cierre de presión porto-vascular para detener sangrado masivo. De sumo interés coadyuvante en la GPC y medicina hepática es el uso precoz de un antibiótico intravenosos (cefalosporinas o quinolonas) a todos ya que protegen de muerte interviniente por translocación bacteriana que exacerba el sangrado en estos pacientes. Relegando la posterior escleroterapia/bandeo endoscópico que rematará curativamente en un lapso de 12 hs.",
    "gpcReference": "GPC Diagnóstico, manejo quirúrgico y tratamiento de soporte temporal en la Hemorragia por Várices Esofágicas."
  },
  {
    "specialty": "mi",
    "tema": "Reumatología: Artritis Reumatoide",
    "case": "Femenina de 43 años de edad se atiende quejando de un largo transcurso de 8 meses de molestias dolorosas muy incapacitantes localizados a los largo de ambas manos corporales. Reporta rigidez dolorosísima extendida habitualmente 2 o 3 horas diarias exactas durante las mañanas luego de despertar de cama y que cede de tarde al moverse en casa. A la exploración exhaustiva: gran inflamación franca 'en huso' muy sensible localizada firmemente a las interfalángicas proximales (IFP) combinando articulaciones metacarpofalángicas de las dos palmas por simetría de afectación confirmada. Factor Reumatoide fuertemente positivo (título muy en alza).",
    "question": "¿Qué fármaco, de los clasificados como FAME biológicos / no biológicos (Fármacos Modificadores de la Enfermedad), se indica desde la primera piedra por todo el mundo para constituir la plataforma 'Ancla' fundacional en tratar clínicamente a estos pacientes de forma sostenida al largo plazo intentando bloquear el progreso anatómico destruyente por el curso de esta afección general articular?",
    "options": [
      "Metotrexato (monoterapia oro inicial por excelencia y ancla de combinaciones de las líneas continuas).",
      "Cloroquina dosis-intensificada escalonada.",
      "Terapia crónica con anti-inflamatorios de corticoesteroides (Prednisona en pulsos máximos orales permanentes diarios sin fin).",
      "D-penicilamina reumatológica de primera instancia empírica y a largo espectro curativa."
    ],
    "answerIndex": 0,
    "explanation": "El caso modela la estricta poliartritis inflamatoria, crónica y en 'Espejo' (carácter simétrico confirmadísimo) característico de la Artritis Reumatoide autoinmine (AR) donde se ataca a las MCP e IFP respetando siempre y por regla a las IF distales. Si bien para un rescate rápido inflamatorio momentáneo sintomático sí empleamos puente con AINEs o glucocorticoides transitorios al mes inicial, el tratamiento REAL DE BASE de fondo que modifica a perpetuidad impidiendo deformidad ósea (El Ancla por antonomasia de la especialidad), el metotrexato en dosis bajas vía oral cada semana y asociando el oportuno reabastecimiento de ácido fólico (por su contraprestación de antagonista endémico) o sus alternativos leflunomidas / sulfasalazinas.",
    "gpcReference": "GPC Diagnóstico precoz y tratamiento farmacológico de la Artritis Reumatoide del adulto mayor integral en clínicas reumatológicas."
  },
  {
    "specialty": "mi",
    "tema": "Nefrología: Enfermedad Renal Crónica",
    "difficulty": "alta",
    "case": "Hombre de 58 años, diabético e hipertenso, inicia hace 90 minutos con dolor opresivo retroesternal irradiado a brazo izquierdo, acompañado de diaforesis y náusea. TA 140/90 mmHg, FC 96 lpm. ECG muestra elevación del ST en II, III y aVF. Hospital sin sala de hemodinamia; el centro con angioplastia más cercano está a 3 horas.",
    "question": "¿Cuál es el diagnóstico?",
    "options": [
      "Angina inestable",
      "IAM sin elevación del ST",
      "IAM con elevación del ST inferior",
      "Pericarditis aguda",
      "Disección aórtica"
    ],
    "answerIndex": 2,
    "explanation": "Elevación del ST en cara inferior (II, III, aVF) indica IAM inferior, usualmente por oclusión de coronaria derecha. Si la angioplastia no puede realizarse en menos de 120 minutos, la GPC de SCA con elevación del ST indica fibrinólisis inmediata. La angina inestable y el NSTEMI no presentan elevación persistente del ST. La pericarditis muestra elevación difusa, no regional.",
    "gpcReference": ""
  },
  {
    "specialty": "ped",
    "tema": "Nefrología: Enfermedad Renal Crónica",
    "difficulty": "alta",
    "case": "Niño de 7 años con antecedente de asma, presenta disnea progresiva tras infección viral. Habla en frases cortas, FR 38/min, tiraje intercostal, sibilancias audibles sin estetoscopio, SatO₂ 89%.",
    "question": "¿Cómo se clasifica la crisis?",
    "options": [
      "Leve",
      "Moderada",
      "Grave",
      "Paro respiratorio inminente",
      "Intermitente"
    ],
    "answerIndex": 2,
    "explanation": "SatO₂ <90%, uso de músculos accesorios y dificultad para hablar indican crisis grave según GPC de asma en pediatría. El tratamiento inicial es oxígeno y beta2 agonista de acción corta repetido. Los esteroides sistémicos deben añadirse tempranamente, pero nunca como monoterapia inicial. La teofilina ya no es de primera línea.",
    "gpcReference": ""
  },
  {
    "specialty": "cir",
    "tema": "Pancreatitis Aguda",
    "difficulty": "alta",
    "case": "Hombre de 45 años, etilista crónico, presenta dolor epigástrico intenso irradiado a espalda, vómito persistente. Lipasa 6 veces el límite superior. TA 100/60 mmHg, FC 112 lpm. BUN 32 mg/dL.",
    "question": "¿Cuál es el diagnóstico?",
    "options": [
      "Colecistitis",
      "Úlcera perforada",
      "Pancreatitis aguda",
      "Isquemia mesentérica",
      "Hepatitis alcohólica"
    ],
    "answerIndex": 2,
    "explanation": "El diagnóstico requiere dolor típico más elevación de lipasa ≥3 veces el límite superior. El aumento de BUN y la hipotensión indican mayor severidad según criterios pronósticos. El tratamiento inicial es hidratación agresiva con solución isotónica. Los antibióticos no están indicados de rutina y la CPRE solo si hay colangitis o coledocolitiasis.",
    "gpcReference": ""
  },
  {
    "specialty": "gyo",
    "tema": "Cáncer de endometrio",
    "case": "Paciente de 65 años, obesa y diabética, consulta por sangrado transvaginal postmenopáusico de 2 semanas de evolución. El ultrasonido transvaginal reporta un endometrio de 12 mm.",
    "question": "Principal factor de riesgo en esta paciente:",
    "options": [
      "Multiparidad",
      "Uso de anticonceptivos",
      "Hiperestrogenismo sin oposición",
      "Tabaquismo",
      "Infección por VPH"
    ],
    "answerIndex": 2,
    "explanation": "La obesidad favorece el hiperestrogenismo periférico (conversión de andrógenos a estrona), principal factor de riesgo para cáncer endometrial tipo I.",
    "difficulty": "media"
  },
  {
    "specialty": "mi",
    "tema": "Nefrología: Enfermedad Renal Crónica",
    "case": "Hombre de 72 años, DM2 y HAS, TFG 25 ml/min. Acude por astenia y palidez. Hb 9.2 g/dL, ferritina 150 ng/ml.",
    "question": "¿Cuál es el tratamiento inicial para este paciente?",
    "options": [
      "Hierro IV",
      "Transfusión",
      "Eritropoyetina",
      "Vitamina B12",
      "Diálisis"
    ],
    "answerIndex": 2,
    "explanation": "Se inicia tratamiento con agentes estimulantes de la eritropoyesis (eritropoyetina) cuando la Hb < 10 g/dL en pacientes con ERC.",
    "difficulty": "media"
  },
  {
    "specialty": "ped",
    "tema": "Patología Gastrointestinal",
    "case": "Lactante de 8 meses presenta llanto intenso, vómito y evacuación con moco y sangre ('jalea de grosella'). Masa palpable en cuadrante superior derecho. USG reporta imagen en 'diana'.",
    "question": "¿Cuál es el diagnóstico más probable?",
    "options": [
      "Apendicitis",
      "Gastroenteritis",
      "Invaginación intestinal",
      "Hernia incarcerada",
      "Malrotación"
    ],
    "answerIndex": 2,
    "explanation": "La tríada clásica de dolor abdominal paroxístico, masa en morcilla y evacuaciones en jalea de grosella es característica de la invaginación.",
    "difficulty": "media"
  },
  {
    "specialty": "cir",
    "tema": "Isquemia Mesentérica",
    "case": "Hombre de 72 años con FA presenta dolor abdominal súbito intenso 'desproporcionado' a la exploración física. Lactato elevado.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Pancreatitis",
      "Isquemia mesentérica aguda embólica",
      "Apendicitis",
      "Diverticulitis",
      "Oclusión intestinal"
    ],
    "answerIndex": 1,
    "explanation": "Ante dolor súbito desproporcionado en paciente con factores embólicos (FA), la isquemia mesentérica es la prioridad diagnóstica.",
    "difficulty": "alta"
  },
  {
    "specialty": "urg",
    "tema": "Manejo inicial del trauma (ATLS)",
    "case": "Masculino de 28 años tras accidente, TA 70/40 mmHg, FC 128 lpm, abdomen distendido y doloroso.",
    "question": "¿Cuál es la prioridad inmediata?",
    "options": [
      "Radiografía de fémur",
      "Intubación orotraqueal",
      "Reanimación hídrica y búsqueda de fuente de sangrado",
      "Lavado peritoneal",
      "Aplicar férula"
    ],
    "answerIndex": 2,
    "explanation": "Todo choque en trauma se considera hipovolémico. La prioridad es la reposición de volumen y el control de la hemorragia.",
    "difficulty": "alta"
  },
  {
    "specialty": "ped",
    "tema": "Estenosis Hipertrófica del Píloro",
    "case": "Lactante de 3 semanas con vómito gástrico en proyectil y masa olivácea en epigastrio.",
    "question": "¿Cuál es el trastorno hidroelectrolítico esperado?",
    "options": [
      "Acidosis metabólica",
      "Alcalosis metabólica hipoclorémica e hipopotasémica",
      "Acidosis láctica",
      "Alcalosis respiratoria",
      "Hiperpotasemia"
    ],
    "answerIndex": 1,
    "explanation": "La pérdida de contenido gástrico (HCl) genera una alcalosis metabólica con depleción de cloro y potasio.",
    "difficulty": "media"
  },
  {
    "specialty": "mi",
    "tema": "Depresión Mayor",
    "case": "Mujer de 54 años con tristeza, anhedonia, insomnio y pérdida de peso de 3 meses.",
    "question": "Tratamiento farmacológico de primera línea:",
    "options": [
      "Benzodiacepinas",
      "Inhibidores selectivos de la recaptura de serotonina (ISRS)",
      "Antipsicóticos",
      "Litio",
      "Estimulación magnética"
    ],
    "answerIndex": 1,
    "explanation": "Los ISRS son el manejo inicial de elección según la GPC por su perfil de seguridad y eficacia.",
    "difficulty": "media"
  },
  {
    "specialty": "gyo",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "difficulty": "muy-alta",
    "case": "Mujer de 30 años con amenorrea de 7 semanas, dolor pélvico unilateral y manchado transvaginal. β-hCG positiva. USG transvaginal sin saco gestacional intrauterino y masa anexial derecha.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Aborto incompleto",
      "Embarazo molar",
      "Embarazo ectópico",
      "Quiste ovárico",
      "Amenaza de aborto"
    ],
    "answerIndex": 2,
    "explanation": "Ausencia de saco intrauterino con β-hCG positiva y masa anexial sugiere embarazo ectópico. El manejo médico con metotrexato está indicado en pacientes hemodinámicamente estables, sin ruptura y con criterios específicos de tamaño y niveles hormonales. La inestabilidad requiere manejo quirúrgico.",
    "gpcReference": ""
  },
  {
    "specialty": "cir",
    "tema": "Apendicitis Aguda",
    "difficulty": "muy-alta",
    "case": "Hombre de 27 años con 36 horas de dolor abdominal que inició periumbilical y migró a fosa iliaca derecha. Presenta fiebre de 38.5°C, náusea y vómito. A la exploración: defensa localizada, signo de rebote positivo. Leucocitos 18,000 con neutrofilia. TAC muestra apéndice dilatado con colección periapendicular de 4 cm.",
    "question": "Diagnóstico:",
    "options": [
      "Apendicitis simple",
      "Apendicitis complicada con absceso",
      "Diverticulitis",
      "Adenitis mesentérica",
      "Íleo paralítico"
    ],
    "answerIndex": 1,
    "explanation": "En apendicitis complicada con absceso bien delimitado, las guías recomiendan manejo inicial conservador con antibióticos y drenaje percutáneo si es accesible. La cirugía inmediata aumenta riesgo de complicaciones. La apendicectomía diferida puede considerarse posteriormente.",
    "gpcReference": ""
  },
  {
    "specialty": "ped",
    "tema": "Nefrología: Enfermedad Renal Crónica",
    "case": "Niño de 5 años con edema generalizado palpebral. Proteinuria >50 mg/kg/día, hipoalbuminemia 2.1 g/dL, hipercolesterolemia 300 mg/dL.",
    "question": "Complicación trombótica más frecuente:",
    "options": [
      "Trombosis de la vena renal",
      "TEP",
      "EVC",
      "Infarto",
      "Trombosis mesentérica"
    ],
    "answerIndex": 0,
    "explanation": "El síndrome nefrótico presenta pérdida de antitrombina III y hemoconcentración, favoreciendo la trombosis, siendo la vena renal el sitio más afectado.",
    "difficulty": "alta"
  },
  {
    "specialty": "urg",
    "tema": "Choque séptico",
    "case": "Hombre de 66 años con fiebre, disuria y confusión. TA 82/50, FC 120, Lactato 4.8. EGO con piuria.",
    "question": "Diagnóstico:",
    "options": [
      "Sepsis sin choque",
      "Deshidratación",
      "Choque séptico",
      "Cetoacidosis",
      "Estado hiperosmolar"
    ],
    "answerIndex": 2,
    "explanation": "Hipotensión persistente que requiere vasopresores para mantener PAM >= 65 y lactato > 2 mmol/L a pesar de reanimación adecuada define el choque séptico.",
    "difficulty": "alta"
  },
  {
    "specialty": "mi",
    "tema": "Meningitis bacteriana aguda",
    "case": "Hombre de 19 años con fiebre, cefalea y rigidez de nuca. LCR: leucocitos 1,500 (90% PMN), glucosa 20, proteínas 250.",
    "question": "Diagnóstico sugerido por LCR:",
    "options": [
      "Meningitis bacteriana",
      "Viral",
      "TB",
      "HSA",
      "Encefalitis herpética"
    ],
    "answerIndex": 0,
    "explanation": "LCR con predominio de polimorfonucleares e hipoglucorraquia marcada es altamente sugerente de etiología bacteriana.",
    "difficulty": "media"
  },
  {
    "specialty": "mi",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "case": "Varón de 52 años con lesión pigmentada en espalda, asimetría, bordes irregulares, color heterogéneo y 8 mm.",
    "question": "Marcador histopronóstico más importante:",
    "options": [
      "Diámetro",
      "Índice de Breslow",
      "Vello",
      "Melanina",
      "Índice de Clark solo"
    ],
    "answerIndex": 1,
    "explanation": "El índice de Breslow mide la profundidad de la lesión en milímetros y es el factor pronóstico más potente para la supervivencia.",
    "difficulty": "media"
  },
  {
    "specialty": "mi",
    "tema": "Tormenta tiroidea",
    "case": "Mujer de 35 años con hipertiroidismo mal controlado presenta fiebre 40°C, taquicardia 150 lpm y agitación tras infección.",
    "question": "Manejo inicial correcto:",
    "options": [
      "Levotiroxina",
      "Metimazol + propranolol + esteroide",
      "Solo antibiótico",
      "Yodo inmediato",
      "Observación"
    ],
    "answerIndex": 1,
    "explanation": "Se debe bloquear la síntesis de hormonas, la conversión periférica y los efectos adrenérgicos.",
    "difficulty": "alta"
  },
  {
    "specialty": "cir",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "case": "Mujer de 68 años con antecedente de cirugías abdominales, presenta dolor tipo cólico, distensión y vómito fecaloide.",
    "question": "Conducta inicial en paciente estable:",
    "options": [
      "Cirugía inmediata",
      "Sonda nasogástrica + líquidos IV",
      "Solo analgésicos",
      "Colonoscopia",
      "Antibióticos"
    ],
    "answerIndex": 1,
    "explanation": "El manejo inicial de la obstrucción intestinal no complicada por adherencias es conservador con descompresión gástrica e hidratación.",
    "difficulty": "facil"
  },
  {
    "specialty": "cir",
    "tema": "Colecistitis aguda",
    "case": "Mujer de 45 años con dolor en hipocondrio derecho, fiebre y signo de Murphy positivo. USG reporta pared vesicular de 5mm.",
    "question": "¿Cuál es el estudio inicial de elección?",
    "options": [
      "Radiografía",
      "Gammagrafía HIDA",
      "Ultrasonido de hígado y vías biliares",
      "TAC abdominal",
      "CPRE"
    ],
    "answerIndex": 2,
    "explanation": "El ultrasonido es el estudio inicial de elección por su rapidez y alta sensibilidad para litiasis y colecistitis.",
    "difficulty": "facil"
  },
  {
    "specialty": "cir",
    "tema": "Pancreatitis Aguda",
    "case": "Mujer de 45 años con dolor abdominal en cinturón y vómito. TA 90/60. PCR 160 mg/L a las 48h.",
    "question": "Criterio que define gravedad:",
    "options": [
      "Lipasa elevada",
      "Edad",
      "Falla orgánica persistente (>48h)",
      "Dolor intenso",
      "Masculino"
    ],
    "answerIndex": 2,
    "explanation": "La pancreatitis grave se define por la persistencia de falla orgánica (Renal, Respiratoria o CV) por más de 48 horas.",
    "difficulty": "alta"
  },
  {
    "specialty": "mi",
    "tema": "Trastornos ácido-base",
    "case": "Hombre con alcoholismo crónico, vómito y confusión. Gasometría: pH 7.25, HCO3 12, PaCO2 25. Na 140, Cl 100.",
    "question": "Trorno principal:",
    "options": [
      "Acidosis hiperclorémica",
      "Acidosis metabólica con anión gap elevado",
      "Alcalosis respiratoria",
      "Acidosis respiratoria",
      "Alcalosis metabólica"
    ],
    "answerIndex": 1,
    "explanation": "El cálculo del anión gap (Na - (Cl + HCO3)) resulta en 28, lo que indica una acidosis metabólica de brecha aniónica elevada.",
    "difficulty": "media"
  },
  {
    "specialty": "gyo",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "difficulty": "alta",
    "case": "Mujer de 62 años, menopausia a los 50, obesa y diabética, consulta por sangrado transvaginal escaso indoloro. USG transvaginal muestra grosor endometrial de 16 mm.",
    "question": "Principal factor de riesgo en esta paciente:",
    "options": [
      "Multiparidad",
      "Uso de anticonceptivos",
      "Hiperestrogenismo sin oposición",
      "Tabaquismo",
      "Infección por VPH"
    ],
    "answerIndex": 2,
    "explanation": "Sangrado postmenopáusico con endometrio >4 mm obliga a biopsia endometrial según GPC de cáncer de endometrio. La obesidad y diabetes favorecen hiperestrogenismo periférico sin oposición, principal factor de riesgo. El Papanicolaou no diagnostica cáncer endometrial y los marcadores tumorales no son estudio inicial.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Nefrología: Enfermedad Renal Crónica",
    "difficulty": "alta",
    "case": "Hombre de 64 años con antecedente de diabetes mellitus tipo 2 e hipertensión de 20 años de evolución acude a consulta por fatiga progresiva y disminución de la tolerancia al ejercicio. TA 150/95 mmHg. Presenta palidez de tegumentos y edema leve en extremidades inferiores. Laboratorio: Hb 8.9 g/dL, VCM 88 fL, creatinina 3.2 mg/dL, TFG estimada 22 ml/min/1.73 m², ferritina normal, saturación de transferrina normal.",
    "question": "Pregunta. ¿Cuál es el manejo más adecuado de la anemia en este paciente?",
    "options": [
      "Transfusión inmediata",
      "Hierro intravenoso",
      "Eritropoyetina recombinante",
      "Ácido fólico",
      "Observación"
    ],
    "answerIndex": 2,
    "explanation": "Paciente con ERC estadio 4 (TFG <30) y anemia normocítica normocrómica con depósitos de hierro adecuados sugiere déficit de eritropoyetina. La GPC de Enfermedad Renal Crónica indica uso de agentes estimulantes de eritropoyesis cuando Hb <10 g/dL tras descartar deficiencia de hierro. No requiere transfusión salvo inestabilidad o Hb muy baja.",
    "gpcReference": ""
  },
  {
    "specialty": "ped",
    "tema": "Patología Gastrointestinal",
    "difficulty": "alta",
    "case": "Lactante de 8 meses previamente sano presenta episodios súbitos de llanto intenso con flexión de piernas sobre el abdomen, vómito y posteriormente evacuación con moco y sangre. A la exploración se palpa masa en cuadrante superior derecho. USG reporta imagen en “diana”.",
    "question": "¿Cuál es el diagnóstico más probable?",
    "options": [
      "Apendicitis",
      "Gastroenteritis",
      "Invaginación intestinal",
      "Hernia incarcerada",
      "Malrotación"
    ],
    "answerIndex": 2,
    "explanation": "La triada clásica (dolor cólico intermitente, masa palpable y evacuaciones en jalea de grosella) orienta a invaginación. Según GPC de abdomen agudo en pediatría, el tratamiento inicial en paciente estable es reducción con enema neumático o hidrostático. La cirugía se reserva para fracaso o perforación.",
    "gpcReference": ""
  },
  {
    "specialty": "gyo",
    "tema": "Nefrología: Enfermedad Renal Crónica",
    "difficulty": "alta",
    "case": "Mujer de 23 años con antecedente de pérdida de peso importante en los últimos 6 meses por dieta restrictiva y ejercicio excesivo. Refiere ausencia de menstruación desde hace 5 meses. β-hCG negativa. TSH y prolactina normales. FSH y LH bajas.",
    "question": "Pregunta. ¿Cuál es la causa más probable?",
    "options": [
      "Síndrome de ovario poliquístico",
      "Insuficiencia ovárica prematura",
      "Amenorrea hipotalámica funcional",
      "Hiperprolactinemia",
      "Síndrome de Asherman"
    ],
    "answerIndex": 2,
    "explanation": "La pérdida de peso, ejercicio excesivo y gonadotropinas bajas indican supresión hipotalámica funcional. La GPC de amenorrea secundaria señala que FSH/LH bajas con factores de estrés metabólico sugieren origen central. En insuficiencia ovárica la FSH estaría elevada.",
    "gpcReference": ""
  },
  {
    "specialty": "cir",
    "tema": "Isquemia Mesentérica",
    "difficulty": "muy-alta",
    "case": "Hombre de 72 años con fibrilación auricular sin anticoagulación presenta dolor abdominal súbito intenso “desproporcionado” a la exploración física. Abdomen blando, sin datos claros de irritación peritoneal. Lactato elevado.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Pancreatitis",
      "Isquemia mesentérica aguda embólica",
      "Apendicitis",
      "Diverticulitis",
      "Oclusión intestinal"
    ],
    "answerIndex": 1,
    "explanation": "Dolor intenso desproporcionado con antecedente de FA sugiere embolia mesentérica. La GPC de abdomen agudo recomienda AngioTAC como estudio diagnóstico inicial en paciente estable. La radiografía simple tiene baja sensibilidad. El retraso diagnóstico aumenta mortalidad.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Medicina Interna – Hipotiroidismo primario",
    "difficulty": "media",
    "case": "Mujer de 45 años con aumento de peso, intolerancia al frío, estreñimiento y piel seca. FC 54 lpm. Laboratorio: TSH 18 mUI/L, T4 libre baja.",
    "question": "Pregunta. Tratamiento inicial indicado:",
    "options": [
      "Metimazol",
      "Propiltiouracilo",
      "Levotiroxina",
      "Yodo radioactivo",
      "Propranolol"
    ],
    "answerIndex": 2,
    "explanation": "TSH elevada con T4 baja confirma hipotiroidismo primario. La GPC de patología tiroidea establece levotiroxina como tratamiento de elección ajustando dosis según edad y comorbilidades. Los antitiroideos se usan en hipertiroidismo, no en hipofunción.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "difficulty": "muy-alta",
    "case": "Mujer de 41 años, G4P4, inicio de vida sexual a los 16 años, múltiples parejas sexuales. Refiere que su última citología fue hace 6 años. Acude para chequeo. Se realiza prueba de VPH que resulta positiva para genotipo 16. Citología reporta NILM (negativa para lesión intraepitelial). No síntomas.",
    "question": "¿Cuál es la conducta más adecuada?",
    "options": [
      "Repetir citología en 3 años",
      "Repetir VPH en 5 años",
      "Colposcopía inmediata",
      "Conización diagnóstica",
      "Histerectomía"
    ],
    "answerIndex": 2,
    "explanation": "Según NOM-014 y GPC de cáncer cervicouterino, VPH 16 positivo requiere colposcopía aunque la citología sea negativa. NIC 2 es lesión de alto grado y debe tratarse con método excisional como LEEP. La observación se reserva para NIC 1 en casos seleccionados.",
    "gpcReference": ""
  },
  {
    "specialty": "ped",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "difficulty": "muy-alta",
    "case": "RN de 10 días con ictericia persistente, hepatoesplenomegalia y microcefalia. Presenta convulsiones. USG transfontanelar muestra calcificaciones intracraneales difusas. Madre refiere haber tenido contacto frecuente con gatos durante el embarazo.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Citomegalovirus",
      "Rubéola congénita",
      "Toxoplasmosis congénita",
      "Sífilis congénita",
      "Herpes neonatal"
    ],
    "answerIndex": 2,
    "explanation": "La triada clásica de toxoplasmosis congénita incluye calcificaciones intracraneales difusas, hidro/microcefalia y coriorretinitis. El tratamiento recomendado por GPC de infecciones congénitas es pirimetamina más sulfadiazina y ácido folínico para prevenir mielosupresión. CMV suele dar calcificaciones periventriculares, no difusas.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Infecciones de Vías Respiratorias Superiores",
    "difficulty": "alta",
    "case": "Niño de 8 años con antecedente de faringitis hace 3 semanas, presenta edema palpebral, hematuria macroscópica y oliguria. TA 135/85 mmHg. Laboratorio: creatinina ligeramente elevada, C3 disminuido.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Síndrome nefrótico",
      "Glomerulonefritis postestreptocócica",
      "Púrpura de Henoch-Schönlein",
      "Nefropatía por IgA",
      "LRA prerrenal"
    ],
    "answerIndex": 1,
    "explanation": "Hematuria, hipertensión y complemento bajo tras infección estreptocócica sugieren glomerulonefritis postestreptocócica. El manejo es de soporte con control de líquidos y presión arterial según GPC de glomerulopatías. Los esteroides no son de primera línea.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "ATLS P1 – Manejo inicial del trauma",
    "difficulty": "muy-alta",
    "case": "Hombre de 25 años sufre accidente automovilístico. Llega consciente pero agitado, con estridor audible y hematoma cervical expansivo. TA 100/60 mmHg, FC 120 lpm.",
    "question": "Pregunta. ¿Cuál es la prioridad inmediata?",
    "options": [
      "Tomografía cervical",
      "Intubación orotraqueal inmediata",
      "Radiografía de tórax",
      "Colocación de sonda vesical",
      "Analgesia IV"
    ],
    "answerIndex": 1,
    "explanation": "En el enfoque ATLS, la vía aérea es la primera prioridad. Estridor y hematoma cervical expansivo indican riesgo inminente de obstrucción. Debe asegurarse la vía aérea antes de estudios de imagen. El retraso puede resultar en paro respiratorio.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Reumatología – Vasculitis (Granulomatosis con poliangitis)",
    "difficulty": "muy-alta",
    "case": "Hombre de 48 años con sinusitis crónica, epistaxis recurrente, hemoptisis y hematuria. Creatinina elevada. ANCA positivo tipo c-ANCA.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Lupus eritematoso sistémico",
      "Poliarteritis nodosa",
      "Granulomatosis con poliangitis",
      "Síndrome de Goodpasture",
      "Artritis reumatoide"
    ],
    "answerIndex": 2,
    "explanation": "Afectación de vía aérea superior, pulmón y riñón con c-ANCA positivo es característico de granulomatosis con poliangitis. El manejo de inducción incluye corticoide sistémico más inmunosupresor potente como ciclofosfamida o rituximab según GPC de vasculitis. Sin tratamiento puede evolucionar rápidamente a falla renal.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Nefrología: Enfermedad Renal Crónica",
    "difficulty": "muy-alta",
    "case": "Mujer de 52 años con DM2 desde hace 6 años en tratamiento con metformina a dosis máxima tolerada. IMC 34 kg/m². HbA1c 9.2%. TFG 85 ml/min. Refiere antecedente de infarto hace 2 años. No hipoglucemias previas.",
    "question": "¿Cuál es el siguiente fármaco más indicado?",
    "options": [
      "Sulfonilurea",
      "Insulina NPH",
      "Inhibidor SGLT2",
      "Acarbosa",
      "Pioglitazona"
    ],
    "answerIndex": 2,
    "explanation": "En paciente con DM2 y enfermedad cardiovascular establecida, la GPC de tratamiento de diabetes recomienda añadir un inhibidor SGLT2 o agonista GLP-1 con beneficio cardiovascular demostrado. Los SGLT2 reducen eventos cardiovasculares y progresión de ERC. Las sulfonilureas no aportan beneficio CV y aumentan riesgo de hipoglucemia.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Choque Obstétrico y Hemorragia Obstétrica",
    "difficulty": "alta",
    "case": "Mujer de 24 años, G2P2, 30 minutos posterior a parto vaginal eutócico presenta sangrado abundante. TA 85/50 mmHg, FC 130 lpm. Útero aumentado de tamaño y flácido a la palpación. Placenta completa.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Retención placentaria",
      "Atonía uterina",
      "Desgarro cervical",
      "Inversión uterina",
      "Coagulopatía primaria"
    ],
    "answerIndex": 1,
    "explanation": "La causa más frecuente de hemorragia posparto es atonía uterina. El manejo inicial según GPC de hemorragia obstétrica incluye masaje uterino bimanual y administración de uterotónicos (oxitocina). Solo si no responde se escalan medidas quirúrgicas. La placenta ya fue expulsada, por lo que no es retención.",
    "gpcReference": ""
  },
  {
    "specialty": "ped",
    "tema": "Cardiopatías Congénitas",
    "difficulty": "alta",
    "case": "Lactante de 3 meses con diaforesis al alimentarse, pobre ganancia ponderal y taquipnea. A la auscultación presenta soplo holosistólico en borde esternal izquierdo inferior. Rx muestra cardiomegalia y aumento de flujo pulmonar.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Tetralogía de Fallot",
      "Comunicación interauricular",
      "Comunicación interventricular",
      "Persistencia del conducto arterioso",
      "Coartación aórtica"
    ],
    "answerIndex": 2,
    "explanation": "Soplo holosistólico en borde esternal izquierdo con datos de hiperflujo pulmonar es característico de CIV. Las comunicaciones grandes pueden evolucionar a hipertensión pulmonar y síndrome de Eisenmenger si no se corrigen. La tetralogía produce cianosis, lo cual no se describe en este caso.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Urología P2 – Hiperplasia prostática benigna",
    "difficulty": "alta",
    "case": "Hombre de 68 años con chorro urinario débil, nicturia y sensación de vaciamiento incompleto. Tacto rectal: próstata aumentada de tamaño, lisa y elástica. PSA 2.5 ng/ml. No hematuria.",
    "question": "Tratamiento inicial más adecuado:",
    "options": [
      "Prostatectomía radical",
      "Finasteride",
      "Alfa bloqueador (tamsulosina)",
      "Radioterapia",
      "Observación obligatoria"
    ],
    "answerIndex": 2,
    "explanation": "En síntomas moderados sin complicaciones, la GPC de HBP recomienda alfa bloqueadores como primera línea por su efecto rápido al relajar músculo liso prostático. Los inhibidores de 5-alfa reductasa reducen tamaño, pero su efecto es más lento y se indican en próstatas muy grandes. PSA normal y tacto no sospechoso descartan cáncer.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Neurología: Enfermedad Vascular Cerebral",
    "difficulty": "muy-alta",
    "case": "Mujer de 70 años con fibrilación auricular sin anticoagulación presenta hemiparesia izquierda súbita y desviación de mirada a la derecha. Inicio hace 2 horas. TA 150/90 mmHg. TAC simple sin hemorragia.",
    "question": "Conducta inmediata:",
    "options": [
      "Aspirina oral",
      "Trombolisis con alteplasa",
      "Heparina IV",
      "Observación 24 h",
      "Control estricto de TA <120 mmHg"
    ],
    "answerIndex": 1,
    "explanation": "Paciente en ventana terapéutica (<4.5 h) sin hemorragia en TAC es candidata a trombólisis según GPC de EVC isquémico. La fibrilación auricular es causa frecuente de embolia cardiogénica. No se debe bajar la TA agresivamente antes de trombólisis salvo cifras >185/110 mmHg.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Tuberculosis",
    "difficulty": "alta",
    "case": "Hombre de 39 años, pérdida de peso de 6 kg en 2 meses, tos productiva con hemoptisis ocasional y sudoración nocturna. Vive con 3 personas en casa pequeña. Rx de tórax muestra infiltrado apical derecho con cavitación. Baciloscopía seriada positiva.",
    "question": "¿Cuál es el esquema inicial indicado?",
    "options": [
      "Isoniazida y rifampicina por 6 meses",
      "Isoniazida, rifampicina, pirazinamida y etambutol fase intensiva",
      "Rifampicina sola",
      "Levofloxacino",
      "Observación"
    ],
    "answerIndex": 1,
    "explanation": "La GPC de tuberculosis pulmonar indica esquema acortado estrictamente supervisado con fase intensiva de 2 meses (HRZE) seguida de fase de sostén con HR hasta completar 6 meses en casos sensibles. Monoterapia está contraindicada por riesgo de resistencia.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Nefrología: Enfermedad Renal Crónica",
    "difficulty": "alta",
    "case": "Hombre de 32 años recién diagnosticado con VIH. CD4: 120 células/mm³. Carga viral elevada. No síntomas respiratorios. No tratamiento previo.",
    "question": "Pregunta. ¿Qué profilaxis debe iniciarse además de TAR?",
    "options": [
      "Isoniazida",
      "Trimetoprim-sulfametoxazol",
      "Azitromicina",
      "Fluconazol",
      "Ninguna"
    ],
    "answerIndex": 1,
    "explanation": "Con CD4 <200 células/mm³ debe iniciarse profilaxis para Pneumocystis jirovecii con trimetoprim-sulfametoxazol según GPC de VIH. La profilaxis para Mycobacterium avium se indica cuando CD4 <50. La isoniazida es para infección latente tuberculosa documentada.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Enfermedades transmitidas por Vector",
    "difficulty": "alta",
    "case": "Mujer de 25 años con fiebre de 4 días, mialgias intensas, cefalea retroocular y exantema. Vive en zona endémica. Laboratorio: plaquetas 95,000, hematocrito elevado respecto a basal. Dolor abdominal leve.",
    "question": "¿Qué dato indica probable progresión a dengue con signos de alarma?",
    "options": [
      "Exantema",
      "Fiebre",
      "Hemoconcentración",
      "Cefalea",
      "Mialgia"
    ],
    "answerIndex": 2,
    "explanation": "La hemoconcentración y trombocitopenia indican extravasación plasmática, signo de alarma según GPC de dengue. Debe vigilarse estrechamente y mantener hidratación adecuada. Los AINE están contraindicados por riesgo hemorrágico.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Zoonosis",
    "difficulty": "muy-alta",
    "case": "Hombre de 50 años sufre herida punzante con clavo oxidado. No recuerda última vacuna. A los días presenta trismus, rigidez muscular generalizada y espasmos dolorosos.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Botulismo",
      "Rabia",
      "Tétanos generalizado",
      "Meningitis",
      "Hipocalcemia"
    ],
    "answerIndex": 2,
    "explanation": "Rigidez y trismus tras herida contaminada sugieren tétanos. El manejo incluye inmunoglobulina antitetánica para neutralizar toxina libre, antibiótico (metronidazol) y soporte. La vacuna sola no trata la enfermedad activa.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Patología Respiratoria Neonatal",
    "difficulty": "alta",
    "case": "Mujer de 82 años hospitalizada por neumonía comienza con desorientación fluctuante, alteración del ciclo sueño-vigilia y pensamiento incoherente. No antecedentes de demencia.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Demencia tipo Alzheimer",
      "Depresión mayor",
      "Delirium",
      "Psicosis primaria",
      "Trastorno bipolar"
    ],
    "answerIndex": 2,
    "explanation": "Inicio agudo y curso fluctuante en contexto de enfermedad médica sugiere delirium. La GPC de síndromes geriátricos enfatiza identificar y corregir causa desencadenante (infección, fármacos, alteraciones metabólicas). Los antipsicóticos se reservan para agitación severa.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Psiquiatría – Trastorno depresivo mayor",
    "difficulty": "alta",
    "case": "Mujer de 29 años acude por 2 meses de ánimo deprimido la mayor parte del día, anhedonia, fatiga, hiporexia, insomnio de conciliación y sentimientos de inutilidad. Refiere dificultad para concentrarse en su trabajo. Niega consumo de sustancias. No antecedentes psiquiátricos. No ideación suicida activa.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Trastorno distímico",
      "Trastorno depresivo mayor",
      "Trastorno bipolar II",
      "Trastorno adaptativo",
      "Duelo complicado"
    ],
    "answerIndex": 1,
    "explanation": "Cinco o más síntomas por más de 2 semanas con deterioro funcional cumplen criterios de episodio depresivo mayor. Las GPC recomiendan ISRS como tratamiento farmacológico inicial en depresión moderada. Litio y valproato son para trastorno bipolar; benzodiacepinas no deben usarse como monoterapia.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "difficulty": "alta",
    "case": "Hombre de 61 años con lesión pigmentada en espalda que ha cambiado de tamaño y color en los últimos 6 meses. Bordes irregulares, diámetro 8 mm, asimétrica y con variación cromática. No dolor.",
    "question": "Criterio clínico que aumenta sospecha de malignidad:",
    "options": [
      "Simetría",
      "Diámetro <4 mm",
      "Evolución reciente",
      "Color uniforme",
      "Bordes regulares"
    ],
    "answerIndex": 2,
    "explanation": "Los criterios ABCDE incluyen asimetría, bordes irregulares, color variado, diámetro >6 mm y evolución. La GPC recomienda biopsia excisional completa con márgenes para diagnóstico histopatológico. Procedimientos destructivos impiden evaluación adecuada.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Hematología: Anemias Microcíticas",
    "difficulty": "alta",
    "case": "Mujer de 34 años con fatiga y palidez. Menstruaciones abundantes. Hb 9 g/dL, VCM 70 fL, ferritina baja, TIBC elevado.",
    "question": "Tipo de anemia:",
    "options": [
      "Normocítica",
      "Macrocítica",
      "Microcítica hipocrómica",
      "Hemolítica",
      "Aplásica"
    ],
    "answerIndex": 2,
    "explanation": "La anemia ferropénica se caracteriza por microcitosis, hipocromía y ferritina baja, que es el marcador más específico de reservas disminuidas. El tratamiento inicial es hierro oral salvo intolerancia o anemia severa sintomática. Transfusión no es primera línea en paciente estable.",
    "gpcReference": ""
  },
  {
    "specialty": "urg",
    "tema": "Urgencias – Cetoacidosis diabética",
    "difficulty": "muy-alta",
    "case": "Hombre de 22 años con DM1 que suspendió insulina. Presenta polidipsia, vómito y respiración profunda. Glucosa 420 mg/dL, pH 7.15, bicarbonato 10 mEq/L, cetonas positivas.",
    "question": "Diagnóstico:",
    "options": [
      "Estado hiperosmolar",
      "Cetoacidosis diabética",
      "Hipoglucemia",
      "Acidosis láctica aislada",
      "Insuficiencia renal"
    ],
    "answerIndex": 1,
    "explanation": "Hiperglucemia con acidosis metabólica y cetonemia define cetoacidosis diabética. El manejo inicial según GPC es reposición vigorosa de líquidos con solución salina antes de iniciar insulina IV. Bicarbonato solo en acidosis severa (<6.9).",
    "gpcReference": ""
  },
  {
    "specialty": "ped",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "difficulty": "alta",
    "case": "Niño de 8 años con antecedente de asma intermitente presenta disnea progresiva, sibilancias audibles, uso de músculos accesorios y saturación 91%. No cianosis. Puede hablar en frases cortas.",
    "question": "Clasificación de la crisis:",
    "options": [
      "Leve",
      "Moderada",
      "Grave",
      "Paro respiratorio",
      "Asma intermitente"
    ],
    "answerIndex": 1,
    "explanation": "SatO2 90-94%, uso de músculos accesorios y habla en frases cortas corresponde a crisis moderada. El manejo según GPC incluye beta2 agonista inhalado de acción corta y corticoide sistémico temprano. La aminofilina no es de primera línea.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Nefrología: Enfermedad Renal Crónica",
    "difficulty": "muy-alta",
    "case": "Hombre de 45 años con edema en miembros inferiores y párpados. Proteinuria 4.5 g/24h, albúmina 2.3 g/dL, colesterol elevado. Creatinina normal.",
    "question": "Diagnóstico sindromático:",
    "options": [
      "Síndrome nefrítico",
      "Síndrome nefrótico",
      "Insuficiencia renal aguda",
      "Glomerulonefritis rápidamente progresiva",
      "Pielonefritis"
    ],
    "answerIndex": 1,
    "explanation": "Proteinuria >3.5 g/día, hipoalbuminemia e hiperlipidemia definen síndrome nefrótico. Existe estado de hipercoagulabilidad con riesgo de trombosis venosa profunda. IECA/ARA II reducen proteinuria y protegen función renal. No se indica restricción proteica extrema.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Cardiología – Síndrome coronario agudo con elevación del ST",
    "difficulty": "alta",
    "case": "Hombre de 58 años con dolor opresivo retroesternal de 1 hora de evolución irradiado a brazo izquierdo. ECG: elevación del ST en DII, DIII y aVF. TA 100/70 mmHg.",
    "question": "Diagnóstico:",
    "options": [
      "Angina inestable",
      "IAM sin elevación ST",
      "IAM con elevación ST inferior",
      "Pericarditis",
      "Disección aórtica"
    ],
    "answerIndex": 2,
    "explanation": "Elevación del ST en derivaciones inferiores indica IAMCEST inferior. Si existe disponibilidad, la angioplastia primaria es tratamiento de elección según GPC, idealmente dentro de los primeros 90 minutos. La fibrinólisis se reserva cuando no hay acceso oportuno a hemodinamia.",
    "gpcReference": ""
  },
  {
    "specialty": "gyo",
    "tema": "Obstetricia – Preeclampsia con criterios de severidad",
    "difficulty": "muy-alta",
    "case": "Primigesta de 34 semanas con cefalea intensa, fosfenos y edema. TA 170/110 mmHg en dos mediciones. Proteinuria 3+. Plaquetas 95,000.",
    "question": "Diagnóstico:",
    "options": [
      "Hipertensión gestacional",
      "Preeclampsia leve",
      "Preeclampsia con criterios de severidad",
      "Eclampsia",
      "HELLP aislado"
    ],
    "answerIndex": 2,
    "explanation": "TA ≥160/110, trombocitopenia y síntomas neurológicos son criterios de severidad. El manejo incluye sulfato de magnesio para prevención de convulsiones y control de TA, seguido de interrupción del embarazo tras estabilización materna, independientemente de edad gestacional ≥34 semanas.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Medicina Crítica – Choque séptico",
    "difficulty": "muy-alta",
    "case": "Hombre de 66 años con DM2 e hipertensión acude por fiebre, disuria y deterioro del estado de alerta. TA 82/50 mmHg, FC 120 lpm, FR 28 rpm, Temp 39°C. Lactato 4.8 mmol/L. Leucocitosis con neutrofilia. EGO con piuria abundante.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Sepsis",
      "Choque hipovolémico",
      "Choque séptico",
      "Choque cardiogénico",
      "SIRS sin infección"
    ],
    "answerIndex": 2,
    "explanation": "Hipotensión persistente con lactato elevado en contexto infeccioso define choque séptico. El manejo inicial según guías incluye reposición con cristaloides 30 ml/kg en la primera hora. Si persiste hipotensión, el vasopresor de elección es noradrenalina. Los vasopresores nunca sustituyen la reanimación con líquidos.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Pancreatitis Aguda",
    "difficulty": "muy-alta",
    "case": "Hombre de 48 años con dolor epigástrico intenso irradiado a espalda posterior a ingesta alcohólica. Lipasa 5 veces el límite superior. A las 48 horas presenta hipotensión, creatinina elevada y PaO2 55 mmHg.",
    "question": "Criterio que define gravedad:",
    "options": [
      "Dolor intenso",
      "Lipasa elevada",
      "Falla orgánica persistente",
      "Náusea",
      "Leucocitosis"
    ],
    "answerIndex": 2,
    "explanation": "La pancreatitis grave se define por falla orgánica persistente (>48 h). La TAC contrastada se recomienda tras 72 horas para evaluar necrosis o complicaciones locales. La elevación de lipasa no determina gravedad.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "difficulty": "alta",
    "case": "Mujer de 19 años con fiebre, cefalea intensa y rigidez de nuca. Presenta fotofobia y vómito. TA estable. No focalización neurológica.",
    "question": "Conducta inmediata:",
    "options": [
      "Esperar TAC",
      "Punción lumbar inmediata",
      "Solo antibiótico oral",
      "Observación",
      "EEG"
    ],
    "answerIndex": 1,
    "explanation": "En ausencia de datos de hipertensión intracraneal o focalización, se realiza punción lumbar inmediata. El tratamiento empírico en adultos jóvenes incluye ceftriaxona más vancomicina para cubrir neumococo resistente y meningococo, según guías nacionales.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Nefrología: Enfermedad Renal Crónica",
    "difficulty": "muy-alta",
    "case": "Paciente masculino con antecedente de alcoholismo crónico acude con vómito y confusión. Gasometría: pH 7.25, HCO₃ 12 mEq/L, PaCO₂ 25 mmHg. Na 140, Cl 100.",
    "question": "Trastorno principal:",
    "options": [
      "Alcalosis metabólica",
      "Acidosis metabólica con anión gap elevado",
      "Acidosis respiratoria",
      "Alcalosis respiratoria",
      "Mixto metabólico-respiratorio alcalino"
    ],
    "answerIndex": 1,
    "explanation": "Anión gap = 140 – (100 + 12) = 28, elevado. Con antecedente de alcoholismo y vómito, la causa probable es cetoacidosis alcohólica. La compensación respiratoria es adecuada según fórmula de Winter. La diarrea produce acidosis hiperclorémica con gap normal.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Endocrinología – Tormenta tiroidea",
    "difficulty": "muy-alta",
    "case": "Mujer de 35 años con antecedente de hipertiroidismo mal controlado presenta fiebre 40°C, taquicardia 150 lpm, agitación y vómito posterior a infección respiratoria.",
    "question": "Diagnóstico:",
    "options": [
      "Crisis de ansiedad",
      "Tormenta tiroidea",
      "Feocromocitoma",
      "Sepsis aislada",
      "Meningitis"
    ],
    "answerIndex": 1,
    "explanation": "Fiebre alta, taquicardia extrema y alteración neurológica en paciente hipertiroidea sugieren tormenta tiroidea. El manejo incluye betabloqueador, antitiroideo (metimazol o PTU), esteroide y posteriormente yodo. El yodo nunca se administra antes del antitiroideo.",
    "gpcReference": ""
  },
  {
    "specialty": "cir",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "difficulty": "muy-alta",
    "case": "Hombre de 72 años con antecedente de laparotomía por úlcera perforada hace 10 años. Acude por dolor abdominal tipo cólico, distensión progresiva, vómito fecaloide y ausencia de evacuaciones y gases desde hace 24 horas. TA 110/70 mmHg, FC 105 lpm. Abdomen distendido, timpanismo generalizado, ruidos aumentados en tono metálico. Rx muestra niveles hidroaéreos múltiples y dilatación de asas de intestino delgado.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Íleo paralítico",
      "Obstrucción intestinal por adherencias",
      "Vólvulo sigmoideo",
      "Colitis isquémica",
      "Pancreatitis aguda"
    ],
    "answerIndex": 1,
    "explanation": "Antecedente quirúrgico sugiere adherencias como causa más frecuente. En ausencia de datos de estrangulación, el manejo inicial es conservador con descompresión y reposición hídrica. Dolor continuo, fiebre o leucocitosis progresiva sugieren isquemia y requieren cirugía urgente.",
    "gpcReference": ""
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragia Uterina Anormal",
    "difficulty": "alta",
    "case": "Mujer de 48 años con sangrado uterino abundante e irregular desde hace 6 meses. IMC 33 kg/m², nuligesta. USG transvaginal: endometrio de 16 mm. Hb 10 g/dL.",
    "question": "Factor de riesgo principal para patología endometrial maligna:",
    "options": [
      "Edad <40",
      "Obesidad",
      "Multiparidad",
      "Uso de AINE",
      "Ejercicio"
    ],
    "answerIndex": 1,
    "explanation": "Obesidad genera hiperestrogenismo por aromatización periférica, aumentando riesgo de hiperplasia y cáncer endometrial. En mujeres >45 años con sangrado anormal está indicada biopsia endometrial para descartar malignidad según guías.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Cardiología – Insuficiencia cardiaca con fracción de eyección reducida",
    "difficulty": "muy-alta",
    "case": "Hombre de 64 años con antecedente de IAM previo, disnea de pequeños esfuerzos y ortopnea. Ecocardiograma con FEVI 30%. TA 130/80 mmHg, creatinina normal.",
    "question": "Grupo farmacológico que reduce mortalidad:",
    "options": [
      "Diuréticos aislados",
      "IECA o ARA II",
      "Digoxina sola",
      "Nitratos",
      "Calcioantagonistas no dihidropiridínicos"
    ],
    "answerIndex": 1,
    "explanation": "En IC con FE reducida, IECA/ARA II, betabloqueadores y antagonistas de aldosterona reducen mortalidad. Los calcioantagonistas no dihidropiridínicos como verapamilo pueden deprimir la contractilidad y no están indicados en FE reducida.",
    "gpcReference": ""
  },
  {
    "specialty": "ped",
    "tema": "Patología Neonatal Infecciosa",
    "difficulty": "alta",
    "case": "Recién nacido de 38 semanas, madre con ruptura prolongada de membranas 22 horas y fiebre intraparto. A las 12 horas de vida presenta dificultad respiratoria, letargia y mala perfusión.",
    "question": "Factor de riesgo más importante en este caso:",
    "options": [
      "Cesárea",
      "Ruptura prolongada de membranas",
      "Edad materna",
      "Sexo masculino",
      "Peso adecuado"
    ],
    "answerIndex": 1,
    "explanation": "Ruptura prolongada de membranas y fiebre materna son factores clave para sepsis neonatal temprana. El esquema empírico recomendado es ampicilina más aminoglucósido para cubrir estreptococo del grupo B y gramnegativos.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Hemorragias del Primer Trimestre",
    "difficulty": "muy-alta",
    "case": "Mujer de 70 años con antecedente de uso reciente de diurético tiazídico presenta somnolencia y náusea. Na sérico 118 mEq/L. Osmolaridad plasmática baja.",
    "question": "Tipo de hiponatremia:",
    "options": [
      "Hipertónica",
      "Isotónica",
      "Hipotónica",
      "Pseudohiponatremia",
      "Secundaria a hiperglucemia"
    ],
    "answerIndex": 2,
    "explanation": "Sodio <120 con síntomas neurológicos requiere corrección cuidadosa con solución hipertónica al 3% para evitar edema cerebral. La corrección no debe exceder límites seguros para prevenir mielinolisis pontina. Las tiazidas son causa frecuente de hiponatremia en adultos mayores.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "difficulty": "muy-alta",
    "case": "Mujer de 42 años, usuaria de anticonceptivos orales, consulta por disnea súbita y dolor torácico pleurítico. FC 118 lpm, TA 110/70 mmHg, SatO₂ 89%. Dímero D elevado. Angiotomografía muestra defecto de llenado en arteria pulmonar segmentaria derecha.",
    "question": "Diagnóstico:",
    "options": [
      "Neumonía",
      "Infarto agudo de miocardio",
      "Tromboembolia pulmonar",
      "Derrame pleural",
      "Pericarditis"
    ],
    "answerIndex": 2,
    "explanation": "En TEP estable el manejo inicial es anticoagulación. La trombólisis se reserva para TEP de alto riesgo con inestabilidad hemodinámica (hipotensión sostenida o choque). El dímero D no define gravedad.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Gastroenterología – Hemorragia digestiva alta",
    "difficulty": "alta",
    "case": "Hombre de 55 años con antecedente de cirrosis alcohólica presenta hematemesis abundante y melena. TA 90/60 mmHg, FC 120 lpm.",
    "question": "Causa más probable:",
    "options": [
      "Úlcera gástrica",
      "Varices esofágicas",
      "Mallory-Weiss",
      "Gastritis erosiva",
      "Cáncer gástrico"
    ],
    "answerIndex": 1,
    "explanation": "En paciente cirrótico con hematemesis masiva se debe sospechar sangrado variceal. El manejo incluye reanimación, octreótido IV y antibiótico profiláctico, seguido de endoscopia urgente. Los IBP solos no son suficientes en sospecha variceal.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Nefrología: Enfermedad Renal Crónica",
    "difficulty": "muy-alta",
    "case": "Mujer de 38 años con obesidad central, cara redondeada, equimosis fácil y debilidad proximal. TA 150/95 mmHg. Cortisol libre urinario elevado.",
    "question": "Estudio inicial para confirmar hipercortisolismo:",
    "options": [
      "Cortisol sérico matutino",
      "Cortisol libre urinario 24 h",
      "ACTH basal",
      "TSH",
      "TAC abdominal"
    ],
    "answerIndex": 1,
    "explanation": "El diagnóstico inicial de hipercortisolismo se realiza con cortisol libre urinario de 24 horas o prueba de supresión con dexametasona. ACTH baja orienta a origen suprarrenal autónomo; ACTH elevada sugiere causa hipofisaria o ectópica.",
    "gpcReference": ""
  },
  {
    "specialty": "gyo",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "difficulty": "alta",
    "case": "Gestante de 32 semanas con contracciones regulares cada 5 minutos y dilatación cervical de 3 cm. Membranas íntegras. Sin datos de infección.",
    "question": "Diagnóstico:",
    "options": [
      "Amenaza de aborto",
      "Trabajo de parto pretérmino",
      "Ruptura prematura de membranas",
      "Falso trabajo de parto",
      "Placenta previa"
    ],
    "answerIndex": 1,
    "explanation": "Contracciones regulares con cambios cervicales antes de 37 semanas definen trabajo de parto pretérmino. El manejo incluye tocolíticos para retrasar parto y permitir administración de corticoides antenatales para maduración pulmonar fetal.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "difficulty": "muy-alta",
    "case": "Mujer de 50 años con cefalea súbita “en trueno”, la peor de su vida, acompañada de vómito y rigidez de nuca. TAC muestra sangre en espacio subaracnoideo.",
    "question": "Causa más frecuente:",
    "options": [
      "Trauma",
      "Aneurisma sacular roto",
      "MAV",
      "Trombosis venosa",
      "Tumor cerebral"
    ],
    "answerIndex": 1,
    "explanation": "La causa más frecuente de hemorragia subaracnoidea no traumática es ruptura de aneurisma sacular. El nimodipino reduce riesgo de vasoespasmo cerebral y mejora pronóstico neurológico según guías internacionales y nacionales.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Hemorragias del Primer Trimestre",
    "difficulty": "muy-alta",
    "case": "Hombre de 68 años con DM2 mal controlada es traído por confusión progresiva. Refiere poliuria y polidipsia desde hace una semana. TA 95/60 mmHg, FC 110 lpm. Glucosa 780 mg/dL, pH 7.38, bicarbonato 22 mEq/L, cetonas negativas, osmolaridad plasmática elevada.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Cetoacidosis diabética",
      "Estado hiperosmolar hiperglucémico",
      "Hipoglucemia severa",
      "Acidosis láctica",
      "Síndrome urémico"
    ],
    "answerIndex": 1,
    "explanation": "Glucosa >600 mg/dL, osmolaridad elevada y ausencia de acidosis significativa definen estado hiperosmolar. El tratamiento inicial es reposición vigorosa de líquidos antes de iniciar insulina. La acidosis y cetonemia marcan la diferencia con cetoacidosis.",
    "gpcReference": ""
  },
  {
    "specialty": "cir",
    "tema": "Cirugía – Colecistitis aguda",
    "difficulty": "alta",
    "case": "Mujer de 44 años con dolor en hipocondrio derecho de 24 horas, fiebre y náusea. Signo de Murphy positivo. USG: vesícula con pared engrosada y lito impactado en cuello vesicular.",
    "question": "Diagnóstico:",
    "options": [
      "Colelitiasis asintomática",
      "Colecistitis aguda calculosa",
      "Colangitis",
      "Hepatitis viral",
      "Pancreatitis"
    ],
    "answerIndex": 1,
    "explanation": "Dolor en hipocondrio derecho, Murphy positivo y hallazgos ecográficos confirman colecistitis aguda. La conducta recomendada es colecistectomía laparoscópica temprana durante el mismo internamiento. El manejo conservador aislado aumenta recurrencias.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "difficulty": "alta",
    "case": "Mujer de 26 años con petequias y equimosis espontáneas. Plaquetas 18,000/mm³. Hb y leucocitos normales. No esplenomegalia.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Leucemia aguda",
      "Púrpura trombocitopénica inmune",
      "CID",
      "Aplasia medular",
      "Dengue"
    ],
    "answerIndex": 1,
    "explanation": "Trombocitopenia aislada con resto de biometría normal sugiere PTI. El tratamiento inicial en casos con plaquetas <30,000 o sangrado es corticoesteroide. La esplenectomía se reserva para casos refractarios.",
    "gpcReference": ""
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del Tercer Trimestre",
    "difficulty": "muy-alta",
    "case": "Gestante de 36 semanas con dolor abdominal súbito, útero hipertónico y sangrado vaginal oscuro. FCF con desaceleraciones tardías.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Placenta previa",
      "Ruptura uterina",
      "Desprendimiento prematuro de placenta",
      "Trabajo de parto normal",
      "Vasa previa"
    ],
    "answerIndex": 2,
    "explanation": "Dolor intenso, sangrado oscuro y útero hipertónico caracterizan DPPNI. A diferencia de placenta previa (sangrado rojo brillante e indoloro). Si existe compromiso fetal, se indica interrupción inmediata del embarazo.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Infectología – Endocarditis infecciosa",
    "difficulty": "muy-alta",
    "case": "Hombre de 60 años con antecedente de valvulopatía presenta fiebre persistente, pérdida de peso y soplo nuevo. Hemocultivos positivos para Streptococcus viridans.",
    "question": "Criterio mayor de Duke presente:",
    "options": [
      "Fiebre",
      "Soplo",
      "Hemocultivos positivos típicos",
      "Anemia",
      "Petequias"
    ],
    "answerIndex": 2,
    "explanation": "Hemocultivos positivos para microorganismo típico constituyen criterio mayor de Duke. El ecocardiograma transesofágico tiene mayor sensibilidad para detectar vegetaciones, especialmente en válvulas nativas o prótesis.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Trastornos ácido–base mixtos",
    "difficulty": "muy-alta",
    "case": "Hombre de 30 años con antecedente de DM1 acude por vómito intenso y respiración profunda. Gasometría: pH 7.48, HCO₃ 18 mEq/L, PaCO₂ 25 mmHg. Na 138, Cl 100.",
    "question": "Trastorno primario:",
    "options": [
      "Alcalosis metabólica",
      "Alcalosis respiratoria",
      "Acidosis metabólica con alcalosis respiratoria concomitante",
      "Acidosis respiratoria",
      "Normal"
    ],
    "answerIndex": 2,
    "explanation": "Hay alcalemia (pH 7.48) con HCO₃ bajo y PaCO₂ bajo. El anión gap es 138- (100+18)=20 (elevado), lo que indica acidosis metabólica. El pH alcalino sugiere alcalosis respiratoria concomitante, no simple compensación. Esto es típico en cetoacidosis con hiperventilación marcada.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "difficulty": "alta",
    "case": "Mujer de 75 años con diarrea abundante por 4 días. TA 85/55 mmHg. Creatinina aumenta de 0.9 a 2.1 mg/dL. EGO sin cilindros patológicos. FeNa 0.5%.",
    "question": "Tipo de lesión renal:",
    "options": [
      "Intrínseca",
      "Posrenal",
      "Prerrenal",
      "Necrosis tubular establecida",
      "Glomerulonefritis"
    ],
    "answerIndex": 2,
    "explanation": "Hipovolemia con FeNa <1% indica riñón funcionalmente intacto con retención de sodio, compatible con lesión prerrenal. La necrosis tubular aguda típicamente presenta FeNa >2% y cilindros granulosos.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Nefrología: Enfermedad Renal Crónica",
    "difficulty": "muy-alta",
    "case": "Hombre de 62 años con ERC estadio 4 acude por debilidad muscular. K sérico 6.8 mEq/L. ECG con ondas T picudas y QRS ligeramente ensanchado.",
    "question": "Medida inmediata para estabilizar membrana miocárdica:",
    "options": [
      "Insulina con glucosa",
      "Salbutamol",
      "Gluconato de calcio IV",
      "Furosemida",
      "Resina de intercambio"
    ],
    "answerIndex": 2,
    "explanation": "En hiperpotasemia con cambios ECG se administra primero gluconato de calcio para estabilizar membrana. Posteriormente se emplean medidas que desplazan potasio al interior celular como insulina con glucosa. La hemodiálisis elimina potasio pero no es la primera medida inmediata salvo refractariedad.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Nefrología: Enfermedad Renal Crónica",
    "difficulty": "alta",
    "case": "Mujer de 55 años con litiasis renal recurrente y estreñimiento. Calcio 11.8 mg/dL, PTH elevada.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Hipercalcemia por malignidad",
      "Hiperparatiroidismo primario",
      "Intoxicación por vitamina D",
      "Sarcoidosis",
      "Mieloma múltiple"
    ],
    "answerIndex": 1,
    "explanation": "Hipercalcemia con PTH elevada es compatible con hiperparatiroidismo primario. El tratamiento definitivo en pacientes sintomáticos es quirúrgico. En hipercalcemia por malignidad la PTH estaría suprimida.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Infecciones de Vías Respiratorias Superiores",
    "difficulty": "muy-alta",
    "case": "Hombre de 18 años con antecedente de faringitis hace 2 semanas presenta edema facial, hematuria y TA 150/95 mmHg. Creatinina ligeramente elevada.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Síndrome nefrótico",
      "Glomerulonefritis postestreptocócica",
      "Nefropatía diabética",
      "Pielonefritis",
      "Litiasis renal"
    ],
    "answerIndex": 1,
    "explanation": "Hematuria, hipertensión y edema tras infección estreptocócica sugieren glomerulonefritis postestreptocócica, caracterizada por consumo de complemento (C3 bajo). El tratamiento es principalmente de soporte, control de presión y volumen.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "difficulty": "muy-alta",
    "case": "Hombre de 54 años, antecedente de DM2 e hipertensión, ingresa por neumonía adquirida en la comunidad confirmada por infiltrado lobar derecho y leucocitosis. A las 48 horas presenta deterioro respiratorio progresivo con disnea intensa, taquipnea de 34 rpm y saturación 82% con mascarilla reservorio a 15 L/min. Se decide intubación orotraqueal. Gasometría con FiO₂ 100% muestra PaO₂ 60 mmHg. Rx de tórax con infiltrados bilaterales difusos no explicados por falla cardiaca. Ecocardiograma sin datos de disfunción ventricular significativa.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Edema agudo cardiogénico",
      "Tromboembolia pulmonar",
      "Síndrome de dificultad respiratoria aguda",
      "Crisis asmática",
      "Neumotórax bilateral"
    ],
    "answerIndex": 2,
    "explanation": "SDRA se define por inicio agudo, infiltrados bilaterales y PaO₂/FiO₂ disminuida sin causa cardiogénica. Con PaO₂ 60 y FiO₂ 1.0, la relación es 60, compatible con SDRA grave. El manejo incluye ventilación protectora con volúmenes bajos (6 ml/kg peso ideal) para reducir lesión pulmonar inducida por ventilador.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Pancreatitis Aguda",
    "difficulty": "muy-alta",
    "case": "Mujer de 47 años con antecedente de colelitiasis presenta dolor epigástrico intenso irradiado a espalda, náusea y vómito. Lipasa 6 veces el límite normal. A las 24 horas desarrolla hipotensión leve, oliguria y creatinina en ascenso. Hematocrito elevado y BUN aumentado. USG muestra litos vesiculares sin dilatación de vía biliar.",
    "question": "Etiología más probable:",
    "options": [
      "Alcohol",
      "Biliar",
      "Hipertrigliceridemia",
      "Fármaco",
      "Idiopática"
    ],
    "answerIndex": 1,
    "explanation": "La etiología biliar es la causa más frecuente. Elevación de BUN y hemoconcentración se asocian a mayor mortalidad. En pancreatitis biliar leve a moderada, la colecistectomía debe realizarse durante el mismo internamiento tras estabilización para evitar recurrencia.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Neurología – Evento vascular cerebral isquémico y ventana terapéutica",
    "difficulty": "muy-alta",
    "case": "extendida Hombre de 63 años con antecedente de fibrilación auricular sin anticoagulación es encontrado con hemiplejia derecha y afasia. Última vez visto sano hace 7 horas. TAC simple sin hemorragia. Angiotomografía muestra oclusión de arteria cerebral media izquierda proximal con tejido de penumbra viable en estudio de perfusión.",
    "question": "¿Es candidato a trombólisis IV estándar?",
    "options": [
      "Sí",
      "No",
      "Solo si presión baja",
      "Solo si glucosa normal",
      "Sí sin importar tiempo"
    ],
    "answerIndex": 1,
    "explanation": "La trombólisis IV estándar tiene ventana hasta 4.5 horas. Sin embargo, en presencia de oclusión de gran vaso y penumbra viable, la trombectomía mecánica puede realizarse hasta 24 horas según criterios de imagen. Fibrilación auricular sugiere embolia cardiogénica.",
    "gpcReference": ""
  },
  {
    "specialty": "gyo",
    "tema": "Obstetricia – Corioamnionitis",
    "difficulty": "muy-alta",
    "case": "Gestante de 30 semanas con ruptura prematura de membranas desde hace 24 horas presenta fiebre 38.8°C, taquicardia materna y fetal, útero doloroso a la palpación y líquido amniótico fétido.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Trabajo de parto pretérmino simple",
      "Corioamnionitis",
      "Placenta previa",
      "DPPNI",
      "ITU aislada"
    ],
    "answerIndex": 1,
    "explanation": "Fiebre, taquicardia fetal y líquido fétido sugieren infección intraamniótica. El manejo incluye antibiótico IV inmediato y resolución del embarazo, ya que la infección contraindica prolongar gestación incluso en pretérmino.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "difficulty": "muy-alta",
    "case": "Hombre de 62 años con antecedente de hipertensión y tabaquismo acude por dolor torácico opresivo de 3 horas de evolución. ECG con elevación del ST en V1–V4. Se realiza angioplastia primaria con reperfusión exitosa. A las 6 horas evoluciona con hipotensión (TA 78/50 mmHg), piel fría, oliguria y estertores bibasales. FC 120 lpm. Lactato elevado. Ecocardiograma muestra FEVI 25% con hipocinesia anterior extensa.",
    "question": "Diagnóstico actual:",
    "options": [
      "Choque séptico",
      "Choque hipovolémico",
      "Choque cardiogénico",
      "Taponamiento cardiaco",
      "Reinfarto inmediato"
    ],
    "answerIndex": 2,
    "explanation": "Hipotensión con bajo gasto posterior a IAM y FEVI severamente reducida define choque cardiogénico. El manejo incluye vasopresor (noradrenalina) para mantener perfusión e inotrópico como dobutamina para mejorar contractilidad. Si persiste inestabilidad, puede considerarse soporte mecánico como balón intraaórtico.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Gastroenterología – Colangitis aguda",
    "difficulty": "muy-alta",
    "case": "Mujer de 58 años con antecedente de colelitiasis acude por dolor en hipocondrio derecho, fiebre y ictericia progresiva. TA 95/60 mmHg, FC 115 lpm. Laboratorio con bilirrubina directa elevada y fosfatasa alcalina aumentada. USG con dilatación de vía biliar.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Hepatitis viral",
      "Colecistitis",
      "Colangitis aguda",
      "Pancreatitis",
      "Absceso hepático"
    ],
    "answerIndex": 2,
    "explanation": "Dolor en hipocondrio derecho, fiebre e ictericia conforman la tríada de Charcot. La colangitis es una urgencia que requiere antibiótico IV y descompresión biliar urgente mediante CPRE. El retraso aumenta mortalidad.",
    "gpcReference": ""
  },
  {
    "specialty": "mi",
    "tema": "Neurología – Estado epiléptico convulsivo",
    "difficulty": "media",
    "case": "Hombre de 28 años sin antecedentes conocidos presenta crisis tónico-clónica generalizada que dura más de 7 minutos sin recuperación de conciencia. En urgencias continúa convulsionando.",
    "question": "Diagnóstico:",
    "options": [
      "Crisis aislada",
      "Estado epiléptico",
      "Síncope convulsivo",
      "Trastorno psicógeno",
      "Migraña"
    ],
    "answerIndex": 1,
    "explanation": "Crisis mayor a 5 minutos o repetidas sin recuperación define estado epiléptico. El manejo inicial es benzodiacepina IV. Si persiste, se administra antiepiléptico de segunda línea como levetiracetam o fenitoína. El tratamiento debe ser escalonado y rápido para evitar daño neurológico.",
    "gpcReference": ""
  },
  {
    "specialty": "gyo",
    "tema": "Reumatología: Lupus Eritematoso Sistémico",
    "difficulty": "muy-alta",
    "case": "Gestante de 35 semanas con antecedente de preeclampsia presenta dolor en epigastrio intenso, náusea y malestar general. TA 165/105 mmHg. Laboratorio: AST y ALT elevadas, plaquetas 75,000/mm³, DHL elevada.",
    "question": "Diagnóstico más probable:",
    "options": [
      "Hepatitis viral",
      "Colestasis intrahepática",
      "Síndrome HELLP",
      "Hígado graso agudo",
      "Gastritis"
    ],
    "answerIndex": 2,
    "explanation": "HELLP es variante grave de preeclampsia caracterizada por hemólisis, enzimas hepáticas elevadas y trombocitopenia. Representa emergencia obstétrica y requiere estabilización materna e interrupción del embarazo.",
    "gpcReference": ""
  },
  {
    "specialty": "cir",
    "tema": "Cirugía abdominal",
    "subtema": "Apendicitis aguda",
    "difficulty": "Media",
    "case": "Paciente masculino de 25 años acude por dolor abdominal de 12 horas de evolución que inició en región periumbilical y posteriormente migró a fosa ilíaca derecha. Presenta náusea y anorexia. A la exploración física: T 37.8°C, FC 98 lpm. Abdomen con resistencia muscular voluntaria, signo de McBurney positivo, signo de Rovsing positivo y dolor a la descompresión (signo de Blumberg). Exámenes de laboratorio revelan leucocitosis de 14,000/mm³ con neutrofilia del 85%.",
    "questions": [
      {
        "question": "Según la GPC, ¿cuál es la escala clínica recomendada para apoyar el diagnóstico en este paciente?",
        "options": [
          "Criterios de Ranson",
          "Escala de Alvarado",
          "Escala de RIPASA",
          "Criterios de Tokio"
        ],
        "answerIndex": 1,
        "explanation": "La GPC mexicana recomienda ampliamente el uso de la escala de Alvarado en pacientes con sospecha de apendicitis aguda para normar el criterio de manejo. El paciente presenta un puntaje alto (migración del dolor, anorexia, náusea, dolor en fosa ilíaca derecha, rebote, fiebre y leucocitosis).",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el tratamiento de elección definitivo para este paciente según las guías actuales?",
        "options": [
          "Apendicectomía abierta",
          "Manejo conservador con antibióticos",
          "Drenaje percutáneo",
          "Apendicectomía laparoscópica"
        ],
        "answerIndex": 3,
        "explanation": "La apendicectomía laparoscópica es el abordaje quirúrgico de elección por su menor dolor postoperatorio, menor tasa de infección de sitio quirúrgico y recuperación más rápida.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología biliar",
    "subtema": "Colecistitis aguda",
    "difficulty": "Alta",
    "case": "Paciente femenina de 42 años, multípara, con IMC de 32 kg/m². Acude a urgencias por dolor intenso en hipocondrio derecho de 14 horas de evolución, irradiado a escápula derecha, acompañado de náusea y vómito de contenido biliar. Refiere fiebre no cuantificada en casa. A la exploración: T 38.5°C, FC 105 lpm, TA 110/70 mmHg. Ictericia leve en escleras. Abdomen doloroso a la palpación profunda en hipocondrio derecho con cese de la inspiración (signo de Murphy positivo) y masa palpable. Laboratorios: Leucocitos 16,000/mm³, PCR 50 mg/L, Bilirrubina total 2.1 mg/dL.",
    "questions": [
      {
        "question": "De acuerdo con los criterios de Tokio, ¿qué grado de severidad presenta la colecistitis de la paciente?",
        "options": [
          "Grado I (Leve)",
          "Grado II (Moderada)",
          "Grado III (Grave)",
          "Grado IV (Complicada)"
        ],
        "answerIndex": 1,
        "explanation": "Es una colecistitis Grado II (Moderada) debido a la presencia de masa palpable en hipocondrio derecho y la leucocitosis >14,000/mm³ (otros criterios incluyen evolución >72h o marcada inflamación local). No es grave (Grado III) porque no presenta datos de disfunción orgánica.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el estudio de imagen de primera elección para confirmar el diagnóstico según la GPC?",
        "options": [
          "Tomografía axial computarizada de abdomen",
          "Ultrasonido hepático y de vías biliares",
          "Resonancia magnética",
          "Gammagrafía biliar (HIDA)"
        ],
        "answerIndex": 1,
        "explanation": "El ultrasonido es el estudio de primera elección por su alta sensibilidad, bajo costo y disponibilidad. Los hallazgos principales incluyen engrosamiento de pared (>4mm), líquido perivesicular, lito encarcelado y signo de Murphy ultrasonográfico positivo.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "ATLS P1",
    "subtema": "Trauma torácico (Neumotórax a tensión)",
    "difficulty": "Media",
    "case": "Masculino de 28 años ingresa a urgencias tras sufrir volcadura en vehículo automotor. Se encuentra agitado, con cianosis peribucal y franca dificultad respiratoria. Exploración física: TA 80/50 mmHg, FC 130 lpm, FR 34 rpm, SatO2 82%. Presenta ingurgitación yugular y la tráquea se encuentra desviada a la izquierda. En el hemitórax derecho se observan movimientos asimétricos, ausencia de ruidos respiratorios e hiperresonancia a la percusión.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico clínico más probable?",
        "options": [
          "Taponamiento cardíaco",
          "Hemotórax masivo",
          "Neumotórax abierto",
          "Neumotórax a tensión derecho"
        ],
        "answerIndex": 3,
        "explanation": "La clínica clásica de neumotórax a tensión incluye dificultad respiratoria severa, hipotensión, desviación traqueal contralateral, ausencia de ruidos respiratorios e hiperresonancia ipsilateral, sumado a la ingurgitación yugular secundaria a la compresión del retorno venoso.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la intervención terapéutica inmediata requerida?",
        "options": [
          "Intubación orotraqueal",
          "Radiografía de tórax portátil",
          "Descompresión torácica con aguja",
          "Toracotomía de reanimación"
        ],
        "answerIndex": 2,
        "explanation": "El neumotórax a tensión es una emergencia clínica y el tratamiento no debe retrasarse esperando estudios de imagen. Se requiere descompresión inmediata con aguja/catéter grueso o toracostomía con dedo, seguida de la colocación definitiva de una sonda endopleural.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Hernias",
    "subtema": "Hernia inguinal",
    "difficulty": "Baja",
    "case": "Masculino de 65 años, trabajador de la construcción, acude a consulta por un abultamiento en la región inguinal derecha que aumenta de tamaño al toser o levantar objetos pesados y disminuye en decúbito supino. Ocasionalmente presenta dolor leve tipo pesantez. A la exploración física: en bipedestación se observa asimetría inguinal derecha; a la maniobra de Valsalva protruye una masa irreductible espontáneamente pero reductible a la manipulación suave. Al tacto del anillo inguinal superficial, el impulso se siente en la punta del dedo explorador.",
    "questions": [
      {
        "question": "Anatómicamente, ¿cuál es la característica que define a una hernia inguinal indirecta?",
        "options": [
          "Protruye a través del triángulo de Hesselbach",
          "Emerge por debajo del ligamento inguinal",
          "Protruye a través del anillo inguinal profundo y desciende por el conducto inguinal",
          "Se debe a debilidad exclusiva de la fascia transversalis"
        ],
        "answerIndex": 2,
        "explanation": "Las hernias inguinales indirectas protruyen por el anillo inguinal profundo, lateral a los vasos epigástricos inferiores, y descienden acompañando al cordón espermático. Las que protruyen por el triángulo de Hesselbach son las directas.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la técnica quirúrgica abierta de elección con colocación de malla (técnica libre de tensión) recomendada en la GPC?",
        "options": [
          "Técnica de Shouldice",
          "Técnica de Lichtenstein",
          "Técnica de Bassini",
          "Técnica de McVay"
        ],
        "answerIndex": 1,
        "explanation": "La GPC establece que la plastía inguinal tipo Lichtenstein (colocación de malla libre de tensión) es el estándar de oro en el abordaje abierto por su menor tasa de recurrencia en comparación con las técnicas anatómicas (Bassini, Shouldice).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Quemaduras / Golpe de calor / Hipotermia",
    "subtema": "Reanimación hídrica en paciente quemado",
    "difficulty": "Alta",
    "case": "Masculino de 35 años, peso de 70 kg, es rescatado de un incendio estructural. Presenta quemaduras de segundo y tercer grado que abarcan toda la cara anterior del tronco, toda la extremidad superior derecha y la cara anterior de la extremidad inferior izquierda. Es ingresado a sala de choque para manejo avanzado.",
    "questions": [
      {
        "question": "Según la regla de los nueves, ¿cuál es el porcentaje de superficie corporal quemada (SCQ) estimado?",
        "options": [
          "27%",
          "36%",
          "45%",
          "54%"
        ],
        "answerIndex": 1,
        "explanation": "Sumando las áreas según la regla de los nueves para adultos: cara anterior del tronco (18%) + extremidad superior derecha completa (9%) + cara anterior de la extremidad inferior izquierda (9%) nos da un total de 36% de SCQ.",
        "gpcReference": ""
      },
      {
        "question": "Según las guías del ATLS actualizadas para quemaduras térmicas en adultos, ¿cuál es la fórmula recomendada para calcular los líquidos a infundir en las primeras 24 horas?",
        "options": [
          "4 ml Ringer Lactato x kg x % SCQ",
          "3 ml Ringer Lactato x kg x % SCQ",
          "2 ml Ringer Lactato x kg x % SCQ",
          "1 ml Ringer Lactato x kg x % SCQ"
        ],
        "answerIndex": 2,
        "explanation": "La décima edición del ATLS actualizó la recomendación de reanimación inicial para adultos con quemaduras térmicas a 2 ml de Ringer Lactato x peso (kg) x % SCQ, administrando la mitad del volumen calculado en las primeras 8 horas post-quemadura",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Urología P2",
    "subtema": "Litiasis renal",
    "difficulty": "Media",
    "case": "Masculino de 42 años acude a urgencias por presentar dolor de inicio súbito, muy intenso, tipo cólico en la región lumbar derecha que se irradia hacia el flanco y el testículo ipsilateral. El paciente se encuentra inquieto, diaforético y no encuentra una posición que alivie el dolor. Refiere náuseas y ha presentado un episodio de emesis. A la exploración física: signos vitales dentro de parámetros normales, abdomen blando, depresible, sin datos de irritación peritoneal, puñopercusión derecha francamente positiva. Examen general de orina con microhematuria.",
    "questions": [
      {
        "question": "De acuerdo con la GPC, ¿cuál es el estudio de imagen de elección y estándar de oro para confirmar el diagnóstico en este paciente en el servicio de urgencias?",
        "options": [
          "Radiografía simple de abdomen (KUB)",
          "Ultrasonido renal y de vías urinarias",
          "Tomografía computarizada helicoidal sin contraste (UroTAC)",
          "Urografía excretora"
        ],
        "answerIndex": 2,
        "explanation": "La GPC establece que la Tomografía Computarizada helicoidal no contrastada (UroTAC) es el estudio de imagen de elección (estándar de oro) en pacientes con sospecha de cólico nefrítico debido a su alta sensibilidad y especificidad, permitiendo identificar el tamaño, localización y densidad del lito, así como descartar otros diagnósticos diferenciales.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el fármaco de primera línea recomendado para el control del dolor en la fase aguda del cólico renoureteral?",
        "options": [
          "Paracetamol intravenoso",
          "Diclofenaco o Ketorolaco intravenoso",
          "Tramadol intravenoso",
          "Butilhioscina intravenosa"
        ],
        "answerIndex": 1,
        "explanation": "Los AINEs (como el diclofenaco, ketorolaco o indometacina) son el tratamiento de primera línea para la analgesia en el cólico nefrítico agudo. Son preferibles a los opioides ya que, además de proporcionar una excelente analgesia, disminuyen el tono del músculo liso ureteral y reducen la filtración glomerular, aliviando la distensión de la cápsula renal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología cámara posterior",
    "subtema": "Glaucoma de ángulo cerrado agudo",
    "difficulty": "Alta",
    "case": "Femenina de 65 años acude a urgencias por dolor ocular severo en el ojo derecho de 3 horas de evolución, de inicio súbito tras salir de una sala de cine. Refiere visión borrosa, percepción de \"halos de colores\" alrededor de las luces, cefalea hemicraneal ipsilateral, náuseas y vómito. A la exploración oftalmológica básica: ojo derecho con hiperemia conjuntival importante (ojo rojo), córnea de aspecto opaco (edematosa) y pupila en semimidriasis arreactiva a la luz. A la palpación bidigital, el globo ocular derecho se percibe francamente pétreo en comparación con el izquierdo.",
    "questions": [
      {
        "question": "Ante la sospecha diagnóstica, ¿cuál es el tratamiento médico de primera línea que debe iniciarse de inmediato para preservar la visión?",
        "options": [
          "Pilocarpina tópica exclusivamente",
          "Timolol tópico y revaloración en 24 horas",
          "Acetazolamida sistémica (IV o VO) y betabloqueadores tópicos",
          "Atropina tópica para relajar el esfínter del iris"
        ],
        "answerIndex": 2,
        "explanation": "El glaucoma agudo de ángulo cerrado es una urgencia oftalmológica. El manejo inicial busca reducir rápidamente la presión intraocular (PIO) disminuyendo la producción del humor acuoso. La GPC recomienda el uso de inhibidores de la anhidrasa carbónica sistémicos (Acetazolamida) combinados con betabloqueadores tópicos. La atropina está absolutamente contraindicada porque causa midriasis y empeora el bloqueo angular.",
        "gpcReference": ""
      },
      {
        "question": "Una vez yugulado el cuadro agudo y normalizada la presión intraocular, ¿cuál es el tratamiento definitivo de elección para evitar recurrencias en esta paciente?",
        "options": [
          "Uso de análogos de prostaglandinas de por vida",
          "Iridotomía periférica con láser Nd:YAG",
          "Trabeculectomía quirúrgica",
          "Extracción del cristalino"
        ],
        "answerIndex": 1,
        "explanation": "La iridotomía periférica con láser es el tratamiento definitivo. Crea una vía alterna para que el humor acuoso pase de la cámara posterior a la anterior, aliviando el bloqueo pupilar. Se debe realizar en el ojo afectado y, de manera profiláctica, en el ojo contralateral, ya que la predisposición anatómica suele ser bilateral.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología de extremidad inferior",
    "subtema": "Fractura de cadera",
    "difficulty": "Baja",
    "case": "Femenina de 82 años, con antecedente de osteoporosis, es traída por familiares tras sufrir una caída desde su propia altura al tropezar con una alfombra en su domicilio. Refiere dolor intenso en la ingle izquierda e incapacidad absoluta para levantarse y caminar. A la exploración física: se observa la extremidad inferior izquierda acortada y en marcada rotación externa. Hay dolor intenso a la palpación del trocánter mayor y a los intentos de movilización pasiva de la cadera. Pediolociones y sensibilidad distal conservadas.",
    "questions": [
      {
        "question": "Por la cinemática de trauma y la posición clásica de la extremidad, ¿cuál es el diagnóstico clínico más probable?",
        "options": [
          "Luxación posterior de cadera",
          "Fractura de fémur distal",
          "Fractura de cadera (fémur proximal)",
          "Fractura de pelvis (rama isquiopúbica)"
        ],
        "answerIndex": 2,
        "explanation": "La presentación clínica clásica de una fractura de cadera en el adulto mayor incluye acortamiento y rotación externa de la extremidad afectada, sumado a la impotencia funcional tras un traumatismo de baja energía. En contraste, la luxación posterior de cadera (típica de trauma de alta energía como accidentes de auto) se presenta con la pierna acortada, pero en rotación interna y aducción.",
        "gpcReference": ""
      },
      {
        "question": "Se realiza radiografía de pelvis evidenciando una fractura del cuello femoral (intracapsular) desplazada (Garden III). Debido al alto riesgo de necrosis avascular de la cabeza femoral, ¿cuál es el tratamiento quirúrgico de elección indicado en esta paciente?",
        "options": [
          "Reducción cerrada y fijación con tornillos canulados",
          "Fijación con clavo centromedular cefalomedular",
          "Colocación de placa DHS (Dynamic Hip Screw)",
          "Hemiartroplastia o Artroplastia total de cadera"
        ],
        "answerIndex": 3,
        "explanation": "Las fracturas intracapsulares del cuello femoral desplazadas en pacientes adultos mayores tienen una tasa altísima de no unión y necrosis avascular debido a la interrupción del riego sanguíneo (arterias circunflejas). Por ello, la GPC recomienda el reemplazo articular (hemiartroplastia o artroplastia total) como tratamiento de elección para permitir una movilización temprana y evitar complicaciones por encamamiento.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología prostática",
    "subtema": "Hiperplasia Prostática Benigna (HPB)",
    "difficulty": "Alta",
    "case": "Masculino de 68 años acude a consulta de primer nivel por presentar síntomas del tracto urinario inferior (STUI) de 2 años de evolución. Refiere nicturia (se levanta 4 veces por la noche), disminución en la fuerza y calibre del chorro urinario, pujo miccional, intermitencia y sensación de vaciamiento incompleto. Niega hematuria, pérdida de peso o dolor óseo. Al tacto rectal: esfínter normotónico, próstata de aproximadamente 50 gramos, simétrica, de consistencia ahulada (adenomatosa), bordes bien delimitados, sin nódulos palpables, indolora. Antígeno Prostático Específico (APE) en 2.1 ng/mL, EGO sin alteraciones. Femenina de 52 años, con antecedente de colelitiasis no tratada. Acude a urgencias por dolor abdominal de inicio súbito, transfictivo, localizado en epigastrio con irradiación en hemicinturón hacia la espalda, de 12 horas de evolución. Presenta náuseas y múltiples episodios de vómito gastroalimentario que no alivian el dolor. A la exploración física: FC 115 lpm, FR 22 rpm, TA 100/65 mmHg, temperatura 37.9°C. Abdomen globoso por panículo adiposo, doloroso a la palpación en epigastrio y mesogastrio, peristalsis ausente. Signo de Cullen y Grey-Turner negativos. Laboratorios: Leucocitos 15,500/mm³, Glucosa 180 mg/dL, AST 350 U/L, ALT 410 U/L, Lipasa 1,200 U/L (Valor de referencia hasta 60 U/L).",
    "questions": [
      {
        "question": "¿Cuál es el grupo farmacológico de primera línea para lograr una mejoría rápida de los síntomas obstructivos en este paciente?",
        "options": [
          "Inhibidores de la 5-alfa-reductasa (Finasterida)",
          "Bloqueadores alfa-1 adrenérgicos (Tamsulosina)",
          "Antimuscarínicos (Oxibutinina)",
          "Inhibidores de la fosfodiesterasa-5 (Tadalafilo)"
        ],
        "answerIndex": 1,
        "explanation": "Los alfa-bloqueadores relajan el músculo liso del cuello vesical y la cápsula prostática, proporcionando un alivio rápido (en días o semanas) de los síntomas obstructivos. Los inhibidores de la 5-alfa-reductasa (que disminuyen el tamaño de la próstata) tardan de 3 a 6 meses en hacer efecto máximo, aunque la GPC recomienda la terapia combinada en próstatas >40 gramos.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál de las siguientes opciones representa una indicación absoluta para el tratamiento quirúrgico (Resección Transuretral de Próstata - RTUP) de la HPB?",
        "options": [
          "Volumen prostático mayor a 60 gramos",
          "Nicturia de más de 3 veces por noche",
          "Retención aguda de orina refractaria al retiro de sonda, litiasis vesical o falla renal secundaria",
          "APE > 4 ng/mL"
        ],
        "answerIndex": 2,
        "explanation": "Las indicaciones absolutas de cirugía en HPB incluyen: retención urinaria refractaria, infecciones del tracto urinario recurrentes, hematuria macroscópica recurrente, litiasis vesical y dilatación del tracto urinario superior con insuficiencia renal secundaria. El volumen prostático por sí solo o un síntoma aislado no son indicaciones absolutas. ema: Patología pancreática",
        "gpcReference": ""
      },
      {
        "question": "De acuerdo con las Guías de Práctica Clínica, ¿cuál es el diagnóstico y su etiología más probable?",
        "options": [
          "Úlcera péptica perforada",
          "Colecistitis aguda complicada",
          "Pancreatitis aguda de origen biliar",
          "Pancreatitis aguda por hipertrigliceridemia"
        ],
        "answerIndex": 2,
        "explanation": "El diagnóstico de pancreatitis aguda requiere 2 de 3 criterios (clínico, bioquímico, imagenológico). La paciente tiene clínica clásica y Lipasa elevada más de 3 veces el límite superior normal. La elevación marcada de ALT (>150 U/L) tiene un valor predictivo positivo altísimo para etiología biliar, sumado a su antecedente de colelitiasis.",
        "gpcReference": ""
      },
      {
        "question": "Según las guías actuales, ¿cuál es el momento ideal para solicitar una Tomografía Computarizada (TAC) de abdomen contrastada en esta paciente para evaluar la severidad local (escala de Balthazar)?",
        "options": [
          "Inmediatamente a su ingreso a urgencias",
          "Entre las 24 y 48 horas del inicio de los síntomas",
          "Entre las 72 y 96 horas del inicio de los síntomas",
          "Solo si la paciente requiere intervención quirúrgica"
        ],
        "answerIndex": 2,
        "explanation": "La GPC y los consensos internacionales (como Atlanta) establecen que la TAC contrastada no debe realizarse de forma temprana (antes de las 72 horas) a menos que haya duda diagnóstica, ya que la necrosis pancreática y las complicaciones locales tardan entre 72 y 96 horas en delimitarse adecuadamente. Hacerla antes puede subestimar la gravedad del cuadro.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología gástrica",
    "subtema": "Úlcera péptica perforada",
    "difficulty": "Media",
    "case": "Masculino de 68 años con antecedente de osteoartritis severa en rodillas, en tratamiento crónico con naproxeno y piroxicam. Es traído a urgencias por presentar dolor abdominal de inicio súbito, extremadamente intenso y generalizado, de 4 horas de evolución. A la exploración física: paciente inmóvil en la camilla (posición antiálgica), diaforético y taquicárdico (110 lpm). Abdomen plano, con rigidez muscular involuntaria (\"abdomen en madera\"), ausencia de ruidos peristálticos y pérdida de la matidez hepática a la percusión (Signo de Jobert positivo).",
    "questions": [
      {
        "question": "¿Cuál es el estudio de imagen inicial más útil, rápido y económico para confirmar la principal sospecha diagnóstica en urgencias?",
        "options": [
          "Tomografía de abdomen simple",
          "Radiografía simple de tórax en bipedestación",
          "Ultrasonido abdominal FAST",
          "Endoscopia superior de urgencia"
        ],
        "answerIndex": 1,
        "explanation": "Ante la sospecha de víscera hueca perforada (clásicamente por úlcera péptica por AINEs crónicos con \"abdomen en madera\" y pérdida de matidez hepática), el estudio inicial es la radiografía de tórax de pie, la cual evidenciará neumoperitoneo (aire libre subdiafragmático). La endoscopia está absolutamente contraindicada en perforación aguda.",
        "gpcReference": ""
      },
      {
        "question": "Co nfirmado el neumoperitoneo, ¿cuál es el manejo terapéutico de elección definitivo?",
        "options": [
          "Manejo conservador con inhibidores de bomba de protones IV y antibióticos",
          "Cierre primario de la perforación con parche de Graham (omento)",
          "Gastrectomía total",
          "Vagotomía troncular más piloroplastia"
        ],
        "answerIndex": 1,
        "explanation": "La GPC indica que la perforación de una úlcera péptica es una urgencia quirúrgica. El tratamiento de elección y estándar actual es el cierre simple de la úlcera reforzado con un parche de epiplón (Parche de Graham), frecuentemente realizado por vía laparoscópica.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología diverticular",
    "subtema": "Diverticulitis aguda complicada",
    "difficulty": "Alta",
    "case": "Masculino de 60 años acude por dolor abdominal continuo en fosa ilíaca izquierda de 3 días de evolución, acompañado de fiebre no cuantificada y estreñimiento. A la exploración: T 38.5°C, FC 100 lpm. Abdomen con dolor a la palpación profunda en cuadrante inferior izquierdo, con resistencia muscular y masa palpable dolorosa en fosa ilíaca izquierda. Rebote negativo en el resto del abdomen. Laboratorios con leucocitosis de 16,000/mm³. Se le realiza una Tomografía Computarizada (TAC) de abdomen con contraste intravenoso que reporta: engrosamiento de la pared del colon sigmoides con inflamación de la grasa perocólica y presencia de un absceso pélvico tabicado de 6 cm de diámetro, sin aire libre ni líquido libre generalizado.",
    "questions": [
      {
        "question": "De acuerdo con la clasificación tomográfica, ¿qué estadio de Hinchey presenta este paciente?",
        "options": [
          "Hinchey I",
          "Hinchey II",
          "Hinchey III",
          "Hinchey IV"
        ],
        "answerIndex": 1,
        "explanation": "La clasificación de Hinchey modificada estratifica la diverticulitis. Hinchey I es absceso pericólico o mesentérico localizado. Hinchey II es absceso pélvico, retroperitoneal o a distancia (como en este caso, un absceso de 6 cm en pelvis). Hinchey III es peritonitis purulenta generalizada y Hinchey IV es peritonitis fecaloidea.",
        "gpcReference": ""
      },
      {
        "question": "Con base en el tamaño y localización del absceso (Hinchey II), ¿cuál es el tratamiento de primera línea recomendado por la GPC?",
        "options": [
          "Resección intestinal urgente (Procedimiento de Hartmann)",
          "Antibioticoterapia intravenosa exclusiva",
          "Drenaje percutáneo guiado por imagen (TAC o USG) más antibióticos IV",
          "Colectomía derecha"
        ],
        "answerIndex": 2,
        "explanation": "En la enfermedad diverticular aguda complicada con un absceso mayor de 4-5 cm (como este de 6 cm) confinado (Hinchey II), la GPC recomienda el drenaje percutáneo guiado por imagen apoyado de antibióticos intravenosos. La cirugía de urgencia (Hartmann) se reserva para falla al drenaje, inestabilidad hemodinámica o estadios Hinchey III/IV.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Mordeduras y picaduras",
    "subtema": "Alacranismo (Intoxicación por veneno de escorpión)",
    "difficulty": "Alta",
    "case": "Niño de 4 años, originario del estado de Nayarit, es llevado a la clínica rural por su madre tras presentar llanto súbito mientras jugaba en el patio hace 40 minutos. La madre trae el espécimen (un alacrán coloración pálida) en un frasco. A la exploración física: paciente muy inquieto, con sialorrea abundante, lagrimeo, nistagmo rotatorio, espasmos musculares y fasciculaciones linguales. Signos vitales: T 38.0°C, FC 140 lpm, FR 30 rpm.",
    "questions": [
      {
        "question": "De acuerdo con la NOM-033-SSA2 -2011 y la GPC, ¿qué grado de intoxicación presenta el paciente?",
        "options": [
          "Grado I (Leve)",
          "Grado II (Moderada)",
          "Grado III (Grave)",
          "Intoxicación asintomática"
        ],
        "answerIndex": 2,
        "explanation": "El nistagmo, las fasciculaciones linguales, la sialorrea abundante y las alteraciones neurológicas/motoras generalizadas son signos inequívocos de una intoxicación Grado III (Grave). Los grados leves (I) solo presentan síntomas locales (dolor, parestesias en el sitio) y los moderados (II) síntomas sistémicos leves sin compromiso neurológico severo.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la dosis terapéutica inicial de faboterápico polivalente antialacrán recomendada para este grupo de edad y severidad?",
        "options": [
          "1 frasco vía intravenosa",
          "2 frascos vía intravenosa",
          "3 frascos vía intravenosa",
          "Paracetamol y observación estrecha por 4 horas"
        ],
        "answerIndex": 2,
        "explanation": "La NOM -033 establece que en niños menores de 5 años con cuadro grave (Grado III), se deben administrar de manera inmediata 3 frascos de faboterápico polivalente antialacrán vía intravenosa directa. Observar sin administrar antiveneno en un niño con clínica neurológica es una mala práctica que pone en riesgo la vida.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Hipoacusia y Vértigo",
    "subtema": "Vértigo Postural Paroxístico Benigno (VPPB)",
    "difficulty": "Baja",
    "case": "Femenina de 55 años acude a consulta externa refiriendo episodios de mareo muy intenso (\"siente que todo le da vueltas\") que duran menos de un minuto. Refiere que estos episodios se desencadenan exclusivamente cuando se acuesta en la cama, se gira hacia el lado derecho o al extender el cuello para alcanzar objetos altos. Niega pérdida de la audición (hipoacusia), acúfenos o alteraciones en la marcha.",
    "questions": [
      {
        "question": "¿Cuál es la maniobra clínica diagnóstica de elección para confirmar la patología de esta paciente según la GPC?",
        "options": [
          "Maniobra de Epley",
          "Maniobra de Dix-Hallpike",
          "Prueba de Romberg",
          "Prueba de Fukuda"
        ],
        "answerIndex": 1,
        "explanation": "La maniobra de Dix-Hallpike es el estándar clínico para diagnosticar el VPPB del canal semicircular posterior (el más frecuente). Al acostar rápidamente a la paciente con la cabeza girada 45° y extendida, se reproduce el vértigo y se observa un nistagmo característico (rotatorio y hacia arriba).",
        "gpcReference": ""
      },
      {
        "question": "Una vez confirmado el diagnóstico, ¿cuál es la maniobra terapéutica de reposición canalicular de primera línea recomendada?",
        "options": [
          "Maniobra de Semont",
          "Maniobra de Lempert",
          "Maniobra de Epley",
          "Ejercicios de habituación de Brandt-Daroff"
        ],
        "answerIndex": 2,
        "explanation": "La maniobra de Epley tiene una alta tasa de éxito (hasta 90% en una sola sesión) para tratar el VPPB del canal semicircular posterior, ya que moviliza las otoconias desplazadas de vuelta al utrículo.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología intestinal QX",
    "subtema": "Obstrucción intestinal",
    "difficulty": "Alta",
    "case": "Masculino de 55 años, con antecedente de laparotomía exploradora hace 3 años secundaria a trauma abdominal cerrado. Acude al servicio de urgencias refiriendo dolor abdominal tipo cólico de 24 horas de evolución, acompañado de náuseas, múltiples episodios de vómito de características fecaloides y distensión abdominal progresiva. Refiere incapacidad para canalizar gases y ausencia de evacuaciones desde el inicio del cuadro. A la exploración física: T 37.5°C, FC 105 lpm. Abdomen francamente distendido, timpánico a la percusión, peristalsis con ruidos metálicos de lucha en periodos de acentuación del dolor. Tacto rectal con ámpula vacía. Se solicita radiografía simple de abdomen en bipedestación.",
    "questions": [
      {
        "question": "De acuerdo con la epidemiología reportada en la GPC, ¿cuál es la causa más frecuente de este cuadro en pacientes adultos con el antecedente de este paciente?",
        "options": [
          "Hernia de pared abdominal encarcelada",
          "Vólvulo de colon sigmoides",
          "Adherencias (bridas) postquirúrgicas",
          "Íleo biliar"
        ],
        "answerIndex": 2,
        "explanation": "Las adherencias o bridas postquirúrgicas son la causa número uno de oclusión del intestino delgado en pacientes adultos con antecedente de cirugías abdominales previas (responsables de hasta el 70% de los casos). Las hernias son la segunda causa y la primera en pacientes sin cirugías previas.",
        "gpcReference": ""
      },
      {
        "question": "¿Qué hallazgo radiológico es clásico y esperado en la radiografía de abdomen en bipedestación para confirmar la obstrucción de intestino delgado?",
        "options": [
          "Imagen de \"grano de café\" en fosa ilíaca izquierda",
          "Niveles hidroaéreos e imagen en \"pila de monedas\" (válvulas conniventes)",
          "Pérdida de la matidez hepática (aire subdiafragmático)",
          "Imagen en \"corazón de manzana\""
        ],
        "answerIndex": 1,
        "explanation": "La presencia de niveles hidroaéreos escalonados, dilatación de asas de intestino delgado (>3 cm) y la visualización de las válvulas conniventes que cruzan toda la luz del asa (imagen en \"pila de monedas\") son los signos radiológicos clásicos de oclusión intestinal baja del intestino delgado. El grano de café corresponde a vólvulo de sigmoides.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología arterial y venosa",
    "subtema": "Insuficiencia Venosa Crónica",
    "difficulty": "Media",
    "case": "Femenina de 48 años, de ocupación cajera (bipedestación prolongada), con obesidad grado I. Acude a consulta externa por presentar pesadez, dolor tipo ardoroso, prurito y edema en extremidades inferiores que empeora por las tardes y mejora con el reposo y la elevación de las piernas. A la exploración física se observan trayectos venosos dilatados y tortuosos mayores a 3 mm en territorio de la vena safena magna bilateral. No se observan cambios de coloración en la piel (lipodermatoesclerosis) ni úlceras activas o cicatrizadas.",
    "questions": [
      {
        "question": "De acuerdo con la clasificación internacional CEAP para la enfermedad venosa crónica, ¿en qué estadio clínico se encuentra la paciente?",
        "options": [
          "CEAP C1",
          "CEAP C2",
          "CEAP C3",
          "CEAP C4"
        ],
        "answerIndex": 1,
        "explanation": "La clasificación CEAP clínica se divide en: C0 (sin signos visibles), C1 (telangiectasias o venas reticulares <3 mm), C2 (venas varicosas >3 mm, como en esta paciente), C3 (edema sin cambios cutáneos), C4 (cambios tróficos cutáneos como pigmentación o eccema), C5 (úlcera cicatrizada) y C6 (úlcera activa).",
        "gpcReference": ""
      },
      {
        "question": "Según la GPC mexicana, ¿cuál es el tratamiento farmacológico de primera línea (flebotónico) con mayor nivel de evidencia para el alivio de los síntomas, aunado a la terapia compresiva?",
        "options": [
          "Ácido acetilsalicílico",
          "Pentoxifilina",
          "Diosmina / Hesperidina (Fracción flavonoica purificada)",
          "Cilostazol"
        ],
        "answerIndex": 2,
        "explanation": "La GPC recomienda el uso de la fracción flavonoica purificada micronizada (Diosmina/Hesperidina) o castaño de indias como tratamiento médico de primera línea para el alivio del dolor, pesadez y edema en la insuficiencia venosa crónica. El cilostazol y la pentoxifilina se utilizan en la enfermedad arterial periférica.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Cirugía Oncología",
    "subtema": "Cáncer de colon y recto",
    "difficulty": "Media",
    "case": "Masculino de 68 años de edad, con antecedente de tabaquismo intenso. Acude a consulta por cuadro de 4 meses de evolución caracterizado por astenia, adinamia, pérdida de peso no intencionada de 8 kg y cambios en el hábito intestinal, refiriendo heces adelgazadas (\"acintadas\") y dolor abdominal tipo cólico intermitente. Exámenes de laboratorio revelan hemoglobina de 9.5 g/dL (anemia microcítica hipocrómica) y prueba de sangre oculta en heces positiva.",
    "questions": [
      {
        "question": "Se solicita un colon por enema con doble contraste como parte del abordaje inicial, en el cual se observa una lesión estenosante circunferencial de bordes irregulares en el colon descendente. ¿Cuál es el nombre del signo radiológico clásico descrito en esta patología?",
        "options": [
          "Signo del grano de café",
          "Signo del remolino",
          "Signo de la \"manzana mordida\" o \"corazón de manzana\"",
          "Signo del pico de pájaro"
        ],
        "answerIndex": 2,
        "explanation": "El signo de la \"manzana mordida\" o \"corazón de manzana\" (apple core sign) es la imagen radiológica clásica en estudios de contraste del cáncer colorrectal, producida por el estrechamiento concéntrico de la luz intestinal debido al crecimiento anular del tumor, típicamente visto en tumores del colon izquierdo (descendente y sigmoides).",
        "gpcReference": ""
      },
      {
        "question": "Tras confirmar el diagnóstico de adenocarcinoma de colon por colonoscopia y biopsia, ¿cuál es el marcador tumoral que la GPC recomienda solicitar para establecer el pronóstico basal y monitorizar la respuesta al tratamiento o recurrencia?",
        "options": [
          "CA-125",
          "Alfa-fetoproteína (AFP)",
          "Antígeno Carcinoembrionario (ACE)",
          "CA 19-9"
        ],
        "answerIndex": 2,
        "explanation": "El Antígeno Carcinoembrionario (ACE) es el marcador tumoral de elección para el seguimiento, pronóstico y detección de recurrencias en el cáncer colorrectal. No debe utilizarse como prueba de tamizaje o diagnóstico inicial por su baja sensibilidad y especificidad, pero es invaluable una vez establecido el diagnóstico.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Tumores testiculares y cáncer de próstata",
    "subtema": "Cáncer de próstata",
    "difficulty": "Alta",
    "case": "Masculino de 72 años acude a chequeo médico de rutina. Refiere síntomas del tracto urinario inferior (STUI) leves a moderados. Como parte de su tamizaje, se realiza un tacto rectal encontrando una próstata asimétrica, con aumento de consistencia en el lóbulo derecho donde se palpa un nódulo pétreo e indoloro. Se solicita Antígeno Prostático Específico (APE) total, el cual reporta 14 ng/mL.",
    "questions": [
      {
        "question": "Con base en la anatomía glandular, ¿en qué zona de la próstata se origina con mayor frecuencia esta patología neoplásica?",
        "options": [
          "Zona transicional",
          "Zona central",
          "Zona periférica",
          "Estroma fibromuscular anterior"
        ],
        "answerIndex": 2,
        "explanation": "El adenocarcinoma de próstata se origina en la zona periférica en aproximadamente el 70-75% de los casos (lo que permite su palpación mediante tacto rectal). Por el contrario, la Hiperplasia Prostática Benigna (HPB) se origina predominantemente en la zona transicional (rodeando la uretra, causando síntomas obstructivos tempranos).",
        "gpcReference": ""
      },
      {
        "question": "Se realiza biopsia transrectal guiada por ultrasonido confirmando adenocarcinoma de próstata. ¿Cómo se llama el sistema de gradación histológica utilizado mundialmente para evaluar la agresividad de este tumor?",
        "options": [
          "Escala de Fuhrman",
          "Escala de Gleason",
          "Clasificación de Bosniak",
          "Clasificación de TNM"
        ],
        "answerIndex": 1,
        "explanation": "La escala de Gleason es el sistema de gradación patológica exclusivo para el cáncer de próstata. Evalúa el patrón arquitectónico de las glándulas neoplásicas sumando el patrón primario (más abundante) y el secundario para dar un puntaje total de 6 a 10, donde los puntajes más altos indican tumores más indiferenciados y agresivos. (Fuhrman es para cáncer renal, Bosniak para quistes renales).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología intestinal inflamatoria",
    "subtema": "Colitis Ulcerosa Crónica Idiopática (CUCI)",
    "difficulty": "Media",
    "case": "Femenina de 32 años de edad acude a consulta por cuadro de 3 meses de evolución caracterizado por diarrea sanguinolenta de 6 a 8 evacuaciones por día, acompañada de pujo, tenesmo rectal, dolor abdominal tipo cólico en cuadrante inferior izquierdo y pérdida de peso no intencionada de 4 kg. Refiere episodios febriles intermitentes. A la exploración física: palidez de tegumentos, taquicardia leve (100 lpm), abdomen doloroso a la palpación en marco colónico izquierdo, sin datos de irritación peritoneal. Tacto rectal evidencia restos hemáticos frescos.",
    "questions": [
      {
        "question": "Se le realiza una colonoscopia con toma de biopsia. ¿Cuál es el hallazgo histopatológico característico y patognomónico esperado en esta paciente según la GPC?",
        "options": [
          "Granulomas no caseificantes transmurales",
          "Microabscesos crípticos y distorsión de la arquitectura de las criptas",
          "Infiltrado linfocítico intraepitelial sin distorsión de criptas",
          "Presencia de células en anillo de sello"
        ],
        "answerIndex": 1,
        "explanation": "Los microabscesos de las criptas y la inflamación limitada a la mucosa y submucosa son el sello histopatológico de la Colitis Ulcerosa (CUCI). Los granulomas no caseificantes transmurales son característicos de la Enfermedad de Crohn.",
        "gpcReference": ""
      },
      {
        "question": "Para inducir la remisión en esta paciente con un brote de intensidad leve a moderada, ¿cuál es el tratamiento farmacológico de primera línea recomendado?",
        "options": [
          "Glucocorticoides sistémicos a dosis altas",
          "Infliximab (Terapia biológica)",
          "Derivados del 5-aminosalicilato (Mesalazina/Sulfasalazina)",
          "Azatioprina"
        ],
        "answerIndex": 2,
        "explanation": "La GPC mexicana establece que los aminosalicilatos (5-ASA como la mesalazina) tópicos u orales son el tratamiento de inducción y mantenimiento de primera línea para pacientes con CUCI leve a moderada. Los esteroides se reservan para brotes graves o refractarios a 5-ASA, y la terapia biológica para enfermedad severa o corticodependiente.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Cirrosis y sus complicaciones",
    "subtema": "Sangrado de tubo digestivo alto (STDA) por várices esofágicas",
    "difficulty": "Alta",
    "case": "Masculino de 55 años con antecedente de alcoholismo crónico severo durante 20 años. Es traído a urgencias tras presentar dos episodios de hematemesis abundante en su domicilio, acompañados de mareo y síncope. A su ingreso: TA 85/50 mmHg, FC 120 lpm, FR 24 rpm. A la exploración se observan telangiectasias (arañas vasculares) en tórax, red venosa colateral en abdomen y red capilar palmar. Se inician maniobras de reanimación hídrica con cristaloides y transfusión de hemoderivados.",
    "questions": [
      {
        "question": "Previo a la realización de la endoscopia de urgencia, ¿qué grupo de fármacos debe administrarse de forma temprana para disminuir la presión portal y controlar el sangrado activo según las guías actuales?",
        "options": [
          "Inhibidores de la bomba de protones a dosis altas IV",
          "Betabloqueadores no selectivos (Propranolol) VO",
          "Fármacos vasoactivos esplácnicos (Terlipresina, Octreótida o Somatostatina) IV",
          "Ácido tranexámico IV"
        ],
        "answerIndex": 2,
        "explanation": "En el STDA por hipertensión portal (várices esofágicas), la administración precoz de fármacos vasoactivos como la terlipresina o la octreótida reduce el flujo sanguíneo esplácnico y la presión portal, facilitando la hemostasia. Se deben iniciar incluso antes de la endoscopia. Los IBP son para sangrado no variceal (úlcera).",
        "gpcReference": ""
      },
      {
        "question": "Una vez estabilizado el paciente y controlada la hemorragia mediante ligadura endoscópica con bandas, ¿cuál es la terapia farmacológica de elección para la profilaxis secundaria (evitar el resangrado)?",
        "options": [
          "Betabloqueadores no selectivos (Propranolol o Nadolol)",
          "Inhibidores de la bomba de protones (Omeprazol) de por vida",
          "Nitratos de acción prolongada exclusivamente",
          "Espironolactona a dosis altas"
        ],
        "answerIndex": 0,
        "explanation": "La GPC recomienda el uso de betabloqueadores no selectivos (propranolol, nadolol, carvedilol) solos o en combinación con ligadura endoscópica para la profilaxis secundaria del sangrado por várices esofágicas, ya que reducen el gasto cardíaco y producen vasoconstricción esplácnica (bloqueo beta- 2), disminuyendo así la presión venosa portal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Trauma generalidades y complicaciones",
    "subtema": "Síndrome Compartimental",
    "difficulty": "Media",
    "case": "Masculino de 28 años, sufre accidente deportivo resultando en fractura cerrada de la diáfisis tibial derecha. Es tratado inicialmente en un hospital periférico con inmovilización mediante un aparato de yeso circular cruropodálico. Ocho horas después, el paciente acude a urgencias quejándose de un dolor insoportable en la pierna afectada que no cede con la administración de analgésicos opioides intravenosos. A la exploración: el paciente se muestra ansioso, la extremidad inmovilizada se siente a tensión, hay dolor extremo a la extensión pasiva de los dedos del pie derecho. Los pulsos distales (pedio y tibial posterior) son palpables y el llenado capilar es de 2 segundos.",
    "questions": [
      {
        "question": "¿Cuál es el signo clínico más temprano y sensible para sospechar esta complicación ortopédica?",
        "options": [
          "Ausencia de pulsos distales",
          "Palidez y frialdad de la extremidad",
          "Dolor desproporcionado a la lesión y dolor al estiramiento pasivo de los músculos",
          "Parálisis motora y parestesias totales"
        ],
        "answerIndex": 2,
        "explanation": "El dolor desproporcionado a la lesión original, que no cede con analgésicos potentes, y el dolor exquisito a la elongación pasiva del compartimento afectado son los signos más tempranos y confiables del síndrome compartimental. La ausencia de pulsos (pulselessness) y la parálisis son signos muy tardíos que indican necrosis tisular irreversible.",
        "gpcReference": ""
      },
      {
        "question": "Ante la alta sospecha clínica de síndrome compartimental, ¿cuál es el estándar de oro diagnóstico y la indicación terapéutica definitiva?",
        "options": [
          "Doppler arterial seguido de embolectomía",
          "Retiro del yeso y elevación de la extremidad por encima del nivel del corazón",
          "Medición de la presión intracompartimental y fasciotomía urgente",
          "Resonancia magnética de la extremidad"
        ],
        "answerIndex": 2,
        "explanation": "El diagnóstico de certeza se realiza midiendo la presión intracompartimental (una presión absoluta >30 mmHg o un Delta P <30 mmHg es indicativo de isquemia). El único tratamiento efectivo para salvar la extremidad es la fasciotomía descompresiva de urgencia de los compartimentos afectados.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología de extremidad superior",
    "subtema": "Fracturas de antebrazo y mano (Fractura de Colles)",
    "difficulty": "Baja",
    "case": "Femenina de 65 años con diagnóstico previo de osteoporosis. Acude al servicio de urgencias tras sufrir una caída desde su propia altura, refiriendo haber apoyado la palma de la mano derecha en extensión (dorsiflexión) contra el suelo para detener el impacto. Presenta dolor intenso, incapacidad funcional y aumento de volumen en la muñeca derecha. A la inspección, se observa una deformidad evidente de la muñeca en \"dorso de tenedor\".",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico clínico más probable según el mecanismo de lesión y la deformidad descrita?",
        "options": [
          "Fractura de Smith",
          "Fractura de Colles",
          "Fractura de Barton",
          "Fractura de escafoides"
        ],
        "answerIndex": 1,
        "explanation": "La fractura de Colles es la fractura distal del radio más común. El mecanismo clásico es la caída sobre la mano en dorsiflexión. Su rasgo clínico distintivo es la deformidad en \"dorso de tenedor\", producto del desplazamiento dorsal del fragmento óseo distal. La fractura de Smith (o Colles invertida) ocurre por caída con la muñeca en flexión palmar y genera deformidad en \"pala de jardinero\".",
        "gpcReference": ""
      },
      {
        "question": "Según la GPC para fracturas distales de radio no articulares, con desplazamiento aceptable e integridad del cúbito en adultos mayores, ¿cuál es el tratamiento conservador inicial de elección?",
        "options": [
          "Reducción abierta y fijación interna con placa volar",
          "Reducción cerrada y colocación de yeso braquipalmar por 12 semanas",
          "Reducción cerrada y colocación de yeso o férula antebraquipalmar (o pinza de azúcar) por 4 a 6 semanas",
          "Fijación con clavillos percutáneos de Kirschner exclusivamente"
        ],
        "answerIndex": 2,
        "explanation": "En pacientes adultos mayores con fracturas extraarticulares (como la clásica de Colles) que logran una buena reducción cerrada, la GPC recomienda el tratamiento conservador mediante inmovilización con yeso o férula antebraquipalmar durante aproximadamente 4 a 6 semanas.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología infecciosa / Rinología y faringe",
    "subtema": "Otitis media maligna (Otitis externa maligna)",
    "difficulty": "Alta",
    "case": "Masculino de 72 años de edad con antecedente de diabetes mellitus tipo 2 de larga evolución, mal controlada (HbA1c 10.5%). Acude a consulta externa de otorrinolaringología por presentar otalgia derecha severa y de predominio nocturno de 3 semanas de evolución, que no responde a analgésicos comunes, acompañada de otorrea purulenta fétida. A la exploración física se observa asimetría facial con imposibilidad para cerrar el ojo derecho y desviación de la comisura labial hacia la izquierda. A la otoscopia se aprecia conducto auditivo externo edematizado y presencia de tejido de granulación en la unión osteocartilaginosa.",
    "questions": [
      {
        "question": "De acuerdo con la epidemiología y el cuadro clínico, ¿cuál es el agente etiológico más frecuentemente aislado en esta entidad?",
        "options": [
          "Staphylococcus aureus",
          "Streptococcus pneumoniae",
          "Pseudomonas aeruginosa",
          "Haemophilus influenzae"
        ],
        "answerIndex": 2,
        "explanation": "La otitis externa maligna (o necrotizante) es una infección invasiva grave del conducto auditivo externo y la base del cráneo que afecta predominantemente a pacientes diabéticos de edad avanzada o inmunocomprometidos. El agente causal en más del 90% de los casos es la Pseudomonas aeruginosa.",
        "gpcReference": ""
      },
      {
        "question": "Ante la confirmación diagnóstica, ¿cuál es el tratamiento antimicrobiano sistémico de primera línea recomendado por las guías?",
        "options": [
          "Amoxicilina con ácido clavulánico vía oral",
          "Ciprofloxacino o Ceftazidima vía intravenosa prolongada",
          "Vancomicina vía intravenosa",
          "Macrólidos (Azitromicina) vía oral"
        ],
        "answerIndex": 1,
        "explanation": "Debido a la etiología por Pseudomonas, el tratamiento exige cobertura antipseudomónica sistémica agresiva y prolongada (frecuentemente de 6 a 8 semanas). El ciprofloxacino (fluorquinolona con excelente penetración ósea) o cefalosporinas antipseudomónicas (Ceftazidima, Cefepime) son la terapia de elección. La parálisis facial indica osteomielitis de la base del cráneo e involucro del VII par craneal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "ETS",
    "subtema": "Sífilis primaria",
    "difficulty": "Baja",
    "case": "Masculino de 25 años, con múltiples parejas sexuales y uso inconsistente de preservativo, acude a consulta por la aparición de una úlcera en el glande de 1 semana de evolución. A la exploración física se observa una lesión ulcerada única de 1 cm de diámetro, de bordes limpios, sobreelevados, base indurada y que no duele a la palpación. Se palpan adenopatías inguinales bilaterales, firmes y no dolorosas.",
    "questions": [
      {
        "question": "Por las características clínicas de la lesión, ¿cuál es el diagnóstico más probable?",
        "options": [
          "Chancroide (Haemophilus ducreyi)",
          "Herpes genital (VHS-2)",
          "Sífilis primaria (Treponema pallidum)",
          "Linfogranuloma venéreo (Chlamydia trachomatis)"
        ],
        "answerIndex": 2,
        "explanation": "La úlcera limpia, indurada, de bordes bien definidos y, sobre todo, indolora (chancro duro), acompañada de linfadenopatía regional indolora, es la presentación patognomónica de la sífilis primaria. El chancroide, por el contrario, produce úlceras sucias, purulentas y muy dolorosas (chancro blando).",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el tratamiento farmacológico de primera elección según las guías clínicas para este paciente?",
        "options": [
          "Azitromicina 1 g VO dosis única",
          "Penicilina G benzatínica 2.4 millones UI IM dosis única",
          "Doxiciclina 100 mg VO cada 12 horas por 7 días",
          "Ceftriaxona 500 mg IM dosis única"
        ],
        "answerIndex": 1,
        "explanation": "La Penicilina G benzatínica en dosis única intramuscular es el estándar de oro y tratamiento de primera elección para la sífilis temprana (primaria, secundaria y latente temprana). La doxiciclina es la alternativa principal en pacientes con alergia confirmada a la penicilina (no embarazadas).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Introducción Oftalmología",
    "subtema": "Patología de anexos (Chalazión)",
    "difficulty": "Media",
    "case": "Femenina de 30 años acude a consulta externa por la presencia de una \"bolita\" en el párpado superior del ojo derecho de 4 semanas de evolución. Refiere que en los primeros días presentó ligero enrojecimiento y molestia, pero actualmente es completamente asintomática, a excepción de la preocupación estética. A la exploración oftalmológica se palpa un nódulo subcutáneo de 5 mm en la cara tarsal del párpado superior, firme, bien delimitado, indoloro, sin hiperemia ni calor local. Se abrirá en una ventana nueva Shutterstock",
    "questions": [
      {
        "question": "De acuerdo con la presentación clínica, ¿cuál es el diagnóstico correcto?",
        "options": [
          "Orzuelo externo",
          "Orzuelo interno",
          "Chalazión",
          "Dacriocistitis aguda"
        ],
        "answerIndex": 2,
        "explanation": "El chalazión es una lesión nodular crónica, firme e indolora del párpado. A diferencia del orzuelo (que es una infección aguda, hiperémica y muy dolorosa), el chalazión es el resultado de una inflamación granulomatosa estéril secundaria a la retención de secreciones.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la glándula palpebral cuya obstrucción e inflamación granulomatosa da origen a esta patología?",
        "options": [
          "Glándulas de Zeis",
          "Glándulas de Moll",
          "Glándula lagrimal principal",
          "Glándulas de Meibomio"
        ],
        "answerIndex": 3,
        "explanation": "El chalazión se produce por la obstrucción y posterior inflamación lipogranulomatosa estéril de las glándulas sebáceas de Meibomio, ubicadas en el tarso palpebral. Los orzuelos externos, por su parte, afectan típicamente las glándulas de Zeis o Moll asociadas a los folículos de las pestañas.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Hipoacusia y vértigo",
    "subtema": "Enfermedad de Ménière",
    "difficulty": "Alta",
    "case": "Masculino de 45 años es referido a otorrinolaringología por presentar episodios recurrentes de vértigo incapacitante (\"las cosas le dan vueltas\") que duran entre 2 y 4 horas. Durante las crisis, el paciente experimenta náuseas severas. Además, refiere que antes y durante el mareo siente el oído derecho \"tapado\" (plenitud ótica), escucha un zumbido intenso (acúfeno) y nota que no escucha bien por ese mismo oído. Entre las crisis, el paciente se encuentra asintomático. La audiometría evidencia hipoacusia neurosensorial de tonos bajos en el oído derecho.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico clínico más probable según la tríada sintomática que presenta el paciente?",
        "options": [
          "Vértigo Postural Paroxístico Benigno (VPPB)",
          "Neuronitis vestibular",
          "Enfermedad de Ménière",
          "Schwannoma vestibular (Neurinoma del acústico)"
        ],
        "answerIndex": 2,
        "explanation": "La enfermedad de Ménière se caracteriza clínicamente por la tríada/tétrada clásica de episodios recurrentes de vértigo (que duran minutos a horas, no segundos como en el VPPB), acúfeno, hipoacusia neurosensorial fluctuante y sensación de plenitud ótica.",
        "gpcReference": ""
      },
      {
        "question": "Según la GPC, ¿cuál es el tratamiento profiláctico de primera línea recomendado para reducir la frecuencia y severidad de las crisis en la terapia de mantenimiento?",
        "options": [
          "Maniobras de reposición canalicular (Epley)",
          "Corticoides intratimpánicos exclusivamente",
          "Restricción de sodio en la dieta y uso de diuréticos (ej. hidroclorotiazida) o betahistina",
          "Laberintectomía química con gentamicina"
        ],
        "answerIndex": 2,
        "explanation": "El manejo conservador y profiláctico inicial se basa en modificaciones del estilo de vida (restricción estricta de sal, cafeína y alcohol) sumado al uso de diuréticos (para disminuir el hidrops endolinfático) o neuromoduladores como la betahistina. Los procedimientos destructivos o inyecciones se reservan para casos refractarios y severos.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Cirugía Oncología",
    "subtema": "Cáncer gástrico",
    "difficulty": "Media",
    "case": "Masculino de 65 años, fumador crónico, acude por pérdida de peso de 12 kg en los últimos 4 meses, acompañada de dolor epigástrico sordo, saciedad temprana y aversión reciente por la carne. A la exploración física destaca palidez de tegumentos y la palpación de un ganglio linfático supraclavicular izquierdo aumentado de tamaño, de consistencia pétrea e indoloro.",
    "questions": [
      {
        "question": "¿Qué nombre recibe el hallazgo exploratorio del ganglio supraclavicular izquierdo y qué indica en el contexto de este paciente?",
        "options": [
          "Ganglio de Irish; indica metástasis pulmonar",
          "Ganglio de la Hermana María José; indica carcinomatosis peritoneal",
          "Ganglio de Virchow; indica metástasis linfática de una neoplasia intraabdominal (típicamente gástrica)",
          "Tumor de Krukenberg; indica metástasis ovárica"
        ],
        "answerIndex": 2,
        "explanation": "El ganglio de Virchow es una adenopatía supraclavicular izquierda. Es un signo clásico de diseminación linfática de una neoplasia maligna intraabdominal, siendo el cáncer gástrico una de las causas más emblemáticas. El nódulo de la Hermana María José se encuentra en la región periumbilical.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el estudio estándar de oro de primera elección para confirmar el diagnóstico sospechado según las guías actuales?",
        "options": [
          "Tomografía Computarizada de abdomen contrastada",
          "Tránsito esofagogastroduodenal con bario",
          "Endoscopia superior (Panendoscopia) con toma de biopsias",
          "Resonancia magnética abdominal"
        ],
        "answerIndex": 2,
        "explanation": "La endoscopia superior con toma de múltiples biopsias de las lesiones sospechosas es el estándar de oro para el diagnóstico definitivo del cáncer gástrico, permitiendo la visualización directa y la confirmación histopatológica. La tomografía se utiliza posteriormente para la estadificación (búsqueda de metástasis y extensión tumoral).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología arterial y venosa",
    "subtema": "Insuficiencia arterial aguda",
    "difficulty": "Alta",
    "case": "Femenina de 70 años con antecedente de fibrilación auricular crónica en tratamiento irregular con anticoagulantes. Acude a urgencias por dolor súbito, lancinante e insoportable en la extremidad inferior derecha de 2 horas de evolución. A la exploración física, la extremidad derecha se observa marcadamente pálida, fría al tacto en comparación con la contralateral, con ausencia total de pulsos poplíteo y pedio. La paciente refiere parestesias (\"hormigueo\") y tiene dificultad para mover los dedos del pie.",
    "questions": [
      {
        "question": "Por las características clínicas y los antecedentes, ¿cuál es la etiología más probable de este cuadro?",
        "options": [
          "Trombosis venosa profunda",
          "Embolismo arterial de origen cardiogénico",
          "Ruptura de aneurisma aórtico abdominal",
          "Tromboangeítis obliterante (Enfermedad de Buerger)"
        ],
        "answerIndex": 1,
        "explanation": "La presentación clínica de las \"6 P\" (Pain, Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia) de inicio súbito en una paciente con el antecedente clave de fibrilación auricular (FA) es clásica de un embolismo arterial agudo (el coágulo se forma en la orejuela izquierda y viaja hasta ocluir una arteria periférica).",
        "gpcReference": ""
      },
      {
        "question": "Una vez establecido el diagnóstico clínico de isquemia arterial aguda que amenaza la extremidad, ¿cuál es la medida farmacológica inmediata que debe instaurarse en urgencias previo a la revascularización?",
        "options": [
          "Administración de clopidogrel y aspirina a dosis de impregnación",
          "Anticoagulación sistémica inmediata con Heparina no fraccionada intravenosa",
          "Administración de cilostazol o pentoxifilina vía oral",
          "Analgesia exclusiva y espera del cirujano vascular"
        ],
        "answerIndex": 1,
        "explanation": "La GPC establece que ante la sospecha clínica firme de isquemia arterial aguda, se debe iniciar de forma inmediata la anticoagulación sistémica con heparina no fraccionada IV (si no hay contraindicaciones) para evitar la propagación del trombo en el lecho vascular isquémico, mientras se prepara al paciente para la intervención definitiva de revascularización (embolectomía o trombólisis).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "ATLS P2",
    "subtema": "Traumatismo Craneoencefálico (TCE) - Hematoma Epidural",
    "difficulty": "Alta",
    "case": "Masculino de 22 años sufre accidente al caer de su patineta sin portar casco, golpeándose fuertemente la región temporal derecha. Testigos refieren pérdida de la conciencia de aproximadamente 2 minutos, tras los cuales el paciente se levantó, refirió sentirse bien y caminó a su casa (intervalo lúcido). Dos horas después, sus familiares lo encuentran en el piso, con deterioro neurológico rápido, vómito en proyectil y respiración irregular. A su llegada a urgencias, presenta Glasgow de 7 (Apertura ocular 1, Respuesta verbal 2, Respuesta motora 4), anisocoria con midriasis derecha arreactiva y hemiparesia izquierda.",
    "questions": [
      {
        "question": "Se realiza una Tomografía Computarizada (TAC) de cráneo simple de urgencia. ¿Cuál es la imagen característica esperada en este paciente?",
        "options": [
          "Imagen hiperdensa en forma de semiluna que cruza las suturas craneales",
          "Imagen hiperdensa biconvexa (forma de lente) que no cruza las suturas craneales",
          "Borramiento de surcos y ventrículos con pérdida de la diferenciación sustancia gris-blanca",
          "Sangre hiperdensa ocupando las cisternas basales y el espacio aracnoideo"
        ],
        "answerIndex": 1,
        "explanation": "El cuadro clínico de trauma temporal, intervalo lúcido y deterioro rápido es el clásico del hematoma epidural. En la TAC simple de cráneo, la sangre arterial a alta presión despega la duramadre del cráneo formando una colección hiperdensa biconvexa (lente lenticular) que está limitada por las suturas craneales (donde la duramadre está firmemente adherida al hueso). La imagen en \"semiluna\" corresponde al hematoma subdural.",
        "gpcReference": ""
      },
      {
        "question": "Anatómicamente, ¿cuál es el vaso sanguíneo cuya ruptura causa con mayor frecuencia esta patología traumática?",
        "options": [
          "Venas puente subdurales",
          "Arteria cerebral media",
          "Seno sagital superior",
          "Arteria meníngea media"
        ],
        "answerIndex": 3,
        "explanation": "La arteria meníngea media, que transcurre por debajo del hueso temporal (específicamente en la región del pterion, que es una zona ósea muy delgada), es el vaso típicamente desgarrado en las fracturas temporoparietales causantes del hematoma epidural. Las venas puente causan el hematoma subdural.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología esofágica",
    "subtema": "Acalasia",
    "difficulty": "Media",
    "case": "Femenina de 45 años de edad acude a consulta por historia de 8 meses de evolución con disfagia progresiva, primero a sólidos y actualmente a líquidos. Refiere además regurgitación frecuente de alimentos no digeridos (especialmente al acostarse), pirosis ocasional y pérdida de peso de 5 kg en los últimos meses. Se le realiza un esofagograma con bario que muestra dilatación del cuerpo esofágico con un afilamiento regular y simétrico en la unión esofagogástrica.",
    "questions": [
      {
        "question": "¿Cuál es el nombre del signo radiológico clásico descrito en el esofagograma de esta paciente?",
        "options": [
          "Signo del sacacorchos",
          "Signo del pico de pájaro",
          "Signo de la manzana mordida",
          "Signo del doble riel"
        ],
        "answerIndex": 1,
        "explanation": "El signo de \"pico de pájaro\" o \"cola de ratón\" es la imagen radiológica patognomónica de la acalasia en el esofagograma con bario, y representa la falta de relajación del esfínter esofágico inferior (EEI) junto con la dilatación del esófago proximal. El signo del sacacorchos es característico del espasmo esofágico difuso.",
        "gpcReference": ""
      },
      {
        "question": "Según la GPC, ¿cuál es el estudio considerado el estándar de oro para confirmar el diagnóstico fisiopatológico de este trastorno de la motilidad?",
        "options": [
          "Endoscopia superior con toma de biopsia",
          "pH-metría de 24 horas",
          "Manometría esofágica de alta resolución",
          "Tomografía axial computarizada de tórax"
        ],
        "answerIndex": 2,
        "explanation": "La manometría esofágica es el estándar de oro para el diagnóstico de la acalasia. Demuestra los dos defectos fisiopatológicos cardinales: aperistalsis del cuerpo esofágico y la falta de relajación (o relajación incompleta) del esfínter esofágico inferior durante la deglución.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología isquémica intestinal",
    "subtema": "Isquemia mesentérica aguda",
    "difficulty": "Alta",
    "case": "Masculino de 75 años, hipertenso y con antecedente de fibrilación auricular no anticoagulada. Acude a urgencias quejándose de dolor abdominal de inicio súbito, periumbilical, severo (\"el peor dolor de su vida\") y constante, acompañado de un episodio de diarrea sanguinolenta y vómito. A la exploración física llama la atención que, a pesar de las quejas de dolor insoportable del paciente, el abdomen se encuentra blando, depresible y sin datos francos de irritación peritoneal (dolor desproporcionado a los hallazgos físicos). Signos vitales: TA 150/90 mmHg, FC 120 lpm (arrítmica), T 37.8°C.",
    "questions": [
      {
        "question": "Con base en la sospecha diagnóstica principal, ¿cuál es el vaso sanguíneo más frecuentemente ocluido en esta patología?",
        "options": [
          "Tronco celíaco",
          "Arteria mesentérica inferior",
          "Arteria mesentérica superior",
          "Vena esplénica"
        ],
        "answerIndex": 2,
        "explanation": "La embolia arterial secundaria a una fibrilación auricular es la causa más común de isquemia mesentérica aguda. El émbolo se aloja con mayor frecuencia en la arteria mesentérica superior debido a su ángulo de origen oblicuo desde la aorta y a su gran calibre, comprometiendo la irrigación de todo el intestino delgado y el colon derecho.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el estudio de imagen de elección inicial (estándar de oro) en urgencias para confirmar el diagnóstico y planear el abordaje quirúrgico?",
        "options": [
          "Radiografía simple de abdomen",
          "Angiotomografía computarizada (AngioTAC) de abdomen",
          "Ultrasonido abdominal Doppler",
          "Resonancia magnética abdominal"
        ],
        "answerIndex": 1,
        "explanation": "La AngioTAC de abdomen (fase arterial y venosa) es el estudio de imagen inicial de elección en la actualidad por su alta sensibilidad y especificidad, su rapidez en urgencias y su capacidad para identificar el sitio exacto de la oclusión vascular y evaluar el estado de la pared intestinal (neumatosis).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología perianal",
    "subtema": "Fisura anal crónica",
    "difficulty": "Media",
    "case": "Femenina de 32 años, oficinista, con historia de estreñimiento crónico. Acude a consulta por dolor intenso, punzante, \"como si la cortaran con vidrio\", que se presenta exclusivamente durante la defecación y persiste por un par de horas después. Nota manchado de sangre roja fresca en el papel higiénico. A la inspección anal suave, se separa el margen anal y se observa un desgarro longitudinal en la línea media posterior, acompañado de un pliegue cutáneo engrosado en el borde externo.",
    "questions": [
      {
        "question": "El hallazgo descrito forma parte de la tríada de Brodie, patognomónica de la fisura anal crónica. ¿Cuáles son los tres componentes de esta tríada?",
        "options": [
          "Úlcera anal, papila anal hipertrófica y colgajo cutáneo (hemorroide centinela)",
          "Úlcera anal, absceso isquiorrectal y fístula subcutánea",
          "Úlcera anal, trombosis hemorroidal y prolapso mucoso",
          "Úlcera anal, papilitis y criptitis"
        ],
        "answerIndex": 0,
        "explanation": "Una fisura anal se considera crónica cuando no cicatriza en 6 semanas. La cronicidad y la inflamación repetida generan cambios anatómicos característicos conocidos como la Tríada de Brodie: 1) la úlcera o fisura en sí (donde pueden verse las fibras del esfínter anal interno), 2) una papila anal hipertrófica en el extremo interno (proximal) y 3) un colgajo cutáneo o \"hemorroide centinela\" en el extremo externo (distal).",
        "gpcReference": ""
      },
      {
        "question": "Según la GPC, ¿cuál es el tratamiento farmacológico tópico de primera línea con mayor nivel de evidencia para buscar la cicatrización de esta lesión?",
        "options": [
          "Ungüento de hidrocortisona al 1%",
          "Pomada de óxido de zinc con lidocaína",
          "Trinitrato de glicerilo al 0.2% o Diltiazem al 2% tópico",
          "Supositorios de glicerina"
        ],
        "answerIndex": 2,
        "explanation": "El objetivo del tratamiento médico es relajar el esfínter anal interno hipertónico para mejorar el flujo sanguíneo local y permitir la cicatrización. La GPC recomienda el uso de relajantes musculares tópicos como los nitratos (trinitrato de glicerilo) o los bloqueadores de canales de calcio (diltiazem o nifedipino) como terapia de primera línea, además de la dieta rica en fibra y los baños de asiento calientes.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología de extremidad inferior",
    "subtema": "Esguince de tobillo",
    "difficulty": "Baja",
    "case": "Masculino de 19 años es llevado a urgencias tras sufrir una torcedura del tobillo derecho durante un partido de fútbol. El mecanismo reportado fue una caída con el pie en inversión forzada y flexión plantar. Presenta dolor intenso, edema moderado en la cara anterolateral del tobillo y limitación para el apoyo de la extremidad. A la palpación, hay dolor exquisito justo por delante y debajo del maléolo externo.",
    "questions": [
      {
        "question": "Por el mecanismo de lesión (inversión forzada), ¿cuál es el ligamento que se lesiona con mayor frecuencia en este tipo de traumatismos?",
        "options": [
          "Ligamento deltoideo",
          "Ligamento peroneoastragalino anterior",
          "Ligamento calcaneocuboideo",
          "Ligamento tibiofibular anteroinferior"
        ],
        "answerIndex": 1,
        "explanation": "El complejo ligamentario lateral del tobillo es el más débil y el que se lesiona en el 85% de los esguinces (mecanismo de inversión). El ligamento peroneoastragalino anterior (LPAA) es el primero en tensarse y el que se desgarra con mayor frecuencia, seguido del ligamento calcaneofibular.",
        "gpcReference": ""
      },
      {
        "question": "Según la GPC, ¿cuál es la herramienta de decisión clínica validada para determinar si este paciente requiere la toma de una radiografía de tobillo para descartar fractura?",
        "options": [
          "Reglas de Wells",
          "Criterios de Centor",
          "Reglas del tobillo de Ottawa",
          "Criterios de Framingham"
        ],
        "answerIndex": 2,
        "explanation": "Las Reglas de Ottawa para el tobillo son la herramienta clínica estandarizada para decidir la necesidad de radiografías. Establecen que la radiografía está indicada solo si hay dolor en la zona maleolar y se cumple uno de estos: sensibilidad ósea en el borde posterior o punta del maléolo lateral/medial (últimos 6 cm), o incapacidad para soportar peso (dar 4 pasos) inmediatamente después del trauma y en urgencias. Ayudan a reducir radiografías innecesarias.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología gástrica y esofágica",
    "subtema": "Enfermedad por Reflujo Gastroesofágico (ERGE)",
    "difficulty": "Media",
    "case": "Masculino de 45 años, con IMC de 31 kg/m², acude a consulta por referir pirosis de predominio nocturno, regurgitación ácida y tos crónica de 1 año de evolución. Ha recibido tratamiento empírico con omeprazol a doble dosis durante 8 semanas sin mejoría significativa de los síntomas. Se le realiza una endoscopia superior que reporta esofagitis grado C de Los Ángeles y hernia hiatal por deslizamiento de 3 cm.",
    "questions": [
      {
        "question": "De acuerdo con la GPC mexicana para ERGE, ¿cuál es el estudio considerado el estándar de oro para confirmar el diagnóstico, especialmente ante la falta de respuesta al tratamiento médico?",
        "options": [
          "Esofagograma con bario",
          "Manometría esofágica de alta resolución",
          "pH-metría esofágica de 24 horas con impedancia",
          "Prueba terapéutica con inhibidores de bomba de protones a dosis cuádruple"
        ],
        "answerIndex": 2,
        "explanation": "La pH-metría esofágica de 24 horas (idealmente con impedanciometría) es el estándar de oro para el diagnóstico de ERGE, ya que permite cuantificar el tiempo de exposición ácida y correlacionar los episodios de reflujo (ácido y no ácido) con los síntomas del paciente. La manometría se utiliza para descartar trastornos motores antes de una cirugía, pero no diagnostica ERGE per se.",
        "gpcReference": ""
      },
      {
        "question": "Tras completar el protocolo de estudio y confirmar el diagnóstico, se decide manejo quirúrgico. ¿Cuál es la técnica quirúrgica de elección para este paciente?",
        "options": [
          "Funduplicatura parcial anterior de Dor",
          "Funduplicatura parcial posterior de Toupet",
          "Funduplicatura total de Nissen laparoscópica",
          "Derivación gástrica en Y de Roux"
        ],
        "answerIndex": 2,
        "explanation": "La funduplicatura de Nissen (total de 360 grados) por vía laparoscópica es el estándar de oro quirúrgico para el tratamiento de la ERGE con motilidad esofágica normal, ya que restituye la barrera antirreflujo con altas tasas de éxito a largo plazo. Las funduplicaturas parciales se reservan generalmente para pacientes con trastornos graves de la motilidad esofágica para evitar la disfagia postoperatoria severa.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Trauma generalidades y complicaciones",
    "subtema": "Síndrome de embolia grasa",
    "difficulty": "Alta",
    "case": "Masculino de 24 años ingresa a urgencias tras sufrir un accidente en motocicleta. Presenta fractura cerrada de la diáfisis del fémur derecho. Se le inmoviliza con tracción cutánea a la espera de material de osteosíntesis. A las 48 horas de su ingreso, el paciente desarrolla agitación psicomotriz progresiva, desorientación, taquipnea (FR 28 rpm) y disnea. A la exploración física destaca la presencia de múltiples lesiones puntiformes eritematosas que no palidecen a la presión, localizadas en el tórax anterior, axilas y conjuntivas. La oximetría de pulso reporta SatO2 del 85% al aire ambiente.",
    "questions": [
      {
        "question": "Con base en la clínica descrita (Criterios de Gurd y Wilson), ¿cuál es el diagnóstico más probable?",
        "options": [
          "Tromboembolia pulmonar aguda",
          "Síndrome de embolia grasa",
          "Síndrome de distrés respiratorio agudo por contusión pulmonar",
          "Choque séptico temprano"
        ],
        "answerIndex": 1,
        "explanation": "El síndrome de embolia grasa clásicamente se presenta entre 24 y 72 horas después de una fractura de huesos largos (como el fémur). La presentación incluye la tríada clínica clásica de los Criterios Mayores de Gurd: 1) Hipoxemia/insuficiencia respiratoria, 2) Alteraciones neurológicas (confusión, agitación) y 3) Rash petequial patognomónico en tórax, axilas y conjuntivas.",
        "gpcReference": ""
      },
      {
        "question": "Según los principios del ATLS y ortopedia, ¿cuál es la medida profiláctica más importante y efectiva para prevenir el desarrollo de esta complicación en pacientes con fracturas de huesos largos?",
        "options": [
          "Administración profiláctica de heparina de bajo peso molecular",
          "Uso de corticosteroides a dosis altas al momento del ingreso",
          "Fijación e inmovilización quirúrgica temprana de la fractura",
          "Colocación de filtro de vena cava inferior"
        ],
        "answerIndex": 2,
        "explanation": "La estabilización y fijación quirúrgica temprana de las fracturas de huesos largos (idealmente en las primeras 24 horas) es la medida profiláctica primaria con mayor evidencia para reducir la incidencia del síndrome de embolia grasa y el síndrome de distrés respiratorio asociado al trauma.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología cámara posterior",
    "subtema": "Desprendimiento de retina",
    "difficulty": "Media",
    "case": "Masculino de 62 años, con antecedente de miopía magna (alta), acude a urgencias oftalmológicas refiriendo que desde hace 2 días comenzó a ver \"telarañas y moscas volantes\" (miodesopsias) en el ojo derecho, acompañadas de destellos de luz intermitentes (fotopsias). El día de hoy, nota la aparición súbita de una \"cortina negra\" que le tapa la visión desde la parte inferior hacia el centro. Niega dolor ocular o traumatismo reciente.",
    "questions": [
      {
        "question": "Por la presentación clínica y los factores de riesgo, ¿cuál es la etiología principal de este tipo de desprendimiento de retina (regmatógeno)?",
        "options": [
          "Tracción fibrovascular secundaria a retinopatía diabética proliferativa",
          "Acumulación de líquido exudativo por un tumor coroideo",
          "Ruptura o desgarro retiniano que permite el paso de líquido subretiniano",
          "Oclusión de la arteria central de la retina"
        ],
        "answerIndex": 2,
        "explanation": "El desprendimiento de retina regmatógeno (el más común) se produce por una solución de continuidad (ruptura o desgarro) en la retina, frecuentemente traccionada por el vítreo, que permite que el líquido pase y separe la retina neurosensorial del epitelio pigmentario. Es típico de miopes altos. Los pródromos de fotopsias (destellos) y miodesopsias (\"moscas volantes\") indican tracción y desgarro agudo.",
        "gpcReference": ""
      },
      {
        "question": "Durante la evaluación inicial en el servicio de urgencias, ¿qué indicación inmediata de posicionamiento se le debe dar al paciente mientras es valorado por el cirujano retinólogo?",
        "options": [
          "Deambulación libre para favorecer el drenaje linfático",
          "Reposo absoluto en decúbito supino (cama) para evitar la progresión del desprendimiento",
          "Posición sedente a 90 grados",
          "Realizar maniobras de Valsalva"
        ],
        "answerIndex": 1,
        "explanation": "Ante la sospecha o confirmación de un desprendimiento de retina regmatógeno agudo, se indica reposo absoluto con posicionamiento de la cabeza buscando que, por gravedad, la retina desprendida tienda a acercarse a su base (generalmente en decúbito supino), minimizando los movimientos oculares y corporales para evitar que la bolsa de líquido siga disecando y afecte la mácula (lo que empeora drásticamente el pronóstico visual).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología infecciosa / Rinología y faringe",
    "subtema": "Absceso periamigdalino",
    "difficulty": "Baja",
    "case": "Adolescente masculino de 17 años acude a urgencias por fiebre de 39°C, odinofagia de predominio izquierdo severa e incapacidad para tragar saliva (sialorrea) de 3 días de evolución. Refiere haber tenido un cuadro de faringoamigdalitis hace una semana que fue tratado irregularmente con remedios caseros. A la exploración física destaca halitosis marcada, voz apagada (en \"papa caliente\") y dificultad para abrir la boca completamente (trismo). A la orofaringoscopia se observa abombamiento del pilar amigdalino anterior izquierdo, con la amígdala desplazada medialmente y la úvula desviada hacia el lado derecho (sano).",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico clínico de este paciente?",
        "options": [
          "Angina de Ludwig",
          "Epiglotitis aguda",
          "Faringoamigdalitis estreptocócica no complicada",
          "Absceso periamigdalino (Quinsy)"
        ],
        "answerIndex": 3,
        "explanation": "La presentación clínica es el cuadro de texto clásico del absceso periamigdalino: complicación de una amigdalitis aguda que se manifiesta con fiebre alta, trismo (por espasmo del músculo pterigoideo medial), voz de \"papa caliente\" y la exploración patognomónica de abombamiento del pilar y desviación contralateral de la úvula.",
        "gpcReference": ""
      },
      {
        "question": "Según la GPC, ¿cuál es el manejo terapéutico inicial de elección en el servicio de urgencias para este padecimiento?",
        "options": [
          "Amigdalectomía bilateral de urgencia en quirófano",
          "Tratamiento exclusivo con Penicilina benzatínica intramuscular y antiinflamatorios",
          "Punción aspirativa o incisión y drenaje del absceso, asociado a antibioticoterapia sistémica",
          "Intubación endotraqueal profiláctica"
        ],
        "answerIndex": 2,
        "explanation": "El absceso periamigdalino es una colección purulenta que requiere evacuación. La GPC recomienda la punción con aguja (aspiración) o la incisión y drenaje bajo anestesia local en urgencias como tratamiento de primera línea, acompañado de antibióticos sistémicos (como penicilina + metronidazol o clindamicina). La amigdalectomía se reserva para casos recurrentes, realizándose \"en frío\" semanas después de resuelto el cuadro agudo. Se abrirá en una ventana nueva Shutterstock Explorar",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología arterial y venosa",
    "subtema": "Trombosis Venosa Profunda (TVP)",
    "difficulty": "Media",
    "case": "Femenina de 38 años, usuaria de anticonceptivos orales combinados, se encuentra en su 5° día de postoperatorio de una histerectomía abdominal por miomatosis uterina. Comienza con dolor sordo e hinchazón progresiva en la extremidad inferior izquierda. A la exploración física, la pierna izquierda presenta aumento de volumen asimétrico (3 cm mayor que la derecha medido en la pantorrilla), eritema leve y aumento de la temperatura local. Se elicita dolor en la pantorrilla a la dorsiflexión pasiva del pie (Signo de Homans positivo) y a la compresión muscular contra el plano óseo (Signo de Olow positivo).",
    "questions": [
      {
        "question": "¿Cuál es la regla de predicción clínica validada que recomienda la GPC para estratificar el riesgo pretest y guiar el abordaje diagnóstico en esta paciente?",
        "options": [
          "Escala de Ginebra",
          "Escala de Wells para TVP",
          "Escala de PESI",
          "Criterios de Padua"
        ],
        "answerIndex": 1,
        "explanation": "La Escala de Wells para TVP es la herramienta clínica recomendada para calcular la probabilidad pretest de presentar una trombosis venosa profunda. Evalúa factores como el cáncer activo, inmovilización, cirugías recientes, dolor en el trayecto venoso profundo, edema asimétrico de pantorrilla y diagnóstico alternativo menos probable, clasificando a la paciente en probabilidad baja, moderada o alta.",
        "gpcReference": ""
      },
      {
        "question": "Con una probabilidad pretest \"alta\" según la escala aplicada, ¿cuál es el estudio de imagen no invasivo de primera elección para confirmar el diagnóstico anatómico?",
        "options": [
          "Dímero D cuantitativo",
          "Tomografía computarizada con contraste intravenoso",
          "Venografía por resonancia magnética",
          "Ultrasonido Doppler venoso compresivo de extremidades inferiores"
        ],
        "answerIndex": 3,
        "explanation": "El ultrasonido Doppler compresivo es el estándar de oro no invasivo inicial para el diagnóstico de la TVP. La falta de compresibilidad de la vena con el transductor es el criterio diagnóstico más sensible y específico. El Dímero D es útil para excluir TVP en pacientes con probabilidad pretest baja, pero ante una probabilidad alta, se debe proceder directamente al ultrasonido.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "ATLS P3",
    "subtema": "Trauma Abdominal Cerrado",
    "difficulty": "Media",
    "case": "Masculino de 28 años es traído a urgencias tras sufrir accidente automovilístico con impacto frontal a alta velocidad. Se encontraba como conductor y portaba cinturón de seguridad. A su ingreso, se encuentra somnoliento, diaforético y pálido. Signos vitales: TA 85/50 mmHg, FC 125 lpm, FR 26 rpm. A la exploración física, presenta equimosis en \"cinturón de seguridad\" en la pared abdominal. El abdomen se encuentra distendido, con resistencia muscular y dolor a la palpación generalizada, acentuado en el cuadrante superior izquierdo, con irradiación hacia el hombro izquierdo (Signo de Kehr positivo).",
    "questions": [
      {
        "question": "Ante un paciente con trauma abdominal cerrado e inestabilidad hemodinámica, ¿cuál es el estudio de imagen inicial de elección en la sala de choque según las guías del ATLS?",
        "options": [
          "Radiografía simple de abdomen en decúbito",
          "Lavado peritoneal diagnóstico (LPD)",
          "Ultrasonido FAST (Evaluación Sonográfica Enfocada en Trauma)",
          "Tomografía computarizada de abdomen con contraste intravenoso"
        ],
        "answerIndex": 2,
        "explanation": "El ultrasonido FAST es la herramienta de primera línea en pacientes inestables con trauma abdominal cerrado para detectar rápidamente la presencia de líquido libre (sangre) en la cavidad peritoneal, saco pericárdico o espacio pleural. La TAC está contraindicada en pacientes hemodinámicamente inestables, ya que el traslado a la sala de radiología puede ser fatal.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el órgano intraabdominal que se lesiona con mayor frecuencia en el traumatismo cerrado de abdomen?",
        "options": [
          "Hígado",
          "Intestino delgado",
          "Bazo",
          "Riñón"
        ],
        "answerIndex": 2,
        "explanation": "El bazo es el órgano intraabdominal más frecuentemente lesionado en el trauma contuso (cerrado), especialmente asociado a fracturas de las costillas inferiores izquierdas. El signo de Kehr (dolor referido al hombro izquierdo) es clásico por la irritación del nervio frénico secundario a la sangre periesplénica. En el trauma penetrante (por arma blanca o de fuego), el intestino delgado y el hígado son los más afectados.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología de extremidad superior",
    "subtema": "Patología de hombro doloroso (Síndrome del Manguito Rotador)",
    "difficulty": "Baja",
    "case": "Masculino de 55 años, de ocupación pintor de brocha gorda, acude a consulta por presentar dolor crónico en el hombro derecho de 6 meses de evolución. El dolor empeora por las noches, impidiéndole dormir sobre ese lado, y se exacerba al intentar pintar techos o levantar objetos por encima del nivel de la cabeza. A la exploración física, presenta dolor localizado en la cara anterolateral del hombro, con arco doloroso entre los 60° y 120° de abducción activa. Las maniobras de Neer y Hawkins-Kennedy son francamente positivas. La fuerza de abducción inicial se encuentra disminuida (Maniobra de Jobe positiva).",
    "questions": [
      {
        "question": "De acuerdo con la biomecánica y la incidencia, ¿cuál es el tendón del manguito rotador que se afecta y desgarra con mayor frecuencia en esta patología?",
        "options": [
          "Subescapular",
          "Infraespinoso",
          "Supraespinoso",
          "Redondo menor"
        ],
        "answerIndex": 2,
        "explanation": "El tendón del músculo supraespinoso es el más frecuentemente afectado en el síndrome de pinzamiento y en los desgarros del manguito rotador, debido a su paso estrecho por el espacio subacromial, lo que lo predispone a fricción, isquemia y degeneración, especialmente en actividades laborales o deportivas repetitivas por encima de la cabeza (overhead activities).",
        "gpcReference": ""
      },
      {
        "question": "Según la GPC, ¿cuál es el estudio de imagen inicial de elección, por su alta sensibilidad, accesibilidad y dinamismo, para evaluar el tendón afectado?",
        "options": [
          "Radiografía simple de hombro en proyecciones AP y axial",
          "Ultrasonido articular del hombro",
          "Resonancia magnética simple",
          "Tomografía computarizada"
        ],
        "answerIndex": 1,
        "explanation": "El ultrasonido musculoesquelético es el estudio de imagen inicial de elección para confirmar la sospecha clínica de tendinopatía o ruptura del manguito rotador (especialmente del supraespinoso). Es económico, no invasivo y permite una evaluación dinámica. La resonancia magnética se reserva como estándar de oro para planear el abordaje quirúrgico o cuando el ultrasonido no es concluyente.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Cirugía Oncología",
    "subtema": "Cáncer de Páncreas",
    "difficulty": "Alta",
    "case": "Masculino de 68 años con antecedente de tabaquismo (índice tabáquico de 25 paquetes/año). Acude por un cuadro de 2 meses de evolución caracterizado por ictericia progresiva, coluria, acolia, prurito generalizado y pérdida de peso de 10 kg. Niega dolor abdominal agudo o fiebre. A la exploración física destaca tinte ictérico franco en piel y escleras. El abdomen es blando, sin dolor, y se palpa una masa piriforme de bordes lisos y renitentes en el cuadrante superior derecho que corresponde a la vesícula biliar (Signo de Courvoisier-Terrier positivo). Exámenes de laboratorio revelan patrón colestásico (Fosfatasa alcalina 450 U/L, GGT 320 U/L, Bilirrubina directa 12 mg/dL).",
    "questions": [
      {
        "question": "¿Cuál es el marcador tumoral sérico de mayor utilidad para el apoyo diagnóstico y el seguimiento pronóstico en este paciente?",
        "options": [
          "Antígeno Carcinoembrionario (ACE)",
          "CA-125",
          "CA 19-9",
          "Alfa-fetoproteína (AFP)"
        ],
        "answerIndex": 2,
        "explanation": "El CA 19-9 es el marcador tumoral más sensible y específico para el adenocarcinoma ductal de páncreas. Aunque no es diagnóstico por sí solo (puede elevarse en patología biliar benigna severa), niveles muy elevados (>100 U/mL) en el contexto de una masa pancreática sugieren fuertemente malignidad y son excelentes para monitorear la respuesta al tratamiento.",
        "gpcReference": ""
      },
      {
        "question": "La Tomografía Computarizada abdominal corrobora un tumor de 3 cm confinado a la cabeza del páncreas, sin evidencia de metástasis a distancia ni invasión a la arteria mesentérica superior o tronco celíaco (tumor resecable). ¿Cuál es el procedimiento quirúrgico curativo de elección?",
        "options": [
          "Pancreatectomía distal con preservación esplénica",
          "Pancreatoduodenectomía (Procedimiento de Whipple)",
          "Derivación biliodigestiva en Y de Roux",
          "Colecistectomía laparoscópica con exploración de vías biliares"
        ],
        "answerIndex": 1,
        "explanation": "El procedimiento de Whipple (pancreatoduodenectomía cefálica) es la única opción con potencial curativo para los tumores localizados en la cabeza del páncreas, ampolla de Vater o duodeno distal. Consiste en la resección de la cabeza del páncreas, el duodeno, la vía biliar distal, la vesícula biliar y, en ocasiones, parte del estómago, seguida de la reconstrucción del tránsito digestivo, biliar y pancreático.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología cámara anterior",
    "subtema": "Pterigión",
    "difficulty": "Baja",
    "case": "Masculino de 45 años, de ocupación agricultor, acude a consulta oftalmológica refiriendo sensación de cuerpo extraño, ardor, ojo rojo ocasional y lagrimeo en el ojo derecho de varios años de evolución. Refiere que últimamente nota que una \"telita carnosa\" le está cubriendo la parte de color del ojo. A la exploración en la lámpara de hendidura, se observa un pliegue fibrovascular de forma triangular que se origina en la conjuntiva bulbar nasal, rebasa el limbo esclerocorneal y avanza aproximadamente 3 mm sobre la córnea, dirigiéndose hacia la pupila. Se abrirá en una ventana nueva Shutterstock Explorar",
    "questions": [
      {
        "question": "De acuerdo con la clínica y los antecedentes de exposición solar crónica (rayos UV), ¿cuál es el diagnóstico correcto?",
        "options": [
          "Pingüécula",
          "Pterigión",
          "Queratocono",
          "Pannus corneal"
        ],
        "answerIndex": 1,
        "explanation": "El pterigión se distingue clásicamente por ser un crecimiento fibrovascular carnoso y triangular que invade la córnea cruzando el limbo esclerocorneal, altamente asociado a la exposición crónica a luz ultravioleta, viento y polvo (común en trabajadores del campo). La pingüécula es un depósito amarillento benigno en la conjuntiva que nunca invade la córnea.",
        "gpcReference": ""
      },
      {
        "question": "Según la GPC, ¿cuál es la técnica quirúrgica de elección que ofrece la menor tasa de recidiva cuando este padecimiento amenaza el eje visual o causa astigmatismo significativo?",
        "options": [
          "Escisión simple dejando la esclera desnuda",
          "Radioterapia con estroncio-90",
          "Resección del pterigión con autoinjerto conjuntival",
          "Aplicación de mitomicina C tópica exclusiva"
        ],
        "answerIndex": 2,
        "explanation": "La GPC y los consensos oftalmológicos indican que la resección del pterigión combinada con la colocación de un autoinjerto conjuntival (tomado del mismo ojo, generalmente de la región bulbar superior) es el estándar de oro quirúrgico, ya que reduce la tasa de recurrencia a menos del 5%, en comparación con tasas de hasta el 80% con la técnica de escisión simple (esclera desnuda).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Intoxicaciones",
    "subtema": "Toxíndromes (Colinérgico / Organofosforados)",
    "difficulty": "Media",
    "case": "Masculino de 35 años es traído a urgencias en estado de confusión mental. Sus compañeros de trabajo refieren que se encontraba fumigando cultivos con un plaguicida sin utilizar equipo de protección personal. A su ingreso: TA 90/50 mmHg, FC 45 lpm (bradicardia), FR 28 rpm. A la exploración física destaca sialorrea profusa, lagrimeo, diaforesis, broncorrea y fasciculaciones musculares en extremidades. A la exploración pupilar se observan pupilas puntiformes (miosis bilateral) arreactivas. El aliento del paciente despide un olor a ajo.",
    "questions": [
      {
        "question": "El cuadro clínico florido corresponde a un síndrome colinérgico por inhibición irreversible de la acetilcolinesterasa. ¿Qué tipo de sustancias químicas producen clásicamente este toxíndrome con olor a ajo?",
        "options": [
          "Carbamatos",
          "Organofosforados",
          "Antidepresivos tricíclicos",
          "Opiáceos"
        ],
        "answerIndex": 1,
        "explanation": "Los plaguicidas organofosforados se unen de manera irreversible a la enzima acetilcolinesterasa, provocando una sobreestimulación continua de los receptores muscarínicos (bradicardia, miosis, lagrimeo, salivación, broncorrea) y nicotínicos (fasciculaciones musculares, debilidad). El olor a ajo es un signo clínico clásico en la intoxicación aguda por estos compuestos.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el antídoto de primera línea que debe administrarse de inmediato para revertir los síntomas muscarínicos (principalmente la broncorrea y la bradicardia) que amenazan la vida?",
        "options": [
          "Flumazenilo",
          "Naloxona",
          "Sulfato de Atropina",
          "Bicarbonato de sodio"
        ],
        "answerIndex": 2,
        "explanation": "La Atropina (un antagonista competitivo de los receptores muscarínicos) es el fármaco salvavidas y de primera elección para revertir los efectos muscarínicos peligrosos (bradicardia severa, broncoespasmo y broncorrea excesiva) en la intoxicación por organofosforados. La dosis se titula hasta lograr la \"atropinización\" (secreciones bronquiales secas, frecuencia cardíaca normal y resolución de la miosis). Para los síntomas nicotínicos (fasciculaciones) se utilizan las oximas (Pralidoxima).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología Biliar",
    "subtema": "Colangitis aguda",
    "difficulty": "Alta",
    "case": "Femenina de 60 años con antecedente de colelitiasis asintomática. Es traída a urgencias por sus familiares debido a deterioro neurológico (tendencia a la somnolencia y confusión) de 12 horas de evolución. Refieren que un día previo inició con dolor abdominal intenso en hipocondrio derecho y picos febriles. A la exploración física: TA 85/50 mmHg, FC 120 lpm, FR 24 rpm, Temperatura 39.1°C. Destaca ictericia generalizada en piel y escleras. Abdomen doloroso en cuadrante superior derecho, sin franco rebote. Laboratorios: Leucocitosis de 22,000/mm³, Bilirrubina Total 8.5 mg/dL (a expensas de la directa), Fosfatasa Alcalina 650 U/L.",
    "questions": [
      {
        "question": "La paciente presenta ictericia, dolor abdominal, fiebre, hipotensión y alteración del estado mental. ¿Qué nombre recibe este conjunto de signos clínicos?",
        "options": [
          "Tríada de Charcot",
          "Tríada de Murphy",
          "Péntada de Reynolds",
          "Criterios de Ranson"
        ],
        "answerIndex": 2,
        "explanation": "La péntada de Reynolds indica una colangitis aguda severa supurativa o tóxica con inminente choque séptico. Consiste en la suma de la Tríada de Charcot (ictericia, dolor en cuadrante superior derecho y fiebre/escalofríos) más hipotensión (choque) y alteración del estado mental.",
        "gpcReference": ""
      },
      {
        "question": "Según la GPC y los Criterios de Tokio, ante una colangitis aguda severa (Grado III) con inestabilidad hemodinámica, ¿cuál es el estándar de oro diagnóstico y terapéutico que debe realizarse de urgencia una vez iniciada la reanimación hídrica y antibiótica?",
        "options": [
          "Colecistectomía laparoscópica de urgencia",
          "Colangiopancreatografía Retrógrada Endoscópica (CPRE) con esfinterotomía y drenaje",
          "Exploración abierta de vías biliares con colocación de sonda en T",
          "Drenaje percutáneo transhepático exclusivamente"
        ],
        "answerIndex": 1,
        "explanation": "La descompresión urgente de la vía biliar es el tratamiento definitivo para salvar la vida del paciente. La CPRE es el procedimiento de elección porque es menos invasivo que la cirugía abierta y permite tanto confirmar el diagnóstico anatómico (colangiografía) como realizar el tratamiento definitivo en el mismo tiempo (extracción de litos, esfinterotomía o colocación de stents).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología arterial y venosa",
    "subtema": "Enfermedad Arterial Periférica (EAP)",
    "difficulty": "Media",
    "case": "Masculino de 65 años, tabaquismo positivo a razón de 1 cajetilla diaria desde hace 30 años, hipertenso y dislipidémico. Acude a consulta por referir dolor tipo calambre en la pantorrilla derecha que aparece invariablemente al caminar aproximadamente 200 metros (claudicación intermitente) y que cede tras 5 minutos de reposo. A la exploración física, las extremidades inferiores presentan piel delgada, brillante, con pérdida de vello distal. Los pulsos pedio y tibial posterior de la extremidad derecha se palpan francamente disminuidos en comparación con la izquierda. Se observa palidez de la extremidad al elevarla a 60 grados.",
    "questions": [
      {
        "question": "De acuerdo con la GPC, ¿cuál es el método diagnóstico inicial de elección en el consultorio para confirmar la presencia de isquemia en las extremidades inferiores?",
        "options": [
          "Angiotomografía computarizada",
          "Arteriografía con sustracción digital",
          "Índice Tobillo-Brazo (ITB) con doppler lineal",
          "Pletismografía"
        ],
        "answerIndex": 2,
        "explanation": "El Índice Tobillo-Brazo (ITB) es el estudio inicial no invasivo de elección para el diagnóstico de EAP. Un ITB normal es de 0.91 a 1.30. Un valor ≤ 0.90 es diagnóstico de Enfermedad Arterial Periférica y se asocia fuertemente con un mayor riesgo de morbimortalidad cardiovascular.",
        "gpcReference": ""
      },
      {
        "question": "Aunado a la modificación de factores de riesgo (suspensión del tabaquismo) y a un programa de ejercicio supervisado, ¿cuál es el fármaco de primera línea recomendado por la GPC para mejorar los síntomas de claudicación intermitente y aumentar la distancia de caminata?",
        "options": [
          "Cilostazol",
          "Pentoxifilina",
          "Diosmina",
          "Ácido acetilsalicílico a dosis altas"
        ],
        "answerIndex": 0,
        "explanation": "El Cilostazol (inhibidor de la fosfodiesterasa III con propiedades vasodilatadoras y antiagregantes) es el tratamiento farmacológico de primera línea y el que cuenta con mayor evidencia en la GPC para mejorar los síntomas y la distancia de claudicación en pacientes con EAP. La aspirina se da como prevención cardiovascular, pero no mejora los síntomas de claudicación, y la pentoxifilina ha demostrado menor eficacia que el cilostazol.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Urología P1",
    "subtema": "Pielonefritis aguda",
    "difficulty": "Baja",
    "case": "Femenina de 28 años, sin antecedentes de importancia, acude a urgencias por presentar fiebre de 38.8°C, escalofríos intensos y dolor constante en la región lumbar derecha de 2 días de evolución. Refiere que hace 5 días presentó ardor al orinar (disuria) y aumento en la frecuencia miccional, síntomas a los que no dio importancia. A la exploración física se encuentra taquicárdica (110 lpm), con abdomen blando pero doloroso a la palpación profunda en flanco derecho. La maniobra de Giordano (puñopercusión) es francamente positiva del lado derecho. Examen general de orina: leucocitos >50 por campo, nitritos positivos, bacterias abundantes.",
    "questions": [
      {
        "question": "Con base en la epidemiología en pacientes sin anormalidades estructurales del tracto urinario, ¿cuál es el agente etiológico responsable de la gran mayoría de estos cuadros?",
        "options": [
          "Klebsiella pneumoniae",
          "Proteus mirabilis",
          "Pseudomonas aeruginosa",
          "Escherichia coli"
        ],
        "answerIndex": 3,
        "explanation": "Escherichia coli uropatógena es el agente causal responsable de más del 80% de las infecciones de vías urinarias altas (pielonefritis) y bajas (cistitis) no complicadas adquiridas en la comunidad.",
        "gpcReference": ""
      },
      {
        "question": "Según la GPC mexicana, considerando a la paciente estable, tolerando la vía oral y sin criterios de hospitalización (pielonefritis no complicada), ¿cuál es el tratamiento antimicrobiano empírico ambulatorio de primera línea vía oral?",
        "options": [
          "Amoxicilina sola por 7 días",
          "Nitrofurantoína por 5 días",
          "Fluoroquinolonas (Ciprofloxacino o Levofloxacino) por 7 días",
          "Fosfomicina trometamol dosis única"
        ],
        "answerIndex": 2,
        "explanation": "Las fluoroquinolonas (como ciprofloxacino) son recomendadas por la GPC como tratamiento empírico de primera línea por vía oral para la pielonefritis aguda no complicada en el manejo ambulatorio, debido a su excelente penetración en el parénquima renal. La nitrofurantoína y la fosfomicina alcanzan excelentes niveles en vejiga, por lo que son útiles en cistitis, pero no logran concentraciones tisulares adecuadas en el riñón para tratar una pielonefritis.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología cámara anterior",
    "subtema": "Conjuntivitis alérgica",
    "difficulty": "Media",
    "case": "Masculino de 12 años, con antecedente personal de asma y rinitis alérgica. Es llevado a la consulta oftalmológica por su madre debido a que el niño se frota los ojos constantemente. Presenta hiperemia conjuntival bilateral, lagrimeo y secreción ocular hialina (acuosa y transparente) de 1 semana de evolución, la cual empeora al jugar en el parque. A la exploración en lámpara de hendidura, se observa hiperemia conjuntival moderada y en la eversión del párpado superior se aprecian múltiples formaciones sobreelevadas con aspecto de \"empedrado\" (reacción papilar).",
    "questions": [
      {
        "question": "Dentro del cuadro clínico descrito, ¿cuál es el síntoma cardinal y patognomónico que orienta fuertemente hacia la etiología alérgica de esta conjuntivitis por encima de una etiología viral o bacteriana?",
        "options": [
          "Ojo rojo (hiperemia)",
          "Prurito ocular intenso",
          "Sensación de cuerpo extraño",
          "Fotofobia"
        ],
        "answerIndex": 1,
        "explanation": "El prurito ocular (comezón) intenso y constante es el síntoma cardinal y más distintivo de la conjuntivitis alérgica, mediado por la degranulación de histamina de los mastocitos. En las etiologías bacterianas predomina la secreción purulenta y en las virales la sensación de arenilla y ganglios preauriculares, pero rara vez se quejan de un prurito tan intenso.",
        "gpcReference": ""
      },
      {
        "question": "De acuerdo con las recomendaciones oftalmológicas de la GPC, ¿cuál es el tratamiento farmacológico tópico de elección (doble acción) para el manejo a largo plazo y control de crisis de este padecimiento?",
        "options": [
          "Antibióticos tópicos (Tobramicina)",
          "Corticoides tópicos (Dexametasona) de uso libre",
          "Antihistamínicos tópicos con efecto estabilizador de mastocitos (Olopatadina)",
          "Lágrimas artificiales exclusivamente"
        ],
        "answerIndex": 2,
        "explanation": "La Olopatadina (y otros fármacos de doble acción como el ketotifeno) son el tratamiento de primera línea, ya que actúan bloqueando los receptores H1 (alivio rápido del prurito) y estabilizando la membrana del mastocito (prevención a largo plazo). Los corticoides tópicos son altamente eficaces, pero deben usarse por periodos muy cortos y bajo estricta vigilancia oftalmológica debido al riesgo de inducir glaucoma y cataratas. Se abrirá en una ventana nueva Shutterstock This Is Use For Explain And Compare When The Head Of The Humerus Is Out Of The Shoulder Joint Includ",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología de extremidad superior",
    "subtema": "Luxación glenohumeral anterior",
    "difficulty": "Baja",
    "case": "Masculino de 20 años acude a urgencias tras sufrir una caída apoyando la mano derecha con el brazo en extensión, abducción y rotación externa durante un partido de baloncesto. Presenta dolor incapacitante en el hombro derecho. A la inspección, el paciente sostiene el brazo afectado con la mano contralateral (posición de Dessault), se observa el hombro derecho con pérdida de la redondez normal, prominencia del acromion (deformidad en \"charretera\") y el brazo se encuentra fijo en ligera abducción y rotación externa, con imposibilidad para tocar su hombro contralateral con la mano afectada.",
    "questions": [
      {
        "question": "Por el mecanismo de lesión y la posición clínica clásica descrita, ¿cuál es el tipo de luxación de hombro más frecuente que presenta este paciente?",
        "options": [
          "Luxación glenohumeral posterior",
          "Luxación acromioclavicular",
          "Luxación glenohumeral anterior",
          "Luxación esternoclavicular"
        ],
        "answerIndex": 2,
        "explanation": "La luxación anterior representa el 95% de todas las luxaciones del hombro. El mecanismo clásico es el trauma con el brazo en abducción y rotación externa. La deformidad en \"charretera\" (hombro cuadrado por vacío de la cavidad glenoidea y prominencia del acromion) es el signo clínico patognomónico.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la complicación neurológica más comúnmente asociada a este tipo de luxación, que debe evaluarse sistemáticamente revisando la sensibilidad de la cara lateral del hombro (zona del deltoides) antes y después de la reducción?",
        "options": [
          "Lesión del nervio mediano",
          "Lesión del nervio radial",
          "Lesión del nervio axilar (circunflejo)",
          "Lesión del nervio musculocutáneo"
        ],
        "answerIndex": 2,
        "explanation": "El nervio axilar (circunflejo) discurre justo por debajo de la cápsula inferior de la articulación glenohumeral y rodea el cuello quirúrgico del húmero, haciéndolo extremadamente vulnerable al estiramiento cuando la cabeza humeral se desplaza anterior e inferiormente. Su lesión produce anestesia en el área del deltoides (signo de la \"charretera sensitiva\") y debilidad para la abducción posterior a la curación.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Cirugía Oncológica",
    "subtema": "Cáncer Renal",
    "difficulty": "Alta",
    "case": "Masculino de 62 años, con antecedente de tabaquismo intenso (índice tabáquico de 30 paquetes/año). Acude a consulta externa refiriendo la presencia de orina con sangre (hematuria macroscópica) de forma intermitente desde hace 3 semanas, indolora. Además, refiere dolor sordo y constante en la fosa lumbar derecha y pérdida de peso no intencionada de 5 kg. A la exploración física, sus signos vitales son normales, pero a la palpación profunda del abdomen se detecta una masa firme en el flanco derecho. Se observa la presencia de un varicocele derecho que no se vacía al colocar al paciente en decúbito supino.",
    "questions": [
      {
        "question": "La presentación clínica de este paciente incluye la tríada clásica de esta neoplasia, aunque se presenta en una minoría de los casos. ¿Cuáles son los componentes de esta tríada?",
        "options": [
          "Hematuria, dolor en flanco y masa palpable",
          "Hematuria, fiebre y pérdida de peso",
          "Dolor lumbar, masa palpable e hipertensión arterial",
          "Hematuria, varicocele de reciente inicio y anemia"
        ],
        "answerIndex": 0,
        "explanation": "La tríada clásica del carcinoma de células renales (cáncer renal) consiste en hematuria macroscópica, dolor en el flanco y masa abdominal palpable. Sin embargo, esta tríada completa se presenta en menos del 10% de los pacientes y suele indicar enfermedad avanzada. El varicocele derecho de reciente inicio que no colapsa sugiere invasión u oclusión de la vena cava inferior o la vena renal por un trombo tumoral.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el estudio de imagen de elección para el diagnóstico, estadificación y planeación quirúrgica de este tumor?",
        "options": [
          "Ultrasonido renal doppler",
          "Urografía excretora",
          "Tomografía computarizada (UroTAC) de abdomen y pelvis con contraste intravenoso",
          "Resonancia magnética de columna lumbar"
        ],
        "answerIndex": 2,
        "explanation": "La Tomografía Computarizada (UroTAC) contrastada en fases simple, corticomedular, nefrográfica y excretora es el estándar de oro diagnóstico. Permite evaluar la extensión local del tumor, la afectación de ganglios linfáticos, la invasión a la vena renal o cava inferior (trombo tumoral) y el estado del riñón contralateral.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología cámara posterior",
    "subtema": "Catarata",
    "difficulty": "Baja",
    "case": "Femenina de 72 años, con antecedente de diabetes mellitus tipo 2 de 15 años de evolución. Acude a oftalmología quejándose de disminución progresiva, indolora y bilateral de la agudeza visual de 2 años de evolución, la cual describe como \"ver a través de un vidrio empañado\". Refiere que últimamente las luces de los autos le deslumbran mucho por la noche (halos). A la exploración oftalmológica, la agudeza visual es de 20/100 en el ojo derecho y 20/80 en el izquierdo. A la iluminación oblicua se observa una opacidad blanquecina en el área pupilar y a la oftalmoscopia directa hay ausencia del reflejo rojo de fondo.",
    "questions": [
      {
        "question": "De acuerdo con la clínica y la exploración física, ¿cuál es el diagnóstico más probable?",
        "options": [
          "Glaucoma crónico de ángulo abierto",
          "Degeneración macular asociada a la edad",
          "Catarata senil",
          "Retinopatía diabética proliferativa"
        ],
        "answerIndex": 2,
        "explanation": "La disminución progresiva e indolora de la agudeza visual, acompañada de deslumbramiento (glare) nocturno, opacidad cristaliniana visible (leucocoria) y disminución o ausencia del reflejo rojo, conforman el cuadro clínico clásico de la catarata senil. La retinopatía diabética no causa opacidad de los medios transparentes a menos que haya una hemorragia vítrea (que sería súbita).",
        "gpcReference": ""
      },
      {
        "question": "Según la GPC, ¿cuál es la técnica quirúrgica de elección para el tratamiento definitivo de esta patología y la rehabilitación visual de la paciente?",
        "options": [
          "Extracción extracapsular del cristalino con incisión amplia",
          "Facoemulsificación con colocación de lente intraocular",
          "Vitrectomía vía pars plana",
          "Trabeculectomía"
        ],
        "answerIndex": 1,
        "explanation": "La facoemulsificación (fragmentación del cristalino opaco mediante ultrasonido a través de una microincisión) seguida de la implantación de un lente intraocular (LIO) plegable es el estándar de oro quirúrgico actual. Ofrece una recuperación visual mucho más rápida y menor astigmatismo postoperatorio en comparación con la técnica extracapsular manual tradicional.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Urología P1",
    "subtema": "Infección de vías urinarias bajas (Cistitis aguda)",
    "difficulty": "Baja",
    "case": "Femenina de 24 años, con vida sexual activa, acude a la consulta de medicina familiar refiriendo un cuadro de 24 horas de evolución caracterizado por ardor intenso al orinar (disuria), necesidad urgente de ir al baño (urgencia miccional) y aumento en la frecuencia (polaquiuria), orinando en escasa cantidad. Refiere dolor leve en hipogastrio. Niega fiebre, escalofríos, flujo vaginal o dolor lumbar. A la exploración física, signos vitales normales, puñopercusión lumbar bilateral negativa, dolor leve a la palpación en región suprapúbica. Examen general de orina con tira reactiva: leucocitos esterasa +, nitritos +, eritrocitos +.",
    "questions": [
      {
        "question": "Tomando en cuenta la presentación clínica de cistitis aguda no complicada en una mujer joven, ¿cuál es el agente bacteriano responsable en la gran mayoría (75-90%) de estos episodios?",
        "options": [
          "Proteus mirabilis",
          "Klebsiella pneumoniae",
          "Staphylococcus saprophyticus",
          "Escherichia coli"
        ],
        "answerIndex": 3,
        "explanation": "Escherichia coli uropatógena es, por mucho, el agente etiológico más frecuente de la cistitis aguda no complicada en mujeres jóvenes. Staphylococcus saprophyticus es la segunda causa en mujeres jóvenes con vida sexual activa, pero su frecuencia es mucho menor (5-15%).",
        "gpcReference": ""
      },
      {
        "question": "Según la GPC mexicana, debido a las crecientes tasas de resistencia a fármacos clásicos, ¿cuál de los siguientes es el tratamiento antibiótico empírico de primera línea recomendado por vía oral para esta paciente?",
        "options": [
          "Fosfomicina trometamol (dosis única) o Nitrofurantoína (por 5-7 días)",
          "Ciprofloxacino por 3 días",
          "Amoxicilina por 7 días",
          "Ceftriaxona intramuscular dosis única"
        ],
        "answerIndex": 0,
        "explanation": "La GPC recomienda el uso de Fosfomicina trometamol (3g en dosis única) o Nitrofurantoína (100 mg c/12h por 5-7 días) como primera línea para la cistitis aguda no complicada en mujeres. El uso de fluoroquinolonas (ciprofloxacino) ya no se recomienda como primera línea empírica para cistitis debido al aumento de la resistencia bacteriana y sus efectos adversos, reservándose para pielonefritis o infecciones complicadas.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología Infecciosa / Rinología y faringe",
    "subtema": "Síndrome de Apnea Obstructiva del Sueño (SAOS)",
    "difficulty": "Media",
    "case": "Masculino de 50 años, con obesidad grado II (IMC 36 kg/m²) e hipertensión arterial de difícil control. Acude a consulta llevado por su esposa, quien refiere que el paciente ronca muy fuerte todas las noches y presenta pausas en la respiración de hasta 20 segundos, seguidas de un resoplido violento. El paciente refiere sentirse exhausto durante el día, quedándose dormido con facilidad en la sala de espera, viendo la televisión e incluso ha tenido episodios de somnolencia al conducir. Su puntuación en la escala de Epworth es de 16 (somnolencia diurna severa).",
    "questions": [
      {
        "question": "¿Cuál es el estudio considerado el estándar de oro por la GPC para confirmar el diagnóstico y clasificar la severidad de esta enfermedad?",
        "options": [
          "Oximetría de pulso nocturna",
          "Polisomnografía nocturna en laboratorio de sueño",
          "Nasofibrolaringoscopia",
          "Tomografía de cuello y vía aérea"
        ],
        "answerIndex": 1,
        "explanation": "La polisomnografía nocturna de canal completo es el estándar de oro. Permite documentar el Índice de Apnea-Hipopnea (IAH), confirmando el diagnóstico (IAH > 5 eventos/hora con síntomas, o > 15 eventos/hora sin síntomas) y estratificando la severidad (leve 5-14, moderado 15-30, severo >30).",
        "gpcReference": ""
      },
      {
        "question": "Además de las medidas higiénico-dietéticas (pérdida de peso significativa e higiene del sueño), ¿cuál es el tratamiento de elección inicial con mayor eficacia para un paciente con SAOS moderado a severo?",
        "options": [
          "Uvulopalatofaringoplastia (UPPP) quirúrgica",
          "Dispositivos de avance mandibular",
          "Presión Positiva Continua en la Vía Aérea (CPAP) nocturna",
          "Oxígeno suplementario a 2 litros por minuto"
        ],
        "answerIndex": 2,
        "explanation": "El uso de CPAP (Continuous Positive Airway Pressure) es el tratamiento de primera línea y el estándar de oro para el SAOS moderado y severo. Actúa como una férula neumática que mantiene abierta la vía aérea colapsable durante el sueño, eliminando las apneas, mejorando la arquitectura del sueño y controlando el riesgo cardiovascular asociado (como su hipertensión de difícil control).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología Biliar",
    "subtema": "Colelitiasis sintomática",
    "difficulty": "Media",
    "case": "Femenina de 42 años, multípara, con sobrepeso. Acude a consulta externa refiriendo episodios recurrentes de dolor en el cuadrante superior derecho del abdomen. Relata que los episodios de dolor suelen iniciar de 30 a 60 minutos después de ingerir comidas ricas en grasas (tacos, lácteos enteros), son de tipo cólico, se irradian hacia el omóplato derecho y están acompañados de náuseas. El dolor alcanza una intensidad máxima sostenida y luego desaparece por completo tras 3 a 4 horas. Entre episodios, la paciente se encuentra totalmente asintomática. Niega haber presentado fiebre o coloración amarilla en los ojos (ictericia). Sus estudios de laboratorio en el momento de la consulta son completamente normales, sin leucocitosis ni alteración en las pruebas de función hepática.",
    "questions": [
      {
        "question": "Con base en la clínica descrita, que corresponde a un cólico biliar típico sin datos de complicación, ¿cuál es el estudio de imagen de primera elección para documentar la presencia de la patología subyacente?",
        "options": [
          "Tomografía computarizada de abdomen simple",
          "Resonancia magnética de vías biliares (ColangioRM)",
          "Ultrasonido hepatobiliar de cuadrante superior derecho",
          "Radiografía simple de abdomen en bipedestación"
        ],
        "answerIndex": 2,
        "explanation": "El ultrasonido es el estudio de primera elección por su excelente sensibilidad (>95%) y especificidad para la detección de litos vesiculares. Los hallazgos patognomónicos de colelitiasis son la presencia de imágenes hiperecogénicas móviles dentro de la vesícula biliar que proyectan una sombra acústica posterior. La TAC y la radiografía son malas opciones porque la mayoría de los litos biliares son de colesterol y, por lo tanto, radiolúcidos.",
        "gpcReference": ""
      },
      {
        "question": "Dado que la paciente presenta enfermedad litiásica sintomática recurrente (cólico biliar), ¿cuál es la recomendación terapéutica definitiva según la GPC para prevenir futuras complicaciones (como colecistitis aguda, coledocolitiasis o pancreatitis)?",
        "options": [
          "Terapia de disolución oral con ácido ursodesoxicólico de por vida",
          "Litotricia extracorpórea por ondas de choque",
          "Manejo expectante y dieta baja en grasas exclusivamente",
          "Colecistectomía laparoscópica electiva"
        ],
        "answerIndex": 3,
        "explanation": "La GPC establece que la presencia de colelitiasis sintomática (cólico biliar recurrente) es la principal indicación para programar una colecistectomía laparoscópica de forma electiva. Esto previene eficazmente la progresión hacia complicaciones mayores agudas, las cuales aumentan significativamente la morbimortalidad de los pacientes. Las terapias de disolución oral o litotricia están obsoletas en la práctica general debido a su altísima tasa de recurrencia.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Mordeduras y picaduras",
    "subtema": "Loxoscelismo (Araña violinista)",
    "difficulty": "Alta",
    "case": "Femenina de 34 años acude a urgencias por presentar una lesión dolorosa en el muslo derecho de 48 horas de evolución. Refiere haber sentido un \"piquete\" leve e indoloro inicial mientras se ponía un pantalón que llevaba meses guardado en el clóset. A la exploración física, signos vitales: T 38.5°C, FC 110 lpm. En la cara anterior del muslo se observa una lesión caracterizada por una úlcera necrótica central de bordes irregulares, rodeada por un halo isquémico pálido y un eritema periférico (placa livedoide o \"signo de la bandera francesa\"). La paciente refiere orina oscura (coluria). Laboratorios revelan anemia, elevación de bilirrubina indirecta y creatinina en 2.1 mg/dL.",
    "questions": [
      {
        "question": "De acuerdo con la presentación clínica de la lesión cutánea (placa livedoide) y el mecanismo, ¿cuál es el agente causal más probable?",
        "options": [
          "Latrodectus mactans (Viuda negra)",
          "Centruroides spp. (Alacrán)",
          "Loxosceles reclusa / laeta (Araña violinista o del rincón)",
          "Micrurus spp. (Serpiente coralillo)"
        ],
        "answerIndex": 2,
        "explanation": "La mordedura por Loxosceles (loxoscelismo) típicamente ocurre en interiores oscuros (clósets, ropa guardada). Inicialmente es indolora, pero progresa a una lesión dermo-necrótica clásica con la \"placa livedoide\" (centro necrótico, halo isquémico pálido y halo eritematoso). Latrodectus (viuda negra) causa neurotoxicidad severa con dolor muscular intenso (abdomen en tabla), no necrosis cutánea.",
        "gpcReference": ""
      },
      {
        "question": "El cuadro de la paciente (fiebre, ictericia, coluria y falla renal aguda) corresponde a un loxoscelismo sistémico (visceral). ¿Cuál es el mecanismo fisiopatológico principal de esta complicación potencialmente letal?",
        "options": [
          "Bloqueo de la liberación de acetilcolina en la placa neuromuscular",
          "Hemólisis intravascular masiva mediada por la enzima esfingomielinasa D",
          "Depleción de factores de coagulación por coagulopatía de consumo",
          "Choque anafiláctico severo"
        ],
        "answerIndex": 1,
        "explanation": "La esfingomielinasa D es la principal enzima del veneno de la araña violinista. Además de causar la necrosis tisular local, al entrar a la circulación sistémica destruye las membranas de los eritrocitos, provocando hemólisis intravascular masiva, hemoglobinuria, y secundariamente, necrosis tubular aguda e insuficiencia renal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Tumores testiculares",
    "subtema": "",
    "difficulty": "Media",
    "case": "Masculino de 28 años, sin antecedentes crónicos, acude a la consulta externa refiriendo haber notado un aumento de volumen en su testículo derecho desde hace aproximadamente un mes. Refiere sensación de \"pesantez\" en el escroto, pero niega dolor, disuria o fiebre. A la exploración física se palpa el testículo derecho aumentado de tamaño, con una masa indurada, firme e indolora que no transilumina. El testículo izquierdo es de características normales. No se palpan adenopatías inguinales.",
    "questions": [
      {
        "question": "De acuerdo con la sospecha clínica de patología oncológica, ¿cuál es el estudio de imagen inicial de primera elección para confirmar la presencia y características de la masa?",
        "options": [
          "Tomografía computarizada pélvica",
          "Resonancia magnética de escroto",
          "Ultrasonido escrotal / testicular",
          "Gammagrafía testicular"
        ],
        "answerIndex": 2,
        "explanation": "El ultrasonido escrotal es el estudio de primera elección (estándar de oro inicial) para evaluar cualquier masa escrotal. Permite distinguir de forma rápida y con casi 100% de sensibilidad si la masa es intra o extratesticular, y si es quística o sólida. Toda masa intratesticular sólida y vascularizada en un adulto joven se considera cáncer testicular hasta demostrar lo contrario.",
        "gpcReference": ""
      },
      {
        "question": "Tras confirmar una masa intratesticular sospechosa, se programa al paciente para orquiectomía radical inguinal. ¿Cuál es la estirpe histológica más frecuente de los tumores germinales de testículo en este grupo de edad?",
        "options": [
          "Teratoma",
          "Seminoma",
          "Coriocarcinoma",
          "Tumor de saco vitelino"
        ],
        "answerIndex": 1,
        "explanation": "Aproximadamente el 95% de los tumores malignos de testículo son de células germinales. De estos, los tumores seminomatosos (Seminomas clásicos) son el subtipo histológico más frecuente en general (particularmente en la tercera y cuarta década de la vida). Responden de manera excelente a la radioterapia y quimioterapia, teniendo un alto índice de curación.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología cámara posterior",
    "subtema": "Retinopatía Diabética",
    "difficulty": "Alta",
    "case": "Masculino de 55 años, con diabetes mellitus tipo 2 de 15 años de evolución y mal control glucémico (HbA1c 9.5%). Acude a su revisión oftalmológica anual. Refiere ligera disminución de la agudeza visual central. A la exploración de fondo de ojo con pupila dilatada, se observan múltiples microaneurismas, hemorragias intrarretinianas en \"punto y mancha\" en los cuatro cuadrantes, exudados duros amarillentos y alteraciones venosas (arrosariamiento). No se observan vasos sanguíneos de neoformación en la papila ni en ninguna otra parte de la retina. Se abrirá en una ventana nueva Shutterstock",
    "questions": [
      {
        "question": "De acuerdo con la clasificación clínica internacional, ¿cuál es el diagnóstico oftalmológico correcto de este paciente?",
        "options": [
          "Retinopatía diabética no proliferativa leve",
          "Retinopatía diabética proliferativa",
          "Retinopatía diabética no proliferativa severa",
          "Obstrucción de la vena central de la retina"
        ],
        "answerIndex": 2,
        "explanation": "La ausencia de neovascularización (vasos de neoformación) descarta la etapa proliferativa. La presencia de hemorragias intrarretinianas severas en los 4 cuadrantes (regla del 4-2-1 de la clasificación) la sitúa en una retinopatía diabética no proliferativa SEVERA, la cual tiene un riesgo muy alto de progresar a la fase proliferativa en el corto plazo.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la causa más frecuente de pérdida de la visión central en pacientes con retinopatía diabética de cualquier estadio clínico?",
        "options": [
          "Hemorragia vítrea",
          "Desprendimiento de retina traccional",
          "Edema macular diabético",
          "Glaucoma neovascular"
        ],
        "answerIndex": 2,
        "explanation": "El edema macular diabético (acumulación de líquido y proteínas en la mácula debido al aumento de la permeabilidad vascular) es la principal causa de disminución de la agudeza visual en los pacientes diabéticos. Puede presentarse en cualquier fase de la enfermedad, tanto en la retinopatía no proliferativa como en la proliferativa.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología infecciosa / Rinología y faringe",
    "subtema": "OMA (Otitis Media Aguda)",
    "difficulty": "Baja",
    "case": "Preescolar masculino de 4 años, llevado a consulta por su madre debido a que presenta llanto constante, irritabilidad y se lleva la mano a la oreja derecha repetidamente. La madre refiere que el cuadro inició anoche, acompañado de fiebre de 39°C. Hace 5 días inició con un cuadro de escurrimiento nasal hialino y tos seca. A la otoscopia del oído derecho se observa la membrana timpánica intensamente eritematosa, abombada (pérdida del triángulo luminoso y relieves óseos) y con inmovilidad a la insuflación neumática.",
    "questions": [
      {
        "question": "Tomando en cuenta la edad del paciente y el antecedente de infección de vías respiratorias superiores, ¿cuáles son los dos agentes etiológicos bacterianos más frecuentemente implicados en esta patología?",
        "options": [
          "Pseudomonas aeruginosa y Staphylococcus aureus",
          "Streptococcus pneumoniae y Haemophilus influenzae no tipificable",
          "Moraxella catarrhalis y Escherichia coli",
          "Mycoplasma pneumoniae y Chlamydia trachomatis"
        ],
        "answerIndex": 1,
        "explanation": "Streptococcus pneumoniae y Haemophilus influenzae no tipificable son los patógenos responsables de la gran mayoría de las otitis medias agudas bacterianas en la población pediátrica. Moraxella catarrhalis ocupa el tercer lugar.",
        "gpcReference": ""
      },
      {
        "question": "Según la GPC mexicana, ¿cuál es el tratamiento antimicrobiano de primera elección para este paciente sin antecedentes de alergias o uso de antibióticos en el último mes?",
        "options": [
          "Azitromicina",
          "Cefixima",
          "Amoxicilina a dosis altas (80-90 mg/kg/día)",
          "Trimetoprima/Sulfametoxazol"
        ],
        "answerIndex": 2,
        "explanation": "La Amoxicilina a dosis altas sigue siendo el tratamiento empírico de primera línea recomendado para la Otitis Media Aguda no complicada, ya que cubre adecuadamente a las cepas de neumococo de susceptibilidad intermedia. El ácido clavulánico se añade si hay falla terapéutica a las 72 horas, conjuntivitis purulenta concomitante o uso de antibióticos recientes.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Cirrosis y sus complicaciones",
    "subtema": "Peritonitis Bacteriana Espontánea (PBE)",
    "difficulty": "Alta",
    "case": "Masculino de 62 años, conocido con cirrosis hepática de etiología alcohólica (Child-Pugh C) y ascitis crónica. Es traído a urgencias por sus familiares debido a que notan alteraciones del ciclo sueño- vigilia, confusión y desorientación desde ayer. A su ingreso, presenta T 38.2°C, FC 105 lpm. Exploración física: paciente ictérico, con asterixis (flapping tremor) presente, abdomen globoso a expensas de líquido ascítico a tensión, con red venosa colateral, doloroso a la palpación generalizada, pero sin resistencia muscular franca. Se realiza paracentesis diagnóstica de urgencia en el cuadrante inferior izquierdo.",
    "questions": [
      {
        "question": "Tras el análisis citoquímico y citológico del líquido ascítico, ¿cuál es el criterio diagnóstico absoluto que confirma la Peritonitis Bacteriana Espontánea (PBE)?",
        "options": [
          "Proteínas totales < 1 g/dL",
          "Cultivo positivo para flora polimicrobiana",
          "Conteo de Leucocitos Polimorfonucleares (PMN) > 250 células/mm³",
          "Gradiente de albúmina suero-ascitis (GASA) > 1.1"
        ],
        "answerIndex": 2,
        "explanation": "El diagnóstico de certeza de la Peritonitis Bacteriana Espontánea (infección del líquido ascítico sin una fuente intraabdominal evidente) se establece con un recuento de polimorfonucleares (neutrófilos) igual o mayor a 250 células/mm³ en la muestra de líquido ascítico. Un GASA > 1.1 indica hipertensión portal (transudado), pero no es diagnóstico de infección.",
        "gpcReference": ""
      },
      {
        "question": "Una vez confirmado el diagnóstico y tomada la muestra para cultivo bacteriológico, ¿cuál es el tratamiento antibiótico empírico de primera línea que debe iniciarse inmediatamente según la GPC?",
        "options": [
          "Metronidazol IV",
          "Cefalosporinas de tercera generación (Cefotaxima o Ceftriaxona) IV",
          "Vancomicina IV",
          "Ciprofloxacino VO"
        ],
        "answerIndex": 1,
        "explanation": "Las cefalosporinas de tercera generación por vía intravenosa (Cefotaxima es la más estudiada y recomendada) son el tratamiento empírico de elección, ya que cubren excelentemente a las enterobacterias (E. coli, Klebsiella) que translocan desde el intestino y son responsables del >70% de las PBE. Se debe coadministrar albúmina humana intravenosa para reducir el riesgo de síndrome hepatorrenal secundario a la infección.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología Hepática",
    "subtema": "Absceso Hepático Amebiano",
    "difficulty": "Media",
    "case": "Masculino de 32 años, residente de zona rural, acude a urgencias por presentar cuadro de 2 semanas de evolución caracterizado por fiebre de predominio vespertino (38.5°C), diaforesis, pérdida de peso y dolor continuo en el hipocondrio derecho que se irradia hacia el hombro homolateral. Refiere haber presentado un episodio de diarrea disentérica hace un mes que remitió sin tratamiento. A la exploración física, el paciente luce agudamente enfermo, con palidez de tegumentos. El abdomen presenta hepatomegalia de 3 cm por debajo del reborde costal, extremadamente dolorosa a la palpación, y puñopercusión hepática positiva. Se realiza un ultrasonido abdominal que reporta una lesión quística única de 8 cm de diámetro en el lóbulo hepático derecho, de bordes bien definidos y contenido hipoecoico.",
    "questions": [
      {
        "question": "De acuerdo con la clínica y los hallazgos epidemiológicos de nuestro país, ¿cuál es el agente etiológico responsable de esta patología?",
        "options": [
          "Escherichia coli",
          "Echinococcus granulosus",
          "Entamoeba histolytica",
          "Klebsiella pneumoniae"
        ],
        "answerIndex": 2,
        "explanation": "El absceso hepático amebiano es la manifestación extraintestinal más común de la infección por Entamoeba histolytica. Típicamente se presenta en hombres jóvenes como una lesión única en el lóbulo hepático derecho (por el flujo portal preferencial). Los abscesos piógenos (E. coli, Klebsiella) suelen ser múltiples y se presentan en pacientes mayores o con patología biliar de base.",
        "gpcReference": ""
      },
      {
        "question": "Según la GPC, ¿cuál es el tratamiento farmacológico de primera elección para este paciente?",
        "options": [
          "Drenaje percutáneo inmediato",
          "Metronidazol oral o intravenoso",
          "Albendazol",
          "Ciprofloxacino más Ceftriaxona"
        ],
        "answerIndex": 1,
        "explanation": "La GPC establece que el tratamiento de primera línea y pilar fundamental para el absceso hepático amebiano no complicado es el uso de imidazoles (Metronidazol por 7 a 10 días), con una tasa de éxito médico superior al 90%. El drenaje percutáneo se reserva para abscesos con alto riesgo de ruptura (mayores a 5-10 cm en lóbulo izquierdo o cerca de la cápsula hepática) o falta de respuesta al tratamiento médico en 72 horas.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "ATLS P3",
    "subtema": "Trauma Genitourinario (Trauma uretral)",
    "difficulty": "Alta",
    "case": "Masculino de 35 años, trabajador de la construcción, sufre caída de un andamio a horcajadas (\"a caballo\") sobre un tubo de metal. Es llevado a urgencias refiriendo dolor perineal intenso e incapacidad para miccionar. A la exploración física, sus signos vitales se encuentran estables. Se observa un hematoma perineal extenso en forma de \"alas de mariposa\" que se extiende hacia el escroto. Se evidencia la presencia de una gota de sangre franca en el meato uretral (uretrorragia). A la palpación abdominal, se detecta una masa suprapúbica compatible con globo vesical.",
    "questions": [
      {
        "question": "Por el mecanismo de lesión (caída a horcajadas) y la distribución del hematoma, ¿cuál es el segmento anatómico del tracto urinario más probablemente lesionado?",
        "options": [
          "Uretra posterior (membranosa)",
          "Uretra anterior (bulbar)",
          "Vejiga (ruptura intraperitoneal)",
          "Uréter distal"
        ],
        "answerIndex": 1,
        "explanation": "La caída a horcajadas comprime la uretra bulbar (anterior) contra la sínfisis del pubis, causando su ruptura. El sangrado y la orina extravasada se limitan por la fascia de Colles, produciendo el clásico hematoma en \"alas de mariposa\" en el periné. Las lesiones de uretra posterior suelen asociarse a fracturas graves de la pelvis en accidentes de alta energía.",
        "gpcReference": ""
      },
      {
        "question": "Ante los hallazgos descritos, ¿cuál es la intervención médica que está absolutamente contraindicada en el manejo inicial de este paciente?",
        "options": [
          "Realizar una uretrografía retrógrada",
          "Colocación de una sonda vesical transuretral (Foley) a ciegas",
          "Colocación de una talla suprapúbica (cistostomía)",
          "Administración de analgesia intravenosa"
        ],
        "answerIndex": 1,
        "explanation": "La presencia de sangre en el meato uretral, la incapacidad para orinar, y el hematoma perineal son signos clásicos de lesión uretral. La introducción de una sonda transuretral (Foley) \"a ciegas\" está absolutamente contraindicada porque puede convertir un desgarro uretral parcial en una transección uretral completa. El abordaje diagnóstico correcto exige realizar primero una uretrografía retrógrada para evaluar la integridad del conducto.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Quemaduras / Golpe de calor / Hipotermia",
    "subtema": "Golpe de Calor (Heat Stroke)",
    "difficulty": "Media",
    "case": "Masculino de 28 años, sin antecedentes de importancia, participa en una carrera de maratón al mediodía con una temperatura ambiente de 38°C y alta humedad. En el kilómetro 35, el paciente colapsa repentinamente. Es asistido por paramédicos quienes lo encuentran en estado de estupor, desorientado, con lenguaje incoherente. Sus signos vitales muestran una temperatura corporal central (rectal) de 41.2°C, FC 135 lpm, FR 28 rpm, TA 90/60 mmHg. A la exploración física, llama la atención que su piel se encuentra eritematosa, caliente y completamente seca (anhidrosis).",
    "questions": [
      {
        "question": "De acuerdo con la presentación clínica, ¿cuál es el diagnóstico que amenaza la vida del paciente?",
        "options": [
          "Agotamiento por calor (Heat exhaustion)",
          "Síncope por calor",
          "Golpe de calor clásico (Heat stroke)",
          "Hipertermia maligna"
        ],
        "answerIndex": 2,
        "explanation": "El golpe de calor es una emergencia médica caracterizada por la elevación extrema de la temperatura corporal central (>40.5°C) acompañada de alteraciones severas del sistema nervioso central (delirio, coma, convulsiones) y frecuentemente, aunque no siempre en el de esfuerzo, piel caliente y seca (fracaso de los mecanismos termorreguladores como la sudoración). El agotamiento por calor cursa con sudoración profusa y no presenta alteración neurológica severa.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la medida terapéutica inicial más importante y urgente que determina la supervivencia y el pronóstico neurológico de este paciente?",
        "options": [
          "Administración rápida de antipiréticos (Paracetamol IV a altas dosis)",
          "Enfriamiento rápido por medios físicos (inmersión en agua helada o evaporación)",
          "Intubación orotraqueal profiláctica",
          "Reanimación masiva con expansores plasmáticos (coloides)"
        ],
        "answerIndex": 1,
        "explanation": "La prioridad absoluta en el golpe de calor es disminuir la temperatura central por debajo de los 39°C lo más rápido posible, utilizando métodos físicos (inmersión en agua con hielo, rociar agua tibia y usar ventiladores potentes para favorecer la evaporación). Los antipiréticos convencionales (como el paracetamol o AINEs) son ineficaces porque el problema radica en el centro termorregulador que ha sido superado, no en pirógenos endógenos.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Cirugía Oncología",
    "subtema": "Cáncer de Esófago",
    "difficulty": "Alta",
    "case": "Masculino de 62 años, de nivel socioeconómico bajo, con antecedente de consumo de alcohol intenso (1 litro de aguardiente al día) y tabaquismo (2 cajetillas/día) por más de 30 años. Acude refiriendo dificultad progresiva para la deglución (disfagia) de 6 meses de evolución, que inició con sólidos (carnes, pan) y actualmente es incluso para líquidos. Refiere dolor retroesternal al tragar (odinofagia), sialorrea, episodios de regurgitación, cambios en el tono de la voz (ronquera) y una pérdida de peso no intencionada de 15 kg.",
    "questions": [
      {
        "question": "Por los factores de riesgo descritos (alcohol y tabaco crónicos) y la edad del paciente, ¿cuál es la estirpe histopatológica más probable de esta neoplasia que suele localizarse en el tercio medio o superior del esófago?",
        "options": [
          "Adenocarcinoma",
          "Carcinoma de células pequeñas",
          "Carcinoma epidermoide (células escamosas)",
          "Linfoma no Hodgkin"
        ],
        "answerIndex": 2,
        "explanation": "El carcinoma epidermoide o de células escamosas es el cáncer esofágico más frecuente en el mundo en vías de desarrollo, y está fuertemente vinculado al tabaquismo intenso, alcoholismo y consumo de bebidas muy calientes. Típicamente afecta los tercios superior y medio del esófago. El adenocarcinoma esofágico, por otro lado, se asocia estrechamente al reflujo gastroesofágico crónico (Esófago de Barrett) y a la obesidad, ubicándose casi siempre en el tercio inferior.",
        "gpcReference": ""
      },
      {
        "question": "La presencia de ronquera en este paciente es un signo de enfermedad localmente avanzada que indica mal pronóstico. ¿A qué estructura anatómica se debe la invasión tumoral causante de este síntoma?",
        "options": [
          "Tráquea membranosa",
          "Nervio laríngeo recurrente",
          "Músculo constrictor inferior de la faringe",
          "Arteria carótida común"
        ],
        "answerIndex": 1,
        "explanation": "La ronquera o disfonía en un paciente con cáncer de esófago tercio medio/superior es un signo clínico clásico de invasión directa del tumor al nervio laríngeo recurrente izquierdo (que transcurre en el surco traqueoesofágico). Esta invasión produce parálisis de las cuerdas vocales, y es un criterio de irresecabilidad en muchos casos.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología de Extremidad Inferior",
    "subtema": "Lesión de Ligamento Cruzado Anterior",
    "difficulty": "Baja",
    "case": "Femenina de 22 años, jugadora profesional de fútbol soccer. Durante un partido, al intentar cambiar de dirección rápidamente mientras corría, planta el pie derecho firmemente en el césped y realiza un giro brusco de la rodilla con una fuerza en valgo. Refiere haber escuchado y sentido un \"chasquido\" (pop) doloroso en la rodilla, con incapacidad inmediata para continuar jugando. Acude a urgencias 2 horas después con aumento de volumen severo de la rodilla derecha secundario a un derrame articular a tensión (hemartrosis aguda).",
    "questions": [
      {
        "question": "Durante la exploración física en el servicio de urgencias o en el consultorio, ¿cuál es la maniobra clínica más sensible (con mayor valor predictivo) para diagnosticar la lesión de esta estructura específica?",
        "options": [
          "Prueba de Lachman",
          "Prueba de McMurray",
          "Prueba de Apley",
          "Prueba del cajón posterior"
        ],
        "answerIndex": 0,
        "explanation": "La prueba de Lachman (evaluada con la rodilla en 20-30° de flexión estabilizando el fémur y traccionando la tibia anteriormente) es la maniobra exploratoria más sensible y específica para detectar la ruptura del ligamento cruzado anterior (LCA). Las pruebas de McMurray y Apley evalúan los meniscos, y el cajón posterior evalúa el ligamento cruzado posterior.",
        "gpcReference": ""
      },
      {
        "question": "Aunque el diagnóstico es eminentemente clínico, ¿cuál es el estudio de imagen considerado el estándar de oro no invasivo para confirmar la ruptura ligamentaria y evaluar lesiones meniscales o de cartílago asociadas?",
        "options": [
          "Radiografía simple de rodilla en cuatro proyecciones",
          "Ultrasonido musculoesquelético",
          "Tomografía axial computarizada de rodilla",
          "Resonancia magnética de rodilla"
        ],
        "answerIndex": 3,
        "explanation": "La Resonancia Magnética (RM) es el estudio de imagen de elección (estándar de oro no invasivo) para el abordaje de las lesiones de partes blandas de la rodilla (ligamentos cruzados, colaterales, meniscos y cartílago articular). Las radiografías simples son el primer estudio indicado solo para descartar avulsiones óseas (como la fractura de Segond) o fracturas de la meseta tibial.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Hernias",
    "subtema": "Hernia Femoral (Crural)",
    "difficulty": "Alta",
    "case": "Femenina de 75 años, multípara, acude a urgencias por presentar un cuadro de 12 horas de evolución caracterizado por dolor intenso en la región inguinal derecha, náuseas y vómito de contenido biliar. A la exploración física, se observa el abdomen distendido, timpánico y con peristalsis metálica. En la región inguinocrural derecha se palpa una tumoración de 3 cm, tensa, eritematosa, exquisitamente dolorosa a la palpación e irreductible. Se abrirá en una ventana nueva Shutterstock",
    "questions": [
      {
        "question": "Tomando en cuenta la anatomía de la región, ¿cuál es el límite superior (o anterior) del anillo por donde protruye este tipo de hernia que la diferencia clínicamente de una hernia inguinal?",
        "options": [
          "Ligamento de Cooper",
          "Ligamento lacunar (Gimbernat)",
          "Ligamento inguinal (Poupart)",
          "Vena femoral"
        ],
        "answerIndex": 2,
        "explanation": "Las hernias femorales o crurales protruyen a través del anillo femoral, el cual se ubica por debajo del ligamento inguinal (su límite anterior/superior). El límite medial es el ligamento lacunar, el posterior es el ligamento de Cooper y el lateral es la vena femoral. Clásicamente se presentan en mujeres mayores y tienen la tasa más alta de estrangulación (urgencia quirúrgica) debido a la rigidez de los bordes del anillo.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la técnica quirúrgica abierta clásica recomendada para la reparación tisular (sin malla) de este defecto, que aproxima el tendón conjunto al ligamento de Cooper?",
        "options": [
          "Técnica de Lichtenstein",
          "Técnica de McVay",
          "Técnica de Shouldice",
          "Técnica de Bassini"
        ],
        "answerIndex": 1,
        "explanation": "La técnica de McVay es la reparación tisular de elección para las hernias femorales (y una opción para hernias inguinales complejas), ya que cierra el anillo femoral al suturar el tendón conjunto (hoz inguinal) al ligamento pectíneo de Cooper. Lichtenstein, Shouldice y Bassini reparan defectos por encima del ligamento inguinal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología diverticular",
    "subtema": "Hemorragia diverticular",
    "difficulty": "Media",
    "case": "Masculino de 72 años, hipertenso, acude al servicio de urgencias refiriendo la evacuación súbita e indolora de abundante cantidad de sangre roja fresca con coágulos (hematoquecia) en dos ocasiones durante las últimas 3 horas. Niega dolor abdominal, fiebre, pérdida de peso o cambios previos en el hábito intestinal. A su ingreso: TA 110/70 mmHg, FC 95 lpm, FR 18 rpm. El abdomen es blando, depresible, sin dolor a la palpación y sin masas. Tacto rectal evidencia restos de sangre fresca, sin palparse tumoraciones.",
    "questions": [
      {
        "question": "De acuerdo con la epidemiología reportada en la GPC, ¿cuál es la causa más frecuente de sangrado de tubo digestivo bajo (STDB) masivo e indoloro en pacientes mayores de 60 años?",
        "options": [
          "Angiodisplasia colónica",
          "Cáncer colorrectal",
          "Enfermedad hemorroidal interna",
          "Enfermedad diverticular del colon"
        ],
        "answerIndex": 3,
        "explanation": "La diverticulosis colónica es la principal causa de sangrado de tubo digestivo bajo masivo en adultos mayores. Clásicamente se presenta como una rectorragia o hematoquecia súbita, abundante y completamente indolora. Las angiodisplasias son la segunda causa y suelen producir un sangrado más insidioso. El cáncer colorrectal produce sangrado microscópico (oculto) crónico, rara vez masivo de forma aguda.",
        "gpcReference": ""
      },
      {
        "question": "Estando el paciente hemodinámicamente estable tras la reanimación inicial, ¿cuál es el estudio de elección, tanto diagnóstico como terapéutico, a realizar en las primeras 24 horas?",
        "options": [
          "Angiografía mesentérica",
          "Gammagrafía con eritrocitos marcados",
          "Colonoscopia",
          "Colectomía subtotal de urgencia"
        ],
        "answerIndex": 2,
        "explanation": "La colonoscopia es el estudio de primera línea para evaluar el STDB en pacientes hemodinámicamente estables. Permite localizar el sitio de sangrado (hasta en un 70% de los casos) y realizar maniobras hemostáticas directas (inyección de epinefrina, clips o coagulación térmica). La angiografía se reserva para sangrados masivos con inestabilidad hemodinámica que no permiten la preparación colónica o cuando la colonoscopia falla.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "ATLS P3",
    "subtema": "Trauma Pélvico",
    "difficulty": "Alta",
    "case": "Masculino de 45 años es ingresado a la sala de choque tras ser atropellado por un camión de carga. A su ingreso se encuentra estuporoso, pálido y diaforético. Signos vitales: TA 70/40 mmHg, FC 140 lpm, FR 28 rpm. A la exploración física, presenta excoriaciones dermoepidérmicas severas en el hipogastrio y la región inguinal bilateral. Al realizar compresión suave sobre ambas crestas ilíacas hacia afuera y hacia adentro, se detecta inestabilidad y crepitación ósea franca. Se observa asimetría en la longitud de las extremidades inferiores. El FAST abdominal es negativo para líquido libre. Se abrirá en una ventana nueva Getty Images X-ray image pelvis and hips view.",
    "questions": [
      {
        "question": "Dada la alta sospecha clínica de una fractura pélvica inestable (\"en libro abierto\") con choque hemorrágico, ¿cuál es el origen anatómico más frecuente del sangrado masivo en esta entidad?",
        "options": [
          "Arteria ilíaca interna",
          "Plexo venoso presacro y venas pélvicas",
          "Arteria glútea superior",
          "Vasos pudendos internos"
        ],
        "answerIndex": 1,
        "explanation": "A diferencia de lo que comúnmente se piensa, más del 80% del sangrado retroperitoneal asociado a fracturas pélvicas mayores proviene del sangrado venoso (del plexo presacro y venas pélvicas desgarradas) y de las superficies óseas fracturadas (hueso esponjoso). El sangrado arterial (arteria glútea superior, pudenda) ocurre en el 15-20% de los casos.",
        "gpcReference": ""
      },
      {
        "question": "Según los protocolos del ATLS, ¿cuál es la medida ortopédica de \"control de daños\" inicial más inmediata, no invasiva y vital que debe aplicarse en la sala de reanimación para reducir el volumen pélvico y controlar la hemorragia venosa?",
        "options": [
          "Colocación de fijadores externos por el cirujano traumatólogo",
          "Angioembolización pélvica en sala de hemodinamia",
          "Aplicación de una faja pélvica o sábana a nivel de los trocánteres mayores",
          "Tracción cutánea bilateral con pesas de 10 kg"
        ],
        "answerIndex": 2,
        "explanation": "La aplicación de una faja pélvica comercial (pelvic binder) o una sábana firmemente atada centrada sobre los trocánteres mayores del fémur (no sobre las crestas ilíacas) es la intervención inicial crítica. Esto cierra el anillo pélvico (\"cierra el libro\"), reduce el volumen intrapélvico, promueve el taponamiento del sangrado venoso y estabiliza los fragmentos óseos mientras se define el tratamiento definitivo (fijación o angioembolización).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Introducción Oftalmología",
    "subtema": "Úlcera Corneal (Queratitis microbiana)",
    "difficulty": "Media",
    "case": "Femenina de 22 años, usuaria frecuente de lentes de contacto blandos (refiere dormir ocasionalmente con ellos). Acude a urgencias oftalmológicas por dolor ocular intenso en el ojo izquierdo, fotofobia incapacitante, lagrimeo y disminución de la agudeza visual de 48 horas de evolución. A la exploración en la lámpara de hendidura, se observa hiperemia ciliar (inyección periquerática) muy marcada y una lesión blanquecina, opaca y excavada de 3 mm de diámetro en el centro de la córnea, acompañada de hipopión (nivel de pus en la cámara anterior).",
    "questions": [
      {
        "question": "De acuerdo con el principal factor de riesgo (uso de lentes de contacto y malos hábitos de higiene ocular), ¿cuál es el agente bacteriano más agresivo y frecuentemente aislado en estos casos, capaz de perforar la córnea en 24-48 horas?",
        "options": [
          "Staphylococcus epidermidis",
          "Streptococcus pneumoniae",
          "Pseudomonas aeruginosa",
          "Neisseria gonorrhoeae"
        ],
        "answerIndex": 2,
        "explanation": "Las úlceras corneales en usuarios de lentes de contacto están fuertemente asociadas a la infección por Pseudomonas aeruginosa. Esta bacteria produce enzimas proteolíticas muy potentes que pueden causar necrosis licuefactiva rápida del estroma corneal y perforación ocular si no se instaura tratamiento agresivo inmediatamente.",
        "gpcReference": ""
      },
      {
        "question": "Para delimitar y confirmar el defecto epitelial de la córnea durante la exploración, ¿qué colorante tópico es el más utilizado, el cual se ilumina de color verde brillante bajo la luz azul de cobalto?",
        "options": [
          "Rosa de Bengala",
          "Verde de indocianina",
          "Fluoresceína sódica",
          "Azul de tripano"
        ],
        "answerIndex": 2,
        "explanation": "La fluoresceína sódica es el colorante oftálmico estándar. Es hidrofílico y no penetra el epitelio corneal intacto (lipofílico), pero cuando hay una desepitelización (úlcera o abrasión), el estroma subyacente capta el colorante, tiñéndose de un verde brillante altamente contrastante bajo el filtro azul de cobalto de la lámpara de hendidura.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Quemaduras / Golpe de calor / Hipotermia",
    "subtema": "Quemaduras eléctricas",
    "difficulty": "Alta",
    "case": "Masculino de 35 años, trabajador de la CFE, sufre un accidente laboral al tocar un cable de alta tensión (10,000 voltios). Es proyectado a 3 metros de distancia. A su ingreso, el paciente está obnubilado. Presenta una quemadura profunda (de tercer grado, carbonizada) de 4x4 cm en la palma de la mano derecha (sitio de entrada) y una lesión similar \"en estallido\" en el pie izquierdo (sitio de salida). A la colocación de la sonda Foley, se obtiene orina de color rojo oscuro, similar al vino de Oporto.",
    "questions": [
      {
        "question": "Las quemaduras de alto voltaje producen un daño tisular profundo extenso a lo largo del trayecto de la corriente, independientemente del tamaño de las heridas cutáneas. ¿Cuál es la complicación aguda más temida y principal causa de muerte inmediata en la escena del accidente por este tipo de quemadura?",
        "options": [
          "Falla renal aguda anúrica",
          "Fibrilación ventricular y arritmias cardíacas",
          "Síndrome compartimental masivo",
          "Perforación intestinal"
        ],
        "answerIndex": 1,
        "explanation": "El paso de la corriente eléctrica de alto voltaje interrumpe el sistema de conducción eléctrica del corazón, siendo la fibrilación ventricular o la asístole la causa más frecuente de muerte inmediata en el lugar del accidente. Todo paciente con quemadura eléctrica debe contar con monitorización electrocardiográfica continua a su ingreso (buscando arritmias o datos de isquemia).",
        "gpcReference": ""
      },
      {
        "question": "La presencia de orina oscura (como refresco de cola o vino) en este paciente es indicativa de rabdomiólisis severa por destrucción muscular (mioglobinuria). Según las guías del ATLS, ¿cuál es el objetivo de diuresis horaria (gasto urinario) que debe mantenerse mediante reanimación hídrica agresiva para prevenir la lesión renal aguda por nefrotoxicidad de la mioglobina?",
        "options": [
          "0.5 ml/kg/hora",
          "1.0 ml/kg/hora",
          "30 a 50 ml/hora",
          "100 ml/hora"
        ],
        "answerIndex": 3,
        "explanation": "El objetivo de reanimación con líquidos (Ringer Lactato) en un adulto con una quemadura térmica convencional es mantener una diuresis de 0.5 ml/kg/hr (aprox. 30-50 ml/h). Sin embargo, en quemaduras eléctricas con evidencia de rabdomiólisis/mioglobinuria (orina oscura), el ATLS exige incrementar el flujo de líquidos para \"lavar\" los riñones hasta alcanzar una diuresis objetivo de 100 ml/hora en el adulto (o de 1 a 1.5 ml/kg/hr en niños menores de 30 kg) hasta que la orina se aclare.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología intestinal QX",
    "subtema": "Fractura de escafoides",
    "difficulty": "Media",
    "case": "Masculino de 78 años, residente de un asilo de ancianos, con historia de estreñimiento crónico severo y postración. Es traído a urgencias por presentar dolor abdominal tipo cólico de inicio insidioso, que ha progresado en las últimas 48 horas, acompañado de incapacidad absoluta para canalizar gases o evacuar. A la exploración física, destaca un abdomen asimétricamente distendido, timpánico a la percusión, sin datos de irritación peritoneal (rebote negativo). Se solicita una radiografía simple de abdomen en bipedestación y decúbito.Pregunta 1¿Cuál es el hallazgo radiológico patognomónico esperado en este paciente que confirma el diagnóstico de oclusión intestinal baja por esta etiología?A) Niveles hidroaéreos en escalera e imagen en \"pila de monedas\"B) Imagen en \"corazón de manzana\" en la fosa ilíaca izquierdaC) Asa intestinal masivamente dilatada en forma de \"U\" invertida o \"grano de café\" *D) Neumatosis intestinal y gas en el sistema portalRetroalimentación:El vólvulo de sigmoides se produce por la torsión del colon sobre su propio eje mesentérico. Clásicamente ocurre en ancianos con estreñimiento crónico. En la radiografía simple de abdomen se observa el signo del \"grano de café\" o del \"neumático\", que representa el asa sigmoidea masivamente dilatada que asciende desde la pelvis hacia el cuadrante superior derecho. La pila de monedas es de intestino delgado y el corazón de manzana es cáncer colorrectal.Pregunta 2Siendo el paciente un adulto mayor estable, sin datos de peritonitis, isquemia o perforación, ¿cuál es el tratamiento inicial de elección según la GPC?A) Laparotomía exploradora con resección y anastomosis primariaB) Procedimiento de Hartmann de urgenciaC) Destorsión y descompresión endoscópica mediante colonoscopia o rectosigmoidoscopia rígida *D) Colocación de tubo de fístula mucosaRetroalimentación:En ausencia de signos de estrangulación (fiebre, leucocitosis, peritonitis, choque), el tratamiento inicial de primera línea es la devolvulación (destorsión) y descompresión endoscópica, frecuentemente con la colocación de una sonda rectal. Esto permite aliviar la urgencia, preparar el colon y programar una resección sigmoidea electiva días después, ya que la tasa de recurrencia si solo se destuerce sin cirugía definitiva supera el 50%.Tema: Patología cámara posterior Femenina de 65 años con hipertensión arterial sistémica de 20 años de evolución, con pobre apego farmacológico. Acude a valoración oftalmológica por disminución leve de la agudeza visual. Su presión arterial en el consultorio es de 170/100 mmHg. A la oftalmoscopia directa se observan arteriolas con reflejo luminoso dorsal ensanchado (hilos de cobre), cruces arteriovenosos patológicos con indentación de la vena (Signo de Gunn), y la presencia de manchas blanquecinas de bordes difusos (exudados algodonosos) y algunas hemorragias en forma de flama. No se observa edema de la papila del nervio óptico.Pregunta 1De acuerdo con la clasificación clásica de Keith-Wagener-Barker, ¿en qué grado se encuentra la retinopatía de esta paciente?A) Grado IB) Grado IIC) Grado III *D) Grado IVRetroalimentación:La clasificación de Keith-Wagener-Barker evalúa el daño vascular retiniano crónico. Grado I: estrechamiento arterial leve. Grado II: cruces arteriovenosos patológicos (Signo de Gunn, Salus). Grado III: se agregan exudados algodonosos, exudados duros o hemorragias retinianas (como en este caso). Grado IV: se agrega papiledema (edema del disco óptico), lo cual es signo de hipertensión maligna.Pregunta 2Desde el punto de vista fisiopatológico, ¿qué representan los exudados algodonosos observados en la retina de esta paciente?A) Extravasación de lípidos y lipoproteínas de vasos incompetentesB) Zonas de isquemia focal e infartos de la capa de fibras nerviosas de la retina *C) Ruptura de microaneurismas arteriolaresD) Acumulación de macrófagos cargados de hemosiderinaRetroalimentación:Los exudados algodonosos (blancos, de bordes difusos) no son verdaderos exudados, sino que representan áreas de isquemia focal e infartos en la capa de las fibras nerviosas de la retina secundaria a la oclusión de las arteriolas precapilares por el vasoespasmo severo. Los exudados duros (amarillentos, de bordes netos) sí son acúmulos de lípidos y proteínas (fuga vascular).Tema: Patología prostática Masculino de 45 años, sin antecedentes de importancia, acude a urgencias por presentar fiebre de 39°C, escalofríos, dolor perineal punzante y síntomas urinarios obstructivos severos (disuria intensa, pujo, tenesmo y chorro urinario muy débil) de 3 días de evolución. A la exploración física, el paciente luce con facies álgica. El abdomen es doloroso a la palpación profunda en hipogastrio, con globo vesical palpable. Se procede a realizar un tacto rectal. Masculino de 48 años es referido a gastroenterología quirúrgica por un cuadro crónico de dolor epigástrico tipo ardoroso y diarrea acuosa. Se le ha realizado endoscopia superior en múltiples ocasiones, documentándose la presencia de múltiples úlceras pépticas gigantes (>2 cm), algunas localizadas en sitios atípicos como la segunda y tercera porción del duodeno e incluso en yeyuno proximal. Refiere que las úlceras son refractarias al tratamiento continuo con inhibidores de la bomba de protones a dosis estándar. Su historia familiar es positiva para hipercalcemia y litiasis renal. Masculino de 22 años, sufre caída mientras patinaba, apoyando todo el peso de su cuerpo sobre la mano derecha en hiperextensión (dorsiflexión forzada). Acude a urgencias quejándose de dolor en la muñeca derecha. A la exploración física, no presenta deformidad evidente, pero tiene dolor exquisito a la palpación en el fondo de la \"tabaquera anatómica\" y dolor a la compresión axial del primer metacarpiano (pulgar). Se le toman radiografías simples de muñeca (AP, lateral y oblicua) las cuales son reportadas como sin evidencia de fractura aguda. Se abrirá en una ventana nuevaShutterstockExplorar",
    "questions": [
      {
        "question": "Durante la exploración física digital (tacto rectal) de este paciente, ¿qué hallazgo clínico y precaución son característicos y mandatarios, respectivamente?",
        "options": [
          "Próstata pétrea e irregular; se debe dar masaje prostático enérgico para obtener secreción para cultivo",
          "Próstata de consistencia ahulada y simétrica; se debe medir el volumen con ecografía transrectal inmediata",
          "Próstata caliente, edematosa (\"pantanosa\") y exquisitamente dolorosa; está absolutamente contraindicado el masaje prostático",
          "Próstata atrófica e indolora; se requiere biopsia transrectal inmediata"
        ],
        "answerIndex": 2,
        "explanation": "En la prostatitis aguda bacteriana, el tacto rectal (que debe hacerse con suma suavidad) revela una glándula típicamente caliente, tensa, muy edematosa y extremadamente dolorosa. El masaje prostático está formalmente contraindicado porque es intensamente doloroso y conlleva un alto riesgo de inducir bacteriemia y choque séptico.",
        "gpcReference": ""
      },
      {
        "question": "Teniendo en cuenta que los uropatógenos típicos (como E. coli) son los causantes principales, ¿cuál es el tratamiento antibiótico empírico de elección y su duración recomendada según las guías urológicas?",
        "options": [
          "Fosfomicina trometamol dosis única",
          "Fluoroquinolonas (ej. Ciprofloxacino o Levofloxacino) o TMP/SMX por un mínimo de 2 a 4 semanas",
          "Penicilina G benzatínica intramuscular dosis única",
          "Macrólidos (Azitromicina) por 3 días"
        ],
        "answerIndex": 1,
        "explanation": "Las fluoroquinolonas o el trimetoprima/sulfametoxazol (TMP/SMX) son los agentes de elección debido a su excelente penetración en el tejido prostático. Sin embargo, a diferencia de una cistitis aguda, el tratamiento debe ser prolongado (generalmente de 2 a 4 semanas para prostatitis aguda, y hasta 4-6 semanas en crónica) para erradicar la infección y prevenir recaídas o la formación de abscesos prostáticos.Tema: Patología Gástrica",
        "gpcReference": ""
      },
      {
        "question": "Ante la fuerte sospecha clínica, ¿cuál es el estudio bioquímico inicial de elección para confirmar el diagnóstico de este síndrome?",
        "options": [
          "Medición de la secreción de ácido gástrico basal",
          "Determinación de los niveles séricos de gastrina en ayuno",
          "Prueba de aliento con urea marcada",
          "Determinación de niveles de somatostatina sérica"
        ],
        "answerIndex": 1,
        "explanation": "El diagnóstico del Síndrome de Zollinger-Ellison (SZE) se basa en demostrar una hipersecreción patológica de ácido impulsada por un tumor neuroendocrino productor de gastrina (gastrinoma). El primer paso diagnóstico es la medición de gastrina sérica en ayuno; niveles acentuadamente elevados (generalmente >1000 pg/mL) en presencia de un pH gástrico ácido (<2) confirman el diagnóstico. Si los niveles están en un área gris, se usa la prueba de estimulación con secretina.",
        "gpcReference": ""
      },
      {
        "question": "Una vez confirmado bioquímicamente el SZE, se requiere localizar el tumor primario. ¿En qué región anatómica (conocida como el \"triángulo del gastrinoma\" o de Passaro) se localizan más del 80% de estos tumores?",
        "options": [
          "Curvatura mayor del estómago, bazo y cola del páncreas",
          "Antro gástrico, fondo gástrico y cardias",
          "Confluencia de los conductos biliares, segunda/tercera porción del duodeno y cabeza/cuello del páncreas",
          "Íleon terminal, ciego y apéndice cecal"
        ],
        "answerIndex": 2,
        "explanation": "El triángulo de Passaro (o triángulo del gastrinoma) es un área anatómica imaginaria donde se localizan entre el 80% y 90% de los gastrinomas. Sus vértices son la confluencia del conducto cístico con el colédoco, la unión de la segunda y tercera porción del duodeno, y la unión del cuello y cuerpo del páncreas. Es vital para la planeación de la exploración quirúrgica.Tema: Patología de extremidad superior",
        "gpcReference": ""
      },
      {
        "question": "A pesar de la radiografía inicial negativa, dada la alta sospecha clínica, ¿cuál es el abordaje ortopédico correcto y seguro para este paciente en el servicio de urgencias según la GPC?",
        "options": [
          "Alta médica con AINEs orales y reanudación de actividad normal",
          "Inmovilización con férula o yeso tipo espica de pulgar y repetir radiografías en 10-14 días o solicitar Resonancia Magnética",
          "Infiltración local con corticosteroides para alivio del dolor tendinoso",
          "Programar para reducción abierta y fijación interna profiláctica"
        ],
        "answerIndex": 1,
        "explanation": "Hasta un 20% de las fracturas de escafoides carpiano no son visibles en las radiografías iniciales. Ante un mecanismo compatible y dolor en la tabaquera anatómica, la indicación absoluta es tratarla clínicamente como fractura: inmovilizar con yeso/férula en espica del pulgar y citar en 10-14 días para repetir la radiografía (donde la reabsorción ósea hará visible el trazo de fractura) o, de estar disponible, solicitar una Resonancia Magnética o TAC para el diagnóstico temprano.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la complicación a largo plazo más temida y frecuente de esta fractura (especialmente las del polo proximal o cintura) debido a su particular anatomía vascular?",
        "options": [
          "Compresión aguda del nervio mediano (Síndrome del túnel carpiano agudo)",
          "Pseudoartrosis y necrosis avascular del polo proximal",
          "Síndrome de dolor regional complejo tipo II",
          "Osificación heterotópica del ligamento escafolunar"
        ],
        "answerIndex": 1,
        "explanation": "El escafoides tiene una irrigación sanguínea precaria y retrógrada (los vasos entran por el polo distal y nutren hacia el polo proximal). Las fracturas a través de la cintura o el polo proximal interrumpen el suministro de sangre, lo que lleva a un alto riesgo de consolidación viciosa, pseudoartrosis (no unión) y necrosis avascular del segmento proximal, conduciendo finalmente a una osteoartritis severa de la muñeca.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Preeclampsia con criterios de severidad",
    "subtema": "",
    "difficulty": "alta",
    "case": "Mujer de 27 años, G1P0, 33 semanas de gestación por FUM confiable. Acude por cefalea intensa persistente, fosfenos y dolor en epigastrio desde hace 8 horas. TA 168/112 mmHg en dos tomas separadas por 15 minutos. FC 96 lpm. Edema en extremidades inferiores ++. Proteinuria en tira reactiva +++. Laboratorio: plaquetas 130,000/mm³, TGO 78 U/L, creatinina 1.3 mg/dL.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Hipertensión gestacional",
          "Preeclampsia sin criterios de severidad",
          "Síndrome HELLP",
          "Preeclampsia con criterios de severidad"
        ],
        "answerIndex": 3,
        "explanation": "La paciente cumple criterios de severidad: TA ≥160/110, datos neurológicos y epigastralgia. Según GPC mexicana de trastornos hipertensivos del embarazo y NOM-007, el manejo inicial es hospitalización, sulfato de magnesio para prevención de eclampsia y antihipertensivos IV (labetalol/hidralazina). La resolución del embarazo depende de estabilidad materno-fetal y edad gestacional.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta inmediata según GPC mexicana?",
        "options": [
          "Observación y control ambulatorio",
          "Inducción inmediata sin estabilización",
          "Hospitalización, sulfato de magnesio y control antihipertensivo",
          "Solo antihipertensivo oral"
        ],
        "answerIndex": 2,
        "explanation": "La paciente cumple criterios de severidad: TA ≥160/110, datos neurológicos y epigastralgia. Según GPC mexicana de trastornos hipertensivos del embarazo y NOM-007, el manejo inicial es hospitalización, sulfato de magnesio para prevención de eclampsia y antihipertensivos IV (labetalol/hidralazina). La resolución del embarazo depende de estabilidad materno-fetal y edad gestacional.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragia del primer trimestre – Embarazo ectópico",
    "subtema": "",
    "difficulty": "alta",
    "case": "Mujer de 30 años, G2P1, 7 semanas de amenorrea. Dolor abdominal tipo cólico en fosa iliaca derecha y sangrado transvaginal escaso. TA 100/60 mmHg, FC 108 lpm. USG transvaginal: útero vacío, masa anexial derecha de 3 cm, BHCG 2,500 mUI/mL.",
    "questions": [
      {
        "question": "¿Cuál es el manejo más adecuado según GPC mexicana?",
        "options": [
          "Legrado uterino",
          "Metotrexato si cumple criterios",
          "Observación expectante",
          "Histerectomía"
        ],
        "answerIndex": 1,
        "explanation": "Criterios para manejo médico: estabilidad hemodinámica, masa <3.5–4 cm, sin actividad cardiaca embrionaria y BHCG <5,000. La paciente cumple criterios. Según GPC mexicana de embarazo ectópico, el manejo de elección es metotrexato.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragia obstétrica – Atonía uterina",
    "subtema": "",
    "difficulty": "alta",
    "case": "Paciente de 24 años, G1P1, parto eutócico hace 30 minutos. Presenta sangrado abundante. TA 90/50 mmHg, FC 120 lpm. Útero flácido a la palpación.",
    "questions": [
      {
        "question": "¿Cuál es la causa más probable?",
        "options": [
          "Retención placentaria",
          "Laceración cervical",
          "Atonía uterina",
          "Coagulopatía"
        ],
        "answerIndex": 2,
        "explanation": "La causa más frecuente de hemorragia obstétrica es atonía uterina. El manejo inicial es masaje uterino + uterotónicos (oxitocina primera línea).",
        "gpcReference": ""
      },
      {
        "question": "Primer paso en manejo según NOM-007:",
        "options": [
          "Histerectomía inmediata",
          "Masaje uterino bimanual y oxitocina IV",
          "Legrado uterino",
          "Plasma fresco"
        ],
        "answerIndex": 1,
        "explanation": "La causa más frecuente de hemorragia obstétrica es atonía uterina. El manejo inicial es masaje uterino + uterotónicos (oxitocina primera línea).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Diabetes gestacional",
    "subtema": "",
    "difficulty": "alta",
    "case": "Paciente de 32 años, 26 semanas de gestación. Glucosa en ayuno 98 mg/dL. Curva de tolerancia oral 75 g: 1h 185 mg/dL, 2h 160 mg/dL.",
    "questions": [
      {
        "question": "¿Cuál es el siguiente paso según NOM-015 y GPC mexicana?",
        "options": [
          "Repetir estudio",
          "Iniciar metformina",
          "Iniciar manejo nutricional y ejercicio, control glucémico",
          "Iniciar insulina inmediata"
        ],
        "answerIndex": 2,
        "explanation": "Con un valor alterado ya se diagnostica diabetes gestacional. El manejo inicial es dieta + ejercicio y monitoreo. Insulina si no hay control.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Placenta previa",
    "subtema": "",
    "difficulty": "alta",
    "case": "Paciente de 35 años, G3P2, 34 semanas. Sangrado rojo brillante indoloro. Útero relajado, FCF normal.",
    "questions": [
      {
        "question": "Conducta correcta según GPC mexicana:",
        "options": [
          "Tacto vaginal inmediato",
          "Inducción del trabajo de parto",
          "Ultrasonido transvaginal y evitar tacto",
          "Alta domiciliaria"
        ],
        "answerIndex": 2,
        "explanation": "Sangrado rojo brillante indoloro sugiere placenta previa. Está contraindicado el tacto vaginal. Confirmación con USG.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Cáncer cervicouterino – Tamizaje",
    "subtema": "",
    "difficulty": "alta",
    "case": "Mujer de 32 años, vida sexual activa desde los 18 años. Último Papanicolaou hace 4 años.",
    "questions": [
      {
        "question": "Según NOM-014, ¿cuál es la recomendación?",
        "options": [
          "No requiere tamizaje",
          "Solo VPH",
          "Citología cervical cada 3 años (25–34 años)",
          "Colposcopía directa"
        ],
        "answerIndex": 2,
        "explanation": "En mujeres de 25–34 años se realiza citología cada 3 años. VPH primario se recomienda ≥35 años.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Ruptura prematura de membranas (RPM)",
    "subtema": "",
    "difficulty": "alta",
    "case": "Paciente 29 años, 35 semanas, salida de líquido claro transvaginal. Sin fiebre. FCF normal.",
    "questions": [
      {
        "question": "Conducta según GPC mexicana:",
        "options": [
          "Alta domiciliaria",
          "Inducir trabajo de parto",
          "Manejo expectante hasta 37 semanas",
          "Cesárea inmediata"
        ],
        "answerIndex": 1,
        "explanation": "RPM ≥34 semanas: se recomienda interrupción del embarazo por riesgo infeccioso.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Síndrome HELLP",
    "subtema": "",
    "difficulty": "Alta",
    "case": "Mujer de 29 años, G2P1, 35 semanas de gestación. Antecedente de preeclampsia en embarazo previo. Acude por cefalea intensa, náusea, vómito y dolor en hipocondrio derecho de 24 horas de evolución. Refiere disminución de movimientos fetales. TA 162/108 mmHg, FC 102 lpm. Edema ++ en extremidades inferiores. Laboratorio: Hb 11 g/dL, plaquetas 82,000/mm³, TGO 145 U/L, TGP 132 U/L, DHL elevada, bilirrubina indirecta elevada, creatinina 1.4 mg/dL. EGO con proteinuria ++.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Preeclampsia sin datos de severidad",
          "Hepatitis aguda viral",
          "Síndrome HELLP",
          "Colestasis intrahepática del embarazo"
        ],
        "answerIndex": 2,
        "explanation": "El síndrome HELLP se caracteriza por hemólisis, elevación de enzimas hepáticas y trombocitopenia. Es una variante grave de preeclampsia. Según GPC mexicana de trastornos hipertensivos, el manejo es estabilizar y resolver el embarazo independientemente de la edad gestacional si ≥34 semanas o si hay deterioro materno.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta indicada según GPC mexicana?",
        "options": [
          "Manejo ambulatorio y control en 48 horas",
          "Corticoesteroides y continuar embarazo hasta 37 semanas",
          "Estabilización materna con sulfato de magnesio y resolución del embarazo",
          "Plasmaféresis inmediata"
        ],
        "answerIndex": 2,
        "explanation": "El síndrome HELLP se caracteriza por hemólisis, elevación de enzimas hepáticas y trombocitopenia. Es una variante grave de preeclampsia. Según GPC mexicana de trastornos hipertensivos, el manejo es estabilizar y resolver el embarazo independientemente de la edad gestacional si ≥34 semanas o si hay deterioro materno.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Desprendimiento prematuro de placenta normoinserta (DPPNI)",
    "subtema": "",
    "difficulty": "Alta",
    "case": "Paciente de 38 años, G4P3, 36 semanas de gestación, antecedente de hipertensión crónica. Acude por dolor abdominal súbito, intenso, continuo, acompañado de sangrado transvaginal oscuro en cantidad moderada. Refiere disminución de movimientos fetales. TA 150/95 mmHg. Útero hipertónico, doloroso a la palpación. FCF 90 lpm con desaceleraciones tardías persistentes.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Placenta previa",
          "Ruptura uterina",
          "DPPNI",
          "Trabajo de parto pretérmino"
        ],
        "answerIndex": 2,
        "explanation": "El DPPNI cursa con dolor abdominal + sangrado oscuro + hipertonía uterina. Con compromiso fetal se indica resolución inmediata por cesárea. Está basado en GPC mexicana de hemorragia obstétrica.",
        "gpcReference": ""
      },
      {
        "question": "Conducta inmediata:",
        "options": [
          "Tacto vaginal para valorar dilatación",
          "Manejo expectante",
          "Cesárea urgente",
          "Inducción con oxitocina"
        ],
        "answerIndex": 2,
        "explanation": "El DPPNI cursa con dolor abdominal + sangrado oscuro + hipertonía uterina. Con compromiso fetal se indica resolución inmediata por cesárea. Está basado en GPC mexicana de hemorragia obstétrica.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Corioamnionitis",
    "subtema": "",
    "difficulty": "Media–Alta",
    "case": "Mujer de 24 años, G1P0, 32 semanas de gestación. Antecedente de ruptura prematura de membranas hace 36 horas. Presenta fiebre de 38.7°C, taquicardia materna (110 lpm) y fetal (170 lpm), dolor uterino a la palpación y líquido amniótico fétido.",
    "questions": [
      {
        "question": "¿Cuál es el manejo indicado según GPC mexicana?",
        "options": [
          "Manejo expectante hasta completar esquema de esteroides",
          "Antibiótico ambulatorio",
          "Antibióticos IV de amplio espectro y resolución del embarazo",
          "Solo inducción sin antibiótico"
        ],
        "answerIndex": 2,
        "explanation": "La corioamnionitis es indicación de interrupción del embarazo más antibióticos IV (ampicilina + gentamicina según lineamientos). No debe prolongarse el embarazo por riesgo de sepsis materno-fetal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Eclampsia",
    "subtema": "",
    "difficulty": "Alta",
    "case": "Paciente de 19 años, G1, 30 semanas de gestación. Sin control prenatal. Presenta crisis convulsiva tónico-clónica generalizada en domicilio. Al ingreso: TA 170/115 mmHg, confusa, edema generalizado. Proteinuria +++.",
    "questions": [
      {
        "question": "¿Cuál es el fármaco de elección inicial?",
        "options": [
          "Diazepam",
          "Fenitoína",
          "Sulfato de magnesio",
          "Levetiracetam"
        ],
        "answerIndex": 2,
        "explanation": "El tratamiento de elección para prevenir recurrencia de convulsiones es sulfato de magnesio. Toda eclampsia es indicación de resolución del embarazo tras estabilización materna.",
        "gpcReference": ""
      },
      {
        "question": "Después de estabilizar a la paciente, ¿cuál es la conducta?",
        "options": [
          "Continuar embarazo hasta 37 semanas",
          "Alta domiciliaria",
          "Interrumpir el embarazo una vez estabilizada",
          "Solo control antihipertensivo"
        ],
        "answerIndex": 2,
        "explanation": "El tratamiento de elección para prevenir recurrencia de convulsiones es sulfato de magnesio. Toda eclampsia es indicación de resolución del embarazo tras estabilización materna.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Sepsis puerperal",
    "subtema": "",
    "difficulty": "Media–Alta",
    "case": "Paciente de 31 años, G2P2, 5 días post cesárea por sufrimiento fetal. Refiere fiebre de 39°C, malestar general y dolor hipogástrico. TA 95/60 mmHg, FC 120 lpm. Útero subinvolucionado y doloroso, loquios fétidos.",
    "questions": [
      {
        "question": "¿Cuál es el manejo inicial más adecuado?",
        "options": [
          "Antipiréticos y observación",
          "Antibióticos IV de amplio espectro y reanimación hídrica",
          "Legrado uterino inmediato",
          "Alta con antibiótico oral"
        ],
        "answerIndex": 1,
        "explanation": "Cuadro compatible con endometritis puerperal complicada. Manejo hospitalario con antibióticos IV de amplio espectro según GPC mexicana y criterios de sepsis.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Distocia de hombros",
    "subtema": "",
    "difficulty": "Alta",
    "case": "Mujer de 34 años, G2P1, antecedente de diabetes gestacional. Producto macrosómico estimado en 4,200 g. Durante el parto vaginal, tras la salida de la cabeza fetal, esta retrae contra el periné (signo de la tortuga). No progresa el descenso.",
    "questions": [
      {
        "question": "¿Cuál es la primera maniobra indicada?",
        "options": [
          "Fórceps",
          "Cesárea inmediata",
          "Maniobra de McRoberts",
          "Maniobra de Kristeller"
        ],
        "answerIndex": 2,
        "explanation": "La maniobra inicial en distocia de hombros es McRoberts (flexión de muslos sobre abdomen). Está contraindicada la presión fundica.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del primer trimestre",
    "subtema": "Aborto incompleto",
    "difficulty": "Media–Alta",
    "case": "Mujer de 26 años, G2P0A1, 10 semanas por FUM confiable. Acude por sangrado transvaginal abundante de 12 horas de evolución, acompañado de cólico hipogástrico intenso y expulsión de coágulos. Refiere que hace 3 días inició con manchado escaso. TA 100/65 mmHg, FC 105 lpm. A la exploración ginecológica: cérvix dilatado 2 cm, restos ovulares visibles en canal cervical. USG transvaginal: cavidad uterina con material ecogénico heterogéneo, sin saco gestacional íntegro.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Amenaza de aborto",
          "Aborto diferido",
          "Aborto incompleto",
          "Embarazo ectópico"
        ],
        "answerIndex": 2,
        "explanation": "El aborto incompleto se caracteriza por sangrado, dolor, cérvix dilatado y restos intrauterinos. Según GPC mexicana, el manejo puede ser médico o quirúrgico; sin embargo, ante sangrado abundante o compromiso hemodinámico, la evacuación uterina es el tratamiento indicado.",
        "gpcReference": ""
      },
      {
        "question": "Según GPC mexicana de aborto espontáneo, ¿cuál es el manejo más adecuado?",
        "options": [
          "Manejo expectante obligatorio",
          "Antibiótico oral y alta",
          "Evacuación uterina (AMEU o legrado) según condiciones clínicas",
          "Histerectomía"
        ],
        "answerIndex": 2,
        "explanation": "El aborto incompleto se caracteriza por sangrado, dolor, cérvix dilatado y restos intrauterinos. Según GPC mexicana, el manejo puede ser médico o quirúrgico; sin embargo, ante sangrado abundante o compromiso hemodinámico, la evacuación uterina es el tratamiento indicado.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del primer trimestre",
    "subtema": "Enfermedad trofoblástica gestacional",
    "difficulty": "Alta",
    "case": "Paciente de 19 años, G1, 12 semanas de amenorrea. Presenta sangrado transvaginal intermitente, náusea y vómito incoercible. Refiere expulsión de vesículas. TA 140/90 mmHg. Útero aumentado de tamaño mayor al esperado para edad gestacional. BHCG 250,000 mUI/mL. USG: patrón en “tormenta de nieve” sin embrión visible.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Aborto retenido",
          "Embarazo múltiple",
          "Mola hidatiforme completa",
          "Embarazo ectópico"
        ],
        "answerIndex": 2,
        "explanation": "La mola completa cursa con BHCG muy elevada, ausencia de embrión y patrón ecográfico típico. El manejo es evacuación uterina por aspiración y seguimiento estrecho con BHCG para detectar enfermedad persistente.",
        "gpcReference": ""
      },
      {
        "question": "Conducta inicial según GPC mexicana:",
        "options": [
          "Metotrexato inmediato",
          "Aspiración uterina y seguimiento con BHCG seriada",
          "Histerectomía en todas las pacientes",
          "Observación"
        ],
        "answerIndex": 1,
        "explanation": "La mola completa cursa con BHCG muy elevada, ausencia de embrión y patrón ecográfico típico. El manejo es evacuación uterina por aspiración y seguimiento estrecho con BHCG para detectar enfermedad persistente.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del segundo y tercer trimestre",
    "subtema": "Acretismo placentario",
    "difficulty": "Alta",
    "case": "Mujer de 37 años, G4P3, antecedente de 3 cesáreas previas. 35 semanas de gestación. USG reporta placenta previa oclusiva total con múltiples lagunas vasculares y pérdida del espacio retroplacentario. No presenta sangrado activo.",
    "questions": [
      {
        "question": "¿Cuál es la conducta recomendada según GPC mexicana?",
        "options": [
          "Inducción del trabajo de parto",
          "Cesárea convencional con intento de desprendimiento placentario",
          "Cesárea programada con equipo multidisciplinario y probable histerectomía obstétrica",
          "Manejo ambulatorio hasta inicio de trabajo de parto"
        ],
        "answerIndex": 2,
        "explanation": "Placenta previa + cesáreas previas aumenta riesgo de acretismo. El manejo es cesárea programada en hospital de tercer nivel, evitando intentar desprender la placenta por riesgo de hemorragia masiva.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología del embarazo",
    "subtema": "Colestasis intrahepática del embarazo",
    "difficulty": "Media–Alta",
    "case": "Paciente de 30 años, G2P1, 33 semanas. Refiere prurito intenso predominante en palmas y plantas, sin lesiones cutáneas visibles. No dolor abdominal ni fiebre. TA normal. Laboratorio: bilirrubina normal, elevación leve de TGO/TGP, ácidos biliares elevados.",
    "questions": [
      {
        "question": "¿Cuál es el manejo indicado?",
        "options": [
          "Antihistamínicos y vigilancia",
          "Corticoesteroides sistémicos",
          "Ácido ursodesoxicólico y programar interrupción a las 37 semanas",
          "Cesárea inmediata"
        ],
        "answerIndex": 2,
        "explanation": "La colestasis intrahepática aumenta riesgo de muerte fetal intrauterina. El manejo es ácido ursodesoxicólico y programación de interrupción alrededor de las 37 semanas.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología del trabajo de parto",
    "subtema": "Inducción del trabajo de parto",
    "difficulty": "Alta",
    "case": "Paciente de 28 años, G1, 41 semanas de gestación. Sin trabajo de parto. Perfil biofísico 6/10 por disminución de líquido amniótico. Cérvix posterior, cerrado, 30% borramiento, Bishop 3.",
    "questions": [
      {
        "question": "¿Cuál es el método inicial recomendado?",
        "options": [
          "Oxitocina directa",
          "Cesárea inmediata",
          "Maduración cervical con prostaglandinas",
          "Maniobra de Hamilton"
        ],
        "answerIndex": 2,
        "explanation": "Con Bishop <6 se recomienda maduración cervical previa con prostaglandinas antes de iniciar oxitocina, según GPC mexicana de inducción.",
        "gpcReference": ""
      },
      {
        "question": "¿Por qué no se inicia oxitocina directamente?",
        "options": [
          "Está contraindicada en embarazo postérmino",
          "Produce sufrimiento fetal inmediato",
          "Bishop desfavorable requiere maduración previa",
          "Solo se usa en multíparas"
        ],
        "answerIndex": 2,
        "explanation": "Con Bishop <6 se recomienda maduración cervical previa con prostaglandinas antes de iniciar oxitocina, según GPC mexicana de inducción.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología puerperal",
    "subtema": "Hemorragia obstétrica secundaria",
    "difficulty": "Media–Alta",
    "case": "Mujer de 22 años, 10 días post parto eutócico. Acude por sangrado transvaginal abundante súbito, acompañado de mareo. TA 95/60 mmHg. USG muestra restos retenidos intrauterinos.",
    "questions": [
      {
        "question": "¿Cuál es el manejo indicado?",
        "options": [
          "Observación",
          "Uterotónicos exclusivamente",
          "Evacuación uterina y antibióticos si se sospecha infección",
          "Histerectomía inmediata"
        ],
        "answerIndex": 2,
        "explanation": "La hemorragia puerperal secundaria suele asociarse a restos placentarios retenidos. El manejo es evacuación uterina bajo cobertura antibiótica.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Estados hipertensivos del embarazo",
    "subtema": "Preeclampsia sin criterios de severidad",
    "difficulty": "Media–Alta",
    "case": "Mujer de 31 años, G2P1, 34 semanas de gestación por FUM confiable y corroborada por ultrasonido del primer trimestre. Antecedente de obesidad grado I (IMC 32 kg/m²) y madre con antecedente de preeclampsia. Acude a consulta por cefalea leve intermitente y edema progresivo en extremidades inferiores desde hace 1 semana. Niega fosfenos, acúfenos o dolor epigástrico. Signos vitales: TA 148/94 mmHg en primera toma y 150/96 mmHg 20 minutos después. FC 88 lpm. FR 18 rpm. Temperatura 36.7°C. Altura uterina acorde a edad gestacional. FCF 145 lpm, reactiva. Laboratorio: Hb 12 g/dL, plaquetas 190,000/mm³, TGO/TGP normales, creatinina 0.8 mg/dL. EGO con proteinuria ++. Relación proteína/creatinina 0.5.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Hipertensión crónica",
          "Hipertensión gestacional",
          "Preeclampsia sin criterios de severidad",
          "Preeclampsia con criterios de severidad"
        ],
        "answerIndex": 2,
        "explanation": "La paciente cumple criterios de preeclampsia (TA ≥140/90 + proteinuria) pero no tiene datos de severidad (no plaquetopenia, no elevación de enzimas hepáticas, no síntomas neurológicos graves). Según la GPC mexicana y NOM-007, el manejo es expectante con vigilancia estrecha hasta las 37 semanas, momento en que se recomienda la interrupción.",
        "gpcReference": ""
      },
      {
        "question": "Según la GPC mexicana de trastornos hipertensivos del embarazo, ¿cuál es la conducta adecuada?",
        "options": [
          "Interrupción inmediata del embarazo",
          "Manejo expectante con vigilancia materno-fetal estrecha hasta las 37 semanas",
          "Alta domiciliaria sin seguimiento",
          "Iniciar sulfato de magnesio de forma rutinaria"
        ],
        "answerIndex": 1,
        "explanation": "La paciente cumple criterios de preeclampsia (TA ≥140/90 + proteinuria) pero no tiene datos de severidad (no plaquetopenia, no elevación de enzimas hepáticas, no síntomas neurológicos graves). Según la GPC mexicana y NOM-007, el manejo es expectante con vigilancia estrecha hasta las 37 semanas, momento en que se recomienda la interrupción.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del segundo y tercer trimestre",
    "subtema": "Vasa previa",
    "difficulty": "Alta",
    "case": "Paciente de 33 años, G3P2, 36 semanas de gestación. Embarazo con diagnóstico previo de placenta bilobulada identificado en ultrasonido estructural. Acude a urgencias por sangrado transvaginal rojo brillante posterior a ruptura espontánea de membranas. Niega dolor abdominal. A la exploración: útero relajado, no doloroso. TA 110/70 mmHg. FC 92 lpm. En monitor fetal se documenta bradicardia fetal sostenida de 80 lpm. El sangrado continúa en pequeña cantidad. No hay datos de choque materno.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Placenta previa",
          "DPPNI",
          "Vasa previa",
          "Ruptura uterina"
        ],
        "answerIndex": 2,
        "explanation": "La vasa previa se sospecha ante sangrado rojo brillante tras ruptura de membranas con bradicardia fetal y estabilidad materna. La hemorragia es fetal. Es una urgencia obstétrica que requiere cesárea inmediata.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta inmediata indicada?",
        "options": [
          "Manejo expectante",
          "Inducción del trabajo de parto",
          "Cesárea urgente inmediata",
          "Tacto vaginal para valorar dilatación"
        ],
        "answerIndex": 2,
        "explanation": "La vasa previa se sospecha ante sangrado rojo brillante tras ruptura de membranas con bradicardia fetal y estabilidad materna. La hemorragia es fetal. Es una urgencia obstétrica que requiere cesárea inmediata.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Parto pretérmino",
    "subtema": "Amenaza de parto pretérmino (<34 semanas)",
    "difficulty": "Alta",
    "case": "Mujer de 24 años, G1, 31 semanas de gestación. Refiere contracciones uterinas regulares cada 8 minutos desde hace 4 horas, acompañadas de sensación de presión pélvica. Niega salida de líquido o sangrado. Control prenatal adecuado. Signos vitales normales. A la exploración obstétrica: dinámica uterina regular, 3 contracciones en 10 minutos. Tacto vaginal: cérvix 2 cm de dilatación, 50% borramiento, membranas íntegras. USG transvaginal con longitud cervical de 20 mm. FCF 150 lpm reactiva.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Trabajo de parto activo",
          "Amenaza de parto pretérmino",
          "Falso trabajo de parto",
          "RPM pretérmino"
        ],
        "answerIndex": 1,
        "explanation": "Entre 24 y 33.6 semanas, con cambios cervicales y dinámica uterina, se indica tocolisis (si no hay contraindicación) y corticoesteroides para maduración pulmonar fetal. Esto reduce morbimortalidad neonatal.",
        "gpcReference": ""
      },
      {
        "question": "Según GPC mexicana, ¿cuál es el manejo indicado?",
        "options": [
          "Alta domiciliaria",
          "Inducción inmediata",
          "Tocolisis + esquema de maduración pulmonar con corticoesteroides",
          "Cesárea inmediata"
        ],
        "answerIndex": 2,
        "explanation": "Entre 24 y 33.6 semanas, con cambios cervicales y dinámica uterina, se indica tocolisis (si no hay contraindicación) y corticoesteroides para maduración pulmonar fetal. Esto reduce morbimortalidad neonatal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología del trabajo de parto",
    "subtema": "Ruptura uterina",
    "difficulty": "Alta",
    "case": "Paciente de 35 años, G4P3, antecedente de cesárea segmentaria hace 2 años. Cursa embarazo de 39 semanas. Se encuentra en trabajo de parto inducido con oxitocina por embarazo postérmino. Después de 6 horas presenta dolor abdominal súbito, intenso, persistente, diferente a las contracciones. Se documenta pérdida de la estación fetal previamente descendida y alteración súbita en FCF con desaceleraciones prolongadas. TA 90/60 mmHg, FC 120 lpm. Abdomen doloroso, palpación fácil de partes fetales.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "DPPNI",
          "Distocia dinámica",
          "Ruptura uterina",
          "Placenta previa"
        ],
        "answerIndex": 2,
        "explanation": "Ante antecedente de cesárea y datos de choque + sufrimiento fetal + pérdida de estación, se debe sospechar ruptura uterina. Es una emergencia quirúrgica inmediata.",
        "gpcReference": ""
      },
      {
        "question": "Conducta inmediata:",
        "options": [
          "Suspender oxitocina y observar",
          "Inducción con prostaglandinas",
          "Laparotomía urgente y resolución quirúrgica",
          "Manejo expectante"
        ],
        "answerIndex": 2,
        "explanation": "Ante antecedente de cesárea y datos de choque + sufrimiento fetal + pérdida de estación, se debe sospechar ruptura uterina. Es una emergencia quirúrgica inmediata.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología del embarazo",
    "subtema": "Diabetes gestacional con falla a manejo nutricional",
    "difficulty": "Alta",
    "case": "Mujer de 36 años, G3P1A1, 29 semanas de gestación. Antecedente de macrosomía fetal en embarazo previo (4,250 g). IMC pregestacional 31 kg/m². En tamizaje con CTGO de 75 g a las 24 semanas presentó: ayuno 97 mg/dL, 1h 189 mg/dL, 2h 162 mg/dL, por lo que se diagnosticó diabetes gestacional. Se inició plan nutricional individualizado y recomendación de ejercicio aeróbico moderado 30 minutos diarios. La paciente refiere apego adecuado. En controles domiciliarios reporta las siguientes cifras en la última semana: •     Ayuno: 102–108 mg/dL •     1 hora postprandial: 165–185 mg/dL USG obstétrico: feto único vivo, biometría en percentil 90, líquido amniótico normal. No datos de restricción ni polihidramnios.",
    "questions": [
      {
        "question": "¿Cuál es la meta glucémica según lineamientos mexicanos?",
        "options": [
          "Ayuno <110 mg/dL y postprandial <200 mg/dL",
          "Ayuno <100 mg/dL y postprandial <180 mg/dL",
          "Ayuno <95 mg/dL y postprandial <140 mg/dL",
          "Ayuno <120 mg/dL y postprandial <160 mg/dL"
        ],
        "answerIndex": 2,
        "explanation": "Según NOM-015 y GPC mexicana de diabetes en el embarazo, si no se alcanzan metas con manejo nutricional tras 1–2 semanas, se debe iniciar insulina. Las metas son ayuno <95 mg/dL y 1h postprandial <140 mg/dL.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el siguiente paso en el manejo?",
        "options": [
          "Continuar solo dieta 2 semanas más",
          "Iniciar metformina como primera línea obligatoria",
          "Programar interrupción inmediata",
          "Iniciar insulinoterapia"
        ],
        "answerIndex": 3,
        "explanation": "Según NOM-015 y GPC mexicana de diabetes en el embarazo, si no se alcanzan metas con manejo nutricional tras 1–2 semanas, se debe iniciar insulina. Las metas son ayuno <95 mg/dL y 1h postprandial <140 mg/dL.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del segundo y tercer trimestre",
    "subtema": "Placenta previa oclusiva total",
    "difficulty": "Media–Alta",
    "case": "Paciente de 34 años, G2P1, 32 semanas de gestación. Antecedente de cesárea hace 3 años. Consulta por sangrado transvaginal rojo brillante en moderada cantidad, sin dolor abdominal. Refiere episodio similar hace 2 semanas que cedió espontáneamente. Signos vitales: TA 110/70 mmHg, FC 90 lpm. Útero relajado, no doloroso. FCF 145 lpm reactiva. USG transvaginal confirma placenta previa oclusiva total. Hemoglobina 10.8 g/dL.",
    "questions": [
      {
        "question": "¿Cuál es la conducta inmediata?",
        "options": [
          "Realizar tacto vaginal para valorar dilatación",
          "Inducir trabajo de parto",
          "Hospitalización y vigilancia expectante",
          "Cesárea urgente inmediata"
        ],
        "answerIndex": 2,
        "explanation": "En placenta previa estable y <36–37 semanas se recomienda manejo expectante hospitalario. La interrupción programada se realiza alrededor de 36–37 semanas si no hay sangrado masivo.",
        "gpcReference": ""
      },
      {
        "question": "¿En qué momento debe programarse la interrupción si no hay nuevo sangrado?",
        "options": [
          "34 semanas",
          "35 semanas",
          "36–37 semanas",
          "40 semanas"
        ],
        "answerIndex": 2,
        "explanation": "En placenta previa estable y <36–37 semanas se recomienda manejo expectante hospitalario. La interrupción programada se realiza alrededor de 36–37 semanas si no hay sangrado masivo.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Trabajo de parto prolongado por distocia dinámica (hipodinamia)",
    "difficulty": "Alta",
    "case": "Mujer de 22 años, G1, 39 semanas. Inició trabajo de parto hace 14 horas. Membranas rotas hace 8 horas. Dinámica uterina irregular, 1–2 contracciones en 10 minutos, de baja intensidad. Tacto vaginal actual: 4 cm de dilatación, 70% borramiento, presentación cefálica en -2 estación. No fiebre. FCF 140 lpm reactiva. Pelvis clínica adecuada.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Trabajo de parto normal",
          "Distocia por desproporción cefalopélvica",
          "Distocia dinámica por hiperdinamia",
          "Distocia dinámica por hipodinamia"
        ],
        "answerIndex": 3,
        "explanation": "La hipodinamia uterina se caracteriza por contracciones insuficientes que no permiten progresión cervical. El manejo es estimulación con oxitocina bajo monitoreo fetal continuo.",
        "gpcReference": ""
      },
      {
        "question": "Conducta indicada:",
        "options": [
          "Cesárea inmediata",
          "Manejo expectante indefinido",
          "Administración de prostaglandinas",
          "Inicio o ajuste de oxitocina IV con vigilancia estrecha"
        ],
        "answerIndex": 3,
        "explanation": "La hipodinamia uterina se caracteriza por contracciones insuficientes que no permiten progresión cervical. El manejo es estimulación con oxitocina bajo monitoreo fetal continuo.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología puerperal",
    "subtema": "Choque hipovolémico secundario a hemorragia obstétrica primaria",
    "difficulty": "Alta",
    "case": "Paciente de 28 años, G2P2, parto eutócico hace 20 minutos. Presenta sangrado abundante continuo estimado en 1,200 mL. Se encuentra pálida, diaforética, con TA 80/50 mmHg, FC 130 lpm, FR 24 rpm. Útero flácido a la palpación. No desgarros evidentes. Hb previa al parto 12 g/dL.",
    "questions": [
      {
        "question": "¿Cuál es el grado de choque más probable?",
        "options": [
          "Grado I",
          "Grado II",
          "Grado III",
          "Grado IV"
        ],
        "answerIndex": 2,
        "explanation": "Pérdida >1,000 mL con hipotensión y taquicardia corresponde a choque grado III. Se debe iniciar reanimación hídrica inmediata y protocolo de hemorragia obstétrica, además de masaje uterino y uterotónicos.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la prioridad inicial en el manejo?",
        "options": [
          "Legrado uterino inmediato",
          "Histerectomía inmediata",
          "Reposición hídrica agresiva con cristaloides y activación de protocolo de hemorragia masiva",
          "Antibióticos profilácticos"
        ],
        "answerIndex": 2,
        "explanation": "Pérdida >1,000 mL con hipotensión y taquicardia corresponde a choque grado III. Se debe iniciar reanimación hídrica inmediata y protocolo de hemorragia obstétrica, además de masaje uterino y uterotónicos.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Estados hipertensivos del embarazo",
    "subtema": "Hipertensión crónica con preeclampsia sobreagregada",
    "difficulty": "Alta",
    "case": "Mujer de 38 años, G3P2, 32 semanas de gestación. Antecedente de hipertensión arterial diagnosticada hace 4 años, en tratamiento con metildopa desde el inicio del embarazo. En controles previos mantenía cifras promedio de 135/85 mmHg sin proteinuria. Acude por cefalea progresiva de 48 horas, edema facial marcado y disminución de movimientos fetales. TA 168/110 mmHg en dos tomas separadas por 20 minutos. FC 96 lpm. Reflejos osteotendinosos ++ con clonus leve. Laboratorio: •     Plaquetas 145,000/mm³ •     Creatinina 1.2 mg/dL (previa 0.7 mg/dL) •     TGO 85 U/L •     Relación proteína/creatinina 0.8 USG obstétrico: feto con peso estimado en percentil 8 para edad gestacional, líquido amniótico disminuido.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Hipertensión crónica descontrolada",
          "Preeclampsia sin datos de severidad",
          "Hipertensión gestacional",
          "Hipertensión crónica con preeclampsia sobreagregada"
        ],
        "answerIndex": 3,
        "explanation": "En paciente con hipertensión crónica que desarrolla proteinuria nueva y datos de severidad se diagnostica preeclampsia sobreagregada. El manejo requiere hospitalización, prevención de eclampsia y valoración para interrupción según evolución.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta adecuada según GPC mexicana?",
        "options": [
          "Ajustar antihipertensivo y continuar embarazo hasta 37 semanas",
          "Alta domiciliaria con vigilancia semanal",
          "Hospitalización, sulfato de magnesio y valorar interrupción según estabilidad materno- fetal",
          "Solo vigilancia fetal ambulatoria"
        ],
        "answerIndex": 2,
        "explanation": "En paciente con hipertensión crónica que desarrolla proteinuria nueva y datos de severidad se diagnostica preeclampsia sobreagregada. El manejo requiere hospitalización, prevención de eclampsia y valoración para interrupción según evolución.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Parto pretérmino",
    "subtema": "Ruptura prematura de membranas pretérmino (<34 semanas)",
    "difficulty": "Alta",
    "case": "Paciente de 27 años, G2P1, 30 semanas de gestación. Refiere salida súbita de líquido claro transvaginal hace 3 horas. Niega contracciones. Sin fiebre ni dolor abdominal. Exploración con espéculo: salida de líquido a través de OCE, prueba de cristalización positiva. TA 110/70 mmHg. FC 88 lpm. Temperatura 36.8°C. Biometría hemática normal. FCF 148 lpm reactiva. USG con líquido amniótico disminuido, feto acorde a edad gestacional.",
    "questions": [
      {
        "question": "¿Cuál es la conducta adecuada?",
        "options": [
          "Inducir trabajo de parto de inmediato",
          "Alta domiciliaria",
          "Cesárea urgente",
          "Manejo expectante hospitalario con antibióticos y esquema de maduración pulmonar"
        ],
        "answerIndex": 3,
        "explanation": "En RPM pretérmino <34 semanas sin datos de infección, se recomienda manejo expectante hospitalario, antibióticos para prolongar latencia y corticoesteroides para maduración pulmonar. La ampicilina forma parte del esquema inicial.",
        "gpcReference": ""
      },
      {
        "question": "¿Qué antibiótico forma parte del esquema recomendado para prolongar latencia?",
        "options": [
          "Ciprofloxacino",
          "Ceftriaxona",
          "Ampicilina",
          "Metronidazol"
        ],
        "answerIndex": 2,
        "explanation": "En RPM pretérmino <34 semanas sin datos de infección, se recomienda manejo expectante hospitalario, antibióticos para prolongar latencia y corticoesteroides para maduración pulmonar. La ampicilina forma parte del esquema inicial.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Embarazo múltiple",
    "subtema": "Síndrome de transfusión feto-fetal",
    "difficulty": "Alta",
    "case": "Paciente de 29 años, G1, 26 semanas de gestación gemelar monocoriónica biamniótica. En ultrasonido de control se observa un feto con polihidramnios severo y vejiga distendida, y el otro con oligohidramnios severo y vejiga colapsada. Diferencia significativa en peso estimado fetal. Doppler umbilical con alteraciones en el feto donador. La paciente refiere aumento rápido del perímetro abdominal y disnea leve.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Restricción selectiva del crecimiento",
          "Embarazo gemelar bicorial",
          "Síndrome de transfusión feto-fetal",
          "Corioamnionitis"
        ],
        "answerIndex": 2,
        "explanation": "En embarazo monocoriónico con discordancia de líquido amniótico y compromiso hemodinámico, el tratamiento definitivo es la ablación láser de las anastomosis placentarias.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el tratamiento de elección?",
        "options": [
          "Inducción inmediata",
          "Amniocentesis evacuadora aislada",
          "Manejo expectante",
          "Fotocoagulación láser de anastomosis placentarias"
        ],
        "answerIndex": 3,
        "explanation": "En embarazo monocoriónico con discordancia de líquido amniótico y compromiso hemodinámico, el tratamiento definitivo es la ablación láser de las anastomosis placentarias.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología del trabajo de parto",
    "subtema": "Sufrimiento fetal agudo intraparto",
    "difficulty": "Alta",
    "case": "Mujer de 25 años, G1, 40 semanas. Trabajo de parto activo con 7 cm de dilatación. Monitoreo electrónico fetal muestra desaceleraciones tardías recurrentes en más del 50% de las contracciones durante 30 minutos, variabilidad mínima y ausencia de aceleraciones. TA materna normal. No fiebre. Líquido amniótico con meconio espeso.",
    "questions": [
      {
        "question": "¿Qué categoría del monitoreo fetal corresponde?",
        "options": [
          "Categoría I",
          "Categoría II",
          "Categoría III",
          "Normal"
        ],
        "answerIndex": 2,
        "explanation": "Patrón categoría III implica hipoxia fetal. Si no hay parto vaginal inminente, se debe proceder a resolución inmediata.",
        "gpcReference": ""
      },
      {
        "question": "Conducta inmediata:",
        "options": [
          "Continuar vigilancia",
          "Cambiar posición materna y esperar",
          "Oxigenoterapia únicamente",
          "Resolución inmediata del embarazo (cesárea si no es inminente parto vaginal)"
        ],
        "answerIndex": 3,
        "explanation": "Patrón categoría III implica hipoxia fetal. Si no hay parto vaginal inminente, se debe proceder a resolución inmediata.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología del embarazo",
    "subtema": "Oligohidramnios con restricción del crecimiento intrauterino",
    "difficulty": "Media–Alta",
    "case": "Paciente de 34 años, G2P1, 35 semanas. Control prenatal irregular. Refiere disminución de movimientos fetales en los últimos 2 días. USG: índice de líquido amniótico 3 cm, peso estimado fetal en percentil 5, Doppler umbilical con aumento de resistencia. TA 150/95 mmHg. Proteinuria +.",
    "questions": [
      {
        "question": "¿Cuál es la conducta más adecuada?",
        "options": [
          "Manejo expectante hasta 37 semanas",
          "Hidratación oral y alta",
          "Inducción inmediata del trabajo de parto o cesárea según condiciones obstétricas",
          "Solo vigilancia semanal"
        ],
        "answerIndex": 2,
        "explanation": "Oligohidramnios severo con restricción y alteración Doppler sugiere compromiso fetal. Se recomienda interrupción del embarazo tras valoración integral.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Trabajo de parto fisiológico y análisis con partograma",
    "difficulty": "Alta",
    "case": "Paciente de 23 años, G1, 39 semanas de gestación, sin comorbilidades. Inicia trabajo de parto espontáneo hace 10 horas. Membranas íntegras. A su ingreso presentaba 3 cm de dilatación, 70% de borramiento, presentación cefálica en -2 estación. Se inicia vigilancia con partograma. Después de 6 horas en fase activa, se documenta progresión de 4 cm a 5 cm únicamente. Contracciones 3 en 10 minutos, intensidad moderada. FCF 145 lpm reactiva. Pelvis clínica adecuada. No fiebre.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Trabajo de parto normal",
          "Fase latente prolongada",
          "Arresto secundario de dilatación",
          "Progreso inadecuado en fase activa"
        ],
        "answerIndex": 3,
        "explanation": "En fase activa debe haber progresión cervical adecuada. Si no la hay y no existe desproporción cefalopélvica, se recomienda conducción con oxitocina y/o amniotomía bajo monitoreo continuo.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta recomendada según GPC mexicana?",
        "options": [
          "Cesárea inmediata",
          "Manejo expectante indefinido",
          "Amniotomía y conducción con oxitocina bajo vigilancia",
          "Alta domiciliaria"
        ],
        "answerIndex": 2,
        "explanation": "En fase activa debe haber progresión cervical adecuada. Si no la hay y no existe desproporción cefalopélvica, se recomienda conducción con oxitocina y/o amniotomía bajo monitoreo continuo.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Complicaciones obstétricas graves",
    "subtema": "Embolia de líquido amniótico",
    "difficulty": "Alta",
    "case": "Paciente de 35 años, G2P1, 40 semanas, en trabajo de parto activo con 8 cm de dilatación. Súbitamente presenta disnea intensa, cianosis, hipotensión (TA 70/40 mmHg), taquicardia 130 lpm y pérdida del estado de alerta. Se documenta bradicardia fetal severa. Posteriormente desarrolla sangrado incoercible por sitio de venopunción y datos de coagulopatía. No antecedente de cardiopatía ni alergias.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Tromboembolia pulmonar",
          "Ruptura uterina",
          "Anafilaxia",
          "Embolia de líquido amniótico"
        ],
        "answerIndex": 3,
        "explanation": "La embolia de líquido amniótico se presenta con colapso cardiovascular súbito, hipoxia y coagulopatía. El manejo es soporte vital avanzado inmediato y resolución obstétrica si la paciente no ha parido.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la prioridad en el manejo?",
        "options": [
          "Heparina inmediata",
          "Antihistamínicos",
          "Soporte vital avanzado, manejo en UCI y resolución obstétrica urgente",
          "Manejo expectante"
        ],
        "answerIndex": 2,
        "explanation": "La embolia de líquido amniótico se presenta con colapso cardiovascular súbito, hipoxia y coagulopatía. El manejo es soporte vital avanzado inmediato y resolución obstétrica si la paciente no ha parido.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología puerperal",
    "subtema": "Inversión uterina",
    "difficulty": "Alta",
    "case": "Paciente de 20 años, G1P1, parto eutócico hace 10 minutos. Durante el alumbramiento se realiza tracción excesiva del cordón umbilical sin signos claros de desprendimiento placentario. Inmediatamente presenta dolor intenso, hemorragia masiva y choque hipovolémico. A la exploración no se palpa fondo uterino en abdomen y se observa masa roja protruyendo por vagina. TA 80/40 mmHg, FC 140 lpm.",
    "questions": [
      {
        "question": "¿Cuál es el manejo inicial más adecuado?",
        "options": [
          "Histerectomía inmediata",
          "Legrado uterino",
          "Administración exclusiva de uterotónicos",
          "Reposición manual inmediata del útero y reanimación hemodinámica"
        ],
        "answerIndex": 3,
        "explanation": "La inversión uterina es una emergencia obstétrica. La prioridad es reposicionar manualmente el útero de inmediato y estabilizar hemodinámicamente a la paciente.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología del embarazo",
    "subtema": "Polihidramnios asociado a diabetes",
    "difficulty": "Media–Alta",
    "case": "Paciente de 33 años, G2P1, 34 semanas, con diagnóstico de diabetes gestacional en tratamiento irregular. Refiere disnea progresiva y sensación de distensión abdominal excesiva. USG: índice de líquido amniótico 28 cm, feto macrosómico estimado en percentil 95. Doppler normal. No contracciones. TA normal.",
    "questions": [
      {
        "question": "¿Cuál es la causa más probable del polihidramnios?",
        "options": [
          "Atresia esofágica",
          "Infección intrauterina",
          "Diabetes gestacional mal controlada",
          "Insuficiencia placentaria"
        ],
        "answerIndex": 2,
        "explanation": "La hiperglucemia fetal genera poliuria osmótica, produciendo polihidramnios. Se asocia a riesgo aumentado de parto pretérmino y distocia por macrosomía.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la principal complicación obstétrica asociada?",
        "options": [
          "Oligohidramnios",
          "Restricción del crecimiento",
          "Desprendimiento prematuro de placenta",
          "Parto pretérmino"
        ],
        "answerIndex": 3,
        "explanation": "La hiperglucemia fetal genera poliuria osmótica, produciendo polihidramnios. Se asocia a riesgo aumentado de parto pretérmino y distocia por macrosomía.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Cardiopatías en el embarazo",
    "subtema": "Miocardiopatía periparto",
    "difficulty": "Alta",
    "case": "Paciente de 30 años, G3P3, 2 semanas postparto. Acude por disnea progresiva, ortopnea y edema en extremidades inferiores. Niega fiebre. TA 100/60 mmHg, FC 115 lpm. Estertores crepitantes bibasales. Ingurgitación yugular. Ecocardiograma: fracción de eyección 35%, dilatación ventricular izquierda. No antecedentes cardiacos previos.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Tromboembolia pulmonar",
          "Neumonía",
          "Miocardiopatía periparto",
          "Crisis hipertensiva"
        ],
        "answerIndex": 2,
        "explanation": "La miocardiopatía periparto ocurre en el último mes de embarazo o primeros meses postparto con disfunción sistólica. El manejo es similar al de insuficiencia cardiaca, considerando seguridad en lactancia.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es parte fundamental del tratamiento?",
        "options": [
          "Betabloqueador contraindicado",
          "Suspender lactancia obligatoriamente",
          "Diuréticos y tratamiento estándar de insuficiencia cardiaca ajustado al puerperio",
          "Solo reposo"
        ],
        "answerIndex": 2,
        "explanation": "La miocardiopatía periparto ocurre en el último mes de embarazo o primeros meses postparto con disfunción sistólica. El manejo es similar al de insuficiencia cardiaca, considerando seguridad en lactancia.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Control prenatal",
    "subtema": "Isoinmunización Rh y profilaxis anti-D",
    "difficulty": "Alta",
    "case": "Mujer de 27 años, G2P1, 28 semanas de gestación. Grupo sanguíneo O Rh negativo. Su primer embarazo terminó en parto eutócico hace 3 años; el recién nacido fue Rh positivo. La paciente refiere que no recuerda haber recibido alguna inyección posterior al parto. En el embarazo actual, el Coombs indirecto al inicio fue negativo. En la consulta actual se repite Coombs indirecto y continúa negativo. No presenta sangrado ni procedimientos invasivos recientes. Ultrasonido obstétrico normal, sin datos de hidrops fetal.",
    "questions": [
      {
        "question": "¿Cuál es la conducta indicada en este momento?",
        "options": [
          "No hacer nada hasta el parto",
          "Aplicar gammaglobulina anti-D solo si el recién nacido es Rh positivo",
          "Aplicar gammaglobulina anti-D dentro de las primeras 72 horas posparto únicamente",
          "Administrar inmunoglobulina anti-D profiláctica a las 28 semanas"
        ],
        "answerIndex": 3,
        "explanation": "Según NOM-007 y GPC mexicana, toda paciente Rh negativa no sensibilizada debe recibir profilaxis con inmunoglobulina anti-D a las 28 semanas y dentro de las 72 horas posparto si el recién nacido es Rh positivo. También está indicada ante eventos que puedan generar hemorragia feto-materna (amniocentesis, sangrado, trauma abdominal).",
        "gpcReference": ""
      },
      {
        "question": "¿En cuál de las siguientes situaciones también está indicada la aplicación de anti-D durante el embarazo?",
        "options": [
          "Hipertensión gestacional",
          "Diabetes gestacional",
          "Procedimiento invasivo como amniocentesis",
          "Trabajo de parto fisiológico sin complicaciones"
        ],
        "answerIndex": 2,
        "explanation": "Según NOM-007 y GPC mexicana, toda paciente Rh negativa no sensibilizada debe recibir profilaxis con inmunoglobulina anti-D a las 28 semanas y dentro de las 72 horas posparto si el recién nacido es Rh positivo. También está indicada ante eventos que puedan generar hemorragia feto-materna (amniocentesis, sangrado, trauma abdominal).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología del embarazo",
    "subtema": "Restricción del crecimiento intrauterino con Doppler severamente alterado",
    "difficulty": "Alta",
    "case": "Paciente de 35 años, G2P1, 33 semanas de gestación. Antecedente de preeclampsia en embarazo previo. Acude por disminución de movimientos fetales. TA 150/100 mmHg. Proteinuria +++. Ultrasonido obstétrico: peso fetal estimado en percentil 3, índice de líquido amniótico 4 cm. Doppler de arteria umbilical con flujo diastólico ausente persistente. Perfil biofísico 6/10.",
    "questions": [
      {
        "question": "¿Cuál es la conducta más adecuada?",
        "options": [
          "Manejo expectante hasta 37 semanas",
          "Hidratación materna y control en una semana",
          "Administración de tocolíticos",
          "Interrupción del embarazo tras estabilización materna"
        ],
        "answerIndex": 3,
        "explanation": "La ausencia persistente de flujo diastólico en arteria umbilical es un dato de compromiso fetal severo. Según GPC mexicana, está indicada la interrupción del embarazo tras valorar estabilidad materno-fetal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología tromboembólica en el embarazo",
    "subtema": "Trombosis venosa profunda",
    "difficulty": "Media–Alta",
    "case": "Mujer de 30 años, G2P1, 29 semanas de gestación. Obesidad grado II. Refiere dolor y aumento de volumen en pierna izquierda desde hace 48 horas. Niega fiebre. A la exploración: edema asimétrico, aumento de temperatura local, dolor a la palpación en trayecto venoso profundo. Signos vitales estables. Ultrasonido Doppler confirma trombosis venosa profunda femoropoplítea izquierda.",
    "questions": [
      {
        "question": "¿Cuál es el tratamiento de elección?",
        "options": [
          "Warfarina",
          "Rivaroxabán",
          "Heparina de bajo peso molecular",
          "Aspirina"
        ],
        "answerIndex": 2,
        "explanation": "La heparina de bajo peso molecular es el tratamiento de elección en embarazo. Los anticoagulantes antagonistas de vitamina K son teratogénicos y atraviesan la placenta.",
        "gpcReference": ""
      },
      {
        "question": "¿Por qué está contraindicada la warfarina en el embarazo?",
        "options": [
          "No es efectiva",
          "Aumenta riesgo de hemorragia materna exclusivamente",
          "Produce hipertensión",
          "Es teratogénica y atraviesa la placenta"
        ],
        "answerIndex": 3,
        "explanation": "La heparina de bajo peso molecular es el tratamiento de elección en embarazo. Los anticoagulantes antagonistas de vitamina K son teratogénicos y atraviesan la placenta.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Macrosomía fetal",
    "difficulty": "Media–Alta",
    "case": "Paciente de 38 años, G4P3, 39 semanas. Diabetes gestacional con control irregular. Ultrasonido con peso fetal estimado de 4,450 g. Pelvis clínica aparentemente adecuada. No antecedente de cesárea previa.",
    "questions": [
      {
        "question": "¿Cuál es la recomendación según lineamientos mexicanos en sospecha de macrosomía ≥4,500 g en madre diabética?",
        "options": [
          "Intentar parto vaginal sin precauciones",
          "Inducir trabajo de parto inmediatamente",
          "Cesárea electiva programada",
          "Manejo expectante hasta 41 semanas"
        ],
        "answerIndex": 2,
        "explanation": "En madres diabéticas con peso estimado ≥4,500 g se recomienda considerar cesárea electiva para disminuir riesgo de distocia de hombros.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Marco normativo en atención obstétrica",
    "subtema": "Violencia obstétrica (NOM-007)",
    "difficulty": "Media",
    "case": "Paciente de 19 años, G1, en trabajo de parto activo. Refiere que durante la atención médica se le realizaron múltiples tactos vaginales por diferentes personas sin explicación ni consentimiento. Además, se le practicó episiotomía sin indicación clínica clara y sin informarle previamente. No hubo complicaciones médicas, pero la paciente presenta angustia significativa posterior al evento.",
    "questions": [
      {
        "question": "Según la NOM-007 y lineamientos nacionales, lo ocurrido se clasifica como:",
        "options": [
          "Procedimiento estándar sin relevancia legal",
          "Complicación obstétrica inevitable",
          "Violencia obstétrica por prácticas invasivas sin consentimiento informado",
          "Mala praxis exclusivamente penal"
        ],
        "answerIndex": 2,
        "explanation": "La NOM -007 establece la obligación de brindar atención digna, respetuosa y con consentimiento informado. Procedimientos innecesarios o sin información adecuada constituyen violencia obstétrica.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trastornos hipertensivos del embarazo",
    "subtema": "Eclampsia y manejo de toxicidad por sulfato de magnesio",
    "difficulty": "Alta",
    "case": "Paciente de 24 años, G1, 36 semanas de gestación. Acude por cefalea intensa occipital, fosfenos y dolor en epigastrio. TA 170/110 mmHg. Proteinuria +++. Durante la valoración presenta crisis convulsiva tónico-clónica generalizada de 1 minuto de duración. Se inicia manejo con sulfato de magnesio esquema de Pritchard. Dos horas después, la paciente se encuentra somnolienta, con frecuencia respiratoria de 8 rpm, reflejos osteotendinosos abolidos y diuresis de 15 mL/h en las últimas 2 horas.",
    "questions": [
      {
        "question": "¿Cuál es la complicación más probable?",
        "options": [
          "Evento vascular cerebral",
          "Toxicidad por sulfato de magnesio",
          "Síndrome HELLP",
          "Hipoglucemia severa"
        ],
        "answerIndex": 1,
        "explanation": "La depresión respiratoria y abolición de reflejos son datos clásicos de toxicidad por magnesio. El antídoto es gluconato de calcio IV. Debe suspenderse inmediatamente la infusión.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta inmediata?",
        "options": [
          "Administrar diazepam",
          "Suspender magnesio y administrar gluconato de calcio IV",
          "Iniciar ventilación no invasiva sin suspender magnesio",
          "Administrar más sulfato de magnesio"
        ],
        "answerIndex": 1,
        "explanation": "La depresión respiratoria y abolición de reflejos son datos clásicos de toxicidad por magnesio. El antídoto es gluconato de calcio IV. Debe suspenderse inmediatamente la infusión.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Complicaciones hepáticas del embarazo",
    "subtema": "Hígado graso agudo del embarazo",
    "difficulty": "Alta",
    "case": "Paciente de 29 años, G2P1, 35 semanas. Refiere náusea persistente, vómitos, malestar general y dolor en hipocondrio derecho desde hace 4 días. TA 140/90 mmHg. No proteinuria significativa. Laboratorios: AST 350 U/L, ALT 280 U/L, bilirrubina total 4.2 mg/dL, glucosa 52 mg/dL, plaquetas 140,000, creatinina 1.8 mg/dL, INR prolongado. USG hepático sin datos de obstrucción biliar. No antecedente de hepatitis viral.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Colestasis intrahepática del embarazo",
          "Hepatitis viral aguda",
          "Síndrome HELLP",
          "Hígado graso agudo del embarazo"
        ],
        "answerIndex": 3,
        "explanation": "La hipoglucemia, alteración de coagulación y falla hepatorrenal sugieren hígado graso agudo. Es una emergencia obstétrica que requiere interrupción inmediata.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta indicada?",
        "options": [
          "Manejo expectante hasta 37 semanas",
          "Administración de ácido ursodesoxicólico",
          "Interrupción inmediata del embarazo tras estabilización materna",
          "Solo vigilancia en consulta externa"
        ],
        "answerIndex": 2,
        "explanation": "La hipoglucemia, alteración de coagulación y falla hepatorrenal sugieren hígado graso agudo. Es una emergencia obstétrica que requiere interrupción inmediata.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias obstétricas",
    "subtema": "Atonía uterina refractaria",
    "difficulty": "Alta",
    "case": "Paciente de 32 años, G3P3, parto vaginal hace 30 minutos. Producto macrosómico de 4,200 g. Presenta sangrado abundante estimado en 1,200 mL. Útero blando a la palpación. Se administra masaje uterino y oxitocina IV sin respuesta adecuada. Posteriormente se administran metilergonovina y misoprostol rectal sin mejoría significativa. Persiste hipotensión 85/50 mmHg.",
    "questions": [
      {
        "question": "¿Cuál es el siguiente paso en el manejo escalonado?",
        "options": [
          "Legrado uterino inmediato",
          "Colocación de balón de taponamiento uterino (Bakri)",
          "Alta hospitalaria",
          "Esperar respuesta a uterotónicos"
        ],
        "answerIndex": 1,
        "explanation": "En atonía refractaria a uterotónicos, el siguiente paso es taponamiento uterino con balón. Si falla, se considera manejo quirúrgico (B-Lynch o histerectomía).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología hepática",
    "subtema": "Colestasis intrahepática del embarazo",
    "difficulty": "Media–Alta",
    "case": "Paciente de 31 años, G2P1, 33 semanas. Refiere prurito intenso predominante en palmas y plantas, peor por la noche, sin lesiones cutáneas primarias. Niega fiebre. Laboratorios: bilirrubinas normales, AST y ALT ligeramente elevadas, ácidos biliares séricos elevados. Perfil biofísico normal.",
    "questions": [
      {
        "question": "¿Cuál es el tratamiento farmacológico indicado?",
        "options": [
          "Prednisona",
          "Ácido ursodesoxicólico",
          "Vitamina K exclusivamente",
          "Antihistamínicos como tratamiento definitivo"
        ],
        "answerIndex": 1,
        "explanation": "La colestasis se asocia a aumento de riesgo de muerte fetal súbita. Se recomienda considerar interrupción alrededor de las 37 semanas según evolución.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la principal complicación fetal asociada?",
        "options": [
          "Macrosomía",
          "Restricción del crecimiento",
          "Muerte fetal intrauterina",
          "Cardiopatía congénita"
        ],
        "answerIndex": 2,
        "explanation": "La colestasis se asocia a aumento de riesgo de muerte fetal súbita. Se recomienda considerar interrupción alrededor de las 37 semanas según evolución.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Inducción fallida",
    "difficulty": "Media–Alta",
    "case": "Paciente de 40 años, G2P1, 41 semanas. Bishop inicial 3 puntos. Se realiza maduración cervical con misoprostol y posteriormente oxitocina durante 18 horas con adecuada dinámica uterina documentada (4–5 contracciones en 10 minutos). Sin embargo, la dilatación permanece en 4 cm sin cambios durante 6 horas consecutivas. FCF reactiva. Membranas rotas hace 10 horas.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Trabajo de parto normal",
          "Fase latente prolongada",
          "Inducción fallida",
          "Distocia de hombros"
        ],
        "answerIndex": 2,
        "explanation": "Se considera inducción fallida cuando no se logra progresión adecuada tras manejo correcto con dinámica efectiva. La conducta es cesárea.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta indicada?",
        "options": [
          "Continuar oxitocina indefinidamente",
          "Cesárea",
          "Alta domiciliaria",
          "Repetir misoprostol"
        ],
        "answerIndex": 1,
        "explanation": "Se considera inducción fallida cuando no se logra progresión adecuada tras manejo correcto con dinámica efectiva. La conducta es cesárea.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del tercer trimestre",
    "subtema": "Desprendimiento prematuro de placenta normoinserta (DPPNI) severo",
    "difficulty": "Alta",
    "case": "Paciente de 34 años, G3P2, 35 semanas de gestación. Antecedente de hipertensión crónica mal controlada. Acude a urgencias por dolor abdominal súbito, intenso, continuo, acompañado de sangrado transvaginal oscuro en cantidad moderada desde hace 1 hora. Refiere disminución marcada de movimientos fetales. A la exploración: TA 90/60 mmHg, FC 120 lpm. Abdomen con hipertonía uterina, útero doloroso a la palpación, sin relajación entre contracciones. FCF 90 lpm sostenida. Laboratorios: Hb 8.5 g/dL, fibrinógeno bajo, TP y TTP prolongados.",
    "questions": [
      {
        "question": "¿Cuál es la conducta inmediata?",
        "options": [
          "Inducción del trabajo de parto",
          "Manejo expectante con vigilancia estrecha",
          "Cesárea urgente tras estabilización materna",
          "Tocolisis"
        ],
        "answerIndex": 2,
        "explanation": "El DPPNI severo con compromiso materno-fetal requiere resolución inmediata del embarazo tras estabilización hemodinámica. Existe alto riesgo de CID.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Infecciones en el embarazo",
    "subtema": "Corioamnionitis clínica",
    "difficulty": "Media–Alta",
    "case": "Paciente de 22 años, G1, 39 semanas. Ruptura de membranas desde hace 20 horas. Refiere fiebre y malestar general. Exploración: TA 110/70 mmHg, FC 115 lpm, temperatura 38.7°C. Útero doloroso a la palpación. FCF 170 lpm. Líquido amniótico fétido. Leucocitosis 18,000.",
    "questions": [
      {
        "question": "¿Cuál es el manejo indicado?",
        "options": [
          "Solo antipiréticos",
          "Antibióticos IV de amplio espectro e interrupción del embarazo",
          "Manejo expectante",
          "Cesárea inmediata sin antibióticos"
        ],
        "answerIndex": 1,
        "explanation": "La corioamnionitis requiere antibióticos IV y finalización del embarazo. La vía depende de condiciones obstétricas, no es cesárea obligatoria.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Emergencias obstétricas",
    "subtema": "Ruptura uterina",
    "difficulty": "Alta",
    "case": "Paciente de 30 años, G2P1, antecedente de cesárea segmentaria hace 2 años. 40 semanas, en trabajo de parto con oxitocina. Tras varias horas, presenta dolor abdominal súbito intenso, cese de contracciones y pérdida de la estación fetal. Exploración: TA 85/50 mmHg, FC 130 lpm. FCF no detectable. Abdomen doloroso, palpación fácil de partes fetales.",
    "questions": [
      {
        "question": "¿Cuál es la conducta inmediata?",
        "options": [
          "Continuar oxitocina",
          "Laparotomía exploradora urgente",
          "Tocolíticos",
          "Vigilancia"
        ],
        "answerIndex": 1,
        "explanation": "La ruptura uterina es una emergencia vital. Se requiere laparotomía inmediata y resolución quirúrgica.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Anomalías placentarias",
    "subtema": "Espectro de acretismo placentario",
    "difficulty": "Alta",
    "case": "Paciente de 38 años, G4P3, dos cesáreas previas. USG a las 32 semanas muestra placenta anterior baja con múltiples lagunas vasculares y pérdida de la zona hipoecoica retroplacentaria. Doppler con hipervascularidad anormal. Asintomática actualmente.",
    "questions": [
      {
        "question": "¿Cuál es el plan más adecuado?",
        "options": [
          "Intentar parto vaginal",
          "Cesárea programada con equipo multidisciplinario y probable histerectomía obstétrica",
          "Manejo expectante hasta inicio espontáneo",
          "Inducción a las 37 semanas"
        ],
        "answerIndex": 1,
        "explanation": "El espectro de acretismo requiere cesárea programada en centro de tercer nivel, con alta probabilidad de histerectomía.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del tercer trimestre",
    "subtema": "Vasa previa",
    "difficulty": "Alta",
    "case": "Paciente de 29 años, G2P1, 36 semanas. Diagnóstico prenatal de inserción velamentosa del cordón con vasos fetales atravesando el orificio cervical interno. Acude por ruptura espontánea de membranas con sangrado rojo brillante inmediato. FCF 70 lpm. Madre hemodinámicamente estable.",
    "questions": [
      {
        "question": "¿Cuál es la conducta inmediata?",
        "options": [
          "Vigilancia",
          "Cesárea urgente",
          "Inducción del trabajo de parto",
          "Reposición de líquidos únicamente"
        ],
        "answerIndex": 1,
        "explanation": "En vasa previa rota, el sangrado es fetal. La bradicardia fetal indica hipovolemia aguda fetal. Se requiere cesárea inmediata.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del tercer trimestre",
    "subtema": "Placenta previa oclusiva total",
    "difficulty": "Media–Alta",
    "case": "Paciente de 33 años, G3P2, 34 semanas de gestación. Antecedente de una cesárea previa. Acude por sangrado transvaginal rojo brillante, abundante, de inicio súbito, indoloro, sin actividad uterina. Niega traumatismo. Refiere movimientos fetales normales. A la exploración: TA 110/70 mmHg, FC 95 lpm. Abdomen sin dolor a la palpación, útero relajado. FCF 140 lpm reactiva. Ultrasonido transvaginal reporta placenta que cubre completamente el orificio cervical interno.",
    "questions": [
      {
        "question": "¿Cuál es la conducta indicada?",
        "options": [
          "Tacto vaginal para valorar dilatación",
          "Inducción del trabajo de parto",
          "Cesárea programada a las 36–37 semanas si estabilidad materno-fetal",
          "Manejo expectante hasta inicio espontáneo de trabajo de parto"
        ],
        "answerIndex": 2,
        "explanation": "La placenta previa oclusiva total contraindica el parto vaginal. El tacto vaginal está contraindicado por riesgo de hemorragia masiva.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Infecciones perinatales",
    "subtema": "Ruptura prematura de membranas pretérmino (RPMPT)",
    "difficulty": "Alta",
    "case": "Paciente de 26 años, G1, 32 semanas. Refiere salida de líquido claro abundante desde hace 4 horas. Sin fiebre ni dolor abdominal. Exploración: TA 100/65 mmHg, T 36.8°C. Especuloscopía con salida de líquido claro por OCI. Prueba de cristalización positiva. FCF 145 lpm. BH normal. Sin datos clínicos de infección.",
    "questions": [
      {
        "question": "¿Cuál es el manejo adecuado?",
        "options": [
          "Inducción inmediata del parto",
          "Manejo expectante con antibióticos, maduración pulmonar y vigilancia",
          "Cesárea urgente",
          "Tocolíticos como única medida"
        ],
        "answerIndex": 1,
        "explanation": "En RPM pretérmino sin infección ni compromiso fetal, se recomienda manejo expectante con corticoesteroides y antibióticos para prolongar gestación.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Endocrinología obstétrica",
    "subtema": "Diabetes gestacional mal controlada intraparto",
    "difficulty": "Media–Alta",
    "case": "Paciente de 29 años, G2P1, 39 semanas, diabetes gestacional en tratamiento con insulina. Durante trabajo de parto presenta glucosa capilar de 210 mg/dL. Dinámica uterina adecuada. FCF normal.",
    "questions": [
      {
        "question": "¿Cuál es la meta de glucosa intraparto?",
        "options": [
          "<200 mg/dL",
          "150–180 mg/dL",
          "70–110 mg/dL",
          "<250 mg/dL"
        ],
        "answerIndex": 2,
        "explanation": "Durante el trabajo de parto se recomienda mantener glucosa entre 70–110 mg/dL para reducir riesgo de hipoglucemia neonatal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Complicaciones del puerperio",
    "subtema": "Endometritis puerperal",
    "difficulty": "Media",
    "case": "Paciente de 24 años, 4 días postcesárea. Presenta fiebre 38.5°C, dolor hipogástrico y loquios fétidos. Exploración: útero doloroso a la palpación, subinvolucionado. Leucocitosis 17,000.",
    "questions": [
      {
        "question": "¿Cuál es el tratamiento indicado?",
        "options": [
          "Antibiótico oral ambulatorio",
          "Antibióticos IV de amplio espectro (clindamicina + gentamicina)",
          "Legrado inmediato",
          "Solo antipiréticos"
        ],
        "answerIndex": 1,
        "explanation": "La endometritis puerperal requiere antibióticos IV de amplio espectro. La cesárea es factor de riesgo importante.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología hipertensiva",
    "subtema": "Hipertensión gestacional vs preeclampsia",
    "difficulty": "Media–Alta",
    "case": "Paciente de 30 años, G1, 38 semanas. TA 150/95 mmHg en dos tomas separadas por 6 horas. No cefalea, no fosfenos. EGO sin proteinuria. Plaquetas normales, enzimas hepáticas normales.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Preeclampsia sin datos de severidad",
          "Hipertensión crónica",
          "Hipertensión gestacional",
          "Síndrome HELLP"
        ],
        "answerIndex": 2,
        "explanation": "Hipertensión después de 20 semanas sin proteinuria ni datos de daño orgánico corresponde a hipertensión gestacional.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Prolapso de cordón umbilical",
    "difficulty": "Alta",
    "case": "Paciente de 27 años, G2P1, 38 semanas, en trabajo de parto activo con 6 cm de dilatación. Membranas se rompen espontáneamente durante la exploración. Inmediatamente se observa bradicardia fetal sostenida de 70 lpm. Al tacto vaginal se palpa estructura pulsátil por delante de la presentación cefálica. La paciente se encuentra hemodinámicamente estable. El quirófano está disponible.",
    "questions": [
      {
        "question": "¿Cuál es la conducta inmediata?",
        "options": [
          "Iniciar oxitocina",
          "Colocar a la paciente en posición genupectoral o Trendelenburg y elevar manualmente la presentación mientras se prepara cesárea",
          "Esperar recuperación espontánea",
          "Aplicar fórceps"
        ],
        "answerIndex": 1,
        "explanation": "El prolapso de cordón es emergencia obstétrica. Se debe disminuir la compresión del cordón mientras se realiza cesárea urgente.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trastornos hipertensivos",
    "subtema": "Preeclampsia con datos de severidad",
    "difficulty": "Alta",
    "case": "Paciente de 31 años, G1, 35 semanas. TA 165/110 mmHg, cefalea intensa persistente y fosfenos. Proteinuria ++. Plaquetas 110,000, AST 180 U/L. FCF reactiva. Sin trabajo de parto.",
    "questions": [
      {
        "question": "¿Cuál es la conducta más adecuada?",
        "options": [
          "Manejo ambulatorio",
          "Antihipertensivos y diferir resolución hasta 37 semanas",
          "Hospitalización, sulfato de magnesio y resolución del embarazo tras estabilización",
          "Solo reposo"
        ],
        "answerIndex": 2,
        "explanation": "Preeclampsia con datos de severidad requiere estabilización con antihipertensivos, profilaxis anticonvulsiva y resolución independientemente de edad gestacional >34 semanas.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragia obstétrica",
    "subtema": "Retención placentaria",
    "difficulty": "Media–Alta",
    "case": "Paciente de 22 años, G1P1, parto eutócico hace 40 minutos. Persistencia de placenta intrauterina sin signos claros de desprendimiento. Sangrado moderado continuo. Útero contraído parcialmente. Signos vitales estables.",
    "questions": [
      {
        "question": "¿Cuál es la conducta indicada?",
        "options": [
          "Esperar hasta 2 horas",
          "Tracción vigorosa del cordón",
          "Revisión manual de cavidad uterina bajo analgesia/anestesia adecuada",
          "Alta hospitalaria"
        ],
        "answerIndex": 2,
        "explanation": "Si la placenta no se expulsa en 30 minutos y hay sangrado, se indica extracción manual bajo condiciones controladas.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Infecciones en el embarazo",
    "subtema": "Pielonefritis aguda",
    "difficulty": "Alta",
    "case": "Paciente de 24 años, G1, 26 semanas. Refiere fiebre 39°C, dolor lumbar derecho y náusea. TA 100/60 mmHg, FC 115 lpm. Dolor a la puñopercusión lumbar derecha. EGO con leucocituria y bacteriuria. Leucocitos 19,000.",
    "questions": [
      {
        "question": "¿Cuál es el manejo adecuado?",
        "options": [
          "Antibiótico oral ambulatorio",
          "Hospitalización y antibióticos IV",
          "Solo hidratación",
          "Inducción del parto"
        ],
        "answerIndex": 1,
        "explanation": "La pielonefritis en embarazo requiere hospitalización por riesgo de sepsis y parto pretérmino.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología fetal",
    "subtema": "Oligohidramnios severo a término",
    "difficulty": "Media–Alta",
    "case": "Paciente de 36 años, G2P1, 39 semanas. Refiere disminución de movimientos fetales. USG reporta índice de líquido amniótico de 3 cm. Perfil biofísico 6/10. Doppler normal.",
    "questions": [
      {
        "question": "¿Cuál es la conducta indicada?",
        "options": [
          "Manejo expectante 2 semanas",
          "Hidratación materna y reevaluar en 1 semana",
          "Interrupción del embarazo",
          "Tocolíticos"
        ],
        "answerIndex": 2,
        "explanation": "Oligohidramnios severo a término es indicación de interrupción por riesgo de sufrimiento fetal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trastornos hipertensivos del embarazo",
    "subtema": "Eclampsia intraparto",
    "difficulty": "Alta",
    "case": "Paciente de 19 años, G1, 38 semanas, sin control prenatal adecuado. Ingresa en trabajo de parto con TA 170/115 mmHg, cefalea intensa y visión borrosa. Proteinuria +++. Durante la valoración presenta crisis convulsiva tónico-clónica generalizada de 90 segundos. Posterior a la crisis: FCF 100 lpm con desaceleraciones tardías recurrentes. Dilatación 5 cm.",
    "questions": [
      {
        "question": "¿Cuál es el manejo inicial inmediato?",
        "options": [
          "Diazepam IV",
          "Sulfato de magnesio esquema de carga",
          "Fenitoína",
          "Cesárea inmediata sin estabilización"
        ],
        "answerIndex": 1,
        "explanation": "El tratamiento de primera línea para prevenir recurrencia convulsiva es sulfato de magnesio. Benzodiacepinas no son de elección inicial.",
        "gpcReference": ""
      },
      {
        "question": "Tras estabilización materna, ¿cuál es la conducta obstétrica?",
        "options": [
          "Manejo expectante hasta 40 semanas",
          "Alta domiciliaria",
          "Resolución del embarazo independientemente de la vía",
          "Suspender trabajo de parto"
        ],
        "answerIndex": 2,
        "explanation": "La eclampsia es indicación de interrupción tras estabilización. La vía depende de condiciones obstétricas y estado fetal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias obstétricas",
    "subtema": "Atonía uterina con choque hipovolémico",
    "difficulty": "Alta",
    "case": "Paciente de 35 años, G4P4, parto vaginal hace 20 minutos. Producto de 4,300 g. Presenta sangrado masivo estimado en 1,800 mL. Útero flácido. TA 80/40 mmHg, FC 135 lpm, piel fría. Se inicia masaje uterino y oxitocina sin respuesta inmediata.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Laceración cervical",
          "Atonía uterina",
          "Inversión uterina",
          "Retención placentaria"
        ],
        "answerIndex": 1,
        "explanation": "Útero blando y sangrado abundante posparto sugieren atonía uterina como causa principal.",
        "gpcReference": ""
      },
      {
        "question": "Además de uterotónicos, ¿cuál es parte fundamental del manejo inmediato?",
        "options": [
          "Observación",
          "Reposición agresiva de volumen y protocolo de transfusión masiva",
          "Alta hospitalaria",
          "Solo ácido tranexámico"
        ],
        "answerIndex": 1,
        "explanation": "Debe iniciarse reanimación hemodinámica inmediata con cristaloides y hemoderivados según protocolo.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Infecciones obstétricas",
    "subtema": "Sepsis puerperal",
    "difficulty": "Alta",
    "case": "Paciente de 28 años, 5 días postcesárea. Presenta fiebre 39°C, hipotensión 85/50 mmHg, taquicardia 125 lpm, loquios fétidos y dolor abdominal intenso. Lactato elevado. Se sospecha foco uterino.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico sindromático?",
        "options": [
          "Fiebre puerperal simple",
          "Sepsis puerperal",
          "Mastitis",
          "Endometritis leve"
        ],
        "answerIndex": 1,
        "explanation": "Hipotensión + taquicardia + foco infeccioso indican sepsis.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta inicial?",
        "options": [
          "Antibiótico oral",
          "Antibióticos IV de amplio espectro y protocolo de sepsis",
          "Solo líquidos",
          "Legrado inmediato sin antibióticos"
        ],
        "answerIndex": 1,
        "explanation": "Se debe iniciar antibiótico IV de amplio espectro y manejo integral de sepsis (ABC, líquidos, monitoreo).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Sufrimiento fetal agudo intraparto",
    "difficulty": "Alta",
    "case": "Paciente de 30 años, G2P1, 40 semanas, en fase activa con 8 cm de dilatación. Monitor muestra desaceleraciones tardías repetitivas, variabilidad mínima y taquicardia fetal 170 lpm. Contracciones adecuadas. No fiebre materna.",
    "questions": [
      {
        "question": "¿Qué patrón cardiotocográfico presenta?",
        "options": [
          "Categoría I",
          "Categoría II",
          "Categoría III",
          "Reactivo normal"
        ],
        "answerIndex": 2,
        "explanation": "Desaceleraciones tardías + variabilidad mínima indican patrón categoría III.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta?",
        "options": [
          "Continuar trabajo de parto",
          "Cesárea urgente si no hay mejoría inmediata tras medidas intrauterinas",
          "Alta",
          "Solo oxígeno"
        ],
        "answerIndex": 1,
        "explanation": "Si no mejora tras suspensión de oxitocina, cambio de posición y oxígeno, debe resolverse de manera urgente.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Endocrinología obstétrica",
    "subtema": "Cetoacidosis diabética en embarazo",
    "difficulty": "Alta",
    "case": "Paciente de 26 años, G1, 30 semanas, DM1. Refiere vómito, poliuria y malestar. TA 100/60 mmHg, FC 120 lpm. Glucosa 380 mg/dL, pH 7.18, bicarbonato bajo, cetonas positivas. FCF 165 lpm.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Estado hiperglucémico hiperosmolar",
          "Cetoacidosis diabética",
          "Hipoglucemia",
          "Trabajo de parto pretérmino"
        ],
        "answerIndex": 1,
        "explanation": "Hiperglucemia + acidosis metabólica + cetonas confirman CAD.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el manejo prioritario?",
        "options": [
          "Interrupción inmediata del embarazo",
          "Insulina IV e hidratación intensiva",
          "Solo antibióticos",
          "Tocolíticos"
        ],
        "answerIndex": 1,
        "explanation": "Primero se estabiliza metabólicamente a la madre. La resolución obstétrica depende de respuesta materno-fetal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del primer trimestre",
    "subtema": "Aborto diferido (retenido)",
    "difficulty": "Media–Alta",
    "case": "Paciente de 30 años, G2P1, 11 semanas por FUM. Acude por manchado escaso oscuro desde hace 3 días, sin dolor tipo cólico intenso. Refiere disminución de síntomas gestacionales (náusea y mastalgia). Exploración: TA 110/70 mmHg. Cérvix cerrado. Útero acorde a 9 semanas. USG transvaginal: saco gestacional con embrión de 8 semanas sin actividad cardiaca. No líquido libre.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Amenaza de aborto",
          "Aborto incompleto",
          "Aborto diferido",
          "Embarazo anembrionado"
        ],
        "answerIndex": 2,
        "explanation": "Embrión sin actividad cardiaca con cérvix cerrado corresponde a aborto diferido (retenido).",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es una opción de manejo adecuada en paciente hemodinámicamente estable?",
        "options": [
          "Solo vigilancia obligatoria",
          "Misoprostol para evacuación uterina",
          "Histerectomía",
          "Antibióticos IV obligatorios"
        ],
        "answerIndex": 1,
        "explanation": "En paciente estable puede optarse por manejo médico con misoprostol o manejo quirúrgico según preferencia y condiciones clínicas.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Fase activa prolongada",
    "difficulty": "Alta",
    "case": "Paciente de 25 años, G1, 40 semanas, en trabajo de parto. Dilatación progresa de 6 a 7 cm en 5 horas, con dinámica uterina adecuada (4–5 contracciones/10 min). Pelvis clínica adecuada. Membranas rotas hace 6 horas. FCF normal.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Trabajo de parto normal",
          "Fase latente prolongada",
          "Prolongación de fase activa",
          "Arresto secundario"
        ],
        "answerIndex": 2,
        "explanation": "En fase activa se espera progresión mayor; progreso lento con dinámica adecuada sugiere prolongación de fase activa.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta inicial?",
        "options": [
          "Cesárea inmediata",
          "Revalorar proporción cefalopélvica y considerar conducción con oxitocina",
          "Alta domiciliaria",
          "Tocolíticos"
        ],
        "answerIndex": 1,
        "explanation": "Debe evaluarse causa (potencia, pasajero, pelvis) y optimizar dinámica antes de decidir cesárea.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del tercer trimestre",
    "subtema": "Desprendimiento prematuro de placenta leve",
    "difficulty": "Media–Alta",
    "case": "Paciente de 29 años, G2P1, 36 semanas. Dolor abdominal leve continuo y sangrado oscuro escaso. TA 130/85 mmHg. Útero discretamente doloroso. FCF 140 lpm reactiva. USG sin placenta previa.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Placenta previa",
          "Desprendimiento prematuro de placenta leve",
          "Ruptura uterina",
          "Trabajo de parto normal"
        ],
        "answerIndex": 1,
        "explanation": "Dolor + sangrado oscuro y útero sensible orientan a DPPNI.",
        "gpcReference": ""
      },
      {
        "question": "Si madre y feto están estables, ¿cuál es la conducta?",
        "options": [
          "Cesárea inmediata obligatoria",
          "Manejo expectante con vigilancia estrecha",
          "Alta inmediata",
          "Tocolíticos"
        ],
        "answerIndex": 1,
        "explanation": "En casos leves sin compromiso puede optarse por vigilancia hospitalaria.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Infecciones del embarazo",
    "subtema": "VIH en embarazo",
    "difficulty": "Alta",
    "case": "Paciente de 27 años, G1, 32 semanas. Diagnóstico reciente de VIH. Carga viral 15,000 copias/mL. No tratamiento previo. Sin complicaciones obstétricas.",
    "questions": [
      {
        "question": "¿Cuál es la medida más importante para reducir transmisión vertical?",
        "options": [
          "Cesárea obligatoria en todos los casos",
          "Terapia antirretroviral combinada",
          "Antibióticos",
          "Interrupción del embarazo"
        ],
        "answerIndex": 1,
        "explanation": "El control de carga viral con TAR reduce significativamente transmisión vertical.",
        "gpcReference": ""
      },
      {
        "question": "Si al final del embarazo la carga viral es >1,000 copias/mL, ¿qué se recomienda?",
        "options": [
          "Parto vaginal",
          "Cesárea electiva",
          "Inducción obligatoria",
          "Nada adicional"
        ],
        "answerIndex": 1,
        "explanation": "Carga viral elevada al final del embarazo es indicación de cesárea programada para reducir transmisión.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Complicaciones tromboembólicas",
    "subtema": "Tromboembolia pulmonar en embarazo",
    "difficulty": "Alta",
    "case": "Paciente de 34 años, G2P1, 30 semanas. Inicio súbito de disnea, dolor torácico pleurítico y taquicardia 120 lpm. Saturación 88%. Sin fiebre. Pierna derecha con edema leve.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Neumonía",
          "Tromboembolia pulmonar",
          "Crisis asmática",
          "Edema agudo pulmonar"
        ],
        "answerIndex": 1,
        "explanation": "Disnea súbita, hipoxemia y factores de riesgo sugieren TEP.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el tratamiento de elección?",
        "options": [
          "Warfarina",
          "Heparina de bajo peso molecular",
          "Aspirina",
          "Trombólisis inmediata en todos los casos"
        ],
        "answerIndex": 1,
        "explanation": "HBPM es tratamiento de elección en embarazo salvo inestabilidad grave.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología fetal",
    "subtema": "Restricción del crecimiento intrauterino (RCIU) temprana con Doppler",
    "difficulty": "Alta",
    "case": "Paciente de 32 años, G1, 30 semanas. Antecedente de hipertensión crónica. Refiere disminución de movimientos fetales. USG: peso fetal estimado en percentil 5, líquido amniótico en límite inferior normal. Doppler de arteria umbilical con índice de pulsatilidad elevado y flujo diastólico ausente intermitente. Doppler de arteria cerebral media con redistribución (“brain sparing”). Perfil biofísico 8/10.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Feto pequeño constitucional",
          "RCIU tardía",
          "RCIU temprana con insuficiencia placentaria",
          "Macrosomía fetal"
        ],
        "answerIndex": 2,
        "explanation": "RCIU antes de 32 semanas con Doppler alterado y redistribución cerebral sugiere insuficiencia placentaria significativa.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta inicial más adecuada?",
        "options": [
          "Interrupción inmediata sin maduración pulmonar",
          "Maduración pulmonar y vigilancia Doppler seriada",
          "Alta domiciliaria",
          "Inducción inmediata del parto"
        ],
        "answerIndex": 1,
        "explanation": "En ausencia de deterioro severo, se administra corticoesteroide y se vigila estrechamente con Doppler seriado.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Desproporción cefalopélvica",
    "difficulty": "Alta",
    "case": "Paciente de 24 años, G1, 40 semanas. Trabajo de parto con dinámica adecuada durante 6 horas en fase activa. Dilatación permanece en 6 cm sin cambios. Cabeza fetal en -2 estación persistente. Pelvis clínica estrecha en conjugado diagonal. FCF normal.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Fase activa normal",
          "Arresto secundario de dilatación por desproporción cefalopélvica",
          "Hipodinamia uterina",
          "Fase latente prolongada"
        ],
        "answerIndex": 1,
        "explanation": "Falta de progresión con dinámica adecuada y estación alta sugiere desproporción.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta indicada?",
        "options": [
          "Aumentar oxitocina indefinidamente",
          "Cesárea",
          "Tocolíticos",
          "Esperar 12 horas más"
        ],
        "answerIndex": 1,
        "explanation": "En sospecha de desproporción cefalopélvica, la vía de resolución es cesárea.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Endocrinología obstétrica",
    "subtema": "Hipotiroidismo subclínico en embarazo",
    "difficulty": "Media–Alta",
    "case": "Paciente de 29 años, G1, 10 semanas. Asintomática. Tamiz prenatal muestra TSH 6.5 mUI/L (elevada para primer trimestre), T4 libre normal. Anticuerpos anti-TPO positivos.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Hipertiroidismo",
          "Hipotiroidismo clínico",
          "Hipotiroidismo subclínico",
          "Función tiroidea normal"
        ],
        "answerIndex": 2,
        "explanation": "TSH elevada con T4 normal corresponde a hipotiroidismo subclínico.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta adecuada?",
        "options": [
          "No tratar",
          "Iniciar levotiroxina",
          "Solo repetir estudio en tercer trimestre",
          "Propiltiouracilo"
        ],
        "answerIndex": 1,
        "explanation": "En embarazo, especialmente con anti-TPO positivos, debe iniciarse levotiroxina para reducir riesgo obstétrico.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Infecciones del embarazo",
    "subtema": "Sífilis gestacional",
    "difficulty": "Alta",
    "case": "Paciente de 23 años, G1, 24 semanas. VDRL 1:32, prueba treponémica confirmatoria positiva. Asintomática. Feto con biometría acorde a edad gestacional.",
    "questions": [
      {
        "question": "¿Cuál es el tratamiento indicado?",
        "options": [
          "Azitromicina",
          "Penicilina G benzatínica",
          "Ceftriaxona oral",
          "No tratar si asintomática"
        ],
        "answerIndex": 1,
        "explanation": "La penicilina es el único tratamiento eficaz para prevenir sífilis congénita.",
        "gpcReference": ""
      },
      {
        "question": "Si la paciente fuera alérgica a penicilina, ¿qué se recomienda?",
        "options": [
          "Doxiciclina",
          "Eritromicina",
          "Desensibilización y administrar penicilina",
          "No tratar"
        ],
        "answerIndex": 2,
        "explanation": "En embarazo debe realizarse desensibilización, ya que no hay alternativa equivalente para prevención fetal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragia obstétrica",
    "subtema": "Laceración cervical posparto",
    "difficulty": "Media–Alta",
    "case": "Paciente de 26 años, G2P2, parto vaginal instrumentado con fórceps. Posterior al alumbramiento presenta sangrado abundante. Útero firme y contraído. TA 95/60 mmHg. Al revisar canal del parto se identifica desgarro cervical sangrante.",
    "questions": [
      {
        "question": "¿Cuál es la causa más probable de la hemorragia?",
        "options": [
          "Atonía uterina",
          "Retención placentaria",
          "Laceración cervical",
          "Inversión uterina"
        ],
        "answerIndex": 2,
        "explanation": "Útero firme descarta atonía; debe sospecharse lesión del canal del parto.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el manejo indicado?",
        "options": [
          "Más oxitocina",
          "Sutura quirúrgica del desgarro",
          "Masaje uterino",
          "Esperar resolución espontánea"
        ],
        "answerIndex": 1,
        "explanation": "Las lesiones del canal del parto requieren reparación quirúrgica inmediata.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología hepática del embarazo",
    "subtema": "Colestasis intrahepática con criterios de interrupción",
    "difficulty": "Alta",
    "case": "Paciente de 34 años, G2P1, 35 semanas. Refiere prurito intenso generalizado predominante en palmas y plantas, peor por la noche. Sin lesiones primarias. Laboratorios: ácidos biliares 65 μmol/L (elevados), AST y ALT discretamente elevadas, bilirrubina normal. Perfil biofísico 8/10. Doppler normal.",
    "questions": [
      {
        "question": "¿Cuál es el principal riesgo fetal asociado?",
        "options": [
          "Macrosomía",
          "Restricción del crecimiento",
          "Muerte fetal intrauterina súbita",
          "Cardiopatía congénita"
        ],
        "answerIndex": 2,
        "explanation": "La elevación de ácidos biliares se asocia a muerte fetal súbita, especialmente >40 μmol/L.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta recomendada a esta edad gestacional con esos niveles?",
        "options": [
          "Manejo expectante hasta 40 semanas",
          "Interrupción del embarazo alrededor de las 36–37 semanas",
          "Solo antihistamínicos",
          "Cesárea urgente inmediata sin indicación"
        ],
        "answerIndex": 1,
        "explanation": "En colestasis con ácidos biliares elevados, se recomienda interrupción alrededor de 36–37 semanas para reducir riesgo de muerte fetal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Emergencias obstétricas",
    "subtema": "Embolia pulmonar masiva en puerperio",
    "difficulty": "Alta",
    "case": "Paciente de 38 años, 3 días postcesárea. Obesidad grado II. Inicio súbito de disnea intensa, dolor torácico, síncope. TA 75/45 mmHg, FC 130 lpm, saturación 82%. Se sospecha tromboembolia pulmonar masiva.",
    "questions": [
      {
        "question": "¿Cuál es el siguiente paso inmediato?",
        "options": [
          "Radiografía simple",
          "Iniciar anticoagulación empírica mientras se confirma diagnóstico si alta sospecha",
          "Esperar angiotomografía antes de actuar",
          "Solo oxígeno"
        ],
        "answerIndex": 1,
        "explanation": "En alta sospecha y compromiso hemodinámico, debe iniciarse anticoagulación inmediata.",
        "gpcReference": ""
      },
      {
        "question": "Si persiste inestabilidad hemodinámica, ¿qué tratamiento puede considerarse?",
        "options": [
          "Warfarina",
          "Trombólisis sistémica",
          "Aspirina",
          "Alta domiciliaria"
        ],
        "answerIndex": 1,
        "explanation": "En TEP masiva con choque, está indicada trombólisis salvo contraindicación.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Líquido meconial espeso y manejo intraparto",
    "difficulty": "Media–Alta",
    "case": "Paciente de 29 años, G1, 41 semanas. Durante trabajo de parto se documenta salida de líquido amniótico espeso, verde oscuro. FCF 150 lpm con variabilidad moderada, sin desaceleraciones.",
    "questions": [
      {
        "question": "¿Qué significa la presencia de meconio espeso?",
        "options": [
          "Infección materna",
          "Madurez pulmonar",
          "Posible hipoxia fetal previa",
          "Indicación automática de cesárea"
        ],
        "answerIndex": 2,
        "explanation": "El meconio puede indicar estrés o hipoxia fetal previa, pero no implica cesárea automática.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta si el monitoreo es tranquilizador?",
        "options": [
          "Cesárea obligatoria",
          "Continuar vigilancia intraparto estrecha",
          "Suspender trabajo de parto",
          "Tocolíticos"
        ],
        "answerIndex": 1,
        "explanation": "Con FCF categoría I o II sin datos severos, se puede continuar con vigilancia.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Endocrinología obstétrica",
    "subtema": "Diabetes pregestacional y malformaciones",
    "difficulty": "Alta",
    "case": "Paciente de 25 años con DM1 desde la adolescencia. Embarazo no planeado. HbA1c al inicio 10%. USG estructural a las 20 semanas muestra defecto del tubo neural.",
    "questions": [
      {
        "question": "¿Cuál es el principal factor de riesgo para malformaciones en esta paciente?",
        "options": [
          "Edad materna",
          "Hiperglucemia en organogénesis",
          "Insulina",
          "Hipotensión"
        ],
        "answerIndex": 1,
        "explanation": "La hiperglucemia en el primer trimestre aumenta riesgo de malformaciones congénitas.",
        "gpcReference": ""
      },
      {
        "question": "¿Qué medida preventiva reduce este riesgo en futuros embarazos?",
        "options": [
          "Suspender insulina",
          "Control glucémico estricto preconcepcional",
          "Cesárea programada",
          "Solo ácido fólico sin control metabólico"
        ],
        "answerIndex": 1,
        "explanation": "El control metabólico previo a la concepción reduce riesgo de anomalías congénitas.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias obstétricas",
    "subtema": "Coagulación intravascular diseminada secundaria a DPPNI",
    "difficulty": "Alta",
    "case": "Paciente de 36 años, G3P2, 34 semanas, con DPPNI severo. Sangrado abundante, útero hipertónico. Laboratorios: plaquetas 60,000, fibrinógeno bajo, TP prolongado, sangrado por sitios de venopunción.",
    "questions": [
      {
        "question": "¿Cuál es la complicación presente?",
        "options": [
          "Atonía uterina",
          "Coagulación intravascular diseminada",
          "Sepsis",
          "Trombocitosis"
        ],
        "answerIndex": 1,
        "explanation": "Trombocitopenia + alteración de tiempos + sangrado difuso indican CID.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es parte fundamental del manejo?",
        "options": [
          "Solo cristaloides",
          "Reposición con hemoderivados según alteración (plasma, plaquetas, crioprecipitado)",
          "Aspirina",
          "Alta"
        ],
        "answerIndex": 1,
        "explanation": "La CID requiere reposición dirigida de factores y resolución de causa desencadenante.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del primer trimestre",
    "subtema": "Embarazo molar completo",
    "difficulty": "Alta",
    "case": "Paciente de 19 años, G1, 12 semanas por FUM. Refiere náusea y vómito severos, sangrado transvaginal oscuro intermitente y crecimiento uterino mayor al esperado. Exploración: TA 150/95 mmHg. Útero correspondiente a 16 semanas. No se auscultan latidos fetales. β-hCG marcadamente elevada (>200,000 mUI/mL). USG: imagen en “tormenta de nieve”, sin embrión visible.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Embarazo anembrionado",
          "Embarazo molar completo",
          "Aborto diferido",
          "Miomatosis uterina"
        ],
        "answerIndex": 1,
        "explanation": "La imagen ecográfica en “tormenta de nieve”, ausencia de embrión y β-hCG muy elevada sugieren mola completa.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el manejo inicial indicado?",
        "options": [
          "Histerectomía inmediata en toda paciente",
          "Legrado uterino por aspiración",
          "Misoprostol",
          "Manejo expectante"
        ],
        "answerIndex": 1,
        "explanation": "El tratamiento inicial es evacuación uterina por aspiración. Histerectomía se reserva para casos seleccionados.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el seguimiento obligatorio posterior?",
        "options": [
          "Ultrasonido mensual únicamente",
          "β-hCG seriada hasta negativización y seguimiento por 6–12 meses",
          "No requiere seguimiento",
          "Anticoncepción opcional"
        ],
        "answerIndex": 1,
        "explanation": "Debe vigilarse β-hCG seriada para detectar enfermedad trofoblástica persistente. Se recomienda anticoncepción durante seguimiento.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Presentación pélvica a término",
    "difficulty": "Media–Alta",
    "case": "Paciente de 28 años, G1, 39 semanas. USG confirma presentación pélvica franca. Peso fetal estimado 3,200 g. Pelvis clínica adecuada. Sin comorbilidades.",
    "questions": [
      {
        "question": "¿Cuál es la opción que puede ofrecerse antes del trabajo de parto?",
        "options": [
          "Inducción inmediata",
          "Versión cefálica externa",
          "Cesárea obligatoria inmediata",
          "Tocolíticos indefinidos"
        ],
        "answerIndex": 1,
        "explanation": "La versión cefálica externa puede intentarse alrededor de las 36–37 semanas si no hay contraindicaciones.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la vía más frecuentemente recomendada en primigesta con presentación pélvica persistente?",
        "options": [
          "Parto vaginal obligatorio",
          "Cesárea programada",
          "Manejo expectante hasta 42 semanas",
          "Fórceps"
        ],
        "answerIndex": 1,
        "explanation": "En primigestas con presentación pélvica persistente suele recomendarse cesárea programada por menor riesgo neonatal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trastornos hipertensivos",
    "subtema": "Hipertensión crónica con sobreagregación de preeclampsia",
    "difficulty": "Alta",
    "case": "Paciente de 36 años con hipertensión crónica conocida desde antes del embarazo. Actualmente 32 semanas. TA habitual 140/90 mmHg. En consulta presenta TA 165/105 mmHg, proteinuria +++, plaquetas 130,000.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Hipertensión gestacional",
          "Preeclampsia sobreagregada a hipertensión crónica",
          "Crisis hipertensiva aislada",
          "HELLP"
        ],
        "answerIndex": 1,
        "explanation": "Paciente con HTA previa que desarrolla proteinuria y datos de severidad cumple criterios de sobreagregación.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta?",
        "options": [
          "Solo ajustar antihipertensivos",
          "Hospitalización, sulfato de magnesio y valorar interrupción según estabilidad",
          "Alta domiciliaria",
          "No requiere vigilancia"
        ],
        "answerIndex": 1,
        "explanation": "Se maneja como preeclampsia con datos de severidad.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Infecciones perinatales",
    "subtema": "Profilaxis para Streptococcus del grupo B (EGB)",
    "difficulty": "Media–Alta",
    "case": "Paciente de 25 años, G1, 39 semanas, en trabajo de parto. Cultivo rectovaginal a las 36 semanas positivo para Streptococcus grupo B. Sin alergias medicamentosas.",
    "questions": [
      {
        "question": "¿Cuál es la conducta intraparto?",
        "options": [
          "No hacer nada",
          "Penicilina G IV intraparto",
          "Cesárea obligatoria",
          "Antibiótico oral"
        ],
        "answerIndex": 1,
        "explanation": "La profilaxis intraparto reduce transmisión neonatal.",
        "gpcReference": ""
      },
      {
        "question": "Si fuera alérgica a penicilina con reacción anafiláctica, ¿qué opción es adecuada?",
        "options": [
          "Amoxicilina",
          "Clindamicina si sensibilidad documentada",
          "Aspirina",
          "No tratar"
        ],
        "answerIndex": 1,
        "explanation": "En alergia grave se usa clindamicina si el germen es sensible.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología del puerperio",
    "subtema": "Mastitis puerperal",
    "difficulty": "Media",
    "case": "Paciente de 22 años, 3 semanas postparto. Refiere dolor en mama derecha, eritema localizado y fiebre 38.2°C. Lactancia activa. Sin fluctuación.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Absceso mamario",
          "Mastitis puerperal",
          "Galactocele",
          "Cáncer inflamatorio"
        ],
        "answerIndex": 1,
        "explanation": "Dolor, eritema y fiebre en lactante sugieren mastitis.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta adecuada?",
        "options": [
          "Suspender lactancia",
          "Antibiótico y continuar lactancia",
          "Drenaje quirúrgico inmediato",
          "No tratar"
        ],
        "answerIndex": 1,
        "explanation": "Debe continuarse lactancia y administrar antibióticos dirigidos a S. aureus.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología trofoblástica gestacional",
    "subtema": "Neoplasia trofoblástica gestacional postmolar",
    "difficulty": "Alta",
    "case": "Paciente de 22 años con antecedente de embarazo molar completo evacuado hace 8 semanas. Seguimiento con β-hCG semanal mostró descenso inicial, pero en las últimas 3 determinaciones presenta meseta (5,200 → 5,400 → 5,350 mUI/mL). Asintomática. USG sin restos evidentes.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Embarazo nuevo",
          "Restos placentarios",
          "Neoplasia trofoblástica gestacional",
          "Error de laboratorio"
        ],
        "answerIndex": 2,
        "explanation": "Meseta o elevación de β-hCG tras evacuación molar sugiere enfermedad trofoblástica persistente.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el manejo inicial en enfermedad de bajo riesgo?",
        "options": [
          "Histerectomía inmediata",
          "Quimioterapia con metotrexato",
          "Nuevo legrado obligatorio",
          "Observación sin tratamiento"
        ],
        "answerIndex": 1,
        "explanation": "En enfermedad de bajo riesgo (según puntaje FIGO), el tratamiento es quimioterapia con agente único como metotrexato.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Distocia por hipodinamia uterina",
    "difficulty": "Media–Alta",
    "case": "Paciente de 26 años, G1, 39 semanas, en fase activa con 5 cm de dilatación. Tras 4 horas solo progresa a 6 cm. Dinámica uterina: 2 contracciones en 10 minutos, de intensidad leve. FCF normal.",
    "questions": [
      {
        "question": "¿Cuál es la causa más probable del retraso?",
        "options": [
          "Desproporción cefalopélvica",
          "Hipodinamia uterina",
          "Presentación anómala",
          "Ruptura uterina"
        ],
        "answerIndex": 1,
        "explanation": "Dinámica insuficiente con progreso lento sugiere alteración de la potencia uterina.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta adecuada?",
        "options": [
          "Cesárea inmediata",
          "Conducción con oxitocina bajo monitoreo",
          "Alta domiciliaria",
          "Tocolíticos"
        ],
        "answerIndex": 1,
        "explanation": "Debe optimizarse la dinámica uterina antes de decidir cesárea.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del segundo trimestre",
    "subtema": "Placenta previa diagnosticada antes de 28 semanas",
    "difficulty": "Media–Alta",
    "case": "Paciente de 30 años, G2P1, 24 semanas. USG muestra placenta parcialmente cubriendo OCI. Asintomática.",
    "questions": [
      {
        "question": "¿Cuál es la conducta inmediata?",
        "options": [
          "Cesárea inmediata",
          "Inducción del parto",
          "Vigilancia y reevaluación ecográfica posterior",
          "Reposo absoluto hospitalario obligatorio"
        ],
        "answerIndex": 2,
        "explanation": "Muchas placentas migran conforme avanza el embarazo; debe reevaluarse en tercer trimestre.",
        "gpcReference": ""
      },
      {
        "question": "¿Qué está contraindicado en estas pacientes si presentan sangrado?",
        "options": [
          "Ultrasonido transvaginal",
          "Tacto vaginal digital",
          "Hospitalización",
          "Monitoreo fetal"
        ],
        "answerIndex": 1,
        "explanation": "El tacto vaginal puede desencadenar hemorragia masiva.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Endocrinología obstétrica",
    "subtema": "Hipertiroidismo en el primer trimestre",
    "difficulty": "Alta",
    "case": "Paciente de 27 años, G1, 9 semanas. Palpitaciones, pérdida de peso y temblor. TSH suprimida, T4 libre elevada. Anticuerpos TRAb positivos.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Tirotoxicosis gestacional transitoria",
          "Enfermedad de Graves",
          "Hipotiroidismo",
          "Preeclampsia"
        ],
        "answerIndex": 1,
        "explanation": "Anticuerpos TRAb positivos orientan a enfermedad de Graves.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el tratamiento de elección en el primer trimestre?",
        "options": [
          "Metimazol",
          "Propiltiouracilo",
          "Yodo radiactivo",
          "No tratar"
        ],
        "answerIndex": 1,
        "explanation": "En primer trimestre se prefiere propiltiouracilo por menor riesgo teratogénico comparado con metimazol.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Complicaciones del puerperio",
    "subtema": "Absceso mamario",
    "difficulty": "Media–Alta",
    "case": "Paciente de 24 años, 4 semanas postparto. Dolor intenso en mama izquierda, fiebre 38.8°C. Área eritematosa con fluctuación palpable. No mejoró tras 72 horas de antibiótico por mastitis.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Mastitis simple",
          "Galactocele",
          "Absceso mamario",
          "Ingurgitación"
        ],
        "answerIndex": 2,
        "explanation": "La presencia de fluctuación sugiere colección purulenta.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el manejo adecuado?",
        "options": [
          "Solo cambiar antibiótico",
          "Drenaje del absceso + antibiótico",
          "Suspender lactancia definitiva",
          "No tratar"
        ],
        "answerIndex": 1,
        "explanation": "El absceso requiere drenaje además de antibiótico dirigido.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología hipertensiva del embarazo",
    "subtema": "Preeclampsia antes de las 34 semanas sin datos de severidad",
    "difficulty": "Alta",
    "case": "Paciente de 29 años, G1, 31 semanas. TA 150/95 mmHg en dos ocasiones separadas por 6 horas. Proteinuria 400 mg en 24 horas. Sin cefalea, sin fosfenos. Plaquetas 180,000, AST y ALT normales. FCF reactiva, Doppler normal.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Hipertensión gestacional",
          "Preeclampsia sin datos de severidad",
          "Preeclampsia con datos de severidad",
          "Hipertensión crónica"
        ],
        "answerIndex": 1,
        "explanation": "HTA + proteinuria después de 20 semanas sin daño orgánico corresponde a preeclampsia sin datos de severidad.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta más adecuada?",
        "options": [
          "Interrupción inmediata",
          "Manejo expectante hospitalario con vigilancia materno-fetal",
          "Alta sin seguimiento",
          "Solo antihipertensivos ambulatorios"
        ],
        "answerIndex": 1,
        "explanation": "Antes de 34 semanas sin datos de severidad puede optarse por manejo expectante bajo vigilancia estrecha.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Parto pretérmino espontáneo",
    "difficulty": "Alta",
    "case": "Paciente de 23 años, G2P1, 32 semanas. Contracciones regulares cada 5 minutos desde hace 2 horas. Dilatación 3 cm, borramiento 70%. Membranas íntegras. FCF reactiva.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Amenaza de parto pretérmino",
          "Trabajo de parto pretérmino establecido",
          "Fase latente normal",
          "RPM"
        ],
        "answerIndex": 1,
        "explanation": "Cambios cervicales + dinámica regular antes de 37 semanas indican trabajo de parto pretérmino.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es parte fundamental del manejo?",
        "options": [
          "Interrupción inmediata",
          "Corticoesteroides para maduración pulmonar",
          "Cesárea obligatoria",
          "Alta domiciliaria"
        ],
        "answerIndex": 1,
        "explanation": "Entre 24–34 semanas deben administrarse corticoesteroides para maduración pulmonar fetal.",
        "gpcReference": ""
      },
      {
        "question": "¿En qué caso están indicados tocolíticos?",
        "options": [
          "Siempre",
          "Si no hay infección ni compromiso fetal para permitir efecto de corticoesteroides",
          "Nunca",
          "Solo después de 37 semanas"
        ],
        "answerIndex": 1,
        "explanation": "Tocolíticos pueden utilizarse para ganar 48 horas para maduración pulmonar si no hay contraindicaciones.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias obstétricas",
    "subtema": "Acretismo placentario diagnosticado intraparto",
    "difficulty": "Alta",
    "case": "Paciente de 39 años, G5P4, antecedente de 3 cesáreas. Durante cesárea programada se intenta desprender placenta y se observa invasión profunda sin plano de clivaje, con hemorragia activa masiva.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Placenta previa",
          "Placenta acreta",
          "DPPNI",
          "Atonía uterina"
        ],
        "answerIndex": 1,
        "explanation": "Ausencia de plano de separación sugiere acretismo.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta más adecuada?",
        "options": [
          "Insistir en desprendimiento manual",
          "Histerectomía obstétrica",
          "Solo suturar",
          "Cerrar y observar"
        ],
        "answerIndex": 1,
        "explanation": "El manejo definitivo suele ser histerectomía para controlar hemorragia.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Infecciones perinatales",
    "subtema": "Toxoplasmosis en embarazo",
    "difficulty": "Alta",
    "case": "Paciente de 26 años, G1, 18 semanas. Serología: IgM positiva, IgG negativa. Refiere contacto frecuente con gatos. Asintomática.",
    "questions": [
      {
        "question": "¿Qué indica este resultado?",
        "options": [
          "Infección pasada",
          "Infección aguda probable",
          "Inmunidad protectora",
          "Resultado irrelevante"
        ],
        "answerIndex": 1,
        "explanation": "IgM positiva con IgG negativa sugiere infección reciente; debe confirmarse con pruebas adicionales.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el tratamiento inicial si se confirma infección materna sin evidencia fetal?",
        "options": [
          "Pirimetamina-sulfadiazina inmediata",
          "Espiramicina",
          "No tratar",
          "Interrupción obligatoria"
        ],
        "answerIndex": 1,
        "explanation": "Espiramicina reduce transmisión vertical cuando no hay evidencia de infección fetal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Puerperio",
    "subtema": "Depresión posparto",
    "difficulty": "Media–Alta",
    "case": "Paciente de 30 años, 6 semanas postparto. Refiere tristeza persistente, insomnio, anhedonia y sentimientos de culpa. Niega ideación suicida. Funcionalidad disminuida.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Tristeza posparto transitoria",
          "Psicosis puerperal",
          "Depresión posparto",
          "Trastorno bipolar"
        ],
        "answerIndex": 2,
        "explanation": "Síntomas >2 semanas con afectación funcional sugieren depresión posparto.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es una opción terapéutica segura en lactancia?",
        "options": [
          "Suspender lactancia obligatoriamente",
          "ISRS como sertralina",
          "No tratar",
          "Benzodiacepinas como monoterapia prolongada"
        ],
        "answerIndex": 1,
        "explanation": "Algunos ISRS como sertralina son compatibles con lactancia.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología hipertensiva del embarazo",
    "subtema": "Preeclampsia con datos de severidad y manejo intrahospitalario",
    "difficulty": "Alta",
    "case": "Paciente de 32 años, G2P1, 35 semanas de gestación, acude por cefalea intensa holocraneana de 12 horas de evolución, fosfenos y dolor en epigastrio irradiado a hipocondrio derecho. Refiere edema progresivo en extremidades inferiores desde hace una semana. A la exploración: TA 170/110 mmHg en dos tomas separadas por 15 minutos, FC 96 lpm, FR 20 rpm. Reflejos osteotendinosos ++ con discreta hiperreflexia. No hay datos de trabajo de parto. FCF 150 lpm reactiva. Laboratorios: Plaquetas 95,000/mm³ AST 110 U/L ALT 95 U/L Creatinina 1.3 mg/dL Proteinuria 3+ en tira reactiva",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Hipertensión gestacional",
          "Preeclampsia sin datos de severidad",
          "Preeclampsia con datos de severidad",
          "Síndrome HELLP completo"
        ],
        "answerIndex": 2,
        "explanation": "HTA ≥160/110 + plaquetopenia + elevación de enzimas hepáticas + síntomas neurológicos = preeclampsia con datos de severidad. No cumple criterios completos de HELLP (falta evidencia clara de hemólisis).",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la primera intervención farmacológica prioritaria?",
        "options": [
          "Inducción inmediata sin tratamiento previo",
          "Administración de sulfato de magnesio",
          "Tocolíticos",
          "Corticoesteroides para maduración pulmonar exclusivamente"
        ],
        "answerIndex": 1,
        "explanation": "El sulfato de magnesio es fundamental para prevención de eclampsia en pacientes con datos de severidad.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta obstétrica definitiva?",
        "options": [
          "Manejo expectante hasta 37 semanas",
          "Interrupción del embarazo tras estabilización materna",
          "Alta domiciliaria",
          "Solo antihipertensivos ambulatorios"
        ],
        "answerIndex": 1,
        "explanation": "Después de 34 semanas con datos de severidad, la conducta es interrupción tras estabilizar a la paciente.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias obstétricas",
    "subtema": "Desprendimiento prematuro de placenta normoinserta (DPPNI)",
    "difficulty": "Alta",
    "case": "Paciente de 28 años, G3P2, 37 semanas, con antecedente de hipertensión gestacional en embarazo previo. Acude por dolor abdominal súbito, intenso y constante, acompañado de sangrado vaginal oscuro en moderada cantidad. Refiere disminución de movimientos fetales. A la exploración: TA 150/95 mmHg, abdomen con hipertonía uterina y dolor difuso a la palpación. FCF 90 lpm con desaceleraciones tardías repetitivas.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Placenta previa",
          "Ruptura uterina",
          "Desprendimiento prematuro de placenta normoinserta",
          "Trabajo de parto normal"
        ],
        "answerIndex": 2,
        "explanation": "Dolor intenso + útero hipertónico + sangrado oscuro + sufrimiento fetal son característicos de DPPNI.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta inmediata?",
        "options": [
          "Observación",
          "Cesárea urgente",
          "Inducción con oxitocina",
          "Alta"
        ],
        "answerIndex": 1,
        "explanation": "Hay sufrimiento fetal agudo; la vía de resolución debe ser inmediata.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál complicación materna es frecuente en casos graves?",
        "options": [
          "Diabetes gestacional",
          "Coagulación intravascular diseminada",
          "Hipertiroidismo",
          "Sepsis urinaria"
        ],
        "answerIndex": 1,
        "explanation": "El DPPNI severo puede desencadenar CID por liberación masiva de tromboplastina.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Endocrinología ginecológica",
    "subtema": "Síndrome de ovario poliquístico (SOP) y criterios diagnósticos",
    "difficulty": "Media–Alta",
    "case": "Paciente de 24 años con ciclos menstruales irregulares desde la adolescencia. Presenta aumento progresivo de vello facial y acné. IMC 31 kg/m². Refiere dificultad para embarazarse tras 1 año de relaciones sin protección. Laboratorios: Testosterona total ligeramente elevada. TSH normal. Prolactina normal. USG transvaginal: ovarios aumentados de volumen con múltiples folículos periféricos pequeños.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Hiperprolactinemia",
          "Síndrome de ovario poliquístico",
          "Insuficiencia ovárica prematura",
          "Hipotiroidismo"
        ],
        "answerIndex": 1,
        "explanation": "Cumple criterios de Rotterdam: oligo/anovulación + hiperandrogenismo clínico/biológico + ovarios poliquísticos.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el tratamiento inicial si no desea embarazo?",
        "options": [
          "Clomifeno",
          "Anticonceptivos hormonales combinados",
          "Histerectomía",
          "Solo metformina obligatoria"
        ],
        "answerIndex": 1,
        "explanation": "Los ACO regulan ciclos y disminuyen hiperandrogenismo.",
        "gpcReference": ""
      },
      {
        "question": "Si desea embarazo, ¿cuál es primera línea para inducir ovulación?",
        "options": [
          "Letrozol",
          "Anticonceptivos",
          "GnRH continuo",
          "Danazol"
        ],
        "answerIndex": 0,
        "explanation": "Letrozol es actualmente primera línea para inducción de ovulación en SOP.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Infecciones ginecológicas",
    "subtema": "Enfermedad pélvica inflamatoria complicada",
    "difficulty": "Alta",
    "case": "Paciente de 27 años con antecedente de múltiples parejas sexuales y uso irregular de preservativo. Consulta por dolor pélvico de 5 días de evolución, fiebre 38.5°C y flujo vaginal purulento. A la exploración: dolor intenso a movilización cervical y dolor anexial bilateral. USG muestra masa anexial compleja de 6 cm compatible con absceso tubo-ovárico.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Apendicitis",
          "Embarazo ectópico",
          "Enfermedad pélvica inflamatoria complicada con absceso tubo-ovárico",
          "Quiste simple"
        ],
        "answerIndex": 2,
        "explanation": "Dolor pélvico + fiebre + masa anexial compleja sugiere absceso tubo-ovárico.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el manejo inicial?",
        "options": [
          "Tratamiento ambulatorio oral",
          "Hospitalización y antibióticos IV de amplio espectro",
          "Solo analgésicos",
          "Histerectomía inmediata"
        ],
        "answerIndex": 1,
        "explanation": "Absceso tubo-ovárico requiere manejo intrahospitalario.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuándo está indicado drenaje quirúrgico?",
        "options": [
          "Siempre de entrada",
          "Si no hay respuesta a antibiótico o hay ruptura",
          "Nunca",
          "Solo si mide menos de 3 cm"
        ],
        "answerIndex": 1,
        "explanation": "La falta de mejoría clínica o complicación obliga a intervención.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Embarazo ectópico",
    "subtema": "Manejo médico vs quirúrgico",
    "difficulty": "Alta",
    "case": "Paciente de 30 años, G2P0A1, acude por dolor pélvico unilateral izquierdo de 48 horas de evolución, tipo punzante, intensidad progresiva. Refiere amenorrea de 7 semanas y manchado vaginal escaso oscuro desde hace 3 días. Niega síncope. Exploración: TA 110/70 mmHg, FC 88 lpm. Abdomen con dolor en fosa iliaca izquierda sin datos de irritación peritoneal. A la exploración ginecológica: cérvix cerrado, dolor a movilización cervical, masa anexial izquierda dolorosa. β-hCG: 2,300 mUI/mL USG transvaginal: no se observa saco intrauterino, masa anexial izquierda de 2.5 cm, sin líquido libre significativo.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Amenaza de aborto",
          "Embarazo ectópico tubárico no complicado",
          "Quiste hemorrágico",
          "Aborto incompleto"
        ],
        "answerIndex": 1,
        "explanation": "Amenorrea + β-hCG mayor al umbral discriminatorio sin saco intrauterino + masa anexial = embarazo ectópico.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el manejo más adecuado en este caso?",
        "options": [
          "Laparotomía urgente",
          "Metotrexato sistémico",
          "Legrado uterino",
          "Observación sin tratamiento"
        ],
        "answerIndex": 1,
        "explanation": "Paciente estable, masa <3.5 cm, sin latido embrionario y β-hCG baja → candidata a tratamiento médico.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es un criterio absoluto para tratamiento quirúrgico inmediato?",
        "options": [
          "Deseo reproductivo futuro",
          "Hemodinámicamente inestable",
          "Edad menor de 35 años",
          "β-hCG menor de 5,000"
        ],
        "answerIndex": 1,
        "explanation": "Inestabilidad hemodinámica implica ruptura y requiere intervención urgente.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragia obstétrica",
    "subtema": "Atonía uterina en el puerperio inmediato",
    "difficulty": "Alta",
    "case": "Paciente de 34 años, G4P4, parto vaginal eutócico hace 20 minutos. Producto de 3,900 g. Placenta completa. Presenta sangrado abundante transvaginal que empapa compresas rápidamente. TA 95/60 mmHg, FC 115 lpm. A la palpación abdominal: útero aumentado de tamaño, blando y mal contraído.",
    "questions": [
      {
        "question": "¿Cuál es la causa más probable de la hemorragia?",
        "options": [
          "Retención placentaria",
          "Atonía uterina",
          "Laceración cervical",
          "Inversión uterina"
        ],
        "answerIndex": 1,
        "explanation": "Útero blando y aumentado de tamaño tras parto sugiere atonía, principal causa de hemorragia posparto.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la primera intervención?",
        "options": [
          "Histerectomía inmediata",
          "Masaje uterino bimanual + oxitocina IV",
          "Alta domiciliaria",
          "Antibióticos"
        ],
        "answerIndex": 1,
        "explanation": "El manejo inicial incluye masaje uterino y uterotónicos.",
        "gpcReference": ""
      },
      {
        "question": "Si no responde a oxitocina, ¿cuál es el siguiente fármaco útil?",
        "options": [
          "Misoprostol o metilergonovina (según contraindicación)",
          "Tocolíticos",
          "Corticoesteroides",
          "Insulina"
        ],
        "answerIndex": 0,
        "explanation": "Se deben escalar uterotónicos antes de medidas quirúrgicas.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Oncología ginecológica",
    "subtema": "Cáncer cervicouterino etapa temprana",
    "difficulty": "Alta",
    "case": "Paciente de 41 años, sin tamizaje en los últimos 10 años. Consulta por sangrado poscoital intermitente. Especuloscopía: lesión exofítica friable de 2 cm en cérvix. Biopsia: carcinoma epidermoide invasor. RM pélvica: tumor limitado al cuello uterino, 2.2 cm, sin invasión parametrial.",
    "questions": [
      {
        "question": "Según FIGO, ¿en qué etapa se encuentra?",
        "options": [
          "IA",
          "IB1",
          "IIB",
          "IIIA"
        ],
        "answerIndex": 1,
        "explanation": "Tumor visible clínicamente ≤4 cm limitado al cérvix corresponde a IB1.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el tratamiento de elección en paciente candidata quirúrgica?",
        "options": [
          "Quimioterapia exclusiva",
          "Histerectomía radical + linfadenectomía",
          "Observación",
          "Crioterapia"
        ],
        "answerIndex": 1,
        "explanation": "En etapas tempranas operables, la cirugía radical es tratamiento estándar.",
        "gpcReference": ""
      },
      {
        "question": "Principal factor etiológico asociado:",
        "options": [
          "Virus Epstein-Barr",
          "Virus del papiloma humano de alto riesgo",
          "VIH",
          "Herpes simple"
        ],
        "answerIndex": 1,
        "explanation": "VPH 16 y 18 son los principales subtipos oncogénicos.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Obstetricia",
    "subtema": "Ruptura prematura de membranas pretérmino (RPM pretérmino)",
    "difficulty": "Alta",
    "case": "Paciente de 25 años, G1, 30 semanas. Refiere salida súbita de líquido claro abundante hace 6 horas. No contracciones. TA normal. Temperatura 37.8°C. FCF reactiva. Especuloscopía: líquido claro en fondo de saco. Prueba de nitrazina positiva.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Incontinencia urinaria",
          "RPM pretérmino",
          "Trabajo de parto activo",
          "Placenta previa"
        ],
        "answerIndex": 1,
        "explanation": "Salida de líquido antes de 37 semanas sin trabajo de parto = RPM pretérmino.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es parte fundamental del manejo antes de 34 semanas si no hay infección?",
        "options": [
          "Inducción inmediata",
          "Manejo expectante + antibióticos + corticoesteroides",
          "Alta domiciliaria",
          "Cesárea obligatoria"
        ],
        "answerIndex": 1,
        "explanation": "Se busca prolongar embarazo y reducir complicaciones neonatales.",
        "gpcReference": ""
      },
      {
        "question": "¿Qué dato obligaría a terminar el embarazo inmediatamente?",
        "options": [
          "FCF reactiva",
          "Corioamnionitis clínica",
          "Edad materna joven",
          "Producto femenino"
        ],
        "answerIndex": 1,
        "explanation": "Fiebre, taquicardia materno-fetal y dolor uterino sugieren infección intraamniótica → interrupción.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Diabetes en el embarazo",
    "subtema": "Cetoacidosis diabética en embarazo",
    "difficulty": "Muy Alta",
    "case": "Paciente de 27 años, G2P1, 28 semanas de gestación, antecedente de diabetes tipo 1 desde los 14 años. Acude por 24 horas de náuseas intensas, vómito y dolor abdominal difuso. Refiere haber suspendido parcialmente su insulina por inapetencia. Exploración: TA 100/60 mmHg, FC 120 lpm, FR 28 rpm con respiración profunda. Mucosas secas. FCF 170 lpm. Laboratorios: Glucosa 280 mg/dL pH 7.18 Bicarbonato 12 mEq/L Cetonas positivas en sangre Anión gap elevado",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Gastroenteritis",
          "Hiperglucemia simple",
          "Cetoacidosis diabética",
          "Preeclampsia"
        ],
        "answerIndex": 2,
        "explanation": "En embarazo la CAD puede presentarse con glucemias no tan elevadas. Acidosis metabólica con anión gap elevado y cetonemia confirman diagnóstico.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la prioridad inicial del manejo?",
        "options": [
          "Cesárea inmediata",
          "Rehidratación con solución cristaloide IV",
          "Sulfato de magnesio",
          "Tocolíticos"
        ],
        "answerIndex": 1,
        "explanation": "La reposición de volumen es el primer paso antes de insulina IV.",
        "gpcReference": ""
      },
      {
        "question": "¿La presencia de taquicardia fetal obliga a interrupción inmediata?",
        "options": [
          "Sí siempre",
          "No, primero se corrige estado metabólico materno",
          "Solo si es femenino",
          "Siempre antes de 30 semanas"
        ],
        "answerIndex": 1,
        "explanation": "La mayoría de alteraciones fetales mejoran al corregir la acidosis materna.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del primer trimestre",
    "subtema": "Aborto séptico",
    "difficulty": "Alta",
    "case": "Paciente de 22 años, 10 semanas por FUM, acude por fiebre de 39°C, dolor abdominal bajo intenso y sangrado vaginal fétido. Refiere intento de interrupción del embarazo con instrumento no médico hace 3 días. Exploración: TA 90/55 mmHg, FC 118 lpm. Abdomen doloroso con datos de irritación peritoneal leve. Cérvix abierto con restos ovulares visibles. Laboratorios: leucocitosis marcada con neutrofilia.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Aborto incompleto",
          "Aborto inevitable",
          "Aborto séptico",
          "Embarazo ectópico"
        ],
        "answerIndex": 2,
        "explanation": "Fiebre alta + restos retenidos + manipulación uterina previa orientan a aborto séptico.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el manejo inicial?",
        "options": [
          "Legrado inmediato sin antibióticos",
          "Antibióticos IV de amplio espectro + estabilización hemodinámica",
          "Alta con tratamiento oral",
          "Observación"
        ],
        "answerIndex": 1,
        "explanation": "Primero estabilización y antibióticos; evacuación uterina posterior cuando esté hemodinámicamente estable.",
        "gpcReference": ""
      },
      {
        "question": "Complicación más temida:",
        "options": [
          "Hipotiroidismo",
          "Choque séptico",
          "Diabetes",
          "Insuficiencia ovárica"
        ],
        "answerIndex": 1,
        "explanation": "La progresión a sepsis y choque es frecuente si no se trata oportunamente.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Climaterio",
    "subtema": "Terapia hormonal de reemplazo (THR)",
    "difficulty": "Media–Alta",
    "case": "Paciente de 52 años, menopausia desde hace 1 año. Presenta bochornos intensos, sudoración nocturna y trastorno del sueño que afecta su calidad de vida. IMC 24. No antecedentes de cáncer de mama ni enfermedad tromboembólica. Útero íntegro.",
    "questions": [
      {
        "question": "¿Es candidata a terapia hormonal?",
        "options": [
          "No, está contraindicada siempre",
          "Sí, si no hay contraindicaciones mayores",
          "Solo si tiene osteoporosis",
          "Solo si tiene hipertensión"
        ],
        "answerIndex": 1,
        "explanation": "En mujeres sintomáticas menores de 60 años o <10 años de menopausia sin contraindicaciones, puede indicarse THR.",
        "gpcReference": ""
      },
      {
        "question": "¿Qué esquema es adecuado si conserva útero?",
        "options": [
          "Estrógeno solo",
          "Estrógeno + progestágeno",
          "Progesterona sola obligatoria",
          "Andrógenos"
        ],
        "answerIndex": 1,
        "explanation": "Se requiere progestágeno para proteger endometrio del riesgo de hiperplasia/cáncer.",
        "gpcReference": ""
      },
      {
        "question": "Principal riesgo a largo plazo asociado:",
        "options": [
          "Cáncer de mama (según tipo y duración)",
          "Cáncer gástrico",
          "Cáncer renal",
          "Hipertiroidismo"
        ],
        "answerIndex": 0,
        "explanation": "El riesgo aumenta con uso prolongado de combinaciones hormonales.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Obstetricia",
    "subtema": "Restricción del crecimiento intrauterino (RCIU)",
    "difficulty": "Alta",
    "case": "Paciente de 33 años, G1, 34 semanas. Antecedente de hipertensión crónica. Refiere disminución de movimientos fetales. Altura uterina menor a la esperada para edad gestacional. USG: peso fetal estimado < percentil 5, líquido amniótico disminuido. Doppler de arteria umbilical con aumento de resistencia.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Feto grande para edad gestacional",
          "Restricción del crecimiento intrauterino",
          "Embarazo gemelar",
          "Placenta previa"
        ],
        "answerIndex": 1,
        "explanation": "Peso estimado <P10 con alteración Doppler confirma RCIU.",
        "gpcReference": ""
      },
      {
        "question": "Principal etiología en este caso:",
        "options": [
          "Diabetes materna",
          "Hipertensión materna crónica",
          "Infección urinaria",
          "Hipertiroidismo"
        ],
        "answerIndex": 1,
        "explanation": "La insuficiencia placentaria secundaria a HTA es causa frecuente.",
        "gpcReference": ""
      },
      {
        "question": "¿Qué hallazgo Doppler es de mayor gravedad?",
        "options": [
          "Flujo normal",
          "Ausencia o reversa de flujo diastólico en arteria umbilical",
          "Índice de pulsatilidad bajo",
          "Doppler normal"
        ],
        "answerIndex": 1,
        "explanation": "La ausencia o reversión del flujo diastólico se asocia a alto riesgo de muerte fetal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología hipertensiva del embarazo",
    "subtema": "Síndrome HELLP",
    "difficulty": "Muy Alta",
    "case": "Paciente de 34 años, G3P2, 33 semanas de gestación. Acude por dolor intenso en epigastrio irradiado a hipocondrio derecho desde hace 8 horas, náusea y malestar general. Refiere cefalea leve. Sin antecedentes patológicos relevantes. Exploración: TA 155/100 mmHg, FC 102 lpm. Edema en extremidades inferiores ++. Reflejos osteotendinosos aumentados. Útero acorde a edad gestacional. FCF 150 lpm reactiva. Laboratorios: Plaquetas 68,000/mm³ AST 210 U/L ALT 190 U/L Bilirrubina indirecta elevada LDH elevada Esquistocitos en frotis",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Preeclampsia sin severidad",
          "Hepatitis aguda viral",
          "Síndrome HELLP",
          "Colestasis intrahepática"
        ],
        "answerIndex": 2,
        "explanation": "Hemólisis (LDH y bilirrubina elevada + esquistocitos), enzimas hepáticas elevadas y plaquetopenia = HELLP.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la conducta inmediata?",
        "options": [
          "Manejo expectante hasta 37 semanas",
          "Sulfato de magnesio + estabilización e interrupción del embarazo",
          "Solo antihipertensivos",
          "Alta domiciliaria"
        ],
        "answerIndex": 1,
        "explanation": "HELLP es indicación de interrupción independientemente de edad gestacional tras estabilizar.",
        "gpcReference": ""
      },
      {
        "question": "Complicación materna grave asociada:",
        "options": [
          "Rotura hepática",
          "Hipotiroidismo",
          "Diabetes",
          "Placenta previa"
        ],
        "answerIndex": 0,
        "explanation": "Puede progresar a hematoma subcapsular y ruptura hepática.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del tercer trimestre",
    "subtema": "Placenta previa total sintomática",
    "difficulty": "Alta",
    "case": "Paciente de 37 años, G4P3, 36 semanas, antecedente de dos cesáreas previas. Consulta por sangrado vaginal rojo brillante abundante, indoloro, de inicio súbito. Niega dolor abdominal. Exploración: TA 105/70 mmHg, FC 100 lpm. Útero relajado, no doloroso. FCF 140 lpm reactiva. USG muestra placenta cubriendo completamente el orificio cervical interno.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "DPPNI",
          "Placenta previa total",
          "Ruptura uterina",
          "Trabajo de parto"
        ],
        "answerIndex": 1,
        "explanation": "Sangrado rojo brillante, indoloro, con útero relajado es característico.",
        "gpcReference": ""
      },
      {
        "question": "Conducta obstétrica:",
        "options": [
          "Inducción con oxitocina",
          "Cesárea programada o urgente según estabilidad",
          "Tacto vaginal para valorar dilatación",
          "Alta"
        ],
        "answerIndex": 1,
        "explanation": "Placenta cubriendo OCI contraindica parto vaginal.",
        "gpcReference": ""
      },
      {
        "question": "Principal factor de riesgo en esta paciente:",
        "options": [
          "Primigesta",
          "Cesáreas previas",
          "Edad <20 años",
          "Hipertiroidismo"
        ],
        "answerIndex": 1,
        "explanation": "Cicatrices uterinas aumentan riesgo de placenta previa.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Endocrinología ginecológica",
    "subtema": "Hiperprolactinemia y galactorrea",
    "difficulty": "Media–Alta",
    "case": "Paciente de 28 años consulta por amenorrea de 6 meses y salida espontánea de secreción láctea bilateral. Niega embarazo. No usa anticonceptivos. Refiere cefalea leve ocasional. Laboratorios: β-hCG negativa TSH normal Prolactina 120 ng/mL",
    "questions": [
      {
        "question": "¿Cuál es el siguiente estudio?",
        "options": [
          "USG pélvico",
          "Resonancia magnética de hipófisis",
          "TAC abdominal",
          "Biopsia mamaria"
        ],
        "answerIndex": 1,
        "explanation": "Prolactina >100 ng/mL sugiere prolactinoma; se debe estudiar hipófisis.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento de primera línea:",
        "options": [
          "Cirugía inmediata",
          "Agonista dopaminérgico (cabergolina o bromocriptina)",
          "Radioterapia",
          "Estrógenos"
        ],
        "answerIndex": 1,
        "explanation": "Agonistas dopaminérgicos reducen prolactina y tamaño tumoral.",
        "gpcReference": ""
      },
      {
        "question": "Complicación si el macroadenoma progresa:",
        "options": [
          "Hemorragia uterina",
          "Hemianopsia bitemporal",
          "Diabetes",
          "Osteoporosis inmediata"
        ],
        "answerIndex": 1,
        "explanation": "Compresión del quiasma óptico produce defecto campimétrico típico.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Obstetricia",
    "subtema": "Isoinmunización Rh",
    "difficulty": "Alta",
    "case": "Paciente de 26 años, G2P1, 28 semanas. Grupo O Rh negativo. Primer embarazo terminó en parto vaginal sin aplicación documentada de inmunoglobulina anti-D. En control actual se detecta Coombs indirecto positivo con títulos elevados. USG muestra signos iniciales de hidropesía fetal leve.",
    "questions": [
      {
        "question": "¿Cuál es el mecanismo fisiopatológico?",
        "options": [
          "Infección viral",
          "Producción materna de anticuerpos anti-D que atraviesan placenta",
          "Diabetes",
          "Insuficiencia tiroidea"
        ],
        "answerIndex": 1,
        "explanation": "La sensibilización previa genera anticuerpos IgG que destruyen eritrocitos fetales.",
        "gpcReference": ""
      },
      {
        "question": "¿Qué estudio evalúa anemia fetal de forma no invasiva?",
        "options": [
          "Amniocentesis sistemática",
          "Doppler de arteria cerebral media",
          "Tacto vaginal",
          "Perfil hepático"
        ],
        "answerIndex": 1,
        "explanation": "Aumento de velocidad sistólica en ACM se correlaciona con anemia fetal.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento si anemia fetal severa:",
        "options": [
          "Alta",
          "Transfusión intrauterina",
          "Solo hierro oral",
          "Reposo"
        ],
        "answerIndex": 1,
        "explanation": "La transfusión intrauterina puede salvar al feto antes de la viabilidad para parto.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del primer trimestre",
    "subtema": "Aborto retenido",
    "difficulty": "Media–Alta",
    "case": "Paciente de 29 años, G1, 9 semanas por FUM. Refiere desaparición de náuseas y mastalgia desde hace una semana. Niega sangrado abundante. Solo manchado marrón escaso. Sin dolor significativo. Exploración: cérvix cerrado, útero menor al esperado. USG transvaginal: saco gestacional con embrión de 8 semanas sin actividad cardiaca.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Aborto incompleto",
          "Amenaza de aborto",
          "Aborto retenido",
          "Embarazo anembrionado"
        ],
        "answerIndex": 2,
        "explanation": "Embrión sin actividad cardiaca con cérvix cerrado y sin expulsión corresponde a aborto retenido.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Embarazo ectópico",
    "subtema": "Ectópico roto",
    "difficulty": "Alta",
    "case": "Paciente de 26 años, amenorrea de 6 semanas. Dolor abdominal súbito intenso, síncope en domicilio. TA 85/50 mmHg, FC 130 lpm. Abdomen con rebote positivo. USG FAST: líquido libre abundante en cavidad. β-hCG 4,500 mUI/mL.",
    "questions": [
      {
        "question": "Conducta inmediata:",
        "options": [
          "Metotrexato",
          "Observación",
          "Laparotomía urgente",
          "Legrado"
        ],
        "answerIndex": 2,
        "explanation": "Inestabilidad hemodinámica = ruptura tubárica → cirugía inmediata.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología hipertensiva",
    "subtema": "Eclampsia",
    "difficulty": "Muy Alta",
    "case": "Paciente de 19 años, 36 semanas, presenta convulsión tónico-clónica generalizada en sala de espera. TA 180/115 mmHg. Posterior al evento se encuentra somnolienta.",
    "questions": [
      {
        "question": "Tratamiento inmediato:",
        "options": [
          "Diazepam como único manejo",
          "Sulfato de magnesio",
          "Fenitoína",
          "Cesárea inmediata sin estabilizar"
        ],
        "answerIndex": 1,
        "explanation": "Sulfato de magnesio es el tratamiento de elección para prevenir recurrencias.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragia obstétrica",
    "subtema": "Laceración cervical",
    "difficulty": "Media–Alta",
    "case": "Paciente con parto vaginal instrumentado. Presenta sangrado abundante, pero útero firme y bien contraído.",
    "questions": [
      {
        "question": "Causa más probable:",
        "options": [
          "Atonía uterina",
          "Retención placentaria",
          "Laceración cervical",
          "CID"
        ],
        "answerIndex": 2,
        "explanation": "Útero contraído con sangrado activo sugiere lesión del canal del parto.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Oncología ginecológica",
    "subtema": "NIC II–III",
    "difficulty": "Media–Alta",
    "case": "Paciente de 32 años con citología que reporta HSIL. Colposcopía con lesión acetoblanca extensa. Biopsia: NIC III.",
    "questions": [
      {
        "question": "Conducta:",
        "options": [
          "Observación",
          "Antibióticos",
          "Escisión con asa (LEEP)",
          "Histerectomía radical"
        ],
        "answerIndex": 2,
        "explanation": "Lesiones de alto grado requieren tratamiento escisional.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Endocrinología reproductiva",
    "subtema": "Amenorrea secundaria – insuficiencia ovárica prematura",
    "difficulty": "Alta",
    "case": "Paciente de 35 años con amenorrea de 8 meses, bochornos y sequedad vaginal. FSH elevada en dos determinaciones separadas.",
    "questions": [
      {
        "question": "Diagnóstico:",
        "options": [
          "SOP",
          "Embarazo",
          "Insuficiencia ovárica prematura",
          "Hiperprolactinemia"
        ],
        "answerIndex": 2,
        "explanation": "FSH elevada persistentemente antes de los 40 años indica falla ovárica.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Obstetricia",
    "subtema": "Macrosomía fetal",
    "difficulty": "Media–Alta",
    "case": "Paciente con diabetes gestacional mal controlada. USG estima peso fetal 4,400 g a las 39 semanas.",
    "questions": [
      {
        "question": "Principal riesgo intraparto:",
        "options": [
          "Prolapso de cordón",
          "Distocia de hombros",
          "Placenta previa",
          "Corioamnionitis"
        ],
        "answerIndex": 1,
        "explanation": "Macrosomía se asocia a distocia de hombros.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Infecciones en embarazo",
    "subtema": "Corioamnionitis",
    "difficulty": "Alta",
    "case": "Paciente 32 semanas con RPM hace 48 horas. Presenta fiebre 38.5°C, taquicardia materna y fetal, dolor uterino.",
    "questions": [
      {
        "question": "Conducta:",
        "options": [
          "Continuar manejo expectante",
          "Antibióticos IV + interrupción del embarazo",
          "Tocolíticos",
          "Alta"
        ],
        "answerIndex": 1,
        "explanation": "Corioamnionitis es indicación de terminación del embarazo.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del segundo trimestre",
    "subtema": "Vasa previa",
    "difficulty": "Alta",
    "case": "Paciente de 31 años, G2P1, 35 semanas, acude por ruptura espontánea de membranas en domicilio seguida de sangrado vaginal rojo brillante moderado. Refiere disminución brusca de movimientos fetales. No presenta dolor abdominal. Exploración: TA 110/70 mmHg, FC 92 lpm. Útero no doloroso. FCF 80 lpm persistente. USG previo reportaba inserción velamentosa del cordón.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Placenta previa",
          "DPPNI",
          "Vasa previa",
          "Ruptura uterina"
        ],
        "answerIndex": 2,
        "explanation": "Sangrado posterior a RPM con bradicardia fetal y madre estable sugiere ruptura de vasos fetales.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología hipertensiva",
    "subtema": "Hipertensión gestacional",
    "difficulty": "Media",
    "case": "Paciente de 24 años, G1, 37 semanas. TA 145/92 mmHg en dos mediciones separadas por 4 horas. Sin proteinuria. Laboratorios normales. Asintomática.",
    "questions": [
      {
        "question": "Diagnóstico:",
        "options": [
          "Preeclampsia",
          "Hipertensión crónica",
          "Hipertensión gestacional",
          "Síndrome HELLP"
        ],
        "answerIndex": 2,
        "explanation": "HTA después de 20 semanas sin proteinuria ni daño orgánico.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Desproporción cefalopélvica",
    "difficulty": "Alta",
    "case": "Paciente primigesta, 40 semanas, en trabajo de parto activo con 6 cm de dilatación desde hace 5 horas pese a adecuada dinámica uterina (4 contracciones en 10 min, intensidad adecuada). Cabeza en estación -2 persistente. Feto estimado 4,100 g.",
    "questions": [
      {
        "question": "Causa más probable del arresto:",
        "options": [
          "Hipodinamia",
          "Desproporción cefalopélvica",
          "Presentación pélvica",
          "Ruptura uterina"
        ],
        "answerIndex": 1,
        "explanation": "Buena dinámica + falta de descenso sugiere problema mecánico.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Endocrinología obstétrica",
    "subtema": "Diabetes gestacional diagnóstico",
    "difficulty": "Media",
    "case": "Paciente de 29 años, 26 semanas. Curva de tolerancia oral a la glucosa con 75 g: Ayuno 98 mg/dL 1 hora 190 mg/dL 2 horas 160 mg/dL",
    "questions": [
      {
        "question": "Interpretación:",
        "options": [
          "Normal",
          "Intolerancia leve",
          "Diabetes gestacional",
          "Diabetes tipo 2"
        ],
        "answerIndex": 2,
        "explanation": "Uno o más valores alterados según criterios diagnósticos confirman diabetes gestacional.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Oncología ginecológica",
    "subtema": "Cáncer de ovario epitelial",
    "difficulty": "Alta",
    "case": "Paciente de 58 años, distensión abdominal progresiva, pérdida de peso y sensación de saciedad temprana. USG muestra masa anexial compleja bilateral con ascitis. CA-125 elevado.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Quiste funcional",
          "Endometrioma",
          "Cáncer epitelial de ovario",
          "Embarazo ectópico"
        ],
        "answerIndex": 2,
        "explanation": "Masa compleja bilateral + ascitis + CA-125 elevado en posmenopáusica es altamente sugestivo.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Puerperio",
    "subtema": "Trombosis venosa profunda",
    "difficulty": "Alta",
    "case": "Paciente de 30 años, 10 días postcesárea. Dolor y aumento de volumen en pierna izquierda. Signo de Homans positivo. Doppler venoso confirma trombosis femoral.",
    "questions": [
      {
        "question": "Tratamiento:",
        "options": [
          "Warfarina inmediata",
          "Heparina de bajo peso molecular",
          "Aspirina",
          "No tratar"
        ],
        "answerIndex": 1,
        "explanation": "HBPM es tratamiento inicial seguro en puerperio.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Infecciones ginecológicas",
    "subtema": "Vaginosis bacteriana",
    "difficulty": "Media",
    "case": "Paciente de 25 años con flujo vaginal grisáceo, olor a “pescado” que aumenta tras coito. pH vaginal 5.5. Prueba de aminas positiva.",
    "questions": [
      {
        "question": "Agente más asociado:",
        "options": [
          "Candida albicans",
          "Gardnerella vaginalis",
          "Trichomonas vaginalis",
          "Neisseria gonorrhoeae"
        ],
        "answerIndex": 1,
        "explanation": "Clínica clásica de vaginosis bacteriana.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Obstetricia",
    "subtema": "Polihidramnios",
    "difficulty": "Media",
    "case": "Paciente de 34 semanas con aumento excesivo de altura uterina. USG reporta índice de líquido amniótico de 28 cm. Feto con sospecha de atresia esofágica.",
    "questions": [
      {
        "question": "Mecanismo fisiopatológico:",
        "options": [
          "Disminución producción renal fetal",
          "Aumento de deglución fetal",
          "Disminución deglución fetal",
          "Hipertensión materna"
        ],
        "answerIndex": 2,
        "explanation": "Malformaciones gastrointestinales impiden deglución adecuada de líquido amniótico.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del tercer trimestre",
    "subtema": "Ruptura uterina",
    "difficulty": "Alta",
    "case": "Paciente de 38 años, G5P4, con antecedente de dos cesáreas previas. Cursa 39 semanas y se encuentra en trabajo de parto con prueba de trabajo después de cesárea. Presenta súbitamente dolor abdominal intenso, diferente al de las contracciones, seguido de cese de la dinámica uterina. Refiere sensación de “desgarro”. Se observa sangrado vaginal moderado. Exploración: TA 90/60 mmHg, FC 120 lpm. Abdomen doloroso, partes fetales fácilmente palpables. FCF 70 lpm sostenida.",
    "questions": [
      {
        "question": "¿Cuál es la conducta inmediata?",
        "options": [
          "Oxitocina para reiniciar dinámica",
          "Cesárea urgente con probable reparación o histerectomía",
          "Observación",
          "Analgesia y vigilancia"
        ],
        "answerIndex": 1,
        "explanation": "Ante antecedente de cesárea + dolor súbito + bradicardia fetal + inestabilidad materna, el diagnóstico es ruptura uterina y requiere intervención quirúrgica inmediata.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología hipertensiva",
    "subtema": "Preeclampsia con datos neurológicos",
    "difficulty": "Alta",
    "case": "Paciente de 25 años, 34 semanas, acude por cefalea intensa, fosfenos y visión borrosa de 24 horas de evolución. TA 165/105 mmHg. Proteinuria 2+. Plaquetas 140,000. Creatinina normal. Reflejos osteotendinosos aumentados. No convulsiones.",
    "questions": [
      {
        "question": "¿Cuál es el siguiente paso en el manejo?",
        "options": [
          "Alta con antihipertensivos orales",
          "Sulfato de magnesio y preparación para interrupción",
          "Tocolíticos",
          "Solo reposo"
        ],
        "answerIndex": 1,
        "explanation": "Síntomas neurológicos son datos de severidad aunque las plaquetas sean normales. Requiere profilaxis anticonvulsiva y resolución.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Distocia de hombros",
    "difficulty": "Alta",
    "case": "Paciente con diabetes gestacional. Parto vaginal en curso a las 39 semanas. Tras salida de la cabeza fetal se observa retracción contra el periné (“signo de la tortuga”). No progresa el resto del cuerpo.",
    "questions": [
      {
        "question": "Primera maniobra indicada:",
        "options": [
          "Tracción fuerte de la cabeza",
          "Maniobra de McRoberts",
          "Cesárea inmediata",
          "Fórceps"
        ],
        "answerIndex": 1,
        "explanation": "La maniobra de McRoberts es el primer paso para liberar hombro anterior impactado.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Endocrinología ginecológica",
    "subtema": "Síndrome de Asherman",
    "difficulty": "Media",
    "case": "Paciente de 33 años con antecedente de legrado uterino posterior a aborto complicado hace un año. Desde entonces presenta hipomenorrea progresiva hasta amenorrea. Desea embarazo. Prueba de progesterona negativa (no sangrado).",
    "questions": [
      {
        "question": "Estudio diagnóstico de elección:",
        "options": [
          "USG simple",
          "Histeroscopía diagnóstica",
          "Resonancia cerebral",
          "TAC abdominal"
        ],
        "answerIndex": 1,
        "explanation": "Ante sospecha de sinequias intrauterinas, la histeroscopía es el estándar diagnóstico y terapéutico.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Oncología ginecológica",
    "subtema": "Cáncer de endometrio",
    "difficulty": "Alta",
    "case": "Paciente de 62 años, obesa, diabética, con menopausia desde hace 12 años. Consulta por sangrado transvaginal escaso intermitente de 2 meses de evolución. USG transvaginal reporta endometrio de 14 mm.",
    "questions": [
      {
        "question": "Siguiente paso:",
        "options": [
          "Observación",
          "Biopsia endometrial",
          "Antibióticos",
          "Terapia hormonal inmediata"
        ],
        "answerIndex": 1,
        "explanation": "Sangrado postmenopáusico + endometrio engrosado obliga a descartar carcinoma con biopsia.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Obstetricia",
    "subtema": "Oligohidramnios",
    "difficulty": "Media",
    "case": "Paciente de 36 semanas con antecedente de hipertensión crónica. Refiere disminución de movimientos fetales. USG muestra índice de líquido amniótico de 4 cm. Doppler con aumento de resistencia en arteria umbilical.",
    "questions": [
      {
        "question": "Principal mecanismo en este contexto:",
        "options": [
          "Aumento de producción fetal",
          "Insuficiencia placentaria",
          "Malformación renal bilateral",
          "Diabetes materna"
        ],
        "answerIndex": 1,
        "explanation": "En hipertensión crónica, la disminución del flujo uteroplacentario reduce perfusión renal fetal y producción de orina.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del primer trimestre",
    "subtema": "Embarazo anembrionado",
    "difficulty": "Media",
    "case": "Paciente de 27 años, G1, 8 semanas por FUM, acude para ultrasonido de control. Refiere náuseas leves y mastalgia. Niega dolor o sangrado abundante, solo manchado escaso marrón en días previos. Exploración: cérvix cerrado, útero acorde a 8 semanas. USG transvaginal: saco gestacional de 30 mm sin embrión visible ni saco vitelino.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Aborto incompleto",
          "Embarazo anembrionado",
          "Embarazo ectópico",
          "Amenaza de aborto"
        ],
        "answerIndex": 1,
        "explanation": "Saco ≥25 mm sin embrión visible confirma embarazo anembrionado.",
        "gpcReference": ""
      },
      {
        "question": "Opciones de manejo incluyen:",
        "options": [
          "Solo observación obligatoria",
          "Manejo expectante, médico o quirúrgico según caso",
          "Antibióticos",
          "Tocolíticos"
        ],
        "answerIndex": 1,
        "explanation": "Puede manejarse de forma expectante, con misoprostol o legrado según preferencia y condiciones clínicas.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología hipertensiva",
    "subtema": "Hipertensión crónica con sobreagregación de preeclampsia",
    "difficulty": "Alta",
    "case": "Paciente de 36 años con antecedente de hipertensión arterial crónica desde hace 5 años. Cursa 32 semanas. Habitualmente TA 135/85 mmHg con tratamiento. Consulta por edema súbito, cefalea y elevación de TA a 160/100 mmHg. Proteinuria 1.2 g en 24 horas.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Hipertensión gestacional",
          "Preeclampsia sobreagregada a hipertensión crónica",
          "Crisis hipertensiva aislada",
          "Eclampsia"
        ],
        "answerIndex": 1,
        "explanation": "Nueva proteinuria y empeoramiento tensional en paciente previamente hipertensa sugieren sobreagregación.",
        "gpcReference": ""
      },
      {
        "question": "Principal riesgo fetal asociado:",
        "options": [
          "Macrosomía",
          "Restricción del crecimiento intrauterino",
          "Polihidramnios",
          "Hidropesía"
        ],
        "answerIndex": 1,
        "explanation": "La insuficiencia placentaria es más frecuente en este contexto.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Presentación pélvica",
    "difficulty": "Alta",
    "case": "Paciente primigesta, 38 semanas, producto único en presentación pélvica franca diagnosticada por USG. Peso estimado 3,200 g. Pelvis clínicamente adecuada. Sin comorbilidades.",
    "questions": [
      {
        "question": "Conducta recomendada en la mayoría de los casos:",
        "options": [
          "Inducción del parto vaginal sistemática",
          "Cesárea electiva",
          "Tocolíticos",
          "Observación hasta 42 semanas"
        ],
        "answerIndex": 1,
        "explanation": "La presentación pélvica en primigesta generalmente se maneja por cesárea programada.",
        "gpcReference": ""
      },
      {
        "question": "Complicación fetal más temida en parto vaginal pélvico:",
        "options": [
          "Prolapso de cordón",
          "Macrosomía",
          "Placenta previa",
          "Oligohidramnios"
        ],
        "answerIndex": 0,
        "explanation": "El prolapso de cordón es más frecuente en presentaciones no cefálicas.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Endocrinología reproductiva",
    "subtema": "Hiperplasia endometrial",
    "difficulty": "Media",
    "case": "Paciente de 48 años con sangrado uterino anormal crónico. IMC 34 kg/m². USG: endometrio 16 mm. Biopsia: hiperplasia endometrial sin atipia.",
    "questions": [
      {
        "question": "Principal mecanismo fisiopatológico:",
        "options": [
          "Exceso de progesterona",
          "Exposición prolongada a estrógenos sin oposición",
          "Infección viral",
          "Deficiencia androgénica"
        ],
        "answerIndex": 1,
        "explanation": "La obesidad favorece aromatización periférica y exceso estrogénico.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento inicial:",
        "options": [
          "Histerectomía inmediata",
          "Progestágenos",
          "Quimioterapia",
          "Antibióticos"
        ],
        "answerIndex": 1,
        "explanation": "En ausencia de atipia, se manejan con terapia progestacional.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Oncología ginecológica",
    "subtema": "Tumor germinal de ovario (Disgerminoma)",
    "difficulty": "Alta",
    "case": "Paciente de 19 años con dolor abdominal progresivo y masa anexial sólida unilateral de 10 cm. Marcadores: LDH elevada, AFP normal.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Cistadenoma seroso",
          "Disgerminoma",
          "Endometrioma",
          "Quiste funcional"
        ],
        "answerIndex": 1,
        "explanation": "Tumor sólido en mujer joven con LDH elevada orienta a disgerminoma.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento inicial en paciente joven con deseo reproductivo:",
        "options": [
          "Ooforectomía unilateral con estadificación",
          "Histerectomía total",
          "Solo quimioterapia",
          "Observación"
        ],
        "answerIndex": 0,
        "explanation": "Se preserva fertilidad si es unilateral y en etapa temprana.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Obstetricia",
    "subtema": "Prolapso de cordón umbilical",
    "difficulty": "Alta",
    "case": "Paciente de 35 semanas en trabajo de parto, presentación transversa. Tras ruptura artificial de membranas se observa cordón umbilical protruyendo por vagina. FCF 90 lpm.",
    "questions": [
      {
        "question": "Diagnóstico:",
        "options": [
          "Placenta previa",
          "Prolapso de cordón",
          "DPPNI",
          "Vasa previa"
        ],
        "answerIndex": 1,
        "explanation": "Visualización del cordón tras ruptura de membranas confirma diagnóstico.",
        "gpcReference": ""
      },
      {
        "question": "Conducta inmediata:",
        "options": [
          "Intentar reintroducir cordón y continuar trabajo",
          "Elevar presentación fetal manualmente y cesárea urgente",
          "Oxitocina",
          "Observación"
        ],
        "answerIndex": 1,
        "explanation": "Debe aliviarse compresión mientras se prepara resolución quirúrgica urgente.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología hipertensiva del embarazo",
    "subtema": "Eclampsia intraparto",
    "difficulty": "Alta",
    "case": "Paciente de 21 años, primigesta, 38 semanas, sin control prenatal adecuado. Ingresa en trabajo de parto activo con 6 cm de dilatación. TA al ingreso 155/100 mmHg. Refiere cefalea leve desde la mañana. Durante su estancia presenta crisis convulsiva tónico-clónica generalizada de aproximadamente 1 minuto. Posteriormente queda somnolienta, con respiración espontánea conservada. FCF 140 lpm reactiva. No hay datos de desprendimiento placentario. Laboratorios posteriores: plaquetas 130,000; AST ligeramente elevada; creatinina normal.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Epilepsia",
          "Crisis hipertensiva aislada",
          "Eclampsia",
          "Síndrome HELLP"
        ],
        "answerIndex": 2,
        "explanation": "Convulsión en paciente embarazada con datos hipertensivos sin otra causa aparente es eclampsia hasta demostrar lo contrario.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la primera medida terapéutica específica?",
        "options": [
          "Diazepam como manejo único",
          "Sulfato de magnesio en dosis de impregnación y mantenimiento",
          "Fenitoína",
          "Inducción inmediata sin estabilizar"
        ],
        "answerIndex": 1,
        "explanation": "El sulfato de magnesio es el fármaco de elección para prevenir recurrencia convulsiva.",
        "gpcReference": ""
      },
      {
        "question": "Tras estabilización materna, la conducta obstétrica es:",
        "options": [
          "Manejo expectante hasta 40 semanas",
          "Interrupción del embarazo independientemente de edad gestacional",
          "Alta domiciliaria",
          "Solo antihipertensivos"
        ],
        "answerIndex": 1,
        "explanation": "La eclampsia es indicación de terminación del embarazo una vez estabilizada la madre.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragia obstétrica",
    "subtema": "Inversión uterina",
    "difficulty": "Alta",
    "case": "Paciente de 29 años, parto vaginal eutócico hace 15 minutos. Tras tracción excesiva del cordón durante el alumbramiento presenta dolor súbito intenso y hemorragia profusa. Se observa masa rojiza protruyendo por vagina. TA 85/55 mmHg, FC 125 lpm. A la palpación abdominal no se identifica fondo uterino en su posición habitual.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Atonía uterina",
          "Laceración vaginal",
          "Inversión uterina",
          "Retención placentaria"
        ],
        "answerIndex": 2,
        "explanation": "Ausencia del fondo uterino abdominal y masa vaginal son característicos.",
        "gpcReference": ""
      },
      {
        "question": "Primer paso en el manejo:",
        "options": [
          "Histerectomía inmediata",
          "Reposición manual urgente del útero + manejo del choque",
          "Antibióticos",
          "Alta"
        ],
        "answerIndex": 1,
        "explanation": "Debe intentarse reposición manual inmediata antes de que se instaure edema severo.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Endocrinología obstétrica",
    "subtema": "Hipotiroidismo en embarazo",
    "difficulty": "Media",
    "case": "Paciente de 30 años, 10 semanas de gestación, antecedente de tiroiditis autoinmune. Consulta por fatiga marcada y aumento leve de peso. TSH 6.5 mUI/L, T4 libre baja. No presenta bocio significativo.",
    "questions": [
      {
        "question": "Diagnóstico:",
        "options": [
          "Hipertiroidismo",
          "Hipotiroidismo clínico",
          "Tirotoxicosis gestacional",
          "Función tiroidea normal"
        ],
        "answerIndex": 1,
        "explanation": "TSH elevada con T4 baja confirma hipotiroidismo clínico.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento indicado:",
        "options": [
          "Suspender todo manejo",
          "Levotiroxina ajustada a peso",
          "Metimazol",
          "Yodo radiactivo"
        ],
        "answerIndex": 1,
        "explanation": "El hipotiroidismo no tratado aumenta riesgo de aborto y alteraciones neurocognitivas fetales.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Oncología ginecológica",
    "subtema": "Cáncer cervicouterino localmente avanzado",
    "difficulty": "Alta",
    "case": "Paciente de 48 años con sangrado poscoital y flujo fétido desde hace 6 meses. Nunca se ha realizado Papanicolaou. Especuloscopía muestra lesión infiltrante que compromete cuello uterino y parametrios. RM confirma extensión parametrial sin invasión a pared pélvica.",
    "questions": [
      {
        "question": "Estadio probable:",
        "options": [
          "IB",
          "IIA",
          "IIB",
          "IV"
        ],
        "answerIndex": 2,
        "explanation": "Compromiso parametrial sin llegar a pared pélvica corresponde a estadio IIB.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento de elección:",
        "options": [
          "Histerectomía simple",
          "Radioterapia externa + quimioterapia concomitante",
          "Observación",
          "Crioterapia"
        ],
        "answerIndex": 1,
        "explanation": "En enfermedad localmente avanzada no resecable, el estándar es radioquimioterapia.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Obstetricia",
    "subtema": "Restricción del crecimiento intrauterino severa con Doppler crítico",
    "difficulty": "Alta",
    "case": "Paciente de 32 años, 32 semanas, antecedente de preeclampsia leve. USG muestra peso fetal < percentil 3, oligohidramnios y Doppler con ausencia de flujo diastólico en arteria umbilical. Perfil biofísico 6/10.",
    "questions": [
      {
        "question": "Significado del Doppler:",
        "options": [
          "Hallazgo normal",
          "Insuficiencia placentaria severa",
          "Error técnico",
          "Polihidramnios"
        ],
        "answerIndex": 1,
        "explanation": "La ausencia de flujo diastólico indica alto riesgo de hipoxia fetal.",
        "gpcReference": ""
      },
      {
        "question": "Conducta más adecuada:",
        "options": [
          "Alta domiciliaria",
          "Vigilancia estrecha y considerar interrupción según edad gestacional y condición fetal",
          "Solo vitaminas",
          "Inducción inmediata sin valorar viabilidad"
        ],
        "answerIndex": 1,
        "explanation": "La decisión depende del balance entre prematuridad y riesgo de muerte fetal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Ginecología",
    "subtema": "Miomatosis uterina sintomática",
    "difficulty": "Media",
    "case": "Paciente de 40 años con sangrado uterino abundante y dolor pélvico crónico. USG muestra múltiples miomas intramurales y submucosos, el mayor de 6 cm deformando cavidad endometrial. Desea preservar fertilidad.",
    "questions": [
      {
        "question": "Principal causa del sangrado:",
        "options": [
          "Deficiencia estrogénica",
          "Alteración estructural de la cavidad uterina",
          "Infección",
          "Hiperprolactinemia"
        ],
        "answerIndex": 1,
        "explanation": "Los miomas submucosos distorsionan endometrio y favorecen sangrado abundante.",
        "gpcReference": ""
      },
      {
        "question": "Opción terapéutica conservadora:",
        "options": [
          "Histerectomía total",
          "Miomectomía",
          "Radioterapia",
          "Quimioterapia"
        ],
        "answerIndex": 1,
        "explanation": "En pacientes con deseo reproductivo, la miomectomía es alternativa conservadora.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del primer trimestre",
    "subtema": "Aborto incompleto",
    "difficulty": "Media",
    "case": "Paciente de 32 años, G3P1A1, con amenorrea de 11 semanas, acude por sangrado vaginal abundante desde hace 8 horas acompañado de cólico hipogástrico intenso tipo contracción. Refiere expulsión parcial de tejido en domicilio. Exploración: TA 105/65 mmHg, FC 98 lpm. Abdomen con dolor leve a la palpación profunda. Especuloscopía: sangrado activo moderado. Tacto vaginal: cérvix dilatado 2 cm, restos tisulares palpables en canal cervical. USG transvaginal: cavidad uterina con material ecogénico heterogéneo compatible con restos ovulares retenidos.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Aborto retenido",
          "Aborto incompleto",
          "Amenaza de aborto",
          "Embarazo ectópico"
        ],
        "answerIndex": 1,
        "explanation": "Sangrado abundante + cérvix dilatado + restos intrauterinos = aborto incompleto.",
        "gpcReference": ""
      },
      {
        "question": "Conducta más adecuada en este momento:",
        "options": [
          "Observación domiciliaria",
          "Evacuación uterina (AMEU o legrado)",
          "Tocolíticos",
          "Solo analgésicos"
        ],
        "answerIndex": 1,
        "explanation": "El sangrado activo y restos retenidos indican evacuación uterina para prevenir hemorragia o infección.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología hipertensiva del embarazo",
    "subtema": "Preeclampsia sin proteinuria (criterios actuales)",
    "difficulty": "Alta",
    "case": "Paciente de 29 años, 35 semanas, con TA 160/105 mmHg en dos ocasiones separadas por 30 minutos. Niega proteinuria en tira reactiva. Refiere cefalea persistente y dolor en hipocondrio derecho. Laboratorios: plaquetas 110,000, AST 95 U/L, creatinina 1.4 mg/dL.",
    "questions": [
      {
        "question": "¿Puede diagnosticarse preeclampsia aunque no haya proteinuria?",
        "options": [
          "No, es requisito obligatorio",
          "Sí, si hay datos de daño orgánico",
          "Solo si hay edema",
          "Solo con convulsiones"
        ],
        "answerIndex": 1,
        "explanation": "Actualmente, el diagnóstico puede hacerse con HTA + datos de severidad aunque no exista proteinuria.",
        "gpcReference": ""
      },
      {
        "question": "Clasificación en este caso:",
        "options": [
          "Hipertensión gestacional",
          "Preeclampsia sin severidad",
          "Preeclampsia con datos de severidad",
          "HELLP"
        ],
        "answerIndex": 2,
        "explanation": "Plaquetopenia, alteración hepática y elevación de creatinina son criterios de severidad.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Arresto de dilatación en fase activa",
    "difficulty": "Alta",
    "case": "Primigesta de 39 semanas en trabajo de parto. Dilatación 7 cm durante 6 horas pese a adecuada dinámica uterina documentada con monitorización interna (4–5 contracciones en 10 minutos, intensidad adecuada). Cabeza fetal en estación 0. Pelvis clínicamente adecuada. FCF normal.",
    "questions": [
      {
        "question": "Diagnóstico obstétrico:",
        "options": [
          "Trabajo de parto normal",
          "Arresto de dilatación en fase activa",
          "Desproporción cefalopélvica obligatoria",
          "Hipodinamia"
        ],
        "answerIndex": 1,
        "explanation": "Falta de progresión ≥4 horas con dinámica adecuada define arresto en fase activa.",
        "gpcReference": ""
      },
      {
        "question": "Conducta:",
        "options": [
          "Continuar indefinidamente",
          "Cesárea",
          "Tocolíticos",
          "Alta"
        ],
        "answerIndex": 1,
        "explanation": "Arresto documentado con dinámica adecuada indica resolución quirúrgica.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Endocrinología ginecológica",
    "subtema": "Síndrome de ovario poliquístico – complicaciones metabólicas",
    "difficulty": "Media",
    "case": "Paciente de 26 años con diagnóstico previo de SOP. IMC 33 kg/m². Acantosis nigricans en cuello. Ciclos irregulares persistentes. Glucosa en ayuno 112 mg/dL.",
    "questions": [
      {
        "question": "Principal alteración metabólica asociada:",
        "options": [
          "Hipertiroidismo",
          "Resistencia a la insulina",
          "Hipocalcemia",
          "Deficiencia de cortisol"
        ],
        "answerIndex": 1,
        "explanation": "El SOP se asocia frecuentemente a resistencia a la insulina y síndrome metabólico.",
        "gpcReference": ""
      },
      {
        "question": "Intervención no farmacológica fundamental:",
        "options": [
          "Reposo absoluto",
          "Pérdida de peso mediante dieta y ejercicio",
          "Antibióticos",
          "Terapia hormonal obligatoria"
        ],
        "answerIndex": 1,
        "explanation": "La reducción de peso mejora ovulación y perfil metabólico.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Oncología ginecológica",
    "subtema": "Cáncer de endometrio – factores de riesgo",
    "difficulty": "Media",
    "case": "Paciente de 59 años, nulípara, obesa, con antecedente de terapia estrogénica sin oposición por 5 años. Presenta sangrado postmenopáusico. Biopsia confirma adenocarcinoma endometrioide.",
    "questions": [
      {
        "question": "Principal factor fisiopatológico implicado:",
        "options": [
          "Déficit estrogénico",
          "Estimulación estrogénica sin oposición progestacional",
          "Infección viral",
          "Trauma uterino"
        ],
        "answerIndex": 1,
        "explanation": "El exceso estrogénico crónico favorece hiperplasia y progresión a carcinoma.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento estándar en etapa temprana:",
        "options": [
          "Radioterapia exclusiva",
          "Histerectomía total con salpingooforectomía bilateral",
          "Observación",
          "Anticonceptivos"
        ],
        "answerIndex": 1,
        "explanation": "La cirugía es el tratamiento de elección en enfermedad localizada.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Obstetricia",
    "subtema": "Embolia de líquido amniótico",
    "difficulty": "Alta",
    "case": "Paciente de 35 años durante trabajo de parto presenta súbitamente disnea intensa, cianosis, hipotensión severa y pérdida de la conciencia. Posteriormente desarrolla sangrado incoercible por sitios de punción. Se documenta hipoxemia severa y alteraciones compatibles con coagulación intravascular diseminada.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Trombosis venosa profunda",
          "Embolia pulmonar clásica",
          "Embolia de líquido amniótico",
          "Crisis asmática"
        ],
        "answerIndex": 2,
        "explanation": "Colapso cardiovascular súbito intraparto + CID es altamente sugestivo.",
        "gpcReference": ""
      },
      {
        "question": "Manejo inicial:",
        "options": [
          "Anticoagulación inmediata",
          "Soporte vital avanzado y manejo en UCI",
          "Alta",
          "Solo antibióticos"
        ],
        "answerIndex": 1,
        "explanation": "Es una emergencia obstétrica con manejo principalmente de soporte intensivo.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del tercer trimestre",
    "subtema": "Placenta previa",
    "difficulty": "Alta",
    "case": "Paciente de 34 años, G4P2A1, 35 semanas de gestación, antecedente de 2 cesáreas previas, acude por sangrado vaginal rojo brillante de inicio súbito, indoloro, en cantidad moderada. Niega actividad uterina dolorosa. Refiere movimientos fetales presentes. Exploración: TA 110/70 mmHg, FC 92 lpm. Abdomen sin hipertonía uterina, no dolor a la palpación. FCF 140 lpm reactiva. No se realiza tacto vaginal digital. USG obstétrico: placenta cubriendo completamente el orificio cervical interno.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Desprendimiento prematuro de placenta",
          "Placenta previa oclusiva total",
          "Vasa previa",
          "Ruptura uterina"
        ],
        "answerIndex": 1,
        "explanation": "Sangrado rojo brillante, indoloro y placenta cubriendo OCI es característico de placenta previa.",
        "gpcReference": ""
      },
      {
        "question": "Conducta obstétrica más adecuada si el sangrado persiste:",
        "options": [
          "Inducción con oxitocina",
          "Cesárea programada urgente",
          "Tacto vaginal para valorar dilatación",
          "Manejo ambulatorio"
        ],
        "answerIndex": 1,
        "explanation": "Placenta previa oclusiva total es indicación absoluta de cesárea.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del tercer trimestre",
    "subtema": "Desprendimiento prematuro de placenta normoinserta (DPPNI)",
    "difficulty": "Alta",
    "case": "Paciente de 29 años, 37 semanas, con antecedente de hipertensión gestacional, consulta por dolor abdominal intenso súbito acompañado de sangrado oscuro escaso. Refiere disminución de movimientos fetales. Exploración: TA 150/95 mmHg, útero hipertónico, doloroso a la palpación, FCF 100 lpm con desaceleraciones tardías.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Placenta previa",
          "DPPNI",
          "Trabajo de parto normal",
          "Apendicitis"
        ],
        "answerIndex": 1,
        "explanation": "Dolor + hipertonía uterina + sangrado oscuro sugieren desprendimiento placentario.",
        "gpcReference": ""
      },
      {
        "question": "Conducta inmediata:",
        "options": [
          "Observación 24 horas",
          "Cesárea urgente",
          "Reposo domiciliario",
          "Solo antihipertensivos"
        ],
        "answerIndex": 1,
        "explanation": "Compromiso fetal + sospecha de DPPNI requiere resolución inmediata.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Infecciones en el embarazo",
    "subtema": "Corioamnionitis",
    "difficulty": "Media",
    "case": "Primigesta de 22 años, 38 semanas, con ruptura de membranas desde hace 20 horas. Presenta fiebre de 38.6°C, taquicardia materna y fetal (170 lpm). Líquido amniótico fétido.",
    "questions": [
      {
        "question": "Diagnóstico:",
        "options": [
          "Sepsis urinaria",
          "Corioamnionitis",
          "Endometritis postparto",
          "Infección vaginal simple"
        ],
        "answerIndex": 1,
        "explanation": "Fiebre + RPM prolongada + taquicardia fetal es diagnóstico clínico de corioamnionitis.",
        "gpcReference": ""
      },
      {
        "question": "Manejo:",
        "options": [
          "Solo antipiréticos",
          "Antibióticos IV de amplio espectro y resolución del embarazo",
          "Esperar cultivo",
          "Alta"
        ],
        "answerIndex": 1,
        "explanation": "El tratamiento incluye antibióticos IV y culminación del embarazo.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Anticoncepción",
    "subtema": "DIU en nulíparas",
    "difficulty": "Media",
    "case": "Paciente de 19 años, nuligesta, solicita anticoncepción de larga duración. Niega antecedentes de EPI. Ciclos regulares. Exploración normal.",
    "questions": [
      {
        "question": "¿Es el DIU una opción válida?",
        "options": [
          "No, está contraindicado en nulíparas",
          "Sí, es método seguro y eficaz",
          "Solo después del primer parto",
          "Solo si es mayor de 25 años"
        ],
        "answerIndex": 1,
        "explanation": "Las guías actuales permiten DIU en nulíparas sin contraindicación.",
        "gpcReference": ""
      },
      {
        "question": "Principal mecanismo del DIU de cobre:",
        "options": [
          "Inhibición ovulatoria",
          "Reacción inflamatoria local espermicida",
          "Bloqueo cervical hormonal",
          "Supresión hipofisaria"
        ],
        "answerIndex": 1,
        "explanation": "El cobre genera reacción inflamatoria tóxica para espermatozoides.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Oncología ginecológica",
    "subtema": "Cáncer cervicouterino – tamizaje",
    "difficulty": "Media",
    "case": "Paciente de 31 años, sin antecedentes patológicos, inicia vida sexual a los 17 años. Nunca se ha realizado citología cervical.",
    "questions": [
      {
        "question": "Método de tamizaje recomendado a su edad:",
        "options": [
          "Colposcopía inicial",
          "Papanicolaou cada 3 años",
          "Biopsia cervical",
          "Solo prueba de embarazo"
        ],
        "answerIndex": 1,
        "explanation": "En mujeres de 25–34 años se recomienda citología cervical periódica.",
        "gpcReference": ""
      },
      {
        "question": "Principal factor etiológico del cáncer cervicouterino:",
        "options": [
          "VPH oncogénico",
          "Cándida",
          "Herpes simple",
          "Trauma cervical"
        ],
        "answerIndex": 0,
        "explanation": "VPH 16 y 18 son los principales responsables.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Distocia de hombros",
    "difficulty": "Alta",
    "case": "Paciente de 28 años, G2P1, embarazo de 40 semanas con producto estimado de 4,200 g. Durante expulsivo, tras salida de la cabeza fetal, se observa retracción del mentón contra el periné (“signo de la tortuga”). No progresa el parto.",
    "questions": [
      {
        "question": "Diagnóstico:",
        "options": [
          "Prolapso de cordón",
          "Distocia de hombros",
          "Ruptura uterina",
          "Presentación anómala"
        ],
        "answerIndex": 1,
        "explanation": "El signo de la tortuga es clásico de distocia de hombros.",
        "gpcReference": ""
      },
      {
        "question": "Primera maniobra indicada:",
        "options": [
          "Maniobra de Kristeller",
          "Maniobra de McRoberts",
          "Cesárea inmediata",
          "Tracción forzada de cabeza"
        ],
        "answerIndex": 1,
        "explanation": "McRoberts es la primera intervención recomendada.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Control prenatal",
    "subtema": "Suplementación en embarazo",
    "difficulty": "Fácil",
    "case": "Paciente de 24 años, primigesta, acude a su primera consulta prenatal con 9 semanas de gestación confirmadas por ultrasonido. No antecedentes patológicos. IMC 23 kg/m². No consumo de medicamentos previo. Refiere náuseas leves. Pregunta específicamente qué suplementos debe iniciar para disminuir riesgos en su embarazo. Exploración física normal. Laboratorios iniciales sin alteraciones.",
    "questions": [
      {
        "question": "¿Qué suplemento debe indicarse de rutina en el primer trimestre para prevenir defectos del tubo neural?",
        "options": [
          "Hierro",
          "Calcio",
          "Ácido fólico",
          "Vitamina D"
        ],
        "answerIndex": 2,
        "explanation": "El ácido fólico preconcepcional y durante el primer trimestre reduce el riesgo de defectos del tubo neural.",
        "gpcReference": ""
      },
      {
        "question": "Dosis habitual recomendada en paciente sin factores de alto riesgo:",
        "options": [
          "0.4 mg al día",
          "5 mg al día",
          "10 mg al día",
          "50 mg al día"
        ],
        "answerIndex": 0,
        "explanation": "La dosis estándar es 0.4 mg diarios en embarazos de bajo riesgo.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Lactancia",
    "subtema": "Beneficios de la lactancia materna exclusiva",
    "difficulty": "Fácil",
    "case": "Puérpera de 26 años, 24 horas postparto eutócico, pregunta si puede complementar con fórmula porque “siente que no produce suficiente leche”. El recién nacido pesa 3,200 g, succión adecuada, signos vitales normales.",
    "questions": [
      {
        "question": "Recomendación actual sobre alimentación del recién nacido sano:",
        "options": [
          "Fórmula desde el nacimiento",
          "Lactancia materna exclusiva hasta los 6 meses",
          "Agua con glucosa adicional",
          "Leche evaporada"
        ],
        "answerIndex": 1,
        "explanation": "La recomendación es lactancia exclusiva los primeros 6 meses.",
        "gpcReference": ""
      },
      {
        "question": "Principal beneficio inmunológico de la leche materna:",
        "options": [
          "Contiene antibióticos sintéticos",
          "Aporta IgA secretora",
          "Genera inmunidad artificial",
          "Disminuye vacunación"
        ],
        "answerIndex": 1,
        "explanation": "La IgA secretora protege contra infecciones gastrointestinales y respiratorias.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Infecciones ginecológicas",
    "subtema": "Candidiasis vaginal",
    "difficulty": "Fácil",
    "case": "Paciente de 28 años, sexualmente activa, consulta por prurito vulvar intenso, leucorrea blanca grumosa, sin olor fétido. pH vaginal 4.5. No dolor pélvico.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Vaginosis bacteriana",
          "Candidiasis vulvovaginal",
          "Tricomoniasis",
          "EPI"
        ],
        "answerIndex": 1,
        "explanation": "Flujo blanco grumoso + prurito intenso y pH normal sugieren candidiasis.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento de primera línea:",
        "options": [
          "Metronidazol",
          "Fluconazol dosis única",
          "Ceftriaxona",
          "Doxiciclina"
        ],
        "answerIndex": 1,
        "explanation": "Azoles son el tratamiento estándar en candidiasis no complicada.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Anticoncepción",
    "subtema": "Anticoncepción hormonal combinada",
    "difficulty": "Fácil",
    "case": "Mujer de 23 años sin antecedentes médicos, no fumadora, solicita método anticonceptivo reversible. No factores de riesgo trombótico.",
    "questions": [
      {
        "question": "Mecanismo principal de los anticonceptivos combinados:",
        "options": [
          "Alteración endometrial exclusiva",
          "Inhibición de la ovulación",
          "Destrucción espermática directa",
          "Bloqueo tubárico"
        ],
        "answerIndex": 1,
        "explanation": "Su principal mecanismo es inhibir el pico de LH y evitar la ovulación.",
        "gpcReference": ""
      },
      {
        "question": "Principal contraindicación absoluta:",
        "options": [
          "Edad menor de 30",
          "Migraña con aura",
          "Nuliparidad",
          "Dismenorrea"
        ],
        "answerIndex": 1,
        "explanation": "Migraña con aura aumenta riesgo trombótico y es contraindicación.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Fases del trabajo de parto",
    "difficulty": "Fácil",
    "case": "Primigesta de 39 semanas con contracciones regulares cada 4 minutos. Dilatación cervical 5 cm, borramiento 80%, membranas íntegras.",
    "questions": [
      {
        "question": "¿En qué fase del trabajo de parto se encuentra?",
        "options": [
          "Fase latente",
          "Fase activa",
          "Periodo expulsivo",
          "Alumbramiento"
        ],
        "answerIndex": 1,
        "explanation": "Dilatación ≥4–6 cm con contracciones regulares corresponde a fase activa.",
        "gpcReference": ""
      },
      {
        "question": "Meta de progresión esperada en primigesta en fase activa:",
        "options": [
          "0.2 cm/h",
          "1 cm/h aproximadamente",
          "5 cm/h",
          "No hay referencia"
        ],
        "answerIndex": 1,
        "explanation": "Se espera progresión aproximada de 1 cm por hora en primigestas.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Climaterio",
    "subtema": "Diagnóstico de menopausia",
    "difficulty": "Fácil",
    "case": "Paciente de 50 años refiere 13 meses sin menstruación. Presenta bochornos y sudoración nocturna. No usa anticonceptivos.",
    "questions": [
      {
        "question": "Criterio diagnóstico de menopausia:",
        "options": [
          "3 meses sin menstruación",
          "6 meses sin menstruación",
          "12 meses consecutivos sin menstruación",
          "FSH obligatoria"
        ],
        "answerIndex": 2,
        "explanation": "La menopausia es diagnóstico clínico tras 12 meses de amenorrea.",
        "gpcReference": ""
      },
      {
        "question": "Hormona que se encuentra elevada fisiológicamente:",
        "options": [
          "Estradiol",
          "FSH",
          "Progesterona",
          "Prolactina"
        ],
        "answerIndex": 1,
        "explanation": "La falla ovárica provoca elevación de FSH.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología hipertensiva del embarazo",
    "subtema": "Eclampsia",
    "difficulty": "Alta",
    "case": "Paciente de 21 años, primigesta, 33 semanas de gestación, sin control prenatal adecuado, es llevada a urgencias tras presentar episodio convulsivo tónico-clónico generalizado de aproximadamente 1 minuto de duración, con recuperación parcial del estado de alerta. Familiares refieren cefalea intensa progresiva desde hace 48 horas, fosfenos y edema facial. Exploración: TA 170/115 mmHg, FC 105 lpm, FR 22 rpm. Edema en extremidades inferiores ++. Reflejos osteotendinosos exaltados. Altura uterina acorde a edad gestacional. FCF 150 lpm. Laboratorios: plaquetas 135,000; AST 70 U/L; creatinina 1.2 mg/dL. Tira reactiva con proteinuria ++.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Epilepsia primaria",
          "Preeclampsia sin severidad",
          "Eclampsia",
          "Crisis hipertensiva aislada"
        ],
        "answerIndex": 2,
        "explanation": "La presencia de convulsión en paciente con datos de preeclampsia confirma eclampsia, independientemente del nivel de proteinuria.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento anticonvulsivante de primera línea:",
        "options": [
          "Diazepam",
          "Fenitoína",
          "Sulfato de magnesio",
          "Ácido valproico"
        ],
        "answerIndex": 2,
        "explanation": "El sulfato de magnesio es el fármaco de elección para prevenir recurrencia convulsiva en eclampsia.",
        "gpcReference": ""
      },
      {
        "question": "Conducta obstétrica definitiva:",
        "options": [
          "Prolongar embarazo hasta término",
          "Interrumpir embarazo una vez estabilizada",
          "Solo antihipertensivos",
          "Alta domiciliaria"
        ],
        "answerIndex": 1,
        "explanation": "La resolución del embarazo es el tratamiento definitivo tras estabilización materna.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragia obstétrica",
    "subtema": "Atonía uterina",
    "difficulty": "Alta",
    "case": "Paciente de 30 años, G3P3, inmediatamente posterior a parto eutócico de producto de 4,100 g. Placenta íntegra expulsada. A los pocos minutos presenta sangrado vaginal abundante que empapa compresas rápidamente. Se observa útero aumentado de tamaño, blando, por arriba del ombligo. TA 90/60 mmHg, FC 120 lpm. Paciente pálida, diaforética.",
    "questions": [
      {
        "question": "Causa más probable de la hemorragia:",
        "options": [
          "Retención placentaria",
          "Atonía uterina",
          "Laceración cervical",
          "Coagulopatía primaria"
        ],
        "answerIndex": 1,
        "explanation": "Útero blando y aumentado de tamaño en contexto inmediato postparto sugiere atonía uterina, causa más frecuente de hemorragia obstétrica.",
        "gpcReference": ""
      },
      {
        "question": "Primera intervención:",
        "options": [
          "Histerectomía inmediata",
          "Masaje uterino bimanual",
          "Esperar evolución",
          "Antibióticos"
        ],
        "answerIndex": 1,
        "explanation": "El masaje uterino es la primera medida para estimular contracción.",
        "gpcReference": ""
      },
      {
        "question": "Uterotónico de primera línea:",
        "options": [
          "Metilergonovina",
          "Oxitocina",
          "Misoprostol como primera opción obligatoria",
          "Ácido tranexámico exclusivo"
        ],
        "answerIndex": 1,
        "explanation": "La oxitocina IV es el uterotónico inicial recomendado.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Embarazo ectópico",
    "subtema": "Manejo médico con metotrexato",
    "difficulty": "Media",
    "case": "Paciente de 27 años, G2P0A1, 7 semanas por FUM, acude por dolor pélvico leve y manchado escaso. Hemodinámicamente estable. BHCG 1,800 mUI/mL. USG transvaginal: no saco intrauterino visible, masa anexial derecha de 2.5 cm sin actividad cardiaca embrionaria, sin líquido libre significativo.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Aborto completo",
          "Embarazo ectópico no complicado",
          "Quiste ovárico simple",
          "Amenaza de aborto"
        ],
        "answerIndex": 1,
        "explanation": "BHCG positiva sin saco intrauterino y masa anexial compatible sugiere ectópico.",
        "gpcReference": ""
      },
      {
        "question": "Criterio que permite manejo médico:",
        "options": [
          "Inestabilidad hemodinámica",
          "Masa menor de 4 cm y sin latido embrionario",
          "Hemoperitoneo abundante",
          "Dolor intenso con choque"
        ],
        "answerIndex": 1,
        "explanation": "El manejo con metotrexato está indicado en pacientes estables con criterios específicos.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Infecciones de transmisión sexual",
    "subtema": "Enfermedad pélvica inflamatoria",
    "difficulty": "Media",
    "case": "Paciente de 23 años consulta por dolor pélvico bilateral de 4 días de evolución, fiebre 38.3°C y leucorrea mucopurulenta. Refiere múltiples parejas sexuales y uso irregular de preservativo. Exploración: dolor a la movilización cervical, dolor anexial bilateral. BH con leucocitosis leve.",
    "questions": [
      {
        "question": "Diagnóstico clínico más probable:",
        "options": [
          "Apendicitis",
          "Embarazo ectópico roto",
          "Enfermedad pélvica inflamatoria",
          "Endometriosis"
        ],
        "answerIndex": 2,
        "explanation": "Dolor a la movilización cervical + fiebre + flujo mucopurulento es criterio clínico de EPI.",
        "gpcReference": ""
      },
      {
        "question": "Esquema antibiótico ambulatorio recomendado:",
        "options": [
          "Ceftriaxona + doxiciclina + metronidazol",
          "Penicilina sola",
          "Fluconazol",
          "Azitromicina sola"
        ],
        "answerIndex": 0,
        "explanation": "Se requiere cobertura para gonococo, clamidia y anaerobios.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Diabetes gestacional",
    "subtema": "Tamizaje y diagnóstico",
    "difficulty": "Media",
    "case": "Paciente de 31 años, 26 semanas, IMC 31 kg/m², antecedente familiar de diabetes. Se realiza prueba de tamiz con 50 g de glucosa, resultado 165 mg/dL a la hora.",
    "questions": [
      {
        "question": "Conducta siguiente:",
        "options": [
          "Diagnosticar diabetes gestacional",
          "Realizar curva de tolerancia con 100 g",
          "Repetir tamiz",
          "Iniciar insulina"
        ],
        "answerIndex": 1,
        "explanation": "Tamiz alterado requiere prueba confirmatoria con carga de 100 g.",
        "gpcReference": ""
      },
      {
        "question": "Complicación fetal asociada más frecuente:",
        "options": [
          "Restricción del crecimiento",
          "Macrosomía fetal",
          "Microcefalia",
          "Atresia intestinal"
        ],
        "answerIndex": 1,
        "explanation": "La hiperglucemia materna favorece hiperinsulinismo fetal y macrosomía.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Oncología ginecológica",
    "subtema": "Lesión intraepitelial escamosa de alto grado",
    "difficulty": "Alta",
    "case": "Paciente de 35 años con citología que reporta LIEAG (HSIL). Colposcopía muestra zona acetoblanca extensa con mosaico grueso. Biopsia confirma NIC III.",
    "questions": [
      {
        "question": "Conducta terapéutica recomendada:",
        "options": [
          "Observación anual",
          "Tratamiento escisional (LEEP o conización)",
          "Antibióticos",
          "Histerectomía inmediata en todos los casos"
        ],
        "answerIndex": 1,
        "explanation": "NIC III requiere tratamiento escisional para prevenir progresión a carcinoma invasor.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Ruptura prematura de membranas a término",
    "difficulty": "Media",
    "case": "Paciente de 25 años, primigesta, 39 semanas de gestación, acude por salida súbita de líquido claro abundante hace 3 horas. Niega fiebre, niega sangrado. Percibe movimientos fetales normales. Exploración: TA 110/70 mmHg, FC 88 lpm, T 36.8°C. Abdomen con producto único, longitudinal, cefálico. FCF 145 lpm reactiva. Especuloscopía: salida de líquido claro por orificio cervical. Prueba de cristalización positiva. Cérvix posterior, 1 cm de dilatación, 30% borrado. Sin actividad uterina regular.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico?",
        "options": [
          "Trabajo de parto activo",
          "Ruptura prematura de membranas a término",
          "Amenaza de parto pretérmino",
          "Incompetencia cervical"
        ],
        "answerIndex": 1,
        "explanation": "Salida de líquido amniótico antes del inicio del trabajo de parto en embarazo ≥37 semanas corresponde a RPM a término.",
        "gpcReference": ""
      },
      {
        "question": "Conducta inicial más adecuada:",
        "options": [
          "Manejo expectante indefinido",
          "Inducción del trabajo de parto",
          "Tocolíticos",
          "Alta domiciliaria"
        ],
        "answerIndex": 1,
        "explanation": "En RPM a término se recomienda inducir el trabajo de parto para disminuir riesgo de infección.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Parto pretérmino",
    "subtema": "Amenaza de parto pretérmino",
    "difficulty": "Alta",
    "case": "Paciente de 29 años, G2P1, 32 semanas de gestación, acude por contracciones dolorosas cada 8 minutos desde hace 4 horas. Refiere sensación de presión pélvica. No salida de líquido. Exploración: TA 115/75 mmHg. FCF 150 lpm. Tacto vaginal: dilatación 2 cm, borramiento 50%, membranas íntegras. USG: longitud cervical 20 mm.",
    "questions": [
      {
        "question": "Diagnóstico:",
        "options": [
          "Trabajo de parto pretérmino establecido",
          "Amenaza de parto pretérmino",
          "Incompetencia cervical",
          "Falso trabajo de parto"
        ],
        "answerIndex": 1,
        "explanation": "Hay actividad uterina y cambios cervicales leves antes de 37 semanas sin progresión franca.",
        "gpcReference": ""
      },
      {
        "question": "Intervención farmacológica para maduración pulmonar fetal:",
        "options": [
          "Sulfato de magnesio",
          "Betametasona",
          "Oxitocina",
          "Misoprostol"
        ],
        "answerIndex": 1,
        "explanation": "Los corticosteroides antenatales reducen síndrome de dificultad respiratoria neonatal.",
        "gpcReference": ""
      },
      {
        "question": "Objetivo principal del uso de tocolíticos en este contexto:",
        "options": [
          "Evitar parto definitivamente",
          "Ganar 48 horas para efecto de corticoides",
          "Suspender embarazo hasta término",
          "Disminuir dolor materno"
        ],
        "answerIndex": 1,
        "explanation": "El objetivo es retrasar el parto para permitir acción de esteroides.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragia obstétrica",
    "subtema": "Retención de restos placentarios",
    "difficulty": "Media",
    "case": "Paciente de 34 años, 2 horas postparto eutócico, presenta sangrado persistente moderado pese a útero contraído y firme. Placenta aparentemente completa al momento de la expulsión. TA 100/65 mmHg, FC 105 lpm. USG transabdominal: imagen ecogénica intrauterina compatible con restos placentarios.",
    "questions": [
      {
        "question": "Causa más probable de la hemorragia:",
        "options": [
          "Atonía uterina",
          "Laceración vaginal",
          "Retención de restos placentarios",
          "Coagulopatía primaria"
        ],
        "answerIndex": 2,
        "explanation": "Útero firme con sangrado persistente sugiere restos retenidos.",
        "gpcReference": ""
      },
      {
        "question": "Manejo indicado:",
        "options": [
          "Observación",
          "Revisión uterina y evacuación instrumental",
          "Antibiótico exclusivo",
          "Anticonceptivos"
        ],
        "answerIndex": 1,
        "explanation": "Debe evacuarse el contenido retenido para controlar hemorragia.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Endometriosis",
    "subtema": "Presentación clínica clásica",
    "difficulty": "Media",
    "case": "Paciente de 30 años, nulípara, refiere dismenorrea progresiva desde hace 3 años, dolor pélvico crónico y dispareunia profunda. Desea embarazo desde hace 2 años sin éxito. Exploración: dolor a la movilización uterina, nodularidad en fondo de saco posterior. USG transvaginal: quiste ovárico izquierdo de 4 cm con contenido homogéneo en “vidrio esmerilado”.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Quiste funcional",
          "Endometrioma ovárico",
          "Absceso tubo-ovárico",
          "Mioma subseroso"
        ],
        "answerIndex": 1,
        "explanation": "Imagen en vidrio esmerilado + dolor pélvico crónico es típica de endometriosis.",
        "gpcReference": ""
      },
      {
        "question": "Estudio confirmatorio definitivo:",
        "options": [
          "CA-125",
          "Resonancia",
          "Laparoscopía diagnóstica",
          "Biometría hemática"
        ],
        "answerIndex": 2,
        "explanation": "La laparoscopía con visualización directa es estándar diagnóstico definitivo.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Climaterio",
    "subtema": "Terapia hormonal de reemplazo",
    "difficulty": "Alta",
    "case": "Paciente de 52 años, 2 años postmenopausia, presenta bochornos intensos, insomnio y deterioro importante en calidad de vida. No antecedentes personales de cáncer, trombosis o enfermedad hepática. IMC 26 kg/m². Pregunta por tratamiento hormonal.",
    "questions": [
      {
        "question": "¿Es candidata potencial a terapia hormonal?",
        "options": [
          "No, está contraindicada en todas",
          "Sí, si no tiene contraindicaciones",
          "Solo si tiene osteoporosis",
          "Solo si tiene menos de 45 años"
        ],
        "answerIndex": 1,
        "explanation": "Puede indicarse en mujeres sintomáticas sin contraindicaciones y dentro de ventana terapéutica.",
        "gpcReference": ""
      },
      {
        "question": "En paciente con útero intacto, el esquema debe incluir:",
        "options": [
          "Solo estrógeno",
          "Estrógeno + progestágeno",
          "Solo progesterona",
          "Andrógenos"
        ],
        "answerIndex": 1,
        "explanation": "El progestágeno previene hiperplasia endometrial inducida por estrógeno.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Oncología ginecológica",
    "subtema": "Cáncer de ovario – presentación clínica",
    "difficulty": "Alta",
    "case": "Paciente de 60 años, multipara, refiere distensión abdominal progresiva, saciedad temprana y pérdida de peso no intencionada desde hace 4 meses. Exploración: ascitis moderada, masa anexial derecha irregular de 8 cm. CA-125 elevado.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Miomatosis uterina",
          "Cáncer epitelial de ovario",
          "Embarazo ectópico",
          "Quiste funcional"
        ],
        "answerIndex": 1,
        "explanation": "Masa anexial compleja + ascitis + CA-125 elevado en postmenopáusica es altamente sugestivo.",
        "gpcReference": ""
      },
      {
        "question": "Estudio inicial para estadificación:",
        "options": [
          "Radiografía simple",
          "TAC abdominopélvica",
          "Histeroscopía",
          "Colposcopía"
        ],
        "answerIndex": 1,
        "explanation": "La tomografía permite evaluar extensión intraabdominal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del primer trimestre",
    "subtema": "Embarazo molar (Mola hidatidiforme completa)",
    "difficulty": "Alta",
    "case": "Paciente de 19 años, G1P0, 11 semanas por FUM, acude por sangrado vaginal intermitente oscuro desde hace 5 días, acompañado de náusea y vómito intensos incapacitantes. Refiere sensación de crecimiento abdominal mayor al esperado para la edad gestacional. Exploración: TA 140/90 mmHg, FC 96 lpm. Útero palpable a nivel de 16 semanas aproximadamente. No se auscultan latidos fetales con Doppler. Tacto vaginal: cérvix cerrado, sangrado escaso. Laboratorios: BHCG 280,000 mUI/mL. USG transvaginal: imagen en “copos de nieve”, sin embrión visible.",
    "questions": [
      {
        "question": "¿Cuál es el diagnóstico más probable?",
        "options": [
          "Aborto retenido",
          "Embarazo molar completo",
          "Embarazo ectópico",
          "Gestación múltiple"
        ],
        "answerIndex": 1,
        "explanation": "BHCG muy elevada + útero mayor al esperado + imagen en copos de nieve sin embrión sugieren mola completa.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento inicial indicado:",
        "options": [
          "Legrado uterino evacuador por aspiración",
          "Oxitocina",
          "Histerectomía obligatoria",
          "Metotrexato inicial"
        ],
        "answerIndex": 0,
        "explanation": "El manejo inicial es evacuación uterina mediante aspiración.",
        "gpcReference": ""
      },
      {
        "question": "Seguimiento posterior imprescindible:",
        "options": [
          "USG semanal",
          "BHCG seriada hasta negativización",
          "Radiografía anual",
          "Anticonceptivos de barrera exclusivamente"
        ],
        "answerIndex": 1,
        "explanation": "El seguimiento con BHCG seriada detecta enfermedad trofoblástica persistente.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología hipertensiva del embarazo",
    "subtema": "Síndrome HELLP",
    "difficulty": "Alta",
    "case": "Paciente de 30 años, 34 semanas, con antecedente de preeclampsia diagnosticada hace 1 semana, acude por dolor intenso en epigastrio irradiado a hipocondrio derecho, náusea y malestar general. Exploración: TA 165/110 mmHg. Edema ++. Reflejos aumentados. Laboratorios: plaquetas 75,000; AST 220 U/L; LDH elevada; bilirrubina indirecta elevada; esquistocitos en frotis.",
    "questions": [
      {
        "question": "Diagnóstico:",
        "options": [
          "Hepatitis aguda",
          "Síndrome HELLP",
          "Gastritis",
          "Colecistitis"
        ],
        "answerIndex": 1,
        "explanation": "Hemólisis + enzimas hepáticas elevadas + trombocitopenia definen HELLP.",
        "gpcReference": ""
      },
      {
        "question": "Conducta obstétrica:",
        "options": [
          "Manejo expectante hasta término",
          "Interrupción del embarazo tras estabilización",
          "Solo antihipertensivos",
          "Alta"
        ],
        "answerIndex": 1,
        "explanation": "HELLP es indicación de resolución una vez estabilizada la paciente.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Prolapso de cordón umbilical",
    "difficulty": "Alta",
    "case": "Paciente de 27 años, 38 semanas, en trabajo de parto con 4 cm de dilatación. Durante exploración tras ruptura artificial de membranas se documenta descenso brusco de FCF a 80 lpm sostenidos. Al tacto se palpa estructura pulsátil en vagina por delante de la presentación cefálica.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Bradicardia fetal transitoria",
          "Prolapso de cordón umbilical",
          "DPPNI",
          "Ruptura uterina"
        ],
        "answerIndex": 1,
        "explanation": "Palpación de cordón + bradicardia fetal sostenida es diagnóstico clínico.",
        "gpcReference": ""
      },
      {
        "question": "Conducta inmediata:",
        "options": [
          "Esperar recuperación espontánea",
          "Cesárea urgente",
          "Tocolíticos",
          "Antibióticos"
        ],
        "answerIndex": 1,
        "explanation": "Es una emergencia obstétrica que requiere resolución inmediata.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Infecciones en el embarazo",
    "subtema": "Bacteriuria asintomática",
    "difficulty": "Media",
    "case": "Paciente de 24 años, 18 semanas de gestación, sin síntomas urinarios. Urocultivo de control prenatal reporta 120,000 UFC/mL de E. coli. Sin fiebre, sin dolor lumbar.",
    "questions": [
      {
        "question": "Conducta correcta:",
        "options": [
          "No tratar por ausencia de síntomas",
          "Iniciar antibiótico seguro en embarazo",
          "Solo vigilancia",
          "Repetir estudio en 1 mes sin tratamiento"
        ],
        "answerIndex": 1,
        "explanation": "La bacteriuria asintomática en embarazo debe tratarse para prevenir pielonefritis.",
        "gpcReference": ""
      },
      {
        "question": "Complicación si no se trata:",
        "options": [
          "Diabetes gestacional",
          "Pielonefritis",
          "Eclampsia",
          "Placenta previa"
        ],
        "answerIndex": 1,
        "explanation": "La progresión a pielonefritis es la complicación más relevante.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Miomatosis uterina",
    "subtema": "Mioma submucoso y sangrado uterino anormal",
    "difficulty": "Media",
    "case": "Paciente de 38 años, G2P2, refiere menstruaciones abundantes y prolongadas desde hace 8 meses, con coágulos y anemia progresiva. Niega dolor pélvico importante. Exploración: útero ligeramente aumentado de tamaño. USG: mioma submucoso de 3.5 cm protruyendo hacia cavidad endometrial.",
    "questions": [
      {
        "question": "Causa más probable del sangrado:",
        "options": [
          "Adenomiosis",
          "Mioma submucoso",
          "Embarazo ectópico",
          "Endometriosis"
        ],
        "answerIndex": 1,
        "explanation": "Los miomas submucosos se asocian con sangrado uterino anormal.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento quirúrgico de elección si desea conservar fertilidad:",
        "options": [
          "Histerectomía",
          "Miomectomía histeroscópica",
          "Oclusión tubaria",
          "Radioterapia"
        ],
        "answerIndex": 1,
        "explanation": "La resección histeroscópica es ideal para miomas submucosos.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Cáncer cervicouterino",
    "subtema": "Cáncer invasor estadio temprano",
    "difficulty": "Alta",
    "case": "Paciente de 42 años con biopsia cervical que reporta carcinoma epidermoide invasor. Resonancia muestra lesión confinada al cuello uterino sin extensión parametrial.",
    "questions": [
      {
        "question": "Estadio clínico probable:",
        "options": [
          "I",
          "II",
          "III",
          "IV"
        ],
        "answerIndex": 0,
        "explanation": "Enfermedad limitada al cuello corresponde a estadio I.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento estándar en estadio temprano:",
        "options": [
          "Radioterapia exclusiva",
          "Histerectomía radical con linfadenectomía",
          "Observación",
          "Anticonceptivos"
        ],
        "answerIndex": 1,
        "explanation": "El manejo quirúrgico es opción en estadios tempranos sin diseminación.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Control prenatal",
    "subtema": "Cálculo de edad gestacional",
    "difficulty": "Fácil",
    "case": "Paciente de 22 años, primigesta, acude a consulta de primera vez. Refiere FUM el 3 de marzo, con ciclos regulares de 28 días. No antecedentes relevantes. Niega sangrado o dolor. Exploración física normal. Solicita saber su fecha probable de parto. La consulta se realiza el 10 de mayo del mismo año.",
    "questions": [
      {
        "question": "¿Qué método clínico se utiliza para calcular la fecha probable de parto?",
        "options": [
          "Fórmula de Parkland",
          "Fórmula de Naegele",
          "Índice de Bishop",
          "Regla de Apgar"
        ],
        "answerIndex": 1,
        "explanation": "La fórmula de Naegele es el método clásico para estimar FPP en ciclos regulares.",
        "gpcReference": ""
      },
      {
        "question": "La fecha probable de parto aproximada sería:",
        "options": [
          "10 de diciembre",
          "10 de enero",
          "10 de diciembre del mismo año",
          "3 de noviembre"
        ],
        "answerIndex": 2,
        "explanation": "Se suman 7 días y se restan 3 meses a la FUM.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Puerperio",
    "subtema": "Endometritis puerperal",
    "difficulty": "Media",
    "case": "Paciente de 30 años, 5 días postcesárea por sufrimiento fetal. Consulta por fiebre de 38.5°C, malestar general y dolor hipogástrico progresivo. Refiere loquios fétidos. Exploración: TA 110/70 mmHg, FC 102 lpm. Útero doloroso a la palpación. Herida quirúrgica sin datos de infección superficial. Laboratorios: leucocitosis con neutrofilia.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Infección urinaria",
          "Endometritis puerperal",
          "Mastitis",
          "Trombosis venosa profunda"
        ],
        "answerIndex": 1,
        "explanation": "Fiebre + dolor uterino + loquios fétidos postcesárea es típico de endometritis.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento inicial:",
        "options": [
          "Amoxicilina oral",
          "Esquema antibiótico IV de amplio espectro",
          "Antiinflamatorios",
          "Alta domiciliaria"
        ],
        "answerIndex": 1,
        "explanation": "Se requiere cobertura IV amplia por flora polimicrobiana.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Anticoncepción",
    "subtema": "Anticoncepción de emergencia",
    "difficulty": "Fácil",
    "case": "Paciente de 19 años acude 24 horas después de relación sexual sin protección. Ciclos regulares. No antecedentes trombóticos.",
    "questions": [
      {
        "question": "Método farmacológico más eficaz dentro de las primeras 72 horas:",
        "options": [
          "Misoprostol",
          "Levonorgestrel",
          "Metotrexato",
          "Oxitocina"
        ],
        "answerIndex": 1,
        "explanation": "Levonorgestrel es método hormonal de emergencia eficaz si se administra oportunamente.",
        "gpcReference": ""
      },
      {
        "question": "Mecanismo principal:",
        "options": [
          "Interrupción de embarazo implantado",
          "Inhibición o retraso de la ovulación",
          "Destrucción del embrión",
          "Contracción uterina"
        ],
        "answerIndex": 1,
        "explanation": "Actúa principalmente inhibiendo o retrasando la ovulación.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragia obstétrica",
    "subtema": "Inversión uterina",
    "difficulty": "Alta",
    "case": "Paciente de 27 años, inmediatamente posterior al alumbramiento, presenta dolor intenso súbito, hemorragia abundante y colapso hemodinámico. Se observa masa rojiza protruyendo por vagina. Útero no palpable en abdomen. TA 80/50 mmHg, FC 130 lpm.",
    "questions": [
      {
        "question": "Diagnóstico:",
        "options": [
          "Atonía uterina",
          "Inversión uterina",
          "Retención placentaria",
          "Ruptura uterina"
        ],
        "answerIndex": 1,
        "explanation": "Masa vaginal + ausencia de fondo uterino abdominal es clásica de inversión.",
        "gpcReference": ""
      },
      {
        "question": "Manejo inmediato prioritario:",
        "options": [
          "Histerectomía directa",
          "Reposición manual inmediata del útero",
          "Antibióticos",
          "Alta"
        ],
        "answerIndex": 1,
        "explanation": "La reposición manual urgente es esencial antes de que se establezca edema severo.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trastornos menstruales",
    "subtema": "Amenorrea secundaria",
    "difficulty": "Media",
    "case": "Paciente de 25 años con ausencia de menstruación desde hace 4 meses. Ciclos previos regulares. Vida sexual activa sin anticoncepción. Niega galactorrea o síntomas tiroideos. Exploración normal.",
    "questions": [
      {
        "question": "Primer estudio a solicitar:",
        "options": [
          "Perfil tiroideo",
          "Prolactina",
          "Prueba de embarazo",
          "Ultrasonido transvaginal"
        ],
        "answerIndex": 2,
        "explanation": "Siempre debe descartarse embarazo como primera causa de amenorrea secundaria.",
        "gpcReference": ""
      },
      {
        "question": "Causa más frecuente de amenorrea secundaria:",
        "options": [
          "Síndrome de Asherman",
          "Embarazo",
          "Tumor hipofisario",
          "Insuficiencia ovárica primaria"
        ],
        "answerIndex": 1,
        "explanation": "El embarazo es la causa más común.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Infecciones ginecológicas",
    "subtema": "Vaginosis bacteriana",
    "difficulty": "Fácil",
    "case": "Paciente de 28 años consulta por flujo vaginal grisáceo con olor fétido tipo “pescado” que se intensifica después de relaciones sexuales. No prurito intenso. pH vaginal 5.5. Prueba de aminas positiva.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Candidiasis",
          "Vaginosis bacteriana",
          "Tricomoniasis",
          "EPI"
        ],
        "answerIndex": 1,
        "explanation": "Flujo grisáceo + pH elevado + prueba de aminas positiva es diagnóstico clínico.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento de elección:",
        "options": [
          "Fluconazol",
          "Metronidazol",
          "Ceftriaxona",
          "Clindamicina tópica exclusivamente obligatoria"
        ],
        "answerIndex": 1,
        "explanation": "Metronidazol es tratamiento estándar.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Embarazo ectópico",
    "subtema": "Embarazo ectópico roto",
    "difficulty": "Alta",
    "case": "Paciente de 31 años, G2P1A0, 8 semanas por FUM, acude a urgencias por dolor abdominal súbito, intenso, localizado en fosa iliaca derecha, acompañado de lipotimia. Refiere manchado vaginal escaso desde hace 2 días. No control prenatal. Exploración: TA 85/55 mmHg, FC 122 lpm, palidez generalizada, diaforesis. Abdomen con dolor intenso a la palpación y datos de irritación peritoneal. Tacto vaginal: cérvix cerrado, dolor a la movilización cervical, fondo de saco posterior doloroso. BHCG positiva. USG FAST con líquido libre abundante en cavidad abdominal.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Apendicitis perforada",
          "Aborto incompleto",
          "Embarazo ectópico roto",
          "Quiste ovárico complicado"
        ],
        "answerIndex": 2,
        "explanation": "Dolor súbito + inestabilidad hemodinámica + líquido libre + embarazo temprano es clásico de ectópico roto.",
        "gpcReference": ""
      },
      {
        "question": "Conducta inmediata:",
        "options": [
          "Metotrexato",
          "Observación",
          "Laparotomía/laparoscopía urgente",
          "Repetir BHCG"
        ],
        "answerIndex": 2,
        "explanation": "La inestabilidad hemodinámica contraindica manejo médico; requiere cirugía urgente.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragia obstétrica",
    "subtema": "Ruptura uterina",
    "difficulty": "Alta",
    "case": "Paciente de 36 años, G4P3, antecedente de cesárea segmentaria previa, en trabajo de parto con inducción mediante oxitocina. Presenta dolor abdominal súbito, intenso y persistente, seguido de pérdida de la dinámica uterina. FCF cae a 70 lpm. Se palpan fácilmente partes fetales a través del abdomen. TA 90/60 mmHg, FC 118 lpm.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "DPPNI",
          "Ruptura uterina",
          "Prolapso de cordón",
          "Atonía uterina"
        ],
        "answerIndex": 1,
        "explanation": "Antecedente de cesárea + dolor súbito + pérdida de dinámica + bradicardia fetal sugieren ruptura uterina.",
        "gpcReference": ""
      },
      {
        "question": "Manejo inmediato:",
        "options": [
          "Incrementar oxitocina",
          "Cesárea/laparotomía urgente",
          "Tocolíticos",
          "Observación"
        ],
        "answerIndex": 1,
        "explanation": "Es emergencia quirúrgica materno-fetal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Control prenatal",
    "subtema": "Pruebas de laboratorio iniciales",
    "difficulty": "Fácil",
    "case": "Paciente de 20 años, 10 semanas de gestación, acude a su primera consulta prenatal. Sin antecedentes patológicos. No síntomas actuales.",
    "questions": [
      {
        "question": "¿Cuál de los siguientes estudios forma parte del tamizaje inicial obligatorio?",
        "options": [
          "TAC abdominopélvica",
          "Grupo sanguíneo y Rh",
          "Resonancia magnética",
          "CA-125"
        ],
        "answerIndex": 1,
        "explanation": "Determinación de grupo y Rh es fundamental para prevención de isoinmunización.",
        "gpcReference": ""
      },
      {
        "question": "Si la paciente es Rh negativo y la pareja Rh positivo, debe:",
        "options": [
          "No hacer nada",
          "Aplicar inmunoglobulina anti-D según protocolo",
          "Inducir parto temprano",
          "Suspender embarazo"
        ],
        "answerIndex": 1,
        "explanation": "La profilaxis anti-D previene enfermedad hemolítica perinatal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trastornos hipertensivos",
    "subtema": "Hipertensión gestacional",
    "difficulty": "Media",
    "case": "Paciente de 28 años, 37 semanas, sin antecedentes, presenta TA 145/95 mmHg en dos ocasiones separadas por 4 horas. Niega cefalea, fosfenos o dolor epigástrico. Proteinuria negativa. Laboratorios normales.",
    "questions": [
      {
        "question": "Diagnóstico:",
        "options": [
          "Preeclampsia",
          "Hipertensión gestacional",
          "Eclampsia",
          "HELLP"
        ],
        "answerIndex": 1,
        "explanation": "HTA posterior a 20 semanas sin proteinuria ni datos de severidad corresponde a hipertensión gestacional.",
        "gpcReference": ""
      },
      {
        "question": "Conducta a las 37 semanas:",
        "options": [
          "Continuar embarazo hasta 41 semanas",
          "Interrumpir embarazo",
          "Tocolíticos",
          "Solo dieta"
        ],
        "answerIndex": 1,
        "explanation": "A término se recomienda resolución obstétrica.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología mamaria",
    "subtema": "Mastitis puerperal",
    "difficulty": "Media",
    "case": "Puérpera de 3 semanas, lactando, consulta por dolor en mama izquierda, eritema localizado, fiebre de 38.2°C y malestar general. Refiere grietas en pezón. Exploración: zona eritematosa caliente y dolorosa, sin fluctuación evidente.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Absceso mamario",
          "Mastitis puerperal",
          "Cáncer inflamatorio",
          "Galactocele"
        ],
        "answerIndex": 1,
        "explanation": "Cuadro infeccioso localizado sin colección definida sugiere mastitis.",
        "gpcReference": ""
      },
      {
        "question": "Conducta adecuada:",
        "options": [
          "Suspender lactancia",
          "Antibiótico y continuar lactancia",
          "Drenaje quirúrgico inmediato",
          "Observación"
        ],
        "answerIndex": 1,
        "explanation": "Debe continuarse lactancia y administrar antibiótico adecuado.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trastornos menstruales",
    "subtema": "Dismenorrea primaria",
    "difficulty": "Fácil",
    "case": "Adolescente de 16 años, ciclos regulares desde los 13 años, presenta dolor tipo cólico intenso durante los primeros 2 días de menstruación, sin síntomas intermenstruales. Exploración normal.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Endometriosis",
          "Dismenorrea primaria",
          "EPI",
          "Miomatosis"
        ],
        "answerIndex": 1,
        "explanation": "Dolor menstrual en adolescente sin patología estructural sugiere dismenorrea primaria.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento inicial de elección:",
        "options": [
          "Antibióticos",
          "AINEs",
          "Cirugía",
          "Anticonvulsivos"
        ],
        "answerIndex": 1,
        "explanation": "Los AINEs inhiben prostaglandinas, mecanismo fisiopatológico principal.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del tercer trimestre",
    "subtema": "Vasa previa",
    "difficulty": "Alta",
    "case": "Paciente de 33 años, G2P1, 38 semanas, en trabajo de parto inicial con 3 cm de dilatación. Durante la ruptura artificial de membranas se observa salida de líquido amniótico claro seguida de sangrado vaginal rojo brillante en pequeña cantidad. Inmediatamente se documenta bradicardia fetal sostenida de 70 lpm. La paciente permanece hemodinámicamente estable, sin dolor uterino ni hipertonía. USG previo reportaba inserción velamentosa del cordón.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Placenta previa",
          "DPPNI",
          "Vasa previa",
          "Ruptura uterina"
        ],
        "answerIndex": 2,
        "explanation": "Sangrado tras ruptura de membranas + bradicardia fetal súbita + madre estable sugieren ruptura de vasos fetales.",
        "gpcReference": ""
      },
      {
        "question": "Conducta inmediata:",
        "options": [
          "Observación",
          "Cesárea urgente",
          "Oxitocina",
          "Tocolíticos"
        ],
        "answerIndex": 1,
        "explanation": "Es emergencia fetal; requiere resolución inmediata.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología hipertensiva del embarazo",
    "subtema": "Profilaxis con ácido acetilsalicílico",
    "difficulty": "Fácil",
    "case": "Paciente de 36 años, G2P1, 12 semanas de gestación. Antecedente de preeclampsia en embarazo previo con parto a las 35 semanas. IMC 30 kg/m². TA actual 110/70 mmHg.",
    "questions": [
      {
        "question": "¿Es candidata a profilaxis para preeclampsia?",
        "options": [
          "No, porque está normotensa",
          "Sí, por antecedente de alto riesgo",
          "Solo después de 20 semanas",
          "Solo si tiene proteinuria"
        ],
        "answerIndex": 1,
        "explanation": "Antecedente de preeclampsia es factor de alto riesgo; debe indicarse profilaxis.",
        "gpcReference": ""
      },
      {
        "question": "Fármaco recomendado:",
        "options": [
          "Heparina",
          "Ácido acetilsalicílico en dosis baja",
          "Metildopa",
          "Nifedipino"
        ],
        "answerIndex": 1,
        "explanation": "AAS en baja dosis reduce riesgo de recurrencia.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Índice de Bishop",
    "difficulty": "Media",
    "case": "Paciente de 29 años, 41 semanas, candidata a inducción por embarazo prolongado. Tacto vaginal: dilatación 1 cm, borramiento 40%, consistencia cervical firme, posición posterior, presentación cefálica en estación -2.",
    "questions": [
      {
        "question": "¿Qué evalúa el índice de Bishop?",
        "options": [
          "Bienestar fetal",
          "Madurez cervical para inducción",
          "Tamaño fetal",
          "Riesgo hemorrágico"
        ],
        "answerIndex": 1,
        "explanation": "El Bishop valora condiciones cervicales para éxito de inducción.",
        "gpcReference": ""
      },
      {
        "question": "Con estas características, el Bishop es probablemente:",
        "options": [
          "Favorable",
          "Desfavorable",
          "Óptimo",
          "Innecesario calcular"
        ],
        "answerIndex": 1,
        "explanation": "Cérvix poco dilatado, firme y posterior indica bajo puntaje.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Diabetes gestacional",
    "subtema": "Tratamiento inicial",
    "difficulty": "Media",
    "case": "Paciente de 30 años, 28 semanas, diagnosticada con diabetes gestacional mediante curva confirmatoria. Glucosas en ayuno repetidas entre 92–95 mg/dL y posprandiales ligeramente elevadas.",
    "questions": [
      {
        "question": "Primera medida terapéutica:",
        "options": [
          "Insulina inmediata",
          "Plan nutricional y ejercicio",
          "Metformina obligatoria",
          "Hospitalización"
        ],
        "answerIndex": 1,
        "explanation": "El manejo inicial es dieta y ejercicio, con monitoreo.",
        "gpcReference": ""
      },
      {
        "question": "Si no se alcanzan metas glucémicas con dieta:",
        "options": [
          "Suspender seguimiento",
          "Iniciar insulina",
          "Antibióticos",
          "Sulfonilureas como primera línea obligatoria"
        ],
        "answerIndex": 1,
        "explanation": "La insulina es tratamiento farmacológico de elección si falla manejo dietético.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Oncología ginecológica",
    "subtema": "Cáncer de mama  – factores de riesgo",
    "difficulty": "Fácil",
    "case": "Paciente de 48 años, nulípara, menarquia a los 11 años, sin embarazos. Madre con cáncer de mama diagnosticado a los 50 años. Consulta por mastografía de rutina.",
    "questions": [
      {
        "question": "Factor de riesgo presente en esta paciente:",
        "options": [
          "Multiparidad",
          "Nuliparidad",
          "Lactancia prolongada",
          "Menopausia temprana"
        ],
        "answerIndex": 1,
        "explanation": "Nuliparidad y menarquia temprana aumentan riesgo por mayor exposición estrogénica.",
        "gpcReference": ""
      },
      {
        "question": "Edad recomendada para mastografía de tamizaje en población general:",
        "options": [
          "Desde los 20 años",
          "Desde los 30 años",
          "Desde los 40 años",
          "Solo si hay síntomas"
        ],
        "answerIndex": 2,
        "explanation": "El tamizaje inicia a los 40 años en población general.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Puerperio",
    "subtema": "Trombosis venosa profunda",
    "difficulty": "Alta",
    "case": "Paciente de 35 años, 7 días postcesárea, obesidad IMC 34 kg/m², refiere dolor y aumento de volumen en pantorrilla izquierda. No fiebre. Exploración: edema unilateral, dolor a la palpación profunda, aumento de temperatura local.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Celulitis",
          "Trombosis venosa profunda",
          "Contractura muscular",
          "Linfedema crónico"
        ],
        "answerIndex": 1,
        "explanation": "Puerperio + cirugía + obesidad son factores de riesgo claros.",
        "gpcReference": ""
      },
      {
        "question": "Estudio diagnóstico inicial:",
        "options": [
          "Radiografía",
          "Ultrasonido Doppler venoso",
          "Resonancia",
          "D-dímero exclusivamente"
        ],
        "answerIndex": 1,
        "explanation": "El Doppler es estudio de elección.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento indicado:",
        "options": [
          "AINEs",
          "Anticoagulación con heparina de bajo peso molecular",
          "Antibióticos",
          "Reposo sin fármacos"
        ],
        "answerIndex": 1,
        "explanation": "HBPM es tratamiento estándar en embarazo y puerperio.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragia obstétrica",
    "subtema": "Coagulación intravascular diseminada (CID) secundaria a DPPNI",
    "difficulty": "Alta",
    "case": "Paciente de 32 años, 36 semanas, antecedente de hipertensión gestacional, acude por dolor abdominal súbito intenso y sangrado transvaginal oscuro moderado. Se documenta DPPNI clínico. Se realiza cesárea urgente por sufrimiento fetal. Durante el transoperatorio presenta sangrado difuso incoercible por sitios de incisión y punción venosa. TA 90/60 mmHg, FC 120 lpm. Laboratorios: plaquetas 45,000; TP y TTPa prolongados; fibrinógeno disminuido; dímero D elevado.",
    "questions": [
      {
        "question": "Complicación hematológica más probable:",
        "options": [
          "Púrpura trombocitopénica",
          "CID",
          "Hemofilia adquirida",
          "Trombocitopenia gestacional"
        ],
        "answerIndex": 1,
        "explanation": "El DPPNI es causa clásica de CID obstétrica.",
        "gpcReference": ""
      },
      {
        "question": "Manejo inicial prioritario:",
        "options": [
          "Solo oxitocina",
          "Reposición con hemoderivados según déficit",
          "Anticoagulación inmediata",
          "Alta"
        ],
        "answerIndex": 1,
        "explanation": "Se requiere reposición dirigida (plasma, plaquetas, crioprecipitado) además de control de la causa.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Embarazo múltiple",
    "subtema": "Síndrome de transfusión feto-fetal",
    "difficulty": "Alta",
    "case": "Paciente de 27 años, embarazo gemelar monocorial biamniótico de 24 semanas. USG reporta discrepancia significativa en líquido amniótico: un feto con oligohidramnios severo y otro con polihidramnios marcado. Diferencia de peso estimado >25%.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Restricción selectiva de crecimiento",
          "Síndrome de transfusión feto-fetal",
          "Diabetes gestacional",
          "Placenta previa"
        ],
        "answerIndex": 1,
        "explanation": "En embarazos monocoriales, discordancia de líquido es característica.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento de elección en casos severos:",
        "options": [
          "Reposo",
          "Fotocoagulación láser de anastomosis placentarias",
          "Cesárea inmediata",
          "Tocolíticos"
        ],
        "answerIndex": 1,
        "explanation": "La corrección láser de las anastomosis es tratamiento definitivo.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trastornos menstruales",
    "subtema": "Sangrado uterino anormal anovulatorio",
    "difficulty": "Media",
    "case": "Paciente de 17 años, menarquia a los 12, ciclos irregulares desde entonces. Presenta episodios de sangrado abundante prolongado, sin dolor pélvico. USG normal. Hb 10 g/dL.",
    "questions": [
      {
        "question": "Causa más probable en esta etapa de la vida:",
        "options": [
          "Mioma",
          "Anovulación por inmadurez eje HHO",
          "Cáncer endometrial",
          "Endometriosis"
        ],
        "answerIndex": 1,
        "explanation": "En adolescentes, la causa más frecuente es anovulación por inmadurez endocrina.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento médico inicial:",
        "options": [
          "Antibióticos",
          "Anticonceptivos hormonales combinados",
          "Cirugía",
          "Radioterapia"
        ],
        "answerIndex": 1,
        "explanation": "Los ACO regulan ciclo y controlan sangrado.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Climaterio",
    "subtema": "Osteoporosis postmenopáusica",
    "difficulty": "Media",
    "case": "Paciente de 58 años, 6 años postmenopausia, sin terapia hormonal, IMC 21 kg/m². Antecedente materno de fractura de cadera. Se realiza densitometría ósea con T-score de - 2.7 en cuello femoral.",
    "questions": [
      {
        "question": "Diagnóstico densitométrico:",
        "options": [
          "Osteopenia",
          "Osteoporosis",
          "Normal",
          "Osteomalacia"
        ],
        "answerIndex": 1,
        "explanation": "T-score ≤ -2.5 define osteoporosis.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento farmacológico de primera línea:",
        "options": [
          "Calcio exclusivamente",
          "Bifosfonatos",
          "Antibióticos",
          "Progesterona sola"
        ],
        "answerIndex": 1,
        "explanation": "Bifosfonatos reducen riesgo de fractura.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Infecciones ginecológicas",
    "subtema": "Tricomoniasis",
    "difficulty": "Fácil",
    "case": "Paciente de 24 años con flujo vaginal abundante amarillo-verdoso espumoso, prurito y dispareunia. pH vaginal 6.0. Cérvix con aspecto en “fresa”.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Candidiasis",
          "Vaginosis bacteriana",
          "Tricomoniasis",
          "EPI"
        ],
        "answerIndex": 2,
        "explanation": "Flujo espumoso + cérvix en fresa es clásico de Trichomonas.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento indicado:",
        "options": [
          "Fluconazol",
          "Metronidazol",
          "Ceftriaxona",
          "Doxiciclina"
        ],
        "answerIndex": 1,
        "explanation": "Metronidazol es tratamiento de elección y debe tratarse la pareja.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Oncología ginecológica",
    "subtema": "Hiperplasia endometrial sin atipia",
    "difficulty": "Media",
    "case": "Paciente de 45 años, obesa, con ciclos irregulares y sangrado uterino abundante. Biopsia endometrial reporta hiperplasia simple sin atipia.",
    "questions": [
      {
        "question": "Factor fisiopatológico principal:",
        "options": [
          "Déficit estrogénico",
          "Exposición estrogénica sin oposición",
          "Infección crónica",
          "Trauma uterino"
        ],
        "answerIndex": 1,
        "explanation": "Anovulación crónica produce estimulación estrogénica persistente.",
        "gpcReference": ""
      },
      {
        "question": "Tratamiento médico indicado:",
        "options": [
          "Estrógenos",
          "Progestágenos",
          "Radioterapia",
          "Histerectomía obligatoria"
        ],
        "answerIndex": 1,
        "explanation": "Los progestágenos revierten hiperplasia sin atipia.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Trabajo de parto",
    "subtema": "Desproporción cefalopélvica",
    "difficulty": "Alta",
    "case": "Paciente de 24 años, primigesta, 40 semanas, en trabajo de parto desde hace 10 horas. Membranas rotas hace 6 horas. Dinámica uterina adecuada (4–5 contracciones en 10 minutos, intensidad adecuada). Dilatación estacionada en 8 cm durante 4 horas. Presentación cefálica en estación -1. Pelvis clínica aparentemente límite. FCF 140 lpm, reactiva. No hay datos de sufrimiento fetal, pero no existe progresión del descenso a pesar de adecuada actividad uterina documentada.",
    "questions": [
      {
        "question": "Diagnóstico obstétrico más probable:",
        "options": [
          "Hipodinamia uterina",
          "Desproporción cefalopélvica",
          "Fase latente prolongada",
          "Prolapso de cordón"
        ],
        "answerIndex": 1,
        "explanation": "Ausencia de progresión con dinámica adecuada sugiere desproporción.",
        "gpcReference": ""
      },
      {
        "question": "Conducta más adecuada:",
        "options": [
          "Aumentar oxitocina indefinidamente",
          "Cesárea",
          "Tocolíticos",
          "Observación 12 horas más"
        ],
        "answerIndex": 1,
        "explanation": "Arresto de dilatación con dinámica adecuada indica resolución quirúrgica.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Hemorragias del primer trimestre",
    "subtema": "Aborto diferido (retenido)",
    "difficulty": "Media",
    "case": "Paciente de 29 años, 10 semanas por FUM, refiere desaparición de síntomas de embarazo y leve manchado marrón intermitente. Niega dolor. Exploración: cérvix cerrado. USG transvaginal muestra embrión sin actividad cardiaca acorde a 8 semanas. BHCG menor a la esperada para edad gestacional.",
    "questions": [
      {
        "question": "Diagnóstico:",
        "options": [
          "Amenaza de aborto",
          "Aborto incompleto",
          "Aborto diferido",
          "Embarazo ectópico"
        ],
        "answerIndex": 2,
        "explanation": "Muerte embrionaria sin expulsión del producto con cérvix cerrado corresponde a aborto diferido.",
        "gpcReference": ""
      },
      {
        "question": "Opciones de manejo válidas:",
        "options": [
          "Solo observación obligatoria",
          "Manejo médico o evacuación uterina según caso",
          "Antibióticos",
          "Histerectomía"
        ],
        "answerIndex": 1,
        "explanation": "Puede optarse por manejo expectante, médico o quirúrgico según condiciones clínicas.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Infecciones en el embarazo",
    "subtema": "Pielonefritis aguda gestacional",
    "difficulty": "Alta",
    "case": "Paciente de 26 años, 24 semanas, acude por fiebre de 39°C, dolor lumbar derecho intenso y náusea. Refiere disuria previa no tratada. Exploración: dolor a puño-percusión lumbar derecha. TA 100/65 mmHg, FC 110 lpm. EGO: bacteriuria, leucocituria. Leucocitosis en BH.",
    "questions": [
      {
        "question": "Diagnóstico más probable:",
        "options": [
          "Lumbalgia mecánica",
          "Pielonefritis aguda",
          "Cistitis simple",
          "Apendicitis"
        ],
        "answerIndex": 1,
        "explanation": "Fiebre alta + dolor lumbar + datos urinarios es diagnóstico clínico de pielonefritis.",
        "gpcReference": ""
      },
      {
        "question": "Manejo inicial:",
        "options": [
          "Tratamiento ambulatorio",
          "Hospitalización y antibiótico IV",
          "Solo analgésicos",
          "Alta"
        ],
        "answerIndex": 1,
        "explanation": "En embarazo requiere manejo intrahospitalario por riesgo de complicaciones.",
        "gpcReference": ""
      },
      {
        "question": "Complicación obstétrica asociada:",
        "options": [
          "Placenta previa",
          "Parto pretérmino",
          "Miomatosis",
          "Mola"
        ],
        "answerIndex": 1,
        "explanation": "Infección sistémica aumenta riesgo de parto pretérmino.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Anticoncepción",
    "subtema": "DIU hormonal (levonorgestrel)",
    "difficulty": "Media",
    "case": "Paciente de 34 años, G2P2, con sangrado menstrual abundante y deseo anticonceptivo a largo plazo. No factores de riesgo trombótico. Hb 11 g/dL.",
    "questions": [
      {
        "question": "Ventaja adicional del DIU hormonal frente al de cobre:",
        "options": [
          "Aumenta sangrado",
          "Disminuye sangrado menstrual",
          "Inhibe ovulación en todas",
          "Produce menopausia"
        ],
        "answerIndex": 1,
        "explanation": "El levonorgestrel produce atrofia endometrial y reduce sangrado.",
        "gpcReference": ""
      },
      {
        "question": "Duración aproximada de eficacia:",
        "options": [
          "6 meses",
          "1 año",
          "5 años aproximadamente",
          "10 años obligatorios"
        ],
        "answerIndex": 2,
        "explanation": "La mayoría de sistemas liberadores duran alrededor de 5 años.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Patología mamaria",
    "subtema": "Absceso mamario",
    "difficulty": "Media",
    "case": "Puérpera de 4 semanas con antecedente reciente de mastitis tratada parcialmente. Consulta por dolor intenso localizado en mama derecha, fiebre persistente y ahora presencia de zona fluctuante de 3 cm.",
    "questions": [
      {
        "question": "Diagnóstico:",
        "options": [
          "Mastitis simple",
          "Absceso mamario",
          "Galactocele",
          "Cáncer inflamatorio"
        ],
        "answerIndex": 1,
        "explanation": "La presencia de fluctuación indica colección purulenta.",
        "gpcReference": ""
      },
      {
        "question": "Manejo indicado:",
        "options": [
          "Solo antibióticos",
          "Drenaje + antibióticos",
          "Suspender lactancia obligatoriamente",
          "Observación"
        ],
        "answerIndex": 1,
        "explanation": "El absceso requiere drenaje además de antibiótico.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "gyo",
    "tema": "Oncología ginecológica",
    "subtema": "Cáncer de endometrio – síntoma de alarma",
    "difficulty": "Fácil",
    "case": "Paciente de 62 años, 12 años postmenopausia, consulta por sangrado vaginal escaso intermitente desde hace 2 semanas. IMC 32 kg/m². No terapia hormonal.",
    "questions": [
      {
        "question": "Síntoma de alarma principal:",
        "options": [
          "Dolor pélvico",
          "Sangrado postmenopáusico",
          "Leucorrea",
          "Disuria"
        ],
        "answerIndex": 1,
        "explanation": "Todo sangrado postmenopáusico debe estudiarse por posible cáncer endometrial.",
        "gpcReference": ""
      },
      {
        "question": "Estudio inicial recomendado:",
        "options": [
          "Colposcopía",
          "Ultrasonido transvaginal para medir grosor endometrial",
          "TAC",
          "CA-125"
        ],
        "answerIndex": 1,
        "explanation": "El USG transvaginal es primer paso para valorar endometrio.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología Biliar",
    "subtema": "Íleo biliar",
    "difficulty": "alta",
    "case": "Femenina de 78 años de edad, con antecedente de diabetes mellitus tipo 2 y colelitiasis diagnosticada hace 10 años que rechazó tratamiento quirúrgico. Es traída al servicio de urgencias por sus familiares refiriendo dolor abdominal tipo cólico, difuso, acompañado de distensión abdominal progresiva, náuseas y vómitos de características fecaloides de 3 días de evolución. Refiere no haber canalizado gases ni evacuado en las últimas 72 horas. A la exploración física: signos vitales estables, paciente deshidratada (mucosas secas). Abdomen globoso, timpánico a la percusión, con peristalsis metálica aumentada en frecuencia. Se solicita una radiografía simple de abdomen en bipedestación que muestra dilatación de asas de intestino delgado con niveles hidroaéreos, presencia de gas en el árbol biliar y una imagen radiopaca redondeada de 3 cm en la fosa ilíaca derecha.",
    "questions": [
      {
        "question": "Los tres hallazgos radiológicos descritos en este paciente son patognomónicos de esta complicación litiásica. ¿Qué nombre recibe esta tríada radiológica?",
        "options": [
          "Tríada de Charcot",
          "Tríada de Rigler",
          "Tríada de Beck",
          "Tríada de Mackler"
        ],
        "answerIndex": 1,
        "explanation": "La Tríada de Rigler es el sello radiológico del íleo biliar en una radiografía simple de abdomen. Consiste en: 1) Signos de obstrucción de intestino delgado (niveles hidroaéreos), 2) Neumobilia o aerobilia (gas en la vía biliar por la fístula colecistoentérica) y 3) Visualización de un cálculo biliar ectópico (radiolúcido o radiopaco) en el tracto intestinal.",
        "gpcReference": ""
      },
      {
        "question": "Desde el punto de vista anatómico y fisiopatológico, ¿cuál es el sitio más frecuente donde el cálculo biliar se impacta y causa la obstrucción mecánica del tubo digestivo?",
        "options": [
          "Válvula ileocecal (Íleon terminal)",
          "Segunda porción del duodeno",
          "Ángulo de Treitz",
          "Válvula de Houston (Recto)"
        ],
        "answerIndex": 0,
        "explanation": "El íleo biliar ocurre cuando un lito grande (generalmente >2.5 cm) erosiona la pared de la vesícula hacia el intestino (frecuentemente el duodeno) creando una fístula. El lito viaja por el intestino delgado hasta que se atora en el punto anatómico más estrecho, que es el íleon terminal (válvula ileocecal), en aproximadamente el 60-70% de los casos.",
        "gpcReference": ""
      },
      {
        "question": "Considerando la edad avanzada de la paciente y el riesgo quirúrgico, ¿cuál es el manejo quirúrgico de urgencia de primera elección recomendado para resolver el cuadro obstructivo?",
        "options": [
          "Colecistectomía laparoscópica y cierre de la fístula",
          "Enterolitotomía exclusiva (extracción del lito mediante enterotomía)",
          "Resección intestinal del íleon con anastomosis primaria",
          "Derivación biliodigestiva en Y de Roux"
        ],
        "answerIndex": 1,
        "explanation": "El objetivo principal en una paciente anciana con íleo biliar es resolver la obstrucción intestinal mecánica que amenaza la vida con la menor morbilidad posible. El procedimiento de elección es la enterolitotomía (abrir el intestino, extraer el lito y cerrar). La resolución de la fístula colecistoentérica y la colecistectomía en el mismo tiempo quirúrgico se asocian a una alta mortalidad, por lo que se reservan solo para pacientes jóvenes y muy estables, o se difieren para un segundo tiempo si la paciente presenta síntomas biliares posteriores.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Intoxicaciones",
    "subtema": "Toxíndromes (Anticolinérgico)",
    "difficulty": "baja",
    "case": "Masculino de 18 años es llevado a urgencias por sus amigos después de haber ingerido un té de flor de campana (Datura stramonium) con fines recreativos. A la exploración física, el paciente se encuentra con agitación psicomotriz, delirio y murmullos incomprensibles (\"loco como sombrerero\"). Su piel está intensamente eritematosa (\"rojo como betabel\") y completamente seca (\"seco como un hueso\"), con temperatura de 39°C. Se observa midriasis bilateral arreactiva (\"ciego como murciélago\") y presenta taquicardia de 140 lpm con globo vesical palpable por retención urinaria.",
    "questions": [
      {
        "question": "Ante este cuadro clásico de intoxicación anticolinérgica pura y severa con manifestaciones centrales (delirio) y periféricas, ¿cuál es el antídoto específico de elección, el cual debe ser administrado con precaución y monitorización cardiaca?",
        "options": [
          "Sulfato de Atropina",
          "Fisostigmina",
          "Pralidoxima",
          "Flumazenilo"
        ],
        "answerIndex": 1,
        "explanation": "La fisostigmina es un inhibidor reversible de la acetilcolinesterasa capaz de cruzar la barrera hematoencefálica. Al inhibir esta enzima, aumenta los niveles de acetilcolina en la hendidura sináptica, compitiendo y desplazando al agente anticolinérgico de los receptores muscarínicos, revirtiendo así tanto los síntomas centrales (delirio, coma) como los periféricos.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología arterial y venosa",
    "subtema": "Tromboembolia Pulmonar (TEP)",
    "difficulty": "alta",
    "case": "Femenina de 65 años, quien se encuentra en su cuarto día de postoperatorio de una artroplastia total de rodilla derecha. De forma súbita, mientras deambulaba al baño, presenta disnea severa, dolor torácico de características pleuríticas, diaforesis y sensación de muerte inminente. A la exploración física: TA 100/60 mmHg, FC 120 lpm, FR 28 rpm, SatO2 86% al aire ambiente. A la auscultación pulmonar no se integran síndromes pleuropulmonares y a la auscultación cardiaca se ausculta un reforzamiento del segundo ruido pulmonar (P2).",
    "questions": [
      {
        "question": "Se solicita un electrocardiograma (ECG) de 12 derivaciones en la sala de urgencias. Aunque se describe clásicamente el patrón S1Q3T3 (complejo de McGinn-White), este solo se presenta en el 20% de los casos. ¿Cuál es el hallazgo electrocardiográfico MÁS FRECUENTE en pacientes con Tromboembolia Pulmonar?",
        "options": [
          "Bloqueo completo de rama derecha",
          "Fibrilación auricular de nueva aparición",
          "Taquicardia sinusal",
          "Inversión de ondas T en derivaciones V1 a V4"
        ],
        "answerIndex": 2,
        "explanation": "La taquicardia sinusal es la alteración electrocardiográfica más frecuente en pacientes con TEP agudo, presentándose en más del 70% de los casos como una respuesta compensatoria a la hipoxemia y la disfunción del ventrículo derecho. El patrón S1Q3T3 (ondas S profundas en DI, ondas Q patológicas en DIII y ondas T invertidas en DIII) es un signo clásico de cor pulmonale agudo, pero es poco sensible.",
        "gpcReference": ""
      },
      {
        "question": "Al encontrarse la paciente hemodinámicamente estable (presión sistólica > 90 mmHg), con una probabilidad clínica alta de TEP (Escala de Wells > 6), ¿cuál es el estudio de imagen de elección y estándar de oro para confirmar el diagnóstico anatómico?",
        "options": [
          "Gammagrafía V/Q (Ventilación/Perfusión)",
          "Angiotomografía Computarizada (AngioTAC) pulmonar multicorte",
          "Ecocardiograma transtorácico",
          "Dímero D cuantitativo"
        ],
        "answerIndex": 1,
        "explanation": "La AngioTAC de arterias pulmonares es el estándar de oro actual y el estudio de imagen de primera línea para confirmar la Tromboembolia Pulmonar en pacientes hemodinámicamente estables, permitiendo visualizar los defectos de llenado (trombos) en las arterias pulmonares principales y segmentarias. El Dímero D no tiene utilidad cuando la probabilidad pretest ya es alta, pues solo sirve para descartar (alto valor predictivo negativo) en pacientes con baja probabilidad.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "ETS",
    "subtema": "Chancroide",
    "difficulty": "media",
    "case": "Masculino de 28 años, sexualmente activo con múltiples parejas, acude a consulta externa quejándose de la aparición de úlceras dolorosas en el pene de 5 días de evolución. A la exploración física, se observan tres úlceras en el prepucio y surco balanoprepucial; las lesiones miden entre 1 y 2 cm, tienen bordes irregulares, base eritematosa y están recubiertas por un exudado purulento, grisáceo y maloliente. Son exquisitamente dolorosas a la manipulación. Además, se palpa una gran adenopatía inguinal unilateral derecha, dolorosa y fluctuante (bubón inguinal).",
    "questions": [
      {
        "question": "Con base en las características morfológicas y el dolor característico de las úlceras, ¿cuál es el agente bacteriano causante de esta enfermedad de transmisión sexual?",
        "options": [
          "Treponema pallidum",
          "Chlamydia trachomatis (serotipos L1-L3)",
          "Haemophilus ducreyi",
          "Virus del Herpes Simple tipo 2 (VHS-2)"
        ],
        "answerIndex": 2,
        "explanation": "El chancroide (chancro blando) es causado por el bacilo gramnegativo Haemophilus ducreyi. Su presentación clínica distintiva son las úlceras genitales múltiples, profundas, sucias (purulentas) y muy dolorosas, acompañadas clásicamente de linfadenopatía inguinal dolorosa que puede supurar (bubón). En contraste, el chancro sifilítico (sífilis primaria) es una úlcera única, de bordes limpios, indurada y completamente indolora.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Introducción Oftalmología",
    "subtema": "Celulitis Periorbitaria vs Orbitaria",
    "difficulty": "media",
    "case": "Escolar masculino de 8 años de edad, con antecedente de una sinusitis etmoidal bacteriana mal tratada hace 10 días. Es llevado a urgencias oftalmológicas por presentar fiebre alta de 39°C, edema palpebral severo, eritema y calor en el ojo derecho. A la exploración física, el paciente presenta el ojo derecho desplazado hacia adelante (proptosis/exoftalmos), inyección conjuntival marcada (quemosis) e incapacidad para mover el ojo derecho en ninguna dirección (oftalmoplejía total). Refiere dolor intenso al intentar movilizar el ojo y la agudeza visual de ese lado ha disminuido a 20/200.",
    "questions": [
      {
        "question": "De acuerdo con los hallazgos exploratorios, ¿cuál es la complicación orbitaria infecciosa que presenta el paciente y que requiere tratamiento intravenoso urgente?",
        "options": [
          "Celulitis periorbitaria (preseptal)",
          "Dacriocistitis aguda",
          "Celulitis orbitaria (postseptal)",
          "Endoftalmitis endógena"
        ],
        "answerIndex": 2,
        "explanation": "La celulitis orbitaria es una infección profunda que afecta los tejidos situados por detrás del septum orbitario. Los signos clínicos cardinales que la distinguen de una simple celulitis periorbitaria (que solo afecta los párpados) son la presencia de proptosis (exoftalmos), oftalmoplejía (restricción dolorosa de los movimientos oculares por inflamación de los músculos extraoculares) y disminución de la agudeza visual por compromiso del nervio óptico. Es una emergencia médica.",
        "gpcReference": ""
      },
      {
        "question": "Dada la anatomía de los senos paranasales, ¿cuál es la estructura sinusal cuya inflamación e infección se extiende con mayor frecuencia (por contigüidad a través de la lámina papirácea) para causar una celulitis orbitaria, especialmente en niños?",
        "options": [
          "Seno maxilar",
          "Celdillas etmoidales",
          "Seno frontal",
          "Seno esfenoidal"
        ],
        "answerIndex": 1,
        "explanation": "Las celdillas etmoidales (seno etmoidal) están separadas de la cavidad orbitaria únicamente por una capa ósea extremadamente delgada conocida como \"lámina papirácea\", la cual presenta múltiples dehiscencias naturales. Por ello, la rinosinusitis etmoidal es la causa más común (hasta en el 90% de los casos) de extensión de la infección hacia la órbita en la población pediátrica.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "ATLS P1",
    "subtema": "Trauma Torácico (Hemotórax masivo)",
    "difficulty": "alta",
    "case": "Masculino de 35 años es traído a la sala de choque tras sufrir una herida por proyectil de arma de fuego en el hemitórax derecho, a nivel del quinto espacio intercostal línea axilar media. A su ingreso, el paciente presenta datos francos de choque hipovolémico: palidez extrema, diaforesis, TA 70/40 mmHg, FC 140 lpm y FR 30 rpm. A la exploración del tórax, la tráquea está central, no hay ingurgitación yugular. A la auscultación, los ruidos respiratorios están completamente abolidos en el hemitórax derecho, y a la percusión se encuentra matidez franca en ese mismo lado.",
    "questions": [
      {
        "question": "Por los datos clínicos (choque + abolición de ruidos + matidez), se diagnostica un hemotórax masivo derecho. Se procede a colocar una sonda endopleural (tubo de tórax) en el quinto espacio intercostal línea axilar media. ¿Cuál es el criterio de volumen de drenaje sanguíneo inmediato al colocar la sonda que indica la necesidad de una toracotomía de urgencia en quirófano?",
        "options": [
          "Salida inicial de 500 cc de sangre",
          "Salida inicial de 800 cc de sangre",
          "Salida inicial mayor a 1,500 cc de sangre",
          "Cualquier cantidad de sangre es indicación de cirugía inmediata"
        ],
        "answerIndex": 2,
        "explanation": "El ATLS establece que las indicaciones para una toracotomía de urgencia en un hemotórax masivo son: la salida inicial de >1,500 ml de sangre inmediatamente después de la colocación de la sonda endopleural, o un drenaje continuo de >200 ml/hora durante 2 a 4 horas consecutivas, sumado a inestabilidad hemodinámica persistente.",
        "gpcReference": ""
      },
      {
        "question": "Desde el punto de vista semiológico, ¿cuál es el signo clínico clave a la exploración física que permitió diferenciar este cuadro de un neumotórax a tensión en la sala de choque antes de colocar la sonda?",
        "options": [
          "La ausencia de ruidos respiratorios",
          "La hipotensión severa",
          "La matidez a la percusión",
          "La taquipnea"
        ],
        "answerIndex": 2,
        "explanation": "Tanto el neumotórax a tensión como el hemotórax masivo causan choque (uno obstructivo y el otro hipovolémico) y abolición de ruidos respiratorios en el lado afectado. La clave clínica diferencial en la percusión torácica es que el hemotórax produce matidez (por la presencia de líquido/sangre), mientras que el neumotórax a tensión produce hiperresonancia o timpanismo (por la acumulación de aire a presión).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología Infecciosa / Rinología y faringe",
    "subtema": "Papilomatosis laríngea (Papilomatosis respiratoria recurrente)",
    "difficulty": "baja",
    "case": "Preescolar masculino de 3 años es llevado a la consulta de otorrinolaringología por su madre, quien refiere que el niño ha presentado cambios en su voz (disfonía) de varios meses de evolución, la cual ha progresado a un llanto débil. En las últimas semanas, la madre nota un ruido agudo al tomar aire (estridor inspiratorio) cuando el niño llora o hace esfuerzo. No ha presentado fiebre ni cuadros de infección aguda. Se le realiza una nasofibrolaringoscopia flexible encontrando múltiples lesiones exofíticas, rosadas, con aspecto de \"frambuesa\" o \"coliflor\", localizadas en ambas cuerdas vocales y la banda ventricular.",
    "questions": [
      {
        "question": "De acuerdo con la epidemiología y las características de las lesiones, ¿cuáles son los serotipos virales directamente responsables de causar esta patología (la neoplasia benigna más común de la laringe en niños)?",
        "options": [
          "Virus del Papiloma Humano (VPH) 16 y 18",
          "Virus de Epstein-Barr (VEB)",
          "Virus del Papiloma Humano (VPH) 6 y 11",
          "Virus Sincitial Respiratorio (VSR)"
        ],
        "answerIndex": 2,
        "explanation": "La papilomatosis respiratoria recurrente infantil es causada por el contagio en el canal de parto con los serotipos de bajo riesgo del Virus del Papiloma Humano (VPH), predominantemente los serotipos 6 y 11. Causa lesiones exofíticas verrugosas (\"en coliflor\") que pueden obstruir la vía aérea. Los serotipos 16 y 18 son de alto riesgo oncogénico (Cáncer cervicouterino y orofaríngeo). Shutterstock",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Cirugía Oncología",
    "subtema": "Cáncer de Recto",
    "difficulty": "alta",
    "case": "Femenina de 62 años acude a consulta por referir sangrado rectal fresco (hematoquecia) mezclado con las heces, pujo y sensación de evacuación incompleta (tenesmo rectal) de 4 meses de evolución. A la exploración física, el tacto rectal evidencia una masa indurada, friable, que ocupa la mitad de la circunferencia luminal, localizada en el recto inferior, a solo 3 centímetros del margen anal. Se realiza colonoscopia con biopsia que confirma un adenocarcinoma de recto moderadamente diferenciado.",
    "questions": [
      {
        "question": "Para realizar una estadificación locorregional precisa (evaluar la profundidad de invasión T y el estado ganglionar N), ¿cuál es el estudio de imagen pélvico de elección que debe solicitarse obligatoriamente antes de definir el tratamiento?",
        "options": [
          "Tomografía por Emisión de Positrones (PET-CT)",
          "Ultrasonido pélvico transabdominal",
          "Resonancia Magnética (RM) pélvica de alta resolución",
          "Radiografía simple de pelvis"
        ],
        "answerIndex": 2,
        "explanation": "La Resonancia Magnética de pelvis de alta resolución es el estándar de oro absoluto para la estadificación locorregional del cáncer de recto. Permite evaluar con gran precisión la invasión del tumor a través de las capas del recto (muscularis propia, grasa mesorrectal), la afectación de los ganglios linfáticos perirrectales y la distancia del tumor a la fascia mesorrectal (margen circunferencial).",
        "gpcReference": ""
      },
      {
        "question": "La Resonancia Magnética reporta un tumor estadío cT3 N1 (invasión a la grasa perirrectal y 2 ganglios sospechosos). De acuerdo con la GPC para el cáncer de recto en estas etapas (localmente avanzado), ¿cuál es el abordaje terapéutico inicial recomendado previo a la cirugía?",
        "options": [
          "Resección quirúrgica inmediata",
          "Quimioterapia paliativa exclusiva",
          "Quimiorradioterapia neoadyuvante (preoperatoria)",
          "Radioterapia adyuvante (postoperatoria) exclusiva"
        ],
        "answerIndex": 2,
        "explanation": "A diferencia del cáncer de colon, los tumores de recto localmente avanzados (estadio II y III, es decir T3, T4 o N positivo) tienen una indicación formal para recibir quimiorradioterapia neoadyuvante antes de la cirugía. Esto tiene el objetivo de disminuir el tamaño tumoral (downstaging), aumentar las tasas de preservación de los esfínteres y disminuir drásticamente el riesgo de recurrencia local.",
        "gpcReference": ""
      },
      {
        "question": "Finalizado el tratamiento neoadyuvante, la paciente es programada para cirugía definitiva. Debido a que el tumor se localiza en el tercio inferior del recto (a 3 cm del margen anal) e invade el complejo de los esfínteres, ¿cuál es el procedimiento quirúrgico de elección indicado?",
        "options": [
          "Resección anterior baja de recto con anastomosis coloanal",
          "Resección abdominoperineal (Operación de Miles) con colostomía definitiva",
          "Colectomía subtotal con ileorrectoanastomosis",
          "Resección transanal endoscópica (TEM)"
        ],
        "answerIndex": 1,
        "explanation": "Cuando un cáncer de recto inferior está a menos de 5 cm del margen anal y compromete el complejo esfinteriano (imposibilitando dejar un margen distal libre de enfermedad sin destruir el esfínter), el procedimiento estándar es la Resección Abdominoperineal (Procedimiento de Miles). Esto implica extirpar el recto, el canal anal y el aparato esfinteriano, dejando a la paciente con una colostomía terminal definitiva en el abdomen.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología cámara posterior",
    "subtema": "Uveítis Anterior",
    "difficulty": "media",
    "case": "Masculino de 30 años, con antecedente de dolor lumbar crónico inflamatorio (diagnosticado con espondilitis anquilosante). Acude a urgencias oftalmológicas por presentar inicio agudo de enrojecimiento intenso, dolor ocular severo y fotofobia extrema en el ojo izquierdo, acompañado de lagrimeo y visión borrosa. A la exploración con la lámpara de hendidura, se observa inyección periquerática (anillo rojo alrededor de la córnea). La pupila izquierda se encuentra contraída (miosis) en comparación con la derecha. Al observar la cámara anterior, se aprecia el fenómeno de Tyndall positivo (células inflamatorias flotando en el humor acuoso) y depósitos blanquecinos en el endotelio corneal (precipitados queráticos).",
    "questions": [
      {
        "question": "Por las características clínicas y los hallazgos patognomónicos en la lámpara de hendidura, ¿cuál es el diagnóstico correcto?",
        "options": [
          "Glaucoma agudo de ángulo cerrado",
          "Queratitis bacteriana",
          "Uveítis anterior aguda (Iridociclitis)",
          "Conjuntivitis viral"
        ],
        "answerIndex": 2,
        "explanation": "La uveítis anterior aguda se caracteriza por dolor profundo, fotofobia severa, ojo rojo (inyección ciliar) y miosis (por espasmo del esfínter del iris). El hallazgo patognomónico es la presencia de proteínas (flare) y células en la cámara anterior (efecto Tyndall), junto con los precipitados queráticos. Tiene una fortísima asociación sistémica con enfermedades autoinmunes portadoras del HLA-B27, como la espondilitis anquilosante.",
        "gpcReference": ""
      },
      {
        "question": "Para evitar la formación de sinequias posteriores (adherencias del iris inflamado al cristalino) y aliviar el dolor causado por el espasmo ciliar, ¿qué familia de fármacos tópicos debe instilarse obligatoriamente en conjunto con los corticosteroides tópicos?",
        "options": [
          "Agonistas alfa-2 adrenérgicos (Brimonidina)",
          "Midriáticos / Ciclopléjicos (Ciclopentolato o Atropina)",
          "Análogos de prostaglandinas (Latanoprost)",
          "Beta bloqueadores (Timolol)"
        ],
        "answerIndex": 1,
        "explanation": "El tratamiento de la uveítis anterior aguda consiste en corticosteroides tópicos (para apagar la inflamación) y gotas midriáticas-ciclopléjicas. El ciclopléjico paraliza el músculo ciliar (aliviando drásticamente el dolor) y dilata la pupila (midriasis), lo que aleja el borde del iris del cristalino, previniendo la formación de sinequias posteriores que podrían llevar a complicaciones graves como glaucoma secundario.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Mordeduras y picaduras",
    "subtema": "Mordedura de Serpiente (Viperidae)",
    "difficulty": "alta",
    "case": "Masculino de 45 años, de ocupación agricultor, es traído al hospital rural tras haber sido mordido en la pantorrilla derecha hace 2 horas por una serpiente identificada como \"nauyaca\". A su ingreso, el paciente se queja de dolor insoportable en la extremidad. A la exploración física, se aprecian dos marcas de colmillos en la cara lateral de la pierna, con sangrado activo. Presenta un edema severo que ya abarca hasta el tercio medio del muslo derecho, acompañado de equimosis y múltiples flictenas de contenido hemorrágico. Los signos vitales muestran TA 90/50 mmHg, FC 115 lpm. Exámenes de laboratorio urgentes reportan plaquetas en 45,000/mm³, Tiempos de Protrombina (TP) y Tromboplastina (TTPa) prolongados al infinito (incoagulables), y fibrinógeno severamente disminuido.",
    "questions": [
      {
        "question": "De acuerdo con la sintomatología local devastadora y las alteraciones sistémicas de la coagulación, ¿a qué familia biológica pertenece la serpiente causal de este toxíndrome (Crotoxina / Veneno Hemotóxico)?",
        "options": [
          "Elapidae (Serpiente de coral)",
          "Viperidae (Crotálidos)",
          "Colubridae",
          "Hydrophiinae"
        ],
        "answerIndex": 1,
        "explanation": "Las serpientes de la familia Viperidae (crotálidos), que incluyen a la cascabel y a la nauyaca (Bothrops), producen un veneno predominantemente citotóxico y hemotóxico. Provocan necrosis tisular local severa, edema masivo y un síndrome de coagulación intravascular diseminada (CID) por consumo de factores. Las Elapidae (coralillos) producen un veneno neurotóxico que causa parálisis flácida respiratoria, sin inflamación o daño local importante.",
        "gpcReference": ""
      },
      {
        "question": "Según la clasificación de Christopher-Rodning para el envenenamiento por mordedura de crotálido, la presencia de edema severo que rebasa la extremidad y la coagulopatía grave (incoagulabilidad), ¿en qué grado de envenenamiento sitúan a este paciente?",
        "options": [
          "Grado I (Leve)",
          "Grado II (Moderado)",
          "Grado III (Grave)",
          "Grado IV (Muy grave / Choque irreversible)"
        ],
        "answerIndex": 2,
        "explanation": "La clasificación de Christopher-Rodning Grado III se define por la presencia de dolor intenso, edema que afecta toda la extremidad e involucra el tronco, síntomas sistémicos graves (hipotensión) y alteraciones marcadas en los estudios de laboratorio (coagulopatía de consumo, CID, plaquetopenia).",
        "gpcReference": ""
      },
      {
        "question": "Ante este nivel de envenenamiento, ¿cuál es el tratamiento biológico específico y la posología inicial recomendada por la Norma Oficial Mexicana y la GPC?",
        "options": [
          "Observación y profilaxis tetánica exclusiva",
          "Administración intravenosa de 1 a 2 frascos de faboterápico polivalente antiviperino",
          "Administración intravenosa de 6 a 8 frascos (o más) de faboterápico polivalente antiviperino",
          "Aplicación de torniquete arterial y succión mecánica del veneno"
        ],
        "answerIndex": 2,
        "explanation": "Para un envenenamiento Grado III por viperidos, la GPC recomienda el uso inmediato de múltiples frascos (usualmente de 6 a 8 como dosis inicial, pudiendo ser mucho más alta dependiendo de la respuesta) del antiveneno (faboterápico polivalente antiviperino). El uso de torniquetes, incisiones, succión o hielo están absolutamente contraindicados porque empeoran la isquemia tisular y aumentan el riesgo de amputación.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología Gástrica",
    "subtema": "Dispepsia Funcional",
    "difficulty": "baja",
    "case": "Femenina de 28 años, sin antecedentes de importancia, acude por referir dolor y ardor en epigastrio, así como saciedad temprana y plenitud posprandial, de 4 meses de evolución, presentándose al menos 3 días a la semana. Niega pérdida de peso, vómitos, disfagia o sangrado gastrointestinal. Cuenta con una endoscopia superior reciente que se reporta completamente normal, sin evidencia de úlceras o lesiones estructurales, y prueba de H. pylori negativa.",
    "questions": [
      {
        "question": "Con base en los Criterios de Roma IV, al no existir evidencia de enfermedad estructural que explique los síntomas, ¿cuál es el diagnóstico definitivo de la paciente?",
        "options": [
          "Úlcera péptica no complicada",
          "Síndrome de Zollinger-Ellison",
          "Dispepsia funcional",
          "Gastritis crónica atrófica"
        ],
        "answerIndex": 2,
        "explanation": "La dispepsia funcional se diagnostica con base en los Criterios de Roma IV (presencia de plenitud posprandial, saciedad temprana, dolor o ardor epigástrico) cuando se ha realizado una endoscopia y se ha descartado categóricamente cualquier causa orgánica, estructural o metabólica (como infección por H. pylori o úlceras) que explique la sintomatología. Getty Images",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología Diverticular",
    "subtema": "Diverticulosis",
    "difficulty": "baja",
    "case": "Masculino de 65 años, asintomático, acude a su chequeo médico de rutina. Refiere una dieta baja en fibra y antecedente de estreñimiento crónico. Como parte del escrutinio para cáncer de colon por su edad, se le realiza una colonoscopia de tamizaje. Durante el estudio, no se observan pólipos ni masas sospechosas, pero se reporta la presencia de múltiples invaginaciones saculares de la mucosa y submucosa a través de las capas musculares de la pared del colon, localizadas predominantemente en el colon sigmoides. La mucosa alrededor de estas saculaciones es de aspecto completamente normal, sin eritema ni sangrado activo.",
    "questions": [
      {
        "question": "De acuerdo con la descripción endoscópica de los hallazgos en un paciente asintomático, ¿cuál es el diagnóstico correcto?",
        "options": [
          "Diverticulitis aguda no complicada",
          "Enfermedad de Crohn colónica",
          "Diverticulosis colónica",
          "Pólipos adenomatosos sésiles"
        ],
        "answerIndex": 2,
        "explanation": "La presencia anatómica de divertículos (saculaciones formadas por la herniación de la mucosa y submucosa) en el colon de un paciente sin ningún síntoma inflamatorio o de sangrado se define estrictamente como diverticulosis.",
        "gpcReference": ""
      },
      {
        "question": "Al tratarse de un hallazgo incidental sin inflamación ni complicación, ¿cuál es la recomendación terapéutica principal de acuerdo con la GPC?",
        "options": [
          "Resección del colon sigmoides de manera electiva",
          "Antibioticoterapia con Ciprofloxacino y Metronidazol por 7 días",
          "Dieta rica en fibra y aumento en la ingesta de líquidos",
          "Mesalazina vía oral de por vida"
        ],
        "answerIndex": 2,
        "explanation": "La diverticulosis asintomática no requiere tratamiento médico farmacológico ni quirúrgico invasivo. La GPC recomienda únicamente medidas higiénico-dietéticas, principalmente el aumento en el consumo de fibra dietética y agua para disminuir la presión intraluminal colónica y prevenir la progresión a enfermedad sintomática o diverticulitis.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Patología Hepática",
    "subtema": "Enfermedad Hepática Grasa",
    "difficulty": "media",
    "case": "Femenina de 48 años, con antecedente de obesidad grado II (IMC 36), diabetes mellitus tipo 2 y dislipidemia mixta. Acude a consulta por fatiga leve. En sus exámenes de laboratorio de rutina se detecta una elevación leve de transaminasas (ALT 65 U/L, AST 45 U/L), con fosfatasa alcalina y bilirrubinas normales. Niega consumo de alcohol y su panel viral para hepatitis B y C resulta negativo. Se le solicita un ultrasonido abdominal que reporta hígado aumentado de tamaño con un incremento difuso de la ecogenicidad (\"hígado brillante\"), atenuación del sonido posterior y pérdida de la definición de los vasos portales.",
    "questions": [
      {
        "question": "De acuerdo con los hallazgos clínicos y ecográficos, en ausencia de consumo de alcohol, ¿cuál es el diagnóstico más probable?",
        "options": [
          "Cirrosis hepática biliar primaria",
          "Enfermedad hepática grasa no alcohólica (EHGNA)",
          "Hepatitis autoinmune tipo 1",
          "Hemocromatosis hereditaria"
        ],
        "answerIndex": 1,
        "explanation": "La Enfermedad Hepática Grasa no Alcohólica (asociada a disfunción metabólica) está estrechamente ligada al síndrome metabólico (obesidad, diabetes, dislipidemia). El hallazgo ecográfico clásico es un hígado hiperecogénico (\"brillante\") provocado por la infiltración macrovesicular de triglicéridos.",
        "gpcReference": ""
      },
      {
        "question": "Para estadificar el grado de fibrosis hepática de forma no invasiva antes de considerar una biopsia, ¿cuál es el estudio de imagen basado en la elasticidad del tejido que recomienda la GPC?",
        "options": [
          "Elastografía de transición (FibroScan)",
          "Tomografía computarizada simple",
          "Gammagrafía hepatoesplénica",
          "ColangioRM"
        ],
        "answerIndex": 0,
        "explanation": "La Elastografía de transición es la herramienta no invasiva de primera línea recomendada para medir la rigidez hepática y estimar de manera muy confiable el grado de fibrosis en pacientes con EHGNA o hepatitis crónicas, evitando así biopsias innecesarias.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "ETS",
    "subtema": "Linfogranuloma Venéreo",
    "difficulty": "alta",
    "case": "Masculino de 30 años de edad acude a consulta de infectología refiriendo la aparición de un aumento de volumen muy doloroso en la ingle derecha de 2 semanas de evolución. Al interrogatorio dirigido, menciona que hace aproximadamente 3 semanas notó una pequeña úlcera genital indolora que desapareció sola en un par de días, a la cual no le dio importancia. A la exploración física, presenta una gran linfadenopatía inguinal y femoral derecha, la cual está separada por el ligamento inguinal creando el clásico \"signo del surco\". Los ganglios están eritematosos, fijos, muy sensibles y algunos presentan áreas de fluctuación (bubones).",
    "questions": [
      {
        "question": "De acuerdo con la clínica y el característico \"signo del surco\", ¿cuál es el diagnóstico infeccioso de sospecha?",
        "options": [
          "Sífilis primaria",
          "Chancroide",
          "Linfogranuloma venéreo (LGV)",
          "Granuloma inguinal (Donovanosis)"
        ],
        "answerIndex": 2,
        "explanation": "El Linfogranuloma venéreo comienza típicamente con una pápula o úlcera genital pequeña, transitoria e indolora (fase primaria), seguida semanas después por un síndrome inguinal invasivo (fase secundaria) caracterizado por adenopatías dolorosas supurativas. El \"signo del surco\" (adenopatías por arriba y por debajo del ligamento inguinal) es patognomónico del LGV.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el microorganismo etiológico responsable de esta enfermedad de transmisión sexual?",
        "options": [
          "Chlamydia trachomatis (serotipos L1, L2, L3)",
          "Klebsiella granulomatis",
          "Haemophilus ducreyi",
          "Treponema pallidum"
        ],
        "answerIndex": 0,
        "explanation": "El LGV es causado exclusivamente por los serotipos invasivos L1, L2 y L3 de Chlamydia trachomatis, los cuales tienen un especial tropismo por el tejido linfático.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el tratamiento antibiótico de elección y la duración recomendada por las guías clínicas para resolver esta patología?",
        "options": [
          "Penicilina G benzatínica dosis única",
          "Ceftriaxona 500 mg IM dosis única",
          "Doxiciclina 100 mg VO cada 12 horas por 21 días",
          "Azitromicina 1 g VO dosis única"
        ],
        "answerIndex": 2,
        "explanation": "El tratamiento de elección para el Linfogranuloma venéreo es la Doxiciclina. A diferencia del tratamiento para una uretritis simple por Chlamydia (que dura 7 días), el LGV requiere un tratamiento prolongado de 21 días para erradicar la infección profunda en los ganglios linfáticos y prevenir secuelas fibróticas graves.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "Introducción Oftalmología",
    "subtema": "Blefaritis",
    "difficulty": "baja",
    "case": "Masculino de 65 años de edad acude a consulta oftalmológica por referir ardor crónico, sensación de arenilla y prurito en ambos ojos de meses de evolución, que empeora por las mañanas. A la exploración en la lámpara de hendidura, los ojos presentan hiperemia conjuntival leve. Llama la atención que los bordes libres de ambos párpados se encuentran eritematosos y engrosados, observándose múltiples escamas amarillentas en la base de las pestañas (costras similares a la caspa). No hay nódulos ni tumefacciones agudas localizadas.",
    "questions": [
      {
        "question": "De acuerdo con la clínica, ¿cuál es el tratamiento higiénico inicial de primera línea indispensable para el control de esta enfermedad ocular crónica?",
        "options": [
          "Inyección intralesional de triamcinolona",
          "Aseo diario del borde palpebral con champú de bebé o espumas limpiadoras específicas y compresas tibias",
          "Antibióticos tópicos de amplio espectro de por vida",
          "Depilación quirúrgica de las pestañas"
        ],
        "answerIndex": 1,
        "explanation": "La blefaritis es una inflamación crónica del margen palpebral (anterior o posterior). La piedra angular del tratamiento, independientemente de la causa (estafilocócica o seborreica), es la higiene palpebral estricta y diaria: aplicación de compresas tibias para fluidificar las secreciones y lavado mecánico suave de la base de las pestañas con soluciones diluidas (como champú de bebé) para remover las costras y escamas adheridas.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA GÁSTRICA",
    "subtema": "GASTRITIS AGUDA O CRONICA",
    "difficulty": "baja",
    "case": "Femenina de 60 años, con antecedente de osteoartritis severa en tratamiento crónico con diclofenaco e ibuprofeno a dosis altas desde hace 1 año. Acude a la consulta externa por presentar dolor en epigastrio de tipo ardoroso, náuseas ocasionales y saciedad temprana. Se le realiza una endoscopia superior que reporta eritema difuso y múltiples erosiones superficiales en la mucosa del antro y cuerpo gástrico, sin úlceras activas.",
    "questions": [
      {
        "question": "Desde el punto de vista fisiopatológico, ¿cuál es el mecanismo principal por el cual el consumo crónico de estos fármacos (AINEs) produce el daño a la mucosa gástrica evidenciado en la paciente?",
        "options": [
          "Estimulación directa de las células parietales para secretar ácido clorhídrico",
          "Inhibición de la enzima ciclooxigenasa-1 (COX-1), lo que disminuye la síntesis de prostaglandinas protectoras",
          "Inhibición de la bomba de protones a nivel apical",
          "Infección secundaria por Helicobacter pylori"
        ],
        "answerIndex": 1,
        "explanation": "Los AINEs no selectivos inhiben tanto la COX-2 (disminuyendo la inflamación y el dolor) como la COX-1. La COX-1 es una enzima constitutiva en la mucosa gástrica responsable de sintetizar prostaglandinas (PGE2 y PGI2), las cuales son vitales para mantener la barrera protectora gástrica al estimular la secreción de moco y bicarbonato, y mantener un adecuado flujo sanguíneo mucoso. Su inhibición deja a la mucosa vulnerable al daño por el ácido gástrico.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA HEPÁTICA",
    "subtema": "HEPATITIS AGUDAS Y CRÓNICAS",
    "difficulty": "media",
    "case": "Masculino de 28 años, usuario de drogas intravenosas, acude a urgencias por presentar un cuadro de 1 semana de evolución caracterizado por astenia profunda, adinamia, mialgias, náuseas, dolor sordo en el hipocondrio derecho y coluria. A la exploración física destaca ictericia franca en escleras y piel, con hepatomegalia dolorosa a la palpación. Sus laboratorios revelan AST de 1,200 U/L y ALT de 1,500 U/L, con bilirrubina total de 8.0 mg/dL a expensas de la directa. Se solicita un panel serológico viral que reporta: HBsAg (+), Anti-HBc IgM (+), Anti-HBs (-).",
    "questions": [
      {
        "question": "De acuerdo con el panel serológico presentado, ¿cuál es el diagnóstico preciso del paciente?",
        "options": [
          "Infección crónica por Virus de la Hepatitis B",
          "Infección aguda por Virus de la Hepatitis B",
          "Paciente vacunado e inmunizado contra Hepatitis B",
          "Hepatitis B resuelta con inmunidad natural"
        ],
        "answerIndex": 1,
        "explanation": "La presencia del Antígeno de superficie (HBsAg) indica infección activa. El marcador clave para diferenciar una infección aguda de una crónica es el Anticuerpo contra el antígeno del core (Anti-HBc). Si es de tipo IgM, indica una infección aguda reciente (como en este caso). Si fuera IgG con HBsAg (+), indicaría infección crónica por más de 6 meses.",
        "gpcReference": ""
      },
      {
        "question": "Durante esta fase aguda, ¿cuál es el marcador serológico específico que el médico debe solicitar para determinar si el paciente se encuentra en un estado de alta replicación viral y alta infectividad?",
        "options": [
          "Anti-HBe",
          "Antígeno e de la hepatitis B (HBeAg)",
          "Anti-HCV",
          "DNA polimerasa"
        ],
        "answerIndex": 1,
        "explanation": "El Antígeno e de la hepatitis B (HBeAg) es un péptido secretorio que se libera durante la replicación viral activa. Su positividad en el suero es un indicador directo de que el virus se está replicando activamente y, por lo tanto, el paciente tiene un riesgo extremadamente alto de transmitir la infección a otras personas.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA PERIANAL",
    "subtema": "FISTULAS",
    "difficulty": "baja",
    "case": "Masculino de 45 años, con antecedente de un absceso perianal drenado quirúrgicamente hace 8 meses. Acude a consulta refiriendo que, desde la cirugía, nota la salida intermitente de material seropurulento y fecaloideo a través de un pequeño orificio en la piel cercana al ano, lo cual le causa prurito y mancha su ropa interior. A la exploración física en posición de navaja sevillana, se observa un orificio fistuloso secundario (externo) localizado en el radio de las 4 del reloj (cuadrante posterior derecho), a 2 cm del margen anal.",
    "questions": [
      {
        "question": "Para planear la exploración quirúrgica, el cirujano utiliza una regla anatómica clásica que ayuda a predecir el trayecto de la fístula y la localización de su orificio primario (interno) basándose en la ubicación del orificio externo. ¿Cómo se llama esta regla?",
        "options": [
          "Regla de Parkland",
          "Criterios de Tokio",
          "Regla de Goodsall",
          "Escala de Hinchey"
        ],
        "answerIndex": 2,
        "explanation": "La regla de Goodsall establece que si se traza una línea transversal imaginaria a través del centro del ano: los orificios fistulosos externos situados anteriormente a esta línea tendrán un trayecto recto y corto hacia la cripta anal correspondiente (orificio interno). Por el contrario, los orificios externos situados posteriormente (como en este paciente, a las 4 del reloj) tendrán un trayecto curvo y largo que desembocará invariablemente en la línea media posterior del canal anal. Hay excepciones para fístulas anteriores a más de 3 cm del margen.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "ATLS P1",
    "subtema": "TRAUMA TORÁCICO (NEUMOTÓRAX ABIERTO)",
    "difficulty": "alta",
    "case": "Masculino de 30 años es atendido por paramédicos en la vía pública tras sufrir una agresión con un machete. Presenta una herida abierta de aproximadamente 5 cm de diámetro en la pared torácica lateral derecha (cuarto espacio intercostal). A la evaluación primaria (A, B, C), el paciente se encuentra con severa dificultad respiratoria, taquipneico (35 rpm) y cianótico. Durante la inspiración, los paramédicos escuchan un sonido de succión característico proveniente de la herida, y observan que sale sangre burbujeante durante la espiración.",
    "questions": [
      {
        "question": "De acuerdo con la fisiopatología del trauma torácico, para que ocurra este fenómeno de \"succión\" y el aire prefiera entrar por la herida en lugar de por la tráquea (creando un neumotórax abierto), ¿qué tamaño mínimo debe tener la herida en la pared torácica?",
        "options": [
          "Mayor al diámetro de la arteria aorta",
          "Aproximadamente un tercio (1/3) del diámetro de la tráquea",
          "Aproximadamente dos tercios (2/3) del diámetro de la tráquea del paciente",
          "El tamaño de la herida es irrelevante"
        ],
        "answerIndex": 2,
        "explanation": "El ATLS establece que el aire siempre sigue el camino de menor resistencia. Si la herida en la pared torácica tiene un tamaño de aproximadamente dos tercios (2/3) o más del diámetro de la tráquea, el aire entrará preferentemente a través del defecto de la pared torácica durante la inspiración (por la presión negativa intratorácica), igualando las presiones y colapsando el pulmón afectado.",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es la medida inicial, rápida y salvadora que deben aplicar los paramédicos en la escena del trauma para estabilizar la ventilación del paciente antes de trasladarlo?",
        "options": [
          "Intubación orotraqueal inmediata en el lugar de los hechos",
          "Colocación de un parche oclusivo estéril fijado con cinta adhesiva en tres de sus cuatro lados",
          "Cierre hermético de la herida suturando la piel en la ambulancia",
          "Colocación de una gasa seca sin fijar"
        ],
        "answerIndex": 1,
        "explanation": "El tratamiento inicial prehospitalario para un neumotórax abierto es sellar rápidamente el defecto con un apósito oclusivo (parche) fijado solo en tres de sus cuatro lados. Esto crea un efecto de válvula unidireccional: durante la inspiración, el parche se adhiere y sella la herida impidiendo que entre más aire; durante la espiración, el lado no fijado permite que el aire acumulado en la pleura escape, previniendo así la conversión letal hacia un neumotórax a tensión.",
        "gpcReference": ""
      },
      {
        "question": "Una vez que el paciente llega a la sala de choque del hospital, ¿cuál es el manejo terapéutico definitivo indicado para esta patología?",
        "options": [
          "Colocación de una sonda endopleural (tubo de tórax) y cierre quirúrgico del defecto de la pared",
          "Mantener el parche de tres lados hasta que la herida granule por segunda intención",
          "Toracotomía de reanimación urgente",
          "Pericardiocentesis"
        ],
        "answerIndex": 0,
        "explanation": "El tratamiento definitivo intrahospitalario del neumotórax abierto requiere la colocación de un tubo de tórax (sonda endopleural) en un sitio distinto a la herida original para reexpandir el pulmón y drenar el aire/sangre, seguido del desbridamiento y cierre quirúrgico del defecto traumático de la pared torácica.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "ATLS P2",
    "subtema": "TCE HEMORRAGIA SUBDURAL",
    "difficulty": "media",
    "case": "Masculino de 78 años de edad, con antecedente de alcoholismo crónico y atrofia cortical documentada, es traído a urgencias por su hija. Ella refiere que en las últimas 3 semanas ha notado a su padre con alteraciones en el comportamiento, lentitud mental, cefalea matutina leve y una progresiva debilidad en el hemicuerpo izquierdo. Menciona que hace aproximadamente un mes, el paciente sufrió una caída desde su propia altura golpeándose la cabeza, pero no perdió el conocimiento ni acudieron a revisión médica en su momento. A la exploración, Glasgow 13 (confusión leve), con hemiparesia izquierda 4/5.",
    "questions": [
      {
        "question": "Por la evolución insidiosa (semanas) y los antecedentes de edad avanzada y atrofia cerebral, la sospecha es un hematoma subdural crónico. Desde el punto de vista anatómico, ¿cuál es el vaso sanguíneo cuya ruptura condiciona más frecuentemente esta acumulación de sangre entre la duramadre y la aracnoides?",
        "options": [
          "Arteria meníngea media",
          "Seno sagital superior",
          "Venas puente corticales",
          "Polígono de Willis"
        ],
        "answerIndex": 2,
        "explanation": "El hematoma subdural es causado típicamente por el desgarro de las \"venas puente\" corticales que drenan desde la superficie del cerebro hacia los senos durales. En pacientes ancianos o alcohólicos, la atrofia cerebral hace que el cerebro se retraiga, estirando estas venas y haciéndolas extremadamente susceptibles a romperse incluso con traumatismos menores o fuerzas de aceleración/desaceleración leves.",
        "gpcReference": ""
      },
      {
        "question": "Se solicita una Tomografía Computarizada (TAC) de cráneo simple para confirmar el diagnóstico. ¿Cuál es la descripción radiológica clásica esperada para esta lesión en un estadio crónico?",
        "options": [
          "Colección biconvexa hiperdensa que no cruza suturas",
          "Sangre distribuida en los surcos y cisternas de la base",
          "Colección en forma de semiluna o cóncavo-convexa, de densidad isodensa o hipodensa respecto al parénquima cerebral, que cruza suturas craneales",
          "Imagen en \"sal y pimienta\" dentro del parénquima"
        ],
        "answerIndex": 2,
        "explanation": "La imagen tomográfica clásica del hematoma subdural es una colección hemática en forma de semiluna (cóncavo-convexa) que sigue el contorno del cerebro y es capaz de cruzar las suturas craneales (a diferencia del epidural). En la fase aguda la sangre es hiperdensa (blanca), pero en la fase crónica (semanas después, como en este paciente), la sangre degradada se vuelve isodensa o hipodensa (gris oscura) en relación con el tejido cerebral subyacente.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "ATLS P3",
    "subtema": "ATLS EN LA EMBARAZADA",
    "difficulty": "alta",
    "case": "Femenina de 28 años, cursando con embarazo de 34 semanas de gestación por fecha de última menstruación. Es ingresada a la sala de choque tras sufrir un accidente automovilístico con impacto frontal a alta velocidad; ella viajaba como copiloto y sí portaba el cinturón de seguridad. A su ingreso, la paciente se encuentra obnubilada, pálida y diaforética. Sus signos vitales revelan TA 80/50 mmHg, FC 125 lpm y FR 26 rpm. A la exploración física, el abdomen se encuentra globoso por el útero grávido, con altura uterina de 32 cm. Se palpa el útero hipertónico (leñoso) y la paciente presenta un sangrado transvaginal oscuro, de moderada cantidad.",
    "questions": [
      {
        "question": "Debido al compromiso hemodinámico (choque), ¿cuál es la maniobra posicional básica e indispensable que debe realizarse inmediatamente en la sala de urgencias para mejorar el gasto cardíaco de la madre?",
        "options": [
          "Colocar en posición de Trendelenburg (cabeza más baja que los pies)",
          "Desplazamiento manual del útero hacia la izquierda o elevación del lado derecho de la tabla espinal unos 15 grados",
          "Colocar en decúbito lateral derecho estricto",
          "Elevar ambas extremidades inferiores a 45 grados"
        ],
        "answerIndex": 1,
        "explanation": "En el tercer trimestre, el útero grávido comprime fuertemente la vena cava inferior cuando la paciente está en decúbito supino, reduciendo el retorno venoso y el gasto cardíaco hasta en un 30% (síndrome de hipotensión supina). El ATLS indica que el útero debe desplazarse manualmente hacia la izquierda o se debe inclinar la tabla espinal hacia la izquierda para liberar la compresión de la cava y optimizar la reanimación hemodinámica.",
        "gpcReference": ""
      },
      {
        "question": "Según los lineamientos del ATLS para trauma en el embarazo, ante la presencia de un binomio madre-feto comprometido, ¿hacia quién deben ir dirigidos los esfuerzos iniciales de reanimación primaria (A-B-C)?",
        "options": [
          "Reanimación prioritaria de la madre, ya que la mejor reanimación fetal es una adecuada reanimación materna",
          "Extracción fetal inmediata por cesárea perimortem al minuto 1",
          "Monitorización fetal continua como paso \"A\" del protocolo",
          "Reanimación simultánea priorizando los líquidos para el feto"
        ],
        "answerIndex": 0,
        "explanation": "El principio fundamental del ATLS en la embarazada es que \"la madre es primero\". La supervivencia del feto depende íntegramente de la estabilidad hemodinámica y oxigenación materna. Por lo tanto, el protocolo ABCDE inicial se aplica a la madre de forma idéntica a un paciente no embarazado, priorizando su volumen circulante y oxigenación.",
        "gpcReference": ""
      },
      {
        "question": "Por la cinemática del trauma (desaceleración brusca) y los hallazgos a la exploración (útero hipertónico y sangrado oscuro), ¿cuál es la complicación obstétrica traumática más probable que amenaza la vida del feto en este momento?",
        "options": [
          "Ruptura uterina",
          "Placenta previa",
          "Desprendimiento prematuro de placenta normoincerta (DPPNI)",
          "Vasa previa"
        ],
        "answerIndex": 2,
        "explanation": "El trauma cerrado de abdomen, especialmente con el mecanismo de cizallamiento provocado por el cinturón de seguridad durante una desaceleración rápida, es una causa clásica de Desprendimiento Prematuro de Placenta (DPPNI). La clínica patognomónica incluye hipertonía uterina, dolor, sufrimiento fetal y sangrado transvaginal oscuro (aunque puede ser oculto).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA INTESTINAL QX",
    "subtema": "VÓLVULO DE COLON Y CIEGO",
    "difficulty": "media",
    "case": "Femenina de 45 años, sin antecedentes quirúrgicos, acude por presentar dolor abdominal de inicio brusco en el mesogastrio y la fosa ilíaca derecha, progresivo, que posteriormente se generaliza. Refiere imposibilidad para canalizar gases, náuseas y dos episodios de vómito biliar. A la exploración física, el abdomen está francamente distendido, timpánico. Llama la atención que la fosa ilíaca derecha se palpa vacía, y se palpa una masa renitente y dolorosa en el mesogastrio.",
    "questions": [
      {
        "question": "Se solicita una radiografía simple de abdomen en bipedestación y decúbito. Se observa una gran asa dilatada en forma de \"embrión\" o \"coma\" que se origina en la fosa ilíaca derecha y se dirige hacia el epigastrio o hipocondrio izquierdo, acompañada de un solo nivel hidroaéreo. Con base en la sospecha de vólvulo de ciego, ¿cuál es el tratamiento inicial de elección según la GPC?",
        "options": [
          "Descompresión endoscópica (colonoscopia) urgente",
          "Exploración quirúrgica inmediata (Hemicolectomía derecha o ileocecectomía)",
          "Colocación de sonda rectal gruesa y enemas evacuantes",
          "Reducción hidrostática con bario"
        ],
        "answerIndex": 1,
        "explanation": "A diferencia del vólvulo de sigmoides (cuyo tratamiento inicial de elección es la descompresión endoscópica), el vólvulo de ciego tiene un riesgo mucho mayor de isquemia y perforación, y su reducción endoscópica tiene una tasa de éxito muy baja (solo 15-20%). Por lo tanto, la GPC y los libros de cirugía establecen que el tratamiento del vólvulo cecal es siempre quirúrgico de urgencia, realizando generalmente una resección ileocecal o hemicolectomía derecha.",
        "gpcReference": ""
      },
      {
        "question": "Desde el punto de vista del desarrollo embrionario, ¿cuál es la alteración anatómica predisponente necesaria para que ocurra la volvulación del ciego?",
        "options": [
          "Presencia de un divertículo de Meckel largo",
          "Falta de fijación del colon derecho y el ciego al retroperitoneo (fijación mesentérica incompleta)",
          "Megacolon congénito (Enfermedad de Hirschsprung)",
          "Atresia ileal distal"
        ],
        "answerIndex": 1,
        "explanation": "Para que el ciego se tuerza sobre su propio eje, requiere tener movilidad. Normalmente, el ciego y el colon ascendente están fijos al retroperitoneo. El vólvulo de ciego ocurre en pacientes que tienen un defecto de fijación peritoneal congénito (ciego móvil), lo que le permite rotar sobre el mesenterio ileocecal. Shutterstock",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "MORDEDURAS Y PICADURAS",
    "subtema": "LATRODECTISMO",
    "difficulty": "media",
    "case": "Masculino de 32 años, campesino, acude a urgencias con intenso dolor generalizado de inicio súbito. Refiere haber sentido un pinchazo en el antebrazo derecho hace una hora mientras movía leña en un cuarto oscuro. A su llegada, el paciente se encuentra con diaforesis profusa, agitación psicomotriz, sialorrea, epífora y fasciculaciones. A la exploración abdominal, el abdomen se encuentra rígido, \"en madera\", simulando un abdomen agudo peritonítico. Sus signos vitales evidencian taquicardia (130 lpm) e hipertensión (160/100 mmHg).",
    "questions": [
      {
        "question": "Por el cuadro clínico de neurotoxicidad severa con predominio de espasmos musculares y rigidez abdominal (sin lesión dermo-necrótica local), ¿cuál es la toxina responsable liberada por el agente causal (Araña Viuda Negra / Latrodectus mactans)?",
        "options": [
          "Esfingomielinasa D",
          "Alfa-latrotoxina",
          "Escorpamina",
          "Crotoxina"
        ],
        "answerIndex": 1,
        "explanation": "La alfa-latrotoxina es el principal componente del veneno de la viuda negra. Se une a los receptores presinápticos en las placas neuromusculares, provocando una exocitosis masiva e incontrolable de neurotransmisores (especialmente acetilcolina y norepinefrina). Esto genera el cuadro de latrodectismo: espasmos musculares dolorosos severos (típicamente rigidez abdominal que simula abdomen agudo quirúrgico), hiperactividad autonómica (diaforesis, taquicardia) y facies latrodectísmica. La esfingomielinasa D es la toxina de la araña violinista (Loxosceles).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "INTRODUCCIÓN OFTALMOLOGÍA",
    "subtema": "ORZUELO",
    "difficulty": "baja",
    "case": "Femenina de 18 años acude a consulta por referir la aparición de una \"bolita\" en el párpado inferior del ojo izquierdo, la cual inició hace 48 horas con enrojecimiento y dolor. A la exploración física oftalmológica, se observa un nódulo eritematoso, focal y exquisitamente doloroso a la palpación en el margen libre del párpado inferior, centrado alrededor de un folículo piloso de una pestaña, con un pequeño punto blanquecino de supuración apuntando hacia el exterior.",
    "questions": [
      {
        "question": "De acuerdo con la presentación clínica aguda, eritematosa y dolorosa, ¿cuál es el diagnóstico correcto y la glándula afectada?",
        "options": [
          "Chalazión; inflamación crónica estéril de las glándulas de Meibomio",
          "Orzuelo externo; infección bacteriana aguda de las glándulas de Zeis o Moll",
          "Orzuelo interno; infección aguda de la glándula lagrimal",
          "Dacriocistitis; infección del saco lagrimal"
        ],
        "answerIndex": 1,
        "explanation": "El orzuelo externo es un absceso estafilocócico agudo, eritematoso y doloroso localizado en el margen palpebral, originado por la infección de los folículos de las pestañas y sus glándulas sebáceas accesorias asociadas (Zeis o Moll). El chalazión, por el contrario, es una lesión nodular crónica, firme y típicamente indolora, producida por la inflamación granulomatosa no infecciosa de una glándula de Meibomio en el tarso.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA ISQUÉMICA INTESTINAL",
    "subtema": "ISQUEMIA MESENTERICA AGUDA Y CRÓNICA",
    "difficulty": "media",
    "case": "Masculino de 68 años de edad, con antecedente de tabaquismo de 40 paquetes/año y enfermedad arterial periférica severa. Acude a la consulta de gastroenterología por pérdida de peso progresiva (12 kg en los últimos 6 meses) y dolor abdominal crónico. El paciente describe el dolor como un dolor cólico sordo en el mesogastrio que inicia de forma invariable 30 a 45 minutos después de ingerir cualquier alimento, y que cede lentamente al cabo de un par de horas. Debido a esto, el paciente refiere tener \"miedo a comer\" (sitofobia) y ha reducido drásticamente el tamaño de sus porciones.",
    "questions": [
      {
        "question": "Con base en los antecedentes ateroscleróticos y el patrón clínico clásico de dolor postprandial con sitofobia, ¿cuál es el diagnóstico más probable?",
        "options": [
          "Úlcera péptica gástrica",
          "Isquemia mesentérica aguda",
          "Isquemia mesentérica crónica (Angina intestinal)",
          "Cáncer de cabeza de páncreas"
        ],
        "answerIndex": 2,
        "explanation": "La isquemia mesentérica crónica, también conocida como \"angina intestinal\", se presenta en pacientes con ateroesclerosis sistémica severa. Su tríada clásica (aunque rara vez completa) es: dolor abdominal postprandial (causado por la incapacidad de las arterias ocluidas de aumentar el flujo sanguíneo requerido para la digestión), pérdida de peso progresiva y sitofobia (miedo a alimentarse por el dolor anticipado).",
        "gpcReference": ""
      },
      {
        "question": "Para confirmar el diagnóstico y planear una posible revascularización quirúrgica o endovascular, ¿cuál es el estudio de imagen estándar de oro para documentar la estenosis de los vasos esplácnicos (tronco celíaco y arterias mesentéricas)?",
        "options": [
          "Endoscopia superior con toma de biopsia",
          "Arteriografía mesentérica o Angiotomografía (AngioTAC) abdominal",
          "Serie esofagogastroduodenal",
          "Ultrasonido pélvico"
        ],
        "answerIndex": 1,
        "explanation": "El estándar de oro histórico para diagnosticar la oclusión o estenosis de los vasos mesentéricos es la arteriografía convencional, aunque actualmente la AngioTAC abdominal ha reemplazado a la arteriografía como el estudio de imagen inicial de elección por ser menos invasiva, permitiendo reconstrucciones 3D de alta calidad del tronco celíaco, arteria mesentérica superior y arteria mesentérica inferior (se requiere afectación de al menos 2 de estos vasos para presentar síntomas crónicos debido a la rica red colateral).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "INTRODUCCIÓN A CIRUGÍA Y CIRUGÍA ABDOMINAL",
    "subtema": "SX DE DOLOR LOCOREGIONAL",
    "difficulty": "media",
    "case": "Masculino de 45 años, sin antecedentes crónicos de importancia, acude al servicio de urgencias por presentar dolor abdominal de inicio súbito y muy intenso, de 4 horas de evolución. Refiere que el dolor se exacerba con el más mínimo movimiento, incluso al toser o respirar profundamente. A la exploración física, el paciente se encuentra inmóvil en decúbito supino, diaforético y taquicárdico. El abdomen se encuentra plano, sin ruidos peristálticos, y presenta una rigidez muscular involuntaria generalizada (\"abdomen en tabla\"). Se elicita dolor intenso a la descompresión rápida de la pared abdominal en cualquier cuadrante. Femenina de 60 años, con diagnóstico de cirrosis hepática secundaria a esteatohepatitis no alcohólica (NASH), acude a consulta externa por referir un aumento progresivo del perímetro abdominal en el último mes, acompañado de ganancia de peso y edema en extremidades inferiores. Niega disnea, fiebre, dolor abdominal o alteraciones en el estado de alerta. A la exploración física, el abdomen se encuentra globoso, con matidez cambiante a la percusión y signo de la oleada ascítica positivo. Femenina de 52 años, quien sufrió una fractura de Colles (radio distal) en la muñeca derecha hace 8 semanas, tratada de forma conservadora con inmovilización prolongada con yeso. Actualmente la fractura se encuentra consolidada y el yeso fue retirado. Sin embargo, la paciente acude a consulta quejándose de un dolor ardoroso insoportable, continuo y desproporcionado en toda la mano derecha, que se desencadena incluso con el simple roce de la ropa (alodinia). A la exploración física, la mano derecha se observa edematizada, eritematosa, sudorosa, con temperatura aumentada en comparación con la contralateral. Los dedos están rígidos y la piel se nota lustrosa y atrófica.",
    "questions": [
      {
        "question": "El hallazgo exploratorio de dolor intenso a la descompresión rápida de la pared abdominal es un signo clínico inequívoco de irritación peritoneal generalizada. ¿Qué nombre recibe este signo semiológico clásico?",
        "options": [
          "Signo de Murphy",
          "Signo de Rovsing",
          "Signo de Blumberg (Rebote)",
          "Signo de Courvoisier"
        ],
        "answerIndex": 2,
        "explanation": "El signo de Blumberg, comúnmente conocido como signo del rebote, se define como la exacerbación del dolor abdominal tras la palpación profunda seguida de una liberación (descompresión) brusca de la mano del examinador. Es el signo clínico cardinal de la inflamación del peritoneo parietal (peritonitis localizada o generalizada) que exige evaluación quirúrgica.Tema: CIRROSIS Y SUS COMPLICACIONES / TRASPLANTE HEPATICO",
        "gpcReference": ""
      },
      {
        "question": "De acuerdo con la GPC, tratándose del primer episodio clínico de ascitis en esta paciente, ¿cuál es el procedimiento diagnóstico inicial e indispensable que se debe realizar en el consultorio o urgencias para establecer la etiología del líquido y descartar infecciones ocultas?",
        "options": [
          "Ecografía Doppler de la vena porta",
          "Paracentesis diagnóstica con extracción de 20-50 cc de líquido",
          "Tomografía computarizada de abdomen contrastada",
          "Biopsia hepática percutánea"
        ],
        "answerIndex": 1,
        "explanation": "La paracentesis diagnóstica es obligatoria en todo paciente con ascitis de inicio reciente (o en un paciente con ascitis crónica que ingresa al hospital o presenta deterioro clínico). Permite analizar el líquido (citoquímico y citológico) para confirmar la etiología y descartar una peritonitis bacteriana espontánea asintomática.",
        "gpcReference": ""
      },
      {
        "question": "Al analizar el líquido extraído, ¿cuál es el parámetro bioquímico que confirma que la ascitis de la paciente es de origen hipertensivo portal (trasudado) y no debida a otras causas como carcinomatosis peritoneal o tuberculosis?",
        "options": [
          "Proteínas totales en líquido ascítico < 2.5 g/dL",
          "Conteo de leucocitos polimorfonucleares > 250 células/mm³",
          "Gradiente de Albúmina Suero-Ascitis (GASA) ≥ 1.1 g/dL",
          "Glucosa en líquido ascítico < 50 mg/dL"
        ],
        "answerIndex": 2,
        "explanation": "El Gradiente de Albúmina Suero-Ascitis (GASA), que se calcula restando la albúmina del líquido ascítico a la albúmina sérica tomada el mismo día, es el método más preciso. Un GASA ≥ 1.1 g/dL indica con un 97% de precisión que la ascitis es causada por hipertensión portal (como en la cirrosis). Un GASA < 1.1 g/dL sugiere causas no relacionadas con hipertensión portal (exudados por cáncer, inflamación, etc.).",
        "gpcReference": ""
      },
      {
        "question": "Confirmado el origen cirrótico no complicado de la ascitis, además de la restricción de sodio en la dieta, ¿cuál es el régimen diurético de primera elección recomendado para iniciar el manejo de la ascitis moderada?",
        "options": [
          "Furosemida en monoterapia a dosis altas",
          "Espironolactona en monoterapia o combinada con Furosemida (proporción 100 mg / 40 mg)",
          "Hidroclorotiazida exclusivamente",
          "Manitol intravenoso"
        ],
        "answerIndex": 1,
        "explanation": "La GPC y las guías hepatológicas recomiendan iniciar con Espironolactona (un antagonista de la aldosterona, ya que los cirróticos tienen hiperaldosteronismo secundario marcado) sola, o en combinación inicial con Furosemida en una proporción estricta de 100 mg a 40 mg para mantener la normopotasemia y lograr una pérdida de peso controlada.Tema: PATOLOGÍA CÁMARA ANTERIORSubtema: EPIESCLERITISDificultad: BajaCaso clínico (Corto):Femenina de 35 años, previamente sana, acude a la consulta oftalmológica por presentar enrojecimiento localizado en la región temporal del ojo derecho de 2 días de evolución. Refiere molestia ocular leve (\"como si trajera una basurita\"), pero niega dolor profundo, fotofobia, lagrimeo o disminución de la agudeza visual. A la inspección, se observa una congestión vascular superficial, localizada y de color rojo brillante en la esclera temporal derecha. El médico aplica una gota de fenilefrina al 10% (agente vasoconstrictor) en el fondo de saco, notando que el enrojecimiento vascular palidece casi por completo (blanqueamiento del área hiperémica) a los pocos minutos.Pregunta 1 Con base en la clínica leve y la prueba de fenilefrina positiva, ¿cuál es el diagnóstico correcto que distingue este cuadro de inflamaciones oculares más graves? A) Escleritis nodular B) Epiescleritis * C) Uveítis anterior D) Glaucoma agudo La epiescleritis es una inflamación aguda, benigna y a menudo autolimitada del tejido epiescleral superficial. Cursa con molestia leve y enrojecimiento (sectorial o difuso) brillante. La prueba de oro clínica diferencial es la aplicación de fenilefrina tópica: al ser vasos superficiales los afectados en la epiescleritis, estos se contraen y la zona palidece (blanquea). En la escleritis (una entidad destructiva profunda mucho más grave), los vasos del plexo profundo están ingurgitados y no blanquean con la fenilefrina.Tema: TRAUMA GENERALIDADES Y COMPLICACIONES",
        "gpcReference": ""
      },
      {
        "question": "De acuerdo con los Criterios de Budapest y la presentación clínica (dolor desproporcionado tras un trauma menor o inmovilización, asociado a cambios autonómicos, vasomotores y tróficos), ¿cuál es el diagnóstico más probable?",
        "options": [
          "Síndrome compartimental crónico",
          "Osteomielitis aguda",
          "Síndrome de Dolor Regional Complejo (Síndrome de Sudeck)",
          "Neuropatía diabética periférica"
        ],
        "answerIndex": 2,
        "explanation": "El Síndrome de Dolor Regional Complejo (SDRC), anteriormente conocido como Distrofia Simpático Refleja o Síndrome de Sudeck, es una complicación neuroinflamatoria aberrante que ocurre típicamente tras un traumatismo en una extremidad (como una fractura de muñeca). Se caracteriza por dolor neuropático extremo y desproporcionado (hiperalgesia, alodinia), acompañado de disregulación autonómica que produce edema, cambios en el color de la piel, sudoración asimétrica y alteraciones tróficas (piel brillante, pérdida de vello, rigidez articular).",
        "gpcReference": ""
      },
      {
        "question": "Según las guías de práctica clínica para el tratamiento multimodal de esta patología, además de la fisioterapia y rehabilitación tempranas y agresivas, ¿cuál de los siguientes grupos farmacológicos se utiliza como piedra angular para el manejo del dolor neuropático?",
        "options": [
          "AINEs a dosis plenas",
          "Gabapentinoides (Gabapentina o Pregabalina)",
          "Corticosteroides intramusculares mensuales",
          "Relajantes musculares (Metocarbamol)"
        ],
        "answerIndex": 1,
        "explanation": "El dolor en el SDRC tiene un origen neuropático y mediado por el sistema nervioso central y simpático. Los neuromoduladores como los gabapentinoides (Pregabalina, Gabapentina), solos o en combinación con antidepresivos tricíclicos (Amitriptilina), son los fármacos de primera línea para modular la hiperexcitabilidad nerviosa y controlar la alodinia, permitiendo así que el paciente tolere la terapia física (que es el tratamiento definitivo para evitar la atrofia permanente).Tema: INTRODUCCIÓN OFTALMOLOGÍASubtema: DACRIOADENITISDificultad: BajaCaso clínico (Corto):Preescolar masculino de 6 años es llevado a la consulta de oftalmología pediátrica por presentar un cuadro de inicio agudo caracterizado por dolor, fiebre y un aumento de volumen importante en el tercio externo del párpado superior derecho. A la exploración física, se observa un eritema marcado y tumefacción en la región superotemporal de la órbita derecha, lo que provoca que el párpado superior adquiera una deformidad característica en forma de \"S\" itálica.Pregunta 1 Dada la localización superotemporal de la inflamación y la clásica deformidad palpebral descrita, ¿cuál de las siguientes estructuras anatómicas está primariamente infectada o inflamada (Dacrioadenitis)? A) Saco lagrimal B) Glándulas de Meibomio C) Glándula lagrimal principal * D) Conducto nasolagrimal La dacrioadenitis es la inflamación de la glándula lagrimal principal, la cual se localiza anatómicamente en la fosa lagrimal (cuadrante orbitario superotemporal). Su inflamación aguda produce un agrandamiento que empuja el párpado superior hacia abajo y adentro, originando la característica deformidad en \"S\" itálica del borde palpebral. Esto la diferencia claramente de la dacriocistitis (infección del saco lagrimal), la cual se localiza en la porción inferomedial (cerca del canto interno o nariz) del ojo.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "HERNIAS / ESPLENECTOMÍA",
    "subtema": "Hernias",
    "difficulty": "baja",
    "case": "Lactante masculino de 10 meses de edad es llevado a la consulta de control del niño sano. La madre refiere preocupación porque nota una \"bolita\" en el ombligo del bebé que protruye más cuando llora o hace esfuerzo para evacuar, pero que desaparece cuando está dormido. A la exploración física, el paciente se encuentra tranquilo, asintomático. A nivel de la cicatriz umbilical se palpa un anillo herniario de aproximadamente 1.2 cm de diámetro, a través del cual protruye una masa blanda, indolora y fácilmente reductible.",
    "questions": [
      {
        "question": "De acuerdo con la GPC para hernias de la pared abdominal en la edad pediátrica, ¿cuál es la indicación terapéutica correcta en este momento para el paciente?",
        "options": [
          "Programar para plastía umbilical (herniorrafia) de manera electiva en el próximo mes",
          "Colocación de fajas, monedas o vendajes compresivos umbilicales",
          "Observación y manejo conservador, ya que la mayoría cierra espontáneamente antes de los 2 a 4 años de edad",
          "Referencia urgente a cirugía pediátrica para colocación de malla"
        ],
        "answerIndex": 2,
        "explanation": "La hernia umbilical en lactantes se debe al cierre incompleto del anillo umbilical. La GPC establece que el manejo inicial es la observación, ya que más del 80-90% de los defectos menores a 1.5 cm cerrarán espontáneamente antes de los 2 a 4 años de edad. El tratamiento quirúrgico se indica si el defecto es mayor a 1.5 cm, si persiste después de los 4 años o si presenta alguna complicación (encarcelamiento), lo cual es extremadamente raro en hernias umbilicales pediátricas. Las fajas o monedas están contraindicadas.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "QUEMADURAS / GOLPE DE CALOR / HIPOTERMIA",
    "subtema": "Hipotermia",
    "difficulty": "alta",
    "case": "Masculino de 45 años es rescatado por protección civil tras haberse perdido durante una excursión en la montaña y pasar la noche a la intemperie bajo una nevada severa. A su ingreso a urgencias, el paciente se encuentra letárgico, no presenta escalofríos (shivering abolido), tiene midriasis y bradicardia severa. La medición de su temperatura corporal central con termómetro esofágico marca 29°C. Getty Images",
    "questions": [
      {
        "question": "Dada la temperatura central del paciente (29°C), se clasifica como hipotermia moderada -severa. Al realizarle un electrocardiograma de 12 derivaciones, ¿cuál es el hallazgo patognomónico clásico esperado en esta patología térmica?",
        "options": [
          "Inversión profunda de las ondas T en derivaciones precordiales",
          "Elevación cóncava difusa del segmento ST",
          "Deflexión positiva tardía en la unión del complejo QRS y el segmento ST (Onda J de Osborn)",
          "Acortamiento extremo del intervalo QT"
        ],
        "answerIndex": 2,
        "explanation": "La Onda J de Osborn es una deflexión positiva adicional que aparece al final del complejo QRS y el inicio del segmento ST. Es un hallazgo electrocardiográfico clásico y patognomónico de la hipotermia sistémica, y su amplitud suele ser directamente proporcional al grado de descenso de la temperatura central.",
        "gpcReference": ""
      },
      {
        "question": "Para el manejo del paciente (sin paro cardiorrespiratorio), ¿cuál es el método de recalentamiento primario de elección indicado por las guías de reanimación?",
        "options": [
          "Recalentamiento pasivo externo exclusivo (quitar ropa mojada y poner mantas)",
          "Recalentamiento activo externo (lámparas de calor y mantas térmicas eléctricas)",
          "Recalentamiento activo interno (fluidos intravenosos cristaloides calentados a 39- 40°C y oxígeno húmedo caliente)",
          "Baño de inmersión en agua hirviendo a 45°C"
        ],
        "answerIndex": 2,
        "explanation": "En la hipotermia moderada a severa (temperatura central < 30°C) con abolición del escalofrío, el paciente ha perdido la capacidad de generar calor propio. El tratamiento de elección para estabilizar la temperatura del núcleo (corazón/cerebro) y evitar el fenómeno de \"afterdrop\" (caída adicional de la temperatura al vasodilatar la periferia) es el recalentamiento activo interno, siendo la infusión de cristaloides IV calentados y la ventilación con oxígeno caliente/humidificado las medidas iniciales más importantes.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA CÁMARA ANTERIOR",
    "subtema": "Pinguécula",
    "difficulty": "baja",
    "case": "Masculino de 50 años, albañil de profesión, acude a la consulta externa de oftalmología por notar una pequeña \"mancha amarillenta\" en la parte blanca de ambos ojos que le preocupa desde hace varios meses. Refiere irritación y ojo rojo ocasional tras jornadas expuestas al sol y al polvo, pero niega disminución de la agudeza visual. A la exploración en lámpara de hendidura, se observa un pequeño nódulo o depósito amarillento, solevantado, localizado en la conjuntiva bulbar nasal de ambos ojos, cerca del limbo esclerocorneal. Getty Images",
    "questions": [
      {
        "question": "Al realizar la inspección detallada, ¿cuál es el hallazgo clínico diferencial que permite confirmar que esta lesión es una pinguécula y NO un pterigión?",
        "options": [
          "La lesión se asocia fuertemente a exposición solar",
          "La lesión respeta el limbo y NO invade la córnea",
          "La lesión tiene una forma triangular con base periférica",
          "La lesión causa astigmatismo irregular severo"
        ],
        "answerIndex": 1,
        "explanation": "Tanto la pinguécula como el pterigión son degeneraciones fibrovasculares de la conjuntiva asociadas a la exposición crónica a los rayos UV, viento y polvo. La diferencia clínica fundamental es que la pinguécula es un nódulo amarillento que se mantiene exclusivamente en la conjuntiva bulbar y nunca cruza el limbo para invadir la córnea. El pterigión, en cambio, sí invade el tejido corneal. El tratamiento de la pinguécula es conservador con lubricantes.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA DE EXTREMIDAD SUPERIOR",
    "subtema": "Fx de antebrazo y mano",
    "difficulty": "media",
    "case": "Masculino de 26 años sufre caída desde su propia altura mientras jugaba fútbol, recibiendo un golpe directo en la cara posterior del antebrazo derecho al intentar protegerse. Acude a urgencias con intenso dolor, incapacidad funcional y deformidad evidente en el tercio proximal del antebrazo. A la exploración física, presenta dolor intenso a la pronosupinación, y se nota limitación para la extensión de la muñeca y los dedos (mano levemente caída).",
    "questions": [
      {
        "question": "Se toman radiografías AP y lateral de antebrazo, las cuales evidencian una fractura de la diáfisis del cúbito en su tercio proximal. Basado en los epónimos traumatológicos clásicos, ¿cuál es la lesión articular que debe buscarse intencionadamente en las radiografías, ya que completa el cuadro de la \"Fractura de Monteggia\"?",
        "options": [
          "Luxación de la articulación radiocubital distal",
          "Luxación de la cabeza del radio (articulación radiocapitular)",
          "Fractura del radio distal concomitante",
          "Fractura del escafoides carpiano"
        ],
        "answerIndex": 1,
        "explanation": "La lesión de Monteggia es un complejo traumático definido clásicamente como la fractura de la diáfisis del cúbito (generalmente en el tercio proximal o medio) asociada a la luxación anterior de la cabeza del radio. La regla mnemotécnica \"MUGR\" (Monteggia: Ulna fx + G... / Galeazzi: Radius fx + radioulnar luxation) ayuda a recordarlo.",
        "gpcReference": ""
      },
      {
        "question": "Dado el cuadro clínico de limitación para la extensión de la muñeca y los dedos, ¿cuál es el nervio que se lesiona con mayor frecuencia en esta fractura-luxación específica (Monteggia) debido a su estrecha relación anatómica con el cuello del radio?",
        "options": [
          "Nervio mediano (rama interósea anterior)",
          "Nervio cubital en el canal de Guyon",
          "Nervio interóseo posterior (rama profunda motora del nervio radial)",
          "Nervio musculocutáneo"
        ],
        "answerIndex": 2,
        "explanation": "La cabeza del radio al luxarse (típicamente hacia anterior) puede comprimir o estirar el nervio interóseo posterior, el cual es la rama motora profunda del nervio radial. Esta neuropraxia se manifiesta por debilidad o incapacidad para extender los dedos y el pulgar, y a veces la muñeca, sin afección de la sensibilidad (ya que es una rama puramente motora).",
        "gpcReference": ""
      },
      {
        "question": "En un paciente adulto con esta lesión (Fractura de Monteggia), ¿cuál es el tratamiento ortopédico de elección?",
        "options": [
          "Reducción cerrada y colocación de yeso braquipalmar por 8 semanas",
          "Reducción abierta y fijación interna (RAFI) con placa y tornillos para el cúbito",
          "Escisión quirúrgica de la cabeza del radio exclusivamente",
          "Colocación de fijadores externos temporales"
        ],
        "answerIndex": 1,
        "explanation": "A diferencia de los niños (donde la reducción cerrada suele ser exitosa), la fractura de Monteggia en el adulto se considera una fractura altamente inestable. El \"estándar de oro\" es el tratamiento quirúrgico: Reducción Abierta y Fijación Interna (RAFI) anatómica y rígida del cúbito con placa y tornillos. Al restaurar perfectamente la longitud del cúbito, la cabeza del radio suele reducirse por sí sola de forma espontánea e indirecta.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "HIPOACUSIA Y VÉRTIGO",
    "subtema": "Hipoacusia neurosensorial",
    "difficulty": "media",
    "case": "Masculino de 75 años, sin antecedentes de trauma acústico ni exposición a fármacos ototóxicos. Acude a la consulta llevado por sus familiares, quienes refieren que el paciente tiene dificultades progresivas para entender las conversaciones desde hace varios años, especialmente en reuniones familiares o restaurantes donde hay ruido de fondo (\"oye pero no entiende\"). A la exploración, la otoscopia de ambos oídos es completamente normal, sin tapones de cerumen y con membranas timpánicas íntegras.",
    "questions": [
      {
        "question": "Se le realiza una prueba de Rinne que resulta positiva bilateral (conducción aérea > conducción ósea), y la prueba de Weber no lateraliza. ¿Cuál es el diagnóstico más probable de esta entidad degenerativa?",
        "options": [
          "Otoesclerosis",
          "Enfermedad de Ménière",
          "Presbiacusia",
          "Schwannoma vestibular (Neurinoma del acústico)"
        ],
        "answerIndex": 2,
        "explanation": "La presbiacusia es la causa más común de hipoacusia en el adulto mayor. Es una hipoacusia neurosensorial bilateral, simétrica y progresiva, debida a la degeneración de las células ciliadas del órgano de Corti por el envejecimiento. Clásicamente, los pacientes conservan la audición para tonos graves (Rinne positivo, Weber central), pero pierden la discriminación del habla, especialmente en ambientes ruidosos.",
        "gpcReference": ""
      },
      {
        "question": "Para confirmar el diagnóstico, se solicita una audiometría tonal pura. ¿Cuál es el patrón audiométrico patognomónico esperado para la presbiacusia?",
        "options": [
          "Caída aislada de la vía ósea en la frecuencia de 2000 Hz (Escotoma de Carhart)",
          "Hipoacusia de conducción en frecuencias graves (250 a 500 Hz)",
          "Hipoacusia neurosensorial bilateral y simétrica con caída progresiva en las frecuencias agudas (4000 a 8000 Hz)",
          "Hipoacusia mixta unilateral"
        ],
        "answerIndex": 2,
        "explanation": "El audiograma típico de la presbiacusia muestra una hipoacusia neurosensorial (vía aérea y vía ósea caen juntas sin \"gap\" u hoquedad) que es bilateral, simétrica y que afecta principalmente las frecuencias altas o agudas (descendente desde los 4000 hasta los 8000 Hz). Esta pérdida de agudos explica la incapacidad del paciente para discriminar las consonantes (que son de alta frecuencia), causando el síntoma clásico de \"oír pero no entender\".",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA BILIAR",
    "subtema": "COLECISTITIS AGUDA",
    "difficulty": "media",
    "case": "Femenina de 42 años, con obesidad grado I y multípara. Acude al servicio de urgencias por presentar dolor abdominal en epigastrio e hipocondrio derecho de 12 horas de evolución, continuo, de intensidad 8/10, que inició tras la ingesta de alimentos ricos en grasas. Refiere náuseas, dos episodios de vómito de contenido biliar y sensación de alza térmica. A la exploración física: Temperatura 38.1°C, FC 98 lpm, TA 120/80 mmHg. El abdomen presenta hiperestesia y resistencia muscular localizada en el cuadrante superior derecho. Al realizar la palpación profunda por debajo del reborde costal derecho y pedirle a la paciente que realice una inspiración profunda, esta interrumpe súbitamente la respiración debido a un tope doloroso.",
    "questions": [
      {
        "question": "El cese abrupto de la inspiración profunda durante la palpación del hipocondrio derecho es el hallazgo clínico más característico de esta patología. ¿Qué nombre recibe este signo semiológico?",
        "options": [
          "Signo de Courvoisier-Terrier",
          "Signo de Rovsing",
          "Signo de Murphy",
          "Signo de Cullen"
        ],
        "answerIndex": 2,
        "explanation": "El signo de Murphy es altamente sensible y específico para la colecistitis aguda. Se produce cuando la vesícula biliar inflamada (que desciende durante la inspiración por la contracción del diafragma) choca contra los dedos del examinador, provocando un dolor tan agudo que obliga al paciente a detener la inspiración involuntariamente.",
        "gpcReference": ""
      },
      {
        "question": "Según las guías de Tokio y la GPC, se le solicita un ultrasonido de hígado y vías biliares (estudio de imagen inicial de elección). ¿Cuál de los siguientes es un hallazgo ecográfico que confirma inflamación aguda de la vesícula biliar?",
        "options": [
          "Pared vesicular con un grosor de 2 mm",
          "Ausencia de sombra acústica posterior",
          "Engrosamiento de la pared vesicular > 4 mm (o > 5 mm según algunas guías) y presencia de líquido perivesicular",
          "Conducto colédoco dilatado > 10 mm"
        ],
        "answerIndex": 2,
        "explanation": "Los criterios ecográficos mayores de colecistitis aguda incluyen: engrosamiento de la pared vesicular (típicamente > 4-5 mm), edema de la pared (signo del doble riel), presencia de líquido perivesicular, distensión de la vesícula (hidrocolecisto > 8x4 cm) y un signo de Murphy ecográfico positivo al presionar con el transductor.",
        "gpcReference": ""
      },
      {
        "question": "Confirmado el diagnóstico de colecistitis aguda grado I (leve, sin disfunción orgánica), ¿cuál es el estándar de oro terapéutico y el momento ideal para realizarlo según la GPC?",
        "options": [
          "Colecistectomía laparoscópica temprana (idealmente en las primeras 72 horas del inicio de los síntomas)",
          "Colecistectomía abierta de urgencia",
          "Antibioticoterapia exclusiva por 14 días y cirugía electiva a los 6 meses",
          "Drenaje percutáneo (colecistostomía)"
        ],
        "answerIndex": 0,
        "explanation": "El tratamiento de elección para la colecistitis aguda no complicada es la colecistectomía laparoscópica temprana, definida como aquella que se realiza durante el mismo internamiento, idealmente dentro de las primeras 72 horas o la primera semana de iniciados los síntomas. Retrasar la cirugía (\"enfriar el cuadro\") aumenta los costos, los días de estancia y la morbilidad por adherencias crónicas.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA INTESTINAL QX",
    "subtema": "APENDICITIS AGUDA",
    "difficulty": "baja",
    "case": "Masculino de 22 años, previamente sano, acude a urgencias quejándose de dolor abdominal de 18 horas de evolución. Refiere que el dolor comenzó de forma difusa alrededor del ombligo (periumbilical) pero hace 6 horas migró y se localizó de forma constante en la fosa ilíaca derecha. Presenta anorexia, náuseas y ha vomitado en una ocasión. A la exploración física: Temperatura 37.8°C. Abdomen plano, con dolor intenso a la palpación en el punto de McBurney y signo de rebote positivo localizado. Laboratorios: Leucocitos 13,000/mm³ con 85% de neutrófilos.",
    "questions": [
      {
        "question": "De acuerdo con la Escala de Alvarado utilizada para estratificar el riesgo clínico de apendicitis aguda, ¿cuáles son los dos parámetros clínicos/laboratoriales que otorgan 2 puntos cada uno en esta escala?",
        "options": [
          "Anorexia y náuseas",
          "Fiebre y desviación a la izquierda (bandemia)",
          "Dolor en fosa ilíaca derecha y leucocitosis",
          "Migración del dolor y signo de rebote"
        ],
        "answerIndex": 2,
        "explanation": "La Escala de Alvarado (MANTRELS) tiene un puntaje máximo de 10. Todos los criterios valen 1 punto, EXCEPTO la leucocitosis (>10,000) y el dolor (tenderness) en el cuadrante inferior derecho, los cuales otorgan 2 puntos cada uno por ser los hallazgos más consistentes. Un puntaje ≥ 7 indica alta probabilidad de apendicitis aguda y justifica la exploración quirúrgica.",
        "gpcReference": ""
      },
      {
        "question": "Al realizar la exploración física, el médico presiona profunda y firmemente la fosa ilíaca izquierda, lo que provoca que el paciente refiera un aumento del dolor en la fosa ilíaca derecha. ¿Qué nombre recibe este signo clínico?",
        "options": [
          "Signo de Psoas",
          "Signo de Obturador",
          "Signo de Rovsing",
          "Signo de Dunphy"
        ],
        "answerIndex": 2,
        "explanation": "El signo de Rovsing es positivo cuando la palpación de la fosa ilíaca izquierda produce dolor en la fosa ilíaca derecha. Esto ocurre porque al presionar el colon descendente, el gas intraluminal es desplazado de forma retrógrada hacia el ciego, distendiéndolo y estimulando el apéndice inflamado.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "UROLOGÍA P2",
    "subtema": "CÁNCER DE PRÓSTATA",
    "difficulty": "media",
    "case": "Masculino de 68 años acude a su chequeo médico anual. Se encuentra asintomático, sin datos de prostatismo (IPSS de 4 puntos). Como parte de su tamizaje, se le realiza la determinación de Antígeno Prostático Específico (APE), el cual se reporta en 8.5 ng/mL (marcadamente elevado para su edad). Se procede a realizar un tacto rectal, en el cual el médico palpa un nódulo pétreo, indurado e indoloro en el lóbulo derecho de la próstata.",
    "questions": [
      {
        "question": "Considerando que la gran mayoría (>95%) de las neoplasias malignas de este órgano son adenocarcinomas, ¿en qué zona anatómica de la glándula prostática se origina más del 70% de estos tumores, lo que explica por qué son frecuentemente palpables al tacto rectal y rara vez causan síntomas urinarios tempranos?",
        "options": [
          "Zona de transición",
          "Zona periférica",
          "Zona central",
          "Estroma fibromuscular anterior"
        ],
        "answerIndex": 1,
        "explanation": "El adenocarcinoma de próstata tiene una predilección absoluta (70-80%) por originarse en la zona periférica de la glándula (la parte más externa y posterior, que está en contacto íntimo con el recto). Al estar alejados de la uretra, crecen de forma silente sin causar síntomas obstructivos hasta etapas muy avanzadas. Por el contrario, la Hiperplasia Prostática Benigna (HPB) se origina casi siempre en la zona de transición (alrededor de la uretra), causando síntomas urinarios de forma temprana.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "TRAUMA GENERALIDADES Y COMPLICACIONES",
    "subtema": "SÍNDROME COMPARTIMENTAL",
    "difficulty": "alta",
    "case": "Masculino de 30 años, sufrió una fractura cerrada de la diáfisis tibial izquierda hace 24 horas mientras jugaba fútbol. Fue tratado inicialmente en otro centro con reducción cerrada y colocación de un yeso cruropédico circular. Acude a urgencias quejándose de un dolor insoportable en la pierna izquierda, el cual describe como \"desgarrador\" y que no cede con la administración de opioides intravenosos. A la exploración, los dedos del pie izquierdo están pálidos y parestésicos. El médico retira inmediatamente el yeso completo, notando la pierna brillante, a tensión extrema (\"de madera\"). Los pulsos pedio y tibial posterior son palpables.",
    "questions": [
      {
        "question": "A pesar de tener pulsos distales presentes, la sospecha de síndrome compartimental agudo es altísima. ¿Cuál es el signo clínico exploratorio más temprano, sensible y confiable para confirmar este diagnóstico en un paciente consciente?",
        "options": [
          "Ausencia de pulso arterial",
          "Dolor exacerbado al estiramiento pasivo de los músculos del compartimento afectado",
          "Parálisis motora flácida",
          "Relleno capilar mayor a 5 segundos"
        ],
        "answerIndex": 1,
        "explanation": "El dolor desproporcionado a la lesión y el dolor extremo al estiramiento pasivo de los músculos isquémicos (ej. flexión plantar pasiva de los dedos en un síndrome del compartimento anterior de la pierna) son los signos clínicos más tempranos y sensibles. La ausencia de pulsos (las \"5 P\": pulselessness) es un signo muy tardío y de mal pronóstico; el síndrome compartimental ocluye la microcirculación capilar y venosa mucho antes de que la presión supere a la presión arterial sistólica de los grandes vasos.",
        "gpcReference": ""
      },
      {
        "question": "Si se decide medir las presiones intracompartimentales con un manómetro, ¿cuál es el umbral de presión diferencial (Delta P) que establece la indicación absoluta para realizar una fasciotomía quirúrgica de urgencia (liberación de los 4 compartimentos de la pierna)?",
        "options": [
          "Presión compartimental absoluta mayor a 10 mmHg",
          "Presión diferencial (Presión Diastólica menos Presión Compartimental) menor o igual a 30 mmHg",
          "Presión diferencial (Presión Sistólica menos Presión Compartimental) menor a 50 mmHg",
          "Presión compartimental absoluta igual a la presión venosa central"
        ],
        "answerIndex": 1,
        "explanation": "Actualmente, el criterio más aceptado para diagnosticar e indicar fasciotomía es el \"Delta P\" (ΔP). Si la diferencia entre la Presión Arterial Diastólica del paciente y la Presión Intracompartimental medida es ≤ 30 mmHg (ΔP ≤ 30), hay una isquemia tisular inminente que justifica abrir quirúrgicamente las fascias para descomprimir el tejido muscular y evitar la necrosis irremediable.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA CÁMARA POSTERIOR",
    "subtema": "DESPRENDIMIENTO DE RETINA",
    "difficulty": "media",
    "case": "Masculino de 55 años, con antecedente de miopía magna (-8.0 dioptrías). Acude a urgencias oftalmológicas refiriendo que, desde hace dos días, comenzó a ver \"luces relampagueantes\" (fotopsias) y un aumento repentino de \"moscas volantes\" (miodesopsias) en su ojo derecho. El día de hoy, notó la aparición súbita de una sombra oscura (\"como un telón o cortina negra\") que empezó en la periferia de su campo visual inferior y está avanzando progresivamente hacia el centro, impidiéndole ver. No presenta dolor ni ojo rojo.",
    "questions": [
      {
        "question": "De acuerdo con la presentación clínica indolora y los síntomas visuales clásicos en un paciente con miopía alta, ¿cuál es el tipo de desprendimiento de retina más probable en este caso?",
        "options": [
          "Desprendimiento de retina traccional",
          "Desprendimiento de retina exudativo (seroso)",
          "Desprendimiento de retina regmatógeno",
          "Desprendimiento por retinosquisis"
        ],
        "answerIndex": 2,
        "explanation": "El desprendimiento de retina regmatógeno (del griego rhegma, rotura) es el más frecuente. Ocurre cuando un desgarro o agujero en la retina permite que el líquido del humor vítreo pase al espacio subretiniano, separando la retina neurosensorial del epitelio pigmentario subyacente. Sus pródromos clásicos son las fotopsias y miodesopsias agudas (por la tracción y rotura), seguidos de la pérdida campimétrica en \"cortina\". Es altamente prevalente en pacientes con miopía magna debido al adelgazamiento periférico de su retina. El tipo traccional es clásico de la retinopatía diabética proliferativa.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA BILIAR",
    "subtema": "CÁNCER DE VESÍCULA BILIAR",
    "difficulty": "alta",
    "case": "Femenina de 72 años de edad, originaria de un poblado rural, con historia de dolor crónico en hipocondrio derecho tolerado por años sin buscar atención médica. Acude a urgencias por presentar en el último mes pérdida de peso no intencionada de 8 kg, ictericia progresiva, prurito y dolor constante en el cuadrante superior derecho que ya no cede con analgésicos comunes. A la exploración física, destaca tinte ictérico en piel y escleras. A la palpación abdominal, se percibe una masa dura, fija y mal definida en el lecho vesicular, así como hepatomegalia leve.",
    "questions": [
      {
        "question": "De acuerdo con la epidemiología de esta neoplasia (que es el cáncer del tracto biliar más frecuente), ¿cuál es el factor de riesgo más fuertemente asociado y prevalente para el desarrollo del cáncer de vesícula biliar, presente en más del 80% de los pacientes diagnosticados?",
        "options": [
          "Infección crónica por el virus de la hepatitis C",
          "Consumo de alcohol crónico",
          "Colelitiasis crónica (especialmente con litos mayores a 3 cm)",
          "Pólipos vesiculares de colesterol menores a 5 mm"
        ],
        "answerIndex": 2,
        "explanation": "La presencia de cálculos biliares de larga evolución (colelitiasis crónica) es el factor de riesgo más importante para el cáncer de vesícula biliar. La irritación mecánica y la inflamación crónica continua que provocan los litos (especialmente los grandes, >3 cm) inducen displasia de la mucosa que eventualmente progresa a un carcinoma. La \"vesícula en porcelana\" (calcificación de la pared) es otro factor de muy alto riesgo que también es consecuencia de la inflamación crónica litiásica.",
        "gpcReference": ""
      },
      {
        "question": "Si se realiza una biopsia de la lesión o tras la resección quirúrgica, ¿cuál es la estirpe histológica más frecuente de esta neoplasia maligna?",
        "options": [
          "Carcinoma de células escamosas",
          "Adenocarcinoma",
          "Tumor neuroendocrino",
          "Linfoma MALT"
        ],
        "answerIndex": 1,
        "explanation": "Aproximadamente el 85-90% de los cánceres de la vesícula biliar son adenocarcinomas, originados en el epitelio glandular de la mucosa biliar. Suelen ser muy agresivos y, debido a su presentación clínica tardía (cuando ya hay invasión hepática o ictericia por obstrucción de la vía biliar principal), tienen un pronóstico muy sombrío.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA ESOFÁGICA",
    "subtema": "ACALASIA",
    "difficulty": "alta",
    "case": "Masculino de 42 años acude a consulta externa de gastroenterología refiriendo dificultad progresiva para la deglución (disfagia) de 2 años de evolución. Menciona de manera característica que la disfagia se presenta tanto con alimentos sólidos como con líquidos desde el inicio del cuadro. Además, refiere episodios frecuentes de regurgitación de alimentos no digeridos (sin sabor ácido), especialmente por las noches al acostarse, lo que le ha provocado tos nocturna. Ha perdido 6 kg de peso en el último año.",
    "questions": [
      {
        "question": "Se le solicita un esofagograma con trago de bario como abordaje inicial. ¿Cuál es la imagen radiológica clásica y sugerente de esta patología motora que se espera encontrar en el estudio?",
        "options": [
          "Esófago en \"sacacorchos\"",
          "Dilatación esofágica con terminación afilada en \"pico de pájaro\" o \"cola de ratón\"",
          "Defecto de llenado irregular tipo \"corazón de manzana\"",
          "Herniación de la cámara gástrica por encima del diafragma"
        ],
        "answerIndex": 1,
        "explanation": "La imagen en \"pico de pájaro\" o \"cola de ratón\" en la unión esofagogástrica es el hallazgo radiológico clásico de la acalasia. Se produce por la dilatación masiva del cuerpo esofágico (que pierde su peristalsis) y el estrechamiento distal liso y simétrico causado por la falta de relajación del esfínter esofágico inferior (EEI) al paso del contraste.",
        "gpcReference": ""
      },
      {
        "question": "Aunque el esofagograma y la endoscopia (para descartar pseudoacalasia por cáncer) son obligatorios, ¿cuál es el estudio considerado el estándar de oro para confirmar definitivamente el diagnóstico de acalasia?",
        "options": [
          "Manometría esofágica de alta resolución",
          "pH-metría de 24 horas",
          "Tomografía computarizada de tórax",
          "Gammagrafía de vaciamiento esofágico"
        ],
        "answerIndex": 0,
        "explanation": "La manometría esofágica es el estándar de oro. Para diagnosticar acalasia clásica, la manometría debe demostrar dos alteraciones fundamentales: 1) Aperistalsis (ausencia de contracciones peristálticas normales en el cuerpo esofágico) y 2) Relajación incompleta o ausente del Esfínter Esofágico Inferior (EEI) en respuesta a la deglución.",
        "gpcReference": ""
      },
      {
        "question": "Considerando que el paciente es joven y es un buen candidato quirúrgico, ¿cuál es el tratamiento definitivo de elección que ofrece los mejores resultados a largo plazo según la GPC?",
        "options": [
          "Inyección endoscópica de toxina botulínica en el EEI",
          "Esofagectomía total",
          "Miotomía laparoscópica de Heller complementada con una funduplicatura parcial (tipo Dor o Toupet)",
          "Dilatación neumática con balón como terapia única de por vida"
        ],
        "answerIndex": 2,
        "explanation": "La miotomía de Heller por vía laparoscópica (sección quirúrgica de las fibras musculares del EEI) es el tratamiento de elección para pacientes jóvenes con bajo riesgo quirúrgico, ya que proporciona un alivio duradero de la disfagia. Siempre debe acompañarse de un procedimiento antirreflujo parcial (funduplicatura de Dor o Toupet) para evitar el reflujo gastroesofágico severo secundario a la destrucción del esfínter.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "UROLOGÍA P1",
    "subtema": "HIPERPLASIA PROSTÁTICA BENIGNA (HPB)",
    "difficulty": "baja",
    "case": "Masculino de 68 años acude a su unidad de medicina familiar quejándose de síntomas del tracto urinario inferior (LUTS) de varios años de evolución. Refiere que el chorro de su orina es débil e intermitente, tiene que hacer esfuerzo (pujo) para iniciar la micción, siente que no vacía por completo la vejiga y se levanta hasta 4 veces por la noche a orinar (nicturia). Su puntaje en la escala IPSS es de 18 (síntomas moderados a severos). A la exploración, el tacto rectal revela una próstata aumentada de tamaño (grado III), de consistencia ahulada, lisa, simétrica y sin nódulos palpables. Su Antígeno Prostático Específico (APE) es de 2.5 ng/mL.",
    "questions": [
      {
        "question": "De acuerdo con la GPC, para el manejo farmacológico inicial de este paciente con una próstata visiblemente aumentada de tamaño y síntomas molestos, se decide iniciar una terapia combinada. ¿Cuál es la familia de fármacos que actúa reduciendo el tamaño y volumen de la glándula prostática a mediano plazo y previene la progresión de la enfermedad (retención aguda de orina)?",
        "options": [
          "Alfabloqueadores (ej. Tamsulosina)",
          "Inhibidores de la 5-alfa reductasa (ej. Finasterida o Dutasterida)",
          "Antimuscarínicos (ej. Oxibutinina)",
          "Inhibidores de la fosfodiesterasa tipo 5 (ej. Tadalafilo)"
        ],
        "answerIndex": 1,
        "explanation": "Los inhibidores de la 5-alfa reductasa (Finasterida/Dutasterida) bloquean la conversión de testosterona a dihidrotestosterona (DHT), el andrógeno responsable del crecimiento prostático. Tardan meses en hacer efecto, pero son los únicos que reducen el tamaño de la próstata (hasta en un 20-30%) y modifican la historia natural de la enfermedad. Los alfabloqueadores (Tamsulosina) relajan el músculo liso para un alivio sintomático rápido (días), pero no encogen la glándula. La terapia combinada es la elección en próstatas grandes (>30-40 cc).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "CIRUGÍA ONCOLOGÍA",
    "subtema": "CÁNCER DE MAMA",
    "difficulty": "media",
    "case": "Femenina de 55 años de edad, nulípara, con menopausia a los 53 años. Acude a consulta porque hace dos semanas, al bañarse, notó una \"bolita\" en su seno derecho. A la exploración física, las mamas son asimétricas. En el cuadrante superoexterno de la mama derecha se palpa un nódulo de 3 cm, de consistencia pétrea, bordes irregulares, fijo a planos profundos y completamente indoloro. A la inspección, se observa retracción de la piel suprayacente y un área con aspecto de \"piel de naranja\". Se palpan adenopatías axilares ipsilaterales duras y no dolorosas.",
    "questions": [
      {
        "question": "Por la edad de la paciente (>40 años) y los hallazgos clínicos altamente sospechosos de malignidad, ¿cuál es el estudio de imagen inicial de elección según la Norma Oficial Mexicana y la GPC para evaluar esta masa y la mama contralateral?",
        "options": [
          "Ultrasonido mamario bilateral",
          "Resonancia Magnética de mamas",
          "Mastografía (Mamografía) bilateral diagnóstica",
          "Tomografía por Emisión de Positrones (PET-CT)"
        ],
        "answerIndex": 2,
        "explanation": "La mastografía bilateral (idealmente con proyecciones adicionales o tomosíntesis si es diagnóstica) es el estudio de imagen de elección inicial (Gold Standard) para toda mujer sintomática o con hallazgos a la exploración mayor de 40 años. El ultrasonido es el estudio complementario para caracterizar nódulos sólidos vs. quísticos, y es el estudio inicial solo en mujeres menores de 35-40 años por la densidad del tejido mamario.",
        "gpcReference": ""
      },
      {
        "question": "Se realiza una biopsia con aguja de corte (trucut) guiada por ultrasonido. ¿Cuál es el subtipo histológico más frecuente del cáncer de mama, responsable de aproximadamente el 80% de los casos invasivos?",
        "options": [
          "Carcinoma lobulillar invasivo",
          "Carcinoma ductal infiltrante (invasivo) no especificado",
          "Enfermedad de Paget del pezón",
          "Carcinoma inflamatorio"
        ],
        "answerIndex": 1,
        "explanation": "El carcinoma ductal infiltrante (ahora llamado carcinoma invasivo de tipo no especial - NST) es, por mucho, la estirpe histológica más común de cáncer de mama. El carcinoma lobulillar invasivo es el segundo en frecuencia (10-15%) y se caracteriza por ser frecuentemente bilateral y multicéntrico.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "TRAUMA GENERALIDADES Y COMPLICACIONES",
    "subtema": "PROFILAXIS ANTITETÁNICA",
    "difficulty": "baja",
    "case": "Masculino de 35 años, trabajador agrícola, acude al servicio de urgencias rurales tras haber pisado accidentalmente un clavo oxidado y sucio con tierra y heces de animales mientras limpiaba un establo. La herida punzante en la planta del pie derecho tiene 3 cm de profundidad. Al interrogar sobre sus antecedentes de vacunación, el paciente refiere no haber recibido ninguna vacuna desde la infancia (\"esquema de vacunación desconocido\"). La herida se lava exhaustivamente en urgencias y se retira el tejido necrótico.",
    "questions": [
      {
        "question": "De acuerdo con la GPC y los lineamientos de inmunización, ante una herida considerada \"sucia o propensa a tétanos\" en un paciente con esquema de vacunación desconocido o incompleto (< 3 dosis), ¿cuál es la profilaxis antitetánica indicada?",
        "options": [
          "Aplicación exclusiva de la vacuna (Toxoide tetánico - Td)",
          "Aplicación exclusiva de Inmunoglobulina Antitetánica Humana (IgT)",
          "Aplicación simultánea de la vacuna (Toxoide tetánico - Td) y la Inmunoglobulina Antitetánica Humana (IgT) en sitios anatómicos diferentes",
          "Ninguna, solo manejo con antibióticos y lavado"
        ],
        "answerIndex": 2,
        "explanation": "En un paciente con esquema de vacunación contra el tétanos desconocido o menor a 3 dosis, la conducta depende del tipo de herida. Si la herida es limpia y menor, solo se aplica la vacuna (Toxoide/Td). Pero si la herida es sucia, punzante, contaminada con tierra/heces o tiene tejido desvitalizado (como en este caso, una herida de altísimo riesgo tetanógeno), se debe realizar profilaxis pasivo-activa simultánea: administrar la vacuna (Td) para iniciar la memoria inmunológica y la Inmunoglobulina Antitetánica (IgT) para neutralizar de inmediato cualquier toxina circulante.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA DIVERTICULAR",
    "subtema": "DIVERTICULITIS",
    "difficulty": "alta",
    "case": "Masculino de 62 años, con obesidad grado I y dieta baja en fibra, acude a urgencias por presentar dolor abdominal continuo de 3 días de evolución, localizado primariamente en la fosa ilíaca izquierda, acompañado de fiebre de 38.5°C, náuseas, vómito en una ocasión y alteraciones en el hábito intestinal (estreñimiento). A la exploración física, el paciente luce agudamente enfermo, taquicárdico (110 lpm). El abdomen es doloroso a la palpación profunda en el cuadrante inferior izquierdo, con resistencia muscular y signo de rebote (Blumberg) francamente positivo en esa área. Sus laboratorios reportan leucocitosis de 16,000/mm³ con desviación a la izquierda.",
    "questions": [
      {
        "question": "Ante la alta sospecha de una diverticulitis aguda complicada, ¿cuál es el estudio de imagen de elección (estándar de oro) que debe solicitarse para confirmar el diagnóstico, clasificar la severidad y planear el tratamiento?",
        "options": [
          "Colonoscopia de urgencia",
          "Radiografía simple de abdomen en bipedestación",
          "Tomografía computarizada (TAC) de abdomen y pelvis con contraste",
          "Ultrasonido abdominal"
        ],
        "answerIndex": 2,
        "explanation": "La TAC abdominal y pélvica contrastada es el estudio de elección para la diverticulitis aguda. Permite confirmar el diagnóstico, evaluar la extensión de la inflamación pericólica y detectar complicaciones (abscesos, perforación libre, fístulas), estadificando la enfermedad según la clasificación de Hinchey. La colonoscopia está absolutamente contraindicada en el cuadro agudo por el altísimo riesgo de perforar el colon inflamado.",
        "gpcReference": ""
      },
      {
        "question": "La TAC revela engrosamiento de la pared del colon sigmoides, inflamación de la grasa pericólica y la presencia de un absceso pélvico (distante al sitio de la inflamación primaria) de 6 centímetros de diámetro. No hay evidencia de gas libre ni peritonitis generalizada. De acuerdo con la clasificación tomográfica de Hinchey, ¿en qué estadio se encuentra este paciente?",
        "options": [
          "Hinchey I",
          "Hinchey II",
          "Hinchey III",
          "Hinchey IV"
        ],
        "answerIndex": 1,
        "explanation": "La clasificación de Hinchey modificada evalúa los hallazgos tomográficos y quirúrgicos: Hinchey I (absceso pericólico localizado o flemón); Hinchey II (absceso pélvico, intrabdominal distante o retroperitoneal); Hinchey III (peritonitis purulenta generalizada); Hinchey IV (peritonitis fecaloidea). La presencia de un absceso pélvico distante de 6 cm corresponde a un estadio II.",
        "gpcReference": ""
      },
      {
        "question": "Con base en la GPC para el manejo de la diverticulitis Hinchey II con un absceso mayor a 4-5 cm, ¿cuál es el manejo terapéutico inicial de elección para evitar una cirugía de urgencia con estoma?",
        "options": [
          "Antibioticoterapia intravenosa exclusiva y observación",
          "Drenaje percutáneo guiado por imagen (TAC o USG) más antibióticos IV",
          "Resección de sigmoides con anastomosis primaria inmediata",
          "Procedimiento de Hartmann de urgencia"
        ],
        "answerIndex": 1,
        "explanation": "Para los abscesos mayores a 4-5 cm (frecuentes en Hinchey II y algunos Hinchey Ib), el tratamiento de elección es el drenaje percutáneo guiado por imagen apoyado por antibióticos intravenosos. Esto permite controlar el foco séptico de manera mínimamente invasiva, \"enfriando\" el cuadro para poder realizar una resección electiva con anastomosis primaria semanas después, evitando así una colostomía de urgencia.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "INTRODUCCIÓN OFTALMOLOGÍA",
    "subtema": "GLAUCOMA",
    "difficulty": "media",
    "case": "Femenina de 65 años, hipermétrope. Es llevada a urgencias oftalmológicas por inicio súbito (hace 2 horas) de dolor ocular derecho insoportable, hemicraneal, acompañado de náuseas intensas y vómito. Refiere que su visión se tornó muy borrosa y ve \"halos de colores\" alrededor de las luces. A la exploración, el ojo derecho presenta inyección ciliar severa (ojo rojo). La pupila está en midriasis media y fija (arreactiva a la luz). La córnea se observa opaca, deslustrada (edema corneal). A la palpación bidigital, el globo ocular derecho se siente extremadamente duro, \"como una canica de vidrio\".",
    "questions": [
      {
        "question": "Por la presentación aguda, dolorosa y los hallazgos en la exploración física, ¿cuál es el diagnóstico clínico de emergencia?",
        "options": [
          "Uveítis anterior aguda",
          "Glaucoma primario de ángulo abierto",
          "Glaucoma agudo de ángulo cerrado",
          "Endoftalmitis endógena"
        ],
        "answerIndex": 2,
        "explanation": "El glaucoma agudo de ángulo cerrado es una emergencia oftalmológica caracterizada por el bloqueo súbito del drenaje del humor acuoso, elevando la presión intraocular a niveles muy altos (a menudo >50 mmHg). Esto causa dolor extremo, náuseas, edema corneal (visión borrosa y halos), pupila en midriasis media fija (por isquemia del esfínter del iris) y un ojo duro a la palpación. El glaucoma de ángulo abierto, por el contrario, es crónico, indoloro y asintomático hasta etapas finales.",
        "gpcReference": ""
      },
      {
        "question": "Tras el manejo médico agudo inicial (manitol IV, acetazolamida oral, pilocarpina y betabloqueadores tópicos) para romper el bloqueo y disminuir la presión intraocular, ¿cuál es el tratamiento quirúrgico definitivo de elección para prevenir recurrencias en este ojo y como profilaxis en el ojo contralateral?",
        "options": [
          "Trabeculectomía quirúrgica",
          "Iridotomía periférica con láser Nd:YAG",
          "Colocación de válvula de Ahmed",
          "Enucleación del globo ocular"
        ],
        "answerIndex": 1,
        "explanation": "Una vez controlada la crisis hipertensiva aguda, el tratamiento definitivo y preventivo (incluso para el ojo sano, por predisposición anatómica) es la iridotomía periférica con láser. Este procedimiento crea un pequeño orificio en el iris periférico, estableciendo una vía de comunicación alternativa para que el humor acuoso pase de la cámara posterior a la anterior, puenteando el bloqueo pupilar.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "UROLOGÍA P1",
    "subtema": "TORSIÓN TESTICULAR",
    "difficulty": "media",
    "case": "Masculino de 14 años es traído a urgencias durante la madrugada. Refiere inicio súbito de dolor escrotal derecho de extrema intensidad que lo despertó del sueño, irradiado a la región inguinal y abdominal baja, acompañado de náuseas. No hay antecedentes de trauma ni síntomas urinarios. A la exploración física, el testículo derecho está aumentado de tamaño, indurado, eritematoso y se encuentra ascendido en el escroto con un eje transversal (horizontalizado). El reflejo cremastérico derecho está ausente. Al elevar manualmente el testículo derecho, el dolor del paciente no disminuye, e incluso parece empeorar (Signo de Prehn negativo).",
    "questions": [
      {
        "question": "Dado el cuadro clínico agudo en un adolescente y los hallazgos exploratorios patognomónicos, ¿cuál es el diagnóstico de presunción que constituye una verdadera urgencia urológica?",
        "options": [
          "Epididimitis aguda",
          "Torsión testicular",
          "Orquitis viral (parotiditis)",
          "Hernia inguinal encarcelada"
        ],
        "answerIndex": 1,
        "explanation": "La torsión testicular clásica ocurre en adolescentes. Se presenta con dolor escrotal súbito e intenso, frecuentemente durante el sueño. Los signos clínicos cardinales son: testículo ascendido y horizontalizado (deformidad en badajo de campana), pérdida del reflejo cremastérico ipsilateral y un signo de Prehn negativo (la elevación del testículo no alivia el dolor, a diferencia de la epididimitis donde sí suele aliviarlo [Prehn positivo]).",
        "gpcReference": ""
      },
      {
        "question": "Ante la altísima sospecha clínica de esta entidad y considerando que la viabilidad del testículo disminuye drásticamente después de las primeras 6 horas, ¿cuál es la conducta médica inicial más apropiada si el ultrasonido Doppler no está disponible inmediatamente en los próximos 20 minutos?",
        "options": [
          "Administrar antibióticos intravenosos empíricos y analgésicos",
          "Diferir el manejo hasta conseguir el ultrasonido Doppler institucional",
          "Exploración quirúrgica de urgencia inmediata para destorsión y orquidopexia bilateral",
          "Intentar reducción manual exclusiva en urgencias y dar de alta"
        ],
        "answerIndex": 2,
        "explanation": "El \"tiempo es testículo\". La torsión testicular es una urgencia quirúrgica absoluta. Si el cuadro clínico es clásico, no se debe retrasar la cirugía esperando un ultrasonido Doppler. La conducta correcta es la exploración escrotal quirúrgica urgente para destorcer el cordón espermático, evaluar la viabilidad y realizar orquidopexia (fijación) bilateral (ya que el defecto anatómico suele ser bilateral).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "TRAUMA GENERALIDADES Y COMPLICACIONES",
    "subtema": "ATB EN TRAUMA Y PROFILAXIS QX",
    "difficulty": "baja",
    "case": "Femenina de 45 años, programada para una colecistectomía laparoscópica electiva por colelitiasis sintomática (cólicos biliares de repetición), sin datos actuales de colecistitis aguda o infección de vías biliares. El procedimiento se considera una cirugía limpia-contaminada, por lo que se decide indicar profilaxis antibiótica perioperatoria con Cefazolina intravenosa.",
    "questions": [
      {
        "question": "De acuerdo con la GPC y los estándares de seguridad quirúrgica para la prevención de infecciones del sitio quirúrgico, ¿cuál es el momento ideal y exacto en el que debe administrarse la dosis de este antibiótico profiláctico?",
        "options": [
          "Tres días antes de la intervención quirúrgica",
          "En los primeros 60 minutos previos a la incisión quirúrgica (idealmente durante la inducción anestésica)",
          "Exclusivamente al finalizar el cierre de la piel en quirófano",
          "24 horas después de la cirugía en piso de hospitalización"
        ],
        "answerIndex": 1,
        "explanation": "El objetivo de la profilaxis antibiótica es lograr concentraciones bactericidas tisulares y séricas adecuadas al momento en que se abre la piel. Para lograr esto con la mayoría de los antibióticos (como las cefalosporinas), la dosis debe administrarse de manera intravenosa dentro de los 60 minutos previos a la incisión cutánea. Darlo mucho antes o después de iniciada la cirugía pierde su eficacia profiláctica.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA DE EXTREMIDAD SUPERIOR",
    "subtema": "Fx de clavicula",
    "difficulty": "baja",
    "case": "Masculino de 20 años sufre una caída lateral sobre el hombro derecho mientras andaba en bicicleta. Acude a urgencias sosteniendo su brazo derecho pegado al cuerpo con su mano izquierda. Refiere dolor intenso y limitación funcional de la extremidad superior derecha. A la exploración física, se observa una evidente deformidad, aumento de volumen, equimosis y crepitación ósea a la palpación en la región clavicular derecha.",
    "questions": [
      {
        "question": "Teniendo en cuenta la anatomía biomecánica de este hueso y la epidemiología traumatológica, ¿en qué porción anatómica de la clavícula se localiza la gran mayoría (aproximadamente 80%) de estas fracturas?",
        "options": [
          "Tercio distal (lateral)",
          "Tercio proximal (medial)",
          "Tercio medio (diáfisis)",
          "Articulación esternoclavicular"
        ],
        "answerIndex": 2,
        "explanation": "Aproximadamente el 80% de todas las fracturas de clavícula ocurren en el tercio medio (diafisiarias). Esta región es la más vulnerable debido a que es la zona de transición anatómica donde la clavícula cambia su curvatura, carece de protección muscular y ligamentaria fuerte, y es el punto donde se concentran las fuerzas de compresión axial transmitidas desde el hombro durante las caídas. El tratamiento suele ser conservador (cabestrillo o vendaje en 8) si no hay gran desplazamiento.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "CIRUGÍA ONCOLOGÍA",
    "subtema": "CÁNCER DE TIROIDES",
    "difficulty": "media",
    "case": "Femenina de 35 años, sin antecedentes familiares de importancia ni exposición a radiación, acude a consulta por notar un aumento de volumen en la región anterior del cuello de crecimiento lento durante los últimos 6 meses. Se encuentra asintomática, negando disfagia, disfonía o síntomas de hipertiroidismo. A la exploración física, se palpa un nódulo tiroideo en el lóbulo derecho, de aproximadamente 3 cm, de consistencia firme, no doloroso y móvil a la deglución. Las pruebas de función tiroidea (TSH y T4 libre) se reportan dentro de rangos normales. Se solicita un ultrasonido de cuello que reporta un nódulo sólido, hipoecoico, de márgenes irregulares y con presencia de microcalcificaciones.",
    "questions": [
      {
        "question": "Por las características ecográficas de alta sospecha, se realiza una Biopsia por Aspiración con Aguja Fina (BAAF). El reporte citológico describe la presencia de células con núcleos ópticamente claros, vacíos, con inclusiones citoplasmáticas intranucleares e hendiduras longitudinales. ¿Qué nombre clásico reciben estos hallazgos nucleares patognomónicos?",
        "options": [
          "Células de Hürthle",
          "Cuerpos de psamoma",
          "Núcleos en \"ojo de la huerfanita Annie\"",
          "Células en \"anillo de sello\""
        ],
        "answerIndex": 2,
        "explanation": "Los núcleos ópticamente claros o vacíos, conocidos clásicamente como núcleos en \"ojo de la huerfanita Annie\" (Orphan Annie eyes), junto con los cuerpos de psamoma, son los hallazgos citológicos y patológicos patognomónicos del carcinoma papilar de tiroides, que es la neoplasia maligna más frecuente del sistema endocrino.",
        "gpcReference": ""
      },
      {
        "question": "Confirmado el diagnóstico de carcinoma papilar de tiroides, ¿cuál es la vía de diseminación metastásica primaria y más frecuente de esta estirpe histológica en particular, que justifica la evaluación intraoperatoria de los compartimentos del cuello?",
        "options": [
          "Diseminación hematógena hacia pulmón y hueso",
          "Diseminación linfática hacia los ganglios cervicales",
          "Extensión local hacia la tráquea exclusivamente",
          "Siembra peritoneal"
        ],
        "answerIndex": 1,
        "explanation": "El carcinoma papilar de tiroides (el más frecuente y de mejor pronóstico) tiene una fuerte predilección por la diseminación por vía linfática hacia los ganglios linfáticos regionales del cuello (compartimento central y laterocervical), presentándose con metástasis ganglionares hasta en un 30-40% de los casos al diagnóstico. En contraste, el carcinoma folicular se disemina primariamente por vía hematógena (hueso, pulmón).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "HERNIAS / ESPLENECTOMÍA",
    "subtema": "HERNIA INGUINAL",
    "difficulty": "baja",
    "case": "Masculino de 45 años, de ocupación cargador en la central de abastos. Acude a la consulta externa quejándose de la aparición de un \"bulto\" en la región inguinal derecha que aumenta de tamaño al final del día laboral o al cargar objetos pesados, y que desaparece al acostarse. A la exploración física en bipedestación, se le pide al paciente que realice la maniobra de Valsalva, observándose la protrusión de una masa en la región inguinocrural derecha. Al realizar la exploración digital del conducto inguinal, el médico percibe que la hernia protruye rozando la punta de su dedo (bajando por el canal) y, ecográficamente, se confirma que el defecto tiene su origen lateral a los vasos epigástricos inferiores.",
    "questions": [
      {
        "question": "De acuerdo con los límites anatómicos (Triángulo de Hesselbach) y el origen lateral respecto a los vasos epigástricos inferiores, ¿cuál es el diagnóstico anatómico correcto de esta hernia?",
        "options": [
          "Hernia inguinal directa",
          "Hernia femoral",
          "Hernia inguinal indirecta",
          "Hernia obturatriz"
        ],
        "answerIndex": 2,
        "explanation": "La relación anatómica clave para clasificar las hernias inguinales es su posición respecto a los vasos epigástricos inferiores. Las hernias que protruyen por fuera (lateral) de los vasos epigástricos a través del anillo inguinal profundo y descienden por el conducto inguinal son hernias indirectas (las más frecuentes en todas las edades). Las que protruyen por dentro (medial) de los vasos, directamente a través de un defecto en la fascia transversal (Triángulo de Hesselbach), son hernias directas. Shutterstock Explorar",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "UROLOGÍA P2",
    "subtema": "CÁNCER UROTELIAL Y TESTICULAR",
    "difficulty": "alta",
    "case": "Masculino de 65 años, trabajador jubilado de una fábrica de pinturas y fumador crónico (índice tabáquico de 40 paquetes/año). Acude a consulta urológica refiriendo que, en las últimas tres semanas, ha notado que su orina es de color rojo franco y en ocasiones presenta coágulos. Menciona que este sangrado es completamente indoloro y no se acompaña de ardor, fiebre, ni molestias para orinar (disuria). Su tacto rectal reporta una próstata grado I, lisa y sin nódulos. Un examen general de orina confirma la presencia de hematuria macroscópica masiva sin datos de infección (nitritos y leucocitosis negativos).",
    "questions": [
      {
        "question": "De acuerdo con la epidemiología urológica, ¿cuál es el diagnóstico más importante que se debe sospechar y descartar de manera urgente ante el cuadro de hematuria macroscópica indolora en un paciente mayor y fumador?",
        "options": [
          "Hiperplasia prostática benigna",
          "Litiasis coraliforme",
          "Cáncer urotelial de vejiga",
          "Prostatitis crónica"
        ],
        "answerIndex": 2,
        "explanation": "Toda hematuria macroscópica indolora en pacientes mayores de 50 años (especialmente si son fumadores o están expuestos a aminas aromáticas/tintes) debe considerarse como un cáncer de vejiga (carcinoma urotelial o de células transicionales) hasta demostrar lo contrario. El tabaquismo es el factor de riesgo más importante (responsable del 50% de los casos).",
        "gpcReference": ""
      },
      {
        "question": "Para confirmar el diagnóstico, evaluar la anatomía de las vías urinarias bajas y, si es posible, tomar una biopsia o realizar la resección de la lesión, ¿cuál es el estudio endoscópico de primera elección y estándar de oro a solicitar?",
        "options": [
          "Ultrasonido pélvico suprapúbico",
          "Tomografía computarizada simple de abdomen",
          "Cistoscopia (Uretrocistoscopia)",
          "Resonancia magnética multiparamétrica de pelvis"
        ],
        "answerIndex": 2,
        "explanation": "La cistoscopia flexible o rígida es el estándar de oro para el diagnóstico del cáncer de vejiga. Permite la visualización directa de la mucosa vesical, la identificación del tumor (usualmente de aspecto papilar o \"en coliflor\") y la toma de biopsias o la resección transuretral del tumor de vejiga (RTUV) para el diagnóstico histopatológico definitivo.",
        "gpcReference": ""
      },
      {
        "question": "La cistoscopia revela un tumor papilar friable de 3 cm en la pared lateral izquierda. Se realiza una Resección Transuretral de Vejiga (RTUV) completa. El reporte de patología indica un \"Carcinoma Urotelial Papilar de Alto Grado, no músculo-invasivo (T1)\". Según las guías internacionales, ¿cuál es el tratamiento adyuvante intravesical de elección para disminuir el altísimo riesgo de recurrencia y progresión en tumores de alto grado no invasivos?",
        "options": [
          "Radioterapia externa a dosis totales",
          "Cistectomía radical inmediata",
          "Instilación intravesical del bacilo de Calmette-Guérin (BCG)",
          "Quimioterapia sistémica con Cisplatino"
        ],
        "answerIndex": 2,
        "explanation": "Para el cáncer de vejiga no músculo-invasivo (estadios Ta, T1, o CIS) de alto riesgo, el tratamiento estándar post-RTUV es la inmunoterapia intravesical con la vacuna BCG (Bacilo de Calmette-Guérin). Esta terapia estimula una reacción inmunitaria e inflamatoria masiva localizada en la mucosa vesical que destruye las células cancerosas residuales, reduciendo significativamente la tasa de recurrencia y la progresión hacia un cáncer músculo-invasivo.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA DE EXTREMIDAD INFERIOR",
    "subtema": "Fx de cadera",
    "difficulty": "media",
    "case": "Femenina de 82 años, con diagnóstico de osteoporosis severa. Sufre una caída desde su propia altura al resbalar en el baño, golpeándose directamente sobre el trocánter mayor derecho. Es traída a urgencias quejándose de dolor intenso en la ingle derecha e incapacidad absoluta para deambular o mover la extremidad. A la inspección en la camilla, se observa la extremidad inferior derecha francamente acortada y en rotación externa evidente (el borde externo del pie toca la camilla). No hay exposición ósea ni heridas.",
    "questions": [
      {
        "question": "El cuadro clínico de acortamiento y rotación externa marcada tras una caída en una paciente anciana es patognomónico de una entidad traumatológica. ¿Cuál es el diagnóstico clínico más probable?",
        "options": [
          "Luxación posterior de cadera",
          "Fractura diafisiaria de fémur",
          "Fractura del extremo proximal del fémur (Fractura de cadera)",
          "Fractura de la rama isquiopúbica"
        ],
        "answerIndex": 2,
        "explanation": "La fractura de cadera (ya sea intracapsular como la de cuello femoral, o extracapsular como la intertrocantérica) presenta el cuadro clínico clásico de acortamiento y rotación externa de la extremidad. Esto se debe a la tracción sin oposición de los múscul os rotadores externos cortos y los músculos glúteos/psoas ilíaco que tiran del fragmento distal hacia arriba. Por el contrario, la luxación posterior de cadera se presenta clásicamente con la extremidad acortada pero en rotación interna (posición del bañista sorprendido).",
        "gpcReference": ""
      },
      {
        "question": "Se toma una radiografía de pelvis que confirma una fractura desplazada del cuello femoral derecho (fractura intracapsular transcervical). Debido a la precaria irrigación anatómica de esta zona en particular, ¿cuál es la complicación local tardía más temida y frecuente que dicta que en pacientes ancianos se prefiera colocar una prótesis en lugar de osteosíntesis (tornillos)?",
        "options": [
          "Síndrome compartimental del muslo",
          "Necrosis avascular (osteonecrosis) de la cabeza femoral",
          "Pseudoartrosis hipertrófica",
          "Tromboembolia pulmonar"
        ],
        "answerIndex": 1,
        "explanation": "Las fracturas del cuello femoral (intracapsulares) interrumpen el flujo sanguíneo retrógrado que aportan las arterias circunflejas femorales medial y lateral a la cabeza del fémur. Por ello, tienen un altísimo riesgo de desarrollar necrosis avascular y no unión (pseudoartrosis). Esta es la razón principal por la que en pacientes ancianos se prefiere retirar la cabeza isquémica y realizar una artroplastia (prótesis parcial o total de cadera) desde el inicio, permitiendo un apoyo y movilización inmediatos.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA INTESTINAL QX",
    "subtema": "OCLUSION INTESTINAL",
    "difficulty": "media",
    "case": "Masculino de 50 años, con antecedente de una apendicectomía abierta complicada por peritonitis hace 10 años. Acude a urgencias refiriendo dolor abdominal difuso de tipo cólico (intermitente) intenso, de 24 horas de evolución, acompañado de náuseas y vómitos de contenido fecaloide en repetidas ocasiones. Refiere imposibilidad para evacuar o canalizar gases desde que inició el dolor. A la exploración física, presenta abdomen distendido, timpánico a la percusión, con peristalsis aumentada (\"ruidos de lucha\") pero sin datos francos de irritación peritoneal (rebote negativo).",
    "questions": [
      {
        "question": "Se solicita una radiografía de abdomen en bipedestación que muestra múltiples niveles hidroaéreos en escalera y asas de intestino delgado dilatadas centralmente, con ausencia de gas en el colon y ámpula rectal. Dado este hallazgo y sus antecedentes quirúrgicos, ¿cuál es la causa más frecuente de este cuadro obstructivo a nivel mundial?",
        "options": [
          "Hernia inguinal encarcelada",
          "Vólvulo de sigmoides",
          "Adherencias postoperatorias (bridas)",
          "Cáncer colorrectal estenosante"
        ],
        "answerIndex": 2,
        "explanation": "La clínica (dolor cólico, vómito fecaloide, ausencia de gases) y la radiografía (dilatación de asas de intestino delgado con niveles hidroaéreos y ausencia de gas distal) son clásicas de una oclusión intestinal mecánica de intestino delgado. En pacientes con antecedente de cirugías abdominales previas (laparotomías), las adherencias o bridas peritoneales son, por mucho, la causa número uno de obstrucción del intestino delgado. En pacientes sin cirugías previas, las hernias encarceladas ocupan el primer lugar.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA PERIANAL",
    "subtema": "FISURA ANAL",
    "difficulty": "baja",
    "case": "Femenina de 30 años, con antecedente de estreñimiento crónico, acude a consulta quejándose de dolor anal extremo, lacerante y transfixiante que se presenta durante y minutos después de la defecación. La paciente refiere tener \"miedo a ir al baño\" por el intenso dolor, y menciona haber notado estrías de sangre roja brillante en el papel higiénico. A la exploración física cuidadosa (separando los glúteos), se observa un desgarro longitudinal en el epitelio escamoso del canal anal, localizado exactamente en la línea media posterior.",
    "questions": [
      {
        "question": "Debido a que la paciente refiere tener estos síntomas desde hace más de 8 semanas, se considera una fisura anal crónica. Además de la úlcera o desgarro en sí, ¿cuáles son los otros dos componentes anatómicos que conforman la clásica Tríada de Brodie?",
        "options": [
          "Hemorroide interna prolapsada y absceso interesfintérico",
          "Fístula perianal subcutánea y criptitis",
          "Pólipo centinela (en el margen distal) y papila anal hipertrófica (en el margen proximal)",
          "Colgajo cutáneo redundante y prolapso mucoso circunferencial"
        ],
        "answerIndex": 2,
        "explanation": "La fisura anal crónica (de más de 6-8 semanas de evolución) se acompaña típicamente de la Tríada de Brodie: 1) La fisura anal (úlcera con fibras del esfínter interno expuestas), 2) Una papila anal hipertrófica en el extremo proximal (hacia la línea dentada) y 3) Un colgajo cutáneo o \"pólipo centinela\" en el extremo distal (borde anal). La gran mayoría de las fisuras (90%) ocurren en la línea media posterior debido a la menor perfusión sanguínea en esta zona.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "CIRUGÍA ONCOLOGÍA",
    "subtema": "CÁNCER GÁSTRICO",
    "difficulty": "alta",
    "case": "Masculino de 65 años, originario de una comunidad con alta ingesta de alimentos ahumados y salados, con tabaquismo crónico positivo. Acude a consulta por pérdida de peso no intencionada de 10 kg en 4 meses, saciedad temprana, astenia, adinamia y molestia sorda en el epigastrio. A la exploración física, el paciente presenta palidez de tegumentos. A la palpación de las cadenas ganglionares, destaca un nódulo indurado, fijo e indoloro en la fosa supraclavicular izquierda. Sus laboratorios de rutina muestran anemia microcítica hipocrómica (Hb 9.0 g/dL, VCM 72 fL).",
    "questions": [
      {
        "question": "El hallazgo exploratorio del ganglio palpable en la fosa supraclavicular izquierda es un signo clásico de diseminación metastásica linfática de neoplasias intraabdominales (especialmente cáncer gástrico). ¿Qué epónimo recibe este signo clínico?",
        "options": [
          "Ganglio de la hermana María José",
          "Escudo de Blumer",
          "Ganglio de Irish",
          "Ganglio de Virchow"
        ],
        "answerIndex": 3,
        "explanation": "El Ganglio de Virchow es la adenopatía supraclavicular izquierda metastásica (ya que en ese lado desemboca el conducto torácico que recoge la linfa del abdomen). Otros signos de metástasis a distancia en cáncer gástrico incluyen: Ganglio de la hermana María José (nódulo periumbilical), Escudo de Blumer (masa palpable en el fondo de saco de Douglas al tacto rectal), Tumor de Krukenberg (metástasis a ovarios) y Ganglio de Irish (ganglio axilar anterior izquierdo).",
        "gpcReference": ""
      },
      {
        "question": "Se realiza una endoscopia superior que revela una gran lesión ulcerada con bordes irregulares y elevados en el cuerpo gástrico. Las biopsias confirman un adenocarcinoma. Según la clasificación histopatológica de Lauren, ¿cuál es el subtipo de adenocarcinoma gástrico que se caracteriza por formar estructuras glandulares, afectar a pacientes mayores, y estar fuertemente asociado a factores ambientales (dieta, H. pylori, metaplasia intestinal)?",
        "options": [
          "Subtipo difuso",
          "Subtipo intestinal",
          "Subtipo escamoso",
          "Subtipo mucinoso"
        ],
        "answerIndex": 1,
        "explanation": "La clasificación de Lauren divide al adenocarcinoma gástrico en dos tipos principales: El tipo intestinal (forma glándulas, se asocia fuertemente a factores ambientales y cascada de Correa [gastritis crónica -> atrofia -> metaplasia intestinal - > displasia -> cáncer], mejor pronóstico, diseminación hematógena) y el tipo difuso (no forma glándulas, afecta a jóvenes, se asocia al grupo sanguíneo A y mutaciones del gen CDH1/E-cadherina, tiene células en anillo de sello, diseminación linfática y peor pronóstico).",
        "gpcReference": ""
      },
      {
        "question": "Si durante el escrutinio se detectara un \"cáncer gástrico temprano\" (Early Gastric Cancer), el cual se define estrictamente como un tumor confinado a la mucosa o submucosa, sin importar el estado ganglionar. ¿Cuál sería el tratamiento curativo mínimamente  invasivo de elección si el tumor cumple con los criterios para no resección quirúrgica formal (confinado a la mucosa, < 2 cm, no ulcerado, tipo intestinal)?",
        "options": [
          "Gastrectomía total abierta con disección ganglionar D2",
          "Quimioterapia neoadyuvante exclusiva",
          "Resección endoscópica de la mucosa (REM) o Disección submucosa endoscópica (DSE)",
          "Derivación gastroyeyunal paliativa"
        ],
        "answerIndex": 2,
        "explanation": "El cáncer gástrico incipiente (temprano) detectado a tiempo (limitado a la mucosa, bien diferenciado, pequeño) tiene un riesgo de metástasis ganglionar casi nulo. En estos casos muy selectos, la resección o disección endoscópica (extirpar el tumor a través de la endoscopia sin necesidad de abrir el abdomen ni quitar el estómago) es el tratamiento curativo de elección, preservando por completo la función gástrica.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "TRAUMA GENERALIDADES Y COMPLICACIONES",
    "subtema": "CHOQUE HIPOVOLÉMICO HEMORRÁGICO",
    "difficulty": "media",
    "case": "Masculino de 35 años sufre amputación traumática de la pierna izquierda a nivel del tercio medio de la tibia tras quedar atrapado en maquinaria agrícola. A su ingreso a la sala de choque, los paramédicos han colocado un torniquete proximal funcional. El paciente se encuentra confuso y muy ansioso. Sus signos vitales muestran: FC 135 lpm, TA 85/50 mmHg, FR 32 rpm. La diuresis medida tras la colocación de sonda Foley es de 10 ml/h (oliguria).",
    "questions": [
      {
        "question": "Basado en los parámetros clínicos descritos por el ATLS (frecuencia cardíaca >120 lpm, hipotensión franca, confusión y taquipnea severa), ¿a qué clase de choque hemorrágico corresponde el estado del paciente, el cual implica una pérdida estimada del 31-40% de su volumen sanguíneo (aproximadamente 1,500 a 2,000 ml)?",
        "options": [
          "Choque Clase I",
          "Choque Clase II",
          "Choque Clase III",
          "Choque Clase IV"
        ],
        "answerIndex": 2,
        "explanation": "El ATLS clasifica el choque hemorrágico en 4 grados. La clave clínica principal del Clase III es la aparición franca de hipotensión sistólica (la presión arterial se mantiene normal en la clase I y II por mecanismos compensatorios), taquicardia >120 lpm, confusión mental y oliguria marcada, indicando una pérdida del 31 al 40% del volumen sanguíneo total. El Clase IV es pre-morten (FC >140, letargo/coma, anuria).",
        "gpcReference": ""
      },
      {
        "question": "Según la 10ª edición del ATLS, ¿cuál es la estrategia de reanimación hídrica inicial recomendada en este paciente para evitar la \"coagulopatía dilucional\" y la \"tríada letal\" del trauma?",
        "options": [
          "Infusión rápida de 3 a 4 litros de solución salina al 0.9%",
          "Reanimación de control de daños con inicio temprano de hemoderivados (sangre/plasma/plaquetas) y uso restrictivo de cristaloides (1 litro inicial)",
          "Infusión continua de coloides sintéticos exclusivamente",
          "Administración de vasopresores (Norepinefrina) como primera línea"
        ],
        "answerIndex": 1,
        "explanation": "El paradigma de reanimación ha cambiado. El ATLS actual desaconseja fuertemente la infusión masiva de cristaloides (>1.5L) porque diluye los factores de coagulación, causa hipotermia y empeora el sangrado (coagulopatía dilucional). La recomendación actual es la reanimación hemostática o de \"control de daños\": administrar un bolo inicial pequeño (1 litro) de cristaloides calentados (Ringer Lactato) e iniciar de forma temprana y balanceada la transfusión de sangre total o hemoderivados en proporción 1:1:1 (Paquetes globulares, plasma fresco congelado y plaquetas) para un paciente en choque Clase III o IV.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "INTRODUCCIÓN OFTALMOLOGÍA",
    "subtema": "RETINOBLASTOMA",
    "difficulty": "alta",
    "case": "Lactante masculino de 18 meses de edad, es traído a su primera revisión oftalmológica porque sus padres notaron desde hace un mes un \"brillo blanco\" en la pupila del ojo derecho del bebé, el cual se hace muy evidente cuando le toman fotografías con flash (ausencia del reflejo rojo normal). A la exploración física ocular, el ojo derecho presenta estrabismo convergente (endotropia) y se confirma mediante oftalmoscopia el reflejo pupilar blanco. No hay antecedentes heredofamiliares conocidos de cáncer ocular.",
    "questions": [
      {
        "question": "El hallazgo de leucocoria (pupila blanca) en un paciente pediátrico es el signo de presentación clínica más común (60% de los casos) de esta grave neoplasia intraocular maligna primaria. Desde el punto de vista de la biología molecular, el retinoblastoma se desarrolla por la mutación e inactivación de ambos alelos del gen supresor de tumores RB1. ¿En qué cromosoma se localiza este gen específico?",
        "options": [
          "Cromosoma 5q21",
          "Cromosoma 17p",
          "Cromosoma 13q14",
          "Cromosoma 11p13"
        ],
        "answerIndex": 2,
        "explanation": "El retinoblastoma es el tumor intraocular maligno primario más común en la infancia, presentándose clínicamente con leucocoria y estrabismo. Es el ejemplo clásico de la \"teoría del doble impacto\" (Two-Hit Hypothesis) de Knudson. La enfermedad se desarrolla por la inactivación o mutación de las dos copias del gen supresor de tumores RB1, el cual se encuentra localizado en el brazo largo del cromosoma 13, banda 14 (13q14).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "UROLOGÍA P2",
    "subtema": "CÁNCER DE PENE",
    "difficulty": "baja",
    "case": "Masculino de 65 años, no circuncidado, con tabaquismo crónico intenso. Acude a consulta urológica por presentar una lesión ulcerada y exofítica en el glande de 4 meses de evolución, la cual es indolora, indurada, de bordes evertidos y sangra fácilmente al roce de la ropa interior. Refiere secreción purulenta y fétida por debajo del prepucio (fimosis crónica). A la exploración física, además de la lesión descrita, se palpan adenopatías inguinales bilaterales duras y fijas.",
    "questions": [
      {
        "question": "Teniendo en cuenta los factores de riesgo (falta de circuncisión, fimosis crónica, tabaquismo y posible infección por VPH), ¿cuál es el tipo histológico que representa más del 95% de las neoplasias malignas de pene?",
        "options": [
          "Melanoma maligno",
          "Adenocarcinoma",
          "Carcinoma de células escamosas (epidermoide)",
          "Sarcoma de Kaposi"
        ],
        "answerIndex": 2,
        "explanation": "El carcinoma de células escamosas (epidermoide) es responsable del 95% de los cánceres de pene. Sus principales factores de riesgo son la falta de higiene (esmegma) secundaria a fimosis por no estar circuncidado, el tabaquismo y la infección por el Virus del Papiloma Humano (VPH), principalmente los serotipos 16 y 18.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA INTESTINAL QX",
    "subtema": "CÁNCER COLORRECTAL",
    "difficulty": "alta",
    "case": "Masculino de 72 años acude a consulta por referir pérdida de peso progresiva (8 kg en 3 meses), astenia, adinamia y cambios recientes en el hábito intestinal. El paciente menciona que sus evacuaciones se han vuelto muy delgadas (\"en forma de lápiz\") y ocasionalmente nota estrías de sangre roja oscura mezclada con las heces. Sus estudios de laboratorio revelan una anemia microcítica hipocrómica (Hb 10.2 g/dL).",
    "questions": [
      {
        "question": "Se solicita un colon por enema con doble contraste como parte del abordaje inicial por la falta de disponibilidad inmediata de colonoscopia. El estudio reporta una estenosis concéntrica severa y corta en el colon descendente con bordes \"colgantes\". ¿Qué nombre recibe este clásico signo radiológico, altamente sugestivo de un adenocarcinoma estenosante?",
        "options": [
          "Signo del grano de café",
          "Signo del pico de pájaro",
          "Signo de la \"manzana mordida\" (o corazón de manzana)",
          "Signo del apilamiento de monedas"
        ],
        "answerIndex": 2,
        "explanation": "El signo de la \"manzana mordida\" o \"corazón de manzana\" (apple-core lesion) en un colon por enema es la imagen clásica y patognomónica de un carcinoma colorrectal estenosante, típico del colon izquierdo (descendente y sigmoides). El tumor crece circunferencialmente estrechando la luz del colon, lo que explica la clínica de heces delgadas y la obstrucción progresiva.",
        "gpcReference": ""
      },
      {
        "question": "Tras confirmar el diagnóstico mediante colonoscopia y biopsia, el paciente es programado para tratamiento quirúrgico oncológico (Hemicolectomía izquierda radical). ¿Cuál es el marcador tumoral sérico de elección que debe solicitarse antes de la cirugía para establecer un valor basal y utilizarse posteriormente en el seguimiento postoperatorio para detectar recurrencias tempranas?",
        "options": [
          "CA 19-9",
          "Alfa-fetoproteína (AFP)",
          "Antígeno Carcinoembrionario (ACE)",
          "CA 125"
        ],
        "answerIndex": 2,
        "explanation": "El Antígeno Carcinoembrionario (ACE o CEA) es el marcador tumoral de elección para el cáncer colorrectal. No es útil como prueba de tamizaje diagnóstico debido a su baja sensibilidad y especificidad inicial, pero es fundamental para el seguimiento posquirúrgico, ya que su elevación progresiva tras una cirugía curativa es el primer indicador de una recurrencia local o metástasis a distancia.",
        "gpcReference": ""
      },
      {
        "question": "En el estudio de estadificación (Tomografía toracoabdominopélvica), el médico debe buscar intencionadamente la diseminación hematógena. Debido al drenaje venoso del colon a través del sistema porta, ¿cuál es el órgano que representa el sitio más frecuente de metástasis a distancia en el cáncer colorrectal?",
        "options": [
          "Cerebro",
          "Hueso",
          "Pulmón",
          "Hígado"
        ],
        "answerIndex": 3,
        "explanation": "El hígado es el sitio más común de metástasis a distancia en el cáncer colorrectal (ocurriendo hasta en un 50% de los pacientes en algún momento de su enfermedad). Esto se debe a que el retorno venoso del colon y recto superior drena directamente hacia la vena porta, filtrándose primero en el parénquima hepático.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "ATLS P1",
    "subtema": "VÍA AÉREA Y VENTILACIÓN",
    "difficulty": "media",
    "case": "Masculino de 28 años, motociclista que sufre accidente a alta velocidad impactando su rostro directamente contra el pavimento (no portaba casco cerrado). Ingresa a la sala de choque con Glasgow de 6, cianosis peribucal, y un traumatismo maxilofacial severo (fracturas panfaciales múltiples, sangrado activo profuso en cavidad oral y destrucción de la anatomía mandibular). La saturación de oxígeno es del 78%. El anestesiólogo intenta la intubación orotraqueal directa en dos ocasiones pero resulta imposible (\"no intubable, no ventilable\") debido a la hemorragia masiva y la pérdida de las referencias anatómicas.",
    "questions": [
      {
        "question": "Ante este escenario catastrófico de \"no intubable, no ventilable\" en un paciente con trauma maxilofacial masivo, ¿cuál es el manejo definitivo de la vía aérea de rescate que debe realizarse de extrema urgencia en la sala de choque, según el protocolo ATLS?",
        "options": [
          "Colocación de mascarilla laríngea",
          "Intubación nasotraqueal a ciegas",
          "Traqueostomía percutánea",
          "Cricotiroidotomía quirúrgica"
        ],
        "answerIndex": 3,
        "explanation": "La cricotiroidotomía quirúrgica (incisión a través de la membrana cricotiroidea para colocar un tubo) es el acceso quirúrgico de elección en una situación de emergencia vital donde no se puede ventilar con mascarilla ni intubar por vía oral, especialmente cuando hay un trauma maxilofacial severo, edema glótico o sangrado orofaríngeo masivo. Es mucho más rápida y segura de realizar en urgencias que una traqueostomía formal.",
        "gpcReference": ""
      },
      {
        "question": "Al realizar el abordaje inicial de la vía aérea (\"A\") en un paciente con trauma contuso severo, ¿cuál es la maniobra manual que está absolutamente contraindicada por el riesgo de seccionar la médula espinal ante una posible lesión de la columna cervical?",
        "options": [
          "Subluxación mandibular (tracción mandibular)",
          "Elevación del mentón",
          "Hiperextensión del cuello (maniobra frente-mentón)",
          "Colocación de collarín cervical rígido"
        ],
        "answerIndex": 2,
        "explanation": "En todo paciente traumatizado se asume una lesión de la columna cervical hasta demostrar lo contrario. La clásica maniobra de \"frente-mentón\" (hiperextensión del cuello) utilizada en el soporte vital básico está estrictamente contraindicada en trauma, ya que el movimiento del cuello puede desplazar una fractura cervical y seccionar la médula espinal. La maniobra indicada en trauma para abrir la vía aérea de forma segura es la tracción o subluxación mandibular, manteniendo la cabeza en posición neutra.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "INTRODUCCIÓN OFTALMOLOGÍA",
    "subtema": "RETINOPATÍA DEL PREMATURO",
    "difficulty": "media",
    "case": "Neonato prematuro nacido a las 27 semanas de gestación, con peso al nacer de 900 gramos. Durante su estancia en la Unidad de Cuidados Intensivos Neonatales (UCIN), cursó con Síndrome de Dificultad Respiratoria tipo 1 (Enfermedad de membrana hialina), requiriendo intubación orotraqueal y ventilación mecánica con fracciones inspiradas de oxígeno (FiO2) elevadas y fluctuantes durante 4 semanas para mantener la saturación por arriba del 90%.",
    "questions": [
      {
        "question": "Considerando sus factores de riesgo (prematurez extrema, bajo peso e hiperoxia), el paciente está en alto riesgo de desarrollar retinopatía del prematuro (ROP). Desde el punto de vista fisiopatológico, ¿qué provoca la exposición prolongada a altas concentraciones de oxígeno en la inmadura retina de este recién nacido?",
        "options": [
          "Hemorragia subhialoidea masiva inmediata",
          "Vasoconstricción retiniana severa inicial, seguida (al retirar el oxígeno) de hipoxia y proliferación vascular anómala (neovascularización)",
          "Desprendimiento traccional del epitelio pigmentario por depósito de fibrina",
          "Infección oportunista por citomegalovirus (CMV)"
        ],
        "answerIndex": 1,
        "explanation": "La retina del prematuro es inmadura y vascularmente incompleta. La hiperoxia (exceso de oxígeno suplementario) en la UCIN causa vasoconstricción y detención del crecimiento normal de los vasos retinianos. Posteriormente, al disminuir el oxígeno suplementario, esa retina avascular sufre hipoxia relativa, lo que dispara una sobreproducción de Factor de Crecimiento Endotelial Vascular (VEGF), generando vasos sanguíneos nuevos pero anormales, frágiles y tortuosos (neovascularización) que finalmente sangran y causan desprendimiento de retina traccional.",
        "gpcReference": ""
      },
      {
        "question": "De acuerdo con la Norma Oficial Mexicana y la GPC, para evitar la ceguera prevenible, ¿en qué momento exacto se debe realizar la primera exploración oftalmológica de tamizaje (fondo de ojo bajo dilatación pupilar) en este paciente?",
        "options": [
          "Inmediatamente en la sala de partos al nacer",
          "Al cumplir 1 año de edad corregida",
          "A la 4ta semana de vida extrauterina (cronológica) o a las 31 semanas de edad gestacional corregida (lo que ocurra más tarde)",
          "Exclusivamente al momento de darle el alta de la UCIN"
        ],
        "answerIndex": 2,
        "explanation": "El tamizaje universal para la retinopatía del prematuro es obligatorio en neonatos ≤ 34 semanas de gestación o peso ≤ 1750g (o en mayores si recibieron oxígeno y tuvieron inestabilidad clínica). La GPC dicta que el oftalmólogo debe realizar el primer fondo de ojo a la cuarta semana del nacimiento (vida cronológica) o a las 31 semanas de edad gestacional corregida, ya que es la ventana de tiempo donde la enfermedad (si se presenta) comenzará a ser visible pero aún tratable (con láser o anti-VEGF) antes del desprendimiento. Shutterstock Explorar",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA DE EXTREMIDAD SUPERIOR",
    "subtema": "EPICONDILITIS (CODO DE TENISTA Y GOLFISTA)",
    "difficulty": "baja",
    "case": "Femenina de 45 años, de ocupación secretaria (uso intensivo de teclado y ratón) y jugadora recreativa de tenis. Acude a la consulta ortopédica refiriendo dolor insidioso en la cara lateral del codo derecho de 3 meses de evolución, el cual empeora al levantar objetos cotidianos (como una jarra de agua) o al exprimir un trapo. A la exploración física, hay dolor exquisito a la palpación directa de la prominencia ósea lateral del codo, y el dolor se exacerba notablemente cuando la paciente intenta realizar una extensión resistida de la muñeca.",
    "questions": [
      {
        "question": "Con el cuadro clínico característico de \"Codo de tenista\" (Epicondilitis lateral), ¿cuál es el tendón del músculo específico que se encuentra primariamente degenerado e inflamado en su origen óseo?",
        "options": [
          "Tendón del bíceps braquial",
          "Tendón del tríceps braquial",
          "Tendón del músculo flexor radial del carpo",
          "Tendón del músculo extensor radial corto del carpo (Extensor Carpi Radialis Brevis) "
        ],
        "answerIndex": 3,
        "explanation": "La epicondilitis lateral (\"codo de tenista\") es una tendinopatía degenerativa por sobreuso que afecta el origen de la musculatura extensora del antebrazo en el epicóndilo lateral del húmero. El tendón específicamente más afectado y responsable de la sintomatología clásica (dolor a la extensión resistida de la muñeca) es el del músculo extensor radial corto del carpo (ERCC). En contraste, la epicondilitis medial (\"codo de golfista\") afecta el origen de los músculos flexores y pronadores.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "HIPOACUSIA Y VÉRTIGO",
    "subtema": "VÉRTIGO POSTURAL PAROXÍSTICO BENIGNO (VPPB)",
    "difficulty": "baja",
    "case": "Femenina de 55 años, sin antecedentes crónicos, acude a consulta refiriendo episodios de mareo intenso con sensación de que \"el cuarto le da vueltas\" (vértigo rotatorio). Menciona que estos episodios duran unos 15 a 30 segundos y se desencadenan exclusivamente cuando se acuesta en la cama y gira la cabeza hacia el lado derecho. Entre episodios se encuentra completamente asintomática. Niega pérdida de la audición, zumbidos (acúfenos) o dolor de oído.",
    "questions": [
      {
        "question": "Ante la sospecha del trastorno vestibular periférico más común, caracterizado por la presencia de otolitos en los canales semicirculares (usualmente el posterior), ¿cuál es la maniobra clínica diagnóstica de elección que reproducirá el vértigo y desencaden ará un nistagmo torsional hacia el oído afectado?",
        "options": [
          "Maniobra de Epley",
          "Maniobra de Dix-Hallpike",
          "Prueba de Romberg",
          "Maniobra de Semont"
        ],
        "answerIndex": 1,
        "explanation": "El Vértigo Postural Paroxístico Benigno (VPPB) se diagnostica clínicamente mediante la maniobra de Dix-Hallpike. Al recostar rápidamente al paciente con la cabeza girada y colgando, se estimula el movimiento de los otolitos libres en el canal semicircular posterior, desencadenando un vértigo transitorio y un nistagmo característico (torsional y hacia arriba). La maniobra de Epley, por otro lado, es la maniobra terapéutica de reposicionamiento para curar el VPPB.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA INTESTINAL INFLAMATORIA",
    "subtema": "COLITIS ULCEROSA CRÓNICA IDIOPÁTICA (CUCI)",
    "difficulty": "alta",
    "case": "Masculino de 30 años acude a gastroenterología por presentar un cuadro de 6 meses de evolución caracterizado por diarrea sanguinolenta (6 a 8 evacuaciones al día), pujo, tenesmo rectal, pérdida de peso de 5 kg y dolor abdominal tipo cólico en el cuadrante inferior izquierdo que alivia tras la defecación. Refiere episodios de fiebre intermitente. Sus laboratorios revelan anemia (Hb 10.5 g/dL), VSG elevada y PCR de 45 mg/L. Los coprocultivos y la búsqueda de amebas son negativos.",
    "questions": [
      {
        "question": "Se realiza una colonoscopia que revela una mucosa eritematosa, friable (sangra al roce del endoscopio) y con pérdida del patrón vascular, acompañada de múltiples úlceras superficiales. Esta afectación inicia en el recto y se extiende de manera continua y circunferencial hasta el colon transverso. Al tomar biopsias, ¿cuál es el hallazgo histopatológico característico de esta enfermedad?",
        "options": [
          "Granulomas no caseificantes transmurales",
          "Microabscesos en las criptas de Lieberkühn confinados a la mucosa",
          "Infiltrado inflamatorio parcheado con preservación del recto",
          "Atrofia severa de las vellosidades intestinales"
        ],
        "answerIndex": 1,
        "explanation": "A diferencia de la Enfermedad de Crohn (que es transmural, parcheada y con granulomas), la Colitis Ulcerosa Crónica Idiopática (CUCI) afecta exclusivamente la mucosa y submucosa, siempre inicia en el recto y asciende de manera continua. Su sello histológico patognomónico es la inflamación de la mucosa con distorsión de la arquitectura glandular y la formación de microabscesos crípticos (cúmulos de neutrófilos en las criptas).",
        "gpcReference": ""
      },
      {
        "question": "¿Cuál es el marcador serológico de autoanticuerpos que resulta positivo en el 60-70% de los pacientes con CUCI, ayudando a diferenciarlo de la Enfermedad de Crohn (la cual suele ser ASCA positiva)?",
        "options": [
          "Anticuerpos antinucleares (ANA)",
          "Anticuerpos anti-citoplasma de neutrófilos con patrón perinuclear (p-ANCA)",
          "Anticuerpos anti-mitocondriales (AMA)",
          "Factor reumatoide (FR)"
        ],
        "answerIndex": 1,
        "explanation": "Los p-ANCA (anticuerpos anticitoplasma de neutrófilos con patrón de tinción perinuclear) son el marcador serológico más asociado al CUCI. En la Enfermedad de Crohn, el marcador serológico más frecuente son los ASCA (anticuerpos anti- Saccharomyces cerevisiae).",
        "gpcReference": ""
      },
      {
        "question": "Si este paciente evolucionara tórpidamente y presentara súbitamente fiebre de 39°C, taquicardia, distensión abdominal masiva y cese de las evacuaciones diarreicas, se debe sospechar de la complicación aguda más letal del CUCI (Megacolon tóxico). ¿Cuál es el estudio inicial y el criterio radiológico para confirmar esta urgencia quirúrgica?",
        "options": [
          "Tomografía de abdomen; engrosamiento mural > 1 cm",
          "Colonoscopia de urgencia; pérdida total de haustras",
          "Radiografía simple de abdomen; dilatación del colon transverso > 6 cm",
          "Ultrasonido abdominal; líquido libre en cavidad"
        ],
        "answerIndex": 2,
        "explanation": "El megacolon tóxico es una dilatación aguda no obstructiva del colon asociada a toxicidad sistémica. Su diagnóstico inicial se realiza con una simple radiografía de abdomen en decúbito, donde el hallazgo confirmatorio es la dilatación del colon (típicamente el colon transverso) con un diámetro mayor a 6 centímetros, a menudo acompañado de pérdida de las haustras y edema de la pared (\"impresiones dactilares\").",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "ATLS P2",
    "subtema": "TCE ESCALA DE GLASGOW",
    "difficulty": "media",
    "case": "Masculino de 25 años, ingresa a la sala de urgencias tras sufrir un accidente en motocicleta a alta velocidad sin portar casco. El paciente no obedece órdenes. A la evaluación primaria, el médico nota que el paciente abre los ojos únicamente cuando se le aplica un estímulo doloroso intenso en el lecho ungueal. No emite ninguna palabra, produciendo únicamente sonidos incomprensibles (gemidos). Al aplicar el estímulo doloroso, el paciente flexiona y rota internamente ambos brazos sobre el pecho de forma anormal, y extiende rígidamente las piernas.",
    "questions": [
      {
        "question": "Con base en la Escala de Coma de Glasgow (ECG) para adultos, ¿cuál es el puntaje correcto de este paciente?",
        "options": [
          "8 puntos",
          "7 puntos",
          "6 puntos",
          "5 puntos"
        ],
        "answerIndex": 1,
        "explanation": "El cálculo de la Escala de Coma de Glasgow se divide en tres respuestas: Ocular (Apertura al dolor): 2 puntos. Verbal (Sonidos incomprensibles): 2 puntos. Motora (Flexión anormal / Rigidez de decorticación): 3 puntos. Total: 2 + 2 + 3 = 7 puntos.",
        "gpcReference": ""
      },
      {
        "question": "Según los protocolos del ATLS, ¿cuál es la medida definitiva para el manejo de la vía aérea indicada de manera inmediata en este paciente basado en su puntaje de Glasgow?",
        "options": [
          "Colocación de cánula orofaríngea (Guedel) y observación",
          "Oxígeno suplementario por mascarilla con reservorio a 15 lts/min",
          "Intubación orotraqueal con secuencia rápida de inducción",
          "Cricotiroidotomía quirúrgica directa"
        ],
        "answerIndex": 2,
        "explanation": "Un puntaje en la Escala de Coma de Glasgow igual o menor a 8 (\"Glasgow de 8, entuba\") clasifica el traumatismo craneoencefálico como SEVERO. Esto indica que el paciente ha perdido o está por perder los reflejos protectores de la vía aérea (tusígeno y nauseoso), por lo que la intubación orotraqueal temprana es una indicación absoluta y prioritaria para asegurar la vía aérea, prevenir la broncoaspiración y asegurar la normoventilación para evitar daño cerebral secundario por hipoxia. Shutterstock",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA GÁSTRICA",
    "subtema": "HERNIA HIATAL / ERGE",
    "difficulty": "media",
    "case": "Masculino de 45 años, con IMC de 32 (obesidad), acude a consulta por referir sensación de ardor retroesternal (pirosis) y regurgitación de sabor ácido que empeora al acostarse o al agacharse a atarse los zapatos, de 2 años de evolución. Refiere que últimamente ha presentado tos seca nocturna y disfonía matutina. Recibió un tratamiento empírico con Omeprazol 20 mg/día por 4 semanas con mejoría muy leve, por lo que regresó a consulta. Se le realizó una endoscopia superior que no mostró esofagitis erosiva ni úlceras (ERGE no erosivo).",
    "questions": [
      {
        "question": "Dado que la endoscopia fue negativa pero los síntomas persisten y son atípicos (tos, disfonía), ¿cuál es el estudio considerado el estándar de oro para confirmar el diagnóstico de Enfermedad por Reflujo Gastroesofágico (ERGE)?",
        "options": [
          "Serie esofagogastroduodenal con bario",
          "Manometría esofágica",
          "pH-metría esofágica de 24 horas (con o sin impedancia)",
          "Prueba de aliento para H. pylori"
        ],
        "answerIndex": 2,
        "explanation": "La pH-metría esofágica ambulatoria de 24 horas es el estándar de oro para el diagnóstico de ERGE. Cuantifica exactamente cuántas veces y por cuánto tiempo el ácido gástrico refluye hacia el esófago inferior, y permite correlacionar estos episodios de reflujo ácido con los síntomas del paciente (como la tos nocturna), siendo indispensable en casos donde la endoscopia no muestra lesiones o antes de planear una cirugía antirreflujo.",
        "gpcReference": ""
      },
      {
        "question": "Si en una futura endoscopia de seguimiento se encontrara el reemplazo del epitelio escamoso estratificado normal del esófago distal por un epitelio cilíndrico con células caliciformes (metaplasia intestinal), ¿a qué complicación premaligna grave del ERGE crónico correspondería este hallazgo?",
        "options": [
          "Esófago de Barrett",
          "Anillo de Schatzki",
          "Síndrome de Mallory-Weiss",
          "Acalasia secundaria"
        ],
        "answerIndex": 0,
        "explanation": "El Esófago de Barrett es una complicación directa de la irritación ácida crónica. El esófago distal se defiende cambiando su mucosa normal por una mucosa similar a la del intestino (metaplasia intestinal especializada). Es una lesión premaligna de gran importancia ya que predispone directamente al desarrollo de adenocarcinoma de esófago, por lo que requiere vigilancia endoscópica periódica con toma de biopsias para detectar displasia.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "UROLOGÍA P1",
    "subtema": "CRIPTORQUIDIA",
    "difficulty": "baja",
    "case": "Lactante masculino de 12 meses de edad es traído a su consulta de control de niño sano. Su madre refiere que, desde el nacimiento, el escroto derecho \"se ve más pequeño y vacío\". A la exploración física en ambiente cálido, el testículo izquierdo se encuentra en la bolsa escrotal, de tamaño y consistencia normales. El testículo derecho no es palpable en la bolsa escrotal, sino que se palpa en el tercio distal del canal inguinal, siendo imposible descenderlo manualmente hasta el escroto.",
    "questions": [
      {
        "question": "De acuerdo con las guías urológicas pediátricas, al no haberse producido el descenso testicular espontáneo durante el primer año de vida, ¿cuál es el rango de edad ideal recomendado para realizar la corrección quirúrgica (orquidopexia) con el fin de maximizar la preservación de la fertilidad y facilitar la autoexploración futura?",
        "options": [
          "Inmediatamente al nacimiento",
          "Entre los 6 y 18 meses de edad",
          "Durante la pubertad (12 a 14 años)",
          "Después de los 18 años"
        ],
        "answerIndex": 1,
        "explanation": "El descenso testicular espontáneo es muy raro después de los 6 meses de edad. La GPC y la Asociación Americana de Urología indican que la orquidopexia (fijación quirúrgica del testículo en el escroto) debe realizarse idealmente entre los 6 y los 12- 18 meses de edad. Operar a esta edad previene el daño histológico irreversible a las células germinales (preservando el potencial de fertilidad) y, aunque no elimina el riesgo inherente de desarrollar cáncer testicular en la edad adulta, permite colocar el testículo en una posición donde la autoexploración para detectar masas sea posible.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA PANCREÁTICA",
    "subtema": "PANCREATITIS AGUDA",
    "difficulty": "alta",
    "case": "Femenina de 45 años, con antecedente de colelitiasis demostrada por ecografía hace un año, sin tratamiento quirúrgico. Es traída al servicio de urgencias por presentar dolor abdominal de inicio súbito e intensidad 10/10 en el epigastrio, el cual se irradia en forma de \"cinturón\" (transfictivo) hacia la espalda. El cuadro se acompaña de náuseas y múltiples episodios de vómito de contenido gastroalimentario que no alivian el dolor. A la exploración física: T 37.8°C, FC 115 lpm, TA 100/65 mmHg, FR 22 rpm. El abdomen se encuentra distendido, con disminución de los ruidos peristálticos, hiperestesia y dolor exquisito a la palpación profunda en el epigastrio, sin datos de irritación peritoneal franca. Laboratorios: Leucocitos 14,000/mm³, Glucosa 180 mg/dL, Amilasa sérica 850 U/L (Valor normal < 140 U/L) y Lipasa sérica 1,200 U/L (Valor normal < 160 U/L). Pruebas de función hepática con elevación de AST (250 U/L) y ALT (310 U/L).",
    "questions": [
      {
        "question": "De acuerdo con los Criterios de Atlanta Revisados, ¿cuál de las siguientes afirmaciones sobre el diagnóstico de pancreatitis aguda en esta paciente es correcta?",
        "options": [
          "Se requiere forzosamente una Tomografía Computarizada de abdomen contrastada para confirmar el diagnóstico",
          "El diagnóstico se confirma por la presencia de dolor característico y elevación de lipasa > 3 veces el límite superior normal",
          "La amilasa sérica es un marcador más específico y sensible que la lipasa para confirmar el diagnóstico",
          "Se requiere la presencia de los signos de Cullen o Grey-Turner para establecer el diagnóstico clínico"
        ],
        "answerIndex": 1,
        "explanation": "Los Criterios de Atlanta requieren 2 de 3 parámetros para diagnosticar pancreatitis aguda: 1) Dolor abdominal sugerente (epigastrio irradiado a la espalda), 2) Elevación de amilasa o lipasa sérica > 3 veces el límite superior normal, y 3) Hallazgos imagenológicos característicos. La paciente tiene clínica y laboratorios clásicos (lipasa > 3 veces el valor normal), por lo que el diagnóstico está confirmado sin necesidad de TAC en este momento. La lipasa es más sensible y específica que la amilasa.",
        "gpcReference": ""
      },
      {
        "question": "Dado que el diagnóstico clínico y bioquímico ya está establecido, ¿cuál es el estudio de imagen inicial que la GPC recomienda solicitar en las primeras 24 horas en el servicio de urgencias para investigar la etiología de la pancreatitis?",
        "options": [
          "Ultrasonido hepatobiliar de cuadrante superior derecho",
          "Tomografía axial computarizada de abdomen con contraste intravenoso",
          "Colangiopancreatografía Retrógrada Endoscópica (CPRE)",
          "Resonancia magnética de abdomen"
        ],
        "answerIndex": 0,
        "explanation": "El ultrasonido abdominal es el estudio de imagen inicial de elección en todos los pacientes con pancreatitis aguda. Su principal objetivo en las primeras horas no es evaluar el páncreas (que a menudo no se ve por el gas intestinal), sino buscar litos en la vesícula biliar o dilatación del colédoco, ya que la etiología biliar es la causa número uno de pancreatitis en nuestro medio (apoyada en esta paciente por la elevación de ALT > 150 U/L). La TAC contrastada se reserva para después de 72 horas si hay deterioro clínico o sospecha de necrosis.",
        "gpcReference": ""
      },
      {
        "question": "Considerando que la paciente se encuentra en las primeras 12 a 24 horas de evolución y presenta signos iniciales de respuesta inflamatoria sistémica (taquicardia, leucocitosis), ¿cuál es el pilar terapéutico inicial más importante para prevenir la necrosis pancreática y disminuir la mortalidad?",
        "options": [
          "Inicio inmediato de antibióticos profilácticos de amplio espectro (Imipenem)",
          "Ayuno prolongado por un mínimo de 7 días",
          "Reanimación hídrica agresiva con cristaloides (Ringer Lactato) monitorizada",
          "Cirugía de urgencia para necrosectomía pancreática"
        ],
        "answerIndex": 2,
        "explanation": "La piedra angular del tratamiento en las primeras 12-24 horas de la pancreatitis aguda es la reanimación con líquidos intravenosos agresiva (preferentemente Ringer Lactato). La inflamación pancreática produce un secuestro masivo de líquidos en el tercer espacio, llevando a hipovolemia, hemoconcentración y disminución de la microperfusión pancreática, lo cual es la causa principal del desarrollo de necrosis. El uso de antibióticos profilácticos está contraindicado en pancreatitis aguda (solo se usan si hay necrosis infectada o colangitis demostrada).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA INFECCIOSA / RINOLOGÍA Y FARINGE",
    "subtema": "EPIGLOTITIS",
    "difficulty": "media",
    "case": "Preescolar masculino de 4 años, no cuenta con cartilla de vacunación actualizada debido a creencias familiares. Es llevado al servicio de urgencias pediátricas por presentar un cuadro de inicio abrupto (hace 8 horas) caracterizado por fiebre de 39.5°C, dificultad progresiva para respirar y dolor de garganta intenso (odinofagia). A la inspección, el niño luce ansioso, tóxico, babeando profusamente (sialorrea) porque es incapaz de tragar su propia saliva. Adopta una postura característica: sentado, inclinado hacia adelante con el cuello hiperextendido y la mandíbula protruida (posición en trípode). Presenta estridor inspiratorio suave.",
    "questions": [
      {
        "question": "Ante este cuadro clásico que representa una verdadera urgencia de la vía aérea en un niño no inmunizado, ¿cuál es el agente etiológico bacteriano clásicamente responsable de esta enfermedad?",
        "options": [
          "Streptococcus pyogenes (Grupo A)",
          "Haemophilus influenzae tipo b (Hib)",
          "Virus Sincitial Respiratorio (VSR)",
          "Corynebacterium diphtheriae"
        ],
        "answerIndex": 1,
        "explanation": "La epiglotitis aguda clásica es una celulitis bacteriana supraglótica rápidamente progresiva y potencialmente fatal, históricamente causada casi en su totalidad por Haemophilus influenzae tipo b (Hib). Aunque la incidencia ha disminuido drásticamente gracias a la vacuna pentavalente/hexavalente, sigue viéndose en niños no vacunados. Las \"4 D's\" clásicas en inglés son: Drooling (sialorrea), Dysphagia (disfagia), Dysphonia (voz apagada o en \"papa caliente\") y Distress (dificultad respiratoria en trípode).",
        "gpcReference": ""
      },
      {
        "question": "Si el paciente se encuentra estable y la vía aérea no está inminentemente comprometida, permitiendo tomar una radiografía lateral de cuello (siempre en presencia de un experto en vía aérea), ¿cuál es el signo radiológico clásico patognomónico que confirmaría el diagnóstico?",
        "options": [
          "Signo de la aguja o \"campanario\"",
          "Signo del dedo pulgar (Thumbprint sign)",
          "Borramiento del espacio retrofaríngeo",
          "Imagen en \"cuenta de rosario\""
        ],
        "answerIndex": 1,
        "explanation": "El signo del \"dedo pulgar\" en la radiografía lateral de tejidos blandos del cuello es patognomónico de la epiglotitis. Representa una epiglotis masivamente edematizada e inflamada que, en lugar de verse como una línea delgada y curva, se ve como una sombra  redondeada y gruesa que simula la yema de un dedo pulgar humano, obstruyendo el paso del aire. El signo de la aguja es clásico del Croup (Laringotraqueítis viral).",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "UROLOGÍA P2",
    "subtema": "LITIASIS RENAL",
    "difficulty": "baja",
    "case": "Masculino de 35 años, de oficio taxista (baja ingesta de líquidos), acude a urgencias quejándose de dolor severo (10/10), de tipo cólico, que inició de manera súbita en la fosa lumbar derecha y se irradia hacia la fosa ilíaca derecha y el testículo ipsilateral. El paciente no encuentra una posición que le alivie el dolor y se mueve constantemente en la camilla. Presenta náuseas, vómito y diaforesis. Su examen general de orina mediante tira reactiva demuestra microhematuria (++). No tiene fiebre ni datos de choque.",
    "questions": [
      {
        "question": "Ante la alta sospecha clínica de un cólico reno-ureteral, ¿cuál es el estudio de imagen de elección (Gold Standard) en el servicio de urgencias por su altísima sensibilidad (cercana al 100%) y especificidad para detectar y localizar cálculos en el tracto urinario, sin importar su composición química?",
        "options": [
          "Radiografía simple de abdomen (KUB)",
          "Ultrasonido renal y de vías urinarias",
          "Tomografía computarizada (UroTAC) de abdomen y pelvis sin medio de contraste",
          "Pielografía intravenosa"
        ],
        "answerIndex": 2,
        "explanation": "La Tomografía Computarizada simple (UroTAC sin contraste) es el estándar de oro absoluto para el diagnóstico de la litiasis urinaria en un episodio agudo. Es superior al ultrasonido y a la radiografía porque detecta los cálculos (incluso los radiolúcidos de ácido úrico que no se ven en la radiografía simple), determina su tamaño exacto, su ubicación (cáliz, pelvis, uréter) y permite medir su dureza en Unidades Hounsfield para planear el tratamiento.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "PATOLOGÍA PERIANAL",
    "subtema": "HEMORROIDES",
    "difficulty": "media",
    "case": "Masculino de 50 años, con antecedente de estreñimiento crónico. Acude a la consulta externa de cirugía general por presentar sangrado transrectal intermitente desde hace 6 meses. Refiere que el sangrado es de color rojo brillante, sin coágulos, y se presenta típicamente como gotas al final de la evacuación o manchando el papel higiénico. Lo que más le preocupa es que, después de defecar, siente que \"una masa se sale por el ano\" (prolapso). Menciona que esta masa no regresa sola hacia adentro, sino que debe empujarla y reintroducirla con sus propios dedos (reducción manual), tras lo cual se queda en su lugar. Niega dolor intenso anal, fiebre o pérdida de peso.",
    "questions": [
      {
        "question": "De acuerdo con la clasificación clínica de Goligher para la enfermedad hemorroidal interna, ¿en qué grado se clasifica la patología de este paciente?",
        "options": [
          "Grado I",
          "Grado II",
          "Grado III",
          "Grado IV"
        ],
        "answerIndex": 2,
        "explanation": "La clasificación de Goligher estatifica las hemorroides internas según su grado de prolapso. Grado I: Sangran pero no prolapsan. Grado II: Prolapsan al defecar pero se reducen espontáneamente solas. Grado III: Prolapsan al defecar y requieren reducción manual por el paciente para volver a su lugar (como en este caso). Grado IV: Permanecen prolapsadas todo el tiempo y son irreductibles manualmente. Shutterstock Explorar",
        "gpcReference": ""
      },
      {
        "question": "Según la GPC mexicana, y dado que la enfermedad hemorroidal del paciente se encuentra en este grado avanzado que afecta su calidad de vida y no respondió a medidas conservadoras previas, ¿cuál es el tratamiento quirúrgico de elección?",
        "options": [
          "Fotocoagulación con láser infrarrojo",
          "Ligadura con banda elástica en consultorio",
          "Escleroterapia inyectada",
          "Hemorroidectomía escisional (técnica cerrada de Ferguson o abierta de Milligan- Morgan)"
        ],
        "answerIndex": 3,
        "explanation": "El tratamiento quirúrgico definitivo, la hemorroidectomía escisional (cortar y extraer el plexo hemorroidal enfermo), es el estándar de oro y la indicación de elección para las hemorroides internas Grado III y Grado IV, o aquellas que presentan sangrado intratable. La ligadura con banda elástica, fotocoagulación y escleroterapia están reservadas e indicadas como tratamiento de primera línea para las hemorroides internas Grado I y II.",
        "gpcReference": ""
      }
    ]
  },
  {
    "specialty": "cir",
    "tema": "ATLS P2",
    "subtema": "TCE HEMORRAGIA EPIDURAL",
    "difficulty": "baja",
    "case": "Masculino de 22 años es llevado a urgencias por paramédicos tras participar en una riña callejera donde recibió un golpe directo con un bate de béisbol en la región temporal derecha (pterion). Los paramédicos reportan que, inmediatamente tras el golpe, el paciente perdió el conocimiento durante un par de minutos, pero luego despertó y estuvo lúcido, hablando y caminando durante el traslado (intervalo lúcido). A su llegada a urgencias (40 minutos después), el paciente se deteriora bruscamente, cayendo en estado de coma (Glasgow 6). A la exploración neurológica, presenta la pupila derecha completamente dilatada (midriasis arreactiva) y parálisis motora (hemiparesia) del lado izquierdo.",
    "questions": [
      {
        "question": "Ante la cinemática del trauma (golpe temporal), la clásica presentación clínica de \"intervalo lúcido\" seguido de deterioro rápido y datos de herniación uncal, ¿cuál será el hallazgo tomográfico y el vaso sanguíneo responsable que confirman este diagnóstico?",
        "options": [
          "Colección cóncavo-convexa (semiluna) originada por ruptura de venas puente",
          "Sangre en las cisternas basales y ventrículos por ruptura de un aneurisma",
          "Hemorragia intraparenquimatosa frontal por contusión cerebral pura",
          "Colección biconvexa (lenticular) que no cruza suturas, originada por ruptura de la arteria meníngea media"
        ],
        "answerIndex": 3,
        "explanation": "El hematoma epidural es causado clásicamente por la fractura del hueso temporal (región del pterion) que secciona o desgarra la arteria meníngea media. Debido a que el sangrado es de origen arterial (alta presión), diseca rápidamente la duramadre despegándola del cráneo. La sangre se acumula rápidamente adoptando una característica forma de lente biconvexo (limón) en la TAC, delimitada por las suturas craneales (no puede cruzarlas). La presentación en tres fases (pérdida de conciencia inicial - intervalo lúcido - coma por herniación cerebral rápida) es su sello clínico patognomónico.",
        "gpcReference": ""
      }
    ]
  }
];

if (typeof module !== 'undefined') {
  module.exports = QUESTIONS;
}
