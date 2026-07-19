"use client";

import { startTransition, useEffect, useState } from "react";
import {
  MYCELIA_REDUCE_MOTION_CHANGE_EVENT,
  MYCELIA_REDUCE_MOTION_KEY,
  readMyceliaReduceMotion,
  writeMyceliaReduceMotion,
  type MyceliaReduceMotionChangeDetail,
} from "./reduceMotionPreference";

/**
 * SSR-safe reduce-motion opt-in. Always false on first paint; hydrates from
 * localStorage after mount (never OS prefers-reduced-motion).
 * Syncs across hook instances in the same tab via a custom event.
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

    const apply = (next: boolean) => {
      startTransition(() => setReduceMotionState(next));
    };

    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<MyceliaReduceMotionChangeDetail>)
        .detail;
      if (detail && typeof detail.reduceMotion === "boolean") {
        apply(detail.reduceMotion);
      }
    };

    const onStorage = (event: StorageEvent) => {
      if (
        event.key !== MYCELIA_REDUCE_MOTION_KEY &&
        event.key !== null
      ) {
        return;
      }
      apply(readMyceliaReduceMotion(window.localStorage));
    };

    window.addEventListener(MYCELIA_REDUCE_MOTION_CHANGE_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(MYCELIA_REDUCE_MOTION_CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setReduceMotion = (next: boolean) => {
    setReduceMotionState(next);
    writeMyceliaReduceMotion(window.localStorage, next);
    window.dispatchEvent(
      new CustomEvent<MyceliaReduceMotionChangeDetail>(
        MYCELIA_REDUCE_MOTION_CHANGE_EVENT,
        { detail: { reduceMotion: next } },
      ),
    );
  };

  return { reduceMotion, prefsReady, setReduceMotion };
}
