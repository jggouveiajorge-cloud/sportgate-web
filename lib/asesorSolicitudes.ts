/** Solicitudes del formulario "Habla con un asesor" — localStorage, sin backend. */
export interface SolicitudAsesor {
  nombre: string;
  email: string;
  objetivo: string;
  creadoEn: string;
}

const KEY = "sportgate-asesor-v1";

export function addSolicitudAsesor(s: SolicitudAsesor) {
  try {
    const raw = window.localStorage.getItem(KEY);
    const actuales: SolicitudAsesor[] = raw ? JSON.parse(raw) : [];
    window.localStorage.setItem(KEY, JSON.stringify([s, ...actuales]));
  } catch {
    /* almacenamiento no disponible */
  }
}
