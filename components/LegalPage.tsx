"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  const { t } = useLocale();

  return (
    <div className="my-8 animate-rise max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{title}</h1>
      <div className="mt-3 rounded-xl bg-amber-soft px-4 py-2.5 text-xs font-semibold text-amber">
        {t("legal.disclaimer")}
      </div>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-muted">{children}</div>
    </div>
  );
}
