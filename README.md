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

---

¡Disfruta del simulador y mucho éxito en tu preparación para el ENARM!
