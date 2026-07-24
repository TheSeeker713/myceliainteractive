"use client";

import { usePathname } from "next/navigation";
import { useCallback, useState, type ReactNode } from "react";
import { useAccessibilityUiPrefs } from "@/app/components/accessibility/useAccessibilityUiPrefs";
import { MotionOnboardingGate } from "@/app/mobile/OnboardingGate";
import { MobileTiltParallax } from "@/app/mobile/MobileTiltParallax";
import type { OrientationPermissionState } from "@/app/mobile/tiltInput";
import { shouldUseMotionShell } from "@/app/utils/motionRoutes";
import { MyceliaFlowAtmosphere } from "./MyceliaFlowAtmosphere";
import { useMyceliaReduceMotion } from "./useMyceliaReduceMotion";

export const OPEN_ACCESSIBILITY_EVENT = "mycelia:open-accessibility";

type SiteMotionShellProps = {
  children: ReactNode;
};

/**
 * A6 cutover: Mycelia Flow WebGL atmosphere.
 * VideoBackground.tsx remains in the repo for rollback until A8.
 * Part 4: onboarding gate + mobile tilt → shared pointer bridge.
 */
export function SiteMotionShell({ children }: SiteMotionShellProps) {
  const pathname = usePathname();
  const enabled = shouldUseMotionShell(pathname);
  const { reduceMotion } = useMyceliaReduceMotion();
  const { prefs } = useAccessibilityUiPrefs();
  const [tiltPermission, setTiltPermission] =
    useState<OrientationPermissionState>("unsupported");

  const onTiltPermission = useCallback((state: OrientationPermissionState) => {
    setTiltPermission(state);
  }, []);

  const onOpenAccessibility = useCallback(() => {
    window.dispatchEvent(new CustomEvent(OPEN_ACCESSIBILITY_EVENT));
  }, []);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <>
      <MyceliaFlowAtmosphere
        reduceMotionOptIn={reduceMotion}
        pauseAtmosphere={prefs.pauseAtmosphere}
      />
      {!reduceMotion && !prefs.pauseAtmosphere ? (
        <>
          <MotionOnboardingGate
            onTiltPermission={onTiltPermission}
            onOpenAccessibility={onOpenAccessibility}
          />
          <MobileTiltParallax
            enabled={!reduceMotion && !prefs.pauseAtmosphere}
            permission={tiltPermission}
          />
        </>
      ) : null}
      <div className="relative z-[var(--z-site-content)]">{children}</div>
    </>
  );
}
