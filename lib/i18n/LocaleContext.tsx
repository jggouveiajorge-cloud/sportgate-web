"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dictionaries, type Locale } from "./dictionaries";

const KEY = "sportgate-locale";
const DEFAULT_LOCALE: Locale = "es";

export function getStoredLocale(): Locale {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw === "en" || raw === "es" ? raw : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

/**
 * Script inline que se inyecta en <head> (ver app/layout.tsx), mismo patrón
 * que themeInitScript en lib/theme.ts: fija lang="es"/"en" en <html> antes
 * del primer pintado. No evita el "flash" del texto en sí (eso requeriría
 * rutas /en/... con el idioma resuelto en el servidor — fuera de alcance de
 * este MVP sin backend), pero mantiene el atributo lang correcto desde ya.
 */
export function localeInitScript() {
  try {
    var stored = window.localStorage.getItem("sportgate-locale");
    var locale = stored === "en" || stored === "es" ? stored : "es";
    document.documentElement.setAttribute("lang", locale);
  } catch (e) {
    document.documentElement.setAttribute("lang", "es");
  }
}

function lookup(dict: Record<string, any>, path: string): unknown {
  return path.split(".").reduce<any>((acc, part) => (acc && typeof acc === "object" ? acc[part] : undefined), dict);
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Busca "seccion.clave" en el diccionario del idioma activo; si falta,
   *  cae al español; si tampoco existe ahí, devuelve la propia clave (útil
   *  para detectar a simple vista una traducción que falta). Si se pasa
   *  `vars`, sustituye placeholders "{{nombre}}" por su valor — así los
   *  textos con datos dinámicos (nombres de reto, regiones, números...)
   *  también se pueden traducir sin partir la frase en trozos sueltos. */
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Igual que el tema: arrancamos en "es" (el idioma por defecto que ya
  // fija localeInitScript en <head>) y ajustamos tras montar, para que la
  // hidratación de React coincida con lo que el script inline ya puso.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    setLocaleState(getStoredLocale());
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    document.documentElement.setAttribute("lang", next);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      /* almacenamiento no disponible: el idioma no persiste entre visitas */
    }
  }

  function t(key: string, vars?: Record<string, string | number>): string {
    const fromCurrent = lookup(dictionaries[locale], key);
    const raw = typeof fromCurrent === "string" ? fromCurrent : undefined;
    const fromEs = raw === undefined ? lookup(dictionaries.es, key) : undefined;
    const text = raw ?? (typeof fromEs === "string" ? fromEs : undefined) ?? key;
    if (!vars) return text;
    return text.replace(/\{\{(\w+)\}\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
  }

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale debe usarse dentro de <LocaleProvider>");
  return ctx;
}
