/**
 * TypeScript interfaces and types for Hero section components
 * Mycelia Interactive - Hero Section
 */

// ============================================
// HERO COMPONENT TYPES
// ============================================

/**
 * Main Hero component props
 */
export interface HeroProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Split-screen component props
 */
export interface SplitScreenProps {
  /** Left panel content */
  leftContent: React.ReactNode;
  /** Right panel content */
  rightContent: React.ReactNode;
  /** Enable hover interaction */
  enableHover?: boolean;
  /** Enable scroll-triggered animation */
  enableScroll?: boolean;
  /** Custom class names */
  className?: string;
}

/**
 * Split panel side identifier
 */
export type PanelSide = "left" | "right";

/**
 * Individual split panel props
 */
export interface SplitPanelProps {
  side: PanelSide;
  children: React.ReactNode;
  isHovered?: boolean;
  className?: string;
}

/**
 * Glitch text component props
 */
export interface GlitchTextProps {
  /** Text content to display */
  text: string;
  /** Text element type (h1, h2, p, span) */
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** Enable glitch animation */
  enableGlitch?: boolean;
  /** Glitch intensity (subtle, medium, intense) */
  intensity?: "subtle" | "medium" | "intense";
  /** Custom class names */
  className?: string;
}

/**
 * Network background animation props
 */
export interface NetworkBgProps {
  /** Number of nodes to render */
  nodeCount?: number;
  /** Connection line color (CSS color) */
  lineColor?: string;
  /** Node glow color (CSS color) */
  nodeColor?: string;
  /** Animation speed multiplier */
  speed?: number;
  /** Enable mouse interaction */
  interactive?: boolean;
  /** Custom class names */
  className?: string;
}

/**
 * Network node data structure
 */
export interface NetworkNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

/**
 * Network connection between nodes
 */
export interface NetworkConnection {
  node1: NetworkNode;
  node2: NetworkNode;
  opacity: number;
}

// ============================================
// ANIMATION TYPES
// ============================================

/**
 * Animation state for components
 */
export type AnimationState = "idle" | "animating" | "complete";

/**
 * Scroll animation trigger configuration
 */
export interface ScrollTrigger {
  /** Element to observe */
  target: HTMLElement | null;
  /** Threshold for triggering (0-1) */
  threshold: number;
  /** Callback when triggered */
  onTrigger: () => void;
}

/**
 * Framer Motion animation variants
 */
export interface AnimationVariants {
  initial: Record<string, unknown>;
  animate: Record<string, unknown>;
  exit?: Record<string, unknown>;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * CSS color value (hex, rgb, rgba, hsl, etc.)
 */
export type CSSColor = string;

/**
 * Timing function for animations
 */
export type TimingFunction = "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear" | string;

/**
 * Responsive breakpoint values
 */
export interface Breakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

/**
 * Hero section theme colors
 */
export interface HeroTheme {
  background: {
    dark: CSSColor;
    default: CSSColor;
    light: CSSColor;
  };
  accent: {
    magenta: CSSColor;
    cyan: CSSColor;
  };
  text: {
    primary: CSSColor;
    secondary: CSSColor;
  };
}

// ============================================
// CONSTANTS
// ============================================

/**
 * Default breakpoint values (px)
 */
export const BREAKPOINTS: Breakpoints = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1400,
};

/**
 * Default hero theme colors
 */
export const HERO_THEME: HeroTheme = {
  background: {
    dark: "#1a0b2e",
    default: "#2d1b4e",
    light: "#3d2b5e",
  },
  accent: {
    magenta: "#FF10F0",
    cyan: "#00F5FF",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "rgba(255, 255, 255, 0.8)",
  },
};

/**
 * Animation duration constants (ms)
 */
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 400,
  slow: 600,
  verySlow: 1000,
} as const;

/**
 * Z-index layer constants
 */
export const Z_INDEX = {
  background: -1,
  content: 1,
  overlay: 10,
  modal: 100,
} as const;
