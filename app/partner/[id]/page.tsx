"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { getPartnerById } from "@/lib/match";
import { REVIEWS } from "@/lib/reviews";
import { PartnerTypeIcon } from "@/components/PartnerTypeIcon";
import { useLocale } from "@/lib/i18n/LocaleContext";

type ParamsShape = { id: string };

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof value === "object" && value !== null && typeof (value as any).then === "function";
}

export default function PartnerPage({ params }: { params: ParamsShape | Promise<ParamsShape> }) {
  // Next.js 15+ entrega "params" como Promise (hay que desenvolverlo con
  // React.use()); Next.js 14 lo entrega como objeto plano — mismo patrón que
  // app/checklist/[paso]/page.tsx.
  const { id } = isPromise(params) ? use(params) : params;
  const { t } = useLocale();
  const partner = getPartnerById(id);
  if (!partner) notFound();
  const reviews = REVIEWS[partner.id] ?? [];

  return (
    <div className="my-8">
      <div className="animate-rise">
        {partner.verified && (
          <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-teal-soft px-2.5 py-1 text-[11px] font-bold text-teal">
            ✓ {t("partnerPage.verificado")}
          </span>
        )}
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{partner.name}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {partner.region} · <span className="font-semibold text-amber">★ {partner.rating}</span> (
          {partner.reviews_count} {t("partnerPage.reseñas")})
        </p>
      </div>

      <div className="mt-6 flex gap-4 rounded-2xl border border-line bg-bg-1 p-5">
        <PartnerTypeIcon type={partner.type} />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-ink">
            <strong className="text-ink-muted">{t("partnerPage.servicios")}</strong> {partner.services.join(", ")}
          </p>
          {partner.certification && (
            <p className="mt-1 text-sm text-ink">
              <strong className="text-ink-muted">{t("partnerPage.certificacion")}</strong> {partner.certification}
            </p>
          )}
          {partner.languages && (
            <p className="mt-1 text-sm text-ink">
              <strong className="text-ink-muted">{t("partnerPage.idiomas")}</strong> {partner.languages.join(", ")}
            </p>
          )}
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-muted">{partner.why}</p>
          <Link
            href={`/checkout?id=${partner.id}`}
            className="mt-4 inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-accent transition hover:bg-accent-600"
          >
            {t("partnerPage.añadirCheckout")} {partner.price_eur} € {partner.price_unit}
          </Link>
        </div>
      </div>

      <div className="mt-10 mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-ink-faint">
        {t("partnerPage.reseñasVerificadas")}
        <span className="h-px flex-1 bg-line" />
      </div>
      {reviews.length === 0 ? (
        <p className="text-sm text-ink-muted">{t("partnerPage.sinReseñas")}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <div key={r.author} className="rounded-2xl border border-line bg-bg-1 p-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-amber">{"★".repeat(r.rating)}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-soft px-2.5 py-0.5 text-[11px] font-bold text-teal">
                  ✓ {t("partnerPage.reservaVerificada")}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink">{r.text}</p>
              <p className="mt-1 text-xs text-ink-muted">— {r.author}</p>
              {r.dims && (
                <p className="mt-1 text-xs text-ink-faint">
                  {t("partnerPage.guia")} {r.dims.guia}/5 · {t("partnerPage.itinerario")} {r.dims.itinerario}/5 ·{" "}
                  {t("partnerPage.equipoLabel")} {r.dims.equipo}/5 · {t("partnerPage.precio")} {r.dims.precio}/5
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <Link href="/resultados" className="mt-8 inline-block text-sm font-bold text-ink-muted hover:text-ink">
        {t("partnerPage.volverResultados")}
      </Link>
    </div>
  );
}
