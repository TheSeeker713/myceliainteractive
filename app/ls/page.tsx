import Image from "next/image";
import { CTAButton } from "@/components/Hero";

export default function LiminalSinLanding() {
  return (
    <main className="bg-hero-bg-dark min-h-screen text-white pb-20">
      {/* Cinematic Hero */}
      <div className="relative w-full h-[60vh] md:h-[75vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/Liminal_Sin_Title.jpg"
            alt="Liminal Sin Backdrop"
            fill
            className="object-cover opacity-40 mix-blend-luminosity duration-1000 animate-pulse"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-hero-bg-dark via-hero-bg-default/60 to-transparent"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto mt-20">
          <div className="mb-6 drop-shadow-[0_0_30px_rgba(255,0,50,0.4)]">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-widest uppercase">
              LIMINAL SIN
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-red-100/90 font-light mb-10 max-w-2xl mx-auto drop-shadow-md">
            An Interactive FMV Psychological Horror where your reality is
            fractured, and trust is the true illusion.
          </p>
          <div className="flex gap-6">
            <a href="#signup">
              <CTAButton text="Reserve Your Origin" variant="primary" />
            </a>
          </div>
        </div>
      </div>

      {/* The Pitch */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24 text-center space-y-8">
        <h2 className="text-3xl md:text-5xl font-bold text-hero-cyan-300 mb-8">
          Will You Uncover the Truth?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left items-center">
          <div className="space-y-6 text-cyan-50/80 text-lg leading-relaxed">
            <p>
              In <strong className="text-white">LIMINAL SIN</strong>, you don&apos;t
              just watch a movie; you direct the nightmare. Navigating through
              branching timelines built with hundreds of cinematic FMV (Full
              Motion Video) clips, every choice spirals you deeper into a
              labyrinth of buried secrets and broken memories.
            </p>
            <p>
              Investigate the anomalies. Hunt for the glitched artifacts. Choose
              who to trust. The narrative adapts to your paranoia. Who is the
              Game Master?
            </p>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-hero-magenta-500/30 p-2 shadow-[0_0_30px_rgba(139,44,245,0.2)]">
            <Image
              src="/assets/images/Liminal_Sin_Title.jpg"
              alt="Gameplay Sneak Peek"
              width={800}
              height={450}
              className="w-full h-auto rounded-lg rounded-xl opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </section>

      {/* Forms Section Stub (Step 4 placeholder) */}
      <section id="signup" className="max-w-4xl mx-auto px-6 py-12">
        <div className="border border-hero-cyan-500/20 bg-hero-bg-default/60 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl">
          <h3 className="text-2xl font-bold text-center mb-4">
            Initializing Connection Protocols...
          </h3>
          <p className="text-center text-cyan-100/50">
            Access terminals loading in next phase.
          </p>
        </div>
      </section>
    </main>
  );
}
