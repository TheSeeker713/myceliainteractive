import { describe, expect, it } from "vitest";
import { computeVideoCamera } from "./videoCamera";

describe("computeVideoCamera", () => {
  it("is identity-ish at center rest", () => {
    const camera = computeVideoCamera({
      pointerX: 0.5,
      pointerY: 0.5,
      scroll: 0.5,
      scrollVelocity: 0,
    });
    expect(camera.cameraOffsetX).toBeCloseTo(0, 5);
    expect(camera.cameraOffsetY).toBeCloseTo(0, 5);
    expect(camera.cameraZoom).toBeGreaterThanOrEqual(1);
    expect(camera.cameraZoom).toBeLessThan(1.05);
  });

  it("pans with pointer away from center", () => {
    const camera = computeVideoCamera({
      pointerX: 1,
      pointerY: 0,
      scroll: 0.5,
      scrollVelocity: 0,
    });
    expect(camera.cameraOffsetX).toBeGreaterThan(0);
    expect(camera.cameraOffsetY).toBeLessThan(0);
  });

  it("zooms slightly with scroll progress and velocity", () => {
    const rest = computeVideoCamera({
      pointerX: 0.5,
      pointerY: 0.5,
      scroll: 0,
      scrollVelocity: 0,
    });
    const moving = computeVideoCamera({
      pointerX: 0.5,
      pointerY: 0.5,
      scroll: 1,
      scrollVelocity: 1,
    });
    expect(moving.cameraZoom).toBeGreaterThan(rest.cameraZoom);
    expect(moving.cameraZoom).toBeLessThanOrEqual(1.08);
  });
});
