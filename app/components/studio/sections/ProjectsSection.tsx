"use client";

import Image from "next/image";
import Link from "next/link";
import { SectionReveal } from "@/app/components/motion/SectionReveal";
import { StudioCard } from "@/app/components/motion/StudioCard";
import { PROJECTS } from "@/app/components/studio/data";

export function ProjectsSection() {
  return (
    <SectionReveal id="projects" className="studio-section pb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-6">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PROJECTS.map((project) => (
          <StudioCard
            key={project.name}
            featured={"featured" in project && project.featured}
            className={`p-6 flex flex-col gap-3 ${
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
          </StudioCard>
        ))}
      </div>
    </SectionReveal>
  );
}
