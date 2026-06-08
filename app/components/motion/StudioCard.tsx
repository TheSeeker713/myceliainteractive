"use client";

import { cn } from "@/utils/cn";

type StudioCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function StudioCard({ children, className }: StudioCardProps) {
  return (
    <article
      className={cn(
        "studio-card transition-shadow duration-200 hover:shadow-[0_12px_40px_rgba(45,106,126,0.08)]",
        className,
      )}
    >
      {children}
    </article>
  );
}
