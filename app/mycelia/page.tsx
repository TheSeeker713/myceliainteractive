import Link from "next/link";

export default function MyceliaPage() {
  return (
    <section className="min-h-[80vh] bg-[radial-gradient(circle_at_20%_0%,rgba(168,85,247,0.16),transparent_42%),radial-gradient(circle_at_90%_15%,rgba(6,182,212,0.14),transparent_36%),linear-gradient(180deg,#0a0620_0%,#120b2b_40%,#080513_100%)] px-6 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
              Independent Studio
            </div>
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl">
              Mycelia Interactive
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-white/80 md:text-xl">
              Mycelia Interactive is an independent interactive narrative and experimental media studio focused on
              branching story systems, interactive cinema, alternate reality design, and emotionally reactive player
              experiences.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/ls"
                className="rounded-xl border border-cyan-300/40 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-400/20"
              >
                Liminal Sin Hub
              </Link>
              <Link
                href="/ls/game"
                className="rounded-xl border border-fuchsia-300/35 bg-fuchsia-400/10 px-4 py-2.5 text-sm font-semibold text-fuchsia-100 transition-colors hover:bg-fuchsia-400/20"
              >
                Play Live Route
              </Link>
              <Link
                href="/ls/judges/game"
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
              >
                Judges Build
              </Link>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/15 bg-white/5 p-7 shadow-[0_14px_44px_rgba(3,7,18,0.45)] backdrop-blur-sm">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200/90">Studio Snapshot</h2>
            <div className="space-y-5 text-white/85">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Owner</p>
                <p className="mt-1 text-xl font-semibold">Jeremy W. Robards</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Current Flagship</p>
                <p className="mt-1 text-base leading-relaxed">
                  <strong>Liminal Sin</strong> is an interactive FMV psychological horror experience built around live AI
                  orchestration, voice-driven play, and branching narrative pressure.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Creative Consultant</p>
                <p className="mt-1 text-base">Adrianna Loya</p>
              </div>
            </div>
          </aside>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-fuchsia-300/20 bg-black/20 p-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-200/90">Core Medium</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/80">Interactive cinema and branching narrative systems.</p>
          </div>
          <div className="rounded-2xl border border-cyan-300/20 bg-black/20 p-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/90">Creative Direction</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/80">Psychological tension, surreal spaces, and consequence-based interaction.</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-black/20 p-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Execution Model</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/80">Hybrid production across film language, game systems, and live AI behavior.</p>
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-300/20 bg-black/25 p-8 shadow-[0_18px_50px_rgba(3,7,18,0.42)]">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white">What Mycelia Interactive Is About</h2>
          <div className="max-w-4xl space-y-4 text-lg leading-relaxed text-white/80">
            <p>
              The studio builds story worlds that react to player decisions with more than branch swaps. The aim is to
              create experiences where tone, trust, pressure, and narrative meaning shift in response to player behavior.
            </p>
            <p>
              That includes interactive cinema, voice-driven experiences, psychological horror systems, and hybrid forms
              that sit between game, film, and live simulation.
            </p>
            <p>
              The current flagship project, <strong>Liminal Sin</strong>, is the clearest expression of that direction:
              a surreal underground horror experience where the player speaks, the characters respond, and the world
              destabilizes in real time.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-white/55">
            <span className="rounded-full border border-white/15 px-3 py-1">Interactive Narrative</span>
            <span className="rounded-full border border-white/15 px-3 py-1">FMV Systems</span>
            <span className="rounded-full border border-white/15 px-3 py-1">Voice-Driven Play</span>
            <span className="rounded-full border border-white/15 px-3 py-1">Psychological Horror</span>
            <span className="rounded-full border border-white/15 px-3 py-1">Adaptive Story Logic</span>
          </div>
        </div>

        <div className="text-center text-sm text-white/50">
          Mycelia Interactive • Interactive narrative and experimental media studio
        </div>
      </div>
    </section>
  );
}
