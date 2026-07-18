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
import { MYCELIA_FLOW_WHEEL_EVENT } from "@/app/components/motion/MyceliaFlowAtmosphere";
import { PreviewFlowAtmosphere } from "./PreviewFlowAtmosphere";
import {
  readPreviewReduceMotion,
  writePreviewReduceMotion,
} from "./previewMotionPreference";
import "@/app/components/motion/liquid-glass.css";

const CARDS = [
  {
    marker: "Mycelia Flow preview",
    title: "Living liquid glass over the mycelial field",
    body: "Scroll once to glitch this pane out of the present. The next card resolves in on its own, then waits for your next scroll.",
  },
  {
    marker: "01 · Mouse light",
    title: "Move across the glass",
    body: "Watch the highlight travel over the floating card. The light should feel wet and reflective, not flat.",
  },
  {
    marker: "02 · Time tear",
    title: "Scroll to destabilize",
    body: "One scroll gesture triggers the dissolve. Extra scrolls while it plays are queued as a single pending step.",
  },
  {
    marker: "03 · Buffer",
    title: "A breath between panes",
    body: "After a card dissolves, the next materializes automatically. Scroll up to travel backward the same way.",
  },
  {
    marker: "04 · Resolve in",
    title: "Glitch into place, then out again",
    body: "Each new card centers in place, holds, then dissolves electronically when you scroll again.",
  },
] as const;

const GLITCH_SLICES = [
  { top: 0, height: 18, offset: -1.15 },
  { top: 16, height: 16, offset: 0.85 },
  { top: 30, height: 14, offset: -0.55 },
  { top: 42, height: 18, offset: 1.25 },
  { top: 58, height: 15, offset: -0.95 },
  { top: 70, height: 16, offset: 0.65 },
  { top: 84, height: 16, offset: -1.35 },
] as const;

function LiquidGlassShell({
  children,
  className = "",
  style,
  trackPointer = false,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  trackPointer?: boolean;
}) {
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !trackPointer) return;

    const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
      const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
      card.style.setProperty("--lg-mx", `${x}%`);
      card.style.setProperty("--lg-my", `${y}%`);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [trackPointer]);

  return (
    <article ref={cardRef} className={`liquid-glass-card ${className}`} style={style}>
      {children}
    </article>
  );
}

function CardContent({
  marker,
  title,
  body,
}: {
  marker: string;
  title: string;
  body: string;
}) {
  return (
    <div className="liquid-glass-card-content p-7 sm:p-10">
      <p className="liquid-glass-kicker">{marker}</p>
      <h2 className="liquid-glass-title mt-3 text-3xl sm:text-5xl">{title}</h2>
      <p className="liquid-glass-body mt-4 max-w-xl text-base sm:text-lg">
        {body}
      </p>
    </div>
  );
}

function GlitchGlassCard({
  marker,
  title,
  body,
  cycle,
  reduceMotion,
}: {
  marker: string;
  title: string;
  body: string;
  cycle: CardCycleState;
  reduceMotion: boolean;
}) {
  if (cycle.opacity <= 0.01 && cycle.phase === "buffer") {
    return null;
  }

  const content = <CardContent marker={marker} title={title} body={body} />;
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
        <LiquidGlassShell trackPointer className="w-full max-w-xl">
          {content}
        </LiquidGlassShell>
      </div>
    );
  }

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
        <LiquidGlassShell trackPointer className="w-full max-w-xl">
          {content}
        </LiquidGlassShell>
      </div>

      <div
        className="liquid-glass-glitch-layer liquid-glass-glitch-layer--r"
        aria-hidden="true"
        style={{ transform: `translate3d(${-rgb}px, ${tear * 0.2}px, 0)` }}
      >
        <LiquidGlassShell className="w-full max-w-xl">{content}</LiquidGlassShell>
      </div>
      <div
        className="liquid-glass-glitch-layer liquid-glass-glitch-layer--b"
        aria-hidden="true"
        style={{ transform: `translate3d(${rgb}px, ${-tear * 0.18}px, 0)` }}
      >
        <LiquidGlassShell className="w-full max-w-xl">{content}</LiquidGlassShell>
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
          <LiquidGlassShell className="w-full max-w-xl">{content}</LiquidGlassShell>
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

export function AtmosphereStudy() {
  const rootRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<ScrollMachineState>(createScrollMachineState(0));
  const wheelAccumRef = useRef(0);
  const [machine, setMachine] = useState<ScrollMachineState>(() =>
    createScrollMachineState(0),
  );
  // SSR + first client paint always false; hydrate from localStorage after mount.
  const [reduceMotion, setReduceMotion] = useState(false);
  const [prefsReady, setPrefsReady] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setReduceMotion(readPreviewReduceMotion(window.localStorage));
      setPrefsReady(true);
    });
  }, []);

  const onReduceMotionChange = (next: boolean) => {
    setReduceMotion(next);
    writePreviewReduceMotion(window.localStorage, next);
  };

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

  // Drive timed transitions; queue policy lives in cardScrollMachine.
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
          CARDS.length,
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
  }, [reduceMotion]);

  useEffect(() => {
    const commitIntent = (direction: 1 | -1) => {
      const next = applyScrollIntent(
        machineRef.current,
        direction,
        CARDS.length,
      );
      if (next === machineRef.current) return;
      machineRef.current = next;
      setMachine(next);
      wheelAccumRef.current = 0;
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      // Broadcast wheel energy for the background shader without page scrolling.
      window.dispatchEvent(
        new CustomEvent(MYCELIA_FLOW_WHEEL_EVENT, {
          detail: { deltaY: event.deltaY },
        }),
      );

      wheelAccumRef.current = accumulateWheelDelta(
        wheelAccumRef.current,
        event.deltaY,
      );
      if (Math.abs(wheelAccumRef.current) < WHEEL_TRIGGER_THRESHOLD_PX) {
        return;
      }
      const direction = wheelAccumRef.current > 0 ? 1 : -1;
      commitIntent(direction);
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
  }, []);

  const { cardIndex, cycle } = getCycleForScrollMachine(machine, reduceMotion);
  const card = CARDS[cardIndex];

  return (
    <div
      ref={rootRef}
      className="atmosphere-preview-root relative h-[100dvh] overflow-hidden"
    >
      <PreviewFlowAtmosphere reduceMotionOptIn={reduceMotion} />

      <div className="liquid-glass-sticky-stage">
        <div className="liquid-glass-stage-toolbar">
          <p className="liquid-glass-stage-hint">
            {reduceMotion
              ? "Reduce motion is on: one scroll fades to the next pane."
              : "One scroll triggers dissolve → next card materializes. Extra scrolls queue one pending step."}
          </p>
          <label className="liquid-glass-motion-toggle">
            <input
              type="checkbox"
              checked={reduceMotion}
              onChange={(event) => onReduceMotionChange(event.target.checked)}
              disabled={!prefsReady}
            />
            <span>Reduce motion</span>
          </label>
        </div>

        <GlitchGlassCard
          marker={card.marker}
          title={card.title}
          body={card.body}
          cycle={cycle}
          reduceMotion={reduceMotion}
        />

        <p className="liquid-glass-stage-progress" aria-live="polite">
          Card {cardIndex + 1} of {CARDS.length}
          {` · ${machine.status}`}
          {cycle.phase !== "buffer" ? ` · ${cycle.phase}` : ""}
          {` · g ${cycle.glitch.toFixed(2)}`}
          {reduceMotion ? " · reduce motion" : " · full motion"}
        </p>
      </div>
    </div>
  );
}
