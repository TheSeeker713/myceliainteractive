import type { Metadata } from "next";
import { VisionPage } from "./VisionPage";

export const metadata: Metadata = {
  title: "10-Year Vision | Mycelia Interactive LLC",
  description:
    "Mycelia Interactive's aspirational 10-year north star horizon — building on today's real-time AI interactive narrative and agentic systems work.",
  openGraph: {
    title: "10-Year Vision | Mycelia Interactive LLC",
    description:
      "Aspirational long-term direction for participatory presence and agentic systems — not part of the near-term MVP.",
    url: "https://myceliainteractive.com/vision",
  },
};

export default function VisionRoute() {
  return <VisionPage />;
}
