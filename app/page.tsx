import Image from "next/image";
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
          <div className="w-full lg:col-span-7 flex flex-col items-start">
            <Headline text="Every Choice Creates a Universe" />
            <Subheadline text="Interactive cinema where your decisions shape reality. Step into branching narratives and experience the story your way." />
          </div>

          <div className="w-full lg:col-span-5">
            <div className="relative overflow-hidden rounded-xl border border-hero-cyan-300/30 bg-hero-bg-default/30 p-2 shadow-[0_0_30px_rgba(0,199,255,0.18)]">
              <Image
                src="/assets/images/Mycelia Interactive Banner.png"
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
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="w-full max-w-md">
            <div className="h-full rounded-xl border border-hero-magenta-300/30 bg-hero-bg-dark/60 p-5 sm:p-6 backdrop-blur-sm shadow-[0_0_28px_rgba(139,44,245,0.18)]">
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
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center">
              <CTAButton text="Play Liminal Sin Demo" variant="primary" />
              <CTAButton text="Learn More" variant="secondary" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
