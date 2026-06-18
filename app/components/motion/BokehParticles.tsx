"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { useScrollStage } from "./ScrollStageContext";

type Particle = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  driftX: number;
  driftY: number;
  phase: number;
};

const ACCENT = { r: 45, g: 106, b: 126 };

function createParticles(count: number, width: number, height: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 28 + Math.random() * 72,
    opacity: 0.06 + Math.random() * 0.06,
    driftX: (Math.random() - 0.5) * 0.12,
    driftY: (Math.random() - 0.5) * 0.1,
    phase: Math.random() * Math.PI * 2,
  }));
}

type BokehParticlesProps = {
  enabled?: boolean;
};

export function BokehParticles({ enabled = true }: BokehParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const scrollStage = useScrollStage();
  const isPausedRef = useRef(false);

  useEffect(() => {
    isPausedRef.current =
      Boolean(scrollStage?.isTransitioning) || document.hidden;
  }, [scrollStage?.isTransitioning]);

  useEffect(() => {
    if (!enabled || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let rafId = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let isMobile = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      isMobile = width < 768;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = isMobile ? 8 : 20;
      particles = createParticles(count, width, height);
    };

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 24;
      targetMouseY = (e.clientY / height - 0.5) * 24;
    };

    const onVisibilityChange = () => {
      isPausedRef.current =
        Boolean(scrollStage?.isTransitioning) || document.hidden;
    };

    const draw = (time: number) => {
      if (isPausedRef.current || document.hidden) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        const t = time * 0.00015;
        const ox = Math.sin(t + p.phase) * 18 + p.driftX * time * 0.02;
        const oy = Math.cos(t * 0.8 + p.phase) * 14 + p.driftY * time * 0.02;
        const px = p.x + ox + (isMobile ? 0 : mouseX * 0.35);
        const py = p.y + oy + (isMobile ? 0 : mouseY * 0.35);

        const gradient = ctx.createRadialGradient(px, py, 0, px, py, p.radius);
        gradient.addColorStop(
          0,
          `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${p.opacity})`,
        );
        gradient.addColorStop(
          0.45,
          `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${p.opacity * 0.35})`,
        );
        gradient.addColorStop(1, `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [enabled, reducedMotion, scrollStage?.isTransitioning]);

  if (!enabled || reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
