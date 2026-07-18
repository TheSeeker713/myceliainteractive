import type { Metadata } from "next";
import Link from "next/link";
import {
  LiquidGlassPage,
  LiquidGlassSurface,
} from "@/app/components/motion/LiquidGlassSurface";

export const metadata: Metadata = {
  title: "Privacy Policy | Mycelia Interactive LLC",
  description:
    "Privacy policy for the Mycelia Interactive LLC public website and studio communications.",
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CompanyPrivacyPage() {
  return (
    <LiquidGlassPage>
      <LiquidGlassSurface variant="fill" trackPointer>
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <h1 className="font-semibold text-studio-text">
            Mycelia Interactive LLC · Privacy Policy
          </h1>
          <Link
            href="/"
            className="text-sm text-studio-text-muted hover:text-studio-accent transition-colors min-h-11 inline-flex items-center"
          >
            ← Home
          </Link>
        </div>

        <div className="space-y-6 leading-relaxed text-studio-text-muted">
          <p className="liquid-glass-body">
            <strong className="text-studio-text">Effective Date:</strong> June
            18, 2026
            <br />
            <strong className="text-studio-text">Company:</strong> Mycelia
            Interactive LLC · Albuquerque, New Mexico
          </p>

          <section>
            <h2 className="text-lg font-semibold text-studio-text mb-2">
              Overview
            </h2>
            <p>
              This policy describes how Mycelia Interactive LLC collects and
              uses information when you visit our public website, request
              prototype access, or contact us by email.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-studio-text mb-2">
              Information we collect
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-studio-text">Access requests:</strong>{" "}
                name and email submitted through the Liminal Sin request form.
              </li>
              <li>
                <strong className="text-studio-text">Email correspondence:</strong>{" "}
                information you send when contacting us directly.
              </li>
              <li>
                <strong className="text-studio-text">Technical logs:</strong>{" "}
                standard server and security logs (IP address, user agent,
                timestamps) processed by our hosting provider.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-studio-text mb-2">
              How we use information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Review and respond to access requests and inquiries.</li>
              <li>Issue and manage private prototype play links.</li>
              <li>Maintain site security, abuse prevention, and reliability.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-studio-text mb-2">
              Sharing
            </h2>
            <p>
              We do not sell personal information. We use service providers
              (including email delivery and cloud hosting) only as needed to
              operate the site and communicate with you.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-studio-text mb-2">
              Interactive experiences
            </h2>
            <p>
              The Liminal Sin prototype has a separate privacy policy covering
              camera, microphone, and real-time session behavior. See{" "}
              <Link
                href="/ls/privacy"
                className="text-studio-accent hover:underline"
              >
                Liminal Sin Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-studio-text mb-2">
              Contact
            </h2>
            <p>
              Questions:{" "}
              <a
                href="mailto:contact@myceliainteractive.com"
                className="text-studio-accent hover:underline"
              >
                contact@myceliainteractive.com
              </a>
            </p>
          </section>
        </div>
      </LiquidGlassSurface>
    </LiquidGlassPage>
  );
}
