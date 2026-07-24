export const MYCELIA_ONBOARDING_STORAGE_KEY = "mycelia-motion-onboarding-seen";
export const MYCELIA_TILT_ENABLED_KEY = "mycelia-tilt-enabled";

export function hasSeenMotionOnboarding(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(MYCELIA_ONBOARDING_STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

export function markMotionOnboardingSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MYCELIA_ONBOARDING_STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function hasTiltEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(MYCELIA_TILT_ENABLED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markTiltEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (enabled) {
      window.localStorage.setItem(MYCELIA_TILT_ENABLED_KEY, "1");
    } else {
      window.localStorage.removeItem(MYCELIA_TILT_ENABLED_KEY);
    }
  } catch {
    /* ignore */
  }
}
