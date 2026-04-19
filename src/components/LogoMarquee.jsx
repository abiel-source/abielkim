"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  SiPython,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiPostgresql,
  SiTensorflow,
  SiPytorch,
  SiDocker,
  SiGit,
  SiTailwindcss,
  SiCplusplus,
  SiNumpy,
  SiOpengl,
  SiZod,
  SiRedis,
  SiMongodb,
  SiMongoose,
  SiGoogle,
  SiCloudinary,
  SiHuggingface,
  SiKaggle,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  { name: "Python", icon: SiPython },
  { name: "React", icon: SiReact },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "TensorFlow", icon: SiTensorflow },
  { name: "PyTorch", icon: SiPytorch },
  { name: "Docker", icon: SiDocker },
  { name: "Git", icon: SiGit },
  { name: "AWS", icon: FaAws },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "C++", icon: SiCplusplus },
  { name: "NumPy", icon: SiNumpy },
  { name: "OpenGL", icon: SiOpengl },
  { name: "Zod", icon: SiZod },
  { name: "Zustand", icon: null },
  { name: "Redis", icon: SiRedis },
  { name: "MongoDB", icon: SiMongodb },
  { name: "Mongoose", icon: SiMongoose },
  { name: "Google Auth", icon: SiGoogle },
  { name: "Cloudinary", icon: SiCloudinary },
  { name: "Hugging Face", icon: SiHuggingface },
  { name: "Kaggle", icon: SiKaggle },
  { name: "OpenBCI", icon: null },
  { name: "Recharts", icon: null },
  { name: "Matplotlib", icon: null },
];

function MarqueeRow({ speed = 40, reverse = false }) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#050505] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#050505] to-transparent" />

      <div
        className="flex min-w-max shrink-0 flex-nowrap"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
          willChange: "transform",
        }}
      >
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <div key={i} className="flex shrink-0 items-center gap-2 px-5 py-3 md:px-7">
            {item.icon ? (
              <item.icon className="h-3.5 w-3.5 text-white/15" />
            ) : (
              <span className="flex h-3.5 w-3.5 items-center justify-center font-mono text-[8px] font-bold text-white/15">
                {item.name.charAt(0)}
              </span>
            )}
            <span className="whitespace-nowrap font-mono text-xs tracking-[0.15em] uppercase text-white/20">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LogoMarquee() {
  const ref = useRef(null);

  useGSAP(
    () => {
      gsap.from(ref.current, {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 92%" },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="border-y border-white/[0.03] py-2">
      <MarqueeRow speed={50} />
      <MarqueeRow speed={45} reverse />
    </section>
  );
}
