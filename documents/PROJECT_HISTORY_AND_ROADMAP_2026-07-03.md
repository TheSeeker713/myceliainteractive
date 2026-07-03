# Mycelia Interactive — Project History, Context & Forward Roadmap

**Document type:** Long-form project journal / engineering review
**Repository:** `TheSeeker713/myceliainteractive` (frontend/site repo)
**Date authored:** July 3, 2026
**Author:** Engineering (AI-assisted session, Cursor)
**Status:** Living reference — snapshot as of commit `ec1bbdb`
**Scope:** Complete narrative history of the project to date, the current state of the codebase, and a prioritized plan of what needs to be done next.

> This document is a review and journal. It does not change any code. It exists to give any future contributor (human or agent) a single place to understand where this project came from, how it is built, what has been fixed, what is still broken, and what should happen next — in order.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Company & Product Context](#2-company--product-context)
3. [Technical Architecture](#3-technical-architecture)
4. [Project Timeline & History](#4-project-timeline--history)
5. [Detailed Change Log — Recent Sessions](#5-detailed-change-log--recent-sessions)
6. [Current State Assessment](#6-current-state-assessment)
7. [The Live-Site 7-Problem Audit](#7-the-live-site-7-problem-audit)
8. [Mobile Responsiveness Audit](#8-mobile-responsiveness-audit)
9. [Working Methodology & Governance](#9-working-methodology--governance)
10. [What Needs To Be Done Next](#10-what-needs-to-be-done-next)
11. [Risks & Open Decisions](#11-risks--open-decisions)
12. [Appendices](#12-appendices)

---

## 1. Executive Summary

Mycelia Interactive LLC is an entertainment company building original IP across film, interactive experiences, games, and music, with a defining focus on **real-time AI-driven response systems** that use voice and vision. This repository is the **frontend/site repo**: it hosts the public marketing website and the browser client for **Liminal Sin**, a psychological interactive experience built for the Gemini Live Agent Challenge.

The project has been in active development since **November 25, 2025**, and as of this writing has **222 commits** on `main`. The site is live at `https://www.myceliainteractive.com`, deployed to **Cloudflare Workers** (static export + a Worker that handles the signup/access API, backed by Cloudflare D1 and a Workers AI binding).

Development has moved through several distinct eras:

- **Genesis & first build** (late 2025 – Feb 2026): initial scaffold, Hero component, network background, glitch text, devlog experiments, and the fight to get GitHub + Cloudflare deployment working.
- **Judge-facing redesign** (spring 2026): sticky header/footer, brand identity section, animated logo, split cards, layout restructure.
- **Glassmorphism hero** (June 2026): a design pass captured in `documents/archive/plan-hero-glassmorphism-2026-06-11.md`.
- **P0–P3 hardening cleanup** (June 2026, Phases 1–4): dead-code removal, z-index token migration, accessibility (focus-visible, skip link, form labels, 44px hamburger), a Worker security-header layer, FPV carousel error fallback, and color-token consolidation.
- **The 7-problem live audit** (June–July 2026): a discovery that, despite green test suites, the *live* site had multiple real, user-facing regressions. This kicked off a structured, approval-gated remediation.
- **Phase 1 & 2 remediation** (July 2026): fixed hero CTA click-blocking and hash-scroll navigation; reordered the homepage; extracted Roadmap/Team/Contact into standalone routes; rewired the header nav.
- **Mobile responsiveness audit** (July 2026): a read-only diagnosis (this session) of layout problems across every route. Findings are captured here; fixes are **not yet started**.

The single most important lesson of this project so far: **green automated checks (build, lint, typecheck, unit tests) confirm the code compiles and does not break existing tests — they do NOT prove the feature works for a real user.** Multiple issues shipped "passing" and were still broken live. Every UX-affecting change must be verified against the live/rendered experience, not just the test runner.

---

## 2. Company & Product Context

### The company

**Mycelia Interactive LLC** — incorporated in New Mexico, May 2026, based in Albuquerque, New Mexico.

- **Adrianna Loya** — Co-founder; CEO, CCO, CFO
- **Jeremy Robards** — Founder; CTO, CAIO, CCO

### The products represented on the site

- **Mycelia Interactive studio homepage** (`/`) — the company's front door: hero, about, mission, projects, highlights.
- **Liminal Sin** (`/ls`) — the flagship technology demonstration. A psychological interactive experience set in the "Vegas Underground." The player is a disembodied voice woven into a living story; three trapped characters (Jason, Audrey, Josh) are autonomous AI agents with individual trust/fear metrics. Voice is the primary mechanic; the "Game Master" perceives webcam frames and vocal cadence. Generative liminal environments are rebuilt with Imagen 4 stills and Veo video loops. Submitted as a vertical slice to the **Gemini Live Agent Challenge 2026**.
- **The S33k3r** — an external transmission/property at `https://www.thes33k3r.com` (linked out from the site).

### Related repositories

- **Frontend/site (this repo):** `TheSeeker713/myceliainteractive`
- **Backend/runtime:** `TheSeeker713/liminal-sin-gemini` — Gemini Live multi-agent runtime, WebSocket server, Google Cloud deployment, Firestore session state, and canonical media orchestration.

The division of responsibility is important: **the frontend is a "render terminal."** All game logic and agent decisions live in the backend. The browser client captures mic audio and webcam frames (1 FPS), streams them over a bidirectional WebSocket to a Cloud Run backend running Gemini Live multi-agent sessions, and renders whatever comes back. Trust/fear/scene state persists in Firestore.

---

## 3. Technical Architecture

### Stack

- **Next.js 16.2.7** (App Router, React Compiler enabled, `output: "export"` static export)
- **React 19.2.3**
- **TypeScript 5.9.x**
- **Tailwind CSS 4.3.x** (`@tailwindcss/postcss`)
- **Framer Motion 12.40.x** (scroll-linked animation, folds, crossfades)
- **Cloudflare Workers / Pages** via **Wrangler 4.98.x**
- **Vitest 4.1.x** for unit tests
- **clsx** + **tailwind-merge** for class composition

### Build & deploy model

- `next.config.ts` sets `output: "export"` and `images.unoptimized: true` — the site is a **fully static export** to `./out`.
- `wrangler.jsonc` wires:
  - `main: workers/signup-api.ts` — the Worker entry point
  - `assets.directory: ./out`, `binding: ASSETS` — static assets served by the Worker
  - `d1_databases` — `liminal-sin-signups` (D1 database, binding `liminal_sin_signups`)
  - `ai` — Workers AI binding (used for atmospheric FPV imagery on the marketing shell)
  - `triggers.crons: ["*/15 * * * *"]` — a 15-minute cron
- `npm run deploy` = `next build && wrangler deploy`.

### Repository layout

```
app/
  layout.tsx, page.tsx, not-found.tsx, robots.ts, sitemap.ts
  components/
    SiteChrome.tsx            # global header (nav) + footer, skip link
    FPVCarousel.tsx           # atmospheric AI image carousel (with fallback)
    motion/                   # ScrollStage, FoldCard, useHashScrollToSection,
                              #   useSectionFade, VideoBackground, scroll math
    studio/                   # Button, Card, SceneCard, HomePage, primitives
      sections/               # Hero, About, Mission, Projects, ProofPoints,
                              #   Roadmap, Team, Contact section content
  contact/  roadmap/  team/   # standalone routes (page.tsx shells)
  vision/                     # 10-Year Vision page (ScrollFoldScene-driven)
  privacy/                    # studio privacy policy
  ls/                         # Liminal Sin landing + subcomponents
    game/                     # prototype gate + full game client (many files)
    play/                     # token-gated private play entry
    privacy/                  # Liminal Sin privacy policy
  styles/  utils/
workers/                      # signup-api Worker + token logic + tests
documents/                    # this file + archive/
public/assets/                # images + video
_tests/                       # test scaffolding
```

### Routing map

| Route | Purpose | Chrome | Motion |
|---|---|---|---|
| `/` | Studio homepage (ScrollStage sections) | header + footer + animated bg | yes |
| `/ls` | Liminal Sin landing (story, carousel, access form) | ls-specific chrome | partial |
| `/ls/game` | Prototype access gate (not playable) | header + footer | no |
| `/ls/play` | Token-gated private play (`?access=token`) | GamePageShell only (no site chrome) | game |
| `/ls/privacy` | Liminal Sin privacy policy | header + footer | no |
| `/vision` | 10-Year Vision (fold-scene page) | header + footer | yes |
| `/roadmap` | MVP roadmap (standalone) | header + footer | no |
| `/team` | Team (standalone) | header + footer | no |
| `/contact` | Contact (standalone) | header + footer | no |
| `/privacy` | Studio privacy policy | header + footer | no |

### Key architectural mechanisms

- **`ScrollStage`** (`app/components/motion/ScrollStage.tsx`): the homepage's scroll-linked section transition engine. Uses Framer's `useScroll`, `useTransform`, and `useMotionValueEvent`. Sections are mounted into "even/odd" z-index slots and crossfaded by scroll progress. Discrete boundary crossings drive `setState`; parity-based slot assignment avoids a re-render storm.
- **Scroll math helpers** (`getSectionFromProgress`, `getSectionLayers`, `getSectionFadeOpacities`, `getViewportRatio`, `getScrollableSpan`, `getScrollProgressFromSection`): pure functions that compute which section is active and how far, unit-tested.
- **`useHashScrollToSection`**: maps `/#section` hashes to ScrollStage positions and scrolls there. Handles both `hashchange` and same-page `<Link>` clicks (which use `pushState` and do NOT fire `hashchange`).
- **`FoldCard` / `ScrollFoldScene`**: fold-based reveal animation used on `/vision` and (in static form) on `/ls` cards. When no scroll-progress provider is present, `FoldCard` renders a plain static `Card`.
- **`VideoBackground`**: a fixed, full-viewport animated canvas background.
- **Z-index token system** (`--z-site-*`, `--z-game-*`): CSS custom properties defining the stacking scale, migrated from hardcoded values so layering is centrally controlled.
- **Design tokens**: `--color-studio-accent`, `--color-studio-text`, `--color-studio-text-muted`, `--color-studio-bg*`, etc. Hardcoded hex values were promoted to these tokens.

---

## 4. Project Timeline & History

This section reconstructs the project's evolution from the commit history (222 commits, Nov 25 2025 → Jul 2 2026). Dates and phases are approximate groupings.

### Era 0 — Genesis (Nov 2025 – Feb 2026)

- `fe628aa` **Initial commit — Mycelia Interactive website.**
- `7297935` First devlog written; hit a hard blocker when GitHub made 2FA mandatory and looped on a glitch, blocking account access (support ticket filed). An early reminder that infra/tooling friction, not code, is often the real cost.
- `8982ccc` Initial Hero component and utility functions.
- `4000c75` Hero rename/move; added `NetworkBg` background effect, `GlitchText` text effect; devlog entries.
- `2354e11`, `4318e0f`, `170a852`, `e6146de` (Feb 18, 2026): Hero component structure (headline, subheadline, CTAs), module/build-error fixes, Phase 2 hero, Phase 3.1 `SplitScreen` component with hover/scroll triggers and branching visual.

### Era 1 — Deployment & theme (spring 2026)

- `b51df5e`/`b51f4c9`/`650512a` Neon UI theme refinement, brand image assets, Cloudflare deploy config + static export output, and fixing static image paths for web deployment. The static-export + Wrangler pipeline was established here.

### Era 2 — Judge-facing redesign (a numbered, step-based redesign)

A run of "tiny increment" commits, each a discrete approved step (an early expression of the one-step-at-a-time discipline later codified in AGENTS.md):

- `c2a6b09` Step 2 — sticky header & footer
- `1398f83` Step 3 — remove "Choose Your Path" section
- `c48e37a` Step 4 — update brand identity section
- `b83df5e` Step 5 — move image 3, relocate buttons
- `09d730a` Step 6 — animate the logo image
- `51c31b9` Step 6.5 — Liminal Sin image near CTA
- `8cb4c78` Step 1 — enlarge header, add buttons
- `2a211cf` Steps 2 & 3 — visual redesign for judges
- `f54203a` Restructured header, footer, side-by-side split cards

### Era 3 — Glassmorphism hero (June 11, 2026)

- Captured in `documents/archive/plan-hero-glassmorphism-2026-06-11.md` (archived after shipping).
- `42fd4b3` **Renamed `agents.md` → `AGENTS.md`** — formalizing the governance file.
- `21dff9f` Archived the shipped hero glassmorphism plan.

### Era 4 — P0–P3 hardening cleanup (June 2026, "Phases 1–4")

A systematic quality pass. Each item shipped through the CDP discipline:

- **Repo hygiene / dead code:** removed `BokehParticles` (`f2ee968`), `StudioCard` (`10809ad`), `SectionReveal` (`6388c19`), unused `three.js`/`lenis` deps (`b41f4d1`), dead `TEAM_CONTRACT.md`/`SHOT_SCRIPT.md` references (`d438199`).
- **Z-index token system:** defined the scale as CSS custom properties (`28fbbce`), migrated site-layer usages to `--z-site-*` (`fadc01a`), game-layer to `--z-game-*` (`3d756b7`), and `VideoBackground` to `--z-site-backdrop` (`ce1c19f`).
- **Accessibility:** global `:focus-visible` styling (`20b4c21`), skip-to-main-content link (`639bdd9`), signup form labels associated with inputs + autoComplete (`6ad6f50`), hamburger menu enlarged to the 44×44px minimum (`bb50c32`).
- **Resilience:** graceful fallback for FPV carousel image-load failures (`515e314`).
- **Security:** centralized security-header layer on the signup-api Worker (`d6a520a`).
- **Copy hygiene:** removed em dashes from user-facing strings (`20c5dad`), replaced internal-scaffolding mailto subject/button copy (`a92e104`).
- **SEO/metadata:** completed metadata for `/privacy` and `/ls/privacy` (`a45a0ba`), split `/ls/play` into a Server Component page with metadata + canonical (`ccb7c39`).
- **Color tokens:** promoted duplicate hex colors to studio text tokens (`6203c6f`), game error-red/surface tokens (`2a963df`), hero glass-text tokens (`8982fcf`), and resolved accent-teal fragmentation onto one canonical token (`0f0c2cd`).

**Critical outcome of Era 4:** every one of these passed its own test suite at every step — and yet the *live* site still had multiple real, user-facing problems. This directly motivated Era 5.

### Era 5 — The 7-problem live audit & remediation (June–July 2026)

A full read-only audit (code + live browser) diagnosed 7 concrete user-facing defects (detailed in §7). The remediation was then structured into approval-gated phases:

- `4efdc2b` **Phase 1, Step 1** — unblock hero CTA clicks via opacity-driven `pointer-events` in `ScrollStage`.
- `7820356` **Phase 1, Step 2** — make same-page hash nav links scroll to the correct ScrollStage section (interceptor + argument-order fix + unit test).
- `0f1550e` **Phase 2, Step 3a** — reorder homepage to Hero/About/Mission/Projects/Highlights and drop Roadmap/Team/Contact from ScrollStage.
- `730f3a6` **Phase 2, Step 3b** — add standalone `/roadmap`, `/team`, `/contact` routes.
- `ec1bbdb` **Phase 2, Step 3c** — link new routes in header nav and repoint `/vision` roadmap links.

### Era 6 — Mobile responsiveness audit (July 2026, this session)

A read-only, diagnosis-only mobile audit across all 10 routes. No code changed. Findings in §8. The live-browser portion is currently **blocked by an account usage/quota limit**; the code-level audit is complete.

---

## 5. Detailed Change Log — Recent Sessions

The five most recent commits (all committed, deployed, and pushed; working tree clean, branch even with `origin/main`).

### `4efdc2b` — Fix hero CTA click-blocking (Phase 1, Step 1)
- **File:** `app/components/motion/ScrollStage.tsx`
- Added `primaryPointerEvents` / `secondaryPointerEvents` via `useTransform` (`opacity > 0.5 ? "auto" : "none"`) and applied them to the even/odd slots using the existing parity-swap logic.
- **Root cause fixed:** the pre-mounted "next" section occupied the front z-index slot at `opacity: 0` but without `pointer-events: none`, so it invisibly overlaid the hero and swallowed CTA clicks.

### `7820356` — Fix same-page hash nav (Phase 1, Step 2)
- **Files:** `app/components/motion/useHashScrollToSection.ts` (+ new `useHashScrollToSection.test.ts`)
- Extracted `getHashSectionScrollTop`; corrected the `getScrollProgressFromSection` argument order (a swapped-arg bug that collapsed the scroll target to 0); added a document-level capture-phase click interceptor for same-page `<Link href="/#…">` clicks (which fire `pushState`, not `hashchange`).
- **Root cause fixed:** two-part bug — `hashchange` never fired for same-page links, and even when triggered the scroll target was miscalculated.

### `0f1550e` — Reorder homepage & drop sections from ScrollStage (Phase 2, Step 3a)
- **Files:** `app/components/studio/HomePage.tsx`, `app/components/SiteChrome.tsx`, `app/components/motion/useHashScrollToSection.ts`
- New order: Hero → About → Mission → Projects → Highlights. Removed Roadmap/Team/Contact entries from the motion `sections` array and `HomePageStatic`. Removed the stale `/#roadmap` header nav link and the `roadmap` entry from `HASH_TO_SECTION_ID`.
- **Accepted interim regression:** until Step 3c, the `/vision` "View MVP Roadmap" links pointed at `/#roadmap` and would land at the top of home. Self-resolved at 3c.

### `730f3a6` — Standalone `/roadmap`, `/team`, `/contact` routes (Phase 2, Step 3b)
- **Files:** `app/roadmap/page.tsx`, `app/team/page.tsx`, `app/contact/page.tsx` (new); `app/sitemap.ts`; H2→H1 promotion in `RoadmapSection.tsx`, `TeamSection.tsx`, `ContactSection.tsx`.
- Each new route uses a `/privacy`-style shell (container + back-to-home link) wrapping the existing `*Content` component, with full metadata (title, description, canonical, OpenGraph). Sitemap updated with the three entries.

### `ec1bbdb` — Nav links + vision repoint (Phase 2, Step 3c)
- **Files:** `app/components/SiteChrome.tsx`, `app/vision/VisionPage.tsx`
- Header nav order: Projects, Liminal Sin, Roadmap, 10-Year Vision, Team, Contact, The S33k3r (external, last). Shifted the desktop-nav/hamburger/mobile-dropdown breakpoint from `md` to `lg` to prevent overflow with 7 items. Repointed both `/vision` "View MVP Roadmap" links from `/#roadmap` to `/roadmap`.

---

## 6. Current State Assessment

### What is verified working (desktop)

- Hero CTA buttons are clickable (pointer-events fix live).
- Same-page hash nav (e.g. "Projects") scrolls to the correct section.
- Homepage section order is Hero → About → Mission → Projects → Highlights.
- `/roadmap`, `/team`, `/contact` load as standalone routes with correct metadata and H1s.
- Header nav shows all 7 links; `/vision` roadmap links go to `/roadmap`.
- Signup/access flow, D1, and the Worker security-header layer are in place.
- Unit tests exist for scroll math, hash-scroll geometry, section fade, Worker token logic, and game HTTP base derivation.

### Automated test surface

- `app/components/motion/useSectionFade.test.ts`
- `app/components/motion/useHashScrollToSection.test.ts`
- `workers/token.test.ts`
- `app/ls/game/deriveGameHttpBase.test.ts`

### Uncommitted / untracked files (7)

These are **not** modifications to tracked files — they are brand-new, never-added files:

1. `.cursor/settings.json` — local IDE config; not intended for the repo (typically local/gitignored).
2. `public/assets/images/About_Network.webp`
3. `public/assets/images/Contact_Network.webp`
4. `public/assets/images/KAIA_Card.webp`
5. `public/assets/images/Roadmap_Network.webp`
6. `public/assets/images/S33k3r_Card.webp`
7. `public/assets/video/ais_clip.webm`

Items 2–7 are the "missing images" from the original audit: assets dropped into `public/assets/` but **referenced by zero components**. They remain uncommitted deliberately — committing them was gated on a design decision (which component each belongs to) that has not been made. Committing them unreferenced would add dead weight; committing them wired-in requires the mapping decision first.

### Known-broken / not-yet-addressed

- Mobile responsiveness issues across the site (see §8) — diagnosed, not fixed.
- `/vision` needs a rebuild (low-contrast fold-duplication pattern), not a patch.
- Homepage glass cards have no hover treatment.
- Possible dual scroll-progress jitter (`ScrollStage` vs `VideoBackground`) — needs real-input repro.
- `<button>` nested inside `<a>`/`<Link>` (invalid HTML) flagged during the hero audit.

---

## 7. The Live-Site 7-Problem Audit

For historical record, the seven originally reported problems and their disposition:

1. **Scroll jitter on the homepage** — hypothesis: two uncoordinated scroll-progress systems (`ScrollStage`'s `useScroll` vs `VideoBackground`'s own window scroll + RAF loop) reading slightly different geometry per frame. **Status: needs real-input repro; fix not yet done (Phase 4 / Step 6).**
2. **Wrong section order (Highlights showing first)** — confirmed and **fixed** (`0f1550e`): now Hero → About → Mission → Projects → Highlights.
3. **Images not displaying** — root cause: 6 assets exist in `public/assets/` but are untracked and referenced by zero components. **Status: pending asset-to-component mapping decision (see §6, §10).**
4. **"Projects" nav link did nothing** — two-part bug (no `hashchange` on same-page `<Link>`, plus swapped scroll-math args). **Fixed** (`7820356`).
5. **No card hover glow** — confirmed never implemented for the homepage `glass` variant (only `FoldCard` on `/vision` had a hover lift). **Status: pending (Phase 3 / Step 5).**
6. **Buttons under "Mycelia Interactive LLC" not working** — same underlying cause as #4 / the hero CTA click-block (#1 of Phase 1). **Fixed** via the pointer-events change (`4efdc2b`) and the hash-nav fix.
7. **`/vision` needs a full rebuild** — confirmed: `ScrollFoldScene`-driven fold animations with duplicated content blocks inside oversized scenes produce near-invisible low-contrast text. **Status: rebuild scoping pending (Phase 5 / Step 7).**

---

## 8. Mobile Responsiveness Audit

Read-only, code-level diagnosis performed this session across all 10 routes. The **live-browser** verification (exact rendered pixel widths, real overflow, device touch sizes) is **blocked by an account usage/quota limit** and still needs to run. No fixes were made.

### Cross-cutting finding (changes how every route reads)

`app/globals.css` sets `body { overflow-x: hidden }`. This **masks** horizontal overflow — you will not see a horizontal scrollbar even when content is wider than the viewport, but off-screen content is still **clipped**. "No horizontal scroll on the phone" is therefore not proof of no overflow.

### Site-wide issues

- **`Button` `md` size ≈ 40px tall (< 44px minimum touch target).** Affects nearly every CTA except the homepage hero (which uses `size="lg"` + `min-h-11`). Confidence: high (measurement approximate; confirm live).
- **Mobile nav dropdown links** (`flex flex-col gap-3 text-sm`, no vertical padding) are ~20px-tall tap targets — 7 stacked links, hard to hit. Confidence: medium.
- **Header logo link** renders `h-10` (40px) on mobile, < 44px. Confidence: low.
- **Sticky header + sticky footer** together consume significant vertical space on short phones, and the footer overlaps content bottom mid-scroll. Confidence: medium.
- **`overflow-x: hidden`** hides real overflow instead of fixing it (see above). Confidence: high.

### Per-route highlights

- **`/` homepage:** The motion `ScrollStage` sticky container is `100dvh - header` (does not subtract the sticky footer), while `CardSlot` sizes content to `100dvh - header - footer`. On short phones, the non-scrollable **Highlights** card (`ProofPointsContent`, 4 stacked mini-cards on mobile) can approach/exceed the content box and clip behind the sticky footer. Project scenes are `scrollable` and safe. Confidence: medium.
- **`/ls` (highest traffic):** **Confirmed overflow bug.** `FPVBandContent` is `w-full -mx-[clamp(1.5rem,6vw,4rem)]` with **no compensating parent padding**, so `w-full` keeps it at 100% width while negative margins shift it off the left edge (~24px at 375px). Real horizontal overflow, hidden by `overflow-x: hidden`, leaving the carousel clipped left and a gap right. Confidence: high (code-evident). Also: hero CTAs and signup inputs are ~40px tall (< 44px).
- **`/vision`:** known low-contrast/readability problem over the fold animation; `140vh` mobile scene heights keep text faded for much of the scroll. Already a rebuild candidate.
- **`/roadmap`, `/team`, `/contact`:** grids collapse to 1 column (good); CTA `Button`s ~40px; inline `mailto` links are small tap targets; content bottom padding (`py-12` = 48px) is less than the mobile footer height (~86px), so the last line can sit under the sticky footer at scroll end.
- **`/privacy`, `/ls/privacy`:** same shell/footer-overlap concern; otherwise readable and scrollable.
- **`/ls/game` (gate):** clean; stacked buttons; `md` buttons ~40px.
- **`/ls/play`:** no site chrome (uses `GamePageShell`); the game itself is explicitly desktop-only. If opened on a phone, the intro H1 `text-5xl md:text-7xl` "LIMINAL SIN" with `tracking-widest` risks overflow at 375px, and `GamePageShell`/`GameClient` use `h-screen` (`100vh`, not `100dvh`) so mobile browser chrome can crop the layout. Low priority (desktop-only by design).

---

## 9. Working Methodology & Governance

This project is governed by **`AGENTS.md`** (repo root, immutable). Its rules are non-negotiable and have shaped the entire cleanup era:

1. **One step at a time.** Work is broken into discrete, numbered steps; only one is worked at a time.
2. **Explicit approval before implementation.** Read-only audits do not require approval; writing code does.
3. **Testing after every step.** Full build + integrity tests before moving on.
4. **CDP = Commit → Deploy → Push, in that exact order.** CDP is a separate explicit approval from implementation approval and is never self-executed.
5. **No assumptions.** No create/delete/modify without prior approval.
6. **`AGENTS.md` is non-destructive.** Never edited/deleted without a direct directive.
7. **Mobile-first & error handling** in all implementations.
8. **Follow project `AGENTS.md` first.**
9. **Testing requirements per step:** `npm run build`, `npm run lint`, plus relevant runtime/visual/mobile checks. (In practice this session also ran `npx tsc --noEmit` and `npx vitest run`.)
10. **Full testing pyramid (adopted 2026-06-11):** unit (Vitest + jsdom), component (Vitest + Testing Library), integration (Vitest + MSW), E2E (Playwright preferred), plus TypeScript, ESLint, Prettier, Lighthouse, axe-core a11y, bundle analysis, and `npm audit`.

**The recurring hard-won lesson:** passing checks confirm compilation and non-regression of existing tests. They do **not** confirm live UX. Every UX-affecting fix must state what manual/live verification was done or is recommended, in addition to the four automated checks.

---

## 10. What Needs To Be Done Next

The following is a prioritized backlog. It preserves the existing phase numbering where it exists and slots the mobile work in by user impact. **Each item must follow AGENTS.md: read-only proposal → explicit approval → implement → four checks → CDP approval.** Do one step at a time.

### Priority 0 — Mobile responsiveness fixes (new, highest user impact)

The site has never had mobile fixes and initial phone testing shows real problems. Recommended order:

- **M1 — Fix the `/ls` FPV carousel horizontal overflow.** Correct the `w-full -mx-[…]` full-bleed technique (e.g. `w-screen` with a centering transform, or wrap in a full-bleed utility) so it is symmetric and does not clip left. Highest confidence bug; highest-traffic page.
- **M2 — Enforce 44×44px touch targets on `Button`.** Add a `min-h-11` (or size-appropriate min height) to the `md` Button size, and give mobile nav dropdown links real vertical padding. Audit signup inputs and inline `mailto` links.
- **M3 — Resolve sticky-footer overlap.** Either make `ScrollStage`'s sticky container subtract the footer height, or increase bottom padding on standalone pages to exceed the mobile footer height, or reconsider the sticky footer on mobile.
- **M4 — Homepage Highlights card height on short viewports.** Ensure `ProofPointsContent` cannot clip behind the footer on ≤375×667 (make it scrollable, or reduce/stack differently, or shorten).
- **M5 — Remove reliance on `overflow-x: hidden` as a mask.** Once real overflows are fixed, confirm nothing depends on the body clip to look correct.
- **M6 — Live-browser verification pass.** Once the usage/quota limit is lifted (or model switched to Auto), run the actual multi-viewport browser audit (375 / 390 / 428 / 768) to confirm the code-level fixes and catch anything static analysis missed.

### Priority 1 — Remaining audit items (existing phases)

- **Step 4 — Wire up unrendered assets.** Decide the asset-to-component mapping for the 6 untracked files, git-track them, and reference them:
  - `KAIA_Card.webp` → KAIA project card (likely)
  - `S33k3r_Card.webp` → The S33k3r project card (likely)
  - `About_Network.webp` → About section (likely)
  - `Roadmap_Network.webp` → Roadmap page (likely)
  - `Contact_Network.webp` → Contact page (likely)
  - `ais_clip.webm` → AIS project scene (likely)
  - Confirm each mapping before wiring — a filename match is not a design decision.
- **Step 5 — Homepage card hover glow.** Add a hover treatment to the `glass` Card variant consistent with `--color-studio-accent` and the glass aesthetic (backdrop-blur, translucent surfaces). Ensure it has a sensible non-hover state for touch devices.
- **Step 6 — Dual scroll-progress investigation.** Reproduce the jitter with **real trackpad/wheel input** (not programmatic `scrollTo`), confirm the `ScrollStage` vs `VideoBackground` hypothesis, then coordinate the two progress sources onto a single geometry read. Do not fix on code-reading alone.

### Priority 2 — `/vision` rebuild (larger effort, own sub-plan)

- **Step 7 — Scope and rebuild `/vision`.** Replace the fragile `ScrollFoldScene` fold-duplication pattern (which double-passes each content block and produces low-contrast text) with a simpler, robust, readable structure. This is a rebuild, not a patch. Break into its own numbered sub-plan: (a) define what the page must communicate (10-year vision), (b) choose a simpler layout/animation model, (c) implement section by section, (d) verify contrast/readability on mobile and desktop.

### Priority 3 — HTML correctness & polish

- **Fix invalid nesting:** the `<button>` inside `<a>`/`<Link>` flagged during the hero audit. Replace with a single valid interactive element (style a `<Link>` as a button, or move the button out of the anchor).

### Priority 4 — Infrastructure & process

- **CI:** add `.github/workflows/ci.yml` to run lint, test, and build on every push/PR (noted as a deferred future revision in the README; requires a GitHub token with `workflow` scope).
- **Expand the testing pyramid:** the methodology is adopted but only unit tests exist. Add component tests (Testing Library), integration tests (MSW), and a small set of Playwright E2E journeys for the highest-value flows (homepage nav, access request submission, `/ls/play` token gate).
- **`.gitignore` hygiene:** confirm `.cursor/settings.json` is intended to be local; add to `.gitignore` if so.

---

## 11. Risks & Open Decisions

- **Usage/quota limit is a live blocker.** The mobile live-browser audit could not run because of an account usage limit ("You're out of usage. Switch to Auto, or ask your admin to increase your limit"). Any task depending on the browser subagent is blocked until this is resolved. Mitigation: switch model to Auto, or raise the limit.
- **Asset mapping is a design decision, not an engineering one.** The 6 untracked assets should not be wired in on filename inference alone; they need owner sign-off.
- **`/vision` rebuild scope is unbounded until Step 7 planning is done.** Treat it as its own project.
- **Green checks ≠ working UX.** This has bitten the project repeatedly. Keep manual/live verification in every UX-affecting step.
- **Static export constraints.** `output: "export"` means no server-side rendering at request time; anything dynamic must go through the Worker/API layer or client-side.
- **`h-screen` (100vh) vs `100dvh`.** Game shells still use `100vh`; on mobile this causes browser-chrome cropping. Low priority (desktop-only) but worth normalizing.

---

## 12. Appendices

### Appendix A — Environment & commands

```bash
npm run dev            # local dev server (localhost:3000)
npm run lint           # eslint
npm test               # vitest run
npx tsc --noEmit       # typecheck
npm run build          # next build (static export to ./out)
npm run deploy         # next build && wrangler deploy
npm run deploy:dry-run # wrangler deploy --dry-run against ./out
```

### Appendix B — Glossary

- **CDP** — Commit, Deploy, Push (in that exact order). A single, explicitly-approved release action.
- **ScrollStage** — the homepage scroll-linked section transition engine.
- **FoldCard / ScrollFoldScene** — fold-based reveal animation primitives (used on `/vision`; static on `/ls`).
- **FPV carousel** — the atmospheric AI-image carousel on `/ls` (first-person-view imagery), with a load-failure fallback.
- **Render terminal** — the design principle that the frontend only renders; all game/agent logic lives in the backend.
- **Design tokens** — CSS custom properties for colors and z-index (`--color-studio-*`, `--z-site-*`, `--z-game-*`).

### Appendix C — Key files quick reference

| Concern | File |
|---|---|
| Global header/footer/nav | `app/components/SiteChrome.tsx` |
| Homepage composition | `app/components/studio/HomePage.tsx` |
| Scroll transition engine | `app/components/motion/ScrollStage.tsx` |
| Hash → section scroll | `app/components/motion/useHashScrollToSection.ts` |
| Fold animation | `app/components/motion/FoldCard.tsx` |
| Buttons / cards | `app/components/studio/Button.tsx`, `Card.tsx` |
| Liminal Sin landing | `app/ls/LiminalSinLanding.tsx` (+ `LiminalSin*` sections) |
| Signup form | `app/ls/SignupForms.tsx` |
| Game client | `app/ls/game/GameClient.tsx` (+ `game/*` overlays) |
| Worker / API | `workers/signup-api.ts` (+ `workers/token.test.ts`) |
| Deploy config | `next.config.ts`, `wrangler.jsonc` |
| Governance | `AGENTS.md` |

### Appendix D — Status snapshot

- **Branch:** `main` (even with `origin/main`)
- **Latest commit:** `ec1bbdb` — "feat: link new routes in header nav and repoint vision roadmap links"
- **Total commits:** 222
- **Working tree:** clean (7 untracked files as listed in §6)
- **Completed this session:** Phases 1 & 2 (5 commits, all CDP'd); mobile audit (diagnosis only)
- **Blocked:** mobile live-browser verification (usage/quota limit)

---

*End of document. This is a journal and review only; it makes no code changes. Update the "Status snapshot" and change log as work proceeds.*
