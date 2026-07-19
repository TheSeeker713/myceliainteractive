import { describe, expect, it } from "vitest";
import {
  contrastRatio,
  evaluateAa,
  flattenSrgbaOver,
  isLargeText,
  parseCssRgbColor,
  relativeLuminance,
} from "./wcagContrast";

describe("wcagContrast", () => {
  it("gives black/white the canonical 21:1 ratio", () => {
    const ratio = contrastRatio(
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
    );
    expect(ratio).toBeCloseTo(21, 5);
  });

  it("parses rgb/rgba and modern slash syntax", () => {
    expect(parseCssRgbColor("rgb(15, 15, 20)")).toEqual({
      r: 15,
      g: 15,
      b: 20,
      a: 1,
    });
    expect(parseCssRgbColor("rgba(15, 15, 20, 0.65)")).toEqual({
      r: 15,
      g: 15,
      b: 20,
      a: 0.65,
    });
    expect(parseCssRgbColor("rgb(15 15 20 / 0.65)")).toEqual({
      r: 15,
      g: 15,
      b: 20,
      a: 0.65,
    });
    expect(parseCssRgbColor("rgba(0,0,0,0)")).toBeNull();
  });

  it("flattens translucent foreground over background", () => {
    expect(
      flattenSrgbaOver(
        { r: 0, g: 0, b: 0, a: 0.5 },
        { r: 255, g: 255, b: 255 },
      ),
    ).toEqual({ r: 128, g: 128, b: 128 });
  });

  it("classifies large text thresholds", () => {
    expect(isLargeText(24, "400")).toBe(true);
    expect(isLargeText(23.9, "400")).toBe(false);
    expect(isLargeText(18.66, "700")).toBe(true);
    expect(isLargeText(18, "400")).toBe(false);
  });

  it("evaluates AA with the correct required ratio", () => {
    const normal = evaluateAa(4.4, false);
    expect(normal.passesAa).toBe(false);
    expect(normal.required).toBe(4.5);

    const large = evaluateAa(3.1, true);
    expect(large.passesAa).toBe(true);
    expect(large.required).toBe(3);
  });

  it("computes relative luminance in range", () => {
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 5);
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 5);
  });
});
