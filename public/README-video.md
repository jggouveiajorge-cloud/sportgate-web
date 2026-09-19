# Video de fondo del hero (con rolagem entre dos clips)

Para activar el video de fondo del hero (sección "Video de fondo en el hero"
del resumen), pon aquí tus archivos con estos nombres exactos:

- `hero-video-1.mp4` y `hero-video-1.webm` (primer clip)
- `hero-video-2.mp4` y `hero-video-2.webm` (segundo clip)

El `.mp4` de cada clip es el obligatorio (lo soportan todos los
navegadores); el `.webm` es opcional, más ligero, y se usa si el navegador
lo soporta.

No hace falta tocar código: `components/Hero.tsx` ya busca estos cuatro
archivos en `/hero-video-1.*` y `/hero-video-2.*`. Comportamiento según lo
que exista en esta carpeta:

- **Ningún archivo**: el hero se queda con el fondo de gradiente/crestas
  actual — sin errores ni pantallazos rotos.
- **Solo uno de los dos clips** (por ejemplo, solo `hero-video-1.*`): ese
  clip se reproduce en bucle (el otro slot falla al cargar y volvemos
  automáticamente al único que sí existe).
- **Los dos clips**: se alternan — cuando termina de reproducirse uno,
  pasa suavemente (fade-in) al otro, y así sucesivamente. Esto evita que
  el fondo se sienta estático.

¿Quieres una tercera variante (o más)? Basta con añadir el archivo aquí
(`hero-video-3.mp4`/`.webm`, etc.) y sumar `"/hero-video-3"` al array
`HERO_VIDEOS` en `components/Hero.tsx` — todo el mecanismo de rotación ya
está preparado para cualquier cantidad de clips.

Recomendaciones para que carguen rápido y se vean bien:

- Duración corta por clip: 8-15 segundos suele bastar.
- Sin audio (el `<video>` va silenciado igualmente, así que un archivo sin
  pista de audio pesa menos).
- Resolución 1920×1080 o similar, comprimido (H.264/mp4, calidad media) —
  idealmente por debajo de 5-8 MB por clip para que no ralentice la carga
  de la home.
- Estos archivos NO se suben a este repositorio de ejemplo — cópialos tú
  directamente en esta carpeta (`public/`) antes de compilar/desplegar.

Recuerda usar solo vídeo con licencia clara para uso comercial (por ejemplo,
de Pexels o Coverr, revisando la licencia de cada clip concreto).
