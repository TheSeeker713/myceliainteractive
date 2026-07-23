/**
 * Imperative drag transform for mobile card follow (3F.2).
 *
 * Applying translate via React setState on every pointermove re-renders the
 * full pane tree and drops intermediate frames on real phones — release still
 * worked because lastDx was tracked in the listener. Write transform directly
 * to the card DOM instead.
 */

import { dragRotationDeg } from "./cardStageMobileScroll";

const SETTLE_MS = 220;

export function applyCardDragTransform(
  card: HTMLElement | null,
  dx: number,
  viewportWidth: number,
  animated: boolean,
): void {
  if (!card) return;
  card.style.transition = animated ? `transform ${SETTLE_MS}ms ease-out` : "none";
  if (dx === 0 && !animated) {
    card.style.transform = "";
    return;
  }
  const rot = dragRotationDeg(dx, viewportWidth);
  card.style.transform = `translate3d(${dx}px, 0, 0) rotate(${rot}deg)`;
}

export function clearCardDragTransform(card: HTMLElement | null): void {
  if (!card) return;
  card.style.transition = "none";
  card.style.transform = "";
}

export const CARD_DRAG_SETTLE_MS = SETTLE_MS;
