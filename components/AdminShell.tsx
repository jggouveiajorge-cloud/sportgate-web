"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAdminSession, clearAdminSession, type AdminSession, type AdminRole } from "@/lib/adminStore";
import { useLocale } from "@/lib/i18n/LocaleContext";

const NAV: { href: string; labelKey: string; roles: AdminRole[] }[] = [
  { href: "/admin/painel", labelKey: "admin.navPainel", roles: ["gestor", "administrador"] },
  { href: "/admin/parceiros", labelKey: "admin.navParceiros", roles: ["gestor", "administrador"] },
  { href: "/admin/desafios", labelKey: "admin.navDesafios", roles: ["gestor", "administrador"] },
  { href: "/admin/servicos", labelKey: "admin.navServicos", roles: ["gestor", "administrador"] },
  { href: "/admin/relatorios", labelKey: "admin.navRelatorios", roles: ["administrador"] },
];

/**
 * Marco compartido del panel de administración: guarda de sesión (redirige
 * a /admin si no hay sesión simulada), navegación lateral filtrada por
 * papel, y botón de salir. Ver lib/adminStore.ts para el modelo de datos y
 * el resumen del proyecto para el alcance ("Fase 1 — demo sin backend").
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<AdminSession | null | undefined>(undefined);

  useEffect(() => {
    const s = getAdminSession();
    setSession(s);
    if (!s) router.replace("/admin");
  }, [router]);

  if (session === undefined || session === null) return null;

  return (
    <div className="my-8 grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="h-max rounded-2xl border border-line bg-bg-1 p-4 lg:sticky lg:top-20">
        <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-ink-faint">{t("admin.panelTitulo")}</div>
        <div className="mb-4 text-sm font-semibold text-ink">
          {session.nombre} <span className="text-accent">· {session.role === "administrador" ? t("admin.rolAdministrador") : t("admin.rolGestor")}</span>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.filter((item) => item.roles.includes(session.role)).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                pathname === item.href ? "bg-accent-soft text-accent" : "text-ink-muted hover:bg-bg-2 hover:text-ink"
              }`}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => {
            clearAdminSession();
            router.push("/admin");
          }}
          className="mt-4 w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-xs font-bold text-ink-muted transition hover:border-line-strong hover:text-ink"
        >
          {t("admin.cerrarSesion")}
        </button>
        <Link href="/" className="mt-2 block text-center text-[11px] text-ink-faint hover:text-ink">
          {t("admin.volverSitio")}
        </Link>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
