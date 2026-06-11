import { cn } from "@/utils/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "glass" | "elevated";
  padding?: "sm" | "md" | "lg";
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
  };

  const variantClasses = {
    default: "bg-white border border-studio-border",
    glass:
      "bg-white/75 border border-studio-border backdrop-blur-xl shadow-sm",
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
