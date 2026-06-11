"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type VideoPlaneProps = {
  scrollProgress: number;
  texture: THREE.VideoTexture | null;
  parallaxPos: { x: number; y: number };
};

function VideoPlane({ scrollProgress, texture, parallaxPos }: VideoPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { viewport } = useThree();

  // Responsive scroll scrubbing (wheel-driven)
  const prevProgressRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !texture) return;

    const prev = prevProgressRef.current;
    prevProgressRef.current = scrollProgress;

    const duration = video.duration || 10;
    const targetTime = scrollProgress * duration;

    // Much more direct mapping for responsive wheel feel
    const diff = targetTime - video.currentTime;

    if (Math.abs(diff) > 0.008) {
      video.currentTime = video.currentTime + diff * 0.6;
    }

    // Only play while actively scrolling
    if (Math.abs(scrollProgress - prev) > 0.0005) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [scrollProgress, texture]);

  // Mouse + Touch parallax
  useFrame(() => {
    if (!meshRef.current) return;

    const targetX = parallaxPos.x * 0.12;
    const targetY = parallaxPos.y * 0.08;

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
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);
  const [parallaxPos, setParallaxPos] = useState({ x: 0, y: 0 });
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setProgress(latest);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  // Unified mouse + touch parallax tracking
  useEffect(() => {
    if (!enabled || reducedMotion) return;

    const updateParallax = (clientX: number, clientY: number) => {
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = -(clientY / window.innerHeight - 0.5) * 2;
      setParallaxPos({ x, y });
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateParallax(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateParallax(touch.clientX, touch.clientY);
      }
    };

    const resetParallax = () => {
      setParallaxPos({ x: 0, y: 0 });
    };

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
        <VideoPlane scrollProgress={progress} texture={texture} parallaxPos={parallaxPos} />
      </Canvas>
    </div>
  );
}
