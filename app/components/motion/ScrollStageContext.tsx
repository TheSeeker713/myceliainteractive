"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { SectionFadeOpacities } from "./useSectionFade";

export type ScrollStageState = {
  sectionIndex: number;
  localT: number;
  scrollProgress: number;
  sectionCount: number;
  fade: SectionFadeOpacities;
  isTransitioning: boolean;
  isHoldSolid: boolean;
};

const ScrollStageContext = createContext<ScrollStageState | null>(null);
const ScrollStageSetterContext = createContext<
  Dispatch<SetStateAction<ScrollStageState | null>> | null
>(null);

export function ScrollStageRootProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ScrollStageState | null>(null);

  return (
    <ScrollStageSetterContext.Provider value={setState}>
      <ScrollStageContext.Provider value={state}>
        {children}
      </ScrollStageContext.Provider>
    </ScrollStageSetterContext.Provider>
  );
}

export function ScrollStagePublisher({
  value,
  children,
}: {
  value: ScrollStageState;
  children: ReactNode;
}) {
  const setState = useContext(ScrollStageSetterContext);
  const lastPublished = useRef({
    sectionIndex: -1,
    isTransitioning: false,
    sectionCount: 0,
  });

  useEffect(() => {
    const shouldPublish =
      lastPublished.current.sectionIndex !== value.sectionIndex ||
      lastPublished.current.isTransitioning !== value.isTransitioning ||
      lastPublished.current.sectionCount !== value.sectionCount;

    if (shouldPublish) {
      lastPublished.current = {
        sectionIndex: value.sectionIndex,
        isTransitioning: value.isTransitioning,
        sectionCount: value.sectionCount,
      };
      setState?.(value);
    }
  }, [setState, value]);

  useEffect(() => {
    return () => setState?.(null);
  }, [setState]);

  return <>{children}</>;
}

export function useScrollStage(): ScrollStageState | null {
  return useContext(ScrollStageContext);
}
