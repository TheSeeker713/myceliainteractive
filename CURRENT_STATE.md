# CURRENT_STATE.md — myceliainteractive
> **AI WORKING MEMORY** — Updated at the end of each session.
> Last updated: March 6, 2026

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
| `app/ls/game/` | Game UI shell — WebSocket client (IN PROGRESS) |

---

## Cloudflare AI — Workers AI Binding
- [x] `wrangler.jsonc` — `ai` binding wired (`env.AI`)
- [x] `workers/globals.d.ts` — `AI: any` added to `Env`
- [x] `GET /api/ai/image?seed={0-11}` — Flux 1 Schnell FPV image generation, 12-seed cap, 24h edge cache
- [x] `app/components/FPVCarousel.tsx` — crossfade carousel, random 12–24s intervals, `unoptimized` images
- [ ] `GET /api/ai/tts` — Deepgram ambient voiceover endpoint (PENDING)
- [ ] Dynamic copy mutations via Llama 3 (OPTIONAL)

## Game UI Shell — app/ls/game/ (IN PROGRESS)
- [ ] WebSocket context provider (`GameWSContext`)
- [ ] Microphone capture → `player_speech` events
- [ ] Webcam capture at 1 FPS → `player_frame` events
- [ ] Agent audio playback via Web Audio API
- [ ] HUD overlay: cracked glasses effect + trust indicator
- [ ] FMV video sequence rendering on `fmv_trigger` events
- [ ] `NEXT_PUBLIC_GAME_WS_URL` env var wired
