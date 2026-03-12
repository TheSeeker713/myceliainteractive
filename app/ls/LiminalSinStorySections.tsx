import Image from "next/image";

const featureCards = [
  {
    icon: "🎙",
    label: "Your Voice Is the Mechanic",
    desc: "No controllers. No menus. You speak - and the characters react in real time. Social engineering is the only lever you have.",
  },
  {
    icon: "👁",
    label: "The House Watches You Back",
    desc: "The Game Master perceives your webcam and reads your vocal cadence. Your calm can be weaponized. Your panic will be punished.",
  },
  {
    icon: "🎞",
    label: "Full Motion Video - Generatively Rebuilt",
    desc: "Synthetic liminal Vegas spaces generated with VEO 3 and Kling 3.0. Architecture that shifts mid-scene. A door that was there a moment ago may dissolve into a wall.",
  },
  {
    icon: "🤖",
    label: "Agents, Not Actors",
    desc: "Jason, Audrey, and Josh are autonomous AI agents with individual trust and fear metrics. They remember. They resist. They can refuse.",
  },
  {
    icon: "🎰",
    label: "Slotsky - The Probability Engine",
    desc: "Not a monster. A force. The casino logic made sentient underground. It rearranges corridors. Removes exits. The house always wins.",
  },
  {
    icon: "🧱",
    label: "The Fourth Wall Is a Lie",
    desc: "Tell the characters they're in a simulation. Watch a Logic Collapse event shatter reality. The FMV tears. Anomalous Intensity spikes. Consequences are permanent.",
  },
] as const;

export function LiminalSinStorySections() {
  return (
    <>
      <section id="content" className="ls-section-py relative bg-[#050507]">
        <div className="ls-gutter max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-16 items-center">
            <div className="text-lg leading-relaxed text-gray-300 space-y-8">
              <p>
                <strong className="text-white">LIMINAL SIN</strong> is a
                prototype built on a new kind of interactive architecture. Set
                in the{" "}
                <span className="text-purple-300 font-semibold">
                  Vegas Underground
                </span>
                &nbsp;&mdash; a descent through impossible layers beneath a Las
                Vegas Strip casino &mdash; you become a disembodied voice woven
                into a living story. Three people are trapped. They can hear
                you. Whether they trust you is entirely up to them.
              </p>
              <p>
                This is{" "}
                <strong className="text-white">
                  Mycelia Interactive&apos;s
                </strong>
                &nbsp;first demonstration of real-time AI-driven narrative
                &mdash; where voice, emotion, and trust reshape the story as it
                unfolds. Not a branching menu. Not a chatbot. A system that
                watches, listens, and responds. The potential of this technology
                extends far beyond what any single experience can contain.
              </p>
            </div>

            <div className="relative w-full aspect-[16/9.5] rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl">
              <Image
                src="/assets/images/Liminal_Sin_Title.jpg"
                alt="Gameplay Sneak Peek"
                fill
                className="object-cover opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="ls-section-py relative bg-[#02010a]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(88,28,135,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="ls-gutter max-w-3xl mx-auto relative z-10 flex flex-col items-center gap-10 text-center">
          <p
            className="text-xs tracking-[0.35em] uppercase text-purple-400/60"
            style={{
              fontFamily: "var(--font-geist-mono), 'Courier New', monospace",
            }}
          >
            Origin Event - Layer 0
          </p>

          <div
            className="w-16 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(192,132,252,0.5), transparent)",
            }}
          />

          <div className="text-base sm:text-lg text-gray-400/80 leading-relaxed space-y-6 text-left">
            <p>
              Somewhere beneath the Las Vegas Strip, three people are missing.
              Not missing like lost. Missing like
              <span className="text-purple-300 font-semibold">
                &nbsp;they went somewhere they were not supposed to go
              </span>
              .
            </p>
            <p>
              They can still hear a voice. Yours. And right now, you are the
              only reason any of them are still alive.
            </p>
          </div>
        </div>
      </section>

      <section className="ls-section-py relative bg-[#050507]">
        <div className="ls-gutter max-w-7xl mx-auto flex flex-col items-center gap-12">
          <div className="text-center space-y-3 max-w-2xl">
            <p
              className="text-xs tracking-[0.35em] uppercase text-purple-400/60"
              style={{
                fontFamily: "var(--font-geist-mono), 'Courier New', monospace",
              }}
            >
              Core Mechanic
            </p>
            <h2
              className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-white"
              style={{ textShadow: "0 0 20px rgba(139,0,255,0.25)" }}
            >
              The Trust System
            </h2>
            <p className="text-gray-400/80 text-base leading-relaxed">
              The characters are agents, not actors. Their behavior shifts with
              every word you speak. Build trust through honesty. Destroy it
              through manipulation. Watch the house collect its debt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="relative rounded-2xl border border-purple-800/40 bg-[#0a0514]/70 backdrop-blur-md p-7 flex flex-col gap-4 overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(88,28,135,0.12) 0%, transparent 70%)",
                }}
              />
              <div className="relative z-10 flex flex-col gap-4">
                <h3 className="text-lg font-bold tracking-widest uppercase text-purple-200">
                  Neutral
                </h3>
                <p className="text-gray-400/80 text-sm leading-relaxed">
                  The characters are cautious but willing to listen. They
                  withhold critical survival secrets. Every interaction is a
                  calculation.
                </p>
              </div>
            </div>

            <div className="relative rounded-2xl border border-cyan-700/40 bg-[#00100f]/70 backdrop-blur-md p-7 flex flex-col gap-4 overflow-hidden">
              <div className="relative z-10 flex flex-col gap-4">
                <h3 className="text-lg font-bold tracking-widest uppercase text-cyan-200">
                  High Trust
                </h3>
                <p className="text-gray-400/80 text-sm leading-relaxed">
                  Compliance. Environmental clues surface. Survival hints are
                  shared. The characters follow your lead.
                </p>
              </div>
            </div>

            <div className="relative rounded-2xl border border-red-900/50 bg-[#0f0101]/70 backdrop-blur-md p-7 flex flex-col gap-4 overflow-hidden">
              <div className="relative z-10 flex flex-col gap-4">
                <h3 className="text-lg font-bold tracking-widest uppercase text-red-300">
                  Low Trust
                </h3>
                <p className="text-gray-400/80 text-sm leading-relaxed">
                  Unpredictable. They may disobey, hide information, or spiral
                  into paranoia. At the floor, the house begins to collect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ls-section-py relative bg-[#02010a]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 60%, rgba(126,34,206,0.1) 0%, transparent 70%)",
          }}
        />
        <div className="ls-gutter max-w-4xl mx-auto relative z-10 flex flex-col items-center gap-12">
          <div className="text-center space-y-3">
            <p className="text-xs tracking-[0.35em] uppercase text-purple-400/60">
              System Capabilities
            </p>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-white">
              What Awaits You
            </h2>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
            {featureCards.map(({ icon, label, desc }) => (
              <div
                key={label}
                className="flex gap-5 rounded-xl border border-purple-900/30 bg-[#0a0514]/50 p-6 hover:border-purple-700/50 hover:bg-[#0a0514]/80 transition-all duration-300 group"
              >
                <span
                  className="text-2xl mt-0.5 shrink-0 select-none"
                  aria-hidden="true"
                >
                  {icon}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-bold text-purple-200 uppercase tracking-wide group-hover:text-white transition-colors">
                    {label}
                  </h3>
                  <p className="text-gray-500/80 text-sm leading-relaxed group-hover:text-gray-400/90 transition-colors">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 text-center">
            <div
              className="w-16 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(192,132,252,0.4), transparent)",
              }}
            />
            <p className="text-sm text-purple-400/50">
              Prototype access opens below. First 30 subjects only.
            </p>
            <a
              href="#access"
              className="text-xs uppercase tracking-[0.25em] text-cyan-400/70 hover:text-cyan-300 transition-colors"
            >
              ↓ Request Access
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
