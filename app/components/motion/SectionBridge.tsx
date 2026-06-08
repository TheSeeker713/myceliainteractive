"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BRIDGE_PRESETS } from "./bridgePaths";

type SectionBridgeProps = {
  variant?: 0 | 1 | 2;
  className?: string;
};

export function SectionBridge({ variant = 0, className }: SectionBridgeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const preset = BRIDGE_PRESETS[variant];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const pathLength = useTransform(scrollYProgress, [0.15, 0.55, 0.85], [0, 1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  if (reducedMotion) return <div ref={ref} className={className} aria-hidden />;

  return (
    <div
      ref={ref}
      className={`section-bridge relative h-24 sm:h-32 w-full max-w-[var(--content-max-width)] mx-auto ${className ?? ""}`}
      aria-hidden
    >
      <motion.svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full motion-line-glow"
        style={{ opacity }}
      >
        <motion.path
          d={preset.main}
          fill="none"
          stroke="rgba(45, 106, 126, 0.35)"
          strokeWidth="0.6"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength }}
        />
        <motion.path
          d={preset.branch}
          fill="none"
          stroke="rgba(45, 106, 126, 0.15)"
          strokeWidth="0.4"
          vectorEffect="non-scaling-stroke"
          className="hidden md:block"
          style={{ pathLength }}
        />
      </motion.svg>
    </div>
  );
}
