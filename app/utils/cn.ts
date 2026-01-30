/**
 * Class name utility for merging Tailwind CSS classes
 * Combines clsx and tailwind-merge for conflict-free class merging
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind-aware conflict resolution
 * @param inputs - Class names to merge
 * @returns Merged class string
 * 
 * @example
 * cn("px-2 py-1", "px-4") // => "py-1 px-4" (px-2 is overridden)
 * cn("text-red-500", condition && "text-blue-500") // Conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
