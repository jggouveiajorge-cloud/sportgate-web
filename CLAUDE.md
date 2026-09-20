# SPORTGATE (web) — guía de contexto para Claude Code

Segunda versión del MVP de SPORTGATE: marketplace de experiencias deportivas premium
asistido por IA (cicloturismo primero, pensado multideporte). Reconstruida en Next.js
tras descartar la primera versión en Flask/Jinja2 por su diseño. Dirección visual:
"deportivo oscuro" (Strava/Peloton), no el estilo agencia-de-viajes de Booking/Airbnb.

## Stack y cómo ejecutar

- Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS
- `npm install && npm run dev` → http://localhost:3000
- Sin backend: el estado del asistente (reto elegido, respuestas del checklist,
  selección de checkout) vive en `localStorage` vía `components/WizardProvider.tsx`
  (React Context). No hay base de datos ni autenticación todavía — es una decisión
  explícita para esta iteración, no un olvido.
- **Importante:** este proyecto se generó sin acceso a la registry de npm, así que
  nunca se corrió `npm install`/`npm run build` de verdad. La primera tarea de
  cualquier sesión de Claude Code aquí debería ser correr el build y arreglar lo que
  salga, antes de asumir que el código está limpio.

## Mapa de archivos

- `lib/types.ts` — tipos compartidos (`Partner`, `PartnerType`, `Challenge`, `Intake`)
- `lib/challenges.ts` — catálogo de retos (Alpes, Mallorca, Colorado, Santa Catarina)
- `lib/partners.ts` — parceiros de 5 tipos: `operador`, `coach`, `alquiler`, `producto`
  (tiendas de material — bicis, ropa, nutrición) y `salud` (profesionales de salud)
- `lib/match.ts` — motor de reglas explícito, NO una caja negra:
  - `findChallengeInText()` — placeholder del futuro agente de IA que interpretará
    lenguaje natural (hoy: coincidencia de texto contra `aliases`)
  - `matchPartners()` — filtra por región exacta + nivel mínimo
  - `needsHealthReferral()` — señal booleana; el resto de la app NUNCA debe ver las
    respuestas de salud en bruto, solo este booleano (categoría especial RGPD)
- `lib/webSearchSim.ts` — la simulación de "buscar más en internet" del botón en
  resultados. Devuelve placeholders EXPLÍCITAMENTE etiquetados como no verificados —
  nunca inventar nombres de empresas reales aquí, sería presentar datos ficticios
  como si fueran un hallazgo real
- `components/WizardProvider.tsx` — Context + `localStorage`, punto único de verdad
  del estado del asistente
- `app/page.tsx`, `app/checklist/[paso]/page.tsx`, `app/resultados/page.tsx`,
  `app/partner/[id]/page.tsx`, `app/checkout/page.tsx` — una ruta por pantalla
- `lib/adminStore.ts` — capa de administración/CMS ligero (`/admin/*`), mismo patrón
  sin backend que el resto: parceiros, desafíos y servicios "sembrados" desde
  `lib/partners.ts`/`lib/challenges.ts` la primera vez y editables desde el panel
  (foto, destacado, estado). Ver sección propia más abajo.

## Reglas de diseño que no hay que romper

- Todo color sale de `tailwind.config.ts` (paleta `bg`/`ink`/`accent`/`teal`/`amber`/
  `line`) — nunca un hex nuevo suelto en una clase o en `globals.css`. Si falta un
  tono, se añade como token.
- Tema oscuro por defecto (no hay modo claro en esta versión). El fondo casi negro
  (`bg-0`) y el contraste alto son la base de la dirección "deportivo", no un detalle.
- El naranja (`accent`) es la ÚNICA acción por pantalla (el CTA principal, la
  etiqueta "Recomendado por la IA"). El teal (`teal`) es el color de "dato/verificado"
  (barras de rendimiento, sparkline, badge verificado). El ámbar (`amber`) es para
  avisos de salud/atención. No mezclar estos roles.
- `.option-card`, `.stepper-node` y `.hero-bg` (en `app/globals.css`) usan `:has()` y
  `clip-path` — son la excepción a "todo en Tailwind"; reutilizarlas en vez de crear
  variantes nuevas de radios/checkboxes o del stepper.

## Reglas de negocio/legales que no hay que romper sin que Jorge lo pida explícitamente

- **Linked Travel Arrangement (LTA):** en el checkout cada partner se cobra por
  separado — nunca un precio único empaquetado (`components/CheckoutClient.tsx`).
- **Art. 50 AI Act:** toda recomendación algorítmica lleva la etiqueta "Recomendado
  por la IA" (`PartnerCard` con `showAiBadge`), visualmente distinta de "Patrocinado".
- **Reseñas verificadas:** solo pueden existir ligadas a una reserva confirmada
  (badge verificado) — no añadir reseñas sin ese vínculo en `lib/reviews.ts`.
- **Datos de salud (RGPD):** el paso 3 del checklist pide consentimiento explícito
  separado; el resto de la app solo ve `needsHealthReferral()`, nunca las respuestas.
- **Búsqueda en internet:** el botón "Buscar más en internet" debe seguir devolviendo
  resultados claramente marcados como no verificados/de ejemplo — nunca una llamada
  real sin verificación ni nombres de empresas reales inventados.

## Cómo añadir cosas típicas

- **Un reto nuevo:** objeto en `lib/challenges.ts` con `aliases` y un
  `elevation_profile` (array 0-100 ilustrativo para el sparkline).
- **Un partner nuevo:** objeto en `lib/partners.ts` — el `region` debe coincidir
  carácter a carácter con la de algún reto para que el matching lo encuentre.
- **Un tipo de partner nuevo:** (1) añadir a `PartnerType` en `lib/types.ts`,
  (2) degradado + icono en `components/PartnerTypeIcon.tsx`, (3) nueva `<Section>`
  en `app/resultados/page.tsx`.
- **Un paso nuevo del wizard:** subir `TOTAL_PASOS` en
  `app/checklist/[paso]/page.tsx`, añadir el título en `PASOS_TITULOS`
  (`components/Stepper.tsx`), y el bloque `{paso === N && (...)}` correspondiente.
  Los campos nuevos van directo a `Intake` en `lib/types.ts`.

## Área de administración (Fase 1 — demo sin backend)

- `/admin` (login simulado, papel `gestor`/`administrador`) → `/admin/painel`,
  `/admin/parceiros`, `/admin/desafios`, `/admin/servicos` y (solo administrador)
  `/admin/relatorios`. Todo el marco compartido (guarda de sesión, nav por papel,
  logout) vive en `components/AdminShell.tsx`.
- `lib/adminStore.ts` es la única fuente de datos — localStorage, sin servidor.
  **Importante:** los cambios que un gestor haga en su navegador NO se propagan a
  otros visitantes (no hay base de datos compartida) — esto es una simulación de
  flujo para demo/inversor, no un CMS real. Ver resumen del proyecto para el
  detalle completo de esta decisión y la Fase 2 (base de datos + auth real +
  almacenamiento de imágenes).
- Registrarse en `/hazte-partner` crea un `AdminPartner` con `estado: "pendiente"`
  en este store — así se conecta el alta de partner con la cola de revisión del
  gestor en `/admin/parceiros`.
- Subida de fotos (`components/PhotoUpload.tsx`) guarda el archivo como data URL en
  localStorage — funciona para la demo con pocas fotos, pero no escala; en la
  Fase 2 necesita almacenamiento de archivos real (S3/Cloudinary/Supabase Storage).
- La home (`app/page.tsx`) lee parceiros/desafíos/servicios destacados de este store
  vía `useEffect` (con un valor inicial estático idéntico a los datos "sembrados"
  para no romper la hidratación) — mostrando foto en vez de icono cuando existe.

## Pendientes conocidos

- Sin base de datos ni cuentas reales (decisión explícita de esta iteración) — el
  siguiente paso natural si Jorge quiere "realismo técnico" sería Postgres + auth.
- El panel de administración (`/admin`) es una simulación de flujo, no un CMS real:
  sin base de datos compartida, sin autenticación real, sin almacenamiento de
  archivos real. Ver "Área de administración" arriba y el resumen del proyecto.
- "Buscar más en internet" es una simulación, no una integración real.
- Sin integraciones reales: Strava/Garmin/TrainingPeaks, procesador de pagos de
  marketplace, agente de IA real.
- Nunca se corrió `npm run build` de verdad (ver nota de arriba) — es la primera
  tarea recomendada antes de tocar nada más.

## Al pedir cambios

Sé específico sobre qué archivo(s) tocar y qué NO debe cambiar (p. ej. "añade un reto
en Sudáfrica sin tocar el checkout"). Después de cualquier cambio, corre
`npm run build` (o al menos `npm run dev` y prueba el flujo a mano) antes de darlo
por bueno — este proyecto todavía no tiene esa verificación hecha ni una vez.
