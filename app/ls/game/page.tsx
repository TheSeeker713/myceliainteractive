import type { Metadata } from "next";
import { PrototypeAccessGate } from "./PrototypeAccessGate";

export const metadata: Metadata = {
  title: "Prototype Access | Liminal Sin",
  description:
    "The Liminal Sin prototype is closed to the public. Request invitation-only access to the vertical slice prototype.",
  alternates: {
    canonical: "/ls/game",
  },
};

export default function GamePage() {
  return <PrototypeAccessGate />;
}
