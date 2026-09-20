"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { CHALLENGES } from "@/lib/challenges";
import { REGIONS } from "@/lib/regions";
import { Sparkline } from "@/components/Sparkline";
import { PartnerTypeIcon } from "@/components/PartnerTypeIcon";
import { DestinosMasBuscados } from "@/components/DestinosMasBuscados";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { PartnerType } from "@/lib/types";
import {
  getAdminChallenges,
  getAdminPartners,
  getAdminServices,
  type AdminChallenge,
  type AdminPartner,
  type AdminService,
} from "@/lib/adminStore";

const DIFERENCIADORES_KEYS = [
  { icon: "🩺", titleKey: "home.dif1Title", textKey: "home.dif1Text" },
  { icon: "❤️", titleKey: "home.dif2Title", textKey: "home.dif2Text" },
  { icon: "✨", titleKey: "home.dif3Title", textKey: "home.dif3Text" },
  { icon: "🔒", titleKey: "home.dif4Title", textKey: "home.dif4Text" },
];

const PASOS_KEYS = [
  { titleKey: "home.paso1Title", textKey: "home.paso1Text" },
  { titleKey: "home.paso2Title", textKey: "home.paso2Text" },
  { titleKey: "home.paso3Title", textKey: "home.paso3Text" },
  { titleKey: "home.paso4Title", textKey: "home.paso4Text" },
];

const SERVICIOS_KEYS: { type: PartnerType; titleKey: string; textKey: string }[] = [
  { type: "operador", titleKey: "home.servicioOperadorTitle", textKey: "home.servicioOperadorText" },
  { type: "coach", titleKey: "home.servicioCoachTitle", textKey: "home.servicioCoachText" },
  { type: "alquiler", titleKey: "home.servicioAlquilerTitle", textKey: "home.servicioAlquilerText" },
  { type: "producto", titleKey: "home.servicioProductoTitle", textKey: "home.servicioProductoText" },
];

// Valor inicial determinista (igual en servidor y cliente, para no romper la
// hidratación) — el mismo resultado que produciría lib/adminStore.ts al
// "sembrar" los datos de ejemplo la primera vez. El useEffect de abajo lo
// sustituye por el contenido real del panel de administración en cuanto se
// monta en el navegador (ver resumen, sección "Área de administración").
function defaultFeaturedChallenges(): AdminChallenge[] {
  return CHALLENGES.map((c) => ({ ...c, status: "proximo", featured: true, testimonios: [] }));
}

export default function HomePage() {
  const { t } = useLocale();

  const [featuredChallenges, setFeaturedChallenges] = useState<AdminChallenge[]>(defaultFeaturedChallenges);
  const [featuredPartners, setFeaturedPartners] = useState<AdminPartner[]>([]);
  const [adminServices, setAdminServices] = useState<AdminService[]>([]);

  useEffect(() => {
    setFeaturedChallenges(getAdminChallenges().filter((c) => c.featured && c.status !== "archivado"));
    setFeaturedPartners(getAdminPartners().filter((p) => p.featured));
    setAdminServices(getAdminServices());
  }, []);

  const DIFERENCIADORES = DIFERENCIADORES_KEYS.map((d) => ({
    icon: d.icon,
    title: t(d.titleKey),
    text: t(d.textKey),
  }));
  const PASOS = PASOS_KEYS.map((p) => ({ title: t(p.titleKey), text: t(p.textKey) }));
  const SERVICIOS = SERVICIOS_KEYS.map((s) => ({
    type: s.type,
    title: t(s.titleKey),
    text: t(s.textKey),
    photo: adminServices.find((as) => as.type === s.type && as.featured)?.photo,
  }));

  return (
    <>
      <Hero />

      {/* Por qué SPORTGATE */}
      <section id="por-que" className="mx-auto mt-20 max-w-4xl scroll-mt-24">
        <div className="mb-6 text-center">
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-faint">{t("home.porQueLabel")}</div>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{t("home.porQueTitle")}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DIFERENCIADORES.map((d) => (
            <div key={d.title} className="rounded-2xl border border-line bg-bg-1 p-5 text-left">
              <div className="mb-3 text-2xl">{d.icon}</div>
              <h3 className="font-display text-base font-semibold text-ink">{d.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">{d.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="mx-auto mt-20 max-w-4xl scroll-mt-24 text-center">
        <div className="mb-6 text-xs font-bold uppercase tracking-wider text-ink-faint">{t("home.comoFuncionaLabel")}</div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PASOS.map((p, i) => (
            <div key={p.title} className="rounded-2xl border border-line bg-bg-1 p-5 text-left">
              <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="font-display text-sm font-semibold text-ink">{p.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="mt-20 scroll-mt-24">
        <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-ink-faint">
          {t("home.serviciosLabel")}
          <span className="h-px flex-1 bg-line" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICIOS.map((s) => (
            <div key={s.type} className="rounded-2xl border border-line bg-bg-1 p-5 text-left">
              {s.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.photo} alt="" className="h-[72px] w-[72px] rounded-xl object-cover" />
              ) : (
                <PartnerTypeIcon type={s.type} />
              )}
              <h3 className="mt-4 font-display text-base font-semibold text-ink">{s.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Salud — sección destacada */}
      <section id="salud" className="mt-10 scroll-mt-24">
        <div className="grid items-center gap-6 rounded-[28px] border border-line bg-bg-1 p-8 sm:grid-cols-[auto_1fr] sm:p-10">
          <PartnerTypeIcon type="salud" />
          <div className="text-left">
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber">
              {t("home.saludBadge")}
            </span>
            <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">{t("home.saludTitle")}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">{t("home.saludText")}</p>
          </div>
        </div>
      </section>

      <DestinosMasBuscados />

      {/* Dónde operamos */}
      <section id="donde-operamos" className="mt-20 scroll-mt-24">
        <div className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-ink-faint">
          {t("home.dondeOperamosLabel")}
          <span className="h-px flex-1 bg-line" />
        </div>
        <p className="mb-4 max-w-2xl text-sm text-ink-muted">{t("home.dondeOperamosText")}</p>
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((r) => (
            <span key={r.name} className="rounded-full border border-line bg-bg-1 px-4 py-2 text-sm text-ink-muted">
              <span className="mr-1.5">{r.flag}</span>
              {r.name}
            </span>
          ))}
        </div>
      </section>

      <section id="retos" className="mb-20 mt-10 scroll-mt-24">
        <div className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-ink-faint">
          {t("home.retosDestacadosLabel")}
          <span className="h-px flex-1 bg-line" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredChallenges.map((c) => (
            <div key={c.id} className="rounded-2xl border border-line bg-bg-1 p-5">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{c.region}</span>
                {c.rating !== undefined && <span className="text-xs font-semibold text-amber">★ {c.rating}</span>}
              </div>
              <h3 className="font-display text-lg font-semibold text-ink">{c.name}</h3>
              <p className="mt-1 text-[13px] text-ink-muted">{c.description}</p>
              {c.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.photo} alt="" className="mt-3 h-28 w-full rounded-xl object-cover" />
              ) : (
                <Sparkline values={c.elevation_profile} className="mt-3 h-10 w-full" />
              )}
              <div className="mt-2 flex justify-between text-[11px] text-ink-faint">
                <span>{c.distance_km} km</span>
                <span>
                  {c.elevation_gain_m} {t("home.retosUnitDPlus")}
                </span>
                <span>
                  {c.avg_gradient}
                  {t("home.retosUnitMedia")}
                </span>
              </div>
              {c.testimonios.length > 0 && (
                <p className="mt-3 border-t border-line pt-2.5 text-[12.5px] italic leading-relaxed text-ink-muted">
                  “{c.testimonios[0].texto}” — {c.testimonios[0].autor}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Partners en la plataforma */}
      <section id="partners" className="mt-4 scroll-mt-24">
        <div className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-ink-faint">
          {t("home.partnersLabel")}
          <span className="h-px flex-1 bg-line" />
        </div>
        <p className="mb-4 max-w-2xl text-sm text-ink-muted">{t("home.partnersText")}</p>
        {featuredPartners.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {featuredPartners.map((p) => (
              <Link
                key={p.id}
                href={`/partner/${p.id}`}
                className="flex items-center gap-3 rounded-xl border border-line bg-bg-1 p-3 transition hover:-translate-y-0.5 hover:border-line-strong"
              >
                {p.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photo} alt="" className="h-10 w-10 flex-shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-bg-2 text-xs font-bold text-ink-faint">
                    {p.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-semibold text-ink">{p.name}</div>
                  <div className="truncate text-[11px] text-ink-faint">{p.region}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-faint">{t("home.partnersVacio")}</p>
        )}
      </section>

      {/* CTA final */}
      <section className="mx-auto my-20 max-w-2xl rounded-[28px] border border-line bg-bg-1 px-8 py-12 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{t("home.ctaTitle")}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">{t("home.ctaText")}</p>
        <Link
          href="/#buscar"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow-accent transition hover:-translate-y-0.5 hover:bg-accent-600"
        >
          {t("home.ctaButton")}
        </Link>
      </section>
    </>
  );
}
