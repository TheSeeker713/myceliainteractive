"use client";

import { useEffect, useRef } from "react";
import type { ServerEvent, TrustUpdateEvent } from "./GameWSContext";
import type { MusicTier } from "./audioManifest";

export function useTrustAudioEffects({
  lastEvent,
  playSFX,
  crossfadeMusic,
}: {
  lastEvent: ServerEvent | null;
  playSFX: (key: string, volumeScale?: number) => void;
  crossfadeMusic: (key: MusicTier, durationMs?: number) => void;
}) {
  const prevTrustRef = useRef<number>(0.5);
  const prevFearRef = useRef<number>(0.0);
  const fearThresholdsCrossedRef = useRef<Set<number>>(new Set());
  const trustKnowledgeFiredRef = useRef(false);

  useEffect(() => {
    if (lastEvent?.type !== "trust_update") return;
    const ev = lastEvent as TrustUpdateEvent;
    const { trust_level, fear_index } = ev;
    const prevTrust = prevTrustRef.current;
    const prevFear = prevFearRef.current;

    if (trust_level < prevTrust) {
      playSFX("trust_drop");
    }
    if (
      trust_level >= 0.6 &&
      prevTrust < 0.6 &&
      !trustKnowledgeFiredRef.current
    ) {
      trustKnowledgeFiredRef.current = true;
      playSFX("knowledge_unlock");
    }
    if (trust_level < 0.5) trustKnowledgeFiredRef.current = false;

    if (fear_index - prevFear > 0.1) {
      playSFX("fear_spike");
    }
    if (fear_index >= 0.6 && !fearThresholdsCrossedRef.current.has(0.6)) {
      fearThresholdsCrossedRef.current.add(0.6);
      crossfadeMusic("music_tension", 3000);
    }
    if (fear_index >= 0.85 && !fearThresholdsCrossedRef.current.has(0.85)) {
      fearThresholdsCrossedRef.current.add(0.85);
      crossfadeMusic("music_climax", 2000);
    }
    if (fear_index >= 0.9 && !fearThresholdsCrossedRef.current.has(0.9)) {
      fearThresholdsCrossedRef.current.add(0.9);
      playSFX("fear_critical");
    }

    prevTrustRef.current = trust_level;
    prevFearRef.current = fear_index;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent]);
}
