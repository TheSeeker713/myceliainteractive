"use client";

import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type StaticSectionProps = {
  outgoing?: ReactNode;
  incoming: ReactNode;
  id?: string;
  className?: string;
};

export function StaticSection({
  outgoing,
  incoming,
  id,
  className,
}: StaticSectionProps) {
  return (
    <div className={cn("scroll-fold-static", className)}>
      {outgoing && (
        <section className="studio-section py-12 sm:py-16">{outgoing}</section>
      )}
      <section id={id} className="studio-section py-12 sm:py-16 scroll-mt-24">
        {incoming}
      </section>
    </div>
  );
}
