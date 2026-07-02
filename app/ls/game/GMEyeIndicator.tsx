"use client";

export function GMEyeIndicator({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute top-5 right-5 z-[var(--z-game-hud-widget)]"
      style={{ animation: "gm-eye-breathe 3.5s ease-in-out infinite" }}
    >
      <svg
        width="44"
        height="28"
        viewBox="0 0 44 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 14C2 14 10 2 22 2C34 2 42 14 42 14C42 14 34 26 22 26C10 26 2 14 2 14Z"
          stroke="var(--color-game-danger)"
          strokeWidth="1.5"
          fill="rgba(220, 38, 38, 0.08)"
        />
        <circle cx="22" cy="14" r="7" fill="#991b1b" />
        <circle
          cx="22"
          cy="14"
          r="5"
          fill="var(--color-game-danger)"
          style={{
            animation: "gm-eye-iris-pulse 3.5s ease-in-out infinite",
          }}
        />
        <circle cx="22" cy="14" r="2.5" fill="var(--color-game-danger-surface)" />
        <circle cx="19" cy="11.5" r="1" fill="rgba(255,255,255,0.5)" />
      </svg>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          filter: "blur(8px)",
          background:
            "radial-gradient(circle, rgba(220,38,38,0.4) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
