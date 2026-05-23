import type { Metadata } from "next";
import RoadmapLayout, {
  RoadmapCard,
  SectionDivider,
  LiminalSinCallout,
  FundingCallout,
} from "../_components/RoadmapLayout";

export const metadata: Metadata = {
  title: "2027 — Scale & Produce | Mycelia Interactive Roadmap",
  description:
    "Mycelia Interactive enters full production across multiple IP simultaneously. Every product is designed to be interactive and immersive with live AI agents as characters.",
};

export default function Roadmap2027Page() {
  return (
    <RoadmapLayout showBack>
      {/* PAGE HERO */}
      <div className="rm-page-hero">
        <p className="rm-page-date">May 23, 2026</p>
        <h1 className="rm-page-title">
          <span className="rm-page-title-accent">2027</span>
          {" "}— Scale &amp; Produce
        </h1>
        <p className="rm-page-theme">
          Mycelia Interactive enters full production across multiple IP simultaneously.
          Every product is designed to be interactive and immersive with live AI agents as characters.
        </p>
      </div>

      {/* FOUNDATION NOTE */}
      <div className="rm-callout-note">
        <div className="rm-callout-note-inner">
          Every Mycelia Interactive product is engineered to be interactive and immersive — with live AI agents
          as characters. This is not a feature. This is the foundation of everything we build.
        </div>
      </div>

      {/* CONTENT */}
      <div className="rm-content">

        {/* PLANNED */}
        <SectionDivider status="planned" />
        <div className="rm-card-grid">
          <RoadmapCard
            status="planned"
            icon="⚡"
            title="KAIA — Platform Maturity & AI Expansion"
            description="KAIA matures into a fully established productivity platform. AI service tier grows. New AI-powered features ship based on user feedback and market demand."
            tags={["KAIA", "AI", "Platform", "Growth"]}
          />
          <RoadmapCard
            status="planned"
            icon="📡"
            title="The S33k3r Transmission — Expanded Universe"
            description="THE S33K3R FILES universe expands. New transmissions, new ARG layers, new interactive narrative experiences."
            tags={["S33K3R", "ARG", "Expanded Universe"]}
          />
          <RoadmapCard
            status="planned"
            icon="🕵️"
            title="R2DD — Continued Development"
            description="R2DD enters full production phase. Episodic FMV and Unity 3D pipeline active. Live AI agents integrated as characters within the game world."
            tags={["R2DD", "Unity", "FMV", "AI Characters"]}
          />
          <RoadmapCard
            status="planned"
            icon="🎬"
            title="Adventures of Lint — Full Season Production Lineup"
            description="Adventures of Lint moves into full season production. Interactive and immersive format with live AI agent characters. The franchise vision begins to take shape."
            tags={["Adventures of Lint", "Animation", "Franchise", "AI Characters"]}
          />
          <RoadmapCard
            status="planned"
            icon="🌐"
            title="digiartifact.com — Fully Built Out"
            description="digiartifact.com evolves into the full flagship showcase for Mycelia Interactive. All IP, tools, and creative work represented."
            tags={["digiartifact.com", "Portfolio", "Showcase"]}
          />
        </div>

        {/* ACTIVE */}
        <SectionDivider status="wip" label="Active" />
        <div className="rm-card-grid">
          <RoadmapCard
            status="wip"
            icon="🤝"
            title="Seeking Strategic Partners & Funding"
            description="Outreach expanding as the company scales. Multiple IP in active production signals serious franchise ambition. Contact jeremy@myceliainteractive.com to request investor materials."
            tags={["Funding", "Partners", "Investment"]}
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
