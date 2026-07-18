"use client";

const EXPERIENCE_BULLETS = [
  "Speak naturally: your voice is the primary mechanic; no menus or controllers",
  "Characters perceive your webcam and vocal cadence through a live Game Master",
  "Trust and fear metrics shift agent behavior in real time across three characters",
  "Generative liminal environments rebuild with Imagen 4 stills and Veo video loops",
  "Break the fourth wall: consequences persist; the simulation can destabilize",
] as const;

export function LiminalSinExperienceContent() {
  return (
    <>
      <h2 className="liquid-glass-title font-semibold text-studio-text normal-case tracking-normal mb-3">
        What You&apos;ll Experience
      </h2>
      <p className="liquid-glass-body text-studio-text-muted max-w-2xl mb-8 leading-relaxed">
        A gated vertical slice of Act 1: a psychological trust-driven narrative
        where your presence shapes every exchange.
      </p>
      <ul className="grid grid-cols-1 gap-3 max-w-4xl list-none p-0 m-0">
        {EXPERIENCE_BULLETS.map((bullet) => (
          <li
            key={bullet}
            className="flex gap-3 text-sm text-studio-text-muted leading-relaxed rounded-xl border border-black/8 bg-white/30 p-4"
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-studio-accent"
              aria-hidden
            />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
