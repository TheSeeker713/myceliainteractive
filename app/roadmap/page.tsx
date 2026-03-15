import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Mycelia Interactive — Roadmap Index",
};

export default function RoadmapIndexPage() {
  return (
    <>
      <style>{`
        .rm-body {
          background-color: #05020f;
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          color: #e2e8f0;
        }
        .rm-body::before {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }
        .rm-body ::-webkit-scrollbar { width: 6px; }
        .rm-body ::-webkit-scrollbar-track { background: #05020f; }
        .rm-body ::-webkit-scrollbar-thumb { background: #7e22ce; border-radius: 3px; }
        .entry-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .entry-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0 40px rgba(34,211,238,0.2);
          border-color: rgba(34,211,238,0.5);
        }
        @keyframes rm-glow {
          0%   { text-shadow: 0 0 10px #d946ef, 0 0 20px #7e22ce; }
          100% { text-shadow: 0 0 20px #22d3ee, 0 0 40px #06b6d4; }
        }
        .animate-rm-glow { animation: rm-glow 3s ease-in-out infinite alternate; }
      `}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800;900&family=Inter:wght@300;400;500;600&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div className="rm-body relative overflow-x-hidden">
        {/* NAV */}
        <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#05020f]/90 border-b border-[#2a1060]">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-cyan-300 hover:text-white transition-colors duration-200"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              myceliainteractive.com
            </Link>
            <span className="text-xs text-[#2a1060] uppercase tracking-widest select-none" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              roadmap index
            </span>
          </div>
        </nav>

        {/* HERO */}
        <section className="relative pt-24 pb-16 px-6 text-center overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#7e22ce]/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#06b6d4]/8 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-4" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Mycelia Interactive
            </p>

            <h1
              className="font-black text-4xl md:text-6xl uppercase animate-rm-glow mb-6"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Product Roadmap
            </h1>

            <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              A versioned archive of all published planning documents — past decisions,
              current priorities, and the shape of things to come.
            </p>

            <div className="mt-10 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
          </div>
        </section>

        {/* LEGEND */}
        <section className="max-w-6xl mx-auto px-6 pb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-xs uppercase tracking-widest text-slate-500 mr-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Status key:</span>
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />Active
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              <span className="w-2 h-2 rounded-full bg-slate-500 inline-block" />Archived
            </span>
          </div>
        </section>

        {/* ENTRIES */}
        <main className="max-w-6xl mx-auto px-6 pb-32 space-y-5 relative z-10">
          {/* Entry: roadmap_2026-03-03 */}
          <article className="entry-card relative bg-[#160a3a]/70 border border-[#2a1060] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 backdrop-blur-sm">
            <span className="absolute top-4 right-4 md:hidden inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />Active
            </span>

            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>March 6, 2026</p>
              <h2 className="font-bold text-xl text-white mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Roadmap v1 — Q1 2026
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xl" style={{ fontFamily: "'Inter', sans-serif" }}>
                Signup pipeline, Cloudflare D1 backend, email dispatch, FPV image carousel, game UI shell, judge backdoor, Gemini Live voice integration, NPC trust system, FMV scene warping, contest judge &amp; tester onboarding.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs uppercase tracking-wide text-fuchsia-400 bg-purple-600/10 border border-purple-600/20 px-2.5 py-0.5 rounded-full" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Liminal Sin</span>
                <span className="text-xs uppercase tracking-wide text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Backend</span>
                <span className="text-xs uppercase tracking-wide text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Gemini AI</span>
                <span className="text-xs uppercase tracking-wide text-slate-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full" style={{ fontFamily: "'Rajdhani', sans-serif" }}>FMV</span>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
              <span className="hidden md:inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />Active
              </span>
              <Link
                href="/roadmap/2026-03-03"
                className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl bg-gradient-to-r from-[#7e22ce] to-[#06b6d4] text-white hover:from-[#a21caf] hover:to-[#22d3ee] hover:shadow-[0_0_24px_rgba(34,211,238,0.3)] transition-all duration-300"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                View Document
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </article>

          {/* Future placeholder */}
          <article className="relative border border-dashed border-[#2a1060]/60 rounded-2xl p-6 md:p-8 flex items-center gap-4 opacity-40 select-none" aria-hidden="true">
            <div className="w-10 h-10 rounded-full border border-dashed border-[#2a1060] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-600 mb-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Next entry</p>
              <p className="text-sm text-slate-600" style={{ fontFamily: "'Inter', sans-serif" }}>Future roadmap documents will appear here.</p>
            </div>
          </article>
        </main>

        {/* FOOTER */}
        <footer className="relative z-10 border-t border-[#2a1060]/60 py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600" style={{ fontFamily: "'Inter', sans-serif" }}>
            <span>&copy; {new Date().getFullYear()} Mycelia Interactive. All rights reserved.</span>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
              <Link href="/ls" className="hover:text-cyan-400 transition-colors">Liminal Sin</Link>
              <Link href="/roadmap/2026-03-03" className="hover:text-cyan-400 transition-colors">Latest Roadmap</Link>
            </div>
          </div>
        </footer>
      </div>

      <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" strategy="afterInteractive" />
      <Script id="rm-gsap-init" strategy="afterInteractive">{`
        if (typeof gsap !== 'undefined') {
          gsap.from('h1', { opacity: 0, y: 30, duration: 1, ease: 'power3.out', delay: 0.2 });
        }
      `}</Script>
    </>
  );
}
