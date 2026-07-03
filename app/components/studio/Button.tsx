import { cn } from "@/utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
    md: "px-5 py-2.5 text-sm min-h-11",
    lg: "px-7 py-3.5 text-base",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-[colors,transform] duration-200 motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]",
        sizeClasses[size],
        variant === "primary" &&
          "bg-studio-accent text-white hover:bg-[var(--color-studio-accent-hover)]",
        variant === "secondary" &&
          "border border-black/10 bg-white text-studio-text hover:bg-studio-bg-muted",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
