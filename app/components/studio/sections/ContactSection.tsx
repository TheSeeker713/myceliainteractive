"use client";

import Link from "next/link";
import { FoldCard } from "@/app/components/motion/FoldCard";
import { Button } from "@/app/components/studio/Button";

export function ContactContent() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Contact</h2>
      <FoldCard index={0} total={1} className="p-6 sm:p-8 space-y-4 text-studio-text-muted">
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
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Link href="/ls#access">
            <Button>Request Private Access to Liminal Sin</Button>
          </Link>
          <a href="mailto:contact@myceliainteractive.com?subject=AI%20%26%20Cloud%20Credits%20Collaboration">
            <Button variant="secondary">
              Inquire About AI &amp; Cloud Credits
            </Button>
          </a>
        </div>
      </FoldCard>
    </>
  );
}
