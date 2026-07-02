import { describe, expect, it } from "vitest";
import { getHashSectionScrollTop } from "./useHashScrollToSection";
import { getScrollProgressFromSection, getViewportRatio } from "./useSectionFade";

// Regression coverage for the getScrollProgressFromSection argument-order bug.
// The hook previously called getScrollProgressFromSection(sectionIndex,
// sectionCount, ratio) — three args against a (sectionIndex, localT,
// sectionCount, viewportRatio) signature — which computed the wrong scroll
// target. getHashSectionScrollTop encapsulates the corrected call.
describe("getHashSectionScrollTop", () => {
  const SECTION_COUNT = 11; // Hero..Contact on the motion homepage
  const INNER_H = 900;
  const HEADER_H = 76;
  const PROJECTS_INDEX = 4;
  const ROADMAP_INDEX = 8;

  it("lands the Projects section at its correct scroll offset", () => {
    // ratio = (900-76)/900 = 206/225; span = 11 - 206/225 = 2269/225
    // progress = 4 / (2269/225) = 900/2269; top = progress * (11*900 - 900)
    expect(
      getHashSectionScrollTop(PROJECTS_INDEX, SECTION_COUNT, INNER_H, HEADER_H),
    ).toBeCloseTo(3569.85, 1);
  });

  it("lands the Roadmap section at its correct scroll offset", () => {
    expect(
      getHashSectionScrollTop(ROADMAP_INDEX, SECTION_COUNT, INNER_H, HEADER_H),
    ).toBeCloseTo(7139.71, 1);
  });

  it("matches the correctly-ordered getScrollProgressFromSection call", () => {
    const ratio = getViewportRatio(INNER_H, HEADER_H, 100);
    const totalHeight = SECTION_COUNT * INNER_H;
    const expected =
      getScrollProgressFromSection(PROJECTS_INDEX, 0, SECTION_COUNT, ratio) *
      (totalHeight - INNER_H);

    expect(
      getHashSectionScrollTop(PROJECTS_INDEX, SECTION_COUNT, INNER_H, HEADER_H),
    ).toBeCloseTo(expected, 5);
  });

  it("does not reproduce the old three-argument (swapped) result", () => {
    const ratio = getViewportRatio(INNER_H, HEADER_H, 100);
    const totalHeight = SECTION_COUNT * INNER_H;
    // The old call passed (sectionIndex, sectionCount, ratio). Because
    // viewportRatio is optional this type-checks, but sectionCount lands in
    // localT and ratio (< 1) lands in sectionCount, which collapses the
    // scrollable span to 0 and yields a top of 0 instead of the real offset.
    const buggyTop =
      getScrollProgressFromSection(PROJECTS_INDEX, SECTION_COUNT, ratio) *
      (totalHeight - INNER_H);
    const correctTop = getHashSectionScrollTop(
      PROJECTS_INDEX,
      SECTION_COUNT,
      INNER_H,
      HEADER_H,
    );

    expect(buggyTop).toBe(0);
    expect(correctTop).not.toBeCloseTo(buggyTop, 1);
  });

  it("returns 0 for degenerate inputs", () => {
    expect(getHashSectionScrollTop(0, 0, INNER_H, HEADER_H)).toBe(0);
    expect(getHashSectionScrollTop(-1, SECTION_COUNT, INNER_H, HEADER_H)).toBe(0);
    expect(getHashSectionScrollTop(PROJECTS_INDEX, SECTION_COUNT, 0, HEADER_H)).toBe(
      0,
    );
  });
});
