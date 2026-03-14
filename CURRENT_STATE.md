# CURRENT_STATE.md — Liminal Sin Frontend (myceliainteractive)

> **UPDATE RULE:** Replace the previous content and write a single current-state snapshot. Do NOT append. Historical logs belong in git history.
> Last updated: March 14, 2026 (post-onboarding fix + credits rewrite).

---

## Deadlines

- **Hard deadline:** March 16, 2026 at 5:00 PM PDT (Google Gemini Live Agent Challenge).

---

## Infrastructure

| Item | Value |
|---|---|
| Deploy target | Cloudflare Pages (Workers) |
| Live Worker URL | `https://myceliainteractive.digitalartifact11.workers.dev` |
| Latest Version ID | `cc735cb5-2063-45d2-9f7a-824a45f44a36` |
| Framework | Next.js 16.1.6 + React 19 + TypeScript + Tailwind CSS 4 |
| Game route | `/ls/game/` |
| Judges route | `/ls/judges/game/` |
| Backend WS | `wss://liminal-sin-server-1071754889104.us-west1.run.app/game` |
| GCS Base URL | `https://storage.googleapis.com/liminal-sin-assets/` |

---

## Current Live State (March 14, 2026 — POST-ONBOARDING FIX + CREDITS REWRITE)

### Onboarding & Session Flow (Fixed March 14)
- **Root cause fixed:** PLAY click used to directly start `IntroSequence`, sending `intro_complete` before the WS was open. Backend gates everything behind `intro_complete` — Jason and all GM scene events were permanently blocked.
- **New phase flow:** `waiting → connecting → intro → active`
  - `waiting`: Single consolidated onboarding screen. Shows `GRANT PERMISSIONS` button if mic/cam not yet granted. Auto-transitions button to `PLAY` once granted (or shows `PLAY` directly if already granted). Includes privacy disclaimer and error state.
  - `connecting`: Black screen with "connecting…" pulse while WS opens and backend initialises. Shows until backend sends `session_ready`.
  - `intro`: `session_ready` is the trigger that starts `IntroSequence`. `intro_complete` is now always sent over an open WS.
  - `active`: Game HUD takes over after credits end.

### Credits (Rewritten March 14)
- **New 9-line script in 3 sequential fade blocks + title card (total 19s):**
  - t=1.0s — Block 1: `MYCELIA INTERACTIVE / PRESENTS`
  - t=5.0s — Block 2: `LIMINAL SIN / A voice psychological-horror experience. / Powered by Google Gemini.`
  - t=9.5s — Block 3: `Directed by J.W. / Written by J.W. and A.L. / Music by THE S33K3R`
  - t=14.0s — Big `LIMINAL SIN` title card
  - t=17.0s — Fade to black, audio fades
  - t=19.0s — `intro_complete` fires → game begins

### WS Event & Media System (From March 14 earlier session)
- **GCS Morphic media loading live:** Frontend loads stills/clips from GCS on `scene_change` events.
- **All WS event types synchronized:** 100% contract compliance (29 events matched).
- **2 critical P0 bugs fixed:** `found_transition` (was ending session), `anomaly_cards` (was showing card overlay).
- **Acecard flow fully wired:** keyword timer heartbeat, reveal clip + completion event, card2 pickup window.
- **7 wildcard slotsky handlers** implemented (vision feed, scare SFX, game_over/good_ending loading/start).
- **Wildcard3 trigger handler** implemented.
- **WS reconnect backoff:** 3 attempts at 1s, 3s, 5s delays.
- **DemoEndOverlay:** Play Again on both endings. Good ending: "to be continued".

---

## Frontend Status — 100% COMPLETE (March 14, 2026)

Zero TypeScript errors. Zero ESLint errors. Zero warnings.

| System | Status |
|---|---|
| Onboarding (permissions gate + PLAY flow) | ✅ Live — single screen, auto-detect PLAY |
| Connecting screen (waiting for session_ready) | ✅ Live |
| Credits sequence (3 blocks + title card, 19s) | ✅ Live — correct 9-line script |
| session_ready → intro trigger | ✅ Fixed — intro only starts after WS open |
| intro_complete delivery | ✅ Fixed — always sent over open WS |
| WS transport (GameWSContext) | ✅ Live — all event types, reconnect backoff |
| GCS Morphic media loading | ✅ Live — 16 stills + 18 clips from bucket |
| Scenario effects (slotsky, cards, timers) | ✅ Live — all handlers wired |
| General effects (scene loading, glitch, trust) | ✅ Live |
| Acecard keyword timer | ✅ Live — 30s heartbeat escalation |
| Acecard reveal playback | ✅ Live — GCS clip + completion event |
| Card pickup overlay | ✅ Live |
| Wildcard CSS effects | ✅ Live — 7 new CSS classes |
| Demo end overlay | ✅ Live — Play Again for both endings |
| Audio SFX manifest | ✅ Live — scare_wildcard added |

---

## Files Modified — This Session (March 14, 2026)

| File | Change |
|---|---|
| `app/ls/game/page.tsx` | Rewritten: single onboarding screen, connecting phase, session_ready→intro wiring |
| `app/ls/game/IntroSequence.tsx` | Rewritten: 9-line 3-block credits, 19s total timing, correct script |

## Files Modified — Earlier (March 14, 2026)

| File | Change |
|---|---|
| `app/ls/game/mediaManifest.ts` | **NEW** — GCS constants, Morphic media IDs, helper functions |
| `app/ls/game/GameWSContext.tsx` | 5 new event types, expanded payloads, reconnect backoff, removed dead types |
| `app/ls/game/useGameHudScenarioEffects.ts` | Fixed 2 P0 bugs, added 7 slotsky/acecard/wildcard handlers |
| `app/ls/game/useGameHudGeneralEffects.ts` | GCS Morphic loading, hallway_pov_02_ready emission, preload stills |
| `app/ls/game/DemoEndOverlay.tsx` | Play Again for both endings, "to be continued" text |
| `app/ls/game/GameHUD.tsx` | Removed dead handleEndSession |
| `app/styles/game-effects.css` | 7 new wildcard CSS classes |
| `app/ls/game/audioManifest.ts` | Added scare_wildcard SFX key |

---

## Active Constraints

- Lyria 3 audio deferred. No audio generation until `docs/AUDIO_DESIGN.md` exists.
- ADK/AutoFlow NOT implemented. Direct GenAI SDK + WebSocket only.
- All game state in backend (Firestore). Frontend is a dumb terminal.
- `docs/Contest.md` — do not archive until after March 16 5PM PDT deadline.


---

## Line-Length Policy

- Global no-god-code policy remains active.
- Standard source-file caps remain 300/400-line policy per module category.
- Exception files allowed up to 800 lines:
	- CURRENT_STATE.md
	- README.md
	- AGENTS.md
	- docs/SHOT_SCRIPT.md

---

## Phase B Plan — Split Execution Workflow

- [x] Run two VS Code windows in parallel for delivery.
- [x] Backend window: liminal-sin-gemini handles backend checklist items only.
- [x] Frontend window: myceliainteractive handles frontend checklist items only.
- [x] Keep ownership strict: no cross-window implementation edits.
- [x] Sync only through documented WS contract and CURRENT_STATE status deltas.

### Backend Window Instructions (This Repo)

- This window executes backend-only tasks from this document.
- Prioritize Event Contract Expansion and Scene Key Expansion first.
- Keep GM silent architecture and lore invariants intact at all times.
- Report progress by checking boxes in this backend file only.

---

## Backend TODO Checklist (SHOT_SCRIPT-Aligned)

### Event Contract Expansion

- [x] Add backend emit path for card_discovered.
- [x] Add backend receive path for card_collected.
- [x] Add backend emit path for dread_timer_start.
- [x] Add backend emit path for game_over.
- [x] Add backend emit path for good_ending.

### Scene Key Expansion

- [x] Add flashlight_beam to backend scene support.
- [x] Add generator_area to backend scene support.
- [x] Add maintenance_area to backend scene support.
- [x] Add card2_closeup to backend scene support.
- [x] Align prewarm set with SHOT_SCRIPT target keys.

### GM and Session Behavior

- [x] Keep GM fully silent (function-call-only architecture).
- [x] Preserve intro gating and timed beat sequencing.
- [x] Maintain trust/fear float handling (0.0-1.0) across events.
- [x] Preserve lore invariants for Jason, Audrey, and Slotsky behavior.

### Dread and Ending Control

- [x] Add backend dread timer lifecycle control (start/cancel/expire path).
- [x] Route timer expiry to game_over event path.
- [x] Route successful card2 completion to good_ending path.

### Compliance and File Health

- [x] Audit oversized backend files against line-cap policy.
- [x] Split large files into focused modules without behavior changes.
- [x] Keep deploy protocol unchanged (npm run deploy flow, no direct deploy command).

---

## Backend Execution Instructions

- Execute checklist in micro-steps and validate each isolated change.
- Keep implementation strictly SHOT_SCRIPT-aligned and lore-safe.
- Do not move trust logic to enum-only behavior; keep float-based logic.
- Do not mix frontend concerns into backend modules.
- Update this document using concise status deltas only.

---

## ⚡ ACTIVE SESSION — Media Pipeline Sprint (March 11, 2026)

> **Context note:** The backend game logic (gmTools, dreadTimer, sessionEndings, card_collected, WS handlers) is 100% complete. The current sprint is focused exclusively on validating and hardening the Imagen 4 + Veo 3.1 Fast media generation pipeline.

### Status Delta — March 12, 2026

- `docs/SHOT_SCRIPT.md` is now the authoritative spec for the expanded Act 1 media plan.
- Canonical scope is no longer the reduced 5-scene interpretation.
- Canonical Act 1 media scope is now:
	- 13 scripted images
	- 13 scripted videos
	- 2 wildcard images
	- 2 wildcard videos
- Scripted sequencing rule: `i1` is the opening still; all later scripted stills are conceptually chained from the last frame of the preceding scripted video.
- `v5` is intentionally absent and replaced by the live wildcard smartglasses anomaly event.
- All still-frame gameplay nodes after TALK opens require a 60-second autoplay path to the paired video trigger.
- The two live-generation candidates are reserved for wildcard anomaly events, not the main scripted media chain.
- Backend prompt libraries and generation pipeline are not yet fully aligned to this expanded registry and still require implementation work.

### What We Are Trying To Do

Build a chained, FPV-immersive, RAI-safe image→video pipeline for all 12 scene keys. The pipeline must:

1. Generate a reference still (Imagen 4) for the opening scene.
2. Generate a 6-second video from that still (Veo 3.1 Fast).
3. Extract the last frame of that video as a JPEG.
4. Feed that last frame as the reference image into the next scene's video.
5. Repeat for all 12 scene keys in sequence — each scene's video starts from the last frame of the previous one, creating visual continuity.

The experience must feel like first-person smartglasses footage (Jason's POV) — subtle head-bob, breathing tremor, handheld jitter — not a smooth cinematic camera.

---

### Infrastructure Context

| Item | Value |
|---|---|
| GCP Project | `project-c4c3ba57-5165-4e24-89e` (Mycelia Interactive) |
| Org | `digitalartifact11-org` (165684325504) |
| Imagen model | `imagen-4.0-generate-001` / `us-west1` |
| Veo model | `veo-3.1-fast-generate-001` / `us-central1` (NOT us-west1 — NOT_FOUND otherwise) |
| SDK | `@google/genai` — `getVeoAiClient()` in `gemini.ts` → returns GoogleGenAI for `us-central1` |
| Auth | Service account (Vertex AI) — API key approach NOT needed; org policy `Block service account API key bindings` blocks it at org level and Edit is grayed out for this account — **irrelevant, SA auth works fine** |
| ffmpeg | NOT YET INTEGRATED — required for last-frame extraction |

---

### Blocking Issue

`pipeline-variant-benchmark.ts` ran and hit `POLICY_VIOLATION: RAI filtered output` on the **first video** (`zone_tunnel_entry`). The prompt was benign ("First-person POV underground cinematic exploration... no people, no faces"). User confirmed prompts are correct — the RAI filter is oversensitive. No videos were produced; JPEG images were saved successfully.

**Root cause:** Veo safety settings are not configured to `BLOCK_ONLY_HIGH`. The API supports `safetyFilterLevel` in the video generation config.

---

### 5 Active Directives (USER-ISSUED, NOT YET IMPLEMENTED)

These are the exact tasks to execute in the next session, in order:

**1 — Relax safety filters**
- Add `safetyFilterLevel: "block_only_high"` to Veo `generateVideos` config in both `veo.ts` (production) and `pipeline-variant-benchmark.ts` (test script).
- Also add `addWatermark: false` if the SDK accepts it.
- Also fix `veo.ts`: strip string `"horror"` from any prompt template; add `console.warn('[VEO] RAI filter blocked:', ...)` instead of silently returning null.

**2 — Negative prompt system**
- Create a centralized `NEGATIVES` constant (shared between imagen.ts, veo.ts, and benchmark script):
  ```
  "people, faces, person, human, body, hands, crowd, watermark, logo, text, UI, blurry, low quality, overexposed, cartoon, anime, CGI, rendered"
  ```
- Apply as `negativePrompt` param to all Imagen 4 and Veo calls.

**3 — Chained pipeline (last-frame extraction)**
- Integrate ffmpeg via `fluent-ffmpeg` or direct `child_process.spawn` to extract the last frame of a video buffer as JPEG.
- Create a helper `extractLastFrame(videoPath: string): Promise<Buffer>` in a new `scripts/frameExtract.ts`.
- Update `pipeline-variant-benchmark.ts` so that after scene[N] video succeeds, it extracts the last frame and uses it as the reference image for scene[N+1] video (not a fresh Imagen call).
- Scene[0] still uses Imagen for the initial reference. All subsequent scenes chain from the last frame.

**4 — Seed monitor + logging**
- Log the seed value returned by Imagen 4 in the benchmark output (`SceneResult` type + `benchmark.json`).
- Log the seed value returned by Veo if the API exposes it.
- This enables reproducibility and debugging of specific frames.

**5 — FPV/POV video prompts**
- Rewrite ALL 12 `VIDEO_HINTS` entries in `pipeline-variant-benchmark.ts` to include:
  `"point-of-view through smartglasses visor, subtle head-bob from walking motion, slight handheld tremor, natural breathing rhythm visible in frame movement"`
- Remove any language that could imply a person/human is visible.
- The goal: viewers feel they ARE Jason, not that they are watching Jason.

---

### Completed This Session

- [x] `getVeoAiClient()` added to `server/services/gemini.ts`
- [x] `server/services/veo.ts` updated to use `getVeoAiClient`; fallback model chain (`veo-3.1-fast → veo-3.0-fast → veo-3.0`); `enhancePrompt: true`; `durationSeconds: 6`
- [x] `scripts/pipeline-variant-benchmark.ts` created — 12 scene keys, HH:MM:SS timers, saves JPEG + MP4, writes `benchmark.log` + `benchmark.json`, stops on CRITICAL/POLICY_VIOLATION
- [x] `scripts/vanilla-veo-test.ts` created — standalone text-to-video test (no input image), confirmed API connectivity
- [x] Build + lint clean

### Pending / Not Started

- [x] **Directive 1:** Safety filter relaxation (`safetyFilterLevel: "block_only_high"` in veo.ts + benchmark)
- [x] **Directive 2:** Centralized `NEGATIVES` constant in imagen.ts, veo.ts, and benchmark
- [x] **Directive 3:** `scripts/frameExtract.ts` + chained pipeline in benchmark
- [x] **Directive 4:** Seed logging in SceneResult + benchmark.json output
- [x] **Directive 5:** FPV/POV rewrite of all 12 VIDEO_HINTS in benchmark script
- [x] veo.ts: strip "horror" from prompts, add explicit RAI warning log
- [x] Full benchmark run after all above are done
- [ ] Final deploy (`npm run deploy`) — NOT yet triggered

---
