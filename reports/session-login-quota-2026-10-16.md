# Fallo de acceso por cuota de Firestore

Diagnóstico y corrección local del 16 de octubre de 2026. Esta corrección todavía no se publicó en Vercel.

## Causa comprobada

Firebase Authentication aceptó las credenciales de la cuenta de prueba proporcionada para este trabajo. Después de autenticar, la lectura administrativa de Firestore respondió HTTP 429, `RESOURCE_EXHAUSTED`, `Quota exceeded.`. El fallo también se reprodujo con una lectura de un documento inexistente, fuera del flujo de Google y sin escrituras de progreso. La cuenta de servicio pudo obtener credenciales administrativas correctamente.

El SDK reintentaba el error de cuota durante más tiempo que la petición de acceso. El cliente interrumpía la solicitud y presentaba un mensaje genérico que atribuía el problema a la conexión del usuario. Los archivos publicados de sesiones coincidían con la implementación anterior; no se encontró un desfase entre esas versiones como causa del bloqueo.

No se modificaron las credenciales, la verificación de correo ni el progreso de la cuenta proporcionada. Se eliminaron las cuentas sintéticas creadas para el diagnóstico y sus documentos temporales conocidos. No se incluyen credenciales ni tokens en este reporte.

## Corrección

- `server/firestore-runtime.js` configura el SDK para no reintentar `RESOURCE_EXHAUSTED` como una interrupción transitoria. El límite RPC es acotado. El ejecutor de transacciones captura cuota tanto al leer como al confirmar y conserva hasta cinco intentos atómicos para los errores transitorios y conflictos de concurrencia que reintentaba el SDK.
- Las API de sesiones, estudio y prueba Premium devuelven HTTP 503 con `firestore-quota-exceeded`, `Retry-After: 300` y una indicación estructurada de reintento.
- El cliente distingue cuota, tiempo de espera, servicio no disponible y problemas de red. Usa AbortController y un límite de veinte segundos para la petición de sesión. No convierte una identidad de Firebase sin autorización de ENARMAX en una sesión válida cuando falla Firestore.
- Los reintentos de acceso, progreso y operaciones de examen se espacian cinco minutos cuando el servidor informa cuota excedida. El diario de respuestas sigue conservando los pendientes; la confirmación en la nube continúa dependiendo de una transacción autorizada.
- La presencia se comprueba aproximadamente cada cuatro minutos, se comparte su programación entre pestañas y se omiten los heartbeats periódicos sin conexión o desde pestañas ocultas. La presencia sigue durando diez minutos y su vencimiento por sí solo no expulsa una sesión.
- El service worker cambia a v107 para distribuir el cliente actualizado.

La autoridad `account_sessions`, las claims firmadas y las reglas permanecen vigentes. Una sesión reemplazada sigue recibiendo HTTP 403 y las reglas rechazan sus escrituras. No se revocan globalmente las credenciales y no se cambian las reglas para eludir la falta de cuota. El protocolo anterior de propiedad del examen ya había sido retirado por la implementación de sesión única; este ajuste no lo reintroduce.

## Pruebas ejecutadas

- `npm test`: aprobado, incluidas siete pruebas nuevas de cuota, autorización, exclusión de reintentos y conservación de Auth durante una indisponibilidad. La prueba con identidad Google es una simulación del proveedor; no es OAuth real.
- Emulador real de Firestore, reglas y transacciones: **31 de 31 pruebas aprobadas** con ejecución secuencial de `tests/session.quota.test.js`, `tests/firestore.rules.test.js`, `tests/progress.multidevice.integration.test.js` y `tests/study.sessions.integration.test.js`.
- Chrome con perfiles separados de escritorio/móvil y emuladores Auth/Firestore: aprobado el error HTTP 503 simulado, el mensaje específico de cuota, el bloqueo de entrada sin autorización, la supresión de solicitudes repetidas y la recuperación tras volver a cargar con el servicio disponible.
- El mismo recorrido de Chrome aprobó acceso normal, cancelar y confirmar reemplazo, cierre automático, conservación de 35 respuestas en el mismo examen, rechazo HTTP 403 del escritor anterior, recarga, pestañas del mismo perfil, reautenticación, desconexión breve, reconexión, cierre y reapertura de ventanas, revocación mientras estaba desconectado y rechazo de sus pendientes, finalización única y cierre manual sin bucles.
- Los accesos iniciales y confirmaciones simultáneos, las carreras entre guardado y reemplazo y la expiración de presencia se comprobaron mediante transacciones en el emulador y reloj controlado.
- Lectura administrativa real, sin escrituras, con el módulo corregido: devolvió `firestore-quota-exceeded`, HTTP 503, en aproximadamente 13,9 segundos, en lugar de continuar reintentando durante minutos.
- `npm run build:hosting` y `git diff --check`: aprobados.

La primera ejecución de Chrome descubrió que el transporte REST forzado requería credenciales predeterminadas en el emulador; se retiró ese cambio y se conserva el transporte original del SDK. Una espera entre pestañas agotó el tiempo mientras la pestaña observada estaba en segundo plano. El ensayo final comprueba primero el valor confirmado en Firestore y luego vuelve a la pestaña observada; el recorrido completo terminó correctamente, sin excepciones JavaScript. Los avisos existentes de permisos de `case_overrides` y recursos 404 no se cambiaron en este ajuste.

Los registros y capturas del diagnóstico están en `.tmp-config/`, excluido de Git.

## Pendiente en producción

1. Publicar juntos el cliente y los endpoints de Vercel, incluyendo el nuevo módulo `server/firestore-runtime.js`. Mantener la variable privada `FIREBASE_SERVICE_ACCOUNT_JSON`. Publicar solo Hosting no actualiza las API.
2. Comprobar el consumo en la [consola de Firestore del proyecto](https://console.firebase.google.com/project/enarm-lab-social/firestore/usage) y recuperar disponibilidad de cuota. **Este cambio de código no restablece ni amplía la cuota de Firebase.** No se habilitó facturación ni se cambió el plan.
3. Firebase indica que las cuotas gratuitas diarias se restablecen aproximadamente a medianoche del Pacífico. El 16 de octubre equivale aproximadamente a la 01:00 de Ciudad de México. Esa es la referencia para una cuota diaria gratuita; no se verificó el contador concreto agotado ni el estado de facturación. Para superar la cuota gratuita se necesita habilitar facturación, decisión que corresponde al propietario del proyecto.
4. Repetir el acceso y el guardado en producción cuando vuelva a responder Firestore. Siguen pendientes OAuth real de Google, PWA instalada en teléfonos físicos y cierre del navegador por el sistema operativo con espera real de expiración.

No hacen falta cambios adicionales de reglas, índices ni migración de datos para este hotfix. No se declara recuperado el acceso de producción mientras Firestore continúe rechazando la lectura de autoridad.

Referencia oficial: [uso, cuotas gratuitas y restablecimiento de Firestore](https://firebase.google.com/docs/firestore/quotas).

## Investigación posterior del consumo

Se consultó Cloud Monitoring con la sesión existente de Firebase CLI, sin consultas de documentos, sin cambiar permisos y sin habilitar servicios ni facturación. La cuenta de servicio de Firebase no tenía permiso de Monitoring; la sesión local del propietario sí pudo leer las métricas. Los resultados originales se conservaron en `.tmp-config/quota-day-*.json`.

Para el intervalo del 15 de octubre de 2026 a la 01:00 al 16 de octubre a las 00:00, hora de Ciudad de México (`2026-10-15T07:00:00Z` a `2026-10-16T06:00:00Z`), `firestore.googleapis.com/document/read_ops_count` reportó:

| Tipo de métrica | Lecturas |
| --- | ---: |
| QUERY | 58,413 |
| LOOKUP | 490 |
| NOT_FOUND | 42 |
| Total observado | **58,945** |

Hubo 13,551 lecturas QUERY entre las 12:00 y las 13:00 y 15,301 entre las 13:00 y las 14:00: **28,852 en esas dos horas**. Se observó otro incremento de 7,090 entre las 22:00 y las 23:00. El máximo horario muestreado fue de nueve conexiones y 144 listeners; conexiones no equivalen necesariamente a personas ni esos máximos prueban duplicación por sí solos. No se suman las dos representaciones de recurso de las métricas de conexiones/listeners, que reflejan los mismos datos.

El total de 58,945 coincide con el orden de magnitud de la captura de cuotas enviada por el usuario y ya está registrado **antes** del commit de sesión única `ca7d984`, de las 00:03 del 16 de octubre. Por lo tanto, ese último cambio no originó el pico principal anterior. La clasificación QUERY no identifica la colección, la cuenta ni la función responsable; tampoco permite separar automáticamente las lecturas de pruebas de las del usuario o de la consola.

En la revisión de código se encontraron consultas amplias existentes que pueden multiplicar el consumo durante recargas y pruebas reales:

- `subscribeLeaderboard` observa toda `public_profiles` sin límite y se invoca al inicializar las funciones de nube después del acceso, aun fuera de la vista Comunidad.
- `loadAdminAnalytics` descarga completas ocho colecciones cuando se consulta el panel, con caché en memoria de la página. No es una consulta periódica universal de todos los estudiantes.
- Los listeners y las lecturas de documentos dependientes de las reglas también contribuyen. La comprobación nueva de autoridad añade lecturas, aunque no explica retroactivamente el consumo anterior a su publicación.

Estas consultas son candidatos concretos para optimizar, **no una atribución demostrada de las 58,945 lecturas**. Esta investigación no modificó Comunidad ni el panel administrativo para evitar alterar sus resultados sin una prueba específica. El hotfix de cuota reduce reintentos y presencia, pero no constituye una optimización completa de esas consultas. El patrón puede repetirse si se reproduce el mismo trabajo contra producción; no se promete que la cuota alcance ni que se agotará cada día sin medir un uso representativo.

Las 31 pruebas y el recorrido integral de Chrome del hotfix se ejecutaron en emuladores; no consumieron la cuota de Firestore del proyecto real. Hubo comprobaciones puntuales de producción, como se documenta arriba, que no deben confundirse con esas suites locales.

Referencias: [métrica oficial de lecturas](https://docs.cloud.google.com/monitoring/api/metrics_gcp_d_h), [consumo de listeners y lecturas dependientes de reglas](https://firebase.google.com/docs/firestore/pricing).
