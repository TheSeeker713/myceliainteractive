# AGENTS.md — Mycelia Interactive Project Rules

This file is immutable. Do not edit, delete, or overwrite this file unless explicitly directed by the user.

## Core Operating Rules

1. **Phases and steps; one approved step at a time**
   All work must be organized into named phases containing discrete, numbered steps. The agent may not start or continue an implementation step without Jeremy's explicit approval for that exact step. Approval of a phase or plan does not authorize every step inside it.

2. **User approval required for implementation**
   No step's actual code/content changes may begin without explicit user approval. This applies to what gets built, not to the mechanical act of committing and pushing once a step is done — see rule 4.

3. **Two-pass testing after every step**
   After completing an approved step, run the full check suite and every relevant step-specific check twice. Both passes must report 100% passing results. Any skipped required check, partial pass, flaky result, failure, or result below 100% means the step failed and may not be completed, logged, committed, pushed, or deployed.

4. **Devlog, commit, push, and deployment are mandatory and ordered**
   There is no separate "CDP" approval ceremony. Cloudflare Workers Builds auto-deploys on every push to `main` — this is accepted, intended behavior, not a hazard to gate or delay.

   After both verification passes succeed, complete the devlog required by rule 10. Then:
   - Commit to `main` with a clear, specific message.
   - Push to `origin/main` immediately, automatically, without asking and without waiting for a separate "commit and push" prompt.
   - Treat the configured Cloudflare Workers Build triggered by that push as the normal deployment path. Verify the resulting deployment before calling the step complete. Do not run a separate manual deploy unless Jeremy explicitly directs it.
   - Report a commit/push record: hash, message, branch, and confirmed `origin/main` ahead/behind status. This must be verified against actual `git log origin/main`, never asserted from memory or from a prior claim.
   - Report deployment verification separately. A successful push is not proof that production deployed.
   - If a previously claimed push cannot be verified against actual `git log origin/main`, say so explicitly rather than asserting it happened.

   No exceptions for "this might trigger a Cloudflare deploy" — it will, and that's fine.

5. **No assumptions**
   Never create, delete, or modify files/directories without prior user approval, beyond the mechanical commit/push covered in rule 4.

6. **AGENTS.md is non-destructive**
   This file must never be edited or deleted unless the user gives a direct directive to do so.

7. **Mobile-first & error handling**
   All implementations must include proper error handling and be mobile-friendly (UX + UI).

8. **Follow project AGENTS.md first**
   Always check and follow the rules in this file before taking any action. Where `.cursor/rules/agents.mdc` and this file differ on anything other than version control (covered exclusively by rule 4 above), this file governs.

9. **Testing requirements**
   After every approved step, the following must be run and pass twice before the devlog, commit, push, and deployment sequence:
   - `npm run build`
   - `npm run lint`
   - `npx tsc --noEmit`
   - `npm test`
   - Any other relevant tests (runtime, visual, mobile, browser, or device-input tests) appropriate to the step.

   Record the command and result for both passes. Required tests may not be skipped or averaged together. Both passes must be completely green.

   These are the actual tools in use on this project. Do not reference or assume tooling not present in `package.json` (e.g. do not claim MSW, Prettier, Playwright, axe-core, or Lighthouse are part of the standard suite unless they have actually been added as dependencies — verify before stating a testing methodology as fact).

10. **One dated devlog per working day**
   After both test passes are green and before committing, update `/docs/devlog/YYYY-MM-DD.md` using the current project date. Reuse that day's file for every step and phase completed that day; never create a second devlog for the same date.

   Every entry must contain:
   - A timestamp followed on the same line by a one-sentence review of the step.
   - One or more detailed paragraphs describing the production experience, the decisions made, what changed, testing evidence, problems encountered, and the state of production.
   - The byline `Jeremy Robards, CTO and CAIO, Mycelia Interactive`.

   The devlog is written in Jeremy Robards's first-person prose. Immediately before every devlog-writing session, perform two fresh online searches: one about human writing psychology and one about current telltale patterns of AI-written prose. Use those findings to edit for natural human rhythm and Jeremy's established writing patterns. Record the research URLs in a source note so the requirement can be audited; do not copy source language into the entry. If either search cannot be completed, stop before writing the devlog and report the blocker.

11. **End-of-phase production gate**
   Completing the last step in a phase does not authorize the next phase. After that step is deployed, stop and provide Jeremy with a production report containing the production URL, deployed commit, changes included, automated test results from both passes, known limitations, and a focused manual UI/UX checklist.

   Jeremy must test the production website himself and return both:
   - An explicit greenlight for the next named phase.
   - A report of his production testing, including devices/browsers used and any defects observed.

   The agent may analyze that report and revise the next-phase plan, but it may not implement the next phase until both items are received.

12. **Verification before assertion**
   Never report a change as "already present," "already done," or "already live" without first checking the actual current state (local build and/or production, as relevant to what the user is looking at). If challenged on whether a change exists, re-verify from source and live output before responding — do not defend a prior claim without checking it first.
