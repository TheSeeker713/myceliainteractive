"use client";

import { SectionReveal } from "@/app/components/motion/SectionReveal";
import { StudioCard } from "@/app/components/motion/StudioCard";

export function AboutSection() {
  return (
    <SectionReveal className="studio-section pb-16">
      <h2 className="text-2xl font-semibold mb-4">About</h2>
      <StudioCard className="p-6 sm:p-8 space-y-4 text-studio-text-muted max-w-3xl">
        <p>
          Mycelia Interactive LLC is an entertainment company developing
          original intellectual property across film, interactive experiences,
          games, and music. Our defining focus is real-time AI-driven response
          systems that use voice and vision — entertainment where audience
          behavior shapes the experience as it unfolds.
        </p>
        <p>
          All intellectual property developed under the Mycelia Interactive name
          is owned in full by the company. We do not develop licensed or adapted
          third-party properties.
        </p>
      </StudioCard>
    </SectionReveal>
  );
}
