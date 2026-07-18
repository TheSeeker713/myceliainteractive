"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

const NO_CHROME_ROUTES = ["/ls/play"];

function shouldHideChrome(pathname: string) {
  return NO_CHROME_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navId = useId();

  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  if (shouldHideChrome(pathname)) return null;

  const navLinks = (
    <>
      <Link
        href="/#projects"
        className="text-studio-text-muted hover:text-studio-text transition-colors py-3"
        onClick={() => setMobileOpen(false)}
      >
        Projects
      </Link>
      <Link
        href="/ls"
        className="text-studio-text-muted hover:text-studio-text transition-colors py-3"
        onClick={() => setMobileOpen(false)}
      >
        Liminal Sin
      </Link>
      <Link
        href="/roadmap"
        className="text-studio-text-muted hover:text-studio-text transition-colors py-3"
        onClick={() => setMobileOpen(false)}
      >
        Roadmap
      </Link>
      <Link
        href="/vision"
        className="text-studio-text-muted hover:text-studio-text transition-colors py-3"
        onClick={() => setMobileOpen(false)}
      >
        10-Year Vision
      </Link>
      <Link
        href="/team"
        className="text-studio-text-muted hover:text-studio-text transition-colors py-3"
        onClick={() => setMobileOpen(false)}
      >
        Team
      </Link>
      <Link
        href="/contact"
        className="text-studio-text-muted hover:text-studio-text transition-colors py-3"
        onClick={() => setMobileOpen(false)}
      >
        Contact
      </Link>
      <a
        href="https://www.thes33k3r.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-studio-text-muted hover:text-studio-text transition-colors py-3"
        onClick={() => setMobileOpen(false)}
      >
        The S33k3r
      </a>
    </>
  );

  return (
    <header className="site-gutter site-header-py sticky top-0 z-[var(--z-site-chrome)] w-full border-b border-black/8 bg-white/75 backdrop-blur-xl">
      <div className="max-w-[var(--content-max-width)] mx-auto flex items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Mycelia Interactive LLC home"
          className="inline-flex items-center min-h-11 py-1"
        >
          <Image
            src="/assets/images/Mycelia Interactive Banner.png"
            alt="Mycelia Interactive LLC"
            width={280}
            height={72}
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-5 text-sm" aria-label="Primary">
          {navLinks}
        </nav>

        {/* Mobile Menu Button */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="lg:hidden inline-flex items-center justify-center min-h-11 min-w-11 p-2.5 -mr-2.5 text-studio-text-muted hover:text-studio-text"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls={navId}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {mobileOpen ? (
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
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-black/8 bg-white/95 backdrop-blur-xl">
          <nav
            id={navId}
            className="site-gutter py-4 flex flex-col gap-0 text-sm"
            aria-label="Mobile"
          >
            {navLinks}
          </nav>
        </div>
      )}
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
