"use client";

import {
  startTransition,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
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
import { LiquidGlassSurface } from "./LiquidGlassSurface";
import { MYCELIA_FLOW_WHEEL_EVENT } from "./MyceliaFlowAtmosphere";
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
  content: ReactNode;
};

function GlitchPane({
  children,
  cycle,
  reduceMotion,
}: {
  children: ReactNode;
  cycle: CardCycleState;
  reduceMotion: boolean;
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
        <LiquidGlassSurface variant="stage" trackPointer contentClassName="!p-6 sm:!p-8 lg:!p-10">
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
        <LiquidGlassSurface variant="stage" trackPointer contentClassName="!p-6 sm:!p-8 lg:!p-10">
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
  const rootRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<ScrollMachineState>(createScrollMachineState(0));
  const wheelAccumRef = useRef(0);
  const [machine, setMachine] = useState<ScrollMachineState>(() =>
    createScrollMachineState(0),
  );

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
          reduceMotion,
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
  }, [panes.length, reduceMotion]);

  useEffect(() => {
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

    const onWheel = (event: WheelEvent) => {
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
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (touchStartY === null) return;
      const y = event.touches[0]?.clientY;
      if (y === undefined) return;
      const deltaY = touchStartY - y;
      window.dispatchEvent(
        new CustomEvent(MYCELIA_FLOW_WHEEL_EVENT, {
          detail: { deltaY },
        }),
      );
      if (Math.abs(deltaY) < WHEEL_TRIGGER_THRESHOLD_PX) return;
      event.preventDefault();
      commitIntent(deltaY > 0 ? 1 : -1);
      touchStartY = y;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [panes.length]);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const index = panes.findIndex((pane) => pane.id === hash);
    if (index < 0) return;
    const jumped = createScrollMachineState(index);
    machineRef.current = jumped;
    startTransition(() => setMachine(jumped));
  }, [panes]);

  const { cardIndex, cycle } = getCycleForScrollMachine(machine, reduceMotion);
  const pane = panes[cardIndex];

  return (
    <div
      ref={rootRef}
      className="atmosphere-preview-root relative h-[calc(100dvh-var(--header-h)-var(--footer-h))] overflow-hidden"
    >
      <div className="liquid-glass-sticky-stage">
        <GlitchPane cycle={cycle} reduceMotion={reduceMotion}>
          {pane?.content}
        </GlitchPane>
        <p className="liquid-glass-stage-progress" aria-live="polite">
          {cardIndex + 1} / {panes.length}
          {` · ${machine.status}`}
        </p>
      </div>
    </div>
  );
}
