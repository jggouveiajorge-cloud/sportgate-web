"use client";

import { LegalPage } from "@/components/LegalPage";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function PrivacidadPage() {
  const { t } = useLocale();

  return (
    <LegalPage title={t("legal.privacidadTitle")}>
      <p>{t("legal.privacidadP1")}</p>
      <p>{t("legal.privacidadP2")}</p>
      <p>{t("legal.privacidadP3")}</p>
    </LegalPage>
  );
}
