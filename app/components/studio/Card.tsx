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
      "bg-white/40 border border-white/25 backdrop-blur-[22px] shadow-[0_8px_32px_rgb(0,0,0,0.12),inset_0_1px_0_rgb(255,255,255,0.5),inset_0_-1px_0_rgb(255,255,255,0.1)] relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(#fff_0.5px,transparent_1px)] after:bg-[length:4px_4px] after:opacity-[0.06] after:pointer-events-none",
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
