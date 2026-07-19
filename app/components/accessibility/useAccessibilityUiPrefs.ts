"use client";

import { startTransition, useEffect, useState } from "react";
import {
  applyAccessibilityUiPrefsToDocument,
  DEFAULT_ACCESSIBILITY_UI_PREFS,
  MYCELIA_A11Y_PREFS_CHANGE_EVENT,
  readAccessibilityUiPrefs,
  writeAccessibilityUiPrefs,
  type AccessibilityUiPrefs,
} from "./accessibilityPreference";

function publish(prefs: AccessibilityUiPrefs) {
  writeAccessibilityUiPrefs(window.localStorage, prefs);
  applyAccessibilityUiPrefsToDocument(prefs);
  window.dispatchEvent(
    new CustomEvent(MYCELIA_A11Y_PREFS_CHANGE_EVENT, { detail: prefs }),
  );
}

/**
 * SSR-safe accessibility UI prefs (not reduce-motion — that stays on its own hook).
 * Defaults on first paint; hydrates from localStorage after mount.
 */
export function useAccessibilityUiPrefs(): {
  prefs: AccessibilityUiPrefs;
  prefsReady: boolean;
  updatePrefs: (patch: Partial<AccessibilityUiPrefs>) => void;
  resetUiPrefs: () => void;
} {
  const [prefs, setPrefs] = useState<AccessibilityUiPrefs>({
    ...DEFAULT_ACCESSIBILITY_UI_PREFS,
  });
  const [prefsReady, setPrefsReady] = useState(false);

  useEffect(() => {
    startTransition(() => {
      const next = readAccessibilityUiPrefs(window.localStorage);
      setPrefs(next);
      applyAccessibilityUiPrefsToDocument(next);
      setPrefsReady(true);
    });

    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<AccessibilityUiPrefs>).detail;
      if (!detail) return;
      startTransition(() => setPrefs(detail));
      applyAccessibilityUiPrefsToDocument(detail);
    };

    window.addEventListener(MYCELIA_A11Y_PREFS_CHANGE_EVENT, onChange);
    return () => {
      window.removeEventListener(MYCELIA_A11Y_PREFS_CHANGE_EVENT, onChange);
    };
  }, []);

  // Match useMyceliaReduceMotion: set local state, then publish (storage +
  // same-tab event) outside the updater. Publishing inside setPrefs(() => ...)
  // runs during React's update phase and makes peer listeners call setState on
  // SiteMotionShell while AccessibilityPanel is still rendering.
  const updatePrefs = (patch: Partial<AccessibilityUiPrefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    publish(next);
  };

  const resetUiPrefs = () => {
    const next = { ...DEFAULT_ACCESSIBILITY_UI_PREFS };
    setPrefs(next);
    publish(next);
  };

  return { prefs, prefsReady, updatePrefs, resetUiPrefs };
}
