"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getCliente, setCliente } from "@/lib/customerAccount";
import { Field, TextInput } from "@/components/FormControls";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Demo sin autenticación real: si ya existe una cuenta guardada en este
    // navegador con ese email la reutilizamos, si no, creamos una mínima.
    const existente = getCliente();
    if (existente && existente.email === email) {
      router.push("/cuenta");
      return;
    }
    setCliente({ nombre: email.split("@")[0], email });
    router.push("/cuenta");
  }

  return (
    <div className="my-8 mx-auto max-w-md animate-rise rounded-3xl border border-line bg-bg-1 p-8 shadow-md">
      <h1 className="font-display text-2xl font-semibold text-ink">{t("login.titulo")}</h1>
      <p className="mt-1.5 text-sm text-ink-muted">{t("login.subtitulo")}</p>
      <form className="mt-6" onSubmit={handleSubmit}>
        <Field label={t("login.emailLabel")}>
          <TextInput
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("login.emailPlaceholder")}
          />
        </Field>
        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-accent transition hover:bg-accent-600"
        >
          {t("login.entrar")}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-ink-muted">
        {t("login.noTienesCuenta")}{" "}
        <Link href="/registro" className="font-semibold text-accent">
          {t("login.registrate")}
        </Link>
      </p>
    </div>
  );
}
