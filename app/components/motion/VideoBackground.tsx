"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type VideoPlaneProps = {
  texture: THREE.VideoTexture | null;
  parallaxPos: { x: number; y: number };
  parallaxMultiplier: number;
};

function VideoPlane({ texture, parallaxPos, parallaxMultiplier }: VideoPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { viewport } = useThree();

  // Mouse + Touch parallax (scaled by device type)
  useFrame(() => {
    if (!meshRef.current) return;

    const targetX = parallaxPos.x * 0.12 * parallaxMultiplier;
    const targetY = parallaxPos.y * 0.08 * parallaxMultiplier;

    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      targetX,
      0.08
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      0.08
    );
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width * 1.05, viewport.height * 1.05]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

type VideoBackgroundProps = {
  enabled?: boolean;
};

export function VideoBackground({ enabled = true }: VideoBackgroundProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);
  const [parallaxPos, setParallaxPos] = useState({ x: 0, y: 0 });
  const [hasError, setHasError] = useState(false);
  const [parallaxMultiplier, setParallaxMultiplier] = useState(1);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);
  const scrubTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const targetTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const isActiveRef = useRef(false);

  // Mobile detection for reduced parallax
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      setParallaxMultiplier(isMobile ? 0.35 : 1);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Unified mouse + touch parallax tracking
  useEffect(() => {
    if (!enabled || reducedMotion) return;

    const updateParallax = (clientX: number, clientY: number) => {
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = -(clientY / window.innerHeight - 0.5) * 2;
      setParallaxPos({ x, y });
    };

    const handleMouseMove = (e: MouseEvent) => updateParallax(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateParallax(touch.clientX, touch.clientY);
      }
    };
    const resetParallax = () => setParallaxPos({ x: 0, y: 0 });

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", resetParallax, { passive: true });
    window.addEventListener("mouseleave", resetParallax);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", resetParallax);
      window.removeEventListener("mouseleave", resetParallax);
    };
  }, [enabled, reducedMotion]);

  // === SMOOTHED WHEEL-DRIVEN SCRUBBING ===
  // Accumulate target time from wheel events, then smoothly lerp in a RAF loop.
  const startScrubLoop = useCallback(() => {
    const video = videoRef.current;
    if (!video || isActiveRef.current) return;

    isActiveRef.current = true;

    const scrubLoop = () => {
      if (!video) {
        isActiveRef.current = false;
        return;
      }

      const current = video.currentTime;
      const target = targetTimeRef.current;
      const diff = target - current;

      // Smooth lerp toward target. Lower = smoother but more laggy.
      // 0.25 feels responsive while removing most jitter.
      const lerpFactor = 0.28;
      const newTime = current + diff * lerpFactor;

      // Only update if there's meaningful movement (prevents micro-jitter)
      if (Math.abs(diff) > 0.001) {
        video.currentTime = newTime;
      }

      // Keep the video element "awake" so the texture gets new frames
      if (video.paused) {
        video.play().catch(() => {});
      }

      if (isActiveRef.current) {
        rafRef.current = requestAnimationFrame(scrubLoop);
      }
    };

    rafRef.current = requestAnimationFrame(scrubLoop);
  }, []);

  const stopScrubLoop = useCallback(() => {
    isActiveRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const video = videoRef.current;
    if (video) {
      video.pause();
    }
  }, []);

  useEffect(() => {
    if (!enabled || reducedMotion) return;

    const handleWheel = (e: WheelEvent) => {
      const video = videoRef.current;
      if (!video || !texture) return;

      const duration = video.duration || 10;

      // Sensitivity - tune this value for feel
      const scrubSecondsPerTick = 0.105;
      const delta = (e.deltaY / 120) * scrubSecondsPerTick;

      // Accumulate target time (instead of setting immediately)
      let newTarget = targetTimeRef.current + delta;
      newTarget = Math.max(0, Math.min(duration - 0.02, newTarget));
      targetTimeRef.current = newTarget;

      // Ensure the smooth loop is running
      startScrubLoop();

      // Reset inactivity timer
      if (scrubTimeoutRef.current) {
        clearTimeout(scrubTimeoutRef.current);
      }

      // After inactivity, smoothly stop scrubbing and pause
      scrubTimeoutRef.current = setTimeout(() => {
        stopScrubLoop();
      }, 220);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (scrubTimeoutRef.current) clearTimeout(scrubTimeoutRef.current);
      stopScrubLoop();
    };
  }, [enabled, reducedMotion, texture, startScrubLoop, stopScrubLoop]);

  // Load video
  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/assets/video/mycelia_bg.mp4";
    video.muted = true;
    video.playsInline = true;
    video.loop = false;
    video.preload = "metadata";
    videoRef.current = video;

    video.onloadedmetadata = () => {
      const tex = new THREE.VideoTexture(video);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.format = THREE.RGBAFormat;

      setTexture(tex);
      textureRef.current = tex;
    };

    video.onerror = () => {
      console.error("[VideoBackground] Failed to load mycelia_bg.mp4");
      setHasError(true);
    };

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
      }
      if (textureRef.current) {
        textureRef.current.dispose();
      }
    };
  }, []);

  if (!enabled || reducedMotion || hasError) return null;

  return (
    <div className="fixed inset-0 z-[-10] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: false }}
      >
        <VideoPlane
          texture={texture}
          parallaxPos={parallaxPos}
          parallaxMultiplier={parallaxMultiplier}
        />
      </Canvas>
    </div>
  );
}
