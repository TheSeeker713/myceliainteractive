export const MYCELIA_PAUSE_ATMOSPHERE_KEY = "mycelia:pause-atmosphere";
export const MYCELIA_TEXT_SIZE_KEY = "mycelia:text-size";
export const MYCELIA_HIGH_CONTRAST_KEY = "mycelia:high-contrast";
export const MYCELIA_DYSLEXIA_FONT_KEY = "mycelia:dyslexia-font";
export const MYCELIA_EMPHASIZE_LINKS_KEY = "mycelia:emphasize-links";
export const MYCELIA_TEXT_SPACING_KEY = "mycelia:text-spacing";

export const MYCELIA_A11Y_PREFS_CHANGE_EVENT = "mycelia:a11y-prefs-change";

export type TextSizePref = "sm" | "md" | "lg" | "xl";

export type AccessibilityUiPrefs = {
  pauseAtmosphere: boolean;
  textSize: TextSizePref;
  highContrast: boolean;
  dyslexiaFont: boolean;
  emphasizeLinks: boolean;
  relaxedSpacing: boolean;
};

export const DEFAULT_ACCESSIBILITY_UI_PREFS: AccessibilityUiPrefs = {
  pauseAtmosphere: false,
  textSize: "md",
  highContrast: false,
  dyslexiaFont: false,
  emphasizeLinks: false,
  relaxedSpacing: false,
};

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function readFlag(storage: StorageLike, key: string): boolean {
  try {
    return storage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeFlag(storage: StorageLike, key: string, on: boolean): void {
  try {
    if (on) storage.setItem(key, "1");
    else storage.removeItem(key);
  } catch {
    // Ignore quota / private-mode failures.
  }
}

export function readTextSize(storage: StorageLike | null | undefined): TextSizePref {
  if (!storage) return "md";
  try {
    const value = storage.getItem(MYCELIA_TEXT_SIZE_KEY);
    if (value === "sm" || value === "md" || value === "lg" || value === "xl") {
      return value;
    }
  } catch {
    // fall through
  }
  return "md";
}

export function readAccessibilityUiPrefs(
  storage: StorageLike | null | undefined,
): AccessibilityUiPrefs {
  if (!storage) return { ...DEFAULT_ACCESSIBILITY_UI_PREFS };
  return {
    pauseAtmosphere: readFlag(storage, MYCELIA_PAUSE_ATMOSPHERE_KEY),
    textSize: readTextSize(storage),
    highContrast: readFlag(storage, MYCELIA_HIGH_CONTRAST_KEY),
    dyslexiaFont: readFlag(storage, MYCELIA_DYSLEXIA_FONT_KEY),
    emphasizeLinks: readFlag(storage, MYCELIA_EMPHASIZE_LINKS_KEY),
    relaxedSpacing: readFlag(storage, MYCELIA_TEXT_SPACING_KEY),
  };
}

export function writeAccessibilityUiPrefs(
  storage: StorageLike | null | undefined,
  prefs: AccessibilityUiPrefs,
): void {
  if (!storage) return;
  writeFlag(storage, MYCELIA_PAUSE_ATMOSPHERE_KEY, prefs.pauseAtmosphere);
  try {
    if (prefs.textSize === "md") storage.removeItem(MYCELIA_TEXT_SIZE_KEY);
    else storage.setItem(MYCELIA_TEXT_SIZE_KEY, prefs.textSize);
  } catch {
    // ignore
  }
  writeFlag(storage, MYCELIA_HIGH_CONTRAST_KEY, prefs.highContrast);
  writeFlag(storage, MYCELIA_DYSLEXIA_FONT_KEY, prefs.dyslexiaFont);
  writeFlag(storage, MYCELIA_EMPHASIZE_LINKS_KEY, prefs.emphasizeLinks);
  writeFlag(storage, MYCELIA_TEXT_SPACING_KEY, prefs.relaxedSpacing);
}

export function applyAccessibilityUiPrefsToDocument(
  prefs: AccessibilityUiPrefs,
  root: HTMLElement = document.documentElement,
): void {
  root.dataset.textSize = prefs.textSize;
  root.dataset.contrast = prefs.highContrast ? "high" : "normal";
  root.dataset.font = prefs.dyslexiaFont ? "dyslexia" : "default";
  root.dataset.emphasizeLinks = prefs.emphasizeLinks ? "1" : "0";
  root.dataset.textSpacing = prefs.relaxedSpacing ? "relaxed" : "default";
  root.dataset.pauseAtmosphere = prefs.pauseAtmosphere ? "1" : "0";
}
