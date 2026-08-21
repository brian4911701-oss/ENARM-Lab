# Activar transferencias Premium sin pagar Firebase

Este flujo utiliza Firebase Authentication, Cloud Firestore y Hosting. No usa Stripe, Cloud Functions, webhooks ni requiere cambiar el proyecto al plan Blaze.

## Flujo para tus usuarios

1. El usuario elige el plan 2026 ($399) o 2027 ($1,999).
2. Crea su cuenta o inicia sesión.
3. Firebase le genera una referencia personal de 10 dígitos.
4. Ve los datos de BBVA, CLABE, importe y referencia para el concepto.
5. Puede escribir un código de referido si tiene uno, confirmar que transfirió y aceptar términos.
6. Vuelve al simulador con plan Gratis y un aviso rojo de **Pago pendiente de comprobación**.
7. Solo después de que tú apruebes el depósito se activa Premium.

## Publicar los cambios

1. Instala Firebase CLI si aún no la tienes:

   ```powershell
   npm install -g firebase-tools
   ```

2. Inicia sesión y selecciona el proyecto:

   ```powershell
   firebase login
   firebase use enarm-lab-social
   ```

3. Publica únicamente estas dos partes:

   ```powershell
   firebase deploy --only firestore:rules
   firebase deploy --only hosting
   ```

No ejecutes `firebase deploy --only functions`: no se necesita para este sistema.

## Cómo aprobar un pago real

1. En BBVA revisa que el depósito ya se haya reflejado.
2. Comprueba que el importe sea correcto y el concepto coincida con la referencia de 10 dígitos.
3. Entra a ENARMax con tu cuenta administradora.
4. Abre **Más → Opciones de administrador → Transferencias Premium**.
5. Localiza la referencia, revisa el correo, plan e importe.
6. Pulsa **Aprobar**. Premium se activará en la cuenta del usuario.

Si el depósito no existe o los datos no coinciden, pulsa **Rechazar**. El usuario seguirá en Gratis.

## Prueba antes de usar dinero real

1. Registra una cuenta de prueba que no sea la administradora.
2. Elige un plan y llega hasta **Confirmar pago realizado**.
3. Confirma ambos cuadros y envía el aviso.
4. Comprueba que el tablero muestre el aviso rojo de pago pendiente y siga bloqueando Premium.
5. Con la cuenta administradora abre el panel de transferencias y pulsa **Aprobar**.
6. Regresa a la cuenta de prueba y comprueba que Premium se activó.

## Administrar usuarios y acceso Premium

En **Más → Opciones de administrador → Usuarios y acceso Premium** verás las cuentas de la más reciente a la más antigua, con nombre, correo, estado de pago y acceso actual.

- El interruptor activa o desactiva Premium inmediatamente.
- Al activarlo se asigna el plan del año objetivo del usuario (2026 o 2027); si el plan 2026 ya expiró, se asigna 2027.
- El estado de pago no cambia por usar el interruptor: sirve para distinguir un depósito aprobado de un acceso otorgado manualmente.
- Los correos se guardan en un directorio privado: solo el propio usuario y tu cuenta administradora pueden leerlos.

## Colecciones nuevas en Firestore

| Colección | Para qué sirve |
|---|---|
| `payment_profiles/{uid}` | Guarda la referencia única del usuario. |
| `transfer_references/{referencia}` | Impide que dos usuarios tengan la misma referencia. |
| `manual_payment_requests/{uid_plan}` | Guarda el aviso, plan, importe, referido y estado. |
| `entitlements/{uid}` | Guarda Premium solo después de tu aprobación. |
| `user_directory/{uid}` | Guarda nombre y correo para el panel administrativo, sin exponerlos en el ranking. |

Las reglas impiden que los usuarios se activen Premium por su cuenta. Solo el UID administrador ya configurado puede aprobar una solicitud.
