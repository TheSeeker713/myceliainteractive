"use client";

import { useEffect } from "react";
import type { ScrollStageSection } from "./ScrollStage";

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

      const sectionHeightPx = window.innerHeight;
      const top = sectionIndex * sectionHeightPx;

      window.scrollTo({ top, behavior: "smooth" });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, [enabled, sections]);
}
