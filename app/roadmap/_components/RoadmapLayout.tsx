"use client";

import { useState, useCallback, createContext, useContext } from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Theme context — shared between layout and any child that needs the value
// ---------------------------------------------------------------------------
interface ThemeCtx {
  theme: "light" | "dark";
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx>({ theme: "light", toggle: () => {} });
export const useRoadmapTheme = () => useContext(ThemeContext);

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------
interface RoadmapLayoutProps {
  children: React.ReactNode;
  /** Set to "/roadmap" label to show the back-to-index breadcrumb */
  showBack?: boolean;
}

export default function RoadmapLayout({ children, showBack = false }: RoadmapLayoutProps) {
  // Lazy initializer reads localStorage on client; returns null during SSR.
  // Returning null from render prevents theme flash before hydration.
  const [theme, setTheme] = useState<"light" | "dark" | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem("rm-theme");
    return stored === "dark" ? "dark" : "light";
  });

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      window.localStorage.setItem("rm-theme", next);
      return next;
    });
  }, []);

  if (!theme) return null;

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <style>{`
        /* ── CSS variable theme tokens ────────────────────────────────── */
        .rm-shell[data-theme="light"] {
          --rm-bg:         #f8fafc;
          --rm-bg-card:    #ffffff;
          --rm-bg-card2:   #f1f5f9;
          --rm-border:     #e2e8f0;
          --rm-text:       #0f172a;
          --rm-text-muted: #64748b;
          --rm-text-sub:   #94a3b8;
          --rm-header-bg:  rgba(255,255,255,0.92);
          --rm-footer-bg:  rgba(248,250,252,0.95);
          --rm-shadow:     0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06);
          --rm-shadow-hover: 0 8px 32px rgba(0,0,0,0.12);
        }
        .rm-shell[data-theme="dark"] {
          --rm-bg:         #05020f;
          --rm-bg-card:    #160a3a;
          --rm-bg-card2:   #1e1040;
          --rm-border:     #2a1060;
          --rm-text:       #e2e8f0;
          --rm-text-muted: #94a3b8;
          --rm-text-sub:   #64748b;
          --rm-header-bg:  rgba(5,2,15,0.92);
          --rm-footer-bg:  rgba(5,2,15,0.95);
          --rm-shadow:     0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3);
          --rm-shadow-hover: 0 8px 32px rgba(34,211,238,0.15);
        }

        /* ── Base ─────────────────────────────────────────────────────── */
        .rm-shell {
          min-height: 100vh;
          background: var(--rm-bg);
          color: var(--rm-text);
          font-family: 'Inter', 'Geist', system-ui, sans-serif;
          transition: background 0.3s ease, color 0.3s ease;
        }
        .rm-shell ::-webkit-scrollbar { width: 6px; }
        .rm-shell ::-webkit-scrollbar-track { background: var(--rm-bg); }
        .rm-shell ::-webkit-scrollbar-thumb { background: #7e22ce; border-radius: 3px; }

        /* ── Typography ───────────────────────────────────────────────── */
        .rm-shell h1, .rm-shell h2, .rm-shell h3 {
          font-family: 'Orbitron', 'Geist', system-ui, sans-serif;
        }
        .rm-shell p, .rm-shell li, .rm-shell span {
          font-size: 1rem;
          line-height: 1.7;
        }

        /* ── Header ───────────────────────────────────────────────────── */
        .rm-header {
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
          background: var(--rm-header-bg);
          border-bottom: 1px solid var(--rm-border);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .rm-header-inner {
          max-width: 72rem;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 4rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .rm-wordmark {
          font-family: 'Orbitron', sans-serif;
          font-weight: 800;
          font-size: 1rem;
          color: var(--rm-text);
          text-decoration: none;
          letter-spacing: 0.04em;
          white-space: nowrap;
          transition: color 0.2s;
        }
        .rm-wordmark:hover { color: #7e22ce; }
        .rm-nav {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .rm-nav-link {
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--rm-text-muted);
          text-decoration: none;
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .rm-nav-link:hover {
          color: var(--rm-text);
          background: var(--rm-bg-card2);
        }
        .rm-theme-btn {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.5rem;
          border: 1px solid var(--rm-border);
          background: var(--rm-bg-card);
          color: var(--rm-text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          flex-shrink: 0;
        }
        .rm-theme-btn:hover {
          background: var(--rm-bg-card2);
          color: var(--rm-text);
          border-color: #7e22ce;
        }

        /* ── Back breadcrumb ─────────────────────────────────────────── */
        .rm-back {
          max-width: 72rem;
          margin: 0 auto;
          padding: 0.75rem 1.5rem 0;
        }
        .rm-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--rm-text-muted);
          text-decoration: none;
          font-family: 'Rajdhani', 'Inter', sans-serif;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .rm-back-link:hover { color: #7e22ce; }

        /* ── Footer ───────────────────────────────────────────────────── */
        .rm-footer {
          width: 100%;
          background: var(--rm-footer-bg);
          border-top: 1px solid var(--rm-border);
          backdrop-filter: blur(16px);
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .rm-footer-inner {
          max-width: 72rem;
          margin: 0 auto;
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          font-size: 0.8125rem;
          color: var(--rm-text-sub);
        }
        .rm-footer-links {
          display: flex;
          gap: 1.25rem;
        }
        .rm-footer-link {
          color: var(--rm-text-sub);
          text-decoration: none;
          transition: color 0.2s;
        }
        .rm-footer-link:hover { color: #7e22ce; }

        /* ── Cards ────────────────────────────────────────────────────── */
        .rm-card {
          background: var(--rm-bg-card);
          border: 1px solid var(--rm-border);
          border-radius: 0.875rem;
          padding: 1.25rem 1.375rem;
          box-shadow: var(--rm-shadow);
          transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
        }
        .rm-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--rm-shadow-hover);
        }
        .rm-card-done:hover   { border-color: #16a34a80; }
        .rm-card-wip:hover    { border-color: #2563eb80; }
        .rm-card-planned:hover{ border-color: #d9770680; }
        .rm-card-gray:hover   { border-color: #6b728080; }
        .rm-card-purple:hover { border-color: #7c3aed80; }

        /* ── Status badges ────────────────────────────────────────────── */
        .rm-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.25rem 0.625rem;
          border-radius: 9999px;
          font-family: 'Rajdhani', 'Inter', sans-serif;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .rm-badge-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 9999px;
          flex-shrink: 0;
        }
        .rm-badge-done   { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
        .rm-badge-wip    { background: #dbeafe; color: #1d4ed8; border: 1px solid #93c5fd; }
        .rm-badge-planned{ background: #fef3c7; color: #b45309; border: 1px solid #fcd34d; }
        .rm-badge-gray   { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
        .rm-badge-purple { background: #f3e8ff; color: #6d28d9; border: 1px solid #c4b5fd; }

        [data-theme="dark"] .rm-badge-done   { background: #14532d40; color: #86efac; border-color: #16a34a50; }
        [data-theme="dark"] .rm-badge-wip    { background: #1e3a5f40; color: #93c5fd; border-color: #2563eb50; }
        [data-theme="dark"] .rm-badge-planned{ background: #44200040; color: #fcd34d; border-color: #d9770650; }
        [data-theme="dark"] .rm-badge-gray   { background: #1e293b50; color: #94a3b8; border-color: #47556950; }
        [data-theme="dark"] .rm-badge-purple { background: #3b0764-40; color: #c4b5fd; border-color: #7c3aed50; }
        [data-theme="dark"] .rm-badge-purple { background: rgba(59,7,100,0.3); color: #c4b5fd; border-color: #7c3aed50; }

        /* ── Section dividers ─────────────────────────────────────────── */
        .rm-section-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          margin-top: 3rem;
        }
        .rm-section-header:first-child { margin-top: 0; }
        .rm-section-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .rm-section-line {
          flex: 1;
          height: 1px;
          background: var(--rm-border);
        }

        /* ── Quarter/Year hero heading ────────────────────────────────── */
        .rm-page-hero {
          padding: 3rem 1.5rem 2rem;
          max-width: 72rem;
          margin: 0 auto;
        }
        .rm-page-date {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--rm-text-sub);
          font-family: 'Rajdhani', sans-serif;
          margin-bottom: 0.5rem;
        }
        .rm-page-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--rm-text);
          margin-bottom: 1rem;
        }
        .rm-page-theme {
          font-size: 1.0625rem;
          color: var(--rm-text-muted);
          max-width: 42rem;
          line-height: 1.7;
        }
        .rm-page-title-accent {
          background: linear-gradient(135deg, #7e22ce, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Callout: Note/Announcement ───────────────────────────────── */
        .rm-callout-note {
          max-width: 72rem;
          margin: 0 auto;
          padding: 0 1.5rem 1.5rem;
        }
        .rm-callout-note-inner {
          border-radius: 0.75rem;
          border-left: 4px solid #7e22ce;
          background: var(--rm-bg-card2);
          padding: 1.25rem 1.5rem;
          font-size: 1rem;
          line-height: 1.7;
          color: var(--rm-text-muted);
        }

        /* ── Funding & Liminal Sin callout blocks ─────────────────────── */
        .rm-callout-section {
          max-width: 72rem;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .rm-liminal-block {
          border-radius: 1rem;
          background: #0d0520;
          border: 1px solid #3b0764;
          padding: 2.5rem 2rem;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .rm-liminal-title {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: 1.875rem;
          letter-spacing: 0.15em;
          color: #e9d5ff;
          margin-bottom: 0.875rem;
        }
        .rm-liminal-body {
          font-size: 1rem;
          line-height: 1.75;
          color: #a78bfa;
          max-width: 36rem;
          margin: 0 auto 1.5rem;
        }
        .rm-liminal-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.75rem 1.75rem;
          border-radius: 0.5rem;
          background: linear-gradient(135deg, #7e22ce, #06b6d4);
          color: #ffffff;
          text-decoration: none;
          transition: opacity 0.2s, box-shadow 0.2s;
        }
        .rm-liminal-cta:hover {
          opacity: 0.9;
          box-shadow: 0 0 24px rgba(139,44,245,0.4);
        }

        .rm-funding-block {
          border-radius: 1rem;
          background: var(--rm-bg-card2);
          border: 1px solid var(--rm-border);
          padding: 2.5rem 2rem;
          text-align: center;
          margin-bottom: 3rem;
        }
        .rm-funding-title {
          font-family: 'Orbitron', sans-serif;
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: 0.06em;
          color: var(--rm-text);
          margin-bottom: 0.875rem;
        }
        .rm-funding-body {
          font-size: 1rem;
          line-height: 1.75;
          color: var(--rm-text-muted);
          max-width: 42rem;
          margin: 0 auto;
        }
        .rm-funding-link {
          color: #7e22ce;
          font-weight: 600;
          text-decoration: none;
        }
        .rm-funding-link:hover { text-decoration: underline; }

        /* ── Tag pills ────────────────────────────────────────────────── */
        .rm-tag {
          display: inline-flex;
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.1875rem 0.5rem;
          border-radius: 0.25rem;
          background: var(--rm-bg-card2);
          border: 1px solid var(--rm-border);
          color: var(--rm-text-muted);
          font-family: 'Rajdhani', 'Inter', sans-serif;
        }

        /* ── Content wrapper ─────────────────────────────────────────── */
        .rm-content {
          max-width: 72rem;
          margin: 0 auto;
          padding: 0 1.5rem 4rem;
        }
        .rm-card-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .rm-card-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .rm-card-grid { grid-template-columns: repeat(3, 1fr); }
        }

        /* ── Mobile nav collapse ─────────────────────────────────────── */
        @media (max-width: 640px) {
          .rm-nav-link { display: none; }
          .rm-nav-link.rm-nav-home { display: flex; }
        }
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800;900&family=Inter:wght@300;400;500;600&family=Rajdhani:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="rm-shell" data-theme={theme}>
        {/* HEADER */}
        <header className="rm-header">
          <div className="rm-header-inner">
            <Link href="/" className="rm-wordmark" aria-label="Mycelia Interactive — Home">
              Mycelia Interactive
            </Link>

            <nav className="rm-nav" aria-label="Roadmap navigation">
              <Link href="/" className="rm-nav-link rm-nav-home">Home</Link>
              <Link href="/roadmap" className="rm-nav-link">Roadmap</Link>
              <Link href="/roadmap/2026-q3" className="rm-nav-link">Latest Roadmap</Link>

              <button
                onClick={toggle}
                className="rm-theme-btn"
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                title={isDark ? "Light mode" : "Dark mode"}
              >
                {isDark ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            </nav>
          </div>
        </header>

        {/* BACK BREADCRUMB (detail pages only) */}
        {showBack && (
          <div className="rm-back">
            <Link href="/roadmap" className="rm-back-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Roadmap Index
            </Link>
          </div>
        )}

        {/* PAGE CONTENT */}
        {children}

        {/* FOOTER */}
        <footer className="rm-footer">
          <div className="rm-footer-inner">
            <span>&copy; 2026 Mycelia Interactive. All rights reserved.</span>
            <div className="rm-footer-links">
              <Link href="/" className="rm-footer-link">Home</Link>
              <Link href="/ls/privacy" className="rm-footer-link">Privacy Policy</Link>
            </div>
          </div>
        </footer>
      </div>
    </ThemeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Reusable building blocks exported for use in page files
// ---------------------------------------------------------------------------

/** Color-coded status badge */
export function StatusBadge({ status }: { status: "done" | "wip" | "planned" | "gray" | "purple" }) {
  const map: Record<string, { cls: string; dot: string; label: string }> = {
    done:    { cls: "rm-badge rm-badge-done",    dot: "rm-badge-dot", label: "Already Done" },
    wip:     { cls: "rm-badge rm-badge-wip",     dot: "rm-badge-dot", label: "Being Worked On" },
    planned: { cls: "rm-badge rm-badge-planned", dot: "rm-badge-dot", label: "Planned" },
    gray:    { cls: "rm-badge rm-badge-gray",    dot: "rm-badge-dot", label: "Not Confirmed" },
    purple:  { cls: "rm-badge rm-badge-purple",  dot: "rm-badge-dot", label: "Funding Dependent" },
  };
  const m = map[status];
  return (
    <span className={m.cls}>
      <span className={m.dot} />
      {m.label}
    </span>
  );
}

/** Single roadmap item card */
interface RoadmapCardProps {
  icon: string;
  title: string;
  description: React.ReactNode;
  tags?: string[];
  status: "done" | "wip" | "planned" | "gray" | "purple";
  note?: string;
}

export function RoadmapCard({ icon, title, description, tags, status, note }: RoadmapCardProps) {
  const borderCls: Record<string, string> = {
    done:    "rm-card-done",
    wip:     "rm-card-wip",
    planned: "rm-card-planned",
    gray:    "rm-card-gray",
    purple:  "rm-card-purple",
  };
  return (
    <div className={`rm-card ${borderCls[status]}`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", gap: "0.5rem" }}>
        <span style={{ fontSize: "1.375rem", lineHeight: 1 }}>{icon}</span>
        <StatusBadge status={status} />
      </div>
      <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "var(--rm-text)", marginBottom: "0.5rem", lineHeight: 1.4 }}>{title}</h3>
      {note && (
        <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#d97706", marginBottom: "0.375rem", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>
          {note}
        </p>
      )}
      <p style={{ fontSize: "0.9375rem", color: "var(--rm-text-muted)", lineHeight: 1.65 }}>{description}</p>
      {tags && tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginTop: "0.875rem" }}>
          {tags.map((t) => (
            <span key={t} className="rm-tag">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Section divider with colored label */
export function SectionDivider({ status, label }: { status: "done" | "wip" | "planned" | "gray" | "purple"; label?: string }) {
  const colors: Record<string, string> = {
    done:    "#16a34a",
    wip:     "#2563eb",
    planned: "#d97706",
    gray:    "#6b7280",
    purple:  "#7c3aed",
  };
  const labels: Record<string, string> = {
    done:    "Already Done",
    wip:     "Being Worked On",
    planned: "Planned",
    gray:    "Not Confirmed",
    purple:  "Funding Dependent",
  };
  const color = colors[status];
  return (
    <div className="rm-section-header">
      <span className="rm-section-title" style={{ color }}>
        {label ?? labels[status]}
      </span>
      <div className="rm-section-line" style={{ background: `${color}40` }} />
    </div>
  );
}

/** LIMINAL SIN callout block */
export function LiminalSinCallout() {
  return (
    <div className="rm-liminal-block">
      <h2 className="rm-liminal-title">LIMINAL SIN</h2>
      <p className="rm-liminal-body">
        A psychological horror experience. LIMINAL SIN is a prototype — and we intend to make it a full episode.
        If you want to see it happen, reach out. Funding inquiries:{" "}
        <a href="mailto:jeremy@myceliainteractive.com" style={{ color: "#c4b5fd", fontWeight: 600 }}>
          jeremy@myceliainteractive.com
        </a>
      </p>
      <a
        href="https://devpost.com/software/liminal-sin"
        target="_blank"
        rel="noopener noreferrer"
        className="rm-liminal-cta"
      >
        View the Prototype
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
  );
}

/** Funding callout block */
export function FundingCallout() {
  return (
    <div className="rm-funding-block">
      <h2 className="rm-funding-title">Seeking Strategic Partners &amp; Funding</h2>
      <p className="rm-funding-body">
        Mycelia Interactive is actively seeking strategic partners and investors who believe in the future of
        interactive entertainment, AI-driven storytelling, and immersive technology. To request investor
        materials including market opportunity overview and growth targets, contact us at{" "}
        <a href="mailto:jeremy@myceliainteractive.com" className="rm-funding-link">
          jeremy@myceliainteractive.com
        </a>
      </p>
    </div>
  );
}
