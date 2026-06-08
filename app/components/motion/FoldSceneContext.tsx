"use client";

import type { MotionValue } from "framer-motion";
import { createContext, useContext } from "react";

const FoldSceneContext = createContext<MotionValue<number> | null>(null);

export function FoldSceneProvider({
  progress,
  children,
}: {
  progress: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <FoldSceneContext.Provider value={progress}>
      {children}
    </FoldSceneContext.Provider>
  );
}

export function useFoldSceneProgress(): MotionValue<number> | null {
  return useContext(FoldSceneContext);
}
