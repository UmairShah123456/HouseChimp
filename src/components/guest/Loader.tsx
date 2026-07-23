"use client";

import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "./loader-animation.json";

/** Lottie loading animation, used as the route-transition fallback. */
export function Loader({ className = "h-20 w-20" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const anim = lottie.loadAnimation({
      container: ref.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData,
    });
    return () => anim.destroy();
  }, []);

  return <div ref={ref} className={className} role="status" aria-label="Loading" />;
}
