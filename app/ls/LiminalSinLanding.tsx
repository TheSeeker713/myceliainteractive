"use client";

import FPVCarousel from "@/app/components/FPVCarousel";
import {
  LiquidGlassPage,
  LiquidGlassSurface,
} from "@/app/components/motion/LiquidGlassSurface";
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

export function LiminalSinLanding() {
  return (
    <LiquidGlassPage className="pb-8">
      <LiquidGlassSurface variant="cover" trackPointer>
        <LiminalSinHeroContent />
      </LiquidGlassSurface>

      <LiquidGlassSurface id="experience" variant="cover" trackPointer>
        <LiminalSinExperienceContent />
      </LiquidGlassSurface>

      <LiquidGlassSurface
        variant="cover"
        contentClassName="!p-0 sm:!p-0 lg:!p-0"
      >
        <div className="overflow-hidden rounded-[inherit]">
          <FPVCarousel />
        </div>
      </LiquidGlassSurface>

      <LiquidGlassSurface variant="cover">
        <LiminalSinStoryContent />
      </LiquidGlassSurface>

      <LiquidGlassSurface variant="cover">
        <LiminalSinTrustContent />
      </LiquidGlassSurface>

      <LiquidGlassSurface variant="cover">
        <LiminalSinCapabilitiesContent />
      </LiquidGlassSurface>

      <LiquidGlassSurface variant="cover">
        <LiminalSinArchitectureContent />
      </LiquidGlassSurface>

      <LiquidGlassSurface variant="cover">
        <LiminalSinSliceScopeContent />
      </LiquidGlassSurface>

      <LiquidGlassSurface id="access" variant="cover">
        <LiminalSinAccessContent />
      </LiquidGlassSurface>

      <LiminalSinAccessFooter />
    </LiquidGlassPage>
  );
}
