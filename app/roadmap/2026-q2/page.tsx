import type { Metadata } from "next";
import RoadmapLayout, {
  RoadmapCard,
  SectionDivider,
  LiminalSinCallout,
  FundingCallout,
} from "../_components/RoadmapLayout";

export const metadata: Metadata = {
  title: "Q2 2026 — Foundation | Mycelia Interactive Roadmap",
  description:
    "Establishing the brand, launching first products, and building the platform for everything that follows.",
};

export default function RoadmapQ2Page() {
  return (
    <RoadmapLayout showBack>
      {/* PAGE HERO */}
      <div className="rm-page-hero">
        <p className="rm-page-date">April 1, 2026</p>
        <h1 className="rm-page-title">
          <span className="rm-page-title-accent">Q2 2026</span>
          {" "}— Foundation
        </h1>
        <p className="rm-page-theme">
          Establishing the brand, launching first products, and building the platform
          for everything that follows.
        </p>
      </div>

      {/* CONTENT */}
      <div className="rm-content">

        {/* ALREADY DONE */}
        <SectionDivider status="done" />
        <div className="rm-card-grid">
          <RoadmapCard
            status="done"
            icon="🌐"
            title="digiartifact.com — Designed & Built"
            description="Mycelia Interactive's primary portfolio and showcase site designed and built. Cinematic retro-futuristic aesthetic. WebGL Tetrahedron Puzzle embed planned."
            tags={["digiartifact.com", "Portfolio", "Design"]}
          />
          <RoadmapCard
            status="done"
            icon="🏢"
            title="Mycelia Interactive — Brand Presence Established"
            description="Official company formation, online presence, and brand identity live across all primary channels."
            tags={["Branding", "Company"]}
          />
          <RoadmapCard
            status="done"
            icon="🎮"
            title="LIMINAL SIN — Test Prototype Completed"
            description="An interactive FMV psychological horror prototype with a real-time AI trust system, submitted to the Devpost Gemini Live Agent Challenge. The AI can see and hear the player and responds in real time. No gore. No monsters. The horror is entirely psychological. See LIMINAL SIN callout below."
            tags={["Liminal Sin", "FMV", "AI", "Prototype", "Psychological Horror"]}
          />
          <RoadmapCard
            status="done"
            icon="📡"
            title="thes33k3r.com — ARG/FMV Prototype Live"
            description="The S33k3r Transmission: a working 8-minute AI music video and ARG puzzle game prototype live at thes33k3r.com. The foundation of THE S33K3R FILES universe."
            tags={["S33K3R", "ARG", "FMV", "thes33k3r.com"]}
          />
        </div>

        {/* ACTIVE */}
        <SectionDivider status="wip" label="Active" />
        <div className="rm-card-grid">
          <RoadmapCard
            status="wip"
            icon="🤝"
            title="Seeking Strategic Partners & Funding"
            description="Mycelia Interactive begins actively seeking strategic partners and investors. See funding callout below."
            tags={["Funding", "Partners"]}
          />
        </div>

      </div>

      {/* CALLOUTS */}
      <div className="rm-callout-section" style={{ paddingBottom: "3rem" }}>
        <LiminalSinCallout />
        <FundingCallout />
      </div>
    </RoadmapLayout>
  );
}
