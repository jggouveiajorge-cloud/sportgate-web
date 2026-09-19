"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearPartnerAccount, getPartnerAccount, type PartnerAccount } from "@/lib/partnerAccount";
import { getRespuestas, addRespuesta } from "@/lib/partnerMensajes";
import {
  LEADS_DEMO,
  RESERVAS_ASIGNADAS_DEMO,
  SALDO_DEMO_EUR,
  SALDO_PENDIENTE_EUR,
  type LeadDemo,
} from "@/lib/partnerDemoData";
import { StatTile } from "@/components/StatTile";
import { useLocale } from "@/lib/i18n/LocaleContext";

function LeadCard({ lead }: { lead: LeadDemo }) {
  const { t } = useLocale();
  const [abierto, setAbierto] = useState(false);
  const [respuestas, setRespuestas] = useState<string[]>([]);
  const [texto, setTexto] = useState("");

  useEffect(() => {
    setRespuestas(getRespuestas(lead.id));
  }, [lead.id]);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return;
    addRespuesta(lead.id, texto.trim());
    setRespuestas((prev) => [...prev, texto.trim()]);
    setTexto("");
  }

  return (
    <div className="rounded-2xl border border-line bg-bg-1 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-ink">{lead.nombre}</h3>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                lead.estado === "nuevo" ? "bg-accent-soft text-accent" : "bg-teal-soft text-teal"
              }`}
            >
              {lead.estado}
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">{lead.mensaje}</p>
          <p className="mt-1 text-xs text-ink-faint">{lead.fecha}</p>
        </div>
        <button
          onClick={() => setAbierto((v) => !v)}
          className="flex-shrink-0 rounded-lg border border-line bg-bg-2 px-3 py-1.5 text-xs font-bold text-ink transition hover:border-line-strong"
        >
          {abierto ? t("panelPartner.cerrar") : t("panelPartner.responder")}
        </button>
      </div>

      {abierto && (
        <div className="mt-3 border-t border-line pt-3">
          {respuestas.length > 0 && (
            <ul className="mb-3 space-y-1.5">
              {respuestas.map((r, i) => (
                <li key={i} className="rounded-xl bg-bg-2 px-3 py-2 text-[13px] text-ink">
                  {r}
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={enviar} className="flex gap-2">
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={t("panelPartner.escribeRespuesta")}
              className="flex-1 rounded-xl border border-line bg-bg-2 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white transition hover:bg-accent-600"
            >
              {t("panelPartner.enviar")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function PanelPartnerPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [partner, setPartnerState] = useState<PartnerAccount | null | undefined>(undefined);

  useEffect(() => {
    const p = getPartnerAccount();
    setPartnerState(p);
    if (!p) router.replace("/login-partner");
  }, [router]);

  if (partner === undefined || partner === null) return null;

  return (
    <div className="my-8 animate-rise">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">{partner.empresa}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {partner.tipo} · {partner.region}
          </p>
        </div>
        <button
          onClick={() => {
            clearPartnerAccount();
            router.push("/");
          }}
          className="rounded-xl border border-line bg-bg-2 px-4 py-2 text-xs font-bold text-ink-muted transition hover:border-line-strong hover:text-ink"
        >
          {t("panelPartner.cerrarSesion")}
        </button>
      </div>

      <div className="mt-3 rounded-xl bg-amber-soft px-4 py-2.5 text-xs font-semibold text-amber">
        {t("panelPartner.avisoDemo")}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <StatTile value={`${SALDO_DEMO_EUR}`} unit="€" label={t("panelPartner.saldoDisponible")} />
        <StatTile value={`${SALDO_PENDIENTE_EUR}`} unit="€" label={t("panelPartner.pendienteLiquidar")} />
        <StatTile value={`${LEADS_DEMO.filter((l) => l.estado === "nuevo").length}`} label={t("panelPartner.leadsNuevos")} />
        <StatTile value={`${RESERVAS_ASIGNADAS_DEMO.length}`} label={t("panelPartner.reservasAsignadas")} />
      </div>

      <div className="mt-10">
        <div className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-faint">
          {t("panelPartner.contactosLeads")}
        </div>
        <div className="flex flex-col gap-3">
          {LEADS_DEMO.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-faint">{t("panelPartner.reservasAsignadas")}</div>
        <div className="divide-y divide-line rounded-2xl border border-line bg-bg-1 px-4">
          {RESERVAS_ASIGNADAS_DEMO.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-4 text-sm">
              <div>
                <span className="font-semibold text-ink">{r.cliente}</span>
                <span className="ml-2 text-ink-muted">{r.servicio}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-ink-muted">{r.fecha}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${
                    r.estado === "confirmada" ? "bg-teal-soft text-teal" : "bg-amber-soft text-amber"
                  }`}
                >
                  {r.estado}
                </span>
                <span className="font-semibold text-ink">{r.precio_eur} €</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
