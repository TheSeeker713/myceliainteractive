import { runMobileSafe } from "@/app/mobile/guardMobile";
import {
  classifySwipeAxis,
  isMobileStageBlockedTarget,
  type MobileSwipeAxis,
} from "./cardStageMobileScroll";

export type AttachCardStageMobileListenersOptions = {
  getRoot: () => HTMLElement | null;
  /** Stage card element that receives live transform + pointer capture. */
  getCard: () => HTMLElement | null;
  /** Continuous follow while horizontally locked (dx/dy = current − start). */
  onDragMove: (dx: number, dy: number) => void;
  /** Release after a horizontal (or undecided) gesture — parent decides dismiss vs spring. */
  onDragEnd: (dx: number, dy: number) => void;
  /** Vertical-locked or cancelled gesture — parent should idle/spring without commit. */
  onDragCancel: () => void;
};

function pointerStartedInRoot(
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
 * Mobile (≤767) card-stage listeners — Step 3F.2 drag-follow.
 *
 * Tracks the finger while axis-locked horizontal (dx + dy for visuals).
 * Does **not** call commitIntent — MyceliaCardStage decides on release.
 * Vertical axis never preventDefaults. Single-fire onDragEnd/onDragCancel.
 */
export function attachCardStageMobileListeners(
  options: AttachCardStageMobileListenersOptions,
): () => void {
  let armed = false;
  let gestureConsumed = false;
  let axisLock: MobileSwipeAxis | null = null;
  let startX = 0;
  let startY = 0;
  let lastDx = 0;
  let lastDy = 0;
  let pointerId: number | null = null;
  let captureEl: HTMLElement | null = null;

  const clearGesture = () => {
    if (captureEl && pointerId != null) {
      try {
        if (captureEl.hasPointerCapture?.(pointerId)) {
          captureEl.releasePointerCapture(pointerId);
        }
      } catch {
        /* ignore */
      }
    }
    armed = false;
    gestureConsumed = false;
    axisLock = null;
    startX = 0;
    startY = 0;
    lastDx = 0;
    lastDy = 0;
    pointerId = null;
    captureEl = null;
  };

  const finish = (kind: "end" | "cancel") => {
    if (!armed || gestureConsumed) {
      clearGesture();
      return;
    }
    gestureConsumed = true;
    const dx = lastDx;
    const dy = lastDy;
    const wasVertical = axisLock === "vertical";
    clearGesture();
    if (wasVertical || kind === "cancel") {
      runMobileSafe("card-stage-drag-cancel", () => options.onDragCancel());
      return;
    }
    runMobileSafe("card-stage-drag-end", () => options.onDragEnd(dx, dy));
  };

  const onPointerDown = (event: PointerEvent) => {
    runMobileSafe("card-stage-pointerdown", () => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      clearGesture();
      if (isMobileStageBlockedTarget(event.target)) return;
      const root = options.getRoot();
      if (!pointerStartedInRoot(event.target, root)) return;

      armed = true;
      gestureConsumed = false;
      axisLock = null;
      startX = event.clientX;
      startY = event.clientY;
      lastDx = 0;
      lastDy = 0;
      pointerId = event.pointerId;

      const card = options.getCard();
      if (card) {
        captureEl = card;
        try {
          card.setPointerCapture(event.pointerId);
        } catch {
          captureEl = null;
        }
      }
    });
  };

  const onPointerMove = (event: PointerEvent) => {
    runMobileSafe("card-stage-pointermove", () => {
      if (!armed || gestureConsumed) return;
      if (pointerId != null && event.pointerId !== pointerId) return;

      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      lastDx = dx;
      lastDy = dy;

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
        return;
      }

      event.preventDefault();
      options.onDragMove(dx, dy);
    });
  };

  const onPointerUp = (event: PointerEvent) => {
    runMobileSafe("card-stage-pointerup", () => {
      if (pointerId != null && event.pointerId !== pointerId) return;
      finish("end");
    });
  };

  const onPointerCancel = (event: PointerEvent) => {
    runMobileSafe("card-stage-pointercancel", () => {
      if (pointerId != null && event.pointerId !== pointerId) return;
      finish("cancel");
    });
  };

  try {
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerCancel, { passive: true });
  } catch (error) {
    console.error(
      "[mycelia:mobile] card-stage-attach failed; no mobile listeners installed.",
      error,
    );
    return () => {};
  }

  return () => {
    runMobileSafe("card-stage-detach", () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      clearGesture();
    });
  };
}
