"use client";

import { LegalPage } from "@/components/LegalPage";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function AvisoLtaPage() {
  const { t } = useLocale();

  return (
    <LegalPage title={t("legal.avisoLtaTitle")}>
      <p>
        {t("legal.avisoLtaP1Pre")} <strong className="text-ink">{t("legal.avisoLtaP1Strong")}</strong>
        {t("legal.avisoLtaP1Post")}
      </p>
      <p>{t("legal.avisoLtaP2")}</p>
      <p>{t("legal.avisoLtaP3")}</p>
    </LegalPage>
  );
}
