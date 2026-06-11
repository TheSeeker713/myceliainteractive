import { cn } from "@/utils/cn";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  id?: string;
  spacing?: "sm" | "md" | "lg";
};

export function Section({
  id,
  spacing = "md",
  className,
  children,
  ...props
}: SectionProps) {
  const spacingClasses = {
    sm: "py-12 sm:py-16",
    md: "py-16 sm:py-20",
    lg: "py-20 sm:py-24",
  };

  return (
    <section
      id={id}
      className={cn(
        "studio-section scroll-mt-24 site-gutter",
        spacingClasses[spacing],
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
