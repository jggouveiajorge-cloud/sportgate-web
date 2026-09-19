import type { Reserva } from "./reservas";

/**
 * Deriva el "briefing de viaje" (checklist de equipaje + recordatorios) a
 * partir de las respuestas de salud/equipo/logística guardadas en la
 * reserva — actualización (sugerencia implementada), ver resumen sección 9.
 */
export function checklistEquipaje(reserva: Reserva): string[] {
  const { intake } = reserva;
  const items: string[] = ["Documento de identidad / pasaporte en regla"];

  items.push(
    intake.seguro === "si"
      ? "Llevar la póliza de tu seguro deportivo"
      : "Contratar o confirmar un seguro que cubra actividad deportiva de riesgo"
  );

  items.push(
    intake.bici === "propia"
      ? `Preparar tu propia bicicleta${intake.bici_tipo ? ` (${intake.bici_tipo}${intake.bici_talla ? `, talla ${intake.bici_talla}` : ""})` : ""} y confirmar cómo la transportas`
      : "Confirmar talla y tipo de bicicleta con el punto de alquiler"
  );

  if (intake.alquiler_casco === "si") items.push("Casco — incluido en el alquiler, solo confirmar talla");
  else items.push("Llevar tu propio casco homologado");

  if (intake.alquiler_ropa === "si") items.push("Ropa técnica — incluida en el alquiler según el clima");
  else items.push("Preparar ropa técnica adecuada al clima del destino");

  if (intake.alquiler_gps === "si") items.push("GPS/ciclocomputador — incluido en el alquiler");

  if (intake.alojamiento_tipo && intake.alojamiento_tipo !== "no-necesito") {
    items.push(`Confirmar la reserva de alojamiento (${intake.alojamiento_tipo})`);
  }

  if (intake.transporte_aeropuerto === "si") items.push("Coordinar el transporte desde el aeropuerto más cercano");

  if (intake.restricciones_alimentarias) {
    items.push(`Avisar a los partners de tus restricciones alimentarias: ${intake.restricciones_alimentarias}`);
  }

  if (intake.factor_riesgo_cv === "si" || intake.medicacion_esfuerzo === "si") {
    items.push("Llevar el informe de tu profesional de salud y tu medicación habitual");
  }

  return items;
}

export function recordatoriosSimulados(): string[] {
  return [
    "7 días antes: revisión mecánica completa de la bicicleta",
    "3 días antes: confirmar el punto de encuentro con tu operador o coach",
    "1 día antes: preparar la maleta con el checklist de equipo de arriba",
    "El día del reto: llegar con margen y avisar a tu contacto de emergencia de tu ruta",
  ];
}

/** Días que faltan hasta la fecha objetivo, o null si no hay fecha guardada. */
export function diasHastaReto(fechaObjetivo?: string): number | null {
  if (!fechaObjetivo) return null;
  const objetivo = new Date(fechaObjetivo);
  if (Number.isNaN(objetivo.getTime())) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  objetivo.setHours(0, 0, 0, 0);
  return Math.round((objetivo.getTime() - hoy.getTime()) / 86_400_000);
}
