"use client";

import { useEffect } from "react";
import type { ScrollStageSection } from "./ScrollStage";
import {
  getScrollProgressFromSection,
  getViewportRatio,
} from "./useSectionFade";

const HASH_TO_SECTION_ID: Record<string, string> = {
  projects: "projects",
};

function readHeaderHeightPx(): number {
  const raw = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--header-h"),
  );
  return Number.isFinite(raw) ? raw * 16 : 72;
}

/**
 * Pure geometry: the `window.scrollTo` top (px) that lands the given section
 * index at the top of the sticky ScrollStage viewport.
 *
 * Exported so the corrected `getScrollProgressFromSection` argument order
 * (sectionIndex, localT, sectionCount, viewportRatio) is covered by a unit
 * test. A prior version silently passed only three arguments, which shifted
 * `sectionCount` into `localT` and `ratio` into `sectionCount` and produced a
 * wrong scroll target.
 */
export function getHashSectionScrollTop(
  sectionIndex: number,
  sectionCount: number,
  innerH: number,
  headerH: number,
): number {
  if (sectionCount <= 0 || sectionIndex < 0) return 0;
  if (!Number.isFinite(innerH) || innerH <= 0) return 0;

  const ratio = getViewportRatio(innerH, headerH, 100);
  const totalHeight = sectionCount * innerH;
  const progress = getScrollProgressFromSection(
    sectionIndex,
    0,
    sectionCount,
    ratio,
  );
  return progress * (totalHeight - innerH);
}

export function useHashScrollToSection(
  sections: ScrollStageSection[],
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;

    const scrollToSectionByHash = (hash: string) => {
      const normalized = hash.replace(/^#/, "");
      const targetId = HASH_TO_SECTION_ID[normalized];
      if (!targetId) return;

      const sectionIndex = sections.findIndex(
        (section) => section.id === targetId,
      );
      if (sectionIndex < 0) return;

      const top = getHashSectionScrollTop(
        sectionIndex,
        sections.length,
        window.innerHeight,
        readHeaderHeightPx(),
      );

      window.scrollTo({ top, behavior: "smooth" });
    };

    const handleHashChange = () => {
      scrollToSectionByHash(window.location.hash);
    };

    // Same-page Next.js <Link> hash clicks update the URL via history.pushState,
    // which does not fire `hashchange`, so the mount/hashchange handlers never
    // run. Intercept the click in the capture phase (before React/Next's own
    // bubble-phase handler) and drive the scroll directly.
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as Element | null;
      const anchor = target?.closest?.("a") ?? null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;
      if (url.pathname !== window.location.pathname) return;
      if (!url.hash) return;

      const normalized = url.hash.replace(/^#/, "");
      if (!HASH_TO_SECTION_ID[normalized]) return;

      event.preventDefault();
      event.stopPropagation();

      if (url.hash !== window.location.hash) {
        window.history.pushState(null, "", url.hash);
      }
      scrollToSectionByHash(url.hash);
    };

    scrollToSectionByHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    document.addEventListener("click", handleClick, true);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("click", handleClick, true);
    };
  }, [enabled, sections]);
}
