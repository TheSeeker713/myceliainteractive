"use client";

export function HintOverlays({
  showHint,
  serverHint,
}: {
  showHint: boolean;
  serverHint: string | null;
}) {
  return (
    <>
      {showHint && (
        <div className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none">
          <p
            className="font-mono text-sm tracking-[0.3em] uppercase"
            style={{
              color: "rgba(160,160,160,0.5)",
              animation: "hint-fade-in-out 8s ease-in-out forwards",
            }}
          >
            speak to JASON
          </p>
        </div>
      )}

      {serverHint && (
        <div className="absolute inset-0 z-[26] flex items-end justify-center pb-16 pointer-events-none">
          <p
            className="font-mono text-sm tracking-[0.2em] uppercase text-center max-w-md px-4"
            style={{
              color: "rgba(192,132,252,0.75)",
              animation: "hint-fade-in 1s ease-in forwards",
              textShadow: "0 0 12px rgba(139,44,245,0.4)",
            }}
          >
            {serverHint}
          </p>
        </div>
      )}
    </>
  );
}
