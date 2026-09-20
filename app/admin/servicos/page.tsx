"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { PhotoUpload } from "@/components/PhotoUpload";
import { PartnerTypeIcon } from "@/components/PartnerTypeIcon";
import { getAdminServices, saveAdminServices, type AdminService } from "@/lib/adminStore";
import { useLocale } from "@/lib/i18n/LocaleContext";

const TITULO_KEYS: Record<string, string> = {
  operador: "home.servicioOperadorTitle",
  coach: "home.servicioCoachTitle",
  alquiler: "home.servicioAlquilerTitle",
  producto: "home.servicioProductoTitle",
};

export default function AdminServicosPage() {
  const { t } = useLocale();
  const [services, setServices] = useState<AdminService[] | null>(null);

  useEffect(() => {
    setServices(getAdminServices());
  }, []);

  function update(id: string, patch: Partial<AdminService>) {
    setServices((prev) => {
      if (!prev) return prev;
      const next = prev.map((s) => (s.id === id ? { ...s, ...patch } : s));
      saveAdminServices(next);
      return next;
    });
  }

  if (!services) return <AdminShell><div /></AdminShell>;

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-semibold text-ink">{t("admin.navServicos")}</h1>
      <p className="mt-1.5 max-w-xl text-sm text-ink-muted">{t("admin.servicosSubtitulo")}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <div key={s.id} className="rounded-2xl border border-line bg-bg-1 p-5">
            <div className="flex items-center gap-4">
              {s.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.photo} alt="" className="h-[72px] w-[72px] flex-shrink-0 rounded-xl object-cover" />
              ) : (
                <PartnerTypeIcon type={s.type as any} />
              )}
              <div>
                <h3 className="font-display text-base font-semibold text-ink">{t(TITULO_KEYS[s.type])}</h3>
                <label className="mt-1.5 flex items-center gap-2 text-xs font-semibold text-ink-muted">
                  <input
                    type="checkbox"
                    checked={s.featured}
                    onChange={() => update(s.id, { featured: !s.featured })}
                    className="h-4 w-4 rounded border-line-strong accent-accent"
                  />
                  {t("admin.usarFotoHome")}
                </label>
              </div>
            </div>
            <div className="mt-3 border-t border-line pt-3">
              <PhotoUpload
                value={s.photo}
                onChange={(photo) => update(s.id, { photo })}
                label={t("admin.fotoLabel")}
                buttonLabel={t("admin.fotoBoton")}
                removeLabel={t("admin.fotoQuitar")}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-line-strong bg-bg-1 p-5 text-[13px] leading-relaxed text-ink-muted">
        {t("admin.servicosAviso")}
      </div>
    </AdminShell>
  );
}
