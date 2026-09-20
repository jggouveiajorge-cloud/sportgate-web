"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setPartnerAccount } from "@/lib/partnerAccount";
import { upsertAdminPartner, type AdminPartner } from "@/lib/adminStore";
import { REGIONS } from "@/lib/regions";
import type { PartnerType } from "@/lib/types";
import { Field, OptionGrid, OptionCard, TextInput, Checkbox } from "@/components/FormControls";
import { useLocale } from "@/lib/i18n/LocaleContext";

const TIPOS_KEYS: { value: PartnerType; labelKey: string }[] = [
  { value: "operador", labelKey: "haztePartner.tipoOperador" },
  { value: "coach", labelKey: "haztePartner.tipoCoach" },
  { value: "alquiler", labelKey: "haztePartner.tipoAlquiler" },
  { value: "producto", labelKey: "haztePartner.tipoProducto" },
  { value: "salud", labelKey: "haztePartner.tipoSalud" },
];

// Campo de credencial + campo adicional específicos por tipo de partner —
// sustituyen al único campo libre "Credenciales" que había antes (ver
// resumen, sección "Cadastro de operadores: mejoras"). El significado del
// campo adicional cambia según lo que de verdad importa verificar en cada
// tipo de negocio.
const TIPO_CAMPOS: Record<
  PartnerType,
  {
    credencialLabelKey: string;
    credencialPlaceholderKey: string;
    extraLabelKey: string;
    extraTipo: "checkbox" | "texto";
    extraPlaceholderKey?: string;
  }
> = {
  operador: {
    credencialLabelKey: "haztePartner.credencialOperadorLabel",
    credencialPlaceholderKey: "haztePartner.credencialOperadorPlaceholder",
    extraLabelKey: "haztePartner.extraOperadorLabel",
    extraTipo: "checkbox",
  },
  coach: {
    credencialLabelKey: "haztePartner.credencialCoachLabel",
    credencialPlaceholderKey: "haztePartner.credencialCoachPlaceholder",
    extraLabelKey: "haztePartner.extraCoachLabel",
    extraTipo: "texto",
    extraPlaceholderKey: "haztePartner.extraCoachPlaceholder",
  },
  alquiler: {
    credencialLabelKey: "haztePartner.credencialAlquilerLabel",
    credencialPlaceholderKey: "haztePartner.credencialAlquilerPlaceholder",
    extraLabelKey: "haztePartner.extraAlquilerLabel",
    extraTipo: "checkbox",
  },
  producto: {
    credencialLabelKey: "haztePartner.credencialProductoLabel",
    credencialPlaceholderKey: "haztePartner.credencialProductoPlaceholder",
    extraLabelKey: "haztePartner.extraProductoLabel",
    extraTipo: "checkbox",
  },
  salud: {
    credencialLabelKey: "haztePartner.credencialSaludLabel",
    credencialPlaceholderKey: "haztePartner.credencialSaludPlaceholder",
    extraLabelKey: "haztePartner.extraSaludLabel",
    extraTipo: "texto",
    extraPlaceholderKey: "haztePartner.extraSaludPlaceholder",
  },
};

export default function HaztePartnerPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState<PartnerType>("operador");
  const [region, setRegion] = useState(REGIONS[0].name);
  const [servicios, setServicios] = useState("");
  const [priceEur, setPriceEur] = useState("");
  const [priceUnit, setPriceUnit] = useState("");
  const [credencialPrincipal, setCredencialPrincipal] = useState("");
  const [extraChecked, setExtraChecked] = useState(false);
  const [extraTexto, setExtraTexto] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const campos = TIPO_CAMPOS[tipo];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!aceptaTerminos) return;

    const campoExtraValor = campos.extraTipo === "checkbox" ? (extraChecked ? "si" : "no") : extraTexto || undefined;

    setPartnerAccount({
      empresa,
      email,
      tipo,
      region,
      servicios,
      price_eur: priceEur ? Number(priceEur) : undefined,
      price_unit: priceUnit || undefined,
      credencialPrincipal: credencialPrincipal || undefined,
      campoExtraValor,
      aceptaTerminos,
    });

    // Crea el registro en el panel de administración con estado "pendiente"
    // — así el gestor puede revisarlo y, si procede, destacarlo en la home
    // (ver lib/adminStore.ts y el nuevo /admin).
    const nuevoPartner: AdminPartner = {
      id: `partner-${Date.now()}`,
      type: tipo,
      name: empresa,
      region,
      country: region,
      min_level: "cualquiera",
      services: servicios
        ? servicios.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      certification: credencialPrincipal || undefined,
      price_eur: priceEur ? Number(priceEur) : 0,
      price_unit: priceUnit || undefined,
      rating: 0,
      reviews_count: 0,
      verified: false,
      why: servicios,
      featured: false,
      estado: "pendiente",
    };
    upsertAdminPartner(nuevoPartner);

    router.push("/panel-partner");
  }

  return (
    <div className="my-8 mx-auto max-w-xl animate-rise rounded-3xl border border-line bg-bg-1 p-8 shadow-md">
      <h1 className="font-display text-2xl font-semibold text-ink">{t("haztePartner.titulo")}</h1>
      <p className="mt-1.5 text-sm text-ink-muted">{t("haztePartner.subtitulo")}</p>

      <div className="mt-5 rounded-2xl bg-accent-soft px-4 py-3.5 text-[13px] leading-relaxed text-ink">
        <strong className="font-semibold">{t("haztePartner.modeloNegocioTitle")}</strong> {t("haztePartner.modeloNegocioText")}
      </div>

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

        <div className="mb-6 grid grid-cols-2 gap-3">
          <Field label={t("haztePartner.priceLabel")} hint={t("haztePartner.priceHint")}>
            <TextInput
              type="number"
              min={0}
              value={priceEur}
              onChange={(e) => setPriceEur(e.target.value)}
              placeholder="890"
            />
          </Field>
          <Field label={t("haztePartner.priceUnitLabel")}>
            <TextInput value={priceUnit} onChange={(e) => setPriceUnit(e.target.value)} placeholder={t("haztePartner.priceUnitPlaceholder")} />
          </Field>
        </div>

        <Field label={t(campos.credencialLabelKey)} hint={t("haztePartner.credencialHint")}>
          <TextInput
            value={credencialPrincipal}
            onChange={(e) => setCredencialPrincipal(e.target.value)}
            placeholder={t(campos.credencialPlaceholderKey)}
          />
        </Field>

        <div className="mb-6">
          {campos.extraTipo === "checkbox" ? (
            <Checkbox checked={extraChecked} onChange={() => setExtraChecked((v) => !v)}>
              {t(campos.extraLabelKey)}
            </Checkbox>
          ) : (
            <Field label={t(campos.extraLabelKey)}>
              <TextInput
                value={extraTexto}
                onChange={(e) => setExtraTexto(e.target.value)}
                placeholder={campos.extraPlaceholderKey ? t(campos.extraPlaceholderKey) : undefined}
              />
            </Field>
          )}
        </div>

        <div className="mb-6 border-t border-line pt-5">
          <Checkbox checked={aceptaTerminos} onChange={() => setAceptaTerminos((v) => !v)}>
            {t("haztePartner.aceptaTerminosPre")}{" "}
            <Link href="/legal/terminos" className="font-semibold text-accent hover:underline">
              {t("haztePartner.aceptaTerminosLink")}
            </Link>
          </Checkbox>
        </div>

        <button
          type="submit"
          disabled={!aceptaTerminos}
          className="mt-2 w-full rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-accent transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
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
