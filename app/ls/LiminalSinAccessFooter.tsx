import SignupForms from "@/app/ls/SignupForms";

export function LiminalSinAccessFooter() {
  return (
    <>
      <section id="access" className="ls-section-py relative bg-[#050507]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(88,28,135,0.1) 0%, transparent 70%)",
          }}
        />
        <div className="ls-gutter max-w-5xl mx-auto relative z-10 flex flex-col items-center gap-10">
          <div className="text-center space-y-3 max-w-2xl">
            <p className="text-xs tracking-[0.35em] uppercase text-purple-400/60">
              Request Access
            </p>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-white">
              Enter the Underground
            </h2>
            <p className="text-gray-400/80 text-base leading-relaxed">
              The prototype opens soon. Register your access point below. You
              will be contacted when the signal is live.
            </p>
          </div>

          <SignupForms />
        </div>
      </section>

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
              href="/ls/privacy.html"
              className="hover:text-cyan-300 transition-colors"
            >
              Privacy Policy
            </a>
            <span className="hidden sm:inline text-purple-900/60">|</span>
            <span className="text-purple-400/60">v0.1 - Early Access</span>
          </div>
        </div>
      </footer>
    </>
  );
}
