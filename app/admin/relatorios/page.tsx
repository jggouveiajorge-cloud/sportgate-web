"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { getAdminSession, getAdminPartners, getAdminChallenges } from "@/lib/adminStore";
import { SALDO_DEMO_EUR, SALDO_PENDIENTE_EUR, RESERVAS_ASIGNADAS_DEMO } from "@/lib/partnerDemoData";
import { useLocale } from "@/lib/i18n/LocaleContext";

/**
 * Solo visible para el papel "administrador" (ver AdminShell y el filtro de
 * NAV por rol). Agrega los mismos datos de ejemplo que ya existían en el
 * panel de partner (lib/partnerDemoData.ts) — no son cifras reales, y no
 * pueden serlo hasta que exista una base de datos real de transacciones
 * (ver aviso al final de la página y el resumen del proyecto, Fase 2).
 */
export default function AdminRelatoriosPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [totals, setTotals] = useState<{ aprobados: number; pendientes: number; destacados: number } | null>(null);

  useEffect(() => {
    const session = getAdminSession();
    if (session && session.role !== "administrador") {
      router.replace("/admin/painel");
      return;
    }
    const partners = getAdminPartners();
    const challenges = getAdminChallenges();
    setTotals({
      aprobados: partners.filter((p) => p.estado === "aprobado").length,
      pendientes: partners.filter((p) => p.estado === "pendiente").length,
      destacados: challenges.filter((c) => c.featured).length,
    });
  }, [router]);

  if (!totals) return <AdminShell><div /></AdminShell>;

  const ventasDemo = RESERVAS_ASIGNADAS_DEMO.reduce((sum, r) => sum + r.precio_eur, 0);

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-semibold text-ink">{t("admin.navRelatorios")}</h1>
      <p className="mt-1.5 max-w-xl text-sm text-ink-muted">{t("admin.relatoriosAviso")}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("admin.relSaldoDisponible")} value={`${SALDO_DEMO_EUR} €`} />
        <StatCard label={t("admin.relSaldoPendiente")} value={`${SALDO_PENDIENTE_EUR} €`} />
        <StatCard label={t("admin.relVentasDemo")} value={`${ventasDemo} €`} />
        <StatCard label={t("admin.relPartnersAprobados")} value={`${totals.aprobados}`} />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("admin.statPendientes")} value={`${totals.pendientes}`} />
        <StatCard label={t("admin.relDesafiosDestacados")} value={`${totals.destacados}`} />
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-line-strong bg-bg-1 p-5 text-[13px] leading-relaxed text-ink-muted">
        {t("admin.relatoriosNotaBackend")}
      </div>
    </AdminShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-bg-1 p-5">
      <div className="font-display text-2xl font-semibold text-ink">{value}</div>
      <div className="mt-1 text-xs text-ink-muted">{label}</div>
    </div>
  );
}
