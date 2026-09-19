"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";

const PASOS_KEYS = [
  { titleKey: "comoFunciona.paso1Title", textKey: "comoFunciona.paso1Text" },
  { titleKey: "comoFunciona.paso2Title", textKey: "comoFunciona.paso2Text" },
  { titleKey: "comoFunciona.paso3Title", textKey: "comoFunciona.paso3Text" },
  { titleKey: "comoFunciona.paso4Title", textKey: "comoFunciona.paso4Text" },
];

export default function ComoFuncionaPage() {
  const { t } = useLocale();
  const PASOS = PASOS_KEYS.map((p) => ({ title: t(p.titleKey), text: t(p.textKey) }));

  return (
    <div className="my-8 animate-rise">
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{t("comoFunciona.titulo")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{t("comoFunciona.subtitulo")}</p>

      <div className="mt-10 flex flex-col gap-6">
        {PASOS.map((p) => (
          <div key={p.title} className="rounded-2xl border border-line bg-bg-1 p-6">
            <h2 className="font-display text-lg font-semibold text-ink">{p.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">{p.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/#buscar"
          className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-accent transition hover:bg-accent-600"
        >
          {t("comoFunciona.buscarReto")}
        </Link>
        <Link
          href="/asesor"
          className="rounded-xl border border-line bg-bg-2 px-6 py-3 text-sm font-bold text-ink transition hover:border-line-strong"
        >
          {t("comoFunciona.hablaAsesor")}
        </Link>
      </div>
    </div>
  );
}
