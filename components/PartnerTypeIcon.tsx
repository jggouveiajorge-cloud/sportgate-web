import type { PartnerType } from "@/lib/types";

const GRADIENTS: Record<PartnerType, string> = {
  operador: "linear-gradient(145deg, #1e3a8a, #3b5bdb)",
  coach: "linear-gradient(145deg, #0f766e, #2dd4bf)",
  alquiler: "linear-gradient(145deg, #c2410c, #ff5a36)",
  producto: "linear-gradient(145deg, #92400e, #f5b942)",
  salud: "linear-gradient(145deg, #6d28d9, #a78bfa)",
};

const ICONS: Record<PartnerType, React.ReactNode> = {
  operador: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M5.5 17.5 9 8h5l4 9.5M9 8 7 5h3M9 8l3 5h3.5" />
    </svg>
  ),
  coach: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="3.5" />
      <path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" />
    </svg>
  ),
  alquiler: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M5.5 17.5 9 8h5l4 9.5M9 8 7 5h3" />
    </svg>
  ),
  producto: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  ),
  salud: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-4.35-9.5-8.5C.9 9 2.4 5.5 6 5.5c2 0 3.3 1.1 4 2.2C10.7 6.6 12 5.5 14 5.5c3.6 0 5.1 3.5 3.5 7C15 16.65 12 21 12 21Z" />
      <path d="M9 12h1.5l1-2 1.5 4 1-2H16" />
    </svg>
  ),
};

export function PartnerTypeIcon({ type }: { type: PartnerType }) {
  return (
    <div
      className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-xl"
      style={{ background: GRADIENTS[type] }}
    >
      {ICONS[type]}
    </div>
  );
}
