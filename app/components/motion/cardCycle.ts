export type CardCyclePhase =
  | "buffer"
  | "materialize"
  | "hold"
  | "dissolve"
  | "fade-out";

export type CardCycleState = {
  phase: CardCyclePhase;
  /** Whole-card opacity for enter/exit. */
  opacity: number;
  /**
   * Temporal/electronic destabilization.
   * 0 = stable, 1 = fully dissolved out of the present.
   */
  glitch: number;
};

export type CardCycleOptions = {
  /** First card begins fully visible instead of materializing from empty. */
  startVisible?: boolean;
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function progressInRange(t: number, start: number, end: number): number {
  if (end <= start) return t >= end ? 1 : 0;
  return clamp01((t - start) / (end - start));
}

function easeInOutCubic(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

type PhaseEnds = {
  materializeEnd: number;
  holdEnd: number;
  dissolveEnd: number;
  fadeOutEnd: number;
};

function phaseEnds(startVisible: boolean): PhaseEnds {
  if (startVisible) {
    // Hero starts stable: hold → dissolve → fade → buffer.
    return {
      materializeEnd: 0,
      holdEnd: 0.28,
      dissolveEnd: 0.76,
      fadeOutEnd: 0.9,
    };
  }

  // Later cards: buffer → materialize → hold → dissolve → fade → buffer.
  return {
    materializeEnd: 0.2,
    holdEnd: 0.38,
    dissolveEnd: 0.78,
    fadeOutEnd: 0.92,
  };
}

/**
 * Full-motion card cycle: glitch materialize → hold → glitch dissolve.
 */
export function getCardCycleState(
  localT: number,
  options: CardCycleOptions = {},
): CardCycleState {
  const t = clamp01(localT);
  const startVisible = Boolean(options.startVisible);
  const ends = phaseEnds(startVisible);

  if (!startVisible && t < 0.05) {
    return { phase: "buffer", opacity: 0, glitch: 0 };
  }

  if (!startVisible && t < ends.materializeEnd) {
    const p = progressInRange(t, 0.05, ends.materializeEnd);
    return {
      phase: "materialize",
      opacity: easeInOutCubic(p),
      // Inverse dissolve: starts torn, resolves into place.
      glitch: 1 - easeInOutCubic(p),
    };
  }

  if (t < ends.holdEnd) {
    return { phase: "hold", opacity: 1, glitch: 0 };
  }

  if (t < ends.dissolveEnd) {
    const p = progressInRange(t, ends.holdEnd, ends.dissolveEnd);
    return {
      phase: "dissolve",
      opacity: 1 - p * 0.25,
      // Linear ramp so chromatic tear is visible early in the dissolve, not
      // stuck near 0 for a long ease-in-out lead-in.
      glitch: p,
    };
  }

  if (t < ends.fadeOutEnd) {
    const p = progressInRange(t, ends.dissolveEnd, ends.fadeOutEnd);
    return {
      phase: "fade-out",
      opacity: 1 - easeInOutCubic(p),
      glitch: 1,
    };
  }

  return { phase: "buffer", opacity: 0, glitch: 1 };
}

/**
 * Reduced-motion card cycle: eased fade-in → hold → fade-out only.
 * Never drives glitch; scroll scrubbing replaces hard opacity snaps.
 */
export function getReducedMotionCardCycleState(
  localT: number,
  options: CardCycleOptions = {},
): CardCycleState {
  const t = clamp01(localT);
  const startVisible = Boolean(options.startVisible);

  const fadeInStart = 0.06;
  const fadeInEnd = 0.28;
  const holdEnd = startVisible ? 0.58 : 0.6;
  const fadeOutEnd = 0.88;

  if (!startVisible && t < fadeInStart) {
    return { phase: "buffer", opacity: 0, glitch: 0 };
  }

  if (!startVisible && t < fadeInEnd) {
    return {
      phase: "materialize",
      opacity: easeInOutCubic(progressInRange(t, fadeInStart, fadeInEnd)),
      glitch: 0,
    };
  }

  if (t < holdEnd) {
    return { phase: "hold", opacity: 1, glitch: 0 };
  }

  if (t < fadeOutEnd) {
    return {
      phase: "fade-out",
      opacity: 1 - easeInOutCubic(progressInRange(t, holdEnd, fadeOutEnd)),
      glitch: 0,
    };
  }

  return { phase: "buffer", opacity: 0, glitch: 0 };
}

export function getCardFromScrollProgress(
  scrollProgress: number,
  cardCount: number,
): { index: number; localT: number } {
  const count = Math.max(cardCount, 1);
  const clamped = clamp01(scrollProgress);
  if (clamped >= 1) {
    return { index: count - 1, localT: 1 };
  }
  const scaled = clamped * count;
  const index = Math.min(count - 1, Math.floor(scaled));
  return { index, localT: scaled - index };
}
