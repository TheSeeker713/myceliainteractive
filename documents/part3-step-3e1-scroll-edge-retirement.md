# Part 3 Step 3E.1 — Scroll-edge advance retirement

## Status

- **3E.0b:** Confirmed improved on Jeremy’s real device — closed.
- **3E.1:** Diagnosis recorded; mobile scroll-to-edge pane advance **retired** in code.
- **3E.2:** Horizontal swipe left/right → `commitIntent` with gesture-level single-fire lock; `touch-action: pan-y` on the stage scrollport. Vertical scroll never advances panes.

## Process note (future)

When a step retires the only usable mechanism for a live feature and a later step is the replacement, do **not** split them into separately approved/pushed steps if that leaves production degraded. Flag the risk in planning and ship as one atomic change, or fast-track replacement immediately (as 3E.2 was after 3E.1).

## Real-device bug (multi-advance)

On a physical phone, a single finger flick advanced **~3 cards** instead of one. Same class of failure previously fixed on desktop wheel: rapid burst inputs crossing a threshold multiple times before / across the animation lock.

## Root cause (code)

In `attachCardStageMobileListeners.ts` (Part 3B.2), `onTouchMove` did the following when the in-card scrollport was already at the scroll edge:

1. Compare `|deltaY|` against `MOBILE_SCROLL_ADVANCE_THRESHOLD_PX` (48).
2. Call `commitIntent(direction)` (→ `applyScrollIntent`).
3. **Re-anchor** `touchStartY = touch.clientY`.

That re-anchor reset the gesture baseline after every commit. Continued motion in the same flick could cross 48px again and fire another `commitIntent`. `applyScrollIntent` only queues one `pendingDirection` while `status !== "holding"`; once a short mobile fade settles back to `holding` mid-gesture, the next segment starts another full step — so one flick yields 2–3 panes.

Wheel path had a similar accumulate-then-commit pattern past the scroll edge.

## Retirement (this step)

The scroll-to-edge → advance model is **not tuned**; it is **retired** for mobile:

- Vertical swipe/scroll must **only** scroll the current card’s content.
- It must **never** trigger a pane change at any scroll position or edge.
- `attachCardStageMobileListeners` no longer registers wheel/touch handlers that call `commitIntent`.
- Helpers used solely for edge-advance (`shouldAdvanceFromScrollDelta`, `accumulateMobileScrollDelta`, `MOBILE_SCROLL_ADVANCE_THRESHOLD_PX`) are removed.
- `canScrollStageContent` remains for desktop/shared keyboard edge checks until 3E.3.
- `isMobileStageBlockedTarget` remains for 3E.2 swipe wiring.

## Planned replacement (3E.2 / 3F.2)

- **3E.2:** Discrete horizontal swipe → `commitIntent` (superseded by 3F.2).
- **3F.2:** Drag-follow with 35% visual-viewport dismiss threshold; fling off-screen then `commitIntent` once; spring back if short; axis lock preserves vertical scroll.

## Verification note

Emulation is not mobile verification. Multi-advance and the eventual swipe model require Jeremy’s real-device confirmation after 3E.2+.
