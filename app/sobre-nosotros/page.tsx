"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function SobreNosotrosPage() {
  const { t } = useLocale();

  return (
    <div className="my-8 animate-rise max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{t("sobreNosotros.titulo")}</h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">{t("sobreNosotros.p1")}</p>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">{t("sobreNosotros.p2")}</p>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">{t("sobreNosotros.p3")}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/contacto"
          className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-accent transition hover:bg-accent-600"
        >
          {t("sobreNosotros.contactaBtn")}
        </Link>
        <Link
          href="/como-funciona"
          className="rounded-xl border border-line bg-bg-2 px-6 py-3 text-sm font-bold text-ink transition hover:border-line-strong"
        >
          {t("sobreNosotros.comoFuncionaBtn")}
        </Link>
      </div>
    </div>
  );
}
