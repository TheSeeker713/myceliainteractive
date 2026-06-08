"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/utils/cn";
import { useFoldSceneProgress } from "./FoldSceneContext";
import { useCardFoldTransforms } from "./useFoldProgress";

type FoldCardProps = {
  index: number;
  total: number;
  progress?: MotionValue<number>;
  className?: string;
  children: React.ReactNode;
  use3D?: boolean;
};

export function FoldCard({
  index,
  total,
  progress: progressProp,
  className,
  children,
  use3D = true,
}: FoldCardProps) {
  const reducedMotion = useReducedMotion();
  const contextProgress = useFoldSceneProgress();
  const fallbackProgress = useMotionValue(1);
  const progress = progressProp ?? contextProgress ?? fallbackProgress;
  const isStatic = reducedMotion || (!progressProp && !contextProgress);

  const { opacity, scaleY, rotateX } = useCardFoldTransforms(
    progress,
    index,
    total,
    use3D,
  );

  if (isStatic) {
    return <article className={cn("studio-card", className)}>{children}</article>;
  }

  return (
    <motion.article
      className={cn("studio-card scroll-fold-layer", className)}
      style={{
        opacity,
        scaleY,
        rotateX,
        transformOrigin: "center bottom",
      }}
      whileHover={{
        y: -3,
        boxShadow: "0 12px 40px rgba(45, 106, 126, 0.08)",
        transition: { duration: 0.25 },
      }}
    >
      {children}
    </motion.article>
  );
}
