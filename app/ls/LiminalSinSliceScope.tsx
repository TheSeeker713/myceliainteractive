"use client";

import { SectionReveal } from "@/app/components/motion/SectionReveal";
import { StudioCard } from "@/app/components/motion/StudioCard";

const SCOPE_ITEMS = [
  { label: "Scope", value: "Act 1 vertical slice — Vegas Underground setting" },
  { label: "Agents", value: "Jason, Audrey, and Josh — autonomous trust/fear agents" },
  { label: "Mechanics", value: "Voice-driven interaction, Trust Meter, dread escalation" },
  { label: "Endings", value: "Game Over and Good Ending paths based on trust outcomes" },
  { label: "Submission", value: "Gemini Live Agent Challenge 2026 — live interactive demo" },
  { label: "Access", value: "Gated prototype — approved requests receive play link within 24 hours" },
] as const;

export function LiminalSinSliceScope() {
  return (
    <SectionReveal className="ls-section-py">
      <div className="ls-gutter studio-section">
        <h2 className="text-2xl font-semibold text-studio-text mb-3">
          Vertical Slice Scope
        </h2>
        <p className="text-studio-text-muted max-w-2xl mb-8 leading-relaxed">
          This build is a focused technology demonstration — not the full game.
          It proves real-time multi-agent narrative, trust systems, and
          generative media orchestration under live player input.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCOPE_ITEMS.map((item) => (
            <StudioCard key={item.label} className="p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-studio-accent">
                {item.label}
              </p>
              <p className="mt-2 text-sm text-studio-text-muted leading-relaxed">
                {item.value}
              </p>
            </StudioCard>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
