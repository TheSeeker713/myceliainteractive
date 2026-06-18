import { describe, expect, it } from "vitest";
import {
  FADE_HOLD_END,
  FADE_HOLD_START,
  getSectionFadeOpacities,
  getSectionFromProgress,
  getSectionLayers,
} from "./useSectionFade";

describe("getSectionFadeOpacities", () => {
  it("first section is solid incoming at t=0", () => {
    const result = getSectionFadeOpacities(0, true);
    expect(result.incoming).toBe(1);
    expect(result.outgoing).toBe(0);
    expect(result.isTransitioning).toBe(false);
    expect(result.phase).toBe("hold-in");
  });

  it("non-first section holds outgoing solid before crossfade", () => {
    const result = getSectionFadeOpacities(0, false);
    expect(result.outgoing).toBe(1);
    expect(result.incoming).toBe(0);
    expect(result.phase).toBe("hold-out");
  });

  it("crossfades in the middle band", () => {
    const mid = (FADE_HOLD_START + FADE_HOLD_END) / 2;
    const result = getSectionFadeOpacities(mid, false);
    expect(result.isTransitioning).toBe(true);
    expect(result.phase).toBe("crossfade");
    expect(result.outgoing).toBeGreaterThan(0);
    expect(result.outgoing).toBeLessThan(1);
    expect(result.incoming).toBeGreaterThan(0);
    expect(result.incoming).toBeLessThan(1);
  });

  it("holds incoming solid after crossfade", () => {
    const result = getSectionFadeOpacities(0.9, false);
    expect(result.incoming).toBe(1);
    expect(result.outgoing).toBe(0);
    expect(result.phase).toBe("hold-in");
  });
});

describe("getSectionFromProgress", () => {
  it("maps start to first section", () => {
    expect(getSectionFromProgress(0, 11)).toEqual({ index: 0, localT: 0 });
  });

  it("maps end to last section", () => {
    const result = getSectionFromProgress(1, 11);
    expect(result.index).toBe(10);
    expect(result.localT).toBeCloseTo(1, 5);
  });
});

describe("getSectionLayers", () => {
  it("shows hero only at load", () => {
    const layers = getSectionLayers(0, 0, 11);
    expect(layers.primaryIndex).toBe(0);
    expect(layers.secondaryIndex).toBeNull();
    expect(layers.primaryOpacity).toBe(1);
  });

  it("crossfades adjacent sections in the middle band", () => {
    const mid = (FADE_HOLD_START + FADE_HOLD_END) / 2;
    const layers = getSectionLayers(2, mid, 11);
    expect(layers.primaryIndex).toBe(2);
    expect(layers.secondaryIndex).toBe(3);
    expect(layers.primaryOpacity).toBeGreaterThan(0);
    expect(layers.secondaryOpacity).toBeGreaterThan(0);
  });

  it("holds last section on the final segment", () => {
    const layers = getSectionLayers(10, 0.5, 11);
    expect(layers.primaryIndex).toBe(10);
    expect(layers.secondaryIndex).toBeNull();
    expect(layers.primaryOpacity).toBe(1);
  });
});
