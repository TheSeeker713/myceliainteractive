import { describe, expect, it } from "vitest";
import {
  getCardCycleState,
  getCardFromScrollProgress,
  getReducedMotionCardCycleState,
} from "./cardCycle";

describe("getCardFromScrollProgress", () => {
  it("maps the start of the page to the first card", () => {
    expect(getCardFromScrollProgress(0, 4)).toEqual({ index: 0, localT: 0 });
  });

  it("maps mid-page scroll into the correct card and local progress", () => {
    expect(getCardFromScrollProgress(0.375, 4)).toEqual({
      index: 1,
      localT: 0.5,
    });
  });

  it("clamps the end of the page to the final card", () => {
    expect(getCardFromScrollProgress(1, 4)).toEqual({ index: 3, localT: 1 });
  });
});

describe("getCardCycleState", () => {
  it("shows the hero card immediately when startVisible is set", () => {
    expect(getCardCycleState(0, { startVisible: true })).toEqual({
      phase: "hold",
      opacity: 1,
      glitch: 0,
    });
  });

  it("keeps later cards empty in the early buffer", () => {
    expect(getCardCycleState(0.01)).toMatchObject({
      phase: "buffer",
      opacity: 0,
    });
  });

  it("materializes later cards with high glitch that resolves", () => {
    const state = getCardCycleState(0.1);
    expect(state.phase).toBe("materialize");
    expect(state.opacity).toBeGreaterThan(0);
    expect(state.opacity).toBeLessThan(1);
    expect(state.glitch).toBeGreaterThan(0);
  });

  it("holds a stable card before dissolving", () => {
    expect(getCardCycleState(0.15, { startVisible: true })).toEqual({
      phase: "hold",
      opacity: 1,
      glitch: 0,
    });
  });

  it("dissolves with rising glitch instead of physical shatter", () => {
    const dissolve = getCardCycleState(0.52, { startVisible: true });
    expect(dissolve.phase).toBe("dissolve");
    expect(dissolve.glitch).toBeGreaterThan(0.4);
    expect(dissolve.glitch).toBeLessThanOrEqual(1);
  });

  it("returns to an empty buffer after fade-out", () => {
    expect(getCardCycleState(0.96, { startVisible: true })).toMatchObject({
      phase: "buffer",
      opacity: 0,
      glitch: 1,
    });
  });
});

describe("getReducedMotionCardCycleState", () => {
  it("shows the hero card immediately when startVisible is set", () => {
    expect(getReducedMotionCardCycleState(0, { startVisible: true })).toEqual({
      phase: "hold",
      opacity: 1,
      glitch: 0,
    });
  });

  it("never drives glitch", () => {
    const midFadeOut = getReducedMotionCardCycleState(0.72, {
      startVisible: true,
    });
    expect(midFadeOut.glitch).toBe(0);
  });

  it("eases later cards in instead of snapping on", () => {
    const fadeIn = getReducedMotionCardCycleState(0.16);
    expect(fadeIn.phase).toBe("materialize");
    expect(fadeIn.opacity).toBeGreaterThan(0);
    expect(fadeIn.opacity).toBeLessThan(1);
    expect(fadeIn.glitch).toBe(0);
  });

  it("holds at full opacity between fades", () => {
    expect(getReducedMotionCardCycleState(0.4, { startVisible: true })).toEqual(
      {
        phase: "hold",
        opacity: 1,
        glitch: 0,
      },
    );
  });

  it("eases out instead of snapping off", () => {
    const fadeOut = getReducedMotionCardCycleState(0.72, {
      startVisible: true,
    });
    expect(fadeOut.phase).toBe("fade-out");
    expect(fadeOut.opacity).toBeGreaterThan(0);
    expect(fadeOut.opacity).toBeLessThan(1);
  });

  it("ends in an empty buffer after fade-out", () => {
    expect(
      getReducedMotionCardCycleState(0.95, { startVisible: true }),
    ).toMatchObject({
      phase: "buffer",
      opacity: 0,
      glitch: 0,
    });
  });
});
