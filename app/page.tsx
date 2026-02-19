import Image from "next/image";
import { Hero, HeroContent, Headline, Subheadline, CTAButton, SplitScreen } from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Hero>
        <HeroContent>
          <div className="w-full lg:col-span-7 flex flex-col items-start">
            <Headline text="Every Choice Creates a Universe" />
            <Subheadline text="Interactive cinema where your decisions shape reality. Step into branching narratives and experience the story your way." />
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <CTAButton text="Enter Experience" variant="primary" />
              <CTAButton text="Learn More" variant="secondary" />
            </div>
          </div>

          <div className="w-full lg:col-span-5">
            <div className="relative overflow-hidden rounded-xl border border-hero-cyan-300/30 bg-hero-bg-default/30 p-2 shadow-[0_0_30px_rgba(0,199,255,0.18)]">
              <Image
                src="/assets/images/Mycelia%20Interactive%20Banner.png"
                alt="Mycelia Interactive cyber-themed banner"
                width={1366}
                height={768}
                priority
                className="h-auto w-full rounded-lg object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 45vw"
              />
            </div>
          </div>
        </HeroContent>
      </Hero>

      <section className="w-full px-4 sm:px-6 lg:px-12 py-14 sm:py-18 lg:py-24 bg-gradient-to-b from-hero-bg-dark to-hero-bg-default">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 text-center">
            Choose Your Path
          </h2>
          <p className="text-cyan-50/85 text-center mb-8 sm:mb-10 max-w-2xl mx-auto text-sm sm:text-base">
            Hover over each choice to explore the branching narrative. Every decision matters.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <div className="lg:col-span-8">
              <SplitScreen
                enableHover={true}
                enableScroll={true}
                leftContent={
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-hero-magenta-200 mb-3">
                      Reality A
                    </h3>
                    <p className="text-cyan-50/80 text-sm sm:text-base">
                      Dive into the unknown. Follow the glitching signals deeper into the alternate timeline.
                    </p>
                  </div>
                }
                rightContent={
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-hero-cyan-200 mb-3">
                      Reality B
                    </h3>
                    <p className="text-cyan-50/80 text-sm sm:text-base">
                      Seek the truth. Navigate the branching paths to uncover what&apos;s really happening.
                    </p>
                  </div>
                }
              />
            </div>

            <div className="lg:col-span-4">
              <div className="h-full rounded-xl border border-hero-magenta-300/30 bg-hero-bg-dark/60 p-5 sm:p-6 backdrop-blur-sm shadow-[0_0_28px_rgba(139,44,245,0.18)]">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Brand Identity</h3>
                <div className="relative overflow-hidden rounded-lg border border-hero-cyan-300/35 bg-hero-bg-default/30 p-2">
                  <Image
                    src="/assets/images/Mycelia_Interactive_Logo.jpg"
                    alt="Mycelia Interactive logo"
                    width={1024}
                    height={1024}
                    className="h-auto w-full rounded-md object-cover"
                    sizes="(max-width: 1024px) 100vw, 30vw"
                  />
                </div>
                <p className="mt-4 text-cyan-50/80 text-sm leading-relaxed">
                  Neon cyan and violet highlights now drive the full interface to match your reference artwork.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
