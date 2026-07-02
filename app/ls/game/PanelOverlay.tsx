"use client";

import { useCallback, useState } from "react";

/**
 * PanelOverlay — Floating interactive panel SVG that provides a deterministic
 * click-based fallback for the voice keyword "panel" during the hallway_pov_02
 * acecard sequence. Appears with a pulsing glow and a fading hint text.
 *
 * Two ways to trigger the acecard reveal:
 * 1. Voice keyword detection (existing) — panel disappears via acecard_reveal_start
 * 2. Clicking this SVG — sends panel_clicked WS event, immediately animates out
 */
export function PanelOverlay({
  visible,
  onPanelClick,
}: {
  visible: boolean;
  onPanelClick: () => void;
}) {
  const [clicked, setClicked] = useState(false);

  const handleClick = useCallback(() => {
    if (clicked) return;
    setClicked(true);
    onPanelClick();
  }, [clicked, onPanelClick]);

  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 z-[var(--z-game-panel)] pointer-events-none"
      style={{
        opacity: clicked ? 0 : 1,
        transition: "opacity 0.4s ease-out",
      }}
    >
      {/* Floating panel SVG — bottom-right area of screen */}
      <button
        onClick={handleClick}
        aria-label="Open hidden panel"
        className="pointer-events-auto absolute"
        style={{
          bottom: "18%",
          right: "12%",
          width: "clamp(80px, 12vw, 140px)",
          height: "clamp(100px, 16vw, 180px)",
          cursor: "pointer",
          animation: "panel-float 3s ease-in-out infinite, panel-glow-pulse 2s ease-in-out infinite",
          filter: "drop-shadow(0 0 12px rgba(139,92,246,0.6))",
          background: "none",
          border: "none",
          padding: 0,
        }}
      >
        <svg
          viewBox="0 0 100 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%" }}
        >
          {/* Panel body */}
          <rect
            x="5" y="5" width="90" height="120" rx="4"
            fill="rgba(30,20,50,0.85)"
            stroke="rgba(139,92,246,0.7)"
            strokeWidth="2"
          />
          {/* Horizontal seam lines */}
          <line x1="10" y1="35" x2="90" y2="35" stroke="rgba(139,92,246,0.3)" strokeWidth="1" />
          <line x1="10" y1="65" x2="90" y2="65" stroke="rgba(139,92,246,0.3)" strokeWidth="1" />
          <line x1="10" y1="95" x2="90" y2="95" stroke="rgba(139,92,246,0.3)" strokeWidth="1" />
          {/* Vertical seam */}
          <line x1="50" y1="10" x2="50" y2="120" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
          {/* Screws/rivets */}
          <circle cx="15" cy="15" r="3" fill="rgba(139,92,246,0.5)" />
          <circle cx="85" cy="15" r="3" fill="rgba(139,92,246,0.5)" />
          <circle cx="15" cy="115" r="3" fill="rgba(139,92,246,0.5)" />
          <circle cx="85" cy="115" r="3" fill="rgba(139,92,246,0.5)" />
          {/* Center keyhole / latch */}
          <rect x="44" y="60" width="12" height="20" rx="2" fill="rgba(139,92,246,0.4)" stroke="rgba(200,170,255,0.6)" strokeWidth="1" />
          <circle cx="50" cy="67" r="3" fill="rgba(200,170,255,0.7)" />
        </svg>
      </button>

      {/* Hint text — fades in and out below the panel */}
      <div
        className="absolute pointer-events-none text-center"
        style={{
          bottom: "10%",
          right: "4%",
          width: "clamp(120px, 18vw, 220px)",
          animation: "panel-hint-pulse 4s ease-in-out infinite",
        }}
      >
        <p
          className="font-mono text-xs tracking-[0.25em] uppercase"
          style={{
            color: "rgba(192,132,252,0.8)",
            textShadow: "0 0 10px rgba(139,44,245,0.5)",
          }}
        >
          click panel
        </p>
      </div>
    </div>
  );
}
