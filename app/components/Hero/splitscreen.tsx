/**
 * SplitScreen Component - Split-screen branching effect with hover/scroll triggers
 * Mycelia Interactive - Interactive Cinema Landing
 * 
 * Features:
 * - Responsive split-screen layout (horizontal on desktop, vertical on mobile)
 * - Hover triggered expansion on desktop
 * - Scroll-based animation trigger
 * - Div-line branching visual effect
 * - Smooth CSS Grid transitions
 * 
 * @param {React.ReactNode} leftContent - Content for left pane
 * @param {React.ReactNode} rightContent - Content for right pane
 * @param {boolean} enableHover - Enable hover expansion (default: true)
 * @param {boolean} enableScroll - Enable scroll animation (default: false)
 * @param {string} className - Additional custom classes
 * 
 * @accessibility
 * - Semantic <div> structure with ARIA labels
 * - Keyboard accessible pane navigation
 * - Focus management for interactive elements
 * - Reduced motion support with static fallback
 * 
 * @example
 * <SplitScreen
 *   leftContent={<div>Choice A</div>}
 *   rightContent={<div>Choice B</div>}
 *   enableHover={true}
 * />
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { SplitScreenProps } from "./types";
import SplitPanel from "./SplitPanel";
import { cn } from "@/utils";

export default function SplitScreen({
  leftContent,
  rightContent,
  enableHover = true,
  enableScroll = false,
  className
}: SplitScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const hasReducedMotion = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  // Handle scroll trigger for animations
  useEffect(() => {
    if (!enableScroll || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsScrolled(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [enableScroll]);

  const handleMouseEnter = (side: "left" | "right") => {
    if (!enableHover || hasReducedMotion()) return;
    setIsHovered(true);
    setHoveredSide(side);
  };

  const handleMouseLeave = () => {
    if (!enableHover) return;
    setIsHovered(false);
    setHoveredSide(null);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        // Layout
        "relative w-full",
        "grid grid-cols-1 md:grid-cols-2 gap-0",
        
        // Responsive height
        "min-h-[22rem] md:min-h-[20rem]",
        
        // Overflow handling
        "overflow-hidden rounded-xl",
        
        // Border and styling
        "border border-hero-cyan-300/30",
        "bg-gradient-to-r from-hero-bg-dark/70 via-hero-bg-default/70 to-hero-bg-dark/70",
        
        // Custom classes
        className
      )}
      onMouseEnter={() => setIsHovered(enableHover ? true : false)}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Interactive split-screen branching point"
    >
      {/* Left Panel */}
      <SplitPanel
        side="left"
        isHovered={hoveredSide === "left"}
        isActive={isScrolled && !hasReducedMotion()}
        onMouseEnter={() => handleMouseEnter("left")}
        onMouseLeave={handleMouseLeave}
      >
        {leftContent}
      </SplitPanel>

      {/* Divider Line - Visual branching moment */}
      <div
        className={cn(
          "absolute left-1/2 top-0 h-full w-px transform -translate-x-1/2",
          "transition-all duration-500 ease-out",
          "origin-center",
          isHovered && hoveredSide ? "opacity-100 scale-y-100" : "opacity-40 scale-y-75",
          "bg-gradient-to-b from-transparent via-hero-cyan-300 to-transparent",
          "pointer-events-none",
          "hidden md:block"
        )}
        aria-hidden="true"
      />

      {/* Right Panel */}
      <SplitPanel
        side="right"
        isHovered={hoveredSide === "right"}
        isActive={isScrolled && !hasReducedMotion()}
        onMouseEnter={() => handleMouseEnter("right")}
        onMouseLeave={handleMouseLeave}
      >
        {rightContent}
      </SplitPanel>
    </div>
  );
}
