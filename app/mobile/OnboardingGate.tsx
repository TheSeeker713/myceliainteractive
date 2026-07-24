"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { callMobileSafe, runMobileSafe } from "@/app/mobile/guardMobile";
import { MobileFeatureErrorBoundary } from "@/app/mobile/MobileFeatureErrorBoundary";
import { attachVisualViewportFixedRoot } from "@/app/mobile/visualViewportFixedRoot";
import { useIsMobileViewport } from "@/app/mobile/useIsMobileViewport";
import {
  getOrientationPermissionState,
  requestOrientationPermission,
  type OrientationPermissionState,
} from "@/app/mobile/tiltInput";
import {
  hasSeenMotionOnboarding,
  hasTiltEnabled,
  markMotionOnboardingSeen,
  markTiltEnabled,
} from "@/app/mobile/onboardingStorage";
import "@/app/styles/mobile/onboarding-gate.css";

function subscribeNoop() {
  return () => {};
}

function useIsClient() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

type MotionOnboardingGateProps = {
  /** Called when tilt permission is granted (or non-iOS auto). */
  onTiltPermission: (state: OrientationPermissionState) => void;
  /** Focus the accessibility control in the header. */
  onOpenAccessibility?: () => void;
};

function MotionOnboardingGateInner({
  onTiltPermission,
  onOpenAccessibility,
}: MotionOnboardingGateProps) {
  const isClient = useIsClient();
  const { isMobileViewport } = useIsMobileViewport();
  const [open, setOpen] = useState(false);
  const [permission, setPermission] =
    useState<OrientationPermissionState>("unsupported");
  const rootRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!isClient) return;
    if (hasSeenMotionOnboarding()) {
      const state = getOrientationPermissionState();
      if (hasTiltEnabled() || state === "granted") {
        setPermission("granted");
        onTiltPermission("granted");
      } else {
        setPermission(state);
        onTiltPermission(state === "unsupported" ? "unsupported" : "denied");
      }
      return;
    }
    setPermission(getOrientationPermissionState());
    setOpen(true);
  }, [isClient, onTiltPermission]);

  useEffect(() => {
    if (!open || !isClient) return;
    const previous = document.body.style.overflow;
    runMobileSafe("onboarding-open", () => {
      document.body.style.overflow = "hidden";
      rootRef.current
        ?.querySelector<HTMLElement>("button, [href]")
        ?.focus();
    });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
    // dismiss is stable enough via ref pattern below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isClient]);

  useEffect(() => {
    if (!open || !isClient) return;
    const root = rootRef.current;
    if (!root) return;
    return callMobileSafe(
      "onboarding-vv",
      () => attachVisualViewportFixedRoot(root),
      () => {},
    );
  }, [open, isClient]);

  const dismiss = useCallback(() => {
    runMobileSafe("onboarding-dismiss", () => {
      markMotionOnboardingSeen();
      setOpen(false);
    });
  }, []);

  const enableTilt = async () => {
    // Hard iOS 13+ requirement: requestPermission inside the gesture handler.
    const result = await requestOrientationPermission();
    setPermission(result);
    if (result === "granted") {
      markTiltEnabled(true);
      onTiltPermission("granted");
    } else {
      markTiltEnabled(false);
      onTiltPermission(result);
    }
    dismiss();
  };

  const continueWithoutTilt = () => {
    onTiltPermission(
      permission === "granted" ? "granted" : "denied",
    );
    dismiss();
  };

  if (!open || !isClient) return null;

  const needsPermissionPrompt =
    isMobileViewport && permission === "prompt";

  return callMobileSafe(
    "onboarding-portal",
    () =>
      createPortal(
        <div
          ref={rootRef}
          className={`mycelia-onboarding-root${isMobileViewport ? "" : " mycelia-onboarding-root--desktop"}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
        >
          <div className="mycelia-onboarding-panel">
            <h2 id={titleId} className="mycelia-onboarding-title">
              Motion background
            </h2>
            <p id={descId} className="mycelia-onboarding-body">
              {isMobileViewport
                ? "This site uses a living motion atmosphere. Tilt your device to gently shift the background — or skip tilt and enjoy the ambient motion."
                : "This site uses a living motion atmosphere that responds to your pointer. You can turn motion down anytime."}
            </p>
            <p className="mycelia-onboarding-note">
              Prefer less motion? Open{" "}
              <button
                type="button"
                className="mycelia-onboarding-link"
                onClick={() => {
                  dismiss();
                  onOpenAccessibility?.();
                }}
              >
                Accessibility
              </button>{" "}
              and choose Reduce Motion — we don&apos;t duplicate that control here.
            </p>
            <div className="mycelia-onboarding-actions">
              {needsPermissionPrompt ? (
                <button
                  type="button"
                  className="mycelia-onboarding-primary"
                  onClick={() => {
                    void enableTilt();
                  }}
                >
                  Enable tilt motion
                </button>
              ) : null}
              <button
                type="button"
                className={
                  needsPermissionPrompt
                    ? "mycelia-onboarding-secondary"
                    : "mycelia-onboarding-primary"
                }
                onClick={continueWithoutTilt}
              >
                {isMobileViewport ? "Continue" : "Got it"}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      ),
    null,
  );
}

export function MotionOnboardingGate(props: MotionOnboardingGateProps) {
  return (
    <MobileFeatureErrorBoundary feature="onboarding-gate">
      <MotionOnboardingGateInner {...props} />
    </MobileFeatureErrorBoundary>
  );
}
