# PLAN.md — MyceliaInteractive.com Rebuild (June 2026)

**Status:** Planning Phase  
**Theme:** Minimalistic Light Mode (keep current aesthetic)  
**Goal:** Create a clean, modern, high-end website with elegant interactive mycelial background elements that feel premium and intentional.

---

## 1. Goal

Rebuild `myceliainteractive.com` with a refined minimalistic light-mode design based on the provided wireframes and current live hero design.  
Replace the current poor mouse-scroll animation with a sophisticated, **layered, scroll-driven, multi-frame SVG animation system** where the mycelial branching node graphic evolves and reacts in a mathematically coherent way.

The site should feel like a high-quality creative studio / entertainment company — clean, immersive, and professional, with foreground cards that feel visually and mechanically connected to the background mycelium.

---

## 2. Core Design Principles

- **Minimalistic Light Mode** — Keep current clean aesthetic.
- **Layered Background System**:
  - **Layer 0**: Subtle bokeh blur background (very low opacity, gentle movement).
  - **Layer 1**: Multi-frame / animated SVG mycelial branching node tree (primary interactive element).
- **Foreground Layer**: All content cards sit cleanly above both background layers with glassmorphism or clean white styling.
- **Synchronized Scroll Animation**: Cards + mycelium must feel like one cohesive system. Mouse/scroll input drives elegant evolution of the SVG (branching growth, collapse, sway).
- **Sticky Header + Sticky Footer** (as shown in wireframes).
- **High visual quality** — Animations must feel intentional, organic, and premium (no jank or randomness).

---

## 3. Background Layer Architecture (Detailed from Wireframes)

### Layer 0 — Bokeh Blur Background
- Soft, subtle bokeh / light leak style.
- Very low opacity.
- Remains relatively static or moves very gently with scroll (parallax depth).

### Layer 1 — Mycelial Branching Nodes (SVG) — Core Interactive Element
- High-quality vector SVG of digital mycelium / node tree.
- **Multi-frame animation concept** (as shown in wireframes):
  - Frame 1–2: Simple trunk + early branches
  - Frame 3–5: Progressive branching and node activation
  - Frame 6–8: Full complex mycelium network (dense root/branch system)
- **Animation triggers**:
  - Primary: Mouse scroll position (vertical progress maps to animation frame/timeline)
  - Secondary: Mouse position (gentle sway / attraction effect on branches)
- The SVG should support smooth interpolation between frames or use a single complex SVG with `stroke-dashoffset`, `transform`, `opacity`, or morphing paths.
- Must feel alive and organic while remaining performant.

**Key Requirement**: The mycelium animation must feel mathematically connected to the cards above it.

---

## 4. Foreground Cards & Content Layer

- All content cards (Welcome card, project cards, etc.) are a distinct layer above the SVG.
- **Card Behavior on Scroll** (from wireframes):
  - Subtle parallax or micro-movement synced to mycelium.
  - On scroll-down: Cards can collapse, fade, or animate in coordination with the SVG “growth/collapse” cycle.
  - Example: Welcome card remains prominent in hero; subsequent cards react when user scrolls past the hero.
- Card styling: Clean white or glassmorphism with soft shadows, sitting elegantly above the mycelial background.

---

## 5. Hero Section (Based on Wireframe + Live Screenshot)

**Layout**:
- Sticky header: MI logo (blue circle) + navigation links (Projects, Roadmap, Liminal Sin, 10-Year Vision, The S33k3r).
- Large hero area with centered or elegantly placed **Welcome Card** (“Welcome to the Network”).
- Mycelial SVG background visible behind and around the card.
- Left-side text: “NEW MEXICO · EST. 2026”, company name, tagline, and primary CTAs.
- Strong CTAs: “Request Private Access to Liminal Sin Vertical Slice” + “Inquire About AI & Cloud Credits Collaboration”.

**Sticky Footer**: Copyright, links (10-Year Vision, Privacy Policy), etc.

---

## 6. Animation System (Most Critical — Refined)

**Problem to Solve**: Previous mouse-scroll animation felt terrible.

**New Scroll-Driven Multi-Layer Animation System**:

1. **Central Animation Controller**
   - Use Framer Motion (preferred for React) or GSAP + ScrollTrigger.
   - Map `window.scrollY` / section progress to a normalized 0–1 or 0–8 timeline value.
   - This value drives:
     - SVG frame interpolation / path morphing / node activation
     - Card parallax, scale, opacity, or collapse transforms

2. **Mycelium SVG Animation**
   - Create SVG with multiple `<g>` groups or use a technique for progressive reveal (e.g., multiple paths with staggered `stroke-dashoffset` or morphing).
   - On scroll: Branches “grow” or “retract” elegantly.
   - On mouse move (hero only): Subtle branch sway or node glow following cursor.

3. **Card + Background Cohesion**
   - Cards receive the same scroll progress value.
   - Example behaviors:
     - Subtle vertical parallax (cards move slightly slower/faster than background).
     - When mycelium reaches “full bloom” frame, cards can gently lift or highlight.
     - On scroll past hero: Cards collapse or transition while mycelium animates to a resting state.

4. **Performance & Fallbacks**
   - Use `transform` and `opacity` only (GPU accelerated).
   - Provide reduced-motion / touch-device fallbacks (static beautiful SVG or simple CSS animations).
   - Lenis smooth scroll recommended for buttery experience.

**Recommended Tech Stack**:
- Next.js 16 + TypeScript + Tailwind CSS
- Framer Motion (primary)
- SVG with React components or inline SVG + motion
- Optional: Lenis for scroll, React Three Fiber if 3D depth desired later

---

## 7. Page Structure & Sections

1. **Sticky Header** — Logo + Nav
2. **Hero Section** — Welcome card + CTAs + interactive mycelium
3. **Value Proposition / About** — Clean cards
4. **Projects / Work** — Featured project cards
5. **Liminal Sin** — Dedicated immersive section
6. **10-Year Vision / Philosophy**
7. **Sticky Footer**

All sections use the same card system and respect the layered background.

---

## 8. Technical Implementation Phases

### Phase 1: Foundation
- Next.js 16 + TypeScript + Tailwind setup
- Sticky header + footer components
- Reusable Card, Button, Section components matching current live aesthetic

### Phase 2: Background Layers
- Implement Layer 0 bokeh background
- Design and implement high-quality interactive mycelium SVG component
- Build multi-frame / scroll-timeline driven animation system

### Phase 3: Animation Cohesion & Polish
- Central animation controller
- Synchronized card + mycelium behavior (parallax, collapse, growth)
- Mouse position influence on hero
- Performance optimization + mobile fallbacks

### Phase 4: Content & Full Site
- Build remaining sections
- Micro-interactions and accessibility
- Final visual QA against wireframes and live screenshot

---

## 9. Risks & Considerations

- **Performance**: Complex SVG + scroll animations must stay under 60fps on mid-range devices.
- **Mobile / Touch**: Mouse-driven effects need graceful degradation.
- **Cohesion**: The single biggest risk is background and cards feeling disconnected — this must be solved first in Phase 3.
- **Maintainability**: Keep animation logic centralized and well-documented.

---

## 10. Success Criteria

- Site feels premium, intentional, and high-end.
- Mycelial background is beautiful, responsive, and feels alive without being distracting.
- Cards and background feel mathematically and visually connected (one system).
- Scrolling experience is smooth and elegant (no jank).
- Matches the provided wireframes and current hero aesthetic.
- Maintains minimalistic light-mode aesthetic.

---

**Next Step**: Once approved, begin **Phase 1** (Foundation + Component system).

---

**Approved by**: ___________________________  
**Date**: ___________________________