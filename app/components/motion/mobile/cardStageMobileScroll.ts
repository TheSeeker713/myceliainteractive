/** Pixel slack for sub-pixel / rubber-band scroll edges. */
export const MOBILE_SCROLL_EDGE_EPS_PX = 2;

/** Horizontal swipe distance before a pane change (not hair-trigger). */
export const MOBILE_SWIPE_DISTANCE_THRESHOLD_PX = 64;

/**
 * Require |dx| > |dy| * ratio before treating the gesture as horizontal.
 * Prevents diagonal/vertical scroll from stealing pane changes.
 */
export const MOBILE_SWIPE_AXIS_RATIO = 1.25;

/** Lower distance floor when velocity escape accepts a short flick. */
export const MOBILE_SWIPE_VELOCITY_FLOOR_PX = 40;

/** px/ms — short flick must exceed this with the velocity floor. */
export const MOBILE_SWIPE_VELOCITY_ESCAPE_PX_PER_MS = 0.55;

/**
 * True when the scrollport can still move in `direction` (1 = down / next content).
 * When content does not overflow, returns false (already "at edge" both ways).
 *
 * Used by MyceliaCardStage keyboard handling (desktop + mobile until 3E.3).
 * Mobile vertical scroll never advances panes (3E.1 / 3E.2).
 */
export function canScrollStageContent(
  scrollPort: Pick<HTMLElement, "scrollTop" | "scrollHeight" | "clientHeight"> | null,
  direction: 1 | -1,
  edgeEps = MOBILE_SCROLL_EDGE_EPS_PX,
): boolean {
  if (!scrollPort) return false;
  const max = scrollPort.scrollHeight - scrollPort.clientHeight;
  if (max <= edgeEps) return false;
  if (direction === 1) return scrollPort.scrollTop < max - edgeEps;
  return scrollPort.scrollTop > edgeEps;
}

export function isMobileStageBlockedTarget(target: EventTarget | null): boolean {
  if (target == null) return false;
  // Node/test envs have no Element; treat as unblocked (listeners are browser-only).
  if (typeof Element === "undefined") return false;
  if (!(target instanceof Element)) return false;
  if (target.closest("header, footer, [role='dialog']")) return true;
  if (typeof HTMLElement !== "undefined" && target instanceof HTMLElement) {
    if (target.isContentEditable) return true;
    const tag = target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  }
  return false;
}

export type MobileSwipeAxis = "horizontal" | "vertical" | "undecided";

/**
 * Classify dominant axis. `dx` / `dy` are finger deltas: current - start
 * (positive dx = finger moved right).
 */
export function classifySwipeAxis(
  dx: number,
  dy: number,
  axisRatio = MOBILE_SWIPE_AXIS_RATIO,
): MobileSwipeAxis {
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  if (absX < 8 && absY < 8) return "undecided";
  if (absX > absY * axisRatio) return "horizontal";
  if (absY > absX * axisRatio) return "vertical";
  return "undecided";
}

/**
 * Finger moved left (dx < 0) → next pane (1).
 * Finger moved right (dx > 0) → previous pane (-1).
 */
export function paneDirectionFromHorizontalDelta(dx: number): 1 | -1 | null {
  if (dx === 0 || !Number.isFinite(dx)) return null;
  return dx < 0 ? 1 : -1;
}

export type AcceptHorizontalSwipeOptions = {
  distancePx?: number;
  axisRatio?: number;
  /** Elapsed ms since touchstart; enables velocity escape. */
  elapsedMs?: number;
  velocityFloorPx?: number;
  velocityEscapePxPerMs?: number;
};

/**
 * Returns pane direction if this horizontal swipe should fire once.
 * Vertical-dominant and under-threshold gestures return null.
 */
export function shouldAcceptHorizontalSwipe(
  dx: number,
  dy: number,
  options: AcceptHorizontalSwipeOptions = {},
): 1 | -1 | null {
  if (classifySwipeAxis(dx, dy, options.axisRatio) !== "horizontal") {
    return null;
  }

  const distancePx = options.distancePx ?? MOBILE_SWIPE_DISTANCE_THRESHOLD_PX;
  const absX = Math.abs(dx);

  if (absX >= distancePx) {
    return paneDirectionFromHorizontalDelta(dx);
  }

  const elapsedMs = options.elapsedMs;
  if (
    elapsedMs != null &&
    elapsedMs > 0 &&
    Number.isFinite(elapsedMs) &&
    absX >= (options.velocityFloorPx ?? MOBILE_SWIPE_VELOCITY_FLOOR_PX)
  ) {
    const speed = absX / elapsedMs;
    if (
      speed >=
      (options.velocityEscapePxPerMs ?? MOBILE_SWIPE_VELOCITY_ESCAPE_PX_PER_MS)
    ) {
      return paneDirectionFromHorizontalDelta(dx);
    }
  }

  return null;
}
