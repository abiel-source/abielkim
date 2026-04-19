"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeading from "./SectionHeading";
import { universityAchievements, earlyAchievements } from "@/data/achievements";

gsap.registerPlugin(ScrollTrigger);

function AchievementRow({ item }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      gsap.from(ref.current, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 92%" },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="group border-b border-white/[0.04] py-5 last:border-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
        <h3 className="font-mono text-sm font-medium tracking-tight text-white/70 transition-colors group-hover:text-white/90">
          {item.title}
        </h3>
        <span className="font-mono text-[10px] tracking-wider text-white/20">
          {item.timeframe}
        </span>
      </div>
      <p className="mt-0.5 font-mono text-[11px] tracking-wider text-white/25">
        {item.org}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-white/35">{item.detail}</p>
    </div>
  );
}

export default function Achievements() {
  return (
    <section id="achievements" className="relative py-24 md:py-32">
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          label="Achievements"
          title="Awards & Honours"
          subtitle="Academic performance and competitive achievement."
        />

        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="mb-4 font-mono text-[10px] tracking-[0.25em] uppercase text-white/25">
              University
            </p>
            <div>
              {universityAchievements.map((item) => (
                <AchievementRow key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 font-mono text-[10px] tracking-[0.25em] uppercase text-white/25">
              Earlier
            </p>
            <div>
              {earlyAchievements.map((item) => (
                <AchievementRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
