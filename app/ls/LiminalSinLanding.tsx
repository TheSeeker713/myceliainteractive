"use client";

import { useMemo } from "react";
import FPVCarousel from "@/app/components/FPVCarousel";
import { MyceliaCardStage } from "@/app/components/motion/MyceliaCardStage";
import { useMyceliaReduceMotion } from "@/app/components/motion/useMyceliaReduceMotion";
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

function FPVPane() {
  return (
    <div className="space-y-4 max-md:space-y-3">
      <p data-lg-kicker className="liquid-glass-kicker text-studio-accent">
        Atmosphere
      </p>
      <h2 className="liquid-glass-title font-semibold text-studio-text normal-case tracking-normal">
        Generative FPV stills
      </h2>
      <p className="liquid-glass-body text-studio-text-muted">
        Marketing-shell imagery generated for the Liminal Sin atmosphere —
        not gameplay footage.
      </p>
      <p className="text-sm text-studio-text-muted md:hidden">
        Gallery — atmospheric stills cycle below.
      </p>
      <div className="rounded-xl overflow-hidden border border-black/8">
        <FPVCarousel />
      </div>
    </div>
  );
}

function AccessFooterNote() {
  return (
    <div className="space-y-3">
      <p className="liquid-glass-body text-studio-text-muted">
        <span className="font-medium text-studio-text">Desktop experience:</span>{" "}
        Liminal Sin is designed for desktop browsers. Mobile play is not
        supported.
      </p>
      <p className="text-sm text-studio-text-muted">
        LIMINAL SIN&trade; is a work of interactive fiction. All characters and
        events are fictional.
      </p>
    </div>
  );
}

export function LiminalSinLanding() {
  const { reduceMotion } = useMyceliaReduceMotion();

  const panes = useMemo(
    () => [
      { label: "Liminal Sin hero", content: <LiminalSinHeroContent /> },
      {
        id: "experience",
        label: "Experience",
        content: <LiminalSinExperienceContent />,
      },
      { label: "First-person view", content: <FPVPane /> },
      { label: "Story", content: <LiminalSinStoryContent /> },
      { label: "Trust", content: <LiminalSinTrustContent /> },
      { label: "Capabilities", content: <LiminalSinCapabilitiesContent /> },
      { label: "Architecture", content: <LiminalSinArchitectureContent /> },
      { label: "Slice scope", content: <LiminalSinSliceScopeContent /> },
      {
        id: "access",
        label: "Request access",
        content: (
          <div className="space-y-8">
            <LiminalSinAccessContent />
            {/* ≤767: form already carries one desktop note; trim trademark block */}
            <div className="max-md:hidden">
              <AccessFooterNote />
            </div>
          </div>
        ),
      },
    ],
    [],
  );

  return <MyceliaCardStage panes={panes} reduceMotion={reduceMotion} />;
}
