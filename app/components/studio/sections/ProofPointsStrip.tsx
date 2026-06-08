"use client";

import { SectionReveal } from "@/app/components/motion/SectionReveal";
import { StudioCard } from "@/app/components/motion/StudioCard";
import { PROOF_POINTS } from "@/app/components/studio/data";

export function ProofPointsStrip() {
  return (
    <SectionReveal className="studio-section pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PROOF_POINTS.map((point) => (
          <StudioCard key={point.label} className="p-5">
            <p className="text-sm font-semibold text-studio-text">{point.label}</p>
            <p className="mt-1 text-xs text-studio-text-muted">{point.detail}</p>
          </StudioCard>
        ))}
      </div>
    </SectionReveal>
  );
}
