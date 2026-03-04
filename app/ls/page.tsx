import Image from "next/image";

export default function LiminalSinLanding() {
  return (
    <main className="bg-hero-bg-dark min-h-screen text-white pb-20">
      {/* Cinematic Hero */}
      <div className="relative w-full h-[60vh] md:h-[75vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/Liminal_Sin_Title.jpg"
            alt="Liminal Sin Backdrop"
            fill
            className="object-cover opacity-40 mix-blend-luminosity duration-1000 animate-pulse"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-hero-bg-dark via-hero-bg-default/60 to-transparent"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto mt-20">
          <div className="mb-6 drop-shadow-[0_0_30px_rgba(255,0,50,0.4)]">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-widest uppercase">
              LIMINAL SIN
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-red-100/90 font-light mb-10 max-w-2xl mx-auto drop-shadow-md">
            An Interactive FMV Psychological Horror where your reality is
            fractured, and trust is the true illusion.
          </p>
          {/* eslint-disable-next-line react/no-unknown-property */}
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
              padding: 0.75rem 2.5rem;
              background: linear-gradient(135deg, rgba(126,34,206,0.55), rgba(168,85,247,0.45));
              border: 1px solid rgba(192,132,252,0.6);
              border-radius: 0.375rem;
              color: #fff;
              font-family: var(--font-geist-mono), 'Courier New', monospace;
              font-size: 0.875rem;
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
          <div className="flex gap-6">
            <a href="#signup">
              <button className="double-down-btn">DOUBLE DOWN</button>
            </a>
          </div>
        </div>
      </div>

      {/* The Pitch */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24 text-center space-y-8">
        <h2 className="text-3xl md:text-5xl font-bold text-hero-cyan-300 mb-8">
          Once you&apos;re in, will you ever get out?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left items-center">
          <div className="space-y-6 text-cyan-50/80 text-lg leading-relaxed">
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
          <div className="relative overflow-hidden rounded-xl border border-hero-magenta-500/30 p-2 shadow-[0_0_30px_rgba(139,44,245,0.2)]">
            <Image
              src="/assets/images/Liminal_Sin_Title.jpg"
              alt="Gameplay Sneak Peek"
              width={800}
              height={450}
              className="w-full h-auto rounded-lg rounded-xl opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </section>

      {/* Forms Section Stub (Step 4 placeholder) */}
      <section id="signup" className="max-w-4xl mx-auto px-6 py-12">
        <div className="border border-hero-cyan-500/20 bg-hero-bg-default/60 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl">
          <h3 className="text-2xl font-bold text-center mb-4">
            Initializing Connection Protocols...
          </h3>
          <p className="text-center text-cyan-100/50">
            Access terminals loading in next phase.
          </p>
        </div>
      </section>
    </main>
  );
}
