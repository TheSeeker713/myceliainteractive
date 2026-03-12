"use client";

import type { TrustUpdateEvent } from "./GameWSContext";

export function TrustMeter({
  trustEvent,
}: {
  trustEvent: TrustUpdateEvent | null;
}) {
  if (!trustEvent) return null;

  return (
    <div className="absolute bottom-6 right-6 z-40 font-mono text-xs text-purple-300/80 flex flex-col items-end gap-1">
      <span className="tracking-widest uppercase text-[10px] text-purple-400/50">
        {trustEvent.agent}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-purple-200">TRUST</span>
        <div className="w-24 h-1 bg-purple-900/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-400 transition-all duration-700"
            style={{ width: `${trustEvent.trust_level * 100}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-red-300">FEAR</span>
        <div className="w-24 h-1 bg-red-900/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500 transition-all duration-700"
            style={{ width: `${trustEvent.fear_index * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
