"use client";

import { LegalPage } from "@/components/LegalPage";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function TerminosPage() {
  const { t } = useLocale();

  return (
    <LegalPage title={t("legal.terminosTitle")}>
      <p>{t("legal.terminosP1")}</p>
      <p>{t("legal.terminosP2")}</p>
      <p>{t("legal.terminosP3")}</p>
    </LegalPage>
  );
}
