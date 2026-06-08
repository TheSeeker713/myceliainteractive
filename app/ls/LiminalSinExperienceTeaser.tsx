"use client";

import { SectionReveal } from "@/app/components/motion/SectionReveal";

const EXPERIENCE_BULLETS = [
  "Speak naturally — your voice is the primary mechanic; no menus or controllers",
  "Characters perceive your webcam and vocal cadence through a live Game Master",
  "Trust and fear metrics shift agent behavior in real time across three characters",
  "Generative liminal environments rebuild with Imagen 4 stills and Veo video loops",
  "Break the fourth wall — consequences persist; the simulation can destabilize",
] as const;

export function LiminalSinExperienceTeaser() {
  return (
    <SectionReveal id="experience" className="ls-section-py scroll-mt-24">
      <div className="ls-gutter studio-section">
        <h2 className="text-2xl font-semibold text-studio-text mb-3">
          What You&apos;ll Experience
        </h2>
        <p className="text-studio-text-muted max-w-2xl mb-8 leading-relaxed">
          A gated vertical slice of Act 1 — a psychological trust-driven
          narrative where your presence shapes every exchange.
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          {EXPERIENCE_BULLETS.map((bullet) => (
            <li
              key={bullet}
              className="flex gap-3 text-sm text-studio-text-muted leading-relaxed"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-studio-accent"
                aria-hidden
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionReveal>
  );
}
