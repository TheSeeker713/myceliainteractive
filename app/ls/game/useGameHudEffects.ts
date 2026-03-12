"use client";

import { useRef } from "react";
import { useGameHudGeneralEffects } from "./useGameHudGeneralEffects";
import { useGameHudScenarioEffects } from "./useGameHudScenarioEffects";
import type { UseGameHudEffectsArgs } from "./useGameHudEffectTypes";

export function useGameHudEffects(args: UseGameHudEffectsArgs) {
  const dreadIntervalRefs = useRef<ReturnType<typeof setInterval>[]>([]);
  const dreadTimeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearDreadTimers = () => {
    for (const id of dreadIntervalRefs.current) clearInterval(id);
    for (const id of dreadTimeoutRefs.current) clearTimeout(id);
    dreadIntervalRefs.current = [];
    dreadTimeoutRefs.current = [];
  };

  useGameHudGeneralEffects(args);
  useGameHudScenarioEffects(args, {
    dreadIntervalRefs,
    dreadTimeoutRefs,
    clearDreadTimers,
  });
}
