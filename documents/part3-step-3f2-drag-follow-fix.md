# 3F.2 follow-up — drag visual + /ls hero clip

## Bug 1 — finger-follow invisible (pane change still worked)

**Root cause:** Live follow used `setDragDx` → React re-render of `GlitchPane` + full pane content on every `pointermove`. On a real phone those renders cannot keep up, so intermediate frames never paint. Release still worked because `lastDx` lived in the listener and `onDragEnd` → `commitIntent` did not need painted intermediates.

Secondary conflict: mobile fade path sets `style.transform: undefined` on `.liquid-glass-stage-card`, so any React re-render would also wipe an imperative transform on that same node.

**Not the primary cause:** `transform: undefined` alone (wiring looked fine); focus/transform merge on paper was a red herring for the “no frames at all” symptom — the setState hot path was.

**Fix:**
- Write `translate3d` / rotate on an outer `.mycelia-card-drag-layer` via imperative DOM helpers (`cardDragTransform.ts`) during move/fling/spring — no setState per move.
- `setPointerCapture` on that layer so moves keep flowing.
- Keep single-fire release → fling → `commitIntent` once.

**Still needs Jeremy’s phone** before 3F.2 is considered verified.

## Bug 2 — /ls first card top clipped

**Focus hypothesis:** Ruled out for initial `/ls` load. The hero pane has no `id`; F3 `focus({ preventScroll: true })` only runs after hash jumps (`#access` / `#experience`).

**Actual cause:** `.liquid-glass-sticky-stage { place-items: center }` vertically centered a card taller than the stage inside `.mycelia-card-stage-root { overflow: hidden }`, clipping the top. In-card scroll cannot reveal chrome that is already outside the clipped stage.

**Fix (≤767):** `place-items: start center` so the card pins to the top; in-card overflow scrolls the rest. Also reset scrollport `scrollTop` to 0 after a successful drag-dismiss pane change.
