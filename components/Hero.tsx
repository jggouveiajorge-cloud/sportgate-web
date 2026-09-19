"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CHALLENGES } from "@/lib/challenges";
import { REGIONS } from "@/lib/regions";
import { findChallengeInText } from "@/lib/match";
import type { PartnerType } from "@/lib/types";
import { useWizard } from "./WizardProvider";
import { useLocale } from "@/lib/i18n/LocaleContext";

// Rolagem entre videos de fondo (sección 8/13 del resumen): en vez de un
// único video en bucle, alternamos entre estas dos "bases" cada vez que el
// video activo termina, para que el hero no se sienta tan estático. Es
// fácil añadir una tercera (o más) simplemente sumando otra entrada aquí —
// nada más del código necesita cambiar.
const HERO_VIDEOS = ["/hero-video-1", "/hero-video-2"];

// Los labels se traducen dentro del componente (necesitan el hook de
// idioma); aquí solo dejamos el mapeo value → clave del diccionario.
const TIPOS_EXPERIENCIA_KEYS: { value: PartnerType | ""; key: string }[] = [
  { value: "", key: "hero.cualquiera" },
  { value: "operador", key: "hero.retoGuiado" },
  { value: "coach", key: "hero.conCoach" },
  { value: "alquiler", key: "hero.soloAlquiler" },
];

function BarField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-1 flex-col gap-0.5 px-4 py-2.5 text-left">
      <span className="text-[11px] font-bold uppercase tracking-wide text-white/45">{label}</span>
      {children}
    </label>
  );
}

const selectClass =
  "w-full appearance-none bg-transparent text-[15px] font-medium text-white focus:outline-none [&>option]:text-ink [&>option]:bg-white";

export function Hero() {
  const router = useRouter();
  const { t } = useLocale();
  const { setQuery, setChallengeId, setFiltros, updateIntake } = useWizard();
  const [query, setLocalQuery] = useState("");
  const [chips, setChips] = useState(CHALLENGES);
  const TIPOS_EXPERIENCIA = TIPOS_EXPERIENCIA_KEYS.map((opt) => ({ value: opt.value, label: t(opt.key) }));

  // Video de fondo con rolagem: si ninguno de los archivos de HERO_VIDEOS
  // existe (todavía no se han subido archivos reales), cada <video> falla
  // a cargar y volvemos al fondo con gradiente/crestas de siempre — sin
  // pantallazo roto ni dependencia de que los archivos existan.
  const [activeVideo, setActiveVideo] = useState(0);
  const [videoLayerHidden, setVideoLayerHidden] = useState(false);
  // useRef (no useState) para evitar cierres obsoletos ("stale closures")
  // dentro de los handlers de <video>: necesitamos leer el set más reciente
  // de índices fallidos en el mismo evento en el que lo actualizamos.
  const failedRef = useRef<Set<number>>(new Set());
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Bug conocido de React con <video>: el primer clip reproduce bien porque
  // viene parte del HTML original de la página (el navegador lee el atributo
  // "muted" directo del marcado). Pero cuando React remonta un <video> nuevo
  // (al rotar de clip), algunos navegadores no reflejan ese atributo en la
  // propiedad real "muted" del elemento recién creado, y la política de
  // autoplay lo bloquea en silencio — sin error, el clip simplemente nunca
  // arranca. Forzamos aquí explícitamente muted + play() cada vez que
  // cambia el video activo, para evitar depender solo del atributo JSX.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    const playPromise = el.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch((err) => {
        // Diagnóstico temporal: si el video se queda "parado" en vez de
        // rotar, abre la consola del navegador (F12 → Console) justo cuando
        // pase — este log dice exactamente por qué el navegador bloqueó la
        // reproducción (política de autoplay, formato no soportado, etc.).
        // eslint-disable-next-line no-console
        console.warn(`[hero-video] play() rechazado para "${HERO_VIDEOS[activeVideo]}":`, err?.name, err?.message);
      });
    }
  }, [activeVideo]);

  // Avanza al siguiente video válido tras el actual (por fin natural del
  // clip o por error de carga). Si ya probamos todos y ninguno sirve,
  // ocultamos la capa de video entera y nos quedamos con el gradiente.
  function advance(from: number) {
    for (let i = 1; i <= HERO_VIDEOS.length; i++) {
      const next = (from + i) % HERO_VIDEOS.length;
      if (!failedRef.current.has(next)) {
        setActiveVideo(next);
        return;
      }
    }
    setVideoLayerHidden(true);
  }

  function handleVideoEnded() {
    // Fin natural del clip (sin "loop") → es el momento de rotar al
    // siguiente, en vez de depender de un temporizador arbitrario.
    // eslint-disable-next-line no-console
    console.info(`[hero-video] "${HERO_VIDEOS[activeVideo]}" terminó, pasando al siguiente…`);
    advance(activeVideo);
  }

  function handleVideoError(e: React.SyntheticEvent<HTMLVideoElement>) {
    // Leemos el error directo del elemento que disparó el evento
    // (e.currentTarget), no de la ref (con la rotación remontando un
    // <video> nuevo en cada cambio, la ref puede apuntar a otro elemento).
    const mediaError = e.currentTarget.error;

    // Bug real encontrado en desarrollo: en modo desarrollo, React (Strict
    // Mode) monta, desmonta y vuelve a montar los componentes una vez extra
    // al arrancar, a propósito, para detectar efectos mal limpiados. Eso
    // puede interrumpir un <video> que recién empezó a cargar, disparando
    // "error" aunque el archivo esté perfecto — en ese caso el navegador NO
    // rellena el objeto MediaError (mediaError queda null/undefined). Solo
    // tratamos esto como un fallo real del archivo cuando SÍ hay un
    // MediaError con código (1=abortado, 2=red, 3=decodificación,
    // 4=formato no soportado); si no lo hay, ignoramos el evento — no era
    // el archivo, fue una interrupción pasajera.
    if (!mediaError) {
      // eslint-disable-next-line no-console
      console.info(
        `[hero-video] "${HERO_VIDEOS[activeVideo]}" interrumpido sin MediaError (probablemente el doble montaje de desarrollo de React) — se ignora, no se marca como roto.`
      );
      return;
    }

    // eslint-disable-next-line no-console
    console.error(`[hero-video] error real cargando "${HERO_VIDEOS[activeVideo]}" — código ${mediaError.code}:`, mediaError.message);
    failedRef.current.add(activeVideo);
    advance(activeVideo);
  }

  // Buscador avanzado — Where / When / What / Who (ver resumen, sección 10)
  const [destino, setDestino] = useState("");
  const [fecha, setFecha] = useState("");
  const [tipoExperiencia, setTipoExperiencia] = useState<PartnerType | "">("");
  const [soloGrupo, setSoloGrupo] = useState<"" | "solo" | "grupo">("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery && !destino) {
      setError(t("hero.errorSinDestino"));
      return;
    }
    setError(null);

    // Modo 1: solo destino → modo explorar (checklist filtrado por región).
    // Modo 2: solo texto → como hoy, la IA infiere el reto.
    // Modo 3: ambos → el destino filtra y el texto refina; si no coinciden,
    // avisamos sin bloquear (aviso suave, ver "Tres modos de uso").
    const challenge = trimmedQuery ? findChallengeInText(trimmedQuery) : null;
    const conflicto = !!(challenge && destino && challenge.region !== destino);

    setFiltros({
      region: destino || undefined,
      fecha: fecha || undefined,
      tipoExperiencia: tipoExperiencia || undefined,
      soloGrupo: soloGrupo || undefined,
      conflicto,
    });

    // Primero limpiamos el checklist de una búsqueda anterior (setQuery) y
    // después sembramos la fecha de esta búsqueda, para que nunca se pierda
    // ni quede una fecha obsoleta de una búsqueda previa.
    setQuery(trimmedQuery, challenge ? challenge.id : null);
    if (fecha) updateIntake({ fecha_objetivo: fecha });

    router.push("/checklist/1");
  }

  function handleChip(id: string) {
    setChallengeId(id);
    router.push("/checklist/1");
  }

  function shuffle() {
    setChips((prev) => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
  }

  return (
    // Hero a todo el ancho de la pantalla ("full-bleed"), aunque esté anidado
    // dentro del <main> centrado y con padding (ver app/layout.tsx). El
    // truco: ancho = 100vw y márgenes negativos que compensan exactamente la
    // distancia entre el borde del contenedor centrado y el borde real de la
    // pantalla — funciona sin tocar el layout compartrido ni ninguna otra
    // página, que siguen centradas como hasta ahora. Quitamos el borde y las
    // esquinas redondeadas de antes: a todo el ancho, se ven raras.
    <div
      className="relative w-screen overflow-hidden ml-[calc(-50vw+50%)] mr-[calc(-50vw+50%)]"
      id="buscar"
    >
      <div className="hero-bg" aria-hidden>
        <div className="sky" />
        <div className="ridge r1" />
        <div className="ridge r2" />
      </div>

      {/* Video de fondo con rolagem — opcional. Coloca tus archivos en
          public/hero-video-1.mp4 (+.webm) y public/hero-video-2.mp4 (+.webm)
          para activarlo; sin archivos, se queda el fondo de gradiente de
          arriba. Con un solo archivo, ese se repite en bucle (el otro slot
          falla al instante y volvemos al único válido); con dos, se alternan
          cada vez que termina el que está reproduciéndose. La "key" fuerza a
          React a remontar el <video> en cada rotación para que cargue la
          nueva fuente y se note la transición (fade-in suave, ver
          globals.css). */}
      {!videoLayerHidden && (
        <video
          key={activeVideo}
          ref={videoRef}
          className="absolute inset-0 z-[1] h-full w-full animate-hero-video-in object-cover"
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-hidden
          onEnded={handleVideoEnded}
          onError={handleVideoError}
        >
          <source src={`${HERO_VIDEOS[activeVideo]}.webm`} type="video/webm" />
          <source src={`${HERO_VIDEOS[activeVideo]}.mp4`} type="video/mp4" />
        </video>
      )}
      {!videoLayerHidden && <div className="absolute inset-0 z-[2] bg-black/45" aria-hidden />}

      {/* Hero más compacto (ver feedback de Jorge): mismo tratamiento visual
          (video/gradiente de fondo cubriendo toda la franja), pero con menos
          padding vertical y tipografía algo más contenida, para que no
          domine tanto la pantalla — proporción más cercana a referencias
          como Backroads. */}
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-10 text-center sm:py-14">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[13px] font-semibold text-white backdrop-blur-sm">
          {t("hero.badge")}
        </span>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
          {t("hero.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/70 sm:text-base">{t("hero.subtitle")}</p>

        <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-xl">
          {/* Where / When / What / Who */}
          <div className="flex flex-col divide-y divide-white/10 rounded-3xl border border-white/15 bg-black/40 shadow-lg backdrop-blur-xl transition focus-within:border-accent sm:flex-row sm:divide-x sm:divide-y-0">
            <BarField label={t("hero.destino")}>
              <select
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className={selectClass}
                aria-label={t("hero.destino")}
              >
                <option value="">{t("hero.cualquierDestino")}</option>
                {REGIONS.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.flag} {r.name}
                  </option>
                ))}
              </select>
            </BarField>
            <BarField label={t("hero.fecha")}>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className={`${selectClass} [color-scheme:dark]`}
                aria-label={t("hero.fecha")}
              />
            </BarField>
            <BarField label={t("hero.tipoExperiencia")}>
              <select
                value={tipoExperiencia}
                onChange={(e) => setTipoExperiencia(e.target.value as PartnerType | "")}
                className={selectClass}
                aria-label={t("hero.tipoExperiencia")}
              >
                {TIPOS_EXPERIENCIA.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </BarField>
            <BarField label={t("hero.soloOGrupo")}>
              <select
                value={soloGrupo}
                onChange={(e) => setSoloGrupo(e.target.value as "" | "solo" | "grupo")}
                className={selectClass}
                aria-label={t("hero.soloOGrupo")}
              >
                <option value="">{t("hero.indiferente")}</option>
                <option value="solo">{t("hero.soloA")}</option>
                <option value="grupo">{t("hero.enGrupo")}</option>
              </select>
            </BarField>
          </div>

          {/* Texto libre (IA) — se mantiene como diferenciador complementario */}
          <div className="mt-2.5 flex items-end gap-2 rounded-3xl border border-white/15 bg-black/40 p-2 shadow-lg backdrop-blur-xl transition focus-within:border-accent">
            <textarea
              value={query}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder={t("hero.placeholder")}
              className="min-h-[44px] flex-1 resize-none bg-transparent px-4 py-3 text-base text-white placeholder:text-white/40 focus:outline-none"
            />
            <button
              type="submit"
              aria-label={t("hero.buscarAria")}
              className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-full bg-accent text-lg text-white shadow-accent transition hover:-translate-y-0.5 hover:rotate-45 hover:bg-accent-600"
            >
              ↗
            </button>
          </div>
          {error && <p className="mt-2.5 text-[13px] font-semibold text-amber">{error}</p>}
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[13px] text-white/55">{t("hero.disclaimerIa")}</p>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[13px] text-white/50">{t("hero.retosPopulares")}</span>
          {chips.map((c) => (
            <button
              key={c.id}
              onClick={() => handleChip(c.id)}
              className="rounded-full border border-white/25 bg-white/8 px-4 py-2 text-[15px] font-medium text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/16"
            >
              {c.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={shuffle}
          className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/70 transition hover:text-white"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 3 21 3 21 8" />
            <line x1="4" y1="20" x2="21" y2="3" />
            <polyline points="21 16 21 21 16 21" />
            <line x1="15" y1="15" x2="21" y2="21" />
            <line x1="4" y1="4" x2="9" y2="9" />
          </svg>
          {t("hero.barajarRetos")}
        </button>
      </div>
    </div>
  );
}
