# Part 3 Step 3C — Harden (fresh pass after 3F)

## Scope

Re-harden covering everything shipped since the original Part 3 pass: drag-follow (3F.2), footer unstick (3F.1), thumbnails/lightbox (3F.3), first-use guide (3F.4).

## Changes

1. **`MobileCardImage` / `MobileCardVideoThumb`** — each export wrapped in `MobileFeatureErrorBoundary` (`feature="card-image"` / `card-video"`) so lightbox/portal failures cannot tear down the card stage.
2. **`MobileCardGuideArrows` / `MobileCardGuideTip`** — wrapped at `MyceliaCardStage` render sites (`card-guide-arrows` / `card-guide-tip`).
3. **Guide dismiss storage** — `markMobileCardGuideSeen()` called via `runMobileSafe("card-guide-mark-seen", …)`.
4. Existing coverage unchanged: a11y sheet, mobile nav toggle/panel, card-stage attach/listeners already use `callMobileSafe` / `runMobileSafe`.

## Pending confirmation

Not verified until Jeremy’s real-device + desktop pass (standing rule).
