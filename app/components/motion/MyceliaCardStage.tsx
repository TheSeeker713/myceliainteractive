"use client";

import {
  startTransition,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useIsMobileViewport } from "@/app/mobile";
import { callMobileSafe, runMobileSafe } from "@/app/mobile/guardMobile";
import {
  hasSeenMobileCardGuide,
  markMobileCardGuideSeen,
} from "@/app/mobile/cardGuideStorage";
import {
  MobileCardGuideArrows,
  MobileCardGuideTip,
} from "@/app/mobile/MobileCardGuide";
import { MobileFeatureErrorBoundary } from "@/app/mobile/MobileFeatureErrorBoundary";
import type { CardCycleState } from "./cardCycle";
import {
  accumulateWheelDelta,
  advanceScrollMachine,
  applyScrollIntent,
  createScrollMachineState,
  getCycleForScrollMachine,
  REDUCED_FORWARD_TRANSITION_MS,
  WHEEL_TRIGGER_THRESHOLD_PX,
  type ScrollMachineState,
} from "./cardScrollMachine";
import { shouldCaptureStageScroll } from "./cardStagePointer";
import { LiquidGlassSurface } from "./LiquidGlassSurface";
import { MYCELIA_FLOW_WHEEL_EVENT } from "./MyceliaFlowAtmosphere";
import { attachCardStageMobileListeners } from "./mobile/attachCardStageMobileListeners";
import {
  CARD_DRAG_SETTLE_MS,
  applyCardDragTransform,
  clearCardDragTransform,
} from "./mobile/cardDragTransform";
import {
  canScrollStageContent,
  flingTargetDx,
  readDragViewportHeight,
  readDragViewportWidth,
  shouldDismissHorizontalDrag,
} from "./mobile/cardStageMobileScroll";
import "./liquid-glass.css";

const GLITCH_SLICES = [
  { top: 0, height: 18, offset: -1.15 },
  { top: 16, height: 16, offset: 0.85 },
  { top: 30, height: 14, offset: -0.55 },
  { top: 42, height: 18, offset: 1.25 },
  { top: 58, height: 15, offset: -0.95 },
  { top: 70, height: 16, offset: 0.65 },
  { top: 84, height: 16, offset: -1.35 },
] as const;

export type MyceliaCardPane = {
  id?: string;
  /** Screen-reader label for live-region pane announcements. */
  label?: string;
  content: ReactNode;
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function paneAnnouncement(
  pane: MyceliaCardPane | undefined,
  index: number,
  total: number,
): string {
  const name = pane?.label ?? pane?.id ?? `Card ${index + 1}`;
  return `${name}, ${index + 1} of ${total}`;
}

function GlitchPane({
  children,
  cycle,
  reduceMotion,
  paneId,
  paneLabel,
}: {
  children: ReactNode;
  cycle: CardCycleState;
  reduceMotion: boolean;
  paneId?: string;
  paneLabel?: string;
}) {
  if (cycle.opacity <= 0.01 && cycle.phase === "buffer") {
    return null;
  }

  const glitch = reduceMotion ? 0 : cycle.glitch;
  const inGlitchPhase =
    !reduceMotion &&
    (cycle.phase === "materialize" ||
      cycle.phase === "dissolve" ||
      cycle.phase === "fade-out");
  const flicker =
    glitch > 0.55 ? (Math.sin(glitch * 48) > 0.35 ? 0.18 : 0) * glitch : 0;
  const rgb = Math.min(36, Math.max(glitch, inGlitchPhase ? 0.08 : 0) * 42);
  const tear = Math.max(glitch, inGlitchPhase ? 0.08 : 0) * 28;
  // Fragment target + focus restore land on the base card only — never on
  // aria-hidden glitch clones (duplicate ids / focusable hidden content).
  const landmarkProps = paneId
    ? ({
        id: paneId,
        tabIndex: -1,
        "aria-label": paneLabel,
      } as const)
    : {};

  if (reduceMotion || !inGlitchPhase) {
    return (
      <div
        className="liquid-glass-stage-card"
        style={{
          opacity: cycle.opacity,
          transform: reduceMotion
            ? undefined
            : `translateY(${(1 - cycle.opacity) * 12}px) scale(${0.96 + cycle.opacity * 0.04})`,
        }}
      >
        <LiquidGlassSurface
          variant="stage"
          trackPointer
          contentClassName="!p-6 sm:!p-8 lg:!p-10"
          {...landmarkProps}
        >
          {children}
        </LiquidGlassSurface>
      </div>
    );
  }

  const pane = <>{children}</>;

  return (
    <div
      className="liquid-glass-stage-card liquid-glass-stage-card--glitch"
      style={
        {
          opacity: Math.max(0, cycle.opacity - flicker),
          "--glitch": String(Math.max(glitch, 0.12)),
          "--glitch-rgb": `${rgb}px`,
          "--glitch-tear": `${tear}px`,
        } as CSSProperties
      }
    >
      <div className="liquid-glass-glitch-base">
        <LiquidGlassSurface
          variant="stage"
          trackPointer
          contentClassName="!p-6 sm:!p-8 lg:!p-10"
          {...landmarkProps}
        >
          {pane}
        </LiquidGlassSurface>
      </div>
      <div
        className="liquid-glass-glitch-layer liquid-glass-glitch-layer--r"
        aria-hidden="true"
        inert
        style={{ transform: `translate3d(${-rgb}px, ${tear * 0.2}px, 0)` }}
      >
        <LiquidGlassSurface variant="stage" contentClassName="!p-6 sm:!p-8 lg:!p-10">
          {pane}
        </LiquidGlassSurface>
      </div>
      <div
        className="liquid-glass-glitch-layer liquid-glass-glitch-layer--b"
        aria-hidden="true"
        inert
        style={{ transform: `translate3d(${rgb}px, ${-tear * 0.18}px, 0)` }}
      >
        <LiquidGlassSurface variant="stage" contentClassName="!p-6 sm:!p-8 lg:!p-10">
          {pane}
        </LiquidGlassSurface>
      </div>
      {GLITCH_SLICES.map((slice, index) => (
        <div
          key={index}
          className="liquid-glass-glitch-slice"
          aria-hidden="true"
          inert
          style={{
            clipPath: `inset(${slice.top}% 0 ${100 - slice.top - slice.height}% 0)`,
            transform: `translate3d(${slice.offset * tear}px, 0, 0)`,
            opacity: 0.55 + glitch * 0.45,
          }}
        >
          <LiquidGlassSurface variant="stage" contentClassName="!p-6 sm:!p-8 lg:!p-10">
            {pane}
          </LiquidGlassSurface>
        </div>
      ))}
      <div className="liquid-glass-scanlines" aria-hidden="true" />
      <div
        className="liquid-glass-glitch-noise"
        aria-hidden="true"
        style={{ opacity: 0.2 + glitch * 0.55 }}
      />
    </div>
  );
}

type MyceliaCardStageProps = {
  panes: MyceliaCardPane[];
  reduceMotion: boolean;
};

function subscribeGuideStorage() {
  return () => {};
}

function getGuideSeenSnapshot() {
  return hasSeenMobileCardGuide();
}

function getGuideSeenServerSnapshot() {
  // Hide on SSR to avoid a flash of the tip before sessionStorage is readable.
  return true;
}

export function MyceliaCardStage({
  panes,
  reduceMotion,
}: MyceliaCardStageProps) {
  const { isMobileViewport } = useIsMobileViewport();
  // Mobile uses the reduced-motion timing/curves for a simple fade only;
  // desktop glitch path is unchanged when isMobileViewport is false.
  const useFadeTransition = reduceMotion || isMobileViewport;
  const rootRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<ScrollMachineState>(createScrollMachineState(0));
  const wheelAccumRef = useRef(0);
  const announcedIndexRef = useRef<number | null>(null);
  const pendingFocusIdRef = useRef<string | null>(null);
  const [machine, setMachine] = useState<ScrollMachineState>(() =>
    createScrollMachineState(0),
  );
  const [liveMessage, setLiveMessage] = useState("");
  const guideSeenSession = useSyncExternalStore(
    subscribeGuideStorage,
    getGuideSeenSnapshot,
    getGuideSeenServerSnapshot,
  );
  const [guideDismissed, setGuideDismissed] = useState(false);
  const [guideFading, setGuideFading] = useState(false);
  const guideFadingRef = useRef(false);
  const guideDismissedRef = useRef(false);
  const dragCommitLockRef = useRef(false);
  const dragSettleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Clear off-screen drag transform only after fade swaps to the incoming pane. */
  const pendingDragClearRef = useRef(false);
  const guideFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getStageCard = () =>
    (rootRef.current?.querySelector(
      ".mycelia-card-drag-layer",
    ) as HTMLElement | null) ?? null;

  const dismissMobileCardGuide = () => {
    if (
      guideSeenSession ||
      guideDismissedRef.current ||
      guideFadingRef.current
    ) {
      return;
    }
    guideFadingRef.current = true;
    setGuideFading(true);
    runMobileSafe("card-guide-mark-seen", () => {
      markMobileCardGuideSeen();
    });
    if (guideFadeTimerRef.current != null) {
      clearTimeout(guideFadeTimerRef.current);
    }
    guideFadeTimerRef.current = setTimeout(() => {
      guideDismissedRef.current = true;
      setGuideDismissed(true);
      setGuideFading(false);
      guideFadingRef.current = false;
      guideFadeTimerRef.current = null;
    }, 280);
  };
  const dismissMobileCardGuideRef = useRef(dismissMobileCardGuide);

  useEffect(() => {
    dismissMobileCardGuideRef.current = dismissMobileCardGuide;
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onMove = (event: PointerEvent) => {
      const x = (event.clientX / Math.max(window.innerWidth, 1)) * 100;
      const y = (event.clientY / Math.max(window.innerHeight, 1)) * 100;
      root.style.setProperty("--lg-mx", `${x}%`);
      root.style.setProperty("--lg-my", `${y}%`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    let frame = 0;
    let lastStamp = performance.now();
    const tick = (stamp: number) => {
      const elapsed = stamp - lastStamp;
      lastStamp = stamp;
      const current = machineRef.current;
      if (current.status !== "holding") {
        const next = advanceScrollMachine(
          current,
          elapsed,
          panes.length,
          useFadeTransition,
        );
        if (next !== current) {
          machineRef.current = next;
          setMachine(next);
        }
        // Bug #3: keep the drag layer off-screen until the fade crosses mid-point
        // (incoming pane mounted). Clearing transform in the same turn as
        // commitIntent snapped the outgoing card back to center → ghost flash.
        if (
          pendingDragClearRef.current &&
          machineRef.current.transitionProgress >= 0.5
        ) {
          pendingDragClearRef.current = false;
          clearCardDragTransform(getStageCard());
          const port = rootRef.current?.querySelector(
            ".liquid-glass-card-content--stage",
          ) as HTMLElement | null;
          if (port) port.scrollTop = 0;
          dragCommitLockRef.current = false;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [panes.length, useFadeTransition]);

  useEffect(() => {
    const getCardRect = () =>
      rootRef.current
        ?.querySelector(".liquid-glass-stage-card")
        ?.getBoundingClientRect() ?? null;

    const commitIntent = (direction: 1 | -1) => {
      const next = applyScrollIntent(
        machineRef.current,
        direction,
        panes.length,
      );
      if (next === machineRef.current) return;
      machineRef.current = next;
      setMachine(next);
      wheelAccumRef.current = 0;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (isTypingTarget(event.target)) return;
      if (
        event.target instanceof Element &&
        event.target.closest("header, footer, [role='dialog']")
      ) {
        return;
      }

      let direction: 1 | -1 | null = null;
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        direction = 1;
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        direction = -1;
      }
      if (!direction) return;

      // Inside the card scrollport: let native overflow scroll until the edge,
      // then advance panes (same split as wheel over vs outside the card).
      const scrollPort = rootRef.current?.querySelector(
        ".liquid-glass-card-content--stage",
      ) as HTMLElement | null;
      if (
        event.target instanceof Node &&
        scrollPort?.contains(event.target) &&
        canScrollStageContent(scrollPort, direction)
      ) {
        return;
      }

      const before = machineRef.current;
      commitIntent(direction);
      if (machineRef.current === before) return;
      event.preventDefault();
    };

    // Mobile: drag-follow via imperative DOM transform (3F.2) — not setState per
    // move (that re-rendered the whole pane and dropped live follow on device).
    if (isMobileViewport) {
      const clearSettleTimer = () => {
        if (dragSettleTimerRef.current != null) {
          clearTimeout(dragSettleTimerRef.current);
          dragSettleTimerRef.current = null;
        }
      };

      const detachMobile = callMobileSafe(
        "card-stage-attach-entry",
        () =>
          attachCardStageMobileListeners({
            getRoot: () => rootRef.current,
            getCard: getStageCard,
            onDragMove: (dx, dy) => {
              if (dragCommitLockRef.current) return;
              clearSettleTimer();
              applyCardDragTransform(
                getStageCard(),
                dx,
                dy,
                readDragViewportWidth(),
                readDragViewportHeight(),
                false,
              );
            },
            onDragEnd: (dx, dy) => {
              if (dragCommitLockRef.current) return;
              const card = getStageCard();
              const vv = readDragViewportWidth();
              const vh = readDragViewportHeight();
              const direction = shouldDismissHorizontalDrag(dx, vv);
              if (!direction) {
                applyCardDragTransform(card, 0, 0, vv, vh, true);
                clearSettleTimer();
                dragSettleTimerRef.current = setTimeout(() => {
                  clearCardDragTransform(card);
                  dragSettleTimerRef.current = null;
                }, CARD_DRAG_SETTLE_MS);
                return;
              }

              dragCommitLockRef.current = true;
              applyCardDragTransform(
                card,
                flingTargetDx(direction, vv),
                dy,
                vv,
                vh,
                true,
              );
              // First successful dismiss on the hero card hides arrows + tip together.
              if (machineRef.current.cardIndex === 0) {
                dismissMobileCardGuideRef.current();
              }
              clearSettleTimer();
              dragSettleTimerRef.current = setTimeout(() => {
                // Commit while still off-screen; rAF clears transform at p≥0.5.
                pendingDragClearRef.current = true;
                commitIntent(direction);
                // Safety: if fade never reaches mid (edge case), clear anyway.
                dragSettleTimerRef.current = setTimeout(() => {
                  if (pendingDragClearRef.current) {
                    pendingDragClearRef.current = false;
                    clearCardDragTransform(getStageCard());
                    const port = rootRef.current?.querySelector(
                      ".liquid-glass-card-content--stage",
                    ) as HTMLElement | null;
                    if (port) port.scrollTop = 0;
                    dragCommitLockRef.current = false;
                  }
                  dragSettleTimerRef.current = null;
                }, REDUCED_FORWARD_TRANSITION_MS);
              }, CARD_DRAG_SETTLE_MS);
            },
            onDragCancel: () => {
              if (dragCommitLockRef.current) return;
              const card = getStageCard();
              applyCardDragTransform(
                card,
                0,
                0,
                readDragViewportWidth(),
                readDragViewportHeight(),
                true,
              );
              clearSettleTimer();
              dragSettleTimerRef.current = setTimeout(() => {
                clearCardDragTransform(card);
                dragSettleTimerRef.current = null;
              }, CARD_DRAG_SETTLE_MS);
            },
          }),
        () => {},
      );
      window.addEventListener("keydown", onKeyDown);
      return () => {
        clearSettleTimer();
        if (guideFadeTimerRef.current != null) {
          clearTimeout(guideFadeTimerRef.current);
          guideFadeTimerRef.current = null;
        }
        dragCommitLockRef.current = false;
        pendingDragClearRef.current = false;
        clearCardDragTransform(getStageCard());
        detachMobile();
        window.removeEventListener("keydown", onKeyDown);
      };
    }

    const onWheel = (event: WheelEvent) => {
      // Over the card: native overflow scroll on .liquid-glass-card-content.
      // Outside the card: accumulate toward a discrete card transition.
      if (
        !shouldCaptureStageScroll(
          { clientX: event.clientX, clientY: event.clientY },
          getCardRect(),
        )
      ) {
        wheelAccumRef.current = 0;
        return;
      }

      event.preventDefault();
      window.dispatchEvent(
        new CustomEvent(MYCELIA_FLOW_WHEEL_EVENT, {
          detail: { deltaY: event.deltaY },
        }),
      );
      wheelAccumRef.current = accumulateWheelDelta(
        wheelAccumRef.current,
        event.deltaY,
      );
      if (Math.abs(wheelAccumRef.current) < WHEEL_TRIGGER_THRESHOLD_PX) return;
      commitIntent(wheelAccumRef.current > 0 ? 1 : -1);
    };

    let touchStartY: number | null = null;
    let touchStartsOverCard = false;
    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      touchStartY = touch?.clientY ?? null;
      touchStartsOverCard = touch
        ? !shouldCaptureStageScroll(
            { clientX: touch.clientX, clientY: touch.clientY },
            getCardRect(),
          )
        : false;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (touchStartY === null) return;
      const touch = event.touches[0];
      if (!touch) return;

      // If the gesture began on the card, keep native in-card scrolling.
      if (touchStartsOverCard) {
        wheelAccumRef.current = 0;
        return;
      }

      const deltaY = touchStartY - touch.clientY;
      window.dispatchEvent(
        new CustomEvent(MYCELIA_FLOW_WHEEL_EVENT, {
          detail: { deltaY },
        }),
      );
      if (Math.abs(deltaY) < WHEEL_TRIGGER_THRESHOLD_PX) return;
      event.preventDefault();
      commitIntent(deltaY > 0 ? 1 : -1);
      touchStartY = touch.clientY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [panes.length, isMobileViewport]);

  useEffect(() => {
    const jumpToHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      const index = panes.findIndex((pane) => pane.id === hash);
      if (index < 0) return;
      pendingFocusIdRef.current = hash;
      const jumped = createScrollMachineState(index);
      machineRef.current = jumped;
      startTransition(() => setMachine(jumped));
    };

    jumpToHash();
    window.addEventListener("hashchange", jumpToHash);
    return () => window.removeEventListener("hashchange", jumpToHash);
  }, [panes]);

  const { cardIndex, cycle } = getCycleForScrollMachine(
    machine,
    useFadeTransition,
  );
  const pane = panes[cardIndex];
  const showMobileCardGuide =
    isMobileViewport &&
    cardIndex === 0 &&
    !guideSeenSession &&
    (!guideDismissed || guideFading);

  useEffect(() => {
    if (machine.status !== "holding") return;
    if (announcedIndexRef.current === null) {
      announcedIndexRef.current = cardIndex;
      return;
    }
    if (announcedIndexRef.current === cardIndex) return;
    announcedIndexRef.current = cardIndex;
    const message = paneAnnouncement(pane, cardIndex, panes.length);
    startTransition(() => setLiveMessage(message));
  }, [machine.status, cardIndex, pane, panes.length]);

  // F3: after hash/CTA pane jumps, move focus onto the new landmark.
  useEffect(() => {
    if (machine.status !== "holding") return;
    const focusId = pendingFocusIdRef.current;
    if (!focusId) return;
    if (panes[cardIndex]?.id !== focusId) return;
    pendingFocusIdRef.current = null;
    const focusTarget = () => {
      const el = document.getElementById(focusId);
      if (el instanceof HTMLElement) {
        el.focus({ preventScroll: true });
      }
    };
    // Double-rAF: wait for the active pane's id to commit to the DOM.
    requestAnimationFrame(() => requestAnimationFrame(focusTarget));
  }, [machine.status, cardIndex, panes]);

  return (
    <div
      ref={rootRef}
      className="atmosphere-preview-root mycelia-card-stage-root relative overflow-hidden"
    >
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        {liveMessage}
      </div>
      <div className="liquid-glass-sticky-stage">
        <div className="mycelia-card-drag-layer relative">
          <GlitchPane
            cycle={cycle}
            reduceMotion={useFadeTransition}
            paneId={pane?.id}
            paneLabel={pane?.label}
          >
            {pane?.content}
          </GlitchPane>
          {showMobileCardGuide ? (
            <MobileFeatureErrorBoundary feature="card-guide-arrows">
              <MobileCardGuideArrows fading={guideFading} />
            </MobileFeatureErrorBoundary>
          ) : null}
        </div>
        {showMobileCardGuide ? (
          <MobileFeatureErrorBoundary feature="card-guide-tip">
            <MobileCardGuideTip fading={guideFading} />
          </MobileFeatureErrorBoundary>
        ) : null}
      </div>
    </div>
  );
}
