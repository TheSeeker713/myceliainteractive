/**
 * Hero Component - Main hero section container
 * Mycelia Interactive - Interactive Cinema Landing
 * 
 * Features:
 * - Full viewport height hero section
 * - Cinematic gradient background
 * - Container for split-screen, glitch text, and network background
 * 
 * @accessibility
 * - Semantic HTML structure
 * - ARIA labels for screen readers
 * - Keyboard navigation support
 */

import { HeroProps } from "./types";
import { cn } from "@/utils";

export default function Hero({ className, children }: HeroProps) {
  return (
    <section
      className={cn(
        // Layout
        "relative w-full min-h-screen",
        // Background
        "bg-hero-bg-dark",
        // Flexbox centering
        "flex items-center justify-center",
        // Overflow control
        "overflow-hidden",
        // Custom classes
        className
      )}
      aria-label="Hero section"
    >
      {/* Background gradient overlay */}
      <div 
        className="absolute inset-0 hero-gradient opacity-90 -z-10"
        aria-hidden="true"
      />

      {/* Content container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
        {children || (
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-6">
              Mycelia Interactive
            </h1>
            <p className="text-xl text-white/80">
              Hero section placeholder - Components coming in Phase 2
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
