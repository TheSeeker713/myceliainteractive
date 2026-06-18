"use client";

import { useEffect } from "react";
import type { ScrollStageSection } from "./ScrollStage";
import { getScrollProgressFromSection } from "./useSectionFade";

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

      const index = sections.findIndex((section) => section.id === targetId);
      if (index < 0) return;

      const progress = getScrollProgressFromSection(index, 0.1, sections.length);
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const top = progress * maxScroll;

      window.scrollTo({ top, behavior: "smooth" });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, [enabled, sections]);
}
