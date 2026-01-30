/**
 * Animation utilities and Framer Motion variants
 * Mycelia Interactive - Hero Section
 */

import { AnimationVariants } from "@/components/Hero/types";

// ============================================
// FRAMER MOTION VARIANTS
// ============================================

/**
 * Fade in animation variant
 */
export const fadeIn: AnimationVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  },
  exit: { opacity: 0 },
};

/**
 * Fade in with upward movement
 */
export const fadeInUp: AnimationVariants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: 20 
  },
};

/**
 * Split-screen left panel animation
 */
export const splitLeft: AnimationVariants = {
  initial: { x: 0 },
  animate: { 
    x: "-25%",
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] // custom cubic-bezier
    }
  },
};

/**
 * Split-screen right panel animation
 */
export const splitRight: AnimationVariants = {
  initial: { x: 0 },
  animate: { 
    x: "25%",
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1]
    }
  },
};

/**
 * Glitch effect animation (subtle)
 */
export const glitchSubtle: AnimationVariants = {
  initial: { x: 0, y: 0 },
  animate: {
    x: [0, -2, 2, -1, 1, 0],
    y: [0, 1, -1, 2, -2, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 3,
    }
  },
};

/**
 * Stagger children animation (for lists/groups)
 */
export const staggerContainer: AnimationVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  },
};

// ============================================
// ANIMATION HELPERS
// ============================================

/**
 * Check if user prefers reduced motion
 * @returns true if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get animation duration based on user preferences
 * @param duration - Desired duration in ms
 * @returns Duration (0 if reduced motion preferred)
 */
export function getAnimationDuration(duration: number): number {
  return prefersReducedMotion() ? 0 : duration;
}

/**
 * Create a delayed animation variant
 * @param baseVariant - Base animation variant
 * @param delay - Delay in seconds
 * @returns Variant with added delay
 */
export function withDelay(
  baseVariant: AnimationVariants, 
  delay: number
): AnimationVariants {
  return {
    ...baseVariant,
    animate: {
      ...baseVariant.animate,
      transition: {
        ...(typeof baseVariant.animate.transition === 'object' 
          ? baseVariant.animate.transition 
          : {}),
        delay,
      }
    }
  };
}

/**
 * Scroll-triggered animation using Intersection Observer
 * @param callback - Function to call when element is visible
 * @param threshold - Visibility threshold (0-1)
 * @returns Cleanup function
 */
export function onScrollIntoView(
  element: HTMLElement | null,
  callback: () => void,
  threshold: number = 0.5
): (() => void) | undefined {
  if (!element || typeof window === "undefined") return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
        }
      });
    },
    { threshold }
  );

  observer.observe(element);

  // Return cleanup function
  return () => observer.disconnect();
}
