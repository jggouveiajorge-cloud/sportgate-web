import type { Config } from "tailwindcss";

// Cada token de color lee una variable CSS en formato "R, G, B" definida en
// globals.css (distinta para tema oscuro y tema claro, ver :root y
// [data-theme="light"]). Así los mismos nombres de clase (bg-bg-1, text-ink,
// etc.) siguen funcionando en toda la app y solo cambia el valor por tema —
// incluye soporte para modificadores de opacidad tipo bg-bg-0/80.
//
// Tailwind SÍ soporta valores de color como función en tiempo de ejecución
// (así es como funcionan los modificadores de opacidad de sus propios
// colores por defecto), pero el tipo público `Config` de "tailwindcss" no
// declara esa forma — solo declara `string | RecursiveKeyValuePair<string,
// string>`. Por eso anotamos el valor de retorno "as any" abajo: no cambia
// nada en tiempo de ejecución (Tailwind recibe exactamente la misma
// función), solo le dice a TypeScript que confíe en este patrón conocido.
function withOpacity(varName: string): any {
  return ({ opacityValue }: { opacityValue?: string }) =>
    opacityValue !== undefined ? `rgba(var(${varName}), ${opacityValue})` : `rgb(var(${varName}))`;
}

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          0: withOpacity("--bg-0-rgb"),
          1: withOpacity("--bg-1-rgb"),
          2: withOpacity("--bg-2-rgb"),
          3: withOpacity("--bg-3-rgb"),
        },
        ink: {
          DEFAULT: withOpacity("--ink-rgb"),
          muted: withOpacity("--ink-muted-rgb"),
          faint: withOpacity("--ink-faint-rgb"),
        },
        accent: {
          DEFAULT: withOpacity("--accent-rgb"),
          600: withOpacity("--accent-600-rgb"),
          soft: "var(--accent-soft)",
        },
        teal: {
          DEFAULT: withOpacity("--teal-rgb"),
          soft: "var(--teal-soft)",
        },
        amber: {
          DEFAULT: withOpacity("--amber-rgb"),
          soft: "var(--amber-soft)",
        },
        line: {
          DEFAULT: "var(--line)",
          strong: "var(--line-strong)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "26px",
        full: "999px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(0,0,0,0.35)",
        sm: "0 4px 14px rgba(0,0,0,0.4)",
        md: "0 16px 36px -8px rgba(0,0,0,0.55)",
        lg: "0 32px 64px -16px rgba(0,0,0,0.65)",
        accent: "0 12px 28px -8px rgba(255,90,54,0.5)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 320ms cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
