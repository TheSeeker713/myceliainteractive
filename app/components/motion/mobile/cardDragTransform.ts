/**
 * Imperative drag transform for mobile card follow (3F.2).
 *
 * Write transform directly to the drag-layer DOM (not React setState per move).
 */

import { dragRotationDeg } from "./cardStageMobileScroll";

const SETTLE_MS = 220;

export function applyCardDragTransform(
  card: HTMLElement | null,
  dx: number,
  dy: number,
  viewportWidth: number,
  viewportHeight: number,
  animated: boolean,
): void {
  if (!card) return;
  card.style.transition = animated ? `transform ${SETTLE_MS}ms ease-out` : "none";
  if (dx === 0 && dy === 0 && !animated) {
    card.style.transform = "";
    return;
  }
  const rot = dragRotationDeg(dx, dy, viewportWidth, viewportHeight);
  card.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${rot}deg)`;
}

export function clearCardDragTransform(card: HTMLElement | null): void {
  if (!card) return;
  card.style.transition = "none";
  card.style.transform = "";
}

export const CARD_DRAG_SETTLE_MS = SETTLE_MS;
