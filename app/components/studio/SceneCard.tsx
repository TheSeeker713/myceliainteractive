import { cn } from "@/utils/cn";

type SceneCardProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Content layout wrapper for homepage / section bodies.
 * Visual glass comes from LiquidGlassSurface / MyceliaCardStage — not here.
 */
export function SceneCard({ children, className }: SceneCardProps) {
  return (
    <div className={cn("w-full text-left", className)}>{children}</div>
  );
}
