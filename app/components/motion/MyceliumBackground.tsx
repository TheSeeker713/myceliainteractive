"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Delicate, realistic mycelium network background
 * Matches the premium light aesthetic from the reference screenshot.
 * Scroll-driven growth + subtle node pulses.
 */
export function MyceliumBackground() {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const phase = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (reducedMotion) {
    return (
      <div className="pointer-events-none fixed inset-0 z-[-1] opacity-25">
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
        style={{ opacity: 0.38 }}
      >
        <defs>
          <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g stroke="#6b6b6b" strokeLinecap="round" strokeLinejoin="round">
          {/* === MAIN ORGANIC TRUNK === */}
          <motion.path
            d="M720 940 Q705 820 695 680 Q710 520 685 380 Q695 220 710 90"
            fill="none"
            strokeWidth="1.4"
            style={{ pathLength: phase }}
          />

          {/* === LEFT BRANCHING NETWORK === */}
          <motion.path
            d="M695 680 Q580 640 470 590 Q380 550 300 500"
            fill="none"
            strokeWidth="1.1"
            style={{ pathLength: useTransform(phase, [0.08, 0.52], [0, 1]) }}
          />
          <motion.path
            d="M695 680 Q560 710 450 760 Q360 810 280 870"
            fill="none"
            strokeWidth="1.0"
            style={{ pathLength: useTransform(phase, [0.12, 0.56], [0, 1]) }}
          />
          <motion.path
            d="M470 590 Q400 555 330 510 Q270 475 210 440"
            fill="none"
            strokeWidth="0.85"
            style={{ pathLength: useTransform(phase, [0.28, 0.72], [0, 1]) }}
          />
          <motion.path
            d="M450 760 Q380 730 310 700 Q250 670 190 640"
            fill="none"
            strokeWidth="0.8"
            style={{ pathLength: useTransform(phase, [0.32, 0.76], [0, 1]) }}
          />

          {/* Left fine twigs */}
          <motion.path
            d="M300 500 Q260 470 220 440 Q185 415 150 390"
            fill="none"
            strokeWidth="0.65"
            style={{ pathLength: useTransform(phase, [0.45, 0.85], [0, 1]) }}
          />
          <motion.path
            d="M210 440 Q175 410 140 380 Q110 355 80 330"
            fill="none"
            strokeWidth="0.55"
            style={{ pathLength: useTransform(phase, [0.52, 0.9], [0, 1]) }}
          />

          {/* === RIGHT BRANCHING NETWORK === */}
          <motion.path
            d="M710 680 Q830 635 950 580 Q1040 540 1130 490"
            fill="none"
            strokeWidth="1.1"
            style={{ pathLength: useTransform(phase, [0.08, 0.52], [0, 1]) }}
          />
          <motion.path
            d="M710 680 Q840 720 960 780 Q1050 840 1140 900"
            fill="none"
            strokeWidth="1.0"
            style={{ pathLength: useTransform(phase, [0.12, 0.56], [0, 1]) }}
          />
          <motion.path
            d="M950 580 Q1020 545 1090 505 Q1160 470 1230 430"
            fill="none"
            strokeWidth="0.85"
            style={{ pathLength: useTransform(phase, [0.28, 0.72], [0, 1]) }}
          />
          <motion.path
            d="M960 780 Q1030 750 1100 720 Q1170 690 1240 660"
            fill="none"
            strokeWidth="0.8"
            style={{ pathLength: useTransform(phase, [0.32, 0.76], [0, 1]) }}
          />

          {/* Right fine twigs */}
          <motion.path
            d="M1130 490 Q1180 460 1230 430 Q1270 405 1310 380"
            fill="none"
            strokeWidth="0.65"
            style={{ pathLength: useTransform(phase, [0.45, 0.85], [0, 1]) }}
          />
          <motion.path
            d="M1140 900 Q1190 870 1240 840 Q1280 815 1320 790"
            fill="none"
            strokeWidth="0.55"
            style={{ pathLength: useTransform(phase, [0.52, 0.9], [0, 1]) }}
          />

          {/* === UPPER DELICATE BRANCHES === */}
          <motion.path
            d="M695 380 Q620 340 540 300 Q470 265 400 230"
            fill="none"
            strokeWidth="0.75"
            style={{ pathLength: useTransform(phase, [0.38, 0.78], [0, 1]) }}
          />
          <motion.path
            d="M710 380 Q790 340 870 300 Q940 265 1010 230"
            fill="none"
            strokeWidth="0.75"
            style={{ pathLength: useTransform(phase, [0.38, 0.78], [0, 1]) }}
          />

          {/* === NODES (subtle dots) === */}
          {/* Main nodes */}
          <motion.circle cx="720" cy="940" r="2.8" fill="#6b6b6b" style={{ opacity: useTransform(phase, [0, 0.08], [0, 1]) }} />
          <motion.circle cx="695" cy="680" r="2.5" fill="#6b6b6b" style={{ opacity: useTransform(phase, [0.1, 0.38], [0, 1]) }} />
          <motion.circle cx="710" cy="380" r="2.2" fill="#6b6b6b" style={{ opacity: useTransform(phase, [0.42, 0.78], [0, 1]) }} />

          {/* Left nodes with soft glow */}
          <motion.circle cx="470" cy="590" r="2.0" fill="#6b6b6b" filter="url(#softGlow)" style={{ opacity: useTransform(phase, [0.22, 0.68], [0, 0.85]) }} />
          <motion.circle cx="450" cy="760" r="1.9" fill="#6b6b6b" filter="url(#softGlow)" style={{ opacity: useTransform(phase, [0.28, 0.72], [0, 0.8]) }} />
          <motion.circle cx="300" cy="500" r="1.7" fill="#6b6b6b" filter="url(#softGlow)" style={{ opacity: useTransform(phase, [0.48, 0.88], [0, 0.75]) }} />
          <motion.circle cx="210" cy="440" r="1.5" fill="#6b6b6b" filter="url(#softGlow)" style={{ opacity: useTransform(phase, [0.58, 0.95], [0, 0.7]) }} />

          {/* Right nodes with soft glow */}
          <motion.circle cx="950" cy="580" r="2.0" fill="#6b6b6b" filter="url(#softGlow)" style={{ opacity: useTransform(phase, [0.22, 0.68], [0, 0.85]) }} />
          <motion.circle cx="960" cy="780" r="1.9" fill="#6b6b6b" filter="url(#softGlow)" style={{ opacity: useTransform(phase, [0.28, 0.72], [0, 0.8]) }} />
          <motion.circle cx="1130" cy="490" r="1.7" fill="#6b6b6b" filter="url(#softGlow)" style={{ opacity: useTransform(phase, [0.48, 0.88], [0, 0.75]) }} />
          <motion.circle cx="1140" cy="900" r="1.5" fill="#6b6b6b" filter="url(#softGlow)" style={{ opacity: useTransform(phase, [0.58, 0.95], [0, 0.7]) }} />

          {/* Upper delicate nodes */}
          <motion.circle cx="540" cy="300" r="1.6" fill="#6b6b6b" filter="url(#softGlow)" style={{ opacity: useTransform(phase, [0.55, 0.92], [0, 0.7]) }} />
          <motion.circle cx="870" cy="300" r="1.6" fill="#6b6b6b" filter="url(#softGlow)" style={{ opacity: useTransform(phase, [0.55, 0.92], [0, 0.7]) }} />
        </g>
      </svg>
    </div>
  );
}

function MyceliumStatic() {
  return (
    <g stroke="#6b6b6b" strokeLinecap="round" strokeLinejoin="round">
      <path d="M720 940 Q705 820 695 680 Q710 520 685 380 Q695 220 710 90" fill="none" strokeWidth="1.4" />
      <path d="M695 680 Q580 640 470 590 Q380 550 300 500" fill="none" strokeWidth="1.1" />
      <path d="M695 680 Q560 710 450 760 Q360 810 280 870" fill="none" strokeWidth="1.0" />
      <path d="M710 680 Q830 635 950 580 Q1040 540 1130 490" fill="none" strokeWidth="1.1" />
      <path d="M710 680 Q840 720 960 780 Q1050 840 1140 900" fill="none" strokeWidth="1.0" />
      <circle cx="720" cy="940" r="2.8" fill="#6b6b6b" />
      <circle cx="695" cy="680" r="2.5" fill="#6b6b6b" />
    </g>
  );
}
