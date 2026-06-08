"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NO_CHROME_ROUTES = ["/ls/play"];

function shouldHideChrome(pathname: string) {
  return NO_CHROME_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  if (shouldHideChrome(pathname)) return null;

  return (
    <header className="site-gutter site-header-py sticky top-0 z-50 w-full border-b border-black/8 bg-white/75 backdrop-blur-xl">
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
        <nav className="flex items-center gap-4 sm:gap-6 text-sm">
          <Link
            href="/#projects"
            className="text-studio-text-muted hover:text-studio-text transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/ls"
            className="text-studio-text-muted hover:text-studio-text transition-colors"
          >
            Liminal Sin
          </Link>
          <a
            href="https://www.thes33k3r.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline text-studio-text-muted hover:text-studio-text transition-colors"
          >
            The S33k3r
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  if (shouldHideChrome(pathname)) return null;

  return (
    <footer className="site-gutter site-footer-py sticky bottom-0 z-50 w-full border-t border-black/8 bg-white/80 backdrop-blur-md mt-auto">
      <div className="max-w-[var(--content-max-width)] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm text-studio-text-muted">
        <span>
          &copy; {new Date().getFullYear()} Mycelia Interactive LLC. All rights
          reserved.
        </span>
        <Link
          href="/ls/privacy"
          className="hover:text-studio-accent transition-colors"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
