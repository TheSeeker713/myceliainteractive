import type { Metadata } from "next";
import FPVCarousel from "@/app/components/FPVCarousel";
import { SectionBridge } from "@/app/components/motion/SectionBridge";
import { LiminalSinAccessFooter } from "@/app/ls/LiminalSinAccessFooter";
import { LiminalSinArchitecture } from "@/app/ls/LiminalSinArchitecture";
import { LiminalSinExperienceTeaser } from "@/app/ls/LiminalSinExperienceTeaser";
import { LiminalSinHero } from "@/app/ls/LiminalSinHero";
import { LiminalSinSliceScope } from "@/app/ls/LiminalSinSliceScope";
import { LiminalSinStorySections } from "@/app/ls/LiminalSinStorySections";

export const metadata: Metadata = {
  title: "Liminal Sin | Mycelia Interactive LLC",
  description:
    "A psychological interactive experience with real-time AI trust and response. Request gated access to the vertical slice prototype.",
  openGraph: {
    title: "Liminal Sin | Mycelia Interactive LLC",
    description:
      "Real-time AI-driven narrative where voice, trust, and behavior reshape the story. Gemini Live Agent Challenge 2026.",
    url: "https://myceliainteractive.com/ls",
  },
};

export default function LiminalSinLanding() {
  return (
    <div className="min-h-screen">
      <LiminalSinHero />
      <SectionBridge variant={0} />
      <LiminalSinExperienceTeaser />
      <SectionBridge variant={1} />
      <FPVCarousel />
      <SectionBridge variant={2} />
      <LiminalSinStorySections />
      <SectionBridge variant={0} />
      <LiminalSinArchitecture />
      <SectionBridge variant={1} />
      <LiminalSinSliceScope />
      <LiminalSinAccessFooter />
    </div>
  );
}
