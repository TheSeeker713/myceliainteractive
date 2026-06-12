# PLAN.md — Mycelia Interactive Hero Card: Glassmorphism Redesign

## Goal

Transform the current hero card (white/light solid card with dark text) into a **glassmorphism card** that matches the aesthetic in the iOS Control Center reference screenshot: frosted glass panels, translucent blur layers, soft borders, and depth through layered transparency — while preserving all existing content and CTAs.

---

## Visual Reference Analysis (iOS Control Center Screenshot)

The target glass style has these specific properties:

- **Background:** Blurred, translucent — you can faintly see content behind the panel
- **Surface color:** Very dark (near-black) at ~20–30% opacity, or light-tinted at ~15% opacity depending on light/dark mode
- **Border:** 1px solid white at 15–25% opacity (not a heavy outline — a whisper)
- **Border radius:** Large — approximately 20–28px on panels
- **Backdrop filter:** `blur(20px) saturate(180%)` — the key CSS property that creates the frosted look
- **Inner glow:** Subtle white highlight along the top/left edge (light source from above)
- **Shadow:** Soft outer shadow, not harsh — `box-shadow: 0 8px 32px rgba(0,0,0,0.18)`
- **Text:** White or near-white on dark glass; dark or near-black on light glass
- **No solid fill** — the card feels like etched glass floating over the background

---

## Current Hero Card (from Screenshot 1)

```
Background: mycelium/ink artwork (light cream)
Card: solid white/near-white fill, rounded corners, large drop shadow
Title: "Mycelia Interactive" — large black serif-style
Subtitle: "LLC"
Body: two lines of descriptive copy
CTAs: [Request Private Access to Liminal Sin] [Inquire About Collaboration]
```

---

## Target Design Spec

### Card Container

```css
.hero-card {
 background: rgba(255, 255, 255, 0.12);
 backdrop-filter: blur(24px) saturate(180%);
 -webkit-backdrop-filter: blur(24px) saturate(180%);
 border: 1px solid rgba(255, 255, 255, 0.22);
 border-radius: 24px;
 box-shadow:
 0 8px 32px rgba(0, 0, 0, 0.18),
 inset 0 1px 0 rgba(255, 255, 255, 0.35);
 padding: 48px 56px;
 max-width: 860px;
 width: 90%;
 margin: 0 auto;
}
```

> Note: `inset 0 1px 0 rgba(255,255,255,0.35)` creates the top inner highlight — the detail that makes glass look real.

### Typography

Keep existing font choices but adjust colors for glass legibility:

```css
.hero-card h1 {
 color: rgba(15, 15, 20, 0.92); /* Near-black, not pure black */
 letter-spacing: -0.02em;
}

.hero-card .subtitle {
 color: rgba(30, 30, 40, 0.65); /* Softer secondary text */
}

.hero-card p {
 color: rgba(20, 20, 30, 0.78);
}
```

> If the page ever uses a dark background variant, flip to `rgba(255,255,255,0.92)` etc.

### CTA Buttons

Primary button (teal/dark — "Request Private Access"):

```css
.cta-primary {
 background: rgba(30, 90, 100, 0.82);
 backdrop-filter: blur(8px);
 -webkit-backdrop-filter: blur(8px);
 border: 1px solid rgba(255, 255, 255, 0.18);
 border-radius: 12px;
 color: #ffffff;
 padding: 12px 24px;
 box-shadow: 0 4px 16px rgba(30, 90, 100, 0.3);
 transition: background 0.2s ease, box-shadow 0.2s ease;
}

.cta-primary:hover {
 background: rgba(30, 90, 100, 0.95);
 box-shadow: 0 6px 24px rgba(30, 90, 100, 0.45);
}
```

Secondary button ("Inquire About Collaboration"):

```css
.cta-secondary {
 background: rgba(255, 255, 255, 0.15);
 backdrop-filter: blur(8px);
 -webkit-backdrop-filter: blur(8px);
 border: 1px solid rgba(0, 0, 0, 0.15);
 border-radius: 12px;
 color: rgba(15, 15, 20, 0.85);
 padding: 12px 24px;
 transition: background 0.2s ease;
}

.cta-secondary:hover {
 background: rgba(255, 255, 255, 0.28);
}
```

---

## Page Background Requirement

Glassmorphism ONLY works when there is visible content behind the glass. The existing mycelium artwork background is perfect — but it must be:

1. Set as a **fixed or absolute background** behind the card (not inside it)
2. **Not blurred at the page level** — only the card blurs it
3. If using Next.js + React Three Fiber, ensure the canvas or background image sits at `z-index: 0` and the card floats at `z-index: 10`

```jsx
// Page structure (conceptual)
<div className="hero-wrapper">
 <div className="hero-background"> {/* mycelium art here */} </div>
 <div className="hero-card">
 {/* all card content */}
 </div>
</div>
```

```css
.hero-wrapper {
 position: relative;
 min-height: 100vh;
 display: flex;
 align-items: center;
 justify-content: center;
}

.hero-background {
 position: absolute;
 inset: 0;
 z-index: 0;
 background-image: url('/assets/mycelium-bg.jpg');
 background-size: cover;
 background-position: center;
}

.hero-card {
 position: relative;
 z-index: 10;
 /* glass styles from above */
}
```

---

## Implementation Steps (in order)

1. **Confirm background layer** — Verify the mycelium artwork is a proper background element, not part of the card itself. It must sit behind and be visible through the card.

2. **Remove solid card fill** — Strip `background: white` or any opaque fill from the hero card component.

3. **Apply glass styles** — Add the `.hero-card` CSS block above. Start with `backdrop-filter: blur(24px)` and adjust blur intensity between 16px–32px to taste.

4. **Add inner highlight** — The `inset 0 1px 0 rgba(255,255,255,0.35)` box-shadow line is critical. Do not skip it — this is the detail that separates glass from frosted plastic.

5. **Restyle CTAs** — Apply the glass-aware button styles. The primary button keeps its teal identity but becomes slightly translucent.

6. **Adjust text contrast** — Use the near-black values listed above instead of pure `#000000`. On glass, pure black reads as too harsh.

7. **Test on mobile** — Reduce padding to `32px 28px` at breakpoints below 640px. Ensure `backdrop-filter` has `-webkit-` prefix for Safari/iOS.

8. **Browser fallback** — Add `@supports not (backdrop-filter: blur(1px))` block that falls back to a semi-opaque solid white (`rgba(255,255,255,0.85)`).

---

## Tailwind Utility Classes (if using Tailwind)

If the project uses Tailwind CSS, the equivalent utilities are:

```html
<div class="
 bg-white/10
 backdrop-blur-2xl
 saturate-150
 border border-white/20
 rounded-3xl
 shadow-[0_8px_32px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.35)]
 px-14 py-12
 max-w-3xl w-[90%] mx-auto
 relative z-10
">
```

> Note: Tailwind does not have a built-in `inset` shadow utility — use the JIT arbitrary value syntax shown above, or define it in `tailwind.config.js` under `theme.extend.boxShadow`.

---

## What NOT to Do

- Do NOT add a white or solid background behind the card — this kills the glass effect entirely
- Do NOT use `filter: blur()` on the card element itself — that blurs the content inside. Use `backdrop-filter` only.
- Do NOT set opacity on the entire card element — it will make text transparent too. Use `rgba()` on background only.
- Do NOT skip the `-webkit-backdrop-filter` prefix — iOS Safari requires it.

---

## Success Criteria

The card should look like it was cut from frosted glass and is floating over the mycelium background art. You should be able to see the dark ink lines of the artwork faintly through the card surface. The title text remains clearly legible. The inner highlight on the top edge is visible but subtle.