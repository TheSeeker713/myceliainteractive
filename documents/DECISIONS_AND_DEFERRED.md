# Decisions & Deferred — Living Reference

**Purpose:** Fast-reference record of settled conventions, intentional deferrals, and accepted tradeoffs. Decisions/state only — no narrative (see `PROJECT_HISTORY_AND_ROADMAP_*.md` for the story).
**Maintenance:** Update at the END of every CDP that establishes a new convention, defers something, or resolves a previously-deferred item. Keep entries to 1–3 lines. Do not let it go stale.
**Last updated:** July 3, 2026 (commit `3933439`)

---

## Established conventions (don't relitigate these)

- **Token naming:** `--z-site-*` / `--z-game-*` for z-index, `--color-studio-*` / `--color-game-*` for color. Role-based names, not positional (e.g. `chrome`, `content`, `danger` — never `layer1`).
- **Nav link order/grouping:** what we make → forward-looking company pages → about/reach-us → external. External links always last. (Current live order: Projects, Liminal Sin, Roadmap, 10-Year Vision, Team, Contact, The S33k3r.)
- **Breakpoint convention:** the horizontal desktop nav is `lg+` (not `md`), due to confirmed overflow risk at `md` with 7 nav items. Hamburger/mobile-dropdown mirror this at `lg`.
- **Commit granularity & CDP:** one logical change per commit. CDP (Commit → Deploy → Push, in that order) is always a separate explicit approval from implementation approval, and is never self-executed.
- **Deploy path:** always `npm run deploy` (`next build && wrangler deploy`); never run `wrangler deploy` directly. Build must pass before any deploy.
- **Rendering model:** static export (`output: "export"`); no request-time SSR. Anything dynamic goes through the Worker/API layer or client-side.
- **CSS cascade layers in `globals.css`:** any plain/unlayered author CSS added after the Tailwind import silently wins over `@layer utilities` regardless of source order (unlayered beats layered). New global rules must be wrapped in an explicit `@layer` (`base`, `components`, etc.) or they will override Tailwind utilities sitewide. Root-caused and fixed `3933439` (see resolved item below).

## Explicitly deferred (intentional, not forgotten — do not silently pick these up)

- **Secret mobile-only haptic vibration button:** full spec captured, held until all other phases are exhausted. Android-only via `navigator.vibrate()`; must be hidden from iOS entirely (not merely non-functional); lives inside the hamburger menu nested under panels/modules — never a visible icon.
- **CSP and COEP/COOP headers:** deferred pending live game-client origin testing (Gemini Live WebSocket, GCS media, third-party client origins). Rationale documented in `workers/signup-api.ts` (lines ~712–721). Other security headers are already shipped.
- **`/vision` full rebuild:** scoped as a separate, larger effort — a rebuild, not a patch (fold-duplication + low-contrast text). See roadmap journal §10, Step 7.
- **Unreferenced media assets → component mapping:** the media assets in `public/assets/` (About/Contact/Roadmap/KAIA/S33k3r + `ais_clip.webm`) are now git-tracked but referenced by zero components. Wiring them in is gated on an owner design decision, not filename inference.
- **Duplicated execution-protocol block in `.github/copilot-instructions.md`:** the STEP 1–5 block appears twice (~lines 9–35 and 37–63). Flagged, not yet resolved, low priority.

## Recently resolved

- **Sitewide unlayered CSS reset (fixed `3933439`):** `* { margin: 0; padding: 0; box-sizing: border-box; }` in `globals.css` was unlayered author CSS, which always beats `@layer utilities` regardless of source order — it was silently zeroing nearly every Tailwind margin/padding utility sitewide. Wrapped in `@layer base`; verified via clean rebuild, live probe re-test, full 6-item mobile re-audit, reduced-motion fallback, and `/vision`/form/`/ls/game`/`/ls/play` spot-checks. Surfaced two follow-on items, both logged below: the 375px hero H1 wrap and confirmation that the mobile nav dropdown's 20px tap targets are a separate, unrelated gap.

## Accepted current tradeoffs / known gaps (live in production right now)

- **`Button` `md` size ~40px tall (< 44px touch target)** sitewide, except the homepage hero (`size="lg"` + `min-h-11`). Pending the mobile-fix phase.
- **`/ls` FPV carousel horizontal overflow:** `w-full -mx-[clamp(...)]` shifts it off the left edge; masked by `body { overflow-x: hidden }`, so it clips instead of scrolling. Pending mobile-fix phase (M1).
- **Sticky footer overlap on mobile:** standalone pages' bottom padding (`py-12` ≈ 48px) is less than the mobile footer (~86px), so the last line can sit under the footer at scroll end; `ScrollStage` sticky height also ignores the footer. Pending mobile-fix phase (M3).
- **`/vision` legibility:** low-contrast text through much of the fold scroll is live until the rebuild lands.
- **`overflow-x: hidden` on `body`** currently masks real horizontal overflow rather than fixing root causes; remove reliance once overflows are fixed.
- **Homepage hero H1 ("Mycelia Interactive") wraps to two lines at exactly 375px width**, not at 390px+. Newly visible now that `Card` padding is correctly restored (narrows available text width from ~373px to ~287.5px); previously hidden by the CSS reset bug above. Not a regression, but not yet designed for — pending mobile-fix phase.
- **Mobile nav dropdown links are ~20px tall (well under 44px touch target).** Confirmed this is *not* a cascade-layer artifact — the `<Link>` elements carry no padding class at all; spacing comes solely from the wrapping `<nav>`'s `gap-3`. Needs a dedicated padding/tap-target fix, not a side effect of any CSS layer correction. Pending mobile-fix phase.
