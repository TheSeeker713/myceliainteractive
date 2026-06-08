import Image from "next/image";
import Link from "next/link";

const PROJECTS = [
  {
    name: "Liminal Sin",
    featured: true,
    description:
      "A psychological interactive experience built around a real-time AI trust and response system. No fixed narrative paths — characters react to what you actually do. Vertical slice prototype submitted to the Gemini Live Agent Challenge 2026.",
    href: "/ls",
    external: false,
  },
  {
    name: "The S33k3r Transmission",
    description:
      "A fully functional ARG and FMV interactive music video experience — a live demonstration of interactive entertainment on a public platform.",
    href: "https://www.thes33k3r.com",
    external: true,
  },
  {
    name: "KAIA",
    description:
      "Keep At It, Always — a gamified AI productivity assistant for neurodivergent users, featuring a persistent adaptive avatar companion. Currently in pre-production.",
    href: null,
    external: false,
  },
  {
    name: "Altered Imagination Studios",
    description:
      "A daily AI video content brand operating under the Mycelia Interactive umbrella — production output and live pipeline development for AI video generation.",
    href: null,
    external: false,
  },
] as const;

const TEAM = [
  {
    name: "Adrianna Loya",
    role: "Co-founder · CEO, CCO, CFO",
    detail:
      "Leads Altered Imagination Studios and company operations and finance.",
    email: "adrianna@myceliainteractive.com",
  },
  {
    name: "Jeremy Robards",
    role: "Founder · CTO, CAIO, CCO",
    detail:
      "Leads product development, creative direction, interactive systems, and technical architecture.",
    email: "jeremy@myceliainteractive.com",
  },
] as const;

export function HomePage() {
  return (
    <div className="site-gutter pb-20">
      <section className="studio-section pt-16 sm:pt-24 pb-16 sm:pb-20">
        <p className="text-sm font-medium tracking-wide text-studio-accent uppercase mb-4">
          New Mexico · Est. 2026
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-studio-text max-w-3xl">
          Mycelia Interactive LLC
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-studio-text-muted max-w-2xl leading-relaxed">
          Immersive interactive entertainment where the audience participates.
          Characters hear you. Stories respond in real time.
        </p>
        <p className="mt-4 text-base text-studio-text-muted max-w-2xl">
          Named for the mycelium network — a branching, living structure that
          connects audiences to narrative in ways linear media cannot.
        </p>
      </section>

      <section className="studio-section pb-16">
        <h2 className="text-2xl font-semibold mb-4">About</h2>
        <div className="studio-card p-6 sm:p-8 space-y-4 text-studio-text-muted max-w-3xl">
          <p>
            Mycelia Interactive LLC is an entertainment company developing
            original intellectual property across film, interactive experiences,
            games, and music. Our defining focus is real-time AI-driven response
            systems that use voice and vision — entertainment where audience
            behavior shapes the experience as it unfolds.
          </p>
          <p>
            All intellectual property developed under the Mycelia Interactive
            name is owned in full by the company. We do not develop licensed or
            adapted third-party properties.
          </p>
        </div>
      </section>

      <section className="studio-section pb-16">
        <h2 className="text-2xl font-semibold mb-4">Mission</h2>
        <p className="text-studio-text-muted max-w-3xl leading-relaxed">
          Our work is defined by one design principle: the audience participates.
          This extends beyond screens and headsets — our long-term research
          includes portable, wearable presence technology with applications in
          education, collaboration, and scientific research. Entertainment is
          the proving ground.
        </p>
      </section>

      <section id="projects" className="studio-section pb-16 scroll-mt-24">
        <h2 className="text-2xl font-semibold mb-6">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PROJECTS.map((project) => (
            <article
              key={project.name}
              className={`studio-card p-6 flex flex-col gap-3 ${
                "featured" in project && project.featured
                  ? "md:col-span-2 md:grid md:grid-cols-2 md:gap-8 md:items-center"
                  : ""
              }`}
            >
              {"featured" in project && project.featured && (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-black/8">
                  <Image
                    src="/assets/images/Liminal_Sin_Title.jpg"
                    alt="Liminal Sin"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-studio-text">
                  {project.name}
                </h3>
                <p className="mt-2 text-sm text-studio-text-muted leading-relaxed">
                  {project.description}
                </p>
                {project.href ? (
                  project.external ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-sm font-medium text-studio-accent hover:underline"
                    >
                      Visit project →
                    </a>
                  ) : (
                    <Link
                      href={project.href}
                      className="mt-4 inline-block text-sm font-medium text-studio-accent hover:underline"
                    >
                      View project →
                    </Link>
                  )
                ) : (
                  <p className="mt-4 text-xs uppercase tracking-wide text-studio-text-muted">
                    Pre-production
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="studio-section pb-16">
        <h2 className="text-2xl font-semibold mb-6">Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TEAM.map((member) => (
            <article key={member.name} className="studio-card p-6">
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-studio-accent mt-1">{member.role}</p>
              <p className="text-sm text-studio-text-muted mt-3">
                {member.detail}
              </p>
              <a
                href={`mailto:${member.email}`}
                className="mt-4 inline-block text-sm text-studio-text-muted hover:text-studio-accent transition-colors"
              >
                {member.email}
              </a>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm text-studio-text-muted">
          Two-person founding team · Albuquerque, New Mexico
        </p>
      </section>

      <section className="studio-section">
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <div className="studio-card p-6 sm:p-8 space-y-3 text-studio-text-muted">
          <p>
            <span className="font-medium text-studio-text">General inquiries:</span>{" "}
            <a
              href="mailto:contact@myceliainteractive.com"
              className="text-studio-accent hover:underline"
            >
              contact@myceliainteractive.com
            </a>
          </p>
          <p>
            <span className="font-medium text-studio-text">Website:</span>{" "}
            www.myceliainteractive.com
          </p>
          <p>
            <span className="font-medium text-studio-text">Interactive experience:</span>{" "}
            <a
              href="https://www.thes33k3r.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-studio-accent hover:underline"
            >
              www.thes33k3r.com
            </a>
          </p>
          <p>New Mexico, United States</p>
        </div>
      </section>
    </div>
  );
}
