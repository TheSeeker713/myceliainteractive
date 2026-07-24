export const MYCELIA_THEME_STORAGE_KEY = "mycelia:theme";

export type ThemeChoice = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export function isThemeChoice(value: unknown): value is ThemeChoice {
  return value === "system" || value === "light" || value === "dark";
}

/** New visitors / missing key → Lightside (not System). */
export function readStoredThemeChoice(): ThemeChoice {
  if (typeof window === "undefined") return "light";
  try {
    const raw = window.localStorage.getItem(MYCELIA_THEME_STORAGE_KEY);
    if (isThemeChoice(raw)) return raw;
  } catch {
    /* ignore */
  }
  return "light";
}

export function writeStoredThemeChoice(choice: ThemeChoice): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MYCELIA_THEME_STORAGE_KEY, choice);
  } catch {
    /* ignore */
  }
}

export function readSystemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

export function resolveTheme(choice: ThemeChoice): ResolvedTheme {
  if (choice === "light") return "light";
  if (choice === "dark") return "dark";
  return readSystemPrefersDark() ? "dark" : "light";
}

export function applyThemeToDocument(choice: ThemeChoice): ResolvedTheme {
  const resolved = resolveTheme(choice);
  if (typeof document === "undefined") return resolved;
  const root = document.documentElement;
  root.setAttribute("data-theme", resolved);
  root.setAttribute(
    "data-theme-source",
    choice === "system" ? "system" : "manual",
  );
  root.style.colorScheme = resolved;
  return resolved;
}

/**
 * Inline bootstrap (string) — runs before paint to avoid FOWT.
 * Default for absent storage: light. System follows prefers-color-scheme.
 */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var k=${JSON.stringify(MYCELIA_THEME_STORAGE_KEY)};var v=null;try{v=localStorage.getItem(k);}catch(e){}var choice=(v==="system"||v==="light"||v==="dark")?v:"light";var dark=false;try{dark=window.matchMedia("(prefers-color-scheme: dark)").matches;}catch(e){}var resolved=choice==="dark"||(choice==="system"&&dark)?"dark":"light";var r=document.documentElement;r.setAttribute("data-theme",resolved);r.setAttribute("data-theme-source",choice==="system"?"system":(v?"manual":"default"));r.style.colorScheme=resolved;}catch(e){}})();`;
