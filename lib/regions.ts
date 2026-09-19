/**
 * Fuente única de las 4 regiones curadas del MVP. La usan tanto la sección
 * "Dónde operamos" de la home como el desplegable "Destino" del buscador
 * avanzado, para garantizar coherencia destino ↔ navegación (ver resumen,
 * sección 10).
 */
export interface Region {
  flag: string;
  name: string;
}

export const REGIONS: Region[] = [
  { flag: "🇫🇷🇮🇹", name: "Alpes (Francia/Italia)" },
  { flag: "🇪🇸", name: "Mallorca (España)" },
  { flag: "🇺🇸", name: "Colorado (EE. UU.)" },
  { flag: "🇧🇷", name: "Santa Catarina (Brasil)" },
];
