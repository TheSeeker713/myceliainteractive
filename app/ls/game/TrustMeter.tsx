"use client";

export function TrustMeter({
  active,
  trustLevel,
  fearIndex,
  agentLabel = "jason",
}: {
  active: boolean;
  trustLevel: number;
  fearIndex: number;
  agentLabel?: string;
}) {
  if (!active) return null;

  return (
    <div
      className="absolute bottom-6 right-6 z-[var(--z-game-hud-widget)] font-mono text-xs text-purple-300/80 flex flex-col items-end gap-1"
      style={{ animation: "trust-meter-pulse 5s ease-in-out infinite" }}
    >
      <span className="tracking-widest uppercase text-[10px] text-purple-400/50">
        {agentLabel}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-purple-200">TRUST</span>
        <div className="w-24 h-1 bg-purple-900/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-400 transition-all duration-700"
            style={{ width: `${Math.max(0, Math.min(1, trustLevel)) * 100}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-red-300">FEAR</span>
        <div className="w-24 h-1 bg-red-900/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500 transition-all duration-700"
            style={{ width: `${Math.max(0, Math.min(1, fearIndex)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
