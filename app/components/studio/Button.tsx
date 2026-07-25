import Link from "next/link";
import { cn } from "@/utils/cn";

type ButtonStyleProps = {
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
};

type ButtonProps =
  | (ButtonStyleProps &
      React.ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: undefined;
      })
  | (ButtonStyleProps &
      React.AnchorHTMLAttributes<HTMLAnchorElement> & {
        href: string;
      });

const sizeClasses: Record<NonNullable<ButtonStyleProps["size"]>, string> = {
    md: "px-5 py-2.5 text-sm min-h-11",
    lg: "px-7 py-3.5 text-base",
};

function getButtonClasses({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleProps & { className?: string }) {
  return cn(
    "inline-flex items-center justify-center rounded-lg font-medium transition-[colors,transform] duration-200 motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]",
    sizeClasses[size],
    variant === "primary" &&
      "bg-studio-accent text-white hover:bg-[var(--color-studio-accent-hover)]",
    variant === "secondary" &&
      "border border-[color:var(--theme-chrome-border)] bg-[color:var(--theme-control-bg)] text-studio-text hover:bg-[color:var(--theme-control-bg-active)]",
    className,
  );
}

export function Button(props: ButtonProps) {
  if (typeof props.href === "string") {
    const {
      href,
      variant,
      size,
      className,
      children,
      ...anchorProps
    } = props;
    const classes = getButtonClasses({ variant, size, className });

    if (href.startsWith("/")) {
      return (
        <Link href={href} className={classes} {...anchorProps}>
          {children}
        </Link>
      );
    }

    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { variant, size, className, children, ...buttonProps } = props;

  return (
    <button
      className={getButtonClasses({ variant, size, className })}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
