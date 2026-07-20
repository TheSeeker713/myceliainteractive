"use client";

import Image from "next/image";
import { SceneCard } from "@/app/components/studio/SceneCard";

export function AboutContent() {
  return (
    <SceneCard className="space-y-4 text-studio-text-muted">
      <p
        data-lg-kicker
        className="liquid-glass-kicker text-studio-accent"
      >
        Company
      </p>
      {/* ≤767: omit aspect-video — copy-first About pane */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-black/8 max-md:hidden">
        <Image
          src="/assets/images/About_Network.webp"
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 896px"
        />
      </div>
      <h2 className="liquid-glass-title font-semibold text-studio-text normal-case tracking-normal">
        About
      </h2>
      <p className="liquid-glass-body max-md:hidden">
        Mycelia Interactive LLC is an entertainment company developing
        original intellectual property across film, interactive experiences,
        games, and music. Our defining focus is real-time AI-driven response
        systems that use voice and vision: entertainment where audience
        behavior shapes the experience as it unfolds.
      </p>
      <p className="liquid-glass-body">
        Every project we build is original — our own characters, our own worlds,
        no licensed IP or fan adaptations.
      </p>
    </SceneCard>
  );
}
