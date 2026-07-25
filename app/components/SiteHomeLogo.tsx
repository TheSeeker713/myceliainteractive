"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

function subscribeOnboardingFlag(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-mycelia-onboarding"],
  });
  return () => observer.disconnect();
}

function getOnboardingOpenSnapshot() {
  return (
    document.documentElement.getAttribute("data-mycelia-onboarding") === "open"
  );
}

function getOnboardingOpenServerSnapshot() {
  return false;
}

type TipPos = { top: number; left: number };

/**
 * Home / brand control.
 * - Below lg (mobile + tablet hamburger chrome): existing banner — unchanged.
 * - lg+ (desktop nav chrome): new MI mark (mi_logo.webp) only.
 * Logo tip is pointer-events:none always — never a click-blocking layer and
 * does not participate in MotionOnboardingGate hit-testing (portaled tip sits
 * above the dimmer for visibility only, anchored to the logo rect).
 */
export function SiteHomeLogo() {
  const logoRef = useRef<HTMLAnchorElement>(null);
  const [tipPos, setTipPos] = useState<TipPos | null>(null);
  const onboardingOpen = useSyncExternalStore(
    subscribeOnboardingFlag,
    getOnboardingOpenSnapshot,
    getOnboardingOpenServerSnapshot,
  );
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!onboardingOpen) return;

    const update = () => {
      const rect = logoRef.current?.getBoundingClientRect();
      if (!rect) return;
      setTipPos({ top: rect.bottom + 4, left: rect.left });
    };

    const raf = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [onboardingOpen]);

  const tipClassName =
    "pointer-events-none rounded-md border border-[color:var(--theme-chrome-border)] bg-[color:var(--theme-popover-bg)] px-2 py-1 text-xs font-medium text-studio-text shadow-sm backdrop-blur-md whitespace-nowrap";

  return (
    <>
      <Link
        ref={logoRef}
        href="/"
        aria-label="Mycelia Interactive LLC home"
        className="site-home-logo group relative inline-flex items-center min-h-11 py-1 shrink-0 -ml-1 lg:ml-0"
      >
        {/* Mobile / tablet: keep current banner logo (explicitly not the MI mark). */}
        <Image
          src="/assets/images/Mycelia Interactive Banner.png"
          alt="Mycelia Interactive LLC"
          width={280}
          height={72}
          className="h-8 w-auto object-contain lg:hidden"
          priority
        />
        {/* Desktop-only mark */}
        <Image
          src="/assets/images/mi_logo.webp"
          alt="Mycelia Interactive LLC"
          width={160}
          height={160}
          className="hidden lg:block h-8 lg:h-9 w-auto object-contain"
          priority
        />
        {/* Hover / focus tip — desktop only; never captures pointer events */}
        <span
          className={`${tipClassName} absolute left-0 top-full mt-1 z-[1] opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 hidden lg:block`}
          aria-hidden="true"
        >
          Mycelia Interactive
        </span>
      </Link>

      {/*
        Onboarding: tip portaled above the gate dimmer, positioned from the
        logo's getBoundingClientRect (not viewport gutters — content is centered).
        pointer-events-none — does not block gate dismiss / CTA clicks.
      */}
      {isClient && onboardingOpen && tipPos
        ? createPortal(
            <span
              className={`${tipClassName} fixed z-[calc(var(--z-site-chrome)+45)] hidden lg:block`}
              style={{ top: tipPos.top, left: tipPos.left }}
              aria-hidden="true"
            >
              Mycelia Interactive
            </span>,
            document.body,
          )
        : null}
    </>
  );
}
