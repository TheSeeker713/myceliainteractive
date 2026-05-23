import type { Metadata } from "next";
import RoadmapLayout, {
  RoadmapCard,
  SectionDivider,
  LiminalSinCallout,
  FundingCallout,
} from "../_components/RoadmapLayout";

export const metadata: Metadata = {
  title: "Q4 2026 — Expand the Universe | Mycelia Interactive Roadmap",
  description:
    "With KAIA live, Mycelia Interactive turns its creative engine toward expanding its entertainment universe.",
};

export default function RoadmapQ4Page() {
  return (
    <RoadmapLayout showBack>
      {/* PAGE HERO */}
      <div className="rm-page-hero">
        <p className="rm-page-date">May 23, 2026</p>
        <h1 className="rm-page-title">
          <span className="rm-page-title-accent">Q4 2026</span>
          {" "}— Expand the Universe
        </h1>
        <p className="rm-page-theme">
          With KAIA live, Mycelia Interactive turns its creative engine toward expanding
          its entertainment universe.
        </p>
      </div>

      {/* CONTENT */}
      <div className="rm-content">

        {/* PLANNED */}
        <SectionDivider status="planned" />
        <div className="rm-card-grid">
          <RoadmapCard
            status="planned"
            icon="📡"
            title="The S33k3r Transmission 2"
            description="The next chapter of THE S33K3R FILES. Expanding the ARG universe, new FMV content, and deeper interactive narrative layers built on the foundation of thes33k3r.com."
            tags={["S33K3R", "ARG", "FMV", "Interactive"]}
          />
          <RoadmapCard
            status="planned"
            icon="🕵️"
            title="R2DD — Road to Disclosure Day (Active Development)"
            description="Active development begins on R2DD, filed as Case File R2DD under THE S33K3R FILES. A narrative fiction game set in STRAND ECHO — a mirror world where real-world UAP disclosure events are fictionalized. Player character Jason Orwell, investigative journalist. FMV integrated into Unity 3D environments via diegetic screens. Camera systems are the core mechanic. Episodic release structure with non-linear narrative."
            tags={["R2DD", "S33K3R Files", "Unity", "FMV", "Game Dev"]}
          />
          <RoadmapCard
            status="planned"
            icon="📈"
            title="KAIA — Growth & Monetization Phase"
            description="Following launch, Q4 shifts focus to user acquisition, community building, and sustainable growth of the AI service tier. Neurodivergent community is the beating heart of KAIA."
            tags={["KAIA", "Growth", "Community"]}
          />
          <RoadmapCard
            status="planned"
            icon="🗂️"
            title="Not My Quest — Pre-Production Begins"
            description="Pre-production story work begins on Not My Quest. Protagonist design and narrative development precede any Unity prototyping. Full GDD already complete."
            tags={["Not My Quest", "Game Dev", "Narrative", "Pre-Production"]}
          />
        </div>

        {/* ACTIVE */}
        <SectionDivider status="wip" label="Active" />
        <div className="rm-card-grid">
          <RoadmapCard
            status="wip"
            icon="🤝"
            title="Seeking Strategic Partners & Funding"
            description="Active and expanding outreach. Contact jeremy@myceliainteractive.com to request investor materials."
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
