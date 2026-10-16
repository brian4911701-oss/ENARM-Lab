# Recuperación de progreso, cierre de sesión y consumo — 16 de octubre de 2026

## Diagnóstico y alcance

En la consulta de solo lectura de la cuenta indicada por el usuario, `user_progress` conservaba 278 respuestas, 211 aciertos y 34 sesiones (revisión 18, esquema v3). El respaldo anterior contenía 266 respuestas, 209 aciertos y 32 sesiones. Se guardó una copia privada local de los documentos consultados en `.local-secrets/progress-audit-2026-10-16/`, excluida de Git. No se restauró ningún respaldo sobre producción ni se modificaron esos documentos.

Se reprodujo un defecto del cliente: al existir operaciones antiguas pendientes, la restauración podía preferir su copia local en ceros a la lectura reciente del servidor y aplicar deltas negativos o un reinicio antiguo a la pantalla. Las reglas y el servicio v3 protegían los resultados confirmados, pero la presentación local podía permanecer en ceros mientras fallaba el envío pendiente. Las pruebas nuevas contra el código anterior produjeron tres fallos; el código corregido supera los cinco casos de recuperación. El contenido exacto del teléfono físico no se inspeccionó: el defecto reproducido es compatible con lo descrito y puede afectar a otras cuentas con ese estado local.

Los cuatro avisos administrativos de la captura podían llegar antes que el aviso de reemplazo de sesión: las reglas ya habían retirado el permiso y los listeners lo trataban como un fallo administrativo independiente.

## Correcciones

- `progress-sync.js` prioriza la lectura confirmada del servidor. Al mostrar operaciones pendientes sobre v3, conserva estadísticas, historial, época y sesiones del calendario confirmados. Mantiene notas, preferencias y pomodoros pendientes; conserva el diario original hasta su reconocimiento o archivo por el servidor.
- `server/study-service.js` comparte el criterio existente para identificar cambios derivados. No se relajaron las comprobaciones de autoridad ni se habilitaron escrituras directas de resultados.
- `account-session.js` agrupa comprobaciones simultáneas de autorización y filtra callbacks de sesiones anteriores. Los cuatro listeners administrativos consultan la autoridad ante un error de permisos: si la sesión fue reemplazada, se produce un solo cierre, sin esos avisos engañosos; si sigue autorizada, el error real permanece visible.
- El ranking se suscribe únicamente mientras Comunidad está abierta y visible. Al salir o cerrar sesión se cancela esa suscripción. Conserva los perfiles antiguos sin puntuación y las actualizaciones en vivo.
- El panel administrativo reutiliza durante cinco minutos los datos de sus ocho colecciones al cambiar el rango. El botón Actualizar conserva la consulta explícita. La caché se limpia al cerrar sesión y se descartan resultados de una cuenta que ya salió.
- Los eventos de almacenamiento entre pestañas y de visibilidad aprovechan el listener de progreso ya activo en lugar de duplicar su lectura con `getDocFromServer`.
- Se actualizó el caché de la PWA a `enarmax-v109-progress-restore`.

Estas optimizaciones no atribuyen retrospectivamente las 58,945 lecturas anteriores a una función concreta. El ranking todavía lee los perfiles cuando se abre Comunidad; una actualización administrativa todavía consulta ocho colecciones. No se promete capacidad ilimitada en Spark ni se cambió el plan de Firebase.

## Verificación

- `npm test`: aprobado, incluidos los cinco casos de recuperación y nueve de sesión/cuota, además de las suites existentes.
- Reglas y transacciones: 38 de 38 pruebas aprobadas, repetidas al terminar esta continuación; incluyen autoridad atómica, revocación, respuestas confirmadas, migración, reinicios, reautenticación y duplicados.
- Recorrido integral de Chrome: aprobado sin excepciones de JavaScript. Incluye cancelar/confirmar el reemplazo, cierre automático de administrador sin los cuatro avisos, 35 respuestas conservadas, HTTP 403 para el token anterior, recarga, pestañas, reautenticación, desconexión breve, reapertura de ventanas, revocación mientras estaba offline, logout manual y ausencia de ciclos. El teléfono simulado con copia en ceros y deltas negativos mostró los resultados confirmados incluso con el envío pendiente bloqueado; al reanudarlo mantuvo los totales y un solo intento final.
- `npm run build:hosting` y `git diff --check`: aprobados.

Los contadores instrumentados en Chrome miden llamadas explícitas del cliente, no el total facturable de Firebase: cero suscripciones al ranking desde el inicio/dashboard; una al abrir Comunidad, sin duplicarla; ocho consultas iniciales de analíticas y ninguna adicional al cambiar rango; ocho nuevas al pulsar Actualizar; diez eventos de almacenamiento y diez de visibilidad sin lecturas explícitas adicionales de progreso cuando su listener está activo.

Las pruebas automatizadas usan Auth y Firestore locales. No consumen la cuota de producción. Los fallos de conexión y HTTP 403/503 provocados por las pruebas son intencionales. Siguen existiendo mensajes de consola de `case_overrides` por sus permisos anteriores y de algunas suscripciones sociales al salir; no son los cuatro avisos de interfaz corregidos y no se ampliaron sus permisos para silenciarlos.

Pendientes de ejecución real: OAuth de Google, teléfono físico/PWA instalada y prueba posterior a la publicación. El acceso automatizado del navegador usa una cuenta del emulador con correo verificado y claim de administrador; no se presenta como OAuth real de Google.

## Publicación

Publicar la revisión completa del cliente y de la API que incluye `progress-sync.js`, `account-session.js`, `app.js`, `server/study-service.js` y el service worker. Si ya se publicó el commit `3b469eb`, esta continuación añade las optimizaciones de `app.js` y el service worker v109. El build está preparado en `public/`.

Esta corrección no modifica `firestore.rules`, no requiere índices nuevos, migraciones, borrado de datos ni habilitar Blaze. Deben mantenerse publicadas las reglas de sesión única anteriores. Publicar solo Firebase Hosting no actualiza los endpoints de Vercel. Después de publicar, comprobar que PC y PWA reciben la nueva versión y comparar el progreso al cambiar de dispositivo; no borrar el almacenamiento local como parte de la reparación.

No se realizó despliegue ni push en esta continuación. La exclusión de dispositivos sigue siendo autorización del servidor de ENARMAX; las limitaciones de los endpoints nativos de Firebase Auth permanecen documentadas en `single-account-session-2026-10-15.md`.
