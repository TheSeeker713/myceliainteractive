import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Liminal Sin | Privacy Policy",
  description:
    "Privacy policy for the Liminal Sin interactive prototype, covering camera, microphone, and real-time session data handling.",
  alternates: {
    canonical: "/ls/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="site-gutter py-12 sm:py-16 min-h-[80vh]">
      <article className="studio-section max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-semibold text-studio-text">
            Liminal Sin · Privacy Policy
          </h1>
          <Link
            href="/"
            className="text-sm text-studio-text-muted hover:text-studio-accent transition-colors"
          >
            ← Home
          </Link>
        </div>

        <div className="studio-card p-6 sm:p-10 space-y-6 leading-relaxed text-studio-text-muted">
          <p className="text-sm">
            <strong className="text-studio-text">Effective Date:</strong> March
            3, 2026
            <br />
            <strong className="text-studio-text">Project Owner:</strong>{" "}
            Mycelia Interactive LLC
          </p>

          <section>
            <h2 className="text-lg font-semibold text-studio-text mb-2">
              1) Plain-English Summary
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                We do not intentionally store your raw camera feed or microphone
                recordings.
              </li>
              <li>We do not sell, rent, trade, or broker your personal data.</li>
              <li>
                We do not use personal data from camera/audio interactions to
                train our own AI models.
              </li>
              <li>
                We design the system for minimum collection and minimum retention.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-studio-text mb-2">
              2) What We Process
            </h2>
            <p>
              To provide live gameplay features, we may process microphone input,
              camera input, and limited technical telemetry (such as timestamped
              request/health/error logs).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-studio-text mb-2">
              3) Camera and Audio Handling
            </h2>
            <p>
              Our implementation target is ephemeral stream processing for active
              sessions only. We do not intentionally persist raw camera frames or
              raw microphone recordings in project-controlled storage.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-studio-text mb-2">
              4) No Sale / No Data Brokerage
            </h2>
            <p>
              Mycelia Interactive LLC does not sell, rent, trade, or broker
              personal data from Liminal Sin users.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-studio-text mb-2">
              5) Third-Party Services
            </h2>
            <p>
              Liminal Sin may rely on third-party AI/cloud services, including
              Google Cloud and Gemini APIs, to deliver real-time features. These
              providers may process data in transit under their own terms and
              privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-studio-text mb-2">
              6) Data Minimization and Security
            </h2>
            <p>
              We apply reasonable safeguards and strive to minimize data exposure,
              retention, and sharing. No internet-connected service can guarantee
              absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-studio-text mb-2">
              7) Updates
            </h2>
            <p>
              This policy may be updated from time to time. Revised versions will
              include an updated effective date.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
