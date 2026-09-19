"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCliente, type Cliente } from "@/lib/customerAccount";
import { getPartnerAccount, type PartnerAccount } from "@/lib/partnerAccount";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { FontSizeControl } from "./FontSizeControl";

// Cabecera en dos franjas, inspirada en la referencia de Backroads que pasó
// Jorge: arriba una franja fina de cuenta/preferencias (idioma, tamaño de
// letra, tema, contacto, iniciar sesión / hazte partner), abajo una franja
// de navegación principal más grande (secciones de la home) con el buscador
// como acceso directo a la derecha, igual que el icono de lupa de Backroads.
export function Nav() {
  const { t } = useLocale();
  // Estado de sesión simulada (localStorage).
  const [cliente, setClienteState] = useState<Cliente | null>(null);
  const [partner, setPartnerState] = useState<PartnerAccount | null>(null);

  useEffect(() => {
    setClienteState(getCliente());
    setPartnerState(getPartnerAccount());
  }, []);

  return (
    <div className="sticky top-0 z-20 border-b border-line bg-bg-0/95 backdrop-blur-md backdrop-saturate-150">
      {/* Franja superior: logo + cuenta/preferencias */}
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-2.5">
        <Link href="/" className="mr-auto inline-flex items-start gap-1 text-lg font-extrabold tracking-wide text-ink">
          SPORTGATE
          <span className="-mt-0.5 text-sm font-extrabold text-accent">↗</span>
        </Link>

        <Link href="/contacto" className="hidden text-[13px] font-semibold text-ink-muted transition hover:text-ink sm:inline">
          {t("nav.contacto")}
        </Link>

        <Link
          href={partner ? "/panel-partner" : "/hazte-partner"}
          className="hidden rounded-full bg-accent-soft px-3.5 py-1.5 text-xs font-bold text-accent sm:inline-flex"
        >
          {partner ? t("nav.panelPartner") : t("nav.hazteBartner")}
        </Link>

        <span className="hidden h-5 w-px bg-line sm:inline-block" aria-hidden />

        {/* Controles de accesibilidad/preferencias: idioma, tamaño de letra
            y tema, siempre juntos y siempre visibles (feedback de Jorge — el
            de fuente debe estar en el menú superior, al lado del de idioma,
            en ambos idiomas). */}
        <div className="flex flex-shrink-0 items-center gap-1.5">
          <LanguageToggle />
          <FontSizeControl />
          <ThemeToggle />
        </div>

        <Link
          href={cliente ? "/cuenta" : "/login"}
          className="flex h-8 flex-shrink-0 items-center gap-1.5 rounded-full border border-line-strong bg-bg-2 px-3.5 text-xs font-bold text-ink transition hover:border-accent"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
          </svg>
          <span className="hidden sm:inline">{cliente ? cliente.nombre.split(" ")[0] : t("nav.iniciarSesion")}</span>
        </Link>
      </div>

      {/* Franja principal: navegación de secciones + acceso directo al
          buscador (equivalente al icono de lupa de la segunda franja de
          Backroads). */}
      <div className="hidden border-t border-line lg:block">
        <div className="mx-auto flex max-w-5xl items-center gap-7 px-4 py-2.5 text-[15px] font-semibold text-ink-muted">
          <Link href="/#como-funciona" className="transition hover:text-ink">
            {t("nav.comoFunciona")}
          </Link>
          <Link href="/#servicios" className="transition hover:text-ink">
            {t("nav.servicios")}
          </Link>
          <Link href="/#donde-operamos" className="transition hover:text-ink">
            {t("nav.dondeOperamos")}
          </Link>
          <Link href="/#por-que" className="transition hover:text-ink">
            {t("nav.porQue")}
          </Link>
          <Link href="/#partners" className="transition hover:text-ink">
            {t("nav.partners")}
          </Link>

          <Link
            href="/#buscar"
            aria-label={t("nav.buscarAria")}
            className="ml-auto flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-line text-ink-muted transition hover:border-line-strong hover:text-ink"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
