import type { PartnerType } from "./types";

/**
 * Simulación de cuenta de partner — registro/login propio, separado del de
 * cliente (ver resumen sección 9: "debe existir una forma de partner
 * registrarse y logar para realizar sus gestiones"). Sin backend real.
 */
export interface PartnerAccount {
  empresa: string;
  email: string;
  tipo: PartnerType;
  region: string;
  servicios: string;
  credenciales?: string;
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
