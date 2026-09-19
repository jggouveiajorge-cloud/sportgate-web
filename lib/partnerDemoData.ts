/**
 * Datos de ejemplo del panel de partner — igual que los logos de "Partners
 * en la plataforma" en la home, son datos ilustrativos para que un inversor
 * vea el lado B del marketplace (saldo, leads, reservas, mensajes), nunca
 * cifras reales. Ver resumen sección 9, "Panel de partner".
 */
export const SALDO_DEMO_EUR = 1240;
export const SALDO_PENDIENTE_EUR = 380;

export interface LeadDemo {
  id: string;
  nombre: string;
  mensaje: string;
  fecha: string;
  estado: "nuevo" | "respondido";
}

export const LEADS_DEMO: LeadDemo[] = [
  {
    id: "lead-1",
    nombre: "Marta Iglesias",
    mensaje: "¿Tenéis disponibilidad para un grupo de 3 personas la última semana de julio?",
    fecha: "hace 2 días",
    estado: "nuevo",
  },
  {
    id: "lead-2",
    nombre: "Diego Fernández",
    mensaje: "¿La furgoneta de apoyo sube hasta el final del puerto o solo hasta la mitad?",
    fecha: "hace 4 días",
    estado: "nuevo",
  },
  {
    id: "lead-3",
    nombre: "Helena Costa",
    mensaje: "Perfecto, muchas gracias por la información. Reservo la semana que viene.",
    fecha: "hace 6 días",
    estado: "respondido",
  },
];

export interface ReservaAsignadaDemo {
  id: string;
  cliente: string;
  fecha: string;
  servicio: string;
  precio_eur: number;
  estado: "confirmada" | "pendiente";
}

export const RESERVAS_ASIGNADAS_DEMO: ReservaAsignadaDemo[] = [
  { id: "r-1", cliente: "Helena Costa", fecha: "2026-07-14", servicio: "Paquete 4 días", precio_eur: 890, estado: "confirmada" },
  { id: "r-2", cliente: "Grupo Iglesias (3)", fecha: "2026-07-28", servicio: "Paquete 4 días", precio_eur: 2670, estado: "pendiente" },
];
