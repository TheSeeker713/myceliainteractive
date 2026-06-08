"use client";

import { SectionReveal } from "@/app/components/motion/SectionReveal";
import { StudioCard } from "@/app/components/motion/StudioCard";
import { TEAM } from "@/app/components/studio/data";

export function TeamSection() {
  return (
    <SectionReveal className="studio-section pb-16">
      <h2 className="text-2xl font-semibold mb-6">Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {TEAM.map((member) => (
          <StudioCard key={member.name} className="p-6">
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-sm text-studio-accent mt-1">{member.role}</p>
            <p className="text-sm text-studio-text-muted mt-3">{member.detail}</p>
            <a
              href={`mailto:${member.email}`}
              className="mt-4 inline-block text-sm text-studio-text-muted hover:text-studio-accent transition-colors"
            >
              {member.email}
            </a>
          </StudioCard>
        ))}
      </div>
      <p className="mt-4 text-sm text-studio-text-muted">
        Bootstrapped two-person team · Albuquerque, New Mexico · shipping
        publicly accessible experiences
      </p>
    </SectionReveal>
  );
}
