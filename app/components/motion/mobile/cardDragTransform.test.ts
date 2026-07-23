import { describe, expect, it } from "vitest";
import {
  applyCardDragTransform,
  clearCardDragTransform,
} from "./cardDragTransform";

describe("cardDragTransform", () => {
  it("writes translate3d(dx, dy) + rotate and clears cleanly", () => {
    const style: Record<string, string> = {
      transition: "",
      transform: "",
    };
    const el = { style } as unknown as HTMLElement;

    applyCardDragTransform(el, -80, 40, 400, 800, false);
    expect(style.transition).toBe("none");
    expect(style.transform).toContain("translate3d(-80px, 40px, 0)");
    expect(style.transform).toContain("rotate(");

    applyCardDragTransform(el, 0, 0, 400, 800, true);
    expect(style.transition).toContain("220ms");
    expect(style.transform).toContain("translate3d(0px, 0px, 0)");

    clearCardDragTransform(el);
    expect(style.transition).toBe("none");
    expect(style.transform).toBe("");
  });
});
