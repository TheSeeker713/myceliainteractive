import type { Metadata } from "next";
import { PlayPageClient } from "./PlayPageClient";

export const metadata: Metadata = {
  title: "Private Play | Liminal Sin",
  description:
    "Token-gated private play entry for the Liminal Sin prototype.",
  alternates: {
    canonical: "/ls/play",
  },
};

export default function PlayPage() {
  return <PlayPageClient />;
}
