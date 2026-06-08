import Link from "next/link";

export function LiminalSinAccessFooter() {
  return (
    <>
      <div className="ls-gutter w-full border-y border-black/8 bg-white/50 py-4">
        <p className="text-center text-xs sm:text-sm text-studio-text-muted">
          <span className="font-medium text-studio-text">Desktop experience:</span>{" "}
          Liminal Sin is designed for desktop browsers. Mobile play is not
          supported.
        </p>
      </div>

      <footer className="ls-gutter ls-footer-py w-full border-t border-black/8 bg-white/60">
        <div className="studio-section space-y-3">
          <div className="text-sm text-studio-text-muted">
            &copy; {new Date().getFullYear()} Mycelia Interactive LLC. All rights
            reserved.
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-studio-text-muted">
            <span>
              LIMINAL SIN&trade; is a work of interactive fiction. All characters
              and events are fictional.
            </span>
            <Link
              href="/ls/privacy"
              className="hover:text-studio-accent transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
