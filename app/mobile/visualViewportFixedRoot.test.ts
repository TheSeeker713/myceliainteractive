import { describe, expect, it } from "vitest";
import {
  applyVisualViewportBox,
  readVisualViewportBox,
} from "./visualViewportFixedRoot";

describe("readVisualViewportBox", () => {
  it("returns null when visualViewport is missing", () => {
    expect(readVisualViewportBox(null)).toBeNull();
    expect(readVisualViewportBox(undefined)).toBeNull();
  });

  it("reads offset and size from a visualViewport-like object", () => {
    expect(
      readVisualViewportBox({
        offsetTop: 12,
        offsetLeft: -8,
        width: 390,
        height: 700,
      }),
    ).toEqual({ top: 12, left: -8, width: 390, height: 700 });
  });

  it("returns null for non-finite or non-positive size", () => {
    expect(
      readVisualViewportBox({
        offsetTop: 0,
        offsetLeft: 0,
        width: 0,
        height: 700,
      }),
    ).toBeNull();
    expect(
      readVisualViewportBox({
        offsetTop: Number.NaN,
        offsetLeft: 0,
        width: 390,
        height: 700,
      }),
    ).toBeNull();
  });
});

describe("applyVisualViewportBox", () => {
  it("sets fixed geometry and clears on null", () => {
    const style: Record<string, string> = {
      top: "",
      left: "",
      width: "",
      height: "",
      right: "",
      bottom: "",
    };
    const el = { style } as unknown as HTMLElement;

    applyVisualViewportBox(el, {
      top: 10,
      left: 20,
      width: 300,
      height: 500,
    });
    expect(style.top).toBe("10px");
    expect(style.left).toBe("20px");
    expect(style.width).toBe("300px");
    expect(style.height).toBe("500px");
    expect(style.right).toBe("auto");
    expect(style.bottom).toBe("auto");

    applyVisualViewportBox(el, null);
    expect(style.top).toBe("");
    expect(style.left).toBe("");
    expect(style.width).toBe("");
    expect(style.height).toBe("");
    expect(style.right).toBe("");
    expect(style.bottom).toBe("");
  });
});
