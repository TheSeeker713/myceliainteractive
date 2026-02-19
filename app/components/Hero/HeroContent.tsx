"use client";

/**
 * HeroContent Component - Content wrapper with responsive grid structure
 * Mycelia Interactive - Interactive Cinema Landing
 * 
 * Features:
 * - Responsive grid layout for hero content
 * - Centered vertical alignment on mobile, left-aligned on desktop
 * - Proper spacing and hierarchy for headline, subheadline, CTAs
 * - Supports split-screen branching effect container (Phase 3)
 * 
 * @accessibility
 * - Semantic <div> structure
 * - Flexible layout respects content flow
 * - Proper spacing for readability across devices
 */

import { HeroContentProps } from "./types";
import { cn } from "@/utils";

export default function HeroContent({
  children,
  className
}: HeroContentProps) {
  return (
    <div
      className={cn(
        // Grid layout
        "grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10",
        
        // Alignment
        "items-center",
        
        // Content area width
        "w-full",
        
        // Custom classes
        className
      )}
    >
      {children}
    </div>
  );
}
