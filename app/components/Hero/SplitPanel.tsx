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
        "p-5 sm:p-7 lg:p-8",
        
        // Hover expansion effect
        "transition-all duration-500 ease-out",
        isHovered ? "flex-grow" : "flex-1",
        
        // Background gradient - respond to hover
        "bg-gradient-to-r",
        isLeft
          ? cn(
              "from-hero-bg-dark/90 to-transparent",
              isHovered && "from-hero-magenta-500/25"
            )
          : cn(
              "from-transparent to-hero-bg-dark/90",
              isHovered && "to-hero-cyan-500/25"
            ),
        
        // Glow effect on hover
        isHovered && isLeft && "shadow-[0_0_28px_rgba(139,44,245,0.3)]",
        isHovered && !isLeft && "shadow-[0_0_28px_rgba(0,199,255,0.3)]",
        
        // Active state from scroll
        isActive && "ring-1 ring-inset ring-hero-cyan-300/50",
        
        // Custom classes
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="group"
      aria-label={`${isLeft ? "Left" : "Right"} panel - ${isLeft ? "Choice A" : "Choice B"}`}
    >
      {/* Content container */}
      <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 text-center max-w-sm">
        {/* Accent color indicator */}
        <div
          className={cn(
            "w-2 h-8 rounded-full transition-all duration-300",
            isLeft ? "bg-hero-magenta-400" : "bg-hero-cyan-400",
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
