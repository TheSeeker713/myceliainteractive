# AGENTS.md — Mycelia Interactive Project Rules

This file is immutable. Do not edit, delete, or overwrite this file unless explicitly directed by the user.

## Core Operating Rules

1. **One step at a time**
   All work must be broken into discrete, numbered steps. Only one step may be worked on at a time.

2. **User approval required for implementation**
   No step's actual code/content changes may begin without explicit user approval. This applies to what gets built, not to the mechanical act of committing and pushing once a step is done — see rule 4.

3. **Testing after every step**
   After completing an approved step, the full check suite (rule 9) must be run and pass before that step is considered complete.

4. **Commit and push are mandatory, automatic, and immediate**
   There is no separate "CDP" approval ceremony. Cloudflare Workers Builds auto-deploys on every push to `main` — this is accepted, intended behavior, not a hazard to gate or delay.

   After every step's checks pass:
   - Commit to `main` with a clear, specific message.
   - Push to `origin/main` immediately, automatically, without asking and without waiting for a separate "commit and push" prompt.
   - Report a commit/push record: hash, message, branch, and confirmed `origin/main` ahead/behind status. This must be verified against actual `git log origin/main`, never asserted from memory or from a prior claim.
   - If a previously claimed push cannot be verified against actual `git log origin/main`, say so explicitly rather than asserting it happened.

   No exceptions for "this might trigger a Cloudflare deploy" — it will, and that's fine.

5. **No assumptions**
   Never create, delete, or modify files/directories without prior user approval, beyond the mechanical commit/push covered in rule 4.

6. **AGENTS.md is non-destructive**
   This file must never be edited or deleted unless the user gives a direct directive to do so.

7. **Mobile-first & error handling**
   All implementations must include proper error handling and be mobile-friendly (UX + UI).

8. **Follow project AGENTS.md first**
   Always check and follow the rules in this file before taking any action. Where `.cursor/agents.mdc` and this file differ on anything other than version control (covered exclusively by rule 4 above), this file governs.

9. **Testing requirements**
   After every approved step, the following must be run and pass before commit/push:
   - `npm run build`
   - `npm run lint`
   - `npx tsc --noEmit`
   - `npm test`
   - Any other relevant tests (runtime, visual, mobile) appropriate to the step.

   These are the actual tools in use on this project. Do not reference or assume tooling not present in `package.json` (e.g. do not claim MSW, Prettier, Playwright, axe-core, or Lighthouse are part of the standard suite unless they have actually been added as dependencies — verify before stating a testing methodology as fact).

10. **Verification before assertion**
   Never report a change as "already present," "already done," or "already live" without first checking the actual current state (local build and/or production, as relevant to what the user is looking at). If challenged on whether a change exists, re-verify from source and live output before responding — do not defend a prior claim without checking it first.