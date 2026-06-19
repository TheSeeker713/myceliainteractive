"use client";

import { useEffect } from "react";
import type { ScrollStageSection } from "./ScrollStage";
import {
  getScrollProgressFromSection,
  getViewportRatio,
} from "./useSectionFade";

const HASH_TO_SECTION_ID: Record<string, string> = {
  projects: "projects",
  roadmap: "roadmap",
};

export function useHashScrollToSection(
  sections: ScrollStageSection[],
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;

    const scrollToHash = () => {
      const hash = window.location.hash.replace("#", "");
      const targetId = HASH_TO_SECTION_ID[hash];
      if (!targetId) return;

      const sectionIndex = sections.findIndex(
        (section) => section.id === targetId,
      );
      if (sectionIndex < 0) return;

      const innerH = window.innerHeight;
      const raw = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-h",
        ),
      );
      const headerH = Number.isFinite(raw) ? raw * 16 : 72;
      const ratio = getViewportRatio(innerH, headerH, 100);
      const sectionCount = sections.length;
      const totalHeight = sectionCount * innerH;
      const progress = getScrollProgressFromSection(
        sectionIndex,
        sectionCount,
        ratio,
      );
      const top = progress * (totalHeight - innerH);

      window.scrollTo({ top, behavior: "smooth" });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, [enabled, sections]);
}
