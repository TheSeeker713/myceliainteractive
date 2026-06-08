# Mycelia Interactive LLC

Mycelia Interactive LLC is an entertainment company developing original intellectual property across film, interactive experiences, games, and music. Our defining focus is real-time AI-driven response systems that use voice and vision — entertainment where the audience participates and stories respond in real time.

This repository is the **frontend/site repo**. It contains the public marketing website and the browser client for **Liminal Sin**, a psychological interactive experience built for the Gemini Live Agent Challenge.

## Team

**Mycelia Interactive LLC** — incorporated in New Mexico, May 2026 · Albuquerque, New Mexico

- **Adrianna Loya** — Co-founder; CEO, CCO, CFO
- **Jeremy Robards** — Founder; CTO, CAIO, CCO

## What This Repo Contains

- Mycelia Interactive LLC studio homepage (`/`)
- Liminal Sin landing page (`/ls`) — story, access request form, FPV carousel
- Liminal Sin request gate (`/ls/game`) — closed prototype; directs visitors to request access
- Liminal Sin private play entry (`/ls/play?access=token`) — token-gated browser client (team-issued links only)
- Cloudflare Worker (`workers/signup-api.ts`) — signup API, access token validation, D1

## Live Links

- Studio site: [https://www.myceliainteractive.com](https://www.myceliainteractive.com)
- Liminal Sin landing: [https://www.myceliainteractive.com/ls](https://www.myceliainteractive.com/ls)
- Liminal Sin access requests: [https://www.myceliainteractive.com/ls/game](https://www.myceliainteractive.com/ls/game)
- The S33k3r Transmission (external): [https://www.thes33k3r.com](https://www.thes33k3r.com)

Private play links are issued by the development team only (`/ls/play?access=...`).

## Contact

- contact@myceliainteractive.com
- jeremy@myceliainteractive.com
- adrianna@myceliainteractive.com

## Related Repositories

- Frontend/site repo: [TheSeeker713/myceliainteractive](https://github.com/TheSeeker713/myceliainteractive)
- Backend/runtime repo: [TheSeeker713/liminal-sin-gemini](https://github.com/TheSeeker713/liminal-sin-gemini)

The backend repo contains the Gemini Live multi-agent runtime, WebSocket server, Google Cloud deployment, Firestore session state, and canonical media orchestration for Liminal Sin.

## Tech Stack

- Next.js 16.2.x
- React 19.2.x
- TypeScript 5.9.x
- Tailwind CSS 4.3.x
- Cloudflare Workers / Pages deployment via Wrangler 4.98.x

## Local Development

```bash
git clone https://github.com/TheSeeker713/myceliainteractive.git
cd myceliainteractive
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Full Liminal Sin Reproduction

This repo is the **frontend only**. To reproduce the full experience locally, also clone the backend:

```bash
git clone https://github.com/TheSeeker713/liminal-sin-gemini.git
```

## Deployment

```bash
npm run deploy
```

Builds the static export and deploys via Wrangler.

## Primary Frontend Routes

| Route | Description |
|---|---|
| `/` | Mycelia Interactive LLC studio homepage |
| `/ls` | Liminal Sin landing page + access request form |
| `/ls/game` | Closed prototype gate — request access (not playable) |
| `/ls/play` | Private play entry — requires `?access=token` issued by team |
| `/ls/privacy` | Liminal Sin privacy policy |

## Issuing prototype access (team)

1. Review access requests in the D1 `signups` table.
2. Insert a token into `access_tokens` (via Cloudflare D1 dashboard or `wrangler d1 execute`).
3. Email the requester: `https://www.myceliainteractive.com/ls/play?access=<token>`

Example D1 insert:

```sql
INSERT INTO access_tokens (token, email, name, expires_at, created_at, revoked)
VALUES ('your-random-token-here', 'requester@example.com', 'Name', 1735689600000, 1704067200000, 0);
```

Set `expires_at` to a Unix timestamp in milliseconds (e.g. 7–14 days from now).
