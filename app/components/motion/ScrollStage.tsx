"use client";

import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ScrollDebugOverlay } from "./ScrollDebugOverlay";
import {
  ScrollStagePublisher,
  type ScrollStageState,
} from "./ScrollStageContext";
import {
  getSectionFadeOpacities,
  getSectionFromProgress,
  getSectionLayers,
} from "./useSectionFade";

export type ScrollStageSection = {
  id?: string;
  content: ReactNode;
};

type ScrollStageProps = {
  sections: ScrollStageSection[];
  sectionHeightMobile?: string;
  sectionHeightDesktop?: string;
};

export function ScrollStage({
  sections,
  sectionHeightMobile = "100dvh",
  sectionHeightDesktop = "110dvh",
}: ScrollStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
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
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const sectionHeight = isMobile ? sectionHeightMobile : sectionHeightDesktop;
  const totalHeight = `calc(${sections.length} * ${sectionHeight})`;
  const sectionCount = sections.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const primaryOpacity = useTransform(scrollYProgress, (p) => {
    const { index, localT } = getSectionFromProgress(p, sectionCount);
    return getSectionLayers(index, localT, sectionCount).primaryOpacity;
  });

  const secondaryOpacity = useTransform(scrollYProgress, (p) => {
    const { index, localT } = getSectionFromProgress(p, sectionCount);
    return getSectionLayers(index, localT, sectionCount).secondaryOpacity;
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const { index, localT } = getSectionFromProgress(p, sectionCount);
    const fade =
      index >= sectionCount - 1
        ? {
            outgoing: 0,
            incoming: 1,
            isTransitioning: false,
            phase: "hold-in" as const,
          }
        : getSectionFadeOpacities(localT, index === 0);

    setStageState({
      sectionIndex: index,
      localT,
      scrollProgress: p,
      sectionCount,
      fade,
      isTransitioning: fade.isTransitioning,
      isHoldSolid: !fade.isTransitioning,
    });
  });

  const { index, localT } = getSectionFromProgress(
    stageState.scrollProgress,
    sectionCount,
  );
  const layers = getSectionLayers(index, localT, sectionCount);
  const primarySection = sections[layers.primaryIndex];
  const secondarySection =
    layers.secondaryIndex !== null ? sections[layers.secondaryIndex] : null;

  const showPrimary = layers.primaryOpacity > 0.001;
  const showSecondary =
    secondarySection !== null && layers.secondaryOpacity > 0.001;

  return (
    <ScrollStagePublisher value={stageState}>
      <div
        ref={containerRef}
        style={{ height: totalHeight }}
        className="relative w-full"
      >
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
          {showPrimary && primarySection && (
            <motion.div
              className="absolute inset-0 z-10"
              style={{ opacity: primaryOpacity }}
              aria-hidden={layers.primaryOpacity < 0.5 && showSecondary}
            >
              <div id={primarySection.id} className="h-full w-full">
                {primarySection.content}
              </div>
            </motion.div>
          )}

          {showSecondary && secondarySection && (
            <motion.div
              className="absolute inset-0 z-20"
              style={{ opacity: secondaryOpacity }}
            >
              <div id={secondarySection.id} className="h-full w-full">
                {secondarySection.content}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <ScrollDebugOverlay stage={stageState} />
    </ScrollStagePublisher>
  );
}
