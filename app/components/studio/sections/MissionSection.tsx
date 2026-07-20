"use client";

import Image from "next/image";
import Link from "next/link";
import { SceneCard } from "@/app/components/studio/SceneCard";

export function MissionContent() {
  return (
    <SceneCard className="text-studio-text-muted leading-relaxed space-y-4">
      <p
        data-lg-kicker
        className="liquid-glass-kicker text-studio-accent"
      >
        Direction
      </p>
      {/* ≤767: omit aspect-video — title + short para + Vision link */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-black/8 max-md:hidden">
        <Image
          src="/assets/images/Roadmap_Network.webp"
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 896px"
        />
      </div>
      <h2 className="liquid-glass-title font-semibold text-studio-text normal-case tracking-normal mb-0">
        Mission
      </h2>
      <p className="liquid-glass-body">
        Our work is defined by one design principle: the audience participates.
        We build real-time AI systems where voice, vision, and behavior reshape
        narrative as it unfolds, starting with immersive interactive
        entertainment as our proving ground.{" "}
        <Link
          href="/vision"
          className="text-studio-accent hover:underline font-medium"
        >
          Explore our 10-year north star horizon →
        </Link>
      </p>
    </SceneCard>
  );
}
