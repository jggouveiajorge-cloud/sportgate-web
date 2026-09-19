"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";

// Footer de 5 columnas, inspirado en Booking — ver resumen sección 8.
// Extraído de app/layout.tsx a su propio componente porque necesita el hook
// useLocale() (t()) para traducir sus textos, y layout.tsx es un server
// component.
export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="mx-auto max-w-5xl px-4 py-16 text-xs text-ink-faint">
      <div className="mb-8 flex items-start gap-1 text-sm font-extrabold tracking-wide text-ink">
        SPORTGATE
        <span className="-mt-0.5 text-xs font-extrabold text-accent">↗</span>
      </div>
      <div className="grid gap-8 border-t border-line pt-10 text-left sm:grid-cols-5">
        <div>
          <div className="mb-3 font-semibold uppercase tracking-wide text-ink-muted">{t("footer.ayuda")}</div>
          <ul className="space-y-2">
            <li>
              <Link href="/cuenta" className="transition hover:text-ink">
                {t("footer.gestionarReservas")}
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="transition hover:text-ink">
                {t("footer.contacto")}
              </Link>
            </li>
            <li>
              <Link href="/legal/aviso-lta" className="transition hover:text-ink">
                {t("footer.seguridadAviso")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-semibold uppercase tracking-wide text-ink-muted">{t("footer.descubre")}</div>
          <ul className="space-y-2">
            <li>
              <Link href="/#retos" className="transition hover:text-ink">
                {t("footer.retosDestacados")}
              </Link>
            </li>
            <li>
              <Link href="/#donde-operamos" className="transition hover:text-ink">
                {t("footer.dondeOperamos")}
              </Link>
            </li>
            <li>
              <Link href="/como-funciona" className="transition hover:text-ink">
                {t("footer.comoFunciona")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-semibold uppercase tracking-wide text-ink-muted">{t("footer.legal")}</div>
          <ul className="space-y-2">
            <li>
              <Link href="/legal/privacidad" className="transition hover:text-ink">
                {t("footer.privacidad")}
              </Link>
            </li>
            <li>
              <Link href="/legal/terminos" className="transition hover:text-ink">
                {t("footer.terminos")}
              </Link>
            </li>
            <li>
              <Link href="/legal/aviso-lta" className="transition hover:text-ink">
                {t("footer.avisoLta")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-semibold uppercase tracking-wide text-ink-muted">{t("footer.partners")}</div>
          <ul className="space-y-2">
            <li>
              <Link href="/login-partner" className="transition hover:text-ink">
                {t("footer.accesoPartners")}
              </Link>
            </li>
            <li>
              <Link href="/panel-partner" className="transition hover:text-ink">
                {t("footer.centroAyudaPartner")}
              </Link>
            </li>
            <li>
              <Link href="/hazte-partner" className="transition hover:text-ink">
                {t("footer.hazteBartner")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-semibold uppercase tracking-wide text-ink-muted">{t("footer.sobreSportgate")}</div>
          <ul className="space-y-2">
            <li>
              <Link href="/sobre-nosotros" className="transition hover:text-ink">
                {t("footer.quienesSomos")}
              </Link>
            </li>
            <li>
              <Link href="/asesor" className="transition hover:text-ink">
                {t("footer.hablaAsesor")}
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="transition hover:text-ink">
                {t("footer.contactoCorporativo")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="mt-10 border-t border-line pt-6 text-center">
        {t("footer.disclaimer")}
        <br />
        {t("footer.demoNote")}
      </p>
    </footer>
  );
}
