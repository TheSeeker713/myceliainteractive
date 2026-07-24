# Consolidated testing summary — autonomous backlog run

**Status for everything below:** shipped, **pending Jeremy confirmation**. Emulation / code review / local contrast harness are not device verification.

Measured against `origin/main` after this run’s commits (verify with `git log origin/main`).

---

## How to test (one pass)

### Desktop

1. Homepage card stage: wheel outside card, in-card scroll, keyboard Arrow/Page, glitch transitions — Tab must **not** land in duplicate glitch layers mid-transition.
2. Theme radiogroup: System / Lightside / Darkside; reload persistence; System follows OS; default Lightside for fresh profile.
3. Accessibility panel: focus trap, Escape, outside dismiss, text-size arrows, Reduce Motion / Pause background.
4. First-visit motion onboarding (clear `localStorage` key `mycelia-motion-onboarding-seen`): lighter desktop copy; Accessibility link opens panel.
5. Darkside: chrome + liquid-glass readability over atmosphere (shaders themselves are not recolored).

### Mobile (physical phone required)

1. **3F.1** Footer reachable below stage; header sticky.
2. **3F.2** Drag-follow: finger follow, spring, 35% dismiss, vertical scroll, no multi-fire.
3. **3F.4** First-card arrows + tip; fade together on first successful dismiss; sessionStorage.
4. **3F.3** Thumbnails sized; tap expand/shrink; long-press native Save Image/Video; drag still works from non-image chrome.
5. Theme toggle usable; Darkside readable.
6. Onboarding gate + **Enable tilt** iOS permission dialog; tilt feel; Reduce Motion via Accessibility.
7. Mobile nav: opens, focuses first link, Escape returns to hamburger.
8. A11y bottom sheet still opens/closes (VV pinning).

---

## What shipped (by phase)

### 1. Part 3 closeout (3C + 3D)

| Commit topic | Notes |
|---|---|
| Harden boundaries | `MobileCardImage` / `MobileCardVideoThumb` / guide wrapped in `MobileFeatureErrorBoundary`; guide storage via `runMobileSafe` |
| Fresh 3D sweep | Docs: `part3-step-3c-harden.md`, `part3-step-3d-sweep.md` |

### 2. Part 2 — Theme

| Step | Notes |
|---|---|
| 2a | `theme-tokens.css` Lightside extraction; liquid-glass/globals consume vars; vitest guards literals |
| 2b | `html[data-theme="dark"]` Darkside palette (teal-tinted neutrals, not invert) |
| 2c | Real radiogroup toggle; `mycelia:theme` localStorage; bootstrap before paint |

### 3. Part 4 — Tilt + onboarding

| Piece | Structurally verifiable now | Needs phone |
|---|---|---|
| `requestPermission()` inside Enable tilt click | Yes | iOS dialog behavior |
| Missing API / denied → graceful no-op | Yes | — |
| Bridge into existing pointer/warp/camera | Yes | Tilt feel / sensitivity |
| Desktop lighter gate | Yes | Copy comfort |

### 4. Accessibility F6 / F4 / F7–F12

See `documents/part15-a11y-closeout.md` for F6 numbers and itemized fixes.

**F6 LLC re-measure (after `/90`):**

- **390×844 normal:** min **3.928** (fail AA 4.5) — residual against busy atmosphere within approved opacity cap
- **390×844 high contrast:** min **6.316** (pass)
- **1280×800 normal:** min **7.715** (pass as large text)
- **1280×800 high contrast:** min **13.325** (pass)

---

## Explicitly deferred / not fully confident

| Item | Why |
|---|---|
| Pixel-identical Lightside screenshot pair for 2a | Animated atmosphere makes pixel-diff unreliable; token literal tests used instead |
| Mobile LLC AA pass in normal mode | Still short of 4.5 at approved `/90` max; HC mode passes |
| Low-priority a11y polish (logo double announce, external-link wording, unlabeled articles, LS focus ring) | Skipped this pass — listed in part15 doc |
| `.cursor/rules/agents.mdc` theme-status blurb | Auto-review blocked editing that rule file; project docs cover shipped status |
| Custom long-press Save menu | Only if phone proves native save still blocked after 3F.3 exclusion |
| Game `/ls/play` chrome | Out of site Part 3/4 scope |

---

## Commit trail (this autonomous run)

Use `git log --oneline origin/main` for authoritative hashes. Expected topics in order:

1. Part 3 harden/sweep  
2. Theme 2a tokens  
3. Theme 2b Darkside  
4. Theme 2c toggle  
5. Part 4 tilt/onboarding  
6. A11y F6/F4/F7–F12 (+ this summary)

Nothing in this document claims real-device or production visual verification.
