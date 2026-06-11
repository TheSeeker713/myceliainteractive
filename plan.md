# plan.md — Mycelia Interactive (Rotational)

This file is editable and will change as work progresses.

## Current Objective
Implement a React Three Fiber background layer using `mycelia_bg.mp4` that responds to scroll and mouse/touch input.

### Video Location
`public/assets/video/mycelia_bg.mp4`

### Core Requirements
- Scroll down = video plays forward
- Scroll up = video plays backward
- No scroll = pause on current frame
- Subtle mouse + touch parallax
- All content (cards, sections, etc.) must sit above the video layer
- Full error handling
- Mobile friendly (UX + UI)
- Proper cleanup and performance considerations

---

## Implementation Steps (One at a time)

### Step 1: Project Setup & Structure
- Confirm video file location (`public/assets/video/mycelia_bg.mp4`)
- Install required dependencies if missing (`three`, `@react-three/fiber`, `@react-three/drei`)
- Create `VideoBackground.tsx` component skeleton
- Integrate into `SiteMotionShell.tsx` at the lowest layer

### Step 2: Basic Video Texture + R3F Canvas
- Load video as `VideoTexture`
- Render full-viewport plane
- Basic scroll scrubbing (progress → currentTime)

### Step 3: Scroll Direction Detection + Lerp
- Detect scroll direction
- Implement smooth lerp for scrubbing
- Pause video when scroll stops

### Step 4: Mouse Parallax
- Add normalized mouse tracking
- Apply gentle position + rotation to the plane

### Step 5: Touch Support (Mobile)
- Add touch event handling for parallax
- Ensure mobile UX is acceptable (possibly reduced parallax)

### Step 6: Error Handling & Robustness
- Handle video load failure
- Handle missing video file gracefully
- Add loading state / fallback

### Step 7: Mobile Responsiveness & Polish
- Full mobile testing
- Performance optimizations
- Respect reduced motion

### Step 8: Testing & Deployment
- Full build test
- Runtime testing
- Commit → Deploy → Push (after user approval)

---

## Notes
- Always refer to `agents.md` before executing any step.
- No step may proceed without explicit user approval.
- After each approved step: run tests → get approval → commit/deploy/push.