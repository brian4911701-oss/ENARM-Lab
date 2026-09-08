# Despliegue de seguridad de ENARMax

Este documento separa los cambios que pueden verificarse en el repositorio de los controles que requieren Firebase Console o credenciales de producción.

## Estado comprobado el 3 de septiembre de 2026

- `redeem_codes.txt` se retiró del código y del build de Hosting.
- El service worker usa una caché nueva, elimina cachés antiguas y responde 404 a la ruta comprometida.
- La simulación encontró 163 documentos legados con datos sensibles que deben migrarse.
- La simulación encontró 70 códigos: 31 canjeados que deben conservarse y 39 no canjeados que deben invalidarse y reemplazarse.
- La cuenta administradora identificada todavía requiere `admin=true` como custom claim.
- La llave privada de retiros está fuera del proyecto en `%USERPROFILE%\.enarmax-secrets\withdrawal-private.pem`.

## Preparación obligatoria

1. Respaldar la llave privada de retiros en un gestor de secretos. No copiarla al repositorio ni a Hosting.
2. Mover la credencial de Firebase Admin a `%USERPROFILE%\.enarmax-secrets\firebase-admin.json`, limitar sus permisos a la cuenta local y rotar la llave en Google Cloud IAM cuando las herramientas nuevas estén validadas.
3. Ejecutar las pruebas locales/CI:

   ```powershell
   npm ci
   npm run security:test
   npm run security:test-rules
   npm run build:hosting
   ```

   Las pruebas de reglas requieren Java 21. El workflow de GitHub Actions ya lo instala.

4. Compilar las reglas sin cambiar la release activa:

   ```powershell
   $env:GOOGLE_APPLICATION_CREDENTIALS="$env:USERPROFILE\.enarmax-secrets\firebase-admin.json"
   npm run rules:compile
   ```

## Orden de producción

1. Aplicar la claim a la cuenta administradora y volver a iniciar sesión:

   ```powershell
   npm run security:admin-claim -- --uid UID_ADMIN --apply
   ```

2. Publicar las reglas de contención. Esto bloquea lecturas cruzadas de `leaderboard`, códigos anteriores y escrituras de puntuación/Premium desde clientes.
3. Ejecutar la migración sin eliminar el origen:

   ```powershell
   node scripts/migrate_security_schema.js --apply
   ```

4. Verificar conteos y probar con usuario A, usuario B y administrador. Después limpiar la colección legada:

   ```powershell
   node scripts/migrate_security_schema.js --apply --scrub-legacy
   ```

5. Rotar los códigos expuestos. La herramienta conserva los 31 ya canjeados y crea el catálogo de reemplazo fuera del proyecto:

   ```powershell
   npm run codes:rotate -- --apply
   ```

6. Desplegar Hosting. Comprobar que `/redeem_codes.txt` responde 404, que el service worker activo es `enarmax-v63-security` y que no existe el archivo en Cache Storage.

## Firebase Console

- Authentication > Settings > Password policy: mínimo 12 caracteres; recomendar mayúscula, minúscula, número y símbolo.
- Authentication > Settings: activar protección contra enumeración de correos.
- Activar verificación en dos pasos en la cuenta Google administradora.
- App Check: registrar la aplicación web con reCAPTCHA v3, copiar la site key pública a `security-config.js`, desplegar y observar métricas. Aplicar enforcement de Firestore solo cuando los clientes legítimos estén recibiendo tokens.
- Conservar logs disponibles de Hosting, Authentication y Firestore durante la investigación del incidente. Documentar usuarios, alcance, fechas y acciones; si se confirma una vulneración significativa, iniciar evaluación y notificación legal.

## CSP

El despliegue inicial usa `Content-Security-Policy-Report-Only` para recoger violaciones sin romper Auth/PWA. Antes de convertirlo en `Content-Security-Policy`, deben extraerse los scripts inline restantes, sustituirse todos los `onclick` estáticos y retirarse `unsafe-inline` de estilos. No promover la política a enforcement hasta que las pruebas de Auth, App Check, PWA, Chart.js y Firebase estén limpias.

## Retiros

La web solo guarda `bankingEnvelope`. Para revisar una solicitud:

```powershell
npm run security:withdrawal -- --id ID_SOLICITUD
```

Después de efectuar y verificar la transferencia:

```powershell
npm run security:withdrawal -- --id ID_SOLICITUD --mark-paid
```

La segunda operación valida de nuevo el estado y descuenta el saldo en una transacción.
