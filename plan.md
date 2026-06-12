# plan.md — Mycelia Interactive (Rotational)

This file is editable and will change as work progresses.

## Current Objective (New Phase)
Make the video background (`mycelia_bg.mp4`) actually respond to mouse wheel scrolling with proper forward/reverse scrubbing.

### The Problem
The current implementation is not working. The video appears static. Wheel scrolling does not visibly scrub the video forward or backward in real time.

### Core Requirements for This Phase
- Mouse wheel scroll **down** → video scrubs forward (plays through)
- Mouse wheel scroll **up** → video scrubs backward (reverse)
- When the user stops scrolling (wheel events stop) → video must pause at the current frame
- Scrubbing must feel responsive and visible (not laggy or static)
- Must work on desktop with mouse wheel
- Existing mouse/touch parallax should remain
- Should not break the rest of the site

---

## Implementation Steps (One at a time)

### Step 1: Audit Current Scrubbing Logic
- Analyze why `useScroll` + `scrollYProgress` is not producing visible scrubbing
- Identify if the issue is event source, timing, video texture update, or currentTime control

### Step 2: Switch to Direct Wheel Event Scrubbing
- Remove or bypass reliance on `useScroll` / `scrollYProgress` for time control
- Listen directly to `wheel` events
- On each wheel event, adjust `video.currentTime` based on `event.deltaY` (positive = forward, negative = reverse)
- Apply a sensible scrub rate (e.g. seconds per pixel of delta)

### Step 3: Implement Auto-Pause on Scroll Inactivity
- Detect when wheel events have stopped (using a timeout / debounce)
- When no wheel activity for a short period → call `video.pause()` while keeping the current frame

### Step 4: Improve Responsiveness & Feel
- Tune scrub sensitivity and smoothing so scrubbing feels alive while scrolling
- Handle rapid scrolling without jank or overshooting
- Consider using `requestAnimationFrame` for applying time changes

### Step 5: Edge Cases & Robustness
- Prevent currentTime from going outside video duration
- Handle video not yet loaded
- Ensure scrubbing still works alongside the existing parallax system
- Test behavior when the user is actually scrolling the page content

### Step 6: Mobile Wheel / Touch Scroll Consideration
- Decide and implement appropriate behavior for mobile (touch scrolling vs wheel)
- Keep reduced parallax on mobile

### Step 7: Testing & Iteration
- Real runtime testing with actual mouse wheel
- Build + lint after changes
- Adjust until the scrubbing feels correct

### Step 8: Commit → Deploy → Push
- Only after explicit approval and successful tests

---

## Notes
- Always refer to `agents.md` before executing any step.
- No step may proceed without explicit user approval.
- After each approved step: run tests → get approval → commit/deploy/push.
- This phase supersedes the previous video implementation plan. Focus is now strictly on making wheel-driven scrubbing work as described.