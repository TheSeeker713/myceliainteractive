"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const MAX_SEEDS = 12;

export default function FPVCarousel() {
  const [currentSeed, setCurrentSeed] = useState(0);
  const [nextSeed, setNextSeed] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const getNextInterval = () =>
      Math.floor(Math.random() * (24000 - 12000 + 1) + 12000);

    const triggerNextImage = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSeed((prev) => {
          const next = (prev + 1) % MAX_SEEDS;
          setNextSeed((next + 1) % MAX_SEEDS);
          setIsTransitioning(false);
          return next;
        });
        timeoutRef.current = setTimeout(triggerNextImage, getNextInterval());
      }, 1500);
    };

    timeoutRef.current = setTimeout(triggerNextImage, getNextInterval());
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-[36vh] min-h-[260px] max-h-[480px] overflow-hidden border-y border-black/8 bg-studio-bg-muted pointer-events-none">
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          isTransitioning ? "opacity-0" : "opacity-90"
        }`}
      >
        <Image
          src={`/api/ai/image?seed=${currentSeed}&v=2`}
          alt="Atmospheric scene"
          fill
          unoptimized
          className="object-cover object-center"
          priority
        />
      </div>
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          isTransitioning ? "opacity-90" : "opacity-0"
        }`}
      >
        <Image
          src={`/api/ai/image?seed=${nextSeed}&v=2`}
          alt="Atmospheric scene next"
          fill
          unoptimized
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-studio-bg/20 via-transparent to-studio-bg/40" />
    </div>
  );
}
