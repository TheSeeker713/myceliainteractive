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
  - Rendering HUD overlays (cracked glasses effect, trust indicator)
  - Rendering FMV video sequences triggered by backend events

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

See `TEAM_CONTRACT.md` for:
- The WebSocket event contract between this repo and `liminal-sin-gemini`
- How to run the mock backend server during frontend development
- Rules for changes that affect both repos simultaneously
- The full split of responsibilities between MI and LS
