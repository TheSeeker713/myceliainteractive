"use client";

import { useMemo } from "react";
import { MyceliaCardStage } from "@/app/components/motion/MyceliaCardStage";
import { useMyceliaReduceMotion } from "@/app/components/motion/useMyceliaReduceMotion";
import { AboutContent } from "@/app/components/studio/sections/AboutSection";
import { HeroContent } from "@/app/components/studio/sections/HeroSection";
import { MissionContent } from "@/app/components/studio/sections/MissionSection";
import { ProjectSceneContent } from "@/app/components/studio/sections/ProjectsSection";
import { PROJECTS } from "@/app/components/studio/data";

export function HomePage() {
  const { reduceMotion } = useMyceliaReduceMotion();
  const [liminalSin, s33k3r, kaia, ais] = PROJECTS;

  const panes = useMemo(
    () => [
      { label: "Hero", content: <HeroContent /> },
      { label: "About", content: <AboutContent /> },
      { label: "Mission", content: <MissionContent /> },
      {
        id: "projects",
        label: liminalSin.name,
        content: <ProjectSceneContent project={liminalSin} />,
      },
      {
        label: s33k3r.name,
        content: <ProjectSceneContent project={s33k3r} />,
      },
      {
        label: kaia.name,
        content: <ProjectSceneContent project={kaia} />,
      },
      {
        label: ais.name,
        content: <ProjectSceneContent project={ais} />,
      },
    ],
    [liminalSin, s33k3r, kaia, ais],
  );

  return <MyceliaCardStage panes={panes} reduceMotion={reduceMotion} />;
}
