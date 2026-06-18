"use client";

import { ScrollFoldScene } from "@/app/components/motion/ScrollFoldScene";
import { usePrefersReducedMotion } from "@/app/components/motion/usePrefersReducedMotion";
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

const FADE_SCENE_PROPS = {
  layout: "fade" as const,
  sceneHeight: "160vh",
  sceneHeightMobile: "120vh",
};

function HomePageStatic() {
  return (
    <div className="site-gutter pb-20 space-y-16 sm:space-y-20">
      <section className="studio-section pt-16 sm:pt-24 min-h-[80dvh] flex items-center">
        <HeroContent />
      </section>
      <section className="studio-section">
        <ProofPointsContent />
      </section>
      <section className="studio-section">
        <AboutContent />
      </section>
      <section className="studio-section">
        <MissionContent />
      </section>
      <section id="projects" className="studio-section scroll-mt-24 space-y-6">
        <ProjectsContent />
      </section>
      <section id="roadmap" className="studio-section scroll-mt-24">
        <RoadmapContent />
      </section>
      <section className="studio-section">
        <TeamContent />
      </section>
      <section className="studio-section">
        <ContactContent />
      </section>
    </div>
  );
}

export function HomePage() {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <HomePageStatic />;
  }

  const [liminalSin, s33k3r, kaia, ais] = PROJECTS;

  return (
    <div className="pb-20">
      <ScrollFoldScene
        isFirst
        incoming={<HeroContent />}
        {...FADE_SCENE_PROPS}
      />
      <ScrollFoldScene
        outgoing={<HeroContent />}
        incoming={<ProofPointsContent />}
        {...FADE_SCENE_PROPS}
      />
      <ScrollFoldScene
        outgoing={<ProofPointsContent />}
        incoming={<AboutContent />}
        {...FADE_SCENE_PROPS}
      />
      <ScrollFoldScene
        outgoing={<AboutContent />}
        incoming={<MissionContent />}
        {...FADE_SCENE_PROPS}
      />
      <ScrollFoldScene
        id="projects"
        outgoing={<MissionContent />}
        incoming={<ProjectSceneContent project={liminalSin} />}
        {...FADE_SCENE_PROPS}
      />
      <ScrollFoldScene
        outgoing={<ProjectSceneContent project={liminalSin} />}
        incoming={<ProjectSceneContent project={s33k3r} />}
        {...FADE_SCENE_PROPS}
      />
      <ScrollFoldScene
        outgoing={<ProjectSceneContent project={s33k3r} />}
        incoming={<ProjectSceneContent project={kaia} />}
        {...FADE_SCENE_PROPS}
      />
      <ScrollFoldScene
        outgoing={<ProjectSceneContent project={kaia} />}
        incoming={<ProjectSceneContent project={ais} />}
        {...FADE_SCENE_PROPS}
      />
      <ScrollFoldScene
        id="roadmap"
        outgoing={<ProjectSceneContent project={ais} />}
        incoming={<RoadmapContent />}
        {...FADE_SCENE_PROPS}
      />
      <ScrollFoldScene
        outgoing={<RoadmapContent />}
        incoming={<TeamContent />}
        {...FADE_SCENE_PROPS}
      />
      <ScrollFoldScene
        outgoing={<TeamContent />}
        incoming={<ContactContent />}
        {...FADE_SCENE_PROPS}
      />
    </div>
  );
}
