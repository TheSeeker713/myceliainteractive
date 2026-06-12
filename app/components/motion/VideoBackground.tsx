"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
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

  // === DIRECT WHEEL-DRIVEN SCRUBBING ===
  // This is the critical part that was not working before.
  useEffect(() => {
    if (!enabled || reducedMotion) return;

    const handleWheel = (e: WheelEvent) => {
      const video = videoRef.current;
      if (!video || !texture) return;

      // Cancel any pending auto-pause
      if (scrubTimeoutRef.current) {
        clearTimeout(scrubTimeoutRef.current);
      }

      const duration = video.duration || 10;

      // Sensitivity: how many seconds to scrub per wheel "tick"
      // deltaY is usually ~100-120 per notch. We want fine control.
      const scrubSecondsPerTick = 0.12;
      const delta = (e.deltaY / 120) * scrubSecondsPerTick;

      let newTime = video.currentTime + delta;
      newTime = Math.max(0, Math.min(duration - 0.01, newTime));

      // Directly set the time — this is what actually scrubs the frame
      video.currentTime = newTime;

      // "Kick" the video so the VideoTexture updates the current frame.
      // We play briefly then will pause after inactivity.
      video.play().catch(() => {});

      // After a short period of no wheel activity, pause the video.
      // This gives the "pause at current frame when scrolling stops" behavior.
      scrubTimeoutRef.current = setTimeout(() => {
        if (video) {
          video.pause();
        }
      }, 160);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (scrubTimeoutRef.current) {
        clearTimeout(scrubTimeoutRef.current);
      }
    };
  }, [enabled, reducedMotion, texture]);

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
