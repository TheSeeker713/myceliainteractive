import type { ReactNode } from "react";

/** Chakra Petch is loaded site-wide via root layout (--font-mycelia-agent). */
export default function AtmospherePreviewLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
