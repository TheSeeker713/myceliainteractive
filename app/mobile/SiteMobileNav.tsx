"use client";

import Link from "next/link";
import { useEffect, type RefObject } from "react";
import { runMobileSafe } from "@/app/mobile/guardMobile";
import "@/app/styles/mobile/site-chrome.mobile.css";

export type PrimaryNavItem =
  | { label: string; href: string; external?: false }
  | { label: string; href: string; external: true };

/** Shared primary destinations for desktop header nav and mobile drawer. */
export const PRIMARY_NAV_ITEMS: readonly PrimaryNavItem[] = [
  { label: "Projects", href: "/#projects" },
  { label: "Liminal Sin", href: "/ls" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "10-Year Vision", href: "/vision" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
  {
    label: "The S33k3r",
    href: "https://www.thes33k3r.com",
    external: true,
  },
] as const;

const DESKTOP_LINK_CLASS =
  "text-studio-text-muted hover:text-studio-text transition-colors py-3";

type PrimaryNavLinksProps = {
  onNavigate?: () => void;
  /** Desktop uses horizontal link styles; mobile list uses CSS classes. */
  variant?: "desktop" | "mobile";
};

export function PrimaryNavLinks({
  onNavigate,
  variant = "desktop",
}: PrimaryNavLinksProps) {
  const className = variant === "desktop" ? DESKTOP_LINK_CLASS : undefined;

  return (
    <>
      {PRIMARY_NAV_ITEMS.map((item) =>
        item.external ? (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
            onClick={onNavigate}
          >
            {item.label}
          </a>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            className={className}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        ),
      )}
    </>
  );
}

type SiteMobileNavToggleProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Close a11y when opening the nav drawer (utilities stay in the bar). */
  onBeforeOpen?: () => void;
  navId: string;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
};

/** Hamburger control — sits in the header utility row. */
export function SiteMobileNavToggle({
  open,
  onOpenChange,
  onBeforeOpen,
  navId,
  menuButtonRef,
}: SiteMobileNavToggleProps) {
  return (
    <button
      ref={menuButtonRef}
      type="button"
      onClick={() => {
        runMobileSafe("mobile-nav-toggle", () => {
          if (!open) onBeforeOpen?.();
          onOpenChange(!open);
        });
      }}
      className="lg:hidden inline-flex items-center justify-center min-h-11 min-w-11 p-2.5 -mr-2.5 text-studio-text-muted hover:text-studio-text pointer-events-auto"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls={open ? navId : undefined}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        {open ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </button>
  );
}

type SiteMobileNavPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navId: string;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
};

/**
 * Mobile nav link drawer only (below the header bar row).
 * Accessibility and Theme controls remain in the header utility cluster.
 */
export function SiteMobileNavPanel({
  open,
  onOpenChange,
  navId,
  menuButtonRef,
}: SiteMobileNavPanelProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        runMobileSafe("mobile-nav-escape", () => {
          onOpenChange(false);
          menuButtonRef.current?.focus();
        });
      }
    };

    runMobileSafe("mobile-nav-focus", () => {
      const first = document
        .getElementById(navId)
        ?.querySelector<HTMLElement>("a, button");
      first?.focus();
    });

    document.addEventListener("keydown", onKeyDown);
    return () => {
      runMobileSafe("mobile-nav-escape-detach", () => {
        document.removeEventListener("keydown", onKeyDown);
      });
    };
  }, [open, onOpenChange, menuButtonRef, navId]);

  if (!open) return null;

  return (
    <div className="site-mobile-nav-panel lg:hidden">
      <nav
        id={navId}
        className="site-mobile-nav-list site-gutter"
        aria-label="Mobile"
      >
        <PrimaryNavLinks
          variant="mobile"
          onNavigate={() => onOpenChange(false)}
        />
      </nav>
    </div>
  );
}
