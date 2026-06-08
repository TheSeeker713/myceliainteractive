"use client";

import { ScrollFoldScene } from "@/app/components/motion/ScrollFoldScene";
import { usePrefersReducedMotion } from "@/app/components/motion/usePrefersReducedMotion";
import { AboutContent } from "@/app/components/studio/sections/AboutSection";
import { ContactContent } from "@/app/components/studio/sections/ContactSection";
import { HeroContent } from "@/app/components/studio/sections/HeroSection";
import { MissionContent } from "@/app/components/studio/sections/MissionSection";
import { ProjectsContent } from "@/app/components/studio/sections/ProjectsSection";
import { ProofPointsContent } from "@/app/components/studio/sections/ProofPointsStrip";
import { RoadmapContent } from "@/app/components/studio/sections/RoadmapSection";
import { TeamContent } from "@/app/components/studio/sections/TeamSection";

function HomePageStatic() {
  return (
    <div className="site-gutter pb-20 space-y-16 sm:space-y-20">
      <section className="studio-section pt-16 sm:pt-24">
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
      <section id="projects" className="studio-section scroll-mt-24">
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

  return (
    <div className="pb-20">
      <ScrollFoldScene
        outgoing={<HeroContent />}
        incoming={<ProofPointsContent />}
        layout="cards"
        sceneHeight="180vh"
      />
      <ScrollFoldScene
        outgoing={<ProofPointsContent />}
        incoming={<AboutContent />}
        layout="cards"
      />
      <ScrollFoldScene
        outgoing={<AboutContent />}
        incoming={<MissionContent />}
        layout="plain"
      />
      <ScrollFoldScene
        outgoing={<MissionContent />}
        incoming={<ProjectsContent />}
        id="projects"
        layout="grid"
        sceneHeight="220vh"
      />
      <ScrollFoldScene
        outgoing={<ProjectsContent />}
        incoming={<RoadmapContent />}
        id="roadmap"
        layout="grid"
        sceneHeight="220vh"
      />
      <ScrollFoldScene
        outgoing={<RoadmapContent />}
        incoming={<TeamContent />}
        layout="cards"
      />
      <ScrollFoldScene
        outgoing={<TeamContent />}
        incoming={<ContactContent />}
        layout="cards"
      />
    </div>
  );
}
