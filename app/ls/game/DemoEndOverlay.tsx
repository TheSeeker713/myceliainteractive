"use client";

export function DemoEndOverlay({
  endOverlayVisible,
  mode,
  showPlayAgain,
  onPlayAgain,
  onStopMedia,
}: {
  endOverlayVisible: boolean;
  mode: "complete" | "game_over" | "good_ending";
  showPlayAgain?: boolean;
  onPlayAgain?: () => void;
  onStopMedia?: () => void;
}) {
  if (!endOverlayVisible) return null;

  const title = mode === "game_over" ? "GAME OVER" : "LIMINAL SIN";
  const subtitle =
    mode === "game_over"
      ? "thank you for playing liminal sin"
      : mode === "good_ending"
        ? "you made it out"
        : "experience complete";

  return (
    <div
      className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/80"
      style={{ animation: "demo-end-fade-in 1.5s ease-in forwards" }}
    >
      <h1
        className="text-5xl md:text-7xl font-black text-white tracking-[0.3em] uppercase mb-6"
        style={{
          textShadow:
            "0 0 40px rgba(220,38,38,0.5), 0 0 80px rgba(139,44,245,0.3)",
        }}
      >
        {title}
      </h1>
      <p
        className="font-mono text-sm tracking-[0.4em] uppercase"
        style={{ color: "rgba(192,132,252,0.7)" }}
      >
        {subtitle}
      </p>
      {showPlayAgain && onPlayAgain && (
        <button
          onClick={onPlayAgain}
          className="mt-6 px-6 py-2 font-mono text-xs tracking-[0.25em] uppercase border border-red-500/40 text-red-300/80 hover:text-red-200 hover:border-red-300 transition-colors duration-300"
        >
          Play Again
        </button>
      )}
      <button
        onClick={() => {
          onStopMedia?.();
        }}
        className="mt-8 px-6 py-2 font-mono text-xs tracking-[0.25em] uppercase border border-purple-500/40 text-purple-400/70 hover:text-purple-300 hover:border-purple-400 transition-colors duration-300"
      >
        Stop Camera &amp; Microphone
      </button>
    </div>
  );
}
