# Revisión de sincronización entre dispositivos — 15 de octubre de 2026

## Diagnóstico confirmado

El dominio que usa la app instalada es **enarmax.com**, que redirige a **www.enarmax.com** y sirve la aplicación desde Vercel. La versión pública revisada utiliza `enarmax-v101-durable-progress` y el proyecto Firebase `enarm-lab-social`.

Las reglas activas de Firestore, publicadas el 9 de septiembre, tienen una lista estricta de campos permitidos en `user_progress`. No incluyen `scaleStudyStr`, que la app envía incluso cuando está vacío. Esto rechaza el documento completo: los cambios pueden sobrevivir localmente sin llegar a otros dispositivos. La comprobación fue de lectura; no se cambió la release activa.

También había dos problemas de concurrencia: cada dispositivo reemplazaba todo el progreso con su propia copia, y una app abierta no escuchaba los cambios remotos. Un respaldo pendiente podía reintroducir estadísticas antiguas al iniciar.

## Comportamiento implementado

| Situación | Resultado |
| --- | --- |
| Dos dispositivos terminan exámenes distintos | Se combinan los incrementos y los registros de ambos. |
| Un envío se repite o se pierde su confirmación | Los cursores por escritor impiden contabilizarlo dos veces. |
| Dos pestañas comparten almacenamiento | Cada operación tiene una clave inmutable; una confirmación no elimina cambios nuevos. |
| Un teléfono trabaja sin conexión | Conserva las operaciones pendientes y las combina al reconectar. |
| Un dispositivo cambia el color y el otro hace un examen | El examen no vuelve a enviar una elección de color que no cambió. |
| Ambos estudian la misma fecha | Las sesiones suman; la racha acredita la fecha una sola vez. |
| Cambia el progreso mientras hay un examen abierto | Se actualizan estadísticas e historial; preguntas, respuestas, índice y temporizador permanecen locales. |
| Se reinician estadísticas desde un dispositivo | Una nueva época impide que operaciones anteriores restauren el progreso borrado. Se informa del conflicto. |
| Una app antigua intenta guardar después de la actualización del documento | Las reglas rechazan la escritura sin una revisión nueva. |
| Se guarda un examen o se actualiza la presencia | No se vuelven a publicar los datos personales o la privacidad de puntuación de una copia antigua. |
| Cambia la cuenta en el mismo navegador | Los pendientes se separan por UID y se descarta el caché visible perteneciente a otra cuenta. |

Las preferencias editadas simultáneamente en el mismo campo siguen el orden de confirmación de las transacciones. Los contadores independientes se suman. El promedio público se calcula leyendo los totales del servidor dentro de una transacción.

Se añadió estado de sincronización, botón **Sincronizar ahora** y versión visible **2026.10.15.2** en Ajustes. La PWA comprueba actualizaciones al volver a primer plano y al recuperar conexión, sin recargar automáticamente un examen abierto.

## Migración y límites

Los respaldos del formato anterior no contienen el punto de partida necesario para separar todos sus incrementos. La migración conserva máximos de contadores y une los registros de exámenes; guarda además una copia del respaldo original para una posible conciliación. No puede prometer reconstruir exactamente actividad histórica que ya fue sobrescrita y no dejó registros.

El historial mantiene el límite previo de 50 sesiones y su presupuesto de detalle; los totales acumulados se conservan. Los temporizadores y los exámenes en curso pertenecen a su dispositivo: esta actualización sincroniza el progreso, no transfiere una sesión abierta a otra pantalla.

## Validación

- `npm test`: contratos existentes, persistencia, combinación de cambios y dos instancias de la app.
- `npm run test:progress-browser`: cierre/reapertura con almacenamiento real de Chrome y pantalla móvil; carga completa de la app sin errores de JavaScript.
- Emulador de Firestore con Java 21: **11 pruebas aprobadas**, incluidas reglas de privacidad, campo de escalas, revisiones, cursores y dos clientes con el SDK real. Se comprobó trabajo simultáneo, desactivación de red en un cliente, reconexión y convergencia de ambos.
- Reglas compiladas como borrador inactivo en Firebase; build de distribución y comprobación de diff completados.

## Despliegue y verificación

El despliegue autorizado por el usuario incluye **las reglas de Firestore y el código que sirve Vercel para enarmax.com**. Publicar Firebase Hosting no actualiza ese dominio. La versión usa `enarmax-v102-multi-device-sync`.

Publicar primero las reglas y después enviar el código a la rama principal, vinculada al despliegue automático de Vercel. Verificar la release activa con `scripts/check_live_progress_rules.js` y que el dominio público sirva la versión **2026.10.15.2** y los archivos nuevos. No se necesita modificar documentos de usuarios manualmente.

En los dispositivos, comprobar la versión en Ajustes y verificar con la misma cuenta que ambos muestran “Progreso sincronizado”. No borrar los datos locales mientras haya actividad pendiente.
