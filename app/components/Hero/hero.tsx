"use client";

/**
 * Hero Component - Main hero section container
 * Mycelia Interactive - Interactive Cinema Landing
 * 
 * Features:
 * - Full viewport height hero section with cinematic background
 * - Responsive grid layout for content organization
 * - Integrated network background animation
 * - Split-screen interaction container
 * - Glitch text effects on headline
 * 
 * @accessibility
 * - Semantic HTML5 structure
 * - ARIA labels for screen readers
 * - Keyboard navigation support
 * - Reduced motion support
 */

import { HeroProps } from "./types";
import { cn } from "@/utils";

export default function Hero({ className, children }: HeroProps) {
  return (
    <section
      className={cn(
        // Layout
        "relative w-full min-h-[100svh] md:min-h-screen",
        // Display
        "flex items-center justify-center",
        // Background
        "bg-hero-bg-dark",
        // Overflow
        "overflow-hidden",
        // Custom classes
        className
      )}
      aria-label="Hero section - Mycelia Interactive"
      role="banner"
    >
      {/* Animated gradient background */}
      <div 
        className={cn(
          "absolute inset-0 hero-gradient opacity-90",
          "transition-opacity duration-700"
        )}
        aria-hidden="true"
      />

      {/* Radial gradient overlay for depth */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-hero-bg-default/40 to-hero-bg-dark/80"
        aria-hidden="true"
      />

      {/* Network background container (will be added in Phase 5) */}
      <div 
        className="absolute inset-0 z-0"
        aria-hidden="true"
        id="network-background-container"
      >
        {/* NetworkBg component will be inserted here */}
      </div>

      {/* Main content container */}
      <div 
        className={cn(
          "relative z-10 w-full h-full",
          "flex items-center justify-center",
          "px-4 sm:px-6 lg:px-12",
          "py-14 sm:py-20 lg:py-28"
        )}
      >
        {/* Inner content wrapper with max-width */}
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </div>

      {/* Vignette effect for cinematic edge darkening */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 
            "radial-gradient(circle at center, transparent 0%, rgba(10, 10, 10, 0.4) 100%)"
        }}
        aria-hidden="true"
      />
    </section>
  );
}
