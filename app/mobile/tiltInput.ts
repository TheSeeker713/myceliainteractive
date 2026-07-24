/**
 * Map device orientation (beta/gamma) into viewport client coordinates
 * that feed the existing atmosphere pointer/warp channels.
 */

export type TiltSample = {
  beta: number | null;
  gamma: number | null;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * beta (front/back tilt) ≈ -180..180 → Y
 * gamma (left/right tilt) ≈ -90..90 → X
 * Neutral phone-in-hand ≈ beta 45–70; we center around 45°.
 */
export function orientationToClientPoint(
  sample: TiltSample,
  viewportWidth: number,
  viewportHeight: number,
): { clientX: number; clientY: number } | null {
  const { beta, gamma } = sample;
  if (
    beta == null ||
    gamma == null ||
    !Number.isFinite(beta) ||
    !Number.isFinite(gamma)
  ) {
    return null;
  }

  const width = Math.max(viewportWidth, 1);
  const height = Math.max(viewportHeight, 1);

  // Map ±25° around neutral into full viewport span (subtle, not wild).
  const nx = clamp(0.5 + gamma / 50, 0, 1);
  const ny = clamp(0.5 + (beta - 45) / 50, 0, 1);

  return {
    clientX: nx * width,
    clientY: ny * height,
  };
}

export type OrientationPermissionState =
  | "unsupported"
  | "prompt"
  | "granted"
  | "denied";

export function getOrientationPermissionState(): OrientationPermissionState {
  if (typeof window === "undefined") return "unsupported";
  if (
    typeof DeviceOrientationEvent === "undefined" ||
    !("DeviceOrientationEvent" in window)
  ) {
    return "unsupported";
  }
  const DOE = DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<"granted" | "denied">;
  };
  if (typeof DOE.requestPermission !== "function") {
    // Non-iOS: usually available without a permission gate.
    return "granted";
  }
  return "prompt";
}

/**
 * Must be called from a user-gesture handler on iOS 13+.
 */
export async function requestOrientationPermission(): Promise<
  "granted" | "denied" | "unsupported"
> {
  if (typeof window === "undefined") return "unsupported";
  if (typeof DeviceOrientationEvent === "undefined") return "unsupported";
  const DOE = DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<"granted" | "denied">;
  };
  if (typeof DOE.requestPermission !== "function") {
    return "granted";
  }
  try {
    return await DOE.requestPermission();
  } catch {
    return "denied";
  }
}
