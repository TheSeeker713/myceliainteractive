export default function JudgesAccess() {
  const gameUrl = process.env.NEXT_PUBLIC_GAME_URL ?? "#";

  return (
    <div className="bg-[#08041a] min-h-screen text-white flex flex-col items-center justify-center relative overflow-hidden">

      {/* ── STYLES ─────────────────────────────────────────── */}
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
        @keyframes scanline {
          0%   { background-position: 0 0; }
          100% { background-position: 0 100vh; }
        }
        .judge-btn {
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
          text-decoration: none;
          transition: background 0.25s ease, letter-spacing 0.15s ease;
        }
        .judge-btn:hover {
          background: linear-gradient(135deg, rgba(126,34,206,0.8), rgba(168,85,247,0.7));
          letter-spacing: 0.2em;
        }
      `}</style>

      {/* ── SCANLINE OVERLAY ───────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)",
          animation: "scanline 8s linear infinite",
        }}
      />

      {/* ── RADIAL GLOW ────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(126,34,206,0.18) 0%, transparent 70%)",
        }}
      />

      {/* ── CONTENT ────────────────────────────────────────── */}
      <div className="relative z-20 flex flex-col items-center gap-8 px-6 text-center max-w-lg">

        {/* Label */}
        <p
          className="text-xs tracking-[0.35em] uppercase"
          style={{ color: "rgba(192,132,252,0.6)", fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
        >
          Gemini Live Agent Challenge — Judge Access
        </p>

        {/* Signal header */}
        <h1
          className="text-4xl font-black tracking-widest uppercase"
          style={{
            fontFamily: "var(--font-geist-mono), 'Courier New', monospace",
            textShadow: "0 0 18px #a855f7, 0 0 36px #7e22ce",
            color: "#e9d5ff",
          }}
        >
          SIGNAL AUTHORIZED
        </h1>

        {/* Separator */}
        <div
          className="w-24 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(192,132,252,0.6), transparent)" }}
        />

        {/* Flavor text */}
        <p
          className="text-sm leading-relaxed"
          style={{ color: "rgba(196,181,253,0.65)", fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
        >
          You are cleared for direct entry.
          <br />
          No queue. No signup. The underground is waiting.
          <br />
          <span style={{ color: "rgba(192,132,252,0.4)" }}>Allow mic + webcam when prompted.</span>
        </p>

        {/* CTA */}
        <a href={gameUrl} className="judge-btn" rel="noopener noreferrer">
          Enter the Underground
        </a>

        {/* Footer note */}
        <p
          className="text-xs mt-4"
          style={{ color: "rgba(139,92,246,0.35)", fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
        >
          Liminal Sin — Mycelia Interactive — 2026
        </p>

      </div>
    </div>
  );
}
