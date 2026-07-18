import type { Metadata } from "next";
import Link from "next/link";
import {
  LiquidGlassPage,
  LiquidGlassSurface,
} from "@/app/components/motion/LiquidGlassSurface";
import { ContactContent } from "@/app/components/studio/sections/ContactSection";

export const metadata: Metadata = {
  title: "Contact | Mycelia Interactive LLC",
  description:
    "Get in touch with Mycelia Interactive LLC for collaboration, press, or private access to Liminal Sin.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Mycelia Interactive LLC",
    description:
      "Get in touch with Mycelia Interactive LLC for collaboration, press, or private access to Liminal Sin.",
    url: "https://www.myceliainteractive.com/contact",
  },
};

export default function ContactPage() {
  return (
    <LiquidGlassPage>
      <LiquidGlassSurface variant="fill" trackPointer>
        <div className="mb-6 flex items-center justify-end">
          <Link
            href="/"
            className="text-sm text-studio-text-muted hover:text-studio-accent transition-colors min-h-11 inline-flex items-center"
          >
            ← Home
          </Link>
        </div>
        <ContactContent />
      </LiquidGlassSurface>
    </LiquidGlassPage>
  );
}
