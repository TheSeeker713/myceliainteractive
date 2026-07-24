# Part 4 — Mobile tilt parallax + motion onboarding

## What shipped

- [`tiltInput.ts`](../app/mobile/tiltInput.ts) — orientation → viewport client point
- [`atmospherePointerBridge.ts`](../app/mobile/atmospherePointerBridge.ts) — feeds `MyceliaFlowAtmosphere` existing pointer/warp/camera channels (no parallel shaders)
- [`MobileTiltParallax.tsx`](../app/mobile/MobileTiltParallax.tsx) — deviceorientation listener behind error boundary
- [`OnboardingGate.tsx`](../app/mobile/OnboardingGate.tsx) — first-visit gate; points to Accessibility for Reduce Motion; iOS `requestPermission()` only inside the Enable tilt gesture
- Desktop gets a lighter “Got it” gate (no permission prompt)

## Structurally verifiable now

- Permission request is invoked from the button click handler (iOS 13+ requirement)
- Graceful no-op when DeviceOrientationEvent is missing / permission denied
- Bridge subscription is wired into FullVideoAtmosphere pointer path

## Requires Jeremy’s real phone

- Actual tilt feel / sensitivity
- iOS permission dialog behavior and post-grant persistence
- Desktop gate timing/copy comfort

## Pending confirmation

Everything in Part 4 is shipped, pending confirmation.
