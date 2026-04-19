"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function RevealText({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  stagger = 0.025,
  duration = 0.6,
  scrollTrigger = true,
  splitBy = "char",
}) {
  const containerRef = useRef(null);

  const items =
    splitBy === "char"
      ? text.split("")
      : text.split(" ").map((w, i, arr) => (i < arr.length - 1 ? `${w} ` : w));

  useGSAP(
    () => {
      const chars = containerRef.current.querySelectorAll(".rv-char");
      gsap.from(chars, {
        y: "110%",
        opacity: 0,
        duration,
        stagger,
        ease: "power3.out",
        delay,
        scrollTrigger: scrollTrigger
          ? { trigger: containerRef.current, start: "top 88%" }
          : undefined,
      });
    },
    { scope: containerRef },
  );

  return (
    <Tag ref={containerRef} className={className}>
      {items.map((char, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span className="rv-char inline-block">
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </Tag>
  );
}
