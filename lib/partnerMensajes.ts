/**
 * Respuestas del partner a los leads de ejemplo — mensajería simple del
 * panel de partner (ver resumen sección 9). Se guarda en localStorage,
 * indexado por id de lead.
 */
const KEY = "sportgate-partner-mensajes-v1";

type Mensajes = Record<string, string[]>;

function readAll(): Mensajes {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Mensajes) : {};
  } catch {
    return {};
  }
}

export function getRespuestas(leadId: string): string[] {
  return readAll()[leadId] ?? [];
}

export function addRespuesta(leadId: string, texto: string) {
  try {
    const all = readAll();
    all[leadId] = [...(all[leadId] ?? []), texto];
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* almacenamiento no disponible */
  }
}
