"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { shouldUseMotionShell } from "@/app/utils/motionRoutes";
import { MyceliaFlowAtmosphere } from "./MyceliaFlowAtmosphere";
import { useMyceliaReduceMotion } from "./useMyceliaReduceMotion";

type SiteMotionShellProps = {
  children: ReactNode;
};

/**
 * A6 cutover: Mycelia Flow WebGL atmosphere.
 * VideoBackground.tsx remains in the repo for rollback until A8.
 */
export function SiteMotionShell({ children }: SiteMotionShellProps) {
  const pathname = usePathname();
  const enabled = shouldUseMotionShell(pathname);
  const { reduceMotion } = useMyceliaReduceMotion();

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <>
      <MyceliaFlowAtmosphere reduceMotionOptIn={reduceMotion} />
      <div className="relative z-[var(--z-site-content)]">{children}</div>
    </>
  );
}
