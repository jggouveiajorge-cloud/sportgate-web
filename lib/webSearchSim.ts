/**
 * Simulación de "buscar más en internet" fuera de la red de parceiros dados
 * de alta. En producción esto llamaría a un servicio real de búsqueda +
 * verificación (y esos resultados NO podrían venderse ni cobrarse dentro de
 * SPORTGATE hasta pasar el alta de partner). Aquí devolvemos placeholders
 * explícitamente ficticios y etiquetados como no verificados — nunca nombres
 * de empresas reales — para no aparentar ser un resultado real de búsqueda.
 */
export interface WebResult {
  label: string;
  note: string;
}

export function simulateWebSearch(regionName: string): WebResult[] {
  return [
    {
      label: `Operador local en ${regionName} (ejemplo, pendiente de verificar)`,
      note: "Resultado simulado: así se vería un hallazgo de una búsqueda web real, antes de pasar por el alta y verificación de SPORTGATE.",
    },
    {
      label: `Tienda de material de ciclismo en ${regionName} (ejemplo, pendiente de verificar)`,
      note: "En producción, este paso consultaría directorios y la web abierta, y solo se podría reservar dentro de la plataforma tras verificarse.",
    },
  ];
}
