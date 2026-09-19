"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getPartnerAccount, setPartnerAccount } from "@/lib/partnerAccount";
import { REGIONS } from "@/lib/regions";
import { Field, TextInput } from "@/components/FormControls";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function LoginPartnerPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const existente = getPartnerAccount();
    if (existente && existente.email === email) {
      router.push("/panel-partner");
      return;
    }
    // Demo sin autenticación real: si no existe cuenta, creamos una mínima
    // para que el panel tenga algo que mostrar.
    setPartnerAccount({
      empresa: email.split("@")[0],
      email,
      tipo: "operador",
      region: REGIONS[0].name,
      servicios: "",
    });
    router.push("/panel-partner");
  }

  return (
    <div className="my-8 mx-auto max-w-md animate-rise rounded-3xl border border-line bg-bg-1 p-8 shadow-md">
      <h1 className="font-display text-2xl font-semibold text-ink">{t("loginPartner.titulo")}</h1>
      <p className="mt-1.5 text-sm text-ink-muted">{t("loginPartner.subtitulo")}</p>
      <form className="mt-6" onSubmit={handleSubmit}>
        <Field label={t("loginPartner.emailLabel")}>
          <TextInput
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("loginPartner.emailPlaceholder")}
          />
        </Field>
        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-accent transition hover:bg-accent-600"
        >
          {t("loginPartner.entrarPanel")}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-ink-muted">
        {t("loginPartner.noPartnerAun")}{" "}
        <Link href="/hazte-partner" className="font-semibold text-accent">
          {t("loginPartner.registrate")}
        </Link>
      </p>
    </div>
  );
}
