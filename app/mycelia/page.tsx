export default function MyceliaPlaceholder() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-hero-bg-default px-6">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-hero-magenta-400 to-hero-cyan-400 drop-shadow-sm">
          Mycelia Interactive
        </h1>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-hero-cyan-500 to-transparent mx-auto"></div>
        <p className="text-xl text-hero-cyan-100/80 leading-relaxed font-light">
          Our studio portal is currently evolving behind the scenes. We are hard
          at work shaping interactive narrative networks and alternate reality
          experiences.
        </p>
        <div className="inline-block px-6 py-3 rounded-full border border-hero-magenta-500/30 bg-hero-magenta-900/20 text-hero-magenta-200 text-sm tracking-widest uppercase mt-4 animate-pulse">
          System Initialization Pending
        </div>
      </div>
    </div>
  );
}
