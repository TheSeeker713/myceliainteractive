import Link from "next/link";
import { LiquidGlassSurface } from "@/app/components/motion/LiquidGlassSurface";

export function LiminalSinAccessFooter() {
  return (
    <LiquidGlassSurface variant="cover">
      <p className="liquid-glass-body text-studio-text-muted">
        <span className="font-medium text-studio-text">Desktop experience:</span>{" "}
        Liminal Sin is designed for desktop browsers. Mobile play is not
        supported.
      </p>
      <div className="mt-4 space-y-3 text-sm text-studio-text-muted">
        <div>
          &copy; {new Date().getFullYear()} Mycelia Interactive LLC. All rights
          reserved.
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <span>
            LIMINAL SIN&trade; is a work of interactive fiction. All characters
            and events are fictional.
          </span>
          <Link
            href="/ls/privacy"
            className="hover:text-studio-accent transition-colors min-h-11 inline-flex items-center"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </LiquidGlassSurface>
  );
}
