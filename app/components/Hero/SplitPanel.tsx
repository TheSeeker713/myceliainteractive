/**
 * SplitPanel Component - Individual split-screen pane
 * Mycelia Interactive - Interactive Cinema Landing
 * 
 * Features:
 * - Responsive pane styling (left/right orientation)
 * - Hover expansion animations
 * - Active state from scroll trigger
 * - Smooth CSS transitions
 * - Semantic structure for accessibility
 * 
 * @param {PanelSide} side - Panel position (left or right)
 * @param {React.ReactNode} children - Panel content
 * @param {boolean} isHovered - Hover state from parent
 * @param {boolean} isActive - Scroll-triggered active state
 * @param {function} onMouseEnter - Mouse enter handler
 * @param {function} onMouseLeave - Mouse leave handler
 * @param {string} className - Additional custom classes
 * 
 * @accessibility
 * - Semantic <div> structure
 * - Inherits ARIA labels from parent
 * - Focus management for contained elements
 */

import { SplitPanelProps } from "./types";
import { cn } from "@/utils";

export default function SplitPanel({
  side,
  children,
  isHovered = false,
  isActive = false,
  onMouseEnter,
  onMouseLeave,
  className
}: SplitPanelProps & {
  isActive?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const isLeft = side === "left";

  return (
    <div
      className={cn(
        // Base layout
        "relative w-full h-full",
        "flex items-center justify-center",
        "p-6 sm:p-8 lg:p-10",
        
        // Hover expansion effect
        "transition-all duration-500 ease-out",
        isHovered ? "flex-grow" : "flex-1",
        
        // Background gradient - respond to hover
        "bg-gradient-to-r",
        isLeft
          ? cn(
              "from-hero-bg-dark/80 to-transparent",
              isHovered && "from-hero-magenta-600/20"
            )
          : cn(
              "from-transparent to-hero-bg-dark/80",
              isHovered && "to-hero-cyan-600/20"
            ),
        
        // Glow effect on hover
        isHovered && isLeft && "shadow-lg shadow-hero-magenta-600/30",
        isHovered && !isLeft && "shadow-lg shadow-hero-cyan-600/30",
        
        // Active state from scroll
        isActive && "ring-1 ring-inset ring-hero-magenta-500/50",
        
        // Custom classes
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="group"
      aria-label={`${isLeft ? "Left" : "Right"} panel - ${isLeft ? "Choice A" : "Choice B"}`}
    >
      {/* Content container */}
      <div className="flex flex-col items-center justify-center gap-4 text-center max-w-sm">
        {/* Accent color indicator */}
        <div
          className={cn(
            "w-2 h-8 rounded-full transition-all duration-300",
            isLeft ? "bg-hero-magenta-500" : "bg-hero-cyan-500",
            isHovered && "h-12"
          )}
          aria-hidden="true"
        />
        
        {/* Panel content */}
        <div className={cn(
          "transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-80"
        )}>
          {children}
        </div>
      </div>
    </div>
  );
}
