"use client";

import { useState } from "react";
import { GameWSProvider, useGameWS } from "../../game/GameWSContext";
import GameHUD from "../../game/GameHUD";
import { usePlayerMedia } from "../../game/usePlayerMedia";

/**
 * Judge Game Shell — /ls/judges/game
 *
 * Identical to /ls/game but sends judge_mode: true in the session_start event.
 * The backend uses this flag to adjust scoring/observation behaviour.
 *
 * Per TEAM_CONTRACT.md §3: session_start payload includes { judge_mode: boolean }
 */

function JudgeGameInner() {
  const [sessionActive, setSessionActive] = useState(false);
  const { connect } = useGameWS();

  usePlayerMedia(sessionActive);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      <GameHUD sessionActive={sessionActive} />

      {!sessionActive && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/90">
          <p
            className="text-xs tracking-[0.35em] uppercase"
            style={{
              color: "rgba(192,132,252,0.6)",
              fontFamily: "var(--font-geist-mono), 'Courier New', monospace",
            }}
          >
            Liminal Sin — Judge Access — Session Ready
          </p>
          <h1
            className="text-5xl md:text-7xl font-black text-white tracking-widest uppercase"
            style={{ textShadow: "0 0 30px rgba(255,0,50,0.4)" }}
          >
            ENTER
          </h1>
          <p className="text-sm text-purple-300/60 font-mono max-w-xs text-center leading-relaxed">
            Judge mode active. Microphone and camera access required.
          </p>
          <button
            onClick={() => { connect(); setSessionActive(true); }}
            className="mt-4 px-10 py-4 rounded bg-gradient-to-r from-purple-800 to-purple-600 border border-purple-400/40 text-white font-mono font-bold tracking-[0.2em] uppercase text-sm hover:from-purple-700 hover:to-purple-500 transition-all duration-300"
          >
            Begin Judge Session
          </button>
        </div>
      )}
    </div>
  );
}

export default function JudgeGamePage() {
  return (
    <GameWSProvider judgeMode={true}>
      <JudgeGameInner />
    </GameWSProvider>
  );
}
