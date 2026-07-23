/** Pixel slack for sub-pixel / rubber-band scroll edges. */
export const MOBILE_SCROLL_EDGE_EPS_PX = 2;

/**
 * Require |dx| > |dy| * ratio before treating the gesture as horizontal.
 * Prevents diagonal/vertical scroll from stealing card drag-dismiss.
 */
export const MOBILE_SWIPE_AXIS_RATIO = 1.25;

/** Fraction of visual-viewport width required to dismiss on release (3F.2). */
export const MOBILE_DRAG_DISMISS_RATIO = 0.35;

/** Max card tilt (degrees) while dragging horizontally. */
export const MOBILE_DRAG_MAX_ROTATION_DEG = 8;

/**
 * True when the scrollport can still move in `direction` (1 = down / next content).
 * When content does not overflow, returns false (already "at edge" both ways).
 *
 * Used by MyceliaCardStage keyboard handling (desktop + mobile until 3E.3).
 * Mobile vertical scroll never advances panes (3E.1+).
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

/**
 * On release: dismiss if |dx| ≥ ratio × viewport width.
 * Returns pane direction or null to spring back.
 */
export function shouldDismissHorizontalDrag(
  dx: number,
  viewportWidth: number,
  ratio = MOBILE_DRAG_DISMISS_RATIO,
): 1 | -1 | null {
  if (!Number.isFinite(dx) || !Number.isFinite(viewportWidth) || viewportWidth <= 0) {
    return null;
  }
  if (!Number.isFinite(ratio) || ratio <= 0) return null;
  if (Math.abs(dx) < viewportWidth * ratio) return null;
  return paneDirectionFromHorizontalDelta(dx);
}

/** Subtle rotation tied to horizontal drag progress (−max…+max). */
export function dragRotationDeg(
  dx: number,
  viewportWidth: number,
  maxDeg = MOBILE_DRAG_MAX_ROTATION_DEG,
): number {
  if (!Number.isFinite(dx) || !Number.isFinite(viewportWidth) || viewportWidth <= 0) {
    return 0;
  }
  const t = Math.max(-1, Math.min(1, dx / viewportWidth));
  return t * maxDeg;
}

/** Off-screen fling target: next → negative X, previous → positive X. */
export function flingTargetDx(direction: 1 | -1, viewportWidth: number): number {
  const w = Math.max(viewportWidth, 1);
  return direction === 1 ? -w : w;
}

export function readDragViewportWidth(): number {
  if (typeof window === "undefined") return 390;
  return window.visualViewport?.width || window.innerWidth || 390;
}
