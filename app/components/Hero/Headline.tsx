"use client";

/**
 * Headline Component - Main headline for hero section
 * Mycelia Interactive - Interactive Cinema Landing
 * 
 * Features:
 * - Large, bold headline with glitch-ready structure
 * - Responsive typography scaling
 * - Cinematic spacing and contrast
 * - Ready for GlitchText enhancement (Phase 4)
 * 
 * @accessibility
 * - Semantic HTML5 <h1> structure
 * - High color contrast (white on deep purple)
 * - Readable font size across breakpoints
 * - No animation prefers-reduced-motion fallback
 */

import { HeadlineProps } from "./types";
import { cn } from "@/utils";

export default function Headline({ text, className }: HeadlineProps) {
  return (
    <h1
      className={cn(
        // Typography
        "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl",
        "font-bold",
        "tracking-tight",
        "leading-[1.05]",
        
        // Color
        "text-transparent bg-clip-text bg-gradient-to-r from-white via-hero-cyan-200 to-hero-magenta-200",
        
        // Spacing
        "mb-4 sm:mb-6 lg:mb-8",
        
        // Effects
        "drop-shadow-[0_0_18px_rgba(92,222,255,0.28)]",
        
        // Custom classes
        className
      )}
    >
      {text}
    </h1>
  );
}
