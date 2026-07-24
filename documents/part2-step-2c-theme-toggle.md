# Part 2 Step 2c — Theme toggle (System / Lightside / Darkside)

## What shipped

- Real radiogroup toggle in sticky header (`role="radiogroup"` + `role="radio"` / `aria-checked`)
- [`ThemeToggle.tsx`](../app/components/ThemeToggle.tsx) shared by mobile + desktop chrome
- Preference: `localStorage` key `mycelia:theme` (`system` | `light` | `dark`); absent → Lightside default
- System follows `prefers-color-scheme` live (listens for OS changes); Lightside/Darkside persist explicitly
- Bootstrap script in [`layout.tsx`](../app/layout.tsx) sets `data-theme` before paint
- Chrome surfaces use theme tokens

## Pending confirmation

Toggle on phone + desktop; FOWT check; System OS sync; Darkside readability over atmosphere.
