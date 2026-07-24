"use client";

import { useEffect, useId, useSyncExternalStore } from "react";
import {
  applyThemeToDocument,
  isThemeChoice,
  MYCELIA_THEME_STORAGE_KEY,
  type ThemeChoice,
  writeStoredThemeChoice,
} from "@/app/theme/themePreference";

const OPTIONS: { id: ThemeChoice; label: string; shortLabel: string }[] = [
  { id: "system", label: "System", shortLabel: "Auto" },
  { id: "light", label: "Lightside", shortLabel: "Light" },
  { id: "dark", label: "Darkside", shortLabel: "Dark" },
];

const listeners = new Set<() => void>();

function emitThemeChange() {
  for (const listener of listeners) listener();
}

function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === MYCELIA_THEME_STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getThemeSnapshot(): ThemeChoice {
  try {
    const raw = window.localStorage.getItem(MYCELIA_THEME_STORAGE_KEY);
    if (isThemeChoice(raw)) return raw;
  } catch {
    /* ignore */
  }
  return "light";
}

function getServerThemeSnapshot(): ThemeChoice {
  return "light";
}

/**
 * Three-state theme radiogroup for the sticky header utility cluster.
 * Shared by mobile and desktop chrome (no separate mobile chrome logic).
 */
export function ThemeToggle() {
  const labelId = useId();
  const choice = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    applyThemeToDocument(choice);
    if (choice !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyThemeToDocument("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [choice]);

  const select = (next: ThemeChoice) => {
    writeStoredThemeChoice(next);
    applyThemeToDocument(next);
    emitThemeChange();
  };

  return (
    <div
      className="site-header-theme-cluster inline-flex min-h-11 items-stretch rounded-lg border border-[color:var(--theme-chrome-border)] bg-[color:var(--theme-utility-bg)] p-0.5 pointer-events-auto"
      role="radiogroup"
      aria-labelledby={labelId}
    >
      <span id={labelId} className="sr-only">
        Theme
      </span>
      {OPTIONS.map((option) => {
        const selected = choice === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => select(option.id)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
                return;
              }
              event.preventDefault();
              const idx = OPTIONS.findIndex((o) => o.id === choice);
              const delta = event.key === "ArrowRight" ? 1 : -1;
              const next =
                OPTIONS[(idx + delta + OPTIONS.length) % OPTIONS.length];
              select(next.id);
            }}
            className={
              selected
                ? "inline-flex items-center justify-center min-h-10 px-2 sm:px-2.5 rounded-md text-[0.65rem] sm:text-xs font-semibold tracking-wide text-studio-text bg-[color:var(--theme-utility-bg-active)] shadow-sm"
                : "inline-flex items-center justify-center min-h-10 px-2 sm:px-2.5 rounded-md text-[0.65rem] sm:text-xs font-semibold tracking-wide text-studio-text-muted hover:text-studio-text"
            }
            aria-label={`Theme: ${option.label}`}
          >
            <span className="md:hidden">{option.shortLabel}</span>
            <span className="hidden md:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
