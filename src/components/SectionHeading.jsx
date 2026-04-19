"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function SectionHeading({ label, title, subtitle }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const els = ref.current.querySelectorAll(".sh-anim");
      gsap.from(els, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="mb-16 text-center md:mb-20">
      {label && (
        <span className="sh-anim mb-3 inline-block font-mono text-xs tracking-[0.25em] uppercase text-white/50">
          {label}
        </span>
      )}
      <h2 className="sh-anim font-mono text-3xl font-light tracking-tight text-white/90 sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="sh-anim mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/50 md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
