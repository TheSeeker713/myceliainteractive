# CURRENT_STATE.md — myceliainteractive (Frontend)

> **AI WORKING MEMORY** — Source of truth for frontend state.
> Last updated: March 10, 2026 — FE-7–FE-12 remaining.

---

## ⚠️ READ BEFORE TOUCHING CODE

- Frontend-only repo (Cloudflare Pages + Workers). Backend lives in `liminal-sin-gemini`.
- All audio assets are on GCS — do NOT reference local `/assets/` paths.
- GCS base URL: `https://storage.googleapis.com/liminal-sin-assets/`
- Deploy: `npm run deploy` (chains `next build` + `wrangler deploy`). Never `wrangler deploy` alone.

---

## Completed (Summary)

- **Steps A–J**: WS connect, mic, JASON dialogue, audio layers, barge-in, GCS — DONE
- **F1–F6**: Black screen, GM eye, scene crossfade, video handler, glitch CSS, demo end — DONE
- **FE-1–FE-4**: Error infrastructure (useGameError, ErrorOverlay, ErrorBoundary, D1 log, console.error wiring) — DONE
- **FE-5**: Cinematic intro sequence (IntroSequence.tsx, credits, title card, `intro_complete` WS send) — DONE
- **FE-6**: SFX volume fix (ambientGain 0.12→0.16, dialogue SFX 0.7 scale) — DONE

---

## Backend Status — March 10, 2026 (liminal-sin-gemini @ `51b56f7`)

> All backend work is **COMPLETE**. The following WS events are now live from the server. Frontend can implement against them immediately.

| Backend Feature | WS Event / Detail | Unblocks |
|---|---|---|
| **B9** Image pre-load cache | 3 zones pre-warmed on `intro_complete`; `scene_image` arrives near-instantly on first scene change | FE-8 (flashlight overlay) |
| **B10** GM 6-beat playbook | Strict sequence: Darkness → Flashlight → Generator → Waterpark → Card → Audrey. `found_transition` ends demo. | All FE scene handlers |
| **B11** Flashlight hint timer | `{ type: 'hint', text: 'ask him if he has a flashlight' }` fires 45s after `intro_complete` if no scene change yet | Render as fading text overlay — same style as "say something..." |
| **B12** Audrey NPC | `agent_speech { agent: 'audrey', audio: base64 }` — Aoede voice, one echo, beat 6 only. Also fires `scene_change { sceneKey: 'audrey_echo' }` simultaneously. | **FE-12** (ConvolverNode reverb + DelayNode) |

**`hint` event handler needed in `GameHUD.tsx`:** Display `text` as a fading overlay. Auto-dismiss after 4s. Same visual tier as the "say something..." prompt.

**`audrey_echo` sceneKey:** When `scene_change` with `sceneKey === 'audrey_echo'` arrives, do NOT swap the scene image. It is a cue-only event — the visual stays on whatever scene was last shown.

---

---

## TODAY — March 10 Sprint: FE-7 → FE-12

Execute in this order. Internal cutoff: **March 11 @ 11:11 PM MT**.

---

### FE-7 ⚠️ — Safety: Remove Strobing from High Glitch CSS — DO FIRST

**File:** `globals.css` — `high` intensity glitch keyframes (F5 work).

Remove `invert(1)` and `contrast(3)` from every keyframe step in the `high` intensity animation. Replace with a static deep-red tint via the existing `::before` pseudo-element:
```css
box-shadow: inset 0 0 0 100vmax rgba(180,0,0,0.35);
```
Shake and skew remain. Color inversion does NOT. Rapid invert cycling is a seizure trigger — must fix before demo.

---

### FE-8 — Smart Glasses Flashlight POV Overlay

**Goal:** All scene images/videos show through a circular flashlight POV — dark vignette edges, central bright zone.

**File:** scene container component (F3 work).

```css
.scene-container::after {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(
    ellipse 38% 32% at 50% 50%,
    transparent 0%,
    transparent 55%,
    rgba(0,0,0,0.55) 75%,
    rgba(0,0,0,0.92) 100%
  );
  pointer-events: none;
  z-index: 10;
}
```

On generator beat (`zone_merge` or `zone_park_shore` sceneKey in `scene_image` handler):
- Animate overlay `opacity → 0` over 2s (room is now lit by generator).
- Apply `mix-blend-mode: multiply` amber tint layer to warm the scene.

---

### FE-9 — VHS Glitch Transition on Video→Image Swap

**File:** video overlay handler (F4 work).

300ms `vhs-swap` CSS class applied 50ms before video ends (`timeupdate` event, check `currentTime >= duration - 0.05`). Auto-removed after 300ms.

```css
@keyframes vhs-swap {
  0%   { filter: saturate(2) hue-rotate(20deg); transform: scaleX(1.01) translateY(-2px); }
  33%  { filter: saturate(0) brightness(1.4); transform: scaleX(0.995) translateY(3px); }
  66%  { filter: saturate(1.5) hue-rotate(-15deg); transform: scaleX(1.005) translateY(-1px); }
  100% { filter: none; transform: none; }
}
```

No `invert`. Safe.

---

### FE-10 — Card Collectible UI

**Trigger:** `slotsky_trigger` WS event with `anomalyType === 'anomaly_cards'`.

1. Queen of Spades SVG/PNG overlay fades in — lower-right corner, pulsing glow.
2. "pick it up?" label fades in after 2s.
3. Player click/tap → card slides off-screen.
4. Send `{ type: 'card_collected', sessionId }` over WS.

Card image is at GCS (`slotsky_card` scene image). `card_collected` is informational — GM drives Audrey timing via beat map, not this event.

---

### FE-11 — Generator Lights-On Transition

**Trigger:** `scene_image` WS event with `sceneKey` containing `zone_merge` or `zone_park_shore`.

1. Brightness flicker: `brightness(0.15) → brightness(0.8) → brightness(0.4) → brightness(1.0)` over 1.5s via CSS `@keyframes`.
2. Fade flashlight POV vignette (FE-8 overlay) to `opacity: 0` over 2s.
3. Ease in `sepia(0.3) saturate(1.2)` warm-amber filter on scene container over 3s.

---

### FE-12 — Audrey Echo Audio Pipeline

**Trigger:** `agent_speech` WS event with `agent === 'audrey'`. Depends on backend **B12**.

1. Same PCM decode path as Jason (`AudioContext.decodeAudioData` → `AudioBufferSourceNode`).
2. Insert `ConvolverNode` reverb + `DelayNode` (0.15s delay, dry/wet 0.6) before output.
3. Output gain: `0.7` (she is farther away than Jason).
4. `agent_interrupt` does NOT cancel Audrey audio.

---

## New WS Events This Sprint

| Event | Direction | Payload | Status |
|-------|-----------|---------|--------|
| `intro_complete` | FE → BE | `{}` | DONE — sent at end of IntroSequence |
| `hint` | BE → FE | `{ type: 'hint', text: string }` | **BE DONE** — render as fading overlay (FE-TODO) |
| `card_collected` | FE → BE | `{ type: 'card_collected', sessionId: string }` | TODO — FE-10 |
| `agent_speech` (audrey) | BE → FE | `{ agent: 'audrey', audio: base64 }` | **BE DONE** — FE-12 required |
| `scene_change` (`audrey_echo`) | BE → FE | `{ sceneKey: 'audrey_echo' }` | **BE DONE** — visual cue only, do NOT swap image |

**CRITICAL:** Verify `intro_complete` is sent at the end of `IntroSequence.onComplete`. Backend B9 prewarm and Jason landing depend on receiving it.

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
