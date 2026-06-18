"use client";

import { useScroll } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { FoldLayer } from "./FoldLayer";
import { FoldSceneProvider } from "./FoldSceneContext";
import { StaticSection } from "./StaticSection";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export type ScrollFoldLayout = "plain" | "cards" | "grid" | "band" | "fade";

type ScrollFoldSceneProps = {
  outgoing?: ReactNode;
  incoming: ReactNode;
  id?: string;
  layout?: ScrollFoldLayout;
  sceneHeight?: string;
  sceneHeightMobile?: string;
  className?: string;
  isFirst?: boolean;
};

export function ScrollFoldScene({
  outgoing,
  incoming,
  id,
  layout = "plain",
  sceneHeight = "180vh",
  sceneHeightMobile = "140vh",
  className,
  isFirst = false,
}: ScrollFoldSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  if (reducedMotion) {
    if (isFirst) {
      return (
        <section
          id={id}
          className={cn("studio-section py-12 sm:py-16 scroll-mt-24 site-gutter", className)}
        >
          {incoming}
        </section>
      );
    }
    return (
      <StaticSection outgoing={outgoing} incoming={incoming} id={id} className={className} />
    );
  }

  const height = isMobile ? sceneHeightMobile : sceneHeight;
  const variant =
    layout === "band" ? "band" : layout === "fade" ? "fade" : "fold";
  const enable3D = !isMobile && layout !== "band" && layout !== "fade";

  return (
    <div
      ref={ref}
      id={id}
      className={cn("scroll-fold-scene scroll-mt-24", className)}
      style={{ height } as React.CSSProperties}
      data-fold-layout={layout}
    >
      <div className="scroll-fold-sticky">
        {outgoing && (
          <FoldLayer
            progress={scrollYProgress}
            phase="out"
            variant={variant}
            use3D={enable3D}
            className="z-10"
          >
            <div className="site-gutter w-full">
              <div className="studio-section mx-auto">{outgoing}</div>
            </div>
          </FoldLayer>
        )}
        <FoldLayer
          progress={scrollYProgress}
          phase="in"
          variant={variant}
          use3D={enable3D}
          className={outgoing ? "z-20" : "z-10"}
        >
          <FoldSceneProvider progress={scrollYProgress}>
            <div className="site-gutter w-full h-full flex items-center">
              <div className="studio-section mx-auto w-full">{incoming}</div>
            </div>
          </FoldSceneProvider>
        </FoldLayer>
      </div>
    </div>
  );
}
