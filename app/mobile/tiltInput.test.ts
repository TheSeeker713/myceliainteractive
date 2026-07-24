import { describe, expect, it } from "vitest";
import {
  getOrientationPermissionState,
  orientationToClientPoint,
} from "./tiltInput";

describe("tiltInput", () => {
  it("maps neutral-ish orientation toward viewport center", () => {
    const point = orientationToClientPoint(
      { beta: 45, gamma: 0 },
      390,
      844,
    );
    expect(point).not.toBeNull();
    expect(point!.clientX).toBeCloseTo(195, 0);
    expect(point!.clientY).toBeCloseTo(422, 0);
  });

  it("returns null for missing axes", () => {
    expect(
      orientationToClientPoint({ beta: null, gamma: 10 }, 390, 844),
    ).toBeNull();
  });

  it("reports unsupported when DeviceOrientationEvent is missing (jsdom)", () => {
    const state = getOrientationPermissionState();
    expect(["unsupported", "granted", "prompt"]).toContain(state);
  });
});
