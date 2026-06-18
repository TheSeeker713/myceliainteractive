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
  useFadeInTransforms,
  useFadeOutTransforms,
  useFoldInTransforms,
  useFoldOutTransforms,
} from "./useFoldProgress";

type FoldLayerProps = {
  progress: MotionValue<number>;
  phase: "out" | "in";
  variant?: "fold" | "band" | "fade";
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
  const outFade = useFadeOutTransforms(progress);
  const inFade = useFadeInTransforms(progress);

  const isOut = phase === "out";
  const isBand = variant === "band";
  const isFade = variant === "fade";

  const opacity = isOut
    ? isFade
      ? outFade.opacity
      : isBand
        ? outBand.opacity
        : outFold.opacity
    : isFade
      ? inFade.opacity
      : isBand
        ? inBand.opacity
        : inFold.opacity;

  const scaleY = isOut
    ? isFade
      ? outFade.scaleY
      : isBand
        ? outBand.scaleY
        : outFold.scaleY
    : isFade
      ? inFade.scaleY
      : isBand
        ? inBand.scaleY
        : inFold.scaleY;

  const rotateX = isOut
    ? isFade
      ? outFade.rotateX
      : outFold.rotateX
    : isFade
      ? inFade.rotateX
      : inFold.rotateX;
  const filter = useMotionTemplate`blur(${isOut && !isBand && !isFade ? outFold.blur : 0}px)`;

  return (
    <motion.div
      className={`scroll-fold-layer absolute inset-0 flex items-center ${className ?? ""}`}
      style={{
        opacity,
        scaleY,
        rotateX,
        filter: isOut && !isBand && !isFade ? filter : undefined,
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
