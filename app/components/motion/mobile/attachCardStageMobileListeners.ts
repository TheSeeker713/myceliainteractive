import { MYCELIA_FLOW_WHEEL_EVENT } from "../MyceliaFlowAtmosphere";
import { runMobileSafe } from "@/app/mobile/guardMobile";
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
 *
 * Handlers are try/catch guarded so a mobile scroll failure cannot poison the
 * window event path or cascade into desktop behavior after a viewport resize.
 */
export function attachCardStageMobileListeners(
  options: AttachCardStageMobileListenersOptions,
): () => void {
  let wheelAccum = 0;
  let touchStartY: number | null = null;
  let touchActive = false;

  const safeCommit = (direction: 1 | -1) => {
    runMobileSafe("card-stage-commit", () => {
      options.commitIntent(direction);
    });
  };

  const onWheel = (event: WheelEvent) => {
    runMobileSafe("card-stage-wheel", () => {
      if (isMobileStageBlockedTarget(event.target)) return;

      const root = options.getRoot();
      const port = getStageScrollPort(root);
      if (!port) return;

      const direction: 1 | -1 | 0 =
        event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0;
      if (!direction) return;

      const targetNode =
        event.target instanceof Node ? (event.target as Node) : null;

      // Still scrolling content inside the card — do not capture.
      if (
        targetNode &&
        (port.contains(targetNode) || root?.contains(targetNode)) &&
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
      safeCommit(direction);
      wheelAccum = 0;
    });
  };

  const onTouchStart = (event: TouchEvent) => {
    runMobileSafe("card-stage-touchstart", () => {
      if (isMobileStageBlockedTarget(event.target)) {
        touchActive = false;
        touchStartY = null;
        return;
      }
      const touch = event.touches[0];
      touchStartY = touch?.clientY ?? null;
      touchActive = touchStartY !== null;
    });
  };

  const onTouchMove = (event: TouchEvent) => {
    runMobileSafe("card-stage-touchmove", () => {
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
      safeCommit(direction);
      touchStartY = touch.clientY;
    });
  };

  const onTouchEnd = () => {
    touchActive = false;
    touchStartY = null;
  };

  try {
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
  } catch (error) {
    console.error(
      "[mycelia:mobile] card-stage-attach failed; no mobile listeners installed.",
      error,
    );
    return () => {};
  }

  return () => {
    runMobileSafe("card-stage-detach", () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    });
  };
}
