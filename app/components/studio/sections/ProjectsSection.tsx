"use client";

import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/app/components/studio/data";
import { SceneCard } from "@/app/components/studio/SceneCard";

type ProjectItem = (typeof PROJECTS)[number];

function ProjectMedia({ project }: { project: ProjectItem }) {
  if ("video" in project && project.video) {
    return (
      <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-black/8 bg-black/20">
        <video
          src={project.video}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-label={project.name}
        />
      </div>
    );
  }

  if ("image" in project && project.image) {
    return (
      <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-black/8">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 896px"
        />
      </div>
    );
  }

  return null;
}

export function ProjectSceneContent({ project }: { project: ProjectItem }) {
  return (
    <SceneCard className="flex flex-col gap-5">
      <p data-lg-kicker className="liquid-glass-kicker text-studio-accent">
        Projects
      </p>
      <ProjectMedia project={project} />
      <div>
        <h3 className="liquid-glass-title font-semibold text-studio-text normal-case tracking-normal">
          {project.name}
        </h3>
        <p className="mt-3 liquid-glass-body text-studio-text-muted leading-relaxed">
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
          <p
            data-lg-kicker
            className="mt-4 liquid-glass-kicker text-studio-text-muted"
          >
            Pre-production
          </p>
        )}
      </div>
    </SceneCard>
  );
}

/** Static fallback: all projects in one view */
export function ProjectsContent() {
  return (
    <div className="space-y-6">
      {PROJECTS.map((project) => (
        <ProjectSceneContent key={project.name} project={project} />
      ))}
    </div>
  );
}
