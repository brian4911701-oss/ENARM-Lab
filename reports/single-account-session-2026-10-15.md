# Sesión única de ENARMAX

Implementación local del 15 de octubre de 2026. No se publicó en producción desde este trabajo.

## Diagnóstico

El protocolo anterior autorizaba hasta dos instalaciones y asignaba cada examen a una instalación y una pestaña. Al abrir o recuperar el examen, `claim` rotaba propietario, fencing token y credencial privada. Las pestañas de un mismo navegador podían quitarse la propiedad. Firebase Auth seguía autenticando la cuenta y otras operaciones de Firestore no dependían de aquella propiedad del examen.

## Autoridad y permisos

- `account_sessions/{uid}` contiene la única sesión autorizada (`sid`) y una revisión creciente. Solo el servidor lo escribe. El titular puede observar ese documento para detectar un reemplazo; conocer su contenido no permite firmar una credencial.
- La API existente de Vercel comprueba Firebase Auth y emite un custom token con `enarmaxSid`, firmado con la credencial administrativa existente. La claim pertenece a ese inicio de sesión, **no** a las custom claims globales de la cuenta. No se utiliza `revokeRefreshTokens`.
- Todas las reglas privadas de Firestore, incluidas las administrativas, requieren que la claim firmada coincida con la autoridad. El documento de autoridad solo admite lectura individual de su titular; el contador comercial que ya era público continúa siendo público.
- Cada operación de estudio lee la autoridad **dentro de la misma transacción** que guarda respuestas, progreso o resultados. Una confirmación concurrente obliga a reintentar la transacción y rechaza al escritor anterior. También se protegen la API de prueba Premium y las tres funciones callable existentes.
- Cancelar el diálogo no modifica la autoridad. Confirmar exige la revisión observada: dos confirmaciones sobre esa revisión no pueden ganar. Dos accesos iniciales concurrentes producen un autorizado y un conflicto.
- El cliente anterior observa el cambio, cierra Firebase Auth y recarga una vez para desechar todos los listeners y callbacks del proceso anterior. La pantalla de acceso muestra el motivo del cierre. La API y las reglas ya rechazan sus operaciones aunque todavía no haya recibido el aviso.
- Un token con una sesión anterior solo puede consultar su validez; no puede adquirir otra autorización automáticamente. Para abrir otra sesión debe producirse un nuevo inicio de sesión reciente con el proveedor y, si corresponde, confirmarse el reemplazo.

## Presencia, pestañas y reconexión

`account_presence/{uid}` es privado del servidor y conserva una presencia de diez minutos. El cliente la renueva aproximadamente cada dos minutos; las pestañas comparten un indicador de programación para evitar comprobaciones periódicas redundantes. Este indicador local no concede permisos. Se separa presencia de autoridad para que cada heartbeat no reactive la evaluación de todos los listeners privados.

La presencia vencida permite que el siguiente acceso sustituya una sesión abandonada sin pedir confirmación. La misma sesión puede renovarse después de una interrupción larga si nadie la reemplazó. El vencimiento de presencia por sí solo no expulsa un examen. El cierre manual libera la autoridad; si ocurre sin conexión, la presencia termina por caducar. Un heartbeat antiguo nunca puede restaurar una sesión reemplazada.

Firebase conserva la credencial firmada entre recargas y ventanas del mismo perfil. Las pestañas comparten la sesión, pero tienen diarios de operaciones independientes e idempotentes. Un perfil de navegador representa una instalación; no se identifica hardware físico ni se intenta unir distintos navegadores de una misma computadora. El diario de examen incluye UID y SID: una autorización posterior no reenvía pendientes de una sesión anterior. Todo reenvío pasa por la transacción que vuelve a comprobar permisos.

La reautenticación para exportar o eliminar la cuenta obtiene una prueba reciente en una instancia Auth auxiliar en memoria, y el servidor verifica tanto esa identidad como la sesión vigente. Así no se reemplaza provisionalmente la claim de la sesión principal por un token sin permisos. La eliminación marca la autoridad antes de la limpieza recursiva para impedir que un nuevo acceso compita con una eliminación aceptada.

## Guardado y lógica retirada

Se retiraron `claim`, las transferencias automáticas de propiedad, los tokens privados de control del examen, el propietario por pestaña, el límite de dos instalaciones, la revocación de instalaciones desde el perfil y la recuperación manual de conflictos de propiedad. También se quitaron sus botones, avisos y estilos. La colección histórica de instalaciones queda cerrada a los clientes.

Se mantienen el autoguardado, las preguntas congeladas en `exam_payloads`, las respuestas confirmadas en `active_exams`, los intentos inmutables y la finalización transaccional que calcula estadísticas una sola vez. Los exámenes anteriores conservan sus respuestas y pierden los campos obsoletos de propiedad al guardar. La migración preserva y respalda el progreso anterior; los cambios derivados antiguos se archivan y no sustituyen estadísticas confirmadas. Los diarios locales antiguos sin confirmación no se aplican automáticamente bajo otra sesión.

## Verificación ejecutada

Se usaron exclusivamente emuladores locales de Auth y Firestore, Chrome real con perfiles aislados y el mismo código de los endpoints de producción. El correo/contraseña del ensayo y los tokens pertenecen al emulador.

| Escenario solicitado | Comprobación ejecutada |
| --- | --- |
| 1. Acceso sin otra sesión | Chrome, sin diálogo adicional |
| 2. Segundo dispositivo y cancelar | Chrome móvil; PC conserva autorización |
| 3. Confirmar reemplazo | Chrome; la nueva sesión recibe autorización |
| 4. Cierre del anterior | Chrome; Auth vacío, examen retirado, pantalla de acceso |
| 5. Conservar 35 respuestas | Chrome y transacciones; mismo examen, 35 respuestas y un solo intento final |
| 6. Recargar | Chrome móvil; mismo SID y progreso |
| 7. Varias pestañas | Chrome, mismo perfil; ambas autorizadas y respuestas propagadas |
| 8. Accesos simultáneos | Transacciones de Firestore: accesos iniciales y confirmaciones concurrentes; un ganador |
| 9. Perder y recuperar internet | Chrome en modo offline; conserva Auth y luego confirma el guardado |
| 10. Navegador abandonado | Expiración con reloj controlado en el servidor; cierre y reapertura de ventanas en Chrome |
| 11. Guardado invalidado | Rechazo real de reglas y HTTP 403 de la API; revocación mientras Chrome estaba offline sin reenviar su respuesta pendiente |
| 12. Ausencia de bucles | Chrome: SID estable, dispositivo expulsado no recupera control, comprobación acotada de solicitudes y logout manual |

También se ejecutaron las pruebas de migración y respaldos, carrera entre respuesta y reemplazo, eliminación contra nuevo acceso, reautenticación, ACK perdido, finalización repetida y respuestas de estudio simultáneas entre pestañas. La primera respuesta de estudio confirmada permanece inmutable y la operación obsoleta se reconoce para evitar reintentos interminables.

Resultado final: **24 de 24 pruebas de reglas e integración aprobadas**, suite `npm test` aprobada, build de Hosting generado y `git diff --check` sin errores. La prueba integral de Chrome aprobó los recorridos descritos sin excepciones de JavaScript. Se revisaron las capturas del diálogo en móvil y escritorio.

Comandos:

```powershell
npm test
npm run security:test-rules
npm run test:study-browser
npm run build:hosting
git diff --check
```

En esta sesión los emuladores se iniciaron una vez; las suites se ejecutaron directamente con `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080` y `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`, en lugar de iniciar un emulador nuevo con cada comando. Java disponible: `D:\AndroidTools\jbr`.

Pendiente: PWA instalada en teléfonos físicos, OAuth real de Google (popup/redirect), pruebas de humo en producción y cierre del proceso por el sistema operativo seguido de diez minutos reales de espera. La expiración sí se probó con reloj controlado; no se presenta esa simulación como una prueba física. Las funciones callable se revisaron y comprobaron sintácticamente; no se desplegaron ni ejecutaron en el servicio administrado. El navegador sigue registrando avisos de `case_overrides` porque las reglas existentes no incluyen esa colección; no se cambiaron esos permisos en este trabajo.

## Despliegue necesario

1. Publicar los endpoints de Vercel y el cliente juntos, incluyendo `api/account-session.js`, el nuevo módulo cliente y el service worker v106. Conservar `FIREBASE_SERVICE_ACCOUNT_JSON` en el entorno privado del servidor; debe incluir una clave privada con la que Firebase Admin pueda firmar custom tokens. No copiarla a Hosting.
2. Publicar `firestore.rules` en el mismo proyecto Firebase, por ejemplo con `firebase deploy --only firestore:rules`. **Hasta publicar las reglas, el cliente nuevo por sí solo no constituye la protección completa.** Publicarlas primero interrumpe temporalmente clientes antiguos; planificar una ventana coordinada. Después, los clientes anteriores deben actualizar e iniciar sesión de nuevo. El progreso de Firestore se conserva.
3. Si las funciones callable antiguas están desplegadas, publicar sus versiones protegidas o retirar esos endpoints antiguos. No dejar una versión con Admin SDK que acepte solo UID. La sesión única utiliza Vercel y no requiere crear Cloud Functions nuevas; no habilitar Blaze solo para desplegar funciones que no se usen.
4. No hace falta migración masiva ni índices nuevos: la autoridad y presencia se crean por cuenta al entrar; la migración de estudio existente conserva sus respaldos. Si una sesión antigua no tiene claim y ya no dispone de autenticación reciente, se solicita iniciar sesión otra vez.

`firebase deploy --only hosting` por sí solo no publica los endpoints de Vercel ni activa las reglas. Revertir las reglas a una versión sin autoridad reabre permisos y no es un rollback seguro de esta política.

Se actualizó `scripts/verify_live_study_release.js` para la comprobación posterior al despliegue (requiere `--run-disposable-account`). No se ejecutó en producción en este trabajo.

## Alcance de seguridad e infraestructura

La exclusión es una autorización de **ENARMAX**, comprobada en los servidores de Firestore y de sus API. Firebase Auth puede seguir aceptando el token anterior como identidad: eso no le concede permiso para leer datos privados, escribir respuestas, modificar perfiles de Firestore o recuperar la sesión. La clave pública de Firebase y el identificador visible de sesión no permiten fabricar la claim firmada.

Las reglas de Firestore no gobiernan los endpoints nativos de Firebase Authentication, como cambios de contraseña/correo o eliminación del usuario de Auth. Esta implementación no promete revocación selectiva de esos permisos del proveedor. Si el alcance exige bloquear también todos esos endpoints nativos a un token anterior, Firebase Auth directo no proporciona esa garantía por dispositivo; requeriría cambiar la arquitectura de identidad y las operaciones de cuenta. No se usó una revocación global para ocultar esa limitación.

La solución reutiliza Firebase Auth, Firestore y la API administrativa de Vercel existente. No introduce Redis, tareas programadas ni funciones nuevas de Firebase. No exige subir de plan para estos componentes; sí consume cuotas y añade una lectura de autoridad a las transacciones de estudio y a la evaluación de reglas privadas, además de presencia y listeners. No se consultó la facturación ni el consumo actual de las cuentas desplegadas y no se garantiza costo cero a cualquier escala.

Referencias oficiales: [custom tokens y firma con cuenta de servicio](https://firebase.google.com/docs/auth/admin/create-custom-tokens), [claims y reglas](https://firebase.google.com/docs/auth/admin/custom-claims), [gestión de tokens por usuario](https://firebase.google.com/docs/auth/admin/manage-sessions), [API nativa de Auth](https://firebase.google.com/docs/reference/rest/auth), [costos de lecturas para evaluar reglas](https://firebase.google.com/docs/firestore/pricing), [límites de Vercel Functions](https://vercel.com/docs/functions/limitations).
