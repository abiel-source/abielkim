"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      gestureOrientation: "vertical",
      smoothWheel: true,
      stopInertiaOnNavigate: true,
    });

    return () => {
      lenis.stop();
      lenis.destroy();
    };
  }, []);

  return children;
}
