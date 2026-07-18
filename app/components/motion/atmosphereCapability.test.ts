import { describe, expect, it } from "vitest";
import { selectAtmosphereMode } from "./atmosphereCapability";

const CAPABLE_DEVICE = {
  reducedMotion: false,
  webgl2Available: true,
  saveData: false,
  effectiveType: "4g",
  hardwareConcurrency: 8,
  deviceMemory: 8,
} as const;

describe("selectAtmosphereMode", () => {
  it("uses the full profile on a capable device", () => {
    expect(selectAtmosphereMode(CAPABLE_DEVICE)).toBe("full");
  });

  it("uses the static poster when reduced motion is requested", () => {
    expect(
      selectAtmosphereMode({ ...CAPABLE_DEVICE, reducedMotion: true }),
    ).toBe("static");
  });

  it("uses the static poster when WebGL2 is unavailable", () => {
    expect(
      selectAtmosphereMode({ ...CAPABLE_DEVICE, webgl2Available: false }),
    ).toBe("static");
  });

  it.each([
    ["Save-Data", { saveData: true }],
    ["slow 2G", { effectiveType: "slow-2g" }],
    ["2G", { effectiveType: "2g" }],
    ["two logical processors", { hardwareConcurrency: 2 }],
    ["one GiB of memory", { deviceMemory: 1 }],
  ])("uses the lite profile for %s", (_label, constrainedInput) => {
    expect(
      selectAtmosphereMode({ ...CAPABLE_DEVICE, ...constrainedInput }),
    ).toBe("lite");
  });

  it("does not classify 3G alone as constrained", () => {
    expect(
      selectAtmosphereMode({ ...CAPABLE_DEVICE, effectiveType: "3g" }),
    ).toBe("full");
  });

  it("treats unavailable optional signals as non-constraining", () => {
    expect(
      selectAtmosphereMode({
        reducedMotion: false,
        webgl2Available: true,
      }),
    ).toBe("full");
  });
});
