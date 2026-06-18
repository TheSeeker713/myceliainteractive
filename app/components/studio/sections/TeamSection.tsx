"use client";

import { TEAM } from "@/app/components/studio/data";
import { SceneCard } from "@/app/components/studio/SceneCard";

export function TeamContent() {
  return (
    <SceneCard className="max-w-4xl">
      <h2 className="text-2xl font-semibold text-studio-text mb-6">Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {TEAM.map((member) => (
          <div
            key={member.name}
            className="rounded-xl border border-black/8 bg-white/30 p-5"
          >
            <h3 className="text-lg font-semibold text-studio-text">
              {member.name}
            </h3>
            <p className="text-sm text-studio-accent mt-1">{member.role}</p>
            <p className="text-sm text-studio-text-muted mt-3 leading-relaxed">
              {member.detail}
            </p>
            <a
              href={`mailto:${member.email}`}
              className="mt-4 inline-block text-sm text-studio-text-muted hover:text-studio-accent transition-colors"
            >
              {member.email}
            </a>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-studio-text-muted">
        Bootstrapped two-person team · Albuquerque, New Mexico · shipping
        publicly accessible experiences
      </p>
    </SceneCard>
  );
}
