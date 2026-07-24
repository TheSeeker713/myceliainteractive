"use client";

import { useAccessibilityUiPrefs } from "@/app/components/accessibility/useAccessibilityUiPrefs";
import type { TextSizePref } from "@/app/components/accessibility/accessibilityPreference";
import { useMyceliaReduceMotion } from "@/app/components/motion/useMyceliaReduceMotion";

const TEXT_SIZES: { id: TextSizePref; label: string }[] = [
  { id: "sm", label: "S" },
  { id: "md", label: "M" },
  { id: "lg", label: "L" },
  { id: "xl", label: "XL" },
];

/**
 * Shared accessibility toggles + reset. Used by the desktop popover shell and
 * the mobile bottom sheet — one prefs source, no duplicated toggle state.
 */
export function AccessibilityPanelBody() {
  const { reduceMotion, prefsReady: reduceReady, setReduceMotion } =
    useMyceliaReduceMotion();
  const { prefs, prefsReady: uiReady, updatePrefs, resetUiPrefs } =
    useAccessibilityUiPrefs();

  const prefsReady = reduceReady && uiReady;

  const resetAccessibility = () => {
    setReduceMotion(false);
    resetUiPrefs();
  };

  return (
    <>
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
            onKeyDown={(event) => {
              if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
                return;
              }
              event.preventDefault();
              const idx = TEXT_SIZES.findIndex((o) => o.id === prefs.textSize);
              const delta = event.key === "ArrowRight" ? 1 : -1;
              const next =
                TEXT_SIZES[(idx + delta + TEXT_SIZES.length) % TEXT_SIZES.length];
              updatePrefs({ textSize: next.id });
            }}
          >
            {TEXT_SIZES.map((option) => {
              const selected = prefs.textSize === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  tabIndex={selected ? 0 : -1}
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
    </>
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
