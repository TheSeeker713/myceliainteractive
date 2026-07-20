/**
 * Run mobile-only side effects safely. Errors are logged and swallowed so they
 * cannot cascade into shared/desktop behavior (card stage wheel, site chrome).
 */
export function runMobileSafe(feature: string, action: () => void): void {
  try {
    action();
  } catch (error) {
    console.error(
      `[mycelia:mobile] ${feature} error suppressed; shared path continues.`,
      error,
    );
  }
}

/**
 * Like runMobileSafe but returns a fallback value when the action throws.
 */
export function callMobileSafe<T>(
  feature: string,
  action: () => T,
  fallback: T,
): T {
  try {
    return action();
  } catch (error) {
    console.error(
      `[mycelia:mobile] ${feature} error suppressed; using fallback.`,
      error,
    );
    return fallback;
  }
}
