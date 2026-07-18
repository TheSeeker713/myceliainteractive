import { describe, expect, it } from "vitest";
import { getCanvasBackingSize, shouldRenderFrame } from "./webglRenderer";

describe("getCanvasBackingSize", () => {
  it("caps a high-density display at the profile limit", () => {
    expect(getCanvasBackingSize(1280, 720, 2, 1.5)).toEqual({
      width: 1920,
      height: 1080,
      pixelRatio: 1.5,
    });
  });

  it("keeps lite rendering at one backing pixel per CSS pixel", () => {
    expect(getCanvasBackingSize(1024, 768, 2, 1)).toEqual({
      width: 1024,
      height: 768,
      pixelRatio: 1,
    });
  });

  it("protects against invalid or zero dimensions", () => {
    expect(getCanvasBackingSize(0, 0, Number.NaN, 1.5)).toEqual({
      width: 1,
      height: 1,
      pixelRatio: 1,
    });
  });
});

describe("shouldRenderFrame", () => {
  it("always permits the initial frame", () => {
    expect(shouldRenderFrame(10, 0, 1000 / 30)).toBe(true);
  });

  it("holds a frame until the profile interval elapses", () => {
    expect(shouldRenderFrame(20, 10, 1000 / 60)).toBe(false);
    expect(shouldRenderFrame(27, 10, 1000 / 60)).toBe(true);
  });
});
