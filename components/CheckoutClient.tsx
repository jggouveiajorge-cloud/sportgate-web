"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useWizard } from "./WizardProvider";
import { getChallengeById, getPartnerById } from "@/lib/match";
import { addReserva } from "@/lib/reservas";
import { useLocale } from "@/lib/i18n/LocaleContext";

export function CheckoutClient() {
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const { state, addSeleccion, removeSeleccion, reset } = useWizard();
  const [confirmado, setConfirmado] = useState(false);
  const [aceptaLta, setAceptaLta] = useState(false);
  const [aceptaSeguro, setAceptaSeguro] = useState(false);

  const idParam = searchParams.get("id");
  const quitarParam = searchParams.get("quitar");

  useEffect(() => {
    if (idParam) addSeleccion(idParam);
    if (quitarParam) removeSeleccion(quitarParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idParam, quitarParam]);

  const challenge = getChallengeById(state.challengeId);
  const seleccionados = state.seleccion.map((id) => getPartnerById(id)).filter(Boolean) as NonNullable<
    ReturnType<typeof getPartnerById>
  >[];
  const total = seleccionados.reduce((sum, p) => sum + p.price_eur, 0);

  if (confirmado) {
    return (
      <div className="my-8 animate-rise">
        <div className="flex gap-2.5 rounded-2xl bg-teal-soft px-4 py-4 text-[14px] leading-relaxed text-teal">
          {t("checkout.confirmadoMsg")}
        </div>
        <div className="mt-5 flex gap-3">
          <Link
            href="/cuenta"
            className="inline-block rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-accent hover:bg-accent-600"
          >
            {t("checkout.verCuenta")}
          </Link>
          <Link
            href="/"
            className="inline-block rounded-xl border border-line bg-bg-2 px-5 py-2.5 text-sm font-bold text-ink hover:border-line-strong"
          >
            {t("checkout.volverInicio")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 animate-rise">
      <h1 className="font-display text-3xl font-semibold text-ink">{t("checkout.seleccionTitulo")}</h1>
      <p className="mt-1 text-sm text-ink-muted">{challenge?.name ?? ""}</p>

      {seleccionados.length === 0 ? (
        <p className="mt-6 text-sm text-ink-muted">
          {t("checkout.vacioPre")}{" "}
          <Link href="/resultados" className="font-semibold text-accent">
            {t("checkout.vuelveResultados")}
          </Link>{" "}
          {t("checkout.vacioPost")}
        </p>
      ) : (
        <>
          <div className="mt-6 flex gap-2.5 rounded-2xl border border-line bg-bg-1 px-4 py-3.5 text-[13px] leading-relaxed text-ink-muted">
            <strong className="text-ink">{t("checkout.ltaAvisoTitle")}</strong> {t("checkout.ltaAvisoText")}
          </div>

          <div className="mt-5 divide-y divide-line rounded-2xl border border-line bg-bg-1 px-4">
            {seleccionados.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-4 text-[15px]">
                <div>
                  {p.name}
                  <span className="mt-0.5 block text-xs text-ink-muted">
                    {p.type} · {t("checkout.cobraDirectamente", { name: p.name })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span>
                    {p.price_eur} € <span className="text-xs text-ink-muted">{p.price_unit ?? ""}</span>
                  </span>
                  <button
                    onClick={() => removeSeleccion(p.id)}
                    className="text-xs font-semibold text-ink-faint hover:text-accent"
                  >
                    {t("checkout.quitar")}
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between py-4 font-display text-lg font-semibold text-ink">
              <span className="font-sans text-sm font-normal text-ink-muted">{t("checkout.totalEstimado")}</span>
              <span>{total} €</span>
            </div>
          </div>

          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              // Guardamos la reserva simulada para "Mi cuenta" (briefing de
              // viaje) y dejamos el wizard listo para una búsqueda nueva.
              if (challenge) {
                addReserva({
                  id: `res-${Date.now()}`,
                  creadoEn: new Date().toISOString(),
                  challengeId: challenge.id,
                  challengeName: challenge.name,
                  region: challenge.region,
                  fechaObjetivo: state.intake.fecha_objetivo,
                  partners: seleccionados.map((p) => ({ id: p.id, name: p.name, type: p.type, price_eur: p.price_eur })),
                  total,
                  intake: state.intake,
                });
              }
              setConfirmado(true);
              reset();
            }}
          >
            <label className="mb-3 flex items-start gap-2 text-sm text-ink-muted">
              <input
                type="checkbox"
                required
                checked={aceptaLta}
                onChange={(e) => setAceptaLta(e.target.checked)}
                className="mt-0.5"
              />
              {t("checkout.aceptaLta")}
            </label>
            <label className="mb-5 flex items-start gap-2 text-sm text-ink-muted">
              <input
                type="checkbox"
                required
                checked={aceptaSeguro}
                onChange={(e) => setAceptaSeguro(e.target.checked)}
                className="mt-0.5"
              />
              {t("checkout.aceptaSeguro")}
            </label>
            <button
              type="submit"
              className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-accent transition hover:bg-accent-600"
            >
              {t("checkout.confirmar")}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
