"use client";

import {
  startTransition,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useIsMobileViewport } from "@/app/mobile";
import { callMobileSafe } from "@/app/mobile/guardMobile";
import type { CardCycleState } from "./cardCycle";
import {
  accumulateWheelDelta,
  advanceScrollMachine,
  applyScrollIntent,
  createScrollMachineState,
  getCycleForScrollMachine,
  WHEEL_TRIGGER_THRESHOLD_PX,
  type ScrollMachineState,
} from "./cardScrollMachine";
import { shouldCaptureStageScroll } from "./cardStagePointer";
import { LiquidGlassSurface } from "./LiquidGlassSurface";
import { MYCELIA_FLOW_WHEEL_EVENT } from "./MyceliaFlowAtmosphere";
import { attachCardStageMobileListeners } from "./mobile/attachCardStageMobileListeners";
import {
  canScrollStageContent,
  dragRotationDeg,
  flingTargetDx,
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
  dragOffsetPx = 0,
  dragAnimated = false,
}: {
  children: ReactNode;
  cycle: CardCycleState;
  reduceMotion: boolean;
  paneId?: string;
  paneLabel?: string;
  /** Mobile drag-follow translateX (3F.2). */
  dragOffsetPx?: number;
  /** Use CSS transition while springing / flinging. */
  dragAnimated?: boolean;
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

  const vvWidth =
    typeof window !== "undefined"
      ? window.visualViewport?.width || window.innerWidth || 390
      : 390;
  const hasDrag = dragOffsetPx !== 0 || dragAnimated;
  const dragTransform = hasDrag
    ? `translateX(${dragOffsetPx}px) rotate(${dragRotationDeg(dragOffsetPx, vvWidth)}deg)`
    : null;
  const dragTransition = dragAnimated ? "transform 220ms ease-out" : "none";

  if (reduceMotion || !inGlitchPhase) {
    return (
      <div
        className="liquid-glass-stage-card"
        style={{
          opacity: cycle.opacity,
          transform:
            dragTransform ??
            (reduceMotion
              ? undefined
              : `translateY(${(1 - cycle.opacity) * 12}px) scale(${0.96 + cycle.opacity * 0.04})`),
          transition: dragTransform ? dragTransition : undefined,
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
        style={{ transform: `translate3d(${-rgb}px, ${tear * 0.2}px, 0)` }}
      >
        <LiquidGlassSurface variant="stage" contentClassName="!p-6 sm:!p-8 lg:!p-10">
          {pane}
        </LiquidGlassSurface>
      </div>
      <div
        className="liquid-glass-glitch-layer liquid-glass-glitch-layer--b"
        aria-hidden="true"
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
  const [dragDx, setDragDx] = useState(0);
  const [dragSettling, setDragSettling] = useState(false);
  const dragCommitLockRef = useRef(false);
  const dragSettleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    // Mobile: drag-follow → fling/spring → commitIntent once (3F.2).
    // Desktop outside-card wheel/touch are not attached on this branch.
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
            onDragMove: (dx) => {
              if (dragCommitLockRef.current) return;
              clearSettleTimer();
              setDragSettling(false);
              setDragDx(dx);
            },
            onDragEnd: (dx) => {
              if (dragCommitLockRef.current) return;
              const vv = readDragViewportWidth();
              const direction = shouldDismissHorizontalDrag(dx, vv);
              if (!direction) {
                setDragSettling(true);
                setDragDx(0);
                clearSettleTimer();
                dragSettleTimerRef.current = setTimeout(() => {
                  setDragSettling(false);
                  dragSettleTimerRef.current = null;
                }, 240);
                return;
              }

              dragCommitLockRef.current = true;
              setDragSettling(true);
              setDragDx(flingTargetDx(direction, vv));
              clearSettleTimer();
              dragSettleTimerRef.current = setTimeout(() => {
                commitIntent(direction);
                setDragDx(0);
                setDragSettling(false);
                dragCommitLockRef.current = false;
                dragSettleTimerRef.current = null;
              }, 240);
            },
            onDragCancel: () => {
              if (dragCommitLockRef.current) return;
              setDragSettling(true);
              setDragDx(0);
              clearSettleTimer();
              dragSettleTimerRef.current = setTimeout(() => {
                setDragSettling(false);
                dragSettleTimerRef.current = null;
              }, 240);
            },
          }),
        () => {},
      );
      window.addEventListener("keydown", onKeyDown);
      return () => {
        clearSettleTimer();
        dragCommitLockRef.current = false;
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
        <GlitchPane
          cycle={cycle}
          reduceMotion={useFadeTransition}
          paneId={pane?.id}
          paneLabel={pane?.label}
          dragOffsetPx={isMobileViewport ? dragDx : 0}
          dragAnimated={isMobileViewport && dragSettling}
        >
          {pane?.content}
        </GlitchPane>
      </div>
    </div>
  );
}
