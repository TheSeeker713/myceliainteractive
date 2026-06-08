"use client";

import { FoldCard } from "@/app/components/motion/FoldCard";
import {
  CLOUD_CREDIT_NEEDS,
  ROADMAP_MILESTONES,
} from "@/app/components/studio/data";
import { Button } from "@/app/components/studio/Button";

const ROADMAP_CARD_COUNT = ROADMAP_MILESTONES.length + 1;

export function RoadmapContent() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-3">
        MVP Roadmap &amp; AI/Cloud Resource Needs
      </h2>
      <p className="text-studio-text-muted max-w-2xl mb-8 leading-relaxed">
        Near-term milestones and what targeted cloud credits would enable for
        our real-time agent and generative media stack.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {ROADMAP_MILESTONES.map((milestone, index) => (
            <FoldCard key={milestone.title} index={index} total={ROADMAP_CARD_COUNT} className="p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-studio-accent">
                {milestone.timeframe}
              </p>
              <h3 className="mt-2 text-base font-semibold text-studio-text">
                {milestone.title}
              </h3>
              <p className="mt-2 text-sm text-studio-text-muted leading-relaxed">
                {milestone.detail}
              </p>
            </FoldCard>
          ))}
        </div>

        <FoldCard
          index={ROADMAP_MILESTONES.length}
          total={ROADMAP_CARD_COUNT}
          className="p-6 flex flex-col"
        >
          <h3 className="text-base font-semibold text-studio-text">
            Cloud Credits Enable
          </h3>
          <ul className="mt-4 space-y-3 flex-1">
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
            className="mt-6"
          >
            <Button className="w-full">
              Inquire About AI &amp; Cloud Credits Collaboration
            </Button>
          </a>
        </FoldCard>
      </div>
    </>
  );
}
