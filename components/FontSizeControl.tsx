"use client";

import { useEffect, useState } from "react";
import { applyFontScale, FONT_SCALE_STEPS, getStoredFontScale, type FontScale } from "@/lib/fontSize";
import { useLocale } from "@/lib/i18n/LocaleContext";

export function FontSizeControl() {
  const { t } = useLocale();
  // Antes de hidratar, asumimos 100% (lo que ya fija el script inline en
  // <head>) para que el botón no salte al cargar.
  const [scale, setScale] = useState<FontScale>(100);

  useEffect(() => {
    setScale(getStoredFontScale());
  }, []);

  function step(direction: 1 | -1) {
    const currentIndex = FONT_SCALE_STEPS.indexOf(scale);
    const nextIndex = Math.min(Math.max(currentIndex + direction, 0), FONT_SCALE_STEPS.length - 1);
    const next = FONT_SCALE_STEPS[nextIndex];
    setScale(next);
    applyFontScale(next);
  }

  return (
    <div className="flex h-8 flex-shrink-0 items-center gap-0.5 rounded-full border border-line px-1 text-ink-muted">
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={scale === FONT_SCALE_STEPS[0]}
        aria-label={t("common.decreaseFont")}
        title={t("common.decreaseFont")}
        className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition hover:bg-bg-2 hover:text-ink disabled:opacity-30"
      >
        A-
      </button>
      <span className="w-8 text-center text-[10px] font-semibold tabular-nums" aria-hidden>
        {scale}%
      </span>
      <button
        type="button"
        onClick={() => step(1)}
        disabled={scale === FONT_SCALE_STEPS[FONT_SCALE_STEPS.length - 1]}
        aria-label={t("common.increaseFont")}
        title={t("common.increaseFont")}
        className="flex h-6 w-6 items-center justify-center rounded-full text-[13px] font-bold transition hover:bg-bg-2 hover:text-ink disabled:opacity-30"
      >
        A+
      </button>
    </div>
  );
}
