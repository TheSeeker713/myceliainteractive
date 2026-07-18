"use client";

import { startTransition, useEffect, useState } from "react";
import {
  readMyceliaReduceMotion,
  writeMyceliaReduceMotion,
} from "./reduceMotionPreference";

/**
 * SSR-safe reduce-motion opt-in. Always false on first paint; hydrates from
 * localStorage after mount (never OS prefers-reduced-motion).
 */
export function useMyceliaReduceMotion(): {
  reduceMotion: boolean;
  prefsReady: boolean;
  setReduceMotion: (next: boolean) => void;
} {
  const [reduceMotion, setReduceMotionState] = useState(false);
  const [prefsReady, setPrefsReady] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setReduceMotionState(readMyceliaReduceMotion(window.localStorage));
      setPrefsReady(true);
    });
  }, []);

  const setReduceMotion = (next: boolean) => {
    setReduceMotionState(next);
    writeMyceliaReduceMotion(window.localStorage, next);
  };

  return { reduceMotion, prefsReady, setReduceMotion };
}
