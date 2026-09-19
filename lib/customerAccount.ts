/**
 * Simulación de cuenta de cliente — sin backend ni autenticación real, como
 * el resto de la demo. Solo para que un inversor vea el ciclo completo
 * (Registro/Login de cliente → Mi cuenta), ver resumen sección 9.
 */
export interface Cliente {
  nombre: string;
  email: string;
}

const KEY = "sportgate-cliente-v1";

export function getCliente(): Cliente | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Cliente) : null;
  } catch {
    return null;
  }
}

export function setCliente(cliente: Cliente) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cliente));
  } catch {
    /* almacenamiento no disponible */
  }
}

export function clearCliente() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* almacenamiento no disponible */
  }
}
