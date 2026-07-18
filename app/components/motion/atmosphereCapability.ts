export type AtmosphereMode = "full" | "lite" | "static";

export type AtmosphereCapability = {
  reducedMotion: boolean;
  webgl2Available: boolean;
  saveData?: boolean;
  effectiveType?: string;
  hardwareConcurrency?: number;
  deviceMemory?: number;
};

const CONSTRAINED_CONNECTIONS = new Set(["slow-2g", "2g"]);

export function selectAtmosphereMode({
  reducedMotion,
  webgl2Available,
  saveData,
  effectiveType,
  hardwareConcurrency,
  deviceMemory,
}: AtmosphereCapability): AtmosphereMode {
  if (reducedMotion || !webgl2Available) {
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
