"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";

interface CommunityIdea {
  id: number;
  title: string;
  description: string;
}

export default function RoadmapDetailPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [communityIdeas, setCommunityIdeas] = useState<CommunityIdea[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "idea",
    title: "",
    details: "",
  });

  function submitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.details) return;
    setCommunityIdeas((prev) => [
      ...prev,
      { id: Date.now(), title: form.title, description: form.details },
    ]);
    setFormSubmitted(true);
  }

  return (
    <>
      <style>{`
        .rd-body {
          background-color: #05020f;
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          color: #e2e8f0;
        }
        .rd-body::before {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }
        .rd-body ::-webkit-scrollbar { width: 6px; }
        .rd-body ::-webkit-scrollbar-track { background: #05020f; }
        .rd-body ::-webkit-scrollbar-thumb { background: #7e22ce; border-radius: 3px; }

        .scanline-container { overflow: hidden; }
        @keyframes rd-scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .scanline-bar {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(34,211,238,0.15), transparent);
          animation: rd-scanline 8s linear infinite;
          pointer-events: none;
        }

        @keyframes rd-glow {
          0%   { text-shadow: 0 0 10px #d946ef, 0 0 20px #7e22ce; }
          100% { text-shadow: 0 0 20px #22d3ee, 0 0 40px #06b6d4; }
        }
        .animate-rd-glow { animation: rd-glow 3s ease-in-out infinite alternate; }

        @keyframes rd-pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-rd-pulse-slow { animation: rd-pulse-slow 4s cubic-bezier(0.4,0,0.6,1) infinite; }

        .roadmap-card {
          transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .roadmap-card:hover { transform: translateY(-6px); }
        .card-done:hover     { box-shadow: 0 0 40px rgba(34,211,238,0.25); border-color: rgba(34,211,238,0.5); }
        .card-wip:hover      { box-shadow: 0 0 40px rgba(139,44,245,0.3);  border-color: rgba(139,44,245,0.6); }
        .card-planned:hover  { box-shadow: 0 0 40px rgba(217,70,239,0.25); border-color: rgba(217,70,239,0.5); }
        .card-idea:hover     { box-shadow: 0 0 40px rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }

        .badge-ring { position: relative; }
        @keyframes rd-ring-pulse {
          0%   { opacity: 0.6; transform: scale(1); }
          100% { opacity: 0;   transform: scale(1.6); }
        }
        .badge-ring::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 9999px;
          border: 1px solid currentColor;
          opacity: 0;
          animation: rd-ring-pulse 2.5s ease-out infinite;
        }

        .form-input {
          background: rgba(22,10,58,0.6);
          border: 1px solid #2a1060;
          color: #e2e8f0;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          width: 100%;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .form-input:focus {
          border-color: #22d3ee;
          box-shadow: 0 0 0 3px rgba(34,211,238,0.15);
        }
        .form-input::placeholder { color: #4b5563; }

        @keyframes rd-fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rd-fade-in-up { animation: rd-fadeInUp 0.7s ease-out both; }
      `}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800;900&family=Inter:wght@300;400;500;600&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div className="rd-body relative overflow-x-hidden">
        {/* NAV */}
        <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#05020f]/90 border-b border-[#2a1060]">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link
              href="/roadmap"
              className="flex items-center gap-2 text-sm text-cyan-300 hover:text-white transition-colors duration-200"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
              title="Back to Roadmap Index"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Roadmap Index
            </Link>
            <a
              href="https://myceliainteractive.com"
              className="text-xs uppercase tracking-widest text-slate-500 hover:text-cyan-400 transition-colors duration-200"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
              title="Return to main site"
            >
              myceliainteractive.com ↗
            </a>
          </div>
        </nav>

        {/* HERO */}
        <section className="scanline-container relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden">
          <div className="scanline-bar" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-900/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            <p className="text-xs tracking-[0.5em] text-cyan-400/60 uppercase mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Mycelia Interactive
            </p>
            <h1
              className="font-black text-4xl sm:text-6xl lg:text-7xl leading-tight mb-6 animate-rd-glow"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                background: "linear-gradient(135deg, #d946ef, #22d3ee)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              PRODUCT ROADMAP
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              A living document tracking everything we&apos;ve built, what&apos;s in motion,
              what&apos;s coming, and what&apos;s still just a dream in the dark.
            </p>
            <div className="mt-4 inline-block px-4 py-1.5 rounded-full border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 text-xs tracking-widest uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Last Updated: March 6, 2026
            </div>
          </div>

          {/* Status legend */}
          <div className="relative z-10 mt-12 flex flex-wrap justify-center gap-4">
            <span className="flex items-center gap-2 text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}><span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Already Done</span>
            <span className="flex items-center gap-2 text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}><span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" /> Being Worked On</span>
            <span className="flex items-center gap-2 text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}><span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 inline-block" /> Planned</span>
            <span className="flex items-center gap-2 text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}><span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" /> Not Confirmed</span>
          </div>
        </section>

        {/* DISCLAIMER BANNER */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 mb-16">
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-6 py-4 flex gap-4 items-start">
            <span className="text-yellow-400 text-2xl mt-0.5">⚠</span>
            <div>
              <p className="font-semibold text-yellow-300 text-base tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>This roadmap is a living document</p>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Features listed under <strong className="text-slate-300">Planned</strong> and <strong className="text-slate-300">Not Confirmed</strong>{" "}
                are subject to change, reprioritization, or cancellation. Nothing here is a promise — it&apos;s a window into our thinking.
                Community ideas submitted via the form below are automatically placed in <em>Not Confirmed</em> for review.
              </p>
            </div>
          </div>
        </div>

        <main className="relative z-10 max-w-6xl mx-auto px-6 pb-32 space-y-24">
          {/* ALREADY DONE */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="badge-ring flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs tracking-widest uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-rd-pulse-slow inline-block" />
                Already Done
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: "🏠", title: "Homepage Redesign", desc: "Full UI overhaul targeting contest judges. Two-column animated card layout linking to Mycelia Interactive and Liminal Sin sub-pages." },
                { icon: "📋", title: "Signup Forms + D1 Backend", desc: <>Judge and Beta Tester signup forms live on <code className="text-cyan-400">/ls</code>. Cloudflare D1 stores all signups. <code className="text-cyan-400">POST /api/signup</code> validates input, writes to D1, and triggers the welcome email.</> },
                { icon: "📧", title: "Email Dispatch System", desc: <>Two-email flow via Brevo. Email 1 fires instantly on signup. Email 2 (&quot;The Underground Is Open&quot;) dispatches to all users within 60 seconds of admin flipping the game-live flag via a protected API endpoint.</> },
                { icon: "🔐", title: "Judge Backdoor Page", desc: <>Atmospheric access gate at <code className="text-cyan-400">/ls/judges</code> — &quot;SIGNAL AUTHORIZED&quot; page with neon-flicker CTA. Links to the judge game session wrapper at <code className="text-cyan-400">/ls/judges/game</code>.</> },
                { icon: "🖼️", title: "FPV Image Carousel (CF AI)", desc: <>Background image carousel on <code className="text-cyan-400">/ls</code> powered by Cloudflare Workers AI (Flux 1 Schnell). Generates cinematic POV Smart Glasses shots of the Vegas Underground — 12-seed cap, 24h edge cache, crossfade transitions.</> },
                { icon: "🗺️", title: "This Roadmap Page", desc: <>Versioned roadmap index and detail document live at <code className="text-cyan-400">/roadmap</code>. Reflects actual project state and is updated each session.</> },
                { icon: "🔗", title: "Sticky Header & Footer", desc: "Enlarged sticky header with backdrop blur, nav links to Liminal Sin and LSR demo, and a persistent footer on all pages." },
                { icon: "🎬", title: "Liminal Sin Landing Page", desc: <>Cinematic FMV horror pitch page at <code className="text-cyan-400">/ls</code> with parallax banner, dark aesthetic, and signup section scaffolding.</> },
                { icon: "📂", title: "Static HTML Migration", desc: <>LSR demo and privacy pages copied to <code className="text-cyan-400">public/ls/</code> and served as static assets at <code className="text-cyan-400">/ls/lsr.html</code>.</> },
                { icon: "🧭", title: "Home Button on All Subpages", desc: <>Mycelia Interactive banner logo in the global header is wrapped in a <code className="text-cyan-400">Link href=&quot;/&quot;</code> so users can return home from any subpage.</> },
                { icon: "📄", title: "Mycelia Placeholder Page", desc: <>Stub page at <code className="text-cyan-400">/mycelia</code> built and deployed. Displays &quot;System Initialization Pending&quot; in the project aesthetic.</> },
                { icon: "📜", title: "AGENTS.md Established", desc: "Project AI ruleset created, cleaned, and committed to both the Liminal Sin Gemini and Mycelia Interactive repositories with full safety permissions and execution protocol." },
              ].map((card, i) => (
                <div key={i} className="roadmap-card card-done rounded-xl border border-cyan-500/20 bg-[#160a3a] p-5 rd-fade-in-up">
                  <div className="text-cyan-400 text-xl mb-3">{card.icon}</div>
                  <h3 className="font-semibold text-sm text-white mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>{card.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* BEING WORKED ON */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="badge-ring flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-400/40 text-purple-300 text-xs tracking-widest uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-rd-pulse-slow inline-block" />
                Being Worked On
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="roadmap-card card-wip rounded-xl border border-purple-500/20 bg-[#160a3a] p-5 rd-fade-in-up">
                <div className="text-purple-400 text-xl mb-3">🎮</div>
                <h3 className="font-semibold text-sm text-white mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>Game UI Shell</h3>
                <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Browser client at <code className="text-purple-300">/ls/game</code> and <code className="text-purple-300">/ls/judges/game</code>. Shell pages, WebSocket context, HUD overlay, and mic/webcam capture hooks are in place. Next step: wire to the live Google Cloud Run WebSocket endpoint.
                </p>
              </div>
              <div className="roadmap-card card-wip rounded-xl border border-purple-500/20 bg-[#160a3a] p-5 rd-fade-in-up">
                <div className="text-purple-400 text-xl mb-3">🤖</div>
                <h3 className="font-semibold text-sm text-white mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>Gemini Live Integration</h3>
                <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Full-duplex WebSocket pipeline between the browser client and the Google Cloud Run backend. WebSocket event contract defined in <code className="text-purple-300">TEAM_CONTRACT.md</code>. Frontend shell is ready; backend pipeline is actively in development in <code className="text-purple-300">liminal-sin-gemini</code>.
                </p>
              </div>
            </div>
          </section>

          {/* PLANNED */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="badge-ring flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-400/40 text-fuchsia-300 text-xs tracking-widest uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-rd-pulse-slow inline-block" />
                Planned
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-fuchsia-500/30 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="roadmap-card card-planned rounded-xl border border-fuchsia-500/20 bg-[#160a3a] p-5 rd-fade-in-up">
                <div className="text-fuchsia-400 text-xl mb-3">🔊</div>
                <h3 className="font-semibold text-sm text-white mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>TTS Ambient Voiceover</h3>
                <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Creepy atmospheric audio clips for the <code className="text-fuchsia-300">/ls</code> landing page generated via Cloudflare Workers AI (<code className="text-fuchsia-300">@cf/deepgram/aura-2-en</code>). Dynamic, procedurally generated — no manual voice recordings required.
                </p>
              </div>
              <div className="roadmap-card card-planned rounded-xl border border-fuchsia-500/20 bg-[#160a3a] p-5 rd-fade-in-up">
                <div className="text-fuchsia-400 text-xl mb-3">🎁</div>
                <h3 className="font-semibold text-sm text-white mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>User Reward System</h3>
                <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  A system to reward early adopters, testers, and active community members. Early access, exclusive in-game content, and recognition tiers are under consideration.
                </p>
              </div>
              <div className="roadmap-card card-planned rounded-xl border border-fuchsia-500/20 bg-[#160a3a] p-5 rd-fade-in-up">
                <div className="text-fuchsia-400 text-xl mb-3">💬</div>
                <h3 className="font-semibold text-sm text-white mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>Feedback API Endpoint</h3>
                <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Backend at <code className="text-fuchsia-300">/api/feedback</code> to receive user-submitted bugs, ideas, and issues from the form below. Submissions route to the studio inbox and are reviewed for roadmap inclusion.
                </p>
              </div>
            </div>
          </section>

          {/* NOT CONFIRMED */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="badge-ring flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-700/40 border border-slate-500/30 text-slate-400 text-xs tracking-widest uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <span className="w-2 h-2 rounded-full bg-slate-500 animate-rd-pulse-slow inline-block" />
                Not Confirmed
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-600/30 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: "🏆", title: "Leaderboard / Trust Rankings", desc: "A public or semi-public leaderboard tracking community engagement, tester contributions, or in-game Trust actions. Format and scope TBD." },
                { icon: "📱", title: "Mobile-First Game Interface", desc: "A native-feeling mobile wrapper or PWA for the Liminal Sin experience. Depends on gameplay direction confirmed post-testing." },
                { icon: "🌐", title: "Community Hub / Forum", desc: "A dedicated space for players, testers, and fans to discuss theories, share screenshots, and interact. Could be Discord, a custom forum, or embedded chat." },
                { icon: "🗺️", title: "This Roadmap Feature", desc: "The roadmap page itself — including this user feedback form — is an early-stage idea being actively prototyped. Its final scope and integration into the main site are not yet confirmed." },
              ].map((card, i) => (
                <div key={i} className="roadmap-card card-idea rounded-xl border border-slate-600/20 bg-[#160a3a] p-5 rd-fade-in-up">
                  <div className="text-slate-500 text-xl mb-3">{card.icon}</div>
                  <h3 className="font-semibold text-sm text-slate-300 mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>{card.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{card.desc}</p>
                </div>
              ))}

              {/* Community-submitted ideas */}
              {communityIdeas.map((idea) => (
                <div key={idea.id} className="roadmap-card card-idea rounded-xl border border-slate-600/20 bg-[#160a3a] p-5 rd-fade-in-up">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-slate-500 text-xl">💡</div>
                    <span className="text-[10px] bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>Community Idea</span>
                  </div>
                  <h3 className="font-semibold text-sm text-slate-300 mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>{idea.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{idea.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FEEDBACK FORM */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="font-bold text-lg text-white tracking-wide" style={{ fontFamily: "'Orbitron', sans-serif" }}>Submit Your Feedback</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/20 to-transparent" />
            </div>

            <div
              className="max-w-2xl mx-auto rounded-2xl border border-purple-500/20 bg-[#160a3a] p-8"
              style={{ boxShadow: "0 0 60px rgba(139,44,245,0.1)" }}
            >
              <p className="text-slate-400 text-sm leading-relaxed mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                Found a bug? Have an idea? Want to see something on this roadmap?
                Submit it here. All ideas are automatically placed into <strong className="text-slate-300">Not Confirmed</strong>{" "}
                and reviewed by the team. You&apos;re welcome to use a fake name or screen name — we don&apos;t need your identity.
              </p>

              {formSubmitted && (
                <div className="mb-6 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-5 py-4 text-cyan-300 text-base rd-fade-in-up" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  ✅ Received. Your idea has been placed in <strong>Not Confirmed</strong>. Thank you.
                </div>
              )}

              {!formSubmitted && (
                <form onSubmit={submitFeedback} className="space-y-5">
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                      Name / Screen Name <span className="text-slate-600">(fake names welcome)</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Anonymous, DarkHorse99, etc."
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                      Email <span className="text-slate-600">(optional — only if you want a reply)</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="form-input"
                    >
                      <option value="idea">💡 Idea / Feature Request</option>
                      <option value="bug">🐛 Bug Report</option>
                      <option value="issue">⚠️ Issue / Problem</option>
                      <option value="complaint">📣 Complaint</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Short title for your submission"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-widest mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                      Details <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={form.details}
                      onChange={(e) => setForm({ ...form, details: e.target.value })}
                      rows={4}
                      placeholder="Describe your idea, bug, or issue in detail..."
                      className="form-input resize-none"
                      required
                    />
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                    By submitting you agree that your idea may be incorporated into the product roadmap under the <em>Not Confirmed</em> stage.
                    No personally identifiable information is required. This endpoint is a placeholder — backend integration is <strong className="text-fuchsia-400/70">Planned</strong>.
                  </p>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl font-semibold text-sm uppercase tracking-widest text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,44,245,0.5)]"
                    style={{
                      fontFamily: "'Orbitron', sans-serif",
                      background: "linear-gradient(135deg, #7e22ce, #06b6d4)",
                    }}
                  >
                    Submit Feedback
                  </button>
                </form>
              )}
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="relative z-10 border-t border-slate-800/50 py-10 text-center">
          <p className="text-xs text-slate-600 tracking-widest uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            &copy; 2026 Mycelia Interactive — All rights reserved
          </p>
          <Link href="/" className="mt-3 inline-block text-sm text-cyan-500/50 hover:text-cyan-400 transition-colors duration-200" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            ← Return to Main Site
          </Link>
        </footer>
      </div>

      <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" strategy="afterInteractive" />
      <Script id="rd-gsap-init" strategy="afterInteractive">{`
        if (typeof gsap !== 'undefined') {
          gsap.from('h1', { opacity: 0, y: 40, duration: 1.4, ease: 'power3.out', delay: 0.2 });
          gsap.from('.scanline-container p', { opacity: 0, y: 20, duration: 1, ease: 'power2.out', delay: 0.7, stagger: 0.15 });
          if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            document.querySelectorAll('section > div:first-child').forEach(function(el) {
              gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 85%' },
                opacity: 0, x: -30, duration: 0.8, ease: 'power2.out'
              });
            });
          }
        }
      `}</Script>
    </>
  );
}
