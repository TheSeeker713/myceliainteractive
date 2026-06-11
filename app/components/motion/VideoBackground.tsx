"use client";

import { Canvas } from "@react-three/fiber";
import { useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type VideoBackgroundProps = {
  enabled?: boolean;
};

export function VideoBackground({ enabled = true }: VideoBackgroundProps) {
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setProgress(latest);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  if (!enabled || reducedMotion) return null;

  return (
    <div className="fixed inset-0 z-[-10] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 50 }}
        style={{ background: "transparent" }}
      >
        {/* Video plane will be added in later steps */}
        <ambientLight />
      </Canvas>
    </div>
  );
}
