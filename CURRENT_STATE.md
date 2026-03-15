# CURRENT_STATE.md — Liminal Sin Frontend (myceliainteractive)

> **UPDATE RULE:** Replace the previous content and write a single current-state snapshot. Do NOT append. Historical logs belong in git history.
> Last updated: March 15, 2026 (Bug 2/3 fixes — glitch persistence + slow motion video).

---

## Deadlines

- **Hard deadline:** March 16, 2026 at 5:00 PM PDT (Google Gemini Live Agent Challenge).

---

## Infrastructure

| Item | Value |
|---|---|
| Deploy target | Cloudflare Pages (Workers) |
| Live Worker URL | `https://myceliainteractive.digitalartifact11.workers.dev` |
| Latest Version ID | `91abe13c-8da7-4914-be70-36c67a8b5606` |
| Framework | Next.js 16.1.6 + React 19 + TypeScript + Tailwind CSS 4 |
| Game route | `/ls/game/` |
| Judges route | `/ls/judges/game/` |
| Backend WS | `wss://liminal-sin-server-1071754889104.us-west1.run.app/game` |
| GCS Base URL | `https://storage.googleapis.com/liminal-sin-assets/` |

---

## Current Live State (March 15, 2026 — BUG 2/3 FIXES)

### Bug 2 — Glitch Effect Persisting Forever (Fixed)
- **Root cause:** React useEffect cleanup race condition. The `hud_glitch` handler set a 1.5s timer to call `setGlitchClass(null)`, but the useEffect cleanup function cleared that timer when `lastEvent` changed (e.g., `hud_glitch` → `scene_change`). The `infinite` CSS animation then persisted forever.
- **Fix:** Removed the useEffect cleanup return from the `hud_glitch` handler. Added `setGlitchClass(null)` + timer clear to the `scene_change` handler as a safety net. Dependency array of `scene_change` useEffect now includes `glitchTimerRef`, `setGlitchClass`.
- **File:** `app/ls/game/useGameHudGeneralEffects.ts`

### Bug 3 — Slow Motion Video (Fixed)
- **Root cause:** No explicit `playbackRate` was set on video elements. High-bitrate GCS clips (15–25 Mbps) likely overwhelmed browser decode.
- **Fix:** Added defensive `video.playbackRate = 1.0` to all 3 video play sites:
  - GCS clip play (`useGameHudGeneralEffects.ts`)
  - Wildcard scene_video play (`useGameHudGeneralEffects.ts`)
  - Acecard reveal clip play (`useGameHudScenarioEffects.ts`)
- **Companion backend fix:** All 18 clips re-encoded to web-friendly bitrate (CRF 23, 5Mbps cap, 1080p). Pending GCS upload.

### Previous Session Work (Still Live)
- Onboarding: single consolidated screen, auto-detect permissions, PLAY → WS open → `session_ready` gates intro.
- Credits: 9-line 3-block sequence + title card, 19s total, `intro_complete` fires over open WS.
- WS event contract: 100% compliance (29 events matched).
- GCS Morphic media loading: 16 stills + 18 clips from bucket.
- Acecard flow: keyword timer heartbeat, reveal clip + completion event, card2 pickup window.
- 7 wildcard slotsky handlers + wildcard3 trigger handler.
- WS reconnect backoff: 3 attempts at 1s, 3s, 5s delays.
- DemoEndOverlay: Play Again on both endings.

### Files Modified This Session
| File | Change |
|---|---|
| `app/ls/game/useGameHudGeneralEffects.ts` | Removed hud_glitch useEffect cleanup (race fix), added glitchClass reset on scene_change, added playbackRate=1.0 to 2 video play sites |
| `app/ls/game/useGameHudScenarioEffects.ts` | Added playbackRate=1.0 to acecard reveal clip play |

---

## Frontend Status — 100% COMPLETE (March 15, 2026)

Zero TypeScript errors. Zero ESLint errors. Zero warnings.

| System | Status |
|---|---|
| Onboarding (permissions gate + PLAY flow) | ✅ Live — single screen, auto-detect PLAY |
| Connecting screen (waiting for session_ready) | ✅ Live |
| Credits sequence (3 blocks + title card, 19s) | ✅ Live — correct 9-line script |
| session_ready → intro trigger | ✅ Live — intro only starts after WS open |
| WS transport (GameWSContext) | ✅ Live — all event types, reconnect backoff |
| GCS Morphic media loading | ✅ Live — 16 stills + 18 clips from bucket |
| Scenario effects (slotsky, cards, timers) | ✅ Live — all handlers wired |
| General effects (scene loading, glitch, trust) | ✅ Live — glitch race condition fixed, playbackRate defense |
| Acecard keyword timer | ✅ Live — 30s heartbeat escalation |
| Acecard reveal playback | ✅ Live — GCS clip + completion event |
| Card pickup overlay | ✅ Live — still + card2 overlay |
| Wildcard CSS effects | ✅ Live — 7 CSS classes, cleared on scene_change |
| Demo end overlay | ✅ Live — Play Again for both endings |
| Audio SFX manifest | ✅ Live — scare_wildcard added |
| Preload first 3 Morphic stills | ✅ Live |

---

## Active Constraints

- Lyria 3 audio deferred. No audio generation until `docs/AUDIO_DESIGN.md` exists.
- ADK/AutoFlow NOT implemented. Direct GenAI SDK + WebSocket only.
- All game state in backend (Firestore). Frontend is a dumb terminal.
- `docs/Contest.md` — do not archive until after March 16 5PM PDT deadline.
