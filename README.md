# ENARM Simulador Premium

Este proyecto es un simulador web del **Examen Nacional de Aspirantes a Residencias Médicas (ENARM)** basado en las Guías de Práctica Clínica (GPC) más recientes de México.

## Características principales

- **Modo Simulacro**: 280 preguntas cronometradas (4 h) sin retroalimentación inmediata, con resultados detallados al finalizar.
- **Modo Estudio**: Preguntas por especialidad con retroalimentación instantánea y referencias a la GPC correspondiente.
- **Selección de especialidades** y número de preguntas personalizable.
- **Interfaz premium**: diseño oscuro con glassmorphism, micro‑animaciones y tipografía moderna (Inter & JetBrains Mono).
- **Estadísticas** por especialidad y visualización de desempeño.
- **Marca de preguntas** para revisión posterior.

## Estructura del proyecto

```
ENARMax/
├─ index.html      # página principal y estructura de pantallas
├─ styles.css      # estilos premium (dark mode, animaciones)
├─ questions.js    # base de datos de preguntas (ejemplo)
├─ app.js          # lógica de la aplicación (navegación, timer, resultados)
└─ README.md       # este archivo
```

## Cómo ejecutar

1. **Servidor local con inicio de sesión y API**
   ```powershell
   npm run dev
   ```
   Luego visita `http://127.0.0.1:5501/`. Recarga el navegador para ver los cambios en HTML, CSS y JavaScript, sin compilar ni hacer commit. Reinicia el servidor si cambias código de `api/` o `server/`.

   El servidor ejecuta las mismas API de acceso, estudio y prueba Premium que producción.

   **Con Live Server de Antigravity:** mantén `npm run dev` ejecutándose y usa **Go Live** como siempre, en `http://127.0.0.1:5500/`. La configuración de `.vscode/settings.json` reenvía `/api` al servidor de `5501` y conserva la recarga automática de Live Server. Después de cambiar esa configuración, detén Live Server pulsando **Port: 5500** y vuelve a pulsar **Go Live**; recargar solo el navegador no activa el proxy. Live Server sin ese proxy devuelve HTTP 405 al intentar iniciar sesión.

   También puedes usar únicamente `npm run dev -- --port 5500`, después de detener Live Server.

2. **Credenciales locales**
   El servidor lee `FIREBASE_SERVICE_ACCOUNT_JSON` o `GOOGLE_APPLICATION_CREDENTIALS` del entorno, `.env.local` o `.env`. Si ya existe un único archivo `*firebase-adminsdk*.json` en la raíz, lo usa automáticamente. Para indicar otra ubicación, crea `.env.local` (ignorado por Git):
   ```dotenv
   GOOGLE_APPLICATION_CREDENTIALS=D:/ruta/privada/firebase-admin.json
   ```
   La credencial se mantiene en el servidor. Solo se sirven los archivos públicos que incluye el build de Hosting. Este modo utiliza el proyecto Firebase real: el inicio de sesión y el progreso tienen los mismos efectos que en la app publicada, incluida la confirmación al reemplazar una sesión.

3. **Uso**
   - En la pantalla de inicio elige **Simulacro ENARM** o **Modo Estudio**.
   - En la configuración puedes seleccionar las especialidades y cuántas preguntas deseas.
   - Durante el simulacro el cronómetro cuenta regresivamente; al terminar se muestra el resumen.
   - En modo estudio obtienes la explicación y la referencia a la GPC inmediatamente después de responder.

## Personalización

- **Agregar preguntas**: edita `questions.js` siguiendo el mismo formato (campo `specialty` con uno de `mi`, `ped`, `gyo`, `cir`, `sp`, `urg`).
- **Cambiar colores o tipografía**: modifica las variables CSS en `styles.css` bajo `:root`.
- **Extender funcionalidades**: puedes crear nuevos módulos JS y conectarlos desde `app.js`.

## Sistema de códigos Premium

- Los códigos están en `redeem_codes.txt`.
- Formato:
  - `ENARM-M1-XXXXXXXX` = 1 mes desde el canje
  - `ENARM-D3-XXXXXXXX` = 3 días desde el canje
  - `ENARM-FX-XXXXXXXX` = acceso hasta 1 Oct 2026
- El canje se hace en la app (modal "Canjear código").

### Generar nuevos códigos

- Usa `npm run codes:generate -- --month 10 --three-day 5 --append` para generar 10 códigos de 1 mes y 5 códigos de 3 días, agregarlos a `redeem_codes.txt` e imprimirlos en consola.
- Si solo quieres ver el lote sin modificar el archivo, quita `--append`.
- Después de generarlos, inicia sesión como admin, abre tu perfil, pégalos en **Admin - Cargar Códigos** y presiona **Subir códigos** para que queden disponibles en Firebase.

### Configuración admin (una sola vez)

1. Inicia sesión en la app con tu cuenta admin.
2. Abre el perfil y copia tu UID.
3. En `app.js`, reemplaza `ADMIN_UIDS` con tu UID.
4. En la consola de Firebase, actualiza las reglas de Firestore. Ejemplo:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && request.auth.uid in ["TU_ADMIN_UID"];
    }
    match /redeem_codes/{code} {
      allow read: if request.auth != null;
      allow create, delete: if isAdmin();
      allow update: if isAdmin()
        || (request.auth != null
        && resource.data.redeemedBy == ""
        && request.resource.data.redeemedBy == request.auth.uid);
    }
    match /entitlements/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow create, update: if request.auth.uid == uid
        && request.resource.data.source == "code"
        && get(/databases/$(database)/documents/redeem_codes/$(request.resource.data.code)).data.redeemedBy == request.auth.uid;
    }
    match /feature_flags/{flagId} {
      allow read: if request.auth != null;
      allow create, update, delete: if isAdmin();
    }
  }
}
```

5. Abre el perfil y verás la sección **Admin - Cargar codigos**. Pega los códigos y presiona **Subir codigos**.
6. En **Configuración** también tendrás la tarjeta **Promoción Premium Global** para activar premium para todos por N días y apagarlo cuando quieras.
---
¡Disfruta del simulador y mucho éxito en tu preparación para el ENARM!



