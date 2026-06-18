import { cn } from "@/utils/cn";
import { Card } from "@/app/components/studio/Card";

type SceneCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function SceneCard({ children, className }: SceneCardProps) {
  return (
    <Card
      variant="glass"
      className={cn(
        "p-6 sm:p-8 w-full max-w-3xl mx-auto text-left",
        className,
      )}
    >
      {children}
    </Card>
  );
}
