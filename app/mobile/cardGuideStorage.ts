export const MOBILE_CARD_GUIDE_STORAGE_KEY = "mycelia-mobile-card-guide-seen";

/** Session-scoped first-use guide (arrows + tip). Safe when sessionStorage is blocked. */
export function hasSeenMobileCardGuide(): boolean {
  try {
    return sessionStorage.getItem(MOBILE_CARD_GUIDE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markMobileCardGuideSeen(): void {
  try {
    sessionStorage.setItem(MOBILE_CARD_GUIDE_STORAGE_KEY, "1");
  } catch {
    /* private mode / quota — guide may reappear this session only */
  }
}
