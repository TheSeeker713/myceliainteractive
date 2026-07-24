import {
  LiquidGlassPage,
  LiquidGlassSurface,
} from "@/app/components/motion/LiquidGlassSurface";
import { Button } from "@/app/components/studio/Button";

export function PrototypeAccessGate() {
  return (
    <LiquidGlassPage>
      <LiquidGlassSurface variant="fill" trackPointer>
        <p data-lg-kicker className="liquid-glass-kicker text-studio-accent mb-3">
          Liminal Sin · Prototype
        </p>
        <h1 className="liquid-glass-title font-semibold tracking-tight text-studio-text normal-case tracking-normal">
          Access by invitation only
        </h1>
        <p className="mt-6 liquid-glass-body text-studio-text-muted leading-relaxed">
          The Liminal Sin prototype is currently closed to the public. We grant
          access by request only. Submit your details on the access request form
          or email us directly. If approved, you will receive a private play
          link within 24 hours.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button href="/ls#access">Request access</Button>
          <Button
            href="mailto:contact@myceliainteractive.com"
            variant="secondary"
          >
            contact@myceliainteractive.com
          </Button>
        </div>
        <p className="mt-8 liquid-glass-body text-studio-text-muted">
          Liminal Sin is a psychological interactive experience with real-time
          AI narrative and voice-driven interaction, submitted as a vertical
          slice to the Gemini Live Agent Challenge 2026. An enhanced trust
          system is planned for the MVP.
        </p>
        <p className="mt-4 liquid-glass-body text-studio-text-muted">
          Desktop browsers recommended. Mobile play is not supported.
        </p>
      </LiquidGlassSurface>
    </LiquidGlassPage>
  );
}
