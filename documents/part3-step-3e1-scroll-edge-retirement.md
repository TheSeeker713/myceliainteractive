# Part 3 Step 3E.1 — Scroll-edge advance retirement

## Status

- **3E.0b:** Confirmed improved on Jeremy’s real device — closed.
- **3E.1:** Diagnosis recorded; mobile scroll-to-edge pane advance **retired** in code.
- **3E.2+:** Not started — awaiting separate approval. Until horizontal swipe lands, mobile pane change is keyboard Arrow/Page only (shared `commitIntent` → `applyScrollIntent`). Desktop wheel/touch/glitch unchanged.

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

## Planned replacement (3E.2+, not in this commit)

- Horizontal swipe left → next pane; right → previous pane.
- Route through the same `commitIntent` → `applyScrollIntent` path as keyboard.
- Gesture-level single-fire lock (one commit per touch identity until `touchend`) plus distance/velocity threshold — do not port the old vertical re-anchor logic.
- 3E.4 affordance: low-opacity directional **arrows** on the left and right edges of the card (`aria-hidden`), shown until the first successful swipe in the session (`sessionStorage`), then fade out.

## Verification note

Emulation is not mobile verification. Multi-advance and the eventual swipe model require Jeremy’s real-device confirmation after 3E.2+.
