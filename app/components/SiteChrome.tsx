"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AccessibilityPanel } from "@/app/components/AccessibilityPanel";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { OPEN_ACCESSIBILITY_EVENT } from "@/app/components/motion/SiteMotionShell";
import {
  AccessibilityBottomSheet,
  MobileFeatureErrorBoundary,
  PrimaryNavLinks,
  SiteMobileNavPanel,
  SiteMobileNavToggle,
  useIsMobileViewport,
} from "@/app/mobile";
import "@/app/styles/mobile/site-chrome.mobile.css";

const NO_CHROME_ROUTES = ["/ls/play"];

function shouldHideChrome(pathname: string) {
  return NO_CHROME_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { isMobileViewport } = useIsMobileViewport();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const a11yButtonRef = useRef<HTMLButtonElement>(null);
  const navId = useId();
  const a11yPanelId = useId();
  const closeA11y = () => setA11yOpen(false);

  useEffect(() => {
    const onOpen = () => {
      setMobileOpen(false);
      setA11yOpen(true);
      a11yButtonRef.current?.focus();
    };
    window.addEventListener(OPEN_ACCESSIBILITY_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ACCESSIBILITY_EVENT, onOpen);
  }, []);

  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setMobileOpen(false);
    setA11yOpen(false);
  }

  if (shouldHideChrome(pathname)) return null;

  const utilityCluster = (
    <div
      className="relative flex items-center gap-1.5 sm:gap-2"
      aria-label="Site preferences"
    >
      <button
        ref={a11yButtonRef}
        type="button"
        onClick={() => {
          setMobileOpen(false);
          setA11yOpen((open) => !open);
        }}
        className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-lg border border-[color:var(--theme-chrome-border)] bg-[color:var(--theme-utility-bg)] text-studio-text hover:bg-[color:var(--theme-utility-bg-active)] transition-colors pointer-events-auto"
        aria-label="Accessibility options"
        aria-expanded={a11yOpen}
        aria-controls={a11yPanelId}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <circle cx="12" cy="4.5" r="2" strokeWidth={2} />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v3m0 0c-2.5 0-4.5 1.2-5.5 3M12 11c2.5 0 4.5 1.2 5.5 3M9 21l1.5-7M15 21l-1.5-7"
          />
        </svg>
      </button>

      {isMobileViewport ? (
        <MobileFeatureErrorBoundary feature="a11y-sheet">
          <AccessibilityBottomSheet
            id={a11yPanelId}
            open={a11yOpen}
            onClose={closeA11y}
            triggerRef={a11yButtonRef}
          />
        </MobileFeatureErrorBoundary>
      ) : (
        <AccessibilityPanel
          id={a11yPanelId}
          open={a11yOpen}
          onClose={closeA11y}
          triggerRef={a11yButtonRef}
        />
      )}

      <ThemeToggle />
    </div>
  );

  return (
    <header className="site-gutter site-header-py sticky top-0 z-[var(--z-site-chrome)] w-full border-b border-[color:var(--theme-chrome-border)] bg-[color:var(--theme-chrome-bg)] backdrop-blur-xl">
      <div className="max-w-[var(--content-max-width)] mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <Link
          href="/"
          aria-label="Mycelia Interactive LLC home"
          className="inline-flex items-center min-h-11 py-1 shrink-0 -ml-1"
        >
          <Image
            src="/assets/images/Mycelia Interactive Banner.png"
            alt="Mycelia Interactive LLC"
            width={280}
            height={72}
            className="h-8 md:h-10 lg:h-12 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-5 min-w-0">
          <nav
            className="hidden lg:flex items-center gap-5 text-sm"
            aria-label="Primary"
          >
            <PrimaryNavLinks variant="desktop" />
          </nav>

          {utilityCluster}

          <MobileFeatureErrorBoundary feature="mobile-nav-toggle">
            <SiteMobileNavToggle
              open={mobileOpen}
              onOpenChange={setMobileOpen}
              onBeforeOpen={closeA11y}
              navId={navId}
              menuButtonRef={menuButtonRef}
            />
          </MobileFeatureErrorBoundary>
        </div>
      </div>

      <MobileFeatureErrorBoundary feature="mobile-nav-panel">
        <SiteMobileNavPanel
          open={mobileOpen}
          onOpenChange={setMobileOpen}
          navId={navId}
          menuButtonRef={menuButtonRef}
        />
      </MobileFeatureErrorBoundary>
    </header>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  if (shouldHideChrome(pathname)) return null;

  return (
    <footer className="site-footer site-gutter site-footer-py sticky bottom-0 max-md:static z-[var(--z-site-chrome)] w-full border-t border-[color:var(--theme-chrome-border)] bg-[color:var(--theme-chrome-footer-bg)] backdrop-blur-md mt-auto">
      <div className="max-w-[var(--content-max-width)] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm text-studio-text-muted">
        <span>
          &copy; {new Date().getFullYear()} Mycelia Interactive LLC. All rights
          reserved.
        </span>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link
            href="/privacy"
            className="inline-flex items-center min-h-11 px-2 hover:text-studio-accent transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/vision"
            className="inline-flex items-center min-h-11 px-2 hover:text-studio-accent transition-colors"
          >
            10-Year Vision
          </Link>
          <Link
            href="/ls/privacy"
            className="inline-flex items-center min-h-11 px-2 hover:text-studio-accent transition-colors"
          >
            Liminal Sin Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
