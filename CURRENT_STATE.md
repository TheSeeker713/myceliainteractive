# CURRENT_STATE.md — myceliainteractive
> **AI WORKING MEMORY** — This file is overwritten at the start of every new AI session.
> Last updated: March 9, 2026 (full sprint — Steps E + F complete, audio system live, barge-in wired)

---

## ⚠️ NEXT AI SESSION — READ THIS FIRST

### Completed — March 9, 2026 (full sprint)

**Bugs fixed:**
1. **SIGNAL LOST bug** — `app/ls/judges/game/page.tsx` was missing the `connect()` call. Fixed. Judge game wrapper now connects to Cloud Run WS.
2. **NotReadableError: Device in use** — `usePlayerMedia.ts` was calling `getUserMedia` twice due to React effect re-fire on status transitions. Fixed by adding `captureStartedRef` guard — `getUserMedia` is now called exactly once per session activation.

**Steps E + F complete:**
3. **Step F — Voice interrupt / barge-in** — `agent_interrupt` WS event now cancels all queued `AudioBufferSourceNode`s in `GameHUD.tsx` immediately. Player can speak over JASON mid-sentence and cut him off.
4. **Step E — Layered audio system** — Three new files created:
   - `app/ls/game/audioManifest.ts` — 28 audio event keys → string[] file path pools (83 total audio files mapped). Pure constants, no logic.
   - `app/ls/game/useAudioLayers.ts` — 3-channel Web Audio hook: `musicGain` (0.3) / `sfxGain` (0.8) / `ambientGain` (0.5). Functions: `preloadAll`, `playSFX`, `playMusic`, `crossfadeMusic`, `stopMusic`, `startAmbientLoop`, `stopAmbientLoop`, `playSequence`.
   - `GameHUD.tsx` — updated to import and wire all 25 WS events → audio triggers. New refs tracking threshold crossings for tier-based music swaps.
   - Anti-repeat randomization: session-locked music variant pre-pick, SFX never repeats same variant twice consecutively, ±8% volume micro-jitter per play.
   - All 25 WS event → audio trigger mappings wired, including: `session_ready` → ambient loop start, first Jason speech → `voicebox_activate` + `music_intro`, fear threshold 0.6/0.85/0.9 crossing → music crossfades, `found_transition` → 8s silence then ambient loop.

---

## ⚠️ PENDING — NEXT SESSION PRIORITIES

### Priority 1 — Jason's Voice Change (MUST DO BEFORE DEMO)
Current voice in backend `gemini.ts` line ~195: `prebuiltVoiceConfig: { voiceName: 'Fenrir' }`
User needs to test all available voices in browser first, then pick the best one.

**Available Gemini Live prebuilt voices (2026 GA):**
`Puck` `Charon` `Kore` `Fenrir` `Aoede` `Orbit` `Zephyr` `Leda` `Callisto` `Constellation` `Vesper` `Nova` `Rigel` `Umbriel` `Algenib` `Achernar` `Alnair` `Schedar`

**Voice test page plan:**
1. Create `public/voice-test.html` — static self-contained HTML (no Next.js build needed)
2. Page has a dropdown of all prebuilt voices + a text input for a test line
3. On submit → connects to Cloud Run WS with a `voice_override` param → hears JASON speak with that voice
4. User picks best masculine/cinematic/horror voice
5. Dev: backend `gemini.ts` reads `process.env.JASON_VOICE ?? 'Fenrir'`
6. Set `JASON_VOICE=<chosen>` in Cloud Run env → no redeploy needed

### Priority 2 — iOS / Cross-Device Compatibility (AudioContext conflict)
`usePlayerMedia.ts` creates its own `AudioContext` at 16kHz for mic capture.
`GameHUD.tsx` creates a second `AudioContext` at 24kHz for audio playback.
**iOS Safari silently fails if two AudioContexts are open.** Mobile will break.

**Fix:** Pass `audioCtxRef` from `GameHUD.tsx` down into `usePlayerMedia` — share the single context. The mic processing `ScriptProcessorNode` runs on the same context as playback (different sample rates are handled via `AudioContext.sampleRate` and resampling).

**Files to touch:** `GameHUD.tsx` (pass ref down) + `usePlayerMedia.ts` (accept ctx instead of creating own).

### Priority 3 — echoCancellation Constraint (prevents music bleed into mic)
Without this, speakers playing music/SFX will bleed into the mic and confuse JASON's VAD.
In `usePlayerMedia.ts`, update `getUserMedia`:
```ts
audio: {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  // Note: omit sampleRate on iOS — causes constraint errors
}
```

### Priority 4 — GCS Audio File Storage (MUST DO before deploy)
83 audio files in `public/assets/` must NOT be deployed via Cloudflare Pages.
Cloudflare Pages has a 25MB **per-file** deploy limit. Large music MP3s may fail.
Also: bloats git history permanently if committed.

**Decision: Google Cloud Storage bucket — `gs://liminal-sin-assets`**
- GCP project: `project-c4c3ba57-5165-4e24-89e` (same GCP project as backend)
- CORS configured to allow `myceliainteractive.com`
- Public URL: `https://storage.googleapis.com/liminal-sin-assets/audio/music/<file>.mp3`
- After uploading: update `audioManifest.ts` — replace `/assets/music/` → GCS URLs
- Add `public/assets/music/` and `public/assets/sound_fx/` to `.gitignore`

**GCS setup commands (run once):**
```bash
gcloud storage buckets create gs://liminal-sin-assets \
  --project=project-c4c3ba57-5165-4e24-89e --location=us-west1 \
  --uniform-bucket-level-access
gcloud storage buckets add-iam-policy-binding gs://liminal-sin-assets \
  --member=allUsers --role=roles/storage.objectViewer
gcloud storage cp -r "public/assets/music/*" gs://liminal-sin-assets/audio/music/
gcloud storage cp -r "public/assets/sound_fx/*" gs://liminal-sin-assets/audio/sfx/
```

### Priority 5 — User action pending
Rename `Psychosis_Apparatus_2026-03-08T204945 (1).mp3` → `music_psychosis.mp3` in `public/assets/music/`.
This is the file mapped to `fourth_wall_correction` key in `audioManifest.ts`.

---

## Step Progress Tracker

| Step | Feature | Status |
|---|---|---|
| A | Backend Cloud Run server running | ✅ Complete |
| B | Frontend WS connects on button click | ✅ Complete |
| C | Mic capture — raw PCM 16kHz stream | ✅ Complete |
| D | JASON dialogue — back and forth, in-lore | ✅ Complete |
| E | Layered audio system (music/SFX/ambient) | ✅ Complete (GCS migration pending) |
| F | Voice interrupt / barge-in | ✅ Complete |
| G | JASON voice — browser test + change | ⏳ Next session |
| H | iOS cross-device compatibility | ⏳ Next session |
| I | echoCancellation constraint | ⏳ Next session |
| J | GCS audio storage + audioManifest URL update | ⏳ Next session |
| K | GM trust routing battle-tested end-to-end | ⏳ Pending |
| L | Demo video (4 min, mandatory submission) | ⏳ March 11–14 |
| M | Architecture diagram (mandatory submission) | ⏳ March 13–15 |

---

## Timeline

| Date | Milestone |
|---|---|
| March 9, 2026 (today) | Steps E + F complete and pushed |
| March 10, 2026 | Voice change + iOS fix + echoCancellation + GCS migration |
| **March 11, 2026 @ 11:11 PM MT** | **Internal prototype cutoff — full demo functional** |
| March 12–14 | Demo video recording + architecture diagram |
| March 15 | Submission prep, final review |
| **March 16, 2026 @ 5:00 PM PDT** | **HARD DEADLINE — CONTEST SUBMISSION** |

---

## Project Identity

| Field | Value |
|---|---|
| **Site** | myceliainteractive.com |
| **Stack** | Next.js 16, React 19, Tailwind v4, Cloudflare Pages + Workers, D1 |
| **Deploy** | `npm run deploy` → `next build && wrangler deploy` |
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
| `app/ls/game/page.tsx` | Game UI shell — wrapper for Google Cloud game |
| `app/ls/game/GameWSContext.tsx` | WebSocket context — deferred connect, sceneImage state |
| `app/ls/game/GameHUD.tsx` | Game HUD — 3-layer audio wired, agent_interrupt, SM wiring for all 25 WS events |
| `app/ls/game/usePlayerMedia.ts` | Mic + webcam capture — ScriptProcessorNode 16kHz PCM, 1FPS JPEG, captureStartedRef guard |
| `app/ls/game/audioManifest.ts` | Audio event keys → file path pools (28 keys, 83 files, pure constants) |
| `app/ls/game/useAudioLayers.ts` | 3-channel Web Audio hook (musicGain / sfxGain / ambientGain) |
| `app/ls/judges/game/page.tsx` | Judge game shell — judgeMode=true |

---

## Audio System — Architecture (Step E)

### 3-Channel Gain Structure
| Channel | GainNode | Default Gain | What plays |
|---|---|---|---|
| Music | `musicGain` | 0.3 | Looped background music tracks with crossfading |
| SFX | `sfxGain` | 0.8 | One-shot sound effects triggered by WS events |
| Ambient | `ambientGain` | 0.5 | Looped ambient environment sounds |

### Randomization Strategy
- **Music variants**: session-locked pre-pick at `session_ready` (e.g. `music_intro_2` for this entire session, won't switch mid-session unless `crossfadeMusic()` fires)
- **SFX anti-repeat**: `lastSfxVariant` map prevents same variant playing twice consecutively
- **Volume jitter**: every play is ±8% of nominal gain (micro-variation for organic feel)

### audioManifest.ts Keys (28 keys)
`session_start` `voicebox_activate` `voicebox_deactivate` `ambient_tunnel_loop` `ambient_static_loop` `music_intro` `music_tension` `music_climax` `music_psychosis` `fourth_wall_correction` `npc_glitch_tier1` `npc_glitch_tier2` `npc_glitch_tier3` `slotsky_shadow` `slotsky_flicker` `slotsky_whisper` `slotsky_mirror` `slotsky_shatter` `trust_drop_warning` `trust_drop_low` `trust_rebuild` `found_transition` `heartbeat_pulse` `static_surge` `breath_stutter` `horror_sting` `footstep_loop` `water_drip`

### File counts
- `public/assets/music/` — 17 files: 6x `music_intro_N`, 6x `music_tension_N`, 4x `music_climax_N`, 1x `music_psychosis`
- `public/assets/sound_fx/` — 66 files across all SFX keys (most have `_1`–`_4` variants)

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
- `app/components/FPVCarousel.tsx` — crossfade carousel, random 12–24s intervals

---

## Known Issues (NOT bugs, design decisions deferred)

| Issue | Status | Notes |
|---|---|---|
| iOS dual AudioContext | ⏳ Deferred | Two AudioContexts (playback + mic) — iOS Safari will silently fail. Fix: share single ctx. |
| Music bleed into mic | ⏳ Deferred | echoCancellation not yet set on getUserMedia. Needed for speaker setups. |
| Large audio files in git | ⏳ Deferred | 83 MP3s not committed — stored locally. GCS migration needed before production deploy. |
| `music_psychosis.mp3` wrong filename | ⏳ Pending user | User must rename `Psychosis_Apparatus_...mp3` → `music_psychosis.mp3` |