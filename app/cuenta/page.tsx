"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearCliente, getCliente, type Cliente } from "@/lib/customerAccount";
import { getReservas, type Reserva } from "@/lib/reservas";
import { checklistEquipaje, diasHastaReto, recordatoriosSimulados } from "@/lib/travelBriefing";
import { useWizard } from "@/components/WizardProvider";
import { getChallengeById } from "@/lib/match";
import { useLocale } from "@/lib/i18n/LocaleContext";

function BriefingDeViaje({ reserva }: { reserva: Reserva }) {
  const { t } = useLocale();
  const dias = diasHastaReto(reserva.fechaObjetivo);
  const items = checklistEquipaje(reserva);
  const recordatorios = recordatoriosSimulados();

  return (
    <div className="mt-4 rounded-2xl border border-line bg-bg-2 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-display text-sm font-semibold text-ink">{t("cuenta.briefingTitle")}</h4>
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent">
          {dias === null
            ? t("cuenta.sinFecha")
            : dias > 0
            ? t("cuenta.faltanDias", { dias })
            : dias === 0
            ? t("cuenta.esHoy")
            : t("cuenta.retoYaRealizado")}
        </span>
      </div>

      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-faint">
            {t("cuenta.checklistEquipajeTitle")}
          </div>
          <ul className="space-y-1.5 text-[13px] text-ink-muted">
            {items.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden>☐</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-faint">
            {t("cuenta.recordatoriosTitle")}
          </div>
          <ul className="space-y-1.5 text-[13px] text-ink-muted">
            {recordatorios.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function CuentaPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [cliente, setClienteState] = useState<Cliente | null | undefined>(undefined);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const { state, hydrated } = useWizard();

  useEffect(() => {
    const c = getCliente();
    setClienteState(c);
    if (!c) router.replace("/login");
    setReservas(getReservas());
  }, [router]);

  const retoActual = hydrated ? getChallengeById(state.challengeId) : null;

  if (cliente === undefined || cliente === null) return null;

  return (
    <div className="my-8 animate-rise">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">{t("cuenta.saludo", { nombre: cliente.nombre })}</h1>
          <p className="mt-1 text-sm text-ink-muted">{cliente.email}</p>
        </div>
        <button
          onClick={() => {
            clearCliente();
            router.push("/");
          }}
          className="rounded-xl border border-line bg-bg-2 px-4 py-2 text-xs font-bold text-ink-muted transition hover:border-line-strong hover:text-ink"
        >
          {t("cuenta.cerrarSesion")}
        </button>
      </div>

      {retoActual && (
        <div className="mt-8">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-faint">{t("cuenta.retoEnCurso")}</div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-bg-1 p-5">
            <div>
              <h3 className="font-display text-base font-semibold text-ink">{retoActual.name}</h3>
              <p className="text-[13px] text-ink-muted">{retoActual.region}</p>
            </div>
            <Link
              href="/resultados"
              className="rounded-xl border border-line-strong bg-bg-2 px-4 py-2 text-xs font-bold text-ink transition hover:border-accent"
            >
              {t("cuenta.continuar")}
            </Link>
          </div>
        </div>
      )}

      <div className="mt-10">
        <div className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-faint">{t("cuenta.tusReservas")}</div>
        {reservas.length === 0 ? (
          <p className="text-sm text-ink-muted">
            {t("cuenta.sinReservas")}{" "}
            <Link href="/#buscar" className="font-semibold text-accent">
              {t("cuenta.buscaProximoReto")}
            </Link>
            .
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {reservas.map((r) => (
              <div key={r.id} className="rounded-2xl border border-line bg-bg-1 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-ink">{r.challengeName}</h3>
                  <span className="text-sm text-ink-muted">
                    {r.total} € {t("cuenta.totalLabel")}
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-ink-muted">
                  {r.region} · {r.partners.length}{" "}
                  {r.partners.length === 1 ? t("cuenta.servicioReservado") : t("cuenta.serviciosReservados")}
                </p>
                <BriefingDeViaje reserva={r} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
