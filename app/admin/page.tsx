"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAdminSession, setAdminSession, type AdminRole } from "@/lib/adminStore";
import { Field, TextInput, OptionGrid, OptionCard } from "@/components/FormControls";
import { useLocale } from "@/lib/i18n/LocaleContext";

/**
 * Login del área administrativa — simulado, sin contraseña real, igual que
 * el resto de la demo (login-partner, login cliente). El papel elegido aquí
 * (gestor/administrador) decide qué secciones se ven en AdminShell.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [nombre, setNombre] = useState("");
  const [role, setRole] = useState<AdminRole>("gestor");

  useEffect(() => {
    if (getAdminSession()) router.replace("/admin/painel");
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAdminSession({
      nombre: nombre.trim() || (role === "administrador" ? t("admin.rolAdministrador") : t("admin.rolGestor")),
      role,
    });
    router.push("/admin/painel");
  }

  return (
    <div className="my-8 mx-auto max-w-md animate-rise rounded-3xl border border-line bg-bg-1 p-8 shadow-md">
      <h1 className="font-display text-2xl font-semibold text-ink">{t("admin.loginTitulo")}</h1>
      <p className="mt-1.5 text-sm text-ink-muted">{t("admin.loginSubtitulo")}</p>
      <form className="mt-6" onSubmit={handleSubmit}>
        <Field label={t("admin.loginNombreLabel")}>
          <TextInput value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder={t("admin.loginNombrePlaceholder")} />
        </Field>
        <Field label={t("admin.loginRolLabel")} hint={t("admin.loginRolHint")}>
          <OptionGrid>
            <OptionCard name="role" value="gestor" checked={role === "gestor"} onChange={() => setRole("gestor")}>
              {t("admin.rolGestor")}
            </OptionCard>
            <OptionCard name="role" value="administrador" checked={role === "administrador"} onChange={() => setRole("administrador")}>
              {t("admin.rolAdministrador")}
            </OptionCard>
          </OptionGrid>
        </Field>
        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-accent transition hover:bg-accent-600"
        >
          {t("admin.loginEntrar")}
        </button>
      </form>
    </div>
  );
}
