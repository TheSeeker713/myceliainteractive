"use client";

import Link from "next/link";
import { SceneCard } from "@/app/components/studio/SceneCard";

export function MissionContent() {
  return (
    <SceneCard className="text-studio-text-muted leading-relaxed">
      <h2 className="text-2xl font-semibold text-studio-text mb-4">Mission</h2>
      <p>
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
