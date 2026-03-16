"use client";

/**
 * GamePageShell — Minimal header + footer chrome for /ls/game and /ls/judges/game.
 *
 * Overlays on top of the full-screen game area so the game fills the viewport.
 * Header auto-hides after 4 s of inactivity and reappears on mouse move or tap
 * (so it doesn't distract during gameplay).  Footer stays anchored at the bottom.
 */
import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export function GamePageShell({ children }: { children: React.ReactNode }) {
  const [headerVisible, setHeaderVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setHeaderVisible(false), 4000);
  }, []);

  useEffect(() => {
    scheduleHide();
    const show = () => {
      setHeaderVisible(true);
      scheduleHide();
    };
    window.addEventListener("mousemove", show);
    window.addEventListener("touchstart", show);
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      window.removeEventListener("mousemove", show);
      window.removeEventListener("touchstart", show);
    };
  }, [scheduleHide]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* ── Game content fills the whole viewport ── */}
      {children}

      {/* ── Header bar ── */}
      <header
        className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 py-2 bg-black/60 backdrop-blur-sm border-b border-purple-900/30 transition-opacity duration-500"
        style={{ opacity: headerVisible ? 1 : 0, pointerEvents: headerVisible ? "auto" : "none" }}
      >
        <Link href="/ls" aria-label="Return to Liminal Sin landing">
          <Image
            src="/assets/images/Mycelia Interactive Banner.png"
            alt="Mycelia Interactive"
            width={200}
            height={56}
            className="h-7 w-auto object-contain rounded"
          />
        </Link>
        <div className="flex items-center gap-4 text-xs text-purple-300/60 tracking-widest uppercase font-mono">
          <span>Liminal Sin</span>
        </div>
      </header>

      {/* ── Footer bar ── */}
      <footer className="fixed bottom-0 left-0 right-0 z-[60] flex flex-wrap items-center justify-between px-4 py-1.5 bg-black/60 backdrop-blur-sm border-t border-purple-900/30 text-[10px] text-purple-300/50 tracking-wide font-mono">
        <span>&copy; {new Date().getFullYear()} Mycelia Interactive</span>
        <span className="uppercase">Prototype &mdash; Not Final</span>
      </footer>
    </div>
  );
}
