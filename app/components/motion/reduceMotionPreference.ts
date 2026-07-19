export const MYCELIA_REDUCE_MOTION_KEY = "mycelia:reduce-motion";
/** Legacy preview key — still honored when reading so preview opt-ins carry over. */
export const LEGACY_PREVIEW_REDUCE_MOTION_KEY =
  "atmosphere-preview:reduce-motion";

/** Same-tab sync for multiple useMyceliaReduceMotion() consumers. */
export const MYCELIA_REDUCE_MOTION_CHANGE_EVENT =
  "mycelia:reduce-motion-change";

export type MyceliaReduceMotionChangeDetail = {
  reduceMotion: boolean;
};

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/**
 * Explicit opt-in only. Missing/invalid values default to full motion (false).
 * Never derived from prefers-reduced-motion.
 */
export function readMyceliaReduceMotion(
  storage: StorageLike | null | undefined,
): boolean {
  if (!storage) return false;
  try {
    if (storage.getItem(MYCELIA_REDUCE_MOTION_KEY) === "1") return true;
    return storage.getItem(LEGACY_PREVIEW_REDUCE_MOTION_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeMyceliaReduceMotion(
  storage: StorageLike | null | undefined,
  reduceMotion: boolean,
): void {
  if (!storage) return;
  try {
    if (reduceMotion) {
      storage.setItem(MYCELIA_REDUCE_MOTION_KEY, "1");
      storage.setItem(LEGACY_PREVIEW_REDUCE_MOTION_KEY, "1");
    } else {
      storage.removeItem(MYCELIA_REDUCE_MOTION_KEY);
      storage.removeItem(LEGACY_PREVIEW_REDUCE_MOTION_KEY);
    }
  } catch {
    // Ignore quota / private-mode failures; in-memory UI state still works.
  }
}
