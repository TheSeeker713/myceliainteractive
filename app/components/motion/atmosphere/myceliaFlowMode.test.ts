import { describe, expect, it } from "vitest";
import { selectMyceliaFlowMode } from "./myceliaFlowMode";

const CAPABLE = {
  reduceMotionOptIn: false,
  webgl2Available: true,
  saveData: false,
  effectiveType: "4g",
  hardwareConcurrency: 8,
  deviceMemory: 8,
} as const;

describe("selectMyceliaFlowMode", () => {
  it("defaults capable devices to full video-shader motion", () => {
    expect(selectMyceliaFlowMode(CAPABLE)).toBe("full");
  });

  it("uses static only when Reduce motion is opted in", () => {
    expect(
      selectMyceliaFlowMode({ ...CAPABLE, reduceMotionOptIn: true }),
    ).toBe("static");
  });

  it("falls back to static when WebGL2 is unavailable", () => {
    expect(
      selectMyceliaFlowMode({ ...CAPABLE, webgl2Available: false }),
    ).toBe("static");
  });

  it("uses lite for constrained devices without forcing static", () => {
    expect(selectMyceliaFlowMode({ ...CAPABLE, saveData: true })).toBe("lite");
  });
});
