"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function ContactoPage() {
  const { t } = useLocale();

  return (
    <div className="my-8 animate-rise max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{t("contacto.titulo")}</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{t("contacto.subtitulo")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-bg-1 p-5">
          <h2 className="font-display text-sm font-semibold text-ink">{t("contacto.soporteTitle")}</h2>
          <p className="mt-1.5 text-sm text-ink-muted">hola@sportgate.example</p>
        </div>
        <div className="rounded-2xl border border-line bg-bg-1 p-5">
          <h2 className="font-display text-sm font-semibold text-ink">{t("contacto.partnersTitle")}</h2>
          <p className="mt-1.5 text-sm text-ink-muted">partners@sportgate.example</p>
        </div>
        <div className="rounded-2xl border border-line bg-bg-1 p-5">
          <h2 className="font-display text-sm font-semibold text-ink">{t("contacto.prensaTitle")}</h2>
          <p className="mt-1.5 text-sm text-ink-muted">prensa@sportgate.example</p>
        </div>
        <div className="rounded-2xl border border-line bg-bg-1 p-5">
          <h2 className="font-display text-sm font-semibold text-ink">{t("contacto.ayudaTitle")}</h2>
          <p className="mt-1.5 text-sm text-ink-muted">
            {t("contacto.ayudaPre")}{" "}
            <Link href="/asesor" className="font-semibold text-accent">
              {t("contacto.hablaAsesor")}
            </Link>{" "}
            {t("contacto.ayudaPost")}
          </p>
        </div>
      </div>
    </div>
  );
}
