/** Pixel slack for sub-pixel / rubber-band scroll edges. */
export const MOBILE_SCROLL_EDGE_EPS_PX = 2;

/** Accumulated delta past an edge before advancing panes. */
export const MOBILE_SCROLL_ADVANCE_THRESHOLD_PX = 48;

/**
 * True when the scrollport can still move in `direction` (1 = down / next content).
 * When content does not overflow, returns false (already "at edge" both ways).
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

/** True when a wheel/touch delta should advance panes (at edge or no overflow). */
export function shouldAdvanceFromScrollDelta(
  scrollPort: Pick<HTMLElement, "scrollTop" | "scrollHeight" | "clientHeight"> | null,
  direction: 1 | -1,
): boolean {
  return !canScrollStageContent(scrollPort, direction);
}

export function accumulateMobileScrollDelta(
  accumulated: number,
  deltaY: number,
): number {
  if (accumulated !== 0 && Math.sign(accumulated) !== Math.sign(deltaY)) {
    return deltaY;
  }
  return accumulated + deltaY;
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
