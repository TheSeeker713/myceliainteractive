# Homepage macOS atmosphere and laptop trackpad repair plan

**Date:** 2026-09-06
**Status:** Revised and audited plan for Jeremy's review; website repair implementation is not approved or started
**Owner:** Jeremy Robards, CTO and CAIO, Mycelia Interactive

## 1. Purpose and scope

Repair two production problems on the main Mycelia Interactive website without mixing their diagnosis or risking unrelated input and accessibility behavior.

1. On Jeremy's MacBook using Chrome, the liquid WebGL/video-texture atmosphere is static. It previously moved and responded to pointer and scroll input.
2. On both macOS Chrome and Windows Chrome, one two-finger laptop trackpad gesture can advance two or more cards, causing visitors to miss content.

On Windows Chrome, the animated atmosphere currently works. The onboarding control is intentional. Its deliberate click should provide the direct user activation needed to resume browser-gated media or motion features.

This document authorizes nothing by itself. Every numbered step requires Jeremy's separate approval before it begins.

## 2. Verified current architecture

- `SiteMotionShell` mounts `MyceliaFlowAtmosphere`, `MotionOnboardingGate`, and the mobile tilt bridge on motion-enabled routes.
- The active full atmosphere uses `/assets/atmosphere/mycelia-flow.mp4` as a video texture rendered through WebGL2.
- `VideoBackground.tsx` is an inactive rollback path, not the production atmosphere.
- The MP4 is 1280×720 H.264 High profile at 24 FPS. It also contains AAC audio and an embedded MJPEG stream. These extra streams are not a confirmed defect, but media compatibility must remain part of the evidence review.
- When initial `video.play()` fails, the atmosphere installs retry calls on pointer movement and document scroll. Those events are not a dependable replacement for a direct activation click.
- If a video texture does not become ready within eight seconds, `FullVideoAtmosphere` enters a failed state and renders a static poster. That removes the video and canvas from the rendered output, so a later onboarding click may have nothing left to resume.
- The WebGL capability probe creates a WebGL2 context and immediately requests context loss before the production renderer creates its context. Its effect on the affected Mac must be measured, not assumed.
- Desktop card navigation accumulates raw `WheelEvent.deltaY` until 72 and calls the shared card state machine.
- During an active transition, the shared state machine accepts one `pendingDirection`. Continued momentum from the same physical trackpad gesture can therefore become a second card transition.
- Current wheel handling does not normalize `deltaMode`, reject Chrome trackpad pinch-zoom events, or distinguish predominantly horizontal/diagonal gestures from intentional vertical navigation.
- Wheel input beginning inside the visible card is currently left to native card scrolling. Outside-card wheel input drives card navigation and feeds atmosphere energy.
- Existing Vitest coverage verifies the current threshold, accumulation, queued direction, pointer hit-testing, preferences, and capability selection. It does not model a complete Mac or Windows trackpad event burst, user-activation timing, the eight-second fallback, or video-frame progress.
- The current repository does not include Playwright, axe-core, or another browser automation dependency. Do not promise those tools unless a separately approved step adds them.

## 3. Required final behavior

### Atmosphere

- On supported MacBook Chrome hardware, clicking onboarding directly attempts to activate the atmosphere during the trusted user gesture.
- The click reports a deterministic internal result: full motion resumed, usable fallback selected, or a classified failure.
- A visitor who waits longer than eight seconds before clicking onboarding can still recover when the device supports the full atmosphere.
- Pointer movement and scroll visibly influence the atmosphere after successful activation.
- Reload, same-site navigation, tab backgrounding, and tab restoration behave predictably.
- Reduce Motion and Pause Atmosphere always override recovery attempts.
- Unsupported or failed devices retain a stable poster or reduced fallback without a blank backdrop, repeated loop, or console-error storm.
- Decorative atmosphere status does not create unnecessary screen-reader announcements. Any user-facing fallback message must have a defined location, lifetime, and accessible wording before implementation.

### Laptop trackpad navigation

- One deliberate vertical two-finger trackpad gesture advances at most one card.
- Momentum from that gesture cannot populate `pendingDirection` or trigger another card after the first transition.
- A later, distinct gesture advances one additional card without feeling stuck.
- Predominantly horizontal or diagonal gestures do not accidentally navigate vertically.
- Chrome pinch-zoom and browser zoom gestures are never converted into card navigation or blocked by stage `preventDefault()` handling.
- Pixel, line, and page wheel delta modes are normalized before threshold decisions.
- A gesture beginning inside the visible card belongs to native content scrolling for its entire lifetime. Reaching the content edge during that gesture does not change cards. Card navigation requires a new deliberate gesture outside the card.
- Mouse wheel, keyboard, hash navigation, first/last-card bounds, mobile horizontal drag, accessibility preferences, and atmosphere wheel energy continue to work.

## 4. Mandatory workflow for every step

1. Jeremy explicitly approves the exact phase and step number.
2. Work is limited to that approved step.
3. Run every focused check required by the step and the complete repository suite:
   - `npm run build`
   - `npm run lint`
   - `npx tsc --noEmit`
   - `npm test`
4. Repeat the complete focused and repository verification as a second pass.
5. Both passes must be 100% green. A skipped required check, partial pass, flaky result, or single pass is a failure.
6. Immediately before writing the devlog, perform one fresh online search about human writing psychology and a second fresh search about current telltale patterns of AI-written prose.
7. Update the one existing `/docs/devlog/YYYY-MM-DD.md` for that working day. Do not create another devlog for additional steps completed on the same date.
8. Commit to `main`, push to `origin/main`, allow the configured Cloudflare Workers Build to deploy automatically, and verify GitHub and Cloudflare separately.
9. Report the changed files, both verification passes, devlog timestamp, commit, remote relationship, deployment, production URL, limitations, and next gated step.
10. At the end of a phase, stop for Jeremy's manual production report and explicit greenlight for the next named phase.

No manual Cloudflare deployment, retry, promotion, rollback, DNS change, or configuration mutation is allowed unless Jeremy explicitly approves that separate action.

## Phase 0 — Establish the production baseline

### Step 0.1 — Verify source and deployment state

**Requires separate approval before work. Read-only except for the required dated evidence/devlog record.**

- Verify the actual `origin/main` commit and tree.
- Verify the Cloudflare Workers Build associated with that commit and identify the active production deployment.
- Confirm `https://www.myceliainteractive.com` and existing primary routes respond without changing anything.
- Record Chrome version, macOS version, Mac model/chip, power or energy mode, display scaling, device pixel ratio, and viewport for the affected Mac.
- Record the equivalent Windows Chrome baseline.
- Record whether Reduce Motion or Pause Atmosphere is enabled in site preferences and whether the OS or Chrome has relevant battery, performance, autoplay, graphics-acceleration, or accessibility settings enabled.

**Evidence result:** a dated baseline report distinguishing confirmed facts from user-reported behavior.
**Implementation result:** none. Do not alter the site in this step.
**Gate:** Step 1.1 still requires separate approval.

## Phase 1 — Diagnose and restore the macOS Chrome atmosphere

### Step 1.1 — Capture a no-code failure trace

**Requires separate approval after Step 0.1.**

Use the affected MacBook and working Windows laptop to capture the same sequence without adding diagnostic code:

1. Open a fresh Chrome private window.
2. Load the production homepage and note whether onboarding appears.
3. Observe the first eight seconds without clicking.
4. Click onboarding once and immediately test pointer and wheel response.
5. Repeat with onboarding clicked before the eight-second boundary.
6. Reload, navigate away and back, background the tab, and restore it.
7. Test Reduce Motion and Pause Atmosphere separately.
8. Record console errors and network results for the MP4 and poster.

Capture, where Chrome exposes it:

- `navigator.userActivation.isActive` synchronously inside the onboarding click and `hasBeenActive` afterward.
- Atmosphere mode selection and WebGL2 availability.
- `video.error?.code`, `paused`, `readyState`, `networkState`, `currentTime`, `videoWidth`, `videoHeight`, and `currentSrc`.
- `getVideoPlaybackQuality()` and a `requestVideoFrameCallback()` result where supported.
- MP4 response status, content type, content length, byte-range behavior, cache status, and timing.
- Renderer or shader errors, context loss/restoration, texture readiness, and whether decoded frames advance before the eight-second timeout.

Do not assume autoplay, the WebGL probe, the MP4, or the timeout is responsible until the trace separates these boundaries.

**Repository record:** save only a sanitized evidence summary; do not store private browser history, tokens, headers containing secrets, or unnecessary device identifiers.
**Focused verification:** verify the evidence template contains every required field and no sensitive data, then run the complete suite twice.
**Gate:** if the evidence identifies the failure boundary, proceed only to Step 1.3 after separate approval. If it does not, Step 1.2 may be proposed.

### Step 1.2 — Add opt-in diagnostic instrumentation if required

**Conditional and separately approved. Skip this step entirely if Step 1.1 is conclusive.**

Add the smallest temporary or intentionally retained diagnostic surface needed to expose the missing state. Prefer a local or explicit query-gated diagnostic path over default production UI. It must:

- Remain disabled during ordinary visits.
- Expose no secrets or visitor data.
- Classify capability selection, playback request/result, video readiness, decoded-frame progress, texture readiness, timeout, context loss, and fallback entry.
- Capture user activation synchronously during the onboarding click.
- Provide a copyable sanitized report for Jeremy's Mac and Windows comparison.
- Define whether the instrumentation remains as a supported diagnostic or is removed in a separately approved cleanup step. Do not add and remove deployed instrumentation inside one supposedly atomic step.

**Focused verification:** pure state-classification tests, activation-timing tests, privacy/redaction tests, failure fallback, and query-gate isolation. Run all focused checks and the complete suite twice.
**Production result:** deploy through the normal push-triggered build and provide a narrow diagnostic checklist.
**Gate:** Jeremy returns both device reports before Step 1.3 can be approved.

### Step 1.3 — Implement the evidence-supported atmosphere recovery

**Requires separate approval after Step 1.1 or Step 1.2 reports the confirmed boundary.**

Implement only the smallest correction supported by the evidence. Candidate paths include:

- A direct, synchronous onboarding-to-atmosphere activation request.
- Recovery after the current eight-second fallback instead of permanently removing the resumable media path.
- Correct video readiness or decoded-frame handling before texture upload.
- Correct capability detection or the WebGL probe lifecycle.
- Context-loss recovery.
- Preference-state correction.
- A validated replacement media encoding, but only if media decoding is confirmed as the fault.

The onboarding activation contract must be idempotent, return a classified result, clean up obsolete retry listeners after success, preserve preferences, and never create a repeated permission or retry loop.

**Focused verification:** activation inside the trusted click, click-before-timeout, click-after-timeout, playback rejection, playback-without-frame-progress, texture readiness, capability selection, WebGL failure, context loss/restoration, tab restoration, preference preservation, idempotency, listener cleanup, and stable fallback. Run all focused checks and the complete suite twice.
**Production result:** deploy through the normal Cloudflare build and provide the Phase 1 production report.

### Phase 1 manual production gate

Jeremy tests the deployed commit on the affected MacBook in current Chrome:

- Fresh private window; wait longer than eight seconds, then click onboarding.
- Fresh private window; click onboarding immediately.
- Confirm liquid motion begins when full capability is available.
- Confirm pointer and wheel interaction are visible.
- Reload and navigate away/back.
- Background and restore the tab.
- Enable Reduce Motion and Pause Atmosphere separately and confirm each remains authoritative.
- Confirm fallback is stable when full motion is intentionally unavailable.
- Report Chrome/macOS versions, device details, console or visual errors, and pass/fail for every check.

Phase 2 remains blocked until Jeremy returns this report and explicitly greenlights Phase 2.

## Phase 2 — Enforce one physical trackpad gesture per card

### Step 2.1 — Capture and classify real wheel streams

**Requires separate approval after the Phase 1 gate. No navigation behavior changes in this step.**

Capture sanitized event sequences from Mac and Windows Chrome for:

- Slow deliberate vertical swipe.
- Fast vertical flick and momentum tail.
- Two clearly separated swipes.
- Direction reversal during and after momentum.
- Predominantly horizontal and diagonal gestures.
- Trackpad pinch-zoom.
- Mouse-wheel notch input.
- Gestures beginning inside and outside the card.

Record `deltaX`, `deltaY`, `deltaMode`, `timeStamp`, modifier keys, pointer location, card bounds, machine status, and whether the event was prevented. Do not use user-agent detection as the gesture boundary.

Use the traces to define and document:

- Delta normalization for pixel, line, and page modes.
- Vertical-intent dominance.
- Threshold and reversal behavior.
- Gesture-consumed state.
- Momentum suppression.
- Quiet-period or other evidence-based re-arm rule.
- Pinch-zoom and modifier exclusions.
- Native in-card gesture ownership.

**Focused verification:** validate the trace format, redaction, and deterministic classification expectations, then run the complete suite twice.
**Gate:** Step 2.2 requires Jeremy's separate approval of the documented gesture model.

### Step 2.2 — Implement the wheel gesture controller

**Requires separate approval after Step 2.1.**

Extract a platform-neutral wheel gesture controller with explicit states:

1. Idle
2. Accumulating
3. Consumed
4. Suppressing momentum
5. Re-armed

Normalize deltas before threshold decisions. Reject pinch-zoom and non-vertical gestures before calling `preventDefault()`. After the first accepted threshold crossing, consume the physical gesture and suppress its remaining momentum. Wheel input must not populate the shared card machine's `pendingDirection`. Re-arm only when the captured evidence identifies a distinct new gesture.

Preserve intentional queuing for keyboard or other non-wheel sources unless separate evidence identifies a defect. Continue feeding safe wheel energy to the atmosphere without letting it drive extra card transitions.

**Focused verification:** synthetic versions of every captured Mac and Windows stream; one gesture produces at most one transition; two separate gestures produce exactly two; momentum cannot queue; reversal is deterministic; pinch-zoom is untouched; horizontal/diagonal input is ignored; all `deltaMode` values normalize predictably; bounds remain stable. Run all focused checks and the complete suite twice.
**Production result:** deploy and report Step 2.2. Step 2.3 remains separately gated.

### Step 2.3 — Preserve native content scrolling and all other inputs

**Requires separate approval after Step 2.2 is deployed and reported.**

Enforce the gesture-ownership rule: a wheel gesture that begins inside the visible card remains native content scrolling for that complete gesture, including when it reaches the top or bottom. It cannot convert into card navigation mid-gesture. A new deliberate gesture outside the card is required to change cards.

Verify and correct only confirmed regressions involving:

- Mouse-wheel input.
- Arrow and Page keys.
- Hash and same-page navigation.
- Mobile horizontal drag and touch isolation.
- First and last card bounds.
- Atmosphere wheel energy.
- Onboarding and accessibility overlays.
- Browser zoom and text scaling.

**Focused verification:** card hit-testing, gesture ownership, internal overflow at middle and edges, mouse wheel, keyboard, hash links, mobile isolation, bounds, overlays, zoom gestures, and atmosphere continuity. Run all focused checks and the complete suite twice.
**Production result:** deploy and provide the Phase 2 production report.

### Phase 2 manual production gate

Jeremy tests production in Chrome on both the MacBook and Windows laptop:

- Slow outside-card swipe: exactly one card.
- Fast outside-card flick with momentum: exactly one card.
- Two separate outside-card swipes: exactly two cards.
- Reverse direction: no surprise skip.
- Horizontal and diagonal gestures: no accidental vertical navigation.
- Pinch-zoom: browser zoom remains available and no card changes.
- Long content inside a card: native scrolling remains readable and does not change cards, including at content edges.
- Mouse wheel and keyboard: predictable deliberate navigation.
- First and last cards: no wrapping or phantom transition.
- Background: still animated and responsive after the input changes.

Phase 3 remains blocked until Jeremy returns this report and explicitly greenlights Phase 3.

## Phase 3 — Conditional regression closeout

### Step 3.1 — Repair only defects confirmed by production reports

**Conditional and separately approved after the Phase 2 gate. Skip if no defects are reported.**

Address only defects recorded in the Phase 1 or Phase 2 production reports. Keep corrections small and traceable. Add regression coverage for each confirmed code defect. Run focused checks and the complete suite twice, update the day's devlog, commit, push, verify deployment, and report.

### Step 3.2 — Final read-only production verification

**Requires separate approval after Step 3.1, or directly after the Phase 2 gate if Step 3.1 is skipped.**

Verify the deployed commit, production assets, onboarding recovery, background motion, one-card trackpad behavior, native card scrolling, pinch-zoom, keyboard navigation, mobile behavior, accessibility preferences, and existing Worker/API routing. Record accepted limitations.

If this step produces no repository change, do not manufacture a code change or deployment merely to create activity. Record the read-only result in the next legitimate dated devlog update or a separately approved evidence record, consistent with the governing rules.

### Phase 3 manual production gate

Jeremy repeats the focused MacBook Chrome and Windows Chrome checklist against the reported production commit. The repair initiative closes only after his report confirms the experience or explicitly accepts documented limitations.

## Step completion record

Every completed step report includes:

1. Approved phase and exact step number.
2. Changed files and behavior, or an explicit no-code result.
3. First-pass and second-pass commands with complete results.
4. Relevant browser and device evidence.
5. Devlog path and timestamp when a devlog is required.
6. Commit hash, message, branch, and verified `origin/main` relationship when a commit is created.
7. Cloudflare deployment status and verified production URL when a deployment is triggered.
8. Known limitations and the next gated step.

No website repair in this plan is approved merely because the plan exists, is committed, or is deployed.
