"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setPartnerAccount } from "@/lib/partnerAccount";
import { REGIONS } from "@/lib/regions";
import type { PartnerType } from "@/lib/types";
import { Field, OptionGrid, OptionCard, TextInput } from "@/components/FormControls";
import { useLocale } from "@/lib/i18n/LocaleContext";

const TIPOS_KEYS: { value: PartnerType; labelKey: string }[] = [
  { value: "operador", labelKey: "haztePartner.tipoOperador" },
  { value: "coach", labelKey: "haztePartner.tipoCoach" },
  { value: "alquiler", labelKey: "haztePartner.tipoAlquiler" },
  { value: "producto", labelKey: "haztePartner.tipoProducto" },
  { value: "salud", labelKey: "haztePartner.tipoSalud" },
];

export default function HaztePartnerPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState<PartnerType>("operador");
  const [region, setRegion] = useState(REGIONS[0].name);
  const [servicios, setServicios] = useState("");
  const [credenciales, setCredenciales] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPartnerAccount({ empresa, email, tipo, region, servicios, credenciales });
    router.push("/panel-partner");
  }

  return (
    <div className="my-8 mx-auto max-w-xl animate-rise rounded-3xl border border-line bg-bg-1 p-8 shadow-md">
      <h1 className="font-display text-2xl font-semibold text-ink">{t("haztePartner.titulo")}</h1>
      <p className="mt-1.5 text-sm text-ink-muted">{t("haztePartner.subtitulo")}</p>
      <form className="mt-6" onSubmit={handleSubmit}>
        <Field label={t("haztePartner.empresaLabel")}>
          <TextInput required value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder={t("haztePartner.empresaPlaceholder")} />
        </Field>
        <Field label={t("haztePartner.emailLabel")}>
          <TextInput required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("haztePartner.emailPlaceholder")} />
        </Field>
        <Field label={t("haztePartner.tipoLabel")}>
          <OptionGrid>
            {TIPOS_KEYS.map((tOpt) => (
              <OptionCard key={tOpt.value} name="tipo" value={tOpt.value} checked={tipo === tOpt.value} onChange={() => setTipo(tOpt.value)}>
                {t(tOpt.labelKey)}
              </OptionCard>
            ))}
          </OptionGrid>
        </Field>
        <Field label={t("haztePartner.regionLabel")}>
          <OptionGrid>
            {REGIONS.map((r) => (
              <OptionCard key={r.name} name="region" value={r.name} checked={region === r.name} onChange={() => setRegion(r.name)}>
                {r.flag} {r.name}
              </OptionCard>
            ))}
          </OptionGrid>
        </Field>
        <Field label={t("haztePartner.serviciosLabel")} hint={t("haztePartner.serviciosHint")}>
          <TextInput value={servicios} onChange={(e) => setServicios(e.target.value)} placeholder={t("haztePartner.serviciosPlaceholder")} />
        </Field>
        <Field label={t("haztePartner.credencialesLabel")} hint={t("haztePartner.credencialesHint")}>
          <TextInput value={credenciales} onChange={(e) => setCredenciales(e.target.value)} placeholder={t("haztePartner.credencialesPlaceholder")} />
        </Field>
        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-accent transition hover:bg-accent-600"
        >
          {t("haztePartner.registrarNegocio")}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-ink-muted">
        {t("haztePartner.yaPartner")}{" "}
        <Link href="/login-partner" className="font-semibold text-accent">
          {t("haztePartner.iniciaSesion")}
        </Link>
      </p>
    </div>
  );
}
