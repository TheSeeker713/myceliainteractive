"use client";

import {
  useScroll,
  useTransform,
  motion,
  useMotionValueEvent,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ScrollDebugOverlay } from "./ScrollDebugOverlay";
import {
  ScrollStagePublisher,
  type ScrollStageState,
} from "./ScrollStageContext";
import {
  getSectionFadeOpacities,
  getSectionFromProgress,
  getSectionLayers,
  getViewportRatio,
} from "./useSectionFade";

export type ScrollStageSection = {
  id?: string;
  content: ReactNode;
};

type ScrollStageProps = {
  sections: ScrollStageSection[];
  sectionHeight?: string;
};

function readViewportRatio(): number {
  if (typeof window === "undefined") return 1;
  const raw = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--header-h"),
  );
  const headerH = Number.isFinite(raw) ? raw * 16 : 72;
  return getViewportRatio(window.innerHeight, headerH, 100);
}

export function ScrollStage({
  sections,
  sectionHeight = "100dvh",
}: ScrollStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportRatio, setViewportRatio] = useState(readViewportRatio);
  const [stageState, setStageState] = useState<ScrollStageState>(() => ({
    sectionIndex: 0,
    localT: 0,
    scrollProgress: 0,
    sectionCount: sections.length,
    fade: getSectionFadeOpacities(0, true),
    isTransitioning: false,
    isHoldSolid: true,
  }));

  useEffect(() => {
    const updateViewportRatio = () => {
      const headerHRaw = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-h",
        ),
      );
      const headerH = Number.isFinite(headerHRaw) ? headerHRaw * 16 : 72;
      setViewportRatio(getViewportRatio(window.innerHeight, headerH, 100));
    };

    updateViewportRatio();
    window.addEventListener("resize", updateViewportRatio);
    return () => window.removeEventListener("resize", updateViewportRatio);
  }, []);

  const totalHeight = `calc(${sections.length} * ${sectionHeight})`;
  const sectionCount = sections.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Tracks the last sectionIndex/isTransitioning pair that was actually
  // committed to React state, so we can skip re-rendering on scroll ticks
  // that don't cross a section or transition boundary. The opacity
  // crossfade itself is driven entirely by the useTransform motion values
  // below and never touches this ref or React state.
  const lastAppliedRef = useRef({ sectionIndex: 0, isTransitioning: false });

  const syncFromProgress = useCallback(
    (p: number) => {
      const { index, localT } = getSectionFromProgress(
        p,
        sectionCount,
        viewportRatio,
      );
      const fade =
        index >= sectionCount - 1
          ? {
              outgoing: 0,
              incoming: 1,
              isTransitioning: false,
              phase: "hold-in" as const,
            }
          : getSectionFadeOpacities(localT, index === 0);

      const isTransitioning = fade.isTransitioning;
      const last = lastAppliedRef.current;
      if (last.sectionIndex === index && last.isTransitioning === isTransitioning) {
        return;
      }
      lastAppliedRef.current = { sectionIndex: index, isTransitioning };

      setStageState({
        sectionIndex: index,
        localT,
        scrollProgress: p,
        sectionCount,
        fade,
        isTransitioning,
        isHoldSolid: !isTransitioning,
      });
    },
    [sectionCount, viewportRatio],
  );

  useLayoutEffect(() => {
    // Sync restored scroll position before first paint; scrollYProgress is external to React.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional scroll restoration sync
    syncFromProgress(scrollYProgress.get());
  }, [scrollYProgress, syncFromProgress]);

  useMotionValueEvent(scrollYProgress, "change", syncFromProgress);

  const primaryOpacity = useTransform(scrollYProgress, (p) => {
    const { index, localT } = getSectionFromProgress(
      p,
      sectionCount,
      viewportRatio,
    );
    return getSectionLayers(index, localT, sectionCount).primaryOpacity;
  });

  const secondaryOpacity = useTransform(scrollYProgress, (p) => {
    const { index, localT } = getSectionFromProgress(
      p,
      sectionCount,
      viewportRatio,
    );
    return getSectionLayers(index, localT, sectionCount).secondaryOpacity;
  });

  const { index, localT } = getSectionFromProgress(
    stageState.scrollProgress,
    sectionCount,
    viewportRatio,
  );
  const layers = getSectionLayers(index, localT, sectionCount);
  const primarySection = sections[layers.primaryIndex];
  const preMountIndex =
    layers.primaryIndex < sectionCount - 1 ? layers.primaryIndex + 1 : null;
  const preMountSection =
    preMountIndex !== null ? sections[preMountIndex] : null;

  return (
    <ScrollStagePublisher value={stageState}>
      <div
        ref={containerRef}
        style={{ height: totalHeight }}
        className="relative w-full"
      >
        <div className="sticky top-[var(--header-h)] h-[calc(100dvh-var(--header-h))] w-full overflow-hidden">
          <motion.div
            className="absolute inset-0 z-10"
            style={{ opacity: primaryOpacity }}
            aria-hidden={
              layers.secondaryIndex !== null &&
              layers.secondaryOpacity > layers.primaryOpacity
            }
          >
            {primarySection && (
              <div id={primarySection.id} className="h-full w-full">
                {primarySection.content}
              </div>
            )}
          </motion.div>

          <motion.div
            className="absolute inset-0 z-20"
            style={{ opacity: secondaryOpacity }}
            aria-hidden={layers.secondaryIndex === null}
          >
            {preMountSection && (
              <div id={preMountSection.id} className="h-full w-full">
                {preMountSection.content}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <ScrollDebugOverlay stage={stageState} />
    </ScrollStagePublisher>
  );
}
