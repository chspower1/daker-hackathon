"use client";

import { useEffect, useRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface DepthSceneProps {
  children: ReactNode;
  className?: string;
}

export function DepthScene({ children, className }: DepthSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;
    let scrollY = window.scrollY;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;

    const updateCSSVars = () => {
      const { innerWidth, innerHeight } = window;
      const scrollHeight = document.documentElement.scrollHeight - innerHeight;
      const scrollProgress = scrollHeight > 0 ? Math.min(Math.max(scrollY / scrollHeight, 0), 1) : 0;

      const nX = (pointerX / innerWidth) * 2 - 1;
      const nY = (pointerY / innerHeight) * 2 - 1;

      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (isReducedMotion) {
        container.style.setProperty("--landing-scroll-progress", "1");
        container.style.setProperty("--landing-scroll-y", "0");
        container.style.setProperty("--landing-pointer-x", "0");
        container.style.setProperty("--landing-pointer-y", "0");
        container.style.setProperty("--landing-tilt-x", "0");
        container.style.setProperty("--landing-tilt-y", "0");
      } else {
        container.style.setProperty("--landing-scroll-progress", scrollProgress.toString());
        container.style.setProperty("--landing-scroll-y", scrollY.toString());

        if (!isCoarse) {
          container.style.setProperty("--landing-pointer-x", nX.toString());
          container.style.setProperty("--landing-pointer-y", nY.toString());
          container.style.setProperty("--landing-tilt-x", (-nY * 8).toString());
          container.style.setProperty("--landing-tilt-y", (nX * 8).toString());
        } else {
          container.style.setProperty("--landing-pointer-x", "0");
          container.style.setProperty("--landing-pointer-y", "0");
          container.style.setProperty("--landing-tilt-x", "0");
          container.style.setProperty("--landing-tilt-y", "0");
        }
      }

      ticking = false;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(updateCSSVars);
        ticking = true;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (!ticking) {
        requestAnimationFrame(updateCSSVars);
        ticking = true;
      }
    };

    const onResize = () => {
      scrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(updateCSSVars);
        ticking = true;
      }
    };

    updateCSSVars();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full min-h-screen", className)}>
      {children}
    </div>
  );
}
