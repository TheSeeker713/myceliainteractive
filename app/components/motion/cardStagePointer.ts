export type ClientPoint = {
  clientX: number;
  clientY: number;
};

export type DomRectLike = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

/** True when the pointer is inside the card's axis-aligned bounding box. */
export function isPointInsideRect(
  point: ClientPoint,
  rect: DomRectLike | null | undefined,
): boolean {
  if (!rect) return false;
  return (
    point.clientX >= rect.left &&
    point.clientX <= rect.right &&
    point.clientY >= rect.top &&
    point.clientY <= rect.bottom
  );
}

/**
 * Stage wheel/touch should drive card transitions only when the pointer is
 * outside the visible card. Inside the card, native content scroll wins.
 */
export function shouldCaptureStageScroll(
  point: ClientPoint,
  cardRect: DomRectLike | null | undefined,
): boolean {
  return !isPointInsideRect(point, cardRect);
}
