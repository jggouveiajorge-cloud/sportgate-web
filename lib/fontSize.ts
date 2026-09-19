// Ajuste de tamaño de letra para toda la página. Como casi todo el tamaño
// de texto del sitio viene de clases de Tailwind (text-sm, text-lg, etc.),
// que usan unidades "rem", basta con cambiar el font-size del elemento raíz
// (<html>) para escalar TODO el texto del sitio proporcionalmente — sin
// tocar cada componente uno por uno.
export const FONT_SCALE_STEPS = [90, 100, 110, 120, 130] as const;
export type FontScale = (typeof FONT_SCALE_STEPS)[number];

const KEY = "sportgate-font-scale";
const DEFAULT_SCALE: FontScale = 100;

export function getStoredFontScale(): FontScale {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (parseInt(raw, 10) as FontScale) : DEFAULT_SCALE;
    return FONT_SCALE_STEPS.includes(parsed) ? parsed : DEFAULT_SCALE;
  } catch {
    return DEFAULT_SCALE;
  }
}

export function applyFontScale(scale: FontScale) {
  document.documentElement.style.fontSize = `${scale}%`;
  try {
    window.localStorage.setItem(KEY, String(scale));
  } catch {
    /* almacenamiento no disponible: el tamaño no persiste entre visitas */
  }
}

/**
 * Script inline para <head> (mismo patrón que themeInitScript en
 * lib/theme.ts): fija el font-size guardado antes del primer pintado, para
 * no dar un salto de tamaño justo al cargar.
 */
export function fontScaleInitScript() {
  try {
    var stored = window.localStorage.getItem("sportgate-font-scale");
    var scale = stored && [90, 100, 110, 120, 130].indexOf(parseInt(stored, 10)) !== -1 ? parseInt(stored, 10) : 100;
    document.documentElement.style.fontSize = scale + "%";
  } catch (e) {
    document.documentElement.style.fontSize = "100%";
  }
}
