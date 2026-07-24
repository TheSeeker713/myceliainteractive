import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Part 2a: Lightside token values must match the pre-extraction hardcoded palette.
 * Guards against accidental drift that would break the visual no-op.
 */
const EXPECTED_LIGHTSIDE = {
  "--lg-card-color": "#0a1214",
  "--lg-kicker": "#0f4f5f",
  "--lg-title": "#071014",
  "--lg-body": "#132428",
  "--lg-card-fill-0": "rgba(255, 255, 255, 0.56)",
  "--lg-card-fill-1": "rgba(255, 255, 255, 0.31)",
  "--lg-card-fill-2": "rgba(210, 236, 240, 0.35)",
  "--lg-card-border": "rgba(255, 255, 255, 0.65)",
  "--studio-text": "#171717",
  "--studio-accent": "#2d6a7e",
  "--theme-body-wash-0": "#e8f4f8",
  "--theme-body-wash-1": "#fafaf8",
} as const;

describe("theme-tokens lightside (2a visual no-op)", () => {
  const css = readFileSync(
    join(process.cwd(), "app/styles/theme-tokens.css"),
    "utf8",
  );

  for (const [token, value] of Object.entries(EXPECTED_LIGHTSIDE)) {
    it(`defines ${token} as ${value}`, () => {
      const pattern = new RegExp(
        `${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:\\s*${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*;`,
      );
      expect(css).toMatch(pattern);
    });
  }

  it("liquid-glass card color uses the token (not a hardcoded hex)", () => {
    const lg = readFileSync(
      join(process.cwd(), "app/components/motion/liquid-glass.css"),
      "utf8",
    );
    expect(lg).toContain("color: var(--lg-card-color)");
    expect(lg).toContain("color: var(--lg-kicker)");
    expect(lg).toContain("color: var(--lg-title)");
    expect(lg).toContain("color: var(--lg-body)");
    expect(lg).not.toMatch(/\.liquid-glass-title\s*\{[^}]*color:\s*#071014/);
  });
});
