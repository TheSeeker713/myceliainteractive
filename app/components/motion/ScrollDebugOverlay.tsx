"use client";

import { useSyncExternalStore } from "react";
import type { ScrollStageState } from "./ScrollStageContext";
import { useScrollStage } from "./ScrollStageContext";

type ScrollDebugOverlayProps = {
  stage?: ScrollStageState | null;
};

function subscribeNoop() {
  return () => {};
}

function getDebugScrollEnabled() {
  return new URLSearchParams(window.location.search).get("debugScroll") === "1";
}

export function ScrollDebugOverlay({ stage }: ScrollDebugOverlayProps) {
  const contextStage = useScrollStage();
  const resolvedStage = stage ?? contextStage;
  const enabled = useSyncExternalStore(
    subscribeNoop,
    getDebugScrollEnabled,
    () => false,
  );

  if (!enabled || !resolvedStage) return null;

  const { sectionIndex, localT, fade, sectionCount, scrollProgress } =
    resolvedStage;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] rounded-lg bg-black/80 text-white text-xs font-mono p-3 pointer-events-none max-w-xs">
      <p>scroll: {scrollProgress.toFixed(3)}</p>
      <p>
        section: {sectionIndex + 1}/{sectionCount} t={localT.toFixed(3)}
      </p>
      <p>phase: {fade.phase}</p>
      <p>
        out={fade.outgoing.toFixed(2)} in={fade.incoming.toFixed(2)}
      </p>
      <p>transitioning: {fade.isTransitioning ? "yes" : "no"}</p>
    </div>
  );
}
