export function LiminalSinAccessFooter() {
  return (
    <>

      <div className="ls-gutter w-full bg-[#0d0820] border-y border-purple-900/40 py-4">
        <p className="text-center text-xs sm:text-sm text-purple-300/80 tracking-wide">
          <span className="font-semibold text-purple-400">
            Desktop Experience:
          </span>
          &nbsp;LIMINAL SIN is designed for desktop browsers. Tablet support is
          currently in testing. Mobile play is not yet supported.
        </p>
      </div>

      <footer className="ls-gutter ls-footer-py w-full backdrop-blur-md bg-[#140a36]/80 border-t border-hero-cyan-300/30">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-start text-cyan-50/70 text-sm">
            &copy; {new Date().getFullYear()} Mycelia Interactive. All rights
            reserved.
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-cyan-50/40 border-t border-purple-900/30 pt-4">
            <span>
              LIMINAL SIN&trade; is a work of interactive fiction. All
              characters and events are fictional.
            </span>
            <span className="hidden sm:inline text-purple-900/60">|</span>
            <a
              href="/ls/privacy"
              className="hover:text-cyan-300 transition-colors"
            >
              Privacy Policy
            </a>
            <span className="hidden sm:inline text-purple-900/60">|</span>
            <a
              href="/ls/comments"
              className="hover:text-cyan-300 transition-colors"
            >
              Comments
            </a>
            <span className="hidden sm:inline text-purple-900/60">|</span>
            <span className="text-purple-400/60">v0.1 - Early Access</span>
          </div>
        </div>
      </footer>
    </>
  );
}
