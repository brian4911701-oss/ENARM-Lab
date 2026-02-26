// questions.js – Banco de reactivos para ENARMlab
// Basado en GPCs y NOMs actualizadas (2023-2024)
// Temario oficial: Ginecología, Pediatría, Medicina Interna, Cirugía

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
    "gpcReference": "NOM-015-SSA2-2010, Para la prevención, tratamiento y control de la diabetes mellitus."
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
    "gpcReference": "NOM-010-SSA2-2010, Para la prevención y el control de la infección por Virus de la Inmunodeficiencia Humana."
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
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Diabetes en el Embarazo."
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
    "gpcReference": "GPC Diagnóstico y Manejo de la Bronquiolitis Aguda en Niños."
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
    "gpcReference": "NOM-036-SSA2-2012, Prevención y control de enfermedades. Aplicación de vacunas."
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
    "gpcReference": "GPC Diagnóstico de Apendicitis Aguda."
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
    "gpcReference": "Manual ATLS (Advanced Trauma Life Support), 10ma Edición."
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
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Fibrilación Auricular."
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
    "gpcReference": "GPC Diagnóstico y Tratamiento del Embarazo Ectópico."
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
    "gpcReference": "NOM-014-SSA2-1994, Para la prevención, detección, diagnóstico, tratamiento, control y vigilancia epidemiológica del cáncer cérvico uterino."
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
    "gpcReference": "GPC Control Prenatal con Enfoque de Riesgo."
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
    "gpcReference": "GPC Diagnóstico y Manejo de la Epiglotitis Aguda."
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
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Hernia Diafragmática Congénita."
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
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Pancreatitis Aguda."
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
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Enfermedad Diverticular del Colon."
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
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Litiasis Renal."
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
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Obstrucción Intestinal."
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
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Tromboembolia Pulmonar Aguda."
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
    "gpcReference": "Fundamentos de Epidemiología Clínica."
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
    "gpcReference": "Guía de Vigilancia Epidemiológica Integral de Dengue."
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
    "gpcReference": "GPC Diagnóstico y Manejo de Infecciones de Vías Respiratorias Superiores."
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
    "gpcReference": "GPC Tratamiento del Paciente con Quemaduras Graves."
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
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Insuficiencia Renal Crónica."
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
    "gpcReference": "GPC Diagnóstico y Manejo de Lupus Eritematoso Sistémico."
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
    "gpcReference": "GPC Diagnóstico y Tratamiento del Glaucoma de Ángulo Abierto y Cerrado."
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
    "gpcReference": "GPC Diagnóstico y Manejo de la Otitis Media Aguda en Niños."
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
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Infección de Vías Urinarias en el Adulto."
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
    "gpcReference": "GPC Diagnóstico y Tratamiento de Pioderma Gangrenoso."
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
    "gpcReference": "NOM-036-SSA2-2012, Prevención y control de enfermedades. Aplicación de vacunas."
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
    "gpcReference": "GPC Diagnóstico y Tratamiento del Reflujo Gastroesofágico en Pediatría."
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
    "gpcReference": "Guías de RCP y ACE de la American Heart Association (AHA)."
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
    "gpcReference": "Soporte Vital Cardiovascular Avanzado (ACLS)."
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
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Enfermedad Pulmonar Obstructiva Crónica."
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
    "gpcReference": "GPC Diagnóstico y Manejo de la Laringotraqueítis Aguda en Pacientes Pediátricos."
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
    "gpcReference": "GPC Diagnóstico y Tratamiento de la Pancreatitis Aguda."
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
    "gpcReference": "ATLS (Advanced Trauma Life Support) - Principios de manejo de trauma torácico."
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
    "gpcReference": "GPC Diagnóstico y tratamiento de la Fibrilación Auricular."
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
    "gpcReference": "NOM-017-SSA2-2012, Para la vigilancia epidemiológica."
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
    "gpcReference": "GPC Prevención, diagnóstico y tratamiento de la Meningitis Bacteriana Aguda en edad Pediátrica."
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
    "gpcReference": "GPC Criterios médicos de elegibilidad para el uso de anticonceptivos WHO, adaptados al ENARM."
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
    "gpcReference": "GPC Diagnóstico y tratamiento de la Glomerulonefritis Aguda en Pediatría."
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
    "gpcReference": "GPC Diagnóstico y Manejo del Parto Pretérmino."
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
    "gpcReference": "ATLS (Advanced Trauma Life Support) - Principios de manejo de trauma torácico."
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
    "gpcReference": "Bases de Epidemiología y Salud Pública (Modelos Preventivos de Leavell y Clark)."
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
    "gpcReference": "GPC Diagnóstico y tratamiento del Hiperparatiroidismo Primario."
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
    "gpcReference": "GPC Diagnóstico y tratamiento del Cáncer de Endometrio."
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
    "gpcReference": "ATLS - Manual de reanimación y Trauma en Pelvis."
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
    "tema": "Hemorragia Uterina Anormal (SOP, Endometriosis)",
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
    "tema": "Hemorragia Uterina Anormal (Miomatosis, Pólipos)",
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
    "tema": "Oncología Ginecología P1: Cáncer de Ovario",
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
    "tema": "Oncología Ginecología P2: Tamizaje CACU",
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
    "tema": "Patología Neonatal Infecciosa (Sepsis, Conjuntivitis, Onfalitis)",
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
    "tema": "Patología Respiratoria Neonatal (Membrana hialina, TTRN, SAM)",
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
    "tema": "Crecimiento y Desarrollo P2 (Hitos del desarrollo)",
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
    "tema": "Vacunación (Esquema Nacional)",
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
    "tema": "Infecciones de Vías Respiratorias Superiores (Otitis, Faringitis)",
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
    "tema": "Urgencias Pediátricas (Quemaduras)",
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
    "tema": "Enfermedades transmitidas por Vector (Dengue, Zika, Rickettsia)",
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
    "tema": "Cardiología: Cardiopatía Isquémica (Angina e Infarto)",
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
    "tema": "Endocrinología: Complicaciones Agudas de Diabetes (Cetoacidosis / Estado Hiperosmolar)",
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
    "tema": "Neurología: Enfermedad Vascular Cerebral (EVC)",
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
    "tema": "Nefrología: Lesión Renal Aguda (LRA)",
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
    "tema": "Medicina Interna – Síndrome coronario agudo con elevación del ST",
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
    "tema": "Pediatría – Crisis asmática",
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
    "tema": "Cirugía – Pancreatitis aguda",
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
    "tema": "Insuficiencia renal crónica (Anemia)",
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
    "tema": "Intususcepción intestinal",
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
    "tema": "Isquemia mesentérica aguda",
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
    "tema": "Ginecología – Embarazo ectópico",
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
    "tema": "Cirugía General – Apendicitis aguda complicada",
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
    "tema": "Síndrome nefrótico",
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
    "tema": "Melanoma maligno",
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
    "tema": "Obstrucción intestinal mecánica",
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
    "tema": "Pancreatitis aguda grave",
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
    "tema": "Ginecología – Cáncer de endometrio",
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
    "tema": "Medicina Interna – Enfermedad renal crónica y manejo de anemia",
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
    "tema": "Pediatría – Intususcepción intestinal",
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
    "tema": "Ginecología – Amenorrea secundaria",
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
    "tema": "Cirugía – Isquemia mesentérica aguda",
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
    "tema": "Oncología Ginecológica P2 – Tamizaje y manejo inicial de CaCu",
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
    "tema": "Pediatría – Infecciones TORCH (Toxoplasmosis congénita)",
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
    "tema": "Nefrología – Síndrome nefrítico (Glomerulonefritis postestreptocócica)",
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
    "tema": "Diabetes Mellitus – Tratamiento farmacológico (Medicina Interna)",
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
    "tema": "Choque obstétrico y hemorragia obstétrica",
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
    "tema": "Cardiopatías congénitas – Comunicación interventricular (Pediatría)",
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
    "tema": "Neurología – Evento vascular cerebral isquémico",
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
    "tema": "Infectología – Tuberculosis pulmonar",
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
    "tema": "VIH/SIDA – Profilaxis en paciente con CD4 bajo",
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
    "tema": "Enfermedades transmitidas por vector – Dengue",
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
    "tema": "Zoonosis – Tétanos",
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
    "tema": "Geriatría – Síndrome confusional agudo (Delirium)",
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
    "tema": "Dermatología – Melanoma cutáneo",
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
    "tema": "Hematología – Anemia ferropénica",
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
    "tema": "Pediatría – Crisis asmática moderada",
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
    "tema": "Medicina Interna – Síndrome nefrótico",
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
    "tema": "Gastroenterología – Pancreatitis aguda grave",
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
    "tema": "Neurología – Meningitis bacteriana aguda",
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
    "tema": "Trastornos ácido-base – Acidosis metabólica con anión gap elevado",
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
    "tema": "Cirugía General – Obstrucción intestinal mecánica",
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
    "tema": "Ginecología – Hemorragia uterina anormal en perimenopausia",
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
    "tema": "Pediatría – Sepsis neonatal temprana",
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
    "tema": "Nefrología – Hiponatremia sintomática",
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
    "tema": "Medicina Interna – Tromboembolia pulmonar",
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
    "tema": "Endocrinología – Síndrome de Cushing",
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
    "tema": "Obstetricia – Trabajo de parto pretérmino",
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
    "tema": "Neurología – Hemorragia subaracnoidea",
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
    "tema": "Medicina Interna – Estado hiperosmolar hiperglucémico",
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
    "tema": "Hematología – Púrpura trombocitopénica inmune",
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
    "tema": "Obstetricia – Desprendimiento prematuro de placenta normoinserta",
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
    "tema": "Nefrología – Lesión renal aguda prerrenal",
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
    "tema": "Endocrinología – Hiperpotasemia",
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
    "tema": "Endocrinología – Hipercalcemia primaria",
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
    "tema": "Medicina Interna – Síndrome nefrítico agudo",
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
    "tema": "Medicina Crítica – Síndrome de dificultad respiratoria aguda (SDRA)",
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
    "tema": "Gastroenterología – Pancreatitis aguda biliar con complicación sistémica",
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
    "tema": "Medicina Interna – Choque cardiogénico post IAM",
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
    "tema": "Obstetricia – Síndrome HELLP",
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
  }
];

// Exportación para uso en app.js o scripts node
if (typeof module !== 'undefined') {
  module.exports = QUESTIONS;
}
