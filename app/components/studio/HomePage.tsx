"use client";

import { SectionBridge } from "@/app/components/motion/SectionBridge";
import { AboutSection } from "@/app/components/studio/sections/AboutSection";
import { ContactSection } from "@/app/components/studio/sections/ContactSection";
import { HeroSection } from "@/app/components/studio/sections/HeroSection";
import { MissionSection } from "@/app/components/studio/sections/MissionSection";
import { ProjectsSection } from "@/app/components/studio/sections/ProjectsSection";
import { ProofPointsStrip } from "@/app/components/studio/sections/ProofPointsStrip";
import { RoadmapSection } from "@/app/components/studio/sections/RoadmapSection";
import { TeamSection } from "@/app/components/studio/sections/TeamSection";

export function HomePage() {
  return (
    <div className="site-gutter pb-20">
      <HeroSection />
      <SectionBridge variant={0} />
      <ProofPointsStrip />
      <SectionBridge variant={1} />
      <AboutSection />
      <SectionBridge variant={2} />
      <MissionSection />
      <SectionBridge variant={0} />
      <ProjectsSection />
      <SectionBridge variant={1} />
      <RoadmapSection />
      <SectionBridge variant={2} />
      <TeamSection />
      <SectionBridge variant={0} />
      <ContactSection />
    </div>
  );
}
