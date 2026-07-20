"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useRef, useState } from "react";
import { AccessibilityPanel } from "@/app/components/AccessibilityPanel";
import {
  AccessibilityBottomSheet,
  MobileFeatureErrorBoundary,
  PrimaryNavLinks,
  SiteMobileNavPanel,
  SiteMobileNavToggle,
  useIsMobileViewport,
} from "@/app/mobile";

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

  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setMobileOpen(false);
    setA11yOpen(false);
  }

  if (shouldHideChrome(pathname)) return null;

  const utilityCluster = (
    <div
      className="relative flex items-center gap-2"
      aria-label="Site preferences"
    >
      <button
        ref={a11yButtonRef}
        type="button"
        onClick={() => {
          setMobileOpen(false);
          setA11yOpen((open) => !open);
        }}
        className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-lg border border-black/10 bg-white/50 text-studio-text-muted hover:text-studio-text hover:bg-white/80 transition-colors pointer-events-auto"
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

      {/* Theme placeholder — disabled until Step 2c wires real theme state */}
      <div
        className="site-header-theme-cluster inline-flex min-h-11 items-stretch rounded-lg border border-black/10 bg-white/50 p-0.5 pointer-events-auto opacity-70"
        role="group"
        aria-label="Theme (coming soon)"
      >
        {(
          [
            { id: "system", label: "System" },
            { id: "lightside", label: "Lightside" },
            { id: "darkside", label: "Darkside" },
          ] as const
        ).map((option) => {
          const isDefaultVisual = option.id === "lightside";
          return (
            <button
              key={option.id}
              type="button"
              disabled
              aria-disabled="true"
              className={
                isDefaultVisual
                  ? "inline-flex items-center justify-center min-h-10 px-2 sm:px-2.5 rounded-md text-[0.65rem] sm:text-xs font-semibold tracking-wide text-studio-text bg-white/90 shadow-sm disabled:cursor-not-allowed"
                  : "inline-flex items-center justify-center min-h-10 px-2 sm:px-2.5 rounded-md text-[0.65rem] sm:text-xs font-semibold tracking-wide text-studio-text-muted disabled:cursor-not-allowed"
              }
              aria-label={`Theme: ${option.label} (coming soon)`}
              aria-pressed={isDefaultVisual}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <header className="site-gutter site-header-py sticky top-0 z-[var(--z-site-chrome)] w-full border-b border-black/8 bg-white/75 backdrop-blur-xl">
      <div className="max-w-[var(--content-max-width)] mx-auto flex items-center justify-between gap-3 sm:gap-4">
        <Link
          href="/"
          aria-label="Mycelia Interactive LLC home"
          className="inline-flex items-center min-h-11 py-1 shrink-0"
        >
          <Image
            src="/assets/images/Mycelia Interactive Banner.png"
            alt="Mycelia Interactive LLC"
            width={280}
            height={72}
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 min-w-0">
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
    <footer className="site-gutter site-footer-py sticky bottom-0 z-[var(--z-site-chrome)] w-full border-t border-black/8 bg-white/80 backdrop-blur-md mt-auto">
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
