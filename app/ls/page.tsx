import Image from "next/image";
import Link from "next/link";
import SignupForms from "@/app/ls/SignupForms";

export default function LiminalSinLanding() {
  return (
    <div className="bg-[#08041a] min-h-screen text-white">

      {/* ── STYLES ─────────────────────────────────────────── */}
      { }
      <style>{`
          @keyframes neon-flicker {
            0%, 100% {
              box-shadow: 0 0 6px #a855f7, 0 0 18px #7e22ce, 0 0 38px #6b21a8, inset 0 0 10px rgba(168,85,247,0.15);
              text-shadow: 0 0 8px #d946ef, 0 0 18px #a855f7;
              opacity: 1;
            }
            2%  { box-shadow: none; text-shadow: none; opacity: 0.75; }
            4%  { box-shadow: 0 0 6px #a855f7, 0 0 18px #7e22ce; text-shadow: 0 0 8px #d946ef; opacity: 1; }
            19% { box-shadow: 0 0 6px #a855f7, 0 0 22px #7e22ce, 0 0 42px #6b21a8; opacity: 1; }
            21% { box-shadow: none; text-shadow: none; opacity: 0.6; }
            23% { box-shadow: 0 0 10px #c084fc, 0 0 32px #a855f7, 0 0 60px #7e22ce; text-shadow: 0 0 12px #e879f9; opacity: 1; }
            60% { box-shadow: 0 0 6px #a855f7, 0 0 18px #7e22ce, 0 0 38px #6b21a8; opacity: 1; }
            62% { opacity: 0.82; box-shadow: 0 0 3px #7e22ce; text-shadow: none; }
            64% { opacity: 1; box-shadow: 0 0 6px #a855f7, 0 0 18px #7e22ce; text-shadow: 0 0 8px #d946ef; }
          }
          @keyframes glitch-shift {
            0%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0); }
            20% { clip-path: inset(10% 0 60% 0); transform: translate(-3px, 1px); }
            40% { clip-path: inset(50% 0 20% 0); transform: translate(3px, -1px); }
            60% { clip-path: inset(30% 0 40% 0); transform: translate(-2px, 2px); }
            80% { clip-path: inset(70% 0 5% 0);  transform: translate(2px, -2px); }
          }
          .double-down-btn {
            position: relative;
            display: inline-block;
            padding: 1.25rem 3.5rem;
            background: linear-gradient(135deg, rgba(126,34,206,0.55), rgba(168,85,247,0.45));
            border: 1px solid rgba(192,132,252,0.6);
            border-radius: 0.375rem;
            color: #fff;
            font-family: var(--font-geist-mono), 'Courier New', monospace;
            font-size: 1.25rem;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            cursor: pointer;
            animation: neon-flicker 5s ease-in-out infinite;
            transition: background 0.25s ease, letter-spacing 0.15s ease;
          }
          .double-down-btn::before {
            content: 'DOUBLE DOWN';
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #c084fc;
            font-family: 'Arial Narrow', Arial, sans-serif;
            font-weight: 900;
            letter-spacing: 0.22em;
            opacity: 0;
            animation: glitch-shift 7s steps(1) infinite;
            pointer-events: none;
          }
          .double-down-btn:hover {
            font-family: 'Courier New', Courier, monospace;
            letter-spacing: 0.22em;
            background: linear-gradient(135deg, rgba(168,85,247,0.75), rgba(217,70,239,0.55));
            border-color: rgba(240,171,252,0.8);
            box-shadow: 0 0 14px #a855f7, 0 0 36px #7e22ce, 0 0 70px #6b21a8, inset 0 0 16px rgba(168,85,247,0.2);
            text-shadow: 0 0 10px #f0abfc, 0 0 22px #e879f9;
          }
        `}</style>

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav className="ls-gutter ls-nav-py fixed top-0 z-50 w-full flex items-center justify-between bg-black/70 backdrop-blur-md border-b border-purple-900/50">
        {/* LEFT: Logo */}
        <Link href="/" aria-label="Return to home">
          <Image
            src="/assets/images/Mycelia Interactive Banner.png"
            alt="Mycelia Interactive"
            width={360}
            height={100}
            className="h-10 sm:h-14 w-auto object-contain rounded drop-shadow-[0_0_10px_rgba(139,44,245,0.3)] transition-transform hover:scale-105"
          />
        </Link>
        {/* RIGHT: Links + Buttons */}
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 flex-wrap justify-end">
          {/* Roadmap — hidden on xs, visible from sm up */}
          <a
            href="/roadmap/roadmap.html"
            className="hidden sm:inline uppercase tracking-[0.125em] text-white hover:text-purple-400 transition-colors text-sm font-medium"
          >
            Roadmap
          </a>
          {/* Play Demo — always visible */}
          <a
            href="/ls"
            className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-hero-magenta-600 to-hero-cyan-600 font-semibold text-white text-xs sm:text-sm hover:from-hero-magenta-500 hover:to-hero-cyan-500 hover:shadow-[0_0_20px_rgba(139,44,245,0.5)] transition-all duration-300 whitespace-nowrap"
          >
            Play Liminal Sin Demo
          </a>
          {/* Learn More — hidden on xs */}
          <a
            href="/ls/lsr.html"
            className="hidden sm:inline-flex px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-hero-bg-light/50 border border-hero-cyan-400/30 text-cyan-50 text-xs sm:text-sm font-medium hover:bg-hero-cyan-900/40 hover:border-hero-cyan-300 hover:text-white transition-all duration-300"
          >
            Learn More
          </a>
        </div>
      </nav>
      {/* ── END NAVBAR ─────────────────────────────────────── */}

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative h-screen w-full overflow-hidden">

        {/* Background image + gradient overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/Liminal_Sin_Title.jpg"
            alt="Liminal Sin Backdrop"
            fill
            className="object-cover opacity-40 mix-blend-luminosity duration-1000 animate-pulse"
            priority
          />
          {/* Top-30% transparent → black gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[30%] to-[#08041a]" />
          {/* Extra dark vignette at very bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08041a] via-transparent to-transparent" />
        </div>

        {/* Glitch title "LIMINAL SIN" */}
        <div className="absolute top-[18vh] left-1/2 -translate-x-1/2 z-10 text-center w-full px-4">
          <h1
            className="glitch-effect text-6xl md:text-8xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_30px_rgba(255,0,50,0.4)]"
            data-text="LIMINAL SIN"
          >
            LIMINAL SIN
          </h1>
        </div>

        {/* Description card */}
        <div className="absolute top-[42vh] left-1/2 -translate-x-1/2 z-20 w-[calc(100%-2rem)] max-w-[620px] px-10 py-9 bg-black/65 backdrop-blur-md border border-[#8b00ff]/40 rounded-2xl shadow-[0_0_40px_rgba(139,0,255,0.25)] text-center">
          <p className="text-xl md:text-2xl text-red-100/90 font-light drop-shadow-md">
            An Interactive FMV Psychological Horror where your reality is
            fractured, and trust is the true illusion.
          </p>
        </div>

        {/* DOUBLE DOWN button */}
        <div className="absolute top-[62vh] left-1/2 -translate-x-1/2 z-30">
          <a href="#content">
            <button className="double-down-btn">DOUBLE DOWN</button>
          </a>
        </div>

        {/* Tagline */}
        <div className="absolute bottom-[12vh] left-1/2 -translate-x-1/2 z-10 w-full px-4 text-center">
          <p className="text-xl sm:text-2xl md:text-3xl font-light text-cyan-400 tracking-widest drop-shadow-[0_0_14px_rgba(0,199,255,0.7)]">
            Once you&apos;re in, will you ever get out?
          </p>
        </div>

      </section>
      {/* ── END HERO ─────────────────────────────────────── */}

      {/* ── CONTENT SECTION ─────────────────────────────── */}
      <section id="content" className="ls-section-py relative bg-[#050507]">
        <div className="ls-gutter max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-16 items-center">

            {/* LEFT COLUMN: text */}
            <div className="text-lg leading-relaxed text-gray-300 space-y-8">
              <p>
                <strong className="text-white">LIMINAL SIN</strong> is a prototype
                built on a new kind of interactive architecture. Set in the{" "}
                <span className="text-purple-300 font-semibold">Vegas Underground</span>{" "}
                &mdash; a descent through impossible layers beneath a Las Vegas Strip
                casino &mdash; you become a disembodied voice woven into a living
                story. Three people are trapped. They can hear you. Whether they
                trust you is entirely up to them.
              </p>
              <p>
                This is{" "}
                <strong className="text-white">Mycelia Interactive&apos;s</strong>{" "}
                first demonstration of real-time AI-driven narrative &mdash; where
                voice, emotion, and trust reshape the story as it unfolds. Not a
                branching menu. Not a chatbot. A system that watches, listens, and
                responds. The potential of this technology extends far beyond what
                any single experience can contain.
              </p>
            </div>

            {/* RIGHT COLUMN: image teaser card */}
            <div className="relative w-full aspect-[16/9.5] rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl">
              <Image
                src="/assets/images/Liminal_Sin_Title.jpg"
                alt="Gameplay Sneak Peek"
                fill
                className="object-cover opacity-90 hover:opacity-100 transition-opacity"
              />

            </div>

          </div>
        </div>
      </section>
      {/* ── END CONTENT SECTION ─────────────────────────── */}

      {/* ── VEGAS UNDERGROUND ────────────────────────────── */}
      <section className="ls-section-py relative bg-[#02010a]">
        {/* Faint radial pulse behind the text */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(88,28,135,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="ls-gutter max-w-3xl mx-auto relative z-10 flex flex-col items-center gap-10 text-center">

          {/* Section eyebrow */}
          <p
            className="text-xs tracking-[0.35em] uppercase text-purple-400/60"
            style={{ fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
          >
            Origin Event — Layer 0
          </p>

          {/* Divider */}
          <div
            className="w-16 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(192,132,252,0.5), transparent)",
            }}
          />

          {/* Lore body */}
          <div className="text-base sm:text-lg text-gray-400/80 leading-relaxed space-y-6 text-left">
            <p>
              Somewhere beneath the Las Vegas Strip, three people are missing.
              Not missing like lost. Missing like{" "}
              <span className="text-purple-300 font-semibold">they went somewhere they were not supposed to go</span>.
            </p>
            <p>
              They can still hear a voice. Yours. And right now, you are the
              only reason any of them are still alive.
            </p>
          </div>

        </div>
      </section>
      {/* ── END VEGAS UNDERGROUND ────────────────────────── */}

      {/* ── TRUST SYSTEM ─────────────────────────────────── */}
      <section className="ls-section-py relative bg-[#050507]">
        <div className="ls-gutter max-w-7xl mx-auto flex flex-col items-center gap-12">

          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl">
            <p
              className="text-xs tracking-[0.35em] uppercase text-purple-400/60"
              style={{ fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
            >
              Core Mechanic
            </p>
            <h2
              className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-white"
              style={{ textShadow: "0 0 20px rgba(139,0,255,0.25)" }}
            >
              The Trust System
            </h2>
            <p className="text-gray-400/80 text-base leading-relaxed">
              The characters are agents, not actors. Their behavior shifts with every word you
              speak. Build trust through honesty. Destroy it through manipulation. Watch the
              house collect its debt.
            </p>
          </div>

          {/* 3-column cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">

            {/* Neutral */}
            <div className="relative rounded-2xl border border-purple-800/40 bg-[#0a0514]/70 backdrop-blur-md p-7 flex flex-col gap-4 overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(88,28,135,0.12) 0%, transparent 70%)",
                }}
              />
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="text-xl"
                    aria-hidden="true"
                    style={{ filter: "drop-shadow(0 0 6px rgba(192,132,252,0.5))" }}
                  >◈</span>
                  <h3
                    className="text-lg font-bold tracking-widest uppercase text-purple-200"
                    style={{ fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
                  >
                    Neutral
                  </h3>
                </div>
                <p
                  className="text-xs text-purple-400/50 uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
                >
                  Starting State
                </p>
                <p className="text-gray-400/80 text-sm leading-relaxed">
                  The characters are cautious but willing to listen. They withhold critical
                  survival secrets. Every interaction is a calculation — is this voice a
                  lifeline, or a trap?
                </p>
              </div>
            </div>

            {/* High Trust */}
            <div className="relative rounded-2xl border border-cyan-700/40 bg-[#00100f]/70 backdrop-blur-md p-7 flex flex-col gap-4 overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,78,59,0.2) 0%, transparent 70%)",
                }}
              />
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="text-xl text-cyan-400"
                    aria-hidden="true"
                    style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.6))" }}
                  >◈</span>
                  <h3
                    className="text-lg font-bold tracking-widest uppercase text-cyan-200"
                    style={{ fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
                  >
                    High Trust
                  </h3>
                </div>
                <p
                  className="text-xs text-cyan-400/50 uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
                >
                  Trigger: Honesty. Reliable guidance.
                </p>
                <p className="text-gray-400/80 text-sm leading-relaxed">
                  Compliance. Environmental clues surface. Survival hints are shared. The
                  characters follow your lead — but they remember every promise you&apos;ve
                  made and whether you kept it.
                </p>
              </div>
            </div>

            {/* Low Trust */}
            <div className="relative rounded-2xl border border-red-900/50 bg-[#0f0101]/70 backdrop-blur-md p-7 flex flex-col gap-4 overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(127,29,29,0.2) 0%, transparent 70%)",
                }}
              />
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="text-xl text-red-400"
                    aria-hidden="true"
                    style={{ filter: "drop-shadow(0 0 6px rgba(248,113,113,0.6))" }}
                  >◈</span>
                  <h3
                    className="text-lg font-bold tracking-widest uppercase text-red-300"
                    style={{ fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
                  >
                    Low Trust
                  </h3>
                </div>
                <p
                  className="text-xs text-red-400/50 uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
                >
                  Trigger: Lies. Leading into traps.
                </p>
                <p className="text-gray-400/80 text-sm leading-relaxed">
                  Unpredictable. They may disobey, hide information, or spiral into
                  paranoia. At the floor — they negotiate for their own survival over the
                  others. The house begins to collect.
                </p>
              </div>
            </div>

          </div>

          {/* Footer note */}
          <p
            className="text-xs text-purple-500/40 text-center max-w-lg"
            style={{ fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
          >
            Trust is not a meter. It is a lived memory. The AI agents track everything you
            say — and everything you don&apos;t.
          </p>

        </div>
      </section>
      {/* ── END TRUST SYSTEM ─────────────────────────────── */}

      {/* ── WHAT AWAITS YOU ──────────────────────────────── */}
      <section className="ls-section-py relative bg-[#02010a]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 60%, rgba(126,34,206,0.1) 0%, transparent 70%)",
          }}
        />
        <div className="ls-gutter max-w-4xl mx-auto relative z-10 flex flex-col items-center gap-12">

          {/* Header */}
          <div className="text-center space-y-3">
            <p
              className="text-xs tracking-[0.35em] uppercase text-purple-400/60"
              style={{ fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
            >
              System Capabilities
            </p>
            <h2
              className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-white"
              style={{ textShadow: "0 0 20px rgba(139,0,255,0.25)" }}
            >
              What Awaits You
            </h2>
          </div>

          {/* Feature list */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: "🎙",
                label: "Your Voice Is the Mechanic",
                desc: "No controllers. No menus. You speak — and the characters react in real time. Social engineering is the only lever you have.",
              },
              {
                icon: "👁",
                label: "The House Watches You Back",
                desc: "The Game Master perceives your webcam and reads your vocal cadence. Your calm can be weaponized. Your panic will be punished.",
              },
              {
                icon: "🎞",
                label: "Full Motion Video — Generatively Rebuilt",
                desc: "Synthetic liminal Vegas spaces generated with VEO 3 and Kling 3.0. Architecture that shifts mid-scene. A door that was there a moment ago may dissolve into a wall.",
              },
              {
                icon: "🤖",
                label: "Agents, Not Actors",
                desc: "Jason, Audrey, and Josh are autonomous AI agents with individual trust and fear metrics. They remember. They resist. They can refuse.",
              },
              {
                icon: "🎰",
                label: "Slotsky — The Probability Engine",
                desc: "Not a monster. A force. The casino logic made sentient underground. It rearranges corridors. Removes exits. The house always wins.",
              },
              {
                icon: "🧱",
                label: "The Fourth Wall Is a Lie",
                desc: "Tell the characters they're in a simulation. Watch a Logic Collapse event shatter reality. The FMV tears. Anomalous Intensity spikes. Consequences are permanent.",
              },
            ].map(({ icon, label, desc }) => (
              <div
                key={label}
                className="flex gap-5 rounded-xl border border-purple-900/30 bg-[#0a0514]/50 p-6 hover:border-purple-700/50 hover:bg-[#0a0514]/80 transition-all duration-300 group"
              >
                <span
                  className="text-2xl mt-0.5 shrink-0 select-none"
                  aria-hidden="true"
                >
                  {icon}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3
                    className="text-sm font-bold text-purple-200 uppercase tracking-wide group-hover:text-white transition-colors"
                    style={{ fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
                  >
                    {label}
                  </h3>
                  <p className="text-gray-500/80 text-sm leading-relaxed group-hover:text-gray-400/90 transition-colors">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA nudge toward signup */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div
              className="w-16 h-px"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(192,132,252,0.4), transparent)",
              }}
            />
            <p
              className="text-sm text-purple-400/50"
              style={{ fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
            >
              Prototype access opens below. First 30 subjects only.
            </p>
            <a
              href="#access"
              className="text-xs uppercase tracking-[0.25em] text-cyan-400/70 hover:text-cyan-300 transition-colors"
              style={{ fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
            >
              ↓ Request Access
            </a>
          </div>

        </div>
      </section>
      {/* ── END WHAT AWAITS YOU ──────────────────────────── */}

      {/* ── ACCESS SECTION ───────────────────────────────── */}
      <section id="access" className="ls-section-py relative bg-[#050507]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(88,28,135,0.1) 0%, transparent 70%)",
          }}
        />
        <div className="ls-gutter max-w-5xl mx-auto relative z-10 flex flex-col items-center gap-10">

          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl">
            <p
              className="text-xs tracking-[0.35em] uppercase text-purple-400/60"
              style={{ fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
            >
              Request Access
            </p>
            <h2
              className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-white"
              style={{ textShadow: "0 0 20px rgba(139,0,255,0.25)" }}
            >
              Enter the Underground
            </h2>
            <p className="text-gray-400/80 text-base leading-relaxed">
              The prototype opens soon. Register your access point below. You will be
              contacted when the signal is live.
            </p>
          </div>

          <SignupForms />

        </div>
      </section>
      {/* ── END ACCESS SECTION ───────────────────────────── */}

      {/* ── DESKTOP DISCLAIMER ───────────────────────────── */}
      <div className="ls-gutter w-full bg-[#0d0820] border-y border-purple-900/40 py-4">
        <p className="text-center text-xs sm:text-sm text-purple-300/80 tracking-wide">
          <span className="font-semibold text-purple-400">⚠️ Desktop Experience:</span>
          {" "}LIMINAL SIN is designed for desktop browsers. Tablet support is currently in testing. Mobile play is not yet supported.
        </p>
      </div>
      {/* ── END DESKTOP DISCLAIMER ─────────────────────────── */}

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="ls-gutter ls-footer-py w-full backdrop-blur-md bg-[#140a36]/80 border-t border-hero-cyan-300/30">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Top row: copyright */}
          <div className="flex items-center justify-start text-cyan-50/70 text-sm">
            &copy; {new Date().getFullYear()} Mycelia Interactive. All rights reserved.
          </div>
          {/* Bottom row: placeholder for future disclaimers, privacy link, etc. */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-cyan-50/40 border-t border-purple-900/30 pt-4">
            <span>LIMINAL SIN&trade; is a work of interactive fiction. All characters and events are fictional.</span>
            <span className="hidden sm:inline text-purple-900/60">|</span>
            <a href="/ls/privacy.html" className="hover:text-cyan-300 transition-colors">Privacy Policy</a>
            <span className="hidden sm:inline text-purple-900/60">|</span>
            <span className="text-purple-400/60">v0.1 — Early Access</span>
          </div>
        </div>
      </footer>
      {/* ── END FOOTER ───────────────────────────────────── */}

    </div>
  );
}
