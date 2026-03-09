"use client";

import { useState, useRef } from "react";
import { GameWSProvider, useGameWS } from "./GameWSContext";
import GameHUD from "./GameHUD";
import { usePlayerMedia } from "./usePlayerMedia";

/**
 * Game UI Shell — /ls/game
 *
 * Dumb terminal. Sends player input, renders what the backend tells it.
 * All game logic lives in liminal-sin-gemini.
 *
 * Per TEAM_CONTRACT.md §2 and AGENTS.md §4:
 * This page must NEVER embed agent decisions, trust logic, or narrative state.
 */

function GameInner() {
  const [sessionActive, setSessionActive] = useState(false);
  const { connect } = useGameWS();
  // Single shared AudioContext for the whole session — passed to both GameHUD
  // (playback) and usePlayerMedia (mic capture) to avoid iOS's concurrent
  // AudioContext limit.
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Start media capture once the user explicitly starts the session
  usePlayerMedia(sessionActive, audioCtxRef);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* HUD overlays + FMV layer + audio playback */}
      <GameHUD sessionActive={sessionActive} audioCtxRef={audioCtxRef} />

      {/* ── Start prompt (shown before session begins) ─── */}
      {!sessionActive && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/90">
          <p
            className="text-xs tracking-[0.35em] uppercase"
            style={{
              color: "rgba(192,132,252,0.6)",
              fontFamily: "var(--font-geist-mono), 'Courier New', monospace",
            }}
          >
            Liminal Sin — Session Ready
          </p>
          <h1
            className="text-5xl md:text-7xl font-black text-white tracking-widest uppercase"
            style={{ textShadow: "0 0 30px rgba(255,0,50,0.4)" }}
          >
            ENTER
          </h1>
          <p className="text-sm text-gray-400 font-mono max-w-xs text-center leading-relaxed">
            Microphone and camera access required. You will be heard. You will
            be seen.
          </p>
          <button
            onClick={() => { connect(); setSessionActive(true); }}
            className="mt-4 px-10 py-4 rounded bg-gradient-to-r from-purple-800 to-purple-600 border border-purple-400/40 text-white font-mono font-bold tracking-[0.2em] uppercase text-sm hover:from-purple-700 hover:to-purple-500 transition-all duration-300"
          >
            Begin Session
          </button>
        </div>
      )}
    </div>
  );
}

export default function GamePage() {
  return (
    <GameWSProvider judgeMode={false}>
      <GameInner />
    </GameWSProvider>
  );
}
