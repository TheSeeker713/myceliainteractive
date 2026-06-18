"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { shouldUseMotionShell } from "@/app/utils/motionRoutes";
import { ScrollStageRootProvider } from "./ScrollStageContext";
import { BokehParticles } from "./BokehParticles";
import { VideoBackground } from "./VideoBackground";

type SiteMotionShellProps = {
  children: ReactNode;
};

export function SiteMotionShell({ children }: SiteMotionShellProps) {
  const pathname = usePathname();
  const enabled = shouldUseMotionShell(pathname);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <ScrollStageRootProvider>
      <VideoBackground enabled={enabled} />
      <BokehParticles enabled={enabled} />
      <div className="relative z-[1]">{children}</div>
    </ScrollStageRootProvider>
  );
}
