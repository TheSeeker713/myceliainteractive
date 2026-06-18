"use client";

import {
  CLOUD_CREDIT_NEEDS,
  ROADMAP_MILESTONES,
} from "@/app/components/studio/data";
import { Button } from "@/app/components/studio/Button";
import { SceneCard } from "@/app/components/studio/SceneCard";

export function RoadmapContent() {
  return (
    <SceneCard>
      <h2 className="text-2xl font-semibold text-studio-text mb-3">
        MVP Roadmap &amp; AI/Cloud Resource Needs
      </h2>
      <p className="text-studio-text-muted mb-6 leading-relaxed">
        Near-term milestones and what targeted cloud credits would enable for
        our real-time agent and generative media stack.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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

      <div className="rounded-xl border border-black/8 bg-white/30 p-4">
        <h3 className="text-base font-semibold text-studio-text">
          Cloud Credits Enable
        </h3>
        <ul className="mt-4 space-y-2">
          {CLOUD_CREDIT_NEEDS.map((need) => (
            <li
              key={need}
              className="text-sm text-studio-text-muted leading-relaxed flex gap-2"
            >
              <span className="text-studio-accent shrink-0">—</span>
              <span>{need}</span>
            </li>
          ))}
        </ul>
        <a
          href="mailto:contact@myceliainteractive.com?subject=AI%20%26%20Cloud%20Credits%20Collaboration"
          className="mt-5 inline-block w-full sm:w-auto"
        >
          <Button className="w-full sm:w-auto">
            Inquire About AI &amp; Cloud Credits Collaboration
          </Button>
        </a>
      </div>
    </SceneCard>
  );
}
