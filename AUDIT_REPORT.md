# Mycelia Interactive — Site Audit Report

**Date:** 2026-07-15  
**Environment:** Windows (GEM 10 Pro Mini clone at `D:\_Dev\Projects\myceliainteractive`)  
**Branch:** `main`  
**GitHub visibility:** **PUBLIC** (`https://github.com/TheSeeker713/myceliainteractive`)  
**Scope:** Phase 1 audit only — no remediation applied  
**Method:** Code review + Playwright mobile viewports (iPhone SE 320×568, iPhone 14 390×664, Pixel 5 393×851) against `npm run dev` at `http://localhost:3000`  
**Artifacts (gitignored):** `_tests/audit-artifacts/`

---

## Phase 0 summary (setup)

| Check | Result |
|---|---|
| macOS artifacts (`.DS_Store`, `._*`) | None found |
| Package manager | **npm** (`package-lock.json`) |
| Dependencies | Present; `npm run build` / `lint` / `test` / `npx tsc --noEmit` all pass |
| Branch | `main` (tracks `origin/main`) |
| Repo visibility | **PUBLIC** — treat secrets carefully before any push |
| `.gitignore` secrets | `.env*` ignored except `.env.production` (public `NEXT_PUBLIC_*` only). `.env.production` contains only `NEXT_PUBLIC_GAME_WS_URL` (already public-facing). Safe for automated push. |
| `.cursor/agents.mdc` | Created this session (stack, mandatory checks, auto commit/push vs deploy-gated CDP) |

---

## Executive summary

Highest-priority issue: on small mobile viewports, the **sticky site footer overlaps the homepage hero CTAs**, cutting off or burying primary actions. Background motion on most devices is a **canvas spritesheet scrubber** (~13 MB of WebP), not the `mycelia_bg.webm` `<video>` element (video is a low-end fallback). Meta/OG tags correctly use production URLs (no `localhost`). Several CTAs and the Roadmap “cloud credits” block read as **resource/fundraising asks** rather than product-company language.

**Do not proceed to Phase 2 until Jeremy explicitly approves these findings.**

---

## 1. Mobile responsiveness (priority)

### M1 — CRITICAL: Sticky footer overlaps hero CTAs on small phones

- **Files:** [`app/components/SiteChrome.tsx`](app/components/SiteChrome.tsx) (footer `sticky bottom-0`, lines ~145–172); [`app/components/studio/CardSlot.tsx`](app/components/studio/CardSlot.tsx) (`min-h-[calc(100dvh-var(--header-h)-var(--footer-h))]`); [`app/components/studio/sections/HeroSection.tsx`](app/components/studio/sections/HeroSection.tsx)
- **Reproduction:**
  1. Open `/` at iPhone SE width (320×568) or similar short viewport.
  2. Do not open the menu; observe first viewport.
  3. Primary CTA (“Request Private Access…”) is partially covered; secondary CTA (“Inquire About Collaboration”) sits under / behind the sticky footer.
- **Evidence:** `_tests/audit-artifacts/iPhoneSE-hero-closed.png`
- **Cause:** Header and footer are both `sticky`. On short viewports, available content height collapses; hero card + stacked full-width CTAs cannot fit between chrome bands.
- **Note:** A black circular “N” badge visible in local screenshots is the **Next.js Dev Tools** overlay in `next dev`, not a production UI bug.

### M2 — PASS with notes: Hamburger menu present and functional

- **File:** [`app/components/SiteChrome.tsx`](app/components/SiteChrome.tsx) lines 96–135
- **Reproduction:** Viewport &lt; `lg`; tap “Toggle navigation”; links Projects → The S33k3r appear; tap X closes.
- **Issues:**
  - Button lacks `aria-expanded` (always `null`) — screen readers cannot announce open/closed state.
  - `aria-label` is generic (“Toggle navigation”); prefer “Open menu” / “Close menu”.
- **Touch target:** Hamburger is 44×44 — meets minimum.

### M3 — MODERATE: Footer link touch targets below 44×44

- **File:** [`app/components/SiteChrome.tsx`](app/components/SiteChrome.tsx) footer links (~152–169)
- **Measured (iPhone SE / 14 / Pixel 5):**
  - “Privacy”: ~43×20
  - “10-Year Vision” / “Liminal Sin Privacy”: height ~20 on some viewports
- **Logo home link:** ~72×40 (height under 44)
- **Hero CTAs:** ≥44 height when not obscured (good sizing; blocked by M1)

### M4 — PASS: No horizontal overflow

- `documentElement.scrollWidth - innerWidth === 0` at rest and after scroll on iPhone SE, iPhone 14, Pixel 5.
- `body` uses `overflow-x: hidden` in [`app/globals.css`](app/globals.css) (~line 152).

### M5 — Hero background: not full-bleed `<video>` on typical mobile

- **File:** [`app/components/motion/VideoBackground.tsx`](app/components/motion/VideoBackground.tsx)
- **Actual behavior:**
  - Default path: fixed full-viewport **`<canvas>`** driven by scroll-scrubbed spritesheets (`spritesheet1–4.webp`), not `mycelia_bg.webm`.
  - Fallback path (`shouldUseFallback()` — Save-Data, 2g, ≤2 cores, ≤1GB deviceMemory): `<video autoPlay muted loop playsInline>` with WebM then MP4, `object-cover`, `absolute inset-0 h-full w-full`.
  - Reduced-motion / error: CSS `background-image` using `Mycelia_Interactive_Logo.jpg` as cover poster.
- **Autoplay policy:** Fallback video is `muted` + `playsInline` — compliant when that path runs.
- **Viewport units:** Canvas resized to `window.innerWidth/innerHeight` (not `100dvh`). Scroll stage sections use `100dvh` ([`ScrollStage.tsx`](app/components/motion/ScrollStage.tsx), [`CardSlot.tsx`](app/components/studio/CardSlot.tsx)). Mixed model is intentional but contributes to M1 chrome math.
- **Layout shift:** Poster/logo shows until sheet 0 loads (`opacity` transition 500ms) — possible visual shift; logo-as-poster is a poor stand-in for a scene frame.
- **Horizontal overflow from video:** Not observed on canvas path; fallback uses `object-cover` full bleed.

### M6 — Text scaling / line length

- Hero body uses `clamp` typography; measured paragraph width ~238–304px at 16px on phones — acceptable (roughly 35–45 characters).
- Long CTA label “Request Private Access to Liminal Sin” wraps to multiple lines on SE — readable but bulky under sticky footer (amplifies M1).

---

## 2. Performance

### P1 — HIGH: Spritesheet payload (~12.9 MB)

| Asset | Size |
|---|---|
| `spritesheet1.webp` | ~1.9 MB |
| `spritesheet2.webp` | ~2.9 MB |
| `spritesheet3.webp` | ~3.7 MB |
| `spritesheet4.webp` | ~4.3 MB |
| **Total** | **~12.9 MB** |

- Sheet 1 is `<link rel="preload">` in [`app/layout.tsx`](app/layout.tsx) lines 68–74 (`fetchPriority="high"`).
- Remaining sheets load via `requestIdleCallback` — good deferral, still heavy on cellular.

### P2 — MODERATE: Video assets large; underused on default path

| Asset | Size |
|---|---|
| `mycelia_bg.webm` | ~2.7 MB |
| `mycelia_bg.mp4` | ~6.4 MB |
| `ais_clip.webm` | ~3.9 MB |

- No `poster` attribute on fallback `<video>`; reduced-motion uses logo JPG (~701 KB) instead of a dedicated still frame.
- Consider a compressed scene poster WebP and/or not shipping both MP4+WebM if one format covers targets.

### P3 — MODERATE: Unoptimized images

- [`next.config.ts`](next.config.ts): `images: { unoptimized: true }` (required for static export) — no on-the-fly Next optimizer.
- Heavy stills still in repo:
  - `Liminal_Sin_Title.jpg` ~801 KB (also OG image)
  - `Mycelia_Interactive_Logo.jpg` ~701 KB
  - `Mycelia Interactive Banner.png` ~298 KB
  - `S33k3r_Card.webp` ~390 KB

### P4 — Lighthouse

- Chrome DevTools / Lighthouse MCP **not available** in this environment.
- Recommend Jeremy run Lighthouse mobile on production (`https://www.myceliainteractive.com`) after Phase 2; expect LCP pressure from spritesheet1 + large JPGs.

---

## 3. Accessibility

### A1 — PASS: Skip link, landmarks, single H1

- Skip link → `#main-content` in [`app/layout.tsx`](app/layout.tsx)
- `main` / `header` / `nav` / `footer` present
- Homepage H1: “Mycelia Interactive”
- Global `:focus-visible` outline in [`app/globals.css`](app/globals.css)

### A2 — PASS: Image alt coverage (sampled homepage)

- No `<img>` missing `alt` on homepage in Playwright pass.
- Decorative game layers correctly use `alt=""` + `aria-hidden` where applicable.

### A3 — MODERATE: Nested interactive (link wrapping button)

- [`HeroSection.tsx`](app/components/studio/sections/HeroSection.tsx) / [`ContactSection.tsx`](app/components/studio/sections/ContactSection.tsx): `<Link>` / `<a>` wraps `<Button>` which renders a native `<button>`.
- Invalid nesting; confusing for AT / double focus stops. Prefer `Button` as styled `Link`/`a` or `asChild` pattern.

### A4 — MODERATE: Mobile menu `aria-expanded` missing

- See M2. [`SiteChrome.tsx`](app/components/SiteChrome.tsx) hamburger button.

### A5 — Contrast (sampled)

- Token pair `#5c5c5c` on `#fafaf8` / white glass cards: Playwright contrast sampler found **no** &lt;4.5:1 failures on sampled text nodes against opaque ancestors.
- Glass-on-busy-background (hero text-on-glass tokens `#0f0f14` / `#14141e`) generally strong; risk is more **occlusion by footer (M1)** than contrast ratios.
- Accent `#2d6a7e` on white for links: likely AA for normal text; verify after any glass redesign.

### A6 — Keyboard

- Focus styles present; mobile menu is click-toggled only (no Escape-to-close observed in code). Recommend Escape handler + focus trap when open (Phase 2).

---

## 4. Technical hygiene

### H1 — PASS: No localhost / placeholder in social meta

- `metadataBase`: `https://www.myceliainteractive.com` ([`app/layout.tsx`](app/layout.tsx) line 18)
- `og:image` / `twitter:image`: `https://www.myceliainteractive.com/assets/images/Liminal_Sin_Title.jpg`
- Playwright checked `/`, `/ls`, `/roadmap`, `/vision`, `/team`, `/contact`, `/privacy`, `/ls/privacy` — **zero** localhost/placeholder meta contents.
- (Sibling DigiArtifact bug pattern **not** present here.)

### H2 — PASS: Internal links from homepage

- Playwright link crawl of homepage same-origin hrefs: **no** HTTP ≥400 responses.
- Routes `/`, `/ls`, `/roadmap`, `/vision`, `/team`, `/contact`, `/privacy`, `/ls/privacy` all 200 in local check.

### H3 — PASS: Console

- No page errors / console errors on homepage load across three mobile profiles in Playwright.

### H4 — NOTE: Copyright year 2026

- Footer uses `new Date().getFullYear()` — correct for this audit date (2026), not a placeholder bug.

### H5 — NOTE: Dev-only Next.js “N” badge

- Appears in `next dev` screenshots over footer; absent from static `out/` production export. Do not remediate as product UI.

---

## 5. Positioning & copy audit

Criterion: flag language that reads as **attracting investors / chasing resources** rather than **a functioning company with real products**.

### Instances (exact copy → suggested alternative)

| # | Location | Existing copy | Assessment | Suggested alternative |
|---|---|---|---|---|
| C1 | [`HeroSection.tsx`](app/components/studio/sections/HeroSection.tsx) L32 | `Request Private Access to Liminal Sin` | Slightly exclusive/gatekeeping; not investor pitch. Acceptable if product is genuinely gated; can sound “demo for VIPs.” | `Play the Liminal Sin demo` or `Request demo access` |
| C2 | [`HeroSection.tsx`](app/components/studio/sections/HeroSection.tsx) L44; [`ContactSection.tsx`](app/components/studio/sections/ContactSection.tsx) L54 | `Inquire About Collaboration` | Mildly formal/BD; not fundraising. Fine if aimed at creators/partners. | `Talk with us` or `Contact the studio` |
| C3 | [`RoadmapSection.tsx`](app/components/studio/sections/RoadmapSection.tsx) L13–18 | Heading `MVP Roadmap & AI/Cloud Resource Needs` + body “what targeted cloud credits would enable…” | **Fundraising / grant theater.** Centers resource ask over shipped plan. | `Near-term product roadmap` + body focused on milestones only (“What we’re building next…”) |
| C4 | [`RoadmapSection.tsx`](app/components/studio/sections/RoadmapSection.tsx) L41–42 | `Cloud Credits Enable` | Explicit credits ask. | Remove section, or rename to `Infrastructure priorities` without “credits” framing |
| C5 | [`RoadmapSection.tsx`](app/components/studio/sections/RoadmapSection.tsx) L60; [`data.ts`](app/components/studio/data.ts) `CLOUD_CREDIT_NEEDS` | CTA `Inquire About Cloud Credits` + bullet list of credit-funded capabilities | Strongest investor/sponsor signal on the site. | Remove CTA, or replace with `Discuss technical partnership` only if that is a real product path — not cloud-credit solicitation |
| C6 | [`data.ts`](app/components/studio/data.ts) `PROOF_POINTS` L60–62 | Label `Two-person founding team` / detail `Shipped interactive IP` | Slight pitch-deck cadence. | `Studio team` / `Public interactive releases` |
| C7 | [`TeamSection.tsx`](app/components/studio/sections/TeamSection.tsx) L33–34 | `Bootstrapped two-person team · Albuquerque, New Mexico · shipping publicly accessible experiences` | “Bootstrapped” can read as funding narrative; rest is solid company fact. | `Two-person studio · Albuquerque, New Mexico · shipping public experiences` |
| C8 | [`VisionPage.tsx`](app/vision/VisionPage.tsx) | “10-Year North Star Horizon”, aspirational phases, disclaimer that it is not MVP | Largely **substantive strategy** with an explicit “not near-term” disclaimer — **not** fundraising theater. Keep; optional softer title `Long-term direction`. | Optional: `Long-term direction` instead of “North Star Horizon” |
| C9 | Nav / footer | `10-Year Vision` | Fine as a page name; combined with C3–C5 roadmap it can amplify “deck” feel. | Keep if vision page stays product-grounded |

### Not found

- No “now raising,” dollar asks, “join us in disrupting…,” Series/seed language, or explicit investor CTAs in app copy.

### Overall positioning verdict

- Homepage About/Mission and Liminal Sin product pages read as a **real studio shipping interactive IP**.
- The **Roadmap page’s cloud-credits block (C3–C5)** is the main outlier that tilts the site toward resource solicitation.
- Hero CTAs (C1–C2) are understated enough; shortening C1 would feel more product-confident on mobile.

---

## Recommended Phase 2 priority order (for approval)

1. **Fix M1** — sticky footer vs hero CTA collision (mobile-first).
2. **Copy C3–C5** — remove or rewrite cloud-credits framing on Roadmap.
3. **A3 / A4** — un-nest button-in-link; add `aria-expanded` (+ Escape close).
4. **M3** — enlarge footer/logo hit areas.
5. **P1–P3** — reduce spritesheet/poster weight; dedicated poster frame; compress OG JPG.
6. Optional polish: C1/C6/C7 wording; Lighthouse pass on production.

---

## Approval gate

**Phase 2 must not start until Jeremy explicitly approves this report** (or a revised subset of findings).

After approval, remediation should follow `.cursor/agents.mdc`: mandatory `build` / `lint` / `tsc` / `test` after each discrete change; commit/push to `main` for version control; **no production deploy without separate CDP approval**.
