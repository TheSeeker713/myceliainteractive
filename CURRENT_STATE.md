# CURRENT_STATE.md — myceliainteractive (Frontend)

> **AI WORKING MEMORY** — This file is the source of truth for the current state of the frontend project.
> Last updated: March 9, 2026 (F1-F4 COMPLETE — black screen, red eye, scene image crossfade, scene_video handler; F5-F6 remain)

---

## WARNING: NEXT AI SESSION — READ THIS FIRST

This is the FRONTEND repo (Cloudflare Pages). All backend/server code lives in `liminal-sin-gemini` repo.
Before writing any code, read AGENTS.md in the backend repo for lore context.

**ARCHITECTURE CORRECTION (March 9):**
The GM is a SILENT gaming engine — it NEVER speaks to the player. It communicates only via function calls.
JASON is the only voice the player hears (Gemini Live, Enceladus voice).
Slotsky is invisible — handles scene changes and in-game perks via event flags.

**ALL AUDIO ASSETS ARE ON GCS** — Do NOT reference local `/assets/music/` or `/assets/sound_fx/` paths.
Base URL: `https://storage.googleapis.com/liminal-sin-assets/`

---

## What Has Been Built — Completed Steps

### Steps A-J — ALL COMPLETE

1. **Backend Cloud Run server** — `wss://liminal-sin-server-1071754889104.us-west1.run.app`
2. **Frontend WS connects** — deferred to "Begin Session" click (autoplay policy)
3. **Mic capture** — `ScriptProcessorNode` 16kHz, raw PCM Int16 -> base64 -> `player_speech`
4. **JASON dialogue** — bidirectional voice, in-lore, Gemini Live native audio (Enceladus)
5. **Voice barge-in (Step F)** — `agent_interrupt` cancels all queued AudioBufferSourceNodes
6. **Layered audio system (Step E)** — 3-channel Web Audio: music/SFX/ambient. 83 files, 28 event keys.
7. **SIGNAL LOST bug** — judges/game `connect()` fixed
8. **NotReadableError** — `captureStartedRef` guard, getUserMedia fires once
9. **Jason voice = Enceladus** (Step G)
10. **iOS cross-device** (Step H) — shared AudioContext
11. **echoCancellation** (Step I) — mic bleed fix
13. **F1 — Black screen opening + text hint (Step K)** — `session_ready` starts 10s timer → `showHint` fades in "say something..."; disappears on first `player_speech` (`playerHasSpoken` flag in context)
14. **F2 — GM Red Eye indicator (Step M)** — red circle top-right, `gm-eye-breathe` keyframe 0.3→1.0 opacity over 3.5s; visible while `sessionActive && status === 'open'`
15. **F3 — Scene image crossfade pipeline (Step L)** — dual `<img>` layers A/B with `transition-opacity duration-1000`; `pushImage()` swaps via `requestAnimationFrame`; replaces single static `<img>`
16. **F4 — `scene_video` handler (Step P)** — `SceneVideoEvent` type added; video overlay plays GCS URL at z-[5]; `handleSceneVideoEnded` captures last frame via canvas → feeds crossfade pipeline; taint-safe fallback

## Core Architecture — The 3-Minute Demo

### How the Game Works (Frontend Perspective)

1. **BLACK SCREEN START** — Game starts with NO image, NO video. Screen is pure black.
   - SFX triggers from GCS: falling, crash, ambient underground sounds.
   - JASON's voice plays through Gemini Live (Enceladus).
   - After ~10s, a text overlay hint fades in: "say something..."

2. **FLASHLIGHT MECHANIC** — Player suggests Jason use flashlight.
   - Backend fires Imagen 4 to generate a still frame (non-blocking).
   - Frontend receives `scene_image` WS event with base64 JPEG.
   - Crossfade from black to the image (POV through flashlight).

3. **SCENE TRANSITIONS** — Each new scene arrives as a `scene_image` WS event.
   - Hold current image until next one arrives.
   - Crossfade between images for smooth transitions.
   - JASON stalls with dialogue while images generate in background.

4. **DEMO END** — GM triggers `found_transition` via Slotsky.
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
| `scene_video` | Visual | **NEW** — Play Veo 3.1 Fast short video clip over current scene, freeze on last frame |
| `slotsky_trigger` | Event | Trigger Slotsky SFX/visual based on anomalyType |

### Demo Sequence (what the player experiences)

| Beat | Time | Frontend Effect |
|------|------|-----------------|
| 1 | 0:00 | BLACK SCREEN. SFX: falling, crash, ambient. No image element visible. |
| 2 | 0:05 | JASON audio starts playing (hurt, confused, voicebox activated) |
| 3 | 0:15 | CSS text overlay fades in: "say something..." |
| 4 | 0:20-0:40 | Player speaks. JASON responds. Still black screen. |
| 5 | 0:40-1:00 | Player suggests flashlight. `scene_image` arrives first (still). Crossfade black → tunnel POV. Then `scene_video` arrives — short Veo 3.1 Fast clip plays, freezes on last frame. |
| 6 | 1:00-1:30 | Exploration. Each scene change: `scene_image` then `scene_video`. Possible `hud_glitch` effects. |
| 7 | 1:30-2:00 | Slotsky cards. `slotsky_trigger(anomaly_cards)` -> SFX: slot bells. |
| 8 | 2:00-2:30 | Distant voice echoes (Audrey/Josh). Ambient layer shift. |
| 9 | 2:30-2:50 | Scene transitions accelerate. Music crossfades to climax tier. |
| 10 | 2:50-3:00 | `slotsky_trigger(found_transition)` -> Hold image, end animation, session close. |

---

### Backend B1-B3 Complete (Veo 3.1 Fast Pipeline)

As of March 9, backend steps B1-B3 are **DONE**:
- `server/services/veo.ts` — Veo 3.1 Fast img2vid service (new file)
- `triggerVideoGen` GM tool declaration added to `gemini.ts`
- `triggerVideoGen` case wired in `gameMaster.ts` → broadcasts `scene_video` WS event
- WS event format: `{ type: 'scene_video', payload: { sceneKey, url } }` where `url` is a GCS URI

The frontend F4 step can now be tested end-to-end once implemented.

### Frontend F1-F4 Complete (March 9)

All four backend-prerequisite frontend steps are **DONE** and pushed to main:
- **F1** — Black screen + 10s text hint + disappears on first `player_speech`
- **F2** — GM red eye breathing indicator (top-right, `gm-eye-breathe` keyframe)
- **F3** — Scene image crossfade pipeline (dual img layers, `pushImage()` + `requestAnimationFrame`)
- **F4** — `scene_video` handler: GCS URL playback → canvas frame capture → crossfade pipeline; taint fallback

**Backend can now run B4 (GCS asset verify) and B5 (GM trust battle-test) end-to-end.**

---

## REMAINING WORK ORDER (March 9 — F5 + F6 still to do)

> F1-F4 are COMPLETE. Remaining frontend items below.

### ~~F1 — Black Screen Opening~~ — DONE
### ~~F2 — GM Red Eye Indicator~~ — DONE
### ~~F3 — Scene Image Crossfade Pipeline~~ — DONE
### ~~F4 — `scene_video` Handler~~ — DONE

---

### F5 — Glitch Effect Implementation (Step N)

On `hud_glitch` WS event:
- `intensity: 'low'` → subtle screen shake, 500ms
- `intensity: 'medium'` → screen shake + color distortion, 800ms
- `intensity: 'high'` → heavy shake + color invert + scan lines, 1200ms
- Pure CSS/JS — no additional dependencies needed

---

### F6 — Demo End Sequence (Step O)

On `slotsky_trigger` with `anomalyType: 'found_transition'`:
1. Stop all ambient and music audio
2. Hold the final scene image (no more transitions)
3. After 2s delay: fade in end overlay (title card + "experience complete" or similar)
4. After 5s: close WS connection gracefully
5. Return to landing page or show a judge feedback prompt

---

## Step Progress Tracker

| Step | Feature | Status |
|---|---|---|
| A | Backend Cloud Run server running | DONE |
| B | Frontend WS connects on button click | DONE |
| C | Mic capture — raw PCM 16kHz stream | DONE |
| D | JASON dialogue — bidirectional voice | DONE |
| E | Layered audio system (music/SFX/ambient) | DONE |
| F | Voice interrupt / barge-in | DONE |
| G | JASON voice — Enceladus | DONE |
| H | iOS cross-device compatibility | DONE |
| I | echoCancellation constraint | DONE |
| J | GCS audio storage + audioManifest updated | DONE |
| K | Black screen opening + text hint | **DONE** |
| L | Scene image display pipeline | **DONE** |
| M | GM red eye indicator | **DONE** |
| N | Glitch effects (CSS) | **TODAY** |
| O | Demo end sequence | **TODAY** |
| P | `scene_video` handler — Veo 3.1 Fast clip playback + freeze | **DONE** |
| Q | Demo video (4 min, mandatory) | March 11-14 |
| R | Architecture diagram (mandatory) | March 13-15 |

---

## GCS Asset Inventory (fully migrated)

All assets live at `https://storage.googleapis.com/liminal-sin-assets/`

| Category | GCS Path | Count |
|----------|----------|-------|
| Music | `audio/music/` | 17 |
| SFX | `audio/sfx/` | 66 |
| Voice Overs | `audio/voice_overs/` | 4 |
| Podcasts | `audio/podcasts/` | 6 |
| Video Clips | `video/clips/` | 6 |
| Reference Images | `images/` | 6 |
| **Total** | | **105 files** |

---

## Timeline

| Date | Milestone |
|---|---|
| March 9, 2026 | Steps A-J complete. **Today: F1 (black screen) → F2 (red eye) → F3 (scene image) → F4 (scene_video / Veo 3.1 Fast) → F5 (glitch) → F6 (demo end). ALL frontend done today.** |
| March 10, 2026 | Integration testing. Full 3-minute demo playthrough end-to-end. Backend + frontend wired together. Fix any issues. |
| **March 11, 2026 @ 11:11 PM MT** | **Internal prototype cutoff — full demo functional** |
| March 12-14 | Demo video recording + architecture diagram |
| March 15 | Submission prep, final review |
| **March 16, 2026 @ 5:00 PM PDT** | **HARD DEADLINE — CONTEST SUBMISSION** |

---

## Project Identity

| Field | Value |
|---|---|
| **Site** | myceliainteractive.com |
| **Stack** | Next.js 16, React 19, Tailwind v4, Cloudflare Pages + Workers, D1 |
| **Deploy** | `npm run deploy` (chains `next build` + `wrangler deploy`) |
| **Worker name** | `myceliainteractive` |
| **D1 Database** | `liminal-sin-signups` — ID: `cb37396d-6a97-43e7-b492-94a1eb4647b7` |
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
| `workers/signup-api.ts` | Main Worker — signup, email, admin, cron |
| `workers/globals.d.ts` | Cloudflare runtime type declarations |
| `wrangler.jsonc` | Worker config — D1 binding, cron trigger |
| `app/ls/page.tsx` | Liminal Sin landing page |
| `app/ls/SignupForms.tsx` | Judge + tester signup forms (client component) |
| `app/ls/judges/page.tsx` | Judge backdoor route |
| `app/components/FPVCarousel.tsx` | Cloudflare AI FPV image carousel — `/ls` background |
| `app/ls/game/page.tsx` | Game UI shell — wrapper for game |
| `app/ls/game/GameWSContext.tsx` | WebSocket context — deferred connect, sceneImage state |
| `app/ls/game/GameHUD.tsx` | Game HUD — 3-layer audio, agent_interrupt, 25 WS event mappings |
| `app/ls/game/usePlayerMedia.ts` | Mic + webcam — ScriptProcessorNode 16kHz PCM, 1FPS JPEG |
| `app/ls/game/audioManifest.ts` | Audio event keys -> GCS URL pools (28 keys, 83 files) |
| `app/ls/game/useAudioLayers.ts` | 3-channel Web Audio hook (musicGain/sfxGain/ambientGain) |
| `app/ls/judges/game/page.tsx` | Judge game shell — judgeMode=true |

---

## Audio System — Architecture (Step E)

### 3-Channel Gain Structure
| Channel | GainNode | Default Gain | What plays |
|---|---|---|---|
| Music | `musicGain` | 0.3 | Looped background tracks with crossfading |
| SFX | `sfxGain` | 0.8 | One-shot sound effects triggered by WS events |
| Ambient | `ambientGain` | 0.5 | Looped ambient environment sounds |

### audioManifest.ts Keys (28 keys)
`session_start` `voicebox_activate` `voicebox_deactivate` `ambient_tunnel_loop` `ambient_static_loop` `music_intro` `music_tension` `music_climax` `music_psychosis` `fourth_wall_correction` `npc_glitch_tier1` `npc_glitch_tier2` `npc_glitch_tier3` `slotsky_shadow` `slotsky_flicker` `slotsky_whisper` `slotsky_mirror` `slotsky_shatter` `trust_drop_warning` `trust_drop_low` `trust_rebuild` `found_transition` `heartbeat_pulse` `static_surge` `breath_stutter` `horror_sting` `footstep_loop` `water_drip`

---

## Completed Infrastructure

### Email System
- Email 1: Instant welcome on signup — confirmed delivering via Brevo
- Email 2: "The Underground Is Open" — fired by cron after admin flips `game_live`
- From: `access@myceliainteractive.com`

### How to Flip Game Live
```bash
curl -X POST https://myceliainteractive.com/api/set-game-live \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### Cloudflare AI
- `GET /api/ai/image?seed={0-11}` — Flux 1 Schnell FPV image generation, 12-seed cap, 24h edge cache
- `app/components/FPVCarousel.tsx` — crossfade carousel, random 12-24s intervals
