# Auditoría y rediseño de sesiones de estudio

## Auditoría previa a la implementación

La aplicación es JavaScript sin React: `app.js` contiene un objeto `State` y renderiza el DOM. Firebase Auth identifica la cuenta y exige correo verificado para escribir progreso. Firestore almacena `user_progress`, perfiles, suscripciones y métricas separadas; Vercel sirve enarmax.com y una API existente usa Firebase Admin mediante `FIREBASE_SERVICE_ACCOUNT_JSON`.

El protocolo v2 evita sobrescribir contadores entre dispositivos y tiene una cola local por UID, transacciones, cursores y un listener. Sin embargo, preguntas, respuestas, índice y temporizador del examen solo existen en memoria. No hay exclusión de escritores, token de transferencia, registro de instalaciones ni intentos finales inmutables. La corrección y agregación del examen ocurren en el navegador. Una revisión incremental en reglas no equivale a validar quién posee el examen. El botón manual no resuelve estos límites.

## Arquitectura propuesta

- API de Vercel autenticada con Firebase ID token y una credencial aleatoria por instalación. El servidor verifica cada escritura y limita a dos instalaciones activas en una transacción. El identificador representa almacenamiento de navegador, nunca identidad física. Dos pestañas comparten instalación pero tienen identificadores de escritor distintos.
- `active_exams/{uid}`: único examen activo, respuestas, índice, reloj, propietario, revisión y fencing token creciente. Las preguntas congeladas viven en `exam_payloads/{uid}/items/{examId}` y se leen una sola vez por examen en cada navegador; así no se retransmite todo el banco con cada respuesta. Al abrir en otra instalación/pestaña se adquiere el control transaccionalmente. Un listener pone al propietario anterior en lectura. Cada adquisición entrega además una credencial privada que no aparece en snapshots; conocer el token incremental público no permite suplantar a otra pestaña.
- Respuestas en operaciones ordenadas, guardadas localmente antes de enviarse. ACK elimina solo las operaciones confirmadas. Al reabrir, la cola del proceso anterior se recupera automáticamente si el servidor todavía reconoce su credencial exacta; después se adquiere una credencial nueva. Al perder el control se conserva la cola original como conflicto recuperable, sin aplicarla silenciosamente al examen nuevo. El dispositivo nuevo recibe únicamente el progreso confirmado. La intención de finalizar también persiste y se reintenta sin duplicar resultados.
- `exam_attempts/{uid}/items/{examId}`: resultado final inmutable con respuestas; las preguntas se recuperan desde su payload inmutable. Finalizar comprueba propietario, aplica respuestas pendientes y crea intento, repasos, resultado del reto y agregados en una sola transacción. Repetir una finalización devuelve el mismo intento sin sumar de nuevo. El historial puede cargar páginas de intentos anteriores sin aumentar el documento de progreso ni cargar los casos completos por adelantado.
- Firestore es la fuente confirmada; localStorage es cola y caché. El protocolo v3 bloquea escrituras directas al progreso migrado y todos los documentos de control. La API conserva los campos existentes y centraliza nuevos resultados. Se mantienen listeners acotados de progreso, examen y registro público de instalaciones; no hay sondeo periódico por respuesta.
- Preferencias y herramientas de estudio conservan operaciones semánticas del protocolo actual. Las operaciones normales no pueden alterar historial ni contadores derivados de exámenes. El perfil permite revocar instalaciones; una revocación invalida inmediatamente sus escrituras y su control.

## Archivos afectados y etapas

1. Nuevo motor de servidor y endpoint `api/study-sync.js`, reglas y pruebas reales de Firestore: concurrencia, fencing, límite de instalaciones, finalización idempotente y privacidad.
2. Nuevo cliente de sesiones, integración puntual en `app.js`, perfil y estados de guardado en `index.html`; actualizar build y service worker. Invitados conservan diagnóstico local.
3. Pruebas de navegador, reconexión, dos pestañas y transferencia; despliegue coordinado del backend, reglas y cliente. No se reescriben comunidad, pagos o suscripciones.

## Costos y compatibilidad

Estimación del diseño final: cada lote de respuestas requiere tres lecturas (registro privado, examen y payload inmutable) y una escritura del documento ligero; cada dispositivo que escucha recibe una lectura del examen actualizado. Un examen de 100 respuestas sin agrupar supondría aproximadamente 300 lecturas transaccionales, 100 escrituras y hasta 200 lecturas de listeners con dos dispositivos. Inicialización, correcciones administrativas por caso al comenzar, cursores de progreso y finalización añaden operaciones; reintentos y reconexiones también cuentan. El cliente agrupa cambios rápidos y no escribe cada segundo del temporizador. No se prometen costos nulos.

Firestore incluye cuota gratuita de 50 000 lecturas y 20 000 escrituras diarias para una base elegible; superar cuotas depende del plan. La tarifa monetaria depende de región/edición y uso global de la app. La API usa Vercel Functions existente, sin introducir Cloud Functions, jobs, Redis ni cambiar el plan automáticamente. El plan y uso reales se comprobarán hasta donde permitan las credenciales; lo no accesible se declarará sin asumirlo.

Fuentes oficiales consultadas el 15 de octubre de 2026: [precios Firestore](https://firebase.google.com/docs/firestore/pricing), [transacciones](https://firebase.google.com/docs/firestore/manage-data/transactions), [límites Vercel Functions](https://vercel.com/docs/functions/limitations), [plan Hobby](https://vercel.com/docs/plans/hobby).

## Migración y reversibilidad

Antes de pasar una cuenta a v3, guardar un respaldo inmutable de su documento de progreso. Conservar todos los campos, historial y estadísticas anteriores de Firebase como base; si falta `user_progress`, leer únicamente sus campos desde el documento legado del servidor. No recalcular ni inventar intentos históricos. Importar preferencias y herramientas desde colas v2 con los mismos cursores y archivar el contenido importado. Los incrementos locales antiguos de resultados e historial, que no tienen una base verificable por intento, se archivan en servidor y localmente con aviso y exportación desde Perfil: nunca se descartan silenciosamente ni sustituyen resultados confirmados. El indicador de migración no concede permiso para fabricar resultados. Esa conciliación histórica puede requerir revisión; no se promete reconstrucción exacta cuando antes no se guardaron las respuestas. Conservar también colas de examen en conflicto para recuperación explícita.

El despliegue no toca entitlements, pagos ni permisos administrativos. La reversión segura mantiene la autoridad del servidor: no volver a habilitar clientes antiguos que puedan sobrescribir v3. Si se necesita recuperar una base, hacerlo con una herramienta de administración tras conservar la versión posterior; nunca restaurar masivamente desde un navegador. Los intentos finales siguen inmutables aunque se reinicien los agregados. Borrar la cuenta debe eliminar las colecciones nuevas mediante backend.

Se incluye `scripts/restore_study_backup.js`, de lectura por defecto, con `--apply --expected-revision N` para una restauración administrativa controlada: guarda primero el documento actual, exige que no haya examen activo, mantiene v3 e invalida operaciones anteriores mediante una nueva época. Los exámenes iniciados en versiones que nunca persistían respuestas no pueden reconstruirse después de cerrar esa versión; la transferencia de exámenes en curso aplica a los iniciados con el nuevo protocolo.

La región confirmada del proyecto es `northamerica-south1`. La API de Billing está deshabilitada y no se ha habilitado ni modificado el plan. No hay acceso al plan contratado de Vercel, por lo que las cifras anteriores son estimaciones operativas, no una garantía de factura. La API existente respondió a un token inválido con 401, confirmando que ya dispone de la credencial de Admin necesaria; no se enviaron mensajes ni se activaron pruebas Premium.

## Aceptación

PC responde; móvil abre y adquiere control con el progreso confirmado; PC queda en lectura y su token anterior no puede escribir. Cambios sin conexión del propietario anterior se conservan como conflicto visible. No se duplica un intento ni se suman dos veces sus resultados aunque se pierda el ACK. Tres instalaciones no obtienen autorización simultánea. Estados pendientes nunca se presentan como guardado confirmado en la nube.

## Verificación realizada

- Contratos existentes de analíticas, temas, seguridad, rachas, repaso y progreso: `npm test` aprobado.
- Suite previa de reglas y dos clientes reales: 11 pruebas. Nueva suite de autoridad: 9 pruebas; incluye inicios concurrentes, transferencia contra finalización, pestañas, revocación, migración, cola offline, pérdida de ACK, reapertura con respuestas todavía locales, medianoche en la zona de la cuenta y reloj pausado sin conexión. Los resultados públicos y las fechas de práctica de exámenes también quedan protegidos frente a escrituras directas del cliente.
- Aplicación completa con Chrome en dos contextos aislados y emuladores de Auth/Firestore: PC responde, móvil continúa sin botón, PC deshabilitado, recarga del móvil, finalización única y convergencia de estadísticas. También se verificó que revisar otro intento y reportar/eliminar un caso no cambien la estructura del examen activo.
- Persistencia de tema y progreso al cerrar/reabrir en viewport móvil: aprobada. Build público y comprobaciones de sintaxis y diff aprobados.
- Un simulacro real de 280 preguntas se valida contra el banco del servidor; enviar únicamente referencias clínicas reduce la solicitud comprobada de unos 490 KB a 185 KB, y el payload congelado queda por debajo del límite del documento.
- `scripts/verify_live_study_release.js --run-disposable-account` comprueba la API publicada con una cuenta efímera y elimina sus datos; no utiliza cuentas existentes, no envía mensajes y no modifica suscripciones.

La publicación usa `enarmax-v103-exam-authority` y versión visible `2026.10.15.3`. Verificar los fingerprints públicos, las reglas activas y la API tras el despliegue; el archivo de resultado de la comprobación efímera queda en `.tmp-config`, fuera de Git.
