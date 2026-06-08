import Link from "next/link";
import { Button } from "@/app/components/studio/Button";

export function PrototypeAccessGate() {
  return (
    <div className="site-gutter py-20 sm:py-28">
      <div className="studio-section max-w-2xl">
        <p className="text-sm font-medium text-studio-accent uppercase tracking-wide mb-3">
          Liminal Sin · Prototype
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-studio-text">
          Access by invitation only
        </h1>
        <p className="mt-6 text-studio-text-muted leading-relaxed">
          The Liminal Sin prototype is currently closed to the public. We grant
          access by request only. Submit your details on the access request form
          or email us directly. If approved, you will receive a private play
          link within 24 hours.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href="/ls#access">
            <Button>Request access</Button>
          </Link>
          <a href="mailto:contact@myceliainteractive.com">
            <Button variant="secondary">contact@myceliainteractive.com</Button>
          </a>
        </div>
        <p className="mt-8 text-sm text-studio-text-muted">
          Liminal Sin is a psychological interactive experience with a real-time
          AI trust and response system — submitted as a vertical slice to the
          Gemini Live Agent Challenge 2026.
        </p>
        <p className="mt-4 text-sm text-studio-text-muted">
          Desktop browsers recommended. Mobile play is not supported.
        </p>
      </div>
    </div>
  );
}
