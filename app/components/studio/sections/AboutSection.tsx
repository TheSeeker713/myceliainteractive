"use client";

import { SceneCard } from "@/app/components/studio/SceneCard";

export function AboutContent() {
  return (
    <SceneCard className="space-y-4 text-studio-text-muted">
      <h2 className="text-2xl font-semibold text-studio-text">About</h2>
      <p>
        Mycelia Interactive LLC is an entertainment company developing
        original intellectual property across film, interactive experiences,
        games, and music. Our defining focus is real-time AI-driven response
        systems that use voice and vision: entertainment where audience
        behavior shapes the experience as it unfolds.
      </p>
      <p>
        All intellectual property developed under the Mycelia Interactive name
        is owned in full by the company. We do not develop licensed or adapted
        third-party properties.
      </p>
    </SceneCard>
  );
}
