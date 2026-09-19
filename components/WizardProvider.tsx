"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Filtros, WizardState } from "@/lib/types";

const EMPTY_STATE: WizardState = {
  queryOriginal: "",
  challengeId: null,
  intake: {},
  seleccion: [],
  filtros: {},
};

const STORAGE_KEY = "sportgate-wizard-v1";

interface WizardContextValue {
  state: WizardState;
  setQuery: (query: string, challengeId: string | null) => void;
  setChallengeId: (id: string) => void;
  updateIntake: (patch: Partial<WizardState["intake"]>) => void;
  setFiltros: (patch: Filtros) => void;
  addSeleccion: (id: string) => void;
  removeSeleccion: (id: string) => void;
  reset: () => void;
  hydrated: boolean;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WizardState>(EMPTY_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // merge por si el estado guardado viene de una versión anterior sin "filtros"
      if (raw) setState((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch {
      /* almacenamiento no disponible: seguimos con el estado vacío */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* almacenamiento no disponible: no persistimos, la sesión sigue en memoria */
    }
  }, [state, hydrated]);

  const value = useMemo<WizardContextValue>(
    () => ({
      state,
      hydrated,
      // Al iniciar una búsqueda nueva se limpia el checklist anterior, pero
      // se conserva "fecha_objetivo" si el buscador avanzado ya la fijó
      // (campo "Fecha" — pre-rellena el checklist, ver resumen sección 10).
      setQuery: (query, challengeId) =>
        setState((s) => ({
          ...s,
          queryOriginal: query,
          challengeId,
          intake: { fecha_objetivo: s.intake.fecha_objetivo },
          seleccion: [],
        })),
      setChallengeId: (id) =>
        setState((s) => ({
          ...s,
          challengeId: id,
          intake: { fecha_objetivo: s.intake.fecha_objetivo },
          seleccion: [],
        })),
      updateIntake: (patch) => setState((s) => ({ ...s, intake: { ...s.intake, ...patch } })),
      setFiltros: (patch) => setState((s) => ({ ...s, filtros: { ...s.filtros, ...patch } })),
      addSeleccion: (id) =>
        setState((s) => (s.seleccion.includes(id) ? s : { ...s, seleccion: [...s.seleccion, id] })),
      removeSeleccion: (id) =>
        setState((s) => ({ ...s, seleccion: s.seleccion.filter((x) => x !== id) })),
      reset: () => setState(EMPTY_STATE),
    }),
    [state, hydrated]
  );

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard debe usarse dentro de WizardProvider");
  return ctx;
}
