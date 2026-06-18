import type { Metadata } from "next";
import { LiminalSinLanding } from "@/app/ls/LiminalSinLanding";

export const metadata: Metadata = {
  title: "Liminal Sin | Mycelia Interactive LLC",
  description:
    "A psychological interactive experience with real-time AI trust and response. Request gated access to the vertical slice prototype.",
  openGraph: {
    title: "Liminal Sin | Mycelia Interactive LLC",
    description:
      "Real-time AI-driven narrative where voice, trust, and behavior reshape the story. Gemini Live Agent Challenge 2026.",
    url: "https://www.myceliainteractive.com/ls",
  },
};

export default function LiminalSinPage() {
  return <LiminalSinLanding />;
}
