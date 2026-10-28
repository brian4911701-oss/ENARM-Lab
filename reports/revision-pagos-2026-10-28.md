# Revisión de pagos — 28 de octubre de 2026

## Resultado en producción

La consulta fue de solo lectura. No se modificaron pagos, accesos, cuentas, Hosting ni reglas publicadas.

- Las dos cuentas indicadas tienen correo verificado, referencia de transferencia y Premium Anual 2027 activo hasta el 1 de octubre de 2027, otorgado mediante `admin_manual`.
- Ninguna de esas cuentas tiene documentos en `manual_payment_requests`.
- La colección completa contiene dos solicitudes antiguas, ambas rechazadas. No hay solicitudes pendientes ocultas de estas personas.
- Tener una referencia o Premium asignado manualmente no prueba que exista un aviso de pago ni que se haya verificado un depósito bancario.
- No es posible determinar con estos datos si esas personas intentaron enviar el aviso o cerraron el formulario antes de hacerlo.

## Fallas encontradas y corrección local

1. **Primer aviso bloqueado:** el cliente ejecutaba `getDoc` sobre la solicitud antes de crearla. Las reglas solo permiten al usuario leer documentos cuyo `uid` ya existe y coincide con su cuenta. La lectura de un documento inexistente falla y el código no llega a escribir la solicitud. Se sustituyó por una consulta filtrada por el UID del propio usuario, sin ampliar permisos.
2. **Reenvío tras rechazo:** guardar con `merge` conservaba `reviewedAt` y `reviewedByUid`, campos que las reglas no permiten en un aviso del usuario. Ahora se reemplaza el documento conservando su fecha original.
3. **Regla local inválida:** una llamada a `validPlanAmount` tenía tres argumentos aunque la función actual acepta dos. Se corrigió y comprobó con el emulador.
4. **Aprobación bloqueada:** `reviewManualPayment` llamaba a un helper de cupos definido en otro ámbito. Se movió el helper al ámbito compartido y se probó la aprobación y la creación del entitlement del titular.
5. **Paso fácil de omitir:** transferir desde el banco no envía el aviso. La pantalla ahora lo explica, usa el botón **Enviar aviso de pago** y guarda un recordatorio por cuenta para regresar al formulario.
6. **Error poco claro:** si Firebase rechaza el envío, el formulario permanece abierto y muestra un error persistente indicando que no se necesita volver a transferir.
7. **Correo sin verificar:** se comprueba antes de mostrar datos bancarios y al enviar el aviso.

## Publicación completada

El usuario autorizó publicar la corrección y aplicar los precios locales: mensual a $99, anual a $999 y Squad a $2,499 MXN.

Hosting y reglas se publicaron juntos mediante Firebase CLI el 28 de octubre de 2026, a las 13:54 de Ciudad de México. Se guardó la versión anterior en `.tmp-config/payment-release/` para poder revertir. La comparación previa confirmó que los cambios de comportamiento en las reglas estaban dentro del apartado de pagos; el resto solo tenía diferencias de formato o comentarios.

La comprobación posterior confirmó que `app.js`, `index.html`, `service-worker.js` y `styles.css` publicados coinciden byte por byte con los archivos locales, y que las reglas activas coinciden con las reglas probadas. Las rutas `package.json` y `redeem_codes.txt` continúan devolviendo 404. El service worker conserva `no-store` y rota la caché para distribuir la corrección.

- Hosting: `sites/enarm-lab-social/versions/116608860793f968`.
- Reglas: `projects/enarm-lab-social/rulesets/5c84cf69-5a98-47b9-9fe4-e6d2a435fe87`.
- Verificación: `scripts/verify_payment_release.js`; resultado guardado en `.tmp-config/payment-release/verified.json`.
- URL: https://enarm-lab-social.web.app/.

El despliegue no creó avisos de pago ficticios ni modificó accesos de las dos cuentas revisadas. La activación manual anterior se conserva.

## Alcance y observaciones adicionales

- La validación se centró en registrar avisos y aprobar el acceso del titular. No se realizaron transferencias bancarias ni se verificaron movimientos en BBVA.
- El código de aprobación revisado activa el acceso del titular del pago Squad. No incorpora la activación automática de las otras tres cuentas; la gestión de esos accesos requiere revisión adicional antes de considerar automatizado todo el producto Squad.
- El panel administrativo conserva su consulta de las 100 solicitudes más recientes. No causó estos dos casos, pero en un volumen mayor podría dejar fuera una pendiente antigua.

## Validación

- 13 pruebas de reglas pasaron, incluidas creación de los tres planes actuales, rechazo y reenvío, privacidad, correo verificado, importe y protección contra autoaprobación.
- Pruebas del navegador a 320, 390 y 1440 px: envío nuevo, recordatorio, bandeja administrativa, aprobación del titular, activación Premium y error visible de escritura.
- Pruebas de precios e interfaz a 320, 390, 768, 1100 y 1440 px.
- Contrato de seguridad, sintaxis JavaScript, `git diff --check` y build de Hosting correctos.

Pruebas nuevas: `tests/manual.payments.rules.test.js` y `scripts/test_manual_payments_browser.js`. Auditoría reutilizable de solo lectura: `scripts/audit_manual_payments.js`.
