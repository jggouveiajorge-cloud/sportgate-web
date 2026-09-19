"use client";

import Link from "next/link";
import { useState } from "react";
import { addSolicitudAsesor } from "@/lib/asesorSolicitudes";
import { Field, TextInput } from "@/components/FormControls";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function AsesorPage() {
  const { t } = useLocale();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addSolicitudAsesor({ nombre, email, objetivo, creadoEn: new Date().toISOString() });
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="my-8 mx-auto max-w-md animate-rise rounded-3xl border border-line bg-bg-1 p-8 text-center shadow-md">
        <div className="mb-3 text-3xl">✓</div>
        <h1 className="font-display text-xl font-semibold text-ink">{t("asesor.confirmacionTitulo")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {t("asesor.confirmacionTexto", { nombre: nombre || "!" })}
        </p>
        <Link href="/" className="mt-5 inline-block rounded-xl border border-line bg-bg-2 px-5 py-2.5 text-sm font-bold text-ink hover:border-line-strong">
          {t("asesor.volverInicio")}
        </Link>
      </div>
    );
  }

  return (
    <div className="my-8 mx-auto max-w-md animate-rise rounded-3xl border border-line bg-bg-1 p-8 shadow-md">
      <h1 className="font-display text-2xl font-semibold text-ink">{t("asesor.titulo")}</h1>
      <p className="mt-1.5 text-sm text-ink-muted">{t("asesor.subtitulo")}</p>
      <form className="mt-6" onSubmit={handleSubmit}>
        <Field label={t("asesor.nombreLabel")}>
          <TextInput
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder={t("asesor.nombrePlaceholder")}
          />
        </Field>
        <Field label={t("asesor.emailLabel")}>
          <TextInput
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("asesor.emailPlaceholder")}
          />
        </Field>
        <Field label={t("asesor.objetivoLabel")}>
          <textarea
            required
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            placeholder={t("asesor.objetivoPlaceholder")}
            className="min-h-[100px] w-full resize-none rounded-xl border border-line bg-bg-2 px-3.5 py-3 text-[15px] text-ink placeholder:text-ink-faint transition focus:border-accent focus:outline-none"
          />
        </Field>
        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-accent transition hover:bg-accent-600"
        >
          {t("asesor.enviarSolicitud")}
        </button>
      </form>
    </div>
  );
}
