"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Introduction() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 78%" },
      });

      tl.from(".intro-left .intro-line", {
        y: "110%",
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      }).from(
        ".intro-right > *",
        { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" },
        "-=0.5"
      );
    },
    { scope: ref }
  );

  return (
    <section id="intro" ref={ref} className="relative py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:gap-20">
        <div className="intro-left flex flex-col justify-center">
          <div className="space-y-1">
            {["Be a co-author", "of the next", "chapter."].map((line, i) => (
              <div key={i} className="overflow-hidden">
                <p className="intro-line font-mono text-4xl font-extralight leading-tight tracking-tight text-white/85 sm:text-5xl md:text-[3.5rem]">
                  {line}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 h-px w-16 bg-white/10" />
        </div>

        <div className="intro-right flex flex-col justify-center">
          <span className="mb-3 font-mono text-xs tracking-[0.25em] uppercase text-white/30">
            Prologue
          </span>

          <h2 className="mb-6 font-mono text-xl font-medium tracking-tight text-white/80 sm:text-2xl">
            Origin Story
          </h2>

          <div className="space-y-4 text-sm leading-[1.9] text-white/40 md:text-[15px]">
            <p>
              In 1963, the design for a new provicinal university was selected-
              masterplanned by Arthur Erickson and Geoffrey Massey. A singular,
              unified megastructure engendered by brutalist architecture. The
              object of the acropolis was clear- reject ornament, remain true to
              the material.
            </p>
            <p>
              By remaining exposed and unadorned, the beauty of the campus is
              subtly revealed, not applied. It emerges from function, purpose,
              and structural rhythm- not superimposed decoration. Consider, for
              instance, the way light strikes the concrete surfaces and
              scatters, or, the harmony of negative spaces which allow for
              contemplation in either company or solitude.
            </p>
            <p>
              Since graduation, I have left SFU- but its corridors, concrete
              pillars, and brutalist forms have not left me. From it, I carry
              the essence of Erickson's raw vision- the pursuit of truth,
              function, and clarity.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px] tracking-wider text-white/25">
            <span>SWE</span>
            <span>MLE</span>
            <span>Theory</span>
            <span>Application</span>
          </div>
        </div>
      </div>
    </section>
  );
}
