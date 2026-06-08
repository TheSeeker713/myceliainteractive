"use client";

import {
  motion,
  useMotionTemplate,
  type MotionValue,
} from "framer-motion";
import type { ReactNode } from "react";
import {
  useBandInTransforms,
  useBandOutTransforms,
  useFoldInTransforms,
  useFoldOutTransforms,
} from "./useFoldProgress";

type FoldLayerProps = {
  progress: MotionValue<number>;
  phase: "out" | "in";
  variant?: "fold" | "band";
  use3D?: boolean;
  className?: string;
  children: ReactNode;
  ariaHidden?: boolean;
};

export function FoldLayer({
  progress,
  phase,
  variant = "fold",
  use3D = true,
  className,
  children,
  ariaHidden,
}: FoldLayerProps) {
  const outFold = useFoldOutTransforms(progress, use3D);
  const inFold = useFoldInTransforms(progress, use3D);
  const outBand = useBandOutTransforms(progress);
  const inBand = useBandInTransforms(progress);

  const isOut = phase === "out";
  const isBand = variant === "band";

  const opacity = isOut
    ? isBand
      ? outBand.opacity
      : outFold.opacity
    : isBand
      ? inBand.opacity
      : inFold.opacity;

  const scaleY = isOut
    ? isBand
      ? outBand.scaleY
      : outFold.scaleY
    : isBand
      ? inBand.scaleY
      : inFold.scaleY;

  const rotateX = isOut ? outFold.rotateX : inFold.rotateX;
  const filter = useMotionTemplate`blur(${isOut && !isBand ? outFold.blur : 0}px)`;

  return (
    <motion.div
      className={`scroll-fold-layer absolute inset-0 flex items-center ${className ?? ""}`}
      style={{
        opacity,
        scaleY,
        rotateX,
        filter: isOut && !isBand ? filter : undefined,
        transformOrigin: isOut ? "center top" : "center bottom",
        pointerEvents: isOut ? "none" : "auto",
      }}
      aria-hidden={ariaHidden}
    >
      <div className="w-full max-h-full overflow-y-auto overscroll-contain py-16 sm:py-20">
        {children}
      </div>
    </motion.div>
  );
}
