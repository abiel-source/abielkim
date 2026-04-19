"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

export default function Education() {
  const ref = useRef(null);

  useGSAP(
    () => {
      gsap.from(".edu-card", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
        },
      });

      gsap.from(".edu-badge", {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
        },
      });
    },
    { scope: ref },
  );

  return (
    <section id="education" ref={ref} className="relative overflow-hidden py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(800px 300px at 50% 10%, rgba(0,240,255,0.06), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          label="Education"
          title="BSc in Computing Science"
          subtitle="Specialization in Artificial Intelligence — focused on machine learning systems, algorithms, and modern software engineering."
        />

        <div
          className="edu-card mx-auto max-w-3xl rounded-2xl border border-white/[0.06] p-6 sm:p-8"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01))",
            boxShadow: "0 0 50px rgba(0,240,255,0.06)",
          }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="mb-2 font-mono text-xl font-medium tracking-tight text-white/90">
                Simon Fraser University
              </h3>
              <p className="text-sm leading-[1.8] text-white/45">
                Coursework and projects across machine learning, optimization,
                data structures, algorithms, and full-stack product development
                — with an emphasis on practical implementation and clean,
                scalable design.
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <span className="edu-badge rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-white/60 shadow-[0_0_20px_rgba(70,120,255,0.1)]">
                BSc
              </span>
              <span className="edu-badge rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-white/60 shadow-[0_0_20px_rgba(255,70,210,0.08)]">
                AI
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
