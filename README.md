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
ENARM Lab/
├─ index.html      # página principal y estructura de pantallas
├─ styles.css      # estilos premium (dark mode, animaciones)
├─ questions.js    # base de datos de preguntas (ejemplo)
├─ app.js          # lógica de la aplicación (navegación, timer, resultados)
└─ README.md       # este archivo
```

## Cómo ejecutar

1. **Abrir en el navegador**
   - Simplemente abre `index.html` con tu navegador favorito (Chrome, Edge, Firefox, etc.).
   - No se requiere servidor adicional porque todo el código es estático.

2. **Opcional – Servidor local** (para evitar restricciones de CORS en algunos navegadores)
   ```bash
   # Si tienes Node.js instalado
   npx -y http-server ./ -p 8080
   ```
   Luego visita `http://localhost:8080`.

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



