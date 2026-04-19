// "use client";

// import { useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";
// import SectionHeading from "./SectionHeading";

// gsap.registerPlugin(ScrollTrigger);

// const CARDS = [
//   {
//     company: "Arlo Technologies",
//     role: "Technical Project Manager, Product Engineer Co-Op",
//     stat: "1M+",
//     label: "paid subscribers",
//     description:
//       "Contributed across firmware, hardware, and program operations during a period of rapid growth. Arlo crossed the 1 million paid subscriber milestone while I was there - a threshold they have since surpassed many times over.",
//   },
//   {
//     company: "3AG Systems",
//     role: "Software Engineer",
//     stat: "0",
//     label: "blockers remaining",
//     description:
//       "Stepped into a codebase with persistent, unresolved engineering blockers and cleared them. Delivered working features in Angular and Node.js where progress had previously stalled.",
//   },
//   {
//     company: "MICA Technologies",
//     role: "Machine Learning Engineer",
//     stat: "95%",
//     label: "mIoU accuracy",
//     description:
//       "Remodeled the team's deep learning petrography pipeline for thin-section grain classification, shattering prior accuracy benchmarks and pushing the model into 95% validation accuracy territory.",
//   },
// ];

// export default function Impact() {
//   const sectionRef = useRef(null);

//   useGSAP(
//     () => {
//       const section = sectionRef.current;
//       const cards = gsap.utils.toArray(".impact-card", section);
//       const mm = gsap.matchMedia();

//       mm.add("(min-width: 640px)", () => {
//         gsap.set(cards, {
//           opacity: 0.2,
//           y: 24,
//           scale: 0.96,
//         });

//         gsap.set(cards[0], {
//           opacity: 1,
//           y: 0,
//           scale: 1,
//         });

//         const tl = gsap.timeline({
//           scrollTrigger: {
//             trigger: section,
//             start: "top top",
//             end: "+=140%",
//             pin: true,
//             scrub: 0.35,
//             anticipatePin: 1,
//           },
//         });

//         tl.to(cards[0], {
//           opacity: 1,
//           y: 0,
//           scale: 1,
//           duration: 0.25,
//           ease: "power2.out",
//         })
//           .to(
//             cards[0],
//             {
//               opacity: 0.22,
//               y: 0,
//               scale: 0.96,
//               duration: 0.35,
//               ease: "power2.out",
//             },
//             "+=0.15"
//           )
//           .to(
//             cards[1],
//             {
//               opacity: 1,
//               y: 0,
//               scale: 1,
//               duration: 0.35,
//               ease: "power2.out",
//             },
//             "<"
//           )
//           .to(
//             cards[1],
//             {
//               opacity: 0.22,
//               y: 0,
//               scale: 0.96,
//               duration: 0.35,
//               ease: "power2.out",
//             },
//             "+=0.15"
//           )
//           .to(
//             cards[2],
//             {
//               opacity: 1,
//               y: 0,
//               scale: 1,
//               duration: 0.35,
//               ease: "power2.out",
//             },
//             "<"
//           );
//       });

//       mm.add("(max-width: 639px)", () => {
//         gsap.set(cards, {
//           opacity: 0,
//           y: 32,
//           scale: 0.98,
//         });

//         cards.forEach((card) => {
//           gsap.to(card, {
//             opacity: 1,
//             y: 0,
//             scale: 1,
//             duration: 0.7,
//             ease: "power2.out",
//             scrollTrigger: {
//               trigger: card,
//               start: "top 85%",
//               end: "top 60%",
//               scrub: false,
//               once: true,
//             },
//           });
//         });
//       });

//       return () => mm.revert();
//     },
//     { scope: sectionRef }
//   );

//   return (
//     <section
//       ref={sectionRef}
//       className="relative py-24 sm:flex sm:min-h-screen sm:items-center"
//     >
//       <div className="relative mx-auto w-full max-w-6xl px-6">
//         <SectionHeading
//           label="Impact"
//           title="By the Numbers"
//           subtitle="Measurable outcomes from professional work."
//         />

//         <div className="grid gap-4 sm:grid-cols-3">
//           {CARDS.map((card) => (
//             <div
//               key={card.company}
//               className="impact-card flex flex-col rounded-2xl border border-white/[0.06] p-6 sm:p-8"
//               style={{
//                 background:
//                   "linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
//                 transformOrigin: "center center",
//               }}
//             >
//               <div className="mb-6">
//                 <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/30">
//                   {card.company}
//                 </p>
//                 <p className="mt-0.5 font-mono text-[10px] tracking-wider text-white/20">
//                   {card.role}
//                 </p>
//               </div>

//               <div className="mb-6">
//                 <span className="font-mono text-5xl font-light tracking-tight text-white/90 sm:text-6xl">
//                   {card.stat}
//                 </span>
//                 <p className="mt-1 font-mono text-xs tracking-wider text-white/30">
//                   {card.label}
//                 </p>
//               </div>

//               <p className="mt-auto text-sm leading-[1.8] text-white/35">
//                 {card.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    company: "Arlo Technologies",
    role: "Technical Project Manager, Product Engineer Co-Op",
    stat: "1M+",
    label: "paid subscribers",
    description:
      "Contributed across firmware, hardware, and program operations during a period of rapid growth. Arlo crossed the 1 million paid subscriber milestone while I was there - a threshold they have since surpassed many times over.",
  },
  {
    company: "3AG Systems",
    role: "Software Engineer",
    stat: "0",
    label: "blockers remaining",
    description:
      "Stepped into a codebase with persistent, unresolved engineering blockers and cleared them. Delivered working features in Angular and Node.js where progress had previously stalled.",
  },
  {
    company: "MICA Technologies",
    role: "Machine Learning Engineer",
    stat: "95%",
    label: "mIoU accuracy",
    description:
      "Remodeled the team's deep learning petrography pipeline for thin-section grain classification, shattering prior accuracy benchmarks and pushing the model into 95% validation accuracy territory.",
  },
];

export default function Impact() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const cards = gsap.utils.toArray(".impact-card", section);
      const mm = gsap.matchMedia();

      mm.add("(min-width: 640px)", () => {
        gsap.set(cards, {
          opacity: 0.35,
          y: 12,
          scale: 0.985,
        });

        gsap.set(cards[0], {
          opacity: 1,
          y: 0,
          scale: 1,
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=50%",
            pin: true,
            scrub: 0.12,
            anticipatePin: 1,
            fastScrollEnd: true,
          },
        });

        tl
          // 1 -> 2
          .to(
            cards[0],
            {
              opacity: 0.35,
              y: 6,
              scale: 0.985,
              duration: 0.28,
            },
            0.22
          )
          .to(
            cards[1],
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.28,
            },
            0.22
          )

          // 2 -> 3
          .to(
            cards[1],
            {
              opacity: 0.35,
              y: 6,
              scale: 0.985,
              duration: 0.28,
            },
            0.58
          )
          .to(
            cards[2],
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.28,
            },
            0.58
          );
      });

      mm.add("(max-width: 639px)", () => {
        gsap.set(cards, {
          opacity: 0,
          y: 32,
          scale: 0.98,
        });

        cards.forEach((card) => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 60%",
              scrub: false,
              once: true,
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:flex sm:min-h-screen sm:items-center"
    >
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          label="Impact"
          title="By the Numbers"
          subtitle="Measurable outcomes from professional work."
        />

        <div className="grid gap-4 sm:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.company}
              className="impact-card flex flex-col rounded-2xl border border-white/[0.06] p-6 sm:p-8"
              style={{
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
                transformOrigin: "center center",
              }}
            >
              <div className="mb-6">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/30">
                  {card.company}
                </p>
                <p className="mt-0.5 font-mono text-[10px] tracking-wider text-white/20">
                  {card.role}
                </p>
              </div>

              <div className="mb-6">
                <span className="font-mono text-5xl font-light tracking-tight text-white/90 sm:text-6xl">
                  {card.stat}
                </span>
                <p className="mt-1 font-mono text-xs tracking-wider text-white/30">
                  {card.label}
                </p>
              </div>

              <p className="mt-auto text-sm leading-[1.8] text-white/35">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
