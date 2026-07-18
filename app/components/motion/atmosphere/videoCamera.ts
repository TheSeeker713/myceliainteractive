/**
 * Map pointer/scroll into a subtle footage-camera UV nudge.
 * Kept separate from liquid-warp uniforms so both can coexist.
 */
export function computeVideoCamera({
  pointerX,
  pointerY,
  scroll,
  scrollVelocity,
}: {
  pointerX: number;
  pointerY: number;
  scroll: number;
  scrollVelocity: number;
}): {
  cameraOffsetX: number;
  cameraOffsetY: number;
  cameraZoom: number;
} {
  const panX = (pointerX - 0.5) * 0.034;
  const panY = (pointerY - 0.5) * 0.028;
  const scrollPanY = (scroll - 0.5) * 0.022;
  const speed = Math.min(Math.abs(scrollVelocity), 1);
  const zoom = 1.018 + scroll * 0.038 + speed * 0.018;

  return {
    cameraOffsetX: panX,
    cameraOffsetY: panY + scrollPanY,
    cameraZoom: Math.min(1.08, Math.max(1.0, zoom)),
  };
}
