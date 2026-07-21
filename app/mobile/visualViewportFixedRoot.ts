/**
 * Align a position:fixed overlay to the visual viewport.
 *
 * On real iOS Safari, the visual viewport can diverge from the layout viewport
 * (zoom, scroll momentum, dynamic toolbars). position:fixed; inset:0 anchors to
 * the layout viewport and can appear shifted/off-screen — often invisible in CDP
 * emulation. Pinning top/left/width/height to visualViewport fixes that class of bug.
 */

export type VisualViewportBox = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export function readVisualViewportBox(
  vv:
    | Pick<VisualViewport, "offsetTop" | "offsetLeft" | "width" | "height">
    | null
    | undefined,
): VisualViewportBox | null {
  if (!vv) return null;
  const { offsetTop, offsetLeft, width, height } = vv;
  if (
    !Number.isFinite(offsetTop) ||
    !Number.isFinite(offsetLeft) ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return null;
  }
  return {
    top: offsetTop,
    left: offsetLeft,
    width,
    height,
  };
}

/** Apply box as inline styles; pass null to clear and fall back to CSS inset:0. */
export function applyVisualViewportBox(
  el: HTMLElement,
  box: VisualViewportBox | null,
): void {
  if (!box) {
    el.style.top = "";
    el.style.left = "";
    el.style.width = "";
    el.style.height = "";
    el.style.right = "";
    el.style.bottom = "";
    return;
  }
  el.style.top = `${box.top}px`;
  el.style.left = `${box.left}px`;
  el.style.width = `${box.width}px`;
  el.style.height = `${box.height}px`;
  el.style.right = "auto";
  el.style.bottom = "auto";
}

/**
 * Keep `el` synced to window.visualViewport while attached.
 * Returns a cleanup that removes listeners and clears inline geometry.
 * If visualViewport is missing, no-ops (CSS fixed/inset fallback).
 */
export function attachVisualViewportFixedRoot(el: HTMLElement): () => void {
  const vv = window.visualViewport;
  if (!vv) {
    return () => {
      applyVisualViewportBox(el, null);
    };
  }

  const sync = () => {
    applyVisualViewportBox(el, readVisualViewportBox(vv));
  };

  sync();
  vv.addEventListener("resize", sync);
  vv.addEventListener("scroll", sync);
  window.addEventListener("resize", sync);

  return () => {
    vv.removeEventListener("resize", sync);
    vv.removeEventListener("scroll", sync);
    window.removeEventListener("resize", sync);
    applyVisualViewportBox(el, null);
  };
}
