import Image from "next/image";
import Link from "next/link";

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
      <nav className="fixed top-0 z-50 w-full flex items-center justify-between px-[var(--ls-page-px)] py-[var(--ls-nav-py)] bg-black/70 backdrop-blur-md border-b border-purple-900/50">
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
      <section id="content" className="relative py-[var(--ls-section-py)] bg-[#050507]">
        <div className="max-w-7xl mx-auto px-[var(--ls-page-px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-16 items-center">

            {/* LEFT COLUMN: text */}
            <div className="text-lg leading-relaxed text-gray-300 space-y-8">
              <p>
                In <strong className="text-white">LIMINAL SIN</strong>, you don&apos;t
                just watch a movie; you direct the nightmare. Navigating through
                branching timelines built with hundreds of cinematic FMV (Full
                Motion Video) clips, every choice spirals you deeper into a
                labyrinth of buried secrets and broken memories.
              </p>
              <p>
                Investigate the anomalies. Hunt for the glitched artifacts. Choose
                who to trust. The narrative adapts to your paranoia. Who is the
                Game Master?
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
              {/* Overlaid card — bottom-left */}
              <div
                id="signup"
                className="absolute bottom-8 left-8 bg-black/90 border border-cyan-400/60 px-7 py-5 rounded-xl max-w-[280px]"
              >
                <h3 className="text-sm font-bold text-cyan-400 mb-1">
                  Initializing Connection Protocols...
                </h3>
                <p className="text-cyan-100/50 text-xs">
                  Access terminals loading in next phase.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* ── END CONTENT SECTION ─────────────────────────── */}

      {/* ── DESKTOP DISCLAIMER ───────────────────────────── */}
      <div className="w-full bg-[#0d0820] border-y border-purple-900/40 py-4 px-[var(--ls-page-px)]">
        <p className="text-center text-xs sm:text-sm text-purple-300/80 tracking-wide">
          <span className="font-semibold text-purple-400">⚠️ Desktop Experience:</span>
          {" "}LIMINAL SIN is designed for desktop browsers. Tablet support is currently in testing. Mobile play is not yet supported.
        </p>
      </div>
      {/* ── END DESKTOP DISCLAIMER ─────────────────────────── */}

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="w-full backdrop-blur-md bg-[#140a36]/80 border-t border-hero-cyan-300/30 py-[var(--ls-footer-py)] px-[var(--ls-page-px)]">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Top row: copyright */}
          <div className="flex items-center justify-start text-cyan-50/70 text-sm">
            &copy; {new Date().getFullYear()} Mycelia Interactive. All rights reserved.
          </div>
          {/* Bottom row: placeholder for future disclaimers, privacy link, etc. */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-cyan-50/40 border-t border-purple-900/30 pt-4">
            <span>LIMINAL SIN&trade; is a work of interactive fiction. All characters and events are fictional.</span>
            <span className="hidden sm:inline text-purple-900/60">|</span>
            <a href="/privacy.html" className="hover:text-cyan-300 transition-colors">Privacy Policy</a>
            <span className="hidden sm:inline text-purple-900/60">|</span>
            <span className="text-purple-400/60">v0.1 — Early Access</span>
          </div>
        </div>
      </footer>
      {/* ── END FOOTER ───────────────────────────────────── */}

    </div>
  );
}
