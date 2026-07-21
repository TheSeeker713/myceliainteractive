"use client";

import {
  useEffect,
  useRef,
  useSyncExternalStore,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { AccessibilityPanelBody } from "@/app/components/accessibility/AccessibilityPanelBody";
import { callMobileSafe, runMobileSafe } from "@/app/mobile/guardMobile";
import { attachVisualViewportFixedRoot } from "@/app/mobile/visualViewportFixedRoot";
import "@/app/styles/mobile/a11y-sheet.css";

type AccessibilityBottomSheetProps = {
  id: string;
  open: boolean;
  onClose: () => void;
  /** Element that toggles the sheet — focus returns here on close. */
  triggerRef: RefObject<HTMLButtonElement | null>;
};

function subscribeNoop() {
  return () => {};
}

/** True after client hydration — safe for document.body portals. */
function useIsClient() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

/**
 * Mobile (≤767) accessibility chrome: bottom sheet + dimmed backdrop.
 * Required dismiss: close button, backdrop tap, Escape.
 * Reuses AccessibilityPanelBody prefs — no separate toggle state.
 *
 * Root geometry is synced to window.visualViewport when available so the
 * overlay tracks the on-screen viewport on iOS Safari (layout vs visual
 * viewport divergence). Falls back to CSS position:fixed; inset:0 otherwise.
 */
export function AccessibilityBottomSheet({
  id,
  open,
  onClose,
  triggerRef,
}: AccessibilityBottomSheetProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();

  useEffect(() => {
    if (!open || !isClient) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;

    runMobileSafe("a11y-sheet-open", () => {
      document.body.style.overflow = "hidden";

      const panel = panelRef.current;
      const focusTarget =
        panel?.querySelector<HTMLElement>(
          ".a11y-sheet-body input, .a11y-sheet-body button",
        ) ??
        panel?.querySelector<HTMLElement>("button, input") ??
        panel;
      focusTarget?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        runMobileSafe("a11y-sheet-escape", onClose);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      runMobileSafe("a11y-sheet-close", () => {
        document.body.style.overflow = previousOverflow;
        document.removeEventListener("keydown", onKeyDown);
        trigger?.focus();
      });
    };
  }, [open, isClient, onClose, triggerRef]);

  useEffect(() => {
    if (!open || !isClient) return;
    const root = rootRef.current;
    if (!root) return;

    return callMobileSafe(
      "a11y-sheet-visual-viewport",
      () => attachVisualViewportFixedRoot(root),
      () => {
        /* no-op cleanup when attach throws */
      },
    );
  }, [open, isClient]);

  if (!open || !isClient) return null;

  return callMobileSafe(
    "a11y-sheet-portal",
    () =>
      createPortal(
        <div ref={rootRef} className="a11y-sheet-root">
          <button
            type="button"
            className="a11y-sheet-backdrop"
            aria-label="Dismiss accessibility panel"
            onClick={() => runMobileSafe("a11y-sheet-backdrop", onClose)}
          />
          <div
            ref={panelRef}
            id={id}
            role="dialog"
            aria-modal="true"
            aria-label="Accessibility"
            className="a11y-sheet-panel"
            onWheel={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
          >
            <div className="a11y-sheet-header">
              <h2 className="text-sm font-semibold tracking-wide text-studio-text uppercase pt-2">
                Accessibility
              </h2>
              <button
                type="button"
                onClick={() => runMobileSafe("a11y-sheet-close-btn", onClose)}
                className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-lg text-studio-text-muted hover:text-studio-text transition-colors"
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
            <div className="a11y-sheet-body">
              <AccessibilityPanelBody />
            </div>
          </div>
        </div>,
        document.body,
      ),
    null,
  );
}
