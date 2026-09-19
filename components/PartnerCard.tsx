"use client";

import Link from "next/link";
import type { Partner } from "@/lib/types";
import { PartnerTypeIcon } from "./PartnerTypeIcon";
import { useLocale } from "@/lib/i18n/LocaleContext";

export function PartnerCard({ partner, showAiBadge = false }: { partner: Partner; showAiBadge?: boolean }) {
  const { t } = useLocale();

  return (
    <div className="flex animate-rise gap-4 rounded-2xl border border-line bg-bg-1 p-4 shadow-xs transition hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md">
      <PartnerTypeIcon type={partner.type} />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap gap-1.5">
          {showAiBadge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-bold text-accent">
              {t("partnerCard.recomendadoIa")}
            </span>
          )}
          {partner.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-soft px-2.5 py-1 text-[11px] font-bold text-teal">
              {t("partnerCard.verificado")}
            </span>
          )}
        </div>
        <h3 className="text-base font-semibold text-ink">
          <Link href={`/partner/${partner.id}`} className="hover:text-accent">
            {partner.name}
          </Link>
        </h3>
        <div className="mt-0.5 text-xs text-ink-muted">
          <span className="font-semibold text-amber">★ {partner.rating}</span>{" "}
          ({partner.reviews_count} {t("partnerCard.reseñas")}
          {partner.verified ? ` ${t("partnerCard.reseñasVerificadas")}` : ""}) · {partner.services.join(", ")}
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{partner.why}</p>
      </div>
      <div className="flex flex-shrink-0 flex-col items-end justify-center gap-2 whitespace-nowrap">
        <span className="font-display text-xl font-semibold text-ink">{partner.price_eur} €</span>
        {partner.price_unit && <span className="text-[11px] text-ink-faint">{partner.price_unit}</span>}
        <Link
          href={`/checkout?id=${partner.id}`}
          className="rounded-xl border border-line bg-bg-2 px-4 py-2 text-xs font-bold text-ink transition hover:border-line-strong"
        >
          {t("partnerCard.añadir")}
        </Link>
      </div>
    </div>
  );
}
