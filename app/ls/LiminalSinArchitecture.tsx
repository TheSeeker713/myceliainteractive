"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { FoldCard } from "@/app/components/motion/FoldCard";
import { attachVisualViewportFixedRoot } from "@/app/mobile/visualViewportFixedRoot";
import "@/app/styles/ls-architecture-diagram.css";

const ARCHITECTURE_BULLETS = [
  "Browser client (Next.js on Cloudflare) captures microphone audio and webcam frames at 1 FPS",
  "Bidirectional WebSocket connects to Cloud Run backend running Gemini Live multi-agent sessions",
  "Scene and session state persist in Firestore across the session lifecycle",
  "Imagen 4 generates scene stills; Veo 3.1 Fast delivers generative video loops on scene change",
  "Frontend is a render terminal; all game logic and agent decisions live in the backend",
] as const;

const MOBILE_ARCHITECTURE_BULLETS = ARCHITECTURE_BULLETS.slice(0, 3);

function subscribeNoop() {
  return () => {};
}

function useIsClient() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

function ArchitectureDiagram({
  className,
  markerId,
}: {
  className?: string;
  markerId: string;
}) {
  return (
    <svg
      viewBox="0 0 400 220"
      className={className ?? "w-full h-auto"}
      aria-label="Liminal Sin architecture diagram"
      role="img"
    >
      <rect
        x="20"
        y="70"
        width="100"
        height="60"
        rx="8"
        fill="var(--theme-inset-bg-strong)"
        stroke="var(--theme-inset-border)"
        strokeWidth="1"
      />
      <text
        x="70"
        y="105"
        textAnchor="middle"
        fontSize="11"
        fill="var(--color-studio-text)"
      >
        Browser
      </text>
      <text
        x="70"
        y="118"
        textAnchor="middle"
        fontSize="9"
        fill="var(--color-studio-text-muted)"
      >
        Next.js / CF
      </text>
      <path
        d="M 125 100 L 175 100"
        stroke="var(--color-studio-accent)"
        strokeOpacity="0.45"
        strokeWidth="1"
        markerEnd={`url(#${markerId})`}
      />
      <text
        x="150"
        y="92"
        textAnchor="middle"
        fontSize="8"
        fill="var(--color-studio-text-muted)"
      >
        WebSocket
      </text>
      <rect
        x="180"
        y="55"
        width="110"
        height="90"
        rx="8"
        fill="var(--theme-inset-bg-strong)"
        stroke="var(--theme-inset-border)"
        strokeWidth="1"
      />
      <text
        x="235"
        y="95"
        textAnchor="middle"
        fontSize="11"
        fill="var(--color-studio-text)"
      >
        Cloud Run
      </text>
      <text
        x="235"
        y="108"
        textAnchor="middle"
        fontSize="9"
        fill="var(--color-studio-text-muted)"
      >
        Gemini Live
      </text>
      <text
        x="235"
        y="121"
        textAnchor="middle"
        fontSize="9"
        fill="var(--color-studio-text-muted)"
      >
        Multi-agent
      </text>
      <path
        d="M 295 85 L 345 55"
        stroke="var(--color-studio-accent)"
        strokeOpacity="0.3"
        strokeWidth="0.8"
      />
      <path
        d="M 295 115 L 345 145"
        stroke="var(--color-studio-accent)"
        strokeOpacity="0.3"
        strokeWidth="0.8"
      />
      <rect
        x="350"
        y="30"
        width="40"
        height="40"
        rx="6"
        fill="var(--theme-inset-bg)"
        stroke="var(--theme-inset-border)"
        strokeWidth="0.8"
      />
      <text
        x="370"
        y="55"
        textAnchor="middle"
        fontSize="8"
        fill="var(--color-studio-text-muted)"
      >
        Imagen 4
      </text>
      <rect
        x="350"
        y="130"
        width="40"
        height="40"
        rx="6"
        fill="var(--theme-inset-bg)"
        stroke="var(--theme-inset-border)"
        strokeWidth="0.8"
      />
      <text
        x="370"
        y="155"
        textAnchor="middle"
        fontSize="8"
        fill="var(--color-studio-text-muted)"
      >
        Veo 3.1
      </text>
      <defs>
        <marker
          id={markerId}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6" fill="var(--color-studio-accent)" fillOpacity="0.45" />
        </marker>
      </defs>
    </svg>
  );
}

/**
 * Desktop-only: click diagram to enlarge in a viewport-pinned overlay;
 * click enlarged diagram or backdrop (or Escape) to shrink.
 */
function ArchitectureDiagramDesktopEnlarge({
  markerId,
}: {
  markerId: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();
  const titleId = useId();
  const enlargeMarkerId = `${markerId}-enlarge`;

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open || !isClient) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    rootRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, isClient, close]);

  useEffect(() => {
    if (!open || !isClient) return;
    const root = rootRef.current;
    if (!root) return;
    return attachVisualViewportFixedRoot(root);
  }, [open, isClient]);

  return (
    <>
      <button
        type="button"
        className="ls-arch-diagram-trigger"
        onClick={() => setOpen(true)}
        aria-label="Enlarge architecture diagram"
        aria-expanded={open}
        aria-controls={open ? titleId : undefined}
      >
        <ArchitectureDiagram markerId={markerId} />
      </button>

      {isClient && open
        ? createPortal(
            <div
              ref={rootRef}
              className="ls-arch-diagram-lightbox-root"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              onClick={close}
              onKeyDown={(event: ReactKeyboardEvent) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  close();
                }
              }}
            >
              <div
                className="ls-arch-diagram-lightbox-panel"
                onClick={close}
              >
                <h2 id={titleId} className="sr-only">
                  Architecture diagram (enlarged). Click or press Escape to
                  close.
                </h2>
                <ArchitectureDiagram markerId={enlargeMarkerId} />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

export function LiminalSinArchitectureContent() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-studio-text mb-3">
        Architecture Overview
      </h2>
      <p className="text-studio-text-muted max-w-2xl mb-10 max-md:mb-5 leading-relaxed">
        A minimal view of how the vertical slice connects browser input to live
        agent responses and generative media.
      </p>

      {/* ≤767: diagram-first + 3 bullets; defer full FoldCard bullet grid */}
      <div className="md:hidden space-y-4">
        <div className="rounded-xl border border-[color:var(--theme-inner-card-border)] bg-[color:var(--theme-inner-card-bg)] p-3">
          <ArchitectureDiagram markerId="ls-arch-arrow-mobile" />
        </div>
        <ul className="space-y-3 list-none p-0 m-0">
          {MOBILE_ARCHITECTURE_BULLETS.map((bullet) => (
            <li
              key={bullet}
              className="flex gap-3 text-sm text-studio-text-muted leading-relaxed border-b border-[color:var(--theme-inset-border)] pb-3 last:border-0"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-studio-accent"
                aria-hidden
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <FoldCard
          index={0}
          total={ARCHITECTURE_BULLETS.length + 1}
          className="p-6 sm:p-8"
        >
          <ArchitectureDiagramDesktopEnlarge markerId="ls-arch-arrow-desktop" />
        </FoldCard>

        <ul className="space-y-4">
          {ARCHITECTURE_BULLETS.map((bullet, index) => (
            <FoldCard
              key={bullet}
              index={index + 1}
              total={ARCHITECTURE_BULLETS.length + 1}
              className="p-4"
            >
              <li className="flex gap-3 text-sm text-studio-text-muted leading-relaxed list-none">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-studio-accent"
                  aria-hidden
                />
                <span>{bullet}</span>
              </li>
            </FoldCard>
          ))}
        </ul>
      </div>
    </>
  );
}
