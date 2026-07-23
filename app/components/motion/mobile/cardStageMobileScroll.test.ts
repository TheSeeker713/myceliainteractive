import { describe, expect, it } from "vitest";
import {
  canScrollStageContent,
  classifySwipeAxis,
  isMobileStageBlockedTarget,
  paneDirectionFromHorizontalDelta,
  shouldAcceptHorizontalSwipe,
} from "./cardStageMobileScroll";

function port(scrollTop: number, scrollHeight: number, clientHeight: number) {
  return { scrollTop, scrollHeight, clientHeight };
}

describe("cardStageMobileScroll", () => {
  it("treats non-overflowing ports as already at edge", () => {
    const short = port(0, 100, 100);
    expect(canScrollStageContent(short, 1)).toBe(false);
    expect(canScrollStageContent(short, -1)).toBe(false);
  });

  it("allows native scroll until the bottom/top edge", () => {
    const mid = port(40, 400, 200);
    expect(canScrollStageContent(mid, 1)).toBe(true);
    expect(canScrollStageContent(mid, -1)).toBe(true);

    const bottom = port(200, 400, 200);
    expect(canScrollStageContent(bottom, 1)).toBe(false);
    expect(canScrollStageContent(bottom, -1)).toBe(true);

    const top = port(0, 400, 200);
    expect(canScrollStageContent(top, -1)).toBe(false);
    expect(canScrollStageContent(top, 1)).toBe(true);
  });

  it("ignores non-element targets (DOM closest checks covered at runtime)", () => {
    expect(isMobileStageBlockedTarget(null)).toBe(false);
    expect(isMobileStageBlockedTarget("input" as unknown as EventTarget)).toBe(
      false,
    );
    expect(
      isMobileStageBlockedTarget({ tagName: "INPUT" } as unknown as EventTarget),
    ).toBe(false);
  });
});

describe("horizontal swipe helpers (3E.2)", () => {
  it("classifies dominant axis with ratio lock", () => {
    expect(classifySwipeAxis(50, 10)).toBe("horizontal");
    expect(classifySwipeAxis(10, 50)).toBe("vertical");
    expect(classifySwipeAxis(3, 3)).toBe("undecided");
    expect(classifySwipeAxis(40, 35)).toBe("undecided");
  });

  it("maps left swipe to next and right swipe to previous", () => {
    expect(paneDirectionFromHorizontalDelta(-80)).toBe(1);
    expect(paneDirectionFromHorizontalDelta(80)).toBe(-1);
    expect(paneDirectionFromHorizontalDelta(0)).toBeNull();
  });

  it("rejects vertical and under-threshold horizontal motion", () => {
    expect(shouldAcceptHorizontalSwipe(10, 80)).toBeNull();
    expect(shouldAcceptHorizontalSwipe(-40, 5)).toBeNull();
  });

  it("accepts horizontal distance past threshold once", () => {
    expect(shouldAcceptHorizontalSwipe(-64, 5)).toBe(1);
    expect(shouldAcceptHorizontalSwipe(64, -4)).toBe(-1);
  });

  it("accepts a short flick via velocity escape", () => {
    expect(
      shouldAcceptHorizontalSwipe(-45, 4, { elapsedMs: 60 }),
    ).toBe(1);
    expect(
      shouldAcceptHorizontalSwipe(-45, 4, { elapsedMs: 200 }),
    ).toBeNull();
  });
});
