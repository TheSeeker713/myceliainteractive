import { describe, expect, it } from "vitest";
import {
  accumulateWheelDelta,
  advanceScrollMachine,
  applyScrollIntent,
  createScrollMachineState,
  getCycleForScrollMachine,
  WHEEL_TRIGGER_THRESHOLD_PX,
} from "./cardScrollMachine";

describe("accumulateWheelDelta", () => {
  it("sums deltas in the same direction", () => {
    expect(accumulateWheelDelta(40, 40)).toBe(80);
  });

  it("resets when the scroll direction flips", () => {
    expect(accumulateWheelDelta(40, -20)).toBe(-20);
  });
});

describe("applyScrollIntent", () => {
  it("starts a forward transition from hold when a next card exists", () => {
    const next = applyScrollIntent(createScrollMachineState(0), 1, 4);
    expect(next).toMatchObject({
      status: "playing-forward",
      cardIndex: 0,
      transitionProgress: 0,
      pendingDirection: null,
    });
  });

  it("ignores forward intent at the last card while holding", () => {
    const state = createScrollMachineState(3);
    expect(applyScrollIntent(state, 1, 4)).toEqual(state);
  });

  it("queues one pending direction while a transition is playing", () => {
    const playing = applyScrollIntent(createScrollMachineState(1), 1, 4);
    const queued = applyScrollIntent(playing, -1, 4);
    expect(queued.status).toBe("playing-forward");
    expect(queued.pendingDirection).toBe(-1);
  });

  it("replaces the pending direction instead of stacking", () => {
    const playing = applyScrollIntent(createScrollMachineState(1), 1, 4);
    const queuedUp = applyScrollIntent(playing, -1, 4);
    const replaced = applyScrollIntent(queuedUp, 1, 4);
    expect(replaced.pendingDirection).toBe(1);
  });
});

describe("advanceScrollMachine", () => {
  it("settles onto the next card after a forward transition completes", () => {
    const playing = applyScrollIntent(createScrollMachineState(0), 1, 4);
    const settled = advanceScrollMachine(playing, 10_000, 4, false);
    expect(settled).toMatchObject({
      status: "holding",
      cardIndex: 1,
      pendingDirection: null,
    });
  });

  it("plays a queued reverse step after the current transition finishes", () => {
    const playing = applyScrollIntent(createScrollMachineState(1), 1, 4);
    const queued = applyScrollIntent(playing, -1, 4);
    const after = advanceScrollMachine(queued, 10_000, 4, false);
    expect(after.status).toBe("playing-backward");
    expect(after.cardIndex).toBe(2);
  });
});

describe("getCycleForScrollMachine", () => {
  it("holds a stable card with no glitch", () => {
    const { cycle } = getCycleForScrollMachine(
      createScrollMachineState(0),
      false,
    );
    expect(cycle.phase).toBe("hold");
    expect(cycle.glitch).toBe(0);
    expect(cycle.opacity).toBe(1);
  });

  it("dissolves the outgoing card in the first half of a forward transition", () => {
    const playing = {
      ...applyScrollIntent(createScrollMachineState(0), 1, 4),
      transitionProgress: 0.25,
    };
    const { cardIndex, cycle } = getCycleForScrollMachine(playing, false);
    expect(cardIndex).toBe(0);
    expect(cycle.phase).toBe("dissolve");
    expect(cycle.glitch).toBeGreaterThan(0);
  });

  it("materializes the incoming card in the second half", () => {
    const playing = {
      ...applyScrollIntent(createScrollMachineState(0), 1, 4),
      transitionProgress: 0.75,
    };
    const { cardIndex, cycle } = getCycleForScrollMachine(playing, false);
    expect(cardIndex).toBe(1);
    expect(cycle.phase).toBe("materialize");
  });
});

describe("WHEEL_TRIGGER_THRESHOLD_PX", () => {
  it("is a normal single-gesture magnitude", () => {
    expect(WHEEL_TRIGGER_THRESHOLD_PX).toBeGreaterThanOrEqual(40);
    expect(WHEEL_TRIGGER_THRESHOLD_PX).toBeLessThanOrEqual(120);
  });
});
