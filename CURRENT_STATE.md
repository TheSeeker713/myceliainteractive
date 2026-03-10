# CURRENT_STATE.md � myceliainteractive (Frontend)

> **AI WORKING MEMORY** � This file is the source of truth for the current state of the frontend project.
> Last updated: March 10, 2026 (F1-F6 ALL COMPLETE; backend B1-B6 ALL COMPLETE; FE error handling + camera/mic resilience planned; **intro sequence + audio fix incoming — see backend CURRENT_STATE.md for full plan**)

---

## WARNING: NEXT AI SESSION � READ THIS FIRST

This is the FRONTEND repo (Cloudflare Pages). All backend/server code lives in `liminal-sin-gemini` repo.
Before writing any code, read AGENTS.md in the backend repo for lore context.

**ARCHITECTURE CORRECTION (March 9):**
The GM is a SILENT gaming engine � it NEVER speaks to the player. It communicates only via function calls.
JASON is the only voice the player hears (Gemini Live, Enceladus voice).
Slotsky is invisible � handles scene changes and in-game perks via event flags.

**ALL AUDIO ASSETS ARE ON GCS** � Do NOT reference local `/assets/music/` or `/assets/sound_fx/` paths.
Base URL: `https://storage.googleapis.com/liminal-sin-assets/`

---

## What Has Been Built � Completed Steps

### Steps A-J � ALL COMPLETE

1. **Backend Cloud Run server** � `wss://liminal-sin-server-1071754889104.us-west1.run.app`
2. **Frontend WS connects** � deferred to "Begin Session" click (autoplay policy)
3. **Mic capture** � `ScriptProcessorNode` 16kHz, raw PCM Int16 -> base64 -> `player_speech`
4. **JASON dialogue** � bidirectional voice, in-lore, Gemini Live native audio (Enceladus)
5. **Voice barge-in (Step F)** � `agent_interrupt` cancels all queued AudioBufferSourceNodes
6. **Layered audio system (Step E)** — 3-channel Web Audio: music/SFX/ambient. 118 total files (87 SFX), 30 event keys.
7. **SIGNAL LOST bug** � judges/game `connect()` fixed
8. **NotReadableError** � `captureStartedRef` guard, getUserMedia fires once
9. **Jason voice = Enceladus** (Step G)
10. **iOS cross-device** (Step H) � shared AudioContext
11. **echoCancellation** (Step I) � mic bleed fix
13. **F1 � Black screen opening + text hint (Step K)** � `session_ready` starts 10s timer ? `showHint` fades in "say something..."; disappears on first `player_speech` (`playerHasSpoken` flag in context)
14. **F2 — GM Eye indicator (Step M)** — REDESIGNED: 44x28px SVG eye shape (outer almond, red iris with pulse animation, black pupil, white glint). Breathing opacity animation preserved. **Only visible when webcam is actively capturing** (webcamActive flag from usePlayerMedia). Hidden after demo ends.
15. **F3 — Scene image crossfade pipeline (Step L)** — dual `<img>` layers A/B with `transition-opacity duration-1000`; `pushImage()` swaps via `requestAnimationFrame`; replaces single static `<img>`
16. **F4 — `scene_video` handler (Step P)** — `SceneVideoEvent` type added; video overlay plays GCS URL at z-[5]; `handleSceneVideoEnded` captures last frame via canvas → feeds crossfade pipeline; taint-safe fallback
17. **F5 — HUD Glitch effects (Step N)** — Full-screen CSS animation applied to GameHUD container div. Three intensity tiers: `low` (subtle XY jitter, 0.08s steps), `medium` (shake + hue-rotate + skew, 0.12s steps), `high` (heavy shake + invert + contrast + red scanline overlay with `::before` pseudo-element). Duration controlled by `hud_glitch.duration_ms` or defaults (500/800/1200ms). Blocked after demo ends.
18. **F6 — Demo end sequence (Step O)** — On `slotsky_trigger(found_transition)`: stops all music/ambient, sets `demoEnded` flag (freezes scene — blocks new images/videos), plays `proximity_found` SFX; after 2s fades in end overlay ("LIMINAL SIN" + "experience complete"); after 7s sends `session_end` to close WS gracefully.

## Core Architecture � The 3-Minute Demo

### How the Game Works (Frontend Perspective)

1. **BLACK SCREEN START** � Game starts with NO image, NO video. Screen is pure black.
   - SFX triggers from GCS: falling, crash, ambient underground sounds.
   - JASON's voice plays through Gemini Live (Enceladus).
   - After ~10s, a text overlay hint fades in: "say something..."

2. **FLASHLIGHT MECHANIC** � Player suggests Jason use flashlight.
   - Backend fires Imagen 4 to generate a still frame (non-blocking).
   - Frontend receives `scene_image` WS event with base64 JPEG.
   - Crossfade from black to the image (POV through flashlight).

3. **SCENE TRANSITIONS** � Each new scene arrives as a `scene_image` WS event.
   - Hold current image until next one arrives.
   - Crossfade between images for smooth transitions.
   - JASON stalls with dialogue while images generate in background.

4. **DEMO END** � GM triggers `found_transition` via Slotsky.
   - Stop requesting new scenes.
   - Hold final image.
   - Play animated end sequence.
   - Close session gracefully.

### WS Events the Frontend Must Handle

| WS Event | Type | Frontend Action |
|----------|------|-----------------|
| `session_ready` | System | Start ambient audio loop, show "connected" state |
| `agent_speech` | Audio | Decode base64 PCM, queue in AudioBufferSourceNode chain |
| `agent_interrupt` | Audio | Cancel all queued audio nodes (barge-in) |
| `trust_update` | State | Update internal trust/fear state, trigger tier-based music crossfades |
| `hud_glitch` | Visual | CSS glitch effect (intensity: low/medium/high, duration_ms) |
| `scene_change` | State | Update scene key in state |
| `scene_image` | Visual | Decode base64 JPEG, crossfade to new background image |
| `scene_video` | Visual | **NEW** � Play Veo 3.1 Fast short video clip over current scene, freeze on last frame |
| `slotsky_trigger` | Event | Trigger Slotsky SFX/visual based on anomalyType |

### Demo Sequence (what the player experiences)

| Beat | Time | Frontend Effect |
|------|------|-----------------|
| 1 | 0:00 | BLACK SCREEN. SFX: falling, crash, ambient. No image element visible. |
| 2 | 0:05 | JASON audio starts playing (hurt, confused, voicebox activated) |
| 3 | 0:15 | CSS text overlay fades in: "say something..." |
| 4 | 0:20-0:40 | Player speaks. JASON responds. Still black screen. |
| 5 | 0:40-1:00 | Player suggests flashlight. `scene_image` arrives first (still). Crossfade black ? tunnel POV. Then `scene_video` arrives � short Veo 3.1 Fast clip plays, freezes on last frame. |
| 6 | 1:00-1:30 | Exploration. Each scene change: `scene_image` then `scene_video`. Possible `hud_glitch` effects. |
| 7 | 1:30-2:00 | Slotsky cards. `slotsky_trigger(anomaly_cards)` -> SFX: slot bells. |
| 8 | 2:00-2:30 | Distant voice echoes (Audrey/Josh). Ambient layer shift. |
| 9 | 2:30-2:50 | Scene transitions accelerate. Music crossfades to climax tier. |
| 10 | 2:50-3:00 | `slotsky_trigger(found_transition)` -> Hold image, end animation, session close. |

---

### Backend B1-B6 Complete (March 9-10)

As of March 10, backend steps B1-B6 are **DONE**:
- B1-B3: Veo 3.1 Fast pipeline (`veo.ts` + `triggerVideoGen` GM tool + gameMaster wiring)
- B4: GCS assets verified. 87 SFX, 10 images, 4 voice_overs. Video/podcast assets removed from GCS (not needed for contest phase).
- B5: All 7 GM tools battle-tested via `POST /debug/fire-gm-event`: triggerTrustChange, triggerFearChange, triggerGlitchEvent, triggerSceneChange, triggerSlotsky, triggerVideoGen, triggerAudienceUpdate. All passing.
- `db.ts`: Added `updateSceneKey()` and `updateProximityState()` — persists scene + proximity to Firestore.
- B6: 4 backend bugs fixed — GM model crash (`responseModalities: [Modality.TEXT]` removed from GM config), GM tool ACK hang (`sendToolResponse` moved outside WS guard into `.finally()`), missing `jasonManager` 5th arg in `GM_FUNCTION_CALL` handler, `triggerTrustChange` now accepts raw float (0.0–1.0) OR case-insensitive string (High/Neutral/Low).

### Frontend F1-F4 Complete (March 9)

All four backend-prerequisite frontend steps are **DONE** and pushed to main:
- **F1** � Black screen + 10s text hint + disappears on first `player_speech`
- **F2** — GM SVG eye indicator (44×28px almond SVG, red iris with pulse animation, black pupil, white glint, webcam-gated — only renders when webcam is actively capturing, hidden after demo ends)
- **F3** � Scene image crossfade pipeline (dual img layers, `pushImage()` + `requestAnimationFrame`)
- **F4** � `scene_video` handler: GCS URL playback ? canvas frame capture ? crossfade pipeline; taint fallback

**Backend can now run B4 (GCS asset verify) and B5 (GM trust battle-test) end-to-end.**

---

## REMAINING WORK ORDER (March 9 → F5 + F6 still to do)

> F1-F6 ALL COMPLETE.

### ~~F1 — Black Screen Opening~~ — DONE
### ~~F2 — GM Eye Indicator~~ — DONE (redesigned as SVG eye, webcam-gated)
### ~~F3 — Scene Image Crossfade Pipeline~~ — DONE
### ~~F4 — `scene_video` Handler~~ — DONE
### ~~F5 — Glitch Effect Implementation (Step N)~~ — DONE
### ~~F6 — Demo End Sequence (Step O)~~ — DONE

**All frontend feature work (F1-F6) is COMPLETE.**

---

## NEXT: Error Handling + Camera/Mic Resilience

> **Status: PLANNED — not yet started. Approved plan. Execute in phase order.**

### Phase FE-1 — Error Infrastructure *(build first — all other phases depend on this)*

| Step | Task | File(s) | Status |
|------|------|---------|--------|
| FE-1a | Add `client_error_logs` D1 table + `POST /api/log-error` route | `workers/signup-api.ts` | TODO |
| FE-1b | Create `useGameError.ts` — error queue hook + dual cloud logger (D1 + Firestore pre-wire) | `app/ls/game/useGameError.ts` (NEW) | TODO |
| FE-1c | Create `ErrorOverlay.tsx` — `ErrorToast` (recoverable, 8s auto-dismiss) + `ErrorModal` (fatal, End Session btn) | `app/ls/game/ErrorOverlay.tsx` (NEW) | TODO |
| FE-1d | Create `GameErrorBoundary.tsx` — React class error boundary wrapping game shell; crash fallback UI | `app/ls/game/GameErrorBoundary.tsx` (NEW) | TODO |

### Phase FE-2 — Mic Handling *(depends on FE-1)*

| Step | Task | File(s) | Status |
|------|------|---------|--------|
| FE-2a | Split `getUserMedia` into two sequential calls — mic first (fatal if denied), webcam second (non-blocking if denied). New states: `micDenied`, `micActive`, `webcamDenied` | `usePlayerMedia.ts` | TODO |
| FE-2b | Add `MicBlocker` fatal modal in `GameHUD.tsx` — shown when `micDenied && !demoEnded`. Buttons: "Reload" + "End Session" | `GameHUD.tsx` | TODO |

**Mic is required. Webcam is optional. Session can run audio-only.**

### Phase FE-3 — Camera Coverage Detection *(parallel with FE-2)*

| Step | Task | File(s) | Status |
|------|------|---------|--------|
| FE-3a | Add pixel brightness analysis to 1FPS canvas loop. Sample `getImageData(0,0,80,60)` (quarter res). 3+ dark frames (avg brightness < 20) → `setCameraObscured(true)`. Uses `darkFrameCountRef` (no re-render per frame). | `usePlayerMedia.ts` | TODO |
| FE-3b | Add `CameraObscuredEvent` type `{ type: "camera_obscured"; obscured: boolean }` to `ServerEvent` union (future-proofs backend signal) | `GameWSContext.tsx` | TODO |
| FE-3c | Add non-blocking amber camera nudge banner — shown when `(cameraObscured \|\| webcamDenied) && !cameraNudgeDismissed && !demoEnded`. Dismissable with "Got it". Game continues. | `GameHUD.tsx` | TODO |

### Phase FE-4 — Wire Existing Silent Errors *(depends on FE-1)*

| Step | Existing `console.error` | Replace with | Severity |
|------|--------------------------|--------------|----------|
| FE-4a | `GameHUD.tsx` audio decoder catch | `dispatchError("Audio playback interrupted")` | recoverable |
| FE-4b | `GameWSContext.tsx` `ws.onerror` | `dispatchError("Connection error — backend unreachable")` | recoverable |
| FE-4c | `GameWSContext.tsx` `session_error` event handler | `dispatchError(ev.message)` | fatal |
| FE-4d | `usePlayerMedia.ts` top-level catch | `dispatchError("Media capture error")` | recoverable |

### New Files (to be created)
- `app/ls/game/useGameError.ts`
- `app/ls/game/ErrorOverlay.tsx`
- `app/ls/game/GameErrorBoundary.tsx`

### Backend Dependency (create in backend session)
`POST /log-client-error` endpoint on Cloud Run — writes to Firestore. Frontend pre-wires the call with `AbortSignal.timeout(3000)` and silently ignores 404 until endpoint exists.

### Verification Checklist
- [ ] Deny mic → `MicBlocker` modal appears; "End Session" fires `session_end`
- [ ] Deny webcam → camera nudge banner appears; JASON audio still works
- [ ] Cover webcam 3+ seconds → nudge appears; uncover → clears (if not dismissed)
- [ ] Kill backend mid-session → recoverable toast appears; session does not hard-crash
- [ ] Check D1 `client_error_logs` after mic deny → row written with `sessionId` + error
- [ ] `npx tsc --noEmit` on all modified files → 0 errors

---

## INCOMING: Intro Sequence + Audio Fixes (Cross-Ref — Backend Plan)

> **FYI ONLY — Full plan lives in `liminal-sin-gemini/CURRENT_STATE.md` under "NEXT: Intro Sequence + Audio Fixes".**
> Do NOT overwrite any existing plan in this file. This section is a cross-reference only.
> Planned March 10, 2026.

### Summary
Three workstreams decided from E2E testing feedback. All implementation is frontend (this repo) except one line in `jason.ts` (backend).

| Workstream | What | Status |
|------------|------|--------|
| **A — Cinematic Intro Sequence** | New `IntroSequence.tsx` component. Randomized intro music + wind SFX → production credits → LIMINAL SIN title → Jason landing + monologue. | TODO |
| **B — SFX Volume Fix** | Reduce `ambientGain` to 0.15–0.18 and `sfxGain` for dialogue events to 0.40–0.45. Wind SFX stays at 0.65 during intro. | TODO |
| **C — OBS Mic / Demo Recording** | OBS holds mic device even when muted. Use iPad for demo recording — confirmed working. | Operational — no code |

### Credits Text (locked for IntroSequence)
```
A MYCELIA INTERACTIVE EXPERIENCE
Directed by J.W.
Produced by A.L.
Music by THE S33K3R
```

### Volume Spec
- Wind SFX during intro: **gain 0.65**
- Intro music: **gain 0.35–0.40**
- Ambient during active gameplay: **gain 0.15–0.18**

### New Files This Workstream
- `components/IntroSequence.tsx` — NEW

### Backend Change (1 line)
- `server/services/npc/jason.ts` in `liminal-sin-gemini` — `monologueMode` flag added to `buildJasonSystemPrompt()`

---

## Step Progress Tracker

| Step | Feature | Status |
|---|---|---|
| A | Backend Cloud Run server running | DONE |
| B | Frontend WS connects on button click | DONE |
| C | Mic capture � raw PCM 16kHz stream | DONE |
| D | JASON dialogue � bidirectional voice | DONE |
| E | Layered audio system (music/SFX/ambient) | DONE |
| F | Voice interrupt / barge-in | DONE |
| G | JASON voice � Enceladus | DONE |
| H | iOS cross-device compatibility | DONE |
| I | echoCancellation constraint | DONE |
| J | GCS audio storage + audioManifest updated | DONE |
| K | Black screen opening + text hint | **DONE** |
| L | Scene image display pipeline | **DONE** |
| M | GM SVG eye indicator (webcam-gated) | **DONE** |
| N | Glitch effects (CSS) | **DONE** |
| O | Demo end sequence | **DONE** |
| P | `scene_video` handler � Veo 3.1 Fast clip playback + freeze | **DONE** |
| Q | Demo video (4 min, mandatory) | March 11-14 |
| R | Architecture diagram (mandatory) | March 13-15 |
| FE-1 | Error infrastructure (useGameError, ErrorOverlay, ErrorBoundary, D1 log endpoint) | **DONE** |
| FE-2 | Mic blocker modal + split getUserMedia | **DONE** |
| FE-3 | Camera coverage detection + nudge banner | **DONE** |
| FE-4 | Wire existing silent console.errors to dispatchError | **DONE** |
| FE-5 | Cinematic intro sequence (IntroSequence.tsx + sessionPhase state) | **DONE** |
| FE-6 | SFX volume fix (ambientGain 0.12→0.16; dialogue SFX 0.7 scale) | **DONE** |

---

## GCS Asset Inventory (fully migrated)

All assets live at `https://storage.googleapis.com/liminal-sin-assets/`

| Category | GCS Path | Count |
|----------|----------|-------|
| Music | `audio/music/` | 17 |
| SFX | `audio/sfx/` | 87 |
| Voice Overs | `audio/voice_overs/` | 4 |
| Reference Images | `images/` | 10 |
| **Total** | | **118 files** |

---

## Timeline

| Date | Milestone |
|---|---|
| March 9, 2026 | Steps A-J complete. F1–F4 done. |
| March 10, 2026 | **F5 (glitch) + F6 (demo end) complete. GM eye redesigned (SVG, webcam-gated). All frontend features F1-F6 DONE.** Integration testing ready. |
| **March 11, 2026 @ 11:11 PM MT** | **Internal prototype cutoff � full demo functional** |
| March 12-14 | Demo video recording + architecture diagram |
| March 15 | Submission prep, final review |
| **March 16, 2026 @ 5:00 PM PDT** | **HARD DEADLINE � CONTEST SUBMISSION** |

---

## Project Identity

| Field | Value |
|---|---|
| **Site** | myceliainteractive.com |
| **Stack** | Next.js 16, React 19, Tailwind v4, Cloudflare Pages + Workers, D1 |
| **Deploy** | `npm run deploy` (chains `next build` + `wrangler deploy`) |
| **Worker name** | `myceliainteractive` |
| **D1 Database** | `liminal-sin-signups` � ID: `cb37396d-6a97-43e7-b492-94a1eb4647b7` |
| **Backend WS** | `wss://liminal-sin-server-1071754889104.us-west1.run.app` |
| **Game URL** | `myceliainteractive.com/ls/game` |
| **Judge game URL** | `myceliainteractive.com/ls/judges/game` |

---

## Cloudflare Secrets (encrypted, never in code)

| Name | Purpose |
|---|---|
| `ADMIN_TOKEN` | Secures `POST /api/set-game-live` endpoint |
| `BREVO_API_KEY` | Brevo transactional email API (free tier, 300/day) |

---

## Key Files

| File | Purpose |
|---|---|
| `workers/signup-api.ts` | Main Worker � signup, email, admin, cron |
| `workers/globals.d.ts` | Cloudflare runtime type declarations |
| `wrangler.jsonc` | Worker config � D1 binding, cron trigger |
| `app/ls/page.tsx` | Liminal Sin landing page |
| `app/ls/SignupForms.tsx` | Judge + tester signup forms (client component) |
| `app/ls/judges/page.tsx` | Judge backdoor route |
| `app/components/FPVCarousel.tsx` | Cloudflare AI FPV image carousel � `/ls` background |
| `app/ls/game/page.tsx` | Game UI shell � wrapper for game |
| `app/ls/game/GameWSContext.tsx` | WebSocket context � deferred connect, sceneImage state |
| `app/ls/game/GameHUD.tsx` | Game HUD � 3-layer audio, agent_interrupt, 25 WS event mappings |
| `app/ls/game/usePlayerMedia.ts` | Mic + webcam � ScriptProcessorNode 16kHz PCM, 1FPS JPEG |
| `app/ls/game/audioManifest.ts` | Audio event keys -> GCS URL pools (30 keys, 87 SFX / 118 total files) |
| `app/ls/game/useAudioLayers.ts` | 3-channel Web Audio hook (musicGain/sfxGain/ambientGain) |
| `app/ls/judges/game/page.tsx` | Judge game shell � judgeMode=true || `app/ls/game/useGameError.ts` | *(planned)* Error queue hook + dual cloud logger (D1 + Firestore) |
| `app/ls/game/ErrorOverlay.tsx` | *(planned)* ErrorToast + ErrorModal components |
| `app/ls/game/GameErrorBoundary.tsx` | *(planned)* React class error boundary |
---

## Audio System � Architecture (Step E)

### 3-Channel Gain Structure
| Channel | GainNode | Default Gain | What plays |
|---|---|---|---|
| Music | `musicGain` | 0.3 | Looped background tracks with crossfading |
| SFX | `sfxGain` | 0.8 | One-shot sound effects triggered by WS events |
| Ambient | `ambientGain` | 0.5 | Looped ambient environment sounds |

### audioManifest.ts Keys (30 keys)
`music_intro` `music_tension` `music_climax` `music_psychosis` `ambient_cold_open` `ambient_water_echo` `voicebox_activate` `transmission_ping` `barge_in` `knowledge_unlock` `trust_drop` `fear_spike` `fear_critical` `slotsky_bells` `slotsky_cards` `slotsky_lights` `slotsky_geometry` `fourth_wall_bells` `fourth_wall_crackle` `glitch_low` `glitch_medium` `glitch_high` `proximity_echo` `proximity_found` `found_water_rise` `static_takeover` `descent_sting` `jason_whisper` `relay_true` `relay_false`

---

## Completed Infrastructure

### Email System
- Email 1: Instant welcome on signup � confirmed delivering via Brevo
- Email 2: "The Underground Is Open" � fired by cron after admin flips `game_live`
- From: `access@myceliainteractive.com`

### How to Flip Game Live
```bash
curl -X POST https://myceliainteractive.com/api/set-game-live \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### Cloudflare AI
- `GET /api/ai/image?seed={0-11}` � Flux 1 Schnell FPV image generation, 12-seed cap, 24h edge cache
- `app/components/FPVCarousel.tsx` � crossfade carousel, random 12-24s intervals
