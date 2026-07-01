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
import { cn } from "@/utils/cn";
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

  // Physical DOM slots are pinned to index parity rather than to the
  // primary/secondary role. A section always mounts into the same slot
  // (its index mod 2) the first time it becomes the incoming section, and
  // stays in that slot when later promoted to primary. Only the slot's
  // role (and therefore its opacity source, z-index, and aria-hidden
  // state) swaps between the two divs, so no section is ever unmounted
  // from one div and remounted into the other while it has nonzero
  // opacity.
  const primaryIsEvenSlot = layers.primaryIndex % 2 === 0;
  const primaryAriaHidden =
    layers.secondaryIndex !== null &&
    layers.secondaryOpacity > layers.primaryOpacity;
  const secondaryAriaHidden = layers.secondaryIndex === null;

  const evenSlotIndex = primaryIsEvenSlot ? layers.primaryIndex : preMountIndex;
  const evenSlotSection = primaryIsEvenSlot ? primarySection : preMountSection;
  const evenSlotOpacity = primaryIsEvenSlot ? primaryOpacity : secondaryOpacity;
  const evenSlotAriaHidden = primaryIsEvenSlot
    ? primaryAriaHidden
    : secondaryAriaHidden;
  const evenSlotZ = primaryIsEvenSlot ? "z-10" : "z-20";

  const oddSlotIndex = primaryIsEvenSlot ? preMountIndex : layers.primaryIndex;
  const oddSlotSection = primaryIsEvenSlot ? preMountSection : primarySection;
  const oddSlotOpacity = primaryIsEvenSlot ? secondaryOpacity : primaryOpacity;
  const oddSlotAriaHidden = primaryIsEvenSlot
    ? secondaryAriaHidden
    : primaryAriaHidden;
  const oddSlotZ = primaryIsEvenSlot ? "z-20" : "z-10";

  return (
    <ScrollStagePublisher value={stageState}>
      <div
        ref={containerRef}
        style={{ height: totalHeight }}
        className="relative w-full"
      >
        <div className="sticky top-[var(--header-h)] h-[calc(100dvh-var(--header-h))] w-full overflow-hidden">
          <motion.div
            className={cn("absolute inset-0", evenSlotZ)}
            style={{ opacity: evenSlotOpacity }}
            aria-hidden={evenSlotAriaHidden}
          >
            {evenSlotSection && (
              <div
                key={evenSlotIndex}
                id={evenSlotSection.id}
                className="h-full w-full"
              >
                {evenSlotSection.content}
              </div>
            )}
          </motion.div>

          <motion.div
            className={cn("absolute inset-0", oddSlotZ)}
            style={{ opacity: oddSlotOpacity }}
            aria-hidden={oddSlotAriaHidden}
          >
            {oddSlotSection && (
              <div
                key={oddSlotIndex}
                id={oddSlotSection.id}
                className="h-full w-full"
              >
                {oddSlotSection.content}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <ScrollDebugOverlay stage={stageState} />
    </ScrollStagePublisher>
  );
}
