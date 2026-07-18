import {
  getCardCycleState,
  getReducedMotionCardCycleState,
  type CardCycleState,
} from "./cardCycle";

export type ScrollMachineStatus =
  | "holding"
  | "playing-forward"
  | "playing-backward";

export type ScrollMachineState = {
  status: ScrollMachineStatus;
  cardIndex: number;
  /** 0–1 progress through the active transition; unused while holding. */
  transitionProgress: number;
  /** At most one queued direction after the in-flight transition finishes. */
  pendingDirection: 1 | -1 | null;
};

export const WHEEL_TRIGGER_THRESHOLD_PX = 72;
export const FORWARD_TRANSITION_MS = 1450;
export const BACKWARD_TRANSITION_MS = 1450;
export const REDUCED_FORWARD_TRANSITION_MS = 900;
export const REDUCED_BACKWARD_TRANSITION_MS = 900;

export function createScrollMachineState(
  cardIndex = 0,
): ScrollMachineState {
  return {
    status: "holding",
    cardIndex,
    transitionProgress: 0,
    pendingDirection: null,
  };
}

export function accumulateWheelDelta(
  accumulated: number,
  deltaY: number,
): number {
  // Reset accumulation when direction flips so a wiggle doesn't trip early.
  if (accumulated !== 0 && Math.sign(accumulated) !== Math.sign(deltaY)) {
    return deltaY;
  }
  return accumulated + deltaY;
}

/**
 * Apply a scroll-direction intent.
 * - While holding: start a transition if a neighbor exists.
 * - While playing: ignore same-direction spam; queue at most one opposite
 *   (or same) pending step to run after the current animation finishes.
 */
export function applyScrollIntent(
  state: ScrollMachineState,
  direction: 1 | -1,
  cardCount: number,
): ScrollMachineState {
  if (state.status !== "holding") {
    return {
      ...state,
      pendingDirection: direction,
    };
  }

  const nextIndex = state.cardIndex + direction;
  if (nextIndex < 0 || nextIndex >= cardCount) {
    return state;
  }

  return {
    ...state,
    status: direction === 1 ? "playing-forward" : "playing-backward",
    transitionProgress: 0,
    pendingDirection: null,
  };
}

export function advanceScrollMachine(
  state: ScrollMachineState,
  elapsedMs: number,
  cardCount: number,
  reduceMotion: boolean,
): ScrollMachineState {
  if (state.status === "holding") return state;

  const duration =
    state.status === "playing-forward"
      ? reduceMotion
        ? REDUCED_FORWARD_TRANSITION_MS
        : FORWARD_TRANSITION_MS
      : reduceMotion
        ? REDUCED_BACKWARD_TRANSITION_MS
        : BACKWARD_TRANSITION_MS;

  const nextProgress = Math.min(
    1,
    state.transitionProgress + elapsedMs / Math.max(duration, 1),
  );

  if (nextProgress < 1) {
    return { ...state, transitionProgress: nextProgress };
  }

  const direction = state.status === "playing-forward" ? 1 : -1;
  const settledIndex = Math.min(
    cardCount - 1,
    Math.max(0, state.cardIndex + direction),
  );

  let settled: ScrollMachineState = {
    status: "holding",
    cardIndex: settledIndex,
    transitionProgress: 0,
    pendingDirection: null,
  };

  if (state.pendingDirection !== null) {
    settled = applyScrollIntent(
      settled,
      state.pendingDirection,
      cardCount,
    );
  }

  return settled;
}

/**
 * Map machine progress onto existing cardCycle localT curves.
 * Forward: dissolve current, then materialize next.
 * Backward: dissolve current, then materialize previous.
 */
export function getCycleForScrollMachine(
  state: ScrollMachineState,
  reduceMotion: boolean,
): { cardIndex: number; cycle: CardCycleState } {
  const resolve = (localT: number, startVisible: boolean) =>
    reduceMotion
      ? getReducedMotionCardCycleState(localT, { startVisible })
      : getCardCycleState(localT, { startVisible });

  if (state.status === "holding") {
    return {
      cardIndex: state.cardIndex,
      cycle: resolve(0.2, state.cardIndex === 0),
    };
  }

  const p = state.transitionProgress;
  const outgoingIndex = state.cardIndex;
  const incomingIndex =
    state.status === "playing-forward"
      ? state.cardIndex + 1
      : state.cardIndex - 1;

  // First half: outgoing dissolve from mid-hold toward empty buffer.
  if (p < 0.5) {
    const localP = p / 0.5;
    const localT = 0.3 + localP * 0.7;
    return {
      cardIndex: outgoingIndex,
      cycle: resolve(localT, outgoingIndex === 0),
    };
  }

  // Second half: incoming materialize into hold.
  const localP = (p - 0.5) / 0.5;
  const localT = 0.05 + localP * 0.25;
  return {
    cardIndex: Math.max(0, incomingIndex),
    cycle: resolve(localT, incomingIndex === 0),
  };
}
