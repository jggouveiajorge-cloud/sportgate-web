"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useWizard } from "@/components/WizardProvider";
import { PartnerCard } from "@/components/PartnerCard";
import { StatTile } from "@/components/StatTile";
import { Sparkline } from "@/components/Sparkline";
import { getChallengeById, matchPartners, needsHealthReferral } from "@/lib/match";
import { SPONSORS } from "@/lib/sponsors";
import { simulateWebSearch, type WebResult } from "@/lib/webSearchSim";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { Partner, PartnerType } from "@/lib/types";

const TIPO_LABEL_KEYS: Partial<Record<PartnerType, string>> = {
  operador: "resultados.tipoOperador",
  coach: "resultados.tipoCoach",
  alquiler: "resultados.tipoAlquiler",
};

function Section({ title, partners, showAiBadge, empty }: { title: string; partners: Partner[]; showAiBadge: boolean; empty: string }) {
  return (
    <div className="mt-10">
      <div className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-ink-faint">
        {title}
        <span className="h-px flex-1 bg-line" />
      </div>
      {partners.length === 0 ? (
        <p className="text-sm text-ink-muted">{empty}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {partners.map((p) => (
            <PartnerCard key={p.id} partner={p} showAiBadge={showAiBadge} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ResultadosPage() {
  const router = useRouter();
  const { t } = useLocale();
  const { state, hydrated, setFiltros } = useWizard();
  const challenge = getChallengeById(state.challengeId);
  const referral = needsHealthReferral(state.intake);

  const tipoExperiencia = state.filtros?.tipoExperiencia;
  const partners = useMemo(() => {
    const base = matchPartners(challenge, state.intake);
    // El filtro "Tipo de experiencia" del buscador nunca oculta la sección de
    // salud: es un diferenciador de seguridad, no una preferencia de compra.
    return tipoExperiencia ? base.filter((p) => p.type === tipoExperiencia || p.type === "salud") : base;
  }, [challenge, state.intake, tipoExperiencia]);
  const operadores = partners.filter((p) => p.type === "operador");
  const coaches = partners.filter((p) => p.type === "coach");
  const alquileres = partners.filter((p) => p.type === "alquiler");
  const productos = partners.filter((p) => p.type === "producto");
  const salud = partners.filter((p) => p.type === "salud");

  const [webResults, setWebResults] = useState<WebResult[] | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (hydrated && !state.challengeId) router.replace("/");
  }, [hydrated, state.challengeId, router]);

  if (!hydrated || !challenge) return null;

  function buscarMasEnInternet() {
    setSearching(true);
    setTimeout(() => {
      setWebResults(simulateWebSearch(challenge!.region));
      setSearching(false);
    }, 900);
  }

  return (
    <div className="my-8">
      <div className="animate-rise">
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{challenge.name}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {challenge.region} · {partners.length} {t("resultados.resultadosCompatibles")}
        </p>
        {tipoExperiencia && (
          <button
            onClick={() => setFiltros({ tipoExperiencia: undefined })}
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3.5 py-1.5 text-xs font-semibold text-accent"
          >
            {t("resultados.filtroLabel")} {(TIPO_LABEL_KEYS[tipoExperiencia] && t(TIPO_LABEL_KEYS[tipoExperiencia]!)) ?? tipoExperiencia}
            <span aria-hidden>✕</span>
          </button>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <StatTile value={`${challenge.distance_km}`} unit="km" label={t("resultados.distancia")} />
          <StatTile value={`${challenge.elevation_gain_m}`} unit="m" label={t("resultados.desnivel")} />
          <StatTile value={`${challenge.avg_gradient}%`} label={t("resultados.pendienteMedia")} />
          <StatTile value={`${challenge.max_gradient}%`} label={t("resultados.pendienteMax")} />
        </div>
        <Sparkline values={challenge.elevation_profile} className="mt-4 h-14 w-full" />
        <p className="mt-1 text-[11px] text-ink-faint">{t("resultados.perfilIlustrativo")}</p>
      </div>

      {referral && (
        <div className="mt-6 flex gap-2.5 rounded-2xl bg-amber-soft px-4 py-3.5 text-[13.5px] leading-relaxed text-amber">
          {t("resultados.referralMsg")}
        </div>
      )}

      <Section
        title={t("resultados.seccionOperadores")}
        partners={operadores}
        showAiBadge
        empty={t("resultados.emptyOperadores")}
      />
      <Section
        title={t("resultados.seccionCoaches")}
        partners={coaches}
        showAiBadge
        empty={t("resultados.emptyCoaches")}
      />
      <Section
        title={t("resultados.seccionSalud")}
        partners={salud}
        showAiBadge={referral}
        empty={t("resultados.emptySalud")}
      />
      <Section
        title={t("resultados.seccionTiendas")}
        partners={productos}
        showAiBadge={false}
        empty={t("resultados.emptyTiendas")}
      />
      <Section
        title={t("resultados.seccionAlquiler")}
        partners={alquileres}
        showAiBadge={false}
        empty={t("resultados.emptyAlquiler")}
      />

      <div className="mt-10 rounded-2xl border border-dashed border-line-strong bg-bg-1 p-5 text-center">
        <p className="mb-3 text-sm text-ink-muted">{t("resultados.noEncuentras")}</p>
        <button
          onClick={buscarMasEnInternet}
          disabled={searching}
          className="rounded-xl border border-line-strong bg-bg-2 px-5 py-2.5 text-sm font-bold text-ink transition hover:border-accent disabled:opacity-60"
        >
          {searching ? t("resultados.buscando") : t("resultados.buscarInternet")}
        </button>
        {webResults && (
          <div className="mx-auto mt-4 flex max-w-md flex-col gap-2 text-left">
            {webResults.map((r) => (
              <div key={r.label} className="rounded-xl border border-line bg-bg-2 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <span className="rounded-full bg-bg-3 px-2 py-0.5 text-[10px] font-bold uppercase text-ink-faint">
                    {t("resultados.noVerificado")}
                  </span>
                  {r.label}
                </div>
                <p className="mt-1 text-xs text-ink-muted">{r.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 border-t border-line pt-6">
        <div className="mb-2 text-xs uppercase tracking-wide text-ink-faint">{t("resultados.patrocinado")}</div>
        <div className="flex flex-wrap gap-2">
          {SPONSORS.map((s) => (
            <div
              key={s.id}
              className="flex h-[60px] w-[100px] flex-col items-center justify-center gap-0.5 rounded-xl border border-line bg-bg-1 text-center text-[13px] font-bold text-ink-faint opacity-70 transition hover:opacity-100"
            >
              {s.initials}
              <small className="text-[9px] font-normal">{s.category}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
