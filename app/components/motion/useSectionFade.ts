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
 * Viewport height / section height, accounting for sticky header overlap.
 * @param windowInnerHeight window.innerHeight in px
 * @param headerHeightPx Sticky header height in px (--header-h)
 * @param sectionHeightVhPercent Section track height as % of viewport (100 or 110)
 */
export function getViewportRatio(
  windowInnerHeight: number,
  headerHeightPx: number,
  sectionHeightVhPercent: number,
): number {
  if (!Number.isFinite(windowInnerHeight) || windowInnerHeight <= 0) {
    return 1;
  }

  const safeHeader = Number.isFinite(headerHeightPx) ? headerHeightPx : 72;
  const effectiveViewport = windowInnerHeight - safeHeader;
  const sectionHeightPx =
    (windowInnerHeight * sectionHeightVhPercent) / 100;

  if (!Number.isFinite(sectionHeightPx) || sectionHeightPx <= 0) {
    return 1;
  }

  const ratio = effectiveViewport / sectionHeightPx;
  return Number.isFinite(ratio) ? ratio : 1;
}

/**
 * Scrollable span in section units: n sections minus viewport/section ratio.
 * Matches Framer scrollYProgress over container height n*H minus viewport V.
 */
export function getScrollableSpan(
  sectionCount: number,
  viewportRatio = 1,
): number {
  if (sectionCount <= 0) return 0;
  return Math.max(0, sectionCount - viewportRatio);
}

/**
 * Map global scroll progress [0,1] to section index and local t.
 * @param viewportRatio Viewport height / section height (V/H). Default 1 = 100dvh viewport, 100dvh sections.
 */
export function getSectionFromProgress(
  scrollProgress: number,
  sectionCount: number,
  viewportRatio = 1,
): { index: number; localT: number } {
  if (sectionCount <= 0) {
    return { index: 0, localT: 0 };
  }

  if (!Number.isFinite(scrollProgress) || !Number.isFinite(viewportRatio)) {
    return { index: 0, localT: 0 };
  }

  const clamped = clamp01(scrollProgress);
  const span = getScrollableSpan(sectionCount, viewportRatio);

  if (span <= 0) {
    return { index: sectionCount - 1, localT: 0 };
  }

  const scaledRaw = clamped * span;
  const nearest = Math.round(scaledRaw);
  const scaled =
    Math.abs(scaledRaw - nearest) < 1e-9 ? nearest : scaledRaw;
  const index = Math.min(sectionCount - 1, Math.floor(scaled));
  const localT = scaled - index;

  return { index, localT };
}

export function getScrollProgressFromSection(
  sectionIndex: number,
  localT: number,
  sectionCount: number,
  viewportRatio = 1,
): number {
  if (sectionCount <= 0) return 0;
  if (!Number.isFinite(viewportRatio)) return 0;

  const index = Math.min(sectionCount - 1, Math.max(0, sectionIndex));
  const span = getScrollableSpan(sectionCount, viewportRatio);
  if (span <= 0) return 0;

  return clamp01((index + clamp01(localT)) / span);
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
