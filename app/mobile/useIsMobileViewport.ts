"use client";

import { startTransition, useEffect, useState } from "react";
import { MOBILE_VIEWPORT_MEDIA_QUERY } from "./mobileViewport";

/**
 * SSR-safe mobile viewport gate for Part 3.
 * Always `false` on first paint; hydrates from matchMedia after mount.
 * Consumers: MyceliaCardStage (3B.2) — more shells in later 3B sub-steps.
 */
export function useIsMobileViewport(): {
  isMobileViewport: boolean;
  viewportReady: boolean;
} {
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [viewportReady, setViewportReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_VIEWPORT_MEDIA_QUERY);

    const update = () => {
      startTransition(() => {
        setIsMobileViewport(mq.matches);
        setViewportReady(true);
      });
    };

    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return { isMobileViewport, viewportReady };
}
