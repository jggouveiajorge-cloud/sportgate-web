"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";

// Las claves viven en el diccionario ("checklist.stepper1"...6) para que el
// propio texto de cada paso salga en el idioma activo; PASOS_TITULOS se
// mantiene exportado (en español) porque app/checklist/[paso]/page.tsx lo usa
// como título de página — ver el uso de useLocale() ahí para la versión
// traducida en tiempo de render.
export const PASOS_TITULOS = [
  "El reto",
  "Nivel y rutina",
  "Salud y seguridad",
  "Equipo",
  "Alojamiento",
  "Alimentación",
];

const STEPPER_KEYS = [
  "checklist.stepper1",
  "checklist.stepper2",
  "checklist.stepper3",
  "checklist.stepper4",
  "checklist.stepper5",
  "checklist.stepper6",
];

export function Stepper({ paso }: { paso: number }) {
  const { t } = useLocale();
  const labels = STEPPER_KEYS.map((k) => t(k));

  return (
    <div className="mb-8 flex items-start gap-1">
      {labels.map((label, i) => {
        const n = i + 1;
        const done = n < paso;
        const current = n === paso;
        return (
          <div key={label} className={`stepper-node ${done ? "done" : ""}`}>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-[13px] font-bold transition ${
                done
                  ? "border-accent bg-accent text-white"
                  : current
                    ? "border-accent bg-accent text-white shadow-accent"
                    : "border-line bg-bg-1 text-ink-faint"
              }`}
            >
              {done ? "✓" : n}
            </div>
            <div className={`hidden text-center text-[11px] sm:block ${current ? "font-bold text-accent" : "text-ink-faint"}`}>
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
