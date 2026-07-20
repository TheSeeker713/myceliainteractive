import { describe, expect, it } from "vitest";
import {
  accumulateMobileScrollDelta,
  canScrollStageContent,
  isMobileStageBlockedTarget,
  shouldAdvanceFromScrollDelta,
} from "./cardStageMobileScroll";

function port(scrollTop: number, scrollHeight: number, clientHeight: number) {
  return { scrollTop, scrollHeight, clientHeight };
}

describe("cardStageMobileScroll", () => {
  it("treats non-overflowing ports as already at edge", () => {
    const short = port(0, 100, 100);
    expect(canScrollStageContent(short, 1)).toBe(false);
    expect(canScrollStageContent(short, -1)).toBe(false);
    expect(shouldAdvanceFromScrollDelta(short, 1)).toBe(true);
  });

  it("allows native scroll until the bottom/top edge", () => {
    const mid = port(40, 400, 200);
    expect(canScrollStageContent(mid, 1)).toBe(true);
    expect(canScrollStageContent(mid, -1)).toBe(true);
    expect(shouldAdvanceFromScrollDelta(mid, 1)).toBe(false);

    const bottom = port(200, 400, 200);
    expect(canScrollStageContent(bottom, 1)).toBe(false);
    expect(shouldAdvanceFromScrollDelta(bottom, 1)).toBe(true);
    expect(canScrollStageContent(bottom, -1)).toBe(true);

    const top = port(0, 400, 200);
    expect(canScrollStageContent(top, -1)).toBe(false);
    expect(shouldAdvanceFromScrollDelta(top, -1)).toBe(true);
  });

  it("resets accumulation when scroll direction flips", () => {
    expect(accumulateMobileScrollDelta(30, 10)).toBe(40);
    expect(accumulateMobileScrollDelta(30, -5)).toBe(-5);
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
