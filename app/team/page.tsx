import type { Metadata } from "next";
import Link from "next/link";
import {
  LiquidGlassPage,
  LiquidGlassSurface,
} from "@/app/components/motion/LiquidGlassSurface";
import { TeamContent } from "@/app/components/studio/sections/TeamSection";

export const metadata: Metadata = {
  title: "Team | Mycelia Interactive LLC",
  description:
    "Meet the two-person founding team behind Mycelia Interactive LLC, building real-time AI-driven interactive entertainment from Albuquerque, New Mexico.",
  alternates: { canonical: "/team" },
  openGraph: {
    title: "Team | Mycelia Interactive LLC",
    description:
      "The two-person founding team building real-time AI-driven interactive entertainment from Albuquerque, New Mexico.",
    url: "https://www.myceliainteractive.com/team",
  },
};

export default function TeamPage() {
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
        <TeamContent />
      </LiquidGlassSurface>
    </LiquidGlassPage>
  );
}
