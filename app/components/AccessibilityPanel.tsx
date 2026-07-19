"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useAccessibilityUiPrefs } from "@/app/components/accessibility/useAccessibilityUiPrefs";
import type { TextSizePref } from "@/app/components/accessibility/accessibilityPreference";
import { useMyceliaReduceMotion } from "@/app/components/motion/useMyceliaReduceMotion";

type AccessibilityPanelProps = {
  id: string;
  open: boolean;
  onClose: () => void;
  /** Element that toggles the panel — focus returns here on close. */
  triggerRef: RefObject<HTMLButtonElement | null>;
};

const TEXT_SIZES: { id: TextSizePref; label: string }[] = [
  { id: "sm", label: "S" },
  { id: "md", label: "M" },
  { id: "lg", label: "L" },
  { id: "xl", label: "XL" },
];

/**
 * Accessibility dialog: Reduce Motion, Pause atmosphere, text/contrast/font
 * prefs, and Reset. Theme stays in the header control (Part 2).
 */
export function AccessibilityPanel({
  id,
  open,
  onClose,
  triggerRef,
}: AccessibilityPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { reduceMotion, prefsReady: reduceReady, setReduceMotion } =
    useMyceliaReduceMotion();
  const { prefs, prefsReady: uiReady, updatePrefs, resetUiPrefs } =
    useAccessibilityUiPrefs();

  const prefsReady = reduceReady && uiReady;

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const trigger = triggerRef.current;
    const focusTarget =
      panel?.querySelector<HTMLElement>("input, button") ?? panel;
    focusTarget?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (panel?.contains(target)) return;
      if (trigger?.contains(target)) return;
      onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      trigger?.focus();
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  const resetAccessibility = () => {
    setReduceMotion(false);
    resetUiPrefs();
  };

  return (
    <div
      ref={panelRef}
      id={id}
      role="dialog"
      aria-modal="false"
      aria-label="Accessibility"
      className="absolute right-0 top-full z-[calc(var(--z-site-chrome)+1)] mt-2 w-[min(calc(100vw-2rem),22rem)] max-h-[min(70dvh,32rem)] overflow-y-auto rounded-xl border border-black/10 bg-white/95 p-4 shadow-lg backdrop-blur-xl pointer-events-auto"
      onWheel={(event) => event.stopPropagation()}
      onTouchMove={(event) => event.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 className="text-sm font-semibold tracking-wide text-studio-text uppercase">
          Accessibility
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center min-h-11 min-w-11 -mt-1 -mr-1 rounded-lg text-studio-text-muted hover:text-studio-text transition-colors"
          aria-label="Close accessibility panel"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <p className="text-xs text-studio-text-muted mb-3 leading-relaxed">
        Preferences apply on this device and are saved in your browser.
      </p>

      <div className="flex flex-col gap-1">
        <PrefToggle
          checked={reduceMotion}
          disabled={!prefsReady}
          onChange={setReduceMotion}
          title="Reduce motion"
          description="Limit animation and use a static background instead of the motion atmosphere."
        />

        <PrefToggle
          checked={prefs.pauseAtmosphere}
          disabled={!prefsReady}
          onChange={(next) => updatePrefs({ pauseAtmosphere: next })}
          title="Pause background"
          description="Stop the WebGL atmosphere and video decode; resume from the same renderer without remounting."
        />

        <div className="py-2">
          <p className="text-sm font-medium text-studio-text mb-2">Text size</p>
          <div
            className="inline-flex min-h-11 items-stretch rounded-lg border border-black/10 bg-white/70 p-0.5"
            role="radiogroup"
            aria-label="Text size"
          >
            {TEXT_SIZES.map((option) => {
              const selected = prefs.textSize === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={!prefsReady}
                  onClick={() => updatePrefs({ textSize: option.id })}
                  className={
                    selected
                      ? "inline-flex items-center justify-center min-h-10 min-w-10 px-2.5 rounded-md text-xs font-semibold text-studio-text bg-white shadow-sm"
                      : "inline-flex items-center justify-center min-h-10 min-w-10 px-2.5 rounded-md text-xs font-semibold text-studio-text-muted hover:text-studio-text"
                  }
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <PrefToggle
          checked={prefs.highContrast}
          disabled={!prefsReady}
          onChange={(next) => updatePrefs({ highContrast: next })}
          title="High contrast"
          description="Strengthen text and glass borders for clearer reading over the atmosphere."
        />

        <PrefToggle
          checked={prefs.dyslexiaFont}
          disabled={!prefsReady}
          onChange={(next) => updatePrefs({ dyslexiaFont: next })}
          title="Dyslexia-friendly font"
          description="Use Atkinson Hyperlegible for body text sitewide."
        />

        <PrefToggle
          checked={prefs.emphasizeLinks}
          disabled={!prefsReady}
          onChange={(next) => updatePrefs({ emphasizeLinks: next })}
          title="Underline links"
          description="Make links and interactive controls more visually distinct."
        />

        <PrefToggle
          checked={prefs.relaxedSpacing}
          disabled={!prefsReady}
          onChange={(next) => updatePrefs({ relaxedSpacing: next })}
          title="Relaxed spacing"
          description="Increase line height and letter spacing for easier reading."
        />
      </div>

      <div className="mt-4 pt-3 border-t border-black/8">
        <button
          type="button"
          onClick={resetAccessibility}
          disabled={!prefsReady}
          className="inline-flex items-center justify-center min-h-11 w-full rounded-lg border border-black/10 bg-white/70 px-3 text-sm font-medium text-studio-text hover:bg-white transition-colors disabled:opacity-50"
        >
          Reset accessibility settings
        </button>
      </div>
    </div>
  );
}

function PrefToggle({
  checked,
  disabled,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  disabled: boolean;
  onChange: (next: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <label className="flex items-start gap-3 min-h-11 py-2 cursor-pointer">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-[var(--studio-accent)] cursor-pointer"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-studio-text">
          {title}
        </span>
        <span className="block text-xs text-studio-text-muted mt-0.5 leading-relaxed">
          {description}
        </span>
      </span>
    </label>
  );
}
