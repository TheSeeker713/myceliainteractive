"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Scroll-driven Mycelial Background SVG
 * Main animated layer — branches grow + nodes pulse with colorful glow on scroll.
 * Content cards sit above this layer.
 */
export function MyceliumBackground() {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Overall growth phase
  const phase = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (reducedMotion) {
    return (
      <div className="pointer-events-none fixed inset-0 z-[-1] opacity-30">
        <svg viewBox="0 0 1400 1000" className="w-full h-full">
          <MyceliumStatic />
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden"
    >
      <svg
        viewBox="0 0 1400 1000"
        className="w-full h-full"
        style={{ opacity: 0.42 }}
      >
        <defs>
          {/* Colorful glow filters for nodes */}
          <filter id="glowTeal" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowCyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowMagenta" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g>
          {/* === MAIN TRUNK === */}
          <motion.path
            d="M700 920 Q710 780 695 620 Q680 470 705 320 Q715 180 700 80"
            fill="none"
            stroke="#2d6a7e"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: phase }}
          />

          {/* === LEFT PRIMARY BRANCHES === */}
          <motion.path
            d="M695 620 Q580 580 460 540 Q380 510 310 470"
            fill="none"
            stroke="#2d6a7e"
            strokeWidth="2.4"
            strokeLinecap="round"
            style={{ pathLength: useTransform(phase, [0.12, 0.58], [0, 1]) }}
          />
          <motion.path
            d="M695 620 Q570 660 450 720 Q370 780 290 840"
            fill="none"
            stroke="#2d6a7e"
            strokeWidth="2.1"
            strokeLinecap="round"
            style={{ pathLength: useTransform(phase, [0.18, 0.62], [0, 1]) }}
          />

          {/* Left secondary branches */}
          <motion.path
            d="M460 540 Q400 500 340 460 Q290 430 240 400"
            fill="none"
            stroke="#2d6a7e"
            strokeWidth="1.6"
            strokeLinecap="round"
            style={{ pathLength: useTransform(phase, [0.32, 0.78], [0, 1]) }}
          />
          <motion.path
            d="M450 720 Q390 700 320 680 Q260 660 200 640"
            fill="none"
            stroke="#2d6a7e"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ pathLength: useTransform(phase, [0.38, 0.82], [0, 1]) }}
          />

          {/* === RIGHT PRIMARY BRANCHES === */}
          <motion.path
            d="M705 620 Q820 575 940 530 Q1020 500 1100 460"
            fill="none"
            stroke="#2d6a7e"
            strokeWidth="2.4"
            strokeLinecap="round"
            style={{ pathLength: useTransform(phase, [0.12, 0.58], [0, 1]) }}
          />
          <motion.path
            d="M705 620 Q830 670 950 740 Q1040 810 1120 880"
            fill="none"
            stroke="#2d6a7e"
            strokeWidth="2.1"
            strokeLinecap="round"
            style={{ pathLength: useTransform(phase, [0.18, 0.62], [0, 1]) }}
          />

          {/* Right secondary branches */}
          <motion.path
            d="M940 530 Q1000 490 1070 450 Q1130 420 1190 390"
            fill="none"
            stroke="#2d6a7e"
            strokeWidth="1.6"
            strokeLinecap="round"
            style={{ pathLength: useTransform(phase, [0.32, 0.78], [0, 1]) }}
          />
          <motion.path
            d="M950 740 Q1020 710 1090 680 Q1160 650 1220 620"
            fill="none"
            stroke="#2d6a7e"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ pathLength: useTransform(phase, [0.38, 0.82], [0, 1]) }}
          />

          {/* === DELICATE TERTIARY BRANCHES (left) === */}
          <motion.path
            d="M310 470 Q270 440 230 410 Q200 385 170 360"
            fill="none"
            stroke="#2d6a7e"
            strokeWidth="1.1"
            strokeLinecap="round"
            style={{ pathLength: useTransform(phase, [0.48, 0.92], [0, 1]) }}
          />
          <motion.path
            d="M240 400 Q200 370 160 340 Q130 315 100 290"
            fill="none"
            stroke="#2d6a7e"
            strokeWidth="0.95"
            strokeLinecap="round"
            style={{ pathLength: useTransform(phase, [0.55, 0.95], [0, 1]) }}
          />

          {/* === DELICATE TERTIARY BRANCHES (right) === */}
          <motion.path
            d="M1100 460 Q1150 430 1200 400 Q1240 375 1280 350"
            fill="none"
            stroke="#2d6a7e"
            strokeWidth="1.1"
            strokeLinecap="round"
            style={{ pathLength: useTransform(phase, [0.48, 0.92], [0, 1]) }}
          />
          <motion.path
            d="M1120 880 Q1170 850 1220 820 Q1260 795 1300 770"
            fill="none"
            stroke="#2d6a7e"
            strokeWidth="0.95"
            strokeLinecap="round"
            style={{ pathLength: useTransform(phase, [0.55, 0.95], [0, 1]) }}
          />

          {/* === NODES WITH COLORFUL GLOWING PULSES === */}

          {/* Main trunk nodes */}
          <motion.circle
            cx="700" cy="920" r="5.5"
            fill="#2d6a7e"
            style={{ opacity: useTransform(phase, [0, 0.1], [0, 1]) }}
          />
          <motion.circle
            cx="695" cy="620" r="4.8"
            fill="#2d6a7e"
            style={{ opacity: useTransform(phase, [0.12, 0.35], [0, 1]) }}
          />
          <motion.circle
            cx="705" cy="320" r="4.2"
            fill="#2d6a7e"
            style={{ opacity: useTransform(phase, [0.45, 0.75], [0, 1]) }}
          />

          {/* Left side glowing nodes (teal + cyan) */}
          <motion.circle
            cx="460" cy="540" r="3.8"
            fill="#00c7ff"
            filter="url(#glowCyan)"
            style={{ opacity: useTransform(phase, [0.28, 0.65], [0, 0.9]) }}
          />
          <motion.circle
            cx="450" cy="720" r="3.5"
            fill="#2d6a7e"
            filter="url(#glowTeal)"
            style={{ opacity: useTransform(phase, [0.35, 0.72], [0, 0.85]) }}
          />
          <motion.circle
            cx="310" cy="470" r="3.2"
            fill="#8b2cf5"
            filter="url(#glowMagenta)"
            style={{ opacity: useTransform(phase, [0.52, 0.88], [0, 0.95]) }}
          />

          {/* Right side glowing nodes (cyan + magenta) */}
          <motion.circle
            cx="940" cy="530" r="3.8"
            fill="#00c7ff"
            filter="url(#glowCyan)"
            style={{ opacity: useTransform(phase, [0.28, 0.65], [0, 0.9]) }}
          />
          <motion.circle
            cx="950" cy="740" r="3.5"
            fill="#2d6a7e"
            filter="url(#glowTeal)"
            style={{ opacity: useTransform(phase, [0.35, 0.72], [0, 0.85]) }}
          />
          <motion.circle
            cx="1100" cy="460" r="3.2"
            fill="#8b2cf5"
            filter="url(#glowMagenta)"
            style={{ opacity: useTransform(phase, [0.52, 0.88], [0, 0.95]) }}
          />

          {/* Delicate tip nodes with soft pulses */}
          <motion.circle
            cx="170" cy="360" r="2.6"
            fill="#00c7ff"
            filter="url(#glowCyan)"
            style={{ opacity: useTransform(phase, [0.68, 0.98], [0, 0.8]) }}
          />
          <motion.circle
            cx="1280" cy="350" r="2.6"
            fill="#8b2cf5"
            filter="url(#glowMagenta)"
            style={{ opacity: useTransform(phase, [0.68, 0.98], [0, 0.8]) }}
          />
        </g>
      </svg>
    </div>
  );
}

function MyceliumStatic() {
  return (
    <g>
      <path d="M700 920 Q710 780 695 620 Q680 470 705 320 Q715 180 700 80" fill="none" stroke="#2d6a7e" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M695 620 Q580 580 460 540 Q380 510 310 470" fill="none" stroke="#2d6a7e" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M695 620 Q570 660 450 720 Q370 780 290 840" fill="none" stroke="#2d6a7e" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M705 620 Q820 575 940 530 Q1020 500 1100 460" fill="none" stroke="#2d6a7e" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M705 620 Q830 670 950 740 Q1040 810 1120 880" fill="none" stroke="#2d6a7e" strokeWidth="2.1" strokeLinecap="round" />
      <circle cx="700" cy="920" r="5.5" fill="#2d6a7e" />
      <circle cx="695" cy="620" r="4.8" fill="#2d6a7e" />
      <circle cx="705" cy="320" r="4.2" fill="#2d6a7e" />
    </g>
  );
}
