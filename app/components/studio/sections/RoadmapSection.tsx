"use client";

import { ROADMAP_MILESTONES } from "@/app/components/studio/data";
import { SceneCard } from "@/app/components/studio/SceneCard";

export function RoadmapContent() {
  return (
    <SceneCard>
      <h1 className="text-2xl font-semibold text-studio-text mb-3">
        MVP Roadmap
      </h1>
      <p className="text-studio-text-muted mb-6 leading-relaxed">
        Near-term milestones for our real-time agent and generative media stack.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ROADMAP_MILESTONES.map((milestone) => (
          <div
            key={milestone.title}
            className="rounded-xl border border-black/8 bg-white/30 p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-studio-accent">
              {milestone.timeframe}
            </p>
            <h3 className="mt-2 text-base font-semibold text-studio-text">
              {milestone.title}
            </h3>
            <p className="mt-2 text-sm text-studio-text-muted leading-relaxed">
              {milestone.detail}
            </p>
          </div>
        ))}
      </div>
    </SceneCard>
  );
}
