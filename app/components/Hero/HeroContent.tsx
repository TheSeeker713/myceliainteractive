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
        "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12",
        
        // Alignment
        "items-center justify-start",
        
        // Content area width
        "w-full",
        
        // Custom classes
        className
      )}
    >
      {/* Left column - Main content (headline, subheadline, CTAs) */}
      <div className="flex flex-col justify-center items-start order-2 lg:order-1">
        {children}
      </div>
      
      {/* Right column - Visual element placeholder (for split-screen in Phase 3) */}
      <div 
        className="hidden lg:flex order-1 lg:order-2 items-center justify-center h-96 rounded-lg border border-hero-magenta-500/20 bg-gradient-to-br from-hero-magenta-500/5 to-hero-cyan-500/5"
        aria-hidden="true"
      >
        <p className="text-hero-magenta-400/60 text-sm">Visual content area - Phase 3</p>
      </div>
    </div>
  );
}
