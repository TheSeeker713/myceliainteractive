# CURRENT_STATE.md — myceliainteractive
> **AI WORKING MEMORY** — Updated at the end of each session.
> Last updated: March 8, 2026 (late evening — Steps B/C/D live, mic bug diagnosed)

---

## Project Identity

| Field | Value |
|---|---|
| **Site** | myceliainteractive.com |
| **Stack** | Next.js 16, React 19, Tailwind v4, Cloudflare Pages + Workers, D1 |
| **Deploy** | `npm run deploy` → `next build && wrangler deploy` |
| **Worker name** | `myceliainteractive` |
| **D1 Database** | `liminal-sin-signups` — ID: `cb37396d-6a97-43e7-b492-94a1eb4647b7` |

---

## Cloudflare Secrets (encrypted, never in code)

| Name | Purpose |
|---|---|
| `ADMIN_TOKEN` | Secures `POST /api/set-game-live` endpoint |
| `BREVO_API_KEY` | Brevo transactional email API (free tier, 300/day) |

---

## Completed Work

### Landing Page — myceliainteractive.com/ls
- [x] Navbar with logo + nav links
- [x] Full-screen hero with FMV backdrop image + neon flicker CTA button
- [x] Vegas Underground lore section with layer table (Layers 0–4)
- [x] Trust System 3-column card grid (Neutral / High Trust / Low Trust)
- [x] "What Awaits You" 6-feature grid
- [x] Signup forms section — Judge form (cyan) + Beta Tester form (magenta)
- [x] Footer
- [x] Desktop disclaimer

### Judge Backdoor — myceliainteractive.com/ls/judges
- [x] Full-viewport atmospheric page — "SIGNAL AUTHORIZED"
- [x] ENTER THE UNDERGROUND button → `NEXT_PUBLIC_GAME_URL ?? "#"`

### Backend — Cloudflare Worker + D1
- [x] `POST /api/signup` — validates input, writes to D1, sends Email 1 via Brevo
- [x] `POST /api/set-game-live` — Bearer token protected, flips `settings.game_live = 1`
- [x] Cron `* * * * *` — scans for `email1_sent=1 AND email2_sent=0` when game_live=1, sends Email 2
- [x] D1 schema: `signups` (id, name, email, type, created_at, email1_sent, email2_sent) + `settings` (key, value)
- [x] `BREVO_API_KEY` + `ADMIN_TOKEN` stored as Cloudflare encrypted secrets
- [x] `npm run deploy` script chains build + deploy — prevents stale asset uploads

### Email System
- [x] Email 1: Instant welcome on signup — sent via Brevo to any email address
- [x] Email 2: "The Underground Is Open" — sent by cron after admin flips game_live flag
- [x] SPF record: `v=spf1 include:_spf.mx.cloudflare.net ~all` confirmed on domain
- [x] From address: `access@myceliainteractive.com` (Email Routing → admin inbox)
- [x] Email 1 delivery confirmed via live test — signup flow end-to-end verified

---

## How to Flip Game Live (when ready)

```bash
curl -X POST https://myceliainteractive.com/api/set-game-live \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```
Within 60 seconds all signed-up users receive Email 2.

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
| `app/ls/game/page.tsx` | Game UI shell — wrapper for Google Cloud game |
| `app/ls/game/GameWSContext.tsx` | WebSocket context — connected to Cloud Run WS, deferred connect, sceneImage state |
| `app/ls/game/GameHUD.tsx` | Game HUD — Imagen 4 crossfade background, AudioContext playback, Begin Session button |
| `app/ls/game/usePlayerMedia.ts` | Mic + webcam capture — ScriptProcessorNode 16kHz PCM, 1FPS JPEG frames |
| `app/ls/judges/game/page.tsx` | Judge game shell — same as above with `judgeMode=true` |

---

## Cloudflare AI — Workers AI Binding
- [x] `wrangler.jsonc` — `ai` binding wired (`env.AI`)
- [x] `workers/globals.d.ts` — `AI: any` added to `Env`
- [x] `GET /api/ai/image?seed={0-11}` — Flux 1 Schnell FPV image generation, 12-seed cap, 24h edge cache
- [x] `app/components/FPVCarousel.tsx` — crossfade carousel, random 12–24s intervals, `unoptimized` images
- [ ] `GET /api/ai/tts` — Deepgram ambient voiceover endpoint (PENDING)
- [ ] Dynamic copy mutations via Llama 3 (OPTIONAL)

## Game UI Shell — app/ls/game/ + app/ls/judges/game/

> **Architecture note**: The actual game runtime lives on Google Cloud Run (`liminal-sin-gemini`). These Next.js pages are thin **wrapper shells** — they provide the browser client that connects to the GC WebSocket server. All game logic lives in the backend.

### Shell files created (committed)
- [x] `app/ls/game/page.tsx` — Player game wrapper page shell ("ENTER" splash → begin session)
- [x] `app/ls/game/GameWSContext.tsx` — WebSocket context provider (structure in place)
- [x] `app/ls/game/GameHUD.tsx` — HUD overlay component shell
- [x] `app/ls/game/usePlayerMedia.ts` — Mic + webcam `getUserMedia` capture hook
- [x] `app/ls/judges/game/page.tsx` — Judge variant, passes `judgeMode: true` in `session_start`

### Completed — March 8, 2026 (Steps B/C/D live)
- [x] `NEXT_PUBLIC_GAME_WS_URL=wss://liminal-sin-server-1071754889104.us-west1.run.app` — set in `.env.production` + Cloudflare Pages dashboard
- [x] WS deferred to "Begin Session" click (satisfies AudioContext autoplay policy)
- [x] `GameWSContext.tsx` — connects to Cloud Run WS, `session_ready` received ✅
- [x] Agent audio playback — `agent_speech` events → decode base64 PCM → Web Audio API ✅ **JASON SPEAKS INTRO**
- [x] Webcam at 1 FPS → JPEG → base64 → `player_frame` events — ✅ WORKING
- [x] **Imagen 4 scene background** — `scene_image` WS event → `<img>` crossfade CSS background ✅ **TUNNEL IMAGE VISIBLE**
- [x] `usePlayerMedia.ts` — `ScriptProcessorNode` at 16kHz, Float32→Int16 PCM, base64, sends `player_speech`

### ❌ ACTIVE BUG — Microphone → JASON not working
**Console error (Chrome DevTools, March 8 2026):**
```
[usePlayerMedia] Media access error: NotReadableError: Device in use
```
**Root cause:** `usePlayerMedia` `useEffect` watches `status` from `useGameWS()`. When status transitions `connecting` → `open`, the effect re-fires. The `stopAll()` cleanup calls `void micCtxRef.current?.close()` (not awaited). If the old AudioContext hasn't fully released the mic hardware before the NEW `getUserMedia({audio:true, video:true})` call fires, Chrome throws `NotReadableError: Device in use`.

**Fix (next session — IMMEDIATE):**
- Add `const isCapturing = useRef(false)` guard — only call `getUserMedia` once, skip re-entry
- OR: expose `startCapture()` function from the hook, call it once from `GameHUD.tsx` after `session_ready` fires (not on every `status` re-render)
- Do NOT create a second AudioContext — `GameHUD.tsx` already has one open for playback

### Still pending
- [ ] Fix `NotReadableError: Device in use` in `usePlayerMedia.ts` **(NEXT — IMMEDIATE)**
- [ ] Step E: Three-channel Web Audio (Jason 1.0 / ambient 0.6 / music 0.3) with `fadeIn`, `fadeOut`, `setVolume`, `loop`
- [ ] HUD: trust level indicator driven by `trust_update` WS events
<!-- DEFERRED: cracked glasses glitch overlay — smart glasses system deferred to roadmap (March 7, 2026) -->
<!-- - [ ] HUD: cracked glasses glitch overlay driven by `hud_glitch` events -->
<!-- DEPRECATED: FMV video rendering — FMV pipeline replaced by Imagen 4 live generation (March 7, 2026 pivot) -->
<!-- - [ ] FMV video rendering on `fmv_trigger` / `fmv_stop` events -->

### March 7, 2026 - Cross-Repo Update
- The backend (`liminal-sin-gemini`) has completed Phase 1+2: `LiveSessionManager` built, Cloud Run live and confirmed healthy.
- Backend has defined VAD logic and webcam 1 FPS logic requirements for the frontend. See `documents/BACKEND_SIGNALS.md` for details.

### March 7, 2026 - Strategic Pivot
- **ElevenLabs TTS dropped** — subscription expires in 2 days. All NPC voice output now uses Gemini Live native `voiceConfig`.
- **FMV pipeline dropped** — pre-generated clip library not achievable in 4-day timeline. Replaced by **Imagen 4 live generation** per `scene_key` trigger.
- **Demo scope:** Jason-only interactive NPC. Audrey = echo background only. Josh = deferred to roadmap.
- **NPC voices (Gemini Live native):** Jason = `Fenrir`, Audrey = `Aoede`.
- **New frontend event:** `scene_change` (replaces deprecated `fmv_trigger`/`fmv_stop`) — see TEAM_CONTRACT.md §3 for updated event contract.

### March 8, 2026 - Session Update (morning)
- **Cracked screen refs commented out** — `GameHUD.tsx` cracked glass overlay div wrapped in `{false && ()}` — never renders, original code preserved.
- **FMV architecture clarified** — This IS an FMV game. Videos loop per zone. Live Gemini audio plays over video. Imagen 4 generates new scene images on `triggerSceneChange` GM event.
- **Jason POV confirmed** — Everything is first-person. "Smart Glasses" is a frontend UI label only — never in any Imagen prompt text.
- **"Ignore commented content" rule** added to AGENTS.md (both repos) — Rule 5
- **Backend GM session fixed** — AUDIO modality, `sendToolResponse`, `callId`, trust enum mapping (liminal-sin-gemini repo)

### March 8, 2026 - Session Update (evening — Steps B/C/D)
- **Steps B, C, D COMPLETE and LIVE in production**
- **Step B (Imagen 4):** `server/services/imagen.ts` created with 7 zone prompts. `triggerSceneChange` → Imagen 4 → `scene_image` WS event → frontend crossfade renders ✅
- **Step C (scene_image rendering):** `GameWSContext.tsx` receives `scene_image`, `GameHUD.tsx` renders as crossfade `<img>` background ✅ Tunnel image visible in browser
- **Step D (webcam frame pipe):** `usePlayerMedia.ts` 1FPS JPEG → `player_frame` WS event → `gmManager.sendFrame()` ✅ Webcam confirmed working
- **JASON speaks intro** — confirms WS connect ✅, session_ready ✅, agent_speech PCM playback ✅
- **IAM permissions fixed** — Cloud Run SA granted `roles/aiplatform.user` + `roles/datastore.user`
- **WSS URL corrected** — `.env.production` now uses numbered URL (canonical redirects break WS upgrades)
- **AudioContext autoplay fix** — deferred WS connect + AudioContext creation to "Begin Session" button click
- **MediaRecorder → ScriptProcessorNode** — Gemini Live requires raw PCM 16kHz, not Opus/WebM
- **❌ Active bug:** `[usePlayerMedia] Media access error: NotReadableError: Device in use` — mic not reaching JASON (see ACTIVE BUG section above)

