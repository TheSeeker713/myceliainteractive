import { MYCELIA_FLOW_WHEEL_EVENT } from "../MyceliaFlowAtmosphere";
import {
  accumulateMobileScrollDelta,
  canScrollStageContent,
  isMobileStageBlockedTarget,
  MOBILE_SCROLL_ADVANCE_THRESHOLD_PX,
  shouldAdvanceFromScrollDelta,
} from "./cardStageMobileScroll";

export type AttachCardStageMobileListenersOptions = {
  getRoot: () => HTMLElement | null;
  commitIntent: (direction: 1 | -1) => void;
};

function getStageScrollPort(root: HTMLElement | null): HTMLElement | null {
  return (
    (root?.querySelector(
      ".liquid-glass-card-content--stage",
    ) as HTMLElement | null) ?? null
  );
}

/**
 * Mobile (≤767) card advancement: native in-card scroll until the edge, then
 * continued wheel/touch advances panes via the shared applyScrollIntent path.
 * Desktop outside-card 72px listeners are not used while this is attached.
 */
export function attachCardStageMobileListeners(
  options: AttachCardStageMobileListenersOptions,
): () => void {
  let wheelAccum = 0;
  let touchStartY: number | null = null;
  let touchActive = false;

  const onWheel = (event: WheelEvent) => {
    if (isMobileStageBlockedTarget(event.target)) return;

    const root = options.getRoot();
    const port = getStageScrollPort(root);
    if (!port) return;

    const direction: 1 | -1 | 0 =
      event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0;
    if (!direction) return;

    // Still scrolling content inside the card — do not capture.
    if (
      (port.contains(event.target as Node) ||
        root?.contains(event.target as Node)) &&
      canScrollStageContent(port, direction)
    ) {
      wheelAccum = 0;
      return;
    }

    if (!shouldAdvanceFromScrollDelta(port, direction)) {
      wheelAccum = 0;
      return;
    }

    event.preventDefault();
    window.dispatchEvent(
      new CustomEvent(MYCELIA_FLOW_WHEEL_EVENT, {
        detail: { deltaY: event.deltaY },
      }),
    );
    wheelAccum = accumulateMobileScrollDelta(wheelAccum, event.deltaY);
    if (Math.abs(wheelAccum) < MOBILE_SCROLL_ADVANCE_THRESHOLD_PX) return;
    options.commitIntent(direction);
    wheelAccum = 0;
  };

  const onTouchStart = (event: TouchEvent) => {
    if (isMobileStageBlockedTarget(event.target)) {
      touchActive = false;
      touchStartY = null;
      return;
    }
    const touch = event.touches[0];
    touchStartY = touch?.clientY ?? null;
    touchActive = touchStartY !== null;
  };

  const onTouchMove = (event: TouchEvent) => {
    if (!touchActive || touchStartY === null) return;
    if (isMobileStageBlockedTarget(event.target)) return;

    const touch = event.touches[0];
    if (!touch) return;

    const root = options.getRoot();
    const port = getStageScrollPort(root);
    if (!port) return;

    const deltaY = touchStartY - touch.clientY;
    const direction: 1 | -1 | 0 = deltaY > 0 ? 1 : deltaY < 0 ? -1 : 0;
    if (!direction) return;

    if (canScrollStageContent(port, direction)) {
      // Native scroll consuming the gesture; keep start anchored.
      touchStartY = touch.clientY;
      return;
    }

    if (Math.abs(deltaY) < MOBILE_SCROLL_ADVANCE_THRESHOLD_PX) return;

    event.preventDefault();
    window.dispatchEvent(
      new CustomEvent(MYCELIA_FLOW_WHEEL_EVENT, {
        detail: { deltaY },
      }),
    );
    options.commitIntent(direction);
    touchStartY = touch.clientY;
  };

  const onTouchEnd = () => {
    touchActive = false;
    touchStartY = null;
  };

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("touchcancel", onTouchEnd, { passive: true });

  return () => {
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("touchcancel", onTouchEnd);
  };
}
