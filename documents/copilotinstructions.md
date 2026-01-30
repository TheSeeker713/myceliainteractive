# Mycelia Interactive - Copilot Instructions & Project Context

**Project Status Date:** January 29, 2026  
**Current Phase:** Step 1.1 ✅ Complete — Project Initialization  
**Next Phase:** Step 1.2 — Tailwind CSS 4.0 Configuration

---

## PROJECT OVERVIEW

**Mycelia Interactive** is an interactive cinema platform with a cinematic hero section combining:
- **Split-screen branching effect** (interaction #1) — left/right panes with hover/scroll triggers
- **Glitch aesthetic transitions** (interaction #2) — reality distortion and VHS effects on headline
- **Contrast design** — purple/pink/cyan palette contrasting with the brand logo (teal/gold)
- **Mycelia-inspired network background** — animated canvas-based node connections

**Target Audience:** Interactive storytellers, branching narrative enthusiasts, immersive media creatives

---

## TECHNOLOGY STACK (As of January 29, 2026)

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.1.6 | App Router, Turbopack bundler, SSR/RSC |
| **React** | 19.2.3 | UI library with View Transitions API support |
| **TypeScript** | 5.x | Type safety and IDE intelligence |
| **Tailwind CSS** | 4.x | Utility-first CSS with v4 engine and OKLCH colors |
| **Framer Motion** | 12.29.2 | Advanced animations and choreography |
| **clsx** | 2.1.1 | Conditional className utility |
| **tailwind-merge** | 3.4.0 | Merge Tailwind classes without conflicts |
| **PostCSS** | (bundled) | CSS transformation pipeline |

---

## DESIGN DIRECTION

### Color Palette (Contrasting Logo)

**Logo Colors:** Teal/cyan (#00CED1 range) + Gold/orange (#FFB84D range)

**Hero Contrast Scheme:**
```
Primary Background:    Deep purple/violet (#1a0b2e, #2d1b4e)
Accent 1 (Primary):    Electric pink/magenta (#FF10F0, #E535AB)
Accent 2 (Secondary):  Icy blue (#00F5FF, #4DFFFF)
Neutrals:              Charcoal (#0a0a0a) to slate (#2a2a3a)
Text/Highlights:       Pure white (#FFFFFF)
```

**Rationale:** Purple/pink contrasts with teal/gold while maintaining cinematic mystery. Creates visual separation between brand identity and hero section storytelling.

### Typography Hierarchy (To Be Configured)
- **Headline (H1):** Large, bold, glitch-enabled (serif or sans-serif TBD)
- **Subheadline (H2):** Medium weight, clean, supporting the main message
- **Body/CTA:** Small, legible, high contrast
- **Font Loading:** Prefer system fonts or Google Fonts (Fraunces, IBM Plex, etc.)

### Messaging Options (User to Choose One)

1. **Bold & Direct** — "Every Choice Creates a Universe" / "Interactive cinema where your decisions shape reality"
2. **Mysterious** — "The Story Doesn't End. It Multiplies." / "Step into branching narratives where every path is real"
3. **Action-Oriented** — "Choose Your Reality" / "Full motion video. Infinite possibilities. Your story."
4. **Manifesto Style** — "Stories Should Not Be Linear" / "We craft alternate realities through interactive cinema"

---

## DEVELOPMENT PHASES & CHECKLIST

### ✅ PHASE 1: Project Initialization (COMPLETE)
- [x] Step 1.1: Create Next.js 16 project with latest dependencies
  - Created via `npx create-next-app@16.1.6`
  - Configured: TypeScript, ESLint, Tailwind CSS, App Router, Turbopack
  - Installed additional: framer-motion, clsx, tailwind-merge
  - Dev server running at http://localhost:3000

- [ ] Step 1.2: Configure Tailwind CSS 4.0 with custom theme
  - Update `tailwind.config.ts` with OKLCH color tokens
  - Define CSS variables in `app/globals.css` for hero palette
  - Enable container queries and advanced CSS features
  - Test utility class generation

- [ ] Step 1.3: Set up TypeScript and project structure
  - Create `app/components/Hero/` directory structure
  - Add `app/components/Hero/types.ts` with interfaces for props
  - Configure path aliases in `tsconfig.json` (optional: `@/components`, `@/utils`)
  - Add JSDoc templates for Copilot hint

- [ ] Step 1.4: Configure global styles and CSS variables
  - Import Tailwind in `app/globals.css` (v4: `@import "tailwindcss"`)
  - Add custom CSS animations (glitch, split, fade)
  - Set up `:root` CSS variables for theme colors
  - Configure `prefers-reduced-motion` media query defaults

### PHASE 2: Hero Component Structure (Pending)
- [ ] Step 2.1: Build Hero.tsx container with layout
- [ ] Step 2.2: Implement responsive grid structure (Tailwind Grid)
- [ ] Step 2.3: Add typography hierarchy with custom fonts
- [ ] Step 2.4: Integrate logo placement

### PHASE 3: Split-Screen Branching Effect (Pending)
- [ ] Step 3.1: Create SplitScreen.tsx with hover/scroll trigger
- [ ] Step 3.2: Implement CSS Grid split with transition animations
- [ ] Step 3.3: Add "branching moment" visual where screen divides
- [ ] Step 3.4: Optimize for mobile (vertical split vs horizontal)

### PHASE 4: Glitch Aesthetic Integration (Pending)
- [ ] Step 4.1: Build GlitchText.tsx for headline/text glitch effects
- [ ] Step 4.2: Create CSS animations for reality distortion
- [ ] Step 4.3: Add VHS/digital artifact overlays
- [ ] Step 4.4: Implement timed glitch triggers (subtle, not overwhelming)

### PHASE 5: Animated Background Network (Pending)
- [ ] Step 5.1: Create NetworkBg.tsx with Canvas/SVG nodes
- [ ] Step 5.2: Animate connecting lines (mycelia-inspired)
- [ ] Step 5.3: Add particle glow effects
- [ ] Step 5.4: Ensure performance optimization (requestAnimationFrame)

### PHASE 6: Polish & Optimization (Pending)
- [ ] Step 6.1: Add smooth scroll animations (Intersection Observer)
- [ ] Step 6.2: Implement responsive breakpoints (mobile/tablet/desktop)
- [ ] Step 6.3: Performance audit (Lighthouse, bundle size)
- [ ] Step 6.4: Accessibility audit (ARIA labels, keyboard navigation)

### PHASE 7: Deployment Prep (Pending)
- [ ] Step 7.1: Configure next.config.js for Cloudflare Pages
- [ ] Step 7.2: Set up GitHub Actions workflow
- [ ] Step 7.3: Create deployment workflow
- [ ] Step 7.4: Test production build

---

## FILE STRUCTURE (Current & Target)

```
myceliainteractive/
├── app/
│   ├── favicon.ico
│   ├── globals.css              # Global styles + Tailwind imports + CSS variables
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Homepage (hero + future sections)
│   └── components/
│       └── Hero/                # (To be created)
│           ├── Hero.tsx         # Main hero container
│           ├── SplitScreen.tsx  # Split-screen branching effect
│           ├── GlitchText.tsx   # Glitch animation component
│           ├── NetworkBg.tsx    # Animated background canvas
│           └── types.ts         # TypeScript interfaces
│
├── public/
│   ├── assets/                  # (To be created)
│   │   └── logo.jpg             # Brand logo file
│   └── (favicon)
│
├── documents/                   # Documentation & instructions
│   └── copilotinstructions.md   # This file
│
├── node_modules/               # Dependencies (installed)
├── .eslintrc / eslint.config.mjs
├── .gitignore
├── next.config.ts              # Next.js configuration (Turbopack, image optimization)
├── postcss.config.mjs           # PostCSS pipeline
├── tailwind.config.ts          # Tailwind CSS configuration (to be updated)
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── package-lock.json
└── README.md
```

---

## COPILOT INSTRUCTIONS FOR NEXT STEPS

### General Principles

1. **Follow the numbered steps sequentially** — Each step builds on the previous; avoid jumping ahead.
2. **Write semantic, accessible code** — Use ARIA labels, semantic HTML, alt text on images.
3. **Respect `prefers-reduced-motion`** — Provide fallback non-animated versions for accessibility.
4. **Use TypeScript interfaces** — Define component props with JSDoc comments for Copilot guidance.
5. **Optimize for performance** — Prefer CSS animations over JS; use Canvas/WebGL for dense graphics; lazy-load heavy components.
6. **Test as you go** — Use `npm run dev` and browser DevTools to verify each component.

### How to Use This Document

**For Copilot (GitHub Copilot in VSCode):**

- When you see a step prompt (e.g., "Step 1.2: Configure Tailwind CSS"), read the file and context.
- Use the **File Structure** and **Design Direction** sections as reference for class names and color tokens.
- Use **Technology Stack** to understand available libraries and their versions.
- Suggest code that follows **Tailwind CSS 4 patterns**, **Next.js 16 App Router best practices**, and **React 19 hooks**.
- For animations, suggest both **CSS-first** (lighter) and **Framer Motion** (advanced choreography) approaches, then let the user pick.
- When creating components, include JSDoc comments describing the component's purpose, accessibility features, and animation triggers.

**For the User:**

- After each step, verify the changes in the browser at `http://localhost:3000`.
- Update the **Checklist** in this document as you complete steps.
- When in doubt, reference the **Design Direction** and **Technology Stack** sections.
- Use `npm run lint` to check for code quality issues.
- Use browser DevTools (F12) to profile animations and check accessibility (Lighthouse, axe).

---

## KEY REFERENCES & LINKS

### Documentation
- **Next.js 16 Docs:** https://nextjs.org/docs
- **React 19 Docs:** https://react.dev
- **Tailwind CSS 4 Docs:** https://tailwindcss.com/docs
- **Framer Motion Docs:** https://www.framer.com/motion/

### Accessibility Resources
- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **MDN Accessibility Handbook:** https://developer.mozilla.org/en-US/docs/Web/Accessibility
- **prefers-reduced-motion:** https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

### Performance
- **Lighthouse Guide:** https://developer.chrome.com/docs/lighthouse/
- **Core Web Vitals:** https://web.dev/vitals/
- **Canvas Performance:** https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

---

## COMMANDS & QUICK REFERENCE

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run the production server
npm start

# Run ESLint to check code quality
npm run lint

# Install a new package
npm install <package-name>

# Install a dev dependency
npm install --save-dev <package-name>
```

---

## NOTES FOR COPILOT

### Animation Strategy (TBD by User)
- **CSS-First (Recommended for Performance):** Use `@keyframes` and Tailwind's animation utilities for simple transitions (split-screen, fade-in).
- **Framer Motion (For Complex Choreography):** Use Framer Motion for staggered glitch sequences, physics-based springs, and synchronized motion across multiple elements.
- **Canvas/WebGL (For Network Background):** Use a single Canvas element with requestAnimationFrame loop; consider offloading to a Web Worker for heavy computations.

### JSDoc Comment Template (Use for All Components)
```typescript
/**
 * [Component Name] - [Brief description]
 * 
 * Features:
 * - [Feature 1]
 * - [Feature 2]
 * 
 * @param {[Type]} [propName] - [Description]
 * @returns {JSX.Element} Rendered component
 * 
 * @accessibility
 * - ARIA labels: [Describe ARIA usage]
 * - Keyboard support: [Describe keyboard navigation]
 * - Reduced motion: [Describe fallback for prefers-reduced-motion]
 * 
 * @example
 * <YourComponent prop1="value" />
 */
```

### Common Tailwind v4 Classes (Reference)
```
Colors: text-primary-600, bg-accent-magenta-500, border-neutral-300
Spacing: p-8, mx-auto, gap-4
Sizing: w-full, h-screen, max-w-4xl
Typography: text-4xl, font-bold, tracking-tight
Responsive: sm:w-1/2, md:w-2/3, lg:w-full
Animations: animate-fadeIn, animate-glitch (custom)
```

---

## COMMUNICATION STYLE FOR COPILOT

- **Be concise:** Explain what you're building in 1-2 sentences.
- **Show working code:** Provide complete, runnable components with imports and exports.
- **Suggest alternatives:** Offer CSS vs JS, or Framer Motion vs CSS animations.
- **Test as you go:** After code generation, suggest how to test in the browser.
- **Ask clarifying questions:** If a step is ambiguous, ask the user (e.g., "Should the split-screen trigger on hover or scroll?").
- **Respect accessibility:** Always include ARIA labels, alt text, and reduce-motion fallbacks in suggestions.

---

## TROUBLESHOOTING & FAQ

### Q: Dev server not starting?
**A:** Check `npm run dev` output. Ensure Node.js 20.9+ is installed. Clear `.next` cache: `rm -r .next && npm run dev`.

### Q: Tailwind classes not applying?
**A:** Verify `app/globals.css` imports `@import "tailwindcss"` and `tailwind.config.ts` is correct. Restart dev server.

### Q: Animations lagging on mobile?
**A:** Check if Canvas animation is running at 60fps. Reduce particle count for smaller screens. Profile with Chrome DevTools (Performance tab).

### Q: TypeScript errors in component props?
**A:** Ensure `app/components/Hero/types.ts` exports all interfaces. Import `{ ComponentProps }` in Hero.tsx. Run `npm run lint` to catch issues.

---

## NEXT IMMEDIATE STEP

**→ Proceed to Step 1.2: Configure Tailwind CSS 4.0**

This step will:
1. Update `tailwind.config.ts` with custom color tokens (purple, pink, cyan, neutrals)
2. Add CSS variables to `app/globals.css` for dynamic theming
3. Configure advanced Tailwind v4 features (container queries, OKLCH colors)
4. Test utility classes in the browser

Once Step 1.2 is complete, you'll be ready to build the Hero component structure in Phase 2.

---

**Last Updated:** January 29, 2026 — Step 1.1 ✅ Complete  
**Maintained By:** GitHub Copilot + User Collaboration
