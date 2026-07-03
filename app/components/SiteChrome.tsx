"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NO_CHROME_ROUTES = ["/ls/play"];

function shouldHideChrome(pathname: string) {
  return NO_CHROME_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <Link href="/" aria-label="Mycelia Interactive LLC home">
          <Image
            src="/assets/images/Mycelia Interactive Banner.png"
            alt="Mycelia Interactive LLC"
            width={280}
            height={72}
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-5 text-sm">
          {navLinks}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2.5 -mr-2.5 text-studio-text-muted hover:text-studio-text"
          aria-label="Toggle navigation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
          <nav className="site-gutter py-4 flex flex-col gap-0 text-sm">
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
        <div className="flex items-center gap-4">
          <Link
            href="/privacy"
            className="hover:text-studio-accent transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/vision"
            className="hover:text-studio-accent transition-colors"
          >
            10-Year Vision
          </Link>
          <Link
            href="/ls/privacy"
            className="hover:text-studio-accent transition-colors"
          >
            Liminal Sin Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
