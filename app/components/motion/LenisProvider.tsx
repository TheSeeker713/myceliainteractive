"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type LenisProviderProps = {
  children: ReactNode;
  enabled?: boolean;
};

export function LenisProvider({ children, enabled = true }: LenisProviderProps) {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!enabled || reducedMotion) return;

    const instance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    let rafId = 0;
    const raf = (time: number) => {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
    };
  }, [enabled, reducedMotion]);

  return <>{children}</>;
}
