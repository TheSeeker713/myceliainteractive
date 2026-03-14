# LIMINAL SIN FRONTEND AUDIT REPORT

## myceliainteractive vs FRONTEND_PLAN.txt (Backend Contract)
### March 14, 2026

> **Stack note:** FRONTEND_PLAN.txt specifies vanilla HTML+CSS+JS. The actual frontend uses **Next.js 16 + React 19 + TypeScript + Tailwind CSS**. This is acceptable given the pre-existing project structure. The audit evaluates functional parity regardless of tech stack.

---

## A. WS EVENT CONTRACT — Backend → Frontend

| Event | Handled? | File(s) | Issues |
|---|---|---|---|
| `session_ready` | **YES** | `GameWSContext.tsx`, `useGameHudGeneralEffects.ts` | Starts `ambient_cold_open`. Payload matches. |
| `scene_change` | **PARTIAL** | `GameWSContext.tsx`, `useGameHudGeneralEffects.ts` | **CRITICAL**: Frontend type has `payload: { sceneKey }` only — missing `mediaId`, `triggerType`, `timeoutSeconds`. **Frontend never loads Morphic stills/clips from GCS on scene_change** — only plays `glitch_low` SFX. |
| `scene_image` | **YES** | `GameWSContext.tsx`, `useGameHudGeneralEffects.ts` | Stores `payload.data` (base64) and pushes to `<img>`. Field match OK. |
| `scene_video` | **YES** | `GameWSContext.tsx`, `useGameHudGeneralEffects.ts` | Sets video `src` to `payload.url`. Missing `mediaId`, `triggerType`, `timeoutSeconds`, `audioMode` fields in type. Functional but incomplete type. |
| `agent_speech` | **YES** | `useAgentAudio.ts` | Full PCM decode pipeline. Expects `{ agent, audio }`. Matches backend. |
| `agent_interrupt` | **YES** | `useAgentAudio.ts` | Clears Jason source nodes, preserves Audrey queue. |
| `trust_update` | **YES** | `useGameHudGeneralEffects.ts` | Reads `trust_level` and `fear_index`. Matches backend code. |
| `card_discovered` | **YES** | `useGameHudScenarioEffects.ts` | Shows card overlay + plays `card_appear` SFX. |
| `dread_timer_start` | **YES** | `useGameHudScenarioEffects.ts` | Starts heartbeat escalation loop. |
| `game_over` | **YES** | `useGameHudScenarioEffects.ts` | Stops music/ambient, plays monster SFX, end overlay. |
| `good_ending` | **YES** | `useGameHudScenarioEffects.ts` | Stops timers, shows end overlay. |
| `slotsky_trigger` | **PARTIAL** | `useGameHudScenarioEffects.ts` | Handles: `anomaly_bells`, `anomaly_cards`, `anomaly_lights`, `anomaly_geometry`, `fourth_wall_correction`, `found_transition`. **MISSING 7 wildcard types** (see Section E). |
| `hud_glitch` | **YES** | `useGameHudGeneralEffects.ts` | CSS class applied and timed removal. |
| `overlay_text` | **YES** | `useGameHudGeneralEffects.ts` | Uses `durationMs` from payload. |
| `autoplay_advance` | **YES** | `useGameHudGeneralEffects.ts` | Debug text display. |
| `npc_idle_nudge` | **YES** | `useGameHudGeneralEffects.ts` | Shows "Talk to Jason" hint. |
| `player_speak_prompt` | **YES** | `useGameHudGeneralEffects.ts` | Activates trust meter + shows hint. |
| `hint` | **YES** | `useGameHudGeneralEffects.ts` | Shows hint text for 6s. |
| `video_gen_started` | **NO** | — | Not in ServerEvent union. Optional indicator. LOW priority. |
| `acecard_keyword_timer_start` | **NO** | — | **NOT HANDLED.** Should start heartbeat SFX escalation (30s). |
| `acecard_reveal_start` | **NO** | — | **NOT HANDLED.** Should play `acecard_reveal_01.mp4` from GCS + send `acecard_reveal_complete`. |
| `card_pickup_02_ready` | **NO** | — | **NOT HANDLED.** Should show card_pickup_02 still + card2 overlay. |
| `wildcard3_trigger` | **NO** | — | Not in ServerEvent union. |

---

## B. WS EVENT CONTRACT — Frontend → Backend

| Event | Sent? | File | Issues |
|---|---|---|---|
| `session_start` | **YES** | `GameWSContext.tsx` | `{ type: 'session_start', judge_mode }`. |
| `player_speech` | **YES** | `usePlayerMedia.ts` | `{ type: 'player_speech', audio, timestamp }`. |
| `player_frame` | **YES** | `usePlayerMedia.ts` | `{ type: 'player_frame', jpeg, timestamp }`. |
| `card_collected` | **YES** | `GameHUD.tsx` | `{ type: 'card_collected', cardId }`. |
| `intro_complete` | **YES** | `IntroSequence.tsx` | Sent at 11.5s. |
| `hallway_pov_02_ready` | **NO** | — | **NOT IN ClientEvent UNION. Never sent.** Blocks acecard timer + wildcard prewarm on backend. **CRITICAL.** |
| `acecard_reveal_complete` | **NO** | — | **NOT IN ClientEvent UNION. Never sent.** Blocks 15s card pickup window on backend. **CRITICAL.** |

---

## C. SCENE/MEDIA HANDLING

| Item | Status | Detail |
|---|---|---|
| **GCS_BASE constant** | **NO** | Audio uses GCS via `audioManifest.ts` (`https://storage.googleapis.com/liminal-sin-assets/audio/...`) but **no still/clip loading from GCS**. |
| **MORPHIC_MEDIA_IDS constant** | **NO** | Not defined. Spec calls for a Set of 19 media IDs. |
| **Morphic still loading** | **NO** | Frontend never loads stills from GCS. Only displays base64 images from `scene_image` events. |
| **Morphic clip loading** | **NO** | Only plays videos when `scene_video` arrives with a `url` field. Never proactively loads clips from GCS on `scene_change`. |
| **scene_change handling** | **BROKEN** | Only fires `glitch_low` SFX. No media loaded. Backend relies on this for scripted scene progression. |
| **Wildcard base64 fallback** | **YES** (default behavior) | All `scene_image` data treated as base64. No Morphic vs wildcard differentiation. |
| **`hallway_pov_02_ready` send** | **NO** | Never sent. |
| **`acecard_reveal_01` playback** | **NO** | Not implemented. |
| **`card_pickup_02` still** | **NO** | Not implemented. |

**Architecture Gap:** The frontend relies **entirely on the backend pushing base64 data or video URLs**. If the backend sends only `scene_change` with a `mediaId` (expecting the frontend to load from GCS), **nothing visual happens**.

---

## D. AUDIO SYSTEM

| Item | Status | Detail |
|---|---|---|
| **Web Audio PCM decode** | **YES** | `useAgentAudio.ts` — base64 → Int16 → Float32 → AudioBuffer at 24kHz. |
| **PCM sample rate** | **VERIFY** | AudioContext + AudioBuffers at **24kHz**. Spec says 16kHz. Gemini Live native audio may output 24kHz. If backend sends 16kHz → audio will be pitched-up/sped-up. |
| **SFX system** | **YES** | `useAudioLayers.ts` — variant randomization, anti-repeat, volume jitter. |
| **AUDIO_MANIFEST** | **GOOD** | Covers music tiers, ambient loops, glitch variants, slotsky SFX, trust/fear SFX, card SFX, heartbeat tiers, monster sounds, transmission effects. |
| **Music crossfade** | **YES** | Fade-out-then-fade-in crossfade pattern. |
| **Audrey low-pass filter** | **NO** | Uses ConvolverNode reverb + delay (0.15s) instead. No BiquadFilterNode at 2500Hz as spec requires. Functional but architecturally different. |
| **agent_interrupt truncation** | **YES** | Stops all Jason nodes, clears queue. Audrey preserved. |
| **Heartbeat escalation** | **PARTIAL** | `dread_timer_start` uses 30s/30s/30s phases. `acecard_keyword_timer_start` (30s total, 10s/10s/10s phases) not handled. |

---

## E. CARD/OVERLAY SYSTEM

| Item | Status | Detail |
|---|---|---|
| **card_discovered → overlay** | **YES** | SVG inline cards. Card1 = "J♣" (spec says Joker "J★"), Card2 = "Q♠" (matches). |
| **card_collected → send** | **YES** | Sends on click/tap. |
| **Trust meter** | **YES** | `TrustMeter.tsx` — bottom-right, TRUST + FEAR bars, purple/red scheme. Matches spec. |
| **Overlay text** | **YES** | Via `serverHint` state in `HintOverlays.tsx`. |

---

## F. ENDINGS

| Item | Status | Detail |
|---|---|---|
| **game_over screen** | **YES** | `DemoEndOverlay.tsx` — "GAME OVER" title. |
| **good_ending screen** | **YES** | "LIMINAL SIN" + "you made it out". Spec says "TO BE CONTINUED." — text differs. |
| **game_over Play Again** | **NO** | Only good_ending shows Play Again. Game over does not. |
| **Wildcard CSS treatments** | **NO** | 7 unhandled slotsky types: `wildcard_vision_feed_start`, `wildcard_vision_feed_end`, `wildcard_scare_sfx`, `wildcard_game_over_loading`, `wildcard_game_over_start`, `wildcard_good_ending_loading`, `wildcard_good_ending_start`. No VHS distortion / red-green tint / film grain implemented. |

---

## G. INTRO/ONBOARDING

| Item | Status | Detail |
|---|---|---|
| **Permission gate** | **YES** | `PermissionsGate` — mic failure = fatal, webcam failure = non-fatal continuation. |
| **Credits sequence** | **YES** | `IntroSequence.tsx` — 11.5s. Personalized credits (director/producer/music). Spec text differs but functional. |
| **intro_complete timing** | **YES** | Sent at 11.5s. |
| **Phase flow** | **YES** | `waiting → permissions → ready → intro → active`. Structurally equivalent to spec. |

---

## H. BUGS

### BUG 1 — `found_transition` ends session prematurely (P0)

**File:** `useGameHudScenarioEffects.ts`
**Issue:** `found_transition` slotsky type calls `setDemoEnded(true)`, `stopMusic()`, `stopAmbientLoop()`, sends `session_end`. Per spec and AGENTS.md, `found_transition` is a **cosmetic Slotsky pulse only**, NOT an ending trigger. Card2 collection triggers the actual ending via `good_ending`.
**Impact:** **Sessions will end prematurely** when the backend sends `found_transition`.

### BUG 2 — `anomaly_cards` triggers card overlay (P1)

**File:** `useGameHudScenarioEffects.ts`
**Issue:** The `anomaly_cards` slotsky handler calls `setShowCard(true)` with `card2` — showing a collectible card overlay. Per spec, Slotsky card anomaly is a **VHS CSS artifact**, not a gameplay trigger.
**Impact:** Players see a card overlay at the wrong time.

### BUG 3 — Dead `fmv_trigger` / `fmv_stop` handlers (P2)

**File:** `useGameHudGeneralEffects.ts`
**Issue:** References `/assets/fmv/${ev.sequence_id}.mp4` — path doesn't exist, backend never sends these events. Dead code from early iteration.

### BUG 4 — `session_end` type unrecognized by backend (P2)

**File:** `GameHUD.tsx`
**Issue:** Frontend sends `{ type: "session_end" }` but backend doesn't handle this message type. Silently dropped. Dead code.

### BUG 5 — `camera_obscured` ServerEvent type unused (P3)

**File:** `GameWSContext.tsx`
**Issue:** Defined in ServerEvent union but backend never sends it. Detection is client-side only. Type is unused.

---

## I. PRIORITY ACTION ITEMS

### P0 — Must Fix (Blocks Gameplay)

| # | Item | Files to Change |
|---|---|---|
| 1 | **Fix `found_transition` bug** — change from session-ending to cosmetic pulse only | `useGameHudScenarioEffects.ts` |
| 2 | **Handle `acecard_keyword_timer_start`** — add to ServerEvent, implement 30s heartbeat SFX | `GameWSContext.tsx`, `useGameHudScenarioEffects.ts` |
| 3 | **Handle `acecard_reveal_start`** — play `acecard_reveal_01.mp4` from GCS, send `acecard_reveal_complete` | `GameWSContext.tsx`, `useGameHudScenarioEffects.ts` |
| 4 | **Handle `card_pickup_02_ready`** — show GCS still + card2 overlay | `GameWSContext.tsx`, `useGameHudScenarioEffects.ts` |
| 5 | **Add `hallway_pov_02_ready` emission** — send when hallway_pov_02 media is displayed | `GameWSContext.tsx`, scene handling code |
| 6 | **Add `acecard_reveal_complete` emission** — send when acecard clip ends | `GameWSContext.tsx`, scene handling code |
| 7 | **Fix `anomaly_cards`** — remove card overlay trigger, add CSS distortion instead | `useGameHudScenarioEffects.ts` |
| 8 | **Handle 7 wildcard slotsky types** — CSS treatments for wildcard loading/start/end | `useGameHudScenarioEffects.ts`, CSS files |
| 9 | **Expand `scene_change` type** — add `mediaId`, `triggerType`, `timeoutSeconds` fields | `GameWSContext.tsx` |

### P1 — High Priority (Degrades Experience)

| # | Item |
|---|---|
| 10 | Add `GCS_BASE` + `MORPHIC_MEDIA_IDS` and implement Morphic media loading from GCS on `scene_change` |
| 11 | Add Audrey low-pass BiquadFilter at ~2500Hz |
| 12 | Add WS reconnect backoff logic (3 attempts: 1s, 3s, 5s) |
| 13 | Add game_over Play Again button |

### P2 — Polish

| # | Item |
|---|---|
| 14 | Implement wildcard HUD frame overlay (`#wildcard-hud`) |
| 15 | Preload first 3 Morphic stills |
| 16 | Remove dead `fmv_trigger`/`fmv_stop` handlers |
| 17 | Update `scene_change`/`scene_video` TypeScript types to full payload fields |

---

## J. FILE INVENTORY — Liminal Sin Game Code

| File | Purpose | Lines | Status |
|---|---|---|---|
| `app/ls/game/page.tsx` | Game shell + permissions gate | ~280 | Working |
| `app/ls/game/GameWSContext.tsx` | WS transport + event types | ~310 | Working — types incomplete |
| `app/ls/game/GameHUD.tsx` | Main HUD orchestrator | ~170 | Working |
| `app/ls/game/IntroSequence.tsx` | Cinematic intro (11.5s) | ~180 | Working |
| `app/ls/game/SceneVisualLayers.tsx` | Still/video layer rendering | ~100 | Working |
| `app/ls/game/useAgentAudio.ts` | NPC PCM audio pipeline | ~150 | Working — Audrey filter differs |
| `app/ls/game/useAudioLayers.ts` | SFX + music system | ~350 | Working |
| `app/ls/game/usePlayerMedia.ts` | Mic + webcam capture | ~280 | Working |
| `app/ls/game/useSceneCallbacks.ts` | Scene video ended handler | ~120 | Working |
| `app/ls/game/useGameHudEffects.ts` | Effect dispatcher | ~30 | Working — wrapper |
| `app/ls/game/useGameHudEffectTypes.ts` | Shared types for effects | ~50 | Working |
| `app/ls/game/useGameHudGeneralEffects.ts` | General WS event handlers | ~300 | Working — dead `fmv_*` code |
| `app/ls/game/useGameHudScenarioEffects.ts` | Scenario-specific handlers | ~200 | **2 BUGS** (found_transition, anomaly_cards) |
| `app/ls/game/useTrustAudioEffects.ts` | Trust-based audio cues | ~80 | Working |
| `app/ls/game/useGameError.ts` | Error queue management | ~40 | Working |
| `app/ls/game/audioManifest.ts` | SFX/music path manifest | ~200 | Working — uses GCS |
| `app/ls/game/CardCollectibleOverlay.tsx` | Card overlay + collect | ~120 | Working |
| `app/ls/game/DemoEndOverlay.tsx` | End screens | ~80 | Working — no game_over replay |
| `app/ls/game/ErrorOverlay.tsx` | Error display | ~60 | Working |
| `app/ls/game/GameErrorBoundary.tsx` | React error boundary | ~40 | Working |
| `app/ls/game/GMEyeIndicator.tsx` | GM "eye" status dot | ~30 | Working |
| `app/ls/game/HintOverlays.tsx` | Hint/overlay text display | ~50 | Working |
| `app/ls/game/StatusNotices.tsx` | Connection status notices | ~60 | Working |
| `app/ls/game/TrustMeter.tsx` | Trust/fear bar widget | ~80 | Working |
| `app/styles/game-animations.css` | Game CSS animations | ~200 | Working |
| `app/styles/game-animations-hud.css` | HUD-specific animations | ~100 | Working |
| `app/styles/game-effects.css` | Visual effect classes | ~150 | Working |

---

_LIMINAL SIN FRONTEND AUDIT — Mycelia Interactive_
_March 14, 2026_
_Audited against: FRONTEND_PLAN.txt (backend contract spec)_
_Backend: liminal-sin-server-00050-r2p @ Cloud Run_
_GCS: gs://liminal-sin-assets (us-west1, public reads)_
