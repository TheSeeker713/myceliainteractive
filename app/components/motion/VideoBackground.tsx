"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type VideoPlaneProps = {
  scrollProgress: number;
  texture: THREE.VideoTexture | null;
};

function VideoPlane({ scrollProgress, texture }: VideoPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { viewport } = useThree();

  // Scroll scrubbing with direction detection + lerp
  const prevProgressRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !texture) return;

    const prev = prevProgressRef.current;
    const direction = scrollProgress > prev ? 1 : -1;
    prevProgressRef.current = scrollProgress;

    const duration = video.duration || 10;
    const targetTime = scrollProgress * duration;

    // Improved lerp based on direction
    const lerpFactor = direction > 0 ? 0.18 : 0.22;
    video.currentTime = THREE.MathUtils.lerp(
      video.currentTime,
      targetTime,
      lerpFactor
    );

    // Pause when scroll stops
    if (Math.abs(scrollProgress - prev) < 0.001) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }, [scrollProgress, texture]);

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
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setProgress(latest);
    });
    return unsubscribe;
  }, [scrollYProgress]);

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
    };

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
      }
      if (texture) {
        texture.dispose();
      }
    };
  }, []);

  if (!enabled || reducedMotion) return null;

  return (
    <div className="fixed inset-0 z-[-10] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: false }}
      >
        <VideoPlane scrollProgress={progress} texture={texture} />
      </Canvas>
    </div>
  );
}
