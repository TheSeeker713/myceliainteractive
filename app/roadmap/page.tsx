import type { Metadata } from "next";
import Link from "next/link";
import {
  LiquidGlassPage,
  LiquidGlassSurface,
} from "@/app/components/motion/LiquidGlassSurface";
import { RoadmapContent } from "@/app/components/studio/sections/RoadmapSection";

export const metadata: Metadata = {
  title: "MVP Roadmap | Mycelia Interactive LLC",
  description:
    "Near-term milestones for Mycelia Interactive's real-time AI agent and generative media stack.",
  alternates: { canonical: "/roadmap" },
  openGraph: {
    title: "MVP Roadmap | Mycelia Interactive LLC",
    description:
      "Near-term milestones for Mycelia Interactive's real-time agent and generative media stack.",
    url: "https://www.myceliainteractive.com/roadmap",
  },
};

export default function RoadmapPage() {
  return (
    <LiquidGlassPage>
      <LiquidGlassSurface variant="fill" trackPointer>
        <div className="mb-6 flex items-center justify-end">
          <Link
            href="/"
            className="text-sm text-studio-text-muted hover:text-studio-accent transition-colors min-h-11 inline-flex items-center"
          >
            ← Home
          </Link>
        </div>
        <RoadmapContent />
      </LiquidGlassSurface>
    </LiquidGlassPage>
  );
}
