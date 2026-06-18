"use client";

import { PROOF_POINTS } from "@/app/components/studio/data";
import { SceneCard } from "@/app/components/studio/SceneCard";

export function ProofPointsContent() {
  return (
    <SceneCard>
      <h2 className="text-2xl font-semibold text-studio-text mb-6">
        Highlights
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PROOF_POINTS.map((point) => (
          <div
            key={point.label}
            className="rounded-xl border border-black/8 bg-white/30 p-4"
          >
            <p className="text-sm font-semibold text-studio-text">
              {point.label}
            </p>
            <p className="mt-1 text-xs text-studio-text-muted">{point.detail}</p>
          </div>
        ))}
      </div>
    </SceneCard>
  );
}
