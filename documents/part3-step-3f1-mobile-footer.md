# Part 3 Step 3F.1 — Unstick mobile footer + stage height

## What changed

1. **Footer (≤767):** `position: static` via `max-md:static` + `.site-footer` rule. Desktop remains `sticky bottom-0`.
2. **Card stage height (≤767):** `100dvh - var(--header-h)` only — no longer subtracts `--footer-h`. Desktop still reserves header + footer.
3. **In-card max-height (≤767):** matches the taller stage (`100dvh - header - 5rem` sticky padding).
4. **Nested scroll model:** page scrolls to reveal the footer below the stage; in-card content still scrolls inside `.liquid-glass-card-content--stage` with `touch-action: pan-y`. Horizontal drag-dismiss (3F.2) must not `preventDefault` on vertical gestures.

## Real-device confirmation required (not verified until Jeremy reports)

- Footer reachable by scrolling past the stage
- Header still behaves correctly (sticky top)
- No card-fit regression from the taller stage

Do not start 3F.2 until this confirmation lands — drag threshold geometry depends on final chrome.
