import { describe, expect, it } from "vitest";
import {
  isThemeChoice,
  resolveTheme,
  THEME_BOOTSTRAP_SCRIPT,
} from "./themePreference";

describe("themePreference", () => {
  it("validates theme choices", () => {
    expect(isThemeChoice("system")).toBe(true);
    expect(isThemeChoice("light")).toBe(true);
    expect(isThemeChoice("dark")).toBe(true);
    expect(isThemeChoice("nope")).toBe(false);
  });

  it("resolves light and dark choices without system", () => {
    expect(resolveTheme("light")).toBe("light");
    expect(resolveTheme("dark")).toBe("dark");
  });

  it("bootstrap script sets data-theme before paint", () => {
    expect(THEME_BOOTSTRAP_SCRIPT).toContain("data-theme");
    expect(THEME_BOOTSTRAP_SCRIPT).toContain("mycelia:theme");
    expect(THEME_BOOTSTRAP_SCRIPT).toContain("prefers-color-scheme");
  });
});
