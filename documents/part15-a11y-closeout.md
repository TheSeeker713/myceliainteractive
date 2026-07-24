# Accessibility closeout — F6, F4, F7–F12

## F6 — Hero LLC contrast

- Raised LLC opacity `/65` → `/90` (top of approved `/85–/90` range)
- Extended high-contrast CSS for `--studio-*-on-glass` / `--color-studio-*-on-glass` and `[data-lg-hero]` (forced solid black under high contrast)

### Re-measured (local static `out/` via F6 harness)

| Viewport | Mode | LLC min ratio | avg | AA pass | Required |
|---|---|---:|---:|---|---:|
| 390×844 | normal | **3.928** | 3.944 | **no** | 4.5 (normal text) |
| 390×844 | high contrast | **6.316** | 6.346 | yes | 4.5 |
| 1280×800 | normal | **7.715** | 7.801 | yes | 3 (large text) |
| 1280×800 | high contrast | **13.325** | 13.431 | yes | 3 |

**Note:** Mobile normal-mode LLC still misses AA 4.5 against the busiest atmosphere frames even at `/90`. Further opacity would exceed the approved visual range; high-contrast mode is the accessibility escape hatch. Pending Jeremy confirmation on visual balance.

## F4 — Glitch clone Tab trap

- Non-base glitch layers/slices marked `inert` + `aria-hidden` so Tab cannot reach duplicated interactive DOM during ~1.45s desktop transitions
- Mobile fade path unchanged

## F7–F12

| ID | Change |
|---|---|
| F7 | Desktop `AccessibilityPanel`: Tab focus trap; `aria-labelledby` on heading. Mobile sheet: `aria-labelledby` |
| F8 | Text-size radiogroup: arrow-key navigation + `tabIndex` roving |
| F9 | Mobile nav: focus first link on open; `aria-controls` only when open |
| F10 | Stage card content region `tabIndex={0}` + `role="region"` for keyboard scroll |
| F12 | Live-region pane announcements already present in `MyceliaCardStage` — left as-is (pairing confirmed structurally) |

### Skipped (low priority this pass)

- Logo link double-announcement
- External link “opens in new tab” visible indication beyond `rel`
- Unlabeled article cards polish
- LS signup focus ring strength

Skipped to keep this pass on the approved F6/F4/F7–F12 core; note for a later polish pass if needed.
