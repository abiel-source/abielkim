"use client";

import { useMemo } from "react";
import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { experiences, earlyExperience } from "@/data/experience";

gsap.registerPlugin(ScrollTrigger);

const SKILLS_MAP = {
  sfu: [
    { name: "Python", level: 2 },
    { name: "C++", level: 2 },
    { name: "Algorithms", level: 3 },
    { name: "Machine Learning", level: 1 },
    { name: "Linux", level: 1 },
  ],
  mica: [
    { name: "Python", level: 1 },
    { name: "TensorFlow", level: 3 },
    { name: "Deep Learning", level: 3 },
    { name: "NumPy", level: 2 },
  ],
  "3ag": [
    { name: "Angular", level: 2 },
    { name: "Node.js", level: 2 },
    { name: "Web Dev", level: 3 },
    { name: "JavaScript", level: 3 },
    { name: "PostgreSQL", level: 2 },
  ],
  arlo: [
    { name: "Project Mgmt", level: 2 },
    { name: "Firmware", level: 2 },
    { name: "Hardware", level: 1 },
    { name: "Data Analysis", level: 2 },
    { name: "Documentation", level: 3 },
  ],
};

const ALL_TOTALS = {};
for (const skills of Object.values(SKILLS_MAP)) {
  for (const s of skills) {
    ALL_TOTALS[s.name] = (ALL_TOTALS[s.name] || 0) + s.level;
  }
}
const MAX_VALUE = Math.max(...Object.values(ALL_TOTALS));

function SkillsChart({ revealed }) {
  const accumulated = useMemo(() => {
    const skills = {};
    for (const id of revealed) {
      const entrySkills = SKILLS_MAP[id];
      if (!entrySkills) continue;
      for (const s of entrySkills) {
        skills[s.name] = (skills[s.name] || 0) + s.level;
      }
    }
    return Object.entries(skills)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, [revealed]);

  return (
    <div className="space-y-3">
      <span className="block font-mono text-[10px] tracking-[0.25em] uppercase text-white/20">
        Stack
      </span>

      <AnimatePresence mode="popLayout">
        {accumulated.map(({ name, value }) => (
          <motion.div
            key={name}
            layout
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center gap-3"
          >
            <span className="w-[88px] shrink-0 text-right font-mono text-[10px] tracking-wider text-white/30">
              {name}
            </span>
            <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/[0.04]">
              <motion.div
                className="h-full rounded-full bg-white/25"
                initial={{ width: 0 }}
                animate={{ width: `${(value / MAX_VALUE) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function TimelineEntry({ item, isLast, onReveal }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      gsap.from(ref.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 88%" },
      });

      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 80%",
        once: true,
        onEnter: () => onReveal(item.id),
      });
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      className="grid grid-cols-[44px_1fr] gap-4 md:grid-cols-[56px_1fr]"
    >
      <div className="relative flex flex-col items-center">
        <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-white/50" />
        {!isLast && (
          <div className="mt-1 w-px flex-1 bg-gradient-to-b from-white/10 to-transparent" />
        )}
      </div>

      <div className={isLast ? "" : "pb-10"}>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <h3 className="font-mono text-base font-medium tracking-tight text-white/85 md:text-lg">
            {item.company}
          </h3>
          <span className="font-mono text-[11px] tracking-wider text-white/25">
            {item.timeframe}
          </span>
        </div>

        <p className="mt-0.5 font-mono text-xs tracking-wider text-white/35">
          {item.role}
        </p>

        <ul className="mt-3 space-y-1.5 text-sm leading-[1.8] text-white/40">
          {item.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Experience() {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(new Set());

  const handleReveal = useCallback((id) => {
    setRevealed((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  return (
    <section id="experience" ref={ref} className="relative py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1fr_260px] md:gap-16 lg:grid-cols-[1fr_320px]">
        <div>
          <SectionHeading
            label="Experience"
            title="Background"
            subtitle="Education, professional roles, and early foundations."
          />

          <div>
            {experiences.map((item, i) => (
              <TimelineEntry
                key={item.id}
                item={item}
                isLast={i === experiences.length - 1}
                onReveal={handleReveal}
              />
            ))}
          </div>

          <div className="mt-10 border-t border-white/[0.04] pt-8">
            <p className="mb-5 font-mono text-[10px] tracking-[0.25em] uppercase text-white/20">
              Earlier
            </p>
            <div className="space-y-4">
              {earlyExperience.map((item) => (
                <div key={item.id}>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <span className="font-mono text-sm text-white/60">
                      {item.company}
                    </span>
                    <span className="font-mono text-[10px] tracking-wider text-white/20">
                      {item.timeframe}
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-[11px] text-white/30">
                    {item.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="sticky top-32 pt-36">
            <SkillsChart revealed={revealed} />
          </div>
        </div>
      </div>
    </section>
  );
}
