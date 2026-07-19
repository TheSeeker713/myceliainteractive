import { describe, expect, it } from "vitest";
import {
  DEFAULT_ACCESSIBILITY_UI_PREFS,
  MYCELIA_PAUSE_ATMOSPHERE_KEY,
  MYCELIA_TEXT_SIZE_KEY,
  readAccessibilityUiPrefs,
  writeAccessibilityUiPrefs,
} from "./accessibilityPreference";

function memoryStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => (map.has(key) ? map.get(key)! : null),
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
    removeItem: (key: string) => {
      map.delete(key);
    },
  };
}

describe("accessibilityPreference", () => {
  it("defaults to md text size and all flags off", () => {
    expect(readAccessibilityUiPrefs(memoryStorage())).toEqual(
      DEFAULT_ACCESSIBILITY_UI_PREFS,
    );
  });

  it("round-trips pause and text size", () => {
    const storage = memoryStorage();
    writeAccessibilityUiPrefs(storage, {
      ...DEFAULT_ACCESSIBILITY_UI_PREFS,
      pauseAtmosphere: true,
      textSize: "xl",
    });
    expect(storage.getItem(MYCELIA_PAUSE_ATMOSPHERE_KEY)).toBe("1");
    expect(storage.getItem(MYCELIA_TEXT_SIZE_KEY)).toBe("xl");
    expect(readAccessibilityUiPrefs(storage).pauseAtmosphere).toBe(true);
    expect(readAccessibilityUiPrefs(storage).textSize).toBe("xl");
  });
});
