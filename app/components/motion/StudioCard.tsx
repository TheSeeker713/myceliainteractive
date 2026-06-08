"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/utils/cn";

type StudioCardProps = {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
};

export function StudioCard({
  children,
  className,
  featured = false,
}: StudioCardProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <article className={cn("studio-card", className)}>{children}</article>
    );
  }

  return (
    <motion.article
      className={cn("studio-card", className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: featured ? -2 : -3,
        boxShadow: "0 12px 40px rgba(45, 106, 126, 0.08)",
        transition: { duration: 0.25 },
      }}
    >
      {children}
    </motion.article>
  );
}
