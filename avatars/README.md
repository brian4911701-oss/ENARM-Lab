# Avatares de ENARMAX

Diez personajes originales generados con el motor geométrico de [Bible Strong Avatar Lab](https://github.com/smontlouis/bible-strong-avatar-lab), revisión `79fe9ba06e4874b11394b8e8a3f2c493c9d197ba`.

El catálogo incluye Orbi, Cubi, Nimbo, Gota, Osito, Mishi, Lupi, Boti, Brote y Axol. Cada diseño está exportado en once colores, incluido blanco, como SVG estático, con iluminación desde arriba a la izquierda y sombras suaves. Osito tiene ojos redondos, Boti ojos horizontales, Nimbo ojos entrecerrados y Mishi ojos ovalados inclinados; los demás conservan sus ojos alargados. Los cuerpos tienen formas redondeadas y voluminosas, como nubes y grumos. El encuadre se ajusta a cada silueta; la imagen puede sobresalir del marco de perfil sin recortarse. ENARMAX solo permite elegir personaje y color; el editor y su motor no se cargan en la app.

El menú mantiene un color distinto para cada personaje. La vista «Tu personaje» muestra el color personalizado sin recolorear los otros nueve.

Las formas, posiciones de las piezas y ojos están en `procedural-designs.json`. Para regenerar los 110 archivos de `procedural/`, instala el repositorio original en `tools/bible-strong-avatar-lab` y ejecuta desde la raíz (se usa Chrome para medir los contornos SVG):

```powershell
pnpm --dir tools/bible-strong-avatar-lab install --frozen-lockfile
node scripts/generate_profile_avatars.mjs
```

Para regenerar solo ciertos personajes, pasa sus identificadores: `node scripts/generate_profile_avatars.mjs oso robot nimbo gato`.

El motor original se distribuye bajo GNU AGPL v3.0; su código y licencia permanecen en la instalación local. Los SVG son exportaciones de los diseños de ENARMAX y no incluyen código del motor.

El catálogo guarda personaje y color en el `avatarId` existente (por ejemplo, `lab-ajolote-rosa`), por lo que se muestra igual en el perfil, ranking y comunidad y se sincroniza mediante el flujo de perfiles existente. Los identificadores del catálogo anterior se convierten en uno de los nuevos personajes al leerlos.
