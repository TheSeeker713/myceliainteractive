import type { Metadata } from "next";
import RoadmapLayout from "./_components/RoadmapLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mycelia Interactive — Roadmap Index",
  description: "A versioned archive of all published Mycelia Interactive planning documents — past decisions, current priorities, and the shape of things to come.",
};

const ENTRIES = [
  {
    slug: "2026-q2",
    date: "April 1, 2026",
    title: "Q2 2026 — Foundation",
    description:
      "Establishing the brand, launching first products, and building the platform for everything that follows. Includes LIMINAL SIN prototype, thes33k3r.com ARG launch, and brand presence.",
    tags: ["digiartifact.com", "Liminal Sin", "S33K3R", "Branding"],
  },
  {
    slug: "2026-03-03",
    date: "March 6, 2026",
    title: "Q1 2026 — Roadmap v1",
    description:
      "Signup pipeline, Cloudflare D1 backend, email dispatch, FPV image carousel, game UI shell, judge backdoor, Gemini Live voice integration, NPC trust system, FMV scene warping, contest judge & tester onboarding.",
    tags: ["Liminal Sin", "Backend", "Gemini AI", "FMV"],
  },
  {
    slug: "2026-q3",
    date: "May 23, 2026",
    title: "Q3 2026 — Build & Ship KAIA",
    description:
      "KAIA is the most important product milestone in Mycelia Interactive history. Q3 is fully dedicated to building, shipping, and establishing it in the market.",
    tags: ["KAIA", "Next.js", "Cloudflare", "PWA", "Neurodivergent"],
  },
  {
    slug: "2026-q4",
    date: "May 23, 2026",
    title: "Q4 2026 — Expand the Universe",
    description:
      "With KAIA live, the creative engine turns toward expanding Mycelia Interactive's entertainment universe. R2DD, The S33k3r Transmission 2, Not My Quest pre-production.",
    tags: ["S33K3R", "R2DD", "KAIA", "Not My Quest"],
  },
  {
    slug: "2027",
    date: "May 23, 2026",
    title: "2027 — Scale & Produce",
    description:
      "Mycelia Interactive enters full production across multiple IP simultaneously. Every product is interactive and immersive with live AI agents as characters.",
    tags: ["KAIA", "R2DD", "Adventures of Lint", "AI Characters"],
  },
  {
    slug: "2028-2032",
    date: "May 23, 2026",
    title: "2028-2032 — Legacy Technology & Franchise",
    description:
      "The long game. LNC and Chronaea cannot exist without technology that does not yet exist at consumer scale. We are building toward it. The north star is 2032.",
    tags: ["LNC", "Chronaea", "Holographic", "VR/AR", "Franchise"],
  },
];

export default function RoadmapIndexPage() {
  return (
    <RoadmapLayout>
      <style>{`
        .rmi-hero {
          padding: 3.5rem 1.5rem 2.5rem;
          max-width: 72rem;
          margin: 0 auto;
          border-bottom: 1px solid var(--rm-border);
          margin-bottom: 2rem;
        }
        .rmi-eyebrow {
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #7e22ce;
          font-family: 'Rajdhani', sans-serif;
          margin-bottom: 0.75rem;
        }
        .rmi-title {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(2.25rem, 5vw, 3.75rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          color: var(--rm-text);
          margin-bottom: 1rem;
          line-height: 1.1;
        }
        .rmi-subtitle {
          font-size: 1.0625rem;
          color: var(--rm-text-muted);
          max-width: 40rem;
          line-height: 1.7;
        }

        .rmi-entries {
          max-width: 72rem;
          margin: 0 auto;
          padding: 0 1.5rem 5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .rmi-entry {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: var(--rm-bg-card);
          border: 1px solid var(--rm-border);
          border-radius: 1rem;
          padding: 1.5rem 1.75rem;
          box-shadow: var(--rm-shadow);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          text-decoration: none;
        }
        @media (min-width: 640px) {
          .rmi-entry {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .rmi-entry:hover {
          transform: translateY(-3px);
          box-shadow: var(--rm-shadow-hover);
          border-color: #7e22ce50;
        }
        .rmi-entry-date {
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--rm-text-sub);
          font-family: 'Rajdhani', sans-serif;
          margin-bottom: 0.375rem;
        }
        .rmi-entry-title {
          font-family: 'Orbitron', sans-serif;
          font-weight: 800;
          font-size: 1.0625rem;
          color: var(--rm-text);
          margin-bottom: 0.5rem;
        }
        .rmi-entry-desc {
          font-size: 0.9rem;
          color: var(--rm-text-muted);
          line-height: 1.65;
          max-width: 36rem;
        }
        .rmi-entry-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.625rem 1.25rem;
          border-radius: 0.5rem;
          background: linear-gradient(135deg, #7e22ce, #06b6d4);
          color: #ffffff;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
          transition: opacity 0.2s, box-shadow 0.2s;
        }
        .rmi-entry-cta:hover {
          opacity: 0.88;
          box-shadow: 0 0 20px rgba(126,34,206,0.4);
        }
        .rmi-active-dot {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #16a34a;
          font-family: 'Rajdhani', sans-serif;
          background: #dcfce7;
          border: 1px solid #86efac;
          padding: 0.1875rem 0.5rem;
          border-radius: 9999px;
          margin-bottom: 0.5rem;
          width: fit-content;
        }
        [data-theme="dark"] .rmi-active-dot {
          background: #14532d40;
          color: #86efac;
          border-color: #16a34a50;
        }
        .rmi-ping {
          width: 0.4375rem;
          height: 0.4375rem;
          border-radius: 9999px;
          background: #16a34a;
          animation: rmi-ping 1.5s ease-in-out infinite;
        }
        @keyframes rmi-ping {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.3); }
        }

        .rmi-legend {
          max-width: 72rem;
          margin: 0 auto;
          padding: 0 1.5rem 1.75rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.625rem;
        }
        .rmi-legend-label {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--rm-text-sub);
          font-family: 'Rajdhani', sans-serif;
        }
      `}</style>

      <div className="rmi-hero">
        <p className="rmi-eyebrow">Mycelia Interactive</p>
        <h1 className="rmi-title">Product Roadmap</h1>
        <p className="rmi-subtitle">
          A versioned archive of all published planning documents — past decisions,
          current priorities, and the shape of things to come.
        </p>
      </div>

      <div className="rmi-legend">
        <span className="rmi-legend-label">Status:</span>
        <span className="rm-badge rm-badge-done"><span className="rm-badge-dot" />Already Done</span>
        <span className="rm-badge rm-badge-wip"><span className="rm-badge-dot" />Being Worked On</span>
        <span className="rm-badge rm-badge-planned"><span className="rm-badge-dot" />Planned</span>
        <span className="rm-badge rm-badge-gray"><span className="rm-badge-dot" />Not Confirmed</span>
        <span className="rm-badge rm-badge-purple"><span className="rm-badge-dot" />Funding Dependent</span>
      </div>

      <main className="rmi-entries">
        {ENTRIES.map((entry) => (
          <article key={entry.slug} className="rmi-entry">
            <div style={{ flex: 1 }}>
              <p className="rmi-entry-date">{entry.date}</p>
              <div className="rmi-active-dot">
                <span className="rmi-ping" />
                Active
              </div>
              <h2 className="rmi-entry-title">{entry.title}</h2>
              <p className="rmi-entry-desc">{entry.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginTop: "0.875rem" }}>
                {entry.tags.map((t) => (
                  <span key={t} className="rm-tag">{t}</span>
                ))}
              </div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Link href={`/roadmap/${entry.slug}`} className="rmi-entry-cta">
                View Document
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </main>
    </RoadmapLayout>
  );
}
