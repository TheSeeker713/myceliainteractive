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
      "bg-transparent",
      "border-2 border-hero-magenta-500",
      "text-white",
      
      // Hover & Focus
      "hover:bg-hero-magenta-600 hover:border-hero-magenta-400",
      "hover:shadow-lg hover:shadow-hero-magenta-600/50",
      "focus:outline-none focus:ring-2 focus:ring-hero-magenta-500 focus:ring-offset-2 focus:ring-offset-hero-bg-dark",
      
      // Transition
      "transition-all duration-300 ease-out"
    ),
    secondary: cn(
      // Base
      "bg-transparent",
      "border-2 border-hero-cyan-500",
      "text-white",
      
      // Hover & Focus
      "hover:bg-hero-cyan-600 hover:border-hero-cyan-400",
      "hover:shadow-lg hover:shadow-hero-cyan-600/50",
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
        "px-8 sm:px-10 lg:px-12",
        "py-3 sm:py-4 lg:py-4",
        
        // Typography
        "text-base sm:text-lg",
        "font-semibold",
        "uppercase",
        "tracking-widest",
        
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
