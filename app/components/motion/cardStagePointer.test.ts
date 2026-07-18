import { describe, expect, it } from "vitest";
import {
  isPointInsideRect,
  shouldCaptureStageScroll,
} from "./cardStagePointer";

const card = { left: 100, top: 100, right: 500, bottom: 400 };

describe("isPointInsideRect", () => {
  it("returns false when rect is missing", () => {
    expect(isPointInsideRect({ clientX: 200, clientY: 200 }, null)).toBe(
      false,
    );
  });

  it("returns true for points inside the rect", () => {
    expect(isPointInsideRect({ clientX: 200, clientY: 200 }, card)).toBe(true);
    expect(isPointInsideRect({ clientX: 100, clientY: 100 }, card)).toBe(true);
    expect(isPointInsideRect({ clientX: 500, clientY: 400 }, card)).toBe(true);
  });

  it("returns false for points outside the rect", () => {
    expect(isPointInsideRect({ clientX: 99, clientY: 200 }, card)).toBe(false);
    expect(isPointInsideRect({ clientX: 200, clientY: 401 }, card)).toBe(
      false,
    );
  });
});

describe("shouldCaptureStageScroll", () => {
  it("captures only when the pointer is outside the card", () => {
    expect(
      shouldCaptureStageScroll({ clientX: 50, clientY: 50 }, card),
    ).toBe(true);
    expect(
      shouldCaptureStageScroll({ clientX: 250, clientY: 250 }, card),
    ).toBe(false);
  });

  it("captures when there is no card rect (safe fallback)", () => {
    expect(
      shouldCaptureStageScroll({ clientX: 250, clientY: 250 }, null),
    ).toBe(true);
  });
});
