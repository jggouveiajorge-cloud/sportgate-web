"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setCliente } from "@/lib/customerAccount";
import { Field, TextInput } from "@/components/FormControls";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function RegistroPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCliente({ nombre, email });
    router.push("/cuenta");
  }

  return (
    <div className="my-8 mx-auto max-w-md animate-rise rounded-3xl border border-line bg-bg-1 p-8 shadow-md">
      <h1 className="font-display text-2xl font-semibold text-ink">{t("registro.titulo")}</h1>
      <p className="mt-1.5 text-sm text-ink-muted">{t("registro.subtitulo")}</p>
      <form className="mt-6" onSubmit={handleSubmit}>
        <Field label={t("registro.nombreLabel")}>
          <TextInput
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder={t("registro.nombrePlaceholder")}
          />
        </Field>
        <Field label={t("registro.emailLabel")}>
          <TextInput
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("registro.emailPlaceholder")}
          />
        </Field>
        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-accent transition hover:bg-accent-600"
        >
          {t("registro.crearCuenta")}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-ink-muted">
        {t("registro.yaTienesCuenta")}{" "}
        <Link href="/login" className="font-semibold text-accent">
          {t("registro.iniciaSesion")}
        </Link>
      </p>
    </div>
  );
}
