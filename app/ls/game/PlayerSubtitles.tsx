"use client";

import { usePlayerSubtitles } from "./usePlayerSubtitles";

/**
 * PlayerSubtitles — Cinematic live speech subtitles.
 *
 * Renders at bottom-center of the viewport with a semi-transparent backdrop.
 * Fades in when the user speaks and out ~2 s after they stop.
 * z-index sits above video but below card/end overlays (those are z-40+).
 */
export function PlayerSubtitles({ active }: { active: boolean }) {
  const { transcript, visible } = usePlayerSubtitles(active);

  if (!transcript) return null;

  return (
    <div
      className="absolute bottom-[8%] left-1/2 -translate-x-1/2 z-30 pointer-events-none max-w-[80%] transition-opacity duration-500 ease-in-out"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <p
        className="px-6 py-3 rounded-md text-center text-base sm:text-lg md:text-xl font-medium tracking-wide text-white/90 leading-relaxed"
        style={{
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          textShadow: "0 1px 4px rgba(0,0,0,0.8)",
          fontFamily: "var(--font-geist-sans), 'Helvetica Neue', sans-serif",
        }}
      >
        {transcript}
      </p>
    </div>
  );
}
