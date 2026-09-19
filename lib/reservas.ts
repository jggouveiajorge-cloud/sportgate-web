import type { Intake } from "./types";

/**
 * "Reservas" simuladas del cliente — se crean al confirmar el checkout y
 * alimentan el "briefing de viaje" de Mi cuenta (checklist de equipaje,
 * cuenta atrás, recordatorios). Sin backend real, todo en localStorage.
 */
export interface ReservaPartner {
  id: string;
  name: string;
  type: string;
  price_eur: number;
}

export interface Reserva {
  id: string;
  creadoEn: string; // ISO date
  challengeId: string | null;
  challengeName: string;
  region: string;
  fechaObjetivo?: string;
  partners: ReservaPartner[];
  total: number;
  /** copia del checklist en el momento de la reserva, para el briefing de viaje */
  intake: Intake;
}

const KEY = "sportgate-reservas-v1";

export function getReservas(): Reserva[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Reserva[]) : [];
  } catch {
    return [];
  }
}

export function addReserva(reserva: Reserva) {
  try {
    const actuales = getReservas();
    window.localStorage.setItem(KEY, JSON.stringify([reserva, ...actuales]));
  } catch {
    /* almacenamiento no disponible */
  }
}
