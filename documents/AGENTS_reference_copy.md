<!--
REFERENCE COPY — NOT AUTHORITATIVE.
The real, enforced version of this file lives at: AGENTS.md (repository root)
This copy was made on July 3, 2026 and may be out of date if the original has changed since.
Always read the original at the path above before relying on this content for any actual work.
-->
# AGENTS.md — Mycelia Interactive Project Rules

**CDP** = Commit, Deploy, then Push (in that exact order).

This file is immutable. Do not edit, delete, or overwrite this file unless explicitly directed by the user.

## Core Operating Rules

1. **One step at a time**  
   All work must be broken into discrete, numbered steps. Only one step may be worked on at a time.

2. **User approval required**  
   No step may be implemented without explicit user approval.

3. **Testing after every step**  
   After completing an approved step, full build + integrity tests must be run before moving to the next step.

4. **CDP (Commit → Deploy → Push) sequence**  
   After every approved and tested step, the sequence must be: CDP.  
   This sequence must receive explicit user approval before execution.

5. **No assumptions**  
   Never create, delete, or modify files/directories without prior user approval.

6. **AGENTS.md is non-destructive**  
   This file must never be edited or deleted unless the user gives a direct directive to do so.

7. **Mobile-first & error handling**  
   All implementations must include proper error handling and be mobile-friendly (UX + UI).

8. **Follow project AGENTS.md first**  
   Always check and follow the rules in this file before taking any action.

9. **Testing Requirements**  
   After every approved step, the following must be run and pass before CDP:
   - `npm run build`
   - `npm run lint`
   - Any other relevant tests (runtime, visual, mobile) as appropriate for the step.

10. **Full Testing Methodology** (adopted 2026-06-11)
   The project follows a Testing Pyramid approach:

   - **Unit Tests**: Pure functions, utilities, hooks (Vitest + jsdom)
   - **Component Tests**: React components in isolation (Vitest + @testing-library)
   - **Integration Tests**: Multiple components + data flow (Vitest + MSW)
   - **E2E Tests**: Critical user journeys only (Playwright preferred)
   - **Additional Checks**: TypeScript (`tsc --noEmit`), ESLint, Prettier, Lighthouse, a11y (axe-core), bundle analysis, security (`npm audit`)

   Full details are documented in the project testing strategy.
