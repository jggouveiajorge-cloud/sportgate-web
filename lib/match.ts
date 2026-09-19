import { CHALLENGES } from "./challenges";
import { PARTNERS } from "./partners";
import type { Challenge, Intake, Level, Partner } from "./types";

const LEVEL_ORDER: Level[] = ["principiante", "intermedio", "intermedio-alto", "avanzado"];

/** minúsculas y sin acentos, para un matching de texto simple y tolerante */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * En un producto real, esta función la haría un agente de IA que extrae
 * intención estructurada del lenguaje natural (el checklist de seguridad del
 * proyecto exige que el LLM solo EXTRAIGA, nunca decida el ranking). Para la
 * demo, usamos coincidencia de texto contra los alias de cada reto — mismo
 * contrato de entrada/salida que tendría el agente real.
 */
export function findChallengeInText(text: string): Challenge | null {
  const normText = normalize(text);
  for (const challenge of CHALLENGES) {
    const candidates = [challenge.name, ...challenge.aliases];
    for (const candidate of candidates) {
      if (normText.includes(normalize(candidate))) {
        return challenge;
      }
    }
  }
  return null;
}

export function levelMeetsMinimum(userLevel: Level | undefined, minLevel: Level | "cualquiera"): boolean {
  if (minLevel === "cualquiera" || !userLevel) return true;
  const userIdx = LEVEL_ORDER.indexOf(userLevel);
  const minIdx = LEVEL_ORDER.indexOf(minLevel);
  if (userIdx === -1 || minIdx === -1) return true;
  return userIdx >= minIdx;
}

/**
 * Motor de reglas explícito (no una caja negra): filtra por región del reto
 * y por si el nivel declarado por el cliente alcanza el mínimo del partner.
 * Cada resultado lleva su propio "why", tal y como exige la transparencia
 * del Artículo 50 del AI Act del checklist del proyecto.
 */
export function matchPartners(challenge: Challenge | null, intake: Intake): Partner[] {
  const region = challenge?.region;
  const userLevel = intake.nivel_autoevaluado;

  const results = PARTNERS.filter((p) => {
    if (region && p.region !== region) return false;
    if (!levelMeetsMinimum(userLevel, p.min_level)) return false;
    return true;
  });

  results.sort((a, b) => {
    if (a.verified !== b.verified) return a.verified ? -1 : 1;
    return b.rating - a.rating;
  });

  return results;
}

/**
 * Señal booleana simple: el agente de IA y el resto de la app solo ven este
 * booleano, nunca las respuestas de salud en bruto (categoría especial RGPD).
 */
export function needsHealthReferral(intake: Intake): boolean {
  return intake.factor_riesgo_cv === "si" || intake.medicacion_esfuerzo === "si";
}

export function getChallengeById(id: string | null): Challenge | null {
  if (!id) return null;
  return CHALLENGES.find((c) => c.id === id) ?? null;
}

export function getPartnerById(id: string): Partner | null {
  return PARTNERS.find((p) => p.id === id) ?? null;
}
