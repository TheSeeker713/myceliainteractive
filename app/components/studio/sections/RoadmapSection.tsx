"use client";

import { ROADMAP_MILESTONES } from "@/app/components/studio/data";

export function RoadmapContent() {
  return (
    <div className="space-y-6">
      <div>
        <p data-lg-kicker className="liquid-glass-kicker text-studio-accent mb-3">
          Status
        </p>
        <h1 className="liquid-glass-title font-semibold text-studio-text normal-case tracking-normal">
          Roadmap
        </h1>
        <p className="mt-3 liquid-glass-body text-studio-text-muted leading-relaxed">
          Current status across completed, active, and scheduled work.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ROADMAP_MILESTONES.map((milestone) => (
          <div
            key={milestone.title}
            className="rounded-xl border border-[color:var(--theme-inset-border)] bg-[color:var(--theme-inset-bg)] p-4"
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
            {"href" in milestone && milestone.href ? (
              <a
                href={milestone.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-medium text-studio-accent hover:underline"
              >
                Visit Studio 25 Films →
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
