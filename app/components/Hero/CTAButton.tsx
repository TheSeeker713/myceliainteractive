"use client";

/**
 * CTAButton Component - Call-to-action button for hero section
 * Mycelia Interactive - Interactive Cinema Landing
 * 
 * Features:
 * - Prominent primary CTA button
 * - Glowing accent border with hover effects
 * - Responsive sizing
 * - Cinematic, interactive feel
 * 
 * @param {string} text - Button label
 * @param {function} onClick - Button click handler
 * @param {string} variant - Button style variant (primary, secondary)
 * @param {string} className - Additional custom classes
 * 
 * @accessibility
 * - Semantic <button> element
 * - Keyboard accessible with focus states
 * - High contrast text
 * - Clear hover/active states for mouse and keyboard users
 */

import { CTAButtonProps } from "./types";
import { cn } from "@/utils";

export default function CTAButton({
  text,
  onClick,
  variant = "primary",
  className
}: CTAButtonProps) {
  const variantStyles = {
    primary: cn(
      // Base
      "bg-gradient-to-r from-hero-magenta-600/70 to-hero-magenta-500/70",
      "border border-hero-magenta-300/70",
      "text-white",
      
      // Hover & Focus
      "hover:from-hero-magenta-500 hover:to-hero-magenta-400 hover:border-hero-magenta-200",
      "hover:shadow-[0_0_22px_rgba(139,44,245,0.5)]",
      "focus:outline-none focus:ring-2 focus:ring-hero-magenta-500 focus:ring-offset-2 focus:ring-offset-hero-bg-dark",
      
      // Transition
      "transition-all duration-300 ease-out"
    ),
    secondary: cn(
      // Base
      "bg-hero-bg-default/40",
      "backdrop-blur-sm",
      "border border-hero-cyan-300/70",
      "text-white",
      
      // Hover & Focus
      "hover:bg-hero-cyan-500/20 hover:border-hero-cyan-200",
      "hover:shadow-[0_0_22px_rgba(0,199,255,0.45)]",
      "focus:outline-none focus:ring-2 focus:ring-hero-cyan-500 focus:ring-offset-2 focus:ring-offset-hero-bg-dark",
      
      // Transition
      "transition-all duration-300 ease-out"
    )
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        // Base layout
        "px-6 sm:px-8 lg:px-10",
        "py-3 sm:py-3.5",
        "min-h-11",
        "rounded-md",
        
        // Typography
        "text-sm sm:text-base",
        "font-semibold",
        "uppercase tracking-[0.14em]",
        
        // State styles
        variantStyles[variant as keyof typeof variantStyles],
        
        // Custom classes
        className
      )}
    >
      {text}
    </button>
  );
}
