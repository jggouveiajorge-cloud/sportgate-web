"use client";

import { useRef } from "react";

/**
 * Selector de foto reutilizado por el formulario de alta de partner y todo
 * el panel de administración. Sin backend/almacenamiento real: convierte el
 * archivo elegido a un data URL y lo guarda tal cual en localStorage (ver
 * lib/adminStore.ts) — funciona bien para la demo con una o dos fotos, pero
 * no es la solución para producción (eso necesita almacenamiento de
 * archivos real, ver resumen "Fase 2").
 */
export function PhotoUpload({
  value,
  onChange,
  label,
  buttonLabel,
  removeLabel,
  hint,
}: {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  label: string;
  buttonLabel: string;
  removeLabel: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(typeof reader.result === "string" ? reader.result : undefined);
    reader.readAsDataURL(file);
  }

  return (
    <div className="mb-6">
      <label className="mb-2.5 block text-[14.5px] font-semibold text-ink">{label}</label>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-line-strong bg-bg-2">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="text-ink-faint">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="9" cy="10" r="1.6" />
              <path d="M21 16l-5.5-5.5a2 2 0 0 0-2.8 0L4 19" />
            </svg>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-xl border border-line bg-bg-2 px-4 py-2 text-xs font-bold text-ink transition hover:border-line-strong"
          >
            {value ? "↻" : "+"} {buttonLabel}
          </button>
          {value && (
            <button type="button" onClick={() => onChange(undefined)} className="text-left text-[11px] font-semibold text-ink-faint hover:text-ink">
              ✕ {removeLabel}
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {hint && <span className="mt-1.5 block text-[13px] text-ink-muted">{hint}</span>}
    </div>
  );
}
