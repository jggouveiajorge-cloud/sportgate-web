# SPORTGATE — demo web (Next.js)

Segunda versión del MVP, reconstruida desde cero con un stack moderno y una dirección
visual "deportivo oscuro" (estilo Strava/Peloton) en vez de la anterior versión en
Flask/Jinja2. Cubre el mismo flujo — búsqueda en lenguaje natural → checklist de intake
→ resultados con matching por región/nivel → checkout con líneas separadas por partner
(modelo Linked Travel Arrangement) — ampliado a operadores, coaches, **tiendas de
material** y **profesionales de salud**, en cuatro regiones: Alpes (Francia/Italia),
Mallorca (España), Colorado (EE. UU.) y Santa Catarina (Brasil).

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** para el sistema de diseño (tokens oscuros en `tailwind.config.ts` +
  `app/globals.css` para los componentes que necesitan `:has()` o `clip-path`)
- Sin base de datos: el estado del asistente (reto, checklist, selección de checkout)
  vive en `localStorage` a través de `components/WizardProvider.tsx` — es una demo, no
  hay cuentas de usuario todavía (ver "Pendientes")

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abre http://localhost:3000. Para una build de producción: `npm run build && npm start`.

> Este proyecto se generó en un entorno sin acceso a la registry de npm, así que **no
> se pudo ejecutar `npm install`/`npm run build` durante su creación**. Se verificó la
> lógica de datos y el renderizado de cada página con un script de humo aparte
> (React + esbuild, sin Next.js), pero la primera vez que lo ejecutes en tu máquina es
> importante correr `npm run build` y revisar la consola antes de darlo por bueno.

## Mapa de archivos

- `lib/types.ts` — tipos compartidos (`Partner`, `Challenge`, `Intake`, etc.)
- `lib/challenges.ts` — catálogo de retos (6, repartidos en las 4 regiones)
- `lib/partners.ts` — parceiros: `operador`, `coach`, `alquiler`, `producto` (tiendas de
  material) y `salud` (profesionales de salud) — 22 en total
- `lib/match.ts` — motor de reglas explícito: `findChallengeInText` (placeholder del
  futuro agente de IA), `matchPartners` (región + nivel mínimo), `needsHealthReferral`
  (señal booleana, nunca las respuestas de salud en bruto)
- `lib/webSearchSim.ts` — simulación de "buscar más en internet" (resultados
  explícitamente etiquetados como no verificados/de ejemplo — nunca nombres reales)
- `components/WizardProvider.tsx` — estado del asistente en React Context +
  `localStorage`
- `app/page.tsx` — home con el hero de búsqueda
- `app/checklist/[paso]/page.tsx` — wizard de 6 pasos
- `app/resultados/page.tsx` — resultados + botón de búsqueda en internet (beta)
- `app/partner/[id]/page.tsx` — ficha de partner + reseñas verificadas
- `app/checkout/page.tsx` — checkout con líneas LTA separadas

## Cómo añadir cosas típicas

- **Un reto nuevo:** añade un objeto a `lib/challenges.ts` (incluye `elevation_profile`,
  un array de 10-20 números 0-100 para el sparkline — es ilustrativo, no un dato GPS real).
- **Un partner nuevo:** añade a `lib/partners.ts` con su `type`, `region` (debe coincidir
  exactamente con la de algún reto) y `why` (el texto de transparencia de la IA).
- **Un tipo de partner nuevo:** añade el tipo a `lib/types.ts` (`PartnerType`), su
  degradado/icono en `components/PartnerTypeIcon.tsx`, y su sección en
  `app/resultados/page.tsx`.
- **Un paso nuevo del wizard:** sube `TOTAL_PASOS` y añade el título en
  `components/Stepper.tsx` (`PASOS_TITULOS`), más el bloque `{paso === N && (...)}` en
  `app/checklist/[paso]/page.tsx`.

## Pendientes conocidos

- Sin backend real: todo vive en `localStorage` del navegador — no hay cuentas ni
  persistencia entre dispositivos (se eligió así para esta iteración; ver `CLAUDE.md`
  para la opción de añadir base de datos + autenticación real).
- "Buscar más en internet" es una simulación (`lib/webSearchSim.ts`) — no hay
  integración real con un motor de búsqueda ni proceso de verificación de esos
  resultados.
- Sin integraciones reales: Strava/Garmin/TrainingPeaks (botones de demo), procesador
  de pagos de marketplace (Stripe Connect/Adyen/MangoPay), agente de IA real para
  `findChallengeInText`.
- No se ejecutó `npm run build` en el entorno donde se generó este proyecto (ver nota
  arriba) — conviene correrlo como primer paso.
