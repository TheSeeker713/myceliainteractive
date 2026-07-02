"use client";

import Link from "next/link";
import { Button } from "@/app/components/studio/Button";
import { SceneCard } from "@/app/components/studio/SceneCard";

export function ContactContent() {
  return (
    <SceneCard className="space-y-4 text-studio-text-muted">
      <h2 className="text-2xl font-semibold text-studio-text">Contact</h2>
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
        <a
          href="https://www.myceliainteractive.com"
          className="text-studio-accent hover:underline"
        >
          www.myceliainteractive.com
        </a>
      </p>
      <p>
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
      <p>New Mexico, United States</p>
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <Link href="/ls#access" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            Request Private Access to Liminal Sin
          </Button>
        </Link>
        <a
          href="mailto:contact@myceliainteractive.com?subject=Collaboration%20Inquiry"
          className="w-full sm:w-auto"
        >
          <Button variant="secondary" className="w-full sm:w-auto">
            Inquire About Collaboration
          </Button>
        </a>
      </div>
    </SceneCard>
  );
}
