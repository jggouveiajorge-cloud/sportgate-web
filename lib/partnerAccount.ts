import type { PartnerType } from "./types";

/**
 * Simulación de cuenta de partner — registro/login propio, separado del de
 * cliente (ver resumen sección 9: "debe existir una forma de partner
 * registrarse y logar para realizar sus gestiones"). Sin backend real.
 *
 * Campos añadidos tras revisar el formulario con Jorge (precio de
 * referencia, credencial estructurada por tipo de partner, aceptación de
 * términos) — ver resumen, sección "Cadastro de operadores: mejoras".
 */
export interface PartnerAccount {
  empresa: string;
  email: string;
  tipo: PartnerType;
  region: string;
  servicios: string;
  price_eur?: number;
  price_unit?: string;
  /** Credencial/certificación principal — su significado exacto depende del
   *  tipo de partner (ver TIPO_CAMPOS en app/hazte-partner/page.tsx). */
  credencialPrincipal?: string;
  /** Valor del campo adicional específico del tipo (checkbox → "si"/"no",
   *  texto → valor libre). */
  campoExtraValor?: string;
  aceptaTerminos?: boolean;
}

const KEY = "sportgate-partner-v1";

export function getPartnerAccount(): PartnerAccount | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PartnerAccount) : null;
  } catch {
    return null;
  }
}

export function setPartnerAccount(partner: PartnerAccount) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(partner));
  } catch {
    /* almacenamiento no disponible */
  }
}

export function clearPartnerAccount() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* almacenamiento no disponible */
  }
}
