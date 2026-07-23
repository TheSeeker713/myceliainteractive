import { runMobileSafe } from "@/app/mobile/guardMobile";

export type AttachCardStageMobileListenersOptions = {
  getRoot: () => HTMLElement | null;
  commitIntent: (direction: 1 | -1) => void;
};

/**
 * Mobile (≤767) card-stage listeners.
 *
 * Step 3E.1: Part 3B.2 scroll-to-edge pane advance is retired. Vertical
 * wheel/touch must never call commitIntent. This attach is intentionally a
 * no-op until 3E.2 installs horizontal-swipe → commitIntent with a
 * gesture-level single-fire lock.
 *
 * Desktop outside-card listeners are still skipped while MyceliaCardStage
 * takes this mobile branch (keyboard Arrow/Page remain on commitIntent).
 *
 * @see documents/part3-step-3e1-scroll-edge-retirement.md
 */
export function attachCardStageMobileListeners(
  options: AttachCardStageMobileListenersOptions,
): () => void {
  // Options reserved for 3E.2 horizontal-swipe wiring (commitIntent / getRoot).
  void options;
  return () => {
    runMobileSafe("card-stage-detach", () => {
      /* no listeners installed in 3E.1 */
    });
  };
}
