"use client";

import { ROADMAP_MILESTONES } from "@/app/components/studio/data";

export function RoadmapContent() {
  return (
    <div className="space-y-6">
      <div>
        <p data-lg-kicker className="liquid-glass-kicker text-studio-accent mb-3">
          Near-term
        </p>
        <h1 className="liquid-glass-title font-semibold text-studio-text normal-case tracking-normal">
          MVP Roadmap
        </h1>
        <p className="mt-3 liquid-glass-body text-studio-text-muted leading-relaxed">
          Near-term milestones for our real-time agent and generative media
          stack.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ROADMAP_MILESTONES.map((milestone) => (
          <div
            key={milestone.title}
            className="rounded-xl border border-black/8 bg-white/30 p-4"
          >
            <p
              data-lg-kicker
              className="liquid-glass-kicker text-studio-accent"
            >
              {milestone.timeframe}
            </p>
            <h3 className="mt-2 text-base font-semibold text-studio-text lg:text-lg">
              {milestone.title}
            </h3>
            <p className="mt-2 text-sm text-studio-text-muted leading-relaxed lg:text-base">
              {milestone.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
