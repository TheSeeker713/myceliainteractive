import Image from "next/image";

export function LiminalSinHero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
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
          content: '[ LOCKED ]';
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

      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/Liminal_Sin_Title.jpg"
          alt="Liminal Sin Backdrop"
          fill
          className="object-cover opacity-40 mix-blend-luminosity duration-1000 animate-pulse"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[30%] to-[#08041a]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08041a] via-transparent to-transparent" />
      </div>

      <div className="absolute top-[18vh] left-1/2 -translate-x-1/2 z-10 text-center w-full px-4">
        <h1
          className="glitch-effect text-6xl md:text-8xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_30px_rgba(255,0,50,0.4)]"
          data-text="LIMINAL SIN"
        >
          LIMINAL SIN
        </h1>
      </div>

      <div className="absolute top-[42vh] left-1/2 -translate-x-1/2 z-20 w-[calc(100%-2rem)] max-w-[620px] px-10 py-9 bg-black/65 backdrop-blur-md border border-[#8b00ff]/40 rounded-2xl shadow-[0_0_40px_rgba(139,0,255,0.25)] text-center">
        <p className="text-xl md:text-2xl text-red-100/90 font-light drop-shadow-md">
          An Interactive FMV Psychological Horror unlike anything you&apos;ve
          experienced before. A Gemini Live AI that watches, listens, and
          responds &mdash; in real time. The line between reality and illusion
          disappears the instant you Enter.
        </p>
      </div>

      <div className="absolute top-[62vh] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4">
        <a href="#content">
          <button className="double-down-btn">[ LOCKED ]</button>
        </a>
        <p className="text-sm sm:text-base font-mono tracking-[0.18em] uppercase text-purple-300/80 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
          Prototype available &mdash; March 16th
        </p>
      </div>

      <div className="absolute bottom-[12vh] left-1/2 -translate-x-1/2 z-10 w-full px-4 text-center">
        <p className="text-xl sm:text-2xl md:text-3xl font-light text-cyan-400 tracking-widest drop-shadow-[0_0_14px_rgba(0,199,255,0.7)]">
          Once you&apos;re in, will you ever get out?
        </p>
      </div>
    </section>
  );
}
