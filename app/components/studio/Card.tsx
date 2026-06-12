import { cn } from "@/utils/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "glass" | "elevated";
  padding?: "sm" | "md" | "lg" | "xl";
};

export function Card({
  variant = "glass",
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  const paddingClasses = {
    sm: "p-4 sm:p-5",
    md: "p-5 sm:p-7",
    lg: "p-6 sm:p-9",
    xl: "p-8 sm:p-12",
  };

  const variantClasses = {
    default: "bg-white border border-studio-border",
    glass:
      "bg-white/12 border border-white/22 backdrop-blur-[24px] saturate-[1.8] shadow-[0_8px_32px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(255,255,255,0.08)] relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/25 before:to-transparent before:pointer-events-none",
    elevated:
      "bg-white border border-studio-border shadow-md hover:shadow-lg transition-shadow",
  };

  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-200",
        variantClasses[variant],
        paddingClasses[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
