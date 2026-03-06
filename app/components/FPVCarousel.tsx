"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

// Hardcoded logic to match worker protection
const MAX_SEEDS = 12;

export default function FPVCarousel() {
  const [currentSeed, setCurrentSeed] = useState(0);
  const [nextSeed, setNextSeed] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Random interval between 12s and 24s. Cloudflare AI text-to-image takes ~8s to generate the first time, so we need a higher floor to prevent swapping before loading
    const getNextInterval = () =>
      Math.floor(Math.random() * (24000 - 12000 + 1) + 12000);

    const triggerNextImage = () => {
      // Start crossfade
      setIsTransitioning(true);

      // After transition finishes (matching CSS duration ~1.5s), swap current to next
      setTimeout(() => {
        setCurrentSeed((prev) => {
          const next = (prev + 1) % MAX_SEEDS;
          // Setup the background image for the next cycle ahead of time
          setNextSeed((next + 1) % MAX_SEEDS);
          setIsTransitioning(false);
          return next;
        });

        // Loop again with a new random time
        timeoutRef.current = setTimeout(triggerNextImage, getNextInterval());
      }, 1500);
    };

    // Start the first loop
    timeoutRef.current = setTimeout(triggerNextImage, getNextInterval());

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-[40vh] min-h-[300px] max-h-[600px] overflow-hidden bg-black border-y border-purple-900/40 pointer-events-none mx-auto">
      {/* Glitch Overlay Effect */}
      <div className="absolute inset-0 z-10 bg-[url('/assets/images/noise.png')] opacity-15 mix-blend-overlay"></div>
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#08041a] via-transparent to-[#050507]"></div>

      {/* Primary Image (Fades out) */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          isTransitioning ? "opacity-0" : "opacity-80"
        }`}
      >
        <Image
          src={`/api/ai/image?seed=${currentSeed}&v=2`}
          alt="FPV Glasses View"
          fill
          unoptimized
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Next Image (Fades in) */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          isTransitioning ? "opacity-80" : "opacity-0"
        }`}
      >
        <Image
          src={`/api/ai/image?seed=${nextSeed}&v=2`}
          alt="FPV Glasses Next View"
          fill
          unoptimized
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}
