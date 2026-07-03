import type { Metadata } from "next";
import Link from "next/link";
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
        <TeamContent />
      </div>
    </div>
  );
}
