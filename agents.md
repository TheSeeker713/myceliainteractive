# AGENTS.md — Mycelia Interactive Project Rules

This file is immutable. Do not edit, delete, or overwrite this file unless explicitly directed by the user.

## Core Operating Rules

1. **One step at a time**  
   All work must be broken into discrete, numbered steps. Only one step may be worked on at a time.

2. **User approval required**  
   No step may be implemented without explicit user approval.

3. **Testing after every step**  
   After completing an approved step, full build + integrity tests must be run before moving to the next step.

4. **Commit / Deploy / Push sequence**  
   After every approved and tested step, the sequence must be: commit → deploy → push.  
   This sequence must receive explicit user approval before execution.

5. **No assumptions**  
   Never create, delete, or modify files/directories without prior user approval.

6. **AGENTS.md is non-destructive**  
   This file must never be edited or deleted unless the user gives a direct directive to do so.

7. **Mobile-first & error handling**  
   All implementations must include proper error handling and be mobile-friendly (UX + UI).

8. **Follow project AGENTS.md first**  
   Always check and follow the rules in this file before taking any action.
