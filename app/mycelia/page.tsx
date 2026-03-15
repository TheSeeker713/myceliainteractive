export default function MyceliaPage() {
  return (
    <section className="min-h-[80vh] bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,0.10),transparent_35%),radial-gradient(circle_at_85%_12%,rgba(168,85,247,0.10),transparent_32%),linear-gradient(180deg,#090711_0%,#0d0a18_55%,#07060d_100%)] px-6 py-16 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
          <div className="flex min-w-0 flex-1 flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-7 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
            <div className="inline-flex w-fit rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
              Independent Studio
            </div>
            <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-6xl">
              Mycelia Interactive
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-white/78 md:text-[1.35rem] md:leading-relaxed">
              Mycelia Interactive is an independent interactive narrative and experimental media studio focused on
              branching story systems, interactive cinema, alternate reality design, and emotionally reactive player
              experiences.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="rounded-full border border-cyan-300/35 bg-cyan-400/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
                [REDACTED]
              </span>
              <span className="rounded-full border border-fuchsia-300/35 bg-fuchsia-400/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-fuchsia-100">
                [REDACTED]
              </span>
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
                [REDACTED]
              </span>
            </div>
          </div>

          <aside className="w-full rounded-3xl border border-white/15 bg-white/[0.04] p-7 shadow-[0_14px_40px_rgba(0,0,0,0.36)] lg:w-[38%]">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200/90">Studio Snapshot</h2>
            <div className="space-y-5 text-white/84">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">Owner</p>
                <p className="mt-1 text-xl font-semibold">Jeremy W. Robards</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">Current Flagship</p>
                <p className="mt-1 text-base leading-relaxed text-white/82">
                  <strong>Liminal Sin</strong> is an interactive FMV psychological horror experience built around live AI
                  orchestration, voice-driven play, and branching narrative pressure.
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">Creative Consultant</p>
                <p className="mt-1 text-base text-white/82">Adrianna Loya</p>
              </div>
            </div>
          </aside>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="min-w-[220px] flex-1 rounded-2xl border border-fuchsia-300/20 bg-black/20 p-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-200/90">Core Medium</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/80">Interactive cinema and branching narrative systems.</p>
          </div>
          <div className="min-w-[220px] flex-1 rounded-2xl border border-cyan-300/20 bg-black/20 p-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/90">Creative Direction</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/80">Psychological tension, surreal spaces, and consequence-based interaction.</p>
          </div>
          <div className="min-w-[220px] flex-1 rounded-2xl border border-white/15 bg-black/20 p-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Execution Model</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/80">Hybrid production across film language, game systems, and live AI behavior.</p>
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-300/20 bg-black/25 p-8 shadow-[0_18px_45px_rgba(3,7,18,0.38)]">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white md:text-[2.15rem]">What Mycelia Interactive Is About</h2>
          <div className="max-w-5xl space-y-4 text-lg leading-relaxed text-white/79 md:text-[1.12rem]">
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

        <div className="text-center text-sm text-white/46">
          Mycelia Interactive • Interactive narrative and experimental media studio
        </div>
      </div>
    </section>
  );
}
