import type { Metadata } from "next";
import Link from "next/link";
import {
  LiquidGlassPage,
  LiquidGlassSurface,
} from "@/app/components/motion/LiquidGlassSurface";
import { RoadmapContent } from "@/app/components/studio/sections/RoadmapSection";

export const metadata: Metadata = {
  title: "Roadmap | Mycelia Interactive LLC",
  description:
    "Current status across completed, active, and scheduled work at Mycelia Interactive.",
  alternates: { canonical: "/roadmap" },
  openGraph: {
    title: "Roadmap | Mycelia Interactive LLC",
    description:
      "Current status across completed, active, and scheduled work at Mycelia Interactive.",
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
