import Image from "next/image";
import Link from "next/link";
import FPVCarousel from "@/app/components/FPVCarousel";
import { LiminalSinAccessFooter } from "@/app/ls/LiminalSinAccessFooter";
import { LiminalSinHero } from "@/app/ls/LiminalSinHero";
import { LiminalSinStorySections } from "@/app/ls/LiminalSinStorySections";

export default function LiminalSinLanding() {
  return (
    <div className="bg-[#08041a] min-h-screen text-white relative">
      <nav className="ls-gutter ls-nav-py fixed top-0 z-50 w-full flex items-center justify-between bg-black/70 backdrop-blur-md border-b border-purple-900/50">
        <Link href="/" aria-label="Return to home">
          <Image
            src="/assets/images/Mycelia Interactive Banner.png"
            alt="Mycelia Interactive"
            width={360}
            height={100}
            className="h-10 sm:h-14 w-auto object-contain rounded drop-shadow-[0_0_10px_rgba(139,44,245,0.3)] transition-transform hover:scale-105"
          />
        </Link>

        <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 flex-wrap justify-end">
          <a
            href="/roadmap/roadmap.html"
            className="hidden sm:inline uppercase tracking-[0.125em] text-white hover:text-purple-400 transition-colors text-sm font-medium"
          >
            Roadmap
          </a>
          <a
            href="/ls"
            className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-hero-magenta-600 to-hero-cyan-600 font-semibold text-white text-xs sm:text-sm hover:from-hero-magenta-500 hover:to-hero-cyan-500 hover:shadow-[0_0_20px_rgba(139,44,245,0.5)] transition-all duration-300 whitespace-nowrap"
          >
            Play Liminal Sin Demo
          </a>
          <a
            href="/ls/lsr.html"
            className="hidden sm:inline-flex px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-hero-bg-light/50 border border-hero-cyan-400/30 text-cyan-50 text-xs sm:text-sm font-medium hover:bg-hero-cyan-900/40 hover:border-hero-cyan-300 hover:text-white transition-all duration-300"
          >
            Learn More
          </a>
        </div>
      </nav>

      <LiminalSinHero />
      <FPVCarousel />
      <LiminalSinStorySections />
      <LiminalSinAccessFooter />
    </div>
  );
}
