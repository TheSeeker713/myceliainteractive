# Part 3 Step 3F.3 — Mobile card thumbnails + lightbox

## What shipped

- Shared [`MobileCardImage`](../app/mobile/MobileCardImage.tsx) (+ `MobileCardVideoThumb` for AIS)
- Compact mobile thumbnails (~10×9rem, `object-cover` / contain for project art)
- Tap thumbnail → portal lightbox (`role="dialog"`, `aria-modal`), visualViewport-pinned
- Tap expanded media or Escape closes (no separate close button)
- `[data-card-media]` excluded from 3F.2 drag capture so native long-press Save Image/Video can work
- Wired on: About, Mission, all 4 project panes, LS Hero, LS Story
- Desktop `ProjectMedia` / aspect-video blocks unchanged (`max-md:hidden`)
- FPV carousel unchanged; no invented media for copy-only heroes

## AIS video

No separate still asset — compact paused `<video preload="metadata">` (no autoplay). Same lightbox + drag exclusion. Native Save Video depends on the browser; confirm on device.

## Real-device confirmation required

- Thumbnails correctly sized
- Tap to expand / tap to shrink
- Long-press offers native save (or report if blocked)
- Drag-dismiss still works when starting from non-image card chrome
