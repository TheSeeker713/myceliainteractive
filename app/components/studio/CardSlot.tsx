import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type CardSlotProps = {
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
};

export function CardSlot({ children, className, scrollable = false }: CardSlotProps) {
  return (
    <div className="flex min-h-[calc(100dvh-var(--header-h))] w-full items-center justify-center px-[clamp(1rem,5vw,2.5rem)] py-[clamp(0.75rem,3vh,1.75rem)]">
      <div
        className={cn(
          "w-full max-w-3xl",
          scrollable && "max-h-[calc(100dvh-var(--header-h)-2rem)] overflow-y-auto overscroll-contain",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
