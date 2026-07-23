import { runMobileSafe } from "@/app/mobile/guardMobile";
import {
  classifySwipeAxis,
  isMobileStageBlockedTarget,
  shouldAcceptHorizontalSwipe,
  type MobileSwipeAxis,
} from "./cardStageMobileScroll";

export type AttachCardStageMobileListenersOptions = {
  getRoot: () => HTMLElement | null;
  commitIntent: (direction: 1 | -1) => void;
};

function touchStartedInRoot(
  target: EventTarget | null,
  root: HTMLElement | null,
): boolean {
  if (!root || !(target instanceof Node)) return false;
  try {
    return root.contains(target);
  } catch {
    return false;
  }
}

/**
 * Mobile (≤767) card-stage listeners — Step 3E.2.
 *
 * - Vertical swipe/scroll: never calls commitIntent (native pan-y only).
 * - Horizontal swipe left → next pane; right → previous pane via the same
 *   commitIntent → applyScrollIntent path keyboard uses.
 * - Gesture-level single-fire lock: armed on touchstart, consumed on first
 *   accepted swipe, cleared on touchend/touchcancel. Does not re-anchor mid-
 *   gesture (that caused the multi-advance bug in 3B.2).
 *
 * Desktop outside-card listeners are not used while this is attached.
 */
export function attachCardStageMobileListeners(
  options: AttachCardStageMobileListenersOptions,
): () => void {
  let armed = false;
  let gestureConsumed = false;
  let axisLock: MobileSwipeAxis | null = null;
  let startX = 0;
  let startY = 0;
  let startTime = 0;

  const clearGesture = () => {
    armed = false;
    gestureConsumed = false;
    axisLock = null;
    startX = 0;
    startY = 0;
    startTime = 0;
  };

  const safeCommit = (direction: 1 | -1) => {
    runMobileSafe("card-stage-commit", () => {
      options.commitIntent(direction);
    });
  };

  const onTouchStart = (event: TouchEvent) => {
    runMobileSafe("card-stage-touchstart", () => {
      clearGesture();
      if (isMobileStageBlockedTarget(event.target)) return;
      const root = options.getRoot();
      if (!touchStartedInRoot(event.target, root)) return;

      const touch = event.touches[0];
      if (!touch) return;

      armed = true;
      gestureConsumed = false;
      axisLock = null;
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = performance.now();
    });
  };

  const onTouchMove = (event: TouchEvent) => {
    runMobileSafe("card-stage-touchmove", () => {
      if (!armed || gestureConsumed) return;
      if (isMobileStageBlockedTarget(event.target)) return;

      const touch = event.touches[0];
      if (!touch) return;

      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (axisLock == null || axisLock === "undecided") {
        const classified = classifySwipeAxis(dx, dy);
        if (classified === "vertical") {
          axisLock = "vertical";
          return;
        }
        if (classified === "horizontal") {
          axisLock = "horizontal";
        } else {
          return;
        }
      }

      if (axisLock === "vertical") {
        // Native vertical scroll only — never pane-change.
        return;
      }

      const direction = shouldAcceptHorizontalSwipe(dx, dy, {
        elapsedMs: performance.now() - startTime,
      });
      if (!direction) return;

      event.preventDefault();
      gestureConsumed = true;
      safeCommit(direction);
    });
  };

  const onTouchEnd = () => {
    runMobileSafe("card-stage-touchend", () => {
      clearGesture();
    });
  };

  try {
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
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      clearGesture();
    });
  };
}
