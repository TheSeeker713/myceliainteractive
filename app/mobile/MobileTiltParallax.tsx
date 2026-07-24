"use client";

import { useEffect, useRef } from "react";
import { callMobileSafe, runMobileSafe } from "@/app/mobile/guardMobile";
import { pushAtmospherePointer } from "@/app/mobile/atmospherePointerBridge";
import {
  orientationToClientPoint,
  type OrientationPermissionState,
} from "@/app/mobile/tiltInput";
import { MobileFeatureErrorBoundary } from "@/app/mobile/MobileFeatureErrorBoundary";

type MobileTiltParallaxProps = {
  enabled: boolean;
  /** After onboarding permission grant (or non-iOS auto). */
  permission: OrientationPermissionState;
};

/**
 * Device-orientation → atmosphere pointer bridge (Part 4).
 * No-ops when permission is not granted or the API is missing.
 */
function MobileTiltParallaxInner({
  enabled,
  permission,
}: MobileTiltParallaxProps) {
  const lastRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled || permission !== "granted") return;
    if (typeof window === "undefined") return;
    if (typeof DeviceOrientationEvent === "undefined") return;

    const onOrient = (event: DeviceOrientationEvent) => {
      runMobileSafe("tilt-orient", () => {
        const point = orientationToClientPoint(
          { beta: event.beta, gamma: event.gamma },
          window.innerWidth,
          window.innerHeight,
        );
        if (!point) return;
        // Light deadzone to avoid jitter when nearly still.
        const dx = point.clientX - lastRef.current.x;
        const dy = point.clientY - lastRef.current.y;
        if (Math.hypot(dx, dy) < 1.5) return;
        lastRef.current = { x: point.clientX, y: point.clientY };
        pushAtmospherePointer(point);
      });
    };

    return callMobileSafe(
      "tilt-attach",
      () => {
        window.addEventListener("deviceorientation", onOrient, {
          passive: true,
        });
        return () => {
          window.removeEventListener("deviceorientation", onOrient);
        };
      },
      () => {},
    );
  }, [enabled, permission]);

  return null;
}

export function MobileTiltParallax(props: MobileTiltParallaxProps) {
  return (
    <MobileFeatureErrorBoundary feature="tilt-parallax">
      <MobileTiltParallaxInner {...props} />
    </MobileFeatureErrorBoundary>
  );
}
