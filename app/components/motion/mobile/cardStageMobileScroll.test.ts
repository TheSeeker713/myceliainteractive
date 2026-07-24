import { describe, expect, it } from "vitest";
import {
  canScrollStageContent,
  classifySwipeAxis,
  dragRotationDeg,
  flingTargetDx,
  isMobileStageBlockedTarget,
  paneDirectionFromHorizontalDelta,
  shouldDismissHorizontalDrag,
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

  it("blocks data-card-media targets so drag does not steal native save", () => {
    if (typeof document === "undefined") return;
    const wrap = document.createElement("div");
    wrap.setAttribute("data-card-media", "");
    const img = document.createElement("img");
    wrap.appendChild(img);
    document.body.appendChild(wrap);
    expect(isMobileStageBlockedTarget(img)).toBe(true);
    expect(isMobileStageBlockedTarget(wrap)).toBe(true);
    wrap.remove();
  });

  it("blocks anchors and buttons so drag capture cannot steal mailto/nav clicks", () => {
    if (typeof document === "undefined") return;
    const link = document.createElement("a");
    link.setAttribute("href", "mailto:contact@myceliainteractive.com");
    link.textContent = "email";
    const btn = document.createElement("button");
    btn.type = "button";
    document.body.append(link, btn);
    expect(isMobileStageBlockedTarget(link)).toBe(true);
    expect(isMobileStageBlockedTarget(btn)).toBe(true);
    link.remove();
    btn.remove();
  });
});

describe("horizontal drag-dismiss helpers (3F.2)", () => {
  it("classifies dominant axis with ratio lock", () => {
    expect(classifySwipeAxis(50, 10)).toBe("horizontal");
    expect(classifySwipeAxis(10, 50)).toBe("vertical");
    expect(classifySwipeAxis(3, 3)).toBe("undecided");
  });

  it("maps right drag to next and left drag to previous", () => {
    expect(paneDirectionFromHorizontalDelta(80)).toBe(1);
    expect(paneDirectionFromHorizontalDelta(-80)).toBe(-1);
  });

  it("dismisses at 35% of viewport width", () => {
    expect(shouldDismissHorizontalDrag(100, 390)).toBeNull();
    expect(shouldDismissHorizontalDrag(137, 390)).toBe(1);
    expect(shouldDismissHorizontalDrag(-137, 390)).toBe(-1);
  });

  it("computes fling targets and 2D rotation", () => {
    expect(flingTargetDx(1, 390)).toBe(390);
    expect(flingTargetDx(-1, 390)).toBe(-390);
    expect(dragRotationDeg(195, 0, 390, 844)).toBeCloseTo(4);
    expect(dragRotationDeg(390, 0, 390, 844)).toBeCloseTo(8);
    expect(dragRotationDeg(0, 422, 390, 844)).toBeCloseTo(1.6);
  });
});
