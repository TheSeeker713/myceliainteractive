import RoadmapLayout, {
  RoadmapCard,
  SectionDivider,
  LiminalSinCallout,
  FundingCallout,
} from "../_components/RoadmapLayout";
import FeedbackForm from "../_components/FeedbackForm";

export default function RoadmapDetailPage() {
  return (
    <RoadmapLayout showBack>
      {/* PAGE HERO */}
      <div className="rm-page-hero">
        <p className="rm-page-date">March 6, 2026</p>
        <h1 className="rm-page-title">
          <span className="rm-page-title-accent">Q1 2026</span>
          {" "}— Roadmap v1
        </h1>
        <p className="rm-page-theme">
          A living document tracking everything we&apos;ve built, what&apos;s in motion,
          what&apos;s coming, and what&apos;s still just a dream in the dark.
        </p>
      </div>

      {/* DISCLAIMER BANNER */}
      <div className="rm-callout-note">
        <div className="rm-callout-note-inner">
          <strong>⚠ This roadmap is a living document.</strong>{" "}Features listed under{" "}
          <strong>Planned</strong> and <strong>Not Confirmed</strong> are subject to change,
          reprioritization, or cancellation. Nothing here is a promise — it&apos;s a window
          into our thinking. Community ideas submitted via the form below are automatically
          placed in <em>Not Confirmed</em> for review.
        </div>
      </div>

      {/* STATUS LEGEND */}
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem 1.5rem", display: "flex", flexWrap: "wrap", gap: "0.625rem", alignItems: "center" }}>
        <span className="rm-badge rm-badge-done"><span className="rm-badge-dot" />Already Done</span>
        <span className="rm-badge rm-badge-wip"><span className="rm-badge-dot" />Being Worked On</span>
        <span className="rm-badge rm-badge-planned"><span className="rm-badge-dot" />Planned</span>
        <span className="rm-badge rm-badge-gray"><span className="rm-badge-dot" />Not Confirmed</span>
      </div>

      {/* CONTENT */}
      <div className="rm-content">

        {/* ALREADY DONE */}
        <SectionDivider status="done" />
        <div className="rm-card-grid">
          <RoadmapCard
            status="done"
            icon="🏠"
            title="Homepage Redesign"
            description="Full UI overhaul targeting contest judges. Two-column animated card layout linking to Mycelia Interactive and Liminal Sin sub-pages."
            tags={["UI", "Design", "Homepage"]}
          />
          <RoadmapCard
            status="done"
            icon="📋"
            title="Signup Forms + D1 Backend"
            description={<>Judge and Beta Tester signup forms live on <code>/ls</code>. Cloudflare D1 stores all signups. <code>POST /api/signup</code> validates input, writes to D1, and triggers the welcome email.</>}
            tags={["Cloudflare D1", "Backend", "Signup"]}
          />
          <RoadmapCard
            status="done"
            icon="📧"
            title="Email Dispatch System"
            description={<>Two-email flow via Brevo. Email 1 fires instantly on signup. Email 2 (&quot;The Underground Is Open&quot;) dispatches to all users within 60 seconds of admin flipping the game-live flag via a protected API endpoint.</>}
            tags={["Brevo", "Email", "Backend"]}
          />
          <RoadmapCard
            status="done"
            icon="🔐"
            title="Judge Backdoor Page"
            description={<>Atmospheric access gate at <code>/ls/judges</code> — &quot;SIGNAL AUTHORIZED&quot; page with neon-flicker CTA. Links to the judge game session wrapper at <code>/ls/judges/game</code>.</>}
            tags={["Judges", "Auth", "UX"]}
          />
          <RoadmapCard
            status="done"
            icon="🖼️"
            title="FPV Image Carousel (CF AI)"
            description={<>Background image carousel on <code>/ls</code> powered by Cloudflare Workers AI (Flux 1 Schnell). Generates cinematic POV Smart Glasses shots of the Vegas Underground — 12-seed cap, 24h edge cache, crossfade transitions.</>}
            tags={["Cloudflare AI", "Flux", "FPV", "Images"]}
          />
          <RoadmapCard
            status="done"
            icon="🗺️"
            title="This Roadmap Page"
            description={<>Versioned roadmap index and detail document live at <code>/roadmap</code>. Reflects actual project state and is updated each session.</>}
            tags={["Roadmap", "Documentation"]}
          />
          <RoadmapCard
            status="done"
            icon="🔗"
            title="Sticky Header & Footer"
            description="Enlarged sticky header with backdrop blur, nav links to Liminal Sin and LSR demo, and a persistent footer on all pages."
            tags={["UI", "Navigation"]}
          />
          <RoadmapCard
            status="done"
            icon="🎬"
            title="Liminal Sin Landing Page"
            description={<>Cinematic FMV horror pitch page at <code>/ls</code> with parallax banner, dark aesthetic, and signup section scaffolding.</>}
            tags={["Liminal Sin", "Landing Page", "FMV"]}
          />
          <RoadmapCard
            status="done"
            icon="📂"
            title="Static HTML Migration"
            description={<>LSR demo and privacy pages copied to <code>public/ls/</code> and served as static assets at <code>/ls/lsr.html</code>.</>}
            tags={["Static Assets", "Migration"]}
          />
          <RoadmapCard
            status="done"
            icon="🧭"
            title="Home Button on All Subpages"
            description={<>Mycelia Interactive banner logo in the global header is wrapped in a <code>Link href=&quot;/&quot;</code> so users can return home from any subpage.</>}
            tags={["Navigation", "UX"]}
          />
          <RoadmapCard
            status="done"
            icon="📄"
            title="Mycelia Placeholder Page"
            description={<>Stub page at <code>/mycelia</code> built and deployed. Displays &quot;System Initialization Pending&quot; in the project aesthetic.</>}
            tags={["Placeholder", "Deploy"]}
          />
          <RoadmapCard
            status="done"
            icon="📜"
            title="AGENTS.md Established"
            description="Project AI ruleset created, cleaned, and committed to both the Liminal Sin Gemini and Mycelia Interactive repositories with full safety permissions and execution protocol."
            tags={["AGENTS.md", "Process", "Documentation"]}
          />
        </div>

        {/* BEING WORKED ON */}
        <SectionDivider status="wip" />
        <div className="rm-card-grid">
          <RoadmapCard
            status="wip"
            icon="🎮"
            title="Game UI Shell"
            description={<>Browser client at <code>/ls/game</code> and <code>/ls/judges/game</code>. Shell pages, WebSocket context, HUD overlay, and mic/webcam capture hooks are in place. Next step: wire to the live Google Cloud Run WebSocket endpoint.</>}
            tags={["WebSocket", "Game UI", "Liminal Sin"]}
          />
          <RoadmapCard
            status="wip"
            icon="🤖"
            title="Gemini Live Integration"
            description={<>Full-duplex WebSocket pipeline between the browser client and the Google Cloud Run backend. WebSocket event contract defined in <code>TEAM_CONTRACT.md</code>. Frontend shell is ready; backend pipeline is actively in development in <code>liminal-sin-gemini</code>.</>}
            tags={["Gemini AI", "WebSocket", "Cloud Run"]}
          />
        </div>

        {/* PLANNED */}
        <SectionDivider status="planned" />
        <div className="rm-card-grid">
          <RoadmapCard
            status="planned"
            icon="🔊"
            title="TTS Ambient Voiceover"
            description={<>Creepy atmospheric audio clips for the <code>/ls</code> landing page generated via Cloudflare Workers AI (<code>@cf/deepgram/aura-2-en</code>). Dynamic, procedurally generated — no manual voice recordings required.</>}
            tags={["Cloudflare AI", "TTS", "Audio"]}
          />
          <RoadmapCard
            status="planned"
            icon="🎁"
            title="User Reward System"
            description="A system to reward early adopters, testers, and active community members. Early access, exclusive in-game content, and recognition tiers are under consideration."
            tags={["Rewards", "Community"]}
          />
          <RoadmapCard
            status="planned"
            icon="💬"
            title="Feedback API Endpoint"
            description={<>Backend at <code>/api/feedback</code> to receive user-submitted bugs, ideas, and issues from the form below. Submissions route to the studio inbox and are reviewed for roadmap inclusion.</>}
            tags={["API", "Feedback", "Backend"]}
          />
        </div>

        {/* NOT CONFIRMED */}
        <SectionDivider status="gray" />
        <div className="rm-card-grid">
          <RoadmapCard
            status="gray"
            icon="🏆"
            title="Leaderboard / Trust Rankings"
            description="A public or semi-public leaderboard tracking community engagement, tester contributions, or in-game Trust actions. Format and scope TBD."
            tags={["Leaderboard", "Community"]}
          />
          <RoadmapCard
            status="gray"
            icon="📱"
            title="Mobile-First Game Interface"
            description="A native-feeling mobile wrapper or PWA for the Liminal Sin experience. Depends on gameplay direction confirmed post-testing."
            tags={["Mobile", "PWA", "Liminal Sin"]}
          />
          <RoadmapCard
            status="gray"
            icon="🌐"
            title="Community Hub / Forum"
            description="A dedicated space for players, testers, and fans to discuss theories, share screenshots, and interact. Could be Discord, a custom forum, or embedded chat."
            tags={["Community", "Forum"]}
          />
          <RoadmapCard
            status="gray"
            icon="🗺️"
            title="This Roadmap Feature"
            description="The roadmap page itself — including this user feedback form — is an early-stage idea being actively prototyped. Its final scope and integration into the main site are not yet confirmed."
            tags={["Roadmap", "Meta"]}
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
