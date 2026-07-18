import type { AtmosphereMode } from "@/app/components/motion/atmosphereCapability";

export type MyceliaFlowCapability = {
  /** Explicit opt-in only — never OS prefers-reduced-motion. */
  reduceMotionOptIn: boolean;
  webgl2Available: boolean;
  saveData?: boolean;
  effectiveType?: string;
  hardwareConcurrency?: number;
  deviceMemory?: number;
};

const CONSTRAINED_CONNECTIONS = new Set(["slow-2g", "2g"]);

/**
 * Mycelia Flow ladder:
 * - static: explicit Reduce motion opt-in, or no WebGL2
 * - lite: constrained device/network (poster + CSS motion, no video decode)
 * - full: video-texture WebGL
 */
export function selectMyceliaFlowMode({
  reduceMotionOptIn,
  webgl2Available,
  saveData,
  effectiveType,
  hardwareConcurrency,
  deviceMemory,
}: MyceliaFlowCapability): AtmosphereMode {
  if (reduceMotionOptIn || !webgl2Available) {
    return "static";
  }

  if (
    saveData === true ||
    (effectiveType !== undefined &&
      CONSTRAINED_CONNECTIONS.has(effectiveType)) ||
    (hardwareConcurrency !== undefined && hardwareConcurrency <= 2) ||
    (deviceMemory !== undefined && deviceMemory <= 1)
  ) {
    return "lite";
  }

  return "full";
}

export function detectMyceliaFlowDeviceCapability(): Omit<
  MyceliaFlowCapability,
  "reduceMotionOptIn"
> {
  if (typeof window === "undefined") {
    return { webgl2Available: false };
  }

  const canvas = document.createElement("canvas");
  const webgl2Available = Boolean(canvas.getContext("webgl2"));
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  const deviceMemory = (
    navigator as Navigator & { deviceMemory?: number }
  ).deviceMemory;

  return {
    webgl2Available,
    saveData: connection?.saveData,
    effectiveType: connection?.effectiveType,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory,
  };
}

/** @deprecated Use selectMyceliaFlowMode — kept for preview re-exports. */
export const selectPreviewAtmosphereMode = selectMyceliaFlowMode;
/** @deprecated Use detectMyceliaFlowDeviceCapability */
export const detectPreviewDeviceCapability = detectMyceliaFlowDeviceCapability;
/** @deprecated Use MyceliaFlowCapability */
export type PreviewAtmosphereCapability = MyceliaFlowCapability;
