"use client";

import { useRouter } from "next/navigation";
import { CHALLENGES } from "@/lib/challenges";
import { REGIONS } from "@/lib/regions";
import { useWizard } from "./WizardProvider";
import { useLocale } from "@/lib/i18n/LocaleContext";

// Subtítulos ilustrativos por región — contenido fijo en el código para el
// MVP; gestionable desde un panel de administración en fase 2 (ver resumen
// secciones 8 y 13). Se mapean por nombre de región (todavía en español —
// ver tarea de traducción de lib/regions.ts) a una clave de traducción, para
// que el propio texto del subtítulo sí salga en el idioma activo.
const SUBTITULO_KEYS: Record<string, string> = {
  "Alpes (Francia/Italia)": "destinos.subAlpes",
  "Mallorca (España)": "destinos.subMallorca",
  "Colorado (EE. UU.)": "destinos.subColorado",
  "Santa Catarina (Brasil)": "destinos.subSantaCatarina",
};

export function DestinosMasBuscados() {
  const router = useRouter();
  const { setFiltros } = useWizard();
  const { t } = useLocale();

  function explorar(region: string) {
    setFiltros({ region });
    router.push("/checklist/1");
  }

  return (
    <section id="destinos" className="mt-20 scroll-mt-24">
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-faint">{t("destinos.label")}</div>
      <h2 className="mb-6 font-display text-xl font-semibold text-ink sm:text-2xl">{t("destinos.title")}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REGIONS.map((r) => {
          const n = CHALLENGES.filter((c) => c.region === r.name).length;
          const subtituloKey = SUBTITULO_KEYS[r.name];
          return (
            <button
              key={r.name}
              onClick={() => explorar(r.name)}
              className="group flex flex-col items-start rounded-2xl border border-line bg-bg-1 p-5 text-left transition hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md"
            >
              <span className="text-2xl">{r.flag}</span>
              <h3 className="mt-3 font-display text-base font-semibold text-ink">{r.name}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
                {subtituloKey ? t(subtituloKey) : ""}
              </p>
              <span className="mt-3 text-xs font-semibold text-ink-faint">
                {n} {n === 1 ? t("destinos.retoDisponible") : t("destinos.retosDisponibles")}
              </span>
              <span className="mt-3 text-xs font-bold text-accent transition group-hover:translate-x-0.5">
                {t("destinos.explorar")}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
