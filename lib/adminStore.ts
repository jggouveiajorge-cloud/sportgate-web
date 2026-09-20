import type { Challenge, Partner, PartnerType } from "./types";
import { CHALLENGES } from "./challenges";
import { PARTNERS } from "./partners";

/**
 * Capa de administración / CMS ligero — ver resumen, sección "Área de
 * administración (Fase 1 — demo sin backend)".
 *
 * IMPORTANTE: esto sigue el mismo patrón que el resto del MVP (todo en
 * `localStorage`, sin servidor). Es una simulación de flujo pensada para que
 * Jorge y un inversor vean cómo funcionaría un panel de gestión de
 * contenidos, NO un CMS real: los cambios que un gestor haga aquí solo se
 * ven en su propio navegador, nunca se propagan a otros visitantes. Un CMS
 * real que sí comparta esos cambios entre todos los visitantes requiere base
 * de datos + autenticación real + almacenamiento de imágenes — eso queda
 * explícitamente para la Fase 2 (ver resumen).
 */

// ---- Sesión admin (login simulado, sin contraseña real) ----

export type AdminRole = "gestor" | "administrador";

export interface AdminSession {
  role: AdminRole;
  nombre: string;
}

const KEYS = {
  session: "sportgate-admin-session-v1",
  partners: "sportgate-admin-partners-v1",
  challenges: "sportgate-admin-challenges-v1",
  services: "sportgate-admin-services-v1",
};

function read<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* almacenamiento no disponible */
  }
}

export function getAdminSession(): AdminSession | null {
  return read<AdminSession>(KEYS.session);
}

export function setAdminSession(session: AdminSession) {
  write(KEYS.session, session);
}

export function clearAdminSession() {
  try {
    window.localStorage.removeItem(KEYS.session);
  } catch {
    /* almacenamiento no disponible */
  }
}

// ---- Parceiros ----

export interface AdminPartner extends Partner {
  /** Data URL de la foto subida desde el panel — sustituye al icono en la
   *  home cuando existe y el parceiro está destacado. */
  photo?: string;
  /** Controla si aparece en la sección "Partners en la plataforma" de la home. */
  featured: boolean;
  /** "pendiente" = recién registrado desde /hazte-partner, a la espera de
   *  revisión del gestor; "aprobado" = ya revisado (incluye los datos de
   *  ejemplo, que nacen aprobados). */
  estado: "pendiente" | "aprobado";
}

function seedPartners(): AdminPartner[] {
  // Los partners de ejemplo nacen destacados y aprobados para que la home no
  // se quede vacía antes de que nadie entre al panel — el gestor puede
  // quitar el destaque a los que no quiera mostrar.
  return PARTNERS.map((p) => ({ ...p, featured: true, estado: "aprobado" as const }));
}

export function getAdminPartners(): AdminPartner[] {
  const stored = read<AdminPartner[]>(KEYS.partners);
  if (stored) return stored;
  const seeded = seedPartners();
  write(KEYS.partners, seeded);
  return seeded;
}

export function saveAdminPartners(list: AdminPartner[]) {
  write(KEYS.partners, list);
}

export function upsertAdminPartner(partner: AdminPartner) {
  const list = getAdminPartners();
  const idx = list.findIndex((p) => p.id === partner.id);
  if (idx >= 0) list[idx] = partner;
  else list.unshift(partner);
  saveAdminPartners(list);
  return list;
}

// ---- Desafios ----

export type ChallengeStatus = "proximo" | "realizado" | "archivado";

export interface Testimonio {
  id: string;
  autor: string;
  texto: string;
  rating: number;
}

export interface AdminChallenge extends Challenge {
  photo?: string;
  status: ChallengeStatus;
  featured: boolean;
  rating?: number;
  testimonios: Testimonio[];
}

function seedChallenges(): AdminChallenge[] {
  return CHALLENGES.map((c) => ({ ...c, status: "proximo" as const, featured: true, testimonios: [] }));
}

export function getAdminChallenges(): AdminChallenge[] {
  const stored = read<AdminChallenge[]>(KEYS.challenges);
  if (stored) return stored;
  const seeded = seedChallenges();
  write(KEYS.challenges, seeded);
  return seeded;
}

export function saveAdminChallenges(list: AdminChallenge[]) {
  write(KEYS.challenges, list);
}

export function upsertAdminChallenge(challenge: AdminChallenge) {
  const list = getAdminChallenges();
  const idx = list.findIndex((c) => c.id === challenge.id);
  if (idx >= 0) list[idx] = challenge;
  else list.unshift(challenge);
  saveAdminChallenges(list);
  return list;
}

export function deleteAdminChallenge(id: string) {
  const list = getAdminChallenges().filter((c) => c.id !== id);
  saveAdminChallenges(list);
  return list;
}

/** Perfil de elevación ilustrativo (0-100) para el sparkline de un desafío
 *  creado desde el panel — pedir los ~15 puntos a mano en un formulario no
 *  es razonable, así que se genera una rampa simple a partir del desnivel y
 *  la pendiente máxima, igual de ilustrativa que los datos de ejemplo. */
export function generateElevationProfile(avgGradient: number, maxGradient: number): number[] {
  const points = 14;
  const profile: number[] = [];
  for (let i = 1; i <= points; i++) {
    const linear = (i / points) * 100;
    const bulge = Math.sin((i / points) * Math.PI) * (maxGradient - avgGradient) * 1.5;
    profile.push(Math.max(2, Math.min(100, Math.round(linear * 0.75 + bulge))));
  }
  profile[profile.length - 1] = 100;
  return profile;
}

// ---- Servicios (la sección "Servicios" de la home, hoy solo con icono) ----

export interface AdminService {
  id: string;
  type: PartnerType;
  photo?: string;
  featured: boolean;
}

const SERVICE_TYPES: PartnerType[] = ["operador", "coach", "alquiler", "producto"];

function seedServices(): AdminService[] {
  return SERVICE_TYPES.map((type) => ({ id: `service-${type}`, type, featured: false }));
}

export function getAdminServices(): AdminService[] {
  const stored = read<AdminService[]>(KEYS.services);
  if (stored) return stored;
  const seeded = seedServices();
  write(KEYS.services, seeded);
  return seeded;
}

export function saveAdminServices(list: AdminService[]) {
  write(KEYS.services, list);
}

export function upsertAdminService(service: AdminService) {
  const list = getAdminServices();
  const idx = list.findIndex((s) => s.id === service.id);
  if (idx >= 0) list[idx] = service;
  else list.unshift(service);
  saveAdminServices(list);
  return list;
}
