import type { Metadata } from "next";
import { LiminalSinLanding } from "@/app/ls/LiminalSinLanding";

export const metadata: Metadata = {
  title: "Liminal Sin | Mycelia Interactive LLC",
  description:
    "A psychological interactive experience with real-time AI narrative and voice-driven interaction. Request gated access to the vertical slice prototype.",
  alternates: {
    canonical: "/ls",
  },
  openGraph: {
    title: "Liminal Sin | Mycelia Interactive LLC",
    description:
      "Real-time AI-driven narrative where voice and behavior reshape the story. Gemini Live Agent Challenge 2026.",
    url: "https://www.myceliainteractive.com/ls",
  },
};

export default function LiminalSinPage() {
  return <LiminalSinLanding />;
}
