"use client";

import { Button } from "@/app/components/studio/Button";
import { SceneCard } from "@/app/components/studio/SceneCard";

export function ContactContent() {
  return (
    <SceneCard className="space-y-4 text-studio-text-muted">
      <h1 className="font-semibold text-studio-text">Contact</h1>
      <p className="liquid-glass-body">
        <span className="font-medium text-studio-text">General inquiries:</span>{" "}
        <a
          href="mailto:contact@myceliainteractive.com"
          className="text-studio-accent hover:underline"
        >
          contact@myceliainteractive.com
        </a>
      </p>
      <p className="liquid-glass-body">
        <span className="font-medium text-studio-text">Website:</span>{" "}
        <a
          href="https://www.myceliainteractive.com"
          className="text-studio-accent hover:underline"
        >
          www.myceliainteractive.com
        </a>
      </p>
      <p className="liquid-glass-body">
        <span className="font-medium text-studio-text">
          Interactive experience:
        </span>{" "}
        <a
          href="https://www.thes33k3r.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-studio-accent hover:underline"
        >
          www.thes33k3r.com
        </a>
      </p>
      <p className="liquid-glass-body">New Mexico, United States</p>
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <Button href="/ls#access" className="w-full sm:w-auto">
          Request Private Access to Liminal Sin
        </Button>
        <Button
          href="mailto:contact@myceliainteractive.com?subject=Collaboration%20Inquiry"
          variant="secondary"
          className="w-full sm:w-auto"
        >
          Inquire About Collaboration
        </Button>
      </div>
    </SceneCard>
  );
}
