"use client";

import type { ConnectionStatus } from "./GameWSContext";

export function StatusNotices({
  status,
  cameraObscuredVisible,
  webcamDenied,
  sessionActive,
  webcamDeniedVisible,
}: {
  status: ConnectionStatus;
  cameraObscuredVisible: boolean;
  webcamDenied: boolean;
  sessionActive: boolean;
  webcamDeniedVisible: boolean;
}) {
  return (
    <>
      {status !== "open" && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-1 rounded bg-black/70 border border-red-500/40 text-red-400 text-xs font-mono tracking-widest uppercase">
          {status === "connecting" && "Establishing Connection…"}
          {status === "closed" && "Signal Lost"}
          {status === "error" && "Connection Error — No Backend"}
        </div>
      )}

      {cameraObscuredVisible && !webcamDenied && sessionActive && (
        <div
          className="absolute top-16 left-1/2 -translate-x-1/2 z-[55] flex items-center gap-3 px-4 py-2 font-mono text-xs"
          style={{
            background: "rgba(10,10,10,0.9)",
            border: "1px solid rgba(220,38,38,0.5)",
            animation: "hint-fade-in-out 5s ease-in-out forwards",
          }}
        >
          <span className="text-red-400">⚠</span>
          <span className="text-red-300/80">
            Camera cannot see you — enabling camera gives a more immersive
            experience
          </span>
        </div>
      )}

      {webcamDeniedVisible && sessionActive && (
        <div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[55] px-4 py-2 font-mono text-[10px] tracking-widest uppercase"
          style={{
            background: "rgba(10,10,10,0.8)",
            border: "1px solid rgba(220,38,38,0.3)",
            color: "rgba(220,38,38,0.6)",
            animation: "hint-fade-in-out 8s ease-in-out forwards",
          }}
        >
          Camera access was not granted — the experience will continue with
          audio only
        </div>
      )}
    </>
  );
}
