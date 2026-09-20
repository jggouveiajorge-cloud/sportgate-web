"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { getAdminPartners, getAdminChallenges, getAdminServices, getAdminSession } from "@/lib/adminStore";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function AdminPainelPage() {
  const { t } = useLocale();
  const [stats, setStats] = useState<{ partners: number; pendientes: number; challenges: number; services: number } | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const partners = getAdminPartners();
    const challenges = getAdminChallenges();
    const services = getAdminServices();
    setStats({
      partners: partners.length,
      pendientes: partners.filter((p) => p.estado === "pendiente").length,
      challenges: challenges.length,
      services: services.length,
    });
    setRole(getAdminSession()?.role ?? null);
  }, []);

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-semibold text-ink">{t("admin.painelTitulo")}</h1>
      <p className="mt-1.5 max-w-xl text-sm text-ink-muted">{t("admin.painelSubtitulo")}</p>

      {stats && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label={t("admin.statParceiros")} value={stats.partners} />
          <StatCard label={t("admin.statPendientes")} value={stats.pendientes} highlight={stats.pendientes > 0} />
          <StatCard label={t("admin.statDesafios")} value={stats.challenges} />
          <StatCard label={t("admin.statServicos")} value={stats.services} />
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <QuickLink href="/admin/parceiros" title={t("admin.navParceiros")} text={t("admin.quickParceirosText")} />
        <QuickLink href="/admin/desafios" title={t("admin.navDesafios")} text={t("admin.quickDesafiosText")} />
        <QuickLink href="/admin/servicos" title={t("admin.navServicos")} text={t("admin.quickServicosText")} />
      </div>

      {role === "administrador" && (
        <div className="mt-8 rounded-2xl border border-dashed border-line-strong bg-bg-1 p-5">
          <div className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-faint">{t("admin.navRelatorios")}</div>
          <p className="text-sm text-ink-muted">{t("admin.relatoriosTeaser")}</p>
          <Link href="/admin/relatorios" className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">
            {t("admin.relatoriosVerLink")} →
          </Link>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-dashed border-line-strong bg-bg-1 p-5 text-[13px] leading-relaxed text-ink-muted">
        {t("admin.painelAviso")}
      </div>
    </AdminShell>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? "border-amber bg-amber-soft" : "border-line bg-bg-1"}`}>
      <div className={`font-display text-2xl font-semibold ${highlight ? "text-amber" : "text-ink"}`}>{value}</div>
      <div className="mt-1 text-xs text-ink-muted">{label}</div>
    </div>
  );
}

function QuickLink({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-line bg-bg-1 p-5 transition hover:-translate-y-0.5 hover:border-line-strong">
      <h3 className="font-display text-base font-semibold text-ink">{title} →</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">{text}</p>
    </Link>
  );
}
