# Part 3 Step 3F.4 — Mobile card first-use guide

## What shipped

- Semi-transparent L/R arrows on the **first card only** (`aria-hidden`)
- Tip below the hero card in the sticky-stage bottom band
- Copy: “Drag sideways to browse. Scroll inside a card to read more.”
- Short viewports (`max-height: 640px`): one-line fallback
- Shared `sessionStorage` key `mycelia-mobile-card-guide-seen`
- Both fade out together on the first successful dismiss drag from card index 0

## Real-device confirmation required

- Arrows on first card only
- Tip readable / not cramped
- Both fade on first successful drag
- No regression to 3F.2 drag mechanics

3F.3 (thumbnails/lightbox) stays on hold until this is confirmed.
