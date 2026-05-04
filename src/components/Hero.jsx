"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";

const ParticleField = dynamic(() => import("./ParticleField"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-bg" />,
});

const RobotCanvas = dynamic(() => import("./RobotCanvas"), {
  ssr: false,
  loading: () => null,
});

const ROLES = [
  "Software Engineer",
  "Machine Learning Engineer",
  "AI Researcher",
  "Full Stack Developer",
  "Computer Scientist",
  "Curious",
  "Persistent",
  "Ready",
];

export default function Hero() {
  const containerRef = useRef(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    if (!heroReady) return;
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [heroReady]);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.from(".hero-name .rv-char", {
        y: "110%",
        duration: 0.7,
        stagger: 0.03,
        ease: "power3.out",
      })
        .from(
          ".hero-role",
          { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" },
          "-=0.2"
        )
        .to(
          ".hero-scroll",
          { opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.1"
        )
        .call(() => setHeroReady(true));
    },
    { scope: containerRef }
  );

  const name = "Abiel Kim";

  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden"
    >
      {/* Background particle field */}
      <div className="absolute inset-0">
        <ParticleField />
      </div>

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#050505_70%)]"
      />

      {/* Robot \u2014 fills the full section */}
      <div className="absolute inset-0 z-10">
        <RobotCanvas />
      </div>

      {/* Mobile scroll zones: sit above the canvas so touch-starts here reach the page scroller, not WebGL */}
      <div className="pointer-events-auto absolute inset-x-0 top-0 z-[15] h-40 md:hidden" />
      <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-[15] h-40 md:hidden" />

      {/* Name + role overlay at the top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col items-center pt-20 md:pt-24">
        <h1 className="hero-name mb-3 font-mono text-3xl font-extralight tracking-tight sm:text-4xl md:text-5xl">
          {name.split("").map((char, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <span className="rv-char inline-block text-white/90">
                {char === " " ? "\u00A0" : char}
              </span>
            </span>
          ))}
        </h1>

        <div className="hero-role h-5 overflow-hidden md:h-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={roleIndex}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="font-mono text-xs tracking-[0.3em] uppercase text-white/40 md:text-sm"
            >
              {ROLES[roleIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="hero-scroll pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
        style={{ opacity: 0 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/25">
              Scroll
            </span>
            <div className="h-8 w-px bg-gradient-to-b from-white/20 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
