# AGENTS.md — Mycelia Interactive (Frontend Repo)

> **This file lives permanently at the project source root.**
> `AGENTS.md`, `README.md`, and `TEAM_CONTRACT.md` cannot be moved, renamed, replaced, or deleted without the user's explicit command or permission.

---

## 1. Identity & Purpose

**Mycelia Interactive** (`myceliainteractive`) is the **public-facing frontend repo** for the Liminal Sin project. It owns everything the user sees and touches in a browser:

| Surface | Path | Status |
|---|---|---|
| **Marketing shell** | `myceliainteractive.com/ls` | Live |
| **Game UI shell** | `myceliainteractive.com/ls/game` | Pending |
| **Judge panel** | `myceliainteractive.com/ls/judges` | Live |
| **Company homepage** | `myceliainteractive.com` | Live |

The **backend** — AI agents, Gemini Live, Cloud Run, Firestore — lives in the sibling repo `liminal-sin-gemini`. The two repos are one project. Read `TEAM_CONTRACT.md` to understand the boundary between them.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Framework** | Next.js (App Router) | TypeScript, deployed via Cloudflare Pages |
| **Styling** | Tailwind CSS 4.x | Utility-first, dark horror palette |
| **Runtime** | Cloudflare Workers | API routes, signup handler |
| **Database** | Cloudflare D1 | `liminal-sin-signups` — signups, settings |
| **Email** | Brevo Transactional API | Key stored as CF secret `BREVO_API_KEY` |
| **Deploy** | `npm run deploy` | Chains `next build` + `wrangler deploy` |
| **Repo** | GitHub: `TheSeeker713/myceliainteractive` | CI connected to Cloudflare |

### Cloudflare AI (Frontend Only)
Cloudflare Workers AI models (Flux image gen, Deepgram TTS, etc.) may be used **on the marketing shell and frontend UI only**. They must NEVER be used for core game agent logic — that is exclusively Gemini Live on Google Cloud. See `TEAM_CONTRACT.md` §4.

---

## 3. Project Structure

```
app/
  ls/
    page.tsx          ← Landing page (marketing shell)
    SignupForms.tsx   ← Signup form component
    game/             ← Game UI shell (PENDING — connects to LS backend)
  layout.tsx
  globals.css
workers/
  signup-api.ts       ← CF Worker: signup API, Brevo email, cron
public/
  assets/
TEAM_CONTRACT.md      ← Shared coordination doc with liminal-sin-gemini
AGENTS.md             ← This file
```

---

## 4. Frontend Workflow — `/ls` and `/ls/game`

### `/ls` — Marketing Shell
- Pure Next.js static/SSR pages. No game logic.
- Cloudflare D1 for signups. Brevo for transactional email.
- Cloudflare AI tools **permitted** here for atmospheric assets (images, ambient audio).
- Deploy: `npm run deploy` from repo root.

### `/ls/game` — Game UI Shell
- This is the **browser client** that connects to the Liminal Sin backend.
- It communicates with the `liminal-sin-gemini` Cloud Run backend via **WebSocket**.
- The WebSocket URL is defined in an environment variable: `NEXT_PUBLIC_GAME_WS_URL`.
- During development, point this to the **mock WebSocket server** (see `TEAM_CONTRACT.md` §3).
- During production, point to the Cloud Run endpoint.
- The UI shell is responsible for:
  - Capturing microphone input → sending to backend
  - Capturing webcam frames → sending to backend (1 FPS JPEG)
  - Receiving agent audio responses → playing via Web Audio API
  - Rendering HUD overlays — **Trust Meter is a permanent, always-on UI feature** (see §11 and `documents/SHOT_SCRIPT.md` FRONTEND NOTE section for full spec)
  <!-- DEFERRED: cracked glasses HUD effect — smart glasses system deferred to roadmap (March 7, 2026) -->
  <!-- DEPRECATED: FMV video sequences — replaced by Imagen 4 live scene generation (March 7, 2026 pivot) -->
  - Rendering **Imagen 4** scene backgrounds triggered by backend `scene_change` and `scene_image` events
  - Playing **Veo 3.1 Fast** video loops triggered by backend `scene_video` events
  - Rendering card collectible overlays on `card_discovered` events; sending `card_collected` on player click
  - Running dread timer SFX escalation autonomously on `dread_timer_start` (no UI indicator — invisible to player)
  - Rendering GAME OVER and GOOD ENDING screens on `game_over` / `good_ending` events

### Key Principle
The game UI is a **dumb terminal**. It sends player input and renders what the backend tells it to render. All game logic, trust state, and agent decisions live in `liminal-sin-gemini`. Never embed game logic in the UI.

---

## 5. Core Rules

1. **Read Before Acting** — Read this file and `TEAM_CONTRACT.md` before generating any plan or writing any code.
2. **Blind Obedience** — Rules in this file supersede default AI behaviors.
3. **Acknowledge** — Begin every response with `"AGENTS.md acknowledged"`.
4. **Protected Files** — `AGENTS.md`, `README.md`, `TEAM_CONTRACT.md` cannot be moved, renamed, replaced, or deleted.
5. **Team Awareness** — Any change to the API contract (WebSocket events, REST endpoints) MUST be flagged as a cross-repo change. Do not modify the seam without the user's explicit awareness that both repos need updating.

---

## 6. Safety Permissions

**Always ask the user before:**
- Removing or deleting any code or files
- Installing new packages or dependencies
- Running a full project-wide build or end-to-end test suite
- Making changes that touch more than one file or module
- Any change that modifies the WebSocket/API contract (cross-repo impact)

**Allowed without prompting:**
- Reading or listing files
- Type-checking, formatting, or linting a single file
- Running a single unit test file

**Hard rules — never do these:**
- Do **NOT** hardcode API keys or secrets. Always use environment variables.
- Do **NOT** overwrite or replace existing functional code just to make it "cleaner". Modify only the exact lines required.
- Do **NOT** add heavy dependencies without explicit approval.
- Do **NOT** refactor unless explicitly commanded.
- Do **NOT** embed game agent logic in the UI. The UI is a dumb terminal.
- Do **NOT** use Cloudflare AI models for any game agent logic — only Google Gemini Live.
- **Always run `npm run build` before any deploy.** Never call `wrangler deploy` directly. Use `npm run deploy`.
- **Hallucination recovery** — If about to overwrite existing code due to context loss, comment out the original in-place and add `// [AI: replaced because X — original preserved below for user review]`. Never silently delete working logic.

---

## 6a. Dead End Protocol — Anti-Spiral Rule

**Trigger condition** — STOP and surface to the user if ANY of the following occur:
- The same error appears after **2 consecutive fix attempts**
- A fix requires removing or commenting out existing functional code as a "diagnostic step"
- The root cause cannot be determined from reading the code and error message alone

**Required behavior — report before touching any more code:**
1. State the exact error message (copy verbatim)
2. State what was already tried (max 3 bullet points)
3. State one specific hypothesis about the root cause
4. Ask the user one targeted question to confirm or deny that hypothesis

**Forbidden responses to errors:**
- Do **NOT** make destructive changes as diagnostic steps
- Do **NOT** retry the same approach with minor variations more than once
- Do **NOT** continue iterating silently until context is exhausted

**Hard limit:** If the error is not resolved after 2 targeted fixes, surface the problem to the user before writing any more code.

---

## 7. Coding Standards

- Default to **small, focused components** — avoid god components.
- Default to **small files and focused diffs** — avoid repo-wide rewrites.
- Prefer **appending new functions or creating new files** over mutating existing functional logic.
- Always lint, type-check, and test **only the modified files**.
- Execute tasks in the **smallest possible increments**.

---

## 8. Commands Reference

```bash
# Type-check a single file
npx tsc --noEmit path/to/file.tsx

# Format a single file
npx prettier --write path/to/file.tsx

# Lint a single file
npx eslint --fix path/to/file.tsx

# Full build + deploy (ALWAYS use this — never wrangler deploy alone)
npm run deploy

# Dev server
npm run dev
```

---

## 9. Execution Protocol

**STEP 1 — Micro-Plan:** Output step-by-step plan. Wait for approval.
**STEP 2 — Execute ONE step:** Minimal code. Ask before deleting anything.
**STEP 3 — Test:** `npx tsc --noEmit`, prettier, eslint on modified files only. Fix errors before advancing.
**STEP 4 — Commit and Push:**
```bash
git add <changed files>
git commit -m "feat/fix: completed [Step Name] - tiny increment"
git push origin main
npm run deploy
```
**STEP 5 — Await confirmation:** *"Step complete. Ready for the next step?"*

---

## 10. Cross-Repo Coordination

See `TEAM_CONTRACT.md` for the coordination rules between this repo and `liminal-sin-gemini`.

**CRITICAL REQUIREMENT:** Read `documents/BACKEND_SIGNALS.md` for the WebSocket contract and VAD responsibilities. Read `documents/SHOT_SCRIPT.md` for the complete phase-by-phase frontend implementation spec.

### WebSocket Event Reference (frontend scope)

| Event | Direction | Payload | Frontend Action |
|---|---|---|---|
| `session_ready` | BE→FE | `{ session_id }` | Begin credits sequence (Phase 2) |
| `agent_speech` | BE→FE | `{ agent, audio: base64 }` | Play audio via Web Audio API |
| `agent_interrupt` | BE→FE | `{ agent }` | Stop current audio playback immediately |
| `trust_update` | BE→FE | `{ trust_level: number, fear_index: number }` | Update Trust Meter bars (smooth transition) |
| `hud_glitch` | BE→FE | `{ intensity, duration_ms }` | Trigger screen glitch effect |
| `scene_change` | BE→FE | `{ payload: { sceneKey } }` | Fire `glitch_low` SFX; apply loading state |
| `scene_image` | BE→FE | `{ payload: { sceneKey, data: base64 } }` | Display Imagen 4 still; fire `glitch_low` SFX |
| `scene_video` | BE→FE | `{ payload: { sceneKey, url } }` | Replace still with Veo video loop; fire `glitch_low` SFX |
| `player_speak_prompt` | BE→FE | `{}` | Reveal mic indicator; show "SPEAK TO JASON" hint; **activate Trust Meter** |
| `hint` | BE→FE | `{ text }` | Show subtle hint overlay |
| `audience_update` | BE→FE | `{ payload: { personCount, groupDynamic, observedEmotions } }` | No UI — internal GM data |
| `card_discovered` | BE→FE | `{ cardId: 'card1'\|'card2' }` | Show floating card overlay (collectible); fire `card_appear` SFX |
| `dread_timer_start` | BE→FE | `{ durationMs }` | Start invisible SFX escalation timer (no UI indicator) |
| `game_over` | BE→FE | `{}` | Fire `monster_sound1`+`monster_sound2`; fade to black; show GAME OVER text |
| `good_ending` | BE→FE | `{}` | Show `[PLAY AGAIN]` button after 5s |
| `slotsky_trigger` | BE→FE | `{ payload: { anomalyType } }` | Trigger Slotsky anomaly visual |
| `intro_complete` | FE→BE | `{}` | Send after credits sequence ends |
| `player_speech` | FE→BE | `{ audio: base64 }` | Send continuously when mic is active |
| `player_frame` | FE→BE | `{ jpeg: base64 }` | Send at 1 FPS when camera is active |
| `card_collected` | FE→BE | `{ cardId }` | Send when player clicks a card overlay |

---

## 11. ⚠️ Trust Meter — Permanent UI Spec

The Trust Meter is a **permanent, non-removable UI feature** of the game shell. Full implementation spec lives in `documents/SHOT_SCRIPT.md` under the section `## ⚠️ FRONTEND NOTE — JASON TRUST METER (PERMANENT UI)`.

**Summary:**
- Fixed widget, lower-right corner. Two bars: `TRUST` and `FEAR` (all caps).
- Data source: `trust_update` WS event — `{ trust_level: number, fear_index: number }` (both floats 0.0–1.0).
- Hidden during Phases 1–2. Activates (becomes visible + starts pulsing) on `player_speak_prompt`.
- Slow CSS `opacity` pulse animation (~5s cycle). Bar fill animates on data change (~500ms CSS transition).
- Default values before first `trust_update`: `trust_level = 0.5`, `fear_index = 0.3`.
- Do NOT remove this widget during any refactor. Do NOT gate it behind a feature flag.

---

## 12. SFX Catalog (Frontend Responsibility)

All game SFX are owned and triggered by the frontend. The backend provides the event cue; the frontend plays the file. See `documents/SHOT_SCRIPT.md` for the full per-phase SFX schedule.

**Dread Timer SFX (Phase 7 — invisible to player, frontend-only):**
| Window | File(s) | Behavior |
|---|---|---|
| 0–30s | `heartbeat_low` | Barely audible, ~48 BPM |
| 30–60s | `heartbeat_mid` | Louder, ~68 BPM |
| 60–90s | `heartbeat_high1` + `heartbeat_high2` + `distant_growl1` + `distant_growl2` | Full panic, simultaneous |

**Game Over SFX:** `monster_sound1` + `monster_sound2` fired simultaneously on `game_over` — max amplitude, no loop, hard cut to silence.

**Universal Scene Transition SFX:** `glitch_low` (random variant) fires on every `scene_change`, `scene_image`, and `scene_video` event.

