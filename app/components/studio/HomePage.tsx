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
  // Scroll-fold collapsing animations removed per request.
  // Background mycelium SVG now handles all scroll-reactive life.
  return <HomePageStatic />;
}
