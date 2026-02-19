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
        "text-5xl sm:text-6xl lg:text-7xl xl:text-8xl",
        "font-bold",
        "tracking-tighter",
        "leading-tight",
        
        // Color
        "text-white",
        
        // Spacing
        "mb-6 sm:mb-8 lg:mb-10",
        
        // Effects
        "drop-shadow-lg",
        
        // Custom classes
        className
      )}
    >
      {text}
    </h1>
  );
}
