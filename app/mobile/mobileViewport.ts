/**
 * Canonical Part 3 mobile viewport gate.
 * Aligned with ScrollFoldScene: max-width 767px (desktop = 768px+).
 */
export const MOBILE_VIEWPORT_MEDIA_QUERY = "(max-width: 767px)";

/** Pure helper for tests and non-React callers. */
export function matchesMobileViewport(
  media: Pick<MediaQueryList, "matches"> | null | undefined,
): boolean {
  return Boolean(media?.matches);
}
