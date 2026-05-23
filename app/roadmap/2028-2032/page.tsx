import type { Metadata } from "next";
import RoadmapLayout, {
  RoadmapCard,
  SectionDivider,
  LiminalSinCallout,
  FundingCallout,
} from "../_components/RoadmapLayout";

export const metadata: Metadata = {
  title: "2028-2032 — Legacy Technology & Franchise | Mycelia Interactive Roadmap",
  description:
    "The long game. Mycelia Interactive's most ambitious IP cannot exist without technology that does not yet exist at consumer scale. We are building toward it.",
};

export default function Roadmap20282032Page() {
  return (
    <RoadmapLayout showBack>
      {/* PAGE HERO */}
      <div className="rm-page-hero">
        <p className="rm-page-date">May 23, 2026</p>
        <h1 className="rm-page-title">
          <span className="rm-page-title-accent">2028-2032</span>
          {" "}— Legacy Technology &amp; Franchise
        </h1>
        <p className="rm-page-theme">
          The long game. Mycelia Interactive&apos;s most ambitious IP cannot exist without
          technology that does not yet exist at consumer scale. We are building toward it.
        </p>
      </div>

      {/* FOUNDATION NOTE */}
      <div className="rm-callout-note">
        <div className="rm-callout-note-inner">
          The products in this roadmap are not bound by what currently exists. They are bound by what we are
          determined to build. LNC and Chronaea cannot ship until wearable full sensory holographic technology
          is real. We intend to be part of making it real.
        </div>
      </div>

      {/* CONTENT */}
      <div className="rm-content">

        {/* PLANNED */}
        <SectionDivider status="planned" />
        <div className="rm-card-grid">
          <RoadmapCard
            status="planned"
            icon="🎬"
            title="Adventures of Lint — Animated Interactive Franchise"
            description="Adventures of Lint becomes a full animated interactive franchise. Live AI agents as characters. Immersive, episodic, and audience-driven storytelling at scale."
            tags={["Adventures of Lint", "Franchise", "Animation", "AI Characters"]}
          />
          <RoadmapCard
            status="planned"
            icon="🕵️"
            title="R2DD — Full Episodic Series"
            description="R2DD ships as a complete episodic series. THE S33K3R FILES universe fully realized across interactive FMV and Unity 3D experiences."
            tags={["R2DD", "S33K3R", "Episodic", "FMV"]}
          />
          <RoadmapCard
            status="planned"
            icon="⚡"
            title="KAIA — Established AI Platform"
            description="KAIA is a mature, established productivity platform with a growing neurodivergent user community and expanded AI capabilities."
            tags={["KAIA", "AI", "Platform"]}
          />
          <RoadmapCard
            status="planned"
            icon="🥽"
            title="VR/AR Pipeline — Across All IP"
            description="VR and AR experience development across Mycelia Interactive's full IP portfolio. Quest and future headset platforms."
            tags={["VR", "AR", "Immersive", "IP"]}
          />
        </div>

        {/* NOT CONFIRMED — R&D */}
        <SectionDivider status="gray" label="Not Confirmed — R&D Required" />
        <div className="rm-card-grid">
          <RoadmapCard
            status="gray"
            icon="🔬"
            title="Wearable Full Sensory Holographic Tech — R&D"
            description="Research and development into wearable full sensory holographic technology. This is a hard prerequisite for LNC and Chronaea. Without it, neither product can exist as intended. Mycelia Interactive is committed to being part of bringing this technology to reality."
            tags={["Holographic", "R&D", "Hardware", "Future Tech"]}
          />
        </div>

        {/* NOT CONFIRMED — HOLOGRAPHIC TECH REQUIRED */}
        <SectionDivider status="gray" label="Not Confirmed — Holographic Tech Required" />
        <div className="rm-card-grid">
          <RoadmapCard
            status="gray"
            icon="🌌"
            title="The Living Nexus Chronicles — IP Development Begins"
            description="LNC is Mycelia Interactive's most ambitious original IP. Development cannot begin in earnest until wearable full sensory holographic technology exists. When it does, we will be ready."
            tags={["LNC", "Original IP", "Holographic", "Future"]}
          />
          <RoadmapCard
            status="gray"
            icon="🪐"
            title="Chronaea — Universe Development"
            description="Chronaea universe development begins in parallel with LNC. Requires the same holographic technology foundation."
            tags={["Chronaea", "Original IP", "Holographic", "Future"]}
          />
        </div>

        {/* NORTH STAR — 2032 */}
        <SectionDivider status="planned" label="Planned — 2032" />
        <div className="rm-card-grid">
          <RoadmapCard
            status="planned"
            icon="🚀"
            title="LNC + Chronaea — Public Beta"
            description="Target year for LNC and Chronaea public beta: 2032. This is the north star."
            tags={["LNC", "Chronaea", "Beta", "2032"]}
            note="Target Year: 2032"
          />
        </div>

        {/* ACTIVE + EXPANDING */}
        <SectionDivider status="wip" label="Active + Expanding" />
        <div className="rm-card-grid">
          <RoadmapCard
            status="wip"
            icon="🤝"
            title="Seeking Strategic Partners & Funding"
            description="At this scale, Mycelia Interactive is actively seeking major strategic partners, studio relationships, and institutional investment. The vision is large. The ambition is larger. Contact jeremy@myceliainteractive.com to request investor materials and market opportunity overview."
            tags={["Funding", "Partners", "Investment", "Studio"]}
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
