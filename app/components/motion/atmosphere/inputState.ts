export type NormalizedScrollInput = {
  scroll: number;
  scrollVelocity: number;
};

export type NormalizedPointerInput = {
  pointerX: number;
  pointerY: number;
  pointerVelocityX: number;
  pointerVelocityY: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Normalize document scroll into [0, 1] progress and a capped velocity
 * relative to viewport height. Velocity uses CSS/top-origin scrollY deltas.
 */
export function normalizeScrollInput({
  scrollY,
  previousScrollY,
  viewportHeight,
  scrollHeight,
}: {
  scrollY: number;
  previousScrollY: number;
  viewportHeight: number;
  scrollHeight: number;
}): NormalizedScrollInput {
  const maxScroll = Math.max(scrollHeight - viewportHeight, 0);
  const scroll = maxScroll > 0 ? clamp(scrollY / maxScroll, 0, 1) : 0;
  const height = Math.max(viewportHeight, 1);
  const scrollVelocity = clamp((scrollY - previousScrollY) / height, -2, 2);

  return { scroll, scrollVelocity };
}

/**
 * Normalize pointer coordinates into WebGL-friendly space:
 * X left→right [0, 1], Y bottom→top [0, 1], with viewport-relative velocity.
 */
export function normalizePointerInput({
  clientX,
  clientY,
  previousClientX,
  previousClientY,
  viewportWidth,
  viewportHeight,
}: {
  clientX: number;
  clientY: number;
  previousClientX: number;
  previousClientY: number;
  viewportWidth: number;
  viewportHeight: number;
}): NormalizedPointerInput {
  const width = Math.max(viewportWidth, 1);
  const height = Math.max(viewportHeight, 1);

  return {
    pointerX: clamp(clientX / width, 0, 1),
    pointerY: clamp(1 - clientY / height, 0, 1),
    pointerVelocityX: (clientX - previousClientX) / width,
    pointerVelocityY: (previousClientY - clientY) / height,
  };
}
