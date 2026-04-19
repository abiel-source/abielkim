"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import Spotlight from "@/components/Spotlight";
import LogoMarquee from "@/components/LogoMarquee";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Achievements from "@/components/Achievements";
import Impact from "@/components/Impact";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), {
  ssr: false,
});

export default function Home() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const el = document.querySelector(hash);
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "instant" });
    });
  }, []);

  return (
    <SmoothScroll>
      <Navbar />
      <main>
        <Hero />
        <Introduction />
        <Impact />
        <Experience />
        <Spotlight />
        <LogoMarquee />
        <Projects />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
