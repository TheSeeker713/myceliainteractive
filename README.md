# Mycelia Interactive

Mycelia Interactive is an independent interactive narrative and experimental media studio focused on branching story systems, alternate reality design, interactive cinema, and emotionally reactive player experiences.

This repository is the **frontend/site repo** for Mycelia Interactive. It contains the public-facing website plus the browser client for **Liminal Sin**, an interactive FMV psychological horror experience built for the Gemini Live Agent Challenge.

## Ownership

Mycelia Interactive is owned and operated by **Jeremy W. Robards**.

**Liminal Sin** was developed by Jeremy W. Robards with **Adrianna Loya** credited as creative consultant.

## What This Repo Contains

This repository includes:

- the Mycelia Interactive website front end
- the Liminal Sin landing page
- the Liminal Sin playable browser client
- the judges route for the Liminal Sin submission build
- runtime UI systems such as onboarding, credits, card overlays, timers, and visual effects

## Live Links

- Studio site: [https://www.myceliainteractive.com](https://www.myceliainteractive.com)
- Liminal Sin landing page: [https://www.myceliainteractive.com/ls](https://www.myceliainteractive.com/ls)
- Liminal Sin game: [https://www.myceliainteractive.com/ls/game](https://www.myceliainteractive.com/ls/[REDACTED])
- Liminal Sin judges build: [https://www.myceliainteractive.com/ls/judges/game](https://www.myceliainteractive.com/ls/judges/[REDACTED)
(LINKS WILL BE UNREDACTED ON MARCH 16TH at 5pm)
## Related Repositories

- Frontend/site repo: [TheSeeker713/myceliainteractive](https://github.com/TheSeeker713/myceliainteractive)
- Backend/runtime repo: [TheSeeker713/liminal-sin-gemini](https://github.com/TheSeeker713/liminal-sin-gemini)

The backend repo contains the Gemini Live multi-agent runtime, WebSocket server, Google Cloud deployment, Firestore session state, and canonical media orchestration for Liminal Sin.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Cloudflare Workers / Pages deployment via Wrangler

## Local Development

### 1. Clone the repo

```bash
git clone https://github.com/TheSeeker713/myceliainteractive.git
cd myceliainteractive
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the frontend locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Important: Full Liminal Sin Reproduction

This repo is the **frontend only**.

To fully reproduce the Liminal Sin project locally, you also need the backend repo:

```bash
git clone https://github.com/TheSeeker713/liminal-sin-gemini.git
```

You need both repositories for the full end-to-end experience:

- this repo provides the browser UI and presentation layer
- the backend repo provides the live AI runtime, Google Cloud services, and WebSocket game server

## Deployment

This project is deployed through Cloudflare using Wrangler.

```bash
npm run deploy
```

That command builds the static export and deploys the site.

## Primary Frontend Routes

- `/` — Mycelia Interactive home page
- `/mycelia` — studio page
- `/ls` — Liminal Sin landing page
- `/ls/game` — public Liminal Sin game route
- `/ls/judges/game` — judges route
- `/ls/lsr.html` — Liminal Sin runtime/status report
