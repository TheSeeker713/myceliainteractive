import type { Metadata } from "next";
import Link from "next/link";
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
    <div className="site-gutter py-12 sm:py-16 min-h-[80vh]">
      <div className="studio-section max-w-3xl mx-auto">
        <div className="mb-8 flex items-center justify-end">
          <Link
            href="/"
            className="text-sm text-studio-text-muted hover:text-studio-accent transition-colors"
          >
            ← Home
          </Link>
        </div>
        <ContactContent />
      </div>
    </div>
  );
}
