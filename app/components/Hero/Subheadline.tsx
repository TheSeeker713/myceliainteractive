"use client";

/**
 * Subheadline Component - Supporting text for hero section
 * Mycelia Interactive - Interactive Cinema Landing
 * 
 * Features:
 * - Medium-weight supporting text
 * - Superior readability beneath headline
 * - Responsive sizing and spacing
 * - Cinematic emphasis with proper contrast
 * 
 * @accessibility
 * - Semantic <p> structure
 * - Ample line height for readability
 * - High color contrast
 * - Responsive font sizing for all devices
 */

import { SubheadlineProps } from "./types";
import { cn } from "@/utils";

export default function Subheadline({ text, className }: SubheadlineProps) {
  return (
    <p
      className={cn(
        // Typography
        "text-lg sm:text-xl lg:text-2xl",
        "font-normal",
        "tracking-normal",
        "leading-relaxed",
        
        // Color
        "text-gray-200",
        
        // Spacing
        "mb-8 sm:mb-10 lg:mb-12",
        
        // Max width for readability
        "max-w-2xl",
        
        // Custom classes
        className
      )}
    >
      {text}
    </p>
  );
}
