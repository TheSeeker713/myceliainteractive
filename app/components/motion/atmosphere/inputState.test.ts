import { describe, expect, it } from "vitest";
import { normalizePointerInput, normalizeScrollInput } from "./inputState";

describe("normalizeScrollInput", () => {
  it("returns zero progress when the page cannot scroll", () => {
    expect(
      normalizeScrollInput({
        scrollY: 120,
        previousScrollY: 100,
        viewportHeight: 800,
        scrollHeight: 800,
      }),
    ).toEqual({ scroll: 0, scrollVelocity: 0.025 });
  });

  it("maps mid-document scroll to halfway progress", () => {
    expect(
      normalizeScrollInput({
        scrollY: 400,
        previousScrollY: 400,
        viewportHeight: 800,
        scrollHeight: 1600,
      }),
    ).toEqual({ scroll: 0.5, scrollVelocity: 0 });
  });

  it("clamps extreme scroll velocity", () => {
    expect(
      normalizeScrollInput({
        scrollY: 3000,
        previousScrollY: 0,
        viewportHeight: 800,
        scrollHeight: 5000,
      }).scrollVelocity,
    ).toBe(2);
  });
});

describe("normalizePointerInput", () => {
  it("converts top-left client coordinates into bottom-up WebGL space", () => {
    expect(
      normalizePointerInput({
        clientX: 400,
        clientY: 200,
        previousClientX: 400,
        previousClientY: 200,
        viewportWidth: 800,
        viewportHeight: 800,
      }),
    ).toEqual({
      pointerX: 0.5,
      pointerY: 0.75,
      pointerVelocityX: 0,
      pointerVelocityY: 0,
    });
  });

  it("reports pointer velocity relative to the viewport", () => {
    expect(
      normalizePointerInput({
        clientX: 480,
        clientY: 160,
        previousClientX: 400,
        previousClientY: 200,
        viewportWidth: 800,
        viewportHeight: 800,
      }),
    ).toEqual({
      pointerX: 0.6,
      pointerY: 0.8,
      pointerVelocityX: 0.1,
      pointerVelocityY: 0.05,
    });
  });
});
