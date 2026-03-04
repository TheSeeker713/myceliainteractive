"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * SiteChrome — renders the global sticky header and footer.
 * Hidden on routes listed in NO_CHROME_ROUTES so self-contained pages
 * (e.g. /ls) can supply their own navigation.
 */

const NO_CHROME_ROUTES = ["/ls"];

export function SiteHeader() {
  const pathname = usePathname();
  if (NO_CHROME_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    return null;
  }
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#08041a]/90 border-b border-hero-cyan-500/20 py-8 lg:py-10 px-6 shadow-[0_4px_30px_rgba(0,199,255,0.15)] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-shrink-0">
          <Link href="/" aria-label="Return to home">
            <Image
              src="/assets/images/Mycelia Interactive Banner.png"
              alt="Mycelia Interactive"
              width={360}
              height={100}
              className="h-16 lg:h-20 w-auto object-contain rounded drop-shadow-[0_0_10px_rgba(139,44,245,0.3)] transition-transform hover:scale-105"
            />
          </Link>
        </div>
        <div className="hidden sm:flex gap-6 items-center">
          <a
            href="/roadmap/roadmap.html"
            className="px-4 py-2 text-sm font-medium text-cyan-200/70 hover:text-cyan-300 transition-colors duration-200 font-[family-name:var(--font-geist-mono)] tracking-wide"
          >
            Roadmap
          </a>
          <a
            href="/ls"
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-hero-magenta-600 to-hero-cyan-600 font-semibold text-white hover:from-hero-magenta-500 hover:to-hero-cyan-500 hover:shadow-[0_0_20px_rgba(139,44,245,0.5)] transition-all duration-300"
          >
            Play Liminal Sin Demo
          </a>
          <a
            href="/ls/lsr.html"
            className="px-6 py-2.5 rounded-lg bg-hero-bg-light/50 border border-hero-cyan-400/30 text-cyan-50 font-medium hover:bg-hero-cyan-900/40 hover:border-hero-cyan-300 hover:text-white transition-all duration-300"
          >
            Learn More
          </a>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  if (NO_CHROME_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    return null;
  }
  return (
    <footer className="sticky bottom-0 z-50 w-full backdrop-blur-md bg-[#140a36]/80 border-t border-hero-cyan-300/30 py-6 px-6 lg:py-8 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-start text-cyan-50/70 text-sm">
        &copy; {new Date().getFullYear()} Mycelia Interactive. All rights reserved.
      </div>
    </footer>
  );
}
