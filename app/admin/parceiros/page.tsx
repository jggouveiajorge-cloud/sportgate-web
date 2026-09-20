"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { PhotoUpload } from "@/components/PhotoUpload";
import { PartnerTypeIcon } from "@/components/PartnerTypeIcon";
import { getAdminPartners, saveAdminPartners, type AdminPartner } from "@/lib/adminStore";
import { useLocale } from "@/lib/i18n/LocaleContext";

type Filtro = "todos" | "pendientes" | "destacados";

export default function AdminParceirosPage() {
  const { t } = useLocale();
  const [partners, setPartners] = useState<AdminPartner[] | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("todos");

  useEffect(() => {
    setPartners(getAdminPartners());
  }, []);

  function update(id: string, patch: Partial<AdminPartner>) {
    setPartners((prev) => {
      if (!prev) return prev;
      const next = prev.map((p) => (p.id === id ? { ...p, ...patch } : p));
      saveAdminPartners(next);
      return next;
    });
  }

  if (!partners) return <AdminShell><div /></AdminShell>;

  const visibles = partners.filter((p) => {
    if (filtro === "pendientes") return p.estado === "pendiente";
    if (filtro === "destacados") return p.featured;
    return true;
  });

  const FILTROS: { value: Filtro; labelKey: string }[] = [
    { value: "todos", labelKey: "admin.filtroTodos" },
    { value: "pendientes", labelKey: "admin.filtroPendientes" },
    { value: "destacados", labelKey: "admin.filtroDestacados" },
  ];

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{t("admin.navParceiros")}</h1>
          <p className="mt-1 text-sm text-ink-muted">{t("admin.parceirosSubtitulo")}</p>
        </div>
        <div className="flex gap-1.5 rounded-xl border border-line bg-bg-1 p-1">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltro(f.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                filtro === f.value ? "bg-accent text-white" : "text-ink-muted hover:text-ink"
              }`}
            >
              {t(f.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {visibles.length === 0 && <p className="text-sm text-ink-muted">{t("admin.parceirosVacio")}</p>}
        {visibles.map((p) => (
          <div key={p.id} className="rounded-2xl border border-line bg-bg-1 p-4">
            <div className="flex flex-wrap items-start gap-4">
              <PartnerTypeIcon type={p.type} />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-1.5">
                  <h3 className="text-base font-semibold text-ink">{p.name}</h3>
                  {p.estado === "pendiente" && (
                    <span className="rounded-full bg-amber-soft px-2.5 py-0.5 text-[11px] font-bold text-amber">
                      {t("admin.estadoPendiente")}
                    </span>
                  )}
                  {p.verified && (
                    <span className="rounded-full bg-teal-soft px-2.5 py-0.5 text-[11px] font-bold text-teal">{t("admin.verificado")}</span>
                  )}
                </div>
                <div className="text-xs text-ink-muted">
                  {p.type} · {p.region} · {p.price_eur} € {p.price_unit ? `(${p.price_unit})` : ""}
                </div>
                {p.why && <p className="mt-1.5 max-w-xl text-[13px] text-ink-muted">{p.why}</p>}
              </div>
              <div className="flex flex-shrink-0 flex-col items-end gap-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
                  {t("admin.destacarHome")}
                  <input
                    type="checkbox"
                    checked={p.featured}
                    onChange={() => update(p.id, { featured: !p.featured })}
                    className="h-4 w-4 rounded border-line-strong accent-accent"
                  />
                </label>
                {p.estado === "pendiente" && (
                  <button
                    onClick={() => update(p.id, { estado: "aprobado", verified: true })}
                    className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white transition hover:bg-accent-600"
                  >
                    {t("admin.aprobar")}
                  </button>
                )}
              </div>
            </div>
            <div className="mt-3 border-t border-line pt-3">
              <PhotoUpload
                value={p.photo}
                onChange={(photo) => update(p.id, { photo })}
                label={t("admin.fotoLabel")}
                buttonLabel={t("admin.fotoBoton")}
                removeLabel={t("admin.fotoQuitar")}
              />
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
