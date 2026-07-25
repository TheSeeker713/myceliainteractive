# Mycelia Interactive LLC

Mycelia Interactive LLC is an entertainment company developing original intellectual property across film, interactive experiences, games, and music. Our defining focus is real-time AI-driven response systems that use voice and vision — entertainment where the audience participates and stories respond in real time.

This repository is the **frontend/site repo**. It contains the public marketing website and the browser client for **Liminal Sin**, a psychological interactive experience built for the Gemini Live Agent Challenge.

## Team

**Mycelia Interactive LLC** — incorporated in New Mexico, May 2026 · Albuquerque, New Mexico

- **Adrianna Loya** — Founder; CEO, CCO, CFO
- **Jeremy Robards** — Co-founder; CTO, CAIO, CCO

## What This Repo Contains

- Mycelia Interactive LLC studio site (homepage and company pages)
- Liminal Sin marketing pages, access request flow, and gated play client
- Site motion shell: WebGL video-texture atmosphere, liquid-glass card stage
- Theme system (System / Lightside / Darkside) and accessibility preferences UI
- Mobile card navigation (drag-follow), tilt parallax, and first-visit onboarding gate
- Cloudflare Worker (`workers/signup-api.ts`) — signup API, access tokens, D1, cron

## Live Links

- Studio site: [https://www.myceliainteractive.com](https://www.myceliainteractive.com)
- Liminal Sin landing: [https://www.myceliainteractive.com/ls](https://www.myceliainteractive.com/ls)
- Liminal Sin access requests: [https://www.myceliainteractive.com/ls/game](https://www.myceliainteractive.com/ls/game)
- The S33k3r Transmission (external): [https://www.thes33k3r.com](https://www.thes33k3r.com)

## Contact

- contact@myceliainteractive.com
- jeremy@myceliainteractive.com
- adrianna@myceliainteractive.com

## Related Repositories

Frontend/site repo: TheSeeker713/myceliainteractive (this repo)  
The Liminal Sin backend runtime is maintained in a separate, private repository.

## Tech Stack

- Next.js 16.2.x (App Router, static export)
- React 19.2.x
- TypeScript 5.9.x
- Tailwind CSS 4.3.x
- Framer Motion
- Cloudflare Workers via Wrangler 4.98.x (assets from `./out`)

## Site features (high level)

- **Atmosphere:** WebGL video-texture background (`MyceliaFlowAtmosphere`) behind the studio shell
- **Card stage:** Desktop scroll/glitch pane navigation; mobile drag-follow card browsing with guide UI and image lightbox
- **Theme:** Sticky System / Lightside / Darkside toggle (persisted); CSS theme tokens
- **Accessibility:** Preferences panel (desktop popover / mobile bottom sheet) — contrast, text size, reduce motion, pause atmosphere
- **Mobile extras:** Device-tilt parallax (with permission) and motion onboarding gate

## Local Development

```bash
git clone https://github.com/TheSeeker713/myceliainteractive.git
cd myceliainteractive
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing (local)

Before considering a change complete, run:

```bash
npm run build
npm run lint
npx tsc --noEmit
npm test
```

**Future revision (MI):** Add GitHub Actions CI (`.github/workflows/ci.yml`) to run lint, test, and build on every push/PR. Requires a GitHub token with the `workflow` scope. Vitest and `npm test` are already in place; only the automated cloud runner is deferred.

## Full Liminal Sin Reproduction

This repo is the **frontend only**. To reproduce the full experience locally, also clone the backend:

```bash
git clone https://github.com/TheSeeker713/liminal-sin-gemini.git
```

## Deployment

**Primary path:** push to `main`. Cloudflare Workers Builds auto-builds and deploys the Worker (static assets from `./out`) on every push to `main`.

Manual `npm run deploy` (`next build && wrangler deploy`) exists for exceptional/out-of-band use and should not be treated as the normal ship path.

Dry-run validation (does not publish):

```bash
npm run deploy:dry-run
```

## Primary Frontend Routes

| Route | Description |
|---|---|
| `/` | Mycelia Interactive LLC studio homepage (card stage) |
| `/ls` | Liminal Sin landing — story, architecture, access request |
| `/ls/game` | Closed prototype gate — request access (not playable) |
| `/ls/play` | Private play entry — requires `?access=token` issued by team |
| `/ls/privacy` | Liminal Sin privacy policy |
| `/ls/judges` | Legacy deep-link easter egg — insult page, then client redirect to `/ls` |
| `/roadmap` | Company roadmap |
| `/vision` | 10-year vision |
| `/team` | Team |
| `/contact` | Contact |
| `/privacy` | Company privacy policy |
