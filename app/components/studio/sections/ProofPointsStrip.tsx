"use client";

import { FoldCard } from "@/app/components/motion/FoldCard";
import { PROOF_POINTS } from "@/app/components/studio/data";

export function ProofPointsContent() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {PROOF_POINTS.map((point, index) => (
        <FoldCard key={point.label} index={index} total={PROOF_POINTS.length} className="p-5">
          <p className="text-sm font-semibold text-studio-text">{point.label}</p>
          <p className="mt-1 text-xs text-studio-text-muted">{point.detail}</p>
        </FoldCard>
      ))}
    </div>
  );
}
