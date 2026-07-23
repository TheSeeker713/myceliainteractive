# 3F.2 follow-up — drag visual + /ls hero clip

## Bug 1 — finger-follow invisible (pane change still worked)

**Root cause:** Live follow used `setDragDx` → React re-render of `GlitchPane` + full pane content on every `pointermove`. On a real phone those renders cannot keep up, so intermediate frames never paint. Release still worked because `lastDx` lived in the listener and `onDragEnd` → `commitIntent` did not need painted intermediates.

**Fix:** Imperative `translate3d` on `.mycelia-card-drag-layer` + `setPointerCapture`.

## Bug 2 — /ls first card top clipped

**Focus hypothesis:** Ruled out for initial `/ls` load.

**Actual cause:** `place-items: center` + stage `overflow: hidden`.

**Fix (≤767):** `place-items: start center`.

## Bug 3 — ghost/flash between outgoing fling and incoming fade (confirmed)

**Hypothesis verified against code:** Yes.

1. One `.mycelia-card-drag-layer` wraps `GlitchPane`; React swaps pane children in place on the same node.
2. After the fling CSS transition (`CARD_DRAG_SETTLE_MS`), the handler called `commitIntent` and **immediately** `clearCardDragTransform` (`transition: none` + `transform: ''`) in the same turn.
3. At that moment the fade machine has just started (`transitionProgress ≈ 0`); content swap to the incoming pane only happens at `p ≥ 0.5`. So the outgoing card was still mounted when the layer snapped from off-screen back to center — exactly the visible ghost/flash.

**Fix:** Keep the off-screen transform after `commitIntent`. Clear it in the existing rAF tick only when `transitionProgress >= 0.5` (incoming content mounted / fade-in half). Safety timeout at `REDUCED_FORWARD_TRANSITION_MS` if mid-point never fires.

## Direction + free follow (this ship)

- `paneDirectionFromHorizontalDelta`: drag **right** → next, drag **left** → previous; fling targets match.
- While horizontally locked, apply real `dy` in `translate3d(dx, dy, 0)` and factor `dy` into `dragRotationDeg` (visual only; axis-lock / dismiss still horizontal).
