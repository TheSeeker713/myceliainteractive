/**
 * Bridge tilt (and other external drivers) into the same pointer channels
 * MyceliaFlowAtmosphere already uses — no parallel shader/input system.
 */

export type AtmospherePointerSample = {
  clientX: number;
  clientY: number;
};

type AtmospherePointerListener = (sample: AtmospherePointerSample) => void;

const listeners = new Set<AtmospherePointerListener>();

export function subscribeAtmospherePointer(
  listener: AtmospherePointerListener,
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function pushAtmospherePointer(sample: AtmospherePointerSample): void {
  for (const listener of listeners) {
    try {
      listener(sample);
    } catch (error) {
      console.error(
        "[mycelia:mobile] atmosphere pointer bridge listener failed",
        error,
      );
    }
  }
}
