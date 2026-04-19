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
          { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" },
          "-=0.3"
        )
        .from(
          ".hero-desc",
          { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .to(
          ".hero-cta",
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .to(
          ".hero-scroll",
          { opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.2"
        )
        .call(() => setHeroReady(true));
    },
    { scope: containerRef }
  );

  const name = "Abiel Kim";

  return (
    <section
      ref={containerRef}
      className="relative flex h-screen items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <ParticleField />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#050505_70%)]"
      />

      <div className="relative z-10 px-6 text-center">
        <h1 className="hero-name mb-4 font-mono text-5xl font-extralight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          {name.split("").map((char, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <span className="rv-char inline-block text-white/90">
                {char === " " ? "\u00A0" : char}
              </span>
            </span>
          ))}
        </h1>

        <div className="hero-role mb-6 h-6 overflow-hidden md:h-7">
          <AnimatePresence mode="wait">
            <motion.p
              key={roleIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="font-mono text-sm tracking-[0.3em] uppercase md:text-base"
            >
              {ROLES[roleIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <p className="hero-desc mx-auto max-w-lg text-base leading-relaxed text-white/45 md:text-lg">
          Build production grade software. Integrate deep learning pipelines.
          Scale. Optimize. Repeat.
        </p>
        {/* 
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="#contact"
            style={{ opacity: 0, transform: "translateY(20px)" }}
            className="hero-cta rounded-full bg-white/90 px-6 py-2.5 font-mono text-xs font-medium tracking-wider text-black transition-all hover:bg-white"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Contact
          </a>
          <a
            href="#projects"
            style={{ opacity: 0, transform: "translateY(20px)" }}
            className="hero-cta rounded-full border border-white/10 bg-white/[0.04] px-6 py-2.5 font-mono text-xs tracking-wider text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.08]"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            View Work
          </a>
        </div> */}
      </div>

      <div
        className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2"
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
