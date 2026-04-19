"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { projects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const isRecent = project.year === "2026";
  const isOngoing =
    project.status?.toLowerCase().includes("ongoing") ||
    project.status?.toLowerCase().includes("underway");

  useGSAP(
    () => {
      gsap.from(ref.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%" },
      });
    },
    { scope: ref }
  );

  const isLarge = project.size === "large";

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}
      className={isLarge ? "sm:col-span-2 lg:col-span-2" : ""}
    >
      <Link
        href={`/projects/${project.slug}`}
        className={`group relative block h-full rounded-xl border p-5 no-underline transition-all duration-300 sm:p-6 border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.015]`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/25">
            {project.category}
          </span>

          <div className="flex items-center gap-2">
            {isRecent && (
              <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[9px] tracking-wider text-accent/70">
                {project.year}
              </span>
            )}

            {project.status && (
              <span
                className={`flex items-center gap-1 font-mono text-[9px] tracking-wider ${
                  isOngoing ? "text-accent/50" : "text-white/20"
                }`}
              >
                {isOngoing && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/40" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent/60" />
                  </span>
                )}
                {project.status}
              </span>
            )}
          </div>
        </div>

        <h3
          className={`mt-2 font-mono text-base font-medium leading-snug tracking-tight transition-colors md:text-lg ${
            isRecent
              ? "text-white/85 group-hover:text-white"
              : "text-white/75 group-hover:text-white/95"
          }`}
        >
          {project.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-[1.75] text-white/30">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
          {project.tech.map((t) => (
            <span
              key={t}
              className="font-mono text-[10px] tracking-wider text-white/20"
            >
              {t}
            </span>
          ))}
        </div>

        <div
          className={`mt-4 flex items-center gap-1 font-mono text-[11px] transition-colors text-white/20 group-hover:text-white/50`}
        >
          <span>View</span>
          <svg
            className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          label="Projects"
          title="Selected Work"
          subtitle="Technical design, scalable software, and applied ML."
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
