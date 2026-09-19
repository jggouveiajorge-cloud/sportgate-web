export type PartnerType = "operador" | "coach" | "alquiler" | "producto" | "salud";

export type Level = "principiante" | "intermedio" | "intermedio-alto" | "avanzado";

export interface Challenge {
  id: string;
  name: string;
  region: string;
  country: string;
  aliases: string[];
  distance_km: number;
  elevation_gain_m: number;
  avg_gradient: number;
  max_gradient: number;
  difficulty_score: number;
  min_level: Level | "cualquiera";
  description: string;
  /** perfil de elevación simplificado, 0-100, para el sparkline */
  elevation_profile: number[];
}

export interface Partner {
  id: string;
  type: PartnerType;
  name: string;
  region: string;
  country: string;
  min_level: Level | "cualquiera";
  services: string[];
  certification?: string;
  languages?: string[];
  price_eur: number;
  price_unit?: string;
  rating: number;
  reviews_count: number;
  verified: boolean;
  why: string;
}

export interface Sponsor {
  id: string;
  initials: string;
  category: string;
}

export interface Review {
  author: string;
  rating: number;
  text: string;
  dims?: {
    guia: number;
    itinerario: number;
    equipo: number;
    precio: number;
  };
}

export interface Intake {
  // Paso 1 — el reto
  fecha_objetivo?: string;
  duracion?: "dia" | "finde" | "semana";
  presupuesto?: "economico" | "medio" | "premium";
  foco_experiencia?: "reto" | "reto-paisaje" | "reto-social";

  // Paso 2 — nivel y rutina
  nivel_autoevaluado?: Level;
  volumen_semanal_h?: string;
  semanas_disponibles?: string;
  anos_experiencia?: string;
  desnivel_habitual_mensual?: string;

  // Paso 3 — salud y seguridad
  factor_riesgo_cv?: "si" | "no";
  medicacion_esfuerzo?: "si" | "no";
  banda_edad?: "18-30" | "31-45" | "46-60" | "60+";
  seguro?: "si" | "no" | "no-se";
  consiento_salud?: "si";

  // Paso 4 — equipo
  bici?: "propia" | "alquiler";
  bici_tipo?: "carretera" | "gravel" | "mtb" | "electrica";
  bici_talla?: string;
  alquiler_casco?: "si";
  alquiler_gps?: "si";
  alquiler_ropa?: "si";

  // Paso 5 — alojamiento y logística
  alojamiento_tipo?: "hotel" | "rural" | "albergue" | "no-necesito";
  transporte_aeropuerto?: "si" | "no";
  acompanantes?: string;

  // Paso 6 — alimentación y preferencias
  restricciones_alimentarias?: string;
  interes_suplementos?: "si";
  ritmo?: "social" | "mixto" | "rendimiento";
}

/**
 * Filtros del buscador avanzado (sección "Where / When / What / Who",
 * inspirado en Booking.com — ver resumen, sección 10). Se guardan aparte del
 * Intake porque son contexto de búsqueda previo al checklist, no respuestas
 * del checklist en sí.
 */
export interface Filtros {
  /** Where — limitado a las 4 regiones curadas (lib/regions.ts) */
  region?: string;
  /** When — fecha aproximada; pre-rellena el Paso 1 del checklist */
  fecha?: string;
  /** What — mapea a PartnerType: reto guiado (operador), con coach, o solo alquiler */
  tipoExperiencia?: PartnerType;
  /** Who — pregunta binaria simple; el modo organizador de grupo es Fase 2 */
  soloGrupo?: "solo" | "grupo";
  /**
   * true cuando el reto detectado por texto libre no coincide con el
   * destino elegido en el desplegable — aviso suave, nunca bloquea (ver
   * "Tres modos de uso" en el resumen).
   */
  conflicto?: boolean;
}

export interface WizardState {
  queryOriginal: string;
  challengeId: string | null;
  intake: Intake;
  seleccion: string[];
  filtros: Filtros;
}
