"use client";

import Link from "next/link";
import {
  LiquidGlassPage,
  LiquidGlassSurface,
} from "@/app/components/motion/LiquidGlassSurface";
import { Button } from "@/app/components/studio/Button";

const HORIZON_PHASES = [
  {
    year: "Years 1–2",
    title: "Foundation",
    detail:
      "Scale real-time agent systems, generative media pipelines, and public interactive experiences.",
  },
  {
    year: "Years 3–5",
    title: "Platform",
    detail:
      "Expand agentic SaaS products (KAIA) and multi-experience narrative infrastructure.",
  },
  {
    year: "Years 6–10",
    title: "Presence",
    detail:
      "Ambient, portable interfaces that extend participatory narrative beyond traditional screens.",
  },
] as const;

export function VisionPage() {
  return (
    <LiquidGlassPage className="pb-8">
      <LiquidGlassSurface variant="cover" trackPointer>
        <p data-lg-kicker className="liquid-glass-kicker text-studio-accent mb-4">
          Long-term direction
        </p>
        <h1 className="font-semibold tracking-tight text-studio-text max-w-3xl">
          10-Year North Star Horizon
        </h1>
        <p className="mt-6 liquid-glass-body text-studio-text-muted max-w-2xl leading-relaxed">
          An aspirational view of where Mycelia Interactive could grow, grounded
          in the real-time AI systems we are building today.
        </p>
      </LiquidGlassSurface>

      <LiquidGlassSurface variant="cover">
        <p data-lg-kicker className="liquid-glass-kicker text-studio-accent mb-2">
          Important
        </p>
        <p className="liquid-glass-body text-studio-text-muted leading-relaxed">
          This page describes an aspirational, proposed future direction. It is{" "}
          <strong className="text-studio-text">not</strong> part of the near-term
          MVP or 24-month roadmap. For current milestones, see the{" "}
          <Link href="/roadmap" className="text-studio-accent hover:underline">
            MVP Roadmap
          </Link>
          .
        </p>
      </LiquidGlassSurface>

      <LiquidGlassSurface variant="cover">
        <h2 className="font-semibold text-studio-text mb-4">
          Today&apos;s Foundation
        </h2>
        <div className="space-y-4 liquid-glass-body text-studio-text-muted">
          <p>
            Mycelia Interactive is building live AI interactive narrative and
            agentic systems, where audience voice, vision, and behavior reshape
            story in real time. Liminal Sin demonstrates multi-agent trust
            architecture; KAIA extends the same foundation toward productivity
            SaaS.
          </p>
          <p>
            Entertainment is where we put those systems to work: low-latency
            inference, generative media orchestration, and human-centered agent
            design in live, participatory experiences.
          </p>
        </div>
      </LiquidGlassSurface>

      <LiquidGlassSurface variant="cover">
        <h2 className="font-semibold text-studio-text mb-4">The Horizon</h2>
        <p className="liquid-glass-body text-studio-text-muted max-w-3xl leading-relaxed mb-8">
          Over a ten-year horizon, we see participatory presence extending beyond
          screens: ambient, portable interfaces that keep audiences connected to
          narrative and collaborative intelligence in education, research, and
          creative work. Entertainment remains the proving ground; the north star
          is human-centered, always-on agentic companionship in physical space.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {HORIZON_PHASES.map((phase) => (
            <div
              key={phase.year}
              className="rounded-xl border border-black/8 bg-white/30 p-6"
            >
              <p
                data-lg-kicker
                className="liquid-glass-kicker text-studio-accent"
              >
                {phase.year}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-studio-text">
                {phase.title}
              </h3>
              <p className="mt-2 text-sm text-studio-text-muted leading-relaxed lg:text-base">
                {phase.detail}
              </p>
            </div>
          ))}
        </div>
      </LiquidGlassSurface>

      <LiquidGlassSurface variant="cover">
        <h2 className="font-semibold text-studio-text mb-4">Connect</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button href="/roadmap" variant="secondary">
            View MVP Roadmap
          </Button>
          <Button href="mailto:contact@myceliainteractive.com">
            Contact Us
          </Button>
        </div>
      </LiquidGlassSurface>
    </LiquidGlassPage>
  );
}
