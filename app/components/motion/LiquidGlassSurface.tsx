"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/utils/cn";
import "./liquid-glass.css";
import "@/app/styles/mobile/liquid-glass.mobile.css";

export type LiquidGlassSurfaceProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
  id?: string;
  tabIndex?: number;
  "aria-label"?: string;
  /**
   * stage — homepage discrete cycle card
   * cover — full-width page section card
   * fill — cover + nearly full viewport height (single-page layouts)
   * panel — narrower centered card
   */
  variant?: "stage" | "cover" | "fill" | "panel";
  trackPointer?: boolean;
};

/**
 * Shared liquid-glass shell for homepage stage cards and full pages.
 * All visible marketing text should live inside this (or MyceliaCardStage).
 */
export function LiquidGlassSurface({
  children,
  className = "",
  contentClassName = "",
  style,
  id,
  tabIndex,
  "aria-label": ariaLabel,
  variant = "panel",
  trackPointer = false,
}: LiquidGlassSurfaceProps) {
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !trackPointer) return;

    const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
      const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
      card.style.setProperty("--lg-mx", `${x}%`);
      card.style.setProperty("--lg-my", `${y}%`);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [trackPointer]);

  return (
    <article
      id={id}
      ref={cardRef}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      className={cn(
        "liquid-glass-card scroll-mt-24",
        (variant === "cover" || variant === "fill") &&
          "liquid-glass-card--cover",
        variant === "fill" && "liquid-glass-card--fill",
        variant === "panel" && "liquid-glass-card--panel",
        variant === "stage" && "w-full",
        className,
      )}
      style={style}
    >
      <div
        className={cn(
          "liquid-glass-card-content",
          (variant === "cover" || variant === "fill" || variant === "panel") &&
            "liquid-glass-card-content--page",
          variant === "stage" && "liquid-glass-card-content--stage",
          "p-6 sm:p-8 lg:p-10",
          contentClassName,
        )}
        {...(variant === "stage"
          ? {
              tabIndex: 0,
              role: "region" as const,
              "aria-label": "Card content",
            }
          : {})}
      >
        {children}
      </div>
    </article>
  );
}

/** Page chrome: centers a cover card in the atmosphere viewport. */
export function LiquidGlassPage({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "atmosphere-preview-root liquid-glass-page site-gutter",
        className,
      )}
    >
      {children}
    </div>
  );
}
