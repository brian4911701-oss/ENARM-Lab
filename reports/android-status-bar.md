# Barra de estado de Android: investigación y corrección local

## Resultado de las pruebas en el teléfono

El usuario confirmó en www.enarmax.com, modo standalone y Chrome 152.0.7977.76, que el encabezado, el meta único y el fondo raíz eran verdes (#0a3325), pero la barra nativa conservaba el azul. Desactivar el modo oscuro del sistema no lo resolvió. Activar `chrome://flags/#web-app-short-edges-cutout-mode` sí resolvió el color según el usuario. Es una alternativa experimental comprobada en su instalación, no una solución automática para todos los usuarios; la página no puede activar esa preferencia de Chrome.

La versión exacta declara la función desactivada por defecto y la describe como soporte de áreas seguras para PWAs con viewport-fit=cover:
- https://github.com/chromium/chromium/blob/152.0.7977.76/chrome/browser/flags/android/chrome_feature_list.cc
- https://github.com/chromium/chromium/blob/152.0.7977.76/chrome/browser/flag_descriptions.h

Tras activar la opción, el usuario reportó botones demasiado altos. El CSS los posicionaba al 50% de la altura total (incluida el área segura), mientras el logo se centraba en el área de contenido. Se cambió el centro de los botones a safe-area-inset-top + 30px. La prueba de navegador usa el encabezado real y Emulation.setSafeAreaInsetsOverride con 0, 24 y 48px; verifica centros iguales y controles fuera del área del reloj.

La captura muestra un encabezado verde y una barra de estado oscura. El código local permite identificar inconsistencias, pero no confirmar cuál produjo esa captura sin inspeccionar la PWA instalada en el teléfono. El usuario indica que Galaxy y Pixel están actualizados; no se dispone de números exactos de Android/Chrome ni de una sesión de depuración en esos dispositivos.

## Hallazgos

- Ambos manifiestos declaraban `#111623`, aunque el tema inicial de la app es ocean (`#1d258d`, fondo `#191f78`). Esto afecta el respaldo y el arranque; por sí solo no explica un color fijo después de cargar, porque el meta HTML puede sustituirlo.
- No había un meta estático de respaldo; el script inicial dependía de localStorage sin protección frente a errores.
- La sincronización eliminaba todos los metas y creaba otro. La afirmación en el comentario de que esto fuerza la actualización en Android no estaba respaldada por una prueba del dispositivo.
- La paleta inicial de aurora no coincidía con el CSS efectivo. Los temas retirados ember y black-white tampoco se migraban al claro lila durante el arranque.
- El encabezado móvil ya usa `--app-chrome-bg`, un color opaco, y contempla el área segura superior. No se necesita añadir una franja artificial ni ocultar la barra del sistema.

## Cambios

Se conserva un único meta theme-color con respaldo ocean, se actualiza antes de cargar la app según la preferencia guardada y se tolera almacenamiento bloqueado. El código reutiliza ese nodo al cambiar de tema y vuelve a sincronizarlo en pageshow y al recuperar visibilidad. Los manifiestos se alinean con ocean; el tema forest sigue enviando `#0a3325`, igual que el encabezado. Se incrementó la versión de caché del service worker. No se publicó a producción.

## Chrome y versiones

- Chrome 135 introdujo cambios edge-to-edge documentados para la zona inferior de navegación por gestos. Esa documentación no demuestra que la barra superior deba ignorar theme-color: https://developer.chrome.com/docs/css-ui/edge-to-edge
- El manifiesto define un color predeterminado y el meta de la página puede sustituirlo. El navegador conserva control sobre cómo lo representa: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/theme_color
- Las actualizaciones del manifiesto de una WebAPK instalada tienen su propio ciclo. La documentación describe comprobaciones de 24 horas y condiciones adicionales para aplicar la actualización; no es una garantía de entrega inmediata: https://web.dev/articles/manifest-updates
- Chromium también ha trabajado en soporte experimental del área del recorte superior para WebApps en 2026. La existencia de ese trabajo no permite atribuir este caso a una versión estable ni recomendar flags como solución: https://chromium.googlesource.com/chromium/src/+/34a0eb893409a8ed9a79b039083248f1583552b5

## Verificación

`npm test` pasa (analítica, contrato PWA y seguridad). `node scripts/test_pwa_theme_browser.js` pasa con 19 escenarios en Chrome headless: temas, preferencias del sistema, migraciones y almacenamiento bloqueado. Comprueba el color inicial, coincidencia con el fondo CSS real del encabezado y persistencia de un único nodo meta durante cambios sucesivos. Este ensayo aísla el código de color de Firebase y no reproduce la barra nativa de Android ni valida visualmente el retorno desde otra app.

Tras publicar: abrir la app instalada con conexión, probar ocean → forest → claro, cerrar y reabrir, y volver desde otra app. Si el encabezado cambia pero la barra sigue fija, inspeccionar la instalación mediante `about://webapks` y el DOM con depuración remota. Registrar versiones exactas, modo standalone, color del meta y color CSS. Comparar una instalación nueva con la existente ayuda a distinguir metadatos antiguos de una limitación del navegador. No es necesario borrar datos de estudio para esta comprobación.
