import { Hero, HeroContent, Headline, Subheadline, CTAButton, SplitScreen } from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Hero>
        <HeroContent>
          <div className="w-full lg:w-auto lg:col-span-1">
            <Headline text="Every Choice Creates a Universe" />
            <Subheadline text="Interactive cinema where your decisions shape reality. Step into branching narratives and experience the story your way." />
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <CTAButton text="Enter Experience" variant="primary" />
              <CTAButton text="Learn More" variant="secondary" />
            </div>
          </div>
        </HeroContent>
      </Hero>

      {/* Split-Screen Branching Demo - Phase 3 */}
      <section className="w-full px-6 sm:px-8 lg:px-12 py-20 sm:py-24 lg:py-32 bg-gradient-to-b from-hero-bg-dark to-hero-bg-default">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 text-center">
            Choose Your Path
          </h2>
          <p className="text-gray-200 text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
            Hover over each choice to explore the branching narrative. Every decision matters.
          </p>
          
          <SplitScreen
            enableHover={true}
            enableScroll={true}
            leftContent={
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-hero-magenta-300 mb-4">
                  Reality A
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  Dive into the unknown. Follow the glitching signals deeper into the alternate timeline.
                </p>
              </div>
            }
            rightContent={
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-hero-cyan-300 mb-4">
                  Reality B
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  Seek the truth. Navigate the branching paths to uncover what's really happening.
                </p>
              </div>
            }
          />
        </div>
      </section>
    </main>
  );
}
