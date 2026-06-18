"use client";

import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/app/components/studio/data";
import { SceneCard } from "@/app/components/studio/SceneCard";

type ProjectItem = (typeof PROJECTS)[number];

export function ProjectSceneContent({ project }: { project: ProjectItem }) {
  const isFeatured = "featured" in project && project.featured;

  return (
    <SceneCard className="flex flex-col gap-5">
      <p className="text-sm font-medium text-studio-accent uppercase tracking-wide">
        Projects
      </p>
      {isFeatured && (
        <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-black/8">
          <Image
            src="/assets/images/Liminal_Sin_Title.jpg"
            alt="Liminal Sin"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
          />
        </div>
      )}
      <div>
        <h3 className="text-xl font-semibold text-studio-text">
          {project.name}
        </h3>
        <p className="mt-3 text-sm text-studio-text-muted leading-relaxed">
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
