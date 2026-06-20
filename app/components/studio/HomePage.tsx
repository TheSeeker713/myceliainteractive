"use client";

import { useMemo } from "react";
import { usePrefersReducedMotion } from "@/app/components/motion/usePrefersReducedMotion";
import {
  ScrollStage,
  type ScrollStageSection,
} from "@/app/components/motion/ScrollStage";
import { useHashScrollToSection } from "@/app/components/motion/useHashScrollToSection";
import { CardSlot } from "@/app/components/studio/CardSlot";
import { AboutContent } from "@/app/components/studio/sections/AboutSection";
import { ContactContent } from "@/app/components/studio/sections/ContactSection";
import { HeroContent } from "@/app/components/studio/sections/HeroSection";
import { MissionContent } from "@/app/components/studio/sections/MissionSection";
import {
  ProjectSceneContent,
  ProjectsContent,
} from "@/app/components/studio/sections/ProjectsSection";
import { ProofPointsContent } from "@/app/components/studio/sections/ProofPointsStrip";
import { RoadmapContent } from "@/app/components/studio/sections/RoadmapSection";
import { TeamContent } from "@/app/components/studio/sections/TeamSection";
import { PROJECTS } from "@/app/components/studio/data";

function HomePageStatic() {
  return (
    <div className="site-gutter pb-20 space-y-16 sm:space-y-20">
      <section className="studio-section pt-16 sm:pt-24 min-h-[80dvh] flex items-center">
        <CardSlot>
          <HeroContent />
        </CardSlot>
      </section>
      <section className="studio-section">
        <CardSlot>
          <ProofPointsContent />
        </CardSlot>
      </section>
      <section className="studio-section">
        <CardSlot>
          <AboutContent />
        </CardSlot>
      </section>
      <section className="studio-section">
        <CardSlot>
          <MissionContent />
        </CardSlot>
      </section>
      <section id="projects" className="studio-section scroll-mt-24 space-y-6">
        <ProjectsContent />
      </section>
      <section id="roadmap" className="studio-section scroll-mt-24">
        <CardSlot scrollable>
          <RoadmapContent />
        </CardSlot>
      </section>
      <section className="studio-section">
        <CardSlot>
          <TeamContent />
        </CardSlot>
      </section>
      <section className="studio-section">
        <CardSlot>
          <ContactContent />
        </CardSlot>
      </section>
    </div>
  );
}

export function HomePage() {
  const reducedMotion = usePrefersReducedMotion();
  const [liminalSin, s33k3r, kaia, ais] = PROJECTS;

  const sections: ScrollStageSection[] = useMemo(
    () => [
      {
        content: (
          <CardSlot>
            <HeroContent />
          </CardSlot>
        ),
      },
      {
        content: (
          <CardSlot>
            <ProofPointsContent />
          </CardSlot>
        ),
      },
      {
        content: (
          <CardSlot>
            <AboutContent />
          </CardSlot>
        ),
      },
      {
        content: (
          <CardSlot>
            <MissionContent />
          </CardSlot>
        ),
      },
      {
        id: "projects",
        content: (
          <CardSlot scrollable>
            <ProjectSceneContent project={liminalSin} />
          </CardSlot>
        ),
      },
      {
        content: (
          <CardSlot scrollable>
            <ProjectSceneContent project={s33k3r} />
          </CardSlot>
        ),
      },
      {
        content: (
          <CardSlot scrollable>
            <ProjectSceneContent project={kaia} />
          </CardSlot>
        ),
      },
      {
        content: (
          <CardSlot scrollable>
            <ProjectSceneContent project={ais} />
          </CardSlot>
        ),
      },
      {
        id: "roadmap",
        content: (
          <CardSlot scrollable>
            <RoadmapContent />
          </CardSlot>
        ),
      },
      {
        content: (
          <CardSlot>
            <TeamContent />
          </CardSlot>
        ),
      },
      {
        content: (
          <CardSlot>
            <ContactContent />
          </CardSlot>
        ),
      },
    ],
    [liminalSin, s33k3r, kaia, ais],
  );

  useHashScrollToSection(sections, !reducedMotion);

  if (reducedMotion) {
    return <HomePageStatic />;
  }

  return (
    <>
      <ScrollStage sections={sections} />
    </>
  );
}
