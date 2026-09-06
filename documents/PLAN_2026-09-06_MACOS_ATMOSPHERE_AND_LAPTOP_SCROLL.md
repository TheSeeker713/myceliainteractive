# Homepage Mac atmosphere and laptop trackpad repair plan

**Date:** 2026-09-06  
**Status:** Audited draft for Jeremy's review; website implementation not approved or started  
**Owner:** Jeremy Robards, CTO and CAIO, Mycelia Interactive

## Plan audit

This draft was checked against the current repository on September 6, 2026. The audit confirmed that the plan targets the active systems rather than the retired background path.

- The desktop onboarding `Got it` action currently records onboarding as seen and dismisses the dialog. It does not directly tell `MyceliaFlowAtmosphere` to retry `video.play()` inside that click.
- When autoplay fails, the atmosphere installs playback retries on pointer movement and scroll. That indirect path may miss the strongest user-activation moment provided by the onboarding button.
- The WebGL capability probe creates a WebGL2 context and immediately requests context loss before the real renderer creates its own context. This is valid as a resource-release attempt, but its timing must be tested on the affected Mac rather than assumed harmless.
- The card state machine intentionally accepts `pendingDirection` while a transition is running. Desktop wheel momentum shares that state machine with keyboard and other navigation paths, so the repair must isolate wheel-gesture consumption and preserve deliberate non-wheel input.
- Existing unit tests confirm that queued direction currently works, but they do not model a complete Mac or Windows trackpad burst with momentum and a quiet-period boundary.
- This workspace cannot reproduce the affected physical MacBook GPU, Chrome media policy, or real trackpad stream. Any claim of a Mac fix requires Jeremy's production-device evidence at the specified gates.

The phase order remains sound: restore the atmosphere first, manually verify it on the affected MacBook, then change wheel handling while guarding the repaired atmosphere input.

## Reported production behavior

1. On a MacBook using Chrome, the homepage background is static. The liquid movement and pointer/scroll interaction that previously worked are absent.
2. On Windows using Chrome, the liquid background works.
3. On both laptops, a single two-finger trackpad scroll can advance two or more cards and skip content.
4. The existing onboarding control is intentional. Its click should provide the user activation that Chrome requires before blocked motion or media features are resumed.

These are user reports from production. They have not yet been reproduced in this repository session.

## Current code observations

- `SiteMotionShell` mounts `MyceliaFlowAtmosphere`, `MotionOnboardingGate`, and the mobile tilt bridge on motion-enabled routes.
- The active full atmosphere uses `/assets/atmosphere/mycelia-flow.mp4` as a muted looping video texture in a WebGL2 renderer. The old `VideoBackground` spritesheet component remains a rollback path and is not the active homepage background.
- The atmosphere currently retries `video.play()` after pointer movement and scroll when autoplay fails. The repair must verify whether the onboarding click directly reaches this playback path on desktop Chrome.
- Atmosphere behavior can also be affected by capability selection, reduced-motion preference, the stored pause-atmosphere setting, video readiness, WebGL2 creation, and context loss.
- Desktop card navigation accumulates `WheelEvent.deltaY` until 72 pixels and starts a discrete transition. While that transition plays, another intent can be stored in `pendingDirection`. Trackpad momentum from one physical gesture can therefore be interpreted as a second requested card. This is the leading hypothesis, not yet a confirmed root cause.
- Wheel input over a scrollable card is intentionally left to the card's native overflow behavior. Wheel input outside the visible card controls card navigation and feeds the atmosphere.

## Required behavior

- One deliberate two-finger vertical trackpad gesture advances at most one card.
- Momentum from that gesture cannot queue another card after the transition.
- A later, distinct gesture can advance the next card without feeling stuck.
- Mouse-wheel, keyboard, hash navigation, in-card overflow, mobile horizontal swipe, accessibility preferences, and atmosphere input continue to work.
- The onboarding click deliberately retries browser-gated media and motion features and gives visible, accessible status when full motion is unavailable.
- A user who requests reduced motion or pauses the atmosphere keeps that choice. Onboarding does not override an accessibility preference.
- The atmosphere has a usable static or reduced fallback when full WebGL/video motion cannot run.
- Each step follows the two-pass test, daily devlog, commit, push, deployment, and reporting rules in `AGENTS.md`.
- Each phase ends with Jeremy's manual production test and written greenlight before the next phase begins.

## Phase 1 — Restore the macOS Chrome atmosphere

### Step 1.1 — Reproduce and isolate the failure

**Requires separate approval before work.**

Create an opt-in diagnostic path suitable for the affected production device, then capture production and local behavior after a clean reload and after using onboarding. The diagnostic surface must avoid exposing secrets or visitor data and must be removable after the investigation. Record:

- Chrome version, macOS version, hardware model, power or energy mode, device pixel ratio, and viewport.
- `prefers-reduced-motion`, stored accessibility motion/pause preferences, and whether Chrome reports recent user activation after onboarding.
- Atmosphere capability and mode selection, WebGL2 availability, renderer or shader errors, context loss, video network/readiness state, `play()` result, and whether frames reach the texture.
- Console errors and the network result for the MP4 and poster.

Compare the same observations with working Windows Chrome. Jeremy runs the production-device portion and returns its output because the agent workspace is not the affected hardware. Add only the smallest temporary diagnostic surface needed to establish the failing boundary, and remove or intentionally retain it before the step closes. Do not assume autoplay is the cause merely because the symptom fits.

**Automated verification:** focused tests for any extracted diagnostics or state classification, then the full required suite twice.  
**Production result:** a deployed, reviewable diagnostic correction or confirmed no-code finding with an evidence report.  
**Phase status:** remains open; this step does not authorize Step 1.2.

### Step 1.2 — Implement the confirmed playback or rendering recovery

**Requires separate approval after Step 1.1 is reported.**

Implement the smallest correction supported by Step 1.1. Likely paths include wiring the onboarding click to a direct atmosphere resume action, correcting a Mac-specific capability decision, handling video readiness before texture upload, restoring a lost WebGL context, or repairing preference-state handling. Preserve reduced-motion and pause choices. Give onboarding a clear success or fallback state that can be checked without opening developer tools.

**Focused verification:** playback-resume state, user-activation path, capability/fallback selection, reduced-motion and pause preference preservation, renderer failure fallback, and no repeated permission loop. Run the full suite and focused checks twice.  
**Production result:** deploy through the normal push-triggered Cloudflare build and provide the Phase 1 production report.

### Phase 1 manual production gate

Jeremy tests on the affected MacBook in current Chrome:

- Fresh private window before onboarding.
- Click onboarding once and confirm whether the liquid background begins moving.
- Move the pointer and scroll; confirm both visibly affect the atmosphere.
- Reload and navigate away and back; record persistence behavior.
- Enable reduced motion and pause atmosphere separately; confirm each choice is respected.
- Leave the tab and return; confirm the atmosphere resumes or falls back cleanly.
- Report console or visual errors, Chrome/macOS versions, and whether every check passed.

Phase 2 begins only after Jeremy returns the Phase 1 production report and explicitly greenlights Phase 2.

## Phase 2 — Enforce one trackpad gesture per card

### Step 2.1 — Model a complete wheel gesture

**Requires separate approval after the Phase 1 gate.**

Capture representative Chrome wheel sequences from Mac and Windows trackpads, including momentum tails, direction reversal, fast flicks, slow swipes, and a second deliberate gesture. Define a platform-neutral gesture boundary using event timing and state rather than user-agent detection.

Change the desktop wheel-input state so the first threshold crossing consumes the current gesture. Ignore its remaining same-direction momentum through transition and settle. Do not allow wheel momentum to use `pendingDirection` to turn one physical gesture into a second card. Re-arm only after an evidence-based quiet period or a clearly new gesture. Preserve deliberate reverse input and decide its behavior from captured sequences. Keep keyboard and non-wheel queuing behavior unless the captured evidence shows a separate defect.

Do not solve this only by increasing `WHEEL_TRIGGER_THRESHOLD_PX`; a larger threshold alone does not guarantee one-card movement and may harm mouse-wheel accessibility.

**Focused verification:** synthetic trackpad event streams prove one gesture equals at most one card; separate gestures advance separately; momentum tails do not queue; direction reversals are deterministic; bounds remain stable. Run all focused checks and the full suite twice.

### Step 2.2 — Preserve native scrolling and other inputs

**Requires separate approval after Step 2.1 is deployed and reported.**

Verify and correct the boundary between page-stage navigation and the card's internal scrollport. A two-finger gesture inside long card content scrolls that content without accidental card skipping. Confirm mouse wheel, Arrow and Page keys, hash navigation, mobile horizontal drag, atmosphere wheel energy, and first and last card limits remain correct.

**Focused verification:** card hit-testing, internal overflow at middle and edges, mouse wheel, keyboard, hash links, mobile drag isolation, and atmosphere event continuity. Run the full suite and focused checks twice.  
**Production result:** deploy and provide the Phase 2 production report.

### Phase 2 manual production gate

Jeremy tests production with Chrome on both the MacBook and Windows laptop:

- Slow two-finger swipe outside a card: exactly one card.
- Fast flick outside a card with momentum: exactly one card.
- Two clearly separate swipes: exactly two cards.
- Reverse direction during and after a transition: no surprise skip.
- Scroll long content inside a card: content remains readable and the card does not skip.
- Mouse wheel and keyboard controls: one deliberate action has predictable results.
- First and last cards: no wrap or phantom transition.
- Background still responds after the input changes.

Phase 3 begins only after Jeremy returns the Phase 2 production report and explicitly greenlights Phase 3.

## Phase 3 — Cross-platform regression closeout

### Step 3.1 — Repair defects from manual production reports

**Requires separate approval after the Phase 2 gate.**

Address only defects documented in the Phase 1 and Phase 2 production reports. Keep fixes small and traceable. Add regression coverage for every confirmed code defect. Run the focused checks and full suite twice, update the day's devlog, deploy, and report.

### Step 3.2 — Final production verification

**Requires separate approval after Step 3.1.**

Verify the deployed commit, production assets, onboarding flow, background motion, one-card trackpad behavior, keyboard navigation, mobile behavior, accessibility preferences, and existing Worker/API routing. Record any accepted limitations. Run the required verification twice where it can be automated, update the devlog, deploy if the step changes code, and provide the final production report.

### Phase 3 manual production gate

Jeremy repeats the focused MacBook Chrome and Windows Chrome checks against the reported production commit. The repair initiative closes only after his report confirms the experience or explicitly accepts documented limitations.

## Step completion record

Every step report includes:

1. Approved phase and step number.
2. Changed files and the behavior changed.
3. First-pass and second-pass commands with complete results.
4. Relevant browser and device verification performed by the agent.
5. Devlog path and timestamp.
6. Commit hash, message, branch, and verified `origin/main` relationship.
7. Cloudflare deployment status and verified production URL.
8. Known limitations and the next gated step.

No website repair in this plan is approved merely because the plan exists.
