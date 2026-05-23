import type { Metadata } from "next";
import RoadmapLayout, {
  RoadmapCard,
  SectionDivider,
  LiminalSinCallout,
  FundingCallout,
} from "../_components/RoadmapLayout";
import FeedbackForm from "../_components/FeedbackForm";

export const metadata: Metadata = {
  title: "Q3 2026 — Build & Ship KAIA | Mycelia Interactive Roadmap",
  description:
    "KAIA is the most important product milestone in Mycelia Interactive history. Q3 is fully dedicated to building, shipping, and establishing it in the market.",
};

export default function RoadmapQ3Page() {
  return (
    <RoadmapLayout showBack>
      {/* PAGE HERO */}
      <div className="rm-page-hero">
        <p className="rm-page-date">May 23, 2026</p>
        <h1 className="rm-page-title">
          <span className="rm-page-title-accent">Q3 2026</span>
          {" "}— Build &amp; Ship KAIA
        </h1>
        <p className="rm-page-theme">
          KAIA is the most important product milestone in Mycelia Interactive history.
          Q3 is fully dedicated to building, shipping, and establishing it in the market.
        </p>
      </div>

      {/* CONTENT */}
      <div className="rm-content">

        {/* BEING WORKED ON */}
        <SectionDivider status="wip" />
        <div className="rm-card-grid">
          <RoadmapCard
            status="wip"
            icon="🚀"
            title="KAIA — Built From the Ground Up (July - September)"
            description={`KAIA ("Keep At It, Always") is Mycelia Interactive's flagship productivity platform engineered specifically for neurodivergent users. Full rebuild from scratch. Stack: Next.js, Cloudflare Pages, D1 database, PWA. This is the most important product in Mycelia Interactive history.`}
            tags={["KAIA", "Next.js", "Cloudflare", "PWA", "Neurodivergent"]}
          />
        </div>

        {/* PLANNED */}
        <SectionDivider status="planned" />
        <div className="rm-card-grid">
          <RoadmapCard
            status="planned"
            icon="📦"
            title="KAIA — Public Deployment"
            description="KAIA deploys publicly. All core features available free. AI-powered features available via paid service tier."
            tags={["KAIA", "Launch", "Deploy"]}
          />
          <RoadmapCard
            status="planned"
            icon="💳"
            title="KAIA — Payment System Integration"
            description="Payment system integrated for the AI service tier. The core app is and will always be free. Users pay only for AI-powered features and services. Market research informs pricing strategy."
            tags={["KAIA", "Payments", "AI", "Monetization"]}
          />
          <RoadmapCard
            status="planned"
            icon="📊"
            title="KAIA — Market Research & Positioning"
            description="Research phase defining KAIA's target market, pricing tiers, and growth strategy within the neurodivergent productivity space."
            tags={["KAIA", "Research", "Market"]}
          />
          <RoadmapCard
            status="planned"
            icon="🎬"
            title="Adventures of Lint — Director's Cut / Remaster (August 2026)"
            description="The Adventures of Lint short film receives a full remaster and Director's Cut. First version considered the definitive release. Episode 2 planning begins in parallel."
            tags={["Adventures of Lint", "Film", "Remaster"]}
          />
        </div>

        {/* ACTIVE */}
        <SectionDivider status="wip" label="Active" />
        <div className="rm-card-grid">
          <RoadmapCard
            status="wip"
            icon="🤝"
            title="Seeking Strategic Partners & Funding"
            description="Active outreach to strategic partners and investors. Contact jeremy@myceliainteractive.com to request investor materials."
            tags={["Funding", "Partners"]}
          />
        </div>

      </div>

      {/* CALLOUTS */}
      <div className="rm-callout-section" style={{ paddingBottom: "0" }}>
        <LiminalSinCallout />
        <FundingCallout />
      </div>

      {/* FEEDBACK FORM */}
      <FeedbackForm />
    </RoadmapLayout>
  );
}
