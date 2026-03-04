import Image from "next/image";
import Link from "next/link";
import {
  Hero,
  HeroContent,
  Headline,
  Subheadline,
  CTAButton,
} from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Hero>
        <HeroContent>
          <div className="w-full lg:col-span-12 flex flex-col items-center text-center mb-12">
            <Headline text="Every Choice Creates: A Universe" />
            <Subheadline text="Interactive cinema where your decisions shape reality. Step into branching narratives and experience the story your way." />
          </div>

          <div className="w-full lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
            {/* Left Card: Mycelia Logo */}
            <Link href="/mycelia" className="w-full group block">
              <div className="relative overflow-hidden rounded-2xl border border-hero-magenta-400/40 bg-hero-bg-dark/40 p-3 shadow-[0_0_40px_rgba(139,44,245,0.25)] transition-all duration-700 hover:shadow-[0_0_60px_rgba(139,44,245,0.4)] hover:-translate-y-2 cursor-pointer flex flex-col justify-center">
                <div className="relative rounded-xl overflow-hidden animate-[pulse_4s_ease-in-out_infinite]">
                  <Image
                    src="/assets/images/Mycelia_Interactive_Logo.jpg"
                    alt="Mycelia Interactive logo"
                    width={1024}
                    height={1024}
                    className="h-auto w-full rounded-xl object-contain transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </Link>

            {/* Right Card: Liminal Sin */}
            <Link href="/liminal-sin" className="w-full group/game block">
              <div className="relative overflow-hidden rounded-2xl border border-hero-cyan-400/30 shadow-[0_0_50px_rgba(0,199,255,0.2)] transition-all duration-700 hover:shadow-[0_0_80px_rgba(0,199,255,0.4)] hover:-translate-y-2 flex flex-col justify-center">
                <Image
                  src="/assets/images/Liminal_Sin_Title.jpg"
                  alt="Liminal Sin Title"
                  width={1280}
                  height={720}
                  className="w-full h-auto object-contain rounded-xl opacity-85 transition-all duration-700 group-hover/game:opacity-100 group-hover/game:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-hero-bg-dark/95 via-hero-bg-dark/40 to-transparent flex flex-col justify-end p-6 sm:p-8 opacity-0 group-hover/game:opacity-100 transition-opacity duration-500 rounded-xl">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    LIMINAL SIN
                  </h3>
                  <p className="text-hero-cyan-100 text-sm sm:text-base mb-4 max-w-sm drop-shadow-md">
                    Descend into an interactive FMV psychological horror
                    experience where trust is an illusion.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-auto">
                    <CTAButton text="Reserve Spot" variant="primary" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </HeroContent>
      </Hero>
      <section className="w-full px-4 sm:px-6 lg:px-12 py-10 bg-gradient-to-b from-hero-bg-dark to-hero-bg-default"></section>
    </main>
  );
}
