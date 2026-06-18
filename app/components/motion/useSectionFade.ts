/** Plateau crossfade: hold solid → crossfade → hold solid */

export const FADE_HOLD_START = 0.35;
export const FADE_HOLD_END = 0.65;

export type SectionFadeOpacities = {
  outgoing: number;
  incoming: number;
  isTransitioning: boolean;
  phase: "hold-out" | "crossfade" | "hold-in";
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * @param t Local section progress in [0, 1]
 * @param isFirstSection When true, incoming is fully visible at t=0 (hero on load)
 */
export function getSectionFadeOpacities(
  t: number,
  isFirstSection = false,
): SectionFadeOpacities {
  const progress = clamp01(t);

  if (isFirstSection && progress <= FADE_HOLD_START) {
    return {
      outgoing: 0,
      incoming: 1,
      isTransitioning: false,
      phase: "hold-in",
    };
  }

  if (progress < FADE_HOLD_START) {
    return {
      outgoing: 1,
      incoming: 0,
      isTransitioning: false,
      phase: "hold-out",
    };
  }

  if (progress <= FADE_HOLD_END) {
    const crossT =
      (progress - FADE_HOLD_START) / (FADE_HOLD_END - FADE_HOLD_START);
    return {
      outgoing: lerp(1, 0, crossT),
      incoming: lerp(0, 1, crossT),
      isTransitioning: true,
      phase: "crossfade",
    };
  }

  return {
    outgoing: 0,
    incoming: 1,
    isTransitioning: false,
    phase: "hold-in",
  };
}

/**
 * Map global scroll progress [0,1] to section index and local t.
 */
export function getSectionFromProgress(
  scrollProgress: number,
  sectionCount: number,
): { index: number; localT: number } {
  if (sectionCount <= 0) {
    return { index: 0, localT: 0 };
  }

  const clamped = clamp01(scrollProgress);
  const scaled = clamped * sectionCount;
  const index = Math.min(sectionCount - 1, Math.floor(scaled));
  const localT = scaled - index;

  return { index, localT };
}

export function getScrollProgressFromSection(
  sectionIndex: number,
  localT: number,
  sectionCount: number,
): number {
  if (sectionCount <= 0) return 0;
  const index = Math.min(sectionCount - 1, Math.max(0, sectionIndex));
  return clamp01((index + clamp01(localT)) / sectionCount);
}

export type SectionLayers = {
  primaryIndex: number;
  secondaryIndex: number | null;
  primaryOpacity: number;
  secondaryOpacity: number;
};

/** Which section indices to render and their opacities for the sticky stage. */
export function getSectionLayers(
  index: number,
  localT: number,
  sectionCount: number,
): SectionLayers {
  const lastIndex = Math.max(0, sectionCount - 1);

  if (sectionCount <= 0) {
    return {
      primaryIndex: 0,
      secondaryIndex: null,
      primaryOpacity: 1,
      secondaryOpacity: 0,
    };
  }

  if (index >= lastIndex) {
    return {
      primaryIndex: lastIndex,
      secondaryIndex: null,
      primaryOpacity: 1,
      secondaryOpacity: 0,
    };
  }

  const fade = getSectionFadeOpacities(localT, index === 0);

  if (index === 0 && localT <= FADE_HOLD_START) {
    return {
      primaryIndex: 0,
      secondaryIndex: null,
      primaryOpacity: 1,
      secondaryOpacity: 0,
    };
  }

  if (localT < FADE_HOLD_START) {
    return {
      primaryIndex: index,
      secondaryIndex: null,
      primaryOpacity: 1,
      secondaryOpacity: 0,
    };
  }

  if (localT <= FADE_HOLD_END) {
    return {
      primaryIndex: index,
      secondaryIndex: index + 1,
      primaryOpacity: fade.outgoing,
      secondaryOpacity: fade.incoming,
    };
  }

  return {
    primaryIndex: index + 1,
    secondaryIndex: null,
    primaryOpacity: 1,
    secondaryOpacity: 0,
  };
}
