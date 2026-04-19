"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";

const NAV_ITEMS = [
  { label: "Work", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Spotlight", id: "spotlight" },
  { label: "Contact", id: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setHidden(y > lastY.current && y > 300);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const y = window.scrollY + el.getBoundingClientRect().top - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 right-0 left-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-mono text-sm font-medium tracking-tight text-white/90 transition-opacity hover:opacity-70"
        >
          Abiel Kim
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="font-mono text-xs tracking-[0.15em] uppercase text-white/45 transition-colors hover:text-white/80"
            >
              {item.label}
            </button>
          ))}
        </div>

        <MagneticButton
          as="a"
          href="/files/Abiel_Kim_CV_2026.pdf"
          download="Abiel_Kim_CV_2026.pdf"
          className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 font-mono text-xs tracking-wider text-white/80 transition-all hover:border-white/20 hover:bg-white/[0.08]"
        >
          CV
        </MagneticButton>
      </nav>
    </motion.header>
  );
}
