# Part 3 Step 3A — Mobile inventory & folder map

**Status:** Sign-off inventory (no extraction / no behavior changes in this step)  
**Gate:** `matchMedia("(max-width: 767px)")` (approved)  
**Sequence (amended):** Part 1.5 remaining (only when separately approved) → **Part 3** → Part 2 theme → Part 4 tilt  

Part 1.5 note at time of this inventory: F6 measurement is done; F6 contrast *fix*, F4 glitch clones, and F7–F12 polish are **not** in progress and still need separate approval. Nothing blocks starting Part 3 after 3A sign-off.

---

## 1. Locked decisions (from approved plan + amendments)

| Decision | Value |
|---|---|
| Viewport gate | `max-width: 767px` for stage fade, scroll-end advance, a11y sheet, content variants |
| Desktop | Glitch/dissolve + outside-card 72px wheel path untouched |
| Shared engines | Keep `cardCycle.ts`, `cardScrollMachine.ts`, `cardStagePointer.ts` shared |
| CSS extract rule | Extract `max-width` mobile CSS + touch + mobile-nav; keep `min-width` desktop scales shared |
| A11y sheet dismiss (required) | Close button + backdrop tap + Escape |
| A11y sheet dismiss (nice-to-have) | Swipe-down — same sub-step only if low complexity |
| Content triage | Approved as written in the Part 3 plan (home + LS tables) |
| Scope C | Thumb-reach where feasible, 44×44 verify, no horizontal overflow ≥320px — not a full redesign |

---

## 2. Target folder map (create in 3B scaffolding — not yet present)

```
app/mobile/
  index.ts                      # public mobile exports
  useIsMobileViewport.ts        # 767px matchMedia hook
  AccessibilityBottomSheet.tsx  # mobile chrome around shared panel body
  SiteMobileNav.tsx             # hamburger nav links only
  # Part 4 later: OnboardingGate.tsx, tiltInput.ts (stubs only if needed)

app/components/motion/mobile/
  cardStageMobileScroll.ts           # scroll-end → applyScrollIntent
  attachCardStageMobileListeners.ts  # attach/detach helper
  # optional: cardStageMobileFade.ts if fade helpers grow beyond stage branch

app/styles/mobile/
  liquid-glass.mobile.css       # stage padding / mobile stage scrollport rules
  site-chrome.mobile.css        # if mobile nav styles need isolation
  a11y-sheet.css                # bottom sheet + backdrop

app/components/accessibility/
  AccessibilityPanelBody.tsx    # NEW in 3B sheet sub-step — shared toggles/reset
  # existing hooks/prefs stay put
```

**Does not exist today:** no `app/mobile/`, `app/components/motion/mobile/`, or `app/styles/mobile/` directories (verified empty).

---

## 3. File inventory by workstream

### 3.1 Card stage (scroll-end + fade) — 3B sub-steps: scaffolding, then card

| Path | Role today | Part 3 disposition |
|---|---|---|
| `app/components/motion/MyceliaCardStage.tsx` | Wheel/touch/keyboard, glitch panes, live region, hash focus | **Stay shared**; delegate mobile listeners + mobile render branch; desktop path unchanged |
| `app/components/motion/cardScrollMachine.ts` | Discrete intents + timings | **Shared, untouched** (mobile calls `applyScrollIntent` only) |
| `app/components/motion/cardCycle.ts` | Glitch/dissolve curves | **Shared, untouched** (mobile bypasses glitch layers in render) |
| `app/components/motion/cardStagePointer.ts` | Outside-card AABB capture | **Shared, untouched** for desktop wheel |
| `app/components/motion/LiquidGlassSurface.tsx` | Card shell, stage scrollport class | Shared; may accept mobile className/props |
| `app/components/motion/liquid-glass.css` | Stage `max-height` / overflow; `@media (max-width: 640px)` stage padding | Extract max-width block → `styles/mobile/`; keep `min-width` 768/1024 scales shared |
| `app/components/studio/HomePage.tsx` | 7 homepage panes | Wire stage; mobile content variants via section components |
| `app/ls/LiminalSinLanding.tsx` | 9 LS panes | Same |
| `app/atmosphere-preview/AtmosphereStudy.tsx` | Preview touch pattern | Inventory only; extract/align later if still duplicating (not blocking home/LS) |
| `app/components/motion/ScrollFoldScene.tsx` | Already uses 767px matchMedia | Leave unless it conflicts; pattern reference for gate |

**Desktop hard no-touch:** do not rewrite `cardCycle` / `cardScrollMachine` / `cardStagePointer` for mobile design.

### 3.2 Accessibility panel → bottom sheet — 3B sub-step: a11y sheet

| Path | Role today | Part 3 disposition |
|---|---|---|
| `app/components/AccessibilityPanel.tsx` | Popover dialog + all toggles | Split: body → shared; desktop wrapper keeps popover; mobile uses bottom sheet |
| `app/components/SiteChrome.tsx` | `a11yOpen`, trigger, mounts panel | Choose desktop vs mobile shell by `useIsMobileViewport` |
| `app/components/accessibility/useAccessibilityUiPrefs.ts` | Prefs state/storage | **Reuse as-is** |
| `app/components/accessibility/accessibilityPreference.ts` | Keys + document apply | **Reuse as-is** |
| `app/components/motion/useMyceliaReduceMotion.ts` | Reduce motion | **Reuse as-is** |
| `app/styles/accessibility-prefs.css` | `data-*` effects | Unchanged |

### 3.3 Mobile nav + CSS extraction — 3B sub-step: nav/CSS

| Path | Role today | Part 3 disposition |
|---|---|---|
| `app/components/SiteChrome.tsx` | `mobileOpen`, `lg:hidden` hamburger + dropdown nav | Extract nav UI → `app/mobile/SiteMobileNav.tsx`; A11y + Theme stay in header bar |
| `app/globals.css` | `--header-h` / `--footer-h` via `min-width` 640/768 | **Keep shared** (min-width progressive) |
| `app/components/motion/liquid-glass.css` `@media (max-width: 640px)` | Stage padding | Extract to `styles/mobile/` |

### 3.4 Content triage layout — 3B sub-step: content

Homepage sections (mobile trim targets):

| Path | Pane |
|---|---|
| `app/components/studio/sections/HeroSection.tsx` | Hero |
| `app/components/studio/sections/AboutSection.tsx` | About |
| `app/components/studio/sections/MissionSection.tsx` | Mission |
| `app/components/studio/sections/ProjectsSection.tsx` | Projects ×4 |

Liminal Sin (mobile trim targets):

| Path | Pane |
|---|---|
| `app/ls/LiminalSinHero.tsx` | Hero |
| `app/ls/LiminalSinLanding.tsx` (+ experience pane content modules) | Experience, FPV, composition |
| `app/ls/LiminalSinStorySections.tsx` | Story / Trust / Capabilities / etc. as currently split |
| `app/ls/LiminalSinSliceScope.tsx` | Slice scope |
| `app/ls/SignupForms.tsx` | Access form |
| Related FoldCard / FPV carousel modules under `app/ls/` | Dense card grids |

Approved triage summary (do not re-litigate in 3B without new approval):

- **Home:** omit/collapse About & Mission media; projects copy-first; hero keep CTA.
- **LS:** one primary CTA on hero; compact lists for Trust/Capabilities/Scope; Architecture diagram-first; Access form + one note.

### 3.5 Scope C verification surfaces

| Path | Check |
|---|---|
| New sheet close / handle | ≥44×44 |
| `SiteMobileNav` links / hamburger | ≥44×44 (already `min-h-11`) |
| Stage + sheet at 320px width | No horizontal overflow |
| Hero / access CTAs in trimmed panes | Thumb-reach where feasible |

### 3.6 Explicitly out of Part 3 (leave / later)

| Path | Why |
|---|---|
| `app/ls/game/GamePageShell.tsx` | Game wake `touchstart` — inventory only; decide leave-in-game |
| Theme buttons in `SiteChrome` | Part 2; stay disabled placeholder |
| Part 4 tilt / onboarding | After Part 3D; create under `app/mobile/` then |
| `cardCycle` / `cardScrollMachine` / `cardStagePointer` edits for “mobile math” | Forbidden — desktop contract |

---

## 4. Proposed 3B sub-steps (separately approvable)

Each: own approval → implement → full checks → commit/push → report. No bundling.

| ID | Sub-step | Primary files |
|---|---|---|
| **3B.1** | Scaffolding + `useIsMobileViewport` (767 gate) | `app/mobile/*` stub/index |
| **3B.2** | Mobile card scroll-end + fade | `motion/mobile/*`, branch in `MyceliaCardStage.tsx` |
| **3B.3** | Content triage layouts | Home + LS section components |
| **3B.4** | Accessibility bottom sheet | Panel body split + `AccessibilityBottomSheet` (close + backdrop + Escape; swipe optional) |
| **3B.5** | Mobile nav + max-width CSS extraction | `SiteMobileNav`, `styles/mobile/*` |

Then **3C** harden/verify, **3D** sweep (unchanged).

---

## 5. Sign-off checklist (Jeremy)

- [ ] Folder map accepted  
- [ ] File inventory dispositions accepted (especially shared engines untouched)  
- [ ] 3B.1–3B.5 split accepted  
- [ ] Content triage remains as previously approved  
- [ ] Proceed to **3B.1 only** when separately approved  

**This Step 3A document does not authorize any 3B implementation.**
