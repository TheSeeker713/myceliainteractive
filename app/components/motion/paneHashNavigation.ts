/**
 * Resolve a location hash to a MyceliaCardStage pane index.
 * - Empty hash → hero / first pane (0)
 * - Matching pane.id → that index
 * - Unknown non-empty hash → null (ignore)
 */
export function paneIndexFromHash(
  hash: string,
  paneIds: readonly (string | undefined)[],
): number | null {
  const id = hash.replace(/^#/, "").trim();
  if (!id) return 0;
  const index = paneIds.findIndex((paneId) => paneId === id);
  return index < 0 ? null : index;
}

/** Same-origin, same-path link that should drive the card stage. */
export function isSamePathStageNavHref(
  href: string,
  currentOrigin: string,
  currentPathname: string,
): { hash: string } | null {
  let url: URL;
  try {
    url = new URL(href, currentOrigin);
  } catch {
    return null;
  }
  if (url.origin !== currentOrigin) return null;
  if (url.pathname !== currentPathname) return null;
  return { hash: url.hash };
}
