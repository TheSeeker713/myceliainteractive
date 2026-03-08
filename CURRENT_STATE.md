# CURRENT_STATE.md — myceliainteractive
> **AI WORKING MEMORY** — Updated at the end of each session.
> Last updated: March 6, 2026 (session 2)

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
| `app/ls/game/GameWSContext.tsx` | WebSocket context provider (shell, not yet wired to GC URL) |
| `app/ls/game/GameHUD.tsx` | HUD overlay component shell |
| `app/ls/game/usePlayerMedia.ts` | Mic + webcam capture hook (shell) |
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

### Still needed to make it functional
- [ ] `NEXT_PUBLIC_GAME_WS_URL` env var wired in `.env.local` + Cloudflare Pages dashboard
- [ ] `GameWSContext` actually connects to real GC WebSocket URL and sends `session_start`
- [ ] Microphone audio → base64 chunks → `player_speech` events over WebSocket
- [ ] Webcam at 1 FPS → JPEG → base64 → `player_frame` events over WebSocket
- [ ] Agent audio playback: receive `agent_speech` → decode base64 → Web Audio API
- [ ] HUD: trust indicator driven by `trust_update` events
<!-- DEFERRED: cracked glasses glitch overlay — smart glasses system deferred to roadmap (March 7, 2026) -->
<!-- - [ ] HUD: cracked glasses glitch overlay driven by `hud_glitch` events -->
<!-- DEPRECATED: FMV video rendering — FMV pipeline replaced by Imagen 3 live generation (March 7, 2026 pivot) -->
<!-- - [ ] FMV video rendering on `fmv_trigger` / `fmv_stop` events -->
- [ ] Imagen 3 scene background rendering triggered by backend `scene_change` events

### March 7, 2026 - Cross-Repo Update
- The backend (`liminal-sin-gemini`) has completed Phase 1+2: `LiveSessionManager` built, Cloud Run live and confirmed healthy.
- Backend has defined VAD logic and webcam 1 FPS logic requirements for the frontend. See `documents/BACKEND_SIGNALS.md` for details.

### March 7, 2026 - Strategic Pivot
- **ElevenLabs TTS dropped** — subscription expires in 2 days. All NPC voice output now uses Gemini Live native `voiceConfig`.
- **FMV pipeline dropped** — pre-generated clip library not achievable in 4-day timeline. Replaced by **Imagen 3 live generation** per `scene_key` trigger.
- **Demo scope:** Jason-only interactive NPC. Audrey = echo background only. Josh = deferred to roadmap.
- **NPC voices (Gemini Live native):** Jason = `Fenrir`, Audrey = `Aoede`.
- **New frontend event:** `scene_change` (replaces deprecated `fmv_trigger`/`fmv_stop`) — see TEAM_CONTRACT.md §3 for updated event contract.
- **Smart glasses/HUD system** deferred to roadmap — cracked glasses effect removed from demo scope.

