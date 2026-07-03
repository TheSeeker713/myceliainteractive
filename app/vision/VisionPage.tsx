"use client";

import Link from "next/link";
import { FoldCard } from "@/app/components/motion/FoldCard";
import { ScrollFoldScene } from "@/app/components/motion/ScrollFoldScene";
import { usePrefersReducedMotion } from "@/app/components/motion/usePrefersReducedMotion";
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

function VisionHeroContent() {
  return (
    <>
      <p className="text-sm font-medium tracking-wide text-studio-accent uppercase mb-4">
        Long-term direction
      </p>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-studio-text max-w-3xl">
        10-Year North Star Horizon
      </h1>
      <p className="mt-6 text-lg text-studio-text-muted max-w-2xl leading-relaxed">
        An aspirational view of where Mycelia Interactive could grow, grounded
        in the real-time AI systems we are building today.
      </p>
    </>
  );
}

function VisionDisclaimerContent() {
  return (
    <FoldCard index={0} total={1} className="p-6 sm:p-8 border-studio-accent/20 bg-studio-accent-light/30">
      <p className="text-sm font-semibold uppercase tracking-wide text-studio-accent mb-2">
        Important
      </p>
      <p className="text-studio-text-muted leading-relaxed">
        This page describes an aspirational, proposed future direction. It is{" "}
        <strong className="text-studio-text">not</strong> part of the near-term
        MVP or 24-month roadmap. For current milestones, see the{" "}
        <Link href="/roadmap" className="text-studio-accent hover:underline">
          MVP Roadmap
        </Link>
        .
      </p>
    </FoldCard>
  );
}

function VisionFoundationContent() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Today&apos;s Foundation</h2>
      <FoldCard index={0} total={1} className="p-6 sm:p-8 space-y-4 text-studio-text-muted max-w-3xl">
        <p>
          Mycelia Interactive is building live AI interactive narrative and
          agentic systems, where audience voice, vision, and behavior reshape
          story in real time. Liminal Sin demonstrates multi-agent trust
          architecture; KAIA extends the same foundation toward productivity
          SaaS.
        </p>
        <p>
          Entertainment is our proving ground: a rigorous testbed for
          low-latency inference, generative media orchestration, and
          human-centered agent design before those systems scale to broader
          applications.
        </p>
      </FoldCard>
    </>
  );
}

function VisionHorizonContent() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">The Horizon</h2>
      <p className="text-studio-text-muted max-w-3xl leading-relaxed mb-8">
        Over a ten-year horizon, we see participatory presence extending beyond
        screens: ambient, portable interfaces that keep audiences connected to
        narrative and collaborative intelligence in education, research, and
        creative work. Entertainment remains the proving ground; the north star
        is human-centered, always-on agentic companionship in physical space.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {HORIZON_PHASES.map((phase, index) => (
          <FoldCard key={phase.year} index={index} total={HORIZON_PHASES.length} className="p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-studio-accent">
              {phase.year}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-studio-text">
              {phase.title}
            </h3>
            <p className="mt-2 text-sm text-studio-text-muted leading-relaxed">
              {phase.detail}
            </p>
          </FoldCard>
        ))}
      </div>
    </>
  );
}

function VisionConnectContent() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Connect</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/roadmap">
          <Button variant="secondary">View MVP Roadmap</Button>
        </Link>
        <a href="mailto:contact@myceliainteractive.com">
          <Button>Contact Us</Button>
        </a>
      </div>
    </>
  );
}

function VisionPageStatic() {
  return (
    <div className="site-gutter pb-20 space-y-16 sm:space-y-20">
      <section className="studio-section pt-16 sm:pt-24">
        <VisionHeroContent />
      </section>
      <section className="studio-section">
        <VisionDisclaimerContent />
      </section>
      <section className="studio-section">
        <VisionFoundationContent />
      </section>
      <section className="studio-section">
        <VisionHorizonContent />
      </section>
      <section className="studio-section">
        <VisionConnectContent />
      </section>
    </div>
  );
}

export function VisionPage() {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <VisionPageStatic />;
  }

  return (
    <div className="pb-20">
      <ScrollFoldScene
        outgoing={<VisionHeroContent />}
        incoming={<VisionDisclaimerContent />}
        layout="cards"
      />
      <ScrollFoldScene
        outgoing={<VisionDisclaimerContent />}
        incoming={<VisionFoundationContent />}
        layout="cards"
      />
      <ScrollFoldScene
        outgoing={<VisionFoundationContent />}
        incoming={<VisionHorizonContent />}
        layout="cards"
      />
      <ScrollFoldScene
        outgoing={<VisionHorizonContent />}
        incoming={<VisionConnectContent />}
        layout="plain"
      />
    </div>
  );
}
