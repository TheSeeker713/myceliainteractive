import type { Metadata } from "next";
import Link from "next/link";
import { RoadmapContent } from "@/app/components/studio/sections/RoadmapSection";

export const metadata: Metadata = {
  title: "MVP Roadmap | Mycelia Interactive LLC",
  description:
    "Near-term milestones for Mycelia Interactive's real-time AI agent and generative media stack, plus the targeted cloud resources that would accelerate them.",
  alternates: { canonical: "/roadmap" },
  openGraph: {
    title: "MVP Roadmap | Mycelia Interactive LLC",
    description:
      "Near-term milestones and cloud resource needs for Mycelia Interactive's real-time agent and generative media stack.",
    url: "https://www.myceliainteractive.com/roadmap",
  },
};

export default function RoadmapPage() {
  return (
    <div className="site-gutter py-12 sm:py-16 min-h-[80vh]">
      <div className="studio-section max-w-3xl mx-auto">
        <div className="mb-8 flex items-center justify-end">
          <Link
            href="/"
            className="text-sm text-studio-text-muted hover:text-studio-accent transition-colors"
          >
            ← Home
          </Link>
        </div>
        <RoadmapContent />
      </div>
    </div>
  );
}
