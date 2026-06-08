import { cn } from "@/utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-[colors,transform] duration-200 motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]",
        variant === "primary" &&
          "bg-studio-accent text-white hover:bg-[#245a6b]",
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
