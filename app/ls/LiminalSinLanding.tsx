"use client";

import FPVCarousel from "@/app/components/FPVCarousel";
import { ScrollFoldScene } from "@/app/components/motion/ScrollFoldScene";
import { usePrefersReducedMotion } from "@/app/components/motion/usePrefersReducedMotion";
import { LiminalSinAccessFooter } from "@/app/ls/LiminalSinAccessFooter";
import { LiminalSinArchitectureContent } from "@/app/ls/LiminalSinArchitecture";
import { LiminalSinExperienceContent } from "@/app/ls/LiminalSinExperienceTeaser";
import { LiminalSinHeroContent } from "@/app/ls/LiminalSinHero";
import { LiminalSinSliceScopeContent } from "@/app/ls/LiminalSinSliceScope";
import {
  LiminalSinAccessContent,
  LiminalSinCapabilitiesContent,
  LiminalSinStoryContent,
  LiminalSinTrustContent,
} from "@/app/ls/LiminalSinStorySections";

function FPVBandContent() {
  return (
    <div className="w-full -mx-[clamp(1.5rem,6vw,4rem)]">
      <FPVCarousel />
    </div>
  );
}

function LiminalSinPageStatic() {
  return (
    <div className="min-h-screen">
      <section className="ls-section-py pt-28 sm:pt-32">
        <div className="ls-gutter studio-section">
          <LiminalSinHeroContent />
        </div>
      </section>
      <section id="experience" className="ls-section-py scroll-mt-24">
        <div className="ls-gutter studio-section">
          <LiminalSinExperienceContent />
        </div>
      </section>
      <FPVBandContent />
      <section className="ls-section-py">
        <div className="ls-gutter studio-section">
          <LiminalSinStoryContent />
        </div>
      </section>
      <section className="ls-section-py bg-white/40">
        <div className="ls-gutter studio-section">
          <LiminalSinTrustContent />
        </div>
      </section>
      <section className="ls-section-py">
        <div className="ls-gutter studio-section">
          <LiminalSinCapabilitiesContent />
        </div>
      </section>
      <section className="ls-section-py bg-white/40">
        <div className="ls-gutter studio-section">
          <LiminalSinArchitectureContent />
        </div>
      </section>
      <section className="ls-section-py">
        <div className="ls-gutter studio-section">
          <LiminalSinSliceScopeContent />
        </div>
      </section>
      <section id="access" className="ls-section-py bg-white/40 scroll-mt-24">
        <div className="ls-gutter studio-section">
          <LiminalSinAccessContent />
        </div>
      </section>
      <LiminalSinAccessFooter />
    </div>
  );
}

export function LiminalSinLanding() {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <LiminalSinPageStatic />;
  }

  return (
    <div className="min-h-screen pb-8">
      <ScrollFoldScene
        outgoing={<LiminalSinHeroContent />}
        incoming={<LiminalSinExperienceContent />}
        id="experience"
        layout="cards"
        sceneHeight="200vh"
      />
      <ScrollFoldScene
        outgoing={<LiminalSinExperienceContent />}
        incoming={<FPVBandContent />}
        layout="band"
        sceneHeight="160vh"
      />
      <ScrollFoldScene
        outgoing={<FPVBandContent />}
        incoming={<LiminalSinStoryContent />}
        layout="plain"
      />
      <ScrollFoldScene
        outgoing={<LiminalSinStoryContent />}
        incoming={<LiminalSinTrustContent />}
        layout="cards"
      />
      <ScrollFoldScene
        outgoing={<LiminalSinTrustContent />}
        incoming={<LiminalSinCapabilitiesContent />}
        layout="grid"
        sceneHeight="220vh"
      />
      <ScrollFoldScene
        outgoing={<LiminalSinCapabilitiesContent />}
        incoming={<LiminalSinArchitectureContent />}
        layout="cards"
        sceneHeight="200vh"
      />
      <ScrollFoldScene
        outgoing={<LiminalSinArchitectureContent />}
        incoming={<LiminalSinSliceScopeContent />}
        layout="grid"
        sceneHeight="200vh"
      />
      <ScrollFoldScene
        outgoing={<LiminalSinSliceScopeContent />}
        incoming={<LiminalSinAccessContent />}
        id="access"
        layout="plain"
      />
      <LiminalSinAccessFooter />
    </div>
  );
}
