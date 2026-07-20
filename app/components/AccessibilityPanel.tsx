"use client";

import { useEffect, useRef, type RefObject } from "react";
import { AccessibilityPanelBody } from "@/app/components/accessibility/AccessibilityPanelBody";

type AccessibilityPanelProps = {
  id: string;
  open: boolean;
  onClose: () => void;
  /** Element that toggles the panel — focus returns here on close. */
  triggerRef: RefObject<HTMLButtonElement | null>;
};

/**
 * Desktop accessibility popover shell. Behavior unchanged from pre-3B.4:
 * absolute under the header button, aria-modal=false, Escape + outside dismiss.
 * Toggle/reset UI lives in AccessibilityPanelBody (shared with mobile sheet).
 */
export function AccessibilityPanel({
  id,
  open,
  onClose,
  triggerRef,
}: AccessibilityPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

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

      <AccessibilityPanelBody />
    </div>
  );
}
