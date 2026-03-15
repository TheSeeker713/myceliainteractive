import Link from "next/link";

export default function MyceliaPage() {
  return (
    <section className="min-h-[80vh] bg-hero-bg-default px-6 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <div className="inline-block rounded-full border border-hero-magenta-500/30 bg-hero-magenta-900/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-hero-magenta-200">
            Independent Studio
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-hero-magenta-400 to-hero-cyan-400 bg-clip-text text-transparent drop-shadow-sm md:text-6xl">
            Mycelia Interactive
          </h1>
          <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-hero-cyan-500 to-transparent"></div>
          <p className="text-lg leading-relaxed text-hero-cyan-100/85 md:text-xl">
            Mycelia Interactive is an independent interactive narrative and experimental media studio focused on
            branching story systems, interactive cinema, alternate reality design, and emotionally reactive player
            experiences.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-hero-magenta-500/20 bg-white/5 p-6 backdrop-blur-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-hero-magenta-200">Ownership</h2>
            <p className="text-base leading-relaxed text-white/85">
              Mycelia Interactive is owned and operated by <strong>Jeremy W. Robards</strong>.
            </p>
          </div>
          <div className="rounded-2xl border border-hero-cyan-500/20 bg-white/5 p-6 backdrop-blur-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-hero-cyan-200">Current Focus</h2>
            <p className="text-base leading-relaxed text-white/85">
              The studio is currently centered on <strong>Liminal Sin</strong>, an interactive FMV psychological horror
              experience built around live AI orchestration, voice-driven play, and branching narrative pressure.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Creative Consultant</h2>
            <p className="text-base leading-relaxed text-white/85">
              <strong>Adrianna Loya</strong> contributed to Liminal Sin as creative consultant.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-3xl border border-hero-cyan-500/20 bg-gradient-to-br from-white/8 to-white/4 p-8 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
            <h2 className="mb-4 text-2xl font-semibold text-white">What Mycelia Interactive Is About</h2>
            <div className="space-y-4 text-white/80">
              <p>
                The studio focuses on building story worlds that react to player decisions with more than simple branch
                swaps. The goal is to create experiences where tone, trust, pressure, and narrative meaning shift in
                response to how a player behaves.
              </p>
              <p>
                That includes interactive cinema, voice-driven experiences, psychological horror systems, and hybrid
                forms that sit between game, film, and live simulation.
              </p>
              <p>
                The current flagship project, <strong>Liminal Sin</strong>, is the clearest expression of that direction:
                a surreal underground horror experience where the player speaks, the characters respond, and the world
                destabilizes in real time.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-hero-magenta-500/20 bg-gradient-to-br from-hero-magenta-950/35 to-hero-cyan-950/20 p-8 shadow-[0_0_60px_rgba(217,70,239,0.08)]">
            <h2 className="mb-4 text-2xl font-semibold text-white">Explore Liminal Sin</h2>
            <div className="space-y-4 text-white/80">
              <p>
                Enter the project hub, view the landing page, or go directly into the live game experience.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/ls"
                  className="rounded-xl border border-hero-cyan-400/30 bg-hero-cyan-500/10 px-4 py-3 text-sm font-semibold text-hero-cyan-100 transition-colors hover:bg-hero-cyan-500/20"
                >
                  Open Liminal Sin Hub
                </Link>
                <Link
                  href="/ls/game"
                  className="rounded-xl border border-hero-magenta-400/30 bg-hero-magenta-500/10 px-4 py-3 text-sm font-semibold text-hero-magenta-100 transition-colors hover:bg-hero-magenta-500/20"
                >
                  Go To Live Game Route
                </Link>
                <Link
                  href="/ls/judges/game"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10"
                >
                  Open Judges Build
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
