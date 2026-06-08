"use client";

import { motion, useReducedMotion } from "framer-motion";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/utils/cn";

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
};

export const SectionReveal = forwardRef<HTMLElement, SectionRevealProps>(
  function SectionReveal({ children, className, id, delay = 0 }, ref) {
    const reducedMotion = useReducedMotion();

    if (reducedMotion) {
      return (
        <section ref={ref} id={id} className={cn(className)}>
          {children}
        </section>
      );
    }

    return (
      <motion.section
        ref={ref}
        id={id}
        className={cn(className)}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.section>
    );
  },
);
