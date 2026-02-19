import { Hero, HeroContent, Headline, Subheadline, CTAButton } from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Hero>
        <HeroContent>
          <Headline text="Every Choice Creates a Universe" />
          <Subheadline text="Interactive cinema where your decisions shape reality. Step into branching narratives and experience the story your way." />
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <CTAButton text="Enter Experience" variant="primary" />
            <CTAButton text="Learn More" variant="secondary" />
          </div>
        </HeroContent>
      </Hero>
    </main>
  );
}
