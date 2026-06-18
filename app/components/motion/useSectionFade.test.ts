import { describe, expect, it } from "vitest";
import {
  FADE_HOLD_END,
  FADE_HOLD_START,
  getScrollProgressFromSection,
  getScrollableSpan,
  getSectionFadeOpacities,
  getSectionFromProgress,
  getSectionLayers,
  getViewportRatio,
} from "./useSectionFade";

const SECTION_COUNT = 11;
const VIEWPORT_HEIGHT = 797;
const MOBILE_HEADER = 72;
const DESKTOP_HEADER = 76;
const MOBILE_RATIO = getViewportRatio(VIEWPORT_HEIGHT, MOBILE_HEADER, 100);
const DESKTOP_RATIO = getViewportRatio(VIEWPORT_HEIGHT, DESKTOP_HEADER, 110);

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

describe("getViewportRatio", () => {
  it("accounts for sticky header on mobile", () => {
    expect(getViewportRatio(797, 72, 100)).toBeCloseTo(725 / 797, 5);
  });
});

describe("getScrollableSpan", () => {
  it("uses n - viewportRatio on mobile", () => {
    expect(getScrollableSpan(SECTION_COUNT, MOBILE_RATIO)).toBeCloseTo(
      11 - MOBILE_RATIO,
      5,
    );
  });

  it("uses n - viewportRatio on desktop", () => {
    expect(getScrollableSpan(SECTION_COUNT, DESKTOP_RATIO)).toBeCloseTo(
      11 - DESKTOP_RATIO,
      5,
    );
  });
});

describe("getSectionFromProgress", () => {
  it("maps start to first section", () => {
    expect(getSectionFromProgress(0, SECTION_COUNT, MOBILE_RATIO)).toEqual({
      index: 0,
      localT: 0,
    });
  });

  it("maps end to last section", () => {
    expect(getSectionFromProgress(1, SECTION_COUNT, MOBILE_RATIO)).toEqual({
      index: 10,
      localT: expect.closeTo(1 - MOBILE_RATIO, 5),
    });
  });

  it("starts each section at localT 0 on mobile boundaries", () => {
    for (let k = 0; k < SECTION_COUNT; k += 1) {
      const progress = getScrollProgressFromSection(
        k,
        0,
        SECTION_COUNT,
        MOBILE_RATIO,
      );
      const result = getSectionFromProgress(progress, SECTION_COUNT, MOBILE_RATIO);
      expect(result.index).toBe(k);
      expect(result.localT).toBeCloseTo(0, 5);
    }
  });

  it("starts each section at localT 0 on desktop boundaries", () => {
    for (let k = 0; k < SECTION_COUNT; k += 1) {
      const progress = getScrollProgressFromSection(
        k,
        0,
        SECTION_COUNT,
        DESKTOP_RATIO,
      );
      const result = getSectionFromProgress(
        progress,
        SECTION_COUNT,
        DESKTOP_RATIO,
      );
      expect(result.index).toBe(k);
      expect(result.localT).toBeCloseTo(0, 5);
    }
  });

  it("returns safe defaults for non-finite progress", () => {
    expect(getSectionFromProgress(Number.NaN, SECTION_COUNT, MOBILE_RATIO)).toEqual({
      index: 0,
      localT: 0,
    });
    expect(getSectionFromProgress(Number.POSITIVE_INFINITY, SECTION_COUNT, MOBILE_RATIO)).toEqual({
      index: 0,
      localT: 0,
    });
    expect(getSectionFromProgress(0, SECTION_COUNT, Number.POSITIVE_INFINITY)).toEqual({
      index: 0,
      localT: 0,
    });
  });
});

describe("getScrollProgressFromSection", () => {
  it("round-trips section starts on mobile", () => {
    const span = getScrollableSpan(SECTION_COUNT, MOBILE_RATIO);

    for (let k = 0; k < SECTION_COUNT; k += 1) {
      const progress = getScrollProgressFromSection(k, 0, SECTION_COUNT, MOBILE_RATIO);
      expect(progress).toBeCloseTo(k / span, 5);
    }
  });

  it("round-trips section starts on desktop", () => {
    const span = getScrollableSpan(SECTION_COUNT, DESKTOP_RATIO);

    for (let k = 0; k < SECTION_COUNT; k += 1) {
      const progress = getScrollProgressFromSection(
        k,
        0,
        SECTION_COUNT,
        DESKTOP_RATIO,
      );
      expect(progress).toBeCloseTo(k / span, 5);
    }
  });
});

describe("getSectionLayers", () => {
  it("shows hero only at load", () => {
    const layers = getSectionLayers(0, 0, SECTION_COUNT);
    expect(layers.primaryIndex).toBe(0);
    expect(layers.secondaryIndex).toBeNull();
    expect(layers.primaryOpacity).toBe(1);
  });

  it("crossfades adjacent sections in the middle band", () => {
    const mid = (FADE_HOLD_START + FADE_HOLD_END) / 2;
    const layers = getSectionLayers(2, mid, SECTION_COUNT);
    expect(layers.primaryIndex).toBe(2);
    expect(layers.secondaryIndex).toBe(3);
    expect(layers.primaryOpacity).toBeGreaterThan(0);
    expect(layers.secondaryOpacity).toBeGreaterThan(0);
  });

  it("holds last section on the final segment", () => {
    const layers = getSectionLayers(10, 0.5, SECTION_COUNT);
    expect(layers.primaryIndex).toBe(10);
    expect(layers.secondaryIndex).toBeNull();
    expect(layers.primaryOpacity).toBe(1);
  });
});
