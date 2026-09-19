export type Theme = "dark" | "light";

const KEY = "sportgate-theme";
const DEFAULT_THEME: Theme = "dark";

export function getStoredTheme(): Theme {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw === "light" || raw === "dark" ? raw : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(KEY, theme);
  } catch {
    /* almacenamiento no disponible: el tema no persiste entre visitas */
  }
}

/**
 * Script inline que se inyecta en <head> (ver app/layout.tsx) y corre antes
 * del primer pintado, para fijar data-theme en <html> sin parpadeo del tema
 * equivocado. Debe ser una función independiente y serializable a texto.
 */
export function themeInitScript() {
  try {
    var stored = window.localStorage.getItem("sportgate-theme");
    var theme = stored === "light" || stored === "dark" ? stored : "dark";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
}
