# CURRENT_STATE.md — myceliainteractive (Frontend)

> **AI WORKING MEMORY** — Source of truth for frontend state.
> Last updated: March 10, 2026 — **Bug-fix patch applied post feature-lock. See BUG FIX LOG below.**

---

## ⚠️ READ BEFORE TOUCHING CODE

- Frontend-only repo (Cloudflare Pages + Workers). Backend lives in `liminal-sin-gemini`.
- All audio assets are on GCS — do NOT reference local `/assets/` paths.
- GCS base URL: `https://storage.googleapis.com/liminal-sin-assets/`
- Deploy: `npm run deploy` (chains `next build` + `wrangler deploy`). Never `wrangler deploy` alone.

---

## Completed (Summary)

- **Steps A–J**: WS connect, mic, Jason dialogue, audio layers, barge-in, GCS migration — DONE
- **F1–F6**: Black screen, GM eye, scene crossfade, video handler, glitch CSS, demo end — DONE
- **FE-1–FE-4**: Error infrastructure (useGameError, ErrorOverlay, ErrorBoundary, D1 + Cloud Run dual logging) — DONE
- **FE-5**: Cinematic intro sequence (IntroSequence.tsx, credits, title card, `intro_complete` WS send) — DONE
- **FE-6**: SFX volume fix (ambientGain 0.16, dialogue SFX 0.7 scale) — DONE
- **FE-7**: Removed `invert`/`contrast` strobing from high-intensity glitch keyframes; static deep-red `::before` tint added — DONE
- **FE-8**: Flashlight POV radial-gradient vignette overlay on `.scene-container::after`; fades out on generator-lit scenes — DONE
- **FE-9**: VHS swap CSS class applied 50ms before video ends via `timeupdate`; auto-removed after 300ms — DONE
- **FE-10**: Card collectible UI — Queen of Spades SVG overlay, pulsing glow, 2s label delay, slide-out on click, `card_collected` WS send — DONE
- **FE-11**: Generator lights-on transition — brightness flicker (1.5s), vignette fade (2s), warm amber ease-in (3s) on `zone_merge`/`zone_park_shore` sceneKeys — DONE
- **FE-12**: Audrey echo audio pipeline — separate `ConvolverNode` reverb + `DelayNode` (0.15s), dry/wet 0.4/0.6, gain 0.7; not cancelled by `agent_interrupt` — DONE
- **Types**: `HintEvent`, `card_collected` added to GameWSContext; backend `hint` text renders as fading overlay for 6s — DONE

---

## BUG FIX LOG — March 10, 2026 (Post Feature-Lock Patch)

### Bug 1 FIXED (CRITICAL) — Strobing/flashing `hud_glitch` effect
**Was:** `hud-glitch-high` keyframes contained `filter: brightness(2)` and `filter: brightness(1.5)` producing a 10 Hz luminance strobe. Animation timing used `steps(4)` at `0.1s` (hard-cuts, no interpolation), making it a clinical strobe hazard. `glitchClass` state was never applied as a DOM `className`, so the FE-7 `::before` red tint safety fallback never fired.
**Fixed in:** `app/globals.css`, `app/ls/game/GameHUD.tsx`
- Removed **all** `brightness()` calls from `@keyframes hud-glitch-high`
- Replaced animation timing with `ease-in-out` at 0.5s / 0.7s / 0.9s (low/med/high)
- Applied `glitchClass` as actual `className` on GameHUD wrapper div so `.hud-glitch-active-high::before` red-tint rule fires correctly

### Bug 2 FIXED (CRITICAL) — `intro_complete` never sent → GM fires events during cinematic
**Was:** `intro_complete` was in the WS contract table and `CURRENT_STATE.md` marked DONE, but it was:
  1. Missing from the `ClientEvent` union type in `GameWSContext.tsx`
  2. Never called anywhere in the codebase — `IntroSequence.tsx` did not send it
**Result:** The backend (B8) correctly gates Jason's first speech behind `intro_complete`, but the GM session was ungated — it connected on `session_ready` and immediately started evaluating webcam frames and sending `hud_glitch`, `slotsky_trigger`, etc. while the 11.5s cinematic played. Events arrived before the player saw anything.
**Fixed in:** `app/ls/game/GameWSContext.tsx`, `app/ls/game/IntroSequence.tsx`
- Added `| { type: "intro_complete" }` to `ClientEvent` type
- Added `useGameWS()` import to `IntroSequence.tsx`; calls `send({ type: "intro_complete" })` in the 11.5s completion timer, just before `onComplete()` transitions the game to active phase

---

## Backend Status — March 10, 2026 (liminal-sin-gemini)

All backend work complete. All WS events the frontend consumes are live. Latest commits: `720fb87`, `2786e81`.

### March 10 Backend Bug Fixes

- **GM model crash fixed**: GM now uses `gemini-2.0-flash-live-001` with `responseModalities: [TEXT]`. Previously used the NPC native-audio model, causing a 1007 crash on connect and a premature Beat 2 scene change before any player input.
- **Strobe/glitch spam fixed**: `triggerGlitchEvent` is now throttled at a 3s cooldown per session server-side. The GROUP-audience path that was spamming `hud_glitch(high)` continuously is capped. Frontend glitch CSS fixes (FE-7) and this backend throttle together eliminate the strobe hazard.
- **`fourthWallCount` now persisted**: `updateFourthWallCount()` added to `db.ts` (atomic Firestore increment). Called on `fourth_wall_correction` Slotsky trigger. GM no longer loses count on session reconnect.
- **GM output gate**: `triggerSceneChange` and `triggerVideoGen` are blocked (silently ACK'd) until `intro_complete` is received — Beat 1 screen stays black as intended.
- **GM input gate**: `gmManager.sendAudio()` and `gmManager.sendFrame()` are both guarded by `if (gmGated)`. GM receives zero player audio or webcam frames during the 11.5s cinematic. Combined with the frontend `intro_complete` fix (Bug 2 above), the GM is now fully silent in both directions until the cinematic ends.

---

## TODAY — March 10 Sprint: FE-7 → FE-12

**✅ ALL COMPLETE** — FE-7 through FE-12 implemented, 0 TypeScript errors, 0 ESLint warnings. Frontend is feature-locked for the March 11 @ 11:11 PM MT internal cutoff.

---

## WS Event Contract — Current State (All Live)

| Event | Direction | Payload | Status |
|-------|-----------|---------|--------|
| `session_start` | FE → BE | `{ judge_mode: boolean }` | DONE |
| `player_speech` | FE → BE | `{ audio: base64, timestamp }` | DONE |
| `player_frame` | FE → BE | `{ jpeg: base64, timestamp }` | DONE |
| `session_end` | FE → BE | `{}` | DONE |
| `intro_complete` | FE → BE | `{}` | DONE |
| `card_collected` | FE → BE | `{ sessionId: string }` | DONE |
| `agent_speech` | BE → FE | `{ agent, audio: base64 }` | DONE — Jason + Audrey both handled |
| `agent_interrupt` | BE → FE | `{ agent }` | DONE — cancels Jason only |
| `trust_update` | BE → FE | `{ agent, trust_level, fear_index }` | DONE |
| `hud_glitch` | BE → FE | `{ intensity, duration_ms }` | DONE |
| `session_ready` | BE → FE | `{ session_id }` | DONE |
| `session_error` | BE → FE | `{ code, message }` | DONE |
| `scene_image` | BE → FE | `{ payload: { sceneKey, data } }` | DONE |
| `scene_video` | BE → FE | `{ payload: { sceneKey, url } }` | DONE |
| `slotsky_trigger` | BE → FE | `{ payload: { anomalyType } }` | DONE |
| `camera_obscured` | BE → FE | `{ obscured }` | DONE |
| `hint` | BE → FE | `{ text: string }` | DONE — 6s fading overlay |

---

## Key Files

| File | Purpose |
|------|---------|
| `app/ls/game/page.tsx` | Game UI shell |
| `app/ls/game/GameWSContext.tsx` | WS context — deferred connect, sceneImage state |
| `app/ls/game/GameHUD.tsx` | HUD — 3-layer audio, agent_interrupt, 25 WS event mappings |
| `app/ls/game/usePlayerMedia.ts` | Mic + webcam — ScriptProcessorNode 16kHz PCM, 1FPS JPEG |
| `app/ls/game/audioManifest.ts` | Audio event keys → GCS URL pools (30 keys, 118 files) |
| `app/ls/game/useAudioLayers.ts` | 3-channel Web Audio hook (musicGain/sfxGain/ambientGain) |
| `app/ls/game/useGameError.ts` | Error queue hook + dual cloud logger |
| `app/ls/game/ErrorOverlay.tsx` | ErrorToast + ErrorModal components |
| `app/ls/game/GameErrorBoundary.tsx` | React class error boundary |
| `app/ls/judges/game/page.tsx` | Judge game shell — judgeMode=true |
| `workers/signup-api.ts` | CF Worker — signup, email, admin, D1 ops |

---

## GCS Asset Inventory

Base URL: `https://storage.googleapis.com/liminal-sin-assets/`

| Category | GCS Path | Count |
|----------|----------|-------|
| Music | `audio/music/` | 17 |
| SFX | `audio/sfx/` | 87 |
| Voice Overs | `audio/voice_overs/` | 4 |
| Reference Images | `images/` | 10 |
| **Total** | | **118 files** |

---

## Project Identity

| Field | Value |
|---|---|
| Stack | Next.js 16, React 19, Tailwind v4, Cloudflare Pages + Workers, D1 |
| Deploy | `npm run deploy` (chains `next build` + `wrangler deploy`) |
| Backend WS | `wss://liminal-sin-server-1071754889104.us-west1.run.app` |
| Game URL | `myceliainteractive.com/ls/game` |
| Judge Game URL | `myceliainteractive.com/ls/judges/game` |
| D1 Database | `liminal-sin-signups` — `cb37396d-6a97-43e7-b492-94a1eb4647b7` |

---

## Deadlines

| Date | Milestone |
|------|-----------|
| **March 11 @ 11:11 PM MT** | Internal prototype cutoff — full demo functional |
| **March 16 @ 5:00 PM PDT** | HARD DEADLINE — contest submission |
