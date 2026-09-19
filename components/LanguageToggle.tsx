"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";

export function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className="flex h-8 flex-shrink-0 items-center rounded-full border border-line p-0.5 text-[11px] font-bold text-ink-muted"
      role="group"
      aria-label={t("common.language")}
    >
      <button
        type="button"
        onClick={() => setLocale("es")}
        aria-pressed={locale === "es"}
        className={`flex h-6 w-7 items-center justify-center rounded-full transition ${
          locale === "es" ? "bg-accent text-white" : "hover:text-ink"
        }`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`flex h-6 w-7 items-center justify-center rounded-full transition ${
          locale === "en" ? "bg-accent text-white" : "hover:text-ink"
        }`}
      >
        EN
      </button>
    </div>
  );
}
